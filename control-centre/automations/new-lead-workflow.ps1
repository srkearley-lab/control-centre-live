param(
    [Parameter(Mandatory=$true)][string]$Business,
    [Parameter(Mandatory=$true)][string]$Category,
    [Parameter(Mandatory=$true)][string]$Location,
    [string]$Website = "None",
    [string]$Email = "",
    [string]$Phone = "",
    [Parameter(Mandatory=$true)][string]$Status,
    [Parameter(Mandatory=$true)][int]$Score,
    [string]$Notes = ""
)

$root = "C:\Users\ai-bot\.openclaw\workspace\control-centre"
$leadsFile = Join-Path $root "leads\active-leads.csv"
$outputsDir = Join-Path $root "outputs"
$logFile = Join-Path $root "logs\prospecting-activity-log.md"

New-Item -ItemType Directory -Path (Split-Path $leadsFile) -Force | Out-Null
New-Item -ItemType Directory -Path $outputsDir -Force | Out-Null
New-Item -ItemType Directory -Path (Split-Path $logFile) -Force | Out-Null

if (!(Test-Path $leadsFile) -or ((Get-Item $leadsFile).Length -eq 0)) {
    "Business Name,Category,Location,Website,Email,Phone,Website Status,Score,Priority,Notes,Outreach Status,Next Action" | Set-Content $leadsFile
}

if (!(Test-Path $logFile)) {
    "# Prospecting Activity Log`n`n## Log Entries`n" | Set-Content $logFile
}

if ($Score -ge 8) {
    $priority = "High"
} elseif ($Score -ge 5) {
    $priority = "Medium"
} else {
    $priority = "Low"
}

$row = '"' + ($Business,$Category,$Location,$Website,$Email,$Phone,$Status,$Score,$priority,$Notes,"Drafted","Review outreach draft" -join '","') + '"'
Add-Content $leadsFile $row

$safeName = ($Business.ToLower() -replace '[^a-z0-9]+','-').Trim('-')
if ([string]::IsNullOrWhiteSpace($safeName)) { $safeName = "lead" }

$outputFile = Join-Path $outputsDir "$safeName-audit-and-outreach.md"

@"
# Website Prospecting Audit: $Business

## Business Details

- Business name: $Business
- Category: $Category
- Location: $Location
- Website: $Website
- Email: $Email
- Phone: $Phone

## Website Assessment

- Website status: $Status
- Score: $Score
- Priority: $priority
- Notes: $Notes

## Recommended Improvement

Create a clean, modern, mobile-friendly one-page website concept that clearly explains what the business does, where it operates, and how customers can contact them.

## Demo Website Brief

Suggested sections:

1. Hero section with business name, location, and clear call to action
2. Services section
3. Why choose us section
4. Reviews/testimonials placeholder
5. Contact section
6. Mobile-first layout

## Draft Outreach Email

Subject: Quick idea for your website

Hi $Business,

I came across your business while looking at local companies in $Location and noticed there might be a few quick ways to improve your online presence.

I help small businesses create clean, modern websites that make it easier for customers to understand what you offer, get in touch, and take action.

I've put together a simple idea of what an improved website could look like for your business. No pressure at all - just thought it might be useful to show you.

Would you be open to me sending over a quick example?

Thanks,  
Shane

If this is not relevant, just reply "no thanks" and I will not contact you again.

## Approval Status

- Outreach status: Drafted
- Next action: Shane to review before sending
"@ | Set-Content $outputFile

$now = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
Add-Content $logFile "`n### $now"
Add-Content $logFile "- Added lead: $Business"
Add-Content $logFile "- Priority: $priority"
Add-Content $logFile "- Output created: outputs\$safeName-audit-and-outreach.md"

Write-Host "Done."
Write-Host "Lead added to: $leadsFile"
Write-Host "Audit/outreach created: $outputFile"
Write-Host "Priority: $priority"
