// Grades 9 to 12: the words the passages of the course use that the lexicon of the skill courses and the earlier
// bands does not list. Each spelling is an entry of its own, so that a spelling another pack already lists does not
// hide the others.

import type { LexiconEntry } from "@ga/content";

const words = `
absence absent absolutely accent accept accepting accounts accusations accused achievements act activists ad addressed
admired admitted admitting adopted advantages agreement agreements alight allied allowing aloud anapest anger
announced anymore apostrophe applauded applause appointed approval approved armed arrested arrivals articles ashamed
assembled assume assumed athletic atmosphere attacked attempting attempts attic audiences authority averaged award b
background backstage balances barons basic begged belonged benches blindness blinds bloody blossoms blur boarding
bonds book's booth braced brackets broadly bruised buyers cafeteria calming campaigners cancel cancer cannon
celebration censorship chains chalk challenges chant chanting characters charter chemists cherry chlorine choices
chores chorus's church's cicadas civics claims classical clauses cleansed climax clues coincidence colonial combined
comedies comedy commenting committed communist comparison competed complained complaints complex compose concerns
conclude conclusion conclusions concrete condemned condition conditioners confidence conflicts confounding confused
confusion congress connection consolation contained contains contests continue continues contradicts convincing
cooperation coordinate correctly council's counting country's court courtrooms courts cranes creates crime criminal
critics cross-country cross-examined crossword crumb cueing curfew curfews dancers daniel's deaths debts decks
declaration declare decoration decorations deepening defendant defenders defense defiance demand demanded demanding
democracies democracy deny denying deprived details dialogue difficulty dilemma diner diner's direct directs
disabilities disappointed disbelief discovers discussions disguises dishonesty dishwasher dismissed disorder
displaying disputes dissolved divides divorced double-blind doubts dramatically drown drowned drowning duffel dull
economies economy edited editing eighteenth-century elaborate elders elsewhere embarrassment embrace embraced embryo
emphasis end-stopped enforced enormously environmental equally escaping established excluded executive expectation
expectations experiment experimental exposition expressed expressions extremely fabric faced factor fade fairly
fallacies fallacy fashion faulty fears feature fifteen-year-old figure film films findings finest fisher's fitting
flexing flip flipped flipping foam forces formal formally fortunes fought founders fractions fragile free-verse
freedom freely frustrated fully funeral furnace furniture further gained gains galloping gateway gene general
generalization generations genes genuine germs ghost glance gossip gradually grandchildren grant grants grease
gripping grocery guards guilt guilty guns hadn't hammers handmade harsh hasty headlights headlines headscarf heaven
hillside hip hiss hominem honoring huh humblest humiliated humor humorous husband's iamb iambic iambs ideally
identical identities ignored image images imagination imitates immediately importance imported imprisoned incident
inciting includes including independence indifferent individual inefficient influence influenced ingredient inherit
innocent insight inspections install insured intelligence intended intention intimacy intimate investigate investors
invisible involve irony irrelevant irresponsible italics journal journals judgment judicial junior juror justice kills
kindergarten knit knitted knotted laboratories laces lady landlord lasts lawful lawmakers lease lecture legal ley liar
liberty limit limp lined listeners loans lobbied logical looms loop lying mainly majority man's marches marching
margin marriage marriages masks matched measurement medical meetings midwives millimeter minded minister minorities
misleading mistaken mock monstrous monthly motion mourn mouse's movement murder mutter myths narration narrator nausea
neglect negotiation newcomers nightingale nonviolent nor novel nuts o oar offended offers one's opportunities options
organizations overnight override overturn ozone padded painkillers painter pandemic paperwork parent-teacher
parliament particular particularly partition pause pauses peace peer-reviewed penalty penny pentameter perform
performance performed performers permanent permanently persecution person's personality phase philosopher phrase pie
pity playhouse poems poet poetry poets pools pope possibly poster posters pounding poverty powers praise praises
praising precisely precision predict prejudice present presented presents president pretends priest priest's prime
principle prison private procedures produced producing production proof proper property prophecy proposals prose
prosecution prosperity protagonist's protector provide publication publish punish punished punishments pure purpose
qualities quatrain quatrains queens railings random randomized rarely rate rats react reacted reader's readings
reality recalling recognition recognized recognizes refilled reflect reflection reflects reforms refrigerators
refusing regional regularity rehearsal rehearse reign reissued rejected release relief relieved religions renew rents
repay repetition replacements replications reporters represent requests researcher researchers reserved residents
resolution respectable respond responding reunited reveal revealed reversal reverse reverses review rhyme rhymes
rhyming rhythm ridiculous ringing rivalry roles rumor sack safety scene scenes scheme school's screw script secondhand
section self self-governing self-rule senior seriousness servants serving setting setup sex shall sharply shipped
shipping shipwrecks shortages shrugging sickle sideways silences site situation situations slam slave slippery smarter
sneakers soul spade specific sped speech speeches speeds spies spirit spirits spoil spokesman spotting squelch stack
stages stain staircase standard staring startling statement stating steadily steal stealing stove strangely stranger's
strengthened stressed stresses stupid style substance subtext suggestion suit suits sum suppliers surprisingly
surround surrounded suspect suspense sword syllable syllables sympathy talkative targets ten-hour tend tended tension
testified theory thinning threatens throughout timbers timing tipped toolbox townspeople traced tragedy's training
traits translating transportation treating trials triumph trochee trochees troubled truck trucks trust trusting
tyrants ultraviolet unanimous unchanged uncomfortable unconstitutional underneath undersigned undone unequal uneven
unfairly unit units unlovable unproven unsafe unsaid unseen unstoppable unstressed urging value vanished varies vase
vehicle verse verses versions victory villains violence volta wages waitress wars weakness weaknesses wealthier weep
wicked widows willing withdraw withdrawn witness witnesses wobble women's woven writer's wrongly year's yell you'd
`;

/** lexicon912 are the words of the passages of grades 9 to 12 outside the shared lexicon. */
export const lexicon912: readonly LexiconEntry[] = words
  .split(/\s+/)
  .filter((word) => word !== "")
  .map((word) => ({ word }));
