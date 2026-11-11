// Grade 3: the words of the first five themes, ten to a batch: folk tales and feelings, farms and growth, animal
// bodies, groups and safety, the forecast and measuring, and maps, land and water, places and directions.

import { t } from "@ga/content";
import type { Grade3Batch } from "./batches.ts";

const folkTales: Grade3Batch = {
  id: "words-of-folk-tales",
  title: t("Words of Folk Tales", "民间故事的词汇"),
  summary: t(
    "Ten words of fables and folk tales: moral, fable, villain, peasant, reward and more.",
    "十个寓言和民间故事中的词：moral、fable、villain、peasant、reward 等。",
  ),
  domain: ["fables and folk tales", "寓言和民间故事"],
  lines: `
    moral|morals|the lesson a story teaches|故事所讲的道理，寓意|Every fable ends with a ___, such as "slow and steady wins the race."|The ___ of the story is that you should never tell lies.|Our teacher asked us to write the ___ of the tale in one sentence.|reward,villain
    fable|fables|a short story, often about animals, that teaches a lesson|寓言，常以动物为角色、讲道理的短故事|In the ___ of the ant and the grasshopper, the ant works hard all summer.|This ___ has a talking fox and a crow, and it teaches a lesson about pride.|After reading the ___, we talked about what the tortoise taught the hare.|peasant,villain
    folktale|folktales|an old story that people have told for a very long time|民间故事，人们流传了很久的古老故事|My grandmother told me a ___ that her own grandmother had told her.|Every country has a ___ about a clever person who tricks a giant.|Nobody knows who first told this ___; it has been passed down for hundreds of years.|moral,reward
    villain|villains|the bad character in a story|反派，故事里的坏人|The ___ of the story was a wolf who wanted to eat the three little pigs.|In the end, the ___ was caught and the village was safe again.|Everyone booed when the ___ stepped onto the stage in his black cape.|peasant,fable
    peasant|peasants|a poor farmer who works on the land|农民，在土地上劳作的穷苦农夫|The poor ___ worked in the king's fields from sunrise to sunset.|The poor ___ owned only one hen, but one day it laid a golden egg.|The ___ had only a small hut, a thin cow and a patch of beans.|villain,moral
    wander|wandered,wanders,wandering|to walk around with no plan of where to go|闲逛，漫无目的地走|Little Red Riding Hood began to ___ off the path to pick flowers.|On sunny days, the goats like to ___ across the hills.|Stay close to me in the forest and do not ___ away.|punish,reward
    reward|rewarded,rewards|something given to thank a person for doing something good|奖赏，为感谢善行而给的东西|The king gave the brave girl a bag of gold as a ___.|As a ___ for finding the lost dog, Sam got a free ice cream.|The kind man asked for no ___ when he helped the old woman.|moral,peasant
    punish|punished,punishes|to make someone suffer because they did something wrong|惩罚，因为做错事而让人受苦|The queen said she would ___ anyone who stole from the castle.|In the tale, the gods ___ the greedy man by turning his gold to stone.|Mom did not ___ me for breaking the vase, because I told the truth.|wander,reward
    wicked|-|very bad and cruel|邪恶的，非常坏而且残忍的|The ___ witch locked the children in a tower.|The ___ giant laughed cruelly as he stole the sheep.|The ___ stepmother made Cinderella clean the house all day.|foolish,peasant
    foolish|-|silly and not wise|愚蠢的，傻的，不明智的|It was ___ of the crow to open its beak and drop the cheese.|The ___ man built his house on the sand, and the sea washed it away.|Running across the ice on the pond was a ___ thing to do.|wicked,moral
  `,
};

const feelings: Grade3Batch = {
  id: "words-for-feelings",
  title: t("Words for Feelings", "表达感受的词"),
  summary: t(
    "Ten words for how characters feel: anxious, furious, relieved, jealous, thrilled and more.",
    "十个描述人物感受的词：anxious、furious、relieved、jealous、thrilled 等。",
  ),
  domain: ["how people and characters feel", "人物的感受"],
  lines: `
    anxious|-|worried about something that might happen|焦虑的，担心可能发生的事|Lena felt ___ the night before her first swimming test.|My dad gets ___ when we are late for the train.|The ___ puppy paced by the door, waiting for its owner to come home.|furious,delighted
    furious|-|very, very angry|狂怒的，非常生气的|The farmer was ___ when he saw that the goats had eaten his whole garden.|My sister was ___ that I had read her diary.|The ___ bull stamped and snorted at the fence.|anxious,relieved
    delighted|-|very pleased and happy|高兴的，非常开心的|Grandpa was ___ to see us at his door with a cake.|The children were ___ when the snow day was announced.|I was ___ to find a note from my best friend in my lunch box.|miserable,jealous
    embarrassed|-|feeling silly or uncomfortable because others saw you make a mistake|难为情的，尴尬的|Tom was ___ when he tripped on the stage in front of the whole school.|I felt ___ after I called my teacher "Mom" by mistake.|She turned red and looked ___ when her phone rang during the quiet test.|disappointed,furious
    jealous|-|unhappy because someone else has something you want|嫉妒的，因别人有自己想要的东西而不快|Max was ___ of his friend's new bike.|The older cat seemed ___ when we brought home a kitten.|Try not to be ___ when your friend wins a prize.|relieved,thrilled
    relieved|-|happy because something bad did not happen or is over|松了口气的，因坏事没发生或结束而安心|We were ___ when the lost kitten came home safe.|Lucy felt ___ when the doctor said her arm was not broken.|After the scary storm passed, everyone was ___.|anxious,embarrassed
    disappointed|-|sad because something was not as good as you hoped|失望的，因事情不如预期而难过|Ben was ___ when the picnic was cancelled because of rain.|I was ___ that the movie was not as funny as the first one.|The team was ___ to lose the final game by one point.|delighted,frightened
    frightened|-|feeling afraid|害怕的，受惊的|The ___ rabbit ran into its hole when it saw the fox.|Mia was ___ by the loud thunder in the night.|The little boy looked ___ when he could not find his mother.|thrilled,jealous
    thrilled|-|very excited and happy|非常兴奋的，激动的|Ana was ___ to ride the roller coaster for the first time.|The class was ___ to hear that we would visit the zoo.|He was ___ when he opened the box and found a puppy inside.|frightened,miserable
    miserable|-|very unhappy|痛苦的，非常不开心的|The wet and cold dog looked ___ outside in the rain.|I felt ___ when I had a fever and could not go to the party.|The ___ prince sat alone in his tower and cried.|delighted,relieved
  `,
};

const farms: Grade3Batch = {
  id: "words-of-farms-and-gardens",
  title: t("Words of Farms and Gardens", "农场与花园的词汇"),
  summary: t(
    "Ten words of growing food: harvest, crop, compost, orchard, greenhouse, prune and more.",
    "十个种植食物的词：harvest、crop、compost、orchard、greenhouse、prune 等。",
  ),
  domain: ["farms and gardens", "农场和花园"],
  lines: `
    harvest|harvested,harvests|the time when crops are picked or gathered|收获，采收庄稼的时节|In the fall, the whole family helps with the apple ___.|Everyone was tired after the long days of the ___ in October.|After the ___, the fields were empty and brown.|crop,compost
    crop|crops|a plant that is grown in large amounts for food|庄稼，大量种植以作食物的植物|Rice is the main ___ in many wet, warm places.|The farmer planted one ___ of beans and one of wheat.|A hailstorm ruined the whole ___ of strawberries.|orchard,mulch
    compost|-|old plants and food scraps that rot and make the soil rich|堆肥，腐烂后能使土壤肥沃的残叶和厨余|We put banana peels and eggshells in the ___ pile.|Dig some ___ into the soil before you plant the seeds.|Worms help turn old leaves into dark, crumbly ___.|harvest,trowel
    orchard|orchards|a field of fruit trees|果园|The ___ had a hundred old apple trees growing in the open field.|In spring, the cherry trees of the ___ covered the hillside in pink.|Rows of apple trees grew in the old ___ on the hill.|greenhouse,crop
    greenhouse|greenhouses|a building made of glass where plants grow in warm air|温室|Tomatoes grow in the ___ even when it is cold outside.|The glass walls of the ___ let in sunlight and keep in heat.|In winter, Grandma moves her flower pots into the ___.|orchard,compost
    mulch|-|a layer of straw, bark or leaves spread on soil to keep it damp|覆盖物，铺在土上保湿的稻草、树皮或树叶|Spread ___ around the plants so the soil does not dry out.|We used chopped bark as ___ in the flower beds.|A thick layer of ___ stops weeds from growing.|trowel,crop
    trowel|trowels|a small hand tool for digging holes in a garden|小铲子，园艺用的手铲|I used a ___ to dig a hole for each bulb.|Mom handed me a ___ and a bag of seeds.|The handle of my ___ broke when I hit a big rock.|plow,mulch
    prune|pruned,prunes,pruning|to cut off parts of a plant to help it grow better|修剪，剪掉植物的部分让它长得更好|In winter, we ___ the rose bushes so they grow strong in spring.|The gardener will ___ the dead branches from the tree.|If you ___ the tomato plant, it will make bigger tomatoes.|sow,plow
    plow|plowed,plows|to turn over the soil before planting|犁地，播种前翻土|Long ago, farmers used horses to ___ their fields.|They ___ the field every spring before planting corn.|A tractor can ___ a big field in one day.|prune,harvest
    sow|sowed,sows|to plant seeds in the ground|播种|In spring, we ___ carrot seeds in neat rows.|Farmers ___ wheat in the fall so it can sprout before winter.|Be sure to ___ the seeds thinly so each plant has room to grow.|plow,prune
  `,
};

const growth: Grade3Batch = {
  id: "words-for-growth-and-change",
  title: t("Words for Growth and Change", "表达生长与变化的词"),
  summary: t(
    "Ten words for how living things grow and change: develop, expand, shrink, flourish, decay and more.",
    "十个描述生物生长与变化的词：develop、expand、shrink、flourish、decay 等。",
  ),
  domain: ["how things grow and change", "事物的生长和变化"],
  lines: `
    develop|developed,develops|to grow and change slowly into something more complete|发育，逐渐成长变化|A tadpole will ___ into a frog in about three months.|Flower buds ___ on the plant before they open.|With practice, your reading skills will ___.|decay,shrink
    increase|increased,increases|to become bigger in number or amount|增加|If we put out more seeds, the number of birds at the feeder will ___.|If you water the plant more, its growth may ___.|As more people move to our town, the number of cars will ___.|decrease,emerge
    decrease|decreased,decreases|to become smaller in number or amount|减少|The water in the pond will ___ during the dry summer.|When the days get shorter, the number of flowers begins to ___.|Turning off lights helps ___ the amount of power we use.|increase,expand
    expand|expanded,expands|to get bigger by spreading out|扩大，膨胀，向外伸展|A balloon will ___ as you blow air into it.|The town plans to ___ the park to make room for a pond.|Seeds ___ when they soak up water.|shrink,decay
    shrink|shrinks|to become smaller|缩小，变小|Wool sweaters can ___ in hot water.|Puddles ___ in the sun until they are gone.|A grape will ___ into a raisin as it dries.|expand,flourish
    transform|transformed,transforms|to change completely into something different|使彻底改变，转变|A caterpillar will ___ into a butterfly inside its cocoon.|The class wanted to ___ the empty lot into a garden.|Heat can ___ hard corn kernels into fluffy popcorn.|decrease,mature
    mature|-|to become fully grown|成熟，长成|It takes about ten years for an apple tree to ___ and give fruit.|Kittens ___ into adult cats in about a year.|The pumpkins need all summer to ___ on the vine.|emerge,shrink
    flourish|flourished,flourishes|to grow strong and healthy|茂盛，繁荣，长得旺盛|Ferns ___ in shady, damp places.|With sun and rain, the garden began to ___.|Plants will not ___ in poor, dry soil.|decay,decrease
    decay|decayed,decays|to slowly rot and break apart|腐烂，慢慢分解|Fallen leaves ___ and turn into soil.|Sugar can make your teeth ___ if you do not brush them.|The old log had started to ___, and mushrooms grew on it.|flourish,mature
    emerge|emerged,emerges|to come out from inside or from behind something|出现，冒出|Every spring, green shoots ___ from the ground.|We watched the chick ___ from its egg.|The bear will ___ from its den when winter is over.|increase,transform
  `,
};

const animalBodies: Grade3Batch = {
  id: "words-of-animal-bodies",
  title: t("Words of Animal Bodies", "动物身体部位的词汇"),
  summary: t(
    "Ten words for the parts of animals' bodies: beak, claw, gill, hoof, talon, tusk and more.",
    "十个动物身体部位的词：beak、claw、gill、hoof、talon、tusk 等。",
  ),
  domain: ["the bodies of animals", "动物的身体"],
  lines: `
    beak|beaks|the hard, pointed mouth of a bird|鸟喙|The woodpecker taps the tree with its strong ___.|A parrot can crack nuts with its curved ___.|The pelican scooped up a fish in its long ___.|snout,fang
    claw|claws|a sharp, curved nail on an animal's foot|爪子|The cat scratched the sofa with its ___.|A crab grabbed my finger with its ___.|The bear used one ___ to dig ants out of the log.|hoof,fin
    fin|fins|a thin, flat part that helps a fish swim and steer|鳍|The shark's ___ stuck up out of the water.|A fish moves its tail ___ from side to side to swim.|The goldfish waved a tiny ___ as it turned.|gill,tusk
    gill|gills|the part of a fish's body that takes oxygen from water|鳃|A fish breathes through the ___ on each side of its head.|Tadpoles have a ___ on each side, but frogs breathe with lungs.|Water passes over each ___ as the fish opens its mouth.|fin,beak
    hoof|hooves|the hard covering on the foot of a horse, cow or deer|蹄|The horse lifted one ___ so the farmer could clean it.|We heard the clip-clop of a ___ on the stony road.|A goat's split ___ helps it climb steep rocks.|claw,talon
    talon|talons|a long, sharp claw of a bird that hunts|（猛禽的）利爪|The eagle grabbed the fish with one ___.|An owl's ___ is sharp enough to hold a running mouse.|The hawk gripped the branch with each curved ___.|beak,antler
    antler|antlers|a branched horn on the head of a deer or moose|鹿角|Each ___ of the moose was as wide as a table.|A male deer loses each ___ in winter and grows a new one in spring.|We found an old ___ lying in the forest.|tusk,hoof
    tusk|tusks|a very long tooth that sticks out of an animal's mouth|长牙，象牙|An elephant uses its ___ to dig for water.|The walrus pulled itself onto the ice with one ___.|A wild boar has a sharp ___ on each side of its snout.|antler,gill
    snout|snouts|the long nose and mouth of an animal|（动物的）口鼻部|The pig dug in the mud with its ___.|An anteater pushes its long ___ into ant nests.|The crocodile's ___ was full of sharp teeth.|beak,claw
    fang|fangs|a long, sharp tooth that bites|尖牙，毒牙|The snake has a hollow ___ that holds venom.|The wolf showed a white ___ when it growled.|A spider bites with a tiny ___.|tusk,talon
  `,
};

const animalGroups: Grade3Batch = {
  id: "words-of-animal-groups-and-homes",
  title: t("Words of Animal Groups and Homes", "动物群体与居所的词汇"),
  summary: t(
    "Ten words for groups of animals and the places they live: herd, flock, swarm, hive, den, lair and more.",
    "十个动物群体和居所的词：herd、flock、swarm、hive、den、lair 等。",
  ),
  domain: ["groups of animals and their homes", "动物的群体和居所"],
  lines: `
    herd|herds|a large group of animals such as cows, horses or elephants|兽群，牛群、马群或象群|A ___ of zebras crossed the river together.|The farmer moved his ___ of cows to the green field.|Elephants in a ___ protect the babies in the middle.|flock,litter
    flock|flocks|a group of birds or sheep|（鸟或羊的）一群|A ___ of geese flew south in a V shape.|The shepherd counted every sheep in his ___.|A ___ of pigeons landed in the square to eat crumbs.|swarm,pod
    swarm|swarms|a large group of insects moving together|（昆虫的）一大群|A ___ of bees flew out of the hollow tree.|We ran when a ___ of wasps came buzzing toward us.|A ___ of locusts can eat a whole field of crops.|herd,troop
    hive|hives|a home where bees live|蜂巢，蜂箱|The beekeeper opened the ___ to collect honey.|Thousands of bees live together in one ___.|Bees fly back to their ___ with pollen on their legs.|den,roost
    den|dens|a hidden home of a wild animal such as a fox or bear|兽穴|The fox cubs played outside their ___.|In winter, the bear sleeps in its ___ under the rocks.|Wolves dig a ___ for their pups.|hive,pod
    lair|lairs|the hiding place of a wild animal that hunts|（猛兽的）巢穴|The dragon slept in its ___ deep inside the mountain.|The lion returned to its ___ after the hunt.|Explorers found the tiger's ___ in a dark cave.|roost,herd
    pod|pods|a group of whales or dolphins|（鲸或海豚的）一群|A ___ of dolphins swam beside our boat.|The whales in a ___ call to each other with songs.|A ___ of orcas hunted together near the shore.|flock,litter
    litter|litters|a group of baby animals born to one mother at the same time|一窝（幼崽）|Our dog had a ___ of six puppies.|The mother cat carried each kitten of her ___ to a safe spot.|A pig can have a ___ of ten piglets.|troop,swarm
    roost|roosts|a place where birds rest or sleep|（鸟的）栖息处|At night, the hens go back to their ___ in the barn.|Bats hang upside down in their ___ all day.|The crows flew to their ___ in the tall trees at sunset.|lair,hive
    troop|troops|a group of monkeys|（猴子的）一群|A ___ of monkeys swung through the trees.|The baby monkey stayed close to its mother in the ___.|The whole ___ of baboons sat in the sun to groom each other.|pod,den
  `,
};

const danger: Grade3Batch = {
  id: "words-for-danger-and-safety",
  title: t("Words for Danger and Safety", "表达危险与安全的词"),
  summary: t(
    "Ten words for keeping safe and the dangers around us: protect, threat, hazard, rescue, alert and more.",
    "十个关于安全和危险的词：protect、threat、hazard、rescue、alert 等。",
  ),
  domain: ["danger and staying safe", "危险和安全"],
  lines: `
    protect|protected,protects|to keep safe from harm|保护|A turtle's hard shell helps ___ it from enemies.|Wear a helmet to ___ your head when you ride a bike.|The mother bird will ___ her chicks from the cat.|injure,vanish
    threat|threats|something that might cause harm|威胁|Hawks are a ___ to small birds and mice.|The dark clouds were a ___ to our picnic.|Pollution is a big ___ to the fish in the river.|rescue,alert
    survive|survived,survives|to stay alive through something dangerous or hard|幸存，活下来|Camels can ___ for days without water.|Only the strongest plants ___ the long, cold winter.|The sailors drifted for days on a raft but managed to ___ until help came.|escape,vanish
    escape|escaped,escapes|to get away from danger or from a place|逃脱|The mouse squeezed under the door to ___ the cat.|A lizard can drop its tail to ___ from a bird.|The goats tried to ___ through a hole in the fence.|protect,rescue
    hazard|hazards|something that can be dangerous|危险物，隐患|Ice on the sidewalk is a ___ in winter.|A broken step is a ___, so please fix it.|Sharp rocks under the water are a ___ for swimmers.|escape,alert
    risk|risks|a chance that something bad will happen|风险|Do not take a ___ by swimming alone.|There is a ___ of a flood when it rains for days.|Every time you skip your helmet, you take a ___.|hazard,alert
    injure|injured,injures|to hurt or harm a person or animal|伤害，使受伤|A fall from the tree could ___ you badly.|Sharp hooks can ___ the fish you plan to set free.|Wear gloves so the thorns do not ___ your hands.|protect,survive
    rescue|rescued,rescues|to save someone from danger|营救|Firefighters climbed a ladder to ___ the cat from the roof.|The lifeguard swam out to ___ the tired swimmer.|A dog helped ___ the hikers lost in the snow.|escape,injure
    alert|-|watching carefully and ready to act|警觉的，警惕的|A meerkat stands on its back legs and stays ___ for danger.|The guard dog was ___ and barked at every sound.|Stay ___ when you walk near a busy road.|risk,threat
    vanish|vanished,vanishes|to disappear suddenly|突然消失|The octopus can ___ in a cloud of dark ink.|When the hawk flew over, the rabbits seemed to ___ into the grass.|The magician made the coin ___ from his hand.|survive,rescue
  `,
};

const forecast: Grade3Batch = {
  id: "words-of-the-forecast",
  title: t("Words of the Forecast", "天气预报的词汇"),
  summary: t(
    "Ten words of weather reports: forecast, temperature, mild, scorching, frost, overcast and more.",
    "十个天气预报中的词：forecast、temperature、mild、scorching、frost、overcast 等。",
  ),
  domain: ["weather reports", "天气预报"],
  lines: `
    forecast|forecasts|a report that tells what the weather will probably be|天气预报|The ___ says it will rain tomorrow, so bring an umbrella.|We checked the ___ before planning our trip to the beach.|Today's ___ calls for sunshine in the morning and wind in the evening.|temperature,shelter
    temperature|temperatures|how hot or cold something is|温度，气温|The ___ dropped below freezing last night.|A thermometer measures the ___ of the air.|In the desert, the ___ can be very high in the day.|degree,forecast
    degree|degrees|a unit for measuring how hot or cold something is|度（温度单位）|It was one ___ warmer today than yesterday.|The thermometer rose by one ___ every hour.|Raise the heat of the oven by one ___ at a time.|temperature,frost
    mild|-|not too hot and not too cold|温和的，温暖适中的|We had a ___ winter with very little snow.|It is a ___ day, so a light jacket is enough.|The weather in spring is often ___ and pleasant.|scorching,overcast
    scorching|-|very, very hot|酷热的，灼热的|On the ___ afternoon, the sand burned our feet.|It was so ___ that the chocolate melted in my pocket.|The ___ sun dried up the puddles in an hour.|mild,overcast
    frost|-|a thin layer of ice that forms on cold surfaces at night|霜|In the morning, ___ covered the grass in white.|Mom scraped the ___ off the car windows.|The ___ killed the tomato plants that were left outside.|flood,breeze
    breeze|breezes|a light, gentle wind|微风|A cool ___ came off the lake.|The leaves danced in the soft ___.|We flew our kite in the afternoon ___.|frost,shelter
    overcast|-|covered with gray clouds|阴天的，多云的|The sky was ___, and we could not see the sun all day.|On ___ days, it is dark early in the afternoon.|The sky stayed ___ and gray, but it never rained.|scorching,mild
    shelter|shelters|a place that keeps you safe from bad weather|避难处，遮蔽处|We found ___ under a big tree when the rain began.|The hikers built a ___ out of branches.|The bus stop gave us ___ from the wind.|breeze,flood
    flood|floods|a lot of water covering land that is usually dry|洪水|After days of heavy rain, the river overflowed and caused a ___.|The ___ filled the streets with brown water.|People moved to higher ground to escape the ___.|frost,forecast
  `,
};

const measuring: Grade3Batch = {
  id: "words-for-measuring",
  title: t("Words for Measuring", "表达测量的词"),
  summary: t(
    "Ten words for measuring and comparing numbers: measure, amount, total, average, gauge, range and more.",
    "十个关于测量和比较数字的词：measure、amount、total、average、gauge、range 等。",
  ),
  domain: ["measuring and comparing numbers", "测量和比较数字"],
  lines: `
    measure|measured,measures|to find out the size, amount or weight of something|测量|Use a ruler to ___ how long the leaf is.|Use a scale to ___ how heavy the pumpkin is.|The nurse will ___ how tall you are.|record,total
    amount|amounts|how much there is of something|数量，总量|The ___ of rain this month was very small.|Add a small ___ of salt to the soup.|We counted the ___ of money in the jar.|unit,range
    total|totals|the number you get when you add everything together|总数，合计|Three apples and two apples make a ___ of five.|We added all the scores, and the ___ came to fifty.|Add up the points to find the team's ___.|average,maximum
    average|averages|the usual or middle amount, found by sharing a total equally|平均数|The ___ of 2, 4 and 6 is 4.|On ___, it rains on ten days each month here.|The ___ height of the children in our class is 130 centimeters.|total,minimum
    record|recorded,records|to write down information so it can be used later|记录|Please ___ the temperature in your notebook every morning.|Scientists ___ in a notebook how many birds visit the pond each day.|Remember to ___ your answer in the chart.|measure,gauge
    unit|units|an amount used for measuring, such as a meter or a liter|单位|A meter is a ___ for measuring length.|Always write the ___, such as grams or centimeters, after the number.|The liter is a ___ used for measuring water.|amount,gauge
    gauge|gauges|a tool that measures something, such as rain or air pressure|测量仪器，计量器|The rain ___ in our yard showed two centimeters this morning.|Check the ___ to see how much air is in the tire.|The fuel ___ said the tank was almost empty.|unit,record
    minimum|-|the smallest amount possible or allowed|最小值，最低限度|You need a ___ of four players to start the game.|The coldest it got last night was two degrees, the ___ temperature.|Water the plant a ___ of once a week.|maximum,average
    maximum|-|the largest amount possible or allowed|最大值，最高限度|The ___ number of people in the elevator is eight.|The hottest it will get today is thirty degrees, the ___ temperature.|Fill the cup to the ___ line and no higher.|minimum,range
    range|ranges|the space between the lowest and highest amounts|范围|The ___ of temperatures today was from five to fifteen degrees.|These shoes come in a ___ of sizes.|Children in the ___ of seven to nine years old may join.|amount,total
  `,
};

const maps: Grade3Batch = {
  id: "words-of-maps",
  title: t("Words of Maps", "地图的词汇"),
  summary: t(
    "Ten words for reading maps: continent, globe, equator, hemisphere, legend, peninsula, grid and more.",
    "十个读地图用的词：continent、globe、equator、hemisphere、legend、peninsula、grid 等。",
  ),
  domain: ["maps and the shape of the world", "地图和世界的形状"],
  lines: `
    continent|continents|one of the seven very large areas of land on Earth|大洲|Africa is the ___ where most of the world's lions live.|Australia is both a country and a ___.|Asia is the largest ___ on Earth.|hemisphere,peninsula
    globe|globes|a round model of the Earth|地球仪|I spun the ___ and pointed to where we live.|A ___ shows the Earth as a ball, not a flat page.|On our classroom ___, the oceans are blue and the land is green.|grid,legend
    equator|-|the imaginary line around the middle of the Earth|赤道|Countries near the ___ are hot all year.|The ___ divides the Earth into a northern half and a southern half.|On the globe, the ___ is drawn as a line around the middle.|border,coast
    hemisphere|hemispheres|one half of the Earth|半球|The equator splits the Earth into two halves, and each half is called a ___.|When it is summer in one ___, it is winter in the other.|Australia lies in the southern ___.|continent,globe
    border|borders|the line where one country or state ends and another begins|边界，国界|We crossed the ___ between the two countries by train.|On the map, a dotted line shows the ___ between the states.|The river forms the ___ between the two towns.|equator,symbol
    legend|legends|the box on a map that tells what its symbols mean|图例|The ___ shows that a tent stands for a campground.|Check the map's ___ to find out what the blue dots mean.|In the ___, a green triangle means a forest.|globe,grid
    symbol|symbols|a small picture or mark that stands for something|符号|On this map, a star is the ___ for the capital city.|A cross is the ___ for a hospital.|The ___ for a school is a little flag.|legend,border
    peninsula|peninsulas|land with water on three sides|半岛|Italy is a ___ shaped like a boot.|Florida is a ___ with the ocean on three sides.|We drove to the tip of the ___ and saw water all around.|continent,coast
    coast|coasts|the land along the edge of the sea|海岸|We drove along the ___ and watched the waves.|Many fishing villages lie on the ___.|The ship sailed close to the rocky ___.|peninsula,border
    grid|grids|lines that cross each other to make squares on a map|网格|Use the ___ to find the park in square B3.|The map has a ___ of letters across the top and numbers down the side.|Each square of the ___ is one kilometer wide.|symbol,equator
  `,
};

const landAndWater: Grade3Batch = {
  id: "words-of-land-and-water",
  title: t("Words of Land and Water", "地形与水域的词汇"),
  summary: t(
    "Ten words for the shapes of land and water: valley, plateau, canyon, bay, gulf, swamp, ridge and more.",
    "十个描述地形和水域的词：valley、plateau、canyon、bay、gulf、swamp、ridge 等。",
  ),
  domain: ["the shapes of land and water", "陆地和水域的形状"],
  lines: `
    valley|valleys|low land between hills or mountains|山谷|A river runs through the green ___ between the mountains.|The village sits in a ___, with hills on both sides.|From the top of the hill, we looked down into the ___.|ridge,plateau
    plateau|plateaus|a large area of high, flat land|高原|The top of the ___ was flat and windy.|Tibet is on a high ___ in Asia.|The road climbed for hours until it reached the ___.|valley,canyon
    canyon|canyons|a deep valley with steep rock sides, often with a river at the bottom|峡谷|The river cut a deep ___ through the red rock.|We could hear our voices echo off the walls of the ___.|Looking down into the ___ made me dizzy.|meadow,bay
    cliff|cliffs|a high, steep face of rock|悬崖|Seabirds nest on the rocky ___ above the sea.|Do not stand near the edge of the ___.|The waves crashed against the bottom of the ___.|plain,swamp
    plain|plains|a large area of flat land with few trees|平原|Buffalo once roamed the wide, grassy ___.|The farmers grow wheat on the flat ___.|You can see for miles across the ___.|cliff,ridge
    bay|bays|part of the sea that curves into the land|海湾|Our little sailboat rested in the calm, small ___ near the town.|The town is built around a small ___ with a sandy beach.|The ___ is so small that you can see the houses on the other side.|gulf,canyon
    gulf|gulfs|a very large area of sea that is partly surrounded by land|（大的）海湾|The ___ of Mexico is surrounded by land on three sides.|Storms often form over the huge, warm ___ south of the coast.|It takes big ships two days to cross the ___.|bay,swamp
    swamp|swamps|wet, muddy land with trees and water plants|沼泽|Alligators live in the ___.|Our boots sank in the mud of the ___.|Frogs croak among the reeds of the ___.|meadow,plateau
    meadow|meadows|a field of grass and wild flowers|草地，草甸|Cows grazed in the sunny ___.|We had a picnic in a ___ full of daisies.|Butterflies fluttered over the ___.|swamp,canyon
    ridge|ridges|a long, narrow top of a hill or mountain|山脊|We hiked along the ___ and looked down on both sides.|A line of pine trees grew along the ___.|The sun set behind the rocky ___.|valley,plain
  `,
};

const places: Grade3Batch = {
  id: "words-for-places-and-directions",
  title: t("Words for Places and Directions", "表达地点与方向的词"),
  summary: t(
    "Ten words for where things are: location, route, distant, nearby, northern, southern, landmark and more.",
    "十个表示位置的词：location、route、distant、nearby、northern、southern、landmark 等。",
  ),
  domain: ["places and directions", "地点和方向"],
  lines: `
    location|locations|the place where something is|位置，地点|Mark the ___ of your house on the map.|The new park's ___ is next to the library.|The pirate's map showed the ___ of the treasure.|route,landmark
    route|routes|the way you go to get from one place to another|路线|The bus takes the same ___ to school every day.|We chose a ___ that went past the lake.|The map shows the shortest ___ to the beach.|location,central
    distant|-|far away|遥远的|We could see ___ mountains through the window.|The ship sailed to a ___ island.|The sound of ___ thunder rolled over the hills.|nearby,central
    nearby|-|close to here|附近的|We walked to a ___ shop to buy bread.|The children play in a ___ park after school.|Is there a ___ place where we can get water?|distant,western
    northern|-|in or from the north|北方的，北部的|Near the North Pole, the ___ part of the world is cold and icy.|Polar bears live in ___ lands near the Arctic.|The ___ side of the house faces the North Star.|southern,eastern
    southern|-|in or from the south|南方的，南部的|Penguins live in the far ___ part of the world.|Mexico lies along the ___ border of the United States.|Antarctica is at the far ___ end of the globe.|northern,western
    eastern|-|in or from the east|东方的，东部的|The sun rises in the ___ sky.|China is on the ___ side of Asia.|The ___ window of my room fills with light in the morning.|western,southern
    western|-|in or from the west|西方的，西部的|The sun sets in the ___ sky.|Cowboys once rode across the ___ plains.|The ___ coast faces the setting sun.|eastern,northern
    central|-|in the middle|中心的，中部的|The library is in the ___ part of town, close to everything.|Our ___ square has a fountain in the middle.|Our town is in the ___ part of the state, right in the middle.|distant,nearby
    landmark|landmarks|a building or place that is easy to see and helps you find your way|地标|The tall clock tower is a ___ that everyone in town knows.|Turn left at the big red bridge; it is a good ___.|The lighthouse was a ___ for sailors coming home.|location,route
  `,
};

/** batchesA are the vocabulary batches of the first five units of grade 3. */
export const batchesA: readonly Grade3Batch[] = [
  folkTales,
  feelings,
  farms,
  growth,
  animalBodies,
  animalGroups,
  danger,
  forecast,
  measuring,
  maps,
  landAndWater,
  places,
];
