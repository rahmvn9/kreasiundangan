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
4. Pilih salah satu metode berikut. Hasil **Buat Link** juga menyediakan kolom **Nama Tamu** untuk membuat link undangan pendek personal.

### Metode A — link panjang (langsung dapat digunakan)

Admin membuat URL dengan parameter `?d=...` yang berisi data pesanan. Tidak perlu mengunggah file JSON ke GitHub. Kirim link undangan atau link pembuat tamu yang dihasilkan admin.

**Penting — privasi dan penyalahgunaan:** isi parameter `?d=` hanya dikodekan Base64URL, bukan dienkripsi atau ditandatangani. Siapa pun yang memiliki URL dapat membaca data di dalamnya, dan siapa pun dapat menyusun URL dengan data atau foto sendiri yang akan ditampilkan pada domain situs ini. Jangan masukkan nomor identitas, alamat rumah pribadi, atau data sensitif. Untuk pesanan sungguhan, gunakan layanan backend yang memvalidasi data dan memberi akses terbatas; validasi JavaScript di halaman statis tidak dapat membuktikan bahwa data berasal dari admin.

Untuk menyertakan nama tamu di link undangan panjang, gunakan parameter `&to=NamaTamu` (gunakan URL encoding untuk spasi dan karakter khusus). Admin menyediakan kolom **Nama Tamu** dan tombol salin link personal agar parameter ini dibuat otomatis.

**Catatan:** perubahan data tidak otomatis memperbarui link panjang. Buat dan kirim ulang link setelah mengubah data pesanan.

### Metode B — link pendek (memerlukan file JSON)

1. Isi **Kode pesanan** menggunakan huruf kecil, angka, dan tanda strip; contoh `fajar-salsa`.
2. Klik **Unduh file pesanan (.json)**.
3. Unggah file ke folder `pesanan/` di repository dengan nama yang sama persis dengan kode, misalnya `pesanan/fajar-salsa.json`.
4. Setelah file tersedia di situs, link berikut dapat digunakan:
   - `undangan.html?o=fajar-salsa`
   - `tamu.html?o=fajar-salsa`

Untuk link undangan personal, tambahkan nama tamu pada parameter `to`, misalnya:

`undangan.html?o=fajar-salsa&to=Budi%20dan%20Keluarga`

Di Admin Pesanan, masukkan nama pada kolom **Nama Tamu** di bagian hasil **Buat Link**, lalu klik **Salin link undangan nama tamu**. Link personal ini memakai kode pesanan sehingga lebih pendek daripada link panjang `?d=`. Pastikan file JSON sudah diunggah agar link dapat dibuka.

Sebelum membuat link atau mengunduh JSON, admin mencoba memeriksa apakah `pesanan/<kode>.json` sudah ada di repository GitHub. Jika kode sudah terpakai, proses dihentikan agar file lama tidak tertimpa. Pemeriksaan ini memerlukan koneksi internet dan akses GitHub API; pemeriksaan bukan penguncian transaksi, sehingga dua admin yang membuat kode sama pada saat bersamaan tetap perlu menghindarinya.

Setiap pesanan juga memiliki `invitationId` dan `slug` unik untuk memisahkan catatan RSVP di Supabase. Saat mengimpor pesanan lama tanpa ID, sistem membuat ID/slug baru. Catatan RSVP lama tetap menggunakan slug lama dan tidak otomatis dipindahkan.

Jika file belum diunggah atau kode tidak cocok, link pendek tidak dapat memuat data pesanan. Halaman pembuat link tamu akan menampilkan status gagal memuat.

Untuk memperbarui undangan dengan metode ini, unggah versi terbaru file JSON dengan nama yang sama.

## Foto dan musik

- Foto dapat menggunakan file yang sudah ada di situs atau URL HTTPS.
- Contoh path foto pesanan: `assets/pesanan/fajar-salsa/1.webp`. Pastikan file benar-benar diunggah ke path tersebut.
- Foto yang digunakan pada demo diatur melalui `window.DEMO` di file tema dalam folder `demo/`.
- Musik latar bersifat opsional. Periksa bahwa path file MP3 dapat diakses.

Gunakan foto milik sendiri atau yang memiliki izin penggunaan. Jangan menyimpan data pribadi pelanggan di repository publik tanpa persetujuan. **Setiap file di folder `pesanan/` pada repository publik dapat dibaca siapa pun.** Jika file berisi nama, nomor WhatsApp, atau detail acara pelanggan, jangan unggah ke repository publik; gunakan penyimpanan privat/backend. Menghapus file dari versi terbaru tidak otomatis menghapusnya dari riwayat commit Git.

## RSVP dan privasi data

Halaman undangan tetap disajikan sebagai situs statis, tetapi penyimpanan RSVP menggunakan Supabase jika konfigurasi tersedia.

- RSVP dan ucapan dikirim ke tabel `public.guestbook` dengan kolom `invitation_slug`, nama tamu, kehadiran, pesan, dan waktu.
- `invitation_slug` dipakai untuk memisahkan data tiap undangan. Pastikan setiap pesanan menggunakan ID/slug unik; jangan mengubah slug secara manual untuk pesanan yang sudah menerima RSVP.
- Setelah RSVP disimpan, WhatsApp dapat dibuka untuk mengirim konfirmasi kepada tuan rumah. Pengunjung tetap harus menekan tombol **Kirim** di WhatsApp; membuka WhatsApp bukan berarti pesan sudah terkirim.
- Jika Supabase belum dikonfigurasi, fitur penyimpanan RSVP tidak tersedia. Periksa `assets/supabase-config.js` dan jalankan SQL pada `supabase/schema.sql` di Supabase SQL Editor.
- Gunakan hanya Supabase publishable/anon key di file frontend. Jangan pernah memasukkan secret/service-role key.
- Kebijakan RLS pada `supabase/schema.sql` mengizinkan pengunjung mengirim RSVP, sedangkan pembacaan, perubahan, dan penghapusan catatan dibatasi untuk admin yang terdaftar di `public.admin_users`. Halaman undangan publik tidak menampilkan seluruh riwayat buku tamu.
- `buku-tamu.html` digunakan admin untuk melihat dan mengelola catatan setelah login Supabase. Pastikan akun admin telah ditambahkan ke `public.admin_users` sesuai petunjuk SQL.

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
admin.html             formulir pengelolaan pesanan dan link personal
undangan.html          halaman undangan pelanggan; membaca ?d= atau ?o= dan ?to=
tamu.html              pembuat link per tamu; membaca ?d= atau ?o=
buku-tamu.html         panel admin untuk buku tamu (Supabase Auth)
supabase/schema.sql    tabel guestbook, admin_users, dan kebijakan RLS
assets/supabase-config.js konfigurasi URL dan publishable key Supabase
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
