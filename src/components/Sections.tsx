"use client";

import { useState } from "react";
import { Screening } from "@/lib/checkin";
import { CLUB, INFO_POINTS } from "@/lib/club";
import { useLang } from "./LanguageProvider";
import { FilmCard } from "./FilmCard";

export function UpcomingSection({ films }: { films: Screening[] }) {
  const { t } = useLang();
  return (
    <section id="upcoming" className="section">
      <h2 className="section__title">{t.upcomingTitle}</h2>
      {films.length === 0 ? (
        <p className="section__empty">{t.noUpcoming}</p>
      ) : (
        <div className="card-grid">
          {films.map((f) => (
            <FilmCard key={f.id} film={f} />
          ))}
        </div>
      )}
    </section>
  );
}

export function HistorySection({ films }: { films: Screening[] }) {
  const { t } = useLang();
  const [open, setOpen] = useState(false);

  return (
    <section id="history" className="section">
      <div className="section__head-row">
        <h2 className="section__title">{t.historyTitle}</h2>
        {films.length > 0 && (
          <button
            type="button"
            className="toggle-btn"
            aria-expanded={open}
            aria-controls="history-panel"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? t.hideHistory : t.showHistory}
          </button>
        )}
      </div>

      {films.length === 0 ? (
        <p className="section__empty">{t.noHistory}</p>
      ) : (
        open && (
          <div id="history-panel" className="card-grid">
            {films.map((f) => (
              <FilmCard key={f.id} film={f} />
            ))}
          </div>
        )
      )}
    </section>
  );
}

export function InfoSection() {
  const { t, lang } = useLang();
  return (
    <section id="info" className="section">
      <h2 className="section__title">{t.infoTitle}</h2>
      <ul className="info-list">
        {INFO_POINTS[lang].map((point, i) => (
          <li key={i}>{point}</li>
        ))}
      </ul>
    </section>
  );
}

export function ContactSection() {
  const { t } = useLang();
  return (
    <section id="contact" className="section section--contact">
      <h2 className="section__title">{t.contactTitle}</h2>
      <p className="contact__email">
        {t.emailLabel}:{" "}
        <a href={`mailto:${CLUB.email}`}>{CLUB.email}</a>
      </p>
      <div className="contact__social">
        <span className="contact__social-label">{t.followUs}:</span>
        <a href={CLUB.facebook.url} target="_blank" rel="noopener noreferrer">
          Facebook
        </a>
        <a href={CLUB.instagram.url} target="_blank" rel="noopener noreferrer">
          Instagram
        </a>
      </div>
    </section>
  );
}

export function ApiErrorNotice() {
  const { t } = useLang();
  return <p className="api-error" role="status">{t.apiError}</p>;
}
