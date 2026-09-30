/**
 * ==========================================================================
 * BRISKA CAREER - MARKDOWN LOADER HELPER (js/markdown-loader.js)
 * Otomatis memuat dan merender file .md ke kontainer HTML
 * ==========================================================================
 */

(function () {
  "use strict";

  // CDN Marked.js untuk mengonversi Markdown ke HTML
  const MARKED_CDN = "https://cdn.jsdelivr.net/npm/marked/marked.min.js";

  /**
   * Memuat script eksternal secara dinamis jika belum ada di halaman
   */
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      if (window.marked) {
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Gagal memuat library parser: ${src}`));
      document.head.appendChild(script);
    });
  }

  /**
   * Menyesuaikan path file .md berdasarkan kedalaman folder halaman HTML saat ini
   */
  function resolvePath(path) {
    if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("/")) {
      return path;
    }
    const isSubFolder = window.location.pathname.includes("/pages/");
    const basePath = isSubFolder ? "../../" : "./";
    return basePath + path.replace(/^\.\//, "");
  }

  /**
   * Tampilan skeleton loading bertema Glassmorphism Neon
   */
  function renderLoadingState(container) {
    container.innerHTML = `
      <div class="glass-card" style="padding: 2rem; text-align: center; border-color: rgba(0, 255, 213, 0.3);">
        <div style="display: inline-block; width: 36px; height: 36px; border: 3px solid rgba(0, 255, 213, 0.2); border-top-color: var(--neon-teal); border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
        <p style="margin-top: 1rem; color: var(--text-muted); font-size: 0.95rem;">Memuat dokumen informasi...</p>
      </div>
      <style>
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      </style>
    `;
  }

  /**
   * Tampilan error state jika file markdown gagal di-fetch
   */
  function renderErrorState(container, filePath, errorMsg) {
    container.innerHTML = `
      <div class="glass-card" style="padding: 2rem; border-color: rgba(255, 99, 132, 0.4); background: rgba(40, 10, 20, 0.5);">
        <h3 style="color: #ff6b6b; margin-bottom: 0.5rem;">⚠️ Gagal Memuat Informasi</h3>
        <p style="color: var(--text-muted); font-size: 0.9rem;">Tidak dapat mengambil dokumen dari: <code>${filePath}</code></p>
        <p style="color: rgba(255, 255, 255, 0.5); font-size: 0.8rem; margin-top: 0.5rem;">Detail: ${errorMsg}</p>
      </div>
    `;
  }

  /**
   * Memuat dan merender konten markdown ke dalam elemen target
   */
  async function renderMarkdownElement(element) {
    const rawPath = element.getAttribute("data-md-src") || element.getAttribute("data-src");
    if (!rawPath) return;

    const targetPath = resolvePath(rawPath);
    
    // Pastikan kontainer memiliki class md-content untuk styling CSS global
    element.classList.add("md-content");
    renderLoadingState(element);

    try {
      // 1. Pastikan library Marked.js sudah siap
      await loadScript(MARKED_CDN);

      // 2. Fetch file .md
      const response = await fetch(targetPath);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} - ${response.statusText}`);
      }

      const markdownText = await response.text();

      // 3. Konversi Markdown ke HTML
      const parsedHtml = window.marked.parse(markdownText);

      // 4. Render ke HTML
      element.innerHTML = parsedHtml;

      // 5. Post-processing: Tambahkan styling wrapper pada tabel agar responsive
      const tables = element.querySelectorAll("table");
      tables.forEach(table => {
        const wrapper = document.createElement("div");
        wrapper.style.overflowX = "auto";
        wrapper.style.marginBottom = "1.5rem";
        table.parentNode.insertBefore(wrapper, table);
        wrapper.appendChild(table);
      });

    } catch (err) {
      console.error("[MarkdownLoader Error]:", err);
      renderErrorState(element, targetPath, err.message);
    }
  }

  /**
   * Inisialisasi otomatis setelah DOM siap
   */
  function initMarkdownLoader() {
    // Cari semua elemen yang memiliki atribut data-md-src atau data-src
    const markdownContainers = document.querySelectorAll("[data-md-src], [data-src]");
    markdownContainers.forEach(container => {
      renderMarkdownElement(container);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMarkdownLoader);
  } else {
    initMarkdownLoader();
  }
})();
