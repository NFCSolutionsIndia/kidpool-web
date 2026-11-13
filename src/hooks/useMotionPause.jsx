import { useEffect, useState } from "react";

/* One site-wide "pause animations" switch (WCAG 2.2.2 Pause, Stop, Hide).
   It puts .motion-paused on <html>, which freezes CSS animations, and every
   scene, carousel and auto-advancing story checks it before moving.
   The choice is remembered for the visitor. */
const KEY = "kp-motion-paused";
const listeners = new Set();

export const motionPaused = () =>
  typeof document !== "undefined" && document.documentElement.classList.contains("motion-paused");

export function setMotionPaused(on) {
  document.documentElement.classList.toggle("motion-paused", on);
  try { localStorage.setItem(KEY, on ? "1" : "0"); } catch { /* private mode: still works for this visit */ }
  listeners.forEach((fn) => fn(on));
}

// restore the visitor's choice as early as possible
if (typeof document !== "undefined") {
  try { if (localStorage.getItem(KEY) === "1") document.documentElement.classList.add("motion-paused"); } catch { /* ignore */ }
}

export function useMotionPaused() {
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    setPaused(motionPaused());
    listeners.add(setPaused);
    return () => listeners.delete(setPaused);
  }, []);
  return [paused, setMotionPaused];
}

/* small reusable toggle button */
export function PauseToggle({ className = "", label = "animations" }) {
  const [paused, set] = useMotionPaused();
  return (
    <button type="button" className={"pause-toggle " + className} aria-pressed={paused} onClick={() => set(!paused)}>
      <span aria-hidden="true">{paused ? "▶" : "❚❚"}</span>
      {paused ? `Play ${label}` : `Pause ${label}`}
    </button>
  );
}
