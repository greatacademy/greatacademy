// The Watch outs of the listening and reading-aloud topics of the native grades, written for each unit: what is easy
// to mishear in its passages, and which of its words and sentences are hard to read aloud.

import { type Text, t } from "@ga/content";

/** AuralWatch is a unit's own Watch outs: for its passages heard, and for its sentences and stretches read aloud. */
export interface AuralWatch {
  readonly passages: Text;
  readonly sentences: Text;
  readonly stretches: Text;
}

/** auralWatchOuts are the units' Watch outs, keyed by grade and unit: grade-6-ancient-rome. */
export const auralWatchOuts: Readonly<Record<string, AuralWatch>> = {
  "grade-1-all-about-me": {
    passages: t(
      "Pam is *six* and her sister in the next story is *just two*: keep each age with its own child. Mom is the *vet* and Dad is the *cook*—the jobs are said close together, so do not swap them.",
      "帕姆*六岁*，下一篇里的妹妹*才两岁*：年龄要和各自的孩子对上。妈妈是*兽医*，爸爸是*厨师*，两份工作挨着说，别弄反。",
    ),
    sentences: t(
      "In *Gran tells us stories*, say *Gran* with a clear *gr* at the start, and in *I could not walk or talk*, say *could not* in full.",
      "读 *Gran tells us stories* 时，*Gran* 开头的 *gr* 要清楚；读 *I could not walk or talk* 时，*could not* 要完整读出。",
    ),
    stretches: t(
      "The child in *What I Can Do* lists many things: *I can get dressed on my own. I can brush my teeth and make my bed.* Pause a little after each *I can* sentence so the list does not run together.",
      "*What I Can Do* 里孩子列了很多事：*I can get dressed on my own. I can brush my teeth and make my bed.* 每句 *I can* 之后稍停一下，别让一串事情连成一片。",
    ),
  },
  "grade-1-bugs-and-growing-things": {
    passages: t(
      "In *From Seed to Plant*, the *root* grows *down* first and the *shoot* pushes *up* next—two parts, two directions. The butterfly's change takes *about two weeks*, not two days.",
      "*From Seed to Plant* 里，先是*根*向*下*长，然后*嫩芽*向*上*冒：两个部分，两个方向。蝴蝶的变化大约需要*两周*，不是两天。",
    ),
    sentences: t(
      "*Caterpillar* is long: say it in four beats, *CAT-er-pil-lar*. In *The leaves need sunlight*, *leaves* ends with a *v* sound, not an *f*.",
      "*caterpillar* 很长，分四拍读：*CAT-er-pil-lar*。*The leaves need sunlight* 里 *leaves* 结尾是 *v* 音，不是 *f*。",
    ),
    stretches: t(
      "*Some ants look for food. Some take care of the eggs. Some dig new tunnels.* Each sentence starts with *Some*: give each one the same beat and a small pause between them.",
      "*Some ants look for food. Some take care of the eggs. Some dig new tunnels.* 每句都以 *Some* 开头：节奏一致，句与句之间稍停。",
    ),
  },
  "grade-1-food-and-friends": {
    passages: t(
      "At the picnic, *Max* brings sandwiches, *Ann* brings grapes and *Dan* brings cake—three names and three foods in a row. In *Soup for Gran*, *Dad cut them up* but *Lily put them in the pot*.",
      "野餐时，*Max* 带三明治，*Ann* 带葡萄，*Dan* 带蛋糕：三个名字和三样食物接连出现。*Soup for Gran* 里 *Dad cut them up*，而 *Lily put them in the pot*。",
    ),
    sentences: t(
      "*Wheat* and *bread* are tricky: *wheat* starts with *w* (the *h* is silent), and *bread* has a short *e*, like *bed*.",
      "*wheat* 和 *bread* 容易读错：*wheat* 以 *w* 开头（*h* 不发音），*bread* 是短 *e*，和 *bed* 一样。",
    ),
    stretches: t(
      "*First, they washed the carrots and the beans. Next, Dad cut them up.* Pause after *First,* and *Next,* so each step sounds like its own step.",
      "*First, they washed the carrots and the beans. Next, Dad cut them up.* 在 *First,* 和 *Next,* 后稍停，让每一步听起来分得清。",
    ),
  },
  "grade-1-home-and-school": {
    passages: t(
      "Sam looks in *his bag*, *under his desk* and *by the door*, and it is *not there* each time—the lunch box turns up at the *bus stop*. Ben has a job for each day: hold on to which day goes with which job.",
      "萨姆找了*书包*、*课桌下*和*门边*，每次都 *not there*，最后饭盒在*车站*。本每天有一项活儿：要记住哪天对应哪件事。",
    ),
    sentences: t(
      "The days *Wednesday* and *Thursday* are hard to say: *Wednesday* sounds like *WENZ-day*, with the first *d* silent, and *Thursday* starts with a soft *th*.",
      "*Wednesday* 和 *Thursday* 不好读：*Wednesday* 读作 *WENZ-day*，第一个 *d* 不发音；*Thursday* 以轻轻的 *th* 开头。",
    ),
    stretches: t(
      'His friend Ann said, *"I will help you look."* The speaker changes here: read Ann\'s words in her own voice, then go back to the storyteller.',
      'His friend Ann said, *"I will help you look."* 这里说话人变了：用安的语气读她的话，再回到讲故事的人。',
    ),
  },
  "grade-1-pets-and-animals": {
    passages: t(
      "In *A Pup Named Max*, *Mom was not glad*—listen for the *not*. In *Animal Homes*, a *nest*, a *hole* and a *hive* come one after another, so match each home with its own animal.",
      "*A Pup Named Max* 里 *Mom was not glad*，要听清 *not*。*Animal Homes* 里 *nest*、*hole*、*hive* 一个接一个出现，每个家要和对应的动物配对。",
    ),
    sentences: t(
      "*Chick* and *check* sound close: in *a little chick came out*, say a short *i*. In *the hen had six chicks*, say the *-cks* at the end so it means more than one.",
      "*chick* 和 *check* 发音相近：*a little chick came out* 里要读短 *i*。*the hen had six chicks* 结尾的 *-cks* 要读出来，表示不止一只。",
    ),
    stretches: t(
      "*A bird makes a nest in a tree. It uses twigs, grass and mud.* The list *twigs, grass and mud* needs a short break at each comma.",
      "*A bird makes a nest in a tree. It uses twigs, grass and mud.* 列举 *twigs, grass and mud* 时，每个逗号处都要稍停。",
    ),
  },
  "grade-1-weather-and-seasons": {
    passages: t(
      "Meg's coat is *yellow* and her boots are *red*: two colors close together, easy to swap. In *The Four Seasons*, *fall* is both a season and what leaves do—*leaves fall from the trees in fall*.",
      "梅格的外套是*黄色*，靴子是*红色*：两种颜色挨着说，容易弄混。*The Four Seasons* 里 *fall* 既是季节，也是树叶落下——*leaves fall from the trees in fall*。",
    ),
    sentences: t(
      "In *Tom put on his mittens*, say *mittens* with a short, quick *-tens*. In *a rainbow in the sky*, put the stress on *RAIN*.",
      "读 *Tom put on his mittens* 时，*mittens* 的 *-tens* 要短而快。读 *a rainbow in the sky* 时，重音在 *RAIN*。",
    ),
    stretches: t(
      "*Drip, drop, drip. It is raining.* Read the rain sounds slowly with small pauses, then read *It is raining* in a normal voice.",
      "*Drip, drop, drip. It is raining.* 雨声要慢慢读、稍作停顿，再用平常的语气读 *It is raining*。",
    ),
  },
  "grade-10-ambition-and-power": {
    passages: t(
      "Keep the rulers and their dates straight: Napoleon crowned on *December 2, 1804*, Caesar killed in *44 BC*, the First Emperor united China in *221 BC*, and Edward spoke on *December 11, 1936*. *Elba* is the island of exile; *Waterloo* is the last defeat.",
      "统治者和年份要对上：拿破仑 *December 2, 1804* 加冕，恺撒 *44 BC* 遇刺，秦始皇 *221 BC* 统一中国，爱德华 *December 11, 1936* 发表演说。*Elba* 是流放之岛，*Waterloo* 是最后的败仗。",
    ),
    sentences: t(
      "*Notre-Dame* is *NOH-truh DAHM*. *insatiable* is *in-SAY-shuh-bul*. *hegemony* is *hih-JEM-uh-nee*. *conspirators* is *kun-SPEER-uh-terz*. *exonerated* is *ig-ZON-uh-ray-tid*. *contrition* is *kun-TRISH-un*.",
      "*Notre-Dame* 读作 *NOH-truh DAHM*。*insatiable* 读作 *in-SAY-shuh-bul*。*hegemony* 读作 *hih-JEM-uh-nee*。*conspirators* 读作 *kun-SPEER-uh-terz*。*exonerated* 读作 *ig-ZON-uh-ray-tid*。*contrition* 读作 *kun-TRISH-un*。",
    ),
    stretches: t(
      "*Was Brutus a loyal citizen or a treacherous friend?* Rise on *loyal citizen* and fall on *treacherous friend*, the usual tune of an either-or question, and give *treacherous* its three beats: *TRECH-er-us*.",
      "*Was Brutus a loyal citizen or a treacherous friend?* *loyal citizen* 升调，*treacherous friend* 降调，这是选择疑问句的常见语调；*treacherous* 读足三拍：*TRECH-er-us*。",
    ),
  },
  "grade-10-media-and-truth": {
    passages: t(
      "Many names here: the *Sun* and the moon hoax, *Nellie Bly* and the asylum, *Hearst* and *Pulitzer* over the Maine, *Woodward* and *Bernstein* at Watergate, *Gallup* and the poll, *Wald* and the planes. Keep each name with its story.",
      "人名很多：*Sun* 与月球骗局，*Nellie Bly* 与疯人院，*Hearst* 和 *Pulitzer* 与缅因号，*Woodward* 和 *Bernstein* 与水门事件，*Gallup* 与民调，*Wald* 与飞机。每个名字要对上故事。",
    ),
    sentences: t(
      "*Herschel* is *HER-shul*. *asylum* is *uh-SY-lum*. *Havana* is *huh-VAN-uh*. *Watergate* is *WAW-ter-gate*. *survivorship* is *ser-VY-ver-ship*. *Raskin* is *RAS-kin*. *Priya* is *PREE-yuh*.",
      "*Herschel* 读作 *HER-shul*。*asylum* 读作 *uh-SY-lum*。*Havana* 读作 *huh-VAN-uh*。*Watergate* 读作 *WAW-ter-gate*。*survivorship* 读作 *ser-VY-ver-ship*。*Raskin* 读作 *RAS-kin*。*Priya* 读作 *PREE-yuh*。",
    ),
    stretches: t(
      '*"A lie can travel halfway around the world," Marcus said when he read Priya\'s story, "while the truth is still putting on its shoes."* Drop your voice for the speech tag in the middle, then pick the quotation back up at the same pitch.',
      '*"A lie can travel halfway around the world," Marcus said when he read Priya\'s story, "while the truth is still putting on its shoes."* 中间的说话人标注降调，然后用原来的音高接上引语。',
    ),
  },
  "grade-10-money-and-work": {
    passages: t(
      "Hear the money words: *bubble*, *contracts*, *deflation*, *austerity*, *mean* and *median*. A billion is not a million; the café's average jumps to *more than ninety million dollars*. Greek unemployment rose above *27 percent*.",
      "听清金融词：*bubble*、*contracts*、*deflation*、*austerity*、*mean* 和 *median*。billion 不是 million；咖啡馆的平均数跳到 *more than ninety million dollars*。希腊失业率超过 *27 percent*。",
    ),
    sentences: t(
      "*Haarlem* is *HAR-lem*. *insolvent* is *in-SOL-vent*. *stagnated* is *STAG-nay-tid*. *deflation* is *dih-FLAY-shun*. *median* is *MEE-dee-un*. *Stuttgart* is *SHTOOT-gart*. *stipulated* is *STIP-yuh-lay-tid*.",
      "*Haarlem* 读作 *HAR-lem*。*insolvent* 读作 *in-SOL-vent*。*stagnated* 读作 *STAG-nay-tid*。*deflation* 读作 *dih-FLAY-shun*。*median* 读作 *MEE-dee-un*。*Stuttgart* 读作 *SHTOOT-gart*。*stipulated* 读作 *STIP-yuh-lay-tid*。",
    ),
    stretches: t(
      "*Prices rise because people expect them to keep rising, and they keep rising because people expect it, until one day the buyers disappear.* Let the two halves mirror each other in rhythm, then slow and drop for *until one day the buyers disappear*.",
      "*Prices rise because people expect them to keep rising, and they keep rising because people expect it, until one day the buyers disappear.* 前两半节奏对称，*until one day the buyers disappear* 放慢降调。",
    ),
  },
  "grade-10-poems-across-time": {
    passages: t(
      "Hear the form names clearly: *sonnet*, *ballad*, *haiku*, *elegy*, *ode*. The turn is the *volta*; a sentence that runs on is *enjambment*, and a line that stops is *end-stopped*. *Iamb* and *anapest* are feet, not forms.",
      "诗体名称要听清：*sonnet*、*ballad*、*haiku*、*elegy*、*ode*。转折叫 *volta*；句子跨行叫 *enjambment*，行尾停顿叫 *end-stopped*。*Iamb* 和 *anapest* 是音步，不是诗体。",
    ),
    sentences: t(
      "*volta* is *VOHL-tuh*. *Petrarch* is *PEH-trark*. *Basho* is *BAH-shoh*. *Pindar* is *PIN-dar*. *enjambment* is *en-JAM-ment*. *pentameter* is *pen-TAM-ih-ter*. *anapest* is *AN-uh-pest*.",
      "*volta* 读作 *VOHL-tuh*。*Petrarch* 读作 *PEH-trark*。*Basho* 读作 *BAH-shoh*。*Pindar* 读作 *PIN-dar*。*enjambment* 读作 *en-JAM-ment*。*pentameter* 读作 *pen-TAM-ih-ter*。*anapest* 读作 *AN-uh-pest*。",
    ),
    stretches: t(
      "*The meaning is identical, but the feeling is not.* Stress *identical* and *feeling*, pause briefly at the comma, and let *is not* close firmly, since the contrast is the whole point.",
      "*The meaning is identical, but the feeling is not.* 重读 *identical* 和 *feeling*，逗号处稍停，*is not* 要收得干脆，对比就是重点。",
    ),
  },
  "grade-10-satire-and-humor": {
    passages: t(
      "Satire hides in a straight face: listen for the calm voice of *Swift*, Gulliver's *polite seriousness*, and the BBC's *perfectly straight face*. *Lilliput* and *Blefuscu* are the two islands; *Hynkel* is Chaplin's dictator and *Tomainia* his country.",
      "讽刺藏在一本正经里：听斯威夫特冷静的语气、格列佛的 *polite seriousness* 和 BBC 的 *perfectly straight face*。*Lilliput* 和 *Blefuscu* 是两个岛；*Hynkel* 是卓别林的独裁者，*Tomainia* 是他的国家。",
    ),
    sentences: t(
      "*Lilliputians* is *lil-ih-PYOO-shunz*. *Blefuscu* is *bleh-FUS-kyoo*. *obsequious* is *ub-SEE-kwee-us*. *weevil* is *WEE-vul*. *lacquer* is *LAK-er*. *Tammany* is *TAM-uh-nee*. *caustic* is *KAWS-tik*.",
      "*Lilliputians* 读作 *lil-ih-PYOO-shunz*。*Blefuscu* 读作 *bleh-FUS-kyoo*。*obsequious* 读作 *ub-SEE-kwee-us*。*weevil* 读作 *WEE-vul*。*lacquer* 读作 *LAK-er*。*Tammany* 读作 *TAM-uh-nee*。*caustic* 读作 *KAWS-tik*。",
    ),
    stretches: t(
      "*There was a short pause. A cow came over to investigate the golden scissors.* Leave a real silence after *pause*, then read the cow sentence in a flat, serious voice; the joke works only if you do not laugh.",
      "*There was a short pause. A cow came over to investigate the golden scissors.* *pause* 后真的停一下，再用平板严肃的语气读奶牛那句；不笑，笑点才成立。",
    ),
  },
  "grade-10-the-natural-world": {
    passages: t(
      "Keep the years apart: Carson's book in *1962*, her death in *1964*, the DDT ban in *1972*, the wolves' return in *1995* and *1996*, Austin's rabbits in *1859*, and Black Sunday on *April 14, 1935*. *Elk* and *eagles* are easy to mix up at speed.",
      "年份要分清：卡森的书 *1962*，她去世 *1964*，DDT 禁令 *1972*，狼回归 *1995* 和 *1996*，奥斯汀的兔子 *1859*，黑色星期日 *April 14, 1935*。语速快时 *elk* 和 *eagles* 容易混。",
    ),
    sentences: t(
      "*ospreys* is *OS-preez*. *Yellowstone* is *YEL-oh-stone*. *myxoma* is *mik-SOH-muh*. *trophic* is *TROH-fik*. *fjords* is *fee-ORDZ*. *Scandinavia* is *skan-dih-NAY-vee-uh*. *Buckminster* is *BUK-min-ster*.",
      "*ospreys* 读作 *OS-preez*。*Yellowstone* 读作 *YEL-oh-stone*。*myxoma* 读作 *mik-SOH-muh*。*trophic* 读作 *TROH-fik*。*fjords* 读作 *fee-ORDZ*。*Scandinavia* 读作 *skan-dih-NAY-vee-uh*。*Buckminster* 读作 *BUK-min-ster*。",
    ),
    stretches: t(
      "*I had crossed the moor, and for an hour it had let me know exactly how little it cared.* Pause at the comma, then slow down through *exactly how little it cared*, letting the last word fall.",
      "*I had crossed the moor, and for an hour it had let me know exactly how little it cared.* 逗号处停顿，*exactly how little it cared* 放慢，最后一个词落下。",
    ),
  },
  "grade-10-voices-of-persuasion": {
    passages: t(
      "Keep the numbers apart: the grandmother has lived on Mill Street *forty-one years*, the bridge serves *two hundred families*, and the repair year ends in *six weeks*. The tea study had only *ten people*, and the river is the cleanest in *sixty years*.",
      "数字别混：奶奶在 Mill Street 住了 *forty-one years*，桥服务 *two hundred families*，维修期限还剩 *six weeks*。茶的研究只有 *ten people*，河水是 *sixty years* 来最干净的。",
    ),
    sentences: t(
      "*inches* is *IN-chiz*, not inch-ess. *luxury* is *LUK-shuh-ree*. *wetland* is *WET-land*. *expires* is *ik-SPYRZ*. *generations* is *jen-uh-RAY-shunz*.",
      "*inches* 读作 *IN-chiz*。*luxury* 读作 *LUK-shuh-ree*。*wetland* 读作 *WET-land*。*expires* 读作 *ik-SPYRZ*。*generations* 读作 *jen-uh-RAY-shunz*。",
    ),
    stretches: t(
      "*We planted them in the rain. We planted them in the heat. We planted them when people said it could not be done.* Give each *We planted them* the same rise, and let the third line run longer and land hardest.",
      "*We planted them in the rain. We planted them in the heat. We planted them when people said it could not be done.* 每个 *We planted them* 语调相同，第三句拉长、落得最重。",
    ),
  },
  "grade-10-war-and-memory": {
    passages: t(
      "Numbers crowd these stories: about *700,000* casualties at Verdun, about *130,000* unknown soldiers in the Ossuary, more than *58,000* names on the wall, and some *25,000* dead in Dresden. Listen for which number goes with which place.",
      "这些故事数字很多：凡尔登约 *700,000* 人伤亡，藏骨堂约 *130,000* 名无名士兵，墙上 *58,000* 多个名字，德累斯顿约 *25,000* 人死亡。听清每个数字属于哪里。",
    ),
    sentences: t(
      "*Ypres* is *EE-pruh*. *Verdun* is *ver-DUN*. *attrition* is *uh-TRISH-un*. *Ossuary* is *OSH-oo-er-ee*. *Cenotaph* is *SEN-uh-taf*. *Sadako* is *sah-DAH-koh*. *Guérin* is *gay-RAN*.",
      "*Ypres* 读作 *EE-pruh*。*Verdun* 读作 *ver-DUN*。*attrition* 读作 *uh-TRISH-un*。*Ossuary* 读作 *OSH-oo-er-ee*。*Cenotaph* 读作 *SEN-uh-taf*。*Sadako* 读作 *sah-DAH-koh*。*Guérin* 读作 *gay-RAN*。",
    ),
    stretches: t(
      '*"This is our cry. This is our prayer. Peace in the world."* Read the three short sentences slowly and evenly, with a full stop after each, and keep *Peace in the world* gentle rather than loud.',
      '*"This is our cry. This is our prayer. Peace in the world."* 三个短句慢而均匀，每句后完全停顿，*Peace in the world* 要轻柔，不要大声。',
    ),
  },
  "grade-11-a-century-of-change": {
    passages: t(
      "Keep the big numbers apart: *twelve million people* passed through Ellis Island and *two percent* were sent back; investors sold *nearly thirteen million shares*; *one in four* workers had no job; *fifteen million people* fled at partition; the wall stood *twenty-eight years*.",
      "大数字别混：*twelve million people* 经过埃利斯岛，*two percent* 被遣返；投资者抛售 *nearly thirteen million shares*；*one in four* 工人失业；分治时 *fifteen million people* 逃离家园；柏林墙立了 *twenty-eight years*。",
    ),
    sentences: t(
      "*Jawaharlal* is *juh-WAH-hur-lahl*. *censorship* is *SEN-ser-ship*. *globalization* is *gloh-buh-luh-ZAY-shun*. *totalitarian* is *toh-tal-ih-TAIR-ee-un*. *propaganda* is *prop-uh-GAN-duh*.",
      "*Jawaharlal* 读作 *juh-WAH-hur-lahl*。*censorship* 读作 *SEN-ser-ship*。*globalization* 读作 *gloh-buh-luh-ZAY-shun*。*totalitarian* 读作 *toh-tal-ih-TAIR-ee-un*。*propaganda* 读作 *prop-uh-GAN-duh*。",
    ),
    stretches: t(
      "*At night the guns are quiet sometimes, and then you can hear the rats, and once, very far away, a bird.* Read it quietly, slow down at each comma, and leave a small pause before the last two words.",
      "*At night the guns are quiet sometimes, and then you can hear the rats, and once, very far away, a bird.* 轻声读，每个逗号放慢，最后两个词前留一个小停顿。",
    ),
  },
  "grade-11-between-two-worlds": {
    passages: t(
      "The ship docked on *the twenty-second of june, 1948*, with *about a thousand passengers*. At partition, *between ten and twenty million people* moved; Lahore and Amritsar are *about fifty kilometers apart*. *About eighteen hundred towers* still stand, and braceros signed *about four and a half million* contracts.",
      "船在 *the twenty-second of june, 1948* 靠岸，载着 *about a thousand passengers*。分治时有 *between ten and twenty million people* 迁移；拉合尔和阿姆利则相距 *about fifty kilometers apart*。*About eighteen hundred towers* 仍然矗立，短工计划签了 *about four and a half million* 份合同。",
    ),
    sentences: t(
      "*Korzeniowski* is *kor-zhen-YOF-skee*. *qiaopi* is *CHYOW-pee*. *Amritsar* is *um-RIT-ser*. *bilingualism* is *by-LING-gwuh-liz-um*. *descendants* is *dih-SEN-dunts*.",
      "*Korzeniowski* 读作 *kor-zhen-YOF-skee*。*qiaopi* 读作 *CHYOW-pee*。*Amritsar* 读作 *um-RIT-ser*。*bilingualism* 读作 *by-LING-gwuh-liz-um*。*descendants* 读作 *dih-SEN-dunts*。",
    ),
    stretches: t(
      "*They had thought of themselves as British; many of their neighbors did not.* Stress *themselves* in the first half, pause at the semicolon, and let *did not* fall flat and quiet.",
      "*They had thought of themselves as British; many of their neighbors did not.* 前半句重读 *themselves*，分号处停顿，*did not* 平平地、轻轻地落下。",
    ),
  },
  "grade-11-dreams-and-promises": {
    passages: t(
      "Do not swap the land and the money: settlers claimed *160 acres*, and *1.6 million claims* were granted. Carnegie built *more than 2,500 public libraries*; a Levittown house cost *about 8,000 dollars*. Of children born in 1940, *about 90 percent* out-earned their parents; of those born in 1980, *only about half*.",
      "土地和金额别弄混：移民申领 *160 acres*，共批准 *1.6 million claims*。卡内基建了 *more than 2,500 public libraries*；莱维敦的房子约 *about 8,000 dollars*。1940年出生的孩子 *about 90 percent* 收入超过父母，1980年出生的只有 *only about half*。",
    ),
    sentences: t(
      "*affluent* is *AF-loo-unt*. *ostentatious* is *os-ten-TAY-shus*. *disillusioned* is *dis-ih-LOO-zhund*. *Carnegie* is *KAR-nuh-gee*. *mobility* is *moh-BIL-ih-tee*.",
      "*affluent* 读作 *AF-loo-unt*。*ostentatious* 读作 *os-ten-TAY-shus*。*disillusioned* 读作 *dis-ih-LOO-zhund*。*Carnegie* 读作 *KAR-nuh-gee*。*mobility* 读作 *moh-BIL-ih-tee*。",
    ),
    stretches: t(
      "*A house is not only a place to live; it is the main way most families build wealth.* Stress *not only*, pause at the semicolon, and lift *the main way* before the sentence settles.",
      "*A house is not only a place to live; it is the main way most families build wealth.* 重读 *not only*，分号处停一下，*the main way* 稍扬起后再收住。",
    ),
  },
  "grade-11-justice-and-protest": {
    passages: t(
      "Hear the figures exactly: pickers earned *a dollar and twenty-five cents* an hour; Chavez fasted *twenty-five days*; *146 people* died in *about eighteen minutes*; *thirteen people* began the rides and *more than four hundred* joined; the race was the *200-meter* sprint.",
      "数字要听准：采摘工时薪 *a dollar and twenty-five cents*；查韦斯绝食 *twenty-five days*；*about eighteen minutes* 内 *146 people* 遇难；*thirteen people* 发起乘车运动，后来 *more than four hundred* 人加入；比赛是 *200-meter* 短跑。",
    ),
    sentences: t(
      "*Delano* is *duh-LAY-noh*. *segregation* is *seg-rih-GAY-shun*. *disobedience* is *dis-uh-BEE-dee-unce*. *Finnbogadottir* is *FIN-boh-gah-dot-ir*. *Shirtwaist* is *SHURT-wayst*.",
      "*Delano* 读作 *duh-LAY-noh*。*segregation* 读作 *seg-rih-GAY-shun*。*disobedience* 读作 *dis-uh-BEE-dee-unce*。*Finnbogadottir* 读作 *FIN-boh-gah-dot-ir*。*Shirtwaist* 读作 *SHURT-wayst*。",
    ),
    stretches: t(
      "*A just law, he argued, is one that uplifts human dignity; an unjust law is one that degrades it, or that a majority imposes on a minority while refusing to obey it itself.* Set *a just law* against *an unjust law*, and *uplifts* against *degrades*, with a clear pause at the semicolon.",
      "*A just law, he argued, is one that uplifts human dignity; an unjust law is one that degrades it, or that a majority imposes on a minority while refusing to obey it itself.* *a just law* 对 *an unjust law*，*uplifts* 对 *degrades*，分号处清楚停顿。",
    ),
  },
  "grade-11-machines-and-makers": {
    passages: t(
      "Do not mix the hours and the crowds: the law cut the week from *fifty-six hours to fifty-four*; *more than twenty thousand workers* struck, from *more than forty countries*. Deep Blue saw *two hundred million positions* a second, and the Moral Machine gathered *about forty million decisions*.",
      "工时和人数别混：法律把每周工时从 *fifty-six hours to fifty-four*；*more than twenty thousand workers* 罢工，来自 *more than forty countries*。深蓝每秒看 *two hundred million positions*，道德机器收集了 *about forty million decisions*。",
    ),
    sentences: t(
      "*Golem* is *GOH-lum*. *synagogue* is *SIN-uh-gog*. *Jacquard* is *juh-KARD*. *Kasparov* is *kas-PAR-of*. *algorithms* is *AL-guh-rith-umz*.",
      "*Golem* 读作 *GOH-lum*。*synagogue* 读作 *SIN-uh-gog*。*Jacquard* 读作 *juh-KARD*。*Kasparov* 读作 *kas-PAR-of*。*algorithms* 读作 *AL-guh-rith-umz*。",
    ),
    stretches: t(
      "*Where there was a hole, a hook passed through and lifted a thread; where there was no hole, the thread stayed down.* Read the two halves as a matched pair, lifting *a hole* and then *no hole*, with a pause at the semicolon.",
      "*Where there was a hole, a hook passed through and lifted a thread; where there was no hole, the thread stayed down.* 两半句像一对来读，先扬 *a hole* 再扬 *no hole*，分号处停顿。",
    ),
  },
  "grade-11-nature-and-the-self": {
    passages: t(
      "Several people, several dates: Thoreau moved in on *the fourth of july, 1845*; Muir walked *a thousand miles*; the Wordsworths walked home on *the fifteenth of april, 1802*; Tao Yuanming quit after *about eighty days*; Gatewood set out at *sixty-seven* and walked again at *seventy-five*.",
      "人多日期也多：梭罗在 *the fourth of july, 1845* 搬进小屋；缪尔走了 *a thousand miles*；华兹华斯兄妹在 *the fifteenth of april, 1802* 走回家；陶渊明做了 *about eighty days* 就辞官；盖特伍德 *sixty-seven* 岁出发，*seventy-five* 岁又走了一遍。",
    ),
    sentences: t(
      "*Thoreau* is *thuh-ROH*. *sequoia* is *sih-KWOY-uh*. *Appalachian* is *ap-uh-LAY-chun*. *chrysanthemums* is *krih-SAN-thuh-mumz*. *sublime* is *suh-BLYME*.",
      "*Thoreau* 读作 *thuh-ROH*。*sequoia* 读作 *sih-KWOY-uh*。*Appalachian* 读作 *ap-uh-LAY-chun*。*chrysanthemums* 读作 *krih-SAN-thuh-mumz*。*sublime* 读作 *suh-BLYME*。",
    ),
    stretches: t(
      "*He went to the woods, he wrote, because he wished to live deliberately, to face only the essential facts of life, and to see if he could learn what it had to teach.* Tuck *he wrote* in lightly, then give the three *to* phrases a steady, growing rhythm.",
      "*He went to the woods, he wrote, because he wished to live deliberately, to face only the essential facts of life, and to see if he could learn what it had to teach.* *he wrote* 轻轻带过，三个 *to* 短语节奏平稳、逐步加强。",
    ),
  },
  "grade-11-rights-and-laws": {
    passages: t(
      "Dates crowd this unit, so pin each to its event: *in june 1215* for the charter, *in 1848* for Seneca Falls, New Zealand *in 1893*, Finland *in 1906*, Britain *in 1918*, the United States *in 1920*, and real protection only *in 1965*. The code holds *about 280 laws*, and the petition gathered *nine hundred signatures* in *six weeks*.",
      "这一单元日期很多，每个都要配上事件：宪章是 *in june 1215*，塞尼卡福尔斯是 *in 1848*，新西兰 *in 1893*，芬兰 *in 1906*，英国 *in 1918*，美国 *in 1920*，真正落实要到 *in 1965*。法典约有 *about 280 laws*，请愿书在 *six weeks* 里收集了 *nine hundred signatures*。",
    ),
    sentences: t(
      "*Hammurabi* is *ham-uh-RAH-bee*. *Montesquieu* is *MON-tes-kyoo*. *legislature* is *LEJ-is-lay-cher*. *unconstitutional* is *un-kon-stih-TOO-shuh-nul*. *archaeologists* is *ar-kee-OL-uh-jists*.",
      "*Hammurabi* 读作 *ham-uh-RAH-bee*。*Montesquieu* 读作 *MON-tes-kyoo*。*legislature* 读作 *LEJ-is-lay-cher*。*unconstitutional* 读作 *un-kon-stih-TOO-shuh-nul*。*archaeologists* 读作 *ar-kee-OL-uh-jists*。",
    ),
    stretches: t(
      "*To no one will we sell, to no one deny or delay right or justice.* Give the two *to no one* the same weight, pause after *sell*, and let *right or justice* land slowly at the end.",
      "*To no one will we sell, to no one deny or delay right or justice.* 两个 *to no one* 分量相同，*sell* 后稍停，最后慢慢落在 *right or justice* 上。",
    ),
  },
  "grade-11-science-and-society": {
    passages: t(
      "The numbers carry the arguments: *one hundred studies* were repeated and only *about forty percent* held up; a coin flipped *ten times* can give *eight heads*. The plants averaged *21.4 centimeters* and *21.1 centimeters*, a gap too small to mean much.",
      "数字承载论证：重做了 *one hundred studies*，只有 *about forty percent* 站得住；硬币抛 *ten times* 可能出现 *eight heads*。植物平均是 *21.4 centimeters* 和 *21.1 centimeters*，差距小到说明不了什么。",
    ),
    sentences: t(
      "*Semmelweis* is *ZEM-ul-vys*. *placebo* is *pluh-SEE-boh*. *correlation* is *kor-uh-LAY-shun*. *atmosphere* is *AT-muh-sfeer*. *consensus* is *kun-SEN-sus*.",
      "*Semmelweis* 读作 *ZEM-ul-vys*。*placebo* 读作 *pluh-SEE-boh*。*correlation* 读作 *kor-uh-LAY-shun*。*atmosphere* 读作 *AT-muh-sfeer*。*consensus* 读作 *kun-SEN-sus*。",
    ),
    stretches: t(
      "*A single surprising study, however widely reported, is a starting point, not a final answer.* Drop your voice for the middle phrase, then contrast *a starting point* with *not a final answer*.",
      "*A single surprising study, however widely reported, is a starting point, not a final answer.* 中间插入语压低声音，再把 *a starting point* 和 *not a final answer* 对比着读。",
    ),
  },
  "grade-12-art-and-its-critics": {
    passages: t(
      "Keep the money apart: Whistler asked *two hundred guineas* and won *one farthing*; the Banksy sold for *just over one million pounds* and later *more than eighteen million pounds*; Maloof paid *about four hundred dollars* for negatives that grew to *more than a hundred thousand*.",
      "金额别混：惠斯勒开价 *two hundred guineas*，只赢得 *one farthing*；班克斯的画先卖 *just over one million pounds*，后来卖了 *more than eighteen million pounds*；马卢夫花 *about four hundred dollars* 买的底片后来累积到 *more than a hundred thousand* 张。",
    ),
    sentences: t(
      "*Stravinsky* is *struh-VIN-skee*. *Nijinsky* is *nih-ZHIN-skee*. *Duchamp* is *doo-SHAHN*. *coxcomb* is *KOKS-kohm*. *philistine* is *FIL-ih-steen*.",
      "*Stravinsky* 读作 *struh-VIN-skee*。*Nijinsky* 读作 *nih-ZHIN-skee*。*Duchamp* 读作 *doo-SHAHN*。*coxcomb* 读作 *KOKS-kohm*。*philistine* 读作 *FIL-ih-steen*。",
    ),
    stretches: t(
      "*Strong opinion is not the problem; insult without argument is.* Stress *not* in the first half, pause at the semicolon, and land the last word *is* with weight.",
      "*Strong opinion is not the problem; insult without argument is.* 前半句重读 *not*，分号处停顿，最后的 *is* 落得有分量。",
    ),
  },
  "grade-12-belief-and-doubt": {
    passages: t(
      "Match each thinker to a date: Descartes thought alone *in the winter of 1619* and published *in 1641*; Hume wrote *in the 1740s*; Nozick's machine came *in 1974*; Rawls published *in 1971*; Jackson's Mary appeared *in 1982*; Foot described the trolley *in 1967*. Mencius and Xunzi lived *about twenty-three centuries ago*.",
      "每位思想家配一个时间：笛卡尔 *in the winter of 1619* 独自沉思，*in 1641* 出书；休谟 *in the 1740s* 写作；诺齐克的机器是 *in 1974*；罗尔斯 *in 1971* 出书；杰克逊的玛丽 *in 1982* 出现；富特 *in 1967* 提出电车问题。孟子和荀子生活在 *about twenty-three centuries ago*。",
    ),
    sentences: t(
      "*Descartes* is *day-KART*. *epistemology* is *ih-pis-tuh-MOL-uh-jee*. *Glaucon* is *GLAW-kon*. *hedonism* is *HEE-duh-niz-um*. *Mencius* is *MEN-shee-us*.",
      "*Descartes* 读作 *day-KART*。*epistemology* 读作 *ih-pis-tuh-MOL-uh-jee*。*Glaucon* 读作 *GLAW-kon*。*hedonism* 读作 *HEE-duh-niz-um*。*Mencius* 读作 *MEN-shee-us*。",
    ),
    stretches: t(
      "*Human nature is bad, he wrote; goodness is the result of conscious effort.* Tuck *he wrote* in lightly, pause at the semicolon, and stress *conscious effort* as the answer.",
      "*Human nature is bad, he wrote; goodness is the result of conscious effort.* *he wrote* 轻轻带过，分号处停顿，把 *conscious effort* 当作答案重读。",
    ),
  },
  "grade-12-essays-of-experience": {
    passages: t(
      "Ages and places shift between essays, so tie each to its writer: the sweater came *the winter i turned ten*; the father spoke *four languages* and gave his talk when she was *fourteen*; the runner *finished nineteenth*; the cook had worked nights for *eleven years*; the letter goes from *seventeen* back to *twelve*.",
      "每篇的年龄和数字不同，要对应到作者：毛衣是 *the winter i turned ten* 织的；父亲会 *four languages*，她 *fourteen* 岁时他去学校讲话；跑步的女孩 *finished nineteenth*；厨师上了 *eleven years* 夜班；那封信是 *seventeen* 写给 *twelve* 的。",
    ),
    sentences: t(
      "*humiliated* is *hyoo-MIL-ee-ay-tid*. *hypothesis* is *hy-POTH-uh-sis*. *candid* is *KAN-did*. *Delacroix* is *del-uh-KWAH*. *Tagalog* is *tuh-GAH-log*.",
      "*humiliated* 读作 *hyoo-MIL-ee-ay-tid*。*hypothesis* 读作 *hy-POTH-uh-sis*。*candid* 读作 *KAN-did*。*Delacroix* 读作 *del-uh-KWAH*。*Tagalog* 读作 *tuh-GAH-log*。",
    ),
    stretches: t(
      "*What my grandmother gave me was not an object but a patience, a way of making something slowly, one loop at a time.* Set *not an object* against *but a patience*, then slow down for *one loop at a time*, as if counting.",
      "*What my grandmother gave me was not an object but a patience, a way of making something slowly, one loop at a time.* *not an object* 与 *but a patience* 对比，再放慢读 *one loop at a time*，像在一针一针数。",
    ),
  },
  "grade-12-literature-across-languages": {
    passages: t(
      "Dates and counts run close: Yan Fu published *in 1898*; the brothers' anthology came *in 1909* and sold *only a few dozen copies*; Tagore went to London *in 1912*; Garnett translated *about seventy volumes*; Waley's Genji filled *six volumes*; the 1954 program knew *about two hundred and fifty words*.",
      "日期和数量很接近：严复 *in 1898* 出版；兄弟俩的译文集 *in 1909* 出版，只卖了 *only a few dozen copies*；泰戈尔 *in 1912* 去伦敦；加内特译了 *about seventy volumes*；韦利的《源氏》有 *six volumes*；1954年的程序只认识 *about two hundred and fifty words*。",
    ),
    sentences: t(
      "*Gitanjali* is *gee-TAHN-juh-lee*. *Dostoevsky* is *dos-toy-EF-skee*. *Murasaki* is *moo-rah-SAH-kee*. *Quixote* is *kee-HOH-tee*. *saudade* is *sow-DAH-duh*.",
      "*Gitanjali* 读作 *gee-TAHN-juh-lee*。*Dostoevsky* 读作 *dos-toy-EF-skee*。*Murasaki* 读作 *moo-rah-SAH-kee*。*Quixote* 读作 *kee-HOH-tee*。*saudade* 读作 *sow-DAH-duh*。",
    ),
    stretches: t(
      "*Every translator faces the same three questions: Is it true? Is it clear? Is it good?* Pause at the colon, then give the three short questions the same rising shape, each a little slower.",
      "*Every translator faces the same three questions: Is it true? Is it clear? Is it good?* 冒号处停顿，三个短问句用同样的升调，一句比一句稍慢。",
    ),
  },
  "grade-12-power-and-conscience": {
    passages: t(
      "Years pile up, so link each to its case: the Tarbell series ran *from 1902 to 1904* and the Court ruled *in 1911*; Kelsey began *in the autumn of 1960*; Milgram's study was *in 1961*; Enron fell *in december 2001*; Acton wrote *in 1887*; the papers ran on *june 13, 1971*; Serpico went to the paper *in 1970*.",
      "年份很多，要配上案例：塔贝尔的系列报道 *from 1902 to 1904*，最高法院判决是 *in 1911*；凯尔西 *in the autumn of 1960* 入职；米尔格拉姆实验是 *in 1961*；安然 *in december 2001* 破产；阿克顿 *in 1887* 写信；五角大楼文件在 *june 13, 1971* 刊出；塞尔皮科 *in 1970* 找到报社。",
    ),
    sentences: t(
      "*thalidomide* is *thuh-LID-uh-myde*. *ostensible* is *os-TEN-suh-bul*. *tantamount* is *TAN-tuh-mownt*. *nepotism* is *NEP-uh-tiz-um*. *impunity* is *im-PYOO-nih-tee*.",
      "*thalidomide* 读作 *thuh-LID-uh-myde*。*ostensible* 读作 *os-TEN-suh-bul*。*tantamount* 读作 *TAN-tuh-mownt*。*nepotism* 读作 *NEP-uh-tiz-um*。*impunity* 读作 *im-PYOO-nih-tee*。",
    ),
    stretches: t(
      "*Power tends to corrupt, and absolute power corrupts absolutely.* Lean on *tends* in the first half, pause at the comma, and let *absolutely* close the sentence firmly.",
      "*Power tends to corrupt, and absolute power corrupts absolutely.* 前半句重读 *tends*，逗号处停顿，*absolutely* 坚定地收尾。",
    ),
  },
  "grade-12-risk-and-responsibility": {
    passages: t(
      "Heights and tolls are easy to swap: the Fukushima wall was *less than six meters* and the waves *roughly thirteen to fifteen meters*; the London smog killed *around four thousand* at first count and perhaps *about twelve thousand*; after Chernobyl *more than three hundred thousand people* moved; the Dutch flood killed *more than eighteen hundred*.",
      "高度和死亡人数容易弄混：福岛海堤 *less than six meters*，海浪 *roughly thirteen to fifteen meters*；伦敦烟雾最初统计 *around four thousand* 人，后来可能 *about twelve thousand*；切尔诺贝利后 *more than three hundred thousand people* 迁离；荷兰洪水死了 *more than eighteen hundred* 人。",
    ),
    sentences: t(
      "*Chernobyl* is *cher-NOH-bul*. *Pripyat* is *PRIP-yut*. *Fukushima* is *foo-koo-SHEE-mah*. *precautionary* is *prih-KAW-shuh-ner-ee*. *estuary* is *ES-choo-air-ee*.",
      "*Chernobyl* 读作 *cher-NOH-bul*。*Pripyat* 读作 *PRIP-yut*。*Fukushima* 读作 *foo-koo-SHEE-mah*。*precautionary* 读作 *prih-KAW-shuh-ner-ee*。*estuary* 读作 *ES-choo-air-ee*。",
    ),
    stretches: t(
      "*The Dutch did not try to make the risk zero, which would have been impossible. They decided how small it had to be.* Let the first sentence fall at *impossible*, then pause, and stress *how small* in the second.",
      "*The Dutch did not try to make the risk zero, which would have been impossible. They decided how small it had to be.* 第一句在 *impossible* 处落下，停顿后，第二句重读 *how small*。",
    ),
  },
  "grade-2-animals-big-and-small": {
    passages: t(
      "*It is not a dinosaur*—the *not* flips the answer, so listen for it. The blue whale is huge but eats *tiny* krill; the hummingbird is tiny but its wings beat *so fast*.",
      "*It is not a dinosaur*——*not* 让答案反过来，要听清。蓝鲸很大却吃*很小*的磷虾；蜂鸟很小，翅膀却扇得*非常快*。",
    ),
    sentences: t(
      "*Krill* is a short word with a rolled-together *kr*: *KRIL*. In *a helicopter*, put the stress first: *HEL-i-cop-ter*.",
      "*krill* 很短，*kr* 要连起来读：*KRIL*。*a helicopter* 重音在前：*HEL-i-cop-ter*。",
    ),
    stretches: t(
      '*"Please let me go," cried the mouse. "One day, I will help you." The lion laughed.* The mouse speaks in two parts and then the lion laughs: keep the mouse\'s small voice, then switch back.',
      '*"Please let me go," cried the mouse. "One day, I will help you." The lion laughed.* 老鼠分两句说话，接着狮子大笑：保持老鼠细小的声音，再切换回来。',
    ),
  },
  "grade-2-how-things-work": {
    passages: t(
      "Magnets *pull* iron but do *not* pull wood, paper, glass or plastic—two lists said close together. Turned one way, two magnets *stick*; turned around, they *push away*.",
      "磁铁能*吸*铁，却*吸不动*木头、纸、玻璃和塑料：两张清单挨着说。两块磁铁一个方向会*吸在一起*，转过来就会*互相推开*。",
    ),
    sentences: t(
      "In *the top spun*, *spun* is the past of *spin*. In *at a slant*, *slant* has a short *a*, like *ant*.",
      "*the top spun* 里 *spun* 是 *spin* 的过去式。*at a slant* 里 *slant* 是短 *a*，和 *ant* 一样。",
    ),
    stretches: t(
      "*Cars, bikes, trains and wagons all roll on wheels.* Four things in a list: pause lightly after each comma, and let *wheels* end the sentence.",
      "*Cars, bikes, trains and wagons all roll on wheels.* 列了四样东西：每个逗号后轻轻停顿，让 *wheels* 收尾。",
    ),
  },
  "grade-2-letters-and-celebrations": {
    passages: t(
      "Nora's cake is shaped like *a rocket*, and *five* friends came—small details said once. At the Moon Festival, *lanterns* are carried and *mooncakes* are shared: keep the two apart.",
      "诺拉的蛋糕是*火箭*形的，来了*五个*朋友：这些小细节只说一次。中秋节里，*灯笼*是提着的，*月饼*是分着吃的：别把两样弄混。",
    ),
    sentences: t(
      "*Mooncake* is one word with the stress on *MOON*. In *Dear Gran,* and *Love, Nora*, the letter's greeting and ending are read with a small pause after the comma.",
      "*mooncake* 是一个词，重音在 *MOON*。读信里的 *Dear Gran,* 和 *Love, Nora* 时，逗号后要稍停。",
    ),
    stretches: t(
      '*When he opened the door, everyone shouted, "Surprise!"* Build up slowly to the comma, then say *Surprise!* loud and bright.',
      '*When he opened the door, everyone shouted, "Surprise!"* 逗号前慢慢铺垫，然后响亮欢快地喊出 *Surprise!*。',
    ),
  },
  "grade-2-long-ago-and-today": {
    passages: t(
      "Each passage moves between *long ago* and *today*: keep apart what children had then (*a wooden top*, *a slate*, *candles*) and what we have now (*toys that beep*, *bulbs that save power*). Gran's school had *just one room* and *only one teacher*.",
      "每篇都在*从前*和*今天*之间来回：分清那时有的（*木陀螺*、*石板*、*蜡烛*）和现在有的（*会响的玩具*、*节能灯泡*）。奶奶的学校*只有一间教室*、*只有一位老师*。",
    ),
    sentences: t(
      "*Wooden* starts like *wood* with a short *oo*: *WOOD-en*. In *a tin pail*, *pail* sounds the same as *pale*.",
      "*wooden* 开头和 *wood* 一样是短 *oo*：*WOOD-en*。*a tin pail* 里的 *pail* 和 *pale* 读音相同。",
    ),
    stretches: t(
      '*"We did not have much," Gran told me, "but we learned a lot, and we had fun."* Gran\'s words are cut in two by *Gran told me*: read that middle part in the storyteller\'s voice, then go back to Gran.',
      '*"We did not have much," Gran told me, "but we learned a lot, and we had fun."* 奶奶的话被 *Gran told me* 分成两半：中间那句用讲述者的语气读，再回到奶奶的语气。',
    ),
  },
  "grade-2-our-neighborhood": {
    passages: t(
      "The town helpers come in a long row—*firefighters*, *police officers*, *doctors and nurses*, *teachers*, *mail carriers*, *bakers*—so tie each job to its own work. At the market, the eggs are *forgotten* and fetched later, out of order.",
      "城里的帮手一个接一个出现：*消防员*、*警察*、*医生和护士*、*老师*、*邮递员*、*面包师*，每种工作要和它做的事对上。在市场上，鸡蛋先*忘了买*，后来才回去买，顺序被打乱了。",
    ),
    sentences: t(
      "*Library* has two *r* sounds: say *LIE-brer-ee*, not *lie-berry*. In *the doors opened by themselves*, *themselves* ends with a *z* sound.",
      "*library* 里有两个 *r* 音：读作 *LIE-brer-ee*，不要读成 *lie-berry*。*the doors opened by themselves* 里 *themselves* 结尾是 *z* 音。",
    ),
    stretches: t(
      '*"Can we come back next week?" she asked. Her dad laughed. "We can come back every week," he said.* Mia asks and her dad answers: change voices between them.',
      '*"Can we come back next week?" she asked. Her dad laughed. "We can come back every week," he said.* 米娅提问，爸爸回答：两人之间要换语气。',
    ),
  },
  "grade-2-tales-to-tell": {
    passages: t(
      "The boy cries wolf *two times* before the real wolf comes *one evening*—count the tricks. In *The Little Red Hen*, *Not I* comes from *the cat*, *the dog* and *the duck* in that order.",
      "男孩在真狼*一天傍晚*出现前喊了*两次*狼来了：要数清骗了几次。*The Little Red Hen* 里说 *Not I* 的依次是*猫*、*狗*和*鸭子*。",
    ),
    sentences: t(
      '*Grasshopper* has three beats: *GRASS-hop-per*. In *"Not I," said the cat*, say *I* clearly and long, like *eye*.',
      '*grasshopper* 有三拍：*GRASS-hop-per*。*"Not I," said the cat* 里的 *I* 要读得清楚、拉长，像 *eye*。',
    ),
    stretches: t(
      '*"Not I," said the cat. "Not I," said the dog. "Not I," said the duck.* Read the three lines with the same beat, like a chant, with a pause between animals.',
      '*"Not I," said the cat. "Not I," said the dog. "Not I," said the duck.* 三句用同样的节奏读，像念歌谣，换动物时稍停。',
    ),
  },
  "grade-3-along-the-yellow-river": {
    passages: t(
      "Yu's *father* built walls of earth; *Yu* dug canals to lead the water away—the story turns on that difference. Yu worked for *thirteen years* and passed his home *three times*: two numbers, do not mix them.",
      "禹的*父亲*筑土墙；*禹*挖渠引水，故事的关键就在这点不同。禹干了*十三年*，*三次*路过家门：两个数字别弄混。",
    ),
    sentences: t(
      "*Calligraphy* is *ca-LIG-ra-fee*, with the push on the second beat. In *Bronze is a mix of two softer metals, copper and tin*, say *copper* and *tin* clearly at the end.",
      "*calligraphy* 读作 *ca-LIG-ra-fee*，重音在第二拍。读 *Bronze is a mix of two softer metals, copper and tin* 时，结尾的 *copper* 和 *tin* 要读清楚。",
    ),
    stretches: t(
      "*When they saw invaders, they lit a beacon fire. The smoke could be seen from the next tower, and the warning raced along the wall faster than any horse.* Build speed a little through the second sentence, as the warning races along.",
      "*When they saw invaders, they lit a beacon fire. The smoke could be seen from the next tower, and the warning raced along the wall faster than any horse.* 读第二句时稍稍加快，像警报一路飞奔。",
    ),
  },
  "grade-3-how-animals-survive": {
    passages: t(
      "The snowshoe hare is *brown in summer* and *white in winter*: keep each color with its season. The arctic ground squirrel sleeps for *seven or eight months*, and its heart slows to *just a few beats a minute*.",
      "雪靴兔*夏天是褐色*，*冬天是白色*：颜色要和季节对上。北极地松鼠要睡*七八个月*，心跳慢到*每分钟只有几下*。",
    ),
    sentences: t(
      "*Hibernation* has four beats: *hi-ber-NA-tion*. In *camouflage*, the last part sounds like *flahzh*, not *flag*.",
      "*hibernation* 有四拍：*hi-ber-NA-tion*。*camouflage* 结尾读作 *flahzh*，不是 *flag*。",
    ),
    stretches: t(
      "*First, the polar bear has two kinds of warm covering. … Second, its feet are made for walking on ice. … Third, the polar bear has a powerful nose.* Stress *First*, *Second* and *Third* and pause after each, so the listener can count the three ways.",
      "*First, the polar bear has two kinds of warm covering. … Second, its feet are made for walking on ice. … Third, the polar bear has a powerful nose.* 重读 *First*、*Second*、*Third*，每个后面稍停，让听的人数得出三点。",
    ),
  },
  "grade-3-how-plants-live": {
    passages: t(
      "Every plant needs *four* things—*light, water, air and a place to grow*: count them as you hear them. In the stems passage, water goes *up* the tubes and food goes *down*; do not swap the two directions.",
      "每种植物需要*四样*东西：*光、水、空气和生长的地方*，边听边数。讲茎的那篇里，水沿管子往*上*走，养料往*下*走，两个方向别弄反。",
    ),
    sentences: t(
      "*Photosynthesis* is long: *pho-to-SYN-the-sis*, with the push on *SYN*. *Chlorophyll* starts with a *k* sound: *KLOR-o-fill*.",
      "*photosynthesis* 很长：*pho-to-SYN-the-sis*，重音在 *SYN*。*chlorophyll* 开头是 *k* 音：*KLOR-o-fill*。",
    ),
    stretches: t(
      "*Some seeds travel by wind. … Some seeds travel by water. … Many seeds travel with animals.* Each paragraph opens with a new way to travel: lift your voice a little on *wind*, *water* and *animals* so the three ways stand out.",
      "*Some seeds travel by wind. … Some seeds travel by water. … Many seeds travel with animals.* 每段开头都是一种新的传播方式：读到 *wind*、*water*、*animals* 时稍稍提高声音，让三种方式清楚分开。",
    ),
  },
  "grade-3-life-on-the-nile": {
    passages: t(
      "The *Black Land* is the rich soil by the river and the *Red Land* is the desert: the names are about color, not about night. A flood that is *too low* means hunger, and one that is *too high* washes homes away.",
      "*黑土地*是河边的肥沃土壤，*红土地*是沙漠：名字说的是颜色，不是黑夜。洪水*太低*会挨饿，*太高*会冲走房屋。",
    ),
    sentences: t(
      "*Hieroglyphs* has four beats: *HI-er-o-glifs*. *Papyrus* is *pa-PY-rus*, with the push in the middle. *Pharaoh* sounds like *FAIR-oh*.",
      "*hieroglyphs* 有四拍：*HI-er-o-glifs*。*papyrus* 读作 *pa-PY-rus*，重音在中间。*pharaoh* 读作 *FAIR-oh*。",
    ),
    stretches: t(
      "*So a boat going north could simply float with the current. A boat going south could raise its sail and let the wind push it up the river against the current.* Stress *north* and *south* so the two ways of travel are clearly set against each other.",
      "*So a boat going north could simply float with the current. A boat going south could raise its sail and let the wind push it up the river against the current.* 重读 *north* 和 *south*，让两种行船方式形成清楚的对比。",
    ),
  },
  "grade-3-making-music": {
    passages: t(
      "*Beat* is the steady pulse, *tempo* is how fast it goes, and *rhythm* is the pattern of long and short sounds: three words, three ideas. *Pitch* is high or low, which is not the same as *loud* or *soft*.",
      "*节拍*是稳定的律动，*速度*是它有多快，*节奏*是长短音的组合：三个词，三个意思。*音高*是高低，不等于*响*或*轻*。",
    ),
    sentences: t(
      "*Xylophone* starts with a *z* sound: *ZY-lo-fone*. *Percussion* is *per-KUSH-un*, and *didgeridoo* is *DIJ-er-ee-doo*.",
      "*xylophone* 开头是 *z* 音：*ZY-lo-fone*。*percussion* 读作 *per-KUSH-un*，*didgeridoo* 读作 *DIJ-er-ee-doo*。",
    ),
    stretches: t(
      "*A guitar shakes its strings, a drum shakes its skin, and a flute shakes the air inside it.* The three parts share one pattern: keep the same beat for each, and stress *strings*, *skin* and *air*.",
      "*A guitar shakes its strings, a drum shakes its skin, and a flute shakes the air inside it.* 三个部分句式相同：节奏保持一致，重读 *strings*、*skin*、*air*。",
    ),
  },
  "grade-3-our-world-on-a-map": {
    passages: t(
      "On most maps *north is at the top* and *east is on the right*: east and west are easy to swap. The *key* tells what symbols mean, but the *scale* tells distance—two different boxes on a map.",
      "大多数地图*上北*，*右边是东*：东西最容易弄反。*图例*说明符号的意思，*比例尺*说明距离，是地图上两样不同的东西。",
    ),
    sentences: t(
      "*Hemisphere* is *HEM-is-feer*, with the *ph* as an *f*. In *a compass rose*, say *compass* as *KUM-pus*.",
      "*hemisphere* 读作 *HEM-is-feer*，*ph* 读 *f*。*a compass rose* 里，*compass* 读作 *KUM-pus*。",
    ),
    stretches: t(
      "*You leave the school in C4, walk north along Oak Street, and cross the bridge.* Read the steps of the route in order, with a short pause at each comma, so the listener can follow the way.",
      "*You leave the school in C4, walk north along Oak Street, and cross the bridge.* 按顺序读路线的每一步，每个逗号处稍停，让听的人跟得上。",
    ),
  },
  "grade-3-poems-for-all-seasons": {
    passages: t(
      "In *The Puddle Jumper*, each puddle is bigger than the last: *a little one*, *deeper*, *a giant lake*. In *The Last Apple*, the apple stays because it is *too far to reach*, not because no one wants it.",
      "*The Puddle Jumper* 里水坑一个比一个大：*a little one*、*deeper*、*a giant lake*。*The Last Apple* 里苹果留下来是因为*够不着*，不是没人想要。",
    ),
    sentences: t(
      "In *My footsteps crunched across the ground*, let *crunched* sound crisp. In *They blink, they wink, they drift, they rise*, keep each short *they* light and the verbs clear.",
      "读 *My footsteps crunched across the ground* 时，*crunched* 要读得清脆。读 *They blink, they wink, they drift, they rise* 时，每个 *they* 轻读，动词读清楚。",
    ),
    stretches: t(
      "*Buzz, buzz, from flower to flower, / hour by hour by golden hour.* Keep the poem's beat steady across the line break, and do not stop at the end of a line when the sentence goes on.",
      "*Buzz, buzz, from flower to flower, / hour by hour by golden hour.* 跨行时保持诗的节拍，句子没完就不要在行尾停下。",
    ),
  },
  "grade-3-pushes-pulls-and-magnets": {
    passages: t(
      "*Opposite poles attract* and *like poles repel*: the two rules sound alike, so listen for *opposite* and *like*. A steel can is lifted by the magnet; an *aluminum* can is left behind.",
      "*异极相吸*，*同极相斥*：两条规则听起来很像，要听清 *opposite* 和 *like*。磁铁吸起的是钢罐，*铝罐*被留下。",
    ),
    sentences: t(
      "*Electromagnet* has five beats: *e-LEC-tro-mag-net*. In *Friction happens when two surfaces rub against each other*, say *surfaces* as *SUR-fis-iz*.",
      "*electromagnet* 有五拍：*e-LEC-tro-mag-net*。读 *Friction happens when two surfaces rub against each other* 时，*surfaces* 读作 *SUR-fis-iz*。",
    ),
    stretches: t(
      "*If both teams pull with the same strength, the rope does not move. … Now imagine one team pulls harder.* Slow down on *the same strength*, then lift your voice on *harder*, so the change from balanced to unbalanced is heard.",
      "*If both teams pull with the same strength, the rope does not move. … Now imagine one team pulls harder.* 读 *the same strength* 时放慢，读 *harder* 时提高声音，让人听出从平衡到不平衡的变化。",
    ),
  },
  "grade-3-stories-and-fables": {
    passages: t(
      "In *The Missing Lunch*, *Pepper* is the dog who ate the sandwich and *Ruby* is the friend who shares hers: two names, two very different parts. In *The Spelling Bee*, Priya's mistake is in *necessary*, but Sam wins with *bicycle*.",
      "*The Missing Lunch* 里，*Pepper* 是吃掉三明治的狗，*Ruby* 是分午饭的朋友：两个名字，角色完全不同。*The Spelling Bee* 里，普丽娅拼错的是 *necessary*，萨姆赢在 *bicycle*。",
    ),
    sentences: t(
      "*Necessary* has four beats, *NEC-es-sar-y*; put the push on the first one. In *her grandmother's careful writing*, say the *s* of *grandmother's* clearly.",
      "*necessary* 有四拍：*NEC-es-sar-y*，重音在第一拍。读 *her grandmother's careful writing* 时，*grandmother's* 的 *s* 要读清楚。",
    ),
    stretches: t(
      '*"You don\'t have to do that," Tomas said. "I know," Ruby said, smiling. "But I want to."* Change your voice a little for each speaker, and let *But I want to* sound warm and sure.',
      '*"You don\'t have to do that," Tomas said. "I know," Ruby said, smiling. "But I want to."* 每个说话人换一点语气，*But I want to* 要读得温暖而坚定。',
    ),
  },
  "grade-3-weather-and-climate": {
    passages: t(
      "Weather changes *hour to hour*; climate is the pattern over *thirty years or more*—listen for which word each sentence uses. With lightning, count *five seconds* for every *mile*.",
      "天气*每小时都在变*；气候是*三十年以上*的规律，听清每句用的是哪个词。看到闪电后，每*五秒*算*一英里*。",
    ),
    sentences: t(
      "*Anemometer* is hard: *an-e-MOM-e-ter*, five beats. In *the atmosphere*, say *AT-mos-feer*, with the *ph* as an *f*.",
      "*anemometer* 很难读：*an-e-MOM-e-ter*，五拍。*atmosphere* 读作 *AT-mos-feer*，*ph* 读 *f*。",
    ),
    stretches: t(
      "*A thermometer measures temperature, how hot or cold the air is. A rain gauge is a tube that collects rain.* Each tool is followed by its job: pause after the tool's name, and drop your voice a little on the explaining part after the comma.",
      "*A thermometer measures temperature, how hot or cold the air is. A rain gauge is a tube that collects rain.* 每个仪器后面跟着它的用途：说完仪器名稍停，逗号后的解释部分声音稍稍放低。",
    ),
  },
  "grade-4-art-and-artists": {
    passages: t(
      "Adding *white* makes a *tint*; adding *black* makes a *shade*—the two words are easy to swap. *Carving* takes material away and *modeling* builds it up.",
      "加*白*得到 *tint*（浅色），加*黑*得到 *shade*（暗色）：两个词容易弄混。*carving* 是去掉材料，*modeling* 是堆加材料。",
    ),
    sentences: t(
      "*Complementary* has five beats: *com-ple-MEN-ta-ree*. *Fresco* is *FRES-ko*, and *Michelangelo* is *my-kel-AN-je-lo*.",
      "*complementary* 有五拍：*com-ple-MEN-ta-ree*。*fresco* 读作 *FRES-ko*，*Michelangelo* 读作 *my-kel-AN-je-lo*。",
    ),
    stretches: t(
      "*Red and yellow make orange. Yellow and blue make green. Blue and red make purple.* Three sentences with one pattern: keep the same rhythm, and stress the color each pair makes.",
      "*Red and yellow make orange. Yellow and blue make green. Blue and red make purple.* 三句句式相同：节奏保持一致，重读每组调出的颜色。",
    ),
  },
  "grade-4-deserts-rainforests-and-polar-lands": {
    passages: t(
      "The rainforest layers come in order from the top: *emergent*, *canopy*, *understory*, *forest floor*—keep each animal with its own layer. The fennec fox's ears do *two* jobs: hearing insects and letting out heat.",
      "雨林的分层从上往下是：*emergent*、*canopy*、*understory*、*forest floor*，每种动物要和自己的那层对上。耳廓狐的耳朵有*两个*作用：听虫子和散热。",
    ),
    sentences: t(
      "*Permafrost* is *PER-ma-frost*, with the push on the first beat. *Saguaro* is *sa-WAR-o*: the *g* is not said. *Oasis* is *o-AY-sis*.",
      "*permafrost* 读作 *PER-ma-frost*，重音在第一拍。*saguaro* 读作 *sa-WAR-o*，*g* 不发音。*oasis* 读作 *o-AY-sis*。",
    ),
    stretches: t(
      "*In the daytime the Sahara is scorching. … At night, though, the heat escapes into the clear sky, and the air can become cold.* Lean on *daytime* and *night* and pause at *though*, so the turn from hot to cold is heard.",
      "*In the daytime the Sahara is scorching. … At night, though, the heat escapes into the clear sky, and the air can become cold.* 重读 *daytime* 和 *night*，在 *though* 处停顿，让人听出从热到冷的转折。",
    ),
  },
  "grade-4-energy-all-around": {
    passages: t(
      "Heat travels three ways—*conduction*, *convection* and *radiation*—and they sound alike: keep each name with its example (spoon, heater, sun). Sound travels *fastest in solids*, slower in water and slowest in air.",
      "热有三种传播方式：*conduction*、*convection*、*radiation*，听起来很像，每个名字要和例子对上（勺子、暖气、太阳）。声音*在固体中最快*，水中次之，空气中最慢。",
    ),
    sentences: t(
      "*Translucent* is *trans-LOO-sent*; *opaque* ends like *make*: *o-PAKE*. *Renewable* is *re-NEW-a-bul*.",
      "*translucent* 读作 *trans-LOO-sent*；*opaque* 结尾像 *make*：*o-PAKE*。*renewable* 读作 *re-NEW-a-bul*。",
    ),
    stretches: t(
      "*A chain pulls the cars slowly up the first big hill. At the top, they pause for a moment. Then they rush down the other side, faster and faster, and zoom up the next hill.* Read slowly at first, pause at *the top*, then speed up on *faster and faster*, like the ride.",
      "*A chain pulls the cars slowly up the first big hill. At the top, they pause for a moment. Then they rush down the other side, faster and faster, and zoom up the next hill.* 开头读慢，读到 *the top* 时停一下，读 *faster and faster* 时加快，就像坐过山车。",
    ),
  },
  "grade-4-life-in-the-middle-ages": {
    passages: t(
      "A boy became a *page* at *seven*, a *squire* at *fourteen* and a *knight* at *twenty-one*—three stages, three ages. The *moat* is a ditch, the *drawbridge* rises and the *portcullis* slides down: three defenses, do not swap them.",
      "男孩*七岁*当*侍童*，*十四岁*当*侍从*，*二十一岁*成*骑士*：三个阶段，三个年龄。*moat* 是护城河，*drawbridge* 能升起，*portcullis* 能落下：三种防御别弄混。",
    ),
    sentences: t(
      "*Portcullis* is *port-KUL-is*. *Scriptorium* is *skrip-TOR-ee-um*. *Chivalry* starts with a *sh* sound: *SHIV-al-ree*.",
      "*portcullis* 读作 *port-KUL-is*。*scriptorium* 读作 *skrip-TOR-ee-um*。*chivalry* 开头是 *sh* 音：*SHIV-al-ree*。",
    ),
    stretches: t(
      "*A siege ended in one of three ways. The attackers broke in, the people inside ran out of food and gave up, or the attackers grew tired, sick or hungry themselves and went home.* Pause after *three ways*, then read the three endings as a list with a short pause at each comma.",
      "*A siege ended in one of three ways. The attackers broke in, the people inside ran out of food and gave up, or the attackers grew tired, sick or hungry themselves and went home.* 读完 *three ways* 停一下，再把三种结局当成列举来读，每个逗号稍停。",
    ),
  },
  "grade-4-lives-that-made-a-difference": {
    passages: t(
      "The years are close together—keep each one with its person: Louis Braille *1809*, Marie Curie *1867*, Wangari Maathai's movement *1977*, Tu Youyou's task *1969*. Braille letters have *up to six* dots.",
      "年份挨得很近，每个要和人物对上：路易·布莱尔 *1809*，居里夫人 *1867*，旺加里·马塔伊的运动 *1977*，屠呦呦接受任务 *1969*。盲文字母最多有*六个*点。",
    ),
    sentences: t(
      "*Ichthyosaur* begins with a *k* sound: *IK-thee-o-sor*. *Radioactivity* has seven beats: *ray-dee-o-ak-TIV-i-tee*. *Plesiosaur* is *PLEE-zee-o-sor*.",
      "*ichthyosaur* 开头是 *k* 音：*IK-thee-o-sor*。*radioactivity* 有七拍：*ray-dee-o-ak-TIV-i-tee*。*plesiosaur* 读作 *PLEE-zee-o-sor*。",
    ),
    stretches: t(
      '*"If she says they\'re good," he said, "then I\'m ready to go."* The quotation is split by *he said*: drop your voice for *he said*, then pick Glenn\'s voice back up.',
      '*"If she says they\'re good," he said, "then I\'m ready to go."* 引语被 *he said* 隔开：读 *he said* 时声音放低，再接回格伦的语气。',
    ),
  },
  "grade-4-our-changing-earth": {
    passages: t(
      "Underground melted rock is *magma*; once it reaches the surface it is *lava*—the two words are close in sound and easy to swap. *Weathering* breaks rock down; *erosion* carries the pieces away.",
      "地下的熔岩叫 *magma*，到了地面才叫 *lava*：两个词发音接近，容易弄混。*weathering*（风化）是把岩石分解，*erosion*（侵蚀）是把碎块带走。",
    ),
    sentences: t(
      "*Metamorphic* has four beats: *met-a-MOR-fik*. *Seismographs* begins like *size*: *SIZE-mo-grafs*. In *igneous*, say *IG-nee-us*.",
      "*metamorphic* 有四拍：*met-a-MOR-fik*。*seismographs* 开头像 *size*：*SIZE-mo-grafs*。*igneous* 读作 *IG-nee-us*。",
    ),
    stretches: t(
      "*They may push together, pull apart or grind past each other.* Give the three movements the same weight, and lift a little before *or* so the last one sounds like the end of the list.",
      "*They may push together, pull apart or grind past each other.* 三种运动读得一样重，*or* 之前稍稍上扬，让最后一项听起来是列举的结尾。",
    ),
  },
  "grade-4-plays-for-the-stage": {
    passages: t(
      "Listen for *who* is speaking: each line begins with a name. In *The Lost Ticket*, the family leaves in *five minutes*; in *The Talent Show*, Omar is next in *two minutes*.",
      "听清*谁*在说话：每句台词前都有名字。*The Lost Ticket* 里全家*五分钟*后出发；*The Talent Show* 里奥马尔*两分钟*后上场。",
    ),
    sentences: t(
      "Stage directions are not spoken lines: in *MAYA: [In a small voice] I can't find my ticket.*, read the words in brackets as a direction, then say Maya's line softly.",
      "舞台说明不是台词：读 *MAYA: [In a small voice] I can't find my ticket.* 时，方括号里的话按说明来读，再轻声说出玛雅的台词。",
    ),
    stretches: t(
      "*BOLT: [In a flat, beeping voice] Tea. Is. Ready.* Then later: *BOLT: [In a cheerful voice] Good afternoon! Shall I make some tea?* Make the two voices clearly different, so the listener hears that Bolt is fixed.",
      "*BOLT: [In a flat, beeping voice] Tea. Is. Ready.* 后面又有 *BOLT: [In a cheerful voice] Good afternoon! Shall I make some tea?* 两种声音要明显不同，让听的人听出波尔特修好了。",
    ),
  },
  "grade-4-tall-tales-and-tricksters": {
    passages: t(
      "In *Coyote Brings the Summer*, the bag passes *Coyote, Eagle, Deer, Turtle*—follow the order as you hear it. In the pumpkin tale, each step of time makes it bigger: a *hay wagon*, then the *farmhouse*, then the *whole valley* in shadow.",
      "*Coyote Brings the Summer* 里，袋子依次经过*土狼、老鹰、鹿、乌龟*，边听边跟上顺序。南瓜的故事里，时间每过一段它就更大：*干草车*、*农舍*，最后遮住*整个山谷*。",
    ),
    sentences: t(
      "In *She swung it three times around her head and sent it sailing*, let *swung* and *sailing* carry the motion. *Lasso* is *LASS-oh*.",
      "读 *She swung it three times around her head and sent it sailing* 时，用 *swung* 和 *sailing* 带出动作感。*lasso* 读作 *LASS-oh*。",
    ),
    stretches: t(
      "*By the age of five, she could lasso a jackrabbit on the run. By ten, she could rope a whole herd of cattle with a single throw.* Each *By* sentence grows bigger: raise your voice a little more each time to show the exaggeration.",
      "*By the age of five, she could lasso a jackrabbit on the run. By ten, she could rope a whole herd of cattle with a single throw.* 每句 *By* 都比上一句更夸张：每次声音提高一点，表现夸张。",
    ),
  },
  "grade-4-the-human-body": {
    passages: t(
      "*Arteries* carry blood *away* from the heart and *veins* bring it *back*: listen for which way each word goes. The small intestine is *not small*—it is as long as a school bus.",
      "*arteries*（动脉）把血液*带离*心脏，*veins*（静脉）把血液*带回*：听清每个词的方向。小肠*并不小*，有一辆校车那么长。",
    ),
    sentences: t(
      "*Esophagus* has four beats: *e-SOF-a-gus*. *Diaphragm* ends in a silent *g*: *DY-a-fram*. In *intestine*, say *in-TES-tin*.",
      "*esophagus* 有四拍：*e-SOF-a-gus*。*diaphragm* 结尾的 *g* 不发音：*DY-a-fram*。*intestine* 读作 *in-TES-tin*。",
    ),
    stretches: t(
      "*When it tightens and moves down, air rushes in. When it relaxes and moves up, air is pushed out.* The two sentences mirror each other: stress *down* and *in*, then *up* and *out*.",
      "*When it tightens and moves down, air rushes in. When it relaxes and moves up, air is pushed out.* 两句相互对应：先重读 *down* 和 *in*，再重读 *up* 和 *out*。",
    ),
  },
  "grade-4-the-silk-road": {
    passages: t(
      "In Samarkand, *silk and porcelain* came from China, *pepper, cotton and stones* from India, *carpets and silver* from Persia: keep each good with its land. Paper left China after a battle at *Talas* in *751*.",
      "撒马尔罕的*丝绸和瓷器*来自中国，*胡椒、棉花和宝石*来自印度，*地毯和白银*来自波斯：每种货物要和产地对上。纸是在*751*年*怛罗斯*之战后传出中国的。",
    ),
    sentences: t(
      "*Caravanserais* is long: *kar-a-VAN-se-rize*. *Samarkand* is *SAM-ar-kand*. *Taklamakan* is *tah-kla-ma-KAHN*.",
      "*caravanserais* 很长：*kar-a-VAN-se-rize*。*Samarkand* 读作 *SAM-ar-kand*。*Taklamakan* 读作 *tah-kla-ma-KAHN*。",
    ),
    stretches: t(
      "*Buyer and seller would argue, laugh, sip tea and argue again until they reached a price both could accept.* Keep the four actions light and even, then slow down on *a price both could accept*.",
      "*Buyer and seller would argue, laugh, sip tea and argue again until they reached a price both could accept.* 四个动作读得轻快均匀，读到 *a price both could accept* 时放慢。",
    ),
  },
  "grade-5-ancient-greece": {
    passages: t(
      "The *acropolis* is the hill with temples; the *agora* is the marketplace below. Columns: *Doric* plain, *Ionic* scrolls, *Corinthian* leaves. Teacher to student: *Socrates*, *Plato*, *Aristotle*.",
      "*acropolis* 是有神庙的山丘；*agora* 是山下的市场。柱式：*Doric* 朴素，*Ionic* 卷涡，*Corinthian* 叶饰。师生相传：*Socrates*、*Plato*、*Aristotle*。",
    ),
    sentences: t(
      "*Acropolis* is *a-KROP-o-lis*. *Parthenon* is *PAR-thuh-non*. *Socrates* is *SOK-ra-teez*. *Laconic* is *la-KON-ik*.",
      "*acropolis* 读作 *a-KROP-o-lis*。*Parthenon* 读作 *PAR-thuh-non*。*Socrates* 读作 *SOK-ra-teez*。*laconic* 读作 *la-KON-ik*。",
    ),
    stretches: t(
      '*When an enemy king threatened, "If I invade, I will destroy your city," the Spartans are said to have replied with a single word: "If."* Read the threat in a big voice, pause at the colon, then say *If* short and calm.',
      '*When an enemy king threatened, "If I invade, I will destroy your city," the Spartans are said to have replied with a single word: "If."* 威胁的话读得响亮，冒号处停顿，然后把 *If* 读得简短而平静。',
    ),
  },
  "grade-5-bridges-towers-and-domes": {
    passages: t(
      "*Compression* pushes and squeezes; *tension* pulls and stretches. Keep each structure with its place: the *Pantheon* in Rome, the *Zhaozhou Bridge* in Hebei, the *Golden Gate Bridge* in San Francisco.",
      "*compression* 是推和挤；*tension* 是拉和伸。每个建筑要和地点对上：*Pantheon* 在罗马，*Zhaozhou Bridge* 在河北，*Golden Gate Bridge* 在旧金山。",
    ),
    sentences: t(
      "*Brunelleschi* is *broo-nuh-LES-kee*. *Oculus* is *OK-yoo-lus*. *Anchorages* is *ANG-ker-ij-iz*. *Zhaozhou* is *JOW-joe*.",
      "*Brunelleschi* 读作 *broo-nuh-LES-kee*。*oculus* 读作 *OK-yoo-lus*。*anchorages* 读作 *ANG-ker-ij-iz*。*Zhaozhou* 读作 *JOW-joe*。",
    ),
    stretches: t(
      "*The weight of the road and the traffic pulls on the hangers, the hangers pull on the main cables, and the cables carry the force to the towers and the anchorages.* A chain of pulls: each part ends one link and starts the next, so stress *hangers*, *cables*, *anchorages* as the force moves along.",
      "*The weight of the road and the traffic pulls on the hangers, the hangers pull on the main cables, and the cables carry the force to the towers and the anchorages.* 这是一串拉力：每一环结束又开始下一环，力传到哪里就重读哪里：*hangers*、*cables*、*anchorages*。",
    ),
  },
  "grade-5-letters-and-diaries-from-the-past": {
    passages: t(
      "Every letter has its date and place: canal *1835*, gold fields *1850*, lighthouse *1871*, New York and Naples *1907*, school *1910*, telegram *1925*, flood *1927*, Yunnan *1936*. Elena's ship took *twelve days*; her letter took *six weeks*.",
      "每封信都有日期和地点：运河 *1835*，金矿 *1850*，灯塔 *1871*，纽约和那不勒斯 *1907*，学校 *1910*，电报 *1925*，洪水 *1927*，云南 *1936*。埃琳娜的船走了*十二天*，她的信走了*六周*。",
    ),
    sentences: t(
      "*Schooner* is *SKOO-ner*. *Levee* is *LEV-ee*. *Sacramento* is *sak-ra-MEN-toe*. *Necessary* has one *c* and two *s*'s: *NES-e-ser-ee*.",
      "*schooner* 读作 *SKOO-ner*。*levee* 读作 *LEV-ee*。*Sacramento* 读作 *sak-ra-MEN-toe*。*necessary* 一个 *c* 两个 *s*：*NES-e-ser-ee*。",
    ),
    stretches: t(
      "*ARRIVED SAFE STOP FOUND WORK AT RAILWAY STOP LETTER FOLLOWS STOP LOVE JOSEPH* Say *STOP* as a word and pause after it, as if it were a full stop.",
      "*ARRIVED SAFE STOP FOUND WORK AT RAILWAY STOP LETTER FOLLOWS STOP LOVE JOSEPH* 把 *STOP* 当作一个词读出来，读完就停顿，像句号一样。",
    ),
  },
  "grade-5-matter-and-its-changes": {
    passages: t(
      "A *physical change* keeps the substance (melting, freezing); a *chemical change* makes a new one (rust, toast). The class's numbers: *182* grams sealed, *178* grams open.",
      "*physical change* 物质不变（熔化、冻结）；*chemical change* 产生新物质（铁锈、烤面包）。班上的数字：密封 *182* 克，敞口 *178* 克。",
    ),
    sentences: t(
      "*Democritus* is *de-MOK-ri-tus*. *Soluble* is *SOL-yoo-bul*. *Conservation* is *kon-ser-VAY-shun*.",
      "*Democritus* 读作 *de-MOK-ri-tus*。*soluble* 读作 *SOL-yoo-bul*。*conservation* 读作 *kon-ser-VAY-shun*。",
    ),
    stretches: t(
      "*In a solid, they are packed tightly and only shake in place. In a liquid, they slide past one another. In a gas, they zoom around freely and spread out to fill any container.* Three sentences, one pattern: stress *solid*, *liquid* and *gas* the same way each time.",
      "*In a solid, they are packed tightly and only shake in place. In a liquid, they slide past one another. In a gas, they zoom around freely and spread out to fill any container.* 三句同一个句式：每次都用同样的方式重读 *solid*、*liquid* 和 *gas*。",
    ),
  },
  "grade-5-mysteries-and-detectives": {
    passages: t(
      "Each mystery starts with a wrong first guess (*broke in*, *burglar*, *vandals*) and ends with a small true clue. Listen for the clue, not the loud guess, and keep each detective with the story: *Priya*, *Tess*, *Leo*, *Hana*.",
      "每个谜案都先有一个错误的猜测（*broke in*、*burglar*、*vandals*），最后靠一条小而真实的线索破案。听线索，别被响亮的猜测带走；每个侦探要和故事对上：*Priya*、*Tess*、*Leo*、*Hana*。",
    ),
    sentences: t(
      "*Custodian* is *kus-TOH-dee-un*. *Radiator* is *RAY-dee-ay-ter*. *Raccoon* stresses the end: *ra-KOON*. *Brittle* has a short *i*.",
      "*custodian* 读作 *kus-TOH-dee-un*。*radiator* 读作 *RAY-dee-ay-ter*。*raccoon* 重音在后：*ra-KOON*。*brittle* 里是短 *i*。",
    ),
    stretches: t(
      '*"Your burglar," said Tess, "is a raccoon. A very well-fed one."* The quotation is split by *said Tess*: drop your voice for it, then finish Tess\'s line with a smile.',
      '*"Your burglar," said Tess, "is a raccoon. A very well-fed one."* 引语被 *said Tess* 隔开：这部分声音放低，再带着笑意读完苔丝的话。',
    ),
  },
  "grade-5-stories-of-survival": {
    passages: t(
      "Each story turns on one safe choice: *stop* (Owen), *go up, not out* (Lena), stay by the *boat* or the *vehicle*, move *sideways* out of a current (Mei). Listen for the advice someone remembers.",
      "每个故事都靠一个安全的选择：*stop*（欧文），*go up, not out*（莉娜），守在 *boat* 或 *vehicle* 旁，横向游出水流 *sideways*（小美）。注意听人物想起的那条建议。",
    ),
    sentences: t(
      "*Parallel* is *PAR-a-lel*. *Rationed* is *RASH-und*. *Whiteout* stresses the first part: *WHITE-out*.",
      "*parallel* 读作 *PAR-a-lel*。*rationed* 读作 *RASH-und*。*whiteout* 重音在前：*WHITE-out*。",
    ),
    stretches: t(
      "*If a current pulls you out, don't fight it head-on. Move sideways, parallel to the shore, until you are out of it.* Read it like advice: firm on *don't fight it*, then slow and steady on *Move sideways*.",
      "*If a current pulls you out, don't fight it head-on. Move sideways, parallel to the shore, until you are out of it.* 当作建议来读：*don't fight it* 要坚定，*Move sideways* 要慢而稳。",
    ),
  },
  "grade-5-the-maya-aztec-and-inca": {
    passages: t(
      "Three peoples, three places: the *Maya* in the rainforest, the *Aztec* on a lake island, the *Inca* along the Andes. Numbers close together: calendars of *365* and *260* days repeat every *52* years; the Inca road is *40,000* km, the empire *4,000* km.",
      "三个民族三个地方：*Maya* 在雨林，*Aztec* 在湖中岛，*Inca* 沿安第斯山。数字挨得近：*365* 天和 *260* 天的历法每 *52* 年重合；印加道路 *40,000* 公里，帝国 *4,000* 公里。",
    ),
    sentences: t(
      "*Tenochtitlan* is *te-noch-TEET-lan*. *Chinampa* is *chee-NAM-pa*. *Khipu* is *KEE-poo*. *Machu Picchu* is *MAH-choo PEEK-choo*.",
      "*Tenochtitlan* 读作 *te-noch-TEET-lan*。*chinampa* 读作 *chee-NAM-pa*。*khipu* 读作 *KEE-poo*。*Machu Picchu* 读作 *MAH-choo PEEK-choo*。",
    ),
    stretches: t(
      "*Knots near the bottom of a string stood for ones, the next group up stood for tens, then hundreds, and so on, very like the way we write numbers today.* Step up on *ones*, *tens*, *hundreds*, then drop your voice for the comparison at the end.",
      "*Knots near the bottom of a string stood for ones, the next group up stood for tens, then hundreds, and so on, very like the way we write numbers today.* *ones*、*tens*、*hundreds* 逐级升高，结尾的比较放低声音。",
    ),
  },
  "grade-5-the-solar-system": {
    passages: t(
      "*Axis* is the line the earth spins around; *orbit* is the path around the sun. The earth turns once in *twenty-four hours*; the moon goes around in about *one month*. The sun holds over a *million* Earths, Jupiter over a *thousand*.",
      "*axis* 是地球自转所绕的线；*orbit* 是绕太阳的路径。地球*二十四小时*自转一圈；月亮大约*一个月*绕一圈。太阳能装下一百多*万*个地球，木星一千多个。",
    ),
    sentences: t(
      "*Uranus* is *YOOR-a-nus*. *Asteroid* is *AS-ter-oyd*. *Crescent* is *KRES-ent*. *Constellation* has four beats: *kon-stel-LAY-shun*.",
      "*Uranus* 读作 *YOOR-a-nus*。*asteroid* 读作 *AS-ter-oyd*。*crescent* 读作 *KRES-ent*。*constellation* 有四拍：*kon-stel-LAY-shun*。",
    ),
    stretches: t(
      "*Night after night, the bright part grows, until we see the whole round face. This is a full moon.* Let your voice grow with *grows*, then land firmly on *full moon*.",
      "*Night after night, the bright part grows, until we see the whole round face. This is a full moon.* 读 *grows* 时声音渐强，最后稳稳落在 *full moon* 上。",
    ),
  },
  "grade-5-the-world-under-a-microscope": {
    passages: t(
      "Three pond creatures move three ways: the *algae* ball rolls, the *paramecium* rows with tiny hairs, the *amoeba* oozes. A bacterium divides in about *twenty minutes*.",
      "池塘里三种生物三种动法：*algae* 球滚动，*paramecium* 用细毛划水，*amoeba* 慢慢蠕动。细菌大约*二十分钟*分裂一次。",
    ),
    sentences: t(
      "*Leeuwenhoek* is *LAY-ven-hook*. *Paramecium* is *par-a-MEE-see-um*. *Amoeba* is *a-MEE-ba*. *Nucleus* is *NOO-klee-us*.",
      "*Leeuwenhoek* 读作 *LAY-ven-hook*。*paramecium* 读作 *par-a-MEE-see-um*。*amoeba* 读作 *a-MEE-ba*。*nucleus* 读作 *NOO-klee-us*。",
    ),
    stretches: t(
      "*One bacterium can divide into two in about twenty minutes, so a few can become millions in a single day.* Pause lightly at the comma, then let *millions* stand out.",
      "*One bacterium can divide into two in about twenty minutes, so a few can become millions in a single day.* 逗号处稍停，然后突出 *millions*。",
    ),
  },
  "grade-5-water-on-earth": {
    passages: t(
      "*Evaporation* (liquid to gas) and *condensation* (gas to liquid) sound alike but are opposites. Keep the numbers apart too: more than *ninety-seven* cups of a hundred are ocean, only about *three* are fresh.",
      "*evaporation*（液体变气体）和 *condensation*（气体变液体）听起来很像，意思却相反。数字也要分清：一百杯里*九十七*杯以上是海水，淡水只有大约*三*杯。",
    ),
    sentences: t(
      "*Glacier* is *GLAY-sher*. *Tributary* is *TRIB-yoo-ter-ee*. *Vapor* is *VAY-per*.",
      "*glacier* 读作 *GLAY-sher*。*tributary* 读作 *TRIB-yoo-ter-ee*。*vapor* 读作 *VAY-per*。",
    ),
    stretches: t(
      "*This never-ending trip of water from the sea to the sky to the land and back to the sea is called the water cycle.* The subject is long: read *from the sea to the sky to the land* as one rising line, then pause before *is called*.",
      "*This never-ending trip of water from the sea to the sky to the land and back to the sea is called the water cycle.* 主语很长：把 *from the sea to the sky to the land* 一口气读上去，在 *is called* 前停一下。",
    ),
  },
  "grade-6-ancient-rome": {
    passages: t(
      "The twins *Romulus* and *Remus* start alike: listen for the end. Keep the dates apart: the city in *753 BCE*, the king driven out *around 509 BCE*. *Patricians* were wealthy families, *plebeians* ordinary citizens.",
      "双胞胎 *Romulus* 和 *Remus* 开头相同，要听词尾。日期别混：建城是 *753 BCE*，赶走国王是 *around 509 BCE*。*patricians* 是富有家族，*plebeians* 是普通公民。",
    ),
    sentences: t(
      "*Tiber* is *TY-ber*. *Patricians* is *pa-TRISH-unz*. *Plebeians* is *pli-BEE-unz*. *Tarquin* is *TAR-kwin*.",
      "*Tiber* 读作 *TY-ber*。*patricians* 读作 *pa-TRISH-unz*。*plebeians* 读作 *pli-BEE-unz*。*Tarquin* 读作 *TAR-kwin*。",
    ),
    stretches: t(
      "*Slowly, they won the right to hold office, to have their own leaders and to see the laws written down so that everyone could know them.* Three rights follow one another: start each with *to* on a fresh, slightly higher note.",
      "*Slowly, they won the right to hold office, to have their own leaders and to see the laws written down so that everyone could know them.* 三项权利依次出现：每个 *to* 都重新起调，稍微提高一点。",
    ),
  },
  "grade-6-food-for-everyone": {
    passages: t(
      "*Calories* measure energy; *carbohydrates* are a nutrient. Both are long words starting with *c*, so listen to the whole word. An active twelve-year-old needs roughly *two thousand* calories a day.",
      "*calories* 是能量单位；*carbohydrates* 是一种营养素。两个词都很长、都以 *c* 开头，要听完整个词。活跃的十二岁孩子每天大约需要 *two thousand* 卡路里。",
    ),
    sentences: t(
      "*Nutrients* is *NOO-tree-ents*. *Carbohydrates* is *kar-bo-HY-drates*. *Borlaug* is *BOR-log*. *Pesticides* is *PES-ti-sides*.",
      "*nutrients* 读作 *NOO-tree-ents*。*carbohydrates* 读作 *kar-bo-HY-drates*。*Borlaug* 读作 *BOR-log*。*pesticides* 读作 *PES-ti-sides*。",
    ),
    stretches: t(
      "*Where farmers could get these things, harvests doubled or even tripled.* Hold the first part up until the comma, then climb from *doubled* to *tripled*.",
      "*Where farmers could get these things, harvests doubled or even tripled.* 前半句读到逗号时语调不落，然后从 *doubled* 升到 *tripled*。",
    ),
  },
  "grade-6-living-cells": {
    passages: t(
      "Two scientists with similar names: *Schleiden* studied plants and *Schwann* studied animals. *Membrane* and *mitochondria* both begin with *m*: the membrane is the guard, the mitochondria the power stations. Your body has about *thirty trillion* cells.",
      "两位科学家名字相近：*Schleiden* 研究植物，*Schwann* 研究动物。*membrane* 和 *mitochondria* 都以 *m* 开头：膜是守卫，线粒体是发电站。人体大约有 *thirty trillion* 个细胞。",
    ),
    sentences: t(
      "*Cytoplasm* is *SY-to-plaz-um*. *Mitochondria* is *my-to-KON-dree-a*. *Ribosomes* is *RY-bo-sohmz*. *Virchow* is *FEER-koh*.",
      "*cytoplasm* 读作 *SY-to-plaz-um*。*mitochondria* 读作 *my-to-KON-dree-a*。*ribosomes* 读作 *RY-bo-sohmz*。*Virchow* 读作 *FEER-koh*。",
    ),
    stretches: t(
      "*All living things are made of one or more cells. The cell is the smallest unit that can carry out the processes of life. And all cells come from other cells.* These are the three parts of the theory: pause fully between them, and stress *all*, *smallest* and *other*.",
      "*All living things are made of one or more cells. The cell is the smallest unit that can carry out the processes of life. And all cells come from other cells.* 这是学说的三部分：每句之间停足，重读 *all*、*smallest* 和 *other*。",
    ),
  },
  "grade-6-memories-and-growing-up": {
    passages: t(
      "Keep the ages straight: the swimmer slipped off the dock at *six* and learned to swim at *eleven*. In the kitchen story the smell of ginger brings back being *nine*, and the grandmother died when the writer was *fourteen*.",
      "年龄要分清：游泳的孩子 *six* 岁从码头滑落，*eleven* 岁才学会游泳。厨房的故事里，姜的香味让作者回到 *nine* 岁，奶奶在作者 *fourteen* 岁时去世。",
    ),
    sentences: t(
      "*Terrified* is *TER-i-fyed*. *Reluctant* is *ri-LUK-tant*. *Clumsy* is *KLUM-zee*. *Ginger* is *JIN-jer*.",
      "*terrified* 读作 *TER-i-fyed*。*reluctant* 读作 *ri-LUK-tant*。*clumsy* 读作 *KLUM-zee*。*ginger* 读作 *JIN-jer*。",
    ),
    stretches: t(
      "*It was about learning that fear is something you can walk into, one small step at a time, and come out the other side.* Slow down on *one small step at a time*, as if taking the steps, then finish the sentence calmly.",
      "*It was about learning that fear is something you can walk into, one small step at a time, and come out the other side.* 读 *one small step at a time* 时放慢，像一步步走，然后平静地读完。",
    ),
  },
  "grade-6-myths-and-legends": {
    passages: t(
      "*Eighteen thousand years* comes twice: Pangu slept that long, then held up the sky that long. His *left eye* became the sun and his *right eye* the moon. Fire was carried in a hollow stalk of *fennel*.",
      "*eighteen thousand years* 出现两次：盘古睡了这么久，又撑天这么久。他的 *left eye* 变成太阳，*right eye* 变成月亮。火是装在空心的 *fennel* 茎里带下来的。",
    ),
    sentences: t(
      "*Prometheus* is *pro-MEE-thee-us*. *Heracles* is *HER-a-kleez*. *Olympus* is *o-LIM-pus*. *Chaos* is *KAY-os*.",
      "*Prometheus* 读作 *pro-MEE-thee-us*。*Heracles* 读作 *HER-a-kleez*。*Olympus* 读作 *o-LIM-pus*。*chaos* 读作 *KAY-os*。",
    ),
    stretches: t(
      "*His left eye became the sun and his right eye the moon.* The second half drops *became*: stress *left* and *right*, *sun* and *moon*, so the pairs stand out.",
      "*His left eye became the sun and his right eye the moon.* 后半句省掉了 *became*：重读 *left* 和 *right*、*sun* 和 *moon*，让两组对应清楚。",
    ),
  },
  "grade-6-poetry-and-song": {
    passages: t(
      "The poem is full of sound words: the stairs are *creaking*, the fridge *hums*, the curtains *whisper*, the tap *drips*. Sam's line about blowing the town *to the moon* is exaggeration, not something that happens.",
      "这首诗满是声音词：楼梯 *creaking*，冰箱 *hums*，窗帘 *whisper*，水龙头 *drips*。萨姆说风把小镇吹 *to the moon*，是夸张，并不是真的发生。",
    ),
    sentences: t(
      "*Okafor* is *oh-KAH-for*. *Laundry* is *LAWN-dree*. *Umbrella* is *um-BREL-a*. *Shivers* is *SHIV-erz*.",
      "*Okafor* 读作 *oh-KAH-for*。*laundry* 读作 *LAWN-dree*。*umbrella* 读作 *um-BREL-a*。*shivers* 读作 *SHIV-erz*。",
    ),
    stretches: t(
      "*It pulls the dark over its shoulders like a blanket* Read this line slowly and softly, as the house is falling asleep, and do not stop at the line break before the next line.",
      "*It pulls the dark over its shoulders like a blanket* 这一行慢慢、轻轻地读，因为房子正要入睡；行尾不要停，直接接下一行。",
    ),
  },
  "grade-6-sport-and-fair-play": {
    passages: t(
      "Many dates come close together: the first modern Olympics in *1896*, the course set in *1908*, the length made official in *1921*. The marathon is *42.195* kilometers. Only the *chest* counts at the finish.",
      "许多年份挨在一起：首届现代奥运会 *1896*，赛道定于 *1908*，长度在 *1921* 成为正式标准。马拉松是 *42.195* 公里。冲线只算 *chest*。",
    ),
    sentences: t(
      "*Pheidippides* is *fy-DIP-i-deez*. *Spyridon* is *SPEER-i-don*. *Deliberate* is *di-LIB-er-it*. *Disqualified* is *dis-KWOL-i-fyed*.",
      "*Pheidippides* 读作 *fy-DIP-i-deez*。*Spyridon* 读作 *SPEER-i-don*。*deliberate* 读作 *di-LIB-er-it*。*disqualified* 读作 *dis-KWOL-i-fyed*。",
    ),
    stretches: t(
      "*The race ends when a runner's chest, not head, arm or foot, crosses the finish line.* Drop your voice a little for the aside *not head, arm or foot*, then come back up for *crosses the finish line*.",
      "*The race ends when a runner's chest, not head, arm or foot, crosses the finish line.* 插入语 *not head, arm or foot* 声音稍降，再提起来读 *crosses the finish line*。",
    ),
  },
  "grade-6-the-first-cities": {
    passages: t(
      "The two rivers are the *Tigris* and the *Euphrates*. The first writing was *pictographs*; the later wedge marks are *cuneiform*. Hammurabi carved *282* laws, and the first true cities came *about 3500 BCE*.",
      "两条河是 *Tigris* 和 *Euphrates*。最早的文字是 *pictographs*，后来的楔形记号叫 *cuneiform*。汉谟拉比刻了 *282* 条法律，最早的城市出现在 *about 3500 BCE*。",
    ),
    sentences: t(
      "*Euphrates* is *yoo-FRAY-teez*. *Ziggurat* is *ZIG-oo-rat*. *Cuneiform* is *kyoo-NEE-i-form*. *Hammurabi* is *ham-oo-RAH-bee*.",
      "*Euphrates* 读作 *yoo-FRAY-teez*。*ziggurat* 读作 *ZIG-oo-rat*。*cuneiform* 读作 *kyoo-NEE-i-form*。*Hammurabi* 读作 *ham-oo-RAH-bee*。",
    ),
    stretches: t(
      "*The same water that built the cities slowly wore away the land that fed them.* The subject runs up to *cities*: keep it in one breath, pause lightly, then let *slowly wore away* sound slow.",
      "*The same water that built the cities slowly wore away the land that fed them.* 主语一直到 *cities*：一口气读完，轻停，再把 *slowly wore away* 读得慢一些。",
    ),
  },
  "grade-6-the-restless-earth": {
    passages: t(
      "*Magma* is underground; once it reaches the air it is *lava*. The *focus* is where the slip begins, the *epicenter* is above it. *Primary* waves come first; each step on the scale means about *thirty-two times* more energy.",
      "*magma* 在地下，到了地面就叫 *lava*。*focus* 是滑动开始的地方，*epicenter* 在它正上方。*primary* 波最先到；震级每升一级，能量大约多 *thirty-two times*。",
    ),
    sentences: t(
      "*Pangaea* is *pan-JEE-a*. *Mesosaurus* is *mez-o-SOR-us*. *Parícutin* is *pa-REE-koo-teen*. *Seismic* is *SYZE-mik*.",
      "*Pangaea* 读作 *pan-JEE-a*。*Mesosaurus* 读作 *mez-o-SOR-us*。*Parícutin* 读作 *pa-REE-koo-teen*。*seismic* 读作 *SYZE-mik*。",
    ),
    stretches: t(
      "*Each step up the scale means the ground shook about ten times more, and the earthquake released about thirty-two times more energy.* Two matching halves: stress *ten* in the first and *thirty-two* in the second.",
      "*Each step up the scale means the ground shook about ten times more, and the earthquake released about thirty-two times more energy.* 前后两半结构相同：前半重读 *ten*，后半重读 *thirty-two*。",
    ),
  },
  "grade-7-empires-of-west-africa": {
    passages: t(
      "Many dates sound alike: al-Bakri wrote in *1068*, Sundiata founded Mali *around 1235*, Mansa Musa set out in *1324*, the map was finished in *1375*. *Ghana* the old empire is not the modern country.",
      "许多年份听起来相近：巴克里写于 *1068*，松迪亚塔约在 *around 1235* 建立马里，曼萨·穆萨 *1324* 出发，地图在 *1375* 完成。古代帝国 *Ghana* 不是现代国家。",
    ),
    sentences: t(
      "*Sundiata* is *soon-JAH-ta*. *Timbuktu* is *tim-buk-TOO*. *Taghaza* is *ta-GAH-za*. *Songhai* is *SONG-hy*.",
      "*Sundiata* 读作 *soon-JAH-ta*。*Timbuktu* 读作 *tim-buk-TOO*。*Taghaza* 读作 *ta-GAH-za*。*Songhai* 读作 *SONG-hy*。",
    ),
    stretches: t(
      "*His pilgrimage turned gold into something that lasted longer: knowledge.* Hold your voice up before the colon, pause, then say *knowledge* clearly on its own.",
      "*His pilgrimage turned gold into something that lasted longer: knowledge.* 冒号前语调不落，停一下，再单独清楚地读出 *knowledge*。",
    ),
  },
  "grade-7-fighting-disease": {
    passages: t(
      "*Miasma* (bad air) and the *germ theory* are opposite answers. Keep the death rates apart: about *one mother in ten* in the First Clinic, closer to *one in twenty-five* in the Second. The pump handle came off on *September 8*.",
      "*miasma*（坏空气）和 *germ theory* 是相反的解释。死亡率别混：第一诊室约 *one mother in ten*，第二诊室接近 *one in twenty-five*。水泵把手在 *September 8* 被拆下。",
    ),
    sentences: t(
      "*Semmelweis* is *ZEM-el-vice*. *Cholera* is *KOL-er-a*. *Pneumonia* is *noo-MOH-nee-a*. *Placebo* is *pla-SEE-boh*.",
      "*Semmelweis* 读作 *ZEM-el-vice*。*cholera* 读作 *KOL-er-a*。*pneumonia* 读作 *noo-MOH-nee-a*。*placebo* 读作 *pla-SEE-boh*。",
    ),
    stretches: t(
      "*A theory can seem to match the evidence and even lead to useful actions, and still be wrong about the cause.* Build up through the first two parts, pause at the comma, then slow down on *still be wrong*.",
      "*A theory can seem to match the evidence and even lead to useful actions, and still be wrong about the cause.* 前两部分逐渐推进，逗号处停顿，然后放慢读 *still be wrong*。",
    ),
  },
  "grade-7-flight": {
    passages: t(
      "The four forces come in pairs: *lift* against *weight*, *thrust* against *drag*. Runway *9* and runway *27* are the same strip seen from opposite ends. The first powered flight lasted *twelve seconds*; the longest that day, *fifty-nine*.",
      "四种力成对出现：*lift* 对 *weight*，*thrust* 对 *drag*。*9* 号和 *27* 号跑道是同一条跑道的两端。第一次动力飞行持续 *twelve seconds*，当天最长的是 *fifty-nine* 秒。",
    ),
    sentences: t(
      "*Montgolfier* is *mont-GOL-fee-er*. *Airfoil* is *AIR-foyl*. *Versailles* is *ver-SY*. *Bessie Coleman* is *BES-ee KOHL-man*.",
      "*Montgolfier* 读作 *mont-GOL-fee-er*。*airfoil* 读作 *AIR-foyl*。*Versailles* 读作 *ver-SY*。*Bessie Coleman* 读作 *BES-ee KOHL-man*。",
    ),
    stretches: t(
      "*Lift equals weight, so the plane neither climbs nor sinks, and thrust equals drag, so its speed stays the same.* Two matching halves: stress the force names, and pause lightly before each *so*.",
      "*Lift equals weight, so the plane neither climbs nor sinks, and thrust equals drag, so its speed stays the same.* 前后两半结构相同：重读各个力的名称，每个 *so* 前轻轻停顿。",
    ),
  },
  "grade-7-imagined-futures": {
    passages: t(
      "*Utopia* is an ideal society and *dystopia* its frightening opposite; the words differ only at the start. *Robot* comes from the Czech *robota*. The ship left *a hundred and forty years ago* and has *another ninety* to go.",
      "*utopia* 是理想社会，*dystopia* 是可怕的反面，两词只在开头不同。*robot* 来自捷克语 *robota*。飞船 *a hundred and forty years ago* 出发，还要再飞 *another ninety* 年。",
    ),
    sentences: t(
      "*Čapek* is *CHAH-pek*. *Halcyon* is *HAL-see-on*. *Dystopia* is *dis-TOH-pee-a*. *Equator* is *i-KWAY-ter*.",
      "*Čapek* 读作 *CHAH-pek*。*Halcyon* 读作 *HAL-see-on*。*dystopia* 读作 *dis-TOH-pee-a*。*equator* 读作 *i-KWAY-ter*。",
    ),
    stretches: t(
      '*The Test decides where you start," she said. "It doesn\'t decide who you are.* Two short lines that mirror each other: stress *where you start* and *who you are*, with the quiet tag in between.',
      '*The Test decides where you start," she said. "It doesn\'t decide who you are.* 两句互相呼应：重读 *where you start* 和 *who you are*，中间的 she said 轻读。',
    ),
  },
  "grade-7-making-the-case": {
    passages: t(
      "Listen for the job of each sentence: the *claim*, the reasons and the answer to the other side. Numbers are evidence: *eighty-four* degrees on Elm Street, *ninety-three* on Market Street; *one hundred and twelve* interruptions dropped to *nine*.",
      "听清每句话的作用：*claim*、理由，以及对对方的回应。数字就是证据：Elm Street *eighty-four* 度，Market Street *ninety-three* 度；打扰次数从 *one hundred and twelve* 降到 *nine*。",
    ),
    sentences: t(
      "*Counterclaim* is *KOWN-ter-klaym*. *Artificial* is *ar-ti-FISH-al*. *Drainage* is *DRAY-nij*. *Haddad* is *ha-DAD*.",
      "*counterclaim* 读作 *KOWN-ter-klaym*。*artificial* 读作 *ar-ti-FISH-al*。*drainage* 读作 *DRAY-nij*。*Haddad* 读作 *ha-DAD*。",
    ),
    stretches: t(
      "*So the case for the parking lot rests on one fact that misses the point and one need that does not exist.* Balance the two halves: stress *one fact* and *one need*, then let *does not exist* fall firmly.",
      "*So the case for the parking lot rests on one fact that misses the point and one need that does not exist.* 两半保持平衡：重读 *one fact* 和 *one need*，最后把 *does not exist* 稳稳落下。",
    ),
  },
  "grade-7-money-and-business": {
    passages: t(
      "*Revenue* is all the money taken in; *profit* is what is left after costs. Theo's revenue was *three hundred and twenty dollars*, his profit *two hundred and forty-five*. The bank lends at *six percent* and pays savers *two percent*.",
      "*revenue* 是收入总额，*profit* 是扣除成本后剩下的钱。西奥的收入是 *three hundred and twenty dollars*，利润是 *two hundred and forty-five*。银行以 *six percent* 放贷，给储户 *two percent*。",
    ),
    sentences: t(
      "*Barter* is *BAR-ter*. *Coincidence* is *koh-IN-si-dens*. *Lydia* is *LID-ee-a*. *Hyperinflation* is *hy-per-in-FLAY-shun*.",
      "*barter* 读作 *BAR-ter*。*coincidence* 读作 *koh-IN-si-dens*。*Lydia* 读作 *LID-ee-a*。*hyperinflation* 读作 *hy-per-in-FLAY-shun*。",
    ),
    stretches: t(
      "*From lumps of silver to numbers on a screen, money has become lighter and lighter. What has not changed is that it depends on trust.* Let *lighter and lighter* rise, pause after it, then say the last sentence slowly, landing on *trust*.",
      "*From lumps of silver to numbers on a screen, money has become lighter and lighter. What has not changed is that it depends on trust.* *lighter and lighter* 逐渐上扬，之后停顿，再慢慢读最后一句，落在 *trust* 上。",
    ),
  },
  "grade-7-oceans-and-ecosystems": {
    passages: t(
      "*Phytoplankton* make food from sunlight; *zooplankton* are tiny animals. Listen to the first part of each word. The zones go *six hundred feet*, then *three thousand feet*, and trenches plunge *more than six miles*.",
      "*phytoplankton* 用阳光制造食物，*zooplankton* 是微小的动物，要听清每个词的前半部分。各层深度依次是 *six hundred feet*、*three thousand feet*，海沟深达 *more than six miles*。",
    ),
    sentences: t(
      "*Bioluminescence* is *by-oh-loo-mi-NES-ens*. *Phytoplankton* is *FY-toh-plank-ton*. *Symbiosis* is *sim-by-OH-sis*. *Copepods* is *KOH-pe-podz*.",
      "*bioluminescence* 读作 *by-oh-loo-mi-NES-ens*。*phytoplankton* 读作 *FY-toh-plank-ton*。*symbiosis* 读作 *sim-by-OH-sis*。*copepods* 读作 *KOH-pe-podz*。",
    ),
    stretches: t(
      "*Zooplankton graze on phytoplankton, small fish eat zooplankton, and larger animals eat the small fish.* A chain of three steps: keep the voice rising at each comma, and fall only at the end.",
      "*Zooplankton graze on phytoplankton, small fish eat zooplankton, and larger animals eat the small fish.* 三个环节连成一串：每个逗号处语调上扬，到句末才落下。",
    ),
  },
  "grade-7-rights-and-reform": {
    passages: t(
      "Numbers to keep apart: the Declaration was adopted on *December 10, 1948*; the petition had about *twenty-four thousand* signatures; the boycott lasted *381 days*. *Gettysburg* and *Dandi* are places, not people.",
      "这些数字别混：宣言在 *December 10, 1948* 通过；请愿书约有 *twenty-four thousand* 个签名；抵制持续了 *381 days*。*Gettysburg* 和 *Dandi* 是地名，不是人名。",
    ),
    sentences: t(
      "*Apartheid* is *a-PAR-tide*. *Pretoria* is *pri-TOR-ee-a*. *Sabotage* is *SAB-o-tahzh*. *Ahmedabad* is *AH-me-da-bad*.",
      "*apartheid* 读作 *a-PAR-tide*。*Pretoria* 读作 *pri-TOR-ee-a*。*sabotage* 读作 *SAB-o-tahzh*。*Ahmedabad* 读作 *AH-me-da-bad*。",
    ),
    stretches: t(
      "*In two minutes, Lincoln turned a ceremony for the dead into a call to the living.* Stress the contrast between *the dead* and *the living*, with a small lift before *into*.",
      "*In two minutes, Lincoln turned a ceremony for the dead into a call to the living.* 重读 *the dead* 和 *the living* 的对比，在 *into* 前稍微提起。",
    ),
  },
  "grade-7-the-renaissance": {
    passages: t(
      "*Geocentric* puts the Earth at the center; *heliocentric* puts the sun there. Only the first part differs. Copernicus published in *1543*; Galileo was tried in *1633*. The ceiling took *four years*, from *1508* to *1512*.",
      "*geocentric* 以地球为中心，*heliocentric* 以太阳为中心，只有前半部分不同。哥白尼在 *1543* 出版著作，伽利略在 *1633* 受审。天顶画用了 *four years*，从 *1508* 到 *1512*。",
    ),
    sentences: t(
      "*Medici* is *MED-i-chee*. *Brunelleschi* is *broo-ne-LES-kee*. *Verrocchio* is *ve-ROH-kee-oh*. *Copernicus* is *koh-PER-ni-kus*.",
      "*Medici* 读作 *MED-i-chee*。*Brunelleschi* 读作 *broo-ne-LES-kee*。*Verrocchio* 读作 *ve-ROH-kee-oh*。*Copernicus* 读作 *koh-PER-ni-kus*。",
    ),
    stretches: t(
      "*It grew from the meeting of ruins, riches, rivalry and refugees in one crowded corner of Europe.* Four words start with *r*: give each the same weight, then slow down for *one crowded corner of Europe*.",
      "*It grew from the meeting of ruins, riches, rivalry and refugees in one crowded corner of Europe.* 四个词都以 *r* 开头：每个读得一样重，然后放慢读 *one crowded corner of Europe*。",
    ),
  },
  "grade-8-explorers-and-voyages": {
    passages: t(
      "Keep the dates with their voyages: Zheng He sailed *between 1405 and 1433*, Ibn Battuta left *in 1325*, Columbus *in August 1492*, Magellan's fleet *in September 1519*, Amundsen reached the Pole on *December 14, 1911*. *Eighteen* men came home on the Victoria; not eighty.",
      "年份要和航行对上：郑和 *between 1405 and 1433*，伊本·白图泰 *in 1325* 出发，哥伦布 *in August 1492*，麦哲伦船队 *in September 1519*，阿蒙森 *December 14, 1911* 到达极点。维多利亚号回来的是 *eighteen* 人，不是 eighty。",
    ),
    sentences: t(
      "*Zheng He* is *JUNG-HUH*. *Hokulea* is *ho-koo-LAY-ah*. *Piailug* is *pee-EYE-loog*. *Mactan* is *mahk-TAHN*. *Mariana* is *mar-ee-AH-na*.",
      "*Zheng He* 读作 *JUNG-HUH*。*Hokulea* 读作 *ho-koo-LAY-ah*。*Piailug* 读作 *pee-EYE-loog*。*Mactan* 读作 *mahk-TAHN*。*Mariana* 读作 *mar-ee-AH-na*。",
    ),
    stretches: t(
      '*"That\'s one small step for man, one giant leap for mankind," he said.* Say the quotation slowly, with *small step* and *giant leap* balanced, then drop to a quick, low *he said*.',
      '*"That\'s one small step for man, one giant leap for mankind," he said.* 引语读慢，*small step* 和 *giant leap* 对称着读，再用轻快的低调读 *he said*。',
    ),
  },
  "grade-8-journeys-to-a-new-home": {
    passages: t(
      "Two islands sound alike: *Ellis Island* in New York, *Angel Island* in San Francisco Bay. Listen for the numbers: about *twelve million* through Ellis Island, about *two percent* sent back, *sixty-two* people in a boat made for *twenty*.",
      "两个岛名相似：纽约的 *Ellis Island*，旧金山湾的 *Angel Island*。注意数字：约 *twelve million* 人经过埃利斯岛，约 *two percent* 被遣返，*sixty-two* 人挤在只能坐 *twenty* 人的船上。",
    ),
    sentences: t(
      "*Sugihara* is *soo-gee-HAH-ra*. *Kaunas* is *KOW-nahs*. *Kindertransport* is *KIN-der-trans-port*. *Remittances* is *ri-MIT-un-siz*.",
      "*Sugihara* 读作 *soo-gee-HAH-ra*。*Kaunas* 读作 *KOW-nahs*。*Kindertransport* 读作 *KIN-der-trans-port*。*Remittances* 读作 *ri-MIT-un-siz*。",
    ),
    stretches: t(
      "*I dream in three languages. That's not a problem. That's a gift.* Three short sentences: pause after each, and let the last one, *a gift*, land warmly.",
      "*I dream in three languages. That's not a problem. That's a gift.* 三个短句，每句后停一下，最后的 *a gift* 读得温暖有力。",
    ),
  },
  "grade-8-machines-that-changed-the-world": {
    passages: t(
      "Dates are close together: Bi Sheng *around the year 1040*, Gutenberg *around 1450*, Morse's message *in 1844*, Bell's call on *March 10, 1876*, Kitty Hawk on *December 17, 1903*, the transistor *in 1947*. *Swan* and *Edison* both made bulbs; listen for which one is meant.",
      "年份很密：毕昇 *around the year 1040*，古腾堡 *around 1450*，莫尔斯 *in 1844* 发报，贝尔 *March 10, 1876* 通话，基蒂霍克 *December 17, 1903*，晶体管 *in 1947*。*Swan* 和 *Edison* 都造过灯泡，听清说的是谁。",
    ),
    sentences: t(
      "*Gutenberg* is *GOO-ten-berg*. *Diaphragm* is *DY-uh-fram*. *Filament* is *FIL-uh-ment*. *Transistor* is *tran-ZIS-ter*. *ENIAC* is *EE-nee-ak*.",
      "*Gutenberg* 读作 *GOO-ten-berg*。*Diaphragm* 读作 *DY-uh-fram*。*Filament* 读作 *FIL-uh-ment*。*Transistor* 读作 *tran-ZIS-ter*。*ENIAC* 读作 *EE-nee-ak*。",
    ),
    stretches: t(
      '*Bell\'s notebook records the first words: "Mr. Watson, come here, I want to see you."* Pause at the colon, then say the quoted words in a plain, urgent voice, as Bell might have spoken them.',
      '*Bell\'s notebook records the first words: "Mr. Watson, come here, I want to see you."* 冒号处停顿，引语用平实而急切的语气读，像贝尔当时说话一样。',
    ),
  },
  "grade-8-smoke-and-steam": {
    passages: t(
      "*Firedamp* explodes; *blackdamp* suffocates. Manchester grew from *seventy-five thousand* to *three hundred thousand*. The Luddites rose in *1811*; *seventeen* were hanged in *1813*. *Chadwick* wrote in *1842*, *Snow* removed the pump handle in *1854*.",
      "*firedamp* 会爆炸，*blackdamp* 使人窒息。曼彻斯特从 *seventy-five thousand* 增长到 *three hundred thousand*。卢德分子 *1811* 年起事，*1813* 年 *seventeen* 人被绞死。*Chadwick* 写于 *1842*，*Snow* 在 *1854* 年拆掉水泵把手。",
    ),
    sentences: t(
      "*Luddites* is *LUD-ites*. *Bazalgette* is *BAZ-ul-jet*. *Engels* is *ENG-ulz*. *Phossy jaw* is *FOSS-ee jaw*. *Colliery* is *KOL-yer-ee*.",
      "*Luddites* 读作 *LUD-ites*。*Bazalgette* 读作 *BAZ-ul-jet*。*Engels* 读作 *ENG-ulz*。*Phossy jaw* 读作 *FOSS-ee jaw*。*Colliery* 读作 *KOL-yer-ee*。",
    ),
    stretches: t(
      "*Its most famous engine, the Rocket, designed by George and Robert Stephenson, reached the astonishing speed of nearly thirty miles an hour.* The two commas around *designed by George and Robert Stephenson* frame an aside: drop your voice for it, then lift again for *reached the astonishing speed*.",
      "*Its most famous engine, the Rocket, designed by George and Robert Stephenson, reached the astonishing speed of nearly thirty miles an hour.* 两个逗号之间的 *designed by George and Robert Stephenson* 是插入语，声音放低，读到 *reached the astonishing speed* 再扬起来。",
    ),
  },
  "grade-8-tales-of-dread": {
    passages: t(
      "Many dates are close: Walpole's novel *in 1764*, Tambora *in April 1815*, Frankenstein *in 1818*, Poe's story *in 1843*. In the lighthouse log, *Pryce* is the assistant who left; the *keeper* writes the log.",
      "年份很近：沃波尔的小说 *in 1764*，坦博拉火山 *in April 1815*，《弗兰肯斯坦》*in 1818*，坡的小说 *in 1843*。灯塔日志里，*Pryce* 是离开的助手，写日志的是 *keeper*。",
    ),
    sentences: t(
      "*Otranto* is *oh-TRAN-toh*. *Polidori* is *pol-ih-DOR-ee*. *Foreboding* is *for-BOH-ding*. *Adrenaline* is *uh-DREN-uh-lin*. *Uncanny* is *un-KAN-ee*.",
      "*Otranto* 读作 *oh-TRAN-toh*。*Polidori* 读作 *pol-ih-DOR-ee*。*Foreboding* 读作 *for-BOH-ding*。*Adrenaline* 读作 *uh-DREN-uh-lin*。*Uncanny* 读作 *un-KAN-ee*。",
    ),
    stretches: t(
      "*Pryce must have come back. But Pryce left on the boat. I watched it go. Did I watch it go?* Speed up a little through the short sentences, then slow on the final question and let your voice rise in doubt.",
      "*Pryce must have come back. But Pryce left on the boat. I watched it go. Did I watch it go?* 短句稍稍加快，最后的问句放慢，语调带着怀疑上扬。",
    ),
  },
  "grade-8-the-age-of-revolutions": {
    passages: t(
      "Two declarations share a name: the American *Declaration of Independence* and the French *Declaration of the Rights of Man*. Listen for *342 chests* of tea, *seven prisoners* in the Bastille, and Haiti's independence on *January 1, 1804*.",
      "两份宣言名字相近：美国的 *Declaration of Independence* 和法国的 *Declaration of the Rights of Man*。注意 *342 chests* 茶叶、巴士底狱的 *seven prisoners*，以及海地 *January 1, 1804* 独立。",
    ),
    sentences: t(
      "*Toussaint Louverture* is *too-SAN loo-ver-TOOR*. *Dessalines* is *day-sa-LEEN*. *Olaudah Equiano* is *oh-LOW-dah ek-wee-AH-noh*. *Bolívar* is *boh-LEE-var*. *Bastille* is *ba-STEEL*.",
      "*Toussaint Louverture* 读作 *too-SAN loo-ver-TOOR*。*Dessalines* 读作 *day-sa-LEEN*。*Olaudah Equiano* 读作 *oh-LOW-dah ek-wee-AH-noh*。*Bolívar* 读作 *boh-LEE-var*。*Bastille* 读作 *ba-STEEL*。",
    ),
    stretches: t(
      "*A quarrel over taxes had become a war.* A short closing sentence: slow down and stress *taxes* and *war*, the start and the end of the story.",
      "*A quarrel over taxes had become a war.* 收尾短句放慢，重读 *taxes* 和 *war*，也就是故事的起点和终点。",
    ),
  },
  "grade-8-the-globe-and-its-plays": {
    passages: t(
      "*Theatre* is the old building in the north; the *Globe* is the new one on the south bank. *Thou* and *you* sound different in meaning, not just form. *Wherefore* means *why*, not where.",
      "*Theatre* 是北边的旧剧场，*Globe* 是南岸的新剧院。*thou* 和 *you* 意思有别，不只是形式不同。*wherefore* 意思是 *why*，不是“在哪里”。",
    ),
    sentences: t(
      "*Mercutio* is *mer-KYOO-shee-oh*. *Tybalt* is *TIB-ult*. *Zeffirelli* is *zef-ih-REL-ee*. *Feste* is *FES-tee*. *Usurper* is *yoo-ZER-per*.",
      "*Mercutio* 读作 *mer-KYOO-shee-oh*。*Tybalt* 读作 *TIB-ult*。*Zeffirelli* 读作 *zef-ih-REL-ee*。*Feste* 读作 *FES-tee*。*Usurper* 读作 *yoo-ZER-per*。",
    ),
    stretches: t(
      '*"My only love sprung from my only hate," Juliet says.* Balance *only love* against *only hate*, with a small pause between the halves.',
      '*"My only love sprung from my only hate," Juliet says.* 让 *only love* 与 *only hate* 对称，两半之间稍停。',
    ),
  },
  "grade-8-the-story-of-life": {
    passages: t(
      "*Ichthyosaurus* and *plesiosaur* are both sea reptiles; keep them apart. Listen for *1835* (the Beagle), *1977* (the drought), about *252 million* years ago (the Great Dying) and about *twenty-eight thousand* pea plants.",
      "*Ichthyosaurus* 和 *plesiosaur* 都是海生爬行动物，别混。注意 *1835*（小猎犬号）、*1977*（旱灾）、约 *252 million* 年前（大灭绝）和约 *twenty-eight thousand* 株豌豆。",
    ),
    sentences: t(
      "*Ichthyosaurus* is *IK-thee-oh-SOR-us*. *Plesiosaur* is *PLEE-zee-oh-sor*. *Galápagos* is *ga-LAH-pa-gos*. *Tiktaalik* is *tik-TAH-lik*. *Paleontology* is *pay-lee-on-TOL-uh-jee*.",
      "*Ichthyosaurus* 读作 *IK-thee-oh-SOR-us*。*Plesiosaur* 读作 *PLEE-zee-oh-sor*。*Galápagos* 读作 *ga-LAH-pa-gos*。*Tiktaalik* 读作 *tik-TAH-lik*。*Paleontology* 读作 *pay-lee-on-TOL-uh-jee*。",
    ),
    stretches: t(
      "*The trait had not blended away. It had been hidden.* Stress *not blended* in the first sentence, pause, then give *hidden* the weight of the answer.",
      "*The trait had not blended away. It had been hidden.* 第一句重读 *not blended*，停顿后把 *hidden* 作为答案读重。",
    ),
  },
  "grade-8-turning-points": {
    passages: t(
      "Many names to keep straight: *Daniel* and *Mr. Okafor* in the bakery, *Mei* and *Lin*, *Omar*, *Theo* and *Rosa*, *Kenji* and *Mrs. Alvarez*. Listen for *twenty-second floor* and *seventy-two*.",
      "人名很多，要分清：面包店的 *Daniel* 和 *Mr. Okafor*，*Mei* 和 *Lin*，*Omar*、*Theo* 和 *Rosa*，*Kenji* 和 *Mrs. Alvarez*。注意 *twenty-second floor* 和 *seventy-two*。",
    ),
    sentences: t(
      "*Okafor* is *oh-KAH-for*. *Alvarez* is *AL-va-rez*. *Resentful* is *ri-ZENT-ful*. *Desperate* is *DES-per-it*. *Generous* is *JEN-er-us*.",
      "*Okafor* 读作 *oh-KAH-for*。*Alvarez* 读作 *AL-va-rez*。*Resentful* 读作 *ri-ZENT-ful*。*Desperate* 读作 *DES-per-it*。*Generous* 读作 *JEN-er-us*。",
    ),
    stretches: t(
      '*"A bakery is not only for selling bread," he said. "It is for feeding people."* Pause at *he said*, then say the second sentence slowly, with *feeding people* as its weight.',
      '*"A bakery is not only for selling bread," he said. "It is for feeding people."* 在 *he said* 处停顿，第二句慢读，重心放在 *feeding people*。',
    ),
  },
  "grade-9-art-and-its-subjects": {
    passages: t(
      "Keep the dates with their works: Bruegel's painting *around 1560*, Auden's visit *in 1938*, the Impressionists' show *in April 1874*, Guernica bombed on *April 26, 1937*, the Great Wave *around 1831*, the Lumière screening on *December 28, 1895*. *Monet* and Manet sound close, but only *Monet* is named here.",
      "年份要对上作品：勃鲁盖尔的画 *around 1560*，奥登 *in 1938* 参观，印象派画展 *in April 1874*，格尔尼卡 *April 26, 1937* 被炸，《神奈川冲浪里》*around 1831*，卢米埃尔放映 *December 28, 1895*。*Monet* 与 Manet 发音接近，但文中只提到 *Monet*。",
    ),
    sentences: t(
      "*Bruegel* is *BROY-gul*. *Hokusai* is *HOH-koo-sy*. *Heiligenstadt* is *HY-lig-en-shtat*. *Méliès* is *mel-YES*. *Lumière* is *loo-mee-AIR*.",
      "*Bruegel* 读作 *BROY-gul*。*Hokusai* 读作 *HOH-koo-sy*。*Heiligenstadt* 读作 *HY-lig-en-shtat*。*Méliès* 读作 *mel-YES*。*Lumière* 读作 *loo-mee-AIR*。",
    ),
    stretches: t(
      "*The ploughman may have heard the splash, but for him it was not an important failure.* Keep *may have heard the splash* light, pause at the comma, then let *not an important failure* fall flat and dry, as the poem's irony asks.",
      "*The ploughman may have heard the splash, but for him it was not an important failure.* *may have heard the splash* 读得轻，逗号处停一下，*not an important failure* 平淡干脆地落下，体现诗中的反讽。",
    ),
  },
  "grade-9-coming-of-age": {
    passages: t(
      "Listen for who is who: *Meg*, *Jo*, *Beth* and *Amy* are the March sisters; *Marmee* is their mother. *Margot* is Anne Frank's sister, *Otto* her father. *Ninety percent* of adult size by *six*; change may go on into the *mid-twenties*.",
      "听清人物：*Meg*、*Jo*、*Beth*、*Amy* 是马奇家四姐妹，*Marmee* 是母亲。*Margot* 是安妮·弗兰克的姐姐，*Otto* 是她父亲。大脑 *six* 岁达到成人大小的 *ninety percent*，变化可能持续到 *mid-twenties*。",
    ),
    sentences: t(
      "*Quinceañera* is *keen-say-NYAIR-ah*. *Bildungsroman* is *BIL-doongs-roh-mahn*. *Yousafzai* is *yoo-saf-ZY*. *Sateré-Mawé* is *sah-teh-REH mah-WEH*. *Benefactor* is *BEN-uh-fak-ter*.",
      "*Quinceañera* 读作 *keen-say-NYAIR-ah*。*Bildungsroman* 读作 *BIL-doongs-roh-mahn*。*Yousafzai* 读作 *yoo-saf-ZY*。*Sateré-Mawé* 读作 *sah-teh-REH mah-WEH*。*Benefactor* 读作 *BEN-uh-fak-ter*。",
    ),
    stretches: t(
      "*Something has ended. Something new has begun.* Two matching sentences: stress *ended* in the first and *new* in the second, with a clear pause between them.",
      "*Something has ended. Something new has begun.* 两句对称：第一句重读 *ended*，第二句重读 *new*，中间明显停顿。",
    ),
  },
  "grade-9-food-health-and-the-body": {
    passages: t(
      "*Placebo* helps; *nocebo* harms. Lind's trial was *in 1747*, the sugar review *in 1967*, the letters found *in 2016*, Gage's accident on *September 13, 1848*, the ether operation on *October 16, 1846*. *Ether* and *chloroform* are two different anesthetics.",
      "*placebo* 让人好转，*nocebo* 让人难受。林德的试验 *in 1747*，糖业综述 *in 1967*，信件 *in 2016* 被发现，盖奇事故 *September 13, 1848*，乙醚手术 *October 16, 1846*。*ether* 和 *chloroform* 是两种不同的麻醉剂。",
    ),
    sentences: t(
      "*Semmelweis* is *ZEM-ul-vyss*. *Microbiome* is *my-kroh-BY-ohm*. *Anesthesia* is *an-us-THEE-zhuh*. *Cadaverous* is *kuh-DAV-er-us*. *Scurvy* is *SKER-vee*.",
      "*Semmelweis* 读作 *ZEM-ul-vyss*。*Microbiome* 读作 *my-kroh-BY-ohm*。*Anesthesia* 读作 *an-us-THEE-zhuh*。*Cadaverous* 读作 *kuh-DAV-er-us*。*Scurvy* 读作 *SKER-vee*。",
    ),
    stretches: t(
      "*Within six days, one of the sailors who ate citrus fruit was fit for duty, and the other was nearly recovered.* Carry *one of the sailors who ate citrus fruit* as one group without a break, then pause at the comma before *and the other*.",
      "*Within six days, one of the sailors who ate citrus fruit was fit for duty, and the other was nearly recovered.* *one of the sailors who ate citrus fruit* 作为一个意群连读，逗号处停顿再读 *and the other*。",
    ),
  },
  "grade-9-heroes-and-epics": {
    passages: t(
      "Many names sound foreign; hold each to its epic. *Enkidu* and *Utnapishtim* are in Gilgamesh, *Hrothgar* and *Wiglaf* in Beowulf, *Sogolon* and *Soumaoro* in Sundiata, *Rostam* and *Sohrab* in the Shahnameh. *Rakhsh* is a horse, not a man.",
      "名字很陌生，要对上各自的史诗：*Enkidu* 和 *Utnapishtim* 在《吉尔伽美什》，*Hrothgar* 和 *Wiglaf* 在《贝奥武甫》，*Sogolon* 和 *Soumaoro* 在《松迪亚塔》，*Rostam* 和 *Sohrab* 在《列王纪》。*Rakhsh* 是马，不是人。",
    ),
    sentences: t(
      "*Gilgamesh* is *GIL-guh-mesh*. *Utnapishtim* is *oot-nah-PISH-tim*. *Xuanzang* is *SHWEN-dzahng*. *Ferdowsi* is *fer-DOH-see*. *Shahnameh* is *shah-nah-MEH*.",
      "*Gilgamesh* 读作 *GIL-guh-mesh*。*Utnapishtim* 读作 *oot-nah-PISH-tim*。*Xuanzang* 读作 *SHWEN-dzahng*。*Ferdowsi* 读作 *fer-DOH-see*。*Shahnameh* 读作 *shah-nah-MEH*。",
    ),
    stretches: t(
      "*Gilgamesh finds it at the bottom of the sea, but while he bathes on the journey home, a snake steals it.* Rise on the first clause, slow on *while he bathes on the journey home*, then drop sharply on *a snake steals it*.",
      "*Gilgamesh finds it at the bottom of the sea, but while he bathes on the journey home, a snake steals it.* 第一分句上扬，*while he bathes on the journey home* 放慢，*a snake steals it* 骤然下降。",
    ),
  },
  "grade-9-stories-from-many-cultures": {
    passages: t(
      "*Shahryar* is the king; *Shahrazad* is the storyteller. Their names begin alike, so listen to the ending. The Grimms' first volume came *in 1812*; it grew from about *eighty-six* tales to more than *two hundred*. Urashima was gone *three hundred years*, not three days.",
      "*Shahryar* 是国王，*Shahrazad* 是讲故事的人，开头相同，注意听结尾。格林兄弟第一卷出版于 *in 1812*，从约 *eighty-six* 个故事增加到 *two hundred* 多个。浦岛太郎离开了 *three hundred years*，不是三天。",
    ),
    sentences: t(
      "*Anansi* is *uh-NAHN-see*. *Nasreddin* is *nahs-reh-DEEN*. *Otohime* is *oh-toh-HEE-meh*. *Achebe* is *uh-CHAY-bay*. *Ofrenda* is *oh-FREN-dah*.",
      "*Anansi* 读作 *uh-NAHN-see*。*Nasreddin* 读作 *nahs-reh-DEEN*。*Otohime* 读作 *oh-toh-HEE-meh*。*Achebe* 读作 *uh-CHAY-bay*。*Ofrenda* 读作 *oh-FREN-dah*。",
    ),
    stretches: t(
      "*Whom do you believe, me or a donkey?* Say it in an offended voice: rise on *me*, then fall on *a donkey*, so the joke lands.",
      "*Whom do you believe, me or a donkey?* 用受了冒犯的语气：*me* 上扬，*a donkey* 下降，让笑点落地。",
    ),
  },
  "grade-9-the-writers-craft": {
    passages: t(
      "Each story has its own names: *Mr. Ortiz* fixes clocks, *Leo* builds gliders, *Mira* hears the silence, *Ana* keeps the key, *Jonah* draws the crack, *Kayla* stops for *Bea*. Do not mix *Daniel* of the picnic with *Daniel* at the bus shelter in another unit.",
      "每篇有各自的人名：*Mr. Ortiz* 修钟，*Leo* 做滑翔机，*Mira* 听到寂静，*Ana* 留着钥匙，*Jonah* 画裂缝，*Kayla* 为 *Bea* 停下。野餐的 *Daniel* 别和别的单元里车站的 Daniel 混在一起。",
    ),
    sentences: t(
      "*Oxymoron* is *ok-see-MOR-on*. *Icarus* is *IK-uh-rus*. *Odyssey* is *OD-uh-see*. *Anniversary* is *an-uh-VER-suh-ree*. *Miserable* is *MIZ-er-uh-bul*.",
      "*Oxymoron* 读作 *ok-see-MOR-on*。*Icarus* 读作 *IK-uh-rus*。*Odyssey* 读作 *OD-uh-see*。*Anniversary* 读作 *an-uh-VER-suh-ree*。*Miserable* 读作 *MIZ-er-uh-bul*。",
    ),
    stretches: t(
      '*"You fix it," he said. "Take as long as it needs."* Say the two quoted parts slowly and kindly, with *he said* quick and low between them.',
      '*"You fix it," he said. "Take as long as it needs."* 两段引语读得慢而温和，中间的 *he said* 轻快低沉。',
    ),
  },
  "grade-9-tragedy-and-the-stage": {
    passages: t(
      "Many stage words sound alike: *exposition*, *climax*, *reversal*, *recognition*, *denouement*. A Greek chorus had *twelve to fifteen* performers; there were only *two or three* actors. The Globe burned *in 1613*.",
      "舞台术语很多：*exposition*、*climax*、*reversal*、*recognition*、*denouement*。希腊歌队有 *twelve to fifteen* 人，演员只有 *two or three* 个。环球剧院 *in 1613* 烧毁。",
    ),
    sentences: t(
      "*Dionysus* is *dy-uh-NY-sus*. *Aeschylus* is *ES-kuh-lus*. *Euripides* is *yoo-RIP-uh-deez*. *Catharsis* is *kuh-THAR-sis*. *Denouement* is *day-noo-MAHN*.",
      "*Dionysus* 读作 *dy-uh-NY-sus*。*Aeschylus* 读作 *ES-kuh-lus*。*Euripides* 读作 *yoo-RIP-uh-deez*。*Catharsis* 读作 *kuh-THAR-sis*。*Denouement* 读作 *day-noo-MAHN*。",
    ),
    stretches: t(
      '*"Insurance," he said, shaking his head. "Not anymore."* Say *Insurance* as a quiet echo of the first day, pause through *shaking his head*, then give *Not anymore* warmth.',
      '*"Insurance," he said, shaking his head. "Not anymore."* *Insurance* 轻声回应第一天的话，*shaking his head* 处停顿，*Not anymore* 读得温暖。',
    ),
  },
  "grade-9-worlds-of-tomorrow": {
    passages: t(
      "Dates of books come close: Verne *in 1865*, Čapek *in 1920*, Huxley *in 1932*, Asimov's laws *in 1942*, Orwell *in 1949*, Turing *in 1950*, Bradbury *in 1953*. Launch windows come every *twenty-six months*; the trip takes *six to nine months*.",
      "作品年份很密：凡尔纳 *in 1865*，恰佩克 *in 1920*，赫胥黎 *in 1932*，阿西莫夫定律 *in 1942*，奥威尔 *in 1949*，图灵 *in 1950*，布拉德伯里 *in 1953*。发射窗口每 *twenty-six months* 一次，航程 *six to nine months*。",
    ),
    sentences: t(
      "*Čapek* is *CHAH-pek*. *Tsiolkovsky* is *tsee-ol-KOF-skee*. *Omelas* is *OH-meh-lahs*. *Dystopia* is *dis-TOH-pee-uh*. *Trajectory* is *truh-JEK-tuh-ree*.",
      "*Čapek* 读作 *CHAH-pek*。*Tsiolkovsky* 读作 *tsee-ol-KOF-skee*。*Omelas* 读作 *OH-meh-lahs*。*Dystopia* 读作 *dis-TOH-pee-uh*。*Trajectory* 读作 *truh-JEK-tuh-ree*。",
    ),
    stretches: t(
      "*It is not enough to tell a machine to be good. We must decide, very carefully, what good means.* Stress *not enough* in the first sentence; in the second, set off *very carefully* with short pauses and end firmly on *good means*.",
      "*It is not enough to tell a machine to be good. We must decide, very carefully, what good means.* 第一句重读 *not enough*；第二句用短停顿把 *very carefully* 隔开，以 *good means* 坚定收尾。",
    ),
  },
};
