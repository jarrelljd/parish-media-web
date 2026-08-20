# Parish Media Company — Marketing Site

This is the actual deployed site (parishmediacompany.com, via Railway) — homepage, services, testimonials, about, contact, and the `/free-guide` lead magnet. This is a separate project from the "Parish Event Page Builder" WAT framework repo; nothing here should assume that repo's workflows/tools structure.

## Who this site sells to

The key buyer avatar is **the parish priest**: busy, not particularly technical, budget-conscious (parish/diocesan budgets, often a finance council in the loop), and moved far more by trust and clergy/institutional endorsement than by marketing claims. Write copy and design flows with that person landing cold, not a marketer evaluating tactics.

## Brand voice

- Lead with concrete, provable numbers over marketing buzzwords. "25 registrants per campaign," "$2–3/lead," "0→941 followers" beats "grow your reach."
- Frame benefits in the priest's own goals (reaching lapsed families, filling events, young men discerning vocations) rather than marketing-speak.
- Every number on the site needs to be something Joe can back up if asked directly — don't round up or combine stats without checking with him first.
- Real, named social proof (Diocese of Reno, Capuchin Franciscans / Midwest Province of St. Joseph, named parish priests) carries far more weight for this audience than generic testimonial copy — prefer it, and keep pushing for named quotes + real numbers over anonymous claims.

## Design tokens

Defined in `src/app/globals.css` under `@theme inline`:
- `--color-navy: #1b2a4a`
- `--color-gold: #c9a227`
- `--color-offwhite: #faf8f4`

Used directly as Tailwind utilities (`text-navy`, `bg-gold`, `decoration-gold`, etc.). Note: the per-parish event pages (`src/app/events/[parish]/[event]/`) use a *different* pattern — per-parish CSS custom properties set inline — don't mix the two.

## Form / lead-capture pattern

Every lead form follows the same shape (see `src/components/Contact.tsx`, `src/components/FreeGuideForm.tsx`, `src/app/actions.ts`):
- Client component using `useActionState(serverAction, initialState)`.
- Server action in `src/app/actions.ts` sends email via the already-installed `Resend` client (`process.env.RESEND_API_KEY`).
- On success, redirect via `setTimeout(() => window.location.href = CALENDLY_URL, 1500)` — gives the user a moment to read the success message before bouncing to Calendly.
- Lead tracking fires both the browser Meta Pixel (`src/lib/pixel.ts`) and server-side Meta Conversions API (`src/lib/metaConversionsApi.ts`), deduped via a shared `event_id` — wrap tracking calls in try/catch so a tracking failure never blocks the user-facing success response.

## Shared data convention

Reusable content (client rosters, etc.) lives in `src/data/*.ts` so multiple pages import one source instead of duplicating arrays — see `src/data/clients.ts`, used by both the homepage "Trusted By" strip and `/testimonials`.

## Copy hygiene: no orphaned last lines

When writing multi-line headings, subheads, CTAs, or wrapped paragraphs, check how the text wraps at common widths (desktop ~1280px and mobile ~320–414px) before considering it done — either by screenshotting or reasoning through where line breaks fall. Avoid a final line that's visually much shorter than the lines above it (a single short word, or a lone word plus punctuation like "/ community."). Fix it by rephrasing to remove the awkward trailing fragment (e.g. "diocese / community" → "diocese or religious community") or, if the wording must stay, joining the last two words with `&nbsp;` so they wrap together. `text-balance` (headings) and `text-pretty` (paragraphs) help but don't catch every case — still verify at actual breakpoints.

## Known open item

The `/free-guide` flow expects the real PDF at `public/downloads/social-media-for-catholic-churches.pdf` (see the README in that folder) — until it's there, submissions fail gracefully with a friendly error instead of sending.

## Working style

- Small copy tweaks: just proceed.
- Changes to shared/high-visibility templates (homepage, nav, anything affecting every page): confirm the approach first.
- Always preview and get explicit confirmation before pushing to the deployed site.

@AGENTS.md
