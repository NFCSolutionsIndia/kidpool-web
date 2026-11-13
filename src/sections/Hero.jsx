import { useRef } from "react";
import { Icon } from "../components/ui";
import { getApp, appHref } from "./AppDownload";
import Leaves from "../components/Leaves";
import { useActive, Words } from "../components/Reveal";
import HeroScene from "../scenes/HeroScene";

export default function Hero() {
  const [copyRef, active] = useActive("0px 0px -10% 0px");
  const [visRef, visActive] = useActive("0px 0px -10% 0px");
  const sceneActive = useRef(false);
  sceneActive.current = visActive;
  return (
    <section className="hero" id="top">
      <Leaves items={[
        { x: "38%", y: "62%", size: 64, rot: -30, delay: 0 },
        { r: "3%", y: "58%", size: 80, rot: 20, blur: 1, delay: -2 },
        { x: "6%", y: "16%", size: 34, rot: 40, blur: 2, delay: -4 },
      ]} />
      <div className="container hero__grid">
        <div className={"hero__copy rv" + (active ? " rv--in" : "")} ref={copyRef}>
          <span className="accent-bar" aria-hidden="true" />
          <p className="hero__eyebrow rv-up" style={{ "--d": ".2s" }}><span className="hero__eyebrow-dot" />Made for family communities</p>
          <h1 className="display-xl rv-title" aria-label="Kid rides are easier together.">
            <Words lines={["Kid rides are", "easier together."]} highlight={{ word: "together.", className: "hero__mark" }} />
          </h1>
          <p className="lede rv-up" style={{ "--d": ".95s" }}>KidPool helps parents and guardians share their kids’ rides with families from their own communities. Wherever your children need to be, ask for a ride, offer a spare seat, and agree on the details together.</p>
          <div className="btn-row rv-up rv-up--pop" style={{ "--d": "1.15s" }}>
            <a href={appHref()} onClick={getApp} className="btn btn--lime">Get the app</a>
            <a href="#how" className="btn btn--ghost">See how it works</a>
          </div>
          <ul className="hero__chips">
            {["Ask for a ride", "Offer a spare seat", "Agree together"].map((t, i) => (
              <li key={t} className="rv-chip" style={{ "--i": i }}><span>{i + 1}</span>{t}</li>
            ))}
          </ul>
          <p className="hero__note rv-up" style={{ "--d": "1.75s" }}>For families who already know each other. KidPool isn’t a public ride service.</p>
        </div>
        <figure className={"hero__visual hv" + (visActive ? " hv--in" : "")} ref={visRef}>
          <div className="hero__stage">
            <div className="hero__capsule" aria-hidden="true" />
            <HeroScene activeRef={sceneActive} />
            <div className="hero__tag hero__tag--a"><span className="hero__tag-icon">✓</span><div><b>Seat offered</b><small>Mon · 8:05 am</small></div></div>
            <div className="hero__tag hero__tag--b"><span className="hero__tag-icon hero__tag-icon--ink">★</span><div><b>Same community</b><small>Families you know</small></div></div>
          </div>
          <figcaption className="scene-hint"><Icon name="drag" size={16} />Drag to turn the neighbourhood</figcaption>
        </figure>
      </div>
      <svg className="hero__wave" viewBox="0 0 1440 160" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 70 C 240 160, 480 10, 760 60 S 1200 150, 1440 40 L1440 160 L0 160 Z" fill="var(--bg)" />
      </svg>
    </section>
  );
}
