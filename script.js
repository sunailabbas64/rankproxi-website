/* =========================================================
   Sunail Abbas — Personal Brand Site
   Interactions: theme, nav, reveal, counters, copy, scroll-spy
   ========================================================= */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;

  /* ---------- Theme ---------- */
  var THEME_KEY = 'sa-theme';
  var themeToggle = document.getElementById('themeToggle');

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (themeToggle) {
      themeToggle.setAttribute(
        'aria-label',
        theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
      );
    }
  }

  var stored = null;
  try { stored = localStorage.getItem(THEME_KEY); } catch (e) { stored = null; }

  if (!stored) {
    stored = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  applyTheme(stored);

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* ignore */ }
    });
  }

  /* ---------- Mobile nav ---------- */
  var nav = document.getElementById('nav');
  var navToggle = document.getElementById('navToggle');

  function closeNav() {
    if (!nav || !navToggle) return;
    nav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
  }

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });

    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') closeNav();
    });

    document.addEventListener('click', function (e) {
      if (!nav.classList.contains('open')) return;
      if (!nav.contains(e.target) && !navToggle.contains(e.target)) closeNav();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 1080) closeNav();
    });
  }

  /* ---------- Header state + back to top ---------- */
  var header = document.getElementById('siteHeader');
  var backTop = document.getElementById('backTop');
  var ticking = false;

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle('scrolled', y > 8);
    if (backTop) backTop.classList.toggle('show', y > 600);
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(onScroll);
    }
  }, { passive: true });
  onScroll();

  /* ---------- Reveal on scroll (with sibling stagger) ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

  // give siblings that share a parent a cascading delay
  revealEls.forEach(function (el) {
    var parent = el.parentElement;
    if (!parent) return;
    var sibs = Array.prototype.filter.call(parent.children, function (c) {
      return c.classList && c.classList.contains('reveal');
    });
    var i = sibs.indexOf(el);
    if (i > 0) el.style.setProperty('--d', Math.min(i, 8) * 80 + 'ms');
  });

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------- Scroll progress bar ---------- */
  var progressBar = document.getElementById('scrollProgress');
  if (progressBar) {
    var setProgress = function () {
      var doc = document.documentElement;
      var max = doc.scrollHeight - doc.clientHeight;
      var p = max > 0 ? (window.scrollY || doc.scrollTop) / max : 0;
      progressBar.style.transform = 'scaleX(' + Math.min(1, Math.max(0, p)) + ')';
      progressBar.classList.toggle('idle', (window.scrollY || 0) < 40);
    };
    window.addEventListener('scroll', function () {
      window.requestAnimationFrame(setProgress);
    }, { passive: true });
    window.addEventListener('resize', setProgress);
    setProgress();
  }

  /* ---------- Hero parallax ---------- */
  if (!reduceMotion) {
    var orbs = Array.prototype.slice.call(document.querySelectorAll('.orb'));
    var cardWrap = document.querySelector('.hero .card-wrap');
    var gridLines = document.querySelector('.grid-lines');
    if (orbs.length || cardWrap) {
      var parallax = function () {
        var y = window.scrollY || 0;
        if (y > window.innerHeight * 1.2) return;
        orbs.forEach(function (o, i) {
          o.style.marginTop = (y * (i === 0 ? 0.16 : 0.09)) + 'px';
        });
        if (gridLines) gridLines.style.marginTop = (y * 0.05) + 'px';
        if (cardWrap) cardWrap.style.transform = 'translateY(' + (y * 0.07) + 'px)';
      };
      window.addEventListener('scroll', function () {
        window.requestAnimationFrame(parallax);
      }, { passive: true });
      parallax();
    }
  }

  /* ---------- Pointer tilt on cards ---------- */
  if (!reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    var tiltEls = document.querySelectorAll('.profile-card, .card, .case-card, .plan, .stat-card');
    Array.prototype.forEach.call(tiltEls, function (el) {
      el.classList.add('tilt');
      var raf = null;
      var last = { x: 0, y: 0 };

      var apply = function () {
        raf = null;
        el.style.transform =
          'perspective(900px) rotateY(' + (last.x * 5).toFixed(2) + 'deg)' +
          ' rotateX(' + (-last.y * 5).toFixed(2) + 'deg)' +
          ' translateY(-4px)';
      };

      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        last.x = (e.clientX - r.left) / r.width - 0.5;
        last.y = (e.clientY - r.top) / r.height - 0.5;
        if (!raf) raf = window.requestAnimationFrame(apply);
      });

      el.addEventListener('pointerleave', function () {
        if (raf) { window.cancelAnimationFrame(raf); raf = null; }
        el.style.transform = '';
      });
    });
  }

  /* ---------- Animated counters ---------- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count')) || 0;
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    var decimals = (String(target).split('.')[1] || '').length;
    var duration = 1500;
    var start = null;

    function fmt(n) {
      var s = n.toFixed(decimals);
      if (decimals === 0 && n >= 1000) {
        s = s.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      }
      return prefix + s + suffix;
    }

    if (reduceMotion) {
      el.textContent = fmt(target);
      return;
    }

    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(target * eased);
      if (p < 1) window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }

  var counters = Array.prototype.slice.call(document.querySelectorAll('[data-count]'));
  if (!('IntersectionObserver' in window)) {
    counters.forEach(animateCount);
  } else {
    var countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          countObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { countObserver.observe(el); });
  }

  /* ---------- Progress bars ---------- */
  var bars = Array.prototype.slice.call(document.querySelectorAll('.bar'));
  if (!('IntersectionObserver' in window)) {
    bars.forEach(function (b) { b.classList.add('in'); });
  } else {
    var barObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          barObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    bars.forEach(function (b) { barObserver.observe(b); });
  }

  /* ---------- Scroll spy ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav a[href^="#"]'));
  var sections = navLinks
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  if (sections.length && 'IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) {
          a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Card pointer glow ---------- */
  if (!reduceMotion && window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.card').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }

  /* ---------- Copy buttons ---------- */
  document.querySelectorAll('.copy-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var value = btn.getAttribute('data-copy') || '';
      var done = function () {
        var original = btn.textContent;
        btn.textContent = 'Copied';
        btn.classList.add('done');
        window.setTimeout(function () {
          btn.textContent = original;
          btn.classList.remove('done');
        }, 1600);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).then(done).catch(function () { fallback(value, done); });
      } else {
        fallback(value, done);
      }
    });
  });

  function fallback(text, cb) {
    try {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      cb();
    } catch (e) { /* ignore */ }
  }

  /* ---------- Year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Contact / audit form ---------- */
  var form = document.querySelector('form[data-audit-form]');
  if (form) {
    var success = form.querySelector('.form-success');

    var validate = function (input) {
      var field = input.closest('.field');
      if (!field) return true;
      var ok = true;
      var value = (input.value || '').trim();

      if (input.hasAttribute('required') && !value) ok = false;
      if (ok && input.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) ok = false;

      field.classList.toggle('invalid', !ok);
      input.setAttribute('aria-invalid', ok ? 'false' : 'true');
      return ok;
    };

    form.querySelectorAll('input, select, textarea').forEach(function (input) {
      input.addEventListener('blur', function () { validate(input); });
      input.addEventListener('input', function () {
        var field = input.closest('.field');
        if (field && field.classList.contains('invalid')) validate(input);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var inputs = Array.prototype.slice.call(form.querySelectorAll('input, select, textarea'));
      var firstBad = null;

      inputs.forEach(function (input) {
        if (!validate(input) && !firstBad) firstBad = input;
      });

      if (firstBad) {
        firstBad.focus();
        firstBad.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
        return;
      }

      var submitBtn = form.querySelector('[type="submit"]');
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }

      window.setTimeout(function () {
        if (success) {
          success.classList.add('show');
          success.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
        }
        form.reset();
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = submitBtn.getAttribute('data-label') || 'Send'; }
      }, 550);
    });
  }

  /* ---------- Review slider ---------- */
  (function () {
    var roots = document.querySelectorAll('[data-slider]');
    if (!roots.length) return;

    Array.prototype.forEach.call(roots, function (root) {
      var track = root.querySelector('[data-track]');
      if (!track) return;

      var prevBtn = root.querySelector('[data-prev]');
      var nextBtn = root.querySelector('[data-next]');
      var dotsWrap = root.querySelector('[data-dots]');
      var progressFill = root.querySelector('[data-progress] span');
      var cards = Array.prototype.slice.call(track.querySelectorAll('.review'));
      if (cards.length < 2) return;

      var dots = [];
      var pages = 1;
      var current = 0;
      var timer = null;
      var AUTOPLAY_MS = 6000;

      function stepSize() {
        return cards.length > 1 ? (cards[1].offsetLeft - cards[0].offsetLeft) : track.clientWidth;
      }
      function perPage() {
        var s = stepSize();
        return s > 0 ? Math.max(1, Math.round((track.clientWidth + 18) / s)) : 1;
      }
      function maxScroll() {
        return track.scrollWidth - track.clientWidth;
      }
      function buildDots() {
        pages = Math.max(1, Math.ceil(cards.length / perPage()));
        root.classList.toggle('many', pages > 8);
        if (!dotsWrap) return;
        if (pages === dots.length) return;
        dotsWrap.innerHTML = '';
        dots = [];
        for (var i = 0; i < pages; i++) {
          var b = document.createElement('button');
          b.type = 'button';
          b.setAttribute('aria-label', 'Go to review page ' + (i + 1) + ' of ' + pages);
          b.addEventListener('click', makeGoTo(i));
          dotsWrap.appendChild(b);
          dots.push(b);
        }
      }
      function makeGoTo(i) {
        return function () { goTo(i); };
      }
      function goTo(i) {
        i = Math.max(0, Math.min(i, pages - 1));
        track.scrollTo({ left: i * perPage() * stepSize(), behavior: reduceMotion ? 'auto' : 'smooth' });
      }
      function sync() {
        var s = stepSize();
        var first = s > 0 ? Math.round(track.scrollLeft / s) : 0;
        current = Math.max(0, Math.min(Math.round(first / perPage()), pages - 1));

        dots.forEach(function (d, i) {
          var on = i === current;
          d.classList.toggle('active', on);
          if (on) { d.setAttribute('aria-current', 'true'); } else { d.removeAttribute('aria-current'); }
        });

        var atStart = track.scrollLeft <= 2;
        var atEnd = track.scrollLeft >= maxScroll() - 2;
        root.classList.toggle('can-prev', !atStart);
        root.classList.toggle('can-next', !atEnd);
        if (prevBtn) prevBtn.disabled = atStart;
        if (nextBtn) nextBtn.disabled = atEnd;
        if (progressFill) progressFill.style.width = (((current + 1) / pages) * 100) + '%';
      }

      if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); });
      if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); });

      var scrollTimer;
      track.addEventListener('scroll', function () {
        window.clearTimeout(scrollTimer);
        scrollTimer = window.setTimeout(sync, 90);
      }, { passive: true });

      track.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') { e.preventDefault(); goTo(current + 1); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(current - 1); }
      });

      function stop() { if (timer) { window.clearInterval(timer); timer = null; } }
      function start() {
        stop();
        if (reduceMotion || pages < 2) return;
        timer = window.setInterval(function () {
          var atEnd = track.scrollLeft >= maxScroll() - 2;
          goTo(atEnd ? 0 : current + 1);
        }, AUTOPLAY_MS);
      }

      root.addEventListener('mouseenter', stop);
      root.addEventListener('mouseleave', start);
      root.addEventListener('focusin', stop);
      root.addEventListener('focusout', function (e) {
        if (!root.contains(e.relatedTarget)) start();
      });
      track.addEventListener('pointerdown', stop);
      track.addEventListener('touchstart', stop, { passive: true });
      document.addEventListener('visibilitychange', function () {
        if (document.hidden) { stop(); } else { start(); }
      });

      var resizeTimer;
      window.addEventListener('resize', function () {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(function () { buildDots(); sync(); start(); }, 160);
      });

      window.addEventListener('load', function () { buildDots(); sync(); });

      buildDots();
      sync();
      start();
    });
  })();

  /* ---------- Dev helpers for design capture (no effect in normal use) ----------
     ?shot=<section-id>  jump straight to a section
     ?only=<section-id>  render just that section                              */
  (function () {
    var params;
    try { params = new URLSearchParams(window.location.search); } catch (e) { return; }

    var only = params.get('only');
    if (only) {
      Array.prototype.forEach.call(document.querySelectorAll('main > section'), function (s) {
        if (s.id !== only) s.style.display = 'none';
      });
      var footer = document.querySelector('.site-footer');
      if (footer) footer.style.display = 'none';
      document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
      return;
    }

    var shot = params.get('shot');
    if (!shot) return;
    var target = document.getElementById(shot);
    if (!target) return;
    var prev = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    target.scrollIntoView({ behavior: 'auto', block: 'start' });
    window.setTimeout(function () { root.style.scrollBehavior = prev; }, 60);
  })();
})();
