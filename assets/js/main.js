/* Auto škola Veka — demo koncept · FORMA Studio */
(function () {
  'use strict';
  document.documentElement.classList.add('js');

  /* ---------- Navigacija: stanje pri skrolu ---------- */
  var nav = document.querySelector('.nav');
  function onScroll() {
    if (nav) nav.classList.toggle('is-scrolled', window.scrollY > 24);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobilni meni ---------- */
  var toggle = document.querySelector('.nav__toggle');
  var menu = document.getElementById('mobile-menu');
  // sadržaj iza menija se isključuje dok je meni otvoren (fokus ne izlazi iz menija)
  var behindMenu = document.querySelectorAll('main, footer');

  function setMenu(open) {
    if (!toggle || !menu) return;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Zatvori meni' : 'Otvori meni');
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', String(!open));
    if (open) { menu.removeAttribute('inert'); } else { menu.setAttribute('inert', ''); }
    behindMenu.forEach(function (el) {
      if (open) { el.setAttribute('inert', ''); } else { el.removeAttribute('inert'); }
    });
    document.body.classList.toggle('menu-open', open);
    if (nav) nav.classList.toggle('is-scrolled', open || window.scrollY > 24);
  }

  if (toggle && menu) {
    setMenu(false);
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) { setMenu(false); toggle.focus(); }
    });
    var desktopMq = window.matchMedia('(min-width: 1024px)');
    var onDesktop = function (mq) { if (mq.matches) setMenu(false); };
    // stariji Safari (< 14) nema addEventListener na MediaQueryList
    if (desktopMq.addEventListener) { desktopMq.addEventListener('change', onDesktop); }
    else if (desktopMq.addListener) { desktopMq.addListener(onDesktop); }
  }

  /* ---------- FAQ accordion ---------- */
  var faqButtons = document.querySelectorAll('.faq__btn');
  function setFaq(btn, open) {
    var panel = document.getElementById(btn.getAttribute('aria-controls'));
    btn.setAttribute('aria-expanded', String(open));
    panel.classList.toggle('is-open', open);
    // zatvoreni odgovor ne čitaju čitači ekrana
    panel.setAttribute('aria-hidden', String(!open));
    if (open) { panel.removeAttribute('inert'); } else { panel.setAttribute('inert', ''); }
  }
  faqButtons.forEach(function (btn) {
    setFaq(btn, btn.getAttribute('aria-expanded') === 'true');
    btn.addEventListener('click', function () {
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      // zatvori ostala pitanja
      faqButtons.forEach(function (other) {
        if (other !== btn && other.getAttribute('aria-expanded') === 'true') setFaq(other, false);
      });
      setFaq(btn, !expanded);
    });
  });

  /* ---------- Aktivni link u navigaciji ---------- */
  // Link se označava samo kada je trenutna sekcija u meniju.
  var navLinks = document.querySelectorAll('.nav__links a[href^="#"]');
  var linkById = {};
  navLinks.forEach(function (a) { linkById[a.getAttribute('href').slice(1)] = a; });
  var allSections = document.querySelectorAll('main section[id]');
  function updateActive() {
    var y = window.scrollY + window.innerHeight * 0.35;
    var current = null, currentTop = -Infinity;
    allSections.forEach(function (s) {
      var top = s.getBoundingClientRect().top + window.scrollY;
      if (top <= y && top > currentTop) { current = s; currentTop = top; }
    });
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) {
      current = allSections[allSections.length - 1];
    }
    var activeLink = current ? linkById[current.id] : null;
    navLinks.forEach(function (a) { a.classList.toggle('is-active', a === activeLink); });
  }
  if (navLinks.length && allSections.length) {
    window.addEventListener('scroll', updateActive, { passive: true });
    window.addEventListener('resize', updateActive);
    updateActive();
  }

  /* ---------- Reveal pri skrolu ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }
})();
