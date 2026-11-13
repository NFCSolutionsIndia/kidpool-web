import { useEffect, useRef, useState } from "react";

/* true while the element is "active" (inside the middle band of the viewport).
   Flips back to false when it leaves, so entrance animations replay each visit. */
/* `initial`: start active (used for the hero, which is on screen at load, so its entrance
   plays from CSS as soon as the pre-rendered page paints, before any JavaScript runs). */
export function useActive(margin = "-12% 0px -12% 0px", initial = false) {
  const ref = useRef(null);
  const [active, setActive] = useState(initial);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") { setActive(true); return; }
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { rootMargin: margin });
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);
  return [ref, active];
}

/* Splits text into masked words that rise in one after another.
   lines: array of strings (one per line). start: index offset for the stagger.
   highlight: { word: "together.", className: "hero__mark" } wraps that word. */
export function Words({ lines, start = 0, highlight }) {
  let n = start;
  return lines.map((line, l) => (
    <span className="rv-line" key={l} aria-hidden="true">
      {line.split(" ").map((w, i) => {
        const idx = n++;
        const hl = highlight && w === highlight.word;
        return (
          <span className="rv-mask" key={w + i}>
            <span className={"rv-w" + (hl ? " " + highlight.className : "")} style={{ "--i": idx }}>{w}</span>
          </span>
        );
      })}
    </span>
  ));
}
