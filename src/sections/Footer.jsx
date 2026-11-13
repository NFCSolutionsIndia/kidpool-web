import { Wordmark } from "../components/ui";
import Leaves from "../components/Leaves";
import { useActive, Words } from "../components/Reveal";

export const CONTACT_EMAIL = "info@nfcsolutionsusa.com";
export const CONTACT_PHONE = "+1 (800) 965 5147";
export const CONTACT_ADDRESS = "Saddlebrook Office Park, 11030 Jones Bridge Road, Suite 202, Johns Creek, GA 30022";

/* Social profiles: paste each full profile URL when it exists (e.g. "https://www.instagram.com/kidpool").
   An empty url shows the icon as "coming soon" (not clickable); a filled one becomes a live link
   and is also added to the site's structured data (Organization "sameAs") for search engines. */
export const SOCIAL = [
  { name: "Facebook", url: "", icon: <path d="M14.2 8.1H16V5.2h-2.4c-2.6 0-3.8 1.6-3.8 4v1.9H8v3h1.8V21h3v-6.9h2.4l.5-3h-2.9V9.5c0-.9.4-1.4 1.4-1.4Z" fill="currentColor" /> },
  { name: "Instagram", url: "", icon: <><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="3.9" /><circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" /></> },
  { name: "X", url: "", icon: <><path d="M4.5 4h4.2l10.8 16h-4.2z" fill="currentColor" stroke="none" /><path d="M19.5 4l-6.6 7.4M4.5 20l6.6-7.4" /></> },
  { name: "LinkedIn", url: "", icon: <><rect x="4" y="9.5" width="3.2" height="10.5" rx=".6" fill="currentColor" stroke="none" /><circle cx="5.6" cy="5.6" r="1.9" fill="currentColor" stroke="none" /><path d="M10.2 9.5h3v1.5c.6-1 1.8-1.8 3.4-1.8 2.6 0 3.6 1.7 3.6 4.4V20h-3.2v-5.8c0-1.4-.5-2.3-1.7-2.3-1.4 0-2 1-2 2.5V20h-3.1z" fill="currentColor" stroke="none" /></> },
  { name: "YouTube", url: "", icon: <><rect x="2.5" y="5.5" width="19" height="13" rx="4" fill="currentColor" stroke="none" /><path d="M10.2 9.2v5.6l4.8-2.8z" fill="var(--sft-bg, #2c3a1c)" stroke="none" /></> },
];

/* ================= 11. FOOTER — brand, About, Contact ================= */
export default function Footer() {
  const year = new Date().getFullYear();
  // replay the footer entrance every time it scrolls into view
  const [ref, active] = useActive("0px 0px -8% 0px");
  return (
    <footer className="sft">
      <svg className="sft__wave" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 0 L1440 0 L1440 40 C 1160 120, 900 10, 620 60 S 180 110, 0 30 Z" fill="var(--bg)" />
      </svg>
      <Leaves items={[{ x: "46%", y: "14%", size: 50, rot: -25 }, { r: "4%", b: "26%", size: 66, rot: 15, blur: 1 }, { x: "2%", b: "18%", size: 34, rot: 40, tone: "deep" }]} />
      <div className={"container rv" + (active ? " rv--in" : "")} ref={ref}>
        <div className="sft__grid">
          <div className="sft__brand">
            <span className="rv-up" style={{ "--d": ".05s", display: "inline-block" }}><Wordmark /></span>
            <p className="sft__tag rv-title"><span className="sr-only">Kid rides are easier together.</span><Words lines={["Kid rides are easier", "together."]} highlight={{ word: "together.", className: "sft__mark" }} /></p>
            <p className="sft__lede rv-up" style={{ "--d": ".75s" }}>Share every kid ride with families you already know.</p>
            <ul className="sft__social" aria-label="KidPool on social media">
              {SOCIAL.map((s, i) => (
                <li key={s.name} className="sft__socli" style={{ "--d": `${(0.85 + i * 0.12).toFixed(2)}s`, "--i": i }}>
                  {s.url ? (
                    <a className="sft__soc" href={s.url} target="_blank" rel="noopener noreferrer" aria-label={`KidPool on ${s.name} (opens in a new tab)`}>
                      <svg viewBox="0 0 24 24" aria-hidden="true">{s.icon}</svg>
                    </a>
                  ) : (
                    <span className="sft__soc sft__soc--soon" role="img" tabIndex={0} aria-label={`KidPool on ${s.name}: coming soon`}>
                      <svg viewBox="0 0 24 24" aria-hidden="true">{s.icon}</svg>
                    </span>
                  )}
                  {/* custom tooltip (shown on hover and keyboard focus) */}
                  <span className="sft__tip" aria-hidden="true">
                    <b>{s.name}</b><em>{s.url ? "Follow us" : "Coming soon"}</em>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="sft__col" id="about">
            <h2 className="sft__h rv-up" style={{ "--d": ".25s" }}>About</h2>
            <p className="rv-up" style={{ "--d": ".4s" }}>KidPool helps parents and guardians coordinate rides with families they already know, in their own pools. It isn’t a public ride service. Every ride is agreed by both families.</p>
            <ul className="sft__links">
              <li className="rv-up sft__li" style={{ "--d": "0.60s" }}><a href="/#how">How it works</a></li>
              <li className="rv-up sft__li" style={{ "--d": "0.69s" }}><a href="/#families">For families</a></li>
              <li className="rv-up sft__li" style={{ "--d": "0.78s" }}><a href="/#safety">Safety</a></li>
              <li className="rv-up sft__li" style={{ "--d": "0.87s" }}><a href="/#faq">FAQs</a></li>
            </ul>
          </div>

          <div className="sft__col" id="contact">
            <h2 className="sft__h rv-up" style={{ "--d": ".35s" }}>Contact</h2>
            <p className="rv-up" style={{ "--d": ".5s" }}>Questions, feedback, or want to start a pool? We’d love to hear from you.</p>
            <address className="sft__contact">
              <a className="sft__ci sft__cin" style={{ "--d": "0.70s" }} href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONTACT_ADDRESS)}`} target="_blank" rel="noopener noreferrer">
                <span className="sft__mailic" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><path d="M12 21s-6-5.4-6-10a6 6 0 0 1 12 0c0 4.6-6 10-6 10Z" /><circle cx="12" cy="11" r="2.2" /></svg>
                </span>
                <span><b>USA</b>Saddlebrook Office Park, 11030 Jones Bridge Road, Suite 202, Johns Creek, GA 30022</span>
              </a>
              <a className="sft__ci sft__cin" style={{ "--d": "0.82s" }} href={`tel:${CONTACT_PHONE.replace(/[^\d+]/g, "")}`}>
                <span className="sft__mailic" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><path d="M6.5 4h3l1.5 4-2 1.3a10 10 0 0 0 5.7 5.7L16 13l4 1.5v3A2 2 0 0 1 18 19.5 15.5 15.5 0 0 1 4.5 6a2 2 0 0 1 2-2Z" /></svg>
                </span>
                <span>{CONTACT_PHONE}</span>
              </a>
              <a className="sft__ci sft__cin" style={{ "--d": "0.94s" }} href={`mailto:${CONTACT_EMAIL}`}>
                <span className="sft__mailic" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m4 7 8 6 8-6" /></svg>
                </span>
                <span>{CONTACT_EMAIL}</span>
              </a>
            </address>
          </div>
        </div>

        <div className="sft__bottom rv-up" style={{ "--d": "1.1s" }}>
          <p>© {year} KidPool. Made for family pools.</p>
          <ul>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/terms">Terms & Conditions</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
