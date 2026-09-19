
(function () {
  "use strict";

  /* ---- Mobile nav toggle ---- */
  function initNav() {
    var toggle = document.querySelector(".nav-toggle");
    var links = document.getElementById("nav-links");
    if (!toggle || !links) return;

    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    // close the menu when a link is tapped (mobile)
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
        toggle.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---- Header shadow on scroll ---- */
  function initHeader() {
    var header = document.getElementById("site-header");
    if (!header) return;
    var onScroll = function () {
      header.classList.toggle("scrolled", window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---- Highlight the current page in the nav ---- */
  function initActiveLink() {
    var path = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-links a").forEach(function (a) {
      var href = a.getAttribute("href") || "";
      if (href === path || (path === "index.html" && href === "index.html")) {
        if (!a.classList.contains("btn")) a.classList.add("active");
      }
    });
  }

  /* ---- Scroll-reveal animations ---- */
  function initReveal() {
    var els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || !els.length) {
      els.forEach(function (el) { el.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -40px 0px" });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---- FAQ accordion ---- */
  function initFaq() {
    document.querySelectorAll(".faq-item .faq-q").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var item = btn.closest(".faq-item");
        var open = item.classList.toggle("open");
        btn.setAttribute("aria-expanded", open ? "true" : "false");
      });
    });
  }

  /* ---- Count-up stats ---- */
  function initStats() {
    var nums = document.querySelectorAll("[data-count]");
    if (!nums.length) return;
    var run = function (el) {
      var target = parseInt(el.getAttribute("data-count"), 10);
      var suffix = el.getAttribute("data-suffix") || "";
      var start = null, dur = 1200;
      var step = function (ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    if (!("IntersectionObserver" in window)) {
      nums.forEach(run); return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { run(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.5 });
    nums.forEach(function (n) { io.observe(n); });
  }

  /* ---- Contact form: friendly inline success ---- */
  function initForm() {
    var form = document.querySelector(".contact-form");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var btn = form.querySelector("button[type=submit]");
      var original = btn ? btn.textContent : "";
      if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }
      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      }).then(function (res) {
        if (res.ok) {
          form.innerHTML =
            '<div class="form-success">' +
            '<div class="check">✓</div>' +
            '<h3>Thank you — your message is on its way.</h3>' +
            '<p>Ibis will get back to you within a few business days.</p>' +
            '</div>';
        } else {
          throw new Error("submit failed");
        }
      }).catch(function () {
        if (btn) { btn.disabled = false; btn.textContent = original; }
        alert("Sorry — something went wrong. Please email hello@luminospsych.com directly.");
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initNav();
    initHeader();
    initActiveLink();
    initReveal();
    initFaq();
    initStats();
    initForm();
  });
})();
