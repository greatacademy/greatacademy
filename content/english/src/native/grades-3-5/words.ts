// Grades 3 to 5: the words of each unit's theme, ten to a batch, and words with more than one meaning.

import { type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { type BatchSpec, batchTopicWithPool, batchWords, wordPool } from "../batch.ts";

const fromClues = [{ topic: "context-clues", weight: 0.1 }] as const;

const characterTraits: BatchSpec = {
  id: "words-for-character-traits",
  title: t("Words for Character Traits", "描述性格特点的词"),
  summary: t(
    "Ten words for what a character is like: generous, stubborn, timid, loyal and more.",
    "十个描述人物性格的词：generous、stubborn、timid、loyal 等。",
  ),
  intro: t(
    "The goat plants all four hooves on the bridge and will not budge an inch, no matter how hard the farmer pulls—that goat is **stubborn**! Exact character-trait words show who a character really is through what they do.",
    "山羊四只蹄子死死钉在桥面上，农夫怎么拉都不肯挪半步——这就是固执（**stubborn**）。选准人物性格词，寥寥几笔就能把角色写活。",
  ),
  watchOut: {
    meanings: t(
      "Tell **stubborn** (refusing to budge even when wrong) apart from **determined** (sticking with a hard goal until you finish).",
      "分清 **stubborn**（明知不对也不肯转弯的固执）和 **determined**（认准目标坚持到底的坚定）。",
    ),
    use: t(
      "**Timid** means shy and easily scared, while **cautious** means smart and careful around real danger like icy roads or slippery rocks.",
      "**timid** 是胆小怯生生，**cautious** 是面对结冰路面、湿滑石头时的明智谨慎——别把两者混用。",
    ),
    spelling: t(
      "Watch **cautious** (*au* + *-tious*), **curious** (*-ious*), and **stubborn** (double *b*).",
      "注意 **cautious** 的 **au** 与 **-tious**、**curious** 的 **-ious**，以及 **stubborn** 的双写 **b**。",
    ),
  },
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
      clues: [
        "giving half of her lunch to a friend who forgot his",
        "lending a ladder while refusing anything in return",
        "sharing an umbrella with someone in the rain",
      ],
      contrast: ["generous gladly shares; greedy wants to keep everything", "generous 乐于分享；greedy 贪心独占"],
      conflicts: [
        [
          "greedy means wanting more than you need, the exact opposite of happily giving or sharing with others",
          "greedy 指贪得无厌，与乐于给予或分享正相反",
        ],
        [
          "humble means staying modest about your own success, not happily giving or sharing what you have",
          "humble 指不自夸炫耀，不指乐于把东西分给或借给别人",
        ],
      ],
      spelling: ["gen · er · ous", "soft g (/dʒ/) at the start and -ous ending", "开头读 /dʒ/ 的 g 和结尾 -ous"],
    },
    {
      word: "stubborn",
      meaning: ["not willing to change your mind", "固执的，不肯改变主意的"],
      sentences: [
        "The ___ goat would not move off the bridge, no matter how hard the farmer pulled.",
        "My ___ little brother refused to wear a coat, even when it started to snow.",
        "No matter what anyone said, the ___ old man would not change his mind.",
      ],
      confusions: ["determined", "boastful"],
      clues: [
        "a goat refusing to budge off the bridge no matter how hard the farmer pulled",
        "a little brother refusing to wear a coat even in the snow",
        "an old man refusing to change his mind no matter what anyone said",
      ],
      contrast: [
        "stubborn refuses to listen even when unreasonable; determined keeps working toward a worthwhile goal",
        "stubborn 是一味犟着不听劝；determined 是认准有意义的目标坚持到底",
      ],
      conflicts: [
        [
          "determined means working steadily toward a positive goal, not refusing to listen or change your mind",
          "determined 是为有意义的目标坚持不懈，不是一味固执不肯听劝",
        ],
        [
          "boastful means bragging loudly about how great you are, not digging in your heels and refusing to budge",
          "boastful 是爱吹牛炫耀，不是死活不肯改变主意",
        ],
      ],
      spelling: ["stub · born", "double b and -orn ending", "中间双写 b 和结尾 -orn"],
    },
    {
      word: "timid",
      meaning: ["shy and easily frightened", "胆小的，容易害怕的"],
      sentences: [
        "The ___ kitten hid under the bed whenever a visitor came to the door.",
        "The ___ deer trembled and bolted back into the woods at the faintest rustle of a leaf.",
        "Being ___, Jun spoke so softly that the teacher could hardly hear him.",
      ],
      confusions: ["cautious", "humble"],
      clues: [
        "a kitten hiding under the bed whenever a visitor comes to the door",
        "a deer trembling and bolting back into the woods at the faintest rustle of a leaf",
        "a shy student speaking so softly the teacher can hardly hear him",
      ],
      contrast: ["timid shrinks away in fear; cautious checks carefully before acting", "timid 是胆怯退缩；cautious 是冷静谨慎"],
      conflicts: [
        [
          "cautious means checking smartly for real danger, not being shy and easily frightened",
          "cautious 是面对真实危险时冷静防范，不是生性胆小、容易受惊或害羞",
        ],
        [
          "humble means not bragging about your achievements, not being shy and easily frightened",
          "humble 是功成不骄，不是胆小怕生、容易受惊",
        ],
      ],
      spelling: ["tim · id", "single m and two short i sounds", "单个 m 和两个短音 i"],
    },
    {
      word: "boastful",
      meaning: ["talking too proudly about yourself", "爱吹嘘的，过分夸耀自己的"],
      sentences: [
        "The ___ hare told every animal in the forest that he was the fastest runner alive.",
        "Nobody wanted to play with the ___ boy who always said he was the best.",
        "After winning one game, the team became ___ and told everyone they could never lose.",
      ],
      confusions: ["humble", "greedy"],
      clues: [
        "a hare telling the whole forest he is the fastest runner alive",
        "a boy who always tells everyone he is the best",
        "a team bragging after one win that they could never lose",
      ],
      contrast: ["boastful brags loudly; humble shares credit quietly", "boastful 爱自夸炫耀；humble 谦虚不居功"],
      conflicts: [
        [
          "humble means not thinking you are better than others, the exact opposite of talking too proudly about yourself",
          "humble 是谦虚不自满，与过分自夸吹嘘正相反",
        ],
        [
          "greedy means wanting more things than you need, not talking too proudly about how great you are",
          "greedy 是贪心多占东西，不是嘴上过分夸耀自己",
        ],
      ],
      spelling: ["boast · ful", "oa spelling long o and single l in -ful", "发长 o 音的 oa 和单个 l 的 -ful"],
    },
    {
      word: "loyal",
      meaning: ["always standing by a friend or a group", "忠诚的，始终支持朋友或集体的"],
      sentences: [
        "The ___ dog waited by the gate every evening until its owner came home.",
        "Even when the others laughed at her, Kim stayed ___ to her best friend.",
        "The king trusted only his most ___ knight to guard the castle gate.",
      ],
      confusions: ["generous", "humble"],
      clues: [
        "a dog waiting faithfully by the gate every evening for its owner",
        "standing faithfully by a best friend even when others laugh",
        "a trusted knight guarding the king's castle gate",
      ],
      contrast: [
        "loyal stands faithfully by someone through thick and thin; generous shares gifts or things",
        "loyal 是患难与共、忠心相守；generous 是乐于施与财物",
      ],
      conflicts: [
        [
          "generous means happily giving or sharing things, not staying faithful and standing by someone",
          "generous 侧重慷慨分享物品，不是始终忠心相守",
        ],
        [
          "humble means staying modest about success, not staying faithful and devoted to someone",
          "humble 指不自夸炫耀，不是忠心耿耿、始终支持",
        ],
      ],
      spelling: ["loy · al", "oy spelling /ɔɪ/ and -al ending", "发 /ɔɪ/ 音的 oy 和结尾 -al"],
    },
    {
      word: "curious",
      meaning: ["eager to know or learn about something", "好奇的，渴望了解的"],
      sentences: [
        "The ___ boy opened the old box to find out what was making the ticking sound.",
        "The ___ monkey picked up the camera and pressed every button.",
        "Ever since she saw the stars through a telescope, Ana has been ___ about space.",
      ],
      confusions: ["cautious", "determined"],
      clues: [
        "opening an old box to discover what makes a ticking sound",
        "a monkey picking up a camera and pressing every button",
        "wanting to learn all about space after seeing stars through a telescope",
      ],
      contrast: ["curious jumps in to investigate; cautious holds back to stay safe", "curious 急于一探究竟；cautious 先停步防危险"],
      conflicts: [
        [
          "cautious means holding back carefully to avoid danger, not eagerly investigating to find out more",
          "cautious 会小心避险，不像 curious 那样急于一探究竟、渴望了解",
        ],
        [
          "determined means sticking firmly to a tough goal until finished, not simply feeling eager to explore or learn",
          "determined 是下决心克服困难完成任务，不是单纯想弄明白、充满好奇",
        ],
      ],
      spelling: ["cu · ri · ous", "single r and -ious ending", "单个 r 和结尾 -ious"],
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
      clues: [
        "a hiker testing each rock with her foot before stepping on it",
        "a driver slowing down on an icy road",
        "stepping carefully across slippery stones in a stream",
      ],
      contrast: [
        "cautious acts carefully around hazards; timid hides from ordinary things",
        "cautious 是遇险细心防范；timid 是平时也胆小害怕",
      ],
      conflicts: [
        [
          "timid means shy and easily frightened even without danger, not acting smartly and carefully around real hazards",
          "timid 是无端胆怯害羞，不是面对真实危险时的明智谨慎",
        ],
        [
          "curious means eager to poke and explore, not carefully taking steps to avoid danger",
          "curious 是好奇探寻，不是为了避开危险而小心防范",
        ],
      ],
      spelling: ["cau · tious", "au saying /ɔː/ and -tious saying /ʃəs/", "发 /ɔː/ 的 au 和发 /ʃəs/ 的 -tious"],
    },
    {
      word: "greedy",
      meaning: ["wanting more than you need", "贪婪的，想要超过所需的"],
      sentences: [
        "The ___ king already had a room full of gold, but he still wanted more.",
        "The ___ fox ate all the grapes and left none for the other animals.",
        "Do not be ___; take one cookie and leave the rest for your sisters.",
      ],
      confusions: ["generous", "boastful"],
      clues: [
        "a king with a room full of gold who still wants more",
        "a fox eating all the grapes and leaving none for others",
        "taking too many cookies instead of leaving some for your sisters",
      ],
      contrast: ["greedy grabs too much; generous gladly shares", "greedy 贪得无厌；generous 乐于分享"],
      conflicts: [
        [
          "generous means happily sharing with others, the exact opposite of wanting more than you need and keeping it all",
          "generous 是乐于分享，与贪得无厌、独自霸占正相反",
        ],
        [
          "boastful means bragging loudly about yourself, not grabbing more than your share",
          "boastful 是嘴上吹牛炫耀，不是贪心多占、不肯留给别人",
        ],
      ],
      spelling: ["gree · dy", "gr blend and double e", "gr 连缀和双写 e"],
    },
    {
      word: "humble",
      meaning: ["not thinking of yourself as better than others", "谦虚的，不认为自己比别人强的"],
      sentences: [
        "Although she won the prize, the ___ girl said her whole team deserved it.",
        "The famous singer was ___ and thanked the people who had helped her.",
        "Even after he became the best player on the team, Omar stayed ___ and kind.",
      ],
      confusions: ["boastful", "generous"],
      clues: [
        "a prize winner saying her whole team deserved the credit",
        "a famous singer thanking everyone who helped her",
        "the best player on the team staying modest and kind",
      ],
      contrast: ["humble stays modest about success; boastful brags loudly", "humble 是成功不骄傲；boastful 是爱吹嘘自夸"],
      conflicts: [
        [
          "boastful means bragging loudly that you are the best, the exact opposite of staying modest about success",
          "boastful 是四处自夸，与功成不骄、保持谦逊正相反",
        ],
        [
          "generous means giving away money or things, not staying modest and not acting better than others",
          "generous 侧重施与财物，不指获得成功后保持谦虚低调",
        ],
      ],
      spelling: ["hum · ble", "short u and -ble ending with silent e", "短音 u 和带不发音 e 的 -ble"],
    },
    {
      word: "determined",
      meaning: ["having decided firmly to do something", "坚定的，下定决心要做某事的"],
      sentences: [
        "The ___ runner kept going after she fell and finished the race.",
        "Leila was ___ to learn to ride her bike before the summer ended.",
        "The ___ ant carried a crumb twice its size all the way to its nest.",
      ],
      confusions: ["stubborn", "loyal"],
      clues: [
        "a runner getting back up after falling to finish the race",
        "setting a firm goal to learn bike riding before summer ends",
        "an ant hauling a giant crumb all the way to its nest",
      ],
      contrast: ["determined pushes through obstacles; stubborn refuses sensible advice", "determined 是迎难而上；stubborn 是固执不听劝"],
      conflicts: [
        [
          "stubborn means unreasonably refusing to listen or change your mind, not pushing steadily toward a firm goal",
          "stubborn 是不讲道理地死犟，不是认准目标、克服困难坚持到底的毅力",
        ],
        [
          "loyal means staying faithful to a friend or group, not having firmly decided to reach a hard goal",
          "loyal 指对朋友或集体的忠诚，不是下定决心完成艰难目标的坚定",
        ],
      ],
      spelling: ["de · ter · mined", "er saying /ɜːr/ and -mined (not -mand)", "发 /ɜːr/ 的 er 和结尾 -mined"],
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
  intro: t(
    "After a long **drought**, dark clouds finally drop rain that can **seep** into dry soil, rush across pavement as **runoff**, or refill the **reservoir** behind the dam so farmers can **irrigate** their fields. These ten words trace how water moves and how people save it.",
    "久旱（**drought**）之后，乌云终于降下雨水：有的渗入（**seep**）干土，有的化作地表径流（**runoff**），有的蓄满大坝后的水库（**reservoir**），让农夫能灌溉（**irrigate**）农田。这十个词讲述水的循环与利用。",
  ),
  watchOut: {
    meanings: t(
      "Tell **absorb** (soak a liquid inward into a sponge, towel, or soil) apart from **seep** (ooze slowly *through* tiny cracks or sand) and **condense** (turn from gas/vapor back into liquid drops when cooled).",
      "分清 **absorb**（像海绵或干土把液体吸进去）、**seep**（液体从小缝或沙层里慢慢渗出）和 **condense**（水蒸气遇冷凝结成水珠）。",
    ),
    use: t(
      "Tell **reservoir** (a stored lake of water behind a dam) apart from **runoff** (rainwater flowing over hard ground instead of soaking in) and **moisture** (uncountable dampness in air, soil, or food).",
      "分清 **reservoir**（大坝后蓄水的水库）、**runoff**（未渗入地下而在地表流走的径流）和 **moisture**（不可数名词，空气或土壤中的少量水分）。",
    ),
    spelling: t(
      "Watch **reservoir** (*res-er-voir* with *-voir*), **drought** (*ough* saying /aʊ/, not *droughth*), and **irrigate** (double *r* + *-gate*).",
      "注意 **reservoir** 结尾的 **-voir**、**drought** 里读 /aʊ/ 的 **ough**，以及 **irrigate** 的双写 **r**。",
    ),
  },
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
        "When the water level in the ___ drops low, the city asks people to use less water.",
        "Pipes carry water from the ___ in the hills to every house in town.",
      ],
      confusions: ["runoff", "droplet"],
      clues: [
        "stored town drinking water held behind a dam",
        "a stored water supply whose level can drop low",
        "a hill storage lake feeding pipes to every house",
      ],
      contrast: [
        "reservoir stores water in a lake behind a dam; runoff flows away over the ground",
        "reservoir 是蓄水的水库；runoff 是地表流走的径流",
      ],
      conflicts: [
        [
          "runoff is rainwater flowing away over the ground, not a stored lake supplying a town",
          "runoff 是沿地面流走的雨水，不是储存饮用水的水库",
        ],
        [
          "droplet is a single tiny drop of liquid, not a large lake supplying a whole town",
          "droplet 是一滴微小水珠，不是供应全镇用水的蓄水湖",
        ],
      ],
      spelling: ["res · er · voir", "res-er + -voir ending saying /vwɑːr/", "res-er 加读 /vwɑːr/ 的结尾 -voir"],
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
      clues: [
        "one tiny cloud particle too small to fall as rain",
        "a single bead of dew hanging from a grass tip",
        "one tiny bead of water rolling down glass",
      ],
      contrast: [
        "droplet is one countable tiny drop; moisture is uncountable dampness",
        "droplet 是可数的单颗小水滴；moisture 是不可数的湿气水分",
      ],
      conflicts: [
        [
          "moisture is uncountable dampness, not a single countable bead of liquid",
          "moisture 是不可数的湿气，不能接在 Each 或 A single 后面指一颗水滴",
        ],
        ["reservoir is a huge stored lake of water, the opposite of a tiny bead of liquid", "reservoir 是巨大的水库，与微小水滴正好相反"],
      ],
      spelling: ["drop · let", "drop + -let meaning small", "drop 加表示“小”的后缀 -let"],
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
      clues: [
        "dampness left in soil helping seeds grow",
        "excess dampness inside a bag making bread moldy",
        "tiny bits of dampness held inside thick cactus leaves",
      ],
      contrast: [
        "moisture is a small amount of water held in air, soil, or things; drought is a long dry spell with no rain",
        "moisture 是空气或物体中的少量水分；drought 是久旱无雨",
      ],
      conflicts: [
        [
          "droplet is a single countable drop, not uncountable dampness spread through soil, air, or bread",
          "droplet 是单颗可数水滴，不是弥散在土壤、袋子或叶片里的不可数水分",
        ],
        ["drought is a long spell without rain, the exact opposite of dampness", "drought 是长期干旱缺水，与湿气水分正相反"],
      ],
      spelling: ["mois · ture", "oi vowel team + -ture ending", "元音组合 oi 加结尾 -ture"],
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
      clues: ["a sponge soaking in a lot of water", "dry soil taking in a light rain quickly", "a paper towel soaking up spilled milk"],
      contrast: [
        "absorb takes liquid inward into a material; seep flows slowly through cracks",
        "absorb 是把液体吸收进去；seep 是液体从缝隙慢慢渗出",
      ],
      conflicts: [
        [
          "seep means flowing slowly through tiny cracks (intransitive), not soaking up a liquid directly",
          "seep 指液体从缝隙慢慢渗漏（不及物），不能接水或牛奶作宾语表示吸收",
        ],
        [
          "condense means turning from gas into liquid as it cools, not soaking up liquid into a sponge or towel",
          "condense 是气体遇冷凝结成液体，不是把液态水或牛奶吸走",
        ],
      ],
      spelling: ["ab · sorb", "ab- + sorb (with b, not p)", "前缀 ab- 加以 b 结尾的 sorb"],
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
      clues: [
        "rainwater moving slowly through sand into the ground",
        "floodwater oozing slowly under a door",
        "water leaking slowly through a cracked bucket bottom",
      ],
      contrast: [
        "seep oozes slowly through tiny openings; absorb soaks liquid into a material",
        "seep 是从缝隙慢慢渗流；absorb 是把液体吸收进去",
      ],
      conflicts: [
        [
          "absorb takes a liquid object into a material, rather than liquid oozing through cracks or sand",
          "absorb 需要接被吸收的液体作宾语，不是水自己从缝隙或沙层慢慢渗出",
        ],
        [
          "irrigate means channeling water to farm fields, not water leaking slowly through sand or a crack",
          "irrigate 是引水灌溉农田，不是水从门缝或裂缝慢慢渗漏",
        ],
      ],
      spelling: ["seep", "double e saying long e + p", "双写 e 发长 e 音加 p"],
    },
    {
      word: "irrigate",
      forms: ["irrigates", "irrigated", "irrigating", "irrigation"],
      meaning: ["to bring water to fields through pipes or ditches", "灌溉，用管道或沟渠把水引到田里"],
      sentences: [
        "Farmers dig ditches from the river to ___ their fields in the dry season.",
        "Without rain, the farmers had to ___ their rice fields with water from the canal.",
        "Long ago, Egyptians used buckets on poles to ___ the dry farmland by the river.",
      ],
      confusions: ["conserve", "seep"],
      clues: [
        "digging river ditches to bring water to dry fields",
        "bringing canal water to rice fields when rain stops",
        "lifting river water in buckets to water dry farmland",
      ],
      contrast: [
        "irrigate brings water to crops through ditches or pipes; conserve saves water from waste",
        "irrigate 是引水灌溉农田；conserve 是节约不浪费",
      ],
      conflicts: [
        [
          "conserve means saving a resource from waste, not channeling water to dry crop fields",
          "conserve 是节约保护资源，不是挖沟渠引水浇灌干田",
        ],
        [
          "seep means liquid oozing slowly through cracks, not actively watering farm fields",
          "seep 是液体自行缓慢渗漏，不能接农田作宾语表示灌溉",
        ],
      ],
      spelling: ["ir · ri · gate", "double r + i + -gate with silent e", "双写 r 加 i 和带 e 的 -gate"],
    },
    {
      word: "conserve",
      forms: ["conserves", "conserved", "conserving"],
      meaning: ["to use something carefully so it is not wasted", "节约，小心使用以免浪费"],
      sentences: [
        "We turn off the tap while brushing our teeth to ___ water.",
        "Taking shorter showers is one easy way to ___ water at home.",
        "Camels ___ water carefully inside their bodies so they can cross the desert without wasting it.",
      ],
      confusions: ["absorb", "irrigate"],
      clues: [
        "turning off the tap while brushing teeth to avoid waste",
        "taking shorter showers to save water at home",
        "holding water carefully without wasting it across a desert",
      ],
      contrast: [
        "conserve uses a resource carefully without waste; absorb soaks liquid in",
        "conserve 是节约避免浪费；absorb 是把液体吸进去",
      ],
      conflicts: [
        [
          "absorb means soaking a liquid into a material, not saving water by turning off taps or shortening showers",
          "absorb 是吸收液体，不是关紧水龙头或减少浪费以节约用水",
        ],
        [
          "irrigate means watering farm fields through ditches, not saving water from being wasted",
          "irrigate 是引水灌溉农田，不是节约用水以免浪费",
        ],
      ],
      spelling: ["con · serve", "con- + serve (er saying /ɜːr/ + silent e)", "前缀 con- 加 serve"],
    },
    {
      word: "drought",
      forms: ["droughts"],
      meaning: ["a long time with little or no rain", "干旱，长时间少雨或无雨"],
      sentences: [
        "During the long dry ___, the river shrank and the grass turned brown.",
        "The ___ lasted three years without rain, and many farms had no harvest.",
        "After the long ___, the first rain made everyone dance in the street.",
      ],
      confusions: ["runoff", "moisture"],
      clues: [
        "a long dry spell shrinking rivers and browning grass",
        "three rainless years ruining farm harvests",
        "a long rainless period ending with celebratory first rain",
      ],
      contrast: [
        "drought is a long spell with little or no rain; runoff is excess rainwater rushing over ground",
        "drought 是长期干旱无雨；runoff 是雨水过剩流走的地表径流",
      ],
      conflicts: [
        [
          "runoff is rainwater flowing over the ground after rain, the opposite of a rainless period",
          "runoff 是降雨后流走的地表径流，与久旱无雨正相反",
        ],
        [
          "moisture is dampness in air or soil, the exact opposite of a long dry spell without rain",
          "moisture 是空气或土壤中的水分湿气，与长期干旱无雨正相反",
        ],
      ],
      spelling: ["drought", "dr blend + ough saying /aʊ/ + t", "dr 连缀加读 /aʊ/ 的 ough 和 t"],
    },
    {
      word: "runoff",
      meaning: ["rainwater that flows over the ground instead of soaking in", "地表径流，在地面流走而没有渗入的雨水"],
      sentences: [
        "On the hard parking lot, the rain became ___ that rushed into the drain.",
        "Muddy ___ from the farm washed into the stream after the storm.",
        "Planting grass on the hill slows the rainwater ___ and lets the water soak in.",
      ],
      confusions: ["drought", "reservoir"],
      clues: [
        "rain rushing off a hard parking lot into a drain",
        "muddy storm water washing off a farm into a stream",
        "hillside rainwater slowed by grass so it can soak in",
      ],
      contrast: [
        "runoff is rainwater flowing away over the ground; reservoir is a lake storing water",
        "runoff 是沿地面流走的雨水；reservoir 是蓄水的水库",
      ],
      conflicts: [
        [
          "drought is a long dry period without rain, the opposite of storm water rushing over ground",
          "drought 是长期干旱无雨，与暴雨后冲进排水沟或溪流的地表水正相反",
        ],
        [
          "reservoir is a still lake where water is stored, not muddy rainwater rushing across a parking lot or hill",
          "reservoir 是蓄水湖泊，不是沿路面或山坡冲走的雨水水流",
        ],
      ],
      spelling: ["run · off", "compound word: run + off (double f)", "合成词：run 加双写 f 的 off"],
    },
    {
      word: "condense",
      forms: ["condensed", "condensing"],
      meaning: ["to change from a gas into a liquid as it cools", "凝结，气体冷却后变成液体"],
      sentences: [
        "Water vapor will ___ into drops on the outside of a cold glass.",
        "On a cold morning, warm water vapor in your breath will ___ into a little white cloud.",
        "Hot steam from the shower will ___ into water drops on the cool bathroom mirror.",
      ],
      confusions: ["absorb", "conserve"],
      clues: [
        "water vapor turning into liquid drops on a cold glass",
        "warm breath vapor turning into a visible cloud in cold air",
        "hot shower steam turning into drops on a cool mirror",
      ],
      contrast: [
        "condense changes cooling gas into liquid drops; absorb soaks liquid into a material",
        "condense 是气体遇冷凝结成液体；absorb 是材料吸收液体",
      ],
      conflicts: [
        [
          "absorb means soaking up a liquid into a material, not gas or steam cooling into water drops",
          "absorb 是把液体吸收进去，不是水蒸气遇冷凝结成水珠",
        ],
        [
          "conserve means saving a resource carefully, not steam or vapor turning into liquid drops",
          "conserve 是节约不浪费，不是水蒸气冷却后变成水滴",
        ],
      ],
      spelling: ["con · dense", "con- + dense with silent e", "前缀 con- 加带词尾 e 的 dense"],
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
  intro: t(
    "A hummingbird pokes its needle beak deep into a bright flower to sip sweet **nectar**, brushing yellow **pollen** onto its feathers at the same time. Following a plant's life cycle takes ten sharp science words.",
    "蜂鸟把细长的喙探进花心吸食甜丝丝的花蜜（**nectar**），羽毛顺势沾上了黄色的花粉（**pollen**）。看懂一株植物从发芽到结籽的过程，全靠这十个科学词。",
  ),
  watchOut: {
    meanings: t(
      "Tell **pollen** (yellow dust that makes seeds) apart from **nectar** (sweet liquid that bees and birds drink).",
      "分清 **pollen**（帮花结籽的黄色花粉）和 **nectar**（蜜蜂和鸟喝的甜花蜜）。",
    ),
    use: t(
      "**Sprout** and **germinate** both mean starting to grow, while **wilt** means drooping and going limp from lack of water.",
      "**sprout** 和 **germinate** 都是开始发芽萌发，**wilt** 则是缺水枯萎打蔫——看植物是在长新芽还是在发蔫。",
    ),
    spelling: t(
      "Watch **nutrient** (*u-i-e* in *nu-tri-ent*), **pollen** (double *l*, *-en*), and **germinate** (soft *g* before *e*).",
      "注意 **nutrient** 里的 **tri-ent**、**pollen** 的双写 **l**，以及 **germinate** 开头读 /dʒ/ 的 **g**。",
    ),
  },
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
      clues: [
        "planted beans beginning to push out new shoots after a few days",
        "a potato in a dark cupboard pushing out pale new shoots",
        "new leaves pushing out on every branch after spring rain",
      ],
      contrast: [
        "sprout pushes out fresh shoots or leaves; wilt droops and goes limp from lack of water",
        "sprout 是抽出新芽嫩叶；wilt 是缺水枯萎打蔫",
      ],
      conflicts: [
        [
          "wilt means drooping and going limp from thirst, the exact opposite of pushing out fresh shoots",
          "wilt 是缺水发蔫下垂，与生机勃勃地长出新芽正相反",
        ],
        [
          "pollinate means carrying pollen from one flower to another, not a plant pushing out new shoots",
          "pollinate 是花间传粉，不是植物自己长出新芽",
        ],
      ],
      spelling: ["sprout", "spr three-letter blend and ou saying /aʊ/", "开头的 spr 三字母连缀和发 /aʊ/ 的 ou"],
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
      clues: [
        "seeds needing water and warmth to start growing into plants",
        "desert seeds waiting years for rain to wake up and grow",
        "bean seeds kept on a wet paper towel to watch them begin growing",
      ],
      contrast: [
        "germinate is a seed starting to grow into a plant; pollinate moves pollen between flowers",
        "germinate 是种子吸收水分开始萌发；pollinate 是花间传粉",
      ],
      conflicts: [
        [
          "pollinate means carrying pollen from flower to flower to make seeds, not a seed waking up and starting to grow",
          "pollinate 是给花朵传粉，不是种子自己开始萌发生长",
        ],
        [
          "wilt means drooping and going limp from lack of water, not a seed beginning to grow into a plant",
          "wilt 是缺水发蔫下垂，不是种子开始萌发长成植物",
        ],
      ],
      spelling: ["ger · mi · nate", "soft g (/dʒ/) before er and -nate ending", "er 前读 /dʒ/ 的 g 和结尾 -nate"],
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
      clues: [
        "growth substances that plant roots draw up from the soil",
        "a mineral like iron that a plant absorbs from soil to grow",
        "essential growth substances compost puts into soil for corn",
      ],
      contrast: ["nutrient feeds growth from soil or food; nectar is sweet flower juice", "nutrient 是土壤食物里的养分；nectar 是花蜜"],
      conflicts: [
        [
          "nectar is sweet liquid inside flowers for bees and birds, not a growth substance a plant takes from soil",
          "nectar 是花里的甜花蜜，不是植物从土壤里吸收的养分",
        ],
        [
          "pollen is yellow flower powder that helps make seeds, not a substance plants absorb from soil to grow",
          "pollen 是花朵产生的黄色花粉，不是植物从土壤里吸收的养分",
        ],
      ],
      spelling: ["nu · tri · ent", "tr blend and -ient ending", "中间 tr 连缀和结尾 -ient"],
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
      clues: [
        "yellow flower powder coating a bee's legs",
        "spring tree powder floating in the air that makes people sneeze",
        "fine powder blown by wind from one pine tree to another",
      ],
      contrast: ["pollen is powdery yellow dust; nectar is sweet liquid", "pollen 是干粉状花粉；nectar 是液体花蜜"],
      conflicts: [
        [
          "nectar is sweet liquid drunk from inside a flower, not powdery dust made by flowers and trees",
          "nectar 是藏在花心里的液体花蜜，不是花木产生的细小花粉",
        ],
        [
          "nutrient is a growth substance in soil or food, not powdery dust made by flowers and trees",
          "nutrient 是土壤或食物中的养分，不是花木产生的花粉",
        ],
      ],
      spelling: ["pol · len", "double l and -en ending", "双写 l 和结尾 -en"],
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
      clues: [
        "bees and butterflies carrying pollen as they visit flower after flower",
        "bees helping apple blossoms set fruit by carrying pollen",
        "bats transferring pollen among night-blooming flowers",
      ],
      contrast: ["pollinate moves pollen to make fruit; germinate starts a seed growing", "pollinate 是帮花传粉结果；germinate 是种子发芽"],
      conflicts: [
        [
          "germinate is what a seed does when it starts growing, not carrying pollen from one flower to another",
          "germinate 是种子自己萌发，不是在花朵之间传递花粉",
        ],
        [
          "sprout means pushing out new shoots or leaves, not carrying pollen from one flower to another",
          "sprout 是植物长出新芽，不是在花朵之间帮忙传粉",
        ],
      ],
      spelling: ["pol · li · nate", "double l and -inate ending", "双写 l 和结尾 -inate"],
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
      clues: [
        "a tiny baby plant moved from a starter cup into the garden",
        "a baby plant with just two small leaves ready for planting",
        "a very young plant eaten by rabbits before becoming a tree",
      ],
      contrast: ["seedling is a whole baby plant; petal is just one colored piece of a flower", "seedling 是整棵幼苗；petal 只是一片花瓣"],
      conflicts: [
        [
          "petal is just one colored piece of a flower, not a whole young plant grown from a seed",
          "petal 只是花朵上的一片花瓣，不是刚从种子长出的整株幼苗",
        ],
        ["pollen is yellow flower dust, not a whole very young plant grown from a seed", "pollen 是黄色花粉，不是刚从种子长出来的小幼苗"],
      ],
      spelling: ["seed · ling", "seed (ee) + -ling ending", "含 ee 的 seed 加后缀 -ling"],
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
      clues: [
        "flower stems drooping when you forget to water them",
        "lettuce going limp quickly in the hot sun",
        "flowers drooping by noon during a heat wave",
      ],
      contrast: ["wilt droops from thirst; sprout sends up new green shoots", "wilt 是缺水蔫掉；sprout 是抽出新芽"],
      conflicts: [
        [
          "sprout means growing fresh new shoots, the exact opposite of drooping and going limp from heat or thirst",
          "sprout 是生机勃勃地长出新芽，与缺水受热后下垂发蔫正相反",
        ],
        [
          "germinate means a seed starting to grow into a plant, not a plant drooping and going limp",
          "germinate 是种子萌发，不是植物变软打蔫",
        ],
      ],
      spelling: ["wilt", "short i followed by lt blend", "短音 i 加结尾 lt"],
    },
    {
      word: "fertile",
      meaning: ["able to grow many strong plants", "肥沃的，能长出许多健壮植物的"],
      sentences: [
        "The dark, ___ soil by the river grew the best crops in the valley.",
        "The valley's ___ fields grew wheat, beans and melons.",
        "Farmers moved to the river because its banks were ___.",
      ],
      confusions: ["dormant", "nocturnal"],
      clues: [
        "rich dark riverbank soil growing the best crops in the valley",
        "rich valley fields producing abundant wheat, beans, and melons",
        "rich riverbanks that attract farmers to plant crops",
      ],
      contrast: [
        "fertile describes rich land able to grow strong plants; dormant means inactive for now",
        "fertile 指肥沃能长庄稼的土地；dormant 指暂时休眠不活动",
      ],
      conflicts: [
        [
          "dormant means inactive and resting for now, not rich soil actively growing strong crops",
          "dormant 指暂时休眠沉寂，不是能长出丰盛庄稼的肥沃土地",
        ],
        [
          "nocturnal means active at night and asleep by day, not rich land able to grow strong plants",
          "nocturnal 指夜间活动、白天睡觉，不能形容肥沃的农田河岸",
        ],
      ],
      spelling: ["fer · tile", "er saying /ɜːr/ and -tile ending", "发 /ɜːr/ 的 er 和结尾 -tile"],
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
      clues: [
        "sweet flower liquid drunk by a hummingbird with its long beak",
        "sweet liquid sipped by butterflies through a straw-like tube",
        "sweet flower liquid collected by bees and turned into honey",
      ],
      contrast: ["nectar is sweet liquid to drink; pollen is yellow dust", "nectar 是能吸食的甜花蜜；pollen 是黄色花粉"],
      conflicts: [
        ["pollen is dry yellow powder rather than a sweet liquid inside flowers", "pollen 是干粉末状的花粉，不是花心里的甜液体"],
        [
          "nutrient is a general growth substance in soil or food, not specifically the sweet liquid inside flowers",
          "nutrient 泛指土壤或食物里的养分，不特指花心里的甜汁",
        ],
      ],
      spelling: ["nec · tar", "c saying /k/ and -tar ending (not -ter)", "发 /k/ 的 c 和结尾 -tar（不是 -ter）"],
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
      clues: [
        "a single red flower piece fallen from a rose onto a table",
        "a colored flower piece pulled off and counted one by one",
        "a single white flower piece floating on a pond",
      ],
      contrast: ["petal is a colored flower leaf; seedling is a tiny young plant", "petal 是花瓣；seedling 是整株幼苗"],
      conflicts: [
        [
          "seedling is a whole baby plant with roots and leaves, not one single colored piece of a flower",
          "seedling 是有根有叶的整株小苗，不是花朵上的一片花瓣",
        ],
        ["pollen is powdery yellow dust, not a single colored flower piece", "pollen 是黄色粉末，不是花朵周围的一片花瓣"],
      ],
      spelling: ["pet · al", "t in the middle (not pedal with d) and -al", "中间是 t（别写成脚踏板 pedal），结尾 -al"],
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
  intro: t(
    "Sitting cross-legged by the Nile, a **scribe** paints a tiny owl **hieroglyph** onto a fresh sheet of **papyrus**. Exploring ancient Egypt means learning the exact words for its rulers, tombs, writing, and modern diggers.",
    "书吏（**scribe**）盘腿坐在尼罗河边，往新压好的纸莎草纸（**papyrus**）上画下一只小猫头鹰象形文字（**hieroglyph**）。走进古埃及，就从这十个词开始。",
  ),
  watchOut: {
    meanings: t(
      "Tell **papyrus** (the river-reed paper people wrote *on*) apart from **hieroglyph** (a picture sign written on it).",
      "分清 **papyrus**（写字用的纸莎草纸）和 **hieroglyph**（画在上面的象形文字图形）。",
    ),
    use: t(
      "A **scribe** wrote records long ago in Egypt, while an **archaeologist** is a modern scientist who digs up old walls and pots today.",
      "**scribe** 是古埃及抄写记录的书吏，**archaeologist** 是今天发掘遗址的考古学家——别把古今身份弄混。",
    ),
    spelling: t(
      "Watch **pharaoh** (*ph* + *-aoh*), **tomb** (silent *b*), and **hieroglyph** (*ie* + *y* + *ph*).",
      "注意 **pharaoh** 的 **ph** 和结尾 **-aoh**、**tomb** 结尾不发音的 **b**，以及 **hieroglyph** 里的 **ie**、**y** 和 **ph**。",
    ),
  },
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
      clues: [
        "the ruler of all Egypt treated almost like a god",
        "the Egyptian king whose son inherits the throne",
        "the royal ruler ordering thousands of workers to build his pyramid",
      ],
      contrast: ["pharaoh was Egypt's king; scribe was a trained writer", "pharaoh 是古埃及国王；scribe 是负责书写的书吏"],
      conflicts: [
        [
          "scribe was a trained writer who copied records, not the king who ruled ancient Egypt",
          "scribe 是抄写记录的书吏，不是统治古埃及的国王",
        ],
        [
          "archaeologist is a modern scientist who digs up ruins today, not an ancient Egyptian king",
          "archaeologist 是现代考古学家，不是古埃及的国王",
        ],
      ],
      spelling: ["pha · raoh", "ph saying /f/ and silent h in -aoh", "开头读 /f/ 的 ph 和结尾 -aoh"],
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
      confusions: ["obelisk", "mummy"],
      clues: [
        "a burial chamber deep inside a mountain where a king rests",
        "a burial room robbers broke into to steal a king's gold",
        "a burial chamber whose walls are painted with the dead man's life",
      ],
      contrast: ["tomb is the burial chamber; obelisk is an outdoor stone pillar", "tomb 是安葬死者的墓室；obelisk 是室外的方尖石柱"],
      conflicts: [
        [
          "obelisk is a solid outdoor four-sided stone pillar, not a burial room or building for the dead",
          "obelisk 是立在室外的实心石柱，不是用来安葬死者的墓室",
        ],
        [
          "mummy is the wrapped dead body itself, not the room or building where it is buried",
          "mummy 是裹布防腐的遗体本身，不是用来安葬死者的墓室建筑",
        ],
      ],
      spelling: ["tomb", "o saying /uː/ and silent b at the end", "读 /uː/ 的 o 和结尾不发音的 b"],
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
      confusions: ["pharaoh", "archaeologist"],
      clues: [
        "a trained writer who studied for years to write down the king's laws",
        "a record-keeper sitting cross-legged counting sacks of grain",
        "boys spending years at school copying writing signs for their future job",
      ],
      contrast: ["scribe wrote laws and lists; pharaoh gave the orders", "scribe 负责抄写记录；pharaoh 是下令的国王"],
      conflicts: [
        [
          "pharaoh was the royal king who ruled Egypt, not a person whose job was writing things down",
          "pharaoh 是统治古埃及的法老国王，不是专门从事书写记录的书吏",
        ],
        [
          "archaeologist is a modern scientist who digs up ancient ruins, not an ancient Egyptian whose job was writing records",
          "archaeologist 是现代发掘古物的科学家，不是古埃及专门写字记账的书吏",
        ],
      ],
      spelling: ["scribe", "scr three-letter blend and silent e making long i", "开头的 scr 连缀和让 i 读长音的 e"],
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
      clues: [
        "a long sheet made from river reeds that a scribe writes on",
        "thick river-plant reeds growing along the banks of the Nile",
        "ancient reed paper carrying a three-thousand-year-old letter",
      ],
      contrast: [
        "papyrus is the reed paper; hieroglyph is a picture sign drawn on it",
        "papyrus 是纸莎草纸；hieroglyph 是写在上面的象形文字",
      ],
      conflicts: [
        [
          "hieroglyph is a picture symbol standing for a word or sound, not a river plant or the reed paper made from it",
          "hieroglyph 是代表字音的图形符号，不是河边植物或用它制成的纸张",
        ],
        [
          "artifact is a general word for any ancient human-made object, not specifically the river plant and writing paper of Egypt",
          "artifact 泛指古人制作的任何器物，不特指古埃及的纸莎草植物和书写用纸",
        ],
      ],
      spelling: ["pa · py · rus", "y saying long i and -rus ending", "发长 i 音的 y 和结尾 -rus"],
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
      confusions: ["tomb", "artifact"],
      clues: [
        "a preserved body wrapped in hundreds of strips of linen",
        "a cloth-wrapped ancient body lying inside a museum glass case",
        "a dead body dried with salt for days to keep it from decaying",
      ],
      contrast: ["mummy is the wrapped body; tomb is the room where it is placed", "mummy 是包裹好的遗体；tomb 是墓室"],
      conflicts: [
        [
          "tomb is the burial chamber or building, not a dried dead body wrapped in cloth",
          "tomb 是安葬死者的墓室建筑，不是经干燥并缠满布条的遗体",
        ],
        ["artifact is an object made by human hands, not a preserved dead body", "artifact 指人类制作的器物，不是经防腐处理的死者遗体"],
      ],
      spelling: ["mum · my", "double m and y saying long e", "中间双写 m 和结尾 y"],
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
      confusions: ["pharaoh", "tomb"],
      clues: [
        "kings from the same family ruling for two hundred years in a row",
        "a new royal family taking the Egyptian throne",
        "a family line of kings ending when the last ruler has no children",
      ],
      contrast: [
        "dynasty is a whole family line of rulers; pharaoh is one individual king",
        "dynasty 是同一家族的整个王朝；pharaoh 只是单个国王",
      ],
      conflicts: [
        [
          "pharaoh is one single Egyptian king, not a whole series of rulers from the same family",
          "pharaoh 只指一位法老国王，不是同一家族世代相传的整个王朝",
        ],
        [
          "tomb is a burial room for the dead, not a series of rulers from the same family",
          "tomb 是安葬死者的坟墓，不是执掌王位的同一家族王朝",
        ],
      ],
      spelling: ["dy · nas · ty", "y saying long i in dy and -ty ending", "开头读长 i 的 y 和结尾 -ty"],
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
      confusions: ["papyrus", "obelisk"],
      clues: [
        "an ancient clay cooking pot uncovered in the sand",
        "old everyday village items like combs and sandals in a museum room",
        "a wooden toy horse with a museum label from long ago",
      ],
      contrast: [
        "artifact is any old human-made object; papyrus is specifically reed paper",
        "artifact 泛指古人制作的文物；papyrus 特指纸莎草纸",
      ],
      conflicts: [
        [
          "papyrus is specifically writing paper made from river reeds, not a general word for an old human-made object",
          "papyrus 特指纸莎草纸，不是泛指古人制作物品的“文物”",
        ],
        [
          "obelisk is a towering four-sided stone pillar, not a general word for an object made by people long ago",
          "obelisk 特指高耸的方尖石柱，不是泛指古人制作的文物器皿",
        ],
      ],
      spelling: ["ar · ti · fact", "ar + ti + fact ending in ct", "ar 加 ti 再加以 ct 结尾的 fact"],
    },
    {
      word: "hieroglyph",
      forms: ["hieroglyphs"],
      meaning: ["a picture that stands for a word or a sound in Egyptian writing", "象形文字，埃及文字中代表一个词或一个音的图形"],
      sentences: [
        "Each ___ on the wall, such as the owl or the eye, stood for a sound or a word.",
        "The scribe painted a ___ shaped like a bird to stand for a sound.",
        "Each picture ___ on the stone wall was carved carefully to stand for a word.",
      ],
      confusions: ["papyrus", "artifact"],
      clues: [
        "a wall picture like an owl or eye standing for a sound or word",
        "a bird-shaped symbol painted by a scribe to represent a sound",
        "a carved picture symbol on a stone wall standing for a word",
      ],
      contrast: ["hieroglyph is a picture sign; papyrus is the paper sheet", "hieroglyph 是象形文字符号；papyrus 是写字用的纸"],
      conflicts: [
        [
          "papyrus is the flat reed paper people wrote on, not a picture sign standing for a word or sound",
          "papyrus 是书写用的纸莎草纸，不是代表字词或读音的象形图形",
        ],
        [
          "artifact is a physical object made long ago, not a single picture sign standing for a sound or word",
          "artifact 指古人制作的实物器皿，不是代表某个读音或词语的文字图形",
        ],
      ],
      spelling: ["hi · er · o · glyph", "ie at the start, y for short i, and ph for /f/", "开头的 ie、发短 i 的 y 和结尾发 /f/ 的 ph"],
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
      clues: [
        "a scientist brushing away sand to uncover an ancient wall",
        "a researcher recording exactly where each pottery piece was found",
        "a scientist discovering a lost city after years of digging",
      ],
      contrast: ["archaeologist digs up history today; scribe wrote records long ago", "archaeologist 是现代考古科学家；scribe 是古代书吏"],
      conflicts: [
        [
          "scribe lived in ancient times writing down records, not a modern scientist digging up what people left behind",
          "scribe 是古埃及抄写记录的书吏，不是通过发掘遗物研究过去的现代科学家",
        ],
        [
          "pharaoh was an ancient Egyptian king who ruled the country, not a scientist studying the past by digging",
          "pharaoh 是统治古埃及的国王，不是通过挖掘研究历史的科学家",
        ],
      ],
      spelling: ["ar · chae · ol · o · gist", "ch saying /k/, ae in the middle, and -ologist", "读 /k/ 的 ch、中间的 ae 和结尾 -ologist"],
    },
    {
      word: "obelisk",
      forms: ["obelisks"],
      meaning: ["a tall stone pillar with four sides and a pointed top", "方尖碑，四面、顶端尖的高石柱"],
      sentences: [
        "In front of the temple stood a tall, pointed ___ carved from a single stone.",
        "Workers used ramps and ropes to stand the towering four-sided stone ___ upright.",
        "The ___ was carved from one block of pink granite and covered in writing.",
      ],
      confusions: ["tomb", "artifact"],
      clues: [
        "a tall pointed pillar carved from a single stone outside a temple",
        "a towering four-sided stone pillar raised upright with ramps and ropes",
        "a single pink-granite pillar covered in carved writing",
      ],
      contrast: ["obelisk is a tall pointed stone pillar; tomb is a burial room", "obelisk 是高耸尖顶石柱；tomb 是安葬墓室"],
      conflicts: [
        [
          "tomb is a hollow room where someone is buried, not a tall solid stone pillar with a pointed top",
          "tomb 是安葬死者的中空墓室，不是四面尖顶的高大实心石柱",
        ],
        [
          "artifact is a general word for an old human-made object, not specifically a tall four-sided pointed stone pillar",
          "artifact 泛指古人制作的小件器物，不特指四面尖顶的高大石柱",
        ],
      ],
      spelling: ["ob · e · lisk", "ob + e + lisk ending in sk", "ob 加 e 再加以 sk 结尾的 lisk"],
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
  intro: t(
    "Tiny ice pellets bounce off the car roof—too warm for fluffy snow, too cold for rain: that is **sleet**! Weather science names every kind of rain, wind, storm, and measuring tool.",
    "一颗颗小冰粒砸在车顶上直蹦——下雪太暖、下雨又太冷，这就是冻雨（**sleet**）。气象科学里，每种风雨雪雹和观测仪器都有自己的专名。",
  ),
  watchOut: {
    meanings: t(
      "Tell **humidity** (invisible water vapor floating in the air) apart from **precipitation** (water actually falling from clouds as rain, snow, or hail).",
      "分清 **humidity**（空气里看不见的水汽湿度）和 **precipitation**（真正从云里落下来的雨雪冰雹等降水）。",
    ),
    use: t(
      "A **barometer** is the tool that measures air pressure, while a **meteorologist** is the scientist who reads the data and forecasts weather.",
      "**barometer** 是测气压的仪器，**meteorologist** 是预报天气的气象学家——别把工具和人弄混。",
    ),
    spelling: t(
      "Watch **drizzle** and **blizzard** (both have double *z*) and **meteorologist** (*me-te-or-ol-o-gist*).",
      "注意 **drizzle** 和 **blizzard** 里的双写 **z**，以及 **meteorologist** 中间的 **eo**（*me-te-or-ol-o-gist*）。",
    ),
  },
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
      clues: [
        "summer air feeling heavy and damp with moisture",
        "moisture in the air so high that laundry will not dry on the line",
        "very dry desert air holding almost no water vapor",
      ],
      contrast: [
        "humidity is moisture hanging in the air; precipitation falls from clouds",
        "humidity 是空气里的湿气；precipitation 是落下的雨雪",
      ],
      conflicts: [
        [
          "precipitation is water actually falling from clouds as rain, snow, or hail, not invisible water vapor in the air",
          "precipitation 是从云层落下的雨雪冰雹，不是空气里看不见的水汽",
        ],
        [
          "drizzle is light falling rain, not the amount of invisible water vapor in the air",
          "drizzle 是飘落的毛毛细雨，不是空气里看不见的湿度水汽",
        ],
      ],
      spelling: ["hu · mid · i · ty", "single m and -ity ending", "单个 m 和结尾 -ity"],
    },
    {
      word: "precipitation",
      meaning: ["water that falls from clouds, such as rain, snow or hail", "降水，从云中落下的水，如雨、雪、冰雹"],
      sentences: [
        "Rain, snow and sleet are all kinds of ___.",
        "The desert gets less than ten inches of ___ in a whole year.",
        "The weather report said there was a chance of ___, either rain or snow, this afternoon.",
      ],
      confusions: ["humidity", "drizzle"],
      clues: [
        "a category covering rain, snow, and sleet falling from clouds",
        "less than ten inches of falling rain or snow in a desert year",
        "a weather report's chance of rain or snow falling this afternoon",
      ],
      contrast: [
        "precipitation covers all falling rain, snow, or hail; humidity is invisible vapor in the air",
        "precipitation 指所有落下的降水；humidity 是空气湿度",
      ],
      conflicts: [
        [
          "humidity is invisible water vapor floating in the air, not water falling from clouds as rain or snow",
          "humidity 是空气里的隐形水汽，不是从云中落下的雨雪等降水",
        ],
        [
          "drizzle is only one light kind of rain, too narrow to cover all falling water such as rain, snow, and sleet",
          "drizzle 只是毛毛细雨这一种，无法概括雨、雪、冻雨等全部降水形式",
        ],
      ],
      spelling: ["pre · cip · i · ta · tion", "soft c (/s/) in cip and -tion ending", "cip 里读 /s/ 的 c 和结尾 -tion"],
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
      clues: [
        "a weather instrument showing falling air pressure before a storm",
        "a gauge sailors checked to spot an approaching storm",
        "an instrument whose needle drops quickly before a hurricane",
      ],
      contrast: [
        "barometer is the air-pressure gauge; meteorologist is the weather scientist",
        "barometer 是测气压的仪器；meteorologist 是预报天气的科学家",
      ],
      conflicts: [
        [
          "meteorologist is a human weather scientist, not a tool that measures air pressure",
          "meteorologist 是气象学家，不是测量气压的仪器",
        ],
        ["humidity is water vapor in the air, not an instrument that measures air pressure", "humidity 是空气湿度，不是测量气压的工具"],
      ],
      spelling: ["ba · rom · e · ter", "ba + rom + -eter ending", "ba 加 rom 再加结尾 -eter"],
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
      confusions: ["barometer", "precipitation"],
      clues: [
        "a weather forecaster on the news predicting snow tomorrow",
        "a scientist studying wind and cloud maps to forecast weather",
        "a weather expert warning that three days of rain might flood a river",
      ],
      contrast: [
        "meteorologist is the weather scientist; barometer is one instrument they read",
        "meteorologist 是科学家；barometer 是仪器",
      ],
      conflicts: [
        [
          "barometer is an air-pressure tool, not a scientist who studies and predicts the weather",
          "barometer 是气压表工具，不是研究并预报天气的科学家",
        ],
        [
          "precipitation is falling rain or snow itself, not the scientist who studies and predicts weather",
          "precipitation 是落下的雨雪本身，不是研究气象并发出预报的科学家",
        ],
      ],
      spelling: ["me · te · or · ol · o · gist", "meteor + -ologist (watch the eo in meteor)", "meteor 加 -ologist（注意 meteor 里的 eo）"],
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
      confusions: ["tornado", "monsoon"],
      clues: [
        "a sudden rush of wind blowing a hat right off a head",
        "a sudden blast of wind slamming a door shut",
        "one strong burst of wind lifting a kite high above trees",
      ],
      contrast: [
        "gust is a brief burst of wind; tornado is a spinning destructive funnel",
        "gust 是短暂一阵猛风；tornado 是破坏力极强的旋转龙卷风",
      ],
      conflicts: [
        [
          "tornado is a destructive spinning wind column from a storm cloud, far stronger than a sudden rush of wind",
          "tornado 是破坏力极强的旋转龙卷风，不是短暂的一阵强风",
        ],
        [
          "monsoon is a months-long seasonal rainy wind, not a single sudden rush of wind",
          "monsoon 是持续数周带来雨季的季风，不是瞬间刮起的一阵强风",
        ],
      ],
      spelling: ["gust", "short u followed by st blend", "短音 u 加结尾 st"],
    },
    {
      word: "drizzle",
      meaning: ["light rain with very small drops", "毛毛雨，雨滴很小的小雨"],
      sentences: [
        "It was only a light ___, so we did not need an umbrella.",
        "The ___ was so light that it barely wet the sidewalk.",
        "We kept playing soccer in the gentle ___.",
      ],
      confusions: ["sleet", "precipitation"],
      clues: [
        "a rain so light that nobody needs an umbrella",
        "fine tiny rain drops barely wetting the sidewalk",
        "a gentle light rain players can keep playing soccer in",
      ],
      contrast: ["drizzle is tiny soft rain; sleet is frozen ice pellets", "drizzle 是细小毛毛雨；sleet 是冻成冰粒的冻雨"],
      conflicts: [
        [
          "sleet is freezing rain that falls as small ice pellets, not light liquid rain with tiny drops",
          "sleet 是落成小冰粒的冻雨，不是细软轻柔的液态毛毛雨",
        ],
        [
          "precipitation covers every kind of falling water including snow and hail, not specifically light rain with tiny drops",
          "precipitation 泛指雨雪冰雹等所有降水，并不特指雨滴很小的毛毛雨",
        ],
      ],
      spelling: ["driz · zle", "dr blend, double z, and -le ending", "dr 连缀、双写 z 和结尾 -le"],
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
      clues: [
        "tiny frozen ice pellets bouncing on a car roof",
        "freezing rain glazing power lines and making roads slippery",
        "icy pellets falling when it is too warm for snow and too cold for rain",
      ],
      contrast: ["sleet falls as tiny ice pellets; drizzle is liquid light rain", "sleet 是下落的小冰粒冻雨；drizzle 是液态毛毛细雨"],
      conflicts: [
        [
          "drizzle is gentle liquid rain, not rain that freezes into tiny pieces of ice as it falls",
          "drizzle 是细软的液态小雨，不是下落时冻成小冰粒的冻雨",
        ],
        [
          "blizzard is a long heavy snowstorm with strong winds, not falling frozen rain pellets",
          "blizzard 是伴有强风的漫长暴风雪，不是冻成小冰粒落下的冻雨",
        ],
      ],
      spelling: ["sleet", "sl blend and double e", "sl 连缀和双写 e"],
    },
    {
      word: "blizzard",
      forms: ["blizzards"],
      meaning: ["a long, heavy snowstorm with strong winds", "暴风雪，伴有强风的长时间大雪"],
      sentences: [
        "During the ___, the wind blew so much snow that no one could see the road.",
        "Schools closed because the ___ had buried the roads in snow.",
        "The climbers waited in their tent until the howling snow of the ___ ended.",
      ],
      confusions: ["sleet", "tornado"],
      clues: [
        "blinding wind-blown snow hiding the road from view",
        "a heavy snowstorm burying roads and closing schools",
        "a howling snowstorm forcing climbers to wait inside their tent",
      ],
      contrast: ["blizzard is a severe snowstorm; sleet is small falling ice pellets", "blizzard 是狂风暴雪；sleet 是冻雨冰粒"],
      conflicts: [
        [
          "sleet is falling ice pellets from freezing rain, not a long heavy snowstorm with strong winds",
          "sleet 只是冻雨冰粒，不是大风卷雪、漫长猛烈的暴风雪",
        ],
        [
          "tornado is a spinning column of wind from a thunderstorm, not a heavy snowstorm with howling snow",
          "tornado 是雷雨云下的旋转风柱，不是漫天大雪的暴风雪",
        ],
      ],
      spelling: ["bliz · zard", "bl blend, double z, and -ard ending", "bl 连缀、双写 z 和结尾 -ard"],
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
      clues: [
        "a spinning wind column tearing up trees in a narrow path across a field",
        "a dangerous storm whose siren sends people hurrying to the basement",
        "a funnel touching down for a minute and lifting a barn roof",
      ],
      contrast: [
        "tornado is a spinning wind funnel; gust is just a quick rush of wind",
        "tornado 是破坏力极强的旋转气柱；gust 只是突然一阵风",
      ],
      conflicts: [
        [
          "gust is only a quick, ordinary burst of wind, not a destructive spinning column reaching down from a storm cloud",
          "gust 只是短暂的一阵普通强风，不是破坏力极强的旋转气柱",
        ],
        [
          "blizzard is a long heavy snowstorm, not a spinning column of wind from a storm cloud",
          "blizzard 是持续很久的暴风雪，不是旋转气柱状的龙卷风",
        ],
      ],
      spelling: ["tor · na · do", "or in tor and long o at the end", "tor 里的 or 和结尾长音 o"],
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
      confusions: ["gust", "tornado"],
      clues: [
        "a summer seasonal wind bringing weeks of heavy rain to fill rivers",
        "the seasonal rainy wind that signals farmers to plant rice",
        "a rainy season so heavy that city streets turn into rivers",
      ],
      contrast: ["monsoon is a seasonal rainy wind; tornado is a brief spinning storm", "monsoon 是带来雨季的季风；tornado 是短促的龙卷风"],
      conflicts: [
        [
          "gust is a single brief rush of wind, not a seasonal wind that brings a whole season of heavy rain",
          "gust 只是一瞬间的阵风，不是随季节到来、带来整个雨季的季风",
        ],
        [
          "tornado is a brief, narrow spinning funnel, not a seasonal wind bringing a season of heavy rain",
          "tornado 是短暂狭窄的旋转风柱，不是带来漫长雨季的季节性季风",
        ],
      ],
      spelling: ["mon · soon", "single n in mon and double o in soon", "mon 单个 n，soon 双写 o"],
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
  intro: t(
    "A brown moth lands on rough tree bark and practically disappears—its **camouflage** hides it from hungry birds. Every animal has built-in ways to stay alive, from **hibernating** in winter to **migrating** thousands of miles.",
    "一只褐色飞蛾落到粗糙的树皮上，眨眼间就像消失了一样——它的伪装（**camouflage**）躲过了捕食的鸟。从冬眠（**hibernate**）到万里迁徙（**migrate**），动物生存各有绝招。",
  ),
  watchOut: {
    meanings: t(
      "Do not swap **predator** (the hunter, like an owl or shark) and **prey** (the animal being hunted, like a mouse or rabbit).",
      "别把 **predator**（捕食者，如猫头鹰、鲨鱼）和 **prey**（猎物，如老鼠、兔子）搞反。",
    ),
    use: t(
      "**Hibernate** means sleeping in one spot all winter, while **migrate** means traveling far away when seasons change.",
      "**hibernate** 是留在原地冬眠，**migrate** 是随季节长途迁徙——看动物是睡过冬天还是搬家远行。",
    ),
    spelling: t(
      "Watch **camouflage** (*ou* + *-age* saying /ɑːʒ/), **prey** (*ey* says long *a*, not *pray*), and **burrow** (double *r* + *ow*).",
      "注意 **camouflage** 里的 **ou** 和结尾 **-age**、**prey** 的 **ey**（别写成祈祷 *pray*），以及 **burrow** 的双写 **r**。",
    ),
  },
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
      clues: [
        "island animals slowly changing over years to handle the cold",
        "adjusting to a warmer climate instead of having to move north",
        "city pigeons adjusting easily to living on buildings instead of cliffs",
      ],
      contrast: [
        "adapt changes how an animal lives in place; migrate moves to another region",
        "adapt 是改变自身来适应环境；migrate 是搬去别处",
      ],
      conflicts: [
        [
          "migrate means traveling far away when the season changes, not changing how you live to fit a place",
          "migrate 是随季节长途迁徙，不是改变自身去适应环境",
        ],
        [
          "hibernate means sleeping through the winter, not changing in ways that help you live in a place",
          "hibernate 是在冬天里沉睡冬眠，不是通过改变来适应环境",
        ],
      ],
      spelling: ["a · dapt", "two a's (not adopt with o) ending in pt", "两个 a（别写成收养 adopt），结尾 pt"],
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
      clues: [
        "a moth's brown coloring matching rough tree bark",
        "a snowy owl's white feathers blending into the Arctic snow",
        "a chameleon changing its colors to match green leaves",
      ],
      contrast: [
        "camouflage hides an animal's look; habitat is the whole environment it lives in",
        "camouflage 是保护色伪装；habitat 是栖息环境",
      ],
      conflicts: [
        [
          "instinct is an inborn behavior an animal knows without being taught, not colors or patterns that blend in",
          "instinct 是天生会做的行为本能，不是用来隐藏身形的颜色或花纹",
        ],
        [
          "habitat is the whole natural environment an animal lives in, not the colors or patterns that help it blend in",
          "habitat 指动物居住的整片自然环境，不是帮助融入周围的保护色花纹",
        ],
      ],
      spelling: ["cam · ou · flage", "ou in the middle and -flage ending", "中间的 ou 和结尾 -flage"],
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
      clues: [
        "an owl hunting mice at night for food",
        "a shark hunting at the top of the ocean food chain",
        "a hunter circling overhead that makes a rabbit freeze",
      ],
      contrast: ["predator does the hunting; prey is the animal being hunted", "predator 是捕猎方；prey 是被捕食的猎物"],
      conflicts: [
        [
          "prey is the animal being hunted for food, the exact opposite of the hunter doing the chasing",
          "prey 是被追捕的猎物，与主动捕猎其他动物的捕食者正相反",
        ],
        [
          "habitat is the natural home where an animal lives, not an animal that hunts other animals for food",
          "habitat 是动物居住的栖息地，不是捕食其他动物的捕食者",
        ],
      ],
      spelling: ["pred · a · tor", "pr blend and -tor ending (not -ter)", "pr 连缀和结尾 -tor（不是 -ter）"],
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
      clues: [
        "rabbits hunted for food by foxes and hawks",
        "a small animal spotted from the sky by a hunting hawk",
        "small fish hunted by bigger fish, birds, and seals",
      ],
      contrast: ["prey is hunted for food; predator is the hunter", "prey 是被捕食者；predator 是捕食者"],
      conflicts: [
        [
          "predator is the hunter doing the chasing, the exact opposite of an animal hunted for food",
          "predator 是主动捕猎的一方，与被其他动物捕食的猎物正相反",
        ],
        ["burrow is a dug underground tunnel, not an animal hunted for food", "burrow 是动物挖出来的洞穴，不是被捕食的猎物"],
      ],
      spelling: ["prey", "ey spelling long a (not pray)", "发长 a 音的 ey（别写成祈祷 pray）"],
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
      clues: [
        "bears sleeping in a den all winter until spring",
        "groundhogs eating as much as possible before sleeping through winter",
        "frogs sleeping through winter in pond-bottom mud",
      ],
      contrast: [
        "hibernate sleeps through winter in place; migrate travels far away for warmth",
        "hibernate 是原地冬眠；migrate 是长途迁徙",
      ],
      conflicts: [
        [
          "migrate means traveling a long way to a warmer place, not staying asleep through the winter",
          "migrate 是长途迁往暖和的地方，不是留在原地一睡过冬",
        ],
        [
          "adapt means changing in ways that help you live in a place, not sleeping through the winter",
          "adapt 是改变自身以适应环境，不是整个冬天沉睡冬眠",
        ],
      ],
      spelling: ["hi · ber · nate", "long i in hi, er, and -nate with silent e", "hi 长音 i、中间 er 和带 e 的 -nate"],
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
      confusions: ["hibernate", "adapt"],
      clues: [
        "geese flying south to warmer lakes every autumn",
        "monarch butterflies traveling thousands of miles to Mexico for winter",
        "whales traveling long distances to warm waters to give birth",
      ],
      contrast: [
        "migrate travels long distances seasonally; hibernate stays asleep in one shelter",
        "migrate 是季节性远行；hibernate 是在洞里冬眠",
      ],
      conflicts: [
        [
          "hibernate means sleeping in one spot all winter, the opposite of traveling a long way when the season changes",
          "hibernate 是留在原地沉睡过冬，与随季节长途远行迁徙正相反",
        ],
        [
          "adapt means changing how you live in a place, not making a long seasonal journey to a new region",
          "adapt 是改变自身适应环境，不是随季节长途迁往新地方",
        ],
      ],
      spelling: ["mi · grate", "long i in mi and gr blend with silent e", "mi 长音 i、gr 连缀和词尾 e"],
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
      clues: [
        "a whole rainforest serving as the natural home of frogs, birds, and monkeys",
        "a forest home destroyed for orangutans when trees are cut down",
        "a pond serving as the natural home of frogs and dragonflies",
      ],
      contrast: [
        "habitat is the whole natural region; burrow is one small dug tunnel",
        "habitat 是整片自然栖息环境；burrow 只是挖出的小洞穴",
      ],
      conflicts: [
        [
          "burrow is one single hole or tunnel dug underground, not the whole natural home of animals and plants",
          "burrow 只是动物挖出的一个地下洞穴，不是整片自然栖息家园",
        ],
        [
          "camouflage is colors or patterns that help an animal blend in, not the natural place where it lives",
          "camouflage 是隐藏身形的保护色，不是动植物赖以生存的自然家园",
        ],
      ],
      spelling: ["hab · i · tat", "hab + i + tat (three short vowels)", "hab 加 i 加 tat"],
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
      confusions: ["camouflage", "habitat"],
      clues: [
        "a baby turtle knowing how to crawl toward the sea without being taught",
        "a spider knowing how to spin a web without ever learning",
        "a puppy automatically chasing a rolling ball by built-in urge",
      ],
      contrast: ["instinct is built-in behavior from birth; camouflage is body coloring", "instinct 是天生本能；camouflage 是外表伪装"],
      conflicts: [
        [
          "camouflage is colors or patterns that hide an animal, not something an animal knows how to do without being taught",
          "camouflage 是隐藏外表的花纹颜色，不是动物无须学习天生就会的行为本能",
        ],
        [
          "habitat is the natural place where an animal lives, not an untaught behavior an animal is born with",
          "habitat 是动物生活的自然环境，不是动物与生俱来的行为本能",
        ],
      ],
      spelling: ["in · stinct", "in- + stinct ending in nct", "in- 加以 nct 结尾的 stinct"],
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
      clues: [
        "an underground rabbit hole hidden under a hedge",
        "a tunnel a fox digs beneath old tree roots",
        "an underground tunnel whose entrance prairie dogs guard",
      ],
      contrast: ["burrow is a dug tunnel home; habitat is the whole surrounding landscape", "burrow 是挖出的洞穴；habitat 是整片栖息地"],
      conflicts: [
        [
          "habitat is the whole natural environment around an animal, not a dug underground hole or tunnel",
          "habitat 指整片自然栖息环境，不是动物挖出来居住的洞穴或地道",
        ],
        ["prey is a hunted animal, not a hole or tunnel an animal digs to live in", "prey 是被捕食的动物，不是动物挖来居住的地下洞穴"],
      ],
      spelling: ["bur · row", "double r and ow saying long o (not borrow with o)", "双写 r 和发长 o 的 ow（别写成借用 borrow）"],
    },
    {
      word: "nocturnal",
      meaning: ["active at night and asleep during the day", "夜行的，夜间活动、白天睡觉的"],
      sentences: [
        "Bats are ___, so they sleep all day and fly out after dark.",
        "Owls are ___ hunters that use their sharp hearing in the dark.",
        "Because raccoons are ___, you rarely see them at noon.",
      ],
      confusions: ["dormant", "fertile"],
      clues: [
        "bats sleeping all day and flying out after dark",
        "owls hunting in the dark with sharp hearing",
        "raccoons active at night so you rarely spot them at noon",
      ],
      contrast: [
        "nocturnal means active every night and asleep by day; dormant means inactive for a whole season or years",
        "nocturnal 指昼伏夜出；dormant 指长时间休眠不活动",
      ],
      conflicts: [
        [
          "dormant means inactive for a whole winter or centuries, not waking up every night to fly or hunt",
          "dormant 指整季或多年休眠，不是每晚醒来活动的昼伏夜出",
        ],
        [
          "fertile means able to grow strong plants, not active at night and asleep during the day",
          "fertile 指土地肥沃，不能形容夜间活动、白天睡觉的动物习性",
        ],
      ],
      spelling: ["noc · tur · nal", "ct in the middle, ur, and -al ending", "中间 ct、ur 和结尾 -al"],
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
  intro: t(
    "Press two fingers gently against your wrist after running upstairs and feel your **pulse** racing—each beat pushes blood through an **artery** away from your heart. Ten science words map how your body's systems work together.",
    "跑完楼梯后用两根手指轻按手腕，就能摸到扑通直跳的脉搏（**pulse**）——每一次心跳都在把血液送进动脉（**artery**）。这十个科学词带你认识人体各系统如何协作。",
  ),
  watchOut: {
    meanings: t(
      "Do not swap **artery** (carries blood *away* from the heart) and **vein** (carries blood *back* to the heart)—remember **A** for **A**way.",
      "别把 **artery**（把血带离心脏的动脉）和 **vein**（把血送回心脏的静脉）弄混——记 **A** 对应 **A**way。",
    ),
    use: t(
      "Tell **skeleton** (all the bones of the whole body) apart from **spine** (just the single row of bones down your back).",
      "分清 **skeleton**（全身所有骨头组成的骨骼）和 **spine**（只是背部中间那一串脊柱骨）。",
    ),
    spelling: t(
      "Watch **vein** (*ei* says long *a*, not *vain*), **tissue** (double *s* + *-ue*), and **ligament** (*lig-a-ment*).",
      "注意 **vein** 里的 **ei**（别写成 *vain*）、**tissue** 的双写 **s** 加 **-ue**，以及 **ligament** 中间的 **a**。",
    ),
  },
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
      clues: [
        "the stomach doing the special job of breaking down food",
        "the skin as the largest working body part",
        "the heart doing the special job of pumping blood",
      ],
      contrast: [
        "organ is a whole body part with a special job; tissue is a group of matching cells",
        "organ 是完成专门工作的完整器官；tissue 是同类细胞群",
      ],
      conflicts: [
        [
          "tissue is a group of similar cells working together, not a whole body part like the heart or stomach",
          "tissue 是同类细胞组成的组织，不是心脏、胃这类完整的身体器官",
        ],
        [
          "skeleton is all the body's bones joined together, not one individual working body part",
          "skeleton 是全身连在一起的骨骼框架，不是单个承担特定功能的器官",
        ],
      ],
      spelling: ["or · gan", "or at the start and -gan ending", "开头 or 加结尾 -gan"],
    },
    {
      word: "skeleton",
      forms: ["skeletons"],
      meaning: ["all the bones of a body joined together", "骨骼，全身连在一起的骨头"],
      sentences: [
        "Your ___ holds your body up and protects the soft parts inside.",
        "A shark's whole ___ of head, ribs, and fins is made of rubbery cartilage instead of bone.",
        "The museum showed the whole ___ of a dinosaur.",
      ],
      confusions: ["spine", "organ"],
      clues: [
        "the full bony frame holding the body up and protecting soft parts inside",
        "a shark's entire frame of head, ribs, and fins made of cartilage",
        "the entire bony frame of a dinosaur on display",
      ],
      contrast: [
        "skeleton is all the bones in the whole body; spine is only the row of back bones",
        "skeleton 是全身骨骼；spine 只指背部脊柱",
      ],
      conflicts: [
        [
          "spine is only the single row of bones down the back, not all the bones of the whole body joined together",
          "spine 只是背部中间那一串骨头，不是全身连在一起的整副骨骼",
        ],
        [
          "organ is a soft working body part like the heart or stomach, not the bony framework of the whole body",
          "organ 是心脏、胃这类器官，不是支撑全身的整副骨骼",
        ],
      ],
      spelling: ["skel · e · ton", "sk at the start and -eton ending", "开头 sk 和结尾 -eton"],
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
      clues: [
        "a group of long muscle cells working together to pull",
        "new body cells growing back to close a finger cut",
        "hard bone cells packed with calcium",
      ],
      contrast: [
        "tissue is a group of matching cells; organ is a whole body part made of tissues",
        "tissue 是同类细胞群；organ 是由多种组织构成的完整器官",
      ],
      conflicts: [
        [
          "organ is a whole body part with a special job, not a group of matching cells that form muscles, bone, or healing skin",
          "organ 是承担专门功能的完整器官，不是组成肌肉或愈合伤口的同类细胞群",
        ],
        [
          "ligament is a tough band tying two bones at a joint, not a general group of similar cells",
          "ligament 是连接关节两块骨头的韧带，不是泛指的同类细胞组织",
        ],
      ],
      spelling: ["tis · sue", "double s saying /ʃ/ and -ue ending", "双写读 /ʃ/ 的 s 和结尾 -ue"],
    },
    {
      word: "artery",
      forms: ["arteries"],
      meaning: ["a tube that carries blood away from the heart", "动脉，把血液从心脏运出的血管"],
      sentences: [
        "Each beat of the heart pushes blood out into the ___ that leaves it.",
        "The biggest ___ in the body leaves the heart and carries blood down to the legs.",
        "The doctor felt the pulsing ___ carrying blood away from the heart in my neck.",
      ],
      confusions: ["vein", "spine"],
      clues: [
        "the blood tube receiving blood pushed out from the heart",
        "the largest blood tube leaving the heart toward the legs",
        "a pulsing neck blood tube carrying blood away from the heart",
      ],
      contrast: [
        "artery carries blood away from the heart; vein carries blood back to the heart",
        "artery 把血液带离心脏；vein 把血液送回心脏",
      ],
      conflicts: [
        [
          "vein carries blood back toward the heart, the exact opposite direction of a tube carrying blood away from it",
          "vein 是把血液送回心脏的静脉，与把血运离心脏的方向正相反",
        ],
        [
          "spine is the row of bones down your back, not a tube carrying blood away from the heart",
          "spine 是背部的脊柱骨，不是输送血液离开心脏的血管",
        ],
      ],
      spelling: ["ar · ter · y", "ar + ter + y ending", "ar 加 ter 再加结尾 y"],
    },
    {
      word: "vein",
      forms: ["veins"],
      meaning: ["a tube that carries blood back to the heart", "静脉，把血液送回心脏的血管"],
      sentences: [
        "The blue line under the skin of your wrist is a ___ taking blood back to your heart.",
        "The nurse took a little blood from a blue ___ near the skin returning blood to my heart.",
        "Blood in a ___ is on its way back to the heart.",
      ],
      confusions: ["artery", "ligament"],
      clues: [
        "the blue blood tube under wrist skin returning blood to the heart",
        "a blue blood tube near the skin carrying blood back to the heart",
        "a blood tube whose blood is returning to the heart",
      ],
      contrast: [
        "vein carries blood back to the heart; artery carries blood away from the heart",
        "vein 把血液送回心脏；artery 把血液带离心脏",
      ],
      conflicts: [
        [
          "artery carries blood away from the heart, the opposite direction of a tube returning blood to it",
          "artery 把血液运离心脏，与把血液送回心脏的方向正相反",
        ],
        [
          "ligament is a tough band holding two bones together at a joint, not a tube carrying blood back to the heart",
          "ligament 是连接骨头的韧带，不是把血液送回心脏的血管",
        ],
      ],
      spelling: ["vein", "ei spelling long a (not vain)", "发长 a 音的 ei（别写成 vain）"],
    },
    {
      word: "spine",
      forms: ["spines"],
      meaning: ["the row of bones down the middle of your back", "脊柱，背部中间的一串骨头"],
      sentences: [
        "Sit up straight so that the row of bones in your ___ down your back is not bent over the desk.",
        "Each bone of your ___ has a hole in it for the nerves to pass through.",
        "Animals with a ___, such as fish and birds, are called vertebrates.",
      ],
      confusions: ["skeleton", "vein"],
      clues: [
        "the row of back bones you keep straight when sitting at a desk",
        "the row of back bones with nerve holes running down the middle",
        "the backbone that defines vertebrates like fish and birds",
      ],
      contrast: ["spine is the row of back bones; skeleton is all the bones of the whole body", "spine 只指背部脊柱；skeleton 是全身骨骼"],
      conflicts: [
        [
          "skeleton means all the bones of the whole body together, not specifically the row of bones down the back",
          "skeleton 指全身所有骨头，不专指背部中间那一串脊柱骨",
        ],
        [
          "vein is a soft tube carrying blood back to the heart, not a row of bones down the back",
          "vein 是输送血液回心的血管，不是背部中间的一串骨头",
        ],
      ],
      spelling: ["spine", "sp blend and silent e making long i", "sp 连缀和让 i 读长音的词尾 e"],
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
      clues: [
        "mouth liquid mixed into food during chewing to soften it",
        "mouth liquid triggered by the smell of baking bread",
        "mouth liquid keeping a panting dog's mouth wet",
      ],
      contrast: ["saliva is mouth liquid; pulse is the heartbeat felt at wrist or neck", "saliva 是口腔液体；pulse 是血液跳动的脉搏"],
      conflicts: [
        [
          "pulse is the rhythmic beat of blood in your wrist or neck, not liquid inside your mouth",
          "pulse 是手腕或颈部摸到的脉搏跳动，不是口腔里的液体",
        ],
        [
          "tissue is a solid group of matching body cells, not a liquid in your mouth",
          "tissue 是同类细胞组成的实体组织，不是口中湿润食物的液体",
        ],
      ],
      spelling: ["sa · li · va", "long i in li and -va ending", "li 里的长音 i 和结尾 -va"],
    },
    {
      word: "pulse",
      meaning: ["the beat of blood you can feel at your wrist or neck", "脉搏，在手腕或颈部能感觉到的血液跳动"],
      sentences: [
        "After the race, the nurse pressed two fingers on my wrist to count my ___.",
        "My ___ was fast after I ran up the stairs.",
        "You can feel the steady beat of your ___ by pressing gently on the side of your neck.",
      ],
      confusions: ["saliva", "vein"],
      clues: [
        "the rhythmic blood beat counted with two fingers on the wrist",
        "the blood beat speeding up after running upstairs",
        "the steady blood beat felt by pressing gently on the neck",
      ],
      contrast: ["pulse is the beat you feel; vein is a blood-carrying tube", "pulse 是能摸到的跳动节拍；vein 是血管"],
      conflicts: [
        [
          "saliva is liquid inside your mouth, not a blood beat felt at your wrist or neck",
          "saliva 是口腔里的唾液，不是在手腕或颈部能摸到的跳动",
        ],
        [
          "vein is a physical tube carrying blood, not the rhythmic beat you count and feel",
          "vein 是输送血液的管道，不是能数次数、感觉快慢的脉搏跳动",
        ],
      ],
      spelling: ["pulse", "short u, lse ending with silent e", "短音 u 加带不发音 e 的 -lse"],
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
      confusions: ["dormant", "fertile"],
      clues: [
        "being protected from catching chickenpox again after having it once",
        "a vaccine helping protect the body against a disease",
        "staying protected from a cold everyone else caught",
      ],
      contrast: [
        "immune means protected from a sickness; dormant means inactive for now",
        "immune 是对疾病有免疫力；dormant 是暂时休眠不活动",
      ],
      conflicts: [
        [
          "dormant means inactive for now like a sleeping volcano or bulb, not protected against catching a disease",
          "dormant 指像火山或球茎那样暂时休眠，不是对疾病有免疫力",
        ],
        [
          "fertile means rich and able to grow plants, not protected from chickenpox, colds, or disease",
          "fertile 指土地肥沃，不表示对疾病免疫",
        ],
      ],
      spelling: ["im · mune", "double m and silent e making long u", "双写 m 和让 u 读长音的词尾 e"],
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
      clues: [
        "a strong ankle band stretched when holding bones together",
        "a strong band inside a knee joint torn during soccer",
        "a strong rope-like band tying two bones together",
      ],
      contrast: [
        "ligament is a tough band tying bones at a joint; tissue is any group of similar cells",
        "ligament 特指连接关节骨头的韧带；tissue 泛指同类细胞组织",
      ],
      conflicts: [
        [
          "tissue is a general uncountable word for similar cells, not a single strong band holding two bones together at a joint",
          "tissue 泛指同类细胞群，不是特指在关节处把两块骨头拴在一起的韧带",
        ],
        [
          "vein is a soft tube carrying blood back to the heart, not a strong band tying bones together",
          "vein 是输送血液的静脉，不是连接骨头的坚韧带子",
        ],
      ],
      spelling: ["lig · a · ment", "lig + a + -ment ending", "lig 加中间 a 再加 -ment"],
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
  intro: t(
    "A giant **boulder** tumbles from a cliff that ocean waves slowly **erode**, while far below a quiet volcano, red-hot **magma** waits in the dark. Earth science names both the slow sculpting and the sudden drama of our planet.",
    "海浪常年冲刷侵蚀（**erode**）着悬崖，巨石（**boulder**）轰然滚落；而在沉寂的火山深处，炽热的岩浆（**magma**）正蓄势待发。这十个词带你读懂地球缓慢又剧烈的变化。",
  ),
  watchOut: {
    meanings: t(
      "Tell **molten** (adjective: melted by great heat, like *molten glass* or *molten lava*) apart from **magma** (noun: melted rock specifically deep underground).",
      "分清 **molten**（形容词“熔化的”，可修饰熔岩、玻璃、铁水）和 **magma**（名词“岩浆”，特指地下深处的熔岩）。",
    ),
    use: t(
      "Compare sizes carefully: a **boulder** is a huge rock as big as a car, while a **pebble** is a small smooth stone that fits in your pocket or shoe.",
      "注意大小差距：**boulder** 是像汽车甚至房子一样大的巨石，**pebble** 是能揣进口袋或硌脚的小鹅卵石。",
    ),
    spelling: t(
      "Watch **boulder** (*ou* saying long *o*), **pebble** (double *b* + *-le*), and **dormant** (*dor-mant*, ending in *-ant*).",
      "注意 **boulder** 里发长 o 的 **ou**、**pebble** 的双写 **b**，以及 **dormant** 结尾的 **-ant**。",
    ),
  },
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
      confusions: ["absorb", "condense"],
      clues: [
        "ocean waves slowly wearing a cliff farther back year after year",
        "wind and sand slowly carving soft rock into strange shapes",
        "rain slowly washing away unprotected hillside soil",
      ],
      contrast: ["erode wears rock or soil away slowly; absorb takes a liquid inward", "erode 是慢慢侵蚀磨损岩石土壤；absorb 是吸收液体"],
      conflicts: [
        [
          "absorb means soaking a liquid into a material, not waves, wind, or rain wearing rock and soil away",
          "absorb 是吸收液体，不是海浪、风沙或雨水慢慢侵蚀悬崖和土壤",
        ],
        [
          "condense means changing from gas into liquid drops when cooled, not wearing rock or soil away",
          "condense 是气体遇冷凝结成液体，不是侵蚀岩石或冲走山坡泥土",
        ],
      ],
      spelling: ["e · rode", "long e at the start and silent e making long o", "开头长音 e 和让 o 读长音的词尾 e"],
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
      clues: [
        "a layer of river-carried mud and sand dropped near the sea",
        "layers of settled sand and mud at a lake bottom hardening into rock",
        "bits of mud and sand carried downstream by a muddy river",
      ],
      contrast: [
        "sediment is loose bits of sand and mud carried by water or wind; magma is hot melted rock underground",
        "sediment 是水风搬运沉积的泥沙碎屑；magma 是地下炽热的岩浆",
      ],
      conflicts: [
        [
          "magma is hot melted rock deep underground, not bits of sand and mud carried and dropped by water",
          "magma 是地下深处高温熔化的岩浆，不是河流搬运沉积的泥沙碎石",
        ],
        [
          "pebble is one single small smooth stone, not whole layers of fine sand, mud, and rock bits",
          "pebble 只是一颗小鹅卵石，不是成层沉积或随浑浊河水冲走的泥沙碎屑",
        ],
      ],
      spelling: ["sed · i · ment", "sed + i + -ment ending", "sed 加中间 i 再加 -ment"],
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
      clues: [
        "hot melted rock rising deep inside Earth beneath a volcano",
        "melted underground rock cooling slowly into crystal-rich stone",
        "melted rock filling a chamber deep below a volcano",
      ],
      contrast: [
        "magma is hot melted rock underground; sediment is loose surface sand and mud",
        "magma 是地下高温熔岩；sediment 是地表泥沙沉积物",
      ],
      conflicts: [
        [
          "sediment is loose bits of sand and mud moved by wind or water, not hot melted rock deep underground",
          "sediment 是风和水搬运的泥沙碎屑，不是地下深处滚烫的熔化岩石",
        ],
        [
          "boulder is one huge solid rock on the surface, not hot melted rock deep beneath a volcano",
          "boulder 是地表的一块固体巨石，不是地下深处熔化的岩浆",
        ],
      ],
      spelling: ["mag · ma", "mag + ma (g before m)", "mag 加 ma（注意 m 前的 g）"],
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
      clues: [
        "a small ground shake that rattled dishes without breaking anything",
        "a tiny ground vibration recorded by instruments though unfelt by people",
        "small repeated ground shakes continuing after a big earthquake",
      ],
      contrast: [
        "tremor is a small shaking motion of the ground; crater is a bowl-shaped hole",
        "tremor 是地面的轻微晃动；crater 是碗状坑洞",
      ],
      conflicts: [
        [
          "crater is a bowl-shaped hole in the ground or on a volcano, not a small shaking motion",
          "crater 是火山口或撞击坑，不是能感觉到或被仪器录下的地面轻微震动",
        ],
        [
          "landform is a permanent natural shape like a hill or valley, not a brief shaking of the ground",
          "landform 是山谷高原等固定地貌，不是短暂晃动的地面震动",
        ],
      ],
      spelling: ["trem · or", "tr blend and -or ending (not -er)", "开头 tr 和结尾 -or（不是 -er）"],
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
      clues: [
        "the bowl-shaped opening at a volcano's top sending up smoke",
        "a huge bowl-shaped hole punched into the desert by a space rock",
        "an old bowl-shaped volcano top holding rainwater like a lake",
      ],
      contrast: ["crater is a hollowed bowl-shaped hole; boulder is a solid giant rock", "crater 是凹下去的碗状坑口；boulder 是实心巨石"],
      conflicts: [
        [
          "boulder is a huge solid rock, not a bowl-shaped hollow opening that smoke rises from or rain fills",
          "boulder 是实心的巨大岩石，不是凹下去的碗状火山口或陨石坑",
        ],
        [
          "tremor is a brief shaking of the ground, not a bowl-shaped hole in rock or earth",
          "tremor 是地面轻微震动，不是实体凹陷的碗状坑洞",
        ],
      ],
      spelling: ["cra · ter", "cr blend, long a, and -ter ending", "cr 连缀、长音 a 和结尾 -ter"],
    },
    {
      word: "boulder",
      forms: ["boulders"],
      meaning: ["a very large rock", "巨石，很大的岩石"],
      sentences: [
        "A ___ as big as a car had rolled down the hill and blocked the road.",
        "The children climbed onto a giant ___ to look out over the valley.",
        "The glacier carried that huge house-sized ___ for hundreds of miles before the ice melted.",
      ],
      confusions: ["pebble", "crater"],
      clues: [
        "a car-sized rock blocking a road after rolling downhill",
        "a giant rock large enough for children to climb onto",
        "a house-sized rock hauled hundreds of miles by a glacier",
      ],
      contrast: ["boulder is a huge rock; pebble is a tiny smooth stone", "boulder 是巨大岩石；pebble 是小鹅卵石"],
      conflicts: [
        [
          "pebble is a tiny smooth stone that fits in a hand or shoe, the opposite of a gigantic rock",
          "pebble 是能握在手里的小鹅卵石，与庞大无比的巨石正相反",
        ],
        ["crater is a hollowed bowl-shaped hole, not a massive solid rock", "crater 是凹陷的碗状坑洞，不是一整块庞大的固体巨石"],
      ],
      spelling: ["boul · der", "ou saying long o and -der ending", "发长 o 音的 ou 和结尾 -der"],
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
      clues: [
        "a small smooth round beach stone that fits into a pocket",
        "a small flat smooth stone skipping across a pond",
        "a tiny stone stuck inside a shoe hurting each step",
      ],
      contrast: ["pebble is a tiny smooth stone; boulder is a huge rock", "pebble 是小鹅卵石；boulder 是大巨石"],
      conflicts: [
        ["boulder is a very large rock, the exact opposite of a small, smooth stone", "boulder 是庞大无比的巨石，与小巧光滑的鹅卵石正相反"],
        [
          "sediment is loose uncountable sand and mud, not one single small smooth stone",
          "sediment 是成片松散的泥沙沉积物，不是一颗单独的小鹅卵石",
        ],
      ],
      spelling: ["peb · ble", "double b and -le ending", "双写 b 和结尾 -le"],
    },
    {
      word: "molten",
      meaning: ["melted by great heat", "熔化的，被高温熔化的"],
      sentences: [
        "The ___ lava glowed orange as it flowed down the mountain.",
        "The worker poured ___ glass into a mold to make a bottle.",
        "Deep inside the earth, iron is so hot that it is ___.",
      ],
      confusions: ["dormant", "fertile"],
      clues: [
        "red-orange flowing lava melted by intense heat",
        "liquid-hot glass poured into a bottle mold",
        "iron deep inside Earth heated so high that it melts",
      ],
      contrast: [
        "molten means melted by great heat; dormant means quiet and inactive for now",
        "molten 是高温熔化的；dormant 是暂时休眠的",
      ],
      conflicts: [
        [
          "dormant means quiet and inactive for now, not melted into glowing liquid by great heat",
          "dormant 指暂时沉寂休眠，不是被高温熔化成炽热液态",
        ],
        [
          "fertile means able to grow strong plants, not melted by extreme heat like glowing lava, glass, or iron",
          "fertile 指肥沃能长庄稼，不能形容高温熔化的熔岩、玻璃或铁水",
        ],
      ],
      spelling: ["mol · ten", "long o in mol and -ten ending", "mol 里的长 o 和结尾 -ten"],
    },
    {
      word: "dormant",
      meaning: ["not active now, but able to become active again", "休眠的，现在不活动但可能再活动的"],
      sentences: [
        "The volcano has been ___ for two hundred years, but it could erupt again.",
        "A ___ volcano may be quiet for centuries before it erupts.",
        "The bulbs stay ___ under the frozen ground all winter.",
      ],
      confusions: ["molten", "nocturnal"],
      clues: [
        "a volcano quiet for two hundred years yet still able to erupt again",
        "a volcano resting quietly for centuries before waking up",
        "plant bulbs resting inactive underground all winter until spring",
      ],
      contrast: [
        "dormant means quiet and resting for now; molten means glowing hot and melted",
        "dormant 是暂时休眠静止；molten 是高温熔化",
      ],
      conflicts: [
        [
          "molten means melted by extreme heat, the opposite of resting quietly or sleeping through winter",
          "molten 指被高温熔化，与安静沉寂、过冬休眠正相反",
        ],
        [
          "nocturnal means active every night and asleep by day, not resting inactive for centuries or a whole winter",
          "nocturnal 指每晚昼伏夜出，不是沉寂数百年或整个冬天的休眠",
        ],
      ],
      spelling: ["dor · mant", "or in dor and -mant ending (not -ment)", "dor 里的 or 和结尾 -mant（不是 -ment）"],
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
      clues: [
        "a valley as a natural low-lying shape between hills or mountains",
        "a plateau as a natural flat, high shape with steep sides",
        "a triangular natural land shape formed where a river meets the sea",
      ],
      contrast: [
        "landform is any natural shape of the land; crater is specifically a bowl-shaped hole",
        "landform 泛指山谷高原等各类自然地貌；crater 特指碗状坑口",
      ],
      conflicts: [
        [
          "crater is specifically a bowl-shaped hole, not a general word covering valleys, plateaus, and river deltas",
          "crater 特指碗状火山口或陨石坑，不能泛指山谷、高原、三角洲等各类地貌",
        ],
        [
          "sediment is loose bits of sand and mud, not a natural shape of the land like a valley or plateau",
          "sediment 是松散的泥沙碎石，不是山谷、高原这类陆地自然地貌",
        ],
      ],
      spelling: ["land · form", "compound word: land + form", "合成词：land 加 form"],
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
  intro: t(
    "On a clear night, you aim a **telescope** past a familiar **constellation** and imagine Earth spinning on its **axis** as **gravity** holds it in **orbit** around the sun. These ten words map the solar system and the wider universe.",
    "晴朗的夜晚，你把望远镜（**telescope**）对准熟悉的星座（**constellation**），想象地球绕自转轴（**axis**）旋转，在引力（**gravity**）牵引下沿轨道（**orbit**）绕太阳公转。这十个词带你认识太阳系与宇宙。",
  ),
  watchOut: {
    meanings: t(
      "Tell **comet** (a ball of ice and dust that grows a glowing tail near the sun) apart from **asteroid** (a rocky object with no tail that orbits the sun, mostly between Mars and Jupiter).",
      "分清 **comet**（靠近太阳会长出发光尾巴的冰尘彗星）和 **asteroid**（没有尾巴、多在火星与木星之间的岩石小行星）。",
    ),
    use: t(
      "Tell **galaxy** (a huge system of billions of stars like the Milky Way) apart from **constellation** (a small star pattern in our night sky that looks like a spoon or hunter).",
      "分清 **galaxy**（由数十亿颗恒星组成的庞大星系，如银河系）和 **constellation**（夜空中看似组成图案的几颗亮星星座）。",
    ),
    spelling: t(
      "Watch **constellation** (double *l* + *-ation*), **asteroid** (*aster-* + *-oid*), and **telescope** (*tele-* + *scope* with silent *e*).",
      "注意 **constellation** 的双写 **l**、**asteroid** 结尾的 **-oid**，以及 **telescope**（*tele* 加 *scope*）。",
    ),
  },
  domain: ["space and the solar system", "太空和太阳系"],
  prerequisites: ["context-clues"],
  encompasses: fromClues,
  words: [
    {
      word: "orbit",
      forms: ["orbits", "orbited", "orbiting"],
      meaning: ["the curved path one object travels around another in space", "轨道，太空中一个物体绕另一个物体运行的弯曲路径"],
      sentences: [
        "It takes the earth one year to travel all the way around its ___ around the sun.",
        "The moon takes about a month to finish one ___ around the earth.",
        "The space station's ___ carries it around the earth every ninety minutes.",
      ],
      confusions: ["axis", "galaxy"],
      clues: [
        "Earth's year-long curved path around the sun",
        "the moon's month-long path around Earth",
        "the space station's ninety-minute loop around Earth",
      ],
      contrast: [
        "orbit is the curved path around another body; axis is the imaginary line through a planet's center",
        "orbit 是绕另一天体运行的轨道；axis 是穿过行星中心的自转轴",
      ],
      conflicts: [
        [
          "axis is an imaginary line through the middle of a planet, not a curved path traveled around another body",
          "axis 是穿过行星中心的假想自转轴，不是绕另一天体公转的环形轨道",
        ],
        [
          "galaxy is a huge group of billions of stars, not the path a planet, moon, or station follows",
          "galaxy 是由数十亿恒星组成的星系，不是绕行路径",
        ],
      ],
      spelling: ["or · bit", "or + bit (short i)", "or 加短 i 的 bit"],
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
      clues: [
        "the center line Earth spins around once a day",
        "Earth's tilted center line causing the seasons",
        "Uranus's tipped spin line pointing almost at the sun",
      ],
      contrast: [
        "axis is the imaginary center line a planet spins around; orbit is the path around another body",
        "axis 是行星自转的中心轴线；orbit 是公转轨道",
      ],
      conflicts: [
        [
          "orbit is a curved path around another body, not the tilted center line a planet spins around",
          "orbit 是公转的弯曲路径，不是行星自转所绕的倾斜中心轴",
        ],
        [
          "gravity is a pulling force, not an imaginary line that can be tilted or point at the sun",
          "gravity 是无形的吸引力，不是能倾斜或指向太阳的假想轴线",
        ],
      ],
      spelling: ["ax · is", "short a + x + -is", "短音 a 加 x 和 -is"],
    },
    {
      word: "rotate",
      forms: ["rotates", "rotated", "rotating", "rotation"],
      meaning: ["to spin around a center", "旋转，绕着中心转动"],
      sentences: [
        "As the earth continues to ___ on its axis, our side turns away from the sun and night falls.",
        "Watch the bike wheels ___ around their centers as the bicycle rolls downhill.",
        "Venus takes longer to ___ once on its axis than to travel around the sun.",
      ],
      confusions: ["absorb", "condense"],
      clues: [
        "Earth spinning on its axis so night falls",
        "bicycle wheels spinning around their centers downhill",
        "Venus spinning once on its axis slower than its year",
      ],
      contrast: ["rotate means to spin around a center; absorb takes in a liquid", "rotate 是绕中心旋转；absorb 是吸收液体"],
      conflicts: [
        [
          "absorb means taking in a liquid like a sponge, not spinning around an axis or wheel center",
          "absorb 是吸收液体，不是地球或车轮绕中心旋转",
        ],
        [
          "condense means turning from gas into liquid drops when cooled, not spinning around a center",
          "condense 是气体遇冷凝结成液体，不是绕中心自转",
        ],
      ],
      spelling: ["ro · tate", "long o in ro + -tate with silent e", "ro 读长 o 加带 e 的 -tate"],
    },
    {
      word: "galaxy",
      forms: ["galaxies"],
      meaning: ["a huge group of billions of stars", "星系，由数十亿颗恒星组成的巨大群体"],
      sentences: [
        "Our sun is just one of billions of stars in our ___.",
        "The Milky Way is the ___ that our solar system belongs to.",
        "Through a large telescope, a faraway ___ of billions of stars looks like a faint spiral of light.",
      ],
      confusions: ["constellation", "orbit"],
      clues: [
        "a vast system holding billions of stars including our sun",
        "the Milky Way system containing our solar system",
        "a faraway spiral of billions of stars seen by telescope",
      ],
      contrast: [
        "galaxy is a huge system of billions of stars; constellation is a small star pattern in the sky",
        "galaxy 是数十亿颗恒星组成的星系；constellation 是夜空中几颗亮星连成的星座",
      ],
      conflicts: [
        [
          "constellation is a small pattern of stars seen from Earth, not a vast system of billions of stars like the Milky Way",
          "constellation 只是夜空中看似连成图案的一小组亮星，不是包含数十亿恒星的银河系等星系",
        ],
        ["orbit is a curved path in space, not a huge group of billions of stars", "orbit 是天体运行的轨道，不是由数十亿恒星组成的星系"],
      ],
      spelling: ["gal · ax · y", "short a + ax + -y ending", "短 a 加 ax 和结尾 y"],
    },
    {
      word: "comet",
      forms: ["comets"],
      meaning: ["a ball of ice and dust that grows a glowing tail near the sun", "彗星，靠近太阳时会长出发光尾巴的冰尘球"],
      sentences: [
        "As the icy ___ came close to the sun, its long, bright tail grew.",
        "People were frightened long ago when a ___ with a glowing tail appeared in the sky.",
        "The icy ___ with its glowing tail returns near the sun only once every seventy-six years.",
      ],
      confusions: ["asteroid", "constellation"],
      clues: [
        "an icy body growing a long bright tail near the sun",
        "a sky visitor with a glowing tail that frightened people",
        "a glowing-tailed icy body returning every seventy-six years",
      ],
      contrast: [
        "comet is icy and grows a glowing tail near the sun; asteroid is rocky and has no tail",
        "comet 是冰尘球、靠近太阳会长尾巴；asteroid 是岩石体、没有尾巴",
      ],
      conflicts: [
        [
          "asteroid is a rocky object with no tail, not an icy body growing a glowing tail near the sun",
          "asteroid 是没有尾巴的岩石小行星，不会像彗星那样长出发光长尾",
        ],
        [
          "constellation is a pattern of distant stars, not an icy body with a glowing tail returning near the sun",
          "constellation 是遥远恒星组成的星座图案，不是带发光尾巴的冰尘天体",
        ],
      ],
      spelling: ["com · et", "short o + single m + -et", "短 o、单个 m 加 -et"],
    },
    {
      word: "asteroid",
      forms: ["asteroids"],
      meaning: ["a rocky object, smaller than a planet, that travels around the sun", "小行星，比行星小、绕太阳运行的岩石天体"],
      sentences: [
        "The ___ is a lump of rock about as wide as a city, with no tail at all.",
        "Most rocky space bodies are found in a belt between Mars and Jupiter, but this ___ came closer to the earth.",
        "Scientists sent a spacecraft to collect dust from an old rocky ___ orbiting the sun.",
      ],
      confusions: ["comet", "constellation"],
      clues: [
        "a city-wide lump of space rock with no tail",
        "a rocky space body from the belt between Mars and Jupiter",
        "an old rocky body orbiting the sun visited by spacecraft",
      ],
      contrast: [
        "asteroid is a rocky object with no tail; comet is an icy body with a glowing tail",
        "asteroid 是无尾岩石小行星；comet 是带发光尾巴的冰尘彗星",
      ],
      conflicts: [
        [
          "comet is a ball of ice and dust that grows a glowing tail, not a tailless lump of rock",
          "comet 是靠近太阳会长尾巴的冰尘球，不是没有尾巴的岩石块",
        ],
        [
          "constellation is a star pattern in the sky, not a solid lump of rock orbiting the sun",
          "constellation 是遥远恒星连成的图案，不是可以采集尘土的岩石天体",
        ],
      ],
      spelling: ["as · ter · oid", "aster- + -oid ending", "aster 加结尾 -oid"],
    },
    {
      word: "telescope",
      forms: ["telescopes"],
      meaning: ["a tool that makes faraway things look closer", "望远镜，让远处物体看起来更近的工具"],
      sentences: [
        "Through the ___, we could see the rings around Saturn.",
        "Galileo pointed his ___ at Jupiter and saw four moons.",
        "A giant ___ in space sends back clear pictures of faraway stars.",
      ],
      confusions: ["astronaut", "axis"],
      clues: [
        "an instrument letting us see Saturn's rings up close",
        "the instrument Galileo pointed at Jupiter to spot four moons",
        "a giant space instrument photographing faraway stars",
      ],
      contrast: [
        "telescope is a viewing tool for faraway objects; astronaut is a person who travels to space",
        "telescope 是观测远处天体的望远镜；astronaut 是进入太空的宇航员",
      ],
      conflicts: [
        [
          "astronaut is a person trained for space travel, not an optical tool you look through or point at planets",
          "astronaut 是宇航员（人），不是用来看土星光环或对准木星的光学仪器",
        ],
        ["axis is an imaginary spin line, not a tool for viewing faraway planets and stars", "axis 是假想自转轴，不是观测远方星辰的工具"],
      ],
      spelling: ["tel · e · scope", "tele- (far) + scope with silent e", "前缀 tele-（远）加 scope"],
    },
    {
      word: "astronaut",
      forms: ["astronauts"],
      meaning: ["a person trained to travel into space", "宇航员，受过训练能进入太空的人"],
      sentences: [
        "The ___ floated inside the space station and waved at the camera.",
        "Before the rocket launch into space, the ___ trained for years.",
        "Every ___ must exercise every day in space to keep her bones strong.",
      ],
      confusions: ["telescope", "comet"],
      clues: [
        "a space traveler floating and waving inside a space station",
        "a space traveler training for years before rocket launch",
        "a space traveler exercising daily to keep bones strong",
      ],
      contrast: [
        "astronaut is a trained space traveler; telescope is a tool for viewing space",
        "astronaut 是去太空的人；telescope 是观测太空的工具",
      ],
      conflicts: [
        [
          "telescope is an optical instrument, not a person who trains, waves, or exercises in space",
          "telescope 是望远镜仪器，不是会训练、挥手或锻炼的人",
        ],
        ["comet is an icy space body, not a person trained to travel into space", "comet 是冰尘彗星，不是受训进入太空的人"],
      ],
      spelling: ["as · tro · naut", "astro- (star) + -naut (au saying /ɔː/)", "astro-（星）加含 au 的 -naut"],
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
      clues: [
        "the invisible force pulling a dropped ball to the floor",
        "the moon's weak pulling force letting astronauts leap high",
        "the pulling force keeping Earth's oceans from floating away",
      ],
      contrast: [
        "gravity is the pulling force between objects; orbit is the curved path around another body",
        "gravity 是物体间的吸引力；orbit 是天体运行的轨道",
      ],
      conflicts: [
        [
          "axis is an imaginary line a planet spins around, not a force that pulls balls or holds oceans down",
          "axis 是假想自转轴，不是把球拉向地面或吸住海水的力",
        ],
        [
          "orbit is a curved path around another body, not the pulling force holding things to the ground",
          "orbit 是公转路径，不是拉住物体和海洋的引力",
        ],
      ],
      spelling: ["grav · i · ty", "gr blend, short a, and -ity ending", "gr 连缀、短 a 和结尾 -ity"],
    },
    {
      word: "constellation",
      forms: ["constellations"],
      meaning: ["a group of stars that seems to form a picture in the sky", "星座，在天空中看似组成图案的一群星"],
      sentences: [
        "The seven bright stars of the ___ look like a big spoon.",
        "Sailors used the star pattern of the ___ called the Southern Cross to find their way.",
        "Can you find the ___ shaped like a hunter with a belt of three stars?",
      ],
      confusions: ["galaxy", "asteroid"],
      clues: [
        "seven bright stars forming the shape of a big spoon",
        "the Southern Cross star pattern guiding sailors",
        "a star pattern shaped like a hunter with a three-star belt",
      ],
      contrast: [
        "constellation is a sky picture made by a handful of stars; galaxy is a system of billions of stars",
        "constellation 是夜空中几颗星连成的星座图案；galaxy 是数十亿恒星的星系",
      ],
      conflicts: [
        [
          "galaxy is a huge system of billions of stars, not a small sky pattern of seven stars shaped like a spoon or hunter",
          "galaxy 是包含数十亿恒星的庞大星系，不是七颗星连成勺子或猎人形状的星座图案",
        ],
        [
          "asteroid is a single rocky object orbiting the sun, not a group of bright stars forming a sky picture",
          "asteroid 是单块岩石小行星，不是群星组成的星座图案",
        ],
      ],
      spelling: ["con · stel · la · tion", "con- + double l in stell + -ation", "con- 加双写 l 和 -ation"],
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
  intro: t(
    "An elephant lifts a log with its **trunk**, a family packs bags into a car's **trunk**, and a woodpecker drums on an oak's **trunk**—same spelling, three different things. The other words in a sentence always tell you which meaning fits.",
    "大象用 **trunk**（象鼻）举起木头，一家人把行李装进汽车的 **trunk**（后备箱），啄木鸟敲打橡树的 **trunk**（树干）——同一个拼写，三种不同意思。句中的其他词总会告诉你用的是哪一个。",
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
        "Many words are spelled and said the same but mean different things: a dog's **bark** and a tree's **bark**. The dictionary lists each meaning separately. To know which one a writer means, look at the other words in the sentence: *Moss grew on the bark of the old oak* is about a tree, so *bark* is its rough outside.\n\n> **Watch out.** Every choice may be a real dictionary meaning of the word—do not pick the most familiar meaning; pick the one that fits this sentence.",
        "许多词拼写和读音相同，意思却不同：狗的 **bark**（叫声）和树的 **bark**（树皮）。词典会把每个意思分开列出。要知道作者用的是哪个意思，就看句中的其他词：*Moss grew on the bark of the old oak* 说的是树，所以 *bark* 指树皮。\n\n> **注意。**每个选项都可能是这个词在词典里的真实意思——不要选最眼熟的，而要选符合当前句意的那个。",
      ),
      choiceGenerator(
        t("What does the word in bold mean in this sentence?", "加粗的词在这个句子里是什么意思？"),
        meaningInSentenceBank,
        (right, shown) =>
          t(
            `Here it means **${right}**. The other words of the sentence point to this meaning: ${shown}\n\n**Check.** Swap the bold word for *${right}* and reread the sentence—it still makes complete sense.`,
            `这里的意思是 **${right}**。句中的其他词指向这个意思：${shown}\n\n**检验。**把加粗的词换成“${right}”再读一遍句子——整句话依然完全说得通。`,
          ),
        (wrong, _right, _shown, position) =>
          position === 0
            ? t(
                `“${wrong}” is a real meaning of the word in other sentences, but nothing in this sentence points to it.`,
                `“${wrong}”是这个词在别的句子里的意思，但这句话里没有任何线索指向它。`,
              )
            : t(
                `“${wrong}” is another meaning of the same word—plug it into this sentence and it clashes with the other words.`,
                `“${wrong}”是同一个词的另一个意思——代进这句话里就会和周围的词矛盾。`,
              ),
      ),
    ),
    point(
      "same-word-different-sentences",
      t("One Word, Several Sentences", "一个词，几个句子"),
      t(
        "When the same word appears in several sentences, test the meaning you are looking for in each one. Put the meaning in place of the word and read the sentence again: *It is only just, treating everyone the same, that everyone gets a turn* makes sense, so that sentence uses **fair** in that meaning.\n\n> **Watch out.** All three sentences use the target word correctly—you must match the exact meaning asked for, not just find a natural sentence.",
        "同一个词出现在几个句子里时，把你要找的意思逐一代入。用这个意思替换这个词，再读一遍：*It is only just, treating everyone the same, that everyone gets a turn* 说得通，所以这个句子用的是 **fair** 的这个意思。\n\n> **注意。**三个句子里这个词用得都对——你要找的是符合题目所给意思的那一句，而不是随便找一句通顺的话。",
      ),
      choiceGenerator(
        t("Choose the sentence.", "选择句子。"),
        sameWordBank,
        (right) =>
          t(
            `**${right}** Only this sentence uses the word with the meaning asked for.\n\n**Check.** Replace the target word in this sentence with the meaning from the prompt and read it aloud—the sentence still makes full sense.`,
            `**${right}** 只有这句话用了题目要求的那个意思。\n\n**检验。**把这句话里的目标词换成题目给的释义读一遍——整句话依然完全通顺。`,
          ),
        (wrong, _right, _shown, position) =>
          position === 0
            ? t(
                `In “${wrong}”, the word carries a different meaning—try replacing it with the meaning from the prompt and it no longer fits.`,
                `在“${wrong}”中，这个词表达的是另一个意思——把题目给的释义代进去就会发现说不通。`,
              )
            : t(
                `“${wrong}” uses another sense of the same word, not the one described in the question.`,
                `“${wrong}”用的是这个词的另一种含义，不是题目描述的那一种。`,
              ),
      ),
    ),
  ],
};

const pool35 = wordPool(batches);

/** wordTopics35 are the vocabulary topics of grades 3 to 5. */
export const wordTopics35: readonly TopicDef[] = [...batches.map((b) => batchTopicWithPool(b, pool35)), multipleMeanings];

/** vocabulary35 are the words the batches of grades 3 to 5 teach. */
export const vocabulary35: readonly WordBatch[] = batches.map(batchWords);
