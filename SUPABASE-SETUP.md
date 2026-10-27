# Setup Supabase — RSVP & Buku Tamu

## 1. Buat project
Buka https://supabase.com/dashboard lalu pilih **New project**. Simpan database password dengan aman.

## 2. Buat tabel dan aturan keamanan
Buka **SQL Editor → New query**, salin seluruh isi `supabase/schema.sql`, lalu klik **Run**.

Tabel `guestbook` menerima kiriman RSVP publik. Pembacaan, perubahan, dan penghapusan data hanya diizinkan untuk user yang terdaftar pada `admin_users`. Jangan menonaktifkan Row Level Security.

## 3. Buat akun admin
Di Supabase, buka **Authentication → Users → Add user**. Buat email dan kata sandi admin. Jika tersedia opsi konfirmasi email, gunakan sesuai kebutuhan.
Salin UUID user tersebut. Di SQL Editor jalankan:
```sql
insert into public.admin_users (user_id)
values ('GANTI_DENGAN_UUID_USER_ADMIN');
```
Jangan menambahkan UUID pengguna yang tidak seharusnya mengakses data tamu.

## 4. Isi konfigurasi frontend
Buka **Project Settings → API Keys** (atau API settings). Salin Project URL dan publishable key (project lama mungkin menyebutnya `anon key`).
Isi nilai di `assets/supabase-config.js`. Hanya gunakan publishable/anon key di frontend. **Jangan pernah menggunakan service_role/secret key di GitHub.**

## 5. Buka dashboard
Setelah GitHub Pages selesai deploy, buka:
`https://rahmvn9.github.io/kreasiundangan/buku-tamu.html`
Masuk menggunakan akun admin yang dibuat di langkah 3. RSVP yang masuk akan muncul di sini.

## 6. Identitas undangan
Kiriman disimpan dengan slug undangan yang berasal dari `DEMO.slug` jika tersedia, jika tidak memakai nama mempelai dan tanggal sebagai fallback. Jika mengelola banyak undangan, tetapkan slug unik di data konfigurasi masing-masing undangan dan gunakan slug yang sama pada filter dashboard.

## Catatan
- Perubahan kode ini menyiapkan integrasi; penyimpanan online baru aktif setelah project Supabase dibuat, SQL dijalankan, konfigurasi diisi, dan halaman dipublikasikan.
- Data yang dikirim sebelum integrasi aktif tidak bisa dipulihkan otomatis.
- RSVP akan disimpan ke database dan, bila nomor WhatsApp dikonfigurasi, WhatsApp tetap dibuka sebagai langkah opsional. Tamu masih perlu menekan tombol Kirim di WhatsApp jika ingin mengirim pesan ke tuan rumah.
- Halaman admin statis bukan pengganti autentikasi database. Dashboard ini memakai Supabase Auth dan RLS.
