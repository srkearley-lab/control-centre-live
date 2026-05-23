function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8"
    }
  });
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toBase64(value) {
  return btoa(unescape(encodeURIComponent(value)));
}

function fromBase64(value) {
  return decodeURIComponent(escape(atob(value)));
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getGitHubConfig(env) {
  const owner = env.GITHUB_OWNER;
  const repo = env.GITHUB_REPO;
  const branch = env.GITHUB_BRANCH || "main";
  const token = env.GITHUB_TOKEN;

  if (!owner || !repo || !branch || !token) {
    throw new Error("Missing GitHub environment variables.");
  }

  return { owner, repo, branch, token };
}

function githubHeaders(token) {
  return {
    "authorization": `Bearer ${token}`,
    "accept": "application/vnd.github+json",
    "content-type": "application/json",
    "user-agent": "control-centre-live"
  };
}

async function githubFileExists(env, path) {
  const { owner, repo, branch, token } = getGitHubConfig(env);
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${encodeURIComponent(branch)}`;

  const response = await fetch(url, {
    method: "GET",
    headers: githubHeaders(token)
  });

  if (response.status === 404) {
    return false;
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GitHub lookup failed: ${response.status} ${text}`);
  }

  return true;
}

async function githubGetFile(env, path) {
  const { owner, repo, branch, token } = getGitHubConfig(env);
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${encodeURIComponent(branch)}`;

  const response = await fetch(url, {
    method: "GET",
    headers: githubHeaders(token)
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(`GitHub file fetch failed: ${response.status} ${text}`);
  }

  const data = JSON.parse(text);

  return {
    sha: data.sha,
    content: fromBase64(String(data.content || "").replace(/\s/g, ""))
  };
}

async function githubPutFile(env, path, content, message, sha) {
  const { owner, repo, branch, token } = getGitHubConfig(env);
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  const body = {
    message,
    content: toBase64(content),
    branch
  };

  if (sha) {
    body.sha = sha;
  }

  const response = await fetch(url, {
    method: "PUT",
    headers: githubHeaders(token),
    body: JSON.stringify(body)
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(`GitHub write failed: ${response.status} ${text}`);
  }

  return JSON.parse(text);
}

function inferCategory(description) {
  const text = String(description || "").toLowerCase();

  if (/(garden room|garden office|outbuilding|installer|construction|builder)/.test(text)) return "Garden Rooms";
  if (/(coach|wellbeing|confidence|stress|therapy|therapist|counsellor|counselor)/.test(text)) return "Wellbeing";
  if (/(personal trainer|fitness|gym|pilates|yoga)/.test(text)) return "Fitness";
  if (/(cafe|coffee|restaurant|food|takeaway|bakery)/.test(text)) return "Cafe";
  if (/(barber|hair|salon|beauty)/.test(text)) return "Barber";
  if (/(dog|groom|pet)/.test(text)) return "Dog Groomer";
  if (/(garage|vehicle|car|mot|mechanic|diagnostic)/.test(text)) return "Vehicle Services";

  return "Local Service";
}

function inferLocation(businessName, description) {
  const text = `${businessName} ${description}`.toLowerCase();

  if (text.includes("ingatestone")) return "Ingatestone / Brentwood";
  if (text.includes("shenfield")) return "Shenfield / Brentwood";
  if (text.includes("hutton")) return "Hutton / Brentwood";
  if (text.includes("brentwood")) return "Brentwood";
  if (text.includes("essex")) return "Essex";

  return "Local area";
}

function initialsForName(name) {
  return String(name || "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0].toUpperCase())
    .join("") || "LB";
}

function dashboardRowForProspect({ businessName, slug, websiteUrl, description }) {
  const noWebsite = !websiteUrl || /^(no website|none|n\/a)$/i.test(websiteUrl.trim());
  const category = inferCategory(description);
  const location = inferLocation(businessName, description);

  return {
    slug,
    name: businessName,
    initials: initialsForName(businessName),
    category,
    location,
    priority: noWebsite ? "High" : "Medium",
    websiteStatus: noWebsite ? "No dedicated website found" : "Website provided - review recommended",
    websiteScore: noWebsite ? 52 : 64,
    score: noWebsite ? 61 : 68,
    reason: `New prospect created from Add New Prospect. ${description}`,
    contactFound: "Needs manual check",
    emailDraft: "Drafted",
    websiteReady: "Ready",
    status: "Ready for review",
    nextAction: "Review website, proposal and email draft before manual outreach.",
    folderPath: `businesses/${slug}`
  };
}

function replaceFirstCountBeforeLabel(html, label, value) {
  const pattern = new RegExp(`(<strong>)\\d+(<\\/strong><span>${label}<\\/span>)`);
  return html.replace(pattern, `$1${value}$2`);
}

function replaceFirstCountAfterText(html, text, value) {
  const pattern = new RegExp(`(${text}<\\/span><b class="count">)\\d+(<\\/b>)`);
  return html.replace(pattern, `$1${value}$2`);
}

function ensureCategoryFilter(html, category) {
  const option = `<option>${category}</option>`;

  if (html.includes(option)) {
    return html;
  }

  return html.replace(/(<select class="control" id="category">[\s\S]*?)(<\/select>\s*<select class="control" id="status")/, `$1${option}$2`);
}

function updateDashboardHtml(html, newRow) {
  if (html.includes(`"slug": "${newRow.slug}"`) || html.includes(`'slug': '${newRow.slug}'`)) {
    return {
      duplicate: true,
      html
    };
  }

  const rowsStart = html.indexOf("    const rows = [");
  const rowsEnd = html.indexOf("\n];", rowsStart);

  if (rowsStart === -1 || rowsEnd === -1) {
    throw new Error("Could not find dashboard rows array.");
  }

  const rowJson = JSON.stringify(newRow, null, 12);
  const beforeRowsEnd = html.slice(0, rowsEnd);
  const afterRowsEnd = html.slice(rowsEnd);
  const needsComma = !beforeRowsEnd.trimEnd().endsWith("[");
  let updated = `${beforeRowsEnd}${needsComma ? "," : ""}\n      ${rowJson}${afterRowsEnd}`;
  const totalMatches = Array.from(updated.matchAll(/"slug":\s*"[^"]+"/g));
  const total = totalMatches.length;
  const highPriority = Array.from(updated.matchAll(/"priority":\s*"High"/g)).length;
  const websitesReady = Array.from(updated.matchAll(/"websiteReady":\s*"Ready"/g)).length;
  const emailsDrafted = Array.from(updated.matchAll(/"emailDraft":\s*"Drafted"/g)).length;
  const readyForReview = Array.from(updated.matchAll(/"status":\s*"Ready for review"/g)).length;
  const mediumPriority = Math.max(total - highPriority, 0);

  updated = replaceFirstCountBeforeLabel(updated, "Total Prospects", total);
  updated = replaceFirstCountBeforeLabel(updated, "High Priority", highPriority);
  updated = replaceFirstCountBeforeLabel(updated, "Websites Ready", websitesReady);
  updated = replaceFirstCountBeforeLabel(updated, "Emails Drafted", emailsDrafted);
  updated = replaceFirstCountBeforeLabel(updated, "Ready For Review", readyForReview);
  updated = updated.replace(/<span style="--c:var\(--red\)">High Priority: \d+<\/span>/g, `<span style="--c:var(--red)">High Priority: ${highPriority}</span>`);
  updated = updated.replace(/<span style="--c:var\(--amber\)">Medium Priority: \d+<\/span>/g, `<span style="--c:var(--amber)">Medium Priority: ${mediumPriority}</span>`);
  updated = replaceFirstCountAfterText(updated, "High priority", highPriority);
  updated = replaceFirstCountAfterText(updated, "Medium priority", mediumPriority);
  updated = replaceFirstCountAfterText(updated, "Ready", websitesReady);
  updated = replaceFirstCountAfterText(updated, "Drafted", emailsDrafted);
  updated = updated.replace(/\d+ high-quality local business prospects/g, `${total} high-quality local business prospects`);
  updated = ensureCategoryFilter(updated, newRow.category);

  return {
    duplicate: false,
    html: updated
  };
}

function buildIndexHtml() {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Redirecting...</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="refresh" content="0; url=website.html">
  <link rel="canonical" href="website.html">
</head>
<body>
  <p><a href="website.html">Open website preview</a></p>
</body>
</html>
`;
}

function buildWebsiteHtml({ businessName, websiteUrl, description, notes }) {
  const safeName = escapeHtml(businessName);
  const safeWebsite = escapeHtml(websiteUrl || "No website");
  const safeDescription = escapeHtml(description);
  const safeNotes = escapeHtml(notes || "No additional notes yet.");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${safeName} | Local Business Website Concept</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Website concept for ${safeName}.">
  <style>
    :root {
      color-scheme: light;
      --ink: #102033;
      --muted: #526173;
      --line: #d9e2ec;
      --brand: #1267d8;
      --brand-dark: #0b3b78;
      --soft: #eef5ff;
      --panel: #ffffff;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: Arial, sans-serif;
      color: var(--ink);
      background: #f7f9fc;
      line-height: 1.6;
    }
    a { color: inherit; }
    .shell {
      width: min(1120px, calc(100% - 40px));
      margin: 0 auto;
    }
    header {
      background: linear-gradient(135deg, var(--brand-dark), var(--brand));
      color: #fff;
      padding: 28px 0 84px;
    }
    nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
      margin-bottom: 72px;
    }
    .brand {
      font-size: 20px;
      font-weight: 800;
      letter-spacing: .02em;
    }
    .nav-note {
      color: rgba(255,255,255,.78);
      font-size: 14px;
    }
    .hero {
      display: grid;
      grid-template-columns: minmax(0, 1.25fr) minmax(280px, .75fr);
      gap: 40px;
      align-items: center;
    }
    h1 {
      margin: 0 0 18px;
      font-size: clamp(40px, 7vw, 76px);
      line-height: .96;
      letter-spacing: 0;
    }
    .lead {
      max-width: 680px;
      margin: 0 0 28px;
      color: rgba(255,255,255,.88);
      font-size: 20px;
    }
    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }
    .button {
      display: inline-flex;
      min-height: 48px;
      align-items: center;
      justify-content: center;
      border-radius: 999px;
      padding: 12px 20px;
      text-decoration: none;
      font-weight: 800;
    }
    .primary { background: #fff; color: var(--brand-dark); }
    .secondary { border: 1px solid rgba(255,255,255,.35); color: #fff; }
    .visual {
      min-height: 320px;
      border: 1px solid rgba(255,255,255,.25);
      border-radius: 24px;
      background:
        linear-gradient(135deg, rgba(255,255,255,.18), rgba(255,255,255,.05)),
        repeating-linear-gradient(135deg, rgba(255,255,255,.12) 0 12px, transparent 12px 24px);
      display: grid;
      place-items: center;
      text-align: center;
      padding: 28px;
      box-shadow: 0 24px 80px rgba(0,0,0,.25);
    }
    .visual strong {
      display: block;
      font-size: 26px;
      margin-bottom: 8px;
    }
    main { margin-top: -44px; }
    section {
      padding: 54px 0;
    }
    .panel {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 24px;
      padding: 34px;
      box-shadow: 0 18px 50px rgba(15, 33, 58, .08);
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 18px;
    }
    .card {
      background: #fff;
      border: 1px solid var(--line);
      border-radius: 18px;
      padding: 24px;
    }
    h2 {
      margin: 0 0 16px;
      font-size: 32px;
      line-height: 1.1;
    }
    h3 {
      margin: 0 0 10px;
      font-size: 20px;
    }
    p { margin: 0 0 14px; }
    .muted { color: var(--muted); }
    .seo {
      background: var(--soft);
      border-block: 1px solid #d7e8ff;
    }
    .cta {
      text-align: center;
      padding-bottom: 78px;
    }
    .cta .panel {
      background: var(--brand-dark);
      color: #fff;
    }
    .meta {
      margin-top: 20px;
      color: rgba(255,255,255,.74);
      font-size: 14px;
    }
    footer {
      padding: 28px 0;
      color: var(--muted);
      border-top: 1px solid var(--line);
      background: #fff;
      font-size: 14px;
    }
    @media (max-width: 820px) {
      body { background: #fff; }
      .hero, .grid { grid-template-columns: 1fr; }
      header { padding-bottom: 54px; }
      nav { margin-bottom: 44px; align-items: flex-start; flex-direction: column; }
      main { margin-top: 0; }
      .shell { width: min(100% - 28px, 1120px); }
      .panel { padding: 24px; border-radius: 18px; }
      h1 { font-size: 42px; }
    }
  </style>
</head>
<body>
  <header>
    <div class="shell">
      <nav>
        <div class="brand">${safeName}</div>
        <div class="nav-note">Local business website concept</div>
      </nav>
      <div class="hero">
        <div>
          <h1>A sharper local website for ${safeName}</h1>
          <p class="lead">${safeDescription}</p>
          <div class="actions">
            <a class="button primary" href="#contact">Plan the next step</a>
            <a class="button secondary" href="#services">View services</a>
          </div>
        </div>
        <div class="visual" aria-label="Visual placeholder">
          <div>
            <strong>${safeName}</strong>
            <span>Premium local website preview space</span>
          </div>
        </div>
      </div>
    </div>
  </header>

  <main>
    <section>
      <div class="shell panel">
        <h2>Built around what local customers need to see first</h2>
        <p class="muted">This starter page uses the prospect notes as the foundation for a simple, conversion-focused website structure.</p>
        <p><strong>Current website status:</strong> ${safeWebsite}</p>
        <p><strong>Notes:</strong> ${safeNotes}</p>
      </div>
    </section>

    <section id="services">
      <div class="shell">
        <h2>Services and value</h2>
        <div class="grid">
          <article class="card">
            <h3>Clear offer</h3>
            <p class="muted">Explain the core service in plain language so visitors immediately understand how the business can help.</p>
          </article>
          <article class="card">
            <h3>Local trust</h3>
            <p class="muted">Highlight Brentwood and nearby service areas, practical experience, and customer-friendly proof points.</p>
          </article>
          <article class="card">
            <h3>Simple enquiry path</h3>
            <p class="muted">Give visitors one obvious next action, from calling to requesting availability or booking a consultation.</p>
          </article>
        </div>
      </div>
    </section>

    <section class="seo">
      <div class="shell">
        <h2>Local SEO foundation</h2>
        <p class="muted">The page gives ${safeName} a clean search-friendly base for local service terms, location relevance, and clear business positioning.</p>
        <div class="grid">
          <article class="card">
            <h3>Location relevance</h3>
            <p class="muted">Use Brentwood and surrounding areas naturally throughout the page.</p>
          </article>
          <article class="card">
            <h3>Service intent</h3>
            <p class="muted">Match headings and page copy to the real problems customers search for.</p>
          </article>
          <article class="card">
            <h3>Conversion signals</h3>
            <p class="muted">Make enquiries easy with visible calls to action and concise trust-building content.</p>
          </article>
        </div>
      </div>
    </section>

    <section id="contact" class="cta">
      <div class="shell panel">
        <h2>Ready for the next step</h2>
        <p>This is a basic generated website concept. It can be expanded into a fuller proposal, outreach email, and complete business pack in later phases.</p>
        <div class="meta">Demo concept only - created as an example website proposal.</div>
      </div>
    </section>
  </main>

  <footer>
    <div class="shell">Generated prospect website for ${safeName}. Demo concept only.</div>
  </footer>
</body>
</html>
`;
}

function buildProposalHtml({ businessName, websiteUrl, description, notes }) {
  const safeName = escapeHtml(businessName);
  const safeWebsite = escapeHtml(websiteUrl || "No website");
  const safeDescription = escapeHtml(description);
  const safeNotes = escapeHtml(notes || "No additional notes yet.");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${safeName} | Website Proposal</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    :root {
      color-scheme: light;
      --ink: #111827;
      --muted: #5b6472;
      --line: #dce3ec;
      --bg: #f6f8fb;
      --panel: #ffffff;
      --brand: #155eef;
      --brand-dark: #0f2f65;
      --accent: #eef4ff;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: Arial, sans-serif;
      color: var(--ink);
      background: var(--bg);
      line-height: 1.65;
    }
    .shell {
      width: min(1080px, calc(100% - 40px));
      margin: 0 auto;
    }
    header {
      background: var(--brand-dark);
      color: #fff;
      padding: 56px 0;
    }
    .eyebrow {
      margin: 0 0 14px;
      color: #a9c7ff;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: .08em;
      font-size: 13px;
    }
    h1 {
      max-width: 860px;
      margin: 0;
      font-size: clamp(38px, 6vw, 66px);
      line-height: 1;
      letter-spacing: 0;
    }
    .summary {
      max-width: 760px;
      margin: 22px 0 0;
      color: rgba(255,255,255,.82);
      font-size: 19px;
    }
    main { padding: 42px 0 70px; }
    section {
      margin-top: 22px;
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 20px;
      padding: 30px;
      box-shadow: 0 18px 45px rgba(17, 24, 39, .06);
    }
    h2 {
      margin: 0 0 14px;
      font-size: 30px;
      line-height: 1.15;
    }
    h3 {
      margin: 0 0 10px;
      font-size: 20px;
    }
    p { margin: 0 0 14px; }
    ul { margin: 0; padding-left: 22px; }
    li { margin: 8px 0; }
    .muted { color: var(--muted); }
    .grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 16px;
      margin-top: 18px;
    }
    .card {
      border: 1px solid var(--line);
      border-radius: 16px;
      padding: 20px;
      background: #fff;
    }
    .package {
      background: var(--accent);
      border-color: #cddcff;
    }
    .value {
      font-size: 26px;
      font-weight: 900;
      color: var(--brand-dark);
    }
    footer {
      padding: 28px 0;
      color: var(--muted);
      border-top: 1px solid var(--line);
      background: #fff;
      font-size: 14px;
    }
    @media (max-width: 820px) {
      .shell { width: min(100% - 28px, 1080px); }
      .grid { grid-template-columns: 1fr; }
      section { padding: 22px; border-radius: 16px; }
      h1 { font-size: 40px; }
    }
  </style>
</head>
<body>
  <header>
    <div class="shell">
      <p class="eyebrow">Commercial proposal</p>
      <h1>A focused website upgrade plan for ${safeName}</h1>
      <p class="summary">${safeDescription}</p>
    </div>
  </header>

  <main class="shell">
    <section>
      <h2>Current opportunity</h2>
      <p><strong>Current website status:</strong> ${safeWebsite}</p>
      <p class="muted">Based on the submitted prospect details, ${safeName} would benefit from a clearer online presence that explains the offer quickly, builds local trust, and gives visitors an easy next step.</p>
      <p><strong>Notes:</strong> ${safeNotes}</p>
    </section>

    <section>
      <h2>What the current presence may be lacking</h2>
      <div class="grid">
        <article class="card">
          <h3>Clear positioning</h3>
          <p class="muted">Visitors need to understand who the business helps, where it operates, and why it is a good local choice within a few seconds.</p>
        </article>
        <article class="card">
          <h3>Conversion path</h3>
          <p class="muted">A stronger enquiry route can reduce friction and help interested customers take action without hunting for contact details.</p>
        </article>
        <article class="card">
          <h3>Search relevance</h3>
          <p class="muted">Local service and location copy can give the business a better foundation for organic discovery over time.</p>
        </article>
      </div>
    </section>

    <section>
      <h2>Proposed website improvements</h2>
      <ul>
        <li>Premium homepage structure with a strong hero, service messaging, trust signals, and direct call to action.</li>
        <li>Local SEO copy aligned with the business description and Brentwood-area search intent.</li>
        <li>Clear visual hierarchy so customers can scan the offer quickly on mobile and desktop.</li>
        <li>Simple page set that can later expand into a full proposal, outreach, and dashboard workflow.</li>
      </ul>
    </section>

    <section class="package">
      <h2>Suggested package</h2>
      <p><strong>Local Website Starter Package</strong></p>
      <p class="muted">A polished single-page website concept, local positioning copy, call-to-action structure, responsive layout, and lightweight SEO foundation.</p>
      <p class="value">Expected value: a clearer first impression and more consistent enquiry journey.</p>
      <p class="muted">This does not guarantee search rankings, leads, or revenue. It creates a stronger base that can be tested and improved.</p>
    </section>

    <section>
      <h2>Next steps</h2>
      <ul>
        <li>Review the website concept for accuracy and tone.</li>
        <li>Confirm services, location coverage, proof points, and preferred call to action.</li>
        <li>Replace placeholder language with verified business details.</li>
        <li>Decide whether to expand into proposal, outreach, and dashboard tracking in the next phase.</li>
      </ul>
    </section>
  </main>

  <footer>
    <div class="shell">Demo proposal only - created as an example website proposal for ${safeName}.</div>
  </footer>
</body>
</html>
`;
}

function buildOutreachEmailHtml({ businessName, websiteUrl, description, notes }) {
  const safeName = escapeHtml(businessName);
  const safeWebsite = escapeHtml(websiteUrl || "No website");
  const safeDescription = escapeHtml(description);
  const safeNotes = escapeHtml(notes || "No additional notes yet.");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${safeName} | Outreach Email Draft</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    :root {
      color-scheme: light;
      --ink: #182333;
      --muted: #5d6a7a;
      --line: #dbe4ef;
      --panel: #ffffff;
      --bg: #f5f7fb;
      --brand: #124d99;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: Arial, sans-serif;
      color: var(--ink);
      background: var(--bg);
      line-height: 1.65;
    }
    .shell {
      width: min(900px, calc(100% - 36px));
      margin: 0 auto;
      padding: 42px 0 64px;
    }
    header {
      margin-bottom: 20px;
    }
    h1 {
      margin: 0 0 10px;
      font-size: clamp(34px, 6vw, 54px);
      line-height: 1.05;
      letter-spacing: 0;
    }
    .muted { color: var(--muted); }
    .panel {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 20px;
      padding: 30px;
      box-shadow: 0 18px 45px rgba(24, 35, 51, .07);
    }
    .email {
      white-space: pre-wrap;
      font-size: 18px;
    }
    .meta {
      margin-top: 22px;
      padding-top: 18px;
      border-top: 1px solid var(--line);
      color: var(--muted);
      font-size: 14px;
    }
    strong { color: var(--brand); }
    @media (max-width: 720px) {
      .panel { padding: 22px; border-radius: 16px; }
      .email { font-size: 16px; }
    }
  </style>
</head>
<body>
  <main class="shell">
    <header>
      <h1>Draft email for ${safeName}</h1>
      <p class="muted">Draft email only. Nothing has been sent.</p>
    </header>

    <section class="panel">
      <p><strong>Subject:</strong> Quick website idea for ${safeName}</p>
      <div class="email">Hi ${safeName},

I came across ${safeName} and put together a quick website concept/demo based on the business positioning: ${safeDescription}

The idea is simple: make the offer clearer, give local customers an easier route to enquire, and present the business in a more polished way online.

I noticed the current website status is: ${safeWebsite}

No pressure, but if useful I can send over the demo link for a quick look. If it feels relevant, we could then talk through what would need changing to make it accurate for the business.

Best,
Shane</div>
      <div class="meta">
        <p><strong>Notes used:</strong> ${safeNotes}</p>
        <p>This is a draft only and should be reviewed before any manual outreach.</p>
      </div>
    </section>
  </main>
</body>
</html>
`;
}

export async function onRequestPost({ request, env }) {
  try {
    const data = await request.json();

    const businessName = String(data.businessName || "").trim();
    const websiteUrl = String(data.websiteUrl || "").trim();
    const description = String(data.description || "").trim();
    const notes = String(data.notes || "").trim();

    if (!businessName || !description) {
      return jsonResponse({
        success: false,
        message: "Business name and description are required."
      }, 400);
    }

    const slug = slugify(businessName);

    if (!slug) {
      return jsonResponse({
        success: false,
        message: "Could not create a valid slug from the business name."
      }, 400);
    }

    const indexPath = `businesses/${slug}/index.html`;
    const websitePath = `businesses/${slug}/website.html`;
    const proposalPath = `businesses/${slug}/proposal.html`;
    const emailDraftPath = `businesses/${slug}/outreach-email.html`;
    const dashboardPath = "index.html";
    const dashboardFile = await githubGetFile(env, dashboardPath);
    const dashboardRow = dashboardRowForProspect({ businessName, slug, websiteUrl, description });
    const dashboardUpdate = updateDashboardHtml(dashboardFile.content, dashboardRow);

    if (dashboardUpdate.duplicate) {
      return jsonResponse({
        success: false,
        message: "This prospect already exists on the dashboard."
      }, 409);
    }

    if (await githubFileExists(env, websitePath)) {
      return jsonResponse({
        success: false,
        message: "This prospect already exists."
      }, 409);
    }

    await githubPutFile(
      env,
      indexPath,
      buildIndexHtml(),
      `Create basic prospect index for ${businessName}`
    );

    await githubPutFile(
      env,
      websitePath,
      buildWebsiteHtml({ businessName, websiteUrl, description, notes }),
      `Create basic prospect website for ${businessName}`
    );

    await githubPutFile(
      env,
      proposalPath,
      buildProposalHtml({ businessName, websiteUrl, description, notes }),
      `Create proposal page for ${businessName}`
    );

    await githubPutFile(
      env,
      emailDraftPath,
      buildOutreachEmailHtml({ businessName, websiteUrl, description, notes }),
      `Create outreach email draft for ${businessName}`
    );

    await githubPutFile(
      env,
      dashboardPath,
      dashboardUpdate.html,
      `Add ${businessName} to dashboard`,
      dashboardFile.sha
    );

    return jsonResponse({
      success: true,
      message: "Prospect created and added to dashboard successfully. Cloudflare will redeploy shortly.",
      slug,
      links: {
        website: `/businesses/${slug}/website.html`,
        proposal: `/businesses/${slug}/proposal.html`,
        emailDraft: `/businesses/${slug}/outreach-email.html`,
        businessPack: `/businesses/${slug}/`
      }
    });
  } catch (error) {
    return jsonResponse({
      success: false,
      message: "Could not create the basic prospect website.",
      error: String(error && error.message ? error.message : error)
    }, 500);
  }
}
