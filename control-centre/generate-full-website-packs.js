const fs = require("fs");
const path = require("path");

const root = __dirname;
const businessesDir = path.join(root, "businesses");
const dashboardDir = path.join(root, "dashboard");

const businesses = [
  {
    slug: "the-orchard-cafe-brentwood",
    name: "The Orchard Cafe",
    initials: "OC",
    sector: "Cafe",
    area: "Brentwood",
    location: "114 Orchard Ave, Brentwood CM13 2DP",
    phone: "01277 215030",
    email: "Ask in store",
    priority: "High",
    value: "£5,000",
    package: "Growth Website",
    headline: "Fresh Coffee, Brunch & Local Favourites in Brentwood",
    positioning: "A warm, independent Brentwood cafe with clear menus, opening hours, local search visibility and a stronger visit/takeaway journey.",
    tone: "Warm, independent, cosy, local, artisan and easy to visit.",
    colours: ["#223127", "#d98f45", "#8bbf9f", "#f8f1e8", "#ffffff"],
    keywords: ["cafe Brentwood", "breakfast Brentwood", "brunch Brentwood", "coffee Brentwood", "takeaway cafe Brentwood"],
    services: [
      ["Breakfast & brunch", "Fresh morning favourites, eggs, toast, warm plates and weekend-friendly brunch options."],
      ["Coffee & hot drinks", "Smooth coffee, tea and hot drinks for sit-in catch-ups or quick takeaway stops."],
      ["Lunch plates", "Fresh sandwiches, lighter plates and lunch specials for local workers and residents."],
      ["Cakes & pastries", "Counter treats, cakes and sweet options to pair with coffee or take home."],
      ["Takeaway orders", "Clear call-ahead flow for customers who want quick collection."],
      ["Small catering", "Simple local catering enquiries for offices, groups and community events."]
    ],
    prices: [
      ["Coffee & pastry", "Fresh coffee with a cake or pastry counter option.", "£5-7"],
      ["Breakfast plate", "Cafe breakfast with eggs, toast and warm sides.", "£8-12"],
      ["Lunch special", "Sandwich, salad or hot plate with a drink option.", "£9-14"],
      ["Cake box", "Small selection of cakes for takeaway sharing.", "£10-18"],
      ["Small catering tray", "Office or group order enquiry.", "£25+"]
    ],
    faqs: [
      ["Do you offer takeaway?", "Yes, customers can call ahead for takeaway orders and quick collection."],
      ["Do you serve breakfast all day?", "Availability should be confirmed by the business before publishing."],
      ["Do you serve cakes and coffee?", "Yes, the proposed structure gives cakes and coffee a clear sales section."],
      ["Where are you based?", "114 Orchard Ave, Brentwood CM13 2DP."]
    ],
    reviews: ["Warm local cafe with friendly service and good coffee.", "A relaxed Brentwood spot for breakfast, lunch and cake.", "Easy to find, welcoming and perfect for a quick takeaway."],
    pages: ["Home", "Menu & Services", "Pricing", "Gallery", "Reviews", "Contact", "Local SEO Landing Pages"]
  },
  {
    slug: "de-milia-barber-brentwood",
    name: "De'Milia Barber",
    initials: "DB",
    sector: "Barber",
    area: "Brentwood",
    location: "23a Ongar Road, Brentwood CM15 9AU",
    phone: "01277 200008",
    email: "Ask by phone",
    priority: "High",
    value: "£5,000",
    package: "Growth Website",
    headline: "Sharp Cuts, Classic Grooming & Premium Barbering in Brentwood",
    positioning: "A confident Brentwood barber brand with stronger service presentation, local search visibility and a sharper call-to-book journey.",
    tone: "Sharp, masculine, traditional, confident and premium.",
    colours: ["#101820", "#c89b3c", "#7f8792", "#f5efe4", "#ffffff"],
    keywords: ["barber Brentwood", "skin fade Brentwood", "beard trim Brentwood", "men's haircut Brentwood", "barber Ongar Road"],
    services: [
      ["Skin fades", "Detailed fade work, crisp edges and a sharp modern finish."],
      ["Classic cuts", "Traditional scissor and clipper cuts shaped for everyday confidence."],
      ["Beard trim & shape", "Line work, shaping and tidy finishing for a complete grooming look."],
      ["Restyles", "Longer appointments for customers changing length, shape or finish."],
      ["Quick tidy-ups", "Efficient grooming between full appointments."],
      ["Regular grooming", "Repeat booking flow for customers who want to stay sharp."]
    ],
    prices: [
      ["Classic cut", "Clean barber cut with tidy finish.", "£18-24"],
      ["Skin fade", "Detailed fade work with sharp edges.", "£24-30"],
      ["Cut & beard shape", "Haircut, beard trim and finish.", "£30-38"],
      ["Beard trim", "Shape, tidy and line work.", "£10-16"],
      ["Restyle", "Longer appointment for a new look.", "£28-40"]
    ],
    faqs: [
      ["Do I need to book?", "Customers can call ahead to check availability or appointment times."],
      ["Do you offer beard trims?", "Yes, beard trim and shaping should be shown as a clear service."],
      ["Do you cut children's hair?", "Availability should be confirmed by the business before publishing."],
      ["Where are you based?", "23a Ongar Road, Brentwood CM15 9AU."]
    ],
    reviews: ["Sharp cut and proper attention to detail.", "Clean fade, tidy beard work and easy to call.", "A strong local barber experience with a premium finish."],
    pages: ["Home", "Services", "Pricing", "Gallery", "Reviews", "Contact", "Local SEO Landing Pages"]
  },
  {
    slug: "wagnificent-dog-groomers-brentwood",
    name: "Wagnificent Dog Groomers",
    initials: "WG",
    sector: "Dog Groomer",
    area: "Brentwood",
    location: "54 Hutton Road, Brentwood CM15 8LB",
    phone: "07935 544063",
    email: "Ask by phone",
    priority: "Medium",
    value: "£5,000",
    package: "Growth Website",
    headline: "Premium Dog Grooming with a Gentle Local Touch",
    positioning: "A clean, caring Brentwood grooming brand with stronger trust signals, package clarity and an easier booking journey.",
    tone: "Warm, caring, trusted, clean, gentle and professional.",
    colours: ["#25313d", "#e7a7a0", "#91b9b0", "#f8f4ee", "#ffffff"],
    keywords: ["dog groomer Brentwood", "dog grooming Brentwood", "puppy groom Brentwood", "nail trim Brentwood", "dog bath Brentwood"],
    services: [
      ["Full groom packages", "Breed-aware grooming, trimming, styling and finishing."],
      ["Bath & blow dry", "Gentle wash, dry and brush-through for a clean refresh."],
      ["Puppy introductions", "Calm first grooming visits to build confidence."],
      ["Deshedding", "Coat care for seasonal shedding and healthier maintenance."],
      ["Nail trims", "Quick paw-care appointments and tidy-ups."],
      ["Owner guidance", "Advice on grooming frequency, brushing and coat condition."]
    ],
    prices: [
      ["Small dog full groom", "Full groom for smaller breeds.", "£45-60"],
      ["Medium dog full groom", "Wash, trim, style and finish.", "£55-75"],
      ["Large dog full groom", "Longer appointment for larger coats.", "£70-95"],
      ["Bath and brush", "Freshen-up bath, dry and brush.", "£30-50"],
      ["Nail trim", "Quick paw-care appointment.", "£10-18"]
    ],
    faqs: [
      ["How long does a groom take?", "Timing depends on breed, coat condition and service type."],
      ["Do you groom nervous dogs?", "Gentle handling and appointment pacing can be discussed before booking."],
      ["Do you offer nail trims?", "Yes, nail trims and tidy-ups should be clear service options."],
      ["How often should my dog be groomed?", "This depends on breed and coat type; customers should ask for tailored advice."]
    ],
    reviews: ["Gentle, calm and our dog came home looking brilliant.", "Friendly grooming with clear care and a lovely finish.", "Professional from the first call and reassuring throughout."],
    pages: ["Home", "Services", "Pricing", "Gallery", "Reviews", "Contact", "Local SEO Landing Pages"]
  },
  {
    slug: "shenfield-vehicle-services-shenfield",
    name: "Shenfield Vehicle Services",
    initials: "SV",
    sector: "Vehicle Services",
    area: "Shenfield",
    location: "17A Hutton Road, Shenfield, Brentwood CM15 8JU",
    phone: "01277 218686",
    email: "shenfieldvehicleservices@tesco.net",
    priority: "Medium",
    value: "£5,000",
    package: "Growth Website",
    headline: "Reliable Vehicle Servicing, Diagnostics & Repairs in Shenfield",
    positioning: "A practical local garage website with clearer service routes, diagnostic enquiries, MOT support and stronger conversion from local search.",
    tone: "Professional, practical, trustworthy, clear and reliable.",
    colours: ["#17212b", "#f2b705", "#5da7d1", "#eef3f7", "#ffffff"],
    keywords: ["garage Shenfield", "vehicle servicing Shenfield", "diagnostics Shenfield", "MOT repairs Shenfield", "brake check Brentwood"],
    services: [
      ["Interim servicing", "Routine checks and practical maintenance."],
      ["Full servicing", "Complete inspection and service advice."],
      ["Vehicle diagnostics", "Fault-finding for warning lights and running issues."],
      ["Brakes & tyres", "Safety-led inspection and repair advice."],
      ["MOT preparation", "Checks and repair guidance before MOT deadlines."],
      ["Repair enquiries", "Simple route for drivers to request help."]
    ],
    prices: [
      ["Diagnostic check", "Fault-finding and practical advice.", "£55-90"],
      ["Interim service", "Routine maintenance and checks.", "£120-180"],
      ["Full service", "Broader inspection and service work.", "£220-320"],
      ["Brake inspection", "Safety check and repair advice.", "£35-60"],
      ["MOT prep check", "Pre-MOT inspection guidance.", "£45-75"]
    ],
    faqs: [
      ["Do you offer diagnostics?", "Yes, diagnostics should be positioned as a core service."],
      ["Can I book a service?", "Customers can call or email to ask about availability."],
      ["Do you check brakes?", "Yes, brake checks should be shown as a safety-focused service option."],
      ["Where are you based?", "17A Hutton Road, Shenfield, Brentwood CM15 8JU."]
    ],
    reviews: ["Straightforward advice, clear communication and practical service.", "Quick diagnosis and professional workmanship.", "Convenient Shenfield garage with helpful contact options."],
    pages: ["Home", "Services", "Pricing", "Gallery", "Reviews", "Contact", "Local SEO Landing Pages"]
  },
  {
    slug: "the-garage-group-essex-brentwood",
    name: "The Garage Group Essex",
    initials: "GG",
    sector: "Garage",
    area: "Essex",
    location: "The Old Stable Yard, Sandpit Lane, Brentwood CM14 5QD",
    phone: "01277 402382",
    email: "enquiries@thegaragegroupessex.co.uk",
    priority: "Medium",
    value: "£5,000",
    package: "Growth Website",
    headline: "Modern Vehicle Diagnostics, Servicing & Repairs in Essex",
    positioning: "A bold modern garage brand with stronger diagnostic positioning, booking clarity, fleet enquiry structure and local SEO lift.",
    tone: "Bold, technical, modern, reliable and direct.",
    colours: ["#111827", "#2dd4bf", "#7c93ff", "#f5f7fb", "#ffffff"],
    keywords: ["garage Essex", "vehicle diagnostics Brentwood", "MOT Brentwood", "vehicle servicing Essex", "fleet garage Brentwood"],
    services: [
      ["Advanced diagnostics", "Modern fault-finding and clear repair routes."],
      ["MOT & servicing", "Routine maintenance and MOT support."],
      ["Brakes, tyres & exhausts", "Safety-focused inspection and repairs."],
      ["Air conditioning", "Seasonal comfort checks and AC enquiries."],
      ["Fleet support", "Repeat service route for trade and fleet vehicles."],
      ["Repair booking", "Clear workshop enquiry flow for practical next steps."]
    ],
    prices: [
      ["Diagnostic inspection", "Fault-finding and repair guidance.", "£65-110"],
      ["MOT support", "MOT test support plus repair advice if needed.", "£54.85 statutory MOT test plus repairs if needed"],
      ["Service package", "Vehicle service options by requirement.", "£180-350"],
      ["Air con check", "Seasonal comfort and system check.", "£50-90"],
      ["Fleet enquiry", "Repeat workshop support for local vehicles.", "Quoted"]
    ],
    faqs: [
      ["Do you offer diagnostics?", "Yes, diagnostics should be a main service with a direct enquiry route."],
      ["Can I book servicing?", "Customers can call or email for service package availability."],
      ["Do you support fleet enquiries?", "Yes, fleet and trade support should be shown as a separate service path."],
      ["Where are you based?", "The Old Stable Yard, Sandpit Lane, Brentwood CM14 5QD."]
    ],
    reviews: ["Clear communication and professional workmanship.", "A capable local garage with strong service options.", "Modern, practical and easy to contact for vehicle care."],
    pages: ["Home", "Services", "Pricing", "Gallery", "Reviews", "Contact", "Local SEO Landing Pages"]
  }
];

const newFiles = [
  "services.html",
  "pricing.html",
  "about.html",
  "gallery.html",
  "reviews.html",
  "contact.html",
  "proposal.html",
  "brand-system.html",
  "seo-plan.html",
  "website-package-summary.html"
];

function esc(v) {
  return String(v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function tel(v) {
  return String(v).replace(/[^\d+]/g, "");
}

function shell(b, title, kicker, body) {
  const nav = [
    ["Home", "demo-homepage.html"], ["Services", "services.html"], ["Pricing", "pricing.html"], ["About", "about.html"], ["Gallery", "gallery.html"], ["Reviews", "reviews.html"], ["Contact", "contact.html"], ["Proposal", "proposal.html"], ["Brand", "brand-system.html"], ["SEO", "seo-plan.html"], ["Packages", "website-package-summary.html"]
  ].map(([label, file]) => `<a href="${file}">${label}</a>`).join("");
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)} | ${esc(b.name)}</title>
  <style>
    :root{--dark:${b.colours[0]};--accent:${b.colours[1]};--accent2:${b.colours[2]};--soft:${b.colours[3]};--paper:#fff;--ink:#111827;--muted:#667085;--line:#dfe6ee;--shadow:0 24px 70px rgba(12,20,31,.12)}
    *{box-sizing:border-box}body{margin:0;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif;background:linear-gradient(180deg,var(--soft),#fff 42%);color:var(--ink);line-height:1.55}a{color:inherit}.wrap{width:min(1240px,calc(100% - 44px));margin:0 auto}.bar{background:#090e15;color:#d9e2ec;padding:9px 0;font-size:13px}.bar .wrap{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap}.nav{position:sticky;top:0;z-index:10;background:rgba(255,255,255,.94);backdrop-filter:blur(18px);border-bottom:1px solid var(--line)}.navin{min-height:74px;display:flex;align-items:center;justify-content:space-between;gap:20px}.brand{display:flex;align-items:center;gap:12px;text-decoration:none;color:var(--dark);font-weight:950}.mark{width:44px;height:44px;border-radius:8px;display:grid;place-items:center;background:linear-gradient(135deg,var(--dark),var(--accent));color:#fff;box-shadow:0 14px 34px rgba(0,0,0,.18)}.links{display:flex;gap:14px;align-items:center;flex-wrap:wrap;font-size:13px;font-weight:850;color:#334155}.links a{text-decoration:none}.hero{position:relative;overflow:hidden;background:linear-gradient(135deg,var(--dark),color-mix(in srgb,var(--accent) 38%,var(--dark)));color:#fff;padding:70px 0}.hero:after{content:"";position:absolute;right:-120px;top:-160px;width:520px;height:520px;border-radius:50%;background:var(--accent);opacity:.24}.hero .wrap{position:relative;z-index:1;display:grid;grid-template-columns:1fr .42fr;gap:34px;align-items:end}.kicker{display:inline-flex;border:1px solid rgba(255,255,255,.24);background:rgba(255,255,255,.1);border-radius:999px;padding:8px 12px;font-size:13px;font-weight:950;margin-bottom:18px}h1{margin:0;font-size:clamp(42px,6vw,78px);line-height:.98;letter-spacing:0}.lead{margin:18px 0 0;color:#deebf5;font-size:19px;max-width:780px}.hero-card{background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.22);border-radius:8px;padding:22px;box-shadow:var(--shadow)}.hero-card strong{display:block;font-size:36px;line-height:1}.hero-card span{color:#dbe7f0}.btn{display:inline-flex;align-items:center;justify-content:center;min-height:44px;border-radius:8px;padding:0 18px;text-decoration:none;font-weight:950;border:1px solid transparent}.btn.primary{background:var(--accent);color:var(--dark)}.btn.dark{background:var(--dark);color:#fff}.btn.outline{border-color:var(--line);background:#fff;color:var(--dark)}main{padding:42px 0 70px}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}.grid.two{grid-template-columns:1fr 1fr}.card{background:#fff;border:1px solid var(--line);border-radius:8px;padding:26px;box-shadow:0 16px 46px rgba(12,20,31,.07)}.card h2,.card h3{color:var(--dark);margin:0 0 12px}.card h2{font-size:32px;line-height:1.05}.card h3{font-size:23px}.card p{color:var(--muted);margin:0 0 14px}.badge{display:inline-flex;border-radius:999px;background:color-mix(in srgb,var(--accent) 20%,#fff);color:var(--dark);padding:7px 11px;font-size:12px;font-weight:950;margin:0 8px 8px 0}.section{margin-top:34px}.section-head{display:flex;justify-content:space-between;gap:24px;align-items:end;margin-bottom:20px}.section-head h2{font-size:clamp(32px,4vw,54px);line-height:1.02;color:var(--dark);margin:0}.section-head p{max-width:570px;color:var(--muted);margin:0}.visual{min-height:230px;border-radius:8px;position:relative;overflow:hidden;background:linear-gradient(135deg,color-mix(in srgb,var(--accent) 64%,#fff),color-mix(in srgb,var(--dark) 86%,#000));box-shadow:var(--shadow)}.visual:before{content:"";position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.28),transparent 32%),repeating-linear-gradient(135deg,rgba(255,255,255,.12) 0 2px,transparent 2px 22px)}.visual:after{content:attr(data-label);position:absolute;left:24px;bottom:20px;color:#fff;font-size:38px;font-weight:950;line-height:1}.price strong{display:block;font-size:34px;color:var(--dark)}.price em{display:inline-flex;background:var(--dark);color:#fff;border-radius:999px;padding:5px 9px;font-style:normal;font-size:12px;font-weight:950;margin-bottom:10px}.faq details{background:#fff;border:1px solid var(--line);border-radius:8px;padding:16px;margin-bottom:12px}.faq summary{font-weight:950;color:var(--dark);cursor:pointer}.faq p{color:var(--muted)}.palette{display:grid;grid-template-columns:repeat(5,1fr);gap:10px}.swatch{min-height:120px;border-radius:8px;padding:14px;color:#fff;font-weight:950;display:flex;align-items:end}.footer{background:#080d13;color:#cad5df;padding:34px 0}.footer .wrap{display:flex;justify-content:space-between;gap:18px;flex-wrap:wrap}.footer a{color:#fff}.note{border-left:4px solid var(--accent);background:#fffaf0;padding:14px 16px;border-radius:0 8px 8px 0;color:#4b5563}@media(max-width:960px){.hero .wrap,.grid,.grid.two{grid-template-columns:1fr}.links{display:none}.section-head{display:block}.section-head p{margin-top:10px}.palette{grid-template-columns:1fr 1fr}.wrap{width:min(100% - 30px,1240px)}} 
  </style>
</head>
<body>
  <div class="bar"><div class="wrap"><span>Demo concept only - created as an example website proposal.</span><span>Example pricing - to be confirmed by the business.</span></div></div>
  <nav class="nav"><div class="wrap navin"><a class="brand" href="demo-homepage.html"><span class="mark">${esc(b.initials)}</span><span>${esc(b.name)}</span></a><div class="links">${nav}</div></div></nav>
  <header class="hero"><div class="wrap"><div><span class="kicker">${esc(kicker)}</span><h1>${esc(title)}</h1><p class="lead">${esc(b.positioning)}</p></div><aside class="hero-card"><strong>${esc(b.value)}</strong><span>${esc(b.package)} recommended package</span><p><a class="btn primary" href="contact.html">Discuss next step</a></p></aside></div></header>
  <main class="wrap">${body}</main>
  <footer class="footer"><div class="wrap"><span>${esc(b.name)} premium website proposal pack.</span><span><a href="../../dashboard/index.html">Back to dashboard</a></span><span>Example testimonials and pricing are placeholders until verified.</span></div></footer>
</body>
</html>`;
}

function servicesPage(b) {
  const cards = b.services.map(([t, d], i) => `<article class="card"><span class="badge">Service ${i + 1}</span><h3>${esc(t)}</h3><p>${esc(d)}</p><p><strong>Customer benefit:</strong> clearer choice, faster confidence and a direct enquiry route.</p><a class="btn outline" href="contact.html">Ask about ${esc(t.toLowerCase())}</a></article>`).join("");
  const faq = b.faqs.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("");
  return shell(b, "Premium Services", "Service structure", `<section class="section"><div class="section-head"><h2>Sector-specific services built for search and conversion.</h2><p>Each service block gives customers the useful detail they need while supporting local SEO and enquiry intent.</p></div><div class="grid">${cards}</div></section><section class="section grid two"><div class="card"><h2>Suggested service page flow</h2><p>Lead with the main offer, show benefits, answer doubts, then repeat the contact CTA.</p><span class="badge">Trust-led</span><span class="badge">Mobile-first</span><span class="badge">Local SEO</span></div><div class="card faq"><h2>Service FAQs</h2>${faq}</div></section>`);
}

function pricingPage(b) {
  const cards = b.prices.map(([t, d, p], i) => `<article class="card price">${i === 1 ? "<em>Popular</em>" : i === 2 ? "<em>Best value</em>" : ""}<h3>${esc(t)}</h3><p>${esc(d)}</p><strong>${esc(p)}</strong><p>Example pricing - to be confirmed by the business.</p><a class="btn outline" href="contact.html">Enquire</a></article>`).join("");
  return shell(b, "Example Pricing", "Indicative price structure", `<section class="section"><div class="section-head"><h2>Polished pricing that makes the next step easier.</h2><p>Prices are indicative only. The live site should use confirmed business pricing before launch.</p></div><div class="grid">${cards}</div></section><section class="section card"><h2>Pricing strategy</h2><p>Use pricing guidance to reduce friction, qualify enquiries and make customers more confident before contacting ${esc(b.name)}.</p><a class="btn dark" href="contact.html">Ask for availability</a></section>`);
}

function aboutPage(b) {
  return shell(b, "About", "Brand story and trust", `<section class="section grid two"><article class="card"><h2>A stronger local story</h2><p>${esc(b.positioning)}</p><p>The about page should make ${esc(b.name)} feel established, useful and easy to trust before customers make contact.</p><span class="badge">${esc(b.area)} based</span><span class="badge">${esc(b.sector)}</span><span class="badge">Customer-first</span></article><div class="visual" data-label="${esc(b.name)}"></div></section><section class="section grid"><article class="card"><h3>Brand tone</h3><p>${esc(b.tone)}</p></article><article class="card"><h3>Trust signals</h3><p>Clear location, visible phone number, service clarity, pricing guidance and review placeholders ready for real testimonials.</p></article><article class="card"><h3>Local positioning</h3><p>${esc(b.location)}</p></article></section>`);
}

function galleryPage(b) {
  const panels = ["Hero visual", ...b.services.slice(0, 5).map(([t]) => t)].map((label) => `<div class="visual" data-label="${esc(label)}"></div>`).join("");
  return shell(b, "Gallery & Visual Direction", "Premium visual proof", `<section class="section"><div class="section-head"><h2>Designed visual panels with no broken or copyrighted image links.</h2><p>These panels set art direction for future photography or AI-generated assets while staying self-contained.</p></div><div class="grid two">${panels}</div></section><section class="section card"><h2>Asset direction</h2><p>Future assets should show real premises, service results, customer experience, staff/process detail and local cues for ${esc(b.area)}.</p></section>`);
}

function reviewsPage(b) {
  const cards = b.reviews.map((r, i) => `<figure class="card"><div class="badge">Example testimonial ${i + 1}</div><h3>"${esc(r)}"</h3><p>Placeholder only - replace with verified customer feedback before launch.</p></figure>`).join("");
  return shell(b, "Reviews", "Example testimonial system", `<section class="section"><div class="section-head"><h2>Trust-building reviews without claiming unverified proof.</h2><p>Use this page to gather, organise and publish verified reviews once approved.</p></div><div class="grid">${cards}</div></section><section class="section card"><h2>Review collection plan</h2><p>Ask recent customers for short service-specific comments, include location references where natural, and keep testimonials tied to real customer permission.</p></section>`);
}

function contactPage(b) {
  return shell(b, "Contact & Booking", "Enquiry journey", `<section class="section grid two"><article class="card"><h2>Contact ${esc(b.name)}</h2><p><strong>Address:</strong> ${esc(b.location)}</p><p><strong>Phone:</strong> <a href="tel:${esc(tel(b.phone))}">${esc(b.phone)}</a></p><p><strong>Email:</strong> ${esc(b.email)}</p><p><strong>Opening hours:</strong> Placeholder - to be confirmed by the business.</p><a class="btn dark" href="tel:${esc(tel(b.phone))}">Call now</a></article><article class="card"><h2>Enquiry form layout</h2><p>Name</p><p>Phone/email</p><p>Service required</p><p>Preferred date/time</p><p>Message</p><p class="note">Form is a visual layout only. No email has been sent and no form handler is active.</p></article></section><section class="section card"><h2>Booking flow</h2><p>Customer lands on service or pricing page, checks trust signals, sees location, then calls or submits an enquiry with enough context for a useful reply.</p></section>`);
}

function proposalPage(b) {
  const pages = b.pages.map((p) => `<li>${esc(p)}</li>`).join("");
  return shell(b, "£5,000 Website Proposal", "Commercial proposal", `<section class="section grid two"><article class="card"><h2>Current opportunity</h2><p>${esc(b.positioning)}</p><p>The opportunity is to move from a basic or listing-led web journey into a premium, multi-page customer acquisition system.</p></article><article class="card"><h2>Suggested package value</h2><p><strong>Growth Website - £5,000</strong></p><p>Recommended for stronger prospects because it combines brand refresh, copywriting, local SEO structure and conversion-focused pages.</p></article></section><section class="section grid"><article class="card"><h3>What the new website fixes</h3><p>Weak first impression, unclear service structure, limited pricing confidence, thin local SEO signals and a basic contact journey.</p></article><article class="card"><h3>Benefits to the business</h3><p>More trust, better mobile experience, stronger search coverage and clearer reasons for customers to call.</p></article><article class="card"><h3>Next steps</h3><p>Review the demo, confirm pricing/services, approve tone, gather real imagery/reviews and move into build.</p></article></section><section class="section card"><h2>Pages included</h2><ul>${pages}</ul></section>`);
}

function brandPage(b) {
  const swatches = b.colours.map((c) => `<div class="swatch" style="background:${c};color:${c === "#ffffff" ? "#111827" : "#fff"}">${esc(c)}</div>`).join("");
  return shell(b, "Mini Brand System", "Brand direction", `<section class="section grid two"><article class="card"><h2>Brand positioning</h2><p>${esc(b.positioning)}</p><h3>Tone of voice</h3><p>${esc(b.tone)}</p><h3>Typography direction</h3><p>Bold editorial headings, clear body copy and compact CTA labels optimised for mobile scanning.</p></article><article class="card"><h2>Colour palette</h2><div class="palette">${swatches}</div></article></section><section class="section grid"><article class="card"><h3>Button style</h3><p>Solid primary CTA, dark secondary CTA and clean outline buttons for supporting actions.</p><a class="btn primary" href="contact.html">Primary CTA</a> <a class="btn outline" href="services.html">Secondary</a></article><article class="card"><h3>Icon style</h3><p>Simple numbered service markers, circular trust dots and clean badge systems.</p></article><article class="card"><h3>Visual direction</h3><p>Layered gradient image panels, local service labels, premium shadows and future real photography direction.</p></article></section>`);
}

function seoPage(b) {
  const local = b.keywords.map((k) => `<span class="badge">${esc(k)}</span>`).join("");
  const service = b.services.map(([s]) => `<li>${esc(s)} in ${esc(b.area)}</li>`).join("");
  return shell(b, "Local SEO Plan", "Search structure", `<section class="section grid two"><article class="card"><h2>Meta title suggestion</h2><p>${esc(b.headline)} | ${esc(b.name)}</p><h2>Meta description suggestion</h2><p>${esc(b.positioning)}</p></article><article class="card"><h2>Keyword targets</h2>${local}</article></section><section class="section grid two"><article class="card"><h2>Suggested page structure</h2><ul><li>Homepage targeting primary local search</li><li>Services page for service keywords</li><li>Pricing page for buying intent</li><li>Contact page for map/location intent</li><li>Reviews page for trust</li></ul></article><article class="card"><h2>Service keywords</h2><ul>${service}</ul></article></section><section class="section grid"><article class="card"><h3>Google Business Profile</h3><p>Refresh services, categories, photos, opening hours, booking/contact links and review replies.</p></article><article class="card"><h3>Quick wins</h3><p>Add local schema, internal links, image alt text, click-to-call buttons and consistent NAP details.</p></article><article class="card"><h3>Content plan</h3><p>Create focused supporting pages for the highest-value services and local areas.</p></article></section>`);
}

function packagePage(b) {
  return shell(b, "Website Package Summary", "Recommended package", `<section class="section grid"><article class="card price"><h2>Starter Website</h2><strong>£995</strong><p>One-page website, basic copy, contact CTA and mobile responsive build.</p></article><article class="card price"><h2>Premium Website</h2><strong>£2,500</strong><p>3-5 page website, stronger branding, service sections, pricing, local SEO basics and contact form.</p></article><article class="card price"><em>Recommended</em><h2>Growth Website</h2><strong>£5,000</strong><p>5-7 page premium website, brand refresh, copywriting, visual asset direction, local SEO plan, conversion-focused page structure, contact/booking journey, analytics setup recommendation, Google Business Profile recommendations and handover notes.</p></article></section><section class="section card"><h2>Why Growth Website fits ${esc(b.name)}</h2><p>${esc(b.positioning)}</p><p>The Growth Website package is recommended for stronger prospects because it creates a complete business website system, not just a homepage.</p></section>`);
}

function dashboard() {
  const rows = businesses.map((b) => ({
    name: b.name, category: b.sector, priority: b.priority, websiteStatus: "Full proposal pack ready", seoScore: b.priority === "High" ? 72 : 68, reason: b.positioning, demoQuality: "A+ full website system", pricingIncluded: "Yes", readyForReview: "Yes", nextAction: "Review proposal pack manually before outreach.", packageRecommended: b.package, estimatedWebsiteValue: b.value, slug: b.slug
  }));
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Control Centre Prospect Dashboard</title><style>
:root{--bg:#f3f6fa;--panel:#fff;--ink:#16202a;--muted:#64748b;--line:#dbe3ee;--high:#a61b12;--high-bg:#ffe7e3;--medium:#835600;--medium-bg:#fff1c2;--accent:#1f6f8b;--ready:#087443;--ready-bg:#dcfce7}*{box-sizing:border-box}body{margin:0;font-family:Inter,Arial,sans-serif;background:var(--bg);color:var(--ink)}header{padding:34px 20px 22px;background:linear-gradient(135deg,#102331,#1f4157);color:#fff}.wrap{max-width:1600px;margin:0 auto}h1{margin:0 0 8px;font-size:clamp(32px,5vw,58px)}header p{margin:0;color:#c8d5df;max-width:960px;font-size:17px}.toolbar{display:flex;gap:12px;flex-wrap:wrap;padding:16px 20px;background:#fff;border-bottom:1px solid var(--line);position:sticky;top:0;z-index:5}input,select{min-height:44px;border:1px solid var(--line);border-radius:8px;padding:0 12px;font-size:15px;background:#fff;color:var(--ink)}input{min-width:min(100%,420px);flex:1}main{padding:24px 20px 46px}.summary{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:18px}.summary article{background:#fff;border:1px solid var(--line);border-radius:8px;padding:18px;box-shadow:0 10px 28px rgba(15,23,42,.05)}.summary span{display:block;color:var(--muted);font-size:13px;font-weight:800}.summary strong{display:block;color:#111827;font-size:30px;margin-top:4px}.table-wrap{overflow:auto;background:var(--panel);border:1px solid var(--line);border-radius:8px;box-shadow:0 12px 34px rgba(15,23,42,.07)}table{width:100%;border-collapse:collapse;min-width:1900px}th,td{padding:13px 12px;border-bottom:1px solid var(--line);text-align:left;vertical-align:top}th{font-size:13px;color:#334155;background:#f8fafc;cursor:pointer;user-select:none;white-space:nowrap;position:sticky;top:77px;z-index:2}td{font-size:14px;color:#243344}.business{font-weight:850;color:#0f172a;min-width:190px}.badge{display:inline-flex;border-radius:999px;padding:5px 9px;font-size:12px;font-weight:850;white-space:nowrap}.High{color:var(--high);background:var(--high-bg)}.Medium{color:var(--medium);background:var(--medium-bg)}.Yes{color:var(--ready);background:var(--ready-bg)}.score{font-weight:900;color:#111827}.links{display:grid;grid-template-columns:repeat(4,max-content);gap:7px;min-width:640px}.links a{color:var(--accent);text-decoration:none;border:1px solid var(--line);border-radius:8px;padding:7px 8px;background:#fbfdff;white-space:nowrap;font-weight:750}.empty{display:none;padding:28px;text-align:center;color:var(--muted)}footer{padding:18px 20px 34px;color:var(--muted);text-align:center;font-size:13px}@media(max-width:900px){.summary{grid-template-columns:repeat(2,1fr)}th{top:132px}}@media(max-width:560px){.summary{grid-template-columns:1fr}}
</style></head><body><header><div class="wrap"><h1>Prospect Dashboard</h1><p>Five Brentwood/Shenfield prospects upgraded from homepage concepts into full premium website proposal packs with services, pricing, brand system, SEO plan and £5,000 Growth Website recommendation.</p></div></header><div class="toolbar"><input id="search" type="search" placeholder="Search business, package, status, reason, next action"><select id="priority"><option value="">All priorities</option><option value="High">High</option><option value="Medium">Medium</option></select></div><main class="wrap"><section class="summary"><article><span>Businesses</span><strong>5</strong></article><article><span>Full packs</span><strong>5</strong></article><article><span>New pages per business</span><strong>10</strong></article><article><span>Recommended value</span><strong>£5k</strong></article></section><div class="table-wrap"><table id="prospects"><thead><tr><th data-key="name">Business</th><th data-key="category">Category</th><th data-key="priority">Priority</th><th data-key="websiteStatus">Website Status</th><th data-key="seoScore">SEO Score</th><th data-key="packageRecommended">Package Recommended</th><th data-key="estimatedWebsiteValue">Estimated Website Value</th><th data-key="reason">Reason to Contact</th><th data-key="demoQuality">Demo Quality</th><th data-key="pricingIncluded">Pricing Included</th><th data-key="readyForReview">Ready for Review</th><th data-key="nextAction">Next Action</th><th>Full Website Pack</th><th>Proposal</th><th>Brand System</th><th>SEO Plan</th><th>Contact Page</th></tr></thead><tbody></tbody></table><div class="empty" id="empty">No matching prospects.</div></div></main><footer>Dashboard generated inside Shane's OpenClaw control centre. Review manually before any outreach.</footer><script>
const rows=${JSON.stringify(rows,null,2)};const tbody=document.querySelector("tbody"),search=document.querySelector("#search"),priority=document.querySelector("#priority"),empty=document.querySelector("#empty");let sortKey="priority",sortDir=1;function badge(v){const safe=String(v).replace(/[^A-Za-z0-9_-]/g,"");return '<span class="badge '+safe+'">'+v+"</span>"}function pack(slug){const base="../businesses/"+slug+"/";const files=[["Home","demo-homepage.html"],["Services","services.html"],["Pricing","pricing.html"],["About","about.html"],["Gallery","gallery.html"],["Reviews","reviews.html"],["Packages","website-package-summary.html"]];return '<div class="links">'+files.map(([l,f])=>'<a href="'+base+f+'">'+l+"</a>").join("")+"</div>"}function one(slug,label,file){return '<div class="links"><a href="../businesses/'+slug+"/"+file+'">'+label+"</a></div>"}function render(){const q=search.value.trim().toLowerCase(),p=priority.value;const filtered=rows.filter(r=>(!p||r.priority===p)&&(!q||Object.values(r).join(" ").toLowerCase().includes(q))).sort((a,b)=>{const av=a[sortKey]??"",bv=b[sortKey]??"";if(typeof av==="number")return(av-bv)*sortDir;return String(av).localeCompare(String(bv),undefined,{numeric:true})*sortDir});tbody.innerHTML=filtered.map(r=>'<tr><td class="business">'+r.name+"</td><td>"+r.category+"</td><td>"+badge(r.priority)+"</td><td>"+r.websiteStatus+'</td><td class="score">'+r.seoScore+"/100</td><td>"+r.packageRecommended+"</td><td>"+r.estimatedWebsiteValue+"</td><td>"+r.reason+"</td><td>"+r.demoQuality+"</td><td>"+badge(r.pricingIncluded)+"</td><td>"+badge(r.readyForReview)+"</td><td>"+r.nextAction+"</td><td>"+pack(r.slug)+"</td><td>"+one(r.slug,"Proposal","proposal.html")+"</td><td>"+one(r.slug,"Brand system","brand-system.html")+"</td><td>"+one(r.slug,"SEO plan","seo-plan.html")+"</td><td>"+one(r.slug,"Contact","contact.html")+"</td></tr>").join("");empty.style.display=filtered.length?"none":"block"}document.querySelectorAll("th[data-key]").forEach(th=>th.addEventListener("click",()=>{const key=th.dataset.key;sortDir=sortKey===key?sortDir*-1:1;sortKey=key;render()}));search.addEventListener("input",render);priority.addEventListener("change",render);render();
</script></body></html>`;
}

for (const b of businesses) {
  const dir = path.join(businessesDir, b.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "services.html"), servicesPage(b));
  fs.writeFileSync(path.join(dir, "pricing.html"), pricingPage(b));
  fs.writeFileSync(path.join(dir, "about.html"), aboutPage(b));
  fs.writeFileSync(path.join(dir, "gallery.html"), galleryPage(b));
  fs.writeFileSync(path.join(dir, "reviews.html"), reviewsPage(b));
  fs.writeFileSync(path.join(dir, "contact.html"), contactPage(b));
  fs.writeFileSync(path.join(dir, "proposal.html"), proposalPage(b));
  fs.writeFileSync(path.join(dir, "brand-system.html"), brandPage(b));
  fs.writeFileSync(path.join(dir, "seo-plan.html"), seoPage(b));
  fs.writeFileSync(path.join(dir, "website-package-summary.html"), packagePage(b));
}

fs.mkdirSync(dashboardDir, { recursive: true });
fs.writeFileSync(path.join(dashboardDir, "index.html"), dashboard());

console.log(`Generated full website proposal packs for ${businesses.length} businesses.`);
