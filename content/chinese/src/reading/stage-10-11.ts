// The reading topics of the senior required course (docs/chinese-curriculum.md §18.9), after the learning task groups of
// the senior standard: fiction for its people, meaning and craft; modern poems for their images, feeling and language;
// prose for its feeling and its shape; practical texts, news, features and reports, for their facts, views and
// methods; arguments for their claims, their line and their logic; materials of several media for how each tells and
// how far each can be trusted; and classical prose for its words and its argument. Each topic asks two knowledge points
// of its ten texts, three questions a text, and comes after the reading of grade 9 it builds on.

import { t } from "@ga/content";

import type { GradeTopic } from "../grammar/index.ts";
import { stageReadingTopics } from "./stage-1-2.ts";
import { stageThreeFourReading } from "./stage-3-4.ts";
import { stageFiveSixReading } from "./stage-5-6.ts";
import { stageSevenNineReading } from "./stage-7-9.ts";
import { FICTION_10, POETRY_10 } from "./texts-10a.ts";
import { PRACTICAL_10, PROSE_10 } from "./texts-10b.ts";
import { ARGUMENT_10, MEDIA_10 } from "./texts-10c.ts";
import { CLASSICAL_10 } from "./texts-10d.ts";
import { PASSAGE, POEM, type ReadingSpec, readingTopicOf as topicOf } from "./topic-kit.ts";

/** SPECS are the reading topics of the senior required course, in order. */
const SPECS: readonly ReadingSpec[] = [
  {
    grade: 10,
    id: "reading-10-fiction",
    title: t("Fiction", "小说阅读"),
    summary: t(
      "Short stories written for the subject: what their people are and what the story means, and how its telling, its details and its ending make that felt.",
      "读为本学科写的短篇小说：人物是怎样的人，小说表达了什么，叙述、细节和结尾怎样让读者感受到这些。",
    ),
    intro: t(
      "A story seldom says what it means. In a tale of a night watchman who leaves the gate lamp burning for a boy who comes home late from his shift, the watchman never speaks of care: he only trims the wick and waits. Who he is shows in what he does, and the meaning grows from it: kindness that asks for nothing.\n\nHow it is told matters as much: a detail that comes back, a silence left unbroken, an ending that stops before the feeling is named. The first knowledge point asks the people and the meaning of a story, the second the craft of its telling.",
      "小说很少直接说出自己的意思。一个看门人为下夜班晚归的少年留着门灯，从不说一句关心的话，只是剪剪灯芯，等着。人物是怎样的人，从他做的事里看出来；小说的意思也从这里长出来：不求回报的善意。\n\n怎样讲同样重要：反复出现的细节，没有打破的沉默，在感情说出口之前就停下的结尾。第一个知识点问人物和主题，第二个问叙述的艺术。",
    ),
    data: FICTION_10,
    kind: PASSAGE,
    after: "reading-9-fiction",
    points: [
      [
        "people",
        t("People and Meaning", "人物形象和主题"),
        t(
          "Judge a person by what the story shows: actions, words, looks and what others do in answer. Gather two or three of these and name the trait they share, then say what feeling or thought the story builds from the people: the theme. A theme is a view of life, not a summary of the plot.\n\nIn a story of a postman who climbs a mountain each week to read letters aloud to a blind woman, and one day reads her a letter that never came, the lie and the climb together show tenderness; the theme is that care can be a kind of truth.\n\n> **Watch out.** Do not judge from one detail alone or from what the story never shows: a man who waives a fee is not careless with money. And keep the theme as wide as the whole story, not one scene of it.",
          "判断人物，要看小说写了什么：动作、语言、神态，以及别人怎样回应他。抓住两三处，概括出它们共同表现的性格，再说小说借这些人物表达了什么感情或思想：这就是主题。主题是对生活的认识，不是情节的复述。\n\n一篇小说写邮递员每周爬上山，给一位看不见的老人念信，有一天念了一封根本没有寄来的信：编信和爬山放在一起，写出他的体贴；主题是，关心有时也是一种真实。\n\n> **注意。** 不要只凭一处细节，也不要凭小说没写的东西去判断人物：不收钱的人不等于不会算账。主题要概括全篇，不能只说其中一个场面。",
        ),
      ],
      [
        "craft",
        t("The Craft of Telling", "叙述的艺术"),
        t(
          "Ask what each choice of telling does. A detail that returns is a thread or an echo between start and end; an object can stand for a feeling; a silence or a gesture in place of words keeps the feeling unspoken and stronger; a scene told in full and another in one line show where the weight lies; an ending that stops short leaves room to think. Name the method, then say its effect on the people or the meaning.\n\nIn a story where a clock in a shop stops on the day the owner's son leaves and is wound again the day he returns, the clock is the thread and its stopping and going stand for the waiting.\n\n> **Watch out.** Name an effect the text supports, not a general one any story could have. And tell a method by what the sentence does: a sentence of pure action is not psychological description.",
          "要问每一种写法起了什么作用。反复出现的细节，是线索，也让开头和结尾照应；一件物品可以寄托感情；用沉默或一个动作代替语言，让感情不说破而更有力量；一处详写、一处一句带过，看出重点在哪里；在关键处戛然而止的结尾，给读者留下思考的空间。先说出写法，再说它对人物或主题的作用。\n\n一篇小说写钟表店的钟在儿子离家那天停了，儿子回来那天又被上好了弦：钟是线索，它的停和走，代表了等待。\n\n> **注意。** 说作用要有文中的依据，不要说一句放到哪篇小说里都行的话。判断写法要看句子本身：只写动作的句子，不是心理描写。",
        ),
      ],
    ],
  },
  {
    grade: 10,
    id: "reading-10-poetry",
    title: t("Modern Poetry", "现代诗歌阅读"),
    summary: t(
      "Modern poems written for the subject: the images they are made of and the feeling those carry, and the language, figures and shape that give them force.",
      "读为本学科写的现代诗：诗由哪些意象构成，意象里寄托了什么感情，语言、修辞和结构怎样让诗有力量。",
    ),
    intro: t(
      "A modern poem thinks in pictures. A poem that says “母亲的针脚/缝住了我离家的路” does not tell of sewing alone: the stitches are her care, and the road they hold shut is the son's leaving. An image is a thing seen that carries a feeling.\n\nThe words are chosen as closely as the images: a verb given to a thing that cannot act, a small thing set against a vast one, a line that turns at the end. The first knowledge point asks the images and the feeling of a poem, the second its language and methods.",
      "现代诗用画面来思考。一首诗写“母亲的针脚/缝住了我离家的路”，说的不只是缝衣服：针脚是母亲的牵挂，被缝住的路是儿子的远行。意象就是寄托了感情的物象。\n\n诗的语言和意象一样讲究：给不会动的东西一个动作，把很小的东西和很大的东西放在一起，在最后一行转一个弯。第一个知识点问意象和情感，第二个问语言和表现手法。",
    ),
    data: POETRY_10,
    kind: POEM,
    after: "reading-9-poems",
    points: [
      [
        "images",
        t("Images and Feeling", "意象和情感"),
        t(
          "Find the images, the things the poem pictures, and ask what each stands for: what in life is it like, and what feeling does the poem lay on it? Then follow the feeling through the stanzas, often from a scene to a memory to a thought, and name it closely: not just “sad” but longing for someone gone, regret for something lost.\n\nIn a poem where a grandmother's cleaver still hangs on the kitchen wall “比我的个子还高” and no one uses it, the cleaver stands for her; the feeling is missing her in a house that goes on without her.\n\n> **Watch out.** An image is not only its literal thing: a kite in a poem may be a child leaving. But the meaning must come from the poem: name what its lines support, not what the thing could mean anywhere.",
          "先找出意象，即诗中写到的物象，再问它代表什么：像生活中的什么，诗人给它寄托了什么感情。然后顺着诗节看感情怎样发展，常常是由景到忆再到思，并把感情说准确：不只是“难过”，而是对离去的人的思念、对失去的东西的惋惜。\n\n一首诗写奶奶的菜刀还挂在厨房墙上，“比我的个子还高”，却没有人再用它：菜刀代表奶奶，感情是在一个照常过日子的家里，对她的想念。\n\n> **注意。** 意象不只是字面上的东西：诗里的风筝可以是离家的孩子。可意思要从诗里来：说诗句能支持的，不要说这样东西放在哪里都能代表的意思。",
        ),
      ],
      [
        "language",
        t("Language and Methods", "语言和表现手法"),
        t(
          "Look at the words that do most: a verb that gives life to a thing (personification), a likening, a colour that stands for the thing itself, a small thing set against a vast one, two sayings that seem to clash but both hold. Then look at the methods of the whole: feeling carried by a scene, an end that answers the start, stanzas that move in time or go deeper step by step. Name the method and say what it does for the feeling.\n\nIn “一盏灯/把黑夜咬出一个洞”, the verb 咬 gives the lamp a fierce mouth: the light is small, the dark vast, and the light still wins.\n\n> **Watch out.** A seeming contradiction in a poem is usually the point, not a fault. And tell the figures apart: giving a thing a human act is personification, saying it is like something else is a likening.",
          "看最有力量的字词：让物有了生命的动词（拟人），比喻，用颜色代替事物本身，把很小的和很大的放在一起，两个看似矛盾、其实都成立的说法。再看全诗的手法：借景抒情，首尾呼应，诗节按时间推进或层层深入。说出手法，再说它对表达感情起了什么作用。\n\n“一盏灯/把黑夜咬出一个洞”，一个“咬”字，让灯有了一张有力的嘴：灯光很小，黑夜很大，灯光还是赢了。\n\n> **注意。** 诗里看似矛盾的说法往往正是用意所在，不是毛病。还要分清修辞：让物做人的动作是拟人，说它像别的东西是比喻。",
        ),
      ],
    ],
  },
  {
    grade: 10,
    id: "reading-10-prose",
    title: t("Prose", "散文阅读"),
    summary: t(
      "Essays written for the subject: the feeling and the thought behind the things they tell, and the language, details, thread and shape that carry them.",
      "读为本学科写的散文：所写的人、事、物背后的感情和思考，以及承载它们的语言、细节、线索和结构。",
    ),
    intro: t(
      "Prose tells small things to say large ones. An essay on a grandmother's sewing basket can be about the years she spent on others; the basket is where the feeling gathers. The writer often says the thought outright near the end, after the things have made it felt.\n\nThe form serves that feeling: a thread that joins the parts, a turn from then to now, a detail of sound or smell that brings the past back. The first knowledge point asks the feeling and meaning of an essay, the second its language and structure.",
      "散文写小事，说的是大道理、真感情。一篇写奶奶针线筐的散文，说的可以是她为别人操劳的一生；针线筐是感情聚集的地方。作者常在结尾处把想法说出来，那时前面的人和事已经让读者感受到了。\n\n形式为感情服务：把各部分串起来的线索，从过去到现在的转折，一个把往事带回来的声音或气味。第一个知识点问情感和意蕴，第二个问语言和结构。",
    ),
    data: PROSE_10,
    kind: PASSAGE,
    after: "reading-10-poetry",
    points: [
      [
        "meaning",
        t("Feeling and Meaning", "情感和意蕴"),
        t(
          "Ask what the writer feels about the person, thing or scene, and what thought grows from it. Look for the sentence that states the thought, often near the end, and for the words or gestures that carry the feeling before it is named. Say both: the feeling (missing, gratitude, regret, calm) and the meaning (what the writer has come to see).\n\nIn an essay about a mother who keeps every bus ticket of her son's visits in a tin, the tin shows how she counts the days between them; the meaning is that the one who stays behind keeps the time of the one who goes.\n\n> **Watch out.** A literal reading misses the point: “他把这些都放下了” is not about putting things on a table. And do not answer with only one part of the essay: the thought is what the whole of it builds to.",
          "要问作者对所写的人、物、景有什么感情，从中生出了什么思考。找一找直接说出想法的句子，常在结尾；再找在感情说出之前就承载着它的词语和动作。两样都要说：感情（怀念、感激、惋惜、宁静），意蕴（作者领悟到了什么）。\n\n一篇散文写母亲把儿子每次回家的车票都收在一个铁盒里：铁盒写出了她怎样数着两次相见之间的日子；意蕴是，留下来的人替离开的人记着时间。\n\n> **注意。** 只看字面会读错：“他把这些都放下了”说的不是把东西放到桌上。也不要只回答其中一部分：意蕴是整篇文章最后走到的地方。",
        ),
      ],
      [
        "form",
        t("Language and Structure", "语言和结构"),
        t(
          "For language, ask what a figure, a repeated word or a sensory detail does: makes a scene seen, sets off a silence with a small sound, sets the past against the present. For structure, find the thread that runs through the parts, the order (by time, by seasons, from event to thought), and what a paragraph does in the whole: lay ground, turn, echo the start, state the theme.\n\nIn an essay that opens on a kettle singing on a stove and ends on the same kettle cold in an empty house, the kettle is the thread and the two scenes echo each other across the years.\n\n> **Watch out.** Say the effect in this essay, not a general merit. And a paragraph that sets two things side by side is a contrast, not a repeat that could be cut.",
          "语言方面，要问一处修辞、一个反复的词或一个感官细节起了什么作用：让场景如在眼前，用细小的声音衬出安静，把过去和现在放在一起对比。结构方面，要找贯穿各部分的线索、写作顺序（按时间，按四季，由事到理），以及一段话在全文中的作用：铺垫，转折，照应开头，点明主旨。\n\n一篇散文开头写炉子上的水壶在唱歌，结尾写同一只水壶冷冷地放在空屋里：水壶是线索，两个场面隔着岁月前后照应。\n\n> **注意。** 说作用要落到这篇文章，不说放之四海皆准的好处。把两样东西放在一起写的段落是对比，不是可以删去的重复。",
        ),
      ],
    ],
  },
  {
    grade: 10,
    id: "reading-10-practical",
    title: t("News, Features and Reports", "实用性阅读：新闻、通讯和报告"),
    summary: t(
      "News reports, features and survey reports on made-up places: their facts and views and how they are laid out, and the stance and methods of the writer.",
      "读关于虚构地方的消息、通讯和调查报告：其中的事实和观点，文章怎样安排，作者的立场和写法。",
    ),
    intro: t(
      "A practical text is read for what it tells and how far it can be relied on. A news report puts the main fact first, in the lead; a feature tells a person or an event at length, with scenes and words; a survey report says why and how it asked, what it found, and what it proposes.\n\nIn a report that a town has opened a night market, “the market has 120 stalls” is a fact, “the market will liven up the town” a view, and the view is put in an official's mouth: that is how a report stays objective. The first knowledge point asks the facts, views and layout, the second the stance and methods of the writer.",
      "读实用类文本，要读出它告诉了什么，有多可靠。消息把最主要的事实放在最前面的导语里；通讯详细地写一个人或一件事，有场面，有人物的话；调查报告说明为什么调查、怎样调查、发现了什么、提出了什么建议。\n\n一篇报道写某镇开了夜市：“夜市有一百二十个摊位”是事实，“夜市会让小镇热闹起来”是观点，而这个观点是借一位干部的口说出来的：报道就是这样保持客观的。第一个知识点问事实、观点和结构，第二个问作者的立场和写法。",
    ),
    data: PRACTICAL_10,
    kind: PASSAGE,
    after: "reading-9-cross-media",
    points: [
      [
        "facts",
        t("Facts, Views and Layout", "事实、观点和结构"),
        t(
          "A fact can be checked: a date, a figure, an event, what someone said. A view is a judgment, a prediction or a proposal: what should be, what something means. Find the main fact (in news, the lead), tell facts from views, and see how the text is laid out: a report from most to least important, a feature often in time order, a survey report from purpose and method to findings and proposals.\n\nIn a report that “last year 3,000 trees were planted on the river bank, and experts say the bank will hold in the next flood”, the planting is a fact, the experts' forecast a view.\n\n> **Watch out.** A view stays a view when an expert or an official states it: who says it does not make it a fact. And a detail the text gives is not its main fact.",
          "事实是可以核实的：日期、数字、事件、某人说了什么。观点是判断、预测或建议：应该怎样，这件事意味着什么。要找出主要事实（消息看导语），分清事实和观点，看清文章的结构：消息按重要程度由主到次，通讯常按时间顺序，调查报告从目的、方法到结果、建议。\n\n一则报道说“去年河岸上种了三千棵树，专家说下次发大水时堤岸能保住”：种树是事实，专家的预测是观点。\n\n> **注意。** 观点即使是专家或干部说的，也还是观点：谁说的不会把它变成事实。文中的一个细节也不是它的主要事实。",
        ),
      ],
      [
        "stance",
        t("Stance and Methods", "立场和写法"),
        t(
          "A reporter's stance shows less in what he says than in what he chooses: which facts, whose words, what comes first and last. Ask what a quotation, a figure or a scene does: makes the report concrete and credible, shows a feeling, sets then against now. Ask too whether the text is balanced: does it give other sides and the problems, or only praise?\n\nA feature on a ferryman that never praises him, but tells his forty years, his ten thousand crossings and his one sentence about the river, shows respect through facts.\n\n> **Watch out.** Objective does not mean without a view: the choice of facts carries one. And a method's effect must fit this text: a figure here gives evidence, not decoration.",
          "记者的立场，与其说在他说了什么，不如说在他选择了什么：选哪些事实，用谁的话，先写什么，最后写什么。要问一处引语、一个数字、一个场面起了什么作用：让报道具体可信，写出感情，把过去和现在对比。还要问报道是否全面：有没有写到别的看法和问题，还是只有赞扬？\n\n一篇写摆渡人的通讯，一句也不夸他，只写他四十年、上万次摆渡和他说的一句关于河的话：敬意就在事实里。\n\n> **注意。** 客观不等于没有态度：选择哪些事实，本身就带着态度。说写法的作用要合这篇文章：这里的数字是证据，不是装饰。",
        ),
      ],
    ],
  },
  {
    grade: 10,
    id: "reading-10-argument",
    title: t("Logic in Argument", "思辨性阅读：论证和逻辑"),
    summary: t(
      "Arguments written for the subject: the claim each makes and the line by which it argues it, and the logic it uses, the faults it finds in others' reasoning and the ones it avoids.",
      "读为本学科写的议论文：作者的观点和论证思路，文中运用的逻辑，指出了别人推理中的哪些错误，自己又怎样避免。",
    ),
    intro: t(
      "To read an argument critically is to ask what it claims, how it gets there, and whether the steps hold. An essay on “practice makes perfect” may grant the saying, then show that practice without attention makes nothing perfect, and conclude that the point is how one practises: that conclusion is its claim, the two examples its proof.\n\nLogic is the test of the steps. “Most people do it, so it is right” confuses number with reason; “one of them cheated, so they all do” leaps from one to all. The first knowledge point asks the claim and the line, the second the logic.",
      "思辨地读议论文，要问它提出了什么观点，怎样得出这个观点，每一步站不站得住。一篇谈“熟能生巧”的文章，可能先承认这句话有道理，再说明不用心的练习练不出巧来，最后得出：关键在于怎样练。这个结论是它的观点，两个例子是它的论据。\n\n逻辑是检验每一步的尺子。“大多数人这样做，所以这样做是对的”，是把人多当成了有理；“他们中有一个人作弊，所以他们都作弊”，是由一个跳到了全体。第一个知识点问观点和论证思路，第二个问逻辑。",
    ),
    data: ARGUMENT_10,
    kind: PASSAGE,
    after: "reading-9-argument",
    points: [
      [
        "claim",
        t("Claim and Line of Argument", "观点和论证思路"),
        t(
          "Find the claim: often in the title, the opening or the sentence after “可见” or “所以”, and always the point every part serves. Then trace the line: what the opening sets up (a saying, a common view, an event), what each paragraph does (explains, proves by example, answers an objection, adds a limit), and how the end concludes. An example is evidence for the claim, not the claim itself.\n\nAn essay that opens “有人说，天才靠天赋”, shows two gifted people who failed and one plain one who succeeded, and ends “所以，成就靠的是坚持”, refutes a view and sets up its own: the claim is the last sentence.\n\n> **Watch out.** A paragraph beginning “当然” usually adds a limit to the claim, not a new claim or a reversal. And state the claim as wide as the essay argues, no wider.",
          "先找观点：常在标题、开头或“可见”“所以”后面的句子里，总之是全文各部分都在为它服务的那句话。再理清思路：开头引出了什么（一句俗语、一种看法、一件事），每一段起什么作用（解释、举例证明、反驳异议、补充限制），结尾怎样得出结论。事例是证明观点的论据，不是观点本身。\n\n一篇文章开头说“有人说，天才靠天赋”，接着举两个有天赋却失败的人和一个普通却成功的人，结尾说“所以，成就靠的是坚持”：它先驳后立，最后一句是观点。\n\n> **注意。** 以“当然”开头的段落，常常是给观点加上限制，不是提出新观点，也不是推翻原来的观点。概括观点不能比文章论证的范围更宽。",
        ),
      ],
      [
        "logic",
        t("Logic and Fallacies", "逻辑和谬误"),
        t(
          "Name the method an argument uses (example, counter-example, likening, contrast, quotation, reasoning from consequences) and what it proves. Then test reasoning, the essay's own and the views it attacks: does the conclusion follow? Common faults: judging by numbers (“everyone does it”), leaping from one case to all (以偏概全), picking only the cases that fit, taking a denial for its opposite (“slow is not always good, so fast is”), a label in place of a reason, attacking the person instead of the view.\n\n“他小时候成绩不好，所以他的建议不值得听” attacks the man, not the proposal: whether the proposal holds depends on its reasons.\n\n> **Watch out.** A vivid likening proves less than it seems: say what it shows, and that the reasoning must still hold. And a counter-example refutes “all”, not “some”.",
          "先说出文中用的论证方法（举例、举反例、比喻、对比、引用、从后果推论）以及它证明了什么。再检验推理，包括作者自己的和他反驳的观点：结论是不是真能推出来？常见的错误有：以人多为理（“大家都这样做”），以偏概全，只挑合自己意思的例子，把否定当成了相反的肯定（“慢不一定好，所以快一定好”），用贴标签代替讲理，攻击人而不针对观点。\n\n“他小时候成绩不好，所以他的建议不值得听”：攻击的是人，不是建议；建议对不对，要看它的理由。\n\n> **注意。** 生动的比喻证明的东西没有看起来那么多：说出它说明了什么，推理本身还得站得住。一个反例能驳倒“所有的都是”，驳不倒“有的是”。",
        ),
      ],
    ],
  },
  {
    grade: 10,
    id: "reading-10-media",
    title: t("Media and Culture Today", "跨媒介阅读与当代文化"),
    summary: t(
      "Materials of several media on one matter, posts, clips, notices, reports, headlines and labels: how each medium tells it, and how far each can be trusted.",
      "读同一件事的几种媒介材料：帖子、短视频、公告、报道、标题和标签，每种媒介怎样讲述，每则材料有多可信。",
    ),
    intro: t(
      "One event reaches us through many media at once. A heat wave appears as a weather bureau's figures, a clip of melting road tar captioned “the city is cooking”, and a paper's report of how many people were treated for heatstroke. Each tells it in its own way: the figures are exact and dry, the clip vivid and fast but swollen, the report wider and checked.\n\nTo take part in today's culture is to read across them: compare what each shows and leaves out, trace a claim to its source, and see who gains from it. The first knowledge point asks how the media tell, the second how far each can be trusted.",
      "同一件事，往往同时通过许多媒介来到我们面前。一场高温，气象台给出数字，一段短视频拍下路面的沥青化了，配上“全城都要熟了”，报纸报道有多少人中暑就医。每种媒介讲法不同：数字准确而干巴，视频生动、传得快却夸大，报道更全面，也经过核实。\n\n参与当代文化生活，就要跨着媒介读：比较每则材料呈现了什么、漏掉了什么，追查一个说法的来源，看看谁会从中得到好处。第一个知识点问各种媒介怎样讲述，第二个问每则材料有多可信。",
    ),
    data: MEDIA_10,
    kind: PASSAGE,
    after: "reading-10-practical",
    points: [
      [
        "telling",
        t("How Each Medium Tells", "不同媒介的表达"),
        t(
          "Say what each material is (an official notice, a report, a review, a clip, a post, an advert, a headline) and what marks its telling: figures and plain statements; scenes and quotations; images and captions; short, emotive, exclamatory lines. Then compare them on the same matter: what each brings out, what each leaves out, and which suits which need.\n\nA museum's notice gives opening hours and prices; a visitor's post gives a queue and a feeling; a critic's review gives what is worth seeing. They answer different questions.\n\n> **Watch out.** Vivid is not the same as accurate: a clip's picture may be real while its caption overstates. And do not rank media in general; say which serves this question best.",
          "先说出每则材料是什么（官方公告、报道、评论、短视频、帖子、广告、标题），再说它的表达特点：数字和平实的陈述；场面和引语；画面和配文；短句、感叹、带着情绪的词。然后在同一件事上比较它们：各自突出了什么，漏掉了什么，各适合什么样的需要。\n\n博物馆的公告给出开放时间和票价，观众的帖子写排队和感受，评论家的文章说哪些值得看：它们回答的是不同的问题。\n\n> **注意。** 生动不等于准确：视频的画面可能是真的，配文却说过了头。也不要笼统地给媒介排高低，要说对这个问题来说哪一则最合适。",
        ),
      ],
      [
        "trust",
        t("Judging Information", "辨识信息"),
        t(
          "Test each claim: Is the source named? Is the speaker expert in this? Does the wording hold back (“usually”, “may”) or swell (“the whole city”, “everyone”)? Does it urge you to forward or to buy? Does a figure or the original text bear it out? Check headlines against the source, a picture against its time and place, a survey against its size, and look for who gains if you believe it.\n\nA post that “a study shows phones cause poor eyesight in nine children out of ten”, naming no study and ending with an advert for eye drops, fails on source, on wording and on motive.\n\n> **Watch out.** Many views or shares do not make a claim true. And distrust is not judgment either: say why a material can or cannot be relied on, from what it shows.",
          "逐条检验说法：有没有写明来源？说话的人是不是这方面的行家？措辞是有分寸（“一般”“可能”）还是夸大（“全城”“人人”）？是不是催你转发或购买？数字或原文能不能证实它？要把标题和原文对照，把图片和拍摄的时间地点对照，看调查的范围有多大，还要看看你相信了它，谁会得到好处。\n\n一条帖子说“研究表明，手机让十个孩子里九个视力变差”，没有说是哪项研究，结尾是眼药水的广告：来源、措辞、目的三方面都站不住。\n\n> **注意。** 看的人多、转的人多，不能让一个说法变成真的。什么都不信也不是判断：要根据材料本身，说出它为什么可信或不可信。",
        ),
      ],
    ],
  },
  {
    grade: 10,
    id: "reading-10-classical",
    title: t("Classical Prose", "文言文阅读"),
    summary: t(
      "Short classical prose of the masters, the histories, the Six Dynasties and the Song, none of it from the textbooks: the sense of words and sentences in context, old against new, and what each text says and how it argues.",
      "读诸子、史书、魏晋和宋代的文言短文，都不是教材里的篇目：实词和句子在语境中的意思，古今词义的不同，文章说了什么、怎样说理。",
    ),
    intro: t(
      "A classical word often looks like a modern one and means something else. In “孟尝君有舍人而弗悦，欲逐之”, 舍人 is a retainer who lives in the lord's house, not a modern “lodger”; in the same text 走 would mean “run”. Read the word in its sentence, test the modern sense, and look for a word set against it.\n\nMost of these short pieces tell something and then say what it means: the lesson is in the last sentences, and the telling is its proof. The first knowledge point asks the sense of words and sentences, the second what the text says and how it argues.",
      "文言的字词常常和现代汉语长得一样，意思却不同。“孟尝君有舍人而弗悦，欲逐之”，“舍人”是住在主人家里的门客，不是今天的房客；在同样的文章里，“走”是跑。要把词放回句子里读，试一试现代的意思通不通，再找一找和它相对的词。\n\n这些短文大多先讲一件事，再说出道理：道理在最后几句，叙事是它的证明。第一个知识点问字词和句子的意思，第二个问文章的内容和说理。",
    ),
    data: CLASSICAL_10,
    kind: PASSAGE,
    after: "reading-9-classical",
    points: [
      [
        "words",
        t("Words and Sentences in Context", "实词、古今异义和句意"),
        t(
          "For a word: try the modern sense in the sentence; if it does not fit, look for a word the text sets against it (专利 against 散逸, 向 against 今), a later use of the same word, or what the story needs at that point. Watch words used as verbs (表, 之, 就) and words with an old sense (走 run, 用 funds, 知道 know the Way). For a sentence: gloss each word, keep the grammar (a rhetorical 岂……哉 means “surely not”), and check it against what comes before and after.\n\nIn “先生之恩，生死而肉骨也”, 肉 is a verb: to put flesh back on the bones, to bring the dead to life.\n\n> **Watch out.** The same character may mean two things in one text: 异 is “marvel at” in one line and “differ from” in the next. And a gloss must make sense in the sentence, not only in a dictionary.",
          "解释字词：先把现代的意思放进句子里试试；讲不通，就找文中与它相对的词（“专利”对“散逸”，“向”对“今”），找同一个词在后文的用法，或者看故事在这里需要什么意思。要注意活用为动词的词（表、之、就）和古今意思不同的词（走是跑，用是路费，知道是懂得道理）。翻译句子：逐词落实，保留句式（“岂……哉”是反问，意思是难道……吗），再和上下文核对。\n\n“先生之恩，生死而肉骨也”，“肉”是动词：让白骨长出肉来，使死人复活。\n\n> **注意。** 同一个字在一篇文章里可能有两个意思：“异”在这一句是感到惊奇，在下一句是不同于。解释要放进句子里讲得通，不能只是词典上的意思。",
        ),
      ],
      [
        "argument",
        t("Content and Argument", "内容和说理"),
        t(
          "Say what happens or what is claimed, then how the text makes its point: a story told and then commented on, a likening (one thing set beside another), a contrast, a chain of “则”, a rhetorical question, a quotation of a sage. Find the sentence that states the lesson and say it in general terms, not only for the story's own people.\n\nIn a fable where a man guards a stump because a hare once broke its neck on it, the lesson is not about hares or stumps: it is waiting for luck instead of working.\n\n> **Watch out.** Do not take a detail of the story for its lesson: a fable of crossing a river is not advice about rivers. And when a speaker persuades a king by a story, say how the story is turned on the king.",
          "先说文章写了什么事、提出了什么看法，再说它怎样说理：先叙事后议论，打比方（拿一件事和另一件事相比），对比，用一连串的“则”层层推进，反问，引用圣贤的话。找到点明道理的句子，用概括的话说出道理，不能只说故事里的人。\n\n一则寓言写一个人守着树桩，因为曾经有一只兔子撞死在上面：道理不在兔子和树桩，而是不努力、只等好运。\n\n> **注意。** 不要把故事的细节当成道理：一则过河的寓言，不是在教人怎样过河。说客用故事劝君主时，还要说出故事是怎样落到君主身上的。",
        ),
      ],
    ],
  },
];

/** stageTenElevenReading are the reading topics of the senior courses, in order, each after the reading before it. */
export const stageTenElevenReading: readonly GradeTopic[] = (() => {
  const known = [...stageReadingTopics, ...stageThreeFourReading, ...stageFiveSixReading, ...stageSevenNineReading];
  const built: GradeTopic[] = [];
  for (const spec of SPECS)
    built.push(
      topicOf(
        spec,
        [...known, ...built].map((x) => x.topic),
      ),
    );
  return built;
})();
