import { useState } from "react";
import { useActive } from "../components/Reveal";
import { url } from "../lib/base";

/* ================= 9. FAQ — 3D unfold accordion ================= */
export const FAQS = [
  ["Do my kids have to ride with strangers?", "Never. KidPool is only for families in your own pools, not the general public. You choose which pools to join, and you approve every ride before it happens."],
  ["What is a pool?", "A pool is a group of families who go to the same place, like a school, team or club, and share rides with each other. Only families who belong there can join."],
  ["How do I join a pool?", "Search for the place your kids go in the app and ask to join its pool. Once you’re in, you can see families going to the same places as your children."],
  ["What if there’s no pool for my group yet?", "You can request it in the app. Search for it, tap “Request a missing place”, and you’ll be notified as soon as it’s added."],
  ["Can I be in more than one pool?", "Yes. Join a pool for every place your family goes and see the rides for each of them in one place."],
  ["How do I request or offer a ride?", "Create a request with the time, route, and children, or offer a seat on a trip you’re already making. Families in your pool can respond."],
  ["Can I manage more than one child?", "Yes. Add each child and the places they go, then choose who’s included when you set up a ride."],
  ["Do kids have their own accounts?", "No. Kids don’t have accounts and can’t use the app. Only a parent or guardian adds a child’s first name, age, schedule and an optional photo, and you can edit or delete it anytime."],
  ["How do I talk with other families?", "Through KidPool’s messages. You agree on the details of each ride with the other family, and everything stays in one place."],
  ["Which activities can I use KidPool for?", "Any trip your kids make with families you know: school drop-off and pickup, sports practice and games, music and dance lessons, clubs, tutoring and summer camp."],
  ["Who can see my home address and phone number?", "Your address is shared only with the family you book a ride with. Other families in your pool see only your first name and a rough distance. In-app calls connect through KidPool, so your phone number is never shown."],
  ["How are drivers checked?", "Before any parent can offer a seat, they scan a valid US driver’s license and pass a background check. No check is perfect, so you always have the final say on who drives your kids."],
  ["What about car seats and booster seats?", "Every ride request shows each child’s age, so both families can agree on car seats or boosters in messages before confirming. Car seat rules vary by state, so check what yours requires."],
  ["What if a driver is running late or has to cancel?", "Drivers can send a one-tap running-late update, so you’re never left wondering. If a driver cancels, you’re notified and can ask your pool for another ride."],
  ["Are rides paid?", "No. Rides on KidPool are shared between families and are never offered for payment."],
  ["Is KidPool a taxi or ride-hailing service?", "No. KidPool helps families in the same pool share rides with each other. There are no hired drivers."],
];
export default function FAQ() {
  const [open, setOpen] = useState(0);
  const [ref, active] = useActive("0px 0px -10% 0px");
  return (
    <section className={"section fq" + (active ? " fq--in" : "")} id="faq" ref={ref}>
      <div className="container fq__grid">
        <figure className="fq__media">
          <img src={url("illustrations/faq-walk.webp")} alt="A parent and child walking hand in hand along a leafy path" loading="lazy" width="1024" height="1280" />
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
