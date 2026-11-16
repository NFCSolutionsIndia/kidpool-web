import { useEffect, useState } from "react";
import { gpcEnabled, optedOut, setOptedOut, onChoiceChange } from "../lib/consent";

/* Opt-out control for the "Your Privacy Choices" page. Pre-rendered in its neutral state;
   the real status (GPC signal, saved choice) is read in the browser after load. */
export default function PrivacyChoices() {
  const [ready, setReady] = useState(false);
  const [gpc, setGpc] = useState(false);
  const [out, setOut] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const read = () => { setGpc(gpcEnabled()); setOut(optedOut()); };
    read(); setReady(true);
    return onChoiceChange(read);
  }, []);

  const on = gpc || out;
  const toggle = () => {
    if (gpc) return; // the browser signal already opts you out
    setOptedOut(!out);
    setSaved(true);
  };

  return (
    <div className="pc">
      <div className={"pc__status" + (gpc ? " pc__status--on" : "")} role="status">
        <span className="pc__dot" aria-hidden="true" />
        {!ready ? "Checking your browser for a Global Privacy Control signal…"
          : gpc ? "Global Privacy Control detected. You're opted out automatically on this browser."
          : "No Global Privacy Control signal detected from this browser."}
      </div>
      <label className="pc__row" htmlFor="pc-optout">
        <span>
          <b>Do not sell or share my personal information</b>
          <small>Applies to any advertising or cross-site tools KidPool may use on this website.</small>
        </span>
        <span className={"pc__switch" + (on ? " pc__switch--on" : "")}>
          <input id="pc-optout" type="checkbox" role="switch" checked={on} disabled={gpc || !ready} onChange={toggle} />
          <i aria-hidden="true" />
        </span>
      </label>
      <p className="pc__note" aria-live="polite">
        {gpc ? "To change this, turn off Global Privacy Control in your browser."
          : saved ? (on ? "Saved. You're opted out on this browser." : "Saved. Your opt-out has been turned off on this browser.")
          : "Your choice is saved in this browser."}
      </p>
    </div>
  );
}
