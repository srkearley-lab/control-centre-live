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

async function githubPutFile(env, path, content, message) {
  const { owner, repo, branch, token } = getGitHubConfig(env);
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

  const response = await fetch(url, {
    method: "PUT",
    headers: githubHeaders(token),
    body: JSON.stringify({
      message,
      content: toBase64(content),
      branch
    })
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(`GitHub write failed: ${response.status} ${text}`);
  }

  return JSON.parse(text);
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

    return jsonResponse({
      success: true,
      message: "Basic prospect website created successfully. Cloudflare will redeploy shortly.",
      slug,
      links: {
        website: `/businesses/${slug}/website.html`,
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
