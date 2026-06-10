VIRTVS Drop I landing page

Production rebuild from the design handoff zip.

Stack:
- Next.js App Router
- TypeScript
- CSS ported from the handoff source styles
- next/image for product imagery
- POST /api/drop-list signup endpoint with server-side validation and basic in-memory rate limiting

Run locally:

npm install
npm run dev

Open:

http://127.0.0.1:8000

Important files:

- app/page.tsx
  Client landing page composed from the handoff sections. Design-tool scaffolding was removed.

- app/globals.css
  Ported visual system from design_handoff_virtvs_landing/source/styles.css.

- app/api/drop-list/route.ts
  Signup endpoint. Currently stores signups in memory and returns a placeholder position.
  TODO: connect Beehiiv/Klaviyo/ConvertKit and optionally Resend confirmation email.

- public/drop-i/
  Product images from the handoff. next/image will serve optimized WebP/AVIF variants at runtime.

- public/wreath-logo.svg
  Local copy of the wreath mark so the page does not hotlink virtvs.co.

Original handoff:

- design_handoff_virtvs_landing/
- Virtvs Homepage.zip
