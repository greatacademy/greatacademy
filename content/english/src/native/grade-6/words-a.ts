// Grade 6: the batches of words of the first five units, from myths and poetry to Rome, the first cities and the
// restless Earth.

import { t } from "@ga/content";
import type { BatchSpec } from "../batch.ts";
import { batch } from "../grade-5/batches.ts";

const heroes = batch(
  "words-of-heroes-and-quests",
  ["Words of Heroes and Quests", "英雄与远征的词"],
  ["heroes and their quests", "英雄与远征"],
  `
  quest|a long search or journey to find or win something|探寻，远征|The young prince set out on his ___ to find the magic spring that could heal his father.|After ten years of searching, the hero's ___ for the golden fleece ended when he carried it home.|Her ___ for the lost city took her across three deserts, but she never stopped searching.|ordeal,exile|quests
  valor|great courage, especially in battle|英勇|The soldiers won medals for their ___, because they had charged forward bravely while others ran.|It took great ___ for the warrior to hold the bridge alone against a whole army.|The knight's ___ in facing the dragon, even with shaking knees, proved how brave she was.|renown,peril
  ordeal|a hard and painful experience|严峻的考验，苦难|The hikers survived the ___ of three freezing nights trapped on the mountain without food.|The sailors lived through the ___ of twelve days adrift without water, burned by the sun.|After the painful ___ of her long hospital stay was over, she slept for two whole days.|quest,exile|ordeals
  exile|being forced to live away from your home country|流放|The king sent his rebellious brother into ___ on a distant island and banned him from ever returning.|After twenty years in ___, forced to live far from his homeland, the hero finally sailed home.|She lived in ___ because the new rulers had banned her from her own city.|ordeal,quest|exiled
  vanquish|to defeat an enemy completely|彻底击败|The hero swore to ___ the monster so completely that it would never trouble the village again.|With one last blow, she managed to ___ her rival and win the final duel.|The small rebel band could not ___ the emperor's huge army, and in the end it was the rebels who were beaten.|surrender,invade|vanquished
  peril|great danger|危险|The ship was in ___ as the storm drove it toward the sharp rocks.|Signs warned hikers of the ___ of falling rocks on the narrow cliff path.|The guard shouted that the children were in ___ because the ice on the lake was cracking.|ordeal,doom|perils
  steadfast|firm and loyal; not giving up|坚定的，忠诚的|The guards stayed ___ at their posts all night and refused to leave, even when the storm came.|Odysseus remained ___ in his wish to return home and never gave up through twenty years.|Through many hard years, her ___ loyalty to her old friend never weakened.|gallant,hesitant
  gallant|brave and noble, often polite toward others|英勇而有风度的|Without a moment's pause, the ___ knight bowed politely to the old woman and carried her across the flooded river.|In a ___ and daring rescue, the young sailor dived into the icy sea to save the child.|With a quick, ___ bow, the brave young man offered his coat to the shivering stranger.|steadfast,hesitant
  renown|fame earned for doing something great|名声，声望|The poet's ___ spread far beyond her small village, and people in distant cities knew her name.|He won great ___ as the fastest runner in Greece, and his name was known everywhere.|Thanks to the healer's ___, sick people who had heard of her traveled from distant lands to her door.|valor,tribute
  adversary|an enemy or opponent|对手，敌手|The hero's oldest ___ was a sea monster that had tried to kill him for years.|The knight knew that his ___ wanted to destroy him and was waiting for the moment to strike.|A clever ___ who plots against you is harder to beat than a strong one.|companion,contender|adversaries
  `,
  "context-clues",
  {
    intro: t(
      "On her **quest** for the magic spring, the **gallant** princess faced **peril** at every turn and finally met her oldest **adversary** at the mouth of a cave. These ten words help you tell the stories of heroes and the trials they face.",
      "在寻找魔泉的远征（**quest**）中，英勇而有风度的（**gallant**）公主步步遇险（**peril**），最后在洞口遇到了她的宿敌（**adversary**）。这十个词帮你讲述英雄和他们经历的考验。",
    ),
    watchOut: {
      meanings: t(
        "Tell **peril** (a danger that *might* hurt you) apart from **ordeal** (a painful experience you actually *live through*) and **doom** (a terrible ending that cannot be escaped).",
        "分清 **peril**（可能伤人的危险）、**ordeal**（真正熬过的痛苦经历）和 **doom**（逃不掉的悲惨结局）。",
      ),
      use: t(
        "Tell **steadfast** (firm and loyal over a long time) apart from **gallant** (brave and polite in one noble act).",
        "分清 **steadfast**（长期坚定忠诚）和 **gallant**（一次勇敢而有风度的举动）。",
      ),
      spelling: t(
        "Watch **valor** (*-or* in American English), **peril** (one *r* and one *l*), **vanquish** (*qu* after *n*) and **adversary** (*-ary*).",
        "注意 **valor** 的美式结尾 **-or**、**peril** 只有一个 **r** 和一个 **l**、**vanquish** 中 **n** 后面的 **qu**，以及 **adversary** 的结尾 **-ary**。",
      ),
    },
    notes: `
      quest|a prince setting out to find a magic spring that could heal his father|a hero's ten-year search for the golden fleece|a long search for a lost city across three deserts|quest is a search with a goal; ordeal is a painful experience you live through|quest 是有目标的探寻；ordeal 是要熬过的苦难|ordeal is a hard, painful experience you must live through, not a journey you choose in order to find something|ordeal 是不得不熬过的痛苦经历，不是为寻找某物而主动踏上的旅程|exile is being forced to live away from your home, not a search you set out on to find or win something|exile 是被迫离开家乡生活，不是为寻找或赢得某物而出发的探寻|quest|qu saying /kw/ and the -est ending|qu 读 /kw/，结尾是 -est
      valor|soldiers charging forward bravely while others ran|a warrior holding a bridge alone against a whole army|a knight facing a dragon even with shaking knees|valor is the courage itself; renown is the fame it may bring|valor 是勇气本身；renown 是勇气可能带来的名声|renown is the fame a person earns, not the courage they show when facing danger|renown 是一个人赢得的名声，不是面对危险时表现出的勇气|peril is the danger itself, not the brave quality of a person who faces it|peril 是危险本身，不是直面危险的人所具有的勇敢品质|val · or|the -or ending (British English writes valour)|结尾是 -or（英式英语拼作 valour）
      ordeal|three freezing nights trapped on a mountain without food|twelve days adrift at sea without water under a burning sun|a long and painful hospital stay followed by two days of sleep|ordeal is a painful experience you live through; quest is a search you choose|ordeal 是熬过的苦难；quest 是主动的探寻|quest is a journey you choose in order to find something, not suffering that is forced on you|quest 是为寻找某物而主动踏上的旅程，不是被迫承受的苦难|exile is being sent to live far from home, not a stretch of pain and hardship that you get through|exile 是被赶到远离家乡的地方生活，不是一段需要熬过去的痛苦经历|or · deal|the or- start followed by the word deal|or 开头，后面接 deal
      exile|a rebellious brother sent to a distant island and banned from returning|twenty years forced to live far from a homeland|a woman banned from her own city by new rulers|exile is being forced to live away from home; quest is a journey you choose|exile 是被迫离乡；quest 是主动出发的探寻|ordeal is any hard, painful experience, not the state of being banned from your home country|ordeal 泛指痛苦的经历，不特指被禁止回到故土的状态|quest is a search someone chooses to go on, not a punishment that forces them away from home|quest 是自愿踏上的探寻，不是迫使人离开家乡的惩罚|ex · ile|x in ex- and the silent e of -ile|ex- 中的 x 和 -ile 结尾不发音的 e
      vanquish|a hero swearing to beat a monster so it never troubles the village again|a last blow that wins the final duel|a small rebel band beaten by an emperor's huge army|vanquish means to beat an enemy completely; surrender means to give up and accept defeat|vanquish 是彻底打败敌人；surrender 是放弃抵抗、认输|surrender means to give up and accept defeat, the opposite of beating an enemy completely|surrender 是放弃抵抗、接受失败，与彻底打败敌人正相反|invade means to march into a land with an army to take it, so it names a place to enter rather than an enemy to beat|invade 是率军进入一片土地，后面接要进入的地方，而不是要打败的敌人|van · quish|qu after n and the -ish ending|n 后面的 qu 和结尾 -ish
      peril|a ship driven by a storm toward sharp rocks|signs warning hikers about falling rocks on a cliff path|children standing on lake ice that is cracking|peril is a danger that might hurt you; ordeal is pain you actually go through|peril 是可能伤人的危险；ordeal 是真正经历的苦难|ordeal is a long, painful experience someone goes through, not a danger that may strike next|ordeal 是人要熬过的漫长痛苦经历，不是随时可能降临的危险|doom is a terrible ending that cannot be avoided, while a danger can still be escaped|doom 是无法逃避的悲惨结局，而危险仍有机会躲开|per · il|one r and one l, with -il rather than -ill|只有一个 r 和一个 l，结尾是 -il 不是 -ill
      steadfast|guards refusing to leave their posts all night through a storm|a twenty-year wish to return home that never gave up|loyalty to an old friend that never weakened through hard years|steadfast means firm and loyal over time; gallant means brave and polite in one noble act|steadfast 指长久坚定忠诚；gallant 指勇敢而有风度|gallant describes a brave and polite act, not a firm loyalty that does not give up over a long time|gallant 形容勇敢有礼的举动，不是长期不变的坚定忠诚|hesitant means slow to act because you are unsure, the opposite of staying firm and never giving up|hesitant 指因没把握而犹豫，与坚定不移正相反|stead · fast|ea saying a short e in stead|stead 中的 ea 读短音 e
      gallant|a knight who politely bows and carries an old woman across a flooded river|a sailor diving into the icy sea in a daring rescue|a brave young man offering his coat to a shivering stranger with a quick bow|gallant means brave and polite in action; steadfast means firm and loyal over time|gallant 指勇敢而有风度；steadfast 指长期坚定忠诚|steadfast means staying firm and loyal over a long time, not acting bravely and politely in one moment|steadfast 指长期坚定忠诚，不是一时之间勇敢而有礼的举动|hesitant means slow to act because you are unsure, the opposite of a quick and daring deed|hesitant 指因没把握而迟迟不动，与果断勇敢的举动正相反|gal · lant|double l and the -ant ending|双写 l，结尾是 -ant
      renown|a poet whose name was known in distant cities|the fastest runner in Greece whose name was known everywhere|a healer so well known that the sick traveled from distant lands|renown is fame; valor is the courage that may earn it|renown 是名声；valor 是可能赢得名声的勇气|valor is courage shown in danger, not fame that spreads so far that strangers know your name|valor 是面对危险的勇气，不是远播四方、让陌生人都知道你名字的名声|tribute is a payment or an act of respect given to someone, not the fame a person earns|tribute 是献给某人的贡品或敬意，不是一个人自己赢得的名声|re · nown|ow saying /aʊ/ as in down|ow 读 /aʊ/，和 down 一样
      adversary|a sea monster that had tried to kill a hero for years|an enemy waiting for the moment to strike a knight|a clever enemy who plots against you|adversary is an enemy against you; companion is someone on your side|adversary 是与你为敌的人；companion 是与你同行的伙伴|companion is a person or animal who spends time with you, not someone who works against you|companion 是陪伴你的人或动物，不是与你作对的人|contender is someone with a chance of winning a contest, not an enemy who wants to harm you|contender 是比赛中有望获胜的选手，不是想伤害你的敌人|ad · ver · sar · y|the -ary ending after vers|vers 后面接 -ary 结尾
    `,
  },
);

const fate = batch(
  "words-of-fate-and-prophecy",
  ["Words of Fate and Prophecy", "命运与预言的词"],
  ["fate and prophecy", "命运与预言"],
  `
  fate|a power that some believe decides what will happen|命运|The Greeks believed that ___, a power stronger than the gods, decided how every life would go.|With no oars left, the sailors put their lives in the hands of ___ and drifted wherever the sea took them.|By a strange twist of ___, the two friends met again in a small town after forty years.|doom,prophecy|fates
  omen|a sign that something good or bad will happen|预兆，征兆|To the frightened sailors, the black birds circling the mast were a bad ___ for the voyage.|Nobody said a word, yet everyone took the cracked mirror as a clear ___ of bad luck to come.|The farmers believed that a ring around the moon was a sure ___ of rain the next day.|seer,prophecy|omens
  destiny|what will happen to someone in the future, as if already decided|命运，天命|The girl believed it was her ___ to lead her people one day.|He felt that becoming a doctor was his ___, the future he had been born for.|The oracle looked into the smoke and told the young man about his ___ as a great king.|doom,prophecy|destinies
  prophecy|a statement about what will happen in the future|预言|The old woman's ___, spoken in a whisper, said that a child of the king would one day rule the world.|Everyone feared the old ___ carved on the temple wall, which said that a great flood would come.|The ___ came true when the city fell exactly as the seer had foretold.|omen,seer|prophecies
  doom|death or a terrible ending that cannot be avoided|厄运，劫数|Without knowing it, the sailors were steering straight toward their ___ on the hidden rocks.|The deep crack in the dam warned of the town's coming ___.|In the myth, the giant laughed, not knowing that his ___ was only a day away.|wrath,vengeance
  foretell|to say what will happen before it happens|预言，预示|By watching how the birds flew, the wise woman could ___ a storm two days before it came.|No one can ___ exactly what the future will bring.|The seer claimed she could ___ who would win the war long before the first battle.|reminisce,estimate|foretold,foretells
  vengeance|harm done to someone to pay them back for a wrong|复仇|The angry god swore ___ on the man who had stolen his fire.|She wanted the thief to be punished fairly by a judge, not ___ that she carried out herself.|To pay back the man who had burned his farm, he planned his ___ for years.|wrath,doom
  seer|a person who is believed to see the future|预言者，先知|The king traveled for days to ask the ___ about the coming war.|The blind ___ warned the hero not to sail.|People brought the old ___ gifts and questions about love and money.|omen,prophecy|seers
  wrath|very great anger|愤怒，暴怒|The sea god's ___ boiled over when the sailors laughed at him, and his face turned red with fury.|The farmer's face went red and he shouted with ___ when he found the fence broken.|Her ___ cooled after a while, and she was no longer angry at her brother.|vengeance,gloom
  inevitable|certain to happen; impossible to avoid|不可避免的|With black clouds rolling in and thunder getting closer, rain within the hour seemed ___.|After losing their three best players, the team's defeat in the final was ___.|Growing older is ___; no one can stop it from happening.|permanent,reliable
  `,
  "context-clues",
  {
    intro: t(
      "The **seer** stared into the fire and began to **foretell** the king's **doom**, and a falling star that night was taken as an **omen**. These ten words help you read myths about fate, warnings and the future.",
      "预言者（**seer**）凝视火焰，开始预言（**foretell**）国王的厄运（**doom**）；当晚划过的一颗流星被视为征兆（**omen**）。这十个词帮你读懂有关命运、警示与未来的神话。",
    ),
    watchOut: {
      meanings: t(
        "Tell **omen** (a *sign*, such as birds or an eclipse, that hints at the future) apart from **prophecy** (*words* that say what will happen) and **seer** (the *person* who speaks them).",
        "分清 **omen**（预示未来的征兆，如飞鸟、日食）、**prophecy**（说出未来会发生什么的预言）和 **seer**（说出预言的人）。",
      ),
      use: t(
        "Tell **wrath** (very great anger you feel) apart from **vengeance** (harm you do to someone to pay back a wrong).",
        "分清 **wrath**（心中的盛怒）和 **vengeance**（为报仇而对别人造成的伤害）。",
      ),
      spelling: t(
        "Watch **prophecy** (*ph* saying /f/ and *-cy* for the noun; the verb is *prophesy*), **vengeance** (*-geance*), **inevitable** (*i* after *v*) and **seer** (double *e*).",
        "注意 **prophecy** 中读 /f/ 的 **ph** 和名词结尾 **-cy**（动词是 prophesy）、**vengeance** 的 **-geance**、**inevitable** 中 **v** 后面的 **i**，以及 **seer** 的双写 **e**。",
      ),
    },
    notes: `
      fate|a power stronger than the gods deciding how every life would go|sailors with no oars drifting wherever the sea took them|two friends meeting again by chance after forty years|fate is the power that decides what happens; doom is a terrible ending|fate 是决定一切的力量；doom 是悲惨的结局|doom is a terrible ending such as death, not a power that decides everything, good or bad|doom 是死亡之类的悲惨结局，不是决定一切好坏的力量|prophecy is a statement someone makes about the future, not the power itself that decides what happens|prophecy 是有人说出的关于未来的话，不是决定一切的力量本身|fate|silent e making the a long|词尾不发音的 e 让 a 读长音
      omen|black birds circling a ship's mast before a voyage|a cracked mirror taken as a sign of bad luck|a ring around the moon read as a sign of rain|omen is a sign seen in the world; prophecy is words spoken about the future|omen 是看到的征兆；prophecy 是说出的预言|seer is a person who is believed to see the future, not a thing or event taken as a sign|seer 是被认为能看见未来的人，不是被当作征兆的事物|prophecy is a statement spoken or written about the future, not an object or event that people take as a sign|prophecy 是说出或写下的关于未来的话，不是人们当作征兆的事物或现象|o · men|long o and the -en ending, not -an|o 读长音，结尾是 -en 不是 -an
      destiny|a girl believing she was meant to lead her people one day|becoming a doctor as the future a man was born for|an oracle describing a young man's future as a great king|destiny is the future meant for you, often a good one; doom is a terrible ending|destiny 是注定的未来，常常是好的；doom 是悲惨的结局|doom is death or a terrible ending, not the future a person feels they were meant for|doom 是死亡或悲惨的结局，不是一个人觉得自己生来注定的未来|prophecy is a statement made about the future, not the future itself that is waiting for a person|prophecy 是对未来的预言，不是等待着某人的未来本身|des · ti · ny|the -y ending, which changes to -ies in destinies|结尾是 -y，复数变成 destinies
      prophecy|whispered words saying a king's child would rule the world|old words carved on a temple wall about a coming flood|a city falling exactly as foretold|prophecy is words about the future; omen is a sign without words|prophecy 是关于未来的话；omen 是不用言语的征兆|omen is a sign such as a bird or an eclipse, not words that someone speaks or writes about the future|omen 是飞鸟、日食之类的征兆，不是有人说出或写下的关于未来的话|seer is the person who sees the future, not the statement that tells what will happen|seer 是能预见未来的人，不是说明未来会发生什么的那句话|proph · e · cy|ph saying /f/ and the noun ending -cy (the verb is prophesy)|ph 读 /f/，名词结尾是 -cy（动词是 prophesy）
      doom|sailors steering toward hidden rocks without knowing it|a crack in a dam warning of a town's coming end|a laughing giant whose end was only a day away|doom is a terrible ending that cannot be avoided; wrath is great anger|doom 是逃不掉的悲惨结局；wrath 是盛怒|wrath is very great anger, a feeling, not a terrible ending that is on its way|wrath 是极大的愤怒，是一种情绪，不是即将到来的悲惨结局|vengeance is harm done to pay someone back for a wrong, not an ending that no one can escape|vengeance 是为报仇而做的伤害，不是谁也逃不掉的结局|doom|double o saying /uː/ as in room|双写 o 读 /uː/，和 room 一样
      foretell|a wise woman reading the birds to know of a storm two days ahead|no one knowing exactly what the future will bring|a seer claiming to know the winner of a war before the first battle|foretell means to say what will happen; reminisce means to think about what already happened|foretell 是预言将来；reminisce 是回忆过去|reminisce means to talk or think about happy times in the past, not to say what will happen later|reminisce 是谈论或回想过去的快乐时光，不是说出以后会发生什么|estimate means to make a careful guess about an amount, such as a length or a number, not to tell what events lie ahead|estimate 是对长度、数量等作出估计，不是预言将来要发生的事|fore · tell|fore- with an e (not for-) and double l in tell|fore- 带 e（不是 for-），tell 双写 l
      vengeance|an angry god swearing to pay back the man who stole his fire|a fair punishment by a judge instead of paying back a thief yourself|years of planning to pay back the man who burned a farm|vengeance is harm done to pay back a wrong; wrath is the anger itself|vengeance 是为报仇而做的伤害；wrath 是愤怒本身|wrath is a feeling of very great anger, not an act of harm planned to pay someone back|wrath 是极大的愤怒情绪，不是为报复而策划的伤害行为|doom is a terrible ending that cannot be avoided, not harm a person chooses to do in return for a wrong|doom 是无法逃避的悲惨结局，不是有人为报仇而选择去做的伤害|venge · ance|the e after g keeping it soft before -ance|g 后面的 e 让 g 读软音，再接 -ance
      seer|a king traveling for days to ask about a coming war|a blind person warning a hero not to sail|people bringing gifts and questions about love and money|seer is a person who sees the future; prophecy is what such a person says|seer 是能预见未来的人；prophecy 是这样的人说出的预言|omen is a sign that hints at the future, not a person you can ask questions|omen 是预示未来的征兆，不是可以向其提问的人|prophecy is a statement about the future, not the person who gives warnings and answers|prophecy 是关于未来的预言，不是发出警告、回答问题的人|see · r|the word see with r added, so double e|see 加上 r，所以双写 e
      wrath|a sea god red with fury after sailors laughed at him|a farmer shouting with a red face over a broken fence|anger at a brother that cooled after a while|wrath is very great anger; vengeance is harm done to pay back a wrong|wrath 是盛怒；vengeance 是报复造成的伤害|vengeance is harm done to pay someone back, not the hot feeling of anger itself|vengeance 是为报复而做的伤害，不是愤怒的情绪本身|gloom is darkness or a feeling of sadness, not fierce anger|gloom 是昏暗或忧郁的心情，不是强烈的愤怒|wrath|silent w before r|r 前面的 w 不发音
      inevitable|black clouds and nearing thunder before rain|a team that lost its three best players before the final|growing older, which no one can stop|inevitable means certain to happen; permanent means lasting forever|inevitable 是必然发生的；permanent 是永久持续的|permanent means lasting forever or for a very long time, not certain to happen|permanent 指永久或长期存在，不是一定会发生|reliable means able to be trusted to work well, not impossible to avoid|reliable 指可以信赖、表现稳定，不是无法避免|in · ev · i · ta · ble|the i after v and the -able ending|v 后面是 i，结尾是 -able
    `,
  },
);

const kingdoms = batch(
  "words-of-kingdoms-and-courts",
  ["Words of Kingdoms and Courts", "王国与宫廷的词"],
  ["kingdoms, rulers and their courts", "王国、统治者与宫廷"],
  `
  realm|a kingdom, or the land a ruler controls|王国，领域|The king rode to every corner of his ___, from the northern hills to the southern coast.|Dragons were said to live in the wild mountains at the far edge of the ___.|Peace returned to every town and farm of the ___ after the long war.|throne,citadel|realms
  throne|the special chair of a king or queen; also their power|王位，宝座|The young queen sat on a golden ___ at the end of the great hall.|When the old king died, his daughter was crowned and climbed the steps to the ___.|Three cousins fought a long war over who would sit on the ___.|scepter,realm|thrones
  heir|the person who will receive a title or property when its owner dies|继承人|The prince was the only ___ to the throne, so he would become king when his father died.|She was named ___ to her grandmother's farm and would own it one day.|The old king had no son or daughter to be his ___, so the kingdom feared a war over who would rule next.|monarch,herald|heirs
  monarch|a king, queen or emperor|君主|The ___ has ruled the country for forty years and still wears the crown every day.|Every coin in the kingdom showed the face of the ___ who sat on the throne.|As ___, the queen could make laws, lead the army and choose her own advisers.|heir,governor|monarchs
  banquet|a large, formal meal for many guests|宴会|The king held a ___ with roast meats and music to celebrate his daughter's wedding.|Long tables were set with plates and cups for the ___ in the castle hall.|After the victory, the soldiers were invited to a grand ___ and ate until they were full.|tribute,decree|banquets
  decree|an official order given by a ruler|法令，敕令|The queen issued a ___ that every child in the land must learn to read.|By royal ___, no one but the king could hunt in the forest.|The ruler's ___ was read aloud in the market square, and everyone had to obey it.|treaty,tribute|decrees,decreed
  herald|a messenger who announces important news; also to announce|传令官；预示|The king sent his ___ ahead to every village to shout out the news of the new law.|The ___ blew a trumpet and then read the king's message aloud to the crowd.|Before the battle, a ___ carried the general's message across the field to the enemy camp.|seer,heir|heralds,heralded
  tribute|a payment made to a ruler; also something done to show respect|贡品；致敬|The conquered cities had to pay ___ in gold to the emperor every year to show they obeyed him.|The concert was a ___ to the singer who had died, with her friends singing her songs to honor her.|Each village sent grain as ___ to the emperor, a gift that showed his power over them.|tariff,decree|tributes
  sovereign|having the highest power; also a ruler|拥有主权的；君主|The ___ of the land had the final word on every law, and no one stood above her.|The lords knelt before their ___, the ruler who wore the crown, and promised to obey.|As ___, the emperor answered to no one but himself.|heir,herald|sovereigns
  scepter|a decorated rod held by a ruler as a sign of power|权杖|The king raised the golden ___ in his hand to silence the crowd.|At the crowning, the queen wore the crown on her head and held the ___ in her right hand.|The jeweled ___ was so heavy that the old king could barely lift it in one hand.|throne,tribute|scepters
  `,
  "context-clues",
  {
    intro: t(
      "In the great hall, the **monarch** sat upon the **throne** holding a golden **scepter**, while a **herald** read out the newest **decree**. These ten words help you picture how kings and queens ruled their lands.",
      "大殿上，君主（**monarch**）坐在王座（**throne**）上，手握金色权杖（**scepter**），传令官（**herald**）高声宣读最新的法令（**decree**）。这十个词帮你想象国王与女王如何统治他们的国土。",
    ),
    watchOut: {
      meanings: t(
        "Tell **heir** (the person who *will* rule or own something later) apart from **monarch** (the king or queen who rules *now*).",
        "分清 **heir**（将来继承王位或财产的人）和 **monarch**（现在在位的国王或女王）。",
      ),
      use: t(
        "Tell **decree** (an order one ruler gives to the people) apart from **treaty** (an agreement signed between countries) and **tribute** (a payment or honor given to someone).",
        "分清 **decree**（统治者向百姓下达的命令）、**treaty**（国家之间签订的协议）和 **tribute**（献给某人的贡品或敬意）。",
      ),
      spelling: t(
        "Watch **heir** (silent *h*, so we say *an heir*), **scepter** (*sc* saying /s/), **sovereign** (silent *g* in *-eign*) and **monarch** (*ch* saying /k/).",
        "注意 **heir** 的 **h** 不发音（所以说 *an heir*）、**scepter** 中读 /s/ 的 **sc**、**sovereign** 结尾 **-eign** 中不发音的 **g**，以及 **monarch** 中读 /k/ 的 **ch**。",
      ),
    },
    notes: `
      realm|a land stretching from northern hills to a southern coast that a king rode across|dragons living in wild mountains at the far edge of the land|every town and farm of a land at peace after a long war|realm is the whole land a ruler controls; throne is the ruler's chair or power|realm 是统治者治理的整片国土；throne 是王座或王权|throne is a ruler's special chair or power, not a stretch of land with towns, farms and mountains|throne 是王座或王权，不是有城镇、农田和山岭的一片土地|citadel is a single fort on high ground, not the whole land that a ruler controls|citadel 是高处的一座要塞，不是统治者掌管的整片国土|realm|the word real with m added at the end|在 real 后面加上 m
      throne|a young queen seated at the end of a great hall|a newly crowned daughter climbing the steps to the royal seat|three cousins at war over who would sit and rule|throne is the ruler's chair; scepter is the rod held in the hand|throne 是王座；scepter 是手中的权杖|scepter is a decorated rod a ruler holds in one hand, not a seat to sit on|scepter 是统治者手握的装饰权杖，不是可以坐的宝座|realm is the land a ruler controls, not the special chair where a ruler sits|realm 是统治者治理的国土，不是统治者坐的宝座|throne|th at the start and a silent e making the o long|th 开头，结尾的 e 不发音，让 o 读长音
      heir|a prince who would become king when his father died|a girl who would one day own her grandmother's farm|a king with no child to take over after him|heir will rule or own something later; monarch rules now|heir 将来继承；monarch 现在在位|monarch is the king or queen who already rules, not someone waiting to receive a title or property later|monarch 是已经在位的国王或女王，不是等着日后继承头衔或财产的人|herald is a messenger who announces news, not the person who will receive a title or property|herald 是宣告消息的传令官，不是日后继承头衔或财产的人|heir|silent h, so it sounds like air|h 不发音，读音和 air 一样
      monarch|a crowned ruler of forty years|the face on every coin of the person on the throne|a queen who makes laws and leads the army|monarch is a king or queen ruling now; heir will rule later|monarch 是在位的君主；heir 是将来的继承人|heir is someone who will receive the crown later, not the king or queen who already rules|heir 是将来才继承王位的人，不是已经在位的国王或女王|governor runs a province or state for someone higher, not a crowned king or queen|governor 是替上级管理一省或一州的长官，不是戴王冠的国王或女王|mon · arch|ch saying /k/ at the end|结尾的 ch 读 /k/
      banquet|roast meats and music to celebrate a royal wedding|long tables set with plates and cups in a castle hall|soldiers eating until full after a victory|banquet is a big formal meal; tribute is a payment or honor given to someone|banquet 是盛大的正式宴会；tribute 是贡品或致敬|tribute is a payment or an act of respect, not a meal that guests sit down to eat|tribute 是贡品或致敬，不是让客人入座享用的饭菜|decree is an official order from a ruler, not a large meal with food and guests|decree 是统治者下达的正式命令，不是有美食和宾客的盛宴|ban · quet|qu saying /kw/ and the -et ending|qu 读 /kw/，结尾是 -et
      decree|a queen ordering that every child must learn to read|a royal order that only the king may hunt in the forest|a ruler's order read aloud in a market square for all to obey|decree is an order from one ruler; treaty is an agreement between countries|decree 是统治者一方下的命令；treaty 是国家之间的协议|treaty is an agreement signed between countries, not an order one ruler gives to the people|treaty 是国家之间签订的协议，不是统治者对百姓下的命令|tribute is a payment or an act of respect, not an order that people must obey|tribute 是贡品或致敬，不是人们必须服从的命令|de · cree|double e at the end|结尾双写 e
      herald|a messenger sent ahead to shout out news of a new law|a trumpet blast before the king's message is read aloud|a messenger crossing a battlefield to the enemy camp|herald announces news that is already decided; seer tells what the future will bring|herald 宣告已经确定的消息；seer 预言未来|seer is a person believed to see the future, not a messenger who carries and reads out a ruler's news|seer 是被认为能预见未来的人，不是传递、宣读统治者消息的信使|heir is the person who will receive a title or property, not a messenger who carries news|heir 是将来继承头衔或财产的人，不是传递消息的信使|her · ald|the -ald ending, not -old|结尾是 -ald 不是 -old
      tribute|gold paid every year to show obedience to an emperor|a concert honoring a singer who had died|grain sent by each village as a gift showing an emperor's power|tribute is paid to a ruler or given to honor someone; tariff is a tax on goods coming into a country|tribute 是献给统治者的贡品或致敬；tariff 是进口货物的关税|tariff is a tax on goods brought into a country, not a gift or payment that shows respect to someone|tariff 是对进口货物征的税，不是表示敬意或臣服的献礼|decree is an order a ruler gives, not something given to a ruler or a hero to show respect|decree 是统治者下达的命令，不是献给统治者或英雄以示敬意的东西|trib · ute|the -ute ending with a silent e|结尾 -ute 的 e 不发音
      sovereign|a ruler with the final word on every law and no one above her|lords kneeling before the crowned ruler|an emperor who answered to no one|sovereign is the ruler with the highest power; heir will only rule later|sovereign 是拥有最高权力的统治者；heir 只是将来继承的人|heir is someone who will receive power later, not the ruler who holds the highest power now|heir 是日后才得到权力的人，不是现在掌握最高权力的统治者|herald is a messenger who serves a ruler, not the ruler with the highest power|herald 是为统治者传话的信使，不是拥有最高权力的统治者|sov · er · eign|the silent g in -eign|结尾 -eign 中的 g 不发音
      scepter|a golden rod raised in a king's hand to silence a crowd|a crowned queen holding something in her right hand|a jeweled rod too heavy for an old king to lift in one hand|scepter is the rod a ruler holds; throne is the chair a ruler sits on|scepter 是手中的权杖；throne 是坐的王座|throne is a large chair to sit on, not a rod held in one hand|throne 是可以坐的宝座，不是一只手握着的权杖|tribute is a payment or an act of respect, not a decorated rod that a ruler carries|tribute 是贡品或致敬，不是统治者手持的装饰权杖|scep · ter|sc saying /s/ and the American -ter ending (British sceptre)|sc 读 /s/，美式结尾是 -ter（英式拼作 sceptre）
    `,
  },
);

const light = batch(
  "words-for-light-and-shadow",
  ["Words for Light and Shadow", "光与影的词"],
  ["light, darkness and color", "光、暗与色彩"],
  `
  radiant|shining brightly; also glowing with happiness|光芒四射的；容光焕发的|She gave us a ___ smile, her whole face glowing with joy at the good news.|On the clear morning, the ___ sun rose over the hills and filled the valley with bright light.|The bride looked ___ with happiness as she walked down the aisle.|murky,hazy
  glimmer|a faint, wavering light; also a small sign of something|微光；一丝|There was still a ___ of hope that the lost dog would come home.|The candle's faint, flickering ___ lit the corner of the room for hours.|Through the fog, the sailors could just make out the weak, wavering ___ of a lighthouse far away.|glint,gloom|glimmers,glimmered
  dusk|the time of evening when it is getting dark|黄昏|The streetlights came on at ___, just as the sun went down.|Bats fly out of the cave every evening at ___ to hunt.|The farmer worked from dawn until ___, stopping only when the sun had set.|gloom,glimmer
  crimson|a deep red color|深红色（的）|As the sun went down, the clouds turned a deep ___, the color of blood.|She wore a ___ scarf, as red as a ripe cherry, against the white snow.|The knight's ___ cape was dyed the deep red of rubies.|radiant,hazy
  luminous|giving off light; glowing|发光的，明亮的|The ___ hands of my watch glow in the dark, so I can read the time at night.|Tiny ___ jellyfish lit up the black water with their own green light.|The ___ stars on my ceiling shine softly after I turn off the light.|murky,hazy
  murky|dark and dirty, so it is hard to see through|昏暗的，浑浊的|We could not see the bottom of the ___ pond, because the water was brown with mud.|The fish disappeared into the ___ water stirred up by the storm.|After the flood, the river was ___ and full of dirt, so no one could see the stones beneath.|hazy,luminous
  dazzling|so bright that it almost blinds you; very impressive|耀眼的；令人赞叹的|The fresh snow was so ___ in the morning sun that we had to shield our eyes.|The dancer gave a ___ performance, and the crowd jumped to its feet to cheer.|Bright, ___ fireworks burst across the night sky and lit up every face below.|hazy,murky
  glint|a small, quick flash of light|闪光|I saw the sudden ___ of a coin in the grass as the sun caught it for just a second.|The guard spun around at the sharp ___ of a knife blade flashing in the moonlight.|A sudden, sharp ___ of sunlight flashing off the soldier's metal helmet gave away where he was hiding.|glimmer,dusk|glints,glinted
  gloom|darkness; also a feeling of sadness|昏暗；忧郁|We could hardly see each other in the ___ of the deep cave.|A feeling of ___ settled over the team after they lost the final, and no one smiled.|The old house was full of dust and ___, with every curtain shut against the light.|dusk,glimmer
  hazy|not clear because of mist or smoke; also not clearly remembered|朦胧的；模糊的|Through the thin morning mist, the far-off mountains looked soft and ___.|My memory of my third birthday is ___, and I can only recall a few blurry moments.|Smoke from the fires made the air so ___ that the far hills looked blurry.|dazzling,crimson
  `,
  "context-clues",
  {
    intro: t(
      "At **dusk**, the **crimson** sky slowly faded into **gloom**, until only the faint **glimmer** of a lantern lit the path. These ten words help you paint light, color and darkness in your writing.",
      "黄昏（**dusk**）时分，深红色（**crimson**）的天空渐渐沉入昏暗（**gloom**），最后只剩一盏灯笼的微光（**glimmer**）照着小路。这十个词帮你在写作中描绘光、色彩与黑暗。",
    ),
    watchOut: {
      meanings: t(
        "Tell **glimmer** (a faint light that wavers and lasts) apart from **glint** (a quick, sharp flash, often off metal or glass).",
        "分清 **glimmer**（微弱、摇曳、会持续的光）和 **glint**（金属或玻璃上一闪而过的亮光）。",
      ),
      use: t(
        "Tell **murky** (dark, dirty water or mud you cannot see through) apart from **hazy** (blurred by mist or smoke, or not clearly remembered).",
        "分清 **murky**（浑浊、看不透的脏水）和 **hazy**（被雾或烟遮得朦胧，或记忆模糊）。",
      ),
      spelling: t(
        "Watch **luminous** (*-inous*), **dazzling** (double *z*, and the *e* of *dazzle* dropped), **crimson** (*-son*) and **radiant** (*-iant*).",
        "注意 **luminous** 的 **-inous**、**dazzling** 的双写 **z**（并去掉 dazzle 的 e）、**crimson** 的 **-son**，以及 **radiant** 的 **-iant**。",
      ),
    },
    notes: `
      radiant|a smile on a face glowing with joy at good news|a sun filling a valley with bright light on a clear morning|a bride glowing with happiness as she walks down the aisle|radiant means shining brightly or glowing with joy; hazy means blurred and unclear|radiant 指光芒四射或容光焕发；hazy 指朦胧不清|murky means dark and dirty so you cannot see through it, the opposite of shining or glowing|murky 指浑浊昏暗、看不透，与光彩照人正相反|hazy means blurred by mist or smoke, not shining clearly or glowing with joy|hazy 指被雾或烟弄得朦胧，不是明亮耀眼或满面喜悦|ra · di · ant|long a and the -iant ending|a 读长音，结尾是 -iant
      glimmer|a small sign of hope that a lost dog will come home|a faint, flickering candle lighting a corner for hours|the weak, wavering light of a far-off lighthouse seen through fog|glimmer is faint and wavering; glint is a quick, sharp flash|glimmer 是微弱摇曳的光；glint 是一闪而过的亮光|glint is a quick, sharp flash, not a faint, wavering light or a small sign of hope|glint 是短促明亮的一闪，不是微弱摇曳的光或一丝希望|gloom is darkness or sadness, not a little light or a little hope|gloom 是黑暗或忧郁，不是一点亮光或一丝希望|glim · mer|double m before -er|-er 前面双写 m
      dusk|streetlights coming on just as the sun goes down|bats leaving a cave every evening to hunt|a farmer working from dawn until the sun has set|dusk is a time of evening; gloom is darkness or sadness at any time|dusk 是傍晚的时刻；gloom 是任何时候都可能有的昏暗或忧郁|gloom is darkness or sadness, not a time of day that comes each evening|gloom 是昏暗或忧郁，不是每天傍晚到来的时刻|glimmer is a faint, wavering light, not the time of day when evening comes|glimmer 是微弱摇曳的光，不是傍晚这个时刻|dusk|the sk ending|结尾是 sk
      crimson|clouds turning the color of blood at sunset|a scarf as red as a ripe cherry against white snow|a knight's cape dyed the deep red of rubies|crimson names a deep red color; radiant means shining brightly|crimson 是深红色；radiant 是明亮耀眼|radiant means shining brightly or glowing with joy, not a deep red color|radiant 指光芒四射或喜气洋洋，不是一种深红的颜色|hazy means blurred by mist or smoke, not a color such as deep red|hazy 指被雾或烟弄得朦胧，不是深红这样的颜色|crim · son|the -son ending, not -sen|结尾是 -son 不是 -sen
      luminous|watch hands that glow in the dark|jellyfish lighting up black water with their own green light|ceiling stars that shine softly after the light goes off|luminous means giving off its own light; murky means dark and hard to see through|luminous 指自己发光；murky 指昏暗浑浊|murky means dark and dirty so that light cannot pass, the opposite of giving off light|murky 指昏暗浑浊、光线透不过，与自己发光正相反|hazy means blurred by mist or smoke, not glowing with light in the dark|hazy 指被雾或烟弄得朦胧，不是在黑暗中发光|lu · mi · nous|the -inous ending, not -enous|结尾是 -inous 不是 -enous
      murky|a pond too brown with mud to see the bottom|water stirred up by a storm where fish disappear|a flooded river full of dirt hiding the stones beneath|murky is dark, dirty water; hazy is air blurred by mist or smoke|murky 指浑浊的脏水；hazy 指被雾或烟弄得朦胧的空气|hazy describes air blurred by mist or smoke, not water made dark and dirty with mud|hazy 形容被雾或烟弄得朦胧的空气，不是被泥搅脏的浑水|luminous means glowing with light, the opposite of dark, dirty water you cannot see through|luminous 指发光明亮，与看不透的浑浊脏水正相反|mur · ky|ur and the -ky ending, not -key|ur 加结尾 -ky，不是 -key
      dazzling|fresh snow so bright in the sun that eyes need shielding|a performance that brings a crowd to its feet|bright fireworks lighting every face below|dazzling means almost blindingly bright or very impressive; hazy means dim and blurred|dazzling 指耀眼夺目或令人赞叹；hazy 指暗淡朦胧|hazy means dim and blurred by mist or smoke, the opposite of something bright or impressive|hazy 指被雾或烟弄得暗淡模糊，与耀眼夺目、令人赞叹正相反|murky means dark and dirty so you cannot see through it, not brilliantly bright or impressive|murky 指昏暗浑浊、看不透，不是光彩夺目或精彩惊人|daz · zling|double z, and the e of dazzle dropped before -ing|双写 z，并去掉 dazzle 的 e 再加 -ing
      glint|a coin catching the sun for just a second in the grass|a knife blade flashing sharply in the moonlight|a sudden, sharp flash of sunlight off a hidden soldier's metal helmet|glint is a quick, sharp flash; glimmer is a faint, wavering light|glint 是一闪而过的亮光；glimmer 是微弱摇曳的光|glimmer is a faint, wavering light that lingers, not a sudden sharp flash off metal|glimmer 是微弱摇曳、会持续的光，不是金属上突然一闪的亮光|dusk is the time of evening when it gets dark, not a flash of light|dusk 是天色变暗的傍晚时分，不是一道闪光|glint|gl blend and the -int ending|gl 连缀，结尾是 -int
      gloom|a deep cave so dark that people can hardly see each other|a sad feeling over a team after losing the final|an old house full of dust with every curtain shut|gloom is darkness or sadness; dusk is just the time when evening comes|gloom 是昏暗或忧郁；dusk 只是傍晚时分|dusk is a time of evening, not the darkness of a closed place or a sad mood|dusk 是傍晚时分，不是封闭处的昏暗或低落的心情|glimmer is a faint light or a small sign of hope, the opposite of darkness and sadness|glimmer 是一点微光或一丝希望，与黑暗和忧郁正相反|gloom|gl followed by double o saying /uː/|gl 后面双写 o，读 /uː/
      hazy|far-off mountains looking soft through thin morning mist|a memory of a third birthday with only a few blurry moments|air so full of smoke that far hills look blurry|hazy means blurred and unclear; dazzling means sharply, blindingly bright|hazy 指模糊不清；dazzling 指亮得刺眼|dazzling means so bright it almost blinds you, the opposite of soft and blurred|dazzling 指亮得几乎睁不开眼，与柔和模糊正相反|crimson is a deep red color, not a blur caused by mist, smoke or a weak memory|crimson 是深红色，不是雾、烟或记忆不清造成的模糊|ha · zy|long a and a z, not an s|a 读长音，用 z 不用 s
    `,
  },
);

const moving = batch(
  "words-for-ways-of-moving",
  ["Words for Ways of Moving", "各种动作的词"],
  ["ways of moving", "移动的方式"],
  `
  plunge|to jump or fall suddenly into something|跳入，猛冲|From the high board, the diver will ___ headfirst into the deep pool.|Prices ___ when nobody wants to buy.|On the hot day, the children ran to the lake to ___ into the cool water.|swoop,hurtle|plunged,plunges
  flutter|to move with small, quick flapping movements|飘动，振翅|The butterfly's wings ___ gently as it lands on the flower.|Flags ___ in the breeze above the castle.|My heart began to ___ with nervous little beats when she called my name.|swoop,scurry|fluttered,flutters
  scurry|to run with short, quick steps|急匆匆地小跑|Mice ___ across the kitchen floor with quick little steps when the light goes on.|When the bell rings, the children ___ to their seats as fast as they can.|We watched the frightened crabs ___ sideways into their holes in a hurry.|saunter,trudge|scurried,scurries
  trudge|to walk slowly and heavily, as if tired|跋涉，步履艰难地走|We had to ___ through deep snow for hours, lifting each heavy boot slowly and steadily.|After the long march, the tired soldiers ___ home in a slow, heavy, steady line.|After losing the game, the players ___ slowly back to the bus, their heavy feet dragging one step after another.|saunter,stagger|trudged,trudges
  lurch|to make a sudden, unsteady movement|突然倾斜，蹒跚|When the driver braked hard, the bus began to ___ and we all grabbed the rails.|In the storm, the ship began to ___ from side to side as the waves struck it.|The old cart would suddenly ___ to one side whenever its wheel hit a stone.|stagger,swoop|lurched,lurches
  meander|to follow a winding path; to wander slowly|蜿蜒；漫步|Rivers ___ slowly across a flat plain in wide, winding loops.|The little path seems to ___ through the woods, twisting and turning all the way to the lake.|The stream will ___ back and forth across the meadow before it reaches the sea.|saunter,scurry|meandered,meanders
  stagger|to walk unsteadily, almost falling|摇摇晃晃地走|For the last fifty meters, the injured runner began to ___, swaying and almost falling with every step.|Under the heavy load, the donkey started to ___, its legs wobbling and buckling as it walked.|After spinning around ten times, the dizzy children ___ across the lawn, bumping into each other.|lurch,trudge|staggered,staggers
  hurtle|to move very fast, often out of control|飞驰，猛冲|The train will ___ through the tunnel at full speed.|We watched the runaway sled ___ across the icy yard, out of control, and crash into the fence.|The truck with no brakes began to ___ along the road, faster and faster.|plunge,swoop|hurtled,hurtles,hurtling
  saunter|to walk in a slow, relaxed way|闲逛，漫步|We like to ___ along the beach after dinner, enjoying the warm breeze and in no hurry at all.|He likes to ___ into class late, smiling and relaxed, as if nothing were wrong.|Tourists ___ through the market in a relaxed way, stopping to look at the stalls.|scurry,trudge|sauntered,saunters
  swoop|to fly down suddenly and quickly|猛扑，俯冲|The eagle will ___ down from the sky to snatch the fish from the river.|Gulls ___ low over the boats, diving and then rising again with scraps of fish.|In one fast, silent dive, the owl will ___ down on the mouse from the branch above.|plunge,flutter|swooped,swoops
  `,
  "context-clues",
  {
    intro: t(
      "In the garden, a hawk would **swoop** from the sky, mice would **scurry** under the hedge, and a tired old dog would **trudge** back to its bed. These ten words help you show exactly how something moves.",
      "花园里，一只鹰从空中俯冲（**swoop**）而下，老鼠在树篱下急匆匆地乱窜（**scurry**），一只累坏的老狗拖着沉重的步子（**trudge**）走回窝里。这十个词帮你准确写出事物移动的样子。",
    ),
    watchOut: {
      meanings: t(
        "Tell **stagger** (walk unsteadily for a while, almost falling) apart from **lurch** (one sudden, jerky movement, as a bus or ship makes).",
        "分清 **stagger**（摇摇晃晃地走一段路，几乎跌倒）和 **lurch**（像车船那样突然猛地一晃）。",
      ),
      use: t(
        "Tell **saunter** (walk slowly because you are relaxed) apart from **trudge** (walk slowly because you are tired and your feet feel heavy).",
        "分清 **saunter**（悠闲地慢慢走）和 **trudge**（因疲惫而拖着沉重的步子慢慢走）。",
      ),
      spelling: t(
        "Watch **scurry** (double *r*; *scurried* changes *y* to *i*), **meander** (*ea*), **hurtle** (*-tle*) and **lurch** (*ur*).",
        "注意 **scurry** 的双写 **r**（scurried 要把 y 变成 i）、**meander** 中的 **ea**、**hurtle** 结尾的 **-tle**，以及 **lurch** 中的 **ur**。",
      ),
    },
    notes: `
      plunge|a diver jumping headfirst from a high board into a deep pool|prices falling suddenly when nobody wants to buy|children jumping into a cool lake on a hot day|plunge means to jump or fall suddenly into something; swoop means to fly down through the air|plunge 是突然跳入或落入；swoop 是从空中俯冲|swoop means to fly down through the air like a bird, not to drop suddenly into water or to a much lower level|swoop 是像鸟一样从空中俯冲，不是突然跳进水里或跌到低得多的位置|hurtle means to rush along very fast and out of control, not to drop suddenly into something below|hurtle 是失控地飞速向前冲，不是突然向下跳入或跌落|plunge|the -nge ending with a soft g|结尾 -nge 中的 g 读软音
      flutter|butterfly wings moving gently as it lands on a flower|flags flapping in the breeze above a castle|a heart beating with nervous little beats at the sound of a name|flutter is small, quick flapping in one place; swoop is a fast dive down|flutter 是原地轻快地扑动；swoop 是快速向下俯冲|swoop means to dive down fast through the air, not to make small, quick flapping movements|swoop 是从空中快速向下俯冲，不是轻快地小幅扑动|scurry means to run with short, quick steps, not to flap or beat lightly in one place|scurry 是迈着小碎步快跑，不是在原地轻轻扑动或跳动|flut · ter|double t before -er|-er 前面双写 t
      scurry|mice crossing a kitchen floor with quick little steps when the light goes on|children hurrying to their seats as fast as they can when the bell rings|frightened crabs hurrying sideways into their holes|scurry is fast, with short quick steps; saunter is slow and relaxed|scurry 是小碎步快跑；saunter 是悠闲慢走|saunter means to walk slowly and calmly, the opposite of hurrying with quick little steps|saunter 是悠闲地慢慢走，与迈着小碎步匆忙奔跑正相反|trudge means to walk slowly and heavily because you are tired, not to hurry with short, quick steps|trudge 是因疲惫而沉重缓慢地走，不是迈着小碎步急匆匆地跑|scur · ry|double r, and y changing to i in scurried|双写 r，过去式 scurried 要把 y 变成 i
      trudge|hours of lifting heavy boots slowly through deep snow|tired soldiers walking home slowly and heavily after a long march|beaten players dragging their heavy feet back to the bus|trudge is slow and heavy because you are tired; saunter is slow because you are relaxed|trudge 是因疲惫而步履沉重；saunter 是因悠闲而慢走|saunter means to stroll in a relaxed, carefree way, not to plod heavily because you are tired|saunter 是轻松随意地闲逛，不是因疲惫而沉重地走|stagger means to walk unsteadily as if about to fall, not to keep plodding in a slow, steady way|stagger 是摇摇晃晃、像要摔倒一样地走，不是一步一步缓慢而稳当地走|trudge|the silent d in -dge|-dge 中的 d 不发音
      lurch|a bus jerking forward when the driver brakes hard|a ship rolling from side to side as storm waves strike it|an old cart jerking to one side when its wheel hits a stone|lurch is a sudden, jerky movement, often of a vehicle; stagger is unsteady walking|lurch 是突然猛地一晃，常指车船；stagger 是走路摇摇晃晃|stagger means to walk unsteadily on your feet, not the sudden jerk of a vehicle|stagger 是用脚走得摇摇晃晃，不是车船突然猛地一晃|swoop means to fly down suddenly like a bird, not to jerk unsteadily sideways or forward|swoop 是像鸟一样猛地俯冲，不是向前或向一侧猛地摇晃|lurch|ur and the -ch ending|ur 加结尾 -ch
      meander|rivers crossing a flat plain in wide, winding loops|a little path twisting and turning through the woods to a lake|a stream winding back and forth across a meadow|meander means to wind along a curving path; saunter means a person walking in a relaxed way|meander 是蜿蜒曲折地延伸；saunter 是人悠闲地走|saunter describes a person walking in a relaxed way, not a river or path that winds in loops|saunter 形容人悠闲地走路，不是河流或小路弯弯曲曲地延伸|scurry means to run with short, quick steps, not to curve slowly back and forth|scurry 是迈着小碎步快跑，不是慢慢地来回弯绕|me · an · der|ea split into two sounds, and the -der ending|ea 分成两个音来读，结尾是 -der
      stagger|an injured runner swaying and almost falling for the last fifty meters|a donkey walking on wobbling legs under a heavy load|dizzy children bumping into each other across a lawn|stagger is unsteady walking that goes on for a while; lurch is one sudden jerk|stagger 是持续地摇晃着走；lurch 是突然猛地一晃|lurch means to make one sudden, jerky movement, not to walk unsteadily step after step|lurch 是突然猛地一晃，不是一步接一步地摇晃着走|trudge means to walk slowly and heavily but steadily, not to sway as if about to fall|trudge 是沉重而稳当地慢慢走，不是摇摇晃晃像要摔倒|stag · ger|double g before -er|-er 前面双写 g
      hurtle|a train racing through a tunnel at full speed|a runaway sled crossing an icy yard out of control|a truck with no brakes going faster and faster along a road|hurtle means to rush very fast, often out of control; plunge means to drop suddenly into something|hurtle 是失控地飞速冲；plunge 是突然跳入或落入|plunge means to jump or fall suddenly into something, not to race along at great speed|plunge 是突然跳入或落入某物，不是沿路飞速向前冲|swoop means to fly down suddenly like a bird, not to rush along the ground or a track|swoop 是像鸟一样从空中俯冲，不是沿地面或轨道飞速冲过|hur · tle|ur and the -tle ending|ur 加结尾 -tle
      saunter|an easy after-dinner walk along a beach in a warm breeze|a smiling, relaxed walk into class late|tourists walking through a market in a relaxed way|saunter is slow and relaxed; trudge is slow and tired|saunter 是悠闲慢走；trudge 是疲惫地慢走|scurry means to hurry with short, quick steps, the opposite of a slow, relaxed walk|scurry 是迈着小碎步匆忙跑，与悠闲慢走正相反|trudge means to walk slowly and heavily because you are tired, not to stroll in a relaxed, carefree way|trudge 是因疲惫而沉重地慢慢走，不是轻松随意地闲逛|saun · ter|au saying /ɔː/ and the -ter ending|au 读 /ɔː/，结尾是 -ter
      swoop|an eagle diving from the sky to snatch a fish|gulls diving low over boats and rising again with scraps|an owl's fast, silent dive onto a mouse|swoop is a bird's fast dive through the air; flutter is small, quick flapping|swoop 是鸟在空中快速俯冲；flutter 是轻快的小幅扑动|plunge means to jump or fall suddenly into something such as water, not to dive through the air and catch prey|plunge 是突然跳进水里等地方，不是在空中俯冲去抓猎物|flutter means to flap lightly with small, quick movements, not to dive down fast|flutter 是轻快地小幅扑动，不是快速向下俯冲|swoop|sw blend and double o|sw 连缀，双写 o
    `,
  },
);

const sounds = batch(
  "words-for-sounds",
  ["Words for Sounds", "声音的词"],
  ["sounds", "声音"],
  `
  screech|a loud, high, harsh sound|尖叫声，刺耳声|The car stopped with a loud ___ of brakes.|The chalk made a harsh ___ on the board that hurt our ears.|The parrot gave a harsh, ear-splitting ___ every time the cat came near.|wail,clang|screeched,screeches
  clatter|a loud noise of hard things hitting each other|哐啷声|The pile of plates slid off the table and hit the floor in a noisy ___ of rattling pieces.|We heard the ___ of hooves on the stone road as the horses trotted past.|The ___ of knives, forks and plates in the busy kitchen made it hard to talk.|clang,thud|clattered
  wail|a long, high cry of pain or sadness|哀号，恸哭|The baby let out a long, loud ___ when her toy fell out of the window.|We heard the rising and falling ___ of a siren in the distance.|The mourners began to ___ with grief, crying out long and loud for the dead king.|whimper,bellow|wailed,wails
  shriek|a short, very high scream|尖叫|She let out a ___, short and very high, when the spider ran over her hand.|The little girl gave a high, happy ___ as the swing flew up into the air.|A sudden, piercing ___ came from the dark house, and then everything was silent.|whimper,bellow|shrieked,shrieks
  bellow|to shout or roar in a deep, loud voice|吼叫，怒吼|The coach had to ___ in a deep, loud voice to be heard over the crowd.|The angry bull let out a deep ___ and charged.|The giant would ___ so loudly that his deep voice shook the walls of the castle.|wail,shriek|bellowed,bellows
  whimper|a soft, weak cry|呜咽|The puppy began to ___ softly when its owner left.|A weak, frightened ___ like a crying child's came from under the bed.|The lost child started to ___ quietly, too tired to cry out loud.|wail,hiss|whimpered,whimpers
  clang|a loud ringing sound of metal hitting metal|叮当声，铛铛声|The heavy iron prison gate slammed shut with a single loud ___.|We heard the ringing ___ of the blacksmith's hammer striking the iron.|The heavy pot hit the metal sink with a loud ___ that rang for a second.|chime,clatter|clanged,clangs
  hiss|a sound like a long s|嘶嘶声|The snake gave a warning ___ before it struck.|Steam began to ___ out of the kettle.|Air leaked from the tire with a long, slow ___.|bellow,thud|hissed,hisses
  chime|a ringing sound like a bell; also to ring|钟声；鸣响|The clock began to ___ softly at midnight, ringing twelve times.|We heard the soft, musical ___ of the wind bells on the porch.|The doorbell played a gentle ___ of three sweet notes when we pressed it.|clang,screech|chimed,chimes
  thud|a dull sound of something heavy falling|砰的一声|The heavy book fell onto the carpet with a dull ___.|We heard a soft, heavy ___ as the apple hit the grassy ground.|The sack of potatoes landed on the floor with a dull ___.|clatter,clang|thudded,thuds
  `,
  "context-clues",
  {
    intro: t(
      "In the old castle, a door shut with a **thud**, chains fell with a **clatter**, and from the tower came a long **wail**. These ten words help you make readers hear what happens in a story.",
      "古堡里，一扇门砰（**thud**）的一声关上，铁链哐啷（**clatter**）一声落地，塔楼上传来一声长长的哀号（**wail**）。这十个词帮你让读者“听见”故事里发生的事。",
    ),
    watchOut: {
      meanings: t(
        "Tell **wail** (a long, loud cry of pain or sadness) apart from **whimper** (a soft, weak cry) and **shriek** (a short, very high scream).",
        "分清 **wail**（长而响的哀号）、**whimper**（轻弱的呜咽）和 **shriek**（短促的尖叫）。",
      ),
      use: t(
        "Tell **clang** (one ringing sound of metal on metal) apart from **clatter** (many hard things banging together) and **thud** (one dull sound of something heavy landing).",
        "分清 **clang**（金属相撞的一声铛响）、**clatter**（许多硬物碰撞的哐啷声）和 **thud**（重物落地的一声闷响）。",
      ),
      spelling: t(
        "Watch **screech** (*ee* and *-ch*, with no *t*), **shriek** (*ie*), **whimper** (*wh*) and **bellow** (double *l* and *-ow*).",
        "注意 **screech** 的 **ee** 和结尾 **-ch**（没有 t）、**shriek** 中的 **ie**、**whimper** 开头的 **wh**，以及 **bellow** 的双写 **l** 和 **-ow**。",
      ),
    },
    notes: `
      screech|brakes making a loud sound as a car stops|chalk scraping on a board with a sound that hurts the ears|a parrot's harsh, ear-splitting cry when a cat comes near|screech is a harsh, high sound; wail is a long cry of sadness|screech 是尖利刺耳的声音；wail 是悲伤的长声哀号|wail is a long cry of pain or sadness, not a harsh, scraping sound|wail 是痛苦或悲伤的长声哀号，不是尖利刺耳的摩擦声|clang is the ringing sound of metal hitting metal, not a harsh, high, scraping noise|clang 是金属相撞的铛铛声，不是尖利刺耳的高音|screech|scr blend, ee and the -ch ending with no t|scr 连缀，中间是 ee，结尾 -ch 没有 t
      clatter|a pile of plates crashing to the floor in rattling pieces|horses' hooves trotting on a stone road|knives, forks and plates rattling in a busy kitchen|clatter is many hard things banging together; clang is one ringing metal sound|clatter 是许多硬物碰撞的声音；clang 是一声金属铛响|clang is one loud ringing sound of metal on metal, not the rattle of many hard things knocking together|clang 是金属相撞的一声铛响，不是许多硬物碰在一起的哐啷声|thud is one dull sound of something heavy landing, not a noisy rattle of many hard pieces|thud 是重物落下的一声闷响，不是许多硬物噼里啪啦的碰撞声|clat · ter|cl blend and double t before -er|cl 连缀，-er 前面双写 t
      wail|a baby's long, loud cry when her toy falls out of a window|a siren rising and falling in the distance|mourners crying out long and loud for a dead king|wail is a long, loud cry of sadness; whimper is a soft, weak cry|wail 是长而响的哀号；whimper 是轻弱的呜咽|whimper is a soft, weak cry, not a long, loud one|whimper 是轻弱的呜咽，不是长而响的哭喊|bellow is a deep, roaring shout, not a long, high cry of sadness|bellow 是低沉的吼叫，不是高而长的悲伤哭号|wail|ai saying a long a; it sounds like whale but is spelled w-a-i-l|ai 读长音 a，与 whale 同音但拼作 w-a-i-l
      shriek|a short, very high cry when a spider runs over a hand|a little girl's high, happy cry as a swing flies up|a sudden, piercing cry from a dark house|shriek is a short, very high scream; bellow is a deep roar|shriek 是短促的尖叫；bellow 是低沉的吼叫|whimper is a soft, weak cry, not a sharp, piercing scream|whimper 是轻弱的呜咽，不是刺耳的尖叫|bellow is a deep, loud roar, not a short, very high scream|bellow 是低沉响亮的吼叫，不是短促的高声尖叫|shriek|ie, as in field (i before e)|ie 的顺序和 field 一样（i 在 e 前）
      bellow|a coach shouting in a deep voice over a crowd|an angry bull's deep roar before it charges|a giant's voice so deep and loud it shakes castle walls|bellow is a deep, loud roar; shriek is a short, very high scream|bellow 是低沉响亮的吼叫；shriek 是短促的尖叫|wail is a long, high cry of pain or sadness, not a deep, roaring shout|wail 是痛苦悲伤的高声长号，不是低沉的吼叫|shriek is a short, very high scream, not a deep, loud roar|shriek 是短促的高声尖叫，不是低沉响亮的吼叫|bel · low|double l and the -ow ending|双写 l，结尾是 -ow
      whimper|a puppy crying softly when its owner leaves|a weak, frightened cry like a child's from under a bed|a tired lost child crying quietly|whimper is a soft, weak cry; wail is a long, loud one|whimper 是轻弱的呜咽；wail 是长而响的哀号|wail is a long, loud cry, not a soft, weak one|wail 是长而响的哭号，不是轻弱的呜咽|hiss is a sound like a long s, made by a snake or steam, not a weak, crying sound|hiss 是蛇或蒸汽发出的嘶嘶声，不是微弱的哭声|whim · per|wh at the start and the -per ending|wh 开头，结尾是 -per
      clang|a heavy iron prison gate slamming shut|a blacksmith's hammer striking iron|a heavy pot hitting a metal sink and ringing|clang is a loud, harsh ring of metal on metal; chime is a soft, musical bell sound|clang 是金属相撞的响亮铛声；chime 是柔和悦耳的钟铃声|chime is a soft, musical ringing like a bell, not a loud bang of heavy metal|chime 是柔和悦耳的铃声，不是沉重金属撞击的巨响|clatter is the rattle of many hard things knocking together, not one ringing strike of metal|clatter 是许多硬物碰撞的哐啷声，不是金属一次撞击的铛响|clang|cl blend and the -ng ending|cl 连缀，结尾是 -ng
      hiss|a snake's warning sound before it strikes|steam escaping from a kettle|air leaking slowly from a tire|hiss is a long s sound; bellow is a deep, loud roar|hiss 是长长的嘶嘶声；bellow 是低沉的吼叫|bellow is a deep, loud roar from a throat, not a long s sound of air or steam|bellow 是从喉咙发出的低沉吼叫，不是空气或蒸汽的嘶嘶声|thud is a dull sound of something heavy falling, not a long s sound|thud 是重物落下的闷响，不是长长的嘶嘶声|hiss|double s at the end|结尾双写 s
      chime|a clock ringing softly twelve times at midnight|the soft, musical sound of wind bells on a porch|a doorbell playing three sweet notes|chime is a soft, musical bell sound; clang is a harsh metal bang|chime 是柔和悦耳的铃声；clang 是刺耳的金属撞击声|clang is a loud, harsh ring of metal striking metal, not a soft, sweet bell sound|clang 是金属撞击的响亮刺耳声，不是柔和甜美的铃声|screech is a harsh, high, unpleasant sound, not a gentle, musical ring|screech 是尖利刺耳、难听的声音，不是柔和悦耳的铃声|chime|ch and the silent e making the i long|ch 开头，结尾的 e 不发音，让 i 读长音
      thud|a heavy book landing on a carpet|an apple hitting grassy ground|a sack of potatoes landing on a floor|thud is a dull sound of something heavy landing; clang is a ringing metal sound|thud 是重物落下的闷响；clang 是金属的铛响|clatter is the rattle of many hard things banging together, not one dull landing|clatter 是许多硬物碰撞的哐啷声，不是一声低沉的落地声|clang is a loud ringing sound of metal, not a dull sound of something heavy landing|clang 是金属响亮的铛声，不是重物落下的沉闷声|thud|th and a short u|th 开头，u 读短音
    `,
  },
);

const romanLaw = batch(
  "words-of-roman-law-and-power",
  ["Words of Roman Law and Power", "罗马法律与权力的词"],
  ["law and power in ancient Rome", "古罗马的法律与权力"],
  `
  veto|the right to reject a decision or law; also to reject it|否决（权）|A tribune could use his ___ to block any law that harmed the common people.|The president used her ___ to stop the new tax from becoming law.|The council voted for the plan, but the mayor's ___ stopped it from going ahead.|censor,tribune|vetoed,vetoes
  dictator|a ruler with total power over a country|独裁者|In an emergency, Rome could give one man total power as ___ for six months.|The ___ ruled without any vote of the people and silenced anyone who disagreed.|People were afraid to speak against the ___, who could throw anyone into prison.|tribune,statesman|dictators
  patrician|a member of the old, rich, noble families of Rome|（古罗马的）贵族|Only a ___, born into one of the old noble families, could become a priest in early Rome.|The ___, proud of his noble family, lived in a large house on the hill.|Noble ___ families owned most of the land.|plebeian,magistrate|patricians
  plebeian|an ordinary citizen of Rome, not a noble|（古罗马的）平民|A ___ was an ordinary citizen, such as a farmer, a shopkeeper or a soldier, not a noble.|As a ___, the poor farmer had few rights compared with the noble families.|Over time, the laws changed so that a ___, not just a noble, could become a consul.|patrician,tribune|plebeians
  magistrate|an official who enforces the law and judges cases|地方行政官，治安官|The ___ listened to both sides of the case before giving his ruling.|The thief was brought before the ___, who judged him and set his punishment.|As a ___, she decided cases in court and made sure the law was obeyed.|censor,tribune|magistrates
  province|an area of land ruled as part of a larger country or empire|行省|Egypt was a rich ___ of the Roman Empire that sent grain to Rome.|Each ___ was ruled by a governor sent from Rome.|After Caesar's long war, Gaul became one more Roman ___, run from far away.|realm,citadel|provinces
  governor|the person who runs a province or state|总督，州长|The ___ of the province collected taxes for Rome and kept order there.|The new ___ built roads and bridges across the land he had been sent to run.|Each state in the country elects a ___ to run it for four years.|magistrate,dictator|governors
  tribune|an official elected to protect the rights of ordinary Romans|保民官|The ___ spoke for the plebeians and protected them from unfair laws.|No one was allowed to harm a ___ while he held office protecting the common people.|The common people elected a ___ to stand up for their rights.|censor,patrician|tribunes
  statesman|a wise and respected political leader|政治家|Cicero was a famous ___ who won elections and gave wise speeches in the Senate.|A true ___ thinks about the future of the country, not just the next election.|The old ___, respected by every party, was asked to end the quarrel between the two leaders.|dictator,monarch|statesmen
  censor|a Roman official who counted the citizens; also to remove parts of a text|监察官；审查|The ___ kept a list of every citizen and how much property he owned.|Every five years, the ___ counted the citizens of Rome and wrote down their names.|As ___, he checked how every senator behaved and could throw out anyone who acted badly.|magistrate,tribune|censors,censored
  `,
  "words-of-ancient-rome",
  {
    intro: t(
      "In the Roman Senate, a proud **patrician** argued with a **tribune**, who threatened to **veto** the new law to protect every **plebeian**. These ten words help you follow who held power in ancient Rome.",
      "在罗马元老院，一位傲慢的贵族（**patrician**）与保民官（**tribune**）争论不休，保民官威胁要否决（**veto**）新法，以保护每一位平民（**plebeian**）。这十个词帮你弄清古罗马由谁掌握权力。",
    ),
    watchOut: {
      meanings: t(
        "Tell **patrician** (a member of Rome's old noble families) apart from **plebeian** (an ordinary Roman citizen) and **tribune** (the official elected to protect ordinary citizens).",
        "分清 **patrician**（罗马古老贵族家族的成员）、**plebeian**（罗马普通平民）和 **tribune**（选出来保护平民的官员）。",
      ),
      use: t(
        "Tell **province** (a land ruled as part of an empire) apart from **governor** (the person sent to run it) and **realm** (a whole kingdom).",
        "分清 **province**（帝国下辖的一个行省）、**governor**（派去管理行省的人）和 **realm**（一整个王国）。",
      ),
      spelling: t(
        "Watch **plebeian** (*-eian*), **patrician** (*-cian*), **magistrate** (*-ate*) and **statesman** (*states-* with an *s*).",
        "注意 **plebeian** 的 **-eian**、**patrician** 的 **-cian**、**magistrate** 的 **-ate**，以及 **statesman** 中带 **s** 的 **states-**。",
      ),
    },
    notes: `
      veto|a tribune blocking any law that harmed the common people|a president stopping a new tax from becoming law|a mayor stopping a plan the council voted for|veto is the power to reject a decision; tribune is the official who could use it|veto 是否决的权力；tribune 是可以行使这种权力的官员|censor is a Roman official who counted citizens, or someone who cuts parts of a text, not the right to block a law|censor 是清点公民的罗马官员或删减文字的人，不是阻止法律通过的权力|tribune is a person, an official of Rome, not the power to reject a law or plan|tribune 是一个人——罗马的官员，不是否决法律或计划的权力|ve · to|long e and the -o ending; vetoes adds -es|e 读长音，结尾是 -o；复数 vetoes 加 -es
      dictator|one man given total power over Rome for six months|a ruler who rules without any vote and silences anyone who disagrees|a ruler who could throw anyone into prison|dictator rules with total power and no vote; statesman is a wise, respected leader|dictator 拥有不受约束的权力；statesman 是明智受敬重的政治家|tribune is an elected official who protected ordinary people, not a ruler with total power over everyone|tribune 是选出来保护平民的官员，不是对所有人拥有绝对权力的统治者|statesman is a wise leader respected by the people, not a ruler who holds total power and silences others|statesman 是受人民尊敬的明智领袖，不是独揽大权、压制异见的统治者|dic · ta · tor|the -tor ending, not -ter|结尾是 -tor 不是 -ter
      patrician|a person born into an old noble family who could become a priest|a proud member of a noble family living in a large house|noble families owning most of the land|patrician is a Roman noble; plebeian is an ordinary Roman citizen|patrician 是罗马贵族；plebeian 是罗马平民|plebeian is an ordinary citizen of Rome, not a member of the old noble families|plebeian 是罗马的普通平民，不是古老贵族家族的成员|magistrate is an official who judges cases, a job someone holds rather than the noble family they are born into|magistrate 是审理案件的官员，是担任的职务，而不是出身的贵族家族|pa · tri · cian|the -cian ending, as in musician|结尾是 -cian，和 musician 一样
      plebeian|an ordinary citizen such as a farmer, a shopkeeper or a soldier|a poor farmer with few rights compared with noble families|a commoner, not just a noble, becoming consul under new laws|plebeian is an ordinary citizen; patrician is a noble|plebeian 是平民；patrician 是贵族|patrician is a member of Rome's old noble families, not an ordinary citizen|patrician 是罗马古老贵族家族的成员，不是普通平民|tribune is an official elected to protect ordinary citizens, not an ordinary citizen in general|tribune 是选出来保护平民的官员，不是泛指普通平民|ple · be · ian|the -eian ending, with e before ian|结尾是 -eian，ian 前面有 e
      magistrate|an official hearing both sides of a case before ruling|a thief judged and punished by an official|an official deciding cases in court and making sure the law is obeyed|magistrate judges cases; tribune protects ordinary people|magistrate 审理案件；tribune 保护平民|censor is an official who counted citizens and watched how senators behaved, not one who judges court cases|censor 是清点公民、监察元老言行的官员，不是审理案件的官员|tribune is an official who spoke up for ordinary people, not one who judges cases and sets punishments|tribune 是为平民说话的官员，不是审理案件、判定刑罚的官员|mag · is · trate|g followed by is and the -trate ending|g 后面接 is，结尾是 -trate
      province|a rich land of the Roman Empire sending grain to Rome|a land ruled by a governor sent from Rome|Gaul becoming one more Roman land run from far away|province is a part of a larger empire; realm is a whole kingdom|province 是大帝国下属的一部分；realm 是一整个王国|realm is a whole kingdom with its own ruler, not one part of a larger empire run from far away|realm 是有自己统治者的整个王国，不是由远方管辖的帝国一部分|citadel is a single fort on high ground, not a large area of land in an empire|citadel 是高地上的一座要塞，不是帝国中的一大片地区|prov · ince|the -ince ending, not -ence|结尾是 -ince 不是 -ence
      governor|an official collecting taxes for Rome and keeping order in a province|a newly sent official building roads and bridges across the land|the person each state elects to run it for four years|governor runs a province or state; magistrate judges cases|governor 管理一省或一州；magistrate 审理案件|magistrate is an official who judges cases in court, not the person who runs a whole province or state|magistrate 是在法庭上审案的官员，不是管理整个行省或州的人|dictator rules a whole country with total power, not one part of it for someone higher or for a set time|dictator 以绝对权力统治整个国家，不是替上级或在任期内管理一个地区|gov · er · nor|the -or ending after govern|govern 后面加 -or
      tribune|an official speaking for the plebeians against unfair laws|an official who could not be harmed while protecting the common people|an official elected by the common people to stand up for their rights|tribune protects ordinary citizens; patrician is a noble|tribune 保护平民；patrician 是贵族|censor is an official who counted citizens and judged senators' behavior, not the protector of ordinary people|censor 是清点公民、评判元老品行的官员，不是平民的保护者|patrician is a member of a noble family, not an official chosen to protect ordinary people|patrician 是贵族家族的成员，不是被选出保护平民的官员|trib · une|the -une ending with a silent e|结尾 -une 中的 e 不发音
      statesman|a famous speaker who won elections and gave wise speeches|a leader thinking about a country's future beyond the next election|an old leader respected by every party asked to end a quarrel|statesman is a wise, respected political leader; dictator holds total power without a vote|statesman 是明智而受敬重的政治家；dictator 不经选举独揽大权|dictator takes total power without any vote, not a wise leader respected by everyone|dictator 不经选举独揽大权，不是受众人尊敬的明智领袖|monarch is a king or queen who inherits the crown, not a political leader who works with elections and parties|monarch 是世袭王位的国王或女王，不是参与选举和政党政治的领袖|states · man|states with an s in the middle, and the plural statesmen|中间是带 s 的 states，复数是 statesmen
      censor|an official keeping a list of every citizen and his property|an official counting Rome's citizens every five years|an official checking how senators behaved and throwing out bad ones|censor counted citizens and checked senators; magistrate judged court cases|censor 负责清点公民、监察元老；magistrate 审理案件|magistrate is an official who judges court cases, not one who counts citizens and checks senators|magistrate 是审理案件的官员，不是清点公民、监察元老的官员|tribune is an official who protected ordinary people, not one who kept the list of citizens and judged senators|tribune 是保护平民的官员，不是负责登记公民、评判元老的官员|cen · sor|soft c and the -or ending (not censer)|c 读 /s/，结尾是 -or（不要写成 censer）
    `,
  },
);

const romanBuilding = batch(
  "words-of-roman-building",
  ["Words of Roman Building", "罗马建筑的词"],
  ["Roman building", "罗马建筑"],
  `
  villa|a large country house|别墅，庄园|The rich senator spent each summer at his ___, a large country house by the sea.|The ___ had its own gardens, fountains and bedrooms for the family and their guests.|The workers on the farm lived in small huts near the owner's grand ___.|bathhouse,arena|villas
  bathhouse|a building with public baths|公共浴场|Romans met their friends at the public ___ to bathe, swim and talk.|The ___ had hot, warm and cold pools and rooms for changing.|Every Roman town had at least one public ___ where people could soak in warm pools for a small coin.|villa,fountain|bathhouses
  paved|covered with a flat, hard surface such as stone|铺砌的|Roman roads were ___ with large, flat stones fitted tightly together.|The ___ streets stayed clean and firm even after heavy rain, unlike the muddy lanes.|Workers laid flat bricks over the dirt so that the courtyard would be ___ before winter.|fallow,volcanic
  mortar|a mixture of lime, sand and water that holds bricks together|灰浆，砂浆|The builders spread wet ___ between the bricks to hold them together.|Roman ___, a mix of lime, sand and water, was so strong that walls still stand today.|Mix the lime, sand and water well before you spread the ___ on the stones.|pillar,basalt
  vault|an arched roof or ceiling; also a strong room for valuables|拱顶；保险库|The curved ___ of the great hall was painted with stars.|The bank keeps its gold in a locked steel ___ underground.|Roman builders used the arched ___ to roof over wide spaces without columns.|pillar,arena|vaults
  surveyor|a person who measures land to plan building or roads|测量员|The ___ measured the land with rods and chains so the engineers could plan the road.|The Roman ___ used a simple sighting tool to keep the road perfectly straight.|A ___ marked the edges of the new farm with stakes after measuring each side.|censor,steward|surveyors
  arena|a large open space with seats around it for sports or shows|竞技场|Crowds filled the seats of the ___ to watch the chariot races.|The singer performed in a huge ___ in front of thousands of fans.|Gladiators fought on the sand of the ___ while the crowd cheered from the seats around it.|villa,vault|arenas
  fountain|a structure that sends water up into the air|喷泉|The children threw coins into the ___ and watched the water shoot up into the air.|Water from the aqueduct shot up from every ___ in the city and splashed into stone basins.|A stone ___ stood in the middle of the square, splashing water from a lion's mouth.|sewer,bathhouse|fountains
  sewer|an underground pipe that carries away waste water|下水道|Rome's great ___ carried dirty waste water under the streets into the river.|After the storm, rain flowed from the street through a grate into the ___ below.|Workers climbed down to clear the blocked ___ that smelled of waste.|fountain,vault|sewers
  pillar|a tall, strong column that holds up a roof|柱子|A huge stone ___ held up the roof of the temple.|She hid behind a tall ___ so that no one would see her.|Only one tall ___ of the old building is still standing upright.|vault,mortar|pillars
  `,
  "words-of-ancient-rome",
  {
    intro: t(
      "The **surveyor** marked out the ground, workers spread **mortar** between the bricks, and soon a stone **pillar** held up the **vault** of the new **bathhouse**. These ten words help you describe how the Romans built their towns.",
      "测量员（**surveyor**）先在地上划出界线，工人在砖缝间抹上灰浆（**mortar**），很快，一根石柱（**pillar**）便撑起了新公共浴场（**bathhouse**）的拱顶（**vault**）。这十个词帮你描述罗马人如何建造城镇。",
    ),
    watchOut: {
      meanings: t(
        "Tell **vault** (an arched roof, or a locked room for valuables) apart from **pillar** (the upright column that holds a roof up).",
        "分清 **vault**（拱形屋顶，或存放贵重物品的保险库）和 **pillar**（撑起屋顶的直立柱子）。",
      ),
      use: t(
        "Tell **fountain** (clean water sent up into the air) apart from **sewer** (an underground pipe that carries waste water away) and **bathhouse** (a building with pools for bathing).",
        "分清 **fountain**（把清水喷向空中的喷泉）、**sewer**（排走污水的地下管道）和 **bathhouse**（设有浴池的公共浴场）。",
      ),
      spelling: t(
        "Watch **surveyor** (*-or*), **sewer** (*ew*), **vault** (*au*) and **mortar** (*-ar*, not *-er*).",
        "注意 **surveyor** 的 **-or**、**sewer** 中的 **ew**、**vault** 中的 **au**，以及 **mortar** 结尾的 **-ar**（不是 -er）。",
      ),
    },
    notes: `
      villa|a rich senator's large country house by the sea|a house with its own gardens, fountains and bedrooms for family and guests|the owner's grand house near the farm workers' huts|villa is a private country house; bathhouse is a public building for bathing|villa 是私人乡间别墅；bathhouse 是公共浴场|bathhouse is a public building with pools for bathing, not a private house where a family lives|bathhouse 是有浴池的公共建筑，不是一家人居住的私人住宅|arena is a large open space with seats for shows, not a house where people live|arena 是四周设座位的大型表演场地，不是供人居住的房子|vil · la|double l and the -a ending|双写 l，结尾是 -a
      bathhouse|a public place where Romans met friends to bathe, swim and talk|a building with hot, warm and cold pools and changing rooms|a public building in every Roman town with warm pools for a small coin|bathhouse is a public building for bathing; fountain sends water into the air|bathhouse 是公共浴场；fountain 是向空中喷水的喷泉|villa is a private country house, not a public building with pools where anyone can bathe|villa 是私人乡间别墅，不是人人都能去泡澡的公共浴池建筑|fountain is a structure that sends water into the air, not a building with pools to bathe in|fountain 是把水喷向空中的设施，不是有浴池可以洗浴的建筑|bath · house|compound word: bath + house, keeping both h's|合成词：bath 加 house，两个 h 都保留
      paved|Roman roads covered with large, flat stones fitted together|streets that stay clean and firm after heavy rain, unlike muddy lanes|a courtyard covered with flat bricks over the dirt|paved means covered with a flat, hard surface; fallow means plowed but left unplanted|paved 指铺了平整硬面的；fallow 指耕过但休耕的|fallow describes farmland plowed but left without crops, not ground covered with stones or bricks|fallow 形容耕过但暂不种庄稼的田地，不是铺了石块或砖的地面|volcanic means made by or coming from a volcano, not covered with a flat, hard surface by builders|volcanic 指由火山形成或来自火山，不是由工匠铺上平整的硬面|paved|pave with -d added, since the e is already there|pave 后面直接加 d，因为 e 已经有了
      mortar|wet paste spread between bricks to hold them together|a Roman mix of lime, sand and water strong enough to keep walls standing|lime, sand and water mixed before being spread on stones|mortar is the paste that holds bricks together; pillar is a column that holds up a roof|mortar 是粘合砖石的灰浆；pillar 是撑起屋顶的柱子|pillar is a tall, solid column, not a wet mixture spread between bricks|pillar 是又高又结实的柱子，不是抹在砖缝间的湿灰浆|basalt is a hard, dark rock made from cooled lava, not a paste mixed from lime, sand and water|basalt 是熔岩冷却形成的坚硬黑色岩石，不是用石灰、沙和水调成的灰浆|mor · tar|the -tar ending, not -ter|结尾是 -tar 不是 -ter
      vault|a curved ceiling of a great hall painted with stars|a locked steel room underground where a bank keeps gold|an arched roof covering wide spaces without columns|vault is an arched roof or a strong room; pillar is the column that holds a roof up|vault 是拱顶或保险库；pillar 是撑起屋顶的柱子|pillar is an upright column that holds a roof up, not the curved roof itself or a locked room|pillar 是撑起屋顶的直立柱子，不是拱形屋顶本身或上锁的库房|arena is a large open space with seats for shows, not an arched roof or a strong room for valuables|arena 是设有座位的大型表演场地，不是拱顶或存放贵重物品的库房|vault|au saying /ɔː/ and the -lt ending|au 读 /ɔː/，结尾是 -lt
      surveyor|a person measuring land with rods and chains so a road can be planned|a Roman using a sighting tool to keep a road straight|a person marking the edges of a new farm after measuring each side|surveyor measures land for building; censor counted people|surveyor 测量土地；censor 清点人口|censor is a Roman official who counted the citizens, not a person who measures land for roads and buildings|censor 是清点公民的罗马官员，不是为修路建房测量土地的人|steward is a person who manages a house, land or goods for someone, not one who measures land with tools|steward 是替人打理房屋、土地或财物的管家，不是用工具测量土地的人|sur · vey · or|ey saying a long a and the -or ending|ey 读长音 a，结尾是 -or
      arena|crowds filling seats to watch chariot races|a huge place where a singer performs for thousands of fans|a sandy floor where gladiators fought with seats all around|arena is an open space with seats around it for shows; villa is a private house|arena 是四周有座位的表演场地；villa 是私人住宅|villa is a large private country house, not an open space where crowds watch shows|villa 是大型私人乡间别墅，不是观众观看表演的场地|vault is an arched roof or a locked strong room, not an open space with seats for crowds|vault 是拱顶或上锁的保险库，不是坐满观众的开阔场地|a · re · na|long e and the -a ending|e 读长音，结尾是 -a
      fountain|water shooting up into the air where children throw coins|water from an aqueduct shooting up and splashing into stone basins|a stone structure in a square splashing water from a lion's mouth|fountain sends clean water up into the air; sewer carries waste water away underground|fountain 把清水喷向空中；sewer 在地下排走污水|sewer is an underground pipe that carries waste water away, not a structure that sprays water into the air|sewer 是排走污水的地下管道，不是把水喷向空中的设施|bathhouse is a building with pools for bathing, not a structure that sprays water upward|bathhouse 是有浴池的洗浴建筑，不是向上喷水的设施|foun · tain|ou saying /aʊ/ and the -tain ending|ou 读 /aʊ/，结尾是 -tain
      sewer|a great channel carrying dirty waste water under the streets to a river|rain flowing through a street grate into the pipe below|a blocked underground pipe smelling of waste|sewer carries waste water away underground; fountain shoots clean water up|sewer 在地下排走污水；fountain 向上喷清水|fountain sends clean water up into the air, not dirty water away underground|fountain 把清水喷向空中，不是在地下把脏水排走|vault is an arched roof or a locked room for valuables, not a pipe for waste water|vault 是拱顶或存放贵重物品的库房，不是排污水的管道|sew · er|ew saying /uː/ here, not the sew of sewing|这里的 ew 读 /uː/，不同于缝纫的 sew
      pillar|a huge stone column holding up a temple roof|a tall column someone hides behind|one tall column of an old building still standing upright|pillar is the column that holds up a roof; vault is the arched roof itself|pillar 是撑起屋顶的柱子；vault 是拱形屋顶本身|vault is the arched roof or a locked room, not the upright column standing under it|vault 是拱顶或上锁的库房，不是立在下面的柱子|mortar is a paste spread between bricks, not a tall, solid column|mortar 是抹在砖缝间的灰浆，不是又高又结实的柱子|pil · lar|double l and the -ar ending, not -er|双写 l，结尾是 -ar 不是 -er
    `,
  },
);

const revolt = batch(
  "words-of-revolt-and-war",
  ["Words of Revolt and War", "反叛与战争的词"],
  ["revolt and war", "反叛与战争"],
  `
  revolt|a violent fight against a ruler or government|起义，反抗|The farmers began a ___ against the high taxes, attacking the tax collectors' houses.|The slaves' ___ against their masters spread from farm to farm.|The king sent his army to crush the ___ of the angry townspeople.|treaty,conquest|revolts,revolted
  overthrow|to remove a ruler from power by force|推翻|The rebels planned to ___ the cruel king and take away his power.|The Romans decided to ___ their last king and set up a republic in 509 BCE.|The general tried to ___ the government by force and rule the country himself.|invade,surrender|overthrew,overthrown
  treaty|a written agreement between countries|条约|The two kingdoms signed a peace ___ that ended the war between them.|The ___ that both countries agreed to set the border between their lands.|Both sides broke the ___ within a year and went back to war.|decree,allegiance|treaties
  rebellion|an organized fight against those in power|叛乱|The ___ lasted three years before the king's army finally crushed the rebels.|Spartacus led a famous ___ of slaves who fought against Rome.|The ___ began when the soldiers refused to obey their officers and turned their weapons on them.|allegiance,conquest|rebellions
  uprising|a sudden revolt by many people|起义，暴动|The ___ began suddenly in the capital, where crowds rose up against the government.|Hungry workers poured into the streets and joined the ___ against the rulers.|Soldiers quickly put down the ___ of the angry townspeople.|conquest,treaty|uprisings
  invade|to enter a country with an army to take it|入侵|The Gauls tried to ___ Italy from the north with a huge army.|Every summer, ants ___ our kitchen and march across the counter.|The general planned to ___ the island by sea, landing his troops on its beaches.|overthrow,surrender|invaded,invades,invasion
  conquest|taking control of a land by force|征服|The ___ of Gaul by Caesar's army made him famous.|After the ___ of their land by a foreign army, the defeated people had to pay taxes to their new rulers.|Rome grew into a great empire through the ___ of the lands around it.|uprising,betrayal|conquests
  surrender|to stop fighting and accept defeat|投降|With no food left, the city had to ___ and open its gates to the enemy.|The proud general said he would rather die than ___ and hand over his sword.|Seeing that they could not win, the soldiers chose to ___ and laid down their weapons.|overthrow,invade|surrendered,surrenders
  allegiance|loyalty to a ruler, country or cause|忠诚|The soldiers swore ___ to the emperor and promised to serve him loyally.|Her ___ was to her family first, not to the king.|The children said the pledge of ___ to their country every morning.|betrayal,treaty
  betrayal|being disloyal to someone who trusted you|背叛|Caesar's death was an act of ___ by the friends he had trusted.|She felt his lie as a deep ___ of the trust between them.|The guard's ___, when he secretly opened the gates to the enemy, led to the city's fall.|allegiance,conquest|betrayals
  `,
  "context-clues",
  {
    intro: t(
      "The angry farmers began a **revolt**, hoping to **overthrow** the king, but one leader's **betrayal** forced them to **surrender**. These ten words help you tell the story of wars, rebels and the promises between them.",
      "愤怒的农民发动起义（**revolt**），想推翻（**overthrow**）国王，但一位首领的背叛（**betrayal**）迫使他们投降（**surrender**）。这十个词帮你讲述战争、反叛者以及彼此之间的盟约。",
    ),
    watchOut: {
      meanings: t(
        "Tell **conquest** (an outside army taking a land by force) apart from **uprising** and **rebellion** (people inside a country fighting against their own rulers).",
        "分清 **conquest**（外来军队用武力夺取土地）和 **uprising**、**rebellion**（国内百姓起来反抗自己的统治者）。",
      ),
      use: t(
        "Tell **overthrow** (to remove a ruler from power) apart from **invade** (to march an army into another land) and **surrender** (to give up and accept defeat).",
        "分清 **overthrow**（把统治者赶下台）、**invade**（率军进入别国）和 **surrender**（放弃抵抗、认输）。",
      ),
      spelling: t(
        "Watch **allegiance** (double *l* and *-giance*), **surrender** (double *r*), **rebellion** (double *l*) and **betrayal** (*ay* + *-al*).",
        "注意 **allegiance** 的双写 **l** 和 **-giance**、**surrender** 的双写 **r**、**rebellion** 的双写 **l**，以及 **betrayal** 的 **ay** 加 **-al**。",
      ),
    },
    notes: `
      revolt|farmers attacking tax collectors' houses over high taxes|slaves fighting their masters from farm to farm|angry townspeople fighting their king until his army comes|revolt is people fighting their own rulers; conquest is an outside army taking a land|revolt 是百姓反抗自己的统治者；conquest 是外来军队夺取土地|treaty is a written agreement between countries, not a violent fight against a ruler|treaty 是国家之间的书面协议，不是反抗统治者的暴力斗争|conquest is an army taking control of a land, not people rising up against their own rulers|conquest 是军队夺取一片土地，不是百姓起来反抗自己的统治者|re · volt|re- and the -olt ending, as in bolt|re- 加 -olt 结尾，和 bolt 一样
      overthrow|rebels planning to take away a cruel king's power|Romans getting rid of their last king and setting up a republic|a general trying to seize the government by force|overthrow means to remove a ruler from power; invade means to march into another country|overthrow 是推翻统治者；invade 是入侵别国|invade means to march an army into a land, not to remove a ruler or a government from power|invade 是率军进入一片土地，不是把统治者或政府赶下台|surrender means to give up and accept defeat, the opposite of taking power away from a ruler by force|surrender 是放弃抵抗、认输，与用武力夺走统治者的权力正相反|o · ver · throw|compound word: over + throw, with the past tense overthrew|合成词：over 加 throw，过去式是 overthrew
      treaty|two kingdoms signing an agreement that ends a war|an agreement setting the border between two countries' lands|an agreement both sides broke within a year|treaty is an agreement between countries; decree is an order from one ruler|treaty 是国家之间的协议；decree 是统治者一方的命令|decree is an order given by one ruler, not an agreement that two countries make together|decree 是统治者一方下达的命令，不是两国共同订立的协议|allegiance is loyalty to a ruler or country, not a written agreement between countries|allegiance 是对统治者或国家的忠诚，不是国家之间的书面协议|trea · ty|ea saying a long e and the -ty ending|ea 读长音 e，结尾是 -ty
      rebellion|a three-year fight by rebels before the king's army crushed it|Spartacus leading slaves who fought against Rome|soldiers refusing to obey and turning their weapons on their officers|rebellion is an organized fight against those in power; allegiance is loyalty to them|rebellion 是对掌权者有组织的反抗；allegiance 是对他们的忠诚|allegiance is loyalty to a ruler, the opposite of fighting against those in power|allegiance 是对统治者的忠诚，与反抗掌权者正相反|conquest is an army taking over a land from outside, not people fighting the rulers who are over them|conquest 是外来军队占领一片土地，不是人们反抗管辖自己的统治者|re · bel · lion|double l before -ion|-ion 前面双写 l
      uprising|crowds in the capital suddenly rising up against the government|hungry workers pouring into the streets against the rulers|angry townspeople's revolt that soldiers quickly put down|uprising is a sudden revolt by many people; conquest is an outside army taking a land|uprising 是众人突然起来反抗；conquest 是外来军队夺取土地|conquest is a foreign army taking a land by force, not ordinary people suddenly rising against their rulers|conquest 是外国军队用武力夺取土地，不是百姓突然起来反抗统治者|treaty is a peaceful written agreement between countries, not a sudden revolt by crowds|treaty 是国家之间和平的书面协议，不是众人突然发起的反抗|up · ris · ing|up + rise, dropping the e before -ing|up 加 rise，去掉 e 再加 -ing
      invade|Gauls marching a huge army into Italy from the north|ants marching across a kitchen counter every summer|a general landing troops on an island's beaches|invade means to march into a place; overthrow means to remove a ruler from power|invade 是侵入某地；overthrow 是推翻统治者|overthrow means to remove a ruler from power, not to enter a land or a place from outside|overthrow 是把统治者赶下台，不是从外面闯进一片土地或一个地方|surrender means to give up and accept defeat, not to march into a place to take it|surrender 是放弃抵抗、认输，不是闯进一个地方去占领它|in · vade|in- and the silent e making the a long|in- 开头，结尾的 e 不发音，让 a 读长音
      conquest|Caesar's army taking Gaul and making him famous|a foreign army taking a land and making the defeated people pay taxes|Rome growing into an empire by taking the lands around it|conquest is taking a land by force; uprising is people rising against their own rulers|conquest 是用武力夺取土地；uprising 是百姓反抗自己的统治者|uprising is a sudden revolt of people against their own rulers, not an army taking another land|uprising 是百姓突然起来反抗自己的统治者，不是军队夺取别国土地|betrayal is being disloyal to someone who trusted you, not taking control of a land by force|betrayal 是辜负信任你的人，不是用武力夺取一片土地|con · quest|con- and qu saying /kw/|con- 开头，qu 读 /kw/
      surrender|a city with no food left opening its gates to the enemy|a proud general who would rather die than hand over his sword|soldiers laying down their weapons when they cannot win|surrender means to give up; overthrow means to take power away by force|surrender 是投降认输；overthrow 是用武力夺权|overthrow means to remove a ruler by force, the opposite of giving up and accepting defeat|overthrow 是用武力推翻统治者，与放弃抵抗、认输正相反|invade means to march an army into a land, not to stop fighting and give in|invade 是率军攻入一片土地，不是停止战斗、屈服认输|sur · ren · der|double r in the middle|中间双写 r
      allegiance|soldiers promising to serve an emperor loyally|loyalty to family first rather than to the king|children's daily pledge of loyalty to their country|allegiance is loyalty; betrayal is breaking that loyalty|allegiance 是忠诚；betrayal 是背弃忠诚|betrayal is being disloyal to someone who trusts you, the opposite of loyalty|betrayal 是辜负信任你的人，与忠诚正相反|treaty is a written agreement between countries, not the loyalty a person feels or promises|treaty 是国家之间的书面协议，不是一个人怀有或许诺的忠诚|al · le · giance|double l and the -giance ending|双写 l，结尾是 -giance
      betrayal|Caesar killed by the friends he had trusted|a lie that broke the trust between two people|a guard secretly opening the gates to the enemy|betrayal is being disloyal to someone who trusts you; allegiance is loyalty|betrayal 是背叛信任你的人；allegiance 是忠诚|allegiance is loyalty to a ruler or a cause, the opposite of being disloyal|allegiance 是对统治者或事业的忠诚，与背叛正相反|conquest is taking control of a land by force, not breaking the trust of someone close|conquest 是用武力夺取土地，不是辜负身边人的信任|be · tray · al|betray + -al, keeping the y|betray 加 -al，保留 y
    `,
  },
);

const firstCities = batch(
  "words-of-the-first-cities",
  ["Words of the First Cities", "最早城市的词"],
  ["the first cities", "最早的城市"],
  `
  ziggurat|a tall temple tower built in steps, as in Mesopotamia|（古代美索不达米亚的）塔庙|A huge ___, a temple tower built in giant steps, rose above the city of Ur.|Priests climbed the many levels of the stepped ___ to reach the shrine at the very top.|The ___ was built from millions of mud bricks, each level smaller than the one below it.|citadel,pillar|ziggurats
  nomad|a person who moves from place to place instead of living in one home|游牧者|A ___ follows the herds from one pasture to the next and never stays in one place for long.|Before farming, almost everyone lived like a ___, moving camp to follow the animals they hunted.|The ___ packed up his tent and moved on with his camels to find fresh grass.|trader,steward|nomads,nomadic
  surplus|an amount left over after needs are met|剩余，盈余|Farmers grew a ___ of grain, more than they needed, so they could trade the extra.|After the good harvest, the town had a ___ of food left over for winter.|The club spent its ___, the money left after paying all its bills, on new books.|shortage,tribute|surpluses
  citadel|a strong fort on high ground that protects a city|城堡，要塞|The king's palace stood safely inside the walls of the ___ on the hill.|When enemies attacked, the people fled to the ___ and shut its heavy gates.|Soldiers guarded the thick walls of the ___ high above the city.|ziggurat,floodplain|citadels
  specialization|focusing on one kind of work|专门化，分工|Her ___ in medicine is the heart, so she treats only heart problems.|With ___, a worker spends all day on one kind of job, such as making pots, and becomes very good at it.|A carpenter who builds only doors shows ___, focusing on one kind of work.|surplus,census
  priest|a person who leads religious ceremonies|祭司，神父|The ___ led the ceremony and made offerings to the god of the city.|Each temple had a ___ who said prayers and cared for the holy statues.|On the festival day, the ___ blessed the crowd and sang hymns to the gods.|steward,herald|priests
  code|a set of written laws or rules; also a system of signals|法典；代码|Hammurabi's ___ listed nearly three hundred laws carved on a stone.|The school's dress ___ says that every student must wear a uniform.|They wrote the message in a secret ___ of numbers that only they could read.|decree,treaty|codes
  domesticate|to tame animals or grow plants for people's use|驯化|Early farmers learned to ___ wild sheep and goats, taming them so they lived beside people.|Wolves were the first wild animals that humans managed to ___, turning them into tame dogs.|It took people hundreds of years to ___ wild horses so that they could be ridden.|cultivate,graze|domesticated,domestication
  floodplain|the flat land beside a river that floods|洪泛平原|The ___ was rich because each flood left a new layer of mud along the river.|Farmers planted their crops on the flat ___ beside the river after the water went down.|Houses built on the low ___ are in danger every time the river rises over its banks.|pasture,citadel|floodplains
  steward|a person who manages a house, land or goods for someone else|管家，管理者|The king's ___ kept track of all the grain stored in the palace storehouse.|A good ___ takes care of what belongs to others as if it were his own.|The ___ counted the master's sheep every spring and reported the number to him.|trader,priest|stewards
  `,
  "context-clues",
  {
    intro: t(
      "Beside the river's rich **floodplain**, farmers grew a **surplus** of grain, a **priest** climbed the steps of the great **ziggurat**, and soldiers guarded the **citadel** on the hill. These ten words help you explain how the first cities grew.",
      "在河边肥沃的洪泛平原（**floodplain**）上，农民种出剩余（**surplus**）的粮食；祭司（**priest**）登上宏伟塔庙（**ziggurat**）的台阶；士兵守卫着山上的城堡（**citadel**）。这十个词帮你解释最早的城市如何发展起来。",
    ),
    watchOut: {
      meanings: t(
        "Tell **ziggurat** (a stepped temple tower where priests worshipped) apart from **citadel** (a fort on high ground that protects a city).",
        "分清 **ziggurat**（祭司礼拜用的阶梯式塔庙）和 **citadel**（高处保卫城市的要塞）。",
      ),
      use: t(
        "Tell **domesticate** (to tame animals for people's use) apart from **cultivate** (to prepare land and grow crops) and **graze** (to eat grass in a field).",
        "分清 **domesticate**（驯化动物供人使用）、**cultivate**（整地种植庄稼）和 **graze**（在草地上吃草）。",
      ),
      spelling: t(
        "Watch **ziggurat** (double *g*), **specialization** (*-cial-* and *-ization*), **surplus** (*-plus*) and **domesticate** (*-ic-* before *-ate*).",
        "注意 **ziggurat** 的双写 **g**、**specialization** 中的 **-cial-** 和 **-ization**、**surplus** 的结尾 **-plus**，以及 **domesticate** 中 **-ate** 前面的 **-ic-**。",
      ),
    },
    notes: `
      ziggurat|a temple tower of giant steps rising above Ur|priests climbing the levels of a stepped tower to a shrine at the top|a building of mud bricks with each level smaller than the one below|ziggurat is a stepped temple tower; citadel is a fort that protects a city|ziggurat 是阶梯式塔庙；citadel 是保卫城市的要塞|citadel is a fort built to protect a city, not a stepped temple tower with a shrine on top|citadel 是保卫城市的要塞，不是顶上有神殿的阶梯式塔庙|pillar is a single tall column that holds up a roof, not a huge tower built in levels of steps|pillar 是撑起屋顶的一根高柱，不是一层层阶梯堆成的巨塔|zig · gu · rat|double g and the -rat ending|双写 g，结尾是 -rat
      nomad|a herder following animals from one pasture to the next|people moving camp to follow the animals they hunted|a man packing his tent and moving his camels to find fresh grass|nomad moves from place to place with no fixed home; trader travels to buy and sell|nomad 居无定所、四处迁徙；trader 为买卖而奔走|trader is a person who buys and sells goods, not one who moves home to follow animals and grass|trader 是买卖货物的商人，不是追随牲畜和草场迁徙的人|steward manages a house or goods for someone and stays in one place, not one who moves from camp to camp|steward 替人管理家业、守在一处，不是从一处营地迁到另一处的人|no · mad|long o followed by the word mad|o 读长音，后面是 mad
      surplus|farmers growing more grain than they need so they can trade the extra|food left over for winter after a good harvest|money left after a club pays all its bills|surplus is an amount left over; shortage is not having enough|surplus 是剩余的部分；shortage 是数量不足|shortage means there is not enough of something, the opposite of an amount left over|shortage 指某物不够，与有剩余正相反|tribute is a payment made to a ruler or an act of respect, not an extra amount left after needs are met|tribute 是献给统治者的贡品或致敬，不是满足需要后剩下的部分|sur · plus|sur- followed by the word plus|sur- 后面接 plus
      citadel|a palace safe inside the walls of a fort on a hill|a fort where people fled and shut the heavy gates|soldiers guarding thick walls high above a city|citadel is a fort on high ground; ziggurat is a stepped temple tower|citadel 是高地上的要塞；ziggurat 是阶梯式塔庙|ziggurat is a stepped temple tower for worship, not a walled fort where people go for safety|ziggurat 是用来礼拜的阶梯塔庙，不是人们躲避危险的有围墙的要塞|floodplain is low, flat land beside a river, not a strong fort on high ground|floodplain 是河边低平的土地，不是高处坚固的要塞|cit · a · del|soft c and the -del ending, not -dal|c 读 /s/，结尾是 -del 不是 -dal
      specialization|a doctor who treats only heart problems|a worker spending all day on one kind of job and becoming very good at it|a carpenter who builds only doors|specialization is focusing on one kind of work; surplus is an amount left over|specialization 是专攻一种工作；surplus 是剩余的部分|surplus is an amount left over after needs are met, not a focus on one kind of work|surplus 是满足需要后剩下的部分，不是专攻一种工作|census is an official count of the people in a place, not a focus on one job|census 是对某地人口的正式清点，不是专攻一种工作|spe · cial · i · za · tion|special spelled with cial, then -ization with a z|special 中是 cial，后面的 -ization 用 z
      priest|a person leading a ceremony and making offerings to a city's god|a person in each temple saying prayers and caring for holy statues|a person blessing a festival crowd and singing hymns to the gods|priest leads religious ceremonies; steward manages goods for someone|priest 主持宗教仪式；steward 替人管理财物|steward manages a house, land or goods for someone, not one who leads prayers and offerings|steward 替人管理房屋、土地或财物，不是主持祈祷和祭献的人|herald is a messenger who announces a ruler's news, not one who leads worship|herald 是宣告统治者消息的信使，不是主持礼拜的人|priest|ie saying a long e, as in field|ie 读长音 e，和 field 一样
      code|nearly three hundred laws listed on a stone|a school's set of rules saying every student must wear a uniform|a secret system of numbers only two people could read|code is a whole set of laws or signals; decree is one order from a ruler|code 是一整套法律或符号；decree 是统治者下的一道命令|decree is one order from a ruler, not a whole set of rules or a system of signals|decree 是统治者下达的一道命令，不是一整套规则或一种符号体系|treaty is an agreement signed between countries, not a list of rules or a system of signals|treaty 是国家之间签订的协议，不是一套规则或一种符号体系|code|silent e making the o long|结尾的 e 不发音，让 o 读长音
      domesticate|early farmers taming wild sheep and goats to live beside people|wolves turned into tame dogs|wild horses tamed so they could be ridden|domesticate means to tame animals for people's use; cultivate means to grow crops|domesticate 是驯化动物；cultivate 是种植庄稼|cultivate means to prepare land and grow crops, not to tame wild animals|cultivate 是整地种庄稼，不是驯服野生动物|graze means to eat grass in a field, not to tame a wild animal for people's use|graze 是在草地上吃草，不是驯化野生动物供人使用|do · mes · ti · cate|the -ic- before the -ate ending|-ate 结尾前面是 -ic-
      floodplain|rich land along a river where each flood leaves new mud|flat land beside a river planted with crops after the water goes down|low land where houses are in danger whenever the river rises|floodplain is flat land beside a river that floods; pasture is grassland where animals feed|floodplain 是河边会被淹的平地；pasture 是供牲畜吃草的草地|pasture is grassy land for animals to feed on, not flat land that a river covers when it floods|pasture 是供牲畜吃草的草地，不是河水泛滥时会被淹没的平地|citadel is a fort on high ground, not low, flat land that floods|citadel 是高地上的要塞，不是会被洪水淹没的低平土地|flood · plain|compound word: flood + plain, with oo saying a short u|合成词：flood 加 plain，oo 读短音 u
      steward|a person keeping track of the grain in a king's storehouse|a person caring for what belongs to others as if it were his own|a person counting a master's sheep every spring and reporting the number|steward manages goods for someone else; trader buys and sells goods|steward 替别人管理财物；trader 买卖货物|trader buys and sells goods to make money, not one who looks after someone else's goods|trader 靠买卖货物赚钱，不是替别人照管财物的人|priest leads religious ceremonies, not one who counts and keeps someone else's goods|priest 主持宗教仪式，不是清点、保管别人财物的人|stew · ard|the word stew and the -ard ending|stew 加结尾 -ard
    `,
  },
);

const records = batch(
  "words-of-writing-and-records",
  ["Words of Writing and Records", "文字与记录的词"],
  ["writing and records", "文字与记录"],
  `
  tablet|a flat piece of clay or stone with writing on it|（泥、石）板|The scribe pressed marks into a wet clay ___ and left it to dry in the sun.|A broken stone ___ found in the sand told the story of a great flood.|The museum keeps a clay ___, no bigger than a hand, that lists the king's sheep.|ledger,stylus|tablets
  alphabet|the set of letters used to write a language|字母表|The English ___ has twenty-six letters, from A to Z.|The Phoenicians made an early ___ of letters that spread across the sea.|Little children learn the ___ by singing the letters in order.|pictograph,inscription|alphabets
  decipher|to work out the meaning of something hard to read|破译，辨认|I could not ___ my doctor's messy handwriting, even though it was in English.|She managed to ___ the secret message by working out which letter stood for which.|The smudged note in our own language was so hard to read that it took an hour to ___ it.|translate,calculate|deciphered
  ledger|a book in which money and goods are recorded|账簿|The merchant wrote every sale and every payment in the columns of his ___.|The ___ showed exactly how much money the shop had earned and spent that month.|She checked the numbers in the ___ to find the missing money.|chronicle,census|ledgers
  inscription|words cut into stone or metal|铭文，碑文|The ___ cut into the stone base of the statue gave the king's name.|We read the tiny ___ stamped into the metal of the old coin.|The ___ carved into the stone above the temple door gave the year it was built.|chronicle,tablet|inscriptions
  stylus|a pointed tool for writing on clay or wax|尖笔|The scribe pressed the pointed end of his ___ into the soft clay.|A reed ___ made small wedge-shaped marks in the clay.|You can tap and write on this screen with a ___ instead of your finger.|tablet,ledger|styluses
  pictograph|a picture that stands for a word or idea|象形文字|The earliest writing used a ___, a small drawing, for each object, such as a fish or an ox.|A ___ of a sun drawn on the wall might have meant "day."|Road signs often use a ___, such as a picture of a walking person, instead of words.|inscription,alphabet|pictographs
  census|an official count of the people in a place|人口普查|The ___ showed that the city had grown to twice as many people.|Rome took a ___ every five years to count all its citizens.|Every family filled in a ___ form, listing how many people lived in the house.|ledger,chronicle|censuses
  chronicle|a record of events in the order they happened|编年史|The monk kept a ___ of every war, flood and famine in the order they happened.|The old ___ tells us, year by year, when each king was born and when he died.|Her diary is a ___ of her school year, day after day.|census,ledger|chronicles,chronicled
  literate|able to read and write|识字的|Few people in the ancient world were ___, so scribes read and wrote letters for everyone else.|Schools taught every child to read and write, making the whole country ___.|A ___ person can write letters and read the newspaper.|fluent,bilingual|literacy
  `,
  "context-clues",
  {
    intro: t(
      "In the ancient city, a scribe pressed his **stylus** into a clay **tablet**, while a monk added a new page to his **chronicle**; today scholars try to **decipher** both. These ten words help you talk about how people first wrote things down.",
      "古城里，一位抄写员把尖笔（**stylus**）按进泥板（**tablet**），一位修士在他的编年史（**chronicle**）里又添了一页；如今学者们正努力破译（**decipher**）这些文字。这十个词帮你谈论人类最早如何记录事情。",
    ),
    watchOut: {
      meanings: t(
        "Tell **ledger** (a book of money and goods) apart from **chronicle** (a record of events in time order) and **census** (an official count of people).",
        "分清 **ledger**（记钱款和货物的账簿）、**chronicle**（按时间顺序记事的编年史）和 **census**（官方的人口普查）。",
      ),
      use: t(
        "Tell **decipher** (work out writing that is hard to read) apart from **translate** (change words from one language into another).",
        "分清 **decipher**（辨认、破解难以读懂的文字）和 **translate**（把一种语言译成另一种语言）。",
      ),
      spelling: t(
        "Watch **decipher** (*ph* saying /f/), **pictograph** (*-graph*), **inscription** (*-scrip-*) and **chronicle** (*ch* saying /k/).",
        "注意 **decipher** 中读 /f/ 的 **ph**、**pictograph** 的 **-graph**、**inscription** 中的 **-scrip-**，以及 **chronicle** 中读 /k/ 的 **ch**。",
      ),
    },
    notes: `
      tablet|marks pressed into wet clay left to dry in the sun|a broken stone found in the sand telling of a great flood|a hand-sized piece of clay listing a king's sheep|tablet is a flat piece of clay or stone with writing; stylus is the tool that writes on it|tablet 是写有文字的泥板或石板；stylus 是在上面书写的工具|ledger is a book with pages for money and goods, not a flat piece of clay or stone|ledger 是记钱款货物的账本，不是一块泥板或石板|stylus is the pointed tool used for writing, not the flat piece of clay or stone that holds the writing|stylus 是用来书写的尖笔，不是承载文字的泥板或石板|tab · let|the -let ending, not -lit|结尾是 -let 不是 -lit
      alphabet|the twenty-six letters of English from A to Z|an early set of letters made by the Phoenicians|letters children learn in order by singing|alphabet is a set of letters; pictograph is one picture that stands for a word|alphabet 是一套字母；pictograph 是代表一个词的图画|pictograph is a single picture that stands for a word, not a set of letters in order|pictograph 是代表一个词的单幅图画，不是按顺序排列的一套字母|inscription is words cut into stone or metal, not the set of letters a language uses|inscription 是刻在石头或金属上的文字，不是一种语言所用的整套字母|al · pha · bet|ph saying /f/ in the middle|中间的 ph 读 /f/
      decipher|a doctor's messy handwriting that is hard to read even in English|a secret message solved by working out which letter stood for which|a smudged note in one's own language that takes an hour to read|decipher means to work out writing that is hard to read; translate means to change words into another language|decipher 是辨认难读的文字；translate 是译成另一种语言|translate means to change words from one language into another, not to work out writing that is hard to read in its own language|translate 是把一种语言转换成另一种语言，不是辨认本来就难以看懂的文字|calculate means to find an answer by using numbers, not to work out the meaning of hard writing|calculate 是用数字算出答案，不是弄懂难读文字的意思|de · ci · pher|soft c and ph saying /f/|c 读 /s/，ph 读 /f/
      ledger|a merchant's book of every sale and payment in columns|a record showing how much money a shop earned and spent in a month|numbers checked to find missing money|ledger records money and goods; chronicle records events in order|ledger 记录钱款和货物；chronicle 按顺序记录事件|chronicle is a record of events in the order they happened, not a book of sales, payments and money|chronicle 是按时间顺序记录事件的编年史，不是记录买卖和钱款的账本|census is an official count of people, not a record of money and goods|census 是官方的人口清点，不是钱款和货物的记录|ledg · er|the silent d in -dg-|-dg- 中的 d 不发音
      inscription|words cut into a statue's stone base giving a king's name|tiny words stamped into the metal of an old coin|words carved into the stone above a temple door giving the year it was built|inscription is words cut into stone or metal; tablet is a flat piece of clay or stone to write on|inscription 是刻在石头或金属上的文字；tablet 是用来写字的泥板或石板|chronicle is a long record of events in time order, not a few words cut into stone or metal|chronicle 是按时间顺序的长篇事件记录，不是刻在石头或金属上的几个字|tablet is the flat piece of clay or stone itself, not the words carved into a statue, a coin or a wall|tablet 是泥板或石板本身，不是刻在雕像、钱币或墙上的文字|in · scrip · tion|scrip before -tion, from the word scribe|-tion 前面是 scrip（来自 scribe）
      stylus|a pointed tool a scribe presses into soft clay|a reed tool making small wedge-shaped marks|a tool for writing on a screen instead of a finger|stylus is a pointed writing tool; tablet is what you write on|stylus 是尖头书写工具；tablet 是在上面写字的板|tablet is the flat piece of clay or stone that is written on, not the pointed tool that makes the marks|tablet 是被书写的泥板或石板，不是刻出痕迹的尖笔|ledger is a book for recording money and goods, not a pointed tool held in the hand|ledger 是记录钱款货物的账本，不是拿在手里的尖笔|sty · lus|y saying a long i and the -us ending|y 读长音 i，结尾是 -us
      pictograph|small drawings used in the earliest writing for objects such as a fish or an ox|a sun drawn on a wall that might mean day|a picture of a walking person used on road signs instead of words|pictograph is a picture standing for a word; alphabet is a set of letters|pictograph 是代表词语的图画；alphabet 是一套字母|inscription is words cut into stone or metal, not a picture that stands for an idea|inscription 是刻在石头或金属上的文字，不是代表一个意思的图画|alphabet is a whole set of letters, not one picture that stands for a word|alphabet 是一整套字母，不是代表一个词的单幅图画|pic · to · graph|picto- and -graph, with ph saying /f/|picto- 加 -graph，ph 读 /f/
      census|a count showing a city had grown to twice as many people|Rome counting all its citizens every five years|a form where each family lists how many people live in the house|census counts people; ledger records money and goods|census 清点人口；ledger 记录钱款货物|ledger is a book of money and goods, not an official count of people|ledger 是记钱款和货物的账本，不是官方的人口清点|chronicle is a record of events in time order, not a count of how many people live in a place|chronicle 是按时间顺序记录的事件，不是统计某地有多少人|cen · sus|soft c at the start and the -sus ending|开头的 c 读 /s/，结尾是 -sus
      chronicle|a monk's record of every war, flood and famine in order|an old record telling, year by year, when each king was born and died|a diary recording a school year day after day|chronicle records events in time order; census counts people|chronicle 按时间顺序记事；census 清点人口|census is an official count of people, not a record of events in the order they happened|census 是官方的人口清点，不是按发生顺序记录的事件|ledger is a record of money and goods, not of events told in time order|ledger 是钱款货物的记录，不是按时间顺序讲述的事件|chron · i · cle|ch saying /k/ and the -cle ending|ch 读 /k/，结尾是 -cle
      literate|a world where few could read or write, so scribes wrote letters for others|schools teaching every child to read and write|a person who can write letters and read the newspaper|literate means able to read and write; fluent means able to speak a language easily|literate 指能读会写；fluent 指能流利地说一种语言|fluent means able to speak a language easily and well, not able to read and write|fluent 指能流利地说一种语言，不是能读会写|bilingual means able to speak two languages, not simply able to read and write|bilingual 指能说两种语言，不是指能读会写|lit · er · ate|a single t and the -ate ending|只有一个 t，结尾是 -ate
    `,
  },
);

const trade = batch(
  "words-of-trade",
  ["Words of Trade", "贸易的词"],
  ["trade and markets", "贸易与市场"],
  `
  export|to send goods to another country to sell; also the goods sent|出口|Egypt used to ___ grain across the sea to be sold in Rome.|Factories in this country ___ cars to buyers in other countries all over the world.|Farmers here ___ most of their coffee to other countries instead of drinking it at home.|haggle,hoard|exported,exports
  goods|things that are made to be sold|商品，货物|The ship carried ___ such as silk, spices and tea from China to Europe.|The store sells household ___ such as pots and brooms.|Traders swapped ___ like cloth and salt at the market.|commerce,tariff
  commerce|the buying and selling of goods|商业，贸易|The river was a busy highway of ___, with boats carrying goods to be bought and sold between cities.|The new road brought more ___ to the village, as traders came to buy and sell there.|In the market square, ___ went on from dawn to dusk as people bought and sold everything from fish to cloth.|economy,tariff
  trader|a person who buys and sells goods|商人|The ___ bought silk in the east and sold it in the west for a higher price.|Each ___ set up a stall at the market to sell his goods.|The fur ___ paddled down the river to sell his beaver skins in town.|nomad,steward|traders
  port|a town with a harbor where ships load and unload|港口|The ship sailed into ___ at dawn and tied up at the dock.|Goods from many lands were unloaded from the ships at the busy ___.|The ___ was crowded with boats waiting to load and unload.|citadel,floodplain|ports
  tariff|a tax on goods brought into a country|关税|The government put a ___ on steel brought in from abroad, so foreign steel cost more.|A high ___ on imported cars makes them more expensive for buyers.|The two countries agreed to remove the ___ on each other's goods so that trade would be cheaper.|tribute,economy|tariffs
  wares|things that someone is selling|商品，货物|The potter laid out her ___, bowls and jugs she had made, on a cloth to sell.|Sellers shouted about their ___ in the street to get people to buy.|The peddler carried his ___ in a sack from village to village.|commerce,tariff
  haggle|to argue about a price before buying|讨价还价|In the market, buyers and sellers ___ over the price until both sides are happy.|My uncle loves to ___, arguing for a lower price before he buys a carpet.|The traveler refused to ___ and simply paid the full price the seller asked.|export,distribute|haggled,haggling
  merchandise|goods that are bought and sold|商品|The store gets new ___ every week, from shoes to shirts.|Please do not touch the ___ on the shelves unless you plan to buy it.|The ___ for the shop arrived by truck in big boxes.|tariff,economy
  economy|the system of money, work and trade in a place|经济|Tourism is the most important part of the island's ___, giving jobs to half the people.|When the country's ___ is strong, more people have jobs and money to spend.|Trade, farming and factories all help a city's ___ grow.|tariff,surplus|economies
  `,
  "context-clues",
  {
    intro: t(
      "In the busy **port**, each **trader** unloaded **goods** from distant lands and began to **haggle** with buyers over the price. These ten words help you explain how people buy, sell and trade.",
      "繁忙的港口（**port**）里，每个商人（**trader**）卸下来自远方的货物（**goods**），开始和买家讨价还价（**haggle**）。这十个词帮你说明人们如何买卖和交易。",
    ),
    watchOut: {
      meanings: t(
        "Tell **tariff** (a tax on goods brought into a country) apart from **tribute** (a payment made to a ruler).",
        "分清 **tariff**（对进口货物征收的关税）和 **tribute**（献给统治者的贡品）。",
      ),
      use: t(
        "Tell **commerce** (the buying and selling itself) apart from **economy** (the whole system of money, work and trade in a place).",
        "分清 **commerce**（买卖活动本身）和 **economy**（一个地方由钱、工作与贸易构成的整个经济体系）。",
      ),
      spelling: t(
        "Watch **merchandise** (*-dise*, not *-dize*), **tariff** (one *r*, double *f*), **commerce** (double *m*) and **haggle** (double *g*).",
        "注意 **merchandise** 的结尾 **-dise**（不是 -dize）、**tariff** 一个 **r** 两个 **f**、**commerce** 的双写 **m**，以及 **haggle** 的双写 **g**。",
      ),
    },
    notes: `
      export|Egypt sending grain across the sea to be sold in Rome|factories sending cars to buyers in other countries|farmers sending most of their coffee to other countries|export means to send goods abroad to sell; hoard means to keep a supply hidden|export 是把货物运到国外出售；hoard 是囤积藏起来|haggle means to argue about a price before buying, not to send goods to another country|haggle 是买东西前讨价还价，不是把货物运往别国|hoard means to collect and hide a supply for yourself, the opposite of sending goods away to sell|hoard 是收集并藏起来自己用，与把货物运出去卖正相反|ex · port|ex- followed by the word port|ex- 后面接 port
      goods|silk, spices and tea carried by ship from China to Europe|pots and brooms sold in a store|cloth and salt swapped at a market|goods are the things made to be sold; commerce is the buying and selling of them|goods 是待售的商品；commerce 是买卖活动|commerce is the activity of buying and selling, not the things such as silk, pots or cloth that are sold|commerce 是买卖这种活动，不是丝绸、锅、布这类被卖的东西|tariff is a tax on goods coming into a country, not the things themselves|tariff 是对进口货物征的税，不是货物本身|goods|double o saying a short /ʊ/ and the -s ending|双写 o 读短音 /ʊ/，结尾有 s
      commerce|a river busy with boats carrying goods to be bought and sold|traders coming to a village to buy and sell after a new road opens|people buying and selling everything from fish to cloth from dawn to dusk|commerce is the buying and selling itself; economy is the whole system of money, work and trade|commerce 是买卖活动本身；economy 是由钱、工作与贸易构成的整个体系|economy is the whole system of money, jobs and trade in a place, not the buying and selling going on in a market or along a route|economy 是一个地方钱、工作与贸易的整个体系，不是市场或商路上正在进行的买卖|tariff is a tax on goods brought into a country, not the buying and selling of goods|tariff 是对进口货物征的税，不是货物的买卖|com · merce|double m and the -erce ending|双写 m，结尾是 -erce
      trader|a person buying silk in the east and selling it in the west for more|a person with a stall at the market to sell goods|a person paddling down a river to sell beaver skins in town|trader buys and sells goods; steward looks after someone else's goods|trader 买卖货物；steward 替别人照管财物|nomad is a person who moves from place to place with herds, not one who buys and sells goods for a living|nomad 是带着牲畜四处迁徙的人，不是靠买卖货物为生的人|steward manages a house or goods for someone else, not one who buys and sells to make money|steward 替别人管理家业或财物，不是靠买卖赚钱的人|trad · er|trade with the e dropped before -er|trade 去掉 e 再加 -er
      port|a town where a ship sails in at dawn and ties up at the dock|a busy town where goods from many lands are unloaded from ships|a harbor town crowded with boats waiting to load and unload|port is a town with a harbor for ships; citadel is a fort on high ground|port 是有港湾的城镇；citadel 是高地上的要塞|citadel is a fort on high ground, not a harbor town where ships load and unload|citadel 是高地上的要塞，不是船只装卸货物的港口城镇|floodplain is flat land beside a river that floods, not a town with a harbor for ships|floodplain 是河边会被淹的平地，不是有港湾停船的城镇|port|or saying /ɔː/ and a final t|or 读 /ɔː/，结尾是 t
      tariff|a tax on steel brought in from abroad that makes foreign steel cost more|a high tax on imported cars that makes them more expensive|taxes two countries agree to remove so trade is cheaper|tariff is a tax on goods brought into a country; tribute is a payment made to a ruler|tariff 是进口关税；tribute 是献给统治者的贡品|tribute is a payment a conquered people make to a ruler, not a tax on goods coming into a country|tribute 是被征服者献给统治者的贡品，不是对进口货物征的税|economy is the whole system of money, work and trade, not one tax on goods|economy 是钱、工作与贸易的整个体系，不是对货物征的一种税|tar · iff|one r and double f|一个 r，两个 f
      wares|bowls and jugs a potter laid out on a cloth to sell|things sellers shouted about in the street to get people to buy|things a peddler carried in a sack from village to village|wares are the things someone is selling; commerce is the buying and selling itself|wares 是某人出售的东西；commerce 是买卖活动本身|commerce is the activity of buying and selling, not the objects a seller lays out or carries|commerce 是买卖这种活动，不是卖家摆出或背着的物品|tariff is a tax on goods brought into a country, not things a seller offers to buyers|tariff 是对进口货物征的税，不是卖家向买家兜售的东西|wares|the word ware with -s, always plural in this meaning|ware 加 s，表示这个意思时总用复数
      haggle|buyers and sellers arguing over a price until both are happy|an uncle arguing for a lower price before buying a carpet|a traveler paying the full price without arguing|haggle means to argue about a price; distribute means to give things out|haggle 是讨价还价；distribute 是分发东西|export means to send goods to another country to sell, not to argue over a price with a seller|export 是把货物运往别国出售，不是和卖家争论价钱|distribute means to give things out to many people, not to argue about how much to pay|distribute 是把东西分发给许多人，不是争论该付多少钱|hag · gle|double g and the -le ending|双写 g，结尾是 -le
      merchandise|new shoes and shirts arriving at a store every week|things on shop shelves that should not be touched unless you plan to buy|things for a shop arriving by truck in big boxes|merchandise is the goods a shop sells; tariff is a tax on goods|merchandise 是商店出售的商品；tariff 是对货物征的税|tariff is a tax on goods brought into a country, not the goods a shop has to sell|tariff 是对进口货物征的税，不是商店里要卖的商品|economy is the whole system of money, work and trade in a place, not the goods on a shop's shelves|economy 是一个地方钱、工作与贸易的整个体系，不是商店货架上的商品|mer · chan · dise|the -dise ending with an s, not -dize|结尾是带 s 的 -dise，不是 -dize
      economy|tourism giving jobs to half the people of an island|a country where more people have jobs and money when things are strong|trade, farming and factories helping a city's money and work grow|economy is the whole system of money, work and trade; tariff is one tax on goods|economy 是钱、工作与贸易的整个体系；tariff 只是对货物征的一种税|tariff is one tax on goods brought into a country, not the whole system of jobs, money and trade|tariff 只是对进口货物征的一种税，不是工作、钱和贸易的整个体系|surplus is an amount left over after needs are met, not the system of money and work in a place|surplus 是满足需要后剩下的部分，不是一个地方钱和工作的体系|e · con · o · my|the -omy ending after con|con 后面接 -omy 结尾
    `,
  },
);

const plates = batch(
  "words-of-plate-tectonics",
  ["Words of Plate Tectonics", "板块构造的词"],
  ["moving plates of the Earth", "地球的移动板块"],
  `
  plate|one of the huge pieces of rock that make up Earth's outer layer|（地壳）板块|The Pacific ___, one of the huge pieces that Earth's outer shell is broken into, is the largest of them all.|Each ___ is a giant slab of rock that drifts only a few centimeters a year, carrying whole continents with it.|India rides on a separate ___, a giant slab of Earth's outer layer, that is pushing north into Asia.|crust,rift|plates
  crust|the thin, solid outer layer of Earth|地壳|The ___, Earth's thin outer skin of solid rock, is thinnest under the oceans.|We live on Earth's rocky ___, the solid layer at the very surface of the planet.|During the earthquake, the ground at the surface split open, cracking the solid ___ under the town.|mantle,core
  mantle|the thick layer of hot rock between Earth's crust and core|地幔|Rock in the ___, the thick layer just below the crust, moves very slowly, like thick paste.|The ___ lies between the thin crust and the metal center of the Earth and is about 2,900 kilometers thick.|Heat rising from the ___, the layer of hot rock just under the crust, helps move the plates above it.|crust,core
  core|the hot center of Earth; also the most important part|地核；核心|Deep at the very center of the planet, Earth's ___ is a ball made mostly of iron.|The outer ___ is a layer of liquid metal that flows around Earth's solid center.|Honesty is at the very ___ of a good friendship, its most important part.|mantle,crust|cores
  collide|to crash into each other|相撞，碰撞|When two plates ___ head-on, the crash crumples the rock and slowly pushes up mountains.|Two cars can ___ at a corner with no lights, crashing into each other with a bang.|Two players ran for the same ball and were about to ___, so one stepped aside to avoid the crash.|swoop,evolve|collided,collides,collision
  boundary|a line where two areas meet|边界|The river forms the ___ between the two countries, marking the line where one ends and the other begins.|Earthquakes often shake the land along a plate ___, the line where two plates meet and grind together.|The fence along the edge of our yard marks the ___ between our land and our neighbor's land.|trench,realm|boundaries
  trench|a long, deep ditch, especially at the bottom of the ocean|海沟；沟渠|Soldiers dug a ___, a long, deep ditch, to hide in during the battle.|The Mariana ___, the deepest ditch at the bottom of the ocean, is about eleven kilometers deep.|Where one plate sinks under another, a long, deep ditch called an ocean ___ forms on the seabed.|rift,boundary|trenches
  rift|a crack or split; also a break in a friendship|裂谷；裂痕|The East African ___, a huge crack in the land, is slowly splitting the continent in two.|An argument caused a ___ between the two friends, and they stopped speaking to each other.|Lava rose up through a ___, a long split in the crust where the ground was pulling apart.|trench,plate|rifts
  subduction|the sinking of one plate under another|（板块）俯冲|In ___, the heavy ocean plate slides down beneath the lighter continent and sinks into the mantle.|Volcanoes form above zones of ___, where one plate sinks under another and begins to melt.|The deep trench was made by ___, as one plate bent down and sank beneath its neighbor.|uplift,boundary
  uplift|the raising of land by forces inside the Earth; also something that cheers you|隆起；鼓舞|Slow ___ pushed the old seabed high up to form the tops of the mountains.|Winning the game after a hard week gave the whole team a much-needed ___ that raised their spirits.|Fish fossils were found high on the mountain because ___ had raised the old seabed thousands of meters.|subduction,erosion|uplifted
  `,
  "context-clues",
  {
    intro: t(
      "Deep below us, the hot **mantle** slowly churns, and each **plate** of the **crust** drifts along until two of them **collide** and push up mountains. These ten words help you explain how Earth's surface moves and changes.",
      "在我们脚下深处，炽热的地幔（**mantle**）缓缓翻动，地壳（**crust**）的每个板块（**plate**）随之漂移，直到两块相撞（**collide**），推起高山。这十个词帮你解释地球表面如何移动和变化。",
    ),
    watchOut: {
      meanings: t(
        "Tell Earth's three layers apart: the thin outer **crust**, the thick hot **mantle** under it, and the metal **core** at the center.",
        "分清地球的三层：薄薄的外层 **crust**（地壳）、下面厚而炽热的 **mantle**（地幔），以及中心的金属 **core**（地核）。",
      ),
      use: t(
        "Tell **trench** (a long, deep ditch where one plate sinks) apart from **rift** (a crack where the ground pulls apart).",
        "分清 **trench**（板块俯冲处又长又深的沟）和 **rift**（地面被拉开形成的裂缝）。",
      ),
      spelling: t(
        "Watch **subduction** (*sub-* + *-duc-* + *-tion*), **boundary** (*-ary*), **collide** (double *l*) and **mantle** (*-tle*).",
        "注意 **subduction** 由 **sub-**、**-duc-**、**-tion** 组成，**boundary** 结尾是 **-ary**，**collide** 双写 **l**，**mantle** 结尾是 **-tle**。",
      ),
    },
    notes: `
      plate|one of the huge pieces Earth's outer shell is broken into|a giant slab of rock drifting a few centimeters a year with continents on it|a separate slab of Earth's outer layer pushing north into Asia|plate is one piece of Earth's outer layer; crust is the whole outer layer|plate 是地球外层的一块；crust 是整个外层|crust is the whole thin outer layer of Earth, not one separate piece or slab of it|crust 是地球整个薄薄的外层，不是其中单独的一块|rift is a crack or split in the ground, not a huge slab of rock that carries continents|rift 是地面的裂缝，不是承载大陆的巨大岩块|plate|a long a made by the silent e|结尾 e 不发音，使 a 读长音
      crust|Earth's thin outer skin of solid rock that is thinnest under the oceans|the solid rocky layer at the very surface where we live|the solid surface layer that split open under a town in an earthquake|crust is the thin outer layer; mantle is the thick hot layer below it|crust 是薄薄的外层；mantle 是下面厚而炽热的一层|mantle is the thick layer of hot rock below the surface, not the thin solid skin we live on|mantle 是地表下厚厚的炽热岩层，不是我们生活其上的薄硬外壳|core is the metal center deep inside Earth, not the outer layer at the surface|core 是地球深处的金属中心，不是地表的外层|crust|cr- and the -ust ending, as in dust|cr- 开头，结尾 -ust，和 dust 一样
      mantle|a thick layer just below the crust whose rock moves like thick paste|a layer about 2,900 kilometers thick between the crust and the metal center|a layer of hot rock just under the crust whose heat moves the plates|mantle is the thick hot layer under the crust; core is the center|mantle 是地壳下厚而炽热的一层；core 是中心|crust is the thin outer layer itself, not the thick layer lying below it|crust 是薄薄的外层本身，不是它下面的厚层|core is the metal ball at the very center, not the layer between the crust and the center|core 是最中心的金属球，不是地壳与中心之间的那一层|man · tle|the -tle ending, not -tel|结尾是 -tle 不是 -tel
      core|a ball made mostly of iron at the very center of the planet|a layer of liquid metal flowing around Earth's solid center|the most important part of a good friendship|core is the center or most important part; mantle is the layer around it|core 是中心或最重要的部分；mantle 是包着它的一层|mantle is the layer of hot rock around the center, not the iron center itself or the most important part of something|mantle 是包在中心外面的炽热岩层，不是铁质中心本身，也不是事物最重要的部分|crust is the thin outer skin of Earth, the part farthest from the center|crust 是地球薄薄的外壳，是离中心最远的部分|core|or and a silent e at the end|or 加上不发音的结尾 e
      collide|two plates crashing head-on and crumpling rock into mountains|two cars crashing into each other at a corner with a bang|two players about to crash while running for the same ball|collide means to crash into each other; swoop means to dive down through the air|collide 是相撞；swoop 是从空中俯冲|swoop means to dive down quickly through the air, not to crash into something head-on|swoop 是从空中快速俯冲下来，不是迎面撞上某物|evolve means to change slowly over a long time, not to crash into each other|evolve 是经过很长时间慢慢变化，不是彼此相撞|col · lide|double l and the -ide ending|双写 l，结尾是 -ide
      boundary|a river marking the line where one country ends and the other begins|the line where two plates meet and grind together|a fence along the edge of a yard between two people's land|boundary is the line where two areas meet; realm is a whole kingdom|boundary 是两个区域交界的线；realm 是整个王国|trench is a long, deep ditch, not the line where two areas meet|trench 是又长又深的沟，不是两个区域相接的那条线|realm is a whole kingdom or area, not the line between two areas|realm 是整个王国或领域，不是两个区域之间的分界线|bound · a · ry|bound and the -ary ending|bound 加结尾 -ary
      trench|a long, deep ditch soldiers dug to hide in|the deepest ditch at the bottom of the ocean|a long, deep ditch on the seabed where one plate sinks under another|trench is a long, deep ditch; rift is a crack where ground pulls apart|trench 是又长又深的沟；rift 是地面被拉开的裂缝|rift is a crack where land or friends split apart, not a long, deep ditch that is dug or sinks down|rift 是土地或朋友之间裂开的缝隙，不是挖出或下沉形成的又长又深的沟|boundary is a line where two areas meet, not a deep ditch you can go down into|boundary 是两个区域相接的线，不是可以下到里面的深沟|trench|tr- and the -ench ending, as in bench|tr- 开头，结尾 -ench，和 bench 一样
      rift|a huge crack splitting a continent in two|a split between two friends after an argument|a long split in the crust where the ground pulls apart|rift is a crack or split; plate is a huge slab of Earth's outer layer|rift 是裂缝或裂痕；plate 是地球外层的巨大岩块|trench is a long, deep ditch, not a crack that splits land or friends apart|trench 是又长又深的沟，不是让土地或朋友裂开的缝隙|plate is a huge slab of Earth's outer layer, not a crack or split between two sides|plate 是地球外层的巨大岩块，不是两边之间的裂缝|rift|ri- and the -ft ending, as in gift|ri- 开头，结尾 -ft，和 gift 一样
      subduction|a heavy ocean plate sliding beneath a continent and sinking into the mantle|one plate sinking under another and beginning to melt|one plate bending down and sinking beneath its neighbor to make a trench|subduction is one plate sinking under another; uplift is land being raised|subduction 是一个板块俯冲到另一个之下；uplift 是陆地被抬升|uplift is land being raised upward, the opposite of a plate sinking down|uplift 是陆地向上抬升，与板块向下沉没正相反|boundary is the line where two plates meet, not the sinking of one beneath the other|boundary 是两个板块相接的线，不是一个板块沉到另一个下面|sub · duc · tion|sub- and -duc- before -tion|sub- 加 -duc- 再加 -tion
      uplift|old seabed pushed high up to form mountaintops|a much-needed boost that raised a team's spirits|old seabed raised thousands of meters so fish fossils sit high on a mountain|uplift is land or spirits being raised; subduction is a plate sinking down|uplift 是陆地或情绪被抬高；subduction 是板块下沉|subduction is one plate sinking down under another, the opposite of land being raised|subduction 是一个板块向下沉到另一个之下，与陆地被抬升正相反|erosion is land being worn away by water and wind, not land or spirits being raised up|erosion 是陆地被水和风侵蚀，不是陆地或情绪被抬高|up · lift|compound word: up + lift|合成词：up 加 lift
    `,
  },
);

const volcanoes = batch(
  "words-of-volcanoes",
  ["Words of Volcanoes", "火山的词"],
  ["volcanoes", "火山"],
  `
  eruption|the moment when a volcano throws out lava, ash and gas|（火山）爆发|In the ___ of Vesuvius, the volcano blasted out ash and hot rock that buried the town of Pompeii.|Scientists warned that the volcano's next ___ was coming soon, because it had started to rumble and puff smoke.|The ___ lasted three days, with lava and ash pouring out of the mountain the whole time.|deposit,fissure|eruptions
  ash|the gray powder left after burning; also fine rock dust from a volcano|灰；火山灰|A cloud of fine gray ___, like powdery dust, rose miles above the volcano.|After the campfire burned out, only soft gray ___ was left in the fire pit.|Planes could not fly through the cloud of powdery volcanic ___ that filled the sky.|pumice,basalt
  cone|a shape with a round base and a point; the hill around a volcano's opening|锥体；火山锥|Layers of lava and ash piled up around the opening and built a steep ___ with a pointed top.|The ice cream came in a crisp ___, round at the top and pointed at the bottom.|The volcano's pointed ___ grew taller after each eruption as more ash piled up on its slopes.|geyser,fissure|cones
  geyser|a hot spring that shoots water and steam into the air|间歇泉|The ___ shoots a tall column of hot water and steam into the air every hour.|Tourists wait around the famous ___ to watch it spray boiling water high into the sky.|Underground heat boils the water in the rock until the ___ blasts it up as a fountain of steam.|cone,fissure|geysers
  pumice|a light rock full of holes, formed from lava|浮石|This rock, called ___, is so light, because it is full of tiny air holes, that it floats on water.|People rub a rough, holey stone called ___ on their feet to scrub away hard skin.|The beach near the volcano was covered with light, holey stones of ___ that floated in on the waves.|basalt,ash
  basalt|a hard, dark rock made from cooled lava|玄武岩|The tall black cliffs are made of hard, heavy ___ that formed when lava cooled.|Most of the ocean floor is solid, dark ___, made from lava that cooled under the sea.|When runny lava cools quickly, it hardens into dark, heavy ___ with no holes in it.|pumice,ash
  fissure|a long, narrow crack|裂缝|Lava poured out of a long, narrow ___ that split open in the ground.|A narrow ___ opened in the ice, a crack so deep that we could not see the bottom.|Steam hissed out of a thin ___ in the rock, a crack no wider than a finger.|cone,geyser|fissures
  evacuate|to move people away from a dangerous place|疏散，撤离|Before the volcano erupted, the police had to ___ the town, moving every family to a safe place far away.|Firefighters had to ___ the burning building, leading everyone out to safety.|In the fire drill, we practice how to ___ the school, walking everyone out quickly and safely.|invade,scurry|evacuated,evacuation
  volcanic|made by or coming from a volcano|火山的|The island is made of ___ rock, lava that poured out of a volcano only fifty years ago and cooled.|Soil made from old volcano ash is called ___ soil, and it is very rich for farming.|Last year's ___ blast threw ash out of the mountain's crater and darkened the sky for days.|prehistoric,organic
  deposit|a layer of material left by water, wind or a volcano|沉积物，沉积层|When the volcano went quiet, it had left behind a thick ___ of ash, a gray layer that settled over the fields.|Where the river slows down, it leaves a thin ___ of sand and mud, a layer that builds up on the bottom.|Miners dug down through the rock to reach a rich ___ of copper, a thick layer left there long ago.|eruption,fissure|deposits
  `,
  "context-clues",
  {
    intro: t(
      "When the **eruption** began, **ash** rained down, lava streamed out of a **fissure**, and the whole town had to **evacuate**. These ten words help you describe what volcanoes do and what they leave behind.",
      "火山爆发（**eruption**）开始时，火山灰（**ash**）纷纷落下，熔岩从一道裂缝（**fissure**）中涌出，全镇的人都不得不撤离（**evacuate**）。这十个词帮你描述火山的活动以及它留下的东西。",
    ),
    watchOut: {
      meanings: t(
        "Tell **pumice** (a light rock full of holes that floats) apart from **basalt** (a hard, heavy dark rock with no holes).",
        "分清 **pumice**（满是小孔、能浮在水上的轻石）和 **basalt**（坚硬沉重、没有孔的黑色岩石）。",
      ),
      use: t(
        "Tell **eruption** (the moment a volcano blasts out lava and ash) apart from **deposit** (the layer left behind afterwards).",
        "分清 **eruption**（火山喷出熔岩和火山灰的那一刻）和 **deposit**（事后留下的沉积层）。",
      ),
      spelling: t(
        "Watch **geyser** (*ey*), **fissure** (double *s* and *-ure*), **eruption** (*-rup-* + *-tion*) and **evacuate** (one *c*, then *-uate*).",
        "注意 **geyser** 中的 **ey**、**fissure** 的双写 **s** 和 **-ure**、**eruption** 中的 **-rup-** 加 **-tion**，以及 **evacuate** 只有一个 **c**、结尾是 **-uate**。",
      ),
    },
    notes: `
      eruption|Vesuvius blasting out ash and hot rock that buried Pompeii|a volcano's next blast after it starts to rumble and puff smoke|three days of lava and ash pouring out of a mountain|eruption is the moment a volcano blasts out lava and ash; deposit is the layer left afterwards|eruption 是火山喷发的那一刻；deposit 是事后留下的沉积层|deposit is a layer of material left behind, not the moment a volcano blasts out lava and ash|deposit 是留下来的一层物质，不是火山喷出熔岩和火山灰的那一刻|fissure is a long, narrow crack, not the blast of lava and ash itself|fissure 是又长又窄的裂缝，不是熔岩和火山灰的喷发本身|e · rup · tion|-rup- before -tion|-tion 前面是 -rup-
      ash|a cloud of fine gray powdery dust above a volcano|soft gray powder left in a fire pit after a campfire|a cloud of powdery dust in the sky that planes cannot fly through|ash is fine gray powder; pumice is a light rock full of holes|ash 是细细的灰色粉末；pumice 是满是小孔的轻石|pumice is a solid, light rock full of holes, not a fine powder that drifts in the air|pumice 是满是小孔的轻质固体石块，不是飘在空中的细粉|basalt is a hard, heavy rock, not soft powder like dust|basalt 是坚硬沉重的岩石，不是像尘土一样的软粉末|ash|a short a and sh|短音 a 加 sh
      cone|lava and ash piled into a steep shape with a pointed top|a crisp ice cream holder, round at the top and pointed at the bottom|a volcano's pointed top growing taller after each eruption|cone is a pointed shape or hill; geyser is a spring that shoots water|cone 是尖顶的锥体或山丘；geyser 是喷水的泉|geyser is a hot spring that shoots water into the air, not a pointed shape or hill|geyser 是向空中喷水的温泉，不是尖顶的形状或山丘|fissure is a long, narrow crack, not a shape with a round base and a point|fissure 是又长又窄的裂缝，不是圆底尖顶的形状|cone|the silent e making the o long|结尾 e 不发音，使 o 读长音
      geyser|a column of hot water and steam shooting into the air every hour|a famous spring spraying boiling water high into the sky|water boiled by underground heat and blasted up as a fountain of steam|geyser shoots hot water up; cone is a pointed hill|geyser 向上喷热水；cone 是尖顶的山丘|cone is a pointed hill or shape, not a spring that shoots water and steam|cone 是尖顶的山丘或形状，不是喷出热水和蒸汽的泉|fissure is a narrow crack in the ground, not a spring that sprays water high into the air|fissure 是地面上的窄裂缝，不是把水高高喷向空中的泉|gey · ser|ey saying a long i, and -ser|ey 读长音 i，结尾是 -ser
      pumice|a rock so full of tiny air holes that it floats on water|a rough, holey stone people rub on their feet to scrub away hard skin|light, holey stones floating in on the waves near a volcano|pumice is light and full of holes; basalt is hard and heavy with no holes|pumice 又轻又多孔；basalt 坚硬沉重、没有孔|basalt is a hard, heavy rock with no holes, so it sinks instead of floating|basalt 是坚硬沉重、没有孔的岩石，会下沉而不会浮起|ash is fine powder, not a solid stone full of holes|ash 是细粉末，不是满是小孔的固体石头|pum · ice|pum and the -ice ending, which says /ɪs/|pum 加结尾 -ice，读 /ɪs/
      basalt|tall black cliffs of hard, heavy rock formed from cooled lava|the solid, dark ocean floor made from lava that cooled under the sea|dark, heavy rock with no holes formed when runny lava cools quickly|basalt is hard, dark and heavy; pumice is light and full of holes|basalt 坚硬、深色、沉重；pumice 又轻又多孔|pumice is a light rock full of holes that floats, not a hard, heavy rock|pumice 是满是小孔、能浮起的轻石，不是坚硬沉重的岩石|ash is soft, fine powder, not solid rock that forms cliffs or the ocean floor|ash 是柔软的细粉，不是构成悬崖或海底的坚硬岩石|ba · salt|ba- followed by the word salt|ba- 后面接 salt
      fissure|a long, narrow split in the ground that lava poured out of|a crack in the ice so deep that the bottom cannot be seen|a crack in the rock no wider than a finger that steam hisses out of|fissure is a long, narrow crack; cone is a pointed hill|fissure 是又长又窄的裂缝；cone 是尖顶的山丘|cone is a pointed hill or shape, not a narrow crack in the ground, ice or rock|cone 是尖顶的山丘或形状，不是地面、冰层或岩石上的窄缝|geyser is a spring that shoots water up, not a crack that something comes out of|geyser 是向上喷水的泉，不是有东西冒出来的裂缝|fis · sure|double s and the -ure ending|双写 s，结尾是 -ure
      evacuate|police moving every family out of a town to a safe place before an eruption|firefighters leading everyone out of a burning building to safety|a fire drill walking everyone out of a school quickly and safely|evacuate means to move people out of danger; invade means to march into a place|evacuate 是把人撤离危险地；invade 是闯入某地|invade means to march into a place to take it, the opposite of moving people out to safety|invade 是闯进某地去占领，与把人撤到安全处正相反|scurry means to run yourself with quick, short steps, not to move a whole group of people out of danger|scurry 是自己迈着碎步快跑，不是把一群人撤离危险地|e · vac · u · ate|one c, then -uate|一个 c，结尾是 -uate
      volcanic|rock made of lava that poured out of a volcano fifty years ago|soil made from old volcano ash|last year's blast that threw ash out of a mountain's crater|volcanic means coming from a volcano; prehistoric means from the time before writing|volcanic 指来自火山的；prehistoric 指有文字记载以前的|prehistoric means from the time before people wrote things down, not made by a volcano|prehistoric 指人类有文字记载以前的，不是由火山形成的|organic means grown without man-made chemicals, not made from lava or volcano ash|organic 指不用人工化学品种植的，不是由熔岩或火山灰形成的|vol · can · ic|volcano without the o, plus -ic|volcano 去掉 o，再加 -ic
      deposit|a thick gray layer of ash settled over fields after a volcano goes quiet|a thin layer of sand and mud building up where a river slows|a rich layer of copper left in the rock long ago|deposit is a layer left behind; eruption is the blast that may cause it|deposit 是留下的一层物质；eruption 是可能造成它的喷发|eruption is the moment a volcano blasts things out, not the layer left lying afterwards|eruption 是火山喷发的那一刻，不是事后留在地上的一层物质|fissure is a narrow crack, not a layer of material that builds up|fissure 是窄窄的裂缝，不是堆积起来的一层物质|de · pos · it|de- and the -sit ending, not -set|de- 开头，结尾是 -sit 不是 -set
    `,
  },
);

const measuring = batch(
  "words-of-measuring",
  ["Words of Measuring", "测量的词"],
  ["measuring and data", "测量与数据"],
  `
  estimate|to make a careful guess about an amount; also the guess|估计|Just by looking, can you ___ roughly how many beans are in the jar without counting them?|Glancing around the room, she tried to ___ its length and guessed that it was about five meters.|From the layers of rock, scientists ___ that the volcano is about ten thousand years old, a careful guess.|calculate,foretell|estimated,estimates
  scale|a set of marks or numbers for measuring; also a machine for weighing|刻度，比例尺；秤|An earthquake's strength is measured on the Richter ___, a set of numbers that runs from one to ten.|The map's ___ shows that one centimeter on the paper stands for one kilometer on the ground.|The thermometer has a ___ of marks along its side, from zero to one hundred degrees.|instrument,ledger|scales
  magnitude|the size or strength of something, such as an earthquake|大小，震级|The earthquake had a ___ of 7.0, a strength great enough to crack roads.|Nobody understood the true ___ of the storm, how huge and strong it would become.|A quake of that ___, strong enough to knock down buildings, happens only once in many years.|error,census
  data|facts and numbers collected to study something|数据|Every hour, the scientists collected ___, facts and numbers from the sensors, to study the volcano.|Our class put the survey ___, all the numbers we had collected, into a table.|The ___ from the instruments, readings taken every day for a year, showed that the ground was rising.|error,estimate
  metric|using meters, liters and grams|公制的|Most countries measure length in meters and kilometers, which are ___ units.|A kilogram, a thousand grams, is the ___ unit of weight that shops all over the world use today.|The ruler has ___ marks in centimeters, which we use in science class every day, on one side.|approximate,obsolete
  instrument|a tool for measuring or doing careful work; also a tool for music|仪器；乐器|A seismograph, the ___ that records earthquakes, is a tool that scientists keep near volcanoes.|The doctor used a small, shiny ___, a tool with a light on the end, to look in my ear.|The violin is a difficult ___ to play, but it makes a beautiful sound.|scale,ledger|instruments
  calculate|to find an answer by using numbers|计算|Can you ___ exactly how far the car will go in two hours if it drives 60 kilometers an hour?|Scientists ___ the exact distance to the center of the earthquake by working through the numbers from three stations.|Add up the prices to ___ the exact total before you pay.|estimate,decipher|calculated,calculation
  error|a mistake|错误，误差|A small ___ in the measurement, a mistake of just one centimeter, gave the wrong result.|She found a careless ___ in her math homework and fixed the mistake.|Because of a ___ in the program, a mistake in one line, the machine stopped working.|magnitude,census|errors
  reliable|able to be trusted; working well every time|可靠的|A ___ scale gives exactly the same reading every time you weigh the same bag.|He is a ___ friend who always keeps his promises and never lets you down.|Our old car is very ___; it has started every single morning for ten years.|approximate,hesitant
  approximate|close to the exact amount but not exact|大约的，近似的|The ___ length of the river is 500 kilometers, give or take a few.|Tell me the ___ time you will arrive, even if you are not sure of the exact minute.|The map shows only the ___ location of the old city, since no one knows exactly where it stood.|reliable,inevitable
  `,
  "context-clues",
  {
    intro: t(
      "Before she could **calculate** the earthquake's **magnitude**, the scientist checked each **instrument** and looked for any **error** in her **data**. These ten words help you talk about measuring things carefully and trusting the numbers.",
      "在计算（**calculate**）地震的震级（**magnitude**）之前，科学家检查了每台仪器（**instrument**），并查找数据（**data**）中有没有错误（**error**）。这十个词帮你谈论如何仔细测量、判断数字是否可信。",
    ),
    watchOut: {
      meanings: t(
        "Tell **estimate** (make a careful guess) apart from **calculate** (work out the exact answer with numbers).",
        "分清 **estimate**（仔细地估计）和 **calculate**（用数字算出准确答案）。",
      ),
      use: t(
        "Tell **magnitude** (how big or strong something is) apart from **scale** (the set of numbers or marks you read it on).",
        "分清 **magnitude**（某物有多大、多强）和 **scale**（读出它的那套数字或刻度）。",
      ),
      spelling: t(
        "Watch **approximate** (double *p*), **reliable** (*-iable*), **magnitude** (*-tude*) and **calculate** (*-cul-*, not *-cal-*, in the middle).",
        "注意 **approximate** 的双写 **p**、**reliable** 的 **-iable**、**magnitude** 的 **-tude**，以及 **calculate** 中间是 **-cul-** 不是 -cal-。",
      ),
    },
    notes: `
      estimate|guessing how many beans are in a jar just by looking, without counting|guessing a room's length at a glance as about five meters|a careful guess from rock layers that a volcano is ten thousand years old|estimate means to make a careful guess; calculate means to work out the exact answer|estimate 是仔细地估计；calculate 是算出准确答案|calculate means to work out an exact answer with numbers, not to guess roughly by looking|calculate 是用数字算出准确答案，不是看一眼粗略地猜|foretell means to say what will happen in the future, not to guess how big or old something is now|foretell 是预言将来会发生的事，不是估计某物现在有多大或多老|es · ti · mate|es- and the -mate ending|es- 开头，结尾是 -mate
      scale|the Richter set of numbers running from one to ten|the part of a map showing that one centimeter stands for one kilometer|marks along a thermometer's side from zero to one hundred degrees|scale is the set of marks or numbers you read; instrument is the tool itself|scale 是读数用的刻度或数字；instrument 是工具本身|instrument is the tool that does the measuring, not the set of marks or numbers used to read it|instrument 是进行测量的工具，不是读数用的那套刻度或数字|ledger is a book of money and goods, not a set of marks or numbers for measuring|ledger 是记钱款货物的账本，不是测量用的一套刻度或数字|scale|sc saying /sk/ and the silent e|sc 读 /sk/，结尾 e 不发音
      magnitude|an earthquake strength of 7.0, great enough to crack roads|how huge and strong a storm would become|a quake strong enough to knock down buildings that happens once in many years|magnitude is how big or strong something is; scale is what you read it on|magnitude 是某物的大小或强度；scale 是读出它的刻度|error is a mistake, not how big or strong something is|error 是错误，不是某物有多大或多强|census is an official count of people, not the size or strength of a storm or a quake|census 是官方的人口清点，不是风暴或地震的大小强度|mag · ni · tude|-ni- and the -tude ending|中间是 -ni-，结尾是 -tude
      data|facts and numbers collected from sensors every hour|survey numbers a class put into a table|readings taken every day for a year that showed the ground rising|data are collected facts and numbers; an estimate is one careful guess|data 是收集来的事实和数字；estimate 是一次估计|error is a mistake, not the facts and numbers that were collected|error 是错误，不是收集来的事实和数字|estimate is a single careful guess, not a set of facts and readings that were collected|estimate 是一次估计，不是收集来的一组事实和读数|da · ta|a long a and the -ta ending|a 读长音，结尾是 -ta
      metric|length measured in meters and kilometers|a kilogram, a thousand grams, used in shops worldwide today|ruler marks in centimeters used in science class every day|metric means using meters, liters and grams; approximate means close but not exact|metric 指使用米、升、克的；approximate 指接近但不精确的|approximate means close to an amount but not exact, not using meters, liters and grams|approximate 指接近某个数量但不精确，不是指使用米、升、克的|obsolete means no longer used, not units that people use every day today|obsolete 指已经不再使用的，不是如今每天都在用的单位|met · ric|meter with the e dropped, plus -ic|meter 去掉 e，再加 -ic
      instrument|a seismograph, a tool that records earthquakes|a small, shiny tool with a light on the end for looking in an ear|a violin that is difficult to play but sounds beautiful|instrument is a tool for measuring or for music; scale is the set of marks read on it|instrument 是测量工具或乐器；scale 是上面读数的刻度|scale is a set of marks or numbers to read, not a tool a doctor holds or a violin you play|scale 是用来读数的刻度或数字，不是医生手里的工具，也不是能演奏的小提琴|ledger is a book for recording money, not a tool for measuring or for making music|ledger 是记钱款的账本，不是测量工具或乐器|in · stru · ment|-stru- and the -ment ending|中间是 -stru-，结尾是 -ment
      calculate|working out exactly how far a car goes in two hours at 60 kilometers an hour|working through the numbers from three stations to find an exact distance|adding up prices to find the exact total|calculate means to work out an exact answer; estimate means to make a careful guess|calculate 是算出准确答案；estimate 是仔细估计|estimate means to make a rough guess, not to work out the exact answer with numbers|estimate 是粗略地估计，不是用数字算出准确答案|decipher means to work out writing that is hard to read, not to work out an answer with numbers|decipher 是辨认难读的文字，不是用数字算出答案|cal · cu · late|-cu- in the middle and the -late ending|中间是 -cu-，结尾是 -late
      error|a mistake of just one centimeter that gave the wrong result|a careless mistake in math homework|a mistake in one line of a program that stopped a machine|error is a mistake; magnitude is size or strength|error 是错误；magnitude 是大小或强度|magnitude is how big or strong something is, not a mistake|magnitude 是某物有多大、多强，不是错误|census is an official count of people, not a mistake in a measurement or a program|census 是官方的人口清点，不是测量或程序里的错误|er · ror|double r, then -or|双写 r，结尾是 -or
      reliable|a scale giving exactly the same reading every time|a friend who always keeps his promises and never lets you down|a car that has started every morning for ten years|reliable means able to be trusted every time; approximate means close but not exact|reliable 指每次都可信的；approximate 指接近但不精确的|approximate means close but not exact, not able to be trusted to work the same way every time|approximate 指接近但不精确，不是指每次都靠得住|hesitant means slow to act because you are unsure, not dependable every single time|hesitant 指因为没把握而迟疑，不是指每次都靠得住|re · li · a · ble|rely with y changed to i, plus -able|rely 把 y 改成 i，再加 -able
      approximate|a river length of 500 kilometers, give or take a few|an arrival time given without being sure of the exact minute|the location of an old city when no one knows exactly where it stood|approximate means close but not exact; reliable means able to be trusted|approximate 指接近但不精确；reliable 指可信的|reliable means able to be trusted every time, not close to an amount but not exact|reliable 指每次都靠得住，不是指接近但不精确|inevitable means sure to happen and impossible to avoid, not close to an exact number|inevitable 指必然发生、无法避免的，不是指接近某个准确数字|ap · prox · i · mate|double p and x, then -imate|双写 p，接着是 x，结尾是 -imate
    `,
  },
);

/** batchesA are the batches of the first five units of grade 6. */
export const batchesA: readonly BatchSpec[] = [
  heroes,
  fate,
  kingdoms,
  light,
  moving,
  sounds,
  romanLaw,
  romanBuilding,
  revolt,
  firstCities,
  records,
  trade,
  plates,
  volcanoes,
  measuring,
];
