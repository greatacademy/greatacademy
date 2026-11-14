// Phonics: line drawings of the words a young reader decodes, one per word: short-vowel words, words with a digraph,
// a consonant blend, a silent e or a vowel team. Each is an SVG drawn in currentColor with no words in it, so a child
// must read the word to match it; only the numbers 6 and 10 are written.

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

const blendDrawings: Record<string, readonly [body: string, en: string, zh: string]> = {
  frog: [
    `<path d="M20 70 Q16 46 34 38 Q50 32 66 38 Q84 46 80 70 Q50 82 20 70 Z"/><circle cx="35" cy="32" r="9"/><circle cx="65" cy="32" r="9"/>${dot(35, 32, 3.5)}${dot(65, 32, 3.5)}<path d="M32 54 Q50 64 68 54 M20 70 Q8 74 8 86 L28 86 M80 70 Q92 74 92 86 L72 86"/><path ${accent} d="M34 72 Q50 78 66 72"/>`,
    "A frog.",
    "一只青蛙。",
  ],
  crab: [
    `<ellipse ${accent} cx="50" cy="60" rx="24" ry="14"/><path d="M42 47 L40 34 M58 47 L60 34"/>${dot(40, 32, 3.5)}${dot(60, 32, 3.5)}<path d="M28 54 Q16 48 18 36 M72 54 Q84 48 82 36 M18 36 Q6 30 10 18 L20 26 L18 14 Q28 22 18 36 Z M82 36 Q94 30 90 18 L80 26 L82 14 Q72 22 82 36 Z M30 66 L14 72 M32 70 L18 82 M70 66 L86 72 M68 70 L82 82"/>`,
    "A crab with big claws.",
    "一只有大钳子的螃蟹。",
  ],
  drum: [
    `<ellipse cx="50" cy="44" rx="30" ry="9"/><path d="M20 44 L20 78 Q50 92 80 78 L80 44"/><path ${accent} d="M20 50 L32 82 L44 52 L56 84 L68 52 L80 80"/><path d="M38 34 L18 10 M62 34 L82 10"/>${dot(17, 9, 4)}${dot(83, 9, 4)}`,
    "A drum with two sticks.",
    "一面鼓和两根鼓槌。",
  ],
  flag: [
    `<path d="M24 94 L24 10 M14 94 L36 94"/>${dot(24, 8, 4)}<path ${accent} d="M24 16 Q42 8 58 16 Q74 24 90 16 L90 50 Q74 58 58 50 Q42 42 24 50 Z"/>`,
    "A flag on a pole.",
    "旗杆上的一面旗。",
  ],
  sled: [
    `<path d="M8 72 L80 72 Q94 72 92 58 M22 72 L22 60 M68 72 L68 60"/><rect ${accent} x="14" y="50" width="64" height="10" rx="3"/><path d="M14 55 Q6 50 4 40"/><path d="M4 84 Q30 78 50 84 Q70 90 96 84"/>`,
    "A sled on the snow.",
    "雪地上的一架雪橇。",
  ],
  plug: [
    `<rect x="30" y="38" width="40" height="34" rx="6"/><path d="M40 38 L40 18 M60 38 L60 18" stroke-width="6"/><path d="M50 72 L50 80 Q50 94 70 92 Q88 90 92 78"/><path ${accent} d="M38 54 L62 54"/>`,
    "An electric plug.",
    "一个电源插头。",
  ],
  plum: [
    `<circle ${accent} cx="50" cy="60" r="28"/><path d="M50 34 Q40 60 50 88 M50 33 L54 16"/><path d="M54 20 Q66 8 80 16 Q68 28 54 20 Z"/>`,
    "A plum with a leaf.",
    "一个带叶子的李子。",
  ],
  clam: [
    `<path d="M12 62 Q50 96 88 62 Z"/><path d="M12 58 Q14 22 50 18 Q84 18 88 46 Z M30 54 Q32 34 46 24 M50 52 Q56 34 66 24"/><circle ${accent} cx="56" cy="66" r="6"/>`,
    "A clam open with a pearl inside.",
    "一只张开的蛤蜊，里面有一颗珍珠。",
  ],
  slug: [
    `<path d="M8 80 Q10 64 36 64 L66 62 Q80 60 84 48 Q88 40 92 52 Q94 76 66 80 Z"/><path d="M82 50 L76 34 M88 47 L92 32"/>${dot(76, 32, 3)}${dot(92, 30, 3)}<path ${accent} d="M6 88 L60 88" stroke-dasharray="3 6"/>`,
    "A slug leaving a trail.",
    "一只留下黏痕的鼻涕虫。",
  ],
  twig: [
    `<path d="M10 82 L90 28 M38 64 L40 44 M58 50 L76 52 M70 40 L68 26"/><ellipse ${accent} cx="40" cy="38" rx="5" ry="8" transform="rotate(-20 40 38)"/><ellipse ${accent} cx="82" cy="54" rx="5" ry="8" transform="rotate(70 82 54)"/><ellipse ${accent} cx="66" cy="20" rx="5" ry="8" transform="rotate(-10 66 20)"/>`,
    "A twig with three leaves.",
    "一根长着三片叶子的小树枝。",
  ],
  crib: [
    `<path d="M14 28 L14 88 M86 28 L86 88 M14 38 L86 38 M14 74 L86 74 M26 38 L26 74 M38 38 L38 74 M50 38 L50 74 M62 38 L62 74 M74 38 L74 74"/>${dot(14, 26, 4)}${dot(86, 26, 4)}<path ${accent} d="M30 14 L70 14 M38 14 L38 22 M50 14 L50 24 M62 14 L62 22"/><circle cx="38" cy="25" r="3"/><circle cx="50" cy="27" r="3"/><circle cx="62" cy="25" r="3"/>`,
    "A baby's crib with a toy hanging above.",
    "一张婴儿床，上方挂着玩具。",
  ],
  dress: [
    `<path d="M38 16 L62 16 L64 38 L82 90 L18 90 L36 38 Z M40 16 L38 6 M60 16 L62 6"/><path ${accent} d="M35 40 L65 40" stroke-width="6"/><path d="M30 76 Q50 82 70 76"/>`,
    "A dress.",
    "一条连衣裙。",
  ],
  glass: [
    `<path d="M28 12 L72 12 L64 90 L36 90 Z"/><path ${accent} d="M31 40 Q40 34 50 40 Q60 46 69 40"/><circle cx="44" cy="62" r="3"/><circle cx="56" cy="72" r="2.5"/><circle cx="50" cy="52" r="2"/>`,
    "A glass of water.",
    "一杯水。",
  ],
  cliff: [
    `<path d="M4 22 L46 22 L52 38 L46 52 L54 66 L50 94 L4 94"/><path d="M46 52 L36 46 M52 38 L40 34"/><path ${accent} d="${waves(80)}"/><path d="M70 30 Q75 25 80 30 Q85 25 90 30"/>`,
    "A tall cliff above the sea.",
    "海边高高的悬崖。",
  ],
  stamp: [
    `<rect x="20" y="16" width="60" height="68"/>${[24, 32, 40, 48, 56, 64, 72, 80].map((y) => `${dot(20, y, 2.5)}${dot(80, y, 2.5)}`).join("")}${[28, 36, 44, 52, 60, 68, 76].map((x) => `${dot(x, 16, 2.5)}${dot(x, 84, 2.5)}`).join("")}<rect x="30" y="26" width="40" height="48"/><path ${accent} d="M32 70 L46 48 L54 60 L60 52 L68 70"/><circle cx="60" cy="36" r="4"/>`,
    "A postage stamp.",
    "一张邮票。",
  ],
  nest: [
    `<path d="M10 58 Q50 98 90 58 M14 60 L86 72 M16 72 L84 60 M24 80 L76 64 M28 64 L72 84"/><ellipse ${accent} cx="36" cy="52" rx="9" ry="11"/><ellipse ${accent} cx="52" cy="50" rx="9" ry="11"/><ellipse ${accent} cx="67" cy="53" rx="9" ry="11"/>`,
    "A nest with three eggs.",
    "一个有三枚蛋的鸟窝。",
  ],
  tent: [
    `<path d="M8 84 L50 18 L92 84 Z M50 18 L50 10"/><path ${accent} d="M50 18 L38 84 M50 18 L62 84 M38 84 Q50 64 62 84"/><path d="M8 84 L2 92 M92 84 L98 92 M2 94 L98 94"/>`,
    "A tent.",
    "一顶帐篷。",
  ],
  hand: [
    `<path d="M30 94 L30 60 L18 44 Q14 36 22 36 L34 50 L34 20 Q34 13 40 13 Q46 13 46 20 L46 44 L46 12 Q46 5 52 5 Q58 5 58 12 L58 44 L58 16 Q58 9 64 9 Q70 9 70 16 L70 48 L70 30 Q70 23 76 23 Q82 23 82 30 L82 64 Q82 94 58 94 Z"/>`,
    "An open hand.",
    "一只张开的手。",
  ],
  lamp: [
    `<path ${accent} d="M30 16 L70 16 L82 46 L18 46 Z"/><path d="M50 46 L50 82 M30 88 L70 88 L66 82 L34 82 Z M60 46 L60 58"/>${dot(60, 60, 3)}`,
    "A table lamp.",
    "一盏台灯。",
  ],
  pond: [
    `<ellipse cx="50" cy="66" rx="42" ry="20"/><path d="M28 64 Q34 60 40 64 M56 74 Q62 70 68 74"/><path ${accent} d="M66 58 A9 5 0 1 1 74 62 L66 58 Z"/><path d="M14 54 L12 14 M22 54 L24 22"/><rect x="9" y="16" width="6" height="16" rx="3"/><rect x="21" y="24" width="6" height="16" rx="3"/>`,
    "A pond with reeds and a lily pad.",
    "一个长着芦苇和睡莲叶的池塘。",
  ],
  desk: [
    `<rect x="8" y="40" width="84" height="8"/><path d="M14 48 L14 90 M86 48 L86 90"/><rect x="56" y="48" width="30" height="20"/><path ${accent} d="M66 58 L76 58"/><rect x="22" y="24" width="20" height="16"/><path d="M32 24 L28 10 L36 10 Z"/>`,
    "A desk with a drawer and a pencil pot.",
    "一张有抽屉和笔筒的书桌。",
  ],
  milk: [
    `<path d="M24 34 L56 34 L56 92 L24 92 Z M24 34 L32 16 L64 16 L56 34 M64 16 L76 30 L76 84 L56 92 M32 16 L36 8 L64 8 L64 16"/><path ${accent} d="M30 56 Q36 48 42 56 Q48 64 50 56 L50 80 L30 80 Z"/>`,
    "A carton of milk.",
    "一盒牛奶。",
  ],
  belt: [
    `<rect x="6" y="40" width="88" height="18" rx="3"/><rect ${accent} x="14" y="34" width="20" height="30" rx="3"/><path d="M24 49 L40 49"/>${dot(56, 49, 2.5)}${dot(66, 49, 2.5)}${dot(76, 49, 2.5)}`,
    "A belt with a buckle.",
    "一条带扣的腰带。",
  ],
  gift: [
    `<rect x="16" y="40" width="68" height="50"/><rect x="12" y="30" width="76" height="12"/><path ${accent} d="M50 30 L50 90 M50 30 Q34 10 26 20 Q22 30 50 30 Q66 10 74 20 Q78 30 50 30"/>`,
    "A gift with a bow.",
    "一个系着蝴蝶结的礼物。",
  ],
  raft: [
    `<path d="M8 66 L92 66 L88 80 L12 80 Z M30 66 L28 80 M50 66 L50 80 M70 66 L72 80"/><path ${accent} d="M18 72 L82 72"/><path d="M60 66 L76 26 M72 30 Q82 20 86 30 Q82 38 76 34"/><path d="${waves(90)}"/>`,
    "A log raft with a paddle, on the water.",
    "水面上的一只木筏，上面有一支桨。",
  ],
  mask: [
    `<path d="M10 44 Q12 30 30 32 Q44 34 50 42 Q56 34 70 32 Q88 30 90 44 Q92 66 70 64 Q56 62 50 52 Q44 62 30 64 Q8 66 10 44 Z"/><ellipse ${accent} cx="30" cy="47" rx="9" ry="6"/><ellipse ${accent} cx="70" cy="47" rx="9" ry="6"/><path d="M10 44 L4 36 M90 44 L96 36"/>`,
    "A mask for the eyes.",
    "一个遮住眼睛的面具。",
  ],
  vest: [
    `<path d="M30 10 L50 46 L70 10 L84 22 L80 90 L20 90 L16 22 Z M50 46 L50 90"/>${dot(56, 56, 2.5)}${dot(56, 68, 2.5)}${dot(56, 80, 2.5)}<path ${accent} d="M26 66 L40 66 M60 66 L74 66"/>`,
    "A vest with buttons.",
    "一件有扣子的背心。",
  ],
  ant: [
    `<circle cx="22" cy="54" r="10"/><ellipse cx="44" cy="56" rx="10" ry="8"/><ellipse ${accent} cx="72" cy="56" rx="16" ry="12"/><path d="M18 45 L10 30 M24 44 L28 28 M40 62 L30 80 M44 63 L44 82 M48 62 L58 80 M40 50 L32 36 M48 50 L58 36"/>${dot(18, 52, 2)}`,
    "An ant.",
    "一只蚂蚁。",
  ],
  pump: [
    `<rect x="40" y="30" width="20" height="56" rx="3"/><path d="M50 30 L50 14 M34 14 L66 14" stroke-width="6"/><path d="M30 90 L70 90 M40 86 L36 90 M60 86 L64 90"/><path ${accent} d="M60 74 Q84 74 84 56 Q84 40 72 40"/>`,
    "A pump for blowing up tyres.",
    "一个给轮胎打气的打气筒。",
  ],
  plant: [
    `<path ${accent} d="M30 62 L70 62 L64 92 L36 92 Z"/><path d="M50 62 L50 30 M50 46 Q30 44 24 28 Q42 26 50 46 M50 36 Q70 34 76 18 Q58 16 50 36 M50 30 Q44 16 50 6 Q56 16 50 30"/>`,
    "A plant in a pot.",
    "一盆植物。",
  ],
};

const silentEDrawings: Record<string, readonly [body: string, en: string, zh: string]> = {
  cake: [
    `<path d="M16 50 L84 50 L84 88 L16 88 Z"/><path ${accent} d="M16 50 Q16 40 26 40 L74 40 Q84 40 84 50 Q78 60 72 52 Q66 62 60 52 Q54 62 48 52 Q42 62 36 52 Q30 62 24 52 Q20 58 16 50 Z"/><path d="M16 70 L84 70 M34 40 L34 24 M50 40 L50 24 M66 40 L66 24"/><path d="M34 22 Q30 16 34 10 Q38 16 34 22 M50 22 Q46 16 50 10 Q54 16 50 22 M66 22 Q62 16 66 10 Q70 16 66 22"/>`,
    "A birthday cake with three candles.",
    "一个插着三支蜡烛的生日蛋糕。",
  ],
  cape: [
    `<path d="M38 16 Q50 24 62 16 L64 22 Q84 60 88 90 Q50 82 12 90 Q16 60 36 22 Z"/><circle ${accent} cx="50" cy="24" r="5"/><path d="M50 30 L46 86 M36 22 Q30 54 30 86 M64 22 Q70 54 70 86"/>`,
    "A long cape with a round clasp at the neck.",
    "一件领口有圆扣的长披风。",
  ],
  cane: [
    `<path d="M56 94 L56 28 Q56 10 40 10 Q24 10 24 26"/><path ${accent} d="M56 40 L56 50 M56 62 L56 72 M56 84 L56 92" stroke-width="6"/>`,
    "A walking cane.",
    "一根手杖。",
  ],
  gate: [
    `<path d="M10 90 L10 20 M90 90 L90 20 M10 30 L90 30 M10 80 L90 80"/><path ${accent} d="M26 30 L26 80 M42 30 L42 80 M58 30 L58 80 M74 30 L74 80 M10 80 L90 30"/>${dot(10, 18, 4)}${dot(90, 18, 4)}<path d="M2 92 L98 92"/>`,
    "A wooden gate.",
    "一扇木门。",
  ],
  vase: [
    `<path d="M40 50 Q26 62 30 80 Q34 92 50 92 Q66 92 70 80 Q74 62 60 50 L60 42 L40 42 Z"/><path ${accent} d="M33 70 Q50 64 67 70"/><path d="M50 42 L50 22 M46 42 L34 18 M54 42 L66 20"/><circle cx="50" cy="16" r="6"/><circle cx="32" cy="14" r="5"/><circle cx="68" cy="16" r="5"/>`,
    "A vase with three flowers.",
    "一个插着三朵花的花瓶。",
  ],
  wave: [
    `<path ${accent} d="M6 84 Q20 84 30 60 Q44 24 72 24 Q90 26 92 44 Q80 34 70 42 Q62 50 72 58 Q56 60 52 84"/><path d="M4 90 Q27 84 50 90 Q73 96 96 90"/>`,
    "A big wave curling over.",
    "一个卷起来的大浪。",
  ],
  rake: [
    `<path d="M80 10 L36 72"/><path ${accent} d="M22 62 L50 82"/><path d="M22 62 L14 74 M29 67 L21 79 M36 72 L28 84 M43 77 L35 89 M50 82 L42 94"/>`,
    "A garden rake.",
    "一把耙子。",
  ],
  tape: [
    `<circle cx="44" cy="50" r="30"/><circle ${accent} cx="44" cy="50" r="13"/><path d="M74 50 L92 50 L92 64 L66 66"/><path d="M84 50 L86 46 L88 50 L90 46 L92 50"/>`,
    "A roll of sticky tape.",
    "一卷胶带。",
  ],
  cave: [
    `<path d="M4 88 L16 50 Q30 18 52 16 Q78 16 90 48 L96 88 Z"/><path ${accent} d="M30 88 Q30 52 50 50 Q70 52 70 88" fill="currentColor"/><path d="M24 40 L32 46 M76 38 L68 44"/>`,
    "A cave in a hill, dark inside.",
    "山里的一个山洞，里面黑黑的。",
  ],
  kite: [
    `<path ${accent} d="M60 8 L82 32 L60 62 L38 32 Z"/><path d="M60 8 L60 62 M38 32 L82 32 M60 62 Q50 74 58 82 Q66 90 54 96"/><path d="M53 76 L47 72 M53 76 L49 82 M58 88 L52 86 M58 88 L56 94"/><path d="M38 32 L10 92" stroke-dasharray="2 4"/>`,
    "A kite with a tail, on a string.",
    "一只带尾巴、拴着线的风筝。",
  ],
  bike: [
    `<circle cx="24" cy="66" r="16"/><circle cx="76" cy="66" r="16"/><path ${accent} d="M24 66 L42 40 L66 40 L76 66 M42 40 L50 66 L66 40"/><path d="M50 66 L24 66 M38 32 L48 32 M42 40 L40 32 M66 40 L62 26 L72 24"/>${dot(24, 66, 3)}${dot(76, 66, 3)}`,
    "A bike.",
    "一辆自行车。",
  ],
  hive: [
    `<path d="M50 10 L50 18"/><path d="M50 18 Q28 18 26 34 L74 34 Q72 18 50 18 Z M22 34 L78 34 Q84 50 78 54 L22 54 Q16 50 22 34 Z M20 54 L80 54 Q86 70 80 74 L20 74 Q14 70 20 54 Z M24 74 L76 74 Q78 88 70 90 L30 90 Q22 88 24 74 Z"/><path ${accent} d="M44 90 Q44 82 50 82 Q56 82 56 90" fill="currentColor"/><ellipse cx="84" cy="24" rx="5" ry="3.5"/><path d="M82 20 Q80 14 84 16 M86 20 Q90 14 88 18"/>`,
    "A beehive with a bee flying by.",
    "一个蜂窝，旁边飞着一只蜜蜂。",
  ],
  pine: [
    `<path ${accent} d="M50 6 L30 34 L40 34 L22 58 L36 58 L14 82 L86 82 L64 58 L78 58 L60 34 L70 34 Z"/><path d="M44 82 L44 94 L56 94 L56 82"/>`,
    "A pine tree.",
    "一棵松树。",
  ],
  pipe: [
    `<path d="M10 30 L50 30 Q62 30 62 42 L62 90 M10 46 L42 46 Q46 46 46 50 L46 90"/><path ${accent} d="M6 26 L14 26 L14 50 L6 50 Z M42 86 L66 86 L66 94 L42 94 Z"/><path d="M50 30 L50 44"/>`,
    "A bent pipe.",
    "一根弯管子。",
  ],
  vine: [
    `<path d="M10 90 Q30 70 22 52 Q14 34 34 26 Q54 18 52 40 Q50 62 72 58 Q92 54 88 30 Q86 16 72 14"/><path ${accent} d="M22 52 Q8 50 10 40 Q22 40 22 52 Z M52 40 Q66 34 64 24 Q52 26 52 40 Z M72 58 Q72 74 84 74 Q86 62 72 58 Z"/><path d="M34 26 Q38 20 34 14 M88 30 Q96 32 94 40"/>`,
    "A vine climbing with curly tips.",
    "一根卷着须往上爬的藤。",
  ],
  mice: [
    `<ellipse cx="30" cy="44" rx="16" ry="11"/><path ${accent} d="M44 39 L56 46 L44 52"/><circle cx="38" cy="32" r="6"/>${dot(46, 42, 2)}<path d="M14 46 Q2 48 4 60 M22 54 L20 60 M36 54 L38 60"/><ellipse cx="60" cy="76" rx="16" ry="11"/><path ${accent} d="M74 71 L86 78 L74 84"/><circle cx="68" cy="64" r="6"/>${dot(76, 74, 2)}<path d="M44 78 Q32 80 34 92 M52 86 L50 92 M66 86 L68 92"/>`,
    "Two mice.",
    "两只老鼠。",
  ],
  dice: [
    `<rect x="12" y="34" width="40" height="40" rx="6"/>${dot(22, 44, 3.5)}${dot(32, 54, 3.5)}${dot(42, 64, 3.5)}<rect ${accent} x="52" y="20" width="36" height="36" rx="6" transform="rotate(15 70 38)"/>${dot(62, 32, 3.5)}${dot(76, 36, 3.5)}${dot(58, 44, 3.5)}${dot(72, 48, 3.5)}`,
    "A pair of dice.",
    "一对骰子。",
  ],
  rice: [
    `<path d="M12 50 L88 50 Q86 84 50 86 Q14 84 12 50 Z M40 86 L38 92 L62 92 L60 86"/><path ${accent} d="M14 50 Q20 34 34 38 Q42 28 54 34 Q66 28 72 38 Q84 36 86 50"/><path d="M30 44 L34 44 M46 40 L50 40 M60 44 L64 44 M40 46 L44 46 M70 46 L74 46 M78 20 L58 46 M86 22 L64 48"/>`,
    "A bowl of rice with chopsticks.",
    "一碗米饭，上面放着筷子。",
  ],
  rope: [
    `<ellipse cx="50" cy="60" rx="36" ry="14"/><ellipse cx="50" cy="54" rx="28" ry="10"/><ellipse ${accent} cx="50" cy="48" rx="20" ry="7"/><path d="M70 48 Q86 36 80 22 Q76 12 66 14"/><path d="M62 26 L66 20 M70 38 L74 32"/>`,
    "A coil of rope.",
    "一卷绳子。",
  ],
  rose: [
    `<path ${accent} d="M50 16 Q34 16 32 32 Q32 46 50 48 Q68 46 68 32 Q66 16 50 16 Z M50 24 Q42 26 44 34 Q50 38 56 32 Q58 24 50 24"/><path d="M50 48 L50 94 M50 70 Q36 68 30 58 Q42 56 50 66 M50 80 L56 76"/>`,
    "A rose.",
    "一朵玫瑰。",
  ],
  nose: [
    `<path d="M40 10 Q46 40 34 62 Q30 72 42 74 Q48 80 56 74 Q66 72 62 62"/><path ${accent} d="M38 66 Q42 68 44 64 M54 64 Q56 68 60 66"/><path d="M28 30 Q34 26 40 30 M58 30 Q64 26 70 30"/>`,
    "A nose.",
    "一个鼻子。",
  ],
  bone: [
    `<path d="M26 40 L74 40 Q78 26 88 32 Q96 38 88 50 Q96 62 88 68 Q78 74 74 60 L26 60 Q22 74 12 68 Q4 62 12 50 Q4 38 12 32 Q22 26 26 40 Z"/><path ${accent} d="M32 50 L68 50"/>`,
    "A bone.",
    "一根骨头。",
  ],
  cone: [
    `<path d="M28 44 L50 94 L72 44"/><path d="M34 58 L62 70 M40 72 L58 80 M36 50 L66 62"/><path ${accent} d="M24 46 Q18 30 34 26 Q36 10 50 12 Q64 10 66 26 Q82 30 76 46 Z"/>`,
    "An ice cream cone.",
    "一个冰淇淋甜筒。",
  ],
  robe: [
    `<path d="M36 10 L50 30 L64 10 L82 18 L94 52 L84 56 L76 36 L78 92 L22 92 L24 36 L16 56 L6 52 L18 18 Z M50 30 L40 92"/><path ${accent} d="M26 60 Q50 66 76 58 M50 62 L46 76 M52 62 L60 74"/>`,
    "A bathrobe with a belt.",
    "一件系着腰带的浴袍。",
  ],
  hole: [
    `<path d="M4 50 L22 50 M78 50 L96 50"/><ellipse ${accent} cx="50" cy="56" rx="30" ry="12" fill="currentColor"/><path d="M8 50 Q14 38 24 42 Q30 34 38 42 M62 42 Q70 34 76 42 Q86 38 92 50"/><path d="M20 70 L80 70 M30 80 L70 80" stroke-dasharray="3 6"/>`,
    "A hole in the ground.",
    "地上的一个洞。",
  ],
  mole: [
    `<path d="M20 74 Q18 52 44 50 Q66 50 76 62 L88 64 Q92 68 86 72 L76 74 Z"/>${dot(70, 60, 2.5)}<path ${accent} d="M24 74 L18 82 M34 74 L30 84 M28 82 L18 84 M60 74 L64 84"/><path d="M4 90 Q30 72 54 90 Z"/>`,
    "A mole beside a pile of earth.",
    "一只鼹鼠，旁边有一堆土。",
  ],
  note: [
    `<ellipse ${accent} cx="36" cy="76" rx="14" ry="10" transform="rotate(-20 36 76)" fill="currentColor"/><path d="M48 72 L48 14 Q60 26 74 30 Q80 36 76 48"/><path d="M6 20 L94 20 M6 34 L94 34 M6 48 L94 48 M6 62 L94 62 M6 76 L94 76" stroke-width="1"/>`,
    "A musical note.",
    "一个音符。",
  ],
  cube: [
    `<path d="M20 36 L52 20 L84 36 L84 72 L52 88 L20 72 Z M20 36 L52 52 L84 36 M52 52 L52 88"/><path ${accent} d="M28 48 L44 56 M60 56 L76 48"/>`,
    "A cube.",
    "一个正方体。",
  ],
  tube: [
    `<path d="M24 36 L76 36 L88 30 L88 70 L76 64 L24 64 Q20 64 20 60 L20 40 Q20 36 24 36 Z"/><rect ${accent} x="6" y="42" width="14" height="16" rx="2"/><path d="M40 44 L64 44 M40 56 L56 56"/>`,
    "A tube of toothpaste.",
    "一管牙膏。",
  ],
  mule: [
    `<path d="M18 40 Q16 34 24 34 L64 34 Q70 34 72 28 L76 16 Q80 10 86 14 L94 28 Q96 34 90 36 L80 36 L76 46 Q74 54 66 54 L26 54 Q18 54 18 46 Z M26 54 L24 88 M34 54 L34 88 M58 54 L58 88 M66 54 L68 88 M18 40 Q8 44 10 58"/><path ${accent} d="M78 14 L72 0 L82 12 M84 13 L88 0 L88 14"/>${dot(86, 22, 2.5)}<path d="M60 34 L72 28"/>`,
    "A mule with long ears.",
    "一头长耳朵的骡子。",
  ],
};

const vowelTeamDrawings: Record<string, readonly [body: string, en: string, zh: string]> = {
  bee: [
    `<ellipse ${accent} cx="50" cy="60" rx="24" ry="16"/><path d="M42 45 L42 75 M54 44 L54 76 M74 60 L86 60"/><circle cx="24" cy="58" r="8"/>${dot(21, 56, 2)}<path d="M22 50 L16 40 M27 50 L30 40"/><path d="M44 44 Q30 18 44 14 Q56 16 52 42 M54 44 Q62 16 76 22 Q84 30 60 46"/>`,
    "A bee.",
    "一只蜜蜂。",
  ],
  feet: [
    `<path d="M16 88 Q12 66 18 46 Q22 34 32 36 Q42 40 40 56 Q38 72 42 86 Q34 94 16 88 Z M58 88 Q54 66 60 46 Q64 34 74 36 Q84 40 82 56 Q80 72 84 86 Q76 94 58 88 Z"/><g ${accent}><circle cx="21" cy="32" r="4"/><circle cx="30" cy="29" r="3.5"/><circle cx="38" cy="32" r="3"/><circle cx="63" cy="32" r="4"/><circle cx="72" cy="29" r="3.5"/><circle cx="80" cy="32" r="3"/></g>`,
    "Two bare feet.",
    "一双光脚。",
  ],
  seed: [
    `<path d="M4 72 L96 72"/><ellipse ${accent} cx="50" cy="84" rx="10" ry="6" fill="currentColor"/><path d="M50 78 L50 46 M50 56 Q34 50 30 36 Q46 36 50 56 M50 48 Q66 40 70 28 Q54 28 50 48"/>`,
    "A seed in the soil, sprouting.",
    "土里一颗正在发芽的种子。",
  ],
  tree: [
    `<path d="M44 92 L46 60 L36 50 M46 60 L56 52 M56 92 L54 60"/><path ${accent} d="M50 8 Q30 8 28 26 Q12 30 16 46 Q14 62 34 60 Q44 68 56 60 Q80 64 84 46 Q90 30 72 26 Q70 8 50 8 Z"/><path d="M30 92 L70 92"/>`,
    "A tree.",
    "一棵树。",
  ],
  sheep: [
    `<path d="M22 56 Q14 52 18 42 Q16 30 30 30 Q36 20 50 24 Q62 18 70 28 Q84 28 82 42 Q88 52 78 58 Q74 68 60 64 Q50 70 40 64 Q26 68 22 56 Z"/><path ${accent} d="M80 38 Q94 36 94 48 Q94 58 84 56" fill="currentColor"/><path d="M32 64 L32 86 M44 66 L44 86 M58 66 L58 86 M70 62 L70 86"/>`,
    "A sheep with a woolly coat.",
    "一只毛茸茸的绵羊。",
  ],
  queen: [
    `<path ${accent} d="M30 30 L34 10 L42 22 L50 8 L58 22 L66 10 L70 30 Z"/><circle cx="50" cy="48" r="16"/>${dot(44, 46, 2)}${dot(56, 46, 2)}<path d="M44 54 Q50 58 56 54 M34 64 L22 94 L78 94 L66 64 Q50 72 34 64"/>`,
    "A queen with a crown.",
    "一位戴着王冠的女王。",
  ],
  wheel: [
    `<circle cx="50" cy="50" r="38"/><circle cx="50" cy="50" r="30"/><circle ${accent} cx="50" cy="50" r="7"/><path d="${spokes(50, 50, 8, 30, 8)}"/>`,
    "A wheel with spokes.",
    "一个有辐条的轮子。",
  ],
  teeth: [
    `<path d="M10 50 Q50 10 90 50 Q50 90 10 50 Z"/><path ${accent} d="M18 46 L82 46 M18 54 L82 54"/><path d="M28 39 L28 46 M40 34 L40 46 M50 32 L50 46 M60 34 L60 46 M72 39 L72 46 M28 54 L28 61 M40 54 L40 66 M50 54 L50 68 M60 54 L60 66 M72 54 L72 61"/>`,
    "Teeth in a smile.",
    "笑着露出的牙齿。",
  ],
  leaf: [
    `<path ${accent} d="M16 84 Q14 30 84 14 Q88 70 16 84 Z"/><path d="M16 84 L72 28 M36 64 L34 44 M36 64 L58 62 M52 48 L52 30 M52 48 L70 46 M16 84 L8 92"/>`,
    "A leaf.",
    "一片叶子。",
  ],
  seal: [
    `<path d="M8 78 Q6 66 22 64 L56 62 Q64 60 66 48 Q68 36 80 36 Q92 38 90 50 Q88 58 80 60 Q74 78 50 80 Z"/>${dot(80, 44, 2.5)}<path d="M90 50 L96 50 M44 80 L36 92 L54 88 M8 78 L2 70 M8 78 L2 86 M84 52 L94 56 M84 54 L92 60"/><circle ${accent} cx="88" cy="20" r="8"/>`,
    "A seal with a ball above its nose.",
    "一只鼻子上方顶着球的海豹。",
  ],
  peach: [
    `<path ${accent} d="M50 30 Q22 22 18 52 Q18 86 50 88 Q82 86 82 52 Q78 22 50 30 Z"/><path d="M50 30 Q42 56 50 86 M50 30 L52 18 M52 20 Q64 8 76 14 Q66 26 52 20 Z"/>`,
    "A peach.",
    "一个桃子。",
  ],
  bead: [
    `<path d="M4 50 L96 50" stroke-width="1.5"/><ellipse cx="18" cy="50" rx="9" ry="10"/><ellipse ${accent} cx="50" cy="50" rx="13" ry="14"/><ellipse cx="82" cy="50" rx="9" ry="10"/><circle cx="50" cy="50" r="3"/>`,
    "Beads on a string.",
    "穿在线上的珠子。",
  ],
  rain: [
    `<path d="M24 42 Q10 42 12 30 Q14 18 28 22 Q34 8 50 12 Q64 8 70 20 Q86 18 88 32 Q88 44 74 42 Z"/><path ${accent} d="M26 54 L22 66 M44 52 L40 64 M62 54 L58 66 M80 52 L76 64 M34 74 L30 86 M52 72 L48 84 M70 74 L66 86"/>`,
    "Rain falling from a cloud.",
    "从云里落下的雨。",
  ],
  snail: [
    `<path ${accent} d="M58 70 Q30 72 30 46 Q30 22 54 22 Q76 24 74 46 Q72 62 54 60 Q40 58 42 46 Q44 36 54 38 Q62 40 60 48"/><path d="M8 72 L86 72 Q92 72 90 62 L82 50 M82 50 L78 38 M86 54 L92 42"/>${dot(78, 36, 2.5)}${dot(92, 40, 2.5)}`,
    "A snail with a spiral shell.",
    "一只背着螺旋壳的蜗牛。",
  ],
  mail: [
    `<rect x="12" y="26" width="76" height="50" rx="3"/><path ${accent} d="M12 28 L50 56 L88 28"/><path d="M12 74 L40 50 M88 74 L60 50"/><rect x="70" y="32" width="12" height="12"/>`,
    "A letter in the mail.",
    "一封邮件。",
  ],
  nail: [
    `<path d="M24 22 L76 22 M50 22 L50 82 L46 74 M50 82 L54 74" stroke-width="4"/><path ${accent} d="M28 16 L72 16 L72 24 L28 24 Z"/><path d="M50 82 L50 90"/>`,
    "A nail.",
    "一根钉子。",
  ],
  train: [
    `<rect x="54" y="38" width="38" height="40"/><rect x="62" y="46" width="14" height="12"/><path d="M8 50 L54 50 L54 78 L8 78 Z M20 50 L20 34 L30 34 L30 50 M8 44 L8 50"/><path ${accent} d="M18 30 Q14 22 20 18 Q16 10 26 8"/><circle cx="20" cy="84" r="6"/><circle cx="40" cy="84" r="6"/><circle cx="64" cy="84" r="6"/><circle cx="84" cy="84" r="6"/><path d="M2 92 L98 92"/>`,
    "A train.",
    "一列火车。",
  ],
  paint: [
    `<path d="M24 40 L76 40 L72 90 L28 90 Z"/><path ${accent} d="M24 40 L76 40 L75 52 Q62 60 58 52 Q54 64 46 52 Q38 60 25 52 Z"/><path d="M24 40 Q50 4 76 40"/><path d="M84 8 L66 40 M84 8 L92 12 L74 44 L66 40"/>`,
    "A can of paint with a brush.",
    "一罐油漆和一把刷子。",
  ],
  chain: [
    `<ellipse cx="18" cy="50" rx="13" ry="8"/><ellipse ${accent} cx="34" cy="50" rx="8" ry="13"/><ellipse cx="50" cy="50" rx="13" ry="8"/><ellipse ${accent} cx="66" cy="50" rx="8" ry="13"/><ellipse cx="82" cy="50" rx="13" ry="8"/>`,
    "A chain.",
    "一条链子。",
  ],
  sail: [
    `<path d="M50 8 L50 74"/><path ${accent} d="M54 12 L86 66 L54 66 Z"/><path d="M46 20 L20 66 L46 66 Z M14 74 L86 74 L76 86 L24 86 Z"/><path d="M4 92 Q27 86 50 92 Q73 98 96 92"/>`,
    "A sailboat with its sails up.",
    "一只扬着帆的帆船。",
  ],
  hay: [
    `<path d="M10 88 Q10 40 50 34 Q90 40 90 88 Z"/><path ${accent} d="M22 88 L28 52 M36 88 L38 44 M50 88 L50 40 M64 88 L62 44 M78 88 L72 52"/><path d="M30 36 L24 26 M50 34 L50 22 M70 36 L76 26 M40 34 L36 24 M60 34 L64 24"/>`,
    "A pile of hay.",
    "一堆干草。",
  ],
  tray: [
    `<path d="M6 66 L94 66 L86 78 L14 78 Z M6 66 L4 58 M94 66 L96 58"/><path d="M24 66 L28 46 L44 46 L48 66"/><path ${accent} d="M58 66 Q58 50 70 50 Q82 50 82 66"/><path d="M28 46 Q36 40 44 46"/>`,
    "A tray with a cup and a bowl.",
    "一个托盘，上面放着杯子和碗。",
  ],
  jay: [
    `<ellipse ${accent} cx="48" cy="56" rx="22" ry="14"/><circle ${accent} cx="70" cy="40" r="11"/><path d="M66 30 L62 16 L72 29 M74 30 L78 18 L77 31 M80 40 L92 44 L80 46 M26 54 L6 46 L10 62 L28 60 M40 56 Q50 48 60 58 M44 70 L42 84 M54 70 L56 84 M38 84 L46 84 M52 84 L60 84"/>${dot(73, 38, 2.5)}`,
    "A jay, a bird with a crest.",
    "一只头上有冠羽的松鸦。",
  ],
  boat: [
    `<path d="M8 56 L92 56 L80 78 L20 78 Z"/><path ${accent} d="M30 56 L30 42 L60 42 L60 56 M38 42 L38 36 L52 36 L52 42"/><path d="M4 86 Q27 80 50 86 Q73 92 96 86"/>`,
    "A boat on the water.",
    "水上的一条船。",
  ],
  goat: [
    `<path d="M20 44 L62 44 Q66 30 74 30 L86 36 Q88 44 80 46 L74 46 L70 60 L22 60 Q14 58 20 44 Z M26 60 L26 88 M36 60 L36 88 M58 60 L58 88 M66 60 L66 88 M20 48 L10 42"/><path ${accent} d="M74 30 Q72 16 60 12 M78 30 Q80 16 70 8 M82 46 L80 58 L76 48"/>${dot(78, 38, 2)}`,
    "A goat with horns and a beard.",
    "一只长着角和胡子的山羊。",
  ],
  coat: [
    `<path d="M36 10 L50 22 L64 10 L84 18 L94 60 L84 62 L78 40 L78 92 L22 92 L22 40 L16 62 L6 60 L16 18 Z M50 22 L50 92 M36 10 L44 36 L50 22 L56 36 L64 10"/>${dot(56, 50, 2.5)}${dot(56, 64, 2.5)}${dot(56, 78, 2.5)}<path ${accent} d="M28 66 L42 66 M28 66 L28 76 M42 66 L42 76"/>`,
    "A coat with buttons and a pocket.",
    "一件有扣子和口袋的外套。",
  ],
  road: [
    `<path d="M38 10 L4 92 M62 10 L96 92"/><path ${accent} d="M50 16 L50 26 M50 38 L50 52 M50 66 L50 86" stroke-width="5"/><path d="M4 10 L96 10"/>`,
    "A road going far away.",
    "一条伸向远方的路。",
  ],
  toad: [
    `<path d="M14 76 Q12 50 34 44 Q50 40 66 44 Q88 50 86 76 Z"/><circle cx="34" cy="42" r="7"/><circle cx="66" cy="42" r="7"/>${dot(34, 42, 3)}${dot(66, 42, 3)}<path ${accent} d="M30 56 L32 56 M46 62 L48 62 M62 58 L64 58 M40 70 L42 70 M58 70 L60 70" stroke-width="5"/><path d="M14 76 L6 86 L22 84 M86 76 L94 86 L78 84"/>`,
    "A bumpy toad.",
    "一只疙疙瘩瘩的蟾蜍。",
  ],
  soap: [
    `<rect ${accent} x="18" y="46" width="64" height="30" rx="12"/><circle cx="34" cy="34" r="8"/><circle cx="52" cy="24" r="6"/><circle cx="66" cy="34" r="5"/><circle cx="74" cy="16" r="4"/>`,
    "A bar of soap with bubbles.",
    "一块冒着泡泡的肥皂。",
  ],
  loaf: [
    `<path d="M10 80 L10 50 Q10 26 50 26 Q90 26 90 50 L90 80 Z"/><path ${accent} d="M30 40 L40 32 M46 40 L56 32 M62 40 L72 32"/>`,
    "A loaf of bread.",
    "一条面包。",
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

/** blendPictureWords are the words with a consonant blend that have a picture, by where the blend stands. */
export const blendPictureWords: Record<"start" | "end", readonly string[]> = {
  start: ["frog", "crab", "drum", "flag", "sled", "plug", "plum", "clam", "slug", "twig", "crib", "dress", "glass", "cliff", "stamp"],
  end: ["nest", "tent", "hand", "lamp", "pond", "desk", "milk", "belt", "gift", "raft", "mask", "vest", "ant", "pump", "plant"],
};

/** allBlendPictureWords are the words with a consonant blend that have a picture, blends at the start first. */
export const allBlendPictureWords: readonly string[] = Object.values(blendPictureWords).flat();

/** silentEPictureWords are the words with a silent e that have a picture, grouped by their long vowel. */
export const silentEPictureWords: Record<"a" | "i" | "o" | "u", readonly string[]> = {
  a: ["cake", "cape", "cane", "gate", "vase", "wave", "rake", "tape", "cave"],
  i: ["kite", "bike", "hive", "pine", "pipe", "vine", "mice", "dice", "rice"],
  o: ["rope", "rose", "nose", "bone", "cone", "robe", "hole", "mole", "note"],
  u: ["cube", "tube", "mule"],
};

/** allSilentEPictureWords are the words with a silent e that have a picture, in vowel order. */
export const allSilentEPictureWords: readonly string[] = Object.values(silentEPictureWords).flat();

/** vowelTeamPictureWords are the words with a vowel team that have a picture, grouped by the team. */
export const vowelTeamPictureWords: Record<"ee" | "ea" | "ai" | "ay" | "oa", readonly string[]> = {
  ee: ["bee", "feet", "seed", "tree", "sheep", "queen", "wheel", "teeth"],
  ea: ["leaf", "seal", "peach", "bead"],
  ai: ["rain", "snail", "mail", "nail", "train", "paint", "chain", "sail"],
  ay: ["hay", "tray", "jay"],
  oa: ["boat", "goat", "coat", "road", "toad", "soap", "loaf"],
};

/** allVowelTeamPictureWords are the words with a vowel team that have a picture, in the order of the teams. */
export const allVowelTeamPictureWords: readonly string[] = Object.values(vowelTeamPictureWords).flat();

/** allDigraphPictureWords are the words with a digraph that have a picture, in the order of the digraphs. */
export const allDigraphPictureWords: readonly string[] = Object.values(digraphPictureWords).flat();

/** picture is the drawing of a word, with what it shows for screen readers. */
export function picture(word: string): Figure {
  const drawn = drawings[word] ?? digraphDrawings[word] ?? blendDrawings[word] ?? silentEDrawings[word] ?? vowelTeamDrawings[word];
  if (!drawn) throw new Error(`no picture of ${word}`);
  const [body, en, zh] = drawn;
  return { svg: svg(body), alt: t(en, zh) };
}

/** pictureName is what the picture of a word shows, as words in every locale. */
export function pictureName(word: string): Text {
  return picture(word).alt;
}

for (const word of [
  ...allPictureWords,
  ...allDigraphPictureWords,
  ...allBlendPictureWords,
  ...allSilentEPictureWords,
  ...allVowelTeamPictureWords,
]) {
  picture(word);
}
for (const word of Object.keys(drawings)) if (!allPictureWords.includes(word)) throw new Error(`picture of ${word} is in no list`);
for (const word of Object.keys(vowelTeamDrawings)) {
  if (!allVowelTeamPictureWords.includes(word)) throw new Error(`picture of ${word} is in no list`);
}
for (const word of Object.keys(silentEDrawings)) {
  if (!allSilentEPictureWords.includes(word)) throw new Error(`picture of ${word} is in no list`);
}
for (const word of Object.keys(blendDrawings)) {
  if (!allBlendPictureWords.includes(word)) throw new Error(`picture of ${word} is in no list`);
}
for (const word of Object.keys(digraphDrawings)) {
  if (!allDigraphPictureWords.includes(word)) throw new Error(`picture of ${word} is in no list`);
}
