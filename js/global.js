document.addEventListener("DOMContentLoaded", function () {
    // Menghitung kedalaman folder agar path relatif components selalu tepat
    const isSubFolder = window.location.pathname.includes("/pages/");
    const basePath = isSubFolder ? "../../" : "./";

    // Load Header Component
    const headerContainer = document.getElementById("header-container");
    if (headerContainer) {
        fetch(`${basePath}components/header.html`)
            .then(response => response.text())
            .then(data => {
                // Menyesuaikan path link jika dipanggil dari sub-folder /pages/
                if (isSubFolder) {
                    data = data.replaceAll('href="/', 'href="../../').replaceAll('src="/', 'src="../../');
                } else {
                    data = data.replaceAll('href="/', 'href="./').replaceAll('src="/', 'src="./');
                }
                headerContainer.innerHTML = data;
            })
            .catch(err => console.error("Gagal memuat header:", err));
    }

    // Load Footer Component
    const footerContainer = document.getElementById("footer-container");
    if (footerContainer) {
        fetch(`${basePath}components/footer.html`)
            .then(response => response.text())
            .then(data => {
                if (isSubFolder) {
                    data = data.replaceAll('href="/', 'href="../../');
                } else {
                    data = data.replaceAll('href="/', 'href="./');
                }
                footerContainer.innerHTML = data;
            })
            .catch(err => console.error("Gagal memuat footer:", err));
    }
});
