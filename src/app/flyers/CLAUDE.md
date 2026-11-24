# Parish Flyer Library (/flyers)

A standalone, client-only tool: parish staff search ready-made Canva flyer templates ("blessing of the pets"), pick a design, and open their own editable copy in Canva. It is NOT part of House of Studies and is not in the site nav. Keep it self-contained so it can move to its own app or subdomain later.

## Who uses it

Parish secretaries, staff, and priests who aren't technical. Big text, obvious buttons, few choices on screen. Search must forgive plurals, typos, and other names for the same thing (see `src/lib/flyerSearch.ts` and `flyerSynonyms` in `src/data/flyers.ts`).

## Where things live

- Page: `src/app/flyers/page.tsx` (noindex). It has its own header/footer, no marketing Nav.
- UI: `src/components/flyers/` (FlyerLibrary, FlyerCard, FlyerPlaceholder).
- Data: `src/data/flyers.ts`, currently PLACEHOLDER templates. `FlyerTemplate` is the shape of the future database table; keep the UI reading that shape so the data source can be swapped without UI changes.
- Layout: search, "Coming up", "Popular all year", and categories in a left column; results on the right (stacked on phones).
- "Coming up" suggestions follow the liturgical year (`src/lib/flyerSeasons.ts`); "Popular all year" is `commonSearches` there. The page drops any suggestion with no templates, so add one freely and it appears once its templates exist.
- Cards show the real flyer image (`thumbnail`) when there is one; the drawn placeholder is only a stand-in.
- Templates that share an `event` show together as one group of design options (aim for 3 to 5 per event).

## Canva

No Canva API. Each template stores a Canva "template link" (Share > Template link), which gives each parish its own copy. Links open in a new tab.

- NEVER publish a Canva link ending in `/edit`: that's a collaborator link and anyone could change Joe's original. Only template links (or `/view` while testing).
- Thumbnails can be pulled automatically (tested 2026-11-23): `https://www.canva.com/_oembed?url=<design /view URL>&format=json` returns the design title and a `thumbnail_url`; `<design>/screen` gives a 1024x1280 PNG (4:5). Requests need a browser User-Agent or Canva returns 403. `canva.link/...` short links redirect to the design URL. Plan: the admin page pastes a link, fetches title + image, and stores the image itself (don't hotlink Canva).

## Access, admin, and storage (built 2026-11-24)

- `/flyers` shows a code screen unless the visitor has a valid parish code cookie or is a signed-in admin. Codes are checked on every visit, so turning one off locks that parish out immediately. Visits per code are counted (at most one per 30 min).
- `/flyers/admin` (team password `FLYER_ADMIN_PASSWORD`): add/edit/delete flyers by pasting a Canva link (title + thumbnail fetched automatically), and add/turn off/delete parish codes, with a "Copy invite" message.
- Cookies are signed with `FLYER_SESSION_SECRET`, falling back to the admin password. Set a separate secret in production, or changing the admin password signs every parish out.
- Storage: JSON files + WebP thumbnails in one folder (`src/lib/flyers/store.ts`). Production uses the Railway volume (`RAILWAY_VOLUME_MOUNT_PATH`); local dev uses `./.data/flyers` (gitignored). Without a volume in production, the admin shows a red warning and changes vanish on redeploy. Thumbnails are served by `src/app/flyers/thumbs/[file]/route.ts`.
- Placeholder templates still show after the real ones while `SHOW_PLACEHOLDERS` is true in `src/data/flyers.ts`.

## Ideas not built yet

- Count "Customize in Canva" clicks per flyer and per parish (which designs get used).
- Manual image upload as a fallback if a Canva link's image can't be fetched.
- Real tutorial video in the "How it works" section.
