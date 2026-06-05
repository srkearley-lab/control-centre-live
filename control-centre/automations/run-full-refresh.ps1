$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$DashboardPath = Join-Path $Root "dashboard\index.html"
$BusinessesDir = Join-Path $Root "businesses"

if (!(Test-Path -LiteralPath $DashboardPath)) {
  throw "Dashboard is missing: $DashboardPath"
}

if (!(Test-Path -LiteralPath $BusinessesDir)) {
  throw "Businesses folder is missing: $BusinessesDir"
}

$dashboardHtml = Get-Content -LiteralPath $DashboardPath -Raw
if ($dashboardHtml -match "\.md") {
  throw "Dashboard contains .md links. Keep dashboard links to HTML files only."
}

$requiredActions = @("website.html", "proposal.html", "outreach-email.html")
foreach ($action in $requiredActions) {
  if ($dashboardHtml -notmatch [regex]::Escape($action)) {
    throw "Dashboard is missing expected action link target: $action"
  }
}

Write-Host "Full refresh check passed. Dashboard exists, business folder exists, and simplified HTML action links are present."
