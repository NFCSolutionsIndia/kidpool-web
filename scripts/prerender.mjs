/* Post-build step: turns the single-page app into real, indexable HTML pages.
   - writes dist/index.html, dist/privacy/index.html, dist/terms/index.html with the
     rendered page content, per-page title/description/canonical and JSON-LD
   - writes dist/robots.txt and dist/sitemap.xml
   Run by `npm run build` after the client and SSR builds. */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { loadEnv } from "vite";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const ssrDir = path.join(root, "dist-ssr");
const SITE = (loadEnv("production", root).VITE_SITE_URL || "https://www.kidpool.app").replace(/\/+$/, "");

const { render, FAQS, SOCIAL, CONTACT_EMAIL, CONTACT_PHONE, CONTACT_ADDRESS } =
  await import(pathToFileURL(path.join(ssrDir, "entry-server.js")).href);

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const ld = (obj) => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, "\\u003c")}</script>`;

const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "KidPool",
  url: `${SITE}/`,
  logo: `${SITE}/icon-512.png`,
  email: CONTACT_EMAIL,
  telephone: CONTACT_PHONE,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Saddlebrook Office Park, 11030 Jones Bridge Road, Suite 202",
    addressLocality: "Johns Creek",
    addressRegion: "GA",
    postalCode: "30022",
    addressCountry: "US",
  },
  // social profiles that have a link (Footer.jsx SOCIAL)
  ...(SOCIAL.some((x) => x.url) ? { sameAs: SOCIAL.filter((x) => x.url).map((x) => x.url) } : {}),
  contactPoint: { "@type": "ContactPoint", contactType: "customer support", email: CONTACT_EMAIL, telephone: CONTACT_PHONE, areaServed: "US", availableLanguage: "English" },
};
const website = { "@context": "https://schema.org", "@type": "WebSite", name: "KidPool", url: `${SITE}/` };
const app = {
  "@context": "https://schema.org",
  "@type": "MobileApplication",
  name: "KidPool",
  operatingSystem: "Android, iOS",
  applicationCategory: "LifestyleApplication",
  description: "Carpool app for parents: share school, sports and activity rides with families you already know.",
  url: `${SITE}/`,
  image: `${SITE}/og-image.jpg`,
  publisher: { "@type": "Organization", name: "KidPool" },
};
const faqPage = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
};
const crumbs = (name, p) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
    { "@type": "ListItem", position: 2, name, item: `${SITE}${p}` },
  ],
});

const ROUTES = [
  {
    path: "/", out: "index.html",
    title: "KidPool: Carpool App for Parents | School & Activity Rides",
    description: "KidPool is the carpool app for parents. Share school, sports and activity rides with families you already know. Ask for a ride, offer a seat, track pickups live.",
    ogTitle: "KidPool: Carpool App for Parents",
    ogDescription: "Share school, sports and activity rides with families you already know.",
    jsonld: [organization, website, app, faqPage],
  },
  {
    path: "/privacy", out: "privacy/index.html",
    title: "Privacy Policy | KidPool",
    description: "How KidPool collects, uses and protects your family's information, including children's details and ride location data, and the choices you have.",
    jsonld: [organization, crumbs("Privacy Policy", "/privacy")],
  },
  {
    path: "/terms", out: "terms/index.html",
    title: "Terms & Conditions | KidPool",
    description: "The rules for using KidPool to coordinate rides with families in your pool, including driver and parent responsibilities.",
    jsonld: [organization, crumbs("Terms & Conditions", "/terms")],
  },
  // 404: what hosts serve for unknown addresses; never indexed
  { path: "/404", out: "404.html", title: "Page not found | KidPool", description: "This page could not be found.", noindex: true, jsonld: [] },
];

const template = fs.readFileSync(path.join(dist, "index.html"), "utf8");
if (!template.includes("<!--seo:start-->") || !template.includes('<div id="root"></div>')) {
  throw new Error("prerender: index.html markers not found");
}

for (const r of ROUTES) {
  const url = `${SITE}${r.path === "/" ? "/" : r.path}`;
  const seo = [
    `<title>${esc(r.title)}</title>`,
    `<meta name="description" content="${esc(r.description)}" />`,
    r.noindex ? `<meta name="robots" content="noindex" />` : `<link rel="canonical" href="${url}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:title" content="${esc(r.ogTitle || r.title)}" />`,
    `<meta property="og:description" content="${esc(r.ogDescription || r.description)}" />`,
  ].join("\n    ");
  const html = template
    .replace(/<!--seo:start-->[\s\S]*?<!--seo:end-->/, seo)
    .replace("<!--jsonld-->", r.jsonld.map(ld).join("\n    "))
    .replace('<div id="root"></div>', `<div id="root">${render(r.path)}</div>`);
  const file = path.join(dist, r.out);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
  // also "privacy.html": some hosts map /privacy to a sibling .html file instead of a folder
  if (r.path !== "/" && !r.noindex && !r.path.slice(1).includes("/")) fs.writeFileSync(path.join(dist, `${r.path.slice(1)}.html`), html);
  console.log(`prerendered ${r.path} -> dist/${r.out} (${(html.length / 1024).toFixed(0)} KB)`);
}

const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  ROUTES.filter((r) => !r.noindex).map((r) => `  <url><loc>${SITE}${r.path}</loc><lastmod>${today}</lastmod><priority>${r.priority || (r.path === "/" ? "1.0" : "0.3")}</priority></url>`).join("\n") +
  `\n</urlset>\n`);
fs.writeFileSync(path.join(dist, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
fs.rmSync(ssrDir, { recursive: true, force: true });
console.log(`wrote sitemap.xml and robots.txt for ${SITE}`);
