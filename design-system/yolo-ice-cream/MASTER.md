# Design System Master File — YOLO Ice Cream

> **LOGIC:** When building a specific page, first check `design-system/yolo-ice-cream/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file. If not, strictly follow the rules below.

---

**Project:** YOLO Ice Cream — Aga Khan Walk, Nairobi (`yolocecream.vercel.app`)
**Source of truth:** `styles.css` `:root` tokens (verified against the live deployed build)
**Category:** Food & Beverage — ice cream / dessert (playful, warm, appetizing)
**Stack:** Vanilla HTML/CSS/JS (static site)

---

## Global Rules

### Color Palette (real `:root` tokens)

| Role | Token | Hex | Notes |
|------|-------|-----|-------|
| Primary / CTA | `--orange` | `#f04427` | Brand red-orange, primary conversion color |
| Deep orange | `--orange-deep` | `#d63417` | Visit-section bg (AA-safe behind white text), hover depth |
| Light orange | `--orange-light` | `#ff7958` | Eyebrows/accents on dark sections |
| Ink (text / dark bg) | `--ink` | `#2b100d` | Deep chocolate — main text & dark sections |
| Ink soft | `--ink-soft` | `#55332b` | Secondary dark surfaces |
| Cream bg | `--cream` | `#f7f1e7` | Light section background |
| White | `--white` | `#fffdf8` | Cards on light sections |
| Muted text | `--muted` | `#78635b` | Secondary/caption text (light sections only) |
| Border | `--border` | `rgba(43,16,13,0.12)` | Hairline dividers |
| Flavour accent | `--flavour-accent` | `#f25b75` | Pink flavour highlight (+ `--flavour-glow rgba(242,91,117,0.34)`) |

### ✅ Verified Contrast Ratios (WCAG AA: 4.5:1 normal / 3:1 large)

| Pair | Ratio | Verdict |
|------|-------|---------|
| ink `#2b100d` on cream `#f7f1e7` | 15.80:1 | ✅ Excellent — default body text |
| white `#fffdf8` on ink | 17.47:1 | ✅ Excellent |
| ink-soft `#55332b` on cream | 9.86:1 | ✅ Excellent |
| orange `#f04427` on ink | 4.70:1 | ✅ Passes AA (on dark) |
| orange-light `#ff7958` on ink | 6.87:1 | ✅ Passes AA — eyebrows on dark |
| **white on orange-deep `#d63417`** | **4.73:1** | ✅ **AA pass** — visit-section (fixed; was 3.71:1 on `--orange`) |
| muted `#78635b` on cream | 5.01:1 | ✅ Passes AA |
| muted `#78635b` on white | 5.53:1 | ✅ Passes AA |
| muted `#78635b` on ink | 3.16:1 | 🟠 Large-only — **never use muted on dark**; dark sections override to translucent cream |
| orange `#f04427` on cream | 3.36:1 | 🟠 Large/bold text only |
| white on orange `#f04427` | 3.71:1 | 🟠 Large/bold only — small white text on pure orange fails |

**Rules enforced by these numbers:**
- On **dark (ink)** sections, secondary text = translucent cream `rgba(247,241,231,0.68–0.7)` (≈8:1), never `--muted`.
- Small white text on an orange surface uses `--orange-deep` bg (4.73:1), not `--orange`.
- `--orange` is for large/bold CTAs and on-ink accents; body copy stays `--ink` on light.

### Typography

- **Display / Headings:** `--font-display: "Fraunces", Georgia, serif` (opsz 9..144, weights 500–800)
- **Body / UI:** `--font-body: "DM Sans", system-ui, sans-serif` (weights 400–700)
- **Mood:** warm, playful, editorial-premium — playful serif headlines over clean sans body

**CSS Import:**
```css
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700;9..144,800&display=swap');
```

### Layout & Spacing

| Token | Value |
|-------|-------|
| `--container` | `1440px` |
| `--gutter` | `clamp(22px, 6vw, 104px)` |
| `--header-h` | `70px` (82px in one breakpoint) |

### Radii

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-s` | `12px` | Chips, small controls |
| `--radius-m` | `24px` | Cards, images |
| `--radius-l` | `38px` | Feature panels, hero media |

### Shadows

| Token | Value |
|-------|-------|
| `--shadow-s` | `0 8px 28px rgba(43,16,13,0.06)` |
| `--shadow-m` | `0 24px 80px rgba(43,16,13,0.1)` |
| `--shadow-l` | `0 34px 90px rgba(43,16,13,0.18)` |

### Motion

| Token | Value |
|-------|-------|
| `--ease` | `cubic-bezier(0.2,0.75,0.2,1)` |
| `--t-fast` | `180ms` |
| `--t-med` | `420ms` |

---

## Section Background Map (rhythm)

Alternate light/dark for scroll rhythm:

| Section | Background | Secondary-text rule |
|---------|-----------|---------------------|
| hero | ink (dark) | translucent cream |
| story | cream (light) | `--muted` |
| orbit / flavours | light gradient | `--muted` |
| **signatures** | **ink (dark)** | translucent cream `rgba(247,241,231,0.68)` |
| menu | cream (light) | `--muted` |
| **gallery** | **ink (dark)** | translucent cream `rgba(247,241,231,0.7)` |
| celebrate | light gradient | `--muted` |
| location | `#e9decd` (light) | `--muted` |
| faq | cream (light) | `--muted` |
| **visit** | **`--orange-deep`** | white text (4.73:1) |

---

## Component Specs

### Buttons
```css
.btn-primary {
  background: var(--orange);
  color: var(--white);
  border-radius: var(--radius-s);
  font-weight: 700;
  transition: background var(--t-fast);
  cursor: pointer;
}
.btn-primary:hover { background: var(--orange-deep); }

/* CTA on the orange visit-section uses ink bg for contrast (17.47:1) */
.visit-section .cta { background: var(--ink); color: var(--white); }
.visit-section .cta:hover { background: var(--white); color: var(--ink); }
```

### Cards (menu / signature tiles)
```css
.card {
  background: var(--white);
  border-radius: var(--radius-m);
  box-shadow: var(--shadow-m);
  transition: box-shadow var(--t-med), transform var(--t-med);
  cursor: pointer;
}
.card:hover { box-shadow: var(--shadow-l); transform: translateY(-2px); }
```

---

## Anti-Patterns (Do NOT Use)

- ❌ `--muted` text on ink/dark sections (3.16:1) — use translucent cream instead
- ❌ Small white text on pure `--orange` (3.71:1) — use `--orange-deep` bg
- ❌ Emojis as icons — use SVG (Heroicons / Lucide)
- ❌ Missing `cursor:pointer` on clickable elements
- ❌ Instant state changes — use `--t-fast`/`--t-med` transitions
- ❌ Invisible focus states — keep visible `:focus-visible`
- ❌ Auto-playing video without reduced-motion fallback / off-screen pause
- ❌ Horizontal scroll or fixed-px container widths

---

## Pre-Delivery Checklist

- [ ] Secondary text on dark sections = translucent cream, not `--muted`
- [ ] Small white text on orange uses `--orange-deep` (visit-section already fixed)
- [ ] No emojis as icons (consistent SVG icon set)
- [ ] `cursor-pointer` on all clickable elements
- [ ] Hover states via `--t-fast`/`--t-med`
- [ ] Focus states visible for keyboard navigation
- [ ] `prefers-reduced-motion` respected (scroll video, carousel, orbit)
- [ ] Responsive: 375 / 768 / 1024 / 1440px
- [ ] No content hidden behind fixed header (`--header-h`)
- [ ] No horizontal scroll on mobile
- [ ] Touch targets ≥44px
