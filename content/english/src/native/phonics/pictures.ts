// Phonics: line drawings of the short-vowel words a young reader decodes, one per word. Each is an SVG drawn in
// currentColor with no words in it, so a child must read the word to match it; only the numbers 6 and 10 are written.

import { type Figure, type Text, t } from "@ga/content";

const svg = (body: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;

const accent = `class="accent"`;
const dot = (x: number, y: number, r = 3) => `<circle cx="${x}" cy="${y}" r="${r}" fill="currentColor" stroke="none"/>`;
const round = (v: number) => Math.round(v * 10) / 10;

/** spokes draws n lines out from a center, from radius inner to radius outer. */
const spokes = (cx: number, cy: number, inner: number, outer: number, n: number) =>
  Array.from({ length: n }, (_, i) => {
    const a = (2 * Math.PI * i) / n;
    const [c, s] = [Math.cos(a), Math.sin(a)];
    return `M${round(cx + inner * c)} ${round(cy + inner * s)} L${round(cx + outer * c)} ${round(cy + outer * s)}`;
  }).join(" ");

/** ring draws a polygon of n corners at radius r around a center. */
const ring = (cx: number, cy: number, r: number, n: number) =>
  `<polygon points="${Array.from({ length: n }, (_, i) => {
    const a = (2 * Math.PI * i) / n;
    return `${round(cx + r * Math.cos(a))},${round(cy + r * Math.sin(a))}`;
  }).join(" ")}"/>`;

/** dots draws count dots in rows of five, for the pictures of numbers. */
const dots = (count: number, top: number) =>
  Array.from({ length: count }, (_, i) => dot(22 + (i % 5) * 14, top + Math.floor(i / 5) * 12, 4)).join("");

const number = (n: number) =>
  `<text x="50" y="58" text-anchor="middle" font-size="46" font-weight="bold" fill="currentColor" stroke="none">${n}</text>`;

const drawings: Record<string, readonly [body: string, en: string, zh: string]> = {
  cat: [
    `<circle cx="50" cy="56" r="27"/><path d="M28 42 L30 15 L46 30 M72 42 L70 15 L54 30"/>${dot(40, 52)}${dot(60, 52)}<path d="M47 62 L53 62 L50 66 Z" fill="currentColor"/><path d="M50 66 Q45 72 41 69 M50 66 Q55 72 59 69 M30 62 L12 58 M30 67 L12 71 M70 62 L88 58 M70 67 L88 71"/>`,
    "A cat.",
    "一只猫。",
  ],
  hat: [
    `<rect x="30" y="18" width="40" height="46" rx="3"/><ellipse cx="50" cy="66" rx="34" ry="7"/><path ${accent} d="M31 54 L69 54" stroke-width="6"/>`,
    "A tall hat.",
    "一顶高帽子。",
  ],
  cap: [
    `<path d="M22 60 Q22 26 50 26 Q78 26 78 60 Z"/><path d="M78 60 Q96 62 96 70 Q72 72 52 64"/><path d="M50 26 Q46 44 50 60"/>${dot(50, 25)}`,
    "A cap with a peak.",
    "一顶鸭舌帽。",
  ],
  map: [
    `<path d="M15 25 L38 18 L62 25 L85 18 L85 78 L62 85 L38 78 L15 85 Z"/><path d="M38 18 L38 78 M62 25 L62 85"/><path d="M22 72 Q34 50 50 58 Q64 66 70 42" stroke-dasharray="4 6"/><path ${accent} d="M68 30 L80 42 M80 30 L68 42"/>`,
    "A folded map with a path to a cross.",
    "一张折起的地图，上面有一条通往叉号的路线。",
  ],
  fan: [
    `<circle cx="50" cy="40" r="28"/>${[0, 120, 240].map((a) => `<path ${accent} d="M50 40 Q38 20 50 15 Q62 20 50 40 Z" transform="rotate(${a} 50 40)"/>`).join("")}<circle cx="50" cy="40" r="4"/><path d="M50 68 L50 86 M34 88 L66 88"/>`,
    "An electric fan.",
    "一台电风扇。",
  ],
  van: [
    `<path d="M8 70 L8 34 Q8 28 15 28 L64 28 Q71 28 76 36 L90 52 L90 70 Z"/><rect x="15" y="35" width="20" height="14"/><rect x="41" y="35" width="20" height="14"/><path d="M67 35 L78 50 L67 50 Z"/><circle cx="28" cy="72" r="9" fill="currentColor"/><circle cx="72" cy="72" r="9" fill="currentColor"/>`,
    "A van.",
    "一辆厢式车。",
  ],
  pan: [
    `<circle cx="38" cy="55" r="26"/><circle cx="38" cy="55" r="19"/><rect x="63" y="51" width="32" height="8" rx="4" fill="currentColor"/>`,
    "A frying pan.",
    "一口平底锅。",
  ],
  bag: [`<path d="M22 40 L78 40 L84 90 L16 90 Z"/><path d="M36 40 Q36 16 50 16 Q64 16 64 40"/>`, "A shopping bag.", "一个购物袋。"],
  can: [
    `<ellipse cx="50" cy="22" rx="22" ry="6"/><path d="M28 22 L28 80 Q50 92 72 80 L72 22"/><path ${accent} d="M28 40 Q50 50 72 40 L72 62 Q50 72 28 62 Z"/>`,
    "A tin can.",
    "一个罐头。",
  ],
  rat: [
    `<path d="M75 62 Q75 45 52 45 Q35 45 28 55 L10 63 Q28 73 52 74 Q75 74 75 62 Z"/><circle cx="35" cy="47" r="7"/>${dot(24, 59, 2.5)}<path d="M75 64 Q92 66 90 80 Q88 90 74 88 M40 74 L38 81 M62 74 L64 81 M11 63 L3 58 M11 64 L3 69"/>`,
    "A rat with a long tail.",
    "一只长尾巴的老鼠。",
  ],
  bed: [
    `<path d="M12 28 L12 86 M88 56 L88 86 M12 70 L88 70"/><rect x="12" y="54" width="76" height="16"/><ellipse cx="27" cy="48" rx="11" ry="5"/><path ${accent} d="M42 54 L42 46 L88 46 L88 56"/>`,
    "A bed with a pillow.",
    "一张有枕头的床。",
  ],
  hen: [
    `<path d="M30 45 Q24 82 55 82 Q86 80 82 52 L90 38 L76 50 Q62 56 56 42 Q52 25 40 25 Q30 27 30 45 Z"/><path ${accent} d="M35 26 Q36 15 41 22 Q44 13 48 24" fill="currentColor"/><path d="M30 35 L20 40 L30 43"/>${dot(38, 34)}<path d="M48 82 L46 94 M62 82 L64 94 M41 94 L51 94 M59 94 L69 94 M50 58 Q62 72 74 60"/>`,
    "A hen.",
    "一只母鸡。",
  ],
  pen: [
    `<g transform="rotate(35 50 50)"><rect x="44" y="8" width="12" height="62" rx="2"/><path d="M44 70 L50 90 L56 70"/><path d="M44 26 L56 26 M56 12 L61 12 L61 38"/></g>`,
    "A pen.",
    "一支笔。",
  ],
  net: [
    `<circle cx="62" cy="30" r="18"/><path d="M44 30 Q48 70 62 74 Q76 70 80 30"/><path d="M49 44 L75 44 M52 56 L72 56 M62 12 L62 74"/><path d="M44 30 L12 92"/>`,
    "A net on a long handle.",
    "一个长柄网兜。",
  ],
  web: [
    `<path d="${spokes(50, 50, 0, 44, 8)}"/>${ring(50, 50, 12, 8)}${ring(50, 50, 24, 8)}${ring(50, 50, 36, 8)}`,
    "A spider's web.",
    "一张蜘蛛网。",
  ],
  jet: [
    `<path d="M50 6 Q57 10 57 28 L57 70 L67 84 L50 80 L33 84 L43 70 L43 28 Q43 10 50 6 Z"/><path d="M43 38 L8 58 L8 65 L43 55 Z M57 38 L92 58 L92 65 L57 55 Z"/>`,
    "A jet plane seen from above.",
    "从上方看到的一架喷气式飞机。",
  ],
  leg: [
    `<path d="M36 6 Q32 30 40 48 Q44 62 40 80 L38 90 L80 90 Q82 80 62 78 Q58 62 60 48 Q68 30 64 6"/><path d="M42 48 Q50 54 58 48"/>`,
    "A leg and a foot.",
    "一条腿和一只脚。",
  ],
  ten: [`${number(10)}${dots(10, 74)}`, "The number ten, with ten dots.", "数字十，下面有十个点。"],
  pig: [
    `<circle cx="50" cy="54" r="28"/><path d="M28 34 L24 14 L42 27 M72 34 L76 14 L58 27"/><ellipse ${accent} cx="50" cy="62" rx="12" ry="9"/>${dot(46, 62, 2.5)}${dot(54, 62, 2.5)}${dot(39, 46)}${dot(61, 46)}`,
    "A pig's face.",
    "一张小猪的脸。",
  ],
  pin: [
    `<path ${accent} d="M38 14 L62 14 L58 22 L58 40 Q70 46 70 52 L30 52 Q30 46 42 40 L42 22 Z"/><path d="M50 52 L50 90"/>`,
    "A push pin.",
    "一枚图钉。",
  ],
  six: [`${number(6)}${dots(6, 74)}`, "The number six, with six dots.", "数字六，下面有六个点。"],
  fin: [
    `<path ${accent} d="M30 64 Q52 54 58 14 Q66 44 84 64 Z" fill="currentColor"/><path d="M6 66 Q16 58 26 66 Q36 74 46 66 Q56 58 66 66 Q76 74 86 66 Q91 62 96 66 M6 80 Q16 72 26 80 Q36 88 46 80 Q56 72 66 80 Q76 88 86 80 Q91 76 96 80"/>`,
    "A shark's fin above the waves.",
    "露出水面的鲨鱼鳍。",
  ],
  bin: [
    `<path d="M28 30 L72 30 L66 88 L34 88 Z M20 30 L80 30 M42 30 L42 22 L58 22 L58 30 M42 40 L44 80 M50 40 L50 80 M58 40 L56 80"/>`,
    "A rubbish bin.",
    "一个垃圾桶。",
  ],
  bib: [
    `<path d="M32 18 Q32 40 50 40 Q68 40 68 18 L82 24 Q92 50 82 72 Q70 92 50 92 Q30 92 18 72 Q8 50 18 24 Z"/><path d="M32 18 L24 8 M68 18 L76 8"/><circle ${accent} cx="50" cy="66" r="9"/>`,
    "A baby's bib.",
    "一个婴儿围嘴。",
  ],
  fig: [
    `<path ${accent} d="M50 26 Q60 40 76 56 Q86 84 50 88 Q14 84 24 56 Q40 40 50 26 Z"/><path d="M50 26 L50 14 M46 14 L54 14 M50 50 L50 56 M42 64 L44 68 M58 64 L56 68 M50 72 L50 76"/>`,
    "A fig.",
    "一个无花果。",
  ],
  dog: [
    `<circle cx="50" cy="52" r="24"/><path ${accent} d="M30 36 Q12 38 15 66 Q24 72 31 56 M70 36 Q88 38 85 66 Q76 72 69 56" fill="currentColor"/>${dot(41, 47)}${dot(59, 47)}<ellipse cx="50" cy="64" rx="11" ry="8"/><ellipse cx="50" cy="60" rx="4" ry="3" fill="currentColor"/><path d="M50 63 L50 70"/>`,
    "A dog's face with floppy ears.",
    "一张耷拉着耳朵的小狗的脸。",
  ],
  pot: [
    `<path d="M22 40 L78 40 L74 82 Q50 90 26 82 Z M18 40 Q50 22 82 40 M22 52 L10 52 M78 52 L90 52"/><circle cx="50" cy="27" r="4"/>`,
    "A cooking pot with a lid.",
    "一口带盖的锅。",
  ],
  box: [
    `<path d="M18 42 L60 42 L60 86 L18 86 Z M18 42 L38 22 L80 22 L60 42 M60 86 L80 66 L80 22"/><path ${accent} d="M28 32 L70 32"/>`,
    "A box.",
    "一个盒子。",
  ],
  fox: [
    `<path ${accent} d="M18 30 L30 6 L42 28 Q50 25 58 28 L70 6 L82 30 Q84 52 50 82 Q16 52 18 30 Z"/><path d="M22 42 Q40 50 50 80 Q60 50 78 42"/>${dot(38, 42)}${dot(62, 42)}${dot(50, 76)}`,
    "A fox's face with pointed ears.",
    "一张尖耳朵的狐狸的脸。",
  ],
  mop: [
    `<path d="M72 4 L48 56 M36 54 L60 60 L58 66 L34 60 Z M36 60 Q28 76 20 90 M42 62 Q36 80 32 94 M48 63 Q46 80 44 95 M54 64 Q56 80 58 94 M58 65 Q66 78 70 90"/>`,
    "A mop.",
    "一把拖把。",
  ],
  log: [
    `<ellipse cx="25" cy="52" rx="11" ry="18"/><ellipse ${accent} cx="25" cy="52" rx="5" ry="9"/><path d="M25 34 L78 34 Q90 52 78 70 L25 70 M42 44 L62 44 M48 60 L70 60"/>`,
    "A log.",
    "一根木头。",
  ],
  top: [
    `<path d="M14 42 Q50 26 86 42 Q72 62 50 90 Q28 62 14 42 Z"/><path ${accent} d="M20 50 Q50 38 80 50"/><path d="M50 34 L50 10 M44 10 L56 10"/>`,
    "A spinning top.",
    "一个陀螺。",
  ],
  bus: [
    `<rect x="6" y="24" width="88" height="50" rx="6"/>${[12, 30, 48, 66].map((x) => `<rect x="${x}" y="32" width="13" height="14"/>`).join("")}<rect x="82" y="32" width="8" height="36"/><path d="M6 56 L80 56"/><circle cx="24" cy="76" r="8" fill="currentColor"/><circle cx="72" cy="76" r="8" fill="currentColor"/>`,
    "A bus.",
    "一辆公共汽车。",
  ],
  cup: [
    `<path d="M26 36 L74 36 Q74 70 50 72 Q26 70 26 36 Z M74 42 Q90 42 88 54 Q86 62 70 60 M14 78 Q50 88 86 78 M42 28 Q38 20 42 12 M58 28 Q54 20 58 12"/>`,
    "A cup on a saucer.",
    "放在茶托上的一只杯子。",
  ],
  sun: [`<circle ${accent} cx="50" cy="50" r="18"/><path d="${spokes(50, 50, 26, 42, 8)}"/>`, "The sun.", "太阳。"],
  bug: [
    `<circle cx="50" cy="56" r="28"/><path d="M36 33 Q50 16 64 33 M50 30 L50 84 M44 22 L38 10 M56 22 L62 10 M22 50 L12 46 M22 62 L12 64 M78 50 L88 46 M78 62 L88 64"/>${dot(38, 48, 5)}${dot(62, 48, 5)}${dot(37, 67, 5)}${dot(63, 67, 5)}`,
    "A ladybird.",
    "一只瓢虫。",
  ],
  tub: [
    `<path d="M10 46 L90 46 L84 72 Q80 80 70 80 L30 80 Q20 80 16 72 Z M26 80 L24 90 M74 80 L76 90 M18 46 L18 28 Q18 22 26 22 L30 22 L30 28"/><circle cx="42" cy="40" r="5"/><circle cx="54" cy="38" r="6"/><circle cx="66" cy="41" r="4"/>`,
    "A bathtub with bubbles.",
    "一个冒着泡泡的浴缸。",
  ],
  rug: [
    `<rect x="18" y="25" width="64" height="50"/><path ${accent} d="M50 34 L66 50 L50 66 L34 50 Z"/><path d="${[30, 38, 46, 54, 62, 70].map((y) => `M18 ${y} L10 ${y} M82 ${y} L90 ${y}`).join(" ")}"/>`,
    "A rug with a fringe.",
    "一块带流苏的小地毯。",
  ],
  hut: [
    `<path d="M25 50 L25 88 L75 88 L75 50 M43 88 L43 66 L57 66 L57 88"/><path ${accent} d="M14 52 L50 18 L86 52 Z"/>`,
    "A small hut.",
    "一间小屋。",
  ],
};

/** pictureWords are the words that have a picture, grouped by their short vowel. */
export const pictureWords: Record<"a" | "e" | "i" | "o" | "u", readonly string[]> = {
  a: ["cat", "hat", "cap", "map", "fan", "van", "pan", "bag", "can", "rat"],
  e: ["bed", "hen", "pen", "net", "web", "jet", "leg", "ten"],
  i: ["pig", "pin", "six", "fin", "bin", "bib", "fig"],
  o: ["dog", "pot", "box", "fox", "mop", "log", "top"],
  u: ["bus", "cup", "sun", "bug", "tub", "rug", "hut"],
};

/** allPictureWords are the words that have a picture, in vowel order. */
export const allPictureWords: readonly string[] = Object.values(pictureWords).flat();

/** picture is the drawing of a word, with what it shows for screen readers. */
export function picture(word: string): Figure {
  const drawn = drawings[word];
  if (!drawn) throw new Error(`no picture of ${word}`);
  const [body, en, zh] = drawn;
  return { svg: svg(body), alt: t(en, zh) };
}

/** pictureName is what the picture of a word shows, as words in every locale. */
export function pictureName(word: string): Text {
  return picture(word).alt;
}

for (const word of allPictureWords) picture(word);
for (const word of Object.keys(drawings)) if (!allPictureWords.includes(word)) throw new Error(`picture of ${word} is in no list`);
