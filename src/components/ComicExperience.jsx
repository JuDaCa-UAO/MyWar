import { useRef, useState, useEffect, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { comicPages } from "../data/comicPages";
import HeroIntro from "./HeroIntro";
import ComicPage from "./ComicPage";
import ProgressRail from "./ProgressRail";
import ReadingHint from "./ReadingHint";
import TransmediaEnd from "./TransmediaEnd";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion";
import useAudioManager from "../hooks/useAudioManager";

gsap.registerPlugin(ScrollTrigger);

export default function ComicExperience() {
  const containerRef = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [tvEffectOn, setTvEffectOn] = useState(false);

  const { audioUnlocked, muted, unlockAudio, toggleMute, startStatic, stopStatic, playImpact } =
    useAudioManager();

  // Sync TV button state with static audio fade
  useEffect(() => {
    if (tvEffectOn) startStatic();
    else stopStatic();
  }, [tvEffectOn, startStatic, stopStatic]);

  // Correct ScrollTrigger positions after lazy images load
  const refreshTimerRef = useRef(null);
  const handleImageLoad = useCallback(() => {
    clearTimeout(refreshTimerRef.current);
    refreshTimerRef.current = setTimeout(() => ScrollTrigger.refresh(), 300);
  }, []);

  useEffect(() => {
    const onWindowLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onWindowLoad);
    return () => window.removeEventListener("load", onWindowLoad);
  }, []);

  useGSAP(
    () => {
      if (prefersReducedMotion) return;

      const pages = gsap.utils.toArray(".comic-page");

      pages.forEach((page) => {
        const image = page.querySelector(".comic-page__image");
        const meta = page.querySelector(".comic-page__meta");
        const caption = page.querySelector(".comic-page__caption");
        const atmosphere = page.querySelector(".comic-page__atmosphere");

        const isPause = page.dataset.pacing === "pause";
        const isFast = page.dataset.pacing === "fast";

        gsap.fromTo(
          image,
          {
            opacity: 0,
            y: isFast ? 40 : 80,
            scale: isFast ? 0.98 : 0.94,
            rotate: isFast ? -1.5 : 0,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotate: 0,
            duration: isFast ? 0.7 : 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: page,
              start: "top 70%",
              end: "center 35%",
              scrub: isFast ? 0.5 : 1,
            },
          }
        );

        gsap.fromTo(
          meta,
          { opacity: 0, x: -24 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: page,
              start: "top 65%",
              toggleActions: "play none none reverse",
            },
          }
        );

        gsap.fromTo(
          caption,
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: isPause ? 1.4 : 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: page,
              start: isPause ? "center 70%" : "center 80%",
              toggleActions: "play none none reverse",
            },
          }
        );

        gsap.to(atmosphere, {
          opacity: isPause ? 0.55 : 0.32,
          scale: 1.08,
          ease: "none",
          scrollTrigger: {
            trigger: page,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });

        // Impact on fight and collapse pages — hook enforces 5s cooldown
        if (["fight", "collapse"].includes(page.dataset.mood)) {
          ScrollTrigger.create({
            trigger: page,
            start: "top 55%",
            once: true,
            onEnter: () => playImpact(),
          });
        }
      });

      gsap.to(".progress-rail__bar", {
        height: "100%",
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });
    },
    { scope: containerRef, dependencies: [prefersReducedMotion, playImpact] }
  );

  return (
    <main ref={containerRef} className="experience-shell">
      <ProgressRail pages={comicPages} />

      <button
        type="button"
        className={`audio-mute-btn${muted ? " audio-mute-btn--off" : ""}`}
        onClick={toggleMute}
        aria-label={muted ? "Activar audio" : "Silenciar audio"}
        aria-pressed={muted}
      >
        {muted ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        )}
      </button>

      <HeroIntro audioUnlocked={audioUnlocked} onUnlockAudio={unlockAudio} />

      <ReadingHint />

      <section className="comic-reader" aria-label="Capítulo 1 del cómic My War">
        {comicPages.map((page) => (
          <ComicPage
            key={page.id}
            page={page}
            tvEffectOn={tvEffectOn}
            onTvToggle={() => setTvEffectOn((v) => !v)}
            onImageLoad={handleImageLoad}
          />
        ))}
      </section>

      <TransmediaEnd />
    </main>
  );
}
