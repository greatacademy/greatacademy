// Grade 5: the words the passages of the course use that the lexicon of the skill courses does not list. Each
// spelling is an entry of its own, so that a spelling another pack already lists does not hide the others.

import type { LexiconEntry } from "@ga/content";

const words = `
adeyemi adeyemi's affairs ah albany alpha altar amara american americas amoeba anchorages anchored andes angrily
antarctica antonie anya anya's arched aristotle arthur ashes ashore athena athenian athens automobile aztec bacterium
batter bce ben ben's beta bible bingham birdseed blade blankets blasts blob bookshelf bottle's bowling boxing
brand-new breaths browns brunelleschi buffalo bulge bundled c california campsite captain capturing carrier carter
celsius chen chicago chinampa chinampas chun city-state city-states cleared clipped clung colds collars corinthian
cork cortés creeping crisscrossing crowned cubes cushions custodian darts democritus directing director's discus
doorway doric dough dragged dragon's drain driftwood duct dunn dutch edward egg's electrons elena ellis elm engr
engraving enslaved euclid europeans evenly excitement faisal fanciest ferreira ferreira's fifth-year filippo firmly
flakes flaky flap flashlights floats florence flu foamy folding founded francisco fu furry fuzz fuzzy gertie glued
gluing glyphs gorges grandma's granny grapevines greece greek greek-style greeks groan guide's gulps gut half-circles
hana hangers hanging hannah hardness harlow hawk head-on heals hebei hellenes helper hernán hillsides himalayas hiram
hook inca ines inflatable inland inscriptions ionic isabel italy jaguar jelly jenner joe joseph kai keystone khipu
khipukamayuq khipus kit kneaded knot knots laconia laconic lan lark latch ledge leeuwenhoek lena lena's lewis li
lifeguard lifeguard's lin's locks log lottery lucas lucia luis machu mae mainland malia mama mango marco margaret
maria maria's markers marketplace mats maya mediterranean mei mended mexico min-jun miners mortar mountainside mules
mushroom mushrooms mutualism nadia nail nailed naples narrows nibble nibbled nibbles nicknamed nitrogen nonsense
oculus okafor okeke olive olympia olympic ooze open-air openings owen paddle paddled padlock pail pantheon papa
paramecium parthenon penicillin pentathlon perch perched perfume peru picchu piers piling pin pins pirate plato
plato's poisonous popcorn pops prickly priests priya properly punched pythagoras quilts raccoon radiator rag rail
railroad railway ranger's rangers rationed reacts rectangle relay representatives rescuers retold retreat rigged
riverbank roaring rolled-up roman romans rome rosa's rotting ruby runny ruth s's sacks sacramento sagged sags sailboat
sails san schoolhouse schooner scold scooped scrubbed searchers seasick see-through sewing sheepishly sheltering
shopkeeper shortcut shredded sieve sips sixteen-story slapping slates smallpox sneak snowbank socrates sofia
sole soot sos sounded spanish spans sparta spartan spartans spears spiraling spoonful spore spores spots squash
squeezed squirrel stakes stamped steamy steeply stiff stiffer stir stirring stonework storehouses strep stuffed
sunbeam surrounds suspension swampy swelled tacoma tag tenochtitlan terraced terribly tess thinker thomas threatened
tikal tinted toast toasted tomas torch tortilla trimmed trophy troublemakers truce tucked tuning unreinforced upright
uselessly van vandals vinegar volcanic wading walkways washington weakened well-fed wheeled whiteout wicks wildly
windowsill wipe wiped wobbly wonderfully worksheet wound wreath wrestle wrestling xiao yogurt york yunnan zara zeus
zhaozhou
`;

/** lexicon5 are the words of the passages of grade 5 outside the shared lexicon. */
export const lexicon5: readonly LexiconEntry[] = words
  .split(/\s+/)
  .filter((word) => word !== "")
  .map((word) => ({ word }));
