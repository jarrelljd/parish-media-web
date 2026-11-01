// Turns a typed full name into a polite greeting:
// "Fr. John Smith" -> "Father Smith", "Sr. Mary Jones" -> "Sister Mary",
// "John Smith" -> "John". Shared by the free-guide letter (LetterGreeting)
// and the scorecard (summary page + report email).

export const GREETING_FALLBACK = "Parish Leader";

// Titles where you greet by last name ("Fr. John Smith" -> "Father Smith").
const LAST_NAME_TITLES: Record<string, string> = {
  fr: "Father",
  father: "Father",
  rev: "Father",
  reverend: "Father",
  deacon: "Deacon",
  dcn: "Deacon",
  deac: "Deacon",
  msgr: "Monsignor",
  monsignor: "Monsignor",
  bishop: "Bishop",
  bp: "Bishop",
  mr: "Mr.",
  mrs: "Mrs.",
  ms: "Ms.",
  dr: "Dr.",
};

// Titles where you greet by first name ("Sr. Mary Jones" -> "Sister Mary").
const FIRST_NAME_TITLES: Record<string, string> = {
  sr: "Sister",
  sister: "Sister",
  br: "Brother",
  brother: "Brother",
};

// Trailing bits that aren't a surname ("Jr.", "OFM Cap.", "III", ...).
const SUFFIX = /^(jr|sr|ii|iii|iv|ofm|cap|op|sj|osb|cssr|lc|fssp|ofmcap|phd)\.?$/i;

// Lowercase surname particles that stay with the last name ("de Bliquy").
const PARTICLES = new Set(["de", "del", "della", "der", "di", "da", "du", "la", "le", "van", "von", "st", "st."]);

function lastName(words: string[]) {
  let i = words.length - 1;
  while (i > 1 && PARTICLES.has(words[i - 1].toLowerCase())) i--;
  return words
    .slice(i)
    .map((w, j) => (j === words.length - 1 - i ? tidy(w) : w.toLowerCase()))
    .join(" ");
}

function tidy(word: string) {
  // Fix all-lowercase / ALL-CAPS entries; leave mixed case (McDonald) alone.
  if (word === word.toLowerCase() || word === word.toUpperCase()) {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }
  return word;
}

export function greetingFor(fullName: string): string {
  const words = fullName
    .split(",")[0]
    .trim()
    .split(/\s+/)
    .filter((w) => w && /\p{L}/u.test(w));
  if (words.length === 0) return GREETING_FALLBACK;

  const titleKey = words[0].replace(/\./g, "").toLowerCase();
  const rest = words.slice(1);
  while (rest.length > 1 && SUFFIX.test(rest[rest.length - 1])) rest.pop();

  if (LAST_NAME_TITLES[titleKey] && rest.length > 0) {
    return `${LAST_NAME_TITLES[titleKey]} ${lastName(rest)}`;
  }
  if (FIRST_NAME_TITLES[titleKey] && rest.length > 0) {
    return `${FIRST_NAME_TITLES[titleKey]} ${tidy(rest[0])}`;
  }
  if (LAST_NAME_TITLES[titleKey] || FIRST_NAME_TITLES[titleKey]) return GREETING_FALLBACK;
  return tidy(words[0]);
}
