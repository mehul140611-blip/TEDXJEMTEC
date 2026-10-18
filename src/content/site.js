/**
 * Event facts for TEDxJEMTEC. Every component reads event details from here.
 * Only confirmed facts belong in this file. Leave unknown values as `null`.
 */

export const site = {
  eventName: "TEDxJEMTEC",

  date: "23 October 2026",
  dateISO: "2026-10-23",
  dateLabel: "23 OCT 2026",
  dateDecorative: "23.10.2026",

  // Shown as "10:00 AM – 1:00 PM" (en dash). If startTime is null the UI shows `startTimeFallback`.
  startTime: "10:00 AM",
  endTime: "1:00 PM",
  startTimeFallback: "To be announced",

  theme: "Beyond the Frame",
  themeSubtitle: "To See What Others Often Miss",
  // Event description: one string per line, rendered as separate lines.
  eventDescription: [
    "We see the world through the narrow frames of habit and assumption, missing the extraordinary ideas waiting just out of sight.",
    "This event is a call to shift your perspective and notice the brilliance that the rest of the world walks past.",
    "Guided by visionaries and rule-breakers, we will challenge the boundaries of the familiar.",
    "Because you don't need a new picture, you just need a single shift in perspective.",
  ],

  venueName: "Auditorium, JEMTEC",
  venueAddress:
    "48/4, Knowledge Park III, Greater Noida, Uttar Pradesh 201310, India",
  mapEmbedSrc:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3507.453540528475!2d77.48043537554689!3d28.465884975756136!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cea0f70009f75%3A0x22c86d7a6f81b56b!2sJIMS%20Engineering%20Management%20Technical%20Campus%20(JEMTEC)!5e0!3m2!1sen!2sin!4v1790777725840!5m2!1sen!2sin",
  // "Open in Google Maps" link: a search for the same place the embed shows.
  mapLinkUrl:
    "https://www.google.com/maps/search/?api=1&query=JIMS%20Engineering%20Management%20Technical%20Campus%20(JEMTEC)%2C%20Knowledge%20Park%20III%2C%20Greater%20Noida",

  // Registration link (opens in a new tab). Set to null to show the disabled
  // "Registration opens soon" button everywhere instead.
  registerUrl:
    "https://kqeek.onelink.me/xF6d?af_xp=custom&pid=qr&deep_link_value=qr&deep_link_sub1=event%3A6b56011c-78d2-4715-94eb-86d2c72a7d66&guid=event%3A6b56011c-78d2-4715-94eb-86d2c72a7d66",

  email: "tedx.gn@jagannath.org",
  phone: "+91 74282 85657",
  phoneHref: "tel:+917428285657",
  linkedin: "https://www.linkedin.com/company/tedx-jemtec/",
  instagram: "https://www.instagram.com/tedxjemtec_/",

  siteUrl: "https://tedxjemtec.org",
};

/**
 * Main navigation, in the team's framework order. Items with a `section` scroll to that section
 * of the homepage ("/#id"); the others are separate pages (About, Sponsors, Contact Us) reached
 * with the page wipe. Sponsors must stay its own page (TEDx rule: no sponsors on the homepage).
 */
export const nav = [
  { label: "Home", href: "/#home", section: "home" },
  { label: "About", href: "/about/" },
  { label: "Speakers", href: "/#speakers", section: "speakers" },
  { label: "Schedule", href: "/#schedule", section: "schedule" },
  { label: "Team", href: "/#team", section: "team" },
  { label: "Sponsors", href: "/sponsors/" },
  { label: "Contact Us", href: "/contact/" },
];

export const startTimeText = site.startTime
  ? `${site.startTime}${site.endTime ? ` – ${site.endTime}` : ""}`
  : site.startTimeFallback;

/** Meta description: the first two sentences of the event description, unchanged. */
export const metaDescription = site.eventDescription.slice(0, 2).join(" ");
