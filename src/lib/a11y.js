/** id of the hidden "Opens in a new tab" note (rendered once in the root layout). */
export const NEW_TAB_NOTE_ID = "new-tab-note";

/** Props for links that open in a new tab, announced without changing the link text. */
export const newTabProps = {
  target: "_blank",
  rel: "noopener noreferrer",
  "aria-describedby": NEW_TAB_NOTE_ID,
};
