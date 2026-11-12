// Grade 8: the words the passages of the course use that the lexicon of the earlier packs does not list. Each
// spelling is an entry of its own, so that a spelling another pack already lists does not hide the others.

import type { LexiconEntry } from "@ga/content";

const words = `
abandons abbey acidic adrenaline advancing ale anon attacking barracks battlement belongings bestseller biologists
blackdamp blackened blended blues boarded boat's boatman bolívar's boo botanist britain's buckets cabins campaigner
cap carriage cartoons chimneys clergy clown clustered collar consulate cottages county cracking creoles crocodile
crouched crumbling cushion cuttings dagger damned dared devises dinosaurs disobey disrupted disturb disturbed doctor's
e eighteen-year-old elder end-permian endowed entering ere erupted estate estates fines firedamp fireplace flame
floorboards flowering foolishness fools forearm fortunate four-legged france's freed frightens gang gangs gentleman
geologically geologists ghostly gin great-great-grandfather gross h half-living hanged hard-shelled hardened hast
haste heaps heath hereafter hideous hie histories hot-tempered housekeeper inspected inspectors intensely
interviewer's issued jazz jean-jacques jenny keeper keyhole kindness knitters knitting knocks l lameness landlords
lizard logbook lovers mad mammoth's mania measurably medallion memoirs migrant migrants misery mocked monster moor
mudflats narrators outnumbered overseers peacetime pennies phosphorus phossy pipe pistol pleasures plesiosaur ploughed
potter pretending prickle prince productions profitable punishable pursuit quarrelled quickens radioactive rage ranger
rarer reappears rediscovered relative's repealed representation resented roamed saint-domingue sane saws scare
schooling scream seaside second-class seek seeking self-evident separation severe sewn shadowy shaft shafts shalt
sharecroppers shrank silently skillful skillfully smashed sprung stabs stacked staged statue's sticking stinking
stormed strangest strikers suffocate sunlit tags taxation taxed terror thatched thee thirty-three-year-old thou
threatening timetables tiredness tobacco trampled transferred transit trapping travelled tricked trousers truths
two-part unalienable uncovered unhealthiest unpleasant unreliable upstart vampire vampires velvet verbs vision wagons
wallpaper warriors wealthiest weaver's wherefore whistling wild-goose wit witches woolly wordplay working-class
wronged
`;

/** lexicon8 are the words of the passages of grade 8 outside the shared lexicon. */
export const lexicon8: readonly LexiconEntry[] = words
  .split(/\s+/)
  .filter((word) => word !== "")
  .map((word) => ({ word }));
