# Putting tedxjemtec.org live on Hostinger

The site is plain static files (HTML, CSS, JS, images). Going live = putting the **contents** of the
`out/` folder into the domain's `public_html` folder. No Node.js, database or app setup is needed.

`npm run package` builds the site and makes **`tedxjemtec-site.zip`** (in this folder) containing
exactly what goes into `public_html`, including the `.htaccess` file with HTTPS, 404 and caching rules.

---

## Before you start (one time)

1. **Log in** at https://hpanel.hostinger.com with the account that has shared access.
2. **Check your permissions.** Go to **Websites** and open **tedxjemtec.org** → **Dashboard**. You need
   **File Manager** and **Security → SSL** in the left menu. If either is missing, ask the account
   owner to give your shared access the *File Manager* and *SSL* permissions.
3. **Check the domain points to Hostinger.** In hPanel → **Domains** → tedxjemtec.org → **DNS / Nameservers**:
   - If the domain was bought on Hostinger, this is already done.
   - If it was bought elsewhere (GoDaddy, Namecheap, …), set its nameservers at that registrar to the two
     Hostinger nameservers shown in hPanel (e.g. `ns1.dns-parking.com`, `ns2.dns-parking.com`). This can take
     up to 24 hours to spread; usually 1–2 hours.
4. **Turn on SSL.** hPanel → **Security → SSL** → tedxjemtec.org → install the free SSL if it isn't
   "Active". (It can only be issued once the domain points to Hostinger.) Wait until it shows **Active**.

## Upload the site

1. On this computer, run `npm run package` in the `web` folder (or use the zip Claude made).
   You get `web/tedxjemtec-site.zip` (≈ 3–4 MB).
2. hPanel → tedxjemtec.org → **Files → File Manager** → open **`public_html`**.
3. **Empty `public_html`.** Select everything inside it (Hostinger puts a `default.php` there; an old
   WordPress install would show `wp-admin`, `wp-content`, …) → **Delete**.
   - If WordPress was installed through hPanel, remove it under **Websites → WordPress → Uninstall** instead.
   - Keep `.well-known` if you see it (SSL uses it).
4. Click **Upload** (top-right ↑ icon) → **File** → choose `tedxjemtec-site.zip` → wait for 100%.
5. **Right-click the zip → Extract** → when asked for a folder, leave it as `public_html` itself
   (clear any name like `tedxjemtec-site`) → **Extract**.
6. **Delete the zip** from `public_html`.
7. **Check the layout.** `public_html` must now directly contain:
   `index.html`, `404.html`, `.htaccess`, `_next/`, `about/`, `contact/`, `sponsors/`, `speakers/`,
   `team/`, `images/`, `media/`, `brand/` …
   - If instead you see a single folder (e.g. `public_html/tedxjemtec-site/index.html`), open it,
     select all → **Move** to `public_html`, then delete the empty folder.
   - Don't see `.htaccess`? File Manager hides dotfiles: **Settings (gear) → Show hidden files**.
8. **Clear Hostinger's cache.** hPanel → tedxjemtec.org → **Performance → Cache Manager** (and **CDN** if
   enabled) → **Purge all**. Then open the site in a private/incognito window.

## Check that it works (5 minutes)

Open each in a private window:

- [ ] `https://tedxjemtec.org` loads with the padlock; the intro plays once
- [ ] `http://tedxjemtec.org` and `https://www.tedxjemtec.org` both redirect to `https://tedxjemtec.org`
- [ ] Navbar: Home / Speakers / Schedule / Team scroll on the homepage; About, Sponsors, Contact Us open their pages with the red wipe
- [ ] Refresh while on `/about/` and on `/sponsors/` → the page reloads fine (no 404)
- [ ] `https://tedxjemtec.org/does-not-exist` shows the site's own 404 page
- [ ] Speaker Reveal auto-advances; a schedule name opens that speaker
- [ ] Register opens the registration page in a new tab
- [ ] On a phone (mobile data, not Wi-Fi): menu, photos, video and map all load
- [ ] Share the link in WhatsApp: the preview shows the title and the stage image

## Updating the site later

1. Make the change (or ask Claude) → `npm run package`.
2. File Manager → `public_html` → delete everything **except** `.well-known` → upload the new zip →
   Extract into `public_html` → delete the zip.
   (Deleting first matters: old `_next/` files would otherwise pile up.)
3. **Cache Manager → Purge all**. Check in a private window.

## If something goes wrong

| What you see | Fix |
|---|---|
| Hostinger's "parked domain" / default page | Old files still in `public_html` (`default.php`), or DNS not pointing to Hostinger yet. Delete them; check DNS; purge cache. |
| **403 Forbidden** | Files were extracted into a subfolder; `public_html` has no `index.html`. Move them up (step 7). |
| Page loads but looks **unstyled** / no animations | `_next/` folder missing or in the wrong place. Re-upload; it must be `public_html/_next/`. |
| `/about/` works from the menu but **404 on refresh** | `about/index.html` missing. Re-extract the full zip. |
| **Not secure** warning / no padlock | SSL not active yet. Security → SSL → install; wait; purge cache. |
| Redirect loop (`ERR_TOO_MANY_REDIRECTS`) | Rare, with Cloudflare in front. Set Cloudflare SSL mode to **Full**, or delete the "Always HTTPS" block at the top of `.htaccess`. |
| Old version still showing | Purge Cache Manager/CDN; hard-refresh (Ctrl+Shift+R) or use a private window. |
| Map or Register link blank | Ad-blocker or no internet on the phone; they load from Google / the registration site. |

## Optional: automatic deploys from GitHub

Instead of uploading zips, a GitHub Action can build the site and upload `out/` over FTP on every push
to `main`. It needs Hostinger's FTP details (hPanel → **Files → FTP Accounts**) saved as GitHub secrets
(**Repo → Settings → Secrets and variables → Actions**: `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`).
Enter those yourself; never paste the password into a chat. Ask Claude to add the workflow file once
the secrets exist.
