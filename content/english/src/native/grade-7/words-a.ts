// Grade 7: the batches of words of the first five units, from debate, courts and rules to the deep sea, the
// Renaissance, the empires of West Africa and the fight against disease.

import type { BatchSpec } from "../batch.ts";
import { batch } from "../grade-5/batches.ts";

const debate = batch(
  "words-of-debate",
  ["Words of Debate", "辩论的词"],
  ["debate and discussion", "辩论与讨论"],
  `
  stance|a position or opinion that someone takes on a question|立场|Each speaker had to state a clear ___ on school uniforms.|Her ___ on homework changed after she read the study.|The mayor refused to take a ___ until the facts were in.|dispute,objection|stances
  compromise|an agreement in which each side gives up part of what it wants|妥协，折中|After an hour of arguing, the two teams reached a ___.|A good ___ left both sides partly happy.|The class voted for a ___: phones allowed at lunch but not in lessons.|concur,objection|compromises,compromised
  advocate|a person who speaks in support of a cause or another person|倡导者，拥护者|She has always been an ___ for clean parks in the city.|Every student needs an ___ who will speak up for them.|The doctor became an ___ of more sleep for teenagers.|proponent,moderator|advocates
  deliberate|done on purpose, after careful thought|故意的，深思熟虑的|Breaking the rule was a ___ choice, not an accident.|The judge spoke in a slow and ___ way.|It was a ___ plan to win the votes of younger readers.|unanimous,concur|deliberately
  dispute|a disagreement or argument, often a serious one|争端，争论|The ___ over the parking lot lasted for months.|The two neighbors settled their ___ in a calm meeting.|A ___ about the score stopped the game for ten minutes.|objection,stance|disputes,disputed
  objection|a reason given for not agreeing with something|异议，反对的理由|My main ___ to the plan is its cost.|The teacher listened to every ___ before deciding.|She raised an ___ when the vote was rushed.|dispute,stance|objections
  unanimous|agreed on by everyone in a group|一致同意的|The vote to add a recycling bin was ___: every hand went up.|The judges reached a ___ decision.|Not one member said no, so the choice was ___.|deliberate,compromise|unanimously
  moderator|a person who runs a debate or discussion and keeps it fair|主持人，仲裁人|The ___ gave each speaker two minutes to answer.|When the debate grew loud, the ___ asked for quiet.|Our teacher acted as ___ for the class discussion.|advocate,proponent|moderators
  proponent|a person who argues in favor of an idea or plan|支持者，提倡者|A ___ of the new bike lanes spoke first.|He is a strong ___ of a longer lunch break.|Every ___ of the plan had to answer the same three questions.|advocate,moderator|proponents
  concur|to agree with someone or with an opinion|同意，赞同|I ___ with my partner that the second reason is the strongest.|Most scientists ___ that the climate is warming.|The two judges did not ___ on the winner.|compromise,dispute|concurs,concurred
  `,
  "words-of-argument",
);

const courts = batch(
  "words-of-law-and-courts",
  ["Words of Law and Courts", "法律与法庭的词"],
  ["law and courts", "法律与法庭"],
  `
  defendant|the person in a court case who is accused of something|被告|The ___ sat quietly while the charges were read.|The jury believed the ___ was telling the truth.|Every ___ has the right to a lawyer.|plaintiff,prosecutor|defendants
  prosecutor|the lawyer who tries to prove in court that someone is guilty|检察官，公诉人|The ___ showed the jury a photograph of the broken window.|The ___ asked the witness where she had been that night.|The ___ had to prove the case beyond reasonable doubt.|attorney,defendant|prosecutors
  acquit|to decide officially in court that someone is not guilty|宣判无罪|The jury voted to ___ the man of all charges.|Without stronger evidence, the court will ___ her.|The judge said he had no choice but to ___ the driver.|appeal,innocent|acquitted,acquits
  plaintiff|the person who brings a case against someone in court|原告|The ___ said the company had sold him a broken car.|The judge listened to the ___ and then to the other side.|The ___ asked for money to pay for the repairs.|defendant,attorney|plaintiffs
  lawsuit|a case brought to a court by one person or group against another|诉讼|The family filed a ___ against the builder.|The ___ lasted three years before it was settled.|A ___ can be expensive for both sides.|appeal,bail|lawsuits
  appeal|to ask a higher court to change a decision; also such a request|上诉|The lawyer said she would ___ the decision.|The ___ was heard by three judges.|If you lose, you can ___ to a higher court.|acquit,lawsuit|appeals,appealed
  innocent|not guilty of a crime or wrong|无罪的，清白的|The court decided that the woman was ___.|In many countries, a person is ___ until proven guilty.|He kept saying he was ___, and the video proved it.|guilty,acquit
  guilty|having done a crime or wrong|有罪的|The jury found him ___ of stealing the bicycle.|She felt ___ for forgetting her friend's birthday.|No one can be called ___ without a fair trial.|innocent,bail
  bail|money paid so that an accused person can leave jail until the trial|保释金|The judge set ___ at five hundred dollars.|His family paid the ___, and he went home that night.|Because she might run away, the court refused ___.|appeal,lawsuit
  attorney|a lawyer, someone trained to act for people in court|律师|The ___ explained the law to her client.|He hired an ___ to help him with the case.|Each side had its own ___.|prosecutor,plaintiff|attorneys
  `,
);

const rules = batch(
  "words-of-rules-and-policy",
  ["Words of Rules and Policy", "规定与政策的词"],
  ["rules and the policies of schools and towns", "学校和城镇的规定与政策"],
  `
  mandatory|required by a rule; that must be done|强制的，必须的|Wearing a helmet is ___ in the bike race.|The meeting is ___ for every member of the team.|Is the science fair ___ or can we choose?|optional,exemption
  ban|an official rule that stops something; also to forbid it|禁令；禁止|The town put a ___ on fireworks during the dry summer.|The school may ___ phones in class next year.|After the ___, the river grew cleaner.|curfew,permit|bans,banned
  enforce|to make sure that people obey a rule or law|执行，强制实施|Guards were hired to ___ the rules at the pool.|A rule is useless if no one will ___ it.|The police began to ___ the new speed limit.|comply,prohibit|enforced,enforces
  permit|to allow something; also an official paper that allows it|允许；许可证|The park does not ___ dogs on the beach.|You need a ___ to fish in this lake.|The weather did not ___ us to finish the game.|ban,exemption|permits,permitted
  curfew|a rule that people must be home or off the streets by a certain time|宵禁，门禁时间|The camp has a ___ of nine o'clock.|During the storm, the city set a ___ for everyone.|She broke her ___ and came home after midnight.|ban,permit|curfews
  exemption|official permission not to follow a rule that others must follow|豁免，免除|Students with a note from a doctor get an ___ from gym class.|The farm was given an ___ from the water limits.|No one gets an ___ from the safety test.|permit,ban|exemptions
  optional|that you may choose to do or not to do|可选的，非强制的|The extra reading is ___, but it will help you.|Lunch is free, and the trip is ___.|Is the uniform ___ on Fridays?|mandatory,exemption
  prohibit|to forbid something by a rule or law|禁止|The rules ___ running near the pool.|Many cities ___ smoking in parks.|The new law will ___ plastic bags in shops.|permit,enforce|prohibited,prohibits
  comply|to do what a rule or an order says|遵守，服从|Every restaurant must ___ with the health code.|The players refused to ___ with the referee's order.|If you do not ___, you will lose your place.|enforce,revoke|complies,complied
  revoke|to cancel a right or a permission officially|撤销，吊销|The city can ___ a driver's license for unsafe driving.|The club voted to ___ his membership.|If you break the rules, the school will ___ your parking pass.|prohibit,comply|revoked,revokes
  `,
);

const deepSea = batch(
  "words-of-the-deep-sea",
  ["Words of the Deep Sea", "深海的词"],
  ["the deep sea and the creatures that live there", "深海与深海生物"],
  `
  abyss|a very deep space or hole, such as the deepest part of the ocean|深渊|Sunlight never reaches the ___ at the bottom of the ocean.|The divers stared down into the dark ___.|Strange fish with huge eyes live in the ___.|crustacean,carcass|abysses
  submersible|a small vessel that can travel deep under water|潜水器|The scientists rode a ___ two kilometers down.|The ___ had thick windows and bright lights.|A robot ___ took pictures of the wreck.|sonar,tentacle|submersibles
  bioluminescence|light made by a living thing, such as a jellyfish|生物发光|The squid used its ___ to confuse its enemies.|At night, the waves glowed with ___.|In the dark deep sea, ___ is the only light.|sonar,abyss
  sonar|a way of finding things under water by sending sound and listening for echoes|声呐|The ship used ___ to map the sea floor.|Dolphins use a kind of natural ___ to find fish.|The ___ showed a shipwreck far below.|submersible,bioluminescence
  crustacean|an animal with a hard shell and jointed legs, such as a crab or a lobster|甲壳动物|A crab is a ___, and so is a shrimp.|The ___ shed its shell as it grew.|Many ___ live on the dark sea floor.|mollusk,scavenger|crustaceans
  tentacle|a long, bendable arm of an animal such as an octopus or a jellyfish|触手，触须|The octopus wrapped a ___ around the rock.|Each ___ of the jellyfish can sting.|A squid has two long ___ and eight arms.|crustacean,carcass|tentacles
  buoyant|able to float; also cheerful|有浮力的；轻松愉快的|Salt water is more ___ than fresh water.|The ___ float kept the swimmer's head above water.|She was in a ___ mood after the good news.|scavenger,abyss
  scavenger|an animal that eats dead animals or waste|食腐动物|The hagfish is a ___ that feeds on dead whales.|A crab is a busy ___ on the sea floor.|Gulls are ___ that eat what people leave behind.|crustacean,mollusk|scavengers
  mollusk|a soft-bodied animal, often with a shell, such as a snail, a clam or an octopus|软体动物|An octopus is a ___ without a shell.|The ___ pulled itself back into its shell.|Clams and oysters are kinds of ___.|crustacean,tentacle|mollusks
  carcass|the dead body of an animal|动物尸体|The whale ___ fed sea creatures for years.|Sharks gathered around the ___.|Scavengers cleaned the ___ down to the bones.|scavenger,abyss|carcasses
  `,
);

const tides = batch(
  "words-of-tides-and-currents",
  ["Words of Tides and Currents", "潮汐与洋流的词"],
  ["tides, currents and the shore", "潮汐、洋流与海岸"],
  `
  current|a steady flow of water or air in one direction|水流，气流|The ___ carried the bottle far out to sea.|Swimmers were warned about the strong ___.|A warm ___ flows north along the coast.|undertow,swell|currents
  lagoon|a shallow body of salt water cut off from the sea by sand or a reef|潟湖|The children swam in the calm ___ behind the reef.|The ___ was warm and as clear as glass.|Birds nest on the shores of the ___.|inlet,shoal|lagoons
  reef|a line of rock or coral just below or above the surface of the sea|礁，暗礁|Thousands of fish live on the coral ___.|The ship struck the ___ and began to sink.|The ___ protects the island from big waves.|shoal,lagoon|reefs
  swell|a slow, rolling movement of the sea, with long waves that do not break|涌浪|The boat rose and fell on the gentle ___.|A big ___ from a distant storm reached the beach.|Surfers waited for the next ___.|surge,current|swells
  undertow|a current under the surface that pulls water back out to sea|回流，底流|The ___ pulled the swimmer away from the shore.|Lifeguards warned that the ___ was strong today.|Even in shallow water, an ___ can knock you down.|current,ebb
  ebb|the flowing of the tide away from the shore; also to flow away|退潮；减退|At ___ tide, we could walk out to the rocks.|The water began to ___ in the afternoon.|As the tide went out, her fear began to ___.|surge,swell|ebbs,ebbed
  surge|a sudden, strong rush forward, as of water|涌动，激增|A storm ___ flooded the streets near the harbor.|The ___ of water swept the boats onto the land.|There was a ___ of visitors after the whales appeared.|swell,ebb|surges
  inlet|a narrow strip of water that reaches into the land from the sea|小海湾，水湾|The fishing boats sheltered in a small ___.|The ___ fills with water at high tide.|Seals rested on the rocks of the ___.|lagoon,reef|inlets
  shoal|a place where the water is shallow; also a large group of fish|浅滩；鱼群|The captain steered around the sandy ___.|A ___ of silver fish flashed past the diver.|Ships have run aground on this ___.|reef,inlet|shoals
  upwelling|the rising of cold, deep water full of food toward the surface|上升流|The ___ brings food up from the deep, so fish gather there.|Winds along the coast cause an ___ of cold water.|Some of the richest fishing grounds lie above an ___.|undertow,current
  `,
);

const conservation = batch(
  "words-of-conservation",
  ["Words of Conservation", "生态保护的词"],
  ["protecting wild places and living things", "保护自然环境和生物"],
  `
  conservation|the protection of nature, animals and plants|保护，保育|The group works for the ___ of rare sea turtles.|Water ___ is important during a drought.|She studied ___ so she could protect forests.|sanctuary,quota
  extinct|no longer existing anywhere|灭绝的|The dodo has been ___ for more than three hundred years.|Without help, the frog may soon be ___.|Many ___ animals are known only from their bones.|threatened,deplete
  overfishing|catching so many fish that too few are left to breed|过度捕捞|Because of ___, the cod almost disappeared.|___ has emptied many once rich seas.|Rules against ___ let the fish return.|poaching,ecotourism
  restore|to bring something back to how it was before|恢复，修复|Volunteers planted grass to ___ the dunes.|The city wants to ___ the old wetland.|It can take years to ___ a damaged reef.|deplete,conservation|restored,restores
  poaching|hunting or fishing animals illegally|偷猎，盗猎|___ has killed many elephants for their tusks.|Guards patrol the park to stop ___.|The fine for ___ is very high.|overfishing,quota
  sanctuary|a safe place, especially one where wild animals are protected|保护区，避难所|The island is a ___ for nesting seabirds.|Hunting is banned inside the ___.|The barn became a ___ for the injured horses.|conservation,ecotourism|sanctuaries
  threatened|in danger of becoming endangered or extinct|受威胁的|The ___ birds now nest only on two islands.|Sea grass is ___ by warm water.|The list of ___ animals grew longer this year.|extinct,restore
  deplete|to use up most of something|耗尽，大量减少|Too much fishing will ___ the stock of tuna.|Long droughts ___ the water in the lake.|Running all day can ___ your energy.|restore,poaching|depleted,depletes
  quota|a fixed amount that is allowed, such as the number of fish a boat may catch|配额，限额|Each boat has a ___ of five tons of fish a year.|When the ___ is reached, fishing must stop.|The town set a ___ on the number of visitors.|conservation,overfishing|quotas
  ecotourism|travel to natural places that tries to protect them and help local people|生态旅游|___ brings money to villages near the reef.|Good ___ teaches visitors not to touch the coral.|The forest earns more from ___ than from logging.|overfishing,sanctuary
  `,
);

const renaissance = batch(
  "words-of-the-renaissance",
  ["Words of the Renaissance", "文艺复兴的词"],
  ["the Renaissance and its new ideas", "文艺复兴及其新思想"],
  `
  renaissance|a rebirth of learning and art; the period in Europe from about 1300 to 1600|复兴；文艺复兴|The ___ began in the cities of Italy.|The town is enjoying a ___ of music and theater.|Many famous painters lived during the ___.|revival,reformation
  humanism|a way of thinking that values human learning, ability and the books of ancient Greece and Rome|人文主义|___ taught that people should study history, poetry and good speech.|The spirit of ___ spread from Florence to the rest of Europe.|Teachers of ___ read the old Latin writers closely.|classical,heresy
  patron|a rich person who pays artists or writers to work|赞助人|The Medici family was a great ___ of painters.|With a ___ to pay her, the poet could write all day.|Every artist hoped to find a generous ___.|printer,genius|patrons
  classical|from ancient Greece or Rome, or in their style|古典的|The building has ___ columns like a Greek temple.|Students studied ___ languages such as Latin.|___ statues were dug up and copied.|humanism,renaissance
  revival|a return of something to use or popularity|复兴，复苏|The ___ of old Greek plays drew large crowds.|There was a ___ of interest in ancient science.|The festival led to a ___ of folk music.|renaissance,reformation|revivals
  reformation|a change that tries to correct something; the religious movement in Europe after 1517|改革；宗教改革|The ___ split the church in western Europe.|Leaders called for a ___ of the old customs.|The printing press helped the ___ spread fast.|revival,heresy
  genius|a person with very great skill or intelligence|天才|Leonardo da Vinci was a ___ in art and science.|It takes a ___ to solve that puzzle in a minute.|Some people called the young painter a ___.|patron,printer|geniuses
  pamphlet|a thin book with a paper cover, often about one question|小册子|The ___ explained the new idea in simple words.|Printers sold thousands of copies of the ___.|She handed out a ___ about the town meeting.|printer,heresy|pamphlets
  heresy|a belief that goes against the official teaching of a religion|异端邪说|In those days, a person could be punished for ___.|The church called his book a ___.|Some scientists were accused of ___ for their ideas.|reformation,humanism|heresies
  printer|a person or business that prints books and papers; also a machine that prints|印刷商；打印机|The ___ set each letter by hand.|A busy ___ could make hundreds of pages a day.|Our ___ ran out of ink.|patron,pamphlet|printers
  `,
);

const newScience = batch(
  "words-of-science-in-the-renaissance",
  ["Words of Science in the Renaissance", "文艺复兴时期科学的词"],
  ["the new science of the Renaissance", "文艺复兴时期的新科学"],
  `
  anatomy|the study of the body and its parts; also the way a body is built|解剖学；身体结构|Leonardo drew the ___ of the human hand.|Doctors must learn ___ before they can operate.|The ___ of a bird helps it to fly.|dissection,cosmos
  philosophy|the study of ideas about knowledge, truth and how to live|哲学|She studied ___ and asked what makes an action right.|Greek ___ was read again in the Renaissance.|His ___ was simple: always tell the truth.|astronomy,observation|philosophies
  astronomy|the study of the stars, the planets and space|天文学|Galileo's ___ changed how people saw the sky.|In ___, a telescope is the most important tool.|The club meets on clear nights to practice ___.|philosophy,anatomy
  heliocentric|having the sun at the center|以太阳为中心的|Copernicus proposed a ___ model of the planets.|In a ___ system, Earth goes around the sun.|The ___ idea was slow to be accepted.|cosmos,observation
  observation|the careful watching of something to learn about it|观察|Galileo's ___ of the moon showed mountains and craters.|Science begins with careful ___.|She wrote each ___ in her notebook.|dissection,philosophy|observations
  inventor|a person who makes something new that did not exist before|发明家|Gutenberg was the ___ of a new printing press.|The young ___ built a machine to sort coins.|Every ___ fails many times before succeeding.|scientist,notebook|inventors
  cosmos|the whole universe, seen as an ordered system|宇宙|Ancient thinkers believed Earth stood still at the center of the ___.|The telescope opened a window onto the ___.|We are a tiny part of a huge ___.|astronomy,heliocentric
  dissection|cutting up a dead body, plant or animal to study it|解剖|Doctors learned from the ___ of human bodies.|The class watched a ___ of a frog.|Careful ___ showed how the heart's valves work.|anatomy,observation|dissections
  scientist|a person who studies the natural world through experiments and observation|科学家|The ___ tested her idea again and again.|Galileo is often called the first modern ___.|A ___ must report results honestly.|inventor,philosophy|scientists
  notebook|a book of blank pages for writing notes|笔记本|Leonardo filled his ___ with drawings of machines.|She kept a ___ of everything she saw at the pond.|My ___ is full of ideas for stories.|observation,inventor|notebooks
  `,
);

const workshops = batch(
  "words-of-artists-and-workshops",
  ["Words of Artists and Workshops", "艺术家与作坊的词"],
  ["artists and their workshops", "艺术家及其作坊"],
  `
  workshop|a room or building where things are made or repaired|作坊，工作间|Young painters trained in the master's ___.|The ___ smelled of paint and sawdust.|My uncle fixes clocks in his ___.|chapel,altarpiece|workshops
  sculptor|an artist who makes figures from stone, wood, metal or clay|雕塑家|Michelangelo was a ___ as well as a painter.|The ___ carved a lion from a block of stone.|Each ___ had a different style.|architect,fresco|sculptors
  fresco|a picture painted on wet plaster on a wall or ceiling|湿壁画|The ___ on the ceiling took four years to paint.|In a ___, the paint dries into the wall.|Visitors look up at the famous ___.|plaster,masterpiece|frescoes
  masterpiece|a work of art made with great skill; one of the best of its kind|杰作|The *Mona Lisa* is a famous ___.|Her first novel was a ___.|Every apprentice hoped to paint a ___ one day.|fresco,altarpiece|masterpieces
  plaster|a paste that dries hard and smooth on walls|灰泥|The painter worked fast before the ___ dried.|Cracks appeared in the old ___ of the ceiling.|The ___ was mixed from lime, sand and water.|fresco,gilded
  gilded|covered with a thin layer of gold|镀金的|The ___ frame shone in the candlelight.|Angels with ___ wings decorated the altar.|The palace had ___ ceilings in every room.|plaster,commission
  altarpiece|a painting or carving placed behind the altar of a church|祭坛画|The ___ showed scenes from an old story in three panels.|A rich merchant paid for the new ___.|The colors of the ___ were still bright after five hundred years.|fresco,masterpiece|altarpieces
  chapel|a small church, or a room for prayer in a larger building|小教堂|The ___ was decorated with paintings on every wall.|The family built a ___ in their palace.|Tourists wait in line to see the famous ___.|workshop,altarpiece|chapels
  architect|a person who designs buildings|建筑师|Brunelleschi was the ___ of the great dome in Florence.|The ___ drew plans for a new library.|An ___ must know both art and engineering.|sculptor,commission|architects
  commission|an order for a piece of work, such as a painting, and the payment for it|委托，委托费|The artist received a ___ to paint the pope.|A large ___ could keep a workshop busy for years.|The city gave the sculptor a ___ for a statue.|gilded,workshop|commissions,commissioned
  `,
);

const westAfrica = batch(
  "words-of-west-african-empires",
  ["Words of West African Empires", "西非帝国的词"],
  ["the empires of West Africa", "西非的帝国"],
  `
  sultan|a ruler in some Muslim countries|苏丹（君主）|The ___ welcomed the traders to his palace.|After the ___ died, his son took the throne.|The ___ built a new mosque in the capital.|ruler,griot|sultans
  mosque|a building where Muslims pray|清真寺|The great ___ of Djenné is built of mud brick.|People gathered at the ___ on Friday.|Scholars taught in the courtyard of the ___.|capital,pilgrimage|mosques
  griot|a West African storyteller, singer and keeper of history|格里奥（西非说唱艺人、史官）|The ___ sang the story of the empire's founder.|Each family had a ___ who remembered its history.|Children listened as the ___ played the kora.|sultan,oral|griots
  pilgrimage|a journey to a holy place for religious reasons|朝圣|Mansa Musa made a famous ___ to Mecca.|The ___ took more than a year.|Thousands of people join the ___ each year.|succession,prosperity|pilgrimages
  prosperity|the state of being rich and successful|繁荣，兴旺|Trade in gold brought ___ to the empire.|The years of peace were years of ___.|The new road brought ___ to the villages along it.|succession,pilgrimage
  ruler|a person who controls a country or a people|统治者|The ___ of Mali controlled the gold fields.|A wise ___ listens to the people.|Every ___ of the empire was called mansa.|sultan,griot|rulers
  reign|the time during which a king, queen or emperor rules; also to rule|统治时期；统治|During his ___, the empire doubled in size.|She will ___ for more than fifty years.|The ___ of Sundiata began about 1235.|succession,capital|reigns,reigned
  succession|the order in which one person follows another into a position|继承，继位|A fight over the ___ weakened the kingdom.|The rules of ___ said a brother would rule next.|The ___ passed peacefully to the king's nephew.|reign,prosperity
  oral|spoken rather than written|口头的，口述的|The history of Mali was kept in ___ stories.|We gave an ___ report in front of the class.|___ traditions pass from parents to children.|griot,capital
  capital|the city where a government is based|首都，首府|Niani was the ___ of the empire of Mali.|Paris is the ___ of France.|Traders traveled for weeks to reach the ___.|mosque,reign|capitals
  `,
);

const saharan = batch(
  "words-of-the-saharan-trade",
  ["Words of the Saharan Trade", "撒哈拉贸易的词"],
  ["the trade across the Sahara", "穿越撒哈拉的贸易"],
  `
  commodity|a product that is bought and sold, such as gold, salt or grain|商品|Salt was a valuable ___ in the desert trade.|Oil is the most important ___ the country sells.|Coffee is a ___ traded all over the world.|exchange,nugget|commodities
  precious|of great value; not to be wasted|宝贵的，珍贵的|In the desert, water is ___.|She keeps her ___ letters in a box.|Gold was the most ___ metal in the market.|commodity,slab
  exchange|giving one thing and receiving another in return|交换|Traders gave salt in ___ for gold.|The two schools set up an ___ of students.|In ___ for his help, I fixed his bike.|commodity,transport|exchanges,exchanged
  camel|a large animal with one or two humps that can travel far without water|骆驼|A ___ can walk for days without drinking.|The traders loaded each ___ with salt.|The ___ knelt so the rider could climb on.|saddle,mine|camels
  saddle|a seat fastened to the back of an animal for riding|鞍，马鞍|He tied the bags to the camel's ___.|The leather ___ was worn smooth.|She climbed into the ___ and rode away.|camel,slab|saddles
  slab|a thick, flat piece of something hard|厚板，平板|A ___ of salt could weigh thirty kilograms.|They covered the well with a stone ___.|He cut a ___ of cheese for each guest.|nugget,saddle|slabs
  weigh|to measure how heavy something is; also to have a certain weight|称重；重达|Merchants used scales to ___ the gold dust.|A full load can ___ as much as a person.|Let me ___ the apples before you pay.|exchange,transport|weighs,weighed
  nugget|a small lump of gold or another metal as it is found in the earth|金块，矿块|The miner found a ___ of gold in the river.|A single ___ could buy a horse.|He kept the ___ in a leather bag.|slab,commodity|nuggets
  transport|to carry people or goods from one place to another; also a way of doing so|运输|Camels were used to ___ salt across the desert.|Boats on the river were the cheapest ___.|Trucks ___ the fruit to the city.|exchange,weigh|transported,transports
  mine|a deep hole or tunnel from which gold, salt or other minerals are dug|矿，矿井|Workers cut blocks of salt from the ___.|The gold ___ lay far to the south.|The ___ closed when the gold ran out.|camel,nugget|mines
  `,
);

const scholars = batch(
  "words-of-scholars-and-books",
  ["Words of Scholars and Books", "学者与书籍的词"],
  ["scholars, schools and the making of books", "学者、学校与书籍的制作"],
  `
  scholar|a person who studies a subject deeply|学者|The ___ spent forty years studying the stars.|Timbuktu drew every ___ from across Africa.|A ___ must read carefully and question everything.|copyist,treatise|scholars
  manuscript|a book or document written by hand|手稿，手抄本|The ___ was copied by hand in black ink.|Families in Timbuktu kept old ___ in wooden chests.|The library holds a ___ more than six hundred years old.|treatise,binding|manuscripts
  university|a place of advanced learning where students study for degrees|大学|Sankore was a famous center of learning, like a ___.|She hopes to study medicine at a ___.|The ___ has a library of a million books.|library,scholar|universities
  treatise|a long, serious piece of writing on one subject|论文，专著|The doctor wrote a ___ on the treatment of fever.|His ___ on law was studied for centuries.|She read a ___ about the movement of the planets.|manuscript,copyist|treatises
  library|a place where books are kept for people to read or borrow|图书馆|The ___ of the mosque held thousands of books.|I return my books to the ___ on Fridays.|A good ___ is a treasure for a town.|university,binding|libraries
  copyist|a person whose job was to copy books by hand|抄写员|The ___ worked by the light of a lamp.|A skilled ___ could copy a book in a month.|Every ___ checked his work for mistakes.|scholar,manuscript|copyists
  binding|the cover that holds the pages of a book together|装订，封皮|The book had a ___ of red leather.|The old ___ cracked when I opened it.|Workers sewed the pages into the ___.|leather,ink
  memorize|to learn something so well that you can say it without looking|记住，背诵|Students had to ___ long poems.|I ___ my lines for the school play.|It is easier to ___ a list if you sing it.|copyist,scholar|memorized,memorizes
  leather|the skin of an animal prepared for making things such as shoes and bags|皮革|The book was covered in soft ___.|Camel ___ was used for bags and saddles.|My ___ shoes are waterproof.|binding,ink
  ink|a colored liquid used for writing, drawing or printing|墨水|Scribes made black ___ from soot and gum.|The ___ had faded to brown.|I spilled ___ on my homework.|leather,binding|inks
  `,
);

const infection = batch(
  "words-of-infection",
  ["Words of Infection", "传染的词"],
  ["infections and how they spread", "传染病及其传播"],
  `
  contagious|able to spread from one person to another|传染性的|Measles is very ___, so sick children stay home.|Her laugh was ___, and soon everyone was smiling.|The doctor said the rash was not ___.|epidemic,carrier
  epidemic|the fast spread of a disease among many people in one area|流行病|A cholera ___ swept through the city in 1854.|The flu ___ closed schools for a week.|Doctors worked day and night during the ___.|pandemic,outbreak|epidemics
  antibody|a substance the body makes to fight a particular germ|抗体|Your body makes an ___ after you have had the illness.|Each ___ attacks only one kind of germ.|A vaccine helps the body make an ___ without getting sick.|symptom,carrier|antibodies
  symptom|a sign of an illness, such as a fever or a cough|症状|A sore throat was her first ___.|The main ___ of the disease is a high fever.|Call a doctor if a ___ lasts more than three days.|antibody,infection|symptoms
  infection|an illness caused by germs entering the body|感染|Wash the cut so it does not get an ___.|The ___ spread from his ear to his throat.|She took medicine to fight the ___.|epidemic,symptom|infections
  quarantine|keeping people or animals apart for a time so that a disease does not spread|隔离检疫|The sailors were kept in ___ for forty days.|The sick puppy went into ___.|The town was under ___ until the fever passed.|outbreak,pandemic
  pandemic|a disease that spreads across many countries or the whole world|大流行病|The ___ of 1918 killed millions of people.|During the ___, people around the world stayed home.|A ___ is larger than an epidemic.|epidemic,quarantine|pandemics
  outbreak|a sudden start of a disease or of something unpleasant|爆发，突然发生|An ___ of measles was found at the camp.|Health workers tried to stop the ___ early.|The ___ began in a crowded market.|quarantine,epidemic|outbreaks
  carrier|a person or animal that carries a germ and can pass it on, sometimes without being sick|携带者，带菌者|Mosquitoes are a ___ of malaria.|She was a ___ of the illness but never felt sick.|Rats were a ___ of the fleas that spread the plague.|antibody,contagious|carriers
  isolation|being kept apart from other people|隔离，孤立|Patients with the fever were kept in ___.|After a week of ___, he was glad to see his friends.|The hospital has a room for ___.|quarantine,carrier
  `,
);

const medicine = batch(
  "words-of-medicine",
  ["Words of Medicine", "医学的词"],
  ["doctors and medical treatment", "医生与治疗"],
  `
  diagnose|to find out what illness someone has|诊断|The doctor used an X-ray to ___ the broken bone.|It is hard to ___ a disease with only one symptom.|Tests helped them ___ the child's illness.|prescription,inoculate|diagnosed,diagnoses
  chronic|lasting a long time or coming back often|慢性的|Asthma is a ___ illness that many children have.|He has ___ pain in his knee.|___ diseases need care for years.|antiseptic,therapy
  remedy|something that cures an illness or solves a problem|疗法，补救办法|Honey and lemon is an old ___ for a sore throat.|There is no quick ___ for a broken heart.|The best ___ for tiredness is sleep.|therapy,dose|remedies
  surgeon|a doctor who performs operations|外科医生|The ___ repaired the torn muscle.|Every ___ washes her hands carefully before working.|Lister was a ___ who fought infection.|pharmacist,prescription|surgeons
  antiseptic|a substance that kills germs on skin or tools|消毒剂，防腐剂|The nurse cleaned the cut with ___.|Lister sprayed ___ in the operating room.|An ___ cream stops a scratch from getting infected.|remedy,dose|antiseptics
  dose|the amount of a medicine taken at one time|剂量|Take one ___ every six hours.|The doctor gave the child a smaller ___.|Too large a ___ can be dangerous.|prescription,remedy|doses
  prescription|a doctor's written order for a medicine|处方|The pharmacist filled the ___.|You need a ___ to buy this medicine.|The doctor wrote a ___ for eye drops.|dose,diagnose|prescriptions
  therapy|a treatment that helps someone recover over time|疗法，治疗|After the accident, she needed ___ to walk again.|Speech ___ helped him say the sounds clearly.|Music ___ calms some patients.|remedy,surgeon|therapies
  inoculate|to put a weak form of a germ into the body so that it learns to fight the disease|接种，预防注射|Jenner was the first to ___ a boy against smallpox with cowpox.|Nurses came to ___ the whole school.|Farmers ___ their cattle against disease.|diagnose,antiseptic|inoculated,inoculates
  pharmacist|a person trained to prepare and sell medicines|药剂师|The ___ explained how often to take the pills.|Ask the ___ whether the two medicines are safe together.|The ___ filled the bottle and typed the label.|surgeon,therapy|pharmacists
  `,
);

/** batchesA are the batches of words of units 1 to 5 of grade 7. */
export const batchesA: readonly BatchSpec[] = [
  debate,
  courts,
  rules,
  deepSea,
  tides,
  conservation,
  renaissance,
  newScience,
  workshops,
  westAfrica,
  saharan,
  scholars,
  infection,
  medicine,
];
