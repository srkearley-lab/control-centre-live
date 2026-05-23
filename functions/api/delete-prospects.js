function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: {
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

function assertSafeSlug(slug) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error(`Unsafe business slug: ${slug}`);
  }
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

  if (sha) body.sha = sha;

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

async function githubGetBranchSha(env) {
  const { owner, repo, branch, token } = getGitHubConfig(env);
  const url = `https://api.github.com/repos/${owner}/${repo}/git/ref/heads/${encodeURIComponent(branch)}`;
  const response = await fetch(url, {
    method: "GET",
    headers: githubHeaders(token)
  });
  const text = await response.text();

  if (!response.ok) {
    throw new Error(`GitHub branch lookup failed: ${response.status} ${text}`);
  }

  return JSON.parse(text).object.sha;
}

async function githubListFiles(env) {
  const { owner, repo, token } = getGitHubConfig(env);
  const branchSha = await githubGetBranchSha(env);
  const url = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branchSha}?recursive=1`;
  const response = await fetch(url, {
    method: "GET",
    headers: githubHeaders(token)
  });
  const text = await response.text();

  if (!response.ok) {
    throw new Error(`GitHub tree lookup failed: ${response.status} ${text}`);
  }

  return JSON.parse(text).tree.filter(item => item.type === "blob");
}

async function githubDeleteFile(env, path, sha, message) {
  const { owner, repo, branch, token } = getGitHubConfig(env);
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  const response = await fetch(url, {
    method: "DELETE",
    headers: githubHeaders(token),
    body: JSON.stringify({ message, sha, branch })
  });
  const text = await response.text();

  if (!response.ok) {
    throw new Error(`GitHub delete failed for ${path}: ${response.status} ${text}`);
  }

  return JSON.parse(text);
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

export async function onRequestPost({ request, env }) {
  try {
    const data = await request.json();
    const slugs = Array.from(new Set(Array.isArray(data.slugs) ? data.slugs.map(slug => String(slug).trim()).filter(Boolean) : []));

    if (!slugs.length) {
      return jsonResponse({ success: false, message: "No prospect slugs were supplied." }, 400);
    }

    slugs.forEach(assertSafeSlug);

    const dashboardPath = "index.html";
    const dashboardFile = await githubGetFile(env, dashboardPath);
    const rows = parseDashboardRows(dashboardFile.content);
    const slugSet = new Set(slugs);
    const keptRows = rows.filter(row => !slugSet.has(row.slug));
    const removedRows = rows.filter(row => slugSet.has(row.slug));

    if (!removedRows.length) {
      return jsonResponse({ success: false, message: "No matching dashboard prospects were found." }, 404);
    }

    const files = await githubListFiles(env);
    const deletedFiles = [];

    for (const slug of removedRows.map(row => row.slug)) {
      const prefix = `businesses/${slug}/`;
      const matchingFiles = files.filter(file => file.path.startsWith(prefix));

      for (const file of matchingFiles) {
        await githubDeleteFile(env, file.path, file.sha, `Delete business file ${file.path}`);
        deletedFiles.push(file.path);
      }
    }

    let updatedDashboard = replaceDashboardRows(dashboardFile.content, keptRows);
    updatedDashboard = updateDashboardMetrics(updatedDashboard, keptRows);

    await githubPutFile(
      env,
      dashboardPath,
      updatedDashboard,
      `Remove ${removedRows.length} prospect${removedRows.length === 1 ? "" : "s"} from dashboard`,
      dashboardFile.sha
    );

    return jsonResponse({
      success: true,
      message: `Deleted ${removedRows.length} prospect${removedRows.length === 1 ? "" : "s"} and ${deletedFiles.length} business file${deletedFiles.length === 1 ? "" : "s"}. Cloudflare will redeploy shortly.`,
      deletedSlugs: removedRows.map(row => row.slug),
      deletedFiles
    });
  } catch (error) {
    return jsonResponse({
      success: false,
      message: "Could not delete selected prospects.",
      error: String(error && error.message ? error.message : error)
    }, 500);
  }
}
