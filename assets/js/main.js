/* LokalKI – Landing Page: Navigation, Scroll-Animationen, Formular */
(function () {
  "use strict";

  var root = document.documentElement;
  root.classList.add("js");

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Navigation ---------- */
  var nav = document.getElementById("nav");
  var toggle = document.getElementById("nav-toggle");
  var links = document.getElementById("nav-links");

  function onScrollNav() {
    nav.classList.toggle("is-scrolled", window.scrollY > 8);
  }

  toggle.addEventListener("click", function () {
    var open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    toggle.setAttribute("aria-label", open ? "Menü öffnen" : "Menü schließen");
    links.classList.toggle("is-open", !open);
  });

  links.addEventListener("click", function (e) {
    if (e.target.closest("a")) {
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Menü öffnen");
      links.classList.remove("is-open");
    }
  });

  /* ---------- Reveal beim Scrollen ---------- */
  // Gestaffelte Verzögerung für Elemente innerhalb einer Gruppe
  document.querySelectorAll("[data-reveal-group]").forEach(function (group) {
    group.querySelectorAll("[data-reveal]").forEach(function (el, i) {
      el.style.setProperty("--d", (i * 0.09).toFixed(2) + "s");
    });
  });

  var revealTargets = document.querySelectorAll("[data-reveal]");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealTargets.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.12 });

    revealTargets.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Fortschrittslinien (Ablauf & Zeitleiste) ---------- */
  var progressEls = Array.prototype.slice.call(document.querySelectorAll("[data-progress]"));

  function clamp(v, min, max) { return Math.min(max, Math.max(min, v)); }

  function updateProgress() {
    var vh = window.innerHeight;
    progressEls.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      // Start: Oberkante bei 75 % der Höhe, Ende: Unterkante bei 55 %
      var start = vh * 0.75;
      var end = vh * 0.55;
      var p = clamp((start - rect.top) / (rect.height + start - end), 0, 1);
      if (reduceMotion) p = 1;
      el.style.setProperty("--p", p.toFixed(3));

      var items = el.querySelectorAll(".step, .timeline__item");
      var horizontal = items.length > 1 &&
        Math.abs(items[0].getBoundingClientRect().top - items[items.length - 1].getBoundingClientRect().top) < 4;

      // Linie exakt vom ersten bis zum letzten Nummern-Kreis spannen
      var line = el.querySelector(".steps__line");
      var nums = el.querySelectorAll(".step__num");
      if (line && nums.length > 1) {
        var a = nums[0].getBoundingClientRect();
        var b = nums[nums.length - 1].getBoundingClientRect();
        if (horizontal) {
          line.style.cssText = "top:" + (a.top - rect.top + a.height / 2 - 1) + "px;left:" +
            (a.left - rect.left + a.width / 2) + "px;width:" + (b.left - a.left) + "px;right:auto;bottom:auto;height:2px";
        } else {
          line.style.cssText = "left:" + (a.left - rect.left + a.width / 2 - 1) + "px;top:" +
            (a.top - rect.top + a.height / 2) + "px;height:" + (b.top - a.top) + "px;right:auto;bottom:auto;width:2px";
        }
      }

      items.forEach(function (item, i) {
        var reachedAt;
        if (nums.length > 1) {
          // Schritte: Position des Kreises entlang der Linie
          reachedAt = i / (items.length - 1);
          if (!horizontal) {
            var first = nums[0].getBoundingClientRect().top;
            var span = nums[nums.length - 1].getBoundingClientRect().top - first;
            reachedAt = span > 0 ? (nums[i].getBoundingClientRect().top - first) / span : 0;
          }
        } else {
          reachedAt = (item.getBoundingClientRect().top + 10 - rect.top) / rect.height;
        }
        item.classList.toggle("is-reached", p >= reachedAt - 0.02);
      });
    });
  }

  /* ---------- Scroll-Handler (gebündelt pro Frame) ---------- */
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      onScrollNav();
      updateProgress();
      ticking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScrollNav();
  updateProgress();

  /* ---------- Anonymisierungs-Demo ---------- */
  var anon = document.getElementById("anon");
  if (anon) {
    var piis = anon.querySelectorAll(".pii");
    var stepsEls = anon.querySelectorAll(".anon__step");
    var replay = document.getElementById("anon-replay");
    var timers = [];
    var originals = Array.prototype.map.call(piis, function (el) { return el.textContent; });

    function setStep(n) {
      stepsEls.forEach(function (s, i) { s.classList.toggle("is-active", i === n); });
    }

    function reset() {
      timers.forEach(clearTimeout);
      timers = [];
      anon.classList.remove("is-sent", "is-done");
      piis.forEach(function (el, i) {
        el.textContent = originals[i];
        el.classList.remove("is-marked", "is-replaced");
      });
      setStep(0);
    }

    function at(ms, fn) { timers.push(setTimeout(fn, ms)); }

    function finalState() {
      piis.forEach(function (el) {
        el.textContent = el.getAttribute("data-tag");
        el.classList.add("is-replaced");
      });
      setStep(2);
      anon.classList.add("is-sent", "is-done");
    }

    function play() {
      reset();
      if (reduceMotion) { finalState(); return; }
      var t = 900;
      piis.forEach(function (el) {
        at(t, function () { el.classList.add("is-marked"); });
        t += 380;
      });
      t += 300;
      at(t, function () { setStep(1); });
      piis.forEach(function (el) {
        at(t, function () {
          el.classList.remove("is-marked");
          el.textContent = el.getAttribute("data-tag");
          el.classList.add("is-replaced");
        });
        t += 300;
      });
      t += 700;
      at(t, function () { setStep(2); anon.classList.add("is-sent"); });
      at(t + 1000, function () { anon.classList.add("is-done"); });
    }

    if ("IntersectionObserver" in window) {
      var anonIo = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          play();
          anonIo.disconnect();
        }
      }, { threshold: 0.55 });
      anonIo.observe(anon);
    } else {
      finalState();
    }

    replay.addEventListener("click", play);
  }

  /* ---------- SVG-Animationen bei reduzierter Bewegung anhalten ---------- */
  if (reduceMotion) {
    document.querySelectorAll("svg").forEach(function (svg) {
      if (typeof svg.pauseAnimations === "function") svg.pauseAnimations();
    });
  }

  /* ---------- Paket vorauswählen ---------- */
  var paketSelect = document.getElementById("paket");
  document.querySelectorAll("[data-plan]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (paketSelect) paketSelect.value = btn.getAttribute("data-plan");
    });
  });

  /* ---------- Demo-Formular ---------- */
  var form = document.getElementById("demo-form");
  var status = document.getElementById("form-status");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.elements.name;
      var email = form.elements.email;
      var ok = true;

      [name, email].forEach(function (field) {
        var valid = field.value.trim() !== "" && field.checkValidity();
        field.classList.toggle("is-invalid", !valid);
        field.setAttribute("aria-invalid", String(!valid));
        if (!valid) ok = false;
      });

      if (!ok) {
        status.className = "form__status is-error";
        status.textContent = "Bitte geben Sie Ihren Namen und eine gültige E-Mail-Adresse an.";
        return;
      }

      status.className = "form__status is-ok";
      status.textContent = "Vielen Dank, " + name.value.trim().split(" ")[0] +
        "! Wir melden uns innerhalb eines Werktags für einen Demo-Termin.";
      form.reset();
    });

    form.addEventListener("input", function (e) {
      if (e.target.classList.contains("is-invalid") && e.target.checkValidity() && e.target.value.trim()) {
        e.target.classList.remove("is-invalid");
        e.target.removeAttribute("aria-invalid");
      }
    });
  }

  /* ---------- Jahr im Footer ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
