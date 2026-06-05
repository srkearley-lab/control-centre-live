const fs = require("fs");
const path = require("path");

const root = __dirname;
const businessesDir = path.join(root, "businesses");

const businesses = [
  {
    slug: "the-orchard-cafe-brentwood",
    name: "The Orchard Cafe",
    initials: "OC",
    category: "Cafe",
    area: "Brentwood",
    location: "114 Orchard Ave, Brentwood CM13 2DP",
    phone: "01277 215030",
    email: "Ask in store",
    headline: "Fresh Coffee, Brunch & Local Favourites in Brentwood",
    subline: "A warm local cafe serving freshly prepared breakfasts, lunches, cakes and coffee in the heart of Brentwood.",
    kicker: "Neighbourhood cafe in Brentwood",
    accent: "#d98f45",
    dark: "#223127",
    light: "#f7f1e6",
    visual: ["Freshly Brewed", "All-Day Brunch", "Homemade Cakes", "Local Favourite"],
    services: [
      ["Breakfast favourites", "Freshly prepared morning plates, toast, eggs, warm options and cafe classics for a proper Brentwood breakfast."],
      ["Coffee and hot drinks", "Smooth coffee, teas and comforting hot drinks served for sit-in catch-ups or easy takeaway."],
      ["Lunch plates", "Simple, satisfying lunch options including sandwiches, specials and lighter bites for local workers and residents."],
      ["Cakes and sweet treats", "A friendly counter of cakes, pastries and treats to pair with coffee or take back to the office."],
      ["Takeaway orders", "Quick phone-led ordering for customers who want cafe food without waiting around."],
      ["Local catering enquiries", "A simple route for small local events, meetings and group orders around Brentwood."]
    ],
    menuTitle: "Cafe Favourites",
    menu: [
      ["Breakfast plate", "Eggs, toast, grilled favourites and cafe-style sides.", "&pound;8-12"],
      ["Coffee and pastry", "Fresh coffee with a daily sweet option.", "&pound;5-7"],
      ["Lunch special", "Seasonal sandwich, salad or hot plate.", "&pound;9-14"]
    ],
    hours: [["Mon-Fri", "8:00am - 3:30pm"], ["Saturday", "8:30am - 3:00pm"], ["Sunday", "To be confirmed"]],
    reviews: [
      "A lovely local cafe with warm service and proper breakfast options.",
      "Great coffee stop in Brentwood and a relaxed place to meet.",
      "Friendly, easy-going and exactly what you want from a neighbourhood cafe."
    ],
    faqs: [
      ["Do you offer takeaway?", "Yes, customers can call ahead for takeaway orders and quick collection."],
      ["Can customers check opening times quickly?", "Yes, opening times are listed clearly alongside phone and location details."],
      ["Is pricing final?", "No. Example pricing - to be confirmed by the business."]
    ]
  },
  {
    slug: "de-milia-barber-brentwood",
    name: "De'Milia Barber",
    initials: "DB",
    category: "Barber",
    area: "Brentwood",
    location: "23a Ongar Road, Brentwood CM15 9AU",
    phone: "01277 200008",
    email: "Ask by phone",
    headline: "Sharp Cuts, Classic Grooming & Premium Barbering in Brentwood",
    subline: "Traditional barbering, clean fades and confident grooming from a local Brentwood barber.",
    kicker: "Brentwood barbering",
    accent: "#c89b3c",
    dark: "#101820",
    light: "#f4efe6",
    visual: ["Skin Fades", "Classic Cuts", "Beard Shaping", "Walk-ins"],
    services: [
      ["Skin fades", "Clean fades with sharp detailing for a crisp modern finish."],
      ["Classic barber cuts", "Timeless cuts shaped for everyday confidence and easy styling."],
      ["Beard trims", "Tidy beard shaping, line work and finishing for a cleaner look."],
      ["Restyle appointments", "A more considered cut for customers changing length, shape or finish."],
      ["Walk-in grooming", "Clear phone and opening information for customers ready to visit."],
      ["Regular cut plans", "A simple way to encourage repeat bookings and regular grooming routines."]
    ],
    menuTitle: "Barber Services",
    menu: [
      ["Classic cut", "A clean, tidy barber cut finished with care.", "&pound;18-24"],
      ["Skin fade", "Detailed fade work with a sharp finish.", "&pound;24-30"],
      ["Cut and beard shape", "Haircut, beard trim and finishing.", "&pound;30-38"]
    ],
    hours: [["Mon-Fri", "9:00am - 6:00pm"], ["Saturday", "8:30am - 5:00pm"], ["Sunday", "Closed / to be confirmed"]],
    reviews: [
      "Sharp cut, friendly service and a proper local barber feel.",
      "Clean fade and good attention to detail from start to finish.",
      "Easy to call, easy to visit and a confident grooming experience."
    ],
    faqs: [
      ["Do you take walk-ins?", "Customers can call ahead to check availability or ask about appointment times."],
      ["Can customers see services before calling?", "Yes, the service cards and pricing area make the offer clear before contact."],
      ["Is pricing final?", "No. Example pricing - to be confirmed by the business."]
    ]
  },
  {
    slug: "wagnificent-dog-groomers-brentwood",
    name: "Wagnificent Dog Groomers",
    initials: "WG",
    category: "Dog Groomer",
    area: "Brentwood",
    location: "54 Hutton Road, Brentwood CM15 8LB",
    phone: "07935 544063",
    email: "Ask by phone",
    headline: "Premium Dog Grooming with a Gentle Local Touch",
    subline: "Friendly grooming, bathing and coat care for dogs across Brentwood.",
    kicker: "Local dog grooming in Brentwood",
    accent: "#e7a7a0",
    dark: "#25313d",
    light: "#f7f4ef",
    visual: ["Full Groom", "Bath & Brush", "Puppy Care", "Coat Health"],
    services: [
      ["Full groom packages", "Breed-aware grooming, trimming, styling and finishing for a fresh, comfortable coat."],
      ["Bath and blow dry", "A gentle wash, dry and brush-through for dogs who need a clean refresh."],
      ["Puppy introductions", "A calm first grooming experience to help young dogs build confidence."],
      ["Deshedding support", "Coat care for heavier shedding, seasonal changes and healthier maintenance."],
      ["Nail trims", "Quick tidy-ups for comfort, safety and better paw care."],
      ["Owner guidance", "Helpful advice on coat care, grooming routines and booking intervals."]
    ],
    menuTitle: "Grooming Packages",
    menu: [
      ["Small dog full groom", "Full groom for smaller breeds.", "&pound;45-60"],
      ["Medium dog full groom", "Wash, trim, style and finish.", "&pound;55-75"],
      ["Bath and brush", "Freshen-up bath, dry and brush.", "&pound;30-50"]
    ],
    hours: [["Mon-Fri", "9:00am - 5:30pm"], ["Saturday", "By appointment"], ["Sunday", "Closed / to be confirmed"]],
    reviews: [
      "Gentle, calm and our dog looked brilliant afterwards.",
      "Friendly local grooming with care, patience and a lovely finish.",
      "Easy to contact and professional from the first message."
    ],
    faqs: [
      ["Do you groom nervous dogs?", "Gentle handling, appointment pacing and calm care can be discussed before booking."],
      ["Can customers book by phone?", "Yes, the mobile number is visible in the hero, contact section and footer."],
      ["Is pricing final?", "No. Example pricing - to be confirmed by the business."]
    ]
  },
  {
    slug: "shenfield-vehicle-services-shenfield",
    name: "Shenfield Vehicle Services",
    initials: "SV",
    category: "Vehicle Services",
    area: "Shenfield",
    location: "17A Hutton Road, Shenfield, Brentwood CM15 8JU",
    phone: "01277 218686",
    email: "shenfieldvehicleservices@tesco.net",
    headline: "Reliable Vehicle Servicing, Diagnostics & Repairs in Shenfield",
    subline: "Professional local vehicle care with clear advice, practical service and trusted workmanship.",
    kicker: "Local garage in Shenfield",
    accent: "#f2b705",
    dark: "#17212b",
    light: "#eef3f7",
    visual: ["MOT Support", "Servicing", "Diagnostics", "Repairs"],
    services: [
      ["Interim servicing", "Practical service checks for drivers who want routine care between major appointments."],
      ["Full servicing", "More complete vehicle checks, replacement parts advice and maintenance planning."],
      ["Diagnostics", "Clear fault-finding for warning lights, running issues and performance concerns."],
      ["Brakes and tyres", "Safety-led inspections, practical advice and repair routes for everyday driving."],
      ["MOT preparation", "Checks and repair advice to help customers prepare before MOT deadlines."],
      ["Repair enquiries", "A simple route for local drivers to describe the issue and request a call back."]
    ],
    menuTitle: "Garage Services",
    menu: [
      ["Interim service", "Routine maintenance and practical checks.", "&pound;120-180"],
      ["Full service", "Broader inspection and service work.", "&pound;220-320"],
      ["Diagnostic check", "Fault-finding and practical advice.", "&pound;55-90"]
    ],
    hours: [["Mon-Fri", "8:30am - 5:30pm"], ["Saturday", "By appointment / to be confirmed"], ["Sunday", "Closed"]],
    reviews: [
      "Straightforward advice, clear communication and a practical local service.",
      "Quick diagnosis and professional workmanship for everyday vehicle problems.",
      "Convenient Shenfield garage with helpful contact options."
    ],
    faqs: [
      ["Can customers request diagnostics online?", "Yes, the contact section can collect the issue, vehicle details and preferred callback time."],
      ["Can customers ask about MOT preparation?", "Yes, MOT preparation, servicing and repair enquiries are all handled through the contact routes."],
      ["Is pricing final?", "No. Example pricing - to be confirmed by the business."]
    ]
  },
  {
    slug: "the-garage-group-essex-brentwood",
    name: "The Garage Group Essex",
    initials: "GG",
    category: "Garage",
    area: "Essex",
    location: "The Old Stable Yard, Sandpit Lane, Brentwood CM14 5QD",
    phone: "01277 402382",
    email: "enquiries@thegaragegroupessex.co.uk",
    headline: "Modern Vehicle Diagnostics, Servicing & Repairs in Essex",
    subline: "A bold, reliable Essex garage built around clear service, strong workmanship and easy booking.",
    kicker: "Garage services for Brentwood and Essex",
    accent: "#2dd4bf",
    dark: "#111827",
    light: "#f5f7fb",
    visual: ["Diagnostics", "MOT", "Tyres", "Fleet"],
    services: [
      ["Advanced diagnostics", "Modern fault-finding and clear next steps for warning lights and performance issues."],
      ["MOT and servicing", "Routine care, MOT preparation and service packages for local drivers."],
      ["Brakes and tyres", "Safety-led checks, repair advice and replacement support."],
      ["Air conditioning", "Seasonal comfort checks, regas enquiries and practical maintenance."],
      ["Fleet support", "Clear contact routes for trade, fleet and repeat service requirements."],
      ["Repair booking", "A stronger enquiry journey for customers who need quick workshop advice."]
    ],
    menuTitle: "Workshop Services",
    menu: [
      ["MOT support", "MOT test support plus repair advice if needed.", "&pound;54.85 statutory MOT test plus repairs if needed"],
      ["Diagnostic inspection", "Fault-finding and repair guidance.", "&pound;65-110"],
      ["Service package", "Vehicle service options by requirement.", "&pound;180-350"]
    ],
    hours: [["Mon-Fri", "8:30am - 5:30pm"], ["Saturday", "9:00am - 1:00pm / to be confirmed"], ["Sunday", "Closed"]],
    reviews: [
      "Clear communication and professional workmanship from first call to collection.",
      "A capable local garage with strong service options and helpful advice.",
      "Easy to contact, practical and reliable for Brentwood vehicle care."
    ],
    faqs: [
      ["Can customers book diagnostics quickly?", "Yes, diagnostics are presented as a main service with a direct enquiry route."],
      ["Does it support fleet enquiries?", "Yes, fleet support is visible as a separate service path."],
      ["Is pricing final?", "No. Example pricing - to be confirmed by the business."]
    ]
  }
];

function esc(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function tel(phone) {
  return phone.replace(/[^\d+]/g, "");
}

function render(b) {
  const serviceCards = b.services.map(([title, text], index) => `
        <article class="service-card">
          <span>0${index + 1}</span>
          <h3>${esc(title)}</h3>
          <p>${esc(text)}</p>
        </article>`).join("");

  const pricingCards = b.menu.map(([title, text, price]) => `
        <article class="price-card">
          <div>
            <span>${esc(title)}</span>
            <p>${esc(text)}</p>
          </div>
          <strong>${price}</strong>
          <small>Example pricing - to be confirmed by the business.</small>
        </article>`).join("");

  const galleryCards = b.visual.map((label, index) => `
        <article class="gallery-card gallery-${index + 1}">
          <div class="photo-layer"></div>
          <span>${esc(label)}</span>
        </article>`).join("");

  const reviews = b.reviews.map((review, index) => `
        <figure>
          <div class="stars">★★★★★</div>
          <blockquote>"${esc(review)}"</blockquote>
          <figcaption>Placeholder review ${index + 1} - replace with verified customer feedback.</figcaption>
        </figure>`).join("");

  const hours = b.hours.map(([day, time]) => `<li><strong>${esc(day)}</strong><span>${esc(time)}</span></li>`).join("");
  const faqs = b.faqs.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(b.name)} | ${esc(b.category)} in ${esc(b.area)}</title>
  <meta name="description" content="${esc(b.subline)}">
  <style>
    :root {
      --dark:${b.dark};
      --accent:${b.accent};
      --light:${b.light};
      --paper:#ffffff;
      --ink:#14202b;
      --muted:#657286;
      --line:#dce3ec;
      --shadow:0 24px 70px rgba(10,18,28,.15);
    }
    * { box-sizing:border-box; }
    html { scroll-behavior:smooth; }
    body { margin:0; font-family:Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif; background:#fff; color:var(--ink); line-height:1.5; }
    a { color:inherit; }
    .wrap { width:min(1180px, calc(100% - 40px)); margin:0 auto; }
    .demo-bar { background:#0c1117; color:#d8e0ea; font-size:13px; padding:9px 0; }
    .demo-bar .wrap { display:flex; justify-content:space-between; gap:12px; flex-wrap:wrap; }
    nav { position:sticky; top:0; z-index:20; background:rgba(255,255,255,.94); backdrop-filter:blur(18px); border-bottom:1px solid rgba(220,227,236,.9); }
    .nav-inner { min-height:74px; display:flex; justify-content:space-between; align-items:center; gap:18px; }
    .brand { display:flex; align-items:center; gap:12px; color:var(--dark); text-decoration:none; font-weight:950; }
    .mark { width:42px; height:42px; border-radius:8px; display:grid; place-items:center; background:linear-gradient(135deg,var(--dark),color-mix(in srgb,var(--accent) 50%,var(--dark))); color:#fff; box-shadow:0 12px 26px rgba(0,0,0,.18); }
    .nav-links { display:flex; align-items:center; gap:18px; color:#344256; font-size:14px; font-weight:800; }
    .nav-links a { text-decoration:none; }
    .btn { display:inline-flex; justify-content:center; align-items:center; min-height:44px; padding:0 18px; border-radius:8px; border:1px solid transparent; text-decoration:none; font-weight:900; white-space:nowrap; }
    .btn.primary { background:var(--accent); color:var(--dark); box-shadow:0 14px 32px color-mix(in srgb,var(--accent) 30%,transparent); }
    .btn.dark { background:var(--dark); color:#fff; }
    .btn.light { background:#fff; color:var(--dark); border-color:rgba(255,255,255,.3); }
    .hero { overflow:hidden; background:linear-gradient(135deg,var(--dark) 0%, color-mix(in srgb,var(--dark) 86%,#fff) 54%, color-mix(in srgb,var(--accent) 46%,var(--dark)) 100%); color:#fff; position:relative; }
    .hero:before { content:""; position:absolute; inset:0; background:radial-gradient(circle at 72% 18%, color-mix(in srgb,var(--accent) 48%,transparent), transparent 28%), linear-gradient(90deg,rgba(0,0,0,.32),rgba(0,0,0,.03)); }
    .hero-grid { position:relative; min-height:calc(100vh - 112px); display:grid; grid-template-columns:minmax(0,1fr) minmax(360px,.82fr); gap:48px; align-items:center; padding:70px 0 86px; }
    .kicker { display:inline-flex; padding:8px 13px; border:1px solid rgba(255,255,255,.25); border-radius:999px; background:rgba(255,255,255,.1); color:#edf3f8; font-size:13px; font-weight:900; margin-bottom:20px; }
    h1 { margin:0; font-size:clamp(44px,7vw,84px); line-height:.96; letter-spacing:0; max-width:840px; }
    .hero-copy { color:#e0e8ef; font-size:clamp(18px,2vw,22px); max-width:720px; margin:22px 0 0; }
    .hero-actions { display:flex; gap:12px; flex-wrap:wrap; margin-top:30px; }
    .hero-proof { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; margin-top:34px; max-width:760px; }
    .proof-card { border:1px solid rgba(255,255,255,.2); border-radius:8px; padding:16px; background:rgba(255,255,255,.09); min-height:104px; }
    .proof-card strong { display:block; color:#fff; font-size:19px; margin-bottom:4px; }
    .proof-card span { color:#cbd5df; font-size:13px; }
    .hero-visual { min-height:560px; border-radius:8px; overflow:hidden; border:1px solid rgba(255,255,255,.22); box-shadow:var(--shadow); background:linear-gradient(145deg,rgba(255,255,255,.18),rgba(255,255,255,.05)); position:relative; }
    .hero-visual:before { content:""; position:absolute; inset:24px; border-radius:8px; border:1px solid rgba(255,255,255,.25); }
    .hero-photo { position:absolute; inset:42px 42px 170px; border-radius:8px; overflow:hidden; background:linear-gradient(135deg,color-mix(in srgb,var(--accent) 62%,#fff),color-mix(in srgb,var(--dark) 92%,#000)); box-shadow:0 26px 60px rgba(0,0,0,.25); }
    .hero-photo:before { content:""; position:absolute; inset:0; background:linear-gradient(135deg,rgba(255,255,255,.28),transparent 32%), repeating-linear-gradient(135deg,rgba(255,255,255,.13) 0 2px,transparent 2px 22px); }
    .hero-photo:after { content:"${esc(b.visual[0])}"; position:absolute; left:28px; bottom:24px; color:#fff; font-size:54px; line-height:.95; font-weight:950; max-width:70%; }
    .mini-gallery { position:absolute; left:42px; right:42px; bottom:42px; display:grid; grid-template-columns:repeat(3,1fr); gap:12px; }
    .mini-gallery span { min-height:96px; display:flex; align-items:end; padding:14px; border-radius:8px; background:rgba(255,255,255,.92); color:var(--dark); font-weight:950; box-shadow:0 16px 34px rgba(0,0,0,.16); }
    section { padding:84px 0; }
    .band { background:var(--light); }
    .section-head { display:flex; justify-content:space-between; align-items:end; gap:24px; margin-bottom:34px; }
    .section-head h2 { margin:0; color:var(--dark); font-size:clamp(32px,4.5vw,58px); line-height:1.02; letter-spacing:0; }
    .section-head p { margin:0; color:var(--muted); max-width:560px; font-size:17px; }
    .services-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
    .service-card { background:#fff; border:1px solid var(--line); border-radius:8px; padding:24px; min-height:230px; box-shadow:0 14px 34px rgba(15,23,42,.06); }
    .service-card span { color:var(--accent); font-weight:950; }
    .service-card h3 { margin:18px 0 10px; color:var(--dark); font-size:23px; }
    .service-card p { margin:0; color:var(--muted); }
    .split { display:grid; grid-template-columns:1fr 1fr; gap:24px; align-items:stretch; }
    .dark-panel { background:var(--dark); color:#fff; border-radius:8px; padding:36px; min-height:420px; position:relative; overflow:hidden; }
    .dark-panel:after { content:""; position:absolute; right:-90px; bottom:-90px; width:280px; height:280px; border-radius:50%; background:var(--accent); opacity:.35; }
    .dark-panel h2 { margin:0 0 14px; font-size:42px; line-height:1.04; position:relative; z-index:1; }
    .dark-panel p { color:#d7e2eb; position:relative; z-index:1; }
    .hours { list-style:none; padding:0; margin:28px 0 0; display:grid; gap:12px; position:relative; z-index:1; }
    .hours li { display:flex; justify-content:space-between; gap:18px; border:1px solid rgba(255,255,255,.2); border-radius:8px; padding:14px 16px; background:rgba(255,255,255,.08); }
    .hours span { color:#e4edf5; text-align:right; }
    .pricing-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:18px; }
    .price-card { display:flex; flex-direction:column; justify-content:space-between; gap:24px; background:#fff; border:1px solid var(--line); border-radius:8px; padding:28px; min-height:286px; box-shadow:0 14px 34px rgba(15,23,42,.07); }
    .price-card span { display:block; color:var(--dark); font-size:22px; font-weight:950; margin-bottom:8px; }
    .price-card p { color:var(--muted); margin:0; }
    .price-card strong { color:var(--dark); font-size:34px; line-height:1.05; }
    .price-card small { color:#7b8796; }
    .gallery-grid { display:grid; grid-template-columns:1.2fr .8fr .8fr; grid-auto-rows:250px; gap:16px; }
    .gallery-card { position:relative; overflow:hidden; border-radius:8px; box-shadow:0 18px 46px rgba(15,23,42,.12); background:linear-gradient(135deg,color-mix(in srgb,var(--accent) 54%,#fff),color-mix(in srgb,var(--dark) 86%,#000)); }
    .gallery-card:first-child { grid-row:span 2; }
    .gallery-card:before { content:""; position:absolute; inset:0; background:linear-gradient(135deg,rgba(255,255,255,.26),transparent 34%), repeating-linear-gradient(135deg,rgba(255,255,255,.12) 0 2px,transparent 2px 24px); }
    .gallery-card:after { content:""; position:absolute; inset:18px; border:1px solid rgba(255,255,255,.35); border-radius:8px; }
    .gallery-card span { position:absolute; left:24px; bottom:22px; color:#fff; font-size:clamp(24px,4vw,46px); font-weight:950; max-width:70%; line-height:1; }
    .reviews { display:grid; grid-template-columns:repeat(3,1fr); gap:18px; }
    figure { margin:0; background:#fff; border:1px solid var(--line); border-radius:8px; padding:26px; box-shadow:0 14px 34px rgba(15,23,42,.06); }
    .stars { color:var(--accent); letter-spacing:0; font-size:18px; margin-bottom:16px; }
    blockquote { margin:0 0 18px; color:var(--dark); font-size:20px; font-weight:850; line-height:1.35; }
    figcaption { color:var(--muted); font-size:13px; }
    .contact-grid { display:grid; grid-template-columns:1fr .9fr; gap:24px; align-items:stretch; }
    .contact-card, .faq-card { background:#fff; border:1px solid var(--line); border-radius:8px; padding:28px; box-shadow:0 14px 34px rgba(15,23,42,.06); }
    .contact-card h2, .faq-card h2 { margin:0 0 16px; color:var(--dark); font-size:34px; line-height:1.05; }
    .contact-lines { display:grid; gap:12px; margin:22px 0; }
    .contact-lines div { border:1px solid var(--line); border-radius:8px; padding:14px; background:#fbfdff; }
    .contact-lines strong { display:block; color:var(--muted); font-size:13px; margin-bottom:4px; }
    details { border:1px solid var(--line); border-radius:8px; padding:16px 18px; background:#fff; margin-bottom:12px; }
    summary { cursor:pointer; color:var(--dark); font-weight:950; }
    details p { color:var(--muted); margin:12px 0 0; }
    footer { background:#0c1117; color:#c5cfda; padding:42px 0 24px; }
    .footer-grid { display:grid; grid-template-columns:1.2fr .8fr .8fr; gap:28px; padding-bottom:28px; border-bottom:1px solid rgba(255,255,255,.12); }
    footer h2, footer h3 { color:#fff; margin:0 0 12px; }
    footer p { margin:0 0 10px; color:#c5cfda; }
    footer a { color:#fff; text-decoration:none; }
    .footer-bottom { display:flex; justify-content:space-between; gap:16px; flex-wrap:wrap; padding-top:18px; font-size:13px; color:#9da9b6; }
    @media (max-width:1040px) {
      .hero-grid,.split,.contact-grid,.footer-grid { grid-template-columns:1fr; }
      .hero-grid { min-height:auto; }
      .services-grid,.pricing-grid,.reviews { grid-template-columns:repeat(2,1fr); }
      .gallery-grid { grid-template-columns:1fr 1fr; }
    }
    @media (max-width:760px) {
      .wrap { width:min(100% - 28px,1180px); }
      .nav-inner { min-height:auto; padding:14px 0; align-items:flex-start; }
      .nav-links { display:none; }
      .hero-grid { padding:48px 0; gap:30px; }
      .hero-proof,.services-grid,.pricing-grid,.reviews,.gallery-grid { grid-template-columns:1fr; }
      .hero-visual { min-height:420px; }
      .hero-photo { inset:26px 26px 148px; }
      .hero-photo:after { font-size:40px; }
      .mini-gallery { left:26px; right:26px; bottom:26px; }
      .mini-gallery span { min-height:74px; padding:10px; font-size:13px; }
      .section-head { display:block; }
      .section-head p { margin-top:12px; }
      section { padding:58px 0; }
      .gallery-card:first-child { grid-row:auto; }
      .gallery-card { min-height:230px; }
      .hours li { display:block; }
      .hours span { display:block; text-align:left; margin-top:4px; }
    }
  </style>
</head>
<body>
  <div class="demo-bar">
    <div class="wrap">
      <span>Demo concept only - created as an example website proposal.</span>
      <span>Example pricing - to be confirmed by the business.</span>
    </div>
  </div>

  <nav>
    <div class="wrap nav-inner">
      <a class="brand" href="#"><span class="mark">${esc(b.initials)}</span><span>${esc(b.name)}</span></a>
      <div class="nav-links">
        <a href="#services">Services</a>
        <a href="#pricing">Pricing</a>
        <a href="#hours">Hours</a>
        <a href="#reviews">Reviews</a>
        <a href="#contact">Contact</a>
        <a class="btn dark" href="tel:${esc(tel(b.phone))}">Call ${esc(b.phone)}</a>
      </div>
    </div>
  </nav>

  <header class="hero">
    <div class="wrap hero-grid">
      <div>
        <span class="kicker">${esc(b.kicker)}</span>
        <h1>${esc(b.headline)}</h1>
        <p class="hero-copy">${esc(b.subline)}</p>
        <div class="hero-actions">
          <a class="btn primary" href="#contact">Book or enquire</a>
          <a class="btn light" href="#services">Explore services</a>
        </div>
        <div class="hero-proof">
          <div class="proof-card"><strong>Local</strong><span>${esc(b.location)}</span></div>
          <div class="proof-card"><strong>Direct</strong><span>Call ${esc(b.phone)} for bookings and enquiries.</span></div>
          <div class="proof-card"><strong>Trusted</strong><span>Clear services, practical pricing guidance and customer-first contact.</span></div>
        </div>
      </div>
      <div class="hero-visual" aria-label="${esc(b.name)} visual gallery">
        <div class="hero-photo"></div>
        <div class="mini-gallery">
          <span>${esc(b.visual[1])}</span>
          <span>${esc(b.visual[2])}</span>
          <span>${esc(b.visual[3])}</span>
        </div>
      </div>
    </div>
  </header>

  <main>
    <section id="services" class="band">
      <div class="wrap">
        <div class="section-head">
          <h2>Services for local customers who want things made simple.</h2>
          <p>Clear choices, helpful detail and a straightforward route from browsing to booking.</p>
        </div>
        <div class="services-grid">${serviceCards}
        </div>
      </div>
    </section>

    <section>
      <div class="wrap split">
        <div class="dark-panel" id="hours">
          <h2>Opening hours and easy contact.</h2>
          <p>Customers should be able to check availability, call quickly and understand when to visit without searching through listings.</p>
          <ul class="hours">${hours}</ul>
        </div>
        <div class="gallery-grid">${galleryCards}
        </div>
      </div>
    </section>

    <section id="pricing" class="band">
      <div class="wrap">
        <div class="section-head">
          <h2>${esc(b.menuTitle)} with clear price guidance.</h2>
          <p>Simple pricing cards reduce uncertainty and help customers choose the right next step before they call.</p>
        </div>
        <div class="pricing-grid">${pricingCards}
        </div>
      </div>
    </section>

    <section id="reviews">
      <div class="wrap">
        <div class="section-head">
          <h2>Local trust, shown clearly.</h2>
          <p>Review cards give new customers confidence before they phone, visit or book.</p>
        </div>
        <div class="reviews">${reviews}
        </div>
      </div>
    </section>

    <section class="band">
      <div class="wrap contact-grid">
        <div class="contact-card" id="contact">
          <h2>Visit, call or send an enquiry.</h2>
          <p>Everything important is visible in one place: address, phone, email route, service area and a clear booking call to action.</p>
          <div class="contact-lines">
            <div><strong>Address</strong>${esc(b.location)}</div>
            <div><strong>Phone</strong><a href="tel:${esc(tel(b.phone))}">${esc(b.phone)}</a></div>
            <div><strong>Email</strong>${esc(b.email)}</div>
            <div><strong>Area served</strong>${esc(b.area)} and nearby local customers</div>
          </div>
          <a class="btn primary" href="tel:${esc(tel(b.phone))}">Call now</a>
        </div>
        <div class="faq-card">
          <h2>Questions customers ask.</h2>
          ${faqs}
        </div>
      </div>
    </section>
  </main>

  <footer>
    <div class="wrap footer-grid">
      <div>
        <h2>${esc(b.name)}</h2>
        <p>${esc(b.subline)}</p>
        <p>Demo concept only - created as an example website proposal.</p>
      </div>
      <div>
        <h3>Contact</h3>
        <p>${esc(b.location)}</p>
        <p><a href="tel:${esc(tel(b.phone))}">${esc(b.phone)}</a></p>
        <p>${esc(b.email)}</p>
      </div>
      <div>
        <h3>Popular services</h3>
        <p>${esc(b.services[0][0])}</p>
        <p>${esc(b.services[1][0])}</p>
        <p>${esc(b.services[2][0])}</p>
      </div>
    </div>
    <div class="wrap footer-bottom">
      <span>Example pricing - to be confirmed by the business.</span>
      <span>Placeholder reviews must be replaced with verified customer feedback.</span>
    </div>
  </footer>
</body>
</html>`;
}

for (const business of businesses) {
  const file = path.join(businessesDir, business.slug, "demo-homepage.html");
  fs.writeFileSync(file, render(business), "utf8");
}

console.log(`Enhanced ${businesses.length} demo homepages.`);
