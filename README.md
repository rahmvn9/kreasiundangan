# Situs Jasa Undangan Digital

Situs statis (HTML/CSS/JS), siap dipasang di GitHub Pages, Cloudflare Pages, atau Netlify.

## Ganti dulu sebelum tayang
Buka `assets/config.js`, lalu ubah:
- `brand`  : nama usaha kamu
- `wa`     : nomor WhatsApp, awali 62, tanpa 0 atau tanda +

Harga paket ada di `index.html` (bagian `id="harga"`), masih contoh.

## Struktur
```
index.html            halaman utama + daftar tema
assets/config.js      nama brand, nomor WA, daftar tema
assets/style.css      gaya halaman utama
assets/main.js        mengisi brand/WA dan kartu tema
assets/musik.mp3      (opsional) musik latar demo, tombol musik muncul otomatis jika file ada
demo/demo.css         gaya semua tema demo
demo/demo.js          mesin undangan (sampul, hitung mundur, RSVP)
demo/tema-*.html      satu file per tema demo
```

## Menambah tema baru
1. Salin satu file `demo/tema-*.html`, ganti nama (misal `tema-baru.html`), ubah isi `window.DEMO`.
2. Di `demo/demo.css`, tambah blok warna baru dengan class `.t-namatema` lalu pasang di `<body class="...">`.
3. Di `assets/config.js`, tambah satu objek di `THEMES` (slug = nama file tanpa `.html`).
4. Di `assets/style.css`, tambah satu baris `.th-<slug>{...}` untuk warna kartu tema di halaman utama.

## Nama tamu otomatis
Tambahkan `?to=Nama Tamu` di akhir link demo, contoh:
`demo/tema-elegan-emas.html?to=Bapak%20Ahmad`

## Pasang di GitHub Pages
1. Buat repository Public, unggah semua isi folder ini.
2. Settings → Pages → Branch `main` → Save.
