// Grade 4: the words the passages of the course use that the other lexicons do not list. Each spelling is an entry
// of its own, so that a spelling another pack already lists does not hide the others.

import type { LexiconEntry } from "@ga/content";

const words = `
apricots archers arrows attackers backs bandits bang barrels bartered bath battlefields beard beautifully beeping
bird's blacksmiths blind blinks blocked bluish blurry bogs bolts bounce bowing brakes brighten brightening broom
bucked bullets bulls bundle calmly camels campfire captors caribou carpenters carpets carving catapult caterpillar
ceiling ceilings cellars cereal chapel charcoal chewing chews chuckling cinnamon circled cloves coaster cocoon
cocoons coil comb combed courtyard cowhand cowhands craftspeople crawled daytime deadly dentist's detector dipping
disappointing ditch doubtfully dusk eager errands extra-large extremes eyebrow facing fairs far-off faraway
farmhouse feast feasted feasting feasts fennec fined fingertip firewood flea fleas flippers flowerpot folds folk
fool forbidden forest's frames fresco frosted frowning furs galls gardener geese ginger glassmaking glide gobbled
goodness goose gourd grabs grand granted grazed grinds grinning groaning gulping gunpowder handprints harbors hatch
hay heater heavenly heavens hemp herders hmm holy hooked hopped hornets horrified horseback hum hut huts jackrabbit
jaguars jaw jawbone jerks journeying journeyman joyful juggle juggled juggling kettle kilograms knight's ladders
lances lasso leaky leaped leaps lentils leopard leopard's lodge loosens lord lord's lords lunchroom melons messenger
metalwork mist moaning modeling moss mosses moth musk nails navy neatly nervously nested nutmeg offstage ohhh
opposites outward ox oxen paces paddles paler palm palms panels papermaking parachutes patches pausing paws peaches
peeked peeking perfumes pit plaster pleats pluck plugged poke polished pose prairie precious pretend puff pulp
pumpkin puppets python racing rags reappear reluctantly reptile riders riskier roar roller rowboat royal salted
sandstorm scraped sculptor sculptors seal self-portrait seller sharpened shocked shoemakers shrimp sighing silkworm
silkworms sillier sinks sip skins skull slanted sloth slowing smash snapped snaps soaked sockets solids spoiling
spoils spun stamping steer stew sting stony stormy sucked sundown supper swap swapping sweeping sweeten swellings
tadpoles tame tapped tens thinkers thirst tie toad tongs toothy toucans treasures treetops trick tricks troublesome
trunks twisted twister two-humped unplugging untangling unwind vibrates vibrating wagon walkway weavers webbed webs
whoa windmills wisely woman's wounded yarn yellower yellowish zoom
`;

/** lexicon4 are the words of the passages of grade 4 outside the other lexicons. */
export const lexicon4: readonly LexiconEntry[] = words
  .split(/\s+/)
  .filter((word) => word !== "")
  .map((word) => ({ word }));
