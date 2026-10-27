(function () {
  var D = window.DEMO, S = window.SITE;
  var LIVE = !!D.live;                                  // true = undangan asli pelanggan
  var B = (D.base != null) ? D.base : "../";            // awalan path ke folder assets
  var app = document.getElementById("app");
  var params = new URLSearchParams(location.search);
  var guest = (params.get("to") || "").trim().slice(0, 60) || "Nama Tamu";

  // aman untuk teks maupun atribut HTML
  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  // hanya izinkan alamat gambar/musik yang wajar
  function safeUrl(u) {
    u = String(u || "").trim();
    if (!u || /^(javascript|data|vbscript):/i.test(u)) return "";
    u = u.replace(/\s/g, "%20");
    if (/["'()<>\\`]/.test(u)) return "";
    return u;
  }
  function waNum(n) {
    n = String(n || "").replace(/\D/g, "");
    if (n.indexOf("0") === 0) n = "62" + n.slice(1);
    return n;
  }

  var target = null;
  if (D.date) { target = new Date(D.date); if (isNaN(target)) target = null; }
  if (!target) {
    target = new Date();
    target.setDate(target.getDate() + (D.daysAhead || 45));
    target.setHours(D.hour || 8, 0, 0, 0);
  }
  function fmt(d) {
    return new Intl.DateTimeFormat("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(d);
  }
  var dateStr = fmt(target);
  var names = (Array.isArray(D.names) ? D.names : []).filter(function (name) { return typeof name === "string" && name.trim(); }).map(function (name) { return name.trim(); }).join(" & ");
  if (LIVE && !names) {
    app.innerHTML = '<div class="msg"><div><h2>Data undangan tidak lengkap</h2><p>Nama pemilik acara belum diisi.</p></div></div>';
    return;
  }
  document.title = (LIVE ? "Undangan " : "Demo ") + names;

  var themeStyle = D.themeStyle || {};
  function readableText(hex) {
    if (typeof hex !== "string" || !/^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(hex)) return "#fff";
    var h = hex.slice(1);
    if (h.length === 3) h = h.split("").map(function (x) { return x + x; }).join("");
    var rgb = [0, 2, 4].map(function (i) { var v = parseInt(h.slice(i, i + 2), 16) / 255; return v <= .04045 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); });
    var luminance = .2126 * rgb[0] + .7152 * rgb[1] + .0722 * rgb[2];
    return luminance > .179 ? "#17211c" : "#fff";
  }
  var styleVars = {accent:"--accent",background:"--bg",alternate:"--alt",ink:"--ink"};
  Object.keys(styleVars).forEach(function(key){
    var value=themeStyle[key];
    if(typeof value==="string" && /^#[0-9a-f]{3,8}$/i.test(value)) document.body.style.setProperty(styleVars[key],value);
  });
  if (typeof themeStyle.accent === "string" && /^#[0-9a-f]{3}(?:[0-9a-f]{3})?$/i.test(themeStyle.accent)) {
    var buttonInk = readableText(themeStyle.accent);
    document.body.style.setProperty("--on-accent", buttonInk);
    document.body.style.setProperty("--cover-btn-ink", buttonInk);
  }
  [["headingFont","--head"],["bodyFont","--body"]].forEach(function(pair){
    var value=themeStyle[pair[0]];
    if(typeof value==="string" && /^(Cormorant Garamond|Montserrat|Lora|Poppins|Fredoka|Nunito|Plus Jakarta Sans|Georgia|Arial|serif|sans-serif)$/i.test(value))
      document.body.style.setProperty(pair[1],"'"+value+"',"+(pair[0]==="headingFont"?"serif":"sans-serif"));
  });
  document.body.classList.remove("ornament-classic","ornament-minimal");
  if(themeStyle.ornament==="none") {
    document.body.classList.add("no-ornament");
  } else {
    document.body.classList.remove("no-ornament");
    if(themeStyle.ornament==="classic") document.body.classList.add("ornament-classic");
    if(themeStyle.ornament==="minimal") document.body.classList.add("ornament-minimal");
  }
  // Apply dashboard preset values to the actual invitation, not just its colors and fonts.
  if(typeof themeStyle.radius==="string" && /^(2|8|20|28)px$/.test(themeStyle.radius)) {
    document.body.style.setProperty("--card-radius",themeStyle.radius);
    document.body.style.setProperty("--field-radius",themeStyle.radius);
  }
  if(["soft","solid","gradient"].indexOf(themeStyle.coverStyle)>=0) {
    var coverBg=themeStyle.coverStyle==="solid" ? themeStyle.background :
      themeStyle.coverStyle==="gradient" ? "linear-gradient(145deg,"+themeStyle.background+","+themeStyle.accent+")" :
      "linear-gradient(160deg,"+themeStyle.background+","+themeStyle.alternate+")";
    if(/^#[0-9a-f]{3,8}$/i.test(themeStyle.background||"") &&
       /^#[0-9a-f]{3,8}$/i.test(themeStyle.alternate||"") &&
       /^#[0-9a-f]{3,8}$/i.test(themeStyle.accent||"")) {
      document.body.style.setProperty("--cover-bg",coverBg);
      document.body.style.setProperty("--hero-bg",coverBg);
      document.body.style.setProperty("--cover-ink",themeStyle.ink);
      document.body.style.setProperty("--cover-btn",themeStyle.accent);
      document.body.style.setProperty("--cover-btn-ink","#fff");
    }
  }

  var people = D.people.map(function (p, i) {
    var portrait=safeUrl(p.photo);
    var avatar=portrait?'<div class="avatar portrait"><img loading="lazy" alt="Foto '+esc(p.name||"mempelai")+'" src="'+esc(portrait)+'"></div>':'<div class="avatar">'+esc(p.icon||"✦")+'</div>';
    return (i > 0 && D.kind === "nikah" ? '<div class="amp">&amp;</div>' : "") +
      '<div class="person reveal">' + avatar + '<h3>' + esc(p.name) + '</h3><p class="muted">' + esc(p.sub) + '</p></div>';
  }).join("");

  var storyItems=(D.loveStory||[]).filter(function(x){return x&&(String(x.title||"").trim()||String(x.text||"").trim())});
  var loveStory=storyItems.length?'<section class="s love-story"><span class="kicker">'+esc(D.loveStoryTitle||"Kisah Kami")+'</span><h2 class="title">'+esc(D.loveStoryHeading||"Love Story")+'</h2><div class="story-list">'+storyItems.map(function(x,i){var photo=safeUrl(x.photo);return '<article class="story-item reveal"><span class="story-mark">'+(i+1)+'</span>'+(photo?'<img loading="lazy" alt="" src="'+esc(photo)+'">':'')+'<div><h3>'+esc(x.title||"")+'</h3><p>'+esc(x.text||"")+'</p>'+(x.date?'<small>'+esc(x.date)+'</small>':'')+'</div></article>'}).join("")+'</div></section>':"";

  var events = D.events.map(function (e) {
    var d = dateStr;
    if (e.date) { var ed = new Date(e.date + "T00:00"); if (!isNaN(ed)) d = fmt(ed); }
    return '<div class="event reveal"><h3>' + esc(e.title) + '</h3>' +
      '<p class="when">' + esc(d) + '</p><p>' + esc(e.time) + '</p>' +
      '<p><b>' + esc(e.place) + '</b></p><p>' + esc(e.address) + '</p>' +
      '<a class="btn" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent((e.place || "") + " " + (e.address || "")) + '">📍 Buka Peta</a></div>';
  }).join("");

  var photos = (D.gallery || []).map(safeUrl).filter(Boolean);
  var galleryAnimation=["fade","zoom","slide"].indexOf(D.galleryAnimation)>=0?D.galleryAnimation:"fade";
  var gallery = "";
  if (photos.length) {
    photos.forEach(function (src, i) {
      gallery += '<div class="ph reveal gallery-' + galleryAnimation + '" style="transition-delay:' + Math.min(i*90,450) + 'ms"><img loading="lazy" alt="Foto ' + (i + 1) + '" src="' + esc(src) + '"></div>';
    });
  } else if (!LIVE) {
    for (var i = 1; i <= 6; i++) gallery += '<div><span>' + esc(D.galleryIcon || "✦") + '<small>FOTO ' + i + '</small></span></div>';
  }
  var coupleSrc = safeUrl(D.coupleImg);
  var couplePhoto = coupleSrc ? '<div class="couple-photo reveal"><img alt="Foto" src="' + esc(coupleSrc) + '"></div>' : "";
  function bgPhoto(src, pos) {
    src = safeUrl(src);
    return src ? ' style="background-image:linear-gradient(180deg,rgba(0,0,0,.35),rgba(0,0,0,.15) 40%,rgba(0,0,0,.65)),url(' + esc(src) + ');background-size:cover;background-position:' + esc(pos || "center top") + '"' : "";
  }

  var gallerySection = gallery
    ? '<section class="s gallery"><span class="kicker">Galeri</span><h2 class="title">Momen Kami</h2>' +
      (LIVE ? "" : '<p class="muted">Pada undangan asli, kotak ini berisi foto pelanggan.</p>') +
      '<div class="g">' + gallery + '</div></section>'
    : "";

  var rsvpNote = LIVE
    ? "Konfirmasi kehadiran dan ucapan akan dikirim lewat WhatsApp ke tuan rumah."
    : "Coba isi formulir di bawah. Ini hanya demo, data tidak dikirim ke mana pun.";

  app.innerHTML =
    '<section class="s hero' + (safeUrl(D.heroImg) ? ' photo' : '') + '"' + bgPhoto(D.heroImg, D.heroPos) + '><span class="kicker" style="color:inherit">' + esc(D.heading) + '</span>' +
      '<h1>' + esc(names) + '</h1><p class="date">' + esc(dateStr) + '</p></section>' +

    '<section class="s quote"><span class="kicker">' + esc(D.quoteTitle) + '</span>' +
      '<p class="reveal">' + esc(D.quote) + '</p></section>' +

    '<section class="s"><span class="kicker">' + esc(D.peopleTitle) + '</span>' + couplePhoto + people + '</section>' +

    '<section class="s count"><span class="kicker">Menuju Hari Bahagia</span>' +
      '<h2 class="title">Hitung Mundur</h2>' +
      '<div class="cd" id="cd"><div><b id="d">0</b><span>Hari</span></div><div><b id="h">0</b><span>Jam</span></div><div><b id="m">0</b><span>Menit</span></div><div><b id="s">0</b><span>Detik</span></div></div></section>' +

    '<section class="s"><span class="kicker">Rangkaian Acara</span><h2 class="title">Waktu &amp; Tempat</h2>' + events + '</section>' +

    loveStory +

    gallerySection +

    '<section class="s"><span class="kicker">RSVP</span><h2 class="title">Konfirmasi Kehadiran</h2>' +
      '<p class="muted">' + esc(rsvpNote) + '</p>' +
      '<form id="rsvp"><div><label>Nama</label><input name="nama" required maxlength="60" value="' + esc(guest === "Nama Tamu" ? "" : guest) + '" placeholder="Nama kamu"></div>' +
      '<div><label>Kehadiran</label><select name="hadir"><option>Hadir</option><option>Tidak Hadir</option><option>Masih Ragu</option></select></div>' +
      '<div><label>Ucapan &amp; Doa</label><textarea name="ucapan" required maxlength="500" placeholder="Tulis ucapan..."></textarea></div>' +
      '<button class="btn" type="submit">' + (LIVE ? "Kirim via WhatsApp" : "Kirim Ucapan") + '</button></form>' +
      '<div id="wishes"></div></section>' +

    '<section class="s closing"><span class="kicker" style="color:inherit">Terima Kasih</span>' +
      '<h2 class="title">' + esc(D.closingTitle) + '</h2><p class="muted">' + esc(D.closing) + '</p>' +
      '<p class="credit">Undangan digital oleh ' + esc(S.brand) + '</p></section>' +
    '<div class="pad-bar"></div>';

  function hideBrokenImages(root) {
    root.querySelectorAll("img").forEach(function (img) {
      function hide() {
        var target = img.closest(".ph, .avatar.portrait, .couple-photo, .frame");
        if (target) target.style.display = "none";
        else img.style.display = "none";
      }
      img.addEventListener("error", hide);
      if (img.complete && img.naturalWidth === 0) hide();
    });
  }
  hideBrokenImages(app);

  // sampul
  var cover = document.createElement("div");
  cover.id = "cover";
  var coverSrc = safeUrl(D.coverImg);
  if (coverSrc) {
    cover.classList.add("photo");
    cover.style.backgroundImage = "linear-gradient(180deg,rgba(0,0,0,.45),rgba(0,0,0,.2) 40%,rgba(0,0,0,.75)),url(" + coverSrc + ")";
    cover.style.backgroundSize = "cover";
    cover.style.backgroundPosition = D.coverPos || "center top";
  }
  var frameSrc = safeUrl(D.coverFrame);
  var frame = frameSrc ? '<div class="frame"><img alt="" src="' + esc(frameSrc) + '"></div>' : "";
  cover.innerHTML = '<div>' + frame + '<div class="heading">' + esc(D.heading) + '</div><h1>' + esc(names) + '</h1>' +
    '<p class="date">' + esc(dateStr) + '</p><p class="to">Kepada Yth. Bapak/Ibu/Saudara/i</p>' +
    '<p class="guest">' + esc(guest) + '</p><button class="btn" id="openBtn">Buka Undangan</button></div>';
  hideBrokenImages(cover);
  document.body.appendChild(cover);
  document.body.classList.add("locked");

  // bar bawah (khusus demo) + musik
  var bar = null;
  if (!LIVE) {
    bar = document.createElement("div");
    bar.className = "bar";
    bar.innerHTML = '<a class="back" href="../index.html#tema">← Semua Tema</a>' +
      '<a class="order" target="_blank" rel="noopener" href="' + window.waLink("Halo " + S.brand + ", saya mau pesan tema \"" + D.themeName + "\".") + '">Pesan Tema Ini</a>';
    document.body.appendChild(bar);
  }

  var music = document.createElement("button");
  music.className = "music"; music.textContent = "♪"; music.setAttribute("aria-label", "Musik");
  document.body.appendChild(music);
  var audio = new Audio(safeUrl(D.music) || (B + "assets/musik.mp3"));
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
    if (bar) bar.classList.add("show");
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

  function observe() {
    var els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) { els.forEach(function (e) { e.classList.add("in"); }); return; }
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } });
    }, { threshold: .15 });
    els.forEach(function (e) { io.observe(e); });
  }

  function toast(msg) {
    var t = document.createElement("div");
    t.className = "toast"; t.textContent = msg; document.body.appendChild(t);
    setTimeout(function () { t.classList.add("show"); }, 20);
    setTimeout(function () { t.classList.remove("show"); setTimeout(function () { t.remove(); }, 400); }, 3200);
  }

  document.getElementById("rsvp").addEventListener("submit", function (ev) {
    ev.preventDefault();
    var f = ev.target;
    var nama = f.nama.value.trim(), hadir = f.hadir.value, ucapan = f.ucapan.value.trim();
    if (!LIVE) {
      var w = document.createElement("div");
      w.className = "wish";
      w.innerHTML = "<b>" + esc(nama) + "</b><em>" + esc(hadir) + "</em><p>" + esc(ucapan) + "</p>";
      document.getElementById("wishes").prepend(w);
      f.ucapan.value = "";
      toast("Ditampilkan sementara untuk demo; data tidak disimpan.");
      return;
    }

    var num = waNum(D.rsvpWa);
    if (!num) {
      toast("Nomor WhatsApp tuan rumah belum diatur. Ucapan belum terkirim.");
      return;
    }
    var text = "Assalamualaikum, saya " + nama + ".\nKonfirmasi kehadiran: " + hadir + ".\nUcapan: " + ucapan;
    var waWindow = window.open("https://wa.me/" + num + "?text=" + encodeURIComponent(text), "_blank");
    if (waWindow) {
      toast("WhatsApp dibuka. Tekan Kirim di WhatsApp untuk mengirim konfirmasi.");
    } else {
      toast("WhatsApp tidak terbuka. Izinkan pop-up atau salin data dan kirim manual.");
    }
  });
})();
