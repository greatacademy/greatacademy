// A1, unit 1: All About Me. Numbers to a hundred, where I live and what I speak, feelings, everyday words, and the
// present simple.

import { type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { everyPair, vocabularyTopic, word } from "../words.ts";

const numbers = vocabularyTopic({
  id: "a1-words-numbers-to-hundred",
  title: t("Numbers 13 to 100", "数字 13 到 100"),
  summary: t("Counting from thirteen to a hundred.", "从十三数到一百。"),
  intro: t(
    "My brother is **thirteen**, my mom is **forty** and my grandpa is nearly a **hundred**! These words help you count past twelve and say big numbers and ages.",
    "我哥哥 **thirteen**（十三）岁，妈妈 **forty**（四十）岁，爷爷快 **hundred**（一百）岁了！这些词帮你数过十二，说出更大的数和年龄。",
  ),
  prerequisites: ["pre-a1-words-numbers"],
  words: [
    word(
      "thirteen",
      "the number 13",
      "十三（13）",
      "Ten and three is {thirteen}. | Twelve, {thirteen}, fourteen. | My brother is {thirteen}. Next year he will be fourteen.",
      "thirty fourteen",
    ),
    word(
      "fourteen",
      "the number 14",
      "十四（14）",
      "Ten and four is {fourteen}. | Thirteen, {fourteen}, fifteen. | Two weeks is {fourteen} days.",
      "forty thirteen",
    ),
    word(
      "fifteen",
      "the number 15",
      "十五（15）",
      "Ten and five is {fifteen}. | Fourteen, {fifteen}, sixteen. | A quarter of an hour is {fifteen} minutes.",
      "fifty sixteen",
    ),
    word(
      "sixteen",
      "the number 16",
      "十六（16）",
      "Ten and six is {sixteen}. | Fifteen, {sixteen}, seventeen. | Eight and eight is {sixteen}.",
      "sixty fifteen",
    ),
    word(
      "seventeen",
      "the number 17",
      "十七（17）",
      "Ten and seven is {seventeen}. | Sixteen, {seventeen}, eighteen. | Twenty take away three is {seventeen}.",
      "seventy sixteen",
    ),
    word(
      "eighteen",
      "the number 18",
      "十八（18）",
      "Ten and eight is {eighteen}. | Seventeen, {eighteen}, nineteen. | Nine and nine is {eighteen}.",
      "eighty nineteen",
    ),
    word(
      "nineteen",
      "the number 19",
      "十九（19）",
      "Ten and nine is {nineteen}. | Eighteen, {nineteen}, twenty. | Twenty take away one is {nineteen}.",
      "ninety eighteen",
    ),
    word(
      "twenty",
      "the number 20",
      "二十（20）",
      "Ten and ten is {twenty}. | I have ten fingers and ten toes: {twenty} in all. | Nineteen, {twenty}, twenty-one.",
      "twelve thirty",
    ),
    word(
      "thirty",
      "the number 30",
      "三十（30）",
      "Twenty and ten is {thirty}. | Many months have {thirty} days. | Ten, twenty, {thirty}, forty.",
      "thirteen forty",
    ),
    word(
      "forty",
      "the number 40",
      "四十（40）",
      "Twenty and twenty is {forty}. | Thirty, {forty}, fifty. | My dad is {forty}. He was thirty-nine last year.",
      "fourteen fifty",
    ),
    word(
      "fifty",
      "the number 50",
      "五十（50）",
      "Twenty-five and twenty-five is {fifty}. | Half of a hundred is {fifty}. | Forty, {fifty}, sixty.",
      "fifteen forty",
    ),
    word(
      "hundred hundreds",
      "the number 100",
      "百（100）",
      "Ten tens make a {hundred}. | Fifty and fifty is one {hundred}. | Ninety-nine and one is one {hundred}.",
      "thirty twenty",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "Listen to the ending: *-teen* numbers are 13 to 19 and *-ty* numbers are whole tens, so *thirteen* and *thirty* are far apart. Work out the sum or the count first.",
        "注意词尾：*-teen* 是 13 到 19，*-ty* 是整十，所以 *thirteen* 和 *thirty* 差得很远。先算出结果或数一数。",
      ),
      meaning: t(
        "The meaning gives the digits: 14 is *fourteen*, 40 is *forty*. Check whether the number is in the teens or a whole ten before you choose.",
        "释义给出的是数字：14 是 *fourteen*，40 是 *forty*。选之前先看它是十几还是整十。",
      ),
      spell: t(
        "*Forty* has no u, though *four* and *fourteen* do; *fifteen* and *fifty* change *five* to *fif-*; *eighteen* has just one t in the middle.",
        "*forty* 没有 u，而 *four* 和 *fourteen* 有；*fifteen* 和 *fifty* 把 *five* 变成 *fif-*；*eighteen* 中间只有一个 t。",
      ),
    },
    notes: `
      thirteen|the sum ten and three;counting from twelve to fourteen;a brother who will be fourteen next year|thirteen is 13; thirty is 30|thirteen 是 13；thirty 是 30|thirty=thirty is 30, a whole ten, not 13=thirty 是整十 30，不是 13;fourteen=fourteen is 14, one more than 13=fourteen 是 14，比 13 多一|thir · teen|thir- with ir, and -teen with a double e|thir- 拼作 ir，-teen 有两个 e
      fourteen|the sum ten and four;counting from thirteen to fifteen;the days in two weeks|fourteen is 14; forty is 40|fourteen 是 14；forty 是 40|forty=forty is 40, a whole ten, not 14=forty 是整十 40，不是 14;thirteen=thirteen is 13, one less than 14=thirteen 是 13，比 14 少一|four · teen|the u from *four*, which *forty* drops|保留 *four* 里的 u，*forty* 里却没有
      fifteen|the sum ten and five;counting from fourteen to sixteen;the minutes in a quarter of an hour|fifteen is 15; fifty is 50|fifteen 是 15；fifty 是 50|fifty=fifty is 50, a whole ten, not 15=fifty 是整十 50，不是 15;sixteen=sixteen is 16, one more than 15=sixteen 是 16，比 15 多一|fif · teen|*fif-*, not *five-*|开头是 *fif-*，不是 *five-*
      sixteen|the sum ten and six;counting from fifteen to seventeen;the sum eight and eight|sixteen is 16; sixty is 60|sixteen 是 16；sixty 是 60|sixty=sixty is 60, a whole ten, not 16=sixty 是整十 60，不是 16;fifteen=fifteen is 15, one less than 16=fifteen 是 15，比 16 少一|six · teen|*six* stays as it is, then -teen|*six* 不变，后面加 -teen
      seventeen|the sum ten and seven;counting from sixteen to eighteen;twenty take away three|seventeen is 17; seventy is 70|seventeen 是 17；seventy 是 70|seventy=seventy is 70, a whole ten, not 17=seventy 是整十 70，不是 17;sixteen=sixteen is 16, one less than 17=sixteen 是 16，比 17 少一|sev · en · teen|*seven* stays whole before -teen|*seven* 完整保留，后面加 -teen
      eighteen|the sum ten and eight;counting from seventeen to nineteen;the sum nine and nine|eighteen is 18; eighty is 80|eighteen 是 18；eighty 是 80|eighty=eighty is 80, a whole ten, not 18=eighty 是整十 80，不是 18;nineteen=nineteen is 19, one more than 18=nineteen 是 19，比 18 多一|eigh · teen|one t only: *eigh* + *teen*, not *eightteen*|只有一个 t：*eigh* 加 *teen*，不是 *eightteen*
      nineteen|the sum ten and nine;counting from eighteen to twenty;twenty take away one|nineteen is 19; ninety is 90|nineteen 是 19；ninety 是 90|ninety=ninety is 90, a whole ten, not 19=ninety 是整十 90，不是 19;eighteen=eighteen is 18, one less than 19=eighteen 是 18，比 19 少一|nine · teen|the e of *nine* kept before -teen|*nine* 的 e 保留，后面加 -teen
      twenty|the sum ten and ten;fingers and toes together;counting from nineteen to twenty-one|twenty is 20; twelve is 12|twenty 是 20；twelve 是 12|twelve=twelve is 12, not two whole tens=twelve 是 12，不是两个十;thirty=thirty is 30, ten more than 20=thirty 是 30，比 20 多十|twen · ty|tw at the start and -ty at the end|开头是 tw，结尾是 -ty
      thirty|the sum twenty and ten;the days in many months;counting in tens to forty|thirty is 30; thirteen is 13|thirty 是 30；thirteen 是 13|thirteen=thirteen is 13, not three whole tens=thirteen 是 13，不是三个十;forty=forty is 40, ten more than 30=forty 是 40，比 30 多十|thir · ty|ir, as in *thirteen*, then -ty|和 *thirteen* 一样拼作 ir，再加 -ty
      forty|the sum twenty and twenty;counting in tens from thirty to fifty;a dad who was thirty-nine last year|forty is 40; fourteen is 14|forty 是 40；fourteen 是 14|fourteen=fourteen is 14, not four whole tens=fourteen 是 14，不是四个十;fifty=fifty is 50, ten more than 40=fifty 是 50，比 40 多十|for · ty|no u: *forty*, not *fourty*|没有 u：是 *forty*，不是 *fourty*
      fifty|the sum twenty-five and twenty-five;half of a hundred;counting in tens from forty to sixty|fifty is 50; fifteen is 15|fifty 是 50；fifteen 是 15|fifteen=fifteen is 15, not five whole tens=fifteen 是 15，不是五个十;forty=forty is 40, ten less than 50=forty 是 40，比 50 少十|fif · ty|*fif-*, not *five-*, then -ty|开头是 *fif-*，不是 *five-*，再加 -ty
      hundred|ten tens;the sum fifty and fifty;ninety-nine and one|a hundred is 100; thirty is 30|hundred 是 100；thirty 是 30|thirty=thirty is 30, only three tens, not ten tens=thirty 是 30，只有三个十，不是十个十;twenty=twenty is 20, only two tens, not ten tens=twenty 是 20，只有两个十，不是十个十|hun · dred|-dred at the end, not -derd|结尾是 -dred，不是 -derd
    `,
  },
});

const aboutMe = vocabularyTopic({
  id: "a1-words-about-me",
  title: t("Where I Live", "我住在哪里"),
  summary: t(
    "Countries, cities and languages, and how to say where you live and what you speak.",
    "国家、城市和语言，以及怎样说你住在哪里、说什么语言。",
  ),
  intro: t(
    "Mei is **from** China. She **lives** in a big **city**, Shanghai, and she **speaks** Chinese and English. These words help you say where you come from, where you live and what languages you use.",
    "梅 **from**（来自）中国。她 **lives**（住）在上海这座大 **city**（城市），会 **speaks**（说）中文和英语。这些词帮你说出自己来自哪里、住在哪里、会说什么语言。",
  ),
  prerequisites: ["pre-a1-words-hello"],
  words: [
    word(
      "country countries",
      "a land with its own name and flag, like China or Brazil",
      "国家",
      "China is a big {country}. | Which {country} are you from? I'm from Japan. | France and Spain are two {countries} in Europe.|cities languages",
      "city language",
    ),
    word(
      "city cities",
      "a big town where many people live",
      "城市",
      "Beijing is a big {city}. | I live in a {city}, not on a farm. | New York and London are big {cities}.|countries languages",
      "country language",
    ),
    word(
      "live lives lived living",
      "to have your home in a place",
      "住；居住",
      "I {live} in Shanghai. | Where do you {live}? In a small town. | My grandma {lives} with us in our house.|speaks comes",
      "speak come",
    ),
    word(
      "from",
      "showing the place where someone or something started",
      "来自；从",
      "I am {from} China, but now I live in Canada. | Where are you {from}? I'm from Canada. | This email is {from} my friend. She sent it to me.",
      "in to",
    ),
    word(
      "speak speaks spoke spoken speaking",
      "to say words; to use a language",
      "说（某种语言）；讲话",
      "I {speak} Chinese and English. | Can you {speak} slowly, please? | She {speaks} three languages.|says lives",
      "say live",
    ),
    word(
      "English",
      "the language of the US, the UK and many other countries",
      "英语；英国的",
      "People in the US speak {English}. | Hello is an {English} word. In Chinese it is nǐ hǎo. | My {English} teacher helps me say words like *apple* and *book*.",
      "Chinese language",
    ),
    word(
      "Chinese",
      "the language of China; from China",
      "中文；中国的",
      "People in China speak {Chinese}. | Nǐ hǎo means hello in {Chinese}. | We eat {Chinese} food with chopsticks.",
      "English language",
    ),
    word(
      "language languages",
      "the words people use to speak and write, like English or Chinese",
      "语言",
      "English is a {language}. | How many {languages} can you speak?|countries cities | Chinese is my first {language}.",
      "country city",
    ),
    word(
      "phone phones",
      "a thing you use to call and talk to people far away",
      "电话；手机",
      "Call me on my {phone}. | My {phone} is ringing! | Turn off your {phones} in class. No calls, please!|emails cameras",
      "email camera",
    ),
    word(
      "number numbers",
      "a word or sign like one, 2 or ten",
      "数字；号码",
      "What is your phone {number}? | Seven is my lucky {number}. | Write the {numbers} from one to ten.|emails names",
      "email name",
    ),
    word(
      "email emails",
      "a message you send on a computer or a phone",
      "电子邮件",
      "I send an {email} to my teacher. | Check your {email} on your computer. I sent you a photo. | I get many {emails} every day.|phones numbers",
      "phone number",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "A *country* is a whole land like China or Japan; a *city* is a big town in it, like Beijing. Look at the name in the sentence to tell which one it is.",
        "*country* 是像中国、日本这样的整个国家；*city* 是国家里的大城市，比如北京。看句子里的地名来判断。",
      ),
      meaning: t(
        "*Live* is about where your home is, *speak* is about using a language, and *from* tells where someone or something started.",
        "*live* 说的是家在哪里，*speak* 说的是用某种语言，*from* 说的是人或东西从哪里来。",
      ),
      spell: t(
        "*Country* and *city* change y to -ies: *countries*, *cities*. *English* and *Chinese* always start with a capital letter.",
        "*country* 和 *city* 的复数把 y 变成 -ies：*countries*、*cities*。*English* 和 *Chinese* 永远大写开头。",
      ),
    },
    notes: `
      country|China as a big land;Japan, where someone is from;France and Spain in Europe|a country is a whole land like China; a city is one big town in it|country 是像中国那样的整个国家；city 是其中的一个大城市|city/cities=city is one big town, like Beijing, not a whole land with its own flag=city 是像北京那样的一座大城市，不是有自己国旗的国家;language/languages=language is the words people speak, like Chinese, not a land=language 是人们说的话，比如中文，不是一片国土|coun · try|ou said like the u in *up*, and y changing to -ies|ou 读作 *up* 里的 u，复数把 y 变成 -ies
      city|Beijing;living in a big town, not on a farm;New York and London|a city is a big town; a country is a whole land|city 是大城市；country 是整个国家|country/countries=country is a whole land with its own flag, like China, not one big town like Beijing=country 是有自己国旗的整个国家，比如中国，不是北京那样的一座城市;language/languages=language is the words people speak, not a place where people live=language 是人们说的话，不是人们住的地方|ci · ty|c said like s, and y changing to -ies in *cities*|c 读作 s，复数 *cities* 要把 y 变成 -ies
      live|my home in Shanghai;a home in a small town;grandma's home in our house|you live where your home is; you come from the place where you started|live 是住在哪里；come from 是来自哪里|speak/speaks=speak means to say words or use a language, not to have your home somewhere=speak 是说话或说某种语言，不是住在某处;come/comes=come means to move toward a place, and it does not say where your home is=come 是来到某处，不是说家在哪里|live|a silent e at the end, and *lives* with an s for he and she|词尾 e 不发音；he、she 后面用加 s 的 *lives*
      from|China, before Canada;the place someone started;a friend who sent an email|from tells where something started; to tells where it goes|from 表示从哪里来；to 表示到哪里去|in=in tells where someone is now, not where they started=in 说的是现在在哪里，不是从哪里来;to=to tells where something goes, not where it started=to 说的是到哪里去，不是从哪里来|from|fr at the start and om at the end|开头是 fr，结尾是 om
      speak|Chinese and English;talking slowly;three languages|you speak a language; you say words or a sentence|speak 后面跟语言；say 后面跟话或句子|say/says=say goes with the words you say, as in *say hello*, not with a language or with *slowly* on its own=say 后面跟说的话，比如 *say hello*，不直接跟语言，也不单独跟 *slowly*;live/lives=live means to have your home in a place, not to use a language=live 是住在某处，不是说某种语言|speak|ea for the long e sound, and the past *spoke*|ea 发长 e 音，过去式是 *spoke*
      English|the language of the US;a word that is *nǐ hǎo* in Chinese;a teacher of words like *apple* and *book*|English is the language of the US and the UK; Chinese is the language of China|English 是美国和英国的语言；Chinese 是中国的语言|Chinese=Chinese is the language of China, not of the US, and *apple* and *book* are not Chinese words=Chinese 是中国的语言，不是美国的，*apple*、*book* 也不是中文词;language=language is the word for any way of speaking, not one language by name=language 是所有语言的统称，不是某一种语言的名字|Eng · lish|a capital E, and -ish at the end|开头大写 E，结尾是 -ish
      Chinese|the language of China;*nǐ hǎo* for hello;food eaten with chopsticks|Chinese is the language of China; English is the language of the US and the UK|Chinese 是中国的语言；English 是美国和英国的语言|English=English is the language of the US and the UK, not of China=English 是美国和英国的语言，不是中国的;language=language is the word for any way of speaking, not one language by name=language 是所有语言的统称，不是某一种语言的名字|Chi · nese|a capital C, and -ese at the end|开头大写 C，结尾是 -ese
      language|English;how many you can speak;Chinese, my first one|a language is words people speak; a country is a land|language 是人们说的话；country 是国家|country/countries=country is a land with its own flag, not words people speak=country 是有国旗的国家，不是人们说的话;city/cities=city is a big town, not words people speak=city 是大城市，不是人们说的话|lan · guage|-guage at the end: u comes before a|结尾是 -guage：u 在 a 前面
      phone|calling me;something ringing;no calls in class|a phone is for calling and talking; an email is a written message|phone 用来打电话；email 是写的信息|email/emails=email is a message you write and send, not a thing you call on or that rings=email 是写好发送的信息，不是用来打电话或会响铃的东西;camera/cameras=camera is for taking photos, not for calling people=camera 是用来拍照的，不是用来打电话的|phone|ph said like f, and a silent e at the end|ph 读作 f，词尾 e 不发音
      number|a phone number;a lucky seven;one to ten|a number is like one, 2 or ten; an email is a message|number 是数字或号码；email 是信息|email/emails=email is a message you send, not a word or sign like one, 2 or ten=email 是发送的信息，不是数字;name/names=name is what someone is called, not a word or sign like seven=name 是名字，不是数字|num · ber|-ber at the end, and mb in the middle|中间是 mb，结尾是 -ber
      email|a message to my teacher;something to check on a computer;many messages every day|an email is a written message; a phone is a thing you call on|email 是写的信息；phone 是打电话用的东西|phone/phones=phone is a thing you call people on, not a message you send=phone 是打电话用的东西，不是发送的信息;number/numbers=number is a word or sign like seven, not a message=number 是数字，不是信息|e · mail|one word: e and *mail*|是一个词：e 加 *mail*
    `,
  },
});

const feelings = vocabularyTopic({
  id: "a1-words-feelings",
  title: t("How I Feel", "我的感受"),
  summary: t(
    "Saying how you feel: fine, tired, sick, angry, afraid; and what you hate.",
    "说说你的感受：fine、tired、sick、angry、afraid，以及你讨厌什么。",
  ),
  intro: t(
    "After the long race, Ben **feels** **tired** but **great**. His little sister is **sick** in bed. These words help you say how you feel and ask how other people are.",
    "长跑之后，Ben **feels**（感觉）**tired**（累）但很 **great**（棒）。他妹妹 **sick**（生病）躺在床上。这些词帮你说出自己的感受，也能问问别人怎么样。",
  ),
  prerequisites: ["pre-a1-words-little-words"],
  words: [
    word(
      "feel feels felt feeling",
      "to have a feeling in your body or your mind",
      "感觉；觉得",
      "I {feel} happy today. | How do you {feel}? I feel tired. | She {felt} sad and cried all day.|filled fell",
      "fill fall",
    ),
    word(
      "fine",
      "well, or good enough",
      "好的；不错的",
      "How are you? I'm {fine}, thanks. I feel good. | Don't worry, it's {fine}. There is no problem. | The weather is {fine} today. Let's go out.",
      "sick angry",
      "okay well",
    ),
    word(
      "well",
      "healthy, not sick; also, in a good way",
      "健康的；好地",
      "I was sick, but now I am {well} again. | She sings very {well}. | Get {well} soon! I hope you feel better.",
      "sick ill",
      "fine okay",
    ),
    word(
      "okay",
      "all right; not bad",
      "好的；还行",
      "Is it {okay} if I sit here? — Sure. | Is everything {okay}? You look sad. | The food is {okay}, but it's not great.",
      "tired sick",
      "fine well",
    ),
    word(
      "great greater greatest",
      "very good",
      "很棒的；极好的",
      "You won! That's {great}! | We had a {great} time at the party, and we want to go again. | Your English is {great}! You speak so well.",
      "bad sad",
    ),
    word(
      "tired",
      "needing rest or sleep",
      "累的；疲倦的",
      "I ran ten kilometers. Now I am very {tired}. | The baby is {tired}. She needs a sleep. | You look {tired}. Did you sleep well?",
      "angry afraid",
    ),
    word(
      "sick",
      "not well; ill",
      "生病的",
      "I am {sick}. I have a cold. | Tom is {sick} today, so he is at home. | I feel {sick}. My tummy hurts.",
      "fine well",
    ),
    word(
      "angry",
      "feeling very bad about something someone did",
      "生气的",
      "Mom is {angry}. I broke her cup. | Don't be {angry} with me. I'm sorry. | The man shouts and his face goes red. He is very {angry}.",
      "afraid tired",
    ),
    word(
      "afraid",
      "feeling that something bad will happen",
      "害怕的",
      "I am {afraid} of dogs. | Don't be {afraid}. The dog is friendly. | The little girl is {afraid} of the dark.",
      "angry sad",
    ),
    word(
      "now",
      "at this time",
      "现在",
      "Right {now}, it is raining. | Do your homework {now}, not later. | I was tired, but {now} I feel fine.",
      "again ago",
    ),
    word(
      "again",
      "one more time",
      "再；又",
      "Can you say that {again}, please? I didn't hear you the first time. | Hello {again}! We met this morning. | I'm sick {again}! This is the third time this month.",
      "now ago",
    ),
    word(
      "hate hates hated hating",
      "to dislike someone or something very much",
      "讨厌；憎恨",
      "I {hate} cold weather. I don't like it at all. | My brother {hates} getting up early. He wants to stay in bed.|loves likes | She loves cats, but she {hates} dogs. She runs away from them.|loves likes",
      "love like",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Fine*, *well* and *okay* all answer *How are you?*, but only *well* also says how you do something, as in *sings well*. Look for the clue about rest, illness or what someone did before you choose *tired*, *sick* or *angry*.",
        "*fine*、*well* 和 *okay* 都能回答 *How are you?*，但只有 *well* 还能说明事情做得怎样，比如 *sings well*。选 *tired*、*sick* 或 *angry* 之前，先找句中关于休息、生病或别人做了什么的线索。",
      ),
      meaning: t(
        "*Afraid* is being scared of something that may happen; *angry* is feeling bad about what someone did; *hate* is the strong opposite of *love*.",
        "*afraid* 是害怕可能发生的事；*angry* 是因别人做的事而生气；*hate* 是 *love* 的强烈反义。",
      ),
      spell: t(
        "*Angry* has no e between g and r, so not *angery*. *Afraid* and *again* both carry ai, and *felt* is the past of *feel*.",
        "*angry* 的 g 和 r 之间没有 e，不是 *angery*。*afraid* 和 *again* 都有 ai，*felt* 是 *feel* 的过去式。",
      ),
    },
    notes: `
      feel|happy today;asking how someone is;a sad day of crying|you feel happy or tired; you fill a cup|feel 是感觉；fill 是装满|fill/filled=fill means to make something full, as in *fill a cup*, not to have a feeling=fill 是装满，比如 *fill a cup*，不是感觉;fall/fell=fall means to drop down to the ground, not to have a feeling=fall 是掉下、摔倒，不是感觉|feel|a double e for the long sound, and the past *felt*|双写 e 发长音，过去式是 *felt*
      fine|an answer to how are you;a problem that is no problem;weather good for going out|fine means all right; sick means ill|fine 是还好；sick 是生病|sick=sick means ill, not all right, and it cannot describe a good day or no problem=sick 是生病，不是还好，也不能形容没问题或好天气;angry=angry means feeling bad about what someone did, not all right=angry 是因别人做的事生气，不是还好|fine|a silent e that makes the i say its name, so not *fin*|词尾 e 不发音，让 i 读字母本音，不是 *fin*
      well|healthy again after being sick;singing in a good way;a wish to someone who is ill|well means healthy or in a good way; sick means ill|well 是健康或做得好；sick 是生病|sick=sick means ill, the opposite of healthy, and it cannot say how someone does something=sick 是生病，和健康相反，也不能说明事情做得怎样;ill=ill is another word for sick, the opposite of healthy, and it cannot tell how someone does something=ill 也是生病的意思，和健康相反，也不能说明事情做得怎样|well|a double l, and *well* is also the word after *sings*|双写 l；*sings* 后面也用 *well*
      okay|asking to sit somewhere;asking if all is right;food that is not great|okay means all right; tired means needing sleep|okay 是还行；tired 是累|tired=tired describes a person or an animal that needs sleep, not a plan, things in general or food=tired 形容需要睡觉的人或动物，不能形容一件事、整体情况或食物;sick=sick describes someone who is ill, not a plan, things in general or food=sick 形容生病的人，不能形容一件事、整体情况或食物|o · kay|a k in the middle, and it can also be written *OK*|中间是 k，也可以写成 *OK*
      great|winning;a party to go to again;speaking so well|great means very good; bad means not good|great 是很棒；bad 是不好|bad=bad is the opposite of good, but winning, wanting to go again and speaking well are good things=bad 是不好，可赢了、还想再去、说得好都是好事;sad=sad means unhappy, but winning, wanting to go again and speaking well are happy things=sad 是难过，可赢了、还想再去、说得好都是开心事|great|ea said like the a in *name*, not like *eat*|ea 读作 *name* 里的 a，不像 *eat*
      tired|after running ten kilometers;a baby who needs sleep;a question about sleeping well|tired means needing rest; angry means upset with someone|tired 是需要休息；angry 是生某人的气|angry=angry means feeling bad about what someone did, but the sentence is about needing rest or sleep=angry 是因别人做的事生气，可句子说的是需要休息或睡觉;afraid=afraid means scared that something bad will happen, but the sentence is about needing rest or sleep=afraid 是害怕坏事发生，可句子说的是需要休息或睡觉|tired|*tie* + *-red*, so not *tierd*|*tie* 加 *-red*，不是 *tierd*
      sick|a cold;staying at home;a tummy that hurts|sick means ill; fine means all right|sick 是生病；fine 是还好|fine=fine means all right, but a cold, staying home and a sore tummy show the person is ill=fine 是还好，可感冒、待在家、肚子疼都说明人病了;well=well means healthy, the opposite of ill=well 是健康，和生病相反|sick|ck at the end, so not *sik*|结尾是 ck，不是 *sik*
      angry|a broken cup;saying sorry;shouting with a red face|angry means upset with someone; afraid means scared|angry 是生气；afraid 是害怕|afraid=afraid means scared of something, but here someone broke a cup, said sorry or shouts with a red face=afraid 是害怕，可这里是有人打破杯子、道歉或红着脸大喊;tired=tired means needing sleep, not upset with someone=tired 是需要睡觉，不是生某人的气|an · gry|-gry at the end with no e, so not *angery*|结尾是 -gry，没有 e，不是 *angery*
      afraid|dogs;a friendly dog;the dark|afraid means scared; angry means upset with someone|afraid 是害怕；angry 是生气|angry=angry goes with *at* or *with* and means feeling bad about what someone did, not being scared of dogs or the dark=angry 跟 *at* 或 *with* 连用，指因别人做的事生气，不是害怕狗或黑暗;sad=sad means unhappy, and nobody is *sad of* something=sad 是难过，没有 *sad of* 的说法|a · fraid|ai said like the a in *made*, and only one f|ai 读作 *made* 里的 a，只有一个 f
      now|rain at this moment;homework before later;feeling fine after being tired|now means at this time; again means one more time|now 是现在；again 是再一次|again=again means one more time, not at this time=again 是再一次，不是现在;ago=ago comes after a time, as in *two days ago*, and points to the past=ago 放在时间后面，比如 *two days ago*，指过去|now|ow said like *cow*, not like *know*|ow 读作 *cow* 里的音，不像 *know*
      again|saying something one more time;a second hello on the same day;being sick for the third time|again means one more time; now means at this time|again 是再一次；now 是现在|now=now means at this time, but each sentence is about a second or third time=now 是现在，可每句说的都是第二次或第三次;ago=ago comes after a time, as in *two days ago*, not after a verb or a hello=ago 放在时间后面，比如 *two days ago*，不放在动词或 hello 后面|a · gain|ai in the middle, and the first a said like *uh*|中间是 ai，开头的 a 读作 *uh*
      hate|cold weather;getting up early;dogs she runs away from|hate means to dislike very much; love means to like very much|hate 是很讨厌；love 是很喜欢|love/loves=love means to like very much, but the rest of the sentence shows the thing is not wanted=love 是很喜欢，可句子后面说明并不想要;like/likes=like means to enjoy, but the rest of the sentence shows the thing is not wanted=like 是喜欢，可句子后面说明并不想要|hate|a silent e that makes the a say its name, so *hate*, not *hat*|词尾 e 不发音，让 a 读字母本音：是 *hate*，不是 *hat*
    `,
  },
});

const everyday = vocabularyTopic({
  id: "a1-words-everyday-words",
  title: t("Everyday Words", "日常用词"),
  summary: t("Common words for things, places, people and ideas.", "表示东西、地方、人和想法的常用词。"),
  intro: t(
    "Grandma tells me about her **life** and the **places** she saw. I'm **sure** she is a very special **person**. These words help you talk about things, places, people and ideas.",
    "奶奶给我讲她的 **life**（生活）和她去过的 **places**（地方）。我 **sure**（确信）她是个很特别的 **person**（人）。这些词帮你谈论东西、地方、人和想法。",
  ),
  prerequisites: ["pre-a1-words-little-words"],
  words: [
    word(
      "thing things",
      "an object; something you can see or touch",
      "东西；事情",
      "What is that {thing} on the table? | Put your {things} in your bag.|people lives | There are many {things} to do today.|people lives",
      "person life",
    ),
    word(
      "place places",
      "a part of a town or of the world; where something is",
      "地方",
      "This park is a nice {place} to play. | Put the book back in its {place}. | Paris is a beautiful {place}. I want to go there.",
      "thing person",
    ),
    word(
      "person",
      "one man, woman or child",
      "人",
      "She is a very kind {person}. | One {person} can sit in this chair. | Who is that {person} at the door?",
      "thing place",
    ),
    word(
      "life",
      "the time when someone is alive; the way someone lives",
      "生活；生命",
      "My grandma had a long, happy {life}. | This is the best day of my {life}! | {Life} in a big city is busy.",
      "idea part",
    ),
    word(
      "idea ideas",
      "a thought or a plan",
      "主意；想法",
      "Let's go to the park! — Good {idea}! | I have a good {idea}. Let's make a cake. | Do you have any {ideas} about what to do at the party?|places parts",
      "place part",
    ),
    word(
      "part parts",
      "one of the pieces of a whole thing",
      "部分",
      "The head is a {part} of the body. | I like the first {part} of the story, but not the end. | A car has many {parts}.|lives ideas",
      "life idea",
    ),
    word(
      "cry cries cried crying",
      "to have tears come from your eyes",
      "哭",
      "The baby {cries} when he is hungry.|laughs smiles | Don't {cry}. Everything is okay. | She {cried} at the end of the sad movie.|laughed smiled",
      "laugh smile",
    ),
    word(
      "high higher highest",
      "far above the ground; tall",
      "高的",
      "The bird flies {high} in the sky, far above the trees. | This mountain is very {high}. It is hard to climb to the top. | The shelf is too {high}. I can't reach it, even on my toes.",
      "low deep",
    ),
    word(
      "low lower lowest",
      "near the ground; not high",
      "低的；矮的",
      "The table is {low}. Small children can sit at it. | The sun is {low} in the sky in the evening. | The wall is {low}, so I can jump over it.",
      "high deep",
    ),
    word(
      "sure",
      "knowing that something is true",
      "确定的；肯定的",
      "Are you {sure}? — Yes, I know it's right. | I'm not {sure} where my pen is. | Can I use your phone? — {Sure}, here you are.",
      "ready real",
    ),
    word(
      "ready",
      "prepared and able to start",
      "准备好的",
      "Dinner is {ready}! Come and eat. | Are you {ready} for school? Let's go! | My bag is packed and my shoes are on. I'm {ready}!",
      "sure real",
    ),
    word(
      "real",
      "true; not made up",
      "真的；真实的",
      "Is that a {real} cat or a toy? | This is a {real} story. It happened to my grandpa. | Dragons are not {real}. They are only in stories.",
      "ready sure",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Person* is for someone, *thing* for something and *place* for somewhere. Ask whether the gap is a someone, a something or a somewhere before you choose.",
        "*person* 指人，*thing* 指东西，*place* 指地方。选之前先问：空格说的是人、东西还是地方？",
      ),
      meaning: t(
        "*High* and *low* are opposites about how far up something is. *Ready* means prepared, *sure* means certain and *real* means not made up.",
        "*high* 和 *low* 是一对反义词，说的是离地面多高。*ready* 是准备好了，*sure* 是确定，*real* 是真实不虚构。",
      ),
      spell: t(
        "*High* hides a silent gh; *life* becomes *lives*; *cry* becomes *cries* and *cried*, and *person* usually becomes *people*.",
        "*high* 里的 gh 不发音；*life* 的复数是 *lives*；*cry* 变成 *cries* 和 *cried*；*person* 的复数通常是 *people*。",
      ),
    },
    notes: `
      thing|something on the table;my objects for the bag;jobs to do today|a thing is an object; a person is a man, woman or child|thing 是东西；person 是人|person/people=person is a man, woman or child, not an object or a job to do=person 是人，不是东西，也不是要做的事;life/lives=life is the time someone is alive, not an object or a job to do=life 是人活着的时光，不是东西，也不是要做的事|thing|th as in *think*, then -ing|th 和 *think* 一样，后面是 -ing
      place|a park for playing;where the book goes back;Paris|a place is somewhere; a thing is an object|place 是地方；thing 是东西|thing=thing is an object, not somewhere you can play, put something back or go=thing 是东西，不是可以玩、放回去或去的地方;person=person is a man, woman or child, not somewhere=person 是人，不是地方|place|c said like s, and a silent e at the end|c 读作 s，词尾 e 不发音
      person|someone kind;one sitter for a chair;someone at the door|a person is a man, woman or child; a thing is an object|person 是人；thing 是东西|thing=thing is an object, but someone kind, someone sitting or someone at the door is a human=thing 是东西，可善良的、坐着的、站在门口的都是人;place=place is somewhere, not a man, woman or child=place 是地方，不是人|per · son|the plural is usually *people*, not *persons*|复数通常是 *people*，不是 *persons*
      life|grandma's long happy years;the best day ever;city living|life is the time someone is alive; an idea is a thought|life 是一生、生活；idea 是想法|idea=idea is a thought or a plan, not the time someone lives or the way people live=idea 是想法或计划，不是人的一生或生活方式;part=part is one piece of a whole thing, not the time someone lives or the way people live=part 是整体的一部分，不是人的一生或生活方式|life|f in *life* changing to v in *lives*|*life* 的 f 在复数 *lives* 里变成 v
      idea|going to the park;making a cake;things to do at the party|an idea is a thought or a plan; a place is somewhere|idea 是想法；place 是地方|place/places=place is somewhere you go, not a thought or a plan=place 是去的地方，不是想法或计划;part/parts=part is a piece of a whole thing, not a thought or a plan=part 是整体的一部分，不是想法或计划|i · de · a|a final a said like *uh*, so not *ideer*|结尾的 a 读作 *uh*，不是 *ideer*
      part|the head of the body;the start of a story;pieces of a car|a part is one piece of a whole; an idea is a thought|part 是一部分；idea 是想法|life/lives=life is the time someone is alive, not a piece of a body, a story or a car=life 是人活着的时光，不是身体、故事或汽车的一部分;idea/ideas=idea is a thought, not a piece of a whole thing=idea 是想法，不是整体的一部分|part|ar said like *car*|ar 读作 *car* 里的音
      cry|a hungry baby;comfort that everything is okay;the end of a sad movie|you cry with tears when you are sad; you laugh when something is funny|伤心时 cry（哭）；好笑时 laugh（笑）|laugh/laughs/laughed=laugh means to make happy sounds when something is funny, not to have tears from hunger or sadness=laugh 是因好笑而发出笑声，不是因饿或伤心而流泪;smile/smiles/smiled=smile means to make a happy face, not to have tears come from your eyes=smile 是露出笑脸，不是流泪|cry|y said like *eye* here, changing to i in *cries* and *cried*|y 在这里读作 *eye*，在 *cries*、*cried* 里变成 i
      high|a bird above the trees;a hard mountain climb;a shelf out of reach|high means far up; low means near the ground|high 是高；low 是低|low=low means near the ground, but far above the trees, a hard climb and a shelf out of reach are all far up=low 是靠近地面，可高过树梢、难以爬上、够不着都说明很高;deep=deep means going far down, as in a deep river, not far up=deep 是很深，比如深深的河，不是很高|high|a silent gh, so not *hi*|gh 不发音，不是 *hi*
      low|a table for small children;the evening sun;a wall to jump over|low means near the ground; high means far up|low 是低；high 是高|high=high means far above the ground, but small children sitting, the evening sun and a wall to jump over point near the ground=high 是很高，可小孩能坐、傍晚的太阳、能跳过的墙都说明很低;deep=deep means going far down, as in a deep river, not near the ground=deep 是很深，比如深深的河，不是靠近地面|low|ow said like *go*, not like *cow*|ow 读作 *go* 里的音，不像 *cow*
      sure|knowing it's right;not knowing where a pen is;yes to using a phone|sure means certain; ready means prepared|sure 是确定；ready 是准备好|ready=ready means prepared to start, not certain that something is true or saying yes to a request=ready 是准备好开始，不是确定某事是真的，也不是答应请求;real=real means true and not made up, as in a real cat, not feeling certain or saying yes=real 是真实不虚构，比如真的猫，不是确定，也不是答应|sure|s said like *sh*, so not *shure*|s 读作 *sh*，不是 *shure*
      ready|dinner to eat;going to school;a packed bag and shoes on|ready means prepared; sure means certain|ready 是准备好；sure 是确定|sure=sure means certain that something is true, not prepared to start=sure 是确定某事是真的，不是准备好开始;real=real means not made up, not prepared to start=real 是真实不虚构，不是准备好开始|rea · dy|ea said like the e in *red*|ea 读作 *red* 里的 e
      real|a cat or a toy;a story that happened;dragons in stories|real means not made up; ready means prepared|real 是真实的；ready 是准备好的|ready=ready means prepared to start, not true or made up=ready 是准备好开始，不是真的或假的;sure=sure means certain, and a cat, a story or a dragon cannot feel certain=sure 是确定，猫、故事或龙不会觉得确定|re · al|ea said as two sounds, *ree* and *ul*|ea 分成两个音：*ree* 和 *ul*
    `,
  },
});

// The present simple with I, you, we and they.

/** plainSubjects take the verb with no ending. */
const plainSubjects: readonly string[] = [
  "I",
  "You",
  "We",
  "They",
  "My parents",
  "Tom and I",
  "My friends",
  "Lily and Ben",
  "The children",
  "My brothers",
];

/** verbPhrases are a verb and the rest, true of anyone. */
const verbPhrases: readonly (readonly [verb: string, rest: string, ing: string])[] = [
  ["live", "in Beijing", "living"],
  ["speak", "English", "speaking"],
  ["like", "apples", "liking"],
  ["have", "a cat", "having"],
  ["go", "to school by bus", "going"],
  ["read", "books every day", "reading"],
  ["eat", "rice for lunch", "eating"],
  ["love", "music", "loving"],
  ["walk", "to the park", "walking"],
  ["play", "football", "playing"],
  ["speak", "Chinese at home", "speaking"],
];

const plainBank: readonly (readonly [subject: string, verb: string, rest: string, ing: string])[] = everyPair(
  plainSubjects,
  verbPhrases,
).map(([subject, [verb, rest, ing]]) => [subject, verb, rest, ing] as const);

const beFor = (subject: string) => (subject === "I" ? "am" : "are");

const presentChoiceBank: readonly ChoiceItem[] = plainBank.map(
  ([subject, verb, rest, ing]): ChoiceItem => [`${subject} ___ ${rest}. (${verb})`, verb, [`${beFor(subject)} ${verb}`, ing]],
);

const presentTypedBank: readonly TypedItem[] = everyPair([...plainSubjects].reverse(), verbPhrases).map(
  ([subject, [verb, rest]]): TypedItem => {
    const be = beFor(subject);
    return {
      shown: `${subject} ${be} ${verb} ${rest}.`,
      accepted: [`${subject} ${verb} ${rest}.`],
      wrong: [`${subject} ${be} ${verb} ${rest}.`, `${subject} ${verb}s ${rest}.`],
    };
  },
);

const presentSimple: TopicDef = {
  id: "present-simple",
  title: t("The Present Simple", "一般现在时"),
  summary: t(
    "I live in Beijing. We speak Chinese. What is true or usual, with no ending after I, you, we and they.",
    "I live in Beijing. We speak Chinese. 一般现在时说明真实或经常的情况；I、you、we、they 后面的动词不加词尾。",
  ),
  intro: t(
    "Compare *They read books every day.* with *They are happy.* When a sentence already has an action verb like *read*, *walk*, or *eat*, English does not put *am* or *are* in front of it—and after *I*, *you*, *we*, *they*, or plural subjects, the verb stays plain. In this topic, you choose the plain present-simple verb and remove extra *am*/*are*.",
    "比较 *They read books every day.* 和 *They are happy.* 句子里已经有 *read*、*walk*、*eat* 这样的实义动词时，前面不再加 *am* 或 *are*；而且主语是 *I*、*you*、*we*、*they* 或复数时，动词保持原形。本主题带你正确选用一般现在时动词原形，并去掉多余的 *am*/*are*。",
  ),
  prerequisites: ["the-verb-be", "a1-words-about-me"],
  encompasses: [{ topic: "a1-words-about-me", weight: 0.3 }],
  xp: 15,
  strand: "grammar",
  knowledgePoints: [
    point(
      "choose",
      t("The plain verb", "动词原形"),
      t(
        "To say what is true or what happens often, use the present simple. With *I*, *you*, *we*, *they* and more than one person, the verb is plain: *I live in Beijing. We speak Chinese. My friends play football.*\n\n> **Watch out.** Do not slip *am* or *are* in front of a plain verb (*I am live*), and do not use a bare *-ing* word (*I living*) as the only verb of a sentence.",
        "说明真实情况或经常发生的事，用一般现在时。主语是 *I*、*you*、*we*、*they* 或多个人时，动词用原形：*I live in Beijing. We speak Chinese. My friends play football.*\n\n> **注意。** 不要在实义动词前多加 *am* 或 *are*（如 *I am live*），也不要把单独的 *-ing* 形式（如 *I living*）当作整句的谓语动词。",
      ),
      choiceGenerator(
        t("Choose the words for the gap.", "选出填入空白处的词。"),
        presentChoiceBank,
        (right, shown) =>
          t(
            `With *${shown.split(" ___")[0]}*, the present simple uses the plain verb, with no ending and no *am* or *are*: ${shown.replace(/ \(.*\)$/u, "").replace("___", `*${right}*`)}\n\n**Check.** Confirm that *${shown.split(" ___")[0]}* is *I*, *you*, *we*, *they*, or plural, and that *${right}* sits right after it with no *am/are* and no *-ing*.`,
            `主语是 *${shown.split(" ___")[0]}* 时，一般现在时用动词原形，不加词尾，也不加 *am* 或 *are*：${shown.replace(/ \(.*\)$/u, "").replace("___", `*${right}*`)}\n\n**检验。** 确认主语 *${shown.split(" ___")[0]}* 是 *I*、*you*、*we*、*they* 或复数，且 *${right}* 紧跟在主语后面，既没有 *am/are* 也没有 *-ing*。`,
          ),
        (wrong, _right, _shown, position) =>
          position === 0
            ? t(
                `*${wrong}* puts a form of *be* before the verb, but a sentence that already has a verb needs no *am* or *are*.`,
                `*${wrong}* 在动词前加了 *be*，可句子已经有动词，就不需要 *am* 或 *are*。`,
              )
            : t(
                `*${wrong}* is the *-ing* form, which cannot be the verb of a sentence alone; what is true or usual takes the plain verb.`,
                `*${wrong}* 是 *-ing* 形式，不能单独作句子的动词；说明真实或经常的情况要用动词原形。`,
              ),
      ),
    ),
    point(
      "no-be",
      t("No am or are before the verb", "动词前不加 am 或 are"),
      t(
        "A sentence with a verb like *live*, *speak* or *like* needs no *am*, *is* or *are*. Not *I am live in Beijing.* but *I live in Beijing.*\n\n> **Watch out.** Remove *am* or *are* and leave the action verb completely plain—do not add *-s* after *I*, *you*, *we*, *they*, or plural subjects.",
        "句子里已经有 *live*、*speak*、*like* 这样的动词时，就不再需要 *am*、*is*、*are*。说中文的人学了 *I am* 以后，常写出 *I am live in Beijing.*，正确的是 *I live in Beijing.*\n\n> **注意。** 删掉多余的 *am* 或 *are* 后，实义动词保持原形——在 *I*、*you*、*we*、*they* 或复数主语后不要多加 *-s*。",
      ),
      typedGenerator("sentence", t("Fix the sentence.", "改正这个句子。"), presentTypedBank, (right, shown) => {
        const be = shown.includes(" am ") ? "am" : "are";
        const verb = shown.split(` ${be} `)[1]?.split(" ")[0] ?? "";
        return t(
          `The sentence already has the verb *${verb}*, so *${be}* must go: ${shown} → ${right}\n\n**Check.** Read the fixed sentence—there is now just one verb (*${verb}*) directly after the subject, with no *${be}* in front of it.`,
          `句子里已经有动词 *${verb}*，所以要去掉 *${be}*：${shown} → ${right}\n\n**检验。** 读一遍改后的句子——主语后面现在只有一个实义动词 *${verb}*，前面没有多余的 *${be}*。`,
        );
      }),
    ),
  ],
};

const littleWords3 = vocabularyTopic({
  id: "a1-words-little-words-3",
  title: t("Little Words 3", "小词 3"),
  summary: t("As, let's, each, alone and onto; oh, wow, hey and yeah.", "as、let's、each、alone 和 onto；oh、wow、hey 和 yeah。"),
  intro: t(
    "**Wow**, it's sunny! **Let's** go out. **Each** of us can take a bike, so nobody stays at home **alone**. These little words help you make plans, talk about everyone one by one and show surprise.",
    "**Wow**（哇），天晴了！**Let's**（我们）出去吧。我们 **Each**（每个人）都骑一辆车，谁也不用 **alone**（独自）待在家。这些小词帮你提出计划、逐个说到每个人，还能表达惊讶。",
  ),
  prerequisites: ["a1-words-everyday-words"],
  words: [
    word(
      "as",
      "in the same way; in the job or role of",
      "像……一样；作为",
      "She is {as} tall as her mother. | He works {as} a cook in a big hotel. | Do {as} I do: watch and then try.",
      "so than",
    ),
    word(
      "let's",
      "let us; a way to say what you want to do together",
      "让我们",
      "It's sunny. {Let's} go to the park! — Yes, let's go together.|Don't Please | {Let's} have pizza for dinner. — Good idea! We all love pizza.|Don't Please | We are all hungry. {Let's} eat now!|Don't Please",
      "don't please",
    ),
    word(
      "each",
      "every one of two or more, one by one",
      "每个",
      "The teacher gave a book to {each} child. | {Each} room has a window. | The apples are fifty cents {each}. | We have two cats, and {each} cat has a bed.",
      "all both",
      "every",
    ),
    word(
      "alone",
      "with no other people",
      "独自；单独",
      "My grandpa lives {alone}, so we visit him every Sunday. | Don't go into the forest {alone}. Take a friend with you. | I like to read {alone} in my room, with no one else. | She was {alone} in the house all day, with nobody to talk to.",
      "together alive",
    ),
    word(
      "onto",
      "to a place on something",
      "到……上",
      "The cat jumped {onto} the table, and now it is sitting on it. | Put the plates {onto} the tray and carry them to the table. | She climbed {onto} the horse and sat on its back. | The book fell {onto} the floor.",
      "into off",
    ),
    word(
      "oh",
      "a word you say when you are surprised or you remember something",
      "哦；啊",
      "{Oh} no! I forgot my keys! | {Oh} no! It's raining and I have no umbrella. | {Oh} dear! I'm sorry. Are you okay?",
      "wow yeah",
    ),
    word(
      "wow",
      "a word you say when something is very good or surprising",
      "哇",
      "Is that dress for me? {Wow}! It's beautiful! | Look at my picture! — {Wow}, you are very good at drawing! | You got a new bike? {Wow}!",
      "hey yeah",
    ),
    word(
      "hey",
      "a friendly word to say hello or to make someone look at you",
      "嘿",
      "{Hey}, Tom! How are you? | {Hey}! Give me back my bag! | {Hey}, Ann! Come here and look at this photo.",
      "wow yeah",
    ),
    word(
      "yeah",
      "yes, in friendly talk",
      "是啊；对",
      "Are you hungry? — {Yeah}, a little. | Do you like it? — {Yeah}, it's great! | Can you come to my party? — {Yeah}, I can!",
      "no hey",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Each* goes with one thing at a time, as in *each child* or *each room has*; *all* and *both* need more than one. For the talk words, ask what the moment is: *wow* for something amazing, *hey* to call someone, *yeah* to answer yes.",
        "*each* 后面跟单个的东西，比如 *each child*、*each room has*；*all* 和 *both* 要跟复数。口语小词看场合：惊叹用 *wow*，叫人用 *hey*，回答“是”用 *yeah*。",
      ),
      meaning: t(
        "*Alone* means with nobody else; *onto* means moving to a place on top of something; *as* says two things are the same, as in *as tall as*.",
        "*alone* 是身边没有别人；*onto* 是移到某物上面；*as* 说两样东西一样，比如 *as tall as*。",
      ),
      spell: t(
        "*Let's* needs an apostrophe because it stands for *let us*. *Onto* is written as one word, and *yeah* ends in -eah.",
        "*let's* 要有撇号，因为它是 *let us* 的缩写。*onto* 写成一个词，*yeah* 以 -eah 结尾。",
      ),
    },
    notes: `
      as|the same height as her mother;a job in a hotel;copying what I do|as says the same; than says more or less|as 表示一样；than 表示比较的多少|so=so means very or gives a result, and it cannot compare in *as tall as*, name a job or mean *in the same way*=so 是很或所以，不能用于 *as tall as* 的比较，不能说职业，也不是“同样地”;than=than goes after words like *taller*, as in *taller than*, not before *tall*, a job or *I do*=than 放在 *taller* 这类词后面，比如 *taller than*，不放在 *tall*、职业或 *I do* 前面|as|s said like z|s 读作 z
      let's|a sunny day in the park;pizza for dinner;everyone hungry|let's means we all do it together; please asks someone else to do it|let's 是我们一起做；please 是请别人做|don't=don't tells someone not to do something, but here everyone wants to do it together=don't 是叫人别做，可这里大家都想一起做;please=please asks someone else to do something, not all of us together=please 是请别人做，不是我们一起做|let's|an apostrophe before the s, for *let us*, so not *lets*|s 前有撇号，代表 *let us*，不是 *lets*
      each|a book for every child;windows in the rooms;the price of one apple;a bed for every cat|each means every one, one by one; all means the whole group together|each 是每一个，逐个；all 是全部一起|all=all is for the whole group together and needs a plural, as in *all children have*, not *child*, *room has* or a price for one=all 指整组一起，要跟复数，比如 *all children have*，不能跟 *child*、*room has*，也不能说单价;both=both is for two together and needs a plural, as in *both cats have*, not one by one=both 指两个一起，要跟复数，比如 *both cats have*，不是逐个|each|ea at the start and ch at the end|开头是 ea，结尾是 ch
      alone|grandpa living by himself;going into the forest;reading in my room;a whole day in the house|alone means with nobody else; together means with other people|alone 是独自；together 是一起|together=together means with other people, but the sentence shows nobody else is there=together 是和别人一起，可句子说明没有别人;alive=alive means living, not dead, and it does not say whether other people are there=alive 是活着，不是说身边有没有别人|a · lone|*a* + *lone* with a silent e, so not *alon*|*a* 加 *lone*，词尾 e 不发音，不是 *alon*
      onto|a cat on the table;plates on a tray;a girl on a horse;a book on the floor|onto means to a place on top; into means to the inside|onto 是到上面；into 是到里面|into=into means to the inside of something, but a table, a tray, a horse and the floor have tops to land on, not insides=into 是进到里面，可桌子、托盘、马和地板都是落在上面，不是进到里面;off=off means away from a top, the opposite of moving onto it=off 是从上面离开，和 onto 相反|on · to|one word: *on* + *to*|是一个词：*on* 加 *to*
      oh|forgotten keys;rain and no umbrella;saying sorry|oh is for a small surprise or problem; wow is for something amazing|oh 用于小小的意外或麻烦；wow 用于惊叹|wow=wow is for something amazing or very good, not for a problem or a small accident=wow 用于惊叹好东西，不用于麻烦或小意外;yeah=yeah means yes, but nobody asked a question=yeah 是“是的”，可没人提问|oh|a silent h at the end|结尾的 h 不发音
      wow|a beautiful dress;a good drawing;a new bike|wow shows you are amazed; hey calls someone|wow 表示惊叹；hey 是叫人|hey=hey is for saying hello or making someone look at you, not for showing you are amazed=hey 用来打招呼或叫人注意，不表示惊叹;yeah=yeah means yes and answers someone else's question, not shows you are amazed=yeah 是“是的”，用来回答别人的问题，不表示惊叹|wow|w at both ends, with o in the middle|开头和结尾都是 w，中间是 o
      hey|greeting Tom;asking for my bag back;calling Ann to see a photo|hey calls or greets someone; wow shows you are amazed|hey 是叫人或打招呼；wow 表示惊叹|wow=wow shows you are amazed by something, not that you are calling or greeting someone=wow 表示惊叹，不是叫人或打招呼;yeah=yeah means yes and answers a question, not calls someone=yeah 是“是的”，用来回答问题，不是叫人|hey|ey said like the a in *say*|ey 读作 *say* 里的 a
      yeah|being a little hungry;liking something;coming to a party|yeah means yes; no says the opposite|yeah 是“是的”；no 是“不”|no=no says the opposite, but the rest of the answer agrees=no 是“不”，可后半句是同意;hey=hey is for greeting or calling someone, not for answering a question=hey 是打招呼或叫人，不用来回答问题|yeah|-eah at the end, said like *yeh*|结尾是 -eah，读作 *yeh*
    `,
  },
});

/** topics are the topics of the unit All About Me. */
export const topics: readonly TopicDef[] = [
  numbers.topic,
  aboutMe.topic,
  feelings.topic,
  everyday.topic,
  littleWords3.topic,
  presentSimple,
];

/** vocabulary are the words the unit All About Me teaches. */
export const vocabulary: readonly WordBatch[] = [numbers.batch, aboutMe.batch, feelings.batch, everyday.batch, littleWords3.batch];
