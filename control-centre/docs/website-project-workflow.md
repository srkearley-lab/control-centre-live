# Website Project Workflow

Use this for Control Centre-managed website projects such as Villa Leveque.

## 1. Add a new website project
Create `control-centre/projects/<project-slug>/` with:

- `project.json` for detected metadata/status
- `website-brief.md` for the build brief
- `workflow.md` for project-specific commands/deployment notes
- `index.html` for the dashboard project page

Do not fake unknown values. Use `Needs configuration`.

## 2. Project metadata
Track:

- project name, type, location, purpose
- local project path
- GitHub repo URL, owner, repo name, current branch
- deployment branch/provider/project/domain/URLs
- install/dev/build commands
- last build status/time
- last commit and last pushed branch
- deployment status and notes

## 3. GitHub connection
From the real website project folder:

```bash
git remote -v
git branch --show-current
git status --short --branch
git log -1 --oneline
```

If no remote exists, add the correct GitHub origin before pushing. Required optional env vars for API-backed checks: `GITHUB_TOKEN`, `GITHUB_OWNER`, `GITHUB_REPO`.

## 4. Cloudflare connection
Store Cloudflare metadata in the project entry only after detection/configuration:

- Cloudflare account ID
- Pages project name
- production domain
- preview URL pattern
- dashboard URL
- deployment branch

Do not write secrets into source code. If API checks are added, document `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` in `.env.example` only.

## 5. Run a build
Detect package manager from lockfile:

- `package-lock.json` → `npm install` / `npm run build`
- `pnpm-lock.yaml` → `pnpm install` / `pnpm build`
- `yarn.lock` → `yarn install` / `yarn build`

Run from the configured local project path.

## 6. Run dev preview
Use the detected dev script, usually:

```bash
npm run dev
```

Record the preview URL in project notes if available.

## 7. Commit and push
After build passes:

```bash
git status --short --branch
git add .
git commit -m "<clear message>"
git push origin <current-branch>
```

## 8. Deployment trigger
Cloudflare Pages usually deploys automatically after GitHub push to the configured production branch. If it does not, check:

- correct GitHub repo connected
- branch matches Cloudflare production branch
- build command/output directory match Cloudflare settings
- environment variables exist in Cloudflare Pages
- DNS/custom domain is active

## 9. If live website does not update
Check, in order:

1. Did local build pass?
2. Was the commit created?
3. Was it pushed to the branch Cloudflare watches?
4. Did Cloudflare deployment run?
5. Did Cloudflare deployment fail? Read logs.
6. Is the custom domain pointed at the right Cloudflare Pages project?
7. Is browser/CDN cache showing an old version?
