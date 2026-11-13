import { useEffect, useRef, useState } from "react";
import { useMotionPaused } from "../hooks/useMotionPause";
import { Words } from "../components/Reveal";
import { reducedMotion } from "../lib/brand";
import { Icon } from "../components/ui";
import { StepsScene } from "../scenes/lazy";

/* ================= 4. HOW IT WORKS — cinematic, four-scene story ================= */
export const STEPS = [
  { icon: "together", title: "Join a pool", text: "Join a pool for each place your kids go, so you’re coordinating with families you know." },
  { icon: "child", title: "Add your children", text: "Add each child and the activities they go to, so rides match real schedules." },
  { icon: "seat", title: "Request or offer a seat", text: "Ask for a ride when you need one, or share an empty seat when you’re already going." },
  { icon: "check", title: "Review and coordinate", text: "Check the time, route, and children, then confirm the plan with the other family." },
];
const SCENE_MS = 4200;

/* Film-style timecode HH:MM:SS:FF, ticking only while the section is visible */
function Timecode({ running }) {
  const el = useRef(null);
  useEffect(() => {
    if (!running) return;
    let raf = 0, start = performance.now() - (Number(el.current?.dataset.ms) || 0);
    const pad = (n) => String(n).padStart(2, "0");
    const tick = (now) => {
      const ms = now - start;
      if (el.current) {
        el.current.dataset.ms = ms;
        const s = Math.floor(ms / 1000), f = Math.floor((ms % 1000) / (1000 / 24));
        el.current.textContent = `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}:${pad(f)}`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running]);
  return <span className="cine__tc" ref={el}>00:00:00:00</span>;
}

export default function HowItWorks() {
  const [step, setStep] = useState(0);
  const stepRef = useRef(0);
  const [auto, setAuto] = useState(!reducedMotion());
  const [sitePaused, setSitePaused] = useMotionPaused();
  const secRef = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => { stepRef.current = step; }, [step]);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: "-25% 0px -25% 0px" });
    secRef.current && io.observe(secRef.current);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!auto || !inView || sitePaused) return;
    const id = setTimeout(() => setStep((s) => (s + 1) % 4), SCENE_MS);
    return () => clearTimeout(id);
  }, [auto, inView, step, sitePaused]);
  const choose = (i) => { setAuto(false); setStep(i); };
  const playing = auto && inView && !sitePaused;
  const cur = STEPS[step];

  return (
    <section className={"section cine" + (inView ? " cine--in" : "")} id="how" ref={secRef}>
      <div className="cine__spot" aria-hidden="true" />
      <div className="container">
        <div className={"section__head cine__head rv" + (inView ? " rv--in" : "")}>
          <p className="cine__eyebrow rv-up" style={{ "--d": ".1s" }}><span className="cine__rec" />A four-scene story</p>
          <h2 className="display-l rv-title" aria-label="How it works"><Words lines={["How it works"]} /></h2>
          <p className="lede rv-up" style={{ "--d": ".7s" }}>Four steps from “can anyone help?” to a plan both families agree on. Pick a scene to drive there.</p>
        </div>

        <div className="cine__screen">
          <StepsScene stepRef={stepRef} />
          <div className="cine__grain" aria-hidden="true" />
          <div className="cine__vignette" aria-hidden="true" />
          <div className="cine__bar cine__bar--top" aria-hidden="true">
            <span className="cine__tag"><span className="cine__rec" />{playing ? "PLAYING" : "PAUSED"}</span>
            <Timecode running={inView} />
          </div>
          <div className="cine__bar cine__bar--bottom" aria-hidden="true">
            <span>KIDPOOL · EVERY KID RIDE</span>
            <span>SCENE {String(step + 1).padStart(2, "0")} / 04</span>
          </div>
          <div className="cine__titlecard" key={step} aria-live="polite">
            <span className="cine__scene">Scene {String(step + 1).padStart(2, "0")}</span>
            <strong className="cine__title">{cur.title}</strong>
            <span className="cine__sub">{cur.text}</span>
          </div>
        </div>

        <ol className="cine__reel">
          {STEPS.map((s, i) => (
            <li key={s.title}>
              <button className={"shot" + (i === step ? " shot--on" : "") + (i < step ? " shot--done" : "")}
                aria-current={i === step ? "step" : undefined} onClick={() => choose(i)}>
                <span className="shot__top">
                  <span className="shot__num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="shot__icon"><Icon name={s.icon} size={20} /></span>
                </span>
                <span className="shot__title">{s.title}</span>
                <span className="shot__text">{s.text}</span>
                <span className="shot__track">
                  <i key={`${step}-${playing}`} className={i === step && playing ? "run" : ""}
                    style={{ animationDuration: `${SCENE_MS}ms` }} />
                </span>
              </button>
            </li>
          ))}
        </ol>
        <div className="cine__controls">
          <button className="cine__play" onClick={() => { if (sitePaused) { setSitePaused(false); setAuto(true); } else setAuto(!auto); }} aria-pressed={!(auto && !sitePaused)}>
            {auto && !sitePaused ? "❚❚ Pause the tour" : "▶ Play the tour"}
          </button>
        </div>
      </div>
    </section>
  );
}
