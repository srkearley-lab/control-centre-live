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

async function githubPutFile(env, path, content, message) {
  const owner = env.GITHUB_OWNER;
  const repo = env.GITHUB_REPO;
  const branch = env.GITHUB_BRANCH || "main";
  const token = env.GITHUB_TOKEN;

  if (!owner || !repo || !branch || !token) {
    throw new Error("Missing GitHub environment variables.");
  }

  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "authorization": `Bearer ${token}`,
      "accept": "application/vnd.github+json",
      "content-type": "application/json",
      "user-agent": "control-centre-live"
    },
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

    const testPayload = {
      createdAt: new Date().toISOString(),
      businessName,
      websiteUrl,
      description,
      notes,
      slug,
      phase: "2A GitHub write-back test"
    };

    const path = `prospect-writeback-tests/${slug}.json`;

    await githubPutFile(
      env,
      path,
      JSON.stringify(testPayload, null, 2),
      `Test prospect write-back for ${businessName}`
    );

    return jsonResponse({
      success: true,
      message: "Phase 2A success. Cloudflare Function wrote a test file to GitHub.",
      slug,
      githubPath: path,
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
      message: "Phase 2A failed.",
      error: String(error && error.message ? error.message : error)
    }, 500);
  }
}
