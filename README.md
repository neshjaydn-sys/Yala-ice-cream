# YOLO Ice Cream

A lightweight, responsive website for YOLO Ice Cream at Aga Khan Walk, Nairobi. It runs as a static site with vanilla HTML, CSS and JavaScript.

## Run locally

From this folder, start Python’s built-in static server:

    python -m http.server 8000

Open http://localhost:8000.

## Content and image notes

- The menu names and listed prices come from the supplied brief. Familiar Stranger, Time Keeper and My Ex have no listed price.
- No exact photographs or factual descriptions were verified for the named menu creations. Menu cards show representative stock photography (free-to-use images from Pexels) matched to each item’s mood — they illustrate the style, not the exact YOLO creation — and fall back to abstract graphic studies, identified as artwork, whenever an image cannot load. Featured creations still use abstract graphic studies.
- The hero opens on a supplied chocolate-ice-cream photograph used as a static campaign mood image. It is not presented as a specific menu product; `assets/images/hero/choc-wide.webp` is cut from that single photograph.
- The YOLO Wall uses the supplied interior photograph from [NairobiEats](https://nairobieats.co.ke/reviews/yolo-ice-cream/). Its decorative tiles are not represented as real posts.
- Instagram is `@yolo_icec`. A public TikTok listing with the same handle and matching shop bio was found; the site links directly to that handle.
- The address, phone and Google Maps directions link come from the supplied brief. The location card opens that exact Maps destination and uses a verified YOLO interior photo; it does not rely on a map API or invent coordinates.
- Birthday copy does not claim specific packages, pricing or services.

## Project structure

- `index.html` — semantic page structure, SEO metadata and no-JavaScript menu summary
- `styles.css` — visual system, layout, responsive states and motion preferences
- `src/menu-data.js` — menu entries, prices and representative image metadata
- `src/app.js` — static hero stage (photo + ambient motion), menu filtering, product dialog, flavour cycle, navigation, reveals, the scroll gallery (pinned flavour-moods stage, scrub scale and parallax, with reduced-motion fallback) and map fallback
- `assets/images/hero/` — the hero stage photograph cut from the supplied image, plus alternate crops and `flavour-sculpture.svg` fallback artwork
- `assets/images/gallery/` — supplied mood photography used by the story feature, flavour moods stage, showcase grid, YOLO Wall strip and masked shot reveals
