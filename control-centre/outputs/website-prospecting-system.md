# Website Prospecting System

## 1. Purpose

This project is designed to help Shane find local businesses with poor, outdated, or missing websites, assess them as potential leads, create a structured lead list, draft outreach messages, and eventually generate simple demo websites to show what could be improved.

The goal is to turn OpenClaw into a practical local business prospecting assistant.

## 2. Folder Structure

Use the following control centre folders:

- `/leads` — lead lists, business names, contact details, website status, notes.
- `/research` — market research, competitor analysis, business findings.
- `/templates` — outreach emails, Telegram messages, follow-up scripts.
- `/websites` — generated demo websites and website concepts.
- `/outputs` — finished briefs, summaries, reports, and export-ready files.
- `/automations` — scripts for repeatable lead checks, website scoring, or data formatting.
- `/logs` — task history and progress notes.

## 3. Input Data Needed

For each business, collect:

- Business name
- Business type/category
- Location
- Website URL, if available
- Email address, if available
- Phone number, if available
- Social media links, if available
- Notes on current website quality
- Whether the site is missing, outdated, slow, not mobile-friendly, or poorly designed
- Potential value of a new website
- Outreach status

## 4. Lead Scoring Criteria

Score each lead from 1 to 10 using:

- No website: +3
- Website looks outdated: +2
- Poor mobile experience: +2
- No clear call to action: +1
- Poor branding/design: +1
- Business likely depends on local search: +1
- Clear contact details available: +1
- Strong visual/demo opportunity: +1

Priority bands:

- 8–10: High priority
- 5–7: Medium priority
- 1–4: Low priority

## 5. Outreach Workflow

1. Identify business.
2. Check whether they have a website.
3. Review the website quality.
4. Add them to the lead list.
5. Draft a short, friendly outreach message.
6. If useful, create a simple demo website concept.
7. Track whether contacted, replied, interested, not interested, or follow-up needed.

Outreach should be short, friendly, UK tone, and not pushy.

## 6. Demo Website Workflow

For strong leads:

1. Create a simple one-page demo concept.
2. Include hero section, services, contact section, and clear call to action.
3. Use the business type and local area to make the demo feel relevant.
4. Save website demos under `/websites`.
5. Save notes and screenshots under `/outputs` where needed.

## 7. First 5 Tasks to Build It

1. Create a lead tracker template in `/leads`.
2. Create a local website outreach template in `/templates`.
3. Create a website scoring checklist in `/templates`.
4. Create a first sample business demo in `/websites`.
5. Create an automation brief for a future lead-finder script in `/automations`.

## 8. Safety and Approval Rules

- Do not send emails automatically without Shane approving them first.
- Do not scrape aggressively or violate website terms.
- Do not collect unnecessary personal data.
- Do not spam businesses.
- Keep outreach professional and respectful.
- Always show Shane the lead list and message before sending anything.
- Save all generated work in the correct folder.
