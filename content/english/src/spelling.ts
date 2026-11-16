// British spelling, for the passages read aloud in a British or Australian voice: their text is spelled as their
// speaker would spell it. Only spellings that differ regularly are converted; words whose British spelling depends on
// their sense, such as program and programme or check and cheque, are left to the author.

import type { LexiconEntry } from "@ga/content";

/** WORDS maps American spellings that follow no rule here to British ones, by stem: each also covers its -s form. */
const WORDS: Readonly<Record<string, string>> = {
  aluminum: "aluminium",
  analog: "analogue",
  catalog: "catalogue",
  defense: "defence",
  dialog: "dialogue",
  enroll: "enrol",
  enrollment: "enrolment",
  fulfill: "fulfil",
  fulfillment: "fulfilment",
  gray: "grey",
  grayer: "greyer",
  jewelry: "jewellery",
  mold: "mould",
  moldy: "mouldy",
  molded: "moulded",
  offense: "offence",
  pajamas: "pyjamas",
  plow: "plough",
  skeptic: "sceptic",
  skeptical: "sceptical",
  skepticism: "scepticism",
};

/** OUR are the stems spelled -or in American English and -our in British English. */
const OUR = [
  "arbor",
  "ardor",
  "armor",
  "behavior",
  "candor",
  "clamor",
  "color",
  "endeavor",
  "favor",
  "flavor",
  "harbor",
  "honor",
  "humor",
  "labor",
  "neighbor",
  "odor",
  "parlor",
  "rancor",
  "rigor",
  "rumor",
  "savior",
  "savor",
  "splendor",
  "tumor",
  "valor",
  "vapor",
  "vigor",
];

/** OUR_ENDINGS are the endings that keep the u of a British -our stem; humorous and vigorous drop it. */
const OUR_ENDINGS = [
  "",
  "s",
  "ed",
  "ing",
  "ful",
  "fully",
  "less",
  "ite",
  "ites",
  "able",
  "ably",
  "hood",
  "hoods",
  "al",
  "er",
  "ers",
  "ism",
  "ist",
  "ists",
  "y",
];

/** RE are the stems spelled -er in American English and -re in British English. */
const RE = [
  "center",
  "theater",
  "meter",
  "liter",
  "fiber",
  "caliber",
  "somber",
  "saber",
  "specter",
  "luster",
  "kilometer",
  "centimeter",
  "millimeter",
  "milliliter",
  "maneuver",
];

/** DOUBLE_L are the verbs whose final l is doubled in British English before -ed, -ing, -er and -ers. */
const DOUBLE_L = [
  "travel",
  "cancel",
  "label",
  "model",
  "fuel",
  "signal",
  "total",
  "quarrel",
  "marvel",
  "level",
  "channel",
  "counsel",
  "dial",
  "duel",
  "equal",
  "funnel",
  "jewel",
  "libel",
  "panel",
  "pedal",
  "rival",
  "shovel",
  "snorkel",
  "tunnel",
  "label",
  "yodel",
];

/** NOT_IZE are words ending in -ize that are spelled the same in British English. */
const NOT_IZE = new Set([
  "size",
  "sizes",
  "sized",
  "sizing",
  "prize",
  "prizes",
  "prized",
  "seize",
  "seizes",
  "seized",
  "seizing",
  "capsize",
  "capsized",
  "maize",
  "baize",
  "downsize",
  "downsized",
  "downsizing",
  "oversize",
  "oversized",
  "resize",
  "resized",
]);

/** british maps every American spelling the rules here cover to its British spelling. */
const british: ReadonlyMap<string, string> = (() => {
  const map = new Map<string, string>();
  for (const [us, gb] of Object.entries(WORDS)) {
    map.set(us, gb);
    map.set(`${us}s`, `${gb}s`);
  }
  for (const stem of OUR) for (const e of OUR_ENDINGS) map.set(`${stem}${e}`, `${stem.slice(0, -2)}our${e}`);
  for (const stem of RE) {
    const gb = stem.replace(/er$/u, "re");
    for (const [a, b] of [
      ["", ""],
      ["s", "s"],
      ["ed", "d"],
      ["ing", "ing"],
    ] as const)
      map.set(`${stem}${a}`, `${gb}${b}`);
  }
  for (const stem of DOUBLE_L)
    for (const e of ["ed", "ing", "er", "ers"]) {
      const us = `${stem}${e}`;
      if (!map.has(us)) map.set(us, `${stem}l${e}`);
    }
  return map;
})();

/** IZE matches a word ending in -ize, -yze or one of their derived endings, after a stem of at least three letters. */
const IZE = /^([a-z]{3,})([iy])z(e|es|ed|ing|ation|ations|er|ers)$/u;

/** britishSpelling is the British spelling of a lowercase word, or the word itself when it is the same. */
export function britishSpelling(word: string): string {
  const known = british.get(word);
  if (known) return known;
  if (NOT_IZE.has(word)) return word;
  const m = IZE.exec(word);
  return m ? `${m[1]}${m[2]}s${m[3]}` : word;
}

/** matchCase spells gb in the case of us: all capitals, a capital first letter, or lowercase. */
const matchCase = (us: string, gb: string) =>
  us === us.toUpperCase() && us.length > 1 ? gb.toUpperCase() : us[0] === us[0]?.toUpperCase() ? gb[0]!.toUpperCase() + gb.slice(1) : gb;

/** toBritish respells the words of an English text that have a regular British spelling. */
export const toBritish = (text: string): string =>
  text.replace(/\p{L}+/gu, (w) => {
    const gb = britishSpelling(w.toLowerCase());
    return gb === w.toLowerCase() ? w : matchCase(w, gb);
  });

/** americanSpellings lists the words of a text spelled the American way where a British speaker spells them otherwise. */
export const americanSpellings = (text: string): string[] =>
  [...new Set(text.match(/\p{L}+/gu) ?? [])].filter((w) => britishSpelling(w.toLowerCase()) !== w.toLowerCase());

/** withBritishForms gives each entry of a lexicon the British spellings of its forms that no entry has already. */
export function withBritishForms(lexicon: readonly LexiconEntry[]): LexiconEntry[] {
  const seen = new Set(lexicon.flatMap((e) => [e.word, ...(e.forms ?? [])].map((w) => w.toLowerCase())));
  return lexicon.map((entry) => {
    const added: string[] = [];
    for (const form of [entry.word, ...(entry.forms ?? [])]) {
      const gb = britishSpelling(form.toLowerCase());
      if (gb === form.toLowerCase() || seen.has(gb)) continue;
      seen.add(gb);
      added.push(gb);
    }
    return added.length > 0 ? { ...entry, forms: [...(entry.forms ?? []), ...added] } : entry;
  });
}
