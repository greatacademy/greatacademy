// Grade 12: the batches of words of rule and money, of elections, and of the senses: the style of prose, sound, light,
// movement and texture.

import { t } from "@ga/content";
import type { BatchSpec } from "../batch.ts";
import { batch } from "../grade-5/batches.ts";

const rule = batch(
  "words-of-crowns-and-colonies",
  ["Words of Crowns and Colonies", "王权与殖民地的词"],
  ["kinds of rule and their overthrow", "统治形式及其推翻"],
  `
  coup|a sudden, often violent, seizure of power by a small group|政变|Overnight the army staged a ___, seizing the radio station and arresting the president.|The ___ failed within a day, when loyal soldiers stopped the plotters from taking the palace.|After the sudden ___ that put a handful of officers in power, tanks filled the streets.|junta,regicide|coups
  junta|a military group that rules a country after taking power by force|军政府|The ___, the generals who had seized power, banned all newspapers.|A ___ of three generals, who had taken the country by force, ran it for twenty years.|The ruling ___ of army officers promised elections but never held them.|coup,theocracy|juntas
  monarchy|a country ruled by a king or queen, or that system of rule|君主制，君主国|Britain is a constitutional ___, with a king who reigns while parliament makes the laws.|Italy abolished its ___ in 1946, sending the king into exile.|Some people want to bring back the ___, with a queen on the throne once more.|theocracy,fiefdom|monarchies
  theocracy|a country ruled by religious leaders|神权政治，神权国家|The city became a ___ under the priests, who made every law in the name of God.|In such a ___, the law of religion is the law of the land and priests are the judges.|The rebels wanted to build a ___, a state ruled by their religious leaders.|monarchy,junta|theocratic
  regicide|the killing of a king or queen|弑君|The play is about a ___, the murder of a king, and its bloody results.|After the revolution he was tried for ___, having signed the order to execute the king.|In the old kingdom, ___, killing the king, was the worst crime of all.|coup,serfdom|
  vassal|a person or country that owes loyalty and service to a more powerful one|诸侯，附庸|The ___ knelt and swore loyalty to his lord, promising to serve him in war.|The small state became a ___ of its neighbor, obeying its orders and paying it tribute.|Each ___ sent soldiers to the king in time of war, as his oath required.|serfdom,fiefdom|vassals
  fiefdom|land held by a lord in return for service; an area someone controls as if it were their own|封地；势力范围|The duke ruled his ___, the lands granted him by the king, as if he were a king himself.|The department became the manager's private ___, run as though it belonged to him.|The ___, with all its fields and villages, passed from father to son.|vassal,monarchy|fiefdoms
  serfdom|the state of being a serf, a farm worker bound to a lord's land|农奴制|Russia ended ___ in 1861, freeing millions of peasants from the land of their lords.|For centuries ___ tied families to the land, forbidding them to leave their lord's estate.|The novel shows the misery of ___, of peasants who could be sold along with the land they worked.|vassal,regicide|
  colonial|having to do with a colony or with colonialism|殖民的，殖民地的|The ___ government, ruling the island from across the sea, taxed the farmers heavily.|The town has fine ___ houses, built by the settlers who ruled the land two centuries ago.|Many ___ borders, drawn by European empires across the whole continent, cut through tribal lands.|municipal,secular|
  imperialism|the policy of extending a country's power by taking control of other countries|帝国主义|The book criticizes European ___ in Africa, where whole countries were seized as colonies.|In the nineteenth century ___ led to wars over colonies, as empires raced to grab more land.|He saw the trade deal as economic ___, a way for a powerful country to control weaker ones.|monarchy,serfdom|imperialist
  `,
  "context-clues",
  {
    intro: t(
      "The **monarchy** fell to a **coup**, a **junta** of generals took over, and the old **colonial** borders that **imperialism** had drawn were redrawn again. These ten words help you describe kinds of rule, from kings and lords to empires and generals, and the ways they are overthrown.",
      "君主制（**monarchy**）在政变（**coup**）中垮台，一个由将军组成的军政府（**junta**）接管了国家，帝国主义（**imperialism**）划定的旧殖民（**colonial**）边界又被重新划过。这十个词帮你描述各种统治形式，从国王、领主到帝国和将军，以及它们被推翻的方式。",
    ),
    watchOut: {
      meanings: t(
        "A **coup** is the sudden seizure of power, while a **junta** is the group of officers who rule after it; the coup happens overnight, the junta may rule for twenty years.",
        "**coup** 是突然夺权的事件，**junta** 是夺权后统治的军官集团；coup 一夜之间发生，junta 可能统治二十年。",
      ),
      use: t(
        "A **vassal** is the person who serves a lord, while a **fiefdom** is the land he holds in return, and **serfdom** is the bondage of the peasants who work it.",
        "**vassal** 是为领主效力的人，**fiefdom** 是他作为回报得到的封地，**serfdom** 是在封地上劳作的农民所受的奴役。",
      ),
      spelling: t(
        "**Coup** has a silent p, **junta** has a j that may sound like h, and **regicide** ends in -cide, as in *homicide*.",
        "**coup** 的 p 不发音；**junta** 的 j 可读作 h；**regicide** 结尾是 -cide，同 *homicide*。",
      ),
    },
    notes: `
      coup|an army seizing a radio station overnight and arresting a president|plotters stopped from taking a palace within a day|a sudden seizure putting a few officers in power|a coup is a sudden seizure of power; a junta is the military group that rules afterward|coup 是政变；junta 是军政府|a junta is the group of officers who rule, not the sudden overnight act of seizing power|junta 是统治的军官集团，不是一夜之间夺权的行动|regicide is the killing of a king, not the seizing of a radio station, a palace or power by a small group|regicide 是弑君，不是一小撮人夺取电台、王宫或政权|coup|the silent p|p 不发音
      junta|generals who seized power banning newspapers|three generals running a country for twenty years|army officers who never held their promised elections|a junta is a military group ruling after seizing power; a coup is the seizure itself|junta 是军政府；coup 是政变|a coup is the sudden act of seizing power, not the generals who then ban papers and rule for years|coup 是突然夺权的行动，不是之后禁报、统治多年的将军们|a theocracy is rule by religious leaders, not by generals and army officers|theocracy 是宗教领袖的统治，不是将军和军官的统治|jun · ta|the j, which may sound like h|j 可读作 h
      monarchy|a king who reigns while parliament makes laws|a king sent into exile in 1946|a queen on the throne once more|a monarchy is rule by a king or queen; a theocracy is rule by religious leaders|monarchy 是君主制；theocracy 是神权政治|a theocracy is ruled by priests, not by a king or queen on the throne|theocracy 由祭司统治，不是由国王或女王在位统治|a fiefdom is one lord's land, not a whole country with a king or queen|fiefdom 是一位领主的封地，不是由国王或女王统治的国家|mon · ar · chy|the ch sounding like k|ch 读作 k
      theocracy|priests making every law in the name of God|religious law as the law of the land|a state ruled by religious leaders|a theocracy is a country ruled by religious leaders; a monarchy is ruled by a king or queen|theocracy 是神权国家；monarchy 是君主国|a monarchy is ruled by a king or queen, not by priests making laws in God's name|monarchy 由国王或女王统治，不是由祭司以神的名义立法|a junta is rule by generals, not by priests and religious law|junta 是将军统治，不是祭司和宗教法统治|the · oc · ra · cy|the -cracy ending|结尾是 -cracy
      regicide|the murder of a king in a play|signing the order to execute a king|killing the king, the worst crime of all|regicide is the killing of a king or queen; a coup is a sudden seizure of power|regicide 是弑君；coup 是政变|a coup seizes power, but this is the murder or execution of a king himself|coup 是夺取政权，而这里是谋杀或处决国王本人|serfdom is the bondage of peasants, not the killing of a king|serfdom 是农民所受的奴役，不是弑君|reg · i · cide|the -cide ending, as in *homicide*|结尾 -cide，同 *homicide*
      vassal|a man kneeling to swear loyalty to his lord|a small state obeying and paying tribute to its neighbor|lords sending soldiers to the king as their oath required|a vassal owes loyalty and service to a more powerful one; serfdom is the bondage of peasants|vassal 是封臣、附庸；serfdom 是农奴制|serfdom is a condition of bondage, not a person or state that swears loyalty and sends soldiers|serfdom 是一种奴役状态，不是宣誓效忠、派兵的人或国家|a fiefdom is the land a lord holds, not the person or state that kneels, obeys and serves|fiefdom 是领主的封地，不是下跪、服从、效力的人或国家|vas · sal|the double s|双写 s
      fiefdom|lands granted by a king and ruled by a duke|a department run as though it belonged to its manager|fields and villages passing from father to son|a fiefdom is land held in return for service, or an area someone controls; a vassal is the person who serves|fiefdom 是封地、势力范围；vassal 是封臣|a vassal is the person who serves a lord, not the lands, department or villages he controls|vassal 是为领主效力的人，不是他掌管的土地、部门或村庄|a monarchy is a whole kingdom ruled by a king, not one lord's lands or one manager's department|monarchy 是国王统治的整个王国，不是一位领主的土地或一个经理的部门|fief · dom|the ie in *fief*|*fief* 中是 ie
      serfdom|millions of peasants freed in 1861|families forbidden to leave a lord's estate|peasants sold along with the land they worked|serfdom is the bondage of farm workers to a lord's land; a vassal is a lord who serves a greater one|serfdom 是农奴制；vassal 是封臣|a vassal is a person who serves a lord, not the bondage that tied millions of peasants to the land|vassal 是效忠领主的人，不是把千百万农民束缚在土地上的制度|regicide is killing a king, not the bondage of peasants to the land|regicide 是弑君，不是农民被束缚在土地上|serf · dom|*serf* plus -dom|*serf* 加 -dom
      colonial|a government ruling an island from across the sea|houses built by settlers who ruled the land|borders drawn by European empires across a continent|colonial means having to do with a colony; municipal means having to do with a city|colonial 是殖民的；municipal 是市政的|municipal means belonging to a city's government, not to rulers from across the sea, settlers or empires|municipal 是城市政府的，不属于海外统治者、殖民者或帝国|secular means not religious, which says nothing about settlers, empires or rule from across the sea|secular 是非宗教的，与殖民者、帝国或海外统治无关|co · lo · ni · al|*colony* turned into -ial|由 *colony* 变为 -ial
      imperialism|whole African countries seized as colonies|empires racing to grab more land|a powerful country controlling weaker ones through trade|imperialism is extending power by taking control of other countries; a monarchy is rule by a king|imperialism 是帝国主义；monarchy 是君主制|a monarchy is rule by a king at home, not a policy of seizing other countries and grabbing land|monarchy 是本国的君主统治，不是夺取他国、抢占土地的政策|serfdom is the bondage of peasants, not a powerful country taking control of other countries|serfdom 是农民所受的奴役，不是强国控制他国|im · pe · ri · al · ism|*imperial* plus -ism|*imperial* 加 -ism
    `,
  },
);

const money = batch(
  "words-of-debt-and-credit",
  ["Words of Debt and Credit", "债务与信贷的词"],
  ["borrowing, owing and accounts", "借贷、欠债与账目"],
  `
  asset|something of value that a person or company owns; a useful quality|资产；有利条件|The house, worth more than everything else they own, is the family's biggest ___.|Her calm is a great ___ in a crisis, a quality that helps everyone around her.|To pay its debts, the company sold every ___ it owned, from its offices to its trucks.|liability,collateral|assets
  liability|money owed; legal responsibility; a person or thing that causes problems|负债；责任；累赘|The firm's debts and every other ___, all the money it owed, grew faster than its income.|The owner denied any ___ for the accident, saying he was not legally responsible.|Breaking down every week, the old car became a costly ___ rather than a help.|asset,debtor|liabilities
  collateral|property promised to a lender as security for a loan|抵押品|She offered her house as ___ for the loan, so the bank could take it if she failed to pay.|Without ___, without any property to promise the lender, he was refused by every bank.|The ship served as ___, to be seized by the lender if the loan was not repaid.|mortgage,asset|
  mortgage|a loan to buy a house, with the house as security|抵押贷款|They took out a ___ to buy the flat, borrowing most of the price from the bank.|The ___ on the house will be paid off in twenty years, after the last monthly payment.|Rising interest rates made every ___ more costly for families paying off their homes.|collateral,deflation|mortgages,mortgaged
  deflation|a general fall in prices|通货紧缩|During ___, as prices keep falling, people delay buying in the hope that things will be cheaper next month.|Japan suffered years of ___, with prices in the shops sliding lower every year.|The bank feared ___, a steady fall in prices, more than inflation.|mortgage,audit|deflationary
  bankrupt|unable to pay one's debts|破产的|The airline went ___ last year, unable to pay the money it owed.|The ___ farmer, deep in debts he could never pay, sold his land.|The scandal left him morally ___, with no honor or decency left at all.|moneyed,well-heeled|bankruptcy
  arrears|money that is owed and should already have been paid|欠款，拖欠|The tenant was three months in ___ with the rent, having paid nothing since spring.|The council chased families in ___, those whose bills were long overdue.|He paid off his ___ at last, all the overdue rent he had owed for a year.|audit,collateral|
  audit|an official check of the financial accounts of a company or person|审计，查账|The ___, a careful check of every account, found that money was missing.|Every year the charity's books go through an official ___, checked line by line by outside accountants.|The tax office ordered a full ___ of his accounts, checking every receipt for five years.|deflation,mortgage|audited,auditor
  creditor|a person or company to whom money is owed|债权人|The ___, owed ten thousand dollars, demanded payment within a week.|The company owed money to every ___, from its bank to its suppliers.|Each ___ received only half of what he was owed when the firm closed.|debtor,asset|creditors
  debtor|a person or country that owes money|债务人|The ___, who owed more than he earned, could not pay on time.|After the war the country became a ___, owing billions to its allies.|Old laws sent every ___ who could not repay his loans to prison.|creditor,liability|debtors
  `,
  "context-clues",
  {
    intro: t(
      "The **debtor** fell into **arrears**, the **creditor** demanded payment, and the bank seized the house that served as **collateral** for his **mortgage**. These ten words help you talk about borrowing and owing, what people own and owe, and how accounts are checked.",
      "债务人（**debtor**）拖欠了款项（**arrears**），债权人（**creditor**）要求还钱，银行没收了作为抵押贷款（**mortgage**）抵押品（**collateral**）的房子。这十个词帮你谈论借贷与欠债、人们拥有和欠下的财产，以及账目如何核查。",
    ),
    watchOut: {
      meanings: t(
        "An **asset** is something of value you own, while a **liability** is money you owe or a thing that causes trouble; a house is an asset, a debt a liability.",
        "**asset** 是你拥有的有价值之物，**liability** 是你欠的钱或带来麻烦的东西；房子是 asset，债务是 liability。",
      ),
      use: t(
        "The **creditor** is owed the money and the **debtor** owes it; a debtor falls into **arrears**, a creditor demands payment.",
        "**creditor** 是被欠钱的一方，**debtor** 是欠钱的一方；debtor 会拖欠（fall into **arrears**），creditor 会催款。",
      ),
      spelling: t(
        "**Mortgage** has a silent t, **arrears** has a double r and is always plural, and **debtor** has a silent b.",
        "**mortgage** 的 t 不发音；**arrears** 双写 r，总是复数；**debtor** 的 b 不发音。",
      ),
    },
    notes: `
      asset|a house worth more than everything else a family owns|calm as a quality that helps in a crisis|offices and trucks sold to pay debts|an asset is something of value one owns, or a useful quality; a liability is a debt or a problem|asset 是资产、优点；liability 是负债、累赘|a liability is money owed or a thing that causes trouble, the opposite of a valuable house, a helpful quality or property to sell|liability 是负债或累赘，和值钱的房子、有用的品质或可变卖的财产正好相反|collateral is property promised to a lender, not a family's prize home, a calm nature or everything a firm sells|collateral 是抵押给放贷人的财产，不是家里最值钱的房子、冷静的性格或公司变卖的一切|as · set|the double s|双写 s
      liability|debts growing faster than income|legal responsibility for an accident|a car breaking down every week|a liability is money owed, legal responsibility, or a burden; an asset is something of value|liability 是负债、责任、累赘；asset 是资产|an asset is something valuable, the opposite of debts, blame for an accident and a car that keeps breaking down|asset 是有价值之物，和债务、事故责任、总出故障的车正好相反|a debtor is a person who owes money, not the debts themselves, a legal responsibility or a car|debtor 是欠钱的人，不是债务本身、法律责任或汽车|li · a · bil · i · ty|*liable* turned into -bility|由 *liable* 变为 -bility
      collateral|a house the bank could take if she failed to pay|property promised to a lender|a ship to be seized if a loan was not repaid|collateral is property promised as security for a loan; a mortgage is the loan itself|collateral 是抵押品；mortgage 是抵押贷款|a mortgage is the loan to buy a house, not the property a borrower promises the lender as security|mortgage 是购房贷款，不是借款人向放贷人担保的财产|an asset is anything of value one owns, but this is property pledged to a lender for one loan|asset 是拥有的任何有价值之物，而这里是为某笔贷款质押给放贷人的财产|col · lat · er · al|the double l and one t|双写 l，只有一个 t
      mortgage|borrowing most of a flat's price from a bank|monthly payments ending in twenty years|interest rates making home loans more costly|a mortgage is a loan to buy a house; collateral is property promised as security|mortgage 是抵押贷款；collateral 是抵押品|collateral is the property promised to a lender, not the loan itself that is taken out and paid off monthly|collateral 是担保给放贷人的财产，不是要按月偿还的贷款本身|deflation is a general fall in prices, not a loan taken out to buy a home|deflation 是物价普遍下跌，不是购房贷款|mort · gage|the silent t|t 不发音
      deflation|people delaying buying as prices keep falling|years of prices sliding lower in the shops|a steady fall in prices feared by a bank|deflation is a general fall in prices; a mortgage is a home loan|deflation 是通货紧缩；mortgage 是抵押贷款|a mortgage is a loan for a house, not prices falling month after month across a whole country|mortgage 是房贷，不是全国物价逐月下跌|an audit is a check of accounts, not a steady fall in prices|audit 是查账，不是物价持续下跌|de · fla · tion|de- plus *flation*, the opposite of *inflation*|de- 加 *flation*，与 *inflation* 相对
      bankrupt|an airline unable to pay what it owed|a farmer deep in debts he could never pay|a man left with no honor or decency|bankrupt means unable to pay one's debts, or lacking something completely; moneyed means wealthy|bankrupt 是破产的；moneyed 是富有的|moneyed means wealthy, the opposite of an airline, a farmer or a man who has nothing left|moneyed 是有钱的，和一无所有的航空公司、农民或人正好相反|well-heeled means rich and comfortable, the opposite of being unable to pay one's debts|well-heeled 是富裕的，和无力偿债正好相反|bank · rupt|the -rupt ending, as in *rupture*|结尾 -rupt，同 *rupture*
      arrears|a tenant who had paid no rent since spring|families whose bills were long overdue|a year of overdue rent finally paid off|arrears are money owed and overdue; an audit is a check of accounts|arrears 是欠款；audit 是审计|an audit is a check of the books, not rent or bills that are overdue and owed|audit 是查账，不是逾期未付的房租或账单|collateral is property promised to a lender, not overdue rent or bills|collateral 是抵押品，不是逾期的房租或账单|ar · rears|the double r and the plural -s|双写 r，以复数 -s 结尾
      audit|a check of every account that found missing money|books checked line by line by outside accountants|a check of every receipt for five years|an audit is an official check of accounts; deflation is a fall in prices|audit 是审计；deflation 是通货紧缩|deflation is a general fall in prices, not a check of accounts, books or receipts|deflation 是物价普遍下跌，不是检查账目、账簿或收据|a mortgage is a home loan, not a careful check of someone's accounts|mortgage 是房贷，不是对某人账目的仔细核查|au · dit|the au at the start|开头是 au
      creditor|someone owed ten thousand dollars demanding payment|a bank and suppliers a company owed|those who got back only half of what they were owed|a creditor is one to whom money is owed; a debtor owes money|creditor 是债权人；debtor 是债务人|a debtor owes the money, the opposite of the one who is owed it and demands it back|debtor 是欠钱的一方，和被欠钱、要求还钱的一方正好相反|an asset is a thing of value, not a person or company that is owed money|asset 是有价值的东西，不是被欠钱的人或公司|cred · i · tor|the -or ending|结尾是 -or
      debtor|a man owing more than he earned|a country owing billions to its allies|those sent to prison for not repaying loans|a debtor is a person or country that owes money; a creditor is owed money|debtor 是债务人；creditor 是债权人|a creditor is owed money, the opposite of someone who owes more than he earns or cannot repay|creditor 是被欠钱的人，和入不敷出、无力还款的人正好相反|a liability is a debt or a burden, not the person or country that owes|liability 是负债或累赘，不是欠债的人或国家|debt · or|the silent b|b 不发音
    `,
  },
);

const elections = batch(
  "words-of-elections-and-office",
  ["Words of Elections and Office", "选举与公职的词"],
  ["winning votes and holding office", "赢得选票和担任公职"],
  `
  municipal|having to do with a town or city and its government|市政的|Elections for the city council, the ___ elections, are held every four years.|The ___ library, run by the town council, is free to all who live there.|The city's own ___ workers, paid by the town hall, cleared the snow from every street.|colonial,secular|
  bureaucracy|a system of government with many officials and complicated rules|官僚机构，官僚作风|Endless forms and a dozen offices of ___ slowed the building of the bridge for years.|She cut through the ___ in a week, getting every official to sign the permits at once.|The government's huge ___ employs ten thousand clerks, each with rules of his own.|constituency,quorum|bureaucracies,bureaucrat,bureaucratic
  constituency|the voters of an area who elect a representative; the area itself|选区，选民|He won the ___ by two hundred votes, becoming the member for that district.|Farmers are her main ___, the voters who elected her and whom she speaks for.|Each ___ sends one member to parliament, chosen by the voters who live there.|incumbency,quorum|constituencies
  lobby|to try to persuade lawmakers to support a cause; a group that does this|游说；游说团体|Teachers came to the capital to ___ the lawmakers for smaller classes.|Oil companies spend millions to ___ members of congress, urging them to vote against new limits.|They hired a firm to ___ the senate, meeting senators one by one to win their support for the bill.|canvass,gerrymander|lobbied,lobbying
  gerrymander|to draw the borders of voting areas unfairly to help one party|不公正地划分选区|The ruling party tried to ___ the city, redrawing its districts so that it would win every seat.|Courts struck down the plan to ___ the state, which twisted the voting maps to favor one party.|Computers make it easy to ___ districts, drawing strange shapes that pack the other party's voters together.|lobby,canvass|gerrymandered,gerrymandering
  plebiscite|a direct vote by all the people on an important question|全民公投|A ___, in which every citizen voted yes or no, decided the future of the region.|The ___ on independence, a vote by the whole people, was held under UN watch.|The king called a ___ on the new constitution, letting every voter decide it directly.|quorum,hustings|plebiscites
  quorum|the smallest number of members who must be present for a meeting to make decisions|法定人数|Without a ___, with only five of the twelve members present, the vote could not take place.|We reached a ___ at the last minute, when the seventh member arrived and the meeting could begin.|The rules set the ___ at twelve, the fewest members who must attend before any decision is made.|plebiscite,constituency|
  incumbency|the holding of an office, or the period of holding it|在职，任期|Her ___, already holding the office she was running for, gave her an advantage in the race.|During his ___, the eight years he held the office of mayor, the city grew rich.|Ten years of ___, of holding the same office without a real challenge, made him complacent.|constituency,hustings|
  hustings|the campaigning for an election, especially speeches to voters|竞选活动，竞选演说|The candidates were out on the ___ all week, making speeches in every town square.|Campaigning on the ___, he promised voters lower taxes in every speech.|Life on the ___, with three campaign speeches a day, is tiring.|incumbency,plebiscite|
  canvass|to visit people to ask for their votes or opinions|游说拉票；调查(意见)|Volunteers will ___ every street, knocking on doors to ask for votes.|They ___ voters by telephone, asking each one how they plan to vote.|The team set out to ___ the neighbors, going house to house to ask their opinions.|lobby,gerrymander|canvassed,canvassing
  `,
  "context-clues",
  {
    intro: t(
      "Volunteers **canvass** every street, firms **lobby** the lawmakers, and a candidate with years of **incumbency** spends the week on the **hustings** in her **constituency**. These ten words help you talk about campaigns and votes, the people who hold office and the rules that govern them.",
      "志愿者挨家挨户拉票（**canvass**），公司游说（**lobby**）立法者，一位已在任（**incumbency**）多年的候选人在自己的选区（**constituency**）里整周奔走竞选（**hustings**）。这十个词帮你谈论竞选与投票、担任公职的人以及约束他们的规则。",
    ),
    watchOut: {
      meanings: t(
        "You **canvass** voters, going door to door for their votes, but you **lobby** lawmakers, urging them to vote for a cause; canvass the neighbors, lobby the senate.",
        "**canvass** 的对象是选民，挨家挨户拉票；**lobby** 的对象是立法者，敦促他们支持某项议题：canvass the neighbors，lobby the senate。",
      ),
      use: t(
        "A **plebiscite** is a vote by the whole people on one question, while a **quorum** is the fewest members a meeting needs before it can vote at all.",
        "**plebiscite** 是全体人民就一个问题投票，**quorum** 是会议能够表决所需的最少出席人数。",
      ),
      spelling: t(
        "**Canvass** has a double s, unlike the cloth *canvas*, **bureaucracy** has -eau-, and **hustings** is always plural.",
        "**canvass** 双写 s，不同于布料 *canvas*；**bureaucracy** 含 -eau-；**hustings** 总是复数。",
      ),
    },
    notes: `
      municipal|elections for the city council|a library run by the town council|workers paid by the town hall|municipal means having to do with a city's government; colonial means having to do with a colony|municipal 是市政的；colonial 是殖民的|colonial means belonging to a colony and its foreign rulers, not to a city council or town hall|colonial 属于殖民地及其外来统治者，不属于市议会或市政厅|secular means not religious, which says nothing about a city council or town hall|secular 是非宗教的，与市议会或市政厅无关|mu · nic · i · pal|the -pal ending|结尾是 -pal
      bureaucracy|forms and offices that slowed a bridge for years|officials made to sign permits at once|ten thousand clerks each with his own rules|bureaucracy is a system of many officials and complicated rules; a constituency is a body of voters|bureaucracy 是官僚机构；constituency 是选区|a constituency is the voters of an area, not forms, officials and clerks with complicated rules|constituency 是一地的选民，不是表格、官员和规矩繁多的职员|a quorum is the fewest members a meeting needs, not a system of forms and clerks|quorum 是会议所需的最少人数，不是表格和职员组成的体系|bu · reau · cra · cy|the -eau- in the middle|中间是 -eau-
      constituency|a district won by two hundred votes|the voters a member speaks for|an area that sends one member to parliament|a constituency is the voters of an area or the area itself; incumbency is the holding of an office|constituency 是选区、选民；incumbency 是在职|incumbency is holding an office, not a district or a group of voters that elects someone|incumbency 是在任，不是选出某人的地区或选民|a quorum is the fewest members a meeting needs, not the voters of a district|quorum 是会议所需的最少人数，不是一个地区的选民|con · stit · u · en · cy|the -uency ending|结尾是 -uency
      lobby|teachers urging lawmakers for smaller classes|oil companies urging members of congress to vote against limits|a firm meeting senators one by one for a bill|lobby means to try to persuade lawmakers; canvass means to ask voters for votes|lobby 是游说立法者；canvass 是向选民拉票|canvass means asking ordinary voters for their votes, not persuading lawmakers, congress or the senate|canvass 是向普通选民拉票，不是游说立法者、国会或参议院|gerrymander means to redraw voting borders, not to urge lawmakers to support a cause|gerrymander 是重划选区边界，不是敦促立法者支持某事|lob · by|the double b|双写 b
      gerrymander|redrawing a city's districts to win every seat|twisting a state's voting maps|strange district shapes packing the other party's voters|gerrymander means to draw voting borders unfairly; lobby means to persuade lawmakers|gerrymander 是不公正划分选区；lobby 是游说|lobby means to persuade lawmakers, not to redraw districts and voting maps|lobby 是游说立法者，不是重划选区和选票地图|canvass means to ask voters for their votes, not to change the borders they vote in|canvass 是向选民拉票，不是改变他们投票所在的边界|ger · ry · man · der|the double r and the -mander ending|双写 r，结尾 -mander
      plebiscite|every citizen voting yes or no on a region's future|a vote on independence by the whole people|a king letting every voter decide a constitution directly|a plebiscite is a direct vote by all the people; a quorum is the fewest members needed for a meeting|plebiscite 是全民公投；quorum 是法定人数|a quorum is the fewest members a meeting needs, not a vote in which every citizen decides a question|quorum 是会议所需的最少人数，不是全体公民就某问题投票|the hustings are campaign speeches, not a direct vote by the whole people|hustings 是竞选演说，不是全民直接投票|pleb · i · scite|the -scite ending|结尾是 -scite
      quorum|five of twelve members too few for a vote|a seventh member arriving so a meeting could begin|the fewest members who must attend before a decision|a quorum is the fewest members needed for a meeting to decide; a plebiscite is a vote by all the people|quorum 是法定人数；plebiscite 是全民公投|a plebiscite is a vote by the whole people, not the fewest members a meeting needs to begin|plebiscite 是全民投票，不是会议开始所需的最少人数|a constituency is the voters of an area, not the members who must attend a meeting|constituency 是一地的选民，不是必须出席会议的成员|quo · rum|the qu and the -um ending|含 qu，结尾 -um
      incumbency|already holding the office one is running for|eight years holding the office of mayor|ten years in the same office without a real challenge|incumbency is holding an office or the time of holding it; a constituency is the voters of an area|incumbency 是在职、任期；constituency 是选区|a constituency is the voters of an area, not holding an office or the years someone holds it|constituency 是一地的选民，不是在任或任职的年限|the hustings are the campaign, not the holding of an office for years|hustings 是竞选活动，不是多年在任|in · cum · ben · cy|the -bency ending|结尾是 -bency
      hustings|candidates making speeches in every town square|a campaign with promises of lower taxes in every speech|three campaign speeches a day|the hustings are the campaign and its speeches; incumbency is holding an office|hustings 是竞选活动；incumbency 是在职|incumbency is already holding office, not candidates out making campaign speeches|incumbency 是已在任，不是候选人外出发表竞选演说|a plebiscite is one direct vote by the people, not a week of campaign speeches|plebiscite 是一次全民直接投票，不是一周的竞选演说|hus · tings|always plural, ending in -s|总是复数，以 -s 结尾
      canvass|volunteers knocking on doors to ask for votes|asking voters by telephone how they plan to vote|going house to house to ask neighbors' opinions|canvass means to visit people for their votes or opinions; lobby means to persuade lawmakers|canvass 是拉票、调查意见；lobby 是游说立法者|lobby means to persuade lawmakers, not to knock on doors or ring ordinary voters and neighbors|lobby 是游说立法者，不是敲门或打电话问普通选民和邻居|gerrymander means to redraw voting borders, not to ask people for their votes or opinions|gerrymander 是重划选区，不是向人们拉票或征求意见|can · vass|the double s, unlike the cloth *canvas*|双写 s，不同于布料 *canvas*
    `,
  },
);

const prose = batch(
  "words-for-the-style-of-prose",
  ["Words for the Style of Prose", "描述文风的词"],
  ["clear and cloudy, plain and showy writing", "清晰与晦涩、朴素与浮华的文字"],
  `
  lucid|clearly expressed and easy to understand|清晰易懂的|Her ___ explanation, simple and clear, made the hard topic easy for everyone to follow.|The report is short and ___, and anyone can understand it on a first reading.|Even very sick, he remained ___ to the end, thinking and speaking clearly until his last day.|turgid,stilted|lucidity,lucidly
  limpid|clear and simple in style; completely clear, like water|清澈的；明晰的|The ___ water, clear as glass, let us see every stone on the bottom.|We swam in a ___ pool so clear that the fish below seemed to float in air.|Her ___ prose, as clear and simple as spring water, is a joy to read.|turgid,stilted|
  pellucid|extremely clear in meaning or appearance|清晰透彻的|The essay's argument is ___, so clear that no reader could mistake it.|Perfectly ___ water, clear as air, ran over the stones.|He had a ___ way of explaining law, making the hardest cases crystal clear.|stilted,bombastic|
  turgid|swollen; written in a heavy, complicated style that is hard to read|浮夸的，艰涩的|The ___ report, heavy with long, tangled sentences, put everyone to sleep.|Heavy, ___ prose, so swollen with words that no one can follow it, often hides weak ideas.|The river was ___ after the rain, swollen far above its banks.|lucid,pithy|
  florid|too full of decoration; reddish in color|辞藻华丽的；红润的|The ___ speech, crowded with fancy phrases and long words, went on for an hour.|His ___ face was flushed red from years of wine and rich food.|Her early poems were ___ and sentimental, every line heavy with decoration.|pithy,austere|
  pithy|short and full of meaning|简练精辟的|She gave a ___ summary of the book, just two sentences that said everything.|His ___ remarks, short and wise, were often quoted.|A ___ slogan of three words, short and full of meaning, sold the idea.|turgid,bombastic|pithily
  stilted|stiff and unnatural in style|生硬的，不自然的|The dialogue in the film is ___, so stiff that no real person would ever talk that way.|He spoke in ___ English, stiff and formal, like a textbook read aloud.|Their ___ conversation, awkward and unnatural, ended quickly.|pellucid,lucid|
  bombastic|using long and impressive words with little meaning|夸夸其谈的|The ___ speech, full of grand words, promised everything and explained nothing.|The preacher was loud and ___, thundering big, empty phrases from the pulpit.|Critics mocked the ___ style of the novel, puffed up with grand words that meant little.|pithy,austere|bombast
  grandiloquent|using long or difficult words to impress people|夸张的，浮夸的|The ___ mayor spoke of a golden age, using the grandest words he could find.|His letters were ___ and tiresome, stuffed with fancy words meant to impress.|The book's ___ title, full of long words, hid a simple story.|austere,pithy|grandiloquence
  austere|plain and without decoration; strict|朴素的；严峻的|Her ___ style, plain and bare, suits the sad story.|The monks lived in ___ rooms, with bare walls, a bed and a single chair.|The ___ teacher, strict and serious, rarely smiled.|florid,grandiloquent|
  `,
  "context-clues",
  {
    intro: t(
      "A **lucid** writer makes hard ideas clear, a **pithy** one says much in few words, and a **turgid** or **bombastic** one buries little meaning under too many words. These ten words help you describe the style of writing and speech, from clear and plain to heavy and showy.",
      "清晰的（**lucid**）作者让难懂的思想变得明白，简练的（**pithy**）作者言简意赅，而艰涩的（**turgid**）或浮夸的（**bombastic**）作者则用过多的词掩埋了贫乏的意思。这十个词帮你描述文风和讲话的风格，从清晰朴素到沉重浮华。",
    ),
    watchOut: {
      meanings: t(
        "**Turgid** writing is heavy and swollen, hard to read, while **florid** writing is too decorated, full of fancy phrases; both are the opposite of **lucid**.",
        "**turgid** 的文字沉重臃肿、难以读懂，**florid** 的文字修饰过多、满是华丽辞藻；两者都与 **lucid** 相反。",
      ),
      use: t(
        "**Limpid** and **pellucid** describe both water and writing, clear as glass; limpid water, pellucid prose.",
        "**limpid** 和 **pellucid** 既可形容水，也可形容文字，像玻璃一样清澈：limpid water，pellucid prose。",
      ),
      spelling: t(
        "**Pellucid** has a double l, **grandiloquent** has -iloqu-, and **pithy** has th and ends in -y.",
        "**pellucid** 双写 l；**grandiloquent** 含 -iloqu-；**pithy** 含 th，结尾是 -y。",
      ),
    },
    notes: `
      lucid|an explanation that made a hard topic easy|a report anyone understands on a first reading|a sick man thinking and speaking clearly to the end|lucid means clear and easy to understand; turgid means heavy and hard to read|lucid 是清晰易懂的；turgid 是艰涩的|turgid means heavy and hard to follow, the opposite of easy to follow, understood at once or speaking clearly|turgid 是沉重难懂，和容易理解、一读就懂、说话清楚正好相反|stilted means stiff and unnatural, not clear and easy to understand|stilted 是生硬不自然，不是清晰易懂|lu · cid|the c sounding like s|c 读作 s
      limpid|water clear as glass showing every stone|a pool so clear fish seemed to float in air|prose as clear and simple as spring water|limpid means completely clear, like water; turgid means swollen and heavy|limpid 是清澈的；turgid 是浑浊臃肿的|turgid means swollen and heavy, the opposite of water and prose that are clear and simple|turgid 是臃肿沉重的，和清澈简明的水与文字正好相反|stilted means stiff and unnatural, which describes speech, not clear water|stilted 是生硬不自然，形容言语，不形容清澈的水|lim · pid|the -pid ending|结尾是 -pid
      pellucid|an argument no reader could mistake|water clear as air|law made crystal clear|pellucid means extremely clear; stilted means stiff and unnatural|pellucid 是清晰透彻的；stilted 是生硬的|stilted means stiff and unnatural, not crystal clear, and it never describes water|stilted 是生硬不自然，不是清澈透明，也不形容水|bombastic means full of grand, empty words, the opposite of crystal-clear meaning|bombastic 是夸夸其谈，和清晰透彻的意思正好相反|pel · lu · cid|the double l|双写 l
      turgid|a report heavy with tangled sentences|prose so swollen that no one can follow it|a river swollen above its banks|turgid means swollen and heavy, hard to read; lucid means clear|turgid 是艰涩臃肿的；lucid 是清晰的|lucid means clear and easy to follow, the opposite of tangled, swollen prose or a river over its banks|lucid 是清晰易懂，和缠绕臃肿的文字或漫过河岸的河流正好相反|pithy means short and full of meaning, the opposite of long, tangled and swollen|pithy 是简练精辟，和冗长、缠绕、臃肿正好相反|tur · gid|the -gid ending|结尾是 -gid
      florid|a speech crowded with fancy phrases|a face flushed red from wine and rich food|early poems heavy with decoration|florid means too decorated, or reddish; pithy means short and full of meaning|florid 是华丽的、红润的；pithy 是简练的|pithy means short and plain, the opposite of a long, fancy speech, decorated poems, and it is no color|pithy 是简短朴实，和冗长华丽的演讲、修饰过多的诗正好相反，也不是颜色|austere means plain and undecorated, the opposite of fancy phrases and decoration, and it means no red face|austere 是朴素无饰，和华丽辞藻正好相反，也不是红润的脸|flor · id|the -id ending|结尾是 -id
      pithy|a two-sentence summary that said everything|short, wise remarks often quoted|a three-word slogan full of meaning|pithy means short and full of meaning; turgid means heavy and swollen|pithy 是简练精辟的；turgid 是臃肿艰涩的|turgid means heavy and swollen with words, the opposite of a two-sentence summary or a three-word slogan|turgid 是冗长臃肿，和两句话的概括或三个词的口号正好相反|bombastic means full of grand, empty words, the opposite of short and full of meaning|bombastic 是空洞浮夸，和简短而意味深长正好相反|pith · y|the th and the -y ending|含 th，结尾 -y
      stilted|dialogue no real person would speak|stiff, formal English like a textbook|an awkward, unnatural conversation|stilted means stiff and unnatural; pellucid means extremely clear|stilted 是生硬的；pellucid 是清晰透彻的|pellucid means crystal clear, which says nothing of stiff, awkward, unnatural speech|pellucid 是清晰透彻，与生硬别扭的言语无关|lucid means clear and easy to follow, not stiff and awkward|lucid 是清晰易懂，不是生硬别扭|stilt · ed|the word *stilt* plus -ed|*stilt* 加 -ed
      bombastic|a speech promising everything and explaining nothing|a preacher thundering big, empty phrases|a novel puffed up with grand words|bombastic means using grand words with little meaning; pithy means short and full of meaning|bombastic 是夸夸其谈的；pithy 是简练精辟的|pithy means short and full of meaning, the opposite of grand words that mean little|pithy 是简短而意味深长，和空洞的华丽辞藻正好相反|austere means plain and bare, the opposite of puffed-up, thundering phrases|austere 是朴素简洁，和夸张浮夸的言辞正好相反|bom · bas · tic|the -astic ending|结尾是 -astic
      grandiloquent|a mayor using the grandest words he could find|letters stuffed with fancy words to impress|a title full of long words hiding a simple story|grandiloquent means using grand words to impress; austere means plain|grandiloquent 是浮夸的；austere 是朴素的|austere means plain and bare, the opposite of the grandest words and fancy titles|austere 是朴素简洁，和最华丽的辞藻、花哨的标题正好相反|pithy means short and plain, the opposite of words chosen only to impress|pithy 是简短朴实，和只为炫耀而选的词正好相反|gran · dil · o · quent|the -iloqu- in the middle|中间是 -iloqu-
      austere|a plain, bare style for a sad story|rooms with bare walls, a bed and one chair|a strict, serious teacher who rarely smiled|austere means plain and undecorated, or strict; florid means too decorated|austere 是朴素的、严峻的；florid 是华丽的|florid means too full of decoration, the opposite of a plain style, bare rooms and a strict teacher|florid 是修饰过多，和朴素的文风、空荡的房间、严肃的老师正好相反|grandiloquent means using grand words to impress, the opposite of plain and bare|grandiloquent 是浮夸炫耀，和朴素简洁正好相反|aus · tere|the au and the -ere ending|含 au，结尾 -ere
    `,
  },
);

const sound = batch(
  "words-for-sounds-and-voices",
  ["Words for Sounds and Voices", "描述声音和嗓音的词"],
  ["pleasant and unpleasant sounds", "悦耳和刺耳的声音"],
  `
  mellifluous|sweet and smooth to hear|甜美流畅的|Her ___ voice, smooth as honey, made even the bad news seem gentle.|The radio played ___ music, soft and sweetly flowing, all evening.|He read the poem in ___ tones, each word flowing sweetly into the next.|strident,raucous|mellifluously
  euphonious|pleasing to the ear|悦耳的|"Cellar door" is often called a ___ phrase, one whose sounds are lovely to hear whatever it means.|The bells made a ___ sound, pleasant and harmonious across the town.|The names of the islands are ___, soft and musical when spoken aloud.|cacophonous,raucous|
  cacophonous|harsh and unpleasant to hear|刺耳的，不和谐的|The ___ traffic, a harsh clash of horns and engines, woke us at dawn.|A ___ band, every instrument out of tune, played in the square.|The ___ market rang with a jarring din of shouts and clattering carts.|euphonious,dulcet|cacophony
  sonorous|deep, full and loud|洪亮的，响亮的|The ___ bell, deep and full, rang across the whole valley.|The actor had a deep, rich, ___ voice that filled the theater without a microphone.|He read the speech in ___ tones, deep and full, that rolled to the back of the hall.|sibilant,cacophonous|sonority
  strident|loud, harsh and unpleasant; forceful in expressing opinions|刺耳的；强硬的|The ___ alarm, shrill and harsh, woke everyone in the building.|Her ___ critics, loud and forceful, demanded that she resign at once.|He spoke in a harsh, ___ voice that grated on everyone's ears.|mellifluous,dulcet|stridently
  raucous|loud, harsh and disorderly|嘈杂刺耳的|Loud, ___ laughter, rough and wild, came from the bar until midnight.|The crows made a ___ noise, harsh and endless cawing in the trees.|It was a ___ party, loud and rowdy, that lasted till dawn.|dulcet,mellifluous|raucously
  dulcet|sweet and soothing to hear|悦耳的，甜美的|The ___ tones of the harp, sweet and soft, filled the room.|She answered in her most ___ voice, sweet and soothing.|The ___ song, soft as a whisper, calmed the crying baby.|raucous,cacophonous|
  plangent|loud and sad, with a deep ringing sound|悲凉的，回荡的|The ___ bells tolled for the dead, their deep, mournful ringing filling the town.|A slow, ___ guitar, ringing out sadly, ended the film.|Her ___ cry of grief echoed through the empty hall.|sibilant,raucous|plangency
  stentorian|very loud and powerful|(声音)洪亮的|The sergeant had a ___ voice, so loud and powerful that it carried across the whole parade ground.|A single ___ shout, booming over the noise, stopped the fight.|He called out the names in ___ tones that could be heard at the back of the stadium.|dulcet,sibilant|
  sibilant|making or having a hissing sound, like "s" or "sh"|发咝咝声的|The snake made a ___ noise, a long, hissing "sss".|"She sells seashells" is full of ___ sounds, one hissing s after another.|A ___ whisper, all hissing s's and sh's, ran through the crowd.|plangent,stentorian|
  `,
  "context-clues",
  {
    intro: t(
      "The singer's **mellifluous** voice and the harp's **dulcet** tones were drowned by **raucous** laughter, a **strident** alarm and the **stentorian** shout of the guard. These ten words help you describe sounds and voices, from sweet and soft to harsh, loud and hissing.",
      "歌手甜美流畅的（**mellifluous**）嗓音和竖琴悦耳的（**dulcet**）声音，被嘈杂的（**raucous**）笑声、刺耳的（**strident**）警报和卫兵洪亮的（**stentorian**）喊声淹没了。这十个词帮你描述声音和嗓音，从甜美柔和到刺耳、响亮和咝咝作响。",
    ),
    watchOut: {
      meanings: t(
        "**Sonorous** sounds are deep and full, like a great bell, while **stentorian** voices are simply very loud and powerful, like a sergeant's, and **plangent** sounds are loud and sad, like bells for the dead.",
        "**sonorous** 的声音深沉饱满，如大钟；**stentorian** 的嗓音只是非常响亮有力，如军士的吼声；**plangent** 的声音响亮而悲凉，如丧钟。",
      ),
      use: t(
        "**Strident** can describe people as well as sounds: strident critics are loud and forceful in their opinions, while a strident alarm is shrill and harsh.",
        "**strident** 既能形容声音，也能形容人：strident critics 是言辞强硬的批评者，strident alarm 是尖厉刺耳的警报。",
      ),
      spelling: t(
        "**Mellifluous** has a double l and -fluous, **euphonious** begins with eu- and has ph, and **raucous** has au and ends in -cous.",
        "**mellifluous** 双写 l，含 -fluous；**euphonious** 以 eu- 开头，含 ph；**raucous** 含 au，结尾是 -cous。",
      ),
    },
    notes: `
      mellifluous|a voice smooth as honey|music soft and sweetly flowing|words flowing sweetly into each other|mellifluous means sweet and smooth to hear; strident means loud and harsh|mellifluous 是甜美流畅的；strident 是刺耳的|strident means shrill and harsh, the opposite of a voice, music or reading smooth as honey|strident 是尖厉刺耳，和如蜜般柔滑的嗓音、音乐或朗读正好相反|raucous means loud and rowdy, the opposite of soft, sweetly flowing sound|raucous 是嘈杂喧闹，和柔和流畅的声音正好相反|mel · lif · lu · ous|the double l and the -fluous ending|双写 l，结尾 -fluous
      euphonious|a phrase whose sounds are lovely whatever it means|bells pleasant and harmonious across a town|island names soft and musical when spoken|euphonious means pleasing to the ear; cacophonous means harsh and jarring|euphonious 是悦耳的；cacophonous 是刺耳的|cacophonous means harsh and jarring, the opposite of lovely, harmonious and musical sounds|cacophonous 是刺耳不和谐，和优美、和谐、富有音乐感的声音正好相反|raucous means loud and rowdy, not lovely and soft to hear|raucous 是嘈杂喧闹，不是柔和悦耳|eu · pho · ni · ous|the eu- start and the ph|开头 eu-，含 ph
      cacophonous|a harsh clash of horns and engines|a band with every instrument out of tune|a jarring din of shouts and carts|cacophonous means harsh and unpleasant to hear; euphonious means pleasing to the ear|cacophonous 是刺耳的；euphonious 是悦耳的|euphonious means pleasing to the ear, the opposite of clashing horns, out-of-tune instruments and a jarring din|euphonious 是悦耳的，和喇叭齐鸣、乐器走调、刺耳的喧闹正好相反|dulcet means sweet and soothing, the opposite of harsh, jarring noise|dulcet 是甜美舒缓，和刺耳的噪声正好相反|ca · coph · o · nous|the ph in the middle|中间是 ph
      sonorous|a deep, full bell ringing across a valley|a rich voice filling a theater without a microphone|deep tones rolling to the back of a hall|sonorous means deep, full and loud; sibilant means hissing|sonorous 是洪亮的；sibilant 是咝咝的|sibilant means hissing like s, not the deep, full ringing of a bell or a rich voice|sibilant 是咝咝作响，不是钟声或浑厚嗓音那样深沉饱满|cacophonous means harsh and jarring, not deep, rich and full|cacophonous 是刺耳不和谐，不是深沉浑厚饱满|son · o · rous|the -orous ending|结尾是 -orous
      strident|a shrill, harsh alarm|loud, forceful critics demanding a resignation|a harsh voice grating on everyone's ears|strident means loud and harsh, or forceful; mellifluous means sweet and smooth|strident 是刺耳的、强硬的；mellifluous 是甜美流畅的|mellifluous means sweet and smooth, the opposite of a shrill alarm, forceful critics or a grating voice|mellifluous 是甜美流畅，和尖厉的警报、强硬的批评者或刺耳的嗓音正好相反|dulcet means sweet and soothing, the opposite of shrill, forceful and grating|dulcet 是甜美舒缓，和尖厉、强硬、刺耳正好相反|stri · dent|the -dent ending|结尾是 -dent
      raucous|rough, wild laughter from a bar|harsh, endless cawing of crows|a loud, rowdy party till dawn|raucous means loud, harsh and disorderly; dulcet means sweet and soothing|raucous 是嘈杂刺耳的；dulcet 是悦耳的|dulcet means sweet and soothing, the opposite of rough laughter, cawing crows and a rowdy party|dulcet 是甜美舒缓，和粗野的笑声、乌鸦聒噪、喧闹的派对正好相反|mellifluous means smooth and sweet, the opposite of loud and rowdy|mellifluous 是柔滑甜美，和嘈杂喧闹正好相反|rau · cous|the au and the -cous ending|含 au，结尾 -cous
      dulcet|sweet, soft tones of a harp|a sweet, soothing voice|a song soft as a whisper calming a baby|dulcet means sweet and soothing; raucous means loud and harsh|dulcet 是悦耳甜美的；raucous 是嘈杂刺耳的|raucous means loud and harsh, the opposite of soft harp tones, a soothing voice and a whispered song|raucous 是嘈杂刺耳，和柔和的琴声、舒缓的嗓音、低语般的歌正好相反|cacophonous means harsh and jarring, the opposite of sweet and soothing|cacophonous 是刺耳不和谐，和甜美舒缓正好相反|dul · cet|the c sounding like s|c 读作 s
      plangent|deep, mournful bells for the dead|a guitar ringing out sadly at a film's end|a cry of grief echoing through a hall|plangent means loud and sad with a deep ringing; sibilant means hissing|plangent 是悲凉回荡的；sibilant 是咝咝的|sibilant means hissing, not the deep, mournful ringing of bells, a guitar or a cry of grief|sibilant 是咝咝作响，不是钟声、吉他或悲泣那样深沉哀伤的回响|raucous means loud and rowdy, not deep, ringing and sad|raucous 是嘈杂喧闹，不是深沉回荡而悲伤|plan · gent|the soft g and the -ent ending|g 发软音，结尾 -ent
      stentorian|a sergeant's voice carrying across a parade ground|one booming shout stopping a fight|names heard at the back of a stadium|stentorian means very loud and powerful; dulcet means sweet and soothing|stentorian 是洪亮的；dulcet 是甜美的|dulcet means sweet and soft, the opposite of a voice or shout booming across a parade ground or stadium|dulcet 是甜美柔和，和响彻操场或体育场的嗓音或喊声正好相反|sibilant means hissing, not a booming, powerful voice|sibilant 是咝咝作响，不是洪亮有力的嗓音|sten · to · ri · an|the -orian ending|结尾是 -orian
      sibilant|a snake's long, hissing "sss"|one hissing s after another|a whisper of hissing s's and sh's|sibilant means hissing like s or sh; plangent means loud and sad|sibilant 是咝咝的；plangent 是悲凉回荡的|plangent means loud, sad and ringing, not a snake's hiss, a run of s sounds or a whisper|plangent 是响亮悲凉回荡，不是蛇的嘶声、一串 s 音或耳语|stentorian means very loud and powerful, not a hissing noise or a whisper|stentorian 是洪亮有力，不是咝咝声或耳语|sib · i · lant|the -ilant ending|结尾是 -ilant
    `,
  },
);

const light = batch(
  "words-of-light-and-color",
  ["Words of Light and Color", "光与色的词"],
  ["the look of light and of faces", "光线与面色的样子"],
  `
  incandescent|glowing with heat; full of strong emotion|白炽的；热情洋溢的|Old ___ bulbs, whose wires glow white-hot, waste most of their energy as heat.|Blazing with passion from the first note, her ___ performance brought the audience to its feet.|He was ___ with rage, burning with a fury he could barely hold in.|iridescent,phosphorescent|incandescence
  iridescent|showing bright colors that seem to change in different light|彩虹色的，闪光的|The ___ wings of the beetle shone green, then blue, then purple as it turned in the sun.|Soap bubbles are ___, their thin skins swirling with rainbow colors that shift as they float.|The ___ shell, flashing pink and green as she tilted it, glowed in her hand.|lurid,wan|iridescence
  opalescent|showing changing milky colors like an opal|乳白光的|The ___ glass of the lamp, milky white with hints of blue and pink, softened the light.|Over the lake hung a pale, ___ mist, milky and faintly shimmering with color.|The pearl had a soft, ___ gleam, milky white with a hint of rainbow.|ruddy,sallow|
  phosphorescent|giving off a faint light without heat, as some sea creatures do|磷光的|At night the ___ waves, lit by tiny glowing sea creatures, shone faintly on the beach.|The watch has ___ hands that glow softly in the dark without any battery or heat.|Tiny ___ animals, giving off a cold, faint light, lit up the dark water.|incandescent,burnished|phosphorescence
  lustrous|shining softly|有光泽的|She had ___ black hair that shone softly in the lamplight.|The ___ silk, with its soft, rich sheen, caught the light.|After the summer grass, the horse's coat was ___, gleaming softly in the sun.|wan,lurid|
  burnished|polished until shiny|擦亮的，光亮的|Polished, ___ copper pots, rubbed until they shone, hung on the kitchen wall.|The sunset filled the sky with ___ gold, as bright as metal rubbed to a shine.|The old oak table was ___ with age, polished smooth and shiny by a hundred years of hands.|sallow,wan|burnish
  lurid|unpleasantly bright in color; shocking and sensational|刺眼的；耸人听闻的|The ___ green walls, so harsh and bright that they hurt the eyes, gave me a headache.|The paper printed ___ details of the crime, shocking stories meant to thrill its readers.|Above the burning factory, the sky glowed with an ugly, ___ red.|iridescent,ruddy|luridly
  wan|pale and looking tired or ill|苍白的，憔悴的|She gave a ___ smile from her hospital bed, pale and tired after the operation.|His face was ___ after the long night, pale and drawn from lack of sleep.|A ___ light, weak and pale, came through the dirty window.|ruddy,lustrous|wanly
  sallow|having an unhealthy yellowish color|(脸色)蜡黄的|His ___ skin, an unhealthy yellow, showed months without sun or fresh air.|The ___ clerk, yellowish and sickly, coughed behind his desk.|After the long fever she looked ___ and thin, her skin a sickly yellow.|ruddy,lustrous|
  ruddy|having a healthy red color|红润的|The farmer had a ___ face, red and healthy from years in the open air.|Their ___ cheeks, flushed a healthy red, glowed in the cold.|A ___ sky at evening, glowing red over the hills, promised good weather.|sallow,wan|
  `,
  "context-clues",
  {
    intro: t(
      "The **iridescent** beetle flashed green and blue, the **phosphorescent** waves glowed at night, and the patient's **wan** face slowly turned **ruddy** again. These ten words help you describe light and color, from glowing and shimmering to pale and sickly.",
      "彩虹色的（**iridescent**）甲虫闪着绿光和蓝光，磷光的（**phosphorescent**）海浪在夜里发亮，病人苍白的（**wan**）脸慢慢又变得红润（**ruddy**）。这十个词帮你描述光与色，从发光闪烁到苍白病态。",
    ),
    watchOut: {
      meanings: t(
        "**Incandescent** light comes from heat, as in a glowing bulb, while **phosphorescent** light comes without heat, as from tiny sea creatures, and **iridescent** colors shift as the light changes.",
        "**incandescent** 的光来自高温，如发亮的灯丝；**phosphorescent** 的光不带热量，如海中的微小生物；**iridescent** 的颜色随光线变化。",
      ),
      use: t(
        "**Wan**, **sallow** and **ruddy** usually describe faces: a wan face is pale and tired, a sallow one sickly yellow, a ruddy one healthily red.",
        "**wan**、**sallow** 和 **ruddy** 通常形容面色：wan 是苍白疲惫，sallow 是病态蜡黄，ruddy 是健康红润。",
      ),
      spelling: t(
        "**Phosphorescent** has ph twice and -sc-, **iridescent** has one r and -sc-, and **burnished** ends in -ished.",
        "**phosphorescent** 两处 ph，含 -sc-；**iridescent** 只有一个 r，含 -sc-；**burnished** 结尾是 -ished。",
      ),
    },
    notes: `
      incandescent|bulbs whose wires glow white-hot|a performance blazing with passion|a man burning with barely held fury|incandescent means glowing with heat or full of strong emotion; iridescent means showing shifting colors|incandescent 是白炽的、热情洋溢的；iridescent 是彩虹色的|iridescent means shimmering with changing colors, not glowing white-hot, blazing with passion or burning with rage|iridescent 是闪着变幻的色彩，不是白热发光、激情四射或怒火中烧|phosphorescent light has no heat, but these glow white-hot, blaze and burn|phosphorescent 的光不带热量，而这里是白热、炽烈和燃烧|in · can · des · cent|the -sc- and the -ent ending|含 -sc-，结尾 -ent
      iridescent|beetle wings turning green, blue and purple|soap bubbles swirling with shifting rainbow colors|a shell flashing pink and green when tilted|iridescent means showing colors that change in the light; lurid means unpleasantly bright|iridescent 是彩虹色的；lurid 是刺眼的|lurid means harsh and unpleasantly bright, not lovely rainbow colors that shift as the light changes|lurid 是刺眼难看，不是随光线变换的美丽彩虹色|wan means pale and tired, the opposite of flashing, shifting rainbow colors|wan 是苍白疲惫，和闪烁变幻的彩虹色正好相反|ir · i · des · cent|one r and the -sc-|只有一个 r，含 -sc-
      opalescent|lamp glass milky white with hints of blue and pink|a pale mist faintly shimmering with color|a pearl's milky gleam with a hint of rainbow|opalescent means showing milky changing colors like an opal; ruddy means healthily red|opalescent 是乳白光的；ruddy 是红润的|ruddy means a healthy red, especially of a face, not milky white glass, mist or pearls|ruddy 是健康的红色，多指脸色，不形容乳白色的玻璃、雾或珍珠|sallow means a sickly yellow skin, not the milky shimmer of glass, mist or a pearl|sallow 是病态蜡黄的皮肤，不是玻璃、雾气或珍珠的乳白光泽|o · pal · es · cent|*opal* plus -escent|*opal* 加 -escent
      phosphorescent|waves lit by tiny glowing sea creatures|watch hands glowing in the dark without heat|animals giving off a cold, faint light|phosphorescent means giving off faint light without heat; incandescent means glowing with heat|phosphorescent 是磷光的；incandescent 是白炽的|incandescent means glowing from heat, but this faint, cold light comes without any heat|incandescent 是因高温发光，而这种微弱冷光不带任何热量|burnished means polished until shiny, not giving off light of its own in the dark|burnished 是擦得锃亮，不是自己在黑暗中发光|phos · pho · res · cent|ph twice and the -sc-|两处 ph，含 -sc-
      lustrous|black hair shining softly in lamplight|silk with a soft, rich sheen|a horse's coat gleaming softly in the sun|lustrous means shining softly; wan means pale and tired|lustrous 是有光泽的；wan 是苍白的|wan means pale, weak and tired, the opposite of hair, silk or a coat that shines and gleams|wan 是苍白无力，和闪亮有光泽的头发、丝绸或毛皮正好相反|lurid means harsh and unpleasantly bright, not a soft, rich shine|lurid 是刺眼难看，不是柔和润泽的光泽|lus · trous|the -trous ending|结尾是 -trous
      burnished|copper pots rubbed until they shone|a sunset gold as bright as metal rubbed to a shine|a table polished smooth by a hundred years of hands|burnished means polished until shiny; sallow means sickly yellow|burnished 是擦亮的；sallow 是蜡黄的|sallow means a sickly yellow skin, not copper, gold or wood polished to a shine|sallow 是病态蜡黄的皮肤，不是擦亮的铜、金或木头|wan means pale and dull, the opposite of shining polished metal and wood|wan 是苍白黯淡，和锃亮的金属和木头正好相反|bur · nished|the -ished ending|结尾是 -ished
      lurid|walls so harshly green they hurt the eyes|shocking crime stories meant to thrill readers|an ugly red glow above a burning factory|lurid means unpleasantly bright or shocking; iridescent means showing lovely shifting colors|lurid 是刺眼的、耸人听闻的；iridescent 是彩虹色的|iridescent means lovely shifting colors, not harsh walls, shocking details or an ugly glow|iridescent 是美丽变幻的色彩，不是刺眼的墙、骇人的细节或难看的红光|ruddy means a healthy red, not an ugly glare or shocking stories|ruddy 是健康的红色，不是难看的强光或骇人的故事|lu · rid|the -id ending|结尾是 -id
      wan|a pale, tired smile after an operation|a face drawn from lack of sleep|a weak, pale light through a dirty window|wan means pale and looking tired or ill; ruddy means healthily red|wan 是苍白憔悴的；ruddy 是红润的|ruddy means healthily red, the opposite of a pale smile, a drawn face or a weak light|ruddy 是健康红润，和苍白的笑容、憔悴的脸、微弱的光正好相反|lustrous means shining softly, the opposite of pale, weak and tired|lustrous 是有光泽的，和苍白、微弱、疲惫正好相反|wan|one syllable, rhyming with *on*|单音节，与 *on* 押韵
      sallow|unhealthy yellow skin from months without sun|a yellowish, sickly clerk|sickly yellow skin after a fever|sallow means an unhealthy yellowish color; ruddy means a healthy red|sallow 是蜡黄的；ruddy 是红润的|ruddy means a healthy red, the opposite of sickly yellow skin|ruddy 是健康红润，和病态蜡黄的皮肤正好相反|lustrous means shining softly, not dull, sickly yellow skin|lustrous 是有光泽的，不是黯淡蜡黄的皮肤|sal · low|the double l and the -ow ending|双写 l，结尾 -ow
      ruddy|a farmer's face red and healthy from open air|cheeks flushed a healthy red in the cold|an evening sky glowing red over the hills|ruddy means having a healthy red color; sallow means sickly yellow|ruddy 是红润的；sallow 是蜡黄的|sallow means sickly yellow, the opposite of a healthy red face, cheeks or sky|sallow 是病态蜡黄，和健康红润的脸、脸颊或天空正好相反|wan means pale and tired, the opposite of glowing red|wan 是苍白疲惫，和红彤彤正好相反|rud · dy|the double d and the -y ending|双写 d，结尾 -y
    `,
  },
);

const movement = batch(
  "words-of-walking-and-moving",
  ["Words of Walking and Moving", "行走与移动的词"],
  ["the many ways to move", "各种移动方式"],
  `
  amble|to walk slowly in a relaxed way|缓行，漫步|After dinner we like to ___ along the beach, strolling slowly with no place to be.|The old dog likes to ___ around the garden, wandering slowly and stopping to sniff every flower.|On Sundays, tourists ___ through the market at an easy, relaxed pace.|scamper,careen|ambled,ambling
  plod|to walk slowly with heavy steps; to work slowly and steadily|沉重地走；埋头苦干|The tired soldiers ___ through the mud, dragging their heavy boots one step at a time.|She will ___ on until the job is done, working slowly and steadily however long it takes.|At dusk the cows ___ home along the lane, slow and heavy-footed.|flit,scamper|plodded,plodding
  lumber|to move in a slow, heavy, awkward way|笨重地移动|The huge bear began to ___ toward the river, its heavy body rolling with each clumsy step.|Loaded trucks ___ up the mountain road, slow and heavy on the steep bends.|The big man would ___ across the room, heavy and awkward, bumping into chairs.|totter,scamper|lumbered,lumbering
  strut|to walk in a proud, stiff way|趾高气扬地走|The rooster likes to ___ around the yard, chest puffed out and head held high.|Proud and stiff, the models ___ down the runway, chins in the air.|He would ___ about the office, stiff with pride, as if he owned the place.|slither,scamper|strutted,strutting
  swagger|to walk or behave in a very confident, proud way|大摇大摆地走|After his win, the champion began to ___ into the gym, shoulders rolling with confidence.|They ___ through town after the victory, loud, bold and sure of themselves.|After every goal he would ___ past the other players, chest out, grinning with confidence.|totter,slither|swaggered,swaggering
  totter|to walk or move unsteadily, as if about to fall|蹒跚，摇摇欲坠|The baby began to ___ toward her mother, wobbling on her first unsteady steps.|In the strong wind the old buildings ___, swaying as if they might fall at any moment.|The government seemed to ___ on the edge of collapse, ready to fall within days.|lumber,swagger|tottered,tottering
  scamper|to run with quick light steps, like a small animal|蹦蹦跳跳地跑|At night the mice ___ across the floor, quick and light, and vanish under the stove.|Laughing, the children ___ off to play, skipping and running on light feet.|At the sound of the dog, a squirrel will ___ up the tree in a flash.|lumber,plod|scampered,scampering
  flit|to move quickly and lightly from one place to another|掠过，轻快地飞|In summer, butterflies ___ from flower to flower, never resting for long.|Her eyes ___ nervously around the room, darting from face to face.|He likes to ___ from job to job, never staying anywhere longer than a month.|plod,lumber|flitted,flitting
  careen|to move fast and out of control|失控地猛冲|With its brakes gone, the bus began to ___ down the hill, swerving wildly.|Cars ___ around the icy corner, sliding out of control into the ditch.|In the storm the boat would ___ wildly, tossed this way and that by the waves.|amble,slither|careened,careening
  slither|to move smoothly along the ground, twisting like a snake|蜿蜒滑行|Snakes ___ through the long grass, twisting smoothly over the ground.|The slippery eel began to ___ out of his hands, twisting free.|Laughing, they ___ down the muddy bank on their bellies, sliding and twisting.|careen,strut|slithered,slithering
  `,
  "context-clues",
  {
    intro: t(
      "Tourists **amble** through the market, soldiers **plod** through the mud, mice **scamper** across the floor and a bus with no brakes can **careen** down the hill. These ten words help you describe the many ways that people, animals and things move.",
      "游客在市场里漫步（**amble**），士兵在泥里沉重地跋涉（**plod**），老鼠蹦跳着跑过地板（**scamper**），失灵的公共汽车可能失控冲下山坡（**careen**）。这十个词帮你描述人、动物和物体的各种移动方式。",
    ),
    watchOut: {
      meanings: t(
        "To **strut** is to walk stiffly with pride, like a rooster, while to **swagger** is to walk with bold, rolling confidence, like a champion; to **totter** is to walk as if about to fall.",
        "**strut** 是像公鸡一样骄傲僵硬地走；**swagger** 是像冠军一样大摇大摆、满怀自信地走；**totter** 是摇摇晃晃、像要摔倒似地走。",
      ),
      use: t(
        "**Plod** and **lumber** are both slow and heavy, but plodding is steady and patient, as in work, while lumbering is clumsy and awkward, as with a bear.",
        "**plod** 和 **lumber** 都慢而沉重，但 plod 稳定耐心，可指工作；lumber 笨拙别扭，如熊走路。",
      ),
      spelling: t(
        "**Careen** has a double e, **flit** doubles the t in *flitted*, and **swagger** has a double g.",
        "**careen** 双写 e；**flit** 的过去式 *flitted* 双写 t；**swagger** 双写 g。",
      ),
    },
    notes: `
      amble|strolling slowly along a beach with no place to be|an old dog wandering slowly and sniffing flowers|tourists at an easy, relaxed pace|amble means to walk slowly in a relaxed way; scamper means to run with quick light steps|amble 是漫步；scamper 是蹦跳着跑|scamper means to run quickly and lightly, the opposite of strolling slowly at an easy pace|scamper 是轻快地跑，和慢悠悠地闲逛正好相反|careen means to rush out of control, the opposite of a slow, relaxed stroll|careen 是失控猛冲，和悠闲的漫步正好相反|am · ble|the -ble ending|结尾是 -ble
      plod|soldiers dragging heavy boots through mud|working slowly and steadily however long it takes|cows walking home slow and heavy-footed|plod means to walk heavily or work steadily; flit means to move quickly and lightly|plod 是沉重地走、埋头苦干；flit 是轻快地掠过|flit means to move quickly and lightly, the opposite of heavy boots, steady work and heavy-footed cows|flit 是轻快掠过，和沉重的靴子、稳扎稳打的工作和步履沉重的牛正好相反|scamper means to run lightly and quickly, not to trudge with heavy steps|scamper 是轻快地跑，不是迈着沉重的步子走|plod|the short o and the -d ending|o 发短音，结尾 -d
      lumber|a bear's heavy body rolling with clumsy steps|loaded trucks slow and heavy on steep bends|a big man bumping into chairs|lumber means to move slowly, heavily and awkwardly; totter means to move unsteadily as if about to fall|lumber 是笨重地移动；totter 是蹒跚|totter means to wobble as if about to fall, but this movement is heavy and steady, not on the point of falling|totter 是摇摇晃晃快要倒下，而这里的移动沉重却稳当，并非要倒|scamper means to run quickly and lightly, the opposite of slow, heavy, clumsy movement|scamper 是轻快地跑，和缓慢笨重的移动正好相反|lum · ber|the -ber ending|结尾是 -ber
      strut|a rooster with its chest puffed out|models proud and stiff on a runway|a man stiff with pride as if he owned the place|strut means to walk proudly and stiffly; slither means to slide along like a snake|strut 是趾高气扬地走；slither 是蜿蜒滑行|slither means to slide along the ground, not to walk upright with chest out and chin high|slither 是贴地滑行，不是挺胸昂首地走|scamper means to run quickly like a small animal, not to walk stiffly with pride|scamper 是像小动物一样快跑，不是骄傲僵硬地走|strut|the -ut ending, doubling t in *strutted*|结尾 -ut，*strutted* 双写 t
      swagger|a champion entering a gym with rolling shoulders|a team loud, bold and sure of themselves|a player passing others with his chest out after a goal|swagger means to walk with bold confidence; totter means to walk unsteadily|swagger 是大摇大摆地走；totter 是蹒跚|totter means to walk unsteadily as if about to fall, the opposite of bold, rolling confidence|totter 是摇摇欲坠地走，和大摇大摆的自信正好相反|slither means to slide like a snake, not to walk with chest out and shoulders rolling|slither 是像蛇一样滑行，不是挺胸晃肩地走|swag · ger|the double g|双写 g
      totter|a baby wobbling on her first steps|old buildings swaying as if they might fall|a government ready to fall within days|totter means to move unsteadily as if about to fall; lumber means to move heavily and awkwardly|totter 是蹒跚、摇摇欲坠；lumber 是笨重地移动|lumber means to move heavily, not to wobble and sway on the point of falling|lumber 是笨重地移动，不是摇摇晃晃快要倒下|swagger means to walk with bold confidence, the opposite of wobbling and being ready to fall|swagger 是大摇大摆，和摇摇晃晃、快要倒下正好相反|tot · ter|the double t|双写 t
      scamper|mice running quick and light under a stove|children skipping and running on light feet|a squirrel racing up a tree in a flash|scamper means to run with quick light steps; lumber means to move heavily|scamper 是蹦跳着跑；lumber 是笨重地移动|lumber means to move slowly and heavily, the opposite of quick, light running|lumber 是缓慢笨重地移动，和轻快地跑正好相反|plod means to walk with heavy steps, the opposite of skipping on light feet|plod 是迈着沉重的步子走，和轻快地蹦跳正好相反|scam · per|the -per ending|结尾是 -per
      flit|butterflies never resting long on a flower|eyes darting nervously from face to face|a man moving from job to job every month|flit means to move quickly and lightly from place to place; plod means to move heavily|flit 是轻快地掠过；plod 是沉重地走|plod means to move slowly and heavily, the opposite of butterflies, darting eyes and quick changes of job|plod 是缓慢沉重地走，和翩飞的蝴蝶、游移的目光、频繁跳槽正好相反|lumber means to move heavily and awkwardly, not quickly and lightly from one place to the next|lumber 是笨重地移动，不是轻快地从一处到另一处|flit|the short i, doubling t in *flitted*|i 发短音，*flitted* 双写 t
      careen|a bus with no brakes swerving downhill|cars sliding out of control on ice|a boat tossed wildly by waves|careen means to move fast and out of control; amble means to walk slowly and relaxed|careen 是失控猛冲；amble 是漫步|amble means to walk slowly and calmly, the opposite of swerving, sliding and being tossed out of control|amble 是悠闲地慢走，和急转、打滑、失控颠簸正好相反|slither means to slide smoothly like a snake, not to rush wildly out of control|slither 是像蛇一样平滑地滑行，不是失控狂冲|ca · reen|the double e|双写 e
      slither|snakes twisting through long grass|an eel twisting free from someone's hands|people sliding down a muddy bank on their bellies|slither means to slide smoothly, twisting like a snake; careen means to rush out of control|slither 是蜿蜒滑行；careen 是失控猛冲|careen means to rush fast and out of control, not to twist smoothly along the ground|careen 是快速失控地冲，不是贴地蜿蜒滑行|strut means to walk proudly upright, the opposite of sliding on one's belly|strut 是昂首阔步，和贴着肚皮滑行正好相反|slith · er|the th and the -er ending|含 th，结尾 -er
    `,
  },
);

const texture = batch(
  "words-of-surfaces-and-textures",
  ["Words of Surfaces and Textures", "表面与质地的词"],
  ["how things feel and look to the touch", "物体摸起来、看起来的样子"],
  `
  sleek|smooth and shiny; elegant and well-shaped|光滑的；线条流畅的|The seal's ___ fur, smooth and shiny, glistened as it slid out of the water.|A long, ___ black car, smooth and shining, pulled up outside the hotel.|Her ___ new phone, thin and smooth with elegant curves, fits any pocket.|gnarled,jagged|sleekly
  velvety|soft and smooth like velvet|天鹅绒般柔软的|The ripe peach had ___ skin, covered with a soft fuzz like cloth.|The singer's ___ voice, soft and warm, filled the hall.|Moss made a thick, ___ carpet on the rocks, soft as cushions under our hands.|sleek,gritty|
  gritty|full of small hard grains; showing the harsh side of life; brave|有沙粒的；写实的；坚韧的|The salad was ___ with sand, crunching unpleasantly between our teeth.|The film is a ___ story of the streets, showing poverty and crime without softening anything.|She was a tough, ___ player who never gave up, even when injured and far behind.|supple,sleek|
  grainy|having a rough surface or look; made of grains; unclear in a photograph|粗粒的；(照片)颗粒粗的|The old photo was ___, so speckled that the faces were hard to make out.|Brown, ___ bread, full of whole seeds and coarse flour, is good for you.|The security video was too ___ and blurred to identify the thief.|serrated,velvety|
  supple|bending easily without breaking; moving easily|柔软的；灵活的|Rubbed with oil, the stiff leather becomes ___ and bends easily without cracking.|Dancers have ___ bodies that bend easily into almost any shape.|The ___ young branches bent low in the wind but did not break.|taut,jagged|suppleness
  taut|stretched tight; showing worry or stress|绷紧的；紧张的|Pull the rope ___, stretching it tight until there is no slack at all.|Her face was ___ with fear, every muscle drawn tight.|The novel is ___ and fast, every page tight with tension.|supple,corrugated|tautly
  gnarled|twisted and rough, especially from age|多节的，扭曲的|A ___ old oak, twisted and knotted by three centuries of wind, stood by the gate.|The old farmer had ___ hands, twisted and rough from a lifetime of work.|Twisted, ___ roots, knotted with age, crossed the forest path.|sleek,velvety|
  jagged|having sharp, uneven points|锯齿状的，参差不齐的|The ___ rocks, sharp and broken, cut his feet as he climbed out of the sea.|A spiky, ___ line on the screen, rising and falling in sharp points, showed his heartbeat.|Broken, ___ glass, all sharp uneven points, lay on the floor.|sleek,supple|jaggedly
  serrated|having a row of sharp points along the edge, like a saw|锯齿状的|Use a ___ knife, its edge lined with tiny teeth like a saw, to cut the bread.|The leaf has ___ edges, with a row of small sharp points all the way around.|A shark's teeth are ___, each edge lined with tiny points like a saw.|corrugated,supple|
  corrugated|shaped into parallel folds or ridges|波纹状的|The shed had a ___ iron roof, its metal sheets folded into rows of ridges.|Goods are shipped in ___ cardboard boxes, strong because of the wavy ridged layer inside.|The ___ dirt road, worn into rows of ridges like a washboard, shook the car.|serrated,taut|
  `,
  "context-clues",
  {
    intro: t(
      "A **sleek** car, a **velvety** peach, a **gnarled** old oak and **jagged** rocks all feel very different under your hand. These ten words help you describe how surfaces feel and look, from smooth and soft to rough, tight, ridged and sharp.",
      "线条流畅的（**sleek**）汽车、天鹅绒般柔软的（**velvety**）桃子、多节扭曲的（**gnarled**）老橡树和锯齿般的（**jagged**）岩石，摸起来感觉截然不同。这十个词帮你描述表面摸起来、看起来的样子，从光滑柔软到粗糙、紧绷、起楞和锋利。",
    ),
    watchOut: {
      meanings: t(
        "**Jagged** points are rough and uneven, like broken glass, while **serrated** points run in a neat row along an edge, like the teeth of a bread knife.",
        "**jagged** 的尖刺粗糙参差，如碎玻璃；**serrated** 的尖齿沿边缘整齐排列，如面包刀的锯齿。",
      ),
      use: t(
        "**Gritty** sand gets between your teeth, but a gritty film or a gritty player is tough and harsh; **grainy** describes a photo or bread with a speckled, coarse look.",
        "**gritty** 可指沙粒硌牙，也可形容影片冷峻写实或球员坚韧不拔；**grainy** 形容照片或面包颗粒粗、斑驳粗糙。",
      ),
      spelling: t(
        "**Gnarled** has a silent g, **corrugated** has a double r, and **taut** has au, unlike *taught*.",
        "**gnarled** 的 g 不发音；**corrugated** 双写 r；**taut** 含 au，不同于 *taught*。",
      ),
    },
    notes: `
      sleek|a seal's fur glistening as it left the water|a long, smooth, shining black car|a thin phone with elegant curves|sleek means smooth, shiny and elegant; gnarled means twisted and rough|sleek 是光滑流畅的；gnarled 是扭曲粗糙的|gnarled means twisted and rough with age, the opposite of shiny fur, a gleaming car and elegant curves|gnarled 是因年老而扭曲粗糙，和光亮的毛皮、锃亮的汽车和优雅的曲线正好相反|jagged means full of sharp, uneven points, the opposite of smooth and shiny|jagged 是参差锋利，和光滑闪亮正好相反|sleek|the double e|双写 e
      velvety|a peach's skin with soft fuzz like cloth|a singer's soft, warm voice|moss as thick and soft as cushions|velvety means soft and smooth like velvet; sleek means smooth and shiny|velvety 是天鹅绒般柔软的；sleek 是光滑闪亮的|sleek means hard-smooth and shiny, like a car, not soft and fuzzy like cloth, cushions or a warm voice|sleek 是像汽车那样光亮顺滑，不是像布料、坐垫或温暖嗓音那样柔软|gritty means full of hard grains, the opposite of soft fuzz and cushiony moss|gritty 是满是硬沙粒，和柔软的绒毛、垫子般的苔藓正好相反|vel · vet · y|*velvet* plus -y|*velvet* 加 -y
      gritty|sand crunching in a salad|a film showing poverty and crime unsoftened|a tough player who never gave up when injured|gritty means full of hard grains, harsh, or brave; supple means bending easily|gritty 是有沙粒的、写实的、坚韧的；supple 是柔软灵活的|supple means bending easily, not crunching with sand, showing harsh street life or refusing to give up|supple 是柔韧易弯，不是满嘴沙子、展现街头的严酷或绝不放弃|sleek means smooth and polished, the opposite of sandy, harsh and rough|sleek 是光滑精致，和多沙、严酷、粗粝正好相反|grit · ty|the double t|双写 t
      grainy|an old photo so speckled that faces were unclear|bread full of whole seeds and coarse flour|a security video too blurred to identify a thief|grainy means rough, made of grains, or unclear in a picture; serrated means edged with saw-like points|grainy 是粗粒的、颗粒粗的；serrated 是锯齿状的|serrated describes an edge lined with sharp points, not a speckled photo, seedy bread or a blurred video|serrated 形容带尖齿的边缘，不形容斑驳的照片、带籽的面包或模糊的录像|velvety means soft and smooth, not speckled, coarse or blurred|velvety 是柔软光滑，不是斑驳、粗糙或模糊|grain · y|*grain* plus -y|*grain* 加 -y
      supple|oiled leather bending without cracking|dancers' bodies bending into almost any shape|young branches bending in wind without breaking|supple means bending easily without breaking; taut means stretched tight|supple 是柔韧的；taut 是绷紧的|taut means stretched tight and rigid, the opposite of leather, bodies and branches that bend easily|taut 是绷得紧紧的，和柔软易弯的皮革、身体和树枝正好相反|jagged means full of sharp points, not soft and bending easily|jagged 是参差锋利，不是柔软易弯|sup · ple|the double p and the -ple ending|双写 p，结尾 -ple
      taut|a rope stretched tight with no slack|a face with every muscle drawn tight in fear|a novel tight with tension on every page|taut means stretched tight or tense; supple means bending easily|taut 是绷紧的、紧张的；supple 是柔软灵活的|supple means loose and bending easily, the opposite of a rope with no slack or a face drawn tight|supple 是柔软灵活，和毫无松弛的绳子或紧绷的面孔正好相反|corrugated means shaped into ridges, not stretched tight or tense|corrugated 是起楞的波纹状，不是绷紧或紧张|taut|the au, unlike *taught*|含 au，不同于 *taught*
      gnarled|an oak twisted and knotted by three centuries of wind|a farmer's hands twisted from a lifetime of work|roots knotted with age crossing a path|gnarled means twisted and rough with age; sleek means smooth and shiny|gnarled 是多节扭曲的；sleek 是光滑的|sleek means smooth, shiny and elegant, the opposite of twisted, knotted oaks, hands and roots|sleek 是光滑优雅，和扭曲多节的橡树、双手和树根正好相反|velvety means soft and smooth like cloth, the opposite of rough, knotted and twisted|velvety 是柔软如绒，和粗糙、多节、扭曲正好相反|gnarled|the silent g|g 不发音
      jagged|sharp, broken rocks cutting a man's feet|a spiky line of sharp points showing a heartbeat|broken glass all sharp uneven points|jagged means having sharp, uneven points; sleek means smooth and shiny|jagged 是参差锋利的；sleek 是光滑的|sleek means smooth and shiny, the opposite of rocks, a line and glass full of sharp broken points|sleek 是光滑闪亮，和满是尖锐断口的岩石、线条和玻璃正好相反|supple means soft and bending easily, not sharp, broken and cutting|supple 是柔软易弯，不是尖锐、破碎、伤人的|jag · ged|the double g and the -ed ending|双写 g，结尾 -ed
      serrated|a bread knife edged with tiny teeth like a saw|a leaf with a row of small points around its edge|shark's teeth lined with tiny saw-like points|serrated means having a row of sharp points along an edge; corrugated means shaped into ridges|serrated 是锯齿状的；corrugated 是波纹状的|corrugated means folded into rows of rounded ridges across a surface, not a row of sharp teeth along an edge|corrugated 是表面折成一排排圆滑的楞，不是边缘上的一排尖齿|supple means soft and bending, not an edge lined with sharp points|supple 是柔软易弯，不是边缘布满尖齿|ser · rat · ed|the double r|双写 r
      corrugated|a shed roof of metal sheets folded into ridges|cardboard made strong by a wavy, ridged layer|a dirt road worn into ridges like a washboard|corrugated means shaped into parallel folds or ridges; serrated means edged with sharp points|corrugated 是波纹状的；serrated 是锯齿状的|serrated describes a sharp, saw-like edge, not a roof, cardboard or road folded into ridges|serrated 形容锋利的锯齿边，不形容折成波纹的屋顶、纸板或道路|taut means stretched tight, not folded into rows of ridges|taut 是绷紧的，不是折成一排排的楞|cor · ru · gat · ed|the double r|双写 r
    `,
  },
);

/** batchesE are the batches of rule and money, of elections, and of the senses. */
export const batchesE: readonly BatchSpec[] = [rule, money, elections, prose, sound, light, movement, texture];
