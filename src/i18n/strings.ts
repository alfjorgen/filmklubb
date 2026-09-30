/**
 * Static UI strings only. Film data (titles, synopsis, venue) is shown exactly as
 * the API returns it and is never translated.
 *
 * Default language is Norwegian (Nynorsk); English is the toggle.
 */
export type Lang = "nn" | "en";

export const LANGS: Lang[] = ["nn", "en"];
export const DEFAULT_LANG: Lang = "nn";

export type Strings = {
  langName: string;
  toggleLabel: string; // accessible label on the toggle button
  tagline: string;
  nav: { upcoming: string; history: string; info: string; contact: string; sponsors: string };
  upcomingTitle: string;
  noUpcoming: string;
  historyTitle: string;
  showHistory: string;
  hideHistory: string;
  noHistory: string;
  infoTitle: string;
  contactTitle: string;
  emailLabel: string;
  followUs: string;
  sponsorsTitle: string;
  apiError: string;
  // Card labels
  directorYear: string; // joining label, e.g. "Regi" / "Director"
  yearLabel: string;
  venueLabel: string;
  doorsLabel: string;
  ticketsCta: string;
  closedRibbon: string; // ribbon on events whose ticket sales are closed
  priceLabel: string;
  dateTbd: string;
};

export const STRINGS: Record<Lang, Strings> = {
  nn: {
    langName: "Norsk",
    toggleLabel: "Byt språk",
    tagline: "Klassiske filmar på lerretet i Fjaler", // PLACEHOLDER: rediger fritt
    nav: { upcoming: "Komande", history: "Tidlegare", info: "Info", contact: "Kontakt", sponsors: "Sponsorar" },
    upcomingTitle: "Komande visningar",
    noUpcoming: "Ingen komande visningar er lagt ut akkurat no. Følg oss på Facebook for oppdateringar.",
    historyTitle: "Tidlegare visningar",
    showHistory: "Vis tidlegare visningar",
    hideHistory: "Skjul tidlegare visningar",
    noHistory: "Ingen tidlegare visningar å vise.",
    infoTitle: "Praktisk info",
    contactTitle: "Kontakt",
    emailLabel: "E-post",
    followUs: "Følg oss",
    sponsorsTitle: "Støttespelarar og sponsorar",
    apiError: "Vi får ikkje kontakt med billettsystemet akkurat no. Prøv igjen seinare.",
    directorYear: "Regi",
    yearLabel: "År",
    venueLabel: "Stad",
    doorsLabel: "Dørene opnar",
    ticketsCta: "Sjå og kjøp billett",
    closedRibbon: "Billettsal stengd",
    priceLabel: "Pris",
    dateTbd: "Tidspunkt kjem",
  },
  en: {
    langName: "English",
    toggleLabel: "Change language",
    tagline: "Classic films on the big screen in Fjaler", // PLACEHOLDER: edit freely
    nav: { upcoming: "Upcoming", history: "History", info: "Info", contact: "Contact", sponsors: "Sponsors" },
    upcomingTitle: "Upcoming screenings",
    noUpcoming: "No upcoming screenings are posted right now. Follow us on Facebook for updates.",
    historyTitle: "Past screenings",
    showHistory: "Show past screenings",
    hideHistory: "Hide past screenings",
    noHistory: "No past screenings to show.",
    infoTitle: "Practical info",
    contactTitle: "Contact",
    emailLabel: "Email",
    followUs: "Follow us",
    sponsorsTitle: "Supporters and sponsors",
    apiError: "We can't reach the ticket system right now. Please try again later.",
    directorYear: "Director",
    yearLabel: "Year",
    venueLabel: "Venue",
    doorsLabel: "Doors open",
    ticketsCta: "View & buy tickets",
    closedRibbon: "Sales closed",
    priceLabel: "Price",
    dateTbd: "Time to be announced",
  },
};
