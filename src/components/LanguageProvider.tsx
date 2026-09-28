"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { DEFAULT_LANG, Lang, STRINGS, Strings } from "@/i18n/strings";

type LanguageContextValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  t: Strings;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "filmklubb-lang";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);

  // Restore saved preference on mount (client-only; default stays Nynorsk for SSR).
  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "nn" || saved === "en") setLangState(saved);
  }, []);

  // Keep <html lang> in sync for accessibility.
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore (private mode etc.) */
    }
  };

  const toggle = () => setLang(lang === "nn" ? "en" : "nn");

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggle, t: STRINGS[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}

// Dates are rendered on the server and again in the browser, so both must produce
// identical text. We pin the time zone (the server runs in UTC) and spell out the
// Nynorsk names ourselves, because not every browser ships "nn" locale data and
// would otherwise fall back to English.
const TIME_ZONE = "Europe/Oslo";
const NAMES: Record<Lang, { days: string[]; months: string[] }> = {
  nn: {
    days: ["søndag", "måndag", "tysdag", "onsdag", "torsdag", "fredag", "laurdag"],
    months: ["januar", "februar", "mars", "april", "mai", "juni", "juli", "august", "september", "oktober", "november", "desember"],
  },
  en: {
    days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  },
};

const partsFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: TIME_ZONE,
  weekday: "short",
  day: "numeric",
  month: "numeric",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});
const WEEKDAY_INDEX: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

type DateParts = { weekday: number; day: number; month: number; year: number; time: string };

function osloParts(iso: string | null): DateParts | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const p = Object.fromEntries(partsFormatter.formatToParts(d).map((x) => [x.type, x.value]));
  return {
    weekday: WEEKDAY_INDEX[p.weekday],
    day: Number(p.day),
    month: Number(p.month) - 1,
    year: Number(p.year),
    time: `${p.hour}:${p.minute}`,
  };
}

/** Format an ISO datetime for the current language. */
export function formatDateTime(iso: string | null, lang: Lang): string | null {
  const p = osloParts(iso);
  if (!p) return null;
  const { days, months } = NAMES[lang];
  const day = days[p.weekday][0].toUpperCase() + days[p.weekday].slice(1);
  return lang === "nn"
    ? `${day} ${p.day}. ${months[p.month]} ${p.year} kl. ${p.time}`
    : `${day} ${p.day} ${months[p.month]} ${p.year}, ${p.time}`;
}

/** Format just the clock time (used for "doors open"). */
export function formatTime(iso: string | null, _lang: Lang): string | null {
  return osloParts(iso)?.time ?? null;
}

