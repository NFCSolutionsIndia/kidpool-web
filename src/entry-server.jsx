/* Build-time only: renders each page to HTML so search engines (and people on slow
   connections) get real content before any JavaScript runs. Used by scripts/prerender.mjs. */
import { renderToString } from "react-dom/server";
import App from "./App";

export { FAQS } from "./sections/FAQ";
export { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_ADDRESS, SOCIAL } from "./sections/Footer";

export const render = (path) => renderToString(<App path={path} />);
