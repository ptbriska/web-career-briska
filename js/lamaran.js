/**
 * ==========================================================================
 * BRISKA CAREER - ONLINE APPLICATION FORM HANDLER (js/lamaran.js)
 * Connected to jobs.json (Active Positions) & GAS (Google Apps Script)
 * ==========================================================================
 */

// Ganti URL ini dengan Web App Deployment URL dari Google Apps Script Anda
const GAS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzzSNBW9hxGScRokAoYFozNe6XRNvCxIn6ORkKbHUlh3RF-ANeq7jr3N9eB-siW6OaWYw/exec";

document.addEventListener("DOMContentLoaded", function () {
    const selectPosisi = document.getElementById("posisi_dilamar");
    const selectDept = document.getElementById("departemen");
    const inputKode = document.getElementById("kode_pendaftaran");
    const btnGenerateCode = document.getElementById("btn-generate-code");
    const formLamaran = document.getElementById("form-lamaran");
    const submitStatus = document.getElementById("submit-status");

    const basePath = "../../";

    // 1. Map Singkatan Kode Departemen
    const deptCodeMap = {
        "Kaka Pengajar": "KPG",
        "Technology": "TEC",
        "Production": "PRD",
        "Finance": "FIN",
        "Human Resource": "HRD",
        "Product Research & Development": "RND",
        "Creative Media": "CRM",
        "General Administration": "ADM",
        "Marketing & Sales": "MKT"
    };

    // 2. Fetch Active Jobs from jobs.json
    fetch(`${basePath}data/jobs.json`)
        .then(res => res.json())
        .then(jobs => {
            selectPosisi.innerHTML = '<option value="">-- Pilih Posisi yang Dilamar --</option>';

            // Filter hanya posisi yang status_tersedia === true
            const activeJobs = jobs.filter(j => j.status_tersedia === true);

            if (activeJobs.length === 0) {
                selectPosisi.innerHTML = '<option value="">-- Belum ada lowongan aktif dibuka --</option>';
                return;
            }

            activeJobs.forEach(job => {
                const option = document.createElement("option");
                option.value = `${job.judul} (${job.unit})`;
                option.dataset.unit = job.unit;
                option.dataset.jobId = job.id;
                option.innerText = `${job.judul} - ${job.unit} [${job.tipe}]`;
                selectPosisi.appendChild(option);
            });

            // Auto select posisi jika ada parameter URL ?job_id=...
            const urlParams = new URLSearchParams(window.location.search);
            const targetJobId = urlParams.get("job_id");
            if (targetJobId) {
                const foundJob = activeJobs.find(j => j.id === targetJobId);
                if (foundJob) {
                    selectPosisi.value = `${foundJob.judul} (${foundJob.unit})`;
                }
            }
        })
        .catch(err => {
            console.error("Gagal memuat daftar lowongan:", err);
            selectPosisi.innerHTML = '<option value="">-- Gagal memuat posisi --</option>';
        });

    // 3. Logic Random Code Maker
    function generateRegistrationCode() {
        const selectedDept = selectDept.value;
        if (!selectedDept) {
            alert("Silakan pilih DEPARTEMEN TUJUAN terlebih dahulu sebelum generate kode!");
            selectDept.focus();
            return;
        }

        const deptCode = deptCodeMap[selectedDept] || "GEN";
        const randomNumber = Math.floor(1000 + Math.random() * 9000); // 4 Digit Random
        const generatedCode = `BRK-${deptCode}-${randomNumber}`;
        
        inputKode.value = generatedCode;
    }

    if (btnGenerateCode) btnGenerateCode.addEventListener("click", generateRegistrationCode);
    if (selectDept) selectDept.addEventListener("change", generateRegistrationCode);

    // 4. Helper Function: Convert File to Base64
    function fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(',')[1]); // Ambil string base64 tanpa header data:application/pdf;base64,
            reader.onerror = error => reject(error);
        });
    }

    // 5. Form Submit Handler
    formLamaran.addEventListener("submit", async function (e) {
        e.preventDefault();

        if (!inputKode.value) {
            generateRegistrationCode();
        }

        const btnSubmit = document.getElementById("btn-submit");
        btnSubmit.disabled = true;
        btnSubmit.innerText = "⏳ Mengunggah Berkas & Mengirim Lamaran...";
        submitStatus.innerHTML = `<span style="color: var(--neon-teal);">Sedang memproses berkas PDF Anda, mohon tunggu...</span>`;

        try {
            // Processing Base64 Files
            const filePengalaman = document.getElementById("file_pengalaman").files[0];
            const fileSuratLamaran = document.getElementById("file_surat_lamaran").files[0];
            const fileCV = document.getElementById("file_cv").files[0];
            const filePortofolio = document.getElementById("file_portofolio").files[0];

            const [base64Pengalaman, base64Surat, base64CV, base64Porto] = await Promise.all([
                fileToBase64(filePengalaman),
                fileToBase64(fileSuratLamaran),
                fileToBase64(fileCV),
                fileToBase64(filePortofolio)
            ]);

            const payload = {
                timestamp: new Date().toISOString(),
                kode_pendaftaran: inputKode.value,
                nama_lengkap: document.getElementById("nama_lengkap").value,
                departemen: selectDept.value,
                alamat_domisili: document.getElementById("alamat_domisili").value,
                email: document.getElementById("email").value,
                no_hp: document.getElementById("no_hp").value,
                posisi_dilamar: selectPosisi.value,
                pendidikan_terakhir: document.getElementById("pendidikan_terakhir").value,
                
                // Base64 & File Metadata
                files: {
                    pengalaman: { name: filePengalaman.name, data: base64Pengalaman },
                    surat_lamaran: { name: fileSuratLamaran.name, data: base64Surat },
                    cv: { name: fileCV.name, data: base64CV },
                    portofolio: { name: filePortofolio.name, data: base64Porto }
                }
            };

            // Post Data to GAS Web App (If URL is default placeholder, show simulated success)
            if (GAS_WEB_APP_URL.includes("YOUR_GOOGLE_APPS_SCRIPT")) {
                console.log("Simulasi payload terkirim ke GAS:", payload);
                setTimeout(() => {
                    submitStatus.innerHTML = `
                        <div style="background: rgba(0, 255, 128, 0.15); border: 1px solid #00ff80; color: #00ff80; padding: 1.2rem; border-radius: 8px; margin-top: 1rem;">
                            ✅ <strong>Pendaftaran Berhasil! (Simulasi Mode)</strong><br>
                            Kode Pendaftaran Anda: <strong>${payload.kode_pendaftaran}</strong>.<br>
                            Bukti pendaftaran telah tersimpan. Silakan simpan Kode Pendaftaran Anda.
                        </div>`;
                    formLamaran.reset();
                    btnSubmit.disabled = false;
                    btnSubmit.innerText = "Kirim Formulir Lamaran Sekarang";
                }, 1500);
                return;
            }

            // Real Production Request to Google Apps Script
            const response = await fetch(GAS_WEB_APP_URL, {
                method: "POST",
                headers: { "Content-Type": "text/plain;charset=utf-8" },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (result.status === "success") {
                submitStatus.innerHTML = `
                    <div style="background: rgba(0, 255, 128, 0.15); border: 1px solid #00ff80; color: #00ff80; padding: 1.2rem; border-radius: 8px; margin-top: 1rem;">
                        🎉 <strong>Lamaran Anda Berhasil Terkirim!</strong><br>
                        Kode Pendaftaran Anda: <strong>${payload.kode_pendaftaran}</strong>.<br>
                        Simpan kode ini untuk keperluan verifikasi. Tim HRD PT Briska akan menghubungi Anda via Email/WhatsApp.
                    </div>`;
                formLamaran.reset();
            } else {
                throw new Error(result.message || "Gagal menyimpan data.");
            }

        } catch (err) {
            console.error("Submission Error:", err);
            submitStatus.innerHTML = `<span style="color: #ff4d4d;">❌ Terjadi kesalahan saat mengirim lamaran: ${err.message}. Pastikan ukuran PDF di bawah 5MB.</span>`;
        } finally {
            btnSubmit.disabled = false;
            btnSubmit.innerText = "Kirim Formulir Lamaran Sekarang";
        }
    });
});
