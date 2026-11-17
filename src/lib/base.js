/* The site can be served from a domain root ("/") or from a sub-folder such as GitHub Pages'
   "/kidpool-web/". Vite's `base` (set from BASE_PATH at build time) decides which; every image
   and page link goes through these helpers so both work. */
export const BASE = import.meta.env.BASE_URL || "/"; // always ends with "/"

/* "illustrations/x.webp", "/privacy", "/#faq" -> "<base>illustrations/x.webp", "<base>privacy", "<base>#faq" */
export const url = (p = "") => BASE + String(p).replace(/^\/+/, "");

/* "/kidpool-web/privacy" -> "/privacy" (route matching ignores the base) */
export const stripBase = (pathname = "/") => {
  const b = BASE.replace(/\/$/, "");
  return b && pathname.startsWith(b) ? pathname.slice(b.length) || "/" : pathname;
};
