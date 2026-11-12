// Grade 12: the batches of words of the first units, from power and corruption and conscience and duty to philosophy,
// belief and doubt, art criticism, and taste and beauty.

import type { BatchSpec } from "../batch.ts";
import { batch } from "../grade-5/batches.ts";

const power = batch(
  "words-of-power-and-corruption",
  ["Words of Power and Corruption", "权力与腐败的词"],
  ["the abuse of public office", "滥用公职"],
  `
  graft|the use of a public position to gain money or advantage dishonestly|贪污，受贿|The mayor was jailed for ___ after taking money from builders.|Years of ___ had left the roads full of holes.|Reporters exposed the ___ in the city's contracts.|kickback,patronage|
  kickback|a secret payment made to someone who has helped arrange a deal|回扣|The company paid a ___ to the official who chose it.|Every contract came with a ___ for the minister.|He refused the ___ and reported the offer.|graft,extortion|kickbacks
  nepotism|giving jobs or favors to one's own relatives|任人唯亲(尤指亲属)|The director was accused of ___ for hiring his son.|___ filled the ministry with the president's cousins.|Strict rules were made to prevent ___.|cronyism,patronage|nepotistic
  cronyism|giving jobs or favors to one's friends rather than to the best people|任人唯亲(尤指朋友)|Critics said the new board showed plain ___.|___ kept talented outsiders from ever being promoted.|The contracts went to the governor's golf partners, a clear case of ___.|nepotism,sinecure|cronies
  embezzle|to steal money that one has been trusted to look after|挪用，盗用(公款)|The treasurer tried to ___ funds from the charity.|He planned to ___ the club's savings and leave the country.|It is hard to ___ money when accounts are checked every month.|extortion,malfeasance|embezzled,embezzlement,embezzler
  extortion|getting money or something else by threats or force|敲诈，勒索|The gang made its money through ___ of local shops.|The officer was charged with ___ after demanding cash from drivers.|Paying for "protection" is a form of ___.|embezzle,kickback|extort,extorted
  malfeasance|wrongdoing, especially by a public official|(公职人员的)不法行为，渎职|The inquiry found clear evidence of ___ in the tax office.|The judge was removed for ___.|Voters were tired of ___ in high places.|impunity,graft|
  impunity|freedom from punishment or from the bad results of an action|不受惩罚，免于惩罚|The guards beat prisoners with ___.|Powerful families broke the law with ___.|The new court was meant to end ___ for war crimes.|malfeasance,patronage|
  patronage|the power to give jobs, contracts or favors, often to supporters|(政治上的)任免权，庇护|The party used ___ to reward loyal workers with city jobs.|Without ___, the governor's power would shrink.|Reformers wanted to end ___ in the civil service.|cronyism,sinecure|
  sinecure|a paid position that requires little or no work|闲职，挂名差事|His uncle found him a ___ on the board of a bank.|The post was a ___ with a big salary and no duties.|Critics called the new office a ___ for retired politicians.|patronage,nepotism|sinecures
  `,
);

const conscience = batch(
  "words-of-conscience-and-duty",
  ["Words of Conscience and Duty", "良知与责任的词"],
  ["doing what is right under pressure", "在压力下做正确的事"],
  `
  probity|complete honesty and high moral standards|正直，诚实|A judge must be a person of unquestioned ___.|Her ___ made her the obvious choice to manage the fund.|The scandal raised doubts about the ___ of the whole council.|rectitude,abnegation|
  rectitude|morally correct behavior or thinking|正直，公正|The old teacher was known for his ___ and fairness.|She acted with quiet ___ even when others cheated.|The leader's moral ___ inspired great loyalty.|probity,misgiving|
  forthright|direct and honest in what one says|直率的，坦诚的|She gave a ___ answer to every question.|His ___ manner sometimes upset his colleagues.|Be ___ with me: did you break the rules?|upright,dutiful|forthrightly
  principled|acting according to firm moral beliefs|有原则的|The ___ senator refused to vote for a bill she believed was wrong.|It was a ___ decision, even though it cost him his job.|They admired her ___ stand against the war.|incorruptible,forthright|
  misgiving|a feeling of doubt or worry about whether something is right|疑虑，担忧|She signed the letter with some ___.|I have one ___ about the plan: it is too fast.|Despite every ___, he went ahead.|abnegation,rectitude|misgivings
  incorruptible|impossible to bribe or to persuade to do wrong|廉洁的，不受贿赂的|The ___ inspector refused every gift.|The people wanted an ___ judge.|Even his enemies admitted he was ___.|principled,unimpeachable|
  upright|honest and responsible; doing what is morally right|正直的|He was an ___ citizen who paid every tax.|Her ___ conduct earned the town's respect.|The story's hero is an ___ farmer tricked by a thief.|forthright,dutiful|
  abnegation|the act of giving up something one wants, often for others|克己，舍弃|The nurse's ___ in working without pay moved everyone.|A life of ___ is not for everyone.|Her mother's ___ allowed her children to study.|misgiving,probity|
  dutiful|doing everything that one is expected or obliged to do|尽职的，恭顺的|The ___ son visited his parents every Sunday.|She was a ___ worker but never took risks.|The clerk gave a ___ answer and returned to his desk.|upright,incorruptible|dutifully
  unimpeachable|so honest or reliable that it cannot be doubted|无可指摘的，无可置疑的|The witness had an ___ record.|Her sources were ___.|The report rested on ___ evidence.|incorruptible,principled|
  `,
);

const philosophy = batch(
  "words-of-philosophy",
  ["Words of Philosophy", "哲学的词"],
  ["the branches and schools of philosophy", "哲学的分支与流派"],
  `
  metaphysics|the part of philosophy that asks about the basic nature of reality, being and time|形而上学|In ___, we ask whether the mind is separate from the body.|Her lecture on ___ asked what it means for something to exist.|___ deals with questions that experiments cannot settle.|epistemology,ontology|metaphysical
  epistemology|the part of philosophy that studies knowledge and how we come to know things|认识论|___ asks how we can tell knowledge from opinion.|The course on ___ began with the question "What can I know?"|In ___, a true belief reached by luck is a famous puzzle.|metaphysics,empiricism|epistemological
  ontology|the study of what exists and what kinds of things there are|本体论|In ___, philosophers ask whether numbers really exist.|His ___ included minds as well as bodies.|The debate about ___ concerned whether holes are things.|metaphysics,dualism|ontological
  empiricism|the view that knowledge comes mainly from experience and the senses|经验主义|___ holds that a newborn's mind begins as a blank page.|Modern science grew partly out of ___.|Locke's ___ stressed learning from observation.|rationalism,determinism|empiricist,empirically
  rationalism|the view that reason, not the senses, is the main source of knowledge|理性主义|Descartes's ___ began with what he could not doubt.|___ trusts proof more than observation.|The debate between ___ and empiricism shaped modern thought.|empiricism,materialism|rationalist
  dualism|the view that the mind and the body are two different kinds of thing|二元论|___ says the mind is not simply the brain.|Critics of ___ ask how a mind could move a body.|The novel explores a ___ of spirit and flesh.|materialism,ontology|dualist
  determinism|the view that every event, including every choice, is caused by earlier events|决定论|If ___ is true, can anyone be blamed?|___ seems to leave no room for free will.|Some scientists reject strict ___.|dualism,stoicism|determinist,deterministic
  materialism|the view that only physical matter exists and that the mind is a physical process|唯物主义|___ holds that thoughts are events in the brain.|The philosopher defended ___ against religious critics.|Under ___, there is no soul apart from the body.|dualism,rationalism|materialist
  stoicism|a philosophy teaching that we should accept calmly what we cannot control|斯多葛主义，坚忍|She faced the illness with remarkable ___.|Ancient ___ taught that our judgments, not events, disturb us.|His ___ impressed the doctors.|utilitarianism,determinism|stoic,stoical
  utilitarianism|the view that the right action is the one that produces the most happiness for the most people|功利主义|___ would ask which choice saves the most lives.|Critics say ___ ignores the rights of the few.|Bentham and Mill developed ___ in England.|stoicism,empiricism|utilitarian
  `,
);

const belief = batch(
  "words-of-belief-and-doubt",
  ["Words of Belief and Doubt", "信仰与怀疑的词"],
  ["faith, certainty and questioning", "信仰、确信与质疑"],
  `
  dogma|a belief or set of beliefs that people are expected to accept without question|教条，信条|The old ___ said that the earth stood still.|Science advances by questioning ___.|Party ___ left no room for debate.|creed,certitude|dogmas
  dogmatic|insisting that one's beliefs are right and refusing to consider others|教条的，武断的|He was so ___ that he never admitted a mistake.|A ___ teacher discourages questions.|Her ___ tone ended the discussion.|devout,heterodox|dogmatically,dogmatism
  agnostic|a person who believes that we cannot know whether God exists|不可知论者|As an ___, she neither prays nor denies God.|The ___ said the question could not be settled.|He described himself as an ___ rather than an atheist.|apostate,zealot|agnostics,agnosticism
  orthodoxy|the accepted beliefs of a group or a field|正统观念|The young scientist challenged medical ___.|In those years, economic ___ favored low taxes.|Religious ___ forbade the new practice.|heterodox,dogma|orthodox
  heterodox|holding beliefs different from the accepted ones|异端的，非正统的|Her ___ views on history angered older scholars.|The monk was punished for his ___ teaching.|A ___ economist predicted the crash.|dogmatic,devout|
  zealot|a person whose beliefs are extreme and who acts on them fiercely|狂热分子|The ___ would not listen to any argument.|A ___ set fire to the library.|Moderates feared that a ___ would take power.|agnostic,apostate|zealots,zealotry
  certitude|complete certainty or the feeling of being certain|确信，确定无疑|She spoke with a ___ that silenced the room.|In science, ___ is rare.|His ___ was shaken by the new evidence.|dogma,creed|
  apostate|a person who abandons a religion, party or belief|叛教者，变节者|The ___ was expelled from the village.|Former members called him an ___ for leaving the party.|The ___ wrote a book about why she left.|zealot,agnostic|apostates,apostasy
  creed|a set of beliefs, especially religious ones, that guide someone's life|信条，教义|People of every ___ are welcome here.|Hard work was the family's ___.|The law forbids discrimination by race or ___.|dogma,certitude|creeds
  devout|deeply religious or deeply committed to a belief|虔诚的|Her ___ grandmother prayed every morning.|He was a ___ supporter of the team.|___ pilgrims walked for weeks to the shrine.|dogmatic,heterodox|devoutly
  `,
);

const art = batch(
  "words-of-art-criticism",
  ["Words of Art Criticism", "艺术批评的词"],
  ["describing and judging works of art", "描述和评判艺术作品"],
  `
  chiaroscuro|the use of strong contrasts between light and dark in a painting or a film|明暗对比法|Caravaggio's ___ makes his figures seem to step out of the darkness.|The film's ___ gives every scene a sense of danger.|Students studied ___ by drawing a candlelit face.|impasto,brushwork|
  oeuvre|the whole body of work produced by an artist or writer|(艺术家的)全部作品|The museum shows the painter's entire ___.|This novel is the weakest book in her ___.|Critics now see his late ___ as his best.|masterwork,iconography|oeuvres
  derivative|copied from or too similar to the work of others; not original|模仿的，缺乏新意的|The critic called the song ___ and dull.|Her early paintings were ___, but she soon found her own style.|The plot is ___ of a dozen older films.|figurative,installation|derivatively
  brushwork|the way an artist uses a brush to put paint on a surface|笔触，画法|The loose ___ makes the water seem to move.|You can recognize his ___ in every corner of the canvas.|Experts studied the ___ to decide whether the painting was genuine.|impasto,chiaroscuro|
  figurative|showing people, animals or things as they look, rather than abstract shapes|具象的|After years of abstract work, she returned to ___ painting.|The ___ sculptures show workers in a field.|The museum's ___ art is in the east wing.|derivative,tableau|
  iconography|the symbols and images used in a work of art and what they mean|图像学，图像志|In Christian ___, a lamb stands for innocence.|The ___ of the temple paintings is hard for modern viewers to read.|She wrote a book on the ___ of wedding portraits.|oeuvre,masterwork|iconographic
  impasto|paint laid on so thickly that the marks of the brush or knife stand out|厚涂法|The ___ makes the sunflowers almost three-dimensional.|Thick ___ catches the light on the canvas surface.|He used ___ to give the sea its rough texture.|brushwork,chiaroscuro|
  installation|a work of art made of objects arranged in a space that viewers enter or walk around|装置艺术|The ___ filled a whole room with hanging threads.|Visitors walked through the ___ in silence.|Her latest ___ uses sound as well as light.|tableau,figurative|installations
  masterwork|a work of outstanding skill, often an artist's best|杰作|The ceiling is widely seen as the painter's ___.|The novel is a ___ of comic writing.|Every gallery wanted to borrow the ___.|oeuvre,iconography|masterworks
  tableau|a group of figures arranged to form a picture or a striking scene|(静态的)场面，画面|The actors froze in a ___ as the curtain fell.|The painting is a ___ of a family at dinner.|The museum built a ___ of a Victorian kitchen.|installation,figurative|tableaux
  `,
);

const taste = batch(
  "words-of-taste-and-beauty",
  ["Words of Taste and Beauty", "品味与美的词"],
  ["beauty, style and the lack of it", "美、风格及其缺失"],
  `
  exquisite|extremely beautiful and delicate|精美的，精致的|The bowl was decorated with ___ blue flowers.|She has ___ taste in music.|The silk was so ___ that no one dared to touch it.|ornate,understated|exquisitely
  garish|too bright and showy in an unpleasant way|俗艳的，花哨的|The new sign was painted in ___ orange and green.|The hotel's ___ lights spoiled the view of the bay.|Her ___ dress stood out at the funeral.|gaudy,tawdry|garishly
  tawdry|cheap, showy and of poor quality|俗丽而廉价的|The seaside shop sold ___ souvenirs.|The film tells a ___ story of fame and scandal.|They decorated the hall with ___ paper flowers.|garish,insipid|tawdriness
  gaudy|too brightly colored or decorated, without taste|艳俗的|He wore a ___ shirt covered in parrots.|The house was full of ___ gold furniture.|The ___ costumes made the actors look silly.|garish,ornate|gaudily
  understated|pleasing because simple and not trying to impress|低调的，朴素典雅的|Her ___ black dress was the most elegant in the room.|The ___ design of the memorial moved visitors.|He gave an ___ performance that let the music speak.|exquisite,harmonious|
  philistine|a person who does not understand or value art and culture|庸人，不懂艺术的人|Only a ___ would tear down this beautiful old theater.|He was called a ___ for falling asleep at the opera.|The critic sneered at the ___ who preferred cartoons.|insipid,tawdry|philistines,philistinism
  harmonious|forming a pleasing and balanced whole|和谐的，协调的|The colors of the room are calm and ___.|The garden has a ___ mix of trees and water.|The village grew in a ___ way over centuries.|understated,picturesque|harmoniously
  picturesque|pretty and charming, especially in an old-fashioned way, like a picture|如画的，风景优美的|They stayed in a ___ village by the lake.|The ___ harbor is full of painted boats.|Tourists photographed the ___ old bridge.|harmonious,exquisite|
  insipid|lacking flavor, interest or energy|乏味的，枯燥的|The soup was ___ and needed salt.|Critics found the film's hero ___.|She grew tired of the ___ songs on the radio.|tawdry,understated|
  ornate|decorated with many complicated details|华丽的，装饰繁复的|The church has an ___ golden altar.|An ___ frame surrounded the small portrait.|His ___ writing style tires some readers.|exquisite,gaudy|ornately
  `,
);

/** batchesA are the batches of the first units of grade 12. */
export const batchesA: readonly BatchSpec[] = [power, conscience, philosophy, belief, art, taste];
