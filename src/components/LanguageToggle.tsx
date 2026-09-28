"use client";

import { useLang } from "./LanguageProvider";

/** Minimal NN / EN segmented toggle. */
export function LanguageToggle() {
  const { lang, setLang, t } = useLang();
  return (
    <div className="lang-toggle" role="group" aria-label={t.toggleLabel}>
      <button
        type="button"
        className={`lang-toggle__btn${lang === "nn" ? " is-active" : ""}`}
        aria-pressed={lang === "nn"}
        onClick={() => setLang("nn")}
      >
        NN
      </button>
      <span className="lang-toggle__sep" aria-hidden="true">
        /
      </span>
      <button
        type="button"
        className={`lang-toggle__btn${lang === "en" ? " is-active" : ""}`}
        aria-pressed={lang === "en"}
        onClick={() => setLang("en")}
      >
        EN
      </button>
    </div>
  );
}
