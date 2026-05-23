import { useState } from "react";
import FactionModal from "./FactionModal";

export default function HeroIntro({ audioUnlocked, onUnlockAudio }) {
  const [activeFaction, setActiveFaction] = useState(null);

  return (
    <>
      <section className="hero-intro">
        <div className="hero-intro__grain" />

        <div className="hero-intro__content">
          <p className="hero-intro__kicker">Cómic web transmedia · Capítulo I</p>

          <h1 className="hero-intro__title">
            <span className="hero-intro__title-my">My</span>
            <span className="hero-intro__title-war">War</span>
          </h1>

          <p className="hero-intro__subtitle">La mirada que no existe</p>

          <p className="hero-intro__text">
            Lether no dudaba. Esa era su fuerza. Pero en una guerra construida
            sobre órdenes, propaganda y enemigos fabricados, la primera grieta
            puede nacer en silencio.
          </p>

          <div className="hero-intro__meta">
            {!audioUnlocked ? (
              <button
                type="button"
                className="hero-intro__activate-btn"
                onClick={onUnlockAudio}
                aria-label="Activar experiencia sonora"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                Activar experiencia
              </button>
            ) : (
              <p className="hero-intro__unlock-hint">Desplázate para comenzar</p>
            )}

            <div className={`hero-intro__factions${audioUnlocked ? "" : " hero-intro__factions--locked"}`}>
              <button
                type="button"
                className="hero-intro__faction-btn hero-intro__faction-btn--nekara"
                onClick={() => setActiveFaction("nekara")}
              >
                Nekara
              </button>
              <button
                type="button"
                className="hero-intro__faction-btn hero-intro__faction-btn--osvalia"
                onClick={() => setActiveFaction("osvalia")}
              >
                Osvalia
              </button>
              <button
                type="button"
                className="hero-intro__faction-btn hero-intro__faction-btn--redencion"
                onClick={() => setActiveFaction("redencion")}
              >
                Redención
              </button>
            </div>
          </div>
        </div>
      </section>

      {activeFaction && (
        <FactionModal
          faction={activeFaction}
          onClose={() => setActiveFaction(null)}
        />
      )}
    </>
  );
}
