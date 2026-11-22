// The reading topics of grades 5 and 6 (docs/chinese-curriculum.md §18.9): narratives, poems, expository texts, texts
// with tables, the meaning and colour of words, and the order and ways of writing in grade 5; fiction, prose, arguments,
// methods of explaining, instructions, charts and maps, browsing and poems in grade 6. Each topic asks two knowledge
// points of its ten texts, three questions a text, and each comes after the recognition batch by which nearly every
// character of its texts has been taught.

import { t } from "@ga/content";

import type { GradeTopic } from "../grammar/index.ts";
import { stageReadingTopics } from "./stage-1-2.ts";
import { byContext, stageThreeFourReading } from "./stage-3-4.ts";
import { EXPOSITORY_5, NARRATIVES_5, POEMS_5 } from "./texts-5a.ts";
import { NON_CONTINUOUS_5, STRUCTURE_5, WORDS_5 } from "./texts-5b.ts";
import { ARGUMENTS_6, FICTION_6, POEMS_6, PROSE_6 } from "./texts-6a.ts";
import { BROWSING_6, EXPOSITORY_6, NON_CONTINUOUS_6 } from "./texts-6b.ts";
import { PASSAGE, POEM, type ReadingSpec, SIGN, readingTopicOf as topicOf } from "./topic-kit.ts";

/** SPECS are the reading topics of grades 5 and 6, in order. */
const SPECS: readonly ReadingSpec[] = [
  {
    grade: 5,
    id: "reading-5-narrative",
    title: t("Narratives: Outline and Detail", "叙事性作品：梗概和细节"),
    summary: t(
      "Narratives written for the subject: the outline of what happened, with its causes, and the details that show the people.",
      "读为本学科写的记叙文：事情的梗概和前因后果，表现人物的细节。",
    ),
    intro: t(
      "A narrative is read twice over: once for what happened, and once for the small things that make its people real. In “爷爷的修车摊”, Grandpa mends bicycles for almost nothing, opens his box again one snowy night for a delivery man, and is still called “修车爷爷” after he stops: that is the outline.\n\nThen the details: his tools “摆得整整齐齐”, his hands “冻得通红” in the snow. They show a careful, warm-hearted man without saying so. The first knowledge point asks the outline and why things happened, the second what a detail shows.",
      "读记叙文，要读两遍：一遍弄清发生了什么，一遍看那些让人物活起来的小地方。在《爷爷的修车摊》里，爷爷修车几乎不收钱，一个雪夜又为送外卖的叔叔打开工具箱，收了摊以后大家还叫他“修车爷爷”：这就是梗概。\n\n再看细节：他的工具“摆得整整齐齐”，雪夜里手“冻得通红”。这些细节没有直接夸爷爷，却写出了他做事仔细、心肠热。第一个知识点问梗概和事情的前因后果，第二个问细节表现了什么。",
    ),
    data: NARRATIVES_5,
    kind: PASSAGE,
    after: "reading-4-narrative",
    points: [
      [
        "outline",
        t("The Outline and Its Causes", "梗概和前因后果"),
        t(
          "An outline joins the beginning, the turn and the end in a few sentences, leaving out the details. A question of cause asks why something happened: find the sentence before or after it that gives the reason.\n\nWhy did Grandpa open his box again that night? Because he saw the delivery man “急得直搓手” over his broken chain.\n\n> **Watch out.** One event of the text, such as the snowy night alone, is too narrow for an outline; and a reason must be one the text gives, not one that only sounds likely.",
          "梗概要把开头、经过和结果用几句话连起来，细节可以省去。问原因的题，要找到这件事前后说明为什么的句子。\n\n爷爷那天晚上为什么又打开了工具箱？因为他看见叔叔车链子断了，“急得直搓手”。\n\n> **注意。** 只说文中的一件事，比如只说雪夜修车，作为梗概太窄了；原因要是文中写出来的，不能是听起来像、文中却没有说的。",
        ),
      ],
      [
        "detail",
        t("What a Detail Shows", "细节表现了什么"),
        t(
          "A detail is a small, exact thing a person does, says or has. Ask why the writer put it in: what does it show of the person or of the feeling at that moment?\n\nGrandpa's spanners and pliers lie “整整齐齐” in his old box: he is careful and loves his work.\n\n> **Watch out.** Do not read a detail only word for word: the neat box is not there to tell us how tidy boxes are, but what kind of man Grandpa is.",
          "细节是人物做的、说的或身边的一个很小、很具体的地方。想一想作者为什么写它：它表现了人物的什么，或者那时的什么心情？\n\n爷爷的扳手、钳子在旧木箱里摆得“整整齐齐”：说明他做事仔细，爱惜自己的手艺。\n\n> **注意。** 细节不能只照字面理解：写工具箱整齐，不是要告诉我们箱子该怎样摆，而是要写出爷爷是个怎样的人。",
        ),
      ],
    ],
  },
  {
    grade: 5,
    id: "reading-5-poems",
    title: t("Poems: Scene and Feeling", "读诗：情境和情感"),
    summary: t(
      "Classical poems in the public domain, with notes: the scene their lines paint, and the feeling they carry.",
      "读公有领域的古诗，附注释：诗句描绘的情境，诗中表达的情感。",
    ),
    intro: t(
      "A classical poem gives a scene and, through it, a feeling. In 叶绍翁's “萧萧梧叶送寒声，江上秋风动客情”, the plane leaves rustle in the cold and the autumn wind on the river stirs a traveller far from home: the scene brings on the feeling.\n\nRead the notes first, then picture the place, the time and what moves in it; then ask what the poet feels there. The first knowledge point asks the scene, the second the feeling.",
      "古诗通过一个情境表达一种情感。叶绍翁的“萧萧梧叶送寒声，江上秋风动客情”，梧桐叶在寒风里萧萧作响，江上的秋风吹动了出门在外的人的思乡之情：景物引出了情感。\n\n先读注释，再想象诗中的地点、时间和其中的动静；然后想一想诗人在这里有什么感受。第一个知识点问情境，第二个问情感。",
    ),
    data: POEMS_5,
    kind: POEM,
    after: "reading-3-poems",
    points: [
      [
        "scene",
        t("The Scene", "诗中的情境"),
        t(
          "Find the line that answers the question, read its note, and picture it: when it is, where, and what is seen or heard.\n\nIn “宿新市徐公店”, why can the child not find the butterfly? “飞入菜花无处寻”: the yellow butterfly has flown into the yellow rape flowers.\n\n> **Watch out.** Answer from the line, not from what one usually expects: the butterfly has not flown away, as butterflies usually do; it “flew into the rape flowers”, yellow among yellow.",
          "找到回答问题的诗句，读一读注释，再想象画面：什么时候、在哪里、看见了什么、听见了什么。\n\n《宿新市徐公店》里，孩子为什么找不到蝴蝶了？“飞入菜花无处寻”：黄蝴蝶飞进了黄色的菜花里。\n\n> **注意。** 要按诗句回答，不能按平常的印象：蝴蝶不是像平常那样飞走了，诗里说的是“飞入菜花”，黄蝴蝶混在黄菜花里，分不出来。",
        ),
      ],
      [
        "feeling",
        t("The Feeling", "诗中的情感"),
        t(
          "The feeling of a poem is carried by what the poet chooses to show, and often stated in one line. Find that line, and ask what someone who writes it feels.\n\n“不要人夸好颜色，只留清气满乾坤”: 王冕 wants no praise for the plum's looks, only to leave its pure fragrance in the world. His feeling is pride in an upright, modest heart.\n\n> **Watch out.** A season does not fix a feeling: 苏轼's “一年好景君须记，最是橙黄橘绿时” calls late autumn the finest time of the year, and is glad, not sad. Go by the words of this poem.",
          "诗的情感藏在诗人写的景物和事情里，也常常由一句诗直接说出来。找到这一句，想一想写下它的人是什么心情。\n\n“不要人夸好颜色，只留清气满乾坤”：王冕不要别人夸墨梅的颜色好看，只想把清香留在天地间。他表达的是不求赞美、坚守清白的情怀。\n\n> **注意。** 季节不能决定情感：苏轼的“一年好景君须记，最是橙黄橘绿时”，说深秋初冬是一年里最好的时候，心情是欢快的，并不悲凉。要看这首诗的诗句。",
        ),
      ],
    ],
  },
  {
    grade: 5,
    id: "reading-5-expository",
    title: t("Expository Texts: Points and Methods", "说明性文章：要点和说明方法"),
    summary: t(
      "Short explanations written for the subject: the points each paragraph makes, and the methods it explains them by.",
      "读为本学科写的说明短文：每段说明的要点，用了什么说明方法。",
    ),
    intro: t(
      "An expository text explains a thing: what it is, what it is like, how it works. In “蜂鸟”, the first paragraph says it is the smallest bird, the second that it beats its wings fast, the third that it eats a great deal: three points.\n\nIt makes them clear by methods: “只有五厘米长，体重不到两克” gives figures, and “和一只大蜜蜂差不多” sets it beside a bee. The first knowledge point asks the points, the second the methods.",
      "说明性文章介绍一样事物：它是什么、什么样、怎样起作用。《蜂鸟》第一段说它是最小的鸟，第二段说它扇翅膀很快，第三段说它吃得很多：这是三个要点。\n\n文章还用说明方法把要点说清楚：“只有五厘米长，体重不到两克”是列数字，“和一只大蜜蜂差不多”是作比较。第一个知识点问要点，第二个问说明方法。",
    ),
    data: EXPOSITORY_5,
    kind: PASSAGE,
    after: "reading-3-science",
    points: [
      [
        "points",
        t("The Points", "说明的要点"),
        t(
          "Each paragraph of an explanation makes one point, most often in its first sentence. Find the paragraph the question asks about, and say its point in a few words.\n\nThe first paragraph of “蜂鸟” opens “蜂鸟是世界上最小的鸟”: its point is that the bird is very small.\n\n> **Watch out.** A point made in another paragraph, such as how fast it flies, is true of the bird but does not answer a question on this paragraph.",
          "说明文的每一段说明一个要点，常常在第一句。找到题目问的那一段，用几个字说出它的要点。\n\n《蜂鸟》第一段开头是“蜂鸟是世界上最小的鸟”：要点是蜂鸟非常小。\n\n> **注意。** 别的段落说的要点，比如飞得很快，虽然也是说蜂鸟的，却不是这一段的要点。",
        ),
      ],
      [
        "methods",
        t("Methods of Explaining", "说明方法"),
        t(
          "The common methods are giving figures (列数字), giving examples (举例子), likening (打比方), comparing (作比较), sorting into kinds (分类别) and defining (下定义). Look at what the sentence does: does it give a number, an instance, a likeness, a comparison, kinds or a definition?\n\n“它能像直升机一样停在空中” likens the hummingbird to a helicopter: likening.\n\n> **Watch out.** A sentence may hold a number without being about it: name the method by what makes the point clear. And 像 does not always liken; set beside a thing of the same kind, it compares.",
          "常见的说明方法有列数字、举例子、打比方、作比较、分类别、下定义。看这句话做了什么：是给出数字、举出例子、打了比方、拿来比较、分成几类，还是说明它是什么？\n\n“它能像直升机一样停在空中”，把蜂鸟比作直升机：这是打比方。\n\n> **注意。** 句子里有数字，不一定就是列数字，要看是什么让意思说清楚的。“像”也不一定是打比方；拿同一类的东西来比，就是作比较。",
        ),
      ],
    ],
  },
  {
    grade: 5,
    id: "reading-5-non-continuous",
    title: t("Texts With Tables and Pictures", "非连续性文本"),
    summary: t(
      "Surveys, forecasts, timetables, menus and records written for the subject: finding a fact, and drawing a conclusion from several.",
      "读为本学科写的调查表、天气预报、时刻表、菜单和记录：找到信息，根据几条信息得出结论。",
    ),
    intro: t(
      "Some texts are lists and tables rather than paragraphs. A class survey gives how many read each book: “《西游记》：32人”, “《水浒传》：8人”, and a note that one person may have read several.\n\nRead the headings and units first, then find the line asked about. Some questions need more: which book did most read, or why the numbers add up to more than the class. The first knowledge point asks a fact, the second a conclusion.",
      "有的文字不是一段一段的，而是列表和表格。一份班级调查写着读过每本书的人数：“《西游记》：32人”“《水浒传》：8人”，还有一条说明：一个人可以读过好几本。\n\n先看标题和单位，再找到问到的那一行。有的题要多想一步：哪本书读的人最多，为什么人数加起来比全班多。第一个知识点问找信息，第二个问得出结论。",
    ),
    data: NON_CONTINUOUS_5,
    kind: SIGN,
    after: "reading-4-everyday-texts",
    points: [
      [
        "find",
        t("Finding a Fact", "找到信息"),
        t(
          "Find the line whose label matches the question, and read its figure with its unit.\n\nHow many read 《鲁滨逊漂流记》? Its line says “18人”.\n\n> **Watch out.** Neighbouring lines are easily read instead: check that the label of the line is the one asked about before taking its number.",
          "找到和问题对应的那一行，连着单位读出它的数。\n\n读过《鲁滨逊漂流记》的有多少人？那一行写着“18人”。\n\n> **注意。** 很容易看串行，读成旁边一行的数。取数之前，先看清这一行的名称是不是题目问的。",
        ),
      ],
      [
        "infer",
        t("Drawing a Conclusion", "得出结论"),
        t(
          "Some answers are in no single line: compare the lines, add them, or read the note. Do the work, then check the answer against the text.\n\nThe five books add up to 95 readers in a class of 40: the note “一个人可以读过好几本” explains it.\n\n> **Watch out.** A conclusion must follow from the text, not from guessing: “someone counted wrong” may sound possible, but the text gives the real reason.",
          "有的答案不在某一行里：要比较几行、把数加起来，或者看说明。算一算、比一比，再回到文字里核对。\n\n五本书的人数加起来是95人，全班却只有40人：说明里写着“一个人可以读过好几本”。\n\n> **注意。** 结论要从文字里得出，不能凭猜：“有人数错了”听起来也可能，可文字里已经给出了真正的原因。",
        ),
      ],
    ],
  },
  {
    grade: 5,
    id: "reading-5-word-colour",
    title: t("Meaning and Colour of Words", "推想词句意思，辨别感情色彩"),
    summary: t(
      "Short passages written for the subject: what a word or sentence means in its place, and whether it praises, blames or only tells.",
      "读为本学科写的短文：联系上下文推想词句的意思，辨别词语是褒义、贬义还是中性。",
    ),
    intro: t(
      "A word takes its meaning from its sentence. In “河面上飘着一片笑声”, laughter cannot float like a leaf: 飘 means it spreads over the water and is heard everywhere.\n\nWords also carry a colour. “又黑又臭” blames the polluted river; “清” praises it once it is clean; “河” alone only names it. The first knowledge point asks the meaning, the second the colour.",
      "词语的意思要放在句子里看。“河面上飘着一片笑声”，笑声不会像树叶一样漂在水上：“飘”是说笑声在河面上传开，到处都听得到。\n\n词语还带着感情色彩。“又黑又臭”带着厌恶和批评，是贬义的；河水变“清”带着称赞，是褒义的；“河”只是说出事物，是中性的。第一个知识点问意思，第二个问感情色彩。",
    ),
    data: WORDS_5,
    kind: PASSAGE,
    after: "reading-3-key-sentences",
    points: [
      [
        "meaning",
        t("Meaning From Context", "推想词句的意思"),
        t(
          "Read the whole sentence, and the ones around it, and ask what the words must mean for it all to make sense; then try the meaning in their place.\n\n“孩子们的笑声又回来了”: after the river is cleaned, the children come back to play there.\n\n> **Watch out.** The everyday meaning of a word may not fit: laughter is not a thing that leaves and returns. Choose the meaning that makes this sentence make sense.",
          "把整句话和前后的句子读一读，想一想这些词是什么意思，前后才讲得通；再把这个意思放回去试试。\n\n“孩子们的笑声又回来了”：河水清了，孩子们又来河里玩了。\n\n> **注意。** 词语平常的意思不一定讲得通：笑声不是会走开又回来的东西。要选放在这句话里讲得通的意思。",
        ),
        byContext,
      ],
      [
        "colour",
        t("The Colour of a Word", "词语的感情色彩"),
        t(
          "A word of praise (褒义) speaks well of what it names, a word of blame (贬义) speaks ill of it, and a neutral word (中性) only tells what is so. Ask how the writer feels about what the word names.\n\n“老人们常常坐在河边叹气”: 叹气 shows sorrow for the spoiled river, and “又黑又臭” blames it.\n\n> **Watch out.** Some pairs name the same thing in two colours: 节约 praises keeping money, 小气 blames it. Look at which word the writer chose.",
          "褒义词带着称赞，贬义词带着批评或厌恶，中性词只是说明事情，看不出态度。想一想作者对这个词说的事物是什么态度。\n\n“老人们常常坐在河边叹气”：叹气写出了对小河被污染的难过，“又黑又臭”带着批评。\n\n> **注意。** 有的词意思相近，感情色彩却不同：“节约”是褒义的，“小气”是贬义的。要看作者选的是哪一个。",
        ),
      ],
    ],
  },
  {
    grade: 5,
    id: "reading-5-structure",
    title: t("Order and Methods of Expression", "表达顺序和表达方法"),
    summary: t(
      "Short pieces written for the subject: the order they follow, and whether a sentence tells, describes, pours out a feeling or argues.",
      "读为本学科写的短文：按什么顺序写，句子是记叙、描写、抒情还是议论。",
    ),
    intro: t(
      "A writer chooses an order and a way of writing. “游植物园” goes from place to place: “一进门”, “往左走”, “往北走”, “荷花池的东边”. Those words show the order of a visit.\n\nThe sentences also do different jobs: “粉红的荷花开得正好” describes; “植物园真是一个绿色的宝库！” pours out a feeling. The first knowledge point asks the order, the second the method of expression.",
      "作者写文章，要选好顺序和表达方法。《游植物园》一个地方接一个地方地写：“一进门”“往左走”“往北走”“荷花池的东边”，这些词写出了游览的顺序。\n\n句子的作用也不一样：“粉红的荷花开得正好”是描写；“植物园真是一个绿色的宝库！”是抒情。第一个知识点问表达顺序，第二个问表达方法。",
    ),
    data: STRUCTURE_5,
    kind: PASSAGE,
    after: "reading-5-narrative",
    points: [
      [
        "order",
        t("The Order", "表达顺序"),
        t(
          "The common orders are by time, by place or the steps of a visit, and by the steps of making or doing. Look for the words that mark them: hours and seasons, directions and places, 先, 再 and 最后.\n\n“学做蛋炒饭” goes step by step: first the eggs, then the rice, last the salt.\n\n> **Watch out.** A piece may mention a time without being in order of time: “游植物园” names the morning and the sunset, but moves from place to place. Go by what carries the piece forward.",
          "常见的顺序有：按时间，按地点或游览的路线，按做事的步骤。找一找表示顺序的词：时间和季节，方向和地点，“先”“再”“最后”。\n\n《学做蛋炒饭》一步一步地写：先炒鸡蛋，再放米饭，最后加盐。\n\n> **注意。** 文中写到时间，不一定是按时间顺序写的：《游植物园》提到了早上和太阳落山，可全文是随着地点变换往前写的。要看是什么推着文章往下写。",
        ),
      ],
      [
        "methods",
        t("Methods of Expression", "表达方法"),
        t(
          "Telling (记叙) says what happened; describing (描写) pictures how something looks, sounds or moves; pouring out (抒情) says a feeling; arguing (议论) gives a view. Ask of the sentence which of these it does.\n\n“风一吹，沙沙作响” describes the bamboo; “我们才依依不舍地离开” tells what happened, with a feeling in it.\n\n> **Watch out.** A sentence with an exclamation mark is not always pouring out a feeling, and one with 我 is not always telling: go by what the sentence does.",
          "记叙是交代事情的经过；描写是具体写出样子、声音或动作；抒情是直接说出感情；议论是发表看法、讲道理。问一问这句话做的是哪一种。\n\n“风一吹，沙沙作响”是描写竹林；“我们才依依不舍地离开”是记叙，里面带着感情。\n\n> **注意。** 有感叹号的句子不一定是抒情，有“我”的句子也不一定是记叙：要看这句话做了什么。",
        ),
      ],
    ],
  },
  {
    grade: 6,
    id: "reading-6-fiction",
    title: t("Fiction: People, Plot and Setting", "读小说：人物、情节和环境"),
    summary: t(
      "Short stories written for the subject: their people seen through the plot, and what the setting does for them.",
      "读为本学科写的短篇小说：通过情节认识人物，体会环境描写的作用。",
    ),
    intro: t(
      "A story has people, a plot and a setting. In “最后一班渡船”, the wind is up and the ferryman refuses; a girl says her mother is in hospital; he unties the boat “一句话没说”. The plot shows the man: few words, a warm heart, ready to risk himself.\n\nThe setting serves him too: the waves beating on the steps make the crossing dangerous, so his choice means more. The first knowledge point asks the people and the plot, the second the setting.",
      "小说有人物、情节和环境。在《最后一班渡船》里，风大了，老周不肯开船；姑娘说妈妈住院了；老周“一句话没说，解开了缆绳”。情节写出了人物：话不多，心肠热，肯为别人冒险。\n\n环境也在为人物服务：浪一个接一个地打在石阶上，说明渡江很危险，老周的决定就更显得可贵。第一个知识点问人物和情节，第二个问环境。",
    ),
    data: FICTION_6,
    kind: PASSAGE,
    after: "reading-5-narrative",
    points: [
      [
        "people",
        t("People Through the Plot", "从情节看人物"),
        t(
          "Follow the plot to the turn, and ask what the person does there and why. What one does when it costs something shows who one is.\n\nIn “考场上的橡皮”, Li Qiang does not turn round in the exam, then brings a new eraser afterwards: he keeps the rules and is kind.\n\n> **Watch out.** The narrator may misjudge a person before the turn: “他一定是故意不理我” is what I thought, not what Li Qiang was. Read to the end before judging.",
          "顺着情节找到转折的地方，看人物在那里做了什么、为什么这样做。在要付出代价的时候怎样做，最能看出一个人。\n\n《考场上的橡皮》里，李强考试时不回头，考完试又送来一块新橡皮：他守规矩，也很善良。\n\n> **注意。** 转折以前，讲故事的“我”可能看错了人：“他一定是故意不理我”只是我的想法，不是李强真的这样。读到最后再下判断。",
        ),
      ],
      [
        "setting",
        t("What the Setting Does", "环境描写的作用"),
        t(
          "A setting is where and when a story happens, and how it looks and feels. Ask what it does for the story: does it set up the plot, make an action harder, or match a feeling?\n\nIn “雪夜送药”, the snow “没过了膝盖” and the wind cuts “像刀子一样”: the hard road shows how brave A Ming is.\n\n> **Watch out.** A setting in a story is seldom there for its own beauty. Ask what it does for the people, not only what it looks like.",
          "环境是故事发生的地点、时间和那里的景物气氛。想一想它对故事有什么作用：是为情节做铺垫，是让人物的行动更难，还是衬托人物的心情？\n\n《雪夜送药》里，雪“没过了膝盖”，风“像刀子一样刮在脸上”：路这样难走，更显出阿明的勇敢。\n\n> **注意。** 小说里的环境描写很少只是为了写景色美。要想它为人物做了什么，不只是它是什么样子。",
        ),
      ],
    ],
  },
  {
    grade: 6,
    id: "reading-6-prose",
    title: t("Prose: Feeling and Expression", "读散文：体会情感，领悟表达"),
    summary: t(
      "Short prose written for the subject: the feeling it carries, and the ways it expresses it, through things, contrasts and images.",
      "读为本学科写的散文：体会文中的感情，领悟借物抒情、对比、修辞等表达方法。",
    ),
    intro: t(
      "Prose often speaks of a thing to speak of a feeling. “父亲的扁担” tells of a carrying pole worn into a curve, and ends “每次看到那道弯，我就想起父亲弯下的腰”: the pole carries the writer's gratitude to a father who worked bent for the family.\n\nSo read for two things: what the writer feels, and how the writing makes us feel it, through a thing, a contrast or an image. The first knowledge point asks the feeling, the second the expression.",
      "散文常常借写一样东西来表达感情。《父亲的扁担》写一根被肩膀磨出一道弯的扁担，结尾说：“每次看到那道弯，我就想起父亲弯下的腰。”写扁担，是在写对父亲为家操劳的感激。\n\n所以读散文要读两样：作者有什么感情，文章又是怎样让我们感受到的，是借物、对比，还是修辞。第一个知识点问感情，第二个问表达。",
    ),
    data: PROSE_6,
    kind: PASSAGE,
    after: "reading-5-structure",
    points: [
      [
        "feeling",
        t("The Feeling", "体会感情"),
        t(
          "Look at the end and the sentences where the writer speaks most directly, and ask what feeling the whole piece builds to.\n\n“夜听雨” ends “我想念的，或许不只是那些雨声，还有那个无忧无虑的自己”: the writer misses the carefree childhood, not only the rain.\n\n> **Watch out.** An image means more than its words: “心里却暖暖的” on a cold stone is warmth of memory, not of weather.",
          "看结尾和作者说得最直接的句子，想一想整篇文章写的是什么感情。\n\n《夜听雨》结尾说：“我想念的，或许不只是那些雨声，还有那个无忧无虑的自己。”作者怀念的不只是雨声，还有无忧无虑的童年。\n\n> **注意。** 散文里的话常常有字面以外的意思：坐在凉凉的石头上“心里却暖暖的”，暖的是回忆，不是天气。",
        ),
      ],
      [
        "expression",
        t("How It Is Expressed", "领悟表达方法"),
        t(
          "Common ways of expression in prose: writing a thing to carry a feeling (借物抒情), setting two things side by side (对比), likening (比喻), and giving a thing human ways (拟人). Ask what the writer does and what it adds.\n\n“外婆的蒲扇” ends with the air-conditioned room against “那一阵一阵的风”: the contrast says no machine can replace Granny's love.\n\n> **Watch out.** Likening and contrast are easily mixed: likening says one thing is like another; contrast sets two things apart to show a difference.",
          "散文常见的表达方法有：借物抒情、对比、比喻、拟人。想一想作者这样写了什么，又多表达了什么。\n\n《外婆的蒲扇》结尾把有空调的屋子和“那一阵一阵的风”放在一起写：对比说明，空调代替不了外婆的爱。\n\n> **注意。** 比喻和对比容易弄混：比喻是说这个像那个；对比是把两样东西放在一起，显出它们的不同。",
        ),
      ],
    ],
  },
  {
    grade: 6,
    id: "reading-6-argument",
    title: t("Views and Examples", "读议论性文字：观点和事例"),
    summary: t(
      "Short arguments written for the subject: the view each argues, and how its examples and sayings support it.",
      "读为本学科写的简单议论文：作者的观点是什么，事例和名言怎样证明观点。",
    ),
    intro: t(
      "An argument puts forward a view and gives reasons and examples for it. “坚持的力量” opens with water wearing through stone and says it plainly: “只要不放弃，再小的力量也能积累成大的成就”.\n\nThen it gives Wang Xizhi, who practised until his pond turned black, and a pupil who gave up the piano: one example for, one against. The first knowledge point asks the view, the second the examples.",
      "议论性文字提出一个观点，再用道理和事例来证明它。《坚持的力量》从水滴石穿说起，明确地说：“只要不放弃，再小的力量也能积累成大的成就。”\n\n接着举了王羲之练字把一池清水都洗黑了的事例，又举了学钢琴半途而废的例子：一正一反。第一个知识点问观点，第二个问事例。",
    ),
    data: ARGUMENTS_6,
    kind: PASSAGE,
    after: "reading-5-structure",
    points: [
      [
        "view",
        t("The View", "作者的观点"),
        t(
          "The view is the writer's claim, a sentence one can agree or disagree with. It stands most often in the title, the first paragraph or the last, after words like 我认为 and 所以.\n\nIn “小事不小”, the writer first gives the other side, “小事不值得做”, then states his own: “我却觉得，小事不小”.\n\n> **Watch out.** An example is not the view: “Edison tried a thousand materials” is a fact the writer uses. And a view the writer only reports in order to answer it, after 有人认为, is not his.",
          "观点是作者的主张，是一句可以赞成、也可以反对的话。它常在题目、第一段或最后一段，常跟在“我认为”“所以”这样的词后面。\n\n《小事不小》先摆出别人的看法“小事不值得做”，再提出自己的观点：“我却觉得，小事不小。”\n\n> **注意。** 事例不是观点：“爱迪生试过一千多种材料”是作者用来证明观点的事实。跟在“有人认为”后面的话，是作者要反驳的看法，也不是他的观点。",
        ),
      ],
      [
        "example",
        t("Examples and Sayings", "事例和名言"),
        t(
          "Ask what each example or saying proves, and how: an example shows the view at work (举例论证); a saying gives it authority (引用论证); likening makes it vivid (比喻论证); setting two cases apart shows it by contrast (对比论证).\n\nIn “诚信是金”, Ji Bu keeps his word and is helped; a cheating shop loses its customers: two examples, for and against.\n\n“书犹药也” likens books to medicine: likening.\n\n> **Watch out.** An example proves the view, not something it merely mentions: Wang Xizhi's black pond proves persistence, not that ponds blacken easily.",
          "想一想每个事例、每句名言证明了什么，是怎样证明的：举出事例，是举例论证；引用名言，是引用论证；打个比方，是比喻论证；拿正反两方面比较，是对比论证。\n\n《诚信是金》里，季布守信得到帮助，商店缺斤少两只好关门：一正一反两个事例。\n\n“书犹药也”把书比作药：这是比喻论证。\n\n> **注意。** 事例要证明的是观点，不是事例里顺带说到的事：王羲之洗黑了一池水，证明的是坚持的力量，不是池水容易变黑。",
        ),
      ],
    ],
  },
  {
    grade: 6,
    id: "reading-6-expository",
    title: t("Methods of Explaining and Their Use", "说明方法及其作用"),
    summary: t(
      "Explanations written for the subject: what a method of explaining does in its place, and why its words are exact.",
      "读为本学科写的说明文：说明方法在这里起什么作用，说明的语言为什么准确。",
    ),
    intro: t(
      "In grade 6 it is not enough to name a method: say what it does here. In “蜜蜂的舞蹈”, the waggle dance is “样子像一个‘8’字”: likening lets one see the path at once.\n\nThe words of an explanation are exact too. “大约在一百米以内”: 大约 says the distance is not exactly a hundred metres; drop it and the sentence says more than is true. The first knowledge point asks the methods and their use, the second the exact words.",
      "六年级读说明文，不但要说出用了什么方法，还要说出它在这里的作用。《蜜蜂的舞蹈》说摇摆舞“样子像一个‘8’字”：打比方，让人一下子想象出舞蹈的路线。\n\n说明文的用词也很准确。“大约在一百米以内”：“大约”说明不是正好一百米；去掉它，就说得比事实更死了。第一个知识点问说明方法及其作用，第二个问用词的准确。",
    ),
    data: EXPOSITORY_6,
    kind: PASSAGE,
    after: "reading-5-expository",
    points: [
      [
        "methods",
        t("A Method and Its Use", "说明方法的作用"),
        t(
          "Name the method, then say what it makes clear about this thing: figures make it exact, likening makes it vivid, comparing makes a feature stand out, kinds make it orderly, a definition says what it is.\n\nTooth enamel is “比骨头还硬”: comparing with bone makes its hardness stand out.\n\n> **Watch out.** The use must fit the sentence: “比一只小老鼠大不了多少” compares the newborn panda's size; it does not say the panda is like a mouse.",
          "先说出用了什么方法，再说出它把这样事物的什么说清楚了：列数字使说明准确，打比方使说明形象，作比较突出特点，分类别使说明有条理，下定义说清它是什么。\n\n牙釉质“比骨头还硬”：拿骨头来比较，突出了牙釉质的坚硬。\n\n> **注意。** 说作用要和句子对得上：“比一只小老鼠大不了多少”是用作比较说明刚出生的大熊猫很小，不是说大熊猫像老鼠。",
        ),
      ],
      [
        "words",
        t("Exact Words", "说明语言的准确"),
        t(
          "Words like 大约, 左右, 一般, 主要, 多 and 只有 limit what a sentence claims. Ask: what would the sentence say without the word, and would that still be true?\n\n“主要生活在四川、陕西和甘肃的山区”: without 主要, the panda would live only there, which says too much.\n\n> **Watch out.** “Shorter is better” is not a reason to drop such a word: these words are what make the explanation true.",
          "“大约”“左右”“一般”“主要”“多”“只有”这样的词，限定了句子说的范围。问一问：去掉这个词，句子变成了什么意思，还符合事实吗？\n\n“主要生活在四川、陕西和甘肃的山区”：去掉“主要”，就成了大熊猫只生活在这三个地方，说得太绝对了。\n\n> **注意。** 不能因为“去掉更简洁”就删掉这些词：正是这些词让说明符合事实。",
        ),
      ],
    ],
  },
  {
    grade: 6,
    id: "reading-6-non-continuous",
    title: t("Instructions, Charts and Maps", "读说明书、图表和地图"),
    summary: t(
      "Instructions, survey charts, plans and rules written for the subject: reading what they say, and using it to act or decide.",
      "读为本学科写的说明书、统计表、平面图和规则：读懂信息，用信息解决问题。",
    ),
    intro: t(
      "Instructions, charts and maps are read in order to do something. A medicine leaflet says “儿童一次半袋，一日3次”: a ten-year-old takes half a sachet at a time.\n\nRead the headings and labels first, find the line that applies, and then use it: work out an amount, a way, or a choice. The first knowledge point asks what the text says, the second how to use it.",
      "说明书、图表和地图，是为了做事才读的。感冒冲剂的说明书写着“儿童一次半袋，一日3次”：十岁的孩子一次服半袋。\n\n先看标题和标签，找到适用的那一条，再用它解决问题：算出一个数，找到一条路，做出一个选择。第一个知识点问读懂信息，第二个问运用信息。",
    ),
    data: NON_CONTINUOUS_6,
    kind: SIGN,
    after: "reading-5-non-continuous",
    points: [
      [
        "read",
        t("Reading What It Says", "读懂信息"),
        t(
          "Find the line, the row or the place that answers the question, and take its words and numbers exactly.\n\nWhere is the playground in the park plan? “花坛东边是儿童乐园”: to the east of the flowerbed.\n\n> **Watch out.** Directions and figures are easily swapped: east and west, the low and the high temperature. Check the word beside the number.",
          "找到回答问题的那一行、那一栏或那个位置，照着它的字和数回答。\n\n公园游览图上，儿童乐园在哪里？“花坛东边是儿童乐园”：在花坛的东边。\n\n> **注意。** 方向和数字很容易弄反：东和西，最低气温和最高气温。要看清数字旁边的字。",
        ),
      ],
      [
        "use",
        t("Putting It to Use", "运用信息"),
        t(
          "Apply what the text says to the case in the question: check every condition, work out what is needed, and choose what follows.\n\nA cousin 1.4 metres tall rides the metro alone. Does he ride free? The rule is “身高1.3米以下的儿童，在成人陪同下”: he is too tall and alone, so no.\n\n> **Watch out.** A rule often has more than one condition. Being a child is not enough if the height and the adult are also required.",
          "把文字说的用到题目的情况上：每个条件都要核对，算出需要的，再选出结果。\n\n表哥身高1.4米，一个人坐地铁，能免费吗？规则是“身高1.3米以下的儿童，在成人陪同下”可以免费：他超过了身高，又没有大人陪，所以不能。\n\n> **注意。** 一条规则常常有好几个条件。是儿童还不够，身高和大人陪同也都要符合。",
        ),
      ],
    ],
  },
  {
    grade: 6,
    id: "reading-6-browsing",
    title: t("Browsing for Information", "浏览，搜集信息"),
    summary: t(
      "Sets of short sources written for the subject, gathered for a task: finding what each source says, and choosing the ones that serve the task.",
      "读为本学科写的、为一项任务搜集来的几条资料：读出每条资料说了什么，选出对任务有用的资料。",
    ),
    intro: t(
      "To browse is to read many sources quickly for what a task needs. For a class paper on saving paper, five notes are gathered: one says a ton of paper costs a dozen trees, another that paper used on both sides halves the need, another that Japanese paper folding is famous.\n\nAll may be true; not all serve the task. Keep the task in mind, read each source for what it says, then choose what helps. The first knowledge point asks what the sources say, the second which are useful.",
      "浏览，就是带着任务，快速地读很多资料，找出需要的信息。班里要办“节约用纸”的手抄报，大家找来五条资料：一条说造一吨纸要砍掉十几棵大树，一条说纸两面都用就能少用一半，还有一条说日本的折纸艺术很有名。\n\n这些资料可能都是真的，却不都对任务有用。要记住任务，读出每条资料说了什么，再选出有用的。第一个知识点问资料说了什么，第二个问哪些资料有用。",
    ),
    data: BROWSING_6,
    kind: SIGN,
    after: "reading-4-skimming",
    points: [
      [
        "collect",
        t("What the Sources Say", "读出资料的内容"),
        t(
          "Run through the sources quickly, and stop at the one whose subject is what the question asks; then take its words exactly.\n\nWhich source tells how 糍粑 is made? 资料一: “用糯米蒸熟后捣烂做成的”.\n\n> **Watch out.** Several sources may share a word of the question. Go by what each source is about, not by the word.",
          "快速地把资料过一遍，停在讲题目问的内容的那一条，再照着它的话回答。\n\n哪条资料说明了糍粑是怎样做成的？资料一：“用糯米蒸熟后捣烂做成的”。\n\n> **注意。** 题目里的词可能几条资料里都有。要看每条资料主要讲什么，不要只看一个词。",
        ),
      ],
      [
        "useful",
        t("Which Sources Serve the Task", "选出有用的资料"),
        t(
          "Hold each source against the task and ask: does it help do what the task asks? A true source may still be of no use.\n\nFor a science report on why the moon waxes and wanes, “李白写过很多关于月亮的诗” is true but explains nothing; the source on how the moon's lit side is seen does.\n\n> **Watch out.** A source on the same subject is not always useful: for choosing a phone for Grandpa, when phones were invented is about phones but does not help choose one.",
          "把每条资料和任务对一对，问一问：它能帮助完成这项任务吗？真实的资料，也可能没有用。\n\n写“月亮为什么有圆有缺”的科学小报告，“李白写过很多关于月亮的诗”是真的，却解释不了圆缺；说明月亮被照亮的一面我们看到多少的那一条才有用。\n\n> **注意。** 讲同一样东西的资料不一定有用：给爷爷选手机，手机是什么时候发明的，虽然也讲手机，却帮不了选手机。",
        ),
      ],
    ],
  },
  {
    grade: 6,
    id: "reading-6-poems",
    title: t("Poems: Rhythm and Feeling", "读诗：韵律节奏和情感"),
    summary: t(
      "Classical poems in the public domain, with notes: their pauses, rhymes and lines, and the feeling they carry.",
      "读公有领域的古诗，附注释：诗句的停顿、韵脚和句式，诗中表达的情感。",
    ),
    intro: t(
      "A classical poem is heard as well as read. A line of five characters pauses after two, “千山/鸟飞绝”, and one of seven after four, “黄沙百战/穿金甲”; the lines that rhyme end alike: 川, 烟, 田 in “乡村四月”.\n\nRhythm and rhyme carry the feeling: the even, flowing lines of “乡村四月” match the busy, peaceful countryside of early summer. The first knowledge point asks the rhythm and rhyme, the second the feeling.",
      "古诗不但要看，还要听。五言诗一般在第二个字后停顿，如“千山/鸟飞绝”；七言诗一般在第四个字后停顿，如“黄沙百战/穿金甲”。押韵的句子末尾的字读起来相近：《乡村四月》押的是川、烟、田。\n\n韵律节奏也帮着表达情感：《乡村四月》的诗句平和流畅，正合初夏乡村忙碌而安宁的景象。第一个知识点问韵律节奏，第二个问情感。",
    ),
    data: POEMS_6,
    kind: POEM,
    after: "reading-5-poems",
    points: [
      [
        "rhythm",
        t("Rhythm and Rhyme", "韵律和节奏"),
        t(
          "Pause where the words of a line join: in five characters most often after two, in seven most often after four, keeping each word whole. The rhyme is heard at the ends of the lines, mostly the even ones; read the notes for old readings.\n\n“春眠不觉晓” pauses “春眠/不觉晓”; “登鹳雀楼” rhymes on 流 and 楼.\n\n> **Watch out.** A pause must not split a word, as “春/眠” would; and characters in the middle of a line, however alike, are not the rhyme.",
          "停顿要停在词和词之间：五言诗多在第二个字后，七言诗多在第四个字后，不能把一个词拆开。押韵要听句子末尾的字，大多是双数句的末尾；有古时读音的，要看注释。\n\n“春眠不觉晓”停顿是“春眠/不觉晓”；《登鹳雀楼》押韵的是“流”和“楼”。\n\n> **注意。** 停顿不能把一个词拆开，比如“春/眠”；句子中间的字，读音再像，也不是韵脚。",
        ),
      ],
      [
        "feeling",
        t("The Feeling", "诗中的情感"),
        t(
          "Find the line where the poet's feeling shows most, often the last, and ask what someone who writes it feels; the scene before it leads up to it.\n\n“示儿” ends “家祭无忘告乃翁”: dying, 陆游 asks his sons to tell him at the family rites when the north is won back, so his love of the country outlasts his life.\n\n> **Watch out.** A pleasant scene does not always carry a glad feeling: in “题临安邸”, warm winds and singing by the lake frame the poet's anger that the rulers, drunk on pleasure, forget the lost north.",
          "找到最能表现诗人感情的诗句，常常是最后一句，想一想写下它的人是什么心情；前面写的景物都在为它做铺垫。\n\n《示儿》最后一句是“家祭无忘告乃翁”：陆游临死还嘱咐儿子，收复中原那天，祭祀时别忘了告诉他，写出了至死不变的爱国之情。\n\n> **注意。** 景色美，不一定心情就高兴：《题临安邸》写的是西湖边的暖风和歌舞，表达的却是对当权的人贪图享乐、忘了收复失地的愤慨。",
        ),
      ],
    ],
  },
];

/** stageFiveSixReading are the reading topics of grades 5 and 6, in order, each after the reading before it. */
export const stageFiveSixReading: readonly GradeTopic[] = (() => {
  const built: GradeTopic[] = [];
  for (const spec of SPECS)
    built.push(
      topicOf(
        spec,
        [...stageReadingTopics, ...stageThreeFourReading, ...built].map((x) => x.topic),
      ),
    );
  return built;
})();
