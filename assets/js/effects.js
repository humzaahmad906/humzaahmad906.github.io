// Detect input modality once
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

// Reveal-on-scroll
(() => {
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
})();

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

// Newsletter form placeholder
document.querySelectorAll('.newsletter form').forEach((form) => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    const btn = form.querySelector('button');
    if (input && btn) {
      btn.textContent = 'Thanks!';
      btn.disabled = true;
      input.value = '';
      setTimeout(() => { btn.textContent = 'Subscribe'; btn.disabled = false; }, 2400);
    }
  });
});

/* === MOTION LAYER (skipped on touch + reduced-motion) === */
if (!isTouch && !reduceMotion) {

  // -- Cursor follower --
  const glow = document.querySelector('.cursor-glow');
  const dot = document.querySelector('.cursor-dot');
  if (glow && dot) {
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let gx = mx;
    let gy = my;
    let visible = false;

    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      if (!visible) { glow.classList.add('is-active'); dot.classList.add('is-active'); visible = true; }
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    const onLeave = () => { glow.classList.remove('is-active'); dot.classList.remove('is-active'); visible = false; };
    document.addEventListener('mouseleave', onLeave);

    // Hover state on interactive elements
    const hoverables = 'a, button, input, .card, .post-card, .feature-item, .newsletter, .cta-box';
    document.querySelectorAll(hoverables).forEach((el) => {
      el.addEventListener('pointerenter', () => { dot.classList.add('is-hovering'); glow.classList.add('is-hovering'); });
      el.addEventListener('pointerleave', () => { dot.classList.remove('is-hovering'); glow.classList.remove('is-hovering'); });
    });

    const lerp = 0.16;
    const tickCursor = () => {
      gx += (mx - gx) * lerp;
      gy += (my - gy) * lerp;
      glow.style.transform = `translate3d(${gx}px, ${gy}px, 0) translate(-50%, -50%)`;
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(tickCursor);
    };
    requestAnimationFrame(tickCursor);
  }

  // -- Glass surface tilt + spotlight --
  const tiltMax = 4; // degrees
  const surfaces = document.querySelectorAll('.card, .post-card, .feature-item, .newsletter, .cta-box, .about-header, .hero-photo img');
  surfaces.forEach((el) => {
    let frame = null;
    let lastX = 0, lastY = 0;

    const apply = () => {
      frame = null;
      const rect = el.getBoundingClientRect();
      const x = (lastX - rect.left) / rect.width;
      const y = (lastY - rect.top) / rect.height;
      const rx = (0.5 - y) * tiltMax;
      const ry = (x - 0.5) * tiltMax;
      el.style.setProperty('--tilt', `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg)`);
      el.style.setProperty('--mx', `${x * 100}%`);
      el.style.setProperty('--my', `${y * 100}%`);
    };

    el.addEventListener('pointerenter', () => {
      el.style.willChange = 'transform';
    });
    el.addEventListener('pointermove', (e) => {
      lastX = e.clientX;
      lastY = e.clientY;
      if (!frame) frame = requestAnimationFrame(apply);
    });
    el.addEventListener('pointerleave', () => {
      if (frame) cancelAnimationFrame(frame);
      el.style.setProperty('--tilt', '');
      el.style.setProperty('--mx', '50%');
      el.style.setProperty('--my', '50%');
      el.style.willChange = '';
    });
  });
}
