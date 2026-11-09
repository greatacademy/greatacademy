import type { LexiconEntry } from "@ga/content";

// The words that the reading units may use. Most are words a reader of grades 3 to 5 knows; the academic words are
// taught by their topic. Domain terms that a passage explains are listed in the passage as glossed, and those a later
// passage uses again are here, since the passage that explained them comes first in its unit.

/** known lists, separated by spaces, the spellings a reader of the passages is assumed to know. */
const known = `
a about above across action active add adds adult after afternoon again against ages ago ahead air alive all allowed
almost alone along alphabet also always amazing among amount amounts an ancient and angles animal animals ankle
another answer answers any anything anywhere apart are area areas arguments arm arms army around arrives arrow as
ask at attract autumn average away baby back backbone bad bag bakers ball balloon balloons balls banks bare barely
bark based baskets be beach bean beans beat beaten beats became because become becomes becoming bed been beer bees
beets before began begin begins behind being believe believed below bend bends beneath beside besides between beyond
big bigger billions birds biting bits bitter black blades blanket blink blocks blood bloom blowing blows blue boat
boats bodies body body's bolt bone bones boom borders both bottom bowl brain branch branches bread break breaks
breath breathe breeze bricks bright bring brings broad broken brothers brought brown brush brushes bubbling bucket
buds build builders building buildings built bump bundles burning bury bus businesses busy but butterflies buy by
cable cage calendar called calm came can cannot car carbon care cared carried carries carrots carry carrying cars
carve case cat catch catches cattle celery cell cells center chain change changed changes changing charge charges
cheese chemicals chest children chlorophyll chop churns circle cities city civilization civilizations clean clear
clearly climate climates climb climbers climbing close closely closer closet cloth clothes cloud clouds coal coast
coat coconut code coiled cold colder collected collects color colored coloring colors come comes coming common
completely computers condenses connected control cooking cool cooled cooler cools copper cord cords cotton cough
could count country cover covered covering covers cracked crash creeps crops crowded crowds crowns cube cup cups
current curves cut cycle damage damp dark day days dead deal deep deeper deepest deliver delivery depend depended
depends describe desert deserts destroy detail did die dies difference differences different differently digging
dinner dioxide direction directly disappear disappeared disappears dish distances ditches divide divided do doctors
does doing door dot dots down downhill drag drawing dressed dried dries drifts drink drinking drinks drip dripping
drive droops drop drops dry dug dumped during duties each ear earliest early ears earth earth's easier easily eat
eating eats eggs electric electricity else employed empties empty end ended ends energy enough enter enters equator
evaporate evaporates evaporation even ever every everyone everything example exercise existed expands eye eyes face
fact factories factory fades fall fallen falls families famous far farm farmed farmers farming farmland farms
farther fast faster feathery feed feel feet fell fences festival festivals fetch fetched few field fields fifth
fifty fight fights filled fills finally find fine fingers fingertips finish firm first fish fist fit fits five flash
flashlight flat flatter flavor flies float flood flood's floor flop flow flower flowers flowing flows fly follow
followed food foods for forests form formed forming forth found four fox frame freeze freezes fresh from front
frozen fruit fruits fuel full fur gallons gas gases gather gathered gave gently get gets getting giant gift give
gives glaciers glass go god god's gods goes going gone good goods government grain grains grasses great greatest
green greens grew grind grip ground groundwater group groups grow growing grows growth had hail hair hairs half hand
handed handles hands hangs happen happened happens hard harder harmed harmless harvest harvests has have having he
heads heal healing healthy hear hearing heart heat heated heats heavier heaviest heavy heel held helicopter help
helped helpful helps here hidden high higher highway hill him hinge his history hold holding holds hole holes homes
honey hooks hot hotter hour hours household houses how huge human hundred hundreds hunt hurried ice ideas if
illnesses imaginary imagine important in inches incoming information ink insects inside instead instruments into is
it its itself january jar jerk job jobs join joined joins joint journey judged juice juices juicy jump jumps just
keep keeping keeps kept key kill kind kinds king kites knee knock know knows laid lake lakes land large larger
largest last lasted late later laws layer layers leaders leaf leafy leak leaning leans learn learned learning least
leave leaves led left less let lets letters level lie lies life lift light lighter lightning like line lining link
linked liquid little live lived lives living load loads lock locked long longer longest look looked looks lose loses
losing lot loud love low lower lowest lunch lung lungs machine machines made magnifying main make makes making
managed many maples mark market mass material math matter matters may meaning means meant measure measured
measurements measures meat meet melting melts memories men message messages middle might milder mile miles milk
million millions minerals minute missing mix mixed mixes molds moment month months mopped more morning most mostly
mountain mountains mouth move moved moves moving much mud muscle muscles must named narrow nature near need needed
needles needs nerve nerves nests never never-ending new newborn next night nights nine ninety-seven no north
northern nose not notice now oaks ocean oceans of off officials often oil old on once one ones onions only onto open
opening opens opposite or orange order ordinary organ organs other others our out outside over own owned oxygen
packed paid pain pair pairs palaces pale pan paper papyrus parent part partly partners parts pass passages passes
pattern peaks people periods pharaoh picks picture pictures piece pieces piles pines place place's places plain
planned plant plant's planted planting plants plate played playing please plenty plow point points polar pole poles
pollen poor pot potatoes pots pour poured powder power powerful prayed press pressed presses pressure problems
projects protect protected protecting puddle puddles pull pulled pulls pump push pushed pushes put pyramids quick
quickly rabbit race rain rained rains rainstorm rainy raise ramps ran rare reach reaches read ready real really
reason receives records red refill refrigerator related relaxes remains remarkable remember remembers repair repairs
replace respected rest rests result ribs rich rid right rings rise risen rises rising river river's rivers road
roads rock rocks roof room rooster root roots rose rub rubs rug rule ruled ruler run running runs rushed rushes sail
sailboats sailors salt salty same sand sandwich satellites saved saves saving saw scale scared scholars school
scientists scrapes scribes sea season seasons second seconds see seed seed's seeds seem seems seeps sellers send
sends sense senses sensitive servant service set seven several shade shake shakes shaking shape shaped shapes share
sharp sheet sheets shell shelter shifts shines shoot short shorter shoulder show showed shower shows shrink shrinks
shuffle sick side sides sidewalk sight sign signals signs similar simple simply single sisters sit sits six size
sizes skies skilled skin sky slant slaves sleds sleep slept slides slow slowly slows small smaller smell smelling
smells smoke snow snowflake snowflakes snowmen so soak soaks soap sock socks soft soil solid solves some something
sometimes somewhere soon sooner sorts sound sounds soup sour south southern space spaces spark special speed
speeding spell spells spilled spin spines spinning spins split splits sponge spongy spread spreads spring sprout
squeeze squeezes stage stalk stand start starts stations statue stay stayed stays steam stem stems sticks still
stomach stone stones stood stop store stored storehouse stores storm storms straight straighten straw stream streams
stretches stretchy strikes strip strips strong stronger strongest studied study stuffy such suddenly suffer sugar
summer summers sun sunlight sunny sunshine supply surface survive swallow sweat sweep sweet sweets swell swells
swimming swing swirl system systems table take taken takes taking tall taller tallest tank tanks tap taste taxes
team teams tears teeth tell telling tells temperature temple temples than thank that the their theirs them then
there these they thick thickest thin thing things think thinking thinner thinnest third thirsty thirty this those
though thought thousand thousands three throat throb throbs through thunder thunderstorm thunderstorms tied tightens
tiles tilted time times tiny tissues to today together toilet tomorrow tongue tonight too took tools top tops toss
touch touches toward towering town toy trade traded traffic trained trap traps trash travel traveling travels treat
tree trees trickles trillions trip tropical trunk try tube tubes turn turned turning turns twelve twenty two typical
umbrella under until up upper upside upside-down upward urgent us use used useful uses using usual usually valley
valleys vane vapor vegetables very vessels villagers villages vines visit wait walk walks wall walls war warm warmed
warmer warms warmth was wash washed washing waste wastes watch watched water waves waxy way ways we weak weakens
weapons wear weather web week weeks weigh weighs weight well wells went were wet what whatever wheat wheel when
where wherever which while white who whole whose why wide wider will win wind window winds windy wings winter
winters wires with within without women wooden words wore work worked workers working works world would wounds
wrapped wrist write writers writing writings written wrote year years yellow yet you young younger your yourself
zone zones
`;

/** academic are the academic words that the passages use, with their spellings. */
const academic: readonly LexiconEntry[] = [
  { word: "compare", forms: ["compared", "compares", "comparing"], topic: "academic-words-1" },
  { word: "estimate", forms: ["estimated", "estimates", "estimating"], topic: "academic-words-1" },
  { word: "evidence", topic: "academic-words-1" },
  { word: "source", forms: ["sources"], topic: "academic-words-1" },
  { word: "cause", forms: ["caused", "causes", "causing"], topic: "academic-words-2" },
  { word: "effect", forms: ["effects"], topic: "academic-words-2" },
  { word: "process", forms: ["processes"], topic: "academic-words-2" },
  { word: "region", forms: ["region's", "regions"], topic: "academic-words-2" },
];

/** englishLexicon is the lexicon of the English passages. */
export const englishLexicon: readonly LexiconEntry[] = [
  ...known
    .split(/\s+/)
    .filter((word) => word !== "")
    .map((word) => ({ word })),
  ...academic,
];
