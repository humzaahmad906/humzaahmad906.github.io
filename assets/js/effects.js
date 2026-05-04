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

// Newsletter form — placeholder until you wire it to a service
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
