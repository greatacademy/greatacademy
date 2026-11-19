// Reading traditional characters beyond the first ones (docs/chinese-curriculum.md §5.4): after the heritage bridge's
// first topic of traditional characters, a component simplified the same way in every character, and the characters
// that one simplified form stands for several traditional ones of, told apart by the word they are in. The forms are
// those Hong Kong and Taiwan share; a word the two write differently, such as 復習 and 複習, is left out.

import { t } from "@ga/content";

import { type DrillItem, drillItem, drillTopic, lines } from "../grammar/drill.ts";

/** items reads items from lines of `shown | right | wrong | wrong | wrong`. */
const items = (data: string): readonly DrillItem[] =>
  lines(data, 5).map(([shown, right, a, b, c]) => drillItem(shown!, right!, [a!, b!, c!]));

/** families are characters whose simplified form changes a component, each answered by its simplified form. */
const families = items(`
語 | 语 | 话 | 吾 | 悟
讀 | 读 | 续 | 卖 | 赎
談 | 谈 | 淡 | 毯 | 痰
記 | 记 | 纪 | 忌 | 计
銀 | 银 | 很 | 根 | 眼
錢 | 钱 | 浅 | 线 | 践
鐵 | 铁 | 失 | 跌 | 秩
紅 | 红 | 江 | 杠 | 虹
綠 | 绿 | 录 | 禄 | 碌
給 | 给 | 恰 | 拾 | 合
飯 | 饭 | 版 | 返 | 板
餓 | 饿 | 鹅 | 俄 | 峨
間 | 间 | 问 | 闲 | 简
貴 | 贵 | 责 | 遗 | 溃
買 | 买 | 卖 | 实 | 头
賣 | 卖 | 买 | 读 | 实
現 | 现 | 观 | 视 | 规
輪 | 轮 | 论 | 抡 | 伦
軍 | 军 | 车 | 晕 | 浑
騎 | 骑 | 奇 | 骄 | 椅
雞 | 鸡 | 鸭 | 难 | 欢
魚 | 鱼 | 鲁 | 渔 | 免
頭 | 头 | 页 | 买 | 实
題 | 题 | 提 | 堤 | 是
顏 | 颜 | 彦 | 产 | 须
風 | 风 | 凤 | 冈 | 凡
張 | 张 | 长 | 弦 | 账
`);

/** familyWords are words of such characters, each answered in simplified characters. */
const familyWords = items(`
語言 | 语言 | 话言 | 吾言 | 语信
讀書 | 读书 | 续书 | 读节 | 卖书
銀行 | 银行 | 很行 | 银衍 | 根行
紅綠燈 | 红绿灯 | 红录灯 | 江绿灯 | 红绿登
買賣 | 买卖 | 卖买 | 实卖 | 买读
時間 | 时间 | 时问 | 对间 | 时闲
顏色 | 颜色 | 彦色 | 颜邑 | 产色
騎車 | 骑车 | 奇车 | 骑东 | 椅车
雞蛋 | 鸡蛋 | 鸭蛋 | 难蛋 | 鸡旦
風箏 | 风筝 | 凤筝 | 风争 | 风铮
價錢 | 价钱 | 价浅 | 份钱 | 价线
鐵路 | 铁路 | 失路 | 铁络 | 跌路
現在 | 现在 | 观在 | 现存 | 视在
課本 | 课本 | 棵本 | 果本 | 课木
貴賓 | 贵宾 | 责宾 | 贵兵 | 遗宾
`);

/** shared are characters whose simplified form stands for two traditional ones, each asked in a word: `word：character`. */
const shared = items(`
头发：发 | 髮 | 發 | 撥 | 廢
出发：发 | 發 | 髮 | 撥 | 廢
干净：干 | 乾 | 幹 | 千 | 竿
干活：干 | 幹 | 乾 | 干 | 杆
后面：后 | 後 | 后 | 候 | 逅
皇后：后 | 后 | 後 | 候 | 厚
面条：面 | 麵 | 面 | 綿 | 棉
见面：面 | 面 | 麵 | 綿 | 棉
一只鸟：只 | 隻 | 只 | 雙 | 售
只有：只 | 只 | 隻 | 支 | 叨
关系：系 | 係 | 系 | 繫 | 細
系鞋带：系 | 繫 | 係 | 系 | 擊
战斗：斗 | 鬥 | 斗 | 鬧 | 抖
北斗：斗 | 斗 | 鬥 | 抖 | 料
放松：松 | 鬆 | 松 | 鬃 | 頌
松树：松 | 松 | 鬆 | 鬃 | 訟
白云：云 | 雲 | 云 | 雪 | 芸
手表：表 | 錶 | 表 | 鏢 | 裱
表示：表 | 表 | 錶 | 衷 | 裱
制造：制 | 製 | 制 | 際 | 掣
制度：制 | 制 | 製 | 刺 | 剃
恢复：复 | 復 | 複 | 覆 | 腹
复杂：复 | 複 | 復 | 覆 | 腹
历史：历 | 歷 | 曆 | 瀝 | 厲
日历：历 | 曆 | 歷 | 瀝 | 厲
准备：准 | 準 | 准 | 淮 | 隼
批准：准 | 准 | 準 | 淮 | 推
冲突：冲 | 衝 | 沖 | 仲 | 種
冲茶：冲 | 沖 | 衝 | 仲 | 種
模范：范 | 範 | 范 | 犯 | 氾
丑陋：丑 | 醜 | 丑 | 酬 | 鬼
小丑：丑 | 丑 | 醜 | 扭 | 紐
稻谷：谷 | 穀 | 谷 | 殼 | 欲
山谷：谷 | 谷 | 穀 | 欲 | 俗
老板：板 | 闆 | 板 | 闊 | 版
木板：板 | 板 | 闆 | 版 | 扳
象征：征 | 徵 | 征 | 微 | 懲
征服：征 | 征 | 徵 | 怔 | 症
签名：签 | 簽 | 籤 | 檢 | 僉
抽签：签 | 籤 | 簽 | 纖 | 鐵
尽力：尽 | 盡 | 儘 | 燼 | 畫
尽管：尽 | 儘 | 盡 | 僅 | 燼
游泳：游 | 游 | 遊 | 遨 | 浮
旅游：游 | 遊 | 游 | 遨 | 逛
心脏：脏 | 臟 | 髒 | 贓 | 臧
脏衣服：脏 | 髒 | 臟 | 贓 | 臧
`);

/** sharedPhrases are phrases with two such characters, each answered in traditional characters. */
const sharedPhrases = items(`
头发干了 | 頭髮乾了 | 頭發乾了 | 頭髮幹了 | 頭發幹了
后面的松树 | 後面的松樹 | 后面的松樹 | 後面的鬆樹 | 后面的鬆樹
面条只有一碗 | 麵條只有一碗 | 面條只有一碗 | 麵條隻有一碗 | 面條隻有一碗
一只手表 | 一隻手錶 | 一只手錶 | 一隻手表 | 一只手表
出发前系好鞋带 | 出發前繫好鞋帶 | 出髮前繫好鞋帶 | 出發前係好鞋帶 | 出髮前係好鞋帶
复杂的历史 | 複雜的歷史 | 復雜的歷史 | 複雜的曆史 | 復雜的曆史
准备日历 | 準備日曆 | 准備日曆 | 準備日歷 | 准備日歷
山谷和稻谷 | 山谷和稻穀 | 山穀和稻穀 | 山谷和稻谷 | 山穀和稻谷
尽力准备 | 盡力準備 | 儘力準備 | 盡力准備 | 儘力准備
旅游时游泳 | 旅遊時游泳 | 旅游時游泳 | 旅遊時遊泳 | 旅游時遊泳
洗干净脏衣服 | 洗乾淨髒衣服 | 洗幹淨髒衣服 | 洗乾淨臟衣服 | 洗幹淨臟衣服
签名表示同意 | 簽名表示同意 | 籤名表示同意 | 簽名錶示同意 | 籤名錶示同意
制度和制造 | 制度和製造 | 製度和製造 | 制度和制造 | 製度和制造
冲茶时别冲动 | 沖茶時別衝動 | 衝茶時別衝動 | 沖茶時別沖動 | 衝茶時別沖動
皇后在后面 | 皇后在後面 | 皇後在後面 | 皇后在后面 | 皇後在后面
关系很复杂 | 關係很複雜 | 關系很複雜 | 關係很復雜 | 關系很復雜
`);

/** traditionalTopics are the topics of traditional characters after the heritage bridge's first one, in order. */
export const traditionalTopics = [
  drillTopic({
    id: "traditional-components",
    title: t("Traditional Characters: Components", "繁体字：偏旁类推"),
    summary: t(
      "Components simplified the same way in every character, such as 訁 to 讠, 釒 to 钅 and 糹 to 纟, read in characters and words.",
      "认识在每个字里都同样简化的偏旁，如“訁”作“讠”，“釒”作“钅”，“糹”作“纟”，读出含有它们的字和词语。",
    ),
    prerequisites: ["heritage-traditional"],
    strand: "characters",
    points: [
      {
        suffix: "characters",
        title: t("Characters by Component", "偏旁类推"),
        explanation: t(
          "Most simplified characters change one component, and it changes the same way wherever it is: 訁 is 讠 (語 语, 記 记), 釒 is 钅 (銀 银), 糹 is 纟 (紅 红), 飠 is 饣 (飯 饭), 門 is 门 (間 间), 貝 is 贝 (貴 贵), 見 is 见 (現 现), 車 is 车 (輪 轮), 馬 is 马 (騎 骑), 鳥 is 鸟 (雞 鸡) and 頁 is 页 (題 题). Find the component, simplify it, and keep the rest.",
          "大多数简化字只改了一个偏旁，而且这个偏旁在哪个字里都一样简化：“訁”作“讠”（語 语、記 记），“釒”作“钅”（銀 银），“糹”作“纟”（紅 红），“飠”作“饣”（飯 饭），“門”作“门”（間 间），“貝”作“贝”（貴 贵），“見”作“见”（現 现），“車”作“车”（輪 轮），“馬”作“马”（騎 骑），“鳥”作“鸟”（雞 鸡），“頁”作“页”（題 题）。先找出偏旁，把它换成简化的写法，其余部分不变。",
        ),
        question: t("What is this character in simplified form?", "这个繁体字的简化字是哪个？"),
        items: families,
        why: (right, shown) => t(`${shown} is ${right}.`, `“${shown}”的简化字是“${right}”。`),
      },
      {
        suffix: "words",
        title: t("Words", "词语"),
        explanation: t(
          "Read a word character by character, simplifying each component as in its family, then check that the word you get is a real word: 銀行 is 银行, 紅綠燈 红绿灯.",
          "读词语时一个字一个字地看，按偏旁类推出简化字，再想一想得到的是不是一个真正的词：“銀行”是“银行”，“紅綠燈”是“红绿灯”。",
        ),
        question: t("What is this word in simplified characters?", "这个词用简化字怎么写？"),
        items: familyWords,
        why: (right, shown) => t(`${shown} is ${right}.`, `“${shown}”用简化字写作“${right}”。`),
      },
    ],
  }),
  drillTopic({
    id: "traditional-shared",
    title: t("Traditional Characters: One Form for Several", "繁体字：一简对多繁"),
    summary: t(
      "Simplified characters that stand for two traditional ones, such as 发 for 發 and 髮, told apart by the word they are in.",
      "一个简化字对应两个繁体字，如“发”对应“發”和“髮”，要按所在的词语分辨。",
    ),
    prerequisites: ["traditional-components"],
    strand: "characters",
    points: [
      {
        suffix: "characters",
        title: t("Which Traditional Character", "选择繁体字"),
        explanation: t(
          "Some simplified characters merged two traditional ones, so the traditional form depends on the meaning: 发 is 發 in 出發 (set out) but 髮 in 頭髮 (hair); 干 is 乾 in 乾淨 (dry, clean) but 幹 in 幹活 (to do); 后 is 後 in 後面 (behind) but stays 后 in 皇后 (queen). Ask what the character means in the word, then choose.",
          "有些简化字是由两个繁体字合并而来的，所以繁体写法要看意思：“发”在“出發”里是“發”，在“頭髮”里是“髮”；“干”在“乾淨”里是“乾”，在“幹活”里是“幹”；“后”在“後面”里是“後”，在“皇后”里还是“后”。先想一想这个字在词语里是什么意思，再选择。",
        ),
        question: t("In this word, how is the character written in traditional form?", "在这个词语里，这个字的繁体怎么写？"),
        items: shared,
        why: (right, shown) => {
          const [word, char] = shown.split("：");
          return t(`In ${word}, ${char} is written ${right}.`, `在“${word}”里，“${char}”的繁体写作“${right}”。`);
        },
      },
      {
        suffix: "phrases",
        title: t("Phrases", "短语"),
        explanation: t(
          "When a phrase has two such characters, decide each by its own meaning: in 頭髮乾了 the hair is 髮 and dry is 乾.",
          "一个短语里有两个这样的字时，要按各自的意思分别判断：“头发干了”写作“頭髮乾了”，头发的“发”是“髮”，干燥的“干”是“乾”。",
        ),
        question: t("How is this phrase written in traditional characters?", "这个短语用繁体字怎么写？"),
        items: sharedPhrases,
        why: (right, shown) => t(`${shown} is written ${right}.`, `“${shown}”用繁体字写作“${right}”。`),
      },
    ],
  }),
];
