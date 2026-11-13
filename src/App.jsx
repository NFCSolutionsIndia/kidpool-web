import { useEffect, useState } from "react";
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

/* "#/privacy" and "#/terms" open the legal pages; every other hash is a section of the home page */
const routeOf = () => (location.hash === "#/privacy" ? "privacy" : location.hash === "#/terms" ? "terms" : "home");

export default function App() {
  const [route, setRoute] = useState(routeOf);
  useEffect(() => {
    const onHash = () => setRoute(routeOf());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  // coming back from a legal page: land on the section the link pointed to
  useEffect(() => {
    if (route !== "home") return;
    const id = location.hash.slice(1);
    if (!id || id.startsWith("/")) return;
    requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: "start" }));
  }, [route]);

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
