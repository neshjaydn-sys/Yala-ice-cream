# Changelog — YOLO Ice Cream site overhaul

Every issue from the code review, fixed. Files changed: `index.html`,
`styles.css`, `src/app.js`, `src/menu-data.js`, `README.md`.

## 🔴 Critical fixes

### 1. `styles.css` was two complete stylesheets glued together inside Markdown fences
- The file literally started with ```` ```css ```` (line 1) and had a closing
  ```` ``` ```` at line 1201 — pasted from a chat response. `index.html` also had
  a stray ```` ``` ```` after `</html>` (line 224).
- Lines 1–1201 were a stale "premium" sheet; lines 1203–1287 were a full
  "editorial redesign" with **different design tokens** (`--yolo-orange:#f73b20`
  vs `#f04427`, `--font-display:"Playfair Display"` — a font that was never even
  loaded — vs `"Fraunces"`).

**Fix:** one consolidated stylesheet, zero fences, single token set. The two
sheets' conflicts produced real bugs, all resolved below.

### 2. Brand logo was invisible on the scrolled header
`.brand{color:var(--yolo-white)}` (old L149) survived the header turning light
cream on scroll — white text on cream.

**Fix:** `.brand` now inherits `color` from the header (white over the hero,
ink when scrolled). No hardcoded brand colour to fight the state change.

### 3. Mobile navigation was completely broken
Old block 1 hid all nav links under 760px (`display:none`), while old block 2
tried to make the nav a horizontal scroll strip but only set `flex` — which
cannot override `display:none`. Net result on phones: only the "Visit YOLO"
pill was reachable; no way to navigate the page.

**Fix:** real mobile navigation — a hamburger button (`aria-expanded` /
`aria-controls`), full-screen overlay panel, closes on link click or Escape,
locks body scroll, returns focus to the toggle.

### 4. The full menu never rendered — 11 of 14 items and every price were missing
`app.js` gated rendering on `#menu-grid` existing, but the HTML only had
`<div class="menu-grid">` (no id). The category-filter code was dead too.

**Fix:** `id="menu-grid"` added; all 14 items render from `src/menu-data.js`
with prices, and 3 category filters (All / Premiums / Other favourites) now
work. The full static menu is also in the HTML as a no-JavaScript fallback.

### 5. 24 MB hero video downloaded on page load
`preload="auto"` pulled the entire video before anything rendered — and made
`git clone` time out repeatedly.

**Fix:** `preload="metadata"` (the full file is never fetched up front;
scrubbing streams frames on demand) + the video re-encoded to a fraction of
its size (see `videos/` — replace with the optimized file). `app.js` also now
pauses scrubbing when the hero scrolls out of view and hides the video on
load error so the poster/gradient fallback shows.

### 6. Every asset path was root-absolute (`/styles.css`, `/assets/...`)
Broke `file://` double-click opening and any subdirectory deploy (e.g. GitHub
Pages project sites → everything 404s).

**Fix:** all paths relative. Works from any folder or host with zero config.

### 7. Invalid `will-change: contents`
Not a valid value; browsers ignored it. Removed.

## 🟡 Functional upgrades

- **Flavour selector now actually does something.** Previously it only swapped
  two lines of text. Now `data-flavour` drives CSS custom properties that
  re-tint the hero glow, fallback gradient and headline accent colour with a
  smooth transition.
- **Flavour carousel:** drag-to-scroll with the mouse (pointer events,
  touch keeps native scrolling), arrow buttons that disable at the ends,
  keyboard arrows, scroll-snap.
- **Menu images:** `aspect-ratio: 4/4.6` now works (the old fixed `height`
  from the stale sheet made every aspect-ratio rule dead).
- **Reading-progress bar** in the header.
- **Scroll reveals** with a proper `prefers-reduced-motion` fallback.

## 🟠 Repo hygiene (manual steps — see apply-fixes.ps1)

- Delete `Images/image 1_files/` — browser "Save page as" artifacts (~2.3 MB,
  byte-identical duplicates of `assets/images/gallery/*`).
- Delete `Images/` entirely — unused by the site.
- Delete `src/components/` — an orphaned React `"use client"` component
  (`roundcarousel.tsx`) with unrelated Cloudflare URLs, in a vanilla-JS repo
  with no bundler. Nothing imported it.
- Re-encode `videos/yolo_ice_cream_hero.mp4` (command in README).

## 🔵 SEO & polish

- Favicon link added (`favicon.svg` was in the repo but never referenced).
- Open Graph + Twitter card tags, canonical URL, `IceCreamShop` JSON-LD
  structured data — shared links on Instagram/WhatsApp now render properly.
- Skip-to-content link, visible focus states, `decoding="async"` and
  `loading="lazy"` on below-fold images.
- `README.md` rewritten to match the actual code (the old one described a
  "product dialog", "flavour cycle", "map fallback" and pinned scroll gallery
  that never existed).

## ✨ Additions

### Celebrations section (`#celebrate`, between the gallery and location)
- "Celebrate like you mean it." — birthday / team-treat / just-because
  occasions with **Call to plan** (`tel:`) and **Message us on Instagram** CTAs.
- Deliberately claims no packages, pricing or services: enquiries route to the
  verified phone number and `@yolo_icec`, per the project's no-invented-facts
  rule.
- Warm gradient panel with an overlapping photo collage and a rotated orange
  badge; fully responsive (collage restacks on mobile).
- Added to the desktop nav, the mobile nav panel, and reuses the existing
  `.reveal` scroll animation.

### Signature creations strip (`#signatures`, between flavours and menu)
- Dark cocoa editorial band with four large 3:4 cards: **Tobby on a Boat**
  (KES 1,020), **Sugar Lips** (KES 1,490), **Therapy** (KES 590) and
  **Familiar Stranger** (no listed price — chip omitted, matching the menu).
- Floating price chips, category eyebrow, gradient captions, hover zoom, and a
  "See the full menu" CTA. Grid: 4-up → 2-up under 1000px (keeps 2-up on
  phones so the strip stays scannable).
- Selection is an editorial pick, not a popularity claim; swap items freely.

### FAQ section (`#faq`, between location and visit CTA)
- Six native `<details>/<summary>` accordions — **zero JavaScript**, fully
  keyboard/screen-reader accessible, with a rotating +/− indicator.
- Answers use only verified facts. Opening hours are answered honestly
  (call/Instagram) rather than invented.
- **`FAQPage` JSON-LD** added to `<head>` with all six questions mirrored —
  eligible for Google's FAQ rich results. Both JSON-LD blocks parse as valid
  JSON (verified).
- "FAQ" added to the desktop and mobile navigation.

## Verified

- 32 local asset references → **0 missing**
- JSON-LD parses as valid JSON
- CSS braces balanced, 0 Markdown fences in any file
- `node --check` passes on `app.js`
- Every `$("#id")` selector in JS resolves to an id that exists in the HTML
