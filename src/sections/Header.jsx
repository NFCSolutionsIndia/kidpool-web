import { useEffect, useRef, useState } from "react";
import { Icon, Wordmark } from "../components/ui";
import { getApp, appHref } from "./AppDownload";
import JellyRadio from "../components/JellyRadio/JellyRadio";

const LINKS = [
  { value: "top", label: "Home" },
  { value: "how", label: "How it works" },
  { value: "families", label: "For families" },
  { value: "safety", label: "Safety" },
  { value: "app", label: "Get the app" },
  { value: "faq", label: "FAQs" },
];

/* ================= 1. HEADER ================= */
export default function Header() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("top");
  const [scrolled, setScrolled] = useState(false);
  const lockUntil = useRef(0);

  // Scroll-spy: highlight the section currently under the header
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      if (Date.now() < lockUntil.current) return;
      const line = window.innerHeight * 0.35;
      let current = "top";
      for (const { value } of LINKS) {
        const el = document.getElementById(value);
        if (el && el.getBoundingClientRect().top <= line) current = value;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id) => {
    if (!document.getElementById(id)) { location.hash = id; return; } // on a legal page: go home to that section
    setActive(id);
    lockUntil.current = Date.now() + 900; // let the smooth scroll finish before the spy takes over
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", id === "top" ? location.pathname : `#${id}`);
  };

  return (
    <header className={"header" + (scrolled ? " header--scrolled" : " header--top")}>
      <div className="container header__row">
        <Wordmark />
        <nav className="nav" aria-label="Main">
          <div className="nav__track">
            <JellyRadio
              items={LINKS}
              value={active}
              onChange={go}
              ariaLabel="Page sections"
              className="nav__jelly"
              chipColor="transparent"
              activeColor="var(--lime)"
              textColor="var(--hdr-fg)"
              activeTextColor="var(--lime-ink)"
              size="md"
              gap={2}
              radius={999}
              swell={0.08}
              barge={3}
              shrink={0.02}
              jelly={1.1}
              bounce={0.3}
            />
          </div>
        </nav>
        <nav className={"mnav" + (open ? " mnav--open" : "")} aria-label="Mobile">
          {LINKS.map(({ value, label }) => (
            <a key={value} href={`#${value}`} className={active === value ? "is-on" : ""} onClick={() => setOpen(false)}>
              {label}<span aria-hidden="true">→</span>
            </a>
          ))}
        </nav>
        <div className="header__actions">
          <a href={appHref()} onClick={getApp} className="btn btn--lime btn--sm">Download app</a>
          <button className="icon-btn menu-btn" aria-expanded={open} aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen(!open)}><Icon name={open ? "close" : "menu"} /></button>
        </div>
      </div>
    </header>
  );
}
