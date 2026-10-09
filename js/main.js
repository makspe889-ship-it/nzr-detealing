(function () {
  // ---- Данные студии (телефон и адрес — из карточек 2ГИС / Яндекс Карт, проверить с владельцем) ----
  var PHONE_WA = "77071012131";
  var WA_TEXT = "Здравствуйте! Хочу записаться в NZR Detailing.";

  var IMG = {
    1: "images/work-1.jpg",
    2: "images/work-2.jpg",
    3: "images/work-3.jpg"
  };
  // ---- Галерея. Чтобы подставить реальные фото: впишите ссылку или data:-URI в src ----
  var WORKS = [
    { src: IMG[3], alt: "Два чёрных внедорожника в студии под шестиугольными светильниками", pos: "50% 55%" },
    { src: IMG[2], alt: "Чёрный BMW X5 в боксе студии после работы", pos: "50% 60%" },
    { src: IMG[1], alt: "Чёрный электрический внедорожник с открытым капотом и дверями во дворе студии", pos: "50% 50%" }
  ];

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

  // WhatsApp-ссылки
  var waUrl = "https://wa.me/" + PHONE_WA + "?text=" + encodeURIComponent(WA_TEXT);
  $$("[data-wa]").forEach(function (a) { a.href = waUrl; });

  var hb = $("#heroBg"); hb.style.backgroundImage = "url(" + IMG[3] + ")"; requestAnimationFrame(function () { hb.classList.add("on"); });

  // Галерея
  var gallery = $("#gallery");
  WORKS.forEach(function (w, i) {
    var t = document.createElement("button");
    t.className = "tile"; t.type = "button"; t.setAttribute("role", "listitem");
    t.setAttribute("aria-label", "Открыть фото " + (i + 1));
    t.innerHTML = tileInner(w, i);
    t.addEventListener("click", function () { openLightbox(w, i); });
    gallery.appendChild(t);
  });
  function tileInner(w, i) {
    return '<img src="' + w.src + '" alt="' + w.alt + '" style="object-position:' + (w.pos || "center") + '">';
  }
  var lb = $("#lightbox"), lbBox = $("#lbBox"), lastFocus = null;
  function openLightbox(w, i) {
    lastFocus = document.activeElement;
    lbBox.innerHTML = tileInner(w, i);
    lb.classList.add("open"); document.body.style.overflow = "hidden";
    $("#lbClose").focus();
  }
  function closeLightbox() {
    lb.classList.remove("open"); document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }
  $("#lbClose").addEventListener("click", closeLightbox);
  lb.addEventListener("click", function (e) { if (e.target === lb) closeLightbox(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && lb.classList.contains("open")) closeLightbox(); });

  // Кнопки «Записаться»
  var service = $("#service"), form = $("#form"), thanks = $("#thanks");
  $$("[data-book]").forEach(function (b) {
    b.addEventListener("click", function () {
      var v = b.getAttribute("data-book");
      resetForm();
      if (v) service.value = v;
      $("#book").scrollIntoView({ behavior: reduce() ? "auto" : "smooth", block: "start" });
      setTimeout(function () { $("#name").focus({ preventScroll: true }); }, reduce() ? 0 : 650);
    });
  });
  function reduce() { return window.matchMedia("(prefers-reduced-motion: reduce)").matches; }

  // Форма
  function setErr(el, bad) { el.closest(".field").classList.toggle("err", bad); }
  ["name", "phone", "car", "service"].forEach(function (id) {
    $("#" + id).addEventListener("input", function () { setErr(this, false); });
    $("#" + id).addEventListener("change", function () { setErr(this, false); });
  });
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var ok = true, first = null;
    var name = $("#name"), phone = $("#phone"), car = $("#car");
    var checks = [
      [name, name.value.trim().length < 2],
      [phone, phone.value.replace(/\D/g, "").length < 10],
      [car, car.value.trim().length < 2],
      [service, !service.value]
    ];
    checks.forEach(function (c) {
      setErr(c[0], c[1]);
      if (c[1]) { ok = false; if (!first) first = c[0]; }
    });
    if (!ok) { first.focus(); return; }
    $("#thanks-detail").textContent = service.value + " · " + car.value.trim();
    var msg = "Здравствуйте! Хочу записаться в NZR Detailing.\n" +
      "Имя: " + name.value.trim() + "\n" +
      "Телефон: " + phone.value.trim() + "\n" +
      "Автомобиль: " + car.value.trim() + "\n" +
      "Услуга: " + service.value +
      ($("#comment").value.trim() ? "\nКомментарий: " + $("#comment").value.trim() : "");
    var sendUrl = "https://wa.me/" + PHONE_WA + "?text=" + encodeURIComponent(msg);
    var sl = $("#sendWa"); if (sl) sl.href = sendUrl;
    window.open(sendUrl, "_blank", "noopener");
    form.style.display = "none";
    thanks.classList.add("show");
    thanks.focus({ preventScroll: true });
  });
  function resetForm() {
    thanks.classList.remove("show");
    form.style.display = "";
  }
  $("#again").addEventListener("click", function () {
    form.reset(); resetForm(); $("#name").focus();
  });

  // Нижняя панель прячется на блоке записи, чтобы не перекрывать форму
  var dock = $("#dock");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { dock.classList.toggle("hide", en.isIntersecting); });
    }, { threshold: 0.15 });
    io.observe($("#book"));
    io.observe($(".hero .cta"));
  }

  // Блик на логотипе: следует за пальцем/курсором, в покое плавает сам
  var mark = $("#mark"), lastTouch = -1e9, t0 = performance.now();
  function setLight(x, y) { mark.style.setProperty("--mx", x + "%"); mark.style.setProperty("--my", y + "%"); }
  function onMove(e) {
    var p = e.touches ? e.touches[0] : e, r = mark.getBoundingClientRect();
    setLight(((p.clientX - r.left) / r.width) * 100, ((p.clientY - r.top) / r.height) * 100);
    lastTouch = performance.now();
  }
  mark.addEventListener("pointermove", onMove);
  mark.addEventListener("touchmove", onMove, { passive: true });
  if (!reduce()) {
    (function loop(now) {
      if (now - lastTouch > 2500) {
        var t = (now - t0) / 1000;
        setLight(50 + 48 * Math.sin(t * 0.55), 45 + 30 * Math.sin(t * 0.9 + 1));
      }
      requestAnimationFrame(loop);
    })(performance.now());
  } else {
    setLight(35, 35);
  }
})();
