'use strict';
/**
 * Golden Autumn Heritage — local demonstration prototype.
 * Change the sample values below for preview testing only.
 * A production order needs verified couple/event details and its own venue link.
 */
const DEMO = {
  firstName: 'Thiri',
  secondName: 'Min',
  weddingDateISO: '2027-06-20T16:30:00+06:30',
  displayDate: '20 JUNE 2027',
};

const cover = document.getElementById('openingCover');
const openButton = document.getElementById('openInvitation');
const skipButton = document.getElementById('skipOpening');
const leafField = document.getElementById('leafField');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
let hasOpened = false;

for (const item of document.querySelectorAll('[data-name="first"]')) item.textContent = DEMO.firstName;
for (const item of document.querySelectorAll('[data-name="second"]')) item.textContent = DEMO.secondName;
for (const item of document.querySelectorAll('[data-date-text]')) item.textContent = DEMO.displayDate;

function makeLeaf(ambient = false, index = 0) {
  const leaf = document.createElement('img');
  leaf.alt = '';
  leaf.className = `falling-leaf ${ambient ? 'is-ambient' : 'is-gust'}`;
  // Reuse six original transparent PNG leaf variations for both gusts and drifting leaves.
  const leafAssets = [
    '23_leaf_golden_teak.png', '24_leaf_copper_teak.png', '25_leaf_burgundy_teak.png',
    '26_leaf_golden_bodhi.png', '27_leaf_orange_bodhi.png', '28_leaf_small_russet.png'
  ];
  leaf.src = leafAssets[index % leafAssets.length];
  const vw = document.documentElement.clientWidth;
  leaf.style.left = (ambient ? 5 + Math.random() * 90 : 12 + Math.random() * 75) + '%';
  leaf.style.top = ambient ? '-45px' : 27 + Math.random() * 55 + '%';
  leaf.style.width = 20 + Math.random() * (ambient ? 17 : 35) + 'px';
  leaf.style.setProperty('--dx', (ambient ? -45 + Math.random() * 90 : (vw > 600 ? 270 : 110) + Math.random() * 180) + 'px');
  leaf.style.setProperty('--dy', -(100 + Math.random() * 290) + 'px');
  leaf.style.setProperty('--rotation', (120 + Math.random() * 420) + 'deg');
  leaf.style.setProperty('--duration', (ambient ? 12 + Math.random() * 10 : 1.4 + Math.random() * 1.4) + 's');
  leaf.style.setProperty('--delay', (ambient ? 0 : Math.random() * 0.55) + 's');
  leaf.addEventListener('animationend', () => leaf.remove(), { once: true });
  leafField.appendChild(leaf);
}

function finishOpening() {
  cover.setAttribute('aria-hidden', 'true');
  cover.removeAttribute('role');
  document.body.classList.remove('not-opened');
  document.body.classList.add('has-opened');
  openButton.disabled = true;
  skipButton.disabled = true;
}

function openInvitation(skip = false) {
  if (hasOpened) return;
  hasOpened = true;
  if (skip || reducedMotion) {
    cover.classList.add('is-skipped');
    finishOpening();
  } else {
    cover.classList.add('is-revealing');
    for (let i = 0; i < 19; i++) makeLeaf(false, i);
    window.setTimeout(finishOpening, 2550);
  }
  if (!reducedMotion) {
    // Gentle, infrequent ambient leaves; never build up DOM nodes.
    window.setInterval(() => {
      if (document.visibilityState === 'visible' && leafField.childElementCount < 12) makeLeaf(true, Math.floor(Math.random() * 6));
    }, 4300);
  }
}
openButton.addEventListener('click', () => openInvitation());
skipButton.addEventListener('click', () => openInvitation(true));
document.getElementById('butterfly').addEventListener('click', () => openInvitation());
// Overlay butterfly is part of the visually accessible envelope; clicking anywhere on it also opens.
document.querySelector('.envelope').addEventListener('click', () => openInvitation());

const counterKeys = ['days', 'hours', 'minutes', 'seconds'];
function updateCountdown() {
  const delta = Math.max(0, new Date(DEMO.weddingDateISO).getTime() - Date.now());
  const totalSeconds = Math.floor(delta / 1000);
  const parts = [Math.floor(totalSeconds / 86400), Math.floor(totalSeconds / 3600) % 24, Math.floor(totalSeconds / 60) % 60, totalSeconds % 60];
  counterKeys.forEach((key, index) => { document.getElementById(key).textContent = String(parts[index]).padStart(2, '0'); });
}
updateCountdown();
setInterval(updateCountdown, 1000);

const toast = document.getElementById('toast');
let toastTimeout;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('is-visible'), 3000);
}
document.getElementById('shareButton').addEventListener('click', async () => {
  const link = window.location.href.split('#')[0];
  try {
    if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(link);
    else {
      const input = document.createElement('textarea'); input.value = link; document.body.appendChild(input); input.select();
      if (!document.execCommand('copy')) throw new Error('Clipboard unavailable'); input.remove();
    }
    showToast('Preview link copied. Use the same address while your local server runs.');
  } catch {
    showToast('Copy the URL from your browser address bar.');
  }
});
