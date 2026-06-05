# How To Add A Business

Use this flow when adding a new website prospect, including businesses with no current website.

1. Open `dashboard/index.html`
2. Click `+ Add New Prospect`
3. Enter `Business Name`
4. Enter `Website URL` or type `No website`
5. Enter `Business Description / What I'm After`
6. Add optional `Notes`
7. Copy the generated PowerShell command
8. Paste it into PowerShell
9. Run the full refresh/dashboard update process
10. Review the dashboard

## Required Description Field

The description is important. It tells the system what the business does and what kind of website Shane wants to offer.

Example:

```text
Local barber in Brentwood. I want to create a premium modern website showing services, pricing, booking CTA, opening hours, gallery, and local SEO.
```

## No-Website Prospects

If the business has no website, type:

```text
No website
```

The automation will use the description to infer:

- Category
- Location
- Services
- Suggested pricing style
- Local SEO opportunity
- Website structure
- Reason to contact
- Website/proposal/email positioning

No emails are sent automatically. Email drafts must be reviewed and approved manually.

## Command Format

```powershell
powershell -ExecutionPolicy Bypass -File "C:\Users\ai-bot\.openclaw\workspace\control-centre\automations\add-prospect-auto.ps1" -BusinessName "[Business Name]" -Website "[Website or No website]" -Description "[Business Description]" -Notes "[Notes]"
```
