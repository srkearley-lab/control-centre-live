$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$ScriptPath = Join-Path $Root "automations\daily-new-prospect.ps1"
$TaskName = "OpenClaw Daily Prospect Generator"

if (!(Test-Path -LiteralPath $ScriptPath)) {
  throw "Cannot install scheduled task because daily-new-prospect.ps1 was not found at $ScriptPath"
}

$action = New-ScheduledTaskAction `
  -Execute "powershell.exe" `
  -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$ScriptPath`"" `
  -WorkingDirectory $Root

$trigger = New-ScheduledTaskTrigger -Daily -At 18:00
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries

Register-ScheduledTask `
  -TaskName $TaskName `
  -Action $action `
  -Trigger $trigger `
  -Settings $settings `
  -Description "Creates one local business prospect pack per day for the OpenClaw Local Business Control Centre. Emails are never sent automatically." `
  -Force | Out-Null

Write-Host "Installed scheduled task: $TaskName"
Write-Host "Schedule: daily at 18:00"
Write-Host "Command: powershell.exe -NoProfile -ExecutionPolicy Bypass -File `"$ScriptPath`""
Write-Host "Working directory: $Root"
Write-Host "No emails are sent automatically."
