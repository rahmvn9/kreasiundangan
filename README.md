# Kreasi Undangan Digital

Situs statis berbasis HTML, CSS, dan JavaScript. Dapat dipasang di GitHub Pages, Cloudflare Pages, atau Netlify.

## Sebelum tayang

Buka `assets/config.js`, lalu ubah:
- `brand`: nama usaha.
- `wa`: nomor WhatsApp usaha, awali dengan kode negara (contoh Indonesia: `62`), tanpa tanda `+`.

Harga paket contoh berada di `index.html`. Periksa dan ubah sebelum situs dipublikasikan.

## Alur membuat undangan

1. Buka `admin.html` di situs. Halaman admin tidak ditautkan dari menu utama; simpan alamatnya secara pribadi.
2. Isi data pesanan, lalu klik **Buat link**.
3. Gunakan **Pratinjau** untuk memeriksa undangan sebelum dikirim.
4. Pilih salah satu metode berikut.

### Metode A — link panjang (langsung dapat digunakan)

Admin membuat URL dengan parameter `?d=...` yang berisi data pesanan. Tidak perlu mengunggah file JSON ke GitHub. Kirim link undangan atau link pembuat tamu yang dihasilkan admin.

**Penting — privasi dan penyalahgunaan:** isi parameter `?d=` hanya dikodekan Base64URL, bukan dienkripsi atau ditandatangani. Siapa pun yang memiliki URL dapat membaca data di dalamnya, dan siapa pun dapat menyusun URL dengan data atau foto sendiri yang akan ditampilkan pada domain situs ini. Jangan masukkan nomor identitas, alamat rumah pribadi, atau data sensitif. Untuk pesanan sungguhan, gunakan layanan backend yang memvalidasi data dan memberi akses terbatas; validasi JavaScript di halaman statis tidak dapat membuktikan bahwa data berasal dari admin.

Untuk menyertakan nama tamu di link undangan, tambahkan parameter `&to=NamaTamu` (gunakan URL encoding untuk spasi dan karakter khusus).

**Catatan:** perubahan data tidak otomatis memperbarui link panjang. Buat dan kirim ulang link setelah mengubah data pesanan.

### Metode B — link pendek (memerlukan file JSON)

1. Isi **Kode pesanan** menggunakan huruf kecil, angka, dan tanda strip; contoh `fajar-salsa`.
2. Klik **Unduh file pesanan (.json)**.
3. Unggah file ke folder `pesanan/` di repository dengan nama yang sama persis dengan kode, misalnya `pesanan/fajar-salsa.json`.
4. Setelah file tersedia di situs, link berikut dapat digunakan:
   - `undangan.html?o=fajar-salsa`
   - `tamu.html?o=fajar-salsa`

Jika file belum diunggah atau kode tidak cocok, link pendek tidak dapat memuat data pesanan. Halaman pembuat link tamu akan menampilkan status gagal memuat.

Untuk memperbarui undangan dengan metode ini, unggah versi terbaru file JSON dengan nama yang sama.

## Foto dan musik

- Foto dapat menggunakan file yang sudah ada di situs atau URL HTTPS.
- Contoh path foto pesanan: `assets/pesanan/fajar-salsa/1.webp`. Pastikan file benar-benar diunggah ke path tersebut.
- Foto yang digunakan pada demo diatur melalui `window.DEMO` di file tema dalam folder `demo/`.
- Musik latar bersifat opsional. Periksa bahwa path file MP3 dapat diakses.

Gunakan foto milik sendiri atau yang memiliki izin penggunaan. Jangan menyimpan data pribadi pelanggan di repository publik tanpa persetujuan. **Setiap file di folder `pesanan/` pada repository publik dapat dibaca siapa pun.** Jika file berisi nama, nomor WhatsApp, atau detail acara pelanggan, jangan unggah ke repository publik; gunakan penyimpanan privat/backend. Menghapus file dari versi terbaru tidak otomatis menghapusnya dari riwayat commit Git.

## RSVP dan privasi data

Situs ini bersifat statis; tidak ada backend untuk menyimpan RSVP atau ucapan secara permanen.

- Pada undangan pelanggan, RSVP disiapkan untuk dikirim melalui WhatsApp ke nomor tuan rumah yang diisi di admin.
- Pengunjung masih perlu menekan tombol **Kirim** di WhatsApp. Membuka WhatsApp bukan berarti pesan sudah terkirim.
- Jika nomor WhatsApp tuan rumah belum diatur, pengunjung akan diberi tahu bahwa RSVP belum terkirim.
- Pada halaman demo, ucapan hanya ditampilkan sementara di browser dan tidak disimpan ke server.

## Membuat tema baru (pengelola)

1. Buka `dashboard-tema.html`, halaman pembuat tema khusus pengelola.
2. Atur warna, font, ornamen, bentuk kartu, dan animasi galeri; pratinjau ponsel berubah langsung.
3. Unduh preset JSON lalu impor di bagian Tema pada `admin.html` untuk menerapkan pengaturan visual ke pesanan.
4. Untuk menerbitkan tema permanen ke katalog, unduh CSS dan tambahkan ke `demo/demo.css`, buat halaman demo dari `demo/tema-*.html`, lalu perbarui `assets/config.js` dan `assets/style.css`.

Dashboard berjalan statis: draft tersimpan hanya di browser perangkat tersebut. Ekspor menghasilkan file preset/CSS; tidak otomatis menulis ke GitHub atau menerbitkan tema untuk semua pengunjung. Halaman statis yang tidak ditautkan tetap bisa dibuka siapa pun yang mengetahui URL, jadi ini bukan sistem autentikasi privat.

## Nama tamu pada demo

Gunakan parameter `to` pada URL, misalnya:

`demo/tema-elegan-emas.html?to=Bapak%20Ahmad`

## Struktur utama

```
index.html             halaman utama dan daftar tema
admin.html             formulir pengelolaan pesanan
undangan.html          halaman undangan pelanggan; membaca ?d= atau ?o=
tamu.html              pembuat link per tamu; membaca ?d= atau ?o=
pesanan/<kode>.json    data pesanan untuk link pendek
assets/config.js       konfigurasi brand, WhatsApp, dan tema
assets/style.css       gaya halaman utama
assets/main.js         perilaku halaman utama
demo/demo.js           mesin undangan demo dan pelanggan
demo/demo.css          gaya tema undangan
demo/tema-*.html       halaman tema demo
```

## Pasang di GitHub Pages

1. Pastikan repository berisi seluruh file situs.
2. Buka **Settings → Pages**.
3. Pilih branch `main` dan folder publikasi yang sesuai, lalu simpan.
4. Setelah situs terbit, uji satu link panjang (`?d=`) dan satu link pendek (`?o=`) sebelum digunakan untuk pelanggan.

## Catatan keamanan

`admin.html` adalah halaman statis tanpa autentikasi. Menyembunyikan tautannya dari menu tidak melindungi halaman dari akses publik. Jangan masukkan data sensitif atau mengandalkan halaman ini sebagai sistem administrasi privat.
