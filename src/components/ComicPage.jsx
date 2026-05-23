const moodLabels = {
  occupation: "Ocupación",
  tension: "Tensión",
  fear: "Miedo civil",
  propaganda: "Propaganda",
  guilt: "Culpa",
  doubt: "Duda",
  contact: "Primer contacto",
  collapse: "Quiebre",
  fight: "Combate",
  reveal: "Revelación",
  truth: "Verdad",
  fracture: "Fractura",
};

export default function ComicPage({ page, tvEffectOn, onTvToggle, onImageLoad }) {
  const isTvPage = page.mood === "propaganda" || page.factionColor === "dictator";
  const isFightPage = page.pacing === "fast";

  return (
    <article
      id={`page-${page.id}`}
      className={[
        "comic-page",
        `comic-page--${page.mood}`,
        `comic-page--${page.pacing}`,
        isTvPage ? "comic-page--tv" : "",
        isFightPage ? "comic-page--fight" : "",
        isTvPage && tvEffectOn ? "crt-active" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      data-pacing={page.pacing}
      data-mood={page.mood}
      data-faction={page.factionColor}
    >
      <div className="comic-page__atmosphere" />

      <aside className="comic-page__meta">
        <span className="comic-page__number">
          {String(page.id).padStart(2, "0")}
        </span>

        <div>
          <p>{moodLabels[page.mood]}</p>
          <h2>{page.title}</h2>
        </div>
      </aside>

      <figure className="comic-page__frame">
        <img
          className="comic-page__image"
          src={page.image}
          alt={`Página ${page.id}: ${page.title}`}
          width="1536"
          height="2048"
          loading={page.id <= 2 ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={page.id === 1 ? "high" : undefined}
          onLoad={onImageLoad}
        />
        {isTvPage && <div className="comic-page__crt-overlay" aria-hidden="true" />}
      </figure>

      {isTvPage && (
        <div className="comic-page__tv-ctrl">
          <button
            type="button"
            className={`comic-page__tv-btn${tvEffectOn ? " comic-page__tv-btn--active" : ""}`}
            onClick={onTvToggle}
            aria-label={tvEffectOn ? "Desactivar señal TV" : "Activar señal TV"}
            aria-pressed={tvEffectOn}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 12a8 8 0 0 1 16 0" />
              <path d="M7.5 15a5 5 0 0 1 9 0" />
              <circle cx="12" cy="18" r="1.5" fill="currentColor" stroke="none" />
              <line x1="12" y1="19.5" x2="12" y2="23" />
              <line x1="9.5" y1="23" x2="14.5" y2="23" />
            </svg>
            <span>{tvEffectOn ? "SEÑAL ACTIVA" : "ACTIVAR SEÑAL"}</span>
          </button>
        </div>
      )}

      <div className="comic-page__caption">
        <p>{page.caption}</p>
        <small>{page.note}</small>
      </div>
    </article>
  );
}
