"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UploadCloud,
  FileText,
  CheckCircle,
  Zap,
  ArrowRight,
  Download,
  BarChart2,
  Layers,
  Mail,
  RotateCcw,
  Sparkles,
} from "lucide-react";

interface Result {
  jobName: string;
  originalScore: number;
  newScore: number;
  keywords: string[];
  resumeBase64: string;
  coverLetterBase64: string;
}

export default function Home() {
  const [resume, setResume] = useState<File | null>(null);
  const [jds, setJds] = useState<File[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [results, setResults] = useState<Result[] | null>(null);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState("1");

  const handleResume = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResume(e.target.files[0]);
    }
  };

  const handleJds = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setJds(Array.from(e.target.files));
    }
  };

  const optimizeResumes = async () => {
    if (!resume || jds.length === 0) {
      alert("Please upload your resume and at least one job description.");
      return;
    }

    setIsOptimizing(true);
    try {
      const formData = new FormData();
      formData.append("resume", resume);
      formData.append("template", selectedTemplate);
      jds.forEach((jd) => formData.append("jds", jd));

      const response = await fetch("/api/optimize", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to optimize");
      }

      const data = await response.json();
      setResults(data);
    } catch (error: any) {
      console.error(error);
      alert(error.message || "An error occurred. Please try again.");
    } finally {
      setIsOptimizing(false);
    }
  };

  const downloadFile = (base64: string, fileName: string) => {
    if (!base64) return;
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-400";
    if (score >= 70) return "text-yellow-400";
    if (score >= 50) return "text-orange-400";
    return "text-red-400";
  };

  const getScoreBg = (score: number) => {
    if (score >= 90) return "bg-emerald-500/10 border-emerald-500/30";
    if (score >= 70) return "bg-yellow-500/10 border-yellow-500/30";
    if (score >= 50) return "bg-orange-500/10 border-orange-500/30";
    return "bg-red-500/10 border-red-500/30";
  };

  return (
    <main className="relative min-h-screen flex flex-col items-center p-6 md:p-12 overflow-x-hidden">
      {/* Background Animated Blobs */}
      <div className="fixed top-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-600 rounded-full mix-blend-multiply filter blur-[120px] opacity-15 animate-blob pointer-events-none" />
      <div className="fixed top-[20%] right-[-10%] w-[600px] h-[600px] bg-blue-600 rounded-full mix-blend-multiply filter blur-[120px] opacity-15 animate-blob animation-delay-2000 pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[30%] w-[400px] h-[400px] bg-cyan-500 rounded-full mix-blend-multiply filter blur-[120px] opacity-10 animate-blob animation-delay-4000 pointer-events-none" />

      <div className="z-10 w-full max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 bg-white/5 px-5 py-2 rounded-full mb-8 border border-white/10 shadow-2xl backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-medium tracking-wide text-gray-300">
              AI-Powered ATS Optimizer · Smart Analysis
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
            Upload. Analyze.{" "}
            <span className="text-gradient">Dominate ATS.</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Upload your <strong className="text-gray-200">resume</strong> and{" "}
            <strong className="text-gray-200">
              multiple job descriptions
            </strong>{" "}
            (PDF or DOCX). Our AI engine extracts keywords, injects them
            into your resume while preserving formatting, targets a{" "}
            <strong className="text-emerald-400">95%+</strong> ATS match score, and
            generates a tailored cover letter for each role.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!results ? (
            /* ==================== UPLOAD SECTION ==================== */
            <motion.div
              key="upload"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: 20 }}
              className="rounded-3xl p-8 md:p-12 mb-10 mx-auto border border-white/10 shadow-2xl bg-white/[0.03] backdrop-blur-xl"
            >
              <div className="grid md:grid-cols-2 gap-8">
                {/* Resume Upload */}
                <div className="relative group">
                  <input
                    id="resume-upload"
                    type="file"
                    accept=".docx,.pdf"
                    onChange={handleResume}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  />
                  <div
                    className={`h-52 rounded-3xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center p-6 text-center ${
                      resume
                        ? "border-blue-400 bg-blue-400/10 shadow-[0_0_30px_rgba(59,130,246,0.15)]"
                        : "border-gray-600 group-hover:border-blue-400 group-hover:bg-blue-400/5"
                    }`}
                  >
                    {resume ? (
                      <>
                        <CheckCircle className="w-12 h-12 text-blue-400 mb-3 drop-shadow-lg" />
                        <p className="text-sm font-bold text-blue-200 truncate w-full">
                          {resume.name}
                        </p>
                        <p className="text-xs text-blue-400/80 mt-1">
                          Resume Ready
                        </p>
                      </>
                    ) : (
                      <>
                        <FileText className="w-14 h-14 text-gray-500 mb-3 group-hover:text-blue-400 transition-all group-hover:scale-110 duration-300" />
                        <h3 className="text-lg font-bold text-gray-200 mb-1">
                          Your Resume
                        </h3>
                        <p className="text-xs text-gray-500">
                          Upload one PDF or Docx
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* Multiple JD Upload */}
                <div className="relative group">
                  <input
                    id="jd-upload"
                    type="file"
                    accept=".docx,.pdf"
                    multiple
                    onChange={handleJds}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  />
                  <div
                    className={`h-52 rounded-3xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center p-6 text-center ${
                      jds.length > 0
                        ? "border-purple-400 bg-purple-400/10 shadow-[0_0_30px_rgba(168,85,247,0.15)]"
                        : "border-gray-600 group-hover:border-purple-400 group-hover:bg-purple-400/5"
                    }`}
                  >
                    {jds.length > 0 ? (
                      <>
                        <Layers className="w-12 h-12 text-purple-400 mb-3 drop-shadow-lg" />
                        <p className="text-lg font-bold text-purple-200">
                          {jds.length} Job Description
                          {jds.length > 1 ? "s" : ""}
                        </p>
                        <p className="text-xs text-purple-400/80 mt-2 truncate w-full max-w-xs">
                          {jds.map((f) => f.name).join(", ")}
                        </p>
                      </>
                    ) : (
                      <>
                        <UploadCloud className="w-14 h-14 text-gray-500 mb-3 group-hover:text-purple-400 transition-all group-hover:scale-110 duration-300" />
                        <h3 className="text-lg font-bold text-gray-200 mb-1">
                          Job Descriptions
                        </h3>
                        <p className="text-xs text-gray-500">
                          Select multiple PDF / Docx
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Template Selection */}
              <div className="mt-8 flex flex-col items-center">
                <label className="text-gray-300 text-sm font-semibold mb-3 tracking-wide">
                  SELECT OUTPUT TEMPLATE
                </label>
                <div className="flex bg-gray-900/50 p-1.5 rounded-full border border-gray-700/50">
                  <button
                    onClick={() => setSelectedTemplate("1")}
                    className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                      selectedTemplate === "1"
                        ? "bg-blue-500 text-white shadow-lg"
                        : "text-gray-400 hover:text-gray-200"
                    }`}
                  >
                    Template 1 (Classic)
                  </button>
                  <button
                    onClick={() => setSelectedTemplate("2")}
                    className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                      selectedTemplate === "2"
                        ? "bg-purple-500 text-white shadow-lg"
                        : "text-gray-400 hover:text-gray-200"
                    }`}
                  >
                    Template 2 (Modern)
                  </button>
                  <button
                    onClick={() => setSelectedTemplate("3")}
                    className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                      selectedTemplate === "3"
                        ? "bg-emerald-500 text-white shadow-lg"
                        : "text-gray-400 hover:text-gray-200"
                    }`}
                  >
                    Template 3 (Executive)
                  </button>
                </div>
              </div>

              {/* CTA Button */}
              <div className="mt-12 flex justify-center">
                <button
                  id="optimize-btn"
                  onClick={optimizeResumes}
                  disabled={!resume || jds.length === 0 || isOptimizing}
                  className={`relative overflow-hidden group px-10 py-4 rounded-full font-bold text-lg tracking-wide transition-all duration-300 ${
                    !resume || jds.length === 0
                      ? "bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700"
                      : "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white hover:scale-105 shadow-[0_0_50px_rgba(139,92,246,0.5)] hover:shadow-[0_0_70px_rgba(139,92,246,0.7)]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isOptimizing ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        <span>AI Engine Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5" />
                        <span>
                          Optimize Against {jds.length > 0 ? jds.length : ""}{" "}
                          Job{jds.length !== 1 ? "s" : ""}
                        </span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </div>
                </button>
              </div>
            </motion.div>
          ) : (
            /* ==================== RESULTS SECTION ==================== */
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full space-y-8"
            >
              {/* Results Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
                <div>
                  <h2 className="text-3xl font-extrabold flex items-center gap-3">
                    <CheckCircle className="w-8 h-8 text-emerald-400 shrink-0" />
                    Analysis Complete
                  </h2>
                  <p className="text-gray-400 mt-2">
                    {results.length} job description
                    {results.length > 1 ? "s" : ""} analyzed. ATS resumes
                    &amp; cover letters generated.
                  </p>
                </div>
                <button
                  id="reset-btn"
                  onClick={() => {
                    setResults(null);
                    setResume(null);
                    setJds([]);
                    setExpandedCard(null);
                  }}
                  className="flex items-center gap-2 text-sm font-semibold text-purple-400 hover:text-purple-300 transition-colors uppercase tracking-widest px-5 py-2.5 border border-purple-500/20 bg-purple-500/10 rounded-xl hover:bg-purple-500/20 shrink-0"
                >
                  <RotateCcw className="w-4 h-4" />
                  Start Over
                </button>
              </div>

              {/* Result Cards */}
              {results.map((res, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.12 }}
                  className="rounded-3xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-lg overflow-hidden"
                >
                  {/* Card Header */}
                  <div
                    className="p-6 md:p-8 cursor-pointer hover:bg-white/[0.02] transition-colors"
                    onClick={() =>
                      setExpandedCard(expandedCard === index ? null : index)
                    }
                  >
                    <div className="flex flex-col md:flex-row gap-6 items-center">
                      {/* Left: Job info */}
                      <div className="flex-1 space-y-3 w-full">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="bg-purple-500/15 text-purple-300 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-widest border border-purple-500/20">
                            Job {index + 1}
                          </span>
                          <h3 className="text-xl font-bold text-gray-100 truncate">
                            {res.jobName}
                          </h3>
                        </div>

                        {/* Download Buttons */}
                        <div className="flex gap-3 flex-wrap pt-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              downloadFile(
                                res.resumeBase64,
                                `ATS_Resume_${res.jobName}.docx`
                              );
                            }}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm px-5 py-2.5 rounded-xl hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(16,185,129,0.3)] transition-all active:scale-95"
                          >
                            <Download className="w-4 h-4" />
                            ATS Resume
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              downloadFile(
                                res.coverLetterBase64,
                                `CoverLetter_${res.jobName}.docx`
                              );
                            }}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm px-5 py-2.5 rounded-xl hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(59,130,246,0.3)] transition-all active:scale-95"
                          >
                            <Mail className="w-4 h-4" />
                            Cover Letter
                          </button>
                        </div>
                      </div>

                      {/* Right: Scores */}
                      <div className="flex gap-4 shrink-0">
                        <div className="flex flex-col justify-center items-center bg-gray-900/60 p-5 rounded-2xl border border-gray-700/50 w-28 shadow-inner">
                          <p className="text-gray-500 text-[10px] font-bold mb-1 uppercase tracking-widest">
                            Initial
                          </p>
                          <div
                            className={`text-2xl font-extrabold ${getScoreColor(
                              res.originalScore
                            )}`}
                          >
                            {res.originalScore}%
                          </div>
                        </div>
                        <div
                          className={`flex flex-col justify-center items-center p-5 rounded-2xl border w-28 relative overflow-hidden ${getScoreBg(
                            res.newScore
                          )}`}
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-emerald-400/10 to-transparent pointer-events-none" />
                          <p className="text-emerald-300 text-[10px] font-bold mb-1 z-10 uppercase tracking-widest">
                            Final
                          </p>
                          <div className="text-2xl font-extrabold text-emerald-400 z-10">
                            {res.newScore}%
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Keywords */}
                  <AnimatePresence>
                    {expandedCard === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 md:px-8 pb-6 md:pb-8 pt-2 border-t border-white/5">
                          <div className="flex items-center gap-2 mb-4">
                            <BarChart2 className="w-5 h-5 text-blue-400" />
                            <h4 className="text-base font-bold text-gray-200">
                              Extracted &amp; Injected Keywords
                            </h4>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {res.keywords.map((kw, i) => (
                              <motion.span
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.03 }}
                                key={i}
                                className="bg-blue-500/10 text-blue-300 border border-blue-500/15 px-3 py-1.5 rounded-lg text-sm"
                              >
                                {kw}
                              </motion.span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="text-center mt-16 mb-8">
          <p className="text-gray-600 text-xs tracking-widest uppercase">
            ATS Max · Pro Analytics · AI Match Engine
          </p>
        </div>
      </div>
    </main>
  );
}
