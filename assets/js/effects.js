// Mobile detection
const isSmall = window.matchMedia('(max-width: 720px)').matches;
const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Lenis smooth scroll — desktop only
let lenis = null;
if (window.Lenis && !isSmall && !reduceMotion) {
  lenis = new window.Lenis({ smoothWheel: true, lerp: 0.09 });
  function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);
}

// Reveal-on-scroll
const initReveal = () => {
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || els.length === 0) {
    els.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  els.forEach((el) => io.observe(el));
};
initReveal();

// GSAP ScrollTrigger — desktop only (touch + small screens skip pin/horizontal)
if (window.gsap && window.ScrollTrigger && !reduceMotion && !isSmall) {
  gsap.registerPlugin(ScrollTrigger);

  if (lenis) {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  // Pinned scroll-zoom
  gsap.utils.toArray('.scroll-pin-section').forEach((section) => {
    const target = section.querySelector('.scroll-pin-target');
    if (!target) return;
    gsap.fromTo(
      target,
      { scale: 0.55 },
      {
        scale: 1.0,
        ease: 'none',
        force3D: true,
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=110%',
          pin: true,
          scrub: 0.4,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      }
    );
  });

  // Horizontal scroll
  gsap.utils.toArray('.horizontal-section').forEach((section) => {
    const track = section.querySelector('.horizontal-track');
    if (!track) return;
    gsap.to(track, {
      x: () => -(track.scrollWidth - window.innerWidth + 48),
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${track.scrollWidth - window.innerWidth + 200}`,
        pin: true,
        scrub: 0.4,
        invalidateOnRefresh: true
      }
    });
  });

  // Counters (run on all screens, but only here since GSAP ScrollTrigger handles it)
  gsap.utils.toArray('[data-count]').forEach((el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const obj = { val: 0 };
    gsap.to(obj, {
      val: target,
      duration: 1.6,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' },
      onUpdate: () => { el.textContent = Math.round(obj.val) + suffix; }
    });
  });
}

// On small screens, just set the counter to final value (no animation)
if (isSmall || reduceMotion) {
  document.querySelectorAll('[data-count]').forEach((el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    el.textContent = target + suffix;
  });
}

// Terminal typing animation (on all screens)
const terminals = document.querySelectorAll('.terminal');
if (terminals.length && 'IntersectionObserver' in window) {
  const termIO = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('typing');
        termIO.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  terminals.forEach((t) => termIO.observe(t));
}

// Hamburger nav toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navLinks.classList.toggle('is-open');
  });
  navLinks.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      navToggle.setAttribute('aria-expanded', 'false');
      navLinks.classList.remove('is-open');
    });
  });
}

// Live clock for hero readout
const clockEl = document.getElementById('readout-time');
if (clockEl) {
  const updateClock = () => {
    const now = new Date();
    const opts = { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Karachi' };
    clockEl.textContent = `${now.toLocaleTimeString('en-GB', opts)} PKT`;
  };
  updateClock();
  setInterval(updateClock, 30000);
}

// Card pointer-position spotlight (desktop only)
if (!isTouch) {
  document.querySelectorAll('.card').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      const mx = ((e.clientX - rect.left) / rect.width) * 100;
      const my = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mx', `${mx}%`);
      card.style.setProperty('--my', `${my}%`);
    });
  });

  const tiltMax = 4;
  document.querySelectorAll('.card, .feature-item').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rx = (0.5 - y) * tiltMax;
      const ry = (x - 0.5) * tiltMax;
      el.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });
}
