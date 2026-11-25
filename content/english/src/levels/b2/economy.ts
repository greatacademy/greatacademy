// B2, unit 2: Work and the Economy. The economy, companies, management, employment, finance, working conditions,
// production and trade, skills, success and failure, words of time and sequence, and quantity; the passive with modals
// and perfect forms, and have something done; writing a report.

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator, type WritingItem } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { fill, judgedTopic } from "../a2/kit.ts";
import { everyTriple, interleave, vocabularyTopic, word } from "../words.ts";

const economy = vocabularyTopic({
  id: "b2-words-economy",
  title: t("The Economy", "经济"),
  summary: t(
    "Economic recession and inflation; exports and imports; investment, investors and shareholders; booms and deficits; wealthy countries and prosperity.",
    "经济衰退和通货膨胀；出口和进口；投资、投资者和股东；繁荣期和赤字；富裕的国家和繁荣。",
  ),
  intro: t(
    "In a **boom**, **investors** are happy and **prosperity** spreads, but a **recession** brings closed shops and lost jobs. These words help you talk about how a country's economy grows, shrinks and trades with the world.",
    "在 **boom**（繁荣期），**investors**（投资者）很开心，**prosperity**（繁荣）四处扩散；而 **recession**（经济衰退）带来关门的商店和失去的工作。这些词帮你谈论一个国家的经济如何增长、萎缩以及与世界贸易。",
  ),
  prerequisites: ["b1-words-business"],
  words: [
    word(
      "economic",
      "about the economy, money, trade and industry",
      "经济的",
      "The country is facing serious {economic} problems: prices are rising and jobs are hard to find. | {Economic} growth slowed last year as factories made less and trade fell. | The {economic} crisis began when the banks failed, and it cost millions of jobs.",
      "economical ecological",
    ),
    word(
      "recession recessions",
      "a time when the economy of a country is doing badly and many people lose their jobs",
      "经济衰退",
      "Many shops closed during the {recession}, when people had little money to spend. | The economy has shrunk for six months, so it is officially in {recession}. | Experts fear a {recession} next year, with factories closing and jobs lost.",
      "prosperity recovery",
    ),
    word(
      "inflation",
      "a general rise in prices over time",
      "通货膨胀",
      "{Inflation} means that prices keep rising. | {Inflation} reached 10 percent last year, so a loaf of bread cost much more. | High {inflation} makes our savings worth less.",
      "deflation recession",
    ),
    word(
      "export exports exported exporting",
      "to sell goods to another country; something sold to another country",
      "出口；出口商品",
      "China {exports} electronics, sending them to many countries.|imports consumes | Coffee, grown here and sold abroad, is the country's main {export}. | The company {exported} goods worth two million dollars, selling them to buyers abroad.|imported consumed",
      "import expert",
    ),
    word(
      "import imports imported importing",
      "to buy goods from another country; something bought from another country",
      "进口；进口商品",
      "Japan has little oil of its own, so it {imports} most of its oil from abroad.|exports produces | The country grows little food, so it must {import} most of what it eats. | Bananas cannot grow in Britain, so every banana sold there has been {imported}.|exported produced",
      "export produce",
    ),
    word(
      "investment investments",
      "money put into something to make a profit; something worth buying or doing for the future",
      "投资",
      "Buying a flat can be a good {investment}, because flats usually rise in value. | The region needs more foreign {investment} to build factories and create jobs. | Education is an {investment} in the future: what you spend now pays back later.",
      "investigation inflation",
    ),
    word(
      "investor investors",
      "a person who puts money into a business to make a profit",
      "投资者",
      "The company's {investors} lost the money they had put into it when its shares fell.|inventors investigators | She has already invented the machine, and now she is looking for an {investor} to pay for making it. | Foreign {investors} are buying land here, hoping to sell it later for a profit.|inventors investigators",
      "inventor investigator",
      "shareholder",
    ),
    word(
      "shareholder shareholders",
      "a person who owns part of a company",
      "股东",
      "The {shareholders} voted for the new boss at the company's yearly meeting.|shopkeepers householders | Every {shareholder} received part of the profits, depending on how many shares they owned. | She owns 30 percent of the company, so she is its biggest {shareholder}.",
      "shopkeeper householder",
      "investor",
    ),
    word(
      "boom booms",
      "a time when business grows quickly and there is a lot of trade",
      "繁荣期；激增",
      "There was a building {boom} in the 1990s, with new towers going up everywhere. | The tourist {boom} brought jobs and money to the island. | Online shopping is having a {boom}: sales have doubled in a year.",
      "slump bloom",
    ),
    word(
      "deficit deficits",
      "the amount by which money spent is more than money received",
      "赤字；逆差",
      "The government has a large budget {deficit}: it spends more than it collects in tax. | The country has a trade {deficit} because it imports more than it exports. | Cutting spending will reduce the {deficit} and the money the government must borrow.",
      "surplus defect",
    ),
    word(
      "wealthy",
      "having a lot of money; rich",
      "富有的",
      "She comes from a {wealthy} family that owns three houses and a yacht. | The {wealthy} should pay more tax because they earn the most. | It is one of the most {wealthy} areas of the city, full of big, expensive houses.",
      "healthy poor",
    ),
    word(
      "prosperity",
      "the state of being successful and having a lot of money",
      "繁荣；兴旺",
      "The new factory brought {prosperity} to the town: people had good jobs and more money. | Years of peace led to great {prosperity}, and the country grew rich. | Hard work is the key to {prosperity}, to a life with enough money.",
      "poverty property",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Economic* is about the economy of a country as a whole, while *economical* means using little money or fuel. Ask whether the sentence is about a country's trade and jobs or about saving money.",
        "*economic* 指一个国家整体经济方面的，*economical* 指省钱、省油的。想想句子说的是国家的贸易和就业，还是节省开支。",
      ),
      meaning: t(
        "A *recession* is a time when the economy shrinks, while *inflation* is a rise in prices. Check whether the meaning is about less business or about things costing more.",
        "*recession* 是经济萎缩的时期，*inflation* 是物价上涨。看释义说的是生意变少，还是东西变贵。",
      ),
      spell: t(
        "*Recession* has a double s, *deficit* ends in -cit, and *prosperity* has an e before the r but no a.",
        "*recession* 有双 s，*deficit* 以 -cit 结尾，*prosperity* 的 r 前是 e，没有 a。",
      ),
    },
    notes: `
      economic|prices rising and jobs hard to find;growth that slowed as factories made less;a crisis that began when banks failed|economic is about a country's economy; economical means using little money|economic 是经济的；economical 是节省的|economical=economical means cheap to run or using little money, not about a country's trade, factories and jobs=economical 是省钱的、经济实惠的，不是关于国家的贸易、工厂和就业;ecological=ecological is about nature and the environment, not about prices, factories and banks=ecological 是生态的，不是关于物价、工厂和银行|ec · o · nom · ic|economy with the y changed to -ic|把 economy 的 y 改成 -ic
      recession|shops closing when people had little money;an economy shrinking for six months;factories closing and jobs lost|a recession is when the economy shrinks; a recovery is when it grows again|recession 是经济衰退；recovery 是复苏|prosperity=prosperity is success and wealth, the opposite of shops closing and the economy shrinking=prosperity 是繁荣，和商店倒闭、经济萎缩正相反;recovery=recovery is a time when the economy grows again, not when it shrinks and jobs are lost=recovery 是经济复苏，不是萎缩和失业的时候|re · ces · sion|re + cess + ion, with a double s|re + cess + ion，双写 s
      inflation|prices that keep rising;bread costing much more;savings worth less|inflation is prices rising; deflation is prices falling|inflation 是通货膨胀；deflation 是通货紧缩|deflation=deflation is a fall in prices, the opposite of prices rising and savings losing value=deflation 是物价下跌，和物价上涨、存款贬值正相反;recession=recession is a time when the economy shrinks, not a rise in prices, and we do not say high recession=recession 是经济萎缩，不是物价上涨，也不说 high recession|in · fla · tion|inflate with the e dropped, then -ion|inflate 去掉 e，再加 -ion
      export|electronics sent to many countries;coffee grown here and sold abroad;goods sold to buyers abroad|to export is to sell goods to another country; to import is to buy them from another country|export 是出口；import 是进口|import/imports/imported=import means to buy goods from another country, the opposite of sending and selling them abroad=import 是进口，和把货物卖到国外正相反;consume/consumes/consumed=consume means to use goods up yourself, not to send them to buyers abroad=consume 是自己消耗，不是卖给国外买家;expert=an expert is a person with special knowledge, and coffee is not a person=expert 是专家，咖啡不是人|ex · port|ex + port, like *import* with ex-|ex + port，和 *import* 只差前缀
      import|oil from abroad for a country with little;food for a country that grows little;bananas that cannot grow in Britain|to import is to buy goods from another country; to export is to sell them there|import 是进口；export 是出口|export/exports/exported=export means to sell goods to another country, which a country cannot do with what it lacks=export 是出口，一个国家无法出口自己缺少的东西;produce/produces/produced=produce means to make or grow something yourself, the opposite of having little oil or growing little food=produce 是自己生产，和缺油、缺粮正相反|im · port|im + port, with m before p|im + port，p 前是 m
      investment|a flat that rises in value;foreign money to build factories;spending now that pays back later|an investment is money put in to gain later; an investigation is a search for the facts|investment 是投资；investigation 是调查|investigation=an investigation is a careful search for facts, not money put into flats, factories or education=investigation 是调查，不是投入房子、工厂或教育的钱;inflation=inflation is a rise in prices, not something you buy or spend on to gain later=inflation 是物价上涨，不是为将来收益而花的钱|in · vest · ment|invest + ment|invest + ment
      investor|money put into a company and lost;someone to pay for making a machine;land bought to sell later for a profit|an investor puts money in to make a profit; an inventor creates new things|investor 是投资者；inventor 是发明者|inventor/inventors=an inventor creates new machines or ideas, not someone who puts money in to make a profit=inventor 是发明家，不是投钱谋利的人;investigator/investigators=an investigator searches for facts about a crime or problem, not someone who puts money in=investigator 是调查员，不是投钱的人|in · ves · tor|invest + or, not -er|invest + or，不是 -er
      shareholder|a vote at the company's yearly meeting;part of the profits for the shares owned;thirty percent of a company|a shareholder owns part of a company; a shopkeeper runs a shop|shareholder 是股东；shopkeeper 是店主|shopkeeper/shopkeepers=a shopkeeper runs a small shop, not someone who owns part of a company and its profits=shopkeeper 是店主，不是拥有公司股份和利润的人;householder/householders=a householder owns or rents a house, not part of a company=householder 是户主，不是公司股份的所有者|share · hold · er|share + holder, one word|share + holder，连写成一个词
      boom|new towers going up everywhere;jobs and money for an island;sales doubling in a year|a boom is a time of fast growth; a slump is a sudden fall|boom 是繁荣期；slump 是暴跌、萧条|slump=a slump is a sudden fall in business, the opposite of new towers, new jobs and doubled sales=slump 是萧条，和新楼、新工作、销量翻倍正相反;bloom=bloom is what flowers do when they open, not fast growth in business=bloom 是花开，不是生意的快速增长|boom|b + double o + m, not *bloom*|b + 双 o + m，别写成 *bloom*
      deficit|spending more than is collected in tax;importing more than exporting;money the government must borrow|a deficit is spending more than you receive; a surplus is having money left over|deficit 是赤字；surplus 是盈余|surplus=a surplus is money left over, the opposite of spending more than you collect or import more than you export=surplus 是盈余，和入不敷出、进口多于出口正相反;defect=a defect is a fault in a product, not money spent beyond what comes in=defect 是缺陷，不是超支的钱|def · i · cit|defi + cit, ending in -cit|defi + cit，以 -cit 结尾
      wealthy|a family with three houses and a yacht;people who earn the most;an area full of big, expensive houses|wealthy means having a lot of money; poor means having very little|wealthy 是富有的；poor 是贫穷的|healthy=healthy means well and not ill, not having a lot of money or big houses=healthy 是健康的，不是有钱或有大房子;poor=poor means having very little money, the opposite of yachts, big houses and earning the most=poor 是贫穷的，和游艇、大房子、收入最高正相反|wealth · y|wealth + y|wealth + y
      prosperity|good jobs and more money in a town;a country that grew rich;a life with enough money|prosperity is being successful and rich; poverty is being poor|prosperity 是繁荣；poverty 是贫困|poverty=poverty is being very poor, the opposite of good jobs, more money and growing rich=poverty 是贫困，和好工作、更多钱、变富正相反;property=property is a building, land or something you own, not a state of success and wealth=property 是财产或房产，不是繁荣兴旺的状态|pros · per · i · ty|prosper + ity|prosper + ity
    `,
  },
});

const companies = vocabularyTopic({
  id: "b2-words-companies",
  title: t("Companies", "公司"),
  summary: t(
    "Corporations, firms and enterprises; startups and franchises; mergers and partnerships; competitors, competition and competing; monopolies and multinationals.",
    "大公司、公司和企业；初创公司和特许经营店；合并和合伙；竞争对手、竞争和比赛；垄断和跨国公司。",
  ),
  intro: t(
    "A tiny **startup** grew fast, beat every **competitor** and finally agreed a **merger** with a giant **corporation**. These words help you talk about the kinds of companies there are and how they fight or work together.",
    "一家小小的 **startup**（初创公司）飞速成长，打败了所有 **competitor**（竞争对手），最后和一家大 **corporation**（大公司）达成 **merger**（合并）。这些词帮你谈论各种公司，以及它们如何竞争或合作。",
  ),
  prerequisites: ["b1-words-business"],
  words: [
    word(
      "corporation corporations",
      "a large company or a group of companies",
      "大公司；集团",
      "She works for a large American {corporation} with offices in thirty states. | The {corporation} pays too little tax on its huge profits. | The {corporation} employs 50,000 people around the world.",
      "cooperation corruption",
      "firm enterprise multinational",
    ),
    word(
      "firm firms",
      "a company or a business",
      "公司；商行",
      "He works as a lawyer for a law {firm} in Shanghai. | The {firm}, which sells furniture, was started by two brothers. | Small {firms}, such as shops and design studios, find it hard to borrow money.|farms forms",
      "farm form",
      "corporation enterprise",
    ),
    word(
      "enterprise enterprises",
      "a business or company; a new project, especially a difficult one",
      "企业；事业",
      "The government supports small {enterprises} with cheap loans to grow their business.|entertainments entrances | Her parents built the café into a successful {enterprise} that now has five branches. | State {enterprises} employ millions of workers in factories and mines.|entertainments entrances",
      "entertainment entrance",
      "corporation firm",
    ),
    word(
      "startup startups",
      "a new, small company, often in technology",
      "初创公司",
      "He left a tech giant to work for a {startup} that is only a year old and has five staff. | She raised money from friends to launch her own {startup}, with just two staff. | The {startup} began in a garage with three people and no customers.",
      "corporation giant",
    ),
    word(
      "franchise franchises",
      "the right to sell a company's products under its name; a shop run in this way",
      "特许经营权；加盟店",
      "He owns a {franchise} of a famous coffee chain, paying the company to use its name. | The pizza company sells {franchises} to local owners, who use its name and recipes.|finances monopolies | Opening a {franchise} with a known brand is less risky than starting alone.",
      "finance monopoly",
    ),
    word(
      "merger mergers",
      "the joining of two or more companies into one",
      "合并",
      "The {merger} of the two banks created one giant bank. | After the {merger}, when the two companies became one, many workers lost their jobs. | The two airlines announced a {merger}: they will join to form one company.",
      "breakup murder",
    ),
    word(
      "competitor competitors",
      "a person or company that tries to beat others, in business or in a game",
      "竞争对手；参赛者",
      "Our main {competitor} has cut its prices to win our customers. | She beat all the other {competitors} in the race.|partners composers | The company bought one of its {competitors} so that it had fewer rivals.|partners composers",
      "partner composer",
    ),
    word(
      "competition competitions",
      "trying to be more successful than others; a contest",
      "竞争；比赛",
      "There is strong {competition} between the two shops, which both want the same customers. | {Competition} between sellers, each trying to win customers, keeps prices low. | She won first prize in a singing {competition}.",
      "cooperation completion",
    ),
    word(
      "compete competes competed competing",
      "to try to be more successful than others",
      "竞争；参赛",
      "Small shops can't {compete} with big supermarkets: they can't beat their low prices. | Twenty teams will {compete} for the cup, each hoping to win. | The two companies are {competing} for customers, each trying to offer lower prices.|cooperating combining",
      "cooperate combine",
    ),
    word(
      "monopoly monopolies",
      "complete control of a market by one company, with no competition",
      "垄断",
      "The company has a {monopoly} on train travel: no other firm may run trains. | When one company is the only seller, it has a {monopoly}. | The state ended its {monopoly} on electricity, letting other companies sell it too.",
      "competition monotony",
    ),
    word(
      "partnership partnerships",
      "working together with another person or organization; a business owned by two or more people",
      "合伙；合作关系",
      "The two firms worked in {partnership} on the project, sharing the costs. | The school's {partnership} with a local museum lets pupils have classes there. | The business {partnership} between the two sisters, who share the shop, was a success.",
      "rivalry ownership",
    ),
    word(
      "multinational multinationals",
      "working in many countries; a large company that does this",
      "跨国的；跨国公司",
      "She works for a {multinational} company with offices in forty countries. | Most {multinational} firms pay tax in whichever of their many countries it is lowest. | The {multinational} giant closed its factory in our town and moved production to Asia.",
      "multicultural local",
      "corporation",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Competition* is the contest or the trying to win, while a *competitor* is the person or company taking part. Ask whether the gap needs the rivalry itself or one of the rivals.",
        "*competition* 指竞争或比赛本身，*competitor* 指参与竞争的人或公司。想想空格需要的是竞争本身，还是其中一个对手。",
      ),
      meaning: t(
        "A *monopoly* means one company controls a whole market, while a *partnership* means two sides work together. Check whether the meaning is about one in control or two sharing.",
        "*monopoly* 是一家公司控制整个市场，*partnership* 是双方合作。看释义说的是一家独占，还是两方共享。",
      ),
      spell: t(
        "*Enterprise* ends in -prise, not -prize, *franchise* ends in -chise, and *startup* is written as one word.",
        "*enterprise* 以 -prise 结尾，不是 -prize，*franchise* 以 -chise 结尾，*startup* 连写成一个词。",
      ),
    },
    notes: `
      corporation|a large company with offices in thirty states;a company paying too little tax on huge profits;50,000 people employed around the world|a corporation is a large company; cooperation is working together|corporation 是大公司；cooperation 是合作|cooperation=cooperation is working together, not a company that has offices, profits and staff=cooperation 是合作，不是有办公室、利润和员工的公司;corruption=corruption is dishonest behavior by people in power, not a company that employs people=corruption 是腐败，不是雇用员工的公司|cor · po · ra · tion|corpor + ation, with po not op|corpor + ation，是 po 不是 op
      firm|a lawyer at a law firm;a business that sells furniture;shops and design studios that borrow money|a firm is a company; a farm is land for crops and animals|firm 是公司；farm 是农场|farm/farms=a farm grows crops or keeps animals, not a law business, a furniture seller or a design studio=farm 是农场，不是律所、家具商或设计工作室;form/forms=a form is a paper you fill in or a shape, not a business=form 是表格或形状，不是公司|firm|f + irm, with i not a|f + irm，是 i 不是 a
      enterprise|small businesses helped to grow with loans;a café with five branches;state businesses with factories and mines|an enterprise is a business; entertainment is fun such as films and shows|enterprise 是企业；entertainment 是娱乐|entertainment/entertainments=entertainment is films, music and shows, not a business with loans, branches or factories=entertainment 是娱乐，不是有贷款、分店或工厂的企业;entrance/entrances=an entrance is a door or way in, not a business=entrance 是入口，不是企业|en · ter · prise|enter + prise, ending in -prise, not -prize|enter + prise，以 -prise 结尾，不是 -prize
      startup|a company only a year old with five staff;a new company with just two staff;three people in a garage with no customers|a startup is a new, small company; a corporation is a large, established one|startup 是初创公司；corporation 是大公司|corporation=a corporation is a large company, the opposite of one with two or five staff in a garage=corporation 是大公司，和只有几个员工、在车库起步正相反;giant=a giant is a huge company, the opposite of a tiny new one with no customers=giant 是巨头公司，和没有客户的小新公司正相反|start · up|start + up, one word|start + up，连写成一个词
      franchise|paying a coffee chain to use its name;local owners using a pizza name and recipes;opening a shop with a known brand|a franchise is the right to sell under a company's name; a monopoly is complete control of a market|franchise 是特许经营权；monopoly 是垄断|finance/finances=finance is money and how it is managed, not a shop run under another company's name=finance 是财务，不是使用他人品牌经营的店;monopoly/monopolies=a monopoly is one company controlling a whole market, not a shop bought from a chain or sold to local owners=monopoly 是一家独占市场，不是从连锁品牌买来或卖给本地店主的门店|fran · chise|fran + chise, ending in -chise|fran + chise，以 -chise 结尾
      merger|two banks becoming one giant bank;two companies becoming one;two airlines joining to form one company|a merger joins companies into one; a breakup splits one into parts|merger 是合并；breakup 是拆分|breakup=a breakup splits one company into parts, the opposite of two becoming one=breakup 是拆分，和二合一正相反;murder=a murder is the crime of killing someone, not the joining of companies=murder 是谋杀，不是公司合并|mer · ger|merge + r|merge + r
      competitor|a rival cutting prices to win customers;the other runners in a race;a company bought to have fewer rivals|a competitor tries to beat you; a partner works with you|competitor 是竞争对手；partner 是合作伙伴|partner/partners=a partner works with you, the opposite of a rival who tries to win your customers or a race=partner 是合作伙伴，和抢客户、比赛的对手正相反;composer/composers=a composer writes music, not a rival business or runner=composer 是作曲家，不是竞争对手|com · pet · i · tor|compet + itor, ending in -or|compet + itor，以 -or 结尾
      competition|two shops wanting the same customers;sellers each trying to win customers;a singing contest with a first prize|competition is trying to beat others; cooperation is working together|competition 是竞争；cooperation 是合作|cooperation=cooperation is working together, the opposite of each trying to win the same customers or a prize=cooperation 是合作，和争夺客户或奖项正相反;completion=completion is the finishing of something, not a contest or the trying to win=completion 是完成，不是竞争或比赛|com · pe · ti · tion|compet + ition, with a single t each time|compet + ition，每处只有一个 t
      compete|small shops unable to beat low prices;twenty teams each hoping to win a cup;two companies each offering lower prices|to compete is to try to beat others; to cooperate is to work together|compete 是竞争；cooperate 是合作|cooperate/cooperating=cooperate means to work together, the opposite of trying to beat prices or win a cup=cooperate 是合作，和压价、争夺奖杯正相反;combine/combining=combine means to join together into one, not to try to beat each other=combine 是结合，不是互相较量|com · pete|com + pete, ending in -ete|com + pete，以 -ete 结尾
      monopoly|train travel no other firm may run;the only seller in a market;electricity other companies may now sell|a monopoly is one company in control; competition is many trying to win|monopoly 是垄断；competition 是竞争|competition=competition means many sellers trying to win, the opposite of only one seller or no other firm allowed=competition 是竞争，和只有一家卖家、别家不准经营正相反;monotony=monotony is boring sameness, not control of a market=monotony 是单调乏味，不是控制市场|mo · nop · o · ly|mono + poly|mono + poly
      partnership|two firms sharing the costs of a project;a school working with a museum;two sisters who share a shop|a partnership is working together; a rivalry is competing against each other|partnership 是合作关系；rivalry 是竞争对立|rivalry=a rivalry is competing against each other, the opposite of sharing costs, classes or a shop=rivalry 是对立竞争，和分担费用、共享课堂或店铺正相反;ownership=ownership is owning something yourself, not two sides working together=ownership 是所有权，不是双方合作|part · ner · ship|partner + ship|partner + ship
      multinational|offices in forty countries;firms with many countries to pay tax in;a factory moved from our town to Asia|multinational means working in many countries; local means in one place only|multinational 是跨国的；local 是本地的|multicultural=multicultural means having people of many cultures, not having offices or factories in many countries=multicultural 是多元文化的，不是在多国设办公室或工厂;local=local means in one place or area only, the opposite of forty countries or moving production to Asia=local 是本地的，和四十个国家、把生产转到亚洲正相反|mul · ti · na · tion · al|multi + national|multi + national
    `,
  },
});

const management = vocabularyTopic({
  id: "b2-words-management",
  title: t("Management", "管理"),
  summary: t(
    "Strategies, objectives and targets; priorities and decisions; delegating, supervising and coordinating; negotiating and negotiations; implementing and evaluating.",
    "战略、目标和指标；优先事项和决定；委派、监督和协调；谈判；实施和评估。",
  ),
  intro: t(
    "The manager set a clear **objective**, chose a **strategy** to reach it and learned to **delegate** the smaller tasks to her team. These words help you talk about planning work, making choices and leading people.",
    "经理定下清晰的 **objective**（目标），选了实现它的 **strategy**（战略），还学会把小任务 **delegate**（委派）给团队。这些词帮你谈论规划工作、做决定和带领团队。",
  ),
  prerequisites: ["b1-words-workplace"],
  words: [
    word(
      "strategy strategies",
      "a plan for reaching a goal, often over a long time",
      "战略；策略",
      "The company needs a new marketing {strategy} to decide how it will win more customers. | Our {strategy} is to sell more online and close some shops. | What's your {strategy} for winning the game: attack or defend?",
      "tragedy budget",
    ),
    word(
      "objective objectives",
      "something that you are trying to achieve",
      "目标",
      "The main {objective} of the course is to improve your writing. | We achieved all our {objectives} this year.|objections obstacles | The {objective} is to cut costs by ten percent.",
      "objection obstacle",
      "target",
    ),
    word(
      "target targets",
      "a result that you try to reach; a thing that you aim at",
      "目标；靶子",
      "We met our sales {target} for the year, selling the 5,000 cars we aimed for. | The {target} is to plant a million trees by 2030. | The arrow hit the {target} in the very center.",
      "market margin",
      "objective",
    ),
    word(
      "priority priorities",
      "something that is more important than other things and must be dealt with first",
      "优先事项",
      "My family is my top {priority}: nothing matters more to me. | Safety must be our first {priority}. | Decide which task is your {priority} and do it first.",
      "majority privacy",
    ),
    word(
      "decision decisions",
      "a choice that you make after thinking",
      "决定",
      "It was a hard {decision} to leave my job, and I thought about it for weeks. | Who made the {decision} to close the school? | We need a {decision} by Friday: yes or no.",
      "division precision",
    ),
    word(
      "delegate delegates delegated delegating",
      "to give part of your work to someone else",
      "委派；授权",
      "A good manager knows how to {delegate} tasks to her team instead of doing them all herself. | She {delegated} the task to her assistant because she was too busy.|dedicated relegated | You can't do everything yourself: learn to {delegate} some jobs to your staff.",
      "dedicate relegate",
    ),
    word(
      "supervise supervises supervised supervising",
      "to watch over people or work to make sure it is done correctly",
      "监督；管理",
      "Teachers {supervise} the children at lunchtime, watching that nobody gets hurt. | She {supervises} a team of ten, checking their work every day.|surprises survives | The work was {supervised} by an engineer, who checked every step.|surprised survived",
      "surprise survive",
    ),
    word(
      "coordinate coordinates coordinated coordinating",
      "to organize the different parts of an activity or the people in it so that they work well together",
      "协调",
      "She {coordinates} the work of three teams so that they fit together smoothly.|separates complicates | We need someone to {coordinate} the event, making sure every part runs to plan. | The rescue was well {coordinated}: everyone knew their job and worked together.|separated complicated",
      "separate complicate",
    ),
    word(
      "negotiate negotiates negotiated negotiating",
      "to talk with others to reach an agreement",
      "谈判；协商",
      "The union {negotiated} a pay rise in talks with the bosses.|navigated nominated | We are {negotiating} the price with a new supplier, talking until we agree.|navigating nominating | You can often {negotiate} the price of a car by talking to the seller.",
      "navigate nominate",
    ),
    word(
      "negotiation negotiations",
      "formal talks to reach an agreement",
      "谈判",
      "After long {negotiations}, they signed the deal.|navigations nominations | Pay {negotiations} between the union and the bosses will start next week.|navigations nominations | The deal is still under {negotiation}: both sides are talking.",
      "navigation nomination",
    ),
    word(
      "implement implements implemented implementing",
      "to make a plan or a decision start to work",
      "实施；执行",
      "The new rules will be {implemented} next year, when everyone must start following them.|abandoned postponed | It's easy to make a plan but hard to {implement} it and make it really work. | The school {implemented} a ban on phones, and now no pupil may use one.|abandoned postponed",
      "abandon postpone",
    ),
    word(
      "evaluate evaluates evaluated evaluating",
      "to judge how good, useful or successful something is",
      "评估；评价",
      "We {evaluated} the results of the project to see how well it had worked.|evacuated elevated | Teachers {evaluate} each student's progress with tests and essays. | It is too early to {evaluate} the new policy: we can't yet tell if it works.",
      "evacuate elevate",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Negotiate* is the verb and *negotiation* the noun: you *negotiate* a deal, and the talks are *negotiations*. Ask whether the gap needs the action or the talks themselves.",
        "*negotiate* 是动词，*negotiation* 是名词：你 *negotiate* 一笔交易，谈判本身叫 *negotiations*。想想空格需要的是动作，还是谈判本身。",
      ),
      meaning: t(
        "To *delegate* is to give part of your work to someone else, while to *supervise* is to watch over work that others do. Check whether the meaning is about handing work over or checking it.",
        "*delegate* 是把部分工作交给别人，*supervise* 是监督别人做的工作。看释义说的是交出工作，还是检查工作。",
      ),
      spell: t(
        "*Priority* ends in -ity, *supervise* ends in -ise even in American English, and *strategy* has a g before the y.",
        "*priority* 以 -ity 结尾，*supervise* 即使在美式英语里也以 -ise 结尾，*strategy* 的 y 前是 g。",
      ),
    },
    notes: `
      strategy|a marketing plan to win more customers;selling online and closing shops;attacking or defending to win a game|a strategy is a plan to reach a goal; a budget is the money you can spend|strategy 是战略；budget 是预算|tragedy=a tragedy is a very sad event or play, not a plan for winning customers or games=tragedy 是悲剧，不是赢得客户或比赛的计划;budget=a budget is an amount of money to spend, not a plan for how to win or what to sell=budget 是预算，不是怎么赢、卖什么的计划|strat · e · gy|strat + egy, with a g before the y|strat + egy，y 前是 g
      objective|the main aim of a writing course;everything aimed for this year;cutting costs by ten percent|an objective is what you try to achieve; an obstacle is what stands in your way|objective 是目标；obstacle 是障碍|objection/objections=an objection is a reason you give against something, not what you are trying to achieve=objection 是反对意见，不是想达成的目标;obstacle/obstacles=an obstacle stops you from reaching a goal, not the goal itself, so you never achieve it or aim for it=obstacle 是障碍，不是目标本身，不能被 achieve|ob · jec · tive|object + ive|object + ive
      target|5,000 cars sold as aimed for;a million trees to plant by 2030;the very center the arrow hit|a target is a result or a thing you aim at; a market is where things are sold|target 是目标、靶子；market 是市场|market=a market is where goods are bought and sold, not a number you aim for or something an arrow hits=market 是市场，不是瞄准的数字或箭射中的东西;margin=a margin is an edge or the difference between cost and price, not the result you aim for=margin 是边缘或利润差额，不是瞄准的结果|tar · get|tar + get|tar + get
      priority|family mattering more than anything;safety coming first;the task to do first|a priority is what matters most and comes first; the majority is the larger part of a group|priority 是优先事项；majority 是大多数|majority=the majority is more than half of a group, not the thing that matters most to you=majority 是大多数，不是对你最重要的事;privacy=privacy is being free from other people watching you, not the task that comes first=privacy 是隐私，不是最先做的事|pri · or · i · ty|prior + ity|prior + ity
      decision|weeks of thought about leaving a job;the choice to close a school;a yes or no by Friday|a decision is a choice you make; a division is a split into parts|decision 是决定；division 是分割|division=a division is a split into parts or a section of a company, not a choice such as yes or no=division 是划分或部门，不是是或否的选择;precision=precision is being exact and accurate, not a choice you think about and make=precision 是精确，不是经过思考做出的选择|de · ci · sion|decide with -de changed to -sion|decide 的 -de 改成 -sion
      delegate|tasks handed to a team instead of doing them all;a task given to an assistant by a busy boss;jobs given to staff because you can't do everything|to delegate is to give work to others; to dedicate is to give your time or a work in someone's honor|delegate 是委派；dedicate 是奉献、献给|dedicate/dedicated=dedicate means to give your time to a cause or a book to someone in their honor, not to hand tasks over because you are busy=dedicate 是献身或题献，不是因忙而交出任务;relegate/relegated=relegate means to move someone or something to a lower rank, such as a team to a lower league, not to share out work=relegate 是降级，不是分派工作|del · e · gate|dele + gate|dele + gate
      supervise|watching children at lunchtime;checking a team's work every day;an engineer checking every step|to supervise is to watch over work; to survive is to stay alive|supervise 是监督；survive 是幸存|surprise/surprises/surprised=surprise means to do something unexpected to someone, not to watch over and check their work=surprise 是使惊讶，不是监督检查;survive/survives/survived=survive means to stay alive through danger, not to watch over children or check work=survive 是幸存，不是看管孩子或检查工作|su · per · vise|super + vise, ending in -ise|super + vise，以 -ise 结尾
      coordinate|three teams fitting together smoothly;every part of an event running to plan;a rescue where everyone worked together|to coordinate is to make parts work well together; to separate is to keep them apart|coordinate 是协调；separate 是分开|separate/separates/separated=separate means to keep things apart, the opposite of making teams fit and work together=separate 是分开，和让团队协同配合正相反;complicate/complicates/complicated=complicate means to make something harder, not to make its parts run smoothly together=complicate 是使复杂，不是让各部分顺畅配合|co · or · di · nate|co + ordinate, with a double o|co + ordinate，双写 o
      negotiate|a pay rise won in talks with bosses;talking with a supplier until you agree;talking to a seller about a price|to negotiate is to talk to reach an agreement; to navigate is to find your way|negotiate 是谈判；navigate 是导航|navigate/navigated/navigating=navigate means to find the way when you travel, not to talk with others to agree on pay or a price=navigate 是导航，不是谈工资或价格;nominate/nominated/nominating=nominate means to suggest someone for a job or prize, not to talk until you agree=nominate 是提名，不是谈到达成一致|ne · go · ti · ate|negoti + ate, with ti sounding like sh|negoti + ate，ti 读作 sh
      negotiation|long talks before a deal was signed;pay talks between a union and bosses;a deal both sides are still talking about|negotiation is talks to agree; navigation is finding the way|negotiation 是谈判；navigation 是导航|navigation/navigations=navigation is finding the way when you travel, not talks between two sides=navigation 是导航，不是双方会谈;nomination/nominations=a nomination is suggesting someone for a job or prize, not talks to reach a deal=nomination 是提名，不是为达成交易的谈判|ne · go · ti · a · tion|negotiate with the e dropped, then -ion|negotiate 去掉 e，再加 -ion
      implement|rules everyone must start following;a plan made to really work;a phone ban no pupil may break|to implement is to make a plan start working; to abandon is to give it up|implement 是实施；abandon 是放弃|abandon/abandoned=abandon means to give a plan up, the opposite of making it work so people follow it=abandon 是放弃，和让计划生效、人人遵守正相反;postpone/postponed=postpone means to move something to a later time, not to make it start working now=postpone 是推迟，不是让它现在生效|im · ple · ment|im + ple + ment|im + ple + ment
      evaluate|checking how well a project worked;tests and essays to judge progress;telling whether a policy works|to evaluate is to judge how good something is; to evacuate is to move people out of danger|evaluate 是评估；evacuate 是疏散|evacuate/evacuated=evacuate means to move people away from danger, not to judge results or progress=evacuate 是疏散，不是评判结果或进步;elevate/elevated=elevate means to lift something higher, not to judge how well it works=elevate 是提升，不是评判效果|e · val · u · ate|e + value with the e dropped, then -ate|e + value 去掉 e，再加 -ate
    `,
  },
});

const employment = vocabularyTopic({
  id: "b2-words-employment",
  title: t("Employment", "就业"),
  summary: t(
    "The workforce; recruiting and recruitment; dismissing, redundancy and layoffs; freelance work; trainees, internships and apprentices; promotion and workload.",
    "劳动力；招聘；解雇、裁员；自由职业；实习生、实习和学徒；升职和工作量。",
  ),
  intro: t(
    "The firm plans to **recruit** forty new staff: some will start as **trainees**, others as **apprentices**, and the best can hope for **promotion**. These words help you talk about finding work, learning a job and losing one.",
    "公司计划 **recruit**（招聘）四十名新员工：有的从 **trainees**（实习生）做起，有的当 **apprentices**（学徒），最优秀的可以期待 **promotion**（晋升）。这些词帮你谈论找工作、学本领和失业。",
  ),
  prerequisites: ["b1-words-applying"],
  words: [
    word(
      "workforce workforces",
      "all the people who work in a company, an industry or a country",
      "劳动力；全体员工",
      "Women make up half of the {workforce}: half of all workers are women. | The company has a {workforce} of 2,000 people. | A skilled {workforce}, with well-trained workers, attracts investors.",
      "workload workplace",
    ),
    word(
      "recruit recruits recruited recruiting",
      "to find new people to work in a company or join an organization",
      "招聘；招收",
      "The company plans to {recruit} 200 new staff to work in its new office. | The army is trying to {recruit} more young people to join. | She was {recruited} straight from university and started work the next week.|dismissed rejected",
      "dismiss reject",
    ),
    word(
      "recruitment",
      "the process of finding new people to work for an organization",
      "招聘",
      "{Recruitment} of nurses is a big problem: hospitals can't find enough new ones. | The {recruitment} process, from the job advert to the final interview, takes two months. | She works in {recruitment}, finding new staff for companies.",
      "retirement requirement",
    ),
    word(
      "dismiss dismisses dismissed dismissing",
      "to remove someone from their job; to refuse to think about an idea",
      "解雇；不予考虑",
      "He was {dismissed} for being late every day and lost his job.|hired promoted | The manager {dismissed} two workers last week, so they had to leave.|hired promoted | She {dismissed} the idea as silly and refused to think about it.|hired promoted",
      "hire promote",
    ),
    word(
      "redundant",
      "without a job because your job is no longer needed (made redundant); not needed",
      "被裁员的；多余的",
      "Fifty workers were made {redundant} when the factory closed. | Machines have made many jobs {redundant}, so those workers are no longer needed. | If you are made {redundant}, you may get some money from the company when you leave.",
      "abundant permanent",
    ),
    word(
      "layoff layoffs",
      "the ending of a worker's job because there is not enough work",
      "裁员；解雇",
      "The company announced 500 {layoffs}, so 500 workers will lose their jobs.|layouts playoffs | {Layoffs} are expected after the merger, as fewer staff are needed.|Layouts Playoffs | Workers are worried about more {layoffs} and losing their jobs.|layouts playoffs",
      "layout playoff",
    ),
    word(
      "freelance",
      "working for several companies, paid for each job, not employed by one",
      "自由职业的",
      "She works as a {freelance} designer for several companies, paid by the job. | He went {freelance} after ten years at the newspaper, and now sells stories to many papers. | {Freelance} workers, paid for each job, have no fixed salary.",
      "full-time freehand",
    ),
    word(
      "trainee trainees",
      "a person who is being trained for a job",
      "实习生；受训者",
      "The bank hires twenty {trainees} every year and teaches them the job.|trainers veterans | As a {trainee}, she earns less than other staff while she learns. | The {trainee} chef, still learning, cut his finger.",
      "trainer veteran",
      "apprentice",
    ),
    word(
      "internship internships",
      "a period of work, often for a student, to get experience",
      "实习",
      "She did a summer {internship} at a bank to get work experience. | {Internships} give students work experience.|Citizenships Memberships | Many {internships} are unpaid, so students work for free.|citizenships memberships",
      "citizenship membership",
    ),
    word(
      "apprentice apprentices",
      "a young person who works for an expert to learn a skill",
      "学徒",
      "He started as an {apprentice} to a carpenter, learning the trade. | The {apprentices} learn on the job from skilled workers.|experts employers | She is an {apprentice} electrician, still learning from her boss.",
      "expert employer",
      "trainee",
    ),
    word(
      "promotion promotions",
      "a move to a more important job in the same company",
      "晋升；升职",
      "She got a {promotion} to manager and a pay rise. | He was hoping for a {promotion} to a higher post this year. | There are few chances of {promotion} here, so people rarely move up.",
      "demotion protection",
    ),
    word(
      "workload workloads",
      "the amount of work that a person has to do",
      "工作量",
      "My {workload} has doubled since my colleague left, and I work every evening. | Teachers complain about their heavy {workload}: too many classes and too much marking. | We need more staff to share the {workload}.",
      "workforce download",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Recruit* is the verb and *recruitment* the noun: a company *recruits* staff, and the work of doing it is *recruitment*. Ask whether the gap needs the action or the process.",
        "*recruit* 是动词，*recruitment* 是名词：公司 *recruits* 员工，这项工作叫 *recruitment*。想想空格需要的是动作，还是过程。",
      ),
      meaning: t(
        "A *trainee* is being trained for any kind of job, while an *apprentice* learns a skilled trade such as carpentry from an expert. Check whether the meaning names a craft learned from a master.",
        "*trainee* 是为某种工作受训的人，*apprentice* 是跟师傅学木工等手艺的学徒。看释义是否说的是跟师傅学手艺。",
      ),
      spell: t(
        "*Workforce*, *workload* and *layoff* are each one word, and *apprentice* has a double p.",
        "*workforce*、*workload* 和 *layoff* 都连写成一个词，*apprentice* 有双 p。",
      ),
    },
    notes: `
      workforce|half of all workers being women;2,000 people in a company;well-trained workers who attract investors|the workforce is all the workers; the workload is the amount of work|workforce 是全体员工；workload 是工作量|workload=workload is the amount of work someone has, not the people who do it=workload 是工作量，不是做工作的人;workplace=a workplace is the place where people work, not the workers themselves=workplace 是工作场所，不是员工本身|work · force|work + force, one word|work + force，连写成一个词
      recruit|200 new staff for a new office;young people to join the army;a graduate who started work the next week|to recruit is to find new people for a job; to dismiss is to remove them from it|recruit 是招聘；dismiss 是解雇|dismiss/dismissed=dismiss means to remove someone from their job, the opposite of taking on new staff who start work=dismiss 是解雇，和招来新员工开始上班正相反;reject/rejected=reject means to refuse someone, the opposite of bringing people in to work or join=reject 是拒绝，和把人招进来正相反|re · cruit|re + cruit, with ui|re + cruit，中间是 ui
      recruitment|hospitals unable to find new nurses;a process from job advert to final interview;finding new staff for companies|recruitment is finding new staff; retirement is stopping work because of age|recruitment 是招聘；retirement 是退休|retirement=retirement is stopping work at the end of your career, not finding new staff=retirement 是退休，不是招新员工;requirement=a requirement is something that is needed, not the process of finding new staff=requirement 是要求，不是招聘新员工的过程|re · cruit · ment|recruit + ment|recruit + ment
      dismiss|a worker who lost his job for being late;two workers who had to leave;an idea refused as silly|to dismiss is to remove from a job or refuse an idea; to hire is to give someone a job|dismiss 是解雇、不予考虑；hire 是雇用|hire/hired=hire means to give someone a job, the opposite of losing a job, having to leave or refusing an idea=hire 是雇用，和失业、离职或否定想法正相反;promote/promoted=promote means to move someone to a better job or to support an idea, not to remove or refuse=promote 是提拔或推广，不是开除或否定|dis · miss|dis + miss, with a double s at the end|dis + miss，结尾双写 s
      redundant|workers losing jobs when a factory closed;jobs no longer needed because of machines;money from the company when you leave|redundant means no longer needed in a job; permanent means lasting for good|redundant 是被裁员的、多余的；permanent 是永久的|abundant=abundant means existing in large amounts, not without a job=abundant 是大量的，不是失去工作的;permanent=permanent means lasting for good, the opposite of losing a job when a factory closes or leaving the company=permanent 是长期的，和工厂关门失业或离职正相反|re · dun · dant|re + dund + ant, ending in -ant|re + dund + ant，以 -ant 结尾
      layoff|500 workers who will lose their jobs;fewer staff needed after a merger;workers worried about losing their jobs|a layoff ends a job because there is not enough work; a layout is how things are arranged|layoff 是裁员；layout 是布局|layout/layouts/Layouts=a layout is how things are arranged on a page or in a room, not the ending of jobs=layout 是布局，不是裁员;playoff/playoffs/Playoffs=a playoff is an extra game to decide a winner, not workers losing their jobs=playoff 是季后赛，不是员工失业|lay · off|lay + off, one word|lay + off，连写成一个词
      freelance|a designer paid by the job for several companies;selling stories to many papers;workers with no fixed salary|freelance means working for several clients and paid per job; full-time means employed by one company all week|freelance 是自由职业的；full-time 是全职的|full-time/Full-time=full-time means employed by one company with a fixed salary, the opposite of being paid by the job for many clients=full-time 是全职的，和按活计酬、为多家工作正相反;freehand/Freehand=freehand means drawn by hand without tools, not a way of being employed=freehand 是徒手画的，不是一种雇用方式|free · lance|free + lance, one word|free + lance，连写成一个词
      trainee|twenty new staff taught the job each year;someone earning less while she learns;a chef still learning|a trainee is being trained; a trainer does the training|trainee 是受训者；trainer 是培训师|trainer/trainers=a trainer teaches others, the opposite of someone being taught and still learning=trainer 是培训师，和正在学习的人正相反;veteran/veterans=a veteran has done a job for many years, the opposite of someone still learning it=veteran 是老手，和还在学习的人正相反|train · ee|train + ee, ending in -ee|train + ee，以 -ee 结尾
      internship|summer work at a bank for experience;work experience for students;work that students do for free|an internship is a period of work for experience; a membership is belonging to a club|internship 是实习；membership 是会员资格|citizenship/citizenships/Citizenships=citizenship is being a legal member of a country, not a period of work for experience=citizenship 是公民身份，不是积累经验的工作期;membership/memberships/Memberships=membership is belonging to a club or group, not a period of work=membership 是会员资格，不是一段工作期|in · tern · ship|intern + ship|intern + ship
      apprentice|learning a trade from a carpenter;learning on the job from skilled workers;an electrician still learning from her boss|an apprentice learns a skill from an expert; an expert already has the skill|apprentice 是学徒；expert 是专家|expert/experts=an expert already knows the skill well, the opposite of someone still learning it from others=expert 是专家，和还在跟别人学的人正相反;employer/employers=an employer gives people jobs, not someone learning a trade from a skilled worker=employer 是雇主，不是跟熟练工学手艺的人|ap · pren · tice|ap + pren + tice, with a double p|ap + pren + tice，双写 p
      promotion|becoming manager with a pay rise;moving to a higher post;moving up in a company|a promotion is a move to a higher job; a demotion is a move to a lower one|promotion 是晋升；demotion 是降职|demotion=a demotion is a move to a lower job, the opposite of becoming manager or moving up=demotion 是降职，和升为经理、往上走正相反;protection=protection is keeping someone safe, not a move to a more important job=protection 是保护，不是升到更重要的职位|pro · mo · tion|promote with the te changed to -tion|promote 的 te 改成 -tion
      workload|work doubling since a colleague left;too many classes and too much marking;work shared out among more staff|a workload is the amount of work; the workforce is the people who do it|workload 是工作量；workforce 是全体员工|workforce=the workforce is the people who work, not the amount of work one person has to do=workforce 是全体员工，不是一个人要做的工作量;download=a download is a file copied from the internet, not the amount of work you have=download 是下载的文件，不是工作量|work · load|work + load, one word|work + load，连写成一个词
    `,
  },
});

const finance = vocabularyTopic({
  id: "b2-words-finance",
  title: t("Finance", "财务"),
  summary: t(
    "Revenue and expenditure; assets, funds and funding; grants and subsidies; mortgages and savings; going bankrupt; dividends and audits.",
    "收入和支出；资产、基金和资金；拨款和补贴；按揭贷款和储蓄；破产；股息和审计。",
  ),
  intro: t(
    "The theater's **revenue** from tickets fell, so it cut its **expenditure** and applied for a **grant** to stay open. These words help you talk about where money comes from, where it goes and how it is checked.",
    "剧院的门票 **revenue**（收入）下降了，于是削减 **expenditure**（开支），并申请了一笔 **grant**（拨款）来维持运营。这些词帮你谈论钱从哪里来、花到哪里去，以及如何核查。",
  ),
  prerequisites: ["b1-words-personal-finance"],
  words: [
    word(
      "revenue revenues",
      "the money that a company or a government receives",
      "收入；税收",
      "The company's {revenue} from selling cars rose by 20 percent. | Tourism is the island's main source of {revenue}, bringing in most of its money. | Tax {revenues} collected by the state fell during the recession.|expenditures revenges",
      "expenditure revenge",
    ),
    word(
      "expenditure expenditures",
      "the money that a person, a company or a government spends",
      "支出；开支",
      "Government {expenditure} on health has increased: it now spends more on hospitals. | We earn too little, so we must reduce our {expenditure} and spend less. | Keep a record of all your {expenditure}, every pound you spend.",
      "revenue expedition",
    ),
    word(
      "asset assets",
      "something valuable that a person or a company owns; a useful quality",
      "资产；有价值的人或物",
      "His house, worth a million dollars, is his biggest {asset}. | The company sold some of its {assets} to pay its debts.|debts aspects | Her languages are a great {asset} in her job, helping her win clients.",
      "debt aspect",
    ),
    word(
      "fund funds",
      "an amount of money kept for a purpose; money that is available",
      "基金；资金",
      "We are raising money for a school {fund} that will buy new computers. | The {fund} pays for students' books. | The museum is short of {funds} and may have to close.|debts fines",
      "debt fine",
      "funding",
    ),
    word(
      "funding",
      "money given by a government or an organization for a purpose",
      "资金；拨款",
      "The project lost its government {funding}, so it has no money left. | Schools need more {funding} to pay teachers and buy books. | Scientists applied for {funding} to pay for their research.",
      "founding finding",
      "fund grant subsidy",
    ),
    word(
      "grant grants",
      "money given by a government or an organization for a purpose, such as study",
      "拨款；助学金",
      "She got a {grant} to study abroad, money she never has to pay back. | The council gave the theater a {grant} of \\$50,000, which it need not repay. | Students can apply for a {grant} for living costs, which they don't have to pay back.",
      "loan grunt",
      "funding subsidy",
    ),
    word(
      "subsidy subsidies",
      "money that a government pays to keep prices low or to help an industry",
      "补贴",
      "Farmers receive a {subsidy} from the government to help them. | The bus fares are low because of a government {subsidy}. | The {subsidies} for electric cars will end next year, so the cars will cost more.|taxes subsidiaries",
      "tax subsidiary",
      "grant funding",
    ),
    word(
      "mortgage mortgages",
      "a loan from a bank to buy a house",
      "按揭贷款；抵押贷款",
      "They took out a {mortgage} to buy a flat. | We pay our {mortgage} to the bank every month, and in 25 years the house will be ours. | Interest rates on {mortgages} have gone up.|rents mortars",
      "rent mortar",
    ),
    word(
      "bankrupt",
      "not able to pay your debts",
      "破产的",
      "The company went {bankrupt} last year and closed. | If sales don't improve, we'll go {bankrupt} and lose everything. | The war left the country {bankrupt}, unable to pay its debts.",
      "wealthy abrupt",
    ),
    word(
      "dividend dividends",
      "a part of a company's profit paid to its shareholders",
      "股息；红利",
      "Shareholders received a {dividend} of \\$2 a share from the profits. | The company pays {dividends} to its shareholders twice a year.|divisions penalties | Hard work now will pay {dividends} later.|divisions penalties",
      "division penalty",
    ),
    word(
      "savings",
      "money that you have kept and not spent",
      "储蓄；存款",
      "She spent all her {savings}, the money she had kept for years, on the trip. | Put your {savings} in a bank account to keep them safe. | They lost their life {savings} when the bank failed.",
      "debts sayings",
    ),
    word(
      "audit audits",
      "an official check of an organization's accounts",
      "审计；查账",
      "The accountants carried out an {audit} of the company's accounts. | The {audit} found that money was missing from the accounts. | The law requires an {audit} of the accounts every year.",
      "auction audience",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Revenue* is the money that comes in, while *expenditure* is the money that goes out. Ask whether the sentence is about earning and collecting or about spending.",
        "*revenue* 是进来的钱，*expenditure* 是花出去的钱。想想句子说的是赚钱收钱，还是花钱。",
      ),
      meaning: t(
        "A *grant* is money you are given and never pay back, while a *mortgage* is a bank loan for a house that you must repay. Check whether the meaning says the money is a gift or a loan.",
        "*grant* 是不用偿还的拨款，*mortgage* 是必须偿还的购房贷款。看释义说的是赠款还是贷款。",
      ),
      spell: t(
        "*Mortgage* has a silent t, *bankrupt* keeps the k of *bank*, and *subsidy* has a single s in the middle.",
        "*mortgage* 里的 t 不发音，*bankrupt* 保留 *bank* 的 k，*subsidy* 中间只有一个 s。",
      ),
    },
    notes: `
      revenue|money from selling cars;tourism bringing in most of an island's money;tax collected by the state|revenue is money that comes in; expenditure is money that goes out|revenue 是收入；expenditure 是支出|expenditure/expenditures=expenditure is money that is spent, the opposite of money that comes in from sales, tourism or tax=expenditure 是支出，和来自销售、旅游或税收的收入正相反;revenge/revenges=revenge is hurting someone because they hurt you, not money that comes in=revenge 是报复，不是收进的钱|rev · e · nue|reve + nue, ending in -ue|reve + nue，以 -ue 结尾
      expenditure|spending more on hospitals;spending less because we earn too little;every pound you spend|expenditure is money spent; revenue is money received|expenditure 是支出；revenue 是收入|revenue=revenue is money that comes in, the opposite of spending on hospitals or every pound you spend=revenue 是收入，和花在医院上的钱、花掉的每一镑正相反;expedition=an expedition is a long, organized journey, not money that is spent=expedition 是远征考察，不是花掉的钱|ex · pen · di · ture|expend + iture|expend + iture
      asset|a house worth a million dollars;things sold to pay debts;languages that help win clients|an asset is something valuable you own; a debt is money you owe|asset 是资产；debt 是债务|debt/debts=a debt is money you owe, the opposite of something valuable you own or can sell to pay debts=debt 是欠款，和你拥有、可卖来还债的有价之物正相反;aspect/aspects=an aspect is one part or side of a situation, not something valuable that you own=aspect 是方面，不是你拥有的有价之物|as · set|as + set, with a double s|as + set，双写 s
      fund|money raised to buy new computers;money that pays for students' books;money a museum lacks|a fund is money kept for a purpose; a debt is money owed|fund 是基金、资金；debt 是债务|debt/debts=a debt is money you owe, not money kept to buy things or pay for books=debt 是欠款，不是留着买东西、付书钱的资金;fine/fines=a fine is money paid as a punishment, not money kept for a purpose=fine 是罚款，不是为某用途留存的钱|fund|f + und, not *found*|f + und，别写成 *found*
      funding|money lost by a project;money to pay teachers and buy books;money to pay for research|funding is money given for a purpose; founding is starting an organization|funding 是资金、拨款；founding 是创立|founding=founding is starting a new organization, not money given to pay for things=founding 是创立，不是拨来付款的钱;finding=a finding is something learned from a study, not money given for a project=finding 是研究发现，不是给项目的钱|fund · ing|fund + ing|fund + ing
      grant|money for study abroad that is never paid back;money a theater need not repay;living costs students don't have to pay back|a grant is money given that you never repay; a loan must be paid back|grant 是不用偿还的拨款；loan 是贷款|loan=a loan is money you must pay back, the opposite of money you never have to repay=loan 是必须偿还的贷款，和不用偿还的钱正相反;grunt=a grunt is a short, low sound like a pig makes, not money given for a purpose=grunt 是咕哝声，不是拨款|grant|gr + ant, not *grand*|gr + ant，别写成 *grand*
      subsidy|government money to help farmers;government money that keeps bus fares low;money that keeps electric cars cheaper|a subsidy is money paid to keep prices low; a tax is money taken by the government|subsidy 是补贴；tax 是税|tax/taxes=a tax is money the government takes, which makes prices higher, the opposite of help that keeps fares and cars cheap=tax 是政府收的税，会让价格更高，和压低价格的补贴正相反;subsidiary/subsidiaries=a subsidiary is a company owned by a bigger company, not money paid by a government=subsidiary 是子公司，不是政府给的钱|sub · si · dy|sub + sidy, with a single s|sub + sidy，只有一个 s
      mortgage|a loan to buy a flat;monthly payments until a house is yours;interest rates on home loans|a mortgage is a bank loan for a home you will own; rent is paid to live in a home someone else owns|mortgage 是购房贷款；rent 是房租|rent/rents=rent is paid to live in a home you never own, the opposite of borrowing to buy a flat or paying until the house is yours=rent 是房租，房子永远不归你，和借钱买房、还清后房子归你正相反;mortar/mortars=mortar is the mixture that holds bricks together, not a loan to buy a home=mortar 是砂浆，不是购房贷款|mort · gage|mort + gage, with a silent t|mort + gage，t 不发音
      bankrupt|a company that closed;losing everything if sales don't improve;a country unable to pay its debts|bankrupt means unable to pay your debts; wealthy means rich|bankrupt 是破产的；wealthy 是富有的|wealthy=wealthy means rich, the opposite of closing, losing everything or being unable to pay debts=wealthy 是富有的，和倒闭、失去一切、还不起债正相反;abrupt=abrupt means sudden or rude, not unable to pay debts=abrupt 是突然的或粗鲁的，不是无力偿债的|bank · rupt|bank + rupt|bank + rupt
      dividend|two dollars a share from the profits;money paid to shareholders twice a year;the reward for hard work now|a dividend is a share of the profits paid out; a penalty is money paid as a punishment|dividend 是股息、回报；penalty 是罚款|division/divisions=a division is a split into parts or a section of a company, not money paid out from profits=division 是划分或部门，不是分红;penalty/penalties=a penalty is a punishment, the opposite of a share of the profits or a reward for hard work=penalty 是惩罚，和利润分红或努力的回报正相反|div · i · dend|divi + dend|divi + dend
      savings|money kept for years and spent on a trip;money kept safe in a bank account;a lifetime of money lost when a bank failed|savings are money you have kept; debts are money you owe|savings 是存款；debts 是债务|debts=debts are money you owe, not money you have kept and can spend or put in a bank=debts 是欠款，不是你存下、能花或存进银行的钱;sayings=sayings are well-known short phrases, not money you have kept=sayings 是谚语，不是存下的钱|sav · ings|save with the e dropped, then -ings|save 去掉 e，再加 -ings
      audit|accountants checking a company's accounts;a check that found money missing;a yearly check of the accounts required by law|an audit is an official check of accounts; an auction is a sale to the highest bidder|audit 是审计；auction 是拍卖|auction=an auction is a sale where things go to whoever pays the most, not a check of accounts=auction 是拍卖，不是查账;audience=an audience is the people watching a show, not a check that finds missing money=audience 是观众，不是查出资金短缺的审查|au · dit|au + dit|au + dit
    `,
  },
});

const conditions = vocabularyTopic({
  id: "b2-words-work-conditions",
  title: t("Working Conditions", "工作条件"),
  summary: t(
    "Unions and conditions; maternity and paternity leave; harassment, safety and hazards; compensation and exploitation; being entitled; discriminating and fairness.",
    "工会和条件；产假和陪产假；骚扰、安全和危险；赔偿和剥削；有权享有；歧视和公平。",
  ),
  intro: t(
    "The **union** said the factory had poor **safety**: one **hazard** after another had injured workers, and nobody had paid **compensation**. These words help you talk about workers' rights and the conditions they work in.",
    "**union**（工会）说工厂的 **safety**（安全）很差：一个又一个 **hazard**（危险）让工人受伤，却没人支付 **compensation**（赔偿）。这些词帮你谈论工人的权利和他们的工作条件。",
  ),
  prerequisites: ["b1-words-workplace"],
  words: [
    word(
      "union unions",
      "an organization of workers that protects their rights; the joining of things",
      "工会；联盟",
      "She joined the teachers' {union} to protect her rights at work. | The {union} asked for better pay for its members. | {Unions} protect workers' rights.|Onions Units",
      "onion unit",
    ),
    word(
      "condition conditions",
      "the state that something is in; (conditions) the situation in which people work or live",
      "状况；条件",
      "Working {conditions} in the factory were terrible: hot, dirty and dangerous.|additions traditions | The car is in good {condition}: it runs well and has no scratches. | You can go out on one {condition}: be home by ten.",
      "addition tradition",
    ),
    word(
      "maternity",
      "about having a baby, for a mother",
      "产妇的；孕产期",
      "She is on {maternity} leave for six months after having her baby. | The company offers good {maternity} pay to new mothers. | The hospital's {maternity} ward, where babies are born, is on the second floor.",
      "paternity maturity",
      "paternity",
    ),
    word(
      "paternity",
      "being a father",
      "父亲身份；陪产（假）",
      "Fathers can take two weeks' {paternity} leave. | More men are taking {paternity} leave to stay home with their new babies. | The new law gives fathers longer {paternity} leave.",
      "maternity patience",
      "maternity",
    ),
    word(
      "harassment",
      "behavior that annoys, frightens or upsets someone again and again",
      "骚扰",
      "Sexual {harassment} at work is illegal. | She reported the {harassment}, the rude messages he kept sending, to her manager. | He suffered years of {harassment} from his boss, who shouted at him every day.",
      "fairness kindness",
    ),
    word(
      "safety",
      "the state of being safe from danger",
      "安全",
      "Wear a helmet for your {safety}. | Fire {safety} rules must be followed to stop fires. | The workers were moved to {safety}, away from the flames.",
      "danger harm",
    ),
    word(
      "hazard hazards",
      "something that may be dangerous",
      "危险；危害",
      "Wet floors are a {hazard} in the kitchen: people slip on them. | The smoke is a health {hazard} that can damage your lungs. | Workers must be told about any {hazard} that could hurt them.",
      "safety harbor",
    ),
    word(
      "compensation",
      "money paid to someone for a loss, an injury or damage",
      "赔偿；补偿",
      "The workers received {compensation}, money for their injuries. | She asked for {compensation} after the accident to pay for her damaged car. | The airline paid {compensation} for the delay.",
      "competition punishment",
    ),
    word(
      "exploitation",
      "unfair treatment of people to get work or profit from them",
      "剥削",
      "The report found the {exploitation} of children, who worked long hours for almost nothing. | {Exploitation} of workers, paying them almost nothing, is common where there are no unions. | The film is about the {exploitation} of the poor by greedy landlords.",
      "exploration explanation",
    ),
    word(
      "entitled",
      "having the right to have or do something",
      "有权（享有）的",
      "All workers are {entitled} to four weeks' holiday by law. | You are {entitled} to a refund because the goods were broken. | She feels {entitled} to a bigger office, as if she has a right to it.",
      "opposed related",
    ),
    word(
      "discriminate discriminates discriminated discriminating",
      "to treat a person or a group worse than others because of who they are",
      "歧视",
      "It is illegal to {discriminate} against women. | The company was accused of {discriminating} against older workers by refusing to hire them.|protesting voting | Employers must not {discriminate} against anyone, paying them less because of their race.",
      "protest vote",
    ),
    word(
      "fairness",
      "the quality of treating people equally and in a right way",
      "公平",
      "Workers want {fairness} in how they are paid: the same pay for the same work. | {Fairness} means treating everyone the same. | People questioned the {fairness} of the test, saying some got easier questions.",
      "firmness injustice",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Maternity* is about mothers and *paternity* about fathers: a new mother takes *maternity* leave, a new father *paternity* leave. Ask who in the sentence has had the baby.",
        "*maternity* 关于母亲，*paternity* 关于父亲：新妈妈休 *maternity* 假，新爸爸休 *paternity* 假。想想句子里有了宝宝的是谁。",
      ),
      meaning: t(
        "*Safety* is being protected from danger, while a *hazard* is the danger itself. Check whether the meaning names the risk or the state of being free from it.",
        "*safety* 是免于危险的状态，*hazard* 是危险本身。看释义说的是风险本身，还是远离风险的状态。",
      ),
      spell: t(
        "*Harassment* has one r and a double s, *entitled* starts with en-, and *discriminate* has -crim- in the middle.",
        "*harassment* 有一个 r、两个 s，*entitled* 以 en- 开头，*discriminate* 中间是 -crim-。",
      ),
    },
    notes: `
      union|a group protecting teachers' rights;a group asking for better pay for its members;groups that protect workers' rights|a union is an organization of workers; a unit is one single part|union 是工会；unit 是单位、单元|onion/Onions=an onion is a vegetable, not an organization of workers=onion 是洋葱，不是工人组织;unit/Units=a unit is a single part of something or a measure, not a group that protects workers' rights=unit 是单位或单元，不是保护工人权利的组织|un · ion|uni + on|uni + on
      condition|a factory that was hot, dirty and dangerous;a car that runs well with no scratches;being home by ten|a condition is the state of something or a rule you must meet; a tradition is a custom|condition 是状况、条件；tradition 是传统|addition/additions=an addition is something added or the adding of numbers, not the state of a factory or car=addition 是添加或加法，不是工厂或车的状况;tradition/traditions=a tradition is an old custom, not how hot or dirty a place is or a rule such as being home by ten=tradition 是传统，不是场所的状况或回家时间的条件|con · di · tion|con + dit + ion|con + dit + ion
      maternity|a mother on leave after having her baby;pay for new mothers;a ward where babies are born|maternity is about mothers and birth; paternity is about fathers|maternity 是产妇的；paternity 是父亲的|paternity=paternity is about being a father, not a mother having a baby or a birth ward=paternity 是父亲身份，不是母亲生产或产房;maturity=maturity is being fully grown or sensible, not about having a baby=maturity 是成熟，不是生孩子|ma · ter · ni · ty|mater + nity, starting ma-|mater + nity，以 ma- 开头
      paternity|two weeks of leave for fathers;men staying home with their new babies;longer leave for fathers by law|paternity is about fathers; maternity is about mothers|paternity 是父亲的；maternity 是母亲的|maternity=maternity is about mothers, not fathers or men taking leave=maternity 是关于母亲的，不是父亲或男性休假;patience=patience is waiting calmly, not about being a father=patience 是耐心，不是父亲身份|pa · ter · ni · ty|pater + nity, starting pa-|pater + nity，以 pa- 开头
      harassment|sexual behavior at work that is illegal;rude messages someone kept sending;a boss who shouted every day|harassment is upsetting someone again and again; kindness is being friendly and helpful|harassment 是骚扰；kindness 是善意|fairness=fairness is treating people equally and rightly, the opposite of illegal, rude or shouting behavior=fairness 是公平，和违法、粗鲁或吼叫的行为正相反;kindness=kindness is being friendly and caring, the opposite of rude messages and daily shouting=kindness 是善意，和粗鲁的信息、每天吼叫正相反|ha · rass · ment|one r, then a double s: harass + ment|一个 r，再双写 s：harass + ment
      safety|a helmet that protects you;rules to stop fires;a place away from the flames|safety is being safe from danger; danger is the risk of harm|safety 是安全；danger 是危险|danger=danger is the chance of being hurt, the opposite of a helmet, fire rules or a place away from flames=danger 是危险，和头盔、防火规定、远离火焰的地方正相反;harm=harm is hurt or damage, the opposite of being protected=harm 是伤害，和受到保护正相反|safe · ty|safe + ty, keeping the e|safe + ty，保留 e
      hazard|wet floors people slip on;smoke that can damage lungs;anything that could hurt workers|a hazard is something dangerous; safety is being free from danger|hazard 是危险；safety 是安全|safety=safety is being safe, the opposite of wet floors, harmful smoke or things that hurt=safety 是安全，和湿滑地面、有害烟雾、伤人的东西正相反;harbor=a harbor is a place where ships stay, not something that can hurt you=harbor 是港口，不是会伤人的东西|haz · ard|haz + ard|haz + ard
      compensation|money for workers' injuries;money to pay for a damaged car;money from an airline for a delay|compensation is money paid for a loss or injury; punishment is suffering given for a wrong|compensation 是赔偿；punishment 是惩罚|competition=competition is trying to beat others, not money paid for injuries or a delay=competition 是竞争，不是为受伤或延误付的钱;punishment=punishment is something bad done to someone for a wrong, not money paid to help them after a loss=punishment 是惩罚，不是损失后的补偿金|com · pen · sa · tion|compens + ation|compens + ation
      exploitation|children working long hours for almost nothing;workers paid almost nothing;the poor used by greedy landlords|exploitation is using people unfairly for profit; exploration is traveling to discover|exploitation 是剥削；exploration 是探索|exploration=exploration is traveling to discover new places, not using people unfairly for profit=exploration 是探索，不是不公平地利用他人谋利;explanation=an explanation is telling why something happens, not unfair treatment of workers=explanation 是解释，不是对工人的不公对待|ex · ploi · ta · tion|exploit + ation|exploit + ation
      entitled|holiday all workers have by law;a refund owed for broken goods;feeling you have a right to a bigger office|entitled means having a right to something; opposed means being against it|entitled 是有权享有的；opposed 是反对的|opposed=opposed means being against something, not having a right to holiday or a refund=opposed 是反对的，不是有权享有假期或退款;related=related means connected, not having a right to have something=related 是有关的，不是有权享有|en · ti · tled|en + title with the e dropped, then -ed|en + title 去掉 e，再加 -ed
      discriminate|treating women worse, which is illegal;refusing to hire older workers;paying people less because of their race|to discriminate is to treat people worse because of who they are; to protest is to say publicly you are against something|discriminate 是歧视；protest 是抗议|protest/protesting=protest means to say publicly that you are against something, not to treat a group worse or refuse to hire them=protest 是抗议，不是对某群体不公或拒绝雇用;vote/voting=vote means to choose in an election, not to treat people unfairly or pay them less=vote 是投票，不是不公平对待或少付工资|dis · crim · i · nate|dis + crimin + ate|dis + crimin + ate
      fairness|the same pay for the same work;treating everyone the same;some getting easier questions in a test|fairness is treating people equally; injustice is treating them unfairly|fairness 是公平；injustice 是不公|firmness=firmness is being hard or strict, not treating people equally=firmness 是坚定或严格，不是平等待人;injustice=injustice is unfair treatment, the opposite of the same pay for the same work or treating everyone the same=injustice 是不公，和同工同酬、一视同仁正相反|fair · ness|fair + ness|fair + ness
    `,
  },
});

const production = vocabularyTopic({
  id: "b2-words-production",
  title: t("Production and Trade", "生产和贸易"),
  summary: t(
    "Manufacturing and manufacturers; producing, production and output; consuming and consumption; suppliers and distribution; retail and wholesale.",
    "制造和制造商；生产、产量和产出；消费；供应商和分销；零售和批发。",
  ),
  intro: t(
    "The factory **manufactures** bikes, a **supplier** sends it the parts, and another firm handles the **distribution** to shops. These words help you talk about how goods are made, sold and used.",
    "这家工厂 **manufactures**（制造）自行车，一家 **supplier**（供应商）给它送零件，另一家公司负责向商店 **distribution**（分销）。这些词帮你谈论商品如何被生产、销售和使用。",
  ),
  prerequisites: ["b1-words-business"],
  words: [
    word(
      "manufacture manufactures manufactured manufacturing",
      "to make goods in large numbers, using machines",
      "（大量）制造；生产",
      "The company {manufactures} car parts, making a million a year on its machines.|distributes consumes | Most of our phones are {manufactured} in Asia, in huge factories, and then shipped here.|distributed consumed | The factory's machines stopped {manufacturing} toys last year and now make only furniture.|distributing consuming",
      "distribute consume",
      "produce",
    ),
    word(
      "manufacturer manufacturers",
      "a company that makes goods in large numbers",
      "制造商；厂商",
      "The {manufacturer} has recalled 10,000 cars that it made with faulty brakes. | She works for a toy {manufacturer} that makes dolls in its own factory. | Contact the {manufacturer}, the company that made the phone, if it breaks.",
      "consumer manager",
    ),
    word(
      "produce produces produced producing",
      "to make or grow something",
      "生产；产生",
      "The farm {produces} milk and cheese from its own cows.|consumes reduces | This region {produces} most of the country's rice in its wet fields.|consumes reduces | Plants {produce} oxygen, giving it off into the air.",
      "consume reduce",
      "manufacture",
    ),
    word(
      "production",
      "the process of making or growing things; a play or a film",
      "生产；产量；（戏剧等）作品",
      "{Production} of electric cars has doubled as new factories opened. | The factory stopped {production} for two weeks while its machines were repaired. | The school's {production} of the play was excellent, with great actors.",
      "consumption protection",
      "output",
    ),
    word(
      "output outputs",
      "the amount of something that a person, a machine or a country produces",
      "产量；产出",
      "The factory's {output} rose by 10 percent: it made more goods than ever. | Farm {output} fell because of the drought, so less food was grown. | Our {output} this month was 500 machines made.",
      "input outlet",
      "production",
    ),
    word(
      "consumption",
      "the using of energy, food or goods; the amount used",
      "消耗；消费（量）",
      "Energy {consumption} rises in winter, when people use more heating. | We must reduce our {consumption} of plastic and use less. | The {consumption} of sugar has fallen: people eat less of it.",
      "production assumption",
    ),
    word(
      "consume consumes consumed consuming",
      "to use energy, fuel or time; to eat or drink",
      "消耗；消费；吃喝",
      "This car {consumes} a lot of fuel: it uses ten liters every hundred kilometers.|produces assumes | Americans {consume} more meat than most people, eating it every day. | The fire {consumed} the whole building, burning it to the ground.|produced assumed",
      "produce assume",
    ),
    word(
      "supplier suppliers",
      "a company that provides goods to other businesses",
      "供应商",
      "We buy our paper from a local {supplier}. | The {supplier} delivered the parts late, so we couldn't make anything. | The shop changed {suppliers} to cut costs, buying from a cheaper one.|customers suppers",
      "customer supper",
    ),
    word(
      "distribute distributes distributed distributing",
      "to give things to many people; to send goods to shops",
      "分发；分销",
      "Volunteers {distributed} food among the refugees, giving a bag to each family.|collected disturbed | The company {distributes} its films around the world, sending them to cinemas.|collects disturbs | The teacher {distributed} the test papers, giving one to each student.|collected disturbed",
      "collect disturb",
    ),
    word(
      "distribution",
      "the giving or sending of things to many people or places; the way something is shared",
      "分配；分销",
      "The {distribution} of wealth is very unequal: a few people have most of it. | The company handles the {distribution} of the magazine, delivering it to shops. | Food {distribution}, giving out bags of rice, began after the flood.",
      "collection contribution",
    ),
    word(
      "retail",
      "the selling of goods to the public in shops",
      "零售",
      "She works in {retail}, selling clothes to shoppers. | The {retail} price that shoppers pay is \\$50. | Online sales hurt {retail} stores on the high street.",
      "wholesale detail",
    ),
    word(
      "wholesale",
      "the selling of goods in large amounts to shops, at low prices",
      "批发",
      "We buy rice in big sacks at {wholesale} prices. | The {wholesale} market, where shopkeepers buy in bulk, opens at four in the morning. | The farm sells its fruit {wholesale} to supermarkets by the ton.",
      "retail wholesome",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Production* is making things, while *consumption* is using them up. Ask whether the sentence is about factories and farms making goods or about people using energy, food or goods.",
        "*production* 是生产东西，*consumption* 是消耗东西。想想句子说的是工厂农场在生产，还是人们在消耗能源、食物或商品。",
      ),
      meaning: t(
        "*Retail* is selling to the public in shops, while *wholesale* is selling in large amounts to shops. Check whether the buyer in the meaning is a shopper or a shop.",
        "*retail* 是在店里卖给公众，*wholesale* 是大批量卖给商店。看释义里的买家是顾客还是商店。",
      ),
      spell: t(
        "*Manufacture* has -fac- in the middle, *supplier* doubles the p, and *wholesale* starts with a silent w.",
        "*manufacture* 中间是 -fac-，*supplier* 双写 p，*wholesale* 开头的 w 不发音。",
      ),
    },
    notes: `
      manufacture|a million car parts a year made on machines;phones made in huge factories in Asia;machines that now make only furniture|to manufacture is to make goods in large numbers; to distribute is to send them to shops|manufacture 是大量制造；distribute 是分销|distribute/distributes/distributed/distributing=distribute means to send goods out to shops or people, not to make them on machines in factories=distribute 是分发、分销，不是在工厂用机器制造;consume/consumes/consumed/consuming=consume means to use goods up, the opposite of making them on machines=consume 是消耗，和用机器制造正相反|man · u · fac · ture|manu + fac + ture|manu + fac + ture
      manufacturer|a company recalling cars it made;a company making dolls in its own factory;the company that made a phone|a manufacturer makes goods; a consumer buys and uses them|manufacturer 是制造商；consumer 是消费者|consumer=a consumer buys and uses goods, not the company that made the cars, dolls or phone=consumer 是消费者，不是制造汽车、玩偶或手机的公司;manager=a manager is a person who runs a team, not a company that makes goods in its factory=manager 是管理者，不是在工厂制造商品的公司|man · u · fac · tur · er|manufacture + r|manufacture + r
      produce|milk and cheese from a farm's own cows;rice grown in wet fields;oxygen given off into the air|to produce is to make or grow; to consume is to use up|produce 是生产；consume 是消耗|consume/consumes=consume means to use up or eat, the opposite of making milk, growing rice or giving off oxygen=consume 是消耗，和产奶、种稻、释放氧气正相反;reduce/reduces=reduce means to make something smaller or less, not to make or grow it=reduce 是减少，不是生产或种植|pro · duce|pro + duce|pro + duce
      production|electric cars made in new factories;making stopped while machines were repaired;a school play with great actors|production is making things; consumption is using them up|production 是生产；consumption 是消耗|consumption=consumption is using things up, not making cars in factories or putting on a play=consumption 是消耗，不是工厂造车或排演戏剧;protection=protection is keeping something safe, not the making of goods or a play=protection 是保护，不是生产商品或戏剧作品|pro · duc · tion|produce with the e dropped, then -tion|produce 去掉 e，再加 -tion
      output|more goods made than ever;less food grown in a drought;500 machines made in a month|output is what comes out or is made; input is what goes in|output 是产出；input 是投入|input=input is what is put in, such as money or work, not the goods or food that are made=input 是投入，不是生产出的商品或粮食;outlet=an outlet is a shop or a way out, not the amount that is made=outlet 是销售点或出口，不是产量|out · put|out + put, one word|out + put，连写成一个词
      consumption|more heating used in winter;using less plastic;people eating less sugar|consumption is using things up; production is making them|consumption 是消耗；production 是生产|production=production is making things, the opposite of using heating, plastic or sugar=production 是生产，和使用暖气、塑料或糖正相反;assumption=an assumption is something you believe without proof, not the using of energy or food=assumption 是假设，不是能源或食物的消耗|con · sump · tion|consume with -me changed to -mption|consume 的 -me 改成 -mption
      consume|ten liters of fuel every hundred kilometers;meat eaten every day;a building burned to the ground|to consume is to use up or eat; to produce is to make|consume 是消耗、吃喝；produce 是生产|produce/produces/produced=produce means to make something, the opposite of using fuel, eating meat or burning a building down=produce 是生产，和耗油、吃肉、烧毁建筑正相反;assume/assumes/assumed=assume means to believe something without proof, not to use up fuel or food=assume 是假定，不是消耗燃料或食物|con · sume|con + sume|con + sume
      supplier|a local company we buy paper from;a company that delivered parts late;a cheaper company the shop buys from|a supplier sells goods to a business; a customer buys from it|supplier 是供应商；customer 是顾客|customer/customers=a customer buys from you, the opposite of the company you buy paper or parts from=customer 是顾客，和你从其买纸或零件的公司正相反;supper/suppers=supper is an evening meal, not a company that provides goods=supper 是晚餐，不是供货的公司|sup · pli · er|supply with the y changed to i, then -er|supply 的 y 改成 i，再加 -er
      distribute|a bag of food for each refugee family;films sent to cinemas around the world;a test paper for each student|to distribute is to give things out to many; to collect is to gather them in|distribute 是分发；collect 是收集|collect/collects/collected=collect means to gather things in, the opposite of giving out bags, papers or films=collect 是收集，和分发袋子、试卷或电影正相反;disturb/disturbs/disturbed=disturb means to interrupt or worry someone, not to give things out to many people=disturb 是打扰，不是分发|dis · trib · ute|dis + trib + ute|dis + trib + ute
      distribution|wealth that a few people mostly have;a magazine delivered to shops;bags of rice given out after a flood|distribution is the giving out or sharing of things; collection is gathering them in|distribution 是分配、分发；collection 是收集|collection=collection is gathering things in, not the giving out of rice or delivering of magazines=collection 是收集，不是分发大米或配送杂志;contribution=a contribution is something you give to help, not the way wealth is shared or goods are sent out=contribution 是贡献，不是财富的分配或货物的配送|dis · tri · bu · tion|distribute with the e dropped, then -ion|distribute 去掉 e，再加 -ion
      retail|selling clothes to shoppers;the price shoppers pay;stores on the high street|retail is selling to the public; wholesale is selling in bulk to shops|retail 是零售；wholesale 是批发|wholesale=wholesale is selling in large amounts to shops, not selling to shoppers on the high street=wholesale 是批发给商店，不是在街边卖给顾客;detail=a detail is a small fact or part, not the selling of goods=detail 是细节，不是商品销售|re · tail|re + tail|re + tail
      wholesale|rice bought in big sacks;a market where shopkeepers buy in bulk;fruit sold by the ton to supermarkets|wholesale is selling in bulk to shops; retail is selling to the public|wholesale 是批发；retail 是零售|retail=retail is selling single items to the public, not big sacks, bulk buying or tons of fruit=retail 是零售给公众，不是整袋、成批或按吨销售;wholesome=wholesome means good for your health, not selling in large amounts=wholesome 是有益健康的，不是大批量销售|whole · sale|whole + sale, with a silent w|whole + sale，w 不发音
    `,
  },
});

const skills = vocabularyTopic({
  id: "b2-words-skills",
  title: t("Skills", "技能"),
  summary: t(
    "Expertise and competence; skilled and unskilled work; versatile, innovative and resourceful people; diligent, adaptable, analytical, persuasive and decisive.",
    "专业知识和能力；熟练和非熟练工作；多才多艺、富有创新和足智多谋的人；勤奋、适应力强、善于分析、有说服力和果断。",
  ),
  intro: t(
    "The company wants someone **versatile** and **adaptable**, with real **expertise** in design and an **analytical** mind. These words help you describe the skills and qualities people bring to a job.",
    "公司想找一个 **versatile**（多才多艺）、**adaptable**（适应力强）的人，要在设计上有真正的 **expertise**（专长），还要有 **analytical**（善于分析）的头脑。这些词帮你描述人们带到工作中的技能和品质。",
  ),
  prerequisites: ["b1-words-work-qualities"],
  words: [
    word(
      "expertise",
      "special knowledge or skill",
      "专业知识；专长",
      "We need someone with {expertise} in marketing, years of special knowledge. | Her {expertise} in medicine helped us solve the problem. | He doesn't have the technical {expertise} for this job: he's never studied engineering.",
      "ignorance expense",
      "competence",
    ),
    word(
      "competence",
      "the ability to do something well",
      "能力；胜任",
      "Nobody doubts her {competence} as a manager: she does the job very well. | The test checks your {competence} in English, how well you can use it. | Lack of {competence} cost him his job: he kept making serious mistakes.",
      "incompetence competition",
      "expertise",
    ),
    word(
      "skilled",
      "having the training and ability to do a job well",
      "熟练的；有技能的",
      "{Skilled} workers, with years of training, are in great demand. | She is the most {skilled} surgeon in the hospital, with a thousand operations behind her. | Making violins is {skilled} work that takes years to learn.",
      "unskilled spilled",
    ),
    word(
      "unskilled",
      "not having or not needing special training",
      "非技术的；无技能的",
      "{Unskilled} jobs, which need no training, are often badly paid. | Machines are replacing {unskilled} workers who do simple tasks. | He did {unskilled} work in a factory, packing boxes, which anyone could learn in a day.",
      "skilled unfilled",
    ),
    word(
      "versatile",
      "able to do many different things, or to be used in many ways",
      "多才多艺的；多用途的",
      "She's a {versatile} actor who can play any role. | Rice is a {versatile} food: you can cook it in many ways. | A {versatile} tool can do many jobs.",
      "volatile limited",
    ),
    word(
      "innovative",
      "using new methods or ideas",
      "创新的",
      "The company is known for its {innovative} products, which no one has made before. | We need {innovative} ideas, not the same old ones, to solve this problem. | Her teaching methods are very {innovative}: no other school uses them.",
      "traditional imitative",
    ),
    word(
      "resourceful",
      "good at finding ways to deal with problems",
      "足智多谋的；机敏的",
      "Stuck on the island, he had to be {resourceful} to survive. | A {resourceful} student finds answers even without a teacher. | She is {resourceful}: she can fix almost anything with what she has.",
      "helpless resentful",
    ),
    word(
      "diligent",
      "working hard and carefully",
      "勤奋的；认真的",
      "She is a {diligent} student who never misses a class. | After months of {diligent} work, they finished the report. | He is {diligent} and always checks his work twice.",
      "lazy delicate",
    ),
    word(
      "adaptable",
      "able to change to suit new situations",
      "适应力强的",
      "Good employees are {adaptable} and can learn new tasks quickly. | Rats are very {adaptable}: they can live almost anywhere. | Children are more {adaptable} than adults when they move abroad.",
      "rigid adoptable",
    ),
    word(
      "analytical",
      "good at studying things in detail to understand them",
      "善于分析的",
      "This job needs strong {analytical} skills to study data in detail. | She has an {analytical} mind and loves solving puzzles. | Science teaches {analytical} thinking: breaking problems into parts.",
      "emotional anatomical",
    ),
    word(
      "persuasive",
      "good at making people believe or do something",
      "有说服力的",
      "She made a {persuasive} argument for the plan, and everyone agreed. | Advertisements are designed to be {persuasive}, making you want to buy. | He was so {persuasive} that we all agreed.",
      "pervasive weak",
    ),
    word(
      "decisive",
      "able to make decisions quickly; having a strong effect on how something ends",
      "果断的；决定性的",
      "A good leader must be {decisive} in a crisis, making choices quickly. | The goal in the last minute was {decisive}: it won the match. | She took {decisive} action to save the company, acting quickly and firmly.",
      "hesitant divisive",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Skilled* and *unskilled* are opposites: *skilled* work needs years of training, while *unskilled* work can be learned quickly. Ask how much training the job in the sentence needs.",
        "*skilled* 和 *unskilled* 意思相反：*skilled* 的工作需要多年训练，*unskilled* 的工作很快就能学会。想想句子里的工作需要多少训练。",
      ),
      meaning: t(
        "*Expertise* is special knowledge in one field, while *competence* is being able to do a job well enough. Check whether the meaning is about deep, special knowledge or simply doing the job well.",
        "*expertise* 是某个领域的专门知识，*competence* 是能够胜任工作。看释义说的是深厚的专门知识，还是能把工作做好。",
      ),
      spell: t(
        "*Expertise* ends in -ise, *versatile* ends in -ile, and *diligent* has -gent at the end.",
        "*expertise* 以 -ise 结尾，*versatile* 以 -ile 结尾，*diligent* 结尾是 -gent。",
      ),
    },
    notes: `
      expertise|years of special knowledge in marketing;knowledge of medicine that solved a problem;technical knowledge from studying engineering|expertise is special knowledge or skill; ignorance is a lack of knowledge|expertise 是专长；ignorance 是无知|ignorance=ignorance is not knowing, the opposite of special knowledge that solves problems=ignorance 是无知，和能解决问题的专门知识正相反;expense=an expense is money spent, not knowledge or skill=expense 是开销，不是知识或技能|ex · per · tise|expert + ise|expert + ise
      competence|a manager who does the job very well;how well you can use English;serious mistakes that cost a job|competence is the ability to do something well; incompetence is the lack of it|competence 是能力、胜任；incompetence 是无能|incompetence=incompetence is being unable to do a job well, the opposite of doing it very well, and lacking it would not cost a job=incompetence 是无能，和把工作做得很好正相反，缺少它也不会丢工作;competition=competition is trying to beat others, not how well you do a job or use English=competition 是竞争，不是做事或用英语的能力|com · pe · tence|compet + ence, ending in -ence|compet + ence，以 -ence 结尾
      skilled|workers with years of training;a surgeon with a thousand operations;violin making that takes years to learn|skilled means trained and able to do a job well; unskilled means without special training|skilled 是熟练的；unskilled 是无技能的|unskilled=unskilled means without special training, the opposite of years of training or a thousand operations=unskilled 是无技能的，和多年训练、上千次手术正相反;spilled=spilled describes a liquid that has fallen out of a container, not a trained worker=spilled 是洒出的，不形容受过训练的工人|skilled|skill + ed, with a double l|skill + ed，双写 l
      unskilled|jobs that need no training;workers doing simple tasks;packing boxes anyone could learn in a day|unskilled means not needing special training; skilled means having it|unskilled 是非技术的；skilled 是熟练的|skilled=skilled means having special training, the opposite of jobs needing no training or work learned in a day=skilled 是熟练的，和无需训练、一天就能学会的工作正相反;unfilled=unfilled means empty or with nobody doing it, not without special training=unfilled 是空缺的，不是无需技能的|un · skilled|un + skilled|un + skilled
      versatile|an actor who can play any role;food you can cook in many ways;a tool that can do many jobs|versatile means able to do many things; limited means able to do only a few|versatile 是多才多艺、多用途的；limited 是有限的|volatile=volatile means likely to change suddenly or explode, not able to do many different things=volatile 是易变的、不稳定的，不是多才多艺的;limited=limited means able to do only a little, the opposite of any role, many ways or many jobs=limited 是有限的，和能演任何角色、做法多样、用途很多正相反|ver · sa · tile|versa + tile, ending in -ile|versa + tile，以 -ile 结尾
      innovative|products no one has made before;ideas that are not the same old ones;methods no other school uses|innovative means using new ideas; traditional means following old ways|innovative 是创新的；traditional 是传统的|traditional=traditional means following old ways, the opposite of products no one made before or methods no one else uses=traditional 是传统的，和前所未有、独一无二正相反;imitative=imitative means copying others, the opposite of something new that no one else has=imitative 是模仿的，和别人没有的新东西正相反|in · no · va · tive|innovate with the e dropped, then -ive|innovate 去掉 e，再加 -ive
      resourceful|surviving alone on an island;finding answers without a teacher;fixing almost anything with what she has|resourceful means good at finding ways to solve problems; helpless means unable to help yourself|resourceful 是足智多谋的；helpless 是无助的|helpless=helpless means unable to do anything for yourself, the opposite of surviving, finding answers or fixing things=helpless 是无助的，和求生、找到答案、修好东西正相反;resentful=resentful means feeling angry about unfair treatment, not good at solving problems=resentful 是愤恨的，不是善于解决问题的|re · source · ful|resource + ful, with a single l|resource + ful，只有一个 l
      diligent|a student who never misses a class;months of careful work to finish a report;checking work twice|diligent means working hard and carefully; lazy means not wanting to work|diligent 是勤奋的；lazy 是懒惰的|lazy=lazy means not wanting to work, the opposite of never missing a class or checking work twice=lazy 是懒惰的，和从不缺课、检查两遍正相反;delicate=delicate means easily broken or fine, not working hard and carefully=delicate 是精致的、易碎的，不是勤奋认真的|dil · i · gent|dili + gent, ending in -gent|dili + gent，以 -gent 结尾
      adaptable|employees who learn new tasks quickly;rats that can live almost anywhere;children who settle abroad more easily than adults|adaptable means able to change to suit new situations; rigid means unable to change|adaptable 是适应力强的；rigid 是僵化的|rigid=rigid means stiff and unable to change, the opposite of learning new tasks or living anywhere=rigid 是僵化的，和学新任务、到处都能生存正相反;adoptable=adoptable means able to be taken home and raised as your own, not able to change to suit new places=adoptable 是可被领养的，不是能适应新环境的|a · dapt · a · ble|adapt + able, with a after d|adapt + able，d 前是 a
      analytical|skills to study data in detail;a mind that loves solving puzzles;breaking problems into parts|analytical means good at studying things in detail; emotional means led by feelings|analytical 是善于分析的；emotional 是情绪化的|emotional=emotional means led by feelings, not studying data in detail or breaking problems into parts=emotional 是情绪化的，不是仔细研究数据或拆解问题;anatomical=anatomical is about the structure of the body, not about studying problems in detail=anatomical 是解剖学的，不是分析问题的|an · a · lyt · i · cal|analyt + ical, with y after l|analyt + ical，l 后是 y
      persuasive|an argument everyone agreed with;advertisements that make you want to buy;someone so convincing we all agreed|persuasive means good at making people agree; weak means not convincing|persuasive 是有说服力的；weak 是无力的|pervasive=pervasive means spreading everywhere, not good at making people agree=pervasive 是无处不在的，不是有说服力的;weak=weak means not strong or convincing, the opposite of an argument that made everyone agree=weak 是无力的，和让所有人都同意的论点正相反|per · sua · sive|persuade with -de changed to -sive|persuade 的 -de 改成 -sive
      decisive|a leader making choices quickly in a crisis;a last-minute goal that won the match;acting quickly and firmly to save a company|decisive means quick to decide or settling the result; hesitant means slow to act|decisive 是果断的、决定性的；hesitant 是犹豫的|hesitant=hesitant means slow to decide because you are unsure, the opposite of making choices quickly and acting firmly=hesitant 是犹豫的，和迅速果断地行动正相反;divisive=divisive means making people disagree, not quick to decide or winning a match=divisive 是造成分裂的，不是果断或决定胜负的|de · ci · sive|decide with -de changed to -sive|decide 的 -de 改成 -sive
    `,
  },
});

const success = vocabularyTopic({
  id: "b2-words-success",
  title: t("Success and Failure", "成功与失败"),
  summary: t(
    "Achieving and achievements; accomplishing and accomplishments; setbacks and obstacles; overcoming and persevering; perseverance and triumph; thriving and collapsing.",
    "实现和成就；完成和成就；挫折和障碍；克服和坚持不懈；毅力和胜利；兴旺和倒塌。",
  ),
  intro: t(
    "After every **setback** she chose to **persevere**, and in the end she **overcame** each **obstacle** and won the race. These words help you talk about reaching goals and the problems on the way.",
    "每次遇到 **setback**（挫折），她都选择 **persevere**（坚持不懈），最后 **overcame**（克服）了每一个 **obstacle**（障碍），赢得了比赛。这些词帮你谈论实现目标和一路上的困难。",
  ),
  prerequisites: ["b1-words-work-qualities"],
  words: [
    word(
      "achieve achieves achieved achieving",
      "to succeed in doing something after working hard",
      "实现；达到",
      "She {achieved} her dream of becoming a doctor and now works in a hospital.|abandoned archived | We {achieved} all our goals this year and celebrated our success.|abandoned archived | You can {achieve} anything if you work hard.",
      "abandon archive",
      "accomplish",
    ),
    word(
      "achievement achievements",
      "something good that you have done through hard work",
      "成就",
      "Winning the prize was a great {achievement} after years of work. | The moon landing was one of the greatest {achievements} in history.|failures agreements | Her {achievements} at school, top marks in every subject, were impressive.|failures agreements",
      "failure agreement",
      "accomplishment triumph",
    ),
    word(
      "accomplish accomplishes accomplished accomplishing",
      "to succeed in doing something",
      "完成；实现",
      "We {accomplished} a lot in one day and finished the whole job.|abandoned accompanied | It took years to {accomplish} the task, but she finally finished it. | What do you hope to {accomplish} this year? Name one goal.",
      "abandon accompany",
      "achieve",
    ),
    word(
      "accomplishment accomplishments",
      "something that you have succeeded in doing, especially something difficult",
      "成就；成绩",
      "Learning Chinese well is a real {accomplishment} to be proud of. | Finishing the marathon was her proudest {accomplishment}. | List your {accomplishments}, the things you are proud of, in your CV.|failures accompaniments",
      "failure accompaniment",
      "achievement triumph",
    ),
    word(
      "setback setbacks",
      "a problem that stops progress or makes things worse",
      "挫折",
      "The injury was a {setback} for her career: she missed a whole season. | Despite some {setbacks}, the project was a success.|triumphs breakthroughs | Losing the contract was a serious {setback} that cost us money.",
      "triumph breakthrough",
      "obstacle",
    ),
    word(
      "obstacle obstacles",
      "something that blocks your way or makes progress difficult",
      "障碍",
      "Lack of money is the biggest {obstacle} to success, stopping many people. | The horse jumped over the {obstacle}. | There are many {obstacles} in the way of peace.|advantages spectacles",
      "advantage spectacle",
      "setback",
    ),
    word(
      "overcome overcomes overcame overcoming",
      "to succeed in dealing with a problem or a difficulty",
      "克服；战胜",
      "She {overcame} her fear of public speaking and now gives talks to hundreds.|overlooked overtook | Together we can {overcome} any problem and solve it. | He has {overcome} many difficulties in his life and is now a successful doctor.|overlooked overtaken",
      "overlook overtake",
    ),
    word(
      "persevere perseveres persevered persevering",
      "to keep trying to do something difficult",
      "坚持不懈",
      "If you {persevere} and keep practicing, you will improve. | Despite her illness, she {persevered} and finally graduated.|quit despaired | It's hard, but you must {persevere}: don't stop now.",
      "quit despair",
    ),
    word(
      "perseverance",
      "the quality of continuing to try when something is difficult",
      "毅力；坚持不懈",
      "Learning a language takes {perseverance}: years of practice without giving up. | Her {perseverance} finally paid off after many failed attempts. | With {perseverance}, training every day for years, he became a champion.",
      "laziness preservation",
    ),
    word(
      "triumph triumphs",
      "a great success or victory; the feeling of joy it brings",
      "巨大成功；胜利",
      "The concert was a {triumph}: the audience stood and cheered. | The team returned home in {triumph}, carrying the cup. | The film tells of the {triumph} of good over evil.",
      "disaster trumpet",
      "achievement accomplishment",
    ),
    word(
      "thrive thrives thrived thriving",
      "to grow or develop very well; to be successful",
      "茁壮成长；兴旺",
      "Tomatoes {thrive} in hot weather and grow big and red. | The business is {thriving} after a difficult start, with sales growing fast.|withering struggling | Some children {thrive} when they are challenged, doing their best work under pressure.",
      "wither struggle",
    ),
    word(
      "collapse collapses collapsed collapsing",
      "to fall down suddenly; to fail suddenly and completely",
      "倒塌；崩溃；昏倒",
      "The bridge {collapsed} in the earthquake and fell into the river.|thrived relapsed | The company {collapsed} after losing its biggest customer, and everyone lost their jobs.|thrived relapsed | He {collapsed} on the stage and was taken to hospital.|thrived relapsed",
      "thrive relapse",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Persevere* is the verb and *perseverance* the noun: you *persevere* when things are hard, and the quality you show is *perseverance*. Ask whether the gap needs an action or a quality.",
        "*persevere* 是动词，*perseverance* 是名词：困难时你 *persevere*，你表现出的品质叫 *perseverance*。想想空格需要的是动作，还是品质。",
      ),
      meaning: t(
        "A *setback* is a problem that pushes you back after you have started, while an *obstacle* is something in your way that you must get past. Check whether the meaning is about losing progress or about a block ahead.",
        "*setback* 是起步后让你倒退的问题，*obstacle* 是挡在前面、必须越过的障碍。看释义说的是进展受挫，还是前方受阻。",
      ),
      spell: t(
        "*Achieve* puts i before e, *persevere* has no r after the first e, and *triumph* ends in -mph.",
        "*achieve* 是 i 在 e 前，*persevere* 第一个 e 后面没有 r，*triumph* 以 -mph 结尾。",
      ),
    },
    notes: `
      achieve|a dream of becoming a doctor who now works in a hospital;every goal reached and celebrated;anything reached by hard work|to achieve is to succeed after hard work; to abandon is to give up|achieve 是实现；abandon 是放弃|abandon/abandoned=abandon means to give something up, the opposite of reaching a dream or celebrating success=abandon 是放弃，和实现梦想、庆祝成功正相反;archive/archived=archive means to store old documents, not to succeed in reaching a goal=archive 是存档，不是达成目标|a · chieve|ach + ieve, with i before e|ach + ieve，i 在 e 前
      achievement|a prize won after years of work;the moon landing in history;top marks in every subject|an achievement is something good done through hard work; a failure is not succeeding|achievement 是成就；failure 是失败|failure/failures=a failure is not succeeding, the opposite of winning a prize, landing on the moon or top marks=failure 是失败，和获奖、登月、门门第一正相反;agreement/agreements=an agreement is a decision people share, not a success won through hard work=agreement 是协议，不是努力换来的成就|a · chieve · ment|achieve + ment, keeping the e|achieve + ment，保留 e
      accomplish|a whole job finished in one day;a task finally finished after years;one goal for this year|to accomplish is to succeed in doing something; to abandon is to give it up|accomplish 是完成；abandon 是放弃|abandon/abandoned=abandon means to give something up, the opposite of finishing a job or a task=abandon 是放弃，和完成工作或任务正相反;accompany/accompanied=accompany means to go somewhere with someone, not to succeed in doing a task=accompany 是陪同，不是完成任务|ac · com · plish|ac + com + plish, with a double c|ac + com + plish，双写 c
      accomplishment|speaking Chinese well, something to be proud of;the proudest moment of finishing a marathon;things you are proud of listed in a CV|an accomplishment is something difficult you succeeded in; a failure is not succeeding|accomplishment 是成就；failure 是失败|failure/failures=a failure is not succeeding, the opposite of something you are proud of=failure 是失败，和值得骄傲的事正相反;accompaniment/accompaniments=an accompaniment is music played with a singer or food served with a dish, not something you succeeded in=accompaniment 是伴奏或配菜，不是取得的成就|ac · com · plish · ment|accomplish + ment|accomplish + ment
      setback|an injury that cost a whole season;problems a project succeeded despite;a lost contract that cost money|a setback is a problem that slows progress; a breakthrough is a sudden advance|setback 是挫折；breakthrough 是突破|triumph/triumphs=a triumph is a great success, the opposite of an injury, a lost contract or problems to get past=triumph 是巨大成功，和受伤、丢合同或要克服的问题正相反;breakthrough/breakthroughs=a breakthrough is a sudden step forward, the opposite of something that pushes you back=breakthrough 是突破，和让你倒退的事正相反|set · back|set + back, one word|set + back，连写成一个词
      obstacle|lack of money stopping many people;something a horse jumped over;things in the way of peace|an obstacle is something that blocks your way; an advantage helps you|obstacle 是障碍；advantage 是优势|advantage/advantages=an advantage helps you, the opposite of something that stops people or stands in the way=advantage 是优势，和阻挡人们、挡在路上的东西正相反;spectacle/spectacles=a spectacle is an impressive show or sight, not something that blocks your way=spectacle 是壮观景象，不是阻挡你的东西|ob · sta · cle|ob + stacle, ending in -cle|ob + stacle，以 -cle 结尾
      overcome|a fear beaten by someone who now gives talks;any problem solved together;difficulties beaten by a now successful doctor|to overcome is to deal with a problem and win; to overlook is to fail to notice it|overcome 是克服；overlook 是忽视|overlook/overlooked=overlook means to fail to notice something, not to beat a fear or solve a problem=overlook 是忽视，不是战胜恐惧或解决问题;overtake/overtook/overtaken=overtake means to pass a car or runner ahead of you, not to beat a fear or a difficulty=overtake 是超车、超过，不是克服恐惧或困难|o · ver · come|over + come, one word|over + come，连写成一个词
      persevere|keeping practicing to improve;graduating despite illness;not stopping when it's hard|to persevere is to keep trying when things are hard; to quit is to stop|persevere 是坚持不懈；quit 是放弃|quit=quit means to stop trying, the opposite of keeping practicing, graduating or not stopping=quit 是放弃，和坚持练习、毕业、不停下正相反;despair/despaired=despair means to lose all hope, the opposite of keeping going until you succeed=despair 是绝望，和坚持到成功正相反|per · se · vere|per + se + vere, with no r after the first e|per + se + vere，第一个 e 后没有 r
      perseverance|years of practice without giving up;success after many failed attempts;training every day for years|perseverance is continuing to try; laziness is not wanting to try|perseverance 是毅力；laziness 是懒惰|laziness=laziness is not wanting to work, the opposite of years of practice or training every day=laziness 是懒惰，和多年练习、每天训练正相反;preservation=preservation is keeping something safe from damage, not continuing to try=preservation 是保护、保存，不是坚持努力|per · se · ver · ance|persevere with the e dropped, then -ance|persevere 去掉 e，再加 -ance
      triumph|a concert the audience stood and cheered;a team coming home with the cup;good winning over evil|a triumph is a great success; a disaster is a terrible failure|triumph 是巨大成功；disaster 是灾难|disaster=a disaster is a terrible event or failure, the opposite of cheering, winning a cup or good winning over evil=disaster 是灾难，和欢呼、夺冠、正义战胜邪恶正相反;trumpet=a trumpet is a musical instrument, not a great success=trumpet 是小号，不是巨大成功|tri · umph|tri + umph, ending in -mph|tri + umph，以 -mph 结尾
      thrive|tomatoes growing big and red in heat;a business with sales growing fast;children doing their best work under pressure|to thrive is to grow or do very well; to wither is to dry up and die|thrive 是茁壮成长、兴旺；wither 是枯萎|wither/withering=wither means to dry up and die or grow weaker, the opposite of growing big or sales growing fast=wither 是枯萎、衰败，和长得又大又红、销量猛增正相反;struggle/struggling=struggle means to have great difficulty, the opposite of growing well, fast sales or doing your best work=struggle 是挣扎，和长势好、销量快、表现最好正相反|thrive|th + rive, not *strive*|th + rive，别写成 *strive*
      collapse|a bridge that fell into a river;a company where everyone lost their jobs;a man taken to hospital from the stage|to collapse is to fall down or fail suddenly; to thrive is to do very well|collapse 是倒塌、崩溃；thrive 是兴旺|thrive/thrived=thrive means to do very well, the opposite of falling into a river, losing jobs or going to hospital=thrive 是兴旺，和坠河、失业、被送医正相反;relapse/relapsed=relapse means to become ill again after getting better, not to fall down or fail suddenly=relapse 是旧病复发，不是倒塌或突然失败|col · lapse|col + lapse, with a double l|col + lapse，双写 l
    `,
  },
});

const sequence = vocabularyTopic({
  id: "b2-words-linking-2",
  title: t("Words of Time and Sequence", "表示时间和顺序的词"),
  summary: t(
    "Regardless and accordingly; previously, initially, subsequently, eventually and ultimately; currently and seldom; presumably, apparently, evidently and undoubtedly.",
    "不管和相应地；以前、起初、随后、最终和归根结底；目前和很少；大概、显然、明显和无疑。",
  ),
  intro: t(
    "**Initially** the plan looked easy, but it **subsequently** ran into trouble and **ultimately** failed, **apparently** because of a missing part. These words help you link ideas in time, say how sure you are and show how one thing follows another.",
    "这个计划 **initially**（起初）看来很简单，但 **subsequently**（随后）遇到麻烦，**ultimately**（最终）失败了，**apparently**（据说）是因为少了一个零件。这些词帮你按时间连接想法、表达把握程度，并说明前因后果。",
  ),
  prerequisites: ["b2-words-linking-1"],
  words: [
    word(
      "regardless",
      "without being affected by something (regardless of)",
      "不管；不顾",
      "We'll go {regardless} of the weather, even if it rains. | She kept working, {regardless} of the danger, though the building was on fire. | Everyone is welcome, {regardless} of age, from babies to grandparents.",
      "because instead",
    ),
    word(
      "accordingly",
      "in a way that suits the situation; as a result",
      "相应地；因此",
      "The rules have changed, and you must act {accordingly}, following the new ones. | It's a formal dinner, so dress {accordingly}, in a suit and tie. | Prices rose, and sales fell {accordingly}, as you would expect.",
      "differently previously",
    ),
    word(
      "subsequently",
      "after something else happened; later",
      "随后；后来",
      "He was arrested in May and {subsequently} sent to prison in June. | The book came out in 1990 and was {subsequently} made into a film. | The first plan failed; the team {subsequently} tried a new approach.",
      "previously currently",
    ),
    word(
      "previously",
      "before now, or before a time in the past",
      "以前；先前",
      "She {previously} worked as a teacher, but now she is a lawyer. | The house, which we bought last year, was {previously} owned by a famous writer. | As I {previously} said, the meeting is at ten.",
      "subsequently currently",
    ),
    word(
      "initially",
      "at the beginning",
      "起初；最初",
      "{Initially}, I didn't like the city, but now I love it. | The project was {initially} planned for two years, but it took five. | Prices were {initially} low but soon rose.",
      "ultimately currently",
    ),
    word(
      "ultimately",
      "in the end; at the most basic level",
      "最终；归根结底",
      "{Ultimately}, after all the advice, it's your decision. | The plan {ultimately} failed after months of work. | We all {ultimately} want the same thing, whatever we say at first.",
      "initially previously",
      "eventually",
    ),
    word(
      "eventually",
      "in the end, after a long time or a lot of problems",
      "最后；终于",
      "After hours of waiting, the bus {eventually} came. | She {eventually} found a job after a year of searching. | You'll {eventually} get used to it, though it takes time.",
      "immediately previously",
      "ultimately",
    ),
    word(
      "currently",
      "at the present time",
      "目前；现在",
      "She is {currently} working in Paris, where she has lived since January. | The museum is {currently} closed for repairs, but it will open again in May. | {Currently}, there are 30 students in the class, though more will join next term.",
      "previously eventually",
    ),
    word(
      "presumably",
      "used to say that you think something is probably true",
      "大概；想必",
      "You're {presumably} tired after the long flight, though I can't be sure. | Nobody is here, so the meeting has {presumably} been cancelled, but no one has told us. | {Presumably}, she missed the train, but we can only guess.",
      "definitely certainly",
      "apparently evidently",
    ),
    word(
      "apparently",
      "used to say that you have heard something or that it seems true",
      "据说；看来",
      "{Apparently}, the shop is closing next month: that's what I've heard. | He {apparently} forgot about the meeting, or so his colleague says. | The fire was {apparently} started by a cigarette, according to early reports.",
      "definitely appropriately",
      "evidently presumably",
    ),
    word(
      "evidently",
      "in a way that is clear to see",
      "显然；明显地",
      "She was {evidently} upset by the news: anyone could see her tears. | {Evidently}, the plan hasn't worked: just look at the results. | The house had {evidently} been empty for years: dust covered everything.",
      "doubtfully evenly",
      "apparently presumably",
    ),
    word(
      "undoubtedly",
      "certainly; without doubt",
      "无疑；肯定",
      "She is {undoubtedly} the best player on the team: nobody can match her. | This is {undoubtedly} a difficult time for everyone, as we all know. | The internet has {undoubtedly} changed our lives: no one could deny it.",
      "doubtfully hardly",
    ),
    word(
      "seldom",
      "not often; rarely",
      "很少；不常",
      "We {seldom} see snow in this part of the country: maybe once in ten years. | He {seldom} speaks at a meeting, but when he does, people listen. | {Seldom} have I seen such a beautiful view: it was one of a kind.",
      "often always",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Previously* points back to an earlier time, while *subsequently* points forward to what came after. Ask whether the gap is before or after the other event in the sentence.",
        "*previously* 指向更早的时间，*subsequently* 指向之后发生的事。想想空格说的是在句中另一件事之前，还是之后。",
      ),
      meaning: t(
        "*Apparently* means you heard something or it seems true, while *evidently* means it is clear for anyone to see. Check whether the meaning rests on what people say or on what is plain to see.",
        "*apparently* 是听说或看来如此，*evidently* 是谁都看得出来。看释义依据的是别人的说法，还是显而易见的事实。",
      ),
      spell: t(
        "*Accordingly* has a double c, *subsequently* has -sequ- in the middle, and *undoubtedly* keeps the silent b of *doubt*.",
        "*accordingly* 双写 c，*subsequently* 中间是 -sequ-，*undoubtedly* 保留 *doubt* 里不发音的 b。",
      ),
    },
    notes: `
      regardless|going even if it rains;working on though the building was on fire;welcoming everyone from babies to grandparents|regardless of means not affected by something; because of means caused by it|regardless 是不管；because 是因为|because=because of means caused by something, the opposite of going even if it rains or welcoming every age=because of 表示由于，和即使下雨也去、各年龄都欢迎正相反;instead=instead of means in place of something, which makes no sense with weather, danger or age=instead of 表示代替，和天气、危险、年龄搭不上|re · gard · less|regard + less|regard + less
      accordingly|following the new rules;a suit and tie for a formal dinner;sales falling as you would expect after prices rose|accordingly means in a way that suits the situation; differently means in another way|accordingly 是相应地；differently 是不同地|differently=differently means in another way, the opposite of following the new rules, dressing for a formal dinner or falling as expected=differently 是不同地，和遵守新规、按场合着装、如预期下降正相反;previously=previously means at an earlier time, but here the action comes after the change=previously 是以前，而这里的行动发生在变化之后|ac · cord · ing · ly|ac + cording + ly, with a double c|ac + cording + ly，双写 c
      subsequently|prison in June after an arrest in May;a film made after a book came out in 1990;a new approach after the first plan failed|subsequently means after that; previously means before|subsequently 是随后；previously 是以前|previously=previously means before, but here each action comes after the other one=previously 是以前，而这里的动作都发生在另一件事之后;currently=currently means now, but here the actions happened in the past after another event=currently 是目前，而这里是过去某事之后发生的|sub · se · quent · ly|sub + sequent + ly|sub + sequent + ly
      previously|a teacher before becoming a lawyer;a writer who owned the house before we bought it;something said earlier|previously means before now; subsequently means after|previously 是以前；subsequently 是随后|subsequently=subsequently means after that, but here the action came before the lawyer job, the purchase or this moment=subsequently 是随后，而这里的动作发生在当律师、买房或此刻之前;currently=currently means now, but she is a lawyer now and we own the house now=currently 是现在，而她现在是律师，房子现在归我们|pre · vi · ous · ly|previous + ly|previous + ly
      initially|disliking a city at first but loving it now;planning two years but taking five;low prices that soon rose|initially means at the beginning; ultimately means in the end|initially 是起初；ultimately 是最终|ultimately=ultimately means in the end, but here the feeling or plan changed later, so the gap is about the start=ultimately 是最终，而这里后来情况变了，空格说的是开始;currently=currently means now, but here what is true now is different=currently 是现在，而这里现在的情况已不同|in · i · tial · ly|initial + ly, with a double l|initial + ly，双写 l
      ultimately|your decision after all the advice;a plan that failed after months;what we all want, whatever we say at first|ultimately means in the end; initially means at the beginning|ultimately 是最终；initially 是起初|initially=initially means at the beginning, the opposite of after all the advice, after months or beyond what we say at first=initially 是起初，和听完所有建议、几个月后、不管起初怎么说正相反;previously=previously means at an earlier time, not in the end=previously 是以前，不是最终|ul · ti · mate · ly|ultimate + ly, keeping the e|ultimate + ly，保留 e
      eventually|a bus that came after hours of waiting;a job found after a year of searching;getting used to something over time|eventually means in the end after a long time; immediately means at once|eventually 是终于；immediately 是立刻|immediately=immediately means at once, the opposite of after hours, after a year or over time=immediately 是立刻，和几小时后、一年后、需要时间正相反;previously=previously means before, but here the action comes at the end of the waiting=previously 是以前，而这里的动作在等待结束时才发生|e · ven · tu · al · ly|eventual + ly, with a double l|eventual + ly，双写 l
      currently|working in Paris since January;a museum closed until May;30 students now, with more next term|currently means at the present time; previously means before now|currently 是目前；previously 是以前|previously=previously means before now, but the work, the closing and the class size are true right now=previously 是以前，而工作、闭馆和班级人数都是现在的情况;eventually=eventually means in the end after a long time, but these things are already happening now=eventually 是最终，而这些事现在就在发生|cur · rent · ly|current + ly, with a double r|current + ly，双写 r
      presumably|being tired after a flight, though not sure;a meeting probably cancelled though no one has said;missing the train, only a guess|presumably means probably, as a guess; definitely means for sure|presumably 是大概；definitely 是肯定|definitely=definitely means for sure, the opposite of not being sure or only guessing=definitely 是肯定，和不确定、只是猜测正相反;certainly=certainly means without any doubt, the opposite of can't be sure or no one has told us=certainly 是毫无疑问，和不能确定、没人告知正相反|pre · sum · a · bly|presume with the e dropped, then -ably|presume 去掉 e，再加 -ably
      apparently|news of a shop closing that I've heard;forgetting a meeting, as a colleague says;a cigarette named in early reports|apparently means you have heard it or it seems true; definitely means it is certain|apparently 是据说、看来；definitely 是肯定|definitely=definitely means certain, not something you only heard or read in early reports=definitely 是确定的，不是只是听说或初步报道的事;appropriately=appropriately means in a suitable way, not based on what people say=appropriately 是恰当地，不是基于别人的说法|ap · par · ent · ly|apparent + ly, with a double p|apparent + ly，双写 p
      evidently|tears anyone could see;results that show a plan failed;dust covering everything|evidently means clear for anyone to see; doubtfully means with doubt|evidently 是显然；doubtfully 是怀疑地|doubtfully=doubtfully means with doubt, the opposite of tears anyone could see or dust covering everything=doubtfully 是怀疑地，和人人看得见的眼泪、满屋灰尘正相反;evenly=evenly means equally or smoothly, not in a way that is clear to see=evenly 是均匀地，不是显而易见地|ev · i · dent · ly|evident + ly|evident + ly
      undoubtedly|a player nobody can match;a difficult time we all know about;a change no one could deny|undoubtedly means without doubt; doubtfully means with doubt|undoubtedly 是无疑；doubtfully 是怀疑地|doubtfully=doubtfully means with doubt, the opposite of nobody can match her or no one could deny it=doubtfully 是怀疑地，和无人能比、无人能否认正相反;hardly=hardly means almost not, the opposite of being the best or changing our lives=hardly 是几乎不，和最好的、改变了生活正相反|un · doubt · ed · ly|un + doubt + ed + ly, with a silent b|un + doubt + ed + ly，b 不发音
      seldom|snow maybe once in ten years;someone who rarely speaks but is heard when he does;a view that was one of a kind|seldom means not often; often means many times|seldom 是很少；often 是经常|often=often means many times, the opposite of once in ten years or a view that was one of a kind=often 是经常，和十年一次、独一无二正相反;always=always means every time, the opposite of once in ten years or speaking only now and then=always 是总是，和十年一次、偶尔发言正相反|sel · dom|sel + dom|sel + dom
    `,
  },
});

const quantity = vocabularyTopic({
  id: "b2-words-quantity",
  title: t("Describing Quantity", "描述数量"),
  summary: t(
    "Abundant and scarce; sufficient, insufficient and adequate; excessive and substantial; minimal and modest; several, numerous, countless and enormous.",
    "丰富的和稀缺的；足够的、不足的和充分的；过度的和大量的；极少的和适度的；几个、众多的、无数的和巨大的。",
  ),
  intro: t(
    "In the valley, water is **abundant** and crops are **substantial**, but in the hills it is **scarce** and the harvest is **minimal**. These words help you say how much or how many there is and whether it is enough.",
    "山谷里水 **abundant**（充足），收成 **substantial**（可观），但山上水 **scarce**（稀缺），收成 **minimal**（极少）。这些词帮你说有多少，以及够不够。",
  ),
  prerequisites: ["b1-words-numbers-and-amounts"],
  words: [
    word(
      "abundant",
      "existing in large amounts; more than enough",
      "丰富的；充裕的",
      "Fish are so {abundant} here that even children catch them easily. | The region has {abundant} rain, so the land is green. | Food was {abundant}, and nobody went hungry.",
      "scarce insufficient",
    ),
    word(
      "scarce",
      "not available in large amounts; hard to find",
      "稀缺的；不足的",
      "Water is {scarce} in the desert, where it hardly ever rains. | Jobs were {scarce}, so many people left the town. | Fresh food became {scarce} during the war, and people went hungry.",
      "abundant plentiful",
    ),
    word(
      "sufficient",
      "enough for a purpose",
      "足够的；充分的",
      "We don't have {sufficient} money to buy a car. | Two hours is {sufficient} time to finish the test, so nobody needs to rush. | The evidence was not {sufficient} to prove he was guilty, so he went free.",
      "insufficient efficient",
      "adequate",
    ),
    word(
      "insufficient",
      "not enough for a purpose",
      "不足的；不够的",
      "The police had {insufficient} evidence to charge him, so they let him go. | The food aid was {insufficient} for so many refugees, and many went hungry. | His pay was {insufficient} to live on, so he took a second job.",
      "sufficient inefficient",
    ),
    word(
      "adequate",
      "enough, or good enough, for a purpose",
      "足够的；适当的",
      "The hotel was {adequate}, but not luxurious. | Make sure you get {adequate} sleep: eight hours a night. | The pay is {adequate} for a student: enough to live on.",
      "inadequate accurate",
      "sufficient",
    ),
    word(
      "excessive",
      "more than is necessary or reasonable",
      "过度的；过多的",
      "{Excessive} drinking damages the liver. | The price was {excessive}, far more than the thing was worth, so I didn't buy it. | The report criticized the {excessive} use of force by police.",
      "modest minimal",
    ),
    word(
      "substantial",
      "large in amount or importance",
      "大量的；重大的",
      "She earns a {substantial} salary and can afford a big house. | There has been a {substantial} increase in prices, from 10 to 15 dollars. | The storm caused {substantial} damage, destroying hundreds of homes.",
      "minimal modest",
      "enormous",
    ),
    word(
      "minimal",
      "very small in amount; as small as possible",
      "极少的；最低限度的",
      "The damage was {minimal}: just a few broken windows. | The job needs {minimal} training: you can start after one day. | The risk is {minimal} if you wear a helmet.",
      "substantial enormous",
    ),
    word(
      "numerous",
      "many",
      "众多的；许多的",
      "The singer has won {numerous} awards, too many to fit on one shelf. | We have met on {numerous} occasions, more times than I can remember. | {Numerous} studies, more than a hundred, show that exercise helps.",
      "few humorous",
      "countless",
    ),
    word(
      "countless",
      "too many to be counted",
      "无数的",
      "I've told you {countless} times: more than I can count! | {Countless} people, too many to count, visit the temple every year. | The war caused {countless} deaths: nobody knows how many died.",
      "few careless",
      "numerous",
    ),
    word(
      "enormous",
      "very large",
      "巨大的",
      "They live in an {enormous} house with twenty bedrooms. | An {enormous} crowd, a hundred thousand people, waited outside. | The project was an {enormous} success that made millions.",
      "anonymous ordinary",
      "substantial",
    ),
    word(
      "modest",
      "not large in size or amount; not talking much about your own success",
      "适度的；谦虚的",
      "They live in a {modest} flat near the station, with just two small rooms. | Prices rose by a {modest} 2 percent. | He is very {modest} about his success and never boasts.",
      "massive boastful",
    ),
    word(
      "several",
      "more than two but not very many",
      "几个；数个",
      "I have called her {several} times, three or four, but she never answers. | {Several} people, five in all, were hurt in the accident, but nobody died. | We waited for {several} hours, about three, before the doctor came.",
      "countless severe",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Sufficient* and *insufficient* are opposites: *sufficient* means enough, *insufficient* means not enough. Ask whether the sentence shows that what there is was enough or fell short.",
        "*sufficient* 和 *insufficient* 意思相反：*sufficient* 是足够的，*insufficient* 是不够的。想想句子表明的是够了，还是不够。",
      ),
      meaning: t(
        "*Numerous* means many, while *countless* means so many that they cannot be counted. Check whether the meaning says the number is simply large or too large to count.",
        "*numerous* 是许多的，*countless* 是多得数不清的。看释义说的是数量很多，还是多到数不过来。",
      ),
      spell: t(
        "*Sufficient* has a double f and -cient, *excessive* has a double s, and *substantial* ends in -tial.",
        "*sufficient* 双写 f，结尾是 -cient，*excessive* 双写 s，*substantial* 以 -tial 结尾。",
      ),
    },
    notes: `
      abundant|fish so many that children catch them;so much rain that the land is green;so much food that nobody went hungry|abundant means more than enough; scarce means hard to find|abundant 是丰富的；scarce 是稀缺的|scarce=scarce means hard to find, the opposite of fish children catch easily, green land or nobody hungry=scarce 是稀缺的，和孩子轻松捕到鱼、土地葱绿、无人挨饿正相反;insufficient=insufficient means not enough, the opposite of more than enough rain or food=insufficient 是不足的，和雨水、食物充足正相反|a · bun · dant|a + bund + ant, ending in -ant|a + bund + ant，以 -ant 结尾
      scarce|water in a desert where it hardly rains;jobs so few that people left town;fresh food in a war when people went hungry|scarce means hard to find; abundant means more than enough|scarce 是稀缺的；abundant 是丰富的|abundant=abundant means more than enough, the opposite of hardly any rain, people leaving or going hungry=abundant 是充足的，和几乎不下雨、人们离开、挨饿正相反;plentiful=plentiful means available in large amounts, the opposite of what is hard to find=plentiful 是大量的，和难以找到正相反|scarce|sc + arce, not *scared*|sc + arce，别写成 *scared*
      sufficient|money to buy a car;two hours so nobody needs to rush;evidence to prove guilt|sufficient means enough; insufficient means not enough|sufficient 是足够的；insufficient 是不足的|insufficient=insufficient means not enough, but here enough means nobody rushes, and not having it lets a man go free=insufficient 是不够的，而这里够了才不用赶，不够才会放人;efficient=efficient means working well without waste, not enough for a purpose=efficient 是高效的，不是足够的|suf · fi · cient|suf + fi + cient, with a double f|suf + fi + cient，双写 f
      insufficient|evidence too weak to charge a man;food aid that left many hungry;pay too low to live on|insufficient means not enough; sufficient means enough|insufficient 是不足的；sufficient 是足够的|sufficient=sufficient means enough, the opposite of letting a man go, people going hungry or needing a second job=sufficient 是足够的，和放人、挨饿、得打第二份工正相反;inefficient=inefficient means wasting time or energy, not too little for a purpose=inefficient 是低效的，不是数量不够|in · suf · fi · cient|in + sufficient|in + sufficient
      adequate|a hotel good enough but not luxurious;eight hours of sleep a night;pay enough to live on|adequate means enough or good enough; inadequate means not enough|adequate 是足够的、尚可的；inadequate 是不足的|inadequate=inadequate means not good enough, the opposite of eight hours of sleep or enough to live on=inadequate 是不够的，和八小时睡眠、够生活正相反;accurate=accurate means exactly correct, not good enough for a purpose=accurate 是准确的，不是够用的|ad · e · quate|ad + equate|ad + equate
      excessive|drinking that damages the liver;a price far more than something was worth;force used by police that was criticized|excessive means more than is reasonable; modest means not large|excessive 是过度的；modest 是适度的|modest=modest means not large or not too much, the opposite of damaging, far too high or criticized=modest 是适度的，和有害、过高、遭批评正相反;minimal=minimal means very small, the opposite of more than is reasonable=minimal 是极少的，和过量正相反|ex · ces · sive|ex + cess + ive, with a double s|ex + cess + ive，双写 s
      substantial|a salary that affords a big house;prices rising from 10 to 15 dollars;hundreds of homes destroyed|substantial means large in amount; minimal means very small|substantial 是大量的；minimal 是极少的|minimal=minimal means very small, the opposite of a big house, a large rise or hundreds of homes=minimal 是极少的，和买大房子、大幅上涨、数百间房屋正相反;modest=modest means fairly small, the opposite of affording a big house or destroying hundreds of homes=modest 是不多的，和买得起大房子、毁掉数百间房正相反|sub · stan · tial|sub + stan + tial, ending in -tial|sub + stan + tial，以 -tial 结尾
      minimal|just a few broken windows;training of only one day;a small risk with a helmet|minimal means very small; substantial means large|minimal 是极少的；substantial 是大量的|substantial=substantial means large, the opposite of a few windows, one day or a small risk=substantial 是大量的，和几扇窗、一天、小风险正相反;enormous=enormous means very big, the opposite of just a few windows or one day of training=enormous 是巨大的，和几扇窗、一天培训正相反|min · i · mal|mini + mal|mini + mal
      numerous|awards too many for one shelf;more meetings than I can remember;more than a hundred studies|numerous means many; few means not many|numerous 是众多的；few 是很少的|few=few means not many, the opposite of too many for a shelf or more than a hundred=few 是很少的，和一个架子放不下、上百项正相反;humorous=humorous means funny, not many in number=humorous 是幽默的，不是数量多|nu · mer · ous|numer + ous|numer + ous
      countless|times more than I can count;people too many to count;deaths nobody can number|countless means too many to count; few means not many|countless 是无数的；few 是很少的|few=few means not many, the opposite of more than I can count or nobody knowing how many=few 是很少的，和数不清、没人知道有多少正相反;careless=careless means not taking care, not too many to count=careless 是粗心的，不是数不清的|count · less|count + less|count + less
      enormous|a house with twenty bedrooms;a crowd of a hundred thousand;a success that made millions|enormous means very large; ordinary means normal and not special|enormous 是巨大的；ordinary 是普通的|anonymous=anonymous means without a known name, not very large=anonymous 是匿名的，不是巨大的;ordinary=ordinary means normal, the opposite of twenty bedrooms, a hundred thousand people or millions=ordinary 是普通的，和二十间卧室、十万人、赚几百万正相反|e · nor · mous|e + norm + ous|e + norm + ous
      modest|a flat with just two small rooms;a rise of only 2 percent;never boasting about success|modest means not large or not boasting; massive means very large|modest 是适度的、谦虚的；massive 是巨大的|massive=massive means very large, the opposite of two small rooms or only 2 percent=massive 是巨大的，和两间小屋、仅 2% 正相反;boastful=boastful means talking proudly about yourself, the opposite of never boasting, and it does not describe a flat or a rise=boastful 是自夸的，和从不炫耀正相反，也不形容房子或涨幅|mod · est|mod + est|mod + est
      several|three or four calls;five people hurt;about three hours of waiting|several means more than two but not many; countless means too many to count|several 是几个；countless 是无数的|countless=countless means too many to count, the opposite of three or four, five in all or about three=countless 是无数的，和三四次、一共五人、大约三小时正相反;severe=severe means very serious or strict, not a small number=severe 是严重的，不是一个小数目|sev · er · al|sever + al|sever + al
    `,
  },
});

// The passive with modals and perfect forms.

const joinWords = (...parts: readonly string[]) => parts.filter((p) => p !== "").join(" ");
const lower = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

/** perfects are the subject of a present perfect passive, has or have, the base form and the past participle of its verb, and the rest. */
const handPerfects: readonly (readonly [string, string, string, string, string])[] = [
  ["The new hospital", "has", "build", "built", "near the station"],
  ["Three hundred jobs", "have", "lose", "lost", "this year"],
  ["The report", "has", "publish", "published", "online"],
  ["The thieves", "have", "catch", "caught", ""],
  ["The meeting", "has", "cancel", "cancelled", ""],
  ["The money", "has", "steal", "stolen", "from the safe"],
  ["A new manager", "has", "appoint", "appointed", ""],
  ["The roads", "have", "clear", "cleared", "of snow"],
  ["Prices", "have", "raise", "raised", "again"],
  ["Your order", "has", "send", "sent", "to your address"],
  ["The workers", "have", "tell", "told", "about the changes"],
  ["The contract", "has", "sign", "signed", ""],
  ["Two new teachers", "have", "hire", "hired", ""],
  ["The broken window", "has", "repair", "repaired", ""],
  ["The documents", "have", "translate", "translated", "into English"],
  ["The winners", "have", "choose", "chosen", ""],
  ["The old office", "has", "paint", "painted", "white"],
  ["Our flight", "has", "delay", "delayed", "by two hours"],
  ["The plan", "has", "approve", "approved", ""],
  ["The emails", "have", "delete", "deleted", "by mistake"],
];

/** modals are the subject of a passive with a modal, the modal, the base form and the past participle of the verb, and the rest. */
const handModals: readonly (readonly [string, string, string, string, string])[] = [
  ["The workers", "could", "replace", "replaced", "with robots"],
  ["The report", "must", "write", "written", "by Friday"],
  ["Phones", "should", "switch", "switched", "off during the exam"],
  ["The rules", "can't", "break", "broken", ""],
  ["The meeting", "might", "cancel", "cancelled", "because of the storm"],
  ["This medicine", "should", "take", "taken", "after meals"],
  ["The form", "must", "sign", "signed", "in ink"],
  ["The tickets", "can", "buy", "bought", "online"],
  ["The results", "will", "announce", "announced", "next week"],
  ["More trees", "should", "plant", "planted", "in the city"],
  ["The problem", "can", "solve", "solved", "easily"],
  ["Prices", "may", "raise", "raised", "again next year"],
  ["The bridge", "will", "repair", "repaired", "next month"],
  ["Dogs", "must not", "leave", "left", "in hot cars"],
  ["The prize", "will", "give", "given", "to the best student"],
  ["The match", "might", "play", "played", "indoors"],
  ["Your bags", "must", "check", "checked", "before the flight"],
  ["The house", "could", "rent", "rented", "to students"],
  ["The waste", "must", "recycle", "recycled", ""],
  ["The old building", "may", "pull", "pulled", "down"],
  ["The data", "must", "store", "stored", "safely"],
];

/** passiveThings are a thing and whether it takes has; passiveDeeds are a base form, past participle and rest done to it. */
const passiveThings: readonly (readonly [string, boolean])[] = [
  ["The car", true],
  ["The bikes", false],
  ["The old sofa", true],
  ["The computers", false],
  ["The house", true],
  ["The boat", true],
  ["The tables", false],
];
const passiveDeeds: readonly (readonly [string, string, string])[] = [
  ["clean", "cleaned", ""],
  ["paint", "painted", ""],
  ["check", "checked", ""],
  ["repair", "repaired", ""],
  ["sell", "sold", ""],
  ["move", "moved", "to the new building"],
  ["replace", "replaced", ""],
];
const perfectTimes = ["this week", "", "again", "already", "twice this year"] as const;
const passiveModalWords = ["could", "must", "should", "will", "might", "can", "may"] as const;

/** perfects and modals are the hand-written passives and one for every thing and deed. */
const perfects: readonly (readonly [string, string, string, string, string])[] = [
  ...handPerfects,
  ...everyTriple(passiveThings, passiveDeeds, perfectTimes).map(
    ([[thing, has], [base, pp, rest], time]) => [thing, has ? "has" : "have", base, pp, joinWords(rest, time)] as const,
  ),
];
const modals: readonly (readonly [string, string, string, string, string])[] = [
  ...handModals,
  ...everyTriple(passiveThings, passiveDeeds, passiveModalWords).map(
    ([[thing], [base, pp, rest], modal]) => [thing, modal, base, pp, joinWords(rest, modal === "will" ? "next week" : "")] as const,
  ),
];

const modalPattern = (modal: string) => (modal === "can't" ? "[can't|cannot]" : modal === "must not" ? "[must not|mustn't]" : modal);

/** passiveIng is the -ing form of a base form whose past participle is given: making, cancelling, painting. */
const passiveIng = (base: string, pp: string): string =>
  pp === `${base}${base.at(-1) ?? ""}ed`
    ? `${base}${base.at(-1) ?? ""}ing`
    : /[^aeiou]e$/u.test(base)
      ? `${base.slice(0, -1)}ing`
      : `${base}ing`;

const perfectChoice: readonly ChoiceItem[] = perfects.map(
  ([s, aux, base, pp, rest], k): ChoiceItem => [
    `${joinWords(s, "___", rest)}.`,
    `${aux} been ${pp}`,
    k % 2 === 1 ? [`${aux} ${pp}`, `${aux} been ${base}`, `${aux} been ${passiveIng(base, pp)}`] : [`${aux} ${pp}`, `${aux} been ${base}`],
  ],
);

const modalChoice: readonly ChoiceItem[] = modals.map(
  ([s, modal, base, pp, rest], k): ChoiceItem => [
    `${joinWords(s, "___", rest)}.`,
    `${modal} be ${pp}`,
    k % 2 === 0
      ? [`${modal} ${base}`, `${modal} be ${base}`, `${modal} be ${passiveIng(base, pp)}`]
      : [`${modal} ${base}`, `${modal} be ${base}`],
  ],
);

const passiveChoice: readonly ChoiceItem[] = interleave([perfectChoice, modalChoice]);

const passiveTyped: readonly TypedItem[] = interleave([
  perfects.map(
    ([s, aux, base, pp, rest]): TypedItem => ({
      shown: `${joinWords("They have", pp, lower(s), rest)}.`,
      accepted: [`${joinWords(s, aux, "been", pp, rest)}.`],
      wrong: [`${joinWords(s, aux, pp, rest)}.`, `${joinWords(s, aux, "been", base, rest)}.`],
    }),
  ),
  modals.map(
    ([s, modal, base, pp, rest]): TypedItem => ({
      shown: `${joinWords("They", modal, base, lower(s), rest)}.`,
      accepted: [`${joinWords(s, modalPattern(modal), "be", pp, rest)}.`],
      canonical: `${joinWords(s, modal, "be", pp, rest)}.`,
      wrong: [`${joinWords(s, modal, base, rest)}.`, `${joinWords(s, modal, "be", base, rest)}.`],
    }),
  ),
]);

/** passiveRule names the passive of right: has or have been, or a modal and be, with the past participle. */
function passiveRule(right: string, subject: string): Text {
  const words = right.split(" ");
  const participle = words.at(-1) ?? "";
  if (right.includes(" been ")) {
    const aux = words[0] ?? "";
    return t(
      `The action is done to *${subject}*, and the tense is the present perfect, so the passive is *${aux} been* and the past participle *${participle}*`,
      `*${subject}* 是承受动作的一方，时态是现在完成时，所以被动语态是 *${aux} been* 加过去分词 *${participle}*`,
    );
  }
  const modal = words.slice(0, words.indexOf("be")).join(" ");
  return t(
    `The action is done to *${subject}*, so after *${modal}* the passive is *be* and the past participle *${participle}*`,
    `*${subject}* 是承受动作的一方，所以 *${modal}* 后面的被动语态是 *be* 加过去分词 *${participle}*`,
  );
}

/** subjectBefore is the subject of a sentence with a gap, in small letters. */
const subjectBefore = (shown: string) => lower((shown.split(" ___")[0] ?? "").trim());

/** whyNotPassive explains an active form, or the base form after be or been. */
const whyNotPassive = (wrong: string, right: string, shown: string, position: number): Text => {
  const subject = subjectBefore(shown);
  const be = right.includes(" been ") ? "been" : "be";
  if (position === 0)
    return t(
      `*${wrong}* is active—it says *${subject}* performed the action and leaves out *${be}*.`,
      `*${wrong}* 是主动形式，意思成了 *${subject}* 自己做了动作，而且漏掉了 *${be}*。`,
    );
  if (position === 2)
    return t(
      `*${wrong.split(" ").at(-1) ?? ""}* is the *-ing* form, making an active continuous verb rather than a passive past participle.`,
      `*${wrong.split(" ").at(-1) ?? ""}* 是 *-ing* 形式，构成了主动进行时，而不是被动所需的过去分词。`,
    );
  return t(
    `*${wrong.split(" ").at(-1) ?? ""}* is the base form; passive *${be}* must be followed by the past participle.`,
    `*${wrong.split(" ").at(-1) ?? ""}* 是动词原形，被动语态的 *${be}* 后面必须接过去分词。`,
  );
};

/** passiveWhy explains the passive in the gap of shown. */
const passiveWhy = (right: string, shown: string): Text => {
  const subject = subjectBefore(shown);
  const rule = passiveRule(right, subject);
  const be = right.includes(" been ") ? "has/have been" : "modal + be";
  return t(
    `${rule.en}: ${fill(shown, right)}\n\n**Check.** Confirm *${subject}* receives the action, so the verb needs *${be}* + past participle (*${right}*).`,
    `${rule["zh-CN"]}：${fill(shown, right)}\n\n**检验。** 确认 *${subject}* 是承受动作的一方，因此动词必须是 *${be}* + 过去分词（*${right}*）。`,
  );
};

/** passiveRewriteWhy explains a passive written from an active sentence with they. */
const passiveRewriteWhy = (right: string): Text => {
  const match = /^(.+?) ((?:has|have) been \S+|\S+(?: not)? be \S+)/u.exec(right);
  const subject = lower(match?.[1] ?? "");
  const rule = passiveRule(match?.[2] ?? right, subject);
  return t(
    `*They* means people in general, so leave it out and begin with *${subject}*. ${rule.en}: ${right}\n\n**Check.** Verify *${subject}* opens the sentence, *they* is omitted, and *be/been* + past participle matches the original tense or modal.`,
    `*They* 泛指人们，被动句中省略，以 *${subject}* 开头。${rule["zh-CN"]}：${right}\n\n**检验。** 核对句子以 *${subject}* 开头、省略了 *they*，且 *be/been* + 过去分词与原句时态或情态动词一致。`,
  );
};

const passiveForms: TopicDef = {
  id: "passive-with-modals-and-perfect-forms",
  title: t("The Passive with Modals and Perfect Forms", "情态动词和完成时的被动语态"),
  summary: t(
    "The factory has been closed. Jobs could be lost. The present perfect passive takes has or have been and the past participle; a modal passive takes the modal, be and the past participle.",
    "The factory has been closed. Jobs could be lost。现在完成时的被动语态用 has/have been 加过去分词；情态动词的被动语态用情态动词加 be 加过去分词。",
  ),
  intro: t(
    "In news and business reports, the result often matters more than who did it: *The bridge has been repaired* and *Costs must be reduced.* Adding passive *be* or *been* keeps the focus on the thing affected.",
    "新闻和工作报告常先交代结果而非执行者：*The bridge has been repaired*、*Costs must be reduced.* 只要在完成时或情态动词后加上 *been* 或 *be* 再接过去分词，就能把焦点放在受影响的事物上。",
  ),
  prerequisites: ["active-and-passive-voice", "present-perfect-or-past-simple"],
  encompasses: [
    { topic: "active-and-passive-voice", weight: 0.4 },
    { topic: "present-perfect-or-past-simple", weight: 0.2 },
  ],
  xp: 30,
  strand: "grammar",
  knowledgePoints: [
    point(
      "forms",
      t("Has been done and can be done", "has been done 和 can be done"),
      t(
        "The passive puts the thing that something happens to first. With a **perfect** or a **modal**, keep the passive *be* and change only the word before it:\n\n- present perfect: *has / have **been** + past participle*: *The hospital **has been built**.*\n- modal: *can, could, may, might, must, should, will + **be** + past participle*: *Jobs **could be lost**.*\n\n> **Watch out.** Do not drop *been* or *be* (*The report has published* means the report published something else), and never use a base verb or *-ing* form after *be/been* (*must be sign* is wrong).",
        "被动语态把承受动作的事物放在前面。和**完成时**或**情态动词**连用时，被动的 *be* 保留，只改变它前面的词：\n\n- 现在完成时：*has / have **been** + 过去分词*：*The hospital **has been built**.*\n- 情态动词：*can、could、may、might、must、should、will + **be** + 过去分词*：*Jobs **could be lost**.*\n\n中文常不用“被”字（“报告已经发表了”），英语却必须用被动形式。\n\n> **注意。** 不要漏掉 *been* 或 *be*（*The report has published* 意思成了“报告发表了别的东西”），也不要在 *be/been* 后用动词原形或 *-ing*（*must be sign* 是错的）。",
      ),
      choiceGenerator(t("Choose the words for the gap.", "选出填入空白处的词。"), passiveChoice, passiveWhy, whyNotPassive),
    ),
    point(
      "rewrite",
      t("From active to passive", "主动句改为被动句"),
      t(
        "Rewrite the sentence in the passive, beginning with the thing that the action happens to. *They* means people in general, so leave it out:\n\n- *They have sold the house.* → *The house has been sold.*\n- *They should plant more trees.* → *More trees should be planted.*\n\nKeep the tense or the modal of the active sentence, and keep the rest of the sentence in the same order.\n\n> **Watch out.** Check subject-verb agreement in the present perfect passive: *They have sold the house* shifts from plural *have* to singular *The house **has** been sold*.",
        "把句子改成被动语态，以承受动作的事物开头。*They* 泛指人们，被动句中省略：\n\n- *They have sold the house.* → *The house has been sold.*\n- *They should plant more trees.* → *More trees should be planted.*\n\n保持原句的时态或情态动词，句子其余部分的顺序不变。\n\n> **注意。** 现在完成时被动要重新核对主谓一致：*They have sold the house* 改成被动后，主语变成单数 *The house*，助动词也要跟着变成 *has*（*The house **has** been sold*）。",
      ),
      typedGenerator(
        "sentence-pattern",
        t("Rewrite the sentence in the passive.", "把句子改写成被动语态。"),
        passiveTyped,
        passiveRewriteWhy,
      ),
    ),
  ],
};

// Have something done.

/** causatives are the subject, the forms of have and of get, the object, the base form and the past participle of the verb, and the rest. */
const handCausatives: readonly (readonly [string, string, string, string, string, string, string])[] = [
  ["We", "had", "got", "the office", "paint", "painted", "last month"],
  ["I", "had", "got", "my hair", "cut", "cut", "yesterday"],
  ["She", "has", "gets", "her eyes", "test", "tested", "every year"],
  ["They", "are having", "are getting", "the kitchen", "rebuild", "rebuilt", ""],
  ["He", "had", "got", "his car", "repair", "repaired", "at the garage"],
  ["You", "should have", "should get", "your teeth", "check", "checked", "twice a year"],
  ["We", "will have", "will get", "the documents", "translate", "translated", "into English"],
  ["My parents", "had", "got", "a new roof", "put", "put", "on the house"],
  ["The company", "had", "got", "its website", "redesign", "redesigned", "last year"],
  ["I", "need to have", "need to get", "my suit", "clean", "cleaned", "before the wedding"],
  ["Lin", "had", "got", "her phone", "fix", "fixed", "in an hour"],
  ["We", "are going to have", "are going to get", "solar panels", "install", "installed", "next month"],
  ["He", "has", "gets", "his shirts", "iron", "ironed", "at a shop near his office"],
  ["They", "had", "got", "the contract", "check", "checked", "by a lawyer"],
  ["I", "must have", "must get", "my passport", "renew", "renewed", "before July"],
  ["She", "had", "got", "her portrait", "paint", "painted", "by a famous artist"],
  ["The school", "had", "got", "the classrooms", "clean", "cleaned", "over the holiday"],
  ["We", "had", "got", "the pizza", "deliver", "delivered", "to our door"],
  ["My grandmother", "has", "gets", "her shopping", "bring", "brought", "to her home every week"],
  ["He", "will have", "will get", "the parcel", "send", "sent", "by express post"],
  ["They", "had", "got", "the old tree", "cut", "cut", "down"],
  ["The manager", "had", "got", "the report", "print", "printed", "for the meeting"],
  ["You", "can have", "can get", "your name", "print", "printed", "on the T-shirt"],
  ["We", "had", "got", "the carpets", "wash", "washed", "after the party"],
  ["She", "is having", "is getting", "her wedding dress", "make", "made", "in Shanghai"],
  ["He", "had", "got", "a tooth", "pull", "pulled", "out"],
  ["They", "have", "get", "their windows", "clean", "cleaned", "once a month"],
  ["I", "want to have", "want to get", "my photo", "take", "taken", "by a professional"],
  ["The city", "had", "got", "the statue", "restore", "restored", ""],
  ["We", "should have", "should get", "the heating", "check", "checked", "before winter"],
  ["Tom", "had", "got", "his name", "engrave", "engraved", "on the ring"],
  ["My uncle", "has", "gets", "his hair", "cut", "cut", "every two weeks"],
];

/** serviceUsers are people who have things done; services are an object, the base form and participle, and the rest. */
const serviceUsers = ["We", "I", "She", "My parents", "Tom", "Our neighbors", "He"] as const;
const services: readonly (readonly [string, string, string, string])[] = [
  ["the car", "repair", "repaired", "at the garage"],
  ["the windows", "clean", "cleaned", ""],
  ["the roof", "fix", "fixed", ""],
  ["the walls", "paint", "painted", "blue"],
  ["the photos", "print", "printed", ""],
  ["the old sofa", "clean", "cleaned", ""],
  ["the lock", "change", "changed", ""],
  ["the bike", "check", "checked", ""],
  ["the documents", "translate", "translated", "into Spanish"],
  ["the grass", "cut", "cut", ""],
  ["the heating", "repair", "repaired", ""],
];
const serviceTimes: readonly (readonly [string, string, string])[] = [
  ["had", "got", "last week"],
  ["will have", "will get", "next week"],
  ["had", "got", "yesterday"],
  ["will have", "will get", "tomorrow"],
];

/** causatives are the hand-written sentences and one for every person and service, at a time. */
const causatives: readonly (readonly [string, string, string, string, string, string, string])[] = [
  ...handCausatives,
  ...everyTriple(serviceUsers, services, serviceTimes).map(
    ([who, [object, base, pp, rest], [have, get, time]]) => [who, have, get, object, base, pp, joinWords(rest, time)] as const,
  ),
];

const ingOf: Readonly<Record<string, string>> = { cut: "cutting", put: "putting" };

const causativeChoice: readonly ChoiceItem[] = causatives.map(
  ([s, have, , object, base, pp, rest]): ChoiceItem => [
    `${joinWords(s, "___", rest)}.`,
    `${have} ${object} ${pp}`,
    [`${have} ${pp} ${object}`, base === pp ? `${have} ${object} to ${base}` : `${have} ${object} ${base}`],
  ],
);

const participleChoice: readonly ChoiceItem[] = causatives.map(
  ([s, , get, object, base, pp, rest]): ChoiceItem => [
    `${joinWords(s, get, object, "___", rest)}.`,
    pp,
    base === pp ? [`to ${base}`, ingOf[base] ?? `${base}ing`] : [base, `to ${base}`],
  ],
);

const causativeTyped: readonly TypedItem[] = causatives.map(
  ([s, have, get, object, base, pp, rest]): TypedItem => ({
    shown: `${s} / ${have} / ${object} / ${base}${rest === "" ? "" : ` / ${rest}`}`,
    accepted: [`${joinWords(s, `[${have}|${get}]`, object, pp, rest)}.`],
    canonical: `${joinWords(s, have, object, pp, rest)}.`,
    wrong: [`${joinWords(s, have, pp, object, rest)}.`, `${joinWords(s, have, object, base === pp ? `to ${base}` : base, rest)}.`],
  }),
);

/** causativeOf finds the causative of a sentence with a gap, or of a written sentence. */
const causativeOf = (text: string) =>
  causatives.find(([s, , , , , , rest]) => text === `${joinWords(s, "___", rest)}.`) ??
  causatives.find(([s, , get, object, , , rest]) => text === `${joinWords(s, get, object, "___", rest)}.`) ??
  causatives.find(([s, have, , object, , pp, rest]) => text === `${joinWords(s, have, object, pp, rest)}.`);

/** causativeRule names the order of have or get, the thing and the past participle. */
function causativeRule(text: string): Text {
  const item = causativeOf(text);
  if (!item)
    return t(
      "Someone else does the job, so use *have*, the thing and the past participle",
      "这件事是别人做的，所以用 *have* 加事物再加过去分词",
    );
  const [, , , object, base, pp] = item;
  return t(
    `Someone else does the job to *${object}*, so *${object}* comes first and then the past participle of *${base}*, *${pp}*`,

    `这件事是别人做的，*${object}* 也不是动作的执行者，所以 *${object}* 放在 *${base}* 的过去分词 *${pp}* 前面`,
  );
}

/** causativeWhy explains have or get, the thing and the participle in the gap of shown. */
const causativeWhy = (right: string, shown: string): Text => {
  const rule = causativeRule(shown);
  return t(
    `${rule.en}: ${fill(shown, right)}\n\n**Check.** Verify the order—*have/get* + thing + past participle—because the thing receives the action.`,
    `${rule["zh-CN"]}：${fill(shown, right)}\n\n**检验。** 核对语序——*have/get* + 事物 + 过去分词——因为事物是承受动作的一方。`,
  );
};

/** whyNotCausative explains the participle before the thing, or a form that is not the participle. */
const whyNotCausative = (wrong: string, _right: string, shown: string, position: number): Text => {
  const item = causativeOf(shown);
  const pp = item?.[5] ?? "";
  const last = wrong.split(" ").at(-1) ?? "";
  if (position === 0 && wrong.split(" ").length > 1 && wrong.includes(` ${pp} `))
    return t(
      `*${wrong}* puts the participle before the thing, which says the subject did the job themselves.`,
      `*${wrong}* 把过去分词放在事物前面，意思成了主语自己做的这件事。`,
    );
  if (wrong.startsWith("to ") || wrong.includes(" to "))
    return t(
      `*to ${last}* implies the thing is meant to perform the action itself rather than receive it.`,
      `*to ${last}* 意思成了事物自己去做这个动作，而不是承受动作。`,
    );
  if (wrong.endsWith("ing"))
    return t(
      `*${last}* implies the thing is performing the action itself rather than having the work done to it.`,
      `*${last}* 意思成了事物自己正在做这个动作，而不是请人处理。`,
    );
  return t(
    `*${last}* is the base form, not the past participle needed after the object.`,
    `*${last}* 是动词原形，不是事物后面所需的过去分词。`,
  );
};

const causative: TopicDef = {
  id: "causative-have-and-get",
  title: t("Have Something Done", "让别人做某事（have something done）"),
  summary: t(
    "We had the office painted. When someone else does a job for the subject, use have or get, the thing, and the past participle.",
    "We had the office painted。主语安排别人为自己做某事时，用 have 或 get 加事物再加过去分词。",
  ),
  intro: t(
    "Say *I fixed my bike* and you picked up the wrench yourself; say *I had my bike fixed* and a mechanic did it for you. Placing the object between *have/get* and the past participle separates your own work from a service you arranged.",
    "说 *I fixed my bike* 是你自己修的；说 *I had my bike fixed* 才是请修车师傅修的。把事物夹在 *have/get* 和过去分词中间，就能区分“自己做”和“请人做”。",
  ),
  prerequisites: ["active-and-passive-voice"],
  encompasses: [{ topic: "active-and-passive-voice", weight: 0.2 }],
  xp: 25,
  strand: "grammar",
  knowledgePoints: [
    point(
      "order",
      t("Have, the thing, the participle", "have、事物、过去分词"),
      t(
        "When you arrange for someone else to do a job for you, use **have + the thing + past participle**:\n\n- *We **had the office painted**.* (Painters did it; we paid them.)\n- *I **had my hair cut** yesterday.*\n\n*Have* changes for the tense (*has*, *had*, *will have*, *is having*), while the past participle stays the same.\n\n> **Watch out.** Keep the thing **between** *have* and the participle: *We had painted the office* is the past perfect and means we painted it ourselves.",
        "安排别人为你做某事时，用 **have + 事物 + 过去分词**：\n\n- *We **had the office painted**.*（是油漆工刷的，我们付钱。）\n- *I **had my hair cut** yesterday.*\n\n中文说“我昨天剪了头发”，并不说明是谁剪的；英语要说 *I had my hair cut*，否则 *I cut my hair* 就是自己剪的。*have* 随时态变化（*has*、*had*、*will have*、*is having*），过去分词不变。\n\n> **注意。** 事物一定要放在 *have* 和过去分词**中间**：*We had painted the office* 是过去完成时，意思变成了我们自己刷的。",
      ),
      choiceGenerator(
        t("Someone else did the job for the subject. Choose the words for the gap.", "这件事是别人为主语做的。选出填入空白处的词。"),
        causativeChoice,
        causativeWhy,
        whyNotCausative,
      ),
    ),
    point(
      "get",
      t("Get something done", "get something done"),
      t(
        "In everyday English, *get* works in the same way as *have*: *We **got** the office **painted**.* *You should **get** your teeth **checked**.*\n\nAfter the thing comes the **past participle**, because the thing does not do the action: the teeth are checked.\n\n> **Watch out.** Never put a base verb, *to* + verb, or *-ing* after the object (*get your teeth check* or *get your teeth to check* is wrong)—always use the past participle.",
        "在日常英语中，*get* 的用法和 *have* 一样：*We **got** the office **painted**.* *You should **get** your teeth **checked**.*\n\n事物后面用**过去分词**，因为事物是被处理的一方：牙齿是被检查的。\n\n> **注意。** 事物后面不能接动词原形、*to* 不定式或 *-ing*（*get your teeth check* 或 *get your teeth to check* 都是错的），必须用过去分词。",
      ),
      choiceGenerator(t("Choose the word for the gap.", "选出填入空白处的词。"), participleChoice, causativeWhy, whyNotCausative),
    ),
    point(
      "write",
      t("Writing have something done", "写 have something done 的句子"),
      t(
        "Write a sentence from the parts: the subject, the form of *have*, the thing, the verb and the rest. Put the thing before the verb and change the verb into its past participle: *We / had / the office / paint / last month* becomes *We had the office painted last month.* You may use *get* instead of *have*.\n\n> **Watch out.** Do not leave the verb in its base form and do not place the participle before the object.",
        "根据各部分写句子：主语、*have* 的形式、事物、动词和其余部分。把事物放在动词前面，并把动词变成过去分词：*We / had / the office / paint / last month* 写成 *We had the office painted last month.* 也可以用 *get* 代替 *have*。\n\n> **注意。** 不要把动词留在原形，也不要把过去分词放到事物前面。",
      ),
      typedGenerator(
        "sentence-pattern",
        t("Write the sentence: someone else does the job for the subject.", "写出句子：别人为主语做这件事。"),
        causativeTyped,
        (right) => {
          const rule = causativeRule(right);
          return t(
            `${rule.en}: ${right}\n\n**Check.** Verify *have/get* + object + past participle, with the time or place phrase at the end.`,
            `${rule["zh-CN"]}：${right}\n\n**检验。** 核对 *have/get* + 事物 + 过去分词的语序，并确认时间或地点短语放在句末。`,
          );
        },
      ),
    ),
  ],
};

// Writing a report.

const reportBank: readonly WritingItem[] = [
  {
    task: "Your manager has asked for a report on whether staff should be allowed to work from home two days a week. You asked 40 members of staff.",
    model:
      "Introduction\nThe aim of this report is to consider whether staff should be allowed to work from home two days a week. It is based on a survey of 40 members of staff carried out in March.\n\nFindings\nThirty of the 40 staff were in favor of the idea. Most of them said that they would save between one and two hours a day on travel, and several believed that they would concentrate better at home. However, ten people had concerns. Four said that their homes were too small for a desk, and six felt that communication within teams would suffer. Managers also pointed out that some tasks, such as meeting clients, cannot be done from home.\n\nRecommendations\nIt is recommended that a six-month trial of two home-working days a week be introduced for staff whose work allows it. Teams should agree on one fixed day when everyone is in the office, so that meetings can take place in person. Staff without suitable space at home should be able to continue working in the office. At the end of the trial, the results should be reviewed by asking staff again and comparing the team's targets with the previous year.",
  },
  {
    task: "The student council has asked you to write a report on the school canteen. 120 students answered a questionnaire.",
    model:
      "Introduction\nThis report presents the results of a questionnaire about the school canteen, which was answered by 120 students in the second week of term. Its purpose is to suggest how the canteen could be improved.\n\nFindings\nOverall, students were fairly satisfied: 70 per cent rated the food as good or very good. The most common complaint, made by 64 students, concerned the long queues at lunchtime, which often last more than fifteen minutes. In addition, about a third of students felt that there were too few vegetarian dishes, and many said that the prices of drinks were too high. On the other hand, the new salad bar was praised by almost everyone who mentioned it.\n\nRecommendations\nFirst, lunch could be served in two sittings, with younger classes eating earlier, which would shorten the queues. Second, at least two vegetarian main dishes should be offered every day. Third, the canteen should consider selling water and fruit juice at lower prices to encourage healthier choices. Finally, it is suggested that the questionnaire be repeated at the end of the year to see whether these changes have made a difference.",
  },
  {
    task: "The town council wants to know how the public library is used and how it could attract more people. You have visitor figures and interviewed 25 visitors.",
    model:
      "Purpose\nThe purpose of this report is to describe how the public library is currently used and to recommend ways of attracting more visitors. It draws on the library's visitor figures for the last two years and on interviews with 25 visitors.\n\nCurrent use\nThe number of visitors fell from about 900 a week in 2023 to around 650 a week this year. Most visitors are either retired people, who come in the mornings to read newspapers, or students, who use the study room after school. Very few people between 25 and 50 visit the library. When asked why, several interviewees said that the opening hours, which end at 5 p.m., do not suit people who work.\n\nSuggestions from visitors\nVisitors would like longer opening hours, more computers and a quiet café area. Parents suggested activities for young children at weekends.\n\nRecommendations\nIt is recommended that the library stay open until 8 p.m. on at least two evenings a week. A weekend reading hour for children should be introduced, as this would also bring in parents. Finally, the council should advertise the library's online services, such as e-books, which many residents do not know about.",
  },
  {
    task: "You attended a three-day training course on customer service. Write a report for your manager saying what the course covered and whether other staff should attend.",
    model:
      "Introduction\nThis report describes the three-day customer service course that I attended from 4 to 6 June and considers whether other members of staff should attend it.\n\nContent of the course\nThe first day dealt with communication on the phone and by email, including how to write clear, polite replies. On the second day we practiced handling complaints through role plays, which were the most useful part of the course. The final day covered the company's new customer database and how to record each contact with a customer.\n\nEvaluation\nThe trainer was experienced and the materials were well organized. The role plays in particular gave practical techniques that I have already used, for example repeating the customer's problem before offering a solution. However, the session on the database was rather rushed, and some participants could not follow it. The course was also expensive, at \\$450 per person.\n\nRecommendations\nI would recommend that all staff who deal directly with customers attend the first two days of the course. The database training could be given more cheaply within the company, by a colleague who already knows the system well. Staff who attend should share what they have learned at a team meeting afterwards.",
  },
  {
    task: "A small design company tried a four-day working week for three months. Write a report for the directors on the results.",
    model:
      "Introduction\nThis report sets out the results of the three-month trial of a four-day working week, which ran from January to March. It is intended to help the directors decide whether to continue with it.\n\nProductivity\nThe company's output did not fall during the trial. The team completed 46 projects, compared with 44 in the same period last year, and only two deadlines were missed. Several managers noted that meetings had become shorter and more focused.\n\nStaff wellbeing\nAll 18 employees completed a questionnaire at the end of the trial. Sixteen said that they felt less tired, and the number of days lost to illness fell from 21 to 9. However, three people said that their working days had become stressful because they had to do the same amount of work in less time.\n\nClients\nMost clients did not notice the change. Two complained that nobody answered the phone on Fridays.\n\nRecommendations\nIt is recommended that the four-day week be made permanent. To keep clients satisfied, a small team should work on Fridays on a rota, taking a different day off instead. Workloads should be reviewed every three months so that no one is under too much pressure.",
  },
  {
    task: "The committee of a sports club has asked you to report on the state of its facilities, such as the changing rooms, the courts and the equipment.",
    model:
      "Introduction\nAt the request of the committee, this report examines the condition of the club's facilities and recommends which improvements should be made first. It is based on an inspection carried out last weekend and on comments from 30 members.\n\nChanging rooms\nThe changing rooms are in poor condition. Two of the six showers do not work, and the heating is often off in winter. Members described them as cold and dirty, and this was the most frequent complaint.\n\nCourts\nThe tennis courts are generally in good condition, although the lines on court 3 need repainting. The lights on the outdoor courts are not bright enough for evening games, which means that the courts cannot be used after 7 p.m. in winter.\n\nEquipment\nMost of the equipment in the gym is less than five years old and works well. However, the rowing machine has been broken for three months.\n\nRecommendations\nThe repair of the showers and the heating should be the first priority, since it affects every member. Brighter lights for the outdoor courts would allow the club to offer more evening sessions and so increase its income. The rowing machine should either be repaired or replaced as soon as possible.",
  },
  {
    task: "Your company wants fewer staff to drive to work. Write a report on how the 60 employees travel to work now and what could be done.",
    model:
      "Introduction\nThe aim of this report is to show how employees currently travel to work and to suggest ways of reducing the number who drive. Information was collected from a short survey answered by 52 of the 60 employees.\n\nCurrent situation\nThirty-one employees, more than half of those who replied, drive to work alone. Twelve come by bus or train, six walk and only three cycle. Most drivers live less than ten kilometers from the office. When asked why they drive, the most common reasons were that the bus is slow and that there is nowhere safe to leave a bicycle.\n\nPossible changes\nThere are several options. The company could provide a secure bicycle shelter and showers for cyclists. It could also help employees who live near each other to share cars. A third option would be to pay part of the cost of monthly bus and train passes.\n\nRecommendations\nIt is recommended that the company build a bicycle shelter, as this is cheap and was requested by eleven employees. An online board should be set up to help staff organize car sharing. Finally, paying half the cost of public transport passes would encourage those who live near bus routes to leave their cars at home.",
  },
  {
    task: "Your school sent 20 students on a two-week English summer program abroad. Write a report for the head teacher on whether the school should use the program again.",
    model:
      "Introduction\nThis report evaluates the two-week English summer program that 20 of our students attended in July. Its purpose is to help the head teacher decide whether to use the same program next year.\n\nThe lessons\nStudents had three hours of lessons every morning in small classes of no more than twelve. Most of them felt that their speaking had improved, and the end-of-course test showed an average improvement of eight points. However, several students found that the lessons repeated grammar they had already studied.\n\nAccommodation and activities\nStudents stayed with local families. Seventeen were very happy with their families, but three were placed far from the school and had to travel for an hour each way. The afternoon activities, including visits to museums and a football match, were very popular.\n\nCost\nThe total cost was \\$2,800 per student, which is slightly higher than other programs we considered.\n\nRecommendations\nOverall, the program was successful and should be used again. Before booking, the school should ask for students to be placed with families near the school. It would also be useful to send the students' test results in advance so that they can be put in classes at the right level.",
  },
  {
    task: "Write a report for the manager of an online shop on the complaints that customers made in the last three months, and what should be done about them.",
    model:
      "Introduction\nThis report analyzes the 186 complaints received from customers between April and June. It identifies the main problems and recommends how they could be dealt with.\n\nMain causes of complaints\nThe largest group of complaints, 84 in total, concerned late deliveries. Most of these orders were sent with the cheaper of our two delivery companies, which took on average six days instead of the promised three. The second most common problem was damaged goods, with 47 complaints; nearly all of them involved glass and ceramic products. A further 30 customers complained that it was difficult to contact us, as emails were sometimes not answered for a week.\n\nEffects\nAccording to our records, 22 customers who complained have not ordered again, and our average online rating fell from 4.5 to 4.1 stars.\n\nRecommendations\nFirst, the contract with the slower delivery company should be ended, or at least not renewed in its current form. Second, fragile products should be packed in stronger boxes, even though this will increase costs slightly. Third, a target of answering every email within 24 hours should be set, and an extra member of staff may be needed at busy times to meet it.",
  },
  {
    task: "A youth club has received a grant of \\$5,000. Write a report for its committee comparing two or three ways of spending the money and recommending one.",
    model:
      "Introduction\nThe club has received a grant of \\$5,000. This report compares three possible ways of using the money and recommends the one that would benefit the most members. Members' views were collected at the last monthly meeting.\n\nOption 1: new sports equipment\nNew equipment, such as table tennis tables and footballs, would cost about \\$2,000. It would be used every week, but most of the current equipment is still in reasonable condition.\n\nOption 2: a music room\nTurning the storeroom into a music room with instruments and recording equipment would cost the full \\$5,000. This was the most popular idea at the meeting, supported by 35 of the 50 members present. It would also attract young people who are not interested in sport.\n\nOption 3: trips\nThe money could pay for about five day trips. These would be enjoyable, but once the trips had taken place, nothing would be left for the future.\n\nRecommendation\nIt is recommended that the grant be used for the music room. It is clearly what most members want, and it would continue to benefit the club for many years. Volunteers could be asked to help with painting the room in order to keep costs down.",
  },
  {
    task: "Your office started a recycling scheme six months ago. Write a report for the office manager on its results.",
    model:
      "Introduction\nThis report reviews the recycling scheme that was introduced in the office six months ago. It looks at what has been achieved and where problems remain.\n\nResults\nThe scheme has been largely successful. The amount of general waste collected each week has fallen from twelve bags to seven, and about 40 kilograms of paper are now recycled every month. Most staff said in a short survey that they find the recycling bins easy to use.\n\nProblems\nHowever, several problems were found. Food is often put in the paper bin, which means that the whole bin cannot be recycled. In addition, there is only one bin for plastic, on the ground floor, so staff on the upper floors rarely use it. Finally, disposable cups are still used in large numbers in the kitchen: around 300 a week.\n\nRecommendations\nIt is recommended that clearer signs, with pictures, be placed above each bin. A plastic bin should be added on every floor. The office should also stop buying disposable cups and instead give each member of staff a reusable one. The results should be checked again in six months.",
  },
  {
    task: "The manager of a hotel has asked you to report on guests' comments from the last season and to suggest improvements.",
    model:
      "Introduction\nThe purpose of this report is to summarize the comments of guests during the summer season and to suggest improvements for next year. It is based on 210 online reviews and the comment cards left in the rooms.\n\nPositive comments\nGuests were very positive about the staff, who were described as friendly and helpful in more than half of the reviews. The location near the beach and the quality of the breakfast were also frequently praised.\n\nNegative comments\nThe main criticism, mentioned by about 60 guests, was the noise from the bar, which stays open until 1 a.m. below the rooms on the first floor. Around 40 guests complained that the wifi did not work in their rooms. Some families also said that there was nothing for children to do on rainy days.\n\nRecommendations\nFirst, the bar should close at midnight, or guests who want a quiet room should be offered rooms on the upper floors when they book. Second, the wifi network should be upgraded before the next season, since this is a simple problem to solve. Finally, a small games room for children could be created, which would make the hotel more attractive to families.",
  },
];

const report = judgedTopic({
  id: "writing-a-report",
  title: t("Writing a Report", "写报告"),
  summary: t(
    "Write a report of 200 to 250 words with headings for a manager or a committee: its purpose, what was found, and recommendations, in a neutral tone.",
    "为经理或委员会写一篇 200 到 250 词、带小标题的报告：目的、调查发现和建议，语气中立。",
  ),
  intro: t(
    "A committee reading a report on a new bus route wants three things fast: why the report was written, what the numbers showed, and what action to take next—organized under clear headings in neutral, factual prose.",
    "委员会看一份新公交线路报告时，最关心三件事：为什么写这份报告、调查数据发现了什么、下一步该怎么做——用清晰的小标题和中立客观的事实表达出来。",
  ),
  prerequisites: ["summarizing-a-text", "writing-a-formal-email"],
  encompasses: [
    { topic: "summarizing-a-text", weight: 0.2 },
    { topic: "writing-a-formal-email", weight: 0.2 },
  ],
  criteria: ["b2-report-purpose", "b2-report-headings", "b2-report-findings", "b2-report-recommendations", "b2-neutral-register"],
  point: {
    id: "report",
    title: t("Purpose, findings, recommendations", "目的、发现、建议"),
    explanation: t(
      "A report gives a reader, such as a manager or a committee, facts to help them decide something. It is organized so that it is easy to find information:\n\n1. **Introduction**: say what the report is about and who it is for: *The aim of this report is to... It is based on a survey of 40 staff.*\n2. **Findings**, in one or two sections with headings: give facts and figures, not feelings: *Thirty of the 40 staff were in favor... However, ten people had concerns.*\n3. **Recommendations**: say clearly what should be done, and make sure each recommendation follows from the findings: *It is recommended that... The company should...*\n\nUse **short headings**, a **neutral tone** and impersonal phrases (*It was found that..., Most people said...*). Write full forms (*do not*, not *don't*), and avoid words such as *awesome* or *terrible*.\n\n> **Watch out.** Never introduce a recommendation that is not backed by your findings, and never slip into chatty contractions or emotional adjectives.",
      "报告为读者（例如经理或委员会）提供事实，帮助他们做决定。它的结构要让人容易找到信息：\n\n1. **引言（Introduction）**：说明报告的内容和对象：*The aim of this report is to... It is based on a survey of 40 staff.*\n2. **发现（Findings）**，分一两个带小标题的部分：写事实和数字，不写感受：*Thirty of the 40 staff were in favor... However, ten people had concerns.*\n3. **建议（Recommendations）**：清楚地说明应该做什么，每条建议都要来自前面的发现：*It is recommended that... The company should...*\n\n用**简短的小标题**、**中立的语气**和非人称的说法（*It was found that..., Most people said...*）。不用缩写（写 *do not*，不写 *don't*），也不用 *awesome*、*terrible* 这样带感情的词。中文工作报告常先写背景和意义，英语报告则开门见山，直接说明目的。\n\n> **注意。** 不要提出前面“发现”里没有依据的建议，也不要混入口语缩写或情绪化形容词。",
    ),
  },
  question: t(
    "Write a report of 200 to 250 words in English, with headings. State its purpose, present what was found with facts, and end with recommendations, in a neutral tone.",
    "用英语写一篇 200 到 250 词、带小标题的报告。说明目的，用事实陈述发现，最后提出建议，语气中立。",
  ),
  bank: reportBank,
  limits: { minWords: 170, maxChars: 2400 },
  what: t("report", "报告"),
});

/** topics are the topics of the unit Work and the Economy. */
export const topics: readonly TopicDef[] = [
  economy.topic,
  companies.topic,
  management.topic,
  employment.topic,
  finance.topic,
  conditions.topic,
  production.topic,
  skills.topic,
  success.topic,
  sequence.topic,
  quantity.topic,
  passiveForms,
  causative,
  report,
];

/** vocabulary are the words the unit Work and the Economy teaches. */
export const vocabulary: readonly WordBatch[] = [
  economy.batch,
  companies.batch,
  management.batch,
  employment.batch,
  finance.batch,
  conditions.batch,
  production.batch,
  skills.batch,
  success.batch,
  sequence.batch,
  quantity.batch,
];
