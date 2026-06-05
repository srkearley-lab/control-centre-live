const fs = require("fs");
const path = require("path");

const root = __dirname;
const businessesDir = path.join(root, "businesses");
const dashboardDir = path.join(root, "dashboard");

const businesses = [
  {
    slug: "the-orchard-cafe-brentwood",
    name: "The Orchard Cafe",
    category: "Cafe",
    location: "114 Orchard Ave, Brentwood CM13 2DP",
    priority: "High",
    websiteStatus: "No dedicated website found",
    reason: "A dedicated website could turn local cafe searches into visits, takeaway calls and menu views.",
    package: "Growth Website",
    value: "&pound;5,000",
    status: "Ready for review",
    nextAction: "Review website and proposal before manual outreach.",
    colour: "#d98f45",
    dark: "#223127",
    phone: "01277 215030",
    email: "Ask in store",
    headline: "Fresh Coffee, Brunch & Local Favourites in Brentwood"
  },
  {
    slug: "de-milia-barber-brentwood",
    name: "De'Milia Barber",
    category: "Barber",
    location: "23a Ongar Road, Brentwood CM15 9AU",
    priority: "High",
    websiteStatus: "Listing-led web presence",
    reason: "A sharper site could make services, pricing guidance and phone booking easier for Brentwood customers.",
    package: "Growth Website",
    value: "&pound;5,000",
    status: "Ready for review",
    nextAction: "Review website and proposal before manual outreach.",
    colour: "#c89b3c",
    dark: "#101820",
    phone: "01277 200008",
    email: "Ask by phone",
    headline: "Sharp Cuts, Classic Grooming & Premium Barbering in Brentwood"
  },
  {
    slug: "wagnificent-dog-groomers-brentwood",
    name: "Wagnificent Dog Groomers",
    category: "Dog Groomer",
    location: "54 Hutton Road, Brentwood CM15 8LB",
    priority: "Medium",
    websiteStatus: "Website listed; mobile journey needs review",
    reason: "A cleaner booking-focused site could increase grooming enquiries and improve trust before contact.",
    package: "Growth Website",
    value: "&pound;5,000",
    status: "Ready for review",
    nextAction: "Compare main preview with live mobile journey.",
    colour: "#e7a7a0",
    dark: "#25313d",
    phone: "07935 544063",
    email: "Ask by phone",
    headline: "Premium Dog Grooming with a Gentle Local Touch"
  },
  {
    slug: "shenfield-vehicle-services-shenfield",
    name: "Shenfield Vehicle Services",
    category: "Vehicle Services",
    location: "17A Hutton Road, Shenfield, Brentwood CM15 8JU",
    priority: "Medium",
    websiteStatus: "Dedicated site appears dated/basic",
    reason: "A clearer service and diagnostics journey could improve calls from Shenfield drivers.",
    package: "Growth Website",
    value: "&pound;5,000",
    status: "Ready for review",
    nextAction: "Review proposal, then compare against current site.",
    colour: "#f2b705",
    dark: "#17212b",
    phone: "01277 218686",
    email: "shenfieldvehicleservices@tesco.net",
    headline: "Reliable Vehicle Servicing, Diagnostics & Repairs in Shenfield"
  },
  {
    slug: "the-garage-group-essex-brentwood",
    name: "The Garage Group Essex",
    category: "Garage",
    location: "The Old Stable Yard, Sandpit Lane, Brentwood CM14 5QD",
    priority: "Medium",
    websiteStatus: "Dedicated site with dated contact journey",
    reason: "A modern service-led site could improve diagnostics, MOT and fleet enquiries.",
    package: "Growth Website",
    value: "&pound;5,000",
    status: "Ready for review",
    nextAction: "Review proposal and service positioning.",
    colour: "#2dd4bf",
    dark: "#111827",
    phone: "01277 402382",
    email: "enquiries@thegaragegroupessex.co.uk",
    headline: "Modern Vehicle Diagnostics, Servicing & Repairs in Essex"
  }
];

function esc(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function rewriteWebsiteFile(dir) {
  const demo = path.join(dir, "demo-homepage.html");
  const website = path.join(dir, "website.html");
  let html = fs.readFileSync(demo, "utf8");
  html = html.replace(/<title>.*?<\/title>/, "<title>Website Preview</title>");
  html = html.replace(/<h2>Why choose .*?<\/h2>/, "<h2>Why choose us?</h2>");
  fs.writeFileSync(website, html, "utf8");
}

function salesShell(b, title, kicker, body) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)} | ${esc(b.name)}</title>
  <style>
    :root { --dark:${b.dark}; --accent:${b.colour}; --bg:#f4f7fb; --paper:#fff; --ink:#16202a; --muted:#64748b; --line:#dbe3ee; }
    * { box-sizing:border-box; }
    body { margin:0; font-family:Inter, Arial, sans-serif; color:var(--ink); background:linear-gradient(180deg,#eef4f8,#fff 44%); line-height:1.55; }
    a { color:inherit; }
    .bar { background:#0b1118; color:#d8e2ec; padding:9px 0; font-size:13px; }
    .wrap { width:min(1160px, calc(100% - 40px)); margin:0 auto; }
    .bar .wrap, nav .wrap { display:flex; justify-content:space-between; gap:16px; align-items:center; flex-wrap:wrap; }
    nav { background:rgba(255,255,255,.94); border-bottom:1px solid var(--line); backdrop-filter:blur(16px); position:sticky; top:0; z-index:10; }
    nav .wrap { min-height:70px; }
    .brand { display:flex; align-items:center; gap:12px; text-decoration:none; font-weight:950; color:var(--dark); }
    .mark { width:42px; height:42px; display:grid; place-items:center; border-radius:8px; background:linear-gradient(135deg,var(--dark),var(--accent)); color:#fff; }
    .navlinks { display:flex; gap:10px; flex-wrap:wrap; }
    .btn { display:inline-flex; align-items:center; justify-content:center; min-height:42px; padding:0 14px; border-radius:8px; text-decoration:none; font-weight:900; border:1px solid var(--line); background:#fff; color:var(--dark); }
    .btn.primary { background:var(--accent); border-color:var(--accent); color:var(--dark); }
    .hero { background:linear-gradient(135deg,var(--dark),color-mix(in srgb,var(--accent) 40%,var(--dark))); color:#fff; padding:58px 0; }
    .hero-grid { display:grid; grid-template-columns:1fr .38fr; gap:26px; align-items:end; }
    .kicker { display:inline-flex; border:1px solid rgba(255,255,255,.25); border-radius:999px; padding:7px 11px; font-size:13px; font-weight:900; background:rgba(255,255,255,.1); margin-bottom:14px; }
    h1 { margin:0; font-size:clamp(38px,6vw,68px); line-height:1; letter-spacing:0; }
    .lead { color:#dce7ef; font-size:18px; max-width:780px; margin:16px 0 0; }
    .summary-card { border:1px solid rgba(255,255,255,.22); background:rgba(255,255,255,.1); border-radius:8px; padding:20px; }
    .summary-card strong { display:block; font-size:34px; }
    main { padding:34px 0 62px; }
    .grid { display:grid; grid-template-columns:repeat(3,1fr); gap:18px; }
    .grid.two { grid-template-columns:1fr 1fr; }
    .card { background:#fff; border:1px solid var(--line); border-radius:8px; padding:24px; box-shadow:0 16px 42px rgba(15,23,42,.07); }
    h2, h3 { color:var(--dark); margin:0 0 12px; }
    h2 { font-size:32px; line-height:1.08; }
    h3 { font-size:22px; }
    p { color:var(--muted); margin:0 0 13px; }
    ul { margin:0; padding-left:20px; color:var(--muted); }
    li { margin:7px 0; }
    .badge { display:inline-flex; border-radius:999px; padding:6px 10px; background:color-mix(in srgb,var(--accent) 18%,#fff); color:var(--dark); font-size:12px; font-weight:900; margin:0 8px 8px 0; }
    .note { border-left:4px solid var(--accent); padding:13px 15px; background:#fffaf0; border-radius:0 8px 8px 0; color:#4b5563; }
    .email-draft { white-space:pre-wrap; color:#263445; background:#fbfdff; border:1px solid var(--line); border-radius:8px; padding:18px; }
    footer { background:#0b1118; color:#bdc8d4; padding:26px 0; font-size:13px; }
    footer .wrap { display:flex; justify-content:space-between; gap:16px; flex-wrap:wrap; }
    @media(max-width:850px){ .hero-grid,.grid,.grid.two{grid-template-columns:1fr}.wrap{width:min(100% - 28px,1160px)} }
  </style>
</head>
<body>
  <div class="bar"><div class="wrap"><span>Demo concept only - created as an example website proposal.</span><span>No outreach has been sent automatically.</span></div></div>
  <nav><div class="wrap"><a class="brand" href="website.html"><span class="mark">${esc(b.name.split(" ").map(w => w[0]).join("").slice(0,2))}</span><span>${esc(b.name)}</span></a><div class="navlinks"><a class="btn" href="../../dashboard/index.html">Dashboard</a><a class="btn" href="website.html">View Website</a><a class="btn primary" href="proposal.html">Proposal</a><a class="btn" href="outreach-email.html">Email Draft</a></div></div></nav>
  <header class="hero"><div class="wrap hero-grid"><div><span class="kicker">${esc(kicker)}</span><h1>${esc(title)}</h1><p class="lead">${esc(b.reason)}</p></div><aside class="summary-card"><strong>${b.value}</strong><span>${esc(b.package)}</span></aside></div></header>
  <main class="wrap">${body}</main>
  <footer><div class="wrap"><span>${esc(b.name)} sales review pack.</span><span>Pricing and testimonials are example placeholders until verified.</span></div></footer>
</body>
</html>`;
}

function proposalPage(b) {
  const body = `
    <section class="grid two">
      <article class="card">
        <h2>Why this is a good prospect</h2>
        <p>${esc(b.reason)}</p>
        <span class="badge">${esc(b.priority)} priority</span><span class="badge">${esc(b.category)}</span><span class="badge">${esc(b.location)}</span>
      </article>
      <article class="card">
        <h2>Current opportunity</h2>
        <p><strong>Website status:</strong> ${esc(b.websiteStatus)}</p>
        <p>The opportunity is to present a cleaner, more premium customer journey with stronger service clarity, pricing guidance, trust signals and a better contact path.</p>
      </article>
    </section>
    <section class="grid section">
      <article class="card"><h3>What the new website improves</h3><ul><li>First impression and brand confidence</li><li>Service-specific content</li><li>Local SEO structure</li><li>Pricing confidence</li><li>Contact and booking journey</li></ul></article>
      <article class="card"><h3>Suggested package</h3><p><strong>${esc(b.package)} - ${b.value}</strong></p><p>Recommended because this prospect benefits from a complete sales-focused website rather than just a small one-page refresh.</p></article>
      <article class="card"><h3>What is included</h3><ul><li>One complete premium website preview</li><li>Copywriting direction</li><li>Services and pricing sections</li><li>FAQ and trust sections</li><li>Contact/booking flow</li><li>Local SEO positioning</li></ul></article>
    </section>
    <section class="card section">
      <h2>Pricing/value explanation</h2>
      <p>The suggested value is ${b.value} for a Growth Website package because this is positioned as a complete local sales system: premium website preview, stronger copy, local SEO structure, trust sections, pricing guidance, contact journey and manual outreach support.</p>
      <p>Final business pricing, service pricing and package scope should be confirmed before any real proposal is sent.</p>
    </section>
    <section class="card section">
      <h2>Suggested next step</h2>
      <p>Review the website preview, confirm the business details and pricing assumptions, then approve the outreach email manually if it is worth contacting.</p>
      <a class="btn primary" href="website.html">View Website</a>
      <a class="btn" href="../../dashboard/index.html">Back to dashboard</a>
    </section>`;
  return salesShell(b, "Sales Proposal", "Clear sales proposal", body);
}

function outreachPage(b) {
  const draft = `Hi ${b.name} team,

I was reviewing local ${b.category.toLowerCase()} businesses around ${b.location.split(",").slice(-2, -1)[0]?.trim() || "the area"} and noticed an opportunity to make your online presence feel clearer, more premium and easier for customers to act on.

I put together a simple website preview showing how your services, example pricing, trust signals and contact journey could be presented in one polished page.

The pricing shown is example pricing only and would need to be confirmed by the business.

If useful, I can send over the preview for review. No pressure either way.

Kind regards,
Shane

Opt-out: If this is not relevant, just reply and I will not follow up.`;
  const body = `
    <section class="grid two">
      <article class="card">
        <h2>Subject line options</h2>
        <ul>
          <li>Website idea for ${esc(b.name)}</li>
          <li>A cleaner website preview for ${esc(b.name)}</li>
          <li>Quick local website suggestion</li>
        </ul>
      </article>
      <article class="card">
        <h2>Approval status</h2>
        <p><strong>Not approved to send.</strong></p>
        <p>No email has been sent automatically. Shane must review and approve manually first.</p>
        <a class="btn primary" href="website.html">View Website</a>
      </article>
    </section>
    <section class="grid two section">
      <article class="card">
        <h2>Reason for contacting</h2>
        <p>${esc(b.reason)}</p>
        <p><strong>Website status:</strong> ${esc(b.websiteStatus)}</p>
      </article>
      <article class="card">
        <h2>Useful links</h2>
        <p><a class="btn primary" href="website.html">Website preview</a></p>
        <p><a class="btn" href="proposal.html">Sales proposal</a></p>
        <p><a class="btn" href="../../dashboard/index.html">Dashboard</a></p>
      </article>
    </section>
    <section class="card section">
      <h2>Final email draft</h2>
      <div class="email-draft">${esc(draft)}</div>
      <p class="note">Do not send anything automatically. Recheck contact details and tailor manually before use.</p>
    </section>`;
  return salesShell(b, "Outreach Email Draft", "Draft only - do not send", body);
}

function dashboard() {
  const data = businesses.map(b => ({
    name: b.name,
    category: b.category,
    location: b.location,
    priority: b.priority,
    websiteStatus: b.websiteStatus,
    reason: b.reason,
    package: b.package,
    value: b.value,
    status: b.status,
    nextAction: b.nextAction,
    slug: b.slug
  }));
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Website Sales Dashboard</title>
  <style>
    :root { --bg:#f4f7fb; --panel:#fff; --ink:#16202a; --muted:#64748b; --line:#dbe3ee; --accent:#23647f; --high:#a61b12; --high-bg:#ffe7e3; --medium:#835600; --medium-bg:#fff1c2; --ready:#087443; --ready-bg:#dcfce7; }
    * { box-sizing:border-box; }
    body { margin:0; font-family:Inter, Arial, sans-serif; background:var(--bg); color:var(--ink); }
    header { background:linear-gradient(135deg,#102331,#1f4157); color:#fff; padding:34px 20px 24px; }
    .wrap { max-width:1280px; margin:0 auto; }
    h1 { margin:0 0 8px; font-size:clamp(32px,5vw,58px); letter-spacing:0; }
    header p { margin:0; max-width:880px; color:#cbd7e1; font-size:17px; }
    .toolbar { display:flex; gap:12px; flex-wrap:wrap; padding:16px 20px; background:#fff; border-bottom:1px solid var(--line); position:sticky; top:0; z-index:5; }
    input, select { min-height:44px; border:1px solid var(--line); border-radius:8px; padding:0 12px; font-size:15px; background:#fff; color:var(--ink); }
    input { flex:1; min-width:min(100%, 360px); }
    main { padding:24px 20px 44px; }
    .summary { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:18px; }
    .summary article { background:#fff; border:1px solid var(--line); border-radius:8px; padding:18px; box-shadow:0 10px 28px rgba(15,23,42,.05); }
    .summary span { display:block; color:var(--muted); font-size:13px; font-weight:850; }
    .summary strong { display:block; font-size:30px; margin-top:4px; }
    .table-wrap { overflow:auto; background:var(--panel); border:1px solid var(--line); border-radius:8px; box-shadow:0 12px 34px rgba(15,23,42,.07); }
    table { width:100%; border-collapse:collapse; min-width:1180px; }
    th, td { padding:14px 12px; border-bottom:1px solid var(--line); text-align:left; vertical-align:top; }
    th { background:#f8fafc; font-size:13px; color:#334155; cursor:pointer; user-select:none; white-space:nowrap; }
    td { font-size:14px; color:#263445; }
    .business { font-weight:900; color:#0f172a; min-width:175px; }
    .reason { max-width:300px; }
    .badge { display:inline-flex; border-radius:999px; padding:5px 9px; font-size:12px; font-weight:900; white-space:nowrap; }
    .High { color:var(--high); background:var(--high-bg); }
    .Medium { color:var(--medium); background:var(--medium-bg); }
    .ready { color:var(--ready); background:var(--ready-bg); }
    .actions { display:grid; grid-template-columns:repeat(2,max-content); gap:8px; min-width:230px; }
    .actions a { text-decoration:none; color:var(--accent); border:1px solid var(--line); border-radius:8px; padding:8px 10px; background:#fbfdff; font-weight:850; white-space:nowrap; }
    .actions a.primary { background:var(--accent); color:#fff; border-color:var(--accent); }
    .empty { display:none; padding:28px; text-align:center; color:var(--muted); }
    footer { text-align:center; color:var(--muted); padding:18px 20px 34px; font-size:13px; }
    @media(max-width:850px){ .summary{grid-template-columns:repeat(2,1fr)} }
    @media(max-width:560px){ .summary{grid-template-columns:1fr} }
  </style>
</head>
<body>
  <header><div class="wrap"><h1>Website Sales Dashboard</h1><p>A clean pipeline view for reviewing five local website prospects. Each business now has one main website preview, one proposal, one email draft and a folder link.</p></div></header>
  <div class="toolbar"><input id="search" type="search" placeholder="Search business, category, location, reason, package, next action"><select id="priority"><option value="">All priorities</option><option value="High">High</option><option value="Medium">Medium</option></select></div>
  <main class="wrap">
    <section class="summary"><article><span>Businesses</span><strong>5</strong></article><article><span>Main previews</span><strong>5</strong></article><article><span>Recommended package</span><strong>Growth</strong></article><article><span>Dashboard actions</span><strong>4</strong></article></section>
    <div class="table-wrap"><table id="pipeline"><thead><tr><th data-key="name">Business</th><th data-key="category">Category</th><th data-key="location">Location</th><th data-key="priority">Priority</th><th data-key="websiteStatus">Website status</th><th data-key="reason">Reason to contact</th><th data-key="package">Recommended package</th><th data-key="value">Estimated value</th><th data-key="status">Status</th><th data-key="nextAction">Next action</th><th>Actions</th></tr></thead><tbody></tbody></table><div class="empty" id="empty">No matching prospects.</div></div>
  </main>
  <footer>No emails have been sent. Review manually before contacting any business.</footer>
  <script>
    const rows = ${JSON.stringify(data, null, 6)};
    const tbody = document.querySelector("tbody");
    const search = document.querySelector("#search");
    const priority = document.querySelector("#priority");
    const empty = document.querySelector("#empty");
    let sortKey = "priority";
    let sortDir = 1;
    function badge(value) {
      const safe = value === "Ready for review" ? "ready" : String(value).replace(/[^A-Za-z0-9_-]/g, "");
      return '<span class="badge ' + safe + '">' + value + '</span>';
    }
    function actions(slug) {
      const base = '../businesses/' + slug + '/';
      return '<div class="actions">' +
        '<a class="primary" href="' + base + 'website.html">View Website</a>' +
        '<a href="' + base + 'proposal.html">Proposal</a>' +
        '<a href="' + base + 'outreach-email.html">Email Draft</a>' +
        '<a href="' + base + '">Open Folder</a>' +
      '</div>';
    }
    function render() {
      const q = search.value.trim().toLowerCase();
      const p = priority.value;
      const filtered = rows.filter(row => {
        const haystack = Object.values(row).join(" ").toLowerCase();
        return (!p || row.priority === p) && (!q || haystack.includes(q));
      }).sort((a, b) => {
        const av = a[sortKey] || "";
        const bv = b[sortKey] || "";
        return String(av).localeCompare(String(bv), undefined, { numeric:true }) * sortDir;
      });
      tbody.innerHTML = filtered.map(row => '<tr>' +
        '<td class="business">' + row.name + '</td>' +
        '<td>' + row.category + '</td>' +
        '<td>' + row.location + '</td>' +
        '<td>' + badge(row.priority) + '</td>' +
        '<td>' + row.websiteStatus + '</td>' +
        '<td class="reason">' + row.reason + '</td>' +
        '<td>' + row.package + '</td>' +
        '<td>' + row.value + '</td>' +
        '<td>' + badge(row.status) + '</td>' +
        '<td>' + row.nextAction + '</td>' +
        '<td>' + actions(row.slug) + '</td>' +
      '</tr>').join("");
      empty.style.display = filtered.length ? "none" : "block";
    }
    document.querySelectorAll("th[data-key]").forEach(th => th.addEventListener("click", () => {
      const key = th.dataset.key;
      sortDir = sortKey === key ? sortDir * -1 : 1;
      sortKey = key;
      render();
    }));
    search.addEventListener("input", render);
    priority.addEventListener("change", render);
    render();
  </script>
</body>
</html>`;
}

for (const b of businesses) {
  const dir = path.join(businessesDir, b.slug);
  rewriteWebsiteFile(dir);
  fs.writeFileSync(path.join(dir, "proposal.html"), proposalPage(b), "utf8");
  fs.writeFileSync(path.join(dir, "outreach-email.html"), outreachPage(b), "utf8");
}

fs.mkdirSync(dashboardDir, { recursive: true });
fs.writeFileSync(path.join(dashboardDir, "index.html"), dashboard(), "utf8");

console.log("Simplified dashboard and created website.html/proposal/email files for 5 businesses.");
