# Villa Leveque Project Workflow

This project entry is the Control Centre source of truth for Villa Leveque. Missing detected values are marked **Needs configuration** and must not be guessed.

## Expected end-to-end flow
OpenClaw Control Centre → Villa Leveque selected → website build task runs → local build passes → changes committed → pushed to GitHub → Cloudflare Pages deploys/checks → production URL/status updated.

## Commands once actual project path is configured
- Install: detect package manager, then `npm install`, `pnpm install`, or `yarn install`
- Dev preview: likely `npm run dev`
- Production build: likely `npm run build`
- Git status: `git status --short --branch`
- Commit: `git add . && git commit -m "<message>"`
- Push: `git push origin <current-branch>`
- Deployment check: Cloudflare Pages dashboard/API if credentials exist

## Environment variables
Only add secrets outside source code. If needed, document these in `.env.example` only:
- GITHUB_TOKEN
- GITHUB_OWNER
- GITHUB_REPO
- CLOUDFLARE_API_TOKEN
- CLOUDFLARE_ACCOUNT_ID

## Manual configuration still needed
- Actual Villa Leveque website project folder if it exists outside this workspace
- GitHub remote/owner/repo for the website project
- Cloudflare account/project/domain/production URL/preview URL
- Deployment branch used by Cloudflare Pages
