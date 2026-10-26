# Situs Jasa Undangan Digital

Situs statis (HTML/CSS/JS), siap dipasang di GitHub Pages, Cloudflare Pages, atau Netlify.

## Ganti dulu sebelum tayang
Buka `assets/config.js`, lalu ubah:
- `brand`  : nama usaha (sekarang: Kreasi Undangan)
- `wa`     : nomor WhatsApp, awali 62, tanpa 0 atau tanda +

Harga paket ada di `index.html` (bagian `id="harga"`), masih contoh.

## Foto
Foto ada di `assets/foto/` (format webp, sudah dikompres). Ganti file dengan foto milikmu atau foto berlisensi,
pakai nama yang sama, atau ubah alamatnya di `window.DEMO` pada tiap `demo/tema-*.html` dan di `assets/config.js`.

## Alur melayani satu pesanan
1. Buka `admin.html` di situsmu, isi data pesanan (nama, tanggal, tempat, foto, tema).
2. Klik **Pratinjau Undangan** untuk memeriksa tampilannya.
3. Unggah foto pelanggan ke `assets/pelanggan/<kode-pesanan>/` (tombol pintas ada di admin).
4. Salin kode hasilnya dan simpan sebagai `pelanggan/<kode-pesanan>.js` (tombol pintas ada di admin).
5. Kirim **link tamu** (`tamu.html?u=<kode-pesanan>`) ke pelanggan. Di situ pelanggan menulis nama-nama tamunya,
   lalu mendapat link undangan per tamu dan tombol kirim lewat WhatsApp.

Contoh pesanan yang sudah jalan: `pelanggan/contoh-rizky-ayu.js`
- Undangan: `undangan.html?u=contoh-rizky-ayu&to=Bapak%20Ahmad`
- Halaman tamu: `tamu.html?u=contoh-rizky-ayu`

Hapus file contoh dan foto bawaan (`assets/foto/`) sebelum dipakai untuk pelanggan sungguhan jika tidak diperlukan.

## Struktur
```
index.html            halaman utama + daftar tema
undangan.html        undangan asli pelanggan (membaca ?o=kode atau ?d=data)
admin.html           formulir pesanan untuk pemilik usaha
tamu.html            pembuat link nama tamu untuk pelanggan
pesanan/             file data pesanan (<kode>.json)
undangan.html         undangan pelanggan (membaca pelanggan/<kode>.js)
tamu.html             halaman pelanggan untuk membuat link per tamu
admin.html            formulir data pesanan (untuk pemilik usaha)
pelanggan/            satu file data per pesanan
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

## Alur pesanan pelanggan
1. Buka `admin.html` (alamat ini tidak ada di menu situs, simpan sendiri). Isi data pesanan, klik **Buat link**.
2. Kirim ke pelanggan **link pembuat tamu** (`tamu.html?...`). Pelanggan menempel daftar nama tamu dan mengirim link tiap tamu lewat WhatsApp.
3. Link pendek (disarankan): isi kode pesanan, klik **Unduh file pesanan (.json)**, lalu unggah ke folder `pesanan/` di GitHub dengan nama `<kode>.json`.
   Link jadi `undangan.html?o=<kode>` dan `tamu.html?o=<kode>`. Isi undangan bisa diubah kapan saja dengan mengedit file `.json` itu.
4. Foto pelanggan: unggah ke `assets/pesanan/<kode>/` (kompres dulu, sekitar 1200 px, format webp atau jpg), lalu tulis alamatnya di formulir admin.
5. Contoh siap pakai: `undangan.html?o=contoh&to=Ibu%20Siti`.

RSVP pada undangan asli dikirim lewat WhatsApp ke nomor tuan rumah yang diisi di admin. Situs ini statis, jadi daftar ucapan tamu tidak tersimpan di server.
