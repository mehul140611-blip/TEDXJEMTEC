/**
 * LOCKED TEDx COPY — DO NOT EDIT, REWORD, SHORTEN, "FIX" OR REFORMAT.
 *
 * This text is mandated by TEDx and was supplied by the TEDxJEMTEC organizing team.
 * The only change from the official template is TEDx[name] -> TEDxJEMTEC.
 * Rendering rules:
 *   - Render every string exactly as written (including punctuation, dashes and curly quotes).
 *   - Paragraphs are arrays of segments. A segment with `href` renders as a link
 *     (target="_blank" rel="noopener noreferrer"); a segment without `href` is plain text.
 *   - Do not add, remove or merge paragraphs.
 *
 * TODO(content-team): the About TED sentence
 *   "Each year, thousands of independently run TEDx events."
 * appears to be incomplete (no verb). Verify it against the official TEDx organizer
 * source. Until the team supplies the corrected wording, render it EXACTLY as-is.
 */

export const TEDX_PROGRAM_URL =
  "https://www.ted.com/about/programs-initiatives/tedx-program";

export const FOOTER_LICENSE_STATEMENT =
  "This independent TEDx event is operated under license from TED.";

/** Homepage — required "What is TEDx?" block (must sit next to a visible link to TEDX_PROGRAM_URL). */
export const WHAT_IS_TEDX = {
  heading: "What is TEDx?",
  paragraphs: [
    [
      {
        text:
          "In the spirit of discovering and spreading ideas, TED has created a program called TEDx. TEDx is a program of local, self-organized events that bring people together to share a TED-like experience. Our event is called TEDxJEMTEC, where x = independently organized TED event. At our TEDxJEMTEC event, TED Talks video and live speakers will combine to spark deep discussion and connection in a small group. Speakers never pay to join a TEDx event. Consideration, speaker coaching and event participation along with attendance are all provided free of charge. The TED Conference provides general guidance for the TEDx program, but individual TEDx events, including ours, are self-organized.",
      },
    ],
  ],
};

/** About page — About TEDx */
export const ABOUT_TEDX = {
  heading: "About TEDx, x = independently organized event",
  paragraphs: [
    [
      {
        text:
          "In the spirit of discovering and spreading ideas, TEDx is a program of local, self-organized events that bring people together to share a TED-like experience. At a TEDx event, TED Talks video and live speakers combine to spark deep discussion and connection. These local, self-organized events are branded TEDx, where x = independently organized TED event. The TED Conference provides general guidance for the TEDx program, but individual TEDx events are self-organized. (Subject to certain rules and regulations.)",
      },
    ],
  ],
};

/** About page — About TED */
export const ABOUT_TED = {
  heading: "About TED",
  paragraphs: [
    [
      {
        text:
          "TED is a nonprofit, nonpartisan organization dedicated to discovering, debating and spreading ideas that spark conversation, deepen understanding and drive meaningful change. Our organization is devoted to curiosity, reason, wonder and the pursuit of knowledge — without an agenda. We welcome people from every discipline and culture who seek a deeper understanding of the world and connection with others, and we invite everyone to engage with ideas and activate them in your community.",
      },
    ],
    [
      {
        text:
          "TED began in 1984 as a conference where Technology, Entertainment and Design converged, but today it spans a multitude of worldwide communities and initiatives exploring everything from science and business to education, arts and global issues. In addition to the TED Talks curated from our annual conferences and published on TED.com, we produce ",
      },
      { text: "original podcasts", href: "https://audiocollective.ted.com/" },
      { text: ", " },
      { text: "short video series", href: "https://www.ted.com/series" },
      { text: ", " },
      { text: "animated educational lessons (TED-Ed)", href: "https://ed.ted.com/" },
      {
        text:
          " and TV programs that are translated into more than 100 languages and distributed via partnerships around the world. Each year, thousands of independently run ",
      },
      {
        text: "TEDx events",
        href: "https://www.ted.com/about/programs-initiatives/tedx-program",
      },
      { text: ". Through the " },
      { text: "Audacious Project", href: "https://www.audaciousproject.org/" },
      {
        text:
          ", TED has helped catalyze $6.6 billion in funding for projects that support bold solutions to the world's most urgent challenges — working to make the world more beautiful, sustainable and just. In 2020, TED launched ",
      },
      { text: "Countdown", href: "https://countdown.ted.com/" },
      {
        text:
          ", an initiative to accelerate solutions to the climate crisis and mobilize a movement for a net-zero future, and in 2023 TED launched ",
      },
      {
        text: "TED Democracy",
        href: "https://www.ted.com/about/programs-initiatives/teddemocracy",
      },
      {
        text:
          " to spark a new kind of conversation focused on realistic pathways towards a more vibrant and equitable future. View a full list of ",
      },
      {
        text: "TED’s many programs and initiatives",
        href: "https://www.ted.com/about/programs-initiatives",
      },
      { text: "." },
    ],
    [
      { text: "Follow TED on " },
      { text: "Facebook", href: "http://www.facebook.com/TED" },
      { text: ", " },
      { text: "Instagram", href: "https://instagram.com/ted" },
      { text: ", " },
      { text: "LinkedIn", href: "https://www.linkedin.com/company/ted-conferences" },
      { text: ", " },
      { text: "TikTok", href: "https://www.tiktok.com/@tedtoks?lang=en" },
      { text: ", and " },
      { text: "X", href: "http://twitter.com/TEDTalks" },
      { text: "." },
    ],
  ],
};
