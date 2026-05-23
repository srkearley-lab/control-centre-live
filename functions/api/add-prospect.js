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
  if (/(coach|wellbeing|confidence|stress|therapy|therapist|counsellor|counselor|clinic|recovery)/.test(text)) return "Wellbeing";
  if (/(personal trainer|fitness|gym|pilates|yoga)/.test(text)) return "Fitness";
  if (/(beauty|salon|treatment|facial|lashes|nails|aesthetic)/.test(text)) return "Beauty";
  if (/(cafe|coffee|restaurant|food|takeaway|bakery)/.test(text)) return "Cafe";
  if (/(barber|haircut|grooming shop)/.test(text)) return "Barber";
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

function getWebsiteTheme(category) {
  const themes = {
    "Cafe": {
      bg: "#fff8ed",
      panel: "#fffaf3",
      ink: "#2b1b12",
      muted: "#765f4d",
      brand: "#9b5c16",
      brandDark: "#3a2416",
      accent: "#f2b84b",
      soft: "#f8ead2",
      visual: "Cafe counter, warm light, fresh menu board",
      icon: "CF"
    },
    "Barber": {
      bg: "#f5f2ea",
      panel: "#fffdf8",
      ink: "#161616",
      muted: "#5f5a50",
      brand: "#b8872f",
      brandDark: "#101010",
      accent: "#e0b15a",
      soft: "#efe4ce",
      visual: "Chair, mirror, tools, sharp appointment flow",
      icon: "BR"
    },
    "Dog Groomer": {
      bg: "#f2fbf8",
      panel: "#ffffff",
      ink: "#142a2b",
      muted: "#557174",
      brand: "#169a8f",
      brandDark: "#123b45",
      accent: "#8bd8c7",
      soft: "#dff5ef",
      visual: "Clean grooming space, towels, care details",
      icon: "DG"
    },
    "Vehicle Services": {
      bg: "#f2f6fb",
      panel: "#ffffff",
      ink: "#101a2a",
      muted: "#526172",
      brand: "#1c6fd1",
      brandDark: "#0b1d33",
      accent: "#6ba6ff",
      soft: "#dbe8f7",
      visual: "Workshop bays, diagnostics, service clarity",
      icon: "VS"
    },
    "Garage": {
      bg: "#f2f6fb",
      panel: "#ffffff",
      ink: "#101a2a",
      muted: "#526172",
      brand: "#1c6fd1",
      brandDark: "#0b1d33",
      accent: "#6ba6ff",
      soft: "#dbe8f7",
      visual: "Workshop bays, diagnostics, service clarity",
      icon: "GR"
    },
    "Fitness": {
      bg: "#f1fbfb",
      panel: "#ffffff",
      ink: "#10242d",
      muted: "#4f6970",
      brand: "#0796a8",
      brandDark: "#083046",
      accent: "#63dbc9",
      soft: "#dcf7f3",
      visual: "Training space, progress plan, coaching rhythm",
      icon: "FT"
    },
    "Wellbeing": {
      bg: "#f1fbfb",
      panel: "#ffffff",
      ink: "#10242d",
      muted: "#4f6970",
      brand: "#0796a8",
      brandDark: "#083046",
      accent: "#63dbc9",
      soft: "#dcf7f3",
      visual: "Calm consultation, clear plan, steady support",
      icon: "WB"
    },
    "Beauty": {
      bg: "#fff7f4",
      panel: "#ffffff",
      ink: "#2c1b20",
      muted: "#765d64",
      brand: "#c27685",
      brandDark: "#42232d",
      accent: "#f0c9b8",
      soft: "#f8e7df",
      visual: "Treatment room, soft light, refined booking",
      icon: "BY"
    }
  };

  return themes[category] || {
    bg: "#f4f7ff",
    panel: "#ffffff",
    ink: "#111827",
    muted: "#586579",
    brand: "#5b61f0",
    brandDark: "#111a3d",
    accent: "#7bb7ff",
    soft: "#e8ecff",
    visual: "Premium service preview, local trust, simple enquiry",
    icon: "LB"
  };
}

function getWebsiteCopy(category, businessName, description) {
  const fallback = {
    badge: "Local service website demo",
    headline: `A premium local website concept for ${businessName}`,
    subhead: `A polished one-page demo built around the submitted brief: ${description}`,
    services: [
      ["Clear offer", "Present the core service quickly so visitors understand the value in seconds."],
      ["Local trust", "Show location, credibility and helpful proof points before customers compare alternatives."],
      ["Simple enquiry path", "Guide visitors toward a call, message or consultation without clutter."]
    ],
    reasons: [
      "Sharper first impression for mobile and desktop visitors.",
      "More confidence around services, location and next steps.",
      "A stronger base for local SEO and manual outreach."
    ],
    gallery: ["Hero concept", "Service cards", "Trust section"]
  };

  const byCategory = {
    "Cafe": {
      badge: "Cafe website demo",
      headline: `Turn local cafe searches into visits for ${businessName}`,
      subhead: "A warm, menu-led website concept that makes opening times, atmosphere and customer visits easier to understand.",
      services: [
        ["Menu highlights", "Feature signature coffee, brunch options and popular daily choices without overloading the page."],
        ["Visit planning", "Make location, opening times and booking or takeaway calls easy to find."],
        ["Atmosphere", "Use warm visual panels and local copy to make the cafe feel inviting before customers arrive."]
      ],
      reasons: ["Clear menu and visit information.", "Better mobile path for nearby customers.", "Local search copy for cafe and brunch intent."],
      gallery: ["Coffee bar", "Brunch table", "Warm interior"]
    },
    "Barber": {
      badge: "Barber website demo",
      headline: `A sharper booking-focused website for ${businessName}`,
      subhead: "A premium barber shop concept built around services, style, trust and quick appointment enquiries.",
      services: [
        ["Cuts and grooming", "Show key services clearly so customers know what to book."],
        ["Price confidence", "Frame service options and consultation notes in a tidy, easy-to-scan way."],
        ["Fast booking", "Make phone, booking and location details prominent on every device."]
      ],
      reasons: ["Stronger style-led presentation.", "Clearer service and appointment flow.", "Better local search foundation for barber terms."],
      gallery: ["Chair setup", "Tool detail", "Shop interior"]
    },
    "Dog Groomer": {
      badge: "Dog grooming website demo",
      headline: `A calmer, clearer grooming website for ${businessName}`,
      subhead: "A friendly local concept that helps owners understand services, care standards and how to request an appointment.",
      services: [
        ["Grooming packages", "Group washes, trims and care options into clear service blocks."],
        ["Care and trust", "Use reassuring copy around handling, cleanliness and comfort."],
        ["Easy enquiries", "Make it simple for owners to ask about availability and their dog's needs."]
      ],
      reasons: ["More reassuring first impression.", "Clearer package and appointment structure.", "Local copy for dog grooming searches."],
      gallery: ["Grooming table", "Care products", "Fresh finish"]
    },
    "Vehicle Services": {
      badge: "Garage website demo",
      headline: `A more trusted workshop website for ${businessName}`,
      subhead: "A practical service-led demo for diagnostics, repairs and local driver enquiries.",
      services: [
        ["Core services", "Surface MOT, diagnostics, servicing and repairs in a clean service grid."],
        ["Trust signals", "Make experience, process and transparent contact routes easy to see."],
        ["Driver enquiries", "Guide customers from problem to booking request quickly."]
      ],
      reasons: ["More professional workshop positioning.", "Clearer service routes for drivers.", "Local SEO around repairs and diagnostics."],
      gallery: ["Workshop bay", "Diagnostics", "Service desk"]
    },
    "Garage": {
      badge: "Garage website demo",
      headline: `A more trusted workshop website for ${businessName}`,
      subhead: "A practical service-led demo for diagnostics, repairs and local driver enquiries.",
      services: [
        ["Core services", "Surface MOT, diagnostics, servicing and repairs in a clean service grid."],
        ["Trust signals", "Make experience, process and transparent contact routes easy to see."],
        ["Driver enquiries", "Guide customers from problem to booking request quickly."]
      ],
      reasons: ["More professional workshop positioning.", "Clearer service routes for drivers.", "Local SEO around repairs and diagnostics."],
      gallery: ["Workshop bay", "Diagnostics", "Service desk"]
    },
    "Fitness": {
      badge: "Fitness website demo",
      headline: `A stronger coaching website for ${businessName}`,
      subhead: "A confident fitness concept that explains coaching, outcomes and the first enquiry step.",
      services: [
        ["Coaching plans", "Show personal training or programme options in a clear, motivating structure."],
        ["Progress focus", "Frame benefits around routine, confidence and practical results."],
        ["First session CTA", "Make it easy to request a consultation or availability check."]
      ],
      reasons: ["Clearer transformation story.", "Better mobile enquiry path.", "Local SEO foundation for fitness and coaching searches."],
      gallery: ["Training space", "Progress board", "Coaching plan"]
    },
    "Wellbeing": {
      badge: "Wellbeing website demo",
      headline: `A calmer, more credible website for ${businessName}`,
      subhead: "A trust-led concept that explains support, outcomes and the first conversation clearly.",
      services: [
        ["Support areas", "Make the problems helped and service approach easy to scan."],
        ["Trust and tone", "Use calm, professional copy that feels reassuring without overpromising."],
        ["Soft enquiry", "Invite a first conversation with low-pressure calls to action."]
      ],
      reasons: ["Clearer trust and positioning.", "More reassuring mobile experience.", "Better local SEO for support and coaching terms."],
      gallery: ["Consultation space", "Calm plan", "Support journey"]
    },
    "Beauty": {
      badge: "Beauty website demo",
      headline: `A refined booking website for ${businessName}`,
      subhead: "A polished salon-style concept that presents treatments, atmosphere and booking confidence.",
      services: [
        ["Treatment menu", "Group services into attractive, easy-to-understand treatment blocks."],
        ["Premium feel", "Use refined spacing and soft visual panels to lift the perceived quality."],
        ["Booking path", "Make enquiries and appointments feel simple from any device."]
      ],
      reasons: ["More premium first impression.", "Clearer treatment and booking structure.", "Local SEO support for beauty and salon searches."],
      gallery: ["Treatment room", "Product detail", "Calm finish"]
    }
  };

  return byCategory[category] || fallback;
}

function buildWebsiteHtml({ businessName, websiteUrl, description, notes }) {
  const category = inferCategory(description);
  const theme = getWebsiteTheme(category);
  const copy = getWebsiteCopy(category, businessName, description);
  const safeName = escapeHtml(businessName);
  const safeWebsite = escapeHtml(websiteUrl || "No website");
  const safeDescription = escapeHtml(description);
  const safeNotes = escapeHtml(notes || "No additional notes yet.");
  const safeCategory = escapeHtml(category);
  const safeBadge = escapeHtml(copy.badge);
  const safeHeadline = escapeHtml(copy.headline);
  const safeSubhead = escapeHtml(copy.subhead);
  const safeVisual = escapeHtml(theme.visual);
  const safeIcon = escapeHtml(theme.icon);
  const serviceCards = copy.services.map(([title, body], index) => `
          <article class="service-card">
            <div class="mini-visual tone-${index + 1}"><span>${escapeHtml(title)}</span></div>
            <h3>${escapeHtml(title)}</h3>
            <p>${escapeHtml(body)}</p>
          </article>`).join("");
  const reasonItems = copy.reasons.map(item => `<li>${escapeHtml(item)}</li>`).join("");
  const galleryCards = copy.gallery.map((label, index) => `
          <article class="gallery-card gallery-${index + 1}">
            <span>${escapeHtml(label)}</span>
          </article>`).join("");

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
      --bg: ${theme.bg};
      --panel: ${theme.panel};
      --ink: ${theme.ink};
      --muted: ${theme.muted};
      --line: color-mix(in srgb, ${theme.brand} 18%, #ffffff);
      --brand: ${theme.brand};
      --brand-dark: ${theme.brandDark};
      --accent: ${theme.accent};
      --soft: ${theme.soft};
      --shadow: 0 24px 80px rgba(20, 30, 45, .14);
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
      color: var(--ink);
      background:
        radial-gradient(circle at 12% 4%, color-mix(in srgb, var(--accent) 32%, transparent), transparent 30%),
        linear-gradient(180deg, var(--bg), #fff);
      line-height: 1.6;
    }
    a { color: inherit; }
    .shell {
      width: min(1180px, calc(100% - 40px));
      margin: 0 auto;
    }
    header {
      position: relative;
      overflow: hidden;
      background:
        radial-gradient(circle at 82% 18%, color-mix(in srgb, var(--accent) 48%, transparent), transparent 28%),
        linear-gradient(135deg, var(--brand-dark), color-mix(in srgb, var(--brand) 72%, #111827));
      color: #fff;
      padding: 28px 0 96px;
    }
    header:after {
      content: "";
      position: absolute;
      inset: auto -10% -80px -10%;
      height: 150px;
      background: var(--bg);
      transform: skewY(-3deg);
      transform-origin: left top;
    }
    nav {
      position: relative;
      z-index: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
      margin-bottom: 74px;
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
      position: relative;
      z-index: 1;
      display: grid;
      grid-template-columns: minmax(0, 1.05fr) minmax(360px, .95fr);
      gap: 56px;
      align-items: center;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 18px;
      border: 1px solid rgba(255,255,255,.22);
      border-radius: 999px;
      padding: 8px 12px;
      background: rgba(255,255,255,.1);
      color: rgba(255,255,255,.88);
      font-size: 13px;
      font-weight: 850;
    }
    h1 {
      margin: 0 0 18px;
      font-size: clamp(46px, 7vw, 82px);
      line-height: .94;
      letter-spacing: 0;
    }
    .lead {
      max-width: 680px;
      margin: 0 0 28px;
      color: rgba(255,255,255,.88);
      font-size: 21px;
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
      font-weight: 900;
    }
    .primary { background: #fff; color: var(--brand-dark); box-shadow: 0 18px 50px rgba(0,0,0,.22); }
    .secondary { border: 1px solid rgba(255,255,255,.35); color: #fff; }
    .visual {
      min-height: 450px;
      border: 1px solid rgba(255,255,255,.25);
      border-radius: 34px;
      background:
        linear-gradient(145deg, rgba(255,255,255,.24), rgba(255,255,255,.06)),
        radial-gradient(circle at 20% 20%, color-mix(in srgb, var(--accent) 60%, transparent), transparent 30%),
        linear-gradient(135deg, color-mix(in srgb, var(--brand) 70%, #fff), var(--brand-dark));
      padding: 22px;
      box-shadow: 0 30px 90px rgba(0,0,0,.32);
    }
    .mock-browser {
      height: 100%;
      min-height: 405px;
      border-radius: 24px;
      overflow: hidden;
      background: rgba(255,255,255,.92);
      color: var(--ink);
      box-shadow: inset 0 0 0 1px rgba(255,255,255,.7);
    }
    .mock-top {
      display: flex;
      gap: 7px;
      align-items: center;
      height: 42px;
      padding: 0 16px;
      background: rgba(15,23,42,.08);
    }
    .dot { width: 10px; height: 10px; border-radius: 50%; background: var(--brand); opacity: .75; }
    .mock-body {
      padding: 24px;
      display: grid;
      gap: 18px;
    }
    .mock-photo {
      min-height: 170px;
      border-radius: 22px;
      background:
        linear-gradient(135deg, color-mix(in srgb, var(--brand) 62%, transparent), transparent),
        repeating-linear-gradient(135deg, rgba(255,255,255,.22) 0 18px, rgba(255,255,255,.06) 18px 36px),
        linear-gradient(135deg, var(--soft), var(--accent));
      display: flex;
      align-items: flex-end;
      padding: 20px;
      color: #fff;
      font-weight: 900;
      box-shadow: inset 0 -80px 90px rgba(0,0,0,.22);
    }
    .mock-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    .mock-tile {
      min-height: 92px;
      border-radius: 18px;
      background: var(--soft);
      padding: 16px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      color: var(--brand-dark);
      font-weight: 850;
    }
    .mock-pill {
      width: 52px;
      height: 52px;
      border-radius: 16px;
      display: grid;
      place-items: center;
      background: var(--brand-dark);
      color: #fff;
      font-weight: 950;
    }
    main { margin-top: -44px; }
    section {
      padding: 68px 0;
    }
    .panel {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 28px;
      padding: 38px;
      box-shadow: var(--shadow);
    }
    .trust-strip {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 16px;
    }
    .trust-item {
      padding: 18px;
      border-radius: 18px;
      background: color-mix(in srgb, var(--soft) 78%, #fff);
      border: 1px solid var(--line);
    }
    .trust-item strong { display: block; font-size: 18px; margin-bottom: 4px; }
    .section-head {
      max-width: 760px;
      margin-bottom: 28px;
    }
    .section-head p {
      color: var(--muted);
      font-size: 18px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 20px;
    }
    .service-card, .reason-card {
      background: #fff;
      border: 1px solid var(--line);
      border-radius: 24px;
      padding: 24px;
      box-shadow: 0 18px 45px rgba(17,24,39,.07);
    }
    .mini-visual {
      min-height: 135px;
      border-radius: 20px;
      margin-bottom: 20px;
      padding: 18px;
      display: flex;
      align-items: flex-end;
      color: #fff;
      font-weight: 900;
      background:
        linear-gradient(145deg, color-mix(in srgb, var(--brand) 74%, transparent), transparent),
        radial-gradient(circle at 74% 18%, rgba(255,255,255,.46), transparent 26%),
        linear-gradient(135deg, var(--brand-dark), var(--brand));
      box-shadow: inset 0 -70px 90px rgba(0,0,0,.2);
    }
    .tone-2 { background:
      linear-gradient(145deg, color-mix(in srgb, var(--accent) 68%, transparent), transparent),
      repeating-linear-gradient(135deg, rgba(255,255,255,.16) 0 12px, transparent 12px 24px),
      linear-gradient(135deg, var(--brand), var(--brand-dark)); }
    .tone-3 { background:
      radial-gradient(circle at 24% 20%, rgba(255,255,255,.46), transparent 28%),
      linear-gradient(135deg, var(--accent), var(--brand)); }
    .gallery {
      background: var(--brand-dark);
      color: #fff;
    }
    .gallery .section-head p { color: rgba(255,255,255,.76); }
    .gallery-grid {
      display: grid;
      grid-template-columns: 1.2fr .8fr .8fr;
      gap: 18px;
    }
    .gallery-card {
      min-height: 240px;
      border-radius: 28px;
      padding: 24px;
      display: flex;
      align-items: flex-end;
      background:
        linear-gradient(180deg, transparent, rgba(0,0,0,.38)),
        radial-gradient(circle at 30% 24%, color-mix(in srgb, var(--accent) 70%, transparent), transparent 32%),
        linear-gradient(135deg, color-mix(in srgb, var(--brand) 80%, #fff), var(--brand-dark));
      box-shadow: 0 24px 70px rgba(0,0,0,.24);
      font-size: 22px;
      font-weight: 950;
    }
    .gallery-1 { min-height: 330px; }
    .gallery-2 {
      background:
        linear-gradient(180deg, transparent, rgba(0,0,0,.38)),
        repeating-linear-gradient(135deg, rgba(255,255,255,.16) 0 14px, transparent 14px 28px),
        linear-gradient(135deg, var(--accent), var(--brand));
    }
    .gallery-3 {
      background:
        linear-gradient(180deg, transparent, rgba(0,0,0,.38)),
        radial-gradient(circle at 76% 20%, rgba(255,255,255,.42), transparent 30%),
        linear-gradient(135deg, var(--brand-dark), var(--brand));
    }
    h2 {
      margin: 0 0 16px;
      font-size: clamp(32px, 5vw, 52px);
      line-height: 1.1;
    }
    h3 {
      margin: 0 0 10px;
      font-size: 20px;
    }
    p { margin: 0 0 14px; }
    ul { margin: 0; padding-left: 22px; }
    li { margin: 9px 0; }
    .muted { color: var(--muted); }
    .seo {
      background: var(--soft);
      border-block: 1px solid #d7e8ff;
    }
    .seo-layout {
      display: grid;
      grid-template-columns: minmax(0, .9fr) minmax(320px, 1.1fr);
      gap: 24px;
      align-items: center;
    }
    .seo-card {
      background: #fff;
      border: 1px solid var(--line);
      border-radius: 26px;
      padding: 28px;
      box-shadow: var(--shadow);
    }
    .cta {
      text-align: center;
      padding: 82px 0;
    }
    .cta .panel {
      background:
        radial-gradient(circle at 15% 0%, color-mix(in srgb, var(--accent) 50%, transparent), transparent 30%),
        linear-gradient(135deg, var(--brand-dark), var(--brand));
      color: #fff;
    }
    .cta p {
      max-width: 720px;
      margin-inline: auto;
      color: rgba(255,255,255,.82);
      font-size: 18px;
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
      .hero, .grid, .trust-strip, .gallery-grid, .seo-layout { grid-template-columns: 1fr; }
      header { padding-bottom: 54px; }
      nav { margin-bottom: 44px; align-items: flex-start; flex-direction: column; }
      main { margin-top: 0; }
      .shell { width: min(100% - 28px, 1120px); }
      .panel { padding: 24px; border-radius: 18px; }
      h1 { font-size: 42px; }
      .visual { min-height: 360px; }
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
          <div class="badge">${safeBadge} / ${safeCategory}</div>
          <h1>${safeHeadline}</h1>
          <p class="lead">${safeSubhead}</p>
          <div class="actions">
            <a class="button primary" href="#contact">Request a review</a>
            <a class="button secondary" href="#services">View services</a>
          </div>
        </div>
        <div class="visual" aria-label="Premium website preview mockup">
          <div class="mock-browser">
            <div class="mock-top"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>
            <div class="mock-body">
              <div class="mock-photo">${safeVisual}</div>
              <div class="mock-grid">
                <div class="mock-tile"><span>Premium first impression</span><div class="mock-pill">${safeIcon}</div></div>
                <div class="mock-tile"><span>Simple enquiry path</span><div class="mock-pill">GO</div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>

  <main>
    <section>
      <div class="shell panel trust-strip">
        <div class="trust-item"><strong>Local positioning</strong><span class="muted">Built around the services and area customers search for.</span></div>
        <div class="trust-item"><strong>Conversion focused</strong><span class="muted">Designed to move visitors from interest to enquiry.</span></div>
        <div class="trust-item"><strong>Review ready</strong><span class="muted">Demo concept only, ready for business detail checks.</span></div>
      </div>
    </section>

    <section id="services">
      <div class="shell">
        <div class="section-head">
          <h2>Services presented like a premium local brand</h2>
          <p>${safeDescription}</p>
        </div>
        <div class="grid">
${serviceCards}
        </div>
      </div>
    </section>

    <section>
      <div class="shell">
        <div class="section-head">
          <h2>Why this website works</h2>
          <p>A better demo needs more than a nice hero. It needs structure that makes the business easier to trust, understand and contact.</p>
        </div>
        <div class="grid">
          <article class="reason-card"><h3>First impression</h3><p class="muted">A polished visual system helps the business feel established before the visitor reads the detail.</p></article>
          <article class="reason-card"><h3>Decision support</h3><p class="muted">Service cards, proof points and local messaging reduce uncertainty for new customers.</p></article>
          <article class="reason-card"><h3>Action path</h3><p class="muted">Calls to action are repeated at natural decision points without making the page feel pushy.</p></article>
        </div>
      </div>
    </section>

    <section class="seo">
      <div class="shell seo-layout">
        <div>
          <h2>Local SEO foundation</h2>
          <p class="muted">This structure gives ${safeName} a cleaner base for local service terms, location relevance and conversion-focused content.</p>
        </div>
        <div class="seo-card">
          <ul>${reasonItems}</ul>
          <p class="muted"><strong>Current website status:</strong> ${safeWebsite}</p>
          <p class="muted"><strong>Build notes:</strong> ${safeNotes}</p>
        </div>
      </div>
    </section>

    <section class="gallery">
      <div class="shell">
        <div class="section-head">
          <h2>Visual concept direction</h2>
          <p>CSS-generated image panels keep the page fast, safe and self-contained while giving the demo a stronger agency-built feel.</p>
        </div>
        <div class="gallery-grid">
${galleryCards}
        </div>
      </div>
    </section>

    <section id="contact" class="cta">
      <div class="shell panel">
        <h2>Ready to turn the demo into a real sales conversation?</h2>
        <p>This concept is designed to show what a more premium local website could look like, then support a manual review before any outreach is sent.</p>
        <div class="actions" style="justify-content:center;margin-top:26px">
          <a class="button primary" href="#top">Review the concept</a>
          <a class="button secondary" href="/businesses/">Open business pack</a>
        </div>
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
