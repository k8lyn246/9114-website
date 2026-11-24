# Website Image Manager Setup (Git-Based CMS)

This branch (`beta`) moves all website image references into JSON files inside `data/` and adds two compatible Git-based CMS interfaces so authorized team members can swap, upload, and reorder photos visually—without a database or editing HTML/file names.

## How It Works

1. **`data/*.json`** stores the current image paths and metadata:
   - `data/branding.json` — header logo
   - `data/home.json` — hero slideshow and accomplishments carousel
   - `data/about.json` — division photos
   - `data/sponsor.json` — sponsor logos banner
   - `data/team.json` — team member portraits and framing
2. **`script.js`** fetches the relevant JSON file(s) for each page and updates the images automatically (falling back to the existing HTML if opened offline).
3. **Clearance = GitHub repository permissions.** Only GitHub accounts added as collaborators (with Write access) on this repository can save changes.

---

## One-Time Setup

### 1. Push `beta` to your GitHub repository
If you haven't linked this folder to your GitHub repo yet:

```bash
git remote add origin https://github.com/<YOUR_ORG_OR_USER>/<YOUR_REPO>.git
git push -u origin beta
```

### 2. Grant clearance to editors
In GitHub, go to **Settings → Collaborators and teams** and add the GitHub accounts of team members who should be allowed to change images (**Write** role). Remove them there anytime to revoke clearance.

---

## Two Ways Editors Can Update Images

Both editors modify the exact same `data/*.json` files and upload into `images/`.

### Way A: Pages CMS (Easiest — Zero OAuth Setup)
1. Go to [https://app.pagescms.org](https://app.pagescms.org) and click **Sign in with GitHub**.
2. Select this repository and choose the **`beta`** branch (or **`main`** once merged).
3. Pages CMS reads `.pages.yml` automatically and displays **Site Logo & Branding**, **Home Page**, **About Page**, **Sponsor Page**, and **Team Page**.
4. Upload/swap any photo and click **Save**—GitHub Pages republishes automatically in ~30–60 seconds.

### Way B: Built-in `/admin` Page (Sveltia CMS on your own domain)
1. Open `admin/config.yml` and replace `YOUR_GITHUB_OWNER/YOUR_REPO_NAME` with your actual GitHub `owner/repo`.
2. Visit **`https://www.frc9114rotationaries.org/admin/`** (or `http://localhost:8000/admin/` locally).
3. Sign in using either:
   - **Personal Access Token (no server needed):** Create a GitHub Fine-Grained PAT scoped only to **Contents: Read & Write** on this repository and paste it into the Sveltia login prompt.
   - **One-click GitHub OAuth (recommended for multiple editors):** Deploy the free [sveltia-cms-auth](https://github.com/sveltia/sveltia-cms-auth) Cloudflare Worker and uncomment `base_url:` in `admin/config.yml`.
   - **Local testing (Chrome/Edge):** Start a local server (`python3 -m http.server 8000`), open `http://localhost:8000/admin/`, and click **Work with Local Repository**.

---

## When Merging `beta` into `main`

Update `branch: beta` → `branch: main` in `admin/config.yml` so `/admin/` commits to `main`.
