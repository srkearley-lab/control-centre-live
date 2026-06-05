$ErrorActionPreference = "Stop"

$TaskName = "OpenClaw Daily Prospect Generator"
$task = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue

if ($null -eq $task) {
  Write-Host "Scheduled task was not found: $TaskName"
  exit 0
}

Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
Write-Host "Removed scheduled task: $TaskName"
