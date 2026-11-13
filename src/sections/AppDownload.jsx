import { useCallback, useEffect, useRef, useState } from "react";
import { Icon, Placeholder } from "../components/ui";
import Leaves from "../components/Leaves";

/* ---- Store links: replace with the live listings ---- */
export const PLAY_STORE_URL = "#"; // e.g. https://play.google.com/store/apps/details?id=<package.id>
export const APP_STORE_URL = "#";  // e.g. https://apps.apple.com/app/<app-name>/id<app-id>
const LINKS_READY = PLAY_STORE_URL !== "#" && APP_STORE_URL !== "#";

/* "Get the app" buttons: phones go straight to their store; everyone else
   lands on the app section with the store badges highlighted. */
export function getApp(e) {
  const ua = navigator.userAgent || "";
  const ios = /iPhone|iPad|iPod/i.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  const store = /Android/i.test(ua) ? PLAY_STORE_URL : ios ? APP_STORE_URL : null;
  if (store && store !== "#") return; // let the link open the store
  e?.preventDefault();
  const sec = document.getElementById("app");
  if (!sec) { location.hash = "app"; return; }
  sec.scrollIntoView({ behavior: "smooth", block: "center" });
  history.replaceState(null, "", "#app");
  const badges = sec.querySelector(".stores");
  if (badges) {
    badges.classList.remove("stores--flash");
    setTimeout(() => badges.classList.add("stores--flash"), 650);
    setTimeout(() => badges.classList.remove("stores--flash"), 2600);
  }
}
/* href for the buttons: the right store on phones, the app section otherwise */
export function appHref() {
  if (typeof navigator === "undefined") return "#app";
  const ua = navigator.userAgent || "";
  if (/Android/i.test(ua) && PLAY_STORE_URL !== "#") return PLAY_STORE_URL;
  if ((/iPhone|iPad|iPod/i.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) && APP_STORE_URL !== "#") return APP_STORE_URL;
  return "#app";
}

const AUTOPLAY_MS = 3800;

/* Screens exported from Figma "CarPooling_For_Student" (390×844) → public/app-screens */
const SLIDES = [
  { key: "home", src: "app-screens/home.png", title: "Your day at a glance", text: "Today’s ride, who’s driving, and families nearby who can help." },
  { key: "who", src: "app-screens/who-is-going.png", title: "Ask for a ride in a few taps", text: "Pick who’s going, where and when. Siblings ride together." },
  { key: "families", src: "app-screens/families.png?v=4", title: "Families going your way", text: "Parents from your own communities. Never addresses." },
  { key: "tracking", src: "app-screens/tracking.png", title: "Follow the ride live", text: "See pickup, the route and who’s driving, with SOS one tap away." },
  { key: "messages", src: "app-screens/messages.png?v=4", title: "Talk it through", text: "Message other families when plans change." },
  { key: "started", src: "app-screens/ride-started.png", title: "Updates as they happen", text: "A notification the moment your kids are picked up." },
];

/* ================= Store badges ================= */
const PlayLogo = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
    <path d="M3.6 1.8 13.8 12 3.6 22.2c-.4-.2-.6-.6-.6-1.1V2.9c0-.5.2-.9.6-1.1z" fill="var(--lime)" />
    <path d="M17.7 8.1 13.8 12l3.9 3.9 3.6-2.1c.9-.5.9-1.4 0-1.9z" fill="#fff" />
    <path d="M13.8 12 3.6 1.8c.3-.2.8-.2 1.2.1l12.9 6.2z" fill="#E4FA96" />
    <path d="M13.8 12 3.6 22.2c.3.2.8.2 1.2-.1l12.9-6.2z" fill="#9FB848" />
  </svg>
);
const AppleLogo = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="currentColor">
    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
  </svg>
);
export function StoreBadges() {
  const ext = LINKS_READY ? { target: "_blank", rel: "noopener noreferrer" } : {};
  return (
    <div className="stores">
      <a className="store" href={PLAY_STORE_URL} {...ext} aria-label="Get KidPool on Google Play">
        <PlayLogo /><span><small>GET IT ON</small><b>Google Play</b></span>
      </a>
      <a className="store" href={APP_STORE_URL} {...ext} aria-label="Download KidPool on the App Store">
        <AppleLogo /><span><small>Download on the</small><b>App Store</b></span>
      </a>
    </div>
  );
}

/* ================= Coverflow carousel ================= */
function wrapOffset(i, idx, n) {
  let d = i - idx;
  if (d > n / 2) d -= n;
  if (d < -n / 2) d += n;
  return d;
}

export default function AppDownload() {
  const n = SLIDES.length;
  const [idx, setIdx] = useState(0);
  const [hover, setHover] = useState(false);
  const [inView, setInView] = useState(false);
  const [copyIn, setCopyIn] = useState(false);
  const copyRef = useRef(null);
  const [dragX, setDragX] = useState(0);
  const stageRef = useRef(null);
  const drag = useRef({ x: 0, dx: 0, on: false });
  const reduce = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const dragging = dragX !== 0;
  const running = !hover && !dragging && inView && !reduce;

  const go = useCallback((d) => setIdx((v) => (v + d + n) % n), [n]);

  // autoplay only while the carousel is on screen
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  // replay the copy animation every time the section becomes active
  useEffect(() => {
    const el = copyRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setCopyIn(e.isIntersecting), { rootMargin: "-12% 0px -12% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!running) return;
    const t = setTimeout(() => go(1), AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [idx, running, go]);

  const onDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    drag.current = { x: e.clientX, dx: 0, on: true };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onMove = (e) => {
    if (!drag.current.on) return;
    drag.current.dx = e.clientX - drag.current.x;
    setDragX(drag.current.dx);
  };
  const onUp = () => {
    if (!drag.current.on) return;
    const { dx } = drag.current;
    drag.current.on = false;
    setDragX(0);
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
  };
  const onKey = (e) => {
    if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
  };

  const cur = SLIDES[idx];
  return (
    <section className="section appdl" id="app">
      <div className="container">
        <div className="appdl__panel">
          <Leaves items={[{ x: "44%", y: "8%", size: 46, rot: -30 }, { r: "2%", b: "6%", size: 70, rot: 20, blur: 1 }, { x: "3%", b: "10%", size: 36, rot: 50, tone: "deep" }]} />
          <div className="appdl__blob" aria-hidden="true" />
          <div className="appdl__grid" aria-hidden="true" />

          <div className={"appdl__copy" + (copyIn ? " appdl__copy--in" : "")} ref={copyRef}>
            <span className="accent-bar" aria-hidden="true" />
            <p className="appdl__kicker" aria-label="KidPool for Android and iPhone">
              {"KidPool for Android & iPhone".split("").map((ch, i) => (
                <span key={i} aria-hidden="true" style={{ "--i": i }}>{ch === " " ? "\u00A0" : ch}</span>
              ))}
            </p>
            <h2 className="display-l appdl__title" aria-label="Every kid ride, in your pocket.">
              {[["Every", "kid", "ride,"], ["in", "your", "pocket."]].map((line, l) => (
                <span className="appdl__line" key={l} aria-hidden="true">
                  {line.map((w, i) => (
                    <span className="appdl__wmask" key={w + i}>
                      <span className={"appdl__w" + (w === "pocket." ? " appdl__w--hl" : "")} style={{ "--i": l * 3 + i }}>{w}</span>
                    </span>
                  ))}
                </span>
              ))}
            </h2>
            <p className="lede appdl__reveal" style={{ "--d": "1.05s" }}>Ask for rides, offer spare seats and follow every pickup live, wherever you are.</p>
            <div className="appdl__reveal appdl__reveal--pop" style={{ "--d": "1.25s" }}><StoreBadges /></div>
            {!LINKS_READY && <div className="appdl__reveal" style={{ "--d": "1.4s" }}><Placeholder>Add the live Google Play and App Store links</Placeholder></div>}
            <ul className="appdl__ticks">
              {["Live ride tracking and pickup alerts", "Only families from your own communities", "Available for Android and iPhone"].map((t, i) => (
                <li key={t} style={{ "--i": i }}><Icon name="check" size={16} />{t}</li>
              ))}
            </ul>
          </div>

          <div className="appdl__carousel">
            <div className="appdl__fx" aria-hidden="true">
              <span className="appdl__beam" />
              <span className="orbit orbit--1"><i /></span>
              <span className="orbit orbit--2"><i /><i /></span>
              <span className="orbit orbit--3"><i /></span>
              <span className="fchip fchip--a"><b className="fchip__ic fchip__ic--ink">
                <svg viewBox="0 0 24 24"><path d="M5 17h14l-1.5-2V11a5.5 5.5 0 0 0-11 0v4z" /><path d="M10 20a2 2 0 0 0 4 0" /></svg></b>
                <span><strong>Ride started</strong><small>Jen picked up Emma · 8:12 AM</small></span></span>
              <span className="fchip fchip--b"><b className="fchip__ic">
                <svg viewBox="0 0 24 24"><path d="m6 12.5 4 4 8-9" /></svg></b>
                <span><strong>Seat confirmed</strong><small>Both families agreed</small></span></span>
              <span className="fchip fchip--c"><b className="fchip__ic fchip__ic--soft">
                <svg viewBox="0 0 24 24"><path d="M5 6h14v9H9l-4 3z" /></svg></b>
                <span><strong>Jen</strong><small>On my way! 🙂</small></span></span>
              <span className="fchip fchip--d"><b className="fchip__ic">
                <svg viewBox="0 0 24 24"><path d="M12 21s-6-5.4-6-10a6 6 0 0 1 12 0c0 4.6-6 10-6 10Z" /><circle cx="12" cy="11" r="2" /></svg></b>
                <span><strong>Pickup at Lincoln</strong><small>3:10 PM · Gate A</small></span></span>
            </div>
            <div
              className={"cf" + (dragging ? " cf--drag" : "")}
              ref={stageRef}
              role="region"
              aria-roledescription="carousel"
              aria-label="KidPool app screens. Use the left and right arrow keys to browse."
              tabIndex={0}
              onKeyDown={onKey}
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              onPointerDown={onDown}
              onPointerMove={onMove}
              onPointerUp={onUp}
              onPointerCancel={onUp}
            >
              {SLIDES.map(({ key, src, title }, i) => {
                const off = wrapOffset(i, idx, n);
                const a = Math.abs(off);
                const shift = off * 56 + dragX / 4;
                return (
                  <div
                    key={key}
                    className={"cf__slide" + (off === 0 ? " cf__slide--on" : "")}
                    style={{
                      transform: `translateX(${shift}%) translateZ(${-a * 170}px) rotateY(${off * -30}deg) scale(${1 - a * 0.08})`,
                      opacity: a > 2 ? 0 : 1 - a * 0.25,
                      zIndex: 10 - a,
                      pointerEvents: a > 2 ? "none" : undefined,
                    }}
                    aria-hidden={off !== 0}
                    onClick={() => { if (off !== 0 && Math.abs(drag.current.dx) < 6) go(off); }}
                  >
                    <div className="aphone">
                      <img className="aphone__screen" src={src} alt={off === 0 ? `KidPool app: ${title}` : ""} width="390" height="844" loading="lazy" draggable="false" />
                      <span className="aphone__island" />
                      <span className="aphone__glare" />
                    </div>
                  </div>
                );
              })}
              <div className="cf__floor" aria-hidden="true" />
            </div>

            <div className="cf__caption" aria-live="polite">
              <b key={cur.key + "t"}>{cur.title}</b>
              <span key={cur.key + "s"}>{cur.text}</span>
            </div>
            <div className="cf__controls">
              <button className="cf__arrow" onClick={() => go(-1)} aria-label="Previous screen">←</button>
              <div className="cf__dots">
                {SLIDES.map((s, i) => (
                  <button key={s.key} aria-label={`Show: ${s.title}`} aria-current={i === idx}
                    className={"cf__dot" + (i === idx ? " cf__dot--on" : "")} onClick={() => setIdx(i)}>
                    {i === idx && <i key={`${idx}-${running}`} className={running ? "run" : ""} style={{ animationDuration: `${AUTOPLAY_MS}ms` }} />}
                  </button>
                ))}
              </div>
              <button className="cf__arrow" onClick={() => go(1)} aria-label="Next screen">→</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
