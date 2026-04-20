// ==========================================
// ATS Resume Optimizer – Dashboard Logic
// ==========================================

const DATA = {
    initial: [
        { job: "J1", score: 77.07 },
        { job: "J2", score: 65.09 },
        { job: "J3", score: 78.19 },
        { job: "J4", score: 77.13 },
        { job: "J5", score: 65.19 },
    ],
    optimized: [
        { job: "J1", initial: 77.07, optimized: 96.44, file: "CV_95Match_J1.docx", cover: "CoverLetter_J1.docx" },
        { job: "J2", initial: 65.09, optimized: 95.71, file: "CV_95Match_J2.docx", cover: "CoverLetter_J2.docx" },
        { job: "J3", initial: 78.19, optimized: 95.36, file: "CV_95Match_J3.docx", cover: "CoverLetter_J3.docx" },
        { job: "J4", initial: 77.13, optimized: 96.47, file: "CV_95Match_J4.docx", cover: "CoverLetter_J4.docx" },
        { job: "J5", initial: 65.19, optimized: 95.51, file: "CV_95Match_J5.docx", cover: "CoverLetter_J5.docx" },
    ],
};

// --- Helpers ---
function getScoreClass(score) {
    if (score >= 90) return "high";
    if (score >= 70) return "medium";
    return "low";
}

function getBadge(score) {
    if (score >= 95) return `<span class="badge pass">✓ ATS Ready</span>`;
    if (score >= 75) return `<span class="badge warn">⚠ Needs Work</span>`;
    return `<span class="badge fail">✗ Low Match</span>`;
}

function createScoreCell(score) {
    const cls = getScoreClass(score);
    return `
        <div class="score-cell">
            <div class="score-bar">
                <div class="score-fill ${cls}" data-width="${score}"></div>
            </div>
            <span class="score-text ${cls}">${score}%</span>
        </div>
    `;
}

function downloadIcon() {
    return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`;
}

function arrowUpIcon() {
    return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>`;
}

// --- Render Stats ---
function renderStats() {
    const container = document.getElementById("stats-row");
    const avgInit = (DATA.initial.reduce((s, d) => s + d.score, 0) / DATA.initial.length).toFixed(1);
    const avgOpt = (DATA.optimized.reduce((s, d) => s + d.optimized, 0) / DATA.optimized.length).toFixed(1);
    const avgImprove = (avgOpt - avgInit).toFixed(1);

    container.innerHTML = `
        <div class="stat-card">
            <div class="stat-label">Jobs Analyzed</div>
            <div class="stat-value accent">${DATA.initial.length}</div>
        </div>
        <div class="stat-card">
            <div class="stat-label">Avg. Initial</div>
            <div class="stat-value amber">${avgInit}%</div>
        </div>
        <div class="stat-card">
            <div class="stat-label">Avg. Optimized</div>
            <div class="stat-value green">${avgOpt}%</div>
        </div>
        <div class="stat-card">
            <div class="stat-label">Avg. Improvement</div>
            <div class="stat-value blue">+${avgImprove}%</div>
        </div>
    `;
}

// --- Render Initial Table ---
function renderInitialTable() {
    const tbody = document.querySelector("#initial-table tbody");
    const sorted = [...DATA.initial].sort((a, b) => b.score - a.score);

    sorted.forEach((row, i) => {
        const tr = document.createElement("tr");
        tr.classList.add("animate-row");
        tr.style.animationDelay = `${i * 0.08}s`;
        tr.innerHTML = `
            <td class="job-name">${row.job}</td>
            <td>${createScoreCell(row.score)}</td>
            <td>${getBadge(row.score)}</td>
        `;
        tbody.appendChild(tr);
    });
}

// --- Render Optimized Table ---
function renderOptimizedTable() {
    const tbody = document.querySelector("#optimized-table tbody");
    const sorted = [...DATA.optimized].sort((a, b) => b.optimized - a.optimized);

    sorted.forEach((row, i) => {
        const improvement = (row.optimized - row.initial).toFixed(1);
        const tr = document.createElement("tr");
        tr.classList.add("animate-row");
        tr.style.animationDelay = `${i * 0.08}s`;
        tr.innerHTML = `
            <td class="job-name">${row.job}</td>
            <td>${createScoreCell(row.initial)}</td>
            <td>${createScoreCell(row.optimized)}</td>
            <td>
                <span class="improvement">
                    ${arrowUpIcon()}
                    +${improvement}%
                </span>
            </td>
            <td>
                <a href="/download/${row.file}" class="btn btn-download" id="btn-cv-${row.job}">
                    ${downloadIcon()} Resume
                </a>
            </td>
            <td>
                <a href="/download/${row.cover}" class="btn btn-cover" id="btn-cl-${row.job}">
                    ${downloadIcon()} Cover Letter
                </a>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// --- Animate Score Bars ---
function animateScoreBars() {
    setTimeout(() => {
        document.querySelectorAll(".score-fill").forEach((bar) => {
            const width = bar.getAttribute("data-width");
            bar.style.width = width + "%";
        });
    }, 200);
}

// --- Init ---
document.addEventListener("DOMContentLoaded", () => {
    renderStats();
    renderInitialTable();
    renderOptimizedTable();
    animateScoreBars();
});
