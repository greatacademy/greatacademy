// Grades 3 to 5: the words of each unit's theme, ten to a batch, and words with more than one meaning.

import { type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { type BatchSpec, batchTopic, batchWords } from "../batch.ts";

const fromClues = [{ topic: "context-clues", weight: 0.1 }] as const;

const characterTraits: BatchSpec = {
  id: "words-for-character-traits",
  title: t("Words for Character Traits", "描述性格特点的词"),
  summary: t(
    "Ten words for what a character is like: generous, stubborn, timid, loyal and more.",
    "十个描述人物性格的词：generous、stubborn、timid、loyal 等。",
  ),
  domain: ["what characters in stories are like", "故事人物性格"],
  prerequisites: ["context-clues"],
  encompasses: fromClues,
  words: [
    {
      word: "generous",
      meaning: ["happy to give or share", "慷慨的，乐于给予或分享的"],
      sentences: [
        "Mia was so ___ that she gave half of her lunch to a friend who forgot his.",
        "Our ___ neighbor lent us his ladder and refused to take anything in return.",
        "It was ___ of you to share your umbrella with me in the rain.",
      ],
      confusions: ["greedy", "humble"],
    },
    {
      word: "stubborn",
      meaning: ["not willing to change your mind", "固执的，不肯改变主意的"],
      sentences: [
        "The ___ goat would not move off the bridge, no matter how hard the farmer pulled.",
        "My ___ little brother refused to wear a coat, even when it started to snow.",
        "No matter what anyone said, the ___ old man would not change his mind.",
      ],
      confusions: ["determined", "timid"],
    },
    {
      word: "timid",
      meaning: ["shy and easily frightened", "胆小的，容易害怕的"],
      sentences: [
        "The ___ kitten hid under the bed whenever a visitor came to the door.",
        "The ___ deer stepped out of the woods, then ran back at the first sound.",
        "Being ___, Jun spoke so softly that the teacher could hardly hear him.",
      ],
      confusions: ["cautious", "humble"],
    },
    {
      word: "boastful",
      meaning: ["talking too proudly about yourself", "爱吹嘘的，过分夸耀自己的"],
      sentences: [
        "The ___ hare told every animal in the forest that he was the fastest runner alive.",
        "Nobody wanted to play with the ___ boy who always said he was the best.",
        "After winning one game, the team became ___ and told everyone they could never lose.",
      ],
      confusions: ["generous", "curious"],
    },
    {
      word: "loyal",
      meaning: ["always standing by a friend or a group", "忠诚的，始终支持朋友或集体的"],
      sentences: [
        "The ___ dog waited by the gate every evening until its owner came home.",
        "Even when the others laughed at her, Kim stayed ___ to her best friend.",
        "The king trusted only his most ___ knight to guard the castle gate.",
      ],
      confusions: ["stubborn", "timid"],
      forms: ["loyalty"],
    },
    {
      word: "curious",
      meaning: ["eager to know or learn about something", "好奇的，渴望了解的"],
      sentences: [
        "The ___ boy opened the old box to find out what was making the ticking sound.",
        "The ___ monkey picked up the camera and pressed every button.",
        "Ever since she saw the stars through a telescope, Ana has been ___ about space.",
      ],
      confusions: ["cautious", "boastful"],
      forms: ["curiosity"],
    },
    {
      word: "cautious",
      meaning: ["careful to avoid danger", "谨慎的，小心避开危险的"],
      sentences: [
        "The ___ hiker tested each rock with her foot before she stepped on it.",
        "A ___ driver slows down when the road is icy.",
        "Be ___ when you cross the stream, because the stones are slippery.",
      ],
      confusions: ["timid", "curious"],
    },
    {
      word: "greedy",
      meaning: ["wanting more than you need", "贪婪的，想要超过所需的"],
      sentences: [
        "The ___ king already had a room full of gold, but he still wanted more.",
        "The ___ fox ate all the grapes and left none for the other animals.",
        "Do not be ___; take one cookie and leave the rest for your sisters.",
      ],
      confusions: ["boastful", "stubborn"],
    },
    {
      word: "humble",
      meaning: ["not thinking of yourself as better than others", "谦虚的，不认为自己比别人强的"],
      sentences: [
        "Although she won the prize, the ___ girl said her whole team deserved it.",
        "The famous singer was ___ and thanked the people who had helped her.",
        "Even after he became the best player on the team, Omar stayed ___ and kind.",
      ],
      confusions: ["generous", "loyal"],
    },
    {
      word: "determined",
      meaning: ["having decided firmly to do something", "坚定的，下定决心要做某事的"],
      sentences: [
        "The ___ runner kept going after she fell and finished the race.",
        "Leila was ___ to learn to ride her bike before the summer ended.",
        "The ___ ant carried a crumb twice its size all the way to its nest.",
      ],
      confusions: ["stubborn", "cautious"],
    },
  ],
};

const waterCycle: BatchSpec = {
  id: "words-of-the-water-cycle",
  title: t("Words of the Water Cycle", "水循环的词"),
  summary: t(
    "Ten words for how water moves and is used: moisture, absorb, drought, reservoir and more.",
    "十个关于水的运动和利用的词：moisture、absorb、drought、reservoir 等。",
  ),
  domain: ["water and how it moves", "水及其运动"],
  prerequisites: ["context-clues"],
  encompasses: fromClues,
  words: [
    {
      word: "reservoir",
      forms: ["reservoirs"],
      meaning: ["a lake where water is stored for people to use", "水库，储存供人们使用的水的湖"],
      sentences: [
        "The town's drinking water is kept in a ___ behind the dam.",
        "When the ___ is low, the city asks people to use less water.",
        "Pipes carry water from the ___ in the hills to every house in town.",
      ],
      confusions: ["runoff", "droplet"],
    },
    {
      word: "droplet",
      forms: ["droplets"],
      meaning: ["a very small drop of liquid", "小水滴"],
      sentences: [
        "Each ___ in a cloud is far too small to fall as rain.",
        "A single ___ of dew hung from the tip of the blade of grass.",
        "Look closely and you can see one tiny ___ rolling down the window.",
      ],
      confusions: ["moisture", "reservoir"],
    },
    {
      word: "moisture",
      meaning: ["a small amount of water in the air, the soil or a thing", "湿气，空气、土壤或物体中的少量水分"],
      sentences: [
        "After the rain, there was still enough ___ in the soil for the seeds to grow.",
        "The bread went moldy because there was too much ___ in the bag.",
        "Cactus leaves are thick so that they can hold on to every bit of ___.",
      ],
      confusions: ["droplet", "drought"],
    },
    {
      word: "absorb",
      forms: ["absorbs", "absorbed", "absorbing"],
      meaning: ["to take in a liquid", "吸收（液体）"],
      sentences: [
        "A sponge can ___ a lot of water.",
        "Dry soil can ___ a light rain in just a few minutes.",
        "Use a paper towel to ___ the spilled milk.",
      ],
      confusions: ["seep", "condense"],
    },
    {
      word: "seep",
      forms: ["seeps", "seeped", "seeping"],
      meaning: ["to flow slowly through small holes or cracks", "渗出，慢慢从小孔或裂缝中流过"],
      sentences: [
        "Rainwater will slowly ___ through the sand into the ground below.",
        "Water began to ___ under the door during the flood.",
        "When the bucket cracked, water started to ___ out of the bottom.",
      ],
      confusions: ["absorb", "irrigate"],
    },
    {
      word: "irrigate",
      forms: ["irrigates", "irrigated", "irrigating", "irrigation"],
      meaning: ["to bring water to fields through pipes or ditches", "灌溉，用管道或沟渠把水引到田里"],
      sentences: [
        "Farmers dig ditches from the river to ___ their fields in the dry season.",
        "Without rain, the farmers had to ___ their rice fields with water from the canal.",
        "Long ago, Egyptians used buckets on poles to ___ the land by the river.",
      ],
      confusions: ["conserve", "seep"],
    },
    {
      word: "conserve",
      forms: ["conserves", "conserved", "conserving"],
      meaning: ["to use something carefully so it is not wasted", "节约，小心使用以免浪费"],
      sentences: [
        "We turn off the tap while brushing our teeth to ___ water.",
        "Taking shorter showers is one easy way to ___ water at home.",
        "Camels ___ water in their bodies so they can cross the desert.",
      ],
      confusions: ["absorb", "irrigate"],
    },
    {
      word: "drought",
      forms: ["droughts"],
      meaning: ["a long time with little or no rain", "干旱，长时间少雨或无雨"],
      sentences: [
        "During the ___, the river shrank and the grass turned brown.",
        "The ___ lasted three years, and many farms had no harvest.",
        "After the long ___, the first rain made everyone dance in the street.",
      ],
      confusions: ["runoff", "moisture"],
    },
    {
      word: "runoff",
      meaning: ["rainwater that flows over the ground instead of soaking in", "地表径流，在地面流走而没有渗入的雨水"],
      sentences: [
        "On the hard parking lot, the rain became ___ that rushed into the drain.",
        "Muddy ___ from the farm washed into the stream after the storm.",
        "Planting grass on the hill slows the ___ and lets the water soak in.",
      ],
      confusions: ["drought", "reservoir"],
    },
    {
      word: "condense",
      forms: ["condensed", "condensing"],
      meaning: ["to change from a gas into a liquid as it cools", "凝结，气体冷却后变成液体"],
      sentences: [
        "Water vapor will ___ into drops on the outside of a cold glass.",
        "On a cold morning, your breath seems to ___ into a little white cloud.",
        "Steam from the shower will ___ on the cool bathroom mirror.",
      ],
      confusions: ["absorb", "conserve"],
    },
  ],
};

const plantLife: BatchSpec = {
  id: "words-of-plant-life",
  title: t("Words of Plant Life", "植物生长的词"),
  summary: t(
    "Ten words for how plants grow and make seeds: sprout, nutrient, pollen, wilt and more.",
    "十个关于植物生长和结籽的词：sprout、nutrient、pollen、wilt 等。",
  ),
  domain: ["how plants grow", "植物的生长"],
  prerequisites: ["context-clues"],
  encompasses: fromClues,
  words: [
    {
      word: "sprout",
      forms: ["sprouts", "sprouted", "sprouting"],
      meaning: ["to begin to grow and show new shoots", "发芽，开始长出新芽"],
      sentences: [
        "A few days after we planted the beans, they began to ___.",
        "Leave a potato in a dark cupboard and it will ___ pale shoots.",
        "After the spring rain, new leaves began to ___ on every branch.",
      ],
      confusions: ["wilt", "pollinate"],
    },
    {
      word: "germinate",
      forms: ["germinates", "germinated", "germinating"],
      meaning: ["for a seed to start growing into a plant", "（种子）萌发，开始长成植物"],
      sentences: [
        "Most seeds need water and warmth before they ___.",
        "Some desert seeds wait years for rain before they ___.",
        "We kept the beans on a wet paper towel to watch them ___.",
      ],
      confusions: ["pollinate", "wilt"],
    },
    {
      word: "nutrient",
      forms: ["nutrients"],
      meaning: ["something in food or soil that a living thing needs to grow", "养分，生物生长所需的物质"],
      sentences: [
        "Roots take in water and each ___ the plant needs from the soil.",
        "Iron is one ___ that the plant gets from the soil.",
        "The farmer added compost so the soil would have every ___ the corn needed.",
      ],
      confusions: ["nectar", "pollen"],
    },
    {
      word: "pollen",
      meaning: ["a yellow powder made by flowers that helps make seeds", "花粉，花产生的帮助结籽的黄色粉末"],
      sentences: [
        "The bee's legs were covered in yellow ___ from the flowers.",
        "In spring, ___ from the trees makes some people sneeze.",
        "The wind blew ___ from one pine tree to another.",
      ],
      confusions: ["nectar", "nutrient"],
    },
    {
      word: "pollinate",
      forms: ["pollinates", "pollinated", "pollinating"],
      meaning: ["to carry pollen from one flower to another", "传粉，把花粉从一朵花带到另一朵花"],
      sentences: [
        "Bees and butterflies ___ flowers as they move from one to the next.",
        "Without bees to ___ them, the apple trees would make very little fruit.",
        "Some bats ___ flowers that open only at night.",
      ],
      confusions: ["germinate", "sprout"],
    },
    {
      word: "seedling",
      forms: ["seedlings"],
      meaning: ["a very young plant grown from a seed", "幼苗，刚从种子长出的小植物"],
      sentences: [
        "We moved each tiny ___ from its cup into the garden.",
        "Each ___ had only two small leaves when we planted it.",
        "Rabbits ate the young ___ before it could grow into a tree.",
      ],
      confusions: ["petal", "pollen"],
    },
    {
      word: "wilt",
      forms: ["wilts", "wilted", "wilting"],
      meaning: ["to droop and go limp from too little water", "枯萎，因缺水而下垂变软"],
      sentences: [
        "If you forget to water the flowers, their stems will ___.",
        "Lettuce will ___ quickly if you leave it in the hot sun.",
        "In the heat wave, the flowers began to ___ by noon.",
      ],
      confusions: ["sprout", "germinate"],
    },
    {
      word: "fertile",
      meaning: ["able to grow many strong plants", "肥沃的，能长出许多健壮植物的"],
      sentences: [
        "The dark, ___ soil by the river grew the best crops in the valley.",
        "The valley's ___ fields grew wheat, beans and melons.",
        "Farmers moved to the river because its banks were ___.",
      ],
      confusions: ["nutrient", "seedling"],
    },
    {
      word: "nectar",
      meaning: ["a sweet liquid inside flowers that bees and birds drink", "花蜜，花里蜜蜂和鸟爱喝的甜液"],
      sentences: [
        "The hummingbird pushed its long beak into the flower to drink the ___.",
        "Butterflies sip ___ through a long tube like a straw.",
        "Bees turn the ___ they collect into honey.",
      ],
      confusions: ["pollen", "nutrient"],
    },
    {
      word: "petal",
      forms: ["petals"],
      meaning: ["one of the colored parts around the middle of a flower", "花瓣，花朵中心周围有颜色的部分"],
      sentences: [
        "The rose had one red ___ that had fallen onto the table.",
        "She pulled off one ___ at a time and counted them.",
        "A single white ___ floated on the surface of the pond.",
      ],
      confusions: ["seedling", "pollen"],
    },
  ],
};

const ancientEgypt: BatchSpec = {
  id: "words-of-ancient-egypt",
  title: t("Words of Ancient Egypt", "古埃及的词"),
  summary: t(
    "Ten words for life and history in ancient Egypt: pharaoh, scribe, papyrus, artifact and more.",
    "十个关于古埃及生活和历史的词：pharaoh、scribe、papyrus、artifact 等。",
  ),
  domain: ["ancient Egypt", "古埃及"],
  prerequisites: ["context-clues"],
  encompasses: fromClues,
  words: [
    {
      word: "pharaoh",
      forms: ["pharaohs"],
      meaning: ["a king of ancient Egypt", "法老，古埃及的国王"],
      sentences: [
        "The ___ ruled all of Egypt and was treated almost like a god.",
        "When the old ___ died, his son became the new ruler of Egypt.",
        "The ___ ordered thousands of workers to build his pyramid.",
      ],
      confusions: ["scribe", "archaeologist"],
    },
    {
      word: "tomb",
      forms: ["tombs"],
      meaning: ["a room or building where a dead person is buried", "坟墓，安葬死者的房间或建筑"],
      sentences: [
        "The king was buried in a ___ deep inside the mountain.",
        "Robbers broke into the ___ and stole the king's gold.",
        "Paintings on the walls of the ___ showed the dead man's life.",
      ],
      confusions: ["dynasty", "mummy"],
    },
    {
      word: "scribe",
      forms: ["scribes"],
      meaning: ["a person whose job was to write things down", "书吏，以书写记录为职业的人"],
      sentences: [
        "Only a ___, who had studied for years, could write down the king's laws.",
        "The ___ sat cross-legged and counted the sacks of grain in the storehouse.",
        "Boys who wanted to become a ___ spent years copying signs at school.",
      ],
      confusions: ["pharaoh", "mummy"],
    },
    {
      word: "papyrus",
      meaning: ["a paper made from a river plant", "纸莎草纸，用河边植物做成的纸"],
      sentences: [
        "The scribe wrote the list on a long sheet of ___.",
        "Reeds of ___ grew thick along the banks of the Nile.",
        "This old letter, written on ___, is more than three thousand years old.",
      ],
      confusions: ["hieroglyph", "artifact"],
    },
    {
      word: "mummy",
      forms: ["mummies"],
      meaning: ["a dead body dried and wrapped in cloth to keep it from decaying", "木乃伊，经干燥并用布包裹以防腐的尸体"],
      sentences: [
        "The ___ was wrapped in hundreds of strips of linen.",
        "The museum's ___ lies in a glass case, still wrapped in its cloth.",
        "Before a body became a ___, it was dried with salt for many days.",
      ],
      confusions: ["tomb", "pharaoh"],
    },
    {
      word: "dynasty",
      forms: ["dynasties"],
      meaning: ["a series of rulers from the same family", "王朝，同一家族的一系列统治者"],
      sentences: [
        "Kings of the same family ruled for two hundred years, one ___ after another.",
        "Each ___ of Egypt began when a new family took the throne.",
        "The last king of the ___ had no children, so another family took over.",
      ],
      confusions: ["tomb", "obelisk"],
    },
    {
      word: "artifact",
      forms: ["artifacts"],
      meaning: ["an object made by people long ago", "文物，很久以前人们制作的物品"],
      sentences: [
        "This clay pot found in the sand is one ___ that tells us how people cooked.",
        "Every ___ in this room, from the combs to the sandals, came from one village.",
        "The museum label says this ___ is a toy horse made of wood.",
      ],
      confusions: ["papyrus", "hieroglyph"],
    },
    {
      word: "hieroglyph",
      forms: ["hieroglyphs"],
      meaning: ["a picture that stands for a word or a sound in Egyptian writing", "象形文字，埃及文字中代表一个词或一个音的图形"],
      sentences: [
        "Each ___ on the wall, such as the owl or the eye, stood for a sound or a word.",
        "The scribe painted a ___ shaped like a bird to stand for a sound.",
        "Each ___ on the stone was carved carefully by hand.",
      ],
      confusions: ["papyrus", "scribe"],
    },
    {
      word: "archaeologist",
      forms: ["archaeologists"],
      meaning: ["a scientist who studies the past by digging up what people left behind", "考古学家，通过发掘古人遗物来研究过去的科学家"],
      sentences: [
        "The ___ brushed away the sand to uncover an old wall.",
        "The ___ wrote down exactly where each piece of pottery was found.",
        "After years of digging, the ___ finally found the lost city.",
      ],
      confusions: ["scribe", "pharaoh"],
    },
    {
      word: "obelisk",
      forms: ["obelisks"],
      meaning: ["a tall stone pillar with four sides and a pointed top", "方尖碑，四面、顶端尖的高石柱"],
      sentences: [
        "In front of the temple stood a tall, pointed ___ carved from a single stone.",
        "Workers used ramps and ropes to stand the heavy ___ upright.",
        "The ___ was carved from one block of pink granite and covered in writing.",
      ],
      confusions: ["tomb", "artifact"],
    },
  ],
};

const weatherScience: BatchSpec = {
  id: "words-of-weather-science",
  title: t("Words of Weather Science", "气象的词"),
  summary: t(
    "Ten words for describing and measuring weather: humidity, precipitation, gust, blizzard and more.",
    "十个描述和测量天气的词：humidity、precipitation、gust、blizzard 等。",
  ),
  domain: ["weather", "天气"],
  prerequisites: ["context-clues"],
  encompasses: fromClues,
  words: [
    {
      word: "humidity",
      meaning: ["the amount of water vapor in the air", "湿度，空气中水蒸气的多少"],
      sentences: [
        "On summer days with high ___, the air feels heavy and damp.",
        "The ___ was so high that our clothes would not dry on the line.",
        "Desert air has very low ___, so your skin feels dry there.",
      ],
      confusions: ["precipitation", "drizzle"],
    },
    {
      word: "precipitation",
      meaning: ["water that falls from clouds, such as rain, snow or hail", "降水，从云中落下的水，如雨、雪、冰雹"],
      sentences: [
        "Rain, snow and sleet are all kinds of ___.",
        "The desert gets less than ten inches of ___ in a whole year.",
        "The weather report said there was a small chance of ___ this afternoon.",
      ],
      confusions: ["humidity", "monsoon"],
    },
    {
      word: "barometer",
      forms: ["barometers"],
      meaning: ["a tool that measures the pressure of the air", "气压计，测量气压的仪器"],
      sentences: [
        "When the ___ shows the air pressure falling, a storm may be coming.",
        "Sailors once checked the ___ to know whether a storm was coming.",
        "The needle on the ___ dropped quickly before the hurricane arrived.",
      ],
      confusions: ["meteorologist", "humidity"],
    },
    {
      word: "meteorologist",
      forms: ["meteorologists"],
      meaning: ["a scientist who studies and predicts the weather", "气象学家，研究并预报天气的科学家"],
      sentences: [
        "The ___ on the news said it would snow tomorrow.",
        "A ___ studies maps of the wind and clouds to predict the weather.",
        "The ___ warned that the river might flood after three days of rain.",
      ],
      confusions: ["barometer", "monsoon"],
    },
    {
      word: "gust",
      forms: ["gusts"],
      meaning: ["a sudden, strong rush of wind", "一阵狂风，突然的强风"],
      sentences: [
        "A ___ of wind blew my hat right off my head.",
        "A sudden ___ slammed the door shut.",
        "One strong ___ lifted the kite high above the trees.",
      ],
      confusions: ["tornado", "drizzle"],
    },
    {
      word: "drizzle",
      meaning: ["light rain with very small drops", "毛毛雨，雨滴很小的小雨"],
      sentences: [
        "It was only a light ___, so we did not need an umbrella.",
        "The ___ was so light that it barely wet the sidewalk.",
        "We kept playing soccer in the gentle ___.",
      ],
      confusions: ["sleet", "blizzard"],
    },
    {
      word: "sleet",
      meaning: ["rain that freezes into small pieces of ice as it falls", "冻雨，下落时冻成小冰粒的雨"],
      sentences: [
        "The ___ made little ice pellets bounce on the car's roof.",
        "The ___ froze on the power lines and made the roads slippery.",
        "It was too warm for snow and too cold for rain, so we got ___.",
      ],
      confusions: ["drizzle", "blizzard"],
    },
    {
      word: "blizzard",
      forms: ["blizzards"],
      meaning: ["a long, heavy snowstorm with strong winds", "暴风雪，伴有强风的长时间大雪"],
      sentences: [
        "During the ___, the wind blew so much snow that no one could see the road.",
        "Schools closed because the ___ had buried the roads in snow.",
        "The climbers waited in their tent until the ___ ended.",
      ],
      confusions: ["tornado", "sleet"],
    },
    {
      word: "tornado",
      forms: ["tornadoes"],
      meaning: ["a spinning column of wind that reaches down from a storm cloud", "龙卷风，从雷雨云中伸下来的旋转气柱"],
      sentences: [
        "The ___ spun across the field, tearing up trees in a narrow path.",
        "When the ___ siren sounded, we hurried to the basement.",
        "The ___ touched down for only a minute but lifted a barn roof.",
      ],
      confusions: ["gust", "blizzard"],
    },
    {
      word: "monsoon",
      forms: ["monsoons"],
      meaning: ["a wind that changes with the seasons and brings a season of heavy rain", "季风，随季节变化并带来雨季的风"],
      sentences: [
        "When the ___ arrives each summer, weeks of heavy rain fill the rivers.",
        "Farmers plant their rice when the ___ begins.",
        "During the ___, the streets of the city sometimes turn into rivers.",
      ],
      confusions: ["precipitation", "tornado"],
    },
  ],
};

const animalSurvival: BatchSpec = {
  id: "words-of-animal-survival",
  title: t("Words of Animal Survival", "动物生存的词"),
  summary: t(
    "Ten words for how animals stay alive: adapt, camouflage, predator, migrate and more.",
    "十个关于动物如何生存的词：adapt、camouflage、predator、migrate 等。",
  ),
  domain: ["how animals survive", "动物的生存"],
  prerequisites: ["context-clues"],
  encompasses: fromClues,
  words: [
    {
      word: "adapt",
      forms: ["adapts", "adapted", "adapting", "adaptation", "adaptations"],
      meaning: ["to change in ways that help you live in a place", "适应，为在某处生存而改变"],
      sentences: [
        "Over many years, the animals on the island began to ___ to the cold.",
        "Animals that cannot ___ to a warmer climate may move north.",
        "City pigeons ___ easily to living on buildings instead of cliffs.",
      ],
      confusions: ["migrate", "hibernate"],
    },
    {
      word: "camouflage",
      meaning: ["colors or patterns that help an animal blend in with its surroundings", "伪装，帮助动物与周围融为一体的颜色或花纹"],
      sentences: [
        "The moth's brown ___ made it look just like the tree bark.",
        "The snowy owl's white feathers are perfect ___ in the Arctic.",
        "A chameleon changes its ___ to match the leaves it sits on.",
      ],
      confusions: ["instinct", "habitat"],
    },
    {
      word: "predator",
      forms: ["predators"],
      meaning: ["an animal that hunts other animals for food", "捕食者，捕猎其他动物为食的动物"],
      sentences: [
        "The owl is a ___ that hunts mice at night.",
        "The shark is a ___ at the top of the ocean food chain.",
        "A rabbit freezes when it sees a ___ circling overhead.",
      ],
      confusions: ["prey", "habitat"],
    },
    {
      word: "prey",
      meaning: ["an animal that is hunted by another for food", "猎物，被其他动物捕食的动物"],
      sentences: [
        "Rabbits are ___ for foxes, hawks and many other hunters.",
        "The hawk's sharp eyes can spot its ___ from high in the sky.",
        "Small fish are ___ for bigger fish, birds and seals.",
      ],
      confusions: ["predator", "burrow"],
    },
    {
      word: "hibernate",
      forms: ["hibernates", "hibernated", "hibernating"],
      meaning: ["to sleep through the winter", "冬眠，在冬天里沉睡"],
      sentences: [
        "Some bears ___ in a den until spring.",
        "Before they ___, groundhogs eat as much as they can.",
        "Some frogs ___ in the mud at the bottom of a pond.",
      ],
      confusions: ["migrate", "adapt"],
    },
    {
      word: "migrate",
      forms: ["migrates", "migrated", "migrating", "migration"],
      meaning: ["to travel a long way to a new place when the season changes", "迁徙，随季节变化长途迁往新地方"],
      sentences: [
        "Every autumn, the geese ___ south to warmer lakes.",
        "Monarch butterflies ___ thousands of miles to spend the winter in Mexico.",
        "Whales ___ to warm waters to have their babies.",
      ],
      confusions: ["hibernate", "burrow"],
    },
    {
      word: "habitat",
      forms: ["habitats"],
      meaning: ["the natural home of an animal or plant", "栖息地，动植物的自然家园"],
      sentences: [
        "The rainforest is the ___ of many frogs, birds and monkeys.",
        "Cutting down the forest destroyed the ___ of the orangutans.",
        "A pond is the perfect ___ for frogs and dragonflies.",
      ],
      confusions: ["burrow", "camouflage"],
    },
    {
      word: "instinct",
      forms: ["instincts"],
      meaning: ["something an animal knows how to do without being taught", "本能，动物无须学习就会做的事"],
      sentences: [
        "No one teaches a baby turtle to crawl toward the sea; it does so by ___.",
        "A spider does not learn to spin a web; it follows its ___.",
        "When a puppy sees a ball roll, its ___ is to chase it.",
      ],
      confusions: ["camouflage", "adapt"],
    },
    {
      word: "burrow",
      forms: ["burrows", "burrowed", "burrowing"],
      meaning: ["a hole or tunnel an animal digs to live in", "洞穴，动物挖来居住的洞或地道"],
      sentences: [
        "The rabbit escaped into its ___ under the hedge.",
        "The fox dug a ___ under the roots of an old tree.",
        "Prairie dogs stand guard at the mouth of their ___.",
      ],
      confusions: ["habitat", "prey"],
    },
    {
      word: "nocturnal",
      meaning: ["active at night and asleep during the day", "夜行的，夜间活动、白天睡觉的"],
      sentences: [
        "Bats are ___, so they sleep all day and fly out after dark.",
        "Owls are ___ hunters that use their sharp hearing in the dark.",
        "Because raccoons are ___, you rarely see them at noon.",
      ],
      confusions: ["instinct", "predator"],
    },
  ],
};

const bodySystems: BatchSpec = {
  id: "words-of-the-body-systems",
  title: t("Words of the Body's Systems", "人体系统的词"),
  summary: t(
    "Ten words for the parts of the body and how they work: organ, tissue, artery, pulse and more.",
    "十个关于身体部位及其功能的词：organ、tissue、artery、pulse 等。",
  ),
  domain: ["the human body", "人体"],
  prerequisites: ["context-clues"],
  encompasses: fromClues,
  words: [
    {
      word: "organ",
      forms: ["organs"],
      meaning: ["a part of the body that does a special job, such as the heart", "器官，身体中担负特定工作的部分，如心脏"],
      sentences: [
        "The stomach is the ___ that breaks down the food you swallow.",
        "The skin is the largest ___ of the human body.",
        "The heart is the ___ that pumps blood.",
      ],
      confusions: ["tissue", "skeleton"],
    },
    {
      word: "skeleton",
      forms: ["skeletons"],
      meaning: ["all the bones of a body joined together", "骨骼，全身连在一起的骨头"],
      sentences: [
        "Your ___ holds your body up and protects the soft parts inside.",
        "A shark's ___ is made of rubbery cartilage instead of bone.",
        "The museum showed the whole ___ of a dinosaur.",
      ],
      confusions: ["spine", "organ"],
    },
    {
      word: "tissue",
      forms: ["tissues"],
      meaning: ["a group of cells of the same kind that work together", "组织，一起工作的同类细胞群"],
      sentences: [
        "Muscle ___ is made of long cells that can pull.",
        "When you cut your finger, new ___ grows to close the wound.",
        "Bone ___ is hard because it contains a lot of calcium.",
      ],
      confusions: ["organ", "ligament"],
    },
    {
      word: "artery",
      forms: ["arteries"],
      meaning: ["a tube that carries blood away from the heart", "动脉，把血液从心脏运出的血管"],
      sentences: [
        "Each beat of the heart pushes blood out into the ___ that leaves it.",
        "The biggest ___ in the body leaves the heart and carries blood down to the legs.",
        "The doctor felt the ___ in my neck to check how fast my heart was beating.",
      ],
      confusions: ["vein", "spine"],
    },
    {
      word: "vein",
      forms: ["veins"],
      meaning: ["a tube that carries blood back to the heart", "静脉，把血液送回心脏的血管"],
      sentences: [
        "The blue line under the skin of your wrist is a ___ taking blood back to your heart.",
        "The nurse took a little blood from a ___ in my arm.",
        "Blood in a ___ is on its way back to the heart.",
      ],
      confusions: ["spine", "ligament"],
    },
    {
      word: "spine",
      forms: ["spines"],
      meaning: ["the row of bones down the middle of your back", "脊柱，背部中间的一串骨头"],
      sentences: [
        "Sit up straight so that your ___ is not bent over the desk.",
        "Each bone of your ___ has a hole in it for the nerves to pass through.",
        "Animals with a ___, such as fish and birds, are called vertebrates.",
      ],
      confusions: ["skeleton", "vein"],
    },
    {
      word: "saliva",
      meaning: ["the liquid in your mouth that starts to break down food", "唾液，口中开始分解食物的液体"],
      sentences: [
        "Chewing mixes your food with ___, which makes it soft enough to swallow.",
        "The smell of baking bread made my mouth fill with ___.",
        "Dogs use ___ to keep their mouths wet when they pant.",
      ],
      confusions: ["pulse", "tissue"],
    },
    {
      word: "pulse",
      meaning: ["the beat of blood you can feel at your wrist or neck", "脉搏，在手腕或颈部能感觉到的血液跳动"],
      sentences: [
        "After the race, the nurse pressed two fingers on my wrist to count my ___.",
        "My ___ was fast after I ran up the stairs.",
        "You can feel your ___ by pressing gently on the side of your neck.",
      ],
      confusions: ["saliva", "vein"],
    },
    {
      word: "immune",
      forms: ["immunity"],
      meaning: ["protected from a sickness", "免疫的，不受某种疾病侵害的"],
      sentences: [
        "Once you have had chickenpox, your body is usually ___ to it.",
        "A vaccine helps make your body ___ to a disease.",
        "Some people are ___ to the cold that everyone else in the class caught.",
      ],
      confusions: ["saliva", "pulse"],
    },
    {
      word: "ligament",
      forms: ["ligaments"],
      meaning: ["a strong band that holds two bones together at a joint", "韧带，在关节处把两块骨头连在一起的坚韧组织"],
      sentences: [
        "She twisted her ankle and stretched the ___ that holds the bones together.",
        "The soccer player tore a ___ in her knee and could not play for months.",
        "A ___ is like a strong rope that ties bones together.",
      ],
      confusions: ["tissue", "vein"],
    },
  ],
};

const earthScience: BatchSpec = {
  id: "words-of-earth-science",
  title: t("Words of Earth Science", "地球科学的词"),
  summary: t(
    "Ten words for how the land is made and changed: erode, sediment, magma, dormant and more.",
    "十个关于陆地如何形成和改变的词：erode、sediment、magma、dormant 等。",
  ),
  domain: ["how the earth changes", "地球的变化"],
  prerequisites: ["context-clues"],
  encompasses: fromClues,
  words: [
    {
      word: "erode",
      forms: ["erodes", "eroded", "eroding"],
      meaning: ["to wear away slowly by water, wind or ice", "侵蚀，被水、风或冰慢慢磨损"],
      sentences: [
        "Year after year, the waves ___ the cliff, and it moves farther back.",
        "Wind and sand slowly ___ the soft rock into strange shapes.",
        "Without roots to hold it, the soil on the hill will ___ in the rain.",
      ],
      confusions: ["tremor", "sediment"],
    },
    {
      word: "sediment",
      forms: ["sediments"],
      meaning: ["bits of sand, mud and rock carried and dropped by water or wind", "沉积物，被水或风带来又放下的沙、泥和碎石"],
      sentences: [
        "The river dropped a layer of ___ where it slowed down near the sea.",
        "Layers of ___ at the bottom of the lake turned into rock over time.",
        "The muddy river carries ___ all the way to the sea.",
      ],
      confusions: ["magma", "pebble"],
    },
    {
      word: "magma",
      meaning: ["melted rock deep under the ground", "岩浆，地下深处熔化的岩石"],
      sentences: [
        "Hot ___ rises from deep inside the earth and pushes up under the volcano.",
        "When ___ cools slowly underground, it forms rocks with large crystals.",
        "Deep below the volcano is a chamber full of ___.",
      ],
      confusions: ["sediment", "boulder"],
    },
    {
      word: "tremor",
      forms: ["tremors"],
      meaning: ["a small shaking of the ground", "轻微震动，地面的小幅晃动"],
      sentences: [
        "We felt a small ___ that rattled the dishes, but nothing broke.",
        "The scientists' tools recorded a ___ too small for people to feel.",
        "One ___ followed another all night after the big earthquake.",
      ],
      confusions: ["crater", "landform"],
    },
    {
      word: "crater",
      forms: ["craters"],
      meaning: ["a bowl-shaped hole, such as the top of a volcano", "火山口或坑，碗状的洞，如火山顶部"],
      sentences: [
        "Smoke rose from the ___ at the top of the volcano.",
        "A falling rock from space left a huge ___ in the desert.",
        "Rain filled the old ___ at the top of the volcano and made a lake.",
      ],
      confusions: ["boulder", "tremor"],
    },
    {
      word: "boulder",
      forms: ["boulders"],
      meaning: ["a very large rock", "巨石，很大的岩石"],
      sentences: [
        "A ___ as big as a car had rolled down the hill and blocked the road.",
        "The children climbed onto a giant ___ to look out over the valley.",
        "The glacier carried that ___ for hundreds of miles before the ice melted.",
      ],
      confusions: ["pebble", "crater"],
    },
    {
      word: "pebble",
      forms: ["pebbles"],
      meaning: ["a small, smooth stone", "鹅卵石，小而光滑的石头"],
      sentences: [
        "I picked up a smooth, round ___ from the beach and put it in my pocket.",
        "The ___ skipped three times across the pond.",
        "A ___ in my shoe made every step hurt.",
      ],
      confusions: ["boulder", "sediment"],
    },
    {
      word: "molten",
      meaning: ["melted by great heat", "熔化的，被高温熔化的"],
      sentences: [
        "The ___ lava glowed orange as it flowed down the mountain.",
        "The worker poured ___ glass into a mold to make a bottle.",
        "Deep inside the earth, iron is so hot that it is ___.",
      ],
      confusions: ["dormant", "magma"],
    },
    {
      word: "dormant",
      meaning: ["not active now, but able to become active again", "休眠的，现在不活动但可能再活动的"],
      sentences: [
        "The volcano has been ___ for two hundred years, but it could erupt again.",
        "A ___ volcano may be quiet for centuries before it erupts.",
        "The bulbs stay ___ under the frozen ground all winter.",
      ],
      confusions: ["molten", "crater"],
    },
    {
      word: "landform",
      forms: ["landforms"],
      meaning: ["a natural shape of the land, such as a hill, valley or plain", "地貌，陆地的自然形状，如山丘、山谷或平原"],
      sentences: [
        "A valley is a ___ that is low land between hills or mountains.",
        "A plateau is a flat, high ___ with steep sides.",
        "Which ___ is shaped like a triangle where a river meets the sea?",
      ],
      confusions: ["crater", "sediment"],
    },
  ],
};

const solarSystem: BatchSpec = {
  id: "words-of-the-solar-system",
  title: t("Words of the Solar System", "太阳系的词"),
  summary: t(
    "Ten words for the sun, the planets and how we study them: orbit, axis, comet, gravity and more.",
    "十个关于太阳、行星以及我们如何研究它们的词：orbit、axis、comet、gravity 等。",
  ),
  domain: ["space and the solar system", "太空和太阳系"],
  prerequisites: ["context-clues"],
  encompasses: fromClues,
  words: [
    {
      word: "orbit",
      forms: ["orbits", "orbited", "orbiting"],
      meaning: ["the curved path one object travels around another in space", "轨道，太空中一个物体绕另一个物体运行的弯曲路径"],
      sentences: [
        "It takes the earth one year to travel all the way around its ___.",
        "The moon takes about a month to finish one ___ around the earth.",
        "The space station's ___ carries it around the earth every ninety minutes.",
      ],
      confusions: ["axis", "galaxy"],
    },
    {
      word: "axis",
      meaning: ["an imaginary line through the middle of a planet that it spins around", "自转轴，穿过行星中心、行星绕之旋转的假想线"],
      sentences: [
        "The earth spins around its ___ once every day.",
        "The earth's ___ is tilted, which is why we have seasons.",
        "Uranus is tipped so far over that its ___ points almost at the sun.",
      ],
      confusions: ["orbit", "gravity"],
    },
    {
      word: "rotate",
      forms: ["rotates", "rotated", "rotating", "rotation"],
      meaning: ["to spin around a center", "旋转，绕着中心转动"],
      sentences: [
        "As the earth begins to ___, our side turns away from the sun and night falls.",
        "Watch the wheels ___ as the bike rolls downhill.",
        "Venus takes longer to ___ once than to travel around the sun.",
      ],
      confusions: ["orbit", "gravity"],
    },
    {
      word: "galaxy",
      forms: ["galaxies"],
      meaning: ["a huge group of billions of stars", "星系，由数十亿颗恒星组成的巨大群体"],
      sentences: [
        "Our sun is just one of billions of stars in our ___.",
        "The Milky Way is the ___ that our solar system belongs to.",
        "Through a large telescope, a faraway ___ looks like a faint spiral of light.",
      ],
      confusions: ["constellation", "orbit"],
    },
    {
      word: "comet",
      forms: ["comets"],
      meaning: ["a ball of ice and dust that grows a glowing tail near the sun", "彗星，靠近太阳时会长出发光尾巴的冰尘球"],
      sentences: [
        "As the ___ came close to the sun, its long, bright tail grew.",
        "People were frightened long ago when a ___ with a glowing tail appeared in the sky.",
        "The ___ returns near the sun only once every seventy-six years.",
      ],
      confusions: ["galaxy", "constellation"],
    },
    {
      word: "asteroid",
      forms: ["asteroids"],
      meaning: ["a rocky object, smaller than a planet, that travels around the sun", "小行星，比行星小、绕太阳运行的岩石天体"],
      sentences: [
        "The ___ is a lump of rock about as wide as a city, with no tail at all.",
        "Most of them are found in a belt between Mars and Jupiter, but this ___ came closer to the earth.",
        "Scientists sent a spacecraft to collect dust from an old rocky ___.",
      ],
      confusions: ["comet", "constellation"],
    },
    {
      word: "telescope",
      forms: ["telescopes"],
      meaning: ["a tool that makes faraway things look closer", "望远镜，让远处物体看起来更近的工具"],
      sentences: [
        "Through the ___, we could see the rings around Saturn.",
        "Galileo pointed his ___ at Jupiter and saw four moons.",
        "A giant ___ in space sends back pictures of faraway stars.",
      ],
      confusions: ["astronaut", "axis"],
    },
    {
      word: "astronaut",
      forms: ["astronauts"],
      meaning: ["a person trained to travel into space", "宇航员，受过训练能进入太空的人"],
      sentences: [
        "The ___ floated inside the space station and waved at the camera.",
        "Before the launch, the ___ trained for years.",
        "Every ___ must exercise every day in space to keep her bones strong.",
      ],
      confusions: ["telescope", "comet"],
    },
    {
      word: "gravity",
      meaning: ["the force that pulls things toward each other, such as toward the ground", "引力，使物体相互吸引的力，如被拉向地面"],
      sentences: [
        "When you drop a ball, ___ pulls it down to the floor.",
        "The moon's weak ___ lets astronauts jump very high.",
        "Without ___, the oceans would float away from the earth.",
      ],
      confusions: ["axis", "orbit"],
    },
    {
      word: "constellation",
      forms: ["constellations"],
      meaning: ["a group of stars that seems to form a picture in the sky", "星座，在天空中看似组成图案的一群星"],
      sentences: [
        "The seven bright stars of the ___ look like a big spoon.",
        "Sailors used the ___ called the Southern Cross to find their way.",
        "Can you find the ___ shaped like a hunter with a belt of three stars?",
      ],
      confusions: ["galaxy", "asteroid"],
    },
  ],
};

/** batches are the vocabulary batches of grades 3 to 5, one for each unit. */
const batches: readonly BatchSpec[] = [
  characterTraits,
  waterCycle,
  plantLife,
  ancientEgypt,
  weatherScience,
  animalSurvival,
  bodySystems,
  earthScience,
  solarSystem,
];

/** Sense is one meaning of a word with more than one, with two sentences that use the word in it. */
type Sense = readonly [meaning: string, sentences: readonly [string, string]];

const manyMeanings: readonly (readonly [word: string, senses: readonly [Sense, Sense, Sense]])[] = [
  [
    "bark",
    [
      ["the sharp sound a dog makes", ["The dog's bark woke the whole house.", "We heard a loud bark from the yard next door."]],
      [
        "the rough outside of a tree trunk",
        ["Moss grew on the bark of the old oak.", "The deer rubbed its antlers on the bark of a pine."],
      ],
      [
        "to give an order in a short, angry voice",
        ["The captain began to bark orders at the sailors.", "Please do not bark at me; ask nicely."],
      ],
    ],
  ],
  [
    "bank",
    [
      [
        "the land along the side of a river",
        ["We sat on the bank and watched the river flow by.", "A turtle climbed up the muddy bank of the stream."],
      ],
      ["a business that keeps money safe", ["She put her coins in the bank downtown.", "Dad went to the bank to open a savings account."]],
      [
        "a long pile or mass of something, such as snow or clouds",
        ["The plow pushed the snow into a high bank by the road.", "A dark bank of clouds rolled in from the west."],
      ],
    ],
  ],
  [
    "bat",
    [
      ["a stick used to hit a ball", ["The player swung the bat and hit the ball far.", "Hold the bat with both hands."]],
      [
        "a small flying animal that comes out at night",
        ["A bat hung upside down in the cave.", "At dusk, a bat swooped over the pond to catch insects."],
      ],
      [
        "to take a turn at hitting the ball in a game",
        ["It is your turn to bat, so pick up a helmet.", "Our best hitter will bat last in this inning."],
      ],
    ],
  ],
  [
    "light",
    [
      ["to make something start burning", ["Please light the candle on the table.", "Grandpa used a match to light the campfire."]],
      ["not heavy", ["The box was so light that I lifted it with one finger.", "Pack a light bag for the short hike."]],
      ["pale in color", ["She painted her room a light blue.", "He wore a light gray shirt that looked almost white."]],
    ],
  ],
  [
    "fair",
    [
      ["treating everyone in the same way", ["It is only fair that everyone gets a turn.", "The referee made a fair call in the game."]],
      ["a show with rides, games and farm animals", ["We rode the big wheel at the county fair.", "Her pig won a ribbon at the fair."]],
      [
        "light in color, used about skin or hair",
        ["She has fair hair and blue eyes.", "People with fair skin can burn quickly in the sun."],
      ],
    ],
  ],
  [
    "ring",
    [
      ["the sound a bell makes", ["I heard the ring of the school bell.", "The ring of the phone woke the baby."]],
      ["a band worn on a finger", ["He wore a gold ring on his finger.", "Grandma gave me her silver ring."]],
      ["a circle of people or things", ["The children sat in a ring on the grass.", "A ring of stones circled the campfire."]],
    ],
  ],
  [
    "wave",
    [
      ["to move your hand to say hello or goodbye", ["Wave to Grandpa from the window.", "I saw my friend wave from the bus."]],
      ["a moving ridge of water on the sea", ["A big wave crashed on the beach.", "The surfer rode a tall wave to the shore."]],
      ["a soft curve in hair", ["Her hair had a soft wave in it.", "The barber combed a neat wave into his hair."]],
    ],
  ],
  [
    "trunk",
    [
      ["the long nose of an elephant", ["The elephant lifted the log with its trunk.", "The baby elephant sprayed water from its trunk."]],
      [
        "the space at the back of a car for bags",
        ["We packed the bags into the trunk of the car.", "Dad closed the trunk and started the engine."],
      ],
      ["the thick main stem of a tree", ["The trunk of the oak was too wide to hug.", "A woodpecker drummed on the trunk of the maple."]],
    ],
  ],
  [
    "spring",
    [
      ["the season after winter", ["The flowers bloom every spring.", "Birds build their nests in the spring."]],
      ["a coil of metal that bounces back", ["The spring in the old mattress was broken.", "A tight spring makes the toy jump."]],
      [
        "a place where water comes up from the ground",
        ["We drank cold water from a spring in the hills.", "The hikers filled their bottles at a mountain spring."],
      ],
    ],
  ],
  [
    "match",
    [
      ["a game between two players or teams", ["Our team won the soccer match.", "The tennis match lasted three hours."]],
      ["a small stick that makes a flame when struck", ["Strike the match to light the fire.", "Only an adult should use a match."]],
      ["to go well together or be the same", ["These socks do not match.", "Does this hat match my coat?"]],
    ],
  ],
  [
    "scale",
    [
      ["a tool for weighing things", ["Put the apples on the scale to see how heavy they are.", "The nurse weighed me on a scale."]],
      [
        "one of the small, hard plates on a fish or snake",
        ["A shiny silver scale fell from the fish.", "Each scale on the snake's back was green."],
      ],
      [
        "the part of a map that shows how far real distances are",
        ["The map's scale shows that one inch stands for one mile.", "Use the scale to find how far the town is from the lake."],
      ],
    ],
  ],
  [
    "current",
    [
      [
        "water or air moving in one direction",
        ["The current pulled the raft down the river.", "A strong current carried the swimmer away from shore."],
      ],
      ["a flow of electricity", ["An electric current runs through the wire.", "The switch stops the current from reaching the lamp."]],
      ["happening or true now", ["Read the current news on the board.", "Is this the current list of club members?"]],
    ],
  ],
];

/** bolden marks the word in a sentence in bold. */
const bolden = (sentence: string, word: string) => sentence.replace(new RegExp(`\\b(${word})\\b`, "i"), "**$1**");

// Items go word by word within each round, so consecutive seeds never show the same word.
const meaningInSentenceBank: readonly ChoiceItem[] = ([0, 1] as const).flatMap((r) =>
  [0, 1, 2].flatMap((m) =>
    manyMeanings.map(([word, senses]): ChoiceItem => {
      const [meaning, sentences] = senses[m] as Sense;
      return [bolden(sentences[r], word), meaning, senses.filter((_, k) => k !== m).map(([other]) => other)];
    }),
  ),
);

const sameWordBank: readonly ChoiceItem[] = ([0, 1] as const).flatMap((r) =>
  [0, 1, 2].flatMap((m) =>
    manyMeanings.map(([word, senses]): ChoiceItem => {
      const [meaning, sentences] = senses[m] as Sense;
      return [
        `In which sentence does **${word}** mean *${meaning}*?`,
        sentences[r],
        senses.filter((_, k) => k !== m).map(([, other]) => other[r]),
      ];
    }),
  ),
);

const multipleMeanings: TopicDef = {
  id: "multiple-meaning-words",
  title: t("Words with More Than One Meaning", "多义词"),
  summary: t(
    "Many words have more than one meaning; the rest of the sentence tells you which one is meant.",
    "许多词有不止一个意思；句子的其余部分会告诉你是哪一个。",
  ),
  prerequisites: ["context-clues"],
  encompasses: [{ topic: "context-clues", weight: 0.3 }],
  xp: 10,
  strand: "vocabulary",
  knowledgePoints: [
    point(
      "meaning-in-the-sentence",
      t("The Meaning in a Sentence", "句中的意思"),
      t(
        "Many words are spelled and said the same but mean different things: a dog's **bark** and a tree's **bark**. The dictionary lists each meaning separately. To know which one a writer means, look at the other words in the sentence: *Moss grew on the bark of the old oak* is about a tree, so *bark* is its rough outside.",
        "许多词拼写和读音相同，意思却不同：狗的 **bark**（叫声）和树的 **bark**（树皮）。词典会把每个意思分开列出。要知道作者用的是哪个意思，就看句中的其他词：*Moss grew on the bark of the old oak* 说的是树，所以 *bark* 指树皮。",
      ),
      choiceGenerator(
        t("What does the word in bold mean in this sentence?", "加粗的词在这个句子里是什么意思？"),
        meaningInSentenceBank,
        (right, shown) =>
          t(
            `Here it means **${right}**. The other words of the sentence point to this meaning: ${shown}`,
            `这里的意思是 **${right}**。句中的其他词指向这个意思：${shown}`,
          ),
        (wrong) =>
          t(
            `“${wrong}” is another meaning of the word, or no meaning of it at all; nothing else in this sentence points to it.`,
            `“${wrong}” 是这个词的另一个意思，或者根本不是它的意思；句中没有别的词指向它。`,
          ),
      ),
    ),
    point(
      "same-word-different-sentences",
      t("One Word, Several Sentences", "一个词，几个句子"),
      t(
        "When the same word appears in several sentences, test the meaning you are looking for in each one. Put the meaning in place of the word and read the sentence again: *It is only just, treating everyone the same, that everyone gets a turn* makes sense, so that sentence uses **fair** in that meaning.",
        "同一个词出现在几个句子里时，把你要找的意思逐一代入。用这个意思替换这个词，再读一遍：*It is only just, treating everyone the same, that everyone gets a turn* 说得通，所以这个句子用的是 **fair** 的这个意思。",
      ),
      choiceGenerator(
        t("Choose the sentence.", "选择句子。"),
        sameWordBank,
        (right) =>
          t(
            `**${right}** Put the meaning in place of the word, and only this sentence still makes sense.`,
            `**${right}** 用这个意思替换这个词，只有这个句子仍然说得通。`,
          ),
        (wrong) =>
          t(
            `In “${wrong}”, the word has a different meaning. Put the meaning you are looking for in its place and read it again.`,
            `在“${wrong}”中，这个词是另一个意思。把你要找的意思代入它的位置再读一遍。`,
          ),
      ),
    ),
  ],
};

/** wordTopics35 are the vocabulary topics of grades 3 to 5. */
export const wordTopics35: readonly TopicDef[] = [...batches.map(batchTopic), multipleMeanings];

/** vocabulary35 are the words the batches of grades 3 to 5 teach. */
export const vocabulary35: readonly WordBatch[] = batches.map(batchWords);
