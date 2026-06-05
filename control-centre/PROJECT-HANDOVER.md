# Local Business Control Centre - Project Handover

## 1. Project Purpose

This is a local business prospecting control centre for Shane. It finds or adds prospects, creates premium A+ website previews, proposal pages, outreach email drafts, SEO information, and a clean dashboard.

The system is intended to help Shane review local business opportunities quickly, prepare high-quality website concepts, and manually approve any outreach.

## 2. Main Workspace Path

```text
C:\Users\ai-bot\.openclaw\workspace\control-centre
```

## 3. Dashboard Path

```text
C:\Users\ai-bot\.openclaw\workspace\control-centre\dashboard\index.html
```

## 4. Reference Image Path

```text
C:\Users\ai-bot\.openclaw\workspace\control-centre\references\dashboard-reference.jpeg
```

## 5. Current Businesses

- `de-milia-barber-brentwood`
- `shenfield-vehicle-services-shenfield`
- `the-garage-group-essex-brentwood`
- `the-orchard-cafe-brentwood`
- `wagnificent-dog-groomers-brentwood`

## 6. Required Files Per Business

Each business should have:

- `website.html`
- `proposal.html`
- `outreach-email.html`
- `seo-audit.html`
- `business-profile.html`
- `notes.html`
- `status.html`

Older support files may also exist in the folders, but the dashboard should not link to them unless explicitly requested.

## 7. A+ Website Standard

Each `website.html` must be a full premium one-page website preview with:

- Premium hero
- Business-specific headline
- Local positioning
- CTA buttons
- Services
- Pricing
- Why choose us
- Gallery/visual proof
- About
- Reviews/testimonials clearly marked as examples/placeholders
- FAQ
- Contact/booking section
- Footer disclaimer:

```text
Demo concept only - created as an example website proposal.
```

- Local SEO content
- Self-contained HTML/CSS
- At least 25,000 bytes
- No raw/basic/wireframe pages

Do not overwrite A+ websites with simpler or smaller pages.

## 8. Dashboard Design Standard

Dashboard should follow the reference image style:

- Dark SaaS interface
- Left sidebar
- Welcome header
- KPI cards
- Search and filters
- Clean prospect table
- Badges
- Simple action buttons
- Recent activity
- Quick links
- Footer
- No clutter

The dashboard should feel like a premium local prospecting command centre, not a basic HTML table.

## 9. Dashboard Columns

Dashboard should show:

- Business
- Category
- Location
- Website Status
- Website Score
- SEO Score
- Priority
- Reason To Contact
- Contact Found
- Email Draft
- Website Ready
- Status
- Next Action
- Actions

Dashboard should not include:

- Estimated Value
- Image Assets
- Pricing Included
- Demo Quality
- Lots of separate page buttons

Pricing/value/package details should live inside each business `proposal.html`, not on the main dashboard.

## 10. Dashboard Action Buttons

Only show:

- View Website
- Proposal
- Email Draft
- Open Folder

Do not show separate dashboard buttons for services, pricing, about, gallery, reviews, packages, SEO plan, brand system, contact page, notes, or status page.

## 11. Add New Prospect Desired Workflow

When clicking `+ Add New Prospect`:

1. Open `dashboard/add-prospect.html`
2. User enters only:
   - Business Name
   - Website URL or `No website`
   - Business Description / What I'm After
   - Optional Notes
3. It generates a PowerShell command for:

```text
automations/add-prospect-auto.ps1
```

The script should auto-fill:

- Category
- Location
- Email
- Phone
- Website status
- Website score
- SEO score
- Priority
- Reason to contact
- Statuses
- Next action

It should create the full A+ business pack and update the dashboard.

For no-website leads, the description is especially important. It should drive the category, services, local positioning, SEO opportunity, website structure, proposal copy, and outreach angle.

## 12. Automation Scripts Intended

Intended automation scripts:

- `automations/add-prospect-auto.ps1`
- `automations/add-new-business.ps1`
- `automations/rebuild-dashboard.ps1`
- `automations/check-control-centre-quality.ps1`
- `automations/run-full-refresh.ps1`

Current known state: `add-prospect-auto.ps1` exists. The remaining intended scripts may still need to be created or hardened.

## 13. Current Pending Tasks

- Make Add New Prospect button work
- Create/update `add-prospect.html`
- Add Business Description field
- Make sidebar buttons functional:
  - Dashboard
  - Prospects
  - Websites
  - Proposals
  - Outreach
  - Reports
  - Settings
- Ensure SEO is visible but not cluttered
- Ensure future businesses are generated to the same A+ standard
- Run quality check after any update

Note: Some of these may already be partially implemented, but they remain important to verify and harden before relying on the workflow.

## 14. Critical Rules

- Do not send emails automatically
- Do not create new businesses unless explicitly asked
- Do not delete useful files
- Do not overwrite A+ websites with basic versions
- Do not let `website.html` files be under 25,000 bytes
- Do not link dashboard to `.md` files
- Do not add back the Estimated Value column
- Keep dashboard clean and simple
- Keep all files inside the `control-centre` folder

## 15. Next Recommended Action

After handover, continue with:

```text
Make Sidebar Navigation Buttons Work In The Dashboard
```

Then:

```text
Make Add New Prospect Fully Automatic From Business Name, Website and Description
```
## Session Update - 2026-05-23 07:51 GMT+1

### What Changed In This Session

- Reworked the Local Business Control Centre into a cleaner sales/prospecting dashboard direction.
- Simplified the dashboard so each prospect is reviewed through one main website preview, one proposal page, one email draft, and the business folder.
- Rebuilt the dashboard toward the local reference image style: dark SaaS interface, left sidebar, welcome header, KPI cards, filters, prospect table, lower reporting panels, quick links, and footer.
- Added SEO visibility without adding dashboard clutter: SEO score and SEO opportunity summary are represented in the dashboard/proposal/website structure.
- Added or updated the Add New Prospect flow so future prospects can be started from Business Name, Website URL or "No website", Business Description / What I'm After, and Optional Notes.
- Created the handover file and appended this latest progress update for continuity.

### Files Created Or Updated

- `C:\Users\ai-bot\.openclaw\workspace\control-centre\dashboard\index.html`
- `C:\Users\ai-bot\.openclaw\workspace\control-centre\dashboard\add-prospect.html`
- `C:\Users\ai-bot\.openclaw\workspace\control-centre\automations\add-prospect-auto.ps1`
- `C:\Users\ai-bot\.openclaw\workspace\control-centre\README-HOW-TO-ADD-A-BUSINESS.md`
- `C:\Users\ai-bot\.openclaw\workspace\control-centre\START-NEW-SESSION-PROMPT.txt`
- `C:\Users\ai-bot\.openclaw\workspace\control-centre\PROJECT-HANDOVER.md`
- `C:\Users\ai-bot\.openclaw\workspace\control-centre\generate-premium-business-pages.js`
- `C:\Users\ai-bot\.openclaw\workspace\control-centre\enhance-demo-homepages.js`
- `C:\Users\ai-bot\.openclaw\workspace\control-centre\upgrade-a-plus-homepages.js`
- `C:\Users\ai-bot\.openclaw\workspace\control-centre\generate-full-website-packs.js`
- `C:\Users\ai-bot\.openclaw\workspace\control-centre\simplify-sales-dashboard.js`
- `C:\Users\ai-bot\.openclaw\workspace\control-centre\redesign-dark-sales-dashboard.js`
- Business folder pages were created or updated across all five businesses, including `website.html`, `proposal.html`, `outreach-email.html`, `seo-audit.html`, `business-profile.html`, `notes.html`, and `status.html`.

### Current Dashboard Status

- Main dashboard path: `C:\Users\ai-bot\.openclaw\workspace\control-centre\dashboard\index.html`
- The dashboard should remain clean, simple, and sales-focused.
- Dashboard visual direction should continue to follow the reference image at: `C:\Users\ai-bot\.openclaw\workspace\control-centre\references\dashboard-reference.jpeg`
- Dashboard should keep the simplified columns:
  - Business
  - Category
  - Location
  - Website Status
  - Website Score
  - SEO Score
  - Priority
  - Reason To Contact
  - Contact Found
  - Email Draft
  - Website Ready
  - Status
  - Next Action
  - Actions
- Dashboard actions should only be:
  - View Website
  - Proposal
  - Email Draft
  - Open Folder
- Do not add back `Estimated Value`.
- Do not add dashboard buttons for separate pages such as services, pricing, about, gallery, reviews, packages, SEO plan, brand system, notes, or status.

### Current Automation / Script Status

- `automations/add-prospect-auto.ps1` exists and accepts:
  - `BusinessName`
  - `Website`
  - `Description`
  - `Notes`
- `Description` is required.
- The script supports no-website leads using values such as `No website`, `None`, blank, or invalid URLs.
- For no-website leads, the intended behaviour is to infer category, services, target customer, local positioning, suggested pricing, SEO opportunity, website structure, priority, reason to contact, and statuses from the description.
- No emails are sent automatically.
- Existing automation files also include:
  - `automations\new-lead-workflow.ps1`
  - `automations\new-lead-workflow.py`
- Intended future scripts still need to be created or hardened if not present:
  - `automations\add-new-business.ps1`
  - `automations\rebuild-dashboard.ps1`
  - `automations\check-control-centre-quality.ps1`
  - `automations\run-full-refresh.ps1`

### Prompts Folder Status

- `START-NEW-SESSION-PROMPT.txt` exists and should be used at the start of new Claw sessions.
- Future new sessions should start by reading `PROJECT-HANDOVER.md`.
- Important prompts should be saved into: `C:\Users\ai-bot\.openclaw\workspace\control-centre\prompts`
- At the time of this handover update, no saved prompts were found in the `prompts` folder during the local check.
- Before ending future sessions, append latest progress to `PROJECT-HANDOVER.md`.

### Known Issues

- Sidebar buttons were requested as a priority item: Dashboard, Prospects, Websites, Proposals, Outreach, Reports, Settings.
- Current dashboard work includes in-page JavaScript hooks for these sidebar actions, but the next session should verify them manually in the browser and harden anything that does not behave correctly.
- The Add New Prospect flow exists, but the full automation should be tested end to end with both a normal website URL and a `No website` lead.
- Future generated `website.html` files must be checked so they remain A+ quality and at least 25,000 bytes.
- The dashboard is currently a local static HTML app. Any generator or automation that rewrites it must preserve the simplified columns and simplified actions.
- `prompts` folder should be created if important prompts are added later.

### Latest Project Decisions

- Future new sessions should start by reading `PROJECT-HANDOVER.md`.
- `START-NEW-SESSION-PROMPT.txt` exists and should be used at the start of new Claw sessions.
- Reference dashboard image exists at: `C:\Users\ai-bot\.openclaw\workspace\control-centre\references\dashboard-reference.jpeg`
- Dashboard should remain clean and simple.
- Dashboard actions should only be: View Website, Proposal, Email Draft, Open Folder.
- Do not add back Estimated Value.
- Add New Prospect should only ask for:
  - Business Name
  - Website URL or "No website"
  - Business Description / What I'm After
  - Optional Notes
- Sidebar buttons still need to be verified and made fully reliable:
  - Dashboard
  - Prospects
  - Websites
  - Proposals
  - Outreach
  - Reports
  - Settings
- Important prompts should be saved into: `C:\Users\ai-bot\.openclaw\workspace\control-centre\prompts`
- Before ending future sessions, append latest progress to `PROJECT-HANDOVER.md`.

### Critical Rules To Preserve

- Do not send emails automatically.
- Do not create new businesses unless Shane explicitly asks.
- Do not delete useful files.
- Do not overwrite A+ websites with basic versions.
- Do not let `website.html` files be under 25,000 bytes.
- Do not link the dashboard to `.md` files.
- Do not add back the Estimated Value dashboard column.
- Do not clutter the dashboard with separate page buttons.
- Do not claim prices or testimonials are real.
- Keep prices clearly framed as example pricing where unverified.
- Keep testimonials clearly labelled as examples/placeholders.
- Keep everything inside: `C:\Users\ai-bot\.openclaw\workspace\control-centre`
- Do not edit `MEMORY.md`, `DREAMS.md`, `SOUL.md`, `TOOLS.md`, or `AGENTS.md` unless explicitly requested.

### Next Recommended Action

1. Verify and harden the sidebar navigation buttons inside `dashboard\index.html`.
2. Then make Add New Prospect fully automatic from Business Name, Website or No Website, and Business Description.
3. After that, run a full quality check across the dashboard and all five business folders.

## Session Update - 2026-05-23 07:55 GMT+1

### What Changed

- Added a daily automatic prospect generator workflow.
- Created a settings file for daily prospect generation.
- Created install/remove scripts for a Windows Scheduled Task.
- Added lightweight refresh and quality-check scripts required by the daily job.
- Added documentation for installing, testing, logging and removing the automation.

### Files Created Or Updated

- `C:\Users\ai-bot\.openclaw\workspace\control-centre\configs\daily-prospect-settings.json`
- `C:\Users\ai-bot\.openclaw\workspace\control-centre\automations\daily-new-prospect.ps1`
- `C:\Users\ai-bot\.openclaw\workspace\control-centre\automations\install-daily-prospect-task.ps1`
- `C:\Users\ai-bot\.openclaw\workspace\control-centre\automations\remove-daily-prospect-task.ps1`
- `C:\Users\ai-bot\.openclaw\workspace\control-centre\automations\run-full-refresh.ps1`
- `C:\Users\ai-bot\.openclaw\workspace\control-centre\automations\check-control-centre-quality.ps1`
- `C:\Users\ai-bot\.openclaw\workspace\control-centre\README-DAILY-PROSPECT-AUTOMATION.md`
- `C:\Users\ai-bot\.openclaw\workspace\control-centre\PROJECT-HANDOVER.md`

### Current Automation Status

- Daily settings enforce `maxProspectsPerRun: 1`, `avoidDuplicates: true`, `noEmailsSent: true`, and `qualityMinimumWebsiteBytes: 25000`.
- `daily-new-prospect.ps1` reads the config, checks duplicate business folders and active leads, uses public OpenStreetMap/Overpass data, creates at most one prospect through `add-prospect-auto.ps1`, updates `leads\active-leads.csv`, runs refresh/quality checks, logs to `logs\prospecting-activity-log.md`, and never sends emails.
- `install-daily-prospect-task.ps1` creates the scheduled task named `OpenClaw Daily Prospect Generator` for 08:00 daily.
- `remove-daily-prospect-task.ps1` removes that scheduled task.
- The scheduled task was not installed during this session.

### Verification Completed

- New PowerShell scripts parsed successfully.
- `daily-prospect-settings.json` parsed successfully.
- `check-control-centre-quality.ps1` passed.
- `run-full-refresh.ps1` passed.

### Known Issues / Next Check

- The daily discovery step uses public Overpass data and should be tested manually with `-WhatIfRun` before installing the scheduled task.
- If Overpass/public discovery is unavailable, the script logs the failure/no-prospect outcome and stops safely.
- The dashboard must remain clean: no Estimated Value column and no extra page buttons.

### Next Recommended Action

Run a manual dry-run of the daily prospect generator:

```powershell
powershell -ExecutionPolicy Bypass -File "C:\Users\ai-bot\.openclaw\workspace\control-centre\automations\daily-new-prospect.ps1" -WhatIfRun
```

If the dry run finds a good prospect, run the live command manually once before installing the scheduled task.
