/* Click ripple for buttons: a soft circle bursts out from where the button was pressed.
   One delegated listener for the whole page; skipped for reduced motion or when animations are paused. */
const SELECTOR = ".btn, .store, .cin__app, .cine__play, .pause-toggle";

export function installRipple() {
  if (typeof document === "undefined") return;
  document.addEventListener("pointerdown", (e) => {
    const el = e.target.closest?.(SELECTOR);
    if (!el) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    if (document.documentElement.classList.contains("motion-paused")) return;
    const r = el.getBoundingClientRect();
    const size = Math.max(r.width, r.height) * 2.2;
    const dot = document.createElement("span");
    dot.className = "btn-ripple";
    dot.setAttribute("aria-hidden", "true");
    dot.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - r.left - size / 2}px;top:${e.clientY - r.top - size / 2}px`;
    el.appendChild(dot);
    dot.addEventListener("animationend", () => dot.remove(), { once: true });
  }, { passive: true });
}
