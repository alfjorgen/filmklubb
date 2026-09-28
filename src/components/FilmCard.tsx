"use client";

import { useState } from "react";
import { Screening } from "@/lib/checkin";
import { formatDateTime, formatTime, useLang } from "./LanguageProvider";

/** A single screening card: poster, date/time, synopsis, director/year, venue, CTA. */
export function FilmCard({ film }: { film: Screening }) {
  const { t, lang } = useLang();
  const [imgFailed, setImgFailed] = useState(false);

  const when = formatDateTime(film.start, lang) ?? t.dateTbd;
  const doors = formatTime(film.doorOpens, lang);
  const hasPoster = film.posterUrl && !imgFailed;

  const meta: string[] = [];
  if (film.director) meta.push(`${t.directorYear}: ${film.director}`);
  if (film.year) meta.push(film.year);

  return (
    <article className="card">
      {film.closed && <span className="card__ribbon">{t.closedRibbon}</span>}
      <a className="card__media" href={film.href} target="_blank" rel="noopener noreferrer">
        {hasPoster ? (
          // eslint-disable-next-line @next/next/no-img-element -- posters are arbitrary CDN URLs and frequently absent; a plain <img> with onError fallback is simplest.
          <img
            className="card__poster"
            src={film.posterUrl!}
            alt={film.title}
            loading="lazy"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="card__poster card__poster--placeholder" aria-hidden="true">
            <span>{film.title}</span>
          </div>
        )}
      </a>

      <div className="card__body">
        <h3 className="card__title">
          <a href={film.href} target="_blank" rel="noopener noreferrer">
            {film.title}
          </a>
        </h3>

        {meta.length > 0 && <p className="card__meta">{meta.join(" · ")}</p>}

        <p className="card__when">
          <time dateTime={film.start ?? undefined}>{when}</time>
          {doors && (
            <span className="card__doors">
              {" "}
              · {t.doorsLabel} {doors}
            </span>
          )}
        </p>

        {(film.venue || film.address) && (
          <p className="card__venue">
            <span className="card__venue-label">{t.venueLabel}:</span>{" "}
            {[film.venue, film.address].filter(Boolean).join(", ")}
          </p>
        )}

        {film.descriptionHtml && (
          <div
            className="card__synopsis"
            // Sanitized server-side in checkin/sanitize before reaching here.
            dangerouslySetInnerHTML={{ __html: film.descriptionHtml }}
          />
        )}

        {film.prices.length > 0 && (
          <p className="card__prices">
            <span className="card__venue-label">{t.priceLabel}:</span>{" "}
            {film.prices
              .map((p) => (p.price ? `${p.name} ${p.price} kr` : p.name))
              .join(" · ")}
          </p>
        )}

        <a className="card__cta" href={film.href} target="_blank" rel="noopener noreferrer">
          {t.ticketsCta} →
        </a>
      </div>
    </article>
  );
}
