// Grade 10: the batches of words of the later units, from journalism and the media to economics, careers, satire
// and folly, with two batches of academic words.

import type { BatchSpec } from "../batch.ts";
import { batch } from "../grade-5/batches.ts";

const journalism = batch(
  "words-of-journalism-and-ethics",
  ["Words of Journalism and Ethics", "新闻与新闻伦理的词"],
  ["journalism and its ethics", "新闻及其伦理"],
  `
  objectivity|the quality of reporting facts without letting one's own feelings take sides|客观性|Reporters strive for ___ even when the story upsets them.|The article lost its ___ when the writer mocked one side.|___ is the first rule of the newsroom.|slander,credibility|objectively
  slander|a false spoken statement that damages someone's reputation|诽谤(口头)|Spreading that rumor is ___.|She sued her neighbor for ___.|Libel is written; ___ is spoken.|libel,allege|slanderous
  impartial|treating all sides equally; not biased|公正的，不偏不倚的|A judge must be ___.|The panel gave an ___ review of the evidence.|We need an ___ referee for the final.|exposé,retract|impartially,impartiality
  exposé|a news report that reveals something shameful that was hidden|揭露性报道|Her ___ on the factory led to new laws.|The magazine published an ___ of the scandal.|The ___ shocked the city.|libel,whistleblower|exposés
  retract|to take back a statement or claim publicly|撤回，收回|The paper had to ___ the false story.|He refused to ___ his accusation.|The scientist ___ the study when errors were found.|libel,allege|retracted,retraction
  allege|to claim that something is true without yet proving it|声称，指控|The report goes on to ___ that the mayor took bribes.|Police ___ that the man stole the car.|It is easy to ___ and hard to prove.|libel,retract|alleged,allegation,allegedly
  libel|a false written statement that damages a person's reputation|诽谤(书面)|The actor sued the magazine for ___.|Printing that rumor would be ___.|Laws against ___ protect people from lies in print.|sensationalism,whistleblower|libelous
  sensationalism|presenting news in a shocking way to attract attention rather than to inform|哗众取宠，煽情主义|The headline was pure ___.|Critics accused the channel of ___.|___ sells papers but misleads readers.|objectivity,whistleblower|sensational,sensationalist
  whistleblower|a person who reveals wrongdoing inside an organization|告密者，揭发者|The ___ leaked the secret files to a reporter.|Laws protect a ___ from being fired.|The ___ risked her career to tell the truth.|exposé,slander|whistleblowers
  credibility|the quality of being believed and trusted|可信度，信誉|One false story can ruin a newspaper's ___.|The witness lost all ___ when she changed her story.|Experts lend ___ to a report.|objectivity,sensationalism
  `,
);

const media = batch(
  "words-of-media-and-attention",
  ["Words of Media and Attention", "媒体与注意力的词"],
  ["the media and how it holds our attention", "媒体及其对注意力的吸引"],
  `
  influencer|a person who uses their online following to shape what others buy or think|网红，有影响力的人|The ___ promoted a new brand of shoes.|An ___ with millions of followers can start a trend.|Not every ___ tells the truth.|platform,meme|influencers
  platform|a website or service on which people share content|平台|The video went viral on every ___.|Each ___ has its own rules for posts.|She built her audience on a new ___.|meme,clickbait|platforms
  meme|an image, phrase or idea that spreads quickly online|网络迷因|The ___ was shared millions of times.|A joke from the debate became a ___.|Each new ___ fades in a week.|influencer,clickbait|memes
  clickbait|online content with a misleading or shocking headline meant to get clicks|标题党，点击诱饵|"You won't believe what happened next" is classic ___.|The article was ___ with nothing new inside.|She learned to ignore ___.|curate,ubiquitous
  ubiquitous|seeming to be everywhere at once|无处不在的|Phones are now ___ in classrooms.|The singer's face was ___ that summer.|Ads have become ___ online.|aggregate,curate|ubiquity
  curate|to select and arrange content for an audience|策划，挑选(内容)|Each week she will ___ a list of the best articles.|Museums ___ exhibits with great care.|Apps ___ a feed for each user.|aggregate,notification|curated,curator
  aggregate|to collect many items into one whole; a total formed this way|汇集；总计|The website will ___ news from hundreds of sources.|In the ___, the reviews were positive.|The app ___ data from many sensors.|curate,notification|aggregated,aggregator
  notification|a message from an app that appears on a screen to get your attention|通知，提醒|Every ___ pulls her away from her homework.|He turned off each ___ during the exam.|A buzzing ___ interrupted the film.|distraction,engagement|notifications
  distraction|something that takes your attention away from what you should be doing|分心的事物|Notifications are a constant ___.|The noise was a ___ during the test.|She turned off her phone to avoid ___.|engagement,influencer|distractions,distract
  engagement|the amount of attention and interaction that content receives|参与度，互动|The post drew huge ___.|Apps are built to maximize ___.|High ___ does not mean high quality.|distraction,influencer
  `,
);

const economics = batch(
  "words-of-economics",
  ["Words of Economics", "经济学的词"],
  ["how economies work", "经济的运作"],
  `
  austerity|strict cuts in government spending to reduce debt|紧缩(政策)|The government's ___ closed libraries and clinics.|Years of ___ angered voters.|Economists argued over whether ___ works.|stagnation,subsidy
  recession|a period when an economy shrinks and many people lose jobs|经济衰退|Many shops closed during the ___.|Economists warned of a coming ___.|The country slowly recovered from the ___.|stagnation,deficit|recessions
  stagnation|a long period with little or no growth|停滞|After the boom came ten years of ___.|Wages showed ___ for a decade.|The town fell into ___ when the mine closed.|recession,austerity
  deficit|the amount by which money spent is more than money received|赤字，亏空|The city faced a large budget ___.|To close the ___, they cut spending.|A trade ___ means a country buys more than it sells.|depreciation,subsidy|deficits
  depreciation|a fall in the value of something over time|贬值，折旧|A new car suffers rapid ___.|The ___ of the currency made imports expensive.|Machines lose value through ___.|dividend,liquidity
  subsidy|money a government gives to help keep prices low or support an industry|补贴|Farmers receive a ___ for growing wheat.|The bus fare is low because of a city ___.|Critics say the ___ wastes money.|dividend,liquidity|subsidies,subsidize
  dividend|a share of a company's profits paid to its owners|股息，红利|Shareholders received a ___ each year.|The company cut its ___ after a bad year.|Hard work paid a ___ in the end.|depreciation,deficit|dividends
  liquidity|how easily something can be turned into cash|流动性，变现能力|Cash has more ___ than a house.|The bank faced a ___ crisis.|Investors want ___ in case they need money fast.|dividend,insolvent
  fiscal|having to do with government money, taxes and spending|财政的|The ___ year begins in April.|The mayor promised ___ responsibility.|The country faces a ___ crisis.|insolvent,austerity|fiscally
  insolvent|unable to pay one's debts|无力偿还的，破产的|The firm was declared ___.|An ___ company must sell its assets.|Bad loans left the bank ___.|liquidity,fiscal|insolvency
  `,
);

const careers = batch(
  "words-of-careers-and-employment",
  ["Words of Careers and Employment", "职业与就业的词"],
  ["careers and finding work", "职业与求职"],
  `
  vocation|a kind of work that a person feels called to and suited for|职业，使命|Teaching was her true ___.|He found his ___ in nursing.|For some, art is a ___ rather than a job.|avocation,apprenticeship|vocations,vocational
  avocation|an activity done for pleasure outside one's main work; a hobby|副业，业余爱好|Her ___ is bird watching.|Music is his ___, not his job.|What began as an ___ became a business.|vocation,apprenticeship|avocations
  apprenticeship|a period of learning a trade by working under a skilled worker|学徒期|He served a four-year ___ with a carpenter.|The ___ taught her to repair engines.|Many trades still begin with an ___.|résumé,credential|apprenticeships
  credential|a document or qualification that shows a person is fit for a job|资格证书，凭证|A nursing license is an important ___.|She listed every ___ on her résumé.|The guard checked each visitor's ___.|apprenticeship,reference
  résumé|a short written summary of a person's education and work experience|简历|Keep your ___ to one page.|She sent her ___ to twenty companies.|His ___ listed three summer jobs.|reference,credential|résumés
  reference|a person who can describe your character and work to an employer|推荐人，介绍人|Her old coach agreed to be a ___.|Employers usually call at least one ___.|Name a ___ who knows your work well.|résumé,credential|references
  freelance|working for several employers on single jobs rather than for one employer|自由职业的|She works as a ___ designer.|___ writers are paid by the article.|After ten years in an office, he went ___.|vocation,avocation|freelancer,freelancers
  negotiate|to discuss something in order to reach an agreement|谈判，协商|She learned to ___ a higher salary.|The workers ___ with the owners for weeks.|You can ___ the price of a used car.|stipulate,remuneration|negotiated,negotiation
  stipulate|to state clearly as a condition of an agreement|规定，约定|The contract will ___ two weeks of vacation.|Her parents ___ that she finish her homework first.|The rules ___ a maximum of three players.|negotiate,remuneration|stipulated,stipulation
  remuneration|money paid for work or a service|报酬，酬劳|The ___ for the job was generous.|Volunteers receive no ___.|The board voted on the director's ___.|vocation,credential
  `,
);

const satire = batch(
  "words-of-satire-and-wit",
  ["Words of Satire and Wit", "讽刺与机智的词"],
  ["satire and wit", "讽刺与机智"],
  `
  ridicule|words or actions meant to make someone look foolish|嘲笑，奚落|The new hat drew the ___ of his classmates.|Satirists use ___ to expose the powerful.|She endured years of ___ for her ideas.|lampoon,witticism
  witticism|a clever, funny remark|妙语，俏皮话|Oscar Wilde was famous for every ___.|Her ___ made the whole table laugh.|He saved his best ___ for the end.|ridicule,understatement|witticisms
  lampoon|to mock someone publicly in writing or a drawing|讽刺，嘲讽|Cartoonists love to ___ politicians.|The magazine went on to ___ the mayor's plans.|The play sets out to ___ the vanity of the rich.|burlesque,irreverent|lampooned
  burlesque|a comic imitation that treats a serious subject in a silly way, or a silly one seriously|滑稽戏，讽刺剧|The play is a ___ of grand opera.|In the ___, the king is a clumsy fool.|The poem is a ___ of epic heroes fighting over a lock of hair.|irreverent,caustic
  irreverent|showing a lack of respect for things usually taken seriously|不敬的，玩世不恭的|The comic's ___ jokes about the royal family drew laughs.|Her ___ tone surprised the teachers.|The magazine is famous for its ___ humor.|hyperbole,caustic|irreverence
  caustic|sharply and bitterly critical|尖刻的，挖苦的|The critic's ___ review sank the play.|He has a ___ wit.|Her ___ remarks hurt her friends.|irreverent,hyperbole|caustically
  hyperbole|deliberate and extreme exaggeration|夸张(修辞)|"I've told you a million times" is ___.|The ad's ___ fooled no one.|Satirists use ___ to expose foolishness.|understatement,travesty|hyperbolic
  understatement|describing something as smaller or less serious than it is|轻描淡写，低调陈述|Calling the hurricane "a bit of wind" was an ___.|British humor is famous for ___.|"It was not my best day," he said, after crashing the car, in a classic ___.|hyperbole,travesty
  travesty|a false or absurd version of something, so bad that it mocks it|歪曲，拙劣的模仿|The trial was a ___ of justice.|The film is a ___ of the novel.|Calling that a fair vote is a ___.|burlesque,incongruity
  incongruity|the quality of being out of place or not fitting with what is around|不协调，不一致|The ___ of a tuxedo at the beach made everyone laugh.|Comedy often comes from ___.|The ___ between his words and actions was striking.|ridicule,hyperbole|incongruous
  `,
);

const folly = batch(
  "words-of-folly-and-vanity",
  ["Words of Folly and Vanity", "愚蠢与虚荣的词"],
  ["foolishness and vanity", "愚蠢与虚荣"],
  `
  folly|a foolish act or idea|愚蠢，愚行|It was ___ to sail without a map.|The play mocks the ___ of the rich.|His great ___ was trusting a flatterer.|pompous,vanity|follies
  vanity|too much pride in one's looks or achievements|虚荣，自负|The queen's ___ made her hate the mirror.|His ___ led him to lie about his past.|Satire often targets ___.|pompous,folly|vain
  pompous|acting in a grand, self-important way|自负的，浮夸的|The ___ mayor gave a two-hour speech about himself.|His ___ tone annoyed the audience.|The ___ professor corrected everyone's grammar.|sycophant,obsequious|pompously,pomposity
  obsequious|too eager to please or obey|奉承的，谄媚的|The ___ servant agreed with everything the lord said.|Her ___ praise was embarrassing.|An ___ assistant laughed at all the boss's jokes.|pompous,sycophant|obsequiously
  sycophant|a person who flatters powerful people to gain favor|马屁精，谄媚者|The king listened to a ___ instead of his generals.|Only a ___ would praise such a bad plan.|The ___ hoped for a promotion.|gullible,pretentious|sycophants,sycophantic
  gullible|easily tricked into believing something|轻信的，易受骗的|The ___ man bought a bridge that was not for sale.|Advertisers count on ___ buyers.|Don't be so ___; check the facts.|pretentious,complacent|gullibility
  pretentious|trying to seem more important or cultured than one is|自命不凡的，矫饰的|The ___ menu was written in bad French.|He used ___ words to impress the guests.|Critics called the film ___.|complacent,pompous|pretentiously,pretension
  complacent|too satisfied with oneself to notice dangers or the need to improve|自满的，沾沾自喜的|The team grew ___ after winning three games.|A ___ government ignored the warnings.|Never become ___ about safety.|charlatan,absurd|complacency
  charlatan|a person who falsely claims special knowledge or skill|骗子，江湖郎中|The ___ sold a "cure" made of water and sugar.|Critics called the fortune teller a ___.|The ___ fled town before the trick was discovered.|sycophant,pretentious|charlatans
  absurd|wildly unreasonable or ridiculous|荒谬的，荒唐的|The idea of a talking chair is ___.|The rule seemed ___ to the students.|The satire pushes the situation to ___ extremes.|folly,pompous|absurdity,absurdly
  `,
);

const academic6 = batch(
  "academic-words-6",
  ["Academic Words 6", "学术词汇 6"],
  ["reasoning and research in school", "学业中的推理与研究"],
  `
  parameter|a limit or rule that sets how something can be done|参数，界限|The study stayed within strict ___s.|Set the ___ before running the test.|The rules define the ___ of the debate.|proxy,cohort|parameters
  deviation|a difference from what is usual or expected|偏差，偏离|Any ___ from the plan must be approved.|The ___ in the results was small.|A ___ from the rule caused the error.|parameter,tentative|deviations,deviate
  longitudinal|following the same people or things over a long time|纵向的，长期的|A ___ study tracked the children for twenty years.|___ data show how habits change with age.|The survey is ___, not a single snapshot.|robust,tentative
  cohort|a group of people who share something, such as a year of birth, and are studied together|一群人，同期群|The study followed a ___ of students from age ten.|Each ___ was compared with the last.|Her ___ graduated during the recession.|parameter,proxy|cohorts
  proxy|something used to stand for something else that is hard to measure|代用指标，代理|Test scores are only a ___ for learning.|The researcher used income as a ___ for health.|Tree rings are a ___ for past rainfall.|cohort,parameter|proxies
  rigorous|very careful, thorough and exact|严格的，严谨的|The experiment followed a ___ method.|Her ___ checking caught every error.|Science demands ___ evidence.|robust,tentative|rigorously,rigor
  robust|strong and not easily weakened or shown to be wrong|稳健的，可靠的|The result was ___ across ten studies.|A ___ argument survives hard questions.|The bridge has a ___ design.|rigorous,inconclusive
  confound|to mix up factors so that a result is unclear; to confuse|混淆，使困惑|Hidden factors may ___ the results.|Poor sleep can ___ a study of diet.|The puzzle continues to ___ experts.|deviation,proxy|confounded,confounding
  inconclusive|not leading to a firm conclusion|不确定的，非决定性的|The tests were ___, so they ran them again.|The jury found the evidence ___.|An ___ result is still worth reporting.|robust,tentative
  tentative|not certain or fixed; offered as a trial|暂定的，试探性的|The scientists reached a ___ conclusion.|Their plans are only ___.|She took a ___ step onto the ice.|inconclusive,rigorous|tentatively
  `,
);

const academic7 = batch(
  "academic-words-7",
  ["Academic Words 7", "学术词汇 7"],
  ["discussing texts and ideas", "讨论文本与观点"],
  `
  discern|to notice or understand something that is not obvious|辨别，察觉|It is hard to ___ the author's true view.|Can you ___ a pattern in the data?|She could just ___ a figure in the fog.|posit,allude|discerned,discerning
  explicate|to explain a text or idea in detail|详细解释，阐明|The teacher will ___ the poem line by line.|Critics ___ the hidden meanings in the novel.|Can you ___ this passage for the class?|posit,juxtapose|explicated,explication
  juxtapose|to place things side by side to compare or contrast them|并置，并列|The photographer chose to ___ a palace with a slum.|Writers ___ light and dark images.|The poem seems to ___ youth and old age.|posit,substantive|juxtaposed
  posit|to put forward an idea as a basis for argument|假定，提出|The essay will ___ that the narrator lies.|Scientists ___ the existence of dark matter.|Some critics ___ a hidden meaning.|discern,allude|posited
  substantive|important, real and meaningful rather than slight|实质性的，重要的|The two plans have ___ differences.|Give ___ evidence, not just opinion.|The talks made ___ progress.|cursory,tangential|substantively
  pertinent|relevant to the matter being discussed|相关的，中肯的|Only include ___ details in the summary.|She asked a ___ question.|Is that quotation ___ to your claim?|tangential,substantive
  tangential|only slightly connected to the main subject|离题的，不相干的|His comment was ___ to the debate.|Cut the ___ paragraph about his dog.|The essay wanders into ___ topics.|pertinent,cursory|tangentially
  cursory|quick and not thorough|粗略的，草率的|A ___ glance missed the error.|She gave the poem only a ___ reading.|His ___ review missed the main point.|comprehensive,allude|cursorily
  comprehensive|including everything or nearly everything|全面的，综合的|The report gives a ___ account of the war.|A ___ exam tests the whole year's work.|She made a ___ list of sources.|cursory,substantive|comprehensively
  allude|to mention something indirectly|暗指，间接提到|The title seems to ___ to a myth.|He did not name her, but he seemed to ___ to her.|Writers often ___ to the Bible.|posit,explicate|allusion
  `,
);

/** batchesB are the batches of words of the later units of grade 10. */
export const batchesB: readonly BatchSpec[] = [journalism, media, economics, careers, satire, folly, academic6, academic7];
