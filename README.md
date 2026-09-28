# Fjaler Filmklubb

Single-page website for a local classic-film club. Built with **Next.js (App Router, TypeScript)**, deployed on **Vercel**, with no database — the framework cache is the cache.

Film data comes from the **Checkin.no GraphQL API** (the club's ticket system) and is fetched server-side with **ISR** (revalidated hourly), plus a secret on-demand revalidation endpoint for urgent changes.

---

## Quick start (local)

```bash
npm install
cp .env.local.example .env.local   # then fill in the values (see below)
npm run dev                        # http://localhost:3000
```

Upcoming screenings render **without any token** (active events are public). The
**history** (past screenings) only fills in when `CHECKIN_API_TOKEN` is set, since
inactive events require authorization.

---

## Environment variables

All are **server-side only** — none are exposed to the browser. See `.env.local.example`.

| Variable | Required | Purpose |
| --- | --- | --- |
| `CHECKIN_API_TOKEN` | For history | Auth token for Checkin.no. Sent as `Authorization: Bearer <token>`. Needed to fetch past/inactive screenings. |
| `REVALIDATE_SECRET` | For refresh endpoint | Secret that authorizes `POST /api/revalidate`. Use a long random string, e.g. `openssl rand -hex 32`. |

> **Auth header note:** Checkin.no's public schema doesn't document the exact auth
> header, and it couldn't be verified without a valid token. We use the standard
> `Authorization: Bearer <token>`. If history stays empty with a known-good token,
> change the one line in `src/lib/checkin.ts` (`runQuery`, the `headers["Authorization"]`
> assignment) to whatever header Checkin.no expects.

---

## How the data layer works

- **Endpoint:** `https://api.checkin.no/graphql` (POST). Confirmed via GraphQL introspection.
- **Query:** `findEventsByCustomerID(customerId: 18050, active: …)` → `[EventRegistrationOld]`.
  Organizer/customer id **18050** is our club.
- We fetch active events (public) and inactive events (auth-only) in parallel, merge
  by id, and split into **upcoming** / **past** by the screening `start` time.
- Each screening deep-links to `https://event.checkin.no/{eventId}`.
- Fields used: `name`, `description` (HTML synopsis, sanitized), `start` / `end` /
  `door_opens`, `image` (poster — often absent → graceful placeholder),
  `geoLocationDescription` (venue) + `geo_description` (address), `categories` (prices).
  There is **no structured director field**; the year is parsed from the title, and a
  director is only shown if an event exposes it as a custom field.

The exact GraphQL query lives in `src/lib/checkin.ts` (`EVENTS_QUERY`).

### Graceful degradation
- API unreachable → both list sections render an empty/notice state; no crash.
- No upcoming films → friendly "no screenings posted" message.
- No token → history is simply empty (with an explanatory empty state).
- Missing poster → styled placeholder card with the film title.

---

## On-demand refresh (secret URL)

ISR refreshes the film data automatically every hour. To force an immediate refresh
after an urgent program change, call the revalidation endpoint with the secret:

```bash
curl -X POST "https://YOUR-DOMAIN.vercel.app/api/revalidate?secret=YOUR_SECRET"
# -> {"revalidated":true,"now":...}
```

`GET` works too (handy from a browser or cron). It busts the `films` cache tag and the
home path. Wrong/missing secret → `401`; secret not configured on the server → `500`.

---

## Editing content

- **Tagline** and all UI strings: `src/i18n/strings.ts` (look for `PLACEHOLDER`).
- **Club-wide practical info** (Info section): `src/lib/club.ts` → `INFO_POINTS`
  (placeholders to edit). Per-screening venue/price come from the API, not here.
- **Contact / social links:** `src/lib/club.ts` → `CLUB`.

### Language
Norwegian (**Nynorsk**) is the default; an **EN** toggle switches the static UI strings
only. Film data (titles, synopsis, venue) is always shown as the API returns it. The
choice persists in `localStorage` (`filmklubb-lang`). No i18n routing.

---

## Deploy to Vercel

1. Push this repo to GitHub/GitLab/Bitbucket.
2. In Vercel: **New Project → import the repo** (framework auto-detected as Next.js).
3. **Project → Settings → Environment Variables**, add:
   - `CHECKIN_API_TOKEN`
   - `REVALIDATE_SECRET`
4. **Deploy.** No database or extra config needed.
5. Redeploy (or re-pull env) after changing env vars.

---

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Local dev server (http://localhost:3000) |
| `npm run build` | Production build |
| `npm run start` | Run the production build locally |
| `npm run lint` | Lint |

## Project structure

```
src/
  app/
    layout.tsx               # root layout (<html lang="nn">)
    page.tsx                 # server component, ISR (revalidate = 3600)
    globals.css              # light, minimal, mobile-first theme
    api/revalidate/route.ts  # secret on-demand revalidation
  components/
    LanguageProvider.tsx     # lang context + localStorage + date formatting
    LanguageToggle.tsx
    Header.tsx
    FilmCard.tsx             # poster, date/time, synopsis, venue, prices, CTA
    Sections.tsx             # Upcoming / History (toggle) / Info / Contact
  i18n/strings.ts            # NN + EN UI strings (film data not translated)
  lib/
    checkin.ts               # GraphQL client, types, upcoming/past split
    sanitize.ts              # allow-list HTML sanitizer for synopses
    club.ts                  # club constants + Info placeholders
```
