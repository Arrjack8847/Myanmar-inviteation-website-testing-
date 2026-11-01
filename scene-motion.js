/* Golden Autumn Heritage — Option A: keep complete paintings static, animate
 * only text and tiny decorative UI. No external library, parallax or scroll lock.
 * Content remains present in the HTML when JS/motion support is unavailable.
 */
'use strict';

(function initializeGardenMotion() {
  // Personalized Burmese/English names can be significantly longer than the
  // demo's names. Fit only the live HTML heading inside the painted arch.
  // Never stretch/crop the artwork or alter the couple's actual text.
  const heroTitle = document.getElementById('heroTitle');
  const heroWords = document.getElementById('heroWords');
  const heroSection = document.getElementById('home');
  if (heroTitle && heroWords && heroSection) {
    let pendingFit = false;
    const fitHeroNames = () => {
      pendingFit = false;
      heroTitle.style.removeProperty('font-size');
      const preferred = parseFloat(getComputedStyle(heroTitle).fontSize);
      if (!Number.isFinite(preferred)) return;
      const maximumWordsHeight = Math.min(heroSection.clientHeight * .33, 255);
      // A readable lower bound avoids making longer names microscopic.
      for (let font = preferred; font > 21; font -= 1) {
        const titleOverflow = heroTitle.scrollWidth > heroTitle.clientWidth + 2;
        const spanOverflow = [...heroTitle.children].some(el => el.scrollWidth > el.clientWidth + 2);
        if (!titleOverflow && !spanOverflow && heroWords.offsetHeight <= maximumWordsHeight) break;
        heroTitle.style.fontSize = Math.max(21, font - 1) + 'px';
      }
    };
    const queueHeroFit = () => {
      if (pendingFit) return;
      pendingFit = true;
      requestAnimationFrame(fitHeroNames);
    };
    queueHeroFit();
    document.fonts?.ready.then(queueHeroFit);
    if (typeof ResizeObserver !== 'undefined') {
      const sizeObserver = new ResizeObserver(queueHeroFit);
      sizeObserver.observe(heroSection);
    } else {
      window.addEventListener('resize', queueHeroFit, {passive:true});
    }
    if (typeof MutationObserver !== 'undefined') {
      const nameObserver = new MutationObserver(queueHeroFit);
      nameObserver.observe(heroTitle, {subtree:true,childList:true,characterData:true});
    }
  }

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

  // The small resting butterfly is a user-triggered replay, not ambient
  // scenery. Ignore rapid double taps, and never steal keyboard focus.
  const butterfly = document.getElementById('heroButterfly');
  if (butterfly) {
    butterfly.addEventListener('click', () => {
      if (butterfly.classList.contains('is-flying') ||
          butterfly.classList.contains('is-still-magic')) return;

      if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
        butterfly.classList.add('is-still-magic');
        window.setTimeout(() => butterfly.classList.remove('is-still-magic'), 550);
        return;
      }

      butterfly.classList.add('is-flying');
      window.setTimeout(() => butterfly.classList.remove('is-flying'), 1750);
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
