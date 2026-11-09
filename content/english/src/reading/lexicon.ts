import type { LexiconEntry } from "@ga/content";

// The words that the reading units may use. Most are words a reader of grades 3 to 5 knows; the academic words are
// taught by their topic. Domain terms that a passage explains are listed in the passage as glossed, and those a later
// passage uses again are here, since the passage that explained them comes first in its unit.

/** known lists, separated by spaces, the spellings a reader of the passages is assumed to know. */
const known = `
a about above across add adds after again against ago air all allowed almost alone along alphabet also always
amazing amount amounts an ancient and angles animal animals another answer any anything apart are area arguments
army around as at attract autumn away baby back bakers ball balls banks bare barely bark based baskets be beach
bean beans became because becomes been beer bees beets before began begin begins behind being believe believed
below bends beneath beside between beyond big bigger billions birds biting bits black blades blocks bloom blows
blue boat boats bodies bones borders both bottom bowl branches bread break breaks breath breathe breeze bricks
bright bring broad broken brothers brought brown brush brushes bubbling bucket buds build builders building
buildings built bump bundles bury businesses busy but butterflies buy by calendar called came can cannot car carbon
care cared carried carries carrots carry carrying carve cat catch catches cattle celery chain change changes
changing chemicals children chlorophyll cities city civilization civilizations clean clearly climb close closely
closet cloth cloud clouds coat coconut code cold colder collected color colored coloring colors come comes
completely condenses connected cooking cool cooled cooler cools copper cotton could country covered covers cracked
creeps crops crowded crowds crowns cube cup cups current curves cut cycle damp dark day days dead deal deep deepest
depend depended describe desert deserts detail did die different digging dinner dioxide direction disappear
disappeared disappears dish distances ditches divided do doctors does doing dot dots down downhill drag drawing
dressed dried dries drifts drink drinking drinks drip dripping droops drop drops dry dug dumped during duties each
earliest early earth earth's easier easily eat eating eats else employed empties empty end ended ends energy enough
enter enters evaporate evaporates evaporation even ever every everyone everything example existed factory fades
fall fallen falls families famous far farm farmed farmers farming farmland farms farther fast faster feathery feed
feet fell fences festival festivals fetch fetched few field fields filled fills finally find fine firm first fish
flat flatter flies float flood flood's flower flowers flowing flows fly followed food foods for form formed found
four fox freeze freezes fresh from front frozen fruit fruits full fur gallons gas gathered gave get gets gift give
gives glass go god god's gods goes going gone good goods government grain grasses great greatest green grew grip
ground groundwater group grow growing grows growth had hail hairs half handed hangs happen happened happens hard
harmed harvest harvests has have he heads healing healthy heat heavier heavy held helicopter help helped helps
hidden high higher highway hill him his history hold holds hole holes homes honey hooks hot hours household houses
how huge human hundred hundreds hunt hurried ice ideas if illnesses imagine important in inches ink insects inside
instead into is it its itself jar job jobs join joins journey judged juice juicy just keep keeping keeps kept kind
king knock know knows laid lake lakes land large larger largest last lasted late later laws layer layers leaders
leaf leak learning leave leaves led left less let letters lie lies life lift light like link linked liquid little
live lived lives living load loads locked long longer longest look looked looks lose loses losing lot love low
lunch machine machines made magnifying main make makes making managed many maples market mass material math matters
may meaning means meant measure meat melting melts men message miles million minerals missing mixed molds moment
month months mopped more morning most mountain mountains mouth move moved moves moving much mud must named narrow
nature near need needed needles needs nests never never-ending new next night nights ninety-seven no north northern
not now oaks ocean oceans of off officials often old on once one onions only onto open opens opposite or orange
order ordinary other others our out outside over own owned oxygen packed paid palaces pale paper papyrus parent
part partly parts pass people pharaoh picks pictures piece pieces piles pines place places plain planned plant
plant's planted plants plate played please plenty plow points pole poles pollen poor pot potatoes pots pour poured
powder power powerful prayed pressed presses projects protect protecting puddle puddles pull pump push pushed
pushes put pyramids rabbit rain rained rains rainstorm rainy raise ramps ran rare reach reaches read ready really
reason records red refill refrigerator remarkable remember replace respected rest rests result rich right rings
rise rises rising river river's rivers road roads rock rocks roof room root roots rose rubs rule ruled ruler run
running runs rushed rushes sail sailors salt salty same sand saved saves saving saw scale scared scholars
scientists scrapes scribes sea season seasons second see seed seed's seeds seem seeps sellers send servant set
seven shade shape shapes share sharp sheets shell shelter shoot shorter show showed shower shrink shrinks side
sides sidewalk sign signals signs simple simply single sisters sit six sizes skilled sky slaves sleds slept slides
slow slowly slows small smaller smelling smells smoke snow snowflake snowflakes so soak soaks socks soft soil solid
some something sometimes somewhere soon sooner sounds soup south space spaces special spell spilled spin spines
spinning splits sponge spread spring sprout stage stalk stand start starts statue stay stayed stays steam stem
stems sticks still stone stones stood stop store stored storehouse stores storm straight straw stream streams
stretches strip strips strong studied study such suffer sugar summer sun sunlight sunny sunshine supply surface
survive sweet swell swells systems take takes taking tall taller tallest tank tap taxes teeth tell temperature
temple temples than thank that the their theirs them then there these they thick thin thing things third thirsty
this those though thought thousand thousands three through tied time tiny to today together too took tools top tops
touch touches toward town toy trade traded traffic trained trash travel traveling travels treat tree trees trickles
trip trunk tube tubes turn turned turning turns twelve two umbrella under until up upside upward us use used uses
using usually valleys vapor vegetables very villagers villages vines visit wait walk walks walls war warm warmed
warms was wash washed washing waste watch watched water waxy way ways we weak web week weeks weigh weight well
wells went were wet what whatever wheat when where which while white who whole whose why wide wider will wind
window winds wings winter winters with within without women wooden words wore work worked workers works world would
wounds write writers writing writings written wrote year years yellow yet you young younger your yourself`;

/** academic are the words of the first academic word list that the passages use, with their spellings. */
const academic: readonly LexiconEntry[] = [
  { word: "compare", forms: ["compared", "compares", "comparing"], topic: "academic-words-1" },
  { word: "estimate", forms: ["estimated", "estimates", "estimating"], topic: "academic-words-1" },
  { word: "evidence", topic: "academic-words-1" },
  { word: "source", forms: ["sources"], topic: "academic-words-1" },
];

/** englishLexicon is the lexicon of the English passages. */
export const englishLexicon: readonly LexiconEntry[] = [
  ...known
    .split(/\s+/)
    .filter((word) => word !== "")
    .map((word) => ({ word })),
  ...academic,
];
