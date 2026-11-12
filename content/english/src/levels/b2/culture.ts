// B2, unit 7: Culture, Identity and Globalization. Identity, globalization, language, traditions, heritage, belief,
// stereotypes, tourism, food and taste, describing people, and countries together; cleft sentences; the proposal.

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator, type WritingItem } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { judgedTopic } from "../a2/kit.ts";
import { interleave, vocabularyTopic, word } from "../words.ts";

const identity = vocabularyTopic({
  id: "b2-words-identity",
  title: t("Identity", "身份认同"),
  summary: t(
    "Ethnic groups and ethnicity; ancestry and origins; belonging and a homeland; assimilating and integration; multicultural and cosmopolitan cities; indigenous peoples; the diaspora.",
    "族群和族裔；祖先和出身；归属感和故乡；同化和融入；多元文化的和国际化的城市；原住民；海外侨民。",
  ),
  prerequisites: ["b1-words-culture"],
  words: [
    word(
      "ethnic",
      "connected with a group of people who share a culture, a language or a history",
      "民族的；族裔的",
      "The city has many {ethnic} restaurants.|indigenous ancestral | Several {ethnic} groups live in the region.|cosmopolitan homeland | {Ethnic} minorities make up ten percent of the population.|Cosmopolitan Ancestral",
      "ethic exotic",
      "ethnicity",
    ),
    word(
      "ethnicity ethnicities",
      "belonging to an ethnic group",
      "族裔；种族背景",
      "People of every {ethnicity} live in the city.|diaspora integration | The form asks about your {ethnicity}.|diaspora integration | Students of many {ethnicities} attend the school.|diasporas homelands",
      "electricity ethics",
      "ethnic",
    ),
    word(
      "ancestry",
      "the people in your family who lived long before you",
      "祖先；血统",
      "She has Irish {ancestry}.|integration diaspora | Many Americans trace their {ancestry} to Europe.|integration diaspora | He is proud of his Chinese {ancestry}.|integration homeland",
      "ancestor anatomy",
      "origin",
    ),
    word(
      "origin origins",
      "the place or the moment where something begins; where a person's family comes from",
      "起源；出身",
      "The word has Latin {origins}.|homelands diasporas | What is the {origin} of the festival?|integration diaspora | She is of Korean {origin}.|integration diaspora",
      "original organ",
      "ancestry",
    ),
    word(
      "belong belongs belonged belonging",
      "to feel happy and accepted in a place or a group; to be owned by someone",
      "属于；有归属感",
      "After ten years, I finally feel I {belong} here.|assimilate integrate | This bag {belongs} to my sister.|assimilates integrates | Clubs give young people a sense of {belonging}.|assimilating integrating",
      "prolong befall",
    ),
    word(
      "homeland homelands",
      "the country where a person or their family comes from",
      "故乡；祖国",
      "He returned to his {homeland} after the war.|diaspora integration | Refugees dream of going back to their {homeland}.|diaspora ancestry | Many left their {homelands} in search of work.|diasporas ancestries",
      "homemade hinterland",
      "origin",
    ),
    word(
      "assimilate assimilates assimilated assimilating",
      "to become part of a new country or group, taking on its culture; to learn and understand something",
      "同化；吸收",
      "Immigrants often {assimilate} within two generations.|belong originate | The children {assimilated} quickly at their new school.|belonged originated | It takes time to {assimilate} new information.|belong originate",
      "simulate associate",
      "integration",
    ),
    word(
      "integration",
      "the process of becoming a full part of a group or a society",
      "融入；整合",
      "Language classes help the {integration} of newcomers.|ancestry diaspora | The {integration} of refugees takes time.|ancestry ethnicity | Racial {integration} in schools began in the 1950s.|ancestry diaspora",
      "integrity interrogation",
      "assimilate",
    ),
    word(
      "multicultural",
      "including people of many different cultures",
      "多元文化的",
      "London is a {multicultural} city.|indigenous ethnic | We live in a {multicultural} society.|indigenous ancestral | The school has a {multicultural} festival every spring.|indigenous homeland",
      "multicolored agricultural",
      "cosmopolitan",
    ),
    word(
      "cosmopolitan",
      "full of people and ideas from many countries; having experience of many countries",
      "国际化的；见多识广的",
      "Shanghai is a {cosmopolitan} city.|indigenous ethnic | She has a {cosmopolitan} outlook after years abroad.|indigenous ethnic | The bar attracts a {cosmopolitan} crowd.|indigenous diaspora",
      "metropolitan cosmetic",
      "multicultural",
    ),
    word(
      "indigenous",
      "belonging to a place from the earliest times, not brought from somewhere else",
      "本土的；原住的",
      "The {indigenous} people of Australia have lived there for 60,000 years.|cosmopolitan multicultural | The kangaroo is {indigenous} to Australia.|cosmopolitan multicultural | They are fighting for {indigenous} land rights.|cosmopolitan multicultural",
      "ingenious indignant",
    ),
    word(
      "diaspora",
      "people who have spread from their original country to live in many others",
      "海外侨民；离散族群",
      "The Chinese {diaspora} is found all over the world.|integration ancestry | The Irish {diaspora} celebrates St. Patrick's Day.|integration ancestry | Members of the {diaspora} send money home.|integration ancestry",
      "diaphragm diarrhea",
    ),
  ],
});

const global = vocabularyTopic({
  id: "b2-words-globalization",
  title: t("Globalization", "全球化"),
  summary: t(
    "Globalization and worldwide trade; an interconnected world; outsourcing; homogeneous and diverse cultures; dominant powers and dominating markets; cross-cultural, cultural and intercultural contact; borderless markets.",
    "全球化和全球贸易；相互联系的世界；外包；同质的和多样的文化；占主导地位的强国和主导市场；跨文化的、文化的和不同文化间的交流；无国界的市场。",
  ),
  prerequisites: ["b1-words-nations"],
  words: [
    word(
      "globalization",
      "the process by which businesses and cultures around the world become connected",
      "全球化",
      "{Globalization} has made cheap goods available everywhere.|Outsourcing Borderless | Critics say {globalization} destroys local cultures.|outsourcing borderless | The internet has speeded up {globalization}.|outsourcing borderless",
      "generalization localization",
    ),
    word(
      "worldwide",
      "in every part of the world",
      "全世界的；遍及全球的",
      "The film was a {worldwide} success.|homogeneous dominant | The company employs 50,000 people {worldwide}.|homogeneous intercultural | There is a {worldwide} shortage of nurses.|homogeneous intercultural",
      "worldly widespread",
      "borderless",
    ),
    word(
      "interconnected",
      "connected with each other, so that each affects the others",
      "相互联系的",
      "The world's economies are deeply {interconnected}.|homogeneous dominant | These problems are {interconnected}: you can't solve one without the others.|homogeneous dominant | We live in an {interconnected} world.|homogeneous dominant",
      "interested intercepted",
    ),
    word(
      "outsource outsources outsourced outsourcing",
      "to pay another company, often abroad, to do work for you",
      "外包",
      "The company {outsources} its customer service to India.|dominates globalizes | Many jobs have been {outsourced} to cheaper countries.|dominated globalized | {Outsourcing} cut the firm's costs.|Dominating Borderless",
      "outsmart resource",
    ),
    word(
      "homogeneous",
      "made of parts or people that are all the same",
      "同质的；单一的",
      "Japan is a fairly {homogeneous} society.|interconnected cross-cultural | The group is too {homogeneous}: everyone has the same background.|interconnected borderless | Some fear that world culture is becoming {homogeneous}.|interconnected borderless",
      "homogenized heterogeneous",
      "diverse",
    ),
    word(
      "diverse",
      "very different from each other; including many different types",
      "多样的；各不相同的",
      "The city has a {diverse} population.|homogeneous dominant | Her interests are very {diverse}.|homogeneous dominant | The team is {diverse}, with members from twelve countries.|homogeneous dominant",
      "divers divert",
      "homogeneous",
    ),
    word(
      "dominant",
      "more powerful, important or noticeable than others",
      "占主导地位的；主要的",
      "English is the {dominant} language of the internet.|homogeneous borderless | The company has a {dominant} position in the market.|homogeneous borderless | Fear was the {dominant} feeling in the city.|homogeneous borderless",
      "dormant dominion",
      "dominate",
    ),
    word(
      "dominate dominates dominated dominating",
      "to have power or control over others; to be the most important or noticeable feature",
      "支配；主导",
      "A few companies {dominate} the market.|outsource interconnect | The castle {dominates} the town.|outsources interconnects | The election {dominated} the news.|outsourced interconnected",
      "denominate nominate",
      "dominant",
    ),
    word(
      "cross-cultural",
      "involving two or more different cultures",
      "跨文化的",
      "The course teaches {cross-cultural} communication.|homogeneous dominant | {Cross-cultural} marriages are more common than before.|Homogeneous Dominant | We study {cross-cultural} differences in body language.|homogeneous dominant",
      "cross-country agricultural",
      "intercultural",
    ),
    word(
      "cultural",
      "connected with the customs, art and ideas of a society",
      "文化的",
      "The city is the {cultural} center of the country.|homogeneous borderless | There are big {cultural} differences between the two countries.|homogeneous borderless | The museum organizes {cultural} events for children.|homogeneous borderless",
      "cultured cultivate",
    ),
    word(
      "intercultural",
      "happening between people of different cultures",
      "不同文化间的",
      "The exchange encourages {intercultural} dialogue.|homogeneous dominant | {Intercultural} skills are valuable for diplomats.|Homogeneous Dominant | She researches {intercultural} friendships.|homogeneous dominant",
      "interconnected international",
      "cross-cultural",
    ),
    word(
      "borderless",
      "not limited by the borders between countries",
      "无国界的",
      "The internet has created a {borderless} market.|homogeneous dominant | Some dream of a {borderless} Europe.|homogeneous dominant | Viruses are {borderless}: they spread everywhere.|homogeneous dominant",
      "bordered boundless",
      "worldwide",
    ),
  ],
});

const language = vocabularyTopic({
  id: "b2-words-language",
  title: t("Language", "语言"),
  summary: t(
    "Linguistic skills; idioms, slang, jargon and proverbs; fluency, vocabulary, pronunciation and grammar; translations and interpreters; multilingual people.",
    "语言能力；习语、俚语、行话和谚语；流利、词汇、发音和语法；翻译和口译员；会说多种语言的人。",
  ),
  prerequisites: ["b1-words-communicating"],
  words: [
    word(
      "linguistic",
      "connected with language or with the study of language",
      "语言的；语言学的",
      "Children have amazing {linguistic} abilities.|proverb jargon | The country is a {linguistic} puzzle, with forty languages.|fluency jargon | She studies the {linguistic} development of babies.|fluency jargon",
      "linguist logistic",
    ),
    word(
      "idiom idioms",
      "a group of words whose meaning is different from the meanings of its single words",
      "习语；成语",
      '"Break a leg" is an {idiom} that means "good luck".|interpreter pronunciation | English has thousands of {idioms}.|interpreters pronunciations | It\'s hard to translate {idioms} word for word.|interpreters fluency',
      "idiot idiocy",
      "proverb",
    ),
    word(
      "slang",
      "very informal words, often used by a particular group of people",
      "俚语",
      '"Cool" is {slang} for "very good".|pronunciation grammar | Teenagers use a lot of {slang}.|pronunciation fluency | Avoid {slang} in an essay.|pronunciation fluency',
      "slant sling",
      "jargon",
    ),
    word(
      "jargon",
      "special words used by a particular group, which are hard for others to understand",
      "行话；术语",
      "The report is full of legal {jargon}.|fluency pronunciation | Doctors should avoid medical {jargon} with patients.|fluency pronunciation | The manual is written in technical {jargon}.|fluency pronunciation",
      "dragon jaguar",
      "slang",
    ),
    word(
      "proverb proverbs",
      "a short, well-known saying that gives advice or says something true",
      "谚语",
      'As the {proverb} says, "Practice makes perfect."|interpreter fluency | Every culture has its own {proverbs}.|interpreters fluencies | My grandmother loved Chinese {proverbs}.|interpreters translations',
      "proverbial provide",
      "idiom",
    ),
    word(
      "fluency",
      "the ability to speak or write a language easily and well",
      "流利；流畅",
      "She speaks French with great {fluency}.|jargon idiom | {Fluency} in English is required for the job.|Jargon Slang | Reading aloud improves {fluency}.|jargon idioms",
      "frequency affluence",
    ),
    word(
      "vocabulary vocabularies",
      "all the words that a person knows or that a language has",
      "词汇；词汇量",
      "Reading widely helps you build your {vocabulary}.|jargon interpreter | Children's {vocabularies} grow very quickly.|interpreters idioms | The word is not part of my {vocabulary}.|interpreter fluency",
      "vocalist vocation",
    ),
    word(
      "pronunciation",
      "the way a word is said",
      "发音",
      "Her {pronunciation} is almost perfect.|jargon slang | English {pronunciation} doesn't always follow the spelling.|jargon slang | Listen and repeat to improve your {pronunciation}.|jargon slang",
      "pronouncement punctuation",
    ),
    word(
      "grammar",
      "the rules for putting words together in a language",
      "语法",
      "Check your spelling and {grammar}.|fluency slang | Chinese {grammar} has no verb tenses.|slang fluency | She teaches English {grammar}.|fluency jargon",
      "glamour grammy",
    ),
    word(
      "translation translations",
      "words that have been changed from one language into another",
      "翻译；译文",
      "I read the novel in {translation}.|pronunciation fluency | The website offers {translations} in ten languages.|pronunciations fluencies | Something is always lost in {translation}.|pronunciation fluency",
      "transition transaction",
      "interpreter",
    ),
    word(
      "interpreter interpreters",
      "a person who changes what someone says into another language as they speak",
      "口译员",
      "The president spoke through an {interpreter}.|idiom proverb | The court provided an {interpreter} for the witness.|idiom proverb | {Interpreters} must think very quickly.|Idioms Proverbs",
      "interrupter interpretation",
      "translation",
    ),
    word(
      "multilingual",
      "able to speak several languages; using several languages",
      "会说多种语言的；多语的",
      "Switzerland is a {multilingual} country.|linguistic fluent | The hotel has {multilingual} staff.|linguistic grammar | {Multilingual} children often switch between languages.|Linguistic Fluency",
      "multiple bilingually",
      "linguistic",
    ),
  ],
});

const traditions = vocabularyTopic({
  id: "b2-words-traditions",
  title: t("Traditions", "传统"),
  summary: t(
    "Rituals and folklore; myths and mythology; superstitions and being superstitious; taboos and etiquette; celebrations and commemorating the past; ancestral and sacred places.",
    "仪式和民间传说；神话和神话体系；迷信和迷信的人；禁忌和礼仪；庆祝活动和纪念过去；祖先的和神圣的地方。",
  ),
  prerequisites: ["a2-words-festivals"],
  words: [
    word(
      "ritual rituals",
      "a set of actions that is always done in the same way, often as part of a ceremony",
      "仪式；惯例",
      "Tea is an important {ritual} in Japan.|folklore mythology | The wedding includes many old {rituals}.|taboos etiquettes | My morning {ritual} is coffee and a newspaper.|taboo etiquette",
      "virtual mutual",
      "celebration",
    ),
    word(
      "folklore",
      "the traditional stories and beliefs of a group of people",
      "民间传说；民俗",
      "In Irish {folklore}, fairies live under the hills.|etiquette taboo | The dragon appears often in Chinese {folklore}.|etiquette taboo | She collects the songs and {folklore} of her village.|etiquette taboos",
      "forklift foreclose",
      "mythology",
    ),
    word(
      "myth myths",
      "an ancient story about gods or heroes; a belief that many people have but that is not true",
      "神话；谬论",
      "The Greek {myths} are full of gods and monsters.|taboos rituals | It's a {myth} that goldfish only remember three seconds.|taboo ritual | The {myth} explains how the world began.|taboo etiquette",
      "math moth",
      "mythology",
    ),
    word(
      "mythology",
      "all the myths of a culture",
      "神话（总称）",
      "Thor is a god in Norse {mythology}.|etiquette superstition | She is studying Greek {mythology}.|etiquette superstition | Dragons are common in Chinese {mythology}.|etiquette taboo",
      "methodology biology",
      "folklore",
    ),
    word(
      "superstition superstitions",
      "a belief that some objects or actions bring good or bad luck, without a reason",
      "迷信",
      "It's a {superstition} that black cats bring bad luck.|etiquette celebration | Many hotels have no room 13 because of {superstition}.|etiquette celebration | Old {superstitions} still affect what people do.|etiquettes celebrations",
      "supervision superstar",
      "superstitious",
    ),
    word(
      "superstitious",
      "believing in superstitions",
      "迷信的",
      "Sailors are often {superstitious}.|sacred ancestral | I'm not {superstitious}, but I never walk under ladders.|sacred ancestral | {Superstitious} people avoid the number four in China.|Sacred Ancestral",
      "suspicious supervisory",
      "superstition",
    ),
    word(
      "taboo taboos",
      "something people do not do or talk about because it is offensive or embarrassing",
      "禁忌",
      "Death is a {taboo} subject in many families.|ritual folklore | Eating pork is {taboo} in some religions.|ritual folklore | Talking about money is still a {taboo} at work.|myth ritual",
      "tattoo bamboo",
    ),
    word(
      "etiquette",
      "the rules of polite behavior in a society or a group",
      "礼仪；礼节",
      "Business {etiquette} differs from country to country.|folklore mythology | It is bad {etiquette} to arrive late.|folklore mythology | Table {etiquette} in Japan has many rules.|folklore mythology",
      "ticket epithet",
      "taboo",
    ),
    word(
      "celebration celebrations",
      "a special event to show that an occasion is important",
      "庆祝活动",
      "The {celebrations} lasted all night.|superstitions mythologies | We had a small {celebration} for her birthday.|superstition mythology | New Year {celebrations} begin at midnight.|superstitions mythologies",
      "cerebration calibration",
      "ritual",
    ),
    word(
      "commemorate commemorates commemorated commemorating",
      "to remember an important person or event with a ceremony or a monument",
      "纪念",
      "The statue {commemorates} the soldiers who died.|prays worships | A holiday {commemorates} the end of the war.|worships prays | We {commemorated} the 100th anniversary with a concert.|worshiped prayed",
      "commiserate accommodate",
      "celebration",
    ),
    word(
      "ancestral",
      "connected with the people in your family who lived long ago",
      "祖先的；祖传的",
      "They returned to their {ancestral} village.|superstitious sacred | The family still owns the {ancestral} home.|superstitious etiquette | People visit {ancestral} graves at the Qingming Festival.|superstitious etiquette",
      "ancestry astral",
    ),
    word(
      "sacred",
      "holy; very important and respected",
      "神圣的",
      "The river is {sacred} to Hindus.|superstitious ancestral | Cows are {sacred} in India.|superstitious ancestral | Family time is {sacred} to her.|superstitious ancestral",
      "scared secret",
    ),
  ],
});

const heritage = vocabularyTopic({
  id: "b2-words-heritage",
  title: t("Heritage", "文化遗产"),
  summary: t(
    "Preserving the past and preservation; artifacts, archives and curators; restoration; authentic objects and replicas; craftsmen and craftsmanship; exhibiting a collection.",
    "保护过去和保护工作；文物、档案和策展人；修复；真品和复制品；工匠和手艺；展出藏品。",
  ),
  prerequisites: ["b2-words-history"],
  words: [
    word(
      "preserve preserves preserved preserving",
      "to keep something in its original state; to stop food from going bad",
      "保护；保存",
      "We must {preserve} the old town for future generations.|exhibit archive | The body was {preserved} in the ice for 5,000 years.|exhibited archived | Salt is used to {preserve} fish.|exhibit archive",
      "persevere present",
      "preservation",
    ),
    word(
      "preservation",
      "the act of keeping something in its original state",
      "保护；保存",
      "The {preservation} of old buildings is expensive.|replica craftsmanship | The paintings are in a good state of {preservation}.|craftsmanship replica | She works for a wildlife {preservation} group.|replica curator",
      "presentation reservation",
      "restoration",
    ),
    word(
      "artifact artifacts",
      "an object made by people long ago, especially one of historical interest",
      "（古）文物；人工制品",
      "The museum holds {artifacts} from ancient Egypt.|curators restorations | Each {artifact} has a label explaining its history.|curator restoration | The divers found Roman {artifacts} on the seabed.|curators restorations",
      "artificial artistic",
      "replica",
    ),
    word(
      "archive archives",
      "a collection of historical records; the place where they are kept",
      "档案；档案馆",
      "The letters are kept in the national {archives}.|replicas curators | She spent months in the city {archive}.|replica curator | The newspaper's online {archive} goes back to 1851.|replica curator",
      "achieve arcade",
      "collection",
    ),
    word(
      "curator curators",
      "a person in charge of a museum's collection or an exhibition",
      "（博物馆）馆长；策展人",
      "The {curator} chose the paintings for the exhibition.|archive replica | {Curators} must decide what to show and what to store.|Archives Replicas | She is the chief {curator} of the National Gallery.|archive replica",
      "curate creator",
      "craftsman",
    ),
    word(
      "restoration",
      "the work of repairing an old building or object so that it looks as it did",
      "修复；恢复",
      "The {restoration} of the cathedral took twenty years.|replica curator | The palace is closed for {restoration}.|replica craftsmen | The painting needs careful {restoration}.|replica curator",
      "restaurant registration",
      "preservation",
    ),
    word(
      "authentic",
      "real, not a copy; true to the original",
      "真正的；正宗的",
      "Experts say the painting is {authentic}.|replica archive | The restaurant serves {authentic} Italian food.|replica archive | Is this an {authentic} Roman coin?|replica archive",
      "authority athletic",
    ),
    word(
      "replica replicas",
      "an exact copy of something",
      "复制品",
      "This is a {replica}: the original statue is in Rome.|curator craftsman | The shop sells {replicas} of famous paintings.|curators craftsmen | They built a full-size {replica} of the ship.|curator craftsman",
      "replay relic",
      "artifact",
    ),
    word(
      "craftsman craftsmen",
      "a person who makes things skillfully with their hands",
      "工匠；手艺人",
      "The table was made by a local {craftsman}.|curator archive | Skilled {craftsmen} restored the old roof.|curators archives | He is a master {craftsman}.|curator archive",
      "draftsman crafty",
      "curator",
    ),
    word(
      "craftsmanship",
      "the skill with which something is made",
      "手艺；技艺",
      "The {craftsmanship} of the old furniture is excellent.|preservation restoration | You can see the {craftsmanship} in every detail.|preservation restoration | Modern furniture often lacks {craftsmanship}.|preservation restoration",
      "championship craftiness",
    ),
    word(
      "exhibit exhibits exhibited exhibiting",
      "to show objects in public, for example in a museum; an object shown",
      "展出；展品",
      "The gallery {exhibits} young artists' work.|preserves archives | Her photos were {exhibited} in Paris.|preserved archived | Do not touch the {exhibits}.|archives curators",
      "exhibition inhibit",
      "collection",
    ),
    word(
      "collection collections",
      "a group of objects of the same kind brought together",
      "收藏品；收集",
      "The museum has a fine {collection} of Chinese pottery.|restoration preservation | He has a huge stamp {collection}.|restoration preservation | The library's {collections} are open to the public.|restorations preservations",
      "correction connection",
      "archive",
    ),
  ],
});

const belief = vocabularyTopic({
  id: "b2-words-belief",
  title: t("Belief", "信仰"),
  summary: t(
    "Faith; spiritual and religious life; ideologies and convictions; worshiping and praying; prayers; atheists and secular states; tolerant and devout people.",
    "信仰；精神的和宗教的生活；意识形态和信念；礼拜和祈祷；祷告；无神论者和世俗国家；宽容的和虔诚的人。",
  ),
  prerequisites: ["b1-words-culture"],
  words: [
    word(
      "faith",
      "strong belief in God or a religion; trust in someone or something",
      "信仰；信任",
      "Her {faith} helped her through the illness.|ideology atheist | People of every {faith} are welcome.|prayer atheist | I have {faith} in your ability.|ideology prayer",
      "fate faint",
      "conviction",
    ),
    word(
      "spiritual",
      "connected with the human spirit rather than the body; connected with religion",
      "精神的；心灵的",
      "Yoga has a {spiritual} side as well as a physical one.|secular tolerant | Many people visit the temple for {spiritual} reasons.|secular tolerant | He is a {spiritual} person, though he doesn't go to church.|secular atheist",
      "spirited ritual",
      "religious",
    ),
    word(
      "religious",
      "connected with religion; believing strongly in a religion",
      "宗教的；虔诚的",
      "Christmas is a {religious} holiday.|secular atheist | My parents are very {religious}.|secular atheist | The country has freedom of {religious} belief.|secular atheist",
      "rebellious relevant",
      "devout",
    ),
    word(
      "ideology ideologies",
      "a set of political or other ideas that a group believes in",
      "意识形态；思想体系",
      "The party has no clear {ideology}.|prayer atheist | Communism and capitalism are opposing {ideologies}.|prayers atheists | People were punished for their {ideology}.|prayer worship",
      "idealogy geology",
      "conviction",
    ),
    word(
      "conviction convictions",
      "a strong belief or opinion; a decision in court that someone is guilty",
      "坚定的信念；定罪",
      "She spoke with great {conviction}.|ideology prayer | He has strong political {convictions}.|prayers atheists | It is my firm {conviction} that education should be free.|prayer atheist",
      "convection connection",
      "faith",
    ),
    word(
      "worship worships worshiped worshiping",
      "to show respect and love for a god, for example by praying; to love someone very much",
      "崇拜；做礼拜",
      "The ancient Egyptians {worshiped} many gods.|prayed devoted | People come here to {worship} every Friday.|devote tolerate | He {worships} his older brother.|prays secular",
      "warship worsen",
      "pray",
    ),
    word(
      "pray prays prayed praying",
      "to speak to God; to hope very much for something",
      "祈祷；祈求",
      "She {prays} every morning.|tolerates atheists | We {prayed} for rain.|worshiped tolerated | I'm {praying} that the exam is easy.|worshiping tolerating",
      "prey spray",
      "worship",
    ),
    word(
      "prayer prayers",
      "words that you say to God; the act of praying",
      "祷告；祈祷",
      "They said a {prayer} before dinner.|faith conviction | The church holds evening {prayers}.|convictions ideologies | Our {prayers} were answered: he survived.|convictions ideologies",
      "player preyer",
      "faith",
    ),
    word(
      "atheist atheists",
      "a person who believes that there is no God",
      "无神论者",
      "He is an {atheist}, but he loves church music.|ideology conviction | {Atheists} do not believe in God.|Ideologies Prayers | She became an {atheist} as a student.|ideology prayer",
      "athlete theist",
    ),
    word(
      "secular",
      "not connected with religion",
      "世俗的；非宗教的",
      "France is a {secular} state.|devout spiritual | The school is {secular}: there are no religious lessons.|devout spiritual | {Secular} music became popular in the Middle Ages.|Devout Spiritual",
      "circular singular",
      "religious",
    ),
    word(
      "tolerant",
      "willing to accept beliefs and behavior different from your own",
      "宽容的",
      "The city is known for being {tolerant} of different religions.|devout secular | We should be more {tolerant} of other people's opinions.|devout secular | A {tolerant} society accepts all faiths.|devout secular",
      "tolerable talent",
    ),
    word(
      "devout",
      "believing strongly in a religion and following its rules",
      "虔诚的",
      "She is a {devout} Muslim who prays five times a day.|secular tolerant | His {devout} parents took him to church every Sunday.|secular tolerant | The town's people are {devout} Catholics.|secular atheist",
      "devote devour",
      "religious",
    ),
  ],
});

const stereotypes = vocabularyTopic({
  id: "b2-words-stereotypes",
  title: t("Stereotypes", "刻板印象"),
  summary: t(
    "Stereotypes and stereotypical views; prejudiced and narrow-minded people; open-minded ones; ignorance and ignorant remarks; misunderstandings and misconceptions; judgmental attitudes; empathy and empathizing.",
    "刻板印象和刻板的看法；有偏见的和心胸狭隘的人；思想开明的人；无知和无知的言论；误会和误解；爱评判的态度；同理心和感同身受。",
  ),
  prerequisites: ["b1-words-getting-on"],
  words: [
    word(
      "stereotype stereotypes",
      "a fixed idea about what a type of person is like, which is often not true",
      "刻板印象；成见",
      "The {stereotype} that the British only drink tea is wrong.|empathy ignorance | The film is full of national {stereotypes}.|misunderstandings ignorances | She doesn't fit the {stereotype} of a scientist.|empathy ignorance",
      "stereo telescope",
      "misconception",
    ),
    word(
      "stereotypical",
      "fitting a fixed idea of what a type of person or thing is like",
      "刻板的；模式化的",
      "The film shows a {stereotypical} Italian family, loud and loving.|open-minded empathy | His views on women are very {stereotypical}.|open-minded empathy | The characters are {stereotypical} and dull.|open-minded empathetic",
      "stereophonic theatrical",
      "prejudiced",
    ),
    word(
      "prejudiced",
      "having an unfair opinion of a group, not based on reason or experience",
      "有偏见的",
      "He is {prejudiced} against people from the city.|open-minded empathy | Some employers are {prejudiced} against older workers.|open-minded empathy | A {prejudiced} judge cannot be fair.|open-minded empathy",
      "prejudge precluded",
      "narrow-minded",
    ),
    word(
      "narrow-minded",
      "not willing to accept ideas or ways of life different from your own",
      "心胸狭隘的",
      "His {narrow-minded} views shocked his foreign colleagues.|open-minded empathy | Don't be so {narrow-minded}!|open-minded empathy | Village life can be {narrow-minded}.|ignorance empathy",
      "narrow-gauge absent-minded",
      "prejudiced",
    ),
    word(
      "open-minded",
      "willing to consider new ideas and opinions",
      "思想开明的",
      "Travel has made her more {open-minded}.|narrow-minded prejudiced | Try to be {open-minded} about the new plan.|narrow-minded prejudiced | We need {open-minded} people for the job.|narrow-minded prejudiced",
      "open-ended absent-minded",
      "empathy",
    ),
    word(
      "ignorance",
      "lack of knowledge or information",
      "无知；不了解",
      "Racism often comes from {ignorance}.|empathy misconception | Forgive my {ignorance}, but where is Bhutan?|empathy misunderstanding | {Ignorance} of the law is no excuse.|Empathy Stereotype",
      "arrogance elegance",
      "ignorant",
    ),
    word(
      "ignorant",
      "not knowing about things you should know about",
      "无知的；不了解的",
      "I'm quite {ignorant} about modern art.|empathy judgmental | It was an {ignorant} remark.|ignorance empathy | Many people are {ignorant} of their rights.|judgmental open-minded",
      "ignore immigrant",
      "ignorance",
    ),
    word(
      "misunderstanding misunderstandings",
      "a failure to understand something correctly, often causing a disagreement",
      "误会；误解",
      "There must be some {misunderstanding}: I ordered fish, not chicken.|empathy ignorance | The argument started with a small {misunderstanding}.|empathy stereotype | Cultural {misunderstandings} are common when you move abroad.|empathies ignorances",
      "understanding mishandling",
      "misconception",
    ),
    word(
      "misconception misconceptions",
      "a wrong idea that many people believe",
      "错误观念；误解",
      "It is a common {misconception} that bats are blind.|empathy ignorance | The article corrects some {misconceptions} about the disease.|empathies ignorances | There are many {misconceptions} about life in China.|empathies ignorances",
      "misconduct conception",
      "stereotype",
    ),
    word(
      "judgmental",
      "too quick to criticize other people",
      "爱评判的；武断的",
      "Try not to be {judgmental} about other people's choices.|open-minded empathize | My aunt is very {judgmental}.|empathize ignorance | Teenagers need adults who listen and are not {judgmental}.|empathize ignorance",
      "judicial sentimental",
      "prejudiced",
    ),
    word(
      "empathy",
      "the ability to understand and share another person's feelings",
      "同理心；共情",
      "Good doctors show {empathy} towards their patients.|ignorance stereotype | Reading novels can build {empathy}.|ignorance stereotypes | She felt deep {empathy} for the refugees.|ignorance stereotype",
      "apathy sympathy",
      "empathize",
    ),
    word(
      "empathize empathizes empathized empathizing",
      "to understand and share another person's feelings",
      "感同身受；产生共鸣",
      "I can {empathize} with your situation: I lost my job too.|stereotype misunderstand | Teachers need to {empathize} with their pupils.|stereotype misunderstand | She {empathizes} with people who feel lonely.|stereotypes misunderstands",
      "emphasize sympathize",
      "empathy",
    ),
  ],
});

const tourism = vocabularyTopic({
  id: "b2-words-tourism",
  title: t("Tourism", "旅游业"),
  summary: t(
    "Tourism, ecotourism and overtourism; attractions, excursions and expeditions; voyages and pilgrimages; hospitality and resorts; trekking and backpackers.",
    "旅游业、生态旅游和过度旅游；景点、短途游览和探险；航行和朝圣；接待服务和度假村；徒步旅行和背包客。",
  ),
  prerequisites: ["b1-words-travel-2"],
  words: [
    word(
      "tourism",
      "the business of providing services for people on holiday",
      "旅游业",
      "{Tourism} is the island's main industry.|Pilgrimage Expedition | The government wants to promote {tourism} in the north.|pilgrimage backpacker | Mass {tourism} has changed the coast.|pilgrimage expedition",
      "terrorism truism",
      "ecotourism",
    ),
    word(
      "ecotourism",
      "tourism to natural areas that tries to protect the environment and help local people",
      "生态旅游",
      "{Ecotourism} brings money to the rainforest without cutting it down.|Overtourism Hospitality | Costa Rica is famous for {ecotourism}.|overtourism pilgrimage | {Ecotourism} lodges use solar power.|Overtourism Pilgrimage",
      "ecosystem economy",
      "tourism",
    ),
    word(
      "overtourism",
      "too many tourists visiting a place, so that it is damaged",
      "过度旅游",
      "Venice suffers from {overtourism}.|ecotourism hospitality | {Overtourism} pushes up rents for local people.|Ecotourism Hospitality | Some cities limit cruise ships to fight {overtourism}.|ecotourism hospitality",
      "overtime overtaking",
      "ecotourism",
    ),
    word(
      "attraction attractions",
      "a place or an event that people visit for enjoyment",
      "景点；吸引力",
      "The Great Wall is China's most famous {attraction}.|expedition pilgrimage | The city has many tourist {attractions}.|expeditions voyages | The main {attraction} of the festival is the fireworks.|expedition voyage",
      "distraction attention",
    ),
    word(
      "excursion excursions",
      "a short trip, usually made by a group for pleasure",
      "短途旅行；远足",
      "We went on an {excursion} to the islands.|resort attraction | The hotel organizes {excursions} to the old town.|resorts backpackers | A half-day {excursion} costs 40 dollars.|resort hospitality",
      "excuse incursion",
      "expedition",
    ),
    word(
      "expedition expeditions",
      "a long, organized journey, especially to a dangerous or unknown place",
      "探险；远征",
      "The {expedition} reached the South Pole in January.|resort hospitality | She led a scientific {expedition} to the Amazon.|resort hospitality | Climbing {expeditions} leave rubbish on Everest.|resorts hospitalities",
      "expectation exhibition",
      "voyage",
    ),
    word(
      "voyage voyages",
      "a long journey, especially by sea or in space",
      "（尤指海上或太空的）航行",
      "The {voyage} across the Atlantic took six weeks.|resort hospitality | Columbus made four {voyages} to the Americas.|resorts backpackers | The spacecraft is on a long {voyage} to Mars.|resort hospitality",
      "voyeur village",
      "expedition",
    ),
    word(
      "pilgrimage pilgrimages",
      "a journey to a holy place for religious reasons; a visit to a place that is important to you",
      "朝圣",
      "Millions make the {pilgrimage} to Mecca every year.|resort hospitality | Fans make a {pilgrimage} to the singer's home town.|resort hospitality | Medieval {pilgrimages} could take years.|resorts hospitalities",
      "pillage village",
    ),
    word(
      "hospitality",
      "being friendly and generous to guests; the business of hotels and restaurants",
      "好客；酒店餐饮业",
      "Thank you for your {hospitality}.|pilgrimage overtourism | The region is famous for its {hospitality}.|pilgrimage expedition | She works in the {hospitality} industry.|pilgrimage expedition",
      "hostility hospital",
    ),
    word(
      "resort resorts",
      "a place where many people go on holiday",
      "度假胜地",
      "We stayed at a ski {resort} in the Alps.|voyage pilgrimage | The beach {resorts} are full in August.|voyages pilgrimages | The {resort} has three pools.|voyage pilgrimage",
      "report resent",
    ),
    word(
      "trek treks trekked trekking",
      "to walk a long distance, often over mountains",
      "长途跋涉；徒步旅行",
      "We {trekked} through the jungle for five days.|resorted excursioned | {Trekking} in Nepal is popular.|Resorting Voyaging | They {trek} ten kilometers a day.|resort voyage",
      "track trick",
    ),
    word(
      "backpacker backpackers",
      "a person who travels cheaply, carrying their things in a backpack",
      "背包客",
      "The hostel is full of young {backpackers}.|resorts attractions | {Backpackers} often stay in cheap hostels.|Resorts Attractions | As a {backpacker}, she traveled through India for a year.|resort attraction",
      "backpack bookmaker",
    ),
  ],
});

const food = vocabularyTopic({
  id: "b2-words-food-2",
  title: t("Food and Taste", "食物与口味"),
  summary: t(
    "Gourmet and culinary traditions; staples and delicacies; savory and bland dishes; aromas and textures; garnishing; fermenting and marinating; nutritious food.",
    "美食和烹饪传统；主食和珍馐；咸香的和清淡的菜；香味和口感；装饰菜肴；发酵和腌制；有营养的食物。",
  ),
  prerequisites: ["b1-words-food-culture"],
  words: [
    word(
      "gourmet",
      "connected with very good, expensive food; a person who knows a lot about good food",
      "美食的；美食家",
      "The hotel has a {gourmet} restaurant.|bland staple | She is a {gourmet} who loves French cheese.|staple texture | They sell {gourmet} chocolates.|bland staple",
      "gourd garment",
      "culinary",
    ),
    word(
      "culinary",
      "connected with cooking",
      "烹饪的",
      "He studied at a {culinary} school in Paris.|nutritious bland | The city is famous for its {culinary} traditions.|bland nutritious | Her {culinary} skills are amazing.|bland nutritious",
      "culvert canary",
      "gourmet",
    ),
    word(
      "staple staples",
      "a basic food that people eat often; something used regularly",
      "主食；主要产品",
      "Rice is the {staple} food in much of Asia.|delicacy garnish | Bread and potatoes are {staples} of the German diet.|delicacies garnishes | Pasta is a {staple} in our kitchen.|garnish texture",
      "stable steeple",
      "delicacy",
    ),
    word(
      "delicacy delicacies",
      "a rare or expensive food that is thought to be very good",
      "珍馐；佳肴",
      "Snails are a {delicacy} in France.|staple garnish | Bird's nest soup is a Chinese {delicacy}.|texture aroma | The market sells local {delicacies}.|textures aromas",
      "delicate decency",
      "staple",
    ),
    word(
      "savory",
      "salty or spicy rather than sweet",
      "咸的；咸香的",
      "Do you prefer sweet or {savory} snacks?|bland nutritious | We had {savory} pancakes with cheese.|bland culinary | The cake is sweet, but the pie is {savory}.|bland nutritious",
      "savvy savior",
      "bland",
    ),
    word(
      "bland",
      "without a strong taste",
      "清淡的；无味的",
      "The soup was rather {bland}: it needed salt.|savory culinary | Hospital food is often {bland}.|savory culinary | He prefers {bland} food because of his stomach.|culinary gourmet",
      "blend brand",
      "savory",
    ),
    word(
      "aroma aromas",
      "a pleasant smell, especially of food or drink",
      "香味；芳香",
      "The {aroma} of fresh coffee filled the kitchen.|texture staple | I love the {aroma} of baking bread.|texture staple | The spices give off a rich {aroma}.|texture staple",
      "coma arena",
      "texture",
    ),
    word(
      "texture textures",
      "the way something feels when you touch it or eat it",
      "质地；口感",
      "The cake has a soft, light {texture}.|aroma staple | I don't like the {texture} of raw fish.|aroma staple | The fabric has a rough {texture}.|aroma staple",
      "textile mixture",
      "aroma",
    ),
    word(
      "garnish garnishes garnished garnishing",
      "to decorate food with a small amount of another food; the food used to do this",
      "装饰（菜肴）；配菜",
      "{Garnish} the soup with fresh herbs.|Ferment Marinate | The fish was {garnished} with lemon.|fermented marinated | Add a {garnish} of parsley.|ferment marinate",
      "garnet varnish",
    ),
    word(
      "ferment ferments fermented fermenting",
      "to change chemically through the action of bacteria or yeast, as when sugar becomes alcohol",
      "发酵",
      "Kimchi is cabbage that has been {fermented}.|garnished marinated | Grapes {ferment} to make wine.|garnish marinate | The dough is left to {ferment} overnight.|garnish savor",
      "foment fervent",
      "marinate",
    ),
    word(
      "marinate marinates marinated marinating",
      "to leave meat or fish in a sauce before cooking it, to add flavor",
      "腌制；浸泡",
      "{Marinate} the chicken in soy sauce for an hour.|Ferment Garnish | The beef was {marinated} in wine overnight.|fermented garnished | Leave the fish to {marinate} before grilling it.|garnish ferment",
      "marine marina",
      "ferment",
    ),
    word(
      "nutritious",
      "containing many of the substances that your body needs to be healthy",
      "有营养的",
      "Beans are cheap and {nutritious}.|gourmet culinary | Children need {nutritious} school meals.|bland gourmet | A {nutritious} breakfast gives you energy.|bland culinary",
      "nutritionist ambitious",
    ),
  ],
});

const people = vocabularyTopic({
  id: "b2-words-personality-3",
  title: t("Character and Temperament", "性格与气质"),
  summary: t(
    "Charismatic and eccentric people; introverted and extroverted ones; assertive and cautious, impulsive and witty; naive and pragmatic, idealistic and temperamental.",
    "有魅力的和古怪的人；内向的和外向的人；果断自信的和谨慎的人，冲动的和机智风趣的人；天真的和务实的人，理想主义的和喜怒无常的人。",
  ),
  prerequisites: ["b1-words-personality"],
  words: [
    word(
      "charismatic",
      "having a strong personal charm that makes people follow or admire you",
      "有魅力的；有感召力的",
      "She is a {charismatic} leader whom people love to follow.|introverted impulsive | The {charismatic} singer held the crowd's attention.|cautious naive | He is handsome and {charismatic}: everyone wants to be near him.|cautious introverted",
      "characteristic charitable",
    ),
    word(
      "eccentric",
      "behaving in a strange and unusual way",
      "古怪的；反常的",
      "My {eccentric} uncle wears a top hat to the supermarket.|pragmatic cautious | The old professor was famous for his {eccentric} habits.|pragmatic cautious | She is a little {eccentric}, but very kind.|pragmatic charismatic",
      "concentric electric",
    ),
    word(
      "introverted",
      "quiet and shy, preferring to spend time alone",
      "内向的",
      "He is {introverted} and prefers books to parties.|extroverted assertive | {Introverted} children may need time to speak in class.|Extroverted Charismatic | She is too {introverted} to enjoy big parties.|extroverted charismatic",
      "introduced inverted",
      "extroverted",
    ),
    word(
      "extroverted",
      "lively and confident, enjoying being with other people",
      "外向的",
      "She is {extroverted} and loves meeting new people.|introverted cautious | {Extroverted} people often enjoy working in sales.|Introverted Cautious | He is the most {extroverted} person in the family: he talks to everyone.|introverted cautious",
      "extracted extorted",
      "introverted",
    ),
    word(
      "assertive",
      "saying confidently what you think or want",
      "坚定自信的；果断的",
      "You need to be more {assertive} and ask for a pay rise.|naive cautious | She is polite but {assertive}: she always says what she wants.|naive introverted | {Assertive} people say no without feeling guilty.|Naive Introverted",
      "assorted abrasive",
    ),
    word(
      "cautious",
      "careful to avoid risks",
      "谨慎的",
      "Be {cautious} when you drive in the snow.|impulsive witty | Investors are {cautious} about the market.|impulsive witty | He is a {cautious} driver.|impulsive witty",
      "conscious curious",
      "pragmatic",
    ),
    word(
      "impulsive",
      "doing things suddenly without thinking about them first",
      "冲动的",
      "It was an {impulsive} decision to buy the car.|cautious pragmatic | He is {impulsive} and often regrets what he says.|cautious pragmatic | Don't be so {impulsive}: think first.|cautious pragmatic",
      "compulsive impressive",
      "temperamental",
    ),
    word(
      "witty",
      "clever and funny with words",
      "机智风趣的",
      "Her speech was {witty} and short.|naive cautious | He is famous for his {witty} remarks.|naive cautious | Oscar Wilde was a {witty} writer.|naive cautious",
      "wealthy wiry",
    ),
    word(
      "naive",
      "believing too easily that people are honest and things are simple, because of a lack of experience",
      "天真的；幼稚的",
      "It was {naive} of me to trust him.|witty assertive | She is young and a little {naive}.|witty assertive | They have a {naive} view of politics.|witty assertive",
      "native navy",
      "idealistic",
    ),
    word(
      "pragmatic",
      "dealing with problems in a practical, sensible way",
      "务实的；实用主义的",
      "We need a {pragmatic} solution, not a perfect one.|eccentric temperamental | She is a {pragmatic} manager.|eccentric idealistic | The government took a {pragmatic} approach.|eccentric temperamental",
      "dramatic pragmatism",
      "cautious",
    ),
    word(
      "idealistic",
      "believing that a perfect world is possible, even when this is not practical",
      "理想主义的",
      "As a student, I was very {idealistic}.|pragmatic cautious | The plan is too {idealistic} to work.|pragmatic cautious | {Idealistic} young volunteers came to help.|Pragmatic Cautious",
      "realistic idealized",
      "naive",
    ),
    word(
      "temperamental",
      "having moods that change quickly and often",
      "喜怒无常的；性情急躁的",
      "The {temperamental} chef shouted at his staff.|cautious pragmatic | Our old car is a bit {temperamental}: sometimes it won't start.|cautious pragmatic | Artists are often described as {temperamental}.|cautious pragmatic",
      "temperature sentimental",
      "impulsive",
    ),
  ],
});

const diplomacy = vocabularyTopic({
  id: "b2-words-diplomacy",
  title: t("Countries Together", "国家之间"),
  summary: t(
    "Diplomacy, diplomats and diplomatic answers; embassies and ambassadors; sanctions and alliances; sovereignty and territory; bilateral talks; cooperation and cooperating.",
    "外交、外交官和圆滑得体的回答；大使馆和大使；制裁和联盟；主权和领土；双边会谈；合作。",
  ),
  prerequisites: ["b2-words-politics"],
  words: [
    word(
      "diplomacy",
      "managing relations between countries; skill in dealing with people without upsetting them",
      "外交；交际手腕",
      "The crisis was solved through {diplomacy}, not war.|territory sovereignty | She handled the angry customer with great {diplomacy}.|sovereignty territory | International {diplomacy} is slow work.|territory sanction",
      "democracy diploma",
      "cooperation",
    ),
    word(
      "diplomat diplomats",
      "a person whose job is to represent their country in another country",
      "外交官",
      "The {diplomat} has lived in five countries.|territory alliance | Two {diplomats} were sent home.|territories alliances | She trained as a {diplomat}.|territory sanction",
      "diploma democrat",
      "ambassador",
    ),
    word(
      "diplomatic",
      "connected with diplomacy; careful not to upset people",
      "外交的；圆滑得体的",
      "The two countries cut off {diplomatic} relations.|sovereign territorial | Give a {diplomatic} answer: don't say the food was awful.|bilateral territorial | He is always {diplomatic} in meetings.|bilateral territorial",
      "democratic dramatic",
      "bilateral",
    ),
    word(
      "embassy embassies",
      "the building where an ambassador and their staff work",
      "大使馆",
      "You can get a visa at the {embassy}.|alliance sanction | Protesters gathered outside the {embassy}.|alliance sanction | Several countries closed their {embassies}.|alliances sanctions",
      "embrace ember",
    ),
    word(
      "ambassador ambassadors",
      "the most important diplomat sent by a country to another country",
      "大使",
      "She is the French {ambassador} to China.|territory alliance | The {ambassador} met the prime minister.|territory alliance | He was appointed {ambassador} to Brazil.|territory sanction",
      "embassy commander",
      "diplomat",
    ),
    word(
      "sanction sanctions",
      "an official order that limits trade with a country, as a punishment",
      "制裁",
      "The UN placed {sanctions} on the country.|alliances embassies | Economic {sanctions} hurt ordinary people most.|Alliances Embassies | The {sanctions} were lifted after the elections.|alliances embassies",
      "sanctuary sanitation",
      "alliance",
    ),
    word(
      "alliance alliances",
      "an agreement between countries or groups to work together",
      "联盟；同盟",
      "NATO is a military {alliance}.|sanction embassy | The two parties formed an {alliance}.|embassy sanction | The war broke old {alliances}.|sanctions embassies",
      "appliance allowance",
      "cooperation",
    ),
    word(
      "sovereignty",
      "the power of a country to rule itself",
      "主权",
      "The country fought to protect its {sovereignty}.|cooperation diplomacy | Both nations claim {sovereignty} over the islands.|cooperation diplomacy | National {sovereignty} limits what the UN can do.|cooperation diplomacy",
      "severity society",
      "territory",
    ),
    word(
      "territory territories",
      "land that belongs to a country; an area someone thinks of as their own",
      "领土；地盘",
      "The army entered enemy {territory}.|diplomacy cooperation | The islands are a French {territory}.|diplomacy embassy | Cats defend their {territory}.|diplomacy embassy",
      "terrify dormitory",
      "sovereignty",
    ),
    word(
      "bilateral",
      "involving two countries or groups",
      "双边的",
      "The two countries signed a {bilateral} trade agreement.|sovereign territorial | {Bilateral} talks will begin next week.|Sovereign Territorial | Relations improved after {bilateral} meetings.|sovereign territorial",
      "lateral bilingual",
      "diplomatic",
    ),
    word(
      "cooperation",
      "working together to achieve something",
      "合作",
      "Thank you for your {cooperation}.|sovereignty territory | International {cooperation} is needed to fight crime.|sovereignty territory | The project is a {cooperation} between two universities.|sovereignty territory",
      "corporation operation",
      "diplomacy",
    ),
    word(
      "cooperate cooperates cooperated cooperating",
      "to work together with others to achieve something",
      "合作；配合",
      "The two countries {cooperate} on climate research.|sanction dominate | The witness refused to {cooperate} with the police.|sanction dominate | Everyone {cooperated}, so we finished early.|sanctioned dominated",
      "corporate operate",
      "cooperation",
    ),
  ],
});

// Cleft sentences.

/** Role is whether the part in focus is the subject or the object of the plain sentence. */
type Role = "subject" | "object";

/**
 * itClefts are a plain sentence, the part to put in focus, is or was, the rest of the sentence after that, the rest
 * with a pronoun wrongly repeating the focus, the focus's role, and whether the focus is a person.
 */
const handItClefts: readonly (readonly [string, string, "is" | "was", string, string, Role, boolean])[] = [
  ["The food surprised me most.", "the food", "was", "surprised me most", "it surprised me most", "subject", false],
  ["I miss the language most.", "the language", "is", "I miss most", "I miss it most", "object", false],
  ["My grandmother taught me to cook.", "my grandmother", "was", "taught me to cook", "she taught me to cook", "subject", true],
  ["We visited Kyoto first.", "Kyoto", "was", "we visited first", "we visited it first", "object", false],
  ["The noise kept us awake.", "the noise", "was", "kept us awake", "it kept us awake", "subject", false],
  ["She wants a quiet life.", "a quiet life", "is", "she wants", "she wants it", "object", false],
  ["Your brother broke the window.", "your brother", "was", "broke the window", "he broke the window", "subject", true],
  ["I lost my passport.", "my passport", "was", "I lost", "I lost it", "object", false],
  ["The weather ruined our holiday.", "the weather", "was", "ruined our holiday", "it ruined our holiday", "subject", false],
  ["They admire his honesty.", "his honesty", "is", "they admire", "they admire it", "object", false],
  [
    "Lack of sleep causes most of these accidents.",
    "lack of sleep",
    "is",
    "causes most of these accidents",
    "it causes most of these accidents",
    "subject",
    false,
  ],
  ["He remembers the smell of the market.", "the smell of the market", "is", "he remembers", "he remembers it", "object", false],
  ["Tourists keep the town alive.", "tourists", "is", "keep the town alive", "they keep the town alive", "subject", true],
  ["I met your sister at the party.", "your sister", "was", "I met at the party", "I met her at the party", "object", true],
  ["The manager made the final decision.", "the manager", "was", "made the final decision", "she made the final decision", "subject", true],
  ["We need more time.", "more time", "is", "we need", "we need it", "object", false],
  ["Her smile made me fall in love.", "her smile", "was", "made me fall in love", "it made me fall in love", "subject", false],
  [
    "The students found the grammar difficult.",
    "the grammar",
    "was",
    "the students found difficult",
    "the students found it difficult",
    "object",
    false,
  ],
  ["Teachers deserve the credit.", "teachers", "is", "deserve the credit", "they deserve the credit", "subject", true],
  [
    "My parents value education above everything.",
    "education",
    "is",
    "my parents value above everything",
    "my parents value it above everything",
    "object",
    false,
  ],
  ["The music at the festival impressed me.", "the music at the festival", "was", "impressed me", "it impressed me", "subject", false],
  ["I bought the red dress in the end.", "the red dress", "was", "I bought in the end", "I bought it in the end", "object", false],
  ["Rising prices worry people most.", "rising prices", "is", "worry people most", "they worry people most", "subject", false],
  ["Tourists love the old harbor.", "the old harbor", "is", "tourists love", "tourists love it", "object", false],
  [
    "The local people made the trip special.",
    "the local people",
    "was",
    "made the trip special",
    "they made the trip special",
    "subject",
    true,
  ],
  ["She called the doctor.", "the doctor", "was", "she called", "she called him", "object", true],
  ["Mia found the lost dog.", "Mia", "was", "found the lost dog", "she found the lost dog", "subject", true],
  ["I trust my best friend most.", "my best friend", "is", "I trust most", "I trust her most", "object", true],
  ["Social media spreads these rumors.", "social media", "is", "spreads these rumors", "it spreads these rumors", "subject", false],
  [
    "We celebrate the Lunar New Year most of all.",
    "the Lunar New Year",
    "is",
    "we celebrate most of all",
    "we celebrate it most of all",
    "object",
    false,
  ],
  [
    "The guide told us the story of the castle.",
    "the guide",
    "was",
    "told us the story of the castle",
    "he told us the story of the castle",
    "subject",
    true,
  ],
  ["He forgot her birthday.", "her birthday", "was", "he forgot", "he forgot it", "object", false],
];

/** whatClefts are a plain sentence, the clause after what, is or was, and the part in focus. */
const handWhatClefts: readonly (readonly [string, string, "is" | "was", string])[] = [
  ["The food surprised me.", "surprised me", "was", "the food"],
  ["I need a long holiday.", "I need", "is", "a long holiday"],
  ["She loves the old music.", "she loves", "is", "the old music"],
  ["The ending annoyed me.", "annoyed me", "was", "the ending"],
  ["We want an honest answer.", "we want", "is", "an honest answer"],
  ["I enjoyed the street food most.", "I enjoyed most", "was", "the street food"],
  ["He fears loneliness.", "he fears", "is", "loneliness"],
  ["The silence frightened the children.", "frightened the children", "was", "the silence"],
  ["They miss their home town.", "they miss", "is", "their home town"],
  ["Kindness matters most.", "matters most", "is", "kindness"],
  ["I remember her laugh.", "I remember", "is", "her laugh"],
  ["The price shocked us.", "shocked us", "was", "the price"],
  ["The city needs more green space.", "the city needs", "is", "more green space"],
  ["I admire his patience.", "I admire", "is", "his patience"],
  ["Her accent surprised everyone.", "surprised everyone", "was", "her accent"],
  ["The students want more feedback.", "the students want", "is", "more feedback"],
  ["I can't stand the noise.", "I can't stand", "is", "the noise"],
  ["The view impressed us most.", "impressed us most", "was", "the view"],
  ["She values her freedom.", "she values", "is", "her freedom"],
  ["The traffic makes me angry.", "makes me angry", "is", "the traffic"],
  ["We found the history fascinating.", "we found fascinating", "was", "the history"],
  ["The rain spoiled the wedding.", "spoiled the wedding", "was", "the rain"],
  ["I really need a cup of coffee.", "I really need", "is", "a cup of coffee"],
  ["The festival celebrates the harvest.", "the festival celebrates", "is", "the harvest"],
  ["Young people want job security.", "young people want", "is", "job security"],
  ["The guide explained the ritual.", "the guide explained", "was", "the ritual"],
  ["His rudeness upset me.", "upset me", "was", "his rudeness"],
  ["The tourists photographed the temple.", "the tourists photographed", "was", "the temple"],
  ["I love the night market most.", "I love most", "is", "the night market"],
  ["Good teachers inspire curiosity.", "good teachers inspire", "is", "curiosity"],
  ["The smell of the spices reminds me of home.", "reminds me of home", "is", "the smell of the spices"],
  ["The lack of rain worries the farmers.", "worries the farmers", "is", "the lack of rain"],
];

/** cleftPeople are the subjects of the generated cleft sentences. */
const cleftPeople = ["Anna", "Tom", "my brother", "our teacher", "the children", "the visitors"] as const;

/** itCleftActs are a past verb and its object, a thing, for the generated it-clefts. */
const itCleftActs: readonly (readonly [string, string])[] = [
  ["chose", "the blue car"],
  ["painted", "the kitchen"],
  ["broke", "the old vase"],
  ["cooked", "the fish"],
  ["fixed", "the radio"],
  ["sold", "the piano"],
  ["found", "the map"],
  ["cleaned", "the garage"],
  ["wrote", "the poem"],
  ["opened", "the window"],
  ["forgot", "the cake"],
  ["photographed", "the bridge"],
];

/** whatCleftActs are a past verb and its object for the generated what-clefts. */
const whatCleftActs: readonly (readonly [string, string])[] = [
  ["wanted", "a new bike"],
  ["ordered", "the soup"],
  ["needed", "a long rest"],
  ["missed", "the sea"],
  ["liked", "the music"],
  ["noticed", "the smell"],
  ["bought", "a new coat"],
  ["remembered", "the songs"],
  ["hated", "the cold"],
  ["heard", "a strange noise"],
  ["planned", "a surprise party"],
  ["saw", "a fox"],
];

/** sentenceOf capitalizes the first letter of a sentence. */
const sentenceOf = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** itClefts are the hand-written it-clefts, then those from people and acts with the object in focus. */
const itClefts: readonly (readonly [string, string, "is" | "was", string, string, Role, boolean])[] = [
  ...handItClefts,
  ...itCleftActs.flatMap(([verb, thing]) =>
    cleftPeople.map(
      (who) => [sentenceOf(`${who} ${verb} ${thing}.`), thing, "was", `${who} ${verb}`, `${who} ${verb} it`, "object", false] as const,
    ),
  ),
];

/** whatClefts are the hand-written what-clefts, then those from people and acts with the object in focus. */
const whatClefts: readonly (readonly [string, string, "is" | "was", string])[] = [
  ...handWhatClefts,
  ...whatCleftActs.flatMap(([verb, thing]) =>
    cleftPeople.map((who) => [sentenceOf(`${who} ${verb} ${thing}.`), `${who} ${verb}`, "was", thing] as const),
  ),
];

const itChoice: readonly ChoiceItem[] = itClefts.map(
  ([plain, focus, be, rest, doubled]): ChoiceItem => [
    `Focus on *${focus}*: ${plain} → ___`,
    `It ${be} ${focus} that ${rest}.`,
    [`It ${be} ${focus} what ${rest}.`, `It ${be} ${focus} that ${doubled}.`],
  ],
);

const whatChoice: readonly ChoiceItem[] = whatClefts.map(
  ([plain, clause, be, focus]): ChoiceItem => [
    `Focus on *${focus}*: ${plain} → ___`,
    `What ${clause} ${be} ${focus}.`,
    [`That ${clause} ${be} ${focus}.`, `What ${clause} it ${be} ${focus}.`],
  ],
);

/** linkOf lists the words that may join the focus of an it-cleft to the rest, as a pattern. */
function linkOf(focus: string, role: Role, person: boolean): string {
  const words = person ? ["that", "who"] : ["that", "which"];
  if (role === "object" && person) words.push("whom");
  const joined = words.map((w) => `${focus} ${w}`);
  if (role === "object") joined.push(focus);
  return `[${joined.join("|")}]`;
}

const cleftTyped: readonly TypedItem[] = interleave([
  itClefts.map(
    ([plain, focus, be, rest, doubled, role, person]): TypedItem => ({
      shown: `${plain} (focus: ${focus}; begin with It)`,
      accepted: [`${be === "is" ? "[It is|It's]" : "It was"} ${linkOf(focus, role, person)} ${rest}.`],
      canonical: `It ${be} ${focus} that ${rest}.`,
      wrong: [`It ${be} ${focus} what ${rest}.`, `It ${be} ${focus} that ${doubled}.`],
    }),
  ),
  whatClefts.map(
    ([plain, clause, be, focus]): TypedItem => ({
      shown: `${plain} (focus: ${focus}; begin with What)`,
      accepted: [`What ${clause} ${be} ${focus}.`],
      canonical: `What ${clause} ${be} ${focus}.`,
      wrong: [`That ${clause} ${be} ${focus}.`, `What ${clause} it ${be} ${focus}.`],
    }),
  ),
]);

/** focusOf finds the words in focus in a choice or in a note to write from. */
const focusOf = (shown: string) => /Focus on \*([^*]+)\*/u.exec(shown)?.[1] ?? /focus: ([^;]+);/u.exec(shown)?.[1] ?? "";

/** cleftRule names how a cleft sentence puts its focus first, after It is or It was, or last, after a what-clause. */
function cleftRule(right: string, shown: string): Text {
  const focus = focusOf(shown);
  const be = / was /u.test(` ${right} `) ? "was" : "is";
  return right.startsWith("What ")
    ? t(
        `To focus on *${focus}*, begin with a *what*-clause as the subject and put *${focus}* after *${be}*`,
        `要强调 *${focus}*，就用 *what* 从句作主语开头，把 *${focus}* 放在 *${be}* 后面`,
      )
    : t(
        `To focus on *${focus}*, put it after *It ${be}* and the rest after *that*, without repeating it`,
        `要强调 *${focus}*，就把它放在 *It ${be}* 后面，其余部分放在 *that* 后面，不再重复它`,
      );
}

/** cleftWhy puts the rule of the cleft before a sentence. */
const cleftWhy = (right: string, shown: string): Text => {
  const rule = cleftRule(right, shown);
  return t(`${rule.en}: ${right}`, `${rule["zh-CN"]}：${right}`);
};

/** whyNotItCleft explains what in an it-cleft, or a pronoun that repeats the focus. */
const whyNotItCleft = (_wrong: string, right: string, shown: string, position: number): Text => {
  const rule = cleftRule(right, shown);
  const first =
    position === 0
      ? t("*what* never joins the focus of an *It* cleft to the rest.", "*It* 分裂句里不能用 *what* 连接被强调部分和其余部分。")
      : t(
          `The part after *that* repeats *${focusOf(shown)}* with a pronoun, but the focus already fills that place.`,
          `*that* 后面又用代词重复了 *${focusOf(shown)}*，但被强调的部分已经占了这个位置。`,
        );
  return t(`${first.en} ${rule.en}.`, `${first["zh-CN"]}${rule["zh-CN"]}。`);
};

/** whyNotWhatCleft explains That instead of What, or it before the verb of a what-cleft. */
const whyNotWhatCleft = (_wrong: string, right: string, shown: string, position: number): Text => {
  const rule = cleftRule(right, shown);
  const first =
    position === 0
      ? t(
          "A clause that begins with *That* does not name the thing in focus; the cleft begins with *What*.",
          "以 *That* 开头的从句不能表示被强调的事物，分裂句要以 *What* 开头。",
        )
      : t(
          "The *what*-clause is already the subject of the verb, so there is no *it* before it.",
          "*what* 从句已经是动词的主语，所以动词前不再加 *it*。",
        );
  return t(`${first.en} ${rule.en}.`, `${first["zh-CN"]}${rule["zh-CN"]}。`);
};

const cleftSentences: TopicDef = {
  id: "cleft-sentences",
  title: t("It Was the Food That Surprised Me", "It is... that... 和 What... is...（分裂句）"),
  summary: t(
    "It was the food that surprised me most. What I miss is the language. A cleft sentence splits a plain sentence in two to put one part in focus.",
    "It was the food that surprised me most. What I miss is the language。分裂句把一个普通句子分成两部分，突出其中一部分。",
  ),
  prerequisites: ["relative-clauses"],
  encompasses: [{ topic: "relative-clauses", weight: 0.3 }],
  xp: 30,
  strand: "grammar",
  knowledgePoints: [
    point(
      "it-cleft",
      t("It is ... that ...", "It is ... that ..."),
      t(
        "To put one part of a sentence in focus, put it after *It is* or *It was* and the rest after *that*:\n\n- *The food surprised me most.* → *It was **the food** that surprised me most.*\n- *I miss the language most.* → *It is **the language** that I miss most.*\n\nThe part after *that* is not complete without the focus, so it must not repeat it with a pronoun: not *It was the food that it surprised me*, not *It is the language that I miss it*. The joining word is *that* (or *who* for a person, *which* for a thing), never *what*.",
        "要突出句子的某一部分，就把它放在 *It is* 或 *It was* 后面，其余部分放在 *that* 后面：\n\n- *The food surprised me most.* → *It was **the food** that surprised me most.*\n- *I miss the language most.* → *It is **the language** that I miss most.*\n\n*that* 后面的部分缺了被强调的成分，不能再用代词重复它：不能说 *It was the food that it surprised me*，也不能说 *It is the language that I miss it*。连接词用 *that*（指人也可用 *who*，指物也可用 *which*），不能用 *what*。中文用“正是……”“就是……才……”来强调（“正是这里的食物让我最吃惊”），英语则要用 *It was ... that ...* 这个固定框架。",
      ),
      choiceGenerator(
        t("Choose the sentence that puts the words in focus.", "选出突出所给部分的句子。"),
        itChoice,
        cleftWhy,
        whyNotItCleft,
      ),
    ),
    point(
      "what-cleft",
      t("What ... is ...", "What ... is ..."),
      t(
        "Another way to focus on something is to begin with a *what*-clause and put the focus after *is* or *was*:\n\n- *I need a long holiday.* → *What I need **is** a long holiday.*\n- *The ending annoyed me.* → *What annoyed me **was** the ending.*\n\nThe sentence begins with *What*, not *That*, and the *what*-clause is the subject of *is*, so there is no *it* before the verb: not *What I need it is a holiday*.",
        "另一种强调方式是用 *what* 从句开头，把被强调的部分放在 *is* 或 *was* 后面：\n\n- *I need a long holiday.* → *What I need **is** a long holiday.*\n- *The ending annoyed me.* → *What annoyed me **was** the ending.*\n\n句子以 *What* 开头，不是 *That*；*what* 从句本身就是 *is* 的主语，所以动词前不再加 *it*：不能说 *What I need it is a holiday*。这和中文“我需要的是一个长假”结构很像：“我需要的”对应 *What I need*，“是”对应 *is*。",
      ),
      choiceGenerator(
        t("Choose the sentence that puts the words in focus.", "选出突出所给部分的句子。"),
        whatChoice,
        cleftWhy,
        whyNotWhatCleft,
      ),
    ),
    point(
      "write",
      t("Writing cleft sentences", "写分裂句"),
      t(
        "Rewrite the sentence to put the words in brackets in focus, beginning as the note says: *The food surprised me most. (focus: the food; begin with It)* becomes *It was the food that surprised me most.* *I need a long holiday. (focus: a long holiday; begin with What)* becomes *What I need is a long holiday.*\n\nKeep the tense of the plain sentence: *is* for the present, *was* for the past. After *It*, you may join with *who* for a person or *which* for a thing, and leave out *that* when the focus is the object.",
        "改写句子，突出括号里的部分，并按提示开头：*The food surprised me most. (focus: the food; begin with It)* 写成 *It was the food that surprised me most.* *I need a long holiday. (focus: a long holiday; begin with What)* 写成 *What I need is a long holiday.*\n\n保持原句的时态：现在用 *is*，过去用 *was*。用 *It* 开头时，指人可以用 *who*，指物可以用 *which*；被强调的是宾语时可以省略 *that*。",
      ),
      typedGenerator(
        "sentence-pattern",
        t("Rewrite the sentence to put the words in focus.", "改写句子，突出所给的部分。"),
        cleftTyped,
        cleftWhy,
      ),
    ),
  ],
};

// Writing a proposal.

const proposalBank: readonly WritingItem[] = [
  {
    task: "Your town council is inviting proposals for a one-day festival that celebrates the different cultures of the people who live in the town. Write a proposal.",
    model:
      "Introduction\nThe purpose of this proposal is to suggest a World Day festival for our town. Over thirty nationalities now live here, yet most residents know little about their neighbors' cultures, and a recent council survey found that many newcomers feel isolated.\n\nThe proposal\nI propose a free festival in the central square on the first Saturday of June. Each community would run a stall offering food, music or crafts from its homeland, and a stage would host dance groups and short talks throughout the day.\n\nHow it would work\nA committee of volunteers from different communities would organize the event, supported by one council officer. The main costs, about 8,000 dollars for the stage, tents and safety staff, could be covered partly by the council and partly by local businesses, which would be invited to sponsor stalls in return for advertising. Schools could prepare performances in the weeks before the festival.\n\nWhy it should be chosen\nThe festival would bring people together who rarely meet, help newcomers feel that they belong, and attract visitors to shops and cafés in the town center. Similar events in nearby towns have drawn more than 5,000 people. For a modest cost, the council would show that it values every resident. I therefore strongly recommend that this proposal be accepted.",
  },
  {
    task: "Your school wants to do more to welcome international students who join during the year. Write a proposal to the head teacher.",
    model:
      "Introduction\nThis proposal suggests a buddy program for international students. Every year about twenty students from abroad join our school, often in the middle of a term. Many of them say that the first weeks are lonely and confusing, as they do not know the timetable, the rules or anyone in their class.\n\nThe proposal\nI propose that each new international student is paired with a volunteer buddy from the same year group for their first six weeks. Where possible, the buddy would speak the newcomer's language or have lived abroad.\n\nHow it would work\nVolunteers would apply through their form tutors and attend a short training session on how to help without taking over. On the newcomer's first day, the buddy would show them around the school, sit with them at lunch and introduce them to classmates. Buddies would meet the student once a week to answer questions, and a teacher would check on each pair after a month.\n\nWhy it should be chosen\nThe program would cost almost nothing, since it relies on volunteers and existing staff. It would help international students settle in faster, which is likely to improve both their well-being and their results. It would also give our own students valuable experience of other cultures and of responsibility. For these reasons, I hope you will support this proposal.",
  },
  {
    task: "The local history museum wants to attract more visitors aged 15 to 25. Write a proposal for the museum's director.",
    model:
      "Introduction\nThe aim of this proposal is to suggest ways of attracting more young people to the museum. At present, according to the museum's own figures, fewer than one visitor in ten is between 15 and 25, and many young people I asked said they thought museums were boring.\n\nThe proposal\nI propose a series of evening events called Museum After Dark, held on the last Friday of each month, together with an interactive trail that visitors can follow on their phones.\n\nHow it would work\nThe evening events would combine short talks by curators with live music, a quiz and food from local cafés. Each event would focus on one part of the collection, such as the Roman artifacts or the town's textile history. The phone trail would ask visitors to solve puzzles linked to the exhibits and to share photos online. Students from the local college could design the trail as part of their course, which would keep costs low.\n\nWhy it should be chosen\nEvening events have doubled the number of young visitors at several museums in other cities. They would also bring in extra money from ticket and food sales. Most importantly, they would show young people that history is relevant to their own lives. I am confident that this plan would make the museum a place where young people want to spend time.",
  },
  {
    task: "Your college has a small fund for projects that help students learn foreign languages. Write a proposal for a language exchange project.",
    model:
      "Introduction\nThis proposal outlines a language exchange project for our college. Many students study a foreign language in class, but they rarely have the chance to speak it with native speakers. At the same time, our 150 international students often say that they would like more practice in English and more contact with local students.\n\nThe proposal\nI propose a weekly language café where students meet in pairs or small groups to practice each other's languages. Each session would last ninety minutes: half the time in one language and half in the other.\n\nHow it would work\nThe café would take place every Wednesday evening in the student common room. Students would register online, choosing the languages they speak and the ones they want to learn, and a volunteer coordinator would match them. The fund would pay for drinks and snacks, about 50 dollars a week, and for posters at the start of each term. Teachers from the language department could provide conversation cards with topics for beginners.\n\nWhy it should be chosen\nThe project is inexpensive and easy to run, yet it would improve students' fluency and confidence far more than classroom practice alone. It would also help international students make friends and feel part of college life. In short, it would turn our college's cultural diversity into a resource for everyone.",
  },
  {
    task: "A city fund supports projects that preserve local heritage. Write a proposal for a project that records the memories of older residents.",
    model:
      "Introduction\nThe purpose of this proposal is to request support for an oral history project in the Riverside district. Riverside was once the center of the city's fishing industry, but the last of the old fishing families are now in their eighties. When they are gone, their memories of a way of life that shaped our city will be lost.\n\nThe proposal\nI propose to record interviews with at least forty older residents about their working lives, traditions and festivals, and to make these recordings available to the public.\n\nHow it would work\nA team of ten trained volunteers, including students from the history department, would carry out the interviews over six months. Each interview would be recorded, transcribed and stored in the city archive. Selected extracts, together with old photographs lent by the families, would form a small exhibition in the public library and a free website. The total cost, mainly for recording equipment, training and the exhibition, would be about 12,000 dollars.\n\nWhy it should be chosen\nThis project would preserve a part of our heritage that exists nowhere in writing. It would also bring generations together, as young volunteers would learn directly from older people. Finally, the archive would be a valuable resource for schools and researchers for many years. I believe there is no time to lose, and I hope the fund will support this project.",
  },
  {
    task: "The tourism board of your town is looking for ideas to reduce the problems caused by too many tourists in the old town. Write a proposal.",
    model:
      "Introduction\nThis proposal suggests measures to reduce overtourism in the old town. In summer, up to 20,000 visitors a day crowd its narrow streets. Residents complain about noise and rising rents, and many traditional shops have been replaced by souvenir stores.\n\nThe proposal\nI propose a combination of three measures: a booking system for tour groups, a small tourist tax, and a campaign to promote other parts of the region.\n\nHow it would work\nFirst, tour groups of more than fifteen people would have to book a time slot online, which would spread visitors more evenly through the day. Second, a tax of two dollars per night would be added to hotel bills. The money raised could be used to support local shops and to repair historic buildings. Third, the tourism board would create walking routes and guides to the villages and natural attractions outside the town, so that visitors spend more time and money elsewhere.\n\nWhy it should be chosen\nThese measures would not stop tourism, which is vital to our economy, but they would make it sustainable. Similar systems in other historic cities have reduced crowding by about a quarter. Residents would enjoy a better quality of life, and visitors would have a more pleasant and authentic experience. I therefore recommend that the board adopts this proposal.",
  },
  {
    task: "Your school is planning an international day. Write a proposal to the student council suggesting what the day should include.",
    model:
      "Introduction\nThe aim of this proposal is to suggest a program for the school's first International Day. Our school has students from more than twenty countries, but we rarely have an opportunity to learn about each other's cultures.\n\nThe proposal\nI propose that International Day takes place on a Friday in May and includes three main activities: a food fair, a series of short workshops and an evening show.\n\nHow it would work\nIn the morning, students and parents would run stalls selling small portions of dishes from their countries, with all profits going to a charity chosen by the council. In the afternoon, normal lessons would be replaced by forty-minute workshops, such as calligraphy, traditional dance, simple phrases in different languages or games from around the world. Students would choose two workshops in advance. In the evening, an hour-long show in the school hall would feature music and performances by students. A team of six council members would organize the day with the help of two teachers.\n\nWhy it should be chosen\nThe day would celebrate the diversity of our school community and help students understand cultures different from their own. It would also give students who are new to the country a chance to share something they are proud of. The event would cost very little, as the food fair would cover most expenses. I hope the council will approve this proposal.",
  },
  {
    task: "The public library in your area has money to improve its services for families who speak languages other than English. Write a proposal.",
    model:
      "Introduction\nThis proposal outlines a plan to make the library more welcoming to multilingual families. According to the last census, one in four households in our area speaks a language other than English at home, yet the library has very few books in these languages and almost no events for these families.\n\nThe proposal\nI propose creating a multilingual family corner, with books in the five most common home languages of the area, and a monthly storytelling session in which stories are read in two languages.\n\nHow it would work\nThe library would spend about 6,000 dollars on children's books in Arabic, Chinese, Polish, Spanish and Urdu, chosen with help from local community groups. The corner would be set up in the children's section, with signs in all five languages. Volunteer parents would be invited to lead the storytelling sessions, reading a story first in their own language and then in English, with simple activities for the children afterwards.\n\nWhy it should be chosen\nResearch shows that children who keep reading in their home language also learn English more successfully. The project would encourage families who rarely visit the library to start using it, and it would show that the library values every community. It is a practical and affordable way of serving the whole area. I strongly recommend that it be funded.",
  },
  {
    task: "The student council has money for one cultural exchange trip next year. Write a proposal for the trip you think should be chosen.",
    model:
      "Introduction\nThe purpose of this proposal is to recommend a destination and a plan for next year's cultural exchange trip. I believe the trip should be a ten-day exchange with our partner school in Valencia, Spain.\n\nThe proposal\nI propose that twenty students from our school spend ten days in Valencia in April, staying with the families of Spanish students. In October, the Spanish students would visit us and stay with our families in return.\n\nHow it would work\nDuring the visit, our students would attend lessons at the partner school in the mornings. In the afternoons, they would take part in planned activities, such as a visit to the old city, a cooking class and a project with their Spanish partners comparing traditions in the two countries. Because students would stay with families, the main costs would be travel and activities, about 600 dollars per student. The council fund could reduce this amount for students whose families cannot afford it.\n\nWhy it should be chosen\nUnlike an ordinary school trip, an exchange allows students to experience daily life in another culture, not just its tourist attractions. Living with a family would improve their Spanish far more than any classroom could, and the return visit would let the whole school benefit. Most importantly, the friendships formed could last for years. For these reasons, I hope the council will choose this exchange.",
  },
  {
    task: "You work for a company that has recently opened offices in three other countries. Write a proposal to your manager for training that would help staff work with colleagues from other cultures.",
    model:
      "Introduction\nThis proposal recommends intercultural communication training for our staff. Since we opened offices in Brazil, India and Japan, misunderstandings between teams have become more frequent. In a recent staff survey, more than half of the employees who work with these offices said that cultural differences had caused delays or tension.\n\nThe proposal\nI propose a one-day workshop for all staff who work with international colleagues, followed by a short online course and a monthly discussion group.\n\nHow it would work\nThe workshop would be led by an external trainer with experience of the three countries. It would cover differences in communication styles, attitudes to time and hierarchy, and business etiquette, using real examples from our company. The online course would allow staff to continue learning at their own pace, while the discussion group, which would meet by video, would give colleagues from all four offices a chance to share experiences. The total cost would be around 15,000 dollars for about eighty employees.\n\nWhy it should be chosen\nBetter communication would save time and prevent costly mistakes, such as missed deadlines caused by unclear messages. It would also improve relationships between offices and make our international staff feel more respected. Compared with the cost of losing a client because of a misunderstanding, the training is a sound investment. I would be happy to help organize it.",
  },
  {
    task: "An old railway station in your town has been empty for ten years. The council wants proposals for how it could be used. Write a proposal.",
    model:
      "Introduction\nThe purpose of this proposal is to suggest a new use for the old railway station. Built in 1890, the station is one of the finest buildings in the town, but it has been empty since 2015 and is slowly falling apart. At the same time, the town has no community center where clubs and groups can meet.\n\nThe proposal\nI propose that the station is restored and turned into a community and heritage center, with meeting rooms, a café and a small exhibition about the history of the railway in our town.\n\nHow it would work\nThe restoration would be carried out in two stages. First, the roof and walls would be repaired so that the building is safe. Then the old waiting rooms would be converted into meeting rooms that local groups could rent at low cost. The café, run by a local charity, would provide jobs for young people and help cover running costs. The exhibition would display photographs and objects lent by residents. Funding could come from a national heritage fund, the council and local businesses.\n\nWhy it should be chosen\nThis plan would preserve an important part of our heritage instead of letting it disappear. It would also give the town a much-needed meeting place and bring life back to an area that has become run-down. I am convinced that residents would use and value the center for generations.",
  },
  {
    task: "Your town council has some unused land near the town center. Write a proposal for a community garden where people from different backgrounds can grow food together.",
    model:
      "Introduction\nThis proposal suggests turning the unused land on Mill Street into a community garden. Our town has welcomed many families from abroad in recent years, but there are few places where long-term residents and newcomers meet. Many people also live in flats without gardens.\n\nThe proposal\nI propose a shared garden with forty small plots, where residents can grow vegetables and herbs, including plants from their homelands, together with a covered area for meetings and shared meals.\n\nHow it would work\nThe council would prepare the land, provide a water supply and build a simple shelter, at a cost of about 20,000 dollars. Plots would be rented for a small yearly fee, and half of them would be offered to families who have recently arrived in the town. A garden committee of volunteers would set the rules and organize monthly events, such as harvest meals where gardeners cook and share dishes from their cultures. Local schools could use two plots for lessons about food and nature.\n\nWhy it should be chosen\nThe garden would turn an unattractive empty space into a green area for everyone. More importantly, working side by side is one of the most natural ways for people to get to know each other, and shared food can break down stereotypes quickly. The project would also encourage healthy eating and outdoor activity. I hope the council will give this proposal serious consideration.",
  },
];

const proposal = judgedTopic({
  id: "writing-a-proposal",
  title: t("Writing a Proposal", "写提案"),
  summary: t(
    "Write a proposal of 200 to 250 words, with headings, for a project the task names: the need, what you propose, how it would work and why it should be chosen.",
    "为任务给出的项目写一篇 200 到 250 词、带小标题的提案：需求、你的提议、如何实施以及为什么应该被采纳。",
  ),
  prerequisites: ["writing-a-report"],
  encompasses: [{ topic: "writing-a-report", weight: 0.4 }],
  criteria: ["b2-proposal-need", "b2-proposal-headings", "b2-proposal-plan", "b2-proposal-benefits", "b2-neutral-register"],
  point: {
    id: "proposal",
    title: t("Need, plan, benefits", "需求、方案、益处"),
    explanation: t(
      "A proposal asks a reader, such as a council, a head teacher or a manager, to accept a plan. Like a report, it has headings and a neutral tone, but it looks forward and tries to persuade. Plan four sections:\n\n1. **Introduction**: say what the proposal is for and why it is needed, with a fact if you can: *The purpose of this proposal is to... At present, ...*\n2. **The proposal**: say in one or two sentences what you suggest: *I propose a weekly language café...*\n3. **How it would work**: give practical details: who would do what, when, where and what it would cost. Use *would*: *Volunteers would meet...*\n4. **Why it should be chosen**: give the benefits and end with a confident sentence: *I therefore recommend that this proposal be accepted.*\n\nA report says what **is**; a proposal says what **would** happen. Keep it formal, with no contractions.",
      "提案请读者（例如市议会、校长或经理）接受一个计划。它和报告一样有小标题、语气中立，但它着眼于未来，并且要说服读者。安排四个部分：\n\n1. **引言（Introduction）**：说明提案的目的和为什么需要它，最好有一个事实：*The purpose of this proposal is to... At present, ...*\n2. **提议（The proposal）**：用一两句话说明你的建议：*I propose a weekly language café...*\n3. **如何实施（How it would work）**：给出具体细节：谁做什么、什么时候、在哪里、花多少钱。用 *would*：*Volunteers would meet...*\n4. **为什么应该采纳（Why it should be chosen）**：说明益处，并用一句有把握的话结尾：*I therefore recommend that this proposal be accepted.*\n\n报告说的是现在**是**什么样；提案说的是将来**会**怎样。保持正式，不用缩写。中文申请书常先讲很多背景和决心，英语提案则要尽快说明要做什么、怎样做、有什么好处。",
    ),
  },
  question: t(
    "Write a proposal of 200 to 250 words in English, with headings. Explain the need, say what you propose and how it would work, and explain why it should be chosen.",
    "用英语写一篇 200 到 250 词、带小标题的提案。说明需求，提出你的方案和实施方式，并说明为什么应该采纳它。",
  ),
  bank: proposalBank,
  limits: { minWords: 170, maxChars: 2400 },
  what: t("proposal", "提案"),
});

/** topics are the topics of the unit Culture, Identity and Globalization. */
export const topics: readonly TopicDef[] = [
  identity.topic,
  global.topic,
  language.topic,
  traditions.topic,
  heritage.topic,
  belief.topic,
  stereotypes.topic,
  tourism.topic,
  food.topic,
  people.topic,
  diplomacy.topic,
  cleftSentences,
  proposal,
];

/** vocabulary are the words the unit Culture, Identity and Globalization teaches. */
export const vocabulary: readonly WordBatch[] = [
  identity.batch,
  global.batch,
  language.batch,
  traditions.batch,
  heritage.batch,
  belief.batch,
  stereotypes.batch,
  tourism.batch,
  food.batch,
  people.batch,
  diplomacy.batch,
];
