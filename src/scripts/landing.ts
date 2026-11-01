const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- появление блоков ---------- */
const revealEls = document.querySelectorAll<HTMLElement>('[data-reveal]');
if (!('IntersectionObserver' in window) || reduce) {
  revealEls.forEach((el) => el.classList.add('is-in'));
} else {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  );
  revealEls.forEach((el) => io.observe(el));
}

/* ---------- мысли: зачёркиваем и «публикуем» ---------- */
const notes = document.querySelectorAll<HTMLElement>('.note');
if (reduce || !('IntersectionObserver' in window)) {
  notes.forEach((n) => n.classList.add('is-done'));
} else {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target as HTMLElement;
        const i = Number(getComputedStyle(el).getPropertyValue('--i') || 0);
        window.setTimeout(() => el.classList.add('is-done'), 900 + i * 450);
        io.unobserve(el);
      });
    },
    { threshold: 0.7 },
  );
  notes.forEach((n) => io.observe(n));
}

/* ---------- аккордеоны (программа, вопросы) ---------- */
document.querySelectorAll<HTMLElement>('[data-acc]').forEach((item) => {
  const btn = item.querySelector<HTMLButtonElement>('[data-acc-btn]');
  btn?.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') !== 'true';
    btn.setAttribute('aria-expanded', String(open));
    item.classList.toggle('is-open', open);
  });
});

/* ---------- лёгкий параллакс фото ---------- */
const parallax = document.querySelectorAll<HTMLElement>('[data-parallax]');
if (!reduce && parallax.length && window.matchMedia('(min-width: 960px)').matches) {
  let ticking = false;
  const update = () => {
    const vh = window.innerHeight;
    parallax.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      const p = (r.top + r.height / 2 - vh / 2) / vh; // −0.5…0.5
      el.style.transform = `translate3d(0, ${(p * -24).toFixed(1)}px, 0)`;
    });
    ticking = false;
  };
  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true },
  );
  update();
}

/* ---------- липкая кнопка на мобильном ---------- */
const sticky = document.querySelector<HTMLElement>('[data-sticky]');
const hero = document.querySelector('#top');
const hideZones = document.querySelectorAll('[data-final], #pricing, footer');
if (sticky && hero && 'IntersectionObserver' in window) {
  let heroVisible = true;
  const visibleZones = new Set<Element>();
  const apply = () => {
    const show = !heroVisible && visibleZones.size === 0;
    sticky.classList.toggle('is-shown', show);
    sticky.setAttribute('aria-hidden', String(!show));
    sticky.querySelector('a')?.setAttribute('tabindex', show ? '0' : '-1');
  };
  new IntersectionObserver(([e]) => {
    heroVisible = !!e?.isIntersecting;
    apply();
  }).observe(hero);
  const zoneIo = new IntersectionObserver((entries) => {
    entries.forEach((e) => (e.isIntersecting ? visibleZones.add(e.target) : visibleZones.delete(e.target)));
    apply();
  });
  hideZones.forEach((z) => zoneIo.observe(z));
}

/* ---------- цена старта: после даты — обычная цена (считаем в браузере) ---------- */
document.querySelectorAll<HTMLElement>('[data-presale-until]').forEach((block) => {
  const until = Date.parse(block.dataset.presaleUntil ?? '');
  if (Number.isNaN(until)) return;
  const active = Date.now() < until;
  const regular = block.querySelector<HTMLElement>('[data-price-regular]');
  const presale = block.querySelector<HTMLElement>('[data-price-presale]');
  if (regular) regular.hidden = active;
  if (presale) presale.hidden = !active;
  const stickyPrice = document.querySelector<HTMLElement>('[data-sticky-price]');
  if (stickyPrice) stickyPrice.textContent = block.dataset[active ? 'labelStart' : 'labelRegular'] ?? stickyPrice.textContent;
});
