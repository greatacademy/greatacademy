// Grade 7: the words the passages of the course use that the lexicon of the earlier packs does not list. Each
// spelling is an entry of its own, so that a spelling another pack already lists does not hide the others.

import type { LexiconEntry } from "@ga/content";

const words = `
aim airliners angered angle apartheid armored babysitting bankers banknotes barbershop barefoot battlefield bending
berries best-selling blast blinded blue-green boldly borrowers bowed brewery broth bubbled bullet capable cavalry
cemetery centered child's childbed chocolate-dipped choking cleanse clerk's cluster coated colony's communications
controller controllers corpses courtroom cowpox creation curving darted de debating decorative diagram discouraged
disliked displayed dissected dived diving domed dripped dukes dystopian eight-year-old eights endlessly eradicated
experimenters experimenting faded fairy fantasy feathered fellow fighter fighters filth filthy fisher flapping flasks
flyers founder frequent frightening gathers geocentric gold-mounted graph great-great-grandchildren greatness greed
growers gunfire gutenberg's helpers hinting hints horrors hummed hyperinflation ideal idle impressed infecting inked
inspector insult insure intense investigators involving jr killing kneeling leaflets leaned leashes left-handed
license lifetimes lowering lumps magical marchers master's miasma milked milkmaid mob modeled mysteriously nation's
nears newly nodding nonliving one-room organizers oysters paraded pasteurization patchwork pavilion peacefully
photographed photographer pilot's plane's pneumonia popes powders prophets protesters publicly publisher r radar
rebirth recorder recorders recordings removal resistant retelling riches riverbanks robota rounded runway's s-shaped
sabotage salesman sanding savers sayings scars seamstress seashore seated seize selection sentenced separating shock
shoemaker shorten sketching slavery smudging so-called soar sorcerer sorcerer's sores sorting splendid spur start-up
step-by-step storytellers stoves strawberries streamlines strung stunt swan swarmed sweet-smelling swimmer taxing
teachings tellers ten-dollar thirty-minute tilt today's torture toughest tractor transfer trickle u unharmed unjust
unrolled vacca vaccination violently walkers war's warrior weighing wheelbarrows widow workhouse wreckage wrench x
`;

/** lexicon7 are the words of the passages of grade 7 outside the shared lexicon. */
export const lexicon7: readonly LexiconEntry[] = words
  .split(/\s+/)
  .filter((word) => word !== "")
  .map((word) => ({ word }));
