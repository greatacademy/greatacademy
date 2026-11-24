// Grade 7: word study: Latin and Greek roots, suffixes of science and of adjectives, idioms and euphemisms.

import type { TopicDef } from "@ga/content";
import type { ChoiceItem } from "@ga/subject-english";
import { choose, field, partLines, parts, rows, topic } from "../grade-6/kit.ts";

const latin4 = parts({
  id: "latin-roots-4",
  title: ["Latin Roots 4", "拉丁词根 4"],
  summary: [
    "Ten more Latin roots: magn, nov, mort, sens, grat, pos, flect, clud, viv and cogn.",
    "另外十个拉丁词根：magn、nov、mort、sens、grat、pos、flect、clud、viv 和 cogn。",
  ],
  intro: [
    "Once you know *nov* means *new*, *renovate*, *novice*, and *novel* snap into one family instantly. Ten high-utility Latin roots unlock dozens of academic words across literature, history, and science.",
    "一旦知道 *nov* 意为“新”，*renovate*、*novice* 和 *novel* 立刻串成一家。掌握这十个高频拉丁词根，就能批量读懂文学、历史和科学中的学术词。",
  ],
  after: ["latin-roots-3"],
  kind: ["Latin root", "拉丁词根"],
  list: partLines(`
    magn|great|大|magnify|to make something look bigger than it is|magnificent|very great and beautiful|magnitude|the great size or importance of something
    nov|new|新|novel|new and different from anything before|novice|a person who is new to an activity|renovate|to make an old building new again
    mort|death|死亡|mortal|certain to die some day|immortal|living forever; never dying|mortician|a person whose job is to prepare the dead for burial
    sens|feel|感觉|sensation|a feeling in the body, such as heat or pain|sensitive|quick to feel or react to something|sensory|having to do with the body's senses and feelings
    grat|thanks or pleasing|感谢，令人愉快|grateful|feeling thanks for something|gratitude|the feeling of being thankful|gratify|to please someone by giving what they want
    pos|put or place|放，置|deposit|to put something down or into a place|compose|to put together parts to make a whole, such as a song|postpone|to put something off until later
    flect|bend|弯曲|reflect|to bend light or sound back from a surface|deflect|to bend something away from its path|flexible|able to bend easily without breaking
    clud|shut|关闭|exclude|to shut someone out of a group|include|to shut something in as part of a whole|seclude|to shut someone away from other people
    viv|live|活|vivid|full of life and bright color|revive|to bring back to life or strength|survive|to stay alive through something dangerous
    cogn|know|知道|recognize|to know someone or something because you have seen it before|cognitive|having to do with knowing and thinking|incognito|with your identity hidden, so others do not know you
  `),
  explanations: [
    [
      "A Latin **root** carries the core meaning of a word while prefixes and suffixes steer it. *Magn* means great, *nov* new, *mort* death, *sens* feel, *grat* thanks or pleasing, *pos* put, *flect* bend, *clud* shut, *viv* live, and *cogn* know. Spelling can shift slightly (*flex* in *flexible*, *vit* in *vital*), yet the core meaning stays.\n\n> **Watch out.** Do not confuse look-alike roots—check the example word's definition beside the root to confirm its exact core sense.",
      "拉丁**词根**承载词的核心意思，前缀和后缀微调方向。*magn* 意为大，*nov* 新，*mort* 死亡，*sens* 感觉，*grat* 感谢或令人愉快，*pos* 放置，*flect* 弯曲，*clud* 关闭，*viv* 活，*cogn* 知道。拼写可能微调（*flexible* 中的 *flex*，*vital* 中的 *vit*），核心意思不变。\n\n> **注意。** 别混淆拼写接近的词根——结合旁边例词的释义来印证核心意思。",
    ],
    [
      "To pick the word for a definition, match the core idea to its root, then check the prefix or suffix. *To shut someone out* pairs *clud* (shut) with *ex-* (out) → **exclude**; *living forever* pairs *mort* (death) with *im-* (not) → **immortal**.\n\n> **Watch out.** Two choices can share the same root (*include* vs. *exclude*)—always read the prefix carefully so you do not pick the opposite.",
      "根据释义选词时，先用词根锁定核心意思，再看前缀或后缀。*to shut someone out* 用 *clud*（关闭）配 *ex-*（出）→ **exclude**；*living forever* 用 *mort*（死亡）配 *im-*（不）→ **immortal**。\n\n> **注意。** 两个选项可能共享同一词根（如 *include* 与 *exclude*）——务必看清前缀，免得选成反义词。",
    ],
  ],
});

const greek3 = parts({
  id: "greek-roots-3",
  title: ["Greek Roots 3", "希腊词根 3"],
  summary: [
    "Ten more Greek roots: phil, soph, anthrop, arch, nym, pan, hom, dox, ortho and crypt.",
    "另外十个希腊词根：phil、soph、anthrop、arch、nym、pan、hom、dox、ortho 和 crypt。",
  ],
  intro: [
    "Split *pseudonym* into *pseudo* (false) + *nym* (name), and a daunting literary term becomes transparent. These ten Greek roots power the vocabulary of ideas, government, and language.",
    "把 *pseudonym* 拆成 *pseudo*（假）+ *nym*（名字），一个看似生僻的文学术语立刻一目了然。这十个希腊词根是思想、政体与语言类词汇的基石。",
  ],
  after: ["greek-roots-2"],
  kind: ["Greek root", "希腊词根"],
  list: partLines(`
    phil|love|爱|philosophy|the love and study of wisdom|philanthropist|a person who gives money because they love people|bibliophile|a person who loves books
    soph|wise|智慧|sophisticated|wise in the ways of the world; complex|sophomore|a student in the second year, "wise but foolish"|philosopher|a person who seeks wisdom by thinking deeply
    anthrop|human|人类|anthropology|the study of human beings and their cultures|misanthrope|a person who dislikes other people|anthropoid|shaped like a human, as an ape is
    arch|chief or rule|首领，统治|monarch|a single person who rules a country|anarchy|a state with no ruler or government|archbishop|a chief bishop over other bishops
    nym|name|名字|synonym|a word with the same meaning as another|pseudonym|a false name used by a writer|anonymous|with no name given
    pan|all|全部|panorama|a wide view of all of an area|pandemic|a disease that spreads among all the world's people|pantheon|a temple for all the gods
    hom|same|相同|homogeneous|made of parts that are all the same kind|homonym|a word that sounds or is spelled the same as another|homophone|a word that sounds the same as another
    dox|opinion or belief|意见，信仰|orthodox|holding the accepted beliefs|paradox|a statement that goes against what you expect but may be true|heterodox|holding beliefs different from the accepted ones
    ortho|straight or correct|直，正确|orthodontist|a dentist who straightens teeth|orthography|the correct spelling of a language|orthopedic|having to do with correcting bones and joints
    crypt|hidden|隐藏|cryptic|with a hidden or puzzling meaning|encrypt|to hide a message in a secret code|crypt|a hidden room under a church
  `),
  explanations: [
    [
      "Greek roots anchor the language of ideas and learning. *Phil* means love, *soph* wise, *anthrop* human, *arch* chief or rule, *nym* name, *pan* all, *hom* same, *dox* opinion, *ortho* straight or correct, and *crypt* hidden. Two Greek roots often fuse together: *phil* + *soph* → **philosophy** (love of wisdom).\n\n> **Watch out.** Notice that *hom* (same, as in *homophone*) differs from Latin *homo* (human)—check the Greek root's meaning inside the example word.",
      "希腊词根支撑着大量思想与学术词汇。*phil* 意为爱，*soph* 智慧，*anthrop* 人类，*arch* 首领或统治，*nym* 名字，*pan* 全部，*hom* 相同，*dox* 意见，*ortho* 直或正确，*crypt* 隐藏。两个希腊词根常合体构词：*phil* + *soph* → **philosophy**（爱智慧）。\n\n> **注意。** 希腊词根 *hom* 表示“相同”（如 *homophone*），不要与拉丁词 *homo*（人）混淆——结合例词释义来确认。",
    ],
    [
      "Assemble the meaning piece by piece. *A false name* combines *pseudo* (false) + *nym* (name) → **pseudonym**; *a wide view of all of an area* combines *pan* (all) + *orama* (view) → **panorama**. When two words share one root, the second part separates them.\n\n> **Watch out.** Check *both* halves of the compound word—*monarch* (*one* ruler) and *anarchy* (*no* ruler) both carry *arch* yet mean opposite things.",
      "逐块拼出词义。*a false name* 由 *pseudo*（假）+ *nym*（名字）→ **pseudonym**；*a wide view of all of an area* 由 *pan*（全部）+ *orama*（景象）→ **panorama**。词根相同时，靠另一半区分。\n\n> **注意。** 复合词的两半都要看——*monarch*（*一位*统治者）和 *anarchy*（*无*统治者）都含 *arch*，意思却截然相反。",
    ],
  ],
});

const scienceSuffixes = parts({
  id: "suffixes-of-science-and-medicine",
  title: ["Suffixes of Science and Medicine", "科学与医学的后缀"],
  summary: [
    "Ten suffixes of science and medicine: -itis, -cide, -phobia, -vore, -ectomy, -osis, -arium, -oid, -emia and -ician.",
    "十个科学与医学的后缀：-itis、-cide、-phobia、-vore、-ectomy、-osis、-arium、-oid、-emia 和 -ician。",
  ],
  intro: [
    "Medical and science terms look long only until you read their endings: *-itis* signals inflammation, *-ectomy* surgical removal, and *-arium* a place for keeping something. Ten suffixes decode an entire shelf of science words.",
    "医学和科学词汇看着长，读懂词尾就豁然开朗：*-itis* 表示发炎，*-ectomy* 表示切除，*-arium* 表示场所。掌握这十个后缀，能一下子读通一整排科学术语。",
  ],
  after: ["common-suffixes"],
  kind: ["suffix", "后缀"],
  list: partLines(`
    -itis|swelling and soreness|发炎|tonsillitis|a swelling of the tonsils in the throat|arthritis|a painful swelling of the joints|bronchitis|a swelling of the tubes that carry air to the lungs
    -cide|killing|杀死|pesticide|a chemical that kills insects and other pests|insecticide|a chemical that kills insects|germicide|a substance that kills germs
    -phobia|fear|恐惧|claustrophobia|fear of small, closed spaces|arachnophobia|fear of spiders|acrophobia|fear of heights
    -vore|eater|食者|herbivore|an animal that eats only plants|carnivore|an animal that eats meat|omnivore|an animal that eats both plants and meat
    -ectomy|cutting out|切除|appendectomy|an operation that removes the appendix|tonsillectomy|an operation that removes the tonsils|mastectomy|an operation that removes a breast
    -osis|a diseased condition|病症|tuberculosis|a disease of the lungs caused by bacteria|scoliosis|a condition in which the spine curves to the side|halitosis|a condition of bad breath
    -arium|a place for|场所|aquarium|a tank or building where water animals are kept|planetarium|a building where images of the stars and planets are shown|terrarium|a glass box where small land plants or animals are kept
    -oid|like or shaped like|像，形似|asteroid|a rock in space that looks like a small star|humanoid|having a shape like a human|spheroid|shaped almost like a ball
    -emia|a condition of the blood|血液病症|anemia|a condition of having too few red blood cells|leukemia|a cancer of the blood|hypoglycemia|a condition of having too little sugar in the blood
    -ician|a person skilled in|专业人员|technician|a person skilled in working with machines or equipment|musician|a person skilled in playing music|electrician|a person skilled in working with electric wires
  `),
  explanations: [
    [
      "Scientific and medical terms often end in a Greek or Latin **suffix** that tells what category of thing the word names: *-itis* (swelling and soreness), *-cide* (killing), *-phobia* (fear), *-vore* (eater), *-ectomy* (cutting out), *-osis* (diseased condition), *-arium* (place for), *-oid* (shaped like), *-emia* (blood condition), and *-ician* (skilled person).\n\n> **Watch out.** Do not confuse *-itis* (inflammation), *-osis* (a diseased condition), and *-emia* (specifically a *blood* condition)—each narrows down a different medical category.",
      "科学和医学词汇常以希腊或拉丁**后缀**结尾，指明事物所属类别：*-itis*（发炎）、*-cide*（杀死）、*-phobia*（恐惧）、*-vore*（食者）、*-ectomy*（切除）、*-osis*（病症）、*-arium*（场所）、*-oid*（形似）、*-emia*（血液病症）、*-ician*（专业人员）。\n\n> **注意。** 分清 *-itis*（发炎）、*-osis*（一般病症）和 *-emia*（特指*血液*病症）——它们各自锁定不同的医学类别。",
    ],
    [
      "Read the suffix first to get the category, then the root to get the target. *Herbivore* and *carnivore* are both eaters (*-vore*); *herb* (plant) and *carn* (meat) specify the diet. *Tonsillitis* and *tonsillectomy* both involve the tonsils, yet *-itis* is swelling while *-ectomy* is removal.\n\n> **Watch out.** When two options start the same way, focus squarely on the ending—one suffix can change an illness (*-itis*) into a surgery (*-ectomy*).",
      "先看后缀定大类，再看前半部分定对象。*herbivore* 和 *carnivore* 都是食者（*-vore*），*herb*（植物）和 *carn*（肉）说明吃什么。*tonsillitis* 和 *tonsillectomy* 都涉及扁桃体，但 *-itis* 是发炎，*-ectomy* 是切除手术。\n\n> **注意。** 两个选项开头相同时，盯紧词尾——换一个后缀就会把疾病（*-itis*）变成手术（*-ectomy*）。",
    ],
  ],
});

const adjectiveSuffixes = parts({
  id: "suffixes-that-form-adjectives",
  title: ["Suffixes That Form Adjectives", "构成形容词的后缀"],
  summary: [
    "Ten suffixes that turn words into adjectives: -ous, -ive, -ish, -ward, -proof, -fold, -ary, -some, -esque and -ic.",
    "十个把词变成形容词的后缀：-ous、-ive、-ish、-ward、-proof、-fold、-ary、-some、-esque 和 -ic。",
  ],
  intro: [
    "Adding *-proof* to *water* builds *waterproof*, and adding *-ward* to *sky* builds *skyward*: ten adjective-making **suffixes** let you read and form precise descriptive words on the fly.",
    "给 *water* 加上 *-proof* 得到 *waterproof*，给 *sky* 加上 *-ward* 得到 *skyward*：掌握这十个构词**后缀**，就能自如理解和辨认精准的形容词。",
  ],
  after: ["suffixes-that-change-word-class"],
  kind: ["suffix", "后缀"],
  list: partLines(`
    -ous|full of|充满|courageous|full of courage|glorious|full of glory and beauty|hazardous|full of danger
    -ive|tending to|倾向于|creative|tending to make new things|talkative|tending to talk a lot|destructive|tending to destroy things
    -ish|somewhat or like|有点，像|childish|like a child, in a silly way|reddish|somewhat red|foolish|like a fool; not wise
    -ward|in the direction of|朝……方向|homeward|in the direction of home|skyward|in the direction of the sky|eastward|in the direction of the east
    -proof|safe against|防……的|waterproof|safe against water getting in|fireproof|safe against burning|soundproof|safe against noise getting through
    -fold|times as many|倍|twofold|twice as many or as much|tenfold|ten times as many or as much|hundredfold|a hundred times as many or as much
    -ary|relating to|与……有关|monetary|relating to money|planetary|relating to planets|military|relating to soldiers and armies
    -some|causing or tending to|引起，易于|troublesome|causing trouble|lonesome|tending to feel lonely|tiresome|causing someone to feel tired or bored
    -esque|in the style of|……风格的|picturesque|pretty in the style of a picture|statuesque|tall and still, in the style of a statue|Romanesque|in the style of Roman buildings, with round arches
    -ic|of or having the nature of|具有……性质的|heroic|having the nature of a hero|economic|of the economy and money|poetic|having the nature of poetry
  `),
  explanations: [
    [
      "An adjective **suffix** shifts a base word into a describing word and adds a specific shade of meaning: *-ous* (full of), *-ive* (tending to), *-ish* (somewhat or like), *-ward* (in the direction of), *-proof* (safe against), *-fold* (times as many), *-ary* (relating to), *-some* (causing or tending to), *-esque* (in the style of), and *-ic* (of the nature of).\n\n> **Watch out.** Watch the subtle difference between *-ish* (*like* or *somewhat*, often playful or critical, as in *childish*) and *-esque* (*in the artistic style of*, as in *picturesque*).",
      "形容词**后缀**既把词干变成修饰词，又添上具体语义：*-ous*（充满）、*-ive*（倾向于）、*-ish*（有点/像）、*-ward*（朝……方向）、*-proof*（防……的）、*-fold*（倍）、*-ary*（与……有关）、*-some*（引起/易于）、*-esque*（……风格的）、*-ic*（具有……性质的）。\n\n> **注意。** 区分 *-ish*（有点/像，常带口语或批评色彩，如 *childish*）和 *-esque*（某种艺术风格，如 *picturesque*）。",
    ],
    [
      "Split the word into base + suffix and fuse their meanings: *water* + *-proof* (safe against) → **waterproof**; *trouble* + *-some* (causing) → **troublesome**. The base may trim a letter before the suffix (*glory* → *glorious*).\n\n> **Watch out.** Match *both* the base word and the suffix to the clue—*homeward* and *eastward* share *-ward*, so the base decides the direction.",
      "把词拆成词干加后缀再合义：*water* + *-proof*（防）→ **waterproof**；*trouble* + *-some*（引起）→ **troublesome**。词干接后缀时有时会省去或变换字母（*glory* → *glorious*）。\n\n> **注意。** 词干和后缀两头都要对上释义——*homeward* 和 *eastward* 都带 *-ward*，方向由词干决定。",
    ],
  ],
});

const latin5 = parts({
  id: "latin-roots-5",
  title: ["Latin Roots 5", "拉丁词根 5"],
  summary: [
    "Ten Latin roots of speech, law and society: loqu, clam, lingu, jur, liber, equ, civ, pop, fort and pac.",
    "十个有关言语、法律和社会的拉丁词根：loqu、clam、lingu、jur、liber、equ、civ、pop、fort 和 pac。",
  ],
  intro: [
    "Words from civics and debate—*eloquent*, *jurisdiction*, *equality*, *pacifist*—all spring from ten Latin roots of speech, law, and public life. Knowing the roots makes complex civic vocabulary readable at sight.",
    "公民课和辩论中的高频词——*eloquent*、*jurisdiction*、*equality*、*pacifist*——都源自这十个关于言语、法律与公共生活的拉丁词根。掌握它们，复杂的社会议题词汇便能一眼读懂。",
  ],
  after: ["latin-roots-4"],
  kind: ["Latin root", "拉丁词根"],
  list: partLines(`
    loqu|speak|说|eloquent|speaking well and with power|loquacious|speaking a great deal|soliloquy|a speech that a character makes alone on stage
    clam|cry out|呼喊|exclaim|to cry out suddenly|proclaim|to announce something loudly and in public|clamor|a loud, shouting noise made by many people
    lingu|tongue or language|舌头，语言|bilingual|able to speak two languages|linguist|a person who studies languages|multilingual|using many languages
    jur|law or swear|法律，发誓|jury|a group sworn to decide a court case|jurisdiction|the area in which a court's laws have power|perjury|lying in court after swearing to tell the truth
    liber|free|自由|liberty|the state of being free|liberate|to set someone free|liberal|free in giving; open to new ideas
    equ|equal|相等|equality|the state of being equal|equation|a statement that two amounts are equal|equator|the line that divides Earth into two equal halves
    civ|citizen|公民|civic|having to do with citizens and their town|civilian|a citizen who is not in the army|civilization|a society of citizens with its own laws and culture
    pop|people|人民|population|all the people who live in a place|popular|liked by many people|populate|to fill a place with people
    fort|strong|强|fortify|to make a place stronger against attack|fortitude|strength of mind in hard times|fortress|a strong building that protects people
    pac|peace|和平|pacify|to make someone calm and peaceful|pacifist|a person who believes war is always wrong|pact|a peaceful agreement between groups
  `),
  explanations: [
    [
      "Latin supplied English with its core vocabulary of speech, law, and citizenship: *loqu* (speak), *clam* (cry out), *lingu* (tongue or language), *jur* (law or swear), *liber* (free), *equ* (equal), *civ* (citizen), *pop* (people), *fort* (strong), and *pac* (peace). Spelling shifts slightly (*claim* in *exclaim*), while the core meaning holds.\n\n> **Watch out.** Do not confuse *civ* (citizen, as in *civic*) with *pop* (people in general, as in *population*)—check which specific meaning the example word highlights.",
      "拉丁语为英语提供了言语、法律与公共生活的核心词根：*loqu*（说）、*clam*（呼喊）、*lingu*（舌头/语言）、*jur*（法律/发誓）、*liber*（自由）、*equ*（相等）、*civ*（公民）、*pop*（人民）、*fort*（强）、*pac*（和平）。拼写偶有变化（如 *exclaim* 中的 *claim*），核心义不变。\n\n> **注意。** 别把 *civ*（公民，如 *civic*）和 *pop*（人民/人口，如 *population*）弄混——看清例词释义强调哪一个。",
    ],
    [
      "Match the definition's core idea to its root, then let prefixes and suffixes complete the word: *able to speak two languages* → *bi-* (two) + *lingu* (language) = **bilingual**; *lying after swearing to tell the truth* → *per-* (wrongly) + *jur* (swear) = **perjury**.\n\n> **Watch out.** Read the whole clue before choosing—*exclaim* (cry out suddenly) and *proclaim* (announce publicly) share *clam* yet differ by prefix.",
      "先用词根对准核心意思，再让前缀和后缀定型：*able to speak two languages* → *bi-*（二）+ *lingu*（语言）= **bilingual**；*lying after swearing to tell the truth* → *per-*（错误地）+ *jur*（发誓）= **perjury**。\n\n> **注意。** 先读完整个释义再选——*exclaim*（突然呼喊）和 *proclaim*（公开宣布）词根都是 *clam*，区别全在前缀。",
    ],
  ],
});

const greek4 = parts({
  id: "greek-roots-4",
  title: ["Greek Roots 4", "希腊词根 4"],
  summary: [
    "Ten Greek roots of flight, machines and light: aer, naut, baro, helic, pter, cosm, mechan, pyr, gyr and phot.",
    "十个有关飞行、机器和光的希腊词根：aer、naut、baro、helic、pter、cosm、mechan、pyr、gyr 和 phot。",
  ],
  intro: [
    "Why is a *helicopter* not split into *heli + copter*? Its true Greek pieces are *helic* (spiral) + *pter* (wing). Ten Greek roots of flight, light, and machinery turn engineering terms into clear blueprints.",
    "为什么 *helicopter* 不是拆成 *heli + copter*？它真正的希腊词根是 *helic*（螺旋）+ *pter*（翅膀）。这十个关于飞行、光和机械的希腊词根，能把工程科技术语拆成一目了然的蓝图。",
  ],
  after: ["greek-roots-3"],
  kind: ["Greek root", "希腊词根"],
  list: partLines(`
    aer|air|空气|aerial|in or from the air|aerosol|a fine spray of liquid in the air|aerospace|the air around Earth and the space beyond it
    naut|sailor or ship|水手，船|astronaut|a person who travels in space as a sailor travels the sea|nautical|having to do with ships and sailors|aeronaut|a person who flies a balloon or an aircraft
    baro|weight or pressure|重量，压力|barometer|a tool that measures the pressure of the air|barometric|having to do with the pressure of the air|barograph|a tool that records air pressure on paper
    helic|spiral|螺旋|helicopter|an aircraft lifted by blades that spin in a spiral|helix|a spiral shape like a spring|helical|shaped like a spiral
    pter|wing|翅膀|pterodactyl|a flying reptile with wings like fingers|dipteran|an insect with two wings, such as a fly|lepidopteran|an insect with scaly wings, such as a butterfly
    cosm|world or order|世界，秩序|cosmos|the whole ordered universe|cosmonaut|a Russian astronaut, a sailor of the universe|microcosm|a small world that stands for a larger one
    mechan|machine|机器|mechanic|a person who repairs machines|mechanical|worked by a machine|mechanism|the working parts of a machine
    pyr|fire|火|pyrotechnics|a display of fireworks|pyre|a pile of wood for burning|pyromaniac|a person with a strong urge to set fires
    gyr|circle or turn|圆，旋转|gyroscope|a spinning wheel that keeps its direction and helps aircraft stay level|gyrate|to turn round and round|gyre|a large circle of turning ocean currents
    phot|light|光|photon|a tiny unit of light|photosynthesis|the way plants make food from light|photogenic|looking good in pictures taken with light
  `),
  explanations: [
    [
      "Words of flight, light, and machinery draw heavily on Greek: *aer* (air), *naut* (sailor or ship), *baro* (weight or pressure), *helic* (spiral), *pter* (wing), *cosm* (world or order), *mechan* (machine), *pyr* (fire), *gyr* (circle or turn), and *phot* (light). Single words often fuse two roots, like *astronaut* (*astro* star + *naut* sailor).\n\n> **Watch out.** Do not confuse *helic* (spiral) with *gyr* (circle or turn)—check whether the example word describes a spiral shape (*helix*) or a spinning circle (*gyroscope*, *gyre*).",
      "飞行、光与机械类词汇大量借用希腊词根：*aer*（空气）、*naut*（水手/船）、*baro*（重量/压力）、*helic*（螺旋）、*pter*（翅膀）、*cosm*（世界/秩序）、*mechan*（机器）、*pyr*（火）、*gyr*（圆/旋转）、*phot*（光）。一个词常合并两个词根，如 *astronaut*（*astro* 星 + *naut* 水手）。\n\n> **注意。** 别把 *helic*（螺旋）和 *gyr*（圆/旋转）混为一谈——结合例词看它指螺旋形态（*helix*）还是旋转圆周（*gyroscope*、*gyre*）。",
    ],
    [
      "Find the root carrying the clue's key idea, then check the companion root: *a tool that measures air pressure* pairs *baro* (pressure) + *meter* (measure) → **barometer**; *a sailor of the stars* pairs *astro* (star) + *naut* (sailor) → **astronaut**.\n\n> **Watch out.** Watch for silent letters in Greek roots—*pter* begins with a silent *p* in *pterodactyl*, yet still appears clearly in *helicopter*.",
      "找出对应释义核心概念的词根，再核对另一半：*a tool that measures air pressure* 用 *baro*（压力）+ *meter*（测量）→ **barometer**；*a sailor of the stars* 用 *astro*（星）+ *naut*（水手）→ **astronaut**。\n\n> **注意。** 留意希腊词根里的不发音字母——*pterodactyl* 开头的 *p* 不发音，但它在 *helicopter* 里同样代表“翅膀”。",
    ],
  ],
});

// Idioms: idiom|meaning|sentence|sentence|situation|situation
const idiomLines = rows(`
  break the ice|to make people feel relaxed when they first meet|At the first meeting, Ana told a joke to break the ice.|The teacher played a name game to break the ice on the first day.|On the first day of camp, a counselor gets the shy new campers laughing with a silly song.|Meeting her cousin's friends for the first time, Jun asks everyone about their favorite films so they start chatting.
  bite off more than you can chew|to try to do more than you are able to|I bit off more than I could chew when I joined four clubs.|Don't bite off more than you can chew; one project is enough.|Mara signs up for three sports, the school play and a weekend job, and soon she cannot keep up.|Theo promises to build a whole robot in one evening and is still gluing wheels at midnight.
  hit the nail on the head|to describe exactly what is causing a problem|You hit the nail on the head: the problem is that we started too late.|When she said the plan was too expensive, she hit the nail on the head.|Everyone argues about why the team keeps losing until Sam says the defense never talks, and they all agree.|The mechanic listens once and names the exact part that is making the noise.
  on thin ice|in a risky situation where you might get into trouble|After being late three times, he is on thin ice with the coach.|You are on thin ice if you forget your homework again.|Late for the third time this week, Leo is warned that one more will cost him his place on the team.|Having broken two of the library's rules, Priya knows the next mistake will lose her the card.
  let the cat out of the bag|to tell a secret by mistake|Ben let the cat out of the bag about the surprise party.|Don't let the cat out of the bag before the announcement.|At dinner, Maya mentions the present she bought for her sister, who is sitting right there.|Jay asks his friend whether she is excited about the party everyone has been keeping secret from her.
  the ball is in your court|it is now your turn to act or decide|I have made my offer; the ball is in your court.|We sent the plan to the principal, so the ball is in her court.|After the club offers Lina the job of captain, it is up to her to say yes or no.|Diego has said sorry and invited his friend over, and now he waits for her answer.
  cut corners|to do something badly or cheaply to save time or money|The builders cut corners, and the roof leaked.|If you cut corners on your essay, you will lose marks.|To finish quickly, the painter skips the first coat, and the wall soon peels.|The company uses cheaper bolts to save money, and the bridge has to be repaired within a year.
  get cold feet|to become too nervous to do something you planned|She got cold feet the night before the speech.|Many people get cold feet before a big change.|Just before his turn on the high diving board, Omar climbs back down the ladder.|Rosa signed up for the talent show, but on the day she asks to be taken off the list.
  in the same boat|in the same difficult situation as others|We all lost our notes, so we are in the same boat.|Don't worry, everyone in the class is in the same boat.|All the passengers miss their connecting flight because of the storm.|Every student on the team has two tests on the same morning.
  under the weather|feeling a little sick|I stayed home because I was under the weather.|Grandpa is under the weather, so we will visit next week.|With a sore throat and a slight fever, Kim decides to rest instead of going to practice.|Arjun feels tired and achy, so he asks to skip the long hike.
  a blessing in disguise|something that seems bad at first but turns out to be good|Missing the bus was a blessing in disguise, because I met my old friend.|Losing the job was a blessing in disguise.|Rain cancels the picnic, so the family stays home and finds the photos they thought they had lost.|Failing the first audition pushes Nia to practice so hard that she wins a better part the next year.
  burn the midnight oil|to work late into the night|She burned the midnight oil to finish the project.|Students often burn the midnight oil before exams.|The night before the deadline, Ravi is still writing his report at two in the morning.|Before the science fair, the twins work on their volcano long after everyone else is asleep.
  see eye to eye|to agree completely|My sister and I don't see eye to eye on music.|The two coaches finally saw eye to eye on the plan.|After a long talk, both friends agree on exactly where to go for the trip.|The mayor and the council vote together on every part of the new park.
  turn over a new leaf|to change your behavior and start again in a better way|After the warning, he turned over a new leaf and studied every day.|I am turning over a new leaf this year and getting up early.|After failing a test, Sara starts doing her homework every evening as soon as she gets home.|Once always late, Kai now sets two alarms and arrives first at practice every day.
  once in a blue moon|very rarely|We go to the city only once in a blue moon.|My brother cleans his room once in a blue moon.|Ella's aunt, who lives overseas, visits about every five years.|The town gets snow perhaps one winter in ten.
`);
const idioms = idiomLines.map((r) => ({
  idiom: field(r, 0),
  means: field(r, 1),
  uses: [field(r, 2), field(r, 3)],
  situations: [field(r, 4), field(r, 5)],
}));
const idiomMeaning: ChoiceItem[] = [];
const idiomFit: ChoiceItem[] = [];
idioms.forEach((p, i) => {
  p.uses.forEach((use, k) => {
    const others = [idioms[(i + 1 + k) % idioms.length], idioms[(i + 6 + k) % idioms.length]];
    idiomMeaning.push([use.replace(p.idiom, `*${p.idiom}*`), p.means, others.map((o) => o?.means ?? "")]);
  });
  p.situations.forEach((s, k) => {
    const others = [idioms[(i + 2 + k) % idioms.length], idioms[(i + 8 + k) % idioms.length]];
    idiomFit.push([s, p.idiom, others.map((o) => o?.idiom ?? "")]);
  });
});
const idiomByMeaning = (m: string) => idioms.find((p) => p.means === m)?.idiom ?? "";
const idiomMeans = (p: string) => idioms.find((x) => x.idiom === p)?.means ?? "";

const moreIdioms = topic("vocabulary", {
  id: "more-idioms",
  title: ["More Idioms", "更多习语"],
  summary: [
    "Fifteen idioms of everyday English, such as break the ice, cut corners and a blessing in disguise.",
    "十五个日常英语习语，如 break the ice、cut corners 和 a blessing in disguise。",
  ],
  intro: [
    "If a teammate says *We're in the same boat* on a dry basketball court, nobody looks for oars—they mean everyone shares the same tough situation. Everyday English is packed with **idioms** whose meaning lives in the whole phrase, not the single words.",
    "如果队友在干燥的篮球场上说 *We're in the same boat*，没人会去找船桨——意思是大家处境相同。日常英语充满这类**习语**，意思藏在整组短语里，而不是单个字面。",
  ],
  after: ["idioms"],
  points: [
    choose(
      "what-an-idiom-means",
      ["What an Idiom Means", "习语的意思"],
      [
        "An **idiom** is a fixed phrase whose meaning cannot be guessed word by word: *break the ice* means helping strangers feel comfortable, not smashing frozen water. Use the surrounding sentence to work out what the whole phrase must mean.\n\n> **Watch out.** Ignore literal word traps—if the sentence talks about a surprise party and says *let the cat out of the bag*, the meaning is about leaking a secret, not pets.",
        "**习语**是不能逐字照字面推算意思的固定短语：*break the ice* 意为打破僵局让人放松，而不是砸冰块。结合整句话的语境，就能推知整组短语的意思。\n\n> **注意。** 避开字面陷阱——如果句子在讲惊喜派对并说 *let the cat out of the bag*，说的是说漏秘密，和猫毫无关系。",
      ],
      ["What does the idiom in italics mean?", "斜体的习语是什么意思？"],
      idiomMeaning,
      (right) => [
        `*${idiomByMeaning(right)}* means **${right}**; read as a single expression, it fits the sentence naturally.\n\n**Check.** Substitute **${right}** in place of *${idiomByMeaning(right)}* in the sentence: the scene stays logical and clear, whereas the other meanings clash with the context.`,
        `*${idiomByMeaning(right)}* 的意思是 **${right}**；当作整体理解，整句话顺理成章。\n\n**检验。** 把 **${right}** 代回原句替换 *${idiomByMeaning(right)}*：句意完全通顺合理，而另外两个意思与语境格格不入。`,
      ],
      [
        ["*{wrong}* is the meaning of a different idiom, not of the one in italics.", "*{wrong}* 是另一个习语的意思，不是斜体习语的意思。"],
        [
          "*{wrong}* belongs to another idiom; it does not fit what happens in this sentence.",
          "*{wrong}* 属于另一个习语，与这个句子中发生的事不符。",
        ],
      ],
    ),
    choose(
      "idiom-for-a-situation",
      ["The Idiom for a Situation", "适合情境的习语"],
      [
        "To match an idiom to a real-life scenario, first summarize what is happening in plain English (*she grew too nervous at the last second* → **get cold feet**; *he skipped steps to save time* → **cut corners**). Then pick the idiom carrying that exact meaning.\n\n> **Watch out.** Never pick an idiom just because it shares a random word with the story (like *boat* or *ice*)—match the underlying situation.",
        "为情境选配习语时，先用大白话概括发生了什么（*临阵退缩太紧张* → **get cold feet**；*为省时偷工减料* → **cut corners**），再选出含义一致的习语。\n\n> **注意。** 别因为某个习语和情境里碰巧有同一个词（如 *boat* 或 *ice*）就选它——要看本质情境是否吻合。",
      ],
      ["Which idiom describes this situation?", "哪个习语能描述这个情境？"],
      idiomFit,
      (right) => [
        `**${right}** fits because it means *${idiomMeans(right)}*, matching the situation directly.\n\n**Check.** Compare *${idiomMeans(right)}* against the key action in the prompt: it captures the exact twist or dilemma described there.`,
        `**${right}** 最贴切，因为它的意思是“${idiomMeans(right)}”，与眼前情境完全吻合。\n\n**检验。** 把“${idiomMeans(right)}”对照题干里的核心事件：正好点中了这个情境的关键转折或处境。`,
      ],
      [
        ["*{wrong}* means something else; this situation is not about that.", "*{wrong}* 的意思是另一回事，这个情境说的不是那件事。"],
        [
          "*{wrong}* does not describe what happens here; its meaning is about something else.",
          "*{wrong}* 不能描述这里发生的事，它的意思是关于别的事的。",
        ],
      ],
    ),
  ],
});

// Euphemisms: euphemism|plain meaning|sentence|sentence|plain sentence|plain sentence
const euphemismLines = rows(`
  passed away|died|Her grandfather passed away last spring.|The old dog passed away in his sleep.|The newspaper reported that the famous singer had died at eighty.|The doctor had to tell the family that their uncle had died.
  let go|fired from a job|Fifty workers were let go when the factory closed.|He was let go after the company lost money.|The manager told three waiters they were fired.|The company fired its whole sales team.
  between jobs|without a job|My uncle is between jobs at the moment.|She has been between jobs since the spring.|After the shop closed, Dad had no job for six months.|He has had no work since the factory shut down.
  economical with the truth|lying or leaving out the truth|The witness was economical with the truth about where he had been.|The ad was economical with the truth about the price.|The salesman lied about how old the car was.|The report lied about the number of people hurt.
  pre-owned|used; owned by someone before|They bought a pre-owned car to save money.|The shop sells pre-owned phones.|We bought a used bicycle from a neighbor.|The market sells used furniture.
  vertically challenged|short|The ad joked about being vertically challenged.|The comedian called himself vertically challenged.|My brother is short for his age.|The basketball player was short but very fast.
  downsizing|cutting jobs to make a company smaller|The company announced downsizing in its offices.|After the downsizing, only ten people worked there.|The firm cut two hundred jobs.|The bank cut half of its jobs in the city.
  collateral damage|harm done to people or things that were not the target|The report called the ruined homes collateral damage.|Officials spoke of collateral damage after the attack.|The bombs destroyed a school near the bridge.|Many people who were not soldiers were killed in the attack.
  correctional facility|prison|He spent three years in a correctional facility.|The correctional facility is outside the town.|The thief was sent to prison for two years.|The prison has high walls and guards.
  economically disadvantaged|poor|The program helps economically disadvantaged families.|Many economically disadvantaged students get free lunch.|The charity gives coats to poor children.|The town has many poor families.
  senior citizen|an old person|Tickets are cheaper for every senior citizen.|The senior citizen center offers dance classes.|The bus has seats for old people near the front.|Many old people live on this street.
  negative growth|a fall or loss|The company reported negative growth this year.|The economy showed negative growth in the spring.|Sales fell by ten percent.|The town lost money last year.
  budget-friendly|cheap|The hotel offers budget-friendly rooms.|We found a budget-friendly restaurant near the station.|The shop sells cheap shoes that break in a month.|They bought the cheap tent, and it leaked.
  restroom|toilet|Excuse me, where is the restroom?|The restroom is down the hall.|The toilet in the gym was broken.|There is a toilet next to the kitchen.
  fixer-upper|a house in bad repair|The ad described the house as a fixer-upper.|They bought a fixer-upper and spent a year on repairs.|The old house had a broken roof and rotten floors.|The house they bought was falling apart.
`);
const euphemisms = euphemismLines.map((r) => ({
  euphemism: field(r, 0),
  plain: field(r, 1),
  uses: [field(r, 2), field(r, 3)],
  plains: [field(r, 4), field(r, 5)],
}));
const euphemismMeaning: ChoiceItem[] = [];
const euphemismFor: ChoiceItem[] = [];
euphemisms.forEach((e, i) => {
  e.uses.forEach((use, k) => {
    const others = [euphemisms[(i + 2 + k) % euphemisms.length], euphemisms[(i + 7 + k) % euphemisms.length]];
    euphemismMeaning.push([use.replace(e.euphemism, `*${e.euphemism}*`), e.plain, others.map((o) => o?.plain ?? "")]);
  });
  e.plains.forEach((p, k) => {
    const others = [euphemisms[(i + 3 + k) % euphemisms.length], euphemisms[(i + 9 + k) % euphemisms.length]];
    euphemismFor.push([p, e.euphemism, others.map((o) => o?.euphemism ?? "")]);
  });
});
const euphemismByPlain = (p: string) => euphemisms.find((e) => e.plain === p)?.euphemism ?? "";
const plainOf = (e: string) => euphemisms.find((x) => x.euphemism === e)?.plain ?? "";

const euphemismTopic = topic("vocabulary", {
  id: "euphemisms",
  title: ["Euphemisms", "委婉语"],
  summary: [
    "Words that make something harsh or unpleasant sound softer, such as passed away for died and let go for fired.",
    "把严厉或令人不快的事说得更柔和的词，如用 passed away 代替 died，用 let go 代替 fired。",
  ],
  intro: [
    "A company announces *negative growth* instead of *losses*, and a friend says *between jobs* instead of *unemployed*. Recognizing **euphemisms** helps you see both polite tact and spin in news, ads, and everyday speech.",
    "公司用 *negative growth* 代替“亏损”，朋友用 *between jobs* 代替“失业”。认出**委婉语**，既能体会礼貌体贴，也能看穿新闻和广告里的粉饰措辞。",
  ],
  after: ["connotation-and-precise-words"],
  points: [
    choose(
      "what-a-euphemism-means",
      ["What a Euphemism Means", "委婉语的意思"],
      [
        "A **euphemism** swaps a mild or polite phrase in place of a harsh, sad, or blunt word: *passed away* for *died*, *let go* for *fired*. Speakers use euphemisms out of kindness—or, in ads and official reports, to blur bad news. Translate the soft phrase back into plain English to see the reality.\n\n> **Watch out.** Do not let positive-sounding words (*budget-friendly*, *pre-owned*, *correctional facility*) hide the plain fact underneath—ask what blunt word the sentence is avoiding.",
        "**委婉语**用温和客气的短语代替刺耳、悲伤或直白的词：用 *passed away* 代替 *died*，用 *let go* 代替 *fired*。人们用委婉语有时出于体贴，有时在广告和公报里是为了淡化坏消息。把它翻译回直白英语，就能看清真相。\n\n> **注意。** 别被听起来好听的包装词（*budget-friendly*、*pre-owned*、*correctional facility*）迷惑——问问句子真正回避的是哪个直白词。",
      ],
      ["What does the euphemism in italics plainly mean?", "斜体的委婉语直白地说是什么意思？"],
      euphemismMeaning,
      (right) => [
        `*${euphemismByPlain(right)}* is a softer way of saying **${right}**.\n\n**Check.** Plug **${right}** directly into the sentence in place of *${euphemismByPlain(right)}*: the factual meaning stays the same, only the gentle cushion is removed.`,
        `*${euphemismByPlain(right)}* 是 **${right}** 的委婉说法。\n\n**检验。** 把 **${right}** 直接代回原句替换 *${euphemismByPlain(right)}*：事实意思分毫不差，只是拿掉了温和包装。`,
      ],
      [
        ["*{wrong}* is what a different euphemism stands for.", "*{wrong}* 是另一个委婉语所代替的意思。"],
        ["*{wrong}* is the plain meaning of another mild phrase, not this one.", "*{wrong}* 是另一个温和说法的直白意思，不是这一个的。"],
      ],
    ),
    choose(
      "euphemism-for-a-plain-word",
      ["The Euphemism for a Plain Word", "直白说法的委婉语"],
      [
        "To soften a blunt sentence without changing its factual meaning, spot the harsh word (*died*, *prison*, *used*) and replace it with the euphemism built for that exact word (*passed away*, *correctional facility*, *pre-owned*).\n\n> **Watch out.** Make sure the euphemism preserves the exact fact—picking a mild phrase for a different idea changes what the sentence says.",
        "要在不改变事实的前提下让句子更柔和，先找出刺耳的直白词（*died*、*prison*、*used*），再换成专门对应的委婉语（*passed away*、*correctional facility*、*pre-owned*）。\n\n> **注意。** 委婉语必须保留原句的准确事实——选错对应的温和说法会把意思改歪。",
      ],
      ["Which euphemism could soften this sentence?", "哪个委婉语能使这个句子更柔和？"],
      euphemismFor,
      (right) => [
        `**${right}** is the mild stand-in for *${plainOf(right)}*, softening the blunt wording while keeping the meaning intact.\n\n**Check.** Verify that *${plainOf(right)}* matches the exact harsh idea in the prompt—the other euphemisms soften completely different facts.`,
        `**${right}** 是 *${plainOf(right)}* 的温和替身，既柔化了直白措辞，又完整保留了原意。\n\n**检验。** 核对 *${plainOf(right)}* 正好对应题干中的直白表达——另外两个委婉语柔化的是完全不同的事实。`,
      ],
      [
        [
          "*{wrong}* softens a different word: it stands for something this sentence does not say.",
          "*{wrong}* 柔化的是另一个词：它代替的意思这个句子里没有。",
        ],
        [
          "*{wrong}* is a euphemism for something else, so it would change the meaning.",
          "*{wrong}* 是别的事情的委婉语，会改变句子的意思。",
        ],
      ],
    ),
  ],
});

/** wordStudyTopics7 are the topics of word study of grade 7. */
export const wordStudyTopics7: readonly TopicDef[] = [
  latin4,
  greek3,
  scienceSuffixes,
  adjectiveSuffixes,
  moreIdioms,
  latin5,
  greek4,
  euphemismTopic,
];
