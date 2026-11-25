// B2, unit 7: Culture, Identity and Globalization. Identity, globalization, language, traditions, heritage, belief,
// stereotypes, tourism, food and taste, describing people, and countries together; cleft sentences; the proposal.

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator, type WritingItem } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { judgedTopic } from "../a2/kit.ts";
import { interleave, vocabularyTopic, word } from "../words.ts";
import { cleftSentencesWriteNot } from "./mistakes.ts";

const identity = vocabularyTopic({
  id: "b2-words-identity",
  title: t("Identity", "身份认同"),
  summary: t(
    "Ethnic groups and ethnicity; ancestry and origins; belonging and a homeland; assimilating and integration; multicultural and cosmopolitan cities; indigenous peoples; the diaspora.",
    "族群和族裔；祖先和出身；归属感和故乡；同化和融入；多元文化的和国际化的城市；原住民；海外侨民。",
  ),
  intro: t(
    "Mei's grandparents left their **homeland** decades ago; today she is part of a worldwide **diaspora** and proud of her Chinese **ancestry**. These words help you talk about where people come from and where they feel they **belong**.",
    "梅的祖父母几十年前离开了 **homeland**（故土）；如今她是遍布世界的 **diaspora**（海外侨民）中的一员，并为自己的中国 **ancestry**（血统）感到自豪。这些词帮你谈论人们来自哪里，以及他们觉得自己 **belong**（属于）哪里。",
  ),
  prerequisites: ["b1-words-culture"],
  words: [
    word(
      "ethnic",
      "connected with a group of people who share a culture, a language or a history",
      "民族的；族裔的",
      "The city has many {ethnic} restaurants, run by Thai, Turkish and Ethiopian families. | Several {ethnic} groups, each with its own language and customs, moved to the region last century. | {Ethnic} minorities, whose families came from Asia and Africa, make up ten percent of the population.",
      "indigenous ancestral",
      "ethnicity",
    ),
    word(
      "ethnicity ethnicities",
      "belonging to an ethnic group",
      "族裔；种族背景",
      "People of every {ethnicity} live in the city. | The form asks about your {ethnicity}: Asian, Black, White, mixed or other. | Students of many {ethnicities} attend the school.|diasporas integrations",
      "diaspora integration",
      "ethnic",
    ),
    word(
      "ancestry",
      "the people in your family who lived long before you",
      "祖先；血统",
      "She has Irish {ancestry}. | Many Americans trace their {ancestry} to Europe. | He is proud of his Chinese {ancestry}.",
      "integration diaspora",
      "origin",
    ),
    word(
      "origin origins",
      "the place or the moment where something begins; where a person's family comes from",
      "起源；出身",
      "The word has Latin {origins}.|integrations destinations | What is the {origin} of the festival? | She is of Korean {origin}.",
      "integration destination",
      "ancestry",
    ),
    word(
      "belong belongs belonged belonging",
      "to feel happy and accepted in a place or a group; to be owned by someone",
      "属于；有归属感",
      "After ten years, I finally feel I {belong} here. | This bag {belongs} to my sister.|prolongs originates | Clubs give young people a sense of {belonging}.|prolonging originating",
      "prolong originate",
    ),
    word(
      "homeland homelands",
      "the country where a person or their family comes from",
      "故乡；祖国",
      "He returned to his {homeland} after the war. | Refugees dream of going back to their {homeland}. | Many left their {homelands} in search of work.|diasporas ancestries",
      "diaspora ancestry",
      "origin",
    ),
    word(
      "assimilate assimilates assimilated assimilating",
      "to become part of a new country or group, taking on its culture; to learn and understand something",
      "同化；吸收",
      "Immigrants often {assimilate} within two generations. | The children {assimilated} quickly at their new school.|simulated originated | It takes time to {assimilate} so much new information and make sense of it.",
      "simulate originate",
      "integration",
    ),
    word(
      "integration",
      "the process of becoming a full part of a group or a society",
      "融入；整合",
      "Language classes help the {integration} of newcomers. | The {integration} of refugees takes time. | Racial {integration} in schools began in the 1950s.",
      "ancestry diaspora",
      "assimilate",
    ),
    word(
      "multicultural",
      "including people of many different cultures",
      "多元文化的",
      "London is a {multicultural} city where people speak more than 300 languages. | We live in a {multicultural} society, with neighbors from dozens of countries. | The school has a {multicultural} festival every spring, with food and dances from forty countries.",
      "monocultural homogeneous",
      "cosmopolitan",
    ),
    word(
      "cosmopolitan",
      "full of people and ideas from many countries; having experience of many countries",
      "国际化的；见多识广的",
      "Shanghai is a {cosmopolitan} city, full of people and ideas from all over the world. | She has a {cosmopolitan} outlook after years abroad. | The bar attracts a {cosmopolitan} crowd of students and travelers from many countries.",
      "provincial homogeneous",
      "multicultural",
    ),
    word(
      "indigenous",
      "belonging to a place from the earliest times, not brought from somewhere else",
      "本土的；原住的",
      "The {indigenous} people of Australia have lived there for 60,000 years. | The kangaroo is {indigenous} to Australia: it lived there long before people arrived. | They are fighting for {indigenous} land rights.",
      "foreign ingenious",
    ),
    word(
      "diaspora",
      "people who have spread from their original country to live in many others",
      "海外侨民；离散族群",
      "The Chinese {diaspora}, millions of people living outside China, is found all over the world. | The Irish {diaspora} celebrates St. Patrick's Day. | Members of the {diaspora} send money home.",
      "integration ancestry",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Indigenous* means belonging to a place from the very beginning, so it never fits people or animals that arrived from somewhere else; *ethnic* describes any group with a shared culture, wherever it came from. Look for clues about who was there first.",
        "*indigenous* 指从一开始就属于某地，所以不能用来说从别处迁来的人或动物；*ethnic* 形容任何有共同文化的群体，不管它从哪里来。找找“谁先在那里”的线索。",
      ),
      meaning: t(
        "A *homeland* is the country a family comes from, while a *diaspora* is the people who have spread out from it to live in other countries. Check whether the meaning is a place or a group of people.",
        "*homeland* 是一家人的故国，*diaspora* 则是从故国散居到其他国家的人群。看释义说的是一个地方还是一群人。",
      ),
      spell: t(
        "*Indigenous* ends in -ous, *ethnicity* adds -ity to *ethnic*, and *multicultural* is multi + cultural, written as one word.",
        "*indigenous* 结尾是 -ous；*ethnicity* 是 *ethnic* 加 -ity；*multicultural* 由 multi + cultural 合写而成。",
      ),
    },
    notes: `
      ethnic|restaurants run by Thai, Turkish and Ethiopian families;groups with their own language and customs who moved to a region;minorities whose families came from Asia and Africa|ethnic describes a group sharing a culture; indigenous describes those who were there first|ethnic 形容有共同文化的群体；indigenous 形容最早就在那里的人|indigenous=indigenous means belonging to a place from the earliest times, not people whose families moved there later=indigenous 是自古就属于某地的，不是后来才迁来的人;ancestral=ancestral means belonging to people in your family long ago, not a group sharing a culture today=ancestral 是祖先的，不是指今天有共同文化的群体|eth · nic|th after e, and -ic at the end|e 后面是 th，结尾是 -ic
      ethnicity|people of every background in a city;a form asking whether you are Asian, Black, White or mixed;students of many backgrounds at a school|ethnicity is the ethnic group you belong to; a diaspora is a people spread across many countries|ethnicity 是你所属的族裔；diaspora 是散居多国的族群|diaspora/diasporas=diaspora is a people spread out from their homeland, not the group a person belongs to on a form=diaspora 是从故土散居各地的族群，不是表格上填写的个人族裔;integration/integrations=integration is the process of becoming part of a society, not the ethnic group you belong to=integration 是融入社会的过程，不是所属的族裔|eth · nic · i · ty|ethnic + ity, with c said like s|ethnic + ity，c 读作 s
      ancestry|Irish family roots;Americans tracing their families to Europe;pride in Chinese family roots|ancestry is the family who lived before you; integration is becoming part of a new society|ancestry 是祖辈血统；integration 是融入新社会|integration=integration is becoming part of a new society, not the family who lived long before you=integration 是融入新社会，不是很久以前的祖辈;diaspora=diaspora is a people living spread across many countries, not one person's family line=diaspora 是散居多国的族群，不是一个人的家族血统|an · ces · try|ancest- as in *ancestor*, and -ry at the end|ancest- 同 *ancestor*，结尾是 -ry
      origin|a word with Latin roots;where a festival began;a Korean family background|an origin is where something begins; a destination is where it ends up|origin 是起点；destination 是终点|integration/integrations=integration is becoming part of a society, not where a word, a festival or a family began=integration 是融入社会，不是词语、节日或家族的起源;destination/destinations=destination is the place you are going to, the opposite of where something began=destination 是要去的地方，和起源正相反|or · i · gin|g said like j, and -in at the end|g 读作 j，结尾是 -in
      belong|feeling at home after ten years;a bag owned by a sister;the feeling of being accepted that clubs give|to belong is to feel accepted or to be owned by someone; to prolong is to make something last longer|belong 是有归属感或归某人所有；prolong 是延长|prolong/prolongs/prolonging=prolong means to make something last longer, not to feel accepted or to be owned=prolong 是延长，不是有归属感，也不是归某人所有;originate/originates/originating=originate means to begin or come from somewhere, not to feel at home or to be owned by someone=originate 是起源于，不是有归属感，也不是归某人所有|be · long|be + long, with -ong at the end|be + long，结尾是 -ong
      homeland|returning to a country after the war;refugees dreaming of going back;countries people left in search of work|a homeland is the country you come from; a diaspora is the people spread out from it|homeland 是故国；diaspora 是从故国散居出去的人|diaspora/diasporas=diaspora is the people spread out from a homeland, not the country they return to or leave=diaspora 是从故土散居出去的人，不是人们回去或离开的国家;ancestry/ancestries=ancestry is the family who lived before you, not a country you can return to or leave=ancestry 是祖辈血统，不是可以回去或离开的国家|home · land|home + land, one word|home + land，合成一个词
      assimilate|immigrants becoming part of a country within two generations;children fitting in at a new school;taking in new information and making sense of it|to assimilate is to become part of a group or take something in; to simulate is to copy or pretend|assimilate 是融入或吸收；simulate 是模仿或假装|simulate/simulated=simulate means to copy or pretend something, not to become part of a group or take in information=simulate 是模拟或假装，不是融入群体或吸收信息;originate/originated=originate means to begin or come from somewhere, not to fit in or take something in=originate 是起源于，不是融入或吸收|as · sim · i · late|the double s, and one m|双写 s，只有一个 m
      integration|language classes for newcomers;refugees becoming part of society;black and white pupils in the same schools from the 1950s|integration is becoming a full part of a society; ancestry is your family line|integration 是融入社会；ancestry 是家族血统|ancestry=ancestry is the family who lived before you, not the process of becoming part of a new society=ancestry 是祖辈血统，不是融入新社会的过程;diaspora=diaspora is a people spread across the world, not the process of joining a society or a school=diaspora 是散居各地的族群，不是融入社会或学校的过程|in · te · gra · tion|integrate + ion, with -tion said like *shun*|integrate + ion，-tion 读作 *shun*
      multicultural|a city where people speak more than 300 languages;a society with neighbors from dozens of countries;a festival with food and dances from forty countries|multicultural means including many cultures; monocultural means having only one|multicultural 是多元文化的；monocultural 是单一文化的|monocultural=monocultural means having only one culture, the opposite of hundreds of languages or dozens of countries=monocultural 是单一文化的，和几百种语言、几十个国家正相反;homogeneous=homogeneous means made of people who are all the same, the opposite of many different cultures=homogeneous 是成员都一样的，和多种文化并存正相反|mul · ti · cul · tur · al|multi + cultural, one word|multi + cultural，合成一个词
      cosmopolitan|a city full of people and ideas from all over the world;an outlook formed by years abroad;a crowd of students and travelers from many countries|cosmopolitan means full of influences from many countries; provincial means narrow and local|cosmopolitan 是国际化的；provincial 是狭隘的、地方性的|provincial=provincial means narrow and local, the opposite of people and ideas from all over the world=provincial 是狭隘、地方性的，和来自世界各地的人和思想正相反;homogeneous=homogeneous means all the same, the opposite of a mix of people from many countries=homogeneous 是全都一样的，和来自多国的人混在一起正相反|cos · mo · pol · i · tan|cosmo + politan, with -tan at the end|cosmo + politan，结尾是 -tan
      indigenous|people who have lived in Australia for 60,000 years;the kangaroo before people arrived;land rights of the first people|indigenous means belonging to a place from the earliest times; foreign means from another country|indigenous 是本土原生的；foreign 是外来的|foreign=foreign means coming from another country, the opposite of being there from the earliest times=foreign 是来自别国的，和自古就在那里正相反;ingenious=ingenious means clever and full of new ideas, not belonging to a place from the start=ingenious 是机灵巧妙的，不是本土原生的|in · dig · e · nous|g said like j, and -ous at the end|g 读作 j，结尾是 -ous
      diaspora|millions of Chinese people living outside China;Irish people abroad celebrating St. Patrick's Day;people abroad sending money home|a diaspora is a people spread out from their country; ancestry is a person's family line|diaspora 是散居海外的族群；ancestry 是个人的家族血统|integration=integration is the process of joining a society, not a people living in many countries=integration 是融入社会的过程，不是散居多国的族群;ancestry=ancestry is one person's family line, not a group of people who send money home or celebrate abroad=ancestry 是个人的家族血统，不是寄钱回家或在海外庆祝节日的群体|di · as · po · ra|di + aspora, with -ora at the end|di + aspora，结尾是 -ora
    `,
  },
});

const global = vocabularyTopic({
  id: "b2-words-globalization",
  title: t("Globalization", "全球化"),
  summary: t(
    "Globalization and worldwide trade; an interconnected world; outsourcing; homogeneous and diverse cultures; dominant powers and dominating markets; cross-cultural, cultural and intercultural contact; borderless markets.",
    "全球化和全球贸易；相互联系的世界；外包；同质的和多样的文化；占主导地位的强国和主导市场；跨文化的、文化的和不同文化间的交流；无国界的市场。",
  ),
  intro: t(
    "**Globalization** has made our world deeply **interconnected**: a phone designed in California is made in China and sold **worldwide**. These words help you talk about how countries, companies and cultures affect each other.",
    "**globalization**（全球化）让世界变得紧密 **interconnected**（相互联系）：一部在加州设计的手机在中国制造，再销往 **worldwide**（全世界）。这些词帮你谈论国家、公司和文化之间怎样相互影响。",
  ),
  prerequisites: ["b1-words-nations"],
  words: [
    word(
      "globalization",
      "the process by which businesses and cultures around the world become connected",
      "全球化",
      "{Globalization} has made cheap goods available everywhere. | Critics say {globalization} destroys local cultures, as the same shops and films spread across the world. | The internet has speeded up {globalization}.",
      "localization isolation",
    ),
    word(
      "worldwide",
      "in every part of the world",
      "全世界的；遍及全球的",
      "The film was a {worldwide} success, shown in cinemas on every continent. | The company has a {worldwide} staff of 50,000, in offices across forty countries. | There is a {worldwide} shortage of nurses, from Brazil to Japan.",
      "nationwide local",
      "borderless",
    ),
    word(
      "interconnected",
      "connected with each other, so that each affects the others",
      "相互联系的",
      "The world's economies are deeply {interconnected}: a crisis in one quickly spreads to the others. | These problems are {interconnected}: you can't solve one without the others. | We live in an {interconnected} world, where news from one country reaches every other in seconds.",
      "independent isolated",
    ),
    word(
      "outsource outsources outsourced outsourcing",
      "to pay another company, often abroad, to do work for you",
      "外包",
      "The company {outsources} its customer service to India.|dominates resources | Many jobs have been {outsourced} to cheaper countries.|dominated resourced | {Outsourcing} cut the firm's costs.|dominating resourcing",
      "dominate resource",
    ),
    word(
      "homogeneous",
      "made of parts or people that are all the same",
      "同质的；单一的",
      "Japan is a fairly {homogeneous} society: most people share the same language and background. | The group is too {homogeneous}: everyone has the same background. | Some fear that world culture is becoming {homogeneous}, with the same films and shops everywhere.",
      "heterogeneous cosmopolitan",
      "diverse",
    ),
    word(
      "diverse",
      "very different from each other; including many different types",
      "多样的；各不相同的",
      "The city has a {diverse} population, with people from over a hundred countries. | Her interests are very {diverse}: she loves jazz, football, chemistry and old maps. | The team is {diverse}, with members from twelve countries.",
      "uniform similar",
      "homogeneous",
    ),
    word(
      "dominant",
      "more powerful, important or noticeable than others",
      "占主导地位的；主要的",
      "English is the {dominant} language of the internet: more than half of all websites use it. | The company has a {dominant} position in the market, selling eight out of ten phones. | Fear was the {dominant} feeling in the city: almost everyone was afraid.",
      "minor dormant",
      "dominate",
    ),
    word(
      "dominate dominates dominated dominating",
      "to have power or control over others; to be the most important or noticeable feature",
      "支配；主导",
      "A few companies {dominate} the market. | The castle {dominates} the town.|nominates outsources | The election {dominated} the news.|nominated outsourced",
      "nominate outsource",
      "dominant",
    ),
    word(
      "cross-cultural",
      "involving two or more different cultures",
      "跨文化的",
      "The course teaches {cross-cultural} communication. | {Cross-cultural} marriages, between people from different cultures, are more common than before. | We study {cross-cultural} differences in body language.",
      "homogeneous dominant",
      "intercultural",
    ),
    word(
      "cultural",
      "connected with the customs, art and ideas of a society",
      "文化的",
      "The city is the {cultural} center of the country, with its theaters, museums and concert halls. | There are big {cultural} differences between the two countries, in manners, music and religion. | The museum organizes {cultural} events for children.",
      "agricultural cultured",
    ),
    word(
      "intercultural",
      "happening between people of different cultures",
      "不同文化间的",
      "The exchange encourages {intercultural} dialogue. | {Intercultural} skills are valuable for diplomats. | She researches {intercultural} friendships between people who grew up in different countries.",
      "homogeneous dominant",
      "cross-cultural",
    ),
    word(
      "borderless",
      "not limited by the borders between countries",
      "无国界的",
      "The internet has created a {borderless} market where you can buy from any country. | Some dream of a {borderless} Europe, with no passport checks between countries. | Viruses are {borderless}: they spread everywhere.",
      "homogeneous dominant",
      "worldwide",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Homogeneous* and *diverse* pull in opposite directions: a *homogeneous* group is all the same, a *diverse* one mixes many kinds. Look for clues such as *the same background* or *from twelve countries* before you choose.",
        "*homogeneous* 和 *diverse* 方向相反：*homogeneous* 的群体全都一样，*diverse* 的群体五花八门。选之前先找 *the same background* 或 *from twelve countries* 这样的线索。",
      ),
      meaning: t(
        "*Dominate* is the verb and *dominant* the adjective: companies *dominate* a market and hold a *dominant* position in it. Neither means *nominate*, which is choosing someone for a prize or a job.",
        "*dominate* 是动词，*dominant* 是形容词：公司 *dominate* 市场，在市场中占据 *dominant* 地位。两者都不是 *nominate*（提名某人获奖或任职）。",
      ),
      spell: t(
        "*Homogeneous* ends in -eneous, with an e before -ous; *cross-cultural* keeps its hyphen, but *intercultural*, *interconnected* and *worldwide* are each written as one word.",
        "*homogeneous* 结尾是 -eneous，-ous 前有个 e；*cross-cultural* 要保留连字符，而 *intercultural*、*interconnected*、*worldwide* 都合写成一个词。",
      ),
    },
    notes: `
      globalization|cheap goods available everywhere;the same shops and films spreading across the world;the internet speeding up world connections|globalization connects the whole world; localization keeps things to one place|globalization 让全世界连成一体；localization 让事物限于本地|localization=localization means keeping things suited to one place, the opposite of goods, shops and films spreading everywhere=localization 是让事物适应某一地，和商品、商店、电影遍布全球正相反;isolation=isolation means being cut off from others, the opposite of the world becoming connected=isolation 是与外界隔绝，和世界连成一体正相反|glob · al · i · za · tion|global + ize + ation, with -za- in the middle|global + ize + ation，中间是 -za-
      worldwide|a film shown on every continent;a staff of 50,000 across forty countries;a shortage of nurses from Brazil to Japan|worldwide means in every part of the world; nationwide means across one country|worldwide 是全世界的；nationwide 是全国的|nationwide=nationwide means across one country only, not every continent or forty countries=nationwide 是只在一个国家范围内，不是遍及各大洲或四十个国家;local=local means in one small area, the opposite of all over the world=local 是本地的，和遍布全世界正相反|world · wide|world + wide, one word|world + wide，合成一个词
      interconnected|economies where a crisis in one spreads to the others;problems that cannot be solved one by one;a world where news travels everywhere in seconds|interconnected means linked so each affects the others; independent means standing alone|interconnected 是相互联系、彼此影响的；independent 是独立的|independent=independent means standing alone and not affected by others, the opposite of crises and news spreading between countries=independent 是独立的、不受别人影响，和危机、新闻在国家间传播正相反;isolated=isolated means cut off from others, the opposite of being linked together=isolated 是孤立隔绝的，和相互连接正相反|in · ter · con · nect · ed|inter + connected, with a double n|inter + connected，双写 n
      outsource|customer service done by a company in India;jobs sent to cheaper countries;a way of cutting a firm's costs|to outsource is to pay another company to do your work; to dominate is to control|outsource 是把工作外包给别的公司；dominate 是控制、支配|dominate/dominates/dominated/dominating=dominate means to control others, not to pay another company to do your work=dominate 是控制别人，不是花钱请别的公司干活;resource/resources/resourced/resourcing=resource means to give the money or people needed, not to send your work to another company=resource 是提供所需的钱或人力，不是把工作交给别的公司|out · source|out + source, one word|out + source，合成一个词
      homogeneous|a society where most share the same language and background;a group where everyone has the same background;a world culture with the same films everywhere|homogeneous means all the same; heterogeneous means made of different kinds|homogeneous 是同质的；heterogeneous 是混杂多样的|heterogeneous=heterogeneous means made of many different kinds, the opposite of everyone sharing the same background=heterogeneous 是由多种不同成分组成的，和大家背景都一样正相反;cosmopolitan=cosmopolitan means full of people and ideas from many countries, the opposite of everything being the same=cosmopolitan 是汇聚各国人和思想的，和千篇一律正相反|ho · mo · ge · ne · ous|g said like j, and -eous at the end|g 读作 j，结尾是 -eous
      diverse|people from over a hundred countries;interests from jazz to chemistry and old maps;a team with members from twelve countries|diverse means including many kinds; uniform means all the same|diverse 是多样的；uniform 是一律相同的|uniform=uniform means all the same, the opposite of a hundred countries or interests from jazz to maps=uniform 是全都一样的，和来自一百个国家、兴趣从爵士到地图正相反;similar=similar means alike, not including many very different kinds=similar 是相似的，不是包含很多截然不同的种类|di · verse|di + verse, with the silent e at the end|di + verse，结尾的 e 不发音
      dominant|the language of more than half of all websites;a company selling eight out of ten phones;a feeling almost everyone had|dominant means the strongest or most important; minor means small and less important|dominant 是占主导的；minor 是次要的|minor=minor means small and less important, the opposite of more than half, eight out of ten or almost everyone=minor 是次要的，和一半以上、十分之八、几乎所有人正相反;dormant=dormant means sleeping or not active for now, not the strongest or most noticeable=dormant 是休眠的、暂不活跃的，不是最强或最显著的|dom · i · nant|-ant at the end for the adjective|形容词结尾是 -ant
      dominate|a few companies controlling a market;a castle standing over a town;an election filling the news|to dominate is to control or be the most noticeable; to nominate is to choose someone for a prize or a job|dominate 是支配或最显眼；nominate 是提名|nominate/nominates/nominated=nominate means to choose someone officially for a prize or a job, not to control a market, a town or the news=nominate 是正式提名某人获奖或任职，不是控制市场、城镇或新闻;outsource/outsources/outsourced=outsource means to pay another company to do work, not to control or stand over something=outsource 是外包，不是控制或俯视|dom · i · nate|-ate at the end for the verb|动词结尾是 -ate
      cross-cultural|communication between cultures taught on a course;marriages between people from different cultures;differences in body language between cultures|cross-cultural means involving different cultures; homogeneous means all the same|cross-cultural 是跨文化的；homogeneous 是同质的|homogeneous=homogeneous means all the same, not involving two or more different cultures=homogeneous 是全都一样的，不涉及两种以上不同的文化;dominant=dominant means the strongest or most important, not between different cultures=dominant 是占主导的，不是不同文化之间的|cross-cul · tur · al|cross + cultural with a hyphen|cross 和 cultural 之间用连字符
      cultural|a city with theaters, museums and concert halls;differences in manners, music and religion;museum events for children|cultural means connected with art and customs; agricultural means connected with farming|cultural 是文化的；agricultural 是农业的|agricultural=agricultural means connected with farming, not theaters, museums, manners or music=agricultural 是农业的，与剧院、博物馆、礼仪或音乐无关;cultured=cultured describes a person who knows a lot about art and books, not a center, a difference or an event=cultured 形容有修养的人，不形容中心、差异或活动|cul · tur · al|culture + al, with the e dropped|culture + al，去掉 e
      intercultural|dialogue encouraged by an exchange;skills diplomats need;friendships between people from different countries|intercultural means between people of different cultures; homogeneous means all the same|intercultural 是不同文化之间的；homogeneous 是同质的|homogeneous=homogeneous means all the same, not happening between people of different cultures=homogeneous 是全都一样的，不是发生在不同文化的人之间;dominant=dominant means the strongest or most important, not between cultures=dominant 是占主导的，不是文化之间的|in · ter · cul · tur · al|inter + cultural, one word|inter + cultural，合成一个词
      borderless|a market where you can buy from any country;a Europe with no passport checks;viruses spreading everywhere|borderless means not limited by borders; homogeneous means all the same|borderless 是无国界的；homogeneous 是同质的|homogeneous=homogeneous means all the same, not free from borders between countries=homogeneous 是全都一样的，不是没有国界限制;dominant=dominant means the strongest or most important, not without borders=dominant 是占主导的，不是没有国界的|bor · der · less|border + less, with a double s|border + less，双写 s
    `,
  },
});

const language = vocabularyTopic({
  id: "b2-words-language",
  title: t("Language", "语言"),
  summary: t(
    "Linguistic skills; idioms, slang, jargon and proverbs; fluency, vocabulary, pronunciation and grammar; translations and interpreters; multilingual people.",
    "语言能力；习语、俚语、行话和谚语；流利、词汇、发音和语法；翻译和口译员；会说多种语言的人。",
  ),
  intro: t(
    "Learning a language takes more than **grammar** and **vocabulary**: you also need clear **pronunciation**, a feel for **idioms** and, with practice, real **fluency**. These words help you talk about languages and how people learn and use them.",
    "学一门语言不只是学 **grammar**（语法）和 **vocabulary**（词汇）：还要有清楚的 **pronunciation**（发音）、对 **idioms**（习语）的语感，并通过练习达到真正的 **fluency**（流利）。这些词帮你谈论语言以及人们怎样学习和使用语言。",
  ),
  prerequisites: ["b1-words-communicating"],
  words: [
    word(
      "linguistic",
      "connected with language or with the study of language",
      "语言的；语言学的",
      "Children have amazing {linguistic} abilities: they can learn two languages at once. | The country is a {linguistic} puzzle, with forty languages. | She studies the {linguistic} development of babies.",
      "fluent logistic",
    ),
    word(
      "idiom idioms",
      "a group of words whose meaning is different from the meanings of its single words",
      "习语；成语",
      '"Break a leg" is an {idiom} that means "good luck". | English has thousands of {idioms}, such as "raining cats and dogs".|interpreters accents | It\'s hard to translate {idioms} word for word.|interpreters accents',
      "interpreter accent",
      "proverb",
    ),
    word(
      "slang",
      "very informal words, often used by a particular group of people",
      "俚语",
      '"Cool" is {slang} for "very good". | Teenagers use a lot of {slang}. | Avoid {slang} in an essay.',
      "pronunciation fluency",
      "jargon",
    ),
    word(
      "jargon",
      "special words used by a particular group, which are hard for others to understand",
      "行话；术语",
      "The report is full of legal {jargon}. | Doctors should avoid medical {jargon} with patients. | The manual is written in technical {jargon}.",
      "fluency pronunciation",
      "slang",
    ),
    word(
      "proverb proverbs",
      "a short, well-known saying that gives advice or says something true",
      "谚语",
      'As the old {proverb} says, "Practice makes perfect." | Every culture has its own {proverbs}, short sayings that pass on old wisdom.|grammars vocabularies | My grandmother loved Chinese {proverbs} and quoted one whenever we needed advice.|grammars vocabularies',
      "grammar vocabulary",
      "idiom",
    ),
    word(
      "fluency",
      "the ability to speak or write a language easily and well",
      "流利；流畅",
      "She speaks French with great {fluency}. | {Fluency} in English is required for the job. | Reading aloud improves {fluency}.",
      "jargon slang",
    ),
    word(
      "vocabulary vocabularies",
      "all the words that a person knows or that a language has",
      "词汇；词汇量",
      "Reading widely helps you build your {vocabulary}, as you meet hundreds of new words. | Children's {vocabularies} grow very quickly.|pronunciations interpreters | The word is not part of my {vocabulary}.",
      "pronunciation interpreter",
    ),
    word(
      "pronunciation",
      "the way a word is said",
      "发音",
      "Her {pronunciation} is almost perfect: when she speaks English, she sounds like a native. | English {pronunciation} doesn't always follow the spelling. | Listen and repeat to improve your {pronunciation}.",
      "punctuation jargon",
    ),
    word(
      "grammar",
      "the rules for putting words together in a language",
      "语法",
      "Check your spelling and {grammar}: every verb must agree with its subject. | Chinese {grammar} has no verb tenses. | She teaches English {grammar}: the rules for tenses, articles and word order.",
      "slang fluency",
    ),
    word(
      "translation translations",
      "words that have been changed from one language into another",
      "翻译；译文",
      "I read the novel in {translation}. | The website offers {translations} of every page in ten languages.|pronunciations fluencies | Something is always lost in {translation}.",
      "pronunciation fluency",
      "interpreter",
    ),
    word(
      "interpreter interpreters",
      "a person who changes what someone says into another language as they speak",
      "口译员",
      "The president spoke through an {interpreter}. | The court provided an {interpreter} for the witness. | {Interpreters} must think very quickly, turning each sentence into another language as it is spoken.|idioms editors",
      "idiom editor",
      "translation",
    ),
    word(
      "multilingual",
      "able to speak several languages; using several languages",
      "会说多种语言的；多语的",
      "Switzerland is a {multilingual} country, with four official languages. | The hotel has {multilingual} staff who can help guests in six languages. | {Multilingual} children often switch between languages.",
      "monolingual multiple",
      "linguistic",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Pronunciation* and *punctuation* look alike: *pronunciation* is how words sound when you speak, *punctuation* is the commas and full stops of writing. Look for clues about speaking, listening and sounding like a native.",
        "*pronunciation* 和 *punctuation* 长得像：*pronunciation* 是说话时词的读音，*punctuation* 是书面上的逗号句号。找找和说、听、像母语者一样发音有关的线索。",
      ),
      meaning: t(
        "*Vocabulary* is the words you know, *grammar* is the rules for putting them together, and *pronunciation* is how you say them. Check whether the meaning is about words, rules or sounds.",
        "*vocabulary* 是你认识的词，*grammar* 是把词组织起来的规则，*pronunciation* 是怎么读。看释义说的是词、规则还是读音。",
      ),
      spell: t(
        "*Pronunciation* drops the o of *pronounce*: *pro · nun · ci · a · tion*, not *pronounciation*. *Grammar* ends in -ar, not -er.",
        "*pronunciation* 去掉了 *pronounce* 里的 o：*pro · nun · ci · a · tion*，不是 *pronounciation*。*grammar* 结尾是 -ar，不是 -er。",
      ),
    },
    notes: `
      linguistic|children learning two languages at once;a country with forty languages;the way babies develop language|linguistic means connected with language; fluent means speaking a language easily|linguistic 是语言的；fluent 是说得流利的|fluent=fluent describes a person who speaks easily, not abilities, a puzzle or development to do with language=fluent 形容说话流利的人，不形容语言能力、语言难题或语言发展;logistic=logistic means connected with moving goods and organizing supplies, not with language=logistic 是物流、后勤方面的，与语言无关|lin · guis · tic|gu said like *gw*, and -ic at the end|gu 读作 *gw*，结尾是 -ic
      idiom|"break a leg" meaning good luck;English sayings like "raining cats and dogs";phrases that cannot be translated word for word|an idiom is a phrase with a special meaning; an accent is the way a person sounds|idiom 是有特殊含义的短语；accent 是口音|interpreter/interpreters=interpreter is a person who changes speech into another language, not a phrase that means *good luck*=interpreter 是做口译的人，不是表示“祝好运”的短语;accent/accents=accent is the way someone's speech sounds, not a phrase whose meaning differs from its words=accent 是说话的口音，不是字面意思和实际意思不同的短语|id · i · om|-iom at the end, not *idiot*|结尾是 -iom，别写成 *idiot*
      slang|"cool" for "very good";the informal words teenagers use;words to avoid in an essay|slang is very informal words; pronunciation is how words are said|slang 是很随意的口语词；pronunciation 是读音|pronunciation=pronunciation is how words are said, not informal words like *cool*=pronunciation 是词的读法，不是 *cool* 这样的随意词;fluency=fluency is speaking easily and well, not informal words that teenagers use=fluency 是说得流畅，不是青少年用的随意词|slang|sl at the start, and -ang at the end|开头是 sl，结尾是 -ang
      jargon|legal words in a report;medical words doctors should avoid with patients;technical words in a manual|jargon is the special words of a job; fluency is speaking a language easily|jargon 是行业术语；fluency 是说话流利|fluency=fluency is speaking a language easily, not the special words of law, medicine or machines=fluency 是说话流利，不是法律、医学或机器方面的专门用语;pronunciation=pronunciation is how words are said, not words only experts understand=pronunciation 是词的读法，不是只有专家才懂的词|jar · gon|j said like *dj*, and -gon at the end|j 读作 *dj*，结尾是 -gon
      proverb|an old saying that practice makes perfect;short sayings that pass on old wisdom;Chinese sayings quoted as advice|a proverb is a short saying that gives advice; grammar is the rules of a language|proverb 是给人忠告的谚语；grammar 是语言规则|grammar/grammars=grammar is the rules for putting words together, not a short saying that gives advice=grammar 是组词成句的规则，不是给人忠告的简短俗语;vocabulary/vocabularies=vocabulary is all the words a person or a language has, not one wise saying=vocabulary 是一个人或一种语言的全部词汇，不是一句智慧的俗语|prov · erb|pro + verb, with o as in *hot*|pro + verb，o 读作 *hot* 里的 o
      fluency|speaking French easily and well;easy English required for a job;reading aloud to speak more smoothly|fluency is speaking a language easily; jargon is the special words of a job|fluency 是说话流利；jargon 是行业术语|jargon=jargon is the special words of a job, not the ability to speak a language easily=jargon 是行业术语，不是说话流利的能力;slang=slang is informal words, not an ability that a job requires or reading improves=slang 是随意的口语词，不是工作要求、朗读能提高的能力|flu · en · cy|flu + ency, with -cy at the end|flu + ency，结尾是 -cy
      vocabulary|hundreds of new words met by reading widely;children's growing number of words;a word not among the ones someone knows|vocabulary is all the words you know; pronunciation is how you say them|vocabulary 是你认识的全部词；pronunciation 是读音|pronunciation/pronunciations=pronunciation is how words are said, not the number of words you know or meet in books=pronunciation 是词的读法，不是你认识或在书里遇到的词的数量;interpreter/interpreters=interpreter is a person who translates speech, not the words someone knows=interpreter 是做口译的人，不是一个人认识的词|vo · cab · u · lar · y|-ary at the end, with u in the middle|结尾是 -ary，中间是 u
      pronunciation|speaking English like a native;the way English words sound compared with their spelling;listening and repeating|pronunciation is how words sound; punctuation is commas and full stops in writing|pronunciation 是读音；punctuation 是书面上的标点|punctuation=punctuation is commas and full stops in writing, not the way words sound when you speak or listen=punctuation 是书面标点，不是说话和听时词的读音;jargon=jargon is the special words of a job, not how words sound=jargon 是行业术语，不是词的读音|pro · nun · ci · a · tion|*nun* in the middle, without the o of *pronounce*|中间是 *nun*，没有 *pronounce* 里的 o
      grammar|every verb agreeing with its subject;Chinese having no verb tenses;rules for tenses, articles and word order|grammar is the rules of a language; slang is informal words|grammar 是语言规则；slang 是随意的口语词|slang=slang is very informal words, not rules about verbs, tenses and word order=slang 是很随意的词，不是关于动词、时态和语序的规则;fluency=fluency is speaking easily, not the rules for putting words together=fluency 是说话流利，不是组词成句的规则|gram · mar|the double m, and -ar at the end, not -er|双写 m，结尾是 -ar，不是 -er
      translation|a novel read in another language;every page of a website in ten languages;meaning lost between languages|a translation is words changed into another language; pronunciation is how words are said|translation 是译成另一种语言的文字；pronunciation 是读音|pronunciation/pronunciations=pronunciation is how words are said, not a text changed into another language=pronunciation 是词的读法，不是译成别的语言的文字;fluency/fluencies=fluency is speaking a language easily, not a version of a text in another language=fluency 是说话流利，不是文字的另一种语言版本|trans · la · tion|trans + lation, with -tion said like *shun*|trans + lation，-tion 读作 *shun*
      interpreter|a person a president speaks through;a person a court provides for a witness;people turning each sentence into another language as it is spoken|an interpreter is a person who translates speech; an idiom is a phrase|interpreter 是口译员；idiom 是习语|idiom/idioms=idiom is a phrase with a special meaning, not a person who speaks for someone in another language=idiom 是有特殊含义的短语，不是用另一种语言替人说话的人;editor/editors=editor is a person who checks and corrects writing, not one who turns speech into another language as it is spoken=editor 是审改文字的人，不是把话即时译成另一种语言的人|in · ter · pret · er|interpret + er, with no double letters|interpret + er，没有双写字母
      multilingual|a country with four official languages;hotel staff helping guests in six languages;children switching between languages|multilingual means using several languages; monolingual means using only one|multilingual 是使用多种语言的；monolingual 是只用一种语言的|monolingual=monolingual means using only one language, the opposite of four, six or several languages=monolingual 是只用一种语言的，和四种、六种或多种语言正相反;multiple=multiple means many, but it does not describe a person, a country or staff using languages=multiple 是多个的，但不能形容人、国家或员工会说多种语言|mul · ti · lin · gual|multi + lingual, with -gual said like *gwul*|multi + lingual，-gual 读作 *gwul*
    `,
  },
});

const traditions = vocabularyTopic({
  id: "b2-words-traditions",
  title: t("Traditions", "传统"),
  summary: t(
    "Rituals and folklore; myths and mythology; superstitions and being superstitious; taboos and etiquette; celebrations and commemorating the past; ancestral and sacred places.",
    "仪式和民间传说；神话和神话体系；迷信和迷信的人；禁忌和礼仪；庆祝活动和纪念过去；祖先的和神圣的地方。",
  ),
  intro: t(
    "At New Year our family follows old **rituals**: we sweep the house, visit **ancestral** graves and never say one **taboo** word. These words help you talk about customs, beliefs and the stories that hold a culture together.",
    "过年时我们家遵循古老的 **rituals**（仪式）：打扫屋子、祭扫 **ancestral**（祖先的）坟墓，还绝不说一个 **taboo**（忌讳的）字眼。这些词帮你谈论把一种文化凝聚在一起的习俗、信仰和故事。",
  ),
  prerequisites: ["a2-words-festivals"],
  words: [
    word(
      "ritual rituals",
      "a set of actions that is always done in the same way, often as part of a ceremony",
      "仪式；惯例",
      "Tea is an important {ritual} in Japan. | The wedding includes many old {rituals}, such as the bride and groom drinking from one cup.|myths taboos | My morning {ritual} is coffee and a newspaper.",
      "myth taboo",
      "celebration",
    ),
    word(
      "folklore",
      "the traditional stories and beliefs of a group of people",
      "民间传说；民俗",
      "In Irish {folklore}, fairies live under the hills. | The dragon appears often in Chinese {folklore}. | She collects the songs and {folklore} of her village: old stories of witches, giants and talking animals.",
      "etiquette taboo",
      "mythology",
    ),
    word(
      "myth myths",
      "an ancient story about gods or heroes; a belief that many people have but that is not true",
      "神话；谬论",
      "The Greek {myths} are full of gods and monsters.|taboos rituals | It's a {myth} that goldfish only remember three seconds. | The {myth} explains how the world began.",
      "taboo ritual",
      "mythology",
    ),
    word(
      "mythology",
      "all the myths of a culture",
      "神话（总称）",
      "Thor is a god in Norse {mythology}. | She is studying Greek {mythology}: the stories of Zeus, Athena and the other gods. | Dragons are common in Chinese {mythology}, in stories of gods who rule the rain and the rivers.",
      "etiquette superstition",
      "folklore",
    ),
    word(
      "superstition superstitions",
      "a belief that some objects or actions bring good or bad luck, without a reason",
      "迷信",
      "It's a {superstition} that black cats bring bad luck. | Many hotels have no room 13 because of a {superstition} that the number brings bad luck. | Old {superstitions} about lucky and unlucky numbers still affect what people do.|celebrations taboos",
      "celebration taboo",
      "superstitious",
    ),
    word(
      "superstitious",
      "believing in superstitions",
      "迷信的",
      "Sailors are often {superstitious}: many believe that whistling on a ship brings a storm. | I'm not {superstitious}, but I never walk under ladders. | {Superstitious} people avoid the number four in China.",
      "suspicious sacred",
      "superstition",
    ),
    word(
      "taboo taboos",
      "something people do not do or talk about because it is offensive or embarrassing",
      "禁忌",
      "Death is a {taboo} subject in many families: nobody talks about it. | Eating pork is {taboo} in some religions. | Talking about money is still a {taboo} at work.",
      "ritual myth",
    ),
    word(
      "etiquette",
      "the rules of polite behavior in a society or a group",
      "礼仪；礼节",
      "Business {etiquette}, such as how to bow or shake hands, differs from country to country. | It is bad {etiquette} to arrive late. | Table {etiquette} in Japan has many rules.",
      "folklore mythology",
      "taboo",
    ),
    word(
      "celebration celebrations",
      "a special event to show that an occasion is important",
      "庆祝活动",
      "The {celebrations} lasted all night.|superstitions myths | We had a small {celebration} for her birthday. | New Year {celebrations}, with fireworks and dancing, begin at midnight.|superstitions myths",
      "superstition myth",
      "ritual",
    ),
    word(
      "commemorate commemorates commemorated commemorating",
      "to remember an important person or event with a ceremony or a monument",
      "纪念",
      "The statue {commemorates} the soldiers who died.|worships accommodates | A holiday {commemorates} the end of the war.|worships accommodates | We {commemorated} the 100th anniversary with a concert.|worshiped accommodated",
      "worship accommodate",
      "celebration",
    ),
    word(
      "ancestral",
      "connected with the people in your family who lived long ago",
      "祖先的；祖传的",
      "They returned to their {ancestral} village, where their great-grandparents had been born. | The family still owns the {ancestral} home that has passed from father to son for 300 years. | People visit {ancestral} graves at the Qingming Festival to honor their grandparents and great-grandparents.",
      "superstitious sacred",
    ),
    word(
      "sacred",
      "holy; very important and respected",
      "神圣的",
      "The river is {sacred} to Hindus. | Cows are {sacred} in India. | Family time is {sacred} to her.",
      "superstitious ancestral",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Sacred* and *superstitious* are easy to mix up: *sacred* things are holy and deeply respected, while *superstitious* people believe that some things bring luck. Ask whether the sentence describes something holy or a belief about luck.",
        "*sacred* 和 *superstitious* 很容易混：*sacred* 指神圣、备受敬重的东西，*superstitious* 指相信某些东西会带来运气的人。想想句子说的是神圣之物，还是关于运气的信念。",
      ),
      meaning: t(
        "A *ritual* is a set of actions always done the same way, while a *myth* is a story about gods or a belief that is not true. Check whether the meaning describes something people do or something people tell.",
        "*ritual* 是总按同样方式进行的一套动作，*myth* 是关于神的故事或不真实的说法。看释义说的是人们做的事，还是人们讲的事。",
      ),
      spell: t(
        "*Etiquette* ends in French -quette, *taboo* has a double o, and *superstitious* turns the -tion of *superstition* into -tious.",
        "*etiquette* 结尾是法语式的 -quette，*taboo* 双写 o，*superstitious* 把 *superstition* 的 -tion 变成 -tious。",
      ),
    },
    notes: `
      ritual|tea ceremonies in Japan;old wedding customs like drinking from one cup;coffee and a newspaper every morning|a ritual is a set of actions always done the same way; a myth is a story|ritual 是固定程序的一套动作；myth 是故事|myth/myths=myth is an ancient story or an untrue belief, not something people do the same way each time=myth 是古老的故事或不真实的说法，不是人们每次都照样去做的事;taboo/taboos=taboo is something people must not do, not a set of actions they carry out every time=taboo 是不能做的事，不是每次都要完成的一套动作|rit · u · al|u said like *oo*, and -al at the end|u 读作 *oo*，结尾是 -al
      folklore|fairies living under Irish hills;dragons in Chinese stories;old village stories of witches and giants|folklore is a people's traditional stories; etiquette is the rules of polite behavior|folklore 是民间传说；etiquette 是礼仪规范|etiquette=etiquette is the rules of polite behavior, not traditional stories of fairies, dragons or giants=etiquette 是礼仪规范，不是关于仙子、龙或巨人的传统故事;taboo=taboo is something people must not do or say, not old stories a village tells=taboo 是不能做、不能说的事，不是村里流传的老故事|folk · lore|folk + lore, with a silent l in *folk*|folk + lore，*folk* 里的 l 不发音
      myth|Greek stories full of gods and monsters;the untrue belief about goldfish memory;a story of how the world began|a myth is an ancient story or a false belief; a taboo is something you must not do|myth 是古老的故事或错误的说法；taboo 是禁忌|taboo/taboos=taboo is something people must not do or talk about, not a story or a false belief=taboo 是不能做或不能谈的事，不是故事或错误的说法;ritual/rituals=ritual is a set of actions people do, not a story or a belief=ritual 是人们做的一套动作，不是故事或说法|myth|y said like i, and th at the end|y 读作 i，结尾是 th
      mythology|Thor among the Norse gods;the stories of Zeus, Athena and the other gods;Chinese gods who rule the rain and rivers|mythology is all the myths of a culture; etiquette is its rules of manners|mythology 是一种文化的全部神话；etiquette 是礼仪规范|etiquette=etiquette is the rules of polite behavior, not stories about gods=etiquette 是礼仪规范，不是关于神的故事;superstition=superstition is a belief about luck, not a culture's stories of gods and heroes=superstition 是关于运气的迷信，不是一种文化中关于神和英雄的故事|my · thol · o · gy|myth + ology, with y said like i|myth + ology，y 读作 i
      superstition|the belief that black cats bring bad luck;hotels with no room 13;old beliefs about lucky numbers|a superstition is a belief in luck without a reason; a celebration is a happy event|superstition 是没有根据的运气信念；celebration 是庆祝活动|celebration/celebrations=celebration is a happy event for an occasion, not a belief about good or bad luck=celebration 是为某个场合举办的欢乐活动，不是关于好运厄运的信念;taboo/taboos=taboo is something people must not do or talk about, not a belief that a number or an animal brings luck=taboo 是不能做或不能谈的事，不是认为某个数字或动物会带来运气的信念|su · per · sti · tion|super + stition, with -tion said like *shun*|super + stition，-tion 读作 *shun*
      superstitious|sailors believing whistling brings a storm;someone who never walks under ladders;people avoiding the number four|superstitious means believing in luck; suspicious means not trusting someone|superstitious 是迷信的；suspicious 是起疑心的|suspicious=suspicious means feeling that someone may be doing something wrong, not believing in lucky or unlucky signs=suspicious 是怀疑别人做了坏事，不是相信吉凶兆头;sacred=sacred means holy and respected, a word for places and things, not for people who fear bad luck=sacred 是神圣的，用来说地方和事物，不用来说怕倒霉的人|su · per · sti · tious|superstition with -tion changed to -tious|把 superstition 的 -tion 改成 -tious
      taboo|death as a subject nobody talks about;pork forbidden in some religions;money as a subject avoided at work|a taboo is something people must not do or talk about; a ritual is something they always do|taboo 是不能做或不能谈的事；ritual 是总要做的仪式|ritual=ritual is a set of actions people always do, the opposite of something they must not do or talk about=ritual 是人们总要做的一套动作，和不能做、不能谈正相反;myth=myth is a story or a false belief, not something forbidden=myth 是故事或错误说法，不是被禁止的事|ta · boo|the double o at the end|结尾双写 o
      etiquette|how to bow or shake hands in business;arriving late as bad manners;the many rules of eating in Japan|etiquette is the rules of polite behavior; folklore is traditional stories|etiquette 是礼仪规范；folklore 是民间传说|folklore=folklore is traditional stories and beliefs, not rules about bowing, arriving on time or eating=folklore 是传统故事和信仰，不是关于鞠躬、守时或用餐的规矩;mythology=mythology is stories of gods, not rules of good manners=mythology 是关于神的故事，不是礼貌规矩|et · i · quette|-quette at the end, said like *ket*|结尾是 -quette，读作 *ket*
      celebration|a party that lasted all night;a small party for a birthday;New Year fireworks and dancing|a celebration is a happy event; a superstition is a belief about luck|celebration 是欢乐的庆祝活动；superstition 是关于运气的迷信|superstition/superstitions=superstition is a belief about luck, not a party that lasts all night or has fireworks=superstition 是关于运气的迷信，不是通宵的聚会，也没有烟花;myth/myths=myth is a story or a false belief, not an event people hold for a birthday or New Year=myth 是故事或错误说法，不是为生日或新年举办的活动|cel · e · bra · tion|celebrate + ion, with -tion said like *shun*|celebrate + ion，-tion 读作 *shun*
      commemorate|a statue for soldiers who died;a holiday for the end of a war;a concert for a 100th anniversary|to commemorate is to remember an event or a person in a special way; to worship is to pray to a god|commemorate 是纪念；worship 是崇拜神明|worship/worships/worshiped=worship means to pray to and praise a god, not to remember soldiers, a war's end or an anniversary=worship 是向神祈祷、赞美，不是纪念士兵、战争结束或周年;accommodate/accommodates/accommodated=accommodate means to give someone a place to stay or to make room for them, not to remember an event=accommodate 是提供住处或容纳，不是纪念某件事|com · mem · o · rate|a double m, then a single m|先双写 m，后面只有一个 m
      ancestral|a village where great-grandparents were born;a home passed from father to son for 300 years;graves of grandparents and great-grandparents|ancestral means of your family long ago; sacred means holy|ancestral 是祖先的；sacred 是神圣的|superstitious=superstitious describes people who believe in luck, not a village, a home or graves of your family=superstitious 形容相信运气的人，不形容家族的村庄、房子或坟墓;sacred=sacred means holy to a religion, not belonging to your great-grandparents=sacred 是对宗教而言神圣的，不是属于曾祖辈的|an · ces · tral|ancestor with -or dropped and -al added|ancestor 去掉 -or，加上 -al
      sacred|a river holy to Hindus;cows respected in India;family time that matters deeply to someone|sacred means holy and deeply respected; superstitious means believing in luck|sacred 是神圣的；superstitious 是迷信的|superstitious=superstitious describes a person who believes in luck, not a river, an animal or time that is holy=superstitious 形容迷信的人，不形容神圣的河流、动物或时光;ancestral=ancestral means of your family long ago, not holy or deeply respected=ancestral 是祖先的，不是神圣、备受敬重的|sa · cred|a said like *ay*, and -cred, not *scared*|a 读作 *ay*，后面是 -cred，别写成 *scared*
    `,
  },
});

const heritage = vocabularyTopic({
  id: "b2-words-heritage",
  title: t("Heritage", "文化遗产"),
  summary: t(
    "Preserving the past and preservation; artifacts, archives and curators; restoration; authentic objects and replicas; craftsmen and craftsmanship; exhibiting a collection.",
    "保护过去和保护工作；文物、档案和策展人；修复；真品和复制品；工匠和手艺；展出藏品。",
  ),
  intro: t(
    "In the museum a **curator** shows us real Roman **artifacts** and a full-size **replica** of a ship. These words help you talk about how we keep and show the objects and buildings of the past.",
    "在博物馆里，一位 **curator**（策展人）给我们看真正的古罗马 **artifacts**（文物）和一艘船的等大 **replica**（复制品）。这些词帮你谈论我们如何保存、展示过去的物品和建筑。",
  ),
  prerequisites: ["b2-words-history"],
  words: [
    word(
      "preserve preserves preserved preserving",
      "to keep something in its original state; to stop food from going bad",
      "保护；保存",
      "We must {preserve} the old town so that it stays exactly as it was for future generations. | The body was {preserved} in the ice for 5,000 years without decaying.|demolished exhibited | Salt is used to {preserve} fish so that it does not go bad.",
      "demolish exhibit",
      "preservation",
    ),
    word(
      "preservation",
      "the act of keeping something in its original state",
      "（对文物、自然的）保护；保存",
      "The {preservation} of old buildings, keeping them safe from damage and decay, is expensive. | The paintings are in a good state of {preservation}. | She works for a wildlife {preservation} group that protects rare birds.",
      "presentation reservation",
      "restoration",
    ),
    word(
      "artifact artifacts",
      "an object made by people long ago, especially one of historical interest",
      "（古）文物；人工制品",
      "The museum holds {artifacts} made by people in ancient Egypt, such as pots and jewelry.|artists fossils | Each {artifact} has a label explaining who made it and when. | The divers found Roman {artifacts}, such as coins and pottery, on the seabed.|artists fossils",
      "artist fossil",
      "replica",
    ),
    word(
      "archive archives",
      "a collection of historical records; the place where they are kept",
      "档案；档案馆",
      "The old letters and records are kept in the national {archives}.|arcades replicas | She spent months reading old documents in the city {archive}. | The newspaper's online {archive} of past issues goes back to 1851.",
      "arcade replica",
      "collection",
    ),
    word(
      "curator curators",
      "a person in charge of a museum's collection or an exhibition",
      "（博物馆）馆长；策展人",
      "The {curator} chose the paintings for the exhibition from the museum's own collection. | {Curators} must decide which objects to show in the museum and which to store.|Conductors Visitors | She is the chief {curator} of the National Gallery, in charge of all its paintings.",
      "conductor visitor",
      "craftsman",
    ),
    word(
      "restoration",
      "the work of repairing an old building or object so that it looks as it did",
      "修复；恢复",
      "The {restoration} of the cathedral took twenty years, and now it looks as it did in 1400. | The palace is closed for {restoration}: workers are repairing its roof and painting its walls. | The painting needs careful {restoration} to repair the damage from the fire.",
      "registration destruction",
      "preservation",
    ),
    word(
      "authentic",
      "real, not a copy; true to the original",
      "真正的；正宗的",
      "Experts say the painting is {authentic}: it really was painted by Rembrandt. | The restaurant serves {authentic} Italian food, cooked just the way it is in Italy. | Is this an {authentic} Roman coin, or a modern copy?",
      "artificial athletic",
    ),
    word(
      "replica replicas",
      "an exact copy of something",
      "复制品",
      "This is a {replica}, made last year: the original statue is in Rome. | The shop sells cheap modern {replicas} of famous paintings.|relics replays | They built a full-size {replica} of the ship.",
      "relic replay",
      "artifact",
    ),
    word(
      "craftsman craftsmen",
      "a person who makes things skillfully with their hands",
      "工匠；手艺人",
      "The table was made by hand by a local {craftsman}. | Skilled {craftsmen} repaired the old wooden roof by hand.|draftsmen salesmen | He is a master {craftsman} who carves furniture from oak.",
      "draftsman salesman",
      "curator",
    ),
    word(
      "craftsmanship",
      "the skill with which something is made",
      "手艺；技艺",
      "The {craftsmanship} of the old furniture is excellent: every joint fits perfectly. | You can see the {craftsmanship} in every carved detail. | Cheap modern furniture often lacks {craftsmanship} and falls apart quickly.",
      "championship craftiness",
    ),
    word(
      "exhibit exhibits exhibited exhibiting",
      "to show objects in public, for example in a museum; an object shown",
      "展出；展品",
      "The gallery {exhibits} young artists' work in its main hall for visitors to see.|inhibits prohibits | Her photos were {exhibited} in Paris, and thousands came to see them.|inhibited prohibited | Do not touch the {exhibits}: they are very old and fragile.|exhibitions inhibitions",
      "inhibit prohibit",
      "collection",
    ),
    word(
      "collection collections",
      "a group of objects of the same kind brought together",
      "收藏品；收集",
      "The museum has a fine {collection} of Chinese pottery, gathered over a hundred years. | He has a huge stamp {collection}: more than 5,000 stamps in forty albums. | The library's {collections} of old books and maps are open to the public.|corrections connections",
      "correction connection",
      "archive",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Artifact* and *replica* are both objects in a museum, but an *artifact* is the real old thing and a *replica* is a new copy of it. Look for words like *original*, *copy* or *built* that tell you which one the sentence means.",
        "*artifact* 和 *replica* 都是博物馆里的物品，但 *artifact* 是真正的古物，*replica* 是它的新复制品。找找 *original*、*copy*、*built* 这类词，判断句子说的是哪一个。",
      ),
      meaning: t(
        "*Preservation* keeps something as it is now, while *restoration* repairs something damaged so it looks as it once did. Check whether the meaning talks about keeping or about repairing.",
        "*preservation* 是让东西保持现状，*restoration* 是把损坏的东西修好、恢复原貌。看释义说的是保持还是修复。",
      ),
      spell: t(
        "*Craftsman* becomes *craftsmen* in the plural, *curator* ends in -or, and *artifact* is art + i + fact.",
        "*craftsman* 的复数是 *craftsmen*，*curator* 以 -or 结尾，*artifact* 是 art + i + fact。",
      ),
    },
    notes: `
      preserve|an old town kept exactly as it was;a body kept in the ice without decaying;fish kept from going bad with salt|to preserve is to keep something as it is; to demolish is to knock it down|preserve 是保持原样；demolish 是拆毁|demolish/demolished=demolish means to knock a building down, the opposite of keeping a town, a body or fish unchanged=demolish 是拆毁建筑，和让城镇、遗体或鱼保持原样正相反;exhibit/exhibited=exhibit means to show objects to the public, not to keep a town, a body or fish from changing or going bad=exhibit 是向公众展出，不是让城镇、遗体或鱼不变、不坏|pre · serve|pre + serve, with s said like z|pre + serve，s 读作 z
      preservation|old buildings kept safe from decay;paintings in a good state;a wildlife group that protects rare birds|preservation is keeping things safe as they are; presentation is a talk to an audience|preservation 是保护、保存；presentation 是演示、陈述|presentation=presentation is a talk that shows information to an audience, not keeping buildings, paintings or wildlife safe=presentation 是向听众展示信息的讲解，不是保护建筑、画作或野生动物;reservation=reservation is a booking of a table, a room or a seat, not keeping buildings, paintings or wildlife safe=reservation 是预订桌位、房间或座位，不是保护建筑、画作或野生动物|pres · er · va · tion|preserve with the final e dropped before -ation|preserve 去掉末尾 e 再加 -ation
      artifact|pots and jewelry made in ancient Egypt;a label saying who made it and when;Roman coins and pottery on the seabed|an artifact is an object made by people long ago; a fossil is the remains of an old animal or plant|artifact 是古人制作的器物；fossil 是化石|artist/artists=artist is a person who makes art, not an object that someone made long ago=artist 是创作艺术的人，不是古人做的器物;fossil/fossils=fossil is the remains of an animal or plant in rock, not an object made by people=fossil 是岩石中动植物的遗骸，不是人做的东西|ar · ti · fact|art + i + fact|art + i + fact
      archive|letters and records kept by the nation;old documents read for months;past issues of a newspaper online|an archive is a collection of records; a replica is a copy of an object|archive 是档案；replica 是复制品|arcade/arcades=arcade is a covered street of shops or a room of video games, not a place where records are kept=arcade 是有顶的商店街或游戏厅，不是存放档案的地方;replica/replicas=replica is an exact copy of one object, not a collection of letters, documents or newspapers=replica 是某件物品的精确复制品，不是一批信件、文件或报纸|ar · chive|ch said like k, and -ive at the end|ch 读作 k，结尾是 -ive
      curator|paintings chosen from the museum's own collection;decisions on which objects to show and which to store;the person in charge of a gallery's paintings|a curator runs a museum's collection; a visitor comes to look at it|curator 负责博物馆藏品；visitor 是来参观的人|conductor/conductors/Conductors=conductor leads an orchestra or checks tickets, not a museum's collection=conductor 指挥乐队或查票，不管理博物馆藏品;visitor/visitors/Visitors=visitor comes to look at a museum, not someone who chooses and looks after its objects=visitor 是来参观的人，不负责挑选和照管藏品|cu · ra · tor|cure with -e dropped, then -ator|cure 去掉 e，再加 -ator
      restoration|a cathedral that looks as it did in 1400;a palace roof and walls being repaired;a painting repaired after a fire|restoration repairs something so it looks as it once did; destruction ruins it|restoration 是修复；destruction 是毁坏|registration=registration is putting a name on an official list, not repairing a building or a painting=registration 是登记注册，不是修复建筑或画作;destruction=destruction is ruining something, the opposite of repairing it=destruction 是毁坏，和修复正相反|res · to · ra · tion|restore with the e dropped before -ation|restore 去掉 e 再加 -ation
      authentic|a painting really painted by Rembrandt;Italian food cooked the way it is in Italy;a Roman coin rather than a modern copy|authentic means real and original; artificial means made to copy something natural|authentic 是真正的、正宗的；artificial 是人造的|artificial=artificial means made by people to look like something natural, not the true original=artificial 是人造仿制的，不是真品原物;athletic=athletic means strong and good at sport, a word for people, not for paintings, food or coins=athletic 是健壮、擅长运动的，形容人，不形容画、食物或钱币|au · then · tic|au said like *aw*, then th|au 读作 *aw*，后面是 th
      replica|a statue copy made last year;cheap modern copies of famous paintings;a full-size ship that they built|a replica is a new copy; a relic is a real object that survived from the past|replica 是新的复制品；relic 是留存下来的真古物|relic/relics=relic is a real object that survived from long ago, not a new copy made last year or built by people now=relic 是从古代留存下来的真东西，不是去年做或现在造的复制品;replay/replays=replay is a game or a video shown again, not an object copied from another=replay 是重赛或重放，不是仿造的物品|rep · li · ca|rep + li + ca, ending in a|rep + li + ca，以 a 结尾
      craftsman|a table made by hand;an old wooden roof repaired by hand;furniture carved from oak|a craftsman makes things by hand; a draftsman draws plans|craftsman 是手艺人；draftsman 是绘图员|draftsman/draftsmen=draftsman draws plans and technical drawings, not someone who makes things with their hands=draftsman 是画图纸的人，不是动手制作东西的人;salesman/salesmen=salesman sells things, he does not make them by hand=salesman 是卖东西的人，不亲手制作|crafts · man|craft + s + man, and craftsmen in the plural|craft + s + man，复数是 craftsmen
      craftsmanship|joints in old furniture that fit perfectly;every carved detail;cheap modern furniture that falls apart|craftsmanship is skill in making things; craftiness is skill in tricking people|craftsmanship 是手艺；craftiness 是狡猾|championship=championship is a sports competition, not skill in making furniture=championship 是锦标赛，不是做家具的技艺;craftiness=craftiness is cleverness in tricking people, not skill in making things well=craftiness 是骗人的狡猾，不是把东西做好的技艺|crafts · man · ship|craftsman + ship|craftsman + ship
      exhibit|young artists' work in the main hall for visitors;photos in Paris that thousands came to see;old and fragile objects not to be touched|to exhibit is to show objects in public; to prohibit is to forbid something|exhibit 是展出；prohibit 是禁止|inhibit/inhibits/inhibited=inhibit means to stop something from happening, not to show work to visitors=inhibit 是抑制，不是向观众展出作品;prohibit/prohibits/prohibited=prohibit means to forbid something, the opposite of showing it to people=prohibit 是禁止，和给人展示正相反;exhibitions=exhibition is a whole show, not one object you could touch=exhibition 是整场展览，不是可以触摸的单件展品;inhibitions=inhibitions are feelings that stop you acting freely, not objects in a museum=inhibitions 是让人放不开的心理顾虑，不是博物馆里的物品|ex · hib · it|a silent h after ex-|ex 后面有个不发音的 h
      collection|Chinese pottery gathered over a hundred years;5,000 stamps in forty albums;old books and maps open to the public|a collection is a group of objects kept together; a connection is a link between things|collection 是收藏品；connection 是联系|correction/corrections=correction is a change that fixes a mistake, not a group of objects kept together=correction 是改正错误，不是收在一起的一批物品;connection/connections=connection is a link between things, not a group of pottery, stamps or books=connection 是事物之间的联系，不是一批陶器、邮票或书|col · lec · tion|a double l, then -tion|双写 l，结尾是 -tion
    `,
  },
});

const belief = vocabularyTopic({
  id: "b2-words-belief",
  title: t("Belief", "信仰"),
  summary: t(
    "Faith; spiritual and religious life; ideologies and convictions; worshiping and praying; prayers; atheists and secular states; tolerant and devout people.",
    "信仰；精神的和宗教的生活；意识形态和信念；礼拜和祈祷；祷告；无神论者和世俗国家；宽容的和虔诚的人。",
  ),
  intro: t(
    "My grandmother is a **devout** Buddhist who **prays** every morning, while my uncle is an **atheist** who loves **secular** music. These words help you talk about religion, beliefs and how people respect each other's faith.",
    "我奶奶是 **devout**（虔诚的）佛教徒，每天早上 **prays**（祈祷），而我叔叔是 **atheist**（无神论者），喜欢 **secular**（世俗的）音乐。这些词帮你谈论宗教、信仰，以及人们如何尊重彼此的信仰。",
  ),
  prerequisites: ["b1-words-culture"],
  words: [
    word(
      "faith",
      "strong belief in God or a religion; trust in someone or something",
      "信仰；信任",
      "Her {faith} in God helped her through the illness. | People of every {faith} are welcome here: Christians, Muslims, Buddhists and others. | I have {faith} in your ability, so I know you will succeed.",
      "fate fame",
      "conviction",
    ),
    word(
      "spiritual",
      "connected with the human spirit rather than the body; connected with religion",
      "精神的；心灵的",
      "Yoga has a {spiritual} side as well as a physical one. | Many people visit the temple for {spiritual} reasons, to pray and find peace. | He is a {spiritual} person who meditates every day, though he doesn't go to church.",
      "spirited physical",
      "religious",
    ),
    word(
      "religious",
      "connected with religion; believing strongly in a religion",
      "宗教的；虔诚的",
      "Christmas is a {religious} holiday that celebrates the birth of Jesus. | My parents are very {religious}: they go to church every Sunday. | The country has freedom of {religious} belief, so people may follow any god.",
      "secular rebellious",
      "devout",
    ),
    word(
      "ideology ideologies",
      "a set of political or other ideas that a group believes in",
      "意识形态；思想体系",
      "The political party has no clear {ideology}, only a list of promises. | Communism and capitalism are opposing political {ideologies}.|geologies theologies | People were punished for their political {ideology} under the old government.",
      "geology theology",
      "conviction",
    ),
    word(
      "conviction convictions",
      "a strong belief or opinion; a decision in court that someone is guilty",
      "坚定的信念；定罪",
      "She spoke with great {conviction}, sure that she was right. | He has strong political {convictions} that he will never give up.|convections connections | It is my firm {conviction} that education should be free.",
      "convection connection",
      "faith",
    ),
    word(
      "worship worships worshiped worshiping",
      "to show respect and love for a god, for example by praying; to love someone very much",
      "崇拜；做礼拜",
      "The ancient Egyptians {worshiped} many gods and built great temples to them.|worsened ignored | People come here to {worship} God every Friday, praying together in the mosque. | He {worships} his older brother and copies everything he does.|worsens ignores",
      "worsen ignore",
      "pray",
    ),
    word(
      "pray prays prayed praying",
      "to speak to God; to hope very much for something",
      "祈祷；祈求",
      "She {prays} every morning, asking God to protect her family.|sprays plays | We {prayed} to the gods for rain after months without it.|sprayed played | I knelt down, closed my eyes and {prayed} for my sick grandmother.|sprayed played",
      "spray play",
      "worship",
    ),
    word(
      "prayer prayers",
      "words that you say to God; the act of praying",
      "祷告；祈祷",
      "They said a {prayer} to thank God before dinner. | The church holds evening {prayers} where people speak to God together.|players payers | Our {prayers} to God were answered: he survived.|players payers",
      "player payer",
      "faith",
    ),
    word(
      "atheist atheists",
      "a person who believes that there is no God",
      "无神论者",
      "In a religious family, he is the only {atheist}: he says there is no God. | {Atheists} do not believe in God or in any gods.|Believers Athletes | Many students lose their faith at university and become {atheists}.|believers athletes",
      "believer athlete",
    ),
    word(
      "secular",
      "not connected with religion",
      "世俗的；非宗教的",
      "France is a {secular} state: the government has no official religion. | The school is {secular}: there are no religious lessons. | {Secular} music, such as love songs and dances, became popular in the Middle Ages.|Religious Circular",
      "religious circular",
      "religious",
    ),
    word(
      "tolerant",
      "willing to accept beliefs and behavior different from your own",
      "宽容的",
      "The city is known for being {tolerant} of different religions: all are welcome. | We should be more {tolerant} of opinions we disagree with and let others speak freely. | A truly {tolerant} society accepts people of all faiths.",
      "intolerant suspicious",
    ),
    word(
      "devout",
      "believing strongly in a religion and following its rules",
      "虔诚的",
      "She is a {devout} Muslim who prays five times a day. | His {devout} parents took him to church every Sunday without fail. | The town's people are {devout} Catholics who never miss Mass.",
      "secular devious",
      "religious",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Secular* and *religious* are opposites: *secular* things have nothing to do with religion, while *religious* things are part of a faith. Ask whether the sentence brings God, church or prayer in or leaves them out.",
        "*secular* 和 *religious* 意思相反：*secular* 与宗教无关，*religious* 属于某种信仰。想想句子是把上帝、教堂、祈祷带进来，还是排除在外。",
      ),
      meaning: t(
        "*Faith* is belief in God or trust in someone, while *conviction* is a firm opinion you are sure of and can also mean being found guilty in court. Check which of these the meaning describes.",
        "*faith* 是对神的信仰或对人的信任，*conviction* 是你确信的坚定看法，也可指法庭定罪。看释义说的是哪一种。",
      ),
      spell: t(
        "*Worship* keeps one p in *worshiped*, *atheist* is a + the + ist, and *devout* ends in -out, not like *devote*.",
        "*worship* 在 *worshiped* 里只有一个 p，*atheist* 是 a + the + ist，*devout* 以 -out 结尾，别和 *devote* 混。",
      ),
    },
    notes: `
      faith|belief in God through an illness;people of every religion;trust in someone's ability|faith is belief or trust; fate is what will happen to you|faith 是信仰、信任；fate 是命运|fate=fate is what is going to happen to someone, not belief in God or trust in a person=fate 是一个人将来的遭遇，不是对神的信仰或对人的信任;fame=fame is being known by many people, not belief in God or trust in a person=fame 是出名，不是对神的信仰或对人的信任|faith|ai said like *ay*, and th at the end|ai 读作 *ay*，结尾是 th
      spiritual|yoga's side beyond the physical one;temple visits to pray and find peace;a man who meditates but skips church|spiritual is about the soul; physical is about the body|spiritual 关乎心灵；physical 关乎身体|spirited=spirited means full of energy and courage, not connected with the soul or with prayer=spirited 是精力充沛、勇敢的，与心灵或祈祷无关;physical=physical is about the body, the opposite of the soul and the spirit=physical 关乎身体，和心灵、精神正相反|spir · i · tu · al|spirit + ual|spirit + ual
      religious|a holiday for the birth of Jesus;parents who go to church every Sunday;freedom to follow any god|religious is part of a faith; secular has nothing to do with religion|religious 属于宗教；secular 与宗教无关|secular=secular means not connected with religion, the opposite of a church holiday, churchgoing parents or belief in a god=secular 是与宗教无关的，和宗教节日、常去教堂的父母或信神正相反;rebellious=rebellious means refusing to obey rules or people in power, not connected with God or church=rebellious 是叛逆的，与上帝或教会无关|re · li · gious|-gious at the end, said like *jus*|结尾是 -gious，读作 *jus*
      ideology|a party with only a list of promises;communism and capitalism;political ideas punished by a government|an ideology is a set of political ideas; theology is the study of God|ideology 是思想体系；theology 是神学|geology/geologies=geology is the study of rocks, not a set of political ideas=geology 是地质学，不是一套政治思想;theology/theologies=theology is the study of God and religion, not political ideas such as communism=theology 是研究神和宗教的学问，不是共产主义之类的政治思想|i · de · ol · o · gy|idea with the a dropped, then -ology|idea 去掉 a，再加 -ology
      conviction|speaking sure of being right;political beliefs never given up;a firm belief that education should be free|a conviction is a firm belief; a connection is a link|conviction 是坚定的信念；connection 是联系|convection/convections=convection is heat moving through air or water, not a firm belief=convection 是热在空气或水中的对流，不是坚定的信念;connection/connections=connection is a link between things, not a belief you are sure of=connection 是事物间的联系，不是你确信的看法|con · vic · tion|convict + ion|convict + ion
      worship|great temples built to many gods;praying together in the mosque;copying everything an older brother does|to worship is to love and respect a god or a person deeply; to ignore is to pay no attention|worship 是崇拜；ignore 是不理会|worsen/worsened/worsens=worsen means to make or become worse, not to show love and respect for a god or a person=worsen 是使变坏，不是对神或人表示敬爱;ignore/ignored/ignores=ignore means to pay no attention, the opposite of building temples, praying together or copying someone you admire=ignore 是不理会，和建庙、一起祈祷、模仿崇拜的人正相反|wor · ship|wor + ship, with worshiped keeping one p|wor + ship，worshiped 只有一个 p
      pray|asking God every morning to protect a family;asking the gods for rain;kneeling with closed eyes for a sick grandmother|to pray is to speak to God; to play is to have fun|pray 是祈祷；play 是玩|spray/sprays/sprayed=spray means to cover something with tiny drops of liquid, not to speak to God or the gods=spray 是喷洒，不是向神说话;play/plays/played=play means to have fun or make music, not to speak to God or the gods=play 是玩耍或演奏，不是向神说话|pray|pr + ay, not *prey*|pr + ay，别写成 *prey*
      prayer|words thanking God before dinner;evening services where people speak to God;requests to God that were answered|a prayer is words said to God; a player takes part in a game|prayer 是祷告；player 是选手|player/players=player is someone who takes part in a game or plays music, not words said to God=player 是比赛选手或演奏者，不是对神说的话;payer/payers=payer is a person who pays money, not words said to God=payer 是付款人，不是对神说的话|pray · er|pray + er|pray + er
      atheist|the only one in a religious family who says there is no God;people who believe in no gods;students who lose their faith|an atheist believes there is no God; a believer has faith in God|atheist 是无神论者；believer 是信徒|believer/believers/Believers=believer has faith in God, the opposite of someone who says there is no God or has lost their faith=believer 信神，和说没有神或失去信仰的人正相反;athlete/athletes/Athletes=athlete is a person who is good at sport, not a word about whether someone believes in God=athlete 是运动员，与是否信神无关|a · the · ist|a + the + ist|a + the + ist
      secular|a state with no official religion;a school with no religious lessons;medieval love songs and dances|secular has nothing to do with religion; religious is part of a faith|secular 与宗教无关；religious 属于宗教|religious/Religious=religious means part of a faith, the opposite of a state, a school or love songs with no religion=religious 属于宗教，和没有宗教的国家、学校或情歌正相反;circular/Circular=circular means round like a circle, not about religion=circular 是圆形的，与宗教无关|sec · u · lar|-ar at the end, not -er|结尾是 -ar，不是 -er
      tolerant|a city where all religions are welcome;letting others speak freely;a society that accepts all faiths|tolerant means accepting differences; intolerant means refusing to accept them|tolerant 是宽容的；intolerant 是不容异己的|intolerant=intolerant means unwilling to accept different beliefs, the opposite of welcoming and accepting others=intolerant 是不容异己的，和欢迎、接纳他人正相反;suspicious=suspicious means not trusting others, not welcoming or accepting them=suspicious 是猜疑的，不是欢迎或接纳他人|tol · er · ant|tolerate with -ate changed to -ant|把 tolerate 的 -ate 换成 -ant
      devout|a Muslim who prays five times a day;parents who went to church every Sunday;Catholics who never miss Mass|devout means following a religion strictly; secular means not religious|devout 是虔诚的；secular 是世俗的|secular=secular means not connected with religion, the opposite of praying five times a day or never missing church=secular 与宗教无关，和每天礼拜五次或从不缺席弥撒正相反;devious=devious means dishonest and tricky, not about how strongly someone follows a religion=devious 是狡诈的，与信仰虔诚与否无关|de · vout|de + vout, ending in -out|de + vout，以 -out 结尾
    `,
  },
});

const stereotypes = vocabularyTopic({
  id: "b2-words-stereotypes",
  title: t("Stereotypes", "刻板印象"),
  summary: t(
    "Stereotypes and stereotypical views; prejudiced and narrow-minded people; open-minded ones; ignorance and ignorant remarks; misunderstandings and misconceptions; judgmental attitudes; empathy and empathizing.",
    "刻板印象和刻板的看法；有偏见的和心胸狭隘的人；思想开明的人；无知和无知的言论；误会和误解；爱评判的态度；同理心和感同身受。",
  ),
  intro: t(
    "When Lin moved abroad, a **prejudiced** neighbor believed every **stereotype** about her country, but an **open-minded** classmate asked questions and showed real **empathy**. These words help you talk about unfair ideas about groups of people and how to see past them.",
    "林搬到国外时，一个 **prejudiced**（有偏见的）邻居相信关于她国家的每一个 **stereotype**（刻板印象），而一位 **open-minded**（思想开明的）同学却会提问，并表现出真正的 **empathy**（同理心）。这些词帮你谈论对人群的不公看法，以及如何超越它们。",
  ),
  prerequisites: ["b1-words-getting-on"],
  words: [
    word(
      "stereotype stereotypes",
      "a fixed idea about what a type of person is like, which is often not true",
      "刻板印象；成见",
      "The {stereotype} that all British people only drink tea is unfair to millions of them. | The film is full of national {stereotypes}: lazy Spaniards and rude French waiters.|stereos telescopes | She doesn't fit the {stereotype} of a scientist as an old man in a white coat.",
      "stereo telescope",
      "misconception",
    ),
    word(
      "stereotypical",
      "fitting a fixed idea of what a type of person or thing is like",
      "刻板的；模式化的",
      "The film shows yet another {stereotypical} Italian family, loud and loving, just like in every other film. | His views on women are very {stereotypical}: he thinks they all love shopping. | The characters are {stereotypical} and dull: we've seen them in a hundred films.",
      "unusual stereophonic",
      "prejudiced",
    ),
    word(
      "prejudiced",
      "having an unfair opinion of a group, not based on reason or experience",
      "有偏见的",
      "He is {prejudiced}: he thinks all people from the city are rude, though he has never met one. | Some employers are {prejudiced} and refuse to hire anyone over fifty, however good they are. | A judge who is {prejudiced} has made up her mind before hearing the facts and cannot be fair.",
      "open-minded experienced",
      "narrow-minded",
    ),
    word(
      "narrow-minded",
      "not willing to accept ideas or ways of life different from your own",
      "心胸狭隘的",
      "His {narrow-minded} views on foreigners shocked his colleagues from abroad. | Don't be so {narrow-minded}! Try listening to music from other countries. | Village life can be {narrow-minded}: anyone who is different is laughed at.",
      "open-minded absent-minded",
      "prejudiced",
    ),
    word(
      "open-minded",
      "willing to consider new ideas and opinions",
      "思想开明的",
      "Travel has made her more {open-minded}: she enjoys ideas that are new to her. | Try to be {open-minded} about the new plan and listen before you decide. | We need {open-minded} people for the job who welcome new ideas.",
      "narrow-minded absent-minded",
      "empathy",
    ),
    word(
      "ignorance",
      "lack of knowledge or information",
      "无知；不了解",
      "Racism often comes from {ignorance}: people fear what they know nothing about. | Forgive my {ignorance}, but where is Bhutan? I've never heard of it. | {Ignorance} of the law is no excuse: you should know the rules.|Arrogance Elegance",
      "arrogance elegance",
      "ignorant",
    ),
    word(
      "ignorant",
      "not knowing about things you should know about",
      "无知的；不了解的",
      "I'm quite {ignorant} about modern art: I couldn't name a single painter. | It was an {ignorant} remark from someone who had never visited Africa. | Many workers are {ignorant} about their rights and don't know they can get help.",
      "arrogant informed",
      "ignorance",
    ),
    word(
      "misunderstanding misunderstandings",
      "a failure to understand something correctly, often causing a disagreement",
      "误会；误解",
      "There must be some {misunderstanding}: I said fish, not chicken, but the waiter heard wrong. | The argument started with a small {misunderstanding} about what she had meant. | Cultural {misunderstandings} are common when you move abroad and don't know the customs.|understandings misprints",
      "understanding misprint",
      "misconception",
    ),
    word(
      "misconception misconceptions",
      "a wrong idea that many people believe",
      "错误观念；误解",
      "It is a common {misconception} that bats are blind: in fact, they can see. | The article corrects some {misconceptions} that many people believe about the disease.|facts misfortunes | There are many {misconceptions} about life in China that are simply not true.|facts misfortunes",
      "fact misfortune",
      "stereotype",
    ),
    word(
      "judgmental",
      "too quick to criticize other people",
      "爱评判的；武断的",
      "Try not to be {judgmental} about other people's choices: they have their reasons. | My aunt is very {judgmental} and criticizes everyone's clothes. | Teenagers need adults who listen calmly instead of criticizing, and who are not {judgmental}.",
      "supportive sentimental",
      "prejudiced",
    ),
    word(
      "empathy",
      "the ability to understand and share another person's feelings",
      "同理心；共情",
      "Good doctors show {empathy} towards their patients, imagining how they feel. | Reading novels can build {empathy} by letting you see the world through other people's eyes. | She felt deep {empathy} for the refugees, as if their pain were her own.",
      "apathy antipathy",
      "empathize",
    ),
    word(
      "empathize empathizes empathized empathizing",
      "to understand and share another person's feelings",
      "感同身受；产生共鸣",
      "I can {empathize} with your situation because I lost my job too. | Teachers need to {empathize} with their pupils and understand how they feel. | She {empathizes} with people who feel lonely, because she was lonely once.|disagrees interferes",
      "disagree interfere",
      "empathy",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Prejudiced*, *narrow-minded* and *judgmental* are all unkind, but *prejudiced* is an unfair opinion of a whole group, *narrow-minded* is refusing new ideas, and *judgmental* is criticizing people too quickly. Ask whether the sentence is about a group, about new ideas or about criticizing.",
        "*prejudiced*、*narrow-minded* 和 *judgmental* 都不友善，但 *prejudiced* 是对整个群体的不公看法，*narrow-minded* 是拒绝新想法，*judgmental* 是太快批评别人。想想句子说的是一个群体、新想法，还是批评。",
      ),
      meaning: t(
        "A *misunderstanding* is one moment when people get each other wrong, while a *misconception* is a wrong idea that many people believe. Check whether the meaning is about one event or about a common belief.",
        "*misunderstanding* 是人们一时互相理解错了，*misconception* 是很多人都相信的错误观念。看释义说的是一件事，还是一种普遍的看法。",
      ),
      spell: t(
        "*Judgmental* has no e after the g, *empathize* ends in -ize, and *ignorance* ends in -ance.",
        "*judgmental* 的 g 后面没有 e，*empathize* 以 -ize 结尾，*ignorance* 以 -ance 结尾。",
      ),
    },
    notes: `
      stereotype|the unfair idea that British people only drink tea;lazy Spaniards and rude French waiters;a scientist as an old man in a white coat|a stereotype is a fixed, often untrue idea about a group; a stereo plays music|stereotype 是刻板印象；stereo 是音响|stereo/stereos=stereo is a machine that plays music, not a fixed idea about a type of person=stereo 是播放音乐的音响，不是对某类人的固定看法;telescope/telescopes=telescope is an instrument for seeing things far away, not an idea about a group of people=telescope 是望远镜，不是对一群人的看法|ster · e · o · type|stereo + type|stereo + type
      stereotypical|an Italian family just like in every other film;the idea that all women love shopping;characters seen in a hundred films|stereotypical means fitting a fixed idea; unusual means different from what is common|stereotypical 是模式化的；unusual 是不寻常的|unusual=unusual means different from what is normal, the opposite of what you see in every film or think of a whole group=unusual 是不寻常的，和每部电影都有或对一整群人的看法正相反;stereophonic=stereophonic describes sound from two speakers, not people, views or characters=stereophonic 形容双声道的声音，不形容人、看法或角色|ster · e · o · typ · i · cal|stereotype with the e dropped before -ical|stereotype 去掉 e 再加 -ical
      prejudiced|thinking all city people rude without meeting one;refusing to hire anyone over fifty;a judge whose mind is made up before the facts|prejudiced means having an unfair opinion of a group; open-minded means willing to consider new ideas|prejudiced 是有偏见的；open-minded 是思想开明的|open-minded=open-minded means willing to listen and consider new ideas, the opposite of an opinion formed before meeting people or hearing facts=open-minded 是愿意倾听、思想开明，和没见过人、没听事实就下结论正相反;experienced=experienced means knowing a lot from doing something many times, not having an unfair opinion of a group=experienced 是经验丰富的，不是对群体抱有不公看法|prej · u · diced|pre + judice + d, with no g|pre + judice + d，没有 g
      narrow-minded|views on foreigners that shocked colleagues;refusing music from other countries;village life where anyone different is laughed at|narrow-minded means refusing ideas different from your own; open-minded means welcoming them|narrow-minded 是心胸狭隘的；open-minded 是思想开明的|open-minded=open-minded means welcoming different ideas, the opposite of shocking views or laughing at people who are different=open-minded 是欢迎不同想法，和令人震惊的看法、嘲笑与众不同的人正相反;absent-minded=absent-minded means often forgetting things, not refusing other ways of life=absent-minded 是心不在焉、健忘，不是排斥别的生活方式|nar · row · mind · ed|a double r and a hyphen before minded|双写 r，minded 前有连字符
      open-minded|ideas that are new to her;listening before deciding about a plan;people who welcome new ideas|open-minded means welcoming new ideas; narrow-minded means refusing them|open-minded 是思想开明的；narrow-minded 是心胸狭隘的|narrow-minded=narrow-minded means refusing new ideas, the opposite of enjoying, listening to or welcoming them=narrow-minded 是拒绝新想法，和喜欢、倾听或欢迎新想法正相反;absent-minded=absent-minded means often forgetting things, not about how you treat new ideas=absent-minded 是健忘，与如何对待新想法无关|o · pen · mind · ed|open + hyphen + minded|open + 连字符 + minded
      ignorance|people fearing what they know nothing about;never having heard of Bhutan;not knowing the rules of the law|ignorance is a lack of knowledge; arrogance is thinking you are better than others|ignorance 是无知；arrogance 是傲慢|arrogance/Arrogance=arrogance is thinking you are better than others, not knowing nothing about something=arrogance 是自以为高人一等，不是对某事一无所知;elegance/Elegance=elegance is beauty and style in how someone looks or moves, not a lack of knowledge=elegance 是优雅，不是缺乏知识|ig · no · rance|ignore with the e dropped, then -ance|ignore 去掉 e，再加 -ance
      ignorant|not being able to name a single painter;a remark from someone who had never visited Africa;workers who don't know they can get help|ignorant means not knowing things you should; arrogant means thinking you are better than others|ignorant 是无知的；arrogant 是傲慢的|arrogant=arrogant means thinking you are better than others, not lacking knowledge of art, places or rights=arrogant 是傲慢的，不是不了解艺术、地方或权利;informed=informed means knowing a lot about something, the opposite of not knowing=informed 是消息灵通的，和不知道正相反|ig · no · rant|ignore with the e dropped, then -ant|ignore 去掉 e，再加 -ant
      misunderstanding|a waiter who heard chicken instead of fish;an argument about what someone had meant;not knowing the customs abroad|a misunderstanding is getting something wrong between people; understanding is getting it right|misunderstanding 是误会；understanding 是理解|understanding/understandings=understanding is knowing correctly what someone means, the opposite of hearing wrong or not knowing the customs=understanding 是正确理解，和听错或不懂习俗正相反;misprint/misprints=misprint is a mistake in printed words, not a mistake between people who are talking=misprint 是印刷错误，不是人们交谈中的误会|mis · un · der · stand · ing|mis + understanding|mis + understanding
      misconception|the wrong belief that bats are blind;wrong beliefs about a disease that an article corrects;ideas about life in China that are not true|a misconception is a wrong idea many people believe; a fact is something true|misconception 是错误观念；fact 是事实|fact/facts=fact is something true, the opposite of a wrong idea that needs correcting=fact 是真实的事，和需要纠正的错误观念正相反;misfortune/misfortunes=misfortune is bad luck, not a wrong idea people believe=misfortune 是不幸，不是人们相信的错误观念|mis · con · cep · tion|mis + conception|mis + conception
      judgmental|criticizing other people's choices;an aunt who criticizes everyone's clothes;adults who listen instead of criticizing|judgmental means quick to criticize; supportive means helping and encouraging|judgmental 是爱评判的；supportive 是支持人的|supportive=supportive means giving help and encouragement, not criticizing people's choices or clothes=supportive 是支持、鼓励的，不是批评别人的选择或衣着;sentimental=sentimental means easily moved by feelings of love or sadness, not quick to criticize others=sentimental 是多愁善感的，不是急于批评别人|judg · men · tal|judgment + al, with no e after the g|judgment + al，g 后没有 e
      empathy|doctors imagining how their patients feel;seeing the world through other people's eyes;feeling refugees' pain as your own|empathy is sharing another person's feelings; apathy is not caring at all|empathy 是同理心；apathy 是冷漠|apathy=apathy is not caring about anything, the opposite of imagining and sharing someone's feelings=apathy 是漠不关心，和体会、分担他人感受正相反;antipathy=antipathy is a strong dislike, not sharing someone's feelings=antipathy 是强烈的反感，不是分担他人感受|em · pa · thy|em + pathy, not *apathy*|em + pathy，别写成 *apathy*
      empathize|having lost a job too;understanding how pupils feel;having been lonely once|to empathize is to share someone's feelings; to disagree is to have a different opinion|empathize 是感同身受；disagree 是不同意|disagree/disagrees=disagree means to have a different opinion, not to share someone's feelings because you have felt them too=disagree 是意见不同，不是因为有过同样经历而感同身受;interfere/interferes=interfere means to get involved where you are not wanted, not to understand how someone feels=interfere 是干涉，不是理解别人的感受|em · pa · thize|empathy with the y changed to -ize|把 empathy 的 y 改成 -ize
    `,
  },
});

const tourism = vocabularyTopic({
  id: "b2-words-tourism",
  title: t("Tourism", "旅游业"),
  summary: t(
    "Tourism, ecotourism and overtourism; attractions, excursions and expeditions; voyages and pilgrimages; hospitality and resorts; trekking and backpackers.",
    "旅游业、生态旅游和过度旅游；景点、短途游览和探险；航行和朝圣；接待服务和度假村；徒步旅行和背包客。",
  ),
  intro: t(
    "From our beach **resort** we went on a boat **excursion** to the islands, while some **backpackers** set off to **trek** in the mountains. These words help you talk about travel, the tourist business and what it does to the places people visit.",
    "我们从海滨 **resort**（度假胜地）出发，乘船去小岛 **excursion**（短途游览），而几个 **backpackers**（背包客）出发去山里 **trek**（徒步跋涉）。这些词帮你谈论旅行、旅游业，以及它给游客所到之处带来的影响。",
  ),
  prerequisites: ["b1-words-travel-2"],
  words: [
    word(
      "tourism",
      "the business of providing services for people on holiday",
      "旅游业",
      "{Tourism} is the island's main industry: visitors fill its hotels and beaches.|Terrorism Journalism | The government wants to promote {tourism} in the north to bring in more visitors. | Mass {tourism} has changed the coast: hotels now stand on every beach.",
      "terrorism journalism",
      "ecotourism",
    ),
    word(
      "ecotourism",
      "tourism to natural areas that tries to protect the environment and help local people",
      "生态旅游",
      "{Ecotourism} brings visitors' money to the rainforest without cutting it down.|Overtourism Ecology | Costa Rica is famous for {ecotourism}: visitors watch wildlife in protected forests. | {Ecotourism} lodges use solar power and hire local guides for their guests.|Overtourism Ecology",
      "overtourism ecology",
      "tourism",
    ),
    word(
      "overtourism",
      "too many tourists visiting a place, so that it is damaged",
      "过度旅游",
      "Venice suffers from {overtourism}: its narrow streets are packed with millions of visitors. | {Overtourism} pushes up rents, so local people can no longer afford to live in the old town.|Ecotourism Overtime | Some cities limit cruise ships to fight {overtourism} and protect their streets.",
      "ecotourism overtime",
      "ecotourism",
    ),
    word(
      "attraction attractions",
      "a place or an event that people visit for enjoyment",
      "景点；吸引力",
      "The Great Wall is China's most famous tourist {attraction}, visited by millions. | The city has many tourist {attractions}, such as museums, parks and a zoo.|distractions accommodations | The main {attraction} of the festival is the fireworks, which everyone comes to see.",
      "distraction accommodation",
    ),
    word(
      "excursion excursions",
      "a short trip, usually made by a group for pleasure",
      "短途旅行；远足",
      "We went on a short {excursion} to the islands and were back by lunch. | The hotel organizes {excursions} by bus to the old town for an afternoon.|expeditions excuses | A half-day {excursion} to the lake costs 40 dollars.",
      "expedition excuse",
      "expedition",
    ),
    word(
      "expedition expeditions",
      "a long, organized journey, especially to a dangerous or unknown place",
      "探险；远征",
      "The {expedition} reached the South Pole in January after three months on the ice. | She led a scientific {expedition} deep into the Amazon rainforest. | Climbing {expeditions} spend weeks on Everest and leave rubbish behind.|excursions exhibitions",
      "excursion exhibition",
      "voyage",
    ),
    word(
      "voyage voyages",
      "a long journey, especially by sea or in space",
      "（尤指海上或太空的）航行",
      "The {voyage} across the Atlantic took six weeks by ship. | Columbus made four long {voyages} across the ocean to the Americas.|excursions villages | The spacecraft is on a long {voyage} to Mars that will take seven months.",
      "excursion village",
      "expedition",
    ),
    word(
      "pilgrimage pilgrimages",
      "a journey to a holy place for religious reasons; a visit to a place that is important to you",
      "朝圣",
      "Millions make the {pilgrimage} to Mecca every year to pray. | Every year fans make the {pilgrimage} to the singer's home town, as if it were a holy place. | Medieval {pilgrimages} to holy places could take years on foot.|pillages excursions",
      "pillage excursion",
    ),
    word(
      "hospitality",
      "being friendly and generous to guests; the business of hotels and restaurants",
      "好客；酒店餐饮业",
      "Thank you for your {hospitality}: the meals and the room were wonderful. | The region is famous for its {hospitality}: families invite strangers in for tea. | She works in the {hospitality} industry, managing hotels and restaurants.",
      "hostility hospital",
    ),
    word(
      "resort resorts",
      "a place where many people go on holiday",
      "度假胜地",
      "We stayed at a ski {resort} in the Alps, with hotels at the foot of the slopes. | The beach {resorts} are full of holidaymakers in August.|reports resources | The {resort} has three pools, five restaurants and a spa for its guests.",
      "report resource",
    ),
    word(
      "trek treks trekked trekking",
      "to walk a long distance, often over mountains",
      "长途跋涉；徒步旅行",
      "We {trekked} on foot through the jungle for five days.|drove sailed | {Trekking} in Nepal, walking for days over high mountains, is popular.|Driving Sailing | They {trek} ten kilometers a day on foot over the hills.",
      "drive sail",
    ),
    word(
      "backpacker backpackers",
      "a person who travels cheaply, carrying their things in a backpack",
      "背包客",
      "The cheap hostel is full of young {backpackers} traveling around the world.|backpacks bookmakers | {Backpackers} often stay in cheap hostels to save money for travel.|Backpacks Bookmakers | As a {backpacker}, she traveled through India for a year with all her things on her back.",
      "backpack bookmaker",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Excursion*, *expedition* and *voyage* are all journeys: an *excursion* is short and for fun, an *expedition* is long and to a hard or unknown place, and a *voyage* is long and by sea or in space. Look for words about how long the trip is and how people travel.",
        "*excursion*、*expedition* 和 *voyage* 都是旅程：*excursion* 短而为了消遣，*expedition* 长而去艰险或未知之地，*voyage* 长而走海路或太空。找找说明行程长短和出行方式的词。",
      ),
      meaning: t(
        "*Ecotourism* protects nature and helps local people, while *overtourism* damages a place with too many visitors. Check whether the meaning is good or bad for the place.",
        "*ecotourism* 保护自然、帮助当地人，*overtourism* 是游客太多而损害一个地方。看释义对那个地方是好是坏。",
      ),
      spell: t(
        "*Trek* doubles its k in *trekked* and *trekking*, *pilgrimage* ends in -age, and *hospitality* is hospital + ity.",
        "*trek* 在 *trekked* 和 *trekking* 里双写 k，*pilgrimage* 以 -age 结尾，*hospitality* 是 hospital + ity。",
      ),
    },
    notes: `
      tourism|visitors filling an island's hotels and beaches;bringing more visitors to the north;hotels on every beach|tourism is the business of holidays; terrorism is violence for political aims|tourism 是旅游业；terrorism 是恐怖主义|terrorism/Terrorism=terrorism is violence used for political aims, not the business of visitors, hotels and beaches=terrorism 是为政治目的使用暴力，不是游客、酒店和海滩的生意;journalism/Journalism=journalism is the work of writing news, not the business of hotels and visitors=journalism 是新闻工作，不是酒店和游客的生意|tour · ism|tour + ism|tour + ism
      ecotourism|visitors' money for a rainforest left standing;wildlife watched in protected forests;lodges with solar power and local guides|ecotourism is travel that protects nature; overtourism is too many visitors damaging a place|ecotourism 是生态旅游；overtourism 是过度旅游|overtourism/Overtourism=overtourism is too many visitors damaging a place, the opposite of protecting forests and helping local people=overtourism 是游客太多造成破坏，和保护森林、帮助当地人正相反;ecology/Ecology=ecology is the science of how living things and their environment work together, not a kind of travel with visitors and guides=ecology 是生态学，不是有游客和导游的旅行方式|e · co · tour · ism|eco + tourism|eco + tourism
      overtourism|narrow streets packed with millions of visitors;rents local people can no longer afford;cruise ships limited to protect streets|overtourism is too many visitors harming a place; ecotourism is travel that protects it|overtourism 是过度旅游；ecotourism 是生态旅游|ecotourism/Ecotourism=ecotourism protects places and helps local people, the opposite of packed streets and high rents=ecotourism 保护当地、帮助居民，和拥挤的街道、高房租正相反;overtime/Overtime=overtime is extra hours at work, not too many visitors in a city=overtime 是加班时间，不是城市里游客太多|o · ver · tour · ism|over + tourism|over + tourism
      attraction|a wall visited by millions;museums, parks and a zoo for tourists;fireworks everyone comes to see|an attraction is something people visit for enjoyment; a distraction takes your attention away|attraction 是景点、吸引人的东西；distraction 是让人分心的事|distraction/distractions=distraction is something that takes your attention away from what you are doing, not a place millions of tourists choose to visit=distraction 是让人分心的事，不是成千上万游客专程去的地方;accommodation/accommodations=accommodation is a place to sleep, such as a hotel, not a wall, a museum or fireworks to see=accommodation 是住处，不是可看的长城、博物馆或烟花|at · trac · tion|a double t, then -tion|双写 t，结尾是 -tion
      excursion|a trip to the islands back by lunch;afternoon bus trips to the old town;a half-day trip to a lake|an excursion is a short trip for pleasure; an expedition is a long journey to a hard place|excursion 是短途游览；expedition 是远征探险|expedition/expeditions=expedition is a long journey to a dangerous or unknown place, not a short trip that ends by lunch or after an afternoon=expedition 是去艰险或未知之地的长途旅程，不是午饭前或一个下午就结束的短途游;excuse/excuses=excuse is a reason you give for doing something wrong, not a trip=excuse 是借口，不是旅行|ex · cur · sion|ex + cursion, with -sion said like *zhun*|ex + cursion，-sion 读作 *zhun*
      expedition|three months on the ice to the South Pole;a scientific journey deep into the Amazon;weeks of climbing on Everest|an expedition is a long journey to a hard place; an excursion is a short trip for fun|expedition 是远征探险；excursion 是短途游览|excursion/excursions=excursion is a short trip for pleasure, not three months on the ice or weeks on a mountain=excursion 是消遣的短途游，不是冰上三个月或山上几周;exhibition/exhibitions=exhibition is a show of objects in a museum, not a journey to a pole, a rainforest or a mountain=exhibition 是展览，不是去极地、雨林或高山的旅程|ex · pe · di · tion|ex + pedi + tion|ex + pedi + tion
      voyage|six weeks by ship across the Atlantic;long trips across the ocean to the Americas;seven months of travel to Mars|a voyage is a long journey by sea or in space; an excursion is a short trip|voyage 是长途航行；excursion 是短途游|excursion/excursions=excursion is a short trip for pleasure, not weeks or months across an ocean or through space=excursion 是消遣的短途游，不是跨洋或穿越太空的数周数月;village/villages=village is a small place where people live, not a journey=village 是村庄，不是旅程|voy · age|voy + age, with oy said like *oi*|voy + age，oy 读作 *oi*
      pilgrimage|millions going to Mecca to pray;fans visiting a singer's home town like a holy place;medieval journeys on foot to holy places|a pilgrimage is a journey to a holy or important place; pillage is stealing in a war|pilgrimage 是朝圣；pillage 是战时掠夺|pillage/pillages=pillage is stealing and destroying during a war, not a journey to pray or to honor a place=pillage 是战时的抢劫破坏，不是去祈祷或致敬的旅程;excursion/excursions=excursion is a short trip for fun, not a journey made because a place is holy=excursion 是消遣的短途游，不是因为某地神圣而去的旅程|pil · grim · age|pilgrim + age|pilgrim + age
      hospitality|wonderful meals and a room for a guest;families inviting strangers in for tea;managing hotels and restaurants|hospitality is being kind and generous to guests; hostility is being unfriendly|hospitality 是好客；hostility 是敌意|hostility=hostility is unfriendly or angry behavior, the opposite of welcoming guests with meals and tea=hostility 是敌意，和用饭菜、茶水招待客人正相反;hospital=hospital is a place where sick people are treated, not kindness to guests or the business of hotels=hospital 是医院，不是待客之道或酒店餐饮业|hos · pi · tal · i · ty|hospital + ity|hospital + ity
      resort|hotels at the foot of ski slopes in the Alps;beach places full of holidaymakers;three pools, five restaurants and a spa|a resort is a place where people go on holiday; a report is a written account|resort 是度假胜地；report 是报告|report/reports=report is a written or spoken account of something, not a place where people stay on holiday=report 是报告，不是人们度假居住的地方;resource/resources=resource is a supply of something useful, such as water or money, not a holiday place with hotels and pools=resource 是资源，不是有酒店泳池的度假地|re · sort|re + sort, with s said like z|re + sort，s 读作 z
      trek|five days on foot through the jungle;walking for days over high mountains;ten kilometers a day on foot over hills|to trek is to walk a long, hard way; to drive is to travel by car|trek 是长途跋涉；drive 是开车|drive/drove/Driving=drive means to travel by car, not on foot over hills, mountains or through a jungle=drive 是开车，不是步行穿越丛林或翻山越岭;sail/sailed/Sailing=sail means to travel by boat on water, not on foot over land=sail 是乘船航行，不是在陆地上步行|trek|a single k, doubled in trekked and trekking|一个 k，trekked 和 trekking 里双写
      backpacker|young travelers in a cheap hostel;saving money for travel by staying in hostels;a year in India with everything on her back|a backpacker is a person who travels cheaply; a backpack is the bag they carry|backpacker 是背包客；backpack 是背包|backpack/backpacks/Backpacks=backpack is a bag you carry on your back, not a person who travels and stays in hostels=backpack 是背包，不是旅行住青旅的人;bookmaker/bookmakers/Bookmakers=bookmaker is a person who takes bets on races, not a person who travels cheaply=bookmaker 是接受赌注的庄家，不是穷游的人|back · pack · er|back + pack + er|back + pack + er
    `,
  },
});

const food = vocabularyTopic({
  id: "b2-words-food-2",
  title: t("Food and Taste", "食物与口味"),
  summary: t(
    "Gourmet and culinary traditions; staples and delicacies; savory and bland dishes; aromas and textures; garnishing; fermenting and marinating; nutritious food.",
    "美食和烹饪传统；主食和珍馐；咸香的和清淡的菜；香味和口感；装饰菜肴；发酵和腌制；有营养的食物。",
  ),
  intro: t(
    "The chef **marinates** the beef overnight, adds a **garnish** of herbs, and the **aroma** fills the whole restaurant. These words help you describe how food is made, how it tastes and why it is good for you.",
    "厨师把牛肉 **marinates**（腌制）一夜，再加一点香草做 **garnish**（装饰配菜），**aroma**（香味）飘满整个餐厅。这些词帮你描述食物怎么做、什么味道，以及为什么对身体好。",
  ),
  prerequisites: ["b1-words-food-culture"],
  words: [
    word(
      "gourmet",
      "connected with very good, expensive food; a person who knows a lot about good food",
      "美食的；美食家",
      "The hotel has a {gourmet} restaurant where famous chefs cook expensive dishes. | She shops at a {gourmet} food store that sells rare French cheeses. | They sell {gourmet} chocolates made by hand from the finest cocoa.",
      "budget bland",
      "culinary",
    ),
    word(
      "culinary",
      "connected with cooking",
      "烹饪的",
      "He studied at a {culinary} school in Paris to become a chef. | The city is famous for its {culinary} traditions: its noodle soup and dumplings are known everywhere. | Her {culinary} skills are amazing: she can cook any dish.",
      "military medical",
      "gourmet",
    ),
    word(
      "staple staples",
      "a basic food that people eat often; something used regularly",
      "主食；主要产品",
      "Rice is a {staple} in much of Asia: people eat it every day. | Bread and potatoes are {staples} of the German diet, eaten at almost every meal.|delicacies stables | Pasta is a {staple} in our kitchen: we eat it three times a week.",
      "delicacy stable",
      "delicacy",
    ),
    word(
      "delicacy delicacies",
      "a rare or expensive food that is thought to be very good",
      "珍馐；佳肴",
      "Snails are a {delicacy} in France: rare and expensive, they are eaten on special occasions. | Bird's nest soup is a costly Chinese {delicacy}. | The market sells local {delicacies}, such as smoked eel and rare mushrooms.|staples decencies",
      "staple decency",
      "staple",
    ),
    word(
      "savory",
      "salty or spicy rather than sweet",
      "咸的；咸香的",
      "Do you prefer sweet or {savory} snacks, like chips and salted nuts? | We had {savory} pancakes filled with cheese and ham. | The cake is sweet, but the pie is {savory}: it is full of salty meat.",
      "sugary bland",
      "bland",
    ),
    word(
      "bland",
      "without a strong taste",
      "清淡的；无味的",
      "The soup was rather {bland}: it needed salt and pepper. | Hospital food is often {bland}, with no salt or spices. | He prefers {bland} food, without chili or garlic, because of his stomach.",
      "savory spicy",
      "savory",
    ),
    word(
      "aroma aromas",
      "a pleasant smell, especially of food or drink",
      "香味；芳香",
      "The {aroma} of fresh coffee filled the kitchen. | I love the {aroma} of baking bread that drifts from the bakery each morning. | The spices give off a rich {aroma} that you can smell from the street.",
      "texture flavor",
      "texture",
    ),
    word(
      "texture textures",
      "the way something feels when you touch it or eat it",
      "质地；口感",
      "The cake has a soft, light {texture} that feels like a cloud in your mouth. | I don't like the slimy {texture} of raw fish. | The fabric has a rough {texture} that you can feel with your fingers.",
      "aroma flavor",
      "aroma",
    ),
    word(
      "garnish garnishes garnished garnishing",
      "to decorate food with a small amount of another food; the food used to do this",
      "装饰（菜肴）；配菜",
      "{Garnish} the soup with a few fresh herbs just before you serve it.|Ferment Marinate | The fish was {garnished} with a slice of lemon on top.|fermented marinated | Add a {garnish} of parsley to make the plate look pretty.|marinade varnish",
      "ferment marinate",
    ),
    word(
      "ferment ferments fermented fermenting",
      "to change chemically through the action of bacteria or yeast, as when sugar becomes alcohol",
      "发酵",
      "Kimchi is cabbage that has been {fermented} by bacteria for weeks until it turns sour.|garnished marinated | Winemakers {ferment} grapes, letting yeast turn their sugar into alcohol. | The dough is left to {ferment} overnight so that the yeast can make it rise.",
      "garnish marinate",
      "marinate",
    ),
    word(
      "marinate marinates marinated marinating",
      "to leave meat or fish in a sauce before cooking it, to add flavor",
      "腌制；浸泡",
      "{Marinate} the chicken in soy sauce for an hour before you cook it.|Ferment Garnish | The beef was {marinated} in wine overnight to make it tender before cooking.|fermented garnished | Leave the fish to {marinate} in lemon juice before grilling it.",
      "ferment garnish",
      "ferment",
    ),
    word(
      "nutritious",
      "containing many of the substances that your body needs to be healthy",
      "有营养的",
      "Beans are cheap and {nutritious}: they are full of protein and fiber. | Children need {nutritious} school meals with plenty of vegetables to grow well. | {Nutritious} breakfasts give your body the energy and vitamins it needs.|Unhealthy Ambitious",
      "unhealthy ambitious",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Savory* and *bland* both describe food that is not sweet, but *savory* food is salty or spicy and full of taste, while *bland* food has almost no taste. Ask whether the food in the sentence has a strong flavor.",
        "*savory* 和 *bland* 都形容不甜的食物，但 *savory* 咸香、味道足，*bland* 几乎没味道。想想句子里的食物味道浓不浓。",
      ),
      meaning: t(
        "A *staple* is a basic food people eat every day, while a *delicacy* is a rare, special food. Check whether the meaning says the food is common or rare.",
        "*staple* 是天天吃的基本食物，*delicacy* 是稀有、讲究的美食。看释义说的是常见还是稀有。",
      ),
      spell: t(
        "*Gourmet* ends in a silent t, *marinate* ends in -ate while the sauce is a *marinade*, and *nutritious* ends in -tious.",
        "*gourmet* 结尾的 t 不发音，*marinate* 以 -ate 结尾，而腌料是 *marinade*，*nutritious* 以 -tious 结尾。",
      ),
    },
    notes: `
      gourmet|expensive dishes by famous chefs;a store selling rare French cheeses;chocolates made from the finest cocoa|gourmet means fine and expensive; budget means cheap|gourmet 是美食级的、讲究的；budget 是廉价的|budget=budget means cheap and simple, the opposite of expensive dishes, rare cheeses or the finest cocoa=budget 是廉价的，和昂贵菜肴、稀有奶酪或上等可可正相反;bland=bland means without much taste, not fine food made by top chefs=bland 是没味道的，不是顶级厨师做的精美食物|gour · met|gour + met, with a silent t|gour + met，t 不发音
      culinary|a school in Paris for becoming a chef;noodle soup and dumplings known everywhere;being able to cook any dish|culinary means connected with cooking; medical means connected with doctors|culinary 与烹饪有关；medical 与医疗有关|military=military means connected with soldiers and the army, not with chefs, dishes or cooking=military 与军队有关，与厨师、菜肴或烹饪无关;medical=medical means connected with doctors and illness, not with cooking=medical 与医生和疾病有关，与烹饪无关|cu · li · nar · y|culin + ary|culin + ary
      staple|rice eaten every day in Asia;bread and potatoes at almost every meal;pasta three times a week|a staple is a basic food eaten often; a delicacy is a rare, special food|staple 是主食；delicacy 是珍馐|delicacy/delicacies=delicacy is a rare, special food, not something eaten every day or at almost every meal=delicacy 是稀有的美食，不是天天或几乎每餐都吃的东西;stable/stables=stable is a building for horses or means steady, not a basic food=stable 是马厩或稳定的，不是基本食物|sta · ple|a single p, not *stable*|只有一个 p，别写成 *stable*
      delicacy|rare, expensive snails for special occasions;costly bird's nest soup;smoked eel and rare mushrooms|a delicacy is rare and special food; a staple is basic food eaten every day|delicacy 是珍馐；staple 是主食|staple/staples=staple is a basic food eaten every day, not something rare, costly or special=staple 是天天吃的基本食物，不是稀有、昂贵或特别的东西;decency/decencies=decency is honest, polite behavior, not a food=decency 是正派得体，不是食物|del · i · ca · cy|delicate with -te changed to -cy|把 delicate 的 -te 改成 -cy
      savory|chips and salted nuts;pancakes filled with cheese and ham;a pie full of salty meat|savory means salty or spicy; sugary means sweet|savory 是咸香的；sugary 是甜的|sugary=sugary means full of sugar, the opposite of salty snacks, cheese, ham or meat=sugary 是含糖多的，和咸零食、奶酪、火腿或肉正相反;bland=bland means having almost no taste, not salty and full of flavor=bland 是几乎没味道，不是咸香有味|sa · vor · y|savor + y|savor + y
      bland|soup that needed salt and pepper;hospital food with no salt or spices;food without chili or garlic|bland means with almost no taste; savory means salty and full of flavor|bland 是清淡无味的；savory 是咸香的|savory=savory means salty or spicy and full of flavor, the opposite of food that needs salt or has no spices=savory 是咸香有味，和缺盐、不放调料的食物正相反;spicy=spicy means hot with strong spices, the opposite of food with no chili or spices=spicy 是辣的、调料重的，和不放辣椒调料的食物正相反|bland|bl + and, not *blend*|bl + and，别写成 *blend*
      aroma|fresh coffee filling the kitchen;baking bread drifting from a bakery;spices you can smell from the street|an aroma is a pleasant smell; a texture is how something feels|aroma 是香味；texture 是质地|texture=texture is how something feels when you touch or eat it, not a smell that fills a room or reaches the street=texture 是触感或口感，不是飘满屋子、传到街上的气味;flavor=flavor is how food tastes in your mouth, not a smell that drifts through the air=flavor 是嘴里尝到的味道，不是飘在空气中的气味|a · ro · ma|a + ro + ma, ending in a|a + ro + ma，以 a 结尾
      texture|a cake that feels like a cloud;slimy raw fish;rough fabric felt with fingers|texture is how something feels; aroma is how it smells|texture 是质地；aroma 是香味|aroma=aroma is a smell, not how something feels soft, slimy or rough=aroma 是气味，不是软、滑或粗糙的感觉;flavor=flavor is how food tastes, not how a cake, fish or fabric feels=flavor 是味道，不是蛋糕、鱼或布料摸起来的感觉|tex · ture|text + ure|text + ure
      garnish|fresh herbs on soup just before serving;a slice of lemon on top of fish;parsley to make a plate look pretty|to garnish is to decorate food just before serving; to marinate is to soak it before cooking|garnish 是装饰菜肴；marinate 是腌制|ferment/Ferment/fermented=ferment means to change slowly through bacteria or yeast, not to decorate food on the plate=ferment 是靠细菌或酵母慢慢发酵，不是在盘子里装饰食物;marinate/Marinate/marinated=marinate means to soak food in sauce before cooking, not to put something on top just before serving=marinate 是烹饪前把食物泡在酱汁里，不是上菜前在上面点缀;marinade=marinade is a sauce you soak meat in before cooking, not a small decoration on the plate=marinade 是烹饪前泡肉的腌料，不是盘子上的小点缀;varnish=varnish is a clear liquid painted on wood, not food=varnish 是涂在木头上的清漆，不是食物|gar · nish|gar + nish|gar + nish
      ferment|cabbage made sour by bacteria;yeast turning sugar into alcohol;dough rising overnight with yeast|to ferment is to change through bacteria or yeast; to marinate is to soak food in sauce|ferment 是发酵；marinate 是腌制|garnish/garnished=garnish means to decorate food just before serving, not to change it slowly through bacteria or yeast=garnish 是上菜前装饰，不是靠细菌或酵母慢慢改变食物;marinate/marinated=marinate means to soak food in sauce, not to let bacteria or yeast change it=marinate 是用酱汁腌泡，不是让细菌或酵母改变它|fer · ment|fer + ment|fer + ment
      marinate|chicken in soy sauce for an hour before cooking;beef in wine overnight to make it tender;fish in lemon juice before grilling|to marinate is to soak food in sauce before cooking; to garnish is to decorate it after|marinate 是腌制；garnish 是装饰菜肴|ferment/Ferment/fermented=ferment means to change through bacteria or yeast over a long time, not to soak meat or fish in sauce before cooking=ferment 是靠细菌或酵母长时间发酵，不是烹饪前用酱汁腌肉或鱼;garnish/Garnish/garnished=garnish means to decorate food when it is served, not to soak it before cooking=garnish 是上菜时装饰，不是烹饪前腌泡|mar · i · nate|marin + ate, while the sauce is a marinade|marin + ate，腌料是 marinade
      nutritious|beans full of protein and fiber;school meals with plenty of vegetables;breakfasts with energy and vitamins|nutritious means full of what your body needs; unhealthy means bad for you|nutritious 是有营养的；unhealthy 是不健康的|unhealthy/Unhealthy=unhealthy means bad for your body, the opposite of food full of protein, vegetables or vitamins=unhealthy 是对身体不好的，和富含蛋白质、蔬菜或维生素的食物正相反;ambitious/Ambitious=ambitious means wanting very much to succeed, a word for people, not food=ambitious 是有雄心的，形容人，不形容食物|nu · tri · tious|nutrition with -tion changed to -tious|把 nutrition 的 -tion 改成 -tious
    `,
  },
});

const people = vocabularyTopic({
  id: "b2-words-personality-3",
  title: t("Character and Temperament", "性格与气质"),
  summary: t(
    "Charismatic and eccentric people; introverted and extroverted ones; assertive and cautious, impulsive and witty; naive and pragmatic, idealistic and temperamental.",
    "有魅力的和古怪的人；内向的和外向的人；果断自信的和谨慎的人，冲动的和机智风趣的人；天真的和务实的人，理想主义的和喜怒无常的人。",
  ),
  intro: t(
    "My sister is **extroverted** and **witty**, while I am more **introverted** and **cautious**, but we both laugh at our **eccentric** grandfather. These words help you describe people's characters and how they deal with others and with problems.",
    "我姐姐 **extroverted**（外向）又 **witty**（风趣），我则更 **introverted**（内向）、**cautious**（谨慎），不过我们都会被 **eccentric**（古怪的）爷爷逗笑。这些词帮你描述人的性格，以及他们如何待人、如何处理问题。",
  ),
  prerequisites: ["b1-words-personality"],
  words: [
    word(
      "charismatic",
      "having a strong personal charm that makes people follow or admire you",
      "有魅力的；有感召力的",
      "She is the most {charismatic} leader I know: her charm makes people love to follow her. | The {charismatic} singer held the crowd's attention with her charm and energy. | He is handsome and {charismatic}: everyone is drawn to his charm.",
      "charitable introverted",
    ),
    word(
      "eccentric",
      "behaving in a strange and unusual way",
      "古怪的；反常的",
      "My {eccentric} uncle wears a top hat to the supermarket. | The old professor was famous for his {eccentric} habits, like walking to work backwards. | She is a little {eccentric}, keeping twelve cats and talking to them, but very kind.",
      "conventional concentric",
    ),
    word(
      "introverted",
      "quiet and shy, preferring to spend time alone",
      "内向的",
      "He is {introverted} and prefers books to parties. | {Introverted} children may need time before they speak up in class.|Extroverted Talkative | She is too {introverted} to enjoy big parties.",
      "extroverted talkative",
      "extroverted",
    ),
    word(
      "extroverted",
      "lively and confident, enjoying being with other people",
      "外向的",
      "She is {extroverted} and loves meeting new people. | {Extroverted} people often enjoy working in sales, where they meet new people all day.|Introverted Shy | He is the most {extroverted} person in the family: he talks to everyone.",
      "introverted shy",
      "introverted",
    ),
    word(
      "assertive",
      "saying confidently what you think or want",
      "坚定自信的；果断的",
      "You need to be more {assertive} and ask calmly for a pay rise. | She is polite but {assertive}: she always says clearly what she wants. | {Assertive} people say no politely without feeling guilty.|Timid Abrasive",
      "timid abrasive",
    ),
    word(
      "cautious",
      "careful to avoid risks",
      "谨慎的",
      "Be {cautious} when you drive in the snow: slow down and keep your distance. | Investors are {cautious} about the market and are keeping their money safe. | He is a {cautious} driver who never takes risks.",
      "careless curious",
      "pragmatic",
    ),
    word(
      "impulsive",
      "doing things suddenly without thinking about them first",
      "冲动的",
      "Buying the car was {impulsive}: I didn't think about it at all. | He is {impulsive} and often says things without thinking, then regrets them. | Don't be so {impulsive}: think first.",
      "cautious deliberate",
      "temperamental",
    ),
    word(
      "witty",
      "clever and funny with words",
      "机智风趣的",
      "Her speech was {witty} and short, and everyone laughed. | He is famous for his {witty} remarks that make people laugh. | Oscar Wilde was a {witty} writer whose clever jokes are still quoted.",
      "dull wiry",
    ),
    word(
      "naive",
      "believing too easily that people are honest and things are simple, because of a lack of experience",
      "天真的；幼稚的",
      "It was {naive} of me to trust him so easily: he lied to me. | She is young and a little {naive}: she believes everything she reads online. | They have a {naive} view of politics and think every politician is honest.",
      "cynical native",
      "idealistic",
    ),
    word(
      "pragmatic",
      "dealing with problems in a practical, sensible way",
      "务实的；实用主义的",
      "We need a solution that is {pragmatic} and works in practice, not a perfect one. | As a manager she is {pragmatic}: she deals with problems in a sensible, practical way. | The government's approach was {pragmatic}: it chose what would work, not what sounded best.",
      "idealistic dramatic",
      "cautious",
    ),
    word(
      "idealistic",
      "believing that a perfect world is possible, even when this is not practical",
      "理想主义的",
      "As a student, I was very {idealistic} and thought I could change the world. | The plan is too {idealistic} to work in the real world. | {Idealistic} young volunteers came to help, dreaming of a fairer world.|Pragmatic Realistic",
      "pragmatic realistic",
      "naive",
    ),
    word(
      "temperamental",
      "having moods that change quickly and often",
      "喜怒无常的；性情急躁的",
      "The {temperamental} chef shouted at his staff one minute and laughed the next. | Our old car is a bit {temperamental}: sometimes it starts and sometimes it won't. | Artists are often described as {temperamental}, with moods that change quickly.",
      "even-tempered sentimental",
      "impulsive",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Pragmatic* and *idealistic* are opposites: a *pragmatic* person chooses what works in practice, while an *idealistic* person aims for a perfect world. Ask whether the sentence is about real results or about dreams.",
        "*pragmatic* 和 *idealistic* 意思相反：*pragmatic* 的人选择实际可行的办法，*idealistic* 的人追求完美的世界。想想句子说的是实际效果还是理想。",
      ),
      meaning: t(
        "*Impulsive* people act suddenly without thinking, while *temperamental* people change their mood quickly. Check whether the meaning is about actions or about moods.",
        "*impulsive* 的人不假思索就行动，*temperamental* 的人情绪变得快。看释义说的是行为还是情绪。",
      ),
      spell: t(
        "*Extroverted* starts with extro-, *naive* says its a and i as two separate sounds, and *witty* doubles the t.",
        "*extroverted* 以 extro- 开头，*naive* 里的 a 和 i 分开读，*witty* 双写 t。",
      ),
    },
    notes: `
      charismatic|a leader whose charm makes people follow;a singer holding a crowd with charm;someone everyone is drawn to|charismatic means having a charm that draws people; charitable means giving help to people in need|charismatic 是有个人魅力的；charitable 是慈善的|charitable=charitable means giving money or help to people in need, not having a charm that draws people to you=charitable 是乐善好施的，不是有吸引人的魅力;introverted=introverted means quiet and shy, the opposite of holding a crowd or drawing everyone near=introverted 是内向的，和吸引人群、人人想靠近正相反|char · is · mat · ic|ch said like k, then -matic|ch 读作 k，结尾是 -matic
      eccentric|a top hat at the supermarket;walking to work backwards;twelve cats she talks to|eccentric means strange and unusual; conventional means ordinary and following custom|eccentric 是古怪的；conventional 是循规蹈矩的|conventional=conventional means ordinary and doing what most people do, the opposite of top hats at the supermarket or walking backwards=conventional 是循规蹈矩的，和去超市戴礼帽或倒着走正相反;concentric=concentric describes circles with the same center, not people or habits=concentric 是同心的，形容圆，不形容人或习惯|ec · cen · tric|a double c at the start|开头双写 c
      introverted|preferring books to parties;children who need time to speak up;not enjoying big parties|introverted means quiet and preferring to be alone; extroverted means lively and social|introverted 是内向的；extroverted 是外向的|extroverted/Extroverted=extroverted means loving parties and people, the opposite of preferring books or being slow to speak up=extroverted 是喜欢聚会和人群，和偏爱书本或不急于发言正相反;talkative/Talkative=talkative means liking to talk a lot, the opposite of needing time to speak or avoiding parties=talkative 是爱说话的，和不敢发言或回避聚会正相反|in · tro · vert · ed|intro + verted|intro + verted
      extroverted|loving to meet new people;working in sales with new people all day;talking to everyone in the family|extroverted means lively and enjoying people; introverted means quiet and preferring to be alone|extroverted 是外向的；introverted 是内向的|introverted/Introverted=introverted means quiet and preferring to be alone, the opposite of loving new people or talking to everyone=introverted 是内向的，和喜欢结识新朋友或跟谁都聊正相反;shy/Shy=shy means nervous with other people, the opposite of enjoying meeting them=shy 是在人前紧张的，和喜欢跟人打交道正相反|ex · tro · vert · ed|extro + verted|extro + verted
      assertive|asking calmly for a pay rise;saying clearly what she wants;saying no politely without guilt|assertive means saying calmly and clearly what you want; timid means too shy to ask|assertive 是坚定自信的；timid 是胆小的|timid/Timid=timid means shy and easily frightened, the opposite of asking for a pay rise or saying no=timid 是胆小怕事的，和要求加薪或敢于拒绝正相反;abrasive/Abrasive=abrasive means rude and harsh to others, not calm and polite=abrasive 是粗鲁刺人的，不是冷静礼貌的|as · ser · tive|a double s, then -tive|双写 s，结尾是 -tive
      cautious|slowing down when driving in snow;keeping money safe in the market;a driver who never takes risks|cautious means careful to avoid risks; careless means not paying attention to risks|cautious 是谨慎的；careless 是粗心的|careless=careless means not thinking about risks, the opposite of slowing down, keeping money safe or never taking risks=careless 是不顾风险的，和放慢车速、守住钱财、从不冒险正相反;curious=curious means wanting to know about things, not being careful to avoid danger=curious 是好奇的，不是小心避险|cau · tious|caution with -tion changed to -tious|把 caution 的 -tion 改成 -tious
      impulsive|buying a car without thinking;saying things without thinking and regretting them;being told to think first|impulsive means acting suddenly without thinking; cautious means careful|impulsive 是冲动的；cautious 是谨慎的|cautious=cautious means careful and thinking before acting, the opposite of doing things without thinking=cautious 是谨慎、三思而行的，和不假思索正相反;deliberate=deliberate means done on purpose after careful thought, the opposite of not thinking at all=deliberate 是深思熟虑、有意的，和完全不想正相反|im · pul · sive|impulse with the e dropped, then -ive|impulse 去掉 e，再加 -ive
      witty|a short speech that made everyone laugh;remarks that make people laugh;clever jokes still quoted|witty means clever and funny with words; dull means boring|witty 是机智风趣的；dull 是乏味的|dull=dull means boring, the opposite of a speech, remarks or jokes that make people laugh=dull 是乏味的，和让人发笑的演讲、话语或笑话正相反;wiry=wiry means thin but strong, a word for bodies, not for speeches or jokes=wiry 是瘦而结实的，形容身体，不形容演讲或笑话|wit · ty|wit + ty, with a double t|wit + ty，双写 t
      naive|trusting a liar too easily;believing everything read online;thinking every politician is honest|naive means trusting too easily; cynical means trusting nobody|naive 是天真的；cynical 是愤世嫉俗的|cynical=cynical means believing people are never honest, the opposite of trusting easily or believing everything=cynical 是认为人都不诚实，和轻信别人正相反;native=native means born in a place, not trusting people too easily=native 是本地出生的，不是过于轻信|na · ive|a and i said separately, not *native*|a 和 i 分开读，别写成 *native*
      pragmatic|a solution that works in practice;dealing with problems in a sensible way;choosing what works over what sounds best|pragmatic means practical and sensible; idealistic means aiming for something perfect|pragmatic 是务实的；idealistic 是理想主义的|idealistic=idealistic means aiming for a perfect world, the opposite of choosing what works in practice=idealistic 是追求完美，和选择实际可行的办法正相反;dramatic=dramatic means sudden and exciting or full of emotion, not practical and sensible=dramatic 是戏剧性的、激动的，不是务实的|prag · mat · ic|prag + matic|prag + matic
      idealistic|thinking a student could change the world;a plan that won't work in the real world;volunteers dreaming of a fairer world|idealistic means believing a perfect world is possible; realistic means accepting things as they are|idealistic 是理想主义的；realistic 是现实的|pragmatic/Pragmatic=pragmatic means choosing what works in practice, the opposite of dreaming of changing the world=pragmatic 是务实的，和梦想改变世界正相反;realistic/Realistic=realistic means accepting things as they really are, the opposite of a plan that won't work in the real world=realistic 是现实的，和在现实中行不通的计划正相反|i · de · al · is · tic|ideal + istic|ideal + istic
      temperamental|a chef shouting one minute and laughing the next;a car that sometimes won't start;moods that change quickly|temperamental means with moods that change quickly; even-tempered means calm|temperamental 是喜怒无常的；even-tempered 是性情平和的|even-tempered=even-tempered means calm and rarely angry, the opposite of shouting one minute and laughing the next=even-tempered 是性情平和的，和一会儿吼一会儿笑正相反;sentimental=sentimental means easily moved by love or sadness, not changing moods or working only sometimes=sentimental 是多愁善感的，不是情绪多变或时好时坏|tem · per · a · men · tal|temperament + al|temperament + al
    `,
  },
});

const diplomacy = vocabularyTopic({
  id: "b2-words-diplomacy",
  title: t("Countries Together", "国家之间"),
  summary: t(
    "Diplomacy, diplomats and diplomatic answers; embassies and ambassadors; sanctions and alliances; sovereignty and territory; bilateral talks; cooperation and cooperating.",
    "外交、外交官和圆滑得体的回答；大使馆和大使；制裁和联盟；主权和领土；双边会谈；合作。",
  ),
  intro: t(
    "The **ambassador** left the **embassy** for **bilateral** talks, hoping that **diplomacy** would end the crisis. These words help you talk about how countries deal with each other, from friendly agreements to punishments.",
    "**ambassador**（大使）离开 **embassy**（大使馆）去参加 **bilateral**（双边的）会谈，希望 **diplomacy**（外交）能结束这场危机。这些词帮你谈论国家之间如何打交道，从友好协议到惩罚措施。",
  ),
  prerequisites: ["b2-words-politics"],
  words: [
    word(
      "diplomacy",
      "managing relations between countries; skill in dealing with people without upsetting them",
      "外交；交际手腕",
      "The crisis was solved through {diplomacy}: the two governments talked instead of fighting. | She handled the angry customer with great {diplomacy}, calming him without upsetting him. | International {diplomacy}, with its endless talks between governments, is slow work.",
      "democracy violence",
      "cooperation",
    ),
    word(
      "diplomat diplomats",
      "a person whose job is to represent their country in another country",
      "外交官",
      "The {diplomat} has represented her country in five foreign capitals. | Two {diplomats} were sent home after their embassy was accused of spying.|diplomas democrats | She trained as a {diplomat} so she could represent her country abroad.",
      "diploma democrat",
      "ambassador",
    ),
    word(
      "diplomatic",
      "connected with diplomacy; careful not to upset people",
      "外交的；圆滑得体的",
      "The two countries cut off {diplomatic} relations and closed their embassies. | Give a {diplomatic} answer: don't say the food was awful. | He is always {diplomatic} in meetings and never upsets anyone.",
      "democratic dramatic",
      "bilateral",
    ),
    word(
      "embassy embassies",
      "the building where an ambassador and their staff work",
      "大使馆",
      "You can get a visa at the {embassy}, where the ambassador's staff work. | Protesters gathered outside the {embassy} building. | Several countries closed their {embassies} and brought their diplomats home.|ambassadors embraces",
      "ambassador embrace",
    ),
    word(
      "ambassador ambassadors",
      "the most important diplomat sent by a country to another country",
      "大使",
      "She is the French {ambassador} to China, the top diplomat in Beijing. | The {ambassador} met the prime minister to discuss trade between their countries. | He was appointed {ambassador} to Brazil and will represent his country there.",
      "embassy commander",
      "diplomat",
    ),
    word(
      "sanction sanctions",
      "an official order that limits trade with a country, as a punishment",
      "制裁",
      "The UN placed {sanctions} on the country, stopping trade with it as punishment.|alliances sanctuaries | Economic {sanctions}, which limit trade, hurt ordinary people most.|alliances sanctuaries | The {sanctions} were lifted after the elections, and trade started again.|alliances sanctuaries",
      "alliance sanctuary",
      "alliance",
    ),
    word(
      "alliance alliances",
      "an agreement between countries or groups to work together",
      "联盟；同盟",
      "NATO is a military {alliance} of countries that promise to defend each other. | The two parties' {alliance} helped them win the election together. | The war broke old {alliances} between friendly countries.|appliances sanctions",
      "appliance sanction",
      "cooperation",
    ),
    word(
      "sovereignty",
      "the power of a country to rule itself",
      "主权",
      "The country fought to protect its {sovereignty}, its right to rule itself. | Both nations claim {sovereignty} over the islands, saying they have the right to rule them. | National {sovereignty} means that the UN cannot tell a country how to rule itself.",
      "severity society",
      "territory",
    ),
    word(
      "territory territories",
      "land that belongs to a country; an area someone thinks of as their own",
      "领土；地盘",
      "The army crossed the border into enemy {territory}. | The islands are a French {territory}, ruled from Paris.|dormitory embassy | Cats defend their {territory}, the area around their home, against other cats.",
      "dormitory sovereignty",
      "sovereignty",
    ),
    word(
      "bilateral",
      "involving two countries or groups",
      "双边的",
      "The two countries signed a {bilateral} trade agreement in which each promises to cut taxes on the other's goods. | {Bilateral} talks between just China and France will begin next week.|Multilateral Unilateral | Relations between the two neighbors improved after {bilateral} meetings.",
      "multilateral unilateral",
      "diplomatic",
    ),
    word(
      "cooperation",
      "working together to achieve something",
      "合作",
      "Thank you for your {cooperation}: we couldn't have done it without your help. | International {cooperation}, with police forces working together, is needed to fight crime. | The project is a {cooperation} between two universities that share their research.",
      "corporation competition",
      "diplomacy",
    ),
    word(
      "cooperate cooperates cooperated cooperating",
      "to work together with others to achieve something",
      "合作；配合",
      "The two countries {cooperate} on climate research, sharing all their data. | The witness refused to {cooperate} with the police and would not answer their questions. | Everyone {cooperated} and helped each other, so we finished early.|competed operated",
      "compete operate",
      "cooperation",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Embassy* and *ambassador* go together, but the *embassy* is the building and the *ambassador* is the person in charge of it. Ask whether the sentence needs a place or a person.",
        "*embassy* 和 *ambassador* 总在一起，但 *embassy* 是建筑，*ambassador* 是负责那里的人。想想句子需要的是地方还是人。",
      ),
      meaning: t(
        "*Sovereignty* is a country's power to rule itself, while *territory* is the land that it rules. Check whether the meaning talks about power or about land.",
        "*sovereignty* 是国家自主统治的权力，*territory* 是它统治的土地。看释义说的是权力还是土地。",
      ),
      spell: t(
        "*Embassy* starts with em- but *ambassador* with am-, *sovereignty* hides a silent g, and *cooperate* is co + operate.",
        "*embassy* 以 em- 开头，*ambassador* 却以 am- 开头，*sovereignty* 里藏着不发音的 g，*cooperate* 是 co + operate。",
      ),
    },
    notes: `
      diplomacy|governments talking instead of fighting;calming an angry customer without upsetting him;endless talks between governments|diplomacy is solving problems by careful talking; violence is using force|diplomacy 是外交、交际手腕；violence 是暴力|democracy=democracy is a system where people vote for their government, not careful talking to solve a crisis or calm someone=democracy 是人民投票选政府的制度，不是靠谨慎交谈化解危机或安抚别人;violence=violence is using force to hurt people, the opposite of talking instead of fighting=violence 是用武力伤人，和以谈代打正相反|di · plo · ma · cy|diploma + cy|diploma + cy
      diplomat|representing a country in five capitals;people sent home when their embassy was accused;training to represent a country abroad|a diplomat represents a country abroad; a diploma is a certificate|diplomat 是外交官；diploma 是毕业证书|diploma/diplomas=diploma is a certificate you get when you finish a course, not a person who represents a country=diploma 是毕业证书，不是代表国家的人;democrat/democrats=democrat is a person who supports democracy or a party, not someone sent abroad to work in an embassy=democrat 是民主主义者或党员，不是派驻使馆的人|dip · lo · mat|diploma + t|diploma + t
      diplomatic|relations cut off with embassies closed;an answer that doesn't call food awful;never upsetting anyone in meetings|diplomatic means careful not to upset people or connected with embassies; dramatic means exciting and emotional|diplomatic 是外交的、得体的；dramatic 是戏剧性的|democratic=democratic means connected with voting and equal rights, not relations between embassies or a careful polite answer=democratic 与投票和平等权利有关，不是使馆关系或委婉得体的回答;dramatic=dramatic means exciting and full of emotion, the opposite of careful words that never upset anyone=dramatic 是戏剧性、情绪激烈的，和小心不冒犯人正相反|dip · lo · mat · ic|diplomat + ic|diplomat + ic
      embassy|where the ambassador's staff give visas;a building with protesters outside;places closed when diplomats are brought home|an embassy is the building; an ambassador is the person who leads it|embassy 是大使馆；ambassador 是大使|ambassador/ambassadors=ambassador is the person who leads diplomats, not the building where visas are given or protesters gather=ambassador 是带领外交官的人，不是办签证或抗议者聚集的那栋楼;embrace/embraces=embrace is a hug, not a building=embrace 是拥抱，不是建筑|em · bas · sy|em- at the start and a double s|开头是 em-，双写 s
      ambassador|the top diplomat in Beijing;meeting a prime minister about trade;representing a country in Brazil|an ambassador is a person; an embassy is a building|ambassador 是大使；embassy 是大使馆|embassy=embassy is a building, not a person who meets ministers or represents a country=embassy 是建筑，不是会见总理或代表国家的人;commander=commander is an officer who leads soldiers, not the top diplomat of a country=commander 是指挥士兵的军官，不是一国的首席外交官|am · bas · sa · dor|am- at the start, a double s and -dor|开头是 am-，双写 s，结尾是 -dor
      sanction|stopping trade with a country as punishment;measures that limit trade;trade starting again when they were lifted|a sanction is a punishment that limits trade; an alliance is an agreement to work together|sanction 是制裁；alliance 是联盟|alliance/alliances=alliance is an agreement to work together, the opposite of a punishment that stops trade=alliance 是合作协议，和中断贸易的惩罚正相反;sanctuary/sanctuaries=sanctuary is a safe place, for people or animals, not a limit on trade=sanctuary 是避难所或保护区，不是贸易限制|sanc · tion|sanct + ion|sanct + ion
      alliance|countries promising to defend each other;two parties winning an election together;old ties between friendly countries|an alliance is an agreement to work together; a sanction is a punishment|alliance 是联盟；sanction 是制裁|appliance/appliances=appliance is a machine in the home, such as a fridge, not an agreement between countries or parties=appliance 是家用电器，不是国家或政党间的协议;sanction/sanctions=sanction is a punishment that limits trade, the opposite of friends working together=sanction 是限制贸易的惩罚，和朋友合作正相反|al · li · ance|ally with the y changed to i, then -ance|把 ally 的 y 改成 i，再加 -ance
      sovereignty|a country's right to rule itself;the right to rule some islands;the limit on what the UN can tell a country|sovereignty is a country's power to rule itself; territory is its land|sovereignty 是主权；territory 是领土|severity=severity is how serious or harsh something is, not a country's right to rule itself=severity 是严重或严厉的程度，不是自主统治的权利;society=society is people living together in a community, not the right of a country to rule=society 是社会，不是国家统治的权利|sov · er · eign · ty|sovereign + ty, with a silent g|sovereign + ty，g 不发音
      territory|land across the border of an enemy;islands ruled from Paris;the area around a cat's home|territory is land that someone controls; sovereignty is the power to rule it|territory 是领土、地盘；sovereignty 是主权|dormitory=dormitory is a building where students sleep, not land across a border, islands or the area a cat defends=dormitory 是学生宿舍，不是边境另一边的土地、岛屿或猫守卫的地盘;sovereignty=sovereignty is the power to rule, not an area of land you can cross into or defend=sovereignty 是统治权，不是可以进入或守卫的一片土地;embassy=embassy is a building where diplomats work, not land that belongs to a country=embassy 是外交官办公的建筑，不是属于国家的土地|ter · ri · to · ry|a double r, then -tory|双写 r，结尾是 -tory
      bilateral|an agreement in which each of two countries cuts taxes;talks between just China and France;meetings between two neighbors|bilateral means between two sides; multilateral means between many|bilateral 是双边的；multilateral 是多边的|multilateral/Multilateral=multilateral means involving many countries, not just two=multilateral 是多边的，涉及多个国家，不是只有两个;unilateral/Unilateral=unilateral means done by one side alone, not agreed between two=unilateral 是单方面的，不是双方商定的|bi · lat · er · al|bi + lateral|bi + lateral
      cooperation|help without which we couldn't have done it;police forces working together;universities sharing their research|cooperation is working together; competition is trying to beat each other|cooperation 是合作；competition 是竞争|corporation=corporation is a large company, not the act of working together or helping=corporation 是大公司，不是合作或帮助的行为;competition=competition is trying to beat others, the opposite of helping, working together or sharing research=competition 是竞争，和帮助、协作、分享研究正相反|co · op · er · a · tion|co + operation|co + operation
      cooperate|countries sharing all their climate data;a witness answering police questions;everyone helping each other to finish early|to cooperate is to work together; to compete is to try to beat others|cooperate 是合作；compete 是竞争|compete/competed=compete means to try to beat others, the opposite of sharing data, answering questions or helping each other=compete 是竞争，和分享数据、配合回答、互相帮助正相反;operate/operated=operate means to work as a machine does, or to do surgery, not to work together with others=operate 是运转或做手术，不是与他人合作|co · op · er · ate|co + operate|co + operate
    `,
  },
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
  const check = right.startsWith("What ")
    ? t(
        "**Check.** Confirm the sentence starts with *What* (not *That*), has no extra *it* before *is/was*, and places the focus after *is/was*.",
        "**检验。** 确认句子以 *What*（不是 *That*）开头，*is/was* 前没有多余的 *it*，且被强调部分放在 *is/was* 后面。",
      )
    : t(
        "**Check.** Confirm *It is/was* + focus + *that* (never *what*), with no extra pronoun repeating the focus in the rest of the clause.",
        "**检验。** 确认结构为 *It is/was* + 被强调部分 + *that*（绝不用 *what*），且后面不再用代词重复该成分。",
      );
  return t(`${rule.en}: ${right}\n\n${check.en}`, `${rule["zh-CN"]}：${right}\n\n${check["zh-CN"]}`);
};

/** whyNotItCleft explains what in an it-cleft, or a pronoun that repeats the focus. */
const whyNotItCleft = (_wrong: string, _right: string, shown: string, position: number): Text =>
  position === 0
    ? t(
        "*what* cannot link the focus of an *It* cleft to the rest of the sentence; use *that* (or *who/which*).",
        "*It* 分裂句里不能用 *what* 连接被强调部分和其余部分，应使用 *that*（或 *who/which*）。",
      )
    : t(
        `The clause after *that* repeats *${focusOf(shown)}* with an extra pronoun, even though the focus already fills that slot.`,
        `*that* 后面又用代词重复了 *${focusOf(shown)}*，但被强调部分已经占住了这个位置。`,
      );

/** whyNotWhatCleft explains That instead of What, or it before the verb of a what-cleft. */
const whyNotWhatCleft = (_wrong: string, _right: string, _shown: string, position: number): Text =>
  position === 0
    ? t(
        "A cleft clause that highlights the thing in focus must start with *What*, not *That*.",
        "用来突出被强调事物的从句必须以 *What* 开头，不能用 *That*。",
      )
    : t(
        "The *what*-clause already serves as the subject of *is/was*, so adding *it* before the verb creates a double subject.",
        "*what* 从句本身就是 *is/was* 的主语，动词前再加 *it* 会造成主语重复。",
      );

const cleftSentences: TopicDef = {
  id: "cleft-sentences",
  title: t("It Was the Food That Surprised Me", "It is... that... 和 What... is...（分裂句）"),
  summary: t(
    "It was the food that surprised me most. What I miss is the language. A cleft sentence splits a plain sentence in two to put one part in focus.",
    "It was the food that surprised me most. What I miss is the language。分裂句把一个普通句子分成两部分，突出其中一部分。",
  ),
  intro: t(
    "A plain sentence like *Maya designed the poster* treats every part evenly. Split it into *It was Maya who designed the poster* or *What Maya designed was the poster*, and a spotlight swings straight onto one chosen detail.",
    "普通句子 *Maya designed the poster* 语气平铺直叙；拆成分裂句 *It was Maya who designed the poster* 或 *What Maya designed was the poster*，聚光灯就会立刻打到你想强调的那一项上。",
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
        "To put one part of a sentence in focus, put it after *It is* or *It was* and the rest after *that*:\n\n- *The food surprised me most.* → *It was **the food** that surprised me most.*\n- *I miss the language most.* → *It is **the language** that I miss most.*\n\nThe joining word is *that* (or *who* for a person, *which* for a thing).\n\n> **Watch out.** Never link an *It*-cleft with *what* (*It was the food what...* is wrong), and never repeat the focus with a pronoun after *that* (*It is the language that I miss it* is wrong).",
        "要突出句子的某一部分，就把它放在 *It is* 或 *It was* 后面，其余部分放在 *that* 后面：\n\n- *The food surprised me most.* → *It was **the food** that surprised me most.*\n- *I miss the language most.* → *It is **the language** that I miss most.*\n\n连接词用 *that*（指人也可用 *who*，指物也可用 *which*）。中文用“正是……”“就是……才……”来强调，英语则用 *It was ... that ...* 这个固定框架。\n\n> **注意。** *It* 分裂句绝不能用 *what* 连接（*It was the food what...* 是错的），也绝不能在 *that* 后面再用代词重复被强调的成分（*It is the language that I miss it* 是错的）。",
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
        "Another way to focus on something is to begin with a *what*-clause and put the focus after *is* or *was*:\n\n- *I need a long holiday.* → *What I need **is** a long holiday.*\n- *The ending annoyed me.* → *What annoyed me **was** the ending.*\n\n> **Watch out.** Start with ***What*** (never *That*), and do not insert *it* before *is/was* (*What I need it is a holiday* is wrong because the *what*-clause is already the subject).",
        "另一种强调方式是用 *what* 从句开头，把被强调的部分放在 *is* 或 *was* 后面：\n\n- *I need a long holiday.* → *What I need **is** a long holiday.*\n- *The ending annoyed me.* → *What annoyed me **was** the ending.*\n\n这和中文“我需要的是一个长假”结构很像：“我需要的”对应 *What I need*，“是”对应 *is*。\n\n> **注意。** 句首必须用 ***What***（不能用 *That*），且 *is/was* 前不能多加 *it*（*What I need it is a holiday* 是错的，因为 *what* 从句本身就是主语）。",
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
        "Rewrite the sentence to put the words in brackets in focus, beginning as the note says: *The food surprised me most. (focus: the food; begin with It)* becomes *It was the food that surprised me most.* *I need a long holiday. (focus: a long holiday; begin with What)* becomes *What I need is a long holiday.*\n\nKeep the tense of the plain sentence: *is* for the present, *was* for the past. After *It*, you may join with *who* for a person or *which* for a thing, and leave out *that* when the focus is the object.\n\n> **Watch out.** Match *is* or *was* to the original sentence's tense, and double-check that you did not leave a stray pronoun behind.",
        "改写句子，突出括号里的部分，并按提示开头：*The food surprised me most. (focus: the food; begin with It)* 写成 *It was the food that surprised me most.* *I need a long holiday. (focus: a long holiday; begin with What)* 写成 *What I need is a long holiday.*\n\n保持原句的时态：现在用 *is*，过去用 *was*。用 *It* 开头时，指人可以用 *who*，指物可以用 *which*；被强调的是宾语时可以省略 *that*。\n\n> **注意。** *is* 和 *was* 要与原句时态一致，写完后再检查有没有多留一个重复指代的代词。",
      ),
      typedGenerator(
        "sentence-pattern",
        t("Rewrite the sentence to put the words in focus.", "改写句子，突出所给的部分。"),
        cleftTyped,
        cleftWhy,
        cleftSentencesWriteNot,
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
  intro: t(
    "Pitching a weekend repair café to a town council takes more than enthusiasm: a clear proposal states the gap it fills, outlines the plan, explains how it would run using *would*, and shows why the benefits justify the cost.",
    "向市政委员会提议举办周末社区维修角，光靠热情不够：好的提案会点明现实缺口、简述方案、用 *would* 说清如何落地，并说明好处为何值得投入。",
  ),
  prerequisites: ["writing-a-report"],
  encompasses: [{ topic: "writing-a-report", weight: 0.4 }],
  criteria: ["b2-proposal-need", "b2-proposal-headings", "b2-proposal-plan", "b2-proposal-benefits", "b2-neutral-register"],
  point: {
    id: "proposal",
    title: t("Need, plan, benefits", "需求、方案、益处"),
    explanation: t(
      "A proposal asks a reader, such as a council, a head teacher or a manager, to accept a plan. Like a report, it has headings and a neutral tone, but it looks forward and tries to persuade. Plan four sections:\n\n1. **Introduction**: say what the proposal is for and why it is needed, with a fact if you can: *The purpose of this proposal is to... At present, ...*\n2. **The proposal**: say in one or two sentences what you suggest: *I propose a weekly language café...*\n3. **How it would work**: give practical details: who would do what, when, where and what it would cost. Use *would*: *Volunteers would meet...*\n4. **Why it should be chosen**: give the benefits and end with a confident sentence: *I therefore recommend that this proposal be accepted.*\n\nA report says what **is**; a proposal says what **would** happen. Keep it formal, with no contractions.\n\n> **Watch out.** Do not write a proposal like a report about the past—use *would* for the proposed plan, include concrete practical details (who, when, cost), and keep clear headings.",
      "提案请读者（例如市议会、校长或经理）接受一个计划。它和报告一样有小标题、语气中立，但它着眼于未来，并且要说服读者。安排四个部分：\n\n1. **引言（Introduction）**：说明提案的目的和为什么需要它，最好有一个事实：*The purpose of this proposal is to... At present, ...*\n2. **提议（The proposal）**：用一两句话说明你的建议：*I propose a weekly language café...*\n3. **如何实施（How it would work）**：给出具体细节：谁做什么、什么时候、在哪里、花多少钱。用 *would*：*Volunteers would meet...*\n4. **为什么应该采纳（Why it should be chosen）**：说明益处，并用一句有把握的话结尾：*I therefore recommend that this proposal be accepted.*\n\n报告说的是现在**是**什么样；提案说的是将来**会**怎样。保持正式，不用缩写。中文申请书常先讲很多背景和决心，英语提案则要尽快说明要做什么、怎样做、有什么好处。\n\n> **注意。** 不要把提案写成回顾过去的报告——描述拟议方案时用 *would*，给出具体的执行细节（人员、时间、预算），并用小标题分清层次。",
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
