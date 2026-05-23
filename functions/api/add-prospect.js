export async function onRequestPost({ request }) {
  try {
    const data = await request.json();

    const businessName = (data.businessName || "").trim();
    const websiteUrl = (data.websiteUrl || "").trim();
    const description = (data.description || "").trim();
    const notes = (data.notes || "").trim();

    if (!businessName || !description) {
      return Response.json({
        success: false,
        message: "Business name and description are required."
      }, { status: 400 });
    }

    const slug = businessName
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    return Response.json({
      success: true,
      message: "Phase 1 test successful. The Cloudflare Function is working. GitHub write-back is not enabled yet.",
      slug,
      received: {
        businessName,
        websiteUrl,
        description,
        notes
      },
      links: {
        website: `/businesses/${slug}/website.html`,
        proposal: `/businesses/${slug}/proposal.html`,
        emailDraft: `/businesses/${slug}/outreach-email.html`,
        businessPack: `/businesses/${slug}/`
      }
    });
  } catch (error) {
    return Response.json({
      success: false,
      message: "Invalid request or server error.",
      error: String(error)
    }, { status: 500 });
  }
}
