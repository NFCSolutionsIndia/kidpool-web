import TurntableScene from "../scenes/TurntableScene";
import Leaves from "../components/Leaves";

export default function FinalCTA() {
  return (
    <section className="cta" id="find-your-school">
      <svg className="cta__wave" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true"><path d="M0 0 L1440 0 L1440 40 C 1160 120, 900 10, 620 60 S 180 110, 0 30 Z" fill="var(--bg)" /></svg>
      <Leaves items={[{ x: "45%", y: "18%", size: 56, rot: -25 }, { r: "4%", b: "12%", size: 72, rot: 15, blur: 1 }]} />
      <div className="container cta__grid">
        <div>
          <span className="accent-bar" aria-hidden="true" />
          <h2 className="display-xl">Make the school run easier together.</h2>
          <p className="lede">Find your school to start sharing rides with families you already know.</p>
          <div className="btn-row">
            <a href="#find-your-school" className="btn btn--lime">Find your school</a>
            <a href="#how" className="text-link">Learn how it works</a>
          </div>
        </div>
        <TurntableScene />
      </div>
    </section>
  );
}
