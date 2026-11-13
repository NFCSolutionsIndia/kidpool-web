import { useEffect, useState } from "react";
import { useMotionPaused } from "../hooks/useMotionPause";
import { useTilt } from "../hooks/useTilt";
import { Icon } from "../components/ui";
import { useActive } from "../components/Reveal";
import { reducedMotion } from "../lib/brand";

const ITEMS = [
  { icon: "family", title: "Made for families", text: "For parents and guardians arranging rides for their own children." },
  { icon: "together", title: "Coordinate together", text: "Plan rides with the families in your pool." },
  { icon: "control", title: "Stay in control", text: "You decide which rides to request, offer, or accept." },
];
const SPOT_MS = 2800;

/* split a string into word spans carrying a running index for staggering */
const split = (str, cls, base = 0) =>
  str.split(" ").map((w, i) => (
    <span className={cls} key={i} style={{ "--w": base + i }}>{w}{" "}</span>
  ));

/* ================= 3. TRUST STRIP — CSS 3D tiles, cinematic text ================= */
function TrustItem({ icon, title, text, i, focus }) {
  const ref = useTilt(22);
  return (
    <li className={"trust__item" + (focus ? " trust__item--focus" : "")} style={{ "--i": i }}>
      <span className="tile3d" ref={ref} aria-hidden="true">
        <span className="tile3d__base" /><span className="tile3d__icon"><Icon name={icon} size={26} /></span>
      </span>
      <span className="trust__copy">
        <strong className="trust__title">
          <span className="sr-only">{title}</span>
          <span aria-hidden="true">{title.split(" ").map((w, k) => (
            <span className="tw-mask" key={k}><span className="tw" style={{ "--w": k }}>{w}</span></span>
          ))}</span>
          <span className="trust__underline" aria-hidden="true" />
        </strong>
        <span className="muted trust__text">
          <span className="sr-only">{text}</span>
          <span aria-hidden="true">{split(text, "tx")}</span>
        </span>
      </span>
    </li>
  );
}

export default function Trust() {
  const [ref, active] = useActive("0px 0px -8% 0px");
  const [spot, setSpot] = useState(-1);
  const [sitePaused] = useMotionPaused();
  // spotlight cycles through the items while the strip is active
  useEffect(() => {
    if (!active || reducedMotion() || sitePaused) { setSpot(-1); return; }
    let i = -1;
    const start = setTimeout(function tick() {
      i = (i + 1) % ITEMS.length; setSpot(i);
      t2 = setTimeout(tick, SPOT_MS);
    }, 2200); // after the entrance finishes
    let t2;
    return () => { clearTimeout(start); clearTimeout(t2); };
  }, [active, sitePaused]);

  return (
    <section className={"trust" + (active ? " trust--in" : "")} aria-label="Who KidPool is for" ref={ref}>
      <div className="container">
        <div className="trust__frame">
          <span className="trust__sweep" aria-hidden="true" />
          <ul className="trust__list">
            {ITEMS.map((it, i) => <TrustItem key={it.title} {...it} i={i} focus={spot === i} />)}
          </ul>
        </div>
      </div>
    </section>
  );
}
