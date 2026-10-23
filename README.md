# YOLO Ice Cream

A responsive editorial website for YOLO Ice Cream at Aga Khan Walk, Nairobi.
It runs as a static site with vanilla HTML, CSS and JavaScript — no build step,
no framework, no dependencies.

Live site: [yolocecream.vercel.app](https://yolocecream.vercel.app)

## Visual direction

- **Typography:** Fraunces display headlines paired with DM Sans for body copy
  and navigation.
- **Palette:** warm cream `#f7f1e7`, cocoa ink `#2b100d`, YOLO orange `#f04427`.
- **Layout:** cinematic scroll-controlled hero, editorial story section,
  manually navigated horizontal flavour carousel, signature-creations feature
  strip, filterable menu, photo wall, a celebrations section that routes
  enquiries to the shop's phone and Instagram, embedded Google map, an FAQ with
  structured data, and a visit CTA.
- The flavour carousel is fully user-controlled — drag, swipe, arrow buttons and
  keyboard arrows. It does not auto-rotate.
- The hero MP4 scrubs forward and backward with page scroll. The poster image is
  the fallback, and `prefers-reduced-motion` disables scrubbing entirely.
- Choosing a flavour in the hero re-themes the section (glow tint + headline
  accent) via `data-flavour` CSS custom properties.

## Run locally

From this folder:

```
python -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000).

All asset paths are **relative**, so the site also works from any subfolder or
static host without configuration.

## Project structure

- `index.html` — semantic page structure, SEO/Open Graph metadata, JSON-LD
  (`IceCreamShop`), the no-JavaScript menu fallback and the mobile navigation
  panel
- `styles.css` — single consolidated stylesheet: design tokens, layout,
  responsive states, scroll reveals and reduced-motion support
- `src/menu-data.js` — menu names, prices and representative image metadata
  (single source of truth for the rendered menu)
- `src/app.js` — hero scroll-video, flavour theming, carousel drag/keyboard
  controls, menu rendering + category filters, mobile navigation, header
  scrolled state and reading-progress bar, scroll reveals and image fallbacks
- `favicon.svg` — site icon
- `assets/images/` — hero, gallery, menu and brand photography
- `videos/yolo_ice_cream_hero.mp4` — scroll-scrubbed hero video
  (see [Performance notes](#performance-notes))

## Content and image notes

- Menu names and listed prices come from the supplied brief. Familiar Stranger,
  Time Keeper and My Ex have no listed price, so their cards omit the price
  line.
- No exact photographs or factual descriptions were verified for the named menu
  creations. Menu cards show representative stock photography matched to each
  item's mood and are labelled "Representative image" on the card itself.
- The YOLO Wall uses supplied mood photography; its tiles are not represented as
  real customer posts.
- Instagram is [@yolo_icec](https://www.instagram.com/yolo_icec/).
- The address, phone number and Google Maps link come from the supplied brief.
  The embedded map is a plain Google Maps embed — no API key and no invented
  coordinates.
- Opening hours are deliberately not published anywhere, because none were
  verified.
- The Celebrations section is invitation-only copy. It deliberately claims no
  packages, pricing or services — enquiries simply route to the verified phone
  number and Instagram handle. Add specific offers only once YOLO confirms them.
- The Signature creations strip (Tobby on a Boat, Sugar Lips, Therapy,
  Familiar Stranger) is an editorial pick, not a claim of popularity — swap the
  four items any time in `index.html`.
- The FAQ answers only verified facts. The opening-hours question is answered
  honestly ("call or check Instagram") because no verified hours exist. Every
  FAQ answer is mirrored in the `FAQPage` JSON-LD in `index.html` — if you edit
  an answer, update both.

## SEO

`index.html` ships with a canonical URL, Open Graph and Twitter card tags, plus
`IceCreamShop` and `FAQPage` JSON-LD structured data. If the domain changes,
update:

- `<link rel="canonical">`
- `og:url`, `og:image`, `twitter:image`
- the `url`, `image` and `hasMap` fields in the JSON-LD block

## Performance notes

- The hero video should stay small. Aim for **under ~3 MB**: trim to 6–10
  seconds, cap at 1280px wide, remove audio, and re-encode with faststart:

  ```
  ffmpeg -i input.mp4 -t 8 -vf "scale=1280:-2" -c:v libx264 -crf 30 \
    -preset slow -an -movflags +faststart videos/yolo_ice_cream_hero.mp4
  ```

- The video element uses `preload="metadata"` so the full file is never
  downloaded up front; scrubbing streams frames on demand.
- Every below-the-fold image uses `loading="lazy" decoding="async"`.

## Accessibility

- Skip-to-content link, visible focus states and labelled landmarks.
- The mobile navigation is a real button with `aria-expanded` / `aria-controls`,
  closes on Escape and returns focus to the toggle.
- The flavour carousel is keyboard-operable and announces itself as a labelled
  region.
- All motion respects `prefers-reduced-motion`.
