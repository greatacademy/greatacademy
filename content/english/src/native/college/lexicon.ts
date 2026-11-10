// College writing: the words the passages of the course use that the lexicon of the skill courses and the earlier
// bands does not list. Each spelling is an entry of its own, so that a spelling another pack already lists does not
// hide the others.

import type { LexiconEntry } from "@ga/content";

const words = `
academic accelerated accusation acquire affection alarmed approach approached approaching arson assumes baker's
blackbirds bolder boldness breed broader built-in caution ceased circulate coincides comparisons concludes consistent
contents contrast contributes contribution decline declines deliberate deliberately desires despite destruction differ
directed discomfort discussion disprove dispute distinguish distraction dominated economic economists emphasized
employment examination exceptions exclusive existence extracted factors familiar fiercely fragments gaps generally
genuinely goed grammar gun heavily hiring historical hourly illusion illustrates inborn incomplete indeed indirect
inherited input insecurity interestingly interpreter issue learner lifetime lightly limitations lowest-paid meaningful
merely mind's misfortune modest mouses mutually narrower neighboring noted occupied odd opposition overlook overstate
patterns philosophers pitch plausible plural pointing policy port principles produces productive provoked puzzling
questioned readiness recall reconcile reconstructed rejects relatively resolved rethink retrieve reveals robber
roughly scrolling secondary session sessions settle shame single-session sobering somewhat southwest spaced spacing
stated strengthens survival tendency tolerance tolerate tolerating tourism unrelated unskilled unusually warehouses
weekly well-being
`;

/** lexiconCollege are the words of the passages of the college writing course outside the shared lexicon. */
export const lexiconCollege: readonly LexiconEntry[] = words
  .split(/\s+/)
  .filter((word) => word !== "")
  .map((word) => ({ word }));
