/** Club-wide constants. Edit the PLACEHOLDER bits as needed. */
export const CLUB = {
  name: "Fjaler Filmklubb",
  email: "fjalerfilmklubb@gmail.com",
  facebook: { label: "facebook.com/fjalerfilmklubb", url: "https://facebook.com/fjalerfilmklubb" },
  instagram: { label: "@fjalerfilmklubb", url: "https://instagram.com/fjalerfilmklubb" },
};

/** Supporters and sponsors shown at the bottom of the page. Logos live in /public. */
export const SPONSORS = [
  {
    name: "Sparebankstiftinga Fjaler",
    url: "https://www.ifjaler.no",
    logo: "/sponsor-sparebankstiftinga-fjaler.png",
    width: 500,
    height: 200,
  },
];

/** A plain info point, or one ending in a link. */
export type InfoPoint =
  | string
  | { text: string; link: { label: string; url: string }; after?: string };

const FILMKLUBB_NO = { label: "filmklubb.no", url: "https://filmklubb.no" };

/**
 * Club-wide practical info shown in the Info section.
 * Note: venue, price and per-screening details vary and come from the API — keep
 * those out of here. This is for things that are the same across all screenings.
 */
export const INFO_POINTS: Record<"nn" | "en", InfoPoint[]> = {
  nn: [
    "Medlemskap kjøper du saman med billetten, og det varer i eit halvt år. Du må ha gyldig medlemskap og gyldig billett for å kome inn på visninga.",
    "Billettar kjøper du via lenkja på kvar visning.",
    "Stad og pris kan variere frå visning til visning – sjå den enkelte visninga.",
    {
      text: "Fjaler Filmklubb er medlem i NFK. Det betyr at eit medlemskap hos oss gir deg tilgang til alle filmklubbane som er med i NFK, og du kan også sjå film hos oss om du er medlem i ein annan klubb. Les meir om filmklubbar på ",
      link: FILMKLUBB_NO,
      after: ".",
    },
  ],
  en: [
    "Membership is bought together with a ticket and lasts for half a year. You need both a valid membership and a valid ticket to attend a screening.",
    "Buy tickets via the link on each screening.",
    "Venue and price can vary per screening — see the individual screening.",
    {
      text: "Fjaler Filmklubb is a member of NFK, so a membership with us gives you access to every film club in NFK — and if you're a member of another club, you're welcome at our screenings too. Read more about film clubs at ",
      link: FILMKLUBB_NO,
      after: ".",
    },
  ],
};
