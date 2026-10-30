// Options for the "Your role" dropdown on the /free-guide opt-in form.
// Shared by the form (FreeGuideForm.tsx) and its server action (actions.ts).
export const NO_QUALIFYING_ROLE = "None of the Above";

export const freeGuideRoles = [
  "Pastor",
  "Parochial Vicar",
  "Deacon",
  "Communications",
  "Business Manager",
  NO_QUALIFYING_ROLE,
] as const;

// Shown instead of the free copy when someone picks "None of the Above".
export const AMAZON_BOOK_URL =
  "https://www.amazon.com/Social-Media-Catholic-Churches-Practical/dp/B0H3QTWDFL/";
