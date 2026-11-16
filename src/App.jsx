import { useEffect } from "react";
import Header from "./sections/Header";
import Hero from "./sections/Hero";
import Trust from "./sections/Trust";
import HowItWorks from "./sections/HowItWorks";
import Features from "./sections/Features";
import Preview from "./sections/Preview";
import Safety from "./sections/Safety";
import UseCases from "./sections/UseCases";
import AppDownload from "./sections/AppDownload";
import FAQ from "./sections/FAQ";
import Footer from "./sections/Footer";
import Legal from "./sections/Legal";
import NotFound from "./sections/NotFound";
import { url, stripBase } from "./lib/base";

/* Real URLs, each pre-rendered at build time so search engines can index them:
   /, /privacy and /terms; anything else is the 404 page. */
export const routeOf = (path = "/") => {
  const p = path.replace(/\/+$/, "") || "/";
  if (p === "/" || p === "/index.html") return "home";
  if (p === "/privacy" || p === "/terms") return p.slice(1);
  return "notfound";
};

export default function App({ path }) {
  const route = routeOf(path ?? (typeof location !== "undefined" ? stripBase(location.pathname) : "/"));

  useEffect(() => {
    // old links used "#/privacy" and "#/terms": send them to the real pages
    if (location.hash === "#/privacy" || location.hash === "#/terms") {
      location.replace(url(location.hash.slice(2)));
      return;
    }
    // arriving at "/#section" (e.g. from a legal page): land on that section
    const id = location.hash.slice(1);
    if (route === "home" && id) requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: "start", behavior: "instant" }));
  }, [route]);

  if (route === "notfound") {
    return (
      <>
        <a href="#main" className="skip">Skip to content</a>
        <Header />
        <NotFound />
        <Footer />
      </>
    );
  }
  if (route !== "home") {
    return (
      <>
        <a href="#main" className="skip">Skip to content</a>
        <Header />
        <Legal page={route} />
        <Footer />
      </>
    );
  }
  return (
    <>
      <a href="#main" className="skip">Skip to content</a>
      <Header />
      <main id="main">
        <Hero />
        <Trust />
        <HowItWorks />
        <Features />
        <Preview />
        <Safety />
        <UseCases />
        <AppDownload />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
