# Daily Prospect Automation

This automation creates one new local business prospect per day for the Local Business Control Centre.

It is designed for Brentwood, Shenfield, Essex and nearby local areas. It looks for suitable local businesses such as barbers, beauty salons, dog groomers, cafes, restaurants, gyms, trades, mechanics, garages, tattoo studios, local clinics and cleaners.

## What It Does

- Finds one suitable local business prospect from public OpenStreetMap/Overpass business data.
- Avoids duplicates already in the `businesses` folder or `leads/active-leads.csv`.
- Prefers prospects with no website or a weak discoverable web presence.
- Calls `automations/add-prospect-auto.ps1` to create the prospect pack.
- Updates `leads/active-leads.csv`.
- Updates `dashboard/index.html` through the add-prospect workflow.
- Runs `automations/run-full-refresh.ps1`.
- Runs `automations/check-control-centre-quality.ps1`.
- Appends the result to `logs/prospecting-activity-log.md`.
- Never sends emails automatically.

## Files

- Settings: `configs/daily-prospect-settings.json`
- Daily runner: `automations/daily-new-prospect.ps1`
- Installer: `automations/install-daily-prospect-task.ps1`
- Remover: `automations/remove-daily-prospect-task.ps1`
- Log: `logs/prospecting-activity-log.md`

## Test Manually

From PowerShell:

```powershell
powershell -ExecutionPolicy Bypass -File "C:\Users\ai-bot\.openclaw\workspace\control-centre\automations\daily-new-prospect.ps1"
```

Dry-run mode:

```powershell
powershell -ExecutionPolicy Bypass -File "C:\Users\ai-bot\.openclaw\workspace\control-centre\automations\daily-new-prospect.ps1" -WhatIfRun
```

## Install Daily Scheduled Task

Run PowerShell as the same Windows user that should own the task:

```powershell
powershell -ExecutionPolicy Bypass -File "C:\Users\ai-bot\.openclaw\workspace\control-centre\automations\install-daily-prospect-task.ps1"
```

The task name is:

```text
OpenClaw Daily Prospect Generator
```

It runs daily at 18:00.

## Check Logs

Open:

```text
C:\Users\ai-bot\.openclaw\workspace\control-centre\logs\prospecting-activity-log.md
```

The log records success, no-prospect outcomes, duplicate stops and failures.

## Remove Scheduled Task

```powershell
powershell -ExecutionPolicy Bypass -File "C:\Users\ai-bot\.openclaw\workspace\control-centre\automations\remove-daily-prospect-task.ps1"
```

## Safety Rules

- No emails are sent automatically.
- No more than one prospect is created per daily run.
- Existing business folders are not overwritten.
- Duplicate business names and slugs are skipped.
- If prospect discovery fails, the script logs the failure and stops safely.
- If quality checks fail, the script reports the failure rather than pretending the run succeeded.
- `website.html` files must remain at least 25,000 bytes.
- The dashboard must stay simple.
- Dashboard actions must remain only: View Website, Proposal, Email Draft, Open Folder.
- Do not add the Estimated Value column back to the dashboard.
