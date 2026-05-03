// Lenis smooth scroll
let lenis = null;
if (window.Lenis && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  lenis = new window.Lenis({ smoothWheel: true, lerp: 0.09 });
  function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);
}

// Reveal-on-scroll fallback (used when GSAP isn't available)
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

// GSAP + ScrollTrigger scroll-linked transforms
if (window.gsap && window.ScrollTrigger && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  gsap.registerPlugin(ScrollTrigger);

  if (lenis) {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  // ===== Pinned scroll-zoom: image scales from small to fullscreen as you scroll =====
  gsap.utils.toArray('.scroll-pin-section').forEach((section) => {
    const target = section.querySelector('.scroll-pin-target');
    const overlay = section.querySelector('.scroll-pin-overlay');
    if (!target) return;

    gsap.fromTo(
      target,
      { scale: 0.45, borderRadius: '32px', opacity: 0.85 },
      {
        scale: 1.15,
        borderRadius: '0px',
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 1.0,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      }
    );
    if (overlay) {
      gsap.fromTo(
        overlay,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '+=60%',
            scrub: 1
          }
        }
      );
    }
  });

  // ===== Horizontal scroll: track translates X while page scrolls Y =====
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
        scrub: 1,
        invalidateOnRefresh: true
      }
    });
  });

  // ===== Number counter on scroll into view =====
  gsap.utils.toArray('[data-count]').forEach((el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const obj = { val: 0 };
    gsap.to(obj, {
      val: target,
      duration: 1.6,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
      onUpdate: () => { el.textContent = Math.round(obj.val) + suffix; }
    });
  });

  // ===== Subtle parallax on .parallax elements =====
  gsap.utils.toArray('.parallax').forEach((el) => {
    const speed = parseFloat(el.dataset.speed || '0.3');
    gsap.to(el, {
      yPercent: -speed * 100,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1 }
    });
  });
}

// Card pointer-position spotlight
document.querySelectorAll('.card').forEach((card) => {
  card.addEventListener('pointermove', (e) => {
    const rect = card.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * 100;
    const my = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mx', `${mx}%`);
    card.style.setProperty('--my', `${my}%`);
  });
});

// Tilt on cards
const tiltMax = 6;
document.querySelectorAll('.card, .feature-item').forEach((el) => {
  el.addEventListener('pointermove', (e) => {
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rx = (0.5 - y) * tiltMax;
    const ry = (x - 0.5) * tiltMax;
    el.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`;
  });
  el.addEventListener('pointerleave', () => { el.style.transform = ''; });
});
