// Pre-A1, unit 3: My Family. Family and people, my and your, he, she and it, and have and has.

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { everyPair, interleave, sentenceCase, vocabularyTopic, word } from "../words.ts";
import { haveNot, heSheItNot, possessiveNot } from "./mistakes.ts";

const family = vocabularyTopic({
  id: "pre-a1-words-family",
  title: t("Family", "家人"),
  summary: t("The people in a family, and the question word who.", "家庭成员，以及疑问词 who。"),
  intro: t(
    "This is my **family**: my **mom**, my **dad**, my big **brother** and the new **baby**. These words help you talk about the people in your family and ask who someone is.",
    "这是我的 **family**（家人）：**mom**（妈妈）、**dad**（爸爸）、**brother**（哥哥）和刚出生的 **baby**（宝宝）。这些词帮你谈论家里的人，并问别人是谁。",
  ),
  prerequisites: ["pre-a1-words-hello"],
  words: [
    word(
      "family families",
      "a mother, a father and their children",
      "家；家庭；家人",
      "There are four people in my {family}. | My {family} is big: Mom, Dad, two sisters and me. | Many {families} have a mom, a dad and children.|friends babies",
      "friend baby",
    ),
    word(
      "mother mothers",
      "a woman who has a child",
      "母亲",
      "My {mother} is a teacher. She is kind. | Ann is the {mother} of two children. She loves them. | His father is Tom, and his {mother} is Ann.",
      "father brother",
    ),
    word(
      "father fathers",
      "a man who has a child",
      "父亲",
      "My {father} is a doctor. He is tall. | Mr. Wang is the {father} of one girl. | My {father} and his brother are farmers. They are tall men.",
      "mother sister",
    ),
    word(
      "mom moms",
      "mother, as a child says it",
      "妈妈",
      "Happy Mother's Day, {Mom}! | My {mom} is a nurse. She works at night. | {Mom} is in the kitchen. She is making lunch.",
      "dad brother",
    ),
    word(
      "dad dads",
      "father, as a child says it",
      "爸爸",
      "Happy Father's Day, {Dad}! | My {dad} is tall. He has short hair. | {Dad} is in the garden. He is with the dog.",
      "mom sister",
    ),
    word(
      "sister sisters",
      "a girl or woman with the same mother and father as you",
      "姐姐；妹妹",
      "Anna is my {sister}. She is six. | I have two brothers and one {sister}. She is the baby of the family. | My {sisters} are both girls with long hair.|brothers dads",
      "brother dad",
    ),
    word(
      "brother brothers",
      "a boy or man with the same mother and father as you",
      "哥哥；弟弟",
      "Tom is my {brother}. He is nine. | My big {brother} is fifteen. He is tall. | I have two {brothers}. They are boys.|sisters moms",
      "sister mom",
    ),
    word(
      "baby babies",
      "a very young child",
      "婴儿",
      "The {baby} is one month old. She sleeps a lot. | A {baby} can't walk or talk. | Our cat has three {babies}.|grandpas dads",
      "grandpa dad",
    ),
    word(
      "grandma grandmas",
      "the mother of your mother or of your father",
      "奶奶；外婆",
      "My {grandma} is my mom's mother. | {Grandma} is eighty. She is my dad's mom. | My two {grandmas} are my mom's mother and my dad's mother.|grandpas sisters",
      "grandpa sister",
    ),
    word(
      "grandpa grandpas",
      "the father of your mother or of your father",
      "爷爷；外公",
      "My {grandpa} is my dad's father. | {Grandpa} is very old. He is my mom's dad. | My {grandpa} has a long white beard.",
      "grandma sister",
    ),
    word(
      "who who's",
      "the word you use to ask about a person",
      "谁",
      "{Who} is she? She is my sister. | {Who's} that man? He's my dad.|What's How's | {Who} is your best friend? It's Sam.",
      "what how",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "Look for *he* or *she* near the gap: *mother*, *mom*, *sister* and *grandma* go with *she*; *father*, *dad*, *brother* and *grandpa* go with *he*.",
        "找空格附近的 *he* 或 *she*：*mother*、*mom*、*sister*、*grandma* 对应 *she*；*father*、*dad*、*brother*、*grandpa* 对应 *he*。",
      ),
      meaning: t(
        "*Grandma* and *grandpa* are the parents of your mom or dad; *sister* and *brother* have the same parents as you. Then check whether the meaning says woman or man.",
        "*grandma* 和 *grandpa* 是爸爸或妈妈的父母；*sister* 和 *brother* 和你有同样的父母。再看释义说的是女的还是男的。",
      ),
      spell: t(
        "*Family* and *baby* change y to -ies for more than one: *families*, *babies*. *Mom* and *Dad* take a capital letter when you call someone by them.",
        "*family* 和 *baby* 的复数要把 y 变成 -ies：*families*、*babies*。把 *Mom*、*Dad* 当称呼时要大写。",
      ),
    },
    notes: `
      family|four people at home;Mom, Dad, two sisters and me;a mom, a dad and children|a family is parents and their children; a friend is someone you like who is not family|family 是父母和孩子；friend 是你喜欢的人，但不是家人|friend/friends=friend is one person you like and play with, not a mother, a father and their children=friend 是一起玩的朋友，不是父母和孩子组成的家;baby=baby is one very young child, not a whole group of people=baby 是一个很小的孩子，不是一家人|fam · i · ly|the i in the middle, and y changing to -ies in *families*|中间是 i；复数 *families* 要把 y 变成 -ies
      mother|a kind teacher called she;a woman who loves her two children;Ann, the woman next to his father|a mother is a woman; a father is a man|mother 是女的；father 是男的|father=father is a man who has a child, so he is not called *she*=father 是有孩子的男人，不会用 *she* 指他;brother=brother is a boy or man with the same parents as you, not a woman with a child=brother 是和你同父母的男孩或男人，不是有孩子的女人|moth · er|o said like the u in *mum*, and th in the middle|o 读作 *mum* 里 u 的音，中间是 th
      father|a tall doctor called he;Mr. Wang and his girl;a tall man who is a farmer|a father is a man; a mother is a woman|father 是男的；mother 是女的|mother=mother is a woman who has a child, not a man called *he*=mother 是有孩子的女人，不是用 *he* 指的男人;sister=sister is a girl or woman with the same parents as you, not a man with a child=sister 是和你同父母的女孩或女人，不是有孩子的男人|fa · ther|a said like the a in *car*, and th in the middle|a 的读音和 *car* 里一样，中间是 th
      mom|Mother's Day;a nurse called she;a woman making lunch|mom is a child's word for mother; dad is for father|mom 是孩子对妈妈的叫法；dad 是对爸爸的叫法|dad=dad is a child's word for father, a man, not for a woman called *she*=dad 是孩子对爸爸的叫法，是男的，不用 *she* 指;brother=brother is a boy or man with the same parents as you, not your mother=brother 是和你同父母的男孩或男人，不是妈妈|mom|m at both ends with a short o|首尾都是 m，中间是短元音 o
      dad|Father's Day;a tall man with short hair;a man in the garden|dad is a child's word for father; mom is for mother|dad 是孩子对爸爸的叫法；mom 是对妈妈的叫法|mom=mom is a child's word for mother, a woman, not for a man called *he*=mom 是孩子对妈妈的叫法，是女的，不用 *he* 指;sister=sister is a girl or woman with the same parents as you, not your father=sister 是和你同父母的女孩或女人，不是爸爸|dad|d at both ends with a short a|首尾都是 d，中间是短元音 a
      sister|Anna, who is six;one girl, the baby of the family;girls with long hair|a sister is a girl; a brother is a boy|sister 是女孩；brother 是男孩|brother=brother is a boy or man, so he is not called *she* or a girl=brother 是男孩或男人，不用 *she* 指，也不是女孩;dad=dad is your father, a grown-up man, not a girl with the same parents as you=dad 是爸爸，是成年男人，不是和你同父母的女孩|sis · ter|the ending -er|结尾是 -er
      brother|Tom, who is nine;a tall boy of fifteen;two boys|a brother is a boy; a sister is a girl|brother 是男孩；sister 是女孩|sister=sister is a girl or woman, so she is not called *he* or a boy=sister 是女孩或女人，不用 *he* 指，也不是男孩;mom=mom is your mother, a grown-up woman, not a boy with the same parents as you=mom 是妈妈，是成年女人，不是和你同父母的男孩|broth · er|o said like the u in *mum*, and th in the middle|o 读作 *mum* 里 u 的音，中间是 th
      baby|a child one month old;a child who can't walk or talk;a cat's three young ones|a baby is very young; a grandpa is very old|baby 很小；grandpa 很老|grandpa=grandpa is a very old man, the father of a parent, not a very young child=grandpa 是爸爸或妈妈的父亲，是老人，不是很小的孩子;dad=dad is a grown-up man with a child, not a very young child=dad 是有孩子的成年男人，不是很小的孩子|ba · by|y at the end, changing to -ies in *babies*|词尾是 y，复数 *babies* 要变成 -ies
      grandma|my mom's mother;a woman of eighty, my dad's mom;my mom's mother and my dad's mother|a grandma is a woman; a grandpa is a man|grandma 是女的；grandpa 是男的|grandpa=grandpa is the father of your mom or dad, a man, not a mother=grandpa 是爸爸或妈妈的父亲，是男的，不是母亲;sister=sister has the same parents as you, so she is not the mother of your mom or dad=sister 和你同父母，不是爸爸或妈妈的母亲|grand · ma|*grand* with a d, then *ma*|先写带 d 的 *grand*，再写 *ma*
      grandpa|my dad's father;a very old man, my mom's dad;an old man with a long white beard|a grandpa is a man; a grandma is a woman|grandpa 是男的；grandma 是女的|grandma=grandma is the mother of your mom or dad, a woman, not a man with a beard=grandma 是爸爸或妈妈的母亲，是女的，不是留胡子的男人;sister=sister is a girl or woman with the same parents as you, not the father of your parents=sister 是和你同父母的女孩或女人，不是爸爸或妈妈的父亲|grand · pa|*grand* with a d, then *pa*|先写带 d 的 *grand*，再写 *pa*
      who|asking about her;asking about that man;asking about your best friend|who asks about a person; what asks about a thing|who 问人；what 问东西|what/what's=what asks about a thing, but the answer here names a person=what 问的是东西，可回答说的是人;how/how's=how asks in what way or how someone feels, but the answer here names a person=how 问的是方式或感觉，可回答说的是人|who|wh at the start said like h, and o said like oo|开头的 wh 读作 h，o 读作 oo
    `,
  },
});

const myAndYour = vocabularyTopic({
  id: "pre-a1-words-my-and-your",
  title: t("My, Your, Me and You", "我的、你的、我和你"),
  summary: t(
    "Words for whose (my, your, his, her) and me, him, us and them.",
    "表示“谁的”的词（my、your、his、her），以及 me、him、us、them。",
  ),
  intro: t(
    "This is **my** bag, and that is **your** bag. Tom has **his** bike, and Anna has **her** cat. These words help you say whose things are whose and talk about people after a verb.",
    "这是 **my**（我的）包，那是 **your**（你的）包。汤姆有 **his**（他的）自行车，安娜有 **her**（她的）猫。这些词帮你说出东西是谁的，并在动词后面说到人。",
  ),
  prerequisites: ["pre-a1-words-i-and-you"],
  words: [
    word(
      "my",
      "of me; that I have",
      "我的",
      "I am Ben. {My} name is Ben.|Your His | I have a dog. {My} dog is black.|Your His | I write {my} name on my book.",
      "your his",
    ),
    word(
      "your",
      "of you; that you have",
      "你的；你们的",
      "What is {your} name? My name is Ben. | You have a cat. Is {your} cat white? | Open {your} books, children.",
      "my his",
    ),
    word(
      "his",
      "of him; that a man or boy has",
      "他的",
      "Tom has a bike. {His} bike is blue.|Her Its | This is my dad. {His} name is Jack.|Her Its | Ben is with {his} mom.",
      "her its",
    ),
    word(
      "her",
      "of her; that a woman or girl has",
      "她的",
      "Anna has a cat. {Her} cat is gray.|His Its | This is my mom. {Her} name is Mary.|His Its | Lily is with {her} grandma.",
      "his its",
    ),
    word(
      "its",
      "of it; that a thing or an animal has",
      "它的",
      "The dog has a ball. {Its} ball is red.|It's Their | The cat is in {its} bed. | The bird can open {its} wings.",
      "it's their",
    ),
    word(
      "our",
      "of us; that we have",
      "我们的",
      "We have a dog. {Our} dog is big.|Their Your | Tom and I are in one class. {Our} teacher is Ms. Li.|Their Your | My sister and I have a room. {Our} room is pink.|Their Your",
      "their your",
    ),
    word(
      "their",
      "of them; that they have",
      "他们的；她们的；它们的",
      "Tom and Ann have a cat. {Their} cat is white.|Our Its | The children have books. They open {their} books. | The two girls are with {their} dad.",
      "our its",
    ),
    word(
      "me",
      "the word for *I* after a verb or after a word like *with* or *to*",
      "我（用在动词或介词后）",
      "Can you help {me}? | Look at {me}! | My dog is always with {me}.",
      "I my",
    ),
    word(
      "him",
      "the word for *he* after a verb or after a word like *with* or *to*",
      "他（用在动词或介词后）",
      "Tom is my friend. I like {him}. | That is Ben. Say hello to {him}. | Dad is in the garden. I am with {him}.",
      "he his",
    ),
    word(
      "us",
      "the word for *we* after a verb or after a word like *with* or *to*",
      "我们（用在动词或介词后）",
      "Come and play with {us}! | Our teacher can see {us}. | Grandma loves {us} very much.",
      "we our",
    ),
    word(
      "them",
      "the word for *they* after a verb or after a word like *with* or *to*",
      "他们；她们；它们（用在动词或介词后）",
      "I have two cats. I love {them}. | Where are my books? I can't see {them}. | My friends are here. Come and meet {them}.",
      "they their",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "Look at the word just before the gap: after a verb or *with* you need *me*, *him*, *us* or *them*; before a thing you need *my*, *his*, *our* or *their*.",
        "看空格前面紧挨着的词：动词或 *with* 后面用 *me*、*him*、*us*、*them*；东西前面用 *my*、*his*、*our*、*their*。",
      ),
      meaning: t(
        "*His* is for a man or a boy and *her* for a woman or a girl; *its* is for a thing or an animal. *Our* is yours and other people's together; *their* belongs to other people.",
        "*his* 指男人或男孩的，*her* 指女人或女孩的，*its* 指东西或动物的。*our* 是包括你在内的大家的；*their* 是别人的。",
      ),
      spell: t(
        "*Its* with no apostrophe means of it; *it's* means *it is*. *Their* has e before i, and it is not the place word *there*.",
        "不带撇号的 *its* 是“它的”；*it's* 是 *it is*。*their* 里 e 在 i 前面，不是表示地点的 *there*。",
      ),
    },
    notes: `
      my|Ben's own name;my black dog;writing my name on my book|my is of me; your is of you|my 是我的；your 是你的|your=your is of the person you talk to, but here the speaker talks about himself=your 是对方的，可这里说话人说的是自己的;his=his is of a man or boy you talk about, not of the speaker=his 是所说的另一个男人或男孩的，不是说话人自己的|my|y at the end, said like *I*|词尾是 y，读作 *I*
      your|asking a name answered with my name;the cat you have;the books of the children you talk to|your is of you; my is of me|your 是你的；my 是我的|my=my is of the speaker, but here the speaker asks about the other person=my 是说话人自己的，可这里问的是对方的;his=his is of a man or boy you talk about, not of the person you talk to=his 是所说的另一个男人或男孩的，不是对方的|your|our after y, the same as in *our*|y 后面是 our，和 *our* 一样
      his|Tom's blue bike;my dad's name;Ben's mom|his is of a man or boy; her is of a woman or girl|his 是男的的；her 是女的的|her=her is of a woman or a girl, but Tom, Dad and Ben are boys and men=her 是女人或女孩的，可 Tom、Dad、Ben 都是男的;its=its is of a thing or an animal, not of a man or a boy=its 是东西或动物的，不是男人或男孩的|his|s said like z|s 读作 z
      her|Anna's gray cat;my mom's name;Lily's grandma|her is of a woman or girl; his is of a man or boy|her 是女的的；his 是男的的|his=his is of a man or a boy, but Anna, Mom and Lily are girls and women=his 是男人或男孩的，可 Anna、Mom、Lily 都是女的;its=its is of a thing or an animal, not of a woman or a girl=its 是东西或动物的，不是女人或女孩的|her|er, said like the er in *sister*|拼作 er，读音和 *sister* 里的 er 一样
      its|a dog's red ball;a cat's bed;a bird's wings|its means of it; it's means it is|its 是“它的”；it's 是 it is|it's=it's means *it is*, not of it=it's 是 *it is*，不是“它的”;their=their is of more than one, but here there is one animal=their 是多个人或动物的，可这里只有一只动物|its|no apostrophe: *its*, not *it's*|没有撇号：写 *its*，不是 *it's*
      our|the dog we have;the teacher of Tom and me;the room of my sister and me|our is of us; their is of other people|our 是我们的；their 是别人的|their=their is of other people, but here the speaker is one of them=their 是别人的，可这里说话人也在其中;your=your is of the people you talk to, not of the speaker and others=your 是对方的，不是说话人和别人一起的|our|ou said like *hour*, with an r at the end|ou 的读音像 *hour*，结尾有 r
      their|the white cat of Tom and Ann;books the children open;the dad of two girls|their is of other people; our is of us|their 是别人的；our 是我们的|our=our is of the speaker and others, but here the speaker talks about other people=our 包括说话人在内，可这里说的是别人的;its=its is of one thing or animal, not of more than one person=its 是一个东西或动物的，不是多个人的|their|e before i: t-h-e-i-r, not *there*|e 在 i 前面：t-h-e-i-r，不是 *there*
      me|asking for help;looking at me;a dog with me|me comes after a verb or *with*; I comes before a verb|me 用在动词或 *with* 后面；I 用在动词前面|I=I comes before a verb, as in *I help*, not after *help*, *at* or *with*=I 用在动词前面，比如 *I help*，不用在 *help*、*at*、*with* 后面;my=my needs a thing after it, as in *my dog*=my 后面要跟东西，比如 *my dog*|me|m and e, said like the letter *me*|m 加 e，读音和字母名 *me* 一样
      him|liking my friend Tom;saying hello to Ben;being with Dad|him comes after a verb or *to*; he comes before a verb|him 用在动词或 *to* 后面；he 用在动词前面|he=he comes before a verb, as in *he likes*, not after *like*, *to* or *with*=he 用在动词前面，比如 *he likes*，不用在 *like*、*to*、*with* 后面;his=his needs a thing after it, as in *his bike*=his 后面要跟东西，比如 *his bike*|him|i for the short sound and m at the end|i 发短音，结尾是 m
      us|playing with us;a teacher who can see us;Grandma's love for us|us comes after a verb or *with*; we comes before a verb|us 用在动词或 *with* 后面；we 用在动词前面|we=we comes before a verb, as in *we play*, not after *with*, *see* or *loves*=we 用在动词前面，比如 *we play*，不用在 *with*、*see*、*loves* 后面;our=our needs a thing after it, as in *our dog*=our 后面要跟东西，比如 *our dog*|us|just u and s|只有 u 和 s
      them|two cats I love;books I can't see;friends to meet|them comes after a verb; they comes before a verb|them 用在动词后面；they 用在动词前面|they=they comes before a verb, as in *they play*, not after *love*, *see* or *meet*=they 用在动词前面，比如 *they play*，不用在 *love*、*see*、*meet* 后面;their=their needs a thing after it, as in *their dad*=their 后面要跟东西，比如 *their dad*|them|th at the start and m at the end|开头是 th，结尾是 m
    `,
  },
});

const people = vocabularyTopic({
  id: "pre-a1-words-people",
  title: t("People", "人"),
  summary: t("Men, women, boys and girls, and the verbs have and love.", "男人、女人、男孩和女孩，以及动词 have 和 love。"),
  intro: t(
    "In the park there is a **man** with a dog, a **woman** on a bike and two **children** playing **with** a ball. These words help you talk about people and what they have and love.",
    "公园里有一个遛狗的 **man**（男人）、一个骑车的 **woman**（女人），还有两个 **with**（和）球一起玩的 **children**（孩子）。这些词帮你谈论人，以及他们拥有什么、喜爱什么。",
  ),
  prerequisites: ["pre-a1-words-family"],
  words: [
    word(
      "man men",
      "a grown-up male person",
      "男人",
      "My dad is a tall {man}. | Mr. Li is a kind old {man}. He is seventy. | Two {men} with big beards are at the door.|women boys",
      "woman boy",
    ),
    word(
      "woman women",
      "a grown-up female person",
      "女人；妇女",
      "My mom is a tall {woman}. | Ms. Li is a nice {woman}. She is our teacher. | The {women} are all mothers.|men girls",
      "man girl",
    ),
    word(
      "boy boys",
      "a male child",
      "男孩",
      "Tom is a {boy}. He is eight. | My brother is a little {boy}. | The {boys} play football. They are my little brothers.|girls men",
      "girl man",
    ),
    word(
      "girl girls",
      "a female child",
      "女孩",
      "Lily is a {girl}. She is nine. | My sister is a little {girl}. | The {girls} are my little sisters.|boys women",
      "boy woman",
    ),
    word(
      "child children",
      "a young boy or girl",
      "孩子；儿童",
      "She is a {child}. She is six years old. | My mom has three {children}: me and my two brothers.|men women | This book is for {children}, not for grown-ups.|men women",
      "man woman",
    ),
    word(
      "people",
      "men, women and children; more than one person",
      "人；人们",
      "There are five {people} in my family: Mom, Dad, two sisters and me.|men children | Many {people} are in the park: men, women and children.|men children | Boys, girls and teachers: many {people} are at school.|men children",
      "man child",
    ),
    word(
      "have has had having haven't hasn't",
      "to own something or to be with someone",
      "有；拥有",
      "I {have} a cat and a dog.|has am | She {has} long hair.|have is | Tom {has} two sisters.|have is | Do you {have} a pen? Yes, I do.|has are",
      "is love",
    ),
    word(
      "love loves loved loving",
      "to like someone or something very, very much",
      "爱；非常喜欢",
      "I {love} my mom and dad very much. | My sister {loves} cats very much.|has sees | We {love} our grandma very much.",
      "have see",
    ),
    word(
      "with",
      "together; next to; having",
      "和……一起；带有",
      "I play {with} my friends. | Come and play {with} me! | A girl {with} long hair is my sister.",
      "to of",
    ),
    word(
      "too",
      "also; the same",
      "也",
      "I have a cat. My friend has a cat {too}. | I am happy, and you are happy {too}. | Tom is ten. Ben is ten {too}.",
      "very not",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Man* and *woman* are grown-ups; *boy* and *girl* are children. Look for an age, a beard or a word like *mom*, *teacher* or *little* in the sentence.",
        "*man* 和 *woman* 是大人；*boy* 和 *girl* 是孩子。找句子里的年龄、胡子，或 *mom*、*teacher*、*little* 这样的词。",
      ),
      meaning: t(
        "*Have* says what you own; *love* says what you like very, very much. *With* means together; *too* means also.",
        "*have* 说的是拥有；*love* 说的是非常非常喜欢。*with* 是“和……一起”；*too* 是“也”。",
      ),
      spell: t(
        "Some words change inside for more than one: *man*, *men*; *woman*, *women*; *child*, *children*. *People* already means more than one, so it takes no -s.",
        "有些词的复数在词中间变化：*man*、*men*；*woman*、*women*；*child*、*children*。*people* 本身就是复数，不加 -s。",
      ),
    },
    notes: `
      man|a tall dad;a kind old man of seventy;two grown-ups with big beards|a man is a grown-up male; a boy is a child|man 是成年男人；boy 是男孩|woman/women=woman is a grown-up female person, not a male one=woman 是成年女人，不是男人;boy/boys=boy is a male child, not a grown-up=boy 是男孩，不是成年人|man|*men*, not *mans*, for more than one|复数是 *men*，不是 *mans*
      woman|a tall mom;a nice teacher called she;grown-ups who are all mothers|a woman is a grown-up female; a girl is a child|woman 是成年女人；girl 是女孩|man/men=man is a grown-up male person, not a female one=man 是成年男人，不是女人;girl/girls=girl is a female child, not a grown-up=girl 是女孩，不是成年人|wom · an|o said like the oo in *book*, and *women*, said *wimin*, for more than one|o 读作 *book* 里的 oo；复数 *women* 读作 *wimin*
      boy|Tom, who is eight;a little brother;little brothers playing football|a boy is a male child; a girl is a female child|boy 是男孩；girl 是女孩|girl/girls=girl is a female child, so she is not called *he* or a brother=girl 是女孩，不用 *he* 指，也不是兄弟;man/men=man is a grown-up male, not a little child=man 是成年男人，不是小孩子|boy|oy at the end, said like the oy in *toy*|结尾是 oy，读音和 *toy* 一样
      girl|Lily, who is nine;a little sister;little sisters|a girl is a female child; a boy is a male child|girl 是女孩；boy 是男孩|boy/boys=boy is a male child, so he is not called *she* or a sister=boy 是男孩，不用 *she* 指，也不是姐妹;woman/women=woman is a grown-up female, not a little child=woman 是成年女人，不是小孩子|girl|ir in the middle, not ur or er|中间是 ir，不是 ur 或 er
      child|a girl of six;me and my two brothers;readers who are not grown-ups|a child is young; a man or a woman is a grown-up|child 是孩子；man 和 woman 是大人|man/men=man is a grown-up male person, not a young boy or girl=man 是成年男人，不是小孩;woman/women=woman is a grown-up female person, not a young boy or girl=woman 是成年女人，不是小孩|child|*children* with -ren, not *childs*, for more than one|复数是加 -ren 的 *children*，不是 *childs*
      people|Mom, Dad, two sisters and me;men, women and children in the park;boys, girls and teachers at school|people are men, women and children together; men are only grown-up males|people 包括男人、女人和孩子；men 只指成年男人|man/men=men are only grown-up males, but here there are women or children too=men 只指成年男人，可这里还有女人或孩子;child/children=children are only young boys and girls, but here there are grown-ups too=children 只指小孩，可这里还有大人|peo · ple|eo in the middle, said like long e, and the ending -ple|中间的 eo 读长 e，结尾是 -ple
      have|a cat and a dog of my own;her long hair;Tom's two sisters;asking about a pen|have and has say what someone owns; is says what someone is|have、has 说的是拥有；is 说的是是什么|has=has goes with he, she and it, not with I or you=has 跟 he、she、it 连用，不跟 I 或 you 连用;have=have goes with I, you, we and they, not with she or Tom=have 跟 I、you、we、they 连用，不跟 she 或 Tom 连用;am/is/are=be says what or how someone is, not what they own, so *I am a cat* or *she is long hair* does not make sense=be 说的是是什么或怎么样，不是拥有，*I am a cat*、*she is long hair* 都说不通;love=love means to like someone very, very much, not to own something=love 是非常喜欢，不是拥有|have|a silent e at the end, and *has* for he, she and it|词尾 e 不发音；he、she、it 后面用 *has*
      love|my mom and dad;cats my sister likes very much;our grandma|love means to like very, very much; have means to own|love 是非常喜欢；have 是拥有|have/has=have means to own something, and it does not go with *very much*=have 是拥有，不能和 *very much* 连用;see/sees=see means to notice with your eyes, and it does not go with *very much*=see 是用眼睛看到，不能和 *very much* 连用|love|o said like the u in *up*, and a silent e at the end|o 读作 *up* 里 u 的音，词尾 e 不发音
      with|playing together with friends;playing together with me;a girl having long hair|with means together or having; to shows where something goes|with 是一起或带有；to 表示去向|to=to shows where something goes, not who is together or what someone has=to 表示去向，不表示和谁一起或带有什么;of=of shows what something belongs to, not who is together=of 表示属于，不表示和谁一起|with|th at the end|结尾是 th
      too|a friend who has a cat, the same as me;you being happy, the same as me;Ben being ten, the same as Tom|too means also and comes at the end; very makes a word stronger|too 是“也”，放在句末；very 用来加强意思|very=very makes a describing word stronger and goes before it, as in *very big*, not at the end=very 用来加强形容词，放在前面，比如 *very big*，不放在句末;not=not makes a sentence say no and goes after *is* or *has*, not at the end=not 表示否定，放在 *is* 或 *has* 后面，不放在句末|too|the double o, not *to* or *two*|两个 o，不是 *to* 或 *two*
    `,
  },
});

// He, she and it.

type Kind = "man" | "woman" | "thing";

const pronounOf: Record<Kind, string> = { man: "he", woman: "she", thing: "it" };

/** referents are people, animals and things, each with the word that stands for it. */
const referents: readonly (readonly [noun: string, kind: Kind])[] = [
  ["My mom", "woman"],
  ["My dad", "man"],
  ["The cat", "thing"],
  ["Tom", "man"],
  ["Anna", "woman"],
  ["My book", "thing"],
  ["The girl", "woman"],
  ["The boy", "man"],
  ["My grandpa", "man"],
  ["My grandma", "woman"],
  ["The bag", "thing"],
  ["My brother", "man"],
  ["My sister", "woman"],
  ["The dog", "thing"],
  ["Mr. Li", "man"],
  ["Ms. Wang", "woman"],
  ["The pen", "thing"],
];

const pronounChoiceBank: readonly ChoiceItem[] = everyPair(referents, [
  "X is here. ___ is very nice.",
  "Look at X. ___ is very big.",
  "Where is X? ___ is at home.",
  "Where is X? ___ is here.",
  "I see X. ___ is there.",
  "X is not here. ___ is at home.",
]).map(([[noun, kind], frame]): ChoiceItem => {
  const lower = noun.startsWith("My") || noun.startsWith("The") ? noun.charAt(0).toLowerCase() + noun.slice(1) : noun;
  const shown = frame.startsWith("X") ? frame.replace("X", noun) : frame.replace("X", lower);
  const right = sentenceCase(pronounOf[kind]);
  return [shown, right, ["He", "She", "It"].filter((p) => p !== right)];
});

const personComplements: readonly string[] = [
  "is at school.",
  "is very kind.",
  "is in the garden.",
  "is my friend.",
  "is not at home.",
  "is in the classroom.",
  "is very happy.",
];
/** thingComplements fit an animal as well as a thing. */
const thingComplements: readonly string[] = ["is very small.", "is here.", "is not big.", "is at home.", "is there.", "is black."];

const pronounTypedBank: readonly TypedItem[] = interleave([
  everyPair(
    referents.filter(([, kind]) => kind !== "thing"),
    personComplements,
  ),
  everyPair(
    referents.filter(([, kind]) => kind === "thing"),
    thingComplements,
  ),
]).map(([[noun, kind], rest]): TypedItem => {
  const right = sentenceCase(pronounOf[kind]);
  const others = ["He", "She", "It"].filter((p) => p !== right);
  return {
    shown: `${noun} ${rest}`,
    accepted: [`${right} ${rest}`],
    wrong: others.map((p) => `${p} ${rest}`),
  };
});

/** pronounFor says what each of he, she and it stands for, in every locale. */
const pronounFor: Record<string, Text> = {
  He: t("a man or a boy", "男人或男孩"),
  She: t("a woman or a girl", "女人或女孩"),
  It: t("a thing or an animal", "东西或动物"),
};

/** referentIn finds the person or thing a sentence talks about. */
const referentIn = (shown: string) => referents.find(([noun]) => shown.toLowerCase().includes(noun.toLowerCase()))?.[0] ?? "";

const heSheAndIt: TopicDef = {
  id: "he-she-and-it",
  title: t("He, She and It", "he、she 和 it"),
  summary: t(
    "He for a man or boy, she for a woman or girl, it for a thing or an animal.",
    "he 指男人或男孩，she 指女人或女孩，it 指东西或动物。",
  ),
  intro: t(
    "Look at *My grandpa is at home. He is reading.* and *My bag is red. It is on the chair.* Instead of repeating a name or noun, English switches to *he* (man or boy), *she* (woman or girl), or *it* (thing or animal). In this topic, you pick and write the right pronoun for each subject.",
    "看看 *My grandpa is at home. He is reading.* 和 *My bag is red. It is on the chair.* 英语不重复同一个名字或名词，而是换成 *he*（男人或男孩）、*she*（女人或女孩）或 *it*（东西或动物）。本主题带你为不同主语准确选择并写出这三个代词。",
  ),
  prerequisites: ["pre-a1-words-family", "the-verb-be"],
  encompasses: [{ topic: "the-verb-be", weight: 0.2 }],
  xp: 15,
  strand: "grammar",
  knowledgePoints: [
    point(
      "choose",
      t("He, she or it?", "用 he、she 还是 it？"),
      t(
        "Use *he* for a man or a boy: *Tom is here. He is nice.* Use *she* for a woman or a girl: *Anna is here. She is nice.* Use *it* for a thing or an animal: *The cat is here. It is nice.*\n\n> **Watch out.** Do not mix up *he* and *she*—check whether the noun names a male person (*Mr. Li*, *dad*, *brother*), a female person (*Ms. Wang*, *mom*, *sister*), or a thing/animal (*bag*, *dog*).",
        "中文口语里“他”“她”“它”都读“tā”，所以说中文的人常把 *he* 和 *she* 用混。英语中，*he* 指男人或男孩：*Tom is here. He is nice.* *she* 指女人或女孩：*Anna is here. She is nice.* *it* 指东西或动物：*The cat is here. It is nice.*\n\n> **注意。** 别把 *he* 和 *she* 用混——先看前面的词指的是男性（*Mr. Li*、*dad*、*brother*）、女性（*Ms. Wang*、*mom*、*sister*），还是物品或动物（*bag*、*dog*）。",
      ),
      choiceGenerator(
        t("Choose the word for the gap.", "选出填入空白处的词。"),
        pronounChoiceBank,
        (right, shown) =>
          t(
            `*${referentIn(shown)}* is ${pronounFor[right]?.en}, so the word for it is *${right.toLowerCase()}*: ${shown.replace("___", `*${right}*`)}\n\n**Check.** Point back to *${referentIn(shown)}* in the first sentence—because it names ${pronounFor[right]?.en}, *${right}* is the only matching pronoun.`,
            `*${referentIn(shown)}* 是${pronounFor[right]?.["zh-CN"]}，所以用 *${right.toLowerCase()}*：${shown.replace("___", `*${right}*`)}\n\n**检验。** 回看前一句里的 *${referentIn(shown)}*——它指${pronounFor[right]?.["zh-CN"]}，因此只有 *${right}* 与之对应。`,
          ),
        (wrong, _right, shown) =>
          t(
            `*${wrong}* stands for ${pronounFor[wrong]?.en}, and *${referentIn(shown)}* is not one.`,
            `*${wrong}* 指${pronounFor[wrong]?.["zh-CN"]}，可 *${referentIn(shown)}* 不是。`,
          ),
      ),
    ),
    point(
      "replace",
      t("Saying he, she or it instead", "用 he、she 或 it 代替"),
      t(
        "Once we know who or what we mean, we say *he*, *she* or *it* instead of the name: *My mom is kind.* → *She is kind.*\n\n> **Watch out.** Replace the *entire* subject before *is* (for example, *My brother* -> *He*, not *My he*), and keep the rest of the sentence unchanged.",
        "知道说的是谁或什么之后，就用 *he*、*she* 或 *it* 代替名字：*My mom is kind.* → *She is kind.*\n\n> **注意。** 要把 *is* 前面的*整个*主语都替换掉（如 *My brother* -> *He*，不要写成 *My he*），句子的其余部分保持不变。",
      ),
      typedGenerator(
        "sentence",
        t("Write the sentence again. Put he, she or it in place of the words before is.", "重写句子，用 he、she 或 it 代替 is 前面的词。"),
        pronounTypedBank,
        (right, shown) => {
          const pronoun = right.split(" ")[0] ?? "";
          return t(
            `*${referentIn(shown)}* is ${pronounFor[pronoun]?.en}, so *${pronoun.toLowerCase()}* takes its place: ${shown} → ${right}\n\n**Check.** Confirm that the whole subject before *is* is replaced by *${pronoun}* (with a capital letter) and the words from *is* onward stay the same.`,
            `*${referentIn(shown)}* 是${pronounFor[pronoun]?.["zh-CN"]}，所以用 *${pronoun.toLowerCase()}* 代替：${shown} → ${right}\n\n**检验。** 确认 *is* 前面的整个主语都换成了大写的 *${pronoun}*，且 *is* 及后面的内容保持原样。`,
          );
        },
        heSheItNot,
      ),
    ),
  ],
};

// My, your, his and her.

/** owners say who has a thing, with their verb and the word for whose. */
const owners: readonly (readonly [owner: string, verb: string, whose: string, wrong: readonly [string, string]])[] = [
  ["I", "have", "My", ["Me", "I"]],
  ["You", "have", "Your", ["You", "You're"]],
  ["Tom", "has", "His", ["Her", "He"]],
  ["Anna", "has", "Her", ["His", "She"]],
  ["We", "have", "Our", ["Us", "We"]],
  ["They", "have", "Their", ["There", "They"]],
  ["The dog", "has", "Its", ["It's", "His"]],
  ["My dad", "has", "His", ["Her", "He"]],
  ["My mom", "has", "Her", ["His", "She"]],
  ["Ben and Sam", "have", "Their", ["Our", "They"]],
  ["My sister", "has", "Her", ["His", "She"]],
];

const owned: readonly (readonly [thing: string, color: string])[] = [
  ["bag", "red"],
  ["ball", "blue"],
  ["pen", "green"],
  ["book", "yellow"],
  ["chair", "white"],
  ["cat", "gray"],
  ["kite", "pink"],
  ["desk", "brown"],
  ["box", "black"],
  ["bed", "brown"],
];

/** ownedBy pairs every owner with every thing it could have: a dog has only a ball or a bed. */
const ownedBy = (things: readonly (readonly [string, string])[]) =>
  interleave([
    everyPair(
      owners.filter(([owner]) => owner !== "The dog"),
      things,
    ),
    everyPair(
      owners.filter(([owner]) => owner === "The dog"),
      things.filter(([thing]) => thing === "ball" || thing === "bed"),
    ),
  ]);

const ownedSentence = (owner: string, verb: string, thing: string, color: string) =>
  `${owner} ${verb} a ${thing}. ___ ${thing} is ${color}.`;

const whoseChoiceBank: readonly ChoiceItem[] = ownedBy(owned).map(
  ([[owner, verb, whose, wrong], [thing, color]]): ChoiceItem => [ownedSentence(owner, verb, thing, color), whose, wrong],
);

const whoseTypedBank: readonly TypedItem[] = ownedBy(owned.map(([thing], k) => [thing, owned[(k + 3) % owned.length]![1]] as const)).map(
  ([[owner, verb, whose, wrong], [thing, color]]): TypedItem => ({
    shown: ownedSentence(owner, verb, thing, color),
    accepted: [whose],
    wrong: [...wrong],
  }),
);

/** whoseOf says which word each word for whose goes with, in every locale. */
const whoseOf: Record<string, Text> = {
  My: t("*my* goes with *I*", "*my* 对应 *I*"),
  Your: t("*your* goes with *you*", "*your* 对应 *you*"),
  His: t("*his* is for a man or a boy, like *he*", "*his* 指男的，对应 *he*"),
  Her: t("*her* is for a woman or a girl, like *she*", "*her* 指女的，对应 *she*"),
  Its: t("*its* is for a thing or an animal, like *it*", "*its* 指东西或动物，对应 *it*"),
  Our: t("*our* goes with *we*, a group that includes you", "*our* 对应 *we*，指包括你自己在内的一群人"),
  Their: t("*their* goes with *they*, more than one other person", "*their* 对应 *they*，指别的几个人"),
};

/** ownerIn finds who has the thing in a sentence, the words before have or has. */
const ownerIn = (shown: string) => shown.split(/ ha(?:ve|s) /u)[0] ?? "";

/** whyNotWhose says what a wrong word for whose shows the learner misread. */
const whyNotWhose = (wrong: string, _right: string, shown: string): Text => {
  if (wrong === "You're")
    return t("*You're* means *you are*; it does not say whose the thing is.", "*You're* 的意思是 *you are*，不表示“谁的”。");
  if (wrong === "It's") return t("*It's* means *it is*; it does not say whose the thing is.", "*It's* 的意思是 *it is*，不表示“谁的”。");
  if (wrong === "There")
    return t(
      "*There* says where something is; it only sounds like the word for whose.",
      "*There* 表示“在那里”，只是读音和表示“谁的”的词相近。",
    );
  if (whoseOf[wrong])
    return t(
      `${whoseOf[wrong]?.en.replace(/^\*(.)/u, (_, c: string) => `*${c.toUpperCase()}`)}, but the owner here is *${ownerIn(shown)}*.`,
      `${whoseOf[wrong]?.["zh-CN"]}，可这里东西的主人是 *${ownerIn(shown)}*。`,
    );

  return t(
    `*${wrong}* is not a word for whose; before a noun you need a word like *my*, *his* or *their*.`,
    `*${wrong}* 不表示“谁的”；名词前面要用 *my*、*his*、*their* 这样的词。`,
  );
};

const myYourHisHer: TopicDef = {
  id: "my-your-his-her",
  title: t("My, Your, His and Her", "my、your、his 和 her"),
  summary: t(
    "My mom, his sister, their dog: the word for whose comes before the noun.",
    "my mom、his sister、their dog：表示“谁的”的词放在名词前。",
  ),
  intro: t(
    "Look at *We have a green bag. Our bag is on the desk.* Every owner has its own possessive word that sits directly before the noun—*my*, *your*, *his*, *her*, *its*, *our*, or *their*. In this topic, you match each owner to the right possessive word without mixing up look-alikes like *its* and *it's*.",
    "看看 *We have a green bag. Our bag is on the desk.* 每个“主人”都有对应的物主词，直接放在名词前面——*my*、*your*、*his*、*her*、*its*、*our* 或 *their*。本主题带你把主人与正确的物主词配对，同时区分 *its* 和 *it's* 等易混词。",
  ),
  prerequisites: ["pre-a1-words-my-and-your", "he-she-and-it"],
  encompasses: [
    { topic: "pre-a1-words-my-and-your", weight: 0.4 },
    { topic: "he-she-and-it", weight: 0.3 },
  ],
  xp: 15,
  strand: "grammar",
  knowledgePoints: [
    point(
      "choose",
      t("Choosing the word for whose", "选择表示“谁的”的词"),
      t(
        "*I* → *my*, *you* → *your*, *he* → *his*, *she* → *her*, *it* → *its*, *we* → *our*, *they* → *their*.\n\n*Tom has a bike. His bike is blue.* (*his* for a man or boy)\n*Anna has a bike. Her bike is red.* (*her* for a woman or girl)\n\nDo not mix *its* with *it's* (= *it is*), or *their* with *there*.\n\n> **Watch out.** Never put a subject or object pronoun (*he*, *she*, *us*, *they*) before a noun to show ownership, and never put an apostrophe in *its* when it means “belonging to it”.",
        "*I* → *my*，*you* → *your*，*he* → *his*，*she* → *her*，*it* → *its*，*we* → *our*，*they* → *their*。\n\n中文说“我的妈妈”“他的书”，英语没有“的”，直接把 *my*、*his* 放在名词前：*my mom*、*his book*。*his* 指男的，*her* 指女的——中文“他的”“她的”读音一样，英语却要分清。\n\n不要把 *its* 和 *it's*（= *it is*）、*their* 和 *there* 弄混。\n\n> **注意。** 不要把主格或宾格代词（*he*、*she*、*us*、*they*）放在名词前表示“谁的”，也不要在表示“它的”的 *its* 里加撇号。",
      ),
      choiceGenerator(
        t("Choose the word for the gap.", "选出填入空白处的词。"),
        whoseChoiceBank,
        (right, shown) =>
          t(
            `The owner in the sentence is *${ownerIn(shown)}*, and ${whoseOf[right]?.en}: ${shown.replace("___", `*${right}*`)}\n\n**Check.** Trace *${right}* back to *${ownerIn(shown)}* in the first sentence—it matches the owner and sits cleanly before the noun without an apostrophe.`,
            `东西是 *${ownerIn(shown)}* 的，${whoseOf[right]?.["zh-CN"]}：${shown.replace("___", `*${right}*`)}\n\n**检验。** 把 *${right}* 对照第一句里的主人 *${ownerIn(shown)}*——人称与性别一致，且直接放在名词前、不带撇号。`,
          ),
        whyNotWhose,
      ),
    ),
    point(
      "type",
      t("Writing the word for whose", "写出表示“谁的”的词"),
      t(
        "Look at who has the thing, then write *my*, *your*, *his*, *her*, *its*, *our* or *their*: *Ben and Sam have a kite.* → *Their kite is pink.*\n\n> **Watch out.** Check spelling on the tricky pairs: *Your* (not *You're*), *Its* (not *It's*), and *Their* (not *There*), and capitalize the word when it begins the sentence.",
        "看看东西是谁的，再写出 *my*、*your*、*his*、*her*、*its*、*our* 或 *their*：*Ben and Sam have a kite.* → *Their kite is pink.*\n\n> **注意。** 留心三组易混拼写：*Your*（不是 *You're*）、*Its*（不是 *It's*）、*Their*（不是 *There*）；位于句首时首字母大写。",
      ),
      typedGenerator(
        "word-form",
        t("Type the missing word.", "输入缺少的词。"),
        whoseTypedBank,
        (right, shown) =>
          t(
            `The owner in the sentence is *${ownerIn(shown)}*, and ${whoseOf[right]?.en}: ${shown.replace("___", `*${right}*`)}\n\n**Check.** Match the owner *${ownerIn(shown)}* to its possessive word and double-check the spelling of *${right}* (no apostrophe, capital first letter).`,
            `东西是 *${ownerIn(shown)}* 的，${whoseOf[right]?.["zh-CN"]}：${shown.replace("___", `*${right}*`)}\n\n**检验。** 对照主人 *${ownerIn(shown)}* 核实对应的物主词，并检查 *${right}* 的拼写（不带撇号、句首大写）。`,
          ),
        possessiveNot,
      ),
    ),
  ],
};

// Have and has.

const haveSubjects: readonly (readonly [subject: string, verb: "have" | "has"])[] = [
  ["I", "have"],
  ["You", "have"],
  ["He", "has"],
  ["She", "has"],
  ["We", "have"],
  ["They", "have"],
  ["Tom", "has"],
  ["My mom", "has"],
  ["The cat", "has"],
  ["My friends", "have"],
  ["Anna and Ben", "have"],
];

/** haveObjects fit any person; the cat has only catObjects. */
const haveObjects: readonly string[] = [
  "a red bag",
  "two sisters",
  "long hair",
  "a big dog",
  "many books",
  "a new pen",
  "three pens",
  "black hair",
  "a cat",
  "big eyes",
];
const catObjects: readonly string[] = ["big eyes", "a red ball", "long hair"];

const haveItems = interleave([
  everyPair(
    haveSubjects.filter(([subject]) => subject !== "The cat"),
    haveObjects,
  ),
  everyPair(
    haveSubjects.filter(([subject]) => subject === "The cat"),
    catObjects,
  ),
]);

const haveChoiceBank: readonly ChoiceItem[] = haveItems.map(
  ([[subject, verb], object]): ChoiceItem => [
    `${subject} ___ ${object}.`,
    verb,
    [verb === "have" ? "has" : "have", verb === "have" ? "is" : "are"],
  ],
);

const haveTypedBank: readonly TypedItem[] = haveItems.map(([[subject, verb], object]): TypedItem => {
  const wrongVerb = verb === "have" ? "has" : "have";
  return {
    shown: `${subject} ${wrongVerb} ${object}.`,
    accepted: [`${subject} ${verb} ${object}.`],
    wrong: [`${subject} ${wrongVerb} ${object}.`],
  };
});

/** haveRule says which subjects take have and which take has, in every locale. */
const haveRule: Record<string, Text> = {
  have: t("*have* goes with *I*, *you*, *we*, *they* and more than one", "*have* 跟 *I*、*you*、*we*、*they* 和多个人连用"),
  has: t("*has* goes with *he*, *she*, *it* and one person or thing", "*has* 跟 *he*、*she*、*it* 和单个的人或东西连用"),
};

const haveAndHas: TopicDef = {
  id: "have-and-has",
  title: t("Have and Has", "have 和 has"),
  summary: t("I have, you have, but she has, he has, it has.", "I have、you have，但 she has、he has、it has。"),
  intro: t(
    "Compare *We have two books* with *Tom has two books*: both talk about owning something, yet a single third-person subject (*he*, *she*, *it*, or one name) switches *have* to *has*. In this topic, you choose between *have* and *has* and fix sentences that use the wrong one.",
    "比较 *We have two books* 与 *Tom has two books*：两句都在说“有”，但第三人称单数主语（*he*、*she*、*it* 或单个名字）会把 *have* 变成 *has*。本主题带你正确选择 *have* 与 *has*，并改正用错的句子。",
  ),
  prerequisites: ["pre-a1-words-people", "he-she-and-it"],
  encompasses: [{ topic: "pre-a1-words-people", weight: 0.3 }],
  xp: 15,
  strand: "grammar",
  knowledgePoints: [
    point(
      "choose",
      t("Have or has?", "用 have 还是 has？"),
      t(
        "*I have*, *you have*, *we have*, *they have*, and more than one person *have*. But *he has*, *she has*, *it has*, and one person or thing *has*.\n\n*I have a cat. My sister has a dog.*\n\n> **Watch out.** Do not use *is* or *are* to mean “owns”, and remember that *I* and *you* take *have* even though they refer to one person.",
        "*I*、*you*、*we*、*they* 和多个人后面用 *have*；*he*、*she*、*it* 和单个的人或东西后面用 *has*。中文“有”从不变化，英语却要跟着主语变。\n\n*I have a cat. My sister has a dog.*\n\n> **注意。** 不要用 *is* 或 *are* 来表示“拥有”，同时记住 *I* 和 *you* 虽然指一个人，后面依然用 *have*。",
      ),
      choiceGenerator(
        t("Choose the word for the gap.", "选出填入空白处的词。"),
        haveChoiceBank,
        (right, shown) =>
          t(
            `The subject is *${shown.split(" ___")[0]}*, and ${haveRule[right]?.en}: ${shown.replace("___", `*${right}*`)}\n\n**Check.** Test the subject as a pronoun: if it equals *he*, *she*, or *it*, use *has*; otherwise (*I*, *you*, *we*, *they*), use *have*.`,
            `主语是 *${shown.split(" ___")[0]}*，${haveRule[right]?.["zh-CN"]}：${shown.replace("___", `*${right}*`)}\n\n**检验。** 把主语换算成代词：相当于 *he*、*she*、*it* 就用 *has*，相当于 *I*、*you*、*we*、*they* 就用 *have*。`,
          ),
        (wrong, _right, shown, position) =>
          position === 0
            ? t(
                `${haveRule[wrong]?.en}, but the subject here is *${shown.split(" ___")[0]}*.`,
                `${haveRule[wrong]?.["zh-CN"]}，可这里的主语是 *${shown.split(" ___")[0]}*。`,
              )
            : t(
                `*${wrong}* is a form of *be*, which says how or where someone is; to say what someone owns, use *have* or *has*.`,
                `*${wrong}* 是 *be* 的形式，说明人怎么样或在哪里；要说某人有什么，用 *have* 或 *has*。`,
              ),
      ),
    ),
    point(
      "fix",
      t("Fixing have and has", "改正 have 和 has"),
      t(
        "Each sentence has the wrong one of *have* and *has*. Look at the words before it and fix it: *My mom have long hair.* → *My mom has long hair.*\n\n> **Watch out.** Check compound subjects like *Anna and Ben* carefully—two people together equal *they*, so they take *have*, not *has*.",
        "每个句子里的 *have* 或 *has* 用错了。看看它前面的词，把它改正：*My mom have long hair.* → *My mom has long hair.*\n\n> **注意。** 留心像 *Anna and Ben* 这样的并列主语——两个人合在一起相当于 *they*，后面要用 *have*，不能用 *has*。",
      ),
      typedGenerator(
        "sentence",
        t("Fix the sentence.", "改正这个句子。"),
        haveTypedBank,
        (right) => {
          const [subject, verb] = right.split(/ (have|has) /u);
          return t(
            `The subject is *${subject}*, and ${haveRule[verb ?? ""]?.en}: ${right}\n\n**Check.** Replace *${subject}* mentally with a pronoun—*he/she/it* pairs with *has*, while *I/you/we/they* pairs with *have*.`,
            `主语是 *${subject}*，${haveRule[verb ?? ""]?.["zh-CN"]}：${right}\n\n**检验。** 在心里把 *${subject}* 换成代词——*he/she/it* 配 *has*，*I/you/we/they* 配 *have*。`,
          );
        },
        haveNot,
      ),
    ),
  ],
};

/** topics are the topics of the unit My Family. */
export const topics: readonly TopicDef[] = [family.topic, myAndYour.topic, people.topic, heSheAndIt, myYourHisHer, haveAndHas];

/** vocabulary are the words the unit My Family teaches. */
export const vocabulary: readonly WordBatch[] = [family.batch, myAndYour.batch, people.batch];
