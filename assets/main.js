(function () {
  var S = window.SITE;

  // isi nama brand & tautan WhatsApp di semua halaman
  document.querySelectorAll("[data-brand]").forEach(function (el) { el.textContent = S.brand; });
  document.querySelectorAll("[data-wa]").forEach(function (el) {
    el.href = window.waLink(el.getAttribute("data-wa") || "Halo " + S.brand + ", saya mau tanya soal undangan digital.");
    el.target = "_blank"; el.rel = "noopener";
  });
  document.title = S.brand + " — Undangan Digital";

  // daftar tema
  var grid = document.getElementById("themeGrid");
  var filters = document.getElementById("filters");
  if (!grid) return;

  var cats = ["Semua"];
  window.THEMES.forEach(function (t) { if (cats.indexOf(t.category) < 0) cats.push(t.category); });

  function render(cat) {
    grid.innerHTML = "";
    window.THEMES.filter(function (t) { return cat === "Semua" || t.category === cat; })
      .forEach(function (t) {
        var wa = window.waLink("Halo " + S.brand + ", saya tertarik dengan tema \"" + t.name + "\". Bisa dibantu?");
        var el = document.createElement("article");
        el.className = "card";
        el.innerHTML =
          '<div class="thumb th-' + t.slug + (t.img ? ' has-img' : '') + '"' + (t.img ? ' style="background-image:linear-gradient(180deg,rgba(0,0,0,.05) 30%,rgba(0,0,0,.65)),url(\'' + t.img + '\')"' : '') + '>' +
            '<span class="tag">' + t.category + '</span>' +
            '<small>UNDANGAN</small><b>' + t.name + '</b><small>CONTOH TEMA</small>' +
            '<i>Buka Undangan</i>' +
          '</div>' +
          '<div class="body">' +
            '<h3>' + t.name + '</h3>' +
            '<p>' + t.desc + '</p>' +
            '<div class="price">' + t.price + '</div>' +
            '<div class="actions">' +
              '<a class="btn btn-primary btn-sm" href="demo/' + t.slug + '.html">Lihat Demo</a>' +
              '<a class="btn btn-wa btn-sm" href="' + wa + '" target="_blank" rel="noopener">Pesan</a>' +
            '</div>' +
          '</div>';
        grid.appendChild(el);
      });
  }

  cats.forEach(function (c, i) {
    var b = document.createElement("button");
    b.className = "chip" + (i === 0 ? " on" : "");
    b.textContent = c;
    b.onclick = function () {
      filters.querySelectorAll(".chip").forEach(function (x) { x.classList.remove("on"); });
      b.classList.add("on");
      render(c);
    };
    filters.appendChild(b);
  });
  render("Semua");
})();
