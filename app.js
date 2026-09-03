(function () {
  "use strict";

  // Header scroll state
  var header = document.getElementById("siteHeader");
  function updateHeader() {
    if (window.scrollY > 24) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  }
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  // Mobile menu
  var menu = document.getElementById("mobileMenu");
  var openBtn = document.getElementById("hamburgerBtn");
  var closeBtn = document.getElementById("mobileMenuClose");
  var backdrop = document.createElement("div");
  backdrop.className = "menu-backdrop";
  document.body.appendChild(backdrop);

  function openMenu() {
    menu.classList.add("is-open");
    backdrop.classList.add("is-open");
    openBtn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }
  function closeMenu() {
    menu.classList.remove("is-open");
    backdrop.classList.remove("is-open");
    openBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }
  openBtn.addEventListener("click", openMenu);
  closeBtn.addEventListener("click", closeMenu);
  backdrop.addEventListener("click", closeMenu);
  menu.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", closeMenu);
  });

  // Scroll reveal
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  // Fallback sweep: catches elements a fast/instant scroll (e.g. anchor jump,
  // scrollbar drag, End key) can skip past without an IntersectionObserver
  // callback ever firing for them.
  var sweepPending = false;
  function sweepReveals() {
    sweepPending = false;
    var vh = window.innerHeight;
    reveals.forEach(function (el) {
      if (el.classList.contains("is-visible")) return;
      var r = el.getBoundingClientRect();
      if (r.top < vh && r.bottom > 0) el.classList.add("is-visible");
    });
  }
  function scheduleSweep() {
    if (sweepPending) return;
    sweepPending = true;
    requestAnimationFrame(sweepReveals);
  }
  window.addEventListener("scroll", scheduleSweep, { passive: true });
  window.addEventListener("resize", scheduleSweep);
  scheduleSweep();
})();
