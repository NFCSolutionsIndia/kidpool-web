/* Privacy choices (US state privacy laws: CCPA/CPRA "Do Not Sell or Share", Global Privacy Control).
   The website loads no analytics or advertising tags today. Any tag added later MUST go through
   loadMarketingTag(), which refuses to load when the visitor has opted out or their browser sends
   the Global Privacy Control signal. If a third-party consent tool is adopted later, wire it in here. */
const KEY = "kp-privacy-optout";
const listeners = new Set();

/* true when the browser sends the Global Privacy Control signal (treated as an opt-out) */
export const gpcEnabled = () => typeof navigator !== "undefined" && navigator.globalPrivacyControl === true;

/* the visitor's own choice on the "Your Privacy Choices" page */
export function optedOut() {
  try { return localStorage.getItem(KEY) === "1"; } catch { return false; }
}
export function setOptedOut(on) {
  try { localStorage.setItem(KEY, on ? "1" : "0"); } catch { /* storage blocked: choice applies to this visit only */ }
  listeners.forEach((fn) => fn());
}
export const onChoiceChange = (fn) => { listeners.add(fn); return () => listeners.delete(fn); };

/* may a selling/sharing (advertising) tag run for this visitor? */
export const marketingAllowed = () => !gpcEnabled() && !optedOut();

/* the only way to add an advertising or cross-site analytics tag to the site */
export function loadMarketingTag(load) {
  if (typeof window === "undefined" || !marketingAllowed()) return false;
  load();
  return true;
}
