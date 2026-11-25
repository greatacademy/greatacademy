// Grade 9: the batches of words of housework and of phrasal verbs of work and choices.

import { t } from "@ga/content";
import type { BatchSpec } from "../batch.ts";
import { batch } from "../grade-5/batches.ts";

const housework = batch(
  "words-of-housework",
  ["Words of Housework", "家务的词"],
  ["cleaning the house and the things used for it", "打扫房子与清洁用品"],
  `
  sweep|to clean with a brush; to move quickly over an area|扫；席卷|Use the broom to ___ the dry leaves off the path into a pile.|After the party, she had to ___ up the crumbs and confetti with a brush.|A storm will ___ across the plains, flattening the grass for miles.|mop,dust|swept,sweeping
  mop|a sponge or cloth on a long stick for washing floors; to wash with one|拖把；拖地|He dipped the ___ in the bucket and washed the kitchen floor without bending down.|The cleaner pushed a wet ___ across the hall floor, leaving the tiles shining and damp.|A ___ soaks up spilled water from the floor while you stand up straight.|broom,sponge|mopped
  dust|fine dry powder; to wipe it off|灰尘；掸灰|Wipe the ___ off the shelves; it has been gathering there for weeks.|The ___ in the old attic made me sneeze, rising in grey clouds from every box.|The books on the top shelf were covered in a thick grey layer of ___.|polish,bleach|dusty,dusted
  polish|to make shiny by rubbing; a substance used for this|擦亮；上光剂|Rub hard to ___ your shoes until you can see your face in them.|She used a soft cloth and wax to ___ the old table until it gleamed.|Every Friday, he would ___ the brass door knocker until it shone like gold.|dust,sweep|polished
  broom|a brush with a long handle for sweeping|扫帚|Get the ___ from the cupboard and brush the dry leaves out of the hall.|The witch flew across the moon on her ___, holding its long handle with both hands.|Its stiff bristles make this ___ good for brushing snow off the steps.|mop,bucket|brooms
  bucket|a round open container with a handle|水桶|Fill the ___ with warm soapy water and carry it by the handle to the car.|The children used a plastic ___ and spade to build sandcastles on the beach.|Rain dripped through the roof, so we put a ___ under the leak to catch the water.|broom,sponge|buckets
  sponge|a soft object for washing that soaks up water; a light cake|海绵；松糕|Wipe the plate with a soft ___, then squeeze it out over the sink.|The ___ soaked up the spilled juice on the table in seconds, holding it in its tiny holes.|She baked a light, fluffy ___ and filled it with jam and cream.|mop,bucket|sponges,spongy
  laundry|clothes to be washed; a place where they are washed|待洗衣物；洗衣房|Hang the wet ___ on the line to dry in the sun.|Saturday is the day I do the ___, washing a week's worth of dirty clothes.|The basket of dirty ___ by the washing machine was full of socks and shirts.|detergent,bleach|
  detergent|a liquid or powder for washing|洗涤剂|Add a scoop of ___ to the washing machine to get the clothes clean without fading their colors.|This ___ smells fresh and makes lots of bubbles in the washing-up water.|Use only a little ___ in the dishwasher, or the plates will come out soapy.|bleach,polish|detergents
  bleach|a chemical that whitens and cleans; to whiten|漂白剂；漂白|Never mix ___ with other cleaners, since this harsh chemical can give off a poisonous gas.|She spilled ___ on her blue jeans, and it left pale spots where it took out the color.|The pool smells of ___, the strong chemical used to kill germs and whiten things.|detergent,polish|bleached
  `,
  "context-clues",
  {
    intro: t(
      "On cleaning day, I **sweep** the floor with a **broom**, wash it with a **mop** and a **bucket**, wipe off the **dust** and put the **laundry** in the machine with some **detergent**. These ten words help you talk about cleaning the house and the things you use to do it.",
      "大扫除那天，我用扫帚（**broom**）扫（**sweep**）地，再用拖把（**mop**）和水桶（**bucket**）拖地，擦掉灰尘（**dust**），把待洗衣物（**laundry**）和洗涤剂（**detergent**）一起放进洗衣机。这十个词帮你谈论打扫房子和打扫用的东西。",
    ),
    watchOut: {
      meanings: t(
        "A **broom** has stiff bristles for sweeping dry dirt; a **mop** has a wet head of strings or sponge for washing floors.",
        "**broom** 有硬毛，用来扫干的脏东西；**mop** 有湿的布条或海绵头，用来拖洗地板。",
      ),
      use: t(
        "**Detergent** makes soapy bubbles that wash dirt out of clothes and dishes; **bleach** is a harsh chemical that kills germs and takes the color out of things.",
        "**detergent** 产生肥皂泡，把衣物和碗碟上的污垢洗掉；**bleach** 是刺激性强的化学品，能杀菌，也会使东西褪色。",
      ),
      spelling: t(
        "Watch the past form **swept**, the **ck** in **bucket**, the **-nge** of **sponge** and the **au** in **laundry**.",
        "注意过去式 **swept**、**bucket** 中的 **ck**、**sponge** 的 **-nge** 结尾，以及 **laundry** 中的 **au**。",
      ),
    },
    notes: `
      sweep|dry leaves brushed off a path into a pile|crumbs and confetti brushed up after a party|a storm moving fast across the plains and flattening grass|sweep means to brush dry dirt away; mop means to wash a floor with water|sweep 是扫掉干的脏东西；mop 是用水拖地|mop means to wash a wet floor, not to brush dry leaves and crumbs or to rush across the plains|mop 是拖湿地板，不是扫干叶子和碎屑，也不是席卷平原|dust means to wipe fine powder off shelves, not to brush leaves into a pile or race across the land|dust 是擦掉架子上的灰，不是把叶子扫成堆或横扫大地|sweep|the past is swept, not sweeped|过去式是 swept，不是 sweeped
      mop|a long-handled tool dipped in a bucket to wash a floor without bending|a wet tool pushed across a hall floor leaving the tiles damp|a tool that soaks up spilled water while you stand up straight|mop washes floors with water; broom sweeps dry dirt|mop 用水拖地；broom 扫干的脏东西|broom has dry stiff bristles for sweeping, not a wet head for washing a floor|broom 有干的硬毛用来扫地，不是用来拖地的湿拖头|sponge is small and held in the hand, not a long-handled tool you use standing up|sponge 是拿在手里的小东西，不是站着用的长柄工具|mop|the p doubles in the past: mopped|过去式双写 p：mopped
      dust|grey powder gathered on shelves for weeks|grey clouds rising from boxes in an old attic that make you sneeze|a thick grey layer on books on the top shelf|dust is fine dry powder that settles on things; polish is a cream rubbed on to make things shine|dust 是落在东西上的细灰；polish 是擦亮东西的上光剂|polish is a cream you rub on to make things shine, not grey powder that gathers by itself|polish 是擦上去让东西发亮的上光剂，不是自己积起来的灰|bleach is a harsh liquid chemical, not dry grey powder that makes you sneeze|bleach 是刺激性的液体化学品，不是让人打喷嚏的干灰|dust|the st ending|结尾是 st
      polish|shoes rubbed until you can see your face in them|an old table rubbed with a cloth and wax until it gleams|a brass door knocker rubbed until it shines like gold|polish means to rub until shiny; dust means to wipe off powder|polish 是擦亮；dust 是掸灰|dust means to wipe powder off, not to rub with wax until something gleams|dust 是掸掉灰尘，不是用蜡擦到发亮|sweep means to brush a floor, not to rub shoes or brass until they shine|sweep 是扫地，不是把鞋或黄铜擦得发亮|pol · ish|the -ish ending|结尾是 -ish
      broom|a brush taken from a cupboard to clear dry leaves out of a hall|what a witch flies on across the moon|stiff bristles that brush snow off the steps|broom is a brush for sweeping; mop is for washing floors with water|broom 是扫地的刷子；mop 是用水拖地的|mop has a wet head for washing floors, not stiff bristles for brushing leaves or snow|mop 是用来拖地的湿拖头，不是扫叶子或雪的硬毛|bucket is a container for water, not a brush with a long handle|bucket 是装水的容器，不是长柄刷子|broom|the double o|双写 o
      bucket|a container of warm soapy water carried by its handle to the car|a plastic container used with a spade for sandcastles|a container placed under a leak to catch dripping rain|bucket is a container with a handle; sponge is a soft thing that soaks up water|bucket 是有提手的容器；sponge 是吸水的软东西|sponge soaks water up into its holes, not a container carried by a handle|sponge 是把水吸进小孔的东西，不是提着走的容器|broom is a brush for sweeping, not a container for water or sand|broom 是扫地的刷子，不是装水或沙的容器|buck · et|the ck in the middle|中间是 ck
      sponge|a soft thing for wiping a plate and squeezing out over a sink|something that soaks up spilled juice into its tiny holes|a light, fluffy cake filled with jam and cream|sponge is soft, small and full of holes; mop is a long-handled tool for floors|sponge 小而软、满是小孔；mop 是拖地的长柄工具|mop is a long-handled tool for washing floors, not something small for wiping plates or a cake|mop 是拖地的长柄工具，不是擦盘子的小东西，也不是蛋糕|bucket is a container you fill with water, not something that soaks it up or a cake|bucket 是装水的容器，不是吸水的东西，也不是蛋糕|sponge|the o that says a short u, and the -nge ending|o 读短音 u，结尾是 -nge
      laundry|wet clothes hung on the line to dry in the sun|a week of dirty clothes washed on Saturday|a basket of dirty socks and shirts by the washing machine|laundry is the clothes you wash; detergent is what you wash them with|laundry 是要洗的衣物；detergent 是洗衣用的洗涤剂|detergent is the soap you wash with, not the wet clothes you hang on the line|detergent 是用来洗的肥皂类东西，不是晾在绳上的湿衣服|bleach is a harsh chemical, not the clothes themselves|bleach 是刺激性的化学品，不是衣物本身|laun · dry|the au that says /aw/|au 读 /ɔː/
      detergent|a scoop added to a washing machine to clean clothes without fading colors|something that smells fresh and makes bubbles in washing-up water|a little added to the dishwasher so that plates do not come out soapy|detergent washes dirt away with soapy bubbles; bleach takes out color and kills germs|detergent 用泡沫洗掉污垢；bleach 使东西褪色并杀菌|bleach takes the color out of clothes, not something that cleans them without fading their colors|bleach 会让衣服褪色，不是洗干净又不褪色的东西|polish is a cream for making things shine, not soap for a washing machine or dishwasher|polish 是让东西发亮的上光剂，不是洗衣机或洗碗机用的洗涤剂|de · ter · gent|the -ent ending, with a soft g|g 读软音，结尾是 -ent
      bleach|a harsh chemical that can give off a poisonous gas when mixed with other cleaners|something spilled on blue jeans that leaves pale spots|the strong chemical smell in a pool that kills germs|bleach is a harsh chemical that whitens and kills germs; detergent is gentle soap for washing|bleach 是能漂白、杀菌的强化学品；detergent 是温和的洗涤剂|detergent is gentle soap that washes without taking out colors, not a harsh chemical that leaves pale spots|detergent 是不会褪色的温和洗涤剂，不是会留下白斑的强化学品|polish is a cream for making things shine, not a chemical that kills germs or takes out color|polish 是擦亮东西的上光剂，不是杀菌或褪色的化学品|bleach|the ea vowel team and the ch ending|元音组合 ea，结尾是 ch
    `,
  },
);

const work = batch(
  "phrasal-verbs-of-work-and-choices",
  ["Phrasal Verbs of Work and Choices", "工作与选择的短语动词"],
  ["taking control, starting hobbies, refusing, cutting jobs and keeping to plans", "接管、培养爱好、拒绝、裁员与坚持计划"],
  `
  take over|to take control of|接管|A big company plans to ___ the little shop and run it as one of its branches.|Can you ___ the driving while I rest? I've been at the wheel for hours.|Weeds began to ___ the garden until no flowers could be seen.|take up,carry out|took over,taken over,taking over
  take up|to start a hobby; to fill space or time|开始从事；占据|She decided to ___ the piano at the age of forty, starting with simple tunes.|He wants to ___ tennis this summer, so he has bought his first racket.|After retiring, Grandpa chose to ___ painting as a new hobby.|take over,stick to|took up,taken up,taking up
  turn down|to refuse; to lower the volume|拒绝；调低|She chose to ___ the job offer because the pay was too low.|Please ___ the radio; it's too loud and the baby is sleeping.|It was rude of him to ___ her kind invitation to dinner without giving a reason.|lay off,stand out|turned down,turning down
  lay off|to dismiss workers because there is no work; to stop doing|解雇；停止|The factory will ___ fifty of its workers, sending them home without jobs.|When sales fell, the shop had to ___ two of its staff.|The company may ___ hundreds of staff if business does not improve.|turn down,take over|laid off,laying off
  carry out|to perform or complete a task|执行|The soldiers will ___ their orders exactly as the general told them.|Scientists will ___ tests on the new medicine before it is sold.|We must ___ the plan step by step, doing each part in the right order.|bring about,go on|carried out,carrying out
  bring about|to cause to happen|导致|Heavy storms often ___ power cuts across the whole town.|What will ___ peace between the two countries after so many years of war?|Too much rain can ___ floods in the valley.|carry out,stand out|brought about,bringing about
  go on|to continue; to happen|继续；发生|Please ___ with your story; I want to hear what happened next.|The party will ___ until midnight, with music and dancing the whole time.|The show must ___, even if the lead singer is ill.|slow down,stick to|went on,gone on,going on
  slow down|to reduce speed|放慢|Drivers must ___ near the school, where children cross the road.|You're working too hard; you need to ___ and rest for a while.|The train began to ___ as it came into the station, its brakes squealing.|go on,stand out|slowed down,slowing down
  stick to|to keep to a plan or promise|坚持|If we ___ the plan, we will finish on time.|Players must ___ the rules of the game, or the referee will send them off.|She always tries to ___ her word, doing exactly what she promised.|go on,take up|stuck to,sticking to
  stand out|to be easy to see; to be better than others|显眼；出众|Her bright red coat made her ___ in the grey crowd.|His drawings ___ from the rest of the class because they are so good.|Write the title in thick black letters so that it will ___ on the poster.|slow down,bring about|stood out,standing out
  `,
  "context-clues",
  {
    intro: t(
      "When the new boss **took over**, she said we must **stick to** the plan, **carry out** every task and never **slow down**, but she would not **lay off** anyone. These ten phrasal verbs help you talk about work and choices: taking control, starting hobbies, refusing, cutting jobs and keeping to plans.",
      "新老板接管（**take over**）后说，我们必须坚持（**stick to**）计划，执行（**carry out**）每项任务，永不放慢（**slow down**）脚步，但她不会解雇（**lay off**）任何人。这十个短语动词帮你谈论工作与选择：接管、培养爱好、拒绝、裁员和坚持计划。",
    ),
    watchOut: {
      meanings: t(
        "To **take over** something is to take control of it from someone else; to **take up** something is to start doing it as a new hobby.",
        "**take over** 某事是从别人手里接管它；**take up** 某事是开始把它当作新爱好。",
      ),
      use: t(
        "People **carry out** a task or a plan by doing it; events **bring about** a change by causing it to happen.",
        "人通过亲自去做来 **carry out** 任务或计划；事件 **bring about** 变化，是引起它发生。",
      ),
      spelling: t(
        "Remember the past forms **laid off** with **ai**, **stuck to**, **stood out** and **brought about** with **ough**.",
        "记住过去式 **laid off**（含 **ai**）、**stuck to**、**stood out**，以及含 **ough** 的 **brought about**。",
      ),
    },
    notes: `
      take over|a big company running a little shop as one of its branches|someone taking the driving while the tired driver rests|weeds spreading through a garden until no flowers can be seen|take over means to take control; take up means to start a hobby|take over 是接管；take up 是开始培养爱好|take up means to start a new hobby, not to take control of a shop, the driving or a garden|take up 是开始新爱好，不是接管店铺、驾驶或花园|carry out means to do a task, not to take control away from someone else|carry out 是执行任务，不是从别人手里夺取控制|take · o · ver|take becomes took in the past: took over|过去式是 took over
      take up|starting the piano at forty with simple tunes|starting tennis this summer with a first racket|starting painting as a new hobby after retiring|take up means to start a new hobby; take over means to take control|take up 是开始新爱好；take over 是接管|take over means to take control of something run by someone else, not to start a new hobby|take over 是接管别人管的东西，不是开始新爱好|stick to means to keep doing what you already do, not to start something new|stick to 是坚持已有的事，不是开始新的事|take · up|take becomes took in the past: took up|过去式是 took up
      turn down|a job offer refused because the pay is too low|a loud radio made quieter while the baby sleeps|a kind dinner invitation refused rudely without a reason|turn down means to refuse an offer or make a sound quieter; lay off means to dismiss workers|turn down 是拒绝或调低音量；lay off 是解雇|lay off means to dismiss workers, not to refuse an offer or make a radio quieter|lay off 是解雇工人，不是拒绝提议或把收音机调小|stand out means to be easy to see, not to refuse an offer or lower a sound|stand out 是显眼，不是拒绝或调低声音|turn · down|the ur in turn that says /er/|turn 中 ur 读 /ɜː/
      lay off|a factory sending fifty workers home without jobs|a shop dismissing two staff when sales fall|a company that may dismiss hundreds if business does not improve|lay off means to dismiss workers; turn down means to refuse an offer|lay off 是解雇；turn down 是拒绝|turn down means to refuse an offer or a person who asks, not to send your own workers home without jobs|turn down 是拒绝提议或求职者，不是让自己的工人失业回家|take over means to take control of something, not to send workers away|take over 是接管，不是把工人打发走|lay · off|lay becomes laid, with ai: laid off|过去式是带 ai 的 laid off
      carry out|soldiers following their orders exactly|scientists testing a new medicine before it is sold|a plan done step by step in the right order|carry out means to do a task; bring about means to cause something to happen|carry out 是执行任务；bring about 是引起|bring about means to cause a change, not to obey orders or run tests yourself|bring about 是引起变化，不是服从命令或亲自做实验|go on means to continue or happen, not to obey orders or run tests|go on 是继续或发生，不是服从命令或做实验|car · ry · out|the y becomes i in the past: carried out|过去式 y 变 i：carried out
      bring about|storms causing power cuts across a town|something that could cause peace after years of war|too much rain causing floods in a valley|bring about means to cause something to happen; carry out means to do a task yourself|bring about 是引起某事；carry out 是亲自执行任务|carry out needs a person doing a planned task, not storms or rain causing floods or power cuts|carry out 要有人执行计划好的任务，不是暴风雨引起洪水或停电|stand out means to be easy to see, not to cause something to happen|stand out 是显眼，不是引起某事|bring · a · bout|bring becomes brought in the past: brought about|过去式是 brought about
      go on|someone asked to continue a story to hear what happened next|a party continuing until midnight with music and dancing|a show continuing even if the lead singer is ill|go on means to continue; slow down means to go less fast|go on 是继续；slow down 是放慢|slow down means to go less fast, not to continue a story, a party or a show|slow down 是放慢速度，不是继续讲故事、聚会或演出|stick to needs a plan or a rule to keep to, not a story, a party or a show to continue|stick to 要接坚持的计划或规则，不是继续讲故事、聚会或演出|go · on|go becomes went and gone: went on, gone on|过去式 went on，过去分词 gone on
      slow down|drivers near a school where children cross|someone working too hard who needs rest|a train coming into a station with its brakes squealing|slow down means to go less fast; go on means to keep going|slow down 是放慢；go on 是继续|go on means to keep going, the opposite of reducing speed and resting|go on 是继续，和放慢、休息正好相反|stand out means to be easy to see, not to reduce speed|stand out 是显眼，不是减速|slow · down|the ow in slow that says a long o|slow 中 ow 读长音 o
      stick to|following a plan in order to finish on time|following the rules of a game so as not to be sent off|doing exactly what you promised|stick to means to keep to a plan, rule or promise; go on means to continue|stick to 是坚守计划、规则或诺言；go on 是继续|go on means to continue, and it is not followed by a plan, a rule or a promise you keep|go on 是继续，后面不接要遵守的计划、规则或诺言|take up means to start a new hobby, not to keep to a plan or a promise|take up 是开始新爱好，不是坚守计划或诺言|stick · to|stick becomes stuck in the past: stuck to|过去式是 stuck to
      stand out|a bright red coat in a grey crowd|drawings so good they are better than the rest of the class's|a title in thick black letters on a poster|stand out means to be easy to see or better than others; slow down means to reduce speed|stand out 是显眼或出众；slow down 是减速|slow down means to reduce speed, not to be easy to see or better than others|slow down 是减速，不是显眼或出众|bring about means to cause something to happen, not to be easy to see|bring about 是引起某事，不是显眼|stand · out|stand becomes stood in the past: stood out|过去式是 stood out
    `,
  },
);

/** batchesF are the batches of housework and of phrasal verbs of work and choices. */
export const batchesF: readonly BatchSpec[] = [housework, work];
