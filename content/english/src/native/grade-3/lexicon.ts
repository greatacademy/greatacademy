// Grade 3: the words the new passages of the course use that no other lexicon lists. Each spelling is an entry of its
// own, so that a spelling another pack already lists does not hide the others.

import type { LexiconEntry } from "@ga/content";

const words = `
alike angel apple's axes bagpipes bar bars bass bassoon baton bats beads bells bough bouncy brook bud buzzes
campground cane carpet caterpillars chessboard clap claps clarinet cling clip clips clover cooling crate crickets
crunched crunchy cup-shaped curled cymbals daffodils delight dip dipped dragons droop drooped drummed drummer
drummers electromagnet electromagnets evening's fireflies flickering fluffy freckles friend's gasped glared grey
growl gurgled ham hikers hissed hive's hooting horn horsehair hourglass humming keepers keys lawn lemonade lick logs
loosen looser loudness lovely lute magnet's magnetism maple mapmaker mittens mouthpiece needle nickel northeast oboe
peck penguins piccolo pies pitches pits plop plucks poked porridge raincoat rakes raspberry riverbed robins rod
ruffle sake sandpaper scrapyards shakers shed shimmering shoots shovels sigh sleepy sliced slop snakeskin snare
soggy soles sprayed sprinkle squeak squeaks squeezing squelched stair starfish starred steeper stirred swords
tambourines taming taps thud ticking tightening tighter till timpani tires trombone tuba tug tulip twinkles twirled
twittering unbalanced uneasily unwound valves viola weary whiteboards wink winter's
`;

/** lexicon3 are the words of the new passages of grade 3 outside every other lexicon. */
export const lexicon3: readonly LexiconEntry[] = words
  .split(/\s+/)
  .filter((word) => word !== "")
  .map((word) => ({ word }));
