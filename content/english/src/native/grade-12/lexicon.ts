// Grade 12: the words the passages of the course use that the lexicon of the earlier packs does not list. Each
// spelling is an entry of its own, so that a spelling another pack already lists does not hide the others.

import type { LexiconEntry } from "@ga/content";

const words = `
accidentally admirers advantaged aiming airline analyst asbestos associations auctioneer's awarded awkward backed
basements bishop blue-black bribing bunch chairman chicken's chords civilian clash coffins coincide collapsible
conceptual contentment corresponded courthouses coxcomb cozy crafted dancer dangerously dare dashboards deceived
defects defended defender defenses desiring dikes dine discredit dislike disliking doubting driver's elegance emphases
enrich evident evil explosions expressiveness eyesight faithful faithfulness farthing fewest finders flecks flinging
forbade framed frenchman glancing gracefully gray-blue guineas half-shredded hammer harsher heart-shaped hedonism
heroic hijacked hotel's hundredth imperial implode impudence induction industry's influential inkstone inkstones
instructive inwardly jerked libeled literary looseness male many-sided materialists meantime men's misled modestly
modifier morally muckrakers mussel nanny negatives noticeably noun nourish nut oddities onward operas originals ought
outraged overstated oyster painter's paradox permissible photographer's photographers photographic pierce plainer
pleasing pleasure poisoning postponing precincts preface preparedness priced proportionate psychiatrist's public's
quietness reactor's readymades rear rearranged rebates redirecting rediscover refiners refinery regulator rendered
repetitions repetitive researching restrained ripe rods scandals seascape seawall seduces selects self-translation
sensed shipments shocks shortened shredder sketched sluices smokeless smoky smoothed society's specialty spectacle
spied spirituality stocked strangeness successfully sued suffocated sulfur superiors supreme swear sweetness terrorist
thalidomide thinly thyroid tidal torches translator's triangle trolley truer truthful unborn uncontrollably
understandable undertakers unfinished unlucky unmixed unplug urinal veil vividly voltage volts waist wavelengths
whaling widest work's wrings yearly yellow-black
`;

/** lexicon12 are the words of the passages of grade 12 outside the shared lexicon. */
export const lexicon12: readonly LexiconEntry[] = words
  .split(/\s+/)
  .filter((word) => word !== "")
  .map((word) => ({ word }));
