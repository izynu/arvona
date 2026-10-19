# Deploying Arvona

This guide takes you from an empty GitHub repository to a live Arvona site on GitHub Pages, working entirely from VS Code. It assumes no prior Git or GitHub Pages experience. Read it top to bottom the first time; after that, only the "Updating the site later" section matters for everyday work.

Arvona is a single-page app with hash routing (`#/`, `#/category/{slug}`, `#/index`, `#/saved`, `#/about`, `#/privacy`, `#/terms`). Because every route lives after the `#`, GitHub Pages never needs server configuration and refreshing a page never produces a 404. The build is a fully static export into `./out`, and the report-a-link dialog falls back to prefilled GitHub issues automatically, so no backend runs anywhere.

The live project-pages URL is `https://izynu.github.io/arvona/`.

## What you need

- VS Code: download from `code.visualstudio.com`.
- Git: download from `git-scm.com`. On Windows, the default installer options are fine; this installs Git Credential Manager, which handles GitHub sign-in for HTTPS clones.
- One of the two runtimes below. The project is developed with Bun and ships a `bun.lock` file, but npm works identically.
  - Bun, from `bun.sh`, or
  - Node.js 20 LTS, from `nodejs.org`.
- A GitHub account (for the repository owner `izynu`, the account `github.com/izynu`).

All commands below run in the VS Code integrated terminal. Open it with `Terminal > New Terminal`.

## Step 1: Create the GitHub repository

1. Open `github.com/new` in your browser and sign in as `izynu`.
2. Under **Repository template**, leave **No template** selected.
3. Under **Owner**, select `izynu`.
4. Under **Repository name**, enter `arvona`.
5. Keep the repository **Public** (required for GitHub Pages on a free account).
6. Do **not** check **Add a README file**, and do not add `.gitignore` or a license. The project already ships its own `LICENSE` and metadata; initializing would create a conflicting first commit.
7. Click **Create repository**.
8. Leave the resulting page open; it shows the remote URL you need in the next step.

## Step 2: Clone the repository and open it in VS Code

Pick one of the two options. SSH is better long term but requires a key set up with GitHub; HTTPS works everywhere with no setup.

Option A, SSH (requires SSH keys configured with GitHub):

```bash
git clone git@github.com:izynu/arvona.git
```

Option B, HTTPS (prompts for a GitHub sign-in through the browser the first time):

```bash
git clone https://github.com/izynu/arvona.git
```

Then open the folder in VS Code:

```bash
cd arvona
code .
```

Or, from inside VS Code, use `File > Open Folder...` and pick the `arvona` folder. If VS Code asks "Do you trust the authors of the files in this folder?", click **Yes, I trust the authors**.

## Step 3: Install dependencies

In the VS Code terminal (`Terminal > New Terminal`), run one of these. Either is fine; both read the same dependency list. The repository's lockfile is `bun.lock`, so continuous-integration uses Bun, but npm installs the same packages and works for local development.

```bash
bun install
```

or

```bash
npm install
```

This creates a `node_modules` folder. If you used npm, it also creates a `package-lock.json`; that file is local to your machine and must not be committed.

## Step 4: Run the dev server

```bash
bun run dev
```

or

```bash
npm run dev
```

The first start takes a moment while Next.js compiles. When the terminal shows a "Ready" line, open `http://localhost:3000` in your browser.

What you should see: the Arvona home page on a pure black background, with a hero search field, a stats row showing the current catalog totals, 14 section cards, verified picks, and a footer repeating the same stats. Try `Ctrl+K` (or `/`) to open the search palette.

To stop the server, click inside the terminal and press `Ctrl+C`. Start it again later with the same command.

## Step 5: Edit content (optional before first deploy)

The catalog lives in four data files under `src/data`:

- `src/data/resources-tools.ts`
- `src/data/resources-learning.ts`
- `src/data/resources-media.ts`
- `src/data/resources-creation.ts`

Category definitions (names, icons, and the exact list of allowed subcategories) live in `src/data/categories.ts`. Rules for adding or editing resources are documented in `CONTRIBUTING.md`.

After any catalog change, run the validator:

```bash
bun run validate
```

or

```bash
npm run validate
```

Validation must pass before any deploy; the deploy workflow runs it again in continuous integration and fails the build on bad data. If you changed catalog data, also refresh the public JSON export with `bun run catalog` and commit the updated `public/data/catalog.json`.

## Step 6: Commit and push

If Git complains about a missing identity on first use, set it once:

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

Then commit and push:

```bash
git add .
git commit -m "Describe what you changed"
git push
```

The first `git push` on a fresh HTTPS clone may open a browser window to authorize GitHub.

If you copied this project folder from somewhere instead of cloning it, it has no remote yet. Add the remote and push for the first time:

```bash
git remote add origin git@github.com:izynu/arvona.git
git branch -M main
git push -u origin main
```

Use the HTTPS URL (`https://github.com/izynu/arvona.git`) instead if you chose the HTTPS clone option in Step 2.

## Step 7: Turn on GitHub Pages

This is a one-time repository setting.

1. On `github.com`, open the `izynu/arvona` repository.
2. Click **Settings** (top tab bar of the repository).
3. In the left sidebar, click **Pages** (under "Code and automation").
4. Under **Build and deployment**, set **Source** to **GitHub Actions**.

Do not pick "Deploy from a branch". The deploy workflow in `.github/workflows/deploy-pages.yml` handles everything from here.

## Step 8: Watch the deploy run

1. Push to `main` (Step 6) or open the **Actions** tab and click **Deploy to GitHub Pages**, then **Run workflow** for a manual run.
2. Click the in-progress run to watch the build and deploy jobs. Each step logs its output.
3. A typical run takes 1 to 3 minutes: dependency install, catalog validation, static build, then upload and deploy.
4. When the run shows a green check, the site is live.

If the run fails, see Troubleshooting below.

## Step 9: Open the live site

Open `https://izynu.github.io/arvona/` and check:

- The home page loads fully styled (black background, section cards, footer stats).
- Styles and scripts resolve. If the page is blank, see the base path note in Troubleshooting.
- Click into a section such as `#/category/privacy-security`, then refresh the page on that URL. Hash routing means the page reloads correctly, never a 404.
- `Ctrl+K` opens the search palette, and starring a resource adds it to `#/saved`.
- `#/about`, `#/privacy`, and `#/terms` all load.
- The favicon (the black atlas mark from `src/app/icon.svg`) appears in the browser tab.

## Using a custom domain (optional)

The site works on `izynu.github.io/arvona` with no extra work. A custom domain serves it from your own address at the site root, which requires three changes: DNS records, a `CNAME` file, and one workflow line.

### 1. Buy a domain

Buy a domain from any registrar. The rest of this section uses `arvona.example.com` as a stand-in for the domain you bought; replace it with your real domain everywhere.

### 2. Add DNS records at your registrar

In your registrar's DNS settings, create these records:

| Record type | Name | Value |
| --- | --- | --- |
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `izynu.github.io` |

The four A records point the bare domain (`arvona.example.com`) at GitHub Pages. The CNAME points `www.arvona.example.com` at the same site; GitHub redirects it to your canonical domain. DNS changes can take up to 24 hours to propagate, though they usually apply within minutes.

### 3. Create the CNAME file

Create a file named `CNAME` inside the `public` folder of the project. It must contain exactly one line: your bare domain, no `https://`, no trailing slash.

```
arvona.example.com
```

Commit and push this file. It is what keeps the custom domain setting alive across deploys.

### 4. Set the domain in GitHub

1. In the repository, go to `Settings > Pages`.
2. Under **Custom domain**, enter `arvona.example.com` and click **Save**.
3. Wait for the DNS check to pass. GitHub shows the check result next to the field.
4. Once the check passes, tick **Enforce HTTPS**. If the checkbox is grayed out, the certificate is still being provisioned; see Troubleshooting.

### 5. Change the base path in the workflow

Because the custom domain serves the site at the root, the build must stop prefixing URLs with `/arvona`. Edit `.github/workflows/deploy-pages.yml` and find this line in the "Build static export" step:

```yaml
          NEXT_PUBLIC_BASE_PATH: "/${{ github.event.repository.name }}"
```

Change it to:

```yaml
          NEXT_PUBLIC_BASE_PATH: ""
```

Then either push a commit (any push to `main` redeploys) or trigger a manual run: `Actions > Deploy to GitHub Pages > Run workflow`.

Optionally, also set `customDomain` in `src/data/site.ts` to your domain so the site configuration matches.

## Updating the site later

Every content or code change follows the same loop:

1. Edit the files (catalog data, copy, components).
2. Run the validator:

   ```bash
   bun run validate
   ```

3. Check locally with `bun run dev`, then stop it with `Ctrl+C`.
4. Commit and push:

   ```bash
   git add .
   git commit -m "What changed and why"
   git push
   ```

5. GitHub Pages redeploys automatically. Watch progress in the `Actions` tab; expect 1 to 3 minutes.

You never touch Pages settings again after Step 7.

## Troubleshooting

**Blank page or broken asset paths after deploy.** The base path does not match the URL the site is served from. Project pages (`izynu.github.io/arvona`) require `NEXT_PUBLIC_BASE_PATH` set to `/${{ github.event.repository.name }}` in the workflow; a custom domain at the root requires it empty. Fix the env line in `.github/workflows/deploy-pages.yml` (exact lines are in the custom domain section) and redeploy.

**Actions run fails.** Open the failed run in the `Actions` tab and click the failed step to read its log; the last lines name the problem. The most common failure is catalog validation rejecting a data edit. Run the validator locally first:

```bash
bun run validate
```

Fix every reported error, then push again. A run can also fail transiently during dependency install; re-running it from `Actions > Deploy to GitHub Pages > Run workflow` usually resolves that.

**Styles look unstyled or partially styled.** Your browser cached assets from the previous deploy. Hard refresh with `Ctrl+Shift+R` (Windows and Linux) or `Cmd+Shift+R` (macOS). If it persists for more than a few minutes after a green deploy, the GitHub Pages content delivery network may still be distributing the new files; wait and try again.

**Custom domain HTTPS is stuck on "certificate pending" or Enforce HTTPS is disabled.** GitHub provisions a certificate after the DNS check passes; this usually takes minutes but can take up to 24 hours. Confirm the DNS records match the table above, then wait. Do not turn enforcement off and on or remove and re-add the domain; that restarts provisioning and delays it further.

## Pre-launch checklist

- [ ] Favicon exists at `src/app/icon.svg` and shows in the browser tab on the live site.
- [ ] Privacy policy loads at `#/privacy`.
- [ ] Terms load at `#/terms`.
- [ ] The MIT `LICENSE` file is present at the repository root; the catalog data is licensed CC0 1.0.
- [ ] Both maintainers (Zynu, `@izynu`, and Shraddha, `@xhraddha`) are credited on the About page and in `package.json`.
- [ ] No third-party badges and no "Made with AI" style tags appear anywhere in the interface.
- [ ] Custom domain is optional and documented above; if unused, the default `https://izynu.github.io/arvona/` URL is the canonical address.
- [ ] `bun run validate` passes with 0 errors and 0 warnings.
- [ ] First deploy is green, and hash routes were refreshed and spot-checked on the live URL (Step 9).
