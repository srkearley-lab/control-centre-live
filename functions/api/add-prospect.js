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

function publicNotes(value) {
  const cleaned = String(value || "")
    .split(/(?<=[.!?])\s+/)
    .filter(sentence => !/\bprices?\b|\bpricing\b|Â£|\$/.test(sentence))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  return cleaned || "No additional notes yet.";
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

function normalizeWebsiteUrl(value) {
  const raw = String(value || "").trim();

  if (!raw || /^(no website|none|n\/a|na|null)$/i.test(raw)) {
    return "";
  }

  try {
    return new URL(raw.includes("://") ? raw : `https://${raw}`).href;
  } catch (error) {
    return "";
  }
}

function stripTags(value) {
  return String(value || "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function uniqueShortList(items, limit = 6) {
  const seen = new Set();
  const output = [];

  for (const item of items) {
    const clean = stripTags(item).slice(0, 120);
    const key = clean.toLowerCase();
    if (!clean || seen.has(key)) continue;
    seen.add(key);
    output.push(clean);
    if (output.length >= limit) break;
  }

  return output;
}

function uniqueRawList(items, limit = 8) {
  const seen = new Set();
  const output = [];

  for (const item of items) {
    const clean = String(item || "").replace(/\s+/g, " ").trim().slice(0, 160);
    const key = clean.toLowerCase();
    if (!clean || seen.has(key)) continue;
    seen.add(key);
    output.push(clean);
    if (output.length >= limit) break;
  }

  return output;
}

function extractAttribute(tag, name) {
  const pattern = new RegExp(`${name}\\s*=\\s*["']([^"']+)["']`, "i");
  const match = String(tag || "").match(pattern);
  return match ? match[1] : "";
}

function extractNearbyText(html, keywords, limit = 8) {
  const blocks = Array.from(String(html || "").matchAll(/<(?:p|li|td|th|span|div|h[1-4])[^>]*>([\s\S]{0,700}?)<\/(?:p|li|td|th|span|div|h[1-4])>/gi))
    .map(match => stripTags(match[1]))
    .filter(text => text.length > 6 && keywords.test(text));

  return uniqueShortList(blocks, limit);
}

function extractLinks(html, sourceUrl, keywords, limit = 4) {
  const links = Array.from(String(html || "").matchAll(/<a[^>]+href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi))
    .map(match => {
      try {
        const href = new URL(match[1], sourceUrl).href;
        const label = stripTags(match[2]) || href;
        return { href, label };
      } catch (error) {
        return null;
      }
    })
    .filter(link => link && keywords.test(`${link.href} ${link.label}`));

  const seen = new Set();
  const output = [];
  for (const link of links) {
    const key = link.href.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    output.push(link);
    if (output.length >= limit) break;
  }

  return output;
}

function extractContactDetails(text) {
  const emailMatch = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  const phoneMatches = Array.from(text.matchAll(/(?:\+44\s?|0)(?:\d[\s().-]?){9,12}\d/g)).map(match => match[0]);
  const postcodeMatch = text.match(/[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}/i);
  const address = postcodeMatch
    ? String(text.slice(Math.max(0, postcodeMatch.index - 110), postcodeMatch.index + postcodeMatch[0].length)).replace(/\s+/g, " ").trim()
    : "";
  const hours = extractLikelyHours(text);

  return {
    email: emailMatch ? emailMatch[0] : "",
    phone: uniqueRawList(phoneMatches, 1)[0] || "",
    address,
    hours
  };
}

function extractLikelyHours(text) {
  const hourLines = String(text || "")
    .split(/[\n\r]|(?<=\.)\s+/)
    .filter(line => /(mon|tue|wed|thu|fri|sat|sun|monday|tuesday|wednesday|thursday|friday|saturday|sunday|open|opening)/i.test(line) && /\d/.test(line))
    .map(line => line.replace(/\s+/g, " ").trim());

  return uniqueRawList(hourLines, 4);
}

function extractPublicPrices(html) {
  const priceBlocks = extractNearbyText(html, /Â£|\$|\bprice\b|\bfrom\b|\bper\b|\bmenu\b/i, 8)
    .filter(text => /Â£|\$|\d+\s*(?:gbp|pounds|pp|per)/i.test(text) || /Â£\s?\d+/.test(text));

  return uniqueShortList(priceBlocks, 6);
}

function inferServicesFromContext(description, headings, serviceBlocks) {
  const serviceKeywords = /(service|treatment|menu|package|repair|diagnostic|mot|groom|cut|coffee|brunch|recovery|mobility|consult|booking|therapy|massage|coaching|facial|clinic)/i;
  const fromSite = [...headings, ...serviceBlocks].filter(item => serviceKeywords.test(item));
  const fromDescription = String(description || "")
    .split(/[,.;]/)
    .map(part => part.trim())
    .filter(part => part.length > 12);

  return uniqueShortList([...fromSite, ...fromDescription], 8);
}

function resolveSameDomainAsset(value, baseUrl) {
  if (!value || /^data:/i.test(value)) return "";

  try {
    const resolved = new URL(value, baseUrl);
    const base = new URL(baseUrl);
    const sameDomain = resolved.hostname.replace(/^www\./, "") === base.hostname.replace(/^www\./, "");
    const isImage = /\.(jpe?g|png|webp|avif)(\?.*)?$/i.test(resolved.pathname + resolved.search);
    return sameDomain && isImage ? resolved.href : "";
  } catch (error) {
    return "";
  }
}

function extractWebsiteContext(html, sourceUrl) {
  const text = stripTags(html);
  const title = stripTags((html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || "");
  const descriptionTag = (html.match(/<meta[^>]+name=["']description["'][^>]*>/i) || [])[0] || "";
  const metaDescription = stripTags(extractAttribute(descriptionTag, "content"));
  const headingMatches = Array.from(html.matchAll(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/gi)).map(match => match[1]);
  const headings = uniqueShortList(headingMatches, 8);
  const serviceBlocks = extractNearbyText(html, /(service|treatment|menu|package|repair|diagnostic|mot|groom|cut|coffee|brunch|recovery|mobility|consult|booking|therapy|massage|coaching|facial|clinic)/i, 10);
  const prices = extractPublicPrices(html);
  const faqs = extractNearbyText(html, /\?|faq|how much|how long|do you|can i|what should/i, 6);
  const trustSignals = extractNearbyText(html, /(review|rated|award|qualified|qualification|insured|years|established|member|accredited|certified)/i, 6);
  const contactDetails = extractContactDetails(text);
  const contactLinks = extractLinks(html, sourceUrl, /(contact|enquiry|enquire|get-in-touch)/i, 3);
  const bookingLinks = extractLinks(html, sourceUrl, /(book|booking|appointment|reserve|order)/i, 3);
  const menuLinks = extractLinks(html, sourceUrl, /(menu|treatments|services|prices|pricing|packages)/i, 3);
  const imageTags = Array.from(html.matchAll(/<img[^>]+>/gi)).map(match => match[0]);
  const imageCandidates = uniqueShortList(
    imageTags
      .map(tag => resolveSameDomainAsset(extractAttribute(tag, "src") || extractAttribute(tag, "data-src") || extractAttribute(tag, "data-lazy-src"), sourceUrl))
      .filter(Boolean)
      .filter(src => !/(tracking|pixel|sprite|icon|logo|favicon|blank|placeholder)/i.test(src)),
    6
  );

  return {
    sourceUrl,
    domain: new URL(sourceUrl).hostname.replace(/^www\./, ""),
    title,
    metaDescription,
    headings,
    services: uniqueShortList(serviceBlocks, 8),
    prices,
    faqs,
    trustSignals,
    contactDetails,
    contactLinks,
    bookingLinks,
    menuLinks,
    imageCandidates,
    fetched: true
  };
}

async function fetchExistingWebsiteContext(websiteUrl) {
  const normalizedUrl = normalizeWebsiteUrl(websiteUrl);

  if (!normalizedUrl) {
    return { fetched: false, reason: "No existing website supplied." };
  }

  try {
    const response = await fetch(normalizedUrl, {
      method: "GET",
      signal: typeof AbortSignal !== "undefined" && AbortSignal.timeout ? AbortSignal.timeout(4500) : undefined,
      headers: {
        "accept": "text/html,application/xhtml+xml"
      }
    });

    if (!response.ok) {
      return { fetched: false, sourceUrl: normalizedUrl, reason: `Existing website returned ${response.status}.` };
    }

    const contentType = response.headers.get("content-type") || "";
    if (contentType && !contentType.includes("text/html") && !contentType.includes("application/xhtml")) {
      return { fetched: false, sourceUrl: normalizedUrl, reason: "Existing website did not return HTML." };
    }

    const html = (await response.text()).slice(0, 220000);
    return extractWebsiteContext(html, normalizedUrl);
  } catch (error) {
    return {
      fetched: false,
      sourceUrl: normalizedUrl,
      reason: `Existing website context unavailable: ${String(error && error.message ? error.message : error)}`
    };
  }
}

function inferCategory(description) {
  const text = String(description || "").toLowerCase();

  if (/(garden room|garden office|outbuilding|installer|construction|builder)/.test(text)) return "Garden Rooms";
  if (/(sports recovery|mobility|active adult|runner|gym-goer|gym goer|personal trainer|fitness|gym|pilates|yoga|\bpt\b)/.test(text)) return "Fitness";
  if (/(coach|wellbeing|confidence|stress|therapy|therapist|counsellor|counselor|clinic|recovery)/.test(text)) return "Wellbeing";
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
  const normalizedWebsiteUrl = normalizeWebsiteUrl(websiteUrl);
  const noWebsite = !normalizedWebsiteUrl;
  const category = inferCategory(description);
  const location = inferLocation(businessName, description);

  return {
    slug,
    name: businessName,
    initials: initialsForName(businessName),
    websiteUrl: noWebsite ? "" : normalizedWebsiteUrl,
    category,
    location,
    priority: noWebsite ? "High" : "Medium",
    websiteStatus: noWebsite ? "No dedicated website found" : "Website provided - review recommended",
    websiteScore: noWebsite ? null : 64,
    score: noWebsite ? null : 68,
    seoScore: noWebsite ? null : 68,
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
  updated = updated.replace(/Five curated local business opportunities\./g, "Curated local business opportunities ready for review.");
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
      image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1400&q=80",
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
      image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=1400&q=80",
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
      image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=1400&q=80",
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
      image: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=1400&q=80",
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
      image: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=1400&q=80",
      icon: "GR"
    },
    "Fitness": {
      bg: "#f5fbff",
      panel: "#ffffff",
      ink: "#081827",
      muted: "#587085",
      brand: "#0ea5c6",
      brandDark: "#061525",
      accent: "#31e6d4",
      soft: "#dff8fb",
      visual: "Recovery room, mobility plan, performance-focused care",
      image: "https://images.unsplash.com/photo-1571019613914-85f342c6a11e?auto=format&fit=crop&w=1800&q=82",
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
      image: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1400&q=80",
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
      image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1400&q=80",
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
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=80",
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
        ["Service confidence", "Frame service options and consultation notes in a tidy, easy-to-scan way."],
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
      badge: "Recovery and mobility website demo",
      headline: `A premium recovery website concept for ${businessName}`,
      subhead: "A polished sports recovery and mobility concept that helps active adults understand services, trust the clinic and book the next step.",
      services: [
        ["Recovery sessions", "Present sports recovery, mobility work and stiffness support in a clear treatment-style service structure."],
        ["Movement confidence", "Frame outcomes around moving better, recovering faster and returning to training with less uncertainty."],
        ["Consultation route", "Make it easy to request an assessment, availability check or first recovery session."]
      ],
      reasons: ["More premium clinic positioning.", "Better mobile enquiry path for gym-goers and runners.", "Local SEO foundation for recovery, mobility and sports clinic searches."],
      gallery: ["Recovery zone", "Mobility assessment", "Clinic treatment plan"]
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

function inferLocalArea(businessName, description, existingContext) {
  const text = `${businessName} ${description} ${existingContext && existingContext.metaDescription ? existingContext.metaDescription : ""}`;
  return inferLocation(businessName, text);
}

function contextLink(context, type) {
  const links = type === "booking" ? context.bookingLinks : type === "menu" ? context.menuLinks : context.contactLinks;
  return links && links[0] ? links[0].href : "";
}

function mapsQueryFor(businessName, location, context) {
  const query = context && context.contactDetails && context.contactDetails.address
    ? context.contactDetails.address
    : `${businessName} ${location}`.trim();
  return encodeURIComponent(query);
}

function buildPublicPricingHtml(prices) {
  if (!prices || !prices.length) {
    return `
          <article class="price-card">
            <strong>Pricing available on request</strong>
            <p>Current service options can be confirmed directly with the team before booking or enquiring.</p>
          </article>`;
  }

  return prices.map(item => `
          <article class="price-card">
            <strong>Publicly listed price</strong>
            <p>${escapeHtml(item)}</p>
          </article>`).join("");
}

function buildResearchFacts(context, description) {
  const services = inferServicesFromContext(description, context.headings || [], context.services || []);
  const facts = [
    ...(services.length ? [`Services identified: ${services.slice(0, 4).join(", ")}`] : []),
    ...(context.prices && context.prices.length ? ["Public service pricing found on the current website."] : ["No public service prices found in the available page content."]),
    ...(context.contactDetails && context.contactDetails.phone ? [`Phone found: ${context.contactDetails.phone}`] : []),
    ...(context.contactDetails && context.contactDetails.email ? [`Email found: ${context.contactDetails.email}`] : []),
    ...(context.contactDetails && context.contactDetails.hours && context.contactDetails.hours.length ? ["Opening-hours text found."] : []),
    ...(context.imageCandidates && context.imageCandidates.length ? ["Same-domain image candidates found and prioritised."] : ["No reliable same-domain images found; using stock-style/CSS visuals."])
  ];

  return uniqueShortList(facts, 8);
}

function buildWebsiteHtml({ businessName, websiteUrl, description, notes, existingContext }) {
  const category = inferCategory(description);
  const theme = getWebsiteTheme(category);
  const copy = getWebsiteCopy(category, businessName, description);
  const localArea = inferLocalArea(businessName, description, existingContext || {});
  let finalServices = copy.services;

  if (category === "Fitness") {
    finalServices = [
      ["Sports recovery", "Recovery-led sessions for gym-goers, runners and active adults who want to reduce stiffness and keep training with more confidence."],
      ["Mobility support", "Clear support around movement, range of motion and everyday tightness so visitors can understand where to start."],
      ["Soft tissue therapy", "A calm, clinical presentation of hands-on recovery work without overpromising outcomes or using vague wellness copy."],
      ["Movement assessment", "A practical first-step service for people who want to discuss restrictions, training load or recurring stiffness."],
      ["Recovery planning", "A structured plan section that helps visitors see how recovery can fit around training, work and active routines."],
      ["Active lifestyle support", "Positioning for people who want to stay active, recover smarter and move better day to day."]
    ];
  } else if (existingContext && existingContext.fetched) {
    const extractedServices = inferServicesFromContext(description, existingContext.headings || [], existingContext.services || []);
    if (extractedServices.length >= 3) {
      finalServices = extractedServices.slice(0, 6).map(item => [item, `A dedicated section can explain ${item.toLowerCase()} clearly, show who it helps, and guide visitors toward the right enquiry step.`]);
    }
  }

  const publicPrices = existingContext && existingContext.prices ? existingContext.prices : [];
  const contactDetails = existingContext && existingContext.contactDetails ? existingContext.contactDetails : {};
  const phoneText = contactDetails.phone || "Details to confirm";
  const emailText = contactDetails.email || "Details to confirm";
  const addressText = contactDetails.address || (localArea !== "Local area" ? `Serving ${localArea} and the surrounding area` : "Service area to confirm");
  const hoursText = contactDetails.hours && contactDetails.hours.length ? contactDetails.hours.join(" / ") : "Details to confirm";
  const bookingUrl = existingContext && existingContext.fetched ? (contextLink(existingContext, "booking") || contextLink(existingContext, "contact")) : "";
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQueryFor(businessName, localArea, existingContext || {})}`;
  const heroImage = existingContext && existingContext.imageCandidates && existingContext.imageCandidates[0] ? existingContext.imageCandidates[0] : theme.image;
  const imageSourceLabel = existingContext && existingContext.imageCandidates && existingContext.imageCandidates.length ? "same-domain business imagery, with CSS fallback panels" : "category-relevant stock-style imagery and CSS visual panels";
  const contextNote = existingContext && existingContext.fetched ? `Redesign context safely read from ${existingContext.domain}.` : (existingContext && existingContext.reason ? existingContext.reason : "No existing website was supplied, so this concept uses the submitted brief.");
  const contextItems = [existingContext && existingContext.title ? `Existing site title: ${existingContext.title}` : "", existingContext && existingContext.metaDescription ? `Existing meta direction: ${existingContext.metaDescription}` : "", ...buildResearchFacts(existingContext || {}, description)].filter(Boolean);

  const safeName = escapeHtml(businessName);
  const safeDescription = escapeHtml(description);
  const safeNotes = escapeHtml(publicNotes(notes));
  const safeBadge = escapeHtml(copy.badge);
  const safeHeadline = escapeHtml(copy.headline);
  const safeSubhead = escapeHtml(copy.subhead);
  const safeLocalArea = escapeHtml(localArea);
  const safeWebsite = escapeHtml(websiteUrl || "No website");
  const safeHeroImage = escapeHtml(heroImage);
  const primaryCtaHref = bookingUrl ? escapeHtml(bookingUrl) : "#contact";
  const primaryCtaAttrs = bookingUrl ? ' target="_blank" rel="noopener"' : "";

  const serviceCards = finalServices.slice(0, 6).map(([title, body], index) => `
          <article class="service-card">
            <div class="service-visual service-visual-${(index % 3) + 1}" aria-hidden="true"><span>${String(index + 1).padStart(2, "0")}</span></div>
            <h3>${escapeHtml(title)}</h3>
            <p>${escapeHtml(body)}</p>
          </article>`).join("");
  const priceCards = publicPrices && publicPrices.length ? publicPrices.slice(0, 4).map(item => `<article class="info-card strong"><span>Public price</span><p>${escapeHtml(item)}</p></article>`).join("") : `<article class="info-card strong"><span>Service pricing</span><p>Pricing available on request. The live site can add confirmed service prices once the business approves them.</p></article><article class="info-card"><span>Availability</span><p>Ask about current appointments, suitability and service options before booking.</p></article>`;
  const galleryItems = uniqueRawList([...(copy.gallery || []), category === "Fitness" ? "Recovery suite" : "Signature service", category === "Fitness" ? "Mobility and movement" : "Customer journey", category === "Fitness" ? "Performance-focused plan" : "Local brand presence"].filter(Boolean), 6);
  const galleryCards = galleryItems.map((label, index) => `<article class="gallery-card gallery-card-${index + 1}" aria-label="${escapeHtml(label)} visual concept"><div><span>0${index + 1}</span><h3>${escapeHtml(label)}</h3></div></article>`).join("");
  const processCards = [["Book or enquire", `Make the first step obvious for ${businessName}: call, book, or send a short enquiry.`], ["Discuss your needs", "Frame the first conversation around goals, stiffness, recovery, suitability and the right next step."], ["Build the plan", "Show how a practical plan can connect the right service, frequency and expectations without overpromising."], ["Recover and move better", "Keep the page focused on confidence, clearer movement and a better route back to an active routine."]].map(([title, body], index) => `<article class="step-card"><span>${String(index + 1).padStart(2, "0")}</span><h3>${escapeHtml(title)}</h3><p>${escapeHtml(body)}</p></article>`).join("");
  const faqCards = [["What can I ask about first?", "Services, suitability, current availability and the best starting point can all be handled through a low-pressure enquiry."], ["Is this an exact live website?", "This is a proposal-ready concept. Final contact details, proof points, imagery and service wording should be confirmed with the business."], ["Are prices shown?", publicPrices && publicPrices.length ? "Only public business service prices found on the supplied site are included." : "No prices are invented. The page asks visitors to enquire for current service options."], ["What makes the redesign useful?", "It gives visitors a stronger first impression, clearer service routes, better local context and a cleaner path to contact."]].map(([question, answer]) => `<article class="faq-card"><h3>${escapeHtml(question)}</h3><p>${escapeHtml(answer)}</p></article>`).join("");
  const contextList = contextItems.length ? contextItems.map(item => `<li>${escapeHtml(item)}</li>`).join("") : `<li>${escapeHtml(contextNote)}</li>`;

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${safeName} | Premium Local Website Concept</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Premium website concept for ${safeName}.">
  <style>
    :root { color-scheme: light; --ink:${theme.ink}; --muted:${theme.muted}; --brand:${theme.brand}; --brand-dark:${theme.brandDark}; --accent:${theme.accent}; --soft:${theme.soft}; --bg:${theme.bg}; --panel:${theme.panel}; --line:color-mix(in srgb,var(--brand) 16%,#e5e7eb); --hero-image:url("${safeHeroImage}"); --shadow:0 30px 90px rgba(8,24,39,.14); --heavy-shadow:0 50px 140px rgba(2,8,23,.34); }
    *{box-sizing:border-box} html{scroll-behavior:smooth} body{margin:0;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif;color:var(--ink);background:#fff;line-height:1.6} a{color:inherit}.nav-inner,.section-inner{width:min(1280px,calc(100% - 48px));margin:0 auto}.site-nav{position:sticky;top:0;z-index:20;background:rgba(6,21,37,.9);color:#fff;backdrop-filter:blur(18px);border-bottom:1px solid rgba(255,255,255,.1)}.nav-inner{min-height:76px;display:flex;align-items:center;justify-content:space-between;gap:24px}.logo{font-size:20px;font-weight:950}.nav-links{display:flex;gap:24px;color:rgba(255,255,255,.78);font-size:14px;font-weight:800}.nav-links a{text-decoration:none}.nav-cta,.btn{display:inline-flex;align-items:center;justify-content:center;min-height:54px;border-radius:999px;padding:0 22px;text-decoration:none;font-weight:950;border:1px solid transparent;white-space:nowrap}.nav-cta{min-height:44px;background:var(--accent);color:var(--brand-dark)}.btn.primary{background:#fff;color:var(--brand-dark);box-shadow:0 18px 60px rgba(255,255,255,.22)}.btn.dark{background:var(--brand-dark);color:#fff}.btn.ghost{color:#fff;border-color:rgba(255,255,255,.25);background:rgba(255,255,255,.08)}.btn.light{color:var(--brand-dark);background:color-mix(in srgb,var(--soft) 74%,#fff);border-color:var(--line)}
    .hero{min-height:85vh;display:grid;align-items:center;color:#fff;background:linear-gradient(90deg,rgba(6,21,37,.98),rgba(6,21,37,.84) 45%,rgba(6,21,37,.24)),radial-gradient(circle at 72% 18%,color-mix(in srgb,var(--accent) 42%,transparent),transparent 32%),linear-gradient(135deg,var(--brand-dark),#07111f 62%,color-mix(in srgb,var(--brand) 48%,#07111f));overflow:hidden;position:relative;padding:76px 0 98px}.hero-layout{position:relative;display:grid;grid-template-columns:minmax(0,.9fr) minmax(440px,1.1fr);gap:72px;align-items:center}.eyebrow{display:inline-flex;align-items:center;gap:10px;min-height:42px;border-radius:999px;padding:8px 14px;margin-bottom:28px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.16);color:rgba(255,255,255,.9);font-weight:900;font-size:14px}h1{margin:0 0 26px;font-size:clamp(3rem,6vw,5.8rem);line-height:.9;letter-spacing:0;max-width:840px}.hero-copy{max-width:760px;margin:0 0 34px;color:rgba(255,255,255,.84);font-size:clamp(1.12rem,1.7vw,1.55rem);line-height:1.45}.hero-actions,.section-actions{display:flex;flex-wrap:wrap;gap:14px;align-items:center}.proof-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;margin-top:38px}.proof-card{min-height:118px;padding:20px;border-radius:24px;background:rgba(255,255,255,.09);border:1px solid rgba(255,255,255,.13)}.proof-card strong{display:block;font-size:22px;margin-bottom:6px}.proof-card span{color:rgba(255,255,255,.72);font-size:13px;font-weight:750}
    .hero-visual{position:relative;min-height:680px;border-radius:44px;overflow:hidden;background:linear-gradient(180deg,rgba(0,0,0,.02),rgba(0,0,0,.58)),var(--hero-image),radial-gradient(circle at 20% 12%,color-mix(in srgb,var(--accent) 70%,transparent),transparent 28%),linear-gradient(135deg,color-mix(in srgb,var(--brand) 72%,#fff),var(--brand-dark));background-size:cover;background-position:center;box-shadow:var(--heavy-shadow);border:1px solid rgba(255,255,255,.2)}.floating-card{position:absolute;z-index:2;width:min(310px,46%);padding:22px;border-radius:26px;background:rgba(255,255,255,.92);color:var(--brand-dark);box-shadow:0 28px 80px rgba(0,0,0,.22);border:1px solid rgba(255,255,255,.7)}.floating-card strong{display:block;font-size:20px;margin-bottom:6px}.floating-card p{margin:0;color:var(--muted);font-size:14px}.float-one{left:30px;bottom:34px}.float-two{right:30px;top:34px}.float-three{right:54px;bottom:120px;width:min(250px,42%);background:var(--accent)}
    section{padding:104px 0}.section-soft{background:linear-gradient(180deg,var(--bg),#fff)}.section-white{background:#fff}.section-dark{color:#fff;background:radial-gradient(circle at 12% 8%,color-mix(in srgb,var(--accent) 30%,transparent),transparent 34%),linear-gradient(135deg,var(--brand-dark),#07111f)}.section-head{max-width:880px;margin-bottom:48px}.section-head.center{margin-inline:auto;text-align:center}h2{margin:0 0 18px;font-size:clamp(2.2rem,4vw,4rem);line-height:1.05;letter-spacing:0}.section-head p,.wide-copy{margin:0;color:var(--muted);font-size:19px;line-height:1.65}.section-dark .section-head p,.section-dark .wide-copy{color:rgba(255,255,255,.74)}.services-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:28px}.service-card{min-height:360px;display:flex;flex-direction:column;padding:30px;border-radius:32px;background:#fff;border:1px solid var(--line);box-shadow:var(--shadow)}.service-visual{min-height:150px;border-radius:26px;margin-bottom:28px;display:flex;align-items:flex-end;padding:22px;color:#fff;background:linear-gradient(180deg,transparent,rgba(0,0,0,.58)),var(--hero-image),linear-gradient(135deg,var(--brand),var(--brand-dark));background-size:cover;background-position:center}.service-visual span{font-weight:950;font-size:28px}.service-card h3,.step-card h3,.faq-card h3{margin:0 0 12px;font-size:26px;line-height:1.15}.service-card p,.step-card p,.faq-card p,.info-card p,.contact-card p{margin:0;color:var(--muted);font-size:17px;line-height:1.6}
    .info-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px}.info-card,.contact-card{padding:30px;border-radius:30px;background:linear-gradient(180deg,#fff,color-mix(in srgb,var(--soft) 30%,#fff));border:1px solid var(--line);box-shadow:var(--shadow)}.info-card span,.contact-card span{display:block;color:var(--brand);font-weight:950;margin-bottom:10px}.gallery-grid{display:grid;grid-template-columns:1.25fr .9fr .9fr;gap:24px}.gallery-card{min-height:360px;border-radius:36px;padding:30px;display:flex;align-items:flex-end;overflow:hidden;background:linear-gradient(180deg,transparent 35%,rgba(0,0,0,.78)),var(--hero-image),radial-gradient(circle at 24% 20%,color-mix(in srgb,var(--accent) 64%,transparent),transparent 28%),linear-gradient(135deg,var(--brand),var(--brand-dark));background-size:cover;background-position:center;box-shadow:0 32px 90px rgba(0,0,0,.22)}.gallery-card-1{min-height:560px;grid-row:span 2}.gallery-card-2,.gallery-card-5{background:linear-gradient(180deg,transparent,rgba(0,0,0,.62)),repeating-linear-gradient(135deg,rgba(255,255,255,.14) 0 16px,transparent 16px 32px),linear-gradient(135deg,var(--brand),var(--brand-dark))}.gallery-card-3,.gallery-card-6{background:linear-gradient(180deg,transparent,rgba(0,0,0,.62)),radial-gradient(circle at 74% 18%,rgba(255,255,255,.34),transparent 30%),linear-gradient(135deg,var(--brand-dark),color-mix(in srgb,var(--brand) 72%,#fff))}.gallery-card span{color:var(--accent);font-weight:950;font-size:14px}.gallery-card h3{margin:8px 0 0;font-size:clamp(1.6rem,2.6vw,2.6rem);line-height:1.05}
    .process-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:20px}.step-card{min-height:310px;padding:30px;border-radius:32px;background:linear-gradient(180deg,var(--brand-dark),color-mix(in srgb,var(--brand) 70%,#0f172a));color:#fff;box-shadow:var(--shadow)}.step-card span{display:inline-grid;place-items:center;width:60px;height:60px;border-radius:20px;margin-bottom:34px;background:var(--accent);color:var(--brand-dark);font-weight:950}.step-card p{color:rgba(255,255,255,.74)}.location-layout{display:grid;grid-template-columns:minmax(0,.9fr) minmax(430px,1.1fr);gap:42px;align-items:stretch}.map-card{min-height:520px;border-radius:38px;padding:42px;display:flex;flex-direction:column;justify-content:space-between;background:radial-gradient(circle at 76% 16%,color-mix(in srgb,var(--accent) 46%,transparent),transparent 28%),linear-gradient(135deg,#fff,color-mix(in srgb,var(--soft) 70%,#fff));border:1px solid var(--line);box-shadow:var(--shadow)}.map-visual{min-height:520px;border-radius:38px;padding:34px;display:flex;align-items:flex-end;background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(6,21,37,.72)),repeating-linear-gradient(90deg,rgba(255,255,255,.18) 0 2px,transparent 2px 80px),repeating-linear-gradient(0deg,rgba(255,255,255,.14) 0 2px,transparent 2px 80px),radial-gradient(circle at 52% 44%,var(--accent),transparent 10%),linear-gradient(135deg,var(--brand-dark),color-mix(in srgb,var(--brand) 66%,#0f172a));color:#fff;box-shadow:var(--heavy-shadow)}.map-visual strong{display:block;font-size:34px;line-height:1;margin-bottom:8px}
    .contact-wrap{display:grid;grid-template-columns:.85fr 1.15fr;gap:32px;align-items:stretch}.contact-panel{padding:48px;border-radius:38px;background:linear-gradient(135deg,var(--brand-dark),color-mix(in srgb,var(--brand) 62%,#0f172a));color:#fff;box-shadow:var(--heavy-shadow)}.contact-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}.faq-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:22px}.faq-card{padding:32px;border-radius:30px;background:#fff;border:1px solid var(--line);box-shadow:var(--shadow)}.final-cta{padding:120px 0;text-align:center;color:#fff;background:radial-gradient(circle at 18% 0%,color-mix(in srgb,var(--accent) 42%,transparent),transparent 34%),linear-gradient(135deg,var(--brand-dark),color-mix(in srgb,var(--brand) 75%,#0f172a))}.final-cta p{max-width:760px;margin:0 auto 32px;color:rgba(255,255,255,.78);font-size:21px}footer{padding:34px 0;color:var(--muted);background:#fff;border-top:1px solid var(--line)}
    @media(max-width:980px){.nav-links{display:none}.hero-layout,.services-grid,.gallery-grid,.process-grid,.location-layout,.contact-wrap,.contact-grid,.faq-grid,.info-grid{grid-template-columns:1fr}.hero{min-height:auto;padding:58px 0 78px}.hero-visual,.map-card,.map-visual{min-height:430px}.proof-grid{grid-template-columns:1fr}.gallery-card-1{min-height:420px;grid-row:auto}section,.final-cta{padding:64px 0}.nav-inner,.section-inner{width:min(100% - 28px,1280px)}h1{font-size:clamp(2.8rem,12vw,4.4rem)}h2{font-size:clamp(2.15rem,8vw,3.4rem)}.floating-card{position:relative;left:auto;right:auto;top:auto;bottom:auto;width:auto;margin:18px}.float-three{display:none}.hero-visual{display:flex;flex-direction:column;justify-content:flex-end;gap:0}}
  </style>
</head>
<body>
  <nav class="site-nav"><div class="nav-inner"><div class="logo">${safeName}</div><div class="nav-links"><a href="#services">Services</a><a href="#process">How it works</a><a href="#location">Location</a><a href="#faq">FAQ</a></div><a class="nav-cta" href="#contact">Enquire now</a></div></nav>
  <header class="hero"><div class="section-inner hero-layout"><div><div class="eyebrow">${safeBadge} / ${safeLocalArea}</div><h1>${safeHeadline}</h1><p class="hero-copy">${safeSubhead}</p><div class="hero-actions"><a class="btn primary" href="${primaryCtaHref}"${primaryCtaAttrs}>Book consultation</a><a class="btn ghost" href="#services">Explore services</a></div><div class="proof-grid"><article class="proof-card"><strong>${safeLocalArea}</strong><span>Local positioning</span></article><article class="proof-card"><strong>Clear path</strong><span>Designed around enquiry and confidence</span></article><article class="proof-card"><strong>Concept</strong><span>Ready for business detail review</span></article></div></div><div class="hero-visual" role="img" aria-label="${safeName} premium visual concept"><article class="floating-card float-one"><strong>Recovery planning</strong><p>Clear first steps for active adults who want to reduce stiffness and move better.</p></article><article class="floating-card float-two"><strong>Mobility support</strong><p>Service-led layout for gym-goers, runners and busy local customers.</p></article><article class="floating-card float-three"><strong>${safeLocalArea}</strong><p>Local clinic concept</p></article></div></div></header>
  <main>
    <section id="services" class="section-white"><div class="section-inner"><div class="section-head"><h2>Focused services, presented like a premium local brand.</h2><p>${safeDescription}</p></div><div class="services-grid">${serviceCards}</div></div></section>
    <section class="section-soft"><div class="section-inner info-grid">${priceCards}<article class="info-card"><span>Website context</span><p>${escapeHtml(contextNote)}</p><ul>${contextList}</ul></article></div></section>
    <section class="section-dark"><div class="section-inner"><div class="section-head"><h2>Built to feel confident before a visitor ever enquires.</h2><p>${escapeHtml(imageSourceLabel)} support a richer visual first impression without fake logos, fake premises or unsupported claims.</p></div><div class="gallery-grid">${galleryCards}</div></div></section>
    <section id="process" class="section-white"><div class="section-inner"><div class="section-head center"><h2>A simple route from interest to action.</h2><p>The page works like a proper commercial website: explain the value, reduce uncertainty, then make the next step obvious.</p></div><div class="process-grid">${processCards}</div></div></section>
    <section id="location" class="section-soft"><div class="section-inner location-layout"><article class="map-card"><div><span class="eyebrow" style="background:#fff;color:var(--brand-dark);border-color:var(--line)">Location</span><h2>Local recovery support in ${safeLocalArea}.</h2><p class="wide-copy">${safeName} is positioned for people across ${safeLocalArea} and the surrounding area. The live site can add confirmed address, parking and travel details once checked.</p></div><div class="section-actions"><a class="btn dark" href="${directionsUrl}" target="_blank" rel="noopener">Get directions</a><a class="btn light" href="#contact">Enquire first</a></div></article><div class="map-visual" role="img" aria-label="${safeLocalArea} service area map concept"><div><strong>${escapeHtml(addressText)}</strong><p>Polished location panel for confirmed map/address details.</p></div></div></div></section>
    <section id="contact" class="section-dark"><div class="section-inner contact-wrap"><article class="contact-panel"><h2>Ready for the next step?</h2><p class="wide-copy">This section is designed to convert interested visitors without pretending unconfirmed details are known.</p><div class="section-actions" style="margin-top:30px"><a class="btn primary" href="${primaryCtaHref}"${primaryCtaAttrs}>${bookingUrl ? "Open booking page" : "Enquire now"}</a><a class="btn ghost" href="#faq">Read FAQ</a></div></article><div class="contact-grid"><article class="contact-card"><span>Phone</span><p>${escapeHtml(phoneText)}</p></article><article class="contact-card"><span>Email</span><p>${escapeHtml(emailText)}</p></article><article class="contact-card"><span>Address / area</span><p>${escapeHtml(addressText)}</p></article><article class="contact-card"><span>Opening hours</span><p>${escapeHtml(hoursText)}</p></article></div></div></section>
    <section id="faq" class="section-white"><div class="section-inner"><div class="section-head"><h2>Questions answered before people hesitate.</h2><p>These reassurance points help the page feel useful and specific without adding fake testimonials or unsupported claims.</p></div><div class="faq-grid">${faqCards}</div></div></section>
    <section class="final-cta"><div class="section-inner"><h2>A premium first impression for ${safeName}.</h2><p>This concept turns the brief into a proper local business landing page: stronger visuals, clearer services, better location context and a more confident enquiry path.</p><div class="hero-actions" style="justify-content:center"><a class="btn primary" href="#contact">Review enquiry section</a><a class="btn ghost" href="#services">Review services</a></div></div></section>
  </main>
  <footer><div class="section-inner">${safeName} / ${safeLocalArea} website concept. Demo only; final business details should be confirmed before launch. Current website status: ${safeWebsite}. Build notes: ${safeNotes}</div></footer>
</body>
</html>`;
}

function buildProposalHtml({ businessName, websiteUrl, description, notes, existingContext }) {
  const safeName = escapeHtml(businessName);
  const safeWebsite = escapeHtml(websiteUrl || "No website");
  const safeDescription = escapeHtml(description);
  const safeNotes = escapeHtml(publicNotes(notes));
  const hasExistingSite = Boolean(existingContext && existingContext.fetched);
  const hasPrices = Boolean(existingContext && existingContext.prices && existingContext.prices.length);
  const hasContact = Boolean(existingContext && existingContext.contactDetails && (existingContext.contactDetails.phone || existingContext.contactDetails.email || existingContext.contactDetails.address));
  const imageSource = existingContext && existingContext.imageCandidates && existingContext.imageCandidates.length
    ? "safe same-domain image candidates from the current online presence, supported by CSS fallback panels"
    : "category-specific stock-style imagery and premium CSS visual panels";
  const safeContext = escapeHtml(existingContext && existingContext.fetched
    ? `Existing website context reviewed from ${existingContext.domain}.`
    : (existingContext && existingContext.reason ? existingContext.reason : "No existing website context was available."));

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
      <h2>Executive summary</h2>
      <p>${safeName} has a clear opportunity to present its local offer with more authority, stronger visual direction, and a simpler enquiry journey.</p>
      <p class="muted">${hasExistingSite ? "This concept is a redesign/improvement of the current online presence." : "This concept is a new website direction designed to give the business a stronger local online presence."} The proposed direction helps visitors understand who the business helps, what the service experience feels like, and what to do next. ${safeContext}</p>
    </section>

    <section>
      <h2>Current situation</h2>
      <p><strong>Current website status:</strong> ${safeWebsite}</p>
      <p class="muted">Based on the submitted prospect details, ${safeName} would benefit from a clearer online presence that explains the offer quickly, builds local trust, and gives visitors an easy next step.</p>
      <p><strong>Notes:</strong> ${safeNotes}</p>
    </section>

    <section>
      <h2>Opportunity</h2>
      <div class="grid">
        <article class="card">
          <h3>Clearer positioning</h3>
          <p class="muted">Visitors need to understand who the business helps, where it operates, and why it is a good local choice within a few seconds.</p>
        </article>
        <article class="card">
          <h3>Better enquiry path</h3>
          <p class="muted">A stronger enquiry route can reduce friction and help interested customers take action without hunting for contact details.</p>
        </article>
        <article class="card">
          <h3>Local search relevance</h3>
          <p class="muted">Local service and location copy can give the business a better foundation for organic discovery over time.</p>
        </article>
      </div>
    </section>

    <section>
      <h2>Recommended improvements</h2>
      <ul>
        <li>Premium homepage structure with a strong hero, service messaging, trust signals, and direct calls to action.</li>
        <li>Local SEO copy aligned with the business description and Brentwood-area search intent.</li>
        <li>Clear visual hierarchy so customers can scan the offer quickly on mobile and desktop.</li>
        <li>Visual sections that feel specific to the business category, not like placeholder content.</li>
        <li>Safer redesign handling when an existing website is supplied, using limited context rather than copying content.</li>
        <li>Local area, directions, contact and opening-hours sections that use confirmed public details where available.</li>
      </ul>
    </section>

    <section>
      <h2>Research used</h2>
      <ul>
        <li>${hasExistingSite ? "Existing website was reviewed and used as redesign context." : "No usable existing website was available, so the concept uses the submitted business brief."}</li>
        <li>${hasPrices ? "Public business service prices were found and can be labelled clearly in the website demo." : "No public business service prices were found, so the demo does not invent any."}</li>
        <li>${hasContact ? "Public contact/location details were found and can be reflected after confirmation." : "No complete public contact/location details were found, so placeholders remain clearly marked for confirmation."}</li>
        <li>Visual source: ${escapeHtml(imageSource)}.</li>
      </ul>
    </section>

    <section class="package">
      <h2>Recommended package</h2>
      <p><strong>Premium Local Website Demo Package</strong></p>
      <p class="muted">A polished one-page website concept, local positioning copy, call-to-action structure, responsive layout, lightweight SEO foundation, proposal support page, and manual outreach draft.</p>
      <p class="value">Business value: a stronger first impression and a clearer route from visitor interest to enquiry.</p>
      <p class="muted">This does not guarantee search rankings, leads, sales, or revenue. It creates a stronger base that can be reviewed, tested, and improved.</p>
    </section>

    <section>
      <h2>Deliverables</h2>
      <ul>
        <li>Sales-ready website demo tailored to the submitted business description.</li>
        <li>Responsive structure for mobile and desktop review.</li>
        <li>Service, trust, local SEO, visual direction, and enquiry sections.</li>
        <li>Proposal page to support the sales conversation.</li>
        <li>Concise outreach email draft for manual review only.</li>
      </ul>
    </section>

    <section>
      <h2>Timeline</h2>
      <div class="grid">
        <article class="card"><h3>Step 1</h3><p class="muted">Review the demo for accuracy, offer fit, and tone.</p></article>
        <article class="card"><h3>Step 2</h3><p class="muted">Confirm services, locations, proof points, imagery approach, and preferred enquiry action.</p></article>
        <article class="card"><h3>Step 3</h3><p class="muted">Turn the approved direction into a refined live-ready version.</p></article>
      </div>
    </section>

    <section>
      <h2>Optional add-ons</h2>
      <ul>
        <li>Additional service pages for high-intent local searches.</li>
        <li>Google Business Profile copy refresh and photo guidance.</li>
        <li>Review capture prompts and testimonial placement.</li>
        <li>Conversion tracking plan for calls, forms, and important clicks.</li>
      </ul>
    </section>

    <section>
      <h2>Risks of doing nothing</h2>
      <ul>
        <li>Potential customers may compare against competitors with clearer, more trustworthy websites.</li>
        <li>Mobile visitors may leave if services, location, and next steps are not obvious.</li>
        <li>Local search pages may stay too thin to support long-term organic discovery.</li>
        <li>Outreach has less impact if the demo does not feel polished enough to start a serious conversation.</li>
      </ul>
    </section>

    <section>
      <h2>Next steps</h2>
      <ul>
        <li>Review the website concept for accuracy and tone.</li>
        <li>Confirm services, location coverage, proof points, and preferred call to action.</li>
        <li>Replace placeholder language with verified business details.</li>
        <li>Agree the highest-value page sections to refine first.</li>
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

function buildOutreachEmailHtml({ businessName, websiteUrl, description, notes, existingContext }) {
  const safeName = escapeHtml(businessName);
  const safeWebsite = escapeHtml(websiteUrl || "No website");
  const safeDescription = escapeHtml(description);
  const safeNotes = escapeHtml(publicNotes(notes));
  const contextLine = existingContext && existingContext.fetched
    ? `I had a quick look at your current site and used it only as light redesign context.`
    : `I could not rely on an existing website, so I based the idea on the business description.`;

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
      <p><strong>Subject:</strong> Website idea for ${safeName}</p>
      <div class="email">Hi ${safeName},

I came across ${safeName} and put together a short website concept based on the positioning I found: ${safeDescription}

The idea is to show how the offer could feel more polished online, make the main services easier to understand, and give local customers a clearer route to enquire.

${escapeHtml(contextLine)} Current website status: ${safeWebsite}

No pressure. If useful, I can send the demo link over for a quick look. If it feels relevant, we could then talk through what would need changing to make it accurate for the business.

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
    const existingContext = await fetchExistingWebsiteContext(websiteUrl);

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
      buildWebsiteHtml({ businessName, websiteUrl, description, notes, existingContext }),
      `Create prospect website for ${businessName}`
    );

    await githubPutFile(
      env,
      proposalPath,
      buildProposalHtml({ businessName, websiteUrl, description, notes, existingContext }),
      `Create proposal page for ${businessName}`
    );

    await githubPutFile(
      env,
      emailDraftPath,
      buildOutreachEmailHtml({ businessName, websiteUrl, description, notes, existingContext }),
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
        emailDraft: `/businesses/${slug}/outreach-email.html`
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
