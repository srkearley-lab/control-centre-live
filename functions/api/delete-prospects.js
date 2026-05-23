const CORS_HEADERS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "POST, OPTIONS",
  "access-control-allow-headers": "Content-Type",
  "access-control-max-age": "86400"
};

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: {
      ...CORS_HEADERS,
      "content-type": "application/json; charset=utf-8"
    }
  });
}

function toBase64(value) {
  return btoa(unescape(encodeURIComponent(value)));
}

function fromBase64(value) {
  return decodeURIComponent(escape(atob(value)));
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

function isSafeSlug(slug) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

async function githubRequest(env, path, options = {}) {
  const { owner, repo, token } = getGitHubConfig(env);
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}${path}`, {
    ...options,
    headers: {
      ...githubHeaders(token),
      ...(options.headers || {})
    }
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(`GitHub request failed: ${response.status} ${text}`);
  }

  return data;
}

async function githubGetFile(env, path) {
  const { branch } = getGitHubConfig(env);
  const data = await githubRequest(env, `/contents/${path}?ref=${encodeURIComponent(branch)}`);

  return {
    sha: data.sha,
    content: fromBase64(String(data.content || "").replace(/\s/g, ""))
  };
}

async function githubGetBranch(env) {
  const { branch } = getGitHubConfig(env);
  const ref = await githubRequest(env, `/git/ref/heads/${encodeURIComponent(branch)}`);
  const commit = await githubRequest(env, `/git/commits/${ref.object.sha}`);

  return {
    commitSha: ref.object.sha,
    treeSha: commit.tree.sha
  };
}

async function githubListFiles(env, treeSha) {
  const data = await githubRequest(env, `/git/trees/${treeSha}?recursive=1`);
  return data.tree.filter(item => item.type === "blob");
}

async function githubCreateBlob(env, content) {
  const data = await githubRequest(env, "/git/blobs", {
    method: "POST",
    body: JSON.stringify({
      content: toBase64(content),
      encoding: "base64"
    })
  });

  return data.sha;
}

async function githubCreateTree(env, baseTreeSha, tree) {
  return githubRequest(env, "/git/trees", {
    method: "POST",
    body: JSON.stringify({
      base_tree: baseTreeSha,
      tree
    })
  });
}

async function githubCreateCommit(env, message, treeSha, parentSha) {
  return githubRequest(env, "/git/commits", {
    method: "POST",
    body: JSON.stringify({
      message,
      tree: treeSha,
      parents: [parentSha]
    })
  });
}

async function githubUpdateBranch(env, commitSha) {
  const { branch } = getGitHubConfig(env);
  return githubRequest(env, `/git/refs/heads/${encodeURIComponent(branch)}`, {
    method: "PATCH",
    body: JSON.stringify({
      sha: commitSha,
      force: false
    })
  });
}

function rowsBounds(html) {
  const start = html.indexOf("    const rows = [");
  const arrayStart = html.indexOf("[", start);
  const arrayEnd = html.indexOf("\n];", arrayStart);

  if (start === -1 || arrayStart === -1 || arrayEnd === -1) {
    throw new Error("Could not find dashboard rows array.");
  }

  return { start, arrayStart, arrayEnd, end: arrayEnd + 3 };
}

function parseDashboardRows(html) {
  const bounds = rowsBounds(html);
  return JSON.parse(html.slice(bounds.arrayStart, bounds.arrayEnd + 2));
}

function replaceDashboardRows(html, rows) {
  const bounds = rowsBounds(html);
  const formatted = JSON.stringify(rows, null, 12);
  return html.slice(0, bounds.start) + `    const rows = ${formatted};` + html.slice(bounds.end);
}

function replaceFirstCountBeforeLabel(html, label, value) {
  const pattern = new RegExp(`(<strong>)\\d+(<\\/strong><span>${label}<\\/span>)`);
  return html.replace(pattern, `$1${value}$2`);
}

function replaceFirstCountAfterText(html, text, value) {
  const pattern = new RegExp(`(${text}<\\/span><b class="count">)\\d+(<\\/b>)`);
  return html.replace(pattern, `$1${value}$2`);
}

function updateDashboardMetrics(html, rows) {
  const total = rows.length;
  const highPriority = rows.filter(row => row.priority === "High").length;
  const mediumPriority = rows.filter(row => row.priority === "Medium").length;
  const websitesReady = rows.filter(row => row.websiteReady === "Ready").length;
  const emailsDrafted = rows.filter(row => row.emailDraft === "Drafted").length;
  const readyForReview = rows.filter(row => row.status === "Ready for review").length;

  let updated = html;
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

  return updated;
}

async function parseRequestJson(request) {
  try {
    return await request.json();
  } catch (error) {
    throw new Error("Request body must be valid JSON.");
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS
  });
}

export async function onRequestPost({ request, env }) {
  try {
    const data = await parseRequestJson(request);
    const slugs = Array.from(new Set(Array.isArray(data.slugs) ? data.slugs.map(slug => String(slug).trim()).filter(Boolean) : []));

    if (!Array.isArray(data.slugs)) {
      return jsonResponse({ success: false, message: "slugs must be an array." }, 400);
    }

    if (!slugs.length) {
      return jsonResponse({ success: false, message: "No prospect slugs were supplied." }, 400);
    }

    const unsafeSlug = slugs.find(slug => !isSafeSlug(slug));

    if (unsafeSlug) {
      return jsonResponse({
        success: false,
        message: "Unsafe business slug rejected.",
        error: `Invalid slug: ${unsafeSlug}`
      }, 400);
    }

    const dashboardFile = await githubGetFile(env, "index.html");
    const rows = parseDashboardRows(dashboardFile.content);
    const slugSet = new Set(slugs);
    const keptRows = rows.filter(row => !slugSet.has(row.slug));
    const removedRows = rows.filter(row => slugSet.has(row.slug));

    if (!removedRows.length) {
      return jsonResponse({ success: false, message: "No matching dashboard prospects were found.", deleted: [] }, 404);
    }

    const branch = await githubGetBranch(env);
    const files = await githubListFiles(env, branch.treeSha);
    const removedSlugSet = new Set(removedRows.map(row => row.slug));
    const filesToDelete = files.filter(file => {
      const match = file.path.match(/^businesses\/([a-z0-9]+(?:-[a-z0-9]+)*)\//);
      return match && removedSlugSet.has(match[1]);
    });

    let updatedDashboard = replaceDashboardRows(dashboardFile.content, keptRows);
    updatedDashboard = updateDashboardMetrics(updatedDashboard, keptRows);

    const indexBlobSha = await githubCreateBlob(env, updatedDashboard);
    const tree = [
      {
        path: "index.html",
        mode: "100644",
        type: "blob",
        sha: indexBlobSha
      },
      ...filesToDelete.map(file => ({
        path: file.path,
        mode: "100644",
        type: "blob",
        sha: null
      }))
    ];

    const newTree = await githubCreateTree(env, branch.treeSha, tree);
    const commit = await githubCreateCommit(
      env,
      `Delete selected prospects: ${removedRows.map(row => row.slug).join(", ")}`,
      newTree.sha,
      branch.commitSha
    );
    await githubUpdateBranch(env, commit.sha);

    return jsonResponse({
      success: true,
      message: "Selected businesses deleted successfully. Cloudflare will redeploy shortly.",
      deleted: removedRows.map(row => row.slug),
      deletedFiles: filesToDelete.map(file => file.path)
    });
  } catch (error) {
    return jsonResponse({
      success: false,
      message: "Could not delete selected prospects.",
      error: String(error && error.message ? error.message : error)
    }, 500);
  }
}

export async function onRequestGet() {
  return jsonResponse({
    success: false,
    message: "Use POST with JSON: { \"slugs\": [\"business-slug\"] }"
  }, 405);
}
