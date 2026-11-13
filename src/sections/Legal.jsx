import { useEffect, useState } from "react";
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_ADDRESS } from "./Footer";

/* ================= Legal pages: Privacy Policy + Terms & Conditions =================
   Draft content written for KidPool. Have it reviewed by a qualified lawyer before launch. */

export const EFFECTIVE_DATE = "November 12, 2026";

const Contact = () => (
  <ul className="lg__contact">
    <li><b>Email</b><a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></li>
    <li><b>Phone</b><a href={`tel:${CONTACT_PHONE.replace(/[^\d+]/g, "")}`}>{CONTACT_PHONE}</a></li>
    <li><b>Mail</b><span>KidPool, {CONTACT_ADDRESS}, USA</span></li>
  </ul>
);

const PRIVACY = [
  {
    id: "overview", title: "Overview",
    body: <>
      <p>KidPool (“KidPool”, “we”, “us”) helps parents and guardians coordinate their kids’ rides with other families from their own communities. This Privacy Policy explains what information we collect when you use the KidPool website and mobile apps (the “Service”), how we use it, who can see it, and the choices you have.</p>
      <p>We designed KidPool around a simple principle: <strong>your family’s information is shared only with the families you choose to coordinate with, and only as much as a ride needs.</strong> We do not sell your personal information.</p>
    </>,
  },
  {
    id: "collect", title: "Information we collect",
    body: <>
      <h4>Information you give us</h4>
      <ul>
        <li><strong>Account details:</strong> your name, phone number, email address and password or sign-in details.</li>
        <li><strong>Your children’s details:</strong> first name, age and the places they go that you add so rides can match real schedules.</li>
        <li><strong>Places:</strong> your home location and the venues you add. Other families see only a rough distance, never your exact address.</li>
        <li><strong>Rides:</strong> the requests and offers you create, including times, pickup and drop-off points, and which children are riding.</li>
        <li><strong>Messages and calls:</strong> messages you send to other families in the app, and in-app call records. Phone numbers are kept private.</li>
        <li><strong>Driver verification:</strong> if you offer rides, a photo of your ID or driver’s licence that you choose to upload.</li>
        <li><strong>Support and feedback:</strong> anything you send us when you contact us.</li>
      </ul>
      <h4>Information collected automatically</h4>
      <ul>
        <li><strong>Location during rides:</strong> with your permission, the driver’s device location while a ride is in progress, used for live tracking, pickup check-ins and arrival alerts. Location is not tracked outside an active ride.</li>
        <li><strong>Device and usage data:</strong> device type, operating system, app version, crash reports and how features are used, to keep the Service working and improve it.</li>
        <li><strong>Cookies on our website:</strong> small files that remember preferences and help us understand site traffic. You can control cookies in your browser settings.</li>
      </ul>
    </>,
  },
  {
    id: "use", title: "How we use your information",
    body: <ul>
      <li>To create and manage your account and your community memberships.</li>
      <li>To show you families going to the same places, and to send, match and confirm ride requests and offers.</li>
      <li>To provide ride features such as live tracking, QR check-in at pickup and drop-off, running-late alerts, SOS and notifications.</li>
      <li>To let you message and call other families without sharing phone numbers.</li>
      <li>To verify drivers who choose to upload ID, and to help keep the community safe, including investigating reports and blocking misuse.</li>
      <li>To provide support, send service messages, and improve and secure the Service.</li>
      <li>To comply with the law and enforce our Terms & Conditions.</li>
    </ul>,
  },
  {
    id: "share", title: "Who can see your information",
    body: <>
      <ul>
        <li><strong>Families in your community:</strong> families in the same community group can see your first name, your children’s first names, the places you share in common and a rough distance. They never see your exact address or phone number.</li>
        <li><strong>Families on a ride:</strong> when two families agree on a ride, both can see the details that ride needs: time, pickup and drop-off points, the children riding, the driver’s name and vehicle description, and live location while the ride is in progress.</li>
        <li><strong>Service providers:</strong> companies that host our servers, send notifications and messages, provide maps, or help with support and analytics, under contracts that limit how they can use your data.</li>
        <li><strong>Legal and safety reasons:</strong> when required by law, or when we believe in good faith it is needed to protect someone’s safety, investigate fraud or misuse, or defend our legal rights.</li>
        <li><strong>Business changes:</strong> if KidPool is involved in a merger, acquisition or sale of assets, your information may be transferred, and this policy will continue to apply.</li>
      </ul>
      <p><strong>We do not sell your personal information or share it for cross-context behavioural advertising.</strong></p>
    </>,
  },
  {
    id: "children", title: "Children’s privacy",
    body: <>
      <p>KidPool is built for parents and guardians. Accounts are for adults aged 18 or over, and the Service is not directed to children. Children do not create accounts or use the app themselves.</p>
      <p>A parent or guardian may add limited information about their own children (such as first name, age and the places they go) to arrange rides. We use this information only to provide the Service, and the parent can review, change or delete it at any time. If we learn that a child has given us personal information directly, we will delete it.</p>
    </>,
  },
  {
    id: "choices", title: "Your choices and rights",
    body: <>
      <ul>
        <li><strong>Access and update:</strong> review and edit your profile, your children’s details and your places in the app.</li>
        <li><strong>Who can call you:</strong> turn calls off or limit them in your call settings.</li>
        <li><strong>Location:</strong> turn off location permission in your device settings. Ride tracking features will not work without it.</li>
        <li><strong>Notifications:</strong> choose which alerts you receive.</li>
        <li><strong>Delete your account:</strong> delete your account in the app or by contacting us. We delete or de-identify your data except where we must keep it for legal, safety or security reasons.</li>
      </ul>
      <p>Depending on where you live, including in states such as California, Virginia and Colorado, you may have additional rights to know, access, correct, delete or obtain a copy of your personal information, and to not be discriminated against for using these rights. To make a request, contact us using the details below. We will verify your request before acting on it.</p>
    </>,
  },
  {
    id: "retention", title: "How long we keep information",
    body: <p>We keep your information for as long as your account is active and as needed to provide the Service. Ride history and messages are kept so families can refer back to past plans, and live location from a ride is kept only for a short period after the ride ends for safety and support purposes. When you delete your account, we delete or de-identify your information within a reasonable time, unless the law requires us to keep it longer.</p>,
  },
  {
    id: "security", title: "How we protect information",
    body: <p>We use administrative, technical and physical safeguards designed to protect your information, including encryption in transit, access controls and private phone numbers for in-app calls. No system is completely secure, so please keep your sign-in details private and contact us immediately if you think your account has been compromised.</p>,
  },
  {
    id: "changes", title: "Changes to this policy",
    body: <p>We may update this Privacy Policy from time to time. If we make significant changes, we will let you know in the app or by email before they take effect. The “Effective date” at the top shows when this policy was last updated.</p>,
  },
  {
    id: "contact", title: "Contact us",
    body: <><p>If you have questions about this Privacy Policy or your information, contact us:</p><Contact /></>,
  },
];

const TERMS = [
  {
    id: "agreement", title: "Agreement to these terms",
    body: <p>These Terms & Conditions (“Terms”) are an agreement between you and KidPool (“KidPool”, “we”, “us”) and govern your use of the KidPool website and mobile apps (the “Service”). By creating an account or using the Service, you agree to these Terms and to our Privacy Policy. If you do not agree, please do not use the Service.</p>,
  },
  {
    id: "what", title: "What KidPool is, and isn’t",
    body: <>
      <p>KidPool is a coordination tool. It helps parents and guardians in the same community find each other, ask for and offer rides, and agree on the details together.</p>
      <p><strong>KidPool is not a transportation provider, taxi or ride-hailing service.</strong> We do not employ drivers, provide vehicles or transport anyone. Rides are arranged directly between families, who decide for themselves whether to request, offer or accept a ride. Rides arranged through KidPool must not be offered for payment or profit.</p>
    </>,
  },
  {
    id: "eligibility", title: "Who can use KidPool",
    body: <ul>
      <li>You must be at least 18 years old and a parent or legal guardian, or be authorised by one, for any child you add.</li>
      <li>You must provide accurate information and keep it up to date.</li>
      <li>You may join only the community groups you genuinely belong to.</li>
      <li>You are responsible for keeping your account secure and for activity on your account.</li>
    </ul>,
  },
  {
    id: "drivers", title: "If you drive",
    body: <>
      <p>If you offer or give a ride, you confirm and agree that you:</p>
      <ul>
        <li>hold a valid driver’s licence and drive a vehicle that is registered, roadworthy and covered by insurance as required by law;</li>
        <li>will follow all traffic laws, and all child passenger safety laws, including appropriate car seats, booster seats and seat belts for each child;</li>
        <li>will not drive while impaired, distracted or using your phone in a way the law does not allow;</li>
        <li>will check your own insurance cover for carpooling, which remains your responsibility.</li>
      </ul>
    </>,
  },
  {
    id: "parents", title: "If your child rides",
    body: <p>You decide whether your child takes part in any ride. Before agreeing, review the ride details and the driver, and make sure the arrangements, including car seats and pickup and drop-off points, are right for your child. You are responsible for your decision to arrange a ride and for supervising your child as appropriate.</p>,
  },
  {
    id: "safety", title: "Safety features",
    body: <p>KidPool offers features such as private phone numbers, live ride tracking, check-ins, running-late alerts, SOS, driver ID upload and block-and-report tools. These features help families coordinate, but they do not guarantee anyone’s identity, conduct or safety, and KidPool does not run background checks unless we clearly say so. In an emergency, always call 911 or your local emergency number.</p>,
  },
  {
    id: "conduct", title: "Community rules",
    body: <>
      <p>To keep KidPool safe and friendly, you agree not to:</p>
      <ul>
        <li>harass, threaten, discriminate against or harm anyone, or share inappropriate content;</li>
        <li>impersonate anyone, create fake accounts or join communities you don’t belong to;</li>
        <li>offer rides for money or use the Service for any commercial purpose;</li>
        <li>collect other families’ information or contact them outside the purpose of arranging rides;</li>
        <li>misuse the SOS, reporting or messaging features;</li>
        <li>interfere with, copy, reverse-engineer or attempt to gain unauthorised access to the Service.</li>
      </ul>
      <p>You can block or report anyone at any time. We may review reports and take action, including removing content or suspending accounts.</p>
    </>,
  },
  {
    id: "content", title: "Your content",
    body: <p>You keep ownership of the content you add, such as messages and ride details. You give KidPool a limited licence to store, display and process that content only to operate and improve the Service. You are responsible for the content you share and must have the right to share it.</p>,
  },
  {
    id: "termination", title: "Suspension and termination",
    body: <p>You can stop using KidPool and delete your account at any time. We may suspend or end your access if you break these Terms, if we need to protect other families or the Service, or if required by law. Sections that by their nature should continue, such as disclaimers and limits of liability, survive termination.</p>,
  },
  {
    id: "disclaimers", title: "Disclaimers",
    body: <p>The Service is provided “as is” and “as available”. To the fullest extent allowed by law, KidPool disclaims all warranties, express or implied, including fitness for a particular purpose and non-infringement. We do not guarantee that the Service will be uninterrupted or error-free, or that any family, driver or ride will meet your expectations. KidPool is not responsible for the actions or omissions of any user, or for any ride arranged between families.</p>,
  },
  {
    id: "liability", title: "Limitation of liability",
    body: <p>To the fullest extent allowed by law, KidPool will not be liable for any indirect, incidental, special, consequential or punitive damages, or for any loss arising from rides arranged between users. Our total liability for any claim relating to the Service will not exceed one hundred US dollars (US$100). Some states do not allow certain limitations, so parts of this section may not apply to you.</p>,
  },
  {
    id: "indemnity", title: "Indemnity",
    body: <p>You agree to defend and hold harmless KidPool from claims, damages and expenses arising from your use of the Service, the rides you arrange or give, your content, or your breach of these Terms or the law.</p>,
  },
  {
    id: "law", title: "Governing law",
    body: <p>These Terms are governed by the laws of the State of Georgia, USA, without regard to conflict-of-law rules. Any dispute will be handled in the state or federal courts located in Georgia, unless the law where you live requires otherwise.</p>,
  },
  {
    id: "changes", title: "Changes to these terms",
    body: <p>We may update these Terms from time to time. If we make significant changes, we will let you know in the app or by email before they take effect. Continuing to use the Service after changes take effect means you accept the updated Terms.</p>,
  },
  {
    id: "contact", title: "Contact us",
    body: <><p>Questions about these Terms? Contact us:</p><Contact /></>,
  },
];

const PAGES = {
  privacy: { title: "Privacy Policy", intro: "How KidPool collects, uses and protects your family’s information.", sections: PRIVACY },
  terms: { title: "Terms & Conditions", intro: "The rules for using KidPool to coordinate rides with families in your community.", sections: TERMS },
};

export default function Legal({ page }) {
  const doc = PAGES[page] || PAGES.privacy;
  const [current, setCurrent] = useState(doc.sections[0].id);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); setCurrent(doc.sections[0].id); }, [page]);
  // highlight the section being read in the contents list
  useEffect(() => {
    const els = doc.sections.map((s) => document.getElementById(`lg-${s.id}`)).filter(Boolean);
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setCurrent(e.target.id.slice(3)); });
    }, { rootMargin: "-25% 0px -65% 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [page]);

  const jump = (id) => (e) => {
    e.preventDefault();
    document.getElementById(`lg-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main id="main" className="lg">
      <section className="lg__hero">
        <div className="container">
          <span className="accent-bar" aria-hidden="true" />
          <div className="lg__tabs" role="tablist" aria-label="Legal pages">
            <a href="#/privacy" role="tab" aria-selected={page === "privacy"} className={page === "privacy" ? "on" : ""}>Privacy Policy</a>
            <a href="#/terms" role="tab" aria-selected={page === "terms"} className={page === "terms" ? "on" : ""}>Terms & Conditions</a>
          </div>
          <h1 className="lg__title">{doc.title}</h1>
          <p className="lg__intro">{doc.intro}</p>
          <p className="lg__date">Effective date: {EFFECTIVE_DATE}</p>
        </div>
      </section>

      <div className="container lg__layout">
        <nav className="lg__toc" aria-label="On this page">
          <p>On this page</p>
          <ol>
            {doc.sections.map((s, i) => (
              <li key={s.id}>
                <a href={`#lg-${s.id}`} onClick={jump(s.id)} className={current === s.id ? "on" : ""}>
                  <span>{String(i + 1).padStart(2, "0")}</span>{s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <article className="lg__body">
          {doc.sections.map((s, i) => (
            <section key={s.id} id={`lg-${s.id}`} className="lg__sec">
              <h2><span>{String(i + 1).padStart(2, "0")}</span>{s.title}</h2>
              {s.body}
            </section>
          ))}
          <a className="lg__back" href="#top">← Back to KidPool</a>
        </article>
      </div>
    </main>
  );
}
