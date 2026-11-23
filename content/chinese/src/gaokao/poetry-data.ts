// The classical poems of the Gaokao's reading of poems: eight poems in the public domain, outside the recited texts,
// each with two questions of understanding, two of craft and two to answer in a few sentences, written for the subject.

import { t } from "@ga/content";

import type { ModernPassage } from "./modern.ts";

/** poetryPassages are the classical poems of the Gaokao's reading of poems, in the public domain, with questions written for the subject. */
export const poetryPassages: readonly ModernPassage[] = [
  {
    title: "送灵澈上人",
    author: "〔唐〕刘长卿",
    body: "苍苍竹林寺，杳杳钟声晚。\n荷笠带斜阳，青山独归远。",
    understanding: [
      {
        ask: "下列对这首诗的理解和赏析，正确的一项是",
        right: "前两句写深青的山林和远处的晚钟，点明送别时在傍晚，也暗示了灵澈的归处。",
        wrong: [
          "前两句写竹林寺香火旺盛、钟声嘹亮，表现了寺院的热闹和诗人对佛门的向往之情。",
          "“荷笠带斜阳”写诗人自己背着斗笠送友人上路，一直把他送回了竹林寺中。",
          "“青山独归远”写诗人送别后独自返回青山，抒发了自己被友人抛下的怨愤之情。",
        ],
        ground: "苍苍竹林寺，杳杳钟声晚。",
        reasons: [
          t(
            "Reversed: deep green woods and a faint bell, quiet rather than busy.",
            "意思说反：“苍苍”是山林深青，“杳杳”是钟声幽远，写的是寺院清幽，不是热闹；诗中也没有向往佛门。",
          ),
          t(
            "Wrong person: it is Lingche who walks off with his hat; the poet watches.",
            "人物弄错：背着斗笠、带着斜阳走远的是归寺的灵澈，诗人在原地目送，并没有同行。",
          ),
          t(
            "Wrong person and feeling: the monk goes home alone; there is no resentment.",
            "人物和情感都错：“独归”的是灵澈，诗人是送行的人；画面闲淡，看不出被抛下的怨愤。",
          ),
        ],
      },
      {
        ask: "下列对这首诗情感的理解，正确的一项是",
        right: "诗人目送友人渐行渐远，不直说离情，惜别之意和闲淡的心境都寓于画面之中。",
        wrong: [
          "诗人与友人在寺前痛哭而别，悲伤难抑，全诗笼罩着浓重的生离死别之苦。",
          "诗人借送别抒写仕途得意的喜悦，暮色、钟声都是为了衬托他轻快的心情。",
          "诗人责备友人匆匆离去，不肯多留片刻，字里行间流露出强烈的不满。",
        ],
        ground: "荷笠带斜阳，青山独归远。",
        reasons: [
          t(
            "Too heavy: only a bell, a sunset and a figure fading; no weeping.",
            "情感过重：全诗只有钟声、斜阳和远去的背影，没有痛哭，也没有生离死别。",
          ),
          t("Invented: no career; dusk and bell make stillness.", "无中生有：诗写送别，没有提到仕途；暮色、钟声烘托的是清寂，不是轻快。"),
          t("Reversed: he watches quietly, with no reproach.", "情感说反：诗人静静目送友人远去，没有一句责备。"),
        ],
      },
    ],
    analysis: [
      {
        ask: "下列对这首诗艺术手法的分析，正确的一项是",
        right: "诗歌以画面写送别，青山、斜阳、斗笠构成一幅远行图，人物身影渐小，余味悠长。",
        wrong: [
          "诗歌以议论为主，直接阐述送别的道理，说理透彻，语言质朴而富有哲理。",
          "诗歌通篇用典，借古人送别的故事抒写离情，显得典雅含蓄、厚重深沉。",
          "诗歌运用夸张手法，极写钟声之响、山路之险，渲染出紧张急迫的气氛。",
        ],
        ground: "青山独归远",
        reasons: [
          t("Wrong mode: four lines of picture, no argument.", "表达方式说错：四句全是景和人的画面，没有一句议论说理。"),
          t("Wrong device: no allusion; all is the scene before him.", "手法说错：诗中没有用典，竹林寺、斜阳、青山都是眼前实景。"),
          t(
            "Wrong device and mood: the bell is faint; nothing is tense.",
            "手法和气氛都错：“杳杳”写钟声幽远而非响亮，诗中也没有险路，气氛清幽而不紧张。",
          ),
        ],
      },
      {
        ask: "下列对诗中词语的分析，正确的一项是",
        right: "“苍苍”“杳杳”两组叠词，一写山林颜色深青，一写钟声幽远，营造出清幽寂静的意境。",
        wrong: [
          "“苍苍”写竹林寺年代久远、破败荒凉，暗示灵澈上人生活十分困苦。",
          "“杳杳”写钟声急促响亮，催促灵澈赶快动身，表现出时间的紧迫。",
          "“独”字写灵澈上人性情孤僻，不愿与人交往，表现了诗人对他的批评。",
        ],
        ground: "苍苍竹林寺，杳杳钟声晚。",
        reasons: [
          t("Wrong sense: 苍苍 is deep green, not ruin.", "词义说错：“苍苍”是深青色，写竹林苍翠，不是破败荒凉；诗中也没写灵澈生活困苦。"),
          t("Reversed: 杳杳 is faint and far.", "词义说反：“杳杳”是幽远，钟声隐隐传来，不是急促响亮。"),
          t(
            "Reads too much: “alone” shows him going; there is no criticism.",
            "过度解读：“独”写他独自归去、身影渐远，诗人带着惜别，没有批评他孤僻。",
          ),
        ],
      },
    ],
    answers: [
      {
        ask: "诗的后两句是怎样写送别的？请简要分析。",
        model:
          "①以景写人：用“荷笠”“斜阳”“青山”勾画出灵澈戴着斗笠、披着夕阳、独向青山远去的背影。②侧面写情：不写诗人，而从诗人目送的角度写，“独归远”写出友人渐行渐远，诗人久久伫立，惜别之情含蓄不露。③以景结情：画面清淡悠远，余味无穷。",
      },
      {
        ask: "这首诗表现了灵澈上人怎样的形象？请结合诗句简要分析。",
        model:
          "①清寂超然：“荷笠带斜阳”写他斗笠一顶、夕阳满身，衣着简朴，不染尘俗。②淡泊从容：听着晚钟“独归”青山，不慌不忙，独来独往，表现出僧人安于山林、超然物外的风度。诗人借此流露出对他的敬重和自己闲淡的心境。",
      },
    ],
  },
  {
    title: "宿桐庐江寄广陵旧游",
    author: "〔唐〕孟浩然",
    body: "山暝听猿愁，沧江急夜流。\n风鸣两岸叶，月照一孤舟。\n建德非吾土，维扬忆旧游。\n还将两行泪，遥寄海西头。",
    understanding: [
      {
        ask: "下列对这首诗的理解和赏析，正确的一项是",
        right: "首联写山色昏暗、猿声凄厉、江水夜流，一开篇就笼罩着羁旅的愁苦气氛。",
        wrong: [
          "首联写诗人在山中听猿嬉戏，看江水奔流，心情畅快，表现了旅途的乐趣。",
          "颈联“建德非吾土”是说建德风景不美，诗人不愿久留，急于离开这里。",
          "尾联写诗人与旧友在扬州重逢，喜极而泣，表现了久别重逢的激动之情。",
        ],
        ground: "山暝听猿愁，沧江急夜流。",
        reasons: [
          t("Reversed: gloomy hills and sad apes, no merriment.", "情感说反：“猿愁”是猿声凄厉惹人愁，“山暝”是天色昏暗，没有嬉戏和畅快。"),
          t(
            "Wrong sense: “not my land” means not home, after Wang Can.",
            "词义说错：“非吾土”是说建德不是我的故乡，化用王粲“虽信美而非吾土”，不是嫌风景不美。",
          ),
          t(
            "Wrong event: he sends tears far to Yangzhou; there is no reunion.",
            "情节说错：诗人在桐庐江上，是把泪“遥寄海西头”的扬州，并没有重逢。",
          ),
        ],
      },
      {
        ask: "下列对这首诗情感的理解，正确的一项是",
        right: "诗人夜宿异乡，孤舟独处，感到此地终非故土，于是思念扬州的旧友，愁绪难排。",
        wrong: [
          "诗人厌倦了扬州的生活，庆幸自己远离旧友，表现了独处山水的闲适自得。",
          "诗人借夜景抒写建功立业的豪情，猿声、江流都衬托出他积极进取的心志。",
          "诗人怨恨旧友不肯同行，因而流泪，全诗充满对朋友的责备和不满。",
        ],
        ground: "建德非吾土，维扬忆旧游。",
        reasons: [
          t(
            "Reversed: he misses his friends and sends them tears.",
            "情感说反：“忆旧游”是思念扬州的旧友，诗人还要“遥寄”两行泪，不是庆幸远离。",
          ),
          t("Wrong feeling: travel sorrow, not ambition.", "情感说错：猿愁、孤舟写的是羁旅愁苦，没有建功立业的豪情。"),
          t("Invented: the tears are longing, not blame.", "无中生有：泪是思念旧友而流，诗中没有一句怨恨对方不肯同行。"),
        ],
      },
    ],
    analysis: [
      {
        ask: "下列对这首诗艺术手法的分析，正确的一项是",
        right: "颔联写风吹叶响、月照孤舟，以声衬静，以大衬小，突出了诗人的孤独冷落。",
        wrong: [
          "颔联运用比喻，把两岸树叶比作风铃，写出了江上夜景的热闹欢快。",
          "颔联写月光照满江面，用乐景写乐情，表现了诗人泛舟夜游的兴致。",
          "颔联运用对比，写两岸人家灯火通明，反衬出孤舟主人的富足安乐。",
        ],
        ground: "风鸣两岸叶，月照一孤舟。",
        reasons: [
          t(
            "Wrong device and mood: plain description of a cold night wind.",
            "手法和情调都错：“风鸣两岸叶”是直写风吹叶响，没有比喻；夜里风声凄清，不是热闹欢快。",
          ),
          t("Wrong device: the moon lights a lonely boat.", "手法说错：月照的是“孤舟”，景色清冷，写的是孤独，不是乐景写乐情。"),
          t("Invented: no lit houses; he sleeps alone on a boat.", "无中生有：诗中没有两岸人家的灯火，诗人宿在孤舟上，谈不上富足安乐。"),
        ],
      },
      {
        ask: "下列对这首诗结构和语言的分析，正确的一项是",
        right: "前四句写夜宿桐庐江所见所闻，后四句转入抒情，由景及情，层次分明。",
        wrong: [
          "前四句回忆在扬州与旧友游乐的情景，后四句写眼前之景，采用了倒叙。",
          "全诗句句写景，没有直接抒情，诗人的情感完全隐藏在景物之中。",
          "“急”字写江水流得很慢，表现出诗人在异乡时间漫长、百无聊赖。",
        ],
        ground: "还将两行泪，遥寄海西头。",
        reasons: [
          t(
            "Wrong order: the first four lines are the river now; Yangzhou comes in line 6.",
            "顺序说错：前四句写的是眼前桐庐江的夜景，扬州旧游到第六句才“忆”起。",
          ),
          t(
            "Not so: the last four lines state feeling outright.",
            "与原文不符：后四句“非吾土”“忆旧游”“两行泪”都是直接抒情，并非句句写景。",
          ),
          t("Reversed: 急 means swift.", "词义说反：“急”是江水流得急，衬出诗人心绪不宁，不是慢。"),
        ],
      },
    ],
    answers: [
      {
        ask: "诗的前两联是怎样写景的？请简要分析。",
        model:
          "①视听结合：“听猿愁”“风鸣两岸叶”写声，“山暝”“月照一孤舟”写色和形，写出江夜之景。②动静结合：江水急流、风吹叶响是动，暮山、孤舟是静。③以景衬情：昏暗的山、哀猿、急流、孤舟，营造出凄清孤寂的氛围，烘托出诗人羁旅的愁苦。",
      },
      {
        ask: "诗的后两联表达了诗人怎样的情感？请结合诗句简要分析。",
        model:
          "①羁旅思乡之愁：“建德非吾土”化用王粲“虽信美而非吾土”之意，说此地虽美终非故乡，流露出漂泊异乡的孤独。②对旧友的思念：“维扬忆旧游”直写怀念扬州的朋友，“两行泪”“遥寄海西头”把泪水寄往远方，情深意切。",
      },
    ],
  },
  {
    title: "观猎",
    author: "〔唐〕王维",
    body: "风劲角弓鸣，将军猎渭城。\n草枯鹰眼疾，雪尽马蹄轻。\n忽过新丰市，还归细柳营。\n回看射雕处，千里暮云平。",
    understanding: [
      {
        ask: "下列对这首诗的理解和赏析，正确的一项是",
        right: "颈联写将军猎罢疾驰新丰、还归细柳，写出归途的迅疾和将军的意气风发。",
        wrong: [
          "首联写大风中角弓的弓弦被吹断，将军只好放弃打猎，表现出狩猎的艰难。",
          "颔联写秋草枯黄、积雪融尽，原野上猎物稀少，表现了将军一无所获的失落。",
          "尾联写将军回望猎场，只见暮云沉沉，感叹自己年华老去，情调低沉伤感。",
        ],
        ground: "忽过新丰市，还归细柳营。",
        reasons: [
          t(
            "Wrong sense: the bowstring sings; nothing breaks.",
            "词义说错：“角弓鸣”是弓弦在劲风中震响，也暗示开弓射猎，弓没有断，打猎也没有放弃。",
          ),
          t(
            "Reversed: bare grass and melted snow favour the hunt.",
            "理解说反：“草枯”使鹰眼更易发现猎物，“雪尽”使马蹄更轻快，写的是有利的猎场，不是一无所获。",
          ),
          t(
            "Reversed: a calm, wide view after the hunt, not lament.",
            "情调说反：“千里暮云平”写原野辽阔、心胸开阔，是猎罢从容回望，没有叹老伤感。",
          ),
        ],
      },
      {
        ask: "下列对诗中将军形象的理解，正确的一项是",
        right: "诗中的将军弓马娴熟、英武豪迈，“细柳营”暗用周亚夫的典故，赞其治军严整。",
        wrong: [
          "诗中的将军耽于游乐，终日打猎而不理军务，诗人借此讽刺他玩忽职守。",
          "诗中的将军年老体衰，弯弓骑马已力不从心，诗人对他的处境深表同情。",
          "诗中的将军胆小怯懦，见风大雪寒就匆匆收兵，诗人对他颇为不屑。",
        ],
        ground: "还归细柳营",
        reasons: [
          t("Reads too much: the allusion to Zhou Yafu is praise.", "过度解读：“细柳营”用周亚夫治军严整的典故，是赞美，不是讽刺。"),
          t("Reversed: swift hawk and horse, a vigorous general.", "形象说反：“鹰眼疾”“马蹄轻”写驰猎迅捷，将军英武，不是年老体衰。"),
          t("Reversed: he rides out in the wind and returns at ease.", "形象说反：风劲时他照样出猎，猎罢从容回望，诗中没有收兵退缩。"),
        ],
      },
    ],
    analysis: [
      {
        ask: "下列对这首诗艺术手法的分析，正确的一项是",
        right: "首句先写风声、弓声，次句才点出将军打猎，先声夺人，一开篇就气势不凡。",
        wrong: [
          "首句写风声凄厉、角弓哀鸣，奠定了全诗悲凉哀怨的感情基调。",
          "首联运用比喻，把弓弦的响声比作风声，写出了狩猎场面的寂静无声。",
          "首联采用倒叙手法，先写打猎结束，再回忆将军出猎前的准备过程。",
        ],
        ground: "风劲角弓鸣，将军猎渭城。",
        reasons: [
          t("Wrong tone: the opening is bold, not mournful.", "基调说错：风劲弓鸣写的是声势雄壮，全诗豪迈，不是悲凉哀怨。"),
          t(
            "Wrong device and effect: two sounds together, loud not silent.",
            "手法和效果都错：首句是风声和弓声直接相交，不是比喻；写出的是声势喧响，不是寂静。",
          ),
          t(
            "Wrong order: it runs forward from setting out to looking back.",
            "顺序说错：首联出猎，颔联驰猎，颈联归营，尾联回望，是顺叙，不是倒叙。",
          ),
        ],
      },
      {
        ask: "下列对诗中炼字的分析，正确的一项是",
        right: "“疾”写鹰眼锐利、发现猎物之快，“轻”写马蹄轻快，两字传神地写出驰猎的迅捷。",
        wrong: [
          "“疾”写猎鹰身患疾病、飞行迟缓，暗示这次打猎很不顺利，收获甚少。",
          "“轻”写马匹瘦弱无力、脚步轻飘，表现出军中粮草不足、物资匮乏。",
          "“平”写暮云低垂压向城头，渲染出战事将至、形势危急的紧张气氛。",
        ],
        ground: "草枯鹰眼疾，雪尽马蹄轻。",
        reasons: [
          t("Wrong sense: 疾 is swift, not sick.", "词义说错：“疾”是快、锐利，不是疾病；鹰眼疾正说明发现猎物快。"),
          t("Wrong sense: 轻 is light-footed on dry ground.", "词义说错：“轻”写马跑得轻快，是因为雪尽路干，不是马瘦弱。"),
          t("Reversed: 平 is calm and level, not looming war.", "意思说反：“平”写暮云与原野相接、平静辽阔，是猎罢后的宁静，没有战事。"),
        ],
      },
    ],
    answers: [
      {
        ask: "诗的颔联历来为人称道，请简要赏析。",
        model:
          "①炼字传神：“疾”写草枯后猎物无处藏身，猎鹰目光锐利、一眼发现；“轻”写积雪化尽，马蹄轻快，奔驰如飞。②对仗工整，以“草枯”“雪尽”写出冬末的猎场特点，又借鹰和马写出出猎的迅捷，侧面烘托将军的英武。",
      },
      {
        ask: "诗的尾联在写法上有什么特点？有什么作用？请简要分析。",
        model:
          "①以景结情：“回看”射雕处，只见千里暮云平铺，以开阔的景象收束全诗，余韵悠长。②动静结合，与前面驰猎的紧张迅疾相映，由动转静。③“射雕处”暗含赞美将军箭术高超之意，景象辽阔，衬托出将军踌躇满志、豪迈从容的心境。",
      },
    ],
  },
  {
    title: "鹧鸪天·代人赋",
    author: "〔宋〕辛弃疾",
    body: "陌上柔桑破嫩芽，东邻蚕种已生些。\n平冈细草鸣黄犊，斜日寒林点暮鸦。\n山远近，路横斜，青旗沽酒有人家。\n城中桃李愁风雨，春在溪头荠菜花。",
    understanding: [
      {
        ask: "下列对这首词的理解和赏析，正确的一项是",
        right: "上阕写桑芽初破、蚕卵孵化、黄犊鸣叫、暮鸦归林，描绘出一幅早春农村的生活图景。",
        wrong: [
          "上阕写桑叶茂盛、蚕已结茧，表现了农家在盛夏时节丰收的喜悦。",
          "“斜日寒林点暮鸦”写寒鸦哀鸣，表现了词人面对暮色时深深的绝望。",
          "下阕“青旗沽酒有人家”写词人在酒家买醉，借酒浇愁，排遣仕途失意。",
        ],
        ground: "陌上柔桑破嫩芽，东邻蚕种已生些。",
        reasons: [
          t(
            "Wrong season: new buds and a few hatchlings, early spring.",
            "时令说错：桑树才“破嫩芽”，蚕卵才孵出一些，是早春，不是盛夏结茧。",
          ),
          t(
            "Wrong feeling: the crows dot the trees like a painting.",
            "情感说错：“点暮鸦”是暮鸦点缀在寒林上，像画中点染，没有哀鸣，更谈不上绝望。",
          ),
          t(
            "Invented: a wine flag by the road, no drowning of sorrow.",
            "无中生有：“青旗沽酒有人家”只是写山路边有挂着酒旗的人家，没写词人买醉浇愁。",
          ),
        ],
      },
      {
        ask: "下列对这首词情感的理解，正确的一项是",
        right: "词人赞美乡野早春的生机，借城中桃李与溪头荠菜的对照，流露出对田园生活的喜爱。",
        wrong: [
          "词人抒写对城市繁华生活的向往，认为乡村荒凉冷落，不值得久居。",
          "词人借荠菜花自比，抒发年华老去、青春不再的悲哀和无奈。",
          "词人通过桃李遭受风雨，表达对国家山河破碎的悲愤和收复失地的决心。",
        ],
        ground: "城中桃李愁风雨，春在溪头荠菜花。",
        reasons: [
          t(
            "Reversed: spring is in the village, the city's blossoms fret.",
            "情感说反：词人说“春在溪头荠菜花”，喜爱的是乡村，城中桃李反而在“愁风雨”。",
          ),
          t(
            "Reads too much: the shepherd's purse is spring itself, not old age.",
            "过度解读：荠菜花是春天在乡野的象征，生机盎然，不是自比衰老。",
          ),
          t(
            "Reads too much: Xin often writes of lost lands, but here the rain only troubles city blossoms.",
            "过度解读：辛弃疾别的词常写收复失地，这首却写乡村春景，“愁风雨”是说城中桃李经不起风雨，不涉山河破碎。",
          ),
        ],
      },
    ],
    analysis: [
      {
        ask: "下列对这首词艺术手法的分析，正确的一项是",
        right: "结尾两句运用对比，城中桃李怕风雨，溪头荠菜却生意盎然，含蓄地点出春在乡野。",
        wrong: [
          "结尾两句运用比喻，把桃李比作城中百姓，把荠菜比作乡间农夫。",
          "结尾两句采用夸张，极言风雨之猛，表现了自然灾害给农家带来的苦难。",
          "结尾两句直抒胸臆，以议论代替写景，与上阕的写景毫无联系。",
        ],
        ground: "城中桃李愁风雨，春在溪头荠菜花。",
        reasons: [
          t(
            "Wrong device: the flowers are flowers, set in contrast, not figures for people.",
            "手法说错：桃李和荠菜写的就是花本身，两相对照，没有用来比喻百姓和农夫。",
          ),
          t(
            "Wrong content: the blossoms fear rain; there is no disaster.",
            "内容说错：“愁风雨”是说城里的桃李怕风雨摧残，没有极写风雨之猛，也没写农家受灾。",
          ),
          t(
            "Wrong relation: the ending caps the spring scene above.",
            "关系说错：结尾的荠菜花正接着上阕的桑芽、黄犊，是乡村春景的收束，不是毫无联系。",
          ),
        ],
      },
      {
        ask: "下列对这首词写景的分析，正确的一项是",
        right: "“破”字写出嫩芽冲破枝条的动态，“点”字写出暮鸦散落寒林，有如图画中点染而成。",
        wrong: [
          "“破”字写桑树遭到破坏，表现出农村生产凋敝、百姓生活艰难。",
          "“点”字写词人一一清点归巢的乌鸦，表现他闲居无事、百无聊赖。",
          "“山远近，路横斜”写山路崎岖难行，暗示词人仕途坎坷、处处碰壁。",
        ],
        ground: "斜日寒林点暮鸦",
        reasons: [
          t("Wrong sense: 破 is buds breaking out.", "词义说错：“破”是嫩芽破枝而出，写生机，不是桑树遭到破坏。"),
          t("Wrong sense: 点 is dotting, not counting.", "词义说错：“点”是点缀，暮鸦散落在寒林上，像画中点染，不是清点。"),
          t(
            "Reads too much: winding paths lead to a tavern; no career is meant.",
            "过度解读：“山远近，路横斜”写山路远近错落，紧接着是“青旗沽酒有人家”，是乡野的画面，没有仕途的暗示。",
          ),
        ],
      },
    ],
    answers: [
      {
        ask: "这首词的上阕是怎样写景的？请简要分析。",
        model:
          "①动静结合：嫩芽破枝、黄犊鸣叫是动，平冈细草、斜日寒林是静。②远近结合：由陌上桑、东邻蚕写到平冈、寒林，由近及远。③视听结合：既有细草、暮鸦之色，又有黄犊之鸣。词人选取乡村早春常见之物，写出农村的生机与宁静。",
      },
      {
        ask: "结尾“城中桃李愁风雨，春在溪头荠菜花”有什么含意？请简要分析。",
        model:
          "①写景上，城中桃李经不起风雨，愁容满面，而溪头荠菜花在风雨中照样开放，春天真正在乡野。②运用对比，以桃李衬荠菜，赞美乡村质朴而有生命力。③含蓄地表达了词人对乡村生活的喜爱，也隐含着对城市繁华、脆弱一面的冷眼和厌倦。",
      },
    ],
  },
  {
    title: "房兵曹胡马",
    author: "〔唐〕杜甫",
    body: "胡马大宛名，锋棱瘦骨成。\n竹批双耳峻，风入四蹄轻。\n所向无空阔，真堪托死生。\n骁腾有如此，万里可横行。",
    understanding: [
      {
        ask: "下列对这首诗的理解和赏析，正确的一项是",
        right: "首联点出胡马出自以良马著称的大宛，又写它骨骼瘦劲、棱角分明，突出其神骏。",
        wrong: [
          "首联写胡马瘦骨嶙峋，是因为主人喂养不善，表达了诗人对马的同情。",
          "颈联写这匹马去过的地方都不宽阔，表现出它只能在狭窄处奔跑。",
          "尾联写马已年老，不能再驰骋万里，抒发了英雄迟暮的感慨。",
        ],
        ground: "胡马大宛名，锋棱瘦骨成。",
        reasons: [
          t("Misreads: lean, angular bones mark a fine horse.", "理解说错：“锋棱瘦骨”是骨骼瘦劲有棱角，是良马的特征，不是喂养不善。"),
          t("Reversed: no distance is too wide for it.", "词义说反：“所向无空阔”是说它跑到哪里，哪里都不算辽阔，不是只能在狭窄处跑。"),
          t("Reversed: it can range ten thousand li; it is not old.", "意思说反：“万里可横行”是说它能驰骋万里，诗中没有写马老。"),
        ],
      },
      {
        ask: "下列对这首诗情感的理解，正确的一项是",
        right: "诗人赞美胡马，借马寄托自己建功立业、驰骋万里的抱负，情调昂扬豪迈。",
        wrong: [
          "诗人借胡马抒写思乡之情，马来自远方，暗示诗人久客他乡、归家无望。",
          "诗人借胡马讽刺房兵曹贪图享乐，只知养马取乐，不问国事。",
          "诗人借胡马表现对战争的厌恶，认为战马横行万里给百姓带来灾难。",
        ],
        ground: "骁腾有如此，万里可横行。",
        reasons: [
          t(
            "Wrong feeling: Dayuan names the breed; there is no homesickness.",
            "情感说错：大宛只是点出马的产地；全诗写马的神骏和气势，没有思乡。",
          ),
          t("Invented: the horse is praised; the owner is not mocked.", "无中生有：诗题是写房兵曹的胡马，诗人赞的是马，没有讽刺主人。"),
          t("Reversed: it is ambition, not hatred of war.", "情感说反：“万里可横行”是赞马能建功，诗人借此寄托抱负，不是厌恶战争。"),
        ],
      },
    ],
    analysis: [
      {
        ask: "下列对这首诗艺术手法的分析，正确的一项是",
        right: "前四句写马的外形，后四句写马的品格，由形及神，最后托物言志，结构严谨。",
        wrong: [
          "前四句写马的品格，后四句写马的外形，先虚后实，突出马的勇猛。",
          "全诗以叙事为主，详细记叙房兵曹得到这匹马的经过，情节曲折生动。",
          "全诗借马与人的对比，写出马的高大和人的渺小，表现自然的伟力。",
        ],
        ground: "所向无空阔，真堪托死生。",
        reasons: [
          t("Reversed: looks first, then character.", "顺序说反：前四句写骨相、双耳、四蹄，是外形；后四句才写品格。"),
          t("Wrong mode: it describes the horse; it tells no story.", "表达方式说错：全诗写马的形与神，没有记叙房兵曹得马的经过。"),
          t("Invented: no man is compared with it.", "无中生有：诗中只写马，没有拿人来比，也没有写马高大、人渺小。"),
        ],
      },
      {
        ask: "下列对诗中修辞和用词的分析，正确的一项是",
        right: "“竹批双耳峻”把马耳比作斜削的竹筒，写出耳朵尖挺；“风入四蹄轻”写马奔驰如风。",
        wrong: [
          "“竹批双耳峻”写马被竹鞭抽打双耳，表现驯马的严酷和马的顺从。",
          "“风入四蹄轻”写马蹄被风吹得站立不稳，表现了马的瘦弱无力。",
          "“真堪托死生”运用夸张，说马能起死回生，表现诗人对神马的迷信。",
        ],
        ground: "竹批双耳峻，风入四蹄轻。",
        reasons: [
          t("Misreads: ears like sliced bamboo, not whipped.", "理解说错：“竹批”是像斜削的竹筒，形容马耳尖挺，不是竹鞭抽打。"),
          t("Reversed: wind in its hooves means speed.", "意思说反：“风入四蹄轻”是说马奔驰时四蹄生风、轻快，不是站不稳。"),
          t("Wrong sense: one may trust it with one's life.", "词义说错：“托死生”是说可以把性命托付给它，形容马可靠，不是起死回生。"),
        ],
      },
    ],
    answers: [
      {
        ask: "诗的颔联是怎样描写胡马的？请简要分析。",
        model:
          "①运用比喻：“竹批双耳峻”把马耳比作斜削的竹筒，写出双耳尖削挺立的神骏之态。②运用夸张和侧面描写：“风入四蹄轻”写马奔跑时四蹄生风、轻快如飞，以风衬托马的迅疾。两句一静一动，写出了良马的外形和速度。",
      },
      {
        ask: "这首诗运用了托物言志的手法，请结合诗句简要分析。",
        model:
          "①诗人先写胡马的外形：“锋棱瘦骨”“竹批双耳”“风入四蹄”，写其神骏；再写它的品格：“所向无空阔，真堪托死生”，写其勇猛可靠。②尾联“万里可横行”由马及人，既称赞胡马，也勉励马的主人，更寄托了诗人自己驰骋万里、建功立业的远大抱负。",
      },
    ],
  },
  {
    title: "台城",
    author: "〔唐〕韦庄",
    body: "江雨霏霏江草齐，六朝如梦鸟空啼。\n无情最是台城柳，依旧烟笼十里堤。",
    understanding: [
      {
        ask: "下列对这首诗的理解和赏析，正确的一项是",
        right: "“六朝如梦”写六朝繁华转瞬即逝，“鸟空啼”写鸟儿不知兴亡依旧啼鸣，透出空寂与感伤。",
        wrong: [
          "首句写江雨连绵、江草被雨水冲倒，表现了金陵遭受水灾的惨状。",
          "“六朝如梦”写诗人梦中游历六朝故都，醒后为美梦破灭而懊恼。",
          "后两句写诗人怨恨台城柳遮挡了视线，使他看不清十里长堤的景色。",
        ],
        ground: "六朝如梦鸟空啼。",
        reasons: [
          t(
            "Misreads: lush grass in spring drizzle, not a flood.",
            "理解说错：“江草齐”是江草长得齐整茂盛，春雨霏霏，写的是迷蒙春景，不是水灾。",
          ),
          t(
            "Misreads: the dynasties passed like a dream; he did not dream.",
            "理解说错：“如梦”是说六朝繁华像梦一样消逝，不是诗人做梦游历。",
          ),
          t(
            "Misreads: the willows are heartless because unchanged, not because they block the view.",
            "理解说错：“无情”是说柳不知兴亡、依旧繁茂，诗人怨的是物是人非，不是柳挡了视线。",
          ),
        ],
      },
      {
        ask: "下列对这首诗情感的理解，正确的一项是",
        right: "诗人凭吊六朝故迹，感叹繁华易逝、世事无常，抒发了吊古伤今的深沉感慨。",
        wrong: [
          "诗人赞美金陵春景明媚，柳色如烟，表达了游春的愉悦和对生活的热爱。",
          "诗人借台城柳抒写与友人离别的愁绪，柳是折柳送别的象征。",
          "诗人追慕六朝帝王的功业，抒发自己渴望建功立业、名垂青史的豪情。",
        ],
        ground: "无情最是台城柳，依旧烟笼十里堤。",
        reasons: [
          t("Reversed: the bright scene sets off grief.", "情感说反：春景明媚是反衬，“六朝如梦”“鸟空啼”透出的是伤感，不是游春的愉悦。"),
          t(
            "Wrong image: here the willow witnesses history, not a parting.",
            "意象用错：柳虽常用于折柳送别，这首诗写台城柳“依旧”，是兴亡的见证，没有友人离别。",
          ),
          t(
            "Wrong feeling: he laments vanished glory, he does not covet it.",
            "情感说错：诗人说六朝“如梦”，感叹繁华成空，没有追慕帝王功业。",
          ),
        ],
      },
    ],
    analysis: [
      {
        ask: "下列对这首诗艺术手法的分析，正确的一项是",
        right: "诗人说台城柳“无情”，以柳的依旧繁茂反衬人事的变迁，越写柳无情，越见人伤感。",
        wrong: [
          "诗人把台城柳比作六朝美人，借柳的婀娜多姿赞美六朝宫廷生活的奢华。",
          "诗人借台城柳托物言志，表现自己坚贞不屈、不随世俗沉浮的品格。",
          "“无情”是诗人直接批评柳树不懂人情，表达了对自然景物的厌恶。",
        ],
        ground: "无情最是台城柳",
        reasons: [
          t(
            "Wrong device: the willow is not a beauty; its mist sets off the ruin.",
            "手法说错：诗中没有把柳比作美人，“烟笼十里堤”写柳色如烟，用来反衬兴亡。",
          ),
          t(
            "Wrong device: the willow is an unfeeling witness, not the poet.",
            "手法说错：柳在这里是不知兴亡的见证者，不是诗人自比的品格。",
          ),
          t(
            "Reversed: “heartless” shows how much the poet feels.",
            "理解说反：说柳“无情”是反语，柳不懂兴亡，正衬出人的多情和伤感，不是厌恶景物。",
          ),
        ],
      },
      {
        ask: "下列对这首诗写景的分析，正确的一项是",
        right: "细雨霏霏、江草齐生、柳色如烟，景物明丽却迷蒙，以乐景衬托出怀古的哀情。",
        wrong: [
          "诗中景物萧瑟凋零，草木枯黄，与诗人的伤感之情完全一致，以哀景写哀情。",
          "诗中用大量笔墨写台城宫殿的雄伟壮丽，表现六朝国力的强盛。",
          "诗中写景采用由近及远的顺序，从堤上柳写到江草，最后写到江雨。",
        ],
        ground: "江雨霏霏江草齐",
        reasons: [
          t(
            "Not so: the scene is lush; it is a bright scene for sorrow.",
            "与原文不符：江草“齐”、柳“烟笼十里堤”，景物繁茂，并不萧瑟枯黄，是以乐景写哀情。",
          ),
          t("Invented: no palace appears.", "无中生有：诗中没有写宫殿，只写江雨、江草、鸟和柳，宫殿早已不在。"),
          t("Reversed: rain and grass first, willows last.", "顺序说反：诗先写江雨、江草，再写鸟，最后写台城柳，不是由柳写到江雨。"),
        ],
      },
    ],
    answers: [
      {
        ask: "诗中的“无情”二字有什么妙处？请简要分析。",
        model:
          "①运用拟人和反衬：说柳“无情”，因为它不管六朝兴亡，依旧烟笼长堤，以柳的不变反衬人事的巨变。②深化情感：柳无情，正见人有情，诗人面对故都的满目春色，更感到繁华如梦、世事无常，吊古伤今之情更加深沉。",
      },
      {
        ask: "这首诗是怎样借景抒情的？请结合诗句简要分析。",
        model:
          "①以乐景写哀情：江雨霏霏、江草齐生、柳色如烟，春景迷蒙秀丽，而六朝繁华已逝，景越美越显凄凉。②借景物的不变写人事的变迁：“鸟空啼”“依旧烟笼”，写鸟和柳不知兴亡，衬托出诗人对繁华易逝的伤感。③“如梦”点出虚幻之感，情寓景中，含蓄深沉。",
      },
    ],
  },
  {
    title: "鹊桥仙·一竿风月",
    author: "〔宋〕陆游",
    body: "一竿风月，一蓑烟雨，家在钓台西住。\n卖鱼生怕近城门，况肯到红尘深处？\n潮生理棹，潮平系缆，潮落浩歌归去。\n时人错把比严光，我自是无名渔父。",
    understanding: [
      {
        ask: "下列对这首词的理解和赏析，正确的一项是",
        right: "“卖鱼生怕近城门”写渔父连卖鱼都怕靠近城门，更不愿进入繁华喧嚣的尘世。",
        wrong: [
          "“卖鱼生怕近城门”写渔父害怕城中官吏盘剥，表现出百姓生活的艰辛。",
          "上阕写渔父家住钓台西边，每日进城卖鱼，生活富足而忙碌。",
          "下阕写渔父因潮水涨落不定而无法出船，只好唱着悲歌回家。",
        ],
        ground: "卖鱼生怕近城门，况肯到红尘深处？",
        reasons: [
          t(
            "Reads too much: he shuns the world, as the next line says.",
            "过度解读：怕近城门是怕沾染尘世，下句“况肯到红尘深处”已点明，并非怕官吏盘剥。",
          ),
          t(
            "The reverse: he avoids the gate and lives simply.",
            "与原文相反：他“生怕近城门”，不是每日进城；一竿一蓑，生活简淡，谈不上富足忙碌。",
          ),
          t(
            "Reversed: he moves with the tide and sings aloud.",
            "意思说反：潮生划船、潮平系缆、潮落归去，渔父随潮而动，唱的是“浩歌”，是放声高歌，不是悲歌。",
          ),
        ],
      },
      {
        ask: "下列对这首词情感的理解，正确的一项是",
        right: "词人借渔父形象，表现远离尘世、自由自在的生活，流露出淡泊名利的情怀。",
        wrong: [
          "词人羡慕严光的盛名，渴望像他一样被世人称颂，表现出强烈的功名心。",
          "词人借渔父的贫困生活，控诉统治者的苛政，表达对百姓的深切同情。",
          "词人抒写对城市繁华的向往，只因身为渔父无法进城而深感遗憾。",
        ],
        ground: "我自是无名渔父。",
        reasons: [
          t("Reversed: he rejects even Yan Guang's fame.", "意思说反：渔父说“时人错把比严光，我自是无名渔父”，连严光的高名也不要。"),
          t("Wrong feeling: he lives freely; no poverty or tyranny.", "情感说错：词中渔父一竿一蓑，过得自在，没有写贫困和苛政。"),
          t("Reversed: he fears the city gate.", "情感说反：他“生怕近城门”，更不肯到“红尘深处”，不是向往城市。"),
        ],
      },
    ],
    analysis: [
      {
        ask: "下列对这首词艺术手法的分析，正确的一项是",
        right: "“潮生理棹，潮平系缆，潮落浩歌归去”运用排比，写出渔父随潮而动、从容自得的生活。",
        wrong: [
          "“潮生理棹，潮平系缆，潮落浩歌归去”运用比喻，把潮水比作人生的起落。",
          "“一竿风月，一蓑烟雨”运用夸张，写渔父一竿就能钓起风和月亮。",
          "“一竿风月，一蓑烟雨”写渔父生活艰苦，风雨中劳作，以哀景写哀情。",
        ],
        ground: "潮生理棹，潮平系缆，潮落浩歌归去。",
        reasons: [
          t(
            "Wrong device: parallel lines of real tides, no metaphor.",
            "手法说错：三句写的就是潮水和渔父的动作，是排比，没有拿潮水来比人生。",
          ),
          t(
            "Misreads: rod with wind and moon, not hooking the moon.",
            "理解说错：“一竿风月”是钓竿伴着风月，写生活清雅，不是夸张说钓起月亮。",
          ),
          t("Reversed: wind, moon and mist are ease, not hardship.", "情感说反：风月烟雨是渔父自在生活的画面，透着闲适，不是苦景苦情。"),
        ],
      },
      {
        ask: "下列对词的结尾的分析，正确的一项是",
        right: "结尾用东汉严光的典故而翻进一层：严光隐居尚有高名，渔父连名也不要，更显超脱。",
        wrong: [
          "结尾用严光的典故，说渔父与严光一样被皇帝召见，表现他受到朝廷的重用。",
          "结尾直接批评严光沽名钓誉，表达了词人对古代隐士的鄙视和否定。",
          "结尾写时人把渔父错认作严光，渔父为此十分得意，表现出他的虚荣。",
        ],
        ground: "时人错把比严光，我自是无名渔父。",
        reasons: [
          t(
            "Wrong fact and sense: Yan Guang refused the emperor; no one is summoned.",
            "史实和意思都错：严光是不肯应光武帝之召的隐士，渔父说别人错把他比严光，并没有被召见。",
          ),
          t(
            "Reads too much: he goes beyond Yan Guang, he does not attack him.",
            "理解过度：结尾是说自己比严光更进一步，连名也不要，不是直接批评严光。",
          ),
          t("Reversed: he refuses the comparison.", "情感说反：渔父说“错把”，是不认这个比，自称“无名”，不是得意。"),
        ],
      },
    ],
    answers: [
      {
        ask: "这首词塑造了一个怎样的渔父形象？请结合词句简要分析。",
        model:
          "①远离尘世：“卖鱼生怕近城门，况肯到红尘深处”，连城门都怕靠近，更不愿进入喧嚣的尘世。②自由洒脱：“潮生理棹，潮平系缆，潮落浩歌归去”，随潮出没，放声高歌，从容自在。③淡泊名利：“我自是无名渔父”，不愿与严光相比，连隐士的名声也不要。",
      },
      {
        ask: "词的上阕是怎样写渔父的生活环境的？请简要分析。",
        model:
          "①以数量词和意象勾勒画面：“一竿风月，一蓑烟雨”，用“一竿”“一蓑”写出渔父的简朴，用“风月”“烟雨”写出江上的清幽，有诗情画意。②以地点点题：“家在钓台西住”，钓台是严光隐居垂钓之处，暗示渔父的隐逸，也为结尾作铺垫。",
      },
    ],
  },
  {
    title: "入若耶溪",
    author: "〔南朝梁〕王籍",
    body: "艅艎何泛泛，空水共悠悠。\n阴霞生远岫，阳景逐回流。\n蝉噪林逾静，鸟鸣山更幽。\n此地动归念，长年悲倦游。",
    understanding: [
      {
        ask: "下列对这首诗的理解和赏析，正确的一项是",
        right: "首联写大船在溪上轻缓漂行，天空与溪水一样悠远，写出泛舟若耶溪时的悠闲开阔。",
        wrong: [
          "首联写船在溪中颠簸摇晃，水流湍急，表现出行船的惊险和诗人的恐惧。",
          "颔联写乌云笼罩远山，太阳被遮住，暗示诗人前途渺茫，内心苦闷。",
          "颈联写蝉鸣鸟叫吵闹不休，使诗人心烦意乱，于是决定离开若耶溪。",
        ],
        ground: "艅艎何泛泛，空水共悠悠。",
        reasons: [
          t("Reversed: drifting gently, not tossing.", "意思说反：“泛泛”是轻缓漂浮，“悠悠”是悠远，写的是平稳悠闲，不是颠簸惊险。"),
          t(
            "Misreads: clouds on far hills and sunlight on the water, bright not dark.",
            "理解说错：“阴霞生远岫，阳景逐回流”写远山云霞和水上日影交映，是明丽的景色，没有乌云遮日。",
          ),
          t("Reversed: the sounds deepen the quiet he loves.", "理解说反：蝉噪鸟鸣反衬出林更静、山更幽，诗人喜爱这里，并非嫌吵。"),
        ],
      },
      {
        ask: "下列对这首诗情感的理解，正确的一项是",
        right: "诗人被若耶溪的幽美景色打动，生出归隐之念，又为多年在外宦游感到厌倦和悲伤。",
        wrong: [
          "诗人游历若耶溪，乐而忘返，决心终身留在此地，再也不回故乡。",
          "诗人因若耶溪景色平淡无奇而失望，后悔此行，表达了对旅途的厌烦。",
          "诗人借若耶溪美景抒发建功立业的壮志，渴望早日入朝为官。",
        ],
        ground: "此地动归念，长年悲倦游。",
        reasons: [
          t("Reversed: he thinks of going home.", "意思说反：“动归念”是动了回家的念头，诗人想的是回去，不是终身留下。"),
          t(
            "Reversed: he is moved by the scene; he is tired of years away.",
            "情感说反：诗人写溪上开阔、山林幽静，是被美景打动；“倦游”倦的是多年宦游，不是这次出游。",
          ),
          t("Reversed: weary of office, not seeking it.", "情感说反：“悲倦游”是厌倦在外为官奔波，想要归去，不是渴望入朝。"),
        ],
      },
    ],
    analysis: [
      {
        ask: "下列对这首诗艺术手法的分析，正确的一项是",
        right: "“蝉噪林逾静，鸟鸣山更幽”以动衬静，用蝉声、鸟声反衬山林的幽静，意境深远。",
        wrong: [
          "“蝉噪林逾静，鸟鸣山更幽”运用对比，写出山林由安静变得喧闹的过程。",
          "“蝉噪林逾静，鸟鸣山更幽”运用拟人，写蝉和鸟像人一样争吵不休。",
          "“蝉噪林逾静，鸟鸣山更幽”以乐景写哀情，写出了诗人内心的焦躁不安。",
        ],
        ground: "蝉噪林逾静，鸟鸣山更幽。",
        reasons: [
          t(
            "Wrong device and sense: sound sets off silence; it grows quieter.",
            "手法和意思都错：蝉噪鸟鸣是用声音反衬寂静，“逾静”“更幽”说的是更静了，不是变得喧闹。",
          ),
          t("Wrong device: no personification, no quarrel.", "手法说错：诗只写蝉在噪、鸟在鸣，没有把它们写成人，也没有争吵。"),
          t("Wrong device and feeling: quiet delight, not unrest.", "手法和情感都错：这两句以动衬静，写幽静的乐趣，诗人并不焦躁。"),
        ],
      },
      {
        ask: "下列对这首诗结构和写景的分析，正确的一项是",
        right: "前三联写泛舟所见所闻，尾联由景生情，转入思归与倦游，情景相生，层次清楚。",
        wrong: [
          "首联直抒胸臆，点明思归之情，后三联一一写景，先情后景，结构独特。",
          "颔联写溪上狂风骤雨、浊浪翻滚，以险景衬托出诗人旅途的艰辛。",
          "全诗只写景物，不写感受，诗人的情感完全隐藏在景物之中。",
        ],
        ground: "此地动归念",
        reasons: [
          t("Reversed: scene first, feeling at the end.", "结构说反：首联写泛舟所见，思归在尾联，是先景后情。"),
          t("The reverse: clouds and sunlight, no storm.", "与原文相反：颔联写云霞生于远山、日影追逐回流，景色明丽，没有狂风骤雨。"),
          t("Not so: the last couplet states feeling.", "与原文不符：尾联“动归念”“悲倦游”是直接抒情，并非只写景物。"),
        ],
      },
    ],
    answers: [
      {
        ask: "“蝉噪林逾静，鸟鸣山更幽”历来为人称道，请简要赏析。",
        model:
          "①以动衬静：蝉噪、鸟鸣是声响，却越发显出山林的幽静，因为只有极静之处，蝉声鸟声才格外分明。②对仗工整：“蝉噪”对“鸟鸣”，“林逾静”对“山更幽”，音韵和谐。③营造出幽深宁静的意境，为尾联生出归隐之念作了铺垫。",
      },
      {
        ask: "诗的尾联表达了诗人怎样的情感？与前文有什么关系？请简要分析。",
        model:
          "①情感：“此地动归念”写若耶溪的幽美景色使诗人生出归隐之念；“长年悲倦游”写多年在外宦游漂泊的厌倦和悲伤。②关系：前三联写溪上开阔悠远、山林幽静的景色，尾联由景生情，因景色之美而触动归思，情景相生，收束全诗。",
      },
    ],
  },
];
