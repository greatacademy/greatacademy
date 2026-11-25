// Grade 10: the batches of words of fights and squabbles, of schemes and tricks, of cruelty, of mess and dirt,
// of cleaning, of rich and poor, of pay and bills and academic words of sources and steps.

import { t } from "@ga/content";
import type { BatchSpec } from "../batch.ts";
import { batch } from "../grade-5/batches.ts";

const fights = batch(
  "words-of-fights-and-squabbles",
  ["Words of Fights and Squabbles", "打斗与争吵的词"],
  ["small quarrels, street fights, conflict and stirring people up", "小争吵、街头斗殴、冲突与煽动"],
  `
  bicker|to argue about petty things|斗嘴|The twins ___ all day about silly things, never hitting each other but never ending their petty arguments either.|My parents ___ over the TV remote every evening, but it never turns into a real fight.|Stop it, you two—don't ___ over who had the bigger slice of cake; just share it.|agitate,brawl|bickered,bickering
  tiff|a petty quarrel between friends or lovers|小口角|They had a ___ over dinner about where to go on holiday, but they made up before dessert.|It was just a lovers' ___, and by the next morning they were holding hands again.|After a small ___ about whose turn it was to wash up, the sisters laughed and made up.|brawl,strife|tiffs
  spat|a short quarrel about something unimportant|小争吵|The two neighbours had a brief, silly ___ about where to put the bins, but it was forgotten by lunch.|The two singers had a public ___ online over who wrote the song, trading sharp words for a day.|It was only a minor ___ between friends, the kind of quarrel that is over in five minutes.|brawl,strife|spats
  scuffle|a short confused fight; to take part in one|扭打|A ___ broke out at the gate as fans pushed and shoved to get in first.|He was knocked over and hurt his wrist in the ___ with the two pickpockets.|There was a brief ___ on the pitch, with a few players grabbing shirts and pushing before the referee stepped in.|tiff,strife|scuffled
  brawl|a rough noisy fight|斗殴|A ___ started in the bar, with chairs thrown and glasses smashed.|Police broke up the ___ outside the stadium, where dozens of fans were punching each other.|The wedding ended in a drunken ___, and three guests went to hospital with cuts.|tiff,spat|brawled,brawls
  clash|a violent meeting; a disagreement; to look bad together|冲突；不协调|There was a bloody ___ between the two armies at the river, and hundreds were killed.|A ___ of views between the two leaders meant the talks ended without a deal.|Riot police and protesters met in a violent ___ in the main square.|tiff,strife|clashed,clashes
  fray|a fight or battle; to wear thin at the edges|争斗；磨损|He jumped into the ___ to help his friend, who was being punched by three men.|Hearing the shouts, more soldiers rushed down the hill to join the ___.|When the argument turned into a fight, the coach stepped into the ___ and pulled the players apart.|tiff,spat|frayed
  strife|angry or bitter disagreement|冲突|The land was torn by years of ___, as rival groups fought for control of the country.|Family ___ over the will split the brothers apart for twenty years.|After the war came long years of bitter ___ between the two peoples, with neither side trusting the other.|tiff,spat|
  agitate|to make someone troubled; to campaign for change; to shake|使焦虑；鼓动；搅动|Please don't ___ the patient with bad news; he needs to stay calm while he recovers.|For years the workers continued to ___ for better pay, holding marches and protests.|The washing machine will ___ the clothes, shaking them back and forth in soapy water.|bicker,console|agitated,agitation
  vehement|showing strong feeling; forceful|激烈的|She was ___ in her protest against the plan, shouting that she would never let them cut down the trees.|He gave a ___ denial, banging the table and insisting that he had never taken the money.|The new road met with ___ opposition from the villagers, who held angry meetings every week.|tentative,brutal|vehemently
  `,
  "context-clues",
  {
    intro: t(
      "What began as a small **tiff** between two fans turned into a **scuffle** at the gate and then a **brawl** that the police had to break up. These ten words help you talk about small quarrels, fights, long conflict and stirring people up.",
      "两个球迷之间的小口角（**tiff**）先在门口变成了扭打（**scuffle**），后来又演变成一场斗殴（**brawl**），最后警察不得不出面制止。这十个词帮你谈论小争吵、打斗、长期的冲突以及煽动情绪。",
    ),
    watchOut: {
      meanings: t(
        "A **tiff** or a **spat** is a short quarrel with words only, while a **scuffle** or a **brawl** is a fight with pushing and punching.",
        "**tiff** 和 **spat** 是只动口的小争吵；**scuffle** 和 **brawl** 是推搡、拳打脚踢的打斗。",
      ),
      use: t(
        "**Strife** cannot be counted, so you say years of strife, never a strife; but you have a tiff, a spat or a clash.",
        "**strife** 不可数，要说 years of strife，不说 a strife；而 tiff、spat、clash 都可以说 a tiff、a spat、a clash。",
      ),
      spelling: t(
        "**Tiff** and **scuffle** both have a double f, **vehement** has a silent h, and **brawl** has aw as in *crawl*.",
        "**tiff** 和 **scuffle** 都双写 f；**vehement** 中的 h 不发音；**brawl** 中的 aw 读音同 *crawl*。",
      ),
    },
    notes: `
      bicker|twins arguing all day about silly things but never hitting each other|parents arguing over the TV remote every evening|two children arguing over who had the bigger slice of cake|bicker means to argue about small, silly things; brawl means to fight roughly and noisily|bicker 是为小事斗嘴；brawl 是粗暴地大打出手|agitate means to upset someone or to campaign for change, and it is not used for arguing over small things|agitate 是使人不安或为变革而鼓动，不用于为小事斗嘴|brawl means to fight roughly with fists, not to argue with words about small things|brawl 是动手打架，不是为小事拌嘴|bick · er|the ck before -er|-er 前是 ck
      tiff|a couple quarrelling about a holiday but making up before dessert|a lovers' quarrel forgotten by the next morning|sisters quarrelling about washing up and soon laughing|a tiff is a small quarrel with words between friends or lovers; a brawl is a rough fight with fists|tiff 是朋友或恋人之间的小口角；brawl 是拳脚相加的斗殴|a brawl is a rough, noisy fight with fists, not a small quarrel that is soon made up|brawl 是拳脚相加的斗殴，不是很快就和好的小口角|strife is long, bitter conflict that cannot be counted, so it never takes a, and it is not a small quarrel|strife 是长期激烈的冲突，不可数，不加 a，也不是小口角|tiff|the double f at the end|结尾双写 f
      spat|neighbours quarrelling about bins and forgetting it by lunch|two singers trading sharp words online for a day|a minor quarrel between friends that is over in five minutes|a spat is a short quarrel with words; strife is long, bitter conflict|spat 是简短的口角；strife 是长期激烈的冲突|a brawl is a rough fight with fists, not a short exchange of sharp words|brawl 是拳脚相加的斗殴，不是几句尖锐的口角|strife is long, bitter conflict that cannot be counted, not a quarrel over in minutes|strife 是不可数的长期激烈冲突，不是几分钟就结束的口角|spat|the short a, as in *cat*|短音 a，同 *cat*
      scuffle|fans pushing and shoving at a gate to get in first|a man hurt while struggling with two pickpockets|players grabbing shirts and pushing before the referee steps in|a scuffle is a short, confused fight with pushing; a tiff is a small quarrel with words|scuffle 是短暂混乱的推搡扭打；tiff 是只动口的小口角|a tiff is a small quarrel with words only, not pushing, shoving or grabbing|tiff 是只动口的小口角，没有推搡和拉扯|strife is long, bitter conflict that cannot be counted, not a brief struggle at a gate or on a pitch|strife 是不可数的长期激烈冲突，不是门口或球场上短暂的推搡|scuf · fle|the double f and the -le ending|双写 f，结尾是 -le
      brawl|chairs thrown and glasses smashed in a bar|dozens of fans punching each other outside a stadium|a drunken wedding fight that sends three guests to hospital|a brawl is a rough, noisy fight; a tiff is a small quarrel with words|brawl 是粗暴喧闹的斗殴；tiff 是小口角|a tiff is a small quarrel between friends, not a fight with chairs and fists|tiff 是朋友间的小口角，不是摔椅子、挥拳头的斗殴|a spat is a short quarrel with words, not a fight that sends people to hospital|spat 是简短的口角，不是把人打进医院的斗殴|brawl|the aw, as in *crawl*|aw 读音同 *crawl*
      clash|two armies meeting in a bloody battle at a river|two leaders whose views are opposed so the talks fail|riot police and protesters meeting violently in a square|a clash is a violent meeting or a strong disagreement between two sides; a tiff is a small quarrel between friends|clash 是双方的激烈冲突或严重分歧；tiff 是朋友间的小口角|a tiff is a small, friendly quarrel, not a battle between armies or a deep split between leaders|tiff 是朋友间的小口角，不是军队交战或领导人之间的严重分歧|strife is long, bitter conflict that cannot be counted, not one single battle or one meeting of opposed views|strife 是不可数的长期激烈冲突，不是一场战斗或一次观点交锋|clash|the sh at the end|结尾是 sh
      fray|a man jumping into a fight to help his friend|soldiers rushing down a hill to join a battle|a coach stepping into a fight to pull players apart|the fray is a fight or battle that people join or step into; a tiff is a small quarrel|fray 是人们加入或介入的打斗；tiff 是小口角|a tiff is a small quarrel with words, not a fight with punches or a battle that soldiers rush to join|tiff 是只动口的小口角，不是挥拳的打斗或士兵冲去参加的战斗|a spat is a short quarrel with words, not a fight people jump into|spat 是简短的口角，不是人们冲进去的打斗|fray|the ay at the end, as in *pray*|结尾是 ay，同 *pray*
      strife|years of fighting between rival groups for control of a country|a family split for twenty years over a will|bitter distrust between two peoples after a war|strife is long, bitter conflict; a tiff is a short, small quarrel|strife 是长期激烈的冲突；tiff 是短暂的小口角|a tiff is a short, small quarrel, not years of bitter conflict|tiff 是短暂的小口角，不是多年的激烈冲突|a spat is a short quarrel over something small, not long years of bitter conflict|spat 是为小事发生的简短口角，不是多年的激烈冲突|strife|the long i and the silent e at the end|长音 i，结尾 e 不发音
      agitate|a patient who must stay calm and not be upset by bad news|workers campaigning for better pay with marches|a washing machine shaking clothes in soapy water|agitate means to upset someone, to campaign for change, or to shake; bicker means to argue about small things|agitate 是使人不安、为变革鼓动或搅动；bicker 是为小事斗嘴|bicker means to argue about small things, and it takes no person or clothes after it|bicker 是为小事斗嘴，后面不接人或衣物|console means to comfort someone, the opposite of upsetting them, and it has nothing to do with campaigns or shaking|console 是安慰人，和使人不安相反，也与鼓动或搅动无关|ag · i · tate|the soft g and the -ate ending|g 发软音，结尾是 -ate
      vehement|a woman shouting that she will never let the trees be cut down|a man banging the table as he denies taking the money|villagers holding angry meetings against a new road every week|vehement means showing strong, forceful feeling; tentative means unsure and hesitant|vehement 是情绪强烈的；tentative 是犹豫不决的|tentative means unsure and hesitant, the opposite of shouting and banging the table|tentative 是犹豫、不确定的，和大喊、拍桌子正好相反|brutal means savagely violent or harsh, not full of strong feeling in words|brutal 是残暴或严酷的，不是言辞中情绪强烈|ve · he · ment|the silent h in the middle|中间的 h 不发音
    `,
  },
);

const schemes = batch(
  "words-of-schemes-and-tricks",
  ["Words of Schemes and Tricks", "计谋与把戏的词"],
  ["making things up, clever plans and tricks to fool or distract", "编造、巧妙计划与骗人或转移注意的把戏"],
  `
  invent|to create something new; to make up a false story|发明；编造|Who was the first person to ___ the telephone, a machine that no one had ever seen before?|Don't ___ excuses; just tell me the truth about why you were late.|On rainy days, the children liked to ___ new games with their own rules and names.|brew,divert|invented
  devise|to plan or invent by careful thought|设计，想出|We must ___ a careful plan to get everyone out of the building quickly if there is a fire.|The engineers worked for months to ___ a new tool for cleaning the inside of pipes.|Good teachers ___ tests that show whether pupils have really understood the lesson.|brew,divert|devised
  concoct|to make a dish by mixing; to invent a story|调制；编造|She managed to ___ a tasty soup from the odds and ends left in the fridge.|He tried to ___ an excuse about his dog eating his homework, but nobody believed him.|The boys would ___ wild stories about seeing bears, mixing bits of truth with plenty of made-up details.|divert,brew|concocted,concoction
  brew|to make beer or tea; to begin to develop|酿造；酝酿|Every morning Grandma would ___ a pot of strong tea and drink it by the window.|Dark clouds piled up over the hills, and we could tell a storm was starting to ___.|The monks still ___ beer in the old way, letting it ferment for weeks in wooden barrels.|concoct,conjure|brewed,brewery
  conjure|to make something appear as if by magic|变魔术；想象出|The magician seemed to ___ a white rabbit out of an empty hat.|The smell of pine trees can ___ up memories of Christmas at my grandparents' house.|With a wave of her wand, the fairy would ___ a golden coach out of thin air.|brew,contrive|conjured,conjurer
  contrive|to bring about by clever planning; to manage something difficult|设法；策划|She managed to ___ a meeting with the star by waiting at the stage door every night for a week.|The prisoners tried to ___ an escape, digging a tunnel with spoons for months.|He would somehow ___ to be late for every lesson, always with a clever new reason.|conjure,divert|contrived
  ruse|an action meant to deceive|诡计|The phone call about a fire was a ___: the burglars just wanted the family out of the house.|Pretending to be a delivery man was a ___ to get past the guard at the door.|She soon saw through his ___ of pretending to be ill to get out of the test.|gimmick,forgery|ruses
  gimmick|a trick meant to attract attention|噱头|The free plastic toy in every box is just a marketing ___ to make children beg for the cereal.|The singer's glowing suit was a ___ to grab attention, since her songs were nothing special.|The talk show relied on one silly ___—a talking dog puppet—to keep viewers watching.|ruse,forgery|gimmicks,gimmicky
  tactic|an action planned to achieve a goal|策略|The coach changed his ___ at half time, telling the players to defend deep and attack on the break.|Keeping the ball in the corner to run down the clock is a common ___ in the last minutes of a match.|Her ___ for winning the debate was simple: let her rival speak first, then pick apart every point.|gimmick,guideline|tactics,tactical
  divert|to change the direction of; to distract|使转向；转移注意|Police had to ___ the traffic down side streets after the crash blocked the main road.|While his friend tried to ___ the guard's attention, he slipped quietly through the gate.|Farmers dug a channel to ___ water from the river to their dry fields.|conjure,brew|diverted,diversion
  `,
  "context-clues",
  {
    intro: t(
      "To get into the castle, the thieves had to **devise** a plan: one would **divert** the guards while the others used a clever **ruse** to slip through the gate. These ten words help you talk about making things up, clever plans and tricks to fool or distract people.",
      "为了混进城堡，窃贼们必须想出（**devise**）一个计划：一个人引开（**divert**）守卫，其他人用一条巧妙的诡计（**ruse**）溜进大门。这十个词帮你谈论编造、巧妙的计划以及骗人或转移注意力的把戏。",
    ),
    watchOut: {
      meanings: t(
        "A **ruse** is a trick meant to fool someone, while a **gimmick** is a trick meant only to grab attention, such as a free toy in a cereal box.",
        "**ruse** 是用来骗人的诡计；**gimmick** 只是用来吸引眼球的噱头，比如麦片盒里送的玩具。",
      ),
      use: t(
        "You **brew** tea or beer, but you **concoct** a dish by mixing odd things together—and you can also concoct an excuse, while you cannot brew one.",
        "泡茶、酿啤酒用 **brew**；把各种东西混在一起做菜用 **concoct**——编借口也可以用 concoct，却不能用 brew。",
      ),
      spelling: t(
        "**Devise** the verb ends in -ise, unlike the noun *device*, and **gimmick** has a double m and ends in ck.",
        "动词 **devise** 以 -ise 结尾，和名词 *device* 不同；**gimmick** 双写 m，以 ck 结尾。",
      ),
    },
    notes: `
      invent|the first person to create the telephone|someone making up excuses instead of telling the truth|children making up new games with their own rules on rainy days|invent means to create something new or make up a story; devise means to plan something carefully|invent 是发明新东西或编造故事；devise 是精心设计|brew means to make tea or beer, or for trouble to start to grow, not to create a new machine or make up excuses and games|brew 是泡茶、酿酒或麻烦逐渐酝酿，不是发明机器或编借口、编游戏|divert means to change the direction of something, not to create something new|divert 是改变方向，不是创造新东西|in · vent|the -ent ending|结尾是 -ent
      devise|a careful plan for getting everyone out in a fire|engineers working for months on a tool for cleaning pipes|teachers designing tests to check real understanding|devise means to work out a plan or a tool by careful thought; invent means to create something new|devise 是经过周密思考想出计划或工具；invent 是发明新东西|brew means to make tea or beer, not to work out a plan or a tool by careful thought|brew 是泡茶或酿酒，不是周密地想出计划或工具|divert means to change the direction of traffic or water, not to work out a plan or a test|divert 是改变交通或水流的方向，不是想出计划或测验|de · vise|the -ise ending of the verb; the noun device ends in -ice|动词结尾是 -ise；名词 device 结尾是 -ice
      concoct|a soup made from odds and ends in the fridge|a made-up excuse about a dog eating homework|wild stories mixing a little truth with made-up details|concoct means to mix things into a dish or to make up a story; brew means to make tea or beer|concoct 是把东西混合做成菜或编造故事；brew 是泡茶或酿酒|divert means to change the direction of something, not to mix a dish or make up a story|divert 是改变方向，不是调制菜肴或编故事|brew means to make tea or beer by soaking or fermenting, and it is not used for soup, excuses or stories|brew 是泡茶或酿酒，不用于做汤、编借口或编故事|con · coct|the two c's and the ct at the end|两个 c，结尾是 ct
      brew|a grandmother making a pot of strong tea each morning|a storm starting to build over the hills|monks making beer in wooden barrels the old way|brew means to make tea or beer, or for something bad to begin to develop; concoct means to mix a dish or make up a story|brew 是泡茶、酿酒或坏事酝酿；concoct 是调制菜肴或编造故事|concoct means to mix odd things into a dish or make up a story, not to make tea or beer or for a storm to build|concoct 是混合东西做菜或编故事，不是泡茶、酿酒或暴风雨酝酿|conjure means to make something appear as if by magic, not to make tea or beer|conjure 是像变魔术一样变出东西，不是泡茶或酿酒|brew|the ew, as in *new*|ew 读音同 *new*
      conjure|a magician pulling a rabbit out of an empty hat|the smell of pine bringing back Christmas memories|a fairy making a golden coach appear out of thin air|conjure means to make something appear as if by magic; contrive means to make something happen by clever planning|conjure 是像变魔术一样变出来；contrive 是用巧计设法促成|brew means to make tea or beer, not to make a rabbit or a coach appear by magic|brew 是泡茶或酿酒，不是用魔法变出兔子或马车|contrive means to make something happen by clever planning, not by magic out of thin air|contrive 是用巧计促成某事，不是凭空用魔法变出来|con · jure|the -jure ending, said like *jer*|结尾 -jure 读作 jer
      contrive|a fan waiting at a stage door all week to meet a star|prisoners digging a tunnel with spoons to escape|a boy who manages to be late for every lesson|contrive means to manage something by clever planning; conjure means to make something appear by magic|contrive 是用巧计设法做到；conjure 是用魔法变出|conjure means to make something appear as if by magic, not to manage a meeting or an escape by careful scheming|conjure 是像魔术一样变出来，不是精心谋划促成会面或越狱|divert means to change the direction of something, not to manage a meeting or an escape|divert 是改变方向，不是设法促成会面或越狱|con · trive|the long i and the silent e at the end|长音 i，结尾 e 不发音
      ruse|a fake fire call to get a family out of their house|a man pretending to deliver a parcel to get past a guard|a boy pretending to be ill to get out of a test|a ruse is a trick meant to fool someone; a gimmick is a trick to grab attention|ruse 是用来骗人的诡计；gimmick 是吸引眼球的噱头|a gimmick is a trick to grab attention, not a trick to fool someone into letting you in or out|gimmick 是吸引眼球的噱头，不是骗人放你进出的诡计|a forgery is a fake document or painting, not a trick of pretending|forgery 是伪造的文件或画作，不是假装出来的诡计|ruse|the u, as in *rule*, and the s said like z|u 读音同 *rule*，s 读作 z
      gimmick|a free toy in a cereal box to make children beg for it|a glowing suit worn to grab attention|a talking dog puppet used to keep viewers watching|a gimmick is a trick to grab attention; a ruse is a trick meant to fool someone|gimmick 是吸引眼球的噱头；ruse 是骗人的诡计|a ruse is a trick to fool someone into doing something, not a fun extra to grab attention|ruse 是骗人去做某事的诡计，不是吸引注意的花招|a forgery is a fake copy of a document or painting, not a trick to grab attention|forgery 是伪造的文件或画作，不是吸引注意的花招|gim · mick|the double m and the ck at the end|双写 m，结尾是 ck
      tactic|a coach changing his team's plan at half time|keeping the ball in the corner to run down the clock|a debater letting her rival speak first, then attacking every point|a tactic is a planned action to reach a goal; a gimmick is a trick to grab attention|tactic 是为达到目标而计划的行动；gimmick 是吸引眼球的噱头|a gimmick is a trick to grab attention, not a plan for winning a match or a debate|gimmick 是吸引眼球的噱头，不是赢得比赛或辩论的计划|a guideline is a general rule to follow, not a clever plan for beating a rival|guideline 是要遵守的一般准则，不是战胜对手的妙计|tac · tic|the -ic ending; the plural is tactics|结尾是 -ic；复数是 tactics
      divert|police sending traffic down side streets after a crash|a boy distracting a guard so his friend can slip past|farmers digging a channel to send river water to their fields|divert means to change the direction of something or to distract; conjure means to make something appear by magic|divert 是改变方向或转移注意；conjure 是用魔法变出|conjure means to make something appear as if by magic, not to change the direction of traffic, water or attention|conjure 是像魔术一样变出来，不是改变交通、水流或注意力的方向|brew means to make tea or beer, not to change the direction of something|brew 是泡茶或酿酒，不是改变方向|di · vert|the word vert after di-|di- 后面接 vert
    `,
  },
);

const cruelty = batch(
  "words-of-cruelty",
  ["Words of Cruelty", "残忍的词"],
  ["fierce, violent, unkind and unpleasant", "凶猛、暴力、无情与讨厌"],
  `
  cruel|willfully causing pain or suffering|残忍的|It is ___ to keep a dog chained in a yard all day with no water or shade.|The older boys were ___ to the new pupil, hiding his glasses on purpose and laughing as he cried.|Fate was ___ to the young singer: she lost her voice the week before her first big concert.|vehement,ferocious|cruelly,cruelty
  brutal|savagely violent; harsh|残暴的；严酷的|The ___ winter lasted until May, and the frost killed half the farmer's sheep.|With ___ honesty, she told him straight out that his song was terrible.|The ___ heat of the desert, over fifty degrees by noon, killed three of the camels.|sadistic,tentative|brutally,brutality
  savage|fierce and violent; uncivilized|野蛮的|The ___ dog leapt over the fence and bit the postman's leg so badly that he needed stitches.|The tiger's ___ attack, all teeth and claws at the throat, left the deer dead in seconds.|In their ___ attack, the mob beat the man with sticks and left him for dead in the street.|obnoxious,tentative|savagely
  vicious|deliberately cruel or violent; dangerous|恶毒的；凶残的|The ___ lie, made up on purpose to ruin her good name, spread round the school.|The ___ gang kicked the boy again and again, even after he had fallen to the ground.|Keep away from that ___ dog; it has already bitten two children and must stay on its chain.|obnoxious,tentative|viciously
  ferocious|savagely fierce or violent|凶猛的|The ___ lion charged at the jeep, roaring and showing its huge teeth.|The wind was so ___ that it tore the roofs off houses and threw trees across the road.|The two armies fought a ___ battle for the hill, attacking again and again for three days.|heartless,tentative|ferociously,ferocity
  heartless|showing no pity or kindness|无情的|How ___ of you to leave the puppy out in the rain all night!|The ___ landlord threw the sick old woman out into the snow because she was one day late with the rent.|It was a ___ thing to say to a girl whose mother had just died: "Stop crying, it's no big deal."|vehement,gullible|
  merciless|showing no mercy|毫不留情的|The ___ sun beat down on the desert, and there was no shade anywhere for miles.|The invading army was ___, sparing no one in the towns it captured.|The ___ champion kept on punching even when his opponent could barely stand.|tentative,vehement|mercilessly
  sadistic|getting pleasure from hurting others|虐待狂的|The ___ guard enjoyed hurting the prisoners and laughed whenever they screamed.|Even as a boy he showed ___ tendencies, pulling the legs off spiders just to watch them squirm.|The bully took ___ pleasure in twisting the younger boys' arms until they begged him to stop.|obnoxious,gullible|sadist,sadism
  inflict|to cause something unpleasant to be suffered|施加(痛苦)|Storms can ___ great damage on towns along the coast, smashing boats and flooding streets.|Don't ___ pain on others just because you are hurting yourself.|The home team managed to ___ a heavy defeat on the champions, winning five to nil.|console,divert|inflicted
  obnoxious|extremely unpleasant or rude|讨厌的|He was loud and ___ at the party, shouting rude jokes and pushing in front of everyone at the food table.|The ___ smell of rotten eggs filled the room, and we all held our noses.|Stop being ___ and turn your music down; the neighbours have complained three times tonight.|heartless,sadistic|
  `,
  "context-clues",
  {
    intro: t(
      "In the old story, a **heartless** king and his **sadistic** guards would **inflict** pain on anyone who spoke against them, until a **ferocious** storm sank their ships. These ten words help you talk about people, animals and weather that are fierce, violent, unkind or simply unpleasant.",
      "在那个古老的故事里，一个无情的（**heartless**）国王和他那些以折磨人为乐的（**sadistic**）卫兵，会给任何反对他们的人施加（**inflict**）痛苦，直到一场凶猛的（**ferocious**）风暴击沉了他们的船。这十个词帮你描述凶猛、暴力、无情或只是令人讨厌的人、动物和天气。",
    ),
    watchOut: {
      meanings: t(
        "**Sadistic** means enjoying hurting others, while **heartless** means simply not caring about someone's pain; **obnoxious** is only rude and unpleasant, not violent.",
        "**sadistic** 是以伤害别人为乐；**heartless** 只是对别人的痛苦漠不关心；**obnoxious** 只是粗鲁讨厌，并不暴力。",
      ),
      use: t(
        "You **inflict** pain or damage **on** someone, always with on, and a person is **cruel to** someone, with to.",
        "**inflict** 痛苦或损害要用 **on** 某人；说某人对别人残忍则是 **cruel to**，用 to。",
      ),
      spelling: t(
        "**Vicious** and **ferocious** both end in -cious, and **merciless** changes the y of *mercy* to i before -less.",
        "**vicious** 和 **ferocious** 都以 -cious 结尾；**merciless** 把 *mercy* 的 y 变成 i 再加 -less。",
      ),
    },
    notes: `
      cruel|a dog chained all day with no water or shade|older boys hiding a pupil's glasses and laughing as he cries|bad luck that takes a singer's voice before her big concert|cruel means causing pain or suffering on purpose or without care; ferocious means fierce and violent like a wild animal|cruel 是故意或不顾他人地造成痛苦；ferocious 是像野兽一样凶猛|vehement means full of strong feeling in what you say, not causing pain or suffering|vehement 是言辞中情绪强烈，不是造成痛苦|ferocious means fierce and violent, like a charging lion, not quietly causing suffering by neglect, mean tricks or bad luck|ferocious 是像冲过来的狮子那样凶猛，不是因忽视、恶作剧或厄运造成痛苦|cru · el|the ue before the l|l 前是 ue
      brutal|a winter whose frost kills half the sheep|plain honesty that tells a man his song is terrible|desert heat that kills camels|brutal means savagely violent or very harsh, and it can describe weather or honesty; sadistic describes a person who enjoys hurting others|brutal 是残暴或极其严酷的，可以形容天气或坦率；sadistic 形容以伤人为乐的人|sadistic means getting pleasure from hurting others, so it describes a person, not a winter, the heat or honesty|sadistic 是以伤人为乐，形容人，不形容冬天、炎热或坦率|tentative means unsure and hesitant, the opposite of harsh frost, plain honesty and killing heat|tentative 是犹豫不定的，和严寒、直言、酷热正好相反|bru · tal|the -al ending|结尾是 -al
      savage|a dog biting a postman so badly he needs stitches|a tiger tearing at a deer's throat|a mob beating a man and leaving him for dead|savage means fierce, wild and violent; vicious adds that the harm is meant and dangerous|savage 是野蛮凶猛的；vicious 更强调蓄意的、危险的伤害|obnoxious means rude and annoying, not tearing, biting or beating someone|obnoxious 是粗鲁讨厌，不是撕咬或殴打|tentative means unsure and hesitant, not a wild, violent attack|tentative 是犹豫不定的，不是野蛮凶猛的攻击|sav · age|the -age ending, as in *cabbage*|结尾是 -age，同 *cabbage*
      vicious|a lie made up on purpose to ruin a girl's name|a gang kicking a boy again and again on the ground|a dog that has already bitten two children|vicious means meaning to hurt or being dangerous; obnoxious means only rude and unpleasant|vicious 是蓄意伤人或危险的；obnoxious 只是粗鲁讨厌|obnoxious means rude and annoying, not made up on purpose to ruin someone or kicking and biting|obnoxious 是粗鲁讨厌，不是蓄意毁人名誉或踢人、咬人|tentative means unsure and hesitant, not meant to do harm|tentative 是犹豫不定的，不是存心伤害|vi · cious|the -cious ending|结尾是 -cious
      ferocious|a lion charging at a jeep and roaring|wind tearing roofs off houses|armies attacking again and again for three days|ferocious means savagely fierce and full of force; heartless means showing no pity|ferocious 是凶猛有力的；heartless 是毫无怜悯的|heartless means showing no pity or kindness, which is about a person's feelings, not a roaring lion, a wild wind or a fierce battle|heartless 是对人毫无怜悯，不形容咆哮的狮子、狂风或激战|tentative means unsure and hesitant, the opposite of charging, tearing and attacking again and again|tentative 是犹豫不定的，和冲锋、撕扯、反复进攻正好相反|fe · ro · cious|the -cious ending|结尾是 -cious
      heartless|leaving a puppy out in the rain all night|a landlord throwing a sick old woman into the snow|telling a girl whose mother has died to stop crying|heartless means showing no pity or kindness; sadistic means enjoying hurting others|heartless 是毫无怜悯的；sadistic 是以伤人为乐的|vehement means full of strong feeling in words, not lacking pity for someone who suffers|vehement 是言辞情绪强烈，不是对受苦的人毫无怜悯|gullible means easily fooled, not lacking pity for a puppy, a sick woman or a crying girl|gullible 是容易上当的，不是对小狗、病妇或哭泣的女孩毫无怜悯|heart · less|heart plus -less|heart 加 -less
      merciless|a desert sun with no shade for miles|an army that spares no one|a champion punching an opponent who can barely stand|merciless means showing no mercy and never letting up; brutal means savagely violent or harsh|merciless 是毫不留情、从不手软的；brutal 是残暴严酷的|tentative means unsure and hesitant, not an army or a fighter that never lets up|tentative 是犹豫不定的，不是毫不手软的军队或拳手|vehement means full of strong feeling in words, not a sun beating down or punches that never stop|vehement 是言辞情绪强烈，不形容烈日或不停的拳头|mer · ci · less|mercy with y changed to i before -less|mercy 的 y 变 i 再加 -less
      sadistic|a guard who laughs when prisoners scream|a boy who pulls legs off spiders to watch them squirm|a bully who enjoys twisting arms until boys beg|sadistic means getting pleasure from hurting others; heartless means simply not caring about their pain|sadistic 是以伤人为乐；heartless 只是不在乎别人的痛苦|obnoxious means rude and annoying, not enjoying someone's pain|obnoxious 是粗鲁讨厌，不是享受别人的痛苦|gullible means easily fooled, not enjoying hurting people or creatures|gullible 是容易上当的，不是以伤害人或动物为乐|sa · dis · tic|the -ic ending|结尾是 -ic
      inflict|storms smashing boats and flooding streets|a hurt person causing pain to others|a team giving the champions a heavy defeat|inflict means to make someone suffer something unpleasant, always with on; console means to comfort someone|inflict 是让人遭受痛苦，后接 on；console 是安慰|console means to comfort someone who is sad, the opposite of causing damage, pain or defeat|console 是安慰难过的人，和造成损害、痛苦或失败正好相反|divert means to change the direction of something, and it is not used with damage, pain or defeat on someone|divert 是改变方向，不和“把损害、痛苦或失败加于某人”连用|in · flict|the -ict ending|结尾是 -ict
      obnoxious|a man shouting rude jokes and pushing in at a party|the smell of rotten eggs that makes everyone hold their noses|loud music that makes the neighbours complain three times|obnoxious means extremely rude or unpleasant; heartless means showing no pity|obnoxious 是极其粗鲁或令人讨厌的；heartless 是毫无怜悯的|heartless means showing no pity for someone who suffers, not being loud and rude or smelling bad|heartless 是对受苦者毫无怜悯，不是吵闹粗鲁或气味难闻|sadistic means enjoying hurting others, not rude jokes, a bad smell or loud music|sadistic 是以伤人为乐，不是粗俗玩笑、难闻气味或吵闹音乐|ob · nox · ious|the x and the -ious ending|中间是 x，结尾是 -ious
    `,
  },
);

const mess = batch(
  "words-of-mess-and-dirt",
  ["Words of Mess and Dirt", "凌乱与肮脏的词"],
  ["untidy people and places, careless work and filth", "不整洁的人和地方、马虎的工作与污秽"],
  `
  messy|untidy or dirty|凌乱的|After the party the kitchen was ___, with plates, cups and crumbs everywhere.|Painting with your fingers is fun but ___, so put on an old shirt before you start.|Eating spaghetti with your hands is ___, and soon there was sauce all over his face and shirt.|disheveled,sordid|messier,messiest
  untidy|not neat or in order|不整洁的|Her handwriting is so ___ that the teacher cannot read half of her answers.|Your bedroom is ___: clothes on the floor, books on the bed and nothing in its place.|The garden looked ___ after the storm, with leaves and branches lying all over the lawn.|sordid,disheveled|
  sloppy|careless and messy; too loose|马虎的；松垮的|Your homework is ___: half the answers are rushed, with mistakes you could easily have avoided.|The ___ referee missed three fouls because he was not paying attention.|Careless, ___ work by the builders meant that the new roof leaked within a month.|disheveled,grimy|sloppily
  scruffy|shabby and untidy|邋遢的|He turned up to the interview in ___ old jeans with holes in the knees and a torn jacket.|The ___ little dog with tangled, matted fur followed us all the way home.|Students often look ___ in old sweaters and worn-out trainers, but nobody at college minds.|sordid,spotless|
  unkempt|having an untidy appearance; not cared for|蓬乱的|His hair was long and ___, as if he had not brushed it for weeks.|The ___ garden was full of weeds taller than a man, since no one had cared for it in years.|The tramp's ___ beard, tangled and grey, reached almost to his chest.|sordid,sloppy|
  disheveled|untidy in hair or clothes|衣衫不整的|She arrived ___ after running for the bus, her hair blown about and her shirt hanging out.|He woke up ___ on the sofa, his clothes creased and his hair sticking up.|The wind left the bride ___, with her veil twisted and her hair falling down.|sordid,sloppy|
  grimy|covered with dirt|满是污垢的|The ___ windows of the old factory, black with soot, let in hardly any light.|He wiped his ___ hands, black with oil from the engine, on a rag.|The miners came up from the pit with ___ faces, covered in coal dust.|disheveled,unkempt|grime
  grubby|dirty, especially from neglect|脏兮兮的|Wash your ___ hands before dinner; they are covered in mud from the garden.|The children's faces were ___ with chocolate and dirt after the picnic.|The ___ banknote she paid with was soft and grey from years of being passed from hand to hand.|disheveled,unkempt|
  filthy|disgustingly dirty; obscene|肮脏的；下流的|The toilets at the bus station were ___, and the smell made us feel sick.|Don't use ___ words like that in front of your little sister.|After the match on the muddy pitch, his kit was so ___ that it had to be washed twice.|disheveled,unkempt|filth
  sordid|involving immoral actions; dirty|卑鄙的；肮脏的|The newspaper revealed the ___ details of the bribes the minister had taken.|It was a ___ business of lies, cheating and stolen money from start to finish.|They lived in a ___ little room above a bar, with rats in the walls and broken windows.|disheveled,sloppy|
  `,
  "context-clues",
  {
    intro: t(
      "The detective was **scruffy** and **unkempt**, his desk was **messy** and his coffee cup was **grimy**, but he always solved the **sordid** cases that no one else could. These ten words help you talk about untidy people and places, careless work, dirt and wrongdoing.",
      "这位侦探邋里邋遢（**scruffy**），头发蓬乱（**unkempt**），桌上乱七八糟（**messy**），咖啡杯满是污垢（**grimy**），可那些别人破不了的卑劣（**sordid**）案子，他总能破。这十个词帮你描述不整洁的人和地方、马虎的工作、污垢和丑事。",
    ),
    watchOut: {
      meanings: t(
        "**Grimy** means covered in a layer of dirt or soot, while **sordid** means morally dirty, as in a story of bribes and lies.",
        "**grimy** 是蒙着一层污垢或煤灰；**sordid** 是道德上肮脏的，比如贿赂和谎言的丑事。",
      ),
      use: t(
        "**Disheveled** and **unkempt** describe hair, clothes or a garden, so you would not call handwriting disheveled—it is **untidy**, and careless work is **sloppy**.",
        "**disheveled** 和 **unkempt** 形容头发、衣着或花园，字迹潦草不能说 disheveled，而要说 **untidy**；做事马虎则是 **sloppy**。",
      ),
      spelling: t(
        "**Unkempt** ends in -mpt, **disheveled** has one l before -ed in American spelling, and **scruffy** and **sloppy** double their f and p.",
        "**unkempt** 以 -mpt 结尾；美式拼写的 **disheveled** 在 -ed 前只有一个 l；**scruffy** 和 **sloppy** 分别双写 f 和 p。",
      ),
    },
    notes: `
      messy|a kitchen with plates, cups and crumbs everywhere after a party|finger painting that needs an old shirt|spaghetti eaten by hand with sauce all over a face|messy means untidy or dirty, often from a job or a meal; untidy means simply not in order|messy 是凌乱或弄脏的，常因做事或吃饭造成；untidy 只是不整齐|disheveled describes a person's hair or clothes, not a kitchen, a painting game or a meal|disheveled 形容人的头发或衣着，不形容厨房、画画或吃饭|sordid means immoral or sleazy, not covered in crumbs, paint or sauce|sordid 是卑劣下流的，不是沾满面包屑、颜料或酱汁|mess · y|mess plus -y, keeping the double s|mess 加 -y，保留双写 s
      untidy|handwriting so poor the teacher cannot read it|a bedroom with clothes on the floor and nothing in its place|a lawn covered in leaves and branches after a storm|untidy means not neat or in order; sloppy means careless|untidy 是不整齐的；sloppy 是马虎的|sordid means immoral or sleazy, not handwriting, a bedroom or a lawn out of order|sordid 是卑劣下流的，不形容字迹、卧室或草坪凌乱|disheveled describes a person's hair or clothes, not handwriting, a room or a lawn|disheveled 形容人的头发或衣着，不形容字迹、房间或草坪|un · ti · dy|the prefix un- before tidy|tidy 前加 un-
      sloppy|homework with rushed answers and easy mistakes|a referee who misses fouls because he is not paying attention|builders whose careless work makes a roof leak|sloppy means careless and done without attention; messy means untidy or dirty|sloppy 是马虎、不用心的；messy 是凌乱或弄脏的|disheveled means having untidy hair or clothes, not doing work or a job carelessly|disheveled 是头发或衣着不整，不是做事马虎|grimy means covered in dirt, not careless or full of mistakes|grimy 是满是污垢，不是马虎或错误百出|slop · py|the double p before -y|-y 前双写 p
      scruffy|a man at an interview in torn old jeans and a jacket|a little dog with tangled, matted fur|students in old sweaters and worn-out trainers|scruffy means shabby and untidy in how someone or something looks; sordid means immoral|scruffy 是外表破旧邋遢的；sordid 是卑劣的|sordid means immoral or sleazy, not wearing old, worn-out clothes or having matted fur|sordid 是卑劣下流的，不是穿着破旧衣服或毛发纠结|spotless means perfectly clean, the opposite of torn jeans, matted fur and worn-out trainers|spotless 是一尘不染的，和破牛仔裤、纠结的毛、旧球鞋正好相反|scruf · fy|the double f before -y|-y 前双写 f
      unkempt|long hair that has not been brushed for weeks|a garden full of weeds that no one has cared for|a tramp's tangled grey beard|unkempt means untidy because it has not been cared for, used for hair, beards and gardens; disheveled means messed up for a moment|unkempt 是因无人打理而凌乱，用于头发、胡子和花园；disheveled 是一时被弄乱|sordid means immoral or sleazy, not hair, a garden or a beard left uncared for|sordid 是卑劣下流的，不形容无人打理的头发、花园或胡子|sloppy means careless in doing work, not hair, a garden or a beard left to grow wild|sloppy 是做事马虎，不形容任其乱长的头发、花园或胡子|un · kempt|the -mpt ending|结尾是 -mpt
      disheveled|a woman with blown hair and her shirt out after running for a bus|a man waking on a sofa with creased clothes|a bride whose veil and hair are blown about by the wind|disheveled means having hair and clothes in disorder, often for a short time; unkempt means long uncared for|disheveled 是头发衣着一时凌乱；unkempt 是长期无人打理|sordid means immoral or sleazy, not having blown hair or creased clothes|sordid 是卑劣下流的，不是头发被吹乱或衣服起皱|sloppy means careless in work, not messed up by running, sleeping or the wind|sloppy 是做事马虎，不是因跑步、睡觉或风吹而凌乱|di · shev · eled|the sh, and one l before -ed in American spelling|中间是 sh，美式拼写在 -ed 前只有一个 l
      grimy|factory windows black with soot|hands black with engine oil|miners' faces covered in coal dust|grimy means covered in a layer of dirt, soot or oil; grubby means a little dirty from not being washed|grimy 是蒙着一层污垢、煤灰或油；grubby 是因没洗而有点脏|disheveled describes untidy hair or clothes, not windows, hands or faces black with dirt|disheveled 形容头发或衣着凌乱，不形容被污垢弄黑的窗户、手或脸|unkempt means not cared for, like wild hair or a weedy garden, not covered in soot, oil or coal dust|unkempt 是无人打理的，如乱发或杂草丛生的花园，不是蒙满煤灰、油污|gri · my|grime with the e dropped before -y|grime 去 e 加 -y
      grubby|hands covered in mud from the garden|children's faces dirty with chocolate after a picnic|a soft, grey banknote passed from hand to hand for years|grubby means rather dirty, usually from not being washed; filthy means disgustingly dirty|grubby 是因没洗而脏兮兮的；filthy 是脏得令人恶心|disheveled describes untidy hair or clothes, not hands, faces or a banknote that are dirty|disheveled 形容头发或衣着凌乱，不形容脏手、脏脸或脏钞票|unkempt means not cared for, like hair or a garden, not muddy hands or a dirty banknote|unkempt 是无人打理的头发或花园，不是沾泥的手或脏钞票|grub · by|the double b before -y|-y 前双写 b
      filthy|station toilets whose smell makes people feel sick|rude words not to be used in front of a little sister|football kit so muddy it is washed twice|filthy means disgustingly dirty, or rude and obscene; grubby means only a little dirty|filthy 是脏得恶心或下流的；grubby 只是有点脏|disheveled means untidy in hair or clothes, not disgustingly dirty or rude|disheveled 是头发或衣着凌乱，不是脏得恶心或粗俗下流|unkempt means not cared for, not disgusting toilets, rude words or mud-soaked kit|unkempt 是无人打理的，不形容恶心的厕所、脏话或满是泥的球衣|fil · thy|filth plus -y|filth 加 -y
      sordid|a minister's bribes revealed by a newspaper|a business of lies, cheating and stolen money|a room above a bar with rats and broken windows|sordid means involving immoral acts, or dirty and sleazy; grimy means only covered in dirt|sordid 是涉及丑事的或肮脏不堪的；grimy 只是满是污垢|disheveled means untidy in hair or clothes, not bribes, cheating or a rat-filled room|disheveled 是头发或衣着凌乱，不形容贿赂、欺诈或满是老鼠的房间|sloppy means careless in work, not wicked or sleazy|sloppy 是做事马虎，不是卑劣下流|sor · did|the -id ending|结尾是 -id
    `,
  },
);

const cleaning = batch(
  "words-of-cleaning-and-order",
  ["Words of Cleaning and Order", "清洁与整齐的词"],
  ["being neat and spotless and the jobs that make it so", "整洁一尘不染以及做到这点的活儿"],
  `
  tidy|neat and in order; to make so|整洁的；整理|Keep your desk ___, with the pens in their pot and the books in one pile.|Mum likes the living room ___, so every toy goes back in its box before bed.|He is a ___ person who folds his clothes and puts everything back in its place.|sanitary,sloppy|tidied,tidier,tidiness
  neat|arranged in an orderly way; clever|整齐的；巧妙的|Her handwriting is small and ___, with every letter the same size.|What a ___ idea: using an old shoe box as a bed for the kitten!|The books stood in ___ rows on the shelf, sorted by colour.|sanitary,hygienic|neatly,neater
  orderly|neatly arranged; well behaved|有序的|The pupils filed out of the hall in ___ lines, without pushing or shouting.|The crowd stayed calm and ___, waiting patiently in the queue for the gates to open.|The march was peaceful and ___, with no trouble from start to finish.|sanitary,hygienic|
  spotless|perfectly clean|一尘不染的|After hours of cleaning, the kitchen was ___, without a single crumb or stain anywhere.|Nurses must wear ___ white uniforms with not one mark on them.|She keeps her car ___, washing and polishing it every Sunday morning.|grimy,scruffy|
  immaculate|perfectly clean, neat or tidy; free from flaws|整洁无瑕的|The soldier's uniform was ___, with every button shining and every crease sharp.|Her performance was ___: she did not play a single wrong note all evening.|The old car is in ___ condition, without one scratch, as if it had just left the factory.|grubby,sloppy|immaculately
  hygienic|clean and likely to keep away disease|卫生的|Using the same towel for every patient is not ___, because it spreads germs.|Food must be prepared in ___ conditions to keep away the germs that cause illness.|It is more ___ to cough into your elbow than into your hand, because fewer germs reach the things you touch.|messy,sloppy|
  sanitary|relating to health and cleanliness; clean|卫生的|Poor ___ conditions in the camp, with no clean water or toilets, spread disease quickly.|The city's ___ engineers built new sewers so that dirty water no longer flowed into the river.|Health inspectors closed the kitchen because it was not ___, with rats and rotting food everywhere.|orderly,neat|
  wipe|to clean or dry by rubbing|擦|Use a damp cloth to ___ the crumbs off the table.|She used a tissue to ___ the tears from her eyes.|Let me ___ the glasses dry with this towel before I put them away.|rinse,scrub|wiped
  rinse|to wash with clean water to remove soap or dirt|冲洗|Wash the plates in soapy water, then ___ them under the tap to get the soap off.|After brushing your teeth, ___ your mouth with water and spit it out.|After swimming in the sea, ___ the salt out of your hair with fresh water.|wipe,scrub|rinsed
  scrub|to rub hard to clean|擦洗|She had to ___ the burnt pots with a wire brush for twenty minutes to get them clean.|On his knees, he had to ___ the kitchen floor with a hard brush and hot soapy water.|Before an operation, surgeons ___ their hands and arms hard with a small brush.|wipe,rinse|scrubbed
  `,
  "context-clues",
  {
    intro: t(
      "Before the inspectors came, the cooks had to **scrub** the floor, **rinse** every pan and **wipe** down the counters until the kitchen was **spotless** and **hygienic**. These ten words help you talk about being neat, clean and safe from germs, and the jobs that make things so.",
      "检查员来之前，厨师们得擦洗（**scrub**）地板、冲洗（**rinse**）每口锅、擦（**wipe**）净台面，直到厨房一尘不染（**spotless**）、干净卫生（**hygienic**）。这十个词帮你谈论整齐、清洁、远离病菌，以及做到这些的活儿。",
    ),
    watchOut: {
      meanings: t(
        "**Hygienic** and **sanitary** are about keeping germs and disease away, while **tidy** and **orderly** are about things being in their proper place.",
        "**hygienic** 和 **sanitary** 讲的是远离病菌和疾病；**tidy** 和 **orderly** 讲的是东西各归其位。",
      ),
      use: t(
        "You **wipe** with a cloth, **rinse** with clean water and **scrub** hard with a brush.",
        "用布擦是 **wipe**，用清水冲是 **rinse**，用刷子使劲刷是 **scrub**。",
      ),
      spelling: t(
        "**Immaculate** has a double m and one c, and **hygienic** starts with hy- and has ie in the middle.",
        "**immaculate** 双写 m，只有一个 c；**hygienic** 以 hy- 开头，中间是 ie。",
      ),
    },
    notes: `
      tidy|a desk with pens in their pot and books in one pile|a living room where every toy goes back in its box|a person who folds his clothes and puts everything away|tidy means neat, with everything in its place; spotless means perfectly clean|tidy 是整齐、东西各归其位；spotless 是一尘不染|sanitary is about health and keeping germs away, not pens, toys and clothes put in their places|sanitary 讲的是健康和防菌，不是笔、玩具、衣服各归其位|sloppy means careless and messy, the opposite of keeping everything in its place|sloppy 是马虎凌乱的，和东西各归其位正好相反|ti · dy|the -dy ending; the y turns to i in tidier|结尾是 -dy；tidier 中 y 变 i
      neat|small handwriting with every letter the same size|using a shoe box as a bed for a kitten|books standing in rows sorted by colour|neat means arranged in a careful, orderly way, or clever; tidy means put away in its place|neat 是整齐有序的，也可指巧妙的；tidy 是收拾得井井有条|sanitary is about health and dirty water, not handwriting, clever ideas or rows of books|sanitary 讲的是健康与污水，不形容字迹、妙主意或成排的书|hygienic means clean enough to keep germs away, not even letters, a clever idea or books in rows|hygienic 是干净得能防菌，不形容整齐的字母、巧妙的主意或成排的书|neat|the ea, as in *seat*|ea 读音同 *seat*
      orderly|pupils leaving a hall in lines without pushing|a calm crowd waiting patiently in a queue|a peaceful march with no trouble|orderly means well arranged or well behaved; tidy is used more for rooms and desks|orderly 是秩序井然或守规矩的；tidy 多用于房间和书桌|sanitary is about health and cleanliness, not people walking in lines or waiting calmly|sanitary 讲健康卫生，不形容人排队走或安静等候|hygienic means clean enough to keep germs away, not a crowd or a march that behaves well|hygienic 是干净防菌的，不形容守秩序的人群或游行|or · der · ly|order plus -ly|order 加 -ly
      spotless|a kitchen without a single crumb or stain|white uniforms with not one mark|a car washed and polished every Sunday|spotless means perfectly clean, with no mark at all; tidy means in order|spotless 是一点污渍都没有；tidy 是整齐有序|grimy means covered in dirt, the opposite of having no crumb, mark or stain|grimy 是满是污垢的，和没有一点碎屑、污点正好相反|scruffy means shabby and untidy, not perfectly clean and polished|scruffy 是破旧邋遢的，不是干干净净、擦得锃亮|spot · less|spot plus -less|spot 加 -less
      immaculate|a uniform with shining buttons and sharp creases|a performance with not a single wrong note|an old car with not one scratch|immaculate means perfect, with no dirt or flaw at all; spotless means only perfectly clean|immaculate 是完美无瑕的，没有污渍也没有瑕疵；spotless 只是一尘不染|grubby means rather dirty, not shining buttons, perfect playing or a car with no scratch|grubby 是脏兮兮的，不形容锃亮的纽扣、完美的演奏或没有划痕的车|sloppy means careless and full of mistakes, the opposite of a perfect uniform or a note-perfect show|sloppy 是马虎出错的，和完美的制服或一个音都不错的演出正好相反|im · mac · u · late|the double m and the one c|双写 m，只有一个 c
      hygienic|one towel used for every patient spreading germs|food prepared so that germs are kept away|coughing into an elbow so fewer germs reach things|hygienic means clean enough to stop germs and disease; tidy means neat and in order|hygienic 是干净得能防止病菌和疾病；tidy 是整齐有序|messy means untidy or dirty, and it is not about whether germs are spread|messy 是凌乱或弄脏的，不涉及是否传播病菌|sloppy means careless in doing something, not about keeping germs away|sloppy 是做事马虎，与防菌无关|hy · gi · en · ic|hy- at the start and ie in the middle|开头是 hy-，中间是 ie
      sanitary|a camp with no clean water or toilets spreading disease|engineers building sewers to keep dirty water out of a river|a kitchen with rats and rotting food closed by inspectors|sanitary is about health, toilets, sewers and dirt that causes disease; hygienic is used more for habits and food|sanitary 多指与健康、厕所、下水道有关的卫生；hygienic 多用于习惯和食物|orderly means neatly arranged or well behaved, not about clean water, sewers or rats|orderly 是秩序井然的，与清洁水源、下水道或老鼠无关|neat means arranged in an orderly way or clever, not about disease, sewers or rotting food|neat 是整齐或巧妙的，与疾病、下水道或腐烂食物无关|san · i · tar · y|the -ary ending|结尾是 -ary
      wipe|a damp cloth clearing crumbs off a table|a tissue drying tears|a towel drying glasses|wipe means to clean or dry something by rubbing it lightly with a cloth; scrub means to rub hard with a brush|wipe 是用布轻轻擦；scrub 是用刷子使劲刷|rinse means to wash with clean water, not to rub with a cloth, a tissue or a towel|rinse 是用清水冲洗，不是用布、纸巾或毛巾擦|scrub means to rub hard with a brush, not to rub lightly with a cloth, a tissue or a towel|scrub 是用刷子使劲刷，不是用布、纸巾或毛巾轻擦|wipe|the long i and the silent e at the end|长音 i，结尾 e 不发音
      rinse|plates held under the tap to get the soap off|water swished round the mouth after brushing teeth|fresh water washing salt out of hair after a swim|rinse means to wash something with clean water to take off soap or dirt; wipe means to rub with a cloth|rinse 是用清水冲掉肥皂或污物；wipe 是用布擦|wipe means to rub with a cloth, not to wash with water from a tap|wipe 是用布擦，不是用水冲|scrub means to rub hard with a brush, not to wash soap or salt away with water|scrub 是用刷子使劲刷，不是用水冲掉肥皂或盐|rinse|the -se ending|结尾是 -se
      scrub|burnt pots cleaned with a wire brush|a floor cleaned on hands and knees with a hard brush|surgeons cleaning their hands and arms hard before an operation|scrub means to rub hard, usually with a brush; wipe means to rub lightly|scrub 是用力刷洗；wipe 是轻轻擦|wipe means to rub lightly with a cloth, not to rub hard with a brush|wipe 是用布轻擦，不是用刷子使劲刷|rinse means to wash with clean water, not to rub hard with a brush|rinse 是用清水冲洗，不是用刷子使劲刷|scrub|the scr at the start|开头是 scr
    `,
  },
);

const wealth = batch(
  "words-of-rich-and-poor",
  ["Words of Rich and Poor", "贫富的词"],
  ["having money, making money, saving it and spending a lot", "有钱、赚钱、省钱与大手大脚"],
  `
  wealthy|having a great deal of money|富有的|The ___ family owned three houses, a yacht and a private plane.|Her uncle became ___ after selling his company for millions.|Only ___ people can live in that street, where the smallest house costs ten million.|affordable,costly|wealthier
  prosperous|successful in material terms; thriving|繁荣的|The town grew ___ after gold was found, with new shops, banks and hotels opening every month.|He was a ___ farmer, with fields stretching for miles and a big new house.|We wish you a happy and ___ new year, with good business and plenty of money.|thrifty,broke|
  profitable|yielding profit|有利可图的|The bakery is very ___: it earns twice what it spends each month.|Selling ice cream on the beach is ___ in summer, but in winter you earn nothing.|The deal turned out to be ___, earning the company ten million in its first year.|thrifty,extravagant|profitably
  lucrative|producing a great deal of profit|赚钱的|Football is a ___ career for the top players, who earn millions every year.|She left teaching for a ___ job in banking that paid three times as much.|Selling phone cases online proved ___, earning him enough to buy a flat in two years.|thrifty,broke|
  thrifty|careful with money|节俭的|My ___ grandmother saves every plastic bag and never buys anything that is not on sale.|Being ___, he mended his old shoes instead of buying new ones.|Like any ___ shopper, she compares prices in three shops before buying anything.|broke,extravagant|thrift
  extravagant|spending too much; excessive|奢侈的|She is so ___ that she spent a whole month's wages on one party dress.|It was ___ of him to buy a new car when his old one still worked perfectly.|The king's ___ spending on palaces and parties left the country deep in debt.|thrifty,pricey|extravagance
  pricey|expensive|昂贵的|That shop is too ___ for us; one T-shirt there costs as much as our food for a week.|We had a ___ meal at the hotel: forty dollars just for a bowl of soup.|Concert tickets are so ___ this year that we may watch the show on TV instead.|thrifty,lucrative|pricier
  costly|costing a lot; causing loss|昂贵的；代价大的|Forgetting to lock the door was a ___ mistake: thieves took everything we owned.|Repairs to the roof will be ___, about twenty thousand dollars.|The war was ___ for both sides, who each lost thousands of soldiers.|thrifty,prosperous|costlier
  affordable|inexpensive; reasonably priced|买得起的|The city needs more ___ homes so that young nurses and teachers can live there.|The new phone is ___ at only a hundred dollars, so most students can buy one.|The museum keeps its tickets ___ so that families can visit without spending much.|pricey,broke|
  broke|having no money|身无分文的|I'm ___ until payday, so I can't come out for dinner this week.|The company went ___ and had to close all its shops.|Students are often ___ by the end of term, living on noodles because they have nothing left to spend.|thrifty,wealthy|
  `,
  "context-clues",
  {
    intro: t(
      "The **wealthy** owner ran a **lucrative** business, but he was so **extravagant** that within ten years he was completely **broke**, while his **thrifty** sister still had all her savings. These ten words help you talk about having money, making it, saving it and spending too much.",
      "那位富有的（**wealthy**）老板经营着一门赚钱的（**lucrative**）生意，可他花钱太大手大脚（**extravagant**），不到十年就身无分文（**broke**）了；而他那节俭的（**thrifty**）妹妹至今还守着全部积蓄。这十个词帮你谈论有钱、赚钱、省钱和乱花钱。",
    ),
    watchOut: {
      meanings: t(
        "**Thrifty** means careful with money, while **broke** means having no money at all, so a thrifty person is rarely broke.",
        "**thrifty** 是花钱节省；**broke** 是一分钱都没有，所以节俭的人很少会身无分文。",
      ),
      use: t(
        "**Profitable** and **lucrative** describe a business or job that earns money, while **pricey** and **costly** describe things that cost a lot to buy.",
        "**profitable** 和 **lucrative** 形容能赚钱的生意或工作；**pricey** 和 **costly** 形容买起来很贵的东西。",
      ),
      spelling: t(
        "**Prosperous** ends in -ous, **extravagant** ends in -ant, and **pricey** keeps the e of *price* before -y.",
        "**prosperous** 以 -ous 结尾；**extravagant** 以 -ant 结尾；**pricey** 在 -y 前保留 *price* 的 e。",
      ),
    },
    notes: `
      wealthy|a family with three houses, a yacht and a private plane|an uncle who sold his company for millions|a street where the smallest house costs ten million|wealthy means having a great deal of money; prosperous means doing well and thriving|wealthy 是非常有钱的；prosperous 是兴旺发达的|affordable describes something cheap enough to buy, not a person or family with a lot of money|affordable 形容价格买得起的东西，不形容很有钱的人或家庭|costly describes something that costs a lot, not a person who has a lot of money|costly 形容花费很大的东西，不形容很有钱的人|wealth · y|wealth plus -y|wealth 加 -y
      prosperous|a gold town with new shops and banks opening every month|a farmer with fields for miles and a new house|a new year wished full of good business|prosperous means thriving and doing well with money; wealthy means having a lot of money|prosperous 是兴旺发达的；wealthy 是很有钱的|thrifty means careful not to spend much, not a town, a farmer or a year doing well and growing richer|thrifty 是花钱节省，不是城镇、农民或年景兴旺发达|broke means having no money, the opposite of new banks, a big new house and plenty of money|broke 是身无分文，和新开的银行、大房子、钱多正好相反|pros · per · ous|the -ous ending|结尾是 -ous
      profitable|a bakery that earns twice what it spends|selling ice cream on a beach in summer|a deal that earns a company ten million in a year|profitable means making more money than it costs; lucrative means making a great deal of money|profitable 是有盈利的；lucrative 是非常赚钱的|thrifty means careful with spending, not a business or a deal that earns money|thrifty 是花钱节省，不形容赚钱的生意或交易|extravagant means spending too much, not earning more than you spend|extravagant 是花钱太多，不是赚得比花得多|prof · it · a · ble|profit plus -able|profit 加 -able
      lucrative|a football career earning millions a year|a banking job paying three times as much as teaching|selling phone cases online to buy a flat|lucrative means earning a great deal of money; profitable means making some profit|lucrative 是非常赚钱的；profitable 是有利润的|thrifty means careful with money, not a career or a job that earns a great deal|thrifty 是节俭的，不形容非常赚钱的职业或工作|broke means having no money, not a job or a business that makes a lot of money|broke 是身无分文，不形容很赚钱的工作或生意|lu · cra · tive|the -tive ending|结尾是 -tive
      thrifty|a grandmother who saves every plastic bag and only buys on sale|a man who mends old shoes instead of buying new ones|a shopper who compares prices in three shops|thrifty means careful not to waste money; broke means having none|thrifty 是节俭、不浪费钱；broke 是一分钱没有|broke means having no money at all, not choosing carefully how to spend it|broke 是身无分文，不是精打细算地花钱|extravagant means spending too much, the opposite of saving bags, mending shoes and comparing prices|extravagant 是花钱太多，和攒塑料袋、补旧鞋、货比三家正好相反|thrift · y|thrift plus -y|thrift 加 -y
      extravagant|a whole month's wages spent on one party dress|a new car bought when the old one still works|a king's spending on palaces that leaves his country in debt|extravagant means spending far too much; pricey means costing a lot|extravagant 是挥霍无度的；pricey 是价格贵的|thrifty means careful with money, the opposite of spending a month's wages on one dress|thrifty 是节俭的，和花一个月工资买一条裙子正好相反|pricey describes a thing that costs a lot, not a person who spends too much or their spending|pricey 形容东西贵，不形容花钱太多的人或其花销|ex · trav · a · gant|the -ant ending|结尾是 -ant
      pricey|a shop where one T-shirt costs a week's food|forty dollars for a bowl of soup|concert tickets so dear that people watch on TV|pricey means expensive, often more than it should be; costly can also mean causing loss|pricey 是价钱贵的；costly 还可指代价大|thrifty describes a careful person, not a shop, a meal or tickets that cost a lot|thrifty 形容节俭的人，不形容贵的商店、饭菜或门票|lucrative means earning a lot of money, not costing a lot to buy|lucrative 是很赚钱的，不是买起来很贵|pri · cey|price keeping its e before -y|price 保留 e 再加 -y
      costly|a forgotten lock that lets thieves take everything|roof repairs of about twenty thousand dollars|a war in which both sides lose thousands of soldiers|costly means costing a lot, or causing great loss; pricey means only expensive to buy|costly 是花费大或代价大；pricey 只是价格贵|thrifty means careful with money, not a mistake, repairs or a war that cost a great deal|thrifty 是节俭的，不形容代价大的错误、修理或战争|prosperous means thriving and doing well, the opposite of losing everything or thousands of soldiers|prosperous 是兴旺发达的，和失去一切或损失数千士兵正好相反|cost · ly|cost plus -ly|cost 加 -ly
      affordable|homes cheap enough for young nurses and teachers|a phone at only a hundred dollars|museum tickets kept low for families|affordable means cheap enough for people to buy; pricey means expensive|affordable 是价格合理、买得起的；pricey 是贵的|pricey means expensive, the opposite of cheap enough for most people|pricey 是贵的，和大多数人买得起正好相反|broke describes a person with no money, not homes, phones or tickets that are cheap|broke 形容没钱的人，不形容便宜的房子、手机或门票|af · ford · a · ble|the double f and the -able ending|双写 f，结尾是 -able
      broke|a person who cannot go out to dinner until payday|a company that has to close all its shops|students living on noodles at the end of term|broke means having no money left; thrifty means careful with money|broke 是一分钱没有；thrifty 是节俭的|thrifty means careful with money, not having none left at all|thrifty 是节俭，不是一分钱都没有|wealthy means having a great deal of money, the opposite of having none|wealthy 是很有钱，和一分钱没有正好相反|broke|the long o and the silent e|长音 o，结尾 e 不发音
    `,
  },
);

const pay = batch(
  "words-of-pay-and-bills",
  ["Words of Pay and Bills", "薪酬与账单的词"],
  ["money earned, money owed, money back and money off", "挣的钱、欠的钱、退款与优惠"],
  `
  wage|money paid for work, usually by the hour or week|工资|He works in a café, where his ___ is twelve dollars an hour.|The factory workers went on strike for a higher weekly ___.|The minimum ___ is the least that an employer may pay for each hour of work.|voucher,invoice|
  salary|a fixed regular payment, usually monthly|薪水|Her ___ is sixty thousand a year, paid into her bank in twelve equal parts.|As a manager, he earns a fixed yearly ___ however many hours he works.|The new job offers a higher ___ and five more days of holiday each year.|voucher,refund|salaries
  earnings|money earned|收入|His ___ from his two jobs added up to forty thousand dollars last year.|The singer's ___ from the world tour were more than she had made in ten years.|Half of the farmer's ___ come from selling eggs, and the rest from selling milk.|voucher,invoice|
  bonus|an extra sum of money; an extra benefit|奖金；额外好处|Every worker got a Christmas ___ of five hundred dollars on top of their usual pay.|The players will each get a big ___ for winning the league.|The hotel was lovely, and the free breakfast was a nice ___ we had not expected.|pension,refund|bonuses
  pension|regular money paid to a retired person|养老金|Grandpa lives on his ___, which the railway has paid him every month since he stopped working there.|She paid into her company's ___ for forty years so that she would have money in old age.|Old people in the village collect their ___ at the post office each week.|earnings,installment|pensions,pensioner
  fee|a payment for a service|费用|The doctor's ___ is fifty dollars for each visit.|There is no entry ___ for the museum on Sundays, so anyone can walk in.|The lawyer's ___ for one hour of advice was more than I earn in a week.|invoice,refund|fees
  invoice|a list of goods sent or work done, with the amount due|发票|Please send the ___ to our office, listing the work done and the amount we owe.|The ___ must be paid within thirty days, or the builder will add a late charge.|The plumber's ___ listed new pipes, three hours' work and a total of four hundred dollars.|refund,pension|invoices,invoiced
  refund|money paid back; to pay back|退款|The shoes fell apart after a week, so I returned them, and the shop put the full ___ of sixty dollars back on my card.|When the flight was cancelled, the airline promised every passenger a full ___, paid straight back to their card.|Without the receipt, the shop would not hand back the cash I had paid, so I got no ___ at all.|invoice,voucher|refunded,refundable
  voucher|a printed piece of paper worth a certain amount of money off|代金券|Use this ___ to get ten dollars off your next meal at the café.|She won a travel ___ worth five hundred dollars, which she can spend only with that airline.|The printed ___ for a free coffee runs out at the end of May.|refund,bonus|vouchers
  installment|one of several payments over time; one part of a series|分期付款；一集|We paid the first ___ today; eleven more payments are still to come.|The last ___ of the series will be shown next Sunday, and fans can't wait to see how it ends.|The second ___ of the trilogy came out a year after the first book.|pension,fee|installments
  `,
  "context-clues",
  {
    intro: t(
      "When the builder's **invoice** arrived, Dad paid the first **installment** from his **salary**, then used a shop **voucher** to buy paint and got a **refund** for the tiles that had cracked. These ten words help you talk about money you earn, money you owe, money back and money off.",
      "建筑商的发票（**invoice**）一到，爸爸就用薪水（**salary**）付了第一期款（**installment**），接着用一张商店代金券（**voucher**）买了油漆，又为裂开的瓷砖拿到了退款（**refund**）。这十个词帮你谈论挣的钱、欠的钱、退回的钱和优惠的钱。",
    ),
    watchOut: {
      meanings: t(
        "A **wage** is usually paid by the hour or the week, while a **salary** is a fixed amount for the year, paid each month.",
        "**wage** 通常按小时或按周发；**salary** 是按年定好的固定金额，每月发放。",
      ),
      use: t(
        "You pay an **invoice** that a seller sends you, but you get a **refund** when money comes back to you, and you pay a **fee** for a service.",
        "卖方寄来的 **invoice** 是你要付的账；**refund** 是退还给你的钱；**fee** 是为某项服务付的费用。",
      ),
      spelling: t(
        "**Installment** has a double l before -ment in American spelling, **voucher** has ou as in *pouch*, and **earnings** always ends in s.",
        "美式拼写的 **installment** 在 -ment 前双写 l；**voucher** 中的 ou 读音同 *pouch*；**earnings** 总是以 s 结尾。",
      ),
    },
    notes: `
      wage|twelve dollars an hour in a café|factory workers striking for more weekly pay|the least an employer may pay for each hour|a wage is money paid for work, usually by the hour or week; a salary is a fixed amount for the year|wage 是按小时或周计的工资；salary 是按年固定的薪水|a voucher is a paper worth money off, not money paid for each hour or week of work|voucher 是可抵钱的券，不是按小时或周付的工资|an invoice is a bill asking you to pay, not money you are paid for work|invoice 是要你付钱的账单，不是工作挣的钱|wage|the -age ending, said like *page*|结尾 -age 读音同 *page*
      salary|sixty thousand a year paid in twelve equal parts|a manager paid the same however many hours he works|a new job offering more money and more holiday|a salary is a fixed sum for a year, usually paid monthly; a wage is paid by the hour or week|salary 是按年固定、按月发的薪水；wage 是按小时或周计的工资|a voucher is a paper worth money off, not a fixed yearly payment for a job|voucher 是可抵钱的券，不是工作的固定年薪|a refund is money paid back for something you bought, not pay for doing a job|refund 是买东西后退回的钱，不是工作的报酬|sal · a · ry|the -ary ending; the plural is salaries|结尾是 -ary；复数是 salaries
      earnings|forty thousand from two jobs in a year|money a singer made on a world tour|a farmer's income from eggs and milk|earnings is all the money someone earns, from any source; a salary is the fixed pay from one job|earnings 是各种来源挣得的全部收入；salary 是一份工作的固定薪水|a voucher is a paper worth money off, not the money made from jobs, a tour or a farm|voucher 是可抵钱的券，不是工作、巡演或农场挣的钱|an invoice is a bill you must pay, not money you have made|invoice 是你要付的账单，不是你挣的钱|earn · ings|earn plus -ings, always with s|earn 加 -ings，总带 s
      bonus|five hundred dollars at Christmas on top of usual pay|players paid extra for winning the league|a free breakfast that was not expected|a bonus is extra money or an extra good thing on top of what you expect; a salary is regular pay|bonus 是额外的奖金或额外的好处；salary 是固定薪水|a pension is regular money paid after you stop working, not an extra prize for workers or players|pension 是退休后定期领取的钱，不是给员工或球员的额外奖赏|a refund is money paid back for something, not an extra reward or a pleasant surprise|refund 是退回的钱，不是额外的奖励或惊喜|bo · nus|the -us ending; the plural is bonuses|结尾是 -us；复数是 bonuses
      pension|a grandfather paid every month since he stopped working on the railway|money saved for forty years for old age|old people collecting money at the post office each week|a pension is regular money paid to someone who has stopped working; earnings are money made while working|pension 是退休后定期领取的钱；earnings 是工作时挣的钱|earnings is money made by working, not money paid after you have stopped working|earnings 是工作挣的钱，不是退休后领的钱|an installment is one of several payments you make to buy something, not money paid to old people|installment 是购物时分期付的一笔款，不是发给老人的钱|pen · sion|the -sion ending|结尾是 -sion
      fee|fifty dollars for each visit to a doctor|no entry charge at a museum on Sundays|a lawyer's charge for one hour of advice|a fee is a payment for a service; an invoice is the bill that lists what you owe|fee 是为服务付的费用；invoice 是列出欠款的账单|an invoice is the written bill, not the charge itself for a visit, entry or advice|invoice 是书面账单，不是就诊、入场或咨询本身的费用|a refund is money paid back, not a charge for a service|refund 是退回的钱，不是服务费|fee|the double e|双写 e
      invoice|a list of work done and the amount owed sent to an office|a bill to be paid within thirty days or a late charge is added|a plumber's list of pipes, hours and a total|an invoice is a written list of goods or work with the amount due; a fee is the charge for a service|invoice 是列明货物或工作及应付金额的账单；fee 是服务费|a refund is money paid back to you, not a list of work you must pay for|refund 是退给你的钱，不是要你付钱的工作清单|a pension is money paid to a retired person, not a bill with a total owed|pension 是退休金，不是写着应付总额的账单|in · voice|in plus voice|in 加 voice
      refund|shoes returned and sixty dollars put back on a card|an airline paying ticket prices back to passengers' cards|a shop that will not hand back cash without a receipt|a refund is money paid back to you; a voucher is a paper worth money off something new|refund 是退还给你的钱；voucher 是买新东西时可抵钱的券|an invoice is a bill asking you to pay, not money paid back to you|invoice 是要你付钱的账单，不是退给你的钱|a voucher gives money off something new, not your price or cash paid back to you|voucher 是买新东西时抵钱，不是把你付的钱退回给你|re · fund|re- plus fund|re- 加 fund
      voucher|ten dollars off the next meal at a café|a travel prize that can only be spent with one airline|a printed paper for a free coffee that runs out in May|a voucher is a paper worth money off or a free item; a refund is money paid back|voucher 是可抵钱或换免费物品的券；refund 是退回的钱|a refund is money given back for something you bought, not a paper for money off or a free coffee|refund 是退回的购物款，不是抵钱或换免费咖啡的券|a bonus is extra money paid on top of your pay, not a printed paper you spend at a café or airline|bonus 是工资外的奖金，不是在咖啡馆或航空公司使用的纸质券|vouch · er|the ou, as in *pouch*|ou 读音同 *pouch*
      installment|the first of twelve payments with eleven still to come|the last episode of a series shown on Sunday|the second book of a trilogy|an installment is one of several payments or one part of a series; a fee is a single charge for a service|installment 是分期付款中的一期或系列中的一部分；fee 是一次性的服务费|a pension is money paid to a retired person, not one payment of many or one part of a series|pension 是退休金，不是多期付款中的一期或系列中的一部|a fee is a charge for a service, not one of twelve payments or one part of a series of books or shows|fee 是服务费，不是十二期付款中的一期，也不是书或节目系列中的一部|in · stall · ment|the double l before -ment in American spelling|美式拼写在 -ment 前双写 l
    `,
  },
);

const sources = batch(
  "academic-words-of-sources-and-steps",
  ["Academic Words of Sources and Steps", "来源与步骤的学术词"],
  ["choosing, recording, places, continuing and depending", "选择、登记、地点、持续与依赖"],
  `
  select|to choose carefully from a group|挑选|You may ___ three books from the shelf to take home for the holiday.|The judges will ___ the best painting from over a hundred entries.|When you book online, you can ___ your own seat on the plane from a map of the cabin.|register,emit|selected,selective
  register|an official list; to put on a list; to show|登记册；登记；显示|You must ___ your new car with the police before you drive it on the road.|Over a thousand people came to ___ as voters, writing their names on the official list.|Guests must ___ at the front desk and sign the book when they arrive at the hotel.|select,trace|registered,registration
  input|what is put into a system; to put in|输入；投入|The computer needs ___ from the keyboard or the mouse before it can do anything.|We welcome your ___ on the new park, so please send us your ideas by Friday.|With fresh ___ from the students, the teachers' plan for the school trip got much better.|site,trace|inputs
  emit|to send out light, heat, sound or gas|发出|Old cars ___ more harmful gases from their exhausts than new ones.|The smoke alarm will ___ a loud beep when its battery is running low.|On summer nights, fireflies ___ light from their bodies to attract a mate.|offset,select|emitted
  offset|to counteract something by having an opposite effect|抵消|Planting trees can help ___ the carbon that our flights put into the air.|The extra money from selling ice cream should ___ the losses from the rainy weeks.|Rising prices will ___ the small pay rise, leaving workers no better off than before.|emit,rely|
  trace|a mark or sign left behind; to find by searching|痕迹；追查|The thieves left no ___ behind: not one fingerprint or footprint.|There was a faint ___ of lipstick on the rim of the glass.|Search teams found no ___ of the missing hikers, not even a scrap of clothing.|site,input|traced,traces
  site|a place where something is or happens|地点；网站|This field was the ___ of a great battle in 1066, where thousands of soldiers died.|Builders must wear hard hats at all times on the building ___.|The museum stands on the ___ of an old Roman fort, whose walls you can still see in the garden.|trace,input|sites
  ongoing|continuing; still in progress|进行中的|The search is ___, and police divers are still in the lake today.|Work on the new road has been ___ for two years and is still not finished.|The strike is ___: the workers are still outside the factory gates this morning.|virtual,vehement|
  rely|to depend on with full trust|依赖|You can always ___ on me; I will never let you down.|Many villagers ___ on the river for their water, since there are no wells.|Don't ___ on luck in the exam; study hard instead.|offset,emit|relied,reliance
  reluctance|unwillingness to do something|不情愿|She showed great ___ to leave her old home, dragging her feet as the van drove up.|With some ___, he agreed to sing, though he really didn't want to.|Their ___ to help us, after we had helped them so often, came as a shock.|ignorance,emphasis|reluctantly
  `,
  "context-clues",
  {
    intro: t(
      "To study how much smoke factories **emit**, the scientists had to **select** ten factories, **register** each one and visit every **site** twice a year, so that they could **rely** on the results of their **ongoing** survey. These ten words help you talk about choosing, recording, places, things that continue and things you depend on.",
      "为了研究工厂排放（**emit**）多少烟雾，科学家们得挑选（**select**）十家工厂，逐一登记（**register**），每年到每个地点（**site**）去两次，这样才能依靠（**rely**）这项正在进行的（**ongoing**）调查得出的结果。这十个词帮你谈论选择、登记、地点、持续进行的事以及你所依赖的事物。",
    ),
    watchOut: {
      meanings: t(
        "To **emit** is to send light, heat, sound or gas out, while to **offset** is to cancel something out with an opposite effect, as trees can offset the carbon that cars emit.",
        "**emit** 是发出光、热、声音或气体；**offset** 是用相反的作用把某物抵消掉，比如树木可以抵消汽车排放的碳。",
      ),
      use: t(
        "You **rely on** someone, always with on, and you show **reluctance to** do something, with to.",
        "**rely** 后面一定接 **on**；表示不愿做某事说 **reluctance to** do，用 to。",
      ),
      spelling: t(
        "**Emit** doubles its t in *emitted*, **site** (a place) is not *sight* (seeing), and **reluctance** ends in -ance.",
        "**emit** 变 *emitted* 时双写 t；表示地点的 **site** 不是表示视力的 *sight*；**reluctance** 以 -ance 结尾。",
      ),
    },
    notes: `
      select|three books chosen from a shelf for the holiday|judges choosing the best of a hundred paintings|a seat chosen from a map of the plane when booking|select means to choose carefully from a group; register means to put a name on an official list|select 是从一群中仔细挑选；register 是登记在正式名单上|register means to put something on an official list, not to choose the best or your favourite from many|register 是登记在正式名单上，不是从许多中挑最好或最喜欢的|emit means to send out light, heat, sound or gas, not to choose|emit 是发出光、热、声或气体，不是挑选|se · lect|the -ect ending|结尾是 -ect
      register|a new car recorded with the police|people writing their names on the official list of voters|hotel guests signing the book at the front desk|register means to put a name or a thing on an official list; select means to choose|register 是登记在正式名单上；select 是挑选|select means to choose from a group, not to put your name or your car on an official list|select 是从一群中挑选，不是把名字或车登记在正式名单上|trace means to find by searching or to copy lines, not to sign in or put a name on a list|trace 是追查或描摹，不是签到或登记|reg · is · ter|the -ister in the middle and end|中后部是 -ister
      input|keys and mouse clicks a computer needs before it can work|ideas the public sends in about a new park|fresh ideas from students that improve a plan|input is what is put into a system or a plan; a trace is a mark left behind|input 是输入系统或计划的东西；trace 是留下的痕迹|a site is a place, not what is put into a computer or ideas sent in|site 是地点，不是输入电脑的东西或提交的意见|a trace is a mark or sign left behind, not information or ideas put into something|trace 是留下的痕迹，不是输入的信息或意见|in · put|in plus put|in 加 put
      emit|car exhausts sending out harmful gases|a smoke alarm giving a beep when its battery is low|fireflies giving off light from their bodies|emit means to send out light, heat, sound or gas; offset means to cancel out|emit 是发出光、热、声或气体；offset 是抵消|offset means to cancel something out with an opposite effect, not to send out gases, beeps or light|offset 是用相反作用抵消，不是发出气体、哔声或光|select means to choose carefully, not to send out gases, sound or light|select 是仔细挑选，不是发出气体、声音或光|e · mit|one m, and a double t in emitted|一个 m，emitted 中双写 t
      offset|trees that cancel out the carbon from flights|ice cream money that makes up for rainy-week losses|rising prices that cancel out a small pay rise|offset means to balance or cancel something with an opposite effect; emit means to send something out|offset 是用相反作用平衡或抵消；emit 是发出|emit means to send gas, light or sound out, not to cancel out carbon, losses or a pay rise|emit 是发出气体、光或声音，不是抵消碳排放、亏损或加薪|rely means to depend on, and it always needs on, so it cannot take carbon or losses straight after it|rely 是依赖，后面必须接 on，不能直接接碳排放或亏损|off · set|off and set joined, with no change in the past tense|off 和 set 合成一个词，过去式不变
      trace|thieves leaving not one fingerprint behind|a faint mark of lipstick on a glass|no sign of missing hikers, not even a scrap of clothing|a trace is a small mark or sign that something was there; a site is the place itself|trace 是某物曾在过的细微痕迹；site 是地点本身|a site is a place where something is or happens, not a fingerprint, a mark or a sign left behind|site 是某事发生的地点，不是指纹、印记或留下的迹象|input is what is put into a system, not a mark left behind|input 是输入系统的东西，不是留下的痕迹|trace|the soft c, said like s|c 读作 s
      site|a field where a great battle was fought in 1066|a building place where hard hats must be worn|the place where an old Roman fort once stood|a site is the place where something is, was or happens; a trace is a mark left behind|site 是某物所在或某事发生的地点；trace 是留下的痕迹|a trace is a small mark or sign, not a whole field, a building place or the ground of a fort|trace 是细微的痕迹，不是整片战场、工地或古堡遗址|input is what is put into a system, not a place where something happens|input 是输入系统的东西，不是某事发生的地点|site|not sight, which is about seeing|不要写成表示“看见”的 sight
      ongoing|a search with police divers still in the lake|road work that has gone on for two years and is not finished|a strike with workers still outside the gates|ongoing means still going on and not yet finished; virtual means existing on a computer|ongoing 是仍在进行、尚未结束的；virtual 是虚拟的|virtual means existing only on a computer, not a real search, road work or strike still going on|virtual 是只存在于电脑中的，不形容仍在进行的真实搜救、修路或罢工|vehement means showing strong feeling in words, not still in progress|vehement 是言辞情绪强烈，不是仍在进行|on · go · ing|on and going joined into one word|on 和 going 合成一个词
      rely|a friend who will never let you down|villagers who depend on a river for water|luck that should not be trusted in an exam|rely on means to depend on with trust; offset means to cancel something out|rely on 是信赖、依靠；offset 是抵消|offset means to cancel something out, and it is never followed by on|offset 是抵消，后面从不接 on|emit means to send out light, heat, sound or gas, and it is never followed by on|emit 是发出光、热、声或气体，后面从不接 on|re · ly|the y changes to i in relied|relied 中 y 变 i
      reluctance|a woman dragging her feet as the moving van arrives|a man who agrees to sing though he does not want to|friends unwilling to help after being helped so often|reluctance is not wanting to do something; ignorance is not knowing something|reluctance 是不情愿；ignorance 是无知|ignorance means not knowing something, not being unwilling to leave, sing or help|ignorance 是不知道，不是不愿离开、唱歌或帮忙|emphasis means special importance given to something, not unwillingness to do it|emphasis 是特别强调，不是不情愿做某事|re · luc · tance|the -ance ending|结尾是 -ance
    `,
  },
);

/** batchesG are the batches of fights, schemes, cruelty, mess, cleaning, rich and poor, pay and sources. */
export const batchesG: readonly BatchSpec[] = [fights, schemes, cruelty, mess, cleaning, wealth, pay, sources];
