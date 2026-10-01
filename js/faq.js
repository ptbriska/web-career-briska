/**
 * ==========================================================================
 * BRISKA CAREER - FAQ LOGIC (js/faq.js)
 * Fetching data/faq.json dan handling accordion & search
 * ==========================================================================
 */

document.addEventListener("DOMContentLoaded", function () {
    const faqContainer = document.getElementById("faq-container");
    const searchInput = document.getElementById("faq-search");
    let faqData = [];

    // Menyesuaikan path berdasarkan lokasi pemanggilan file
    const isSubFolder = window.location.pathname.includes("/pages/");
    const basePath = isSubFolder ? "../../" : "./";

    // 1. Fetch JSON Data
    fetch(`${basePath}data/faq.json`)
        .then(response => response.json())
        .then(data => {
            faqData = data;
            renderFAQ(faqData);
        })
        .catch(error => {
            console.error("Gagal memuat FAQ:", error);
            faqContainer.innerHTML = `<div class="glass-card" style="text-align:center; color:#ff6b6b;">Gagal memuat data FAQ. Silakan muat ulang halaman.</div>`;
        });

    // 2. Fungsi Render FAQ ke HTML
    function renderFAQ(dataToRender) {
        faqContainer.innerHTML = ""; // Kosongkan kontainer

        if (dataToRender.length === 0 || dataToRender.every(cat => cat.pertanyaan.length === 0)) {
            faqContainer.innerHTML = `<div class="glass-card" style="text-align:center;">Pencarian tidak ditemukan. Coba kata kunci lain.</div>`;
            return;
        }

        dataToRender.forEach(category => {
            if (category.pertanyaan.length === 0) return; // Skip kategori kosong karena filter

            // Buat Judul Kategori
            const catHeader = document.createElement("h3");
            catHeader.className = "text-neon";
            catHeader.style.margin = "2rem 0 1rem 0";
            catHeader.innerText = category.kategori;
            faqContainer.appendChild(catHeader);

            // Buat Item FAQ (Accordion)
            category.pertanyaan.forEach(item => {
                const faqItem = document.createElement("div");
                faqItem.className = "faq-item glass-panel";
                faqItem.style.marginBottom = "1rem";

                // CSS styling disesuaikan dengan global style.css (faq-question & faq-answer)
                faqItem.innerHTML = `
                    <div class="faq-question" style="border: none;">
                        <span>${item.q}</span>
                        <span class="faq-icon" style="color: var(--neon-teal); font-size: 1.2rem; transition: transform 0.3s;">+</span>
                    </div>
                    <div class="faq-answer" style="display: none; border-top: 1px solid rgba(0, 255, 213, 0.1);">
                        <p>${item.a}</p>
                    </div>
                `;

                // Event Listener Buka/Tutup Accordion
                const questionBtn = faqItem.querySelector(".faq-question");
                const answerBox = faqItem.querySelector(".faq-answer");
                const icon = faqItem.querySelector(".faq-icon");

                questionBtn.addEventListener("click", () => {
                    const isOpen = answerBox.style.display === "block";
                    
                    // Tutup semua yang terbuka (opsional, jika ingin satu saja yang terbuka)
                    document.querySelectorAll(".faq-answer").forEach(ans => ans.style.display = "none");
                    document.querySelectorAll(".faq-icon").forEach(icn => { icn.innerText = "+"; icn.style.transform = "rotate(0deg)"; });

                    if (!isOpen) {
                        answerBox.style.display = "block";
                        icon.innerText = "−";
                        icon.style.transform = "rotate(180deg)";
                        questionBtn.style.color = "var(--neon-teal)";
                    } else {
                        questionBtn.style.color = "var(--text-main)";
                    }
                });

                faqContainer.appendChild(faqItem);
            });
        });
    }

    // 3. Fitur Pencarian / Search Filter
    if (searchInput) {
        searchInput.addEventListener("input", function (e) {
            const keyword = e.target.value.toLowerCase();

            // Filter data secara mendalam (deep filter)
            const filteredData = faqData.map(category => {
                const filteredQuestions = category.pertanyaan.filter(item => 
                    item.q.toLowerCase().includes(keyword) || 
                    item.a.toLowerCase().includes(keyword)
                );
                return { kategori: category.kategori, pertanyaan: filteredQuestions };
            });

            renderFAQ(filteredData);
        });
    }
});
