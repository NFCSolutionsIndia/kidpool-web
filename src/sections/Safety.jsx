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
  sos: <><circle cx="12" cy="12" r="8.5" className="acc" /><path d="M12 7.5v5.5M12 16.2v.3" /></>,
  late: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /><path d="M18.5 3.5l2 2" className="acc-s" /></>,
  id: <><rect x="3" y="5.5" width="18" height="13" rx="2.5" /><circle cx="8.5" cy="11" r="2" /><path d="M5.8 15.5c.6-1.4 1.6-2 2.7-2s2.1.6 2.7 2M13.5 10h4.5M13.5 13h3" /><circle cx="18.5" cy="16.5" r="3" className="acc" /></>,
  block: <><circle cx="12" cy="12" r="8.5" /><path d="M6 18 18 6" className="acc-s" /></>,
};
const FEATURES = [
  ["phone", "Private phone numbers", "Call other families in the app without sharing your number."],
  ["calls", "You choose who can call", "Turn calls off, or limit them to families you’ve ridden with."],
  ["home", "No home addresses shown", "Families see first names and rough distance — never your address."],
  ["live", "Live ride tracking", "Follow every ride on the map from pickup to drop-off."],
  ["qr", "Check-in at pickup & drop-off", "A quick QR check-in at each stop, and you’re notified straight away."],
  ["sos", "SOS during a ride", "A one-tap emergency button whenever a ride is in progress."],
  ["late", "Running-late alerts", "Drivers can let everyone know about delays in one tap."],
  ["id", "Driver ID check", "Drivers add a photo ID or license before offering rides."],
  ["block", "Block or report", "Block or report anyone, any time. You stay in control."],
];
function SafetyFeatures() {
  const [ref, active] = useActive("0px 0px -10% 0px");
  return (
    <div className={"sfeat rv" + (active ? " rv--in" : "")} ref={ref}>
      <div className="sfeat__head rv-up" style={{ "--d": ".1s" }}>
        <h3 className="sfeat__title">Built-in safety features</h3>
        <p className="sfeat__sub">Designed for parents, from the first message to the drop-off.</p>
      </div>
      <ul className="sfeat__grid">
        {FEATURES.map(([icon, title, text], i) => (
          <li key={title} className="sfeat__card rv-up" style={{ "--d": `${0.25 + i * 0.08}s` }}>
            <span className="sfeat__icon"><svg viewBox="0 0 24 24" aria-hidden="true">{I[icon]}</svg></span>
            <span><strong>{title}</strong><small>{text}</small></span>
          </li>
        ))}
      </ul>
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
          <h2 className="display-l rv-title" aria-label="You stay in control"><Words lines={["You stay in control"]} /></h2>
          <p className="lede rv-up" style={{ "--d": ".55s" }}>KidPool is for coordinating rides within your own pools, not with strangers on a public app. Every ride is something you choose to ask for or offer.</p>
          <ul className="points">
            <li className="rv-up sp" style={{ "--d": ".8s" }}><Icon name="together" /><div><h3>Your pool, not the public</h3><p>Rides are arranged only among families in the same pool, never with the public.</p></div></li>
            <li className="rv-up sp" style={{ "--d": ".95s" }}><Icon name="check" /><div><h3>Nothing happens without you</h3><p>Families review each request or offer and confirm before a ride goes ahead.</p></div></li>
            <li className="rv-up sp" style={{ "--d": "1.1s" }}><Icon name="route" /><div><h3>Clear details every time</h3><p>Time, pickup, drop-off, and children are on every ride, so nobody has to guess.</p></div></li>
          </ul>
        </div>
      </div>
      <div className="container"><SafetyFeatures /></div>
    </section>
  );
}
