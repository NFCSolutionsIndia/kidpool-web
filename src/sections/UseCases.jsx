import { useState } from "react";
import { Icon } from "../components/ui";
import { useActive, Words } from "../components/Reveal";
import { getApp, useAppHref } from "./AppDownload";
import { url } from "../lib/base";

/* ================= 8. USE CASES — cinematic poster cards (flip to see how KidPool helps) ================= */
const CASES = [
  {
    img: url("illustrations/hero-dropoff.webp"), pos: "62% 60%", icon: "repeat", front: "The regular drop-off", sub: "Same place, same time, every week.",
    back: "Share the week with a family going the same way.",
    steps: [["Mornings", "You drive"], ["Pickups", "Sam drives"], ["Every week", "Set once, it repeats"]],
  },
  {
    img: url("illustrations/busy-evening.webp"), pos: "50% 45%", icon: "calendar", front: "Busy evenings", sub: "Practice at four, a lesson at five, and only one of you.",
    back: "Ask families going to the same place for a seat.",
    steps: [["5:30 pm", "You ask for a seat"], ["5:32 pm", "John offers one"], ["Confirmed", "Both families agree"]],
  },
  {
    img: url("illustrations/plans-change.webp"), pos: "45% 40%", icon: "flip", front: "When plans change", sub: "A late meeting, a sick sibling, a flat tire.",
    back: "Post a request for today and let your pool help.",
    steps: [["Now", "You post a request"], ["+2 min", "Nearby families see it"], ["Sorted", "“I’ve got Leo!”"]],
  },
];

function FlipCard({ c, i }) {
  const appStore = useAppHref();
  const [flipped, setFlipped] = useState(false);
  const [pick, setPick] = useState(-1);
  const flip = (v) => { setFlipped(v); setPick(-1); };
  return (
    <li className={"flip fc cin" + (flipped ? " flip--on" : "")} style={{ "--d": `${0.75 + i * 0.16}s`, "--k": i }}>
      <div className="flip__inner">
        {/* front: the whole poster flips the card */}
        <button type="button" className="flip__face flip__front cin__front" onClick={() => flip(true)}
          aria-hidden={flipped} tabIndex={flipped ? -1 : 0} aria-label={`${c.front}. ${c.sub} Show how KidPool helps`}>
          <span className="cin__media"><img src={c.img} alt="" loading="lazy" style={{ objectPosition: c.pos }} /></span>
          <span className="cin__shade" />
          <span className="cin__shine" />
          <span className="cin__top">
                        <span className="cin__icon"><Icon name={c.icon} size={22} /></span>
          </span>
          <span className="cin__body">
            <span className="flip__title cin__title">{c.front}</span>
            <span className="flip__sub cin__sub">{c.sub}</span>
            <span className="cin__cta">How KidPool helps <span className="cin__arrow">→</span></span>
          </span>
        </button>

        {/* back: the same scene, blurred, with an interactive ride timeline */}
        <div className="flip__face flip__back cin__back" aria-hidden={!flipped} inert={!flipped ? "" : undefined}>
          <span className="cin__backimg"><img src={c.img} alt="" loading="lazy" style={{ objectPosition: c.pos }} /></span>
          <div className="cin__backin">
            <p className="cin__eyebrow"><span className="cin__check"><Icon name="check" size={16} /></span>How KidPool helps</p>
            <h3 className="flip__title">{c.front}</h3>
            <p className="cin__lead">{c.back}</p>
            <ol className="cin__steps">
              {c.steps.map(([when, what], s) => (
                <li key={when} style={{ "--s": s }} className={pick === s ? "is-on" : ""}>
                  <span className="cin__tick" aria-hidden="true"><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg></span>
                  <button type="button" className={"cin__step" + (pick === s ? " is-on" : "")}
                    onMouseEnter={() => setPick(s)} onFocus={() => setPick(s)} onClick={() => setPick(s)}>
                    
                    <span className="cin__when">{when}</span>
                    <span className="cin__what">{what}</span>
                  </button>
                </li>
              ))}
            </ol>
            <div className="cin__actions">
              <a className="cin__app" href={appStore} onClick={getApp}>Get the app <span aria-hidden="true">→</span></a>
              <button type="button" className="cin__backbtn" onClick={() => flip(false)}>← Back</button>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

export default function UseCases() {
  const [ref, active] = useActive("0px 0px -12% 0px");
  return (
    <section className="section section--tint">
      <div className={"container rv" + (active ? " rv--in" : "")} ref={ref}>
        <div className="section__head">
          <span className="accent-bar rv-up" style={{ "--d": ".1s" }} aria-hidden="true" />
          <h2 className="display-l rv-title" aria-label="Where KidPool fits"><Words lines={["Where KidPool fits"]} /></h2>
          <p className="lede rv-up" style={{ "--d": ".6s" }}>Real weeks rarely go to plan. Turn a card to see how families use KidPool in each case.</p>
        </div>
        <ul className="flips">{CASES.map((c, i) => <FlipCard key={c.front} c={c} i={i} />)}</ul>
      </div>
    </section>
  );
}
