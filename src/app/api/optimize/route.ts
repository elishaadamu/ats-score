import { NextRequest, NextResponse } from "next/server";
import { promisify } from "util";
import { exec } from "child_process";
import fs from "fs/promises";
import path from "path";

const execAsync = promisify(exec);

export async function POST(req: NextRequest) {
    const tmpDir = path.join(process.cwd(), ".tmp_ats");
    try {
        await fs.mkdir(tmpDir, { recursive: true });

        const formData = await req.formData();
        const resumeFile = formData.get("resume") as File;
        const jdFiles = formData.getAll("jds") as File[];
        const template = formData.get("template") as string || "1";

        if (!resumeFile) {
            return NextResponse.json(
                { error: "A resume file is required." },
                { status: 400 }
            );
        }

        if (!jdFiles || jdFiles.length === 0) {
            return NextResponse.json(
                { error: "At least one job description file is required." },
                { status: 400 }
            );
        }

        // Save resume
        const resumePath = path.join(
            tmpDir,
            `resume_${Date.now()}_${resumeFile.name.replace(/\s+/g, "_")}`
        );
        await fs.writeFile(resumePath, Buffer.from(await resumeFile.arrayBuffer()));

        // Save all JD files
        const jdPaths: string[] = [];
        for (let i = 0; i < jdFiles.length; i++) {
            const jdFile = jdFiles[i];
            const p = path.join(
                tmpDir,
                `jd_${Date.now()}_${jdFile.name.replace(/\s+/g, "_")}`
            );
            await fs.writeFile(p, Buffer.from(await jdFile.arrayBuffer()));
            jdPaths.push(p);
        }

        // Call Python Backend
        const resumeArg = `"${resumePath}"`;
        const jdArgs = jdPaths.map((p) => `"${p}"`).join(" ");
        const outDirArg = `"${tmpDir}"`;

        // Use venv python in production (Docker), regular python3 in dev
        const pythonBin = process.env.NODE_ENV === "production"
            ? "/app/.venv/bin/python3"
            : "python3";

        const cmd = `${pythonBin} ats_backend.py --resume ${resumeArg} --jds ${jdArgs} --outdir ${outDirArg} --template ${template}`;

        const { stdout, stderr } = await execAsync(cmd, {
            timeout: 120000,
            maxBuffer: 1024 * 1024 * 10,
        });

        if (stderr) {
            console.warn("Python stderr:", stderr);
        }

        // Parse JSON output
        const results = JSON.parse(stdout.trim());

        // Attach base64 files to response
        for (const item of results) {
            if (item.resumeFile) {
                try {
                    const docBuffer = await fs.readFile(item.resumeFile);
                    item.resumeBase64 = docBuffer.toString("base64");
                } catch (e) {
                    item.resumeBase64 = null;
                }
            }
            if (item.coverLetterFile) {
                try {
                    const clBuffer = await fs.readFile(item.coverLetterFile);
                    item.coverLetterBase64 = clBuffer.toString("base64");
                } catch (e) {
                    item.coverLetterBase64 = null;
                }
            }
        }

        // Cleanup temp files after a short delay
        setTimeout(async () => {
            try {
                await fs.rm(tmpDir, { recursive: true, force: true });
            } catch (_) {}
        }, 5000);

        return NextResponse.json(results);
    } catch (error: any) {
        console.error("Optimize API Error:", error);

        try {
            await fs.rm(tmpDir, { recursive: true, force: true });
        } catch (_) {}

        const message = error.stderr || error.message || "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
