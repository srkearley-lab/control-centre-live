param(
  [switch]$WhatIfRun
)

$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$ConfigPath = Join-Path $Root "configs\daily-prospect-settings.json"
$BusinessesDir = Join-Path $Root "businesses"
$LeadsPath = Join-Path $Root "leads\active-leads.csv"
$LogPath = Join-Path $Root "logs\prospecting-activity-log.md"
$AddProspectScript = Join-Path $Root "automations\add-prospect-auto.ps1"
$RefreshScript = Join-Path $Root "automations\run-full-refresh.ps1"
$QualityScript = Join-Path $Root "automations\check-control-centre-quality.ps1"

function Write-ActivityLog([string]$Status, [string]$Message) {
  $logDir = Split-Path -Parent $LogPath
  if (!(Test-Path -LiteralPath $logDir)) { New-Item -ItemType Directory -Path $logDir -Force | Out-Null }
  $stamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss K"
  Add-Content -LiteralPath $LogPath -Value "`n## $stamp - Daily Prospect Generator - $Status`n$Message`n" -Encoding UTF8
}

function Convert-ToSlug([string]$Value) {
  $slug = $Value.ToLowerInvariant() -replace "[^a-z0-9]+", "-"
  $slug = $slug.Trim("-")
  if ([string]::IsNullOrWhiteSpace($slug)) { return "new-prospect" }
  return $slug
}

function Get-ExistingBusinessKeys {
  $keys = New-Object System.Collections.Generic.HashSet[string]
  if (Test-Path -LiteralPath $BusinessesDir) {
    Get-ChildItem -LiteralPath $BusinessesDir -Directory | ForEach-Object {
      [void]$keys.Add($_.Name.ToLowerInvariant())
      [void]$keys.Add(($_.Name -replace "-", " ").ToLowerInvariant())
    }
  }
  if (Test-Path -LiteralPath $LeadsPath) {
    Import-Csv -LiteralPath $LeadsPath | ForEach-Object {
      if ($_.("Business Name")) {
        [void]$keys.Add(($_.("Business Name")).ToLowerInvariant())
        [void]$keys.Add((Convert-ToSlug $_.("Business Name")).ToLowerInvariant())
      }
    }
  }
  return $keys
}

function Get-CategoryFromTags($Tags) {
  if ($Tags.shop -eq "hairdresser" -or $Tags.barber -eq "yes") { return "Barber" }
  if ($Tags.shop -eq "beauty") { return "Beauty salon" }
  if ($Tags.shop -eq "pet_grooming") { return "Dog groomer" }
  if ($Tags.amenity -eq "cafe") { return "Cafe" }
  if ($Tags.amenity -eq "restaurant") { return "Restaurant" }
  if ($Tags.leisure -eq "fitness_centre" -or $Tags.leisure -eq "sports_centre") { return "Gym / PT" }
  if ($Tags.shop -eq "car_repair" -or $Tags.amenity -eq "vehicle_inspection") { return "Garage / mechanic" }
  if ($Tags.shop -eq "tattoo") { return "Tattoo studio" }
  if ($Tags.amenity -eq "clinic" -or $Tags.healthcare -eq "clinic") { return "Local clinic" }
  if ($Tags.shop -eq "laundry" -or $Tags.craft -eq "cleaner") { return "Cleaner" }
  if ($Tags.craft -match "plumber|electrician|builder|roofer|carpenter|painter") { return "Trade services" }
  return "Local business"
}

function Get-WebsiteFromTags($Tags) {
  $candidates = @($Tags.website, $Tags."contact:website", $Tags.url)
  foreach ($candidate in $candidates) {
    if (![string]::IsNullOrWhiteSpace($candidate)) { return $candidate }
  }
  return "No website"
}

function Get-LocationFromTags($Tags, $Config) {
  $parts = @($Tags."addr:suburb", $Tags."addr:city", $Tags."addr:town", $Tags."addr:village") | Where-Object { ![string]::IsNullOrWhiteSpace($_) }
  if ($parts.Count -gt 0) { return ($parts -join ", ") }
  foreach ($location in $Config.targetLocations) {
    if ($location -match "Brentwood|Shenfield|Essex") { return "$location, Essex" }
  }
  return "Brentwood, Essex"
}

function New-Description([string]$Name, [string]$Category, [string]$Location, [string]$Website) {
  $websiteLine = "no dedicated website was found in the public listing data"
  if ($Website -ne "No website") { $websiteLine = "a website was found, but the business may still benefit from a stronger conversion-focused local website review" }
  return "$Name appears to be a $Category in $Location. Public business/map data suggests $websiteLine. Create a premium modern local website showing services, example pricing, opening hours, trust signals, gallery or visual proof, contact/booking CTA, reviews marked as examples, FAQ and local SEO structure."
}

function Get-PublicProspect($Config, $ExistingKeys) {
  $query = @"
[out:json][timeout:25];
(
  node["shop"="hairdresser"]($($Config.discovery.bbox));
  way["shop"="hairdresser"]($($Config.discovery.bbox));
  node["shop"="beauty"]($($Config.discovery.bbox));
  way["shop"="beauty"]($($Config.discovery.bbox));
  node["shop"="pet_grooming"]($($Config.discovery.bbox));
  way["shop"="pet_grooming"]($($Config.discovery.bbox));
  node["amenity"="cafe"]($($Config.discovery.bbox));
  way["amenity"="cafe"]($($Config.discovery.bbox));
  node["amenity"="restaurant"]($($Config.discovery.bbox));
  way["amenity"="restaurant"]($($Config.discovery.bbox));
  node["leisure"="fitness_centre"]($($Config.discovery.bbox));
  way["leisure"="fitness_centre"]($($Config.discovery.bbox));
  node["shop"="car_repair"]($($Config.discovery.bbox));
  way["shop"="car_repair"]($($Config.discovery.bbox));
  node["shop"="tattoo"]($($Config.discovery.bbox));
  way["shop"="tattoo"]($($Config.discovery.bbox));
  node["amenity"="clinic"]($($Config.discovery.bbox));
  way["amenity"="clinic"]($($Config.discovery.bbox));
  node["craft"]($($Config.discovery.bbox));
  way["craft"]($($Config.discovery.bbox));
);
out center tags;
"@

  $body = "data=$([uri]::EscapeDataString($query))"
  $response = Invoke-RestMethod -Method Post -Uri $Config.discovery.overpassEndpoint -Body $body -ContentType "application/x-www-form-urlencoded" -TimeoutSec ([int]$Config.discovery.timeoutSeconds)
  $prospects = @()

  foreach ($element in $response.elements) {
    if ($null -eq $element.tags -or [string]::IsNullOrWhiteSpace($element.tags.name)) { continue }
    $name = [string]$element.tags.name
    $slug = Convert-ToSlug $name
    if ($ExistingKeys.Contains($name.ToLowerInvariant()) -or $ExistingKeys.Contains($slug.ToLowerInvariant())) { continue }
    $category = Get-CategoryFromTags $element.tags
    if ($category -eq "Local business") { continue }
    $website = Get-WebsiteFromTags $element.tags
    $location = Get-LocationFromTags $element.tags $Config
    $score = 50
    if ($website -eq "No website") { $score = 100 }
    $prospects += [pscustomobject]@{
      BusinessName = $name
      Slug = $slug
      Category = $category
      Location = $location
      Website = $website
      Description = New-Description $name $category $location $website
      DiscoveryScore = $score
      Source = "OpenStreetMap Overpass public data"
    }
  }

  $ordered = $prospects | Sort-Object -Property DiscoveryScore, BusinessName -Descending
  return $ordered | Select-Object -First 1
}

function Update-ActiveLeadsCsv($Prospect) {
  $leadDir = Split-Path -Parent $LeadsPath
  if (!(Test-Path -LiteralPath $leadDir)) { New-Item -ItemType Directory -Path $leadDir -Force | Out-Null }
  $columns = @("Business Name","Category","Location","Website","Email","Phone","Website Status","Score","Priority","Notes","Outreach Status","Next Action")
  if (!(Test-Path -LiteralPath $LeadsPath)) {
    [pscustomobject]@{} | Select-Object $columns | Export-Csv -LiteralPath $LeadsPath -NoTypeInformation
  }
  $existing = Import-Csv -LiteralPath $LeadsPath
  if ($existing | Where-Object { $_."Business Name" -eq $Prospect.BusinessName }) { return }
  $websiteStatus = "Website needs review"
  if ($Prospect.Website -eq "No website") { $websiteStatus = "No dedicated website found" }
  $row = [pscustomobject]@{
    "Business Name" = $Prospect.BusinessName
    "Category" = $Prospect.Category
    "Location" = $Prospect.Location
    "Website" = $Prospect.Website
    "Email" = "Not found"
    "Phone" = "Not found"
    "Website Status" = $websiteStatus
    "Score" = if ($Prospect.Website -eq "No website") { 90 } else { 72 }
    "Priority" = "High"
    "Notes" = "Daily prospect generator: $($Prospect.Description)"
    "Outreach Status" = "Not contacted"
    "Next Action" = "Review generated website, proposal and email draft manually"
  }
  $row | Export-Csv -LiteralPath $LeadsPath -Append -NoTypeInformation
}

try {
  if (!(Test-Path -LiteralPath $ConfigPath)) { throw "Missing config file: $ConfigPath" }
  if (!(Test-Path -LiteralPath $AddProspectScript)) { throw "Missing add prospect script: $AddProspectScript" }

  $config = Get-Content -LiteralPath $ConfigPath -Raw | ConvertFrom-Json
  if ([int]$config.maxProspectsPerRun -ne 1) { throw "Safety stop: maxProspectsPerRun must be 1." }
  if ($config.noEmailsSent -ne $true) { throw "Safety stop: noEmailsSent must be true." }

  $existingKeys = Get-ExistingBusinessKeys
  $prospect = Get-PublicProspect $config $existingKeys
  if ($null -eq $prospect) {
    $msg = "No suitable new prospect found. Nothing was created. No emails were sent."
    Write-ActivityLog "NO PROSPECT" $msg
    Write-Host $msg
    exit 0
  }

  $businessDir = Join-Path $BusinessesDir $prospect.Slug
  if (Test-Path -LiteralPath $businessDir) {
    $msg = "Duplicate safety stop: $($prospect.BusinessName) already has a folder at $businessDir."
    Write-ActivityLog "DUPLICATE" $msg
    Write-Host $msg
    exit 0
  }

  $notes = "Daily generated prospect. Source: $($prospect.Source). Review public details manually before outreach."
  if ($WhatIfRun) {
    $msg = "WHATIF: would create $($prospect.BusinessName) | $($prospect.Category) | $($prospect.Location) | Website: $($prospect.Website)"
    Write-ActivityLog "WHATIF" $msg
    Write-Host $msg
    exit 0
  }

  & powershell.exe -NoProfile -ExecutionPolicy Bypass -File $AddProspectScript -BusinessName $prospect.BusinessName -Website $prospect.Website -Description $prospect.Description -Notes $notes
  if ($LASTEXITCODE -ne 0) { throw "add-prospect-auto.ps1 failed with exit code $LASTEXITCODE" }

  Update-ActiveLeadsCsv $prospect

  if (Test-Path -LiteralPath $RefreshScript) {
    & powershell.exe -NoProfile -ExecutionPolicy Bypass -File $RefreshScript
    if ($LASTEXITCODE -ne 0) { throw "run-full-refresh.ps1 failed with exit code $LASTEXITCODE" }
  }

  if (Test-Path -LiteralPath $QualityScript) {
    & powershell.exe -NoProfile -ExecutionPolicy Bypass -File $QualityScript
    if ($LASTEXITCODE -ne 0) { throw "check-control-centre-quality.ps1 failed with exit code $LASTEXITCODE" }
  }

  $success = "Created one new daily prospect: $($prospect.BusinessName) ($($prospect.Category), $($prospect.Location)). Website: $($prospect.Website). No emails were sent."
  Write-ActivityLog "SUCCESS" $success
  Write-Host $success
  exit 0
}
catch {
  $failure = "Daily prospect generator failed safely: $($_.Exception.Message). No emails were sent."
  Write-ActivityLog "FAILED" $failure
  Write-Error $failure
  exit 1
}
