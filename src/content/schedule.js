/**
 * Sessions for 23 October 2026, in order. The timeline places one node per entry and spaces
 * them evenly; its height grows with the number of entries.
 *
 * Shape: { id, time, speakerId, title?, description? }
 *   time         e.g. "10:00 – 10:15 AM" (shown in red)
 *   speakerId    matches an `id` in speakers.js. The node's title is that speaker's name
 *                ("Mr. Deepak Vohra"); clicking it opens the speaker in the Speaker Reveal.
 *   title        optional, for a session without a speaker (e.g. a break)
 *   description  optional one-line note under the title
 */

const session = (n, time, speakerNumber) => ({
  id: `session-${String(n).padStart(2, "0")}`,
  time,
  speakerId: `speaker-${speakerNumber}`,
});

export const schedule = [
  session(1, "10:00 – 10:15 AM", "01"),
  session(2, "10:15 – 10:30 AM", "02"),
  session(3, "10:30 – 10:45 AM", "11"),
  session(4, "10:45 – 11:00 AM", "03"),
  session(5, "11:00 – 11:15 AM", "04"),
  session(6, "11:15 – 11:30 AM", "05"),
  session(7, "11:30 – 11:45 AM", "07"),
  session(8, "11:45 AM – 12:00 PM", "10"),
  session(9, "12:00 – 12:15 PM", "09"),
  session(10, "12:15 – 12:30 PM", "08"),
  session(11, "12:30 – 12:45 PM", "06"),
];
