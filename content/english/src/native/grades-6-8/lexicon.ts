// Grades 6 to 8: the words the passages of the course use that the lexicon of the skill courses does not list. Each
// spelling is an entry of its own, so that a spelling another pack already lists does not hide the others.

import type { LexiconEntry } from "@ga/content";

const words = `
abused abyss according account activities admiral advised affect affects africa airplanes aisle alarms algae
all-gifted ambitious america amphitheater ancestors anchovies angrier anyone's anyway appear appoint approaches arch
archer arches arena argued armchair armies arranged arrogance asia assemblies assistant astonishing astronomers awful
awning axe bacteria balanced banned barbarians barrens base bat baths battle bay beauty beings belief belongs benefit
benefits billion blazing blew block blooms blown bother boundaries brave breeding brutal bulb bulbs burned burst
business cabin's calcium calculations calf calves camel candidate candlelight candles canoe canoes canvas capital caps
captains captured carbon-filament careless cases cast casting cathedral celebrating celebrities central centuries
century chained challenge challenged chamber championship channel character chariot charts chewed chicks china chip
city's clay cleanups clearest clever cleverness clings clothing collapse collapsed collectors colorful comfort command
commanded communities companies compete complete complicated compromise conditions conflict connections conquer
consider considered constitutions construction contain contest continent controlled controls conversation copepods
copied copies copy countless courage crabs craft crashing create created creature creatures crept crew crib crop cruel
cruelly cruelty crush crushing currents curved customs cylinder daily damaged dangers dares daring darkened dashes
daylight deaf death debate decades decisions deck defeated defending demands depth descended descent describes
describing designed desperate developed device dialect diaries diary dictator digital directions discovered
discoveries disease diseases disguise disguised displeased distance distant divers double dove downstream dozen dozens
drains dramatic drift drifted drifters drilling eastern effort elected elections electronic elevator embarrassed
empire's emptied engineering engineers enormous entered entertainment entirely entrance entrances entry envy equal
errors eruption europe european eventually everyday exact exhausted experienced experiments explained explains
exploded explorer extends extreme faint fame fastest-growing fault favored feared females fennel fibers fierce
fifty-year fighting filament filaments filed filmmaker fired fishermen fishers fitted flags flames flashed flaw fled
fleeing fleet fleets fliers floating fluttered forbid forced forecast forehead forgive fortune frightened furious
garage gasoline generals generators genius germany ghosts giant's gliders glory glowed goalkeeper goddess goldsmith
grandson grapes gravel graze grief guarded guessed gulls hang harming harms heading headline headphones healed height
hero heroes hesitated hire historian historians hollow honored hopeful horizon horror hose humans humpback humpbacks
hunger ignoring illness improvements inch income india industrial inns inspired instant instructions instrument
inventor inward jealous jellyfish jewel jokes journeyed joy judge judges kelp killed kindly king's kingdom kings
knowledge krill labor lack ladder landing lasting leadership leaked leaking leap leapt legend lid lime limited limits
loaded loaf loaves locker locomotives looted lowered magic magnetic maker mammal mankind marine marked marking marry
master mathematician maze mechanic mechanical memorized memory merchants messengers meters microscope midday
milestones mills mines mining misremembered mission mistakes mobile mold mourns movable mrs mulberry multiplied
murdered musical myth mythology national nations navigation neighbor's net nets newspapers nod nurseries obedient
obeyed oil-based operator operators opponents opposed orcas ordered original other's otter otters overfishing overhead
pacific paintings partnership partway passage patience patricians patrolling paved paving pea peak pellets people's
per photosynthesis picturing piled pillars pilot pine pinned pipes piston plant-like platinum plebeians plentiful
plotted plunge politely pollution polyp pomegranate ponies population populations porcelain ports powered practical
pretended pride primary princess printers prisoners produce program programs proudly proved province pumped pumps
punishment quarreled raced railways rainforests rainwater rake raked rays reaching realized recover recovered
recycling reduce reefs rejoined relationship releasing relied religion remain remained reminded removed replaying
rescue resist resistance results revenge revolt revolution rider rights ripple rivals robbers role root-like ropes rot
rotted route rows ruin s sacrifice sailed sailing sailor salmon sank sardines satellite scattered scenery scholar
scraps scratched seabed seabirds seafood sealed seals searched seating seawater seaweed seized separate separated
settled shapeless shaping she-wolf shepherd shipwreck shivered shopkeepers shot shrimp-like shrug shrugged sickness
sideline silk simpler sketchbook skill slammed sled slightly slogans slope sloped slowed smartphone smartphones snacks
snails soared softened soldiers solution solving somehow son's sorrow spare species specks spectators sphere spice
spices spiny spotted spray spreading stalks starve state's states steady steamships steel steep steered strapped
stretched stretching striking stroke structure structures struggled struggling student's stumbled submarine success
suffered suffering sulking summit superhero supplies supported surprised surrounding survived survives survivors
sustainable swaying swirling swore swung symbol tangle tangled task tax teenage telegraph telegraphs telephone
telephones tentacles thermos thicker thirty-story thread threads threat three-legged thrill thrilled throne tiers
tightened tilts ton tons tore tough traders trail translators trapdoors trapped travelers tray treasure treated
trembling trench trenches trial trouble troubles truth tuna twenty-one-year-old twilight twin twins twist twisting
underwater underworld unfair united universe unlike urchin urchins urged vacuum variety vast version vessel veto
vibration vibrations vineyards violent visible voices voting wanderer warm-up warming warns wasted waters wax wealthy
weave weaver weaving weeded weeds weeping weighed western whistle whom widely winding wine wiping withered wonder
world's would-be wove wrappers wrecked wrinkled yesterday's
`;

/** lexicon68 are the words of the passages of grades 6 to 8 outside the shared lexicon. */
export const lexicon68: readonly LexiconEntry[] = words
  .split(/\s+/)
  .filter((word) => word !== "")
  .map((word) => ({ word }));
