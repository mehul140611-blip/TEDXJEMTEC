# Putting tedxjemtec.org live

**Setup:** the domain is registered at **Hostinger** (domain only, no hosting plan). The site is hosted
free on **GitHub Pages** from the repo https://github.com/mehul140611-blip/TEDXJEMTEC.

**How it works:** every push to `main` runs `.github/workflows/deploy.yml` (Actions tab). It installs,
lints, builds the static export and publishes `out/` to GitHub Pages, usually within 2–3 minutes. If lint
or the build fails, nothing is published and the live site stays as it was.

---

## One-time setup (≈ 15 minutes + waiting for DNS)

Do the steps in this order.

### 1. Turn on GitHub Pages

1. Open https://github.com/mehul140611-blip/TEDXJEMTEC → **Settings** → **Pages** (left menu, under "Code and automation").
2. **Build and deployment → Source:** choose **GitHub Actions**. (Not "Deploy from a branch".)
3. Go to the **Actions** tab. Open the latest **Deploy to GitHub Pages** run. If it's red (it ran before
   Pages was on), click **Re-run all jobs**. If there's no run, click **Deploy to GitHub Pages** → **Run workflow**.
4. Wait for both jobs (build, deploy) to turn green.

> Don't judge the site by the temporary `mehul140611-blip.github.io/TEDXJEMTEC/` address: the site is built for the
> root of a domain, so it looks broken there. It works once the custom domain is set below.

### 2. Verify the domain with GitHub (prevents anyone else claiming it)

1. GitHub → your profile picture → **Settings** → **Pages** (left menu) → **Add a domain** → `tedxjemtec.org`.
2. GitHub shows a **TXT record**: a name like `_github-pages-challenge-mehul140611-blip` and a long value.
   Keep this tab open.
3. Add that TXT record in Hostinger (step 3.4 below), wait a few minutes, then click **Verify**.

### 3. Point the domain at GitHub (Hostinger DNS)

1. Log in at https://hpanel.hostinger.com → **Domains** → **tedxjemtec.org** → **Manage**.
2. Check **Nameservers** use Hostinger's (e.g. `ns1.dns-parking.com` / `ns2.dns-parking.com`). That's the
   default for domains bought there; leave it.
3. Open **DNS / Nameservers → DNS records**. **Delete** these if they exist:
   - any **A** record with name `@` (Hostinger's parking page),
   - any **CNAME** or **ALIAS** record with name `@` or `www`,
   - any **AAAA** record with name `@`.

   Leave MX/TXT records alone (email, verification).
4. **Add** these records (TTL: leave the default, or 3600):

   | Type | Name | Points to / Value |
   |---|---|---|
   | A | `@` | `185.199.108.153` |
   | A | `@` | `185.199.109.153` |
   | A | `@` | `185.199.110.153` |
   | A | `@` | `185.199.111.153` |
   | CNAME | `www` | `mehul140611-blip.github.io` |
   | TXT | the name from step 2.2, e.g. `_github-pages-challenge-mehul140611-blip` | the value from step 2.2 |

   Optional (IPv6): AAAA `@` → `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`.

### 4. Connect the domain in the repo

1. Repo → **Settings** → **Pages** → **Custom domain** → type `tedxjemtec.org` → **Save**.
2. GitHub runs a **DNS check**. It turns green once the records have spread: often 10–60 minutes,
   up to 24 hours.
3. When the check passes, GitHub requests an HTTPS certificate (another ~15 minutes to an hour). Then tick
   **Enforce HTTPS**. (If the box is greyed out, wait and refresh.)

`www.tedxjemtec.org` automatically redirects to `tedxjemtec.org`.

## Check that it works (5 minutes)

Open each in a private window:

- [ ] `https://tedxjemtec.org` loads with the padlock; the intro plays once
- [ ] `http://tedxjemtec.org` and `https://www.tedxjemtec.org` both end up on `https://tedxjemtec.org`
- [ ] Navbar: Home / Speakers / Schedule / Team scroll on the homepage; About, Sponsors, Contact Us open their pages with the red wipe
- [ ] Refresh while on `/about/` and on `/sponsors/`: the page reloads fine (no 404)
- [ ] `https://tedxjemtec.org/does-not-exist` shows the site's own 404 page
- [ ] Speaker Reveal auto-advances; a schedule name opens that speaker
- [ ] Register opens the registration page in a new tab
- [ ] On a phone (mobile data, not Wi-Fi): menu, photos, video and map all load
- [ ] Share the link in WhatsApp: the preview shows the title and the stage image

## Updating the site

Commit and push to `main` (Claude does this automatically after major changes). The Actions tab shows
the deploy; the live site updates 2–3 minutes later. GitHub Pages caches pages for up to 10 minutes,
so use a private window or Ctrl+Shift+R if you still see the old version.

To roll back: in GitHub, revert the bad commit (or ask Claude to), and the previous version deploys.

## If something goes wrong

| What you see | Fix |
|---|---|
| Actions run is **red** at "configure-pages" / "deploy" | Pages isn't set to **GitHub Actions** (step 1.2). Fix it, then **Re-run all jobs**. |
| Actions run is red at "lint" or "build" | The code has an error; nothing was published. Open the log, or ask Claude to fix it. |
| Hostinger "parked domain" page | The old parking **A** record is still there, or DNS hasn't spread. Re-check step 3.3; wait. |
| GitHub DNS check fails: "improperly configured" | Make sure there are exactly the four `@` A records and the `www` CNAME; no extra A/AAAA/ALIAS for `@`. Wait up to 24 h. |
| **Not secure** / Enforce HTTPS greyed out | Certificate not issued yet. Wait an hour after the DNS check passes; remove and re-add the custom domain if it's stuck for a day. |
| Site loads **unstyled** at `mehul140611-blip.github.io/TEDXJEMTEC/` | Expected (see step 1). Use `https://tedxjemtec.org`. |
| Old version still showing | Wait 10 minutes (Pages cache), then private window / Ctrl+Shift+R. Check the latest Actions run is green. |
| Map or Register link blank | Ad-blocker, or no internet on the phone; they load from Google and the registration site. |

## If you buy Hostinger web hosting later

The site also runs on ordinary Apache hosting. `npm run package` makes `tedxjemtec-site.zip` (the contents of
`out/` plus `public/.htaccess` for HTTPS, www→bare, 404 and caching). In hPanel → File Manager, empty
`public_html` (keep `.well-known`), upload the zip, **Extract** into `public_html` itself, delete the zip, and
purge Performance → Cache Manager. Then point the DNS back to the hosting plan (hPanel does this when you
connect the domain to it) and disable the GitHub Pages custom domain.
