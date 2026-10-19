import { useState, useEffect } from "react";
import { NavLink, Link, Routes, Route } from "react-router-dom";
import { post, listItems } from "./api.js";

const NAV = [
  ["/", "Home"], ["/about", "About"], ["/events", "Events"], ["/volunteer", "Volunteer"],
  ["/adopt", "Adopt an item"], ["/join", "Join as organization"], ["/gallery", "Gallery"],
  ["/report", "Report a spot"], ["/contact", "Contact"],
];
const STATS = [
  ["215+ tonnes", "of waste removed"], ["55+", "cleanup drives in Surat"],
  ["1,500+", "volunteers in our WhatsApp community"], ["25,000+", "people reached offline"],
];
const STEPS = [
  ["Identify & prioritise", "We find littered and neglected public spaces where community action makes a visible difference."],
  ["Plan the Sunday drive", "Every Sunday we plan a drive: volunteers, equipment, waste collection and safety."],
  ["Mobilise volunteers", "Citizens, students, social groups and communities join us to clean their city."],
  ["Clean the location", "Volunteers remove accumulated waste and separate it into categories wherever practical."],
  ["Create public awareness", "We talk to people at the location and encourage them not to litter."],
  ["Document & measure", "Photos, videos, volunteer counts and waste data keep our results transparent."],
  ["Return & continue", "We move to a new location every Sunday, or return to areas that need more attention."],
];
const PLANS = [
  ["Offline collection centre", "A base for religious and recyclable waste, equipment storage and operations, keeping waste away from the river."],
  ["Complete transformation", "Restore polluted riverbanks and littered spots into waste-free, green spaces that citizens help maintain."],
  ["Religious item collection van", "A van that collects religious waste from temples and carries tools to drive locations."],
];
// Edit these as events are announced.
const EVENTS = [
  { title: "Weekly Sunday cleanup drive", when: "Every Sunday", where: "Location announced on WhatsApp and Instagram", note: "Gloves, water bottle, hat and mask recommended." },
];
const GALLERY = [{ src: "/gallery/river-cleanup.jpg", alt: "Volunteers segregating bottles and cans on the Tapi riverbank" }
                 { src: "/gallery/Cleanup-image-01", alt: "Volunteers Photo after Drive" }];
// Add more photos: drop files in public/gallery and list them above.

const Hero = ({ title, sub }) => (
  <header className="pagehead"><h1>{title}</h1><p>{sub}</p></header>
);

function Form({ kind, fields, cta, done }) {
  const [v, setV] = useState({});
  const [state, setState] = useState("idle");
  const [err, setErr] = useState("");
  const set = (k, val) => setV((p) => ({ ...p, [k]: val }));
  const locate = () =>
    navigator.geolocation?.getCurrentPosition(
      (p) => { set("map_link", `https://maps.google.com/?q=${p.coords.latitude},${p.coords.longitude}`); },
      () => setErr("Location access was blocked. Type the address instead.")
    );
  const submit = async (e) => {
    e.preventDefault(); setState("sending"); setErr("");
    try { await post(kind, v); setState("ok"); setV({}); }
    catch (x) { setErr(x.message); setState("idle"); }
  };
  if (state === "ok") return <div className="ok" role="status"><h3>{done}</h3><button className="btn ghost" onClick={() => setState("idle")}>Send another response</button></div>;
  return (
    <form className="form" onSubmit={submit}>
      <input className="hp" name="website" tabIndex={-1} autoComplete="off" onChange={(e) => set("website", e.target.value)} aria-hidden="true" />
      {fields.map(([name, label, type = "text", opts]) => (
        <label key={name} className={type === "textarea" ? "wide" : ""}>{label}
          {type === "textarea" ? <textarea rows="4" value={v[name] || ""} onChange={(e) => set(name, e.target.value)} required={!label.includes("(optional)")} />
          : type === "select" ? <select value={v[name] || ""} onChange={(e) => set(name, e.target.value)} required><option value="">Choose one</option>{opts.map((o) => <option key={o}>{o}</option>)}</select>
          : <input type={type} value={v[name] || ""} onChange={(e) => set(name, e.target.value)} required={!label.includes("(optional)")} />}
        </label>
      ))}
      {kind === "report" && (
        <div className="wide geo"><button type="button" className="btn ghost" onClick={locate}>Use my current location</button>
          {v.map_link && <span>Location captured</span>}</div>
      )}
      {err && <p className="err wide" role="alert">{err}</p>}
      <button className="btn wide" disabled={state === "sending"}>{state === "sending" ? "Sending…" : cta}</button>
    </form>
  );
}

const Home = () => (
  <>
    <section className="hero">
      <div className="hero-text">
        <p className="slogan">Maro Kachro, Mari Javabdari.</p>
        <h1>Every Sunday, Surat gets cleaner.</h1>
        <p>A volunteer-driven community initiative, part of the CleanUp India movement and inspired by the Swachh Bharat Mission. Join a drive and take responsibility for your city.</p>
        <div className="row"><Link className="btn" to="/volunteer">Volunteer this Sunday</Link><Link className="btn ghost light" to="/report">Report a littered spot</Link></div>
      </div>
      <img src="/gallery/river-cleanup.jpg" alt="Volunteers sorting recyclable waste on the Tapi riverbank" />
    </section>
    <section className="stats">{STATS.map(([n, l]) => <div key={l}><strong>{n}</strong><span>{l}</span></div>)}</section>
    <section className="wrap split">
      <div><h2>One year, consistent action</h2><p>Our work has received appreciation from the Surat Municipal Corporation (SMC) and recognition linked to the CleanUp Ambassador of Surat initiative. And we continue every Sunday.</p></div>
      <div className="actions">
        <Link to="/adopt">Adopt a usable item</Link><Link to="/join">Bring your organization</Link><Link to="/events">See upcoming drives</Link>
      </div>
    </section>
  </>
);

const About = () => (
  <>
    <Hero title="About CleanUp Surat" sub="We bring people together to make cleanliness a shared responsibility. Go Green. Go Clean." />
    <section className="wrap">
      <h2>How a Sunday drive works</h2>
      <ol className="steps">{STEPS.map(([t, d]) => <li key={t}><h3>{t}</h3><p>{d}</p></li>)}</ol>
      <h2>What we are building next</h2>
      <div className="grid3">{PLANS.map(([t, d]) => <article key={t}><h3>{t}</h3><p>{d}</p></article>)}</div>
    </section>
  </>
);

const Events = () => (
  <>
    <Hero title="Events" sub="We clean up every Sunday. Follow our WhatsApp community and Instagram for the next location." />
    <section className="wrap grid3">
      {EVENTS.map((e) => <article key={e.title}><h3>{e.title}</h3><p><b>{e.when}</b><br />{e.where}</p><p>{e.note}</p><Link className="btn" to="/volunteer">Sign up</Link></article>)}
    </section>
  </>
);

const Volunteer = () => (
  <>
    <Hero title="Volunteer with us" sub="Tell us a little about yourself and we'll add you to the next Sunday drive." />
    <section className="wrap narrow"><Form kind="volunteer" cta="Join the next drive" done="Thank you! We'll contact you about the next Sunday drive."
      fields={[["name", "Full name"], ["phone", "Phone / WhatsApp", "tel"], ["email", "Email (optional)", "email"], ["area", "Your area in Surat"],
        ["age_group", "Age group", "select", ["Under 18", "18–25", "26–40", "41–60", "60+"]],
        ["notes", "Anything we should know? (optional)", "textarea"]]} /></section>
  </>
);

// Edit when the physical auction is scheduled.
const AUCTION = { when: "The date will be announced on our WhatsApp community and Instagram.", where: "The venue will be announced with the date." };

const Adopt = () => {
  const [items, setItems] = useState(null);
  const [err, setErr] = useState("");
  useEffect(() => { listItems().then(setItems).catch(() => setErr("Could not load items. Please refresh the page.")); }, []);
  return (
    <>
      <Hero title="Adopt an item" sub="Idols and other items we collect that are still in good, usable condition. See what is coming up for our physical auction." />
      <section className="wrap">
        <p className="note"><b>Physical auction.</b> {AUCTION.when} {AUCTION.where} Items are shown here only so you know what will be in the auction. Nothing is sold or reserved online, and CleanUp Surat does not collect funds or donations from the public.</p>
        {err && <p className="err" role="alert">{err}</p>}
        {items && !items.length && <p>No items are listed right now. Follow our Instagram for the next auction.</p>}
        <div className="grid3 items">
          {(items || []).map((it) => (
            <article className="item" key={it.id}>
              <img src={it.image} alt={it.name} onError={(e) => (e.currentTarget.style.display = "none")} />
              <h3>{it.name}</h3>
              <p className="meta"><b>{it.category}</b>. Condition: {it.condition}</p>
              <p>{it.details}</p>
              {it.adopted && <p><span className="tag closed">Adopted</span></p>}
            </article>
          ))}
        </div>
      </section>
    </>
  );
};

const Join = () => (
  <>
    <Hero title="Join as an organization" sub="Schools, colleges, companies and community groups: clean up with us." />
    <section className="wrap narrow"><Form kind="organization" cta="Register our organization" done="Thank you! We'll reach out to plan a drive with your team."
      fields={[["org_name", "Organization name"], ["contact_name", "Contact person"], ["email", "Email", "email"], ["phone", "Phone", "tel"],
        ["org_type", "Type", "select", ["School / College", "Company", "NGO / Social group", "Housing society", "Other"]],
        ["team_size", "Approx. volunteers"], ["notes", "How would you like to help? (optional)", "textarea"]]} /></section>
  </>
);

const Gallery = () => (
  <>
    <Hero title="Gallery" sub="Moments from our Sunday drives." />
    <section className="wrap gallery">{GALLERY.map((g) => <img key={g.src} src={g.src} alt={g.alt} loading="lazy" />)}</section>
  </>
);

const Report = () => (
  <>
    <Hero title="Report a spot" sub="See waste piling up? Tell us where, and we'll consider it for an upcoming drive." />
    <section className="wrap narrow"><Form kind="report" cta="Report this spot" done="Thank you! We've logged the spot for review."
      fields={[["location", "Location / landmark"], ["name", "Your name (optional)"], ["phone", "Phone (optional)", "tel"],
        ["description", "What's the problem?", "textarea"]]} /></section>
  </>
);

const Contact = () => (
  <>
    <Hero title="Contact us" sub="Questions, collaborations or media? Write to us." />
    <section className="wrap narrow">
      {/* TODO: replace with your real contact details */}
      <p className="note">Email: your-email@example.com · Instagram: @your_handle</p>
      <Form kind="contact" cta="Send message" done="Thank you! We'll get back to you soon."
        fields={[["name", "Your name"], ["email", "Email (optional)", "email"], ["message", "Message", "textarea"]]} />
    </section>
  </>
);

export default function App() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <nav className="nav">
        <Link to="/" className="brand"><img src="/logo.jpeg" alt="" /><span>CleanUp Surat</span></Link>
        <button className="burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>Menu</button>
        <div className={open ? "links open" : "links"} onClick={() => setOpen(false)}>
          {NAV.map(([to, l]) => <NavLink key={to} to={to} end={to === "/"}>{l}</NavLink>)}
        </div>
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<Home />} /><Route path="/about" element={<About />} />
          <Route path="/events" element={<Events />} /><Route path="/volunteer" element={<Volunteer />} />
          <Route path="/adopt" element={<Adopt />} /><Route path="/join" element={<Join />} />
          <Route path="/gallery" element={<Gallery />} /><Route path="/report" element={<Report />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <footer><img src="/logo.jpeg" alt="CleanUp Surat logo" /><p>A volunteer-driven initiative, part of CleanUp India. Inspired by the Swachh Bharat Mission. We do not collect funds or donations from the public.</p></footer>
    </>
  );
}
