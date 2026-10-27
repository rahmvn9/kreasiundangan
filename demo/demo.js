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
  document.body.classList.remove("ornament-classic","ornament-minimal","ornament-floral","frame-ornate","frame-thin","frame-double","frame-none");
  if(themeStyle.ornament==="none") {
    document.body.classList.add("no-ornament");
  } else {
    document.body.classList.remove("no-ornament");
    if(themeStyle.ornament==="classic") document.body.classList.add("ornament-classic");
    if(themeStyle.ornament==="minimal") document.body.classList.add("ornament-minimal");
    if(themeStyle.ornament==="floral") document.body.classList.add("ornament-floral");
  }
  if(["ornate","thin","double","none"].indexOf(themeStyle.frameStyle)>=0) document.body.classList.add("frame-"+themeStyle.frameStyle);
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
      '<a class="btn" target="_blank" rel="noopener" href="' + esc((function(){var u=String(e.mapUrl||"").trim();if(u.indexOf("https://")===0||u.indexOf("http://")===0){try{var parsed=new URL(u);if(parsed.hostname==="maps.app.goo.gl"||parsed.hostname==="goo.gl"||parsed.hostname==="google.com"||parsed.hostname.endsWith(".google.com")||parsed.hostname==="maps.google.com")return parsed.href;}catch(err){}}return "https://www.google.com/maps/search/?api=1&query="+encodeURIComponent((e.place||"")+" "+(e.address||""));})()) + '">📍 Buka Lokasi di Google Maps</a></div>';
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
  // Foto pasangan lama sengaja tidak dirender; foto individu tampil di kartu masing-masing mempelai.
  var couplePhoto = "";
  function bgPhoto(src, pos) {
    src = safeUrl(src);
    return src ? ' style="background-image:linear-gradient(180deg,rgba(0,0,0,.35),rgba(0,0,0,.15) 40%,rgba(0,0,0,.65)),url(' + esc(src) + ');background-size:cover;background-position:' + esc(pos || "center top") + '"' : "";
  }

  var gallerySection = gallery
    ? '<section class="s gallery"><span class="kicker">Galeri</span><h2 class="title">Momen Kami</h2>' +
      (LIVE ? "" : '<p class="muted">Pada undangan asli, kotak ini berisi foto pelanggan.</p>') +
      '<div class="g">' + gallery + '</div></section>'
    : "";
  var wallet = D.wallet || {};
  var walletVisible = [wallet.bank, wallet.name, wallet.number, wallet.qr].some(function(v){return String(v || "").trim();});
  var walletSection = walletVisible
    ? '<section class="s wallet"><span class="kicker">Hadiah</span><h2 class="title">Dompet Digital</h2><p class="muted">Doa restu Anda adalah hadiah terbaik. Jika ingin memberi tanda kasih, dapat melalui:</p>' +
      (wallet.bank || wallet.number ? '<div class="wallet-card"><b>' + esc(wallet.bank || "Rekening") + '</b><p>Atas nama: ' + esc(wallet.name || names) + '</p><p class="wallet-number">' + esc(wallet.number || "") + '</p>' + (wallet.number ? '<button type="button" class="btn wallet-copy" data-copy="' + esc(wallet.number) + '">Salin nomor</button>' : '') + '</div>' : '') +
      (safeUrl(wallet.qr) ? '<div class="wallet-card"><p>Scan QR untuk memberi hadiah</p><img class="wallet-qr" loading="lazy" alt="QR dompet digital" src="' + esc(safeUrl(wallet.qr)) + '"></div>' : '') +
      '</section>' : "";

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

    '<section class="s rsvp"><span class="kicker">RSVP</span><h2 class="title">Konfirmasi Kehadiran</h2>' +
      '<p class="muted">' + esc(rsvpNote) + '</p>' +
      '<form id="rsvp"><div><label>Nama</label><input name="nama" required maxlength="60" value="' + esc(guest === "Nama Tamu" ? "" : guest) + '" placeholder="Nama kamu"></div>' +
      '<div><label>Kehadiran</label><select name="hadir"><option>Hadir</option><option>Tidak Hadir</option><option>Masih Ragu</option></select></div>' +
      '<div><label>Ucapan &amp; Doa</label><textarea name="ucapan" required maxlength="500" placeholder="Tulis ucapan..."></textarea></div>' +
      '<button class="btn" type="submit">' + (LIVE ? "Kirim via WhatsApp" : "Kirim Ucapan") + '</button></form>' +
      '<div id="wishes"></div></section>' +

    walletSection +

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

  // Fitur adaptasi: tombol tema, navigasi bawah, dan galeri lightbox.
  var themeToggle = document.createElement("button");
  themeToggle.className = "theme-toggle"; themeToggle.type = "button";
  themeToggle.setAttribute("aria-label", "Ganti mode terang atau gelap"); themeToggle.textContent = "◐";
  themeToggle.onclick = function () {
    var dark = document.body.classList.toggle("user-dark");
    themeToggle.setAttribute("aria-pressed", dark ? "true" : "false");
    try { localStorage.setItem("kreasi-color-mode", dark ? "dark" : "light"); } catch (e) {}
  };
  try { if (localStorage.getItem("kreasi-color-mode") === "dark") document.body.classList.add("user-dark"); } catch (e) {}
  document.body.appendChild(themeToggle);

  var nav = document.createElement("nav"); nav.className = "invite-nav"; nav.setAttribute("aria-label", "Navigasi undangan");
  nav.innerHTML = '<a href="#top" aria-label="Beranda">Beranda</a><a href="#mempelai">Mempelai</a><a href="#acara">Acara</a><a href="#galeri">Galeri</a><a href="#rsvp">RSVP</a>' + (walletVisible ? '<a href="#dompet">Dompet</a>' : '');
  document.body.appendChild(nav);
  var sections = app.querySelectorAll(".s");
  if (sections[0]) sections[0].id = "top";
  if (sections[2]) sections[2].id = "mempelai";
  var eventSection = app.querySelector(".event"); if (eventSection) eventSection.closest(".s").id = "acara";
  var gallerySectionNode = app.querySelector(".gallery.s"); if (gallerySectionNode) gallerySectionNode.id = "galeri";
  var rsvpSectionNode = app.querySelector(".rsvp.s"); if (rsvpSectionNode) rsvpSectionNode.id = "rsvp";
  var walletSectionNode = app.querySelector(".wallet.s"); if (walletSectionNode) walletSectionNode.id = "dompet";
  var sectionBgs = themeStyle.sectionBackgrounds || {};
  function applySectionBg(node, src) {
    src = safeUrl(src);
    if (!node || !src) return;
    node.style.backgroundImage = "linear-gradient(180deg,rgba(255,255,255,.48),rgba(255,255,255,.68)),url(\""+src.replace(/["\\]/g,"")+"\")";
    node.style.backgroundSize = "cover";
    node.style.backgroundPosition = "center";
    node.style.backgroundRepeat = "no-repeat";
  }
  applySectionBg(sections[0], sectionBgs.home);
  applySectionBg(sections[2], sectionBgs.people);
  if (eventSection) applySectionBg(eventSection.closest(".s"), sectionBgs.events);
  applySectionBg(gallerySectionNode, sectionBgs.gallery);
  applySectionBg(rsvpSectionNode, sectionBgs.rsvp);
  applySectionBg(walletSectionNode, sectionBgs.wallet);
  app.querySelectorAll(".wallet-copy").forEach(function(btn){btn.addEventListener("click",function(){var value=btn.getAttribute("data-copy")||"";if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(value).then(function(){toast("Nomor berhasil disalin.");}).catch(function(){toast("Salin nomor secara manual: "+value);});}else{toast("Salin nomor secara manual: "+value);}});});

  var lightbox = document.createElement("div"); lightbox.className = "gallery-lightbox"; lightbox.hidden = true;
  lightbox.innerHTML = '<button type="button" class="lightbox-close" aria-label="Tutup foto">×</button><a class="lightbox-open" target="_blank" rel="noopener" aria-label="Buka gambar asli">Buka gambar asli</a><img alt="Foto galeri diperbesar">';
  document.body.appendChild(lightbox);
  var lightboxImg = lightbox.querySelector("img"), lightboxLink = lightbox.querySelector("a");
  app.querySelectorAll(".g .ph img").forEach(function (img) {
    img.tabIndex = 0; img.setAttribute("role", "button"); img.setAttribute("aria-label", "Perbesar " + (img.alt || "foto"));
    function openPhoto() { lightboxImg.src = img.currentSrc || img.src; lightboxLink.href = img.currentSrc || img.src; lightbox.hidden = false; document.body.classList.add("lightbox-open"); }
    img.addEventListener("click", openPhoto);
    img.addEventListener("keydown", function (ev) { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); openPhoto(); } });
  });
  function closeLightbox() { lightbox.hidden = true; lightboxImg.removeAttribute("src"); document.body.classList.remove("lightbox-open"); }
  lightbox.querySelector(".lightbox-close").onclick = closeLightbox;
  lightbox.addEventListener("click", function (ev) { if (ev.target === lightbox) closeLightbox(); });
  document.addEventListener("keydown", function (ev) { if (ev.key === "Escape" && !lightbox.hidden) closeLightbox(); });

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

  // Muat konfigurasi dan SDK hanya saat form digunakan; key di sini harus publishable/anon.
  var supabasePromise = null;
  function getSupabase() {
    if (supabasePromise) return supabasePromise;
    supabasePromise = new Promise(function (resolve) {
      function loadSdk() {
        var cfg = window.KREASI_SUPABASE || {};
        if (!cfg.url || !cfg.key || !window.supabase) { resolve(null); return; }
        try { resolve(window.supabase.createClient(cfg.url, cfg.key)); } catch (_) { resolve(null); }
      }
      function loadScript(src, done) {
        var script = document.createElement("script");
        script.src = src; script.onload = done; script.onerror = function () { resolve(null); };
        document.head.appendChild(script);
      }
      function loadConfig() {
        if (window.KREASI_SUPABASE) {
          if (window.supabase) loadSdk();
          else loadScript("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2", loadSdk);
          return;
        }
        loadScript(B + "assets/supabase-config.js", function () {
          if (window.supabase) loadSdk();
          else loadScript("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2", loadSdk);
        });
      }
      loadConfig();
    });
    return supabasePromise;
  }
  function attendanceValue(value) {
    var s = String(value || "").toLowerCase();
    if (s.indexOf("tidak") >= 0 || s.indexOf("berhalangan") >= 0) return "Tidak Hadir";
    if (s.indexOf("ragu") >= 0 || s.indexOf("belum") >= 0) return "Masih Ragu";
    return "Hadir";
  }
  function invitationSlug() {
    var slug = String(D.slug || "").trim().toLowerCase();
    if (!slug) slug = String(document.title || location.pathname.split("/").filter(Boolean).pop() || "undangan")
      .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 120);
    return slug || "undangan";
  }

  document.getElementById("rsvp").addEventListener("submit", async function (ev) {
    ev.preventDefault();
    var f = ev.target;
    var nama = f.nama.value.trim().slice(0, 60), hadir = f.hadir.value, ucapan = f.ucapan.value.trim().slice(0, 500);
    if (!nama || !ucapan) { toast("Nama dan ucapan wajib diisi."); return; }

    // Buka WhatsApp langsung dari interaksi pengguna agar tidak diblokir browser.
    var num = LIVE ? waNum(D.rsvpWa) : "";
    var waWindow = null;
    if (num) {
      var waText = "Assalamualaikum, saya " + nama + ".\nKonfirmasi kehadiran: " + hadir + ".\nUcapan: " + ucapan;
      waWindow = window.open("https://wa.me/" + num + "?text=" + encodeURIComponent(waText), "_blank");
    }

    var saved = false, saveError = null;
    var db = await getSupabase();
    if (db) {
      var result = await db.from("guestbook").insert({
        invitation_slug: invitationSlug(),
        guest_name: nama,
        attendance: attendanceValue(hadir),
        message: ucapan
      });
      if (result.error) saveError = result.error;
      else saved = true;
    }

    if (!LIVE) {
      var w = document.createElement("div");
      w.className = "wish";
      w.innerHTML = "<b>" + esc(nama) + "</b><em>" + esc(hadir) + "</em><p>" + esc(ucapan) + "</p>";
      document.getElementById("wishes").prepend(w);
      f.ucapan.value = "";
      if (saved) toast("RSVP dan ucapan berhasil disimpan.");
      else if (saveError) toast("Gagal menyimpan ke database. Periksa konfigurasi Supabase.");
      else toast("Demo saja: data belum tersimpan online. Atur Supabase untuk mengaktifkannya.");
      return;
    }

    if (saved) {
      toast(waWindow ? "RSVP tersimpan. Tekan Kirim di WhatsApp untuk mengirim pesan ke tuan rumah." : "RSVP berhasil disimpan.");
      f.ucapan.value = "";
    } else if (saveError) {
      toast("RSVP gagal disimpan. Periksa koneksi atau konfigurasi Supabase.");
    } else if (!num) {
      toast("Supabase belum diatur dan nomor WhatsApp tuan rumah belum tersedia.");
    } else if (waWindow) {
      toast("Supabase belum diatur. WhatsApp dibuka; tekan Kirim untuk mengirim konfirmasi.");
    } else {
      toast("WhatsApp tidak terbuka. Periksa konfigurasi Supabase atau izinkan pop-up.");
    }
  });
})();
