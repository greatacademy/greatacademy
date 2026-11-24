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
  intro: t(
    "The wolf in a black cape creeps onto the stage and the whole crowd boos—that is the **villain** of the story! Folk tales and fables are full of characters, lessons, and rewards like these.",
    "披着黑斗篷的狼一走上台，全场观众就喝起了倒彩——这就是故事里的反派（**villain**）。寓言和民间故事里，正少不了这样的角色、教训与奖赏。",
  ),
  watchOut: {
    meanings: t(
      "Do not mix up **fable** (the whole animal story) with **moral** (the lesson at the end of it).",
      "别把 **fable**（整篇动物寓言故事）和 **moral**（故事最后讲的道理）混为一谈。",
    ),
    use: t(
      "A **villain** is the bad character, while a **peasant** is a poor farmer—check whether the sentence shows cruelty or hard farm work.",
      "**villain** 指坏人反派，**peasant** 指穷苦农夫——看句子写的是作恶还是种地。",
    ),
    spelling: t(
      "Watch the silent **a** in **peasant** (*ea* says short *e*) and the *-ain* ending in **villain**.",
      "注意 **peasant** 里读短 *e* 的 **ea**，以及 **villain** 结尾的 **-ain**。",
    ),
  },
  domain: ["fables and folk tales", "寓言和民间故事"],
  lines: `
    moral|morals|the lesson a story teaches|故事所讲的道理，寓意|Every fable ends with a ___, such as "slow and steady wins the race."|The ___ of the story is that you should never tell lies.|Our teacher asked us to write the ___ of the tale in one sentence.|fable,folktale
    fable|fables|a short story, often about animals, that teaches a lesson|寓言，常以动物为角色、讲道理的短故事|In the short animal ___ of the ant and the grasshopper, the ant teaches a lesson about hard work.|This ___ has a talking fox and a crow, and it teaches a lesson about pride.|After reading the ___, we talked about what the tortoise taught the hare.|folktale,moral
    folktale|folktales|an old story that people have told for a very long time|民间故事，人们流传了很久的古老故事|My grandmother told me a ___ that her own grandmother had told her.|Every country has a ___ about a clever person who tricks a giant.|Nobody knows who first told this ___; it has been passed down for hundreds of years.|fable,moral
    villain|villains|the bad character in a story|反派，故事里的坏人|The ___ of the story was a wolf who wanted to eat the three little pigs.|In the end, the ___ was caught and the village was safe again.|Everyone booed when the ___ stepped onto the stage in his black cape.|peasant,fable
    peasant|peasants|a poor farmer who works on the land|农民，在土地上劳作的穷苦农夫|The poor ___ worked in the king's fields from sunrise to sunset.|The poor ___ owned only one hen, but one day it laid a golden egg.|The ___ had only a small hut, a thin cow and a patch of beans.|villain,reward
    wander|wandered,wanders,wandering|to walk around with no plan of where to go|闲逛，漫无目的地走|Little Red Riding Hood began to ___ off the path to pick flowers.|On sunny days, the goats like to ___ across the hills.|Stay close to me in the forest and do not ___ away.|punish,reward
    reward|rewarded,rewards|something given to thank a person for doing something good|奖赏，为感谢善行而给的东西|The king gave the brave girl a bag of gold as a ___.|As a ___ for finding the lost dog, Sam got a free ice cream.|The kind man asked for no ___ when he helped the old woman.|punish,moral
    punish|punished,punishes|to make someone suffer because they did something wrong|惩罚，因为做错事而让人受苦|The queen said she would ___ anyone who stole from the castle.|In the tale, the gods ___ the greedy man by turning his gold to stone.|Mom did not ___ me for breaking the vase, because I told the truth.|wander,reward
    wicked|-|very bad and cruel|邪恶的，非常坏而且残忍的|The ___ witch locked the children in a tower.|The ___ giant laughed cruelly as he stole the sheep.|The ___ stepmother made Cinderella clean the house all day.|foolish,villain
    foolish|-|silly and not wise|愚蠢的，傻的，不明智的|It was ___ of the crow to open its beak and drop the cheese.|The ___ man built his house on the sand, and the sea washed it away.|Running across the ice on the pond was a ___ thing to do.|wicked,peasant
  `,
  notes: `
    moral|a lesson at the end of a fable|a rule about never telling lies|summarizing a tale's lesson in one sentence|moral is the lesson itself; fable is the whole story|moral 是故事讲的道理；fable 是整篇寓言故事|fable is a whole animal story, not just the lesson at the end|fable 指整篇动物寓言，不只是结尾的道理|folktale is an old traditional story, not a single teaching point|folktale 是流传很久的民间故事，不是单条道理|mor · al|the -al ending (not -le or -el)|结尾是 -al，不是 -le 或 -el
    fable|a short animal story about an ant and a grasshopper teaching a lesson|a talking fox and crow teaching a lesson|a tortoise teaching a lesson to a hare|fable is a short animal story with a lesson; folktale is any old story passed down|fable 常以动物为主角讲道理；folktale 泛指代代相传的古老故事|folktale is passed down over generations and does not have to feature talking animals teaching a lesson|folktale 强调代代口耳相传，不一定是讲道理的动物寓言|moral is only the lesson inside the story, not the story itself|moral 只是故事里的寓意，不是整篇故事|fa · ble|the silent e in -ble|结尾 -ble 里不发音的 e
    folktale|an old story passed down from grandmother to granddaughter|a traditional tale about tricking a giant|an ancient story handed down for hundreds of years|folktale is an old traditional story; fable is a short lesson tale usually about animals|folktale 强调古老传承；fable 专指短小动物寓言|fable is a brief animal lesson story, whereas this highlights an old tale passed down over time|fable 侧重动物寓言，而这里强调世代相传的古老故事|moral is just the lesson taught, not an entire story passed down|moral 只是道理，不是代代流传的故事|folk · tale|the silent l in folk and the silent e in tale|folk 里不发音的 l 和 tale 结尾的 e
    villain|a wolf trying to eat the three little pigs|a bad character caught so the village is safe|a character booed in a black cape|villain is the bad character; peasant is a poor farmer|villain 是坏人反派；peasant 是穷苦农夫|peasant is a poor farm worker, not the evil character in a story|peasant 是种地的穷苦农夫，不是故事里的反派坏人|fable is a kind of story, not a bad character inside a tale|fable 是一种故事体裁，不是故事里的反派人物|vil · lain|double l and the -ain ending|双写 l 和结尾 -ain
    peasant|a poor farmer working the king's fields all day|a poor farmer owning only one hen|a poor villager with a small hut and a thin cow|peasant is a poor farmer; villain is a story's bad character|peasant 是耕作的农夫；villain 是故事里的反派|villain is a cruel bad guy, whereas this person is a poor humble farmer|villain 是作恶的反派，而这里写的是贫苦农夫|reward is a prize given in thanks, not a poor farmer|reward 是奖赏物品，不是贫苦农夫|peas · ant|ea spelling the short e sound, plus -ant|发短 e 音的 ea 以及结尾 -ant
    wander|straying off the forest path to pick flowers|goats roaming freely across sunny hills|drifting away from the group in the forest|wander means walking aimlessly; punish makes someone suffer for wrong|wander 是漫无目的地闲逛；punish 是惩罚错事|punish means making someone pay for a mistake, not strolling around aimlessly|punish 是因错受罚，不是漫无目的地四处走动|reward means giving a prize for good work, not walking around with no plan|reward 是奖赏善行，不是漫无目的地闲逛|wan · der|wa saying /wɑː/ (not wonder with o)|开头是 wa（不是带 o 的 wonder）
    reward|a bag of gold given to thank a brave girl|a free ice cream for returning a lost dog|turning down payment after helping someone|reward thanks good deeds; punish answers wrongdoing|reward 奖赏善行；punish 惩罚错事|punish is what happens for doing wrong, the opposite of thanking a good deed|punish 是对错事的惩罚，与感谢善行相反|moral is a story's lesson, not a gift given to thank someone|moral 是故事道理，不是用来答谢善行的奖赏|re · ward|ar saying /ɔːr/ after w|w 后面的 ar 发 /ɔːr/
    punish|making a thief pay for stealing from the castle|turning a greedy man's gold to stone|deciding not to scold a child who told the truth|punish makes someone pay for wrong; reward thanks good deeds|punish 是因错受罚；reward 是因善得赏|wander means walking around aimlessly, not dealing with wrongdoing|wander 是闲逛，和处置错事无关|reward thanks someone for doing good, the opposite of making them pay for wrongdoing|reward 是嘉奖善行，与惩罚错事正相反|pun · ish|single n (not double n) and -ish|中间是单个 n（不双写），结尾 -ish
    wicked|a cruel witch locking children in a tower|a cruel giant stealing sheep and laughing|a cruel stepmother forcing chores all day|wicked means cruel and evil; foolish means silly and unwise|wicked 是邪恶残忍；foolish 只是愚蠢糊涂|foolish means unwise or silly, not deliberately cruel and evil|foolish 只是傻或不聪明，并不带残忍恶意|villain is a noun naming a bad person, not an adjective describing someone cruel|villain 是指人的名词，不能作形容词修饰邪恶残忍的人|wick · ed|ck in the middle and -ed pronounced /ɪd/|中间的 ck 和读作 /ɪd/ 的 -ed
    foolish|a crow dropping its cheese by opening its beak|building a house on shifting sand|running across thin pond ice|foolish means unwise; wicked means cruel|foolish 是愚蠢不明智；wicked 是邪恶残忍|wicked means cruel and evil, whereas this is just a silly, unwise choice|wicked 指邪恶残忍，而这里只是不明智的糊涂做法|peasant is a noun for a poor farmer, not an adjective for a silly choice|peasant 是表示农夫的名词，不是形容愚蠢行为的形容词|fool · ish|oo for the long /uː/ sound and -ish|发长音 /uː/ 的 oo 和结尾 -ish
  `,
};

const feelings: Grade3Batch = {
  id: "words-for-feelings",
  title: t("Words for Feelings", "表达感受的词"),
  summary: t(
    "Ten words for how characters feel: anxious, furious, relieved, jealous, thrilled and more.",
    "十个描述人物感受的词：anxious、furious、relieved、jealous、thrilled 等。",
  ),
  intro: t(
    "The night before her first swimming test, Lena cannot sleep and keeps staring at the ceiling—she feels **anxious**. Stories rarely stop at *happy* or *sad*; exact feeling words show what a character is really going through.",
    "第一次游泳测验前一天晚上，莉娜翻来覆去睡不着，一直盯着天花板——这就是焦虑（**anxious**）。故事里很少只写开心或难过，用对情绪词，才能把人物的心境写活。",
  ),
  watchOut: {
    meanings: t(
      "Tell **anxious** (worried about what might happen next) apart from **frightened** (scared right now by a danger).",
      "分清 **anxious**（担心还没发生的事）和 **frightened**（眼下被危险吓到）。",
    ),
    use: t(
      "**Relieved** needs a worry or danger that just ended, whereas **delighted** or **thrilled** is pure joy at good news.",
      "**relieved** 一定是先有担心、后来虚惊一场；**delighted** 和 **thrilled** 则是单纯为好消息开心。",
    ),
    spelling: t(
      "Watch the double letters in **embarrassed** (two *r*'s, two *s*'s) and the silent **gh** in **frightened**.",
      "留心 **embarrassed** 的两组双写（两个 *r*、两个 *s*）以及 **frightened** 里不发音的 **gh**。",
    ),
  },
  domain: ["how people and characters feel", "人物的感受"],
  lines: `
    anxious|-|worried about something that might happen|焦虑的，担心可能发生的事|Lena felt ___ the night before her first swimming test.|My dad gets ___ and checks his watch every minute when we might miss the train.|The ___ puppy paced by the door, waiting for its owner to come home.|frightened,furious
    furious|-|very, very angry|狂怒的，非常生气的|The farmer shouted and was ___ when he saw that the goats had eaten his whole garden.|My sister slammed her door and was ___ that I had read her diary.|The ___ bull stamped and snorted at the fence.|anxious,disappointed
    delighted|-|very pleased and happy|高兴的，非常开心的|Grandpa was ___ to see us at his door with a cake.|The children were ___ when the snow day was announced.|I was ___ to find a note from my best friend in my lunch box.|relieved,disappointed
    embarrassed|-|feeling silly or uncomfortable because others saw you make a mistake|难为情的，尴尬的|Tom was ___ when he tripped on the stage in front of the whole school.|I felt ___ after I called my teacher "Mom" by mistake.|She turned red and looked ___ when her phone rang during the quiet test.|disappointed,anxious
    jealous|-|unhappy because someone else has something you want|嫉妒的，因别人有自己想要的东西而不快|Max was ___ of his friend's new bike.|The older cat seemed ___ when we brought home a kitten.|Try not to be ___ when your friend wins a prize.|disappointed,furious
    relieved|-|happy because something bad did not happen or is over|松了口气的，因坏事没发生或结束而安心|After hours of worrying, we breathed out and felt ___ when the lost kitten came home safe.|Lucy felt ___ when the doctor said her arm was not broken.|After the scary storm passed, everyone was ___.|delighted,anxious
    disappointed|-|sad because something was not as good as you hoped|失望的，因事情不如预期而难过|Ben had looked forward to the picnic all week and felt ___ when rain cancelled it.|I was ___ that the movie was not as funny as the first one.|The team was ___ to lose the final game by one point.|miserable,embarrassed
    frightened|-|feeling afraid|害怕的，受惊的|The ___ rabbit ran into its hole when it saw the fox.|Mia was ___ by the loud thunder in the night.|The little boy jumped and looked ___ when the big dog barked right beside him.|anxious,miserable
    thrilled|-|very excited and happy|非常兴奋的，激动的|Ana cheered and was ___ to ride the roller coaster for the first time.|The class was ___ to hear that we would visit the zoo.|He was ___ when he opened the box and found a puppy inside.|relieved,frightened
    miserable|-|very unhappy|痛苦的，非常不开心的|The wet and cold dog looked ___ outside in the rain.|I felt ___ as I shivered in bed with a high fever and a pounding headache.|The ___ prince sat alone in his tower and cried.|disappointed,frightened
  `,
  notes: `
    anxious|feeling uneasy the night before a first swimming test|checking a watch every minute in worry about missing a train|a puppy pacing by the door waiting for its owner|anxious is uneasy worry about what may happen; frightened is sudden fear of danger|anxious 是对未知的担忧焦虑；frightened 是眼前受惊害怕|frightened means being scared by an immediate danger, not uneasy waiting or worrying|frightened 是被眼前危险吓到，不是忐忑等待或担忧|furious means bursting with anger, not quiet worry|furious 是怒火中烧，不是焦虑担心|anx · ious|x and the -ious ending|中间的 x 和结尾 -ious
    furious|a farmer shouting in rage over goats eating his garden|a sister slamming her door in anger over her diary|a bull stamping and snorting at a fence|furious is explosive anger; disappointed is quiet sadness|furious 是勃然大怒；disappointed 只是低落失望|anxious means feeling worried about what might happen, not raging mad|anxious 是忐忑担忧，不是暴怒|disappointed means feeling mildly let down, far weaker than boiling anger|disappointed 只是觉得扫兴，远不如狂怒激烈|fu · ri · ous|single r and the -ious ending|单个 r 和结尾 -ious
    delighted|Grandpa happily greeting family arriving with cake|children cheering a surprise snow day|finding a kind note from a best friend|delighted is warm joy at good news; relieved is calm after a scare ends|delighted 是纯粹的欣喜；relieved 是担忧解除后的安心|relieved requires a worry or danger that just passed, not pure happy news|relieved 需要先有担忧再化险为夷，不是单纯的好消息|disappointed means feeling sad when hopes fall short, the opposite of joy|disappointed 是希望落空，与喜悦相反|de · light · ed|the silent gh in light|light 里不发音的 gh
    embarrassed|tripping on stage in front of the whole school|calling a teacher "Mom" by mistake|blushing when a phone rings during a quiet test|embarrassed comes from a public slip; disappointed comes from a letdown|embarrassed 是当众出糗的尴尬；disappointed 是期望落空的失望|disappointed means sad that something fell short, not feeling silly after a mistake in front of others|disappointed 是期待落空，不是当众出错后的难为情|anxious means worrying ahead of time, whereas the awkward slip has already happened|anxious 是事前担心，而尴尬的失误已经当众发生了|em · bar · rassed|double r and double s|双写 r 和双写 s
    jealous|envying a friend's brand-new bike|an older cat resenting a new kitten|feeling bitter when a friend wins a prize|jealous wants what someone else has; furious is explosive anger|jealous 是眼红别人拥有的东西；furious 是狂怒|disappointed means sad over a letdown, not wanting something another person has|disappointed 是自己失望，不涉及眼红别人拥有的东西|furious means raging mad, whereas this is envy over what another has|furious 是发大火，而这里是嫉妒别人拥有好东西|jeal · ous|ea saying short e and -ous|发短 e 音的 ea 和结尾 -ous
    relieved|breathing out in relief when a lost kitten comes home safe|hearing a doctor say an arm is not broken|relaxing once a scary storm finally passes|relieved means worry has just ended; delighted is pure joy at a treat|relieved 是虚惊一场后的安心；delighted 是遇到好事的欣喜|delighted is cheerful excitement over a treat, not exhaling after a scare ends|delighted 是为惊喜开心，不是坏事过去后的松一口气|anxious means still worrying, whereas the danger here is already over|anxious 是仍在担心，而这里危险已经解除了|re · lieved|ie spelling the long e sound|发长 e 音的 ie
    disappointed|feeling let down when rain cancels a long-awaited picnic|a sequel not being as funny as hoped|losing a championship game by one point|disappointed is sadness when hopes fall short; miserable is deep all-over misery|disappointed 是不如预期扫兴；miserable 是极度煎熬痛苦|miserable means deeply suffering in body or spirit, stronger than a letdown|miserable 程度重得多，指极度痛苦难熬|embarrassed means feeling silly over a mistake, not sad that something fell short of your hopes|embarrassed 是出糗难为情，不是事情不如预期时的失落|dis · ap · point · ed|single s and double p (dis + ap + point)|单个 s、双写 p（dis + ap + point）
    frightened|a rabbit diving into its hole from a fox|startling at loud thunder in the night|a little boy jumping when a big dog barks right beside him|frightened means scared right now; anxious means uneasy about what might come|frightened 是当下受惊害怕；anxious 是对未发生的事担忧|anxious is lingering worry about the future, not sudden terror|anxious 是慢慢悬着心，不是突如其来的害怕|miserable means deeply unhappy, not specifically scared of danger|miserable 是难过痛苦，不是因为危险而受惊|fright · ened|the silent gh in fright|fright 里不发音的 gh
    thrilled|cheering to ride a roller coaster for the very first time|hearing news of a class zoo trip|opening a gift box to find a puppy|thrilled is bursting excitement; relieved is exhaling after a worry|thrilled 是兴奋雀跃；relieved 是松了口气|relieved means feeling better after a scare ends, not excited anticipation|relieved 是坏事没发生后的安心，不是激动兴奋|frightened means feeling scared, the opposite of joyful excitement|frightened 是感到害怕，和兴奋激动相反|thrilled|thr blend at the start and double l|开头的 thr 连缀和双写 l
    miserable|a cold, wet dog stuck outside in the rain|shivering in bed with a high fever and pounding headache|a lonely prince crying in a tower|miserable means deeply unhappy; disappointed means mildly let down|miserable 是十分痛苦煎熬；disappointed 只是失望扫兴|disappointed is a brief letdown over expectations, not deep suffering|disappointed 只是愿望落空，不如痛苦煎熬沉重|frightened means feeling afraid of danger, not deeply unhappy and suffering|frightened 是感到恐惧，不是难受痛苦或孤单煎熬|mis · er · a · ble|s sounding like /z/ and -able|读作 /z/ 的 s 和结尾 -able
  `,
};

const farms: Grade3Batch = {
  id: "words-of-farms-and-gardens",
  title: t("Words of Farms and Gardens", "农场与花园的词汇"),
  summary: t(
    "Ten words of growing food: harvest, crop, compost, orchard, greenhouse, prune and more.",
    "十个种植食物的词：harvest、crop、compost、orchard、greenhouse、prune 等。",
  ),
  intro: t(
    "Snow covers the yard outside, yet bright red tomatoes are still ripening behind warm glass walls—that building is a **greenhouse**. Growing food has its own exact names for places, tools, and seasonal jobs.",
    "院子外头还落着雪，暖融融的玻璃墙里却挂满了红番茄——这座建筑就是温室（**greenhouse**）。从翻土播种到修剪采收，农园里的地方、工具和农活都有各自的专词。",
  ),
  watchOut: {
    meanings: t(
      "Do not confuse **orchard** (an open field of fruit trees) with **greenhouse** (a glass building that keeps plants warm).",
      "别把 **orchard**（露天果园）和 **greenhouse**（玻璃温室）混在一起。",
    ),
    use: t(
      "Keep the three farm actions in order: **plow** turns the soil, **sow** drops the seeds, and **prune** trims branches later.",
      "记住三件农活的顺序：**plow** 是先翻土，**sow** 是再播种，**prune** 是长起来后再修枝。",
    ),
    spelling: t(
      "Watch **orchard** (*ch* + *-ard*, not *-erd*) and **trowel** (*ow* + *-el*, not *-le*).",
      "注意 **orchard** 的 **ch** 和 **-ard**，以及 **trowel** 里的 **ow** 和结尾 **-el**。",
    ),
  },
  domain: ["farms and gardens", "农场和花园"],
  lines: `
    harvest|harvested,harvests|the time when crops are picked or gathered|收获，采收庄稼的时节|In the fall, the whole family helps with the apple ___.|Everyone was tired after the long days of the ___ in October.|After the ___, the fields were empty and brown.|crop,orchard
    crop|crops|a plant that is grown in large amounts for food|庄稼，大量种植以作食物的植物|Rice is the main ___ in many wet, warm places.|The farmer planted one ___ of beans and one of wheat.|A hailstorm ruined the whole ___ of strawberries.|harvest,orchard
    compost|-|old plants and food scraps that rot and make the soil rich|堆肥，腐烂后能使土壤肥沃的残叶和厨余|We put banana peels and eggshells in the ___ pile.|Dig some ___ into the soil before you plant the seeds.|Worms help turn old leaves into dark, crumbly ___.|mulch,crop
    orchard|orchards|a field of fruit trees|果园|The ___ had a hundred old apple trees growing in the open field.|In spring, the cherry trees of the ___ covered the hillside in pink.|Rows of apple trees grew in the old ___ on the hill.|greenhouse,crop
    greenhouse|greenhouses|a building made of glass where plants grow in warm air|温室|Tomatoes grow in the ___ even when it is cold outside.|The glass walls of the ___ let in sunlight and keep in heat.|In winter, Grandma moves her flower pots into the ___.|orchard,compost
    mulch|-|a layer of straw, bark or leaves spread on soil to keep it damp|覆盖物，铺在土上保湿的稻草、树皮或树叶|Spread ___ around the plants so the soil does not dry out.|We used chopped bark as ___ in the flower beds.|A thick layer of ___ stops weeds from growing.|compost,crop
    trowel|trowels|a small hand tool for digging holes in a garden|小铲子，园艺用的手铲|I used a ___ to dig a hole for each bulb.|Mom handed me a ___ and a bag of seeds.|The handle of my ___ broke when I hit a big rock.|plow,mulch
    prune|pruned,prunes,pruning|to cut off parts of a plant to help it grow better|修剪，剪掉植物的部分让它长得更好|In winter, we ___ the rose bushes so they grow strong in spring.|The gardener will ___ the dead branches from the tree.|If you ___ the tomato plant, it will make bigger tomatoes.|sow,plow
    plow|plowed,plows|to turn over the soil before planting|犁地，播种前翻土|Long ago, farmers used horses to ___ their fields.|They ___ the field every spring before planting corn.|A tractor can ___ a big field in one day.|sow,prune
    sow|sowed,sows|to plant seeds in the ground|播种|In spring, we ___ carrot seeds in neat rows.|Farmers ___ wheat in the fall so it can sprout before winter.|Be sure to ___ the seeds thinly so each plant has room to grow.|plow,prune
  `,
  notes: `
    harvest|picking apples together in the fall|long October days gathering crops|fields left empty and brown after picking|harvest is the gathering season; crop is the food plant itself|harvest 是采收时节；crop 是种出来的庄稼|crop names the plant grown for food, not the autumn picking season|crop 指种植的粮食植物，不是秋季采收的时节|orchard names a field of fruit trees, not the time of gathering|orchard 是种果树的果园，不是收割时节|har · vest|ar in the first part and -est at the end|前段 ar 和结尾 -est
    crop|rice grown across wet, warm farms|fields planted with beans and wheat|strawberries ruined by a hailstorm|crop is the food plant grown; harvest is the picking season|crop 指成片种植的作物；harvest 指采收季节|harvest is the time of picking, not the plant growing in the field|harvest 是收获季，不是田里种的植物本身|orchard is a whole grove of fruit trees, not a single food plant grown in a field|orchard 专指果树园，不是成片种植的单种庄稼|crop|cr blend at the start and short o|开头的 cr 连缀和短音 o
    compost|banana peels and eggshells rotting in a pile|rich decayed matter dug into soil|worms turning old leaves into dark crumbly soil|compost rots to enrich soil; mulch sits on top to hold moisture|compost 腐烂肥土；mulch 铺在土表保湿防草|mulch is a dry layer spread on top of soil, not rotted organic matter mixed in to enrich it|mulch 是铺在土面的干燥覆盖层，不是腐烂肥土的有机肥|crop is a living food plant, not rotted scraps mixed into soil|crop 是生长的庄稼，不是拌进土里的腐肥|com · post|com + post with a single m|com 加 post，中间单个 m
    orchard|a hundred old apple trees in an open field|cherry trees blooming across a hillside|neat rows of apple trees on a hill|orchard is an open field of fruit trees; greenhouse is a glass building|orchard 是露天果园；greenhouse 是玻璃温室|greenhouse is an indoor glass building, not an open field of fruit trees|greenhouse 是室内玻璃暖房，不是露天成片的果树园|crop names a field plant like wheat or rice, not a grove of fruit trees|crop 指麦子水稻等作物，不是成片果树园|or · chard|ch in the middle and -ard at the end|中间的 ch 和结尾 -ard
    greenhouse|tomatoes growing warm while it is cold outside|glass walls letting in sun and trapping heat|moving flower pots indoors for winter|greenhouse is a warm glass building; orchard is outdoor fruit trees|greenhouse 靠玻璃保暖；orchard 是露天果园|orchard is outdoors in the open air, with no glass walls to trap heat|orchard 在露天野外，没有玻璃墙保暖|compost is decayed plant scraps for soil, not a warm glass building for growing plants|compost 是肥土的堆肥，不是用来保温种植物的玻璃房|green · house|compound green + house with ee and ou|合成词 green + house，注意 ee 和 ou
    mulch|a damp-keeping layer spread around plants|chopped bark spread over flower beds|a thick cover blocking weeds from sprouting|mulch covers soil to hold water; compost mixes in as rotted scraps|mulch 铺在土面保湿；compost 是腐熟堆肥|compost is rotted matter dug into soil, not a surface layer spread on top to keep soil damp|compost 是翻进土里的腐熟堆肥，不是铺在土表保湿防草的覆盖物|crop is a food plant grown to eat, not a protective soil cover|crop 是供食用的庄稼，不是铺地保湿的覆盖物|mulch|short u followed by lch|短音 u 加 lch
    trowel|digging small holes for garden bulbs|a small hand tool paired with a bag of seeds|a garden hand tool whose handle hit a rock|trowel is a small hand tool; plow turns whole fields|trowel 是手持小铲；plow 用于大田翻土|plow is a verb for turning a whole farm field, not a small hand tool for digging garden holes|plow 是给大田犁地的动作，不是挖花坑用的小手铲|mulch is bark or straw spread on soil, not a digging tool|mulch 是铺地覆盖物，不是挖坑的工具|trow · el|ow saying /aʊ/ and -el ending|发 /aʊ/ 音的 ow 和结尾 -el
    prune|trimming rose bushes in winter for spring growth|cutting dead branches off a tree|trimming tomato stems for bigger fruit|prune trims a growing plant; sow plants seeds|prune 是修剪枝叶；sow 是播种|sow puts seeds into soil, not cutting branches off a growing plant|sow 是把种子播进土里，不是剪枝|plow turns over field soil, not trimming branches or stems|plow 是翻松大田泥土，不是修剪枝叶|prune|pr blend and silent e making long u|pr 连缀和让 u 读长音的词尾 e
    plow|horses turning over farm fields long ago|turning the soil every spring before planting|a tractor turning a whole big field in one day|plow turns soil before planting; sow drops seeds into it|plow 是播前翻土；sow 是播下种子|sow means planting seeds into soil, not turning over the earth beforehand|sow 是播撒种子，不是播种前把田土翻松|prune trims branches off plants, not turning over a whole field|prune 是修剪枝条，不是翻耕整片田地|plow|pl blend and ow saying /aʊ/|pl 连缀和发 /aʊ/ 音的 ow
    sow|planting carrot seeds in neat rows|planting wheat in fall to sprout before winter|scattering seeds thinly so each plant has room|sow puts seeds in soil; plow turns the soil first|sow 是播下种子；plow 是先翻松土地|plow turns over soil before planting, rather than putting seeds into the ground|plow 只是翻松泥土，不是把种子播进地里|prune cuts off branches of grown plants, not planting seeds|prune 是剪枝，不是播种|sow|ow saying long /oʊ/ (rhymes with grow)|发长音 /oʊ/ 的 ow（与 grow 押韵）
  `,
};

const growth: Grade3Batch = {
  id: "words-for-growth-and-change",
  title: t("Words for Growth and Change", "表达生长与变化的词"),
  summary: t(
    "Ten words for how living things grow and change: develop, expand, shrink, flourish, decay and more.",
    "十个描述生物生长与变化的词：develop、expand、shrink、flourish、decay 等。",
  ),
  intro: t(
    "Leave a puddle in the hot sun and by afternoon it is half as wide—it begins to **shrink**. Science and stories need exact verbs to tell whether something is growing bigger, changing shape, or breaking down.",
    "烈日下的水洼到了下午就小了一半——它开始收缩（**shrink**）。无论是写科学观察还是讲故事，都需要精准的动词来区分变大、变小、蜕变还是腐烂。",
  ),
  watchOut: {
    meanings: t(
      "Watch **increase** (more in number) versus **expand** (spreading out wider in size, like a balloon or a park).",
      "分清 **increase**（数量变多）和 **expand**（体积或面积向外胀大，如气球或公园）。",
    ),
    use: t(
      "Tell **flourish** (grow healthy and strong) apart from **decay** (rot and break down)—check whether the plant or log is thriving or rotting.",
      "**flourish** 是长得茂盛，**decay** 是慢慢腐烂——看句中的植物或木头是在变旺还是在烂掉。",
    ),
    spelling: t(
      "Watch **flourish** (*ou* says short *u*, not *ow*) and **develop** (no final *e*).",
      "注意 **flourish** 里读短 *u* 的 **ou**，以及 **develop** 结尾没有 **e**。",
    ),
  },
  domain: ["how things grow and change", "事物的生长和变化"],
  lines: `
    develop|developed,develops|to grow and change slowly into something more complete|发育，逐渐成长变化|A tadpole will ___ into a frog in about three months.|Flower buds ___ on the plant before they open.|With practice, your reading skills will ___.|decay,shrink
    increase|increased,increases|to become bigger in number or amount|增加|If we put out more seeds, the number of birds at the feeder will ___.|If you water the plant more, its growth may ___.|As more people move to our town, the number of cars will ___.|decrease,expand
    decrease|decreased,decreases|to become smaller in number or amount|减少|The amount of water in the pond will ___ during the dry summer.|When the days get shorter, the number of flowers begins to ___.|Turning off lights helps ___ the amount of power we use.|increase,shrink
    expand|expanded,expands|to get bigger by spreading out|扩大，膨胀，向外伸展|A balloon will ___ as you blow air into it.|The town plans to ___ the park to make room for a pond.|Seeds ___ when they soak up water.|shrink,increase
    shrink|shrinks|to become smaller|缩小，变小|Wool sweaters can ___ in hot water.|Puddles ___ in the sun until they are gone.|A grape will ___ into a raisin as it dries.|expand,flourish
    transform|transformed,transforms|to change completely into something different|使彻底改变，转变|Inside its cocoon, a crawling caterpillar will completely ___ into a winged butterfly.|The class wanted to ___ the empty lot into a garden.|Heat can ___ hard corn kernels into fluffy popcorn.|mature,shrink
    mature|-|to become fully grown|成熟，长成|It takes about ten years for an apple tree to ___ and give fruit.|Kittens ___ into adult cats in about a year.|The pumpkins need all summer to ___ on the vine.|emerge,shrink
    flourish|flourished,flourishes|to grow strong and healthy|茂盛，繁荣，长得旺盛|Ferns ___ in shady, damp places.|With sun and rain, the garden began to ___.|Plants will not ___ in poor, dry soil.|decay,shrink
    decay|decayed,decays|to slowly rot and break apart|腐烂，慢慢分解|Fallen leaves ___ and turn into soil.|Sugar can make your teeth ___ if you do not brush them.|The old log had started to ___, and mushrooms grew on it.|flourish,mature
    emerge|emerged,emerges|to come out from inside or from behind something|出现，冒出|Every spring, green shoots ___ from the ground.|We watched the chick ___ from its egg.|The bear will ___ from its den when winter is over.|develop,transform
  `,
  notes: `
    develop|a tadpole growing step by step into a frog|flower buds forming before they open|reading skills getting stronger with practice|develop means growing gradually; decay means rotting away|develop 是逐步发育成长；decay 是腐烂分解|decay means rotting and breaking down, the opposite of growing stronger|decay 是腐烂分解，和逐渐成长正好相反|shrink means getting smaller, not growing into something more complete|shrink 是变小萎缩，不是发育完善|de · vel · op|single l and no silent e at the end|单个 l，结尾没有 e
    increase|more birds coming when more seeds are put out|faster growth when a plant gets more water|more cars appearing as more people move in|increase means more in number; expand means stretching wider in size|increase 是数量增多；expand 是体积面积向外胀大|decrease means dropping in number, the exact opposite of going up|decrease 是数量减少，和增加正好相反|expand means stretching wider in physical size, not simply rising in count|expand 强调空间胀大，不是单纯数量增加|in · crease|ea spelling long e plus silent e after s|发长 e 音的 ea 和 s 后面的 e
    decrease|the amount of pond water dropping during a dry summer|fewer flowers blooming as days grow shorter|using less power by turning off lights|decrease means dropping in amount; increase means rising|decrease 是数量减少；increase 是数量增加|increase means growing larger in amount, the opposite of dropping|increase 是增加，与减少相反|shrink means a single object getting smaller in size, not an amount going down|shrink 多指单个物体缩水变小，不如 decrease 适合表达数量降低|de · crease|de- prefix plus -crease with ea|前缀 de- 加含 ea 的 -crease
    expand|a balloon stretching wider as air fills it|making a park larger to add a pond|seeds swelling up as they soak in water|expand spreads wider in size; shrink gets smaller|expand 是向外胀大；shrink 是缩小|shrink means getting smaller, the exact opposite of swelling or widening|shrink 是缩小，与膨胀扩大相反|increase is about a count going up, not an object or space stretching outward|increase 侧重数量上升，不如 expand 准确描述向外撑大|ex · pand|ex- prefix plus -pand|前缀 ex- 加 -pand
    shrink|wool sweaters getting smaller in hot water|puddles drying smaller under the sun|a grape drying down into a small raisin|shrink gets smaller; expand gets bigger|shrink 是变小缩水；expand 是扩大膨胀|expand means stretching bigger, the opposite of getting smaller|expand 是胀大变宽，与缩小相反|flourish means thriving and growing healthy, not shriveling up|flourish 是茁壮生长，不是变小萎缩|shrink|shr three-letter blend at the start|开头的三字母连缀 shr
    transform|a crawling caterpillar changing completely into a winged butterfly|turning an empty lot into a whole garden|heat turning hard kernels into fluffy popcorn|transform changes something completely; mature finishes normal growth|transform 是彻底转变形态；mature 是长成成熟|mature means simply reaching adult age, not turning into something totally different|mature 只是长成熟，不是脱胎换骨变成别的东西|shrink means getting smaller in size, not changing completely into something new|shrink 只是体积变小，不是彻底变成全新的事物|trans · form|trans- prefix plus form|前缀 trans- 加 form
    mature|an apple tree reaching ten years to bear fruit|kittens growing all the way into adult cats|pumpkins ripening all summer on the vine|mature means becoming full-grown; emerge means coming out|mature 是生长成熟；emerge 是钻出冒出|emerge means coming out of a hiding place, not finishing full growth|emerge 是从里面冒出来，不是长成成年或成熟|shrink means getting smaller instead of growing to full size|shrink 是变小，与长成成熟相反|ma · ture|-ture ending with silent e|结尾 -ture 带不发音的 e
    flourish|ferns growing lush in shady damp spots|a garden thriving with sun and rain|plants failing to thrive in dry poor soil|flourish means thriving; decay means rotting|flourish 是茁壮茂盛；decay 是腐烂|decay means rotting apart, the opposite of growing healthy and strong|decay 是腐烂，与茂盛生长相反|shrink means getting smaller, not growing lush and strong|shrink 是缩小，不是长得旺盛|flour · ish|ou saying short u (not /aʊ/)|发短 u 音的 ou（不读 /aʊ/）
    decay|fallen leaves rotting into soil|sugar making unbrushed teeth rot|an old log rotting with mushrooms on it|decay means rotting apart; flourish means growing strong|decay 是腐烂分解；flourish 是长势旺盛|flourish means growing healthy and lush, the opposite of rotting|flourish 是长势旺盛，与腐烂相反|mature means reaching full growth, not breaking down and rotting|mature 是发育成熟，不是烂掉分解|de · cay|ay spelling the long a sound at the end|结尾发长 a 音的 ay
    emerge|green shoots poking up from the ground in spring|a baby chick coming out of its egg|a bear stepping out of its winter den|emerge means coming out into view; transform means changing form|emerge 是从里面冒出来；transform 是变成另一种东西|develop means growing slowly over time, not stepping out into view|develop 是慢慢发育，不是从里面钻出来|transform means changing completely in shape, not coming out from inside|transform 是彻底变形，不是从里面或后面冒出来|e · merge|g sounding like /dʒ/ before silent e|在结尾 e 前读 /dʒ/ 的 g
  `,
};

const animalBodies: Grade3Batch = {
  id: "words-of-animal-bodies",
  title: t("Words of Animal Bodies", "动物身体部位的词汇"),
  summary: t(
    "Ten words for the parts of animals' bodies: beak, claw, gill, hoof, talon, tusk and more.",
    "十个动物身体部位的词：beak、claw、gill、hoof、talon、tusk 等。",
  ),
  intro: t(
    "An eagle swoops over the lake and snatches a fish with one curved **talon**. Knowing the exact names for animal body parts—from a horse's **hoof** to a fish's **gill**—helps you read nature books with precision.",
    "老鹰掠过湖面，伸出一只弯弯的利爪（**talon**）一把抓住湖里的鱼。从马蹄（**hoof**）到鱼鳃（**gill**），记住这些精确的身体部位名称，读自然科普书会清楚得多。",
  ),
  watchOut: {
    meanings: t(
      "Tell **fin** (for steering and swimming) apart from **gill** (for breathing oxygen under water).",
      "分清鱼的 **fin**（用来游泳转向的鳍）和 **gill**（用来在水中呼吸的鳃）。",
    ),
    use: t(
      "A **claw** belongs to cats, bears, or crabs, while a **talon** is specifically the sharp claw of a hunting bird like an eagle or owl.",
      "**claw** 可指猫、熊、螃蟹的爪子，而 **talon** 专指鹰、猫头鹰等猛禽的利爪。",
    ),
    spelling: t(
      "Watch **beak** (*ea* for long *e*), **snout** (*ou* for /aʊ/), and **gill** (double *l*).",
      "留心 **beak** 里的 **ea**、**snout** 里的 **ou**，以及 **gill** 结尾的双写 **l**。",
    ),
  },
  domain: ["the bodies of animals", "动物的身体"],
  lines: `
    beak|beaks|the hard, pointed mouth of a bird|鸟喙|The woodpecker taps the tree with its strong ___.|A parrot can crack nuts with its curved ___.|The pelican scooped up a fish in its long ___.|snout,talon
    claw|claws|a sharp, curved nail on an animal's foot|爪子|The cat scratched the sofa with its ___.|A crab grabbed my finger with its ___.|The bear used one ___ to dig ants out of the log.|talon,hoof
    fin|fins|a thin, flat part that helps a fish swim and steer|鳍|The shark's ___ stuck up out of the water.|A fish moves its tail ___ from side to side to swim.|The goldfish waved a tiny ___ as it turned.|gill,claw
    gill|gills|the part of a fish's body that takes oxygen from water|鳃|A fish breathes through the ___ on each side of its head.|Tadpoles have a ___ on each side, but frogs breathe with lungs.|Water passes over each ___ as the fish opens its mouth.|fin,beak
    hoof|hooves|the hard covering on the foot of a horse, cow or deer|蹄|The horse lifted one ___ so the farmer could clean it.|We heard the clip-clop of a ___ on the stony road.|A goat's split ___ helps it climb steep rocks.|claw,talon
    talon|talons|a long, sharp claw of a bird that hunts|（猛禽的）利爪|The eagle grabbed the fish with one ___.|An owl's ___ is sharp enough to hold a running mouse.|The hawk gripped the branch with each curved ___.|claw,beak
    antler|antlers|a branched horn on the head of a deer or moose|鹿角|Each ___ of the moose was as wide as a table.|A male deer loses each ___ in winter and grows a new one in spring.|We found a shed, branched ___ lying on the forest floor.|tusk,hoof
    tusk|tusks|a very long tooth that sticks out of an animal's mouth|长牙，象牙|An elephant uses its ___ to dig for water.|The walrus pulled itself onto the ice with one ___.|A wild boar has a sharp ___ on each side of its snout.|fang,antler
    snout|snouts|the long nose and mouth of an animal|（动物的）口鼻部|The pig dug in the mud with its ___.|An anteater pushes its long ___ into ant nests.|The crocodile's ___ was full of sharp teeth.|beak,fang
    fang|fangs|a long, sharp tooth that bites|尖牙，毒牙|The snake has a hollow ___ that holds venom.|The wolf showed a white ___ when it growled.|A spider bites with a tiny ___.|tusk,talon
  `,
  notes: `
    beak|a woodpecker tapping a tree with its hard bill|a parrot cracking nuts with its curved bill|a pelican scooping a fish in its long bill|beak is a bird's hard bill; snout is a mammal or reptile's nose and mouth|beak 是鸟的硬喙；snout 是哺乳动物或爬行动物的口鼻部|snout belongs to mammals or reptiles, not a bird's hard mouth|snout 属于兽类或爬行动物，不是鸟的硬嘴|talon is a hunting bird's foot claw, not its mouth|talon 是猛禽脚上的利爪，不是鸟嘴|beak|ea spelling long e before k|k 前发长 e 音的 ea
    claw|a cat scratching a sofa|a crab grabbing a finger|a bear digging ants out of a log|claw belongs to cats, bears, or crabs; talon is only for hunting birds|claw 指猫、熊、螃蟹的爪子；talon 专指猛禽利爪|talon is only on hunting birds like eagles, not other clawed animals|talon 专指鹰等猛禽的爪，不用于普通带爪动物|hoof is a blunt hard foot on horses or deer, not a sharp curved nail|hoof 是马羊的硬蹄，不是尖锐弯曲的爪子|claw|cl blend and aw saying /ɔː/|cl 连缀和发 /ɔː/ 音的 aw
    fin|a shark's flat blade sticking out of the water|a fish's tail steering side to side|a goldfish waving a flat part to turn|fin steers and pushes in water; gill breathes oxygen|fin 管游泳转向；gill 管水中呼吸|gill is for breathing oxygen under water, not a flat part that helps a fish swim and steer|gill 是水中呼吸用的鳃，不是帮助游动转向的鳍|claw is a sharp foot nail on land animals or crabs, not on fish|claw 是脚上的尖爪，鱼身上没有爪子|fin|short i with a single n|短音 i 配单个 n
    gill|a fish breathing through each side of its head|tadpoles breathing under water before growing lungs|water flowing over a breathing organ|gill takes oxygen from water; fin helps the fish swim|gill 用来呼吸；fin 用来游动|fin helps a fish swim and steer, not breathe oxygen|fin 管游泳平衡，不管呼吸|beak is a bird's hard mouth, not a fish's breathing organ|beak 是鸟喙，不是鱼的呼吸器官|gill|hard g (/ɡ/) and double l|发硬音 /ɡ/ 的 g 和双写 l
    hoof|a horse lifting its hard foot to be cleaned|the clip-clop sound on a stony road|a goat's split foot climbing steep rocks|hoof is a hard foot covering; claw is a curved nail|hoof 是硬蹄；claw 是尖爪|claw is a sharp curved nail, not the hard blunt foot covering of a hoofed animal|claw 是尖弯的爪子，不是蹄类动物脚上的硬蹄|talon is a curved claw on a hunting bird, not a hoofed mammal's foot|talon 是猛禽的利爪，不是蹄类动物的硬蹄|hoof|oo saying /ʊ/ (plural changes f to ves)|发 /ʊ/ 音的 oo（复数改 f 为 ves）
    talon|an eagle grabbing a fish with its foot|an owl holding a running mouse|a hawk gripping a branch with its curved claw|talon is a hunting bird's sharp claw; claw is more general|talon 专指猛禽利爪；claw 泛指一般动物爪子|claw is the general word, whereas hunting birds specifically have talons|claw 泛指普通爪子，而猛禽的利爪专称 talon|beak is a bird's hard mouth, not the long sharp claw on its foot|beak 是鸟嘴，不是猛禽脚上的弯曲利爪|tal · on|single l and -on ending|中间单个 l，结尾 -on
    antler|a moose's wide branched head horn|a male deer shedding and regrowing its horn|a shed branched horn found on the forest floor|antler grows on a deer's head; tusk sticks out of a mouth|antler 长在鹿头上；tusk 是嘴里伸出的长牙|tusk is a long tooth sticking out of a mouth, not a branched head horn|tusk 是嘴里伸出的长牙，不是头顶分叉的角|hoof is on a deer's foot, not a branched horn on its head|hoof 长在脚底，不是头顶分叉的鹿角|ant · ler|ant + ler with -er ending|ant 加 ler，结尾是 -er
    tusk|an elephant digging for water with its long outer tooth|a walrus pulling itself onto ice with a long tooth|a wild boar's long tooth sticking beside its snout|tusk sticks out of the mouth; fang is a sharp biting tooth inside|tusk 是伸出嘴外的长牙；fang 是咬猎物的尖牙毒牙|fang is a sharp biting tooth inside the mouth, not a very long outer tooth sticking out|fang 是藏在嘴里咬猎物的尖牙，不是伸出嘴外的长牙|antler grows on top of a deer's head, not out of an animal's mouth|antler 长在鹿头上，不是从嘴里长出来的|tusk|short u and sk blend at the end|短音 u 和结尾的 sk 连缀
    snout|a pig digging in the mud with its nose|an anteater pushing its long nose into ant nests|a crocodile's long jaw full of teeth|snout is a long nose-and-mouth; beak is a bird's hard bill|snout 是动物的口鼻部；beak 是鸟喙|beak is the hard pointed mouth of a bird, not a mammal or reptile's long nose and mouth|beak 是鸟的硬喙，不是哺乳动物或爬行动物的长口鼻部|fang is a single sharp tooth, not the whole nose and mouth|fang 只是一颗尖牙，不是整个口鼻部|snout|sn blend and ou saying /aʊ/|sn 连缀和发 /aʊ/ 音的 ou
    fang|a snake's hollow tooth holding venom|a wolf baring a sharp white tooth|a spider biting with a tiny sharp tooth|fang is a biting tooth; tusk is a huge outer tooth like an elephant's|fang 是咬猎物的尖牙毒牙；tusk 是象、海象伸出的长牙|tusk is a huge outer tooth sticking out of the mouth, not a sharp biting tooth inside the jaw|tusk 是伸出嘴外的大长牙，不是用来咬猎物的尖牙或毒牙|talon is a bird's sharp foot claw, not a biting tooth|talon 是猛禽的脚爪，不是嘴里的牙齿|fang|ng spelling the /ŋ/ sound|结尾发 /ŋ/ 音的 ng
  `,
};

const animalGroups: Grade3Batch = {
  id: "words-of-animal-groups-and-homes",
  title: t("Words of Animal Groups and Homes", "动物群体与居所的词汇"),
  summary: t(
    "Ten words for groups of animals and the places they live: herd, flock, swarm, hive, den, lair and more.",
    "十个动物群体和居所的词：herd、flock、swarm、hive、den、lair 等。",
  ),
  intro: t(
    "Geese fly south in a V-shaped **flock**, while dolphins leap beside a boat in a **pod**. English uses different group names and home names for different kinds of animals.",
    "大雁排成人字形南飞叫一群 **flock**，海豚贴着小船跳跃则叫一群 **pod**。英语里，不同动物的群体和住处都有各自专门的叫法。",
  ),
  watchOut: {
    meanings: t(
      "Keep the group words sorted by animal: **herd** for cows/elephants, **flock** for birds/sheep, **swarm** for insects, **pod** for whales/dolphins, and **troop** for monkeys.",
      "按动物分清群体词：**herd**（牛象兽群）、**flock**（鸟羊群）、**swarm**（虫群）、**pod**（鲸豚群）、**troop**（猴群）。",
    ),
    use: t(
      "Do not mix up **hive** (bees' home), **den** (fox or bear home), and **roost** (where birds or bats rest).",
      "别把 **hive**（蜂巢）、**den**（狐狸或熊的洞穴）和 **roost**（鸟或蝙蝠的栖息处）混用。",
    ),
    spelling: t(
      "Watch **lair** (*air* inside), **swarm** (*ar* says /ɔːr/ after *w*), and **troop** (double *o*).",
      "注意 **lair** 里的 **air**、**swarm** 里跟在 *w* 后读 /ɔːr/ 的 **ar**，以及 **troop** 的双写 **o**。",
    ),
  },
  domain: ["groups of animals and their homes", "动物的群体和居所"],
  lines: `
    herd|herds|a large group of animals such as cows, horses or elephants|兽群，牛群、马群或象群|A ___ of zebras crossed the river together.|The farmer moved his ___ of cows to the green field.|Elephants in a ___ protect the babies in the middle.|flock,troop
    flock|flocks|a group of birds or sheep|（鸟或羊的）一群|A ___ of geese flew south in a V shape.|The shepherd counted every sheep in his ___.|A ___ of pigeons landed in the square to eat crumbs.|herd,swarm
    swarm|swarms|a large group of insects moving together|（昆虫的）一大群|A ___ of bees flew out of the hollow tree.|We ran when a ___ of wasps came buzzing toward us.|A ___ of locusts can eat a whole field of crops.|flock,herd
    hive|hives|a home where bees live|蜂巢，蜂箱|The beekeeper opened the ___ to collect honey.|Thousands of bees live together in one ___.|Bees fly back to their ___ with pollen on their legs.|den,roost
    den|dens|a hidden home of a wild animal such as a fox or bear|兽穴|The fox cubs played outside their ___.|In winter, the bear sleeps in its ___ under the rocks.|Wolves dig a ___ for their pups.|hive,roost
    lair|lairs|the hiding place of a wild animal that hunts|（猛兽的）巢穴|The dragon slept in its ___ deep inside the mountain.|The lion returned to its ___ after the hunt.|Explorers found the tiger's ___ in a dark cave.|hive,roost
    pod|pods|a group of whales or dolphins|（鲸或海豚的）一群|A ___ of dolphins swam beside our boat.|The whales in a ___ call to each other with songs.|A ___ of orcas hunted together near the shore.|flock,herd
    litter|litters|a group of baby animals born to one mother at the same time|一窝（幼崽）|Our dog had a ___ of six puppies.|The mother cat carried each kitten of her ___ to a safe spot.|A pig can have a ___ of ten piglets.|troop,herd
    roost|roosts|a place where birds rest or sleep|（鸟的）栖息处|At night, the hens go back to their ___ in the barn.|Bats hang upside down in their ___ all day.|The crows flew to their ___ in the tall trees at sunset.|lair,hive
    troop|troops|a group of monkeys|（猴子的）一群|A ___ of monkeys swung through the trees.|The baby monkey stayed close to its mother in the ___.|The whole ___ of baboons sat in the sun to groom each other.|herd,pod
  `,
  notes: `
    herd|zebras crossing a river together|cows moving to a green field|elephants guarding calves in the middle|herd is for large land animals like cows or elephants; flock is for birds or sheep|herd 指牛马象等大型兽群；flock 指鸟群或羊群|flock is used for birds or sheep, not large grazing land animals|flock 用于鸟群或羊群，不用于大型草食兽群|troop is specifically a group of monkeys, not grazing hoofed animals|troop 专指猴群，不是吃草的大型兽群|herd|er spelling /ɜːr/ (not heard)|发 /ɜːr/ 的 er（别写成 heard）
    flock|geese flying south in a V shape|a shepherd counting his sheep|pigeons landing in a square for crumbs|flock is for birds or sheep; herd is for cows, horses, or elephants|flock 指鸟群或羊群；herd 指牛马象群|herd is for large land animals like cows or elephants, not birds or sheep|herd 用于牛、马、象等，不用于鸟或羊|swarm is for buzzing insects, not birds or sheep|swarm 指嗡嗡飞的虫群，不用于鸟群或羊群|flock|fl blend and ck after short o|fl 连缀和短音 o 后的 ck
    swarm|bees pouring out of a hollow tree|wasps buzzing toward people|locusts eating a whole field of crops|swarm is for moving insects; flock is for birds or sheep|swarm 指成群昆虫；flock 指鸟羊群|flock is for birds or sheep, not moving insects|flock 指鸟或羊，不是成群飞动的昆虫|herd is for large grazing land animals, not flying insects|herd 指牛象等大兽群，不是成群昆虫|swarm|sw blend and ar saying /ɔːr/ after w|sw 连缀和 w 后读 /ɔːr/ 的 ar
    hive|a beekeeper collecting honey|thousands of bees living together|bees returning home with pollen|hive is a bee home; den is a fox or bear cave|hive 是蜂巢；den 是狐熊兽穴|den is a mammal shelter for foxes or bears, not a bee home|den 是狐狸、熊等哺乳动物的兽穴，不是蜂巢|roost is a perch where birds or bats sleep, not a home built by bees|roost 是鸟或蝙蝠栖息的地方，不是蜜蜂住的蜂巢|hive|silent e making long i|词尾不发音的 e 让 i 读长音
    den|fox cubs playing outside their home|a bear sleeping under rocks in winter|wolves digging a shelter for pups|den is a hidden ground shelter for foxes, bears, or wolves; hive is a bee home|den 是狐狸、熊、狼的兽穴；hive 是蜜蜂的蜂巢|hive is a home built by bees, not a hidden shelter for wild mammals|hive 是蜜蜂住的蜂巢，不是狐熊狼等野兽的兽穴|roost is a high perch where birds or bats rest, not a ground shelter for mammals|roost 是鸟或蝙蝠的高处栖息地，不是野兽的洞穴|den|short e between d and n|d 和 n 之间的短音 e
    lair|a dragon sleeping deep inside a mountain|a lion returning after a hunt|a tiger's hiding spot in a dark cave|lair is a fierce predator's hiding place; hive is a home for bees|lair 是猛兽的隐藏巢穴；hive 是蜂巢|hive is a home where bees live, not a fierce hunting beast's hiding place|hive 是蜜蜂住的蜂巢，不是猛兽藏身的巢穴|roost is where birds or bats perch to sleep, not a predator's hidden cave|roost 是鸟和蝙蝠栖息处，不是猛兽巢穴|lair|air spelling /ɛər/|拼作 air 的 /ɛər/ 音
    pod|dolphins swimming beside a boat|whales calling with songs|orcas hunting together near shore|pod is for whales or dolphins; flock is for birds or sheep|pod 指鲸豚群；flock 指鸟羊群|flock is for birds or sheep on land or in the sky, not sea mammals|flock 用于天上飞的鸟或陆上的羊，不用于海洋鲸豚|herd is for land animals like cows or elephants, not swimming sea mammals|herd 用于陆地兽群，不用于海里的鲸和海豚|pod|short o between p and d|p 和 d 之间的短音 o
    litter|a dog giving birth to six puppies|a mother cat carrying each kitten|a pig having ten baby piglets|litter is newborn babies from one birth; troop is monkeys|litter 是一胎生下的一窝幼崽；troop 是猴群|troop is a group of monkeys, not newborn babies born together to one mother|troop 专指猴群，不是同一母兽生下的一窝幼崽|herd is a large group of adult grazing animals, not one mother's newborn babies|herd 是大型成年兽群，不是同一窝幼崽|lit · ter|double t and -er ending|双写 t 和结尾 -er
    roost|hens settling in the barn at night|bats hanging upside down all day|crows flying to tall trees at sunset|roost is a resting perch for birds or bats; lair is a predator's cave|roost 是鸟或蝙蝠停歇处；lair 是猛兽巢穴|lair is a fierce hunting beast's cave, not a resting spot where birds or bats sleep|lair 是猛兽藏身洞穴，不是鸟类或蝙蝠停歇睡觉的地方|hive is a home built by bees, not a resting spot for birds or bats|hive 是蜜蜂的巢，不是鸟类或蝙蝠的栖息处|roost|oo for long /uː/ and st blend|发长音 /uː/ 的 oo 和结尾 st
    troop|monkeys swinging through the trees|a baby monkey staying close to its mother|baboons sitting in the sun grooming|troop is for monkeys; herd is for cows or elephants|troop 指猴群；herd 指牛象兽群|herd is for large hoofed grazing animals, not a group of monkeys|herd 用于牛马象等吃草兽群，不用于猴群|pod is for whales and dolphins in the ocean, not tree-dwelling monkeys|pod 用于海里的鲸和海豚，不用于树上的猴子|troop|tr blend and double o|tr 连缀和双写 o
  `,
};

const danger: Grade3Batch = {
  id: "words-for-danger-and-safety",
  title: t("Words for Danger and Safety", "表达危险与安全的词"),
  summary: t(
    "Ten words for keeping safe and the dangers around us: protect, threat, hazard, rescue, alert and more.",
    "十个关于安全和危险的词：protect、threat、hazard、rescue、alert 等。",
  ),
  intro: t(
    "A meerkat rises on its hind legs, scanning the sky for hawks—it stays **alert** while the rest of the group eats. Knowing how to name dangers, risks, and rescues makes safety rules and animal stories crystal clear.",
    "狐獴直起后腿、紧盯着天空防备老鹰——同伴低头觅食时，它始终保持警觉（**alert**）。分清危险、隐患和营救这些词，读安全须知和动物生存故事都会更清楚。",
  ),
  watchOut: {
    meanings: t(
      "Tell **hazard** (a dangerous thing like ice or a broken step) apart from **risk** (the chance that something bad might happen).",
      "分清 **hazard**（结冰、断台阶等具体的危险物）和 **risk**（可能出事的风险、几率）。",
    ),
    use: t(
      "**Survive** means staying alive through hardship, while **escape** means getting away from a trap or danger.",
      "**survive** 是熬过困境活下来，**escape** 是从危险或受困处逃脱。",
    ),
    spelling: t(
      "Watch **threat** (*ea* says short *e*, not long *e*) and **rescue** (ends in *-ue*, not *-ew*).",
      "注意 **threat** 里读短 *e* 的 **ea**，以及 **rescue** 结尾的 **-ue**。",
    ),
  },
  domain: ["danger and staying safe", "危险和安全"],
  lines: `
    protect|protected,protects|to keep safe from harm|保护|A turtle's hard shell helps ___ it from enemies.|Wear a helmet to ___ your head when you ride a bike.|The mother bird will ___ her chicks from the cat.|rescue,injure
    threat|threats|something that might cause harm|威胁|Hawks are a ___ to small birds and mice.|The dark clouds were a ___ to our picnic.|The hungry wolves were a serious ___ to the sheep in the valley.|hazard,risk
    survive|survived,survives|to stay alive through something dangerous or hard|幸存，活下来|Camels can ___ for days without water.|Only the strongest plants ___ the long, cold winter.|The sailors drifted for days on a raft but managed to ___ until help came.|escape,vanish
    escape|escaped,escapes|to get away from danger or from a place|逃脱|The mouse squeezed under the door to ___ the cat.|A lizard can drop its tail to ___ from a bird.|The goats tried to ___ through a hole in the fence.|survive,vanish
    hazard|hazards|something that can be dangerous|危险物，隐患|Ice on the sidewalk is a ___ in winter.|A broken step is a ___, so please fix it.|Sharp rocks under the water are a ___ for swimmers.|risk,threat
    risk|risks|a chance that something bad will happen|风险|Do not take a ___ by swimming alone.|There is a ___ of a flood when it rains for days.|Every time you skip your helmet, you take a ___.|hazard,threat
    injure|injured,injures|to hurt or harm a person or animal|伤害，使受伤|A fall from the tree could ___ you badly.|Sharp hooks can ___ the fish you plan to set free.|Wear gloves so the thorns do not ___ your hands.|protect,rescue
    rescue|rescued,rescues|to save someone from danger|营救|Firefighters climbed a ladder to ___ the cat from the roof.|The lifeguard swam out to ___ the tired swimmer.|A dog helped ___ the hikers lost in the snow.|protect,escape
    alert|-|watching carefully and ready to act|警觉的，警惕的|A meerkat stands on its back legs and stays ___ for danger.|The guard dog was ___ and barked at every sound.|Stay ___ when you walk near a busy road.|risk,threat
    vanish|vanished,vanishes|to disappear suddenly|突然消失|The octopus can ___ in a cloud of dark ink.|When the hawk flew over, the rabbits seemed to ___ into the grass.|The magician made the coin ___ from his hand.|escape,survive
  `,
  notes: `
    protect|a turtle's hard shell shielding it from enemies|wearing a bike helmet to guard your head|a mother bird guarding chicks from a cat|protect shields from harm beforehand; rescue pulls someone out of danger already happening|protect 是提前防护免受伤害；rescue 是从险境里把人救出来|rescue means saving someone already trapped in danger, not shielding them ahead of time|rescue 是把已遇险的对象救出来，不是提前防护|injure means hurting someone, the exact opposite of keeping them safe|injure 是造成伤害，与保护正好相反|pro · tect|pro- plus -tect ending in ct|pro- 加以 ct 结尾的 -tect
    threat|hawks looming over small birds and mice|dark clouds menacing a picnic|hungry wolves menacing sheep in a valley|threat is something menacing harm; hazard is a physical danger spot like ice|threat 是可能带来伤害的威胁；hazard 是路面结冰等具体隐患|hazard usually names a physical danger spot like a broken step or icy walk, not an active menace|hazard 多指断台阶、冰面等静态隐患，不如 threat 贴合逼近的威胁|risk is the chance of something going wrong, not the threatening thing itself|risk 指冒的风险几率，不是构成威胁的事物本身|threat|thr blend and ea saying short e|thr 连缀和发短 e 音的 ea
    survive|camels staying alive for days without water|hardy plants living through a freezing winter|sailors staying alive on a raft until rescued|survive means staying alive through hardship; escape means getting away from a trap|survive 是熬过困境活下来；escape 是逃离险境|escape means breaking free from a trap or predator, not enduring hardship to stay alive|escape 是逃脱追捕或受困，不是熬过困境活下来|vanish means disappearing from sight, not enduring hardship to stay alive|vanish 是突然消失不见，不是顽强活下来|sur · vive|ur saying /ɜːr/ and silent e making long i|发 /ɜːr/ 的 ur 和让 i 读长音的 e
    escape|a mouse squeezing under a door away from a cat|a lizard dropping its tail to flee a bird|goats slipping out through a hole in a fence|escape means getting away; survive means enduring hardship to live|escape 是设法逃脱；survive 是熬过苦难活下来|survive means staying alive through hard conditions, not getting away from danger or a trap|survive 强调活下来，不是设法从危险或受困处逃脱|vanish means disappearing suddenly into thin air, not actively breaking away|vanish 是凭空消失，不如 escape 贴合设法逃脱|es · cape|sc after e and silent e making long a|e 后的 sc 和让 a 读长音的 e
    hazard|icy sidewalks where walkers can slip|a broken step that needs fixing|sharp underwater rocks endangering swimmers|hazard is a dangerous object or spot; risk is the chance of harm|hazard 指具体的隐患危险物；risk 指风险几率|risk is the chance of harm when you make a choice, not a physical danger spot|risk 是可能出事的几率，不是具体的实体隐患|threat is an active looming menace, rather than a physical danger spot|threat 偏指逼近的威胁，不如 hazard 贴合具体安全隐患|haz · ard|z in the middle and -ard ending|中间的 z 和结尾 -ard
    risk|the danger of swimming alone without help|the chance of flooding after days of rain|the chance of getting hurt without a helmet|risk is a chance of harm; hazard is the physical danger itself|risk 是出事的风险几率；hazard 是危险物本身|hazard names a physical danger spot, not a chance that something bad will happen|hazard 指具体危险物，不是可能出事的几率|threat is an outside menace, not the chance that something bad might happen|threat 指外来的威胁对象，不是冒险或出事的几率|risk|short i followed by sk blend|短音 i 加结尾 sk
    injure|a bad fall from a tree hurting someone|sharp hooks hurting a fish|thorns scratching bare hands|injure causes physical hurt; protect keeps harm away|injure 是弄伤；protect 是保护|protect means guarding from harm, the opposite of hurting someone|protect 是保护不受伤，与弄伤相反|rescue means saving someone from danger, not causing physical harm|rescue 是营救脱险，不是造成身体伤害|in · jure|j for /dʒ/ and -ure ending|发 /dʒ/ 的 j 和结尾 -ure
    rescue|firefighters climbing a ladder to save a cat|a lifeguard swimming out to a tired swimmer|a dog saving hikers lost in deep snow|rescue pulls someone out of danger; protect shields them beforehand|rescue 是把已遇险的人救出来；protect 是平时提前防护|protect keeps harm away in advance, whereas here someone is already in danger and needs saving|protect 是事前防护，而这里对象已经陷入险境需要救援|escape means getting yourself out, not someone else coming to save you|escape 是自己逃走，不是别人来把遇险者救出来|res · cue|ue spelling /juː/ at the end|结尾发 /juː/ 音的 ue
    alert|a meerkat standing upright watching for danger|a guard dog barking at every sound|staying watchful beside a busy road|alert is an adjective for staying watchful; threat and risk are danger nouns|alert 是保持警觉的形容词；threat 和 risk 是危险名词|risk is a noun meaning a chance of harm, not a watchful way of behaving|risk 是表示风险的名词，不能形容警觉的状态|threat is a noun naming a danger, not staying awake and watchful|threat 是指危险的名词，不是“保持警惕”|a · lert|er saying /ɜːr/ before t|t 前发 /ɜːr/ 的 er
    vanish|an octopus disappearing inside dark ink|rabbits dropping out of sight into tall grass|a magician making a coin disappear|vanish means disappearing from view; escape means breaking free from a trap|vanish 是突然消失不见；escape 是逃离受困|escape focuses on breaking away from captivity, not simply disappearing from sight|escape 强调挣脱逃离，而这里突出瞬间从眼前消失|survive means staying alive through hardship, not disappearing suddenly from sight|survive 是顽强活下来，不是突然消失不见|van · ish|single n and -ish ending|单个 n 和结尾 -ish
  `,
};

const forecast: Grade3Batch = {
  id: "words-of-the-forecast",
  title: t("Words of the Forecast", "天气预报的词汇"),
  summary: t(
    "Ten words of weather reports: forecast, temperature, mild, scorching, frost, overcast and more.",
    "十个天气预报中的词：forecast、temperature、mild、scorching、frost、overcast 等。",
  ),
  intro: t(
    "Mom scrapes thin white ice off the car windshield before school—overnight **frost** has coated the whole street. Weather reports pack a whole day's sky, wind, and heat into words like these.",
    "上学前，妈妈正把车窗上一层薄薄的白冰刮掉——夜里的霜（**frost**）铺满了整条街。天气预报里，阴晴冷暖全靠这些精准的词来交代。",
  ),
  watchOut: {
    meanings: t(
      "Tell **temperature** (how hot or cold it is) apart from **degree** (one single unit on the thermometer).",
      "分清 **temperature**（气温、冷热程度）和 **degree**（温度计上的“度”这个单位）。",
    ),
    use: t(
      "**Mild** means comfortably warm and gentle, whereas **scorching** means burning hot—never swap them on a beach or spring sentence.",
      "**mild** 是温和宜人，**scorching** 是酷热灼人——看句中是凉爽舒适还是热得烫脚。",
    ),
    spelling: t(
      "Watch the silent middle **a** in **temperature** (*tem-per-a-ture*) and the **ch** in **scorching**.",
      "注意 **temperature** 中间容易漏写的 **a**（*tem-per-a-ture*），以及 **scorching** 里的 **ch**。",
    ),
  },
  domain: ["weather reports", "天气预报"],
  lines: `
    forecast|forecasts|a report that tells what the weather will probably be|天气预报|The ___ says it will rain tomorrow, so bring an umbrella.|We checked the ___ before planning our trip to the beach.|Today's ___ calls for sunshine in the morning and wind in the evening.|temperature,degree
    temperature|temperatures|how hot or cold something is|温度，气温|The ___ dropped below freezing last night.|A thermometer measures the ___ of the air.|In the desert, the ___ can be very high in the day.|degree,forecast
    degree|degrees|a unit for measuring how hot or cold something is|度（温度单位）|It was one ___ warmer today than yesterday.|The thermometer rose by one ___ every hour.|Raise the heat of the oven by one ___ at a time.|temperature,forecast
    mild|-|not too hot and not too cold|温和的，温暖适中的|We had a ___ winter with very little snow.|It is a ___ day, so a light jacket is enough.|The weather in spring is often ___ and pleasant.|scorching,overcast
    scorching|-|very, very hot|酷热的，灼热的|On the ___ afternoon, the sand burned our feet.|It was so ___ that the chocolate melted in my pocket.|The ___ sun dried up the puddles in an hour.|mild,overcast
    frost|-|a thin layer of ice that forms on cold surfaces at night|霜|In the morning, ___ covered the grass in white.|Mom scraped the ___ off the car windows.|The ___ killed the tomato plants that were left outside.|flood,breeze
    breeze|breezes|a light, gentle wind|微风|A cool ___ came off the lake.|The leaves danced in the soft ___.|We flew our kite in the afternoon ___.|frost,flood
    overcast|-|covered with gray clouds|阴天的，多云的|The sky was ___, and we could not see the sun all day.|On ___ days, it is dark early in the afternoon.|The sky stayed ___ and gray, but it never rained.|scorching,mild
    shelter|shelters|a place that keeps you safe from bad weather|避难处，遮蔽处|We found ___ under a big tree when the rain began.|The hikers built a ___ out of branches.|The bus stop gave us ___ from the wind.|forecast,flood
    flood|floods|a lot of water covering land that is usually dry|洪水|After days of heavy rain, the river overflowed and caused a ___.|The ___ filled the streets with brown water.|People moved to higher ground to escape the ___.|frost,breeze
  `,
  notes: `
    forecast|a report predicting rain tomorrow|checking upcoming weather before a beach trip|a report calling for morning sun and evening wind|forecast predicts future weather; temperature measures current heat or cold|forecast 预报未来天气；temperature 指当前气温|temperature only tells how hot or cold the air is, not a report predicting upcoming weather|temperature 只说冷热高低，不是预报未来天气的报告|degree is a single unit on a thermometer, not a whole weather report|degree 只是温度单位“度”，不是整份天气预报|fore · cast|fore- (with silent e) plus cast|带 e 的 fore- 加 cast
    temperature|the air dropping below freezing overnight|what a thermometer measures|how high the desert heat climbs by day|temperature is how hot or cold it is; degree is one unit of it|temperature 是温度本身；degree 是温度单位“度”|degree is one single step on the scale, not the overall heat or cold|degree 只是一格单位，不是整体气温|forecast predicts future weather rather than measuring how hot or cold something is|forecast 预报未来天气，不是当前的冷热温度|tem · per · a · ture|the hidden a in per-a-ture|容易漏掉的中间字母 a（per-a-ture）
    degree|one unit warmer than yesterday|the thermometer climbing one mark each hour|turning an oven up one notch at a time|degree is a single unit; temperature is the overall reading|degree 是一格单位；temperature 是整体气温|temperature is the overall heat level, so you cannot count it as one single unit|temperature 指整体气温，不能当作单个刻度单位来数|forecast is a weather prediction, not a single unit for measuring heat or cold|forecast 是天气预报，不是衡量冷热的刻度单位|de · gree|gr blend and double e at the end|gr 连缀和结尾双写 e
    mild|a gentle winter with very little snow|comfortable air needing only a light jacket|pleasant, moderate spring weather|mild is gentle and comfortable; scorching is burning hot|mild 是温和舒适；scorching 是炙热难耐|scorching means burning hot, the opposite of mild, comfortable weather|scorching 是滚烫酷热，与温和舒适的天气正相反|overcast describes gray clouds blocking the sun, not comfortable warmth|overcast 只说乌云遮天，不表示温度温和宜人|mild|long i before ld|ld 前发长音的 i
    scorching|an afternoon so hot the sand burns feet|heat strong enough to melt pocket chocolate|fierce sun drying puddles in an hour|scorching is burning hot; mild is gently warm|scorching 是滚烫灼热；mild 是温和适中|mild means gentle and comfortable, never fiercely, burning hot|mild 是温和舒适，绝不表示酷热灼人|overcast means gray and cloudy, which blocks fierce heat|overcast 是阴云蔽日，不会有烈日暴晒|scorch · ing|or + ch before -ing|or 加 ch 再接 -ing
    frost|thin white ice coating morning grass|ice scraped off car windows|a freezing layer killing outdoor tomato plants|frost is thin night ice; flood is deep overflowing water|frost 是薄薄的夜霜；flood 是漫淹的洪水|flood is deep overflowing water, not a thin layer of ice formed on cold surfaces|flood 是淹没陆地的大水，不是夜里凝结的薄冰霜|breeze is a light wind, not a thin layer of freezing ice|breeze 是微风，不是冻住表面的薄霜|frost|fr blend at the start and st at the end|开头的 fr 和结尾的 st
    breeze|cool light air coming off a lake|soft wind making leaves dance|gentle afternoon wind lifting a kite|breeze is a gentle wind; frost is cold surface ice|breeze 是轻柔微风；frost 是地表的霜|frost is frozen ice on surfaces, not a light, gentle wind|frost 是地表结的霜，不是轻柔流动的微风|flood is overflowing water covering land, not a gentle moving wind|flood 是淹没陆地的洪水，不是轻拂的微风|breeze|br blend, double e, and silent e after z|br 连缀、双写 e 和 z 后的不发音 e
    overcast|a gray sky hiding the sun all day|cloudy afternoons turning dark early|gray cloud cover that brings no rain|overcast means gray and cloudy; scorching means fiercely sunny and hot|overcast 是灰蒙蒙的阴天；scorching 是烈日酷热|scorching means blazing hot sunshine, the opposite of a sunless gray sky|scorching 是烈日灼人，和整天不见太阳的阴天相反|mild describes gentle warmth, not whether clouds cover the sky|mild 形容气温温和，不表示满天灰云|o · ver · cast|compound over + cast|合成词 over + cast
    shelter|hiding under a big tree during rain|a branch cover built by hikers|a bus stop blocking cold wind|shelter protects you from weather; flood is dangerous high water|shelter 是遮风挡雨的地方；flood 是需要躲避的洪水|forecast is a weather report, not a physical cover that keeps you safe from bad weather|forecast 是天气预报，不是遮风挡雨的实体遮蔽处|flood is dangerous rising water you escape from, not a safe cover|flood 是要逃离的洪水，不是保护你的遮蔽处|shel · ter|sh digraph and -er ending|二合字母 sh 和结尾 -er
    flood|a river overflowing after days of heavy rain|brown water filling city streets|escaping rising water to higher ground|flood is deep water over dry land; frost is frozen night dew|flood 是淹没陆地的洪水；frost 是薄霜|frost is a thin layer of ice, not deep water covering dry land|frost 只是薄冰霜，不是淹没陆地的滔天大水|breeze is a light wind, not deep water flooding land|breeze 是微风，不是漫淹陆地的洪水|flood|oo saying short u (not long /uː/)|发短 u 音的 oo（不读长音）
  `,
};

const measuring: Grade3Batch = {
  id: "words-for-measuring",
  title: t("Words for Measuring", "表达测量的词"),
  summary: t(
    "Ten words for measuring and comparing numbers: measure, amount, total, average, gauge, range and more.",
    "十个关于测量和比较数字的词：measure、amount、total、average、gauge、range 等。",
  ),
  intro: t(
    "After a rainy night, Mia checks the clear plastic rain **gauge** in the yard—two centimeters fell before breakfast! Measuring and recording data takes exact words for tools, units, and limits.",
    "下了一夜雨，米娅早饭前去院子里看透明雨量计（**gauge**）——一夜下了两厘米！做科学测量、记数据，工具、单位和极值都要叫对名字。",
  ),
  watchOut: {
    meanings: t(
      "Tell **total** (everything added up) apart from **average** (the middle share found by dividing the total equally).",
      "分清 **total**（全部加起来的总数）和 **average**（总数平分后的平均数）。",
    ),
    use: t(
      "Do not swap **minimum** (the smallest allowed) and **maximum** (the largest allowed)—check whether the sentence says *at least* or *no higher*.",
      "别把 **minimum**（最低限度）和 **maximum**（最高限度）弄反——看句中说的是“至少”还是“不能超过”。",
    ),
    spelling: t(
      "Watch **gauge** (*au* says long *a*, plus silent *e*) and **measure** (*ea* says short *e*, *s* says /ʒ/).",
      "注意 **gauge** 里读长 *a* 的 **au** 与结尾 **e**，以及 **measure** 里读短 *e* 的 **ea**。",
    ),
  },
  domain: ["measuring and comparing numbers", "测量和比较数字"],
  lines: `
    measure|measured,measures|to find out the size, amount or weight of something|测量|Use a ruler to ___ how long the leaf is.|Use a scale to ___ how heavy the pumpkin is.|The nurse will ___ how tall you are.|record,gauge
    amount|amounts|how much there is of something|数量，总量|The ___ of rain this month was very small.|Add a small ___ of salt to the soup.|We counted the ___ of money in the jar.|total,range
    total|totals|the number you get when you add everything together|总数，合计|Three apples and two apples make a ___ of five.|We added all the scores, and the ___ came to fifty.|Add up the points to find the team's ___.|average,maximum
    average|averages|the usual or middle amount, found by sharing a total equally|平均数|The ___ of 2, 4 and 6 is 4.|On ___, it rains on ten days each month here.|The ___ height of the children in our class is 130 centimeters.|total,minimum
    record|recorded,records|to write down information so it can be used later|记录|Please ___ the temperature in your notebook every morning.|Scientists ___ in a notebook how many birds visit the pond each day.|Remember to ___ your answer in the chart.|measure,gauge
    unit|units|an amount used for measuring, such as a meter or a liter|单位|A meter is a ___ for measuring length.|Always write the ___, such as grams or centimeters, after the number.|The liter is a ___ used for measuring water.|amount,gauge
    gauge|gauges|a tool that measures something, such as rain or air pressure|测量仪器，计量器|The rain ___ in our yard showed two centimeters this morning.|Check the ___ to see how much air is in the tire.|The fuel ___ said the tank was almost empty.|unit,range
    minimum|-|the smallest amount possible or allowed|最小值，最低限度|You need a ___ of four players to start the game.|The coldest it got last night was two degrees, the ___ temperature.|Water the plant a ___ of once a week.|maximum,average
    maximum|-|the largest amount possible or allowed|最大值，最高限度|The ___ number of people in the elevator is eight.|The hottest it will get today is thirty degrees, the ___ temperature.|Fill the cup to the ___ line and no higher.|minimum,total
    range|ranges|the space between the lowest and highest amounts|范围|The ___ of temperatures today was from five to fifteen degrees.|These shoes come in a ___ of sizes.|Children in the ___ of seven to nine years old may join.|average,total
  `,
  notes: `
    measure|finding a leaf's length with a ruler|finding a pumpkin's weight on a scale|checking a child's height at the nurse's office|measure finds the size or weight; record writes the number down|measure 是量出数值；record 是把数值记下来|record means writing numbers down, not finding out a size, weight, or height|record 是把结果写下来，不是动手测量长短轻重|gauge is a measuring instrument noun, not the verb for finding size or weight|gauge 是测量仪器的名词，不能当动词表示测量|mea · sure|ea saying short e and -sure|发短 e 音的 ea 和结尾 -sure
    amount|a tiny quantity of rain for the month|a pinch of salt added to soup|counting how much money sits in a jar|amount is how much there is; total is a sum added from separate parts|amount 是总共有多少；total 是几项相加之和|total means adding separate numbers together, not simply how much of something there is|total 强调几项相加求和，不是泛指某物有多少|range means the span from lowest to highest, not how much there is of something|range 指高低区间，不是某物的多少数量|a · mount|ou saying /aʊ/ before nt|nt 前发 /aʊ/ 音的 ou
    total|adding three apples and two to get five|adding every score up to fifty|summing all points for a team|total adds everything up; average divides equally to find the middle|total 是全部相加的和；average 是平均数|average shares a sum equally to find the middle, not adding parts together|average 是平分后的中间值，不是全部加总|maximum is the highest allowed limit, not the sum of everything added together|maximum 是最高上限，不是全部相加得到的总数|to · tal|ending -al (not -le)|结尾是 -al（不是 -le）
    average|finding the middle value of 2, 4, and 6|the usual number of rainy days each month|the typical height across a whole class|average is the middle share; total is the full sum|average 是平分后的均值；total 是总和|total adds every number together into one big sum, rather than finding the middle or usual amount|total 会把数全加起来求总和，而不是求中间平均水平|minimum is only the lowest value, not the middle or usual amount|minimum 只是最小值，不是平均水平|av · er · age|the middle er and soft g before e|中间的 er 和 e 前读 /dʒ/ 的 g
    record|writing each morning's temperature in a notebook|logging daily bird counts in a notebook|writing an answer down in a chart|record writes data down; measure uses a tool to find the number|record 是把结果记下来；measure 是动手测量|measure finds a size or count with a tool, not writing information down to keep|measure 是用工具测量，不是把信息写下来保存|gauge is a measuring tool noun, not the action of writing data down|gauge 是仪表名词，不是记录动作|re · cord|or in the second syllable|第二音节里的 or
    unit|a meter used for measuring length|a label like grams or centimeters after a number|a liter used for measuring water|unit is a named measuring step; gauge is the physical instrument|unit 是计量单位名称；gauge 是测量仪表|amount is how much of something there is, not a standard measuring unit|amount 指数量多少，不是标准计量单位|gauge is a physical measuring tool, not a named unit for measuring|gauge 是具体测量工具，不是计量单位名称|u · nit|long u at the start and single n|开头读长音的 u 和单个 n
    gauge|a yard tool showing two centimeters of rain|a dial checking air pressure in a tire|a dashboard meter showing an empty fuel tank|gauge is the measuring tool; unit is the label like centimeters|gauge 是量具仪表；unit 是厘米、升等单位|unit is a measuring label, not a physical dial or meter|unit 是计量单位名称，不是能看读数的仪表|range is the span between low and high, not a physical tool that measures something|range 是高低范围，不是用来测量的实体仪器|gauge|au saying long a and silent e after g|发长 a 音的 au 和 g 后的不发音 e
    minimum|needing at least four players to begin|the coldest overnight temperature of two degrees|watering a plant at least once a week|minimum is the lowest allowed; maximum is the highest allowed|minimum 是最低下限；maximum 是最高上限|maximum is the largest allowed limit, the exact opposite of the smallest|maximum 是最高上限，与最低下限正好相反|average is the middle amount, not the smallest amount possible or allowed|average 是平均数，不是最低限度或最小值|min · i · mum|i-i-u vowel pattern ending in -mum|元音顺序 i-i-u，结尾 -mum
    maximum|an elevator's top limit of eight people|the hottest daytime high of thirty degrees|a fill line you must not pour past|maximum is the highest limit; minimum is the lowest limit|maximum 是最高上限；minimum 是最低下限|minimum is the smallest allowed amount, the opposite of a top limit|minimum 是最低下限，与最高上限相反|total is the sum of numbers added up, not a cap you cannot go past|total 是加出来的总数，不是不能超过的上限|max · i · mum|x in max and -imum ending|max 里的 x 和结尾 -imum
    range|temperatures spanning from five to fifteen degrees|shoes offered across many sizes|ages spanning from seven to nine years old|range spans from low to high; average is a single middle value|range 是从低到高的区间；average 是单个平均值|average compresses values into one middle number instead of a low-to-high span|average 只给出一个中间值，不是从低到高的跨度|total adds values into one sum rather than giving the spread from lowest to highest|total 是单一总和，不能表示从低到高的范围跨度|range|long a before nge with silent e|nge 前发长音的 a 和词尾 e
  `,
};

const maps: Grade3Batch = {
  id: "words-of-maps",
  title: t("Words of Maps", "地图的词汇"),
  summary: t(
    "Ten words for reading maps: continent, globe, equator, hemisphere, legend, peninsula, grid and more.",
    "十个读地图用的词：continent、globe、equator、hemisphere、legend、peninsula、grid 等。",
  ),
  intro: t(
    "You spot a tiny green tent on the park map and wonder what it means—a quick glance at the **legend** tells you it is a campground. Reading maps and globes starts with knowing what each line and box is called.",
    "地图上画着一顶绿色小帐篷，这是什么意思？瞄一眼图例（**legend**），原来那里是露营地。看懂地图和地球仪，就从认清这些线条和标记的名称开始。",
  ),
  watchOut: {
    meanings: t(
      "Tell **legend** (the key box that explains every mark on the map) apart from **symbol** (one single mark like a star or cross).",
      "分清 **legend**（解释全图标记的图例框）和 **symbol**（单个符号，比如五角星或十字）。",
    ),
    use: t(
      "A **continent** is one of the seven huge landmasses, while a **hemisphere** is an entire half of the Earth (land and ocean together).",
      "**continent** 是七大洲之一，而 **hemisphere** 是半个地球（包含陆地和海洋）。",
    ),
    spelling: t(
      "Watch **hemisphere** (*ph* says /f/), **equator** (*qu* + *-or*), and **peninsula** (single *n*, *-sula*).",
      "注意 **hemisphere** 里发 /f/ 的 **ph**、**equator** 的 **qu** 与 **-or**，以及 **peninsula** 的拼写。",
    ),
  },
  domain: ["maps and the shape of the world", "地图和世界的形状"],
  lines: `
    continent|continents|one of the seven very large areas of land on Earth|大洲|Africa is the ___ where most of the world's lions live.|Australia is both a country and a ___.|Asia is the largest ___ on Earth.|hemisphere,peninsula
    globe|globes|a round model of the Earth|地球仪|I spun the ___ and pointed to where we live.|A ___ shows the Earth as a ball, not a flat page.|On our classroom ___, the oceans are blue and the land is green.|hemisphere,grid
    equator|-|the imaginary line around the middle of the Earth|赤道|Countries near the ___ are hot all year.|The ___ divides the Earth into a northern half and a southern half.|On the globe, the ___ is drawn as a line around the middle.|border,coast
    hemisphere|hemispheres|one half of the Earth|半球|The equator splits the Earth into two halves, and each half is called a ___.|When it is summer in one ___, it is winter in the other.|Australia lies in the southern ___.|continent,globe
    border|borders|the line where one country or state ends and another begins|边界，国界|We crossed the ___ between the two countries by train.|On the map, a dotted line shows the ___ between the states.|The river forms the ___ between the two towns.|equator,coast
    legend|legends|the box on a map that tells what its symbols mean|图例|The ___ shows that a tent stands for a campground.|Check the map's ___ to find out what the blue dots mean.|In the ___, a green triangle means a forest.|symbol,grid
    symbol|symbols|a small picture or mark that stands for something|符号|On this map, a star is the ___ for the capital city.|A cross is the ___ for a hospital.|The ___ for a school is a little flag.|legend,grid
    peninsula|peninsulas|land with water on three sides|半岛|Italy is a ___ shaped like a boot.|Florida is a ___ with the ocean on three sides.|We drove to the tip of the ___ and saw water all around.|coast,continent
    coast|coasts|the land along the edge of the sea|海岸|We drove along the ___ and watched the waves.|Many fishing villages lie on the ___.|The ship sailed close to the rocky ___.|peninsula,border
    grid|grids|lines that cross each other to make squares on a map|网格|Use the ___ to find the park in square B3.|The map has a ___ of letters across the top and numbers down the side.|Each square of the ___ is one kilometer wide.|legend,symbol
  `,
  notes: `
    continent|Africa as the huge landmass home to most lions|Australia counting as both a country and a huge landmass|Asia as Earth's largest landmass|continent is one of seven huge land areas; hemisphere is half the whole globe|continent 是七大洲之一；hemisphere 是半个地球|hemisphere means an entire half of Earth including oceans, not one of the seven landmasses|hemisphere 包含陆地与海洋的半个地球，不是七大洲之一|peninsula is a much smaller piece of land surrounded by water on three sides|peninsula 只是三面环水的半岛，远不如大洲辽阔|con · ti · nent|i in the middle and -ent at the end|中间的 i 和结尾 -ent
    globe|spinning a round Earth model to point where you live|showing Earth as a ball instead of a flat page|a classroom model with blue oceans and green land|globe is a round Earth model; hemisphere is only half of Earth|globe 是完整的球形地球仪；hemisphere 只是地球的一半|hemisphere is only one half of Earth, not a whole round model of the planet|hemisphere 只指半球，不是整颗球形地球仪|grid is a flat set of crossing map lines, not a round ball|grid 是平面交叉网格，不是球形模型|globe|gl blend and silent e making long o|gl 连缀和让 o 读长音的 e
    equator|the warm middle line where countries stay hot all year|the imaginary line splitting north and south halves|the line drawn around the middle of a globe|equator circles Earth's middle; border separates countries or states|equator 是地球正中的赤道；border 是国界或州界|border divides neighboring countries or states, not the entire northern and southern halves of Earth|border 划分相邻国家或州，不把地球分成南北两半|coast is the edge of land beside the sea, not a line circling Earth's middle|coast 是陆地靠海的海岸线，不是绕地球正中的纬线|e · qua · tor|qu in the middle and -or ending|中间的 qu 和结尾 -or
    hemisphere|each of the two halves split by the equator|one half having summer while the other has winter|the southern half where Australia lies|hemisphere is half of Earth; continent is one landmass|hemisphere 是半球；continent 是一块大洲|continent is one of the seven landmasses, not half of the whole planet|continent 只是七大洲之一，不是半个地球|globe is the entire round Earth model, not just one half of it|globe 是整个地球仪，不是其中一半|hem · i · sphere|ph spelling /f/ and silent e|发 /f/ 音的 ph 和词尾不发音的 e
    border|crossing by train from one country into another|a dotted map line separating two states|a river dividing two neighboring towns|border divides countries or towns; equator circles Earth's middle|border 是国界或城界；equator 是赤道|equator is the single imaginary line around Earth's middle, not a boundary between neighboring places|equator 是地球正中的赤道，不是相邻地区之间的分界线|coast is where land meets the ocean, not a dividing line between two neighboring places|coast 是陆地与海洋交界的海岸，不是两个地区之间的分界线|bor · der|or + der with -er ending|or 加以 -er 结尾的 der
    legend|the map key explaining that a tent means campground|checking a map key for what blue dots mean|a map box showing a green triangle means forest|legend is the whole key box; symbol is one single mark|legend 是整块图例说明框；symbol 是单个图标|symbol is one single tiny mark on a map, not the box explaining what all the marks mean|symbol 只是单个小图标，不是解释全图标记的图例框|grid is crossing lines that make map squares, not the key box explaining symbols|grid 是定位方格的网格线，不解释图标含义|leg · end|soft g (/dʒ/) before e and -end|e 前发 /dʒ/ 的 g 和结尾 -end
    symbol|a star standing for a capital city|a cross marking a hospital on a map|a little flag marking a school|symbol is one mark on a map; legend is the box listing all symbols|symbol 是单个符号；legend 是汇总符号的图例|legend is the whole key box on a map, not one single small picture or mark|legend 是整块图例框，不是单个小图标|grid is the crossing lines making map squares, not a tiny icon|grid 是划分方格的网格，不是代表某事物的单个图标|sym · bol|y spelling short i and -bol ending|发短 i 音的 y 和结尾 -bol
    peninsula|boot-shaped Italy jutting into the sea|Florida surrounded by ocean on three sides|driving to a narrow tip with water all around|peninsula has water on three sides; coast is any shoreline|peninsula 三面环水；coast 只指沿海岸线|coast is just the shoreline edge, not a whole piece of land with water on three sides|coast 只指海岸边沿，不是三面环水的整片陆地|continent is one of seven giant landmasses, much larger than a piece of land jutting into water|continent 是整个大洲，远大于三面环水的半岛|pen · in · su · la|single n in pen-in and -sula|pen-in 单个 n 加 -sula
    coast|driving along the sea watching waves|fishing villages sitting beside the ocean|a ship sailing near a rocky shoreline|coast is the edge along the sea; peninsula juts out with water on three sides|coast 是海岸线；peninsula 是三面环水的半岛|peninsula must have water on three sides, not just any shoreline along the sea|peninsula 必须三面环水，而这里只说沿海岸边|border separates two countries or states, not the land along the edge of the sea|border 是国界或州界，不是陆地靠海的海岸|coast|oa spelling long o before st|st 前发长 o 音的 oa
    grid|finding a park inside square B3|letters along the top and numbers down the side|one-kilometer map squares formed by crossing lines|grid is crossing lines making squares; legend is the key box|grid 是划分方格的网格；legend 是图例说明框|legend explains what map symbols mean, not crossing lines that divide a map into squares|legend 解释图标含义，不是把地图分成方格的网格线|symbol is a single picture mark, not crossing lines|symbol 是单个图标，不是交叉成格的网格线|grid|gr blend and short i|gr 连缀和短音 i
  `,
};

const landAndWater: Grade3Batch = {
  id: "words-of-land-and-water",
  title: t("Words of Land and Water", "地形与水域的词汇"),
  summary: t(
    "Ten words for the shapes of land and water: valley, plateau, canyon, bay, gulf, swamp, ridge and more.",
    "十个描述地形和水域的词：valley、plateau、canyon、bay、gulf、swamp、ridge 等。",
  ),
  intro: t(
    "Stand at the rim and shout—your voice bounces back from steep red rock walls far above the river: you are looking into a **canyon**. Geography gives every shape of land and water its own sharp name.",
    "站在岩边喊一声，回声从陡峭的红岩绝壁间荡回来，脚下是一条深深的河——眼前就是峡谷（**canyon**）。地理课上，高低平洼的每一种地形水域都有自己的名字。",
  ),
  watchOut: {
    meanings: t(
      "Tell **plain** (low, wide flat land) apart from **plateau** (high flat land raised above the ground around it).",
      "分清 **plain**（低平开阔的平原）和 **plateau**（海拔高、顶部平坦的高原）。",
    ),
    use: t(
      "A **bay** is a smaller curve of sea you can often see across, while a **gulf** is a huge sea inlet that takes big ships days to cross.",
      "**bay** 通常是较小、能望见对岸的海湾，而 **gulf** 是大船都要航行几天的广阔海湾。",
    ),
    spelling: t(
      "Watch **plateau** (*-eau* says long *o*), **ridge** (silent *d* in *-dge*), and **meadow** (*ea* says short *e*).",
      "注意 **plateau** 结尾读长 *o* 的 **-eau**、**ridge** 里不发音的 **d**，以及 **meadow** 里读短 *e* 的 **ea**。",
    ),
  },
  domain: ["the shapes of land and water", "陆地和水域的形状"],
  lines: `
    valley|valleys|low land between hills or mountains|山谷|A river runs through the green ___ between the mountains.|The village sits in a ___, with hills on both sides.|From the top of the hill, we looked down into the ___.|ridge,plateau
    plateau|plateaus|a large area of high, flat land|高原|The top of the ___ was flat and windy.|Tibet is on a high ___ in Asia.|The road climbed for hours until it reached the ___.|plain,ridge
    canyon|canyons|a deep valley with steep rock sides, often with a river at the bottom|峡谷|The river cut a deep ___ through the red rock.|We could hear our voices echo off the walls of the ___.|Looking down into the ___ made me dizzy.|valley,cliff
    cliff|cliffs|a high, steep face of rock|悬崖|Seabirds nest on the rocky ___ above the sea.|Do not stand near the edge of the ___.|The waves crashed against the bottom of the ___.|ridge,canyon
    plain|plains|a large area of flat land with few trees|平原|Buffalo once roamed the wide, grassy ___.|The farmers grow wheat on the flat ___.|You can see for miles across the ___.|plateau,meadow
    bay|bays|part of the sea that curves into the land|海湾|Our little sailboat rested in the calm, small ___ near the town.|The town is built around a small ___ with a sandy beach.|The ___ is so small that you can see the houses on the other side.|gulf,swamp
    gulf|gulfs|a very large area of sea that is partly surrounded by land|（大的）海湾|The ___ of Mexico is surrounded by land on three sides.|Storms often form over the huge, warm ___ south of the coast.|It takes big ships two days to cross the ___.|bay,swamp
    swamp|swamps|wet, muddy land with trees and water plants|沼泽|Alligators live in the ___.|Our boots sank in the mud of the ___.|Frogs croak among the reeds of the ___.|meadow,bay
    meadow|meadows|a field of grass and wild flowers|草地，草甸|Cows grazed in the sunny ___.|We had a picnic in a ___ full of daisies.|Butterflies fluttered over the ___.|plain,swamp
    ridge|ridges|a long, narrow top of a hill or mountain|山脊|We hiked along the ___ and looked down on both sides.|A line of pine trees grew along the ___.|The sun set behind the rocky ___.|valley,cliff
  `,
  notes: `
    valley|low green land with a river between mountains|a village nestled between hills on both sides|looking down into low land from a hilltop|valley is low land between hills; ridge is the high narrow top|valley 是两山间的低谷；ridge 是高窄的山脊|ridge is the high narrow top of a mountain, not low land between hills or mountains|ridge 是山顶高脊，不是夹在两山间的低谷|plateau is flat land raised high up, not low ground sitting between hills|plateau 是高耸平坦的高原，不是群山环抱的低地|val · ley|double l and -ey ending|双写 l 和结尾 -ey
    plateau|high flat ground swept by wind|Tibet resting on a high flat highland|climbing for hours to reach flat land on top|plateau is high flat land; plain is low flat land|plateau 是海拔高的高原；plain 是低平的平原|plain is low flat ground, not high flat land raised far above the surroundings|plain 是低平的平原，不是高高抬起的高原|ridge is a narrow mountain crest, not a broad flat area|ridge 是狭窄山脊，不是宽阔平坦的高原|pla · teau|-eau spelling long o at the end|结尾发长 o 音的 -eau
    canyon|a deep gorge carved through red rock by a river|voices echoing off steep rock walls|getting dizzy looking down into a deep gorge|canyon has steep sheer rock walls; valley has gentler green slopes|canyon 是陡壁深谷；valley 坡度较缓|valley is usually a wider, gentler low area, not a deep gorge with steep rock walls|valley 多指平缓宽阔的山谷，不如 canyon 突出陡峭岩壁|cliff is only one single steep rock face, not a deep gorge with walls on both sides|cliff 只是单面悬崖，不是两侧高壁夹峙的峡谷|can · yon|y in the second syllable and -on|第二音节的 y 和结尾 -on
    cliff|a steep rocky wall above the sea where birds nest|a dangerous drop-off you should step back from|waves crashing at the foot of a steep rock face|cliff is a vertical rock face; ridge is a narrow hilltop crest|cliff 是垂直陡崖；ridge 是山顶长脊|ridge is a narrow mountain top you hike along, not a high, steep face of rock|ridge 是狭长的山脊顶部，不是高耸陡峭的垂直岩壁|canyon is a whole deep gorge between two walls, not one steep edge|canyon 是两壁夹成的深谷，不是单面崖边|cliff|cl blend and double f at the end|cl 连缀和结尾双写 f
    plain|wide grassy flatlands where buffalo roamed|flat open farmland growing wheat|flat country stretching for miles|plain is vast low flat land; plateau is high raised flat land|plain 是辽阔低平的平原；plateau 是高耸的高原|plateau sits high above surrounding land, not low, wide flat land|plateau 海拔高高抬起，不是低平开阔的平原|meadow is a small field of grass and wildflowers, much smaller than a wide plain|meadow 只是小片花草地，远不如一望无际的平原辽阔|plain|ai spelling long a (not plane)|发长 a 音的 ai（不是 plane）
    bay|a calm small curve of sea by a town|a small sandy curve of ocean around a town|water narrow enough to see houses across|bay is a smaller sea curve; gulf is a huge sea inlet|bay 是较小的海湾；gulf 是广大的海湾|gulf is a vast stretch of sea taking big ships days to cross, not a small calm inlet|gulf 面积浩大、大船要走几天，不是规模较小的海湾|swamp is muddy wetland with trees and reeds, not a calm curve of sea|swamp 是长满芦苇的泥泞沼泽，不是伸入陆地的海湾|bay|ay spelling long a|发长 a 音的 ay
    gulf|a vast sea body partly enclosed by land|warm open ocean where big storms form|wide sea taking big ships two days to cross|gulf is vast ocean water; bay is much smaller|gulf 面积广阔；bay 规模小得多|bay is a much smaller curve of sea, not a huge sea area partly surrounded by land|bay 只是规模较小的海湾，远不如 gulf 辽阔|swamp is muddy wetland on land, not a very large area of sea|swamp 是陆地上的泥泞沼泽，不是广阔的海域|gulf|short u followed by lf|短音 u 加结尾 lf
    swamp|muddy wetland where alligators live|wet mud where boots sink deep|reeds where frogs croak in standing water|swamp is wet muddy ground; meadow is dry sunny grass|swamp 潮湿泥泞；meadow 阳光草地|meadow is a sunny, dry field of grass and flowers, not wet muddy wetland|meadow 是阳光明媚的干爽草地，不是潮湿泥泞的沼泽|bay is salty ocean water curving into land, not muddy reeds|bay 是咸水海湾，不是长满芦苇的泥沼|swamp|a saying /ɑː/ after w|w 后读 /ɑː/ 的 a
    meadow|a sunny grassy field where cows graze|a daisy-filled field for a picnic|a flowery field where butterflies flutter|meadow is a small flowery grass field; plain is vast flatland|meadow 是小片花草甸；plain 是广袤平原|plain is vast open flatland stretching for miles, not a small grassy field with wildflowers|plain 指绵延数英里的大平原，不如 meadow 贴合小片野花草地|swamp is wet muddy land with reeds, not a dry field of grass and wildflowers|swamp 是泥泞沼泽，不是干爽的花草地|mead · ow|ea saying short e and -ow saying long o|发短 e 音的 ea 和发长 o 音的 -ow
    ridge|hiking a narrow mountain top with drops on both sides|a line of pines along a hilltop crest|a rocky mountain top silhouetted at sunset|ridge is the narrow mountain crest; valley is the low gap below|ridge 是山顶长脊；valley 是山下低谷|valley is low land down between hills, not the long, narrow top of a hill or mountain|valley 是低洼山谷，不是狭长的山顶高脊|cliff is a steep vertical rock wall, not a long, narrow mountain top|cliff 是垂直陡崖，不是狭长的山脊顶部|ridge|silent d in -dge after short i|短音 i 后 -dge 里不发音的 d
  `,
};

const places: Grade3Batch = {
  id: "words-for-places-and-directions",
  title: t("Words for Places and Directions", "表达地点与方向的词"),
  summary: t(
    "Ten words for where things are: location, route, distant, nearby, northern, southern, landmark and more.",
    "十个表示位置的词：location、route、distant、nearby、northern、southern、landmark 等。",
  ),
  intro: t(
    "“Turn left at the big red bridge!” That bridge is a **landmark**—an easy-to-spot place that guides you home. Giving clear directions uses exact words for spots, paths, and compass sides.",
    "“到大红桥那儿左转！”那座桥就是地标（**landmark**）——一眼就能认出来、帮你指路的建筑。给人指路或看地图，全靠这些表示位置、路线和方位的词。",
  ),
  watchOut: {
    meanings: t(
      "Tell **location** (one exact spot) apart from **route** (the path you travel from start to finish).",
      "分清 **location**（某一个具体地点）和 **route**（从起点走到终点的路线）。",
    ),
    use: t(
      "Watch **eastern** (where the sun rises) versus **western** (where the sun sets), and **northern** (Arctic) versus **southern** (Antarctica).",
      "别把 **eastern**（日出东方）和 **western**（日落西方）、**northern**（北极方向）和 **southern**（南极方向）弄反。",
    ),
    spelling: t(
      "Watch **route** (*ou* + silent *e*) and **southern** (*ou* says short *u*, unlike *south*).",
      "注意 **route** 的 **ou** 加词尾 **e**，以及 **southern** 里读短 *u* 的 **ou**（和 *south* 读音不同）。",
    ),
  },
  domain: ["places and directions", "地点和方向"],
  lines: `
    location|locations|the place where something is|位置，地点|Mark the ___ of your house on the map.|The new park's ___ is next to the library.|The pirate's map showed the ___ of the treasure.|route,landmark
    route|routes|the way you go to get from one place to another|路线|The bus takes the same ___ to school every day.|We chose a ___ that went past the lake.|The map shows the shortest ___ to the beach.|location,landmark
    distant|-|far away|遥远的|We could see ___ mountains through the window.|The ship sailed to a ___ island.|The sound of ___ thunder rolled over the hills.|nearby,central
    nearby|-|close to here|附近的|We walked to a ___ shop to buy bread.|The children play in a ___ park after school.|Is there a ___ place where we can get water?|distant,central
    northern|-|in or from the north|北方的，北部的|Near the North Pole, the ___ part of the world is cold and icy.|Polar bears live in ___ lands near the Arctic.|The ___ side of the house faces the North Star.|southern,eastern
    southern|-|in or from the south|南方的，南部的|Penguins live in the far ___ part of the world.|Mexico lies along the ___ border of the United States.|Antarctica is at the far ___ end of the globe.|northern,western
    eastern|-|in or from the east|东方的，东部的|The sun rises in the ___ sky.|China is on the ___ side of Asia.|The ___ window of my room fills with light in the morning.|western,southern
    western|-|in or from the west|西方的，西部的|The sun sets in the ___ sky.|Cowboys once rode across the ___ plains.|The ___ coast faces the setting sun.|eastern,northern
    central|-|in the middle|中心的，中部的|The library is in the ___ part of town, close to everything.|Our ___ square has a fountain in the middle.|Our town is in the ___ part of the state, right in the middle.|distant,nearby
    landmark|landmarks|a building or place that is easy to see and helps you find your way|地标|The tall clock tower is a ___ that everyone in town knows.|Turn left at the big red bridge; it is a good ___.|The lighthouse was a ___ for sailors coming home.|location,route
  `,
  notes: `
    location|marking where a house sits on a map|a park's exact spot next to the library|where buried treasure is marked on a map|location is one exact spot; route is the path you travel|location 指具体地点；route 指行走路线|route is the whole path from start to finish, not one single spot on a map|route 是从起点到终点的整条路线，不是单个地点|landmark is a tall visible sight like a bridge or tower, not just any marked spot|landmark 指钟楼、大桥等显眼地标，不是普通地点位置|lo · ca · tion|-tion spelling /ʃən/ at the end|结尾发 /ʃən/ 音的 -tion
    route|the daily path a school bus follows|a chosen road going past the lake|the shortest path to the beach|route is the path taken; location is a single place|route 是路线；location 是单点位置|location names only one single spot, not the path you travel from one place to another|location 只指单个点位，不是从一处走到另一处的路线|landmark is a single visible guidepost, not a whole road or path|landmark 只是一个显眼建筑，不是整条路线|route|ou spelling /uː/ (or /aʊ/) plus silent e|ou 加词尾不发音的 e
    distant|far-off mountains seen through a window|a faraway island reached by ship|thunder rolling from far across the hills|distant means far away; nearby means close by|distant 是遥远的；nearby 是附近的|nearby means close enough to reach easily, the opposite of far away|nearby 是就在附近，与遥远正好相反|central means right in the middle, not far off in the distance|central 指正中央，不是在远处|dis · tant|-ant ending (not -ent)|结尾是 -ant（不是 -ent）
    nearby|a close shop you can walk to for bread|a neighborhood park visited after school|a close spot to get water|nearby means close; distant means far away|nearby 是近在附近；distant 是相距遥远|distant means far away, the exact opposite of close to here|distant 是相距遥远，与近在附近正相反|central means in the middle of a town or state, not simply close to you|central 强调处于正中心，不一定离你近|near · by|compound near (with ear) + by|合成词 near（含 ear）加 by
    northern|icy lands near the North Pole|polar bear country near the Arctic|the side of a house facing the North Star|northern points to the north; southern points to the south|northern 指北方；southern 指南方|southern points toward Antarctica and the South Pole, opposite the north|southern 指向南极方向，和北方正好相反|eastern points toward the rising sun, not toward the north|eastern 指向日出的东方，不是北方|north · ern|north + -ern ending|north 加后缀 -ern
    southern|the far cold region where penguins live|the border where Mexico meets the United States|the far end of the globe at Antarctica|southern points to the south; northern points to the north|southern 指南方；northern 指北方|northern points toward the Arctic, opposite the south|northern 指向北极方向，和南方相反|western points toward the sunset, not toward the south|western 指向西方日落，不是南方|south · ern|ou saying short u (not /aʊ/ as in south)|ou 读短音 u（不像 south 读 /aʊ/）
    eastern|the sky where the morning sun rises|Asia's side where China sits|a bedroom window lit by morning sun|eastern is where the sun rises; western is where it sets|eastern 是日出的东方；western 是日落的西方|western is where the sun sets in the evening, opposite the east|western 是傍晚日落的西方，与东方相反|southern points south rather than toward the east|southern 指向南方，不是东方|east · ern|ea saying long e plus -ern|发长 e 音的 ea 加 -ern
    western|the sky where the evening sun sets|wide plains where cowboys once rode|the shoreline facing the setting sun|western is where the sun sets; eastern is where it rises|western 是日落的西方；eastern 是日出的东方|eastern is where the sun rises in the morning, opposite the west|eastern 是早晨日出的东方，和西方相反|northern points toward the cold North Pole, not the west|northern 指向北极方向，不是西方|west · ern|west + -ern ending|west 加后缀 -ern
    central|the middle part of town close to everything|a town square with a fountain in the center|a town sitting right in the middle of the state|central means in the middle; distant means far off|central 是在正中央；distant 是在远处|distant means far away at the edge or beyond, not in the middle|distant 是偏远在远处，不在正中心|nearby only means close to you, not necessarily in the exact middle|nearby 只表示离你近，不一定位于正中央|cen · tral|soft c (/s/) before e and -al ending|e 前读 /s/ 的 c 和结尾 -al
    landmark|a famous clock tower everyone in town recognizes|a big red bridge telling drivers where to turn|a lighthouse guiding sailors home|landmark is a visible guidepost; location is any ordinary spot|landmark 是指路用的显眼地标；location 泛指普通位置|location is any spot on a map, without needing to be an easy-to-see sight that helps you find your way|location 泛指任何地点，不一定显眼到能帮人辨认方向|route is the whole path you follow, not a single easy-to-see building or place|route 是整条路线，不是单个显眼的建筑或地标|land · mark|compound land + mark (with ar)|合成词 land 加含 ar 的 mark
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
