// Grade 11: the batches of academic words for drafting, for gaining and giving, for meeting and talking, for inside and
// outside, for exactness and rank, for changing and handling, and for fitting and spreading.

import type { BatchSpec } from "../batch.ts";
import { batch } from "../grade-5/batches.ts";

const drafting = batch(
  "words-for-drafting-and-editing",
  ["Words for Drafting and Editing", "起草与编辑的词"],
  ["academic words for writing a text and making it clear", "表示撰写文本并使之清楚的学术词"],
  `
  clarify|to make a statement or situation clearer|澄清，阐明|Could you ___ what you mean?|The teacher will ___ the rules.|Let me ___ one point.|specify,edit|clarified,clarification
  specify|to state clearly and exactly|具体说明|Please ___ the size you need.|The rules ___ a start time of nine.|He did not ___ a date.|clarify,insert|specified,specification
  quote|to repeat words from a text or speaker; a price offered|引用；报价|She likes to ___ Shakespeare.|Get a ___ from three builders.|Don't ___ me on that.|paragraph,summary|quoted,quotation
  edit|to prepare a text by correcting and shortening it|编辑|She will ___ the magazine.|Please ___ your essay before you hand it in.|He had to ___ the film.|summary,paragraph|edited
  draft|a first version of a piece of writing; to write one|草稿；起草|Write a ___ of your speech.|The lawyer will ___ the contract.|This is only the first ___.|edit,append|drafted,drafts
  format|the way something is arranged or set out|格式，版式|The ___ of the exam has changed.|Save the file in a different ___.|The show has a new ___.|paragraph,insert|formatted,formatting
  paragraph|a section of a text that deals with one idea|段落|Begin a new ___ for each point.|The first ___ is too long.|Read the last ___ again.|summary,format|paragraphs
  summary|a brief statement of the main points|摘要，总结|Write a ___ of the chapter.|Here is a ___ of the news.|In ___, the plan failed.|paragraph,quote|summaries,summarize
  append|to add something to the end of a text|附加|Please ___ your notes to the report.|She chose to ___ a map to the book.|We will ___ a list of sources.|insert,specify|appended,appendix
  insert|to put something into something else|插入|___ the key in the lock.|Please ___ a coin.|She will ___ a new paragraph.|append,clarify|inserted,insertion
  `,
);

const gaining = batch(
  "words-for-gaining-and-giving",
  ["Words for Gaining and Giving", "获得与给予的词"],
  ["academic words for getting, chasing and handing out", "表示获取、追求和授予的学术词"],
  `
  acquisition|an asset or object bought or obtained; the learning of a skill|获得物；习得|The museum's latest ___ is a Roman vase.|Language ___ starts at birth.|The ___ of the firm cost millions.|devote,attain|acquisitions,acquire
  attain|to succeed in achieving|达到，获得|She hopes to ___ a high grade.|Few people ___ perfection.|He did ___ the rank of general.|devote,confer|attained,attainment
  confer|to grant a title or right; to discuss together|授予；商议|The university will ___ a degree on her.|The lawyers need to ___.|The title may ___ great honor.|grant,devote|conferred
  grant|a sum of money given for a purpose; to agree to give or allow|拨款；准予|She won a ___ to study abroad.|The king will ___ him a pardon.|I ___ that you are right.|confer,invest|granted
  devote|to give all or most of one's time or effort to|致力于，献身|She will ___ her life to music.|He chose to ___ an hour a day to reading.|Let's ___ this meeting to the budget.|invest,pursue|
  invest|to put money into something to make a profit; to spend time on|投资|They ___ in property.|It is wise to ___ in your health.|She will ___ her savings in shares.|devote,purchase|invested,investor
  purchase|to buy; something bought|购买；购买的东西|You can ___ tickets online.|Keep your receipt for every ___.|The ___ of a car is costly.|acquisition,seek|purchased,purchaser
  pursue|to follow in order to catch; to continue with a course of action|追赶；从事|The police began to ___ the thief.|She chose to ___ a career in law.|He will ___ the matter in court.|seek,attain|pursued,pursuit
  seek|to try to find or get|寻求|They ___ shelter from the rain.|You should ___ advice.|Many people ___ fame.|pursue,secure|sought
  secure|fixed or fastened so as not to give way; to succeed in getting|牢固的，安全的；获得|Make sure the door is ___.|She managed to ___ a place at college.|They feel ___ in their home.|attain,seek|secured,securely
  `,
);

const meeting = batch(
  "words-for-meeting-and-talking",
  ["Words for Meeting and Talking", "会面与交流的词"],
  ["academic words for coming together, joining in and disagreeing", "表示聚集、参与和争议的学术词"],
  `
  convene|to come or bring together for a meeting|召集，开会|The council will ___ on Monday.|She chose to ___ a meeting of the board.|Leaders will ___ in Geneva.|converse,coordinate|convened
  converse|to talk with someone; the opposite of a statement|交谈；相反的事物|They ___ in French.|The ___ is also true.|It is hard to ___ over the music.|correspond,convene|conversed
  correspond|to match closely; to write letters to someone|相符；通信|The two accounts do not ___.|She used to ___ with a pen friend.|The words ___ to the pictures.|converse,link|corresponded,corresponding
  coordinate|to bring the parts of an activity together; one of a pair of numbers marking a position|协调；坐标|She will ___ the project.|They must ___ their efforts.|Find the ___ on the map.|participate,convene|coordinated,coordinator
  participate|to take part|参加|All students must ___ in the game.|He refused to ___.|We hope you will ___ in the survey.|coordinate,intervene|participated,participant,participation
  intervene|to come between so as to prevent or alter a result|干预|The police had to ___.|The teacher will ___ if they fight.|Don't ___ in their argument.|participate,acknowledge|intervened,intervention
  acknowledge|to accept or admit the truth of; to show one has noticed|承认；致意|He refused to ___ his mistake.|She will ___ the help of her friends.|He did not ___ me in the street.|intervene,encounter|acknowledged,acknowledgment
  controversy|prolonged public disagreement|争议|The decision caused ___.|There is ___ over the new law.|She enjoys ___.|encounter,link|controversies,controversial
  encounter|an unexpected meeting; to meet unexpectedly|偶遇；遇到|We had a strange ___ in the woods.|You may ___ problems.|It was her first ___ with snow.|controversy,acknowledge|encountered
  link|a connection between two things; to connect|联系；连接|There is a ___ between smoking and cancer.|A bridge will ___ the two towns.|Click the ___ to read more.|correspond,coordinate|linked,linkage
  `,
);

const structure = batch(
  "words-for-inside-and-outside",
  ["Words for Inside and Outside", "内部与外部的词"],
  ["academic words for parts, areas and how things are arranged", "表示部分、领域和排列方式的学术词"],
  `
  internal|of or on the inside|内部的|The report deals with ___ affairs, not foreign ones.|He had ___ injuries, bleeding inside his body.|The ___ walls between the rooms are thin.|external,intermediate|internally
  external|belonging to or forming the outer surface|外部的|The cream is for ___ use only.|The ___ walls facing the street need paint.|They faced ___ pressure from other countries.|internal,adjacent|externally
  intermediate|coming between two things in time, place or order|中级的，中间的|She is in the ___ class.|There is an ___ stage.|The book is for ___ learners.|internal,configuration|
  adjacent|next to or adjoining something else|邻近的|Our house is ___ to the park.|They booked ___ rooms.|The ___ field belongs to a farmer.|external,section|
  configuration|an arrangement of parts|配置，布局|The ___ of the seats can change.|Check the ___ of your computer.|The star ___ looked like a bear.|infrastructure,entity|configurations
  infrastructure|the basic systems and structures a society needs|基础设施|The country needs new ___.|Roads and bridges are ___.|The war destroyed the ___.|configuration,sphere|
  domain|an area of activity or knowledge; an area owned by someone|领域；领地|The kitchen is her ___.|Biology is not my ___.|The forest was the king's ___.|sphere,entity|domains
  sphere|a round solid figure; an area of activity|球体；领域|The earth is nearly a ___.|She is famous in the political ___.|That is outside my ___ of interest.|domain,section|spheres,spherical
  entity|a thing with distinct and independent existence|实体|The new firm is a separate ___.|The club is a legal ___.|Each state is an independent ___.|domain,configuration|entities
  section|any of the parts into which something is divided|部分，章节|Read the first ___ of the book.|The ___ on grammar is short.|The brass ___ played loudly.|adjacent,sphere|sections
  `,
);

const exactness = batch(
  "words-for-exactness-and-rank",
  ["Words for Exactness and Rank", "精确与主次的词"],
  ["academic words for what is exact, first, main and only", "表示确切、最初、主要和唯一的学术词"],
  `
  definite|clearly stated or decided|明确的，确定的|We need a ___ answer.|There is a ___ improvement.|Is the date ___?|specific,overall|definitely
  specific|clearly defined or identified; particular|具体的，特定的|Can you be more ___?|The drug treats a ___ disease.|She had a ___ plan.|definite,sole|specifically
  initial|existing or occurring at the beginning; the first letter of a name|最初的；首字母|Her ___ reaction was shock.|The ___ cost was low.|Write your ___ here.|prior,prime|initially,initials
  prior|existing or coming before in time or importance|先前的|You need no ___ knowledge.|She had a ___ engagement.|The house was checked ___ to the sale.|initial,predominant|
  overall|taking everything into account|全面的，总的|The ___ cost was high.|___, the trip was a success.|She won the ___ prize.|definite,principal|
  predominant|present as the strongest or main element|主要的，占优势的|Red is the ___ color in the painting.|Fear was the ___ feeling.|The ___ view is that it will rain.|initial,prior|predominantly
  fundamental|forming a necessary base or core|基本的，根本的|Reading is a ___ skill.|There is a ___ flaw in the plan.|They made ___ changes.|principal,prime|fundamentally,fundamentals
  principal|first in order of importance; the head of a school|主要的；校长|The ___ of the school gave a speech.|The ___ called a meeting.|Rice is their ___ food.|specific,initial|principally
  prime|of first importance; the best part of something|首要的；全盛时期|She is the ___ suspect.|He was in the ___ of life.|The house is in a ___ location.|initial,fundamental|
  sole|one and only; the underside of a foot or shoe|唯一的；脚底|She is the ___ owner of the shop.|The ___ of my shoe has a hole.|His ___ aim is to win.|specific,overall|solely
  `,
);

const handling = batch(
  "words-for-changing-and-handling",
  ["Words for Changing and Handling", "改变与操控的词"],
  ["academic words for making, checking and controlling", "表示产生、检查和控制的学术词"],
  `
  alter|to change in character or composition|改变|The tailor will ___ the dress.|Nothing will ___ my decision.|The plan may ___ the town.|conform,manipulate|altered,alteration
  conform|to comply with rules or standards|遵守，顺从|All buildings must ___ to safety rules.|She refused to ___.|Pupils must ___ to the dress code.|alter,undergo|conformed
  manipulate|to control or influence cleverly or unfairly; to handle skillfully|操纵；熟练操作|He tried to ___ the voters.|She can ___ the puppet with ease.|Don't let them ___ you.|monitor,induce|manipulated,manipulation,manipulative
  monitor|to observe and check over time; a screen|监测；显示器|Doctors will ___ his heart.|Teachers ___ students' progress.|The ___ shows the image.|inspect,manipulate|monitored,monitoring
  inspect|to look at closely in order to assess|检查|Officers ___ every truck.|She will ___ the kitchen.|Let me ___ your work.|monitor,generate|inspected,inspection,inspector
  generate|to produce or create|产生|The plant will ___ electricity.|The idea may ___ interest.|Tourism will ___ jobs.|undergo,conform|generated
  induce|to succeed in persuading; to bring about|劝使；引起|Nothing could ___ her to stay.|The drug may ___ sleep.|Doctors had to ___ labor.|trigger,generate|induced,inducement
  trigger|to cause an event to happen; the part of a gun one pulls|引发；扳机|Dust may ___ an attack of asthma.|Pull the ___ slowly.|The news will ___ protests.|undergo,conform|triggered
  undergo|to experience something unpleasant or demanding|经历，经受|He will ___ surgery next week.|The city must ___ great change.|Recruits ___ hard training.|utilize,conform|underwent,undergone
  utilize|to make practical and effective use of|利用|We should ___ solar power.|The firm will ___ new methods.|They ___ every inch of the room.|undergo,alter|utilized,utilization
  `,
);

const fitting = batch(
  "words-for-fitting-and-spreading",
  ["Words for Fitting and Spreading", "相容与传播的词"],
  ["academic words for what is easy to reach, real, matching and widespread", "表示易得、真实、相容和普遍的学术词"],
  `
  accessible|able to be reached, entered or understood|可到达的；易懂的|The building is ___ to wheelchairs.|The book is ___ to young readers.|The island is ___ only by boat.|compatible,straightforward|accessibility
  authentic|genuine; of undisputed origin|真正的，正宗的|Is the painting ___?|They serve ___ Thai food.|Her fear seemed ___.|compatible,potential|authenticity
  compatible|able to exist or work together without conflict|兼容的，合得来的|The printer is ___ with my laptop.|They are not ___ as a couple.|Is the plan ___ with the law?|accessible,mutual|compatibility
  passive|accepting what happens without active response|被动的，消极的|He was too ___ to complain.|___ smoking harms children.|"The cake was eaten" is in the ___ voice.|positive,voluntary|passively
  positive|showing confidence or hope; certain; above zero|积极的；确定的|Stay ___!|I am ___ that I locked the door.|The test was ___.|passive,potential|positively
  potential|possible but not yet real; capacity to develop|潜在的；潜力|She has great ___.|They warned of ___ danger.|He is a ___ buyer.|positive,authentic|potentially
  straightforward|easy to do or understand; honest and frank|简单的；坦率的|The test was ___.|She gave a ___ answer.|The route is ___.|widespread,mutual|straightforwardly
  voluntary|done by choice; working without pay|自愿的|Attendance is ___.|She does ___ work at the hospital.|It was a ___ decision.|passive,mutual|voluntarily
  widespread|found or spread over a large area|普遍的，广泛的|There is ___ support for the plan.|The storm caused ___ damage.|The belief is ___.|straightforward,mutual|
  mutual|experienced or done by each of two or more people|相互的；共同的|The feeling is ___.|They have a ___ friend.|It is a matter of ___ respect.|compatible,voluntary|mutually
  `,
);

/** batchesH are the academic words for drafting, gaining, meeting, inside and outside, exactness, handling and fitting. */
export const batchesH: readonly BatchSpec[] = [drafting, gaining, meeting, structure, exactness, handling, fitting];
