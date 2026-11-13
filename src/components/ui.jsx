/* ---------- icons (consistent 1.75 stroke line set) ---------- */
const PATHS = {
  family: <><circle cx="8" cy="7" r="3" /><circle cx="17" cy="9" r="2.2" /><path d="M2.5 20c.6-3.4 2.8-5.5 5.5-5.5s4.9 2.1 5.5 5.5" /><path d="M14 15.2c.9-.5 1.9-.7 3-.7 2.2 0 3.9 1.6 4.5 4.5" /></>,
  together: <><circle cx="9" cy="12" r="5.5" /><circle cx="15" cy="12" r="5.5" /></>,
  control: <><path d="M4 7h10M18 7h2M4 17h4M12 17h8" /><circle cx="16" cy="7" r="2" /><circle cx="10" cy="17" r="2" /></>,
  school: <><path d="M3 21h18M5 21V10l7-5 7 5v11" /><path d="M10 21v-5h4v5" /><circle cx="12" cy="11" r="1.6" /></>,
  child: <><circle cx="12" cy="6.5" r="3" /><path d="M7 21l1.2-7.5a3.8 3.8 0 0 1 7.6 0L17 21" /><path d="M9.5 16.5h5" /></>,
  seat: <><path d="M7 4v9a3 3 0 0 0 3 3h6" /><path d="M7 13h7a3 3 0 0 1 3 3v4" /><path d="M5 20h14" /></>,
  check: <><circle cx="12" cy="12" r="9" /><path d="M8 12.5l2.7 2.7L16.5 9.5" /></>,
  calendar: <><rect x="3.5" y="5" width="17" height="15.5" rx="3" /><path d="M3.5 10h17M8 3v4M16 3v4" /><path d="M8 14h3" /></>,
  repeat: <><path d="M4 11V9a3 3 0 0 1 3-3h12l-3-3" /><path d="M20 13v2a3 3 0 0 1-3 3H5l3 3" /></>,
  message: <><path d="M4 5.5h16v11H10l-4.5 3.5v-3.5H4z" /><path d="M8 10h8M8 13h5" /></>,
  car: <><path d="M3.5 15.5v-3l2-5h13l2 5v3" /><path d="M3.5 15.5h17v2.5h-17z" /><circle cx="7.5" cy="18" r="1.6" /><circle cx="16.5" cy="18" r="1.6" /></>,
  route: <><circle cx="6" cy="6" r="2.5" /><circle cx="18" cy="18" r="2.5" /><path d="M8.5 6H15a3.5 3.5 0 0 1 0 7H9a3.5 3.5 0 0 0 0 7h6.5" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  flip: <><path d="M4 9a8 8 0 0 1 14-3l2 2" /><path d="M20 4v4h-4" /><path d="M20 15a8 8 0 0 1-14 3l-2-2" /><path d="M4 20v-4h4" /></>,
  drag: <><path d="M8 12h8M5 12l3-3M5 12l3 3M19 12l-3-3M19 12l-3 3" /></>,
};
export const Icon = ({ name, size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{PATHS[name]}</svg>
);
// Placeholder notes are hidden on the live page (content to confirm is tracked outside the site).
export const Placeholder = () => null;
export const Wordmark = ({ small }) => (
  <a href="/#top" className={"wordmark" + (small ? " wordmark--sm" : "")} aria-label="KidPool home">
    <span className="wordmark__mark" aria-hidden="true"><Icon name="car" size={small ? 16 : 18} /></span>KidPool
  </a>
);
