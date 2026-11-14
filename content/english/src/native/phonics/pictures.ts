// Phonics: line drawings of the words a young reader decodes, one per word: short-vowel words, then words with a
// digraph. Each is an SVG drawn in currentColor with no words in it, so a child must read the word to match it; only
// the numbers 6 and 10 are written.

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

const waves = (y: number) =>
  `M6 ${y} Q16 ${y - 6} 26 ${y} Q36 ${y + 6} 46 ${y} Q56 ${y - 6} 66 ${y} Q76 ${y + 6} 86 ${y} Q91 ${y - 3} 96 ${y}`;

const digraphDrawings: Record<string, readonly [body: string, en: string, zh: string]> = {
  ship: [
    `<path d="M10 62 L90 62 L78 80 L22 80 Z M50 62 L50 12"/><path ${accent} d="M53 16 L53 56 L82 56 Z M47 22 L47 56 L22 56 Z"/><path d="${waves(90)}"/>`,
    "A sailing ship on the waves.",
    "海浪上的一艘帆船。",
  ],
  shell: [
    `<path d="M50 82 Q22 62 16 40 Q28 14 50 14 Q72 14 84 40 Q78 62 50 82 Z"/><path d="M50 82 L24 30 M50 82 L36 19 M50 82 L50 15 M50 82 L64 19 M50 82 L76 30"/><path ${accent} d="M40 82 L60 82 L56 92 L44 92 Z"/>`,
    "A seashell.",
    "一个扇贝壳。",
  ],
  fish: [
    `<path d="M14 50 Q40 20 70 50 Q40 80 14 50 Z M70 50 L90 32 L90 68 Z"/>${dot(28, 46)}<path ${accent} d="M36 34 Q46 22 56 34 M40 60 Q46 66 52 62"/>`,
    "A fish.",
    "一条鱼。",
  ],
  dish: [
    `<ellipse cx="50" cy="58" rx="42" ry="16"/><ellipse cx="50" cy="56" rx="28" ry="9"/><path ${accent} d="M38 54 Q44 46 50 54 Q56 46 62 54"/><path d="M40 36 Q36 28 42 22 M50 36 Q46 28 52 20 M60 36 Q56 28 62 22"/>`,
    "A dish of hot food.",
    "一盘热腾腾的菜。",
  ],
  shed: [
    `<path ${accent} d="M14 38 L86 54"/><path d="M20 40 L20 88 L80 88 L80 53 M6 88 L94 88"/><rect x="30" y="56" width="20" height="32"/><path d="M37 56 L37 88 M43 56 L43 88"/><rect x="58" y="60" width="14" height="12"/>`,
    "A garden shed with a sloping roof.",
    "一间斜屋顶的花园小棚。",
  ],
  chick: [
    `<ellipse cx="54" cy="62" rx="26" ry="20"/><circle cx="38" cy="36" r="13"/><path ${accent} d="M26 34 L16 38 L26 42 Z" fill="currentColor"/>${dot(35, 33)}<path d="M50 60 Q62 52 70 64 M46 82 L44 94 M60 82 L62 94 M38 94 L48 94 M58 94 L68 94 M38 23 Q40 16 44 20"/>`,
    "A baby chick.",
    "一只小鸡。",
  ],
  chin: [
    `<path d="M26 34 Q26 8 50 8 Q74 8 74 34 L74 50 Q74 78 50 80 Q26 78 26 50 Z"/>${dot(41, 38)}${dot(59, 38)}<path d="M50 42 L47 54 L52 54 M41 64 Q50 70 59 64"/><path ${accent} d="M92 94 L58 84 M58 84 L68 80 M58 84 L66 91"/>`,
    "A face, with an arrow pointing to its chin.",
    "一张脸，箭头指着下巴。",
  ],
  chips: [
    `<path d="M33 30 L31 8 L37 8 L39 30 M42 30 L42 4 L48 4 L48 30 M51 30 L53 6 L59 7 L57 30 M60 30 L64 10 L70 12 L66 30"/><path ${accent} d="M26 34 L74 34 L66 92 L34 92 Z"/><path d="M30 34 Q50 46 70 34"/>`,
    "Chips, also called fries, in a box.",
    "一盒薯条。",
  ],
  bench: [
    `<rect x="12" y="22" width="76" height="9" rx="2"/><rect x="12" y="36" width="76" height="9" rx="2"/><path ${accent} d="M8 58 L92 58" stroke-width="7"/><path d="M22 31 L22 36 M78 31 L78 36 M22 45 L22 58 M78 45 L78 58 M20 58 L16 86 M80 58 L84 86 M30 58 L30 74 M70 58 L70 74"/>`,
    "A park bench.",
    "公园里的一张长椅。",
  ],
  bath: [
    `<path d="M8 50 L92 50 L86 74 Q82 82 72 82 L28 82 Q18 82 14 74 Z M26 82 L22 92 M74 82 L78 92 M82 50 L82 26 Q82 18 74 18 L66 18 L66 26 M62 26 L70 26"/><path ${accent} d="M14 58 Q24 54 34 58 Q44 62 54 58 Q64 54 74 58 Q80 60 86 58"/><path d="M66 32 L66 36 M66 42 L66 46"/>`,
    "A bath being filled from its tap.",
    "一个正从水龙头放水的浴缸。",
  ],
  moth: [
    `<ellipse cx="50" cy="52" rx="4" ry="22" fill="currentColor"/><path d="M48 32 Q42 18 34 16 M52 32 Q58 18 66 16 M34 16 L30 20 M34 16 L36 11 M66 16 L70 20 M66 16 L64 11 M46 40 Q20 16 10 38 Q12 56 46 54 Z M54 40 Q80 16 90 38 Q88 56 54 54 Z M46 58 Q24 62 28 82 Q40 86 47 64 M54 58 Q76 62 72 82 Q60 86 53 64"/><circle ${accent} cx="28" cy="40" r="5"/><circle ${accent} cx="72" cy="40" r="5"/>`,
    "A moth with wide wings and feathery feelers.",
    "一只翅膀宽大、触角像羽毛的飞蛾。",
  ],
  path: [
    `<path d="M14 96 Q36 70 44 46 Q48 34 50 26 M86 96 Q64 70 58 46 Q54 34 52 26"/><ellipse ${accent} cx="50" cy="84" rx="9" ry="4"/><ellipse ${accent} cx="51" cy="66" rx="7" ry="3"/><ellipse ${accent} cx="51" cy="50" rx="5" ry="2.5"/><path d="M4 30 Q30 20 46 26 M56 26 Q74 20 96 30 M14 60 L12 52 M16 60 L18 52 M84 64 L82 56 M86 64 L88 56"/><circle cx="80" cy="12" r="6"/>`,
    "A path of stepping stones leading away over the grass.",
    "一条铺着踏脚石、穿过草地伸向远处的小路。",
  ],
  duck: [
    `<path d="M56 48 Q52 62 30 60 Q16 60 14 68 Q18 86 50 86 Q80 86 84 66 Q84 56 74 50"/><circle cx="64" cy="36" r="14"/><path ${accent} d="M76 34 L92 38 L76 44 Z" fill="currentColor"/>${dot(66, 32)}<path d="M36 70 Q50 62 62 72"/><path d="${waves(94)}"/>`,
    "A duck on the water.",
    "水面上的一只鸭子。",
  ],
  sock: [
    `<path d="M34 8 L60 8 L60 54 Q60 62 68 65 L82 70 Q94 76 88 87 Q82 94 70 89 L42 76 Q34 72 34 62 Z"/><path ${accent} d="M34 20 L60 20 M34 27 L60 27"/><path d="M76 72 Q72 80 76 88"/>`,
    "A sock.",
    "一只袜子。",
  ],
  rock: [
    `<path d="M14 80 L22 54 L40 38 L62 34 L80 46 L90 80 Z"/><path ${accent} d="M40 38 L46 54 L38 64 M62 34 L66 50"/><path d="M4 80 L96 80 M20 90 L30 90 M60 90 L76 90"/>`,
    "A big rock on the ground.",
    "地上的一块大石头。",
  ],
  lock: [
    `<path d="M34 46 L34 30 Q34 12 50 12 Q66 12 66 30 L66 46"/><rect ${accent} x="22" y="46" width="56" height="42" rx="5"/><circle cx="50" cy="62" r="5" fill="currentColor"/><path d="M50 66 L50 77" stroke-width="5"/>`,
    "A padlock.",
    "一把挂锁。",
  ],
  neck: [
    `<path d="M42 96 L46 32 M62 96 L58 30 Q58 16 44 15 Q26 15 16 24 Q12 32 24 35 Q36 37 46 32 M50 16 L49 6 M57 19 L61 9 M58 24 L70 20 L62 30"/>${dot(49, 6, 3)}${dot(61, 9, 3)}${dot(42, 22, 2.5)}${dot(20, 28, 1.5)}<path ${accent} d="M48 46 L56 46 M47 60 L57 60 M46 74 L58 74 M45 88 L59 88"/>`,
    "A giraffe with a very long neck.",
    "一只脖子很长的长颈鹿。",
  ],
  shelf: [
    `<rect x="8" y="58" width="84" height="7"/><path d="M20 65 L20 80 L32 65 M80 65 L80 80 L68 65"/><rect x="16" y="30" width="8" height="28"/><rect x="26" y="34" width="8" height="24"/><path ${accent} d="M37 58 L44 30 L51 32 L44 58"/><path d="M62 58 L60 44 L80 44 L78 58 Z M70 44 Q62 30 66 22 M70 44 Q78 30 76 24"/>`,
    "A shelf on a wall, with books and a plant.",
    "墙上的一块搁板，上面放着书和一盆植物。",
  ],
  brush: [
    `<path d="M88 12 L52 48 M84 8 L92 16 L56 52 L48 44 Z"/><path ${accent} d="M48 44 L56 52 Q40 80 14 90 Q22 62 48 44 Z" fill="currentColor"/>`,
    "A paintbrush with paint on it.",
    "一支沾着颜料的画笔。",
  ],
  shop: [
    `<path d="M14 40 L14 90 L86 90 L86 40 M6 90 L94 90"/><path ${accent} d="M10 22 L90 22 L94 40 L6 40 Z M26 22 L22 40 M42 22 L40 40 M58 22 L60 40 M74 22 L78 40"/><rect x="22" y="52" width="30" height="24"/><path d="M62 90 L62 52 L78 52 L78 90"/>${dot(66, 72, 2)}<circle cx="32" cy="70" r="4"/><circle cx="42" cy="70" r="4"/>`,
    "A small shop with a striped awning.",
    "一家挂着条纹遮阳篷的小商店。",
  ],
  chest: [
    `<rect x="16" y="46" width="68" height="40" rx="2"/><path d="M16 46 Q16 22 50 22 Q84 22 84 46"/><path ${accent} d="M28 24 L28 86 M72 24 L72 86"/><rect x="44" y="40" width="12" height="14" fill="currentColor"/>`,
    "A treasure chest.",
    "一个宝箱。",
  ],
  chimp: [
    `<circle cx="18" cy="44" r="10"/><circle cx="82" cy="44" r="10"/><path d="M28 40 Q28 12 50 12 Q72 12 72 40 Q76 70 50 86 Q24 70 28 40 Z"/><path ${accent} d="M34 36 Q42 28 50 36 Q58 28 66 36 Q68 46 50 46 Q32 46 34 36 Z"/>${dot(42, 38, 2.5)}${dot(58, 38, 2.5)}<ellipse cx="50" cy="64" rx="15" ry="12"/>${dot(46, 58, 1.5)}${dot(54, 58, 1.5)}<path d="M42 68 Q50 72 58 68"/>`,
    "A chimp's face.",
    "一张黑猩猩的脸。",
  ],
  bunch: [
    `${[
      [38, 30],
      [52, 30],
      [66, 30],
      [32, 44],
      [46, 44],
      [60, 44],
      [39, 58],
      [53, 58],
      [46, 72],
    ]
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7"/>`)
      .join("")}<path d="M52 23 L56 8"/><path ${accent} d="M56 12 Q70 2 82 12 Q70 22 56 12 Z"/>`,
    "A bunch of grapes.",
    "一串葡萄。",
  ],
  cloth: [
    `<path d="M14 30 L80 30 L86 76 L20 76 Z M20 76 Q34 84 44 76 M80 30 Q90 26 86 76"/><path ${accent} d="M30 30 L36 76 M48 30 L52 76 M66 30 L68 76 M16 45 L82 45 M18 60 L84 60"/>`,
    "A folded cloth with a checked pattern.",
    "一块叠好的格子布。",
  ],
  sack: [
    `<path d="M40 26 Q18 40 18 66 Q18 90 50 90 Q82 90 82 66 Q82 40 60 26"/><path d="M40 26 L36 14 L50 20 L64 14 L60 26"/><path ${accent} d="M38 28 L62 28" stroke-width="5"/><path d="M34 58 L40 52 M44 70 L52 64 M60 54 L66 48"/>`,
    "A sack tied at the top.",
    "一个顶部扎紧的麻袋。",
  ],
  tick: [
    `<rect x="14" y="14" width="72" height="72" rx="8"/><path ${accent} d="M28 50 L44 66 L74 32" stroke-width="8"/>`,
    "A tick in a box, the mark for a right answer.",
    "方框里的一个对勾，表示答对了。",
  ],
  clock: [
    `<circle cx="50" cy="50" r="38"/><path d="${spokes(50, 50, 30, 35, 12)}"/><path ${accent} d="M50 50 L50 24 M50 50 L66 58"/>${dot(50, 50, 3)}`,
    "A clock.",
    "一个钟。",
  ],
  truck: [
    `<rect x="6" y="30" width="56" height="38"/><path d="M62 42 L82 42 L94 56 L94 68 L62 68 Z"/><path ${accent} d="M68 46 L80 46 L88 56 L68 56 Z"/><circle cx="24" cy="72" r="8" fill="currentColor"/><circle cx="78" cy="72" r="8" fill="currentColor"/>`,
    "A truck.",
    "一辆卡车。",
  ],
  brick: [
    `<path ${accent} d="M8 50 L68 50 L68 78 L8 78 Z"/><path d="M8 50 L30 34 L90 34 L68 50 M90 34 L90 62 L68 78"/><path d="M4 86 L94 86"/>`,
    "A brick.",
    "一块砖。",
  ],
  kick: [
    `<path d="M12 6 L34 54 M28 2 L50 46 M34 54 Q32 68 46 70 L68 70 Q78 68 74 59 Q70 52 60 52 L50 46"/><circle ${accent} cx="88" cy="56" r="10"/><path d="M76 46 L72 42 M78 40 L76 34"/>`,
    "A foot kicking a ball.",
    "一只正在踢球的脚。",
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

/** digraphPictureWords are the words with a digraph that have a picture, grouped by the digraph. */
export const digraphPictureWords: Record<"sh" | "ch" | "th" | "ck", readonly string[]> = {
  sh: ["ship", "shell", "fish", "dish", "shed", "shelf", "brush", "shop"],
  ch: ["chick", "chin", "chips", "bench", "chest", "chimp", "bunch"],
  th: ["bath", "moth", "path", "cloth"],
  ck: ["duck", "sock", "rock", "lock", "neck", "sack", "tick", "clock", "truck", "brick", "kick"],
};

/** allDigraphPictureWords are the words with a digraph that have a picture, in the order of the digraphs. */
export const allDigraphPictureWords: readonly string[] = Object.values(digraphPictureWords).flat();

/** picture is the drawing of a word, with what it shows for screen readers. */
export function picture(word: string): Figure {
  const drawn = drawings[word] ?? digraphDrawings[word];
  if (!drawn) throw new Error(`no picture of ${word}`);
  const [body, en, zh] = drawn;
  return { svg: svg(body), alt: t(en, zh) };
}

/** pictureName is what the picture of a word shows, as words in every locale. */
export function pictureName(word: string): Text {
  return picture(word).alt;
}

for (const word of [...allPictureWords, ...allDigraphPictureWords]) picture(word);
for (const word of Object.keys(drawings)) if (!allPictureWords.includes(word)) throw new Error(`picture of ${word} is in no list`);
for (const word of Object.keys(digraphDrawings)) {
  if (!allDigraphPictureWords.includes(word)) throw new Error(`picture of ${word} is in no list`);
}
