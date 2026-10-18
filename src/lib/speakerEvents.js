"use client";

/**
 * Lets other sections (the schedule) ask the Speaker Reveal to show a speaker.
 * SpeakerReveal listens for this event and steps to that speaker through its usual transition.
 */
export const OPEN_SPEAKER_EVENT = "tedx:open-speaker";

export function openSpeaker(id) {
  window.dispatchEvent(new CustomEvent(OPEN_SPEAKER_EVENT, { detail: { id } }));
}
