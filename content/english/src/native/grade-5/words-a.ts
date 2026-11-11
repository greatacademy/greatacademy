// Grade 5: the batches of words of the first five units, from water on Earth to ancient Greece.

import type { BatchSpec } from "../batch.ts";
import { batch } from "./batches.ts";

const oceansAndIce = batch(
  "words-of-oceans-and-ice",
  ["Words of Rivers, Oceans and Ice", "江河、海洋与冰的词"],
  ["rivers, oceans and ice", "江河、海洋与冰"],
  `
  glacier|a huge, slow river of ice|冰川|The ___ crept down the mountain valley by only a few centimeters each day.|Over thousands of years, the ___ carved a deep valley as its ice slid toward the sea.|Climbers crossed the frozen ___ roped together in case of hidden cracks in the ice.|basin,estuary|glaciers
  aquifer|a layer of rock or sand under the ground that holds water|含水层|The town's wells pump drinking water up from the ___ that lies deep below the farms.|Rain that seeps through the soil slowly refills the ___ hidden in the sandstone below.|If farmers pump too much water, the ___ under the valley can run dry.|groundwater,watershed|aquifers
  groundwater|water held under the ground in soil and rock|地下水|The well reaches down to ___ about thirty meters below the surface.|During the drought, the farmers depended on ___ because the streams had dried up.|Chemicals spilled on the soil can seep down and spoil the ___ that people drink.|freshwater,aquifer
  tide|the rise and fall of the sea twice a day|潮汐|At low ___, we walked out on the wet sand to look for crabs.|The ___ comes in twice a day and covers the rocks where we were sitting.|Fishing boats wait in the harbor until the high ___ lifts them off the mud.|estuary,basin|tides
  estuary|the wide mouth of a river, where it meets the sea|河口|In the ___, river water mixes with salty seawater.|Many young fish grow up in the calm, shallow ___ before swimming out to sea.|The river widens into a muddy ___ just before it reaches the ocean.|tributary,basin|estuaries
  freshwater|water that is not salty, as in rivers and most lakes|淡水|Only a tiny part of Earth's water is ___; most of it is salty.|Trout are ___ fish that live in cool rivers and lakes.|The island had no river, so the sailors collected rain as their only ___.|groundwater,salinity
  salinity|how salty water is|盐度|Scientists measured the ___ of the sea to see how much salt it held.|The Dead Sea's ___ is so high that swimmers float easily.|As river water flows into the bay, the ___ of the bay drops.|freshwater,tide
  watershed|all the land whose water drains into one river or lake|流域|Rain that falls anywhere in this ___ ends up in the same river.|Every town in the ___ shares the lake that its streams flow into.|A factory upstream can pollute the whole ___ below it.|tributary,aquifer|watersheds
  tributary|a smaller river that flows into a larger one|支流|The creek behind our school is a ___ of the big river.|Each ___ adds more water to the main river as it flows to the sea.|We canoed up a narrow ___ until it joined the wide river.|estuary,watershed|tributaries
  basin|a low, bowl-shaped area of land|盆地|The city sits in a ___ surrounded by mountains, so smoke gets trapped over it.|Water from the hills drains down into the low ___ below.|Long ago, a lake filled the whole ___, but now it is a dry, flat plain.|glacier,estuary|basins
  `,
);

const amounts = batch(
  "words-for-amounts-and-distribution",
  ["Words for Amounts and Shares", "表示数量与份额的词"],
  ["amounts and how things are shared out", "数量与分配"],
  `
  percent|out of every hundred|百分之……|About seventy ___ of Earth's surface is covered by water.|Only three ___ of the world's water is fresh.|The store gave us twenty ___ off the price of the bikes.|fraction,portion
  portion|a part or share of something|一部分，一份|Each child got a ___ of the pie, and nobody's slice was bigger.|A large ___ of the city's water comes from the mountains.|She saved a ___ of her pocket money every week.|remainder,majority|portions
  fraction|a part of a whole written as one number over another, such as one half|分数|Write three quarters as a ___ with a 3 on top and a 4 below.|One half is the ___ that means one of two equal parts.|To show one slice of a pizza cut into eight, write the ___ one eighth.|percent,minority|fractions
  majority|more than half of a group|大多数|The ___ of the class voted for a trip to the aquarium.|Since more than half agreed, the ___ won and the plan went ahead.|A ___ of the world's fresh water is frozen in ice.|minority,entire
  minority|less than half of a group|少数|Only a ___ of the students walk to school; most ride the bus.|A small ___ of the voters wanted to change the rule, so it stayed the same.|Left-handed people are a ___; most people are right-handed.|majority,fraction
  abundant|more than enough; plentiful|丰富的，充足的|Water is ___ in the rainforest, where it rains almost every day.|Fish were so ___ in the bay that the nets came up full.|After the wet spring, berries were ___ on every bush.|available,entire
  available|ready to be used or had|可用的，可获得的|Is there any clean water ___ at the campsite?|The tickets will be ___ online next Monday.|No seats were ___, so we stood at the back.|abundant,approximately
  approximately|about; close to, but not exactly|大约|The lake is ___ two kilometers wide.|We walked for ___ an hour before we found the waterfall.|The trip takes ___ three hours, give or take a few minutes.|entire,available
  entire|whole, with no part left out|整个的|It rained for the ___ weekend, from Friday night to Monday morning.|The flood covered the ___ village, so not one street was dry.|He ate the ___ pizza by himself and left none for us.|majority,abundant
  remainder|the part that is left over|剩余部分|We ate half of the cake and saved the ___ for tomorrow.|Ninety-seven percent of Earth's water is salty; the ___ is fresh.|After paying for lunch, she put the ___ of her money back in her pocket.|portion,minority
  `,
);

const cleanWater = batch(
  "words-of-clean-water",
  ["Words of Clean Water", "清洁用水的词"],
  ["keeping water clean and bringing it to homes", "保持水的清洁并把水送到家中"],
  `
  pollution|harmful waste that makes air, water or land dirty|污染|Oil leaking from the ships caused ___ that killed many seabirds.|The river's ___ came from a factory that dumped its waste into it.|Picking up litter on the beach helps to reduce ___.|sewage,drainage
  filter|to pass something through a material that catches the dirt in it|过滤|We used sand and charcoal to ___ the muddy water.|This machine can ___ out bits of dirt too small to see.|Campers ___ stream water through a cloth before they boil it.|purify,pipeline|filters,filtered
  purify|to make completely clean and safe|净化|Boiling water for one minute will ___ it by killing the germs in it.|The water plant uses sunlight and special chemicals to ___ the city's water.|Tablets that ___ water are useful on long hikes.|filter,toxic|purifies,purified
  sewage|dirty water and waste from toilets and drains|污水|Pipes carry ___ away from homes to a treatment plant.|After the storm, ___ overflowed into the streets and made people sick.|Workers clean the ___ before the water goes back into the river.|pollution,plumbing
  pipeline|a long line of pipes that carries water, oil or gas a great distance|管道|A ___ carries water from the mountain lake to the city, a hundred kilometers away.|Workers dug a long trench for the new oil ___.|The ___ crossed the desert to bring water to the town.|plumbing,faucet|pipelines
  toxic|poisonous; harmful to living things|有毒的|Do not drink that water, because it is ___.|The old paint gave off ___ fumes that made us cough.|Some mushrooms are ___ and can make you very ill.|pollution,sewage
  desalination|taking the salt out of seawater so people can drink it|海水淡化|Some dry countries use ___ to turn seawater into drinking water.|The new ___ plant on the coast takes the salt out of seawater.|Removing salt by ___ takes a lot of energy.|drainage,pollution
  plumbing|the pipes and taps inside a building|（建筑内的）管道系统|The old ___ in the house leaked, so we called a plumber.|The school's ___ was so old that the pipes burst in winter.|Before indoor ___, people carried water from a well.|pipeline,sewage
  faucet|a tap that turns water on and off|水龙头|Turn off the ___ while you brush your teeth.|The kitchen ___ dripped all night.|Hot water came out of the ___ marked with a red dot.|filter,pipeline|faucets
  drainage|the way water flows away from a place|排水|Good ___ stops rain from flooding the field.|The ___ ditches beside the road carried the storm water away.|Plants rot in pots with poor ___ because the water cannot escape.|sewage,plumbing
  `,
);

const matter = batch(
  "words-of-matter",
  ["Words of Matter", "物质的词"],
  ["matter and what it is made of", "物质及其构成"],
  `
  particle|a very tiny piece of matter|微粒|Every ___ of dust in the sunbeam was far too small to pick up.|In a gas, each ___ moves fast and far from the others.|A single ___ of soot floated up from the candle.|substance,mass|particles
  mass|how much matter something holds|质量|A bowling ball has more ___ than a beach ball of the same size.|We measured the ___ of the rock on a balance.|The ___ of an object stays the same on the moon, even though it weighs less there.|volume,property
  volume|how much space something takes up|体积|We poured the water into a measuring cup to find its ___.|A balloon's ___ grows as you blow air into it.|The box had a ___ of one thousand cubic centimeters.|mass,particle
  property|a quality that describes a material, such as its color or hardness|性质，特性|Hardness is a ___ that tells how easily a material scratches.|One ___ of metal is that it lets heat pass through it quickly.|A shiny yellow color is one ___ of gold.|substance,mixture|properties
  dissolve|to mix into a liquid until you cannot see it any more|溶解|Stir the sugar until it begins to ___ in the tea.|Salt will ___ in warm water faster than in cold water.|Sand does not ___ in water; it sinks to the bottom.|evaporate,mixture|dissolves,dissolved
  mixture|two or more things put together that can be separated again|混合物|Trail mix is a ___ of nuts, raisins and seeds.|We separated the ___ of sand and iron filings with a magnet.|A salad is a ___, since you can pick out each vegetable.|solution,substance|mixtures
  solution|a liquid with something dissolved evenly through it|溶液|Salt water is a ___ because the salt is spread evenly through the water.|The nurse cleaned the cut with a weak ___ of salt and water.|When the sugar disappeared, the water and sugar had formed a ___.|mixture,particle|solutions
  substance|a particular kind of matter|物质|Water is a ___ that can be solid, liquid or gas.|The sticky ___ on the floor turned out to be honey.|Scientists tested the white ___ to find out whether it was salt or sugar.|property,particle|substances
  evaporate|to change from a liquid into a gas|蒸发|Puddles ___ on a hot day and leave the road dry.|If you leave a glass of water in the sun, some of it will ___.|Wet clothes dry because the water in them begins to ___.|dissolve,dense
  dense|tightly packed, with a lot of mass in a small space|密度大的|A rock is more ___ than a sponge, so it sinks.|Gold is so ___ that even a small bar of it is very heavy.|Oil floats on water because it is less ___.|volume,mass|denser
  `,
);

const chemicalChange = batch(
  "words-of-chemical-change",
  ["Words of Chemical Change", "化学变化的词"],
  ["changes that make new substances", "产生新物质的变化"],
  `
  reaction|a change in which substances turn into new ones|反应|Mixing baking soda and vinegar causes a ___ that makes bubbles.|Burning wood is a ___ that turns it into ash and smoke.|The ___ between the two liquids turned the water purple.|compound,residue|reactions
  chemical|having to do with how substances change into new ones|化学的|Burning is a ___ change because new substances form.|A ___ change turned the bread golden brown in the toaster.|Rust forms through a slow ___ process between iron, water and air.|physical,irreversible|chemicals
  physical|having to do with a change of shape or form, not of the substance itself|物理的|Cutting paper is a ___ change, because the pieces are still paper.|Melting ice is a ___ change, since the water can freeze again.|Crushing a can is a ___ change to its shape.|chemical,irreversible
  rust|the reddish-brown coating that forms on iron in damp air|铁锈|The old bike left in the rain was covered in orange ___.|A coat of paint protects the iron gate from ___.|Wet nails turn red-brown when ___ forms on them.|residue,odor|rusted,rusty
  ingredient|one of the things mixed together to make something|成分，配料|Flour is the main ___ in bread.|Each ___ must be measured carefully for the cake to rise.|The recipe lists eggs as its first ___.|compound,residue|ingredients
  fizz|to make many small bubbles with a hissing sound|冒泡，嘶嘶作响|The drink began to ___ as soon as we opened the bottle.|Drop the tablet in water and watch it ___.|Baking soda will ___ when you pour vinegar on it.|rust,odor|fizzed,fizzing
  residue|what is left behind after something is used up or taken away|残留物|After the water evaporated, a white ___ of salt was left in the dish.|The burned pan had a black ___ on the bottom.|Sticky ___ from the tape stayed on the window.|rust,compound
  compound|a substance made of two or more elements joined together|化合物|Water is a ___ of hydrogen and oxygen.|Table salt is a ___ made of sodium and chlorine.|Scientists made a new ___ by joining two elements.|ingredient,reaction|compounds
  odor|a smell, often a strong one|气味|The rotten eggs gave off a terrible ___.|A sharp ___ filled the room when the milk went sour.|Gas companies add a strong ___ to gas so that people can smell a leak.|residue,fizz
  irreversible|impossible to undo|不可逆的|Burning paper is ___, because you cannot turn the ash back into paper.|Once the cake is baked, the change is ___ and the batter is gone for good.|Some of the damage to the coral reef may be ___.|chemical,physical
  `,
);

const materials = batch(
  "words-for-describing-materials",
  ["Words for Describing Materials", "描述材料的词"],
  ["what materials are like", "材料的特性"],
  `
  brittle|hard but easily broken or cracked|易碎的|Thin glass is ___ and shatters if you drop it.|Old leaves become dry and ___ and crumble in your hand.|The ___ cookie snapped in half as soon as I picked it up.|pliable,coarse
  soluble|able to dissolve in a liquid|可溶的|Sugar is ___ in water, but sand is not.|The medicine comes as a ___ powder that you stir into juice.|We tested which powders were ___ by stirring each one into water.|porous,waterproof
  elastic|able to stretch and then go back to its shape|有弹性的|A rubber band is ___, so it snaps back after you stretch it.|The ___ waist of the pants stretches when you sit down.|Balloons are made of thin, ___ rubber.|malleable,brittle
  porous|full of tiny holes that let water or air pass through|多孔的|A sponge is ___ and soaks up water.|Water drains through ___ rock into the ground below.|Clay pots are ___, so plants in them dry out quickly.|soluble,coarse
  flammable|able to catch fire easily|易燃的|Keep ___ liquids such as gasoline away from flames.|Dry grass is very ___ in summer.|The label warned that the spray was ___.|brittle,waterproof
  malleable|able to be hammered or pressed into a new shape without breaking|有延展性的|Gold is so ___ that it can be beaten into thin sheets.|Warm clay is ___ in your hands.|The blacksmith heated the iron until it was ___ enough to bend.|elastic,brittle
  coarse|rough, with large grains or thick threads|粗糙的|The beach was covered in ___ sand that scratched our feet.|Sandpaper feels ___ when you rub your finger across it.|She knitted the scarf with a ___ wool that itched.|porous,pliable
  waterproof|not letting water through|防水的|My ___ boots kept my feet dry in the puddles.|The tent is ___, so the rain runs off it.|A coat of wax makes the paper ___.|soluble,porous
  luster|the way a surface shines in the light|光泽|Polishing gave the silver spoon a bright ___.|Pearls have a soft ___ that glows in the light.|Most metals have a ___ that makes them shine.|coarse,elastic
  pliable|easy to bend without breaking|柔韧的，易弯的|Willow branches are ___ enough to weave into baskets.|Soak the reeds in water so they stay ___.|The young twig is ___, but the old branch snaps.|brittle,coarse
  `,
);

const investigating = batch(
  "words-for-investigating",
  ["Words for Investigating", "探究的词"],
  ["doing experiments and tests", "做实验和测试"],
  `
  procedure|a set of steps for doing something|步骤，程序|Follow the ___ one step at a time, in order.|The ___ said to heat the water before adding the salt.|Every group used the same ___ so their results could be compared.|trial,category|procedures
  trial|one run of a test in an experiment|（一次）试验|We dropped the ball from the same height in each ___.|In the first ___, the ice melted in ten minutes.|The second ___ gave the same answer as the first, so we trusted it.|procedure,outcome|trials
  result|what you find or measure at the end of a test|结果|Record each ___ in the table: how long the ice took to melt.|The ___ of our test showed that salt water froze more slowly.|Her ___ surprised the class: the heavy ball did not fall faster.|category,procedure|results
  outcome|the way something ends or turns out|结局，结果|Nobody could guess the ___ of the close election.|The ___ of the game was a tie, so both teams shared the cup.|We waited nervously to learn the ___ of the vote.|trial,category|outcomes
  confirm|to show that something is true|证实|A second test will ___ whether the first result was right.|The photos ___ that the owls nest in this barn.|Please call to ___ that you will come to the party.|determine,classify|confirmed,confirms
  precise|exact and careful|精确的|Use a ruler to take a ___ measurement.|The recipe needs a ___ amount of salt: exactly five grams.|Her map was so ___ that every path on it matched the real ones.|consistent,category
  classify|to sort things into groups|分类|Scientists ___ animals by features such as fur or feathers.|We had to ___ the rocks by their color.|Can you ___ these leaves into two piles?|confirm,determine
  category|a group of things that are alike|类别|Whales belong in the mammal ___, not the fish one.|Put each word in the right ___.|Which ___ does a tomato belong to, fruit or vegetable?|procedure,result|categories
  determine|to find out by studying or measuring|确定，查明|We used a thermometer to ___ how hot the water was.|Tests will ___ what caused the illness.|It is hard to ___ the age of the rock without special tools.|classify,confirm
  consistent|the same each time|一致的|The results were ___: every trial took ten minutes.|To keep the test fair, keep the amount of water ___ in each trial.|She is a ___ player who scores in every game.|precise,category
  `,
);

const cellsAndMicrobes = batch(
  "words-of-cells-and-microbes",
  ["Words of Cells and Microbes", "细胞与微生物的词"],
  ["cells and living things too small to see", "细胞和小得看不见的生物"],
  `
  cell|the smallest living part of a plant or an animal|细胞|Every living thing is made of at least one ___.|Under the microscope, each onion ___ looked like a tiny brick.|Your body makes a new skin ___ to replace one that wears away.|nucleus,membrane
  microbe|a living thing too small to see without a microscope|微生物|A ___ is so small that thousands of them could fit on the head of a pin.|Not every ___ makes you sick; many of them are helpful.|The scientist found a new ___ living in the hot spring.|cell,fungus|microbes
  bacteria|tiny living things of one cell found almost everywhere|细菌|Some ___ in your stomach help you digest food.|Wash your hands to remove ___ before you eat.|Milk turns sour when ___ grow in it.|virus,yeast
  fungus|a living thing, such as a mushroom, that feeds on dead or living matter|真菌|A mushroom is a ___ that grows on rotting logs.|The ___ spread across the dead tree in white threads.|Athlete's foot is caused by a ___ that grows between the toes.|yeast,germ|fungi
  yeast|a tiny fungus that makes bread rise|酵母|Bakers add ___ to dough so that it puffs up.|The ___ fed on the sugar and made bubbles of gas.|Without ___, the bread stayed flat and hard.|mold,bacteria
  mold|a fuzzy fungus that grows on old food or in damp places|霉菌|Green, fuzzy ___ grew on the bread we forgot in the cupboard.|Damp bathroom walls can grow black ___.|Throw away cheese with ___ on it.|yeast,membrane|molds,moldy
  virus|a tiny germ that can grow only inside living cells and causes illness|病毒|The flu is caused by a ___ that spreads when people sneeze.|A ___ cannot grow on its own; it must get inside a cell.|Doctors gave a vaccine to protect people from the ___.|bacteria,nucleus|viruses
  membrane|a thin, soft layer that covers or separates|膜|A thin ___ around each cell lets food in and waste out.|The ___ of an egg lies just inside the shell.|The cell's ___ holds everything inside it like a bag.|nucleus,cell
  nucleus|the center of a cell, which controls it|细胞核|The ___ is the control center of the cell.|When stained, the ___ of each cell showed as a dark spot.|The ___ holds the instructions that tell the cell what to do.|membrane,microbe
  germ|a tiny living thing that causes illness|病菌|Cover your mouth when you cough so you do not spread a ___.|A single ___ on the doorknob can pass to many hands.|The nurse cleaned the cut so that no ___ could get into it.|yeast,cell|germs
  `,
);

const lab = batch(
  "words-of-the-lab",
  ["Words of the Laboratory", "实验室的词"],
  ["the tools and rules of a laboratory", "实验室的工具和规则"],
  `
  magnify|to make something look bigger than it is|放大|A hand lens will ___ the ant so that you can see its legs.|This microscope can ___ a cell four hundred times.|A drop of water on a leaf can ___ the veins beneath it.|stain,contaminate|magnifies,magnified
  beaker|a wide glass cup with a lip for pouring, used in a lab|烧杯|Pour fifty milliliters of water into the ___.|The ___ has lines on its side to measure the liquid.|She heated the ___ of water over the flame.|flask,dropper
  dropper|a small tube with a rubber bulb for adding liquid one drop at a time|滴管|Use the ___ to add one drop of iodine at a time.|Squeeze the bulb of the ___ gently.|With a ___, he placed a single drop of pond water on the glass.|tweezers,beaker
  stain|a dye that colors parts of a cell so they are easier to see|染色剂|Add a drop of blue ___ so that the cells show up.|The ___ turned each nucleus dark purple.|Without a ___, the clear cells were almost impossible to see.|slide,dropper
  sterile|completely free of germs|无菌的|Doctors use ___ tools during an operation.|Keep the bandage in its wrapper so it stays ___.|The lab dishes were heated to make them ___.|contaminate,stain
  goggles|glasses that fit tightly to protect the eyes|护目镜|Wear safety ___ when you mix chemicals.|The ___ kept the splashes out of her eyes.|He pushed his ___ up onto his forehead after the experiment.|tweezers,slide
  contaminate|to make something dirty or unsafe by adding germs or poison|污染，弄脏|Touching the sample with bare hands can ___ it.|A leaking pipe can ___ the drinking water.|Do not let a sneeze ___ the dish.|magnify,sterile|contaminated
  tweezers|a small tool with two arms for picking up tiny things|镊子|Pick up the leaf with ___ so you do not tear it.|She used ___ to pull out the splinter.|The scientist held the tiny seed in a pair of ___.|dropper,goggles
  flask|a glass bottle with a narrow neck, used in a lab|烧瓶|Swirl the liquid in the ___ so that it does not spill out of the narrow neck.|The ___ had a cork stuck in its thin neck.|He heated the liquid in a round glass ___.|beaker,slide
  slide|a thin piece of glass that holds a sample under a microscope|载玻片|Place a drop of pond water on the glass ___.|Slip the ___ under the microscope's lens.|Each ___ was labeled with the name of its sample.|stain,flask|slides
  `,
);

const livingThings = batch(
  "words-for-how-living-things-work",
  ["Words for How Living Things Work", "描述生物如何生存的词"],
  ["how living things grow, feed and stay healthy", "生物如何生长、获取养分和保持健康"],
  `
  benefit|something good that helps|益处|One ___ of exercise is a stronger heart.|Bees are a great ___ to farmers because they help crops grow.|The new park is a ___ to the whole town.|obtain,resist|benefits
  harmful|causing damage or hurt|有害的|Some bacteria are ___ and cause sickness.|Smoke is ___ to your lungs.|Too much sun is ___ to your skin.|benefit,thrive
  infect|to pass a germ into a body or a wound|感染|A dirty needle can ___ a cut.|Cover the wound so that germs do not ___ it.|The virus can ___ many people in a crowded room.|multiply,resist|infected
  multiply|to grow quickly in number|大量繁殖，成倍增加|Bacteria ___ quickly in warm, wet places.|In one night, the spots of mold seemed to ___ across the bread.|If you leave food out, the germs on it will ___.|divide,obtain|multiplies
  consist|to be made up of (used with of)|由……组成|Our bodies ___ of trillions of cells.|Bread dough can ___ of just flour, water, salt and yeast.|The team will ___ of five players and a coach.|obtain,divide|consists
  reproduce|to make young of the same kind|繁殖|Plants ___ by making seeds.|Some animals ___ only once a year.|Yeast can ___ by budding off a small new cell.|thrive,consist|reproduces
  divide|to split into parts|分裂，分开|One cell can ___ into two new cells.|We had to ___ the class into four teams.|The river will ___ into two streams at the big rock.|multiply,consist|divides
  resist|to fight off, or not be harmed by|抵抗|A healthy body can ___ many germs.|Some kinds of wheat ___ disease better than others.|Washing helps your skin ___ infection.|infect,obtain
  thrive|to grow strong and healthy|茁壮成长|Cactuses ___ in hot, dry places.|The puppy began to ___ once it had good food.|Mold will ___ in a damp, dark cupboard.|resist,divide|thrives
  obtain|to get|获得|Plants ___ water through their roots.|You must ___ permission before you visit the lab.|Animals ___ energy from the food they eat.|consist,benefit
  `,
);

const starsAndSky = batch(
  "words-of-stars-and-the-sky",
  ["Words of Stars and the Sky", "星星与天空的词"],
  ["the stars, the moon and the night sky", "星星、月亮和夜空"],
  `
  meteor|a streak of light made by a rock burning up in the air|流星|We saw a ___ flash across the sky and disappear.|Make a wish when you see a ___.|A ___ burns up high above the ground before it can land.|satellite,nebula|meteors
  satellite|an object that travels around a planet|卫星|The moon is Earth's natural ___.|A weather ___ sends pictures of the clouds back to Earth.|The ___ goes around Earth every ninety minutes.|meteor,twilight|satellites
  eclipse|a time when one object in space blocks the light of another|食（日食、月食）|During a solar ___, the moon blocks the sun.|The sky went dark at noon during the ___.|People gathered to watch the moon slide in front of the sun in the ___.|phase,crescent
  lunar|of the moon|月球的|The astronauts walked on the dusty ___ surface.|A ___ calendar follows the changing moon.|The ___ rover drove across the moon's gray dust.|crescent,twilight
  crescent|the curved shape of a thin slice of moon|新月形|Tonight the moon is only a thin ___.|The ___ moon looked like a curved fingernail in the sky.|Her necklace was shaped like a silver ___.|phase,twilight
  horizon|the line where the sky seems to meet the land or sea|地平线|The sun sank slowly below the ___.|A ship appeared on the ___ and sailed toward us.|Mountains rose along the ___ to the west.|twilight,eclipse
  phase|one of the shapes the moon seems to have as it changes|月相|The full moon is the ___ when we see its whole face.|Each ___ of the moon lasts a few days.|In its new ___, the moon cannot be seen at all.|crescent,eclipse|phases
  twilight|the dim light just after sunset or before sunrise|暮光，曙光|In the ___, the first stars began to appear.|Bats fly out of the cave at ___.|The sky turned purple in the evening ___.|crescent,horizon
  observatory|a building with a large telescope for studying the sky|天文台|The ___ on the mountain has a dome that opens at night.|Scientists at the ___ watched the comet for weeks.|We visited the ___ to look through its giant telescope.|satellite,nebula
  nebula|a cloud of gas and dust in space where stars can form|星云|New stars are born inside a glowing ___.|The telescope showed a pink ___ of gas and dust.|That ___ is so big that our whole solar system could fit inside it.|meteor,observatory
  `,
);

const spaceExploration = batch(
  "words-of-space-exploration",
  ["Words of Space Exploration", "太空探索的词"],
  ["exploring space", "太空探索"],
  `
  launch|to send a rocket or spacecraft into the air|发射|They will ___ the rocket at dawn if the weather is clear.|Engineers waited for calm winds to ___ the satellite.|The crew watched the team ___ the probe toward Mars.|mission,probe|launched
  rocket|a vehicle pushed upward by burning fuel|火箭|The ___ roared into the sky on a column of fire.|Its fuel burned for two minutes and pushed the ___ high above the clouds.|A tall ___ stood on the launch pad, ready to fly.|capsule,rover
  spacecraft|any vehicle built to travel in space|航天器|The ___ carried three astronauts to the moon.|A ___ needs a heat shield to survive the fall back to Earth.|No person was aboard the ___ that flew past Pluto.|module,rover
  mission|a special job or trip with a goal|任务|The ___ of the trip was to bring moon rocks back to Earth.|The crew trained for two years for their ___.|Each ___ to Mars takes months of travel.|launch,countdown|missions
  probe|a spacecraft with no crew, sent to explore|探测器|A ___ sent back close-up pictures of Saturn's rings.|The ___ flew past Jupiter and kept going out of the solar system.|Scientists sent a robot ___ to study the comet.|rover,capsule|probes
  rover|a robot vehicle that drives across another planet or moon|漫游车，巡视器|The ___ rolled across the red dust of Mars on six wheels.|The ___ drilled into a rock to study it.|Engineers on Earth steered the ___ around a crater.|probe,rocket
  capsule|the small part of a spacecraft where the crew rides|太空舱|The ___ splashed down in the ocean with the astronauts inside.|Three astronauts squeezed into the tiny ___.|A parachute slowed the ___ as it fell toward the sea.|module,rocket
  module|one section of a spacecraft or space station that can be joined to others|舱段，模块|A new ___ was added to the space station.|The lunar ___ landed on the moon while the other part stayed in orbit.|Each ___ of the station has its own job, such as sleeping or science.|capsule,mission|modules
  countdown|counting backward to the moment of a launch|倒计时|The ___ reached zero, and the engines fired.|The ___ was stopped at five seconds because of a problem.|Crowds on the beach joined in the ___: three, two, one!|launch,mission
  weightless|floating, without feeling any weight|失重的|In orbit, astronauts are ___ and float around the cabin.|Being ___ makes it hard to drink from a cup.|The ___ astronaut tied her sleeping bag to the wall.|capsule,module
  `,
);

const ancientGreece = batch(
  "words-of-ancient-greece",
  ["Words of Ancient Greece", "古希腊的词"],
  ["ancient Greece", "古希腊"],
  `
  democracy|government by the people, who vote|民主|In a ___, citizens vote for their leaders.|Athens is famous as the first ___.|A ___ lets the people decide how they are ruled.|tyrant,assembly
  assembly|a meeting of many people to make decisions|公民大会，议会|Thousands of citizens met in the ___ to vote.|Any citizen could stand up and speak in the ___ of Athens.|The ___ voted to build a hundred new ships.|agora,ballot
  acropolis|a high hill in a Greek city with temples on top|卫城|The temples stood on the ___, high above the city.|From the ___, you could see the whole city and the sea.|Soldiers could defend the ___ because it sat on a steep hill.|agora,amphitheater
  agora|the open market and meeting place of a Greek city|（古希腊的）广场集市|Farmers sold olives and cheese in the ___.|People met their friends and shared news in the busy ___.|Shops lined the ___ in the center of town.|acropolis,assembly
  oracle|a priestess people believed spoke for the gods|神谕者，女祭司|The king asked the ___ whether he should go to war.|Travelers climbed the mountain to ask the ___ about the future.|The ___ gave answers that were hard to understand.|tyrant,athlete
  athlete|a person trained in sports|运动员|Each ___ trained for months before the Olympic Games.|The winning ___ received a crown of olive leaves.|The fastest ___ won the race by a step.|tyrant,oracle|athletes
  column|a tall stone post that holds up a roof|柱子|Each ___ of the temple was carved from white marble.|A broken ___ lay on the ground among the ruins.|The tall ___ held up the heavy stone roof.|agora,amphitheater|columns
  amphitheater|a round theater open to the sky, with rows of seats|圆形剧场|The audience sat in the ___ to watch the play.|Rows of stone seats rose around the stage of the ___.|Even a whisper on stage could be heard at the top of the ___.|acropolis,agora
  ballot|a way of voting in secret, or the thing a vote is marked on|选票，投票|Each citizen dropped a ___ into the box.|In Athens, a ___ might be a pebble or a piece of pottery.|The secret ___ meant that no one knew how you had voted.|assembly,column|ballots
  tyrant|a ruler who takes all the power and rules cruelly|暴君|The people drove out the ___ who had seized power.|A ___ makes laws without asking anyone.|The cruel ___ punished anyone who spoke against him.|democracy,athlete|tyrants
  `,
);

const greekIdeas = batch(
  "words-of-greek-ideas-and-learning",
  ["Words of Greek Ideas and Learning", "古希腊思想与学问的词"],
  ["the ideas and learning of the Greeks", "古希腊人的思想和学问"],
  `
  logic|careful thinking that follows reasons step by step|逻辑|Using ___, she worked out that the thief must have left by the window.|Each step of his ___ followed from the one before it.|The puzzle can be solved with ___, not with luck.|principle,inquiry
  debate|a discussion in which people argue for different sides|辩论|The class held a ___ about whether homework should be banned.|Each side had three minutes to speak in the ___.|After a long ___, the council voted.|lecture,inquiry|debates
  geometry|the math of shapes, lines and spaces|几何|In ___, we learned how to measure the corners of shapes.|Builders used ___ to make the temple's corners square.|Triangles and circles are part of ___.|logic,principle
  academy|a school for higher learning|学院|Students came from far away to study at Plato's ___.|The ___ taught math, music and science.|She studied dance at a famous ___ in the city.|lecture,debate
  lecture|a talk given to teach a group|讲座，讲课|The professor gave a ___ about the stars.|Students took notes during the long ___.|The ___ lasted an hour, and then we asked questions.|debate,academy|lectures
  mathematician|a person who is an expert in math|数学家|Pythagoras was a ___ who studied triangles.|The ___ solved the hard problem with nothing but numbers.|A ___ might spend years proving one idea about numbers.|physician,astronomer
  physician|a doctor|医生|Hippocrates was a Greek ___ who studied illness.|The ___ listened to the patient's heart.|If your fever gets worse, call a ___.|mathematician,astronomer
  astronomer|a scientist who studies the stars and planets|天文学家|The ___ watched the planets through a telescope.|A Greek ___ worked out the size of Earth from shadows.|The ___ made a map of the stars.|physician,mathematician|astronomers
  inquiry|a careful search for facts or answers|探究，调查|Science begins with ___: asking questions and looking for answers.|Her ___ into the old coins took months.|The ___ found out what had caused the fire.|debate,logic
  principle|a basic rule or truth that other ideas are built on|原理，原则|A basic ___ of science is that results must be tested.|Fairness is a ___ of democracy.|The ___ of the lever explains how a small push can lift a heavy load.|logic,lecture|principles
  `,
);

const government = batch(
  "words-for-government-and-choices",
  ["Words for Government and Choices", "政府与选择的词"],
  ["government and the choices citizens make", "政府和公民所做的选择"],
  `
  elect|to choose someone by voting|选举|Citizens ___ a new mayor every four years.|The class will ___ a president next week.|We ___ leaders to speak for us.|consent,candidate|elected
  candidate|a person who wants to be chosen in a vote|候选人|Each ___ gave a speech before the vote.|The ___ with the most votes won.|She was the youngest ___ for class president.|official,council|candidates
  council|a group of people chosen to make decisions for a town or group|委员会，议会|The town ___ voted to build a new library.|Members of the student ___ meet every Friday.|The ___ makes the rules for the park.|candidate,policy
  freedom|the right to act, speak or think as you choose|自由|People have the ___ to choose their religion.|Under the new law, everyone had the ___ to speak their mind.|The caged bird finally flew off to its ___.|privilege,responsibility
  responsibility|a duty you are trusted to do|责任|Feeding the fish is my ___ this week.|Voting is a ___ of every citizen.|With great power comes great ___.|privilege,policy|responsibilities
  privilege|a special right that not everyone has|特权|Staying up late is a ___ for the older children.|In Athens, voting was a ___ of male citizens only.|It was a ___ to meet the famous writer.|responsibility,consent
  consent|permission or agreement|同意|You need a parent's ___ to go on the trip.|The king could not tax the people without their ___.|She gave her ___ for the photo to be printed.|policy,privilege
  liberty|being free from control by others|自由|The prisoners won their ___ after ten years.|People fought for their ___ against the cruel king.|Under the tyrant, the people had no ___ to speak.|council,official
  official|a person who holds a job in government|官员|A city ___ checked the building for safety.|The ___ stamped our passports at the border.|In Athens, each ___ was chosen by drawing lots.|candidate,council|officials
  policy|a plan or rule that a group follows|政策|The school's ___ is that phones stay in lockers.|The new ___ lowered the speed limit near schools.|The council changed its ___ on recycling.|consent,council
  `,
);

/** batchesA are the vocabulary batches of the first five units. */
export const batchesA: readonly BatchSpec[] = [
  oceansAndIce,
  amounts,
  cleanWater,
  matter,
  chemicalChange,
  materials,
  investigating,
  cellsAndMicrobes,
  lab,
  livingThings,
  starsAndSky,
  spaceExploration,
  ancientGreece,
  greekIdeas,
  government,
];
