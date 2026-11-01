# Client release checklist

The public demo intentionally contains **sample** names, date and venue
placeholders. Never deliver that content as if it were a real wedding.

- [ ] Exact couple names and both families confirmed
- [ ] Invitation copy and Myanmar-language formality approved
- [ ] Date, time, time zone and countdown checked
- [ ] Ceremony and reception venue/address checked
- [ ] Venue-confirmed map URLs point to the correct locations
- [ ] Story wording and photos used with permission
- [ ] Correct skin selected in `wedding-config.js`
- [ ] Verify 320px/390px/430px screens and the 2 scene joins
- [ ] Check opening button, butterfly, reduced-motion and page swipe
- [ ] Check real physical iPhone Safari and Android Chrome
- [ ] Confirm each client has their own deployment/data separation
- [ ] Remove demo-only notices only after information is final
- [ ] Update each customer's preview title, social sharing image and URL
- [ ] Retest the final deployed public URL
- [ ] Obtain customer's final sign-off before distributing to guests

## Local tests
```powershell
node tests/smoke.cjs
node tests/skin-system.cjs
node tests/hero-interaction.cjs
node server.js
```

Real mobile browser CI: `.github/workflows/mobile-browser-qa.yml`.
Product preview: `skins-gallery.html`.
