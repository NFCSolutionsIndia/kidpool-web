import { useEffect, useRef, useState } from "react";
import { Icon, Placeholder } from "../components/ui";
import { CommunityScene } from "../scenes/lazy";
import { useActive, Words } from "../components/Reveal";

/* simple line icons for the safety features (ink stroke, lime accent) */
const I = {
  phone: <><rect x="7" y="2.5" width="10" height="19" rx="2.5" /><path d="M11 18.5h2" /><circle cx="17.5" cy="6.5" r="3.5" className="acc" /><path d="M16.2 6.5l.9.9 1.6-1.7" /></>,
  calls: <><path d="M6.5 4h3l1.5 4-2 1.3a10 10 0 0 0 5.7 5.7L16 13l4 1.5v3A2 2 0 0 1 18 19.5 15.5 15.5 0 0 1 4.5 6a2 2 0 0 1 2-2Z" /><path d="M15 4l5 5M20 4l-5 5" className="acc-s" /></>,
  home: <><path d="M4 11.5 12 5l8 6.5V20H4z" /><path d="M3 21 21 3" className="acc-s" /></>,
  live: <><path d="M12 21s-6-5.4-6-10a6 6 0 0 1 12 0c0 4.6-6 10-6 10Z" /><circle cx="12" cy="11" r="2.4" className="acc" /></>,
  qr: <><rect x="3.5" y="3.5" width="6" height="6" rx="1" /><rect x="14.5" y="3.5" width="6" height="6" rx="1" /><rect x="3.5" y="14.5" width="6" height="6" rx="1" /><path d="M14.5 14.5h2.5v2.5M20.5 14.5v6h-3.5M14.5 20.5v-2" /><rect x="5.5" y="5.5" width="2" height="2" className="acc" /></>,
  sos: <><circle cx="12" cy="12" r="8.5" className="acc acc--ring" /><path d="M12 7.5v5.5M12 16.2v.3" /></>,
  late: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /><path d="M18.5 3.5l2 2" className="acc-s" /></>,
  id: <><rect x="3" y="5.5" width="18" height="13" rx="2.5" /><circle cx="8.5" cy="11" r="2" /><path d="M5.8 15.5c.6-1.4 1.6-2 2.7-2s2.1.6 2.7 2M13.5 10h4.5M13.5 13h3" /><circle cx="18.5" cy="16.5" r="3" className="acc" /></>,
  block: <><circle cx="12" cy="12" r="8.5" /><path d="M6 18 18 6" className="acc-s" /></>,
};
const FEATURES = [
  /* Wording describes what each feature does, never a guarantee of safety (FTC). Keep in step with the live app. */
  ["phone", "Private calls", "Calls connect through KidsPool, so your phone number is never shown."],
  ["calls", "Calls are off by default", "Turn them on only if you want, and choose who can call: families you’ve ridden with or chatted with."],
  /* Address privacy, live tracking, SOS and driver checks are covered by the points above the grid.
     QR check-in is held back until schools or venues have agreed to use it. */
  ["late", "Running-late alerts", "Drivers can let everyone know about delays in one tap."],
  ["block", "Block or report", "Blocking a family works both ways, instantly. Report a safety concern to our team any time."],
];
function SafetyFeatures() {
  const [ref, active] = useActive("0px 0px -10% 0px");
  return (
    <div className={"sfeat rv" + (active ? " rv--in" : "")} ref={ref}>
      <div className="sfeat__head rv-up" style={{ "--d": ".1s" }}>
        <h3 className="sfeat__title">More built-in safety features</h3>
      </div>
      <ul className="sfeat__grid sfeat__grid--4">
        {FEATURES.map(([icon, title, text], i) => (
          <li key={title} className="sfeat__card rv-up" style={{ "--d": `${0.25 + i * 0.08}s` }}>
            <span className="sfeat__icon"><svg viewBox="0 0 24 24" aria-hidden="true">{I[icon]}</svg></span>
            <span><strong>{title}</strong><small>{text}</small></span>
          </li>
        ))}
      </ul>
      <p className="sfeat__note rv-up" style={{ "--d": "1s" }}>Features can vary by app version. No check is perfect, so you always decide who your child rides with. In an emergency, always call 911.</p>
    </div>
  );
}

export default function Safety() {
  const [mode, setMode] = useState(0);
  const modeRef = useRef(0);
  useEffect(() => { modeRef.current = mode; }, [mode]);
  // replay the entrance (text + sphere) every time the section becomes active
  const [topRef, active] = useActive("0px 0px -12% 0px");
  const activeRef = useRef(false);
  useEffect(() => { activeRef.current = active; }, [active]);
  const captions = [
    "Your pool: the families you can coordinate rides with.",
    "One ride: a family asks, another offers, and both confirm the details.",
  ];
  return (
    <section className="section safe-bg" id="safety">
      <div className="safe-bg__light" aria-hidden="true" />
      <div className={"container safety rv" + (active ? " rv--in" : "")} ref={topRef}>
        <div className={"safety__visual sv" + (active ? " sv--in" : "")}>
          <CommunityScene modeRef={modeRef} activeRef={activeRef} />
          <div className="segmented rv-up" style={{ "--d": "1.1s" }} role="group" aria-label="Choose what the diagram shows">
            {["Your pool", "A single ride"].map((l, i) => (
              <button key={l} aria-pressed={mode === i} className={mode === i ? "on" : ""} onClick={() => setMode(i)}>{l}</button>
            ))}
          </div>
          <p className="safety__caption rv-up" style={{ "--d": "1.25s" }} aria-live="polite">{captions[mode]}</p>
        </div>
        <div className="safety__copy">
          <span className="accent-bar rv-up" style={{ "--d": ".1s" }} aria-hidden="true" />
          <h2 className="display-l rv-title" aria-label="Your circle, backed by built-in safety"><Words lines={["Your circle, backed", "by built-in safety"]} /></h2>
          <p className="lede rv-up" style={{ "--d": ".55s" }}>KidsPool isn’t a public rideshare. It’s a private carpool network built around your family’s real-life community. Whether you’re trading off drives with neighbors or parents on the same soccer team, every driver is checked and every ride needs your approval.</p>
          <ul className="points">
            <li className="rv-up sp" style={{ "--d": ".8s" }}><Icon name="together" /><div><h3>Private pools, never the public</h3><p>Join the pool for your child’s school, team, or program, or request one for your own group. Rides are arranged only among families in the same pool.</p></div></li>
            <li className="rv-up sp" style={{ "--d": ".95s" }}><Icon name="check" /><div><h3>Background-checked drivers</h3><p>Every parent who offers a ride scans their driver’s license and passes a background check before taking the wheel.</p></div></li>
            <li className="rv-up sp" style={{ "--d": "1.1s" }}><Icon name="control" /><div><h3>Address privacy by default</h3><p>Pool members see only first names and a rough distance. Your address is shared only with the family you book a ride with, and your phone number is never shown.</p></div></li>
            <li className="rv-up sp" style={{ "--d": "1.25s" }}><Icon name="route" /><div><h3>Live tracking &amp; 911 SOS</h3><p>Follow the car from pickup to drop-off with arrival alerts, and one tap calls 911 during a ride.</p></div></li>
          </ul>
        </div>
      </div>
      <div className="container"><SafetyFeatures /></div>
    </section>
  );
}
