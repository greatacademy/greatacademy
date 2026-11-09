import type { LexiconEntry } from "@ga/content";

// The words that the reading units may use. Most are words a reader of grades 3 to 5 knows; the academic words are
// taught by their topic. Domain terms that a passage explains are listed in the passage as glossed, and those a later
// passage uses again are here, since the passage that explained them comes first in its unit.

/** known lists, separated by spaces, the spellings a reader of the passages is assumed to know. */
const known = `
a about above across action active add adds adult after afternoon again against ages ago ahead air alive all allowed
almost alone along alphabet also always amazing among amount amounts an ancient and angles animal animals ankle
another answer answers any anything anywhere apart are area areas arguments arm arms army around arrives arrow as
ash ask at attract autumn average away baby back backbone bad bag bakers ball balloon balloons balls banks bare
barely bark based baskets be beach bean beans beat beaten beats became because become becomes becoming bed been beer
bees beets before began begin begins behind being believe believed below bend bends beneath beside besides between
beyond big bigger billions birds biting bits bitter black blades blanket blink blocks blood bloom blowing blows blue
boat boats bodies body body's bolt bone bones book boom borders both bottle bottom bowl brain branch branches bread
break breaking breaks breath breathe breeze bricks bridges bright bring brings broad broken brothers brought brown
brush brushes bubbles bubbling bucket buds build builders building buildings builds built bump bundles burning
bursts bury bus businesses busy but butterflies buy by cable cage calendar call called calm came can cannot canyons
car carbon care cared carefully carried carries carrots carry carrying cars carve carved carves case cat catch
catches cattle celery cell cells center centimeters chain change changed changes changing charge charges cheese
chemicals chest children chlorophyll choose chop churns circle circles cities city civilization civilizations clean
clear clearly cliffs climate climates climb climbers climbing close closed closely closer closet cloth clothes cloud
clouds clue coal coast coasts coat coconut code coiled cold colder collect collected collecting collects color
colored coloring colors come comes coming common completely computers condenses connected continents control cooking
cool cooled cooler cools copper cord cords cotton cough could count counters country cover covered covering covers
crack cracked cracks crash creeps crops crowded crowds crowns crushed crust cube cup cups current curves cut cutting
cycle damage damp dangerous dark day days dead deal deep deeper deepest deliver delivery depend depended depends
describe desert deserts design destroy detail did die dies difference differences different differently digging
dinner dioxide direction directly dirt disappear disappeared disappears dish distances ditches divide divided do
doctors does doing door dot dots down downhill drag draw drawing dressed dried dries drifts drilled drink drinking
drinks drip dripping drive droops drop drops dry dug dumped during duties each ear earliest early ears earth earth's
earthquake earthquakes easier easily east eat eaten eating eats edges eggs electric electricity else employed
empties empty end ended ends energy enough enter enters equator evaporate evaporates evaporation even ever every
everyone everything exactly example exercise existed expands explode eye eyes face fact factories factory fades fall
fallen falling falls families famous far farm farmed farmers farming farmland farms farther fast faster feathery
feed feel feels feet fell fences festival festivals fetch fetched few field fields fifth fifty fight fights filled
fills finally find fine fingernails fingers fingertips finish fire firm first fish fist fit fits five flash
flashlight flat flatter flavor flies float flood flood's floor flop flow flower flowers flowing flows fly fold
folded follow followed food foods footprint for force forests forever form formed forming forms forth forward fossil
fossils found four fox frame freeze freezes fresh from front frozen fruit fruits fuel full fur gallons gas gases
gather gathered gave gentle gently get gets getting giant gift give gives glaciers glass glassy glowing go god god's
gods goes going gone good goods government grain grains grasses great greatest green greens grew grind grip ground
groundwater group groups grow growing grows growth had hail hair hairs half hand handed handles hands hangs happen
happened happens hard harden hardens harder harmed harmless harvest harvests has have having he heads heal healing
healthy hear hearing heart heat heated heats heavier heaviest heavy heel held helicopter help helped helpful helps
here hidden high higher highway hill him hinge his history hold holding holds hole holes homes honey hooks hot
hotter hour hours household houses how huge human hundred hundreds hunt hurried ice ideas if illnesses imaginary
imagine important in inches include incoming information ink inner insects inside instead instruments into iron is
islands it its itself january jar jerk job jobs join joined joins joint journey judged juice juices juicy jump jumps
just keep keeping keeps kept key kill kind kinds king kitchen kites knee knock know knows laid lake lakes land large
larger largest last lasted late later lava laws layer layers leaders leaf leafy leak leaning leans learn learned
learning least leave leaves led left less let lets letters level lie lies life lift lifted light lighter lightning
like limestone line lining link linked liquid little live lived lives living load loads lock locked long longer
longest look looked looks lose loses losing lost lot loud love low lower lowest lunch lung lungs machine machines
made magnifying main make makes making managed mantle many map maples maps mark market mass match material math
matter matters may mean meaning means meant measure measured measurements measures meat meet melted melting melts
memories men message messages metal microscopes middle might milder mile miles milk million millions minerals minute
missing mix mixed mixes molds moment month months mopped more morning most mostly mount mountain mountain's
mountains mouth move moved moves moving much mud muscle muscles must named narrow nature near need needed needles
needs nerve nerves nests never never-ending new newborn next night nights nine ninety-seven no north northern nose
not notice now nowhere oaks ocean oceans of off officials often oil old older on once one ones onions only onto open
opening opens opposite or orange order ordinary organ organs other others our out outer outside over own owned
oxygen packed page pages paid pain pair pairs palaces pale pan paper papyrus parent part partly partners parts pass
passages passes past pattern peach peaks people perfectly periods person pharaoh pick picks picture pictures piece
pieces pile piles pines place place's places plain planet planned plant plant's planted planting plants plate plates
played playing please plenty plow point points polar pole poles pollen pond poor pot potatoes pots pound pour poured
powder power powerful practice prayed press pressed presses pressure problems projects protect protected protecting
puddle puddles pull pulled pulls pump push pushed pushes pushing put puzzle pyramids quick quickly rabbit race races
rain rained rains rainstorm rainy raise ramps ran rare reach reaches read reading ready real really reason receives
record records red refill refrigerator related relaxes remains remarkable remember remembers repair repairs replace
respected rest rests result ribs rich richest rid right ring rings ripples rise risen rises rising river river's
rivers road roads rock rocks roof room rooster root roots rose rots rough rub rubs rug rugs rule ruled ruler run
running runs rushed rushes safe safely sail sailboats sailors salt salty same sand sandwich satellites saved saves
saving saw say scale scared scholars school scientists scrape scrapes screen scribes sea seas season seasons second
seconds sedimentary see seed seed's seeds seem seems seeping seeps sellers send sends sense senses sensitive servant
service set seven several shade shake shakes shaking shape shaped shapes share sharp sheet sheets shell shells
shelter shifts shines shoot short shorter shoulder show showed shower shows shrink shrinks shuffle sick side sides
sidewalk sight sign signals signs similar simple simply since single sisters sit sits six size sizes skies skilled
skin sky slant slaves sleds sleep slept slide slides sliding slopes slow slowly slows small smaller smell smelling
smells smoke smooth smoothly snow snowflake snowflakes snowmen so soak soaks soap sock socks soda soft soil solid
solves some something sometimes somewhere soon sooner sort sorts sound sounds soup sour south southern space spaces
spark special speed speeding spell spells spilled spin spines spinning spins split splits sponge spongy spread
spreads spring sprout squeeze squeezes stage stalk stand start starts stations statue stay stayed stays steam stem
stems sticks sticky still stomach stone stones stood stop stops store stored storehouse stores storm storms straight
straighten strange straw stream streams stretches stretchy strike strikes strip strips strong stronger strongest
stuck studied study studying stuffy such suddenly suffer sugar summer summers sun sunlight sunny sunshine supply
surface survive swallow sweat sweep sweet sweets swell swells swimming swing swirl system systems table take taken
takes taking tall taller tallest tank tanks tap taste taxes team teams tears teeth tell telling tells temperature
temple temples test than thank that the their theirs them then there these they thick thickest thin thing things
think thinking thinner thinnest third thirsty thirty this those though thought thousand thousands three throat throb
throbs through throwing thunder thunderstorm thunderstorms tied tightens tiles tilted time times tiny tissues to
today together toilet tomorrow tongue tonight too took tools toothpaste top tops toss touch touches toward towering
town toy trade traded traffic trained trap traps trash travel traveling travels treat tree trees trickles trillions
trip tropical trunk try tube tubes tunnels turn turned turning turns twelve twenty two typical umbrella under
underground until up upper upside upside-down upward urgent us use used useful uses using usual usually valley
valleys vane vapor vegetables very vessels villagers villages vines visit volcano volcanoes wait walk walks wall
walls want war warm warmed warmer warms warmth warn was wash washed washing waste wastes watch watched water waves
wavy waxy way ways we weak weakens weapons wear weather weathering web week weeks weigh weighs weight well wells
went were west wet what whatever wheat wheel when where wherever which while white who whole whose why wide wider
will win wind window winds windy wings winter winters wires with within without women wooden words wore work worked
workers working works world worms worn would wounds wrapped wrist write writers writing writings written wrote year
years yellow yet you young younger your yourself zone zones
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
  { word: "infer", forms: ["inferred", "infers"], topic: "academic-words-3" },
  { word: "interpret", forms: ["interpreted", "interpreting", "interprets"], topic: "academic-words-3" },
  { word: "method", forms: ["methods"], topic: "academic-words-3" },
  { word: "survey", forms: ["surveys"], topic: "academic-words-3" },
  { word: "data", topic: "academic-words-3" },
  { word: "occur", forms: ["occurred", "occurs"], topic: "academic-words-3" },
  { word: "require", forms: ["required", "requires"], topic: "academic-words-3" },
];

/** englishLexicon is the lexicon of the English passages. */
export const englishLexicon: readonly LexiconEntry[] = [
  ...known
    .split(/\s+/)
    .filter((word) => word !== "")
    .map((word) => ({ word })),
  ...academic,
];
