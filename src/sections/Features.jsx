import { useTilt } from "../hooks/useTilt";
import { Icon, Placeholder } from "../components/ui";
import { getApp, appHref } from "./AppDownload";
import Leaves from "../components/Leaves";
import { useActive, Words } from "../components/Reveal";

/* ---------- content-matched background illustrations (lime / ink / white only) ----------
   Strokes carry pathLength=1 so they can "draw" in; fills fade in after. */
const S = { fill: "none", strokeLinecap: "round", strokeLinejoin: "round", pathLength: 1 };

const ArtKids = () => (
  <svg viewBox="0 0 200 150" className="fart" aria-hidden="true">
    {[[40, 1, "#CBF34B"], [92, 1.18, "#14171A"], [146, 0.9, "#EEFBC4"]].map(([x, s, c], i) => (
      <g key={i} transform={`translate(${x} ${150 - 100 * s}) scale(${s})`}>
        <circle {...S} className="fa-line" cx="0" cy="22" r="16" stroke="#14171A" strokeWidth="2.5" />
        <path {...S} className="fa-line" d="M-22 100 v-30 a22 22 0 0 1 44 0 v30" stroke="#14171A" strokeWidth="2.5" />
        <circle className="fa-fill" cx="0" cy="22" r="15" fill={c} />
        <path className="fa-fill" d="M-21 100 v-30 a21 21 0 0 1 42 0 v30z" fill={c} />
      </g>
    ))}
  </svg>
);
const ArtCalendar = () => (
  <svg viewBox="0 0 200 150" className="fart" aria-hidden="true">
    <rect {...S} className="fa-line" x="30" y="20" width="150" height="120" rx="16" stroke="#14171A" strokeWidth="2.5" />
    <path {...S} className="fa-line" d="M30 50 H180 M67 50 V140 M105 50 V140 M142 50 V140 M30 95 H180" stroke="#14171A" strokeWidth="1.5" opacity=".35" />
    <rect className="fa-fill" x="31" y="21" width="148" height="28" rx="15" fill="#CBF34B" />
    {[[48, 72], [124, 72], [86, 117], [160, 117]].map(([x, y], i) => (
      <circle key={i} className="fa-fill fa-dot" style={{ "--p": i }} cx={x} cy={y} r="8" fill={i % 2 ? "#14171A" : "#CBF34B"} />
    ))}
  </svg>
);
const ArtRepeat = () => (
  <svg viewBox="0 0 200 150" className="fart" aria-hidden="true">
    <path {...S} className="fa-line" d="M60 75 a45 45 0 0 1 80 -28" stroke="#14171A" strokeWidth="3" />
    <path {...S} className="fa-line" d="M140 75 a45 45 0 0 1 -80 28" stroke="#14171A" strokeWidth="3" />
    <path className="fa-fill" d="M146 34 l-2 20 -18 -8z" fill="#14171A" />
    <path className="fa-fill" d="M54 116 l2 -20 18 8z" fill="#14171A" />
    <g className="fa-spin">
      <circle className="fa-fill" cx="100" cy="75" r="22" fill="#CBF34B" />
      <path className="fa-fill" d="M100 62 v13 l9 7" stroke="#14171A" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </g>
  </svg>
);
const ArtChat = () => (
  <svg viewBox="0 0 200 150" className="fart" aria-hidden="true">
    <path {...S} className="fa-line" d="M40 30 h90 a14 14 0 0 1 14 14 v26 a14 14 0 0 1 -14 14 h-62 l-18 14 v-14 h-10 a14 14 0 0 1 -14 -14 v-26 a14 14 0 0 1 14 -14z" stroke="#14171A" strokeWidth="2.5" />
    <path className="fa-fill" d="M41 31 h89 a13 13 0 0 1 13 13 v26 a13 13 0 0 1 -13 13 h-62 l-17 13 v-13 h-10 a13 13 0 0 1 -13 -13 v-26 a13 13 0 0 1 13 -13z" fill="#EEFBC4" />
    <path {...S} className="fa-line" d="M96 92 h70 a12 12 0 0 1 12 12 v18 a12 12 0 0 1 -12 12 h-8 v12 l-16 -12 h-46 a12 12 0 0 1 -12 -12 v-18 a12 12 0 0 1 12 -12z" stroke="#14171A" strokeWidth="2.5" />
    <path className="fa-fill" d="M97 93 h69 a11 11 0 0 1 11 11 v18 a11 11 0 0 1 -11 11 h-9 v11 l-15 -11 h-45 a11 11 0 0 1 -11 -11 v-18 a11 11 0 0 1 11 -11z" fill="#CBF34B" />
    {[0, 1, 2].map((i) => <circle key={i} className="fa-fill fa-type" style={{ "--p": i }} cx={66 + i * 18} cy="57" r="5" fill="#14171A" />)}
  </svg>
);

/* ================= 5. FEATURES — tilt cards with depth ================= */
function Feature({ icon, title, text, tag, featured, art: Art, i }) {
  const ref = useTilt(8);
  return (
    <article className={"feature" + (featured ? " feature--lime" : "")} ref={ref} style={{ "--c": i }}>
      <span className="feature__shine" aria-hidden="true" />
      {Art && <span className="feature__art" aria-hidden="true"><Art /></span>}
      <span className="feature__icon"><Icon name={icon} size={featured ? 30 : 24} /></span>
      <h3 className="feature__title"><span className="ft-mask"><span className="ft">{title}</span></span></h3>
      <p className="feature__text">{text}</p>
      {featured && <a href={appHref()} onClick={getApp} className="btn btn--ink btn--sm feature__cta">Get the app</a>}
      {tag && <Placeholder>{tag}</Placeholder>}
    </article>
  );
}
export default function Features() {
  const [ref, active] = useActive("0px 0px -12% 0px");
  return (
    <section className={"section section--leafy feats" + (active ? " feats--in" : "")} id="families" ref={ref}>
      <Leaves items={[{ x: "2%", y: "38%", size: 70, rot: -20, blur: 1 }, { r: "3%", y: "12%", size: 40, rot: 30, tone: "deep" }]} />
      <div className="container">
        <div className={"section__head rv" + (active ? " rv--in" : "")}>
          <span className="accent-bar" aria-hidden="true" />
          <h2 className="display-l rv-title" aria-label="Built for busy weeks"><Words lines={["Built for busy weeks"]} /></h2>
          <p className="lede rv-up" style={{ "--d": ".6s" }}>The morning drop-off, the evening lesson, and the pickup that clashes with both.</p>
        </div>
        <div className="features">
          <Feature i={0} featured icon="car" title="Request or offer rides" text="Post a ride you need, or share a seat on a trip you’re already making. Families in your community can respond." />
          <Feature i={1} art={ArtKids} icon="child" title="More than one child" text="Keep each child’s places, schedules, and rides together." />
          <Feature i={2} art={ArtCalendar} icon="calendar" title="Activity schedules" text="See every practice, lesson, and pickup in one week view." />
          <Feature i={3} art={ArtRepeat} icon="repeat" title="Recurring rides" text="Set up a regular ride once instead of arranging it every week." tag="Confirm: recurring rides supported" />
          <Feature i={4} art={ArtChat} icon="message" title="Messages and updates" text="Talk through details and hear when a plan changes." tag="Confirm: in-app messaging supported" />
        </div>
      </div>
    </section>
  );
}
