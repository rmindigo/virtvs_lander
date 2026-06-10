# Virtvs Drop I — Full Section Spec

Exhaustive build spec. Pair with `README.md` (tokens, stack, strip list) and `source/styles.css` (authoritative values). **All copy is final — reproduce verbatim.**

---

## Nav (fixed top)

- `position: fixed; top:0; left:0; right:0; z-index:50`
- Background `linear-gradient(to bottom, rgba(10,9,8,0.85), rgba(10,9,8,0))` + `backdrop-filter: blur(8px) saturate(120%)`
- Padding `18px var(--pad)`, flex space-between
- **Left:** wreath-V logo (28px) + `VIRTVS` wordmark (Cinzel, 22px, ls 0.18em), gap 12px
- **Right:** 3 anchor links + 1 pill button, gap 22px
  - Links (mono-style label, 11px, ls 0.2em, uppercase, bone-dim → bone on hover): `Drop I` → `#drop`, `Meaning` → `#symbolism`, `Codex` → `#codex`
  - Button `Join List`: outlined pill, `1px solid var(--line-2)`, bg `rgba(232,223,208,0.04)` → `0.10` on hover; scrolls to `#signup`

---

## 01 — Hero

Two-column grid above the fold (`1.1fr 1fr`, column-gap `clamp(30px,5vw,80px)`), `min-height: 100vh`. Collapses to 1-col below 900px (product card moves below copy).

**Background** (all CSS, no image): layered radial + linear gradients forming a cinematic dark scene, a `repeating-linear-gradient(102deg, …)` stone-striation overlay at low opacity, and a radial vignette. See `.hero-frame` in styles.css.

### Left column (`.hero-text`, vertical stack)
> NOTE: the eyebrow/metadata row and small wreath that used to sit above the headline were **removed** — the hero now opens directly on the headline. Don't reintroduce them.

1. **Headline** `h1.display`:
   ```
   AD ASTRA
   PER ASPERA.
   ```
   Two lines (`<br/>` between). Second line "PER ASPERA." in **oxblood** (`--accent`) via weight-bump emphasis.
2. **Tagline** `.hero-tagline` (Cormorant, ~24px, tucked close under headline): `Timeless meaning. Modern form.`
3. **Lede** `.lede`: `Virtvs is a limited streetwear brand built on Roman virtue, myth, and modern discipline. Drop I begins with the Hercules FORTITVDO hoodie and the Virtvs black corduroy hat — 75 units, early access first.` (final sentence "75 units, early access first." bolded to full bone via `<b>`)
4. **Scarcity chips** (`.scarcity-badges`, flex wrap, gap 8px):
   - `● 75 Units Only` — **lead** variant: bg `rgba(107,30,35,0.18)`, border `rgba(107,30,35,0.55)`, oxblood pip
   - `Early Access First` — neutral
   - `No Restocks Planned` — neutral
   - (neutral chip: mono 10.5px, ls 0.22em, uppercase, border `--line-2`, bg `rgba(232,223,208,0.04)`)
5. **Primary CTA** `.btn.btn-lg`: `Join the Drop List →` — bone fill, ink text, pill, padding 20×30, ls 0.26em, drop-shadow. Hover: `translateY(-2px)` + deeper shadow.
6. **Microcopy** `.micro`: `Free · No spam · Only when the drop moves`

### Right column (`.hero-product`, `.hero-product-frame`)
- Bordered frame, bg `#2c2c2c`, taller than text column, sharp corners
- `fortitvdo-hoodie.png`, `object-fit: cover`, fills frame
- Top + bottom dark gradient strips (~96px) so overlay text keeps contrast:
  `linear-gradient(180deg, #0a0908 0%, rgba(10,9,8,0.96) 45%, rgba(10,9,8,0.75) 70%, rgba(10,9,8,0))` (mirror for bottom)
- **Overlay** (`.hero-product-overlay`, z-index 2, padding 20×22, space-between column):
  - Top-left:
    - `001 · Drop I` (`.item-id` — mono label, 13px, ls 0.34em)
    - `Hercules FORTITVDO Hoodie` (`.item-name` — Cinzel, clamp(19px,1.85vw,26px), "FORTITVDO" weight-bumped to bone)
    - *(No XII chip top-right — it was removed. Leave the top-right empty.)*
  - Bottom-left: `Heavyweight · Charcoal` (`.item-id`)
  - Bottom-right: `75 units` (`.item-meta`) *(the "Coming MMXXVI" line was removed)*

---

## 02 — Drop I

Header row (`.drop-head`, `1fr auto`): left = eyebrow `● 02 — Drop I` + `h2.display` `Drop I: FORTITVDO` (FORTITVDO oxblood); right = ghost button `Get Early Access →` (`.btn.btn-ghost`).

### Product grid (`.drop-grid`, `1.3fr 1fr` → `1fr` below 900px, gap clamp(20px,3vw,40px))

#### Hoodie card
- `.product-frame` — **4:5** aspect, bg `#2c2c2c`, sharp corners, top/bottom gradient strips (80px), border `--line` → `--line-2` on hover
- `fortitvdo-hoodie.png`, cover
- Top-right corner: `XII` chip (`.roman-mark` — dark glass pill: `rgba(10,9,8,0.45)` bg + `blur(4px)`, serif, ls 0.3em)
- Below frame (`.product-meta`):
  - `001 · Heavyweight Hoodie` (`.product-tag` eyebrow)
  - **Hercules FORTITVDO Hoodie** (`.product-name`)
  - **$189** (`.product-price` — Cinzel, 1px bottom border, inline-block min-width 80px)
  - Desc: `Heavyweight charcoal fleece. Back Nemean Lion embroidery. XII sleeve mark.`
  - Chips row (`.product-chips`): `75 Units` · `Heavyweight Fleece` · `No Restocks`
  - Status (`.product-status`): `○ Coming` (oxblood ring + pulsing inner pip)

#### Cap card
- `.product-frame.is-cap` — **1:1** aspect (image is square; do NOT use 4:5 or it letterboxes), same bg + gradient strips
- `virtvs-cap.png`, cover
- **No corner chip** (cap has no Roman-numeral equivalent — keep clean)
- Below frame:
  - `002 · Cap`
  - **Virtvs Black Corduroy Hat**
  - **$79**
  - Desc: `Structured black corduroy. Wreath V embroidery. Bronze clasp.`
  - Chips: `Corduroy` · `Embroidered Wreath` · `Drop I Core`
  - Status: `○ Coming`

### Construction spreads (two `.drop-details` blocks below the grid)

Each: a head (eyebrow + h3 + right-aligned lede), a full-width framed image with top/bottom gradient strips (90px), and a 3-col caption row (`.drop-details-captions`, collapses to 1-col below 720px). Adjacent blocks share a slightly tighter top margin so they read as one "Construction" story.

**Block 1 — Hoodie**
- Eyebrow `● Construction`; h3 `The details.`; lede (right-aligned): `Tonal embroidery on heavyweight charcoal fleece. Each mark is stitched, not printed — built to hold under wear.`
- Image: `fortitvdo-details.png`
- Captions (numeral + bold title + mono sub):
  - **I** · `Nemean Lion` — `Back hem · tonal embroidery`
  - **II** · `Numeral XII` — `Left sleeve · twelve labors`
  - **III** · `FORTITVDO Wordmark` — `Front chest · serif embroidery`

**Block 2 — Cap**
- Eyebrow `● Cap construction`; h3 `In the cap.`; lede: `Black corduroy. Embroidered wreath V. Antique brass adjuster, and Ad Astra Per Aspera printed inside the crown — a mark only the wearer sees.`
- Image: `virtvs-cap-details.png`
- Captions:
  - **I** · `Wreath V Mark` — `Front panel · embroidered`
  - **II** · `Ad Astra Per Aspera` — `Interior crown tape · gold print`
  - **III** · `Antique Brass Adjuster` — `Rear strap · matte hardware`

---

## 03 — Symbolism

Two-col (`1fr 1fr` → `1fr` below 900px).

**Left:** eyebrow `● 03 — Symbolism`; `h2.display` `The first virtue: Fortitude.`; lede: `FORTITVDO is strength under pressure. The kind that is not loud, not easy, and not given. Inspired by Hercules and the Nemean Lion, Drop I is built around the idea that real strength is proven through difficulty.`

**Right:** label `Meaning behind the drop` + accordion (`.acc`). Rows have top border (last item also bottom). Toggle indicator is text `+` / `−`. One open at a time; first open by default; `max-height` slide 500ms ease.

```
I. Why Hercules.
   Hercules is the archetype of strength earned through trial. Twelve labors.
   No shortcuts. Drop I is named for him because real fortitude isn't born —
   it is built under load. The hoodie is the first artifact of that idea.

II. Why Roman lettering.
    Classical Roman inscriptions use V where modern English uses U. We keep
    VIRTVS and FORTITVDO in their original form as a quiet signal — the brand
    belongs to the lineage, not the costume.

III. The Nemean Lion.
     The first labor. Arrows could not pierce its hide. Hercules wore its skin
     afterward as armor. The back graphic on the FORTITVDO hoodie is a refined,
     modern read on that idea — strength absorbed, not displayed.

IV. What comes next.
    Each future drop is built around a single Virtvs pillar — Disciplina,
    Auctoritas, Gravitas. Drop I begins with Fortitvdo because everything else
    requires it first.
```

---

## 04 — Scarcity

Full-width band, bg `var(--ink-2)`, top+bottom hairline borders. Inner two-col (`1.3fr 1fr` → 1-col below 900px).

**Left:** eyebrow `● 04 — Release`; `h2.display` `Limited first release.`; lede: `Drop I will be released in limited quantities to the early access list first. Sign up to receive product previews, launch timing, and first access before the public drop.`

**Right:** 3 stat tiles above a top border (stat numbers display serif clamp(34px,4vw,56px)):
- `75` / `Hoodies / Drop I`
- `I` / `Single production run`
- `0` / `Restocks Planned`

---

## 05 — Signup

Two-col (`1fr 1.1fr` → 1-col below 900px). `id="signup"`, holds the `formRef`.

**Left column:**
- Eyebrow `● 05 — Enter the list`
- `h2.display` `Enter the list.` ("the list." weight-bumped)
- Lede: `Early access. Product previews. Launch timing. You will hear from us before the public drop — and only when there is something worth saying.`
- Pricing line (`.signup-pricing`, top border): `Drop I includes the $189 Hercules FORTITVDO hoodie and $79 Virtvs black corduroy hat. Early access receives first availability.` ($ values serif weight-bumped)
- Code-block (`.code-block`, mono, oxblood left border):
  ```
  // Drop I dispatch
  schedule     →  early access window opens MMXXVI
  volume       →  single run · 75 hoodies
  restock      →  none
  frequency    →  only when the drop moves
  ```

**Right column — form (`.form`):**
- **Email** (required): big underlined input (`.field`, Cormorant ~24px), label `Email address` + right hint `required`. Placeholder `you@domain.com`.
- **SMS** (optional): label `SMS for launch drop` + hint `optional`. Placeholder `+1 (___) ___ ____`.
- **Preference**: 3 button tiles (`.prefs` grid), single-select: `Hoodie / 001`, `Hat / 002`, `Both / 001 + 002`. Active: bone border + `rgba(232,223,208,0.06)` bg. Default selected: `both`.
- Consent (`.consent`): `By joining, you agree to receive Drop I updates from Virtvs. Unsubscribe anytime. Privacy` (Privacy is a link)
- Submit (`.btn.btn-accent.submit`): `Join Early Access →` — oxblood fill, bone text, pill

**Validation:** email regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` → error `Enter a valid email.`; phone optional, if present needs ≥7 digits → `Enter a valid number, or leave empty.` Errors render mono, oxblood, below field; field gets `.invalid` (oxblood border).

**Success state** (`.success`, replaces form):
- Top/bottom hairlines
- `.position`: wreath icon (18px) + `You're on the list · Position №{n}` (oxblood), where `n = 100 + Math.floor(Math.random()*900)` — **placeholder; replace with real position from API**
- `h3` `Watch for Drop I updates.`
- Lede: `Confirmation sent to {email}. We'll write with product previews, launch timing, and your early access window before the public drop.`
- Ghost button `Add another email →` (resets form)
- Share microcopy: `Share VIRTVS · @virtvs`

---

## 06 — Codex

Header two-col: left = eyebrow `● 06 — What follows` + `h2.display` `Four virtues. / One code.` ("One code." weight-bumped); right = lede: `Drop I is the first of four. Each release is built around a single Virtvs pillar — gravitas, disciplina, and auctoritas follow Drop I, one at a time, in order.`

**4-col grid** (`.codex-grid`; → 2-col below 1000px; → 1-col below 560px) with vertical dividers. The `CODEX` data array (in `app.jsx`):

| # | Latin | Translation (`.trans`) | Myth (`.myth`) | Status | State |
|---|---|---|---|---|---|
| I | FORTITVDO | Courage · Resilience · Strength under pressure | Hercules. Strength forged in trial. | Drop I · MMXXVI | **active** |
| II | DISCIPLINA | Discipline · Self-mastery · Precision | Marcus Aurelius. Mind held to its task. | Drop II · Forthcoming | locked |
| III | AUCTORITAS | Earned influence · Credibility · Quiet authority | Cicero. Influence earned by the word. | Drop III · Forthcoming | locked |
| IV | GRAVITAS | Presence · Seriousness · Inner weight | Augustus. Power held without spectacle. | Drop IV · Forthcoming | locked |

**Cell layout** (top→bottom): Roman numeral, virtue name (Cinzel), translation (small uppercase mono-style), myth pushed to bottom (`margin-top:auto`, uppercase), status row above a top border.

- **Active cell:** full bone, status in oxblood, pip pulses (2.4s infinite).
- **Locked cells:** numeral + name dimmed to `--bone-faint`, myth very low opacity, plus a diagonal hatch overlay:
  `repeating-linear-gradient(45deg, transparent 0, transparent 12px, rgba(232,223,208,0.018) 12px, rgba(232,223,208,0.018) 13px)`

Section footer (`.codex-foot`): `Codex · 4 virtues · 4 drops` (left) · `One released. Three forthcoming.` (right)

---

## Footer

Flex, wrapping, top border:
- Wreath (28px) + `VIRTVS` (Cinzel)
- `© MMXXVI · Ad astra per aspera`
- `VIRTVS · FORTITVDO · DISCIPLINA · AVCTORITAS · GRAVITAS`

---

## Sticky CTA

Floating pill, `position: fixed; bottom: 22px`, centered. Bone bg, ink text.
- Content: `Drop I · 75 Units · Early Access First` + inset dark `Join List` button (→ scrolls to `#signup`)
- **Visibility:** show when `scrollY > innerHeight*0.8` AND signup-form top is `> innerHeight*0.6` below viewport top; else hide. Opacity + `translateY` transition 350ms ease. Passive scroll listener.
