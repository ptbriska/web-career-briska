/**
 * ==========================================================================
 * BRISKA CAREER - DETAIL JOB PAGE SCRIPT (js/detail-lowongan.js)
 * Reads jobs.json dynamically by URL Parameter ?id=...
 * ==========================================================================
 */

document.addEventListener("DOMContentLoaded", function () {
    const detailContainer = document.getElementById("detail-job-container");
    const basePath = "../../";

    // 1. Ambil Parameter Query ID dari URL
    const urlParams = new URLSearchParams(window.location.search);
    const jobId = urlParams.get("id");

    if (!jobId) {
        renderError("ID Lowongan tidak ditemukan.");
        return;
    }

    // 2. Fetch jobs.json
    fetch(`${basePath}data/jobs.json`)
        .then(res => res.json())
        .then(jobs => {
            const foundJob = jobs.find(j => j.id === jobId);

            if (!foundJob) {
                renderError("Lowongan pekerjaan yang Anda cari tidak ditemukan atau telah dihapus.");
                return;
            }

            renderJobDetail(foundJob);
        })
        .catch(err => {
            console.error("Gagal memuat detail lowongan:", err);
            renderError("Terjadi kesalahan saat memuat data lowongan.");
        });

    // 3. Render Detail ke HTML
    function renderJobDetail(job) {
        // Status Badge
        const statusBadge = job.status_tersedia
            ? `<span class="badge" style="background: rgba(0, 255, 128, 0.15); color: #00ff80; border: 1px solid rgba(0, 255, 128, 0.3);">🟢 BUKA</span>`
            : `<span class="badge" style="background: rgba(255, 77, 77, 0.15); color: #ff4d4d; border: 1px solid rgba(255, 77, 77, 0.3);">🔴 DITUTUP</span>`;

        // Render List Kualifikasi
        const kualifikasiList = job.detail.kualifikasi.map(item => `<li>${item}</li>`).join("");

        // Render List Benefit
        const benefitList = job.detail.benefit.map(item => `<li>${item}</li>`).join("");

        // Render Informasi Tambahan (Jika ada)
        let infoTambahanSection = "";
        if (job.detail.informasi_tambahan && job.detail.informasi_tambahan.length > 0) {
            const infoList = job.detail.informasi_tambahan.map(item => `<li>${item}</li>`).join("");
            infoTambahanSection = `
                <div style="margin-top: 2rem;">
                    <h3 class="text-neon" style="font-size: 1.15rem; margin-bottom: 0.8rem;">📢 Informasi Tambahan Lainnya</h3>
                    <ul style="padding-left: 1.2rem; line-height: 1.7; color: rgba(255,255,255,0.85);">
                        ${infoList}
                    </ul>
                </div>
            `;
        }

        // Render Timeline
        const timelineList = job.detail.timeline.map(item => `
            <div style="display: flex; justify-content: space-between; padding: 0.6rem 0; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 0.9rem;">
                <span style="color: #fff; font-weight: 500;">${item.tahap}</span>
                <span style="color: var(--neon-teal); font-weight: 600;">${item.tanggal}</span>
            </div>
        `).join("");

        // Poster Image Path Handling
        const imagePath = `${basePath}${job.poster_image}`;

        detailContainer.innerHTML = `
            <div class="glass-panel" style="padding: 2.5rem; margin-bottom: 2rem;">
                
                <!-- HEADER DETAIL LOWKER -->
                <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; flex-wrap: wrap; margin-bottom: 1rem;">
                    <div>
                        <span class="badge badge-unit" style="margin-right: 0.5rem;">${job.unit}</span>
                        <span class="badge badge-type">${job.tipe}</span>
                    </div>
                    ${statusBadge}
                </div>

                <h1 class="text-gradient" style="font-size: 2rem; margin-bottom: 0.8rem;">${job.judul}</h1>

                <div style="display: flex; gap: 1.5rem; flex-wrap: wrap; font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1.5rem;">
                    <span>🏢 <strong>Departemen:</strong> ${job.departemen}</span>
                    <span>📍 <strong>Lokasi:</strong> ${job.lokasi}</span>
                    <span style="color: var(--neon-teal);">📅 <strong>Periode:</strong> ${job.periode_pendaftaran.mulai} - ${job.periode_pendaftaran.selesai}</span>
                </div>

                <p style="font-size: 1rem; line-height: 1.6; color: rgba(255,255,255,0.9); margin-bottom: 2rem; background: rgba(0,0,0,0.2); padding: 1.2rem; border-radius: 8px;">
                    ${job.ringkasan}
                </p>

                <!-- GRID CONTENT: GAMBAR POSTER & TIMELINE -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2.5rem; align-items: start;">
                    <div>
                        <img src="${imagePath}" alt="Poster ${job.judul}" onerror="this.onerror=null; this.src='${basePath}assets/images/hero-team.jpg';" style="width: 100%; border-radius: 12px; border: 1px solid rgba(0,255,213,0.2); box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                    </div>

                    <div class="glass-card" style="padding: 1.5rem;">
                        <h3 class="text-neon" style="font-size: 1.1rem; margin-bottom: 1rem;">🗓️ Timeline Rekrutmen</h3>
                        ${timelineList}
                    </div>
                </div>

                <hr style="border-color: rgba(0,255,213,0.1); margin: 2rem 0;">

                <!-- KUALIFIKASI -->
                <div style="margin-bottom: 2rem;">
                    <h3 class="text-neon" style="font-size: 1.15rem; margin-bottom: 0.8rem;">📌 Informasi Kompetensi & Kualifikasi</h3>
                    <ul style="padding-left: 1.2rem; line-height: 1.7; color: rgba(255,255,255,0.85);">
                        ${kualifikasiList}
                    </ul>
                </div>

                <!-- BENEFIT -->
                <div style="margin-bottom: 2rem;">
                    <h3 class="text-neon" style="font-size: 1.15rem; margin-bottom: 0.8rem;">🎁 Benefit & Fasilitas</h3>
                    <ul style="padding-left: 1.2rem; line-height: 1.7; color: rgba(255,255,255,0.85);">
                        ${benefitList}
                    </ul>
                </div>

                <!-- INFORMASI TAMBAHAN -->
                ${infoTambahanSection}

                <!-- TOMBOL ACTION LAMAR -->
                <div style="margin-top: 3rem; padding-top: 2rem; border-top: 1px solid rgba(0,255,213,0.15); text-align: center;">
                    ${job.status_tersedia 
                        ? `<a href="../lamaran/lamaran.html?job_id=${job.id}" class="btn-neon sweep-effect" style="display: inline-block; padding: 1rem 3rem; font-size: 1.1rem; text-decoration: none;">Lamar Posisi Ini Sekarang</a>`
                        : `<button disabled style="background: rgba(255,255,255,0.1); color: var(--text-muted); border: 1px solid rgba(255,255,255,0.2); padding: 1rem 3rem; border-radius: 50px; cursor: not-allowed; font-size: 1rem;">Lowongan Ini Sudah Ditutup</button>`
                    }
                </div>

            </div>
        `;
    }

    function renderError(msg) {
        detailContainer.innerHTML = `
            <div class="glass-panel" style="padding: 3rem; text-align: center; color: #ff6b6b;">
                <h3>⚠️ Perhatian</h3>
                <p>${msg}</p>
                <a href="lowongan.html" class="btn-neon" style="display: inline-block; margin-top: 1rem; text-decoration: none;">Kembali ke Daftar Lowongan</a>
            </div>`;
    }
});
