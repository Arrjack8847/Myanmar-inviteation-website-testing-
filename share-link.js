/* Build a guest-shareable URL; omit art-review, hero-preview, tracking and
 * fragment state. Preserve only an explicitly registered artwork skin.
 * Never advertise a localhost preview as a working guest invitation.
 */
'use strict';
(function installShareLink() {
  function build(url, registeredSkins) {
    let parsed;
    try { parsed = new URL(url); } catch { return null; }
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return null;
    const host = parsed.hostname.toLowerCase().replace(/^\[|\]$/g, '');
    if (host === 'localhost' || host.endsWith('.localhost') ||
        host === '127.0.0.1' || host === '0.0.0.0' || host === '::1' ||
        host.endsWith('.local')) return null;
    const skin = parsed.searchParams.get('skin');
    parsed.search = '';
    parsed.hash = '';
    if (skin && registeredSkins && Object.prototype.hasOwnProperty.call(registeredSkins, skin)) {
      parsed.searchParams.set('skin', skin);
    }
    return parsed.href;
  }
  window.INVITATION_SHARE = Object.freeze({build});
})();
