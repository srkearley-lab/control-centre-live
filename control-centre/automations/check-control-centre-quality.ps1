$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$SettingsPath = Join-Path $Root "configs\daily-prospect-settings.json"
$BusinessesDir = Join-Path $Root "businesses"
$DashboardPath = Join-Path $Root "dashboard\index.html"

$minimumBytes = 25000
if (Test-Path -LiteralPath $SettingsPath) {
  $settings = Get-Content -LiteralPath $SettingsPath -Raw | ConvertFrom-Json
  if ($settings.qualityMinimumWebsiteBytes) { $minimumBytes = [int]$settings.qualityMinimumWebsiteBytes }
}

if (!(Test-Path -LiteralPath $DashboardPath)) { throw "Dashboard missing: $DashboardPath" }
$dashboard = Get-Content -LiteralPath $DashboardPath -Raw
if ($dashboard -match "\.md") { throw "Dashboard contains .md links." }
if ($dashboard -match "Estimated Value|Image Assets|Pricing Included|Demo Quality") {
  throw "Dashboard contains a removed/clutter column."
}

$requiredFiles = @("website.html", "proposal.html", "outreach-email.html", "seo-audit.html", "business-profile.html", "notes.html", "status.html")
$failures = New-Object System.Collections.Generic.List[string]

Get-ChildItem -LiteralPath $BusinessesDir -Directory | ForEach-Object {
  $business = $_
  foreach ($file in $requiredFiles) {
    $path = Join-Path $business.FullName $file
    if (!(Test-Path -LiteralPath $path)) {
      $failures.Add("Missing $file in $($business.Name)")
    }
  }
  $website = Join-Path $business.FullName "website.html"
  if (Test-Path -LiteralPath $website) {
    $length = (Get-Item -LiteralPath $website).Length
    if ($length -lt $minimumBytes) {
      $failures.Add("$($business.Name)\website.html is only $length bytes; minimum is $minimumBytes")
    }
  }
}

if ($failures.Count -gt 0) {
  throw "Quality check failed:`n$($failures -join "`n")"
}

Write-Host "Quality check passed. Dashboard is clean and all business website packs meet the minimum file checks."
