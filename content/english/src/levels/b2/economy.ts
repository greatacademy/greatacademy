// B2, unit 2: Work and the Economy. The economy, companies, management, employment, finance, working conditions,
// production and trade, skills, success and failure, words of time and sequence, and quantity; the passive with modals
// and perfect forms, and have something done; writing a report.

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator, type WritingItem } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { fill, judgedTopic } from "../a2/kit.ts";
import { interleave, vocabularyTopic, word } from "../words.ts";

const economy = vocabularyTopic({
  id: "b2-words-economy",
  title: t("The Economy", "经济"),
  summary: t(
    "Economic recession and inflation; exports and imports; investment, investors and shareholders; booms and deficits; wealthy countries and prosperity.",
    "经济衰退和通货膨胀；出口和进口；投资、投资者和股东；繁荣期和赤字；富裕的国家和繁荣。",
  ),
  prerequisites: ["b1-words-business"],
  words: [
    word(
      "economic",
      "about the economy, money, trade and industry",
      "经济的",
      "The country is facing serious {economic} problems.|wealthy deficit | {Economic} growth slowed last year.|Wealthy Deficit | The {economic} crisis cost millions of jobs.|wealthy boom",
      "economical ecological",
    ),
    word(
      "recession recessions",
      "a time when the economy of a country is doing badly and many people lose their jobs",
      "经济衰退",
      "Many shops closed during the {recession}.|prosperity investor | The economy is in {recession} for the first time in ten years.|prosperity inflation | Experts fear a {recession} next year.|prosperity shareholder",
      "recess procession",
    ),
    word(
      "inflation",
      "a general rise in prices over time",
      "通货膨胀",
      "{Inflation} means that prices keep rising.|Recession Deficit | {Inflation} reached 10 percent last year.|Prosperity Shareholder | High {inflation} makes our savings worth less.|prosperity investor",
      "infection inflammation",
    ),
    word(
      "export exports exported exporting",
      "to sell goods to another country; something sold to another country",
      "出口；出口商品",
      "China {exports} electronics to many countries.|deficits booms | Coffee is the country's main {export}.|investor shareholder | The company {exported} goods worth two million dollars.|invested boomed",
      "expert expose",
    ),
    word(
      "import imports imported importing",
      "to buy goods from another country; something bought from another country",
      "进口；进口商品",
      "Japan {imports} most of its oil.|invests booms | The country depends on food {imports}.|investors shareholders | These bananas were {imported} from Ecuador.|invested boomed",
      "impart important",
    ),
    word(
      "investment investments",
      "money put into something to make a profit; something worth buying or doing for the future",
      "投资",
      "Buying a flat can be a good {investment}.|inflation recession | The region needs more foreign {investment}.|inflation deficit | Education is an {investment} in the future.|inflation recession",
      "investigation invention",
    ),
    word(
      "investor investors",
      "a person who puts money into a business to make a profit",
      "投资者",
      "{Investors} lost money when the shares fell.|Exports Imports | She is looking for an {investor} for her company.|inflation export | Foreign {investors} are buying land here.|exports deficits",
      "inventor investigator",
      "shareholder",
    ),
    word(
      "shareholder shareholders",
      "a person who owns part of a company",
      "股东",
      "The {shareholders} voted for the new boss.|deficits exports | Every {shareholder} received a letter about the profits.|deficit export | She is the biggest {shareholder} in the company.|deficit inflation",
      "shopkeeper householder",
      "investor",
    ),
    word(
      "boom booms",
      "a time when business grows quickly and there is a lot of trade",
      "繁荣期；激增",
      "There was a building {boom} in the 1990s.|deficit recession | The tourist {boom} brought jobs to the island.|deficit recession | Online shopping is having a {boom}.|deficit recession",
      "bloom doom",
    ),
    word(
      "deficit deficits",
      "the amount by which money spent is more than money received",
      "赤字；逆差",
      "The government has a large budget {deficit}.|boom prosperity | The country has a trade {deficit} because it imports more than it exports.|boom prosperity | Cutting spending will reduce the {deficit}.|prosperity investor",
      "defect definite",
    ),
    word(
      "wealthy",
      "having a lot of money; rich",
      "富有的",
      "She comes from a {wealthy} family.|economic deficit | The {wealthy} should pay more tax.|economic deficit | It is one of the most {wealthy} areas of the city.|economic deficit",
      "healthy worthy",
    ),
    word(
      "prosperity",
      "the state of being successful and having a lot of money",
      "繁荣；兴旺",
      "The new factory brought {prosperity} to the town.|investor shareholder | Years of peace led to great {prosperity}.|investor shareholder | Hard work is the key to {prosperity}.|recession deficit",
      "property posterity",
    ),
  ],
});

const companies = vocabularyTopic({
  id: "b2-words-companies",
  title: t("Companies", "公司"),
  summary: t(
    "Corporations, firms and enterprises; startups and franchises; mergers and partnerships; competitors, competition and competing; monopolies and multinationals.",
    "大公司、公司和企业；初创公司和特许经营店；合并和合伙；竞争对手、竞争和比赛；垄断和跨国公司。",
  ),
  prerequisites: ["b1-words-business"],
  words: [
    word(
      "corporation corporations",
      "a large company or a group of companies",
      "大公司；集团",
      "She works for a large American {corporation}.|competition merger | Big {corporations} pay too little tax.|Mergers Competitions | The {corporation} employs 50,000 people.|competition merger",
      "cooperation corruption",
      "firm enterprise multinational",
    ),
    word(
      "firm firms",
      "a company or a business",
      "公司；商行",
      "He works for a law {firm} in Shanghai.|merger competition | The {firm} was started by two brothers.|merger competition | Small {firms} find it hard to borrow money.|mergers competitions",
      "farm form",
      "corporation enterprise",
    ),
    word(
      "enterprise enterprises",
      "a business or company; a new project, especially a difficult one",
      "企业；事业",
      "The government supports small {enterprises}.|mergers competitions | The café is a family {enterprise}.|merger competition | State {enterprises} employ millions of workers.|mergers competitions",
      "entertainment entrance",
      "corporation firm",
    ),
    word(
      "startup startups",
      "a new, small company, often in technology",
      "初创公司",
      "He left his job to work for a tech {startup}.|merger competition | She raised money to launch her own {startup}.|merger monopoly | The {startup} began in a garage with three people.|merger monopoly",
      "setup restart",
    ),
    word(
      "franchise franchises",
      "the right to sell a company's products under its name; a shop run in this way",
      "特许经营权；加盟店",
      "He runs a {franchise} of a famous coffee chain.|merger competition | The pizza company sells {franchises} to local owners.|mergers competitors | Opening a {franchise} is less risky than starting alone.|merger competitor",
      "frankness finance",
    ),
    word(
      "merger mergers",
      "the joining of two or more companies into one",
      "合并",
      "The {merger} of the two banks created a giant.|franchise competitor | After the {merger}, many workers lost their jobs.|franchise startup | The two airlines announced a {merger}.|competitor monopoly",
      "murder margin",
    ),
    word(
      "competitor competitors",
      "a person or company that tries to beat others, in business or in a game",
      "竞争对手；参赛者",
      "Our main {competitor} has cut its prices.|merger partnership | She beat all the other {competitors} in the race.|mergers monopolies | The company bought one of its {competitors}.|mergers partnerships",
      "computer composer",
    ),
    word(
      "competition competitions",
      "trying to be more successful than others; a contest",
      "竞争；比赛",
      "There is strong {competition} between the two shops.|merger competitor | {Competition} keeps prices low.|Merger Franchise | She won first prize in a singing {competition}.|merger monopoly",
      "completion composition",
    ),
    word(
      "compete competes competed competing",
      "to try to be more successful than others",
      "竞争；比赛",
      "Small shops can't {compete} with big supermarkets.|monopoly partnership | Twenty teams will {compete} for the cup.|monopoly partnership | The two companies are {competing} for customers.|merging franchising",
      "complete compute",
    ),
    word(
      "monopoly monopolies",
      "complete control of a market by one company, with no competition",
      "垄断",
      "The company has a {monopoly} on train travel.|competitor partnership | When one company is the only seller, it has a {monopoly}.|competitor startup | The state ended its {monopoly} on electricity.|competitor startup",
      "monotony monologue",
    ),
    word(
      "partnership partnerships",
      "working together with another person or organization; a business owned by two or more people",
      "合伙；合作关系",
      "The two firms worked in {partnership} on the project.|monopoly competitor | The school has a {partnership} with a local museum.|monopoly competitor | The business {partnership} between the two sisters was a success.|monopoly competitor",
      "membership ownership",
    ),
    word(
      "multinational multinationals",
      "working in many countries; a large company that does this",
      "跨国的；跨国公司",
      "She works for a {multinational} company.|merger competition | {Multinationals} have offices in many countries.|Mergers Competitions | The {multinational} closed its factory in the town.|merger competition",
      "multicultural multiple",
      "corporation",
    ),
  ],
});

const management = vocabularyTopic({
  id: "b2-words-management",
  title: t("Management", "管理"),
  summary: t(
    "Strategies, objectives and targets; priorities and decisions; delegating, supervising and coordinating; negotiating and negotiations; implementing and evaluating.",
    "战略、目标和指标；优先事项和决定；委派、监督和协调；谈判；实施和评估。",
  ),
  prerequisites: ["b1-words-workplace"],
  words: [
    word(
      "strategy strategies",
      "a plan for reaching a goal, often over a long time",
      "战略；策略",
      "The company needs a new marketing {strategy}.|delegate supervise | Our {strategy} is to sell more online.|delegate evaluate | What's your {strategy} for winning the game?|supervise coordinate",
      "tragedy strategic",
    ),
    word(
      "objective objectives",
      "something that you are trying to achieve",
      "目标",
      "The main {objective} of the course is to improve your writing.|delegate negotiate | We achieved all our {objectives} this year.|negotiates delegates | The {objective} is to cut costs by ten percent.|supervise implement",
      "object objection",
      "target",
    ),
    word(
      "target targets",
      "a result that you try to reach; a thing that you aim at",
      "目标；靶子",
      "We met our sales {target} for the year.|delegate evaluate | The {target} is to plant a million trees.|supervise coordinate | The arrow hit the {target}.|delegate negotiate",
      "market forget",
      "objective",
    ),
    word(
      "priority priorities",
      "something that is more important than other things and must be dealt with first",
      "优先事项",
      "My family is my top {priority}.|delegate supervise | Safety must be our first {priority}.|coordinate negotiate | Make a list of your {priorities}.|delegates supervises",
      "prior majority",
    ),
    word(
      "decision decisions",
      "a choice that you make after thinking",
      "决定",
      "It was a hard {decision} to leave my job.|implement evaluate | Who made the {decision} to close the school?|supervise negotiate | We need a {decision} by Friday.|delegate evaluate",
      "division precision",
    ),
    word(
      "delegate delegates delegated delegating",
      "to give part of your work to someone else",
      "委派；授权",
      "A good manager knows how to {delegate} work to others.|priority strategy | She {delegated} the task to her assistant.|negotiation objective | You can't do everything yourself; learn to {delegate}.|strategy objective",
      "dedicate relegate",
    ),
    word(
      "supervise supervises supervised supervising",
      "to watch over people or work to make sure it is done correctly",
      "监督；管理",
      "Teachers {supervise} the children at lunchtime.|negotiation priority | She {supervises} a team of ten.|negotiation strategy | The work was {supervised} by an engineer.|negotiation target",
      "surprise survive",
    ),
    word(
      "coordinate coordinates coordinated coordinating",
      "to organize the different parts of an activity or the people in it so that they work well together",
      "协调",
      "She {coordinates} the work of three teams.|negotiation strategy | We need someone to {coordinate} the event.|priority target | The rescue was well {coordinated}.|negotiation objective",
      "corporate subordinate",
    ),
    word(
      "negotiate negotiates negotiated negotiating",
      "to talk with others to reach an agreement",
      "谈判；协商",
      "The union {negotiated} a pay rise.|objective decision | We are {negotiating} with a new supplier.|strategy target | You can often {negotiate} the price of a car.|target objective",
      "navigate necessitate",
    ),
    word(
      "negotiation negotiations",
      "formal talks to reach an agreement",
      "谈判",
      "After long {negotiations}, they signed the deal.|delegates supervises | Pay {negotiations} will start next week.|delegates coordinates | The deal is still under {negotiation}.|delegate supervise",
      "navigation nomination",
    ),
    word(
      "implement implements implemented implementing",
      "to make a plan or a decision start to work",
      "实施；执行",
      "The new rules will be {implemented} next year.|priority target | It's easy to make a plan but hard to {implement} it.|priority objective | The school {implemented} a ban on phones.|decision strategy",
      "complement implore",
    ),
    word(
      "evaluate evaluates evaluated evaluating",
      "to judge how good, useful or successful something is",
      "评估；评价",
      "We {evaluated} the results of the project.|priority target | Teachers {evaluate} each student's progress.|priority strategy | It is too early to {evaluate} the new policy.|decision objective",
      "evacuate elevate",
    ),
  ],
});

const employment = vocabularyTopic({
  id: "b2-words-employment",
  title: t("Employment", "就业"),
  summary: t(
    "The workforce; recruiting and recruitment; dismissing, redundancy and layoffs; freelance work; trainees, internships and apprentices; promotion and workload.",
    "劳动力；招聘；解雇、裁员；自由职业；实习生、实习和学徒；升职和工作量。",
  ),
  prerequisites: ["b1-words-applying"],
  words: [
    word(
      "workforce workforces",
      "all the people who work in a company, an industry or a country",
      "劳动力；全体员工",
      "Women make up half of the {workforce}.|layoff trainee | The company has a {workforce} of 2,000.|layoff internship | A skilled {workforce} attracts investors.|layoff workload",
      "workshop workplace",
    ),
    word(
      "recruit recruits recruited recruiting",
      "to find new people to work in a company or join an organization",
      "招聘；招收",
      "The company plans to {recruit} 200 new staff.|redundant freelance | The army is trying to {recruit} more young people.|redundant freelance | She was {recruited} straight from university.|redundant layoff",
      "recite reduce",
    ),
    word(
      "recruitment",
      "the process of finding new people to work for an organization",
      "招聘",
      "{Recruitment} of nurses is a big problem.|Redundant Freelance | The {recruitment} process takes two months.|redundant freelance | She works in {recruitment}.|redundant dismiss",
      "retirement requirement",
    ),
    word(
      "dismiss dismisses dismissed dismissing",
      "to remove someone from their job; to refuse to think about an idea",
      "解雇；不予考虑",
      "He was {dismissed} for being late every day.|redundant freelance | The manager {dismissed} two workers last week.|promotion internship | She {dismissed} the idea as silly.|recruited promoted",
      "dismay discuss",
    ),
    word(
      "redundant",
      "without a job because your job is no longer needed (made redundant); not needed",
      "被裁员的；多余的",
      "Fifty workers were made {redundant} when the factory closed.|freelance dismiss | Machines have made many jobs {redundant}.|freelance trainee | If you are made {redundant}, you may get some money from the company.|freelance trainee",
      "abundant redundancy",
    ),
    word(
      "layoff layoffs",
      "the ending of a worker's job because there is not enough work",
      "裁员；解雇",
      "The company announced 500 {layoffs}.|workloads workforces | {Layoffs} are expected after the merger.|Workloads Freelance | Workers are worried about more {layoffs}.|freelance trainee",
      "layout playoff",
    ),
    word(
      "freelance",
      "working for several companies, paid for each job, not employed by one",
      "自由职业的",
      "She works as a {freelance} designer.|layoff workload | He went {freelance} after ten years at the newspaper.|layoff workload | {Freelance} workers have no fixed salary.|Layoff Workload",
      "freehand freestyle",
    ),
    word(
      "trainee trainees",
      "a person who is being trained for a job",
      "实习生；受训者",
      "The bank hires twenty {trainees} every year.|workloads layoffs | As a {trainee}, she earns less than other staff.|workload layoff | The {trainee} chef cut his finger.|layoff workload",
      "trainer trained",
      "apprentice",
    ),
    word(
      "internship internships",
      "a period of work, often for a student, to get experience",
      "实习",
      "She did a summer {internship} at a bank.|workload layoff | {Internships} give students work experience.|Workloads Layoffs | Many {internships} are unpaid.|workloads layoffs",
      "internet citizenship",
    ),
    word(
      "apprentice apprentices",
      "a young person who works for an expert to learn a skill",
      "学徒",
      "He started as an {apprentice} to a carpenter.|workload layoff | The {apprentices} learn on the job.|workloads layoffs | She is an {apprentice} electrician.|layoff workload",
      "appetite apparent",
      "trainee",
    ),
    word(
      "promotion promotions",
      "a move to a more important job in the same company",
      "晋升；升职",
      "She got a {promotion} and a pay rise.|layoff workload | He was hoping for a {promotion} this year.|layoff workload | There are few chances of {promotion} here.|workload layoff",
      "motion protection",
    ),
    word(
      "workload workloads",
      "the amount of work that a person has to do",
      "工作量",
      "My {workload} has doubled since my colleague left.|workforce promotion | Teachers complain about their heavy {workload}.|workforce promotion | We need more staff to share the {workload}.|workforce promotion",
      "workout download",
    ),
  ],
});

const finance = vocabularyTopic({
  id: "b2-words-finance",
  title: t("Finance", "财务"),
  summary: t(
    "Revenue and expenditure; assets, funds and funding; grants and subsidies; mortgages and savings; going bankrupt; dividends and audits.",
    "收入和支出；资产、基金和资金；拨款和补贴；按揭贷款和储蓄；破产；股息和审计。",
  ),
  prerequisites: ["b1-words-personal-finance"],
  words: [
    word(
      "revenue revenues",
      "the money that a company or a government receives",
      "收入；税收",
      "The company's {revenue} rose by 20 percent.|bankrupt audit | Tourism is the island's main source of {revenue}.|expenditure mortgage | Tax {revenues} fell during the recession.|bankrupt mortgages",
      "revenge avenue",
    ),
    word(
      "expenditure expenditures",
      "the money that a person, a company or a government spends",
      "支出；开支",
      "Government {expenditure} on health has increased.|bankrupt dividend | We must reduce our {expenditure}.|bankrupt audit | Keep a record of all your {expenditure}.|bankrupt dividend",
      "expedition exposure",
    ),
    word(
      "asset assets",
      "something valuable that a person or a company owns; a useful quality",
      "资产；有价值的人或物",
      "His house is his biggest {asset}.|audit bankrupt | The company sold some of its {assets} to pay its debts.|audits subsidies | Her languages are a great {asset} in her job.|audit mortgage",
      "assent aspect",
    ),
    word(
      "fund funds",
      "an amount of money kept for a purpose; money that is available",
      "基金；资金",
      "We are raising money for a school {fund}.|mortgage audit | The {fund} pays for students' books.|audit mortgage | The museum is short of {funds}.|audits mortgages",
      "fun found",
      "funding",
    ),
    word(
      "funding",
      "money given by a government or an organization for a purpose",
      "资金；拨款",
      "The project lost its government {funding}.|mortgage audit | Schools need more {funding}.|bankrupt audit | Scientists applied for {funding} for their research.|bankrupt dividend",
      "founding finding",
      "fund grant subsidy",
    ),
    word(
      "grant grants",
      "money given by a government or an organization for a purpose, such as study",
      "拨款；助学金",
      "She got a {grant} to study abroad.|audit dividend | The council gave the theater a {grant} of \\$50,000.|audit bankrupt | Students can apply for a {grant} for living costs.|audit dividend",
      "grand grunt",
      "funding subsidy",
    ),
    word(
      "subsidy subsidies",
      "money that a government pays to keep prices low or to help an industry",
      "补贴",
      "Farmers receive a {subsidy} from the government.|audit bankrupt | The bus fares are low because of a government {subsidy}.|audit mortgage | The {subsidies} for electric cars will end next year.|audits mortgages",
      "subway subsidiary",
      "grant funding",
    ),
    word(
      "mortgage mortgages",
      "a loan from a bank to buy a house",
      "按揭贷款；抵押贷款",
      "They took out a {mortgage} to buy a flat.|dividend audit | We pay our {mortgage} every month.|dividend audit | Interest rates on {mortgages} have gone up.|dividends audits",
      "mortar margin",
    ),
    word(
      "bankrupt",
      "not able to pay your debts",
      "破产的",
      "The company went {bankrupt} last year.|asset revenue | If sales don't improve, we'll go {bankrupt}.|asset savings | The war left the country {bankrupt}.|revenue savings",
      "banker abrupt",
    ),
    word(
      "dividend dividends",
      "a part of a company's profit paid to its shareholders",
      "股息；红利",
      "Shareholders received a {dividend} of \\$2 a share.|mortgage audit | The company pays {dividends} twice a year.|mortgages audits | Hard work now will pay {dividends} later.|mortgages audits",
      "divided division",
    ),
    word(
      "savings",
      "money that you have kept and not spent",
      "储蓄；存款",
      "She spent all her {savings} on the trip.|audit bankrupt | Put your {savings} in a bank account.|audit bankrupt | They lost their life {savings} when the bank failed.|audit dividend",
      "saving sayings",
    ),
    word(
      "audit audits",
      "an official check of an organization's accounts",
      "审计；查账",
      "The accountants carried out an {audit} of the company.|asset grant | The {audit} found that money was missing.|asset grant | The law requires an {audit} every year.|asset bankrupt",
      "audio adult",
    ),
  ],
});

const conditions = vocabularyTopic({
  id: "b2-words-work-conditions",
  title: t("Working Conditions", "工作条件"),
  summary: t(
    "Unions and conditions; maternity and paternity leave; harassment, safety and hazards; compensation and exploitation; being entitled; discriminating and fairness.",
    "工会和条件；产假和陪产假；骚扰、安全和危险；赔偿和剥削；有权享有；歧视和公平。",
  ),
  prerequisites: ["b1-words-workplace"],
  words: [
    word(
      "union unions",
      "an organization of workers that protects their rights; the joining of things",
      "工会；联盟",
      "She joined the teachers' {union}.|hazard harassment | The {union} asked for better pay.|hazard compensation | {Unions} protect workers' rights.|Hazards Harassments",
      "onion unit",
    ),
    word(
      "condition conditions",
      "the state that something is in; (conditions) the situation in which people work or live",
      "状况；条件",
      "Working {conditions} in the factory were terrible.|fairness paternity | The car is in good {condition}.|safety fairness | You can go out on one {condition}: be home by ten.|hazard compensation",
      "conditional addition",
    ),
    word(
      "maternity",
      "about having a baby, for a mother",
      "产妇的；孕产期",
      "She is on {maternity} leave for six months.|harassment compensation | The company offers good {maternity} pay.|hazard fairness | The hospital's {maternity} ward is on the second floor.|paternity hazard",
      "maturity material",
      "paternity",
    ),
    word(
      "paternity",
      "being a father",
      "父亲身份；陪产（假）",
      "Fathers can take two weeks' {paternity} leave.|harassment hazard | More men are taking {paternity} leave.|hazard harassment | The new law gives fathers longer {paternity} leave.|hazard safety",
      "patience patronage",
      "maternity",
    ),
    word(
      "harassment",
      "behavior that annoys, frightens or upsets someone again and again",
      "骚扰",
      "Sexual {harassment} at work is illegal.|fairness compensation | She reported the {harassment} to her manager.|fairness safety | He suffered years of {harassment} from his boss.|fairness compensation",
      "embarrassment harness",
    ),
    word(
      "safety",
      "the state of being safe from danger",
      "安全",
      "Wear a helmet for your {safety}.|hazard harassment | Fire {safety} rules must be followed.|harassment fairness | The workers were moved to {safety}.|hazard harassment",
      "safely safe",
    ),
    word(
      "hazard hazards",
      "something that may be dangerous",
      "危险；危害",
      "Wet floors are a {hazard} in the kitchen.|safety fairness | The smoke is a health {hazard}.|safety union | Workers must be told about any {hazards}.|unions fairness",
      "haphazard harbor",
    ),
    word(
      "compensation",
      "money paid to someone for a loss, an injury or damage",
      "赔偿；补偿",
      "The workers received {compensation} for their injuries.|harassment hazard | She asked for {compensation} after the accident.|harassment hazard | The airline paid {compensation} for the delay.|harassment union",
      "competition composition",
    ),
    word(
      "exploitation",
      "unfair treatment of people to get work or profit from them",
      "剥削",
      "The report found the {exploitation} of children in factories.|fairness safety | {Exploitation} of workers is common where there are no unions.|Fairness Safety | The film is about the {exploitation} of the poor.|fairness safety",
      "exploration explanation",
    ),
    word(
      "entitled",
      "having the right to have or do something",
      "有权（享有）的",
      "All workers are {entitled} to four weeks' holiday.|hazard union | You are {entitled} to a refund.|paternity hazard | She feels {entitled} to a bigger office.|hazard union",
      "titled intended",
    ),
    word(
      "discriminate discriminates discriminated discriminating",
      "to treat a person or a group worse than others because of who they are",
      "歧视",
      "It is illegal to {discriminate} against women.|entitle compensate | The company was accused of {discriminating} against older workers.|compensating entitling | Employers must not {discriminate} on the basis of race.|compensate entitle",
      "disseminate incriminate",
    ),
    word(
      "fairness",
      "the quality of treating people equally and in a right way",
      "公平",
      "Workers want {fairness} in how they are paid.|hazard harassment | {Fairness} means treating everyone the same.|Harassment Hazard | People questioned the {fairness} of the test.|hazard harassment",
      "firmness fairway",
    ),
  ],
});

const production = vocabularyTopic({
  id: "b2-words-production",
  title: t("Production and Trade", "生产和贸易"),
  summary: t(
    "Manufacturing and manufacturers; producing, production and output; consuming and consumption; suppliers and distribution; retail and wholesale.",
    "制造和制造商；生产、产量和产出；消费；供应商和分销；零售和批发。",
  ),
  prerequisites: ["b1-words-business"],
  words: [
    word(
      "manufacture manufactures manufactured manufacturing",
      "to make goods in large numbers, using machines",
      "（大量）制造；生产",
      "The company {manufactures} car parts.|distribution production | Most of our phones are {manufactured} in Asia.|supplier output | The factory stopped {manufacturing} toys last year.|production consumption",
      "manicure manuscript",
      "produce",
    ),
    word(
      "manufacturer manufacturers",
      "a company that makes goods in large numbers",
      "制造商；厂商",
      "The {manufacturer} has recalled 10,000 cars.|consumption retail | She works for a toy {manufacturer}.|consumption output | Contact the {manufacturer} if the phone breaks.|consumption output",
      "manufacture manager",
    ),
    word(
      "produce produces produced producing",
      "to make or grow something",
      "生产；产生",
      "The farm {produces} milk and cheese.|consumption production | This region {produces} most of the country's rice.|consumption distribution | Plants {produce} oxygen.|consumption retail",
      "product proceed",
      "manufacture",
    ),
    word(
      "production",
      "the process of making or growing things; a play or a film",
      "生产；产量；（戏剧等）作品",
      "{Production} of electric cars has doubled.|Supplier Wholesale | The factory stopped {production} for two weeks.|supplier retail | The school's {production} of the play was excellent.|consumption supplier",
      "productivity protection",
      "output",
    ),
    word(
      "output outputs",
      "the amount of something that a person, a machine or a country produces",
      "产量；产出",
      "The factory's {output} rose by 10 percent.|supplier wholesale | Farm {output} fell because of the drought.|supplier retail | Our {output} this month was 500 machines.|supplier retail",
      "outlet input",
      "production",
    ),
    word(
      "consumption",
      "the using of energy, food or goods; the amount used",
      "消耗；消费（量）",
      "Energy {consumption} rises in winter.|supplier wholesale | We must reduce our {consumption} of plastic.|supplier wholesale | The {consumption} of sugar has fallen.|supplier wholesale",
      "assumption consultation",
    ),
    word(
      "consume consumes consumed consuming",
      "to use energy, fuel or time; to eat or drink",
      "消耗；消费；吃喝",
      "This car {consumes} a lot of fuel.|distributes manufactures | Americans {consume} more meat than most people.|distribute manufacture | The fire {consumed} the whole building.|produced distributed",
      "assume costume",
    ),
    word(
      "supplier suppliers",
      "a company that provides goods to other businesses",
      "供应商",
      "We buy our paper from a local {supplier}.|consumption output | The {supplier} delivered the parts late.|consumption output | The shop changed {suppliers} to cut costs.|consumptions outputs",
      "supply supper",
    ),
    word(
      "distribute distributes distributed distributing",
      "to give things to many people; to send goods to shops",
      "分发；分销",
      "Volunteers {distributed} food to the refugees.|consumed manufactured | The company {distributes} its films around the world.|consumes manufactures | The teacher {distributed} the test papers.|consumed manufactured",
      "contribute disturb",
    ),
    word(
      "distribution",
      "the giving or sending of things to many people or places; the way something is shared",
      "分配；分销",
      "The {distribution} of wealth is very unequal.|supplier retail | The company handles the {distribution} of the magazine.|supplier output | Food {distribution} began after the flood.|supplier output",
      "contribution discrimination",
    ),
    word(
      "retail",
      "the selling of goods to the public in shops",
      "零售",
      "She works in {retail}, in a clothes shop.|output consumption | The {retail} price is \\$50.|output consumption | Online sales hurt {retail} stores.|output consumption",
      "retain detail",
    ),
    word(
      "wholesale",
      "the selling of goods in large amounts to shops, at low prices",
      "批发",
      "We buy rice at {wholesale} prices.|output consumption | The {wholesale} market opens at four in the morning.|output consumption | The farm sells its fruit {wholesale} to supermarkets.|output consumption",
      "wholesome wholly",
    ),
  ],
});

const skills = vocabularyTopic({
  id: "b2-words-skills",
  title: t("Skills", "技能"),
  summary: t(
    "Expertise and competence; skilled and unskilled work; versatile, innovative and resourceful people; diligent, adaptable, analytical, persuasive and decisive.",
    "专业知识和能力；熟练和非熟练工作；多才多艺、富有创新和足智多谋的人；勤奋、适应力强、善于分析、有说服力和果断。",
  ),
  prerequisites: ["b1-words-work-qualities"],
  words: [
    word(
      "expertise",
      "special knowledge or skill",
      "专业知识；专长",
      "We need someone with {expertise} in marketing.|skilled versatile | Her {expertise} helped us solve the problem.|skilled innovative | He doesn't have the technical {expertise} for this job.|skilled decisive",
      "expert expense",
      "competence",
    ),
    word(
      "competence",
      "the ability to do something well",
      "能力；胜任",
      "Nobody doubts her {competence} as a manager.|skilled versatile | The test checks your {competence} in English.|skilled analytical | Lack of {competence} cost him his job.|skilled diligent",
      "competition component",
      "expertise",
    ),
    word(
      "skilled",
      "having the training and ability to do a job well",
      "熟练的；有技能的",
      "{Skilled} workers are in great demand.|Expertise Competence | She is a {skilled} surgeon.|expertise competence | Making violins is {skilled} work.|expertise competence",
      "scaled spilled",
    ),
    word(
      "unskilled",
      "not having or not needing special training",
      "非技术的；无技能的",
      "{Unskilled} jobs are often badly paid.|Expertise Competence | Machines are replacing {unskilled} workers.|expertise competence | He did {unskilled} work in a factory.|expertise competence",
      "unfilled untitled",
    ),
    word(
      "versatile",
      "able to do many different things, or to be used in many ways",
      "多才多艺的；多用途的",
      "She's a {versatile} actor who can play any role.|expertise competence | Rice is a {versatile} food: you can cook it in many ways.|diligent resourceful | A {versatile} tool can do many jobs.|diligent decisive",
      "volatile versus",
    ),
    word(
      "innovative",
      "using new methods or ideas",
      "创新的",
      "The company is known for its {innovative} products.|unskilled diligent | We need {innovative} ideas to solve this problem.|diligent unskilled | Her teaching methods are very {innovative}: no other school uses them.|unskilled expertise",
      "invasive imitative",
    ),
    word(
      "resourceful",
      "good at finding ways to deal with problems",
      "足智多谋的；机敏的",
      "Stuck on the island, he had to be {resourceful} to survive.|unskilled expertise | A {resourceful} student finds answers even without a teacher.|unskilled expertise | She is {resourceful}: she can fix almost anything with what she has.|unskilled expertise",
      "resource useful",
    ),
    word(
      "diligent",
      "working hard and carefully",
      "勤奋的；认真的",
      "She is a {diligent} student who never misses a class.|unskilled expertise | After months of {diligent} work, they finished the report.|expertise competence | He is {diligent} and always checks his work twice.|expertise competence",
      "delicate indulgent",
    ),
    word(
      "adaptable",
      "able to change to suit new situations",
      "适应力强的",
      "Good employees are {adaptable} and can learn new tasks quickly.|expertise competence | Rats are very {adaptable} animals.|persuasive expertise | Children are more {adaptable} than adults when they move abroad.|persuasive expertise",
      "adoptable adaptation",
    ),
    word(
      "analytical",
      "good at studying things in detail to understand them",
      "善于分析的",
      "This job needs strong {analytical} skills.|diligent expertise | She has an {analytical} mind and loves solving puzzles.|expertise unskilled | Science teaches {analytical} thinking.|expertise competence",
      "analogical anatomical",
    ),
    word(
      "persuasive",
      "good at making people believe or do something",
      "有说服力的",
      "She made a {persuasive} argument for the plan.|unskilled diligent | Advertisements are designed to be {persuasive}.|unskilled expertise | He was so {persuasive} that we all agreed.|unskilled expertise",
      "pervasive perceptive",
    ),
    word(
      "decisive",
      "able to make decisions quickly; having a strong effect on how something ends",
      "果断的；决定性的",
      "A good leader must be {decisive} in a crisis.|unskilled expertise | The goal in the last minute was {decisive}.|unskilled competence | She took {decisive} action to save the company.|unskilled expertise",
      "divisive decided",
    ),
  ],
});

const success = vocabularyTopic({
  id: "b2-words-success",
  title: t("Success and Failure", "成功与失败"),
  summary: t(
    "Achieving and achievements; accomplishing and accomplishments; setbacks and obstacles; overcoming and persevering; perseverance and triumph; thriving and collapsing.",
    "实现和成就；完成和成就；挫折和障碍；克服和坚持不懈；毅力和胜利；兴旺和倒塌。",
  ),
  prerequisites: ["b1-words-work-qualities"],
  words: [
    word(
      "achieve achieves achieved achieving",
      "to succeed in doing something after working hard",
      "实现；达到",
      "She {achieved} her dream of becoming a doctor.|collapsed persevered | We {achieved} all our goals this year.|thrived collapsed | You can {achieve} anything if you work hard.|collapse thrive",
      "archive relieve",
      "accomplish",
    ),
    word(
      "achievement achievements",
      "something good that you have done through hard work",
      "成就",
      "Winning the prize was a great {achievement}.|obstacle collapse | The moon landing was one of the greatest {achievements} in history.|perseverance obstacles | Her {achievements} at school were impressive.|obstacles perseverance",
      "agreement attachment",
      "accomplishment triumph",
    ),
    word(
      "accomplish accomplishes accomplished accomplishing",
      "to succeed in doing something",
      "完成；实现",
      "We {accomplished} a lot in one day.|collapsed thrived | It took years to {accomplish} the task.|thrive persevere | What do you hope to {accomplish} this year?|thrive collapse",
      "accompany abolish",
      "achieve",
    ),
    word(
      "accomplishment accomplishments",
      "something that you have succeeded in doing, especially something difficult",
      "成就；成绩",
      "Learning Chinese is a real {accomplishment}.|setback obstacle | Finishing the marathon was her proudest {accomplishment}.|setback obstacle | List your {accomplishments} in your CV.|setbacks obstacles",
      "accompaniment accomplice",
      "achievement triumph",
    ),
    word(
      "setback setbacks",
      "a problem that stops progress or makes things worse",
      "挫折",
      "The injury was a {setback} for her career.|triumph achievement | Despite some {setbacks}, the project was a success.|achievements triumphs | Losing the contract was a serious {setback}.|triumph perseverance",
      "setup feedback",
      "obstacle",
    ),
    word(
      "obstacle obstacles",
      "something that blocks your way or makes progress difficult",
      "障碍",
      "Lack of money is the biggest {obstacle} to success.|triumph achievement | The horse jumped over the {obstacle}.|triumph setback | There are many {obstacles} in the way of peace.|triumphs achievements",
      "obstruct optical",
      "setback",
    ),
    word(
      "overcome overcomes overcame overcoming",
      "to succeed in dealing with a problem or a difficulty",
      "克服；战胜",
      "She {overcame} her fear of public speaking.|persevered thrived | Together we can {overcome} any problem.|persevere thrive | He has {overcome} many difficulties in his life.|persevered thrived",
      "overcoat override",
    ),
    word(
      "persevere perseveres persevered persevering",
      "to keep trying to do something difficult",
      "坚持不懈",
      "If you {persevere}, you will improve.|achieve accomplish | She {persevered} with her studies despite her illness.|achieved accomplished | It's hard, but you must {persevere}.|accomplish overcome",
      "preserve persecute",
    ),
    word(
      "perseverance",
      "the quality of continuing to try when something is difficult",
      "毅力；坚持不懈",
      "Learning a language takes {perseverance}.|setback obstacle | Her {perseverance} finally paid off.|setback obstacle | With {perseverance}, he became a champion.|setback obstacle",
      "preservation severance",
    ),
    word(
      "triumph triumphs",
      "a great success or victory; the feeling of joy it brings",
      "巨大成功；胜利",
      "The concert was a {triumph}.|perseverance obstacle | The team returned home in {triumph}.|setback obstacle | The film tells of the {triumph} of good over evil.|setback obstacle",
      "trumpet trump",
      "achievement accomplishment",
    ),
    word(
      "thrive thrives thrived thriving",
      "to grow or develop very well; to be successful",
      "茁壮成长；兴旺",
      "Tomatoes {thrive} in hot weather.|achieve accomplish | The business is {thriving} after a difficult start.|achieving accomplishing | Some children {thrive} on challenges.|achieve accomplish",
      "strive drive",
    ),
    word(
      "collapse collapses collapsed collapsing",
      "to fall down suddenly; to fail suddenly and completely",
      "倒塌；崩溃；昏倒",
      "The bridge {collapsed} in the earthquake.|thrived persevered | The company {collapsed} after losing its biggest customer.|achieved accomplished | He {collapsed} on the stage and was taken to hospital.|thrived achieved",
      "relapse elapse",
    ),
  ],
});

const sequence = vocabularyTopic({
  id: "b2-words-linking-2",
  title: t("Words of Time and Sequence", "表示时间和顺序的词"),
  summary: t(
    "Regardless and accordingly; previously, initially, subsequently, eventually and ultimately; currently and seldom; presumably, apparently, evidently and undoubtedly.",
    "不管和相应地；以前、起初、随后、最终和归根结底；目前和很少；大概、显然、明显和无疑。",
  ),
  prerequisites: ["b2-words-linking-1"],
  words: [
    word(
      "regardless",
      "without being affected by something (regardless of)",
      "不管；不顾",
      "We'll go {regardless} of the weather.|accordingly previously | She kept working, {regardless} of the danger.|accordingly initially | Everyone is welcome, {regardless} of age.|accordingly currently",
      "regarding careless",
    ),
    word(
      "accordingly",
      "in a way that suits the situation; as a result",
      "相应地；因此",
      "The rules have changed, and you must act {accordingly}.|regardless previously | It's a formal dinner, so dress {accordingly}.|regardless currently | Prices rose, and sales fell {accordingly}.|regardless presumably",
      "according cordially",
    ),
    word(
      "subsequently",
      "after something else happened; later",
      "随后；后来",
      "He was arrested in May and {subsequently} sent to prison in June.|previously currently | The book came out in 1990 and was {subsequently} made into a film.|previously currently | The first plan failed; the team {subsequently} tried a new approach.|previously regardless",
      "consequently subsequent",
    ),
    word(
      "previously",
      "before now, or before a time in the past",
      "以前；先前",
      "She {previously} worked as a teacher.|regardless currently | The house was {previously} owned by a famous writer.|regardless currently | As I {previously} said, the meeting is at ten.|subsequently regardless",
      "previous obviously",
    ),
    word(
      "initially",
      "at the beginning",
      "起初；最初",
      "{Initially}, I didn't like the city, but now I love it.|Currently Regardless | The project was {initially} planned for two years.|regardless currently | Prices were {initially} low but soon rose.|regardless ultimately",
      "initiative officially",
    ),
    word(
      "ultimately",
      "in the end; at the most basic level",
      "最终；归根结底",
      "{Ultimately}, it's your decision.|Previously Regardless | The plan {ultimately} failed.|regardless currently | We all {ultimately} want the same thing.|previously regardless",
      "ultimate intimately",
      "eventually",
    ),
    word(
      "eventually",
      "in the end, after a long time or a lot of problems",
      "最后；终于",
      "After hours of waiting, the bus {eventually} came.|previously currently | She {eventually} found a job.|regardless currently | You'll {eventually} get used to it.|previously regardless",
      "eventful even",
      "ultimately",
    ),
    word(
      "currently",
      "at the present time",
      "目前；现在",
      "She is {currently} working in Paris.|previously initially | The museum is {currently} closed for repairs.|previously subsequently | {Currently}, there are 30 students in the class.|Previously Subsequently",
      "current correctly",
    ),
    word(
      "presumably",
      "used to say that you think something is probably true",
      "大概；想必",
      "You're {presumably} tired after the long flight.|regardless accordingly | Nobody is here, so the meeting is {presumably} cancelled.|regardless subsequently | {Presumably}, she missed the train.|Regardless Accordingly",
      "presumptuous presently",
      "apparently evidently",
    ),
    word(
      "apparently",
      "used to say that you have heard something or that it seems true",
      "据说；看来",
      "{Apparently}, the shop is closing next month.|Regardless Accordingly | He {apparently} forgot about the meeting.|regardless accordingly | The fire was {apparently} started by a cigarette.|regardless accordingly",
      "apparent appropriately",
      "evidently presumably",
    ),
    word(
      "evidently",
      "in a way that is clear to see",
      "显然；明显地",
      "She was {evidently} upset by the news.|regardless accordingly | {Evidently}, the plan hasn't worked.|Regardless Accordingly | The house had {evidently} been empty for years.|regardless subsequently",
      "evident evenly",
      "apparently presumably",
    ),
    word(
      "undoubtedly",
      "certainly; without doubt",
      "无疑；肯定",
      "She is {undoubtedly} the best player on the team.|regardless accordingly | This is {undoubtedly} a difficult time.|regardless subsequently | {Undoubtedly}, the internet has changed our lives.|Regardless Accordingly",
      "doubtfully undoubted",
    ),
    word(
      "seldom",
      "not often; rarely",
      "很少；不常",
      "We {seldom} see snow in this part of the country.|accordingly regardless | He {seldom} speaks at a meeting, but when he does, people listen.|regardless accordingly | {Seldom} have I seen such a beautiful view.|regardless accordingly",
      "selfish soldier",
    ),
  ],
});

const quantity = vocabularyTopic({
  id: "b2-words-quantity",
  title: t("Describing Quantity", "描述数量"),
  summary: t(
    "Abundant and scarce; sufficient, insufficient and adequate; excessive and substantial; minimal and modest; several, numerous, countless and enormous.",
    "丰富的和稀缺的；足够的、不足的和充分的；过度的和大量的；极少的和适度的；几个、众多的、无数的和巨大的。",
  ),
  prerequisites: ["b1-words-numbers-and-amounts"],
  words: [
    word(
      "abundant",
      "existing in large amounts; more than enough",
      "丰富的；充裕的",
      "Fish are so {abundant} here that even children catch them easily.|scarce minimal | The region has {abundant} rain, so the land is green.|scarce insufficient | Food was {abundant}, and nobody went hungry.|scarce insufficient",
      "abandoned redundant",
    ),
    word(
      "scarce",
      "not available in large amounts; hard to find",
      "稀缺的；不足的",
      "Water is {scarce} in the desert.|abundant numerous | Jobs were {scarce}, so many people left the town.|abundant excessive | Fresh food became {scarce} during the war.|abundant excessive",
      "scared scarf",
    ),
    word(
      "sufficient",
      "enough for a purpose",
      "足够的；充分的",
      "We don't have {sufficient} money to buy a car.|numerous countless | Is two hours {sufficient} time to finish the test?|numerous countless | The evidence was not {sufficient} to prove he was guilty.|numerous excessive",
      "efficient suffering",
      "adequate",
    ),
    word(
      "insufficient",
      "not enough for a purpose",
      "不足的；不够的",
      "The police had {insufficient} evidence to charge him.|numerous countless | The food aid was {insufficient} for so many refugees.|abundant excessive | His pay was {insufficient} to live on.|abundant excessive",
      "inefficient indifferent",
    ),
    word(
      "adequate",
      "enough, or good enough, for a purpose",
      "足够的；适当的",
      "The hotel was {adequate}, but not luxurious.|numerous countless | Make sure you get {adequate} sleep.|numerous countless | The pay is {adequate} for a student.|numerous countless",
      "accurate adjacent",
      "sufficient",
    ),
    word(
      "excessive",
      "more than is necessary or reasonable",
      "过度的；过多的",
      "{Excessive} drinking damages the liver.|Scarce Insufficient | The price was {excessive}, so I didn't buy it.|scarce modest | The report criticized the {excessive} use of force by police.|scarce modest",
      "exclusive expensive",
    ),
    word(
      "substantial",
      "large in amount or importance",
      "大量的；重大的",
      "She earns a {substantial} salary.|scarce numerous | There has been a {substantial} increase in prices.|scarce countless | The storm caused {substantial} damage.|countless numerous",
      "substitute substance",
      "enormous",
    ),
    word(
      "minimal",
      "very small in amount; as small as possible",
      "极少的；最低限度的",
      "The damage was {minimal}: just a few broken windows.|enormous substantial | The job needs {minimal} training.|numerous countless | The risk is {minimal} if you wear a helmet.|numerous countless",
      "minimum criminal",
    ),
    word(
      "numerous",
      "many",
      "众多的；许多的",
      "The singer has won {numerous} awards.|scarce minimal | We have met on {numerous} occasions.|adequate scarce | {Numerous} studies show that exercise helps.|Scarce Minimal",
      "humorous nervous",
      "countless",
    ),
    word(
      "countless",
      "too many to be counted",
      "无数的",
      "I've told you {countless} times!|scarce minimal | {Countless} people visit the temple every year.|Scarce Minimal | The war caused {countless} deaths.|scarce adequate",
      "careless counted",
      "numerous",
    ),
    word(
      "enormous",
      "very large",
      "巨大的",
      "They live in an {enormous} house.|scarce numerous | An {enormous} crowd waited outside.|scarce numerous | The project was an {enormous} success.|scarce numerous",
      "anonymous normal",
      "substantial",
    ),
    word(
      "modest",
      "not large in size or amount; not talking much about your own success",
      "适度的；谦虚的",
      "They live in a {modest} flat near the station.|numerous countless | Prices rose by a {modest} 2 percent.|numerous countless | He is very {modest} about his success.|numerous excessive",
      "modern moist",
    ),
    word(
      "several",
      "more than two but not very many",
      "几个；数个",
      "I have called her {several} times, but she never answers.|scarce minimal | {Several} people were hurt in the accident, but nobody died.|Scarce Insufficient | We waited for {several} hours before the doctor came.|abundant adequate",
      "severe sever",
    ),
  ],
});

// The passive with modals and perfect forms.

const joinWords = (...parts: readonly string[]) => parts.filter((p) => p !== "").join(" ");
const lower = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

/** perfects are the subject of a present perfect passive, has or have, the base form and the past participle of its verb, and the rest. */
const perfects: readonly (readonly [string, string, string, string, string])[] = [
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
const modals: readonly (readonly [string, string, string, string, string])[] = [
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
  const rule = passiveRule(right, subject);
  const be = right.includes(" been ") ? "been" : "be";
  const first =
    position === 0
      ? t(
          `*${wrong}* is active: it says that *${subject}* did the action, and it has no *${be}*.`,
          `*${wrong}* 是主动形式，意思成了 *${subject}* 做了这件事，而且缺少 *${be}*。`,
        )
      : position === 2
        ? t(
            `*${wrong.split(" ").at(-1) ?? ""}* is the *-ing* form, which makes it active and continuous: it says that *${subject}* is doing the action.`,
            `*${wrong.split(" ").at(-1) ?? ""}* 是 *-ing* 形式，这就成了主动的进行时，意思是 *${subject}* 在做这件事。`,
          )
        : t(
            `*${wrong.split(" ").at(-1) ?? ""}* is the base form, which never follows *${be}* in the passive.`,
            `*${wrong.split(" ").at(-1) ?? ""}* 是动词原形，被动语态里 *${be}* 后面不能用原形。`,
          );
  return t(`${first.en} ${rule.en}.`, `${first["zh-CN"]}${rule["zh-CN"]}。`);
};

/** passiveWhy explains the passive in the gap of shown. */
const passiveWhy = (right: string, shown: string): Text => {
  const rule = passiveRule(right, subjectBefore(shown));
  return t(`${rule.en}: ${fill(shown, right)}`, `${rule["zh-CN"]}：${fill(shown, right)}`);
};

/** passiveRewriteWhy explains a passive written from an active sentence with they. */
const passiveRewriteWhy = (right: string): Text => {
  const match = /^(.+?) ((?:has|have) been \S+|\S+(?: not)? be \S+)/u.exec(right);
  const subject = lower(match?.[1] ?? "");
  const rule = passiveRule(match?.[2] ?? right, subject);
  return t(
    `*They* means people in general, so leave it out and begin with *${subject}*. ${rule.en}: ${right}`,
    `*They* 泛指人们，被动句中省略，以 *${subject}* 开头。${rule["zh-CN"]}：${right}`,
  );
};

const passiveForms: TopicDef = {
  id: "passive-with-modals-and-perfect-forms",
  title: t("The Passive with Modals and Perfect Forms", "情态动词和完成时的被动语态"),
  summary: t(
    "The factory has been closed. Jobs could be lost. The present perfect passive takes has or have been and the past participle; a modal passive takes the modal, be and the past participle.",
    "The factory has been closed. Jobs could be lost。现在完成时的被动语态用 has/have been 加过去分词；情态动词的被动语态用情态动词加 be 加过去分词。",
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
        "The passive puts the thing that something happens to first. With a **perfect** or a **modal**, keep the passive *be* and change only the word before it:\n\n- present perfect: *has / have **been** + past participle*: *The hospital **has been built**.*\n- modal: *can, could, may, might, must, should, will + **be** + past participle*: *Jobs **could be lost**.*\n\nTwo mistakes are common: leaving out *been* or *be* (*The report has published* means the report did the publishing), and using the base form after *be* (*must be sign*).",
        "被动语态把承受动作的事物放在前面。和**完成时**或**情态动词**连用时，被动的 *be* 保留，只改变它前面的词：\n\n- 现在完成时：*has / have **been** + 过去分词*：*The hospital **has been built**.*\n- 情态动词：*can、could、may、might、must、should、will + **be** + 过去分词*：*Jobs **could be lost**.*\n\n常见错误有两个：漏掉 *been* 或 *be*（*The report has published* 意思成了“报告发表了别的东西”），以及在 *be* 后面用动词原形（*must be sign*）。中文常不用“被”字（“报告已经发表了”），英语却必须用被动形式。",
      ),
      choiceGenerator(t("Choose the words for the gap.", "选出填入空白处的词。"), passiveChoice, passiveWhy, whyNotPassive),
    ),
    point(
      "rewrite",
      t("From active to passive", "主动句改为被动句"),
      t(
        "Rewrite the sentence in the passive, beginning with the thing that the action happens to. *They* means people in general, so leave it out:\n\n- *They have sold the house.* → *The house has been sold.*\n- *They should plant more trees.* → *More trees should be planted.*\n\nKeep the tense or the modal of the active sentence, and keep the rest of the sentence in the same order.",
        "把句子改成被动语态，以承受动作的事物开头。*They* 泛指人们，被动句中省略：\n\n- *They have sold the house.* → *The house has been sold.*\n- *They should plant more trees.* → *More trees should be planted.*\n\n保持原句的时态或情态动词，句子其余部分的顺序不变。",
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
const causatives: readonly (readonly [string, string, string, string, string, string, string])[] = [
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
  return t(`${rule.en}: ${fill(shown, right)}`, `${rule["zh-CN"]}：${fill(shown, right)}`);
};

/** whyNotCausative explains the participle before the thing, or a form that is not the participle. */
const whyNotCausative = (wrong: string, _right: string, shown: string, position: number): Text => {
  const rule = causativeRule(shown);
  const item = causativeOf(shown);
  const pp = item?.[5] ?? "";
  const last = wrong.split(" ").at(-1) ?? "";
  let first: Text;
  if (position === 0 && wrong.split(" ").length > 1 && wrong.includes(` ${pp} `))
    first = t(
      `*${wrong}* puts the participle before the thing, which says the subject did the job.`,
      `*${wrong}* 把过去分词放在事物前面，意思成了主语自己做的。`,
    );
  else if (wrong.startsWith("to ") || wrong.includes(" to "))
    first = t(`*to ${last}* would mean the thing is meant to do the action itself.`, `*to ${last}* 意思成了事物自己去做这个动作。`);
  else if (wrong.endsWith("ing"))
    first = t(`*${last}* would mean the thing is doing the action itself.`, `*${last}* 意思成了事物自己正在做这个动作。`);
  else first = t(`*${last}* is the base form, not the past participle.`, `*${last}* 是动词原形，不是过去分词。`);
  return t(`${first.en} ${rule.en}.`, `${first["zh-CN"]}${rule["zh-CN"]}。`);
};

const causative: TopicDef = {
  id: "causative-have-and-get",
  title: t("Have Something Done", "让别人做某事（have something done）"),
  summary: t(
    "We had the office painted. When someone else does a job for the subject, use have or get, the thing, and the past participle.",
    "We had the office painted。主语安排别人为自己做某事时，用 have 或 get 加事物再加过去分词。",
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
        "When you arrange for someone else to do a job for you, use **have + the thing + past participle**:\n\n- *We **had the office painted**.* (Painters did it; we paid them.)\n- *I **had my hair cut** yesterday.*\n\nThe order matters. *We **had painted** the office* is the past perfect: it means we did the painting ourselves. *Have* changes for the tense (*has*, *had*, *will have*, *is having*), but the participle stays the same.",
        "安排别人为你做某事时，用 **have + 事物 + 过去分词**：\n\n- *We **had the office painted**.*（是油漆工刷的，我们付钱。）\n- *I **had my hair cut** yesterday.*\n\n语序很重要。*We **had painted** the office* 是过去完成时，意思是我们自己刷的。中文说“我昨天剪了头发”，并不说明是谁剪的；英语要说 *I had my hair cut*，否则 *I cut my hair* 就是自己剪的。*have* 随时态变化（*has*、*had*、*will have*、*is having*），过去分词不变。",
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
        "In everyday English, *get* works in the same way as *have*: *We **got** the office **painted**.* *You should **get** your teeth **checked**.*\n\nAfter the thing comes the **past participle**, because the thing does not do the action: the teeth are checked. Not *get your teeth check* or *get your teeth to check*.",
        "在日常英语中，*get* 的用法和 *have* 一样：*We **got** the office **painted**.* *You should **get** your teeth **checked**.*\n\n事物后面用**过去分词**，因为事物是被处理的一方：牙齿是被检查的。不能说 *get your teeth check*，也不能说 *get your teeth to check*。",
      ),
      choiceGenerator(t("Choose the word for the gap.", "选出填入空白处的词。"), participleChoice, causativeWhy, whyNotCausative),
    ),
    point(
      "write",
      t("Writing have something done", "写 have something done 的句子"),
      t(
        "Write a sentence from the parts: the subject, the form of *have*, the thing, the verb and the rest. Put the thing before the verb and change the verb into its past participle: *We / had / the office / paint / last month* becomes *We had the office painted last month.* You may use *get* instead of *have*.",
        "根据各部分写句子：主语、*have* 的形式、事物、动词和其余部分。把事物放在动词前面，并把动词变成过去分词：*We / had / the office / paint / last month* 写成 *We had the office painted last month.* 也可以用 *get* 代替 *have*。",
      ),
      typedGenerator(
        "sentence-pattern",
        t("Write the sentence: someone else does the job for the subject.", "写出句子：别人为主语做这件事。"),
        causativeTyped,
        (right) => {
          const rule = causativeRule(right);
          return t(`${rule.en}: ${right}`, `${rule["zh-CN"]}：${right}`);
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
      "A report gives a reader, such as a manager or a committee, facts to help them decide something. It is organized so that it is easy to find information:\n\n1. **Introduction**: say what the report is about and who it is for: *The aim of this report is to... It is based on a survey of 40 staff.*\n2. **Findings**, in one or two sections with headings: give facts and figures, not feelings: *Thirty of the 40 staff were in favor... However, ten people had concerns.*\n3. **Recommendations**: say clearly what should be done, and make sure each recommendation follows from the findings: *It is recommended that... The company should...*\n\nUse **short headings**, a **neutral tone** and impersonal phrases (*It was found that..., Most people said...*). Write full forms (*do not*, not *don't*), and avoid words such as *awesome* or *terrible*. Unlike an essay, a report does not need to be interesting to read: it needs to be clear.",
      "报告为读者（例如经理或委员会）提供事实，帮助他们做决定。它的结构要让人容易找到信息：\n\n1. **引言（Introduction）**：说明报告的内容和对象：*The aim of this report is to... It is based on a survey of 40 staff.*\n2. **发现（Findings）**，分一两个带小标题的部分：写事实和数字，不写感受：*Thirty of the 40 staff were in favor... However, ten people had concerns.*\n3. **建议（Recommendations）**：清楚地说明应该做什么，每条建议都要来自前面的发现：*It is recommended that... The company should...*\n\n用**简短的小标题**、**中立的语气**和非人称的说法（*It was found that..., Most people said...*）。不用缩写（写 *do not*，不写 *don't*），也不用 *awesome*、*terrible* 这样带感情的词。报告和作文不同，不需要读起来有趣，但必须清楚。中文工作报告常先写背景和意义，英语报告则开门见山，直接说明目的。",
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
