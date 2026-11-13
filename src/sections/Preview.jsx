import { useEffect, useRef, useState } from "react";
import { C, reducedMotion } from "../lib/threeKit";
import { Icon } from "../components/ui";
import { useActive, Words } from "../components/Reveal";


/* ================= 6. PRODUCT PREVIEW — 3D phone ================= */
const STATES = [
  { label: "Requested", pill: "Looking for a seat", line: "Your request is visible to families in your community.", action: "Simulate an offer" },
  { label: "Seat offered", pill: "Seat offered", line: "Sam Okafor can take Maya and Leo at 7:45 AM.", action: "Accept the seat" },
  { label: "Confirmed", pill: "Confirmed", line: "Pickup with Sam at 7:45 AM. Both families agreed.", action: "Start again" },
];
export default function Preview() {
  const [s, setS] = useState(0);
  const stage = useRef(null);
  const phone = useRef(null);
  useEffect(() => {
    const st = stage.current, ph = phone.current;
    if (!st || !ph || reducedMotion()) return;
    let raf = 0, tx = -16, ty = 6, x = -16, y = 6, drag = 0, down = false, lx = 0;
    const loop = () => {
      x += (tx + drag - x) * 0.08; y += (ty - y) * 0.08;
      ph.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
      raf = requestAnimationFrame(loop);
    };
    const mv = (e) => {
      const r = st.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 34 - 6;
      ty = -((e.clientY - r.top) / r.height - 0.5) * 18 + 4;
      if (down) { drag = Math.max(-40, Math.min(40, drag + (e.clientX - lx) * 0.3)); lx = e.clientX; }
    };
    const dn = (e) => { down = true; lx = e.clientX; };
    const up = () => { down = false; drag = 0; };
    const lv = () => { tx = -16; ty = 6; };
    st.addEventListener("pointermove", mv); st.addEventListener("pointerleave", lv);
    st.addEventListener("pointerdown", dn); window.addEventListener("pointerup", up);
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); st.removeEventListener("pointermove", mv); st.removeEventListener("pointerleave", lv); st.removeEventListener("pointerdown", dn); window.removeEventListener("pointerup", up); };
  }, []);
  const cur = STATES[s];
  const [secRef, active] = useActive("0px 0px -12% 0px");
  return (
    <section className={"section section--tint pview" + (active ? " pview--in" : "")} id="preview" ref={secRef}>
      <div className="pview__photo" aria-hidden="true" />
      <div className="container preview">
        <div className={"preview__copy rv" + (active ? " rv--in" : "")}>
          <span className="accent-bar" aria-hidden="true" />
          <h2 className="display-l rv-title" aria-label="What a ride request looks like"><Words lines={["What a ride", "request looks like"]} /></h2>
          <p className="lede rv-up" style={{ "--d": ".7s" }}>Every request shows when, where, and who. Both families can see the same details before anyone says yes.</p>
          <div className="status-picker rv-up" style={{ "--d": ".9s" }} role="group" aria-label="Show the request at each stage">
            {STATES.map((st, i) => (
              <button key={st.label} className={"chip" + (i === s ? " chip--on" : "")} aria-pressed={i === s} onClick={() => setS(i)}>
                <span className="chip__dot" />{st.label}
              </button>
            ))}
          </div>
        </div>
        <div className="phone-stage" ref={stage}>
          <div className="phone" ref={phone}>
            <div className="phone__body" aria-live="polite">
              <div className="phone__bar"><span>9:41</span><span className="phone__notch" /><span>●●●</span></div>
              <p className="app__title">Ride request</p>
              <div className="app__card app__card--map layer-1">
                <svg viewBox="0 0 260 110" className="map" aria-hidden="true">
                  <rect width="260" height="110" rx="14" className="map__bg" />
                  <path d="M0 70 H260 M90 0 V110 M190 0 V110 M0 25 H260" className="map__street" />
                  <path d="M34 82 C 80 82, 90 40, 140 40 S 210 30, 226 26" className={"map__route" + (s === 2 ? " map__route--done" : "")} />
                  <circle cx="34" cy="82" r="7" className="map__start" /><circle cx="226" cy="26" r="7" className="map__end" />
                </svg>
                <div className="app__row"><Icon name="route" size={18} /><span><b>Maple Street</b> to <b>Lincoln Elementary</b></span></div>
                <div className="app__row"><Icon name="calendar" size={18} /><span>Tuesday, 7:45 AM</span></div>
              </div>
              <div className="app__card layer-2">
                <p className="app__label">Children</p>
                <div className="kids"><span className="kid">Maya, 8</span><span className="kid">Leo, 6</span></div>
              </div>
              <div className={"app__card app__status layer-3 status--" + s}>
                <span className="pill">{cur.pill}</span>
                <p>{cur.line}</p>
                <button className="btn btn--lime btn--sm btn--block" onClick={() => setS((s + 1) % 3)}>{cur.action}</button>
              </div>
            </div>
          </div>
          <div className="phone-shadow" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
