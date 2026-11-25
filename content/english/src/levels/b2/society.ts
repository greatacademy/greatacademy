// B2, unit 1: Society and Change. Society, population, change, history, war and peace, politics, social issues, trends,
// generations, linking words and verbs of argument; the third conditional. Its writing reuses the thesis statement of the
// native courses.

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { fill } from "../a2/kit.ts";
import { everyPair, interleave, sentenceCase, vocabularyTopic, word } from "../words.ts";
import { thirdConditionalWriteNot } from "./mistakes.ts";

const society = vocabularyTopic({
  id: "b2-words-society",
  title: t("Society", "社会"),
  summary: t(
    "Societies, institutions and norms; status and welfare; equality, inequality and diversity; prejudice, discrimination, racism and tolerance.",
    "社会、机构和规范；地位和福利；平等、不平等和多样性；偏见、歧视、种族主义和宽容。",
  ),
  intro: t(
    "Our class made a poster about a fair **society**: one with **equality** for everyone, **tolerance** of different views, and no **discrimination** because of race or religion. These words help you talk about how people live together and how fairly they are treated.",
    "我们班做了一张关于公平 **society**（社会）的海报：人人 **equality**（平等），对不同观点心怀 **tolerance**（宽容），不因种族或宗教而有 **discrimination**（歧视）。这些词帮你谈论人们如何共同生活、是否受到公平对待。",
  ),
  prerequisites: ["b1-words-culture"],
  words: [
    word(
      "society societies",
      "people living together, with their laws, customs and ways of life",
      "社会",
      "Our {society} values education, so every child goes to school. | Old people are treated with great respect in many {societies}.|norms prejudices | A good {society} looks after its weakest members.",
      "norm prejudice",
    ),
    word(
      "institution institutions",
      "a large, important organization, such as a university, a bank or a court",
      "机构；制度",
      "Schools, hospitals and banks are important {institutions}.|norms societies | The university is one of the oldest {institutions} in the country.|norms societies | People have lost trust in public {institutions} such as the courts.|norms societies",
      "norm society",
    ),
    word(
      "norm norms",
      "the usual or accepted way of behaving in a society",
      "规范；常态",
      "In some countries it is the {norm} to take off your shoes indoors. | Shaking hands is the {norm} when you meet someone at work. | Working from home has become the {norm} for many people.",
      "status welfare",
    ),
    word(
      "status",
      "the position or importance of a person or group in a society",
      "地位；身份",
      "Doctors have high {status} in most societies: people respect them. | Owning a car was once a {status} symbol that showed you were important. | What is your marital {status}: single or married?",
      "norm welfare",
    ),
    word(
      "welfare",
      "health, safety and comfort; help from the government for people who need it",
      "福利；幸福",
      "The government spends a lot on {welfare} for the poor. | Teachers care about the {welfare} of every child: their health and safety. | Animal {welfare} groups check how farms treat animals.",
      "status diversity",
    ),
    word(
      "equality",
      "the state of everyone having the same rights and chances",
      "平等",
      "Women fought for {equality} at work, demanding the same pay as men. | The law promises {equality} for all citizens: the same rights for everyone. | {Equality} means that everyone has the same rights.",
      "inequality diversity",
    ),
    word(
      "inequality inequalities",
      "an unfair difference between groups, for example in money or chances",
      "不平等",
      "The growing gap between rich and poor shows rising {inequality}. | {Inequalities} in health start early: poor children are ill more often.|Equalities Tolerances | Income {inequality} is a problem in many countries.",
      "equality tolerance",
    ),
    word(
      "diversity",
      "a wide range of different people or things",
      "多样性",
      "London is famous for its cultural {diversity}: people from every country live there. | The {diversity} of plants in the rainforest is amazing: there are thousands of kinds. | The company wants more {diversity} among its staff, hiring people of all backgrounds.",
      "equality prejudice",
    ),
    word(
      "prejudice prejudices",
      "an unfair opinion about a person or group, formed without knowing them",
      "偏见",
      "She faced {prejudice} because of her accent: people judged her before they knew her. | We must fight {prejudice} against older workers. | Travel can help people lose their {prejudices} and see others fairly.|tolerances diversities",
      "tolerance diversity",
      "discrimination racism",
    ),
    word(
      "discrimination",
      "treating a person or group worse than others because of who they are",
      "歧视",
      "{Discrimination} against women is against the law. | He suffered {discrimination} because of his religion, and was refused a job. | The report found {discrimination} in how flats were rented: some groups were turned away.",
      "tolerance diversity",
      "prejudice racism",
    ),
    word(
      "racism",
      "unfair treatment of people because of their race",
      "种族主义；种族歧视",
      "{Racism} is treating people badly because of their race. | The football club acted against {racism} in the stadium. | Many people marched to protest against {racism}.",
      "tolerance diversity",
      "prejudice discrimination",
    ),
    word(
      "tolerance",
      "being willing to accept views and ways of life that are different from yours",
      "宽容；容忍",
      "{Tolerance} means accepting views that are different from yours. | The city is known for its {tolerance} of different religions. | We should teach children {tolerance} and respect.",
      "prejudice racism",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Prejudice*, *discrimination* and *racism* are unfair, while *tolerance* and *diversity* are good. Look for words such as *against the law*, *refused a job* or *protest against* that show something unfair.",
        "*prejudice*、*discrimination* 和 *racism* 都不公平，*tolerance* 和 *diversity* 是好事。找找 *against the law*、*refused a job* 或 *protest against* 这类词，它们说明有不公平的事。",
      ),
      meaning: t(
        "A *norm* is the usual way of behaving, while *status* is your position or importance in a society. Check whether the meaning is about what people usually do or about how important someone is.",
        "*norm* 是通常的行为方式，*status* 是一个人在社会中的地位。看释义说的是人们通常怎么做，还是一个人有多重要。",
      ),
      spell: t(
        "*Prejudice* is pre + judice, with no d before the j; *tolerance* ends in -ance; *society* has ie: so · ci · e · ty.",
        "*prejudice* 是 pre + judice，j 前面没有 d；*tolerance* 以 -ance 结尾；*society* 中是 ie：so · ci · e · ty。",
      ),
    },
    notes: `
      society|a country that values education;respect for old people;caring for the weakest|a society is people living together with their laws and customs; a norm is a usual way of behaving|society 是社会；norm 是规范|norm/norms=a norm is a way of behaving, not a group of people who value or respect things=norm 是行为方式，不是重视或尊重什么的人群;prejudice/prejudices=a prejudice is an unfair opinion, not people living together=prejudice 是偏见，不是共同生活的人们|so · ci · e · ty|ie in the middle, four syllables|中间是 ie，四个音节
      institution|schools, hospitals and banks;an old university;courts people trust|an institution is a large, important organization; a norm is a usual way of behaving|institution 是机构；norm 是规范|norm/norms=a norm is a way of behaving, not a school, a university or a court=norm 是行为方式，不是学校、大学或法院;society/societies=a society is all the people living together, not one organization such as a bank=society 是全体共同生活的人，不是银行这样的单个组织|in · sti · tu · tion|in + stitute + ion, dropping the e|in + stitute + ion，去掉 e
      norm|taking off shoes indoors;shaking hands at work;working from home|a norm is the usual way of behaving; status is your position in society|norm 是规范、常态；status 是地位|status=status is a person's importance, not what people usually do=status 是人的地位，不是人们通常做的事;welfare=welfare is health and help, not the usual way of behaving=welfare 是福利，不是通常的行为方式|norm|nor + m|nor + m
      status|doctors who are respected;a car that showed importance;single or married|status is your position or importance in society; a norm is a usual way of behaving|status 是地位、身份；norm 是规范|norm=a norm is a usual way of behaving, not how high or important a person is=norm 是通常的行为方式，不是一个人地位的高低;welfare=welfare is health and help, not importance or being married=welfare 是福利，不是地位或婚姻状况|sta · tus|stat + us|stat + us
      welfare|money for the poor;children's health and safety;how farms treat animals|welfare is health and safety, or help from the government; status is importance|welfare 是福利；status 是地位|status=status is a person's importance, not help for the poor or children's safety=status 是地位，不是对穷人的帮助或孩子的安全;diversity=diversity is a range of different people, not help or safety=diversity 是多样性，不是帮助或安全|wel · fare|wel + fare, with one l, not *warfare*|wel + fare，一个 l，不要写成 *warfare*
      equality|the same pay as men;the same rights for all citizens;everyone with the same rights|equality is everyone having the same rights; inequality is unfair difference|equality 是平等；inequality 是不平等|inequality=inequality is unfair difference, but here everyone has the same rights and pay=inequality 是不平等，而这里人人权利和工资相同;diversity=diversity is a range of different people, not the same rights for all=diversity 是多样性，不是人人权利相同|e · qual · i · ty|equal + ity|equal + ity
      inequality|a gap between rich and poor;poor children ill more often;differences in income|inequality is an unfair difference between groups; equality is the same rights for all|inequality 是不平等；equality 是平等|equality/Equalities=equality means everyone is the same, but here there is a gap=equality 是人人相同，而这里存在差距;tolerance/Tolerances=tolerance is accepting others, not a gap in money or health=tolerance 是宽容，不是金钱或健康上的差距|in · e · qual · i · ty|in + equality|in + equality
      diversity|people from every country;thousands of kinds of plants;staff of all backgrounds|diversity is a range of different people or things; equality is the same rights for all|diversity 是多样性；equality 是平等|equality=equality is the same rights for everyone, not many different kinds of people or plants=equality 是人人权利相同，不是多种多样的人或植物;prejudice=prejudice is an unfair opinion, not something a city is famous for or a company wants=prejudice 是偏见，不是城市引以为荣或公司想要的东西|di · ver · si · ty|diverse drops its e and adds -ity|diverse 去掉 e 加 -ity
      prejudice|being judged for an accent;unfair ideas about older workers;ideas travel can change|prejudice is an unfair opinion formed without knowing someone; tolerance is accepting others|prejudice 是偏见；tolerance 是宽容|tolerance/tolerances=tolerance is accepting others, not judging someone before you know them=tolerance 是包容他人，不是未了解就评判;diversity/diversities=diversity is a range of different people, not an unfair opinion=diversity 是多样性，不是不公平的看法|prej · u · dice|pre + judice, with no d before the j|pre + judice，j 前面没有 d
      discrimination|unfair treatment of women;being refused a job for religion;groups turned away from flats|discrimination is treating someone worse because of who they are; tolerance is accepting them|discrimination 是歧视；tolerance 是宽容|tolerance=tolerance is accepting people, not refusing them jobs or flats=tolerance 是包容，不是拒绝给人工作或房子;diversity=diversity is a range of different people, not something against the law=diversity 是多样性，不是违法的事|dis · crim · i · na · tion|discriminate drops its e and adds -ion|discriminate 去掉 e 加 -ion
      racism|bad treatment because of race;something a football club acts against;something people march against|racism is unfair treatment because of race; tolerance is accepting differences|racism 是种族歧视；tolerance 是宽容|tolerance=tolerance is accepting differences, not something people protest against=tolerance 是包容差异，人们不会抗议它;diversity=diversity is a range of different people, not unfair treatment=diversity 是多样性，不是不公平对待|ra · cism|race drops its e and adds -ism|race 去掉 e 加 -ism
      tolerance|accepting different views;a city open to many religions;something taught with respect|tolerance is accepting views different from yours; prejudice is an unfair opinion|tolerance 是宽容；prejudice 是偏见|prejudice=prejudice is an unfair opinion, not accepting others or something taught with respect=prejudice 是偏见，不是包容他人或与尊重一起教的东西;racism=racism is unfair treatment because of race, not accepting different ways of life=racism 是种族歧视，不是包容不同的生活方式|tol · er · ance|toler + ance, with -ance|toler + ance，以 -ance 结尾
    `,
  },
});

const population = vocabularyTopic({
  id: "b2-words-population",
  title: t("Population", "人口"),
  summary: t(
    "Demographic change and the census; migrating, emigrating and refugees; settling and settlements; inhabitants, density, urbanization and decline.",
    "人口变化和人口普查；迁移、移居国外和难民；定居和定居点；居民、密度、城市化和减少。",
  ),
  intro: t(
    "Every ten years the **census** counts the people of our country. The last one showed **migration** from villages to cities, fast **urbanization**, and a **decline** in the number of farmers. These words help you talk about where people live and how populations change.",
    "我们国家每十年进行一次 **census**（人口普查）。上一次显示，人们从农村向城市 **migration**（迁移），**urbanization**（城市化）很快，农民人数在 **decline**（减少）。这些词帮你谈论人们住在哪里、人口如何变化。",
  ),
  prerequisites: ["b1-words-city-life"],
  words: [
    word(
      "demographic",
      "about the population and its groups, such as their ages; a group of people of one kind",
      "人口的；人群",
      "The {demographic} data show an aging population. | {Demographic} change means that there are now more old people than young ones. | The {demographic} make-up of the town has changed: more young families live here.",
      "democratic military",
    ),
    word(
      "census",
      "an official count of all the people in a country",
      "人口普查",
      "The government counts every person in a {census} every ten years. | According to the last {census}, the city has two million people. | The {census} asks questions about age, work and family.",
      "density migration",
    ),
    word(
      "migrate migrates migrated migrating",
      "to move from one place to another to live or work, or (of birds and animals) with the seasons",
      "迁移；迁徙",
      "Many birds {migrate} south for the winter and come back in spring. | Every year, thousands of workers {migrate} from poor regions to rich ones. | Whales {migrate} thousands of kilometers each year.",
      "settle decline",
      "emigrate",
    ),
    word(
      "migration",
      "the movement of people or animals from one place to another",
      "迁移；迁徙",
      "{Migration} from villages to cities has changed the country. | Scientists follow the {migration} of whales across the ocean. | Climate change may cause mass {migration}, as people leave their homes.",
      "density census",
    ),
    word(
      "emigrate emigrates emigrated emigrating",
      "to leave your own country to live in another one",
      "移居国外",
      "My uncle {emigrated} to Canada in 1990.|declined inhabited | Many young doctors want to {emigrate} because pay is low at home. | She is {emigrating} to Australia next month.|declining inhabiting",
      "decline inhabit",
      "migrate",
    ),
    word(
      "refugee refugees",
      "a person who has had to leave their country because of war or danger",
      "难民",
      "The war forced millions of {refugees} to leave their homes.|settlements censuses | The {refugee} camp had no clean water. | She came to Britain as a {refugee}, escaping the war at home.",
      "settlement census",
    ),
    word(
      "settle settles settled settling",
      "to go and live in a place and make it your home",
      "定居",
      "After years of travel, they {settled} in a small town and made it their home.|migrated declined | My grandparents {settled} here in the 1950s and never left.|migrated declined | Farmers {settled} along the river because the land was good.|migrated declined",
      "migrate decline",
    ),
    word(
      "settlement settlements",
      "a place where people have come to live, such as a small village",
      "定居点；聚居地",
      "Archaeologists found an ancient {settlement} near the lake, with houses and roads. | The first {settlements} were built near water.|censuses densities | The small {settlement} grew into a big city.",
      "census density",
    ),
    word(
      "inhabitant inhabitants",
      "a person or animal that lives in a place",
      "居民；栖息者",
      "The island has only 300 {inhabitants}.|censuses densities | The town's {inhabitants} voted against the new road.|censuses densities | The oldest {inhabitant} of the village is 104.",
      "census density",
    ),
    word(
      "density densities",
      "how many people or things there are in a space",
      "密度",
      "Hong Kong has a very high population {density}. | The {density} of traffic in the center is a problem. | Cities with high {densities} need good public transport.|censuses settlements",
      "census settlement",
    ),
    word(
      "urbanization",
      "the growth of towns and cities as people move to them",
      "城市化",
      "Rapid {urbanization} has created huge new cities in Asia. | {Urbanization} means that more people live in towns and cities. | Farmland is disappearing as towns spread because of {urbanization}.",
      "census decline",
    ),
    word(
      "decline declines declined declining",
      "to become smaller or fewer; a fall in amount or quality",
      "减少；衰退",
      "The number of farmers has {declined} sharply, from ten million to two.|settled migrated | The town went into {decline} when the mine closed. | Birth rates are {declining} in many countries.|settling migrating",
      "settle migrate",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "To *migrate* is to move from place to place, while to *settle* is to stay and make a place your home. Look for words such as *for the winter*, *made it their home* or *never left* that show whether people move or stay.",
        "*migrate* 是从一地迁到另一地，*settle* 是留下来把某地当家。找找 *for the winter*、*made it their home* 或 *never left* 这类词，看人们是迁走还是留下。",
      ),
      meaning: t(
        "A *census* is an official count of people, while *density* is how many people live in a space. Check whether the meaning is about counting or about how crowded a place is.",
        "*census* 是官方人口清点，*density* 是一块地方住了多少人。看释义说的是清点，还是拥挤程度。",
      ),
      spell: t(
        "*Emigrate* starts with e, not *immigrate*; *refugee* ends in -ee; *census* ends in -sus.",
        "*emigrate* 以 e 开头，不是 *immigrate*；*refugee* 以 -ee 结尾；*census* 以 -sus 结尾。",
      ),
    },
    notes: `
      demographic|data about an aging population;more old people than young;more young families in a town|demographic means about the population and its groups; democratic means about democracy|demographic 是人口的；democratic 是民主的|democratic=democratic is about voting and government, not about how old a population is=democratic 是关于投票和政府的，与人口年龄无关;military=military is about the army, not about who lives in a town=military 是军事的，与城镇居民构成无关|dem · o · graph · ic|demo + graphic|demo + graphic
      census|counting every person every ten years;the last count of two million people;questions about age and work|a census is an official count of people; density is how many live in a space|census 是人口普查；density 是密度|density=density is how crowded a place is, not an official count with questions=density 是拥挤程度，不是带问卷的官方清点;migration=migration is people moving, not counting them=migration 是人口迁移，不是清点人数|cen · sus|cen + sus, not *consensus*|cen + sus，不要写成 *consensus*
      migrate|birds going south for winter;workers moving to rich regions;whales travelling thousands of kilometers|to migrate is to move from one place to another; to settle is to stay|migrate 是迁移；settle 是定居|settle=settle means to stay and make a home, but here birds, workers and whales move far=settle 是定居下来，而这里鸟、工人和鲸都在远距离移动;decline=decline means to become fewer, not to move from place to place=decline 是减少，不是迁移|mi · grate|mi + grate|mi + grate
      migration|moving from villages to cities;whales crossing the ocean;people leaving their homes|migration is the movement of people or animals; density is how crowded a place is|migration 是迁移；density 是密度|density=density is how crowded a place is, not people or whales moving=density 是拥挤程度，不是人或鲸的移动;census=a census is a count of people, not movement=census 是人口清点，不是迁移|mi · gra · tion|migrate drops its e and adds -ion|migrate 去掉 e 加 -ion
      emigrate|leaving for Canada;doctors leaving because pay is low;moving to Australia|to emigrate is to leave your country to live abroad; to inhabit is to live in a place|emigrate 是移居国外；inhabit 是居住于|decline/declined/declining=decline means to become fewer, not to move to another country=decline 是减少，不是移居别国;inhabit/inhabited/inhabiting=inhabit means to live in a place, and it takes no *to*=inhabit 是居住于某地，后面不接 *to*|em · i · grate|e at the start for leaving, not *immigrate*|表示离开时以 e 开头，不是 *immigrate*
      refugee|millions forced to leave by war;a camp with no clean water;a child escaping a war|a refugee has had to leave because of war or danger; a settlement is a place to live|refugee 是难民；settlement 是定居点|settlement/settlements=a settlement is a place, not people forced to leave or a person escaping=settlement 是地方，不是被迫离开的人或逃难者;census/censuses=a census is a count of people, not a person escaping war=census 是人口普查，不是逃离战争的人|ref · u · gee|refuge + e, ending in -ee|refuge + e，以 -ee 结尾
      settle|making a small town home;grandparents who never left;farmers staying by a good river|to settle is to go and live in a place for good; to migrate is to keep moving|settle 是定居；migrate 是迁移|migrate/migrated=migrate means to move away, but here people stay and make a home=migrate 是迁走，而这里人们留下安家;decline/declined=decline means to become fewer, not to make a home=decline 是减少，不是安家|set · tle|a double t, and -le at the end|双写 t，以 -le 结尾
      settlement|ancient houses by a lake;the first homes near water;a village that became a city|a settlement is a place where people live; a census is a count|settlement 是定居点；census 是人口普查|census/censuses=a census is a count, not houses that were built or found=census 是人口清点，不是被建造或发现的房屋;density/densities=density is how crowded a place is, not the place itself=density 是拥挤程度，不是地方本身|set · tle · ment|settle + ment|settle + ment
      inhabitant|300 people on an island;people who voted against a road;the oldest person in a village|an inhabitant is a person who lives in a place; a census is a count|inhabitant 是居民；census 是人口普查|census/censuses=a census is a count of people, not the people who live there and vote=census 是人口清点，不是住在那里、会投票的人;density/densities=density is how crowded a place is, not a person who lives there=density 是拥挤程度，不是住在那里的人|in · hab · i · tant|inhabit + ant|inhabit + ant
      density|Hong Kong and its crowded streets;heavy traffic in the center;crowded cities that need transport|density is how many people or things are in a space; a census is a count|density 是密度；census 是人口普查|census/censuses=a census is a count every ten years, not how crowded a place or a road is=census 是每十年一次的清点，不是地方或道路的拥挤程度;settlement/settlements=a settlement is a place, not how crowded it is=settlement 是地方，不是拥挤程度|den · si · ty|dense drops its e and adds -ity|dense 去掉 e 加 -ity
      urbanization|huge new cities in Asia;more people in towns;towns spreading over farmland|urbanization is the growth of towns and cities; decline is a fall|urbanization 是城市化；decline 是减少|census=a census is a count of people, not the growth of cities=census 是人口清点，不是城市发展;decline=decline is a fall, but here cities grow and spread=decline 是减少，而这里城市在增长和扩张|ur · ban · i · za · tion|urban + ize + ation|urban + ize + ation
      decline|farmers falling from ten million to two;a town after its mine closed;falling birth rates|to decline is to become fewer or worse; to settle is to make a home|decline 是减少、衰退；settle 是定居|settle/settled/settling=settle means to make a home, not to become fewer=settle 是安家，不是减少;migrate/migrated/migrating=migrate means to move, but numbers and rates do not move from place to place=migrate 是迁移，而数字和比率不会迁移|de · cline|de + cline|de + cline
    `,
  },
});

const changeVerbs = vocabularyTopic({
  id: "b2-words-change-verbs",
  title: t("Verbs of Change", "表示变化的动词"),
  summary: t(
    "Transforming, evolving and adapting; adjusting, converting and modifying; abolishing, reforming and revolutionizing; undergoing, emerging and restoring.",
    "转变、演化和适应；调整、转换和修改；废除、改革和彻底改变；经历、出现和恢复。",
  ),
  intro: t(
    "Our town has **undergone** huge changes. The old mill was **converted** into flats, the church was **restored**, and online shopping has **transformed** the high street. These words help you describe different kinds of change, from small to complete.",
    "我们镇 **undergone**（经历）了巨大的变化。老磨坊 **converted**（改建）成了公寓，教堂得到 **restored**（修复），网购也 **transformed**（彻底改变）了商业街。这些词帮你描述各种变化，从细微调整到彻底改变。",
  ),
  prerequisites: ["b1-words-describing-change"],
  words: [
    word(
      "transform transforms transformed transforming",
      "to change something completely, usually so that it is better",
      "使彻底改变；改造",
      "The internet has {transformed} the way we shop: we now buy almost everything online.|abolished undergone | The old factory was {transformed} into an art gallery.|abolished undergone | Education can {transform} a person's life, opening doors that were closed.",
      "abolish undergo",
      "convert revolutionize",
    ),
    word(
      "evolve evolves evolved evolving",
      "to develop slowly over a long time",
      "演化；逐步发展",
      "Humans {evolved} slowly over millions of years.|abolished restored | The company has {evolved} from a small shop into a big business.|abolished restored | Languages {evolve} slowly as people use new words.",
      "abolish restore",
    ),
    word(
      "adapt adapts adapted adapting",
      "to change so that you fit a new situation; to change something for a new use",
      "适应；改编",
      "Animals must {adapt} to changes in their environment. | She {adapted} quickly to life in a new country.|adopted abolished | The book was {adapted} for television as a six-part series.|adopted abolished",
      "adopt abolish",
      "adjust",
    ),
    word(
      "adjust adjusts adjusted adjusting",
      "to change something a little; to get used to a new situation",
      "调整；适应",
      "You can {adjust} the seat to make it a little higher. | It took me a week to {adjust} to the time difference. | He {adjusted} his tie before the interview.|abolished emerged",
      "abolish emerge",
      "adapt modify",
    ),
    word(
      "convert converts converted converting",
      "to change something into a different form or use",
      "转换；改建",
      "They {converted} the garage into a bedroom.|abolished emerged | You can {convert} dollars into euros at the airport. | The bus company is {converting} its buses to electric power.|abolishing emerging",
      "abolish emerge",
      "transform",
    ),
    word(
      "modify modifies modified modifying",
      "to change something a little, to improve it or make it fit",
      "修改；改进",
      "The car was {modified} to run on electricity.|abolished emerged | We had to {modify} our plans a little because of the rain. | Scientists {modified} the plant so that it needs less water.|abolished emerged",
      "abolish emerge",
      "adjust",
    ),
    word(
      "abolish abolishes abolished abolishing",
      "to officially end a law, a system or a custom",
      "废除",
      "Many countries have {abolished} the death penalty, so it no longer exists there.|restored emerged | The school {abolished} its uniform rule: pupils can now wear what they like.|restored emerged | Slavery was {abolished} in the nineteenth century, when it became illegal.|restored emerged",
      "restore emerge",
    ),
    word(
      "reform reforms reformed reforming",
      "to change a system or an organization to make it better",
      "改革",
      "The government plans to {reform} the tax system to make it fairer. | The new minister promised to {reform} the schools and improve them. | Health care was {reformed} after the crisis to make it work better.|emerged undergone",
      "emerge undergo",
    ),
    word(
      "revolutionize revolutionizes revolutionized revolutionizing",
      "to change something completely, in a way that has a very great effect",
      "彻底改变；使革命化",
      "The smartphone has {revolutionized} how we communicate.|abolished restored | Electric cars could {revolutionize} transport, changing it completely. | The printing press {revolutionized} the spread of ideas.|abolished restored",
      "abolish restore",
      "transform",
    ),
    word(
      "undergo undergoes underwent undergone undergoing",
      "to experience a change or something unpleasant, such as an operation",
      "经历；接受（手术等）",
      "He {underwent} an operation on his knee.|emerged restored | The city is {undergoing} big changes.|emerging restoring | The building has {undergone} a complete restoration.|emerged restored",
      "emerge restore",
    ),
    word(
      "emerge emerges emerged emerging",
      "to appear or come out; to become known",
      "出现；浮现",
      "A new problem has {emerged}: nobody knew about it before.|undergone restored | The sun {emerged} from behind the clouds.|underwent restored | New technologies are {emerging} every year.|undergoing restoring",
      "undergo restore",
    ),
    word(
      "restore restores restored restoring",
      "to bring something back to how it was before",
      "恢复；修复",
      "They {restored} the old church to its original beauty.|emerged evolved | The police worked to {restore} order after the riot. | Electricity was {restored} after six hours without power.|emerged evolved",
      "emerge evolve",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "To *abolish* is to end a law or custom, while to *restore* is to bring something back. Look for words such as *no longer exists*, *became illegal* or *original beauty* that show whether something ends or returns.",
        "*abolish* 是废除法律或习俗，*restore* 是使恢复原样。找找 *no longer exists*、*became illegal* 或 *original beauty* 这类词，看事物是被终结，还是被恢复。",
      ),
      meaning: t(
        "To *adjust* is to change something a little, while to *transform* is to change it completely. Check whether the meaning is about a small change or a complete one.",
        "*adjust* 是稍作调整，*transform* 是彻底改变。看释义说的是小变化，还是彻底的变化。",
      ),
      spell: t(
        "*Undergo* has the past *underwent* and the participle *undergone*; *modify* becomes *modified*; *revolutionize* is revolution + ize.",
        "*undergo* 的过去式是 *underwent*，过去分词是 *undergone*；*modify* 变成 *modified*；*revolutionize* 是 revolution + ize。",
      ),
    },
    notes: `
      transform|shopping now done online;a factory turned into a gallery;a life opened up by education|to transform is to change completely; to abolish is to end officially|transform 是彻底改变；abolish 是废除|abolish/abolished=abolish means to end a law or custom, but here shopping, a building and a life go on in a new form=abolish 是废除法律或习俗，而这里购物、建筑和人生都以新形式继续;undergo/undergone=undergo means to experience a change, and it does not take *into* or change a life=undergo 是经历变化，不接 *into*，也不能改变人生|trans · form|trans + form|trans + form
      evolve|humans over millions of years;a shop growing into a business;languages taking new words|to evolve is to develop slowly; to restore is to bring back|evolve 是逐步演化；restore 是恢复|abolish/abolished=abolish means to end something, but here things keep growing=abolish 是废除，而这里事物在不断发展;restore/restored=restore means to bring back how it was, but here things become new=restore 是恢复原样，而这里事物变得不同|e · volve|e + volve, not *involve*|e + volve，不要写成 *involve*
      adapt|animals and a changing environment;life in a new country;a book made into a TV series|to adapt is to change to fit something new; to adopt is to take as your own|adapt 是适应、改编；adopt 是采用、收养|adopt/adopted=adopt means to take a child or an idea as your own, not to change to fit=adopt 是收养或采用，不是改变以适应;abolish/abolished=abolish means to end officially, not to fit a new life or become a TV series=abolish 是正式废除，不是适应新生活或改编成电视剧|a · dapt|a + dapt, with a, not *adopt*|a + dapt，是 a，不要写成 *adopt*
      adjust|a seat made a little higher;getting used to a time difference;a tie before an interview|to adjust is to change a little or get used to something; to abolish is to end it|adjust 是调整、适应；abolish 是废除|abolish/abolished=abolish means to end a law or custom, not to move a seat or a tie=abolish 是废除，不是调整座椅或领带;emerge/emerged=emerge means to appear, and it takes no object such as *the seat* or *his tie*=emerge 是出现，不能接 *the seat* 或 *his tie* 这样的宾语|ad · just|ad + just|ad + just
      convert|a garage turned into a bedroom;dollars changed into euros;buses moved to electric power|to convert is to change into a different form or use; to abolish is to end|convert 是转换、改建；abolish 是废除|abolish/abolished/abolishing=abolish means to end something, not to change it into something else=abolish 是废除，不是把它变成别的东西;emerge/emerged/emerging=emerge means to appear, and it takes no object such as *the garage*=emerge 是出现，不能接 *the garage* 这样的宾语|con · vert|con + vert|con + vert
      modify|a car changed to run on electricity;plans changed a little for rain;a plant that needs less water|to modify is to change something a little to improve it; to abolish is to end it|modify 是修改；abolish 是废除|abolish/abolished=abolish means to end something, but the car, plans and plant still exist in a changed form=abolish 是废除，而汽车、计划和植物都还在，只是改了;emerge/emerged=emerge means to appear, and it takes no object such as *the plant*=emerge 是出现，不能接 *the plant* 这样的宾语|mod · i · fy|modi + fy; y becomes i in *modified*|modi + fy；*modified* 里 y 变成 i
      abolish|a death penalty that no longer exists;a uniform rule ended;slavery made illegal|to abolish is to officially end; to restore is to bring back|abolish 是废除；restore 是恢复|restore/restored=restore means to bring back, but here the thing no longer exists or became illegal=restore 是恢复，而这里事物已不存在或变为非法;emerge/emerged=emerge means to appear, the opposite of ending something=emerge 是出现，和终结正相反|a · bol · ish|a + bol + ish, with one l|a + bol + ish，一个 l
      reform|a fairer tax system;better schools;health care that works better|to reform is to change a system to make it better; to undergo is to experience change|reform 是改革；undergo 是经历|emerge=emerge means to appear, and it takes no object such as *the schools*=emerge 是出现，不能接 *the schools* 这样的宾语;undergo/undergone=undergo means to experience something yourself, not to improve a system=undergo 是亲身经历，不是改进一个体系|re · form|re + form, not *perform*|re + form，不要写成 *perform*
      revolutionize|how we communicate;transport changed completely;the spread of ideas by printing|to revolutionize is to change completely with a great effect; to restore is to bring back|revolutionize 是彻底改变；restore 是恢复|abolish/abolished=abolish means to end something, but we still communicate, travel and share ideas=abolish 是废除，而我们仍在交流、出行、传播思想;restore/restored=restore means to bring back the old way, but here everything changes=restore 是恢复旧貌，而这里一切都变了|rev · o · lu · tion · ize|revolution + ize|revolution + ize
      undergo|a knee operation;big changes in a city;a complete restoration|to undergo is to experience a change or an operation; to emerge is to appear|undergo 是经历；emerge 是出现|emerge/emerged/emerging=emerge means to appear, and it takes no object such as *an operation* or *changes*=emerge 是出现，不能接 *an operation* 或 *changes* 这样的宾语;restore/restored/restoring=restore means to bring back, and you cannot restore *an operation* or *a restoration*=restore 是恢复，不能说恢复 *an operation* 或 *a restoration*|un · der · go|under + go; past *underwent*, participle *undergone*|under + go；过去式 *underwent*，过去分词 *undergone*
      emerge|a problem nobody knew about;the sun from behind clouds;new technologies each year|to emerge is to appear or become known; to undergo is to experience something|emerge 是出现；undergo 是经历|undergo/undergone/underwent/undergoing=undergo needs an object such as *an operation*, and it does not mean to appear=undergo 要接 *an operation* 这样的宾语，也不表示出现;restore/restored/restoring=restore means to bring back something old, not to appear for the first time=restore 是恢复旧物，不是首次出现|e · merge|e + merge|e + merge
      restore|a church back to its original beauty;order after a riot;power back after six hours|to restore is to bring back how it was; to emerge is to appear|restore 是恢复；emerge 是出现|emerge/emerged=emerge means to appear, and it takes no object such as *the church*=emerge 是出现，不能接 *the church* 这样的宾语;evolve/evolved=evolve means to develop into something new, not to bring back how it was=evolve 是演变成新的，不是恢复原样|re · store|re + store|re + store
    `,
  },
});

const history = vocabularyTopic({
  id: "b2-words-history",
  title: t("History", "历史"),
  summary: t(
    "Eras, decades and centuries; empires, dynasties and civilizations; revolutions, colonies and independence; conquering, invading and invasions.",
    "时代、十年和世纪；帝国、朝代和文明；革命、殖民地和独立；征服、入侵和侵略。",
  ),
  intro: t(
    "At the museum we walked through the **centuries**: from the rise of an ancient **civilization**, to a great **empire** with **colonies** around the world, to the **revolution** that brought **independence**. These words help you talk about the past and how countries changed.",
    "在博物馆里，我们一路走过几个 **centuries**（世纪）：从一个古老 **civilization**（文明）的兴起，到在世界各地拥有 **colonies**（殖民地）的庞大 **empire**（帝国），再到带来 **independence**（独立）的 **revolution**（革命）。这些词帮你谈论过去以及国家如何变迁。",
  ),
  prerequisites: ["b1-words-culture"],
  words: [
    word(
      "era eras",
      "a long period of history with a special character",
      "时代；纪元",
      "The film is set in the Victorian {era}. | We are living in a new {era} of technology. | The {era} of steam trains lasted about a hundred years.",
      "colony invasion",
    ),
    word(
      "decade decades",
      "a period of ten years",
      "十年",
      "Prices have doubled in the last {decade}, in just ten years. | He has worked here for two {decades}: twenty years.|centuries dynasties | The 1960s was a {decade} of great change.",
      "century dynasty",
      "century",
    ),
    word(
      "century centuries",
      "a period of a hundred years",
      "世纪；一百年",
      "The castle was built in the twelfth {century}, about 900 years ago. | Life has changed a lot over the last {century}, these hundred years. | Two {centuries} ago, in the 1820s, most people lived on farms.|decades eras",
      "decade era",
      "decade era",
    ),
    word(
      "empire empires",
      "a group of countries ruled by one ruler or one government",
      "帝国",
      "The {empire} once ruled half of Europe from one capital. | The Roman {empire} ruled many countries from one city. | The British {empire} had colonies all over the world.",
      "colony era",
      "dynasty",
    ),
    word(
      "dynasty dynasties",
      "a line of rulers from the same family",
      "朝代；王朝",
      "The Ming {dynasty}, a line of emperors from one family, ruled China for nearly 300 years. | The {dynasty} ended when the last emperor died without a son. | Several {dynasties} built parts of the Great Wall.|colonies eras",
      "colony era",
      "empire",
    ),
    word(
      "civilization civilizations",
      "a society with its own culture, cities and way of life",
      "文明",
      "The Maya built an advanced {civilization} with cities and writing. | Ancient {civilizations} grew up along great rivers.|colonies invasions | Writing is one of the foundations of {civilization}.",
      "colony invasion",
    ),
    word(
      "revolution revolutions",
      "a time when people change their government by force; a complete change in the way things are done",
      "革命；彻底变革",
      "The {revolution} of 1911, when the people overthrew the emperor, ended imperial rule in China. | The industrial {revolution} changed how people worked. | The internet started a {revolution} in communication.",
      "invasion colony",
    ),
    word(
      "colony colonies",
      "a country or area ruled by another country; a group of animals living together",
      "殖民地；（动物的）群体",
      "India was once a British {colony}, ruled from London. | The {colony} won its independence in 1962. | Ants live in large {colonies}.|empires dynasties",
      "empire dynasty",
    ),
    word(
      "independence",
      "freedom from the control of another country or person",
      "独立",
      "The country gained {independence} in 1947 and began to rule itself. | Teenagers want more {independence} from their parents. | They celebrate their {independence} every year on July 4.",
      "invasion revolution",
    ),
    word(
      "conquer conquers conquered conquering",
      "to take control of a country or a city by force; to deal successfully with a problem",
      "征服；克服",
      "The army {conquered} the city after a long war.|settled emerged | She finally {conquered} her fear of flying.|settled emerged | Alexander set out to {conquer} the world by force.",
      "settle emerge",
      "invade",
    ),
    word(
      "invade invades invaded invading",
      "to enter a country with an army in order to take control of it",
      "入侵；侵略",
      "The country was {invaded} by enemy soldiers in 1940.|evaded emerged | Tourists {invade} the beach every summer. | The enemy planned to {invade} from the north with ten thousand soldiers.",
      "evade emerge",
      "conquer",
    ),
    word(
      "invasion invasions",
      "the act of an army entering a country to take control of it",
      "入侵",
      "The {invasion} began early in the morning when soldiers crossed the border. | The island was protected from {invasion} by the sea. | There have been several {invasions} of the region.|independences revolutions",
      "independence revolution",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "A *decade* is ten years, while a *century* is a hundred years. Look for words such as *ten years*, *twenty years*, *900 years ago* or *the 1820s* that tell you how long the period is.",
        "*decade* 是十年，*century* 是一百年。找找 *ten years*、*twenty years*、*900 years ago* 或 *the 1820s* 这类词，看时间段有多长。",
      ),
      meaning: t(
        "An *empire* is many countries under one ruler, while a *dynasty* is a line of rulers from one family. Check whether the meaning is about land or about a family.",
        "*empire* 是一个统治者治下的许多国家，*dynasty* 是同一家族的一系列统治者。看释义说的是疆土，还是家族。",
      ),
      spell: t(
        "*Dynasty* has a y after the d; *independence* ends in -ence; *conquer* has qu.",
        "*dynasty* 的 d 后面是 y；*independence* 以 -ence 结尾；*conquer* 中有 qu。",
      ),
    },
    notes: `
      era|the Victorian period;a new time of technology;a hundred years of steam trains|an era is a long period of history; a colony is a land ruled by another country|era 是时代；colony 是殖民地|colony=a colony is a land ruled by another country, not a period of time=colony 是被他国统治的地方，不是一段时间;invasion=an invasion is an army entering a country, not a long period=invasion 是军队入侵，不是一个长时期|e · ra|e + ra, not *error*|e + ra，不要写成 *error*
      decade|prices doubling in ten years;twenty years of work;the 1960s|a decade is ten years; a century is a hundred years|decade 是十年；century 是一百年|century/centuries=a century is a hundred years, but here it is ten, twenty or the 1960s=century 是一百年，而这里是十年、二十年或二十世纪六十年代;dynasty/dynasties=a dynasty is a family of rulers, not a number of years=dynasty 是统治家族，不是年数|dec · ade|dec + ade, dec meaning "ten"|dec + ade，dec 表示"十"
      century|a castle from 900 years ago;the last hundred years;the 1820s|a century is a hundred years; a decade is ten years|century 是一百年；decade 是十年|decade/decades=a decade is ten years, but here it is a hundred years or more=decade 是十年，而这里是一百年或更久;era/eras=an era is a period of no fixed length, so it cannot be counted as the twelfth or two hundred years=era 没有固定长度，不能说第十二个或两百年|cen · tu · ry|cent + ury, cent meaning "hundred"|cent + ury，cent 表示"百"
      empire|half of Europe ruled from one capital;Rome ruling many countries;Britain with colonies everywhere|an empire is many countries under one ruler; a colony is one land ruled by another|empire 是帝国；colony 是殖民地|colony=a colony is ruled by another country, so it does not rule many countries=colony 被别国统治，不会统治许多国家;era=an era is a period of time, not a group of countries that rules=era 是一段时间，不是进行统治的国家联合体|em · pire|em + pire, ending in -ire|em + pire，以 -ire 结尾
      dynasty|emperors from one family;an end when the last emperor had no son;builders of the Great Wall|a dynasty is a line of rulers from one family; an empire is many countries under one ruler|dynasty 是朝代；empire 是帝国|colony/colonies=a colony is a land ruled by another country, not a family of emperors=colony 是被统治的地方，不是皇帝家族;era/eras=an era is a period of time, not a line of rulers who die or build=era 是一段时间，不是会死去或修建东西的统治者|dy · nas · ty|dy with a y, then -nasty|dy 里是 y，接 -nasty
      civilization|the Maya and their cities;ancient societies by rivers;writing as a foundation|a civilization is a society with its own culture and cities; a colony is ruled by another country|civilization 是文明；colony 是殖民地|colony/colonies=a colony is ruled by another country, not a culture built with cities and writing=colony 被别国统治，不是有城市和文字的文化;invasion/invasions=an invasion is an army attack, not a society that grows up=invasion 是军队入侵，不是成长起来的社会|civ · i · li · za · tion|civil + ize + ation|civil + ize + ation
      revolution|the people overthrowing an emperor;a change in how people worked;a change in communication|a revolution is a complete change, often of government by force; an invasion is an attack from outside|revolution 是革命；invasion 是入侵|invasion=an invasion comes from another country, but here the people themselves change things=invasion 来自外国，而这里是人民自己推动变革;colony=a colony is a land ruled by another country, not a change in how things are done=colony 是殖民地，不是做事方式的变革|rev · o · lu · tion|revolve drops ve and adds -lution|revolve 去掉 ve 加 -lution
      colony|India ruled from London;a land that won independence;ants living together|a colony is a land ruled by another country, or a group of animals; an empire is the ruling power|colony 是殖民地、群体；empire 是帝国|empire/empires=an empire rules other lands, so it does not need to win independence or get ruled from London=empire 统治别的地方，不需要争取独立，也不受伦敦统治;dynasty/dynasties=a dynasty is a family of rulers, not a land or a group of ants=dynasty 是统治家族，不是一块土地或一群蚂蚁|col · o · ny|colon + y|colon + y
      independence|a country that began to rule itself;teenagers and their parents;a national day each July|independence is freedom from another's control; an invasion is an attack|independence 是独立；invasion 是入侵|invasion=an invasion takes control away, but here people gain freedom=invasion 夺走控制权，而这里人们获得自由;revolution=a revolution is a violent change, not something teenagers want from parents=revolution 是剧烈变革，不是青少年想从父母那里得到的东西|in · de · pend · ence|in + depend + ence|in + depend + ence
      conquer|a city taken after a war;a fear beaten;the world taken by force|to conquer is to take control by force or beat a problem; to settle is to make a home|conquer 是征服、克服；settle 是定居|settle/settled=settle means to make a home, not to take a city or beat a fear=settle 是安家，不是攻占城市或战胜恐惧;emerge/emerged=emerge means to appear, and it takes no object such as *the city*=emerge 是出现，不能接 *the city* 这样的宾语|con · quer|con + quer, with qu|con + quer，有 qu
      invade|enemy soldiers in 1940;tourists filling a beach;ten thousand soldiers from the north|to invade is to enter with an army to take control; to evade is to escape|invade 是入侵；evade 是逃避|evade/evaded=evade means to escape from something, not to enter with soldiers=evade 是逃避，不是率军进入;emerge/emerged=emerge means to appear, not to enter a country to take it=emerge 是出现，不是进入一个国家去占领它|in · vade|in + vade|in + vade
      invasion|soldiers crossing a border;protection by the sea;attacks on a region|an invasion is an army entering a country; independence is freedom from control|invasion 是入侵；independence 是独立|independence/independences=independence is freedom, not soldiers crossing a border to attack=independence 是独立自由，不是越境攻击;revolution/revolutions=a revolution is people changing their own government, not an attack from outside=revolution 是人民改变自己的政府，不是外来攻击|in · va · sion|invade drops de and adds -sion|invade 去掉 de 加 -sion
    `,
  },
});

const warAndPeace = vocabularyTopic({
  id: "b2-words-war-and-peace",
  title: t("War and Peace", "战争与和平"),
  summary: t(
    "War, peace and conflict; battles, armies and soldiers; weapons, enemies and allies; treaties, surrender and victory.",
    "战争、和平和冲突；战役、军队和士兵；武器、敌人和盟友；条约、投降和胜利。",
  ),
  intro: t(
    "My grandfather was a young **soldier** in the **war**. He told me about a terrible **battle**, the day the **enemy** **surrendered**, and the joy when the **treaty** was signed and **peace** finally came. These words help you talk about war and how it ends.",
    "我爷爷在 **war**（战争）中是一名年轻的 **soldier**（士兵）。他给我讲过一场可怕的 **battle**（战役），讲过 **enemy**（敌人）**surrendered**（投降）的那一天，还有 **treaty**（条约）签订、**peace**（和平）终于到来时的喜悦。这些词帮你谈论战争以及战争如何结束。",
  ),
  prerequisites: ["b1-words-news"],
  words: [
    word(
      "war wars",
      "fighting between countries or groups, with armies and weapons",
      "战争",
      "My grandfather fought in the {war} as a young soldier. | Millions of people died in the {war} that ended in 1945 | The {war} lasted six years, and many cities were destroyed.",
      "treaty peace",
      "conflict battle",
    ),
    word(
      "peace",
      "a time when there is no war or fighting; calm and quiet",
      "和平；安宁",
      "After years of fighting, the two countries made {peace}. | The children just want to live in {peace}, without fighting. | Please leave me in {peace}: I need to work.",
      "war battle",
    ),
    word(
      "conflict conflicts",
      "a serious disagreement or fighting between groups or countries",
      "冲突",
      "The {conflict} between the two groups lasted for years. | Talks may end the {conflict} and stop the fighting. | There was a {conflict} of interest because the judge knew the man.",
      "peace treaty",
      "war battle",
    ),
    word(
      "battle battles",
      "a fight between armies; a struggle",
      "战役；斗争",
      "Thousands of soldiers died in the {battle}. | She lost her {battle} with cancer. | The {battle} took place near the river, and both armies lost many men.",
      "treaty ally",
      "war conflict",
    ),
    word(
      "army armies",
      "the soldiers of a country who fight on land",
      "军队；陆军",
      "He joined the {army} when he was eighteen. | The {army} marched toward the capital. | Both {armies} were tired after weeks of fighting.|weapons treaties",
      "weapon treaty",
    ),
    word(
      "soldier soldiers",
      "a member of an army",
      "士兵；军人",
      "The {soldiers} guarded the bridge day and night.|weapons treaties | My brother is a {soldier} in the army. | A young {soldier} wrote letters home from the war.",
      "weapon treaty",
    ),
    word(
      "weapon weapons",
      "a thing used to hurt or kill people, such as a gun or a knife",
      "武器",
      "Guns and knives are {weapons}.|allies treaties | Nuclear {weapons} could destroy whole cities.|allies treaties | The police found the {weapon}, a knife, under the bed.",
      "ally treaty",
    ),
    word(
      "enemy enemies",
      "a person or country that you are fighting against or that hates you",
      "敌人",
      "The two countries were {enemies} for centuries and fought many wars.|allies treaties | The {enemy} attacked our camp at night. | Don't make an {enemy} of your boss: he could make your life difficult.",
      "ally treaty",
    ),
    word(
      "ally allies",
      "a country or person that helps and supports another",
      "盟友；同盟国",
      "Britain and France were {allies} in the war, fighting on the same side.|enemies weapons | She was my closest {ally} at work, always supporting me. | The country asked its {allies} for help.|enemies weapons",
      "enemy weapon",
    ),
    word(
      "treaty treaties",
      "a written agreement between countries",
      "条约",
      "The two countries signed a peace {treaty}. | The {treaty} was signed in Paris in 1783. | Under the {treaty}, both sides agreed to have fewer weapons.",
      "weapon battle",
    ),
    word(
      "surrender surrenders surrendered surrendering",
      "to stop fighting and accept that the enemy has won; to give something up",
      "投降；交出",
      "The army {surrendered} after three days and stopped fighting.|conquered attacked | They {surrendered} their weapons to the police.|conquered attacked | The soldiers would never {surrender}, even when they were losing.",
      "conquer attack",
    ),
    word(
      "victory victories",
      "success in a war, a fight or a game",
      "胜利",
      "The team celebrated its {victory} with a party. | The election was a big {victory} for the party. | After a long battle, the army won a great {victory}.",
      "defeat treaty",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "An *ally* fights on your side, while an *enemy* fights against you. Look for words such as *on the same side*, *supporting me* or *attacked* that show which side someone is on.",
        "*ally* 和你站在同一边，*enemy* 和你作对。找找 *on the same side*、*supporting me* 或 *attacked* 这类词，看对方站在哪一边。",
      ),
      meaning: t(
        "A *battle* is one fight, while a *war* is the whole long period of fighting. Check whether the meaning is about one fight or about many over years.",
        "*battle* 是一场战斗，*war* 是整个长期的战争。看释义说的是一场仗，还是多年的许多仗。",
      ),
      spell: t(
        "*Soldier* has -dier at the end; *peace* (no war) has ea, unlike *piece*; *weapon* has ea too.",
        "*soldier* 以 -dier 结尾；*peace*（和平）是 ea，和 *piece* 不同；*weapon* 也是 ea。",
      ),
    },
    notes: `
      war|a grandfather who fought as a soldier;millions dead by 1945;six years of destroyed cities|a war is fighting between countries; a treaty is an agreement to stop|war 是战争；treaty 是条约|treaty=a treaty is an agreement, and people do not fight or die in it=treaty 是协议，人们不会在条约里打仗或死去;peace=peace is a time without fighting, the opposite of soldiers and destroyed cities=peace 是没有战事的时期，和士兵、被毁的城市正相反|war|w + ar, said "wore"|w + ar，读作 "wore"
      peace|countries that stop fighting;life without fighting;being left alone to work|peace is a time without war, or calm; war is fighting|peace 是和平、安宁；war 是战争|war=war is fighting, but here fighting ends or is avoided=war 是战争，而这里战斗结束或避免了;battle=a battle is a fight, not calm or the end of fighting=battle 是战斗，不是安宁或停战|peace|ea, not *piece*|ea 的拼法，不要写成 *piece*
      conflict|years of trouble between two groups;fighting that talks may stop;a judge who knew the man|a conflict is a serious disagreement or fighting; peace is a time without it|conflict 是冲突；peace 是和平|peace=peace is a time without fighting, so it would not need to be ended=peace 是没有争斗的时期，不需要去结束它;treaty=a treaty is an agreement that ends fighting, not the fighting itself=treaty 是结束战斗的协议，不是战斗本身|con · flict|con + flict|con + flict
      battle|thousands of soldiers dying;a struggle with cancer;a fight near a river|a battle is one fight; a treaty is a written agreement|battle 是战役、斗争；treaty 是条约|treaty=a treaty is a written agreement, not a fight where soldiers die=treaty 是书面协议，不是让士兵丧命的战斗;ally=an ally is a friend who helps, not a fight or a struggle=ally 是帮助你的盟友，不是战斗或斗争|bat · tle|a double t, and -le at the end|双写 t，以 -le 结尾
      army|joining at eighteen;marching toward a capital;tired after weeks of fighting|an army is the soldiers of a country; a weapon is a thing used to hurt|army 是军队；weapon 是武器|weapon/weapons=a weapon is a thing, and you cannot join it or watch it march=weapon 是物品，不能加入，也不会行军;treaty/treaties=a treaty is an agreement, not a group of soldiers=treaty 是协议，不是一群士兵|ar · my|arm + y|arm + y
      soldier|guards at a bridge;a brother in the army;letters home from the war|a soldier is a member of an army; a weapon is what a soldier uses|soldier 是士兵；weapon 是武器|weapon/weapons=a weapon is a thing, which cannot guard, write letters or be your brother=weapon 是物品，不会站岗、写信，也不会是你的兄弟;treaty/treaties=a treaty is an agreement, not a person in the army=treaty 是协议，不是军人|sol · dier|sol + dier, with -dier|sol + dier，以 -dier 结尾
      weapon|guns and knives;bombs that destroy cities;a knife under a bed|a weapon is a thing used to hurt; an ally is a friend who helps|weapon 是武器；ally 是盟友|ally/allies=an ally is a friend who helps, not a gun, a knife or a bomb=ally 是帮忙的朋友，不是枪、刀或炸弹;treaty/treaties=a treaty is an agreement, not something that hurts or destroys=treaty 是协议，不会伤人或毁物|weap · on|ea, then -pon|ea，再接 -pon
      enemy|countries that fought many wars;an attack on a camp at night;a boss who could make life difficult|an enemy fights against you; an ally helps you|enemy 是敌人；ally 是盟友|ally/allies=an ally helps you, but here they fight wars, attack or make life difficult=ally 帮助你，而这里对方打仗、进攻或刁难你;treaty/treaties=a treaty is an agreement, not someone who attacks or causes trouble=treaty 是协议，不会进攻或制造麻烦|en · e · my|en + e + my; plural *enemies*|en + e + my；复数 *enemies*
      ally|fighting on the same side;support at work;help asked for by a country|an ally is a friend who supports you; an enemy fights against you|ally 是盟友；enemy 是敌人|enemy/enemies=an enemy fights against you, but here they are on the same side and give support=enemy 与你为敌，而这里双方同一阵营、互相支持;weapon/weapons=a weapon is a thing, which cannot be on your side or be asked for help like a friend=weapon 是物品，不会像朋友那样站在你这边或被求助|al · ly|al + ly, double l; plural *allies*|al + ly，双写 l；复数 *allies*
      treaty|a peace agreement signed by two countries;a paper signed in Paris;both sides agreeing to fewer weapons|a treaty is a written agreement between countries; a battle is a fight|treaty 是条约；battle 是战役|weapon=a weapon is a thing used to hurt, not something you sign=weapon 是伤人的物品，不是用来签署的;battle=a battle is a fight, and you cannot sign a battle=battle 是战斗，不能签署|trea · ty|treat + y|treat + y
      surrender|an army that stopped fighting;weapons given to the police;soldiers who would not give up|to surrender is to stop fighting and accept defeat, or to give something up; to conquer is to win by force|surrender 是投降、交出；conquer 是征服|conquer/conquered=conquer means to win by force, but here the army stopped and gave up=conquer 是用武力征服，而这里军队停战并放弃;attack/attacked=attack means to start fighting, the opposite of stopping and giving weapons away=attack 是发起进攻，和停战、交出武器正相反|sur · ren · der|sur + render, with a double r|sur + render，双写 r
      victory|a team's party;a big win in an election;a great win after a battle|a victory is a win; a defeat is a loss|victory 是胜利；defeat 是失败|defeat=a defeat is a loss, but people celebrate and win here=defeat 是失败，而这里人们在庆祝、在获胜;treaty=a treaty is an agreement, not a win in a game, an election or a battle=treaty 是协议，不是比赛、选举或战斗中的胜利|vic · to · ry|victor + y|victor + y
    `,
  },
});

const politics = vocabularyTopic({
  id: "b2-words-politics",
  title: t("Politics", "政治"),
  summary: t(
    "Democracy, parliament and presidents; ministers and policy; electing, the opposition and legislation; authority, regimes, republics and monarchies.",
    "民主、议会和总统；部长和政策；选举、反对党和立法；当局、政权、共和国和君主制。",
  ),
  intro: t(
    "In our school's model **parliament**, we **elected** a **president**, chose **ministers**, and argued about a new **policy**. The **opposition** voted against it, but the **legislation** passed anyway. These words help you talk about how countries are governed.",
    "在学校的模拟 **parliament**（议会）里，我们 **elected**（选出）了 **president**（总统），任命了 **ministers**（部长），还就一项新 **policy**（政策）展开辩论。**opposition**（反对党）投了反对票，但这项 **legislation**（法规）还是通过了。这些词帮你谈论国家如何治理。",
  ),
  prerequisites: ["b1-words-news"],
  words: [
    word(
      "democracy democracies",
      "a system in which the people choose their government by voting; a country with this system",
      "民主；民主国家",
      "In a {democracy}, people choose their leaders by voting. | Free newspapers and fair elections are important in a {democracy}. | The country became a {democracy} in 1990, when people voted freely for the first time.",
      "monarchy regime",
    ),
    word(
      "parliament parliaments",
      "the group of people elected to make a country's laws",
      "议会；国会",
      "{Parliament}, with its 600 elected members, passed a new law yesterday. | She was elected to {parliament} in 2015. | Members of {parliament} debate new laws.",
      "president regime",
    ),
    word(
      "president presidents",
      "the leader of a country that has no king or queen; the head of an organization",
      "总统；主席",
      "The {president}, the head of the country, gave a speech on television. | Americans vote for a new {president} every four years. | She is the {president} of the student union.",
      "minister parliament",
    ),
    word(
      "minister ministers",
      "a member of a government who is in charge of one area, such as health",
      "部长；大臣",
      "The health {minister} visited the hospital. | Several {ministers} in the government lost their jobs after the scandal.|presidents parliaments | The prime {minister} met the president.",
      "president parliament",
    ),
    word(
      "policy policies",
      "a plan of what to do that a government, a company or a person has agreed on",
      "政策；方针",
      "The government has changed its {policy} on immigration. | The company has a strict {policy} on phones at work. | Their new {policies} will help small businesses.|regimes monarchies",
      "regime monarchy",
    ),
    word(
      "elect elects elected electing",
      "to choose someone for a job by voting",
      "选举",
      "The people {elected} a new president by voting.|abolished invaded | She was {elected} mayor last year.|abolished invaded | Citizens {elect} a new parliament every five years.",
      "abolish invade",
    ),
    word(
      "opposition",
      "strong disagreement with a plan; the parties in a parliament that are not in the government",
      "反对；反对党",
      "The {opposition} voted against the government's plan. | There was strong {opposition} to the new airport: many people protested. | The leader of the {opposition} asked the minister a hard question.",
      "legislation monarchy",
    ),
    word(
      "legislation",
      "a law or a group of laws",
      "法规；立法",
      "New {legislation} protects workers' rights. | The {legislation} was passed by parliament last year. | Parliament is debating {legislation} on online safety.",
      "opposition monarchy",
    ),
    word(
      "authority authorities",
      "the power to give orders; an official organization; an expert",
      "权力；当局；权威",
      "The local {authorities} closed the road after the flood.|regimes republics | Teachers need {authority} in the classroom. | She is the leading {authority} on Chinese art: experts ask her for advice.",
      "regime republic",
    ),
    word(
      "regime regimes",
      "a government, especially one that was not elected fairly",
      "政权",
      "The military {regime} arrested its critics. | The old {regime} fell in 1989, after people protested. | People lived in fear under the {regime}, which was never elected.",
      "democracy republic",
    ),
    word(
      "republic republics",
      "a country with an elected president and no king or queen",
      "共和国",
      "France is a {republic}, so it has no king. | The {republic} was founded in 1949, with an elected president. | The country became a {republic} when the king left.",
      "monarchy regime",
    ),
    word(
      "monarchy monarchies",
      "a system in which a king or a queen rules; a country with this system",
      "君主制；君主国",
      "Britain still has a {monarchy}, with a king as head of state. | The {monarchy} was abolished in 1912, and the emperor left. | Some people want to end the {monarchy} and have no more kings or queens.",
      "republic democracy",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "A *republic* has an elected president and no king, while a *monarchy* has a king or a queen. Look for words such as *no king*, *elected president* or *head of state* that show which one fits.",
        "*republic* 有选举产生的总统，没有国王；*monarchy* 有国王或女王。找找 *no king*、*elected president* 或 *head of state* 这类词，判断该用哪个。",
      ),
      meaning: t(
        "*Legislation* is a law or a group of laws, while a *policy* is a plan of what to do. Check whether the meaning is about laws or about a plan.",
        "*legislation* 是法律或法规，*policy* 是行动方针。看释义说的是法律，还是计划。",
      ),
      spell: t(
        "*Parliament* has ia in the middle: par · lia · ment; *regime* ends in -ime; *monarchy* has ch.",
        "*parliament* 中间是 ia：par · lia · ment；*regime* 以 -ime 结尾；*monarchy* 中有 ch。",
      ),
    },
    notes: `
      democracy|people choosing leaders by voting;free newspapers and fair elections;the first free vote|a democracy is a system where people vote for their government; a regime is a government not elected fairly|democracy 是民主；regime 是政权|monarchy=a monarchy has a king or queen who is born to rule, not leaders chosen by voting=monarchy 由生来的君主统治，不是投票选出的领导人;regime=a regime is often not elected fairly, the opposite of fair elections=regime 往往不是公正选出的，和公平选举正相反|de · moc · ra · cy|demo + cracy|demo + cracy
      parliament|600 elected members passing a law;a seat won in an election;members who debate laws|a parliament is the elected group that makes laws; a president is one leader|parliament 是议会；president 是总统|president=a president is one person, not 600 members or something you are elected to join=president 是一个人，不是 600 名议员，也不是被选入的机构;regime=a regime is a government that was not elected fairly, not a group of elected members=regime 是非公正选出的政府，不是选出的议员群体|par · lia · ment|parl + ia + ment|parl + ia + ment
      president|the head of the country on TV;a vote every four years;the head of a student union|a president is the leader of a country or organization; a minister is in charge of one area|president 是总统、主席；minister 是部长|minister=a minister is in charge of one area, not the head of a country or a union=minister 只负责一个领域，不是国家或学生会的首脑;parliament=a parliament is a group of people, not one head who gives a speech=parliament 是一群人，不是发表讲话的那一位首脑|pres · i · dent|preside + nt|preside + nt
      minister|a visit to a hospital about health;members of the government who lost their jobs;the prime minister|a minister is in charge of one area of government; a president leads the whole country|minister 是部长；president 是总统|president/presidents=a president leads the whole country, not one area such as health, and there is only one=president 领导整个国家，不只负责卫生，而且只有一位;parliament/parliaments=a parliament is a group of lawmakers, not one person in charge of health=parliament 是立法者群体，不是负责卫生的个人|min · is · ter|min + ister|min + ister
      policy|rules on immigration;rules on phones at work;plans to help small businesses|a policy is an agreed plan of what to do; a regime is a government|policy 是政策；regime 是政权|regime/regimes=a regime is a government, not a plan on immigration or phones=regime 是政权，不是关于移民或手机的方针;monarchy/monarchies=a monarchy is a system with a king, not a plan about phones or businesses=monarchy 是君主制，不是关于手机或企业的计划|pol · i · cy|poli + cy, not *police*|poli + cy，不要写成 *police*
      elect|a president chosen by voting;a mayor chosen last year;a parliament every five years|to elect is to choose someone by voting; to abolish is to end something|elect 是选举；abolish 是废除|abolish/abolished=abolish means to end a law or system, not to choose a person=abolish 是废除，不是选人;invade/invaded=invade means to enter with an army, not to choose someone by voting=invade 是率军入侵，不是投票选人|e · lect|e + lect|e + lect
      opposition|votes against the government's plan;protests against an airport;a leader asking a minister questions|the opposition is parties against the government, or strong disagreement; legislation is laws|opposition 是反对党、反对；legislation 是法规|legislation=legislation is laws, not people who vote against a plan or protest=legislation 是法规，不是投反对票或抗议的人;monarchy=a monarchy is a system with a king, not disagreement with a plan=monarchy 是君主制，不是对计划的反对|op · po · si · tion|oppose drops its e and adds -ition|oppose 去掉 e 加 -ition
      legislation|laws protecting workers;laws passed by parliament;laws about online safety|legislation is a law or a group of laws; opposition is disagreement|legislation 是法规；opposition 是反对|opposition=opposition is disagreement, not something that protects rights or is passed by parliament=opposition 是反对，不会保护权利，也不会被议会通过;monarchy=a monarchy is a system with a king, not laws passed by parliament=monarchy 是君主制，不是议会通过的法律|leg · is · la · tion|legis + lation|legis + lation
      authority|officials who closed a road;the power teachers need;an expert others ask|authority is power, an official organization or an expert; a regime is a government|authority 是权力、当局、权威；regime 是政权|regime/regimes=a regime is a whole government, not the local officials who close a road or an art expert=regime 是整个政权，不是封路的地方官员或艺术专家;republic/republics=a republic is a country, not power in a classroom or an expert=republic 是国家，不是课堂上的威信或专家|au · thor · i · ty|author + ity|author + ity
      regime|a government that arrests its critics;a government that fell in 1989;rule by fear with no election|a regime is a government, often not elected fairly; a democracy is elected by the people|regime 是政权；democracy 是民主|democracy=a democracy is chosen by the people and does not arrest critics or rule by fear=democracy 由人民选出，不会抓捕批评者或靠恐惧统治;republic=a republic has an elected president, but this was never elected and ruled by fear=republic 有民选总统，而这个政权从未经选举，靠恐惧统治|re · gime|re + gime, said "ray-zheem"|re + gime，读作 "ray-zheem"
      republic|France with no king;a country with an elected president;a country after a king left|a republic has an elected president and no king; a monarchy has a king or queen|republic 是共和国；monarchy 是君主制|monarchy=a monarchy has a king, but here there is no king or he left=monarchy 有国王，而这里没有国王或国王走了;regime=a regime is often not elected, but here there is an elected president=regime 往往不经选举，而这里有民选总统|re · pub · lic|re + public|re + public
      monarchy|a king as head of state;a system that ended when the emperor left;kings and queens people want to end|a monarchy is rule by a king or queen; a republic has a president|monarchy 是君主制；republic 是共和国|republic=a republic has no king or queen, but here there is a king or emperor=republic 没有国王或女王，而这里有国王或皇帝;democracy=a democracy is about voting, not about kings and queens=democracy 关乎投票，不是关于国王和女王|mon · ar · chy|mon + archy, with ch said "k"|mon + archy，ch 读作 "k"
    `,
  },
});

const socialIssues = vocabularyTopic({
  id: "b2-words-social-issues",
  title: t("Social Issues", "社会问题"),
  summary: t(
    "Hunger, corruption and violence; abuse, exploitation and neglect; homelessness and isolation; the unemployed, the deprived, the vulnerable and the marginalized.",
    "饥饿、腐败和暴力；虐待、剥削和忽视；无家可归和孤立；失业者、贫困者、弱势者和被边缘化的人。",
  ),
  intro: t(
    "Our class volunteered at a shelter that helps people facing **homelessness**. We met a man who had been **unemployed** for years and an old woman living in **isolation**. These words help you talk about the problems that make people's lives hard and the people most at risk.",
    "我们班去一家帮助 **homelessness**（无家可归）者的收容所做志愿者。我们遇到一位 **unemployed**（失业）多年的男士，还有一位生活在 **isolation**（孤立）中的老奶奶。这些词帮你谈论让人们生活艰难的社会问题，以及最容易受影响的人。",
  ),
  prerequisites: ["b1-words-city-problems"],
  words: [
    word(
      "hunger",
      "the state of not having enough food",
      "饥饿",
      "Millions of children suffer from {hunger} because there is not enough food. | The charity fights {hunger} by giving out food. | After the long walk, we were weak with {hunger}.",
      "corruption homelessness",
    ),
    word(
      "corruption",
      "dishonest behavior by people in power, such as taking money for favors",
      "腐败；贪污",
      "The minister was arrested for {corruption}: he took money for favors. | {Corruption} wastes public money. | The new law aims to stop {corruption} in the police, such as taking bribes.",
      "hunger violence",
    ),
    word(
      "violence",
      "behavior that hurts or kills people",
      "暴力",
      "The film has too much {violence} for children: fighting and killing. | Hitting people is wrong: {violence} is never the answer. | Police are worried about rising {violence}, such as street fights.",
      "hunger corruption",
    ),
    word(
      "abuse abuses abused abusing",
      "cruel treatment of a person or an animal; the wrong use of something",
      "虐待；滥用",
      "The {abuse} of power is a serious crime. | He was accused of {abusing} his position to help his friends.|neglecting starving | Drug {abuse} is a growing problem.",
      "neglect hunger",
      "exploit",
    ),
    word(
      "exploit exploits exploited exploiting",
      "to treat people unfairly to get something from them; to use something well",
      "剥削；利用；开发",
      "Some factories {exploit} children as cheap workers. | Big companies {exploited} the country's oil and grew rich.|neglected settled | We should {exploit} the sun's energy better.",
      "neglect settle",
      "abuse",
    ),
    word(
      "homelessness",
      "the state of having no home",
      "无家可归",
      "{Homelessness} has risen: more people are sleeping on the streets this winter. | The charity helps people facing {homelessness} find a place to live. | Rising rents are a major cause of {homelessness}.",
      "isolation corruption",
    ),
    word(
      "neglect neglects neglected neglecting",
      "to fail to take care of someone or something; the state of not being looked after",
      "忽视；疏于照顾",
      "The old house fell into ruin through {neglect}: nobody looked after it. | Parents who {neglect} their children may lose them. | The garden was {neglected} for years and is full of weeds.|settled elected",
      "settle elect",
    ),
    word(
      "isolation",
      "the state of being alone or away from other people",
      "孤立；隔离",
      "Many old people live in {isolation}, seeing nobody for days. | The patient was kept in {isolation} for a week, away from others. | The island's {isolation} protected its rare animals.",
      "corruption violence",
    ),
    word(
      "unemployed",
      "without a paid job",
      "失业的",
      "He has been {unemployed} since the factory closed. | The number of {unemployed} people looking for work is falling. | The government helps the {unemployed} find work.",
      "employed vulnerable",
    ),
    word(
      "deprived",
      "without the money, food or other things that people need",
      "贫困的；被剥夺的",
      "Children from {deprived} areas, where families have little money, often do worse at school. | The prisoners were {deprived} of sleep. | The charity works in the most {deprived} parts of the city, where poverty is worst.",
      "wealthy vulnerable",
    ),
    word(
      "vulnerable",
      "easily hurt or harmed",
      "脆弱的；易受伤害的",
      "Old people are {vulnerable} to the flu. | The charity protects {vulnerable} children who are easily harmed. | She felt {vulnerable} walking home alone at night.",
      "unemployed deprived",
    ),
    word(
      "marginalized",
      "treated as unimportant and kept at the edge of society",
      "被边缘化的",
      "The program helps {marginalized} groups that society ignores. | Many minorities feel {marginalized}, pushed to the edge of society. | Their voices have been {marginalized} for too long, and nobody listened.",
      "wealthy employed",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Deprived* people lack money and the things they need, while *vulnerable* people are easily harmed. Look for words such as *little money*, *poverty*, *easily harmed* or *alone at night* that show which one fits.",
        "*deprived* 的人缺钱、缺生活必需品，*vulnerable* 的人容易受伤害。找找 *little money*、*poverty*、*easily harmed* 或 *alone at night* 这类词，判断该用哪个。",
      ),
      meaning: t(
        "To *neglect* is to fail to look after someone, while to *exploit* is to use them unfairly for gain. Check whether the meaning is about not caring or about using.",
        "*neglect* 是疏于照顾，*exploit* 是为了利益不公平地利用别人。看释义说的是不照顾，还是利用。",
      ),
      spell: t(
        "*Vulnerable* has ln: vul · ner · a · ble; *homelessness* has a double s at the end; *marginalized* uses -ize in American English.",
        "*vulnerable* 中有 ln：vul · ner · a · ble；*homelessness* 结尾双写 s；*marginalized* 在美式英语里用 -ize。",
      ),
    },
    notes: `
      hunger|not enough food for children;a charity giving out food;weak after a long walk|hunger is not having enough food; homelessness is having no home|hunger 是饥饿；homelessness 是无家可归|corruption=corruption is dishonest behavior by people in power, not a lack of food=corruption 是掌权者的不诚实行为，不是缺少食物;homelessness=homelessness is having no home, but food solves this problem=homelessness 是没有住处，而这里的问题要靠食物解决|hun · ger|hung + er, not *hanger*|hung + er，不要写成 *hanger*
      corruption|a minister taking money for favors;public money wasted;police taking bribes|corruption is dishonesty by people in power; violence is hurting people|corruption 是腐败；violence 是暴力|hunger=hunger is a lack of food, not taking money for favors=hunger 是饥饿，不是收钱办事;violence=violence is hurting people, not taking bribes=violence 是伤人，不是受贿|cor · rup · tion|cor + rupt + ion, with a double r|cor + rupt + ion，双写 r
      violence|fighting and killing in a film;hitting people;street fights|violence is behavior that hurts people; corruption is dishonesty in power|violence 是暴力；corruption 是腐败|hunger=hunger is a lack of food, not fighting or hitting=hunger 是饥饿，不是打架或打人;corruption=corruption is taking money dishonestly, not fighting=corruption 是贪污，不是打斗|vi · o · lence|violent becomes violence, with -ence|violent 变成 violence，以 -ence 结尾
      abuse|power used wrongly;a position used to help friends;drugs used harmfully|abuse is cruel treatment or wrong use; neglect is failing to look after|abuse 是虐待、滥用；neglect 是忽视|neglect/neglecting=neglect means not looking after something, not using power or drugs wrongly=neglect 是疏于照顾，不是滥用权力或药物;hunger/starving=hunger is lack of food, not the wrong use of power or drugs=hunger 是缺少食物，不是滥用权力或药物|a · buse|a + buse, not *amuse*|a + buse，不要写成 *amuse*
      exploit|children as cheap workers;oil that made companies rich;the sun's energy used better|to exploit is to use people unfairly or use something well; to neglect is to fail to look after|exploit 是剥削、利用；neglect 是忽视|neglect/neglected=neglect means not using or not looking after, but here companies grew rich from oil=neglect 是忽视、不利用，而这里公司靠石油发了财;settle/settled=settle means to make a home, not to use workers, oil or energy=settle 是定居，不是利用工人、石油或能源|ex · ploit|ex + ploit, with oi|ex + ploit，有 oi
      homelessness|people sleeping on the streets;a charity finding places to live;rising rents|homelessness is having no home; isolation is being alone|homelessness 是无家可归；isolation 是孤立|isolation=isolation is being alone, not sleeping on the streets or needing a place to live=isolation 是孤独隔绝，不是露宿街头或需要住处;corruption=corruption is dishonesty by people in power, not having no home=corruption 是腐败，不是没有住处|home · less · ness|home + less + ness, with two double s's|home + less + ness，两处双写 s
      neglect|a house nobody looked after;parents who do not care for children;a garden full of weeds|to neglect is to fail to look after; to exploit is to use unfairly|neglect 是忽视；exploit 是剥削|settle/settled=settle means to make a home, not to fail to look after children or a garden=settle 是定居，不是疏于照顾孩子或花园;elect/elected=elect means to choose by voting, not to fail to take care=elect 是投票选举，不是疏于照顾|ne · glect|ne + glect|ne + glect
      isolation|old people seeing nobody;a patient kept away from others;an island far from others|isolation is being alone or away from others; corruption is dishonesty|isolation 是孤立、隔离；corruption 是腐败|corruption=corruption is dishonesty, not being alone or kept away=corruption 是腐败，不是独处或隔离;violence=violence is hurting people, not being away from them=violence 是伤人，不是远离他人|i · so · la · tion|isolate drops its e and adds -ion|isolate 去掉 e 加 -ion
      unemployed|a man without work since a factory closed;people looking for work;people the government helps find jobs|unemployed means without a paid job; employed means with one|unemployed 是失业的；employed 是有工作的|employed=employed means having a job, but here the factory closed and people look for work=employed 是有工作的，而这里工厂倒闭、人们在找工作;vulnerable=vulnerable means easily harmed, not without a job=vulnerable 是易受伤害的，不是没有工作|un · em · ployed|un + employ + ed|un + employ + ed
      deprived|areas where families have little money;prisoners without sleep;parts where poverty is worst|deprived means without what people need; wealthy means rich|deprived 是贫困的、被剥夺的；wealthy 是富有的|wealthy=wealthy means rich, but here families have little money and poverty is worst=wealthy 是富有的，而这里家庭缺钱、贫困最严重;vulnerable=vulnerable means easily harmed, and you cannot be *vulnerable of* sleep=vulnerable 是易受伤害的，不能说 *vulnerable of* sleep|de · prived|deprive + d|deprive + d
      vulnerable|old people and the flu;children easily harmed;walking home alone at night|vulnerable means easily hurt; deprived means without what you need|vulnerable 是脆弱的；deprived 是贫困的|unemployed=unemployed means without a job, not easily harmed by illness or danger=unemployed 是失业的，不是容易被疾病或危险伤害;deprived=deprived means without money or things you need, not feeling in danger=deprived 是匮乏的，不是感到危险|vul · ner · a · ble|vul + ner + able, with ln|vul + ner + able，有 ln
      marginalized|groups society ignores;minorities pushed to the edge;voices nobody listened to|marginalized means treated as unimportant and kept at the edge; wealthy means rich|marginalized 是被边缘化的；wealthy 是富有的|wealthy=wealthy means rich, not ignored or pushed to the edge=wealthy 是富有的，不是被忽视或被排挤;employed=employed means having a job, not ignored by society=employed 是有工作的，不是被社会忽视|mar · gin · al · ized|marginal + ize + d|marginal + ize + d
    `,
  },
});

const trends = vocabularyTopic({
  id: "b2-words-trends",
  title: t("Describing Trends", "描述趋势"),
  summary: t(
    "Widespread and increasingly; considerably, dramatically and relatively; largely, mainly and mostly; nearly, approximately, roughly and virtually.",
    "广泛的和越来越；相当、显著和相对；主要地、大多；几乎、大约、大致和差不多。",
  ),
  intro: t(
    "Our class survey found that phone use is **widespread**: **roughly** nine in ten students have one, the number has risen **dramatically** since 2015, and screen time is **increasingly** a worry for parents. These words help you describe numbers, changes and trends.",
    "我们班的调查发现，手机使用 **widespread**（很普遍）：**roughly**（大约）十个学生里有九个有手机，这个数字自 2015 年以来 **dramatically**（急剧）上升，屏幕时间也 **increasingly**（越来越）让家长担心。这些词帮你描述数字、变化和趋势。",
  ),
  prerequisites: ["b1-words-numbers-and-amounts"],
  words: [
    word(
      "widespread",
      "happening or found in many places or among many people",
      "广泛的；普遍的",
      "There is {widespread} concern about the new law across the country. | Smartphone use is now {widespread}, even in remote villages. | The storm caused {widespread} damage across the region.",
      "rare local",
    ),
    word(
      "increasingly",
      "more and more",
      "越来越",
      "It is becoming {increasingly} difficult to find a cheap flat. | Online shopping is {increasingly} popular: more people use it every year. | As the storm got closer, people grew {increasingly} worried.",
      "approximately relatively",
    ),
    word(
      "considerably",
      "by a large amount; a lot",
      "相当地；大大地",
      "Prices have risen {considerably} this year, by almost a third. | The new flat is {considerably} bigger than the old one. | Her health has improved {considerably} since she started exercising.",
      "approximately virtually",
      "dramatically",
    ),
    word(
      "dramatically",
      "suddenly and by a very large amount",
      "急剧地；显著地",
      "Temperatures fell {dramatically} overnight, from 20 degrees to zero. | The number of tourists has increased {dramatically} since the new airport opened. | Life changed {dramatically} after the baby was born.",
      "approximately relatively",
      "considerably",
    ),
    word(
      "relatively",
      "when compared with other things",
      "相对地；比较",
      "The test was {relatively} easy compared with last year's. | Housing here is {relatively} cheap compared with the capital. | The disease is {relatively} rare compared with the flu.",
      "increasingly approximately",
    ),
    word(
      "largely",
      "mostly, but not completely",
      "主要地；在很大程度上",
      "The project's success was {largely} due to her hard work. | The area is {largely} desert, with a few green valleys. | The report was {largely} ignored: only a few people read it.",
      "dramatically increasingly",
      "mainly mostly",
    ),
    word(
      "mainly",
      "more than anything else; in most cases",
      "主要地",
      "The students are {mainly} from Asia, with a few from Europe. | I {mainly} eat vegetables and only rarely eat meat. | The weather will be {mainly} dry, with a few showers.",
      "dramatically increasingly",
      "largely mostly",
    ),
    word(
      "mostly",
      "almost all; usually",
      "大多；通常",
      "The audience was {mostly} teenagers, with a few parents. | It's {mostly} sunny in July, though it sometimes rains. | We {mostly} stay at home on Sundays, but sometimes we go out.",
      "dramatically increasingly",
      "largely mainly",
    ),
    word(
      "nearly",
      "almost; not quite",
      "几乎；差不多",
      "It's {nearly} midnight: just five minutes to go. | I {nearly} missed the bus, but I caught it just in time. | {Nearly} all the students passed; only two failed.",
      "dramatically considerably",
      "approximately roughly virtually",
    ),
    word(
      "approximately",
      "close to an exact number, but not exactly",
      "大约",
      "The journey takes {approximately} three hours. | {Approximately} 40 percent of the land is forest. | The city has a population of {approximately} two million.",
      "dramatically considerably",
      "nearly roughly",
    ),
    word(
      "roughly",
      "about; not exactly",
      "大致；粗略地",
      "There were {roughly} fifty people at the meeting. | {Roughly} half of them agreed, and half did not. | The two cities are {roughly} the same size.",
      "dramatically considerably",
      "nearly approximately",
    ),
    word(
      "virtually",
      "almost completely",
      "几乎；实际上",
      "The town was {virtually} empty in August: almost everyone was on holiday. | It's {virtually} impossible to park here. | {Virtually} every home now has the internet.",
      "dramatically considerably",
      "nearly",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Approximately*, *roughly* and *nearly* go with numbers and amounts, while *dramatically* and *considerably* describe how much something changes. Look for a number after the gap, or a verb such as *rose* or *fell* before it.",
        "*approximately*、*roughly* 和 *nearly* 与数字、数量连用，*dramatically* 和 *considerably* 描述变化的幅度。看空格后面有没有数字，或前面有没有 *rose*、*fell* 这样的动词。",
      ),
      meaning: t(
        "*Relatively* means when compared with something else, while *increasingly* means more and more over time. Check whether the meaning is about comparing or about change over time.",
        "*relatively* 是与别的相比，*increasingly* 是随时间越来越。看释义说的是比较，还是随时间的变化。",
      ),
      spell: t(
        "*Dramatically* ends in -ically, with -ally; *approximately* has a double p; *considerably* drops the e of -able before -ly.",
        "*dramatically* 以 -ically 结尾，是 -ally；*approximately* 双写 p；*considerably* 把 -able 的 e 去掉再加 -ly。",
      ),
    },
    notes: `
      widespread|concern across the country;phones even in remote villages;damage across a region|widespread means found in many places; local means found in one place|widespread 是广泛的；local 是局部的|rare=rare means not common, but here it is across the country or even in villages=rare 是罕见的，而这里遍及全国，连村子里都有;local=local means in one small area, but here it is across a whole country or region=local 是局部的，而这里遍及全国或整个地区|wide · spread|wide + spread, one word|wide + spread，连写成一个词
      increasingly|a cheap flat getting harder to find;more shoppers every year;worry growing as a storm came|increasingly means more and more; relatively means compared with others|increasingly 是越来越；relatively 是相对地|approximately=approximately goes with a number, not with *difficult*, *popular* or *worried*=approximately 修饰数字，不修饰 *difficult*、*popular* 或 *worried*;relatively=relatively compares with something else, but here things change over time=relatively 是与他物比较，而这里说的是随时间变化|in · creas · ing · ly|increasing + ly|increasing + ly
      considerably|prices up by almost a third;a much bigger flat;health much better after exercise|considerably means by a large amount; approximately means about|considerably 是大大地；approximately 是大约|approximately=approximately goes with a number, not with *risen*, *bigger* or *improved*=approximately 修饰数字，不修饰 *risen*、*bigger* 或 *improved*;virtually=virtually means almost completely, and you cannot say *virtually bigger*=virtually 是几乎完全，不能说 *virtually bigger*|con · sid · er · a · bly|considerable drops its e and adds -y|considerable 去掉 e 加 -y
      dramatically|from 20 degrees to zero overnight;tourists after a new airport;life after a baby|dramatically means suddenly and by a lot; relatively means compared with others|dramatically 是急剧地；relatively 是相对地|approximately=approximately goes with a number, not with *fell*, *increased* or *changed*=approximately 修饰数字，不修饰 *fell*、*increased* 或 *changed*;relatively=relatively compares with something, but here a big sudden change happens=relatively 是相对而言，而这里是突然的巨大变化|dra · mat · i · cal · ly|dramatic + ally|dramatic + ally
      relatively|a test compared with last year's;housing compared with the capital;a disease compared with the flu|relatively means when compared with something else; increasingly means more and more|relatively 是相对地；increasingly 是越来越|increasingly=increasingly is about change over time, but here something is compared with another thing=increasingly 说的是随时间变化，而这里是与别的东西比较;approximately=approximately goes with a number, not with *easy*, *cheap* or *rare*=approximately 修饰数字，不修饰 *easy*、*cheap* 或 *rare*|rel · a · tive · ly|relative + ly|relative + ly
      largely|success mostly from her work;mostly desert with a few valleys;a report few people read|largely means mostly but not completely; dramatically means suddenly and by a lot|largely 是主要地；dramatically 是急剧地|dramatically=dramatically describes a sudden big change, not how much of something is true=dramatically 描述突然的大变化，不是某事有多大程度成立;increasingly=increasingly means more and more over time, not mostly=increasingly 是随时间越来越，不是大部分|large · ly|large + ly, keeping the e|large + ly，保留 e
      mainly|students mostly from Asia;vegetables most of the time;weather mostly dry|mainly means more than anything else; dramatically means suddenly and by a lot|mainly 是主要地；dramatically 是急剧地|dramatically=dramatically describes a sudden big change, not where most students come from=dramatically 描述突然的大变化，不是学生大多来自哪里;increasingly=increasingly means more and more, but nothing here is growing over time=increasingly 是越来越，而这里没有随时间增长的东西|main · ly|main + ly|main + ly
      mostly|an audience of teenagers;sunny July;Sundays at home|mostly means almost all or usually; dramatically means suddenly and by a lot|mostly 是大多、通常；dramatically 是急剧地|dramatically=dramatically describes a big sudden change, not what usually happens=dramatically 描述突然的大变化，不是通常的情况;increasingly=increasingly means more and more over time, not usually=increasingly 是随时间越来越，不是通常|most · ly|most + ly|most + ly
      nearly|five minutes to midnight;a bus caught just in time;all but two students|nearly means almost but not quite; considerably means by a lot|nearly 是几乎；considerably 是大大地|dramatically=dramatically describes a big change, not *almost*=dramatically 描述大变化，不是"几乎";considerably=considerably means by a large amount, not *almost*=considerably 是大幅度地，不是"几乎"|near · ly|near + ly|near + ly
      approximately|a journey of about three hours;about 40 percent forest;about two million people|approximately means close to a number; dramatically means by a lot|approximately 是大约；dramatically 是急剧地|dramatically=dramatically describes change, not a number such as three hours or two million=dramatically 描述变化，不修饰三小时或两百万这样的数字;considerably=considerably means by a lot, and it does not go in front of a number=considerably 是大幅度地，不放在数字前面|ap · prox · i · mate · ly|ap + proxim + ate + ly, with a double p|ap + proxim + ate + ly，双写 p
      roughly|about fifty people;about half;two cities about the same size|roughly means about, not exactly; dramatically means by a lot|roughly 是大致；dramatically 是急剧地|dramatically=dramatically describes change, not a number such as fifty or half=dramatically 描述变化，不修饰五十或一半这样的数字;considerably=considerably means by a lot, and it does not go in front of a number or *the same*=considerably 是大幅度地，不放在数字或 *the same* 前面|rough · ly|rough + ly, with ough|rough + ly，有 ough
      virtually|a town almost empty in August;almost impossible parking;almost every home|virtually means almost completely; dramatically means suddenly and by a lot|virtually 是几乎；dramatically 是急剧地|dramatically=dramatically describes a sudden change, not *almost completely*=dramatically 描述突然的变化，不是"几乎完全";considerably=considerably means by a lot, and you cannot say *considerably every home*=considerably 是大幅度地，不能说 *considerably every home*|vir · tu · al · ly|virtual + ly, with a double l|virtual + ly，双写 l
    `,
  },
});

const generations = vocabularyTopic({
  id: "b2-words-generations",
  title: t("Generations", "代际"),
  summary: t(
    "Seniors and youngsters; adolescents and adolescence; infants and toddlers; the middle-aged and the aged; lifespan and life expectancy; caregivers and nursing.",
    "老年人和年轻人；青少年和青春期；婴儿和幼儿；中年人和老年人；寿命和预期寿命；照护者和护理。",
  ),
  intro: t(
    "At my grandmother's ninetieth birthday, four generations sat at one table: **toddlers** learning to walk, **adolescents** on their phones, **middle-aged** parents, and Grandma with her **caregiver**. These words help you talk about the stages of life and the people who look after others.",
    "在奶奶九十岁的生日宴上，四代人坐在一张桌旁：正在学走路的 **toddlers**（幼儿）、看着手机的 **adolescents**（青少年）、**middle-aged**（中年的）父母，还有奶奶和她的 **caregiver**（照护者）。这些词帮你谈论人生的各个阶段，以及照顾他人的人。",
  ),
  prerequisites: ["b1-words-family-life"],
  words: [
    word(
      "senior seniors",
      "an older person, especially one over 60; higher in rank",
      "老年人；高级的",
      "The bus is free for {seniors} over 65.|toddlers infants | The club offers gentle yoga for retired {seniors}.|toddlers infants | She is the {senior} doctor on the ward, with thirty years' experience.",
      "toddler infant",
    ),
    word(
      "youngster youngsters",
      "a young person or a child",
      "年轻人；孩子",
      "The club keeps {youngsters} under 16 off the streets after school.|seniors caregivers | As a {youngster} of ten, he played football every day. | The coach trains {youngsters} aged 10 to 16.|seniors caregivers",
      "senior caregiver",
      "adolescent",
    ),
    word(
      "adolescent adolescents",
      "a young person who is becoming an adult; a teenager",
      "青少年",
      "{Adolescents} aged 13 to 18 often need more sleep than adults.|infants seniors | The book is written for {adolescents} going through their teenage years.|infants seniors | She works with troubled {adolescents} at a secondary school.|infants seniors",
      "infant senior",
      "youngster",
    ),
    word(
      "adolescence",
      "the time of life when a child is becoming an adult",
      "青春期",
      "{Adolescence}, the teenage years, is a time of rapid change. | She spent her {adolescence}, from 13 to 19, in Shanghai. | Many problems begin in {adolescence}, when children become teenagers.",
      "infancy lifespan",
    ),
    word(
      "infant infants",
      "a baby or a very young child",
      "婴儿",
      "The nurse fed the newborn {infant} with a bottle. | {Infants} under one year old sleep for most of the day.|seniors adolescents | The hospital has a unit for sick newborn {infants}.|seniors adolescents",
      "senior adolescent",
      "toddler",
    ),
    word(
      "toddler toddlers",
      "a young child who is just learning to walk",
      "学步的幼儿",
      "{Toddlers} of about two are learning to walk and talk.|adolescents seniors | Our two-year-old {toddler} said his first words today. | The park has a play area with soft floors for {toddlers} who are just learning to walk.|adolescents seniors",
      "adolescent senior",
      "infant",
    ),
    word(
      "middle-aged",
      "neither young nor old, about 45 to 65 years old",
      "中年的",
      "My parents are {middle-aged} now: both are about 50. | The {middle-aged} man next to me, about fifty, asked me the way. | Many {middle-aged} people in their fifties look after their children and their parents at once.",
      "elderly adolescent",
    ),
    word(
      "lifespan lifespans",
      "the length of time that a person, an animal or a thing lives or lasts",
      "寿命",
      "The average {lifespan} of a dog, from birth to death, is about twelve years. | Good food and exercise can extend your {lifespan}, so you live longer. | Some insects have a {lifespan} of only one day before they die.",
      "childhood nursing",
    ),
    word(
      "expectancy",
      "the number of years a person is expected to live (life expectancy)",
      "预期（寿命）",
      "Life {expectancy} in Japan, the average number of years people live, is over 84. | Life {expectancy} has risen to 78 years because of better healthcare. | Women have a higher life {expectancy} than men: they live about five years longer.",
      "insurance cycle",
    ),
    word(
      "caregiver caregivers",
      "a person who looks after someone who is old, ill or a child",
      "照护者",
      "She is the main {caregiver} for her elderly mother, helping her every day. | {Caregivers} who look after sick relatives need support too.|infants toddlers | The {caregiver} helps him wash and dress every morning.",
      "infant toddler",
    ),
    word(
      "nursing",
      "the job of caring for people who are ill, injured or old",
      "护理",
      "My aunt works in {nursing}, caring for sick people in a hospital. | Grandma moved into a {nursing} home, where trained staff care for her day and night. | She studied {nursing} at university and now works on a hospital ward.",
      "teaching parenting",
    ),
    word(
      "aged",
      "very old; of the age of",
      "年老的；……岁的",
      "Children {aged} between six and twelve can join. | She cares for her {aged} parents, who are both over 90. | The home looks after the sick and the {aged}, most of them over 85.",
      "middle-aged adolescent",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "An *adolescent* is a teenage person, while *adolescence* is the teenage time of life. Look for words such as *the teenage years*, *spent her* or *begin in* that show you need the time, not the person.",
        "*adolescent* 是青少年这个人，*adolescence* 是青春期这段时间。找找 *the teenage years*、*spent her* 或 *begin in* 这类词，它们说明需要的是时期，而不是人。",
      ),
      meaning: t(
        "A *caregiver* is a person who looks after someone, while *nursing* is the job of caring for the ill. Check whether the meaning is about a person or about a job.",
        "*caregiver* 是照顾别人的人，*nursing* 是护理病人的工作。看释义说的是人，还是工作。",
      ),
      spell: t(
        "*Adolescence* has sc in the middle and ends in -ence; *caregiver* and *lifespan* are each one word; *middle-aged* has a hyphen.",
        "*adolescence* 中间有 sc，以 -ence 结尾；*caregiver* 和 *lifespan* 都连写成一个词；*middle-aged* 中间有连字符。",
      ),
    },
    notes: `
      senior|a free bus over 65;yoga for the retired;a doctor with thirty years' experience|a senior is an older person or higher in rank; a toddler is a young child|senior 是老年人、高级的；toddler 是幼儿|toddler/toddlers=a toddler is about two, not over 65, retired or a doctor=toddler 大约两岁，不会超过 65 岁、退休或当医生;infant/infants=an infant is a baby, not someone retired or with thirty years' experience=infant 是婴儿，不会退休，也没有三十年经验|sen · ior|sen + ior|sen + ior
      youngster|children under 16 off the streets;a boy of ten playing football;players aged 10 to 16|a youngster is a young person; a senior is an older person|youngster 是年轻人；senior 是老年人|senior/seniors=a senior is over 60, not under 16 or ten years old=senior 超过 60 岁，不是 16 岁以下或十岁;caregiver/caregivers=a caregiver looks after others, not a child of ten trained by a coach=caregiver 是照顾别人的人，不是十岁孩子或教练训练的少年|young · ster|young + ster|young + ster
      adolescent|young people aged 13 to 18;readers in their teenage years;troubled teenagers at a secondary school|an adolescent is a teenager; an infant is a baby|adolescent 是青少年；infant 是婴儿|infant/infants=an infant is a baby, not someone aged 13 to 18 at a secondary school=infant 是婴儿，不是 13 到 18 岁的中学生;senior/seniors=a senior is over 60, not in the teenage years=senior 超过 60 岁，不在青春期|ad · o · les · cent|adolesc + ent, with sc|adolesc + ent，有 sc
      adolescence|the teenage years;the years from 13 to 19;when children become teenagers|adolescence is the teenage time of life; infancy is the time of being a baby|adolescence 是青春期；infancy 是婴儿期|infancy=infancy is the first year or two of life, not the years from 13 to 19=infancy 是出生后一两年，不是 13 到 19 岁;lifespan=a lifespan is a whole life, not only the teenage years=lifespan 是整个一生，不只是青春期|ad · o · les · cence|adolesc + ence, with sc|adolesc + ence，有 sc
      infant|a newborn fed with a bottle;babies under one year old;sick newborns in hospital|an infant is a baby; an adolescent is a teenager|infant 是婴儿；adolescent 是青少年|senior/seniors=a senior is over 60, not a newborn under one year old=senior 超过 60 岁，不是不到一岁的新生儿;adolescent/adolescents=an adolescent is a teenager, not a newborn fed with a bottle=adolescent 是青少年，不是用奶瓶喂的新生儿|in · fant|in + fant|in + fant
      toddler|children of about two learning to walk;a two-year-old's first words;a soft play area for new walkers|a toddler is a child learning to walk; an adolescent is a teenager|toddler 是学步的幼儿；adolescent 是青少年|adolescent/adolescents=an adolescent is a teenager, not a two-year-old learning to walk=adolescent 是青少年，不是正在学走路的两岁孩子;senior/seniors=a senior is over 60, not a child saying first words=senior 超过 60 岁，不是刚会说话的孩子|tod · dler|toddle + r, with a double d|toddle + r，双写 d
      middle-aged|parents of about 50;a man of about fifty;people in their fifties|middle-aged means about 45 to 65; elderly means old|middle-aged 是中年的；elderly 是年老的|elderly=elderly means old, but here people are only about fifty=elderly 是年老的，而这里的人只有五十岁左右;adolescent=adolescent means teenage, not about fifty=adolescent 是青春期的，不是五十岁左右|mid · dle-aged|middle + hyphen + aged|middle + 连字符 + aged
      lifespan|a dog from birth to death;living longer;insects that die after one day|a lifespan is how long a life lasts; childhood is the early part of life|lifespan 是寿命；childhood 是童年|childhood=childhood is only the early years, not from birth to death=childhood 只是早年，不是从出生到死亡;nursing=nursing is caring for the ill, not how long something lives=nursing 是护理，不是活多久|life · span|life + span, one word|life + span，连写成一个词
      expectancy|the average years people live in Japan;a figure that rose with better healthcare;women living five years longer|life expectancy is how many years people are expected to live; life insurance is money paid when someone dies|life expectancy 是预期寿命；life insurance 是人寿保险|insurance=life insurance is money paid after a death, not a number of years=人寿保险是死后赔付的钱，不是年数;cycle=a life cycle is the stages of a living thing, not the years people live on average=life cycle 是生物的生命周期，不是平均活多少年|ex · pect · an · cy|expect + ancy|expect + ancy
      caregiver|a daughter helping her mother every day;people looking after sick relatives;someone helping a man wash and dress|a caregiver looks after someone; an infant is a baby|caregiver 是照护者；infant 是婴儿|infant/infants=an infant is a baby who needs care, not someone who helps others=infant 是需要照顾的婴儿，不是照顾别人的人;toddler/toddlers=a toddler cannot help an old person wash and dress=toddler 没法帮老人洗漱穿衣|care · giv · er|care + giver, one word|care + giver，连写成一个词
      nursing|caring for the sick in a hospital;a home with care day and night;a university course for hospital work|nursing is the job of caring for the ill; teaching is the job of helping people learn|nursing 是护理；teaching 是教学|teaching=teaching is helping people learn, not caring for sick people on a ward=teaching 是教书，不是在病房照顾病人;parenting=parenting is bringing up your own children, not a job in a hospital=parenting 是养育自己的孩子，不是医院里的工作|nurs · ing|nurse drops its e and adds -ing|nurse 去掉 e 加 -ing
      aged|children between six and twelve;parents over 90;people over 85 in a home|aged means very old, or of an age; middle-aged means about 45 to 65|aged 是年老的、……岁的；middle-aged 是中年的|middle-aged=middle-aged means about 50, not children of six or people over 90=middle-aged 是五十岁左右，不是六岁孩子或九十多岁的人;adolescent=adolescent means teenage, not over 85 or between six and twelve=adolescent 是青春期的，不是 85 岁以上或六到十二岁|aged|age + d, said "aid" for "of the age of" and "ay-jid" for "very old"|age + d，表示"……岁的"读 "aid"，表示"年老的"读 "ay-jid"
    `,
  },
});

const linking = vocabularyTopic({
  id: "b2-words-linking-1",
  title: t("Linking Words 3", "连接词（三）"),
  summary: t(
    "Adding with furthermore and moreover; contrasting with nevertheless, nonetheless, whereas and despite; results with consequently, hence and thus; likewise, similarly and namely.",
    "用 furthermore、moreover 补充；用 nevertheless、nonetheless、whereas、despite 表示对比；用 consequently、hence、thus 表示结果；likewise、similarly 和 namely。",
  ),
  intro: t(
    "In my essay on school uniforms, I wrote that they are cheap; **furthermore**, they save time in the morning. Some students dislike them, **whereas** most parents like them. **Nevertheless**, I think students should help choose them. These words help you link ideas in formal writing.",
    "在关于校服的作文里，我写道：校服很便宜；**furthermore**（此外），它们还能节省早上的时间。有些学生不喜欢校服，**whereas**（而）大多数家长喜欢。**Nevertheless**（尽管如此），我认为学生应该参与挑选。这些词帮你在正式写作中连接观点。",
  ),
  prerequisites: ["b1-words-little-words-5"],
  words: [
    word(
      "furthermore",
      "in addition to what has been said (formal)",
      "此外；而且",
      "The flat is cheap. {Furthermore}, it is close to the station. | Exercise improves your health. {Furthermore}, it makes you feel happier. | The plan is too expensive; {furthermore}, it would take ten years to build.",
      "nevertheless consequently",
      "moreover",
    ),
    word(
      "moreover",
      "in addition; and more importantly (formal)",
      "而且；再者",
      "The hotel was dirty. {Moreover}, the staff were rude. | The job is well paid; {moreover}, it is interesting. | Walking is free. {Moreover}, it is good for the planet.",
      "nonetheless hence",
      "furthermore",
    ),
    word(
      "nevertheless",
      "in spite of what has just been said",
      "然而；尽管如此",
      "It was raining. {Nevertheless}, we went for a walk. | The task was difficult; {nevertheless}, she finished it on time. | He is rich but {nevertheless} unhappy.",
      "moreover consequently",
      "nonetheless",
    ),
    word(
      "nonetheless",
      "in spite of this; however",
      "尽管如此；然而",
      "The film was very long. It was, {nonetheless}, very enjoyable. | The risks are small; {nonetheless}, we must be careful. | She was very tired. {Nonetheless}, she kept working until midnight.",
      "consequently likewise",
      "nevertheless",
    ),
    word(
      "whereas",
      "used to compare two facts and show how they are different",
      "然而；反之（连接两个对比的句子）",
      "My brother loves sport, {whereas} I prefer reading. | Some people work from home, {whereas} others go to the office. | {Whereas} the north is dry, the south gets a lot of rain.",
      "despite hence",
    ),
    word(
      "despite",
      "without being stopped by something; in spite of (followed by a noun or an -ing form)",
      "尽管（后接名词或 -ing 形式）",
      "We went out {despite} the heavy rain. | {Despite} his age, he still runs every day. | She got the job {despite} having no experience.",
      "whereas although",
    ),
    word(
      "consequently",
      "as a result",
      "因此；结果",
      "He didn't study. {Consequently}, he failed the exam. | The roads were icy and, {consequently}, many schools closed. | Sales fell sharply; {consequently}, the shop had to close.",
      "nevertheless likewise",
      "hence thus",
    ),
    word(
      "hence",
      "for this reason (formal)",
      "因此",
      "The bridge was closed, {hence} the long delay. | The fruit is grown locally, {hence} its low price. | Prices have risen sharply; {hence} people are buying less.",
      "nevertheless likewise",
      "consequently thus",
    ),
    word(
      "thus",
      "in this way; as a result (formal)",
      "因此；这样",
      "The new road is shorter, {thus} saving time. | She worked hard and {thus} passed easily. | Water was scarce. {Thus}, farmers had to share it.",
      "nevertheless likewise",
      "consequently hence",
    ),
    word(
      "likewise",
      "in the same way; also",
      "同样地",
      "Tom said sorry, and Anna did {likewise}. | Smoking is banned inside. {Likewise}, phones must be switched off. | Children need plenty of sleep; {likewise}, adults need rest.",
      "nevertheless consequently",
      "similarly",
    ),
    word(
      "similarly",
      "in a similar way",
      "同样地；类似地",
      "Cats sleep a lot. {Similarly}, lions rest for most of the day. | The twins dress {similarly}, in the same colors. | Prices rose in Beijing; {similarly}, rents went up in Shanghai.",
      "nevertheless consequently",
      "likewise",
    ),
    word(
      "namely",
      "used to say exactly who or what you mean",
      "即；也就是",
      "Two students were late, {namely} Tom and Li. | The problem is simple, {namely} a lack of money. | Three cities, {namely} Beijing, Shanghai and Shenzhen, will host the event.",
      "hence likewise",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Despite* is followed by a noun or an -ing form, while *whereas* and *although* need a full clause with a verb. Look at what comes after the gap: *the heavy rain* or *having no experience* needs *despite*.",
        "*despite* 后面接名词或 -ing 形式，*whereas* 和 *although* 后面要接带动词的完整从句。看空格后面是什么：*the heavy rain* 或 *having no experience* 前面要用 *despite*。",
      ),
      meaning: t(
        "*Hence* and *thus* show a result, while *likewise* shows that something happens in the same way. Check whether the meaning is about a result or about being the same.",
        "*hence* 和 *thus* 表示结果，*likewise* 表示同样的方式。看释义说的是结果，还是相同。",
      ),
      spell: t(
        "*Nevertheless* and *nonetheless* are each one word; *whereas* joins where and as; *furthermore* joins further and more.",
        "*nevertheless* 和 *nonetheless* 都连写成一个词；*whereas* 由 where 和 as 合成；*furthermore* 由 further 和 more 合成。",
      ),
    },
    notes: `
      furthermore|a cheap flat that is also near the station;exercise that also makes you happy;a plan that is also slow to build|furthermore adds another point; nevertheless shows a contrast|furthermore 表示补充；nevertheless 表示转折|nevertheless=nevertheless shows a surprise, but here a second point simply adds to the first=nevertheless 表示出乎意料，而这里只是补充第二点;consequently=consequently shows a result, but being cheap does not cause being near the station=consequently 表示结果，而便宜并不会导致离车站近|fur · ther · more|further + more, one word|further + more，连写成一个词
      moreover|a dirty hotel with rude staff too;a well-paid job that is also interesting;walking that is free and green|moreover adds a stronger point; nonetheless shows a contrast|moreover 表示补充；nonetheless 表示转折|nonetheless=nonetheless shows a contrast, but here two bad or two good points are added together=nonetheless 表示转折，而这里是两个同样好或同样坏的点相加;hence=hence shows a result, but dirt does not cause rude staff=hence 表示结果，而脏乱不会导致员工粗鲁|more · o · ver|more + over, one word|more + over，连写成一个词
      nevertheless|a walk in the rain;a difficult task finished on time;rich but unhappy|nevertheless shows a surprising contrast; consequently shows a result|nevertheless 表示转折；consequently 表示结果|moreover=moreover adds a similar point, but going for a walk is surprising after rain=moreover 补充相似的点，而下雨还去散步是出乎意料的;consequently=consequently shows a result, but rain does not cause a walk=consequently 表示结果，而下雨不会导致去散步|nev · er · the · less|never + the + less, one word|never + the + less，连写成一个词
      nonetheless|a long film that was still enjoyable;small risks that still need care;tired but still working|nonetheless means in spite of this; consequently means as a result|nonetheless 表示尽管如此；consequently 表示因此|consequently=consequently shows a result, but small risks do not cause the need for care=consequently 表示结果，而风险小并不会导致必须小心;likewise=likewise shows the same way, but being tired and working late are a contrast=likewise 表示同样，而疲惫和继续工作是转折|none · the · less|none + the + less, one word|none + the + less，连写成一个词
      whereas|a brother who loves sport and me who reads;home workers and office workers;a dry north and a rainy south|whereas joins two different facts with a clause; despite takes a noun|whereas 连接两个对比的从句；despite 后接名词|despite=despite needs a noun or an -ing form, not a clause such as *I prefer reading*=despite 后面接名词或 -ing 形式，不接 *I prefer reading* 这样的从句;hence=hence shows a result, but loving sport does not cause someone else to read=hence 表示结果，而一个人爱运动并不会导致另一个人爱读书|where · as|where + as, one word|where + as，连写成一个词
      despite|going out in heavy rain;running every day at an old age;getting a job with no experience|despite comes before a noun or an -ing form; although comes before a clause|despite 后接名词或 -ing 形式；although 后接从句|whereas=whereas needs a clause with a verb, not a noun such as *the heavy rain*=whereas 后面要接带动词的从句，不接 *the heavy rain* 这样的名词;although=although needs a clause such as *it rained*, not *his age* or *having no experience*=although 后面要接 *it rained* 这样的从句，不接 *his age* 或 *having no experience*|de · spite|de + spite, with no *of*|de + spite，后面不加 *of*
      consequently|failing after not studying;schools closed by ice;a shop closed after falling sales|consequently shows a result; nevertheless shows a contrast|consequently 表示结果；nevertheless 表示转折|nevertheless=nevertheless shows a surprise, but failing after not studying is expected=nevertheless 表示出乎意料，而不学习就考不及格是意料之中的;likewise=likewise shows the same way, not a result of icy roads=likewise 表示同样，不是路面结冰的结果|con · se · quent · ly|consequent + ly|consequent + ly
      hence|a delay caused by a closed bridge;a low price from local growing;less buying after prices rose|hence shows the reason for what follows; nevertheless shows a contrast|hence 表示因此；nevertheless 表示转折|nevertheless=nevertheless shows a surprise, but a closed bridge is the expected cause of a delay=nevertheless 表示出乎意料，而桥关闭导致延误是意料之中的;likewise=likewise shows the same way, not a result such as a low price=likewise 表示同样，不是低价这样的结果|hence|h + ence, not *hense*|h + ence，不要写成 *hense*
      thus|a shorter road saving time;hard work leading to an easy pass;scarce water leading to sharing|thus shows a result or how something happens; nevertheless shows a contrast|thus 表示因此；nevertheless 表示转折|nevertheless=nevertheless shows a surprise, but a shorter road is expected to save time=nevertheless 表示出乎意料，而路更短本来就会省时间;likewise=likewise shows the same way, not the result of hard work or scarce water=likewise 表示同样，不是努力或缺水的结果|thus|th + us|th + us
      likewise|Anna doing the same as Tom;phones banned like smoking;adults needing rest like children|likewise means in the same way; consequently means as a result|likewise 表示同样；consequently 表示因此|nevertheless=nevertheless shows a contrast, but here two things are the same=nevertheless 表示转折，而这里两件事一样;consequently=consequently shows a result, but banning smoking does not cause phones to be switched off=consequently 表示结果，而禁烟不会导致必须关手机|like · wise|like + wise, one word|like + wise，连写成一个词
      similarly|lions resting like cats;twins in the same colors;rents rising like prices|similarly means in a similar way; nevertheless shows a contrast|similarly 表示类似地；nevertheless 表示转折|nevertheless=nevertheless shows a contrast, but lions and cats are alike here=nevertheless 表示转折，而这里狮子和猫一样;consequently=consequently shows a result, but cats sleeping does not cause lions to rest=consequently 表示结果，而猫睡觉不会导致狮子休息|sim · i · lar · ly|similar + ly|similar + ly
      namely|the names of two late students;the exact problem;the names of three cities|namely says exactly who or what you mean; hence shows a result|namely 表示即；hence 表示因此|hence=hence shows a result, but Tom and Li are the students, not a result=hence 表示结果，而 Tom 和 Li 就是那两个学生，不是结果;likewise=likewise shows the same way, not the names of who or what you mean=likewise 表示同样，不是说明具体是谁或什么|name · ly|name + ly, keeping the e|name + ly，保留 e
    `,
  },
});

const opinionVerbs = vocabularyTopic({
  id: "b2-words-opinion-verbs",
  title: t("Verbs of Argument", "论证动词"),
  summary: t(
    "Asserting, maintaining and insisting; acknowledging and conceding; emphasizing; denying, disputing, challenging and rejecting; proposing and advocating.",
    "断言、坚持和坚决要求；承认和让步；强调；否认、质疑、挑战和拒绝；提议和倡导。",
  ),
  intro: t(
    "In our class debate about homework, Lin **asserted** that it helps students learn. Tom **disputed** her figures, but he **conceded** that some practice is useful. In the end, our teacher **proposed** a new rule: homework only twice a week. These words help you report what people argue.",
    "在班级关于家庭作业的辩论中，Lin **asserted**（坚称）作业有助于学习。Tom **disputed**（质疑）她的数据，但他也 **conceded**（承认）一些练习是有用的。最后，老师 **proposed**（提议）了一条新规定：每周只布置两次作业。这些词帮你转述别人的论点。",
  ),
  prerequisites: ["b1-words-opinions"],
  words: [
    word(
      "assert asserts asserted asserting",
      "to say firmly that something is true",
      "断言；坚称",
      "She firmly {asserted} that she was innocent.|proposed advocated | He {asserts} that the earth is getting cooler, but the data say otherwise.|proposes advocates | The report {asserts} that the bridge is safe, though engineers disagree.|proposes advocates",
      "propose advocate",
      "maintain insist",
    ),
    word(
      "maintain maintains maintained maintaining",
      "to keep saying that something is true, even when others disagree; to keep something in good condition",
      "坚持（认为）；维护",
      "He {maintained} his innocence until the end.|proposed advocated | She {maintains} that the plan will work, though everyone else doubts it.|proposes advocates | It is expensive to {maintain} an old car.",
      "propose advocate",
      "assert insist",
    ),
    word(
      "acknowledge acknowledges acknowledged acknowledging",
      "to accept or admit that something is true; to say that you have received something",
      "承认；确认收到",
      "The minister {acknowledged} that mistakes had been made and said sorry.|denied disputed | Please {acknowledge} receipt of this letter by replying. | She never {acknowledges} help from others, as if she did everything alone.|denies disputes",
      "deny dispute",
      "concede",
    ),
    word(
      "emphasize emphasizes emphasized emphasizing",
      "to show that something is very important",
      "强调",
      "The teacher {emphasized} that spelling matters by repeating it three times.|denied rejected | I want to {emphasize} one point: safety comes first. | She {emphasized} each word by speaking slowly and loudly.|denied rejected",
      "deny reject",
    ),
    word(
      "insist insists insisted insisting",
      "to say firmly that something is true or must happen",
      "坚持；坚决要求",
      "He {insisted} on paying for dinner, though we offered to pay.|proposed advocated | She {insists} that she saw a ghost and will not change her story.|proposes advocates | I {insist}: you must stay for lunch.",
      "propose advocate",
      "assert maintain",
    ),
    word(
      "deny denies denied denying",
      "to say that something is not true",
      "否认",
      "He {denied} stealing the money and said he had never seen it.|acknowledged emphasized | She {denies} that she was there, but three people saw her.|acknowledges emphasizes | There's no {denying} that the city has improved.|acknowledging emphasizing",
      "acknowledge emphasize",
      "dispute reject",
    ),
    word(
      "dispute disputes disputed disputing",
      "to say that something is not correct or not true; to argue about something",
      "质疑；争论",
      "The two countries {dispute} the border, and both claim the land. | Workers {disputed} the company's figures, saying they were wrong.|acknowledged conceded | Scientists still {dispute} the cause of the disease and argue about it.",
      "acknowledge concede",
      "deny challenge reject",
    ),
    word(
      "challenge challenges challenged challenging",
      "to question whether something is right or true; to test someone's skill",
      "质疑；挑战",
      "Nobody dared to {challenge} the boss's decision, so it stayed. | The lawyer {challenged} the evidence in court, saying it was false.|acknowledged conceded | Good teachers {challenge} their students to think harder.",
      "acknowledge concede",
      "dispute",
    ),
    word(
      "propose proposes proposed proposing",
      "to suggest a plan or an idea; to ask someone to marry you",
      "提议；求婚",
      "I {propose} that we meet again next week to finish the plan. | The government has {proposed} a new tax, and parliament will vote on it next month.|denied rejected | He {proposed} to her on the beach, and she said yes.|denied rejected",
      "deny reject",
    ),
    word(
      "advocate advocates advocated advocating",
      "to support a plan or an idea in public; a person who does this",
      "倡导；拥护者",
      "She {advocates} free education for all and speaks about it everywhere.|denies rejects | Doctors {advocate} regular exercise for a healthy heart. | The group {advocated} cleaner air by marching through the city.|denied rejected",
      "deny reject",
    ),
    word(
      "reject rejects rejected rejecting",
      "to refuse to accept or agree with something",
      "拒绝；否决",
      "The committee {rejected} the plan and voted against it.|proposed advocated | She {rejected} his offer of help, saying she could do it alone.|proposed advocated | Voters {rejected} the proposal, so it will not become law.|proposed advocated",
      "propose advocate",
      "deny dispute",
    ),
    word(
      "concede concedes conceded conceding",
      "to admit, often unwillingly, that something is true; to allow the other side a point or a win",
      "（勉强）承认；让步；认输",
      "He finally {conceded} that he was wrong and said sorry.|denied rejected | The team {conceded} two goals in the first half and lost 2-0.|denied rejected | The candidate {conceded} defeat on election night and congratulated the winner.|denied rejected",
      "deny reject",
      "acknowledge",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "To *concede* is to admit something you did not want to admit, while to *deny* is to say it is not true. Look for words such as *said sorry*, *lost* or *congratulated the winner* that show someone gave in.",
        "*concede* 是不情愿地承认，*deny* 是说某事不是真的。找找 *said sorry*、*lost* 或 *congratulated the winner* 这类词，它们说明有人让步了。",
      ),
      meaning: t(
        "To *propose* or *advocate* is to put forward a plan, while to *assert* is to say firmly that something is true. Check whether the meaning is about a plan or about what is true.",
        "*propose* 或 *advocate* 是提出、支持一个计划，*assert* 是坚称某事属实。看释义说的是计划，还是事实。",
      ),
      spell: t(
        "*Acknowledge* has a silent k and ends in -dge; *emphasize* has ph; *concede* ends in -cede.",
        "*acknowledge* 中有不发音的 k，以 -dge 结尾；*emphasize* 中有 ph；*concede* 以 -cede 结尾。",
      ),
    },
    notes: `
      assert|saying firmly she was innocent;a claim the data do not support;a report saying a bridge is safe|to assert is to say firmly that something is true; to propose is to suggest a plan|assert 是坚称；propose 是提议|propose/proposed/proposes=propose puts forward a plan, not a claim about what is true, such as innocence=propose 提出计划，不是对事实的断言，比如自己无罪;advocate/advocated/advocates=advocate supports a plan, not a claim that a bridge is safe=advocate 支持一个主张或计划，不是断言桥是安全的|as · sert|as + sert, with a double s|as + sert，双写 s
      maintain|innocence kept to the end;a plan everyone doubts;the cost of an old car|to maintain is to keep saying something, or keep it in good condition; to propose is to suggest|maintain 是坚持认为、维护；propose 是提议|propose/proposed/proposes=propose suggests a new plan, not keeps saying the same thing or keeps a car working=propose 是提出新计划，不是一直坚持或维护汽车;advocate/advocated/advocates=advocate supports a plan in public, not keeps saying you are innocent=advocate 是公开支持某主张，不是一直坚称无罪|main · tain|main + tain, with ai twice|main + tain，两处都是 ai
      acknowledge|a minister who said sorry for mistakes;a reply saying a letter came;someone who acts as if she did it alone|to acknowledge is to admit something is true; to deny is to say it is not|acknowledge 是承认；deny 是否认|deny/denied/denies=deny says something is not true, but the minister said sorry for the mistakes=deny 是否认，而部长为错误道了歉;dispute/disputed/disputes=dispute argues that something is wrong, not replying to say a letter came=dispute 是质疑，不是回信确认收到|ac · knowl · edge|ac + knowledge, with a silent k|ac + knowledge，k 不发音
      emphasize|spelling repeated three times;safety first;words spoken slowly and loudly|to emphasize is to show that something is important; to deny is to say it is not true|emphasize 是强调；deny 是否认|deny/denied=deny says something is not true, not repeating it to show it matters=deny 是否认，不是反复说以示重要;reject/rejected=reject refuses something, not speaking each word slowly to make it stand out=reject 是拒绝，不是放慢说每个词让它突出|em · pha · size|em + phas + ize, with ph|em + phas + ize，有 ph
      insist|paying for dinner when others offered;a ghost story she will not change;a guest who must stay for lunch|to insist is to say firmly that something is true or must happen; to propose is to suggest|insist 是坚持；propose 是提议|propose/proposed/proposes=propose only suggests, but here nothing will change his or her mind=propose 只是建议，而这里谁也改变不了他或她的主意;advocate/advocated/advocates=advocate supports a plan in public, not paying for dinner or seeing a ghost=advocate 是公开支持某主张，不是坚持付钱或说见过鬼|in · sist|in + sist|in + sist
      deny|saying he never saw the money;saying she was not there;a fact nobody can say is false|to deny is to say something is not true; to acknowledge is to admit it is|deny 是否认；acknowledge 是承认|acknowledge/acknowledged/acknowledges/acknowledging=acknowledge admits something is true, but he said he had never seen the money=acknowledge 是承认，而他说自己从没见过那笔钱;emphasize/emphasized/emphasizes/emphasizing=emphasize shows that something is important, not saying it never happened=emphasize 是强调，不是说某事没发生过|de · ny|deny becomes denies and denied, changing y to i|deny 变成 denies 和 denied，y 变 i
      dispute|two countries both claiming land;figures workers said were wrong;scientists still arguing about a cause|to dispute is to argue that something is not correct; to acknowledge is to accept it|dispute 是质疑、争论；acknowledge 是承认|acknowledge/acknowledged=acknowledge accepts something as true, but here people say it is wrong or argue=acknowledge 是承认，而这里人们说它错了或在争论;concede/conceded=concede admits the other side is right, but here both sides still claim the land=concede 是让步，而这里双方都还在争那块土地|dis · pute|dis + pute|dis + pute
      challenge|a boss's decision nobody dared to question;evidence called false in court;students pushed to think harder|to challenge is to question something or test someone; to concede is to admit the other side is right|challenge 是质疑、挑战；concede 是让步|acknowledge/acknowledged=acknowledge accepts something, and nobody needs to dare to accept a decision=acknowledge 是承认，接受一个决定不需要胆量;concede/conceded=concede admits the other side is right, but the lawyer called the evidence false=concede 是让步承认，而律师说证据是假的|chal · lenge|chall + enge, with a double l|chall + enge，双写 l
      propose|a meeting next week to finish a plan;a new tax parliament will vote on;a question on the beach she said yes to|to propose is to suggest a plan or ask someone to marry you; to reject is to refuse|propose 是提议、求婚；reject 是拒绝|deny/denied=deny says something is not true, not putting forward a tax or asking someone to marry you=deny 是否认，不是提出新税或求婚;reject/rejected=reject refuses a plan, but parliament has not voted yet and she said yes=reject 是否决，而议会还没投票，她也答应了|pro · pose|pro + pose|pro + pose
      advocate|free education she speaks about everywhere;exercise doctors recommend;cleaner air people marched for|to advocate is to support a plan in public; to reject is to refuse it|advocate 是倡导；reject 是拒绝|deny/denied/denies=deny says something is not true, not supporting free education or cleaner air=deny 是否认，不是支持免费教育或清洁空气;reject/rejected/rejects=reject refuses something, but she speaks for it everywhere=reject 是拒绝，而她到处为它发声|ad · vo · cate|ad + voc + ate|ad + voc + ate
      reject|a plan voted against;help someone did not want;a proposal that will not become law|to reject is to refuse to accept something; to propose is to suggest it|reject 是拒绝；propose 是提议|propose/proposed=propose puts forward a plan, but here it was voted against and will not become law=propose 是提出计划，而这里计划被投票否决，不会成为法律;advocate/advocated=advocate supports something, but she said she could do it alone=advocate 是支持，而她说自己一个人能做|re · ject|re + ject|re + ject
      concede|admitting being wrong and saying sorry;two goals let in during a 2-0 loss;defeat accepted with thanks to the winner|to concede is to admit something unwillingly or give the other side a win; to deny is to say it is not true|concede 是勉强承认、认输；deny 是否认|deny/denied=deny says something is not true, but he said sorry and the candidate congratulated the winner=deny 是否认，而他道了歉，候选人也祝贺了获胜者;reject/rejected=reject refuses something, but the team lost and he admitted he was wrong=reject 是拒绝，而球队输了，他也承认自己错了|con · cede|con + cede, not *conceed*|con + cede，不要写成 *conceed*
    `,
  },
});

// The third conditional.

/**
 * pastIfs are the subject of the if-clause, the base form, the past participle and the past simple of its verb, the
 * rest of the if-clause, and the subject, the base form and the past participle of the verb and the rest of the result.
 */
const handPastIfs: readonly (readonly [string, string, string, string, string, string, string, string, string])[] = [
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

/** pastIfPeople are a person and the pronoun that stands for them. */
const pastIfPeople: readonly (readonly [string, string])[] = [
  ["Tom", "he"],
  ["Maria", "she"],
  ["my parents", "they"],
  ["our team", "it"],
  ["the manager", "she"],
  ["my brother", "he"],
  ["the students", "they"],
];

/** pastIfActs are the base, participle and past of the if-part's verb, its rest, and the base, participle and rest of the result. */
const pastIfActs: readonly (readonly [string, string, string, string, string, string, string])[] = [
  ["leave", "left", "left", "earlier", "catch", "caught", "the train"],
  ["prepare", "prepared", "prepared", "better", "do", "done", "well"],
  ["read", "read", "read", "the email", "know", "known", "about the change"],
  ["take", "taken", "took", "a map", "find", "found", "the way"],
  ["save", "saved", "saved", "more money", "afford", "afforded", "the trip"],
  ["listen", "listened", "listened", "to the advice", "avoid", "avoided", "the mistake"],
  ["check", "checked", "checked", "the forecast", "bring", "brought", "umbrellas"],
  ["book", "booked", "booked", "in advance", "get", "got", "better seats"],
  ["practice", "practiced", "practiced", "more", "win", "won", "the competition"],
  ["ask", "asked", "asked", "for directions", "arrive", "arrived", "on time"],
  ["sleep", "slept", "slept", "well", "feel", "felt", "less tired"],
];

/** pastIfRows builds imagined pasts for every person and act, with the name in the clause that comes first. */
const pastIfRows = (nameFirstInIf: boolean) =>
  everyPair(pastIfPeople, pastIfActs).map(([[person, pronoun], [base, pp, past, rest, rbase, rpp, rr]]) => {
    const [ifSubject, resultSubject] = nameFirstInIf ? [person, pronoun] : [pronoun, person];
    return [ifSubject, base, pp, past, rest, resultSubject, rbase, rpp, rr] as const;
  });

/** pastIfsIfFirst and pastIfsResultFirst are the imagined pasts for sentences that start with the if-part or the result. */
const pastIfsIfFirst = [...handPastIfs, ...pastIfRows(true)];
const pastIfsResultFirst = [...handPastIfs, ...pastIfRows(false)];

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
  pastIfsIfFirst.map(
    ([s, , pp, past, rest, rs, , rpp, rr]): ChoiceItem => [
      `${joinWords("If", s, "___", rest)}, ${joinWords(rs, "would have", rpp, rr)}.`,
      `had ${pp}`,
      [`would have ${pp}`, past],
    ],
  ),
  pastIfsResultFirst.map(
    ([s, , pp, past, rest, rs, , rpp, rr]): ChoiceItem => [
      `${joinWords(sentenceCase(rs), "would have", rpp, rr, "if", s, "___", rest)}.`,
      `had ${pp}`,
      [`would have ${pp}`, past],
    ],
  ),
]);

const wouldHaveChoice: readonly ChoiceItem[] = interleave([
  pastIfsIfFirst.map(
    ([s, , pp, , rest, rs, , rpp, rr]): ChoiceItem => [
      `${joinWords("If", s, "had", pp, rest)}, ${joinWords(rs, "___", rr)}.`,
      `would have ${rpp}`,
      [`would had ${rpp}`, `had ${rpp}`],
    ],
  ),
  pastIfsResultFirst.map(
    ([s, , pp, , rest, rs, , rpp, rr]): ChoiceItem => [
      `${joinWords(sentenceCase(rs), "___", rr, "if", s, "had", pp, rest)}.`,
      `would have ${rpp}`,
      [`would had ${rpp}`, `had ${rpp}`, `would have had ${rpp}`],
    ],
  ),
]);

const pastIfTyped: readonly TypedItem[] = interleave([
  pastIfsIfFirst.map(
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
  pastIfsResultFirst.map(
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
    `The *if*-part imagines a past that did not happen, so it takes the past perfect, *had* and the past participle: ${fill(shown, right)}\n\n**Check.** Spot *would have* in the result clause: the condition is an unreal past, so the *if*-clause takes *had* + past participle (*${right}*).`,
    `*if* 部分想象的是没有发生的过去，所以用过去完成时，即 *had* 加过去分词：${fill(shown, right)}\n\n**检验。** 看结果句里的 *would have*：这是与过去事实相反的条件，*if* 从句必须用 *had* + 过去分词（*${right}*）。`,
  );

/** whyNotPastIf explains would or the past simple in the if-part of a third conditional. */
const whyNotPastIf = (wrong: string, _right: string, _shown: string, position: number): Text =>
  position === 0
    ? t(
        `*would* never goes inside the *if*-clause of a third conditional; use the past perfect there.`,
        `第三条件句的 *if* 从句里不能用 *would*，应使用过去完成时。`,
      )
    : t(
        `*${wrong}* is the past simple, which imagines the present rather than an unreal past.`,
        `*${wrong}* 是一般过去时，想象的是现在而不是没有发生的过去。`,
      );

/** wouldHaveWhy explains would have and the past participle in the result of a third conditional. */
const wouldHaveWhy = (right: string, shown: string): Text =>
  t(
    `The imagined result in the past takes *would have* and the past participle: ${fill(shown, right)}\n\n**Check.** After *would*, the helper is always base *have* (never *had*), followed by the past participle (*${right}*).`,
    `对过去想象的结果用 *would have* 加过去分词：${fill(shown, right)}\n\n**检验。** *would* 后面永远接原形 *have*（绝不是 *had*），再接过去分词（*${right}*）。`,
  );

/** whyNotWouldHave explains would had, or had without would, in the result. */
const whyNotWouldHave = (wrong: string, _right: string, _shown: string, position: number): Text =>
  position === 0
    ? t(
        `After *would* the helper must stay in its base form (*have*), never *had*.`,
        `*would* 后面的助动词必须用原形 *have*，不能用 *had*。`,
      )
    : position === 1
      ? t(
          `*${wrong}* leaves out *would*, so it states a real earlier past event instead of an imagined result.`,
          `*${wrong}* 漏掉了 *would*，意思成了过去真实发生的更早动作，而不是想象的结果。`,
        )
      : t(
          `*${wrong}* repeats the *had* from the *if*-clause; the result clause needs only *would have* + past participle.`,
          `*${wrong}* 把 *if* 从句里的 *had* 多余地搬进了结果句；结果句只需要 *would have* 加过去分词。`,
        );

/** pastIfWriteWhy explains how a third conditional is put together, with the comma when the if-part comes first. */
const pastIfWriteWhy = (right: string): Text =>
  right.startsWith("If ")
    ? t(
        `For an imagined past, the *if*-part takes *had* and the past participle, then a comma, and the result takes *would have* and the past participle: ${right}\n\n**Check.** Verify *If* + *had* + past participle, a comma between clauses, and *would have* + past participle in the result.`,
        `想象过去时，*if* 部分用 *had* 加过去分词，后面加逗号，结果部分用 *would have* 加过去分词：${right}\n\n**检验。** 核对 *If* + *had* + 过去分词、两句之间的逗号，以及结果句里的 *would have* + 过去分词。`,
      )
    : t(
        `For an imagined past, the result takes *would have* and the past participle, and the *if*-part after it takes *had* and the past participle, with no comma: ${right}\n\n**Check.** Verify *would have* + past participle first, then *if* + *had* + past participle with no comma before *if*.`,
        `想象过去时，结果部分用 *would have* 加过去分词，后面的 *if* 部分用 *had* 加过去分词，不加逗号：${right}\n\n**检验。** 核对前半句的 *would have* + 过去分词、后半句的 *if* + *had* + 过去分词，且 *if* 前不加逗号。`,
      );

const thirdConditional: TopicDef = {
  id: "third-conditional",
  title: t("If I Had Known", "要是我早知道（第三条件句）"),
  summary: t(
    "If they had voted, the result would have been different. An imagined past takes the past perfect after if and would have with the past participle in the result.",
    "If they had voted, the result would have been different。想象过去的情况时，if 后面用过去完成时，结果部分用 would have 加过去分词。",
  ),
  intro: t(
    "Looking back at a missed train, you say *If we had left ten minutes earlier, we would have caught it.* Because the past cannot be changed, English pairs *if* + *had* + past participle with *would have* + past participle.",
    "回想错过的一班车，英语说 *If we had left ten minutes earlier, we would have caught it.* 过去无法改写，所以 *if* 从句用 *had* + 过去分词，结果主句用 *would have* + 过去分词。",
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
        "To imagine a different past, one that did not happen, use *if* + the **past perfect** (*had* + past participle):\n\n- *If they **had voted**, the result would have been different.* (They did not vote.)\n- *If I **had known** about the party, I would have come.* (I did not know.)\n\nThe past simple (*If I knew*) is for an imagined **present**, not for the past.\n\n> **Watch out.** Never put *would* or *would have* inside the *if*-clause (*If I would have known* is wrong)—*would have* belongs only in the result clause.",
        "想象一个与过去事实相反的情况时，用 *if* 加**过去完成时**（*had* 加过去分词）：\n\n- *If they **had voted**, the result would have been different.*（事实上他们没投票。）\n- *If I **had known** about the party, I would have come.*（事实上我不知道。）\n\n一般过去时（*If I knew*）是想象**现在**的情况，不是过去。中文说“要是我早知道”，靠“早”和“了”表示过去，英语则要靠动词形式 *had known*。\n\n> **注意。** 绝不能在 *if* 从句里放 *would* 或 *would have*（*If I would have known* 是错的）——*would have* 只能出现在结果主句里。",
      ),
      choiceGenerator(t("Choose the words for the gap.", "选出填入空白处的词。"), pastIfChoice, pastIfWhy, whyNotPastIf),
    ),
    point(
      "result",
      t("Would have done in the result", "结果部分用 would have 加过去分词"),
      t(
        "The imagined result in the past takes *would have* + the **past participle**: *If you had studied harder, you **would have passed** the exam.*\n\nWhen the *if*-part comes first, put a comma after it. You can also say *might have* or *could have* when the result is less certain.\n\n> **Watch out.** After *would*, always write base *have*—never *would had*—and do not drop *would* (*you had passed* describes a real past event, not an imagined result).",
        "过去想象的结果用 *would have* 加**过去分词**：*If you had studied harder, you **would have passed** the exam.*\n\n*if* 部分在前时后面加逗号。结果不太确定时，也可以用 *might have* 或 *could have*。\n\n> **注意。** *would* 后面永远写原形 *have*（不能写成 *would had*），也不要省掉 *would*（*you had passed* 表示过去真实发生的事，不是假设结果）。",
      ),
      choiceGenerator(t("Choose the words for the gap.", "选出填入空白处的词。"), wouldHaveChoice, wouldHaveWhy, whyNotWouldHave),
    ),
    point(
      "write",
      t("Writing third conditionals", "写第三条件句"),
      t(
        "Write the sentence from the note about an imagined past. The arrow → means the *if*-part comes first: *if you study harder → you pass the exam* becomes *If you had studied harder, you would have passed the exam.* The arrow ← means the result comes first: *You would have passed the exam if you had studied harder.* You may write *you'd* for *you had* and *you would*, and *would've* for *would have*.\n\n> **Watch out.** Use a comma only when the *if*-clause comes first; omit the comma when the result clause comes first, and check that both verbs are past participles.",
        "根据笔记写一个想象过去的句子。箭头 → 表示 *if* 部分在前：*if you study harder → you pass the exam* 写成 *If you had studied harder, you would have passed the exam.* 箭头 ← 表示结果在前：*You would have passed the exam if you had studied harder.* 可以把 *you had* 和 *you would* 写成 *you'd*，把 *would have* 写成 *would've*。\n\n> **注意。** 只有 *if* 从句在前时才加逗号，结果句在前时不加逗号；写完后核对两个实义动词是否都是过去分词。",
      ),
      typedGenerator(
        "sentence-pattern",
        t("Write a third conditional sentence from the note.", "根据笔记写一个第三条件句。"),
        pastIfTyped,
        pastIfWriteWhy,
        thirdConditionalWriteNot,
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
