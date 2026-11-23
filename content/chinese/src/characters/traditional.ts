// Reading traditional characters beyond the first ones (docs/chinese-curriculum.md §5.4): after the heritage bridge's
// first topic of traditional characters, a component simplified the same way in every character, and the characters
// that one simplified form stands for several traditional ones of, told apart by the word they are in. The forms are
// those Hong Kong and Taiwan share; a word the two write differently, such as 復習 and 複習, is left out.

import { type Text, t } from "@ga/content";

import { type DrillItem, drillItem, drillTopic, lines } from "../grammar/drill.ts";
import { knownCharacters } from "./index.ts";

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

/** COMPONENTS are the components the family characters simplify, by character: the traditional form and the simplified. */
const COMPONENTS: Readonly<Record<string, readonly [string, string]>> = Object.fromEntries(
  (
    [
      ["訁", "讠", "語讀談記"],
      ["釒", "钅", "銀錢鐵"],
      ["糹", "纟", "紅綠給"],
      ["飠", "饣", "飯餓"],
      ["門", "门", "間"],
      ["貝", "贝", "貴"],
      ["見", "见", "現"],
      ["車", "车", "輪軍"],
      ["馬", "马", "騎"],
      ["頁", "页", "題顏"],
      ["長", "长", "張"],
    ] as const
  ).flatMap(([from, to, chars]) => [...chars].map((c) => [c, [from, to] as const])),
);

/** NOTES say how a character is simplified where it is not by one component alone, or more than one changes. */
const NOTES: Readonly<Record<string, Text>> = {
  讀: t("賣 on the right becomes 卖 as well.", "右边的“賣”也作“卖”。"),
  錢: t("戔 on the right becomes 戋 as well.", "右边的“戔”也作“戋”。"),
  鐵: t("The right part takes the new form 失.", "右边换成了新写法“失”。"),
  綠: t("彔 on the right becomes 录 as well.", "右边的“彔”也作“录”。"),
  輪: t("侖 on the right becomes 仑 as well.", "右边的“侖”也作“仑”。"),
  顏: t("彥 on the left becomes 彦 as well.", "左边的“彥”也作“彦”。"),
  買: t("It takes a new, short form, 买.", "换成了简短的新写法“买”。"),
  賣: t("It takes a new form, 卖: 十 above 买.", "换成了新写法“卖”：上面“十”，下面“买”。"),
  雞: t("奚 on the left becomes 又, and 隹 on the right becomes 鸟.", "左边的“奚”作“又”，右边的“隹”作“鸟”。"),
  魚: t("The four dots at its foot become one 横.", "下面的四点变成一横。"),
  頭: t("It takes a new, short form, 头.", "换成了简短的新写法“头”。"),
  風: t("虫 inside becomes 㐅.", "里面的“虫”换成“㐅”。"),
};

/** sameComponent lists other characters whose component is simplified the same way, for a check. */
const sameComponent = (char: string): readonly string[] => {
  const c = COMPONENTS[char];
  return c ? Object.keys(COMPONENTS).filter((x) => x !== char && COMPONENTS[x]![0] === c[0]) : [];
};

/** Simplifying is what explains a traditional character or word in simplified form, from the pairs a topic and its family teach. */
export interface Simplifying {
  readonly charWhy: (right: string, shown: string) => Text;
  readonly charWhyNot: (wrong: string, right: string, shown: string) => Text;
  readonly wordWhy: (right: string, shown: string) => Text;
  readonly wordWhyNot: (wrong: string, right: string, shown: string) => Text;
}

/**
 * simplifying explains simplified forms: a character by its component or how it changed, else by going back; a wrong
 * option as the simplified form of another character, as a character of its own sound and words, or as a look-alike.
 * `notes` say how characters outside the families change; `items` are the character and word items it draws pairs from.
 */
export function simplifying(notes: Readonly<Record<string, Text>>, items: readonly (readonly DrillItem[])[]): Simplifying {
  const simplified = new Map<string, string>();
  for (const list of [families, familyWords, ...items])
    for (const item of list) {
      const [from, to] = [[...item.shown], [...item.right]];
      if (from.length === to.length) for (const [k, f] of from.entries()) if (f !== to[k]) simplified.set(f, to[k]!);
    }
  const traditionalOf = new Map([...simplified].map(([f, s]) => [s, f]));
  const noteOf = (char: string): Text | undefined => notes[char] ?? NOTES[char];

  /** how says how one character is simplified, or that it stays. */
  const how = (from: string, to: string): Text => {
    if (from === to) return t(`${from} stays as it is.`, `“${from}”不变。`);
    const c = COMPONENTS[from];
    const note = noteOf(from);
    const component = c ? t(`${c[0]} becomes ${c[1]}. `, `“${c[0]}”作“${c[1]}”。`) : t("", "");
    return t(`${component.en}${note?.en ?? ""}`.trim(), `${component["zh-CN"]}${note?.["zh-CN"] ?? ""}`);
  };

  /** notChar says why a character is not the simplified form of another. */
  const notChar = (wrong: string, right: string, shown: string): Text => {
    const becomes =
      right === shown
        ? t(`${shown} stays ${shown}`, `“${shown}”的简化字还是“${shown}”`)
        : t(`${shown} simplifies to ${right}`, `“${shown}”简化为“${right}”`);
    const other = traditionalOf.get(wrong);
    if (other && other !== shown)
      return t(
        `${wrong} is the simplified form of ${other}, not of ${shown}; ${becomes.en}.`,
        `“${wrong}”是“${other}”的简化字，不是“${shown}”的；${becomes["zh-CN"]}。`,
      );
    const known = knownCharacters.get(wrong);
    if (known) {
      const words = [...new Set(known.words.map((w) => w.text))].slice(0, 2);
      return t(
        `${wrong} is another character, read ${known.reading}, as in ${words.join(" and ")}; ${becomes.en}.`,
        `“${wrong}”是另一个字，读 ${known.reading}，如${words.map((w) => `“${w}”`).join("")}；${becomes["zh-CN"]}。`,
      );
    }
    return t(`${wrong} only looks like ${right}; ${becomes.en}.`, `“${wrong}”只是和“${right}”长得像；${becomes["zh-CN"]}。`);
  };

  /** check checks a simplified character by its component in other characters, else by going back. */
  const check = (from: string, to: string): Text => {
    const c = COMPONENTS[from];
    const others = sameComponent(from);
    if (c && others.length > 0)
      return t(
        `**Check.** ${c[0]} becomes ${c[1]} the same way in ${others.map((o) => `${o} → ${simplified.get(o) ?? o}`).join(", ")}.`,
        `**检验。** 在${others.map((o) => `“${o}”→“${simplified.get(o) ?? o}”`).join("、")}里，“${c[0]}”也同样作“${c[1]}”。`,
      );
    return t(
      `**Check.** Going back, ${to} is written ${from} in traditional characters, the form used in Hong Kong and Taiwan.`,
      `**检验。** 反过来，“${to}”的繁体就是“${from}”，香港、台湾都这样写。`,
    );
  };

  return {
    charWhy: (right, shown) => {
      const h = how(shown, right);
      return t(
        `${shown} is written ${right} in simplified characters.${h.en ? ` ${h.en}` : ""}\n\n${check(shown, right).en}`,
        `“${shown}”的简化字是“${right}”。${h["zh-CN"]}\n\n${check(shown, right)["zh-CN"]}`,
      );
    },
    charWhyNot: notChar,
    wordWhy: (right, shown) => {
      const [from, to] = [[...shown], [...right]];
      const steps = (locale: "en" | "zh-CN") =>
        from
          .map((f, k) => (f === to[k] ? (locale === "en" ? `${f} stays` : `“${f}”不变`) : `${f} → ${to[k]}`))
          .join(locale === "en" ? ", " : "，");
      const changed = from.findIndex((f, k) => f !== to[k] && COMPONENTS[f]);
      const c = changed >= 0 ? check(from[changed]!, to[changed]!) : undefined;
      const last =
        c && sameComponent(from[changed]!).length > 0
          ? c
          : t(
              `**Check.** Read ${right} back: each character goes back to the one above it, in order, and ${right} is a word you say.`,
              `**检验。** 把“${right}”读一遍：每个字都能一一对回上面的繁体字，而且“${right}”是平时说的词。`,
            );
      return t(
        `Simplify each character in turn: ${steps("en")}.\n\nSo ${shown} is ${right}.\n\n${last.en}`,
        `一个字一个字地换成简化字：${steps("zh-CN")}。\n\n所以“${shown}”写作“${right}”。\n\n${last["zh-CN"]}`,
      );
    },
    wordWhyNot: (wrong, right, shown) => {
      const [w, r, s] = [[...wrong], [...right], [...shown]];
      if (w.length === r.length && [...w].sort().join("") === [...r].sort().join(""))
        return t(
          `${wrong} has the right characters in the wrong order: ${shown} is ${right}.`,
          `“${wrong}”字对了，顺序反了：“${shown}”写作“${right}”。`,
        );
      const diffs = w.map((_x, k) => k).filter((k) => w[k] !== r[k]);
      const reasons = diffs.map((k) => notChar(w[k]!, r[k]!, s[k] ?? r[k]!));
      return t(reasons.map((x) => x.en).join(" "), reasons.map((x) => x["zh-CN"]).join(""));
    },
  };
}

/** familyTeaching explains the family characters and words. */
const familyTeaching = simplifying({}, []);

/** FORMS say what each traditional form of a merged character means. */
const FORMS: Readonly<Record<string, Text>> = {
  發: t("to send out, to set out", "发出、出发"),
  髮: t("hair", "头发"),
  乾: t("dry, clean", "干燥、干净"),
  幹: t("to do; a trunk", "做事、主干"),
  干: t("a shield; to concern", "盾牌、关涉"),
  後: t("behind, after", "在后面、以后"),
  后: t("a queen", "君主的妻子"),
  麵: t("noodles, flour", "面条、面粉"),
  面: t("the face; a side, a surface", "脸、方面、表面"),
  隻: t("a measure word for animals, one of a pair", "用于动物等的量词"),
  只: t("only", "仅仅、只有"),
  係: t("to be; a relation", "是、关系"),
  繫: t("to tie, to fasten", "拴、结"),
  系: t("a system, a department", "系统、院系"),
  鬥: t("to fight", "争斗"),
  斗: t("a dipper, a measure of grain", "量粮食的器具、像斗的星"),
  鬆: t("loose, relaxed", "松散、放松"),
  松: t("the pine", "松树"),
  雲: t("a cloud", "天上的云"),
  云: t("to say", "说"),
  錶: t("a watch", "手表"),
  表: t("the outside; to show; a table", "外表、表示、表格"),
  製: t("to make", "制造"),
  制: t("a system; to control", "制度、控制"),
  復: t("to return, to recover", "恢复、往返"),
  複: t("double, complex", "重复、复杂"),
  歷: t("to go through; history", "经历、历史"),
  曆: t("the calendar", "历法、日历"),
  準: t("accurate; a standard; to get ready", "准确、标准、准备"),
  准: t("to permit", "允许"),
  衝: t("to rush, to clash", "冲锋、冲突、冲动"),
  沖: t("to pour water on, to rinse", "用水冲"),
  範: t("a model, a pattern", "模范、范围"),
  范: t("a surname", "姓"),
  醜: t("ugly", "丑陋"),
  丑: t("the second earthly branch; the clown of opera", "地支第二位、戏曲里的丑角"),
  穀: t("grain", "谷物、稻谷"),
  谷: t("a valley", "山谷"),
  闆: t("the boss, as in 老闆", "老板"),
  板: t("a board", "木板"),
  徵: t("a sign; to levy", "象征、征收"),
  征: t("to march, to conquer", "远行、征服"),
  簽: t("to sign", "签名"),
  籤: t("a slip of bamboo, a lot drawn", "竹签、抽签"),
  盡: t("to the utmost, to the end", "尽力、完全"),
  儘: t("as far as possible; even though", "尽量、尽管"),
  遊: t("to travel, to roam", "游玩、旅游"),
  游: t("to swim", "游泳"),
  臟: t("an inner organ", "内脏、心脏"),
  髒: t("dirty", "肮脏"),
};

/** MERGED are the traditional forms each simplified character stands for. */
const MERGED: Readonly<Record<string, readonly string[]>> = {
  发: ["發", "髮"],
  干: ["乾", "幹", "干"],
  后: ["後", "后"],
  面: ["麵", "面"],
  只: ["隻", "只"],
  系: ["係", "繫", "系"],
  斗: ["鬥", "斗"],
  松: ["鬆", "松"],
  云: ["雲", "云"],
  表: ["錶", "表"],
  制: ["製", "制"],
  复: ["復", "複"],
  历: ["歷", "曆"],
  准: ["準", "准"],
  冲: ["衝", "沖"],
  范: ["範", "范"],
  丑: ["醜", "丑"],
  谷: ["穀", "谷"],
  板: ["闆", "板"],
  征: ["徵", "征"],
  签: ["簽", "籤"],
  尽: ["盡", "儘"],
  游: ["遊", "游"],
  脏: ["臟", "髒"],
};

const meaningOf = (form: string): Text => FORMS[form]!;

/** exampleOf is a word of the shared items that writes a traditional form. */
const exampleOf = (form: string): string | undefined => shared.find((i) => i.right === form)?.shown.split("：")[0];

/** sharedWhy works out which traditional form a word needs: what the character means there, then the forms it has. */
const sharedWhy = (right: string, shown: string): Text => {
  const [word = "", char = ""] = shown.split("：");
  const m = meaningOf(right);
  const forms = MERGED[char]!;
  return t(
    `In ${word}, ${char} means "${m.en}".\n\nThat meaning is written ${right} in traditional characters.\n\n**Check.** ${char} stands for ${forms.map((f) => `${f}, "${meaningOf(f).en}"`).join(", and ")}; ${word} needs ${right}.`,
    `在“${word}”里，“${char}”表示“${m["zh-CN"]}”。\n\n表示这个意思，繁体写作“${right}”。\n\n**检验。** “${char}”对应${forms.map((f) => `“${f}”（${meaningOf(f)["zh-CN"]}）`).join("、")}；“${word}”要用“${right}”。`,
  );
};

/** sharedWhyNot says why a traditional form is not the one a word needs. */
const sharedWhyNot = (wrong: string, right: string, shown: string): Text => {
  const [word = "", char = ""] = shown.split("：");
  const forms = MERGED[char]!;
  if (forms.includes(wrong)) {
    const example = exampleOf(wrong);
    return t(
      `${wrong} is ${char} meaning "${meaningOf(wrong).en}"${example ? `, as in ${example}` : ""}; in ${word} it means "${meaningOf(right).en}".`,
      `“${wrong}”是“${char}”表示“${meaningOf(wrong)["zh-CN"]}”时的写法${example ? `，如“${example}”` : ""}；在“${word}”里，“${char}”表示“${meaningOf(right)["zh-CN"]}”。`,
    );
  }
  return t(
    `${wrong} is another character, not a traditional form of ${char}, which is ${forms.join(" or ")}.`,
    `“${wrong}”是另一个字，不是“${char}”的繁体；“${char}”的繁体是${forms.map((f) => `“${f}”`).join("或")}。`,
  );
};

/** phraseWhy works out each merged character of a phrase by its meaning there. */
const phraseWhy = (right: string, shown: string): Text => {
  const [s, r] = [[...shown], [...right]];
  const merged = s.map((_c, k) => k).filter((k) => MERGED[s[k]!]);
  const each = (locale: "en" | "zh-CN") =>
    merged
      .map((k) =>
        locale === "en"
          ? `${s[k]} means "${meaningOf(r[k]!).en}", so it is ${r[k]}`
          : `“${s[k]}”表示“${meaningOf(r[k]!)["zh-CN"]}”，写作“${r[k]}”`,
      )
      .join(locale === "en" ? "; " : "；");
  return t(
    `Decide each such character by its meaning here: ${each("en")}.\n\nThe other characters take their usual traditional forms, so the phrase is ${right}.\n\n**Check.** Read ${right} back character by character: each simplifies to the character of ${shown} in its place.`,
    `按在这里的意思分别判断：${each("zh-CN")}。\n\n其他字按通常的繁体写，所以这个短语写作“${right}”。\n\n**检验。** 把“${right}”一个字一个字地对回去，每个字都正好简化成“${shown}”里同一位置的字。`,
  );
};

/** phraseWhyNot names the characters a wrong phrase writes with the wrong form. */
const phraseWhyNot = (wrong: string, right: string, shown: string): Text => {
  const [w, r, s] = [[...wrong], [...right], [...shown]];
  const diffs = w.map((_, k) => k).filter((k) => w[k] !== r[k]);
  const reasons = diffs.map((k) =>
    FORMS[w[k]!]
      ? t(
          `${w[k]} means "${meaningOf(w[k]!).en}", but here ${s[k]} means "${meaningOf(r[k]!).en}", so it is ${r[k]}.`,
          `“${w[k]}”表示“${meaningOf(w[k]!)["zh-CN"]}”，这里的“${s[k]}”表示“${meaningOf(r[k]!)["zh-CN"]}”，要写“${r[k]}”。`,
        )
      : t(`${w[k]} is not a traditional form of ${s[k]}, which is ${r[k]} here.`, `“${w[k]}”不是“${s[k]}”的繁体，这里要写“${r[k]}”。`),
  );
  return t(reasons.map((x) => x.en).join(" "), reasons.map((x) => x["zh-CN"]).join(""));
};

/** traditionalTopics are the topics of traditional characters after the heritage bridge's first one, in order. */
export const traditionalTopics = [
  drillTopic({
    id: "traditional-components",
    title: t("Traditional Characters: Components", "繁体字：偏旁类推"),
    summary: t(
      "Components simplified the same way in every character, such as 訁 to 讠, 釒 to 钅 and 糹 to 纟, read in characters and words.",
      "认识在每个字里都同样简化的偏旁，如“訁”作“讠”，“釒”作“钅”，“糹”作“纟”，读出含有它们的字和词语。",
    ),
    intro: t(
      "Most simplified characters change one component, the same way in every character. Take 語: its component 訁 becomes 讠, and 吾 stays, so 語 is 语. This topic reads characters and words by their components.",
      "大多数简化字只改了一个偏旁，而且在每个字里都一样改。比如“語”：偏旁“訁”作“讠”，“吾”不变，所以“語”是“语”。这个专题按偏旁类推，读出繁体的字和词语。",
    ),
    prerequisites: ["heritage-traditional"],
    strand: "characters",
    points: [
      {
        suffix: "characters",
        title: t("Characters by Component", "偏旁类推"),
        explanation: t(
          "Most simplified characters change one component, and it changes the same way wherever it is: 訁 is 讠 (語 语, 記 记), 釒 is 钅 (銀 银), 糹 is 纟 (紅 红), 飠 is 饣 (飯 饭), 門 is 门 (間 间), 貝 is 贝 (貴 贵), 見 is 见 (現 现), 車 is 车 (輪 轮), 馬 is 马 (騎 骑), 鳥 is 鸟 (雞 鸡) and 頁 is 页 (題 题). Find the component, simplify it, and keep the rest.\n\n> **Watch out.** Change only the component and keep the rest as it is: 銀 is 银, with 釒 as 钅 and 艮 kept, not 很 or 根.",
          "大多数简化字只改了一个偏旁，而且这个偏旁在哪个字里都一样简化：“訁”作“讠”（語 语、記 记），“釒”作“钅”（銀 银），“糹”作“纟”（紅 红），“飠”作“饣”（飯 饭），“門”作“门”（間 间），“貝”作“贝”（貴 贵），“見”作“见”（現 现），“車”作“车”（輪 轮），“馬”作“马”（騎 骑），“鳥”作“鸟”（雞 鸡），“頁”作“页”（題 题）。先找出偏旁，把它换成简化的写法，其余部分不变。\n\n> **注意。** 只换偏旁，其余部分照原样保留：“銀”是“银”，“釒”作“钅”，“艮”不变，不是“很”或“根”。",
        ),
        question: t("What is this character in simplified form?", "这个繁体字的简化字是哪个？"),
        items: families,
        why: familyTeaching.charWhy,
        whyNot: familyTeaching.charWhyNot,
      },
      {
        suffix: "words",
        title: t("Words", "词语"),
        explanation: t(
          "Read a word character by character, simplifying each component as in its family, then check that the word you get is a real word: 銀行 is 银行, 紅綠燈 红绿灯.\n\n> **Watch out.** Change only the characters that need it: in 銀行, 行 has no simplified form and stays.",
          "读词语时一个字一个字地看，按偏旁类推出简化字，再想一想得到的是不是一个真正的词：“銀行”是“银行”，“紅綠燈”是“红绿灯”。\n\n> **注意。** 只换需要简化的字：“銀行”的“行”没有简化字，照原样写。",
        ),
        question: t("What is this word in simplified characters?", "这个词用简化字怎么写？"),
        items: familyWords,
        why: familyTeaching.wordWhy,
        whyNot: familyTeaching.wordWhyNot,
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
    intro: t(
      "Some simplified characters stand for two traditional ones, and the meaning in the word decides. Take 发: in 出发 it means to set out and is 發, in 头发 it means hair and is 髮. This topic chooses the traditional form in words and in phrases.",
      "有些简化字对应两个繁体字，要看在词语里的意思。比如“发”：在“出发”里是出发的意思，写作“發”；在“头发”里是头发的意思，写作“髮”。这个专题在词语和短语里选出正确的繁体字。",
    ),
    prerequisites: ["traditional-components"],
    strand: "characters",
    points: [
      {
        suffix: "characters",
        title: t("Which Traditional Character", "选择繁体字"),
        explanation: t(
          "Some simplified characters merged two traditional ones, so the traditional form depends on the meaning: 发 is 發 in 出發 (set out) but 髮 in 頭髮 (hair); 干 is 乾 in 乾淨 (dry, clean) but 幹 in 幹活 (to do); 后 is 後 in 後面 (behind) but stays 后 in 皇后 (queen). Ask what the character means in the word, then choose.\n\n> **Watch out.** The simplified character may itself be one of the traditional forms: 后 stays 后 in 皇后, and only 後面 uses 後.",
          "有些简化字是由两个繁体字合并而来的，所以繁体写法要看意思：“发”在“出發”里是“發”，在“頭髮”里是“髮”；“干”在“乾淨”里是“乾”，在“幹活”里是“幹”；“后”在“後面”里是“後”，在“皇后”里还是“后”。先想一想这个字在词语里是什么意思，再选择。\n\n> **注意。** 简化字本身也可能就是其中一个繁体字：“皇后”的“后”还是“后”，只有“後面”才用“後”。",
        ),
        question: t("In this word, how is the character written in traditional form?", "在这个词语里，这个字的繁体怎么写？"),
        items: shared,
        why: sharedWhy,
        whyNot: sharedWhyNot,
      },
      {
        suffix: "phrases",
        title: t("Phrases", "短语"),
        explanation: t(
          "When a phrase has two such characters, decide each by its own meaning: in 頭髮乾了 the hair is 髮 and dry is 乾.\n\n> **Watch out.** Do not choose by the character alone: 只 is 隻 in 一隻手錶, a measure word, but stays 只 in 只有, “only”.",
          "一个短语里有两个这样的字时，要按各自的意思分别判断：“头发干了”写作“頭髮乾了”，头发的“发”是“髮”，干燥的“干”是“乾”。\n\n> **注意。** 不能只看字本身：“一只手表”的“只”是量词，写作“隻”；“只有”的“只”还是“只”。",
        ),
        question: t("How is this phrase written in traditional characters?", "这个短语用繁体字怎么写？"),
        items: sharedPhrases,
        why: phraseWhy,
        whyNot: phraseWhyNot,
      },
    ],
  }),
];
