"use client";

import Image from "next/image";
import { CLUB } from "@/lib/club";
import { useLang } from "./LanguageProvider";
import { LanguageToggle } from "./LanguageToggle";

export function Header() {
  const { t } = useLang();
  return (
    <>
      <header className="site-header">
        <div className="site-header__inner">
          <h1 className="site-header__logo">
            <Image src="/logo.png" alt={CLUB.name} width={1588} height={911} priority unoptimized />
          </h1>
          {/* PLACEHOLDER tagline — edit in src/i18n/strings.ts */}
          <p className="site-header__tagline">{t.tagline}</p>
        </div>
      </header>

      <div className="site-bar">
        <div className="site-bar__inner">
          <nav className="site-nav" aria-label={CLUB.name}>
            <a href="#upcoming">{t.nav.upcoming}</a>
            <a href="#history">{t.nav.history}</a>
            <a href="#info">{t.nav.info}</a>
            <a href="#contact">{t.nav.contact}</a>
          </nav>
          <LanguageToggle />
        </div>
      </div>
      <div className="sprocket-strip" aria-hidden="true" />
    </>
  );
}
