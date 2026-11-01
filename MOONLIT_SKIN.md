# Moonlit Amethyst — second matching palette pack

The second skin is derived from the original Golden Autumn Heritage **owned artwork**
using a consistent twilight/amethyst grade. It keeps exactly the same painting
composition, gateway opening and event panel coordinates. It is a **palette
variant**, not a newly illustrated separate environment.

Its generated images live in `skins/moonlit-amethyst/`:
- gateway.png + gateway.webp (853×1844)
- family.png + family.webp (1086×1448)
- events.png + events.webp (1086×1448)
- six leaf PNGs, three butterfly sprites, floral sprig, envelope, seal,
  divider and corner PNGs.

`scripts/generate_moonlit_skin.py` reproduces every asset from originals
and preserves alpha/transparency. The code and artwork generation are
isolated from customer/event content.

Select `moonlit-amethyst` in `wedding-config.js` for a customer-specific
copy, or preview the registered design at `?skin=moonlit-amethyst`.
Both skin options are available in the merged V4 `main` branch.
