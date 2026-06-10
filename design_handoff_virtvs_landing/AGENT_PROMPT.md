# Paste this to your coding agent

Copy everything below into Claude Code (or your agent of choice) once you've
dropped the `design_handoff_virtvs_landing/` folder into your repo.

────────────────────────────────────────────────────────────────────────

I'm giving you a design handoff package in `design_handoff_virtvs_landing/`.
It's a high-fidelity prototype of the Virtvs "Drop I" streetwear landing page,
plus a written spec. Build it as a production landing page in this repo.

Do this in order:

1. Read `design_handoff_virtvs_landing/README.md` fully — it covers the stack
   recommendation, design tokens, folder structure, the strip-before-shipping
   list, and asset notes.

2. Read `design_handoff_virtvs_landing/SPEC.md` — exhaustive per-section spec
   with every copy string, layout, and interaction. Copy is FINAL: reproduce
   it verbatim, do not paraphrase or "improve" wording.

3. Treat `source/styles.css` as the authoritative source for color tokens,
   type scale, spacing, gradients, transitions, and breakpoints. Treat
   `source/app.jsx` as the reference for component structure and the CODEX
   data array.

4. Build with [Next.js App Router + Tailwind + TypeScript] — OR follow this
   repo's existing conventions if it already has a stack. One route (`/`),
   one component per section.

Hard requirements:
- Reproduce the design at high fidelity: exact hex values, type scale,
  spacing, and copy from the spec.
- TWO fonts only: Cinzel (display, caps-only, no italic) and Cormorant
  Garamond (everything else). No Inter/Helvetica/mono fonts.
- Keep the film-grain overlay, the #2c2c2c product-frame color matching the
  photo backdrops, the sharp-corner frames + pill buttons, and the oxblood
  (#6b1e23) accent discipline.
- DO NOT port `image-slot.js` or `tweaks-panel.jsx` — they're design-tool
  scaffolding. Replace <image-slot> with normal/optimized images; delete the
  tweaks panel, TWEAK_DEFAULTS, useTweaks, and Babel-in-browser. Trim the
  HEADLINES map to just the production headline.
- Inline the wreath logo SVG locally instead of hotlinking virtvs.co.
- Optimize the product PNGs (WebP/AVIF + responsive srcset, lazy-load
  below-the-fold).

Build the signup form with real validation (per the spec) and wire it to a
new `POST /api/drop-list` endpoint that accepts { email, phone?, preference }
and returns { position } on success. Use a placeholder/in-memory store for now
and leave a clear TODO + comment for plugging in the real email provider
(Resend + Klaviyo/Beehiiv suggested). Add server-side email validation and
basic rate-limiting.

Make it fully responsive per the breakpoints in the spec (hero stacks below
900px, product grid 1-col below 900px, codex 2-col below 1000px / 1-col below
560px, construction captions 1-col below 720px). Verify it builds and runs
before handing back.

────────────────────────────────────────────────────────────────────────
