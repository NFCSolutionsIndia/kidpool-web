import { useState } from "react";
import { useActive } from "../components/Reveal";

/* ================= 9. FAQ — 3D unfold accordion ================= */
const FAQS = [
  ["How do I join a community?", "Search for your community in the app and ask to join its group. Once you’re in, you can see families going to the same places as your children."],
  ["What if my community isn’t on KidPool yet?", "You can request it in the app. Search for it, tap “Request a missing place”, and you’ll be notified as soon as it’s added."],
  ["Can I be part of more than one community?", "Yes. Join every group your family belongs to and see the rides for each of them in one place."],
  ["How do I request or offer a ride?", "Create a request with the time, route, and children, or offer a seat on a trip you’re already making. Families in your community can respond."],
  ["Can I manage more than one child?", "Yes. Add each child and the places they go, then choose who’s included when you set up a ride."],
  ["How do I talk with other families?", "Through KidPool’s messages. You agree on the details of each ride with the other family, and everything stays in one place."],
  ["Is KidPool a taxi or ride-hailing service?", "No. KidPool helps families in the same community share rides with each other. There are no hired drivers."],
];
export default function FAQ() {
  const [open, setOpen] = useState(0);
  const [ref, active] = useActive("0px 0px -10% 0px");
  return (
    <section className={"section fq" + (active ? " fq--in" : "")} id="faq" ref={ref}>
      <div className="container fq__grid">
        <figure className="fq__media">
          <img src="illustrations/faq-walk.jpg" alt="A parent and child walking hand in hand along a leafy path" loading="lazy" width="1024" height="1280" />
          <figcaption className="fq__card">
            <span className="fq__dot" aria-hidden="true" />
            <h2 className="fq__title">Questions parents ask</h2>
            <p>Everything you need to know before your first shared ride: how to join, how rides work, and who you’ll be riding with.</p>
          </figcaption>
        </figure>
        <ul className="fq__list">
          {FAQS.map(([q, a], i) => {
            const on = open === i;
            return (
              <li key={q} className={"fq__item" + (on ? " fq__item--on" : "")} style={{ "--i": i }}>
                <button className="fq__q" aria-expanded={on} aria-controls={`fq-${i}`} id={`fqb-${i}`} onClick={() => setOpen(on ? -1 : i)}>
                  <span className="fq__num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="fq__text">
                    <span className="fq__ask">{q}</span>
                    <span className="fq__ans" id={`fq-${i}`} role="region" aria-labelledby={`fqb-${i}`} hidden={!on}>{a}</span>
                  </span>
                  <span className="fq__sign" aria-hidden="true" />
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
