// Grade 7: the batches of words of the last five units and of public health, from money and markets, stories of
// tomorrow and voices for change to flight and the news.

import { t } from "@ga/content";
import type { BatchSpec } from "../batch.ts";
import { batch } from "../grade-5/batches.ts";

const publicHealth = batch(
  "words-of-public-health",
  ["Words of Public Health", "公共卫生的词"],
  ["public health and the fight against disease", "公共卫生与抗击疾病"],
  `
  sanitation|keeping places clean and healthy, especially by removing waste and providing clean water|卫生设施，环境卫生|The new sewers and clean water pipes brought the city modern ___.|Without ___, waste seeps into the wells and diseases spread through dirty water.|Workers who collect rubbish and clean the drains keep the town's ___ working.|quarantine,mortality
  mortality|the number of deaths in a group or a time|死亡率|Child ___ fell when clean water reached the villages, and far fewer babies died.|Forty of every hundred people who caught the fever died; its ___ was shocking.|Doctors counted the deaths in each part of the city to compare ___.|epidemic,pathogen
  prevention|stopping something bad before it happens|预防|___ is better than cure, so stop the illness before it starts.|Fire ___ starts with working alarms and no candles left burning.|Washing hands is the simplest form of ___, since it stops germs before they make you sick.|remedy,therapy
  disinfect|to clean something with a substance that kills germs|消毒|Nurses ___ the beds with a strong cleaner between patients.|We ___ the kitchen tables with a spray that kills germs.|Always ___ a cut with an antiseptic wipe before you cover it.|vaccinate,inject|disinfected,disinfects
  pathogen|a germ, such as a virus or a bacterium, that causes disease|病原体|A ___ entered the body through a small cut and began to multiply.|Under the microscope, scientists found the ___, a single bacterium that caused the fever.|Soap breaks apart the outer layer of a ___ and stops it from making you ill.|antibody,carrier|pathogens
  smallpox|a deadly disease, now ended, that caused fever and spots on the skin|天花|___ covered its victims in spots and killed millions before a vaccine was found.|In 1980, the world was declared free of ___, the first human disease ever ended.|Milkmaids who had caught cowpox, a mild cousin of ___, never caught the deadly disease itself.|cholera,pathogen
  cholera|a disease spread by dirty water that causes severe sickness of the stomach|霍乱|John Snow proved that ___, a disease of the stomach, spread through the water of one pump.|___ spread fast through dirty water and caused severe stomach sickness.|After the city began boiling its drinking water, the ___ outbreaks of stomach sickness stopped.|smallpox,sanitation
  vaccinate|to give someone a vaccine to protect them from a disease|接种疫苗|Doctors ___ babies against measles so they never catch it.|The clinic will ___ everyone over sixty against the flu first.|It is important to ___ pets against rabies.|disinfect,inject|vaccinated,vaccinates
  inject|to put a liquid into the body with a needle|注射|The nurse will ___ the medicine into your arm.|With a thin needle, the doctor will ___ insulin under the skin.|Some snakes ___ poison through their hollow fangs when they bite.|vaccinate,disinfect|injected,injects
  fatal|causing death|致命的|Most patients died within days, so the disease was ___ without treatment.|The fall from the cliff could have been ___, but he lived with only a broken arm.|One ___ mistake on the ice killed two climbers and ended the expedition.|contagious,chronic
  `,
  "context-clues",
  {
    intro: t(
      "When **cholera** broke out, the town learned that dirty water carried the **pathogen**, so it built sewers for better **sanitation**, and the **mortality** of the disease fell. These ten words help you read about how people stop diseases and save lives.",
      "霍乱（**cholera**）暴发时，小镇发现是脏水携带了病原体（**pathogen**），于是修建下水道改善卫生（**sanitation**），这种病的死亡率（**mortality**）随之下降。这十个词帮你读懂人们怎样阻止疾病、挽救生命。",
    ),
    watchOut: {
      meanings: t(
        "Tell **sanitation** (sewers, drains and clean water that keep a place healthy) apart from **prevention** (stopping any harm before it starts) and **mortality** (how many people die).",
        "分清 **sanitation**（让环境卫生的下水道、排水沟和清水）、**prevention**（在任何危害发生前加以阻止）和 **mortality**（死亡的人数）。",
      ),
      use: t(
        "Tell **vaccinate** (protect someone *against* a disease) apart from **inject** (put any liquid in with a needle) and **disinfect** (kill germs on a surface or a wound): a nurse may inject a vaccine to vaccinate you after she disinfects your arm.",
        "分清 **vaccinate**（让人对某种疾病获得免疫）、**inject**（用针注入任何液体）和 **disinfect**（杀灭物体表面或伤口上的病菌）：护士先给你的手臂消毒，再注射疫苗为你接种。",
      ),
      spelling: t(
        "Watch **vaccinate** (double *c*: the first says /k/, the second /s/), **cholera** (*ch* saying /k/), and **smallpox** (one word ending in *x*).",
        "注意 **vaccinate** 的双写 **c**（第一个读 /k/，第二个读 /s/）、**cholera** 中读 /k/ 的 **ch**，以及连写成一个词、以 **x** 结尾的 **smallpox**。",
      ),
    },
    notes: `
      sanitation|new sewers and clean water pipes in a city|waste seeping into wells and diseases spreading through dirty water|workers collecting rubbish and cleaning the drains|sanitation keeps places clean by removing waste; quarantine keeps sick people apart|sanitation 靠清除废物保持环境卫生；quarantine 把病人隔开|quarantine is keeping sick people or animals apart for a time, not removing waste or bringing clean water|quarantine 指把人或动物隔离一段时间，不是清除废物、供应清水|mortality is the number of deaths in a group, not the pipes, drains and clean water that keep a place healthy|mortality 指一个群体的死亡人数，不是保持卫生的管道、下水道和清水|san · i · ta · tion|sani- as in sanitary, then -tion saying /shun/|开头 sani- 和 sanitary 相同，结尾 -tion 读 /ʃən/
      mortality|child deaths falling when clean water reached the villages|a fever that killed forty of every hundred people who caught it|doctors counting the deaths in each part of a city|mortality counts deaths; an epidemic is the spread of a disease|mortality 统计死亡人数；epidemic 指疾病的流行|epidemic is the fast spread of a disease among many people, not a count of how many of them die|epidemic 指疾病在许多人中迅速传播，不是统计其中死了多少人|pathogen is a germ that causes disease, not the number of deaths in a group|pathogen 是致病的病菌，不是一个群体的死亡人数|mor · tal · i · ty|mortal (able to die) + -ity, with the stress moving to -tal-|mortal（会死的）加 -ity，重音移到 -tal-
      prevention|stopping an illness before it starts, which is better than a cure|alarms and care with candles stopping fires before they start|hand washing stopping germs before they make you sick|prevention stops a problem before it happens; a remedy cures it afterwards|prevention 在问题发生前阻止它；remedy 在问题发生后治好它|remedy is something that cures an illness after it has started, not something that stops it from starting|remedy 是病发后用来治愈的东西，不是在发病前阻止它|therapy is a treatment that helps someone recover over time, which comes after the harm, not before it|therapy 是帮助人慢慢康复的治疗，发生在伤害之后而不是之前|pre · ven · tion|prevent + -ion: the t of prevent stays, so -tion, not -sion|prevent 加 -ion，保留 t，写成 -tion 不是 -sion
      disinfect|nurses cleaning beds with a strong cleaner between patients|kitchen tables sprayed to kill germs|a cut wiped with an antiseptic before it is covered|disinfect kills germs on things and wounds; vaccinate protects a person from a disease|disinfect 杀灭物体或伤口上的病菌；vaccinate 让人对疾病有免疫力|vaccinate means give a person or an animal a vaccine against a disease, not clean a surface or a wound to kill germs|vaccinate 指给人或动物接种疫苗，不是清洁表面或伤口来杀菌|inject means put a liquid into the body with a needle, not wipe or spray something to kill the germs on it|inject 指用针把液体注入体内，不是擦拭或喷洒来杀灭表面的病菌|dis · in · fect|dis- + infect, with one s, and c before the final t|dis- 加 infect，只有一个 s，结尾 t 前是 c
      pathogen|a germ entering through a cut and starting to multiply|a single bacterium found under a microscope causing a fever|a germ whose outer layer soap breaks apart|pathogen is a germ that causes disease; an antibody is what the body makes to fight it|pathogen 是致病菌；antibody 是身体产生来对抗它的抗体|antibody is a substance the body makes to fight a germ, not the germ that makes people ill|antibody 是身体产生、用来对抗病菌的物质，不是让人生病的病菌|carrier is a person or animal that passes a germ on, not the tiny germ itself|carrier 是传播病菌的人或动物，不是病菌本身|path · o · gen|patho- (disease) + -gen (maker), with th, not t|patho-（疾病）加 -gen（产生者），是 th 不是 t
      smallpox|a disease covering its victims in spots and killing millions before a vaccine|the first human disease the world was declared free of, in 1980|the deadly disease whose mild cousin is cowpox|smallpox covers the skin in spots and has been ended; cholera sickens the stomach and still spreads through dirty water|smallpox 使皮肤长满痘疮，已被消灭；cholera 损害肠胃，至今仍经脏水传播|cholera is a stomach disease spread by dirty water, not a disease of skin spots that the world has ended|cholera 是经脏水传播的肠胃疾病，不是已被消灭、长满痘疮的病|pathogen is any germ that causes disease, not the name of one disease with spots on the skin|pathogen 泛指致病的病菌，不是某一种长痘疮的疾病的名字|small · pox|small + pox, written as one word, ending in x, not cks|small 加 pox，连写成一个词，结尾是 x 不是 cks
      cholera|a stomach disease John Snow proved spread through the water of one pump|a disease spreading through dirty water and causing severe stomach sickness|outbreaks of stomach sickness stopping once drinking water was boiled|cholera spreads through dirty water and attacks the stomach; smallpox spreads between people and covers the skin in spots|cholera 经脏水传播、损害肠胃；smallpox 在人与人之间传播、使皮肤长痘|smallpox is a disease of fever and skin spots spread from person to person, not a stomach sickness carried by dirty water|smallpox 是发烧、皮肤长痘并在人际传播的病，不是经脏水传播的肠胃病|sanitation is keeping places clean with sewers and clean water, which stops this disease rather than being it|sanitation 指用下水道和清水保持卫生，它阻止这种病，而不是病本身|chol · er · a|ch saying /k/, and the ending -era|ch 读 /k/，结尾是 -era
      vaccinate|doctors protecting babies against measles so they never catch it|a clinic protecting everyone over sixty against the flu|pets protected against rabies|vaccinate protects someone against a disease; inject only names putting a liquid in with a needle|vaccinate 让人对某种疾病获得免疫；inject 只说明用针注入液体|disinfect means clean something to kill the germs on it, not protect a person or an animal against a disease|disinfect 指清洁物品杀灭病菌，不是让人或动物对疾病有免疫力|inject means put any liquid into the body with a needle; by itself it does not mean protect someone against a disease|inject 指用针注入任何液体，本身没有“预防某种疾病”的意思|vac · ci · nate|double c: the first says /k/, the second says /s/|双写 c：第一个读 /k/，第二个读 /s/
      inject|a nurse putting medicine into an arm|a doctor putting insulin under the skin with a thin needle|snakes pushing poison through hollow fangs|inject means put a liquid into the body with a needle or a fang; vaccinate means give a vaccine to protect against a disease|inject 指用针或毒牙把液体注入体内；vaccinate 指接种疫苗预防疾病|vaccinate means protect a person against a disease, not push a liquid such as medicine, insulin or poison into the body|vaccinate 指让人对疾病有免疫力，不是把药、胰岛素或毒液注入体内|disinfect means clean something to kill the germs on it, not push a liquid into the body|disinfect 指清洁物品以杀菌，不是把液体注入体内|in · ject|in- + -ject (throw), as in reject and project|in- 加 -ject（投），和 reject、project 一样
      fatal|a disease that killed most patients within days|a fall from a cliff that could have killed him|one mistake on the ice that killed two climbers|fatal means causing death; contagious means able to spread to others|fatal 指致命的；contagious 指会传染的|contagious means able to spread from one person to another, which says nothing about causing death|contagious 指能在人与人之间传播，并不表示会致死|chronic means lasting a long time or coming back often, not causing death|chronic 指长期的或反复发作的，不表示致命|fa · tal|fate drops its e and adds -al|fate 去掉 e 加 -al
    `,
  },
);

const money = batch(
  "words-of-money",
  ["Words of Money", "金钱的词"],
  ["money: earning, saving and borrowing", "金钱：挣钱、存钱与借钱"],
  `
  loan|money that someone borrows and must pay back|贷款，借款|She took out a ___ from the bank to buy a car and repays it each month.|The bank gave the farmer a ___ for new seeds, which he must repay after the harvest.|The bank lent him a ___ of five thousand dollars, to be paid back in two years.|debt,interest|loans
  interest|money paid for borrowing money, or earned on money saved|利息|The bank pays ___ on money in a savings account.|If you borrow, you pay ___ on top of the loan.|The ___ on the loan was five percent a year.|income,inflation
  income|money that a person or a business receives, especially from work|收入|Her ___ comes from three places: her job, the rent from a flat and her savings.|Most of the family's ___ came from selling eggs and milk from the farm.|A business that sells more has a higher ___ to pay for its costs.|wages,expense|incomes
  inflation|a general rise in prices, so that money buys less|通货膨胀|Because of ___, bread costs more than it did last year.|When ___ is high, the same ten dollars buys less food each month.|The government tried to stop ___ before prices doubled again.|interest,investment
  investment|money put into something in the hope of making more money|投资|Buying the shop was a good ___: it now earns her twice what she paid.|Money spent on education is an ___ that pays off for years.|The company made a large ___ in new machines to make more goods.|savings,loan|investments
  debt|money that you owe someone|债务|He owed money to three friends and worked two jobs to get out of ___.|The country was deep in ___ after the war.|She was careful never to go into ___.|loan,tax|debts
  tax|money that people and businesses must pay to the government|税|The ___ on gasoline pays for the roads.|Workers pay ___ to the government on what they earn.|The city raised the ___ to build a new school.|wages,debt|taxes
  wages|money paid to a worker, usually by the hour or the week|工资，工钱|The café pays her ___ every Friday for the hours she worked.|The workers went on strike for higher ___ per hour.|He saved the ___ from his summer job at the pool.|revenue,tax
  expense|money spent on something; a cost|费用，开支|Rent is the family's biggest ___.|Fuel is a big ___ for a family that drives to work every day.|Write down every ___ this month, from bus fares to lunches.|income,investment|expenses
  savings|money that has been kept to use later|储蓄，存款|She dropped a coin into her ___ jar every week.|He keeps his ___ safe in the bank for a rainy day.|They used their ___, kept over three years, to pay for the trip.|investment,expense
  `,
  "context-clues",
  {
    intro: t(
      "Maya's **wages** from the café are her only **income**, so she puts a little into **savings** each week and stays out of **debt**. These ten words help you follow where money comes from, where it goes, and what borrowing costs.",
      "玛雅在咖啡馆挣的工钱（**wages**）是她唯一的收入（**income**），所以她每周存一点储蓄（**savings**），从不欠债（**debt**）。这十个词帮你弄清钱从哪里来、到哪里去，以及借钱要付出什么。",
    ),
    watchOut: {
      meanings: t(
        "Tell **loan** (the money you borrow) apart from **debt** (the money you still owe) and **interest** (the extra you pay for borrowing): you take out a loan, then you are in debt until you pay it back with interest.",
        "分清 **loan**（借来的钱）、**debt**（还欠着的钱）和 **interest**（借钱要多付的钱）：你先贷款，在连本带息还清之前一直负债。",
      ),
      use: t(
        "Tell **income** (all the money coming in, from any source) apart from **wages** (pay for hours of work only) and **expense** (money going out).",
        "分清 **income**（任何来源的全部进账）、**wages**（只指按工作付的工钱）和 **expense**（花出去的钱）。",
      ),
      spelling: t(
        "Watch the silent **b** in **debt**, the *-ense* ending of **expense**, and the three written syllables of **interest** (*in-ter-est*).",
        "注意 **debt** 中不发音的 **b**、**expense** 的结尾 *-ense*，以及 **interest** 写出来的三个音节（*in-ter-est*）。",
      ),
    },
    notes: `
      loan|a car bought with borrowed money repaid each month|money a bank lent a farmer for seeds, to be repaid after the harvest|five thousand dollars a bank lent, to be paid back in two years|a loan is the money you borrow; a debt is what you still owe|loan 是借来的钱；debt 是还欠着的钱|debt is the state of owing money, which you fall into, not a sum a bank hands you to spend|debt 是欠钱的状态，是人陷入的处境，不是银行交给你花的一笔钱|interest is the extra money paid for borrowing, not the borrowed sum itself|interest 是借钱要多付的那部分钱，不是借来的本金|l · oan|oa saying long o; do not write lone, which means alone|oa 读长音 o；别写成表示“单独”的 lone
      interest|a bank paying extra on money in a savings account|extra money paid on top of a loan|five percent a year charged on a loan|interest is the price of borrowing money; inflation is a rise in all prices|interest 是借钱的代价；inflation 是物价普遍上涨|income is money a person earns, mostly from work, not the extra charged or paid on borrowed or saved money|income 指人主要靠工作挣得的钱，不是借款或存款上多出的钱|inflation is a general rise in prices across a country, not a charge on one loan or one account|inflation 指一个国家物价普遍上涨，不是一笔贷款或存款的利息|in · ter · est|three written syllables, in-ter-est, though often said as two; not intrest|写作三个音节 in-ter-est，口语常读成两个音节，别写成 intrest
      income|money coming from a job, the rent of a flat and savings|money a family received from selling eggs and milk|money a business takes in that pays for its costs|income is all the money coming in; wages are only the pay for work|income 指所有进账；wages 只指工作的报酬|wages are the pay a worker gets for work, not money from rent, savings or selling farm goods|wages 只是工人干活得到的报酬，不包括房租、储蓄或卖农产品的钱|expense is money going out to pay for something, the opposite of money coming in|expense 是花出去的钱，和收进来的钱正相反|in · come|in + come, the money that comes in|in 加 come，即“进来的钱”
      inflation|bread costing more than it did last year|ten dollars buying less food each month|a government trying to stop prices doubling again|inflation is prices rising everywhere; interest is the charge for borrowing|inflation 是物价普遍上涨；interest 是借钱的费用|interest is money paid for borrowing or earned on savings, not a rise in the prices of things like bread|interest 是借款要付或存款能得的钱，不是面包等东西涨价|investment is money put into something to make more money, not prices going up so that money buys less|investment 是为赚钱而投入的钱，不是物价上涨、钱变得不值钱|in · fla · tion|in + flate (blow up) + -ion: drop the e and write -tion|in 加 flate（吹胀）再加 -ion：去掉 e，写成 -tion
      investment|buying a shop that now earns twice what it cost|money spent on education that pays off for years|a company putting money into new machines to make more goods|an investment is money put to work to earn more; savings are money kept for later|investment 是投入以求增值的钱；savings 是留着以后用的钱|savings are money kept safe to use later, not money put into a shop, a school or a machine in the hope of earning more|savings 指存起来以后用的钱，不是投入店铺、教育或机器以求赚更多的钱|loan is money borrowed that must be paid back, not money put into something to earn more|loan 是借来必须归还的钱，不是为了赚钱而投入的钱|in · vest · ment|invest + -ment, keeping the t of invest|invest 加 -ment，保留 invest 的 t
      debt|owing money to three friends and working two jobs to get out of it|a country owing huge sums after a war|someone careful never to owe money|debt is the state of owing; a loan is the money you were lent|debt 是欠钱的状态；loan 是别人借给你的钱|loan is the sum lent to you, which you take out, not a state you can be deep in or get out of|loan 指借给你的那笔钱，人不会“陷入”或“走出”它|tax is money everyone must pay the government, not money owed because you borrowed it|tax 是人人都要交给政府的钱，不是因借钱而欠下的|de(b) · t|a silent b before t, as in doubt|t 前的 b 不发音，和 doubt 一样
      tax|money charged on gasoline that pays for the roads|money workers pay to the government on what they earn|money a city raised to build a new school|tax is money paid to the government; wages are money paid to a worker|tax 是交给政府的钱；wages 是付给工人的钱|wages are money a worker receives for work, not money everyone pays to the government|wages 是工人干活得到的钱，不是交给政府的钱|debt is money owed after borrowing, not money the government collects to pay for roads and schools|debt 是借钱后欠下的钱，不是政府收来修路建学校的钱|t · ax|x saying /ks/; the plural adds -es: taxes|x 读 /ks/，复数加 -es：taxes
      wages|a café paying her every Friday for the hours she worked|workers striking for more pay per hour|pay a teenager earned at a summer job at the pool|wages are pay for a worker's hours; revenue is all the money a business takes in from sales|wages 是按工时付给工人的钱；revenue 是企业的全部销售收入|revenue is the money a business takes in from selling things, not the pay a worker gets for hours of work|revenue 是企业卖东西收进的钱，不是工人按工时得到的报酬|tax is money paid to the government, not money paid to a worker for work|tax 是交给政府的钱，不是付给工人的工钱|wa · ges|wage + -s, with a as in age|wage 加 -s，a 读作 age 中的 a
      expense|rent being a family's biggest cost|fuel as a big cost for a family that drives to work|bus fares and lunches written down as spending|an expense is money going out; income is money coming in|expense 是支出；income 是收入|income is money coming in, the opposite of money spent on rent, fuel or fares|income 是收进的钱，和花在房租、油费或车费上的钱相反|investment is money put into something to earn more, not everyday spending on rent, fuel or lunches|investment 是为赚钱而投入的钱，不是房租、油费、午饭这类日常开销|ex · pense|ending in -ense with an s, not -ence|结尾是 -ense，用 s 不用 c
      savings|a jar getting a coin every week|money kept safe in the bank for a rainy day|money kept over three years and used to pay for a trip|savings are money kept for later; an investment is money put to work to earn more|savings 是留着以后用的钱；investment 是为增值而投入的钱|investment is money put into a business or a plan in the hope of earning more, not money simply kept safe to use later|investment 指投入生意或计划以求赚更多的钱，不是存着以后用的钱|expense is money spent on something, the opposite of money kept for later|expense 是花掉的钱，和存起来以后用的钱相反|sav · ings|save drops its e before -ing, then adds -s|save 去掉 e 加 -ing，再加 -s
    `,
  },
);

const business = batch(
  "words-of-business",
  ["Words of Business", "商业的词"],
  ["businesses and how they work", "企业及其运作"],
  `
  entrepreneur|a person who starts a business and takes the risk of it|企业家，创业者|The young ___ started her own business by selling cakes at a market stall.|An ___ risks her own money when she opens a new business.|He became an ___ at sixteen, when he started a bike repair business.|shareholder,competitor|entrepreneurs
  revenue|the money a business takes in from selling things|收入，营业额|The shop's ___ from toy sales doubled in December.|Ticket sales were the club's main ___.|Every sale at the till adds to the shop's ___.|expense,wages
  competitor|a person or company trying to win or sell more than another|竞争者|The bakery lost half its buyers when a ___ opened a cheaper shop across the street.|Every ___ in the race tried to finish first.|Our main ___ sells the same shoes for less, so we must lower our prices.|customer,shareholder|competitors
  monopoly|complete control of a product or service by one company|垄断|With a ___ on salt, the king could set any price he liked.|The law broke up the railroad's ___ so that other companies could run trains too.|When one company has a ___, customers have no choice.|franchise,corporation|monopolies
  retail|the sale of goods to the public in shops|零售|She works in ___, selling shoes one pair at a time to shoppers.|The ___ price on the tag is higher than what the shop paid.|Online shopping changed ___: people now buy single shirts at home instead of in stores.|wholesale,franchise
  wholesale|the sale of goods in large amounts to shops, which then sell them to the public|批发|The shop buys rice ___ in huge sacks and sells it by the bag.|___ prices are lower than shop prices.|The farmer sells his apples by the ton to a ___ market, which sells them on to shops.|retail,monopoly
  franchise|the right to sell a company's goods or services under its name|特许经营权|He bought a ___ of a famous burger chain and opened a shop under its name.|Each ___ must follow the company's rules to keep using its name.|She runs a ___ of a coffee chain, so her shop uses the chain's name and recipes.|monopoly,corporation|franchises
  shareholder|a person who owns part of a company|股东|Each ___ who owns part of the company gets a vote at the yearly meeting.|The company sent every ___ a report on how their shares had done.|She became a ___ when she bought ten shares.|entrepreneur,customer|shareholders
  customer|a person who buys goods or services|顾客|The ___ asked the shop assistant for a smaller size.|Every ___ who bought a cake got a free sample.|A happy ___ comes back to buy again.|competitor,shareholder|customers
  corporation|a large company recognized by law as one body|公司，企业|The ___ has offices in twenty countries.|Under the law, a ___ can sign contracts like a person.|She works for a big ___ with thousands of workers.|franchise,revenue|corporations
  `,
  "context-clues",
  {
    intro: t(
      "An **entrepreneur** opened a café, then sold a **franchise** to a friend in the next town; now every **customer** in both towns buys the same muffins, and the **revenue** keeps growing. These ten words help you talk about how businesses start, sell and grow.",
      "一位创业者（**entrepreneur**）开了家咖啡馆，又把特许经营权（**franchise**）卖给邻镇的朋友；如今两个镇的每位顾客（**customer**）都买同样的松饼，营业额（**revenue**）不断增长。这十个词帮你谈论企业怎样创办、销售和发展。",
    ),
    watchOut: {
      meanings: t(
        "Tell **entrepreneur** (the person who starts a business) apart from **shareholder** (a person who owns part of it) and **customer** (a person who buys from it).",
        "分清 **entrepreneur**（创办企业的人）、**shareholder**（拥有企业一部分的人）和 **customer**（向企业购买的人）。",
      ),
      use: t(
        "Tell **retail** (selling single items to shoppers) apart from **wholesale** (selling large amounts to shops): a shop buys wholesale and sells retail.",
        "分清 **retail**（零卖给顾客）和 **wholesale**（大批卖给商店）：商店批发进货，再零售出去。",
      ),
      spelling: t(
        "Watch **entrepreneur** (French *-tre-* and *-eur*), **revenue** (ending in *-ue*), and **franchise** (*-chise* with a silent *e*).",
        "注意 **entrepreneur** 的法语拼法 *-tre-* 和 *-eur*、以 *-ue* 结尾的 **revenue**，以及词尾 **e** 不发音的 **franchise**（*-chise*）。",
      ),
    },
    notes: `
      entrepreneur|a young woman starting her own business with cakes at a market stall|a person risking her own money to open a new business|a sixteen-year-old starting a bike repair business|an entrepreneur starts a business; a shareholder owns part of one|entrepreneur 创办企业；shareholder 拥有企业的一部分|shareholder is someone who owns part of a company by buying shares, not the person who starts a business and takes its risk|shareholder 是买股份拥有公司一部分的人，不是创办企业、承担风险的人|competitor is a rival trying to sell more than another business, not the person who starts one|competitor 是想比别家卖得更多的对手，不是创办企业的人|en · tre · pre · neur|French spelling: -tre-, not -ter-, and the ending -eur|这是法语拼法：-tre- 不是 -ter-，结尾是 -eur
      revenue|money from toy sales doubling in December|ticket sales as a club's main source of money|every sale at the till adding to a shop's takings|revenue is money coming in from sales; an expense is money going out|revenue 是销售带来的进账；expense 是支出|expense is money a business spends, not the money it takes in from sales|expense 是企业花出去的钱，不是卖东西收进的钱|wages are the pay a business gives its workers, not the money customers pay it|wages 是企业付给员工的工钱，不是顾客付给企业的钱|rev · e · nue|ending in -ue, as in avenue|结尾是 -ue，和 avenue 一样
      competitor|a rival opening a cheaper shop across the street and taking half the buyers|a runner trying to finish a race first|a rival selling the same shoes for less|a competitor tries to beat you; a customer buys from you|competitor 想胜过你；customer 向你买东西|customer is someone who buys from a business, not a rival who sells against it or races to win|customer 是向商家买东西的人，不是与之抢生意或比赛的对手|shareholder owns part of a company and wants it to do well, not a rival trying to beat it|shareholder 拥有公司的一部分、盼它发展，不是想打败它的对手|com · pet · i · tor|compete drops its final e and adds -itor, ending in -or, not -er|compete 去掉词尾 e 加 -itor，结尾是 -or 不是 -er
      monopoly|a king controlling all the salt so he could set any price|a railroad's total control broken up so other companies could run trains|one company controlling a product so customers have no choice|a monopoly is control by one seller; a franchise is a right to use a company's name|monopoly 是一家独占；franchise 是使用某公司品牌经营的特许权|franchise is the right to run a shop under another company's name, not complete control of a product by one seller|franchise 是挂别家公司名号经营的权利，不是一家独占某种产品|corporation is a large company recognized by law, which can exist alongside many rivals, not complete control by one company|corporation 是法律认可的大公司，可以与许多对手并存，不等于一家独占|mo · nop · o · ly|mono- (one) + -poly (sell), ending in y; the plural is monopolies|mono-（单一）加 -poly（卖），结尾是 y，复数 monopolies
      retail|working at a shoe store selling one pair at a time to shoppers|the shop price on a tag, higher than what the shop paid|people buying single shirts online instead of in stores|retail sells single items to the public; wholesale sells large amounts to shops|retail 向公众零售；wholesale 向商店大批出售|wholesale is selling large amounts to shops, not selling single items to shoppers|wholesale 指大批卖给商店，不是零卖给顾客|franchise is the right to trade under a company's name, not the selling of goods to the public|franchise 是用某公司名号经营的权利，不是向公众卖货|re · tail|re- + tail, ending in -ail like detail|re- 加 tail，结尾 -ail 和 detail 一样
      wholesale|a shop buying rice in huge sacks and selling it by the bag|prices lower than shop prices|apples sold by the ton to a market that sells them on to shops|wholesale sells large amounts to shops; retail sells small amounts to shoppers|wholesale 大批卖给商店；retail 零卖给顾客|retail is selling single items to the public in shops, not selling large amounts to the shops themselves|retail 指在店里零卖给公众，不是大批卖给商店|monopoly is complete control of a product by one company, not a way of selling in large amounts|monopoly 是一家公司完全控制某种产品，不是大批出售的方式|whole · sale|whole, with a silent w, + sale|whole（w 不发音）加 sale
      franchise|buying the right to run a shop under a famous burger chain's name|shops that must follow the company's rules to keep using its name|a shop that uses a coffee chain's name and recipes|a franchise is the right to trade under a company's name; a corporation is the company itself|franchise 是使用公司品牌经营的权利；corporation 是公司本身|monopoly is complete control of a product by one company, not a right one shop buys to use a chain's name|monopoly 是一家公司独占某种产品，不是单个店铺买来使用连锁品牌的权利|corporation is a whole large company, not the right of one shop to trade under its name|corporation 是整个大公司，不是单个店铺挂它名号经营的权利|fran · chise|-chise saying /chize/, ending in a silent e|-chise 读 /tʃaɪz/，词尾 e 不发音
      shareholder|owners of part of a company voting at its yearly meeting|owners of shares receiving a report on how they had done|a woman buying ten shares in a company|a shareholder owns part of a company; a customer only buys from it|shareholder 拥有公司的一部分；customer 只是买它的东西|entrepreneur is the person who starts a business and takes its risk, not someone who buys shares in a company|entrepreneur 是创办企业、承担风险的人，不是买公司股份的人|customer is someone who buys a company's goods, not someone who owns part of the company|customer 是买公司商品的人，不是拥有公司一部分的人|share · hold · er|share + hold + -er, three parts in one word|share、hold、-er 三部分连成一个词
      customer|a shopper asking for a smaller size|everyone who bought a cake getting a free sample|a happy buyer returning to buy again|a customer buys from a business; a competitor tries to sell against it|customer 向商家购买；competitor 和商家抢生意|competitor is a rival business trying to sell more, not someone who comes in to buy|competitor 是想卖得更多的对手，不是来买东西的人|shareholder owns part of a company, not someone who buys its goods in a shop|shareholder 拥有公司的一部分，不是在店里买东西的人|cus · tom · er|custom + -er, with c and o, not k or a|custom 加 -er，用 c 和 o，不是 k 或 a
      corporation|a company with offices in twenty countries|a company that can sign contracts like a person under the law|a big company with thousands of workers|a corporation is a whole large company; a franchise is one shop's right to use its name|corporation 是整个大公司；franchise 是单个店铺使用其品牌的权利|franchise is one shop's right to use a company's name, not a huge company with offices and thousands of workers|franchise 是单个店铺使用公司品牌的权利，不是有众多办公室和员工的大公司|revenue is the money a business takes in, not the business itself|revenue 是企业收进的钱，不是企业本身|cor · po · ra · tion|corpor- (body) + -ation: one r in the middle, then -tion|corpor-（身体）加 -ation，中间只有一个 r，结尾 -tion
    `,
  },
);

const choices = batch(
  "words-of-choices-and-costs",
  ["Words of Choices and Costs", "选择与代价的词"],
  ["the choices people make with money", "人们在金钱上的选择"],
  `
  incentive|something that makes people want to do something|激励，诱因|The free drink was the ___ that made us choose that café.|The prize was a strong ___ for the children to finish their books.|To get people planting trees, the town offered a cash ___ of twenty dollars a tree.|tradeoff,priority|incentives
  tradeoff|a balance between two things you cannot have at the same time|权衡，取舍|There is a ___ between speed and safety: the faster you go, the less safe you are.|Buying the cheaper bike was a ___: it was heavier.|Every choice has a ___: to gain one thing, you give up another.|incentive,opportunity|tradeoffs
  necessity|something that you must have|必需品|You cannot live without water: it is a ___, while soda is only a treat.|In a freezing winter, a warm coat is a ___, not a luxury.|Medicine is a ___ for a sick child, so the family buys it before anything else.|incentive,value|necessities
  afford|to have enough money to pay for something|买得起，负担得起|We cannot ___ a new car this year.|He saved for months so he could ___ the guitar.|Can the school ___ a trip to the coast?|splurge,cost|afforded,affords
  priority|something that is more important than other things|优先事项|Safety is our first ___, ahead of speed and cost.|Paying the rent is a ___, so it comes before buying games.|Make homework your ___ tonight and do it before television.|opportunity,incentive|priorities
  opportunity|a chance to do something|机会|The summer job is a great ___ to save money.|Don't miss the ___ to see the whales.|She had the ___ to study abroad.|tradeoff,value|opportunities
  cost|the amount of money needed to buy or do something|成本，费用|Each of us must pay two hundred dollars to cover the ___ of the trip.|The ___ of repairing the old car was higher than the car was worth.|The ___ of fixing the roof will be more than a thousand dollars.|value,wages|costs
  value|how much something is worth|价值|Experts say the old coin is worth a lot: its ___ is more than a hundred dollars.|This jacket is good ___: it is worth more than its price.|The new park raised the ___ of the houses around it, so they would sell for more.|cost,necessity
  frugal|careful not to spend more money than needed|节俭的|A ___ shopper compares prices and never pays more than needed.|My grandmother was ___: she mended old socks and wasted nothing.|By being ___ and cooking at home, they saved enough for a holiday.|precious,deliberate
  splurge|to spend a lot of money on something you enjoy|挥霍，大肆花钱|We decided to ___ on a fancy dinner for her birthday.|He saved all year and then decided to ___ on a new game console.|On holiday we like to ___ on one really expensive meal.|afford,deplete|splurged,splurges
  `,
  "context-clues",
  {
    intro: t(
      "Liam wanted a new game, but a winter coat was a **necessity**, so he made the coat his **priority**; he could not **afford** both, and giving up the game was the **tradeoff**. These ten words help you think through choices about money.",
      "利亚姆想买新游戏，可冬衣是必需品（**necessity**），所以他把冬衣当作优先事项（**priority**）；两样他都买不起（**afford**），放弃游戏就是他做出的取舍（**tradeoff**）。这十个词帮你想清楚花钱时的选择。",
    ),
    watchOut: {
      meanings: t(
        "Tell **cost** (what you must pay) apart from **value** (what something is worth): a bargain has a low cost but a high value.",
        "分清 **cost**（需要付的钱）和 **value**（东西值多少）：便宜货花费低，价值却高。",
      ),
      use: t(
        "Tell **frugal** (careful not to spend) apart from **splurge** (spend a lot on a treat) and **afford** (have enough money): a frugal family may splurge once a year on something they can afford.",
        "分清 **frugal**（花钱节省）、**splurge**（为享受大笔花钱）和 **afford**（钱够用）：节俭的家庭也许一年奢侈一次，买他们负担得起的东西。",
      ),
      spelling: t(
        "Watch **necessity** (one *c*, double *s*), **opportunity** (double *p*), and **splurge** (ending in a silent *e*).",
        "注意 **necessity**（一个 **c**、两个 **s**）、**opportunity**（双写 **p**）和词尾 **e** 不发音的 **splurge**。",
      ),
    },
    notes: `
      incentive|a free drink that made people choose a café|a prize that pushed children to finish their books|twenty dollars a tree offered to get people planting|an incentive pushes you to act; a priority is what matters most to you|incentive 促使你行动；priority 是你最看重的事|tradeoff is giving up one thing to get another, not a reward that makes people want to act|tradeoff 指为得到一样而放弃另一样，不是让人想去做事的奖励|priority is the thing that matters most to you, not a reward someone offers to make you act|priority 是你最看重的事，不是别人提供来促使你行动的奖励|in · cen · tive|c saying /s/, and -ive ending in a silent e|c 读 /s/，结尾 -ive 的 e 不发音
      tradeoff|a balance between going fast and staying safe|a cheaper bike that was also heavier|giving up one thing to gain another in every choice|a tradeoff means giving up one thing for another; an opportunity is simply a chance|tradeoff 是有得有失的取舍；opportunity 只是一个机会|incentive is a reward that makes you want to act, not something you must give up to get something else|incentive 是促使你行动的奖励，不是为得到别的而必须放弃的东西|opportunity is a chance to do something, with nothing given up in return|opportunity 只是做某事的机会，并不涉及放弃什么|trade · off|trade + off, written as one word (also trade-off)|trade 加 off，连写为一个词（也可写作 trade-off）
      necessity|water that no one can live without, unlike soda|a warm coat in a freezing winter, not a luxury|medicine a sick child cannot do without|a necessity is something you must have; value is how much something is worth|necessity 是必须拥有的东西；value 是东西值多少|incentive is a reward that makes you want to do something, not something you cannot live without|incentive 是促使你做事的奖励，不是离不开的东西|value is how much something is worth, not a thing you must have|value 是东西的价值，不是必须拥有的东西|ne · ces · si · ty|one c and double s, as in necessary|一个 c、两个 s，和 necessary 一样
      afford|a family without enough money for a new car this year|saving for months to have enough for a guitar|a school asking whether it has enough money for a trip|afford means have enough money for something; splurge means spend a lot on a treat|afford 指钱够买；splurge 指为享受大笔花钱|splurge means spend a lot on something you enjoy, not have enough money to pay for it|splurge 指为享受大手大脚地花钱，不是钱够支付|cost means be the price of something, which a thing does, not a family or a school with money to spend|cost 指某物值多少钱，主语是东西，不是有钱可花的家庭或学校|af · ford|a- + ford, with double f|a- 加 ford，双写 f
      priority|safety coming first, ahead of speed and cost|rent that comes before buying games|homework done before television|a priority is what comes first; an opportunity is a chance|priority 是排在最前面的事；opportunity 是机会|opportunity is a chance to do something, not the thing you put ahead of everything else|opportunity 是做某事的机会，不是排在一切前面的事|incentive is a reward that makes you want to act, not the thing you rank first|incentive 是促使你行动的奖励，不是排在第一的事|pri · or · i · ty|prior (earlier) + -ity; the plural is priorities|prior（在先的）加 -ity，复数 priorities
      opportunity|a summer job as a chance to save money|a chance to see the whales that should not be missed|a chance to study in another country|an opportunity is a chance; a tradeoff is giving up one thing for another|opportunity 是机会；tradeoff 是取舍|tradeoff is a balance where you lose one thing to gain another, not a chance you can take or miss|tradeoff 是有得有失的权衡，不是可以抓住或错过的机会|value is how much something is worth, not a chance to do something|value 是东西的价值，不是做事的机会|op · por · tu · ni · ty|double p, and -tun- in the middle|双写 p，中间是 -tun-
      cost|two hundred dollars each person must pay to cover a trip|repairs that would be more than an old car was worth|the money needed to fix a roof|cost is what you must pay; value is what something is worth|cost 是需要付出的钱；value 是东西值多少|value is how much a thing is worth, not the amount of money you must pay to buy or do something|value 是东西本身值多少，不是买东西或做事需要付的钱|wages are the money a worker is paid for work done, not the money you must pay to buy or do something|wages 是工人干活得到的报酬，不是买东西或做事要付的钱|c · ost|o saying short o, then -st|o 读短音，结尾是 -st
      value|an old coin experts say is worth more than a hundred dollars|a jacket worth more than its price|houses that would sell for more after a new park opened|value is what something is worth; cost is what you pay for it|value 是东西值多少；cost 是买它要付多少|cost is the money you pay to buy or do something, not how much a thing is worth|cost 是买东西或做事要付的钱，不是东西本身值多少|necessity is something you must have, not how much a thing is worth|necessity 是必须拥有的东西，不是东西的价值|val · ue|ending in -ue, like continue|结尾是 -ue，和 continue 一样
      frugal|a shopper comparing prices and never paying more than needed|a grandmother mending old socks and wasting nothing|a family cooking at home to save for a holiday|frugal describes a person careful with money; precious describes a thing of great value|frugal 形容人花钱节省；precious 形容东西珍贵|precious describes a thing of great value, not a person who is careful not to spend|precious 形容东西珍贵，不形容花钱谨慎的人|deliberate describes an act done on purpose after thought, not a habit of spending as little as possible|deliberate 形容经过考虑、有意做的事，不是花钱尽量节省的习惯|fru · gal|fru- + -gal, ending in -al, not -le|fru- 加 -gal，结尾是 -al 不是 -le
      splurge|spending a lot on a fancy birthday dinner|spending a year's savings on a game console|spending freely on one very expensive holiday meal|splurge means spend a lot on a treat; afford means have enough money|splurge 指为享受大笔花钱；afford 指钱够用|afford means have enough money to pay for something, not spend a large amount on a treat for fun|afford 指钱够买，不是为了享受花一大笔钱|deplete means use up most of a supply, such as water or fish, not spend happily on a treat|deplete 指把水、鱼等储备耗掉大半，不是开心地花钱享受|spl · urge|spl- blend, then -urge as in surge, ending in a silent e|开头 spl- 连读，-urge 同 surge，词尾 e 不发音
    `,
  },
);

const sciFi = batch(
  "words-of-science-fiction",
  ["Words of Science Fiction", "科幻的词"],
  ["science fiction and the future", "科幻与未来"],
  `
  dystopia|an imagined society where life is unfair, frightening or controlled|反乌托邦|In the novel's ___, people may not choose their own jobs or friends.|The film shows a cruel ___ where no one can trust anyone.|A ___ warns readers about the frightening place the world could become.|utopia,cyborg|dystopias
  utopia|an imagined perfect society|乌托邦|The founders hoped to build an ideal ___ on the island.|In a ___, no one is hungry, poor or unhappy.|The town looked like a ___, clean and happy, until she found its dark secret.|dystopia,android|utopias
  robot|a machine that can do tasks on its own, often controlled by a computer|机器人|The round little ___ on wheels swept the floor while we slept.|A ___ with six legs and no face explored the surface of Mars.|Factories use a ___ arm to weld car parts.|android,clone|robots
  android|a robot made to look and act like a human|人形机器人|The ___ looked so human that no one guessed it was only metal and wires.|The ___ smiled like a person, but under its skin there were only wires.|The ___ in the shop window had a human face, but it was a machine from head to toe.|cyborg,clone|androids
  futuristic|very modern, as if from the future|未来派的，超现代的|The city had sleek ___ towers that looked a hundred years ahead of their time.|He wore shiny ___ boots like a space pilot's from the year 3000.|The car's smooth, ___ design looked like something from the next century.|artificial,alien
  clone|an exact copy of a living thing made from its cells|克隆体；克隆|In the story, each soldier is a ___ of the same man.|Scientists made a ___ of a sheep named Dolly.|Grown from one of her cells, the ___ had her face and her eyes.|android,cyborg|clones,cloned
  artificial|made by people, not by nature|人造的，人工的|The ship's garden grew under ___ light from lamps, not sunlight.|___ intelligence, built by people, lets computers learn.|The lake is ___: workers dug it in 1950.|futuristic,alien
  cyborg|a being that is part human and part machine|半机械人，赛博格|The ___ had a metal arm and a human heart.|After the accident, doctors gave him machine legs, and he became a ___.|Half of the ___'s face was human skin and half was steel.|clone,robot|cyborgs
  alien|a creature from another planet; also strange and unfamiliar|外星生物；陌生的|The green, three-eyed ___ came from a planet far beyond Mars.|In the film, an ___ from another galaxy lands in a farmer's field.|The children drew a little ___ with antennae, waving from its home planet.|cyborg,android|aliens
  teleport|to move instantly from one place to another, as in science fiction|瞬间移动|In the game, you can ___ across the map in the blink of an eye.|The crew stepped into the machine and chose to ___ down to the planet in a flash.|I wish I could ___ to school in no time instead of riding the bus for an hour.|transport,clone|teleported,teleports
  `,
  "context-clues",
  {
    intro: t(
      "In the story, a **cyborg** and a friendly **android** escape a cruel **dystopia** and **teleport** to a distant planet, where an **alien** welcomes them. These ten words help you read and write stories about the future.",
      "故事里，一个半机械人（**cyborg**）和一个友善的人形机器人（**android**）逃出残酷的反乌托邦（**dystopia**），瞬间移动（**teleport**）到遥远的星球，一个外星生物（**alien**）欢迎了他们。这十个词帮你读写关于未来的故事。",
    ),
    watchOut: {
      meanings: t(
        "Tell **android** (a machine made to look human) apart from **cyborg** (a human with machine parts) and **clone** (a living copy grown from cells).",
        "分清 **android**（造得像人的机器）、**cyborg**（装了机器部件的人）和 **clone**（由细胞培育出的活体复制品）。",
      ),
      use: t(
        "Tell **utopia** (a perfect imagined society) apart from **dystopia** (a frightening one): the prefix *dys-* means bad, so a dystopia is a bad place.",
        "分清 **utopia**（想象中的完美社会）和 **dystopia**（想象中可怕的社会）：前缀 *dys-* 表示“坏”，所以 dystopia 是个坏地方。",
      ),
      spelling: t(
        "Watch the **y** in **dystopia** and **cyborg** (both say a different vowel), and the *-cial* ending of **artificial**.",
        "注意 **dystopia** 和 **cyborg** 中的 **y**（读音各不相同），以及 **artificial** 的结尾 *-cial*。",
      ),
    },
    notes: `
      dystopia|a novel's society where people may not choose their own jobs or friends|a cruel society in a film where no one can trust anyone|a story world warning readers about the frightening place the world could become|a dystopia is a frightening imagined society; a utopia is a perfect one|dystopia 是可怕的想象社会；utopia 是完美的想象社会|utopia is an imagined perfect society, the opposite of one that is unfair and frightening|utopia 是想象中的完美社会，和不公平、可怕的社会正相反|cyborg is a being that is part human and part machine, not a whole imagined society|cyborg 是半人半机器的生命，不是一整个想象的社会|dys · to · pi · a|dys- (bad) with a y, then -topia (place)|dys-（坏的）用 y，后接 -topia（地方）
      utopia|founders hoping to build an ideal society on an island|a society where no one is hungry, poor or unhappy|a clean, happy-looking town hiding a dark secret|a utopia is an imagined perfect society; a dystopia is a frightening one|utopia 是想象中的完美社会；dystopia 是可怕的社会|dystopia is an imagined society that is unfair and frightening, not the perfect place people hope for|dystopia 是不公平、可怕的想象社会，不是人们向往的完美之地|android is a robot built to look human, not an imagined society|android 是外形像人的机器人，不是想象的社会|u · to · pi · a|u- (no) + -topia (place): it starts with u, not eu|u-（没有）加 -topia（地方），开头是 u 不是 eu
      robot|a round little machine on wheels sweeping the floor at night|a six-legged machine with no face exploring Mars|a machine arm welding car parts in a factory|a robot is any machine that works on its own; an android is one made to look human|robot 泛指能自己干活的机器；android 是外形像人的那一种|android is a robot made to look and act like a human, which a wheeled, six-legged or one-armed machine does not|android 是外形和举止像人的机器人，轮式、六足或单臂的机器都不是|clone is a living copy made from cells, not a machine at all|clone 是用细胞造出的活体复制品，根本不是机器|ro · bot|ro + bot, ending in -ot, not -ott|ro 加 bot，结尾 -ot 不是 -ott
      android|a machine that looked so human no one guessed it was only metal and wires|a machine smiling like a person with only wires under its skin|a machine from head to toe with a human face|an android is a machine made to look human; a cyborg is a human with machine parts|android 是像人的机器；cyborg 是装了机器部件的人|cyborg is a human with machine parts added, not a machine that is all metal and wires|cyborg 是装了机器部件的人，不是全身金属和电线的机器|clone is a living copy grown from cells, not a machine|clone 是用细胞培育出的活体复制品，不是机器|an · droid|andr- (man) + -oid (like), ending in -oid as in asteroid|andr-（人）加 -oid（像），结尾 -oid 同 asteroid
      futuristic|sleek glass towers a hundred years ahead of their time|shiny boots like a space pilot's from the year 3000|a smooth car design like something from the next century|futuristic means looking like the future; artificial means made by people|futuristic 指像来自未来的；artificial 指人造的|artificial means made by people rather than nature, which says nothing about looking like the future|artificial 指人造而非天然，并不表示看起来像来自未来|alien means strange or from another planet, not modern-looking as if from a later time|alien 指陌生的或来自外星的，不是像来自未来那样新潮|fu · tur · is · tic|future drops its e and adds -istic|future 去掉 e 加 -istic
      clone|soldiers who are each an exact copy of the same man|an exact copy of a sheep named Dolly|a copy grown from one of her cells with her face and eyes|a clone is a living copy made from cells; an android is a machine made to look human|clone 是由细胞造出的活体复制品；android 是像人的机器|android is a machine built to look human, not a living copy grown from someone's cells|android 是造得像人的机器，不是由某人细胞培育的活体复制品|cyborg is a person with machine parts, not an exact living copy of someone|cyborg 是装了机器部件的人，不是某人的活体复制品|cl · one|cl- + one, ending in a silent e|cl- 加 -one，词尾 e 不发音
      artificial|a ship's garden growing under light from lamps, not sunlight|computers learning with intelligence built by people|a lake dug by workers in 1950|artificial means made by people; futuristic means looking like the future|artificial 指人造的；futuristic 指像来自未来的|futuristic means looking very modern, as if from the future, not made by people instead of nature|futuristic 指超现代、像来自未来，不是人造而非天然|alien means from another planet or strange, the opposite of something people made themselves|alien 指来自外星或陌生的，和人类自己造的东西不同|ar · ti · fi · cial|art + -ifi- + -cial, where ci says /sh/|art 加 -ifi- 和 -cial，ci 读 /ʃ/
      cyborg|a being with a metal arm and a human heart|a man given machine legs after an accident|a face half human skin and half steel|a cyborg is part human and part machine; a robot is all machine|cyborg 半人半机器；robot 完全是机器|clone is a living copy made from cells, with no machine parts|clone 是用细胞造出的活体复制品，没有机器部件|robot is all machine, with no human heart or skin|robot 完全是机器，没有人的心脏或皮肤|cy · borg|cyb(ernetic) + org(anism): y says long i, ending in -org|由 cyb(ernetic) 和 org(anism) 合成，y 读长 i，结尾 -org
      alien|a green, three-eyed creature from a planet beyond Mars|a creature from another galaxy landing in a farmer's field|a little creature with antennae waving from its home planet|an alien comes from another planet; a cyborg is a human with machine parts|alien 来自外星；cyborg 是装了机器部件的人|cyborg is a human with machine parts, not a creature from another planet|cyborg 是装了机器部件的人，不是来自外星的生物|android is a robot made on Earth to look human, not a creature from another planet|android 是地球上造出的像人的机器人，不是外星生物|a · li · en|three syllables, a-li-en, ending in -ien, not -ein|三个音节 a-li-en，结尾 -ien 不是 -ein
      teleport|jumping across a game map in the blink of an eye|a crew vanishing in a machine and reaching a planet in a flash|reaching school in no time instead of an hour's bus ride|teleport means move instantly; transport means carry people or goods along the way|teleport 指瞬间移动；transport 指一路运送人或货物|transport means carry people or goods from place to place over time, not vanish and appear somewhere else instantly|transport 指花时间把人或货物运到别处，不是瞬间消失又出现|clone means make an exact copy of a living thing, not move from one place to another|clone 指复制生物，不是从一处移动到另一处|tele · port|tele- (far) + port (carry), as in telephone and transport|tele-（远）加 port（运），和 telephone、transport 同源
    `,
  },
);

const controlled = batch(
  "words-of-controlled-societies",
  ["Words of Controlled Societies", "受控社会的词"],
  ["the controlled societies of dystopian stories", "反乌托邦故事中的受控社会"],
  `
  surveillance|close watching of a person or a place, often by a government|监视|Cameras on every corner kept the city under constant ___.|Agents followed the spy and kept him under ___ for months.|In the novel, hidden microphones and cameras put every home under ___.|censorship,dissent
  conformity|behaving the same way as everyone else, following the rules of a group|顺从，遵从|Afraid of standing out, the new girl copied what her classmates wore, and her ___ won her friends.|Peer pressure pushes teenagers toward ___, so they act just like their friends.|In a town that prized ___, anyone who acted differently from the crowd was laughed at.|obedience,dissent
  regime|a government, especially one that is strict and not chosen freely|政权|The ___ sent its soldiers to close the newspapers.|The ___'s leaders lived in palaces while the people went hungry.|When the ___ fell, its ministers fled abroad.|tyranny,surveillance|regimes
  obedience|doing what you are told by a rule or a person in power|服从|Soldiers are trained in ___: when an officer gives an order, they carry it out at once.|The dog's ___ to every command its owner gave won it a prize.|The ruler punished anyone who did not do exactly what he ordered, for he demanded total ___.|conformity,dissent
  censorship|stopping people from reading, hearing or saying certain things|审查制度|Under ___, many books were banned by the government.|The government's ___ cut every scene that criticized the king from the film.|Because of ___, the newspaper was not allowed to print the story.|surveillance,dissent
  defy|to refuse openly to obey someone or something|公然违抗|Told to stay silent, she decided to ___ the order and speak out.|The rebels would ___ the council at any cost.|It takes courage to ___ the crowd and stand alone.|comply,prohibit|defied,defies
  uniformity|being the same in every part, with no differences|一律，统一|The ___ of the gray houses, every one exactly like the next, was eerie.|The factory's bricks came out with perfect ___, each one exactly the size of the last.|Seen from the plane, the fields had a dull ___, every square the same size and color.|conformity,regime
  dissent|strong disagreement with an official opinion|异议，不同意见|The leaders allowed no ___: anyone who disagreed was arrested.|A few brave voices raised their ___ against the new law.|As the rules became harsher, ___ spread, and people openly argued against the rulers.|censorship,conformity
  oppressive|cruel and unfair, using power to control people|压迫的，暴虐的|The ___ laws kept people from meeting in groups and jailed anyone who complained.|Under the ___ ruler, soldiers beat anyone who spoke against him.|The people threw off the ___ government that had taken their land and their freedom.|civil,nonviolent
  tyranny|cruel and unfair use of power by a ruler|暴政|The king ruled by ___, jailing anyone he chose and taking whatever he wanted.|The story shows how ___ begins with small rules and ends with one cruel ruler who answers to no one.|After years of ___, when the emperor's word alone was law, the people won the right to vote.|censorship,dissent|tyrannies
  `,
  "context-clues",
  {
    intro: t(
      "In the novel, the **regime** watches every street through **surveillance** cameras and bans books through **censorship**, until one girl decides to **defy** it. These ten words help you read stories about societies that control their people.",
      "小说里，政权（**regime**）用监视（**surveillance**）摄像头盯着每条街道，用审查制度（**censorship**）查禁书籍，直到一个女孩决定公然违抗（**defy**）它。这十个词帮你读懂讲述控制民众的社会的故事。",
    ),
    watchOut: {
      meanings: t(
        "Tell **conformity** (people choosing to act like their group) apart from **uniformity** (things being exactly alike) and **obedience** (doing what someone in charge orders).",
        "分清 **conformity**（人主动和群体保持一致）、**uniformity**（事物完全一样）和 **obedience**（服从发号施令的人）。",
      ),
      use: t(
        "Tell **surveillance** (watching what people do) apart from **censorship** (stopping what people may read or say): cameras are surveillance, banned books are censorship.",
        "分清 **surveillance**（监视人们做什么）和 **censorship**（限制人们读什么、说什么）：摄像头属于监视，禁书属于审查。",
      ),
      spelling: t(
        "Watch **surveillance** (*ei* then double *l*), **regime** (*g* saying /zh/ and a silent *e*), and **tyranny** (*y* after *t*, double *n*).",
        "注意 **surveillance**（先 *ei* 后双写 **l**）、**regime**（**g** 读 /ʒ/，词尾 **e** 不发音）和 **tyranny**（**t** 后是 **y**，双写 **n**）。",
      ),
    },
    notes: `
      surveillance|cameras on every corner watching a city|agents following a spy for months|hidden microphones and cameras in every home|surveillance is watching people; censorship is stopping what they read or say|surveillance 是监视人；censorship 是限制人读什么、说什么|censorship is stopping people from reading, hearing or saying things, not watching them with cameras or agents|censorship 指禁止人读、听、说某些内容，不是用摄像头或特工盯着人|dissent is strong disagreement with those in power, not watching people|dissent 是对当权者强烈的不同意见，不是监视|sur · veil · lance|sur- + veil + -lance: ei, then double l|sur- 加 veil 和 -lance：ei 之后双写 l
      conformity|a new girl copying what her classmates wore to win friends|teenagers pushed by peer pressure to act like their friends|a town laughing at anyone who acted differently from the crowd|conformity is acting like everyone in your group; obedience is doing what someone in power tells you|conformity 是跟群体保持一致；obedience 是服从权力者的命令|obedience is doing what a ruler or a rule orders, not choosing to act like the people around you|obedience 指服从统治者或规则的命令，不是主动跟周围的人保持一致|dissent is strong disagreement with what is expected, the opposite of going along with the group|dissent 是强烈的反对意见，和随大流正相反|con · form · i · ty|con- + form + -ity|con- 加 form 加 -ity
      regime|a government sending its soldiers to close the newspapers|a government whose leaders lived in palaces while people went hungry|a government whose ministers fled abroad when it fell|a regime is a strict government; tyranny is the cruel way such a government may use power|regime 是专制政府；tyranny 是这种政府残暴地使用权力|tyranny is the cruel use of power, not the government itself with its soldiers, leaders and ministers|tyranny 是残暴地使用权力，不是拥有士兵、领导人和部长的政府本身|surveillance is close watching of people, not a government with leaders|surveillance 是严密监视，不是有领导人的政府|re · gime|French spelling: g saying /zh/ and a silent final e|法语拼法：g 读 /ʒ/，词尾 e 不发音
      obedience|soldiers carrying out an officer's order at once|a dog following every command its owner gave|a ruler punishing anyone who did not do what he ordered|obedience is doing what someone in charge orders; conformity is acting like everyone else|obedience 是服从发号施令的人；conformity 是和大家保持一致|conformity is acting the same as the people around you, not carrying out the orders of someone in charge|conformity 是和周围的人保持一致，不是执行发号施令者的命令|dissent is openly disagreeing with those in power, the opposite of doing what they order|dissent 是公开反对当权者，和服从命令正相反|o · be · di · ence|obey becomes obedi-, then -ence, not -ance|obey 变成 obedi-，再加 -ence，不是 -ance
      censorship|many books banned by the government|a government cutting every film scene that criticized the king|a newspaper not allowed to print a story|censorship stops what people read or say; surveillance watches what they do|censorship 限制人们读什么、说什么；surveillance 监视人们做什么|surveillance is watching people closely, not banning books, scenes or stories|surveillance 是严密监视人，不是禁书、删戏、禁登报道|dissent is disagreement with those in power, not the banning of what people read|dissent 是对当权者的反对意见，不是禁止人们阅读的内容|cen · sor · ship|censor, ending in -or, + -ship|censor（结尾 -or）加 -ship
      defy|a woman told to stay silent who speaks out anyway|rebels openly refusing the council at any cost|someone standing alone against a crowd|defy means refuse openly to obey; comply means do what you are told|defy 指公然违抗；comply 指服从照办|comply means do what a rule or an order says, the opposite of refusing it openly|comply 指照规则或命令去做，和公然违抗正相反|prohibit means forbid something by a rule, which those in power do, not refuse to obey a rule|prohibit 是掌权者用规则禁止某事，不是拒不服从规则|de · fy|de- + -fy; the y changes to i before -es and -ed: defies, defied|de- 加 -fy；加 -es、-ed 时 y 变 i：defies、defied
      uniformity|rows of gray houses all exactly alike|bricks that each came out exactly the size of the last|fields seen from a plane, every square the same size and color|uniformity is things being exactly alike; conformity is people choosing to act like their group|uniformity 指事物完全一样；conformity 指人主动和群体保持一致|conformity is people acting the same as their group, not houses, bricks or fields that are all alike|conformity 指人和群体保持一致，不能形容房子、砖块或田地一模一样|regime is a strict government, not things being the same in every part|regime 是专制政府，不是事物处处一样|u · ni · form · i · ty|uni- (one) + form + -ity|uni-（一）加 form 加 -ity
      dissent|leaders arresting anyone who disagreed|brave voices raised against a new law|people openly arguing against harsher rules|dissent is disagreeing with those in power; conformity is going along with the group|dissent 是反对当权者；conformity 是随大流|censorship is stopping people from reading or saying things, not the disagreement they voice|censorship 指禁止人们读或说某些内容，不是人们表达的反对意见|conformity is going along with everyone else, the opposite of disagreeing with those in power|conformity 是随大流，和反对当权者正相反|dis · sent|dis- + sent, with double s; not descent, which means going down|dis- 加 sent，双写 s；别和表示“下降”的 descent 混淆
      oppressive|laws keeping people from meeting and jailing anyone who complained|a ruler whose soldiers beat anyone who spoke against him|a government that had taken people's land and freedom|oppressive means using power cruelly to control people; civil means having to do with ordinary people and their rights|oppressive 指用权力残暴地压制人；civil 指与普通公民及其权利有关|civil means having to do with ordinary citizens and their rights, not cruel control by those in power|civil 指与普通公民及其权利有关，不是当权者的残暴控制|nonviolent means without using force, the opposite of beating or jailing people|nonviolent 指不使用暴力，和殴打、关押人正相反|op · pres · sive|double p and double s: op- + press + -ive|双写 p 和 s：op- 加 press 加 -ive
      tyranny|a king jailing anyone he chose and taking whatever he wanted|small rules ending with one cruel ruler who answers to no one|years when an emperor's word alone was law|tyranny is cruel, unfair rule by one ruler; censorship is banning what people may read or say|tyranny 是一个统治者残暴不公的统治；censorship 是禁止人们读或说某些内容|censorship is banning books, news or speech, only one tool of power, not a ruler's cruel and unlimited use of power|censorship 只是禁止书籍、新闻或言论，不是统治者无限而残暴地使用权力|dissent is disagreement with those in power, not cruel rule by them|dissent 是对当权者的反对，不是他们的残暴统治|tyr · an · ny|y after t, and double n: tyrant becomes tyranny|t 后面是 y，双写 n：由 tyrant 变成 tyranny
    `,
  },
);

const mind = batch(
  "words-for-states-of-mind",
  ["Words for States of Mind", "心理状态的词"],
  ["states of mind and strong feelings", "心理状态与强烈情感"],
  `
  bewildered|very confused|困惑的，迷惑的|The ___ traveler stared at the map, with no idea which way to go.|She was so ___ by all the rules that she did not know what to do.|Waking in a strange room, he looked around, ___ and unsure where he was.|composed,frantic
  frantic|wild with fear or worry, and rushing|狂乱的，发狂似的|The ___ mother ran up and down every aisle, shouting her son's name.|There was a ___ search for the missing key as the taxi waited outside.|He made a ___ call for help as the water rose around his car.|composed,exasperated
  resolute|firm and determined; not giving up|坚决的，坚定的|She was ___ in her plan to escape and would not change it.|With a ___ face, he stepped forward, determined not to turn back.|The team stayed ___ after the loss and promised to keep training until they won.|composed,elated
  indignant|angry because something seems unfair|愤慨的，义愤的|He was ___ when he was blamed for a mistake he did not make.|The ___ crowd shouted that the unfair new tax must go.|She cried out in an ___ voice that the punishment was not fair.|exasperated,sullen
  elated|very happy and excited|兴高采烈的|The team was ___ after winning the final.|She jumped for joy and felt ___ when the letter said she had won.|An ___ cheer went up from the crowd as the winning goal went in.|resolute,composed
  perplexed|puzzled because something is hard to understand|困惑的，茫然的|The scientists were ___ by the strange signal and could not explain it.|He frowned at the hard question, ___ about how to begin.|I was ___ by her silence and could not work out why she said nothing.|composed,sullen
  composed|calm and in control of your feelings|镇静的，沉着的|She stayed ___ when the alarm went off, calmly leading the children outside.|He kept his voice low and ___ while the angry man shouted.|Take a deep breath and look ___, not nervous, before you go on stage.|resolute,distraught
  distraught|very upset and worried|心烦意乱的|The ___ boy sat on the step and cried because he could not find his dog.|She was ___, sobbing quietly into her hands, when she heard the bad news.|The ___ family sat in the hospital waiting room, too upset to speak.|frantic,composed
  sullen|bad-tempered and silent|闷闷不乐的，阴沉的|He sat in ___ silence, sulking and refusing to talk after the argument.|The ___ teenager glared at the floor and would not answer anyone.|When the trip was canceled, she stayed ___ all day, scowling and saying nothing.|indignant,perplexed
  exasperated|very annoyed, especially after a long time|恼怒的|The ___ teacher asked for quiet a fourth time.|After an hour in the slow line, he was ___ and kept sighing.|After fixing the same printer jam for the tenth time, she gave an ___ sigh.|indignant,frantic
  `,
  "context-clues",
  {
    intro: t(
      "When the lights went out, Ana was **bewildered**, her little brother was **frantic**, but Grandpa stayed **composed** and found a candle. These ten words name strong states of mind more exactly than happy, sad or angry.",
      "灯突然熄灭时，安娜一脸困惑（**bewildered**），弟弟惊慌失措（**frantic**），爷爷却镇定自若（**composed**），找来了一支蜡烛。这十个词比“开心”“难过”“生气”更准确地说出强烈的心理状态。",
    ),
    watchOut: {
      meanings: t(
        "Tell **indignant** (angry because something is unfair) apart from **exasperated** (annoyed because something has gone on too long) and **sullen** (silent and bad-tempered).",
        "分清 **indignant**（因不公而愤慨）、**exasperated**（因事情拖得太久而恼火）和 **sullen**（闷闷不乐、一声不吭）。",
      ),
      use: t(
        "Tell **frantic** (rushing wildly with fear) apart from **distraught** (deeply upset, often still and tearful) and **composed** (calm and in control).",
        "分清 **frantic**（因恐惧而慌乱奔忙）、**distraught**（极度难过，常常一动不动地流泪）和 **composed**（镇静自若）。",
      ),
      spelling: t(
        "Watch **distraught** (a silent *gh*, as in *caught*), **exasperated** (the *s* says /z/), and **sullen** (double *l*).",
        "注意 **distraught** 中不发音的 **gh**（同 *caught*）、**exasperated** 中读 /z/ 的 **s**，以及双写 **l** 的 **sullen**。",
      ),
    },
    notes: `
      bewildered|a traveler staring at a map with no idea which way to go|someone so confused by all the rules she did not know what to do|a man waking in a strange room, unsure where he was|bewildered means very confused; composed means calm and in control|bewildered 指十分困惑；composed 指镇静沉着|composed means calm and in control, not so confused that you do not know what to do|composed 指镇静自若，不是困惑得不知所措|frantic means rushing wildly with fear or worry, not standing still, unsure and confused|frantic 指因恐惧或焦虑而疯狂忙乱，不是站着发愣、不知所措|be · wil · dered|be- + wilder + -ed, with wild inside it|be- 加 wilder 加 -ed，里面藏着 wild
      frantic|a mother running up and down every aisle shouting her son's name|a wild, rushed search for a key while a taxi waited|a desperate call for help as water rose around a car|frantic means rushing wildly with fear; composed means calm and in control|frantic 指惊慌忙乱；composed 指镇静沉着|composed means calm and in control, the opposite of rushing about wild with fear|composed 指镇静自若，和惊慌失措地乱跑正相反|exasperated means very annoyed after a long time, not wild with fear and rushing|exasperated 指久等后非常恼火，不是因恐惧而慌乱|fran · tic|ending in -tic, not -tick|结尾是 -tic，不是 -tick
      resolute|a woman firmly set on her plan to escape|a man stepping forward, determined not to turn back|a team promising after a loss to keep training until they won|resolute means firmly determined; composed means calm|resolute 指坚定不移；composed 指镇静|composed means calm and in control of your feelings, not firmly set on a goal and refusing to give up|composed 指情绪平静，不是认准目标、决不放弃|elated means very happy and excited, not firmly determined|elated 指兴高采烈，不是坚定不移|res · o · lute|one s and one l, as in resolve, ending in -ute|和 resolve 同源，一个 s、一个 l，结尾 -ute
      indignant|a boy blamed for a mistake he did not make|a crowd shouting that an unfair new tax must go|a voice crying out that a punishment was not fair|indignant means angry at something unfair; exasperated means annoyed after a long time|indignant 指对不公感到气愤；exasperated 指久了之后感到恼火|exasperated means worn out and annoyed by something going on too long, not angry because something is unfair|exasperated 指因事情拖得太久而恼火，不是因不公而愤慨|sullen means silent and bad-tempered, not speaking out loudly against something unfair|sullen 指闷声不响、闷闷不乐，不是大声抗议不公|in · dig · nant|in- + dign (worthy) + -ant, ending in -ant, not -ent|in- 加 dign（值得）再加 -ant，结尾 -ant 不是 -ent
      elated|a team celebrating after winning the final|a girl jumping for joy at news she had won|a crowd cheering as the winning goal went in|elated means very happy and excited; composed means calm|elated 指兴高采烈；composed 指平静|resolute means firmly determined, not bursting with happiness|resolute 指坚定，不是满心欢喜|composed means calm and in control, not jumping and cheering with joy|composed 指镇静自若，不是欢呼雀跃|e · lat · ed|one l and one t: e- + late + -d|一个 l、一个 t：e- 加 late 再加 -d
      perplexed|scientists puzzled by a strange signal they could not explain|a boy frowning at a hard question, unsure how to begin|someone unable to work out why a friend said nothing|perplexed means puzzled by something hard to understand; sullen means silent and bad-tempered|perplexed 指因难以理解而困惑；sullen 指闷闷不乐、一声不吭|composed means calm and in control, not puzzled by something you cannot understand|composed 指镇静自若，不是因想不通而困惑|sullen means bad-tempered and silent, not puzzled and trying to understand|sullen 指闷闷不乐、不说话，不是困惑地想弄明白|per · plexed|per- + plex + -ed, with x before -ed|per- 加 plex 加 -ed，-ed 前是 x
      composed|a woman calmly leading children outside when the alarm went off|a man keeping his voice low while an angry man shouted|taking a deep breath to look calm before going on stage|composed means calm; resolute means determined|composed 指镇静；resolute 指坚定|resolute means firmly determined not to give up, not calm and steady in a frightening moment|resolute 指决不放弃，不是在紧张时刻保持平静|distraught means very upset and worried, the opposite of calm and in control|distraught 指心烦意乱，和镇静自若正相反|com · posed|com- + pose + -d, keeping the e of pose|com- 加 pose 再加 -d，保留 pose 的 e
      distraught|a boy sitting on a step crying because he could not find his dog|a woman sobbing quietly into her hands at bad news|a family in a hospital waiting room too upset to speak|distraught means deeply upset; frantic means rushing wildly|distraught 指心烦意乱；frantic 指惊慌忙乱|frantic means rushing about wildly with fear, not sitting still in deep sadness and worry|frantic 指惊慌失措地乱忙，不是坐着伤心忧虑|composed means calm and in control, not crying with worry|composed 指镇静自若，不是忧心哭泣|dis · traught|-aught as in caught, with a silent gh|-aught 同 caught，gh 不发音
      sullen|a boy sulking in silence after an argument|a teenager glaring at the floor and refusing to answer|a girl scowling and saying nothing all day after a trip was canceled|sullen means silent and bad-tempered; indignant means openly angry at something unfair|sullen 指闷闷不乐不说话；indignant 指对不公公开表示愤慨|indignant means openly angry because something is unfair, not silently sulking|indignant 指因不公而公开表示愤怒，不是闷声生气|perplexed means puzzled, not bad-tempered and refusing to talk|perplexed 指困惑，不是闷闷不乐、不肯说话|sul · len|double l, ending in -en|双写 l，结尾 -en
      exasperated|a teacher asking for quiet a fourth time|a man sighing after an hour in a slow line|a sigh after fixing the same printer jam for the tenth time|exasperated means annoyed after a long time; indignant means angry at unfairness|exasperated 指久了而恼火；indignant 指因不公而愤慨|indignant means angry because something is unfair, not worn out by something that keeps happening|indignant 指因不公而气愤，不是被反复发生的事磨得恼火|frantic means rushing wildly with fear or worry, not sighing with annoyance|frantic 指因恐惧焦虑而慌乱，不是恼火地叹气|ex · as · per · at · ed|ex- + asper + -ate + -d, where the s says /z/|ex- 加 asper 加 -ate 再加 -d，s 读 /z/
    `,
  },
);

const rights = batch(
  "words-of-rights-and-equality",
  ["Words of Rights and Equality", "权利与平等的词"],
  ["rights and equality", "权利与平等"],
  `
  equality|the state of being equal, with the same rights and chances|平等|They marched for ___, the same rights for all people.|___ before the law means that the rich and the poor are judged by the same rules.|The club was founded on ___: every member has the same vote.|inequality,prejudice
  segregation|keeping people of different races or groups apart by law or custom|种族隔离，隔离|___ kept Black and white children in separate schools.|The court ruled that ___, keeping students apart by race, had no place in schools.|Under bus ___, Black riders had to sit in separate seats at the back.|discrimination,isolation
  discrimination|treating a person or group unfairly because of who they are|歧视|The new law banned unfair ___ when hiring workers.|She was turned down for the job because of her accent, a clear case of ___.|Refusing to hire older workers is ___ by age.|segregation,prejudice
  abolish|to end a law, system or custom officially|废除|Many people worked to ___ slavery and end it for good.|The school voted to ___ the old dress code, so there are no rules on clothes now.|The new leader promised to ___ the unfair tax.|revoke,integrate|abolished,abolishes
  emancipation|setting someone free, especially from slavery|解放|The ___ of enslaved people set them free and was a turning point in history.|With ___, millions of enslaved people walked free.|They celebrate the day of ___, when their great-grandparents were freed from slavery.|oppression,equality
  oppression|cruel and unfair treatment by people with power|压迫|The people suffered under years of ___, ruled by soldiers who took their land.|Songs helped enslaved people endure ___ and keep hope alive.|She spoke out against ___ wherever the powerful crushed the weak.|emancipation,equality
  civil|of the ordinary people of a country and their rights|公民的，民间的|Voting and free speech are ___ rights that belong to every citizen.|In a ___ war, people of the same country fight each other.|They settled the matter in a ___ court, where one citizen sued another.|nonviolent,oppressive
  prejudice|an unfair opinion of a person or group formed without knowing them|偏见|He judged the new boy before speaking to him, a ___ based only on his clothes.|Before she ever met them, she had a ___ that newcomers were lazy.|Once he got to know her, his ___ against people from her town melted away.|discrimination,inequality|prejudices
  integrate|to bring people or things together so that they mix as equals|整合，使融合|The city began to ___ its schools in the 1960s, so Black and white children learned side by side.|New players need time to ___ into the team and feel part of it.|The plan will ___ art into science lessons so the two are taught together.|abolish,revoke|integrated,integrates
  inequality|an unfair difference between people in wealth, rights or chances|不平等|The report showed a great ___ between rich and poor schools.|They worked to reduce ___ in pay between men and women.|Over twenty years, the gap between rich and poor grew, and so did ___.|equality,prejudice|inequalities
  `,
  "context-clues",
  {
    intro: t(
      "Under **segregation**, Black and white children went to separate schools, until people who fought **discrimination** won the right to **integrate** them and moved the country closer to **equality**. These ten words help you read about the long struggle for fair treatment.",
      "在种族隔离（**segregation**）时期，黑人和白人孩子上不同的学校；后来反对歧视（**discrimination**）的人们争取到让学校融合（**integrate**）的权利，让国家离平等（**equality**）更近了一步。这十个词帮你读懂争取公平对待的漫长斗争。",
    ),
    watchOut: {
      meanings: t(
        "Tell **prejudice** (an unfair opinion in the mind) apart from **discrimination** (unfair treatment in action) and **segregation** (keeping groups apart): prejudice can lead to discrimination, and segregation is one kind of it.",
        "分清 **prejudice**（心里不公平的看法）、**discrimination**（行为上的不公平对待）和 **segregation**（把群体隔开）：偏见会导致歧视，隔离是歧视的一种。",
      ),
      use: t(
        "Tell **abolish** (end a whole law or system) apart from **emancipation** (the setting free of people): people abolished slavery, and that brought emancipation.",
        "分清 **abolish**（废除整条法律或整个制度）和 **emancipation**（让人获得解放）：人们废除了奴隶制，从而带来了解放。",
      ),
      spelling: t(
        "Watch **prejudice** (no *d* after *pre-*), **integrate** (*inte-*, not *inter-*), and **civil** (ending in *-il*).",
        "注意 **prejudice**（*pre-* 后没有 **d**）、**integrate**（是 *inte-* 不是 *inter-*）和以 *-il* 结尾的 **civil**。",
      ),
    },
    notes: `
      equality|people marching for the same rights for all|the rich and the poor judged by the same rules|a club where every member has the same vote|equality means the same rights for all; inequality means unfair differences|equality 指人人权利相同；inequality 指不公平的差别|inequality is an unfair difference between people, the opposite of everyone having the same rights|inequality 指人与人之间不公平的差别，和人人权利相同正相反|prejudice is an unfair opinion formed without knowing someone, not people having the same rights|prejudice 是未了解就形成的不公平看法，不是人人权利相同|e · qual · i · ty|equal + -ity: qu says /kw/, and the a stays|equal 加 -ity：qu 读 /kw/，a 保留
      segregation|Black and white children kept in separate schools|students kept apart by race in schools|Black riders made to sit in separate seats at the back of buses|segregation keeps groups apart; discrimination treats them unfairly in any way|segregation 指把群体隔开；discrimination 泛指不公平对待|discrimination is any unfair treatment of a group, not specifically keeping groups in separate places|discrimination 泛指不公平对待某个群体，不特指把各群体分隔开|isolation is one person being kept apart from everyone, not separating groups by race|isolation 指一个人与所有人隔开，不是按种族把群体分开|seg · re · ga · tion|segregate drops its e and adds -ion|segregate 去掉 e 加 -ion
      discrimination|a law banning unfair treatment when hiring workers|a woman turned down for a job because of her accent|refusing to hire older workers|discrimination is unfair treatment; prejudice is the unfair opinion behind it|discrimination 是不公平的对待；prejudice 是背后的偏见|segregation is keeping groups apart in separate places, not refusing someone a job|segregation 是把群体隔在不同地方，不是拒绝录用某人|prejudice is an unfair opinion in someone's mind, not the act of treating a person unfairly|prejudice 是心里不公平的看法，不是不公平对待人的行为|dis · crim · i · na · tion|discriminate drops its e and adds -ion|discriminate 去掉 e 加 -ion
      abolish|people working to end slavery for good|a school voting to end its old dress code|a leader promising to end an unfair tax|abolish means end a whole law or system; revoke means cancel a permission someone was given|abolish 指废除整条法律或整个制度；revoke 指收回给某人的许可|revoke means cancel a right or a permission given to someone, such as a licence, not end a whole system or law|revoke 指收回给某人的权利或许可（如执照），不是废除整个制度或法律|integrate means bring groups together to mix as equals, not put an end to something|integrate 指让群体平等融合，不是终结某事|a · bol · ish|one b and one l, ending in -ish|一个 b、一个 l，结尾 -ish
      emancipation|enslaved people set free at a turning point in history|millions of enslaved people walking free|the day great-grandparents were freed from slavery|emancipation sets people free; equality gives them the same rights afterwards|emancipation 是让人获得自由；equality 是之后人人权利相同|oppression is cruel treatment by people in power, the opposite of being set free|oppression 是掌权者的残酷对待，和获得自由正相反|equality is everyone having the same rights, not the act of freeing enslaved people|equality 指人人权利相同，不是解放被奴役者这一行动|e · man · ci · pa · tion|e- + man + -cip- + -ation, with c saying /s/|e- 加 man 加 -cip- 再加 -ation，c 读 /s/
      oppression|years under soldiers who took people's land|enslaved people using songs to endure cruel treatment and keep hope|the powerful crushing the weak|oppression is cruel treatment by those in power; emancipation is being set free from it|oppression 是掌权者的残酷对待；emancipation 是从中获得解放|emancipation is being set free, the opposite of suffering cruel control|emancipation 指获得解放，和遭受残酷压制正相反|equality is everyone having the same rights, the opposite of the powerful crushing the weak|equality 指人人权利相同，和强者欺压弱者正相反|op · pres · sion|oppress + -ion, with double p and double s|oppress 加 -ion，双写 p 和 s
      civil|voting and free speech as rights belonging to every citizen|a war in which people of the same country fight each other|a court where one citizen sues another|civil means having to do with a country's ordinary citizens; nonviolent means without force|civil 指与本国普通公民有关；nonviolent 指不使用暴力|nonviolent means without using force, which describes a protest, not rights, a war or a court that belong to citizens|nonviolent 指不使用暴力，用来形容抗议，不能形容属于公民的权利、战争或法庭|oppressive means cruel and unfair in using power, not belonging to the ordinary people of a country|oppressive 指残暴不公地使用权力，不是属于普通公民的|civ · il|one l, ending in -il, as in pencil|一个 l，结尾 -il，和 pencil 一样
      prejudice|a boy judged by his clothes before anyone spoke to him|an unfair opinion that newcomers were lazy, formed before meeting them|an unfair opinion that melted away once he got to know her|prejudice is an unfair opinion; discrimination is unfair treatment|prejudice 是偏见（看法）；discrimination 是歧视（行为）|discrimination is unfair treatment, such as refusing someone a job, not an opinion formed before knowing a person|discrimination 是不公平的对待，如拒绝录用，不是未了解就形成的看法|inequality is an unfair difference in wealth or rights between groups, not one person's unfair opinion|inequality 是群体间财富或权利的不公平差别，不是某个人的偏见|prej · u · dice|pre- (before) + judice, with no d after the first e|pre-（预先）加 judice，第一个 e 后面没有 d
      integrate|a city letting Black and white children learn side by side in its schools|new players becoming part of a team|art and science taught together in the same lessons|integrate means bring people or things together as one; abolish means end something|integrate 指使融为一体；abolish 指废除|abolish means end a law or a system for good, not bring people or things together|abolish 指彻底废除法律或制度，不是让人或事物融合|revoke means cancel a right or a permission, not mix people or things together|revoke 指收回权利或许可，不是让人或事物融合|in · te · grate|inte-, not inter-: there is no r before the g|是 inte- 不是 inter-：g 前没有 r
      inequality|an unfair difference between rich and poor schools|an unfair difference in pay between men and women|a growing gap between rich and poor over twenty years|inequality is an unfair difference; equality is having the same rights|inequality 是不公平的差别；equality 是平等|equality is everyone having the same rights and chances, the opposite of an unfair gap|equality 指人人权利和机会相同，和不公平的差距正相反|prejudice is one person's unfair opinion, not a gap in wealth or pay between groups|prejudice 是个人的偏见，不是群体间财富或收入的差距|in · e · qual · i · ty|in- (not) + equality|in-（不）加 equality
    `,
  },
);

const protest = batch(
  "words-of-protest-and-reform",
  ["Words of Protest and Reform", "抗议与改革的词"],
  ["protest movements and reform", "抗议运动与改革"],
  `
  reform|a change that makes a law or system better; also to make such a change|改革；改革|Leaders promised to ___ the prisons and make them safer and fairer.|The town wants to ___ its old bus system so that buses come on time.|School ___ was the main issue in the election: everyone wanted to improve the schools.|movement,injustice|reforms,reformed
  activist|a person who works hard to bring about political or social change|活动家，积极分子|The young ___ spoke at the meeting about saving the forest.|After the factory polluted the river, she became the town's best-known ___, campaigning to clean it.|Every ___ at the protest knew the risks of speaking out.|movement,picket|activists
  movement|a group of people working together for a shared cause|运动|The ___ for women's votes lasted seventy years.|The peace ___ spread to many countries over the years.|She joined the ___ to save the forest and worked with its members for ten years.|reform,demonstration|movements
  nonviolent|without using force or harming anyone|非暴力的|Gandhi led a ___ campaign against British rule, never using force.|The marchers stayed ___: no one threw a stone or hit anyone.|___ protest, such as sitting down and refusing to move, can change unfair laws.|oppressive,stirring
  strike|a time when workers refuse to work to win better pay or conditions|罢工|The miners went on ___ until the tunnels were made safer.|The factory stood silent for six weeks because the workers refused to work during the ___.|A bus ___ left the city without transport when the drivers stopped working.|picket,demonstration|strikes
  injustice|an unfair act or situation|不公正|Jailing a man for a crime he did not commit was a terrible ___.|The ___ of a law that let only the rich vote angered the people.|He spent his life fighting ___ wherever innocent people were treated unfairly.|legislation,reform|injustices
  legislation|laws, or the making of laws|立法，法规|New ___ passed by parliament protects workers from danger.|Lawmakers voted on the ___, and the new law passed by a single vote.|Parliament wrote ___ banning child labor, and it became the law of the land.|reform,injustice
  demonstration|a public gathering or march in which people show that they support or oppose something|示威，游行|Thousands gathered for the ___, standing in the square with signs.|The crowd stayed in front of the town hall all day, and the ___ ended peacefully with a song.|Police watched the ___ as hundreds stood outside the embassy holding candles.|strike,march|demonstrations
  march|an organized walk by many people to protest or support something|游行，示威|The ___ walked eight kilometers from the bridge to the capitol.|We joined the ___ through the city center, walking with our banners.|The ___ set off at dawn and reached the capital by noon.|picket,strike|marches
  picket|a group of people standing outside a workplace in protest|纠察队，罢工哨|Workers formed a ___ outside the factory gate.|The ___ stood at the factory gate all day, holding signs that read Fair Pay.|No delivery trucks would drive past the ___ of workers at the gate.|strike,march|pickets
  `,
  "context-clues",
  {
    intro: t(
      "When the bosses cut pay, the workers went on **strike**, formed a **picket** at the factory gate, and joined a **nonviolent** **march** to the town hall. These ten words help you read about how people have pushed for fairer laws.",
      "老板削减工资后，工人们举行罢工（**strike**），在厂门口组成纠察队（**picket**），并加入了前往市政厅的非暴力（**nonviolent**）游行（**march**）。这十个词帮你读懂人们怎样推动更公平的法律。",
    ),
    watchOut: {
      meanings: t(
        "Tell **movement** (a long effort by many people) apart from **demonstration** (one public gathering) and **activist** (one person who campaigns).",
        "分清 **movement**（众人长期的努力）、**demonstration**（一次公开集会）和 **activist**（一个为变革奔走的人）。",
      ),
      use: t(
        "Tell **strike** (workers refusing to work) apart from **picket** (the group standing at the gate) and **march** (a crowd walking from place to place).",
        "分清 **strike**（工人拒绝工作）、**picket**（守在门口的那群人）和 **march**（从一处走到另一处的人群）。",
      ),
      spelling: t(
        "Watch **nonviolent** (one word, no hyphen), **legislation** (one *s*, one *l*), and **picket** (*ck* in the middle).",
        "注意 **nonviolent**（连写，不加连字符）、**legislation**（一个 **s**、一个 **l**）和中间是 **ck** 的 **picket**。",
      ),
    },
    notes: `
      reform|leaders promising to make prisons safer and fairer|a town improving its old bus system so buses come on time|improving the schools as the main issue of an election|reform means change a system to make it better; a movement is the group that pushes for change|reform 指改进制度；movement 是推动变革的群体|movement is a group of people working for a cause, not the change that improves a system|movement 是为共同事业奋斗的一群人，不是改进制度的变革本身|injustice is an unfair act or situation, the very thing a change for the better tries to fix|injustice 是不公正的行为或局面，正是改革要纠正的东西|re · form|re- (again) + form: shape again|re-（重新）加 form（形成）
      activist|a young campaigner speaking at a meeting about saving a forest|a woman campaigning to clean a polluted river|campaigners at a protest who knew the risks of speaking out|an activist is one person working for change; a movement is the whole group|activist 是为变革奋斗的个人；movement 是整个群体|movement is a whole group working for a cause, not one person who campaigns|movement 是为共同事业奋斗的整个群体，不是一个活动家|picket is a group standing outside a workplace in protest, not one person who campaigns for change|picket 是在工作场所外抗议的一群人，不是为变革奔走的个人|ac · tiv · ist|active drops its e and adds -ist|active 去掉 e 加 -ist
      movement|a seventy-year struggle for women's votes|a cause that spread to many countries over the years|a group that worked for ten years to save a forest|a movement is a long effort by many people; a demonstration is one public gathering|movement 是众人长期的努力；demonstration 是一次公开集会|reform is a change that improves a system, not the group of people who push for it over the years|reform 是改进制度的变革，不是多年推动它的那群人|demonstration is a single public gathering or march, not a cause that lasts for years|demonstration 是一次公开集会或游行，不是持续多年的运动|move · ment|move keeps its e before -ment|move 加 -ment，保留 e
      nonviolent|a campaign against British rule that never used force|marchers who threw no stones and hit no one|protest by sitting down and refusing to move|nonviolent means without force; oppressive means using power cruelly|nonviolent 指不用暴力；oppressive 指残暴地使用权力|oppressive means cruel and unfair in using power, the opposite of a protest that harms no one|oppressive 指残暴不公地使用权力，和不伤害任何人的抗议正相反|stirring means causing strong feeling, which says nothing about using no force|stirring 指激动人心，并不表示不使用暴力|non · vi · o · lent|non- (not) + violent, written as one word|non-（不）加 violent，连写为一个词
      strike|miners refusing to work until tunnels were made safer|workers leaving a factory silent for six weeks|bus drivers stopping work and leaving a city without transport|a strike is workers refusing to work; a picket is the group standing outside during it|strike 是工人拒绝工作；picket 是罢工时守在门外的人群|picket is a group of people standing outside a workplace, not the workers' refusal to work itself|picket 是守在工作场所外的一群人，不是工人拒绝工作这件事|demonstration is a public march or gathering for a cause, not workers refusing to do their jobs|demonstration 是为某事举行的公开游行或集会，不是工人拒绝上班|str · ike|str- + -ike, where the silent final e makes the i long|str- 加 -ike，词尾不发音的 e 使 i 读长音
      injustice|jailing a man for a crime he did not commit|a law letting only the rich vote|innocent people treated unfairly|injustice is an unfair act or situation; reform is a change that fixes it|injustice 是不公正；reform 是纠正它的改革|legislation is laws or the making of laws, which may be fair or unfair, not unfairness itself|legislation 指法律或立法，可能公平也可能不公平，不等于不公正本身|reform is a change that makes a system better, the cure for unfairness rather than the unfairness|reform 是使制度变好的改革，是不公的解药而非不公本身|in · jus · tice|in- (not) + justice, ending in -ice|in-（不）加 justice，结尾 -ice
      legislation|new laws passed by parliament protecting workers from danger|a new law voted on by lawmakers and passed by a single vote|laws written by parliament to ban child labor|legislation is laws made by lawmakers; reform is any change that improves something|legislation 是立法机关制定的法律；reform 泛指改进|reform is any change that improves a system, not the laws that lawmakers write and vote on|reform 泛指改进制度的变化，不是立法者起草并表决的法律|injustice is an unfair act or situation, not laws written to protect people|injustice 是不公正的行为或局面，不是保护人们的法律|leg · is · la · tion|legis- (law) + -lation, with one s and one l|legis-（法律）加 -lation，一个 s、一个 l
      demonstration|thousands standing in a square with signs|a crowd staying in front of a town hall all day and ending with a song|hundreds standing outside an embassy holding candles|a demonstration is any public gathering for a cause; a march is one that walks from place to place|demonstration 泛指公开集会；march 是边走边示威的那一种|strike is workers refusing to work, not a crowd gathering in public with signs or candles|strike 是工人拒绝工作，不是人群举着标语或蜡烛公开集会|march is an organized walk from place to place, not a crowd that stays standing in one spot|march 是从一处走到另一处的游行，不是站在原地的集会|dem · on · stra · tion|demonstrate drops its e and adds -ion|demonstrate 去掉 e 加 -ion
      march|people walking eight kilometers from a bridge to the capitol|walking with banners through a city center|protesters setting off at dawn and reaching the capital by noon|a march walks from place to place; a picket stands outside one workplace|march 是边走边游行；picket 是守在一个工作场所外|picket is a group standing still outside a workplace, not a crowd walking from place to place|picket 是站在工作场所外不动的一群人，不是一路行进的人群|strike is workers refusing to work, not a long walk through the streets|strike 是工人拒绝工作，不是沿街长距离行走|m · ar · ch|ar as in car and ch at the end; the plural is marches|ar 同 car，结尾 ch，复数 marches
      picket|workers standing outside a factory gate|people standing at a factory gate all day with signs|workers at a gate whom delivery trucks would not drive past|a picket stands outside a workplace during a strike; a march moves through the streets|picket 守在工作场所外；march 沿街行进|strike is the workers' refusal to work, not the group standing at the gate|strike 是工人拒绝工作，不是站在门口的那群人|march is a crowd walking through the streets, not a group standing at one gate|march 是沿街行走的人群，不是守在一个门口的人|pick · et|pick + -et, with ck in the middle|pick 加 -et，中间是 ck
    `,
  },
);

const speeches = batch(
  "words-of-speeches",
  ["Words of Speeches", "演讲的词"],
  ["speeches and speakers", "演讲与演讲者"],
  `
  orator|a person who gives speeches, especially a skilled one|演说家|Frederick Douglass was a powerful ___ whose speeches moved huge crowds.|The ___ held the crowd for an hour with nothing but her voice.|She practiced speaking every day for years to become a great ___.|moderator,podium|orators
  podium|a raised stand where a speaker stands|讲台|The speaker walked up to the ___ and looked out at the crowd.|She gripped the edges of the ___ and began.|The microphone was fixed to the top of the ___.|address,orator|podiums
  address|a formal speech to an audience; also to speak to a group|演说；向……讲话|The president gave an ___ to the nation on television.|The principal will ___ the students in the hall tomorrow.|Lincoln's ___ at Gettysburg was only ten sentences long.|delivery,applause|addresses,addressed
  applause|clapping to show that people like something|鼓掌，掌声|The speech ended to loud ___.|Loud ___ filled the hall as the singer bowed.|She waited for the ___ to stop before speaking again.|conviction,delivery
  delivery|the way a speaker gives a speech|演讲方式|His words were good, but his ___ let him down: he mumbled and never looked up.|Practice improves your ___: speak clearly, stand tall and look at the audience.|Her steady eye contact and clear voice gave her a ___ the audience trusted.|cadence,address
  conviction|a strong belief; also the feeling of being sure|信念，坚定|She spoke with deep ___, sure that every word was true.|His ___ that all people are equal never changed.|Nothing could shake her ___ that the river must be saved.|delivery,cadence|convictions
  stirring|causing strong feeling and excitement|激动人心的|The ___ speech brought people to their feet, cheering.|The band played a ___ song that made everyone want to march and cheer.|Her ___ words filled the tired soldiers with fresh courage.|momentous,solemn
  momentous|very important, with great effects for the future|重大的，意义深远的|The day the law was signed was ___: it changed the country for a hundred years.|The vote was a ___ decision that would shape the nation's future.|The moon landing was a ___ event that changed human history forever.|solemn,stirring
  cadence|the rise and fall of a voice; the rhythm of speech|抑扬顿挫，节奏|The ___ of his voice rose and fell like music.|Her sentences rose and fell in a steady ___, like waves.|Repeating the same short phrase gave the speech a beating ___ like a drum.|conviction,delivery|cadences
  solemn|serious and formal|庄严的，严肃的|There was a ___ silence for those who had died.|He placed his hand on his heart and made a ___ promise.|Nobody smiled at the ___ funeral, where everyone wore black and spoke softly.|stirring,momentous
  `,
  "context-clues",
  {
    intro: t(
      "The **orator** stepped up to the **podium**, spoke with deep **conviction**, and the hall filled with **applause**. These ten words help you describe a speech and the person giving it.",
      "演说家（**orator**）走上讲台（**podium**），带着坚定的信念（**conviction**）发言，大厅里响起一片掌声（**applause**）。这十个词帮你描述一场演讲和发表演讲的人。",
    ),
    watchOut: {
      meanings: t(
        "Tell **address** (the speech itself) apart from **delivery** (the whole way it is spoken) and **cadence** (only the rise and fall of the voice).",
        "分清 **address**（演说本身）、**delivery**（讲话的整体方式）和 **cadence**（只是声音的抑扬起伏）。",
      ),
      use: t(
        "Tell **stirring** (filling people with excitement) apart from **solemn** (serious and quiet) and **momentous** (important for the future): a momentous day can be stirring or solemn.",
        "分清 **stirring**（让人激动）、**solemn**（严肃安静）和 **momentous**（对未来意义重大）：意义重大的一天可能激动人心，也可能庄严肃穆。",
      ),
      spelling: t(
        "Watch **solemn** (a silent *n*, as in *autumn*), **applause** (double *p*), and **stirring** (*stir* doubles its *r*).",
        "注意 **solemn** 中不发音的 **n**（同 *autumn*）、双写 **p** 的 **applause**，以及 *stir* 双写 **r** 的 **stirring**。",
      ),
    },
    notes: `
      orator|a man whose powerful speeches moved huge crowds|a speaker holding a crowd for an hour with her voice alone|someone practicing speaking for years to become great at it|an orator gives speeches; a moderator runs a debate and keeps it fair|orator 是发表演说的人；moderator 是主持辩论、维持公平的人|moderator is the person who runs a debate and keeps it fair, not the one who moves a crowd with speeches|moderator 是主持辩论、保持公平的人，不是用演说打动人群的人|podium is the stand a speaker stands at, not the speaker|podium 是演讲者站的讲台，不是演讲者|or · a · tor|ending in -or, not -er, like actor|结尾 -or 不是 -er，和 actor 一样
      podium|the raised stand a speaker walked up to|the stand whose edges a speaker gripped before beginning|the stand a microphone was fixed to|a podium is the stand a speaker uses; an address is the speech given from it|podium 是讲台；address 是在讲台上发表的演说|address is the speech itself, not the stand that a speaker walks up to or grips|address 是演说本身，不是演讲者走上去、握住的讲台|orator is the person who speaks, not the stand he or she speaks from|orator 是演讲的人，不是他站的讲台|po · di · um|pod- (foot) + -ium, ending in -um|pod-（脚）加 -ium，结尾 -um
      address|a president's formal television speech to the nation|a principal speaking to all the students in the hall|a famous speech at Gettysburg only ten sentences long|an address is the speech itself; delivery is the way it is spoken|address 是演说本身；delivery 是讲话的方式|delivery is the way a speech is spoken, such as fast or calm, not the speech itself or the act of giving it|delivery 是讲话的方式（快或慢、镇定与否），不是演说本身或发表演说|applause is clapping after a speech, not the speech or the act of speaking to a group|applause 是演讲后的掌声，不是演说或向人们讲话|ad · dress|double d and double s|双写 d 和 s
      applause|a speech ending to loud clapping|clapping filling a hall as a singer bowed|clapping a speaker waited to stop before speaking again|applause is the audience clapping; delivery is how the speaker speaks|applause 是听众的掌声；delivery 是演讲者的讲话方式|conviction is a strong belief, not the sound of an audience clapping|conviction 是坚定的信念，不是观众的掌声|delivery is the way a speaker gives a speech, not the clapping of the audience|delivery 是演讲者的讲话方式，不是观众的鼓掌|ap · plause|double p, and -ause as in cause|双写 p，结尾 -ause 同 cause
      delivery|good words let down by mumbling and never looking up|speaking clearly, standing tall and looking at the audience|steady eye contact and a clear voice the audience trusted|delivery is the whole way a speech is given; cadence is only the rise and fall of the voice|delivery 是演讲的整体方式；cadence 只是声音的抑扬起伏|cadence is only the rhythm and the rise and fall of a voice, not how a speaker stands, looks and speaks|cadence 只是声音的节奏和起伏，不包括站姿、目光和吐字|address is the speech itself, not the way it is spoken|address 是演说本身，不是讲话的方式|de · liv · er · y|deliver + -y|deliver 加 -y
      conviction|a speaker sure that every word she said was true|a lifelong belief that all people are equal|a belief nothing could shake that a river must be saved|conviction is a strong belief; delivery is how you speak|conviction 是坚定的信念；delivery 是讲话方式|delivery is the way a speaker gives a speech, not a strong belief held inside|delivery 是讲话的方式，不是内心坚定的信念|cadence is the rise and fall of a voice, not a belief someone holds|cadence 是声音的起伏，不是人所持的信念|con · vic · tion|convict + -ion|convict 加 -ion
      stirring|a speech bringing people to their feet, cheering|a song that made everyone want to march and cheer|words filling tired soldiers with fresh courage|stirring means rousing strong feeling; solemn means serious and quiet|stirring 指激动人心；solemn 指庄严肃穆|momentous means very important for the future, which says nothing about filling people with excitement|momentous 指对未来影响重大，并不表示让人激动|solemn means serious and quiet, the opposite of making people cheer|solemn 指严肃安静，和让人欢呼正相反|stir · ring|stir doubles its r before -ing|stir 加 -ing 时双写 r
      momentous|a law signing that changed a country for a hundred years|a vote that would shape a nation's future|the moon landing changing human history forever|momentous means very important for the future; stirring means exciting|momentous 指意义重大；stirring 指激动人心|solemn means serious and formal, not of great importance for the future|solemn 指严肃庄重，不表示对未来影响重大|stirring means filling people with strong feeling, not having great effects on the future|stirring 指让人情绪激昂，不表示对未来影响深远|mo · men · tous|moment + -ous, keeping the t|moment 加 -ous，保留 t
      cadence|a voice rising and falling like music|sentences rising and falling like waves|a phrase repeated like a drumbeat in a speech|cadence is the rhythm of a voice; delivery is the whole way a speech is given|cadence 是声音的节奏；delivery 是演讲的整体方式|conviction is a strong belief, not the rise and fall of a voice|conviction 是坚定的信念，不是声音的起伏|delivery is the whole way a speech is given, from standing to eye contact, not just its rhythm|delivery 是演讲的整体方式，包括站姿和目光，不只是节奏|ca · dence|ending in -ence, with c saying /s/|结尾 -ence，c 读 /s/
      solemn|a silence for those who had died|a promise made with a hand on the heart|a funeral where everyone wore black and spoke softly|solemn means serious and formal; stirring means exciting|solemn 指严肃庄重；stirring 指激动人心|stirring means filling people with excitement, the opposite of a quiet, serious mood|stirring 指让人激动，和安静严肃的气氛正相反|momentous means very important for the future, not serious and quiet in mood|momentous 指对未来意义重大，不是气氛严肃安静|sol · emn|a silent n at the end, as in autumn|结尾 n 不发音，和 autumn 一样
    `,
  },
);

const flight = batch(
  "words-of-flight",
  ["Words of Flight", "飞行的词"],
  ["the science of flight", "飞行的科学"],
  `
  lift|the upward force on a wing that holds an aircraft in the air|升力|A curved wing creates ___ as air flows over it and pushes it upward.|With too little ___ under its wings, the plane cannot rise off the ground.|Birds change the shape of their wings to get more ___ and climb higher.|thrust,drag
  thrust|the forward force that pushes an aircraft through the air|推力|The engine provides ___ to push the plane forward.|A rocket's ___ comes from burning fuel and blasting gas out behind it.|Pushing the throttle gives more ___, so the plane speeds forward down the runway.|lift,drag
  drag|the force of the air that pushes back against a moving object|阻力|A smooth, pointed shape reduces ___, so less air pushes back on the car.|The wide parachute catches the air, and the ___ slows the falling skydiver.|Pilots pull up the wheels so that less air pushes back on the plane, cutting ___.|lift,turbulence
  glider|an aircraft without an engine that flies on currents of air|滑翔机|Before they added an engine, the Wright brothers tested a ___.|The silent ___ circled slowly on the warm air with no engine at all.|A ___ is pulled into the sky by a plane and then let go.|propeller,airfoil|gliders
  propeller|a set of spinning blades that pulls or pushes an aircraft or a ship|螺旋桨|The ___ began to spin faster and faster.|Early planes had a wooden ___ whose blades spun at the front.|The boat's spinning ___ churned the water behind it.|glider,wingspan|propellers
  turbulence|sudden, rough movements of the air|湍流，气流颠簸|The plane shook and bumped as it flew through ___.|Please stay seated with your belt fastened during the ___.|Rough, bumpy ___ is common over mountains.|drag,thrust
  aviation|the design, building and flying of aircraft|航空|The Wright brothers changed the history of ___ when they made the first powered flight.|She studied ___ to become a pilot.|___ has made the world feel smaller, with flights to every continent.|airfoil,glider
  wingspan|the distance from the tip of one wing to the tip of the other|翼展|The albatross has a ___ of more than three meters.|Measured from tip to tip, the ___ of the jet is longer than its body.|An eagle's wide ___, nearly two meters from tip to tip, helps it glide for hours.|airfoil,propeller|wingspans
  aerodynamic|shaped to move through air easily|空气动力学的，流线型的|Racing bikes have an ___ shape that lets them cut through the wind.|The ___ design saves fuel because air slides smoothly past it.|Birds' bodies are naturally ___.|futuristic,artificial
  airfoil|the curved shape of a wing seen from the side|翼型|The ___ is thicker at the front and thin at the back.|Cut a wing in half and look at the end: its curved shape is the ___.|A fan blade is also an ___, curved just like a wing.|wingspan,glider|airfoils
  `,
  "context-clues",
  {
    intro: t(
      "As the **propeller** spins, the plane gains **thrust**; air flowing over the curved wings creates **lift**, and a smooth shape keeps **drag** low. These ten words explain how aircraft get into the air and stay there.",
      "螺旋桨（**propeller**）一转，飞机就获得推力（**thrust**）；流过弯曲机翼的空气产生升力（**lift**），光滑的外形让阻力（**drag**）保持很小。这十个词解释飞机怎样升空并留在空中。",
    ),
    watchOut: {
      meanings: t(
        "Tell the forces apart by direction: **lift** pushes up, **thrust** pushes forward, and **drag** pushes back.",
        "按方向分清这几种力：**lift** 向上托，**thrust** 向前推，**drag** 向后拖。",
      ),
      use: t(
        "Tell **wingspan** (a length from tip to tip) apart from **airfoil** (a wing's curved shape seen from the side) and **glider** (a whole aircraft with no engine).",
        "分清 **wingspan**（翼尖到翼尖的长度）、**airfoil**（从侧面看机翼的弯曲形状）和 **glider**（没有发动机的整架飞机）。",
      ),
      spelling: t(
        "Watch **aerodynamic** (*ae*, not *ea*), **propeller** (*propel* doubles its *l*), and **turbulence** (ending in *-ence*).",
        "注意 **aerodynamic**（是 *ae* 不是 *ea*）、**propeller**（*propel* 双写 **l**）和以 *-ence* 结尾的 **turbulence**。",
      ),
    },
    notes: `
      lift|a curved wing pushed upward as air flows over it|too little upward force under the wings for a plane to rise|birds shaping their wings to climb higher|lift pushes a plane up; thrust pushes it forward|lift 把飞机向上托；thrust 推飞机向前|thrust is the forward push from an engine, not the upward force on a wing|thrust 是发动机向前的推力，不是机翼受到的向上的力|drag is the air pushing back against a moving object, which slows it rather than holding it up|drag 是空气对运动物体向后的阻力，会使它减速而不是把它托起|l · ift|a short i, ending in -ft|短音 i，结尾 -ft
      thrust|an engine pushing a plane forward|a rocket pushed by burning fuel and gas blasting out behind it|a throttle pushed to speed a plane forward down a runway|thrust pushes a plane forward; drag pulls it back|thrust 推飞机向前；drag 把它往后拖|lift is the upward force from a wing, not the forward push of an engine|lift 是机翼产生的向上的力，不是发动机向前的推力|drag is the air pushing back against a moving object, the opposite of a forward push|drag 是空气向后的阻力，和向前的推力正相反|thr · ust|the thr- blend, ending in -ust|开头 thr- 连读，结尾 -ust
      drag|a smooth, pointed shape letting less air push back on a car|air pushing back on a wide parachute to slow a skydiver|wheels pulled up so less air pushes back on a plane|drag is air pushing back; lift is air pushing up|drag 是空气向后的阻力；lift 是空气向上的托力|lift is the upward force on a wing, not air pushing back to slow something down|lift 是机翼受到的向上的力，不是让物体减速的向后的力|turbulence is sudden rough movement of the air, not the steady push of air against a moving shape|turbulence 是空气突然的剧烈扰动，不是空气对运动物体持续的阻挡|dr · ag|the dr- blend and a short a, ending in g|开头 dr- 连读，a 读短音，结尾 g
      glider|an aircraft the Wright brothers tested before adding an engine|a silent aircraft with no engine circling on warm air|an aircraft pulled into the sky by a plane and let go|a glider is a whole aircraft without an engine; a propeller is a spinning part that needs one|glider 是没有发动机的整架飞机；propeller 是需要发动机带动的旋转部件|propeller is a set of spinning blades driven by an engine, not a whole aircraft that flies without one|propeller 是由发动机带动的旋转叶片，不是没有发动机的整架飞机|airfoil is the curved shape of a wing, not a whole aircraft|airfoil 是机翼的弯曲截面形状，不是整架飞机|gli · der|glide + -r, keeping the e of glide|glide 加 -r，保留 glide 的 e
      propeller|spinning blades turning faster and faster|wooden blades spinning at the front of early planes|a boat's spinning blades churning the water|a propeller is spinning blades; a glider is an aircraft with no engine|propeller 是旋转的叶片；glider 是无动力的飞机|glider is a whole aircraft with no engine, not blades that spin|glider 是没有发动机的整架飞机，不是旋转的叶片|wingspan is a distance from wing tip to wing tip, not a part that spins|wingspan 是翼尖到翼尖的距离，不是旋转的部件|pro · pel · ler|propel doubles its l before -er|propel 加 -er 时双写 l
      turbulence|rough air shaking and bumping a plane|bumpy air during which passengers must stay seated with belts fastened|rough, bumpy air common over mountains|turbulence is rough, sudden air movement; drag is steady air resistance|turbulence 是突然的乱流；drag 是持续的空气阻力|drag is the steady push of air back against a moving object, not sudden rough bumps that shake a plane|drag 是空气对运动物体持续的阻力，不是让飞机颠簸的突然气流|thrust is the forward push of an engine, not rough air|thrust 是发动机向前的推力，不是颠簸的气流|tur · bu · lence|turbul- + -ence, ending in -ence, not -ance|turbul- 加 -ence，结尾 -ence 不是 -ance
      aviation|the history of flying changed by the first powered flight|what someone studies to become a pilot|air travel making the world feel smaller|aviation is the whole field of flying; a glider is one kind of aircraft|aviation 是整个航空领域；glider 只是一种飞机|airfoil is the curved shape of one wing, not the whole field of designing and flying aircraft|airfoil 是一片机翼的弯曲截面，不是设计和驾驶飞机的整个领域|glider is one aircraft without an engine, not the whole field of flight|glider 是一架无动力飞机，不是整个航空领域|a · vi · a · tion|avi- (bird) + -ation|avi-（鸟）加 -ation
      wingspan|an albatross whose wings stretch more than three meters|a jet measuring more from wing tip to wing tip than from nose to tail|an eagle's wings nearly two meters from tip to tip|wingspan is the distance across the wings; airfoil is the shape of a wing seen from the side|wingspan 是翼展长度；airfoil 是机翼的侧面形状|airfoil is the curved side shape of a wing, not the distance from one wing tip to the other|airfoil 是机翼侧面的弯曲形状，不是从一个翼尖到另一个翼尖的距离|propeller is a set of spinning blades, not a measurement across the wings|propeller 是旋转的叶片，不是两翼之间的长度|wing · span|wing + span, written as one word|wing 加 span，连写为一个词
      aerodynamic|racing bikes shaped to cut through the wind|a design that saves fuel because air slides smoothly past it|birds' bodies naturally shaped to move through air|aerodynamic means shaped to move through air easily; futuristic means looking like the future|aerodynamic 指流线型、易于穿过空气；futuristic 指看起来像未来的|futuristic means looking very modern, which says nothing about moving easily through air|futuristic 指外观超现代，并不表示易于穿过空气|artificial means made by people, not shaped to slip through the air as a bird's body naturally is|artificial 指人造的，不表示流线型，而鸟的身体天生就是流线型的|aer · o · dy · nam · ic|aero- (air) begins with ae, not ea, and dynamic has a y|aero-（空气）以 ae 开头不是 ea，dynamic 中是 y
      airfoil|a wing shape thicker at the front and thin at the back|the curved shape seen at the cut end of a wing|a fan blade curved just like a wing|an airfoil is a wing's side shape; wingspan is its length from tip to tip|airfoil 是机翼的侧面形状；wingspan 是翼尖到翼尖的长度|wingspan is a length from tip to tip, not the curved shape you see from the side of a wing|wingspan 是翼尖到翼尖的长度，不是从侧面看到的弯曲形状|glider is a whole aircraft without an engine, not the shape of a wing or a blade|glider 是无动力的整架飞机，不是机翼或叶片的形状|air · foil|air + foil, written as one word|air 加 foil，连写为一个词
    `,
  },
);

const pilots = batch(
  "words-of-pilots-and-airports",
  ["Words of Pilots and Airports", "飞行员与机场的词"],
  ["pilots, aircraft and airports", "飞行员、飞机与机场"],
  `
  cockpit|the part of an aircraft where the pilot sits|驾驶舱|The ___ in front of the pilot's seat was full of dials and switches.|The pilot climbed into the ___ and sat down at the controls.|After landing, the captain let the children sit in her seat in the ___.|hangar,fuselage|cockpits
  runway|a long strip of hard ground where aircraft take off and land|跑道|The plane rolled slowly along the ___ toward the far end.|Snow was cleared from the ___ so the planes could land.|Two long rows of lights along the ___ guided the plane down in the fog.|hangar,takeoff|runways
  hangar|a large building where aircraft are kept and repaired|飞机库|The old plane is kept inside a ___ out of the rain.|Mechanics worked all night in the ___, fixing the engines.|The huge ___ doors slid open, and the plane was towed out of the building.|runway,cockpit|hangars
  pilot|a person who flies an aircraft|飞行员|The ___ welcomed the passengers on board.|She trained for years and became an airline ___ at twenty-one.|The ___ took the controls herself and landed safely in the storm.|autopilot,rudder|pilots
  takeoff|the moment when an aircraft leaves the ground|起飞|Please fasten your seat belts for ___.|The ___ was smooth: the wheels left the ground without a bump.|The ___ was delayed by fog, so the plane stayed at the gate.|runway,crosswind|takeoffs
  altimeter|an instrument that shows how high an aircraft is|高度计|The ___ showed ten thousand meters.|The pilot watched the ___ count down their height as they descended.|With a broken ___, the pilot could not tell how high the plane was.|autopilot,rudder|altimeters
  autopilot|a system that flies an aircraft without the pilot steering|自动驾驶仪|The pilot turned on the ___ over the ocean, and the plane flew itself for hours.|On ___, the plane kept a steady course while the crew ate lunch.|He did the boring job on ___, without thinking.|altimeter,pilot
  fuselage|the main body of an aircraft, where people and cargo ride|机身|The wings are attached to the ___.|Passengers sat in rows along the ___, with the cargo stored beneath them.|Engineers found a crack in the ___, halfway between the cockpit and the tail.|cockpit,hangar
  rudder|a flat, moving part at the back of a plane or ship used to steer it|方向舵|The pilot pressed the pedals to move the ___ and turn the plane.|The ship's ___ was damaged by the rocks, so it could not steer.|Without a ___, the plane could not steer and would turn in circles.|altimeter,fuselage|rudders
  crosswind|a wind blowing across the direction an aircraft is moving|侧风|Landing in a strong ___ blowing from the side takes skill.|A ___ pushed the plane to one side of the runway.|The ___ made it hard to ride a bike straight along the coast road.|takeoff,runway|crosswinds
  `,
  "context-clues",
  {
    intro: t(
      "The **pilot** climbed into the **cockpit**, checked the **altimeter**, and steered down the **runway** while a **crosswind** tugged at the wings. These ten words name the people, parts and places of flying.",
      "飞行员（**pilot**）爬进驾驶舱（**cockpit**），检查高度计（**altimeter**），在侧风（**crosswind**）拉扯机翼时驾驶飞机沿跑道（**runway**）滑行。这十个词说出飞行中的人、部件和场所。",
    ),
    watchOut: {
      meanings: t(
        "Tell **cockpit** (the small front space where the pilot sits) apart from **fuselage** (the whole body of the plane) and **hangar** (the building on the ground where planes are kept).",
        "分清 **cockpit**（前部飞行员坐的小空间）、**fuselage**（整个机身）和 **hangar**（地面上停放飞机的建筑）。",
      ),
      use: t(
        "Tell **pilot** (the person who flies) apart from **autopilot** (the system that flies without anyone steering) and **altimeter** (an instrument that only shows height).",
        "分清 **pilot**（驾驶飞机的人）、**autopilot**（无需人操纵就能飞行的系统）和 **altimeter**（只显示高度的仪表）。",
      ),
      spelling: t(
        "Watch **hangar** (*-ar*, not the *-er* of a coat hanger), **fuselage** (ending in *-age*), and **rudder** (double *d*).",
        "注意 **hangar**（结尾 *-ar*，不是衣架 hanger 的 *-er*）、以 *-age* 结尾的 **fuselage**，以及双写 **d** 的 **rudder**。",
      ),
    },
    notes: `
      cockpit|dials and switches in front of the pilot's seat|a pilot climbing in to sit at the controls|children sitting in the captain's seat after landing|the cockpit is where the pilot sits; the fuselage is the whole body of the plane|cockpit 是飞行员坐的地方；fuselage 是整个机身|hangar is a building on the ground where aircraft are kept, not the part of an aircraft where the pilot sits|hangar 是地面上停放飞机的库房，不是飞机里飞行员坐的地方|fuselage is the whole main body where passengers and cargo ride, not the small front space with the pilot's controls|fuselage 是载客装货的整个机身，不是前部装着操纵装置的小空间|cock · pit|cock + pit, with ck|cock 加 pit，中间是 ck
      runway|a plane rolling slowly along a long strip toward its far end|snow cleared from the strip where planes land|rows of lights along a strip guiding a plane down in fog|the runway is the strip; takeoff is the moment of leaving it|runway 是跑道；takeoff 是离地的那一刻|hangar is a building where planes are kept, not a long strip they roll along|hangar 是停放飞机的建筑，不是飞机滑行的长条地面|takeoff is the moment a plane leaves the ground, not the strip of ground itself|takeoff 是飞机离地的那一刻，不是那条地面本身|run · way|run + way, written as one word|run 加 way，连写为一个词
      hangar|a building where an old plane is kept out of the rain|a building where mechanics worked all night fixing engines|a building whose huge doors slid open for a plane to be towed out|a hangar is a building for planes; a runway is the strip they take off from|hangar 是停放飞机的建筑；runway 是起降的跑道|runway is an open strip where planes take off and land, not a building where they are kept|runway 是飞机起降的露天长条地面，不是存放飞机的建筑|cockpit is the space inside a plane where the pilot sits, not a building the plane is kept in|cockpit 是飞机内飞行员坐的地方，不是存放飞机的建筑|hang · ar|ending in -ar, not -er like a coat hanger|结尾是 -ar，不是衣架 hanger 的 -er
      pilot|the person who welcomed passengers on board|a woman who trained for years and flew for an airline at twenty-one|a person who took the controls herself in a storm|a pilot is the person who flies; autopilot is a system that flies without anyone steering|pilot 是驾驶飞机的人；autopilot 是无需人操纵的自动系统|autopilot is a machine system, not a person who welcomes passengers or takes the controls|autopilot 是机器系统，不是欢迎乘客或亲手操纵的人|rudder is a moving part used to steer, not the person who flies|rudder 是用来转向的部件，不是驾驶飞机的人|pi · lot|one l, ending in -ot|一个 l，结尾 -ot
      takeoff|passengers fastening seat belts before leaving the ground|wheels leaving the ground without a bump|a departure delayed by fog while the plane stayed at the gate|takeoff is the moment of leaving the ground; the runway is where it happens|takeoff 是离地那一刻；runway 是发生的地方|runway is the strip of ground, not the moment the wheels leave it|runway 是那条地面，不是机轮离地的那一刻|crosswind is a wind blowing across a plane's path, not the moment it leaves the ground|crosswind 是横吹过飞机航向的风，不是飞机离地的时刻|take · off|take + off, written as one word as a noun|take 加 off，作名词时连写
      altimeter|an instrument reading ten thousand meters|an instrument counting down height as a plane descended|an instrument whose breaking left a pilot unable to tell the height|an altimeter shows height; autopilot flies the plane|altimeter 显示高度；autopilot 自动驾驶|autopilot is a system that flies the plane, not an instrument that only shows how high it is|autopilot 是驾驶飞机的系统，不是只显示高度的仪表|rudder is a moving part used to steer, not an instrument that shows height|rudder 是用来转向的部件，不是显示高度的仪表|al · tim · e · ter|alti- (high) + meter, ending in -meter|alti-（高）加 meter，结尾 -meter
      autopilot|a system flying a plane by itself over the ocean for hours|a system keeping a plane on a steady course while the crew ate|doing a boring job without thinking, as if a machine were in control|autopilot flies the plane without anyone steering; a pilot is the person who flies it|autopilot 让飞机无需人操纵自动飞行；pilot 是驾驶飞机的人|altimeter is an instrument that only shows height, not a system that flies the plane|altimeter 是只显示高度的仪表，不是驾驶飞机的系统|pilot is a person flying the plane, not a system that flies it without anyone steering|pilot 是驾驶飞机的人，不是无需人操纵的系统|au · to · pi · lot|auto- (self) + pilot, written as one word|auto-（自动）加 pilot，连写为一个词
      fuselage|the main body that the wings are attached to|the long body where passengers sit in rows above the cargo|the main body between the cockpit and the tail|the fuselage is the whole body of a plane; the cockpit is the pilot's space at its front|fuselage 是整个机身；cockpit 是前部飞行员的位置|cockpit is the small front space where the pilot sits, not the long main body that holds the wings and passengers|cockpit 是前部飞行员坐的小空间，不是连接机翼、载着乘客的整个机身|hangar is a building where planes are kept, not part of the plane|hangar 是停放飞机的建筑，不是飞机的一部分|fu · se · lage|fuse + -lage, ending in -age, as in garage|fuse 加 -lage，结尾 -age，和 garage 一样
      rudder|a part the pilot moves with pedals to turn the plane|a ship's steering part damaged by rocks|a steering part without which a plane would turn in circles|a rudder steers; an altimeter only shows height|rudder 用来转向；altimeter 只显示高度|altimeter is an instrument that shows height, not a moving part that steers|altimeter 是显示高度的仪表，不是用来转向的活动部件|fuselage is the main body of a plane, not the flat moving part at the back that steers|fuselage 是飞机的主体，不是尾部用来转向的活动部件|rud · der|double d, ending in -er|双写 d，结尾 -er
      crosswind|a strong wind from the side making landing hard|wind pushing a plane to one side of the runway|wind from the side making it hard to ride a bike straight|a crosswind blows from the side; takeoff is the moment of leaving the ground|crosswind 是侧风；takeoff 是离地那一刻|takeoff is the moment a plane leaves the ground, not a wind that pushes from the side|takeoff 是飞机离地的那一刻，不是从侧面吹来的风|runway is the strip of ground planes use, not a wind|runway 是飞机用的跑道，不是风|cross · wind|cross + wind, written as one word|cross 加 wind，连写为一个词
    `,
  },
);

const trial = batch(
  "words-of-trial-and-error",
  ["Words of Trial and Error", "反复试验的词"],
  ["trying, failing and trying again", "尝试、失败与再尝试"],
  `
  attempt|a try at doing something, especially something hard|尝试|Their first ___ to fly lasted twelve seconds.|She made a brave ___ to climb the wall, but slipped halfway.|After falling twice, he gave the jump one more ___.|setback,triumph|attempts,attempted
  failure|a lack of success|失败|The launch ended in ___: the rocket never left the pad.|The play was a ___, and half the audience left before the end.|Fear of ___ stopped him from even trying.|flaw,triumph|failures
  adjust|to change something slightly to make it work better|调整|Turn the knob to ___ the volume until it is not too loud.|___ your seat so your feet reach the pedals before you drive.|It takes time to ___ to a new school.|refine,tinker|adjusted,adjusts
  refine|to improve something by making small changes|改进，完善|She rewrote her essay again and again to ___ her ideas until every sentence was clear.|The writer will ___ the last chapter, choosing a better word in every line.|A poet may ___ a short poem for years, polishing each word until it is just right.|adjust,tinker|refined,refines
  tinker|to make small changes to a machine, often to fix or improve it|修补，小修小改|He likes to ___ with old radios in the garage.|They would ___ with the glider's parts every evening.|Don't ___ with the clock unless you know how it works.|iterate,adjust|tinkered,tinkers
  setback|a problem that delays progress|挫折，阻碍|The storm that wrecked the glider was a ___, delaying their tests by a month.|Losing the money was a ___ that pushed the project back a year.|A broken ankle was a ___ that kept her off the team for six weeks, but she came back.|failure,flaw|setbacks
  flaw|a mistake or weakness in something|缺陷，瑕疵|A small ___ in the design of the wing caused the crash.|The diamond has a tiny ___ deep inside it.|The plan had one ___: no one had thought about the cost.|failure,setback|flaws
  iterate|to repeat a process, improving it each time|迭代，反复改进|Designers ___ again and again, building and testing until the product works well.|We will build, test, learn and then ___, going round the same steps again.|The class had to ___ three times, building, testing and rebuilding their bridge.|tinker,refine|iterated,iterates
  triumph|a great success or victory|胜利，巨大成功|After years of trying, the first flight was a ___ that made the whole world cheer.|Winning the final was a ___ for the town, which celebrated all night.|She returned home in ___, carrying the gold medal.|attempt,failure|triumphs
  perfect|to make something as good as it can be|使完美，完善|It took years to ___ the design, until there was nothing left to improve.|She practiced her serve every day to ___ it, and now it never misses.|The chef spent ten years trying to ___ the cake, making it as good as a cake can be.|adjust,tinker|perfected,perfects
  `,
  "context-clues",
  {
    intro: t(
      "Their first glider **attempt** crashed, so the brothers studied the **flaw**, began to **tinker** with the wings, and turned the **setback** into a **triumph**. These ten words describe the long road from trying to succeeding.",
      "兄弟俩第一次试飞滑翔机（**attempt**）就坠毁了，于是他们研究缺陷（**flaw**），动手修改机翼（**tinker**），把挫折（**setback**）变成了巨大的成功（**triumph**）。这十个词描述从尝试到成功的漫长道路。",
    ),
    watchOut: {
      meanings: t(
        "Tell **failure** (not succeeding at all) apart from **setback** (a delay you can recover from) and **flaw** (a weak point inside a thing).",
        "分清 **failure**（彻底没有成功）、**setback**（可以挽回的耽搁）和 **flaw**（事物内部的弱点）。",
      ),
      use: t(
        "Tell **adjust** (make a small change so something fits) apart from **refine** (polish work until it is excellent) and **tinker** (fiddle with a machine's parts).",
        "分清 **adjust**（稍作改动使之合适）、**refine**（把作品打磨得精益求精）和 **tinker**（摆弄机器的零件）。",
      ),
      spelling: t(
        "Watch **triumph** (*ph* saying /f/), **attempt** (double *t*), and **iterate** (one *t*).",
        "注意 **triumph** 中读 /f/ 的 **ph**、双写 **t** 的 **attempt**，以及只有一个 **t** 的 **iterate**。",
      ),
    },
    notes: `
      attempt|a first try at flying that lasted twelve seconds|a brave try at climbing a wall that ended in a slip|one more try at a jump after falling twice|an attempt is a try; a setback is a problem that delays you|attempt 是一次尝试；setback 是拖慢进展的挫折|setback is a problem that delays progress, not a try at doing something|setback 是阻碍进展的问题，不是一次尝试|triumph is a great success, while a try may or may not succeed|triumph 是巨大的成功，而一次尝试未必成功|at · tempt|double t, then -empt with a quiet p|双写 t，结尾 -empt 中的 p 几乎不发音
      failure|a launch ending with a rocket that never left the pad|a play so unsuccessful that half the audience left|fear of not succeeding stopping someone from trying|a failure is a lack of success; a flaw is a weakness that may cause it|failure 是失败；flaw 是可能导致失败的缺陷|flaw is a mistake or weakness inside a thing, not the lack of success itself|flaw 是事物内部的缺陷，不是失败本身|triumph is a great success, the opposite of not succeeding|triumph 是巨大的成功，和失败正相反|fail · ure|fail + -ure, keeping ai|fail 加 -ure，保留 ai
      adjust|turning a knob to change the volume until it is not too loud|moving a seat so the feet reach the pedals|getting used to a new school over time|adjust means change something slightly so it fits; refine means keep improving work until it is excellent|adjust 指稍作调整使合适；refine 指不断改进使之完善|refine means improve a piece of work until it is excellent, not move a seat, turn a knob or get used to a new place|refine 指把作品不断改进得更好，不是挪座椅、拧旋钮或适应新环境|tinker means fiddle with a machine's parts to fix it, not move a seat or settle into a new school|tinker 指摆弄机器零件来修理，不是挪座椅或适应新学校|ad · just|ad- + just, with a d before the j that many writers leave out|ad- 加 just，j 前面的 d 容易漏写
      refine|rewriting an essay until every sentence is clear|a writer choosing a better word in every line of a chapter|a poet polishing each word of a poem for years|refine means polish work until it is excellent; adjust means make a small change so it fits|refine 指精益求精地打磨；adjust 指稍作改动使之合适|adjust means make a small change so something fits or works, such as a seat or a knob, not polish writing until it is excellent|adjust 指稍作改动使东西合适或能用（如座椅、旋钮），不是把文字打磨得精益求精|tinker means fiddle with a machine's parts, not polish the words of a piece of writing|tinker 指摆弄机器零件，不是打磨文章的字句|re · fine|re- + fine, ending in a silent e|re- 加 fine，词尾 e 不发音
      tinker|a man fiddling with old radios in a garage|fiddling with a glider's parts every evening|fiddling with a clock without knowing how it works|tinker means fiddle with a machine; iterate means repeat a whole process to improve it|tinker 指摆弄机器；iterate 指重复整个流程不断改进|iterate means repeat a whole process of testing and improving, not fiddle casually with a machine's parts|iterate 指反复进行“测试—改进”的整个流程，不是随手摆弄机器零件|adjust means change one setting slightly so it fits, not fiddle with a machine's parts|adjust 指稍微调整某个设置使之合适，不是摆弄机器零件|tin · ker|tin + -ker, ending in -er|tin 加 -ker，结尾 -er
      setback|a storm that wrecked a glider and delayed tests by a month|lost money pushing a project back a year|a broken ankle keeping a player off the team for six weeks|a setback delays you; a failure means you did not succeed at all|setback 是暂时的挫折；failure 是彻底没有成功|failure is a lack of success, not a delay after which the work goes on|failure 是没有成功，不是之后还能继续的耽搁|flaw is a weakness or mistake inside a thing, not an event that delays progress|flaw 是事物内在的缺陷，不是拖慢进展的事件|set · back|set + back, written as one word|set 加 back，连写为一个词
      flaw|a small mistake in a wing design that caused a crash|a tiny mark deep inside a diamond|one weak point in a plan that nobody had thought about|a flaw is a weakness in a thing; a setback is an event that delays progress|flaw 是事物的缺陷；setback 是拖慢进展的事件|failure is a lack of success, not a weak point inside a design, a jewel or a plan|failure 是没有成功，不是设计、宝石或计划内在的弱点|setback is an event that delays progress, not a mistake built into a thing|setback 是拖慢进展的事件，不是事物本身的缺陷|fl · aw|aw as in law and saw|aw 同 law、saw
      iterate|designers repeating build-and-test steps until a product works|building, testing and learning round the same steps again|a class building, testing and rebuilding a bridge three times|iterate means go round a process again and again; refine means polish a piece of work|iterate 指反复循环一个流程；refine 指打磨作品|tinker means fiddle with a machine, not repeat a whole cycle of steps|tinker 指摆弄机器，不是反复循环整套步骤|refine means polish one piece of work, not go round a whole cycle of building and testing again|refine 指打磨作品，不是把“制作—测试”的循环再走一遍|it · er · ate|it + -er- + -ate, with one t|it 加 -er- 加 -ate，只有一个 t
      triumph|a first flight after years of trying that made the world cheer|a town celebrating all night after winning the final|a woman coming home carrying a gold medal|a triumph is a great success; an attempt is only a try|triumph 是巨大的成功；attempt 只是一次尝试|attempt is a try, which may fail, not a great success that everyone cheers|attempt 只是一次尝试，可能失败，不是人人欢呼的巨大成功|failure is a lack of success, the opposite of a victory|failure 是失败，和胜利正相反|tri · umph|ph saying /f/, and u before m|ph 读 /f/，m 前是 u
      perfect|a design worked on for years until nothing was left to improve|a tennis serve practiced daily until it never misses|a cake made as good as a cake can be|perfect means make something as good as it can be; adjust means make a small change so it fits|perfect 指使臻于完美；adjust 指稍作调整使合适|adjust means make a small change so something fits or works, not make it as good as it can possibly be|adjust 指稍作调整使之合适，不是使其尽善尽美|tinker means fiddle with a machine's parts, not make something flawless|tinker 指摆弄机器零件，不是使东西完美无缺|per · fect|per- + fect; as a verb, the stress moves to -fect|per- 加 fect；作动词时重音在 -fect
    `,
  },
);

const news = batch(
  "words-of-news",
  ["Words of the News", "新闻的词"],
  ["newspapers, broadcasts and the people who make them", "报纸、广播及其制作者"],
  `
  headline|the title of a news story, printed in large letters|新闻标题|The big black ___ across the front page said Local Team Wins.|A good ___ makes you want to read the story below it.|The ___ was printed in letters five centimeters tall.|byline,edition|headlines
  journalist|a person who writes or reports the news|记者，新闻工作者|The ___ wrote the story herself and checked every fact twice.|She became a ___, writing news stories for the local paper.|A ___ asked the mayor questions for an article.|editor,tabloid|journalists
  editor|a person who decides what goes into a newspaper or book and corrects it|编辑|The ___ cut the reporter's story to three hundred words.|The ___ chose which photo would go on the front page.|As the school paper's ___, my sister decides which stories go in and fixes their mistakes.|reporter,journalist|editors
  broadcast|a program sent out on radio or television; also to send one out|广播节目；播送|Turn on the radio: the evening news ___ starts at six.|The concert will ___ live on television tonight.|Millions watched the TV ___ of the moon landing.|edition,tabloid|broadcasts
  reporter|a person who gathers and reports the news|记者|The ___ asked the firefighter what had happened at the fire.|A ___ stood outside the courthouse with a notebook, waiting for news.|Each ___ was sent out to cover a different story.|editor,tabloid|reporters
  byline|a line at the top of an article that gives the writer's name|署名行|Her name appeared in the ___ above the story for the first time.|The ___ read By Sam Lee.|Readers check the ___ to see who wrote the story.|headline,tabloid|bylines
  edition|one printing of a newspaper or book|版，版本|The morning ___ of the paper sold out early.|This is the first ___ of the book, printed in 1950.|The Sunday ___ is the thickest paper of the week.|broadcast,headline|editions
  coverage|the reporting of news about something|新闻报道|Every paper and channel gave the storm hours of ___.|The game got little ___ in the papers.|Fair ___ reports what both sides say.|broadcast,byline
  correspondent|a journalist who reports from a particular place|驻外记者，通讯员|The ___ sent her report from Paris, where she has lived for ten years.|Our science ___ follows the space program and reports on every launch.|The war ___ risked his life to report from the front line.|editor,byline|correspondents
  tabloid|a newspaper with small pages and many short, exciting stories|小报|The ___, with its small pages and shouting headlines, printed rumors about the singer.|Don't trust every rumor you read in a ___ full of short, exciting stories.|The ___ filled its small front page with one huge photo of the star.|edition,byline|tabloids
  `,
  "context-clues",
  {
    intro: t(
      "The **reporter** rushed back with the story, the **editor** cut it to fit, and the next morning her **byline** sat under a bold **headline** on the front page. These ten words help you talk about how the news is made.",
      "记者（**reporter**）带着报道赶回来，编辑（**editor**）把它删改到合适的篇幅；第二天早上，她的署名（**byline**）出现在头版醒目的标题（**headline**）下面。这十个词帮你谈论新闻是怎样做出来的。",
    ),
    watchOut: {
      meanings: t(
        "Tell **reporter** (goes out to gather the news) apart from **editor** (stays at the desk choosing and correcting it) and **correspondent** (reports from one place or on one subject).",
        "分清 **reporter**（外出采集新闻）、**editor**（在编辑部挑选和修改稿件）和 **correspondent**（专门报道某地或某领域）。",
      ),
      use: t(
        "Tell **headline** (a story's title) apart from **byline** (the line with the writer's name) and **edition** (one whole printing of a paper or book).",
        "分清 **headline**（报道的标题）、**byline**（写着作者姓名的一行）和 **edition**（报纸或书的一次完整印刷）。",
      ),
      spelling: t(
        "Watch **correspondent** (double *r*, ending in *-ent*), **journalist** (*jour-*), and **editor** (ending in *-or*).",
        "注意 **correspondent**（双写 **r**，结尾 *-ent*）、以 *jour-* 开头的 **journalist**，以及以 *-or* 结尾的 **editor**。",
      ),
    },
    notes: `
      headline|big black words across a front page announcing a win|a title that makes you want to read the story below|a title printed in letters five centimeters tall|a headline is a story's title; a byline names its writer|headline 是新闻标题；byline 是作者署名|byline is the line naming who wrote a story, not its title in large letters|byline 是写明作者的那一行，不是大字印刷的标题|edition is one printing of a whole newspaper, not the title of one story|edition 是报纸的一次印刷，不是一篇报道的标题|head · line|head + line, written as one word|head 加 line，连写为一个词
      journalist|a writer checking every fact of her own story twice|a woman writing news stories for a local paper|a writer questioning a mayor for an article|a journalist writes the news; an editor chooses and corrects it|journalist 写新闻；editor 挑选并修改新闻|editor decides what goes into a paper and corrects other people's stories, not the person who writes and gathers the news|editor 决定刊登什么、修改别人的稿子，不是采写新闻的人|tabloid is a kind of newspaper, not a person who writes news|tabloid 是一种报纸，不是写新闻的人|jour · nal · ist|journal + -ist, beginning with jour-|journal 加 -ist，开头是 jour-
      editor|a person cutting a reporter's story to three hundred words|a person choosing the front-page photo|a sister who decides which stories go in the school paper and fixes their mistakes|an editor chooses and corrects stories; a reporter gathers them|editor 挑选和修改稿件；reporter 采集新闻|reporter gathers news and writes it up, not the person who cuts, chooses and corrects other people's stories|reporter 负责采集和撰写新闻，不是删改、挑选别人稿件的人|journalist writes or reports news, while choosing and correcting other people's stories is a separate job|journalist 采写新闻，挑选和修改别人的稿件是另一项工作|ed · i · tor|edit + -or, ending in -or, not -er|edit 加 -or，结尾 -or 不是 -er
      broadcast|a radio news program starting at six|a concert sent out live on television|a TV program of the moon landing watched by millions|a broadcast is sent out on radio or TV; an edition is one printing of a paper|broadcast 通过广播电视播出；edition 是报刊的一次印刷|edition is one printing of a newspaper or book, not a program on radio or television|edition 是报纸或书的一次印刷，不是广播电视节目|tabloid is a printed newspaper of short, exciting stories, not a radio or television program|tabloid 是刊登短小刺激故事的印刷报纸，不是广播电视节目|broad · cast|broad + cast; the past tense is also broadcast|broad 加 cast；过去式仍是 broadcast
      reporter|a person asking a firefighter what had happened at the fire|a person waiting outside a courthouse with a notebook for news|people each sent out to cover a different story|a reporter goes out to gather news; an editor stays at the desk choosing and correcting it|reporter 外出采集新闻；editor 在编辑部挑选修改|editor stays in the office choosing and correcting stories, not the person out asking questions and gathering news|editor 在编辑部挑选和修改稿件，不是外出提问采访的人|tabloid is a newspaper, not a person who gathers news|tabloid 是一种报纸，不是采集新闻的人|re · port · er|report + -er|report 加 -er
      byline|a reporter's name appearing above a story for the first time|a line reading By Sam Lee|a line readers check to see who wrote a story|a byline names the writer; a headline is the story's title|byline 是作者署名；headline 是标题|headline is the story's title in big letters, not the line naming who wrote it|headline 是大字标题，不是写明作者的那一行|tabloid is a whole kind of newspaper, not one line naming a writer|tabloid 是一类报纸，不是写明作者的一行字|by · line|by + line, written as one word|by 加 line，连写为一个词
      edition|a morning printing of a paper selling out early|the first printing of a book in 1950|the Sunday paper, the thickest of the week|an edition is one printing; a broadcast is a program sent over the air|edition 是一次印刷；broadcast 是播出的节目|broadcast is a program sent out on radio or television, not a printed paper or book that sells out|broadcast 是广播电视节目，不是可以卖光的印刷品|headline is the title of one story, not a whole printed copy of a paper or book|headline 是一篇报道的标题，不是整份报纸或整本书|e · di · tion|edit + -ion: one d, then -tion|edit 加 -ion：一个 d，结尾 -tion
      coverage|every paper and channel reporting on a storm for hours|a game hardly reported in the papers|reporting that gives what both sides say|coverage is all the reporting about something; a broadcast is one program|coverage 是关于某事的全部报道；broadcast 是一档节目|broadcast is one program on radio or television, not all the reporting across papers and channels|broadcast 是一档广播或电视节目，不是报纸和频道的全部报道|byline is the line naming a story's writer, not the reporting itself|byline 是写明作者的一行，不是报道本身|cov · er · age|cover + -age|cover 加 -age
      correspondent|a reporter sending stories from Paris, where she lives|a reporter who covers the space program and every launch|a reporter risking his life at the front line of a war|a correspondent reports from one place or on one subject; an editor works at the desk|correspondent 专门报道某地或某领域；editor 在编辑部工作|editor works in the office choosing and correcting stories, not reporting from a faraway place or a launch site|editor 在编辑部挑选修改稿件，不是从远方或发射现场发回报道|byline is the line naming a writer, not the writer|byline 是署名那一行，不是写稿的人|cor · re · spond · ent|double r, and -ent at the end, not -ant|双写 r，结尾 -ent 不是 -ant
      tabloid|a paper with small pages and shouting headlines printing rumors|a paper of short, exciting stories not to be fully trusted|a paper filling its small front page with one huge photo|a tabloid is a kind of newspaper; an edition is one printing of any paper|tabloid 是一类报纸；edition 是任何报刊的一次印刷|edition is one printing of any paper or book, not a kind of newspaper full of rumors and short, exciting stories|edition 是任何报刊或书的一次印刷，不是一类充满传闻和短小刺激故事的报纸|byline is the line naming a writer, not a kind of newspaper|byline 是写明作者的一行，不是一类报纸|tab · loid|tab + -loid, ending in -oid|tab 加 -loid，结尾 -oid
    `,
  },
);

const ads = batch(
  "words-of-advertising",
  ["Words of Advertising", "广告的词"],
  ["advertising and selling", "广告与销售"],
  `
  slogan|a short, catchy phrase used to sell something or support a cause|口号，标语|The shoe company's ___, the three words Just Keep Running, was on every poster.|The team's ___, One Team One Dream, was printed in words across every shirt.|The campaign's ___, Every Vote Counts, was painted on walls all over town.|jingle,logo|slogans
  brand|the name of a product made by a particular company|品牌|Which ___ of cereal do you like best?|That ___ of jeans is famous all over the world, so they cost more.|The supermarket's own ___ of rice is cheaper than the famous one.|logo,sponsor|brands
  endorse|to say publicly that you support a person or product|代言，公开支持|The famous singer agreed to ___ the mayor, saying publicly that she would vote for him.|The newspaper will ___ one candidate in the election.|The doctors refused to ___ the pill, saying they could not support it.|sponsor,advertise|endorsed,endorses
  sponsor|a company or person that pays for an event in return for advertising|赞助者；赞助|A bank was the main ___ of the race and paid for the prizes.|The shop will ___ our team's shirts and pay for every one.|Each ___ that paid for the fair had its name on a banner.|endorse,commercial|sponsors,sponsored
  commercial|an advertisement on radio or television|商业广告|The TV ___ showed happy children eating cereal.|We skipped the ___ during the game on television.|A thirty-second ___ shown on TV during the final can cost millions.|jingle,slogan|commercials
  logo|a symbol that stands for a company or group|标志，徽标|The company's ___ was a simple green leaf.|The company's ___, a golden arch, is printed on every box.|Our club needs a new ___, so we are drawing a picture of a fox.|brand,slogan|logos
  discount|an amount taken off the usual price|折扣|Students get a ten percent ___ off the usual price.|The shop took money off old stock, giving a ___ of half the price.|Is there a ___ if I buy two?|cost,sponsor|discounts
  advertise|to tell the public about a product to make them buy it|做广告|The company will ___ its new phone on posters on buses.|They ___ their games with ads on the websites teenagers visit.|We put up posters to ___ the bake sale.|endorse,target|advertised,advertises
  jingle|a short, catchy song used in an advertisement|广告歌|I kept humming the ___ for the soap all day.|Every child could sing the ___ from the toy advert.|The ___ had just four notes and one rhyme.|slogan,commercial|jingles
  target|to aim something at a particular group; also the group aimed at|以……为目标；目标|The ads ___ parents of young children.|Teenagers are the ___ of this campaign.|They ___ sports fans with their posters at the stadium.|advertise,discount|targeted,targets
  `,
  "context-clues",
  {
    intro: t(
      "To launch its new juice, the company chose a bright **logo**, a catchy **jingle**, and a TV **commercial** made to **target** busy parents. These ten words help you notice how adverts try to persuade you.",
      "为了推出新果汁，公司选了醒目的标志（**logo**）、朗朗上口的广告歌（**jingle**），还拍了一条瞄准（**target**）忙碌父母的电视广告（**commercial**）。这十个词帮你看清广告怎样说服你。",
    ),
    watchOut: {
      meanings: t(
        "Tell **slogan** (a catchy phrase) apart from **jingle** (a catchy song) and **logo** (a symbol or picture).",
        "分清 **slogan**（朗朗上口的短语）、**jingle**（朗朗上口的广告歌）和 **logo**（图形标志）。",
      ),
      use: t(
        "Tell **endorse** (say in public that you support something) apart from **sponsor** (pay for an event) and **advertise** (tell the public about a product to sell it).",
        "分清 **endorse**（公开表示支持）、**sponsor**（出钱赞助活动）和 **advertise**（向公众宣传产品以促销）。",
      ),
      spelling: t(
        "Watch **advertise** (ending in *-ise*), **commercial** (double *m*, *-cial*), and **sponsor** (ending in *-or*).",
        "注意以 *-ise* 结尾的 **advertise**、**commercial**（双写 **m**，结尾 *-cial*）和以 *-or* 结尾的 **sponsor**。",
      ),
    },
    notes: `
      slogan|three words on every poster of a shoe company|a short phrase printed in words across every team shirt|a short phrase painted on walls during a campaign|a slogan is a catchy phrase; a jingle is a catchy song|slogan 是朗朗上口的短语；jingle 是朗朗上口的广告歌|jingle is a short song that is sung, not a phrase printed or painted in words|jingle 是唱出来的短歌，不是印在或画在墙上的短语|logo is a symbol or picture, not a phrase made of words|logo 是图形标志，不是文字短语|slo · gan|slo- + -gan, ending in -an|slo- 加 -gan，结尾 -an
      brand|a kind of cereal made by one company|jeans from one company famous all over the world|a supermarket's own cheaper kind of rice|a brand is a product name from one company; a logo is the symbol that stands for it|brand 是品牌；logo 是代表它的标志|logo is the symbol that stands for a company, not a named product you can choose, buy or eat|logo 是代表公司的图形，不是可以挑选、购买或食用的品牌产品|sponsor is a company that pays for an event, not a kind of product on a shelf|sponsor 是出钱赞助活动的公司，不是货架上的一种产品|br · and|the br- blend, ending in -and|开头 br- 连读，结尾 -and
      endorse|a singer saying publicly she would vote for the mayor|a newspaper backing one candidate in an election|doctors refusing to say they support a pill|endorse means say publicly that you support someone or something; advertise means tell the public about a product to sell it|endorse 指公开表示支持；advertise 指宣传产品以促销|sponsor means pay for an event in return for advertising, not say in public that you support a person or product|sponsor 指出钱赞助活动以换取广告，不是公开表态支持某人或某物|advertise means tell the public about a product so they buy it, not give your personal support to a candidate or a pill|advertise 指宣传产品让人购买，不是以个人名义支持候选人或药品|en · dorse|en- + dorse, ending in a silent e|en- 加 dorse，词尾 e 不发音
      sponsor|a bank paying for a race and its prizes|a shop paying for every one of a team's shirts|companies whose names went on banners after they paid for a fair|a sponsor pays for an event; endorse means say you support something|sponsor 出钱赞助；endorse 指公开表示支持|endorse means say publicly that you support someone, not pay for an event or for shirts|endorse 指公开表示支持某人，不是为活动或球衣出钱|commercial is an advertisement on radio or TV, not the company or person that pays for an event|commercial 是广播电视广告，不是出钱赞助活动的公司或个人|spon · sor|ending in -or, not -er|结尾 -or 不是 -er
      commercial|a TV advert showing happy children eating cereal|an advert skipped during a game on television|a thirty-second TV advert during the final costing millions|a commercial is a whole advert on radio or TV; a jingle is just its song|commercial 是完整的广播电视广告；jingle 只是广告中的歌|jingle is the short song in an advert, not a whole advert with pictures shown on TV|jingle 是广告里的短歌，不是有画面、在电视上播放的整条广告|slogan is a catchy phrase, not an advert shown on TV|slogan 是朗朗上口的短语，不是电视上播放的广告|com · mer · cial|double m, and -cial saying /shul/|双写 m，-cial 读 /ʃəl/
      logo|a company symbol shaped like a simple green leaf|a golden arch printed on every box|a picture of a fox drawn for a club|a logo is a symbol; a brand is the product name it stands for|logo 是标志图形；brand 是它代表的品牌|brand is the name of a company's product, not a picture or symbol|brand 是产品的牌子名称，不是图形或符号|slogan is a phrase made of words, not a picture or symbol|slogan 是文字短语，不是图形或符号|lo · go|lo + go, two long o's|lo 加 go，两个长音 o
      discount|ten percent off the usual price for students|half the price taken off old stock|a lower price for buying two|a discount is an amount taken off; cost is the full amount you pay|discount 是减掉的金额；cost 是要付的全部金额|cost is the amount you must pay, not an amount taken off the usual price|cost 是需要付的钱，不是从原价中减掉的部分|sponsor is a company that pays for an event, not money off a price|sponsor 是出钱赞助活动的公司，不是价格上的优惠|dis · count|dis- + count|dis- 加 count
      advertise|a company putting posters for its new phone on buses|ads for games on the websites teenagers visit|posters telling the town about a bake sale|advertise means tell the public about something; target means aim it at one group|advertise 指向公众宣传；target 指瞄准某一人群|endorse means say you personally support a person or product, not put up ads to tell the public about it|endorse 指以个人名义表示支持，不是张贴广告进行宣传|target means aim something at a particular group, not tell the public about a product|target 指瞄准某一人群，不是向公众宣传产品|ad · ver · tise|ending in -ise, not -ize|结尾是 -ise，不是 -ize
      jingle|a song for soap someone kept humming all day|a song from a toy advert every child could sing|a little tune of just four notes and one rhyme|a jingle is the catchy song; a slogan is a catchy phrase|jingle 是朗朗上口的广告歌；slogan 是朗朗上口的短语|slogan is a short phrase that is read or said, not a tune you hum or sing|slogan 是读或说出来的短语，不是可以哼唱的曲调|commercial is a whole advert on TV or radio, not just its little tune|commercial 是一整条广播电视广告，不只是其中的小曲|jin · gle|ending in -gle, as in single|结尾 -gle，和 single 一样
      target|ads aimed at parents of young children|teenagers as the group a campaign aims at|posters at a stadium aimed at sports fans|target means aim at one group; advertise means tell the public about a product|target 指瞄准某一人群；advertise 指向公众宣传|advertise means tell the public about a product, not choose one group of people to aim at|advertise 指向公众宣传产品，不是选定某一人群作为对象|discount is money taken off a price, not the people an ad is aimed at|discount 是价格的减免，不是广告针对的人群|tar · get|tar + get, with a hard g|tar 加 get，g 读硬音
    `,
  },
);

const internet = batch(
  "words-of-the-internet",
  ["Words of the Internet", "互联网的词"],
  ["the internet and online life", "互联网与网络生活"],
  `
  online|connected to or done on the internet|在线的，网上的|We bought the tickets ___ on the theater's website instead of at the box office.|She takes an ___ class, meeting her teacher over the internet each week.|Be careful what you share ___, where strangers on the internet can see it.|digital,viral
  website|a set of pages on the internet about one subject or company|网站|The museum's ___ lists its opening hours on its home page.|Check the zoo's ___ for ticket prices before you go.|She built a ___ with five pages for her bakery.|browser,password|websites
  browser|a program used to look at websites|浏览器|Open your ___ and type the website's address at the top.|The page will not load in that ___, so try a different program.|Update your ___ so websites load properly on your computer.|website,password|browsers
  download|to copy a file from the internet to your device|下载|___ the newspaper's app onto your phone to read the paper.|It took an hour to ___ the film onto my laptop, so I can watch it on the plane with no internet.|Never ___ files onto your computer from a site you do not trust.|upload,stream|downloaded,downloads
  upload|to send a file from your device to the internet|上传|She will ___ the photos from her camera to the class website tonight.|___ your homework to the school site before midnight so your teacher can see it.|The video took a long time to ___ from my phone to the internet.|download,stream|uploaded,uploads
  password|a secret word or set of letters and numbers that lets you into an account|密码|Never tell your ___ to anyone, or they can get into your account.|A strong ___ is long and hard to guess.|I forgot my ___ and could not log into my account.|privacy,browser|passwords
  privacy|the right to keep your personal life and information to yourself|隐私|Check the ___ settings so only friends can see your photos.|The app secretly collects data about you and does not respect your ___.|Everyone deserves ___: a diary is for its writer's eyes only.|password,surveillance
  digital|using computers and numbers to store information|数字的，数码的|We scanned the old photos to make a ___ copy on the computer.|___ cameras store pictures on a memory card instead of film.|A ___ watch shows the time in numbers instead of with hands.|online,viral
  stream|to watch or listen to something over the internet as it arrives|流媒体播放|Tonight we will ___ the concert live as it happens.|You can ___ the film tonight without saving a copy on your phone.|The game will ___ live on the club's site while it is played.|download,upload|streamed,streams,streaming
  viral|spreading quickly online from person to person|病毒式传播的|The video went ___ overnight, shared by millions of people.|A ___ post can reach millions in a day.|The joke went ___, jumping from phone to phone before anyone checked whether it was true.|online,digital
  `,
  "context-clues",
  {
    intro: t(
      "Mia opened her **browser**, went to the club's **website**, typed her **password**, and began to **stream** the match. These ten words help you talk about life on the internet and stay safe there.",
      "米娅打开浏览器（**browser**），进入俱乐部的网站（**website**），输入密码（**password**），开始在线观看（**stream**）比赛。这十个词帮你谈论网络生活，并在网上保护好自己。",
    ),
    watchOut: {
      meanings: t(
        "Tell **website** (the pages you visit) apart from **browser** (the program you use to visit them).",
        "分清 **website**（你访问的网页）和 **browser**（用来访问网页的程序）。",
      ),
      use: t(
        "Tell **download** (copy a file from the internet to your device) apart from **upload** (send a file from your device to the internet) and **stream** (watch or listen as it arrives, without keeping a copy).",
        "分清 **download**（把文件从网上存到设备）、**upload**（把文件从设备传到网上）和 **stream**（边传边看或听，不留副本）。",
      ),
      spelling: t(
        "Watch **privacy** (*private* drops *-te* and adds *-cy*), **browser** (*browse* drops its *e*), and **password** (*pass* keeps its double *s*).",
        "注意 **privacy**（*private* 去掉 *-te* 加 *-cy*）、**browser**（*browse* 去掉 *e*）和 **password**（*pass* 保留双写 **s**）。",
      ),
    },
    notes: `
      online|tickets bought on a theater's website|a class meeting a teacher over the internet|sharing where strangers on the internet can see it|online means done on the internet; digital means stored as numbers on a computer|online 指在网上进行；digital 指用数字形式存储|digital means stored with computers and numbers, not done or bought over the internet|digital 指用电脑和数字存储，不是在网上进行或购买|viral means spreading quickly from person to person, not simply done on the internet|viral 指在人与人之间迅速传播，不只是在网上进行|on · line|on + line, written as one word|on 加 line，连写成一个词
      website|a museum's home page listing opening hours|the pages of a zoo showing ticket prices|five pages built for a bakery|a website is the pages you visit; a browser is the program you visit them with|website 是你访问的网页；browser 是用来访问的程序|browser is the program for looking at pages, not the pages a museum, zoo or bakery puts online|browser 是浏览网页的程序，不是博物馆、动物园或面包店放到网上的网页|password is a secret word for an account, not a set of pages with hours or prices|password 是账户的密码，不是列出时间或价格的网页|web · site|web + site, written as one word|web 加 site，连写成一个词
      browser|a program where you type a website's address at the top|a program a page will not load in|a program you update so websites load properly|a browser is the program; a website is the pages it shows|browser 是程序；website 是它显示的网页|website is the pages you visit, not the program you open, update or try pages in|website 是你访问的网页，不是你打开、更新或用来加载网页的程序|password is a secret word for logging in, not a program that loads websites|password 是登录用的密码，不是加载网页的程序|brow · ser|browse drops its e before -er|browse 去掉 e 再加 -er
      download|putting a newspaper's app onto your phone|a film copied onto a laptop to watch with no internet|files coming onto your computer from a site|download means copy from the internet to your device; upload means send from your device to the internet|download 指从网上存到设备；upload 指从设备传到网上|upload means send a file from your device up to the internet, not copy it onto your phone or laptop|upload 指把文件从设备传到网上，不是存到手机或电脑上|stream means watch as it arrives without keeping a copy, not save a file to use with no internet|stream 指边传边看、不留副本，不是保存文件供离线使用|down · load|down + load, written as one word|down 加 load，连写成一个词
      upload|photos sent from a camera to a class website|homework sent to a school site for a teacher to see|a video going from a phone to the internet|upload means send from your device to the internet; download means the opposite|upload 指从设备传到网上；download 正好相反|download means copy a file from the internet onto your device, not send it from your phone or camera to a website|download 指把文件从网上存到设备，不是从手机或相机传到网站|stream means watch or listen over the internet, not send your own photos, homework or videos to a site|stream 指在网上观看或收听，不是把自己的照片、作业或视频传到网站|up · load|up + load, written as one word|up 加 load，连写成一个词
      password|a secret that lets someone into your account|something strong that is long and hard to guess|something forgotten so you could not log in|a password is a secret word for an account; privacy is your right to keep things to yourself|password 是账户密码；privacy 是保护个人信息的权利|privacy is the right to keep your life to yourself, not a secret word you type to log in|privacy 是保护个人生活的权利，不是登录时输入的密码|browser is a program for looking at websites, not a secret word that opens an account|browser 是浏览网页的程序，不是打开账户的密码|pass · word|double s in pass, then word|pass 里双写 s，再加 word
      privacy|settings so only friends see your photos|an app secretly collecting data about you|a diary for its writer's eyes only|privacy is keeping your life to yourself; surveillance is being watched|privacy 是保护个人隐私；surveillance 是被监视|password is a secret word for logging in, not the right to keep your life and photos to yourself|password 是登录用的密码，不是保护个人生活和照片的权利|surveillance means watching people closely, the very thing that takes away what a diary and private settings protect|surveillance 指严密监视他人，恰恰会夺走日记和隐私设置所保护的东西|pri · va · cy|private drops -te and adds -cy|private 去掉 -te 加 -cy
      digital|a copy of old photos scanned onto a computer|cameras storing pictures on a memory card instead of film|a watch showing the time in numbers|digital means stored as numbers by computers; online means done on the internet|digital 指以数字形式存储；online 指在网上进行|online means done over the internet, not stored on a card, a computer or a watch|online 指在网上进行，不是存在存储卡、电脑或手表里|viral means spreading quickly from person to person, not storing pictures or time as numbers|viral 指在人与人之间迅速传播，不是用数字存储图片或时间|di · gi · tal|a soft g, and ending in -tal, not -tle|g 读软音，结尾是 -tal，不是 -tle
      stream|a concert watched live as it happens|a film watched without saving a copy|a game shown live while it is played|stream means watch as it arrives; download means save a copy first|stream 指边传边看；download 指先保存副本|download means save a copy on your device, not watch live without keeping one|download 指把副本存到设备，不是不留副本地直播观看|upload means send your own file to the internet, not watch a concert or game as it happens|upload 指把自己的文件传到网上，不是实时观看音乐会或比赛|str · eam|the str- blend, then -eam as in dream|开头 str- 连读，结尾 -eam 和 dream 一样
      viral|a video shared by millions overnight|a post reaching millions in a day|a joke jumping from phone to phone|viral means spreading fast from person to person; online just means on the internet|viral 指在人与人之间快速传播；online 只表示在网上|online means on the internet, not spreading quickly to millions of people|online 只表示在网上，不是迅速传播到数百万人|digital means stored as numbers by computers, not shared quickly from person to person|digital 指以数字形式存储，不是在人与人之间迅速分享|vi · ral|vi- + -ral, as in virus|vi- 加 -ral，和 virus 同源
    `,
  },
);

/** batchesB are the batches of words of units 5 to 10 of grade 7. */
export const batchesB: readonly BatchSpec[] = [
  publicHealth,
  money,
  business,
  choices,
  sciFi,
  controlled,
  mind,
  rights,
  protest,
  speeches,
  flight,
  pilots,
  trial,
  news,
  ads,
  internet,
];
