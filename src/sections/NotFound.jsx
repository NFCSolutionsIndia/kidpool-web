import { url } from "../lib/base";
/* ================= 404 =================
   Pre-rendered to dist/404.html (noindex); static hosts serve it for unknown addresses. */
export default function NotFound() {
  return (
    <main id="main" className="lg ucp">
      <section className="lg__hero ucp__hero">
        <div className="container">
          <h1 className="lg__title">This page took a wrong turn</h1>
          <p className="lg__intro">We couldn’t find the page you were looking for. It may have moved, or the link may be mistyped.</p>
          <div className="btn-row ucp__ctas">
            <a href={url()} className="btn btn--lime">Go to the home page</a>
            <a href={url("#faq")} className="btn ucp__ghost">Read the FAQs</a>
          </div>
        </div>
      </section>
    </main>
  );
}
