/* ============================================================
   PENGATURAN UTAMA — cukup ganti di file ini
   ============================================================ */
window.SITE = {
  brand: "Kreasi Undangan",
  tagline: "Undangan digital cantik, jadi dalam 1 hari",
  wa: "6285265907198"                        // nomor WhatsApp, awali 62, tanpa 0 / +
};

window.waLink = function (text) {
  return "https://wa.me/" + window.SITE.wa + "?text=" + encodeURIComponent(text);
};

/* Daftar tema. Mau tambah tema? Salin satu objek, ganti isinya,
   lalu buat file demo/<slug>.html (salin dari demo yang sudah ada).
   img = foto kartu di halaman utama (kosongkan jika tidak ada foto). */
window.THEMES = [
  {
    slug: "tema-elegan-emas",
    name: "Elegan Emas",
    category: "Pernikahan",
    desc: "Biru malam dengan aksen emas. Klasik, mewah, cocok untuk resepsi formal.",
    price: "Mulai Rp 99.000",
    img: "assets/foto/studio-krem.webp"
  },
  {
    slug: "tema-rustic-floral",
    name: "Rustic Floral",
    category: "Pernikahan",
    desc: "Hijau sage dan krem hangat. Lembut, natural, pas untuk acara outdoor.",
    price: "Mulai Rp 99.000",
    img: "assets/foto/taman-putih.webp"
  },
  {
    slug: "tema-maroon-batik",
    name: "Maroon Batik",
    category: "Pernikahan",
    desc: "Merah marun hangat dengan sentuhan batik. Cocok untuk lamaran dan resepsi adat.",
    price: "Mulai Rp 129.000",
    img: "assets/foto/maroon-5.webp"
  },
  {
    slug: "tema-foto-romantis",
    name: "Foto Romantis",
    category: "Pernikahan",
    desc: "Tema foto penuh layar dengan latar berbeda di tiap bagian dan dompet digital.",
    price: "Mulai Rp 129.000",
    img: "assets/foto/studio-krem.webp"
  },
  {
    slug: "tema-ceria-anak",
    name: "Ceria Anak",
    category: "Ulang Tahun",
    desc: "Warna cerah dan bentuk lucu untuk ulang tahun atau khitanan si kecil.",
    price: "Mulai Rp 49.000",
    img: ""
  }
];
