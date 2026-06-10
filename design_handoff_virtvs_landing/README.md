# Virtvs — Drop I Landing Page · Developer Handoff

## What this is

A high-fidelity design reference for the **Virtvs** marketing landing page. Virtvs is a Roman-inspired premium streetwear brand. This page is a single-purpose conversion surface for **Drop I — FORTITVDO**, a limited release of 75 units (a Hercules-themed hoodie + a corduroy cap). The page's only goal is **email signup to the early-access drop list** — there is no checkout yet.

The files in `source/` are a **working HTML/React prototype** that captures the exact intended look, copy, layout, and interactions. They are a **design reference, not production code**. Your job is to recreate this faithfully in a production stack using that stack's conventions.

Brand register: **dark editorial / luxury streetwear with mythic depth** (think Aimé Leon Dore, Fear of God, A.P.C. crossed with Roman-inscription typography). Avoid anything that reads as "costume," "museum gift shop," or "gym motivation."

---

## Recommended stack

If the target repo is greenfield, use **Next.js (App Router) + Tailwind CSS + TypeScript**. The design tokens below map cleanly to a Tailwind theme. A single route (`/`) with section components is all that's needed. If the repo already has a stack, follow its conventions instead — the spec below is framework-agnostic.

---

## Fidelity bar: HIGH

Every hex value, font size, spacing value, and copy string in this package is final and signed off. Reproduce them exactly. **Do not paraphrase copy or "improve" wording** — every line has been iterated on with the client.

---

## Folder structure

```
design_handoff_virtvs_landing/
├── README.md            ← this file (read first)
├── source/
│   ├── index.html       ← page entry — loads CSS + React UMD + Babel + JSX
│   ├── styles.css       ← ALL styling. Source of truth for tokens, spacing, transitions (~750 lines)
│   ├── app.jsx          ← React app. All components + the CODEX data array
│   ├── image-slot.js    ← design-tool only. DO NOT PORT (see below)
│   └── tweaks-panel.jsx ← design-tool only. DO NOT PORT (see below)
└── assets/
    ├── fortitvdo-hoodie.png      ← hero preview + Drop I hoodie card (portrait)
    ├── virtvs-cap.png            ← Drop I cap card (square 1:1)
    ├── fortitvdo-details.png     ← hoodie construction spread (1892×1264)
    └── virtvs-cap-details.png    ← cap construction spread (landscape composite)
```

### Suggested production structure (Next.js example)

```
app/
  layout.tsx            ← fonts, <body> grain overlay, metadata
  page.tsx              ← composes the sections in order
  globals.css           ← port tokens from styles.css into @theme / :root
components/
  Nav.tsx
  Hero.tsx
  DropSection.tsx       ← product cards + construction blocks
  Symbolism.tsx         ← accordion
  Scarcity.tsx
  Signup.tsx            ← form + validation + success state
  Codex.tsx
  Footer.tsx
  StickyCTA.tsx
  Wreath.tsx            ← logo (inline the SVG locally)
public/
  wreath-logo.svg
  drop-i/               ← optimized WebP/AVIF product images
api/
  drop-list/route.ts    ← signup endpoint (you build this)
```

---

## Strip-before-shipping checklist

The prototype contains design-tool scaffolding that must NOT ship:

- [ ] **Remove `image-slot.js`** and all `<image-slot>` elements. They're a drag-to-swap placeholder for the designer. Replace each with a normal `<img>` (or `next/image`) pointing at the asset.
- [ ] **Remove `tweaks-panel.jsx`** and the `<TweaksPanel>` block in `App`. It's an in-design control panel (font/color/grain toggles) for the designer only.
- [ ] **Remove `TWEAK_DEFAULTS` + `useTweaks`** — hardcode the final values (listed below).
- [ ] **Drop Babel-in-browser** — use the build pipeline's JSX transform.
- [ ] **Trim `HEADLINES`** down to just the production headline (`Ad Astra / Per Aspera.`). The others were A/B options.
- [ ] **Inline the wreath SVG locally** instead of hotlinking `virtvs.co` (see Assets).
- [ ] **Optimize images** to WebP/AVIF with responsive `srcset`; lazy-load below-the-fold.

---

## Design tokens

### Color

| Token | Value | Usage |
|---|---|---|
| `--ink` | `#0a0908` | Page background (deep warm black) |
| `--ink-2` | `#131110` | Raised band (Scarcity section) |
| `--ink-3` | `#1b1816` | Inset panels |
| `--bone` | `#efe7d8` | Primary text on dark |
| `--bone-dim` | `rgba(239,231,216,0.78)` | Muted body |
| `--bone-faint` | `rgba(239,231,216,0.50)` | Tertiary labels |
| `--line` | `rgba(232,223,208,0.12)` | Subtle dividers |
| `--line-2` | `rgba(232,223,208,0.22)` | Card / button borders |
| `--accent` (oxblood) | `#6b1e23` | Primary accent — emphasis, scarcity, pulses |
| `--accent-gold` | `#8a7449` | Secondary accent (defined, sparingly used) |
| product backdrop | `#2c2c2c` | Product frame bg — **matches the studio gray in every product photo** |

**Critical:** the product frame color `#2c2c2c` is deliberately set to match the seamless studio backdrop in the photography. This makes products read as integrated catalog cards rather than floating cutouts. Keep frame bg and photo bg identical.

### Typography — TWO fonts only

| Role | Family | Notes |
|---|---|---|
| Display | **Cinzel** (400/500/600/700) | Roman-inscription face. **Caps-only, no lowercase, no italic.** All headlines, product names, virtue names |
| Everything else | **Cormorant Garamond** (400/500/600) | Body, lede, eyebrows, microcopy, form labels, code-block, footer. Letter-spaced + uppercased for "label" use; natural case for body |

No Inter, no Helvetica, no monospace font. Cormorant does double duty as both body serif and the letter-spaced "label/mono" style.

**Cinzel has no italic** — express emphasis with **weight bump (500→600) + oxblood color** at display sizes (e.g. "PER ASPERA." line is oxblood). At small sizes (product names) use **bone + weight only** — oxblood loses contrast below ~24px on dark.

#### Type scale (all display is uppercase)

```
h1.display     clamp(36px, 5.2vw, 86px)   ls 0.005em
h2.display     clamp(32px, 4.6vw, 72px)   ls 0.005em
h3.display     clamp(22px, 2.6vw, 38px)   ls 0.02em
.hero-tagline  clamp(20px, 1.9vw, 28px)   Cormorant — between display & lede
.lede          clamp(18px, 1.5vw, 22px)   Cormorant — bone @ opacity 0.94
.product-name  clamp(22px, 2.2vw, 30px)   Cinzel
.product-price clamp(20px, 1.8vw, 24px)   Cinzel, 1px bottom border under it
.eyebrow       12px  ls 0.32em  uppercase  bone-faint
.micro         12px  ls 0.28em  uppercase  bone-faint
body           17px / 1.5
```

### Spacing & layout
- Horizontal page gutter: `--pad: clamp(20px, 4vw, 56px)`
- Max content width: `1400px`, centered
- Standard section vertical padding: `clamp(80px, 12vh, 160px)`; statement sections (Symbolism, Signup, Codex): `clamp(110px, 16vh, 200px)`

### Corners, shadows, atmosphere
- Product/detail frames: **sharp 90° corners** (no radius)
- Buttons: **fully rounded pills** (radius 999px)
- Form fields: **no box** — underline only (1px bottom border)
- Scarcity chips: 2px radius
- Shadows used only on the sticky CTA and `.btn-lg` (values in `styles.css`)
- **Film grain:** a fixed `body::before` noise SVG at `opacity 0.05`, `mix-blend-mode: overlay`, over the whole page. Preserve it — it's load-bearing for the editorial feel.

---

## Page structure (top to bottom)

| # | Section | id | Notes |
|---|---|---|---|
| — | Nav (fixed) | — | Wreath + VIRTVS wordmark · links: Drop I / Meaning / Codex · "Join List" pill |
| 01 | Hero | `#top` | Headline, tagline, lede, 3 scarcity chips, big CTA + product preview card |
| 02 | Drop I | `#drop` | 2 product cards (with prices) + 2 construction spreads |
| 03 | Symbolism | `#symbolism` | "The first virtue: Fortitude." + 4-item accordion |
| 04 | Scarcity | — | "Limited first release." + 3 stat tiles (75 / I / 0) |
| 05 | Signup | `#signup` | Email form + optional SMS + preference selector + success state |
| 06 | Codex | `#codex` | 4-pillar virtue index, FORTITVDO active, rest forthcoming |
| — | Footer | — | Wreath + mantra + virtue litany |
| — | Sticky CTA | — | Appears after hero, hides near signup |

Full per-section visual + behavioral spec is in `SPEC.md`.

---

## Interactions

- **Smooth scroll** for nav anchors; all "Join"/"Get Early Access" buttons scroll to `#signup` with a 40px top offset.
- **Accordion** (Symbolism): one item open at a time; click-to-close; `max-height` slide (500ms ease). First item open by default.
- **Form validation:** email must match `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`; phone optional but if present needs ≥7 digits. Inline errors below each field.
- **Form success:** swap form for success state with a random 3-digit "position №" (placeholder until a real position service exists). "Add another email" resets.
- **Sticky CTA:** show when `scrollY > viewportHeight * 0.8` AND signup form top is > 60% viewport below the fold. Passive scroll listener.
- **Pulse:** `.product-status` pips + active Codex cell pulse 2.4s infinite (opacity 1 → 0.3).
- **Hover:** buttons lift `translateY(-1px)` + bg shift; cards step border `--line` → `--line-2`; nav links `bone-dim` → `bone`.

No animation libraries required — CSS transitions + light React state only.

---

## Backend you need to build

The prototype fakes signup success. Wire the form to a real endpoint:

- `POST /api/drop-list` with `{ email, phone?, preference }` where `preference ∈ {hoodie, hat, both}`
- Success `{ position: number }` → show success state with real position
- Error `{ error: string }` → set field error

Suggested: **Resend** (transactional) + **Klaviyo / Beehiiv / ConvertKit** (the actual list), or a Postgres table + SMTP. Add basic rate-limiting and email-format validation server-side too.

---

## Assets

All four product images sit on the same `#2c2c2c` studio backdrop so they integrate with the card frame color. They're large unoptimized PNGs — convert to WebP/AVIF and generate responsive variants for production (`next/image` does this automatically).

| File | Shape | Where used |
|---|---|---|
| `fortitvdo-hoodie.png` | portrait | Hero preview card (cover) + Drop I hoodie card (cover, 4:5 frame) |
| `virtvs-cap.png` | square | Drop I cap card (cover, **1:1 frame** — not 4:5) |
| `fortitvdo-details.png` | 1892×1264 | Hoodie "The details." construction spread |
| `virtvs-cap-details.png` | landscape | Cap "In the cap." construction spread |

### Brand logo

The wreath-V mark currently **hotlinks** `https://www.virtvs.co/wreath-logo-v-black-on-white.svg`, rendered via CSS mask so it picks up `--bone`:

```css
.wreath {
  background-color: var(--bone);
  -webkit-mask: url("…wreath-logo-v-black-on-white.svg") center / contain no-repeat;
          mask: url("…wreath-logo-v-black-on-white.svg") center / contain no-repeat;
}
```

**For production:** download that SVG into `/public/wreath-logo.svg` and update the path. Don't hotlink.

---

## Where the detail lives

- **`SPEC.md`** — exhaustive per-section spec (layout, every element, every copy string, the Codex data table, validation rules). Read it before writing components.
- **`source/styles.css`** — the authoritative values for every token, transition, gradient, and breakpoint.
- **`source/app.jsx`** — component structure and the `CODEX` data array. Mirror the component boundaries; ignore the `image-slot`/`tweaks` scaffolding.
