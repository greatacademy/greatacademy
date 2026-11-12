// Grade 6: the words the passages of the course use that the lexicon of the earlier packs does not list. Each
// spelling is an entry of its own, so that a spelling another pack already lists does not hide the others.

import type { LexiconEntry } from "@ga/content";

const words = `
accidental airplane almond almonds backyard barley beehives beekeepers best-known blasting blight booed bounced
british cabinmates campers captures carton cell's cellulose cheek chord circulatory clothed clumsy colliding
competitive confuse congratulates continental convergent cornfield countryside crooked crossbar crowding crumbled
crumples cuneiform curly dad's digestive disc divergent division dock doomsday eligibility embarrassing endless epic
erupt erupting evaporated fast-food favoring five-story fluid footballer forfeits fort french genetics gentlemen
german gland grandfather's grinding guaranteed hallway hammurabi's handlebars happily helmet herbs high-yield holiest
honeycomb horseshoe indoor initials intestines jars jelly-like jewelry jolt judge's k kits lab landmass landowners
latin leftovers lettuce m mapped marrow memorials millimeters mites molecules mud-brick offerings officially
old-fashioned orphans outdoor outsider packets pads pasta peas persian person-to-person pest pianist pinch pollinators
potters puffs pumping racket recessive recital recovery refrigerated rejoice replay replays rescheduled resemblances
respiratory restless ribosomes risked rotten rounder rounds rudely runner's satisfying scheduled schoolboy's
schoolboys secretly seismogram seismometer seismometers shoebox shrine single-celled someone's sonata spy stairways
starter starvation station's steamed storerooms strawberry sturdy tackle tar taunt teased tectonic tectonics temple's
terrified toffee tonnes topple traces trillion twelve-year-old twenty-year-old umpire umpires unaccepted undersides
unpredictable unsporting v varieties wedge wedge-shaped wedges well-paid wildflowers wrapper
`;

/** lexicon6 are the words of the passages of grade 6 outside the shared lexicon. */
export const lexicon6: readonly LexiconEntry[] = words
  .split(/\s+/)
  .filter((word) => word !== "")
  .map((word) => ({ word }));
