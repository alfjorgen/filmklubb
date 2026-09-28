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
 */
export const INFO_POINTS = {
  nn: [
    "Medlemskap kjøper du saman med billetten, og det varer i eit halvt år. Du må ha gyldig medlemskap og gyldig billett for å kome inn på visninga.",
    "Billettar kjøper du via lenkja på kvar visning.",
    "Stad og pris kan variere frå visning til visning – sjå den enkelte visninga.",
  ],
  en: [
    "Membership is bought together with a ticket and lasts for half a year. You need both a valid membership and a valid ticket to attend a screening.",
    "Buy tickets via the link on each screening.",
    "Venue and price can vary per screening — see the individual screening.",
  ],
} as const;
