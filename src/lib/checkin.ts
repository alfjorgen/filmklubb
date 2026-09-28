/**
 * Server-side Checkin.no GraphQL client.
 *
 * Discovered via introspection against https://api.checkin.no/graphql :
 *  - Query `findEventsByCustomerID(customerId: Int!, active: Boolean)` returns
 *    `[EventRegistrationOld]`.
 *  - Our club's organizer / customer id is 18050.
 *  - Active (upcoming) events are public. Inactive/past events require auth, so
 *    the "history" only fills in when CHECKIN_API_TOKEN is set.
 *
 * All calls here are server-only. The token is never sent to the browser.
 */
import "server-only";
import { sanitizeHtml } from "./sanitize";

export const CHECKIN_ENDPOINT = "https://api.checkin.no/graphql";
export const ORGANIZER_ID = 18050;

/** Build the deep link to a screening's page in the ticket system. */
export function eventUrl(id: number): string {
  return `https://event.checkin.no/${id}`;
}

/** Shape we expose to the UI. Film data is passed through verbatim (not translated). */
export type Screening = {
  id: number;
  /** Deep link to the ticket / detail page. */
  href: string;
  title: string;
  /** Raw HTML synopsis from the API (sanitized before render). */
  descriptionHtml: string | null;
  start: string | null; // ISO datetime
  end: string | null; // ISO datetime
  doorOpens: string | null;
  posterUrl: string | null;
  /** Venue name, e.g. "Trudvang". */
  venue: string | null;
  /** Street address / geo description, e.g. "Jarstadvegen 5, Dale i Sunnfjord". */
  address: string | null;
  /** Parsed from the title when present, e.g. "1971". */
  year: string | null;
  /** Director, if the event exposes it via a custom field. Usually null. */
  director: string | null;
  /** Ticket categories with prices, e.g. [{ name: "Vaksen", price: "100" }]. */
  prices: { name: string; price: string | null }[];
  /** Published, but ticket sales are closed (Checkin status CLOSED). */
  closed: boolean;
};

type RawField = { key: string; value: string | null; description: string | null };
type RawEvent = {
  id: number;
  name: string;
  description: string | null;
  start: string | null;
  end: string | null;
  door_opens: string | null;
  image: string | null;
  url: string | null;
  geo_description: string | null;
  geoLocationDescription: string | null;
  categories: { name: string; price: string | null }[] | null;
  fields: RawField[] | null;
  publishedStatus: PublishedStatus | null;
};

/**
 * Checkin's EventPublishedStatusEnum. UNPUBLISHED = draft; OPEN and CLOSED are
 * both published (CLOSED just means ticket sales have ended).
 */
type PublishedStatus = "UNPUBLISHED" | "OPEN" | "CLOSED";

function isPublished(e: RawEvent): boolean {
  return e.publishedStatus === "OPEN" || e.publishedStatus === "CLOSED";
}

const EVENTS_QUERY = /* GraphQL */ `
  query ClubEvents($customerId: Int!, $active: Boolean) {
    findEventsByCustomerID(customerId: $customerId, active: $active) {
      id
      name
      description
      start
      end
      door_opens
      image
      url
      geo_description
      geoLocationDescription
      categories {
        name
        price
      }
      fields {
        key
        value
        description
      }
      publishedStatus
    }
  }
`;

/** Pull a 4-digit year out of a title like "A Clockwork Orange (1971)". */
function parseYear(title: string): string | null {
  const m = title.match(/\((\d{4})\)\s*$/) || title.match(/\b(19|20)\d{2}\b/);
  return m ? m[0].replace(/[()]/g, "").trim() : null;
}

/** Look for a director among the event's custom fields (best-effort; usually absent). */
function parseDirector(fields: RawField[] | null): string | null {
  if (!fields) return null;
  const hit = fields.find((f) => {
    const k = `${f.key} ${f.description ?? ""}`.toLowerCase();
    return k.includes("director") || k.includes("regiss");
  });
  return hit?.value?.trim() || null;
}

function toScreening(e: RawEvent): Screening {
  return {
    id: e.id,
    href: eventUrl(e.id),
    title: e.name,
    descriptionHtml: e.description ? sanitizeHtml(e.description) || null : null,
    start: e.start,
    end: e.end,
    doorOpens: e.door_opens,
    posterUrl: e.image,
    venue: e.geoLocationDescription || null,
    address: e.geo_description || null,
    year: parseYear(e.name),
    director: parseDirector(e.fields),
    prices: (e.categories ?? []).map((c) => ({ name: c.name, price: c.price })),
    closed: e.publishedStatus === "CLOSED",
  };
}

async function runQuery(active?: boolean): Promise<RawEvent[]> {
  const token = process.env.CHECKIN_API_TOKEN;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  // Auth header convention for Checkin.no. If the token is rejected we simply
  // fall back to public (active) data, so this stays best-effort.
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(CHECKIN_ENDPOINT, {
    method: "POST",
    headers,
    body: JSON.stringify({
      query: EVENTS_QUERY,
      variables: { customerId: ORGANIZER_ID, active },
    }),
    // ISR: cache the upstream response for an hour; on-demand revalidation can
    // bust this via the "films" tag.
    next: { revalidate: 3600, tags: ["films"] },
  });

  if (!res.ok) {
    throw new Error(`Checkin API HTTP ${res.status}`);
  }
  const json = (await res.json()) as {
    data?: { findEventsByCustomerID: RawEvent[] | null };
    errors?: { message: string }[];
  };
  if (json.errors?.length) {
    // e.g. "Authorize to access inactive events" when fetching history w/o token.
    throw new Error(json.errors.map((e) => e.message).join("; "));
  }
  return json.data?.findEventsByCustomerID ?? [];
}

export type FilmData = {
  upcoming: Screening[];
  past: Screening[];
  /** True if we couldn't reach the API at all (used to show a friendly notice). */
  apiError: boolean;
};

/**
 * Fetch all of the club's screenings and split them into upcoming/past by start
 * time. Degrades gracefully: if the API is unreachable we return empty lists with
 * `apiError: true`; if only the public (active) data is available we still render it.
 */
export async function getFilmData(): Promise<FilmData> {
  // Public/active events always; (auth-only) inactive events only when we have a
  // token — otherwise that call is guaranteed to fail with "Authorize to access
  // inactive events", so we skip it to avoid a useless request and noisy warning.
  // Each call is independent — a failure in one shouldn't sink the other.
  const hasToken = Boolean(process.env.CHECKIN_API_TOKEN);
  const settled = await Promise.allSettled(
    hasToken ? [runQuery(undefined), runQuery(false)] : [runQuery(undefined)],
  );

  const raw: RawEvent[] = [];
  let anyFulfilled = false;

  for (const r of settled) {
    if (r.status === "fulfilled") {
      anyFulfilled = true;
      raw.push(...r.value);
    } else {
      console.warn("[checkin] query failed:", r.reason?.message ?? r.reason);
    }
  }

  // If neither call succeeded, the API is effectively unreachable.
  if (!anyFulfilled) {
    return { upcoming: [], past: [], apiError: true };
  }

  // Dedupe by id (the two calls can overlap), and never show drafts.
  const byId = new Map<number, RawEvent>();
  for (const e of raw) if (isPublished(e)) byId.set(e.id, e);

  const now = Date.now();
  const screenings = [...byId.values()].map(toScreening);

  const upcoming = screenings
    .filter((s) => s.start && new Date(s.start).getTime() >= now)
    .sort((a, b) => new Date(a.start!).getTime() - new Date(b.start!).getTime());

  const past = screenings
    .filter((s) => s.start && new Date(s.start).getTime() < now)
    .sort((a, b) => new Date(b.start!).getTime() - new Date(a.start!).getTime());

  return { upcoming, past, apiError: false };
}
