/**
 * Speakers, in reveal order. Every count on the site (counter, wrap, schedule links) comes from
 * `speakers.length`, so adding or removing an entry needs no other change.
 *
 * Shape:
 * {
 *   id: string,               // unique, e.g. "speaker-01"; schedule.js links to it via speakerId
 *   placeholder: boolean,     // false for real people
 *   honorific: string,        // "Mr." | "Ms." | "Dr." — shown on its own line in the reveal, inline elsewhere
 *   name: string,             // without the honorific; each word renders on its own line
 *   title: string,            // role / affiliation, shown in small caps
 *   tagline: string,
 *   labelLine: string,        // three words separated by full stops, e.g. "IDEAS. STORIES. IMPACT."
 *   keywords: string[],       // short words or phrases for the keyword cloud
 *   cards: [{ label, body, italic? }], // exactly 2: WHO, TOPIC
 *   linkedin: string | null,  // full profile URL, rendered as the 3rd card ("LINKEDIN");
 *                             // null shows "Profile coming soon" (not a link)
 *   photo: string,            // path under /public
 * }
 *
 * Photo rules: square 1:1, WebP, face centred. Put files in public/speakers/.
 */

/** Speaker Reveal auto-advance: how long each speaker stays fully visible before the next one. */
export const SPEAKER_AUTOPLAY_MS = 6000;

/** "Mr. Deepak Vohra": the name as shown inline (schedule, alt text, announcements). */
export const fullName = (speaker) => `${speaker.honorific} ${speaker.name}`;

const REVEALED_ON_STAGE = "Revealed on stage";
// TOPIC card; "Revealed on stage" is set in italics.
const topic = (body) => ({ label: "TOPIC", body, italic: body === REVEALED_ON_STAGE });

export const speakers = [
  {
    id: "speaker-01",
    placeholder: false,
    honorific: "Mr.",
    name: "Deepak Vohra",
    title: "Veteran Indian Diplomat & Global Strategic Advisor",
    tagline: "Finding the unseen human threads connecting a fragmented world.",
    labelLine: "PERSPECTIVE. DIPLOMACY. HUMANITY.",
    keywords: ["Global Strategy", "Diplomacy", "Leadership", "Paradigm Shifts", "Geopolitics", "Human Connection"],
    cards: [
      { label: "WHO", body: "A veteran ambassador who served in 12+ nations, Dr. Vohra looks beyond geopolitical borders to find the shared truths that unite us all." },
      topic(REVEALED_ON_STAGE),
    ],
    linkedin: "https://www.linkedin.com/in/deepak-vohra-925835160",
    photo: "/speakers/speaker-01.webp",
  },
  {
    id: "speaker-02",
    placeholder: false,
    honorific: "Mr.",
    name: "Ashwini Kumar Upadhyay",
    title: "Supreme Court Advocate & Litigator",
    tagline: "Redefining how ordinary citizens can rewire the systems of justice.",
    labelLine: "ACTION. ACCOUNTABILITY. JUSTICE.",
    keywords: ["Civic Empowerment", "Law", "Public Interest", "Governance", "Systemic Change", "Reform"],
    cards: [
      { label: "WHO", body: "An engineer-turned-advocate who filed 50+ PILs, empowering everyday citizens to use the law to legally challenge systemic boundaries." },
      topic(REVEALED_ON_STAGE),
    ],
    linkedin: "https://www.linkedin.com/in/ashwini-upadhyay-4b0b947a/",
    photo: "/speakers/speaker-02.webp",
  },
  {
    id: "speaker-03",
    placeholder: false,
    honorific: "Ms.",
    name: "Nisha Gaylord",
    title: "Behavioral Transformation Coach & Founder",
    tagline: "You don't need a new life, just a new way of seeing yourself.",
    labelLine: "AWARENESS. IDENTITY. TRANSFORMATION.",
    keywords: ["NLP", "Human Behavior", "Emotional Intelligence", "Mindset", "Identity", "Self-Awareness"],
    cards: [
      { label: "WHO", body: 'NLP coach and author of "Born Again Without Dying," Nisha helps people uncover the invisible beliefs shaping their identity.' },
      topic("Emotional Equilibrium for an Ambitious Nation"),
    ],
    linkedin: "https://www.linkedin.com/in/nishagaylord",
    photo: "/speakers/speaker-03.webp",
  },
  {
    id: "speaker-04",
    placeholder: false,
    honorific: "Mr.",
    name: "Brijendra Singh",
    title: "Sr. VP & Corporate Strategy Leader",
    tagline: "Revealing the hidden human alliances behind scalable business.",
    labelLine: "ALLIANCES. STRATEGY. ECOSYSTEMS.",
    keywords: ["Corporate Strategy", "Partnerships", "Scaling", "B2B Ecosystems", "Leadership", "Vision"],
    cards: [
      { label: "WHO", body: "With 16+ years in tech and fintech, Brijendra builds the unseen architectures of human partnership that scale global business ecosystems." },
      topic(REVEALED_ON_STAGE),
    ],
    linkedin: "https://www.linkedin.com/in/brijendra-s-a5570443",
    photo: "/speakers/speaker-04.webp",
  },
  {
    id: "speaker-05",
    placeholder: false,
    honorific: "Mr.",
    name: "Nikhil Sethi",
    title: "Digital Artist, Software Engineer & Entrepreneur",
    tagline: "Building the unseen futures that exist only in our imagination.",
    labelLine: "CREATIVITY. TECHNOLOGY. VISION.",
    keywords: ["Digital Art", "Software Engineering", "Tech Startup", "Human Behavior", "Mentorship", "Innovation"],
    cards: [
      { label: "WHO", body: "An artist and engineer building a tech startup, Nikhil explores the unseen intersection of human behavior and creative technology." },
      topic("What if I never tried?"),
    ],
    linkedin: "https://www.linkedin.com/in/sethinikhil2003",
    photo: "/speakers/speaker-05.webp",
  },
  {
    id: "speaker-06",
    placeholder: false,
    honorific: "Mr.",
    name: "Rajesh Kumar",
    title: "Technocrat, Corporate Leader & Unicorn Pioneer",
    tagline: "Revealing the hidden resilience that turns bold visions into reality.",
    labelLine: "VISION. RESILIENCE. TRANSFORMATION.",
    keywords: ["Innovation", "Leadership", "Resilience", "Scaling", "Transformation", "Vision"],
    cards: [
      { label: "WHO", body: "A 3-decade technocrat and former CWG Director, Rajesh Kumar reveals the unseen resilience needed to scale ideas into unicorn conglomerates." },
      topic("His thoughts on the journey he has traversed through"),
    ],
    linkedin: "https://www.linkedin.com/in/rajesh-kumar-6077aa5/",
    photo: "/speakers/speaker-06.webp",
  },
  {
    id: "speaker-07",
    placeholder: false,
    honorific: "Mr.",
    name: "Dinesh Solanki",
    title: "Software Engineer, Creator & Mindset Mentor",
    tagline: "Engineering the unseen habits that turn confusion into clarity.",
    labelLine: "MINDSET. CLARITY. PURPOSE.",
    keywords: ["Digital Mentorship", "Career Clarity", "Habit Building", "Financial Wisdom", "Life Engineering", "Focus"],
    cards: [
      { label: "WHO", body: "An engineer and creator reaching 1.3M+ minds, Dinesh helps individuals look past the noise to architect clear, confusion-free lives." },
      topic("Becoming the person who doesn't quit."),
    ],
    linkedin: "https://www.linkedin.com/in/dinesh-kumar-a69238aa",
    photo: "/speakers/speaker-07.webp",
  },
  {
    id: "speaker-08",
    placeholder: false,
    honorific: "Ms.",
    name: "Nandini Sharma",
    title: "Educator, Mentor & Power Creator",
    tagline: "Reframing personal branding from digital noise to authentic identity.",
    labelLine: "AUTHENTICITY. VOICE. IMPACT.",
    keywords: ["Personal Branding", "Digital Identity", "Mentorship", "Authenticity", "Influence"],
    cards: [
      { label: "WHO", body: "A DU Gold Medalist and TOI Power Creator, Nandini Sharma helps individuals build digital identities rooted in their authentic, unseen voice." },
      topic("How to build a Personal Brand on Instagram"),
    ],
    linkedin: "https://www.linkedin.com/in/nandini-sharma-68b645119",
    photo: "/speakers/speaker-08.webp",
  },
  {
    id: "speaker-09",
    placeholder: false,
    honorific: "Mr.",
    name: "Ankit Jha",
    title: "Tech Educator, Content Creator & Entrepreneur",
    tagline: "Decoding the unseen human algorithms driving exponential tech growth.",
    labelLine: "TECHNOLOGY. ADAPTABILITY. SCALE.",
    keywords: ["Tech Education", "Artificial Intelligence", "Mentorship", "Innovation", "Scaling", "Digital Impact"],
    cards: [
      { label: "WHO", body: "An educator reaching 1M+ minds, Ankit looks past tech hype to reveal how human adaptability—not just code—shapes our future." },
      topic(REVEALED_ON_STAGE),
    ],
    linkedin: "https://www.linkedin.com/in/ankit-jha-8084a7138",
    photo: "/speakers/speaker-09.webp",
  },
  {
    id: "speaker-10",
    placeholder: false,
    honorific: "Ms.",
    name: "Saumya Singh",
    title: "Software Engineer, Tech Educator & Global Mentor",
    tagline: "An award-winning global leader rewriting tech's unseen boundaries.",
    labelLine: "MENTORSHIP. COMMUNITY. EMPOWERMENT.",
    keywords: ["Tech Education", "Mentorship", "Open Source", "Women in Tech", "Community", "Empowerment"],
    cards: [
      { label: "WHO", body: "A global open-source mentor and 7-time hackathon champion, Saumya reveals how unseen guidance can completely rewrite a life's trajectory." },
      topic(REVEALED_ON_STAGE),
    ],
    linkedin: "https://www.linkedin.com/in/saumya1singh/",
    photo: "/speakers/speaker-10.webp",
  },
  {
    id: "speaker-11",
    placeholder: false,
    honorific: "Dr.",
    name: "Sahil Singh",
    title: "Tech Entrepreneur & UN SDG Ambassador",
    tagline: "Harnessing unseen digital architectures to drive global sustainability.",
    labelLine: "TECHNOLOGY. ALLIANCES. IMPACT.",
    keywords: ["Tech Entrepreneurship", "UN SDGs", "Blockchain", "Strategic Partnerships", "Innovation"],
    cards: [
      { label: "WHO", body: "An IT founder and UN SDG Ambassador, Dr. Singh leverages unseen technologies like blockchain to build frameworks for global sustainability." },
      topic(REVEALED_ON_STAGE),
    ],
    linkedin: "https://www.linkedin.com/in/sahil031",
    photo: "/speakers/speaker-11.webp",
  },
];
