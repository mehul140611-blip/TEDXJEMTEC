# TEDxJEMTEC website

Official website for **TEDxJEMTEC 2026 — Beyond the Frame** (23 October 2026, Auditorium, JEMTEC).
This independent TEDx event is operated under license from TED.

Built with Next.js (App Router, JavaScript), Tailwind CSS and GSAP. It exports to plain static files,
so it can be hosted anywhere that serves HTML (including shared hosting).

**Structure:** one scrolling page at `/` with sections `#home`, `#speakers`, `#schedule` and `#team`
(the navbar scrolls to them), plus separate `/about`, `/contact` and `/sponsors` pages (TEDx rule:
no sponsors on the homepage) and a 404 page. Links like `/#speakers` can be shared.

## Run it

Requires Node.js 20 or newer.

```bash
npm install          # once
npm run dev          # local development at http://localhost:3000
npm run lint         # must pass with zero warnings
npm run build        # static export into out/
npx serve out        # preview the exported site at http://localhost:3000
```

`npm run build` also runs `scripts/fix-segment-prefetch.mjs` automatically (a workaround for a
Next 16.3 static-export naming mismatch that would otherwise make link prefetches 404).

**Hosting:** https://tedxjemtec.org is served by **GitHub Pages**; the domain is registered at Hostinger.
Every push to `main` builds and publishes the site (`.github/workflows/deploy.yml`). One-time setup
(Pages, Hostinger DNS records, HTTPS), checks and troubleshooting: **[DEPLOY.md](DEPLOY.md)**.
For ordinary Apache hosting instead, `npm run package` makes `tedxjemtec-site.zip` (with `public/.htaccess`).

## Editing content

All content lives in `src/content/`. Edit one entry in one file; no component changes are needed.
Counts are never hard-coded: adding or removing a speaker, session, team member or sponsor just works.

| What | File |
|---|---|
| Event facts, registration link, email, phone, socials | `src/content/site.js` |
| Speakers | `src/content/speakers.js` |
| Schedule | `src/content/schedule.js` |
| Team | `src/content/team.js` |
| Sponsors & partners | `src/content/sponsors.js` |
| Mandatory TEDx text | `src/content/lockedCopy.js` — **never edit** |

### Registration link

In `src/content/site.js`:

```js
registerUrl: "https://…",   // or null to show "Registration opens soon" (disabled) everywhere
```

Every Register button opens this URL in a new tab. Use the word "Register"; never "Buy"/"Book",
and never show a price. The ticketing partner is a sponsor, so its name must not appear on the homepage.

### Speaker

In `src/content/speakers.js` (the shape is documented at the top of the file). The reveal shows the
honorific on its own small line above the name; everywhere else the name is shown inline ("Ms. Jane Doe").

```js
{
  id: "speaker-12",
  placeholder: false,
  honorific: "Ms.",
  name: "Jane Doe",
  title: "Founder, Example Studio",
  tagline: "Designing cities that listen.",            // ≤ 70 characters
  labelLine: "DESIGN. CITIES. PEOPLE.",
  keywords: ["Design", "Urbanism", "Cities", "People", "Listening"], // 5–8
  cards: [
    { label: "WHO", body: "One or two sentences." },
    topic("Revealed on stage"),                         // set in italics
  ],
  linkedin: "https://www.linkedin.com/in/jane-doe/",    // or null → "Profile coming soon"
  photo: "/speakers/speaker-12.webp",
},
```

Photo: square 1:1, at least 800×800, WebP, face centred with the eyes at about 40% of the height,
max 200 KB, saved in `public/speakers/`.

### Schedule session

In `src/content/schedule.js` (the timeline places one node per entry and grows with the list):

```js
session(12, "12:45 – 1:00 PM", "12"),   // time, then the speaker number from speakers.js
```

The node shows the time in red and the speaker's name; clicking the name scrolls to the Speaker Reveal
and opens that speaker. A session without a speaker can be written out as
`{ id: "break", time: "…", title: "…" }`.

### Team member

In `src/content/team.js`, inside the right group (Convenor, Coordinators, Core Team):

```js
{ id: "team-08", name: "Jane Doe", role: "Curator", photo: "/team/team-08.webp" },
// optional: description: "One line, ≤ 90 characters", linkedin: "https://www.linkedin.com/in/jane-doe/"
```

Photo: square 1:1, at least 800×800, WebP, ≤ 150 KB; the crop keeps the upper part (`center 30%`).
Card styling lives only in `src/components/sections/TeamCard.jsx`, so a new team design means
editing that one file.

### Sponsor or partner

In `src/content/sponsors.js`:

```js
{ id: "acme", name: "Acme Corp", logo: "/sponsors/acme.png", url: null, tier: "Partner" },
```

`tier` must match one of `sponsorTiers` ("Ticketing Partner" is the featured wide tile, "Partner" the grid).
With a `url` the tile becomes a link (new tab). Logos show in full colour on white tiles, always smaller than
the event logo, and **only** on `/sponsors`. TEDx rules: sponsor names or logos must never appear on the
homepage, footer, navbar or page headers, and wording must not suggest that sponsors organize or control the event.

## TEDx rules this site enforces

- Locked TEDx copy is rendered word for word from `lockedCopy.js` (homepage "What is TEDx?", About TEDx,
  About TED, and the footer license statement on every page).
- Only `public/brand/tedxjemtec-logo.png` is used as the event logo; it is only ever scaled or faded.
- No ads, trackers or analytics.
- `prefers-reduced-motion` turns off the intro, page wipes, parallax, particles, tilt, tiles and the
  scrubbed schedule path.

## Project structure

```
src/
  app/          layout, template, page.jsx (the homepage scroll), about/, contact/, sponsors/, not-found
  components/
    layout/     Navbar, MobileMenu, Footer, PageTransition, IntroGate, HomeLanding, ScrollRefresh
    ui/         Button, SectionLink, RegisterButton, LockedCopy, SectionShell, SectionDivider, …
    sections/   Hero, ThemeSection, EventDetails, WhatIsTedx, TicketSection, AboutSection,
                SpeakerReveal, ScheduleSection, TeamSection, ContactSection, SponsorsSection, …
  content/      site.js, lockedCopy.js, speakers.js, schedule.js, team.js, sponsors.js
  lib/          motion.js, sections.js (in-page scrolling), speakerEvents.js (schedule → reveal), nav.js (scroll-spy), intro.js, tiles.js, …
```
