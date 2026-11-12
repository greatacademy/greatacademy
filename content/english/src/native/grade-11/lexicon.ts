// Grade 11: the words the passages of the course use that the lexicon of the earlier packs does not list. Each
// spelling is an entry of its own, so that a spelling another pack already lists does not hide the others.

import type { LexiconEntry } from "@ga/content";

const words = `
abducted acres aggressive alabama alger's alignment amusement answerable assassinated australia awe balconies bathe
bathing bicycles bilingualism birmingham's blasted bliss blouses bombingham braceros brake brazo brother's caged
calculator carriages childcare chinatown chrysanthemums clerks code-switching coffin consistency consult contractors
cooling-off couch david deactivate decent degrades delhi desperately desperation disrespect docked dreamers driveway
dwarfed earners earnings educator egotism enclosed enlarged euros exceptional excuse exhausting exits expansion
expelled eyeball fading farmworker farmworkers filing filmed finances fir firebomb first-aid fished fists flagged
footpath forestry formerly forty-hour fourteen-year-old francisco's fraudulent frighten gangway garment gazing ghana
gifted gospel gothic granddaughter grandparent's grape grasshoppers groceries groves guaranteeing hardworking heap
henry hermits hit-and-run hoe humiliating hundred-foot iceland's icelanders idleness illegally indiana institute
insulated insulted intend jackpot japan's kentucky laundries legally levitt's lighter-skinned lightweight linguists
linking longed loom's loon lotteries lovingly low-interest loyalties machine's management manslaughter medalist
migrations misidentify mobs morocco musician's nashville nonviolence notting novelists nursed obeying obeys openness
outlasted outsiders overseas patterned pavement pecks pensive pickers pictured plowing popularity porches presence
pressured programmed prosperous provocative purest qiaopi rabbi rabbi's racist railroads rampage rating ratings
reassuring rebuilding reclaiming recommit recurring redlining reeled regained regressive reigning rematch restrooms
rider's robes rungs sabbath salute sausages sawmill scalp scandal segregated sequoia shelley's shinrin-yoku shortly
sister's six-game sixty-seven-year-old slashed slung smallness smashing sociologist sod southerners sporting
sprinklers sprinters stake storing studio surpass swerve synagogue t tactics tao's temporarily third-culture thirties
three-generation thrilling thyself toilets tongues tranquility transcendentalism travelling turkey twelve-hour
twenty-seven-year-old two-parent typesetters unauthorized unfounded union's unjustly unnecessary unpretentious
unreasonable unsettled unstated untimely unused uplifts usefulness valued verily viewpoint walden warts wasteland
well-kept whoso
`;

/** lexicon11 are the words of the passages of grade 11 outside the shared lexicon. */
export const lexicon11: readonly LexiconEntry[] = words
  .split(/\s+/)
  .filter((word) => word !== "")
  .map((word) => ({ word }));
