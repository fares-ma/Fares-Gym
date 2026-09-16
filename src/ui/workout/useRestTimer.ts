"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Synthesizes a soft, clean chime using the Web Audio API without external audio assets.
 */
function playChime() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    // Harmonic arpeggio (two frequencies in quick succession: 587Hz -> 880Hz)
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.6);
  } catch {
    // Graceful fallback if audio is blocked by browser autoplay policy
  }
}

export function useRestTimer() {
  const [isActive, setIsActive] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(0);

  const endTimeRef = useRef<number | null>(null);
  const timerIdRef = useRef<NodeJS.Timeout | null>(null);

  const clearCurrentTimer = useCallback(() => {
    if (timerIdRef.current) {
      clearInterval(timerIdRef.current);
      timerIdRef.current = null;
    }
  }, []);

  const startTimer = useCallback(
    (seconds: number) => {
      clearCurrentTimer();
      const safeSecs = Math.max(5, seconds);
      setTotalSeconds(safeSecs);
      setSecondsRemaining(safeSecs);
      setIsActive(true);

      const endTime = Date.now() + safeSecs * 1000;
      endTimeRef.current = endTime;

      timerIdRef.current = setInterval(() => {
        if (!endTimeRef.current) return;
        const remaining = Math.round((endTimeRef.current - Date.now()) / 1000);

        if (remaining <= 0) {
          clearCurrentTimer();
          setSecondsRemaining(0);
          setIsActive(false);
          playChime();
        } else {
          setSecondsRemaining(remaining);
        }
      }, 500);
    },
    [clearCurrentTimer]
  );

  const addTime = useCallback((seconds: number) => {
    if (!endTimeRef.current) return;
    endTimeRef.current += seconds * 1000;
    setTotalSeconds((prev) => Math.max(0, prev + seconds));
    setSecondsRemaining((prev) => Math.max(0, prev + seconds));
  }, []);

  const skipTimer = useCallback(() => {
    clearCurrentTimer();
    setIsActive(false);
    setSecondsRemaining(0);
  }, [clearCurrentTimer]);

  useEffect(() => {
    return () => clearCurrentTimer();
  }, [clearCurrentTimer]);

  return {
    isActive,
    secondsRemaining,
    totalSeconds,
    startTimer,
    addTime,
    skipTimer,
  };
}
