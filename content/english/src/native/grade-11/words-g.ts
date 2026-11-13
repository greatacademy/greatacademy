// Grade 11: the batches of academic words for showing, for sorting and differing, for supporting, for research, for
// roles in institutions, for thinking ahead and for places and moving.

import type { BatchSpec } from "../batch.ts";
import { batch } from "../grade-5/batches.ts";

const showing = batch(
  "words-for-showing-and-seeing",
  ["Words for Showing and Seeing", "展示与看见的词"],
  ["academic words for pictures, sight and what is plain to see", "表示图像、视觉和显而易见的学术词"],
  `
  depict|to show or represent in a picture or in words|描绘，描述|The painting will ___ a battle.|The film tries to ___ life in prison.|How does the poet ___ the sea?|expose,evident|depicted,depiction
  illustrate|to explain by examples or pictures|说明，图解|Let me ___ my point with a story.|She was hired to ___ the book.|The chart helps ___ the trend.|expose,visible|illustrated,illustration
  highlight|to draw special attention to; the best part|强调；最精彩部分|The report will ___ three problems.|The goal was the ___ of the match.|Use a pen to ___ key words.|visible,evident|highlighted
  visible|able to be seen|可见的|The stars are ___ tonight.|The mountain is ___ from the town.|There was no ___ damage.|visual,vision|visibly,visibility
  visual|relating to seeing or sight|视觉的|The film has great ___ effects.|She has a strong ___ memory.|Use ___ aids in your talk.|visible,vision|visually
  vision|the ability to see; an idea of the future|视力；远见|He has poor ___ in one eye.|The leader had a ___ of a fairer society.|She saw a ___ in her dream.|image,visual|visions,visionary
  image|a picture or likeness; the way something is seen by the public|图像；形象|The ___ on the screen was blurred.|The firm wants to improve its ___.|She is the ___ of her mother.|vision,depict|images,imagery
  expose|to uncover; to make something secret known|暴露；揭露|The reporter wanted to ___ the fraud.|Don't ___ your skin to the sun too long.|The test will ___ any weakness.|depict,visual|exposed,exposure
  evident|plain or obvious|明显的|It was ___ that she was tired.|Her joy was ___ to everyone.|The damage is ___.|visual,vision|evidently
  apparent|clearly visible or understood; seeming real but perhaps not|明显的；表面上的|For no ___ reason, he left.|It soon became ___ that we were lost.|Her ___ calm hid her fear.|visual,vision|apparently
  `,
);

const sorting = batch(
  "words-for-sorting-and-differing",
  ["Words for Sorting and Differing", "分类与差异的词"],
  ["academic words for telling things apart and for sameness", "表示区分与相同的学术词"],
  `
  distinct|recognizably different; clear|截然不同的；清楚的|The two words have ___ meanings.|There was a ___ smell of gas.|She has a ___ accent.|discrete,diverse|distinctly,distinction
  discrete|separate and distinct|分离的，不连续的|The course has five ___ parts.|Count the ___ steps.|The data fall into ___ groups.|equate,vary|discretely
  differentiate|to recognize or show what makes things different|区分，区别|Can you ___ the twins?|Color helps ___ the species.|The firm tries to ___ its products.|discriminate,equate|differentiated,differentiation
  discriminate|to recognize a difference; to treat people unfairly|区别；歧视|It is illegal to ___ against women.|Bats can ___ between sounds.|Banks must not ___ on age.|differentiate,distort|discriminated
  diverse|showing a great deal of variety|多种多样的|The city has a ___ population.|They have ___ interests.|The forest is home to ___ birds.|uniform,equate|diversity,diversify
  vary|to differ in size, amount or degree|变化，不同|Prices ___ from shop to shop.|The weather may ___ by the hour.|Try to ___ your diet.|reverse,distort|variety
  uniform|remaining the same in all cases; a set of special clothes|一致的；制服|The rooms are of ___ size.|Pupils must wear a ___.|Rules should be ___ across schools.|diverse,discrete|
  equate|to consider one thing to be the same as another|等同|Don't ___ wealth with happiness.|Many ___ silence with agreement.|We cannot ___ the two crimes.|differentiate,vary|equated,equation
  distort|to pull out of shape; to give a false account of|扭曲；歪曲|The mirror will ___ your face.|The press may ___ the facts.|Heat can ___ plastic.|reverse,discriminate|distorted,distortion
  reverse|to move backward; to change to the opposite|倒车；推翻|She had to ___ the car out of the drive.|The court may ___ the decision.|The trend began to ___.|distort,vary|reversed,reversal
  `,
);

const support = batch(
  "words-for-supporting-and-making-up",
  ["Words for Supporting and Making Up", "支持与补足的词"],
  ["academic words for helping, adding and standing in", "表示帮助、补充和替代的学术词"],
  `
  accommodate|to provide room for; to fit in with someone's wishes|容纳；迁就|The hall can ___ five hundred people.|We will try to ___ your needs.|The hotel can ___ pets.|equip,compensate|accommodated,accommodation
  compensate|to make up for something; to pay for a loss|补偿，弥补|Nothing can ___ for the loss of a child.|The firm must ___ the workers.|Hard work can ___ for lack of talent.|supplement,mediate|compensated,compensation
  complement|to add to something in a way that improves it|补充，衬托|The wine will ___ the fish.|Her skills ___ his.|The colors ___ each other.|supplement,substitute|complemented
  supplement|something added to complete or improve; to add to|补充(物)|She takes a vitamin ___.|He works at night to ___ his income.|The paper has a Sunday ___.|complement,substitute|supplemented,supplementary
  substitute|a person or thing acting in place of another; to use instead|替代者；代替|There is no ___ for hard work.|You can ___ honey for sugar.|The ___ scored the winning goal.|supplement,guarantee|substituted,substitution
  equip|to supply with the necessary items|装备|We will ___ the lab with new tools.|School should ___ children for life.|They had to ___ the army.|enable,accommodate|equipped
  enable|to give the means or ability to do something|使能够|The loan will ___ her to buy a house.|The app can ___ users to share files.|Practice will ___ you to improve.|equip,sustain|enabled
  sustain|to keep something going over time; to suffer|维持；遭受|We cannot ___ this pace.|The driver did ___ serious injuries.|Food and water ___ life.|enable,guarantee|sustained
  guarantee|a formal promise; to promise with certainty|保证|The watch has a two-year ___.|I can ___ you will enjoy it.|Money does not ___ happiness.|sustain,mediate|guaranteed
  mediate|to try to settle a dispute between others|调解|The UN offered to ___ in the conflict.|A teacher will ___ between the boys.|She was asked to ___ the talks.|compensate,accommodate|mediated,mediation,mediator
  `,
);

const research = batch(
  "words-for-research-and-numbers",
  ["Words for Research and Numbers", "研究与数据的词"],
  ["academic words for studying, counting and predicting", "表示研究、计数和预测的学术词"],
  `
  survey|a study of opinions or behavior made by asking people; to look over|调查；审视|A ___ of students found most liked the food.|She stood on the hill to ___ the land.|The ___ asked about sleep.|statistic,thesis|surveyed,surveys
  statistic|a fact or piece of data from a study of numbers|统计数字|One ___ shows that crime has fallen.|That ___ shocked the minister.|Each ___ was checked twice.|ratio,survey|statistics,statistical
  ratio|the relation between two amounts|比率，比例|The ___ of boys to girls is two to one.|Mix sand and cement in a ___ of three to one.|The ___ of teachers to pupils is low.|index,formula|ratios
  simulate|to imitate the appearance or character of|模拟|The game will ___ flying a plane.|They ___ an earthquake in the lab.|He tried to ___ interest.|predict,random|simulated,simulation
  predict|to say that something will happen in the future|预测|It is hard to ___ the weather.|Experts ___ a fall in prices.|Who could ___ the result?|simulate,survey|predicted,prediction,predictable
  formula|a rule written in symbols; a fixed method|公式；方案|Learn the ___ for the area of a circle.|There is no ___ for success.|The chemical ___ for water is H2O.|ratio,thesis|formulas,formulae
  index|an alphabetical list at the back of a book; a measure of change|索引；指数|Look up the word in the ___.|The price ___ rose last month.|The book has no ___.|formula,insight|indexes,indices
  thesis|a statement put forward to be argued; a long essay for a degree|论点；论文|State your ___ in the first paragraph.|She wrote her ___ on bees.|His ___ is that cities make people lonely.|insight,survey|theses
  insight|a deep understanding of a person or thing|洞察力|The book gives ___ into life in prison.|She has great ___.|The study offers new ___.|thesis,index|insights,insightful
  random|made or happening without method or conscious decision|随机的|Pick a ___ number.|The winners were chosen at ___.|He made a ___ guess.|simulate,predict|randomly
  `,
);

const roles = batch(
  "words-for-roles-and-institutions",
  ["Words for Roles and Institutions", "角色与机构的词"],
  ["academic words for people at work and the bodies they serve", "表示工作者及其所服务机构的学术词"],
  `
  practitioner|a person actively engaged in an art or profession|从业者|She is a medical ___.|Every ___ needs a license.|The workshop is for every ___ of yoga.|successor,welfare|practitioners
  professional|relating to a job that needs special training; a person in such a job|职业的；专业人士|She is a ___ singer.|Seek ___ advice.|He acted like a true ___.|practitioner,corporate|professionally,professionalism
  successor|a person or thing that follows another|继任者|The king named his ___.|Who will be her ___ as head?|The new phone is the ___ to the old model.|affiliate,practitioner|successors
  affiliate|a person or group officially attached to a larger body; to attach|附属机构；使隶属|The station is an ___ of the network.|The club chose to ___ with the national body.|Each ___ pays a fee.|institute,successor|affiliated,affiliation
  panel|a small group of people brought together to discuss or judge|小组，评审团|A ___ of experts judged the contest.|She sat on the ___.|The ___ will decide tomorrow.|institute,ministry|panels
  institute|an organization for a particular purpose; to set up|研究所；建立|She works at a research ___.|They will ___ new rules.|The ___ trains nurses.|panel,ministry|instituted
  ministry|a government department headed by a minister|(政府)部|The ___ of health issued a warning.|He works for the ___.|The ___ will fund new schools.|sector,institute|ministries
  sector|a distinct part of the economy or of an area|部门；区域|The public ___ employs many people.|Jobs in the farming ___ are falling.|The army controls the northern ___.|ministry,welfare|sectors
  corporate|relating to a large company|公司的|She works in ___ law.|The firm has a ___ office in London.|___ greed caused the crisis.|professional,welfare|
  welfare|health, happiness and fortunes; aid given by the state|福利|We care about the ___ of our pupils.|They lived on ___.|The state spends a lot on ___.|sector,corporate|
  `,
);

const ahead = batch(
  "words-for-thinking-ahead",
  ["Words for Thinking Ahead", "预想与观念的词"],
  ["academic words for assuming, expecting, believing and leaning", "表示假定、预期、信念和倾向的学术词"],
  `
  presume|to suppose that something is true without proof|假定，认为|I ___ you have eaten.|We must not ___ guilt.|Don't ___ to know what I think.|anticipate,incline|presumed,presumably,presumption
  anticipate|to expect or predict; to act in advance|预期；预料|We ___ a large crowd.|She tried to ___ every question.|Nobody could ___ the storm.|presume,prospect|anticipated,anticipation
  notion|a belief or idea|观念，想法|She had no ___ of what to do.|The ___ that money buys happiness is false.|He had a vague ___ of the answer.|ideology,norm|notions
  ideology|a system of ideas, especially political ones|意识形态|The party has a clear ___.|They fought over ___.|Each ___ claims to know the truth.|notion,ethic|ideologies,ideological
  rational|based on reason or logic|理性的|There must be a ___ explanation.|She made a ___ choice.|Try to stay ___.|norm,scenario|rationally,rationality
  norm|something usual, typical or standard|规范，常态|Working from home is now the ___.|Each culture has its own ___ of dress.|Such rudeness is not the ___.|ethic,notion|norms
  ethic|a set of moral principles|道德规范|She has a strong work ___.|The medical ___ forbids it.|Each profession has its own ___.|norm,ideology|
  scenario|a possible series of events|设想，情况|In the worst ___, we lose everything.|Let's imagine a ___.|The best ___ is a quick recovery.|prospect,rational|scenarios
  prospect|the possibility of some future event; a likely candidate|前景；可能的人选|There is little ___ of rain.|The ___ of a new job excited her.|He is a bright ___ for the team.|scenario,anticipate|prospects,prospective
  incline|to feel willing or favorably disposed; a slope|倾向于；斜坡|I ___ to agree with you.|The road runs up a steep ___.|They ___ toward the left.|presume,anticipate|inclined,inclination
  `,
);

const places = batch(
  "words-for-places-and-moving",
  ["Words for Places and Moving", "地点与迁移的词"],
  ["academic words for being somewhere and going elsewhere", "表示所在之处与去往他处的学术词"],
  `
  transfer|to move from one place to another|转移，调动|She asked to ___ to another school.|You can ___ money online.|The player will ___ to a new club.|transit,displace|transferred
  transit|the carrying of people or goods from one place to another|运输，中转|The parcel was lost in ___.|Public ___ is cheap here.|We were in ___ for two days.|transfer,overseas|
  displace|to force someone to leave home; to take the place of|使离开家园；取代|The war will ___ millions.|Robots may ___ many workers.|The dam would ___ three villages.|transfer,occupy|displacement
  immigrate|to come to live permanently in a foreign country|移民(入境)|Her family chose to ___ to Canada.|Many hoped to ___ after the war.|They plan to ___ next year.|reside,locate|
  locate|to discover the exact place of; to place|找到；位于|We could not ___ the file.|The firm will ___ its office downtown.|Can you ___ the town on the map?|orient,reside|located
  reside|to have one's permanent home in a place|居住|They ___ in Paris.|The power will ___ with the board.|He used to ___ abroad.|occupy,immigrate|resided,resident,residence
  occupy|to live in or use a place; to take control of; to keep busy|占据；使忙碌|Soldiers began to ___ the town.|The tenants ___ the top floor.|Games ___ the children.|reside,displace|occupied,occupation,occupant
  orient|to find one's position; to aim something at a group|确定方位；使适应|Use the map to ___ yourself.|The course will ___ new students.|They ___ the program toward teens.|locate,transfer|oriented,orientation
  overseas|in or to a foreign country, especially across the sea|海外的|She studied ___ for a year.|___ sales rose.|He took a job ___.|domestic,transit|
  domestic|relating to the home; of one's own country|家庭的；国内的|They shared the ___ chores.|___ flights are cheaper.|The cat is a ___ animal.|overseas,transit|domestically
  `,
);

/** batchesG are the academic words for showing, sorting, supporting, research, roles, thinking ahead and places. */
export const batchesG: readonly BatchSpec[] = [showing, sorting, support, research, roles, ahead, places];
