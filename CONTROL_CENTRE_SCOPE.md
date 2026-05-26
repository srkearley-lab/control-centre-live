# Control Centre Scope

Owner: Shane  
Assistant: Rocky 🪨  
Date captured: 2026-05-26

## Core instruction

Continue the existing Control Centre project. Do **not** rebuild OpenClaw, Telegram, or the Control Centre from scratch unless Shane explicitly asks.

The goal is continuity: preserve existing files, project history, hosted/cloud setup, and workspace context.

## Known source locations from Shane

These paths are on the previous/local Windows environment and are not currently mounted inside this VPS container:

- Live workspace: `C:\Users\ai-bot.openclaw\workspace\control-centre`
- Zipped backup: `C:\Users\ai-bot\control-centre.zip`
- Full OpenClaw backup: `C:\Users\ai-bot\Desktop\OpenClaw_Backup_2026-05-24_18-18`

Cloud workspace/project brain:

- CloudShare project: `Control Centre`

## Required persistent behaviour

The system must be able to:

- read from the existing Control Centre
- update it continuously
- save progress there
- preserve project history/context
- continue where it left off
- avoid losing prior work between sessions
- update the existing Control Centre instead of creating a new one
- create local backups before major changes
- notify Shane on Telegram when intervention/approval is needed

## Desired command behaviour

When Shane says things like:

- “Update the control panel”
- “Add a feature”
- “Improve the layout”
- “Create a new client website”
- “Update the existing website”

Rocky should continue from the existing project files and Control Centre setup, not start over.

## Product vision

An AI-driven web agency operating system where Shane can prompt from Telegram and have OpenClaw create, edit, improve, deploy, and maintain premium-quality websites automatically.

Example prompt:

> Create a luxury peptide research website with premium dark styling, Apple-level UX, mobile optimisation, product cards, COA links, bilingual Greek/English support.

Expected behaviour:

- create or update the website
- update existing files instead of rebuilding from scratch
- preserve previous work
- intelligently improve layout/design
- push updates to preview hosting
- notify Shane by Telegram if intervention is needed
- keep Control Centre as the master workspace
- make local backups before major changes

## Allowed stack / cost constraints

Approved/free-first stack:

- ChatGPT Plus — already paid
- GitHub — free
- Cloudflare — free
- Telegram bot — free
- Figma free
- Canva free
- CapCut free

Cost target: as close to **£0 additional cost** as possible.

Do **not** use paid OpenAI API credits, OpenRouter, or any other paid services unless Shane explicitly approves first.

## Model requirements

Model selection should be available from Telegram or OpenClaw.

Preferred model labels requested by Shane:

- GPT 5.5
- GPT 5.4
- GPT 5.4 mini
- GPT 5.3

Need verify actual availability in current OpenClaw config/provider routes before promising these are usable.

## Integration requirements

1. OpenClaw connected properly to the existing workspace
2. ChatGPT/Codex login route used where possible
3. Model switching available
4. Fallback models configured
5. GitHub connected for version control
6. Cloudflare Pages connected for live previews
7. Telegram bot used for notifications, approvals, and model selection
8. Control Centre on CloudShare connected as persistent workspace/project brain
9. Local backups created before major changes
10. Stable environment with Node, Git, and OpenClaw config fixed properly

## End-to-end client workflow

Telegram prompt → OpenClaw on VPS → builds/updates website → stores project in Control Centre → commits to GitHub → deploys to Cloudflare Pages → connects live client domain → adds payment systems → adds booking/calendar functionality → sends Telegram preview/status updates.

## Client website capabilities

Website creation:

- full website build from prompts
- premium modern UI/UX
- mobile responsive design
- HTML / CSS / React / Next.js
- editable projects for future updates

Project management:

- each client gets their own project/workspace
- saved in Control Centre
- persistent project memory/history
- ability to resume/update existing projects

Domains / hosting:

- domain purchase workflow with Shane approval
- DNS setup
- Cloudflare Pages hosting
- SSL/live deployment
- custom client domains connected properly

Payments:

- Stripe integration
- PayPal integration
- payment buttons / checkout pages
- service/product payment flows

Bookings:

- booking calendar integration
- Calendly / booking system setup
- contact forms / enquiry forms
- automated booking workflows where possible

Automation / control:

- Telegram as main command centre
- project status updates
- deployment notifications
- approval prompts
- model selection
- fallback models

## Practical blocker

The Windows file paths above are not accessible from this Linux VPS/container unless Shane uploads/mounts/transfers the backup or provides access credentials/location for CloudShare/GitHub/Cloudflare.

Do not claim transfer is complete until the actual files are visible and verified.
