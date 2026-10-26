/* ============================================================
   PENGATURAN UTAMA — cukup ganti di file ini
   ============================================================ */
window.SITE = {
  brand: "NamaBrand",                       // ganti dengan nama usaha kamu
  tagline: "Undangan digital cantik, jadi dalam 1 hari",
  wa: "62812XXXXXXXX"                       // nomor WhatsApp, awali 62, tanpa 0 / +
};

window.waLink = function (text) {
  return "https://wa.me/" + window.SITE.wa + "?text=" + encodeURIComponent(text);
};

/* Daftar tema. Mau tambah tema? Salin satu baris, ganti isinya,
   lalu buat file demo/<slug>.html (salin dari demo yang sudah ada). */
window.THEMES = [
  {
    slug: "tema-elegan-emas",
    name: "Elegan Emas",
    category: "Pernikahan",
    desc: "Biru malam dengan aksen emas. Klasik, mewah, cocok untuk resepsi formal.",
    price: "Mulai Rp 99.000"
  },
  {
    slug: "tema-rustic-floral",
    name: "Rustic Floral",
    category: "Pernikahan",
    desc: "Hijau sage dan krem hangat. Lembut, natural, pas untuk acara outdoor.",
    price: "Mulai Rp 99.000"
  },
  {
    slug: "tema-ceria-anak",
    name: "Ceria Anak",
    category: "Ulang Tahun",
    desc: "Warna cerah dan bentuk lucu untuk ulang tahun atau khitanan si kecil.",
    price: "Mulai Rp 49.000"
  }
];
