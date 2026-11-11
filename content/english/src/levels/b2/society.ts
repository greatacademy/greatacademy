// B2, unit 1: Society and Change. Society, population, change, history, war and peace, politics, social issues, trends,
// generations, linking words and verbs of argument; the third conditional. Its writing reuses the thesis statement of the
// native courses.

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { fill } from "../a2/kit.ts";
import { interleave, sentenceCase, vocabularyTopic, word } from "../words.ts";

const society = vocabularyTopic({
  id: "b2-words-society",
  title: t("Society", "社会"),
  summary: t(
    "Societies, institutions and norms; status and welfare; equality, inequality and diversity; prejudice, discrimination, racism and tolerance.",
    "社会、机构和规范；地位和福利；平等、不平等和多样性；偏见、歧视、种族主义和宽容。",
  ),
  prerequisites: ["b1-words-culture"],
  words: [
    word(
      "society societies",
      "people living together, with their laws, customs and ways of life",
      "社会",
      "We live in a {society} that values education.|tolerance racism | Old people are treated with great respect in many {societies}.|prejudices norms | A good {society} looks after its weakest members.|tolerance status",
      "variety sobriety",
    ),
    word(
      "institution institutions",
      "a large, important organization, such as a university, a bank or a court",
      "机构；制度",
      "Schools, hospitals and banks are important {institutions}.|prejudices tolerances | The university is one of the oldest {institutions} in the country.|norms prejudices | People have lost trust in public {institutions} such as the courts.|prejudices norms",
      "instruction installation",
    ),
    word(
      "norm norms",
      "the usual or accepted way of behaving in a society",
      "规范；常态",
      "In some countries it is the {norm} to take off your shoes indoors.|status welfare | Social {norms} tell us how to behave in public.|equality welfare | Working from home has become the {norm} for many people.|welfare racism",
      "form normal",
    ),
    word(
      "status",
      "the position or importance of a person or group in a society",
      "地位；身份",
      "Doctors have high {status} in most societies.|racism welfare | Owning a car was once a {status} symbol.|welfare tolerance | What is your marital {status}: single or married?|norm welfare",
      "statue static",
    ),
    word(
      "welfare",
      "health, safety and comfort; help from the government for people who need it",
      "福利；幸福",
      "The government spends a lot on {welfare} for the poor.|prejudice racism | Teachers care about the {welfare} of every child.|diversity racism | Animal {welfare} groups check how farms treat animals.|prejudice status",
      "warfare farewell",
    ),
    word(
      "equality",
      "the state of everyone having the same rights and chances",
      "平等",
      "Women fought for {equality} at work.|inequality prejudice | The law promises {equality} for all citizens.|racism discrimination | {Equality} means that everyone has the same rights.|Diversity Tolerance",
      "quality equally",
    ),
    word(
      "inequality inequalities",
      "an unfair difference between groups, for example in money or chances",
      "不平等",
      "The gap between rich and poor shows growing {inequality}.|tolerance equality | {Inequalities} in health start early in life.|Tolerances Norms | Income {inequality} is a problem in many countries.|tolerance welfare",
      "inability quality",
    ),
    word(
      "diversity",
      "a wide range of different people or things",
      "多样性",
      "London is famous for its cultural {diversity}.|prejudice racism | The {diversity} of plants in the rainforest is amazing.|tolerance equality | The company wants more {diversity} among its staff.|racism prejudice",
      "university adversity",
    ),
    word(
      "prejudice prejudices",
      "an unfair opinion about a person or group, formed without knowing them",
      "偏见",
      "She faced {prejudice} because of her accent.|tolerance diversity | We must fight {prejudice} against older workers.|diversity welfare | Travel can help people lose their {prejudices}.|institutions societies",
      "preference practice",
      "discrimination racism",
    ),
    word(
      "discrimination",
      "treating a person or group worse than others because of who they are",
      "歧视",
      "{Discrimination} against women is against the law.|Diversity Tolerance | He suffered {discrimination} because of his religion.|tolerance equality | The report found {discrimination} in how flats were rented.|tolerance welfare",
      "description distribution",
      "prejudice racism",
    ),
    word(
      "racism",
      "unfair treatment of people because of their race",
      "种族主义；种族歧视",
      "{Racism} is treating people badly because of their race.|Diversity Welfare | The football club acted against {racism} in the stadium.|diversity equality | Many people marched to protest against {racism}.|tolerance equality",
      "realism tourism",
      "prejudice discrimination",
    ),
    word(
      "tolerance",
      "being willing to accept views and ways of life that are different from yours",
      "宽容；容忍",
      "{Tolerance} means accepting views that are different from yours.|Prejudice Racism | The city is known for its {tolerance} of different religions.|racism inequality | We should teach children {tolerance} and respect.|racism inequality",
      "tolerate tolerable",
    ),
  ],
});

const population = vocabularyTopic({
  id: "b2-words-population",
  title: t("Population", "人口"),
  summary: t(
    "Demographic change and the census; migrating, emigrating and refugees; settling and settlements; inhabitants, density, urbanization and decline.",
    "人口变化和人口普查；迁移、移居国外和难民；定居和定居点；居民、密度、城市化和减少。",
  ),
  prerequisites: ["b1-words-city-life"],
  words: [
    word(
      "demographic",
      "about the population and its groups, such as their ages; a group of people of one kind",
      "人口的；人群",
      "The {demographic} data show an ageing population.|refugee inhabitant | Young people are the main {demographic} for this app.|settlement census | {Demographic} change means that there are more old people.|Refugee Inhabitant",
      "democratic graphic",
    ),
    word(
      "census",
      "an official count of all the people in a country",
      "人口普查",
      "The government counts every person in a {census} every ten years.|density settlement | According to the last {census}, the city has two million people.|refugee density | The {census} asks questions about age, work and family.|density migration",
      "consensus sense",
    ),
    word(
      "migrate migrates migrated migrating",
      "to move from one place to another to live or work, or (of birds and animals) with the seasons",
      "迁移；迁徙",
      "Many birds {migrate} south for the winter.|decline census | Every year, thousands of workers {migrate} from poor regions to rich ones.|decline settle | Whales {migrate} thousands of kilometers each year.|settle decline",
      "migration mitigate",
      "emigrate",
    ),
    word(
      "migration",
      "the movement of people or animals from one place to another",
      "迁移；迁徙",
      "{Migration} from villages to cities has changed the country.|Density Census | Scientists follow the {migration} of whales across the ocean.|density census | Climate change may cause mass {migration}.|density census",
      "migrate imitation",
    ),
    word(
      "emigrate emigrates emigrated emigrating",
      "to leave your own country to live in another one",
      "移居国外",
      "My uncle {emigrated} to Canada in 1990.|declined inhabited | Many young doctors want to {emigrate} because pay is low.|inhabit decline | She is {emigrating} to Australia next month.|declining inhabiting",
      "emerge eliminate",
      "migrate",
    ),
    word(
      "refugee refugees",
      "a person who has had to leave their country because of war or danger",
      "难民",
      "The war forced millions of {refugees} to leave their homes.|densities censuses | The {refugee} camp had no clean water.|density census | She came to Britain as a {refugee} at the age of five.|census density",
      "refuge referee",
    ),
    word(
      "settle settles settled settling",
      "to go and live in a place and make it your home",
      "定居",
      "After years of travel, they {settled} in a small town.|migrated declined | My grandparents {settled} here in the 1950s.|declined inhabited | Farmers {settled} along the river because the land was good.|declined emigrated",
      "saddle select",
    ),
    word(
      "settlement settlements",
      "a place where people have come to live, such as a small village",
      "定居点；聚居地",
      "Archaeologists found an ancient {settlement} near the lake.|census density | The first {settlements} were built near water.|censuses densities | The {settlement} grew into a big city.|census density",
      "settle sentiment",
    ),
    word(
      "inhabitant inhabitants",
      "a person or animal that lives in a place",
      "居民；栖息者",
      "The island has only 300 {inhabitants}.|censuses densities | The town's {inhabitants} voted against the new road.|densities censuses | The oldest {inhabitant} of the village is 104.|census density",
      "inhabit habitat",
    ),
    word(
      "density densities",
      "how many people or things there are in a space",
      "密度",
      "Hong Kong has a very high population {density}.|census settlement | The {density} of traffic in the center is a problem.|census migration | Cities with high {densities} need good public transport.|censuses settlements",
      "destiny dense",
    ),
    word(
      "urbanization",
      "the growth of towns and cities as people move to them",
      "城市化",
      "Rapid {urbanization} has created huge cities in Asia.|density census | {Urbanization} means that more people live in towns.|Density Census | Farmland is disappearing because of {urbanization}.|census refugee",
      "urban organization",
    ),
    word(
      "decline declines declined declining",
      "to become smaller or fewer; a fall in amount or quality",
      "减少；衰退",
      "The number of farmers has {declined} sharply.|settled migrated | The town went into {decline} when the mine closed.|census density | Birth rates are {declining} in many countries.|settling migrating",
      "decide recline",
    ),
  ],
});

const changeVerbs = vocabularyTopic({
  id: "b2-words-change-verbs",
  title: t("Verbs of Change", "表示变化的动词"),
  summary: t(
    "Transforming, evolving and adapting; adjusting, converting and modifying; abolishing, reforming and revolutionizing; undergoing, emerging and restoring.",
    "转变、演化和适应；调整、转换和修改；废除、改革和彻底改变；经历、出现和恢复。",
  ),
  prerequisites: ["b1-words-describing-change"],
  words: [
    word(
      "transform transforms transformed transforming",
      "to change something completely, usually so that it is better",
      "使彻底改变；改造",
      "The internet has {transformed} the way we shop.|abolished undergone | The old factory was {transformed} into an art gallery.|abolished emerged | Education can {transform} a person's life.|abolish undergo",
      "transfer transport",
      "convert revolutionize",
    ),
    word(
      "evolve evolves evolved evolving",
      "to develop slowly over a long time",
      "演化；逐步发展",
      "Humans {evolved} over millions of years.|abolished restored | The company has {evolved} from a small shop into a big business.|abolished undergone | Languages {evolve} as people use new words.|abolish undergo",
      "involve revolve",
    ),
    word(
      "adapt adapts adapted adapting",
      "to change so that you fit a new situation; to change something for a new use",
      "适应；改编",
      "Animals must {adapt} to changes in their environment.|abolish restore | She {adapted} quickly to life in a new country.|abolished converted | The book was {adapted} for television.|abolished undergone",
      "adopt adept",
      "adjust",
    ),
    word(
      "adjust adjusts adjusted adjusting",
      "to change something a little; to get used to a new situation",
      "调整；适应",
      "You can {adjust} the seat to make it higher.|abolish undergo | It took me a week to {adjust} to the time difference.|abolish restore | He {adjusted} his tie before the interview.|abolished emerged",
      "adjoin assist",
      "adapt modify",
    ),
    word(
      "convert converts converted converting",
      "to change something into a different form or use",
      "转换；改建",
      "They {converted} the garage into a bedroom.|abolished emerged | You can {convert} dollars into euros at the airport.|abolish evolve | The bus company is {converting} its buses to electric power.|abolishing emerging",
      "convince convey",
      "transform",
    ),
    word(
      "modify modifies modified modifying",
      "to change something a little, to improve it or make it fit",
      "修改；改进",
      "The car was {modified} to run on electricity.|abolished emerged | We had to {modify} our plans because of the rain.|abolish evolve | Scientists {modified} the plant so that it needs less water.|abolished emerged",
      "modest mortify",
      "adjust",
    ),
    word(
      "abolish abolishes abolished abolishing",
      "to officially end a law, a system or a custom",
      "废除",
      "Many countries have {abolished} the death penalty.|adapted emerged | The school {abolished} its rules on uniforms.|emerged evolved | Slavery was {abolished} in the nineteenth century.|emerged adapted",
      "accomplish polish",
    ),
    word(
      "reform reforms reformed reforming",
      "to change a system or an organization to make it better",
      "改革",
      "The government plans to {reform} the tax system.|emerge evolve | The new minister promised to {reform} the schools.|emerge undergo | Health care was {reformed} after the crisis.|emerged evolved",
      "perform inform",
    ),
    word(
      "revolutionize revolutionizes revolutionized revolutionizing",
      "to change something completely, in a way that has a very great effect",
      "彻底改变；使革命化",
      "The smartphone has {revolutionized} how we communicate.|abolished emerged | Electric cars could {revolutionize} transport.|abolish undergo | The printing press {revolutionized} the spread of ideas.|abolished adapted",
      "revolve revolt",
      "transform",
    ),
    word(
      "undergo undergoes underwent undergone undergoing",
      "to experience a change or something unpleasant, such as an operation",
      "经历；接受（手术等）",
      "He {underwent} an operation on his knee.|emerged adapted | The city is {undergoing} big changes.|emerging adapting | The building has {undergone} a complete restoration.|emerged evolved",
      "undertake understand",
    ),
    word(
      "emerge emerges emerged emerging",
      "to appear or come out; to become known",
      "出现；浮现",
      "A new problem has {emerged}.|undergone restored | The sun {emerged} from behind the clouds.|underwent restored | New technologies are {emerging} every year.|undergoing restoring",
      "emigrate merge",
    ),
    word(
      "restore restores restored restoring",
      "to bring something back to how it was before",
      "恢复；修复",
      "They {restored} the old church to its original beauty.|emerged evolved | The police worked to {restore} order.|emerge evolve | Electricity was {restored} after six hours.|emerged evolved",
      "store rest",
    ),
  ],
});

const history = vocabularyTopic({
  id: "b2-words-history",
  title: t("History", "历史"),
  summary: t(
    "Eras, decades and centuries; empires, dynasties and civilizations; revolutions, colonies and independence; conquering, invading and invasions.",
    "时代、十年和世纪；帝国、朝代和文明；革命、殖民地和独立；征服、入侵和侵略。",
  ),
  prerequisites: ["b1-words-culture"],
  words: [
    word(
      "era eras",
      "a long period of history with a special character",
      "时代；纪元",
      "The film is set in the Victorian {era}.|colony invasion | We are living in a new {era} of technology.|colony dynasty | The end of the war marked the start of a new {era}.|colony empire",
      "error area",
    ),
    word(
      "decade decades",
      "a period of ten years",
      "十年",
      "Prices have doubled in the last {decade}.|dynasty colony | He has worked here for two {decades}.|dynasties colonies | The 1960s was a {decade} of great change.|colony dynasty",
      "decay decide",
      "century",
    ),
    word(
      "century centuries",
      "a period of a hundred years",
      "世纪；一百年",
      "The castle was built in the twelfth {century}.|decade dynasty | Life has changed a lot over the last {century}.|colony invasion | Two {centuries} ago, most people lived on farms.|colonies empires",
      "center country",
      "decade era",
    ),
    word(
      "empire empires",
      "a group of countries ruled by one ruler or one government",
      "帝国",
      "The {empire} once ruled half of Europe.|colony era | Many {empires} rose and fell in that region.|decades invasions | The British {empire} had colonies all over the world.|era revolution",
      "emperor umpire",
      "dynasty",
    ),
    word(
      "dynasty dynasties",
      "a line of rulers from the same family",
      "朝代；王朝",
      "The Ming {dynasty} ruled China for nearly 300 years.|colony revolution | The {dynasty} ended when the last emperor died.|colony invasion | Several {dynasties} built parts of the Great Wall.|colonies decades",
      "dynamite destiny",
      "empire",
    ),
    word(
      "civilization civilizations",
      "a society with its own culture, cities and way of life",
      "文明",
      "The Maya built an advanced {civilization} in Central America.|independence decade | Ancient {civilizations} grew up along great rivers.|independences decades | Writing is one of the foundations of {civilization}.|invasion independence",
      "citizen civilian",
    ),
    word(
      "revolution revolutions",
      "a time when people change their government by force; a complete change in the way things are done",
      "革命；彻底变革",
      "The {revolution} of 1911 ended imperial rule in China.|colony decade | The industrial {revolution} changed how people worked.|invasion independence | The internet started a {revolution} in communication.|colony dynasty",
      "revelation resolution",
    ),
    word(
      "colony colonies",
      "a country or area ruled by another country; a group of animals living together",
      "殖民地；（动物的）群体",
      "India was once a British {colony}.|dynasty revolution | The {colony} won its independence in 1962.|decade invasion | Ants live in large {colonies}.|decades invasions",
      "colon colonel",
    ),
    word(
      "independence",
      "freedom from the control of another country or person",
      "独立",
      "The country gained {independence} in 1947.|invasion colony | Teenagers want more {independence} from their parents.|invasion revolution | They celebrate their {independence} every year on 4 July.|invasion colony",
      "independent dependence",
    ),
    word(
      "conquer conquers conquered conquering",
      "to take control of a country or a city by force; to deal successfully with a problem",
      "征服；克服",
      "The army {conquered} the city after a long war.|declined emerged | She finally {conquered} her fear of flying.|invaded settled | Alexander set out to {conquer} the world.|undergo settle",
      "concur concern",
      "invade",
    ),
    word(
      "invade invades invaded invading",
      "to enter a country with an army in order to take control of it",
      "入侵；侵略",
      "The country was {invaded} in 1940.|emerged evolved | Tourists {invade} the beach every summer.|evolve emerge | The enemy planned to {invade} from the north.|emerge evolve",
      "evade invite",
      "conquer",
    ),
    word(
      "invasion invasions",
      "the act of an army entering a country to take control of it",
      "入侵",
      "The {invasion} began early in the morning.|independence colony | The island was protected from {invasion} by the sea.|independence revolution | There have been several {invasions} of the region.|independences decades",
      "invitation evasion",
    ),
  ],
});

const warAndPeace = vocabularyTopic({
  id: "b2-words-war-and-peace",
  title: t("War and Peace", "战争与和平"),
  summary: t(
    "War, peace and conflict; battles, armies and soldiers; weapons, enemies and allies; treaties, surrender and victory.",
    "战争、和平和冲突；战役、军队和士兵；武器、敌人和盟友；条约、投降和胜利。",
  ),
  prerequisites: ["b1-words-news"],
  words: [
    word(
      "war wars",
      "fighting between countries or groups, with armies and weapons",
      "战争",
      "My grandfather fought in the {war}.|treaty victory | Millions of people died in the {wars} of the last century.|treaties allies | The {war} lasted six years.|weapon soldier",
      "wear ward",
      "conflict battle",
    ),
    word(
      "peace",
      "a time when there is no war or fighting; calm and quiet",
      "和平；安宁",
      "After years of fighting, the two countries made {peace}.|weapon battle | The children just want to live in {peace}.|ally treaty | Please leave me in {peace}. I need to work.|ally victory",
      "piece pace",
    ),
    word(
      "conflict conflicts",
      "a serious disagreement or fighting between groups or countries",
      "冲突",
      "The {conflict} between the two groups lasted for years.|weapon soldier | We need to end this {conflict} without violence.|weapon ally | There was a {conflict} of interest because the judge knew the man.|weapon treaty",
      "comfort convict",
      "war battle",
    ),
    word(
      "battle battles",
      "a fight between armies; a struggle",
      "战役；斗争",
      "Thousands of soldiers died in the {battle}.|treaty ally | She lost her {battle} with cancer.|treaty ally | The {battle} took place near the river.|treaty ally",
      "bottle cattle",
      "war conflict",
    ),
    word(
      "army armies",
      "the soldiers of a country who fight on land",
      "军队；陆军",
      "He joined the {army} when he was eighteen.|weapon treaty | The {army} marched towards the capital.|treaty peace | Both {armies} were tired after weeks of fighting.|treaties weapons",
      "arm harmony",
    ),
    word(
      "soldier soldiers",
      "a member of an army",
      "士兵；军人",
      "The {soldiers} guarded the bridge.|weapons treaties | My brother is a {soldier} in the army.|treaty weapon | A young {soldier} wrote letters home from the war.|weapon treaty",
      "solder shoulder",
    ),
    word(
      "weapon weapons",
      "a thing used to hurt or kill people, such as a gun or a knife",
      "武器",
      "Guns and knives are {weapons}.|allies treaties | Nuclear {weapons} could destroy whole cities.|treaties allies | The police found the {weapon} under the bed.|treaty victory",
      "weaken wagon",
    ),
    word(
      "enemy enemies",
      "a person or country that you are fighting against or that hates you",
      "敌人",
      "The two countries were {enemies} for centuries.|weapons treaties | The {enemy} attacked at night.|treaty victory | Don't make an {enemy} of your boss.|treaty weapon",
      "energy envy",
    ),
    word(
      "ally allies",
      "a country or person that helps and supports another",
      "盟友；同盟国",
      "Britain and France were {allies} in the war.|weapons treaties | She was my closest {ally} at work.|weapon treaty | The country asked its {allies} for help.|weapons victories",
      "alley alloy",
    ),
    word(
      "treaty treaties",
      "a written agreement between countries",
      "条约",
      "The two countries signed a peace {treaty}.|weapon soldier | The {treaty} was signed in Paris in 1783.|weapon enemy | Under the {treaty}, both sides agreed to have fewer weapons.|battle enemy",
      "treat retreat",
    ),
    word(
      "surrender surrenders surrendered surrendering",
      "to stop fighting and accept that the enemy has won; to give something up",
      "投降；交出",
      "The army {surrendered} after three days.|victory peace | They {surrendered} their weapons to the police.|conquered settled | Never {surrender}!|Victory Peace",
      "surround render",
    ),
    word(
      "victory victories",
      "success in a war, a fight or a game",
      "胜利",
      "The team celebrated its {victory}.|enemy weapon | The election was a big {victory} for the party.|weapon enemy | After a long battle, the army won a great {victory}.|treaty weapon",
      "victim history",
    ),
  ],
});

const politics = vocabularyTopic({
  id: "b2-words-politics",
  title: t("Politics", "政治"),
  summary: t(
    "Democracy, parliament and presidents; ministers and policy; electing, the opposition and legislation; authority, regimes, republics and monarchies.",
    "民主、议会和总统；部长和政策；选举、反对党和立法；当局、政权、共和国和君主制。",
  ),
  prerequisites: ["b1-words-news"],
  words: [
    word(
      "democracy democracies",
      "a system in which the people choose their government by voting; a country with this system",
      "民主；民主国家",
      "In a {democracy}, people choose their leaders.|legislation opposition | Free newspapers are important in a {democracy}.|legislation authority | The country became a {democracy} in 1990.|legislation opposition",
      "democrat demography",
    ),
    word(
      "parliament parliaments",
      "the group of people elected to make a country's laws",
      "议会；国会",
      "{Parliament} passed a new law yesterday.|Opposition Regime | She was elected to {parliament} in 2015.|legislation regime | Members of {parliament} debate new laws.|legislation authority",
      "apartment parlor",
    ),
    word(
      "president presidents",
      "the leader of a country that has no king or queen; the head of an organization",
      "总统；主席",
      "The {president} gave a speech on television.|legislation parliament | Who will be the next {president}?|legislation opposition | She is the {president} of the student union.|legislation regime",
      "precedent resident",
    ),
    word(
      "minister ministers",
      "a member of a government who is in charge of one area, such as health",
      "部长；大臣",
      "The health {minister} visited the hospital.|legislation parliament | Several {ministers} lost their jobs after the scandal.|legislations parliaments | The prime {minister} met the president.|parliament regime",
      "monster ministry",
    ),
    word(
      "policy policies",
      "a plan of what to do that a government, a company or a person has agreed on",
      "政策；方针",
      "The government has changed its {policy} on immigration.|minister president | The company has a strict {policy} on phones at work.|parliament regime | Their new {policies} will help small businesses.|parliaments presidents",
      "police politics",
    ),
    word(
      "elect elects elected electing",
      "to choose someone for a job by voting",
      "选举",
      "The people {elected} a new president.|regime authority | She was {elected} mayor last year.|regime authority | Citizens {elect} a new parliament every five years.|regime authority",
      "erect eject",
    ),
    word(
      "opposition",
      "strong disagreement with a plan; the parties in a parliament that are not in the government",
      "反对；反对党",
      "The {opposition} voted against the plan.|legislation monarchy | There was strong {opposition} to the new airport.|legislation authority | The leader of the {opposition} asked the minister a question.|legislation republic",
      "position opposite",
    ),
    word(
      "legislation",
      "a law or a group of laws",
      "法规；立法",
      "New {legislation} protects workers' rights.|opposition monarchy | The {legislation} was passed by parliament last year.|opposition republic | Parliament is debating {legislation} on online safety.|opposition authority",
      "legislator registration",
    ),
    word(
      "authority authorities",
      "the power to give orders; an official organization; an expert",
      "权力；当局；权威",
      "The local {authorities} closed the road.|regimes republics | Teachers need {authority} in the classroom.|legislation republic | She is an {authority} on Chinese art.|regime republic",
      "author priority",
    ),
    word(
      "regime regimes",
      "a government, especially one that was not elected fairly",
      "政权",
      "The military {regime} arrested its critics.|legislation opposition | The old {regime} fell in 1989.|legislation opposition | People lived in fear under the {regime}.|census treaty",
      "regiment region",
    ),
    word(
      "republic republics",
      "a country with an elected president and no king or queen",
      "共和国",
      "France is a {republic}, not a monarchy.|legislation opposition | The {republic} was founded in 1949.|legislation opposition | The country became a {republic} when the king left.|legislation opposition",
      "public replica",
    ),
    word(
      "monarchy monarchies",
      "a system in which a king or a queen rules; a country with this system",
      "君主制；君主国",
      "Britain still has a {monarchy}.|legislation opposition | The {monarchy} was abolished in 1912.|president minister | Some people want to end the {monarchy}.|minister president",
      "anarchy monastery",
    ),
  ],
});

const socialIssues = vocabularyTopic({
  id: "b2-words-social-issues",
  title: t("Social Issues", "社会问题"),
  summary: t(
    "Hunger, corruption and violence; abuse, exploitation and neglect; homelessness and isolation; the unemployed, the deprived, the vulnerable and the marginalized.",
    "饥饿、腐败和暴力；虐待、剥削和忽视；无家可归和孤立；失业者、贫困者、弱势者和被边缘化的人。",
  ),
  prerequisites: ["b1-words-city-problems"],
  words: [
    word(
      "hunger",
      "the state of not having enough food",
      "饥饿",
      "Millions of children suffer from {hunger}.|corruption unemployed | The charity fights {hunger} in poor regions.|unemployed deprived | After the long walk, we were weak with {hunger}.|corruption violence",
      "hanger anger",
    ),
    word(
      "corruption",
      "dishonest behavior by people in power, such as taking money for favors",
      "腐败；贪污",
      "The minister was arrested for {corruption}.|hunger homelessness | {Corruption} wastes public money.|Hunger Isolation | The new law aims to stop {corruption} in the police.|hunger homelessness",
      "corporation correction",
    ),
    word(
      "violence",
      "behavior that hurts or kills people",
      "暴力",
      "The film has too much {violence} for children.|hunger homelessness | {Violence} is never the answer.|Hunger Isolation | Police are worried about rising {violence} in the area.|hunger vulnerable",
      "violin violet",
    ),
    word(
      "abuse abuses abused abusing",
      "cruel treatment of a person or an animal; the wrong use of something",
      "虐待；滥用",
      "The {abuse} of power is a serious crime.|hunger homelessness | He was accused of {abusing} his position to help his friends.|neglecting isolating | Drug {abuse} is a growing problem.|hunger isolation",
      "amuse accuse",
      "exploit",
    ),
    word(
      "exploit exploits exploited exploiting",
      "to treat people unfairly to get something from them; to use something well",
      "剥削；利用；开发",
      "Some factories {exploit} children as cheap workers.|settle evolve | Big companies {exploited} the country's oil.|settled evolved | We should {exploit} the sun's energy better.|settle evolve",
      "explode explore",
      "abuse",
    ),
    word(
      "homelessness",
      "the state of having no home",
      "无家可归",
      "{Homelessness} has risen in the city this winter.|Unemployed Vulnerable | The charity helps people facing {homelessness}.|vulnerable deprived | Rising rents are a major cause of {homelessness}.|unemployed deprived",
      "helplessness hopelessness",
    ),
    word(
      "neglect neglects neglected neglecting",
      "to fail to take care of someone or something; the state of not being looked after",
      "忽视；疏于照顾",
      "The old house fell into ruin through {neglect}.|unemployed vulnerable | Parents who {neglect} their children may lose them.|hunger corruption | The garden was {neglected} for years.|unemployed deprived",
      "negative reject",
    ),
    word(
      "isolation",
      "the state of being alone or away from other people",
      "孤立；隔离",
      "Many old people live in {isolation}.|corruption unemployed | The patient was kept in {isolation} for a week.|corruption hunger | The island's {isolation} protected its rare animals.|corruption violence",
      "insulation installation",
    ),
    word(
      "unemployed",
      "without a paid job",
      "失业的",
      "He has been {unemployed} since the factory closed.|homelessness corruption | The number of {unemployed} people is falling.|violence hunger | The government helps the {unemployed} find work.|hunger corruption",
      "employed unemployment",
    ),
    word(
      "deprived",
      "without the money, food or other things that people need",
      "贫困的；被剥夺的",
      "Children from {deprived} areas often do worse at school.|hunger corruption | The prisoners were {deprived} of sleep.|isolation hunger | The charity works in the most {deprived} parts of the city.|hunger violence",
      "derived depraved",
    ),
    word(
      "vulnerable",
      "easily hurt or harmed",
      "脆弱的；易受伤害的",
      "Old people are {vulnerable} to the flu.|unemployed deprived | The charity protects {vulnerable} children.|hunger corruption | She felt {vulnerable} walking home alone at night.|unemployed corruption",
      "valuable venerable",
    ),
    word(
      "marginalized",
      "treated as unimportant and kept at the edge of society",
      "被边缘化的",
      "The program helps {marginalized} groups find work.|hunger corruption | Many minorities feel {marginalized} by society.|hunger violence | Their voices have been {marginalized} for too long.|unemployed hunger",
      "marginal magnetized",
    ),
  ],
});

const trends = vocabularyTopic({
  id: "b2-words-trends",
  title: t("Describing Trends", "描述趋势"),
  summary: t(
    "Widespread and increasingly; considerably, dramatically and relatively; largely, mainly and mostly; nearly, approximately, roughly and virtually.",
    "广泛的和越来越；相当、显著和相对；主要地、大多；几乎、大约、大致和差不多。",
  ),
  prerequisites: ["b1-words-numbers-and-amounts"],
  words: [
    word(
      "widespread",
      "happening or found in many places or among many people",
      "广泛的；普遍的",
      "There is {widespread} concern about the new law.|increasingly largely | Smartphone use is now {widespread} in rural areas.|increasingly relatively | The storm caused {widespread} damage.|mainly nearly",
      "widely spreading",
    ),
    word(
      "increasingly",
      "more and more",
      "越来越",
      "It is becoming {increasingly} difficult to find a cheap flat.|widespread approximately | Online shopping is {increasingly} popular.|widespread approximately | People are {increasingly} worried about climate change.|widespread approximately",
      "increasing incredibly",
    ),
    word(
      "considerably",
      "by a large amount; a lot",
      "相当地；大大地",
      "Prices have risen {considerably} this year.|widespread approximately | The new flat is {considerably} bigger than the old one.|widespread approximately | Her health has improved {considerably}.|widespread nearly",
      "considerately considerable",
      "dramatically",
    ),
    word(
      "dramatically",
      "suddenly and by a very large amount",
      "急剧地；显著地",
      "Temperatures fell {dramatically} overnight.|widespread approximately | The number of tourists has increased {dramatically}.|widespread nearly | Life changed {dramatically} after the baby was born.|widespread virtually",
      "dramatic traumatically",
      "considerably",
    ),
    word(
      "relatively",
      "when compared with other things",
      "相对地；比较",
      "The test was {relatively} easy.|widespread approximately | Housing here is {relatively} cheap compared with the capital.|widespread approximately | The disease is {relatively} rare.|widespread approximately",
      "relative related",
    ),
    word(
      "largely",
      "mostly, but not completely",
      "主要地；在很大程度上",
      "The success of the project was {largely} due to her hard work.|widespread approximately | The area is {largely} desert.|widespread dramatically | The report was {largely} ignored.|widespread approximately",
      "large lately",
      "mainly mostly",
    ),
    word(
      "mainly",
      "more than anything else; in most cases",
      "主要地",
      "The students are {mainly} from Asia.|widespread dramatically | I {mainly} eat vegetables.|widespread dramatically | The weather will be {mainly} dry.|widespread considerably",
      "manly namely",
      "largely mostly",
    ),
    word(
      "mostly",
      "almost all; usually",
      "大多；通常",
      "The audience was {mostly} teenagers.|widespread dramatically | It's {mostly} sunny in July.|widespread considerably | We {mostly} stay at home on Sundays.|widespread dramatically",
      "most almost",
      "largely mainly",
    ),
    word(
      "nearly",
      "almost; not quite",
      "几乎；差不多",
      "It's {nearly} midnight.|widespread dramatically | I {nearly} missed the bus.|widespread considerably | {Nearly} all the students passed.|Widespread Dramatically",
      "near neatly",
      "approximately roughly virtually",
    ),
    word(
      "approximately",
      "close to an exact number, but not exactly",
      "大约",
      "The journey takes {approximately} three hours.|widespread dramatically | {Approximately} 40 percent of the land is forest.|Widespread Dramatically | The city has a population of {approximately} two million.|widespread considerably",
      "approvingly appropriately",
      "nearly roughly",
    ),
    word(
      "roughly",
      "about; not exactly",
      "大致；粗略地",
      "There were {roughly} fifty people at the meeting.|widespread dramatically | {Roughly} half of them agreed.|Widespread Dramatically | The two cities are {roughly} the same size.|widespread dramatically",
      "rough rudely",
      "nearly approximately",
    ),
    word(
      "virtually",
      "almost completely",
      "几乎；实际上",
      "The town was {virtually} empty in August.|widespread dramatically | It's {virtually} impossible to park here.|widespread considerably | {Virtually} every home now has the internet.|Widespread Dramatically",
      "virtual visually",
      "nearly",
    ),
  ],
});

const generations = vocabularyTopic({
  id: "b2-words-generations",
  title: t("Generations", "代际"),
  summary: t(
    "Seniors and youngsters; adolescents and adolescence; infants and toddlers; the middle-aged and the aged; lifespan and life expectancy; caregivers and nursing.",
    "老年人和年轻人；青少年和青春期；婴儿和幼儿；中年人和老年人；寿命和预期寿命；照护者和护理。",
  ),
  prerequisites: ["b1-words-family-life"],
  words: [
    word(
      "senior seniors",
      "an older person, especially one over 60; higher in rank",
      "老年人；高级的",
      "The bus is free for {seniors} over 65.|toddlers infants | The club offers yoga for {seniors}.|lifespans expectancies | She is a {senior} doctor at the hospital.|toddler infant",
      "sensor serious",
    ),
    word(
      "youngster youngsters",
      "a young person or a child",
      "年轻人；孩子",
      "The club keeps {youngsters} off the streets.|lifespans expectancies | As a {youngster}, he loved football.|lifespan caregiver | The coach trains {youngsters} aged 10 to 16.|lifespans seniors",
      "younger youngest",
      "adolescent",
    ),
    word(
      "adolescent adolescents",
      "a young person who is becoming an adult; a teenager",
      "青少年",
      "{Adolescents} often need more sleep than adults.|Lifespans Expectancies | The book is written for {adolescents}.|lifespans adolescence | She works with troubled {adolescents}.|lifespans expectancies",
      "adult obsolescent",
      "youngster",
    ),
    word(
      "adolescence",
      "the time of life when a child is becoming an adult",
      "青春期",
      "{Adolescence} is a time of rapid change.|Infant Lifespan | She spent her {adolescence} in Shanghai.|adolescent lifespan | Many problems begin in {adolescence}.|adolescent expectancy",
      "adolescent absence",
    ),
    word(
      "infant infants",
      "a baby or a very young child",
      "婴儿",
      "The nurse fed the {infant} with a bottle.|senior lifespan | {Infants} sleep for most of the day.|Lifespans Expectancies | The hospital has a unit for sick {infants}.|lifespans expectancies",
      "infantry infect",
      "toddler",
    ),
    word(
      "toddler toddlers",
      "a young child who is just learning to walk",
      "学步的幼儿",
      "{Toddlers} are learning to walk and talk.|Seniors Lifespans | Our {toddler} said his first words today.|lifespan expectancy | The park has a play area for {toddlers}.|lifespans expectancies",
      "toddle peddler",
      "infant",
    ),
    word(
      "middle-aged",
      "neither young nor old, about 45 to 65 years old",
      "中年的",
      "My parents are {middle-aged} now.|adolescence lifespan | A {middle-aged} man asked me the way.|nursing expectancy | Many {middle-aged} people look after children and parents at once.|lifespan expectancy",
      "medium-sized middleman",
    ),
    word(
      "lifespan lifespans",
      "the length of time that a person, an animal or a thing lives or lasts",
      "寿命",
      "The average {lifespan} of a dog is about twelve years.|nursing adolescence | Good food can extend your {lifespan}.|nursing adolescence | Some insects have a {lifespan} of only one day.|caregiver nursing",
      "lifestyle lifeguard",
    ),
    word(
      "expectancy",
      "the number of years a person is expected to live (life expectancy)",
      "预期（寿命）",
      "Life {expectancy} in Japan is over 84 years.|lifespan nursing | Life {expectancy} has risen because of better healthcare.|nursing adolescence | Women have a higher life {expectancy} than men.|nursing adolescence",
      "expectation expectant",
    ),
    word(
      "caregiver caregivers",
      "a person who looks after someone who is old, ill or a child",
      "照护者",
      "She is the main {caregiver} for her elderly mother.|infant toddler | {Caregivers} need support too.|Lifespans Expectancies | The {caregiver} helps him wash and dress every morning.|lifespan expectancy",
      "carefree career",
    ),
    word(
      "nursing",
      "the job of caring for people who are ill, injured or old",
      "护理",
      "My aunt works in {nursing}.|lifespan expectancy | Grandma moved into a {nursing} home.|lifespan adolescence | She studied {nursing} at university.|expectancy lifespan",
      "nurturing nursery",
    ),
    word(
      "aged",
      "very old; of the age of",
      "年老的；……岁的",
      "Children {aged} between six and twelve can join.|middle-aged nursing | She cares for her {aged} parents.|toddler adolescence | The home looks after the sick and the {aged}.|nursing lifespan",
      "agent edged",
    ),
  ],
});

const linking = vocabularyTopic({
  id: "b2-words-linking-1",
  title: t("Linking Words 3", "连接词（三）"),
  summary: t(
    "Adding with furthermore and moreover; contrasting with nevertheless, nonetheless, whereas and despite; results with consequently, hence and thus; likewise, similarly and namely.",
    "用 furthermore、moreover 补充；用 nevertheless、nonetheless、whereas、despite 表示对比；用 consequently、hence、thus 表示结果；likewise、similarly 和 namely。",
  ),
  prerequisites: ["b1-words-little-words-5"],
  words: [
    word(
      "furthermore",
      "in addition to what has been said (formal)",
      "此外；而且",
      "The flat is cheap. {Furthermore}, it is close to the station.|Nevertheless Consequently | Exercise improves health. {Furthermore}, it makes you feel happier.|Whereas Nevertheless | The plan is too expensive; {furthermore}, nobody wants it.|whereas namely",
      "further furthest",
      "moreover",
    ),
    word(
      "moreover",
      "in addition; and more importantly (formal)",
      "此外；而且",
      "The hotel was dirty. {Moreover}, the staff were rude.|Nevertheless Namely | The job is well paid; {moreover}, it is interesting.|nonetheless hence | Walking is free. {Moreover}, it is good for the planet.|Despite Whereas",
      "more however",
      "furthermore",
    ),
    word(
      "nevertheless",
      "in spite of what has just been said",
      "然而；尽管如此",
      "It was raining. {Nevertheless}, we went for a walk.|Moreover Consequently | The task was difficult; {nevertheless}, she finished it.|moreover hence | He is rich but {nevertheless} unhappy.|consequently namely",
      "never neither",
      "nonetheless",
    ),
    word(
      "nonetheless",
      "in spite of this; however",
      "尽管如此；然而",
      "The film was long. It was, {nonetheless}, very enjoyable.|consequently namely | The risks are small; {nonetheless}, we must be careful.|moreover hence | She was tired. {Nonetheless}, she kept working.|Consequently Likewise",
      "nonsense nowhere",
      "nevertheless",
    ),
    word(
      "whereas",
      "used to compare two facts and show how they are different",
      "然而；反之（连接两个对比的句子）",
      "My brother loves sport, {whereas} I prefer reading.|moreover consequently | Some people work from home, {whereas} others go to the office.|despite hence | {Whereas} the north is dry, the south gets a lot of rain.|Despite Thus",
      "whereby wherever",
    ),
    word(
      "despite",
      "without being stopped by something; in spite of (followed by a noun or an -ing form)",
      "尽管（后接名词或 -ing 形式）",
      "We went out {despite} the rain.|whereas moreover | {Despite} his age, he runs every day.|Whereas Moreover | She got the job {despite} having no experience.|whereas hence",
      "despise respite",
    ),
    word(
      "consequently",
      "as a result",
      "因此；结果",
      "He didn't study. {Consequently}, he failed the exam.|Nevertheless Likewise | The roads were icy and, {consequently}, many schools closed.|nevertheless namely | Sales fell; {consequently}, the shop closed.|nevertheless likewise",
      "consistently conveniently",
      "hence thus",
    ),
    word(
      "hence",
      "for this reason (formal)",
      "因此",
      "The bridge was closed, {hence} the delay.|whereas despite | The fruit is grown locally, {hence} its low price.|whereas nevertheless | Prices have risen; {hence} people are buying less.|whereas despite",
      "fence whence",
      "consequently thus",
    ),
    word(
      "thus",
      "in this way; as a result (formal)",
      "因此；这样",
      "The new road is shorter, {thus} saving time.|whereas despite | She worked hard and {thus} passed easily.|whereas despite | Water was scarce. {Thus}, farmers had to share it.|Whereas Despite",
      "though thud",
      "consequently hence",
    ),
    word(
      "likewise",
      "in the same way; also",
      "同样地",
      "Tom said sorry, and Anna did {likewise}.|whereas despite | Smoking is banned inside. {Likewise}, phones must be switched off.|Despite Whereas | Children need sleep; {likewise}, adults need rest.|despite hence",
      "likely likeness",
      "similarly",
    ),
    word(
      "similarly",
      "in a similar way",
      "同样地；类似地",
      "Cats sleep a lot. {Similarly}, lions rest for most of the day.|Despite Whereas | The twins dress {similarly}.|despite hence | Prices rose in Beijing; {similarly}, rents went up in Shanghai.|despite whereas",
      "simply familiarly",
      "likewise",
    ),
    word(
      "namely",
      "used to say exactly who or what you mean",
      "即；也就是",
      "Two students were late, {namely} Tom and Li.|despite hence | The problem is simple, {namely} a lack of money.|despite whereas | Three cities, {namely} Beijing, Shanghai and Shenzhen, will host the event.|hence despite",
      "name nearly",
    ),
  ],
});

const opinionVerbs = vocabularyTopic({
  id: "b2-words-opinion-verbs",
  title: t("Verbs of Argument", "论证动词"),
  summary: t(
    "Asserting, maintaining and insisting; acknowledging and conceding; emphasizing; denying, disputing, challenging and rejecting; proposing and advocating.",
    "断言、坚持和坚决要求；承认和让步；强调；否认、质疑、挑战和拒绝；提议和倡导。",
  ),
  prerequisites: ["b1-words-opinions"],
  words: [
    word(
      "assert asserts asserted asserting",
      "to say firmly that something is true",
      "断言；坚称",
      "She {asserted} that she was innocent.|rejected advocated | He {asserts} that the earth is getting cooler, but the data say otherwise.|rejects advocates | It is important to {assert} yourself at work.|propose advocate",
      "assort insert",
      "maintain insist",
    ),
    word(
      "maintain maintains maintained maintaining",
      "to keep saying that something is true, even when others disagree",
      "坚持（认为）；维持",
      "He {maintained} his innocence until the end.|proposed advocated | She {maintains} that the plan will work.|rejects advocates | Critics {maintain} that the test is unfair.|reject advocate",
      "maintenance obtain",
      "assert insist",
    ),
    word(
      "acknowledge acknowledges acknowledged acknowledging",
      "to accept or admit that something is true; to say that you have received something",
      "承认；确认收到",
      "The minister {acknowledged} that mistakes had been made.|advocated proposed | Please {acknowledge} receipt of this letter.|advocate dispute | She never {acknowledges} help from others.|advocates proposes",
      "knowledge acknowledgment",
      "concede",
    ),
    word(
      "emphasize emphasizes emphasized emphasizing",
      "to show that something is very important",
      "强调",
      "The teacher {emphasized} that spelling matters.|rejected advocated | I want to {emphasize} one point: safety comes first.|reject deny | She {emphasized} each word by speaking slowly.|rejected advocated",
      "empathize emphasis",
    ),
    word(
      "insist insists insisted insisting",
      "to say firmly that something is true or must happen",
      "坚持；坚决要求",
      "He {insisted} on paying for dinner.|advocated proposed | She {insists} that she saw a ghost.|advocates proposes | I {insist}: you must stay for lunch.|advocate deny",
      "insert consist",
      "assert maintain",
    ),
    word(
      "deny denies denied denying",
      "to say that something is not true",
      "否认",
      "He {denied} stealing the money.|insisted asserted | She {denies} that she was there.|advocates proposes | There's no {denying} that the city has improved.|proposing advocating",
      "defy delay",
      "dispute reject",
    ),
    word(
      "dispute disputes disputed disputing",
      "to say that something is not correct or not true; to argue about something",
      "质疑；争论",
      "The two countries {dispute} the border.|advocate insist | Workers {disputed} the company's figures.|advocated insisted | Scientists still {dispute} the cause of the disease.|advocate insist",
      "dispose despite",
      "deny challenge reject",
    ),
    word(
      "challenge challenges challenged challenging",
      "to question whether something is right or true; to test someone's skill",
      "质疑；挑战",
      "Nobody dared to {challenge} the boss's decision.|advocate insist | The lawyer {challenged} the evidence in court.|advocated insisted | Good teachers {challenge} their students to think.|propose insist",
      "change chance",
      "dispute",
    ),
    word(
      "propose proposes proposed proposing",
      "to suggest a plan or an idea; to ask someone to marry you",
      "提议；求婚",
      "I {propose} that we meet again next week.|deny dispute | The government has {proposed} a new tax.|insisted conceded | He {proposed} to her on the beach.|advocated insisted",
      "purpose oppose",
    ),
    word(
      "advocate advocates advocated advocating",
      "to support a plan or an idea in public; a person who does this",
      "倡导；拥护者",
      "She {advocates} free education for all.|concedes insists | Doctors {advocate} regular exercise.|insist concede | He is a strong {advocate} of electric cars.|insist concede",
      "avocado allocate",
    ),
    word(
      "reject rejects rejected rejecting",
      "to refuse to accept or agree with something",
      "拒绝；否决",
      "The committee {rejected} the plan.|insisted conceded | She {rejected} his offer of help.|insisted asserted | Voters {rejected} the proposal in a referendum.|insisted asserted",
      "eject inject",
      "deny dispute",
    ),
    word(
      "concede concedes conceded conceding",
      "to admit, often unwillingly, that something is true; to allow the other side a point or a win",
      "（勉强）承认；让步；认输",
      "He finally {conceded} that he was wrong.|advocated rejected | The team {conceded} two goals in the first half.|advocated asserted | The candidate {conceded} defeat on election night.|advocated insisted",
      "conceive conceal",
      "acknowledge",
    ),
  ],
});

// The third conditional.

/**
 * pastIfs are the subject of the if-clause, the base form, the past participle and the past simple of its verb, the
 * rest of the if-clause, and the subject, the base form and the past participle of the verb and the rest of the result.
 */
const pastIfs: readonly (readonly [string, string, string, string, string, string, string, string, string])[] = [
  ["they", "vote", "voted", "voted", "", "the result", "be", "been", "different"],
  ["I", "know", "known", "knew", "about the party", "I", "come", "come", ""],
  ["she", "leave", "left", "left", "earlier", "she", "catch", "caught", "the train"],
  ["we", "book", "booked", "booked", "a table", "we", "get", "got", "a seat"],
  ["you", "study", "studied", "studied", "harder", "you", "pass", "passed", "the exam"],
  ["he", "save", "saved", "saved", "more money", "he", "buy", "bought", "a house"],
  ["it", "rain", "rained", "rained", "in May", "the crops", "grow", "grown", "better"],
  ["the doctors", "test", "tested", "tested", "the drug properly", "they", "find", "found", "the problem"],
  ["I", "see", "seen", "saw", "the sign", "I", "stop", "stopped", ""],
  ["Lin", "ask", "asked", "asked", "for help", "her teacher", "help", "helped", "her"],
  ["the factory", "stay", "stayed", "stayed", "open", "the town", "keep", "kept", "its jobs"],
  ["we", "listen", "listened", "listened", "to the warning", "we", "leave", "left", "the beach"],
  ["you", "tell", "told", "told", "me", "I", "understand", "understood", ""],
  ["they", "build", "built", "built", "a higher wall", "the town", "stay", "stayed", "dry"],
  ["he", "check", "checked", "checked", "the weather", "he", "take", "taken", "a coat"],
  ["the team", "train", "trained", "trained", "harder", "it", "win", "won", "the cup"],
  ["she", "apply", "applied", "applied", "for the job", "she", "get", "got", "it"],
  ["I", "wake", "woken", "woke", "up on time", "I", "arrive", "arrived", "before nine"],
  ["the city", "plant", "planted", "planted", "more trees", "the streets", "be", "been", "cooler"],
  ["you", "call", "called", "called", "me", "I", "pick", "picked", "you up"],
  ["the government", "act", "acted", "acted", "sooner", "fewer people", "lose", "lost", "their homes"],
];

const joinWords = (...parts: readonly string[]) => parts.filter((p) => p !== "").join(" ");
const pronouns = new Set(["I", "you", "he", "she", "it", "we", "they"]);
/** hadOf is the if-clause's subject with had, or with 'd after a pronoun, as a pattern. */
const hadOf = (subject: string) => (pronouns.has(subject) ? `[${subject} had|${subject}'d]` : `${subject} had`);
/** wouldHaveOf is the result's subject with would have, or with 'd have or would've after a pronoun, as a pattern. */
const wouldHaveOf = (subject: string, capital: boolean) => {
  const s = capital ? sentenceCase(subject) : subject;
  return pronouns.has(subject) ? `[${s} would have|${s}'d have|${s} would've]` : `${s} would have`;
};

const pastIfChoice: readonly ChoiceItem[] = interleave([
  pastIfs.map(
    ([s, , pp, past, rest, rs, , rpp, rr]): ChoiceItem => [
      `${joinWords("If", s, "___", rest)}, ${joinWords(rs, "would have", rpp, rr)}.`,
      `had ${pp}`,
      [`would have ${pp}`, past],
    ],
  ),
  pastIfs.map(
    ([s, , pp, past, rest, rs, , rpp, rr]): ChoiceItem => [
      `${joinWords(sentenceCase(rs), "would have", rpp, rr, "if", s, "___", rest)}.`,
      `had ${pp}`,
      [`would have ${pp}`, past],
    ],
  ),
]);

const wouldHaveChoice: readonly ChoiceItem[] = interleave([
  pastIfs.map(
    ([s, , pp, , rest, rs, , rpp, rr]): ChoiceItem => [
      `${joinWords("If", s, "had", pp, rest)}, ${joinWords(rs, "___", rr)}.`,
      `would have ${rpp}`,
      [`would had ${rpp}`, `had ${rpp}`],
    ],
  ),
  pastIfs.map(
    ([s, , pp, , rest, rs, , rpp, rr]): ChoiceItem => [
      `${joinWords(sentenceCase(rs), "___", rr, "if", s, "had", pp, rest)}.`,
      `would have ${rpp}`,
      [`would had ${rpp}`, `had ${rpp}`, `would have had ${rpp}`],
    ],
  ),
]);

const pastIfTyped: readonly TypedItem[] = interleave([
  pastIfs.map(
    ([s, base, pp, past, rest, rs, rbase, rpp, rr]): TypedItem => ({
      shown: `past, imagined: if ${joinWords(s, base, rest)} → ${joinWords(rs, rbase, rr)}`,
      accepted: [`${joinWords("If", hadOf(s), pp, rest)}, ${joinWords(wouldHaveOf(rs, false), rpp, rr)}.`],
      canonical: `${joinWords("If", s, "had", pp, rest)}, ${joinWords(rs, "would have", rpp, rr)}.`,
      wrong: [
        `${joinWords("If", s, past, rest)}, ${joinWords(rs, "would", rbase, rr)}.`,
        `${joinWords("If", s, "would have", pp, rest)}, ${joinWords(rs, "would have", rpp, rr)}.`,
      ],
    }),
  ),
  pastIfs.map(
    ([s, base, pp, past, rest, rs, rbase, rpp, rr]): TypedItem => ({
      shown: `past, imagined: ${joinWords(rs, rbase, rr)} ← if ${joinWords(s, base, rest)}`,
      accepted: [`${joinWords(wouldHaveOf(rs, true), rpp, rr, "if", hadOf(s), pp, rest)}.`],
      canonical: `${joinWords(sentenceCase(rs), "would have", rpp, rr, "if", s, "had", pp, rest)}.`,
      wrong: [
        `${joinWords(sentenceCase(rs), "would", rbase, rr, "if", s, past, rest)}.`,
        `${joinWords(sentenceCase(rs), "would had", rpp, rr, "if", s, "had", pp, rest)}.`,
      ],
    }),
  ),
]);

/** pastIfWhy explains had and the past participle in the if-part of a third conditional. */
const pastIfWhy = (right: string, shown: string): Text =>
  t(
    `The *if*-part imagines a past that did not happen, so it takes the past perfect, *had* and the past participle: ${fill(shown, right)}`,
    `*if* 部分想象的是没有发生的过去，所以用过去完成时，即 *had* 加过去分词：${fill(shown, right)}`,
  );

/** whyNotPastIf explains would or the past simple in the if-part of a third conditional. */
const whyNotPastIf = (wrong: string, right: string, _shown: string, position: number): Text =>
  position === 0
    ? t(`*would* never goes in the *if*-part. An imagined past takes *${right}*.`, `*if* 部分不能用 *would*。想象的过去要用 *${right}*。`)
    : t(
        `*${wrong}* is the past simple, which imagines the present, not the past. An imagined past takes *${right}*.`,
        `*${wrong}* 是一般过去时，想象的是现在，不是过去。想象的过去要用 *${right}*。`,
      );

/** wouldHaveWhy explains would have and the past participle in the result of a third conditional. */
const wouldHaveWhy = (right: string, shown: string): Text =>
  t(
    `The imagined result in the past takes *would have* and the past participle: ${fill(shown, right)}`,
    `对过去想象的结果用 *would have* 加过去分词：${fill(shown, right)}`,
  );

/** whyNotWouldHave explains would had, or had without would, in the result. */
const whyNotWouldHave = (wrong: string, right: string, _shown: string, position: number): Text =>
  position === 0
    ? t(
        `After *would* the verb is in its base form, so it is *have*, never *had*. Use *${right}*.`,
        `*would* 后面的动词用原形，所以是 *have*，不能用 *had*。要用 *${right}*。`,
      )
    : position === 1
      ? t(
          `*${wrong}* leaves out *would*, so it says what really happened before something else. The imagined result takes *${right}*.`,
          `*${wrong}* 漏掉了 *would*，说的是在另一件事之前真实发生的事。想象的结果要用 *${right}*。`,
        )
      : t(
          `*${wrong}* copies the *had* of the *if*-part into the result. The result takes *would have* and the past participle alone: *${right}*.`,
          `*${wrong}* 把 *if* 部分的 *had* 搬进了结果部分。结果部分只用 *would have* 加过去分词：*${right}*。`,
        );

/** pastIfWriteWhy explains how a third conditional is put together, with the comma when the if-part comes first. */
const pastIfWriteWhy = (right: string): Text =>
  right.startsWith("If ")
    ? t(
        `For an imagined past, the *if*-part takes *had* and the past participle, then a comma, and the result takes *would have* and the past participle: ${right}`,
        `想象过去时，*if* 部分用 *had* 加过去分词，后面加逗号，结果部分用 *would have* 加过去分词：${right}`,
      )
    : t(
        `For an imagined past, the result takes *would have* and the past participle, and the *if*-part after it takes *had* and the past participle, with no comma: ${right}`,
        `想象过去时，结果部分用 *would have* 加过去分词，后面的 *if* 部分用 *had* 加过去分词，不加逗号：${right}`,
      );

const thirdConditional: TopicDef = {
  id: "third-conditional",
  title: t("If I Had Known", "要是我早知道（第三条件句）"),
  summary: t(
    "If they had voted, the result would have been different. An imagined past takes the past perfect after if and would have with the past participle in the result.",
    "If they had voted, the result would have been different。想象过去的情况时，if 后面用过去完成时，结果部分用 would have 加过去分词。",
  ),
  prerequisites: ["second-conditional", "past-perfect"],
  encompasses: [
    { topic: "second-conditional", weight: 0.3 },
    { topic: "past-perfect", weight: 0.4 },
  ],
  xp: 30,
  strand: "grammar",
  knowledgePoints: [
    point(
      "if-part",
      t("Had done after if", "if 后面用 had 加过去分词"),
      t(
        "To imagine a different past, one that did not happen, use *if* + the **past perfect** (*had* + past participle):\n\n- *If they **had voted**, the result would have been different.* (They did not vote.)\n- *If I **had known** about the party, I would have come.* (I did not know.)\n\nThe *if*-part never takes *would*: not *If I would have known*. The past simple (*If I knew*) is for an imagined **present**, not for the past.",
        "想象一个与过去事实相反的情况时，用 *if* 加**过去完成时**（*had* 加过去分词）：\n\n- *If they **had voted**, the result would have been different.*（事实上他们没投票。）\n- *If I **had known** about the party, I would have come.*（事实上我不知道。）\n\n*if* 部分不能用 *would*：不能说 *If I would have known*。一般过去时（*If I knew*）是想象**现在**的情况，不是过去。中文说“要是我早知道”，靠“早”和“了”表示过去，英语则要靠动词形式 *had known*。",
      ),
      choiceGenerator(t("Choose the words for the gap.", "选出填入空白处的词。"), pastIfChoice, pastIfWhy, whyNotPastIf),
    ),
    point(
      "result",
      t("Would have done in the result", "结果部分用 would have 加过去分词"),
      t(
        "The imagined result in the past takes *would have* + the **past participle**: *If you had studied harder, you **would have passed** the exam.*\n\nAfter *would* the verb is always in the base form, so it is *would **have***, never *would had*. Do not leave out *would* either: *you had passed* says what really happened before something else.\n\nWhen the *if*-part comes first, put a comma after it. You can also say *might have* or *could have* when the result is less certain.",
        "过去想象的结果用 *would have* 加**过去分词**：*If you had studied harder, you **would have passed** the exam.*\n\n*would* 后面永远跟动词原形，所以是 *would **have***，不能说 *would had*。也不要省略 *would*：*you had passed* 说的是过去真实发生在另一件事之前的事。\n\n*if* 部分在前时后面加逗号。结果不太确定时，也可以用 *might have* 或 *could have*。",
      ),
      choiceGenerator(t("Choose the words for the gap.", "选出填入空白处的词。"), wouldHaveChoice, wouldHaveWhy, whyNotWouldHave),
    ),
    point(
      "write",
      t("Writing third conditionals", "写第三条件句"),
      t(
        "Write the sentence from the note about an imagined past. The arrow → means the *if*-part comes first: *if you study harder → you pass the exam* becomes *If you had studied harder, you would have passed the exam.* The arrow ← means the result comes first: *You would have passed the exam if you had studied harder.* You may write *you'd* for *you had* and *you would*, and *would've* for *would have*.",
        "根据笔记写一个想象过去的句子。箭头 → 表示 *if* 部分在前：*if you study harder → you pass the exam* 写成 *If you had studied harder, you would have passed the exam.* 箭头 ← 表示结果在前：*You would have passed the exam if you had studied harder.* 可以把 *you had* 和 *you would* 写成 *you'd*，把 *would have* 写成 *would've*。",
      ),
      typedGenerator(
        "sentence-pattern",
        t("Write a third conditional sentence from the note.", "根据笔记写一个第三条件句。"),
        pastIfTyped,
        pastIfWriteWhy,
      ),
    ),
  ],
};

/** topics are the topics of the unit Society and Change. */
export const topics: readonly TopicDef[] = [
  society.topic,
  population.topic,
  changeVerbs.topic,
  history.topic,
  warAndPeace.topic,
  politics.topic,
  socialIssues.topic,
  trends.topic,
  generations.topic,
  linking.topic,
  opinionVerbs.topic,
  thirdConditional,
];

/** vocabulary are the words the unit Society and Change teaches. */
export const vocabulary: readonly WordBatch[] = [
  society.batch,
  population.batch,
  changeVerbs.batch,
  history.batch,
  warAndPeace.batch,
  politics.batch,
  socialIssues.batch,
  trends.batch,
  generations.batch,
  linking.batch,
  opinionVerbs.batch,
];
