param(
  [Parameter(Mandatory=$true)]
  [string]$BusinessName,

  [Parameter(Mandatory=$true)]
  [string]$Website,

  [Parameter(Mandatory=$true)]
  [ValidateNotNullOrEmpty()]
  [string]$Description,

  [string]$Notes = ""
)

$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$BusinessesDir = Join-Path $Root "businesses"
$DashboardPath = Join-Path $Root "dashboard\index.html"

function Convert-ToSlug([string]$Value) {
  $slug = $Value.ToLowerInvariant()
  $slug = $slug -replace "[^a-z0-9]+", "-"
  $slug = $slug.Trim("-")
  if ([string]::IsNullOrWhiteSpace($slug)) { return "new-prospect" }
  return $slug
}

function Test-WebsiteValid([string]$Value) {
  if ([string]::IsNullOrWhiteSpace($Value)) { return $false }
  if ($Value.Trim() -match "(?i)^(no website|none|n/a|null)$") { return $false }
  return ($Value.Trim() -match "^(https?://)?[a-z0-9][a-z0-9.-]+\.[a-z]{2,}(/.*)?$")
}

function Html([string]$Value) {
  return [System.Net.WebUtility]::HtmlEncode($Value)
}

function Infer-Category([string]$Text) {
  $t = $Text.ToLowerInvariant()
  if ($t -match "barber|hair|fade|grooming") { return "Barber" }
  if ($t -match "cafe|coffee|brunch|breakfast|restaurant|food") { return "Cafe" }
  if ($t -match "dog|pet|groom") { return "Dog Groomer" }
  if ($t -match "garage|vehicle|car|mot|mechanic|diagnostic|servicing") { return "Vehicle Services" }
  if ($t -match "builder|construction|roof|plumb|electric") { return "Trade Services" }
  if ($t -match "beauty|nail|salon|spa") { return "Beauty / Salon" }
  return "Local Business"
}

function Infer-Location([string]$Text) {
  if ($Text -match "(?i)\b(Brentwood|Shenfield|Essex|Chelmsford|Billericay|Romford|Hutton)\b") { return $Matches[1] }
  return "Local area"
}

function Service-List([string]$Category, [string]$Text) {
  switch -Regex ($Category) {
    "Barber" { return @("Premium cuts and fades", "Classic grooming", "Beard trims and shaping", "Opening hours and booking CTA", "Gallery of finished styles") }
    "Cafe" { return @("Coffee and hot drinks", "Breakfast and brunch", "Lunch and takeaway", "Cakes and specials", "Opening hours and visit CTA") }
    "Dog Groomer" { return @("Full groom packages", "Bath and blow dry", "Puppy groom introductions", "Nail trims and coat care", "Booking and enquiry CTA") }
    "Vehicle" { return @("Servicing and repairs", "Diagnostics", "MOT support", "Brakes and safety checks", "Booking and call CTA") }
    "Trade" { return @("Core services", "Project enquiries", "Local service areas", "Trust and previous work", "Quote request CTA") }
    default { return @("Core services", "Pricing guidance", "Trust signals", "Gallery / visual proof", "Contact and enquiry CTA") }
  }
}

function Example-Pricing([string]$Category) {
  switch -Regex ($Category) {
    "Barber" { return @("Classic cut|Clean barber cut with tidy finish|£18-24", "Skin fade|Detailed fade work with sharp edges|£24-30", "Cut and beard shape|Haircut, beard trim and finish|£30-38") }
    "Cafe" { return @("Coffee and pastry|Fresh coffee with cake or pastry option|£5-7", "Breakfast plate|Cafe breakfast with warm sides|£8-12", "Lunch special|Sandwich, salad or hot plate|£9-14") }
    "Dog Groomer" { return @("Small dog full groom|Full groom for smaller breeds|£45-60", "Medium dog full groom|Wash, trim, style and finish|£55-75", "Bath and brush|Freshen-up bath and brush|£30-50") }
    "Vehicle" { return @("Diagnostic check|Fault-finding and practical advice|£55-90", "Interim service|Routine maintenance and checks|£120-180", "Full service|Broader inspection and service work|£220-320") }
    default { return @("Starter option|Entry-level service or offer|Example price", "Popular option|Main customer choice|Example price", "Premium option|Higher-value service package|Example price") }
  }
}

function Write-Page([string]$Path, [string]$Content) {
  $dir = Split-Path -Parent $Path
  if (!(Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
  Set-Content -Path $Path -Value $Content -Encoding UTF8
}

$WebsiteIsValid = Test-WebsiteValid $Website
$WebsiteStatus = if ($WebsiteIsValid) { "Website provided" } else { "No website" }
$Category = Infer-Category $Description
$Location = Infer-Location $Description
$Slug = Convert-ToSlug "$BusinessName $Location"
$BusinessDir = Join-Path $BusinessesDir $Slug
$Services = Service-List $Category $Description
$Prices = Example-Pricing $Category
$Priority = if ($Description -match "(?i)low priority|not urgent|maybe later") { "Medium" } else { "High" }
$Email = "Not found"
$Phone = "Not found"
$ContactFound = if ($WebsiteIsValid) { "Needs manual check" } else { "Needs manual check" }
$WebsiteScore = if ($WebsiteIsValid) { 62 } else { 35 }
$SEOScore = if ($WebsiteIsValid) { 58 } else { 28 }
$EmailDraftStatus = "Drafted"
$WebsiteReadyStatus = "Ready"
$OutreachStatus = "Ready for review"
$SEOOpportunity = "$Category searches in $Location, service keywords, location pages, Google Business Profile consistency and stronger local conversion signals."
$ReasonToContact = if ($WebsiteIsValid) {
  "Website provided, but the description suggests an opportunity to improve positioning, conversion, local SEO and service clarity."
} else {
  "The business appears to have no dedicated website and could benefit from a professional online presence showing services, pricing guidance, contact details and local SEO."
}
$NextAction = "Review generated website, proposal and email draft before any manual outreach."

$serviceCards = ($Services | ForEach-Object {
  "<article class='card'><h3>$(Html $_)</h3><p>Designed to make the offer clearer, build trust and move local customers toward an enquiry.</p></article>"
}) -join "`n"

$pricingCards = ($Prices | ForEach-Object {
  $parts = $_ -split "\|"
  "<article class='card price'><h3>$(Html $parts[0])</h3><p>$(Html $parts[1])</p><strong>$(Html $parts[2])</strong><small>Example pricing - to be confirmed by the business.</small></article>"
}) -join "`n"

$websiteHtml = @"
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>$(Html $BusinessName) | Website Preview</title>
  <style>
    :root{--dark:#101827;--accent:#6d5dfc;--accent2:#35c7ff;--soft:#f4f7fb;--ink:#111827;--muted:#64748b;--line:#dce4ef}
    *{box-sizing:border-box}body{margin:0;font-family:Inter,Arial,sans-serif;color:var(--ink);background:#fff;line-height:1.55}.wrap{width:min(1240px,calc(100% - 40px));margin:0 auto}.bar{background:#080d13;color:#d8e2ec;padding:9px 0;font-size:13px}.hero{background:linear-gradient(135deg,var(--dark),#263665 58%,var(--accent));color:#fff;padding:78px 0}.hero-grid{display:grid;grid-template-columns:1fr .8fr;gap:42px;align-items:center}h1{font-size:clamp(44px,7vw,84px);line-height:.96;margin:0}.lead{font-size:20px;color:#dce8f5;max-width:760px}.btn{display:inline-flex;min-height:46px;align-items:center;justify-content:center;border-radius:8px;padding:0 18px;text-decoration:none;font-weight:950;background:var(--accent2);color:#06111d;margin-right:10px}.visual{min-height:460px;border-radius:12px;background:linear-gradient(135deg,#78dbff,#6d5dfc 50%,#101827);box-shadow:0 30px 80px rgba(0,0,0,.28);position:relative;overflow:hidden}.visual:after{content:'$(Html $Category) in $(Html $Location)';position:absolute;left:30px;bottom:28px;color:#fff;font-size:46px;font-weight:950}.section{padding:76px 0}.band{background:var(--soft)}.head{display:flex;justify-content:space-between;gap:24px;align-items:end;margin-bottom:28px}.head h2{font-size:clamp(32px,4.4vw,58px);line-height:1.02;margin:0;color:var(--dark)}.head p{max-width:560px;color:var(--muted)}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}.card{background:#fff;border:1px solid var(--line);border-radius:10px;padding:26px;box-shadow:0 18px 46px rgba(15,23,42,.08)}.card h3{font-size:23px;color:var(--dark);margin:0 0 10px}.card p,.card small{color:var(--muted)}.price strong{display:block;font-size:32px;color:var(--dark)}.gallery{display:grid;grid-template-columns:1.2fr .8fr .8fr;gap:18px}.tile{min-height:240px;border-radius:12px;background:linear-gradient(135deg,#6d5dfc,#35c7ff);position:relative;overflow:hidden;box-shadow:0 20px 54px rgba(15,23,42,.18)}.tile:after{content:attr(data-label);position:absolute;left:22px;bottom:20px;color:#fff;font-size:34px;font-weight:950}.faq details{border:1px solid var(--line);border-radius:10px;padding:16px;background:#fff;margin-bottom:12px}.cta{background:var(--dark);color:#fff}.footer{background:#080d13;color:#cbd5e1;padding:28px 0}@media(max-width:900px){.hero-grid,.grid,.gallery,.head{display:block}.card,.tile{margin-bottom:16px}.visual{min-height:320px}}
  </style>
</head>
<body>
  <div class="bar"><div class="wrap">Demo concept only - created as an example website proposal.</div></div>
  <header class="hero"><div class="wrap hero-grid"><div><h1>$(Html $BusinessName): Premium $(Html $Category) Website for $(Html $Location)</h1><p class="lead">$(Html $Description)</p><a class="btn" href="#contact">Enquire now</a><a class="btn" href="#services">View services</a></div><div class="visual"></div></div></header>
  <section id="services" class="section band"><div class="wrap"><div class="head"><h2>Services</h2><p>Business-specific service sections shaped by Shane's description.</p></div><div class="grid">$serviceCards</div></div></section>
  <section id="pricing" class="section"><div class="wrap"><div class="head"><h2>Pricing guidance</h2><p>Useful example pricing for customer confidence.</p></div><div class="grid">$pricingCards</div></div></section>
  <section class="section band"><div class="wrap"><div class="head"><h2>Why choose us?</h2><p>Clear positioning, trust signals, local relevance and a simple enquiry route.</p></div><div class="grid"><article class="card"><h3>Local</h3><p>Positioned around $(Html $Location) customers.</p></article><article class="card"><h3>Clear</h3><p>Services, prices and FAQs are easy to scan.</p></article><article class="card"><h3>Conversion focused</h3><p>Calls to action guide visitors toward contact.</p></article></div></div></section>
  <section class="section"><div class="wrap"><div class="head"><h2>Gallery / visual proof</h2><p>Premium visual panels ready to replace with real images later.</p></div><div class="gallery"><div class="tile" data-label="Service quality"></div><div class="tile" data-label="Local trust"></div><div class="tile" data-label="Customer journey"></div></div></div></section>
  <section class="section band"><div class="wrap"><div class="head"><h2>About</h2><p>$(Html $BusinessName) is positioned as a strong local $(Html $Category) prospect with a website built around trust, clarity and enquiries.</p></div></div></section>
  <section class="section"><div class="wrap"><div class="head"><h2>Example testimonials</h2><p>Placeholder testimonials only - replace with verified customer feedback.</p></div><div class="grid"><article class="card"><h3>Example review</h3><p>Friendly, local and easy to contact.</p></article><article class="card"><h3>Example review</h3><p>Clear service and professional presentation.</p></article><article class="card"><h3>Example review</h3><p>A strong local business experience.</p></article></div></div></section>
  <section class="section band faq"><div class="wrap"><div class="head"><h2>FAQ</h2><p>Answers that reduce friction before contact.</p></div><details><summary>What services are available?</summary><p>The service list should be confirmed by the business before launch.</p></details><details><summary>Is pricing final?</summary><p>No. Example pricing - to be confirmed by the business.</p></details><details><summary>Where is the business based?</summary><p>$(Html $Location).</p></details></div></section>
  <section id="local-seo-structure" class="section"><div class="wrap"><div class="head"><h2>Local SEO structure</h2><p>$(Html $SEOOpportunity)</p></div></div></section>
  <section id="contact" class="section cta"><div class="wrap"><div class="head"><h2>Contact / booking</h2><p>Phone: $(Html $Phone) | Email: $(Html $Email) | Website status: $(Html $WebsiteStatus)</p></div></div></section>
  <footer class="footer"><div class="wrap">Demo concept only - created as an example website proposal.</div></footer>
</body>
</html>
"@

$proposalHtml = @"
<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>$(Html $BusinessName) Proposal</title><style>body{margin:0;font-family:Inter,Arial,sans-serif;background:#f4f7fb;color:#111827}.wrap{width:min(1100px,calc(100% - 36px));margin:0 auto;padding:36px 0}.hero{background:#101827;color:#fff;padding:52px 0}h1{font-size:54px;margin:0}.card{background:#fff;border:1px solid #dce4ef;border-radius:10px;padding:24px;margin:18px 0;box-shadow:0 14px 38px rgba(15,23,42,.08)}.btn{display:inline-flex;padding:12px 16px;border-radius:8px;background:#6d5dfc;color:#fff;text-decoration:none;font-weight:800}</style></head><body><header class="hero"><div class="wrap"><h1>Sales Proposal</h1><p>$(Html $ReasonToContact)</p></div></header><main class="wrap"><section class="card"><h2>Why this business is a good prospect</h2><p>$(Html $ReasonToContact)</p></section><section class="card"><h2>What Shane is proposing</h2><p>$(Html $Description)</p><p>This website would show the business clearly, explain services, provide example pricing, improve trust, support local SEO and make it easier for local customers to enquire.</p></section><section class="card"><h2>Current website/opportunity summary</h2><p>Website status: $(Html $WebsiteStatus). Website score: $WebsiteScore/100. SEO score: $SEOScore/100.</p></section><section class="card"><h2>Suggested package</h2><p><strong>Growth Website - £5,000 suggested value</strong></p><p>Final package scope should be reviewed and approved before pitching.</p></section><section class="card"><h2>What is included</h2><ul><li>Premium one-page website preview</li><li>Services, pricing guidance, FAQ and trust sections</li><li>Local SEO structure</li><li>Contact/booking journey</li><li>Email draft for manual approval</li></ul></section><section class="card"><h2>SEO opportunity</h2><p>$(Html $SEOOpportunity)</p></section><section class="card"><h2>Suggested next step</h2><p>Review the generated website and email draft. Do not send anything until manually approved.</p><a class="btn" href="website.html">View Website</a> <a class="btn" href="../../dashboard/index.html">Back to dashboard</a></section></main></body></html>
"@

$noWebsiteLine = if ($WebsiteIsValid) {
  "I noticed there may be an opportunity to improve your current online presence and make your services, pricing guidance and contact journey clearer."
} else {
  "I noticed you may not have a dedicated website and thought there could be an opportunity to create a clean, modern online presence that shows your services, pricing, contact details and makes it easier for local customers to enquire."
}

$emailDraft = @"
Hi $BusinessName team,

$noWebsiteLine

I put together a website preview based on this idea:
$Description

The pricing shown is example pricing only and would need to be confirmed by the business.

If useful, I can send over the preview for review. No pressure either way.

Kind regards,
Shane

Opt-out: If this is not relevant, just reply 'no thanks' and I will not contact you again.
"@

$outreachHtml = @"
<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>$(Html $BusinessName) Email Draft</title><style>body{margin:0;font-family:Inter,Arial,sans-serif;background:#f4f7fb;color:#111827}.wrap{width:min(1100px,calc(100% - 36px));margin:0 auto;padding:36px 0}.hero{background:#101827;color:#fff;padding:52px 0}.card{background:#fff;border:1px solid #dce4ef;border-radius:10px;padding:24px;margin:18px 0;box-shadow:0 14px 38px rgba(15,23,42,.08)}pre{white-space:pre-wrap;background:#f8fafc;border:1px solid #dce4ef;border-radius:10px;padding:18px}.btn{display:inline-flex;padding:12px 16px;border-radius:8px;background:#6d5dfc;color:#fff;text-decoration:none;font-weight:800}</style></head><body><header class="hero"><div class="wrap"><h1>Outreach Email Draft</h1><p>Draft only - do not send automatically.</p></div></header><main class="wrap"><section class="card"><h2>Subject line options</h2><ul><li>Website idea for $(Html $BusinessName)</li><li>A cleaner online presence for $(Html $BusinessName)</li><li>Quick local website suggestion</li></ul></section><section class="card"><h2>Reason for contacting</h2><p>$(Html $ReasonToContact)</p><p><a class="btn" href="website.html">View website preview</a></p></section><section class="card"><h2>Approval status</h2><p><strong>Needs manual review. Do not send automatically.</strong></p></section><section class="card"><h2>Final email draft</h2><pre>$(Html $emailDraft)</pre></section></main></body></html>
"@

$profileHtml = @"
<!doctype html><html lang="en"><head><meta charset="utf-8"><title>$(Html $BusinessName) Profile</title><style>body{font-family:Arial,sans-serif;background:#f4f7fb;color:#111827}.wrap{max-width:900px;margin:40px auto;background:#fff;padding:28px;border-radius:10px}</style></head><body><main class="wrap"><h1>Business Profile</h1><p><strong>Business:</strong> $(Html $BusinessName)</p><p><strong>Website:</strong> $(Html $Website)</p><p><strong>Description:</strong> $(Html $Description)</p><p><strong>Category:</strong> $(Html $Category)</p><p><strong>Location:</strong> $(Html $Location)</p><p><strong>Website status:</strong> $(Html $WebsiteStatus)</p><p><strong>Contact found:</strong> $(Html $ContactFound)</p></main></body></html>
"@

$seoAuditHtml = @"
<!doctype html><html lang="en"><head><meta charset="utf-8"><title>$(Html $BusinessName) SEO Audit</title><style>body{font-family:Arial,sans-serif;background:#f4f7fb;color:#111827}.wrap{max-width:900px;margin:40px auto;background:#fff;padding:28px;border-radius:10px}</style></head><body><main class="wrap"><h1>SEO Audit</h1><p><strong>SEO score:</strong> $SEOScore/100</p><p><strong>SEO opportunity:</strong> $(Html $SEOOpportunity)</p><ul><li>Build local service sections</li><li>Add consistent business name, address and phone</li><li>Use Google Business Profile improvements</li><li>Add reviews and real imagery when available</li></ul></main></body></html>
"@

$notesHtml = @"
<!doctype html><html lang="en"><head><meta charset="utf-8"><title>$(Html $BusinessName) Notes</title><style>body{font-family:Arial,sans-serif;background:#f4f7fb;color:#111827}.wrap{max-width:900px;margin:40px auto;background:#fff;padding:28px;border-radius:10px}</style></head><body><main class="wrap"><h1>Notes</h1><p>$(Html $Notes)</p><p><strong>Description used:</strong> $(Html $Description)</p><p>No emails sent automatically.</p></main></body></html>
"@

$statusHtml = @"
<!doctype html><html lang="en"><head><meta charset="utf-8"><title>$(Html $BusinessName) Status</title><style>body{font-family:Arial,sans-serif;background:#f4f7fb;color:#111827}.wrap{max-width:900px;margin:40px auto;background:#fff;padding:28px;border-radius:10px}</style></head><body><main class="wrap"><h1>Status</h1><p><strong>Website ready:</strong> $(Html $WebsiteReadyStatus)</p><p><strong>Email draft:</strong> $(Html $EmailDraftStatus)</p><p><strong>Outreach status:</strong> $(Html $OutreachStatus)</p><p><strong>Next action:</strong> $(Html $NextAction)</p></main></body></html>
"@

if (!(Test-Path $BusinessDir)) { New-Item -ItemType Directory -Path $BusinessDir -Force | Out-Null }
Write-Page (Join-Path $BusinessDir "website.html") $websiteHtml
Write-Page (Join-Path $BusinessDir "proposal.html") $proposalHtml
Write-Page (Join-Path $BusinessDir "outreach-email.html") $outreachHtml
Write-Page (Join-Path $BusinessDir "business-profile.html") $profileHtml
Write-Page (Join-Path $BusinessDir "seo-audit.html") $seoAuditHtml
Write-Page (Join-Path $BusinessDir "notes.html") $notesHtml
Write-Page (Join-Path $BusinessDir "status.html") $statusHtml

$record = [pscustomobject]@{
  BusinessName = $BusinessName
  Slug = $Slug
  Website = if ($WebsiteIsValid) { $Website } else { "No website" }
  Description = $Description
  Notes = $Notes
  Category = $Category
  Location = $Location
  Email = $Email
  Phone = $Phone
  WebsiteStatus = $WebsiteStatus
  WebsiteScore = $WebsiteScore
  SEOScore = $SEOScore
  Priority = $Priority
  ReasonToContact = $ReasonToContact
  ContactFound = $ContactFound
  EmailDraftStatus = $EmailDraftStatus
  WebsiteReadyStatus = $WebsiteReadyStatus
  OutreachStatus = $OutreachStatus
  NextAction = $NextAction
}

$recordsPath = Join-Path $Root "leads\generated-prospects.jsonl"
if (!(Test-Path (Split-Path -Parent $recordsPath))) { New-Item -ItemType Directory -Path (Split-Path -Parent $recordsPath) -Force | Out-Null }
($record | ConvertTo-Json -Compress) | Add-Content -Path $recordsPath -Encoding UTF8

if (Test-Path $DashboardPath) {
  $initials = (($BusinessName -split "\s+" | Where-Object { $_ }) | ForEach-Object { $_.Substring(0,1).ToUpperInvariant() }) -join ""
  if ($initials.Length -gt 2) { $initials = $initials.Substring(0,2) }
  if ([string]::IsNullOrWhiteSpace($initials)) { $initials = "NP" }

  $dashboardRow = [ordered]@{
    slug = $Slug
    name = $BusinessName
    initials = $initials
    category = $Category
    location = $Location
    priority = $Priority
    websiteStatus = $WebsiteStatus
    websiteScore = $WebsiteScore
    score = $SEOScore
    reason = $ReasonToContact
    contactFound = $ContactFound
    emailDraft = $EmailDraftStatus
    websiteReady = $WebsiteReadyStatus
    status = $OutreachStatus
    nextAction = $NextAction
    folderPath = $BusinessDir
  }

  $rowJson = $dashboardRow | ConvertTo-Json -Compress
  $dashboardHtml = Get-Content -Path $DashboardPath -Raw
  if ($dashboardHtml -notmatch [regex]::Escape('"slug":"' + $Slug + '"')) {
    $pattern = '(?s)(const rows = \[)(.*?)(\];\s*const tbody)'
    $replacement = '${1}' + "`n      " + $rowJson + ',${2}${3}'
    $dashboardHtml = [regex]::Replace($dashboardHtml, $pattern, $replacement, 1)
    Set-Content -Path $DashboardPath -Value $dashboardHtml -Encoding UTF8
  }
}

Write-Host "Created prospect pack: $BusinessDir"
Write-Host "Website status: $WebsiteStatus"
Write-Host "Reason to contact: $ReasonToContact"
Write-Host "No emails were sent."
Write-Host "Run the full refresh/dashboard update process, then review dashboard/index.html."
