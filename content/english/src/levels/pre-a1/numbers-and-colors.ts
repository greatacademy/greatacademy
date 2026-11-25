// Pre-A1, unit 2: Numbers and Colors. The numbers to twelve, colors, questions with what and how, a and an, plurals,
// and the first rule of writing: a capital letter and a period.

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { everyPair, interleave, vocabularyTopic, word } from "../words.ts";
import { articleNot, capitalsNot, pluralNot } from "./mistakes.ts";

const numbers = vocabularyTopic({
  id: "pre-a1-words-numbers",
  title: t("Numbers 1 to 12", "数字 1 到 12"),
  summary: t("Counting from one to twelve.", "从一数到十二。"),
  intro: t(
    "A dog has **four** legs, a bee has **six** and a spider has **eight**. These words help you count from one to twelve and say how many things there are.",
    "狗有 **four**（四）条腿，蜜蜂有 **six**（六）条，蜘蛛有 **eight**（八）条。这些词帮你从一数到十二，说出东西有多少。",
  ),
  prerequisites: [],
  words: [
    word("one", "the number 1", "一（1）", "I have {one} nose. | One and {one} is two. | A cat has {one} tail.", "two three"),
    word("two", "the number 2", "二（2）", "I have {two} eyes. | One and one is {two}. | A bird has {two} legs.", "one three"),
    word(
      "three",
      "the number 3",
      "三（3）",
      "One and two is {three}. | One, two, {three}, four. | I have two cats and one dog. That is {three} animals.",
      "two four",
    ),
    word("four", "the number 4", "四（4）", "A dog has {four} legs. | Two and two is {four}. | Three, {four}, five.", "three five"),
    word(
      "five",
      "the number 5",
      "五（5）",
      "I have {five} fingers on one hand. | Two and three is {five}. | Four, {five}, six.",
      "four six",
    ),
    word("six", "the number 6", "六（6）", "Three and three is {six}. | Five, {six}, seven. | A bee has {six} legs.", "five seven"),
    word(
      "seven",
      "the number 7",
      "七（7）",
      "There are {seven} days in a week. | Four and three is {seven}. | Six, {seven}, eight.",
      "six eight",
    ),
    word(
      "eight",
      "the number 8",
      "八（8）",
      "A spider has {eight} legs. | Four and four is {eight}. | Seven, {eight}, nine.",
      "seven nine",
    ),
    word("nine", "the number 9", "九（9）", "Five and four is {nine}. | Eight, {nine}, ten. | Ten take away one is {nine}.", "eight ten"),
    word("ten", "the number 10", "十（10）", "I have {ten} fingers. | Five and five is {ten}. | Nine, {ten}, eleven.", "nine eleven"),
    word(
      "eleven",
      "the number 11",
      "十一（11）",
      "Ten and one is {eleven}. | Ten, {eleven}, twelve. | A football team has {eleven} players.",
      "ten twelve",
    ),
    word(
      "twelve",
      "the number 12",
      "十二（12）",
      "There are {twelve} months in a year. | Six and six is {twelve}. | Ten, eleven, {twelve}.",
      "ten eleven",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "Do the sum or count on: in *Three, ___, five* the gap is the number that comes right after three, and in *Two and two is ___* it is the answer to the sum.",
        "先算一算或接着数：*Three, ___, five* 里空格是紧跟在 three 后面的数，*Two and two is ___* 里空格是算式的答案。",
      ),
      meaning: t(
        "The meaning gives the number as a digit, like 7. Match the digit to its word, and do not mix up neighbors like *six* and *seven* or *eleven* and *twelve*.",
        "释义用阿拉伯数字表示，比如 7。把数字和单词对上，别把 *six* 和 *seven*、*eleven* 和 *twelve* 这样相邻的数弄混。",
      ),
      spell: t(
        "Some number words hide letters you do not hear: the w in *two*, the gh in *eight*, and the e at the end of *twelve*.",
        "有些数字词里藏着不发音的字母：*two* 里的 w、*eight* 里的 gh、*twelve* 末尾的 e。",
      ),
    },
    notes: `
      one|a single nose;the sum one and one;a cat's tail|one is 1, and two is 2, right next to it|one 是 1，two 是紧挨着它的 2|two=two is 2, one more than 1, so it is not the number the sentence needs=two 是 2，比 1 多一，不是句子需要的数;three=three is 3, more than 1, so it is not the number the sentence needs=three 是 3，比 1 多，不是句子需要的数|one|o at the start, though it sounds like *won*|开头是 o，虽然读音像 *won*
      two|my eyes;the sum one and one;a bird's legs|two is 2, and one is 1, right next to it|two 是 2，one 是紧挨着它的 1|one=one is 1, one less than 2, so it is not the number the sentence needs=one 是 1，比 2 少一，不是句子需要的数;three=three is 3, one more than 2, so it is not the number the sentence needs=three 是 3，比 2 多一，不是句子需要的数|two|the silent w after t|t 后面的 w 不发音
      three|the sum one and two;counting from one to four;two cats and one dog|three is 3, and two is 2, right next to it|three 是 3，two 是紧挨着它的 2|two=two is 2, one less than 3, so it is not the number the sentence needs=two 是 2，比 3 少一，不是句子需要的数;four=four is 4, one more than 3, so it is not the number the sentence needs=four 是 4，比 3 多一，不是句子需要的数|three|thr at the start and the double e|开头是 thr，结尾两个 e
      four|a dog's legs;the sum two and two;counting from three to five|four is 4, and three is 3, right next to it|four 是 4，three 是紧挨着它的 3|three=three is 3, one less than 4, so it is not the number the sentence needs=three 是 3，比 4 少一，不是句子需要的数;five=five is 5, one more than 4, so it is not the number the sentence needs=five 是 5，比 4 多一，不是句子需要的数|four|our after f, the same as in *your*|f 后面是 our，和 *your* 一样
      five|the fingers on one hand;the sum two and three;counting from four to six|five is 5, and four is 4, right next to it|five 是 5，four 是紧挨着它的 4|four=four is 4, one less than 5, so it is not the number the sentence needs=four 是 4，比 5 少一，不是句子需要的数;six=six is 6, one more than 5, so it is not the number the sentence needs=six 是 6，比 5 多一，不是句子需要的数|five|i saying its name, with a silent e at the end|i 读字母本音，词尾 e 不发音
      six|the sum three and three;counting from five to seven;a bee's legs|six is 6, and five is 5, right next to it|six 是 6，five 是紧挨着它的 5|five=five is 5, one less than 6, so it is not the number the sentence needs=five 是 5，比 6 少一，不是句子需要的数;seven=seven is 7, one more than 6, so it is not the number the sentence needs=seven 是 7，比 6 多一，不是句子需要的数|six|x at the end, said like ks|结尾是 x，读作 ks
      seven|the days in a week;the sum four and three;counting from six to eight|seven is 7, and six is 6, right next to it|seven 是 7，six 是紧挨着它的 6|six=six is 6, one less than 7, so it is not the number the sentence needs=six 是 6，比 7 少一，不是句子需要的数;eight=eight is 8, one more than 7, so it is not the number the sentence needs=eight 是 8，比 7 多一，不是句子需要的数|sev · en|v in the middle and the ending -en|中间是 v，结尾是 -en
      eight|a spider's legs;the sum four and four;counting from seven to nine|eight is 8, and seven is 7, right next to it|eight 是 8，seven 是紧挨着它的 7|seven=seven is 7, one less than 8, so it is not the number the sentence needs=seven 是 7，比 8 少一，不是句子需要的数;nine=nine is 9, one more than 8, so it is not the number the sentence needs=nine 是 9，比 8 多一，不是句子需要的数|eight|the silent gh after i|i 后面的 gh 不发音
      nine|the sum five and four;counting from eight to ten;ten take away one|nine is 9, and eight is 8, right next to it|nine 是 9，eight 是紧挨着它的 8|eight=eight is 8, one less than 9, so it is not the number the sentence needs=eight 是 8，比 9 少一，不是句子需要的数;ten=ten is 10, one more than 9, so it is not the number the sentence needs=ten 是 10，比 9 多一，不是句子需要的数|nine|i saying its name, with a silent e at the end|i 读字母本音，词尾 e 不发音
      ten|the fingers on two hands;the sum five and five;counting from nine to eleven|ten is 10, and nine is 9, right next to it|ten 是 10，nine 是紧挨着它的 9|nine=nine is 9, one less than 10, so it is not the number the sentence needs=nine 是 9，比 10 少一，不是句子需要的数;eleven=eleven is 11, one more than 10, so it is not the number the sentence needs=eleven 是 11，比 10 多一，不是句子需要的数|ten|the short e, as in *pen*|短元音 e，和 *pen* 一样
      eleven|the sum ten and one;counting from ten to twelve;the players of a football team|eleven is 11, and ten is 10, right next to it|eleven 是 11，ten 是紧挨着它的 10|ten=ten is 10, one less than 11, so it is not the number the sentence needs=ten 是 10，比 11 少一，不是句子需要的数;twelve=twelve is 12, one more than 11, so it is not the number the sentence needs=twelve 是 12，比 11 多一，不是句子需要的数|e · lev · en|the e at the start and the ending -ven|开头是 e，结尾是 -ven
      twelve|the months in a year;the sum six and six;counting from ten to twelve|twelve is 12, and ten is 10, right next to it|twelve 是 12，ten 是紧挨着它的 10|ten=ten is 10, less than 12, so it is not the number the sentence needs=ten 是 10，比 12 少，不是句子需要的数;eleven=eleven is 11, one less than 12, so it is not the number the sentence needs=eleven 是 11，比 12 少一，不是句子需要的数|twelve|lve at the end, with a silent e|结尾是 lve，e 不发音
    `,
  },
});

const colors = vocabularyTopic({
  id: "pre-a1-words-colors",
  title: t("Colors", "颜色"),
  summary: t("The names of the colors.", "颜色的名称。"),
  intro: t(
    "Grass is **green**, the sky is **blue** and bananas are **yellow**. These words help you name the colors of the things around you.",
    "草是 **green**（绿色），天是 **blue**（蓝色），香蕉是 **yellow**（黄色）。这些词帮你说出身边东西的颜色。",
  ),
  prerequisites: [],
  words: [
    word(
      "color colors",
      "what we call red, blue, green and the others",
      "颜色",
      "What {color} is your bag? It's red. | Red is my best {color}. | My pens are many {colors}: red, blue and green.|names years",
      "name year",
    ),
    word(
      "red",
      "the color of fire and of a stop light",
      "红色；红色的",
      "Stop! The light is {red}. | A fire truck is {red}. | Tomatoes are {red}.",
      "blue green",
    ),
    word(
      "blue",
      "the color of the sky on a sunny day",
      "蓝色；蓝色的",
      "The sky is {blue}. | The sea is {blue}, like the sky. | Mix yellow and {blue} to make green.",
      "green pink",
    ),
    word(
      "green",
      "the color of grass and leaves",
      "绿色；绿色的",
      "Grass is {green}. | Go! The light is {green}. | Mix blue and yellow to make {green}.",
      "blue red",
    ),
    word(
      "yellow",
      "the color of bananas and the sun",
      "黄色；黄色的",
      "Bananas are {yellow}. | The sun is {yellow}. | Lemons are {yellow}.",
      "blue black",
    ),
    word(
      "black",
      "the darkest color, the color of the sky at night",
      "黑色；黑色的",
      "Night is dark. The sky is {black}. | A panda is {black} and white. | Crows are {black} birds.",
      "white yellow",
    ),
    word(
      "white",
      "the color of snow and milk",
      "白色；白色的",
      "Snow is {white}. | Milk is {white}. | Clouds on a sunny day are {white}.",
      "black green",
    ),
    word(
      "orange oranges",
      "a color like red and yellow together; also a round, sweet fruit of this color",
      "橙色；橙子",
      "Mix red and yellow to make {orange}. | Carrots are {orange}. | A tiger is {orange} and black. | I eat two {oranges} for breakfast. They are sweet.|blues greens",
      "blue green",
    ),
    word(
      "pink",
      "a light red color",
      "粉红色；粉红色的",
      "Mix red and white to make {pink}. | A pig is {pink}. | Strawberry ice cream is {pink}.",
      "green black",
    ),
    word(
      "brown",
      "the color of chocolate and of wood",
      "棕色；棕色的",
      "Chocolate is {brown}. | A bear is {brown}. | Mud is {brown}.",
      "green blue",
    ),
    word(
      "purple",
      "a color like red and blue together",
      "紫色；紫色的",
      "Mix red and blue to make {purple}. | Grapes are {purple}. | An eggplant is {purple}.",
      "orange yellow",
    ),
    word(
      "gray",
      "a color like black and white together",
      "灰色；灰色的",
      "Mix black and white to make {gray}. | An elephant is {gray}. | Rain clouds are dark {gray}.",
      "pink brown",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "Think of the thing in the sentence and its color: grass, snow, the sky, bananas. A sentence with *mix* puts two colors together, so red and yellow make *orange*.",
        "想一想句中的东西是什么颜色：草、雪、天空、香蕉。带 *mix* 的句子是把两种颜色混在一起，比如红和黄混成 *orange*。",
      ),
      meaning: t(
        "Each meaning names something of that color: fire for *red*, the sky for *blue*, snow and milk for *white*, chocolate for *brown*. Picture the thing, then pick its color.",
        "每个释义都提到一样这种颜色的东西：火是 *red*，天空是 *blue*，雪和牛奶是 *white*，巧克力是 *brown*。先想出那样东西，再选它的颜色。",
      ),
      spell: t(
        "*Yellow* has a double l, *purple* ends in -ple, *gray* ends in -ay, and *color* ends in -or.",
        "*yellow* 双写 l，*purple* 以 -ple 结尾，*gray* 以 -ay 结尾，*color* 以 -or 结尾。",
      ),
    },
    notes: `
      color|asking about a bag answered with red;red as my best one;red, blue and green pens|a color is red, blue or green; a name is what someone is called|color 是红、蓝、绿这样的颜色；name 是名字|name/names=name is what we call a person or a thing, not red, blue or green=name 是人或东西的名字，不是红、蓝、绿;year/years=year is a time of twelve months, not red, blue or green=year 是十二个月的时间，不是红、蓝、绿|col · or|the ending -or, not -er|结尾是 -or，不是 -er
      red|a stop light;a fire truck;tomatoes|red is the color of fire; green is the color of grass|red 是火的颜色；green 是草的颜色|blue=blue is the color of the sky, not of fire or a stop light=blue 是天空的颜色，不是火或停车灯的颜色;green=green is the color of grass and of the light that says go, not of a stop light=green 是草和通行灯的颜色，不是停车灯的颜色|red|the short e, and d at the end|短元音 e，结尾是 d
      blue|the sky;the sea like the sky;yellow mixed to make green|blue is the color of the sky; green is the color of grass|blue 是天空的颜色；green 是草的颜色|green=green is the color of grass and leaves, not of the sky on a sunny day=green 是草和叶子的颜色，不是晴天天空的颜色;pink=pink is a light red, not the color of the sky or the sea=pink 是浅红色，不是天空或大海的颜色|blue|ue at the end, said like oo|结尾是 ue，读作 oo
      green|grass;the light that says go;blue and yellow mixed|green is the color of grass; blue is the color of the sky|green 是草的颜色；blue 是天空的颜色|blue=blue is the color of the sky, not of grass, and it is one of the colors you mix to make green=blue 是天空的颜色，不是草的颜色，而且是混成绿色的颜色之一;red=red is the color of fire and of the light that says stop, not go=red 是火和停车灯的颜色，不是通行的颜色|green|the double e|两个 e
      yellow|bananas;the sun;lemons|yellow is the color of bananas and the sun; black is the darkest color|yellow 是香蕉和太阳的颜色；black 是最深的颜色|blue=blue is the color of the sky, not of bananas, the sun or lemons=blue 是天空的颜色，不是香蕉、太阳或柠檬的颜色;black=black is the darkest color, not the bright color of the sun=black 是最深的颜色，不是太阳那样明亮的颜色|yel · low|the double l and ow at the end|双写 l，结尾是 ow
      black|the dark sky at night;a panda with white;crows|black is the darkest color; white is the color of snow|black 是最深的颜色；white 是雪的颜色|white=white is the color of snow and milk, not the darkest color=white 是雪和牛奶的颜色，不是最深的颜色;yellow=yellow is the bright color of bananas, not a dark one=yellow 是香蕉那样明亮的颜色，不是深色|black|ck at the end|结尾是 ck
      white|snow;milk;clouds on a sunny day|white is the color of snow; black is the darkest color|white 是雪的颜色；black 是最深的颜色|black=black is the darkest color, not the color of snow or milk=black 是最深的颜色，不是雪或牛奶的颜色;green=green is the color of grass, not of snow or milk=green 是草的颜色，不是雪或牛奶的颜色|white|the silent h after w, and a silent e at the end|w 后面的 h 不发音，词尾 e 不发音
      orange|red and yellow mixed;carrots;a tiger with black;sweet fruit for breakfast|orange is red and yellow together, and a fruit too; blue is the color of the sky|orange 是红黄混成的颜色，也是一种水果；blue 是天空的颜色|blue/blues=blue is the color of the sky, not red and yellow together, and it is not a fruit=blue 是天空的颜色，不是红黄混成的，也不是水果;green/greens=green is the color of grass, not red and yellow together, and it is not a fruit=green 是草的颜色，不是红黄混成的，也不是水果|or · ange|the ending -ange, and -s for the fruit when there is more than one|结尾是 -ange；表示多个橙子时加 -s
      pink|red and white mixed;a pig;strawberry ice cream|pink is a light red; green is the color of grass|pink 是浅红色；green 是草的颜色|green=green is the color of grass, not a light red=green 是草的颜色，不是浅红色;black=black is the darkest color, not a light one=black 是最深的颜色，不是浅色|pink|nk at the end|结尾是 nk
      brown|chocolate;a bear;mud|brown is the color of chocolate; green is the color of grass|brown 是巧克力的颜色；green 是草的颜色|green=green is the color of grass and leaves, not of chocolate, bears or mud=green 是草和叶子的颜色，不是巧克力、熊或泥巴的颜色;blue=blue is the color of the sky, not of chocolate, bears or mud=blue 是天空的颜色，不是巧克力、熊或泥巴的颜色|brown|ow, said as in *now*|ow 的读音和 *now* 一样
      purple|red and blue mixed;grapes;an eggplant|purple is red and blue together; orange is red and yellow together|purple 是红蓝混成的；orange 是红黄混成的|orange=orange is red and yellow together, not red and blue=orange 是红黄混成的，不是红蓝混成的;yellow=yellow is the bright color of bananas, not red and blue together=yellow 是香蕉那样明亮的颜色，不是红蓝混成的|pur · ple|ur in the middle and the ending -ple|中间是 ur，结尾是 -ple
      gray|black and white mixed;an elephant;dark rain clouds|gray is black and white together; pink is red and white together|gray 是黑白混成的；pink 是红白混成的|pink=pink is red and white together, not black and white=pink 是红白混成的，不是黑白混成的;brown=brown is the color of chocolate and wood, not black and white together=brown 是巧克力和木头的颜色，不是黑白混成的|gray|ay at the end, the American spelling|结尾是 ay，这是美式拼法
    `,
  },
});

const howMany = vocabularyTopic({
  id: "pre-a1-words-how-many",
  title: t("What, How Many, How Old", "什么、多少、几岁"),
  summary: t("Question words, a, an and the, and and not.", "疑问词、a、an 和 the，以及 and 和 not。"),
  intro: t(
    '"**What** is your name? **How** **old** are you? **How many** pets do you have?" These words help you ask questions and use the little words *a*, *an*, *the*, *and* and *not*.',
    "“你叫 **what**（什么）名字？你 **how old**（几岁）了？你有 **how many**（多少）只宠物？”这些词帮你提问，并用好 *a*、*an*、*the*、*and*、*not* 这些小词。",
  ),
  prerequisites: ["pre-a1-words-i-and-you"],
  words: [
    word(
      "what what's",
      "the word you use to ask about a thing",
      "什么",
      "{What} is your name? | {What's} this? It's a pen.|How's Who's | {What} color is it? It's red. | {What} is that? It is a book.",
      "how who",
    ),
    word(
      "how",
      "the word you use to ask in what way, or how much",
      "怎样；多么；多少",
      "{How} are you? I'm fine. | {How} old are you? I'm eight. | {How} many cats do you have?",
      "what where",
    ),
    word(
      "many",
      "a large number of; in a question, what number",
      "许多；（提问时）多少",
      "How {many} pens do you have? | How {many} books are there? Ten. | I have {many} friends at school: ten or more!",
      "much old",
    ),
    word(
      "old older oldest",
      "having lived for many years; also used to say how many years someone has lived",
      "老的；旧的；……岁的",
      "How {old} are you? I'm seven. | I am ten years {old}. | My grandpa is very {old}. He is eighty-five.",
      "many big",
    ),
    word(
      "year years",
      "a time of twelve months",
      "年；岁",
      "I am eight {years} old.|names colors | There are twelve months in a {year}. | Happy New {Year}!",
      "name color",
    ),
    word(
      "a",
      "one; used before a word that starts with a sound like b, c or d",
      "一（个）（用在辅音开头的词前）",
      "I have {a} dog. The dog is black. | My mom is {a} teacher, and my dad is a doctor. | There is {a} big egg in the box.",
      "an the",
    ),
    word(
      "an",
      "one; used before a word that starts with a sound like a, e, i, o or u",
      "一（个）（用在元音开头的词前）",
      "There is {an} egg in the nest. | I eat {an} apple every day. | Grandpa is {an} old man now. | My friend has {an} orange cat.",
      "a the",
    ),
    word(
      "the",
      "the word before a thing we both know about",
      "这个；那个（特指）",
      "Open {the} door, please. | {The} sun is yellow. | Look at {the} moon!",
      "a an",
    ),
    word(
      "and",
      "a word that joins two words or ideas",
      "和；而且",
      "I have a cat {and} a dog. | Tom {and} I are friends. | Red {and} yellow make orange.",
      "or but",
    ),
    word(
      "not",
      "a word that makes a sentence say no",
      "不；没有",
      "I am {not} sad. I am happy. | It is {not} a cat. It is a dog. | She is {not} at home today. She is at school.",
      "no very",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "Look at the answer after the question: a thing answers *what*, an age answers *how old*, and a number answers *how many*.",
        "看问题后面的回答：回答是东西就用 *what*，是年龄就用 *how old*，是数目就用 *how many*。",
      ),
      meaning: t(
        "*A* and *an* both mean one; *the* is for one thing we both know about. *And* joins two things; *not* makes a sentence say no.",
        "*a* 和 *an* 都表示“一个”；*the* 指双方都知道的那一个。*and* 把两样东西连起来；*not* 让句子变成否定。",
      ),
      spell: t(
        "Choose by the first sound of the next word: *an egg*, *an apple*, *an old man*, but *a dog* and *a big egg*.",
        "看后面那个词的第一个音来选：*an egg*、*an apple*、*an old man*，但是 *a dog*、*a big egg*。",
      ),
    },
    notes: `
      what|asking for a name;asking about a pen;asking about red;asking about a book|what asks about a thing; how asks in what way|what 问东西；how 问怎样|how/how's=how asks in what way or how someone is, but the answer here names a thing=how 问的是怎样，可回答说的是东西;who/who's=who asks about a person, but the answer here names a thing=who 问的是人，可回答说的是东西|what|wh at the start, with a silent h|开头是 wh，h 不发音
      how|asking how you are;asking an age;asking a number of cats|how asks in what way or how much; what asks about a thing|how 问怎样或多少；what 问东西|what=what asks about a thing, and it does not go before *old* or *many* or answer *I'm fine*=what 问东西，不和 *old*、*many* 连用，也不用 *I'm fine* 回答;where=where asks about a place, but the answer here is not a place=where 问的是地点，可回答说的不是地点|how|ow, said as in *cow*|ow 的读音和 *cow* 一样
      many|asking a number of pens;asking a number of books, answered with ten;ten or more friends|many goes with things you count, like pens; much goes with things you cannot count, like milk|many 跟可数的东西，比如 pens；much 跟不可数的东西，比如 milk|much=much goes with things you cannot count, like milk, not with pens, books or friends=much 跟牛奶这类不可数的东西，不跟 pens、books、friends;old=old says how many years someone has lived, not how many things there are=old 说的是年龄，不是东西有多少|ma · ny|a said like the short e in *pen*, and y at the end|a 读作 *pen* 里的短 e，结尾是 y
      old|asking an age;ten years;a grandpa of eighty-five|old is about years lived; many is about a number of things|old 说的是年龄；many 说的是数目|many=many asks or tells a number of things, and it needs a noun like *pens* after it=many 问或说东西的数目，后面要跟 *pens* 这样的名词;big=big means large in size, not how many years someone has lived=big 是个头大，不是年龄|old|ld at the end|结尾是 ld
      year|being eight;twelve months;a new one starting|a year is twelve months; a name is what someone is called|year 是十二个月；name 是名字|name/names=name is what someone is called, not a time of twelve months=name 是名字，不是十二个月的时间;color/colors=color is red, blue or green, not a time of twelve months=color 是红、蓝、绿这样的颜色，不是十二个月的时间|year|ear after y, said like the word *ear* with y in front|y 后面是 ear，读音像 *ear* 前面加 y
      a|a dog first named, then called the dog;a job for my mom;a big egg in a box|a goes before a consonant sound; an goes before a vowel sound|a 用在辅音开头的词前；an 用在元音开头的词前|an=an goes before a vowel sound, as in *an egg*, not before *dog*, *teacher* or *big*=an 用在元音开头的词前，比如 *an egg*，不用在 *dog*、*teacher*、*big* 前;the=the is for a thing we both already know about, but here the thing is new=the 指双方都知道的东西，可这里是第一次说到|a|that it is said like *uh* before a word, not like the name of the letter|它在词前读作 *uh*，不读字母名
      an|an egg in a nest;an apple every day;an old man;an orange cat|an goes before a vowel sound; a goes before a consonant sound|an 用在元音开头的词前；a 用在辅音开头的词前|a=a goes before a consonant sound, but *egg*, *apple*, *old* and *orange* start with a vowel sound=a 用在辅音开头的词前，可 *egg*、*apple*、*old*、*orange* 都以元音开头;the=the is for a thing we both already know about, but here the thing is new or one of many=the 指双方都知道的东西，可这里是新的或许多中的一个|an|n after a, used before a vowel sound|a 后面加 n，用在元音开头的词前
      the|a door we both know;the one sun;the one moon|the is for a thing we both know about; a is for any one thing|the 指双方都知道的那个；a 指任意一个|a=a is for any one thing that is new, but there is only one sun and one moon, and we both know the door=a 指新提到的任意一个，可太阳和月亮只有一个，那扇门双方也都知道;an=an is for any one thing before a vowel sound, but *door*, *sun* and *moon* start with a consonant=an 用在元音开头的词前，可 *door*、*sun*、*moon* 都以辅音开头|the|th at the start and e at the end|开头是 th，结尾是 e
      and|a cat and a dog together;Tom and me;red and yellow together|and puts two things together; or gives a choice|and 把两样连在一起；or 表示选择|or=or gives a choice between two things, but here both are together=or 表示二选一，可这里两样都在;but=but joins two ideas that go against each other, not two things that go together=but 连接相反的两件事，不是连接放在一起的两样|and|nd at the end|结尾是 nd
      not|being happy, not sad;being a dog, not a cat;being at school, not at home|not makes a sentence say no; very makes a word stronger|not 表示否定；very 用来加强|no=no answers a question or goes before a noun, as in *no pens*, but it cannot follow *is* or *am* to make a sentence say no=no 用来回答问题或放在名词前，比如 *no pens*，但不能跟在 *is*、*am* 后面表示否定;very=very makes a describing word stronger, so it cannot make a sentence say no=very 用来加强形容词，不能让句子变成否定|not|o for the short sound, and t at the end|o 发短音，结尾是 t
    `,
  },
});

// A and an.

/** consonantNouns start with a consonant sound and take a. */
const consonantNouns: readonly string[] = [
  "pen",
  "book",
  "cat",
  "dog",
  "bag",
  "desk",
  "red apple",
  "big egg",
  "chair",
  "girl",
  "boy",
  "ruler",
  "pencil",
];

/** vowelNouns start with a vowel sound and take an. */
const vowelNouns: readonly string[] = ["egg", "apple", "orange", "eraser", "elephant", "old book", "umbrella", "ant", "owl", "ear", "eye"];

/** articleFrames read naturally with every noun of both lists: they point at a thing, an animal or a person. */
const articleFrames: readonly string[] = ["It is ___ X.", "This is ___ X.", "That is ___ X.", "I see ___ X.", "Here is ___ X."];

const articleChoiceBank: readonly ChoiceItem[] = interleave([
  everyPair(consonantNouns, articleFrames).map(([noun, frame]): ChoiceItem => [frame.replace("X", noun), "a", ["an"]]),
  everyPair(vowelNouns, articleFrames).map(([noun, frame]): ChoiceItem => [frame.replace("X", noun), "an", ["a"]]),
]);

const missingArticleBank: readonly TypedItem[] = everyPair(
  interleave<readonly [string, "a" | "an"]>([consonantNouns.map((n) => [n, "a"] as const), vowelNouns.map((n) => [n, "an"] as const)]),
  articleFrames.map((f) => f.replace("___ ", "")),
).map(([[noun, article], frame]): TypedItem => {
  const other = article === "a" ? "an" : "a";
  return {
    shown: frame.replace("X", noun),
    accepted: [frame.replace("X", `${article} ${noun}`)],
    wrong: [frame.replace("X", noun), frame.replace("X", `${other} ${noun}`)],
  };
});

/** nextWord finds the word right after the gap of a sentence, the one that decides between a and an. */
const nextWord = (shown: string) => (shown.split("___ ")[1] ?? "").split(/[ .]/u)[0] ?? "";

/** soundOf says how the word after the article starts and which article that sound takes. */
const soundOf = (article: string, next: string): Text =>
  article === "an"
    ? t(`*${next}* starts with a vowel sound, so it takes *an*`, `*${next}* 以元音开头，所以用 *an*`)
    : t(`*${next}* starts with a consonant sound, so it takes *a*`, `*${next}* 以辅音开头，所以用 *a*`);

const aAndAn: TopicDef = {
  id: "a-and-an",
  title: t("A and An", "a 和 an"),
  summary: t("One thing takes a or an: a pen, an egg.", "一个东西前面要用 a 或 an：a pen、an egg。"),
  intro: t(
    "Compare *an umbrella* with *a red umbrella*: both name one umbrella, yet *an* changes to *a* because the word directly after it starts with a consonant sound (*red*). In this topic, you pick *a* or *an* by the very next sound and fix sentences that drop the article before a singular noun.",
    "比较 *an umbrella* 和 *a red umbrella*：说的都是一把伞，但 *an* 变成了 *a*，因为紧跟其后的词 *red* 以辅音开头。本主题带你按紧随其后的发音选择 *a* 或 *an*，并补全单数名词前漏掉的冠词。",
  ),
  prerequisites: ["pre-a1-words-how-many"],
  encompasses: [{ topic: "pre-a1-words-how-many", weight: 0.3 }],
  xp: 15,
  strand: "grammar",
  knowledgePoints: [
    point(
      "choose",
      t("A or an?", "用 a 还是 an？"),
      t(
        "Use *an* when the next word starts with the sound of *a*, *e*, *i*, *o* or *u*: *an egg*, *an apple*, *an old book*. Use *a* before other sounds: *a pen*, *a big egg*.\n\nLook at the word right after it, not at the noun: *a big egg*, but *an egg*.\n\n> **Watch out.** Always check the word *immediately* after the blank—an adjective like *red* or *old* sits between the article and the noun and decides between *a* and *an*.",
        "下一个词以 *a*、*e*、*i*、*o*、*u* 的音开头时用 *an*：*an egg*、*an apple*、*an old book*。其他音前面用 *a*：*a pen*、*a big egg*。\n\n要看紧跟在后面的那个词，而不是名词：*a big egg*，但 *an egg*。\n\n> **注意。** 永远只看*紧挨着*空白的那个词——像 *red*、*old* 这样的形容词夹在冠词和名词中间时，由它来决定用 *a* 还是 *an*。",
      ),
      choiceGenerator(
        t("Choose a or an.", "选择 a 或 an。"),
        articleChoiceBank,
        (right, shown) => {
          const sound = soundOf(right, nextWord(shown));
          return t(
            `The word after the gap decides: ${sound.en}. ${shown.replace("___", `*${right}*`)}\n\n**Check.** Say *${right} ${nextWord(shown)}* aloud—the opening sound of *${nextWord(shown)}* pairs smoothly with *${right}*.`,
            `看空白后面的那个词：${sound["zh-CN"]}。${shown.replace("___", `*${right}*`)}\n\n**检验。** 把 *${right} ${nextWord(shown)}* 读出来——*${nextWord(shown)}* 的开头音正好与 *${right}* 搭配。`,
          );
        },
        (wrong, _right, shown) => {
          const next = nextWord(shown);
          return wrong === "an"
            ? t(
                `*an* goes before a vowel sound, but *${next}* starts with a consonant sound.`,
                `*an* 用在元音前，但 *${next}* 以辅音开头。`,
              )
            : t(`*a* goes before a consonant sound, but *${next}* starts with a vowel sound.`, `*a* 用在辅音前，但 *${next}* 以元音开头。`);
        },
      ),
    ),
    point(
      "do-not-leave-out",
      t("Never leaving out a or an", "不要漏掉 a 或 an"),
      t(
        "When you talk about one thing, English needs *a* or *an* before it: *It is a pen.*, not *It is pen.*\n\n> **Watch out.** Put *a* or *an* before the *whole* noun phrase (including any adjective): write *It is a red apple.*, never *It is red a apple.*",
        "中文说“这是笔”“我有猫”，不需要“一个”；英语说单个的东西时，前面一定要有 *a* 或 *an*：说 *It is a pen.*，不说 *It is pen.*\n\n> **注意。** 把 *a* 或 *an* 放在整个名词短语（含形容词）的最前面：写 *It is a red apple.*，不要写成 *It is red a apple.*",
      ),
      typedGenerator(
        "sentence",
        t("A word is missing. Write the sentence with a or an.", "句子缺了一个词。用 a 或 an 把句子写完整。"),
        missingArticleBank,
        (right, shown) => {
          const article = / an /u.test(right) ? "an" : "a";
          const next = right.split(` ${article} `)[1]?.split(/[ .]/u)[0] ?? "";
          const sound = soundOf(article, next);
          return t(
            `*${shown}* talks about one thing, so it needs *a* or *an*, and ${sound.en}: ${right}\n\n**Check.** Verify that *${article}* sits right before the singular noun phrase and matches the starting sound of *${next}*.`,
            `*${shown}* 说的是单个的东西，所以要有 *a* 或 *an*；${sound["zh-CN"]}：${right}\n\n**检验。** 确认 *${article}* 放在单数名词短语前面，并且与 *${next}* 的开头音一致。`,
          );
        },
        articleNot,
      ),
    ),
  ],
};

// Plurals with -s and -es.

/** sNouns take -s in the plural. */
const sNouns: readonly string[] = ["cat", "dog", "pen", "book", "bag", "desk", "chair", "girl", "boy", "egg", "apple", "pencil", "ruler"];

/** esNouns end in s, x, ch or sh and take -es. */
const esNouns: readonly string[] = ["box", "bus", "glass", "watch", "dish", "fox", "class"];

const counts: readonly string[] = ["two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"];

const plural = (noun: string) => (esNouns.includes(noun) ? `${noun}es` : `${noun}s`);

const pluralChoiceBank: readonly ChoiceItem[] = interleave([
  everyPair(sNouns, counts).map(([noun, count]): ChoiceItem => [`I see ${count} ___. (${noun})`, `${noun}s`, [noun, `${noun}es`]]),
  everyPair(esNouns, counts).map(([noun, count]): ChoiceItem => [`There are ${count} ___. (${noun})`, `${noun}es`, [noun, `${noun}s`]]),
]);

const pluralTypedBank: readonly TypedItem[] = everyPair(interleave([sNouns, esNouns]), ["two", "three", "four", "five", "six", "ten"]).map(
  ([noun, count]): TypedItem => ({
    shown: `one ${noun}, ${count} ___`,
    accepted: [plural(noun)],
    wrong: [noun, esNouns.includes(noun) ? `${noun}s` : `${noun}es`],
  }),
);

/** pluralRule says which ending a plural takes and why. */
const pluralRule = (plural: string): Text => {
  const noun = esNouns.find((n) => plural === `${n}es`);
  return noun
    ? t(
        `*${noun}* ends in *${noun.match(/(ch|sh|s|x)$/u)?.[0]}*, so it adds *-es*`,
        `*${noun}* 以 *${noun.match(/(ch|sh|s|x)$/u)?.[0]}* 结尾，所以加 *-es*`,
      )
    : t(`*${plural.slice(0, -1)}* just adds *-s*`, `*${plural.slice(0, -1)}* 直接加 *-s*`);
};

const pluralNouns: TopicDef = {
  id: "plural-nouns-with-s",
  title: t("One Cat, Two Cats", "一只猫，两只猫"),
  summary: t("More than one takes -s or -es: two cats, three boxes.", "多于一个时，名词加 -s 或 -es：two cats、three boxes。"),
  intro: t(
    "Compare *one desk, four desks* with *one dish, four dishes*: whenever you count more than one thing in English, the noun itself changes at the end, adding *-s* or *-es* depending on its final letters. In this topic, you choose and spell regular plural nouns accurately.",
    "比较 *one desk, four desks* 与 *one dish, four dishes*：英语里只要数量超过一个，名词词尾就会变化，按末尾字母加 *-s* 或 *-es*。本主题带你准确选择并拼写规则复数名词。",
  ),
  prerequisites: ["pre-a1-words-numbers", "a-and-an"],
  encompasses: [{ topic: "pre-a1-words-numbers", weight: 0.3 }],
  xp: 15,
  strand: "grammar",
  knowledgePoints: [
    point(
      "choose",
      t("Adding -s", "加 -s"),
      t(
        "For more than one, add *-s* to the noun: *one cat, two cats*. Add *-es* after *s*, *x*, *ch* and *sh*: *one box, three boxes*; *one watch, two watches*.\n\n> **Watch out.** Do not leave the noun unchanged after a number like *two* or *five*, and only add *-es* when the singular ends in *s*, *x*, *ch*, or *sh*.",
        "中文用量词表示数量（三只猫、两本书），名词本身不变。英语没有量词，但名词要变：多于一个时加 *-s*：*one cat, two cats*。以 *s*、*x*、*ch*、*sh* 结尾的词加 *-es*：*one box, three boxes*；*one watch, two watches*。\n\n> **注意。** 在 *two*、*five* 等数字后面不要漏加复数词尾，同时只有单数以 *s*、*x*、*ch* 或 *sh* 结尾时才加 *-es*。",
      ),
      choiceGenerator(
        t("Choose the word for the gap.", "选出填入空白处的词。"),
        pluralChoiceBank,
        (right, shown) => {
          const rule = pluralRule(right);
          return t(
            `The number says more than one, so the noun is plural, and ${rule.en}: ${shown.replace(/ \(.*\)$/u, "").replace("___", `*${right}*`)}\n\n**Check.** Look at the singular noun's last letters—if they are *s*, *x*, *ch*, or *sh*, add *-es*; otherwise add *-s*.`,
            `数字表示多于一个，所以名词用复数；${rule["zh-CN"]}：${shown.replace(/ \(.*\)$/u, "").replace("___", `*${right}*`)}\n\n**检验。** 看原形名词的末尾字母——是 *s*、*x*、*ch* 或 *sh* 就加 *-es*，其余直接加 *-s*。`,
          );
        },
        (wrong, _right, _shown, position) =>
          position === 0
            ? t(
                `*${wrong}* is the form for one, but the number before the gap says more than one.`,
                `*${wrong}* 是单数形式，可空白前的数字表示多于一个。`,
              )
            : wrong.endsWith("es")
              ? t(
                  `*${wrong}* adds *-es*, but *-es* is only for nouns that end in *s*, *x*, *ch* or *sh*.`,
                  `*${wrong}* 加了 *-es*，可只有以 *s*、*x*、*ch*、*sh* 结尾的名词才加 *-es*。`,
                )
              : t(
                  `*${wrong}* adds only *-s*, which is hard to say after *s*, *x*, *ch* or *sh*; those nouns add *-es*.`,
                  `*${wrong}* 只加了 *-s*，可以 *s*、*x*、*ch*、*sh* 结尾的名词要加 *-es*，否则读不出来。`,
                ),
      ),
    ),
    point(
      "type",
      t("Writing plurals", "写出复数"),
      t(
        "Write the noun for more than one. Most nouns add *-s* (*two books*); nouns that end in *s*, *x*, *ch* or *sh* add *-es* (*three buses*).\n\n> **Watch out.** Check the final letters before you type *-s* or *-es*: words like *bus*, *glass*, *box*, *watch*, and *dish* need *-es*, not just *-s*.",
        "写出名词的复数。大多数名词加 *-s*（*two books*）；以 *s*、*x*、*ch*、*sh* 结尾的名词加 *-es*（*three buses*）。\n\n> **注意。** 输入前先看末尾字母：*bus*、*glass*、*box*、*watch*、*dish* 这类词要加 *-es*，不能只加 *-s*。",
      ),
      typedGenerator(
        "word-form",
        t("Type the missing word.", "输入缺少的词。"),
        pluralTypedBank,
        (right, shown) => {
          const rule = pluralRule(right);
          return t(
            `More than one needs the plural, and ${rule.en}: ${shown.replace("___", `*${right}*`)}\n\n**Check.** Verify the base spelling is untouched and that the ending matches the final letters (*-es* after *s/x/ch/sh*, *-s* otherwise).`,
            `多于一个要用复数；${rule["zh-CN"]}：${shown.replace("___", `*${right}*`)}\n\n**检验。** 确认原词拼写未改动，且词尾与末尾字母匹配（*s/x/ch/sh* 后加 *-es*，其余加 *-s*）。`,
          );
        },
        pluralNot,
      ),
    ),
  ],
};

// Writing: capital letters and periods.

/** capitalSentences are written right: a capital at the start, a capital I and names, and a period or question mark. */
const capitalSentences: readonly string[] = [
  "My name is Ben.",
  "I am seven years old.",
  "What is your name?",
  "How old are you?",
  "It is a red pen.",
  "The sky is blue.",
  "I have a cat and a dog.",
  "Tom and I are friends.",
  "She is not sad.",
  "Is it an egg?",
  "We are in the classroom.",
  "They are my friends.",
  "My bag is green.",
  "How many pens do you have?",
  "I have twelve books.",
  "Lily is my friend.",
  "What color is it?",
  "It is not a cat.",
  "I am happy today.",
  "You are very kind.",
  "Is it blue?",
  "Anna and I are ten.",
  "The cats are white.",
  "He is at school.",
  "What is this?",
  "It is an orange.",
  "Thank you, Ms. Li.",
  "I have three pencils.",
  "Are you a student?",
  "My friends are here.",
  "Grass is green.",
  "Sam is eight years old.",
  "How are you?",
  "I am not at home.",
  "We have two dogs.",
  "Is she your friend?",
];

const careless = (s: string) => s.toLowerCase().replace(/[.?]$/u, "");

const capitalsTypedBank: readonly TypedItem[] = capitalSentences.map(
  (s): TypedItem => ({ shown: careless(s), accepted: [s], wrong: [careless(s), `${careless(s)}.`] }),
);

const capitalsChoiceBank: readonly ChoiceItem[] = capitalSentences.map((s): ChoiceItem => {
  const noCapital = s.charAt(0).toLowerCase() + s.slice(1);
  const noEnd = s.slice(0, -1);
  const wrongEnd = s.endsWith("?") ? `${noEnd}.` : `${noEnd}?`;
  return ["", s, [noCapital, /\sI\b/u.test(s) ? s.replace(/(\s)I\b/u, "$1i") : wrongEnd]];
});

/** endMark names the mark a sentence ends with and why. */
const endMark = (sentence: string): Text =>
  sentence.endsWith("?")
    ? t("a question mark, because it asks something", "问号，因为它在提问")
    : t("a period, because it tells something", "句号，因为它在陈述");

const capitalsAndPeriods: TopicDef = {
  id: "writing-capitals-and-periods",
  title: t("Capital Letters and Periods", "大写字母和句号"),
  summary: t(
    "A sentence begins with a capital letter and ends with a period or a question mark, and I is always a capital.",
    "句子以大写字母开头，以句号或问号结尾，I 永远大写。",
  ),
  intro: t(
    "Compare *anna and i are friends* with *Anna and I are friends.* Every written English sentence has clear boundaries: a capital letter at the start, capitals for *I* and names, and a period (.) or question mark (?) at the end. In this topic, you spot and write sentences with correct capitals and end marks.",
    "比较 *anna and i are friends* 和 *Anna and I are friends.* 英语书面句子有明确的边界：句首字母大写，*I* 和人名大写，句末加句号（.）或问号（?）。本主题带你辨认并写出大小写和句末标点都规范的句子。",
  ),
  prerequisites: ["the-verb-be"],
  encompasses: [{ topic: "the-verb-be", weight: 0.2 }],
  xp: 15,
  strand: "writing",
  knowledgePoints: [
    point(
      "choose",
      t("Spotting the right sentence", "找出写对的句子"),
      t(
        "A sentence starts with a capital letter: *My*, not *my*. It ends with a period (.), or with a question mark (?) when it asks something. The word *I* and names like *Ben* always start with a capital.\n\n> **Watch out.** Check *all three* places before picking: the very first letter, every *I* or person's name inside the sentence, and whether the sentence tells (.) or asks (?).",
        "英语句子以大写字母开头：写 *My*，不写 *my*。陈述句以句号（.）结尾——注意英语句号是一个小圆点，不是中文的“。”；问句以问号（?）结尾。*I* 和 *Ben* 这样的名字永远大写。\n\n> **注意。** 选择前检查*三处*：句首第一个字母、句中所有的 *I* 和人名，以及句子是在陈述（.）还是在提问（?）。",
      ),
      choiceGenerator(
        t("Which sentence is written right?", "哪个句子写对了？"),
        capitalsChoiceBank,
        (right) => {
          const end = endMark(right);
          return t(
            `${right} It starts with a capital letter, writes *I* and names with capitals, and ends with ${end.en}.\n\n**Check.** Scan left to right: capital at the start, every *I* and name capitalized, and the end mark matches whether the sentence tells or asks.`,
            `${right} 句首大写，*I* 和名字大写，句末用${end["zh-CN"]}。\n\n**检验。** 从左到右扫一遍：句首大写，所有 *I* 和人名大写，句末标点与陈述或提问一致。`,
          );
        },
        (wrong, right) =>
          wrong.charAt(0) !== right.charAt(0)
            ? t(
                "This sentence starts with a small letter, but a sentence always starts with a capital.",
                "这个句子以小写字母开头，可句子总要以大写字母开头。",
              )
            : wrong.slice(-1) !== right.slice(-1)
              ? t(
                  "This sentence ends with the wrong mark: a question ends with ?, and a sentence that tells something ends with a period.",
                  "这个句子的句末标点不对：问句以 ? 结尾，陈述句以句号结尾。",
                )
              : t(
                  "This sentence writes *I* as a small *i*, but the word *I* is always a capital.",
                  "这个句子把 *I* 写成了小写 *i*，可 *I* 永远大写。",
                ),
      ),
    ),
    point(
      "write",
      t("Writing sentences right", "正确地写句子"),
      t(
        "Copy the sentence with a capital letter at the start, capitals for *I* and for names, and a period or a question mark at the end: *how old are you* → *How old are you?*\n\n> **Watch out.** Do not forget capitals *inside* the sentence (like *Tom*, *Ms. Li*, or *I*), and use `?` if the sentence starts with a question word or verb (*What*, *How*, *Is*, *Are*).",
        "抄写句子：句首大写，*I* 和名字大写，句末加句号或问号，例如 *how old are you* → *How old are you?*\n\n> **注意。** 别忘了句中的大写（如 *Tom*、*Ms. Li* 和 *I*）；以疑问词或动词（*What*、*How*、*Is*、*Are*）开头的问句要以 `?` 结尾。",
      ),
      typedGenerator(
        "sentence",
        t("Write the sentence again with capital letters and a period or question mark.", "重写句子，加上大写字母和句号或问号。"),
        capitalsTypedBank,
        (right) => {
          const end = endMark(right);
          return t(
            `Start with a capital letter, write *I* and names with capitals, and end with ${end.en}: ${right}\n\n**Check.** Check three spots in your sentence: first letter capitalized, any *I* or name capitalized, and a final period or question mark.`,
            `句首大写，*I* 和名字大写，句末用${end["zh-CN"]}：${right}\n\n**检验。** 核对句子里的三处：首字母大写、句中 *I* 和人名大写，以及末尾的句号或问号。`,
          );
        },
        capitalsNot,
      ),
    ),
  ],
};

/** topics are the topics of the unit Numbers and Colors. */
export const topics: readonly TopicDef[] = [numbers.topic, colors.topic, howMany.topic, aAndAn, pluralNouns, capitalsAndPeriods];

/** vocabulary are the words the unit Numbers and Colors teaches. */
export const vocabulary: readonly WordBatch[] = [numbers.batch, colors.batch, howMany.batch];
