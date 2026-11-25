// B1, unit 11: Money and Consumers. Personal finance, consumers, value, giving and sharing, and shopping online;
// gerunds and infinitives; writing a letter of complaint.

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator, type WritingItem } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { fill, judgedTopic } from "../a2/kit.ts";
import { everyTriple, interleave, vocabularyTopic, word } from "../words.ts";

const finance = vocabularyTopic({
  id: "b1-words-personal-finance",
  title: t("Personal Finance", "个人理财"),
  summary: t(
    "Wages, loans and debts; interest; depositing and withdrawing; affording; expenses, pensions and fees; the economy and financial.",
    "工资、贷款和债务；利息；存钱和取钱；负担得起；开支、养老金和费用；经济和财务的。",
  ),
  intro: t(
    "If your **wage** is low, you may need a **loan**, but then you pay **interest** and can get into **debt**; it's better to **deposit** a little money every month. These words help you talk about earning, saving and borrowing.",
    "如果 **wage**（工资）低，你可能需要 **loan**（贷款），但之后要付 **interest**（利息），还可能陷入 **debt**（债务）；最好每月 **deposit**（存入）一点钱。这些词帮你谈论挣钱、存钱和借钱。",
  ),
  prerequisites: ["a2-words-money"],
  words: [
    word(
      "wage wages",
      "the money you get every week or month for your work",
      "工资",
      "He earns a good {wage} as an electrician. | The workers asked for higher {wages} for each week of work.|pensions loans | The minimum {wage}, the lowest pay for an hour of work, went up this year.",
      "pension loan",
      "pension",
    ),
    word(
      "loan loans",
      "money that a bank or a person lends you and that you must pay back",
      "贷款；借款",
      "They took out a {loan} to buy a house. | She is still paying back her student {loan}. | The bank refused to give him a {loan} he would have to pay back.",
      "wage pension",
      "debt",
    ),
    word(
      "debt debts",
      "money that you owe to someone",
      "债务；欠款",
      "He is in {debt} because he spent too much on his credit card. | It took them ten years to pay off their {debts}.|wages pensions | Try not to get into {debt} by borrowing too much.",
      "wage pension",
      "loan",
    ),
    word(
      "interest interests",
      "extra money that you pay when you borrow money, or that a bank pays you when you save",
      "利息；兴趣",
      "The bank pays three percent {interest} on savings. | You have to pay five percent {interest} a year on the loan. | Her {interests} include music and painting.|fees wages",
      "fee wage",
    ),
    word(
      "deposit deposits deposited depositing",
      "to put money into a bank account; money you pay first, to keep something for you",
      "存入；押金；定金",
      "I {deposited} my wages into my bank account.|withdrew spent | You must pay a {deposit} before you move in, to keep the flat for you.|pension wage | She {deposits} a little money into her savings account every month.|withdraws spends",
      "withdraw spend",
    ),
    word(
      "withdraw withdraws withdrew withdrawn withdrawing",
      "to take money out of a bank account",
      "取（钱）；撤回",
      "I {withdrew} 200 dollars from the cash machine.|deposited saved | You can {withdraw} cash and take it out at any branch. | She has {withdrawn} all her savings from the bank to buy a car.|deposited saved",
      "deposit save",
    ),
    word(
      "afford affords afforded affording",
      "to have enough money to pay for something",
      "买得起；负担得起",
      "We don't have enough money, so we can't {afford} a new car this year. | Do you have enough money? Can you {afford} to go on holiday? | Few young people can {afford} to buy a flat in the city, because prices are so high.",
      "refuse forget",
    ),
    word(
      "expense expenses",
      "money that you spend on something",
      "开支；费用",
      "Food is our biggest {expense}: we spend most of our money on it. | The company pays my travel {expenses}.|pensions economies | Having a car is a big {expense}: petrol and repairs cost a lot.",
      "pension economy",
      "fee",
    ),
    word(
      "pension pensions",
      "money that old people get regularly after they stop working",
      "养老金；退休金",
      "My grandfather stopped working years ago and lives on his {pension}. | She's 70 and gets a small {pension} from the state. | Start saving for your {pension}, for when you stop working, while you are young.",
      "wage loan",
      "wage",
    ),
    word(
      "fee fees",
      "money you pay to a professional person or for a service",
      "费用；（服务）费",
      "The bank charges a {fee} for sending money abroad. | University {fees}, the money students pay to study, have gone up again.|wages debts | There is no entrance {fee} for children.",
      "wage debt",
      "expense",
    ),
    word(
      "economy economies",
      "the system by which a country makes and uses money, goods and services",
      "经济",
      "The country's {economy} is growing fast, with more jobs and businesses. | Tourism is important to the local {economy}. | Many countries' {economies} were hit by the crisis.|expenses pensions",
      "expense pension",
    ),
    word(
      "financial",
      "connected with money",
      "财务的；金融的",
      "The company is in {financial} trouble: it has no money. | She works as a {financial} adviser, helping people with their money. | London is a big {financial} center with many banks.",
      "medical physical",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Deposit* and *withdraw* are opposites: you *deposit* money when you put it into a bank, and you *withdraw* it when you take it out. Look for *into* or *from*.",
        "*deposit* 和 *withdraw* 意思相反：*deposit* 是把钱存进银行，*withdraw* 是把钱取出来。留意句中是 *into* 还是 *from*。",
      ),
      meaning: t(
        "*Wage* and *pension* are both money you receive, but a *wage* is pay for your work, and a *pension* is money you get after you stop working. Check whether the person in the meaning still works.",
        "*wage* 和 *pension* 都是你收到的钱，但 *wage* 是工作的报酬，*pension* 是不再工作以后领的钱。看清释义里的人是否还在工作。",
      ),
      spell: t(
        "*Withdraw* has irregular past forms: *withdrew*, *withdrawn*; *debt* has a silent b.",
        "*withdraw* 的过去式和过去分词不规则：*withdrew*、*withdrawn*；*debt* 里的 b 不发音。",
      ),
    },
    notes: `
      wage|pay as an electrician;higher pay for each week of work;the lowest pay for an hour of work|a wage is pay for your work; a pension is money after you stop working|wage 是工资；pension 是养老金|pension/pensions=a pension is money old people get after they stop working, not pay for work=pension 是老人退休后领的钱，不是工作报酬;loan/loans=a loan is money you borrow and pay back, not money you earn=loan 是借来要还的钱，不是挣的钱|earn a wage · the minimum wage|*wages* is often plural: weekly wages|常用复数 *wages*：weekly wages
      loan|money to buy a house;a student one still being paid back;bank money he would pay back|a loan is money lent to you; a wage is money you earn|loan 是贷款；wage 是工资|wage=a wage is money you earn for work, not money you borrow=wage 是工作挣的钱，不是借的钱;pension=a pension is money for old people, not money a bank lends you=pension 是给老人的钱，不是银行借给你的钱|take out a loan · pay back a loan|*loan* sounds like *lone*|*loan* 和 *lone* 读音相同
      debt|spending too much on a credit card;ten years to pay off;borrowing too much|a debt is money you owe; a wage is money you earn|debt 是欠款；wage 是工资|wage/wages=a wage is money you earn, not money you owe=wage 是挣的钱，不是欠的钱;pension/pensions=a pension is money you get when old, not money you owe=pension 是老了领的钱，不是欠的钱|in debt · pay off a debt|the b is silent: *det*|b 不发音：*det*
      interest|three percent on savings;five percent a year on a loan;music and painting|interest is extra money on savings or loans; a fee is a price for a service|interest 是利息、兴趣；fee 是费用|fee/fees=a fee is a fixed price for a service, not extra money that grows as a percent, and not a hobby=fee 是服务的固定费用，不是按百分比增长的钱，也不是爱好;wage/wages=a wage is pay for work, not extra money on savings or loans, and not a hobby=wage 是工作报酬，不是存款贷款的利息，也不是爱好|pay interest · an interest rate|*interest* also means what you like: her interests|*interest* 也指兴趣爱好：her interests
      deposit|wages put into a bank account;money paid to keep a flat;money put into savings every month|to deposit is to put money in; to withdraw is to take it out|deposit 是存入、押金；withdraw 是取出|withdraw/withdrew/withdraws=to withdraw is to take money out, not put it in=withdraw 是取钱，不是存钱;spend/spent/spends=to spend is to pay for things, not to put money into a bank=spend 是花钱，不是存进银行;pension=a pension is money for old people, not money paid to keep a flat=pension 是养老金，不是保留房子付的钱;wage=a wage is money you earn, not money paid to keep a flat=wage 是挣的工资，不是保留房子付的钱|pay a deposit · deposit money|*deposit* is also money you get back when you return something|*deposit* 也指退还物品时能拿回的押金
      withdraw|200 dollars from a cash machine;cash taken out at any branch;savings taken out to buy a car|to withdraw is to take money out; to deposit is to put it in|withdraw 是取钱；deposit 是存钱|deposit/deposited=to deposit is to put money in, not take it out=deposit 是存钱，不是取钱;save/saved=to save is to keep money, not take it out to spend=save 是存着不花，不是取出来花|withdraw money · withdraw cash|past *withdrew*, *withdrawn*|过去式 *withdrew*，过去分词 *withdrawn*
      afford|not enough money for a new car;enough money for a holiday;high flat prices|to afford is to have enough money; to refuse is to say no|afford 是买得起；refuse 是拒绝|refuse=to refuse is to say no, which has nothing to do with having enough money=refuse 是拒绝，和钱够不够无关;forget=to forget is not to remember, not to have enough money=forget 是忘记，不是钱够|can't afford · afford to buy|usually with *can* or *can't*|常和 *can* 或 *can't* 连用
      expense|food that takes most of our money;travel costs paid by a company;petrol and repairs|an expense is money you spend; a pension is money you get|expense 是开支；pension 是养老金|pension/pensions=a pension is money you get when old, not money you spend=pension 是老了领的钱，不是花出去的钱;economy/economies=the economy is a country's whole money system, not money one family spends=economy 是国家的经济体系，不是一家人的开支|a big expense · travel expenses|adjective *expensive*|形容词 *expensive*
      pension|money after stopping work years ago;state money at 70;saving for when you stop working|a pension is money after you stop working; a wage is pay for work|pension 是养老金；wage 是工资|wage=a wage is pay for working, not money after you stop working=wage 是工作的报酬，不是退休后的钱;loan=a loan must be paid back, not money old people get=loan 要还，不是老人领的钱|live on a pension · a state pension|a person with a pension is a *pensioner*|领养老金的人叫 *pensioner*
      fee|a bank charge for sending money;what students pay to study;entrance for children|a fee is money you pay for a service; a wage is money you earn|fee 是费用；wage 是工资|wage/wages=a wage is money you earn, not money you pay for a service=wage 是挣的钱，不是为服务付的钱;debt/debts=a debt is money you owe after borrowing, not a price for a service=debt 是借钱后欠的钱，不是服务的价格|an entrance fee · school fees|*fee* rhymes with *free*, but has no r|*fee* 和 *free* 押韵，但没有 r
      economy|a country growing with jobs and businesses;tourism in the local area;countries hit by a crisis|the economy is a country's system of money and jobs; an expense is money one person spends|economy 是经济；expense 是开支|expense/expenses=an expense is money one person spends, not a country's whole system of money and jobs=expense 是个人的花销，不是国家的经济体系;pension/pensions=a pension is money for one old person, not a country's system of money and jobs=pension 是一个老人的钱，不是国家的经济体系|the economy is growing · the local economy|adjective *economic*|形容词 *economic*
      financial|a company with no money;help with people's money;a center with many banks|financial is about money; medical is about doctors|financial 是财务的；medical 是医疗的|medical=medical is about doctors and illness, not money=medical 和医生、疾病有关，不是钱;physical=physical is about the body, not money=physical 和身体有关，不是钱|financial trouble · a financial adviser|from *finance*|来自 *finance*
    `,
  },
});

const consumers = vocabularyTopic({
  id: "b1-words-consumers",
  title: t("Consumers", "消费者"),
  summary: t(
    "Consumers and purchases; refunds, guarantees and warranties; complaints and faulty goods; quality; advertising and labels; offers.",
    "消费者和购买；退款、保证和保修；投诉和有缺陷的商品；质量；广告和标签；优惠。",
  ),
  intro: t(
    "A **consumer** who buys **faulty** goods can make a **complaint** and ask for a **refund**, or use the **warranty** to get them repaired. These words help you know your rights when you shop.",
    "买到 **faulty**（有缺陷的）商品的 **consumer**（消费者）可以提出 **complaint**（投诉）、要求 **refund**（退款），或者凭 **warranty**（保修）免费修理。这些词帮你在购物时了解自己的权利。",
  ),
  prerequisites: ["a2-words-shops"],
  words: [
    word(
      "consumer consumers",
      "a person who buys things or uses services",
      "消费者",
      "{Consumers}, the people who buy things, are spending less this year.|Producers Sellers | The law protects {consumers} from faulty goods.|producers sellers | More than a billion {consumers} in China buy things online.|producers sellers",
      "producer seller",
    ),
    word(
      "purchase purchases purchased purchasing",
      "to buy something; something that you buy",
      "购买；购买的东西",
      "You can {purchase} tickets online and pay by card. | She paid for her {purchase} at the checkout.|refund label | A house is the biggest {purchase} most people make.|refund label",
      "refund advertise",
    ),
    word(
      "refund refunds",
      "money that is given back to you when you return something",
      "退款",
      "The phone didn't work, so the shop gave me a {refund} of all my money. | You can get a full {refund} within thirty days. | The airline paid back our money with a {refund} for the canceled flight.",
      "receipt complaint",
    ),
    word(
      "guarantee guarantees",
      "a promise that something will be done or will happen; a promise to repair a product",
      "保证；保修单",
      "The watch has a two-year {guarantee}. | There's no {guarantee} that the weather will be good. | We {guarantee} that your order will arrive within 24 hours, or you get your money back.|complain doubt",
      "label receipt",
      "warranty",
    ),
    word(
      "warranty warranties",
      "a written promise to repair or replace a product if it breaks",
      "保修；保修单",
      "The laptop is still under {warranty}, so they will fix it for free. | The {warranty} lasts for one year: they will repair the TV free if it breaks. | Under the {warranty}, the company must replace the fridge if it stops working.",
      "label receipt",
      "guarantee",
    ),
    word(
      "complaint complaints",
      "a statement that something is wrong or not good enough",
      "投诉；抱怨",
      "The service was terrible, so I want to make a {complaint}. | The hotel received many {complaints} about the noise.|refunds guarantees | Write your {complaint} in a polite letter and say what went wrong.",
      "refund guarantee",
    ),
    word(
      "faulty",
      "not working properly",
      "有缺陷的；有故障的",
      "I took the {faulty} heater back to the shop because it didn't work. | The fire was caused by {faulty} wiring. | If the goods are {faulty}, you can get your money back.",
      "valuable available",
    ),
    word(
      "quality qualities",
      "how good or bad something is; a good part of someone's character",
      "质量；品质",
      "These shoes are cheap, but the {quality} is poor. | The fruit is expensive, but the {quality} is excellent. | Honesty is one of her best {qualities}.|labels prices",
      "label price",
    ),
    word(
      "advertise advertises advertised advertising",
      "to tell people about a product or a job in newspapers, on TV or online so that they will buy it or apply",
      "做广告；登广告",
      "The new phone is {advertised} on TV and on posters everywhere.|refunded delivered | They {advertised} the job online.|refunded delivered | Companies spend billions on TV {advertising}.|refunding delivering",
      "refund deliver",
    ),
    word(
      "label labels",
      "a piece of paper or cloth on a product that gives information about it",
      "标签",
      "Read the {label} to see what's in the food. | The {label} says the shirt should be washed in cold water. | Check the price {label} before you buy.",
      "receipt refund",
    ),
    word(
      "goods",
      "things that are made to be sold",
      "商品；货物",
      "The shop sells electrical {goods}. | {Goods} are carried across the country by train.|Refunds Complaints | We sell sports {goods} and clothes.",
      "refunds complaints",
    ),
    word(
      "offer offers offered offering",
      "to ask if someone would like something; a cheap price for a short time",
      "提供；主动提出；优惠",
      'The shop has a special {offer} this week: two pairs of shoes for the price of one.|warranty refund | She {offered} to help and asked, "Shall I carry your bags?"|refused forgot | They {offered} to give him the job, and he said yes.|refused forgot',
      "refuse forget",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "A *refund* is the money the shop gives back to you; a *receipt* is the paper that shows what you paid. Ask whether money comes back or a piece of paper proves the sale.",
        "*refund* 是商店退还给你的钱；*receipt* 是证明你付了多少钱的小票。想一想句子说的是钱退回来，还是一张纸证明买过。",
      ),
      meaning: t(
        "A *warranty* is a promise to repair or replace a product; a *label* is the paper or cloth on it that gives information. Check whether the meaning talks about a promise or about information.",
        "*warranty* 是修理或更换产品的承诺；*label* 是产品上提供信息的纸或布。看释义说的是承诺还是信息。",
      ),
      spell: t(
        "*Guarantee* has a silent u after the g and ends in double e: g-u-a-r-a-n-t-e-e.",
        "*guarantee* 的 g 后面有个不发音的 u，结尾是两个 e：g-u-a-r-a-n-t-e-e。",
      ),
    },
    notes: `
      consumer|the people who buy things;protected by law from faulty goods;a billion in China buying online|a consumer buys; a producer makes|consumer 是消费者；producer 是生产者|producer/producers/Producers=a producer makes goods, not a person who buys them=producer 是生产商品的人，不是买东西的人;seller/sellers/Sellers=a seller sells things, not a person who buys them=seller 是卖东西的人，不是买东西的人|consumer rights · protect consumers|verb *consume*: to use up|动词 *consume*：消耗
      purchase|tickets bought online by card;paid for at the checkout;the biggest one most people make|to purchase is to buy; to refund is to give money back|purchase 是购买；refund 是退款|refund=a refund is money given back, not something you buy and pay for=refund 是退回的钱，不是你买来付钱的东西;advertise=to advertise is to tell people about a product, not to buy and pay for it=advertise 是给产品做广告，不是买下付钱;label=a label gives information on a product, not something you buy and pay for=label 是产品上的信息，不是买来付钱的东西|make a purchase · purchase online|*purchase* is a formal word for *buy*|*purchase* 是 *buy* 的正式说法
      refund|all my money back for a broken phone;a full one within thirty days;money paid back for a canceled flight|a refund is money given back; a receipt shows what you paid|refund 是退款；receipt 是收据|receipt=a receipt is a paper that shows you paid, not money given back=receipt 是证明付款的纸，不是退回的钱;complaint=a complaint says something is wrong, not money given back=complaint 是说哪里不好，不是退回的钱|ask for a refund · a full refund|noun and verb: they refunded the money|既是名词也是动词：they refunded the money
      guarantee|two years on a watch;no promise of good weather;arrival in 24 hours or money back|a guarantee is a promise; a label gives information|guarantee 是保证；label 是标签|label=a label gives information on a product, not a promise=label 是产品上的信息，不是承诺;receipt=a receipt shows what you paid, not a promise=receipt 是付款凭证，不是承诺;complain=to complain is to say something is wrong, not to promise it will happen=complain 是抱怨，不是承诺;doubt=to doubt is to think something may not happen, not to promise it=doubt 是怀疑，不是保证|a two-year guarantee · guarantee delivery|silent u after g|g 后面的 u 不发音
      warranty|free repairs on a laptop;one year of free TV repair;a new fridge if it stops working|a warranty promises repair; a label gives information|warranty 是保修；label 是标签|label=a label gives information on a product, not a promise to repair it=label 是产品上的信息，不是修理的承诺;receipt=a receipt shows what you paid, not a promise to repair=receipt 是付款凭证，不是修理的承诺|under warranty · a one-year warranty|close to *guarantee*, used for products|和 *guarantee* 相近，多用于产品
      complaint|terrible service;noise in a hotel;a polite letter saying what went wrong|a complaint says something is wrong; a refund is money back|complaint 是投诉；refund 是退款|refund/refunds=a refund is money given back, not words saying something is wrong=refund 是退回的钱，不是说哪里不好的话;guarantee/guarantees=a guarantee is a promise, not words saying something is wrong=guarantee 是承诺，不是投诉|make a complaint · complaints about the noise|verb *complain*; *compliment* is the opposite|动词 *complain*；*compliment*（称赞）意思相反
      faulty|a heater that didn't work;wiring that caused a fire;goods you can get your money back for|faulty means not working properly; valuable means worth a lot|faulty 是有故障的；valuable 是贵重的|valuable=valuable means worth a lot, not broken=valuable 是贵重的，不是坏的;available=available means you can get it, not that it is broken=available 是可以得到的，不是坏的|faulty goods · a faulty machine|from *fault*|来自 *fault*
      quality|cheap shoes that are poor;expensive but excellent fruit;honesty as a good part of character|quality is how good something is; price is how much it costs|quality 是质量；price 是价格|label/labels=a label is paper with information, not how good something is=label 是带信息的纸，不是质量;price/prices=a price is how much something costs, not how good it is=price 是价格，不是质量|high quality · poor quality|*quantity* is how much, not how good|*quantity* 是数量，不是质量
      advertise|a phone on TV and posters;a job put online;billions spent by companies on TV|to advertise is to tell people about a product; to deliver is to bring it|advertise 是做广告；deliver 是送货|refund/refunded/refunding=to refund is to give money back, not to tell people about a product=refund 是退钱，不是做广告;deliver/delivered/delivering=to deliver is to bring things to a place, not to tell people about them=deliver 是送货，不是做广告|advertise a job · TV advertising|ends in *-ise*; the noun is *advertisement*|以 *-ise* 结尾；名词是 *advertisement*
      label|what's in the food;washing in cold water;the price before you buy|a label gives information on a product; a receipt shows what you paid|label 是标签；receipt 是收据|receipt=a receipt is a paper you get after paying, not information on a product=receipt 是付款后的小票，不是产品上的信息;refund=a refund is money given back, not information on a product=refund 是退款，不是产品上的信息|read the label · a price label|*label* ends in -el|*label* 以 -el 结尾
      goods|electrical things in a shop;things carried by train;sports things and clothes|goods are things made to sell; refunds are money given back|goods 是商品；refund 是退款|refunds/Refunds=refunds are money given back, not things made to sell=refund 是退回的钱，不是商品;complaints/Complaints=complaints say something is wrong, not things made to sell=complaint 是投诉，不是商品|electrical goods · sports goods|always plural|总是复数
      offer|two pairs of shoes for the price of one;help with the bags;a job he said yes to|to offer is to ask if someone would like something; to refuse is to say no|offer 是提供；refuse 是拒绝|refuse/refused=to refuse is to say no, not to ask if someone would like something=refuse 是拒绝，不是主动提出;forget/forgot=to forget is not to remember, not to ask if someone would like something=forget 是忘记，不是主动提出;warranty=a warranty is a promise to repair, not a cheap price for a short time=warranty 是保修，不是短期优惠;refund=a refund is money given back, not a cheap price for a short time=refund 是退款，不是短期优惠|a special offer · offer to help|*offer* has double f|*offer* 有两个 f
    `,
  },
});

const value = vocabularyTopic({
  id: "b1-words-value",
  title: t("Value", "价值"),
  summary: t(
    "Value, valuable and worth; luxuries; necessary and essential; affordable and reasonable; worthless and priceless; fortune and wealth.",
    "价值、贵重的和值得；奢侈品；必要的和必不可少的；买得起的和合理的；毫无价值的和无价的；财富。",
  ),
  intro: t(
    "Some things are **valuable** or even **priceless**, some are **worthless**, and some are a **luxury** you don't really need. These words help you talk about what things are worth.",
    "有些东西 **valuable**（贵重的），甚至 **priceless**（无价的），有些 **worthless**（毫无价值的），还有些是你并不真正需要的 **luxury**（奢侈品）。这些词帮你谈论东西值多少。",
  ),
  prerequisites: ["b1-words-personal-finance"],
  words: [
    word(
      "value values",
      "how much something is worth; the beliefs that are important to you",
      "价值；价值观",
      "The {value} of the house, the price you could sell it for, has doubled. | This meal is good {value} for money. | Honesty is one of our family {values}.|luxuries fortunes",
      "luxury wealth",
      "worth",
    ),
    word(
      "valuable",
      "worth a lot of money, or very useful",
      "贵重的；宝贵的",
      "Keep your {valuable} things in the hotel safe. | Thank you for your {valuable} advice. | The ring is very {valuable}, so keep it somewhere safe.",
      "worthless faulty",
      "priceless",
    ),
    word(
      "worth",
      "having a certain value; good enough to do",
      "值……钱；值得",
      "This tiny old coin is {worth} a lot of money to collectors. | The museum is {worth} a visit: you won't regret going. | Is the better phone {worth} the extra money you pay for it?",
      "like near",
      "value",
    ),
    word(
      "luxury luxuries",
      "something expensive that you enjoy but do not need",
      "奢侈品；奢华",
      "They stayed in a {luxury} hotel with gold taps and a private pool. | A car is a {luxury} for many families: nice to have, but they can live without it. | We can't afford {luxuries} like holidays abroad.|fortunes values",
      "fortune value",
    ),
    word(
      "necessary",
      "needed in order to do something",
      "必要的；必需的",
      "Do we have to book? Is it {necessary}, or can we just turn up? | Take only what is {necessary}: what you really need for the trip. | Don't buy things that aren't {necessary}: only buy what you need.",
      "valuable worthless",
      "essential",
    ),
    word(
      "essential",
      "completely necessary; very important",
      "必不可少的；极其重要的",
      "Water is {essential}: without it, nothing can live. | Warm clothes are {essential} in winter, so never go out without them. | It's {essential} to keep your password secret.",
      "worthless affordable",
      "necessary",
    ),
    word(
      "affordable",
      "cheap enough for most people to buy",
      "买得起的；价格合理的",
      "The city needs more {affordable} housing that ordinary workers can pay for. | They sell good clothes at {affordable} prices. | Phones are now cheap: they are {affordable} for almost everyone.",
      "worthless priceless",
      "reasonable",
    ),
    word(
      "reasonable",
      "fair and sensible; not too expensive",
      "合理的；公道的",
      "The food is good and the prices are {reasonable}. | That sounds like a {reasonable} idea: fair to everyone and easy to do. | Be {reasonable}! You can't finish all that work today.",
      "priceless worthless",
      "affordable",
    ),
    word(
      "worthless",
      "having no value",
      "毫无价值的",
      "The painting turned out to be a copy, so it was {worthless}. | After the new coins came in, the old money became {worthless}. | Without batteries, the toy is {worthless}.",
      "essential necessary",
      "priceless",
    ),
    word(
      "priceless",
      "so valuable that its value cannot be measured",
      "无价的；极其宝贵的",
      "The museum's {priceless} collection of old vases could never be bought with money. | Her friendship is {priceless} to me. | These family photos are {priceless}: I wouldn't sell them for any money.",
      "affordable reasonable",
      "valuable worthless",
    ),
    word(
      "fortune fortunes",
      "a very large amount of money; luck",
      "一大笔钱；运气",
      "He made a {fortune} selling phones. | That dress must have cost a {fortune}. | She had the good {fortune} to meet a great teacher.",
      "luxury value",
      "wealth",
    ),
    word(
      "wealth",
      "a large amount of money or valuable things",
      "财富",
      "The family's {wealth} came from oil. | Health is more important than {wealth}: being rich isn't everything. | The {wealth} of the country is not shared equally.",
      "poverty value",
      "fortune",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Worth* comes right before an amount or an -ing word: *worth* a lot, *worth* visiting. *Valuable* does not take an amount after it. Look at the words after the gap.",
        "*worth* 后面直接跟金额或 -ing 形式：*worth* a lot、*worth* visiting。*valuable* 后面不接金额。看空格后面的词。",
      ),
      meaning: t(
        "*Priceless* and *worthless* look alike but are opposites: *priceless* means worth so much that no money could buy it, *worthless* means worth nothing at all. Check whether the meaning says very much or nothing.",
        "*priceless* 和 *worthless* 样子相似，意思却相反：*priceless* 是贵重到多少钱都买不到，*worthless* 是一文不值。看释义说的是极多还是全无。",
      ),
      spell: t("*Necessary* has one c and a double s: n-e-c-e-s-s-a-r-y.", "*necessary* 有一个 c、两个 s：n-e-c-e-s-s-a-r-y。"),
    },
    notes: `
      value|the price a house could be sold for;good for money in a meal;honesty in a family|value is how much something is worth; wealth is all the money someone has|value 是价值；wealth 是财富|luxury/luxuries=a luxury is an expensive thing you don't need, not how much something is worth or a belief=luxury 是不必要的昂贵东西，不是价值或价值观;wealth=wealth is all the money a person has, not how much one thing is worth=wealth 是一个人拥有的全部钱财，不是一件东西值多少;fortunes=fortunes are large amounts of money, not beliefs=fortune 是一大笔钱，不是价值观|good value · family values|plural *values* means beliefs|复数 *values* 指价值观
      valuable|things for the hotel safe;advice you thank someone for;a ring to keep somewhere safe|valuable means worth a lot; worthless means worth nothing|valuable 是贵重的；worthless 是毫无价值的|worthless=worthless means worth nothing, not something to keep safe or thank someone for=worthless 是毫无价值，不值得保管或感谢;faulty=faulty means broken, not worth a lot=faulty 是有故障的，不是贵重的|valuable things · valuable advice|*valuable* drops the e of *value*|*valuable* 去掉了 *value* 的 e
      worth|a tiny coin collectors pay a lot for;a museum you won't regret;a better phone and the extra money|worth tells the value or that something is good enough; like means similar to|worth 是值得；like 是像|like=like means similar to, not having a value or being good enough to do=like 是像，不是值多少或值得;near=near means close to a place, not having a value=near 是在附近，不是值多少|worth a lot · worth visiting|*worth* is followed by an amount or an -ing word|*worth* 后接金额或 -ing 形式
      luxury|a hotel with gold taps;a car families can live without;holidays abroad we can't afford|a luxury is expensive and not needed; a fortune is a lot of money|luxury 是奢侈品；fortune 是一大笔钱|fortune/fortunes=a fortune is a large amount of money, not an expensive thing you enjoy but don't need=fortune 是一大笔钱，不是享受而非必需的昂贵东西;value/values=value is how much something is worth, not an expensive thing you don't need=value 是价值，不是不必要的昂贵东西|a luxury hotel · a luxury for many|adjective *luxurious*|形容词 *luxurious*
      necessary|booking or just turning up;what you really need for a trip;only buying what you need|necessary means needed; valuable means worth a lot|necessary 是必要的；valuable 是贵重的|valuable=valuable means worth a lot, not needed=valuable 是贵重的，不是必需的;worthless=worthless means worth nothing, not needed=worthless 是毫无价值，不是必需的|is it necessary · if necessary|opposite *unnecessary*|反义词 *unnecessary*
      essential|water for all living things;warm clothes in winter;keeping a password secret|essential means completely necessary; affordable means cheap enough|essential 是必不可少的；affordable 是买得起的|worthless=worthless means worth nothing, not completely necessary=worthless 是毫无价值，不是必不可少;affordable=affordable means cheap enough to buy, not completely necessary=affordable 是买得起，不是必不可少|essential for life · it's essential to|stronger than *necessary*|比 *necessary* 语气更强
      affordable|housing workers can pay for;good clothes at low prices;cheap phones for everyone|affordable means cheap enough to buy; priceless means too valuable to buy|affordable 是买得起的；priceless 是无价的|worthless=worthless means worth nothing, not cheap enough for people to buy=worthless 是毫无价值，不是价格人人买得起;priceless=priceless means so valuable no money could buy it, not cheap enough=priceless 是无价之宝，不是便宜得买得起|affordable housing · affordable prices|from *afford*|来自 *afford*
      reasonable|fair prices for good food;an idea fair to everyone;not finishing all that work today|reasonable means fair and sensible; worthless means worth nothing|reasonable 是合理的；worthless 是毫无价值的|priceless/Priceless=priceless means so valuable no money could buy it, not fair and sensible=priceless 是无价的，不是合理的;worthless/Worthless=worthless means worth nothing, not fair and sensible=worthless 是毫无价值，不是合理的|reasonable prices · be reasonable|from *reason*|来自 *reason*
      worthless|a painting that was a copy;old money after new coins;a toy without batteries|worthless means worth nothing; essential means completely necessary|worthless 是毫无价值的；essential 是必不可少的|essential=essential means completely necessary, not worth nothing=essential 是必不可少，不是毫无价值;necessary=necessary means needed, not worth nothing=necessary 是必要的，不是毫无价值|become worthless · worthless money|*-less* means without: without worth|*-less* 意思是没有：没有价值
      priceless|vases no money could buy;a friendship;photos you would never sell|priceless means too valuable to buy; affordable means cheap enough|priceless 是无价的；affordable 是买得起的|affordable=affordable means cheap enough to buy, not too valuable to buy=affordable 是买得起，不是无价;reasonable=reasonable means fair and not too expensive, not too valuable to buy=reasonable 是价格合理，不是无价|a priceless collection · priceless to me|*priceless* does not mean free: it means worth very much|*priceless* 不是免费，而是极其贵重
      fortune|money made selling phones;the cost of a dress;meeting a great teacher by luck|a fortune is a lot of money or luck; a luxury is something expensive you don't need|fortune 是一大笔钱、运气；luxury 是奢侈品|luxury=a luxury is something expensive you don't need, not a large amount of money or luck=luxury 是不必要的昂贵东西，不是一大笔钱或运气;value=value is how much something is worth, not a large amount of money or luck=value 是价值，不是一大笔钱或运气|make a fortune · cost a fortune|adjective *fortunate*: lucky|形容词 *fortunate*：幸运的
      wealth|a family's money from oil;not as important as health;a country's money not shared equally|wealth is a lot of money; poverty is having very little|wealth 是财富；poverty 是贫穷|poverty=poverty is having very little money, not a large amount of it=poverty 是贫穷，不是很多钱;value=value is how much one thing is worth, not all the money someone has=value 是一件东西的价值，不是一个人所有的钱|great wealth · the wealth of a country|adjective *wealthy*: rich|形容词 *wealthy*：富有的
    `,
  },
});

const giving = vocabularyTopic({
  id: "b1-words-money-verbs",
  title: t("Giving and Sharing", "给予和分享"),
  summary: t(
    "Owing, donating, betting and gambling; counting, dividing and splitting; rewards; spare; charities; supply and demand.",
    "欠钱、捐赠、打赌和赌博；数钱、分和平分；奖励；多余的；慈善机构；供应和需求。",
  ),
  intro: t(
    "You can **owe** money, **donate** it to a **charity**, **bet** it on a game, or **split** a bill with friends. These words help you talk about what people do with money.",
    "你可能 **owe**（欠）别人钱，把钱 **donate**（捐赠）给 **charity**（慈善机构），拿钱 **bet**（打赌）比赛结果，或者和朋友 **split**（分摊）账单。这些词帮你谈论人们怎样处理钱。",
  ),
  prerequisites: ["a2-words-money"],
  words: [
    word(
      "owe owes owed owing",
      "to have to pay back money that someone lent you",
      "欠（钱）",
      "I {owe} my brother fifty dollars, and I must pay him back by Friday. | You paid for my ticket, so how much do I {owe} you? | She borrowed for her house and still {owes} the bank a lot of money.|lends bets",
      "lend bet",
    ),
    word(
      "donate donates donated donating",
      "to give money or things to help people",
      "捐赠；捐献",
      "We {donated} our old clothes to charity and didn't want them back.|owed lent | He {donates} blood every six months to help people in hospital.|owes lends | Would you like to {donate} to the children's hospital? Every gift helps.",
      "owe lend",
    ),
    word(
      "bet bets betting",
      "to risk money on what will happen, for example who will win a game; to be sure",
      "打赌；敢说",
      "He {bet} 20 dollars on his team, and lost it all when they lost.|spent saved | I {bet} you can't guess my age: I'm sure you will be wrong.|doubt forget | {Betting} money on who will win a football match is illegal in some countries.|Spending Saving",
      "spend save",
      "gamble",
    ),
    word(
      "gamble gambles gambled gambling",
      "to try to win money by playing games of chance",
      "赌博",
      "He lost all his money {gambling} on cards and horse races.|earning saving | Some people {gamble} at casinos every weekend, hoping to win, but usually lose. | She never {gambles}, because she doesn't want to risk losing her money.|earns saves",
      "earn save",
      "bet",
    ),
    word(
      "count counts counted counting",
      "to find the total number of things; to say numbers in order",
      "数；计算",
      "The shop assistant {counted} the money twice to find the total: 85 dollars.|divided spent | Can your little sister {count} the apples and tell us how many there are? | I'm {counting} the days until the holidays.|dividing supplying",
      "divide spend",
    ),
    word(
      "divide divides divided dividing",
      "to separate something into parts or groups",
      "分；分开",
      "The teacher {divided} the class, so half went to the library and half stayed.|counted joined | We {divided} the money equally, so each of us got ten dollars.|counted joined | Ten {divided} by two is five.|multiplied counted",
      "count join",
      "split",
    ),
    word(
      "split splits splitting",
      "to divide something between people; to break into two parts",
      "分摊；裂开",
      "Let's {split} the bill, so we each pay half. | The wood {split} in two when he hit it with the axe.|counted joined | They are {splitting} the cost of the taxi so that each pays the same.|counting joining",
      "count join",
      "divide",
    ),
    word(
      "reward rewards",
      "something that you get for doing something good",
      "奖励；报酬",
      "The police offered a {reward} for information.|charity supply | As a {reward} for passing, his parents bought him a bike.|charity demand | The {rewards} of hard work come later.|charities supplies",
      "record award",
    ),
    word(
      "spare sparer sparest",
      "extra, kept in case it is needed; free, not being used",
      "备用的；空闲的",
      "Do you have a {spare} pen I could use? I forgot mine. | We keep a {spare} key under the plant pot, in case we lose ours. | What do you do in your {spare} time, when you aren't working?",
      "faulty valuable",
    ),
    word(
      "charity charities",
      "an organization that collects money to help people in need",
      "慈善机构；慈善",
      "She works for a {charity} that helps homeless people.|reward supply | We raised 500 dollars for {charity}.|reward supply | Many {charities} need volunteers.|rewards supplies",
      "chart clarity",
    ),
    word(
      "supply supplies supplied supplying",
      "to give people what they need; an amount of something that is available",
      "供应；提供",
      "The farm {supplies} milk to local shops and gets paid every week.|donates owes | The town has plenty of fresh water: the {supply} never runs out.|demand reward | The school {supplied} the books, so the students didn't have to buy them.|demanded owed",
      "donate owe",
    ),
    word(
      "demand demands",
      "a strong request; the need that people have for something",
      "需求；要求",
      "There is a big {demand} for electric cars: everyone wants one. | The workers' {demands} for better pay were refused by the boss.|supplies rewards | Prices rise when {demand} is high and supply is low.|reward charity",
      "supply reward",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Supply* and *demand* go together: to *supply* is to give people what they need, and *demand* is how much people want something. Ask whether the sentence is about giving or about wanting.",
        "*supply* 和 *demand* 常一起出现：*supply* 是给人们提供所需，*demand* 是人们想要的程度。想一想句子讲的是提供还是想要。",
      ),
      meaning: t(
        "*Owe* and *donate* both have money going to someone, but money you *owe* must be paid back, and money you *donate* is a free gift to help. Check whether the meaning talks about paying back.",
        "*owe* 和 *donate* 都是钱给到别人，但 *owe* 的钱必须还，*donate* 的钱是帮助别人的无偿赠予。看释义有没有说要还钱。",
      ),
      spell: t(
        "*Split* and *bet* stay the same in the past: *split*, *bet*; before -ing they double the t: *splitting*, *betting*.",
        "*split* 和 *bet* 的过去式不变：*split*、*bet*；加 -ing 时双写 t：*splitting*、*betting*。",
      ),
    },
    notes: `
      owe|fifty dollars to pay back by Friday;a ticket someone paid for;a bank loan for a house|to owe is to have to pay back; to lend is to give money that will come back|owe 是欠；lend 是借出|lend/lends=to lend is to give money that will come back to you, not to have to pay it back=lend 是借钱给别人，不是自己要还钱;bet/bets=to bet is to risk money on a game, not to have to pay back money you borrowed=bet 是拿钱打赌，不是要还借来的钱|owe money · owe someone|*owe* sounds like *oh*|*owe* 读音像 *oh*
      donate|clothes given away for good;blood every six months;a gift to a children's hospital|to donate is to give to help; to owe is to have to pay back|donate 是捐赠；owe 是欠|owe/owed/owes=to owe is to have to pay back, not to give freely to help=owe 是欠钱要还，不是无偿捐赠;lend/lent/lends=to lend is to give something you will get back, not a free gift=lend 是借出要收回，不是无偿赠送|donate to charity · donate blood|noun *donation*|名词 *donation*
      bet|20 dollars lost on a team;being sure someone will guess wrong;money on who will win a match|to bet is to risk money on what will happen; to spend is to pay for things|bet 是打赌；spend 是花钱|spend/spent/Spending=to spend is to pay for things, not to risk money on who will win=spend 是买东西花钱，不是赌输赢;save/saved/Saving=to save is to keep money, not to risk it on a game=save 是存钱，不是拿钱冒险;doubt=to doubt is to think something isn't true, not to be sure of it=doubt 是怀疑，不是确信;forget=to forget is not to remember, not to be sure of something=forget 是忘记，不是确信|bet on a team · I bet|past *bet*, not *betted*|过去式是 *bet*，不是 *betted*
      gamble|all money lost on cards;casinos every weekend;not risking her money|to gamble is to risk money on games of chance; to earn is to get money for work|gamble 是赌博；earn 是挣钱|earn/earning/earns=to earn is to get money for work, not to risk it on games of chance=earn 是工作挣钱，不是拿钱碰运气;save/saving/saves=to save is to keep money safe, not to risk it=save 是存钱，不是拿钱冒险|gamble at a casino · lose money gambling|*gamble* sounds like *gambol*, a dance of lambs|*gamble* 和 *gambol*（小羊蹦跳）读音相同
      count|finding a total of 85 dollars;how many apples there are;days until the holidays|to count is to find the total number; to divide is to separate into parts|count 是数；divide 是分开|divide/divided/dividing=to divide is to separate into parts, not to find the total=divide 是分成几份，不是算总数;spend/spent=to spend is to pay money, not to find the total=spend 是花钱，不是数钱;supplying=to supply is to give people things, not to count days=supply 是供应，不是数日子|count money · count to ten|*count* on someone means trust them|*count on* 是依靠
      divide|half to the library and half staying;ten dollars each;ten by two is five|to divide is to separate into parts; to join is to put together|divide 是分；join 是合|count/counted=to count is to find a total, not to separate into parts=count 是数数，不是分开;join/joined=to join is to put things together, not to separate them=join 是合在一起，不是分开;multiplied=ten multiplied by two is twenty, not five=十乘以二是二十，不是五|divide into groups · divided by|*divide* has i, then i: d-i-v-i-d-e|*divide* 有两个 i
      split|half the bill each;wood hit with an axe;the same taxi cost for each|to split is to share or break in two; to join is to put together|split 是分摊、裂开；join 是连接|count/counted/counting=to count is to find a total, not to share or break in two=count 是数数，不是分摊或裂开;join/joined/joining=to join is to put things together, not to break or share them=join 是合在一起，不是分开|split the bill · split in two|past *split*; *splitting* doubles the t|过去式 *split*；*splitting* 双写 t
      spare|a pen to borrow;a key in case we lose ours;time when not working|spare means extra or free; faulty means broken|spare 是备用的、空闲的；faulty 是有故障的|faulty=faulty means broken, not extra or free=faulty 是坏的，不是备用或空闲的;valuable=valuable means worth a lot, not extra or free=valuable 是贵重的，不是备用或空闲的|a spare key · spare time|a *spare* room is a room for guests|*spare room* 是客房
      charity|help for homeless people;500 dollars raised;groups that need volunteers|a charity helps people in need; a reward is for doing something good|charity 是慈善机构；reward 是奖励|reward/rewards=a reward is something you get for doing something good, not an organization that helps people=reward 是做好事得到的奖励，不是慈善组织;supply/supplies=a supply is an amount of something available, not an organization that helps people=supply 是供应量，不是慈善组织;chart=a chart is a drawing that shows numbers, not an organization that helps people=chart 是图表，不是慈善机构;clarity=clarity means being clear and easy to understand, not an organization=clarity 是清晰，不是一个机构|give to charity · a charity shop|plural *charities*|复数 *charities*
      supply|milk to shops for payment;water that never runs out;books students didn't buy|to supply is to give what is needed; to demand is to ask strongly|supply 是供应；demand 是要求|donate/donates=to donate is to give for free, not to sell to shops for payment=donate 是无偿捐赠，不是卖给商店收钱;owe/owes/owed=to owe is to have to pay back, not to give people what they need=owe 是欠钱，不是供应;demand/demanded=demand is what people want or ask for strongly, not what is given=demand 是人们想要的，不是提供的;reward=a reward is for doing something good, not an amount of water=reward 是奖励，不是水的供应|a supply of water · supply food|past *supplied*: y becomes i|过去式 *supplied*：y 变 i
      demand|everyone wanting electric cars;better pay asked for strongly;high and with low supply|demand is what people want; supply is what is available|demand 是需求；supply 是供应|supply/supplies=supply is what is available, not what people want=supply 是供应，不是需求;reward/rewards=a reward is something given for doing good, not a strong request or need=reward 是奖励，不是要求或需求;charity=a charity helps people in need, not how much people want something=charity 是慈善机构，不是需求|in demand · demand for|*demand* is a verb too: they demanded more pay|*demand* 也是动词：they demanded more pay
      reward|police money for information;a bike for passing;what hard work brings later|a reward is given for doing something good; a charity helps people in need|reward 是奖励；charity 是慈善|charity/charities=a charity is an organization that helps people, not something you get for doing good=charity 是慈善机构，不是奖励;supply/supplies=a supply is what is available, not something you get for doing good=supply 是供应，不是奖励;demand=a demand is a strong request, not something you get for doing good=demand 是要求，不是奖励;award=an award is a prize chosen by judges for the best work, while a reward comes back to you for doing something helpful=award 是评选出来的奖项；reward 是做好事得到的回报|offer a reward · as a reward|*reward* is not *award*, a prize at a ceremony|*reward* 不是 *award*（颁奖典礼上的奖）
    `,
  },
});

const online = vocabularyTopic({
  id: "b1-words-online-shopping",
  title: t("Shopping Online", "网上购物"),
  summary: t(
    "Carts and checkouts; delivery and tracking; parcels, packages and couriers; stock and available; payments; secure; vouchers.",
    "购物车和结账；送货和追踪；包裹和快递员；库存和有货的；付款；安全的；代金券。",
  ),
  intro: t(
    "Put what you want in your **cart**, go to the **checkout**, and a **courier** brings the **parcel** to your door. These words help you shop online and follow your order.",
    "把想买的东西放进 **cart**（购物车），去 **checkout**（结账），**courier**（快递员）就会把 **parcel**（包裹）送到你家门口。这些词帮你网购并跟进订单。",
  ),
  prerequisites: ["b1-words-consumers"],
  words: [
    word(
      "cart carts",
      "the place on a shopping website where you keep what you want to buy; a container on wheels in a supermarket",
      "购物车",
      "Add the shoes to your {cart} and pay. | My shopping {cart} is full, but I haven't paid yet. | He pushed the {cart} around the supermarket.",
      "courier voucher",
    ),
    word(
      "checkout checkouts",
      "the place where you pay in a shop or on a website",
      "结账处；结账",
      "Go to the {checkout} to pay for your order. | There was a long line of shoppers waiting to pay at the {checkout}. | Enter the voucher code at {checkout}.",
      "parcel courier",
    ),
    word(
      "delivery deliveries",
      "bringing goods to someone's home or office",
      "送货；递送",
      "{Delivery} to your door is free for orders over 50 dollars. | We are waiting for a {delivery} of new books: the van should come at ten. | The post doesn't come on Sundays: there are no {deliveries} then.",
      "stock voucher",
    ),
    word(
      "track tracks tracked tracking",
      "to follow the progress of something, such as a parcel",
      "追踪；跟踪",
      "You can {track} your parcel online and see where it is now. | The app {tracks} your runs and shows the route on a map. | Enter your {tracking} number to see where your parcel is.",
      "stock secure",
    ),
    word(
      "parcel parcels",
      "something wrapped in paper or in a box to be sent by post",
      "包裹",
      "The {parcel} arrived two days late, and the box was damaged. | I need to post a {parcel} of books to my aunt. | The courier left the {parcel} with my neighbor.",
      "checkout voucher",
      "package",
    ),
    word(
      "package packages",
      "a box or a parcel that is sent or delivered",
      "包裹；包装",
      "A {package} came for you this morning: a big brown box. | The {package} was too big for the letterbox. | We've had three {packages} delivered to our door this week.",
      "checkout stock",
      "parcel",
    ),
    word(
      "courier couriers",
      "a person or a company that takes parcels to people",
      "快递员；快递公司",
      "The {courier} will deliver your order tomorrow. | I had to sign for the parcel when the {courier} came. | {Couriers} work very long hours.",
      "voucher cart",
    ),
    word(
      "stock stocks",
      "the goods that a shop has available to sell",
      "库存；存货",
      "Sorry, this size is out of {stock}. | We have plenty of rice in {stock}. | The shop is selling all its old {stock} of winter clothes cheaply.",
      "delivery cart",
    ),
    word(
      "available",
      "able to be bought, used or found",
      "可获得的；有货的",
      "This phone is {available} in three colors. | Are there any tickets still {available}? | The doctor isn't {available} until Friday.",
      "secure faulty",
    ),
    word(
      "payment payments",
      "an amount of money that you pay",
      "付款；支付",
      "We accept {payment} by card or by phone. | She makes monthly {payments} on her loan. | {Payment} must be made before delivery.",
      "stock delivery",
    ),
    word(
      "secure securer securest",
      "safe, protected from danger or theft",
      "安全的；牢固的",
      "Only shop on {secure} websites that keep your card details safe. | Keep your passport somewhere {secure}, like a hotel safe. | Hold the ladder so it's {secure} and won't move while I climb.|available faulty",
      "available faulty",
    ),
    word(
      "voucher vouchers",
      "a piece of paper or a code that you can use instead of money",
      "代金券；优惠券",
      "I got a 20-dollar {voucher} for my birthday. | Use this {voucher} to get 10 percent off. | The shop gave us {vouchers} instead of a refund.",
      "courier checkout",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "You add things to your *cart*, then you pay at the *checkout*. Look for *add to* or *pay at*.",
        "东西先加进 *cart*，然后在 *checkout* 付款。留意句中是 *add to* 还是 *pay at*。",
      ),
      meaning: t(
        "A *courier* is the person or company that brings a parcel; *delivery* is the act of bringing it. Check whether the meaning names a person or an action.",
        "*courier* 是送包裹的人或公司；*delivery* 是送货这件事。看释义说的是人还是行为。",
      ),
      spell: t(
        "*Courier* is spelled c-o-u-r-i-e-r: ou at the start, ie near the end.",
        "*courier* 拼作 c-o-u-r-i-e-r：开头是 ou，后面是 ie。",
      ),
    },
    notes: `
      cart|shoes added before paying;full but not paid for yet;pushed around a supermarket|a cart holds what you want to buy; a voucher is used instead of money|cart 是购物车；voucher 是代金券|courier/couriers=a courier is a person who brings parcels, not where you keep things you want to buy=courier 是送包裹的人，不是放要买的东西的地方;voucher/vouchers=a voucher is used instead of money, not where you keep things you want to buy=voucher 是代替现金的券，不是放要买的东西的地方|add to cart · a shopping cart|British English also says *basket* or *trolley*|英式英语也说 *basket* 或 *trolley*
      checkout|paying for an order;shoppers waiting to pay;entering a voucher code|the checkout is where you pay; a parcel is what is sent|checkout 是结账处；parcel 是包裹|parcel/parcels=a parcel is a box sent by post, not the place where you pay=parcel 是邮寄的包裹，不是付钱的地方;courier/couriers=a courier brings parcels, not the place where you pay=courier 是送包裹的人，不是付钱的地方|go to checkout · at the checkout|one word; *check out* as a verb is two words|名词是一个词；动词 *check out* 是两个词
      delivery|free to your door over 50 dollars;new books coming by van;no post on Sundays|delivery is bringing goods to you; stock is goods a shop has|delivery 是送货；stock 是库存|stock/stocks/Stock=stock is goods a shop has to sell, not bringing goods to your door=stock 是商店的存货，不是送货上门;voucher/vouchers/Voucher=a voucher is used instead of money, not bringing goods to your door=voucher 是代替现金的券，不是送货上门|free delivery · home delivery|verb *deliver*|动词 *deliver*
      track|seeing where a parcel is now;runs shown on a map;a number for following a parcel|to track is to follow the progress of something; to stock is to keep goods to sell|track 是追踪；stock 是备货|stock/stocks/stocking=to stock is to keep goods to sell, not to follow where something is=stock 是备货，不是追踪位置;secure/secures/securing=to secure is to make something safe, not to follow where it is=secure 是使安全，不是追踪|track a parcel · a tracking number|*track* also means a path or a song|*track* 也指小路或歌曲
      parcel|two days late with a damaged box;books posted to an aunt;left with a neighbor by the courier|a parcel is something wrapped and sent; a voucher is used instead of money|parcel 是包裹；voucher 是代金券|checkout/checkouts=a checkout is where you pay, not a box that is sent=checkout 是付钱的地方，不是寄送的盒子;voucher/vouchers=a voucher is used instead of money, not a box that is sent=voucher 是代替现金的券，不是寄送的盒子|send a parcel · a parcel of books|close to *package*|和 *package* 意思相近
      package|a big brown box this morning;too big for the letterbox;three delivered this week|a package is a box that is sent; stock is goods a shop has|package 是包裹；stock 是库存|checkout/checkouts=a checkout is where you pay, not a box that is delivered=checkout 是付钱的地方，不是送来的盒子;stock/stocks=stock is goods a shop keeps, not a box delivered to you=stock 是商店的存货，不是送给你的盒子|a package came · deliver a package|*package* is more common in American English|*package* 在美式英语中更常用
      courier|delivering an order tomorrow;someone you sign for a parcel with;people working long hours|a courier is a person who takes parcels; a voucher is a code instead of money|courier 是快递员；voucher 是代金券|voucher/vouchers/Vouchers=a voucher is a paper or code instead of money, not a person who takes parcels=voucher 是代替现金的券，不是送包裹的人;cart/carts/Carts=a cart is where you keep things you want to buy, not a person who takes parcels=cart 是购物车，不是送包裹的人|a courier company · send by courier|*courier* is not *career*, the work of your life|*courier* 不是 *career*（职业生涯）
      stock|a size that has run out;plenty of rice;old winter clothes sold cheaply|stock is goods a shop has; delivery is bringing goods to you|stock 是存货；delivery 是送货|delivery=delivery is bringing goods to someone, not goods a shop has=delivery 是送货，不是商店的存货;cart=a cart is where you keep things you want to buy, not goods a shop has=cart 是购物车，不是商店的存货;courier=a courier brings parcels, not goods a shop has=courier 是快递员，不是商店的存货|out of stock · in stock|*stocks* also means shares in a company|*stocks* 也指公司股票
      available|three colors;tickets still left;a doctor free from Friday|available means you can get or use it; secure means safe|available 是可获得的；secure 是安全的|secure=secure means safe, not able to be bought or found=secure 是安全的，不是可以买到或找到;faulty=faulty means broken, not able to be bought or found=faulty 是有故障的，不是可以买到或找到|available in · still available|opposite *unavailable*|反义词 *unavailable*
      payment|card or phone accepted;monthly on a loan;made before delivery|a payment is money you pay; stock is goods a shop has|payment 是付款；stock 是存货|stock/stocks/Stock=stock is goods a shop has, not money you pay=stock 是存货，不是付的钱;delivery=delivery is bringing goods, not money you pay=delivery 是送货，不是付的钱;couriers=couriers bring parcels, not money you pay=courier 是快递员，不是付的钱;Voucher=a voucher is used instead of money, not a payment you must make=voucher 是代替现金的券，不是必须付的钱|make a payment · payment by card|from *pay* + *-ment*|由 *pay* 加 *-ment* 构成
      secure|websites that keep card details safe;a passport in a hotel safe;a ladder that won't move|secure means safe and protected; available means you can get it|secure 是安全的；available 是可获得的|available=available means you can get it, not safe or protected=available 是可获得的，不是安全牢固的;faulty=faulty means broken, not safe or protected=faulty 是坏的，不是安全牢固的|a secure website · keep it secure|noun *security*|名词 *security*
      voucher|20 dollars for a birthday;10 percent off;given instead of a refund|a voucher is used instead of money; a courier brings parcels|voucher 是代金券；courier 是快递员|courier/couriers=a courier is a person who brings parcels, not a code used instead of money=courier 是快递员，不是代替现金的券;checkout/checkouts=a checkout is where you pay, not a code used instead of money=checkout 是付钱的地方，不是代替现金的券|a gift voucher · a voucher code|*voucher* ends in -er|*voucher* 以 -er 结尾
    `,
  },
});

// Gerunds and infinitives.

/** ingVerbs are verbs followed by the -ing form, each with a sentence, the verb in brackets and the -ing form. */
const handIngVerbs: readonly (readonly [string, string, string])[] = [
  ["I enjoy ___ for clothes online.", "shop", "shopping"],
  ["Try to avoid ___ money on things you don't need.", "spend", "spending"],
  ["Have you finished ___ the report?", "write", "writing"],
  ["Do you mind ___ the window?", "close", "closing"],
  ["She suggested ___ the bill.", "split", "splitting"],
  ["He keeps ___ the same mistake.", "make", "making"],
  ["You should practice ___ English every day.", "speak", "speaking"],
  ["I can't imagine ___ without my phone.", "live", "living"],
  ["We are considering ___ a new car.", "buy", "buying"],
  ["I miss ___ my grandparents every weekend.", "see", "seeing"],
  ["He gave up ___ last year.", "smoke", "smoking"],
  ["They enjoyed ___ to the beach.", "go", "going"],
  ["She avoided ___ at me.", "look", "looking"],
  ["I don't mind ___ for a few minutes.", "wait", "waiting"],
  ["Have you finished ___ your room?", "clean", "cleaning"],
  ["My teacher suggested ___ a dictionary.", "use", "using"],
  ["Keep ___ until you reach the bridge.", "walk", "walking"],
  ["I'm thinking of ___ a part-time job.", "get", "getting"],
  ["She is good at ___ money.", "save", "saving"],
  ["Thank you for ___ me.", "help", "helping"],
  ["He left without ___ goodbye.", "say", "saying"],
  ["I'm looking forward to ___ you.", "meet", "meeting"],
  ["We're interested in ___ a house.", "rent", "renting"],
  ["She's afraid of ___ alone at night.", "be", "being"],
  ["Instead of ___ a taxi, we walked.", "take", "taking"],
  ["After ___ dinner, we watched a film.", "eat", "eating"],
  ["He's tired of ___ the same food every day.", "cook", "cooking"],
  ["Before ___ the contract, read it carefully.", "sign", "signing"],
];

/** toVerbs are verbs followed by to and the base form, each with a sentence, the verb in brackets, the answer and the wrong -ing form. */
const handToVerbs: readonly (readonly [string, string, string, string])[] = [
  ["I can't afford ___ a new phone.", "buy", "to buy", "buying"],
  ["We decided ___ at home this summer.", "stay", "to stay", "staying"],
  ["I hope ___ you again soon.", "see", "to see", "seeing"],
  ["They are planning ___ to Japan.", "travel", "to travel", "traveling"],
  ["He agreed ___ me with my homework.", "help", "to help", "helping"],
  ["She refused ___ for the broken plate.", "pay", "to pay", "paying"],
  ["I promise ___ the money back on Friday.", "give", "to give", "giving"],
  ["Did you manage ___ the tickets?", "get", "to get", "getting"],
  ["My neighbor offered ___ my plants.", "water", "to water", "watering"],
  ["I'm learning ___ the guitar.", "play", "to play", "playing"],
  ["We expect ___ by six o'clock.", "arrive", "to arrive", "arriving"],
  ["He pretended ___ asleep.", "be", "to be", "being"],
  ["She wants ___ a doctor.", "become", "to become", "becoming"],
  ["They need ___ more money.", "save", "to save", "saving"],
  ["I'd like ___ a complaint.", "make", "to make", "making"],
  ["We hope ___ the house next year.", "sell", "to sell", "selling"],
  ["She tends ___ late.", "be", "to be", "being"],
  ["She decided ___ the job.", "accept", "to accept", "accepting"],
  ["The shop agreed ___ my money.", "refund", "to refund", "refunding"],
  ["I can't afford ___ a car.", "run", "to run", "running"],
  ["He refused ___ the question.", "answer", "to answer", "answering"],
  ["He failed ___ the bill on time.", "pay", "to pay", "paying"],
  ["They promised ___ the parcel today.", "deliver", "to deliver", "delivering"],
  ["We managed ___ a cheap flight.", "find", "to find", "finding"],
  ["She has arranged ___ abroad.", "study", "to study", "studying"],
  ["He seems ___ the city.", "like", "to like", "liking"],
  ["I chose ___ the train.", "take", "to take", "taking"],
  ["They threatened ___ the police.", "call", "to call", "calling"],
];

/** doings are a verb, its -ing form and the rest of what is done, which fit after any verb or preposition below. */
const doings: readonly (readonly [string, string, string])[] = [
  ["cook", "cooking", "dinner"],
  ["paint", "painting", "the fence"],
  ["clean", "cleaning", "the kitchen"],
  ["visit", "visiting", "the museum"],
  ["learn", "learning", "Spanish"],
  ["ride", "riding", "a horse"],
  ["swim", "swimming", "in the lake"],
  ["play", "playing", "chess"],
  ["bake", "baking", "a cake"],
  ["watch", "watching", "the match"],
  ["walk", "walking", "to work"],
];
/** doers are people whose verbs need no agreement in the past, and doersOne are people for is and -s. */
const doers = ["Tom", "My sister", "We", "They", "Grandpa"] as const;
const doersOne = ["Tom", "My sister", "Grandpa", "Our teacher", "Lucy"] as const;
/** ingTriggers, toTriggers and prepositionTriggers are words that take -ing, to, or -ing after a preposition. */
const ingTriggers = ["enjoyed", "finished", "avoided", "suggested", "kept", "considered", "missed", "didn't mind"] as const;
const toTriggers = ["decided", "hoped", "planned", "agreed", "refused", "promised", "managed", "wanted", "needed", "chose"] as const;
const prepositionTriggers = [
  "is good at",
  "is tired of",
  "is interested in",
  "is excited about",
  "is bored with",
  "dreams of",
  "thinks about",
  "is keen on",
  "talks about",
] as const;

/** ingVerbs and toVerbs are the hand-written items and items for every trigger with every doing. */
const ingVerbs: readonly (readonly [string, string, string])[] = [
  ...handIngVerbs,
  ...everyTriple(ingTriggers, doings, doers).map(
    ([trigger, [verb, ing, rest], who]) => [`${who} ${trigger} ___ ${rest}.`, verb, ing] as const,
  ),
];
const toVerbs: readonly (readonly [string, string, string, string])[] = [
  ...handToVerbs,
  ...everyTriple(toTriggers, doings, doers).map(
    ([trigger, [verb, ing, rest], who]) => [`${who} ${trigger} ___ ${rest}.`, verb, `to ${verb}`, ing] as const,
  ),
];

const gerundChoice: readonly ChoiceItem[] = interleave([
  ingVerbs.map(([s, verb, ing]): ChoiceItem => [`${s} (${verb})`, ing, [`to ${verb}`, verb]]),
  toVerbs.map(([s, verb, inf, ing]): ChoiceItem => [`${s} (${verb})`, inf, [ing, verb]]),
]);

const gerundTyped: readonly TypedItem[] = interleave([
  ingVerbs.map(([s, verb, ing]): TypedItem => ({ shown: `${s} (${verb})`, accepted: [ing], wrong: [`to ${verb}`, verb] })),
  toVerbs.map(([s, verb, inf, ing]): TypedItem => ({ shown: `${s} (${verb})`, accepted: [inf], wrong: [ing, verb] })),
]);

/** afterPreposition are the -ing items whose verb follows a preposition. */
const afterPreposition = handIngVerbs.slice(17);

const prepositionChoice: readonly ChoiceItem[] = [
  ...afterPreposition.map(([s, verb, ing]): ChoiceItem => [`${s} (${verb})`, ing, [`to ${verb}`, verb]]),
  ["I'm good at ___ problems. (solve)", "solving", ["to solve", "solve"]],
  ["She's worried about ___ her exam. (fail)", "failing", ["to fail", "fail"]],
  ["We talked about ___ a party. (have)", "having", ["to have", "have"]],
  ["He apologized for ___ late. (be)", "being", ["to be", "be"]],
  ["I'm bored with ___ at home. (sit)", "sitting", ["to sit", "sit"]],
  ["You can save money by ___ your own lunch. (bring)", "bringing", ["to bring", "bring"]],
  ["She's excited about ___ to university. (go)", "going", ["to go", "go"]],
  ["He's proud of ___ the race. (win)", "winning", ["to win", "win"]],
  ["I'm sorry for ___ your birthday. (forget)", "forgetting", ["to forget", "forget"]],
  ["They succeeded in ___ the bank loan. (get)", "getting", ["to get", "get"]],
  ["How about ___ a film tonight? (watch)", "watching", ["to watch", "watch"]],
  ["She insisted on ___ for dinner. (pay)", "paying", ["to pay", "pay"]],
  ["We're keen on ___ new places. (explore)", "exploring", ["to explore", "explore"]],
  ["Wash your hands before ___ food. (touch)", "touching", ["to touch", "touch"]],
  ["He got the job by ___ hard. (work)", "working", ["to work", "work"]],
  ["I'm used to ___ up early. (get)", "getting", ["to get", "get"]],
  ["She left the shop without ___ anything. (buy)", "buying", ["to buy", "buy"]],
  ["We're tired of ___ for the bus. (wait)", "waiting", ["to wait", "wait"]],
  ["Are you interested in ___ the club? (join)", "joining", ["to join", "join"]],
  ["He's nervous about ___ in public. (speak)", "speaking", ["to speak", "speak"]],
  ["Thanks for ___ me the money. (lend)", "lending", ["to lend", "lend"]],
  ["She dreams of ___ a famous singer. (become)", "becoming", ["to become", "become"]],
  ...everyTriple(prepositionTriggers, doings, doersOne).map(
    ([trigger, [verb, ing, rest], who]): ChoiceItem => [`${who} ${trigger} ___ ${rest}. (${verb})`, ing, [`to ${verb}`, verb]],
  ),
];

const prepositions = new Set(["at", "of", "in", "about", "for", "by", "without", "before", "after", "on", "with", "to"]);

/** formTrigger finds the word before the gap that decides the form, and whether it is a preposition. */
function formTrigger(shown: string): readonly [string, boolean] {
  const words = (shown.split("___")[0] ?? "").trim().split(" ");
  const last = (words.at(-1) ?? "").toLowerCase();
  const before = (words.at(-2) ?? "").toLowerCase();
  if (last === "up") return [`${before} up`, false];
  if (last === "to") return [before === "forward" ? "look forward to" : before === "used" ? "be used to" : `${before} to`, true];

  if (last === "of" && before === "instead") return ["instead of", true];
  return [last, prepositions.has(last)];
}

/** formRule names the rule that picks -ing or to after the word before the gap. */
function formRule(right: string, shown: string): Text {
  const [word, preposition] = formTrigger(shown);
  if (preposition)
    return word.endsWith(" to")
      ? t(
          `In *${word}*, *to* is a preposition, and a verb after a preposition takes *-ing*`,
          `*${word}* 里的 *to* 是介词，介词后的动词用 *-ing*`,
        )
      : t(`*${word}* is a preposition, and a verb after a preposition takes *-ing*`, `*${word}* 是介词，介词后的动词用 *-ing*`);
  return right.startsWith("to ")
    ? t(`*${word}* is a verb that takes *to* and the base form`, `*${word}* 后面接 *to* 加动词原形`)
    : t(`*${word}* is a verb that takes the *-ing* form`, `*${word}* 后面接动词的 *-ing* 形式`);
}

/** gerundWhy explains -ing or to in the gap of shown. */
const gerundWhy = (right: string, shown: string): Text => {
  const [word, preposition] = formTrigger(shown);
  const rule = formRule(right, shown);
  const check = preposition
    ? t(
        `**Check.** Look right before the gap: *${word}* ends in a preposition, and every verb after a preposition takes *-ing* (*${right}*).`,
        `**检验。** 看空白前面：*${word}* 是（或以）介词结尾，介词后的动词一律用 *-ing*（*${right}*）。`,
      )
    : t(
        `**Check.** Look at the trigger verb *${word}*: it belongs to the ${right.startsWith("to ") ? "*to* + base form" : "*-ing*"} group, confirming *${right}*.`,
        `**检验。** 看前面的支配动词 *${word}*：它属于后接${right.startsWith("to ") ? "*to* + 动词原形" : "动词 *-ing*"} 的一类，因此选 *${right}*。`,
      );
  return t(`${rule.en}: ${fill(shown, right)}\n\n${check.en}`, `${rule["zh-CN"]}：${fill(shown, right)}\n\n${check["zh-CN"]}`);
};

/** whyNotGerund explains a wrong form: to where -ing belongs, -ing where to belongs, or the base form. */
const whyNotGerund = (wrong: string, _right: string, shown: string): Text => {
  const [word, preposition] = formTrigger(shown);
  if (wrong.startsWith("to "))
    return preposition
      ? t("*to* + base form cannot follow a preposition.", "介词后面不能接 *to* 加动词原形。")
      : t(`*${word}* does not take *to* + base form after it.`, `*${word}* 后面不接 *to* 加动词原形。`);
  if (wrong.endsWith("ing")) return t(`*${word}* does not take the *-ing* form after it.`, `*${word}* 后面不接 *-ing* 形式。`);
  return t(
    `*${wrong}* is a bare base verb, which cannot directly follow *${word}*.`,
    `*${wrong}* 只是光杆动词原形，不能直接跟在 *${word}* 后面。`,
  );
};

const gerundsAndInfinitives: TopicDef = {
  id: "gerunds-and-infinitives",
  title: t("Gerunds and Infinitives", "动名词和不定式"),
  summary: t(
    "I enjoy shopping, but I can't afford to buy much. Some verbs take -ing (enjoy, avoid, finish), others to (afford, decide, hope); after a preposition, use -ing.",
    "I enjoy shopping, but I can't afford to buy much. 有些动词后接 -ing（enjoy、avoid、finish），有些接 to（afford、decide、hope）；介词后用 -ing。",
  ),
  intro: t(
    "Compare *We finished packing* with *We promised to call*. When a second verb follows a verb or a preposition (*good at saving*), English requires either the *-ing* form (gerund) or *to* + base form (infinitive)—never a bare verb.",
    "比较 *We finished packing* 和 *We promised to call*。一个动词跟在另一个动词或介词（*good at saving*）后面时，英语要求用 *-ing*（动名词）或 *to* + 原形（不定式），不能直接放光杆原形。",
  ),
  prerequisites: ["verbs-followed-by-to", "like-and-love-with-ing"],
  encompasses: [
    { topic: "verbs-followed-by-to", weight: 0.3 },
    { topic: "like-and-love-with-ing", weight: 0.2 },
  ],
  xp: 25,
  strand: "grammar",
  knowledgePoints: [
    point(
      "choose",
      t("-ing or to after a verb", "动词后接 -ing 还是 to"),
      t(
        "When one verb follows another, the first verb decides the form of the second:\n\n- **-ing** after *enjoy, avoid, finish, mind, suggest, keep, practice, imagine, consider, miss, give up*: *I enjoy **shopping**. Do you mind **closing** the window?*\n- **to** + base form after *afford, decide, hope, plan, agree, refuse, promise, manage, offer, learn, expect, pretend, want, need, would like*: *I can't afford **to buy** it. We decided **to stay**.*\n\n> **Watch out.** Do not put a bare base verb right after the first verb (*enjoy shop* or *afford buy* is wrong), and note that *suggest*, *avoid* and *mind* always take *-ing*, never *to*.",
        "一个动词后面接另一个动词时，由第一个动词决定第二个的形式：\n\n- *enjoy, avoid, finish, mind, suggest, keep, practice, imagine, consider, miss, give up* 后接 **-ing**：*I enjoy **shopping**. Do you mind **closing** the window?*\n- *afford, decide, hope, plan, agree, refuse, promise, manage, offer, learn, expect, pretend, want, need, would like* 后接 **to** + 原形：*I can't afford **to buy** it. We decided **to stay**.*\n\n> **注意。** 不要直接跟光杆动词原形（*enjoy shop*、*afford buy* 都是错的）；特别留意 *suggest*、*avoid*、*mind* 后面只接 *-ing*，不接 *to*。",
      ),
      choiceGenerator(
        t("Choose the right form of the verb in brackets.", "选出括号中动词的正确形式。"),
        gerundChoice,
        gerundWhy,
        whyNotGerund,
      ),
    ),
    point(
      "preposition",
      t("-ing after a preposition", "介词后用 -ing"),
      t(
        "After a preposition (*at, of, in, about, for, by, without, before, after, instead of*), a verb is always in the **-ing** form:\n\n- *She is good **at saving** money.*\n- *Thank you **for helping** me.*\n- *He left **without saying** goodbye.*\n\nThis is also true for *to* when it is a preposition, as in *look forward to* and *be used to*: *I'm looking forward to **meeting** you.*\n\n> **Watch out.** Do not be tricked by the word *to* in *look forward to* or *be used to*—here *to* is a preposition, so the verb after it takes *-ing* (*meeting*), never the base form (*meet*).",
        "介词（*at, of, in, about, for, by, without, before, after, instead of*）后面的动词总是用 **-ing** 形式：\n\n- *She is good **at saving** money.*\n- *Thank you **for helping** me.*\n- *He left **without saying** goodbye.*\n\n*to* 作介词时也一样，比如 *look forward to* 和 *be used to*：*I'm looking forward to **meeting** you.*\n\n> **注意。** 别被 *look forward to* 和 *be used to* 里的 *to* 迷惑——这里的 *to* 是介词，后面必须接 *-ing*（*meeting*），不能接原形（*meet*）。",
      ),
      choiceGenerator(
        t("Choose the right form of the verb in brackets.", "选出括号中动词的正确形式。"),
        prepositionChoice,
        gerundWhy,
        whyNotGerund,
      ),
    ),
    point(
      "write",
      t("Writing -ing or to", "写出 -ing 或 to"),
      t(
        "Type the right form of the verb in brackets: the **-ing** form (*shopping, making, splitting*) or ***to*** + the base form (*to buy, to stay*).\n\nRemember the spelling of *-ing*: drop a final *-e* (*make → making*), and double a final consonant after one short vowel (*split → splitting, get → getting*).\n\n> **Watch out.** Check the word right before the gap first (preposition or *-ing* verb vs. *to*-verb), and verify *-ing* spelling before submitting.",
        "输入括号中动词的正确形式：**-ing** 形式（*shopping, making, splitting*）或 ***to*** + 原形（*to buy, to stay*）。\n\n注意 *-ing* 的拼写：去掉词尾的 *-e*（*make → making*），单个短元音后的词尾辅音要双写（*split → splitting, get → getting*）。\n\n> **注意。** 先看空白前面是什么词（介词/接 *-ing* 的动词，还是接 *to* 的动词），再核对 *-ing* 的拼写变化。",
      ),
      typedGenerator("word-form", t("Type the right form of the verb in brackets.", "输入括号中动词的正确形式。"), gerundTyped, gerundWhy),
    ),
  ],
};

// Writing a letter of complaint.

const complaintBank: readonly WritingItem[] = [
  {
    task: "You bought a laptop online. When it arrived, the screen was cracked. Write a letter of complaint to the shop.",
    model:
      "Dear Sir or Madam,\n\nI am writing to complain about a laptop that I ordered from your website on 3 March (order number 48213).\n\nWhen the parcel arrived on 6 March, I found that the screen was cracked across the middle. The box was not damaged, so I believe the laptop was already broken when it was packed. I cannot use it for my university work, which is a serious problem because I have exams next month.\n\nI telephoned your customer service twice, but nobody has replied to my messages. I would therefore like you to collect the faulty laptop and send me a new one within a week. If this is not possible, I would like a full refund.\n\nI have attached a photo of the screen and a copy of the receipt. I look forward to hearing from you soon.\n\nYours faithfully,\nLi Ming",
  },
  {
    task: "You stayed in a hotel for three nights. Your room was dirty and noisy, and the air conditioning did not work. Write a letter of complaint to the hotel manager.",
    model:
      "Dear Manager,\n\nI am writing to complain about my stay at your hotel from 10 to 13 July.\n\nWhen I arrived, my room had not been cleaned: there were used towels in the bathroom and the bin was full. In addition, the air conditioning did not work, and as the temperature was over 35 degrees, I could hardly sleep. The room was also next to the kitchen, so it was very noisy from early in the morning.\n\nI reported these problems at the reception desk on the first evening, but I was told that no other rooms were available, and nothing was repaired.\n\nI paid a high price for a comfortable stay, and I did not receive one. I would therefore be grateful if you could refund the cost of at least two nights.\n\nI look forward to your reply.\n\nYours sincerely,\nAnna Lopez",
  },
  {
    task: "You ordered a birthday present for your mother online, but it arrived two weeks late, after her birthday. Write a letter of complaint to the online shop.",
    model:
      "Dear Sir or Madam,\n\nI am writing to complain about the late delivery of my order (number 77105), a silk scarf that I bought as a birthday present for my mother.\n\nWhen I placed the order on 1 May, your website promised delivery within three days, and I paid an extra fee for fast delivery. However, the parcel did not arrive until 17 May, a week after my mother's birthday. I tracked the parcel every day, but the website did not explain the delay.\n\nThis was very disappointing, as I had nothing to give my mother on her special day.\n\nI would like you to refund the delivery fee of 15 dollars, and I would also appreciate an explanation of what went wrong. I hope that you will improve your service so that other customers do not have the same experience.\n\nYours faithfully,\nZhang Wei",
  },
  {
    task: "You joined a gym, but the classes you were promised are often canceled and the machines are often broken. Write a letter of complaint to the gym manager.",
    model:
      "Dear Mr. Brown,\n\nI am writing to complain about the service at your gym, which I joined in January.\n\nWhen I signed up, I was told that there would be yoga classes every evening. However, in the last month, eight classes were canceled without any warning, and I traveled to the gym for nothing. In addition, two of the running machines have been broken since February, so members often have to wait to use the others.\n\nI pay 60 dollars a month, which is not a small amount for me, and I am not getting the service I was promised. I spoke to a member of staff about this, but nothing has changed.\n\nI would like you to repair the machines and publish the class timetable a week in advance. I would also like a discount of 50 percent for this month.\n\nI look forward to hearing from you.\n\nYours sincerely,\nSara Khan",
  },
  {
    task: "You bought a pair of running shoes. After two weeks, the sole came off one of them. The shop refused to give you a refund. Write a letter of complaint to the company that makes the shoes.",
    model:
      "Dear Sir or Madam,\n\nI am writing to complain about a pair of your running shoes, which I bought from a sports shop in Shanghai on 2 April.\n\nAfter only two weeks of normal use, the sole came off the left shoe while I was running. I took the shoes back to the shop with my receipt, but the assistant refused to give me a refund. She said that I must have damaged them myself, which is not true.\n\nThe shoes cost 120 dollars, and the box says that they have a one-year guarantee. I am therefore very disappointed with both the quality of the product and the way I was treated.\n\nI would like you to replace the shoes or refund the full price. I have enclosed a copy of the receipt and a photo of the damaged shoe.\n\nI look forward to your reply.\n\nYours faithfully,\nChen Yu",
  },
  {
    task: "Your new washing machine was installed last week. It leaks water onto the kitchen floor every time you use it. Write a letter of complaint to the store where you bought it.",
    model:
      "Dear Customer Service Manager,\n\nI am writing to complain about a washing machine that I bought from your store on 15 September. It was delivered and installed on 20 September.\n\nSince then, the machine has leaked water onto the kitchen floor every time I have used it. On one occasion, the water reached the hall and damaged a rug. As I have two small children, I need to wash clothes every day, so this is a serious problem.\n\nI called your store on 22 September, and I was promised that an engineer would come within two days. Unfortunately, nobody came and nobody called me back.\n\nThe machine is still under warranty. I would therefore like you to replace it with a new one as soon as possible, and to pay for the damaged rug.\n\nI look forward to hearing from you soon.\n\nYours faithfully,\nMaria Silva",
  },
  {
    task: "You went to a restaurant for a family celebration. You waited an hour for your food, and some dishes were cold. Write a letter of complaint to the restaurant manager.",
    model:
      "Dear Manager,\n\nI am writing to complain about the meal my family had at your restaurant on Saturday 8 June to celebrate my grandmother's eightieth birthday.\n\nAlthough we had booked a table two weeks in advance, we had to wait over an hour for our food. When it finally arrived, two of the dishes were cold, and one was not what we had ordered. When I mentioned this to the waiter, he was rude and did not apologize.\n\nThis was a very special day for our family, and the evening was spoiled. We paid 250 dollars for the meal, and I do not feel that we received the service we deserved.\n\nI would like you to refund part of the cost of the meal. I would also be grateful if you could speak to your staff about how they treat customers.\n\nI look forward to your reply.\n\nYours sincerely,\nTom Walker",
  },
  {
    task: "You signed up for an online English course, but the videos often do not load and the teacher never answers your questions. Write a letter of complaint to the company.",
    model:
      "Dear Sir or Madam,\n\nI am writing to complain about the online English course that I paid for on 1 October.\n\nYour website promised weekly video lessons and answers from a teacher within 24 hours. However, since I started, about half of the videos have not loaded, even though my internet connection is fast. I have also sent the teacher five questions, and I have not received a single answer.\n\nI chose your course because I need to pass an English exam in December, and I am now worried that I will not be ready. I have emailed your help desk twice, but I have only received automatic replies.\n\nI would like you either to fix the problems with the videos and make sure that my questions are answered, or to give me a full refund of 180 dollars.\n\nI look forward to hearing from you soon.\n\nYours faithfully,\nYuki Tanaka",
  },
  {
    task: "You bought tickets for a concert, but when you arrived, your seats had been sold to other people. Write a letter of complaint to the ticket company.",
    model:
      "Dear Sir or Madam,\n\nI am writing to complain about what happened at the concert in the City Arena on Friday 14 February.\n\nI bought two tickets on your website in December, for seats in row C. When my friend and I arrived, we found two other people in our seats who had exactly the same tickets. The staff at the arena could not help us, and we had to stand at the back for the whole concert.\n\nThe tickets cost 90 dollars each, and we had been looking forward to the concert for months. It was very disappointing, and standing for three hours was tiring.\n\nI have attached copies of our tickets and the email that confirmed our booking. I would like a full refund of 180 dollars, and I would also like to know how this mistake happened.\n\nI look forward to your reply.\n\nYours faithfully,\nDavid Park",
  },
  {
    task: "The bus company in your town changed its timetable. Buses are now often late and very crowded, and you are late for school or work. Write a letter of complaint to the bus company.",
    model:
      "Dear Sir or Madam,\n\nI am writing to complain about the number 12 bus service since the new timetable started on 1 March.\n\nBefore the change, there was a bus every ten minutes in the morning. Now there is only one every twenty minutes, and the buses are often late. As a result, they are so crowded that they sometimes do not stop because there is no space. In the last two weeks, I have been late for school four times, and my teacher has warned me.\n\nMany other passengers on my route have the same problem, especially older people who cannot stand for long.\n\nI would therefore like to ask you to put more buses on the route between seven and nine in the morning. I would also be grateful if you could explain why the timetable was changed.\n\nI look forward to hearing from you.\n\nYours faithfully,\nNina Rossi",
  },
  {
    task: "You booked a holiday apartment through a website. When you arrived, it was much smaller than in the photos and far from the beach. Write a letter of complaint to the website.",
    model:
      "Dear Sir or Madam,\n\nI am writing to complain about an apartment in Sanya that I booked through your website for the week of 5 to 12 August (booking number 55920).\n\nThe advertisement described a large apartment with two bedrooms, five minutes from the beach. In fact, it had only one small bedroom, and the beach was a thirty-minute walk away. The photos on your website were clearly of a different, much nicer apartment.\n\nAs there were four of us, two people had to sleep on the sofa, and we spent a lot of money on taxis to the beach. I contacted the owner, but he refused to help.\n\nI believe your website is responsible for the information it advertises. I would therefore like a refund of at least half the price, and I would ask you to remove the false photos.\n\nI look forward to your reply.\n\nYours faithfully,\nLiu Fang",
  },
  {
    task: "Your mobile phone company charged you for calls and data that you did not use. Write a letter of complaint to the company.",
    model:
      "Dear Customer Service Team,\n\nI am writing to complain about my phone bill for April (account number 3305-118).\n\nI have a monthly plan that includes unlimited calls and 20 gigabytes of data for 30 dollars. However, my April bill was 95 dollars. It includes charges for international calls that I did not make and for extra data, although the app on my phone shows that I used only 12 gigabytes.\n\nI called your help line on 5 May, and the assistant agreed that there was a mistake. She promised that the bill would be corrected, but I have just received a reminder asking me to pay the full amount.\n\nI would like you to correct the bill and refund the extra 65 dollars, which has already been taken from my bank account. Please also confirm in writing that the problem has been solved.\n\nI look forward to hearing from you soon.\n\nYours faithfully,\nAhmed Hassan",
  },
];

const complaintLetter = judgedTopic({
  id: "writing-a-letter-of-complaint",
  title: t("Writing a Letter of Complaint", "写投诉信"),
  summary: t(
    "Write a formal letter of 120 to 180 words about a product or a service: what happened, why it is a problem, and what you want done, firmly but politely.",
    "写一封 120 到 180 词的正式信，投诉一件商品或一项服务：发生了什么，为什么是个问题，你希望怎么解决，态度坚定而有礼貌。",
  ),
  intro: t(
    "An effective complaint letter stays calm and factual: state the order or stay upfront, lay out the exact problem and its impact, and close with a clear, polite request (*I would therefore like a full refund*). Facts persuade far better than anger.",
    "有效的投诉信冷静而重事实：开篇交代订单或消费记录，条理清楚地说明问题和影响，最后提出明确而礼貌的诉求（*I would therefore like a full refund*）。事实远比情绪更有说服力。",
  ),
  prerequisites: ["writing-a-formal-email"],
  encompasses: [{ topic: "writing-a-formal-email", weight: 0.3 }],
  criteria: ["b1-complaint-what-happened", "b1-complaint-why-a-problem", "b1-complaint-what-you-want", "b1-formal-register"],
  point: {
    id: "complaint",
    title: t("What happened, why it matters, what you want", "发生了什么，为什么重要，你想要什么"),
    explanation: t(
      "A letter of complaint is formal. Plan it in four short paragraphs:\n\n1. **Why you are writing**: *I am writing to complain about the laptop that I ordered on 3 March (order number 48213).*\n2. **What happened**, with facts: dates, places, prices and what you have already done.\n3. **Why it is a problem** for you: *I cannot use it for my university work.*\n4. **What you want** them to do, clearly: *I would like you to send me a new one within a week. If this is not possible, I would like a full refund.*\n\n> **Watch out.** Stay firm but polite—avoid angry insults and contractions (*I am*, not *I'm*), and match the closing to the opening (*Dear Sir or Madam* → *Yours faithfully*; named recipient → *Yours sincerely*).",
      "投诉信是正式的信。分四个短段落来写：\n\n1. **写信的原因**：*I am writing to complain about the laptop that I ordered on 3 March (order number 48213).*\n2. **发生了什么**，写事实：日期、地点、价格，以及你已经做了什么。\n3. **为什么对你是个问题**：*I cannot use it for my university work.*\n4. **你希望对方怎么做**，说清楚：*I would like you to send me a new one within a week. If this is not possible, I would like a full refund.*\n\n> **注意。** 态度坚定但保持礼貌——不用粗鲁发泄或缩写（写 *I am* 不写 *I'm*），并让落款与称呼配对（*Dear Sir or Madam* 配 *Yours faithfully*；写了人名配 *Yours sincerely*）。",
    ),
  },
  question: t(
    "Write a formal letter of complaint of 120 to 180 words in English. Say what happened, why it is a problem and what you want the reader to do, firmly but politely.",
    "用英语写一封 120 到 180 词的正式投诉信。说明发生了什么，为什么是个问题，你希望对方怎么做，态度坚定而有礼貌。",
  ),
  bank: complaintBank,
  limits: { minWords: 100, maxChars: 1600 },
  what: t("letter of complaint", "投诉信"),
});

/** topics are the topics of the unit Money and Consumers. */
export const topics: readonly TopicDef[] = [
  finance.topic,
  consumers.topic,
  value.topic,
  giving.topic,
  online.topic,
  gerundsAndInfinitives,
  complaintLetter,
];

/** vocabulary are the words the unit Money and Consumers teaches. */
export const vocabulary: readonly WordBatch[] = [finance.batch, consumers.batch, value.batch, giving.batch, online.batch];
