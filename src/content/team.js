/**
 * Organizing team, in display order. Group titles and order come from here.
 *
 * Group:  { id, title, featured?, members[] }
 *   featured: true → one larger centred card (the Convenor). Other groups share one card size:
 *   4 per row on desktop, 2 on tablet, 1 on phones; a short last row is centred.
 * Member: {
 *   id: string,
 *   name: string,
 *   role: string,           // the red label; long roles wrap to two lines
 *   department?: string,    // optional second line under the role, e.g. "B.Tech CSE"
 *   photo: string,          // path under /public
 *   description?: string,   // optional one line, ≤ 90 characters (omit when there is none)
 *   linkedin?: string,      // optional full profile URL
 * }
 *
 * Photo rules: square 1:1, at least 800×800, WebP, face in the upper third (the crop keeps
 * `center 30%`), max 150 KB. Put files in public/team/.
 */

export const teamGroups = [
  {
    id: "convenor",
    title: "Convenor",
    featured: true,
    members: [{ id: "convenor", name: "Prof. (Dr.) Latha Banda", role: "HoD, B.Tech CSE", photo: "/team/convenor.webp" }],
  },
  {
    id: "coordinators",
    title: "Coordinators",
    members: [
      { id: "coord-01", name: "Ms. Garima Singh", role: "Assistant Professor", department: "B.Tech CSE", photo: "/team/coord-01.webp" },
      { id: "coord-02", name: "Dr. Shilpa Jaitly", role: "Assistant Professor", department: "B.Tech CSE", photo: "/team/coord-02.webp" },
      { id: "coord-03", name: "Mr. Swapnil Kaushal", role: "Assistant Professor", department: "B.Tech CSE", photo: "/team/coord-03.webp" },
    ],
  },
  {
    id: "core-team",
    title: "Core Team",
    members: [
      { id: "team-01", name: "Khushal", role: "President", photo: "/team/team-01.webp" },
      { id: "team-02", name: "Sarthak", role: "Vice President", photo: "/team/team-02.webp" },
      { id: "team-03", name: "Mannat Thukral", role: "Tech Team Head", photo: "/team/team-03.webp" },
      { id: "team-04", name: "Arjun Bharadwaj", role: "Scripting & Speech Formatting Team Head", photo: "/team/team-04.webp" },
      { id: "team-05", name: "Rajat Kumar Popli", role: "Design & Marketing Team Head", photo: "/team/team-05.webp" },
      { id: "team-06", name: "Rakshit Dogra", role: "Logistics Team Head", photo: "/team/team-06.webp" },
      { id: "team-07", name: "Shailendra Pal", role: "PR Team Head", photo: "/team/team-07.webp" },
    ],
  },
];
