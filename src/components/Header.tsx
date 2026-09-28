"use client";

import { CLUB } from "@/lib/club";
import { useLang } from "./LanguageProvider";
import { LanguageToggle } from "./LanguageToggle";

export function Header() {
  const { t } = useLang();
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <div className="site-header__brand">
          <h1 className="site-header__title">{CLUB.name}</h1>
          {/* PLACEHOLDER tagline — edit in src/i18n/strings.ts */}
          <p className="site-header__tagline">{t.tagline}</p>
        </div>
        <div className="site-header__actions">
          <nav className="site-nav" aria-label={CLUB.name}>
            <a href="#upcoming">{t.nav.upcoming}</a>
            <a href="#history">{t.nav.history}</a>
            <a href="#info">{t.nav.info}</a>
            <a href="#contact">{t.nav.contact}</a>
          </nav>
          <LanguageToggle />
        </div>
      </div>
    </header>
  );
}
