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
    kicker: "Independent local cafe",
    accent: "#d98f45",
    accent2: "#8bbf9f",
    dark: "#223127",
    light: "#f8f1e8",
    texture: "soft linen, warm ceramic, counter light",
    trust: ["Fresh breakfast and lunch", "Coffee, cakes and takeaway", "Neighbourhood Brentwood location", "Call ahead for easy collection"],
    badges: ["Breakfast", "Brunch", "Coffee", "Cakes"],
    services: [
      ["All-day breakfast favourites", "Comforting cafe breakfasts, eggs, toast, grilled sides and familiar favourites prepared for a relaxed local start."],
      ["Fresh coffee and hot drinks", "Smooth coffee, tea and warming drinks for sit-in catch-ups, takeaway stops and everyday Brentwood routines."],
      ["Lunch plates and sandwiches", "Simple lunch options with fresh fillings, daily specials and satisfying plates for local workers and residents."],
      ["Cakes, pastries and sweet treats", "Counter treats and coffee-pairing favourites that make the cafe feel worth stopping for."],
      ["Takeaway and call-ahead orders", "A clear route for customers who want quick collection without searching through social posts or listings."],
      ["Small local catering enquiries", "A friendly option for office lunches, small gatherings and regular community orders."]
    ],
    signature: {
      title: "The Brentwood Brunch Table",
      text: "A warm, easy-to-order combination of fresh coffee, breakfast plates, light lunches and cakes. The section gives customers a quick reason to visit today rather than just browse.",
      points: ["Freshly prepared morning plates", "Coffee and cake pairings", "Simple takeaway ordering", "Clear opening hours"]
    },
    pricing: [
      ["Coffee & pastry", "Fresh coffee with a cake or pastry counter option.", "&pound;5-7", ""],
      ["Breakfast plate", "Cafe breakfast with eggs, toast and warm sides.", "&pound;8-12", "Popular"],
      ["Lunch special", "Sandwich, salad or hot plate with a drink option.", "&pound;9-14", ""],
      ["Cake box", "A small selection of cakes for takeaway sharing.", "&pound;10-18", ""],
      ["Small catering tray", "Simple local office or group order enquiry.", "&pound;25+", "Best value"]
    ],
    gallery: ["Counter Coffee", "Weekend Brunch", "Fresh Cakes", "Takeaway Lunch", "Cosy Corner", "Local Favourite"],
    about: "The Orchard Cafe should feel warm, independent and easy to visit. The homepage puts food, coffee, opening hours and local contact details in front of customers immediately.",
    locationCopy: "Serving Brentwood locals around Orchard Avenue, nearby residents, school runs, local workers and weekend visitors looking for breakfast, lunch, coffee and cakes.",
    reviews: [
      "A proper local cafe: warm service, good coffee and a relaxed place to stop.",
      "Fresh breakfast, friendly staff and the kind of place you want nearby.",
      "Easy to call ahead, easy to find and lovely for a quick Brentwood lunch."
    ],
    faqs: [
      ["Do you offer takeaway?", "Yes, customers can call ahead for takeaway orders and quick collection."],
      ["Do you serve breakfast all day?", "Breakfast availability should be confirmed by the business, but the menu section makes breakfast options easy to promote."],
      ["Are opening hours available?", "Yes, opening times are shown clearly with contact and location details."],
      ["Do you serve cakes and coffee?", "Yes, cakes, pastries, coffee and hot drinks are presented as core cafe favourites."],
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
    kicker: "Premium Brentwood barbering",
    accent: "#c89b3c",
    accent2: "#7f8792",
    dark: "#101820",
    light: "#f5efe4",
    texture: "polished brass, dark leather, clean mirror",
    trust: ["Classic cuts and fades", "Beard trim and shaping", "Ongar Road location", "Phone-led bookings"],
    badges: ["Cuts", "Fades", "Beards", "Grooming"],
    services: [
      ["Precision skin fades", "Clean fade work, crisp edges and a detailed finish for customers who want a sharp modern cut."],
      ["Classic barber cuts", "Traditional scissor and clipper cuts shaped for everyday style, easy maintenance and confidence."],
      ["Beard trims and line work", "Beard shaping, tidy lines and finishing touches that sharpen the full grooming look."],
      ["Restyle appointments", "A more considered cut for customers changing length, shape or overall style."],
      ["Quick tidy-ups", "Practical grooming for customers who need a clean-up between full cuts."],
      ["Regular grooming plans", "A repeat-booking friendly structure for loyal customers who want to stay sharp."]
    ],
    signature: {
      title: "The Sharp Finish Package",
      text: "A premium haircut and beard-shaping offer presented as a high-value grooming choice, ideal for customers who want the complete finish before a weekend, meeting or night out.",
      points: ["Consultation before the cut", "Fade or classic finish", "Beard line and shape", "Styling guidance"]
    },
    pricing: [
      ["Classic cut", "A clean barber cut with tidy finishing.", "&pound;18-24", ""],
      ["Skin fade", "Detailed fade work with sharp edges.", "&pound;24-30", "Popular"],
      ["Cut & beard shape", "Haircut, beard trim and finish.", "&pound;30-38", "Best value"],
      ["Beard trim", "Shape, tidy and line work.", "&pound;10-16", ""],
      ["Restyle", "Longer appointment for a new look.", "&pound;28-40", ""]
    ],
    gallery: ["Fade Detail", "Classic Chair", "Beard Shape", "Mirror Finish", "Sharp Tools", "Ready To Go"],
    about: "De'Milia Barber should feel confident, established and sharp. The homepage gives customers a premium first impression while keeping the booking route simple.",
    locationCopy: "Serving Brentwood customers around Ongar Road, town centre routes and nearby neighbourhoods looking for clean cuts, fades and grooming.",
    reviews: [
      "Sharp cut, proper attention to detail and a confident barber shop feel.",
      "Clean fade and tidy beard work. Easy to call and easy to visit.",
      "A strong local barber experience with a premium finish."
    ],
    faqs: [
      ["Do I need to book?", "Customers can call ahead to check availability or ask about appointment times."],
      ["Do you offer beard trims?", "Yes, beard trim and shaping can be shown as a clear service with pricing guidance."],
      ["Do you cut children's hair?", "Availability should be confirmed by the business before publishing final copy."],
      ["Where are you based?", "23a Ongar Road, Brentwood CM15 9AU."],
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
    kicker: "Gentle grooming in Brentwood",
    accent: "#e7a7a0",
    accent2: "#91b9b0",
    dark: "#25313d",
    light: "#f8f4ee",
    texture: "clean studio, soft towels, calm coat care",
    trust: ["Gentle appointment experience", "Bath, brush and full grooms", "Local Hutton Road studio", "Phone-led booking"],
    badges: ["Full Groom", "Bath", "Puppy", "Coat Care"],
    services: [
      ["Full groom packages", "Breed-aware grooming, trimming, styling and finishing for a comfortable, clean and smart coat."],
      ["Bath and blow dry", "A gentle refresh for dogs who need a clean coat, soft finish and tidy presentation."],
      ["Puppy introduction groom", "A calm first experience designed to build confidence around grooming routines."],
      ["Deshedding and coat care", "Support for heavy shedding, seasonal coat changes and healthier maintenance at home."],
      ["Nail trims and tidy-ups", "Quick comfort-focused appointments for paws, nails and small maintenance needs."],
      ["Owner care guidance", "Friendly advice on grooming frequency, brushing routines and coat condition."]
    ],
    signature: {
      title: "The Calm Full Groom",
      text: "A complete grooming experience positioned around comfort, coat health and a polished finish, with clear communication before and after the appointment.",
      points: ["Coat check and consultation", "Bath, dry and brush-through", "Trim and style finish", "Aftercare guidance"]
    },
    pricing: [
      ["Small dog full groom", "Full groom for smaller breeds.", "&pound;45-60", ""],
      ["Medium dog full groom", "Wash, trim, style and finish.", "&pound;55-75", "Popular"],
      ["Large dog full groom", "Longer appointment for larger coats.", "&pound;70-95", ""],
      ["Bath and brush", "Freshen-up bath, dry and brush.", "&pound;30-50", "Best value"],
      ["Nail trim", "Quick paw-care appointment.", "&pound;10-18", ""]
    ],
    gallery: ["Fresh Groom", "Soft Towels", "Puppy Visit", "Coat Care", "Bath Time", "Happy Finish"],
    about: "Wagnificent Dog Groomers should feel caring, clean and professional. The homepage reassures owners that their dog will be handled gently while making the booking route obvious.",
    locationCopy: "Serving Brentwood pet owners around Hutton Road, Shenfield, Brentwood town and nearby local neighbourhoods looking for trusted dog grooming.",
    reviews: [
      "Gentle, calm and our dog came home looking brilliant.",
      "Friendly local grooming with clear care and a lovely finish.",
      "Professional from the first call and reassuring throughout."
    ],
    faqs: [
      ["How long does a groom take?", "Timing depends on breed, coat condition and service type. Customers should call to confirm."],
      ["Do you groom nervous dogs?", "Gentle handling, appointment pacing and calm care can be discussed before booking."],
      ["Do you offer nail trims?", "Yes, nail trims and tidy-ups are included as clear service options."],
      ["How often should my dog be groomed?", "This depends on breed and coat type. The page can guide owners to ask for tailored advice."],
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
    kicker: "Trusted local vehicle care",
    accent: "#f2b705",
    accent2: "#5da7d1",
    dark: "#17212b",
    light: "#eef3f7",
    texture: "clean workshop, diagnostic screen, service bay",
    trust: ["Servicing and repairs", "Diagnostics and checks", "Hutton Road, Shenfield", "Phone and email enquiries"],
    badges: ["Service", "MOT", "Diagnostics", "Repairs"],
    services: [
      ["Interim servicing", "Routine checks and practical maintenance for drivers who want dependable day-to-day vehicle care."],
      ["Full servicing", "More complete inspection, maintenance advice and parts guidance for longer-term reliability."],
      ["Vehicle diagnostics", "Clear fault-finding for warning lights, running issues and performance concerns."],
      ["Brakes, tyres and safety checks", "Safety-led inspection and repair advice for the parts customers rely on most."],
      ["MOT preparation", "Checks and repair guidance to help customers prepare before MOT deadlines."],
      ["Repair enquiries", "A straightforward route for drivers to describe an issue and request practical advice."]
    ],
    signature: {
      title: "The Clear Diagnosis Visit",
      text: "A practical diagnostic appointment focused on explaining the issue, showing the next steps and helping customers make confident repair decisions.",
      points: ["Fault description before arrival", "Diagnostic inspection", "Clear repair recommendation", "Booking route for next steps"]
    },
    pricing: [
      ["Diagnostic check", "Fault-finding and practical advice.", "&pound;55-90", "Popular"],
      ["Interim service", "Routine maintenance and checks.", "&pound;120-180", ""],
      ["Full service", "Broader inspection and service work.", "&pound;220-320", "Best value"],
      ["Brake inspection", "Safety check and repair advice.", "&pound;35-60", ""],
      ["MOT preparation check", "Pre-MOT inspection guidance.", "&pound;45-75", ""]
    ],
    gallery: ["Diagnostics", "Service Bay", "Brake Check", "MOT Ready", "Workshop Care", "Clear Advice"],
    about: "Shenfield Vehicle Services should feel practical, trustworthy and clear. The homepage helps drivers understand what to book and how to get advice quickly.",
    locationCopy: "Serving Shenfield, Brentwood and nearby drivers who need servicing, diagnostics, MOT support, brake checks and dependable local repairs.",
    reviews: [
      "Straightforward advice, clear communication and practical service.",
      "Quick diagnosis and professional workmanship for everyday vehicle issues.",
      "A convenient Shenfield garage with helpful contact options."
    ],
    faqs: [
      ["Do you offer diagnostics?", "Yes, diagnostics are presented as a core service for warning lights and fault-finding."],
      ["Can I book a service?", "Yes, customers can call or email to ask about interim and full service availability."],
      ["Do you check brakes?", "Yes, brake checks are shown as a safety-focused service option."],
      ["Where are you based?", "17A Hutton Road, Shenfield, Brentwood CM15 8JU."],
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
    kicker: "Modern garage services",
    accent: "#2dd4bf",
    accent2: "#7c93ff",
    dark: "#111827",
    light: "#f5f7fb",
    texture: "modern workshop, diagnostics, clean metal",
    trust: ["Diagnostics and MOT support", "Servicing and repairs", "Brentwood workshop", "Fleet and trade enquiries"],
    badges: ["Diagnostics", "MOT", "Fleet", "Repairs"],
    services: [
      ["Advanced diagnostics", "Modern fault-finding and clear next steps for warning lights, performance issues and technical concerns."],
      ["MOT and servicing", "Routine maintenance, MOT preparation and service packages for local drivers."],
      ["Brakes, tyres and exhausts", "Safety-focused inspection and repair advice for essential vehicle systems."],
      ["Air conditioning support", "Comfort checks, seasonal maintenance and air conditioning service enquiries."],
      ["Fleet and trade support", "A clear service path for repeat, trade and small fleet requirements."],
      ["Repair booking", "A stronger enquiry route for customers who need quick workshop advice and practical next steps."]
    ],
    signature: {
      title: "The Modern Diagnostics Check",
      text: "A high-trust diagnostic offer for drivers who want answers quickly, with technical confidence and a simple booking route.",
      points: ["Issue capture before appointment", "Diagnostic inspection", "Repair route explained", "Follow-up booking support"]
    },
    pricing: [
      ["Diagnostic inspection", "Fault-finding and repair guidance.", "&pound;65-110", "Popular"],
      ["MOT support", "MOT test support plus repair advice if needed.", "&pound;54.85 statutory MOT test plus repairs if needed", ""],
      ["Service package", "Vehicle service options by requirement.", "&pound;180-350", "Best value"],
      ["Air con check", "Seasonal comfort and system check.", "&pound;50-90", ""],
      ["Fleet enquiry", "Repeat workshop support for local vehicles.", "Quoted", ""]
    ],
    gallery: ["Diagnostic Bay", "Workshop Team", "MOT Support", "Tyre Check", "Fleet Ready", "Clear Booking"],
    about: "The Garage Group Essex should feel bold, technical and reliable. The homepage makes specialist services easier to understand and turns workshop capability into a stronger sales journey.",
    locationCopy: "Serving Brentwood, Essex and nearby drivers looking for diagnostics, MOT support, servicing, repairs, air conditioning and fleet workshop help.",
    reviews: [
      "Clear communication and professional workmanship from first call to collection.",
      "A capable local garage with strong service options and helpful advice.",
      "Modern, practical and easy to contact for Brentwood vehicle care."
    ],
    faqs: [
      ["Do you offer diagnostics?", "Yes, diagnostics are positioned as a main service with a clear enquiry route."],
      ["Can I book servicing?", "Yes, customers can call or email to ask about service packages and workshop availability."],
      ["Do you support fleet enquiries?", "Yes, fleet and trade support is shown as a separate service path."],
      ["Where are you based?", "The Old Stable Yard, Sandpit Lane, Brentwood CM14 5QD."],
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
  const trustBadges = b.trust.map((item) => `<span>${esc(item)}</span>`).join("");
  const visualBadges = b.badges.map((item) => `<span>${esc(item)}</span>`).join("");
  const services = b.services.map(([title, text], index) => `
          <article class="service-card">
            <div class="service-icon">${String(index + 1).padStart(2, "0")}</div>
            <h3>${esc(title)}</h3>
            <p>${esc(text)}</p>
            <a href="#contact">Enquire about ${esc(title.toLowerCase())}</a>
          </article>`).join("");
  const signaturePoints = b.signature.points.map((point) => `<li>${esc(point)}</li>`).join("");
  const pricing = b.pricing.map(([title, text, price, badge]) => `
          <article class="price-card ${badge ? "highlight" : ""}">
            ${badge ? `<em>${esc(badge)}</em>` : ""}
            <h3>${esc(title)}</h3>
            <p>${esc(text)}</p>
            <strong>${price}</strong>
            <small>Example pricing - to be confirmed by the business.</small>
          </article>`).join("");
  const gallery = b.gallery.map((item, index) => `
          <article class="gallery-card gallery-card-${index + 1}">
            <div class="grain"></div>
            <span>${esc(item)}</span>
          </article>`).join("");
  const reviews = b.reviews.map((review, index) => `
          <figure>
            <div class="stars">★★★★★</div>
            <blockquote>"${esc(review)}"</blockquote>
            <figcaption>Example testimonial ${index + 1} - placeholder review, not a verified customer quote.</figcaption>
          </figure>`).join("");
  const faqs = b.faqs.map(([q, a]) => `
          <details>
            <summary>${esc(q)}</summary>
            <p>${esc(a)}</p>
          </details>`).join("");

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
      --accent2:${b.accent2};
      --light:${b.light};
      --paper:#ffffff;
      --ink:#111827;
      --muted:#5f6b7a;
      --line:#dde5ee;
      --shadow:0 28px 90px rgba(12,20,31,.18);
      --soft-shadow:0 18px 50px rgba(12,20,31,.09);
    }
    * { box-sizing:border-box; }
    html { scroll-behavior:smooth; }
    body { margin:0; color:var(--ink); background:#fff; font-family:Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif; line-height:1.5; }
    a { color:inherit; }
    .wrap { width:min(1280px, calc(100% - 44px)); margin:0 auto; }
    .demo-bar { background:#080d13; color:#d7e0ea; font-size:13px; padding:9px 0; }
    .demo-bar .wrap { display:flex; justify-content:space-between; gap:12px; flex-wrap:wrap; }
    .nav { position:sticky; top:0; z-index:30; background:rgba(255,255,255,.93); border-bottom:1px solid rgba(221,229,238,.92); backdrop-filter:blur(18px); }
    .nav-inner { min-height:76px; display:flex; align-items:center; justify-content:space-between; gap:22px; }
    .brand { display:flex; align-items:center; gap:13px; text-decoration:none; color:var(--dark); font-weight:950; font-size:18px; letter-spacing:0; }
    .mark { width:46px; height:46px; border-radius:8px; display:grid; place-items:center; background:linear-gradient(135deg,var(--dark),color-mix(in srgb,var(--accent) 56%,var(--dark))); color:#fff; box-shadow:0 14px 34px rgba(0,0,0,.18); }
    .nav-links { display:flex; align-items:center; gap:20px; color:#334155; font-size:14px; font-weight:850; }
    .nav-links a { text-decoration:none; }
    .btn { min-height:46px; display:inline-flex; align-items:center; justify-content:center; gap:8px; border-radius:8px; padding:0 20px; border:1px solid transparent; text-decoration:none; font-weight:950; white-space:nowrap; }
    .btn.primary { background:var(--accent); color:var(--dark); box-shadow:0 16px 38px color-mix(in srgb,var(--accent) 34%,transparent); }
    .btn.dark { background:var(--dark); color:#fff; }
    .btn.light { background:#fff; color:var(--dark); border-color:rgba(255,255,255,.36); }
    .btn.outline { background:transparent; border-color:var(--line); color:var(--dark); }
    .hero { position:relative; overflow:hidden; color:#fff; background:linear-gradient(135deg,var(--dark) 0%, color-mix(in srgb,var(--dark) 90%,#fff) 46%, color-mix(in srgb,var(--accent) 48%,var(--dark)) 100%); }
    .hero:before { content:""; position:absolute; inset:-20% -10% auto auto; width:72vw; height:72vw; background:radial-gradient(circle, color-mix(in srgb,var(--accent) 42%,transparent), transparent 58%); opacity:.85; }
    .hero:after { content:""; position:absolute; inset:0; background:linear-gradient(90deg,rgba(0,0,0,.36),rgba(0,0,0,.03) 62%), radial-gradient(circle at 18% 88%, color-mix(in srgb,var(--accent2) 28%,transparent), transparent 31%); }
    .hero-grid { position:relative; z-index:2; min-height:calc(100vh - 116px); display:grid; grid-template-columns:minmax(0,1.03fr) minmax(420px,.9fr); gap:56px; align-items:center; padding:72px 0 86px; }
    .kicker { display:inline-flex; padding:9px 14px; border:1px solid rgba(255,255,255,.25); border-radius:999px; color:#f0f6fb; background:rgba(255,255,255,.1); font-size:13px; font-weight:950; margin-bottom:22px; }
    h1 { margin:0; font-size:clamp(48px,7vw,92px); line-height:.94; letter-spacing:0; max-width:900px; text-wrap:balance; }
    .hero-copy { margin:24px 0 0; max-width:760px; color:#e2ebf3; font-size:clamp(18px,2vw,23px); }
    .hero-actions { display:flex; gap:13px; flex-wrap:wrap; margin-top:32px; }
    .hero-badges { display:flex; flex-wrap:wrap; gap:10px; margin-top:28px; max-width:820px; }
    .hero-badges span { border:1px solid rgba(255,255,255,.22); background:rgba(255,255,255,.1); color:#f4f8fb; border-radius:999px; padding:9px 12px; font-size:13px; font-weight:850; }
    .hero-proof { display:grid; grid-template-columns:repeat(3,1fr); gap:13px; margin-top:34px; max-width:820px; }
    .proof-card { border:1px solid rgba(255,255,255,.2); border-radius:8px; padding:17px; min-height:112px; background:rgba(255,255,255,.09); box-shadow:0 16px 42px rgba(0,0,0,.12); }
    .proof-card strong { display:block; font-size:20px; margin-bottom:5px; }
    .proof-card span { display:block; color:#cbd8e3; font-size:13px; }
    .hero-visual { min-height:620px; position:relative; perspective:1200px; }
    .visual-stage { position:absolute; inset:0; border-radius:8px; border:1px solid rgba(255,255,255,.24); background:linear-gradient(145deg,rgba(255,255,255,.18),rgba(255,255,255,.05)); box-shadow:var(--shadow); overflow:hidden; transform:rotateY(-3deg) rotateX(1deg); }
    .visual-stage:before { content:""; position:absolute; inset:24px; border:1px solid rgba(255,255,255,.24); border-radius:8px; }
    .hero-photo { position:absolute; inset:42px 44px 190px 44px; border-radius:8px; overflow:hidden; background:linear-gradient(135deg,color-mix(in srgb,var(--accent) 72%,#fff),color-mix(in srgb,var(--dark) 92%,#000)); box-shadow:0 32px 80px rgba(0,0,0,.28); }
    .hero-photo:before { content:""; position:absolute; inset:0; background:linear-gradient(135deg,rgba(255,255,255,.34),transparent 30%), repeating-linear-gradient(135deg,rgba(255,255,255,.13) 0 2px,transparent 2px 20px); }
    .hero-photo:after { content:"${esc(b.texture)}"; position:absolute; left:26px; right:26px; bottom:24px; color:#fff; font-size:clamp(34px,4vw,56px); font-weight:950; line-height:.96; text-transform:capitalize; text-shadow:0 12px 36px rgba(0,0,0,.32); }
    .floating-card { position:absolute; right:22px; top:86px; width:190px; border-radius:8px; padding:16px; background:rgba(255,255,255,.94); color:var(--dark); box-shadow:0 22px 58px rgba(0,0,0,.24); z-index:4; }
    .floating-card strong { display:block; font-size:28px; line-height:1; }
    .floating-card span { color:var(--muted); font-size:12px; font-weight:800; }
    .visual-badges { position:absolute; left:44px; right:44px; bottom:42px; display:grid; grid-template-columns:repeat(4,1fr); gap:12px; }
    .visual-badges span { min-height:108px; display:flex; align-items:flex-end; padding:14px; border-radius:8px; background:rgba(255,255,255,.93); color:var(--dark); font-weight:950; box-shadow:0 18px 42px rgba(0,0,0,.18); }
    .trust-strip { background:#fff; border-bottom:1px solid var(--line); }
    .trust-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; padding:20px 0; }
    .trust-grid span { display:flex; align-items:center; gap:10px; font-weight:900; color:var(--dark); }
    .trust-grid span:before { content:""; width:12px; height:12px; border-radius:50%; background:var(--accent); box-shadow:0 0 0 5px color-mix(in srgb,var(--accent) 18%,transparent); flex:0 0 auto; }
    section { padding:88px 0; }
    .band { background:var(--light); }
    .section-head { display:flex; justify-content:space-between; align-items:flex-end; gap:28px; margin-bottom:36px; }
    .section-head h2 { margin:0; color:var(--dark); font-size:clamp(34px,4.4vw,62px); line-height:1.02; letter-spacing:0; max-width:760px; text-wrap:balance; }
    .section-head p { margin:0; color:var(--muted); max-width:570px; font-size:17px; }
    .services-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:18px; }
    .service-card { position:relative; overflow:hidden; min-height:286px; background:#fff; border:1px solid var(--line); border-radius:8px; padding:28px; box-shadow:var(--soft-shadow); transition:transform .2s ease, box-shadow .2s ease; }
    .service-card:hover { transform:translateY(-3px); box-shadow:0 28px 70px rgba(12,20,31,.13); }
    .service-card:after { content:""; position:absolute; right:-44px; top:-44px; width:150px; height:150px; border-radius:50%; background:color-mix(in srgb,var(--accent) 17%,transparent); }
    .service-icon { width:48px; height:48px; border-radius:8px; display:grid; place-items:center; background:var(--dark); color:#fff; font-weight:950; margin-bottom:24px; }
    .service-card h3 { margin:0 0 12px; color:var(--dark); font-size:24px; line-height:1.12; position:relative; z-index:1; }
    .service-card p { margin:0 0 20px; color:var(--muted); position:relative; z-index:1; }
    .service-card a { color:var(--dark); font-weight:950; text-decoration:none; border-bottom:2px solid var(--accent); position:relative; z-index:1; }
    .signature { display:grid; grid-template-columns:1fr .86fr; gap:28px; align-items:stretch; }
    .signature-copy { background:var(--dark); color:#fff; border-radius:8px; padding:42px; min-height:460px; position:relative; overflow:hidden; }
    .signature-copy:after { content:""; position:absolute; right:-100px; bottom:-100px; width:330px; height:330px; border-radius:50%; background:var(--accent); opacity:.34; }
    .signature-copy h2 { margin:0 0 16px; font-size:clamp(34px,4vw,56px); line-height:1.03; position:relative; z-index:1; }
    .signature-copy p { color:#dce6ef; font-size:18px; max-width:670px; position:relative; z-index:1; }
    .signature-copy ul { position:relative; z-index:1; list-style:none; padding:0; margin:30px 0 0; display:grid; gap:12px; }
    .signature-copy li { border:1px solid rgba(255,255,255,.2); background:rgba(255,255,255,.08); border-radius:8px; padding:14px 16px; font-weight:850; }
    .signature-visual { border-radius:8px; overflow:hidden; min-height:460px; background:linear-gradient(135deg,color-mix(in srgb,var(--accent2) 55%,#fff),color-mix(in srgb,var(--accent) 70%,var(--dark))); box-shadow:var(--shadow); position:relative; }
    .signature-visual:before { content:""; position:absolute; inset:24px; border:1px solid rgba(255,255,255,.34); border-radius:8px; }
    .signature-visual:after { content:"${esc(b.signature.title)}"; position:absolute; left:34px; bottom:34px; right:34px; color:#fff; font-size:clamp(34px,4vw,58px); line-height:.98; font-weight:950; text-shadow:0 16px 44px rgba(0,0,0,.3); }
    .pricing-grid { display:grid; grid-template-columns:repeat(5,1fr); gap:16px; align-items:stretch; }
    .price-card { position:relative; display:flex; flex-direction:column; justify-content:space-between; gap:22px; min-height:330px; background:#fff; border:1px solid var(--line); border-radius:8px; padding:26px; box-shadow:var(--soft-shadow); }
    .price-card.highlight { border-color:color-mix(in srgb,var(--accent) 72%,var(--line)); box-shadow:0 24px 64px color-mix(in srgb,var(--accent) 18%,transparent); transform:translateY(-8px); }
    .price-card em { align-self:flex-start; border-radius:999px; padding:6px 10px; background:var(--dark); color:#fff; font-size:12px; font-style:normal; font-weight:950; }
    .price-card h3 { margin:0; color:var(--dark); font-size:22px; line-height:1.1; }
    .price-card p { color:var(--muted); margin:0; }
    .price-card strong { color:var(--dark); font-size:clamp(26px,2.4vw,36px); line-height:1.06; }
    .price-card small { color:#748092; }
    .pricing-cta { margin-top:24px; padding:24px; border-radius:8px; background:#fff; border:1px solid var(--line); display:flex; justify-content:space-between; align-items:center; gap:18px; box-shadow:var(--soft-shadow); }
    .pricing-cta p { margin:0; color:var(--muted); }
    .why-grid { display:grid; grid-template-columns:1fr 1fr 1fr; gap:18px; }
    .why-card { background:#fff; border:1px solid var(--line); border-radius:8px; padding:30px; min-height:250px; box-shadow:var(--soft-shadow); }
    .why-card span { display:inline-grid; place-items:center; width:46px; height:46px; background:color-mix(in srgb,var(--accent) 22%,#fff); color:var(--dark); border-radius:8px; font-weight:950; margin-bottom:22px; }
    .why-card h3 { color:var(--dark); margin:0 0 10px; font-size:24px; }
    .why-card p { margin:0; color:var(--muted); }
    .gallery-grid { display:grid; grid-template-columns:1.2fr .8fr .8fr; grid-auto-rows:260px; gap:18px; }
    .gallery-card { position:relative; overflow:hidden; border-radius:8px; min-height:240px; box-shadow:0 22px 60px rgba(12,20,31,.14); background:linear-gradient(135deg,color-mix(in srgb,var(--accent) 62%,#fff),color-mix(in srgb,var(--dark) 88%,#000)); }
    .gallery-card:first-child { grid-row:span 2; }
    .gallery-card:nth-child(4) { grid-column:span 2; }
    .gallery-card:before { content:""; position:absolute; inset:0; background:linear-gradient(135deg,rgba(255,255,255,.3),transparent 30%), repeating-linear-gradient(135deg,rgba(255,255,255,.12) 0 2px,transparent 2px 22px); }
    .gallery-card:after { content:""; position:absolute; inset:20px; border:1px solid rgba(255,255,255,.35); border-radius:8px; }
    .gallery-card span { position:absolute; left:26px; bottom:24px; right:24px; color:#fff; font-size:clamp(26px,4vw,54px); line-height:.98; font-weight:950; text-shadow:0 14px 34px rgba(0,0,0,.28); }
    .about-location { display:grid; grid-template-columns:1fr 1fr; gap:24px; }
    .about-card, .location-card { background:#fff; border:1px solid var(--line); border-radius:8px; padding:34px; box-shadow:var(--soft-shadow); }
    .about-card h2, .location-card h2 { margin:0 0 14px; color:var(--dark); font-size:clamp(30px,3.5vw,48px); line-height:1.04; }
    .about-card p, .location-card p { color:var(--muted); font-size:17px; margin:0 0 18px; }
    .map-panel { min-height:250px; border-radius:8px; overflow:hidden; position:relative; background:linear-gradient(135deg,color-mix(in srgb,var(--accent2) 36%,#fff),color-mix(in srgb,var(--dark) 84%,#000)); }
    .map-panel:before { content:""; position:absolute; inset:0; background:linear-gradient(90deg,rgba(255,255,255,.14) 1px,transparent 1px), linear-gradient(0deg,rgba(255,255,255,.14) 1px,transparent 1px); background-size:44px 44px; }
    .map-panel:after { content:"${esc(b.area)}"; position:absolute; left:24px; bottom:22px; color:#fff; font-size:46px; font-weight:950; }
    .reviews-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:18px; }
    figure { margin:0; background:#fff; border:1px solid var(--line); border-radius:8px; padding:30px; box-shadow:var(--soft-shadow); }
    .stars { color:var(--accent); font-size:18px; margin-bottom:18px; letter-spacing:0; }
    blockquote { color:var(--dark); font-size:21px; line-height:1.34; font-weight:850; margin:0 0 20px; }
    figcaption { color:var(--muted); font-size:13px; }
    .faq-contact { display:grid; grid-template-columns:1fr .92fr; gap:24px; align-items:start; }
    .faq-card, .contact-card { background:#fff; border:1px solid var(--line); border-radius:8px; padding:34px; box-shadow:var(--soft-shadow); }
    .faq-card h2, .contact-card h2 { margin:0 0 18px; color:var(--dark); font-size:clamp(30px,3.6vw,50px); line-height:1.04; }
    details { border:1px solid var(--line); border-radius:8px; padding:17px 18px; margin-bottom:12px; background:#fbfdff; }
    summary { cursor:pointer; color:var(--dark); font-weight:950; }
    details p { color:var(--muted); margin:12px 0 0; }
    .contact-lines { display:grid; gap:12px; margin:24px 0; }
    .contact-lines div { border:1px solid var(--line); border-radius:8px; padding:15px; background:#fbfdff; }
    .contact-lines strong { display:block; color:var(--muted); font-size:13px; margin-bottom:4px; }
    .final-cta { color:#fff; background:linear-gradient(135deg,var(--dark),color-mix(in srgb,var(--accent) 42%,var(--dark))); position:relative; overflow:hidden; }
    .final-cta:before { content:""; position:absolute; right:-90px; top:-140px; width:430px; height:430px; border-radius:50%; background:var(--accent); opacity:.3; }
    .final-grid { position:relative; display:grid; grid-template-columns:1fr auto; align-items:center; gap:32px; }
    .final-cta h2 { margin:0 0 14px; font-size:clamp(38px,5vw,70px); line-height:.98; max-width:850px; }
    .final-cta p { margin:0; color:#dce7ef; max-width:760px; font-size:18px; }
    .final-actions { display:flex; flex-direction:column; gap:12px; min-width:280px; }
    footer { background:#080d13; color:#c7d1dc; padding:48px 0 24px; }
    .footer-grid { display:grid; grid-template-columns:1.2fr .85fr .85fr .85fr; gap:28px; padding-bottom:30px; border-bottom:1px solid rgba(255,255,255,.12); }
    footer h2, footer h3 { color:#fff; margin:0 0 12px; }
    footer p { margin:0 0 10px; color:#c7d1dc; }
    footer a { color:#fff; text-decoration:none; }
    .footer-bottom { display:flex; justify-content:space-between; gap:16px; flex-wrap:wrap; padding-top:18px; color:#96a3b1; font-size:13px; }
    @media (max-width:1120px) {
      .hero-grid, .signature, .about-location, .faq-contact, .final-grid { grid-template-columns:1fr; }
      .hero-grid { min-height:auto; }
      .hero-visual { min-height:580px; }
      .services-grid, .why-grid, .reviews-grid { grid-template-columns:repeat(2,1fr); }
      .pricing-grid { grid-template-columns:repeat(3,1fr); }
      .footer-grid { grid-template-columns:1fr 1fr; }
    }
    @media (max-width:820px) {
      .wrap { width:min(100% - 30px,1280px); }
      .nav-inner { min-height:auto; padding:14px 0; align-items:flex-start; }
      .nav-links { display:none; }
      .hero-grid { padding:50px 0 58px; gap:32px; }
      .hero-proof, .trust-grid, .services-grid, .pricing-grid, .why-grid, .gallery-grid, .reviews-grid, .footer-grid { grid-template-columns:1fr; }
      .hero-visual { min-height:470px; }
      .visual-stage { transform:none; }
      .hero-photo { inset:26px 26px 154px 26px; }
      .floating-card { right:18px; top:52px; width:150px; }
      .visual-badges { left:26px; right:26px; bottom:26px; grid-template-columns:repeat(2,1fr); }
      .visual-badges span { min-height:66px; font-size:13px; }
      section { padding:62px 0; }
      .section-head { display:block; }
      .section-head p { margin-top:12px; }
      .price-card.highlight { transform:none; }
      .pricing-cta { display:block; }
      .pricing-cta .btn { margin-top:16px; }
      .gallery-card:first-child, .gallery-card:nth-child(4) { grid-row:auto; grid-column:auto; }
      .final-actions { min-width:0; }
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

  <nav class="nav">
    <div class="wrap nav-inner">
      <a class="brand" href="#"><span class="mark">${esc(b.initials)}</span><span>${esc(b.name)}</span></a>
      <div class="nav-links">
        <a href="#services">Services</a>
        <a href="#pricing">Pricing</a>
        <a href="#proof">Gallery</a>
        <a href="#faq">FAQ</a>
        <a href="#contact">Contact</a>
        <a class="btn dark" href="tel:${esc(tel(b.phone))}">Call ${esc(b.phone)}</a>
      </div>
    </div>
  </nav>

  <header class="hero">
    <div class="wrap hero-grid">
      <div>
        <span class="kicker">${esc(b.kicker)} in ${esc(b.area)}</span>
        <h1>${esc(b.headline)}</h1>
        <p class="hero-copy">${esc(b.subline)}</p>
        <div class="hero-actions">
          <a class="btn primary" href="#contact">Book or enquire today</a>
          <a class="btn light" href="#services">Explore services</a>
        </div>
        <div class="hero-badges">${visualBadges}</div>
        <div class="hero-proof">
          <div class="proof-card"><strong>Local</strong><span>${esc(b.location)}</span></div>
          <div class="proof-card"><strong>Clear</strong><span>Services, pricing guidance and opening details are easy to scan.</span></div>
          <div class="proof-card"><strong>Direct</strong><span>Call ${esc(b.phone)} for bookings, questions and availability.</span></div>
        </div>
      </div>
      <div class="hero-visual" aria-label="${esc(b.name)} premium visual composition">
        <div class="visual-stage">
          <div class="hero-photo"></div>
          <div class="floating-card"><strong>${esc(b.area)}</strong><span>Local customers served with care</span></div>
          <div class="visual-badges">${visualBadges}</div>
        </div>
      </div>
    </div>
  </header>

  <div class="trust-strip">
    <div class="wrap trust-grid">${trustBadges}</div>
  </div>

  <main>
    <section id="services" class="band">
      <div class="wrap">
        <div class="section-head">
          <h2>Services shaped around what local customers actually need.</h2>
          <p>Each service is presented with a clear benefit, practical detail and a direct enquiry route so visitors can make a decision quickly.</p>
        </div>
        <div class="services-grid">${services}
        </div>
      </div>
    </section>

    <section>
      <div class="wrap signature">
        <div class="signature-copy">
          <h2>${esc(b.signature.title)}</h2>
          <p>${esc(b.signature.text)}</p>
          <ul>${signaturePoints}</ul>
        </div>
        <div class="signature-visual" aria-label="${esc(b.signature.title)} visual"></div>
      </div>
    </section>

    <section id="pricing" class="band">
      <div class="wrap">
        <div class="section-head">
          <h2>Simple pricing guidance that helps customers choose.</h2>
          <p>Indicative pricing makes the buying journey feel transparent while keeping final figures open for confirmation by the business.</p>
        </div>
        <div class="pricing-grid">${pricing}
        </div>
        <div class="pricing-cta">
          <p><strong>Not sure what you need?</strong><br>Call ${esc(b.phone)} and ask which option fits your visit, booking or enquiry.</p>
          <a class="btn dark" href="tel:${esc(tel(b.phone))}">Ask about pricing</a>
        </div>
      </div>
    </section>

    <section>
      <div class="wrap">
        <div class="section-head">
          <h2>Why choose ${esc(b.name)}?</h2>
          <p>Strong local homepages need trust before the customer makes contact. These proof points make the business feel established, helpful and easy to choose.</p>
        </div>
        <div class="why-grid">
          <article class="why-card"><span>01</span><h3>Local and easy to reach</h3><p>${esc(b.location)} is placed clearly throughout the site so customers know exactly where to go.</p></article>
          <article class="why-card"><span>02</span><h3>Clear before contact</h3><p>Services, pricing guidance, hours and answers are available before customers need to call.</p></article>
          <article class="why-card"><span>03</span><h3>Built for conversion</h3><p>Every major section gives visitors a confident next step: call, enquire, visit or ask a question.</p></article>
        </div>
      </div>
    </section>

    <section id="proof" class="band">
      <div class="wrap">
        <div class="section-head">
          <h2>Visual proof that feels premium and business-specific.</h2>
          <p>Designed image-style panels give the site a polished commercial feel without relying on copyrighted photography or broken image links.</p>
        </div>
        <div class="gallery-grid">${gallery}
        </div>
      </div>
    </section>

    <section>
      <div class="wrap about-location">
        <article class="about-card">
          <h2>About ${esc(b.name)}</h2>
          <p>${esc(b.about)}</p>
          <p>The layout keeps the business voice direct, local and useful, with no friction between interest and enquiry.</p>
          <a class="btn outline" href="#contact">Contact ${esc(b.name)}</a>
        </article>
        <article class="location-card">
          <h2>${esc(b.area)} location</h2>
          <p>${esc(b.locationCopy)}</p>
          <div class="map-panel" aria-label="${esc(b.area)} location visual"></div>
        </article>
      </div>
    </section>

    <section class="band">
      <div class="wrap">
        <div class="section-head">
          <h2>Customer confidence before the first call.</h2>
          <p>Testimonials are shown as examples only and should be replaced with verified reviews before any live launch.</p>
        </div>
        <div class="reviews-grid">${reviews}
        </div>
      </div>
    </section>

    <section id="faq">
      <div class="wrap faq-contact">
        <div class="faq-card">
          <h2>Frequently asked questions</h2>${faqs}
        </div>
        <div class="contact-card" id="contact">
          <h2>Call, visit or send an enquiry.</h2>
          <p>Everything a customer needs is grouped together so they can take action without scrolling back through the page.</p>
          <div class="contact-lines">
            <div><strong>Address</strong>${esc(b.location)}</div>
            <div><strong>Phone</strong><a href="tel:${esc(tel(b.phone))}">${esc(b.phone)}</a></div>
            <div><strong>Email</strong>${esc(b.email)}</div>
            <div><strong>Area served</strong>${esc(b.area)} and nearby local customers</div>
          </div>
          <a class="btn primary" href="tel:${esc(tel(b.phone))}">Call now</a>
        </div>
      </div>
    </section>

    <section class="final-cta">
      <div class="wrap final-grid">
        <div>
          <h2>Ready to make your next visit simple?</h2>
          <p>Speak directly with ${esc(b.name)} for availability, questions, bookings and local advice. Clear service, clear location and a simple next step.</p>
        </div>
        <div class="final-actions">
          <a class="btn primary" href="tel:${esc(tel(b.phone))}">Call ${esc(b.phone)}</a>
          <a class="btn light" href="#pricing">Check example pricing</a>
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
        <h3>Services</h3>
        <p>${esc(b.services[0][0])}</p>
        <p>${esc(b.services[1][0])}</p>
        <p>${esc(b.services[2][0])}</p>
      </div>
      <div>
        <h3>Visit</h3>
        <p>${esc(b.area)} local service</p>
        <p>Call before travelling to confirm availability.</p>
      </div>
    </div>
    <div class="wrap footer-bottom">
      <span>Example pricing - to be confirmed by the business.</span>
      <span>Example testimonials are placeholders and not verified customer quotes.</span>
    </div>
  </footer>
</body>
</html>`;
}

for (const business of businesses) {
  const file = path.join(businessesDir, business.slug, "demo-homepage.html");
  fs.writeFileSync(file, render(business), "utf8");
}

console.log(`Upgraded ${businesses.length} demo homepages to A+ layouts.`);
