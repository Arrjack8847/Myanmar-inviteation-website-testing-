/* Golden Autumn Heritage — Option A: keep complete paintings static, animate
 * only text and tiny decorative UI. No external library, parallax or scroll lock.
 * Content remains present in the HTML when JS/motion support is unavailable.
 */
'use strict';

(function initializeGardenMotion() {
  const toggle = document.getElementById('blessingToggle');
  const blessing = document.getElementById('invitationBlessing');
  const blessingLabel = toggle?.querySelector('.heritage-blessing-label');

  // A deliberate, reversible interaction. The extra text lives in HTML and
  // stays out of the tab order when its panel is closed.
  if (toggle && blessing) {
    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      blessing.hidden = isOpen;
      toggle.setAttribute('aria-expanded', String(!isOpen));
      if (blessingLabel) blessingLabel.textContent = isOpen ? 'Reveal a blessing' : 'Hide blessing';
    });
  }

  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  if (reduced?.matches || !('IntersectionObserver' in window)) return;

  const descriptors = [
    ['#invitation .invitation-section-intro', 0],
    ['#invitation .heritage-families', 80],
    ['#invitation .heritage-invitation-main', 120],
    ['#invitation .heritage-invitation-translation', 160],
    ['#details .celebration-event-inner', 60],
    ['#details .event-reading-title', 0],
    ['#details .event-reading-card', 110]
  ];
  const targets = [];
  for (const [selector, delay] of descriptors) {
    for (const element of document.querySelectorAll(selector)) {
      element.classList.add('motion-reveal');
      element.style.setProperty('--scene-reveal-delay', delay + 'ms');
      targets.push(element);
    }
  }
  if (!targets.length) return;

  let observer;
  const showAll = () => {
    document.documentElement.classList.remove('motion-enabled');
    targets.forEach(element => element.classList.add('is-visible'));
    observer?.disconnect();
  };
  try {
    observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }, { root: null, rootMargin: '0px 0px -7% 0px', threshold: 0.08 });
    targets.forEach(element => observer.observe(element));
    document.documentElement.classList.add('motion-enabled');
  } catch {
    showAll();
    return;
  }
  if (reduced) {
    if (typeof reduced.addEventListener === 'function') {
      reduced.addEventListener('change', event => { if (event.matches) showAll(); });
    } else if (typeof reduced.addListener === 'function') {
      reduced.addListener(event => { if (event.matches) showAll(); });
    }
  }
})();
