/**
 * ==========================================================================
 * BRISKA CAREER - MODERN FUTURISTIC JOBBOARD (js/lowongan.js)
 * Sidebar Filter (Unit, Dept, Status) & Modal Detail Markdown Loader
 * ==========================================================================
 */

document.addEventListener("DOMContentLoaded", function () {
    const jobGrid = document.getElementById("job-cards-grid");
    const jobCount = document.getElementById("job-count");
    
    // Filter Elements
    const searchInput = document.getElementById("filter-search");
    const filterUnit = document.getElementById("filter-unit");
    const filterDept = document.getElementById("filter-dept");
    const filterStatus = document.getElementById("filter-status");
    const btnReset = document.getElementById("btn-reset-filter");

    // Modal Elements
    const jobModal = document.getElementById("job-modal");
    const closeModal = document.getElementById("close-modal");
    const modalContent = document.getElementById("modal-markdown-content");
    const modalFooter = document.getElementById("modal-action-footer");

    let jobsData = [];
    const basePath = "../../";

    // 1. Fetch Dataset Jobs JSON
    fetch(`${basePath}data/jobs.json`)
        .then(res => res.json())
        .then(data => {
            jobsData = data;
            renderJobCards(jobsData);
        })
        .catch(err => {
            console.error("Gagal memuat lowongan:", err);
            jobGrid.innerHTML = `<div class="glass-card" style="color:#ff6b6b; text-align:center; grid-column:1/-1;">Gagal memuat data lowongan kerja.</div>`;
        });

    // 2. Render Blok Kartu Lowongan Futuristik
    function renderJobCards(list) {
        jobGrid.innerHTML = "";
        jobCount.innerText = `Menampilkan ${list.length} Lowongan`;

        if (list.length === 0) {
            jobGrid.innerHTML = `
                <div class="glass-card" style="text-align:center; grid-column: 1/-1; padding: 3rem;">
                    <p style="color:var(--text-muted);">Tidak ada lowongan yang sesuai dengan filter pencarian Anda.</p>
                </div>`;
            return;
        }

        list.forEach(job => {
            const card = document.createElement("div");
            card.className = "glass-card job-card-modern";
            card.style.cssText = `
                padding: 1.8rem;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                position: relative;
                transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
                border: 1px solid rgba(0, 255, 213, 0.12);
                background: rgba(10, 25, 47, 0.6);
            `;

            // Status Badge (Aktif vs Ditutup)
            const statusBadge = job.status_tersedia
                ? `<span class="badge" style="background: rgba(0, 255, 128, 0.15); color: #00ff80; border: 1px solid rgba(0, 255, 128, 0.3);">🟢 BUKA</span>`
                : `<span class="badge" style="background: rgba(255, 77, 77, 0.15); color: #ff4d4d; border: 1px solid rgba(255, 77, 77, 0.3);">🔴 DITUTUP</span>`;

            card.innerHTML = `
                <div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem; gap: 0.5rem; flex-wrap: wrap;">
                        <span class="badge badge-unit" style="font-size: 0.75rem;">${job.unit}</span>
                        ${statusBadge}
                    </div>

                    <h3 style="margin: 0.5rem 0; font-size: 1.2rem; line-height: 1.3;" class="text-gradient">${job.judul}</h3>
                    
                    <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 1rem; display: flex; gap: 0.8rem; flex-wrap: wrap;">
                        <span>🏢 ${job.departemen}</span>
                        <span>📍 ${job.lokasi}</span>
                    </div>

                    <p style="font-size: 0.88rem; line-height: 1.5; color: rgba(255,255,255,0.8); margin-bottom: 1.5rem;">
                        ${job.ringkasan}
                    </p>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.05);">
                    <span style="font-size: 0.8rem; color: var(--neon-teal); font-weight: 600;">${job.tipe}</span>
                    <button class="btn-detail-job btn-neon sweep-effect" style="padding: 0.4rem 1rem; font-size: 0.85rem;">Detail Lowongan</button>
                </div>
            `;

            // Hover effect
            card.addEventListener("mouseenter", () => {
                card.style.transform = "translateY(-5px)";
                card.style.borderColor = "var(--neon-teal)";
                card.style.boxShadow = "0 10px 25px rgba(0, 255, 213, 0.15)";
            });
            card.addEventListener("mouseleave", () => {
                card.style.transform = "translateY(0)";
                card.style.borderColor = "rgba(0, 255, 213, 0.12)";
                card.style.boxShadow = "none";
            });

            // Click Handler untuk Buka Modal Detail
            card.querySelector(".btn-detail-job").addEventListener("click", () => {
                openJobModal(job);
            });

            jobGrid.appendChild(card);
        });
    }

    // 3. Fungsi Buka Modal & Load File Markdown
    function openJobModal(job) {
        modalContent.innerHTML = `<div style="text-align:center; padding:3rem;">Memuat detail lowongan...</div>`;
        jobModal.style.display = "flex";

        fetch(`${basePath}data/jobs/${job.md_file}`)
            .then(res => {
                if (!res.ok) throw new Error("Dokumen detail tidak ditemukan");
                return res.text();
            })
            .then(mdText => {
                const parsedHtml = typeof marked !== "undefined" ? marked.parse(mdText) : mdText;
                modalContent.innerHTML = parsedHtml;

                // Set Action Button di Modal
                if (job.status_tersedia) {
                    modalFooter.innerHTML = `
                        <a href="../lamaran/lamaran.html?job_id=${job.id}" class="btn-neon sweep-effect" style="display: inline-block; padding: 0.8rem 2.5rem; text-decoration: none;">
                            Lamar Posisi Ini Sekarang
                        </a>`;
                } else {
                    modalFooter.innerHTML = `
                        <button disabled style="background: rgba(255,255,255,0.1); color: var(--text-muted); border: 1px solid rgba(255,255,255,0.2); padding: 0.8rem 2.5rem; border-radius: 50px; cursor: not-allowed;">
                            Lowongan Ini Sudah Ditutup
                        </button>`;
                }
            })
            .catch(err => {
                modalContent.innerHTML = `<div style="color:#ff6b6b; text-align:center;">Gagal memuat detail lowongan. ${err.message}</div>`;
            });
    }

    // Close Modal Events
    if (closeModal) closeModal.addEventListener("click", () => jobModal.style.display = "none");
    window.addEventListener("click", (e) => { if (e.target === jobModal) jobModal.style.display = "none"; });

    // 4. Filtering Logic (Unit, Dept, Status, & Search)
    function applyFilters() {
        const searchVal = searchInput.value.toLowerCase();
        const unitVal = filterUnit.value;
        const deptVal = filterDept.value;
        const statusVal = filterStatus.value;

        const filtered = jobsData.filter(job => {
            const matchSearch = job.judul.toLowerCase().includes(searchVal) || job.ringkasan.toLowerCase().includes(searchVal);
            const matchUnit = unitVal === "" || job.unit === unitVal;
            const matchDept = deptVal === "" || job.departemen === deptVal;
            const matchStatus = statusVal === "" || String(job.status_tersedia) === statusVal;

            return matchSearch && matchUnit && matchDept && matchStatus;
        });

        renderJobCards(filtered);
    }

    // Event Listeners Filter
    if (searchInput) searchInput.addEventListener("input", applyFilters);
    if (filterUnit) filterUnit.addEventListener("change", applyFilters);
    if (filterDept) filterDept.addEventListener("change", applyFilters);
    if (filterStatus) filterStatus.addEventListener("change", applyFilters);

    if (btnReset) {
        btnReset.addEventListener("click", () => {
            searchInput.value = "";
            filterUnit.value = "";
            filterDept.value = "";
            filterStatus.value = "";
            renderJobCards(jobsData);
        });
    }
});
