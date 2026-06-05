const fs = require("fs");
const path = require("path");

const root = __dirname;
const businessesDir = path.join(root, "businesses");
const dashboardDir = path.join(root, "dashboard");

const businesses = [
  {
    slug: "de-milia-barber-brentwood",
    name: "De'Milia Barber",
    category: "Barber",
    location: "23a Ongar Road, Brentwood CM15 9AU",
    phone: "01277 200008",
    email: "Not found",
    website: "Public listing found: https://www.yell.com/biz/de-milia-barber-brentwood-5970121/",
    priority: "High",
    websiteStatus: "Listing-led web presence",
    seoScore: 46,
    demoQuality: "Premium rebuild",
    pricingIncluded: "Yes",
    readyForReview: "Yes",
    reason: "Local listing is doing too much of the sales work; a dedicated premium barber site could convert searches into bookings.",
    nextAction: "Review the demo homepage first, then confirm no owned website before manual outreach.",
    audience: "men looking for a sharp Brentwood barber, walk-ins, regular trims, skin fades, beard shaping, and tidy local booking",
    tone: "sharp, confident, premium, traditional barber craft with a modern booking journey",
    palette: ["#101820", "#c89b3c", "#f4efe6", "#ffffff"],
    accent: "#c89b3c",
    dark: "#101820",
    light: "#f4efe6",
    services: ["Skin fades and modern cuts", "Classic barber cuts", "Beard trims and shaping", "Walk-in and appointment booking", "Local grooming packages"],
    pricing: [
      ["Classic cut", "&pound;18-24"],
      ["Skin fade", "&pound;24-30"],
      ["Cut and beard shape", "&pound;30-38"]
    ],
    trustSignals: ["Brentwood high street location", "Phone booking visible", "Local barber services", "Opening-hour-led customer journey"],
    testimonials: [
      "Sharp cut, friendly service, and easy to book.",
      "Exactly the sort of Brentwood barber I would go back to.",
      "Clean finish and good attention to detail."
    ],
    heroLine: "A premium local barber website concept built to turn Brentwood searches into booked chairs.",
    visualWords: ["Fade", "Cut", "Beard", "Book"]
  },
  {
    slug: "shenfield-vehicle-services-shenfield",
    name: "Shenfield Vehicle Services",
    category: "Mechanic / MOT / vehicle services",
    location: "17A Hutton Road, Shenfield, Brentwood CM15 8JU",
    phone: "01277 218686",
    email: "shenfieldvehicleservices@tesco.net",
    website: "https://www.shenfield-vehicleservices.co.uk/contact",
    priority: "Medium",
    websiteStatus: "Dedicated site appears dated/basic",
    seoScore: 53,
    demoQuality: "Premium rebuild",
    pricingIncluded: "Yes",
    readyForReview: "Yes",
    reason: "A clearer MOT and repairs journey could increase phone calls and quote requests from Shenfield drivers.",
    nextAction: "Review the demo and compare it against the live contact journey before manual outreach.",
    audience: "local drivers needing MOT, servicing, repairs, diagnostics, and trustworthy garage support near Shenfield",
    tone: "reliable, practical, clean, expert, conversion-focused",
    palette: ["#17212b", "#f2b705", "#eef3f7", "#ffffff"],
    accent: "#f2b705",
    dark: "#17212b",
    light: "#eef3f7",
    services: ["MOT preparation and repairs", "Full and interim servicing", "Diagnostics", "Brakes and tyres", "Local collection enquiries"],
    pricing: [
      ["Interim service", "&pound;120-180"],
      ["Full service", "&pound;220-320"],
      ["Diagnostic check", "&pound;55-90"]
    ],
    trustSignals: ["Local Shenfield address", "Direct phone and email", "Garage service focus", "Contact form opportunity"],
    testimonials: [
      "Straightforward advice and clear pricing.",
      "Quick diagnosis and a professional service.",
      "Convenient local garage for Shenfield and Brentwood."
    ],
    heroLine: "A professional garage homepage concept designed to make MOT, service, and repair enquiries simpler.",
    visualWords: ["MOT", "Service", "Diagnostics", "Repair"]
  },
  {
    slug: "the-garage-group-essex-brentwood",
    name: "The Garage Group Essex",
    category: "Mechanic / garage / MOT / diagnostics",
    location: "The Old Stable Yard, Sandpit Lane, Brentwood CM14 5QD",
    phone: "01277 402382",
    email: "enquiries@thegaragegroupessex.co.uk",
    website: "https://www.thegaragegroupessex.co.uk/contact-us.html",
    priority: "Medium",
    websiteStatus: "Dedicated site with dated contact journey",
    seoScore: 56,
    demoQuality: "Premium rebuild",
    pricingIncluded: "Yes",
    readyForReview: "Yes",
    reason: "A Brentwood-focused service page and stronger booking CTA could make the garage feel more premium and easier to contact.",
    nextAction: "Inspect service pages, then use the premium demo as a comparison point for manual outreach.",
    audience: "Brentwood motorists looking for MOT, diagnostics, repairs, tyres, air con, and dependable workshop support",
    tone: "established, capable, technical, local, reassuring",
    palette: ["#111827", "#2dd4bf", "#f5f7fb", "#ffffff"],
    accent: "#2dd4bf",
    dark: "#111827",
    light: "#f5f7fb",
    services: ["MOT and servicing", "Advanced diagnostics", "Brakes, tyres and exhausts", "Air conditioning support", "Fleet and trade enquiries"],
    pricing: [
      ["MOT support", "&pound;54.85 statutory MOT test plus repairs if needed"],
      ["Diagnostic inspection", "&pound;65-110"],
      ["Service package", "&pound;180-350"]
    ],
    trustSignals: ["Brentwood workshop location", "Direct office contact", "Multiple service routes", "Established garage category"],
    testimonials: [
      "Clear communication and professional workmanship.",
      "A capable local garage with useful service options.",
      "Easy to contact and helpful from first call."
    ],
    heroLine: "A high-trust garage website concept for Brentwood drivers who want quick clarity and easy booking.",
    visualWords: ["Garage", "MOT", "Tyres", "Fleet"]
  },
  {
    slug: "the-orchard-cafe-brentwood",
    name: "The Orchard Cafe",
    category: "Cafe",
    location: "114 Orchard Ave, Brentwood CM13 2DP",
    phone: "01277 215030",
    email: "Not found",
    website: "No dedicated website found. Public listing used: https://mappcouk.com/the-orchard-caf-i1257613.html",
    priority: "High",
    websiteStatus: "No dedicated website found",
    seoScore: 35,
    demoQuality: "Premium rebuild",
    pricingIncluded: "Yes",
    readyForReview: "Yes",
    reason: "A dedicated cafe homepage could capture local searches, opening hours, menus, breakfast enquiries, and phone calls.",
    nextAction: "Review this demo first, then verify current social presence before manual outreach.",
    audience: "Brentwood locals looking for breakfast, lunch, coffee, takeaway, opening hours, and a welcoming neighbourhood cafe",
    tone: "warm, fresh, local, bright, appetising, easy to scan",
    palette: ["#223127", "#d98f45", "#f7f1e6", "#ffffff"],
    accent: "#d98f45",
    dark: "#223127",
    light: "#f7f1e6",
    services: ["Breakfast and brunch", "Coffee and hot drinks", "Lunch plates and sandwiches", "Takeaway orders", "Local cafe catering enquiries"],
    pricing: [
      ["Breakfast plate", "&pound;8-12"],
      ["Coffee and pastry", "&pound;5-7"],
      ["Lunch special", "&pound;9-14"]
    ],
    trustSignals: ["Neighbourhood Brentwood location", "Phone number visible", "Opening hours opportunity", "Local review snippets available"],
    testimonials: [
      "Friendly local cafe with a proper neighbourhood feel.",
      "Great breakfast stop and easy to find.",
      "Warm service, good coffee, and relaxed atmosphere."
    ],
    heroLine: "A polished local cafe website concept built to show the menu, opening hours, and a clear call-to-visit.",
    visualWords: ["Coffee", "Brunch", "Lunch", "Visit"]
  },
  {
    slug: "wagnificent-dog-groomers-brentwood",
    name: "Wagnificent Dog Groomers",
    category: "Dog groomer",
    location: "54 Hutton Road, Brentwood CM15 8LB",
    phone: "07935 544063",
    email: "Not found",
    website: "www.wagnificentgroomers.co.uk",
    priority: "Medium",
    websiteStatus: "Website listed; needs mobile review",
    seoScore: 55,
    demoQuality: "Premium rebuild",
    pricingIncluded: "Yes",
    readyForReview: "Yes",
    reason: "A more polished mobile booking journey could turn grooming searches into WhatsApp, call, or booking enquiries.",
    nextAction: "Review the live mobile experience, then compare against this premium demo before manual outreach.",
    audience: "Brentwood pet owners looking for dog grooming, puppy grooms, tidy trims, bath packages, and trusted local care",
    tone: "friendly, premium, caring, clean, boutique grooming studio",
    palette: ["#25313d", "#e7a7a0", "#f7f4ef", "#ffffff"],
    accent: "#e7a7a0",
    dark: "#25313d",
    light: "#f7f4ef",
    services: ["Full groom packages", "Bath and blow dry", "Puppy introduction groom", "Deshedding and coat care", "Nail trims and tidy ups"],
    pricing: [
      ["Small dog full groom", "&pound;45-60"],
      ["Medium dog full groom", "&pound;55-75"],
      ["Bath and brush", "&pound;30-50"]
    ],
    trustSignals: ["Local Brentwood studio", "Mobile number visible", "Grooming website listed", "Review-led trust opportunity"],
    testimonials: [
      "Gentle, calm, and our dog looked brilliant.",
      "Lovely local grooming service with clear care.",
      "Easy to contact and professional from start to finish."
    ],
    heroLine: "A boutique grooming website concept made to showcase care, trust, pricing guidance, and booking.",
    visualWords: ["Groom", "Bath", "Puppy", "Book"]
  }
];

function esc(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content.trimStart(), "utf8");
}

function pageShell(b, title, eyebrow, body) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)} | ${esc(b.name)}</title>
  <style>
    :root { --dark:${b.dark}; --accent:${b.accent}; --paper:#ffffff; --soft:${b.light}; --ink:#17202a; --muted:#637083; --line:#dfe6ee; }
    * { box-sizing:border-box; }
    body { margin:0; font-family:Inter, Arial, sans-serif; background:linear-gradient(180deg,var(--soft),#fff 42%); color:var(--ink); line-height:1.55; }
    a { color:inherit; }
    .wrap { max-width:1120px; margin:0 auto; padding:0 22px; }
    header { background:radial-gradient(circle at 75% 10%, color-mix(in srgb, var(--accent) 34%, transparent), transparent 32%), linear-gradient(135deg,var(--dark),#263645); color:#fff; padding:34px 0 30px; }
    .top { display:flex; justify-content:space-between; gap:16px; align-items:center; flex-wrap:wrap; }
    .crumb { color:#dbe6ef; text-decoration:none; font-size:14px; }
    .badge { display:inline-flex; align-items:center; border:1px solid rgba(255,255,255,.25); border-radius:999px; padding:7px 12px; color:#fff; background:rgba(255,255,255,.1); font-size:13px; }
    h1 { margin:26px 0 10px; font-size:clamp(34px,6vw,64px); line-height:1; letter-spacing:0; }
    .lede { max-width:780px; color:#dbe6ef; font-size:18px; margin:0; }
    main { padding:28px 0 54px; }
    .grid { display:grid; grid-template-columns:1.1fr .9fr; gap:22px; align-items:start; }
    .card, .panel { background:rgba(255,255,255,.94); border:1px solid var(--line); border-radius:8px; box-shadow:0 18px 45px rgba(15,23,42,.07); padding:22px; }
    .panel { box-shadow:none; }
    h2 { margin:0 0 14px; font-size:24px; color:#111827; }
    h3 { margin:18px 0 8px; font-size:18px; }
    p { margin:0 0 12px; }
    ul { margin:0; padding-left:20px; }
    li { margin:7px 0; }
    .meta { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:12px; margin-top:18px; }
    .metric { border:1px solid var(--line); border-radius:8px; padding:14px; background:#fbfdff; }
    .metric strong { display:block; font-size:13px; color:var(--muted); margin-bottom:4px; }
    .score { font-size:34px; font-weight:800; color:var(--dark); }
    .pill { display:inline-flex; border-radius:999px; padding:6px 10px; background:color-mix(in srgb,var(--accent) 17%,#fff); color:var(--dark); font-weight:800; font-size:12px; }
    .actions { display:flex; flex-wrap:wrap; gap:10px; margin-top:20px; }
    .btn { display:inline-flex; text-decoration:none; border:1px solid var(--line); border-radius:8px; padding:10px 13px; background:#fff; font-weight:800; color:#17202a; }
    .btn.primary { background:var(--accent); border-color:var(--accent); color:var(--dark); }
    table { width:100%; border-collapse:collapse; overflow:hidden; border-radius:8px; }
    th, td { text-align:left; border-bottom:1px solid var(--line); padding:12px; vertical-align:top; }
    th { background:#f8fafc; color:#445064; font-size:13px; }
    .note { border-left:4px solid var(--accent); padding:12px 14px; background:#fffaf0; border-radius:0 8px 8px 0; }
    @media (max-width:820px) { .grid,.meta { grid-template-columns:1fr; } header { padding-top:24px; } }
  </style>
</head>
<body>
  <header>
    <div class="wrap">
      <div class="top">
        <a class="crumb" href="../../dashboard/index.html">Back to dashboard</a>
        <span class="badge">${esc(eyebrow)}</span>
      </div>
      <h1>${esc(title)}</h1>
      <p class="lede">${esc(b.reason)}</p>
    </div>
  </header>
  <main class="wrap">${body}</main>
</body>
</html>`;
}

function profilePage(b) {
  return pageShell(b, "Business Profile", `${b.priority} priority prospect`, `
    <section class="grid">
      <article class="card">
        <h2>${esc(b.name)}</h2>
        <p><strong>Category:</strong> ${esc(b.category)}</p>
        <p><strong>Location:</strong> ${esc(b.location)}</p>
        <p><strong>Website/source:</strong> ${esc(b.website)}</p>
        <p><strong>Phone:</strong> ${esc(b.phone)}</p>
        <p><strong>Email:</strong> ${esc(b.email)}</p>
        <p><strong>Lead status:</strong> New prospect. No outreach has been sent automatically.</p>
        <div class="note">This page is an internal prospect profile for review before any manual outreach. Public contact details should be rechecked before use.</div>
      </article>
      <aside class="panel">
        <h2>Prospect Snapshot</h2>
        <div class="meta">
          <div class="metric"><strong>Priority</strong><span class="pill">${esc(b.priority)}</span></div>
          <div class="metric"><strong>SEO score</strong><span class="score">${b.seoScore}</span>/100</div>
          <div class="metric"><strong>Website status</strong>${esc(b.websiteStatus)}</div>
          <div class="metric"><strong>Ready for review</strong>${esc(b.readyForReview)}</div>
        </div>
        <h3>Reason to Contact</h3>
        <p>${esc(b.reason)}</p>
        <h3>Next Action</h3>
        <p>${esc(b.nextAction)}</p>
      </aside>
    </section>
    <div class="actions">
      <a class="btn primary" href="demo-homepage.html">Open demo homepage</a>
      <a class="btn" href="website-audit.html">Website audit</a>
      <a class="btn" href="seo-audit.html">SEO audit</a>
      <a class="btn" href="outreach-email.html">Outreach email</a>
    </div>`);
}

function websiteAuditPage(b) {
  const issues = [
    "The current web journey relies too heavily on listings or dated pages, so the business does not fully control the first impression.",
    "The contact route should be clearer above the fold with phone, booking, and location information visible immediately.",
    "Service pages should be structured around local searches and customer intent rather than only listing generic details.",
    "Mobile users need faster scanning, stronger trust cues, and less friction before contacting the business."
  ];
  return pageShell(b, "Website Audit", "Conversion and trust review", `
    <section class="grid">
      <article class="card">
        <h2>Audit Summary</h2>
        <p>${esc(b.name)} has a clear local offer, but the current digital journey leaves room for a more polished commercial presentation.</p>
        <h3>Key Website Gaps</h3>
        <ul>${issues.map(i => `<li>${esc(i)}</li>`).join("")}</ul>
        <h3>Recommended Upgrade</h3>
        <p>Create a premium, mobile-first homepage with a strong hero, services, local proof, pricing guidance, reviews, and a direct contact CTA.</p>
      </article>
      <aside class="panel">
        <h2>Commercial Opportunity</h2>
        <table>
          <tr><th>Area</th><th>Finding</th></tr>
          <tr><td>First impression</td><td>${esc(b.websiteStatus)}</td></tr>
          <tr><td>Trust</td><td>Needs visible proof points, local reassurance, and clearer service confidence.</td></tr>
          <tr><td>Conversion</td><td>Phone and booking calls to action should be repeated across the page.</td></tr>
          <tr><td>Local SEO</td><td>Needs Brentwood/Shenfield wording aligned with services and location.</td></tr>
        </table>
      </aside>
    </section>
    <div class="actions"><a class="btn primary" href="demo-homepage.html">Review proposed homepage</a><a class="btn" href="seo-audit.html">Open SEO audit</a></div>`);
}

function seoAuditPage(b) {
  return pageShell(b, "SEO Audit", `${b.seoScore}/100 estimated SEO score`, `
    <section class="grid">
      <article class="card">
        <h2>Estimated Local SEO Position</h2>
        <p><span class="score">${b.seoScore}</span>/100</p>
        <p>This is an internal estimate based on the available prospect notes, not a full live technical crawl.</p>
        <h3>Recommended Keyword Themes</h3>
        <ul>
          <li>${esc(b.category)} in Brentwood</li>
          <li>${esc(b.category)} near ${esc(b.location.split(",")[0])}</li>
          <li>${esc(b.services[0])}</li>
          <li>${esc(b.services[1])}</li>
        </ul>
        <h3>On-page Improvements</h3>
        <ul>
          <li>Use one clear H1 focused on the core local service.</li>
          <li>Add service sections with customer-focused copy and internal anchor links.</li>
          <li>Include location, opening hours, phone, and trust signals near calls to action.</li>
          <li>Add FAQ content targeting practical local search queries.</li>
        </ul>
      </article>
      <aside class="panel">
        <h2>SEO Action Plan</h2>
        <table>
          <tr><th>Priority</th><th>Action</th></tr>
          <tr><td>High</td><td>Build a polished local homepage with service-led headings.</td></tr>
          <tr><td>High</td><td>Add schema-friendly contact, address, and opening information.</td></tr>
          <tr><td>Medium</td><td>Create supporting service pages after the homepage is approved.</td></tr>
          <tr><td>Medium</td><td>Improve image alt text, metadata, and internal linking.</td></tr>
        </table>
      </aside>
    </section>
    <div class="actions"><a class="btn primary" href="demo-homepage.html">Open SEO-led demo</a><a class="btn" href="business-profile.html">Business profile</a></div>`);
}

function outreachPage(b) {
  return pageShell(b, "Outreach Email", "Draft only - do not send automatically", `
    <section class="grid">
      <article class="card">
        <h2>Manual Outreach Draft</h2>
        <p><strong>Subject:</strong> Website idea for ${esc(b.name)}</p>
        <p>Hi ${esc(b.name)} team,</p>
        <p>I was looking at local ${esc(b.category.toLowerCase())} businesses around Brentwood and noticed there may be an opportunity to make your website journey clearer and more conversion-focused.</p>
        <p>I put together a polished demo homepage concept showing how your services, pricing guidance, trust signals, and booking/contact options could be presented in a more premium way.</p>
        <p>The pricing shown in the demo is example pricing only and would need confirming by the business.</p>
        <p>If useful, I can send over the concept for review. No pressure either way.</p>
        <p>Kind regards,<br>Shane</p>
        <div class="note">Do not send automatically. Recheck public contact details and tailor the message manually before any outreach.</div>
      </article>
      <aside class="panel">
        <h2>Personalisation Points</h2>
        <ul>
          <li>Reference the business category: ${esc(b.category)}.</li>
          <li>Reference the local area: ${esc(b.location)}.</li>
          <li>Lead with the demo homepage, not a generic website pitch.</li>
          <li>Avoid claiming live pricing or testimonials are real.</li>
        </ul>
      </aside>
    </section>
    <div class="actions"><a class="btn primary" href="demo-homepage.html">Open demo to attach/review</a><a class="btn" href="notes.html">Review notes</a></div>`);
}

function briefPage(b) {
  return pageShell(b, "Demo Website Brief", "Premium homepage proposal", `
    <section class="grid">
      <article class="card">
        <h2>Brief</h2>
        <p>Build a self-contained premium homepage concept for ${esc(b.name)} that feels credible enough to show to a local business owner as a &pound;1,000 website proposal.</p>
        <h3>Design Direction</h3>
        <p>${esc(b.tone)}.</p>
        <h3>Audience</h3>
        <p>${esc(b.audience)}.</p>
        <h3>Required Homepage Sections</h3>
        <ul>
          <li>Premium hero with local positioning and clear CTA.</li>
          <li>Services, example pricing, why choose us, trust signals, testimonials marked as placeholders, and contact CTA.</li>
          <li>Local SEO wording for Brentwood/Shenfield searches.</li>
          <li>Responsive, self-contained HTML and CSS.</li>
        </ul>
      </article>
      <aside class="panel">
        <h2>Acceptance Criteria</h2>
        <ul>
          <li>Looks polished and commercial.</li>
          <li>Does not look like a wireframe.</li>
          <li>Includes pricing with the confirmation disclaimer.</li>
          <li>Uses premium CSS visual panels if no AI images are available.</li>
          <li>Demo homepage is over 15,000 bytes.</li>
        </ul>
      </aside>
    </section>
    <div class="actions"><a class="btn primary" href="demo-homepage.html">View final concept</a><a class="btn" href="status.html">Status</a></div>`);
}

function notesPage(b) {
  return pageShell(b, "Notes", "Internal working notes", `
    <section class="grid">
      <article class="card">
        <h2>Research Notes</h2>
        <ul>
          <li>Existing business folder preserved: ${esc(b.slug)}.</li>
          <li>No new business was created.</li>
          <li>No email has been sent.</li>
          <li>Pricing shown on the demo is example pricing only and must be confirmed by the business.</li>
          <li>Testimonials on the demo are explicitly marked as placeholders.</li>
        </ul>
        <h3>Positioning Angle</h3>
        <p>${esc(b.reason)}</p>
        <h3>Review Focus</h3>
        <p>${esc(b.nextAction)}</p>
      </article>
      <aside class="panel">
        <h2>Useful Links</h2>
        <div class="actions">
          <a class="btn primary" href="demo-homepage.html">Demo homepage</a>
          <a class="btn" href="business-profile.html">Profile</a>
          <a class="btn" href="website-audit.html">Website audit</a>
          <a class="btn" href="seo-audit.html">SEO audit</a>
        </div>
      </aside>
    </section>`);
}

function statusPage(b) {
  return pageShell(b, "Status", "Review readiness", `
    <section class="grid">
      <article class="card">
        <h2>Current Status</h2>
        <table>
          <tr><th>Item</th><th>Status</th></tr>
          <tr><td>Business profile HTML</td><td>Complete</td></tr>
          <tr><td>Website audit HTML</td><td>Complete</td></tr>
          <tr><td>SEO audit HTML</td><td>Complete</td></tr>
          <tr><td>Outreach email HTML</td><td>Draft only</td></tr>
          <tr><td>Demo website brief HTML</td><td>Complete</td></tr>
          <tr><td>Notes HTML</td><td>Complete</td></tr>
          <tr><td>Premium demo homepage</td><td>${esc(b.demoQuality)}</td></tr>
          <tr><td>Ready for review</td><td>${esc(b.readyForReview)}</td></tr>
        </table>
      </article>
      <aside class="panel">
        <h2>Next Action</h2>
        <p>${esc(b.nextAction)}</p>
        <p class="note">Manual approval is required before any external outreach.</p>
      </aside>
    </section>
    <div class="actions"><a class="btn primary" href="demo-homepage.html">Open demo homepage</a><a class="btn" href="../../dashboard/index.html">Dashboard</a></div>`);
}

function demoHomepage(b) {
  const pricingRows = b.pricing.map(([label, price]) => `<article class="price-card"><span>${esc(label)}</span><strong>${price}</strong><small>Example pricing - to be confirmed by the business.</small></article>`).join("");
  const services = b.services.map((s, i) => `<article class="service-card"><span>0${i + 1}</span><h3>${esc(s)}</h3><p>Designed as a clear, customer-friendly service block with benefit-led copy, local wording, and a direct route to enquire.</p></article>`).join("");
  const trust = b.trustSignals.map(t => `<li>${esc(t)}</li>`).join("");
  const testimonials = b.testimonials.map(t => `<figure><blockquote>"${esc(t)}"</blockquote><figcaption>Placeholder testimonial - replace with verified customer review.</figcaption></figure>`).join("");
  const words = b.visualWords.map(w => `<span>${esc(w)}</span>`).join("");
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(b.name)} | Premium Homepage Concept</title>
  <meta name="description" content="Premium demo homepage concept for ${esc(b.name)} in Brentwood.">
  <style>
    :root {
      --dark:${b.dark};
      --accent:${b.accent};
      --light:${b.light};
      --paper:#ffffff;
      --ink:#14202b;
      --muted:#657286;
      --line:#dce3ec;
      --shadow:0 24px 70px rgba(10,18,28,.16);
    }
    * { box-sizing:border-box; }
    html { scroll-behavior:smooth; }
    body { margin:0; font-family:Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif; color:var(--ink); background:var(--paper); line-height:1.5; }
    a { color:inherit; }
    .wrap { width:min(1180px, calc(100% - 40px)); margin:0 auto; }
    .notice { background:#111827; color:#fff; font-size:13px; padding:9px 0; }
    .notice .wrap { display:flex; justify-content:space-between; gap:12px; flex-wrap:wrap; color:#d7dee8; }
    nav { position:sticky; top:0; z-index:10; background:rgba(255,255,255,.92); backdrop-filter:blur(18px); border-bottom:1px solid rgba(220,227,236,.9); }
    .nav-inner { height:72px; display:flex; align-items:center; justify-content:space-between; gap:18px; }
    .brand { display:flex; align-items:center; gap:12px; font-weight:900; letter-spacing:0; text-decoration:none; color:var(--dark); }
    .mark { width:42px; height:42px; border-radius:8px; display:grid; place-items:center; background:linear-gradient(135deg,var(--dark), color-mix(in srgb,var(--accent) 42%,var(--dark))); color:#fff; box-shadow:0 12px 28px rgba(0,0,0,.18); font-weight:900; }
    .nav-links { display:flex; align-items:center; gap:18px; font-size:14px; color:#344256; }
    .nav-links a { text-decoration:none; font-weight:750; }
    .btn { display:inline-flex; align-items:center; justify-content:center; min-height:44px; padding:0 18px; border-radius:8px; border:1px solid transparent; text-decoration:none; font-weight:850; white-space:nowrap; }
    .btn.primary { background:var(--accent); color:var(--dark); box-shadow:0 12px 28px color-mix(in srgb,var(--accent) 30%,transparent); }
    .btn.dark { background:var(--dark); color:#fff; }
    .btn.ghost { border-color:rgba(255,255,255,.35); color:#fff; }
    .hero { position:relative; overflow:hidden; background:linear-gradient(135deg,var(--dark) 0%, color-mix(in srgb,var(--dark) 82%,#fff) 58%, color-mix(in srgb,var(--accent) 42%,var(--dark)) 100%); color:#fff; }
    .hero:before { content:""; position:absolute; inset:0; background:radial-gradient(circle at 72% 20%, color-mix(in srgb,var(--accent) 45%, transparent), transparent 25%), linear-gradient(90deg,rgba(0,0,0,.28),transparent 56%); pointer-events:none; }
    .hero-grid { position:relative; display:grid; grid-template-columns:minmax(0,1.02fr) minmax(340px,.78fr); gap:48px; align-items:center; min-height:calc(100vh - 110px); padding:72px 0 82px; }
    .kicker { display:inline-flex; border:1px solid rgba(255,255,255,.28); background:rgba(255,255,255,.1); color:#f4f7fb; padding:8px 12px; border-radius:999px; font-size:13px; font-weight:800; margin-bottom:20px; }
    h1 { margin:0; font-size:clamp(44px,7vw,82px); line-height:.96; letter-spacing:0; max-width:820px; }
    .hero p { color:#dfe7ef; font-size:clamp(17px,2vw,21px); max-width:710px; margin:22px 0 0; }
    .hero-actions { display:flex; gap:12px; flex-wrap:wrap; margin-top:30px; }
    .hero-proof { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; margin-top:34px; max-width:720px; }
    .proof-card { border:1px solid rgba(255,255,255,.2); border-radius:8px; padding:16px; background:rgba(255,255,255,.09); }
    .proof-card strong { display:block; color:#fff; font-size:19px; }
    .proof-card span { color:#cbd5df; font-size:13px; }
    .visual { position:relative; min-height:560px; border-radius:8px; overflow:hidden; background:linear-gradient(160deg,rgba(255,255,255,.2),rgba(255,255,255,.04)); border:1px solid rgba(255,255,255,.22); box-shadow:var(--shadow); }
    .visual:before { content:""; position:absolute; inset:24px; border:1px solid rgba(255,255,255,.25); border-radius:8px; }
    .visual-panel { position:absolute; left:38px; right:38px; top:42px; bottom:42px; display:grid; grid-template-rows:1fr auto; gap:18px; }
    .mock-photo { border-radius:8px; background:linear-gradient(135deg, color-mix(in srgb,var(--accent) 58%,#fff), color-mix(in srgb,var(--dark) 86%,#000)); position:relative; overflow:hidden; min-height:330px; }
    .mock-photo:before { content:""; position:absolute; inset:0; background:repeating-linear-gradient(135deg, rgba(255,255,255,.14) 0 2px, transparent 2px 22px); opacity:.55; }
    .mock-photo:after { content:"${esc(b.visualWords[0])}"; position:absolute; left:28px; bottom:24px; color:#fff; font-size:58px; font-weight:950; letter-spacing:0; opacity:.92; }
    .visual-tags { display:grid; grid-template-columns:repeat(2,1fr); gap:12px; }
    .visual-tags span { padding:18px; border-radius:8px; background:rgba(255,255,255,.9); color:var(--dark); font-weight:900; box-shadow:0 14px 30px rgba(0,0,0,.13); }
    section { padding:82px 0; }
    .section-head { display:flex; justify-content:space-between; gap:22px; align-items:end; margin-bottom:34px; }
    .section-head h2 { margin:0; font-size:clamp(32px,4vw,54px); line-height:1.02; color:var(--dark); }
    .section-head p { max-width:560px; color:var(--muted); margin:0; font-size:17px; }
    .band { background:var(--light); }
    .services-grid { display:grid; grid-template-columns:repeat(5,1fr); gap:14px; }
    .service-card { background:#fff; border:1px solid var(--line); border-radius:8px; padding:22px; min-height:260px; box-shadow:0 14px 36px rgba(15,23,42,.06); }
    .service-card span { display:inline-flex; color:var(--accent); font-weight:950; margin-bottom:20px; }
    .service-card h3 { margin:0 0 12px; color:var(--dark); font-size:21px; }
    .service-card p { margin:0; color:var(--muted); }
    .feature-grid { display:grid; grid-template-columns:1fr 1fr; gap:22px; align-items:stretch; }
    .feature-panel { border-radius:8px; padding:34px; background:var(--dark); color:#fff; position:relative; overflow:hidden; min-height:420px; }
    .feature-panel:after { content:""; position:absolute; width:260px; height:260px; right:-80px; bottom:-80px; background:var(--accent); opacity:.35; border-radius:50%; }
    .feature-panel h2 { margin:0 0 16px; font-size:42px; line-height:1.04; }
    .feature-panel p { color:#d8e1ea; max-width:560px; }
    .trust-list { display:grid; gap:12px; margin:26px 0 0; padding:0; list-style:none; }
    .trust-list li { border:1px solid rgba(255,255,255,.2); border-radius:8px; padding:14px 16px; background:rgba(255,255,255,.08); position:relative; z-index:1; }
    .why-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:14px; }
    .why-card { padding:26px; border:1px solid var(--line); border-radius:8px; background:#fff; min-height:200px; }
    .why-card strong { color:var(--dark); font-size:20px; display:block; margin-bottom:8px; }
    .why-card p { color:var(--muted); margin:0; }
    .pricing { display:grid; grid-template-columns:repeat(3,1fr); gap:18px; }
    .price-card { background:#fff; border:1px solid var(--line); border-radius:8px; padding:28px; box-shadow:0 14px 34px rgba(15,23,42,.07); }
    .price-card span { display:block; color:var(--muted); font-weight:850; margin-bottom:8px; }
    .price-card strong { display:block; color:var(--dark); font-size:34px; line-height:1.05; }
    .price-card small { display:block; margin-top:14px; color:#7b8796; }
    .seo-strip { background:linear-gradient(135deg,var(--dark), color-mix(in srgb,var(--dark) 80%,var(--accent))); color:#fff; border-radius:8px; padding:36px; display:grid; grid-template-columns:1fr 1fr; gap:26px; align-items:center; }
    .seo-strip h2 { margin:0; font-size:38px; line-height:1.04; }
    .seo-strip p { margin:0; color:#d9e3ed; font-size:17px; }
    .testimonials { display:grid; grid-template-columns:repeat(3,1fr); gap:18px; }
    figure { margin:0; border:1px solid var(--line); border-radius:8px; padding:24px; background:#fff; box-shadow:0 14px 34px rgba(15,23,42,.06); }
    blockquote { margin:0 0 18px; color:var(--dark); font-size:20px; line-height:1.35; font-weight:800; }
    figcaption { color:var(--muted); font-size:13px; }
    .cta { background:var(--dark); color:#fff; padding:76px 0; }
    .cta-box { display:grid; grid-template-columns:1fr auto; gap:28px; align-items:center; }
    .cta h2 { margin:0 0 12px; font-size:clamp(34px,5vw,58px); line-height:1.02; }
    .cta p { margin:0; color:#d9e3ed; max-width:760px; font-size:18px; }
    .contact-card { background:#fff; color:var(--ink); border-radius:8px; padding:22px; min-width:280px; }
    .contact-card strong { display:block; color:var(--dark); }
    footer { padding:28px 0; background:#0c1117; color:#b8c3cf; font-size:13px; }
    footer .wrap { display:flex; justify-content:space-between; gap:16px; flex-wrap:wrap; }
    @media (max-width:1040px) {
      .hero-grid,.feature-grid,.seo-strip,.cta-box { grid-template-columns:1fr; }
      .visual { min-height:460px; }
      .services-grid { grid-template-columns:repeat(2,1fr); }
    }
    @media (max-width:760px) {
      .wrap { width:min(100% - 28px, 1180px); }
      .nav-inner { height:auto; padding:14px 0; align-items:flex-start; }
      .nav-links { display:none; }
      .hero-grid { min-height:auto; padding:48px 0; gap:28px; }
      .hero-proof,.pricing,.testimonials,.services-grid,.why-grid { grid-template-columns:1fr; }
      .section-head { display:block; }
      .section-head p { margin-top:12px; }
      section { padding:58px 0; }
      .feature-panel { padding:24px; min-height:auto; }
      .visual { min-height:360px; }
      .visual-panel { inset:24px; }
      .mock-photo:after { font-size:42px; }
    }
  </style>
</head>
<body>
  <div class="notice">
    <div class="wrap">
      <span>Premium demo concept for ${esc(b.name)} - not the live business website.</span>
      <span>Pricing and testimonials are examples only until confirmed.</span>
    </div>
  </div>
  <nav>
    <div class="wrap nav-inner">
      <a class="brand" href="#"><span class="mark">${esc(b.name.split(" ").map(w => w[0]).join("").slice(0,2))}</span><span>${esc(b.name)}</span></a>
      <div class="nav-links">
        <a href="#services">Services</a>
        <a href="#pricing">Pricing</a>
        <a href="#why">Why us</a>
        <a href="#contact">Contact</a>
        <a class="btn dark" href="tel:${esc(b.phone.replace(/\\s+/g, ""))}">Call ${esc(b.phone)}</a>
      </div>
    </div>
  </nav>
  <header class="hero">
    <div class="wrap hero-grid">
      <div>
        <span class="kicker">${esc(b.category)} in Brentwood</span>
        <h1>${esc(b.heroLine)}</h1>
        <p>${esc(b.name)} can use a stronger homepage to show services, build trust quickly, guide customers towards booking, and capture more ${esc(b.category.toLowerCase())} searches around Brentwood and Shenfield.</p>
        <div class="hero-actions">
          <a class="btn primary" href="#contact">Book or enquire</a>
          <a class="btn ghost" href="#services">View services</a>
        </div>
        <div class="hero-proof">
          <div class="proof-card"><strong>Local</strong><span>${esc(b.location)}</span></div>
          <div class="proof-card"><strong>Clear CTA</strong><span>Phone, booking and enquiry routes.</span></div>
          <div class="proof-card"><strong>SEO-led</strong><span>Built around Brentwood search intent.</span></div>
        </div>
      </div>
      <div class="visual" aria-label="Premium visual website panel">
        <div class="visual-panel">
          <div class="mock-photo"></div>
          <div class="visual-tags">${words}</div>
        </div>
      </div>
    </div>
  </header>
  <main>
    <section id="services" class="band">
      <div class="wrap">
        <div class="section-head">
          <h2>Services that are easy to scan and easy to buy.</h2>
          <p>A premium homepage should turn casual visitors into action-takers by making the main services obvious, confidence-building, and locally relevant.</p>
        </div>
        <div class="services-grid">${services}</div>
      </div>
    </section>
    <section id="why">
      <div class="wrap feature-grid">
        <div class="feature-panel">
          <h2>Built for local trust before the customer ever calls.</h2>
          <p>This concept replaces a basic or listing-led journey with a controlled, polished first impression. It shows the business as established, helpful, and worth contacting.</p>
          <ul class="trust-list">${trust}</ul>
        </div>
        <div class="why-grid">
          <article class="why-card"><strong>Fast decision-making</strong><p>Visitors can see what is offered, where the business is based, what to expect, and how to enquire without hunting around.</p></article>
          <article class="why-card"><strong>Premium positioning</strong><p>The layout uses stronger typography, better spacing, service cards, trust blocks, and a sales-led contact flow.</p></article>
          <article class="why-card"><strong>Mobile-first contact</strong><p>Calls to action are repeated so mobile visitors can phone, book, or request details as soon as they are ready.</p></article>
          <article class="why-card"><strong>Local SEO structure</strong><p>Brentwood and nearby location wording is woven into headings and copy to support relevant local discovery.</p></article>
        </div>
      </div>
    </section>
    <section id="pricing" class="band">
      <div class="wrap">
        <div class="section-head">
          <h2>Example pricing that removes uncertainty.</h2>
          <p>Transparent pricing guidance helps customers qualify themselves before calling. Every figure below is a placeholder and must be confirmed by the business.</p>
        </div>
        <div class="pricing">${pricingRows}</div>
      </div>
    </section>
    <section>
      <div class="wrap">
        <div class="seo-strip">
          <h2>Local SEO wording for Brentwood, Shenfield, and nearby searches.</h2>
          <p>${esc(b.name)} should be discoverable for "${esc(b.category)} Brentwood", service-specific searches, local opening-hour searches, and customers looking for a trustworthy provider near ${esc(b.location.split(",")[0])}. This demo uses natural local phrasing without stuffing keywords.</p>
        </div>
      </div>
    </section>
    <section class="band">
      <div class="wrap">
        <div class="section-head">
          <h2>Placeholder testimonials for the finished review section.</h2>
          <p>These examples show the intended layout only. They must be replaced with verified customer reviews before launch.</p>
        </div>
        <div class="testimonials">${testimonials}</div>
      </div>
    </section>
  </main>
  <section id="contact" class="cta">
    <div class="wrap cta-box">
      <div>
        <h2>Ready to turn more local visitors into enquiries?</h2>
        <p>Call ${esc(b.phone)}, ask about availability, or use this section for an online booking form. This is where the finished website would push customers to take action.</p>
      </div>
      <div class="contact-card">
        <strong>${esc(b.name)}</strong>
        <p>${esc(b.location)}</p>
        <p><strong>Phone:</strong> ${esc(b.phone)}</p>
        <p><strong>Email:</strong> ${esc(b.email)}</p>
        <a class="btn primary" href="tel:${esc(b.phone.replace(/\\s+/g, ""))}">Call now</a>
      </div>
    </div>
  </section>
  <footer>
    <div class="wrap">
      <span>${esc(b.name)} premium homepage concept.</span>
      <span>Example pricing - to be confirmed by the business. Placeholder testimonials only.</span>
    </div>
  </footer>
</body>
</html>`;
}

function dashboard() {
  const rows = businesses.map(b => ({
    name: b.name,
    category: b.category,
    priority: b.priority,
    websiteStatus: b.websiteStatus,
    seoScore: b.seoScore,
    reason: b.reason,
    demoQuality: b.demoQuality,
    pricingIncluded: b.pricingIncluded,
    readyForReview: b.readyForReview,
    nextAction: b.nextAction,
    slug: b.slug
  }));
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Control Centre Prospect Dashboard</title>
  <style>
    :root { --bg:#f3f6fa; --panel:#ffffff; --ink:#16202a; --muted:#64748b; --line:#dbe3ee; --high:#a61b12; --high-bg:#ffe7e3; --medium:#835600; --medium-bg:#fff1c2; --accent:#1f6f8b; --ready:#087443; --ready-bg:#dcfce7; }
    * { box-sizing:border-box; }
    body { margin:0; font-family:Inter, Arial, sans-serif; background:var(--bg); color:var(--ink); }
    header { padding:34px 20px 22px; background:linear-gradient(135deg,#102331,#1f4157); color:white; }
    .wrap { max-width:1480px; margin:0 auto; }
    h1 { margin:0 0 8px; font-size:clamp(32px,5vw,58px); letter-spacing:0; }
    header p { margin:0; color:#c8d5df; max-width:900px; font-size:17px; }
    .toolbar { display:flex; gap:12px; flex-wrap:wrap; padding:16px 20px; background:white; border-bottom:1px solid var(--line); position:sticky; top:0; z-index:5; }
    input, select { min-height:44px; border:1px solid var(--line); border-radius:8px; padding:0 12px; font-size:15px; background:white; color:var(--ink); }
    input { min-width:min(100%, 420px); flex:1; }
    main { padding:24px 20px 46px; }
    .summary { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:18px; }
    .summary article { background:#fff; border:1px solid var(--line); border-radius:8px; padding:18px; box-shadow:0 10px 28px rgba(15,23,42,.05); }
    .summary span { display:block; color:var(--muted); font-size:13px; font-weight:800; }
    .summary strong { display:block; color:#111827; font-size:30px; margin-top:4px; }
    .table-wrap { overflow:auto; background:var(--panel); border:1px solid var(--line); border-radius:8px; box-shadow:0 12px 34px rgba(15,23,42,.07); }
    table { width:100%; border-collapse:collapse; min-width:1480px; }
    th, td { padding:13px 12px; border-bottom:1px solid var(--line); text-align:left; vertical-align:top; }
    th { font-size:13px; color:#334155; background:#f8fafc; cursor:pointer; user-select:none; white-space:nowrap; position:sticky; top:77px; z-index:2; }
    td { font-size:14px; color:#243344; }
    .business { font-weight:850; color:#0f172a; min-width:190px; }
    .badge { display:inline-flex; border-radius:999px; padding:5px 9px; font-size:12px; font-weight:850; white-space:nowrap; }
    .High { color:var(--high); background:var(--high-bg); }
    .Medium { color:var(--medium); background:var(--medium-bg); }
    .Yes { color:var(--ready); background:var(--ready-bg); }
    .score { font-weight:900; color:#111827; }
    .links { display:grid; grid-template-columns:repeat(4,max-content); gap:7px; min-width:470px; }
    .links a { color:var(--accent); text-decoration:none; border:1px solid var(--line); border-radius:8px; padding:7px 8px; background:#fbfdff; white-space:nowrap; font-weight:750; }
    .links a:hover { background:#eef7fb; }
    .empty { display:none; padding:28px; text-align:center; color:var(--muted); }
    footer { padding:18px 20px 34px; color:var(--muted); text-align:center; font-size:13px; }
    @media (max-width:900px) { .summary { grid-template-columns:repeat(2,1fr); } th { top:132px; } }
    @media (max-width:560px) { .summary { grid-template-columns:1fr; } }
  </style>
</head>
<body>
  <header>
    <div class="wrap">
      <h1>Prospect Dashboard</h1>
      <p>Five Brentwood/Shenfield website prospects with polished HTML audits, outreach drafts, status pages, and premium demo homepage concepts. No outreach has been sent automatically.</p>
    </div>
  </header>
  <div class="toolbar">
    <input id="search" type="search" placeholder="Search business, status, reason, next action">
    <select id="priority">
      <option value="">All priorities</option>
      <option value="High">High</option>
      <option value="Medium">Medium</option>
    </select>
  </div>
  <main class="wrap">
    <section class="summary">
      <article><span>Businesses</span><strong>5</strong></article>
      <article><span>Premium demos</span><strong>5</strong></article>
      <article><span>HTML files per business</span><strong>8</strong></article>
      <article><span>Ready for review</span><strong>5</strong></article>
    </section>
    <div class="table-wrap">
      <table id="prospects">
        <thead>
          <tr>
            <th data-key="name">Business</th>
            <th data-key="category">Category</th>
            <th data-key="priority">Priority</th>
            <th data-key="websiteStatus">Website Status</th>
            <th data-key="seoScore">SEO Score</th>
            <th data-key="reason">Reason to Contact</th>
            <th data-key="demoQuality">Demo Quality</th>
            <th data-key="pricingIncluded">Pricing Included</th>
            <th data-key="readyForReview">Ready for Review</th>
            <th data-key="nextAction">Next Action</th>
            <th>HTML Pages</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
      <div class="empty" id="empty">No matching prospects.</div>
    </div>
  </main>
  <footer>Dashboard generated inside Shane's OpenClaw control centre. Review manually before any outreach.</footer>
  <script>
    const rows = ${JSON.stringify(rows, null, 6)};
    const tbody = document.querySelector("tbody");
    const search = document.querySelector("#search");
    const priority = document.querySelector("#priority");
    const empty = document.querySelector("#empty");
    let sortKey = "priority";
    let sortDir = 1;
    function badge(value) {
      const safe = String(value).replace(/[^A-Za-z0-9_-]/g, "");
      return '<span class="badge ' + safe + '">' + value + '</span>';
    }
    function links(slug) {
      const base = '../businesses/' + slug + '/';
      const files = [
        ['Profile','business-profile.html'],
        ['Website audit','website-audit.html'],
        ['SEO audit','seo-audit.html'],
        ['Outreach','outreach-email.html'],
        ['Brief','demo-website-brief.html'],
        ['Notes','notes.html'],
        ['Status','status.html'],
        ['Demo','demo-homepage.html']
      ];
      return '<div class="links">' + files.map(([label,file]) => '<a href="' + base + file + '">' + label + '</a>').join('') + '</div>';
    }
    function render() {
      const q = search.value.trim().toLowerCase();
      const p = priority.value;
      const filtered = rows.filter(row => {
        const haystack = Object.values(row).join(" ").toLowerCase();
        return (!p || row.priority === p) && (!q || haystack.includes(q));
      }).sort((a, b) => {
        const av = a[sortKey] ?? "";
        const bv = b[sortKey] ?? "";
        if (typeof av === "number") return (av - bv) * sortDir;
        return String(av).localeCompare(String(bv), undefined, { numeric:true }) * sortDir;
      });
      tbody.innerHTML = filtered.map(row => '<tr>' +
        '<td class="business">' + row.name + '</td>' +
        '<td>' + row.category + '</td>' +
        '<td>' + badge(row.priority) + '</td>' +
        '<td>' + row.websiteStatus + '</td>' +
        '<td class="score">' + row.seoScore + '/100</td>' +
        '<td>' + row.reason + '</td>' +
        '<td>' + row.demoQuality + '</td>' +
        '<td>' + badge(row.pricingIncluded) + '</td>' +
        '<td>' + badge(row.readyForReview) + '</td>' +
        '<td>' + row.nextAction + '</td>' +
        '<td>' + links(row.slug) + '</td>' +
      '</tr>').join('');
      empty.style.display = filtered.length ? 'none' : 'block';
    }
    document.querySelectorAll("th[data-key]").forEach(th => {
      th.addEventListener("click", () => {
        const key = th.dataset.key;
        sortDir = sortKey === key ? sortDir * -1 : 1;
        sortKey = key;
        render();
      });
    });
    search.addEventListener("input", render);
    priority.addEventListener("change", render);
    render();
  </script>
</body>
</html>`;
}

for (const b of businesses) {
  const dir = path.join(businessesDir, b.slug);
  write(path.join(dir, "business-profile.html"), profilePage(b));
  write(path.join(dir, "website-audit.html"), websiteAuditPage(b));
  write(path.join(dir, "seo-audit.html"), seoAuditPage(b));
  write(path.join(dir, "outreach-email.html"), outreachPage(b));
  write(path.join(dir, "demo-website-brief.html"), briefPage(b));
  write(path.join(dir, "notes.html"), notesPage(b));
  write(path.join(dir, "status.html"), statusPage(b));
  write(path.join(dir, "demo-homepage.html"), demoHomepage(b));
}

write(path.join(dashboardDir, "index.html"), dashboard());
console.log(`Generated ${businesses.length} business page sets and dashboard/index.html`);
require("./enhance-demo-homepages.js");
require("./upgrade-a-plus-homepages.js");
require("./generate-full-website-packs.js");
require("./simplify-sales-dashboard.js");
require("./redesign-dark-sales-dashboard.js");
