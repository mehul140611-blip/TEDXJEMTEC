@AGENTS.md

# TEDxJEMTEC website — notes for coding agents

Next.js 16 (App Router, JavaScript), Tailwind v4, GSAP (+ ScrollTrigger, ScrollToPlugin, @gsap/react).
Static export only (`output: "export"`): no API routes, server actions or middleware.

## Commands
- `npm run dev` / `npm run build` (both use `--webpack`; Turbopack fails on next/font/google on Windows)
- `npm run build` also runs `postbuild` → `scripts/fix-segment-prefetch.mjs` (Next 16.3 export writes
  segment prefetch files under nested folders; the client requests dot-joined names). Keep it.
- `npm run lint` must pass with zero warnings.
- **Deploy = push to `main`.** `.github/workflows/deploy.yml` runs `npm ci` → lint → build on Ubuntu and
  publishes `out/` to GitHub Pages (custom domain tedxjemtec.org; DNS at Hostinger, domain only). So every
  push goes live in ~3 minutes; a failing lint/build publishes nothing. Setup + troubleshooting: `DEPLOY.md`.
- Site is served at the domain root: no `basePath`. It looks broken at `<user>.github.io/TEDx/`; that's expected.
- `npm run package` = build + `scripts/zip-out.mjs` → `tedxjemtec-site.zip` (gitignored), only for a future
  Apache/Hostinger hosting plan. `public/.htaccess` is for that case (the Pages workflow deletes it from `out/`).

## Git workflow (the user's standing instruction)
- Repo: `web/` · branch `main` · remote `origin` = https://github.com/mehul140611-blip/TEDXJEMTEC.git.
- Commit author is repo-local: Mehul Mendiratta <mehul.140611@gmail.com>. Never change it or use another email.
- **After every major change** (a feature, a content update, a layout fix the user asked for), without
  asking: `npm run lint` + `npm run build` must pass → commit with a clear message → `git push`.
  Group small follow-up tweaks into one commit. Never commit failing lint/build, `out/`, the zip or secrets;
  never force-push or rewrite pushed history.

## Structure: homepage scroll + three separate pages
- `/` is a scrolling page (`src/app/page.jsx`). Sections, in order, each a `SectionShell`
  (`<section id>` with tabIndex -1; `divider` adds a thin rule + red marker, `label` only where it
  doesn't repeat the heading): `#home` (Hero, Theme, Event details + venue image/map, What is TEDx,
  Register/ticket) · `#speakers` · `#schedule` · `#team`.
  "What is TEDx?" must stay on `/` (TEDx rule).
- Separate pages: `/about` (`AboutSection`), `/contact` ("Contact Us", `ContactSection`), `/sponsors`
  (`SponsorsSection`; TEDx rule: no sponsor names/logos anywhere else). Plus the 404. Their content components live in
  `src/components/sections/`; the route files only add metadata.
- Heading levels: one `<h1>` per page (Hero on `/`; `SectionHeader as="h1" page` on /about, /contact).
  Homepage section titles are `<h2>`.
- No section numbering anywhere (no "02 —", "2.1", counters). Numbers that are content stay: the
  speaker counter "01 / 11", schedule times, dates, phone, address.
- No hard-coded counts: the speaker total, wrap and schedule spacing all come from array lengths.

## Navigation
- Nav items are in `src/content/site.js` (`nav`), order: Home, About, Speakers, Schedule, Team,
  Sponsors, Contact Us. In-page items have `href: "/#speakers"` + `section: "speakers"`; page items
  (`/about/`, `/sponsors/`, `/contact/`) have no `section`.
- `SECTION_IDS` / `PAGE_PATHS` in `lib/sections.js` list the homepage sections and separate pages.
- All internal links go through `components/ui/SectionLink.jsx`:
  on `/` → `scrollToSection(id)` (`lib/sections.js`: GSAP ScrollToPlugin, 1s power3.inOut, offset =
  navbar height, `autoKill` so the wheel is never hijacked; instant under reduced motion; then
  `history.replaceState` hash + focus the section). Off `/` → `TransitionLink` (red wipe).
- The red page wipe (`layout/PageTransition.jsx`) runs ONLY to/from the separate pages. Arriving on
  `/` with a hash lands on that section under the cover (measured with offsetTop).
- On separate pages only the current page's nav item is highlighted (`aria-current="page"`).
- Scroll-spy: `useActiveSection` in `lib/nav.js` (IntersectionObserver line at 40% of the viewport)
  highlights the nav item and mirrors the hash (replaceState only; skipped while `scrollState.busy`
  or during the intro).
- Deep links (`/#speakers`): `layout/HomeLanding.jsx` lands there after the intro + fonts.
- Never use CSS scroll-snap or wheel hijacking on the page; `html` has `scroll-padding-top: var(--nav-h)`.

## Motion and performance rules
- GSAP is the only animation library. Every animation in `useGSAP`/a gsap.context, ScrollTriggers
  scoped to their section. `layout/ScrollRefresh.jsx` refreshes ScrollTrigger after fonts + load and
  (debounced) after lazy images/the map iframe load, and pauses CSS loops inside `[data-loops]`
  areas that are off-screen. Canvas particles pause off-screen (IntersectionObserver).
- `prefers-reduced-motion`: no intro, wipes, parallax, particles, tilt, tiles or scrub; jumps instant.
- Speaker Reveal's first tile-assemble runs when `#speakers` scrolls into view; its photos lazy-load.
- Speaker Reveal auto-advance (`sections/useSpeakerAutoplay.js`): one paused GSAP tween of
  `SPEAKER_AUTOPLAY_MS` (speakers.js), counted from the end of each reveal; pause reasons = user button,
  transition running, keyboard focus (`:focus-visible` only), < 50% in view, tab hidden. Hover does
  NOT pause it (the team asked for a steady 6s advance). Reduced motion starts paused.
  Keep the pause/play button (WCAG 2.2.2). aria-live is "off" during auto-advance, "polite" otherwise.
- `ui/VenueMap.jsx` is the venue block (auditorium photo left, Google Map right from 1024px; stacked
  below). Used in Event details on `/` and on `/contact`.
## Content (all in `src/content/`; real content, no placeholders)
- `site.js`: `eventDescription` is an array of lines (rendered as separate lines; meta description =
  first 2 via `metaDescription`). `startTime`/`endTime` → `startTimeText` ("10:00 AM – 1:00 PM") on the
  Time card and ticket. `registerUrl` → every Register button (new tab); null → disabled "opens soon".
  The registration URL's domain is the ticketing partner's; that is the only sponsor trace allowed off
  /sponsors (it's a link target, never shown text).
- `speakers.js` (11): `{ id, honorific, name, title, tagline, labelLine, keywords, cards: [WHO, TOPIC], linkedin, photo }`.
  The reveal shows the honorific on its own muted label line above the name; everywhere else use
  `fullName(speaker)` ("Mr. Deepak Vohra": alt text, aria-live, LinkedIn label, schedule). TOPIC
  "Revealed on stage" has `italic: true`. No category tag.
- `schedule.js` (11): `{ id, time, speakerId }` (+ optional `title`, `description`). The node title is
  the speaker's full name, a button: `scrollToSection("speakers")` + `openSpeaker(id)`
  (`lib/speakerEvents.js`, a window CustomEvent). SpeakerReveal `goTo(index)` runs it through the busy
  guard; a request during a transition is queued and runs when it ends. Timeline height =
  `max(n·18vh, n·130px)`, so nodes stay ≥ 130px apart.
- `team.js`: groups Convenor (`featured`: one centred card, 1.25× width) → Coordinators → Core Team.
  `TeamGrid` uses centred flex-wrap rows (4 per row desktop, 2 tablet, 1 phone; short rows centred,
  equal heights). `TeamCard`: square photo (`object-position: center 30%`), name, role as the
  red-dot label (wraps under the text), description/LinkedIn only when present. Alt "Photo of [Name]".
- `sponsors.js`: `sponsors` + `sponsorTiers` (order, title, `featured`). `SponsorsSection` renders a
  featured 480×200 tile per Ticketing Partner, then a 3/2/1-column grid (2 from 375px) of 280×160 white
  tiles, logos in full colour (featured ≤ 240×96, others ≤ 180×80; always smaller than the 64px event
  logo), name in muted text under each tile. Tiles are links only when `url` is set.

## TEDx rules (non-negotiable)
- `src/content/lockedCopy.js` must stay byte-identical to `../_kit/content/lockedCopy.js`. Render it via
  `LockedCopy`; never transform its text or casing. Footer license statement on every page.
- Only `public/brand/tedxjemtec-logo.png` as the event logo (scale/fade only). Never "TEDXJEMTEC":
  wrap the name in `<Brand />` inside uppercase labels.
- Red text only ≥ 24px (or ≥ 19px bold); small "red" labels use `.accent-label` (white + red dot).
- No ads, trackers or analytics. Register wording only; no prices.

## Testing note
The desktop app's browser pane pauses requestAnimationFrame/transitions when hidden, so animations look
stuck there. Verify motion with headless Chrome (`C:\Program Files\Google\Chrome\Application\chrome.exe`)
over CDP, and Lighthouse via `npx lighthouse --preset=desktop` with `CHROME_PATH` set, against a static
server serving `out/`.
