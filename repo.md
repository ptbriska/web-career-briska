briska-career-web/
│
├── index.html                           # 1. Halaman Utama (Landing Page Karir)
├── style.css                            # Global Stylesheet (Tema, Navbar Dropdown, Component)
│
├── js/                                  # Folder Scripts
│   ├── global.js                        # Handler Navigasi Header/Dropdown, Mobile Menu, Footer
│   ├── lowongan.js                      # Filter Unit Bisnis & Tipe Kerja
│   ├── faq.js                           # Accordion & Search FAQ
│   ├── lamaran.js                       # Validasi & Upload Form Lamaran
│   └── markdown-loader.js               # Helper fetch & render file .md ke HTML rekrutmen
│
├── pages/                               # Modul Halaman Terpisah Per-HTML
│   │
│   ├── tentang/                         # 2. Modul Tentang Briska (Dedicated HTML per Poin A-N)
│   │   ├── etika-kerja.html             # A. Nilai Etika Kerja
│   │   ├── sikap-kerja.html             # B. Nilai Sikap Kerja
│   │   ├── budaya-teknologi.html        # C. Budaya Teknologi
│   │   ├── work-life-balance.html       # D. Budaya Work Life Balance
│   │   ├── genz-company.html            # E. Budaya Gen Z Company
│   │   ├── jam-kerja.html               # F. Jam Kerja
│   │   ├── cuti-izin.html               # G. Proses Cuti & Izin
│   │   ├── outfit-atribut.html          # H. Outfit & Atribut Kerja
│   │   ├── fasilitas-kantor.html        # I. Fasilitas Kantor
│   │   ├── tradisi-kantor.html          # J. Tradisi Kantor
│   │   ├── jabatan-struktural.html      # K. Jabatan Struktural
│   │   ├── jabatan-fungsional.html      # L. Jabatan Fungsional
│   │   ├── transisi-jabatan.html        # M. Transisi Jabatan
│   │   └── skema-promosi.html           # N. Skema Promosi Jabatan
│   │
│   ├── rekrutmen/                       # 3. Modul Proses Rekrutmen (Dedicated HTML per Tahap A-E)
│   │   ├── tahap-1-administrasi.html    # A. Seleksi Tahap 1 Administrasi
│   │   ├── tahap-2-gct-sct.html         # B. Seleksi Tahap 2 GCT & SCT / Project
│   │   ├── tahap-3-kesehatan-wawancara.html # C. Seleksi Tahap 3 Tes Kesehatan & Wawancara
│   │   ├── tahap-4-briskanisasi.html    # D. Seleksi Tahap 4 Onboarding Briskanisasi
│   │   └── tahap-5-pelantikan-mou.html  # E. Pelantikan & MoU / PK Permanen
│   │
│   ├── lowongan/                        # 4. Modul Informasi Lowongan
│   │   └── lowongan.html                # Listing Grid/Table + UI Filter
│   │
│   ├── faq/                             # 5. Modul FAQ Karir
│   │   └── faq.html                     # Halaman FAQ
│   │
│   └── lamaran/                         # 6. Modul Form Online Lamaran
│       └── lamaran.html                 # Form Upload CV, Portofolio, & LinkedIn
│
├── data/                                # Folder Data Sentral (.md & .json)
│   ├── rekrutmen/                       # File Markdown Detail Isi Setiap Tahapan Seleksi
│   │   ├── tahap-1.md
│   │   ├── tahap-2.md
│   │   ├── tahap-3.md
│   │   ├── tahap-4.md
│   │   └── tahap-5.md
│   ├── jobs.json                        # Dataset Lowongan Pekerjaan
│   └── faq.json                         # Dataset Pertanyaan & Jawaban FAQ
│
└── assets/                              # Asset Gambar & File
    ├── images/
    │   ├── logo-briska.png
    │   ├── hero-team.jpg
    │   └── icons/
    └── docs/
