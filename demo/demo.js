(function () {
  var D = window.DEMO, S = window.SITE;
  var app = document.getElementById("app");
  var params = new URLSearchParams(location.search);
  var guest = params.get("to") || "Nama Tamu";

  // tanggal acara: selalu 45 hari dari hari ini supaya hitung mundur berjalan
  var target = new Date();
  target.setDate(target.getDate() + (D.daysAhead || 45));
  target.setHours(D.hour || 8, 0, 0, 0);
  var dateStr = new Intl.DateTimeFormat("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(target);
  var names = D.names.join(" & ");

  function esc(s) { var d = document.createElement("div"); d.textContent = s; return d.innerHTML; }

  var people = D.people.map(function (p, i) {
    return (i > 0 && D.kind === "nikah" ? '<div class="amp">&amp;</div>' : "") +
      '<div class="person reveal"><div class="avatar">' + p.icon + '</div><h3>' + esc(p.name) + '</h3><p class="muted">' + esc(p.sub) + '</p></div>';
  }).join("");

  var events = D.events.map(function (e) {
    return '<div class="event reveal"><h3>' + esc(e.title) + '</h3>' +
      '<p class="when">' + esc(dateStr) + '</p><p>' + esc(e.time) + '</p>' +
      '<p><b>' + esc(e.place) + '</b></p><p>' + esc(e.address) + '</p>' +
      '<a class="btn" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(e.place + " " + e.address) + '">📍 Buka Peta</a></div>';
  }).join("");

  var gallery = "";
  for (var i = 1; i <= 6; i++) gallery += '<div><span>' + D.galleryIcon + '<small>FOTO ' + i + '</small></span></div>';

  app.innerHTML =
    '<section class="s hero"><span class="kicker" style="color:inherit">' + esc(D.heading) + '</span>' +
      '<h1>' + esc(names) + '</h1><p class="date">' + esc(dateStr) + '</p></section>' +

    '<section class="s quote"><span class="kicker">' + esc(D.quoteTitle) + '</span>' +
      '<p class="reveal">' + esc(D.quote) + '</p></section>' +

    '<section class="s"><span class="kicker">' + esc(D.peopleTitle) + '</span>' + people + '</section>' +

    '<section class="s count"><span class="kicker">Menuju Hari Bahagia</span>' +
      '<h2 class="title">Hitung Mundur</h2>' +
      '<div class="cd" id="cd"><div><b id="d">0</b><span>Hari</span></div><div><b id="h">0</b><span>Jam</span></div><div><b id="m">0</b><span>Menit</span></div><div><b id="s">0</b><span>Detik</span></div></div></section>' +

    '<section class="s"><span class="kicker">Rangkaian Acara</span><h2 class="title">Waktu &amp; Tempat</h2>' + events + '</section>' +

    '<section class="s gallery"><span class="kicker">Galeri</span><h2 class="title">Momen Kami</h2>' +
      '<p class="muted">Pada undangan asli, kotak ini berisi foto kamu.</p><div class="g">' + gallery + '</div></section>' +

    '<section class="s"><span class="kicker">RSVP</span><h2 class="title">Konfirmasi Kehadiran</h2>' +
      '<p class="muted">Coba isi formulir di bawah. Ini hanya demo, data tidak dikirim ke mana pun.</p>' +
      '<form id="rsvp"><div><label>Nama</label><input name="nama" required value="' + esc(guest === "Nama Tamu" ? "" : guest) + '" placeholder="Nama kamu"></div>' +
      '<div><label>Kehadiran</label><select name="hadir"><option>Hadir</option><option>Tidak Hadir</option><option>Masih Ragu</option></select></div>' +
      '<div><label>Ucapan &amp; Doa</label><textarea name="ucapan" required placeholder="Tulis ucapan..."></textarea></div>' +
      '<button class="btn" type="submit">Kirim Ucapan</button></form>' +
      '<div id="wishes"></div></section>' +

    '<section class="s closing"><span class="kicker" style="color:inherit">Terima Kasih</span>' +
      '<h2 class="title">' + esc(D.closingTitle) + '</h2><p class="muted">' + esc(D.closing) + '</p>' +
      '<p class="credit">Undangan digital oleh ' + esc(S.brand) + '</p></section>' +
    '<div class="pad-bar"></div>';

  // sampul
  var cover = document.createElement("div");
  cover.id = "cover";
  cover.innerHTML = '<div><div class="heading">' + esc(D.heading) + '</div><h1>' + esc(names) + '</h1>' +
    '<p class="date">' + esc(dateStr) + '</p><p class="to">Kepada Yth. Bapak/Ibu/Saudara/i</p>' +
    '<p class="guest">' + esc(guest) + '</p><button class="btn" id="openBtn">Buka Undangan</button></div>';
  document.body.appendChild(cover);
  document.body.classList.add("locked");

  // bar bawah + musik
  var bar = document.createElement("div");
  bar.className = "bar";
  bar.innerHTML = '<a class="back" href="../index.html#tema">← Semua Tema</a>' +
    '<a class="order" target="_blank" rel="noopener" href="' + window.waLink("Halo " + S.brand + ", saya mau pesan tema \"" + D.themeName + "\".") + '">Pesan Tema Ini</a>';
  document.body.appendChild(bar);

  var music = document.createElement("button");
  music.className = "music"; music.textContent = "♪"; music.setAttribute("aria-label", "Musik");
  document.body.appendChild(music);
  var audio = new Audio("../assets/musik.mp3");
  audio.loop = true;
  var hasAudio = true;
  audio.addEventListener("error", function () { hasAudio = false; music.classList.remove("show"); });
  music.onclick = function () {
    if (audio.paused) { audio.play().catch(function () {}); music.classList.add("play"); }
    else { audio.pause(); music.classList.remove("play"); }
  };

  document.getElementById("openBtn").onclick = function () {
    cover.classList.add("open");
    document.body.classList.remove("locked");
    setTimeout(function () { cover.style.display = "none"; }, 950);
    bar.classList.add("show");
    if (hasAudio) {
      audio.play().then(function () { music.classList.add("play"); }).catch(function () {});
      music.classList.add("show");
    }
    window.scrollTo(0, 0);
    observe();
  };

  // hitung mundur
  function tick() {
    var diff = Math.max(0, target - new Date());
    document.getElementById("d").textContent = Math.floor(diff / 864e5);
    document.getElementById("h").textContent = Math.floor(diff / 36e5) % 24;
    document.getElementById("m").textContent = Math.floor(diff / 6e4) % 60;
    document.getElementById("s").textContent = Math.floor(diff / 1e3) % 60;
  }
  tick(); setInterval(tick, 1000);

  // animasi muncul saat di-scroll
  function observe() {
    var els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) { els.forEach(function (e) { e.classList.add("in"); }); return; }
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } });
    }, { threshold: .15 });
    els.forEach(function (e) { io.observe(e); });
  }

  // RSVP demo
  function toast(msg) {
    var t = document.createElement("div");
    t.className = "toast"; t.textContent = msg; document.body.appendChild(t);
    setTimeout(function () { t.classList.add("show"); }, 20);
    setTimeout(function () { t.classList.remove("show"); setTimeout(function () { t.remove(); }, 400); }, 3200);
  }
  document.getElementById("rsvp").addEventListener("submit", function (ev) {
    ev.preventDefault();
    var f = ev.target;
    var w = document.createElement("div");
    w.className = "wish";
    w.innerHTML = "<b>" + esc(f.nama.value) + "</b><em>" + esc(f.hadir.value) + "</em><p>" + esc(f.ucapan.value) + "</p>";
    document.getElementById("wishes").prepend(w);
    f.ucapan.value = "";
    toast("Terkirim! (Ini hanya demo)");
  });
})();
