/** Club-wide constants. Edit the PLACEHOLDER bits as needed. */
export const CLUB = {
  name: "Fjaler Filmklubb",
  email: "fjalerfilmklubb@gmail.com",
  facebook: { label: "facebook.com/fjalerfilmklubb", url: "https://facebook.com/fjalerfilmklubb" },
  instagram: { label: "@fjalerfilmklubb", url: "https://instagram.com/fjalerfilmklubb" },
};

/**
 * Club-wide practical info shown in the Info section.
 * Note: venue, price and per-screening details vary and come from the API — keep
 * those out of here. This is for things that are the same across all screenings.
 *
 * PLACEHOLDER: edit these bullet points. They are intentionally generic.
 */
export const INFO_POINTS = {
  nn: [
    "PLASSHALDAR: Skriv inn praktisk info her, t.d. om medlemskap og korleis ein blir medlem.",
    "PLASSHALDAR: Billettar kjøper du via lenkja på kvar visning.",
    "PLASSHALDAR: Stad og pris kan variere frå visning til visning – sjå den enkelte visninga.",
  ],
  en: [
    "PLACEHOLDER: Add practical info here, e.g. about membership and how to join.",
    "PLACEHOLDER: Buy tickets via the link on each screening.",
    "PLACEHOLDER: Venue and price can vary per screening — see the individual screening.",
  ],
} as const;
