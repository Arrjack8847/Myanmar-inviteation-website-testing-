'use strict';
/**
 * Golden Autumn Heritage — local demonstration prototype.
 * Change the sample values below for preview testing only.
 * A production order needs verified couple/event details and its own venue link.
 */
const DEMO = {
  firstName: 'Thiri',
  secondName: 'Min',
  // Demo placeholders: replace with the couple's confirmed parent names before publishing.
  firstFamily: "Parents' names to be added",
  secondFamily: "Parents' names to be added",
  weddingDateISO: '2027-06-20T16:30:00+06:30',
  displayDate: '20 JUNE 2027',
};
const CUSTOMER = window.WEDDING_CUSTOMIZATION || {};
// Explicit safe fields, populated before the derived event and countdown data.
for (const key of ['firstName','secondName','firstFamily','secondFamily','weddingDateISO','displayDate']) {
  if (typeof CUSTOMER.couple?.[key] === 'string') DEMO[key] = CUSTOMER.couple[key];
}

// Optional sample story: every chapter below is an explicit writing prompt,
// NOT a claim about any couple. Replace with approved details before publishing.
const LOVE_STORY = {
  introduction: 'The moments that make your story uniquely yours.',
  chapters: [
    {
      title: 'The Beginning',
      text: 'Add how the couple met or how their story first began.'
    },
    {
      title: 'Our Cherished Moments',
      text: 'Share a favorite memory or a moment that means a lot to them.'
    },
    {
      title: 'A New Chapter',
      text: 'Add a personal message about celebrating their next chapter together.'
    }
  ]
};
if (typeof CUSTOMER.story?.introduction === 'string') LOVE_STORY.introduction = CUSTOMER.story.introduction;
if (Array.isArray(CUSTOMER.story?.chapters)) {
  for (const [index,chapter] of CUSTOMER.story.chapters.entries()) {
    if (!LOVE_STORY.chapters[index] || !chapter) continue;
    for (const key of ['title','text']) {
      if (typeof chapter[key] === 'string') LOVE_STORY.chapters[index][key] = chapter[key];
    }
  }
}

function renderLoveStory() {
  const intro = document.querySelector('[data-story-intro]');
  if (intro) intro.textContent = LOVE_STORY.introduction;
  for (const [index, chapter] of LOVE_STORY.chapters.entries()) {
    const title = document.querySelector('[data-story-title="' + index + '"]');
    const text = document.querySelector('[data-story-text="' + index + '"]');
    if (title) title.textContent = chapter.title;
    if (text) text.textContent = chapter.text;
  }
}

// Customize verified wedding details here. Empty/unknown information stays visibly pending.
// A working map button requires BOTH a confirmed venue and an approved directions URL.
const WEDDING_EVENTS = {
  ceremony: {
    dateLabel: DEMO.displayDate,
    dateISO: DEMO.weddingDateISO.slice(0, 10),
    time: '4:30 PM · MYANMAR TIME', // Fictional sample event time
    venue: 'Venue to be confirmed',
    address: 'Yangon, Myanmar — sample city only',
    venueConfirmed: false,
    mapUrl: ''
  },
  reception: {
    dateLabel: 'Date to be confirmed',
    dateISO: '',
    time: 'Time to be confirmed',
    venue: 'Reception venue to be confirmed',
    address: 'Venue and address to be added',
    venueConfirmed: false,
    mapUrl: ''
  }
};
for (const kind of ['ceremony','reception']) {
  const custom = CUSTOMER.events?.[kind];
  if (!custom) continue;
  for (const key of ['dateLabel','dateISO','time','venue','address','mapUrl']) {
    if (typeof custom[key] === 'string') WEDDING_EVENTS[kind][key] = custom[key];
  }
  if (typeof custom.venueConfirmed === 'boolean') WEDDING_EVENTS[kind].venueConfirmed = custom.venueConfirmed;
}

// Only trusted Google Maps or Waze links may become clickable directions.
// The event's venueConfirmed flag must also be explicitly enabled.
function approvedMapUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  try {
    const url = new URL(rawUrl);
    if (url.protocol !== 'https:') return '';
    const host = url.hostname.toLowerCase();
    if (host === 'maps.app.goo.gl' || host === 'maps.google.com') return url.href;
    if ((host === 'google.com' || host === 'www.google.com') && url.pathname.startsWith('/maps')) return url.href;
    if ((host === 'waze.com' || host === 'www.waze.com') && (url.pathname.startsWith('/ul') || url.pathname.startsWith('/live-map'))) return url.href;
    return '';
  } catch {
    return '';
  }
}

function renderWeddingEvents() {
  for (const card of document.querySelectorAll('[data-event]')) {
    const event = WEDDING_EVENTS[card.dataset.event];
    if (!event) continue;
    for (const [field, value] of Object.entries({
      date: event.dateLabel || 'Date to be confirmed',
      time: event.time || 'Time to be confirmed',
      venue: event.venue || 'Venue to be confirmed',
      address: event.address || 'Address to be added'
    })) {
      const node = card.querySelector('[data-event-field="' + field + '"]');
      if (node) node.textContent = value;
    }
    const dateNode = card.querySelector('time[data-event-field="date"]');
    if (dateNode) {
      if (/^\d{4}-\d{2}-\d{2}$/.test(event.dateISO || '')) dateNode.dateTime = event.dateISO;
      else dateNode.removeAttribute('datetime');
    }
    const link = card.querySelector('[data-event-link]');
    const pending = card.querySelector('[data-event-pending]');
    const url = event.venueConfirmed ? approvedMapUrl(event.mapUrl) : '';
    if (link) {
      link.hidden = !url;
      if (url) link.href = url;
      else link.removeAttribute('href');
    }
    if (pending) pending.hidden = Boolean(url);
  }
}

const cover = document.getElementById('openingCover');
const openButton = document.getElementById('openInvitation');
const skipButton = document.getElementById('skipOpening');
const leafField = document.getElementById('leafField');
const mainContent = document.getElementById('mainContent');
const heroTitle = document.getElementById('heroTitle');
const openingEnvelope = document.querySelector('.envelope');
mainContent.inert = true;
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
let hasOpened = false;

for (const item of document.querySelectorAll('[data-name="first"]')) item.textContent = DEMO.firstName;
for (const item of document.querySelectorAll('[data-name="second"]')) item.textContent = DEMO.secondName;
for (const item of document.querySelectorAll('[data-family="first"]')) item.textContent = DEMO.firstFamily;
for (const item of document.querySelectorAll('[data-family="second"]')) item.textContent = DEMO.secondFamily;
for (const item of document.querySelectorAll('[data-date-text]')) item.textContent = DEMO.displayDate;
renderLoveStory();
renderWeddingEvents();

function makeLeaf(ambient = false, index = 0) {
  const leaf = document.createElement('img');
  leaf.alt = '';
  leaf.className = `falling-leaf ${ambient ? 'is-ambient' : 'is-gust'}`;
  // Reuse six original transparent PNG leaf variations for both gusts and drifting leaves.
  const leafAssets = [
    '23_leaf_golden_teak.png', '24_leaf_copper_teak.png', '25_leaf_burgundy_teak.png',
    '26_leaf_golden_bodhi.png', '27_leaf_orange_bodhi.png', '28_leaf_small_russet.png'
  ];
  const skinLeaves = window.INVITATION_ACTIVE_SKIN?.leaves;
  const images = Array.isArray(skinLeaves) && skinLeaves.length ? skinLeaves : leafAssets;
  leaf.src = images[index % images.length];
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
  if (!document.body.classList.contains('not-opened')) return;
  document.body.classList.remove('not-opened');
  document.body.classList.add('has-opened');
  // Deactivate the cover AFTER its animation and unlock the document.
  cover.setAttribute('aria-hidden', 'true');
  cover.removeAttribute('aria-modal');
  cover.inert = true;
  mainContent.inert = false;
  openButton.disabled = true;
  skipButton.disabled = true;
  if (heroTitle) heroTitle.focus({ preventScroll: true });
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

}
openButton.addEventListener('click', () => openInvitation());
skipButton.addEventListener('click', () => openInvitation(true));
// The full envelope is a proper keyboard-accessible button; its butterfly
// is decorative artwork inside that one target, not a second hidden control.
openingEnvelope.addEventListener('click', () => openInvitation());

// Keep keyboard focus inside the opening dialog until it is dismissed.
cover.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    event.preventDefault();
    openInvitation(true);
    return;
  }
  if (event.key !== 'Tab' || hasOpened) return;
  const controls = [openingEnvelope, openButton, skipButton].filter(node => !node.disabled);
  const current = controls.indexOf(document.activeElement);
  if (event.shiftKey && (current <= 0)) {
    event.preventDefault();
    controls[controls.length - 1].focus();
  } else if (!event.shiftKey && current === controls.length - 1) {
    event.preventDefault();
    controls[0].focus();
  }
});

// Art direction review only. The ?artReview=1 route opens the hero without a cover,
// strips UI overlays via CSS and freezes motion for master-scene comparisons.
// The normal guest experience is unchanged.
const previewParams = new URLSearchParams(window.location.search);
if (previewParams.get('artReview') === '1') {
  document.body.classList.add('art-review-mode');
  openInvitation(true);
} else if (previewParams.get('heroPreview') === '1') {
  // Design-review route: inspect the normal hero text without redoing the cover.
  openInvitation(true);
} else {
  // Explicit initial focus for an accessible modal invitation cover.
  openButton.focus({ preventScroll: true });
}

const counterKeys = ['days', 'hours', 'minutes', 'seconds'];
const countdownStatus = document.getElementById('countdownStatus');
const countdownDisplay = document.querySelector('.countdown-grid');
const customWeddingDate = typeof CUSTOMER.couple?.weddingDateISO === 'string' &&
  CUSTOMER.couple.weddingDateISO.trim().length > 0;
const countdownFootnote = document.querySelector('.countdown-footnote');
if (countdownFootnote && customWeddingDate) {
  countdownFootnote.textContent = 'Wedding countdown · based on the configured event date and time';
}
function updateCountdown() {
  const deadline = Date.parse(DEMO.weddingDateISO);
  const valid = Number.isFinite(deadline);
  const delta = valid ? Math.max(0, deadline - Date.now()) : 0;
  const totalSeconds = Math.floor(delta / 1000);
  const parts = [
    Math.floor(totalSeconds / 86400),
    Math.floor(totalSeconds / 3600) % 24,
    Math.floor(totalSeconds / 60) % 60,
    totalSeconds % 60
  ];
  counterKeys.forEach((key, index) => {
    const node = document.getElementById(key);
    if (node) node.textContent = valid ? String(parts[index]).padStart(2, '0') : '--';
  });
  if (countdownStatus) {
    countdownStatus.textContent = !valid
      ? 'Wedding date to be confirmed'
      : delta === 0
        ? 'The wedding day has arrived'
        : 'Until our beautiful day begins';
  }
  if (countdownDisplay) {
    countdownDisplay.setAttribute('aria-label', !valid
      ? 'Wedding date not yet set'
      : delta === 0
        ? 'The wedding date has arrived'
        : 'Time remaining until the wedding date');
  }
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
  const link = window.INVITATION_SHARE?.build(window.location.href,window.INVITATION_SKINS?.packs);
  if (!link) {
    showToast('This is a local preview. Publish the invitation before sharing a guest link.');
    return;
  }
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(link);
    } else {
      const input = document.createElement('textarea');
      input.value = link;
      document.body.appendChild(input);
      try {
        input.select();
        if (!document.execCommand('copy')) throw new Error('Clipboard unavailable');
      } finally {
        input.remove();
      }
    }
    showToast('Invitation link copied.');
  } catch {
    showToast('Copy the invitation URL from your browser address bar.');
  }
});
