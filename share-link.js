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
    // Local, LAN and reserved addresses are not public guest links.
    const ipv4=host.match(/^([0-9]{1,3})[.]([0-9]{1,3})[.]([0-9]{1,3})[.]([0-9]{1,3})$/);
    const localIPv4=ipv4 && (
      [0,10,127].includes(Number(ipv4[1])) ||
      (Number(ipv4[1])===192 && Number(ipv4[2])===168) ||
      (Number(ipv4[1])===169 && Number(ipv4[2])===254) ||
      (Number(ipv4[1])===172 && Number(ipv4[2])>=16 && Number(ipv4[2])<=31)
    );
    if (host === 'localhost' || host.endsWith('.localhost') ||
        host === '::1' || host === '0.0.0.0' ||
        host.startsWith('fe80:') || host.startsWith('fc') || host.startsWith('fd') ||
        host.endsWith('.local') || localIPv4) return null;
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
