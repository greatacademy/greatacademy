// Grade 12: word study: the last Latin and Greek roots of the native course.

import type { TopicDef } from "@ga/content";
import { partLines, parts } from "../grade-6/kit.ts";

const latin10 = parts({
  id: "latin-roots-10",
  title: ["Latin Roots 10", "拉丁词根 10"],
  summary: [
    "Ten more Latin roots: cord, gress, plic, volv, sid, sign, dorm, jud, nunc and brev.",
    "另外十个拉丁词根：cord、gress、plic、volv、sid、sign、dorm、jud、nunc 和 brev。",
  ],
  after: ["latin-roots-9"],
  kind: ["Latin root", "拉丁词根"],
  list: partLines(`
    cord|heart|心|cordial|warm and friendly, as if from the heart|concord|agreement and harmony, with hearts together|discord|disagreement, with hearts apart
    gress|step|步|digress|to step aside from the main subject|transgress|to step across a moral or legal line|regress|to step back to an earlier, worse state
    plic|fold|折叠|implicate|to show that someone is involved, folded into a matter|explicit|stated clearly, with nothing folded away|duplicity|deceit, a doubled way of dealing with people
    volv|roll|滚动|revolve|to roll or turn around a center|evolve|to develop gradually, unrolling over time|convoluted|so twisted and rolled together that it is hard to follow
    sid|sit or settle|坐，安定|preside|to sit in charge of a meeting or a court|subside|to settle down and become less strong|dissident|a person who sits apart and openly opposes those in power
    sign|mark|标记|signify|to be a mark or sign of something|insignia|a badge or mark that shows rank or membership|designate|to mark out someone or something for a purpose
    dorm|sleep|睡|dormant|asleep or inactive for a time|dormitory|a building where students sleep|dormancy|a state of rest in which growth stops for a time
    jud|judge|判断|judicious|showing good judgment|prejudice|a judgment made before knowing the facts|adjudicate|to judge a dispute officially
    nunc|declare|宣告|denounce|to declare publicly that something is wrong|renounce|to declare that you give something up|pronouncement|a formal public statement of a decision
    brev|short|短|brevity|shortness of time, or the use of few words|abbreviate|to make a word or phrase shorter|abridge|to shorten a book or speech while keeping its sense
  `),
  explanations: [
    [
      "Ten more Latin **roots**. *Cord* means heart, *gress* step, *plic* fold, *volv* roll, *sid* sit, *sign* mark, *dorm* sleep, *jud* judge, *nunc* declare and *brev* short. A *cordial* greeting comes from the heart; a *dormant* volcano is asleep; *brevity* is shortness. Knowing the root lets you guess the meaning of a word you have never seen.",
      "另外十个拉丁**词根**。*cord* 意为心，*gress* 步，*plic* 折叠，*volv* 滚动，*sid* 坐，*sign* 标记，*dorm* 睡，*jud* 判断，*nunc* 宣告，*brev* 短。*cordial* 的问候发自内心；*dormant* 的火山处于沉睡；*brevity* 是简短。知道词根，就能猜出没见过的词的意思。",
    ],
    [
      "Prefixes steer the root. With *cord*, *con-* (together) gives **concord** and *dis-* (apart) gives **discord**. With *gress*, *di-* (aside) gives **digress**, *trans-* (across) **transgress** and *re-* (back) **regress**. With *nunc*, *de-* (down) gives **denounce**, to speak against, and *re-* (back) gives **renounce**, to give back up. Read the prefix, then the root, and put them together.",
      "前缀决定词根的方向。与 *cord* 搭配，*con-*（一起）构成 **concord**，*dis-*（分开）构成 **discord**。与 *gress* 搭配，*di-*（偏离）构成 **digress**，*trans-*（越过）构成 **transgress**，*re-*（向后）构成 **regress**。与 *nunc* 搭配，*de-*（向下）构成 **denounce**，谴责；*re-*（返回）构成 **renounce**，放弃。先读前缀，再读词根，然后把意思合起来。",
    ],
  ],
});

const greek9 = parts({
  id: "greek-roots-9",
  title: ["Greek Roots 9", "希腊词根 9"],
  summary: [
    "Ten more Greek roots: ped, agog, tax, top, tom, zo, odont, phras, stas and orama.",
    "另外十个希腊词根：ped、agog、tax、top、tom、zo、odont、phras、stas 和 orama。",
  ],
  after: ["greek-roots-8"],
  kind: ["Greek root", "希腊词根"],
  list: partLines(`
    ped|child|儿童|pediatrician|a doctor who treats children|pedagogy|the method and practice of teaching, first the teaching of children|encyclopedia|a book of all-round knowledge, once the full education of a child
    agog|lead|引导|demagogue|a leader who wins people over by stirring their feelings and prejudices|pedagogue|a teacher, especially a strict one, first a leader of children|synagogue|a Jewish house of worship, where people are led together
    tax|arrange|排列|syntax|the arrangement of words in a sentence|taxonomy|a system for arranging living things or ideas into groups|taxidermy|the arranging of an animal's skin so that it looks alive
    top|place|地方|topography|the shape and features of an area of land|utopia|an imagined perfect society, literally no place|topical|about matters of interest in a certain place and time
    tom|cut|切|anatomy|the structure of a body, learned by cutting it open|atom|the smallest unit of an element, once thought impossible to cut|dichotomy|a division into two opposed parts
    zo|animal or life|动物，生命|zoology|the study of animals|protozoa|tiny living things of one cell, the first animals|zodiac|a circle of twelve star signs, most of them named after animals
    odont|tooth|牙齿|orthodontist|a dentist who straightens teeth|periodontal|around the teeth, having to do with the gums|mastodon|a large extinct animal like an elephant, named for the shape of its teeth
    phras|speak or tell|说|paraphrase|to say again in other words|phraseology|a particular way of choosing and putting words together|periphrasis|a roundabout way of saying something
    stas|standing|站立，停止|stasis|a state in which nothing moves or changes|homeostasis|the body's way of keeping its inside steady, standing the same|metastasis|the spread of a disease from one part of the body to another
    orama|view|景象|panorama|a wide view of a whole area|diorama|a model scene with figures, seen through a window|cyclorama|a large picture on a curved wall that surrounds the viewer
  `),
  explanations: [
    [
      "Ten more Greek **roots**. *Ped* means child, *agog* lead, *tax* arrange, *top* place, *tom* cut, *zo* animal, *odont* tooth, *phras* speak, *stas* standing and *orama* view. A *pediatrician* treats children; *topography* describes a place; *zoology* studies animals; a *panorama* is a view of everything.",
      "另外十个希腊**词根**。*ped* 意为儿童，*agog* 引导，*tax* 排列，*top* 地方，*tom* 切，*zo* 动物，*odont* 牙齿，*phras* 说，*stas* 站立，*orama* 景象。*pediatrician* 给儿童看病；*topography* 描述一个地方；*zoology* 研究动物；*panorama* 是全景。",
    ],
    [
      "Greek words are often built from two roots or a prefix and a root. *Dem* (people) and *agog* give **demagogue**, a misleader of the people. *Ou* (no) and *top* give **utopia**, a place that does not exist. *Dicho* (in two) and *tom* give **dichotomy**, a cut in two. *Ortho* (straight) and *odont* give **orthodontist**, a straightener of teeth. Split the word and read each part.",
      "希腊语词常由两个词根或一个前缀加一个词根构成。*dem*（人民）加 *agog* 构成 **demagogue**，煽动民众的人。*ou*（没有）加 *top* 构成 **utopia**，并不存在的地方。*dicho*（分成两半）加 *tom* 构成 **dichotomy**，一分为二。*ortho*（直）加 *odont* 构成 **orthodontist**，矫正牙齿的医生。把词拆开，逐个读出各部分。",
    ],
  ],
});

const latin11 = parts({
  id: "latin-roots-11",
  title: ["Latin Roots 11", "拉丁词根 11"],
  summary: [
    "Ten more Latin roots: am, ann, clin, doc, fin, flu, grav, hab, man and nav.",
    "另外十个拉丁词根：am、ann、clin、doc、fin、flu、grav、hab、man 和 nav。",
  ],
  after: ["latin-roots-10"],
  kind: ["Latin root", "拉丁词根"],
  list: partLines(`
    am|love|爱|amiable|friendly and pleasant, easy to like|amorous|showing or feeling romantic love|enamored|filled with love for someone or something
    ann|year|年|annual|happening once every year|anniversary|the date on which an event happened in an earlier year|perennial|lasting through many years
    clin|lean or bend|倾斜|incline|to lean toward a choice or a direction|decline|to bend down; to become less, or to refuse politely|recline|to lean back in a relaxed position
    doc|teach|教|docile|easy to teach or control; quiet and obedient|doctrine|a set of beliefs taught by a group|indoctrinate|to teach someone to accept beliefs without questioning them
    fin|end or limit|结束，界限|finite|having limits or an end|definitive|final and settling a question completely|confine|to keep within limits
    flu|flow|流|fluent|able to speak or write smoothly, so the words flow|affluent|rich, with money flowing in|superfluous|more than is needed, overflowing
    grav|heavy|重|gravity|the force that pulls things down; seriousness|aggravate|to make a problem heavier or worse|grave|serious and heavy with meaning
    hab|hold or have|拥有，持有|habitual|done so often that it is held as a habit|inhabit|to live in a place, holding it as a home|prohibit|to hold back or forbid by law
    man|hand|手|manual|done by hand; a book of instructions to hold in the hand|manuscript|a text written by hand|emancipate|to free, literally to take out of another's hand
    nav|ship|船|naval|having to do with a navy or warships|navigate|to steer a ship, or to find one's way|circumnavigate|to sail all the way around
  `),
  explanations: [
    [
      "Ten more Latin **roots**. *Am* means love, *ann* year, *clin* lean, *doc* teach, *fin* end, *flu* flow, *grav* heavy, *hab* hold, *man* hand and *nav* ship. An *amiable* person is easy to love; an *annual* event comes each year; *fluent* speech flows; a *manual* job is done by hand.",
      "另外十个拉丁**词根**。*am* 意为爱，*ann* 年，*clin* 倾斜，*doc* 教，*fin* 结束，*flu* 流，*grav* 重，*hab* 持有，*man* 手，*nav* 船。*amiable* 的人讨人喜爱；*annual* 的活动每年一次；*fluent* 的话语流畅；*manual* 的工作用手完成。",
    ],
    [
      "A root can hide inside a longer word. *Per-* (through) and *ann* give **perennial**, lasting through the years. *Super-* (over) and *flu* give **superfluous**, overflowing what is needed. *E-* (out) and *man* give **emancipate**, to take out of someone's hand. *Circum-* (around) and *nav* give **circumnavigate**. Find the root, then let the prefix tell you which way it turns.",
      "词根可能藏在较长的词里。*per-*（贯穿）加 *ann* 构成 **perennial**，常年的。*super-*（超过）加 *flu* 构成 **superfluous**，多余的。*e-*（出）加 *man* 构成 **emancipate**，从他人手中解放出来。*circum-*（环绕）加 *nav* 构成 **circumnavigate**，环航。先找出词根，再看前缀把意思引向哪里。",
    ],
  ],
});

const greek10 = parts({
  id: "greek-roots-10",
  title: ["Greek Roots 10", "希腊词根 10"],
  summary: [
    "Ten more Greek roots: acro, cardi, cephal, cycl, derm, gastr, iso, macro, neur and pod.",
    "另外十个希腊词根：acro、cardi、cephal、cycl、derm、gastr、iso、macro、neur 和 pod。",
  ],
  after: ["greek-roots-9"],
  kind: ["Greek root", "希腊词根"],
  list: partLines(`
    acro|high or tip|高，顶端|acrobat|a performer who does high, daring feats of balance|acrophobia|a fear of high places|acropolis|the high fortified part of an ancient Greek city
    cardi|heart|心脏|cardiac|having to do with the heart|cardiologist|a doctor who treats the heart|tachycardia|a heartbeat that is too fast
    cephal|head|头|encephalitis|swelling of the brain inside the head|cephalic|having to do with the head|hydrocephalus|a build-up of fluid inside the skull
    cycl|circle or wheel|圆，轮|cyclone|a storm of winds turning in a circle|encyclical|a letter sent around to every church|recycle|to send back around to be used again
    derm|skin|皮肤|dermatologist|a doctor who treats the skin|epidermis|the outer layer of the skin|hypodermic|under the skin, as a needle that injects medicine
    gastr|stomach|胃|gastric|having to do with the stomach|gastronomy|the art of choosing, cooking and eating good food|gastritis|swelling and pain of the stomach lining
    iso|equal|相等|isosceles|having two sides of equal length|isotherm|a line on a map joining places of equal temperature|isometric|having equal measurements, or exercise against equal force
    macro|large|大|macrocosm|the whole of a large, complex structure such as the universe|macroeconomics|the study of a whole economy|macron|a long mark over a vowel to show it is long
    neur|nerve|神经|neurology|the study of the nerves and their diseases|neuron|a cell that carries signals in the nerves and brain|neuralgia|sharp pain along a nerve
    pod|foot|足|podium|a raised platform to stand on|tripod|a stand with three feet|arthropod|an animal with jointed legs, such as an insect
  `),
  explanations: [
    [
      "Ten more Greek **roots**. *Acro* means high, *cardi* heart, *cephal* head, *cycl* circle, *derm* skin, *gastr* stomach, *iso* equal, *macro* large, *neur* nerve and *pod* foot. A *cardiologist* treats the heart; a *dermatologist* the skin; a *tripod* stands on three feet.",
      "另外十个希腊**词根**。*acro* 意为高，*cardi* 心脏，*cephal* 头，*cycl* 圆，*derm* 皮肤，*gastr* 胃，*iso* 相等，*macro* 大，*neur* 神经，*pod* 足。*cardiologist* 治心脏；*dermatologist* 治皮肤；*tripod* 用三只脚站立。",
    ],
    [
      "Medical words are built like chains. *Epi-* (upon) and *derm* give **epidermis**, the skin on top. *Hypo-* (under) and *derm* give **hypodermic**, under the skin. *-itis* (swelling) joins a root for a part of the body: **gastritis**, **encephalitis**. *-algia* (pain) gives **neuralgia**, nerve pain. Read each link in turn.",
      "医学词汇像链条一样构成。*epi-*（在上）加 *derm* 构成 **epidermis**，表皮。*hypo-*（在下）加 *derm* 构成 **hypodermic**，皮下的。*-itis*（炎症）接在表示身体部位的词根后：**gastritis**、**encephalitis**。*-algia*（疼痛）构成 **neuralgia**，神经痛。逐个读出每一环。",
    ],
  ],
});

const latin12 = parts({
  id: "latin-roots-12",
  title: ["Latin Roots 12", "拉丁词根 12"],
  summary: [
    "Ten more Latin roots: mar, matr, med, migr, noc, patr, plen, pon, punct and rect.",
    "另外十个拉丁词根：mar、matr、med、migr、noc、patr、plen、pon、punct 和 rect。",
  ],
  after: ["latin-roots-11"],
  kind: ["Latin root", "拉丁词根"],
  list: partLines(`
    mar|sea|海|maritime|having to do with the sea and ships|submarine|a ship that travels under the sea|marina|a harbor for small boats
    matr|mother|母亲|maternal|having to do with a mother|matriarch|a woman who heads a family or group|matrimony|marriage, the state of becoming a mother and wife
    med|middle|中间|mediate|to stand in the middle and help two sides agree|medieval|of the Middle Ages|intermediary|a person who acts between two others
    migr|move from one place to another|迁移|migrate|to move from one region to another|emigrant|a person who moves out of their country|immigrant|a person who moves into a new country
    noc|harm|伤害|innocuous|not harmful or offensive|noxious|harmful or poisonous|innocent|not guilty of doing harm
    patr|father|父亲|paternal|having to do with a father|patriarch|a man who heads a family or group|patrimony|property passed down from one's father
    plen|full|满|plenary|attended by all members; complete|replenish|to fill up again|plenitude|a full or plentiful amount
    pon|put or place|放置|postpone|to put off until later|proponent|a person who puts forward an idea|exponent|a person who sets out and supports an idea
    punct|point or prick|点，刺|punctual|on time, to the point|puncture|a small hole made by a sharp point|punctuate|to put marks in writing, or to interrupt at points
    rect|straight or right|直，正|rectify|to put right|rectangle|a shape with four right angles|erect|standing straight up
  `),
  explanations: [
    [
      "Ten more Latin **roots**. *Mar* means sea, *matr* mother, *med* middle, *migr* move, *noc* harm, *patr* father, *plen* full, *pon* put, *punct* point and *rect* straight. *Maritime* law is the law of the sea; a *paternal* uncle is a father's brother; *innocuous* words do no harm; to *rectify* is to put right.",
      "另外十个拉丁**词根**。*mar* 意为海，*matr* 母亲，*med* 中间，*migr* 迁移，*noc* 伤害，*patr* 父亲，*plen* 满，*pon* 放置，*punct* 点，*rect* 直。*maritime* 法是海洋法；*paternal* 的叔伯是父亲的兄弟；*innocuous* 的话没有害处；*rectify* 是纠正。",
    ],
    [
      "Pairs of roots make pairs of words. *Matr* and *patr* give **maternal** and **paternal**, **matriarch** and **patriarch**. With *migr*, *e-* (out) gives **emigrant**, one who leaves, and *im-* (in) gives **immigrant**, one who arrives. With *noc*, *in-* (not) gives **innocuous** and **innocent**, doing no harm. Learn the pair together.",
      "成对的词根构成成对的词。*matr* 和 *patr* 构成 **maternal** 和 **paternal**、**matriarch** 和 **patriarch**。与 *migr* 搭配，*e-*（出）构成 **emigrant**，移出者；*im-*（入）构成 **immigrant**，移入者。与 *noc* 搭配，*in-*（不）构成 **innocuous** 和 **innocent**，无害的。成对地学。",
    ],
  ],
});

const greek11 = parts({
  id: "greek-roots-11",
  title: ["Greek Roots 11", "希腊词根 11"],
  summary: [
    "Ten more Greek roots: gon, hier, mis, opt, oste, psych, soma, techn, tox and typ.",
    "另外十个希腊词根：gon、hier、mis、opt、oste、psych、soma、techn、tox 和 typ。",
  ],
  after: ["greek-roots-10"],
  kind: ["Greek root", "希腊词根"],
  list: partLines(`
    gon|angle|角|polygon|a flat shape with many angles|hexagon|a shape with six angles|diagonal|a line from one corner to the opposite angle
    hier|sacred|神圣|hierarchy|a system of ranks, first of priests|hieroglyph|a picture used as writing, once sacred carving|hieratic|having to do with priests; very formal
    mis|hate|憎恨|misanthrope|a person who hates people in general|misogyny|hatred of women|misology|a hatred of reasoning and argument
    opt|eye or sight|眼，视觉|optician|a person who makes or sells glasses|optical|having to do with sight or light|synoptic|giving a view of the whole at once
    oste|bone|骨|osteoporosis|a disease that makes bones weak and thin|osteopath|a person who treats illness by moving bones and muscles|osteology|the study of bones
    psych|mind or soul|心灵|psychology|the study of the mind|psychiatrist|a doctor who treats mental illness|psychosomatic|caused by the mind, though felt in the body
    soma|body|身体|somatic|having to do with the body rather than the mind|chromosome|a body in a cell that carries genes|somatotype|the type of a person's body build
    techn|art or skill|技艺|technique|a skillful way of doing something|technology|tools and machines made by applying skill and science|polytechnic|a college teaching many arts and sciences
    tox|poison|毒|toxic|poisonous|antitoxin|a substance that works against a poison|toxicology|the study of poisons
    typ|stamp or model|印记，模型|archetype|an original model of which others are copies|prototype|the first model of a new machine|stereotype|a fixed idea of what a kind of person is like
  `),
  explanations: [
    [
      "Ten more Greek **roots**. *Gon* means angle, *hier* sacred, *mis* hate, *opt* eye, *oste* bone, *psych* mind, *soma* body, *techn* skill, *tox* poison and *typ* model. A *hexagon* has six angles; a *misanthrope* hates people; *toxic* waste is poisonous; a *prototype* is the first model.",
      "另外十个希腊**词根**。*gon* 意为角，*hier* 神圣，*mis* 憎恨，*opt* 眼，*oste* 骨，*psych* 心灵，*soma* 身体，*techn* 技艺，*tox* 毒，*typ* 模型。*hexagon* 有六个角；*misanthrope* 憎恨人类；*toxic* 的废物有毒；*prototype* 是最初的模型。",
    ],
    [
      "Two Greek roots often join in one word. *Psych* and *soma* give **psychosomatic**, from mind to body. *Mis* and *anthrop* (human) give **misanthrope**. *Arch* (first) and *typ* give **archetype**, the first model; *stereo* (solid, fixed) and *typ* give **stereotype**. Split the word where the roots meet.",
      "两个希腊词根常常合成一个词。*psych* 加 *soma* 构成 **psychosomatic**，由心及身的。*mis* 加 *anthrop*（人）构成 **misanthrope**。*arch*（最初）加 *typ* 构成 **archetype**，原型；*stereo*（固定）加 *typ* 构成 **stereotype**，刻板印象。在词根相接处把词拆开。",
    ],
  ],
});

const latin13 = parts({
  id: "latin-roots-13",
  title: ["Latin Roots 13", "拉丁词根 13"],
  summary: [
    "Ten more Latin roots: sci, sol, son, spir, string, sumpt, tact, ten, turb and urb.",
    "另外十个拉丁词根：sci、sol、son、spir、string、sumpt、tact、ten、turb 和 urb。",
  ],
  after: ["latin-roots-12"],
  kind: ["Latin root", "拉丁词根"],
  list: partLines(`
    sci|know|知道|omniscient|knowing everything|conscience|the inner sense of right and wrong, a knowing with oneself|prescient|knowing about things before they happen
    sol|alone|单独|solitude|the state of being alone|desolate|empty and lonely|soliloquy|a speech made alone on stage
    son|sound|声音|sonic|having to do with sound|dissonance|a harsh mix of sounds that do not agree|resonate|to sound again, to echo
    spir|breathe|呼吸|inspire|to breathe life or ideas into someone|expire|to breathe out for the last time; to come to an end|respiration|the act of breathing
    string|bind or draw tight|捆紧|stringent|strict and binding|constrict|to draw tight or squeeze|astringent|drawing the skin or tissues tight
    sumpt|take|拿，取|assumption|something taken as true without proof|presumptuous|taking too much on oneself|consumption|the taking in or using up of something
    tact|touch|触摸|tactile|having to do with the sense of touch|intact|untouched and whole|contact|touching or meeting
    ten|hold|持有|tenacious|holding firmly|tenant|a person who holds and lives in a rented place|tenure|the holding of a job or property
    turb|disturb or whirl|搅动|turbulent|full of violent, disturbed movement|perturb|to disturb greatly|turbine|a machine turned by a whirling stream of water or air
    urb|city|城市|urban|having to do with a city|suburb|an area just outside a city|urbane|polite and refined, as in the manners of a city
  `),
  explanations: [
    [
      "Ten more Latin **roots**. *Sci* means know, *sol* alone, *son* sound, *spir* breathe, *string* bind, *sumpt* take, *tact* touch, *ten* hold, *turb* disturb and *urb* city. An *omniscient* narrator knows everything; *solitude* is being alone; a *tenacious* dog holds on; *urban* life is city life.",
      "另外十个拉丁**词根**。*sci* 意为知道，*sol* 单独，*son* 声音，*spir* 呼吸，*string* 捆紧，*sumpt* 拿，*tact* 触摸，*ten* 持有，*turb* 搅动，*urb* 城市。*omniscient* 的叙述者无所不知；*solitude* 是独处；*tenacious* 的狗紧咬不放；*urban* 生活是城市生活。",
    ],
    [
      "The same root can take on a figurative sense. *Spir*, to breathe, gives **inspire**, to breathe ideas in, and **expire**, to breathe one's last, and so to end. *Urb*, city, gives **urbane**, with the polish of city manners. *Tact*, touch, gives **intact**, untouched. Start from the physical meaning, then follow it to the figure.",
      "同一个词根可以带上比喻义。*spir*（呼吸）构成 **inspire**，把想法“吸入”，以及 **expire**，呼出最后一口气，进而表示结束。*urb*（城市）构成 **urbane**，带有城市礼仪的文雅。*tact*（触摸）构成 **intact**，未被触碰的。从具体意义出发，再引申到比喻义。",
    ],
  ],
});

/** wordStudyTopics12 are the word study topics of grade 12. */
export const wordStudyTopics12: readonly TopicDef[] = [latin10, greek9, latin11, greek10, latin12, greek11, latin13];
