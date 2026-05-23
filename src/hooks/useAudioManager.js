import { useRef, useState, useCallback, useEffect } from "react";

function rampVolume(audioEl, targetVol, durationMs) {
  if (!audioEl) return null;
  const startVol = audioEl.volume;
  const steps = 25;
  const stepMs = Math.max(20, durationMs / steps);
  const delta = (targetVol - startVol) / steps;
  let i = 0;
  const id = setInterval(() => {
    i++;
    audioEl.volume = Math.min(1, Math.max(0, startVol + delta * i));
    if (i >= steps) {
      clearInterval(id);
      if (targetVol === 0 && !audioEl.paused) audioEl.pause();
    }
  }, stepMs);
  return id;
}

export default function useAudioManager() {
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const [muted, setMuted] = useState(false);

  const windRef = useRef(null);
  const staticRef = useRef(null);
  const impactRef = useRef(null);

  const unlockedRef = useRef(false);
  const impactCooldownRef = useRef(false);
  const rampIds = useRef({});

  useEffect(() => {
    windRef.current = new Audio("/comic/audio/low-wind.mp3");
    windRef.current.loop = true;
    windRef.current.volume = 0;

    staticRef.current = new Audio("/comic/audio/static-noise.mp3");
    staticRef.current.loop = true;
    staticRef.current.volume = 0;

    impactRef.current = new Audio("/comic/audio/impact-hit.mp3");
    impactRef.current.volume = 0.28;

    return () => {
      Object.values(rampIds.current).forEach(clearInterval);
      [windRef, staticRef, impactRef].forEach(({ current }) => {
        if (current) { current.pause(); current.src = ""; }
      });
    };
  }, []);

  useEffect(() => {
    [windRef, staticRef, impactRef].forEach(({ current }) => {
      if (current) current.muted = muted;
    });
  }, [muted]);

  // Pause ambient audio when tab loses focus, resume on return
  useEffect(() => {
    const handleVisibility = () => {
      if (!unlockedRef.current) return;
      if (document.hidden) {
        windRef.current?.pause();
        staticRef.current?.pause();
      } else {
        if (windRef.current && windRef.current.volume > 0) {
          windRef.current.play().catch(() => {});
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  const unlockAudio = useCallback(() => {
    if (unlockedRef.current) return;
    unlockedRef.current = true;
    setAudioUnlocked(true);
    if (windRef.current) {
      windRef.current.play().catch(() => {});
      clearInterval(rampIds.current.wind);
      rampIds.current.wind = rampVolume(windRef.current, 0.06, 2500);
    }
  }, []);

  const toggleMute = useCallback(() => setMuted((m) => !m), []);

  const startStatic = useCallback(() => {
    if (!unlockedRef.current || !staticRef.current) return;
    if (staticRef.current.paused) {
      staticRef.current.currentTime = 0;
      staticRef.current.volume = 0;
      staticRef.current.play().catch(() => {});
    }
    clearInterval(rampIds.current.static);
    rampIds.current.static = rampVolume(staticRef.current, 0.08, 2500);
  }, []);

  const stopStatic = useCallback(() => {
    if (!staticRef.current) return;
    clearInterval(rampIds.current.static);
    rampIds.current.static = rampVolume(staticRef.current, 0, 2000);
  }, []);

  // 5-second cooldown prevents re-triggering on back-and-forth scroll
  const playImpact = useCallback(() => {
    if (!unlockedRef.current || !impactRef.current) return;
    if (impactCooldownRef.current) return;
    impactRef.current.currentTime = 0;
    impactRef.current.play().catch(() => {});
    impactCooldownRef.current = true;
    setTimeout(() => { impactCooldownRef.current = false; }, 5000);
  }, []);

  return { audioUnlocked, muted, unlockAudio, toggleMute, startStatic, stopStatic, playImpact };
}
