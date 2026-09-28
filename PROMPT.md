# Build a website for Fjaler Filmklubb

Build and deploy a single-page website for a local classic-film club. Work in
/Users/alfjorgenbratane/Developer/filmklubb.

## Stack & hosting
- Next.js (App Router, TypeScript) deployed on Vercel.
- Use ISR for the film data: `revalidate = 3600` (hourly).
- Add a secret on-demand revalidation endpoint (e.g. `/api/revalidate?secret=...`)
  so we can force-refresh after urgent program changes. Secret comes from an env var.
- No database. The framework cache IS the cache.

## Data source — Checkin.no GraphQL
- GraphiQL IDE: https://api.checkin.no/graphiql/ (the POST endpoint is likely
  https://api.checkin.no/graphql — confirm via the IDE).
- FIRST STEP: run GraphQL introspection against the endpoint to discover the exact
  schema, types, and field names. Also check Checkin.no's auth requirements
  (which header carries the token). Do not guess field names — verify them.
- Auth token is provided via env var `CHECKIN_API_TOKEN` (set in Vercel + a local
  .env.local). Never hardcode it; never expose it to the browser. All GraphQL calls
  happen server-side.
- Organizer ID for our club: **18050**. Use it to fetch only our events/screenings.
- Each film links out to its detail page on the ticket system:
  `https://event.checkin.no/{eventId}`

## Page structure (single page, these sections in order)
1. **Header** — club name "Fjaler Filmklubb" + a short tagline (placeholder I'll edit;
   suggest something like "Klassiske filmar på lerretet i Fjaler"). Language toggle here.
2. **Upcoming films** — list/grid of upcoming screenings, each card showing:
   - Poster image
   - Date & time
   - Synopsis
   - Director & year
   - Venue/address (this varies per screening — pull it from the API event data)
   - Whole card (or a clear button) links to `https://event.checkin.no/{eventId}`
3. **History** — previous screenings, split off automatically by screening datetime
   (past = before now). Collapsed by default behind a toggle (e.g. "Vis tidlegare
   visningar"). When expanded, show the SAME rich cards as upcoming (posters etc.).
4. **Info** — practical info. Note that venue/price/practical details may vary per
   screening and come from the API; show anything club-wide here.
5. **Contact** — email and social links (below).

## Content / constants
- Club name: **Fjaler Filmklubb**
- Contact email: **fjalerfilmklubb@gmail.com**
- Facebook: **facebook.com/fjalerfilmklubb**
- Instagram: **@fjalerfilmklubb** (https://instagram.com/fjalerfilmklubb)
- Tagline + any club-wide practical info: leave clearly-marked placeholders for me.

## Language (bilingual)
- Norwegian (Nynorsk) is the DEFAULT, with an English toggle.
- Only the static UI strings (section headings, labels, buttons) are translated.
  Film data (titles, synopsis, venue) is shown as the API returns it — do not translate it.
- Keep it lightweight: a simple language toggle (context + localStorage is fine);
  no need for full i18n routing.

## Design
- Clean & minimal: light theme, generous whitespace, strong typography, posters as
  the main visual element. Responsive (mobile-first). No heavy UI framework needed.

## Deliverables
- Working Next.js app runnable locally (`npm run dev`) with a `.env.local.example`
  listing required env vars (`CHECKIN_API_TOKEN`, the revalidate secret).
- A short README: how to set env vars, run locally, deploy to Vercel, and how to call
  the secret refresh URL.
- Graceful handling if the API is unreachable or returns no films.

## Suggested first steps
1. Introspect the Checkin.no GraphQL schema and confirm the endpoint, auth header,
   and the fields available for poster, synopsis, director, year, datetime, venue,
   and event id (for the deep link). Print the query you settle on.
2. Scaffold the Next.js app, wire up the server-side GraphQL fetch with ISR.
3. Build the sections and the language toggle.
4. Write the README + env example.
