// A1, unit 11: Jobs and People. Jobs, describing people and the actions of work, was and were, and descriptions of a
// person judged by a model.

import { type CriterionSpec, type Text, type TopicDef, t } from "@ga/content";
import {
  type ChoiceItem,
  choiceGenerator,
  criterionById,
  point,
  type TypedItem,
  typedGenerator,
  type WritingItem,
  writingGenerator,
} from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { everyPair, vocabularyTopic, word } from "../words.ts";

const jobs = vocabularyTopic({
  id: "a1-words-jobs",
  title: t("Jobs", "职业"),
  summary: t(
    "Doctors, nurses, farmers, drivers and police officers, and the places where people work.",
    "医生、护士、农民、司机和警察，以及人们工作的地方。",
  ),
  intro: t(
    "My mom is a **doctor** at the **hospital**, and my uncle is a **farmer** with cows on his **farm**. These words help you say what people do and where they work.",
    "我妈妈是 **hospital**（医院）的 **doctor**（医生），我叔叔是 **farmer**（农民），他的 **farm**（农场）上有奶牛。这些词帮你说出人们做什么工作、在哪里工作。",
  ),
  prerequisites: ["pre-a1-words-people"],
  words: [
    word(
      "job jobs",
      "the work that a person does to get money",
      "工作；职业",
      "My mom has a new {job}: she is a nurse at the hospital. | What's your dad's {job}? — He's a driver. | Teaching is a hard {job}.",
      "office worker",
    ),
    word(
      "doctor doctors",
      "a person whose job is to help sick people get better",
      "医生",
      "I'm ill. I need to see a {doctor}. | The {doctor} looks at my throat. | My aunt is a {doctor}. She helps sick people get better.",
      "farmer driver",
    ),
    word(
      "nurse nurses",
      "a person whose job is to look after sick people, often in a hospital",
      "护士",
      "The {nurse} gives me some medicine. | {Nurses} work in hospitals day and night.|Farmers Drivers | The {nurse} is kind and looks after the old man in the hospital.",
      "farmer driver",
    ),
    word(
      "farmer farmers",
      "a person whose job is to grow food or keep animals on a farm",
      "农民",
      "The {farmer} gets up at five to feed the cows. | {Farmers} grow rice in the south of China.|Nurses Drivers | My grandpa is a {farmer}. He grows apples.",
      "nurse driver",
    ),
    word(
      "driver drivers",
      "a person whose job is to drive a car, a bus or a train",
      "司机",
      "The bus {driver} says good morning to us. | Taxi {drivers} know every street in the city.|doctors farmers | My uncle is a truck {driver}.",
      "doctor farmer",
    ),
    word(
      "police",
      "the people whose job is to keep a town safe",
      "警察（总称）",
      "Call the {police}! They will come and help us. | The {police} are looking for the thief. | There is a {police} car outside the bank.",
      "officer office",
    ),
    word(
      "officer officers",
      "a person in the police or the army; a police officer",
      "警官；官员",
      "The police {officer} helps the children cross the road. | My mom is a police {officer}. | Two {officers} came to our school to talk about safety.|offices workers",
      "office worker",
    ),
    word(
      "worker workers",
      "a person who works, often with their hands",
      "工人；工作者",
      "The {workers} are building a new school.|farmers officers | My dad is a factory {worker}. | She is a hard {worker}. She never stops.",
      "farmer officer",
    ),
    word(
      "office offices",
      "a room or building where people work at desks",
      "办公室",
      "My mom works at a desk in an {office}. | The teachers' {office} is on the second floor. | There are ten desks in the {office}.",
      "officer factory",
    ),
    word(
      "hospital hospitals",
      "a building where sick people go to get better",
      "医院",
      "He broke his arm, so he went to the {hospital}. | Doctors and nurses work in a {hospital}. | I was born in this {hospital}.",
      "office farm",
    ),
    word(
      "farm farms",
      "land where people grow food and keep animals",
      "农场",
      "There are cows and pigs on the {farm}. | My grandpa lives on a {farm}. | We buy eggs from the {farm} near our house, where the chickens live.",
      "factory office",
    ),
    word(
      "factory factories",
      "a building where people make things with machines",
      "工厂",
      "They make cars in that {factory}. | My aunt works in a toy {factory}. | There are many {factories} near the river, with big machines.|farms offices",
      "farm office",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "Match the person to the place: a *doctor* and a *nurse* work in a *hospital*, a *farmer* on a *farm*, and a *worker* often in a *factory*. An *officer* is a person, but an *office* is a room.",
        "把人和地方对上：*doctor* 和 *nurse* 在 *hospital* 工作，*farmer* 在 *farm*，*worker* 常在 *factory*。*officer* 是人，*office* 是房间。",
      ),
      meaning: t(
        "*Police* means the whole group and takes *are*; one person is a *police officer*. Your *job* is the work you do to get money.",
        "*police* 指整个警察群体，动词用 *are*；一个警察叫 *police officer*。*job* 是你为挣钱做的工作。",
      ),
      spell: t(
        "*Officer* is *office* + *r*; *factory* becomes *factories*; *doctor* ends in -or, but *farmer*, *driver* and *worker* end in -er.",
        "*officer* 是 *office* 加 *r*；*factory* 的复数是 *factories*；*doctor* 以 -or 结尾，*farmer*、*driver*、*worker* 以 -er 结尾。",
      ),
    },
    notes: `
      job|a new place as a nurse;what dad does;teaching|a job is the work you do; an office is a room where some people work|job 是做的工作；office 是有些人工作的房间|office=office is a room with desks, not the work you do, and a driver or teaching is not an office=office 是有桌子的房间，不是你做的工作，司机或教书也不是办公室;worker=worker is a person, not the work itself=worker 是人，不是工作本身|job|a short o, and b at the end|短元音 o，结尾是 b
      doctor|someone to see when ill;someone who looks at my throat;someone who helps sick people get better|a doctor helps sick people get better; a farmer grows food|doctor 帮病人治病；farmer 种粮食|farmer=farmer grows food and keeps animals, not someone who looks at a sick person's throat=farmer 种粮食、养动物，不给病人看喉咙;driver=driver drives a car or a bus, not someone who makes sick people better=driver 开车，不给病人治病|doc · tor|-or at the end, so not *docter*|结尾是 -or，不是 *docter*
      nurse|someone giving medicine;hospital work day and night;looking after an old man in hospital|a nurse looks after sick people; a farmer looks after animals and plants|nurse 照顾病人；farmer 照料动物和庄稼|farmer/farmers=farmer works on a farm with animals and plants, not in a hospital with sick people=farmer 在农场里照料动植物，不在医院照顾病人;driver/drivers=driver drives a car or a bus, not someone who gives medicine or looks after sick people=driver 开车，不给药，也不照顾病人|nurse|ur said like *er*, and a silent e|ur 读作 *er*，词尾 e 不发音
      farmer|feeding cows at five;growing rice;growing apples|a farmer grows food on a farm; a driver drives a car or a bus|farmer 在农场种粮食；driver 开车|nurse/nurses=nurse looks after sick people, not cows, rice or apples=nurse 照顾病人，不照料奶牛、水稻或苹果;driver/drivers=driver drives a car or a bus, not someone who grows food or feeds cows=driver 开车，不种粮食，也不喂牛|farm · er|*farm* + *-er*|*farm* 加 *-er*
      driver|a bus;a taxi on every street;a truck|a driver drives; a doctor helps sick people|driver 开车；doctor 治病|doctor/doctors=doctor helps sick people, not someone who drives a bus, a taxi or a truck=doctor 给病人治病，不开公交车、出租车或卡车;farmer/farmers=farmer grows food, not someone who drives a bus, a taxi or a truck=farmer 种粮食，不开公交车、出租车或卡车|driv · er|the e of *drive* dropped before -er|*drive* 的 e 去掉，再加 -er
      police|calling them for help;looking for a thief;their car outside the bank|the police are the whole group; an officer is one person|police 是整个警察群体；officer 是一个人|officer=officer is one person, so it does not go with *they* or *are*, and an *officer car* is not English=officer 是一个人，不和 *they*、*are* 连用，也没有 *officer car* 的说法;office=office is a room with desks, not people who help or look for a thief=office 是有桌子的房间，不是帮忙或抓小偷的人|po · lice|-ice at the end, said like *peace*|结尾是 -ice，读作 *peace*
      officer|helping children cross the road;my mom's police job;two who talked about safety|an officer is a person; an office is a room|officer 是人；office 是房间|office/offices=office is a room, so it cannot help children, be your mom or come to school to talk=office 是房间，不会帮孩子、不会是你妈妈，也不会来学校讲话;worker/workers=worker is a person who works with their hands, but *police worker* is not English=worker 是用手干活的人，没有 *police worker* 的说法|of · fi · cer|*office* + *r*, with a double f|*office* 加 *r*，双写 f
      worker|people building a school;a factory job;someone who never stops|a worker is a person who works with their hands; a farmer works on a farm|worker 是用手干活的人；farmer 在农场工作|farmer/farmers=farmer works on a farm, not building a school or in a factory=farmer 在农场工作，不盖学校，也不在工厂里;officer/officers=officer is in the police or the army, not building a school or in a factory=officer 在警队或军队里，不盖学校，也不在工厂里|work · er|or said like *er*, then -er|or 读作 *er*，后面加 -er
      office|a desk at work;the teachers' room;ten desks|an office is a room with desks; an officer is a person|office 是有桌子的房间；officer 是人|officer=officer is a person, so you do not work *in* one or put desks in one=officer 是人，不能在人“里面”工作或放桌子;factory=factory is a big building with machines, not a room with desks, and it takes *a*, not *an*=factory 是有机器的大厂房，不是放桌子的房间，前面用 *a* 不用 *an*|of · fice|a double f, and -ice at the end|双写 f，结尾是 -ice
      hospital|a broken arm;where doctors and nurses work;where I was born|a hospital is where sick people get better; an office is where people work at desks|hospital 是看病的地方；office 是坐办公桌的地方|office=office is for desk work, not where you go with a broken arm or where doctors and nurses work=office 是坐办公桌的地方，断了胳膊不去那里，医生护士也不在那里工作;farm=farm is land with animals and plants, not where sick people get better=farm 是有动物和庄稼的地方，不是治病的地方|hos · pi · tal|-tal at the end, so not *hospitel*|结尾是 -tal，不是 *hospitel*
      farm|cows and pigs;grandpa's home;eggs from the chickens|a farm is land with animals and plants; a factory makes things with machines|farm 是有动物和庄稼的地方；factory 是用机器造东西的地方|factory=factory is a building with machines, not land with cows, pigs and chickens=factory 是有机器的厂房，不是养牛、猪和鸡的土地;office=office is a room with desks, not land with animals=office 是有桌子的房间，不是养动物的土地|farm|ar said like *car*|ar 读作 *car* 里的音
      factory|making cars;making toys;big machines by the river|a factory makes things with machines; a farm grows food|factory 用机器造东西；farm 种粮食|farm/farms=farm grows food and keeps animals, not making cars or toys with machines=farm 种粮食、养动物，不用机器造汽车或玩具;office/offices=office is for desk work, not making cars or toys with big machines=office 是坐办公桌的地方，不用大机器造汽车或玩具|fac · to · ry|y changing to -ies in *factories*|复数 *factories* 里 y 变成 -ies
    `,
  },
});

const describingPeople = vocabularyTopic({
  id: "a1-words-describing-people",
  title: t("Describing People", "描述人"),
  summary: t(
    "Young, tall, short, beautiful, kind, funny and friendly, and the words also and both.",
    "年轻、高、矮、美丽、善良、有趣和友好，还有 also 和 both。",
  ),
  intro: t(
    "My uncle is **tall** and **funny**, and my aunt is **short** and very **kind**. They **both** **smile** a lot. These words help you say what people look like and what they are like.",
    "我叔叔 **tall**（高）而且 **funny**（风趣），婶婶 **short**（矮）而且很 **kind**（善良）。他们 **both**（俩都）常常 **smile**（微笑）。这些词帮你描述人的长相和性格。",
  ),
  prerequisites: ["a1-words-jobs"],
  words: [
    word(
      "young younger youngest",
      "not old; having lived only a short time",
      "年轻的；年幼的",
      "My mom is {young}. She's only twenty-five. | My little brother is the {youngest} in our family. He was born last.|oldest tallest | My {younger} brother is five, and I'm eight.|older taller",
      "old tall",
    ),
    word(
      "tall taller tallest",
      "high from the feet to the head",
      "高的",
      "My dad is very {tall}. He can touch the ceiling. | Ben is {taller} than me. His head is above mine.|younger shorter | Giraffes are {tall} animals with long necks.",
      "short young",
    ),
    word(
      "short shorter shortest",
      "not tall; not long",
      "矮的；短的",
      "My grandma is {short}, and I'm taller than her. | She has {short} black hair. | This pencil is too {short}.",
      "tall young",
    ),
    word(
      "beautiful",
      "very nice to look at",
      "美丽的",
      "What a {beautiful} flower! | Your sister has {beautiful} long hair. | The beach is {beautiful} in the evening, with a pink and orange sky.",
      "busy friendly",
    ),
    word(
      "kind kinder kindest",
      "good and nice to other people",
      "善良的；友好的",
      "Our teacher is very {kind}. She always helps us. | It's {kind} of you to help me. | Be {kind} to animals.",
      "funny busy",
    ),
    word(
      "funny funnier funniest",
      "making people laugh",
      "有趣的；好笑的",
      "My uncle is very {funny}. He tells great jokes. | That's a {funny} story! Ha ha! | The clown has a {funny} red nose.",
      "kind friendly",
    ),
    word(
      "friendly friendlier friendliest",
      "kind and happy to talk to people",
      "友好的",
      "The new girl is very {friendly}. She says hello to everyone. | Our dog is {friendly}. It doesn't bite. | The people in this town are {friendly}. They always say hello.",
      "busy funny",
    ),
    word(
      "busy busier busiest",
      "with a lot to do; not free",
      "忙碌的",
      "Mom is {busy} at work today, so Dad is cooking. | I'm {busy} now. Can we talk later? | The doctors are very {busy} in winter. They have no free time.",
      "free funny",
    ),
    word(
      "nice nicer nicest",
      "good; pleasant",
      "好的；令人愉快的",
      "Have a {nice} day! | Your new dress is very {nice}. | It's {nice} to meet you.",
      "kind friendly",
    ),
    word(
      "smile smiles smiled smiling",
      "to make a happy face, with the ends of your mouth up; a happy face like this",
      "微笑",
      "Look at the camera and {smile}! | She has a lovely {smile}. | The baby {smiled} at me.|cried sang",
      "cry sing",
    ),
    word(
      "also",
      "too; as well",
      "也",
      "My mom is a doctor. My dad is {also} a doctor. | I like cats, and I {also} like dogs. | Lily can swim. She can {also} ride a bike.",
      "both only",
    ),
    word(
      "both",
      "the two; this one and that one",
      "两个都",
      "{Both} of my parents work in an office. | {Both} my sisters are tall. I have two sisters. | I have two cats, and I like {both} of them.",
      "also all",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Tall*, *short* and *young* describe how someone looks; *kind*, *funny*, *friendly* and *busy* describe what someone is like. Look for the clue: a height, an age, a joke or a busy day.",
        "*tall*、*short*、*young* 描述外表；*kind*、*funny*、*friendly*、*busy* 描述性格或状态。找线索：身高、年龄、笑话，还是忙碌的一天。",
      ),
      meaning: t(
        "*Both* is for exactly two, as in *both of my parents*; *all* is for three or more. *Also* adds one more fact, as in *She can also ride a bike*.",
        "*both* 只用于两个，比如 *both of my parents*；*all* 用于三个或更多。*also* 是再补充一件事，比如 *She can also ride a bike*。",
      ),
      spell: t(
        "*Beautiful* has eau after the b and one l at the end. *Funny*, *busy* and *friendly* change y to -ier and -iest.",
        "*beautiful* 的 b 后面是 eau，结尾只有一个 l。*funny*、*busy*、*friendly* 的比较级和最高级把 y 变成 -ier、-iest。",
      ),
    },
    notes: `
      young|only twenty-five;born last in the family;a five-year-old brother|young means having lived a short time; old means having lived a long time|young 是年轻、年幼；old 是年纪大|old/oldest/older=old means having lived a long time, but twenty-five, being born last and being five are not old=old 是年纪大，可二十五岁、最后出生、五岁都不老;tall/tallest/taller=tall is about height, not about age or who was born last=tall 说的是身高，不是年龄或谁最后出生|young|ou said like the u in *up*|ou 读作 *up* 里的 u
      tall|touching the ceiling;a head above mine;long necks|tall means high from feet to head; short means not tall|tall 是高；short 是矮|short/shorter=short means not tall, but touching the ceiling, a head above mine and long necks are tall=short 是矮，可摸到天花板、头比我高、长脖子都说明很高;young/younger=young is about age, not about height=young 说的是年龄，不是身高|tall|a double l, and a said like *all*|双写 l，a 读作 *all* 里的音
      short|a grandma smaller than me;hair that is not long;a pencil that is too small|short means not tall or not long; tall means high|short 是矮或短；tall 是高|tall=tall means high, but the grandma is smaller than me, and hair and a pencil are not tall=tall 是高，可奶奶比我矮，头发和铅笔也不说高;young=young is about age, and hair or a pencil is not young=young 说的是年龄，头发和铅笔不说年轻|short|or said like *for*|or 读作 *for*
      beautiful|a flower;long hair;a pink and orange evening sky|beautiful means very nice to look at; busy means with a lot to do|beautiful 是好看；busy 是忙|busy=busy means with a lot to do, but a flower, hair and a sky have nothing to do=busy 是事情多，可花、头发和天空都没有事要做;friendly=friendly means happy to talk to people, but a flower, hair or a sky cannot talk=friendly 是乐意和人交谈，可花、头发和天空不会说话|beau · ti · ful|eau after the b, and one l at the end|b 后面是 eau，结尾只有一个 l
      kind|a teacher who always helps;helping me;how to treat animals|kind means good to other people; funny means making people laugh|kind 是善良；funny 是好笑|funny=funny means making people laugh, but here the point is helping and being good to others=funny 是让人发笑，可这里说的是帮助别人、善待别人;busy=busy means with a lot to do, not being good to others=busy 是事情多，不是善待别人|kind|i said like *eye*|i 读作 *eye*
      funny|great jokes;ha ha;a clown's red nose|funny means making people laugh; kind means good to others|funny 是好笑；kind 是善良|kind=kind means good to others, but jokes, *ha ha* and a clown's nose make people laugh=kind 是善良，可笑话、哈哈和小丑的鼻子都是让人发笑的;friendly=friendly means happy to talk to people, and a story or a nose cannot be friendly=friendly 是乐意和人交谈，故事和鼻子不能说友好|fun · ny|a double n, and y at the end|双写 n，结尾是 y
      friendly|saying hello to everyone;a dog that doesn't bite;people who always say hello|friendly means happy to talk to people; funny means making people laugh|friendly 是友好；funny 是好笑|busy=busy means with a lot to do, not happy to say hello or gentle like a dog that doesn't bite=busy 是事情多，不是乐意打招呼，也不是像不咬人的狗那样温和;funny=funny means making people laugh, but saying hello and not biting are not jokes=funny 是让人发笑，可打招呼和不咬人都不是笑话|friend · ly|*friend* + *-ly*, with ie in the middle|*friend* 加 *-ly*，中间是 ie
      busy|a day at work so Dad cooks;no time to talk now;doctors with no free time|busy means with a lot to do; free means not busy|busy 是忙；free 是有空|free=free means not busy, but here there is no time to cook, talk or rest=free 是有空，可这里没时间做饭、聊天或休息;funny=funny means making people laugh, not having a lot to do=funny 是好笑，不是事情多|bus · y|u said like the i in *is*, so it sounds like *bizzy*|u 读作 *is* 里的 i，听起来像 *bizzy*
      nice|a good day;a pretty dress;meeting someone|nice means good or pleasant; kind means good to other people|nice 是好的、令人愉快的；kind 是对人善良|kind=kind describes how a person treats others, not a day, a dress or meeting you=kind 形容一个人怎样对待别人，不形容一天、一件衣服或见面;friendly=friendly describes people or animals, not a day, a dress or meeting you=friendly 形容人或动物，不形容一天、一件衣服或见面|nice|c said like s, and a silent e|c 读作 s，词尾 e 不发音
      smile|looking at the camera;a lovely face;a baby's happy face|you smile with your mouth and no sound; you cry with tears|smile 是不出声地笑；cry 是流泪|cry/cried=cry means to have tears, not a happy face for a camera or a lovely look=cry 是流泪，不是对着镜头的笑脸，也不是可爱的表情;sing/sang=sing means to make music with your voice, not a happy face=sing 是用嗓子唱歌，不是笑脸|smile|a silent e that makes the i say its name|词尾 e 不发音，让 i 读字母本音
      also|a dad who is a doctor too;liking dogs as well;riding a bike as well|also adds one more fact; both is for two together|also 是再加一件事；both 是两个都|both=both goes before two things together, as in *both cats*, not before one more job, a dog or a bike=both 放在两样东西前面，比如 *both cats*，不放在又一个职业、狗或自行车前面;only=only means just this and nothing more, but each sentence adds one more thing=only 是只有，可每句都在添加一件事|al · so|one l, and -so at the end|只有一个 l，结尾是 -so
      both|my two parents;my two sisters;my two cats|both is for two; all is for three or more|both 用于两个；all 用于三个或更多|also=also adds a fact, and it cannot go before *of my parents* or *my sisters*, or after *like*=also 是补充事实，不能放在 *of my parents*、*my sisters* 前面，也不能放在 *like* 后面;all=all is for three or more, but here there are only two=all 用于三个或更多，可这里只有两个|both|o said like *go*, and th at the end|o 读作 *go* 里的音，结尾是 th
    `,
  },
});

const workActions = vocabularyTopic({
  id: "a1-words-work-actions",
  title: t("Work Actions", "工作中的动作"),
  summary: t(
    "Build, drive, fix, grow, carry, wait, call, meet, keep and show.",
    "建造、驾驶、修理、种植、搬运、等待、打电话、见面、保存和展示。",
  ),
  intro: t(
    "My uncle **drives** a truck, **builds** houses and **fixes** our bikes. On Sunday he **shows** me how to **grow** tomatoes. These words help you talk about what people do at work.",
    "我叔叔 **drives**（开）卡车、**builds**（盖）房子，还 **fixes**（修）我们的自行车。星期天他 **shows**（教给我看）怎么 **grow**（种）西红柿。这些词帮你谈论人们工作时做的事。",
  ),
  prerequisites: ["a1-words-actions"],
  words: [
    word(
      "build builds built building",
      "to make something by putting parts together",
      "建造",
      "The workers {build} new houses. | Birds {build} nests in spring. | They {built} a new bridge last year.|fixed grew",
      "fix grow",
    ),
    word(
      "drive drives drove driven driving",
      "to make a car, a bus or a train go",
      "驾驶；开车",
      "My mom {drives} a bus.|carries keeps | Can you {drive} a car on the road? | Dad {drove} us to school this morning.|carried kept",
      "carry keep",
    ),
    word(
      "fix fixes fixed fixing",
      "to make something that is broken work again",
      "修理",
      "My bike is broken. My dad can {fix} it. | The phone is broken. Can you {fix} it? | The door was broken, so she {fixed} it yesterday.|built showed",
      "build show",
    ),
    word(
      "grow grows grew grown growing",
      "to get bigger; to make plants come up from the ground",
      "生长；种植",
      "Farmers {grow} rice and vegetables. | Children {grow} very fast. | These apples {grew} in our garden.|built kept",
      "build keep",
    ),
    word(
      "carry carries carried carrying",
      "to hold something and take it with you",
      "搬；提；携带",
      "Can you help me {carry} this heavy box up the stairs? | The nurse {carries} the baby in her arms to the bed.|keeps shows | I {carried} my heavy bag on my back all day.|kept showed",
      "keep show",
    ),
    word(
      "wait waits waited waiting",
      "to stay in a place until someone comes or something happens",
      "等待",
      "Please {wait} here. I'll be back soon. | We {waited} for the bus for half an hour.|met called | The doctor is busy. Can you {wait} a minute?",
      "meet call",
    ),
    word(
      "call calls called calling",
      "to talk to someone on the phone; to say a name loudly",
      "打电话；叫",
      "{Call} me on the phone when you get home. | Mom {called} the doctor on the phone this morning.|met waited | The teacher {calls} our names every morning.|meets waits",
      "meet wait",
    ),
    word(
      "meet meets met meeting",
      "to see and talk to someone, for the first time or at a place you agree",
      "遇见；见面",
      "Let's {meet} at the park at three and play together. | Nice to {meet} you! | I {met} my best friend at school.|called waited",
      "call wait",
    ),
    word(
      "keep keeps kept keeping",
      "to have something and not give it away; to stay in a place or a way",
      "保存；保持",
      "You can {keep} this book. It's a present. | We {keep} our shoes by the door. | She {kept} the money in a box.|carried showed",
      "carry show",
    ),
    word(
      "show shows showed shown showing",
      "to let someone see something",
      "给……看；展示",
      "{Show} me your new bike! | The farmer {showed} us his cows.|kept carried | Can you {show} me the way to the station?",
      "keep carry",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Build* makes something new, but *fix* makes something broken work again, so look for the word *broken*. *Carry* means you take it with you, while *keep* means you do not give it away.",
        "*build* 是造出新东西，*fix* 是把坏了的东西修好，所以留意 *broken* 这个词。*carry* 是拿着带走，*keep* 是留着不给别人。",
      ),
      meaning: t(
        "You *meet* someone face to face, but you *call* them on the phone; you *wait* when you stay until someone comes. You *show* something so another person can see it.",
        "*meet* 是当面见，*call* 是打电话；*wait* 是待着等人来。*show* 是拿给别人看。",
      ),
      spell: t(
        "These past forms change: *build* becomes *built*, *drive* becomes *drove*, *grow* becomes *grew*, *meet* becomes *met* and *keep* becomes *kept*; *carry* becomes *carried*.",
        "这些过去式会变：*build* 变 *built*，*drive* 变 *drove*，*grow* 变 *grew*，*meet* 变 *met*，*keep* 变 *kept*；*carry* 变 *carried*。",
      ),
    },
    notes: `
      build|new houses;nests in spring;a new bridge|you build something new; you fix something broken|build 是建新东西；fix 是修坏东西|fix/fixed=fix means to make something broken work again, but here the houses, nests and bridge are new=fix 是把坏的修好，可这里的房子、鸟窝和桥都是新的;grow/grew=grow is for plants and people getting bigger, not for putting parts together=grow 用于植物或人长大，不是把零件拼起来|build|ui said like the i in *is*, and the past *built*|ui 读作 *is* 里的 i，过去式是 *built*
      drive|a bus;a car on the road;taking us to school by car|you drive a car or a bus; you carry something in your hands|drive 是开车；carry 是用手拿着|carry/carries/carried=carry means to hold something in your hands or arms, not to make a bus or a car go=carry 是用手或胳膊拿着，不是开公交车或汽车;keep/keeps/kept=keep means to have something and not give it away, not to make a car go=keep 是保存、留着，不是开车|drive|a silent e, and the past *drove*|词尾 e 不发音，过去式是 *drove*
      fix|a broken bike;a broken phone;a broken door|you fix something broken; you build something new|fix 是修好坏东西；build 是建新东西|build/built=build means to make something new, but the bike, phone and door are already there and broken=build 是造新东西，可自行车、手机和门本来就有，只是坏了;show/showed=show means to let someone see something, not to make it work again=show 是给人看，不是修好|fix|x at the end, and -es in *fixes*|结尾是 x，第三人称是 *fixes*
      grow|rice and vegetables;children getting bigger;apples in the garden|things grow bigger; people build things with parts|grow 是长大、种植；build 是用零件建造|build/built=build means to put parts together, not plants coming up or children getting bigger=build 是把零件拼起来，不是植物长出来或孩子长大;keep/kept=keep means to have something and not give it away, not to get bigger=keep 是留着，不是长大|grow|ow said like *go*, and the past *grew*|ow 读作 *go* 里的音，过去式是 *grew*
      carry|a heavy box up the stairs;a baby in her arms;a heavy bag on my back|you carry something with you; you keep something and do not give it away|carry 是拿着带走；keep 是留着不给|keep/keeps/kept=keep means to have something and not give it away, not to hold it while you move=keep 是留着不给，不是拿着走;show/shows/showed=show means to let someone see something, not to take it up the stairs or on your back=show 是给人看，不是搬上楼或背在背上|car · ry|a double r, and y changing to i in *carried*|双写 r，*carried* 里 y 变成 i
      wait|staying here until I'm back;half an hour for the bus;a minute for the doctor|you wait until someone comes; you meet someone when you see them|wait 是等；meet 是见面|meet/met=meet means to see someone, not to stay until someone comes or a bus arrives=meet 是见面，不是待着等人或等车;call=call means to phone someone, not to stay in a place until they come=call 是打电话，不是待着等人|wait|ai said like the a in *name*|ai 读作 *name* 里的 a
      call|phoning me from home;phoning the doctor;saying our names|you call someone on the phone; you meet someone face to face|call 是打电话；meet 是当面见|meet/met/meets=meet means to see someone face to face, not to talk on the phone or say names out loud=meet 是当面见，不是打电话或点名;wait/waited/waits=wait means to stay until something happens, and it does not have *me* or the doctor right after it=wait 是等，后面不直接跟 *me* 或医生|call|a double l, and a said like *all*|双写 l，a 读作 *all* 里的音
      meet|the park at three;someone new;my best friend at school|you meet someone face to face; you call them on the phone|meet 是当面见；call 是打电话|call/called=call means to phone someone, but here people come together in the same place=call 是打电话，可这里人们是到同一个地方见面;wait/waited=wait means to stay until someone comes, and there is no *nice to wait you*=wait 是等人来，没有 *nice to wait you* 的说法|meet|a double e, the same sound as *meat*|双写 e，和 *meat* 同音
      keep|a book as a present;shoes by the door;money in a box|you keep something and do not give it away; you carry it with you|keep 是留着；carry 是带着|carry/carried=carry means to hold something while you move, not to have it stay in one place=carry 是拿着走，不是放在一个地方留着;show/showed=show means to let someone see something, not to have it and not give it away=show 是给人看，不是留着不给|keep|a double e, and the past *kept*|双写 e，过去式是 *kept*
      show|my new bike;the farmer's cows;the way to the station|you show something so someone can see it; you keep it for yourself|show 是给人看；keep 是自己留着|keep/kept=keep means to have something for yourself, not to let someone see it=keep 是自己留着，不是给人看;carry/carried=carry means to hold something while you move, not to let someone see it=carry 是拿着走，不是给人看|show|ow said like *go*, and the past *showed*|ow 读作 *go* 里的音，过去式是 *showed*
    `,
  },
});

// Was and were.

/** pastSubjects are who was somewhere, with was or were and a present form of be to set beside them. */
const pastSubjects: readonly { who: string; be: "was" | "were"; now: string }[] = [
  { who: "I", be: "was", now: "am" },
  { who: "You", be: "were", now: "are" },
  { who: "He", be: "was", now: "is" },
  { who: "She", be: "was", now: "is" },
  { who: "We", be: "were", now: "are" },
  { who: "They", be: "were", now: "are" },
  { who: "My dad", be: "was", now: "is" },
  { who: "The nurses", be: "were", now: "are" },
  { who: "Our teacher", be: "was", now: "is" },
  { who: "The farmers", be: "were", now: "are" },
  { who: "My sister", be: "was", now: "is" },
  { who: "Tom and Ben", be: "were", now: "are" },
  { who: "Mr. Lee", be: "was", now: "is" },
];

/** pastPlaces are where or how they were, each with a word for the past. */
const pastPlaces: readonly string[] = [
  "at the hospital yesterday",
  "very busy last week",
  "at the farm last Sunday",
  "tired last night",
  "at home two days ago",
  "in the office yesterday",
  "happy at the party yesterday",
  "late for school last Monday",
  "at the station at six o'clock last night",
  "ill last week",
  "in the garden an hour ago",
];

const pastPairs = everyPair(pastSubjects, pastPlaces).map(([s, place]) => ({ ...s, place }));

/** pastFrom are the pairs starting at the given place, so each bank opens on different sentences. */
const pastFrom = (skip: number) => [...pastPairs.slice(skip), ...pastPairs.slice(0, skip)];

const pastChoiceBank: readonly ChoiceItem[] = pastPairs.map(
  ({ who, be, now, place }): ChoiceItem => [`${who} ___ ${place}.`, be, [be === "was" ? "were" : "was", now]],
);

const pastFixBank: readonly TypedItem[] = pastFrom(40).map(({ who, be, now, place }, k): TypedItem => {
  const shown = `${who} ${k % 2 === 0 ? (be === "was" ? "were" : "was") : now} ${place}.`;
  return { shown, accepted: [`${who} ${be} ${place}.`], wrong: [shown] };
});

const lower = (who: string): string => (who === "I" || who.startsWith("Mr.") || who.includes(" and ") ? who : who.toLowerCase());

const pastAskBank: readonly TypedItem[] = pastFrom(76)
  .filter(({ who }) => who !== "I")
  .map(({ who, be, place }): TypedItem => {
    const asker = be === "was" ? "Was" : "Were";
    const other = be === "was" ? "Were" : "Was";
    return {
      shown: `${who} ${be} ${place}.`,
      accepted: [`${asker} ${lower(who)} ${place}?`],
      wrong: [`${other} ${lower(who)} ${place}?`, `${who} ${be} ${place}?`],
    };
  });

/** wasReason says why a subject takes was or were, in every locale. */
const wasReason = (who: string, be: string): Text =>
  be === "was"
    ? t(`*${who}* is *I* or one person or thing, so the past of *be* is *was*`, `*${who}* 是 *I* 或单数主语，所以 be 的过去式用 *was*`)
    : t(`*${who}* is *you* or more than one, so the past of *be* is *were*`, `*${who}* 是 *you* 或复数主语，所以 be 的过去式用 *were*`);

const wasAndWere: TopicDef = {
  id: "was-and-were",
  title: t("Was and Were", "was 和 were"),
  summary: t(
    "I was at home. They were busy. The verb be in the past, and questions with it.",
    "I was at home. They were busy. be 动词的过去式，以及用它提问。",
  ),
  intro: t(
    "Today *she is* at the office; yesterday *she was* at home. Today *they are* free; yesterday *they were* busy. *Was* and *were* are the past forms of *be*.",
    "今天是 *she is* at the office，昨天变成 *she was* at home；今天是 *they are* free，昨天变成 *they were* busy。*was* 和 *were* 就是 *be* 的过去式。",
  ),
  prerequisites: ["the-verb-be", "a1-words-jobs"],
  encompasses: [
    { topic: "the-verb-be", weight: 0.3 },
    { topic: "a1-words-jobs", weight: 0.2 },
  ],
  xp: 15,
  strand: "grammar",
  knowledgePoints: [
    point(
      "choose",
      t("Was or were", "was 还是 were"),
      t(
        "For the past, *am* and *is* become *was*, and *are* becomes *were*:\n\n- *I was*, *he was*, *she was*, *it was*, *my dad was*\n- *you were*, *we were*, *they were*, *the nurses were*\n\nWords like *yesterday*, *last week* and *an hour ago* tell you it's the past.\n\n> **Watch out.** *You* always takes *were*—even when you are talking to one person (*You were late*, never *You was late*).",
        "谈过去时，*am* 和 *is* 变成 *was*，*are* 变成 *were*：\n\n- *I was*、*he was*、*she was*、*it was*、*my dad was*\n- *you were*、*we were*、*they were*、*the nurses were*\n\n看到 *yesterday*、*last week*、*an hour ago* 这样的词，就知道要用过去式。\n\n> **注意。** 中文说“昨天在医院”动词不变，英语不能留着 *is/are*；另外 *you* 即使指一个人也始终配 *were*（*You were late*，不能说 *You was late*）。",
      ),
      choiceGenerator(
        t("Fill in the blank.", "填空。"),
        pastChoiceBank,
        (right, shown) => {
          const who = shown.split(" ___")[0] ?? "";
          const reason = wasReason(who, right);
          return t(
            `${reason.en}: ${shown.replace("___", `*${right}*`)}\n\n**Check.** Match two clues: the past time phrase at the end rules out *am/is/are*, and the subject *${who}* pairs with *${right}*.`,
            `${reason["zh-CN"]}：${shown.replace("___", `*${right}*`)}\n\n**检验。** 核对两条线索：句末的过去时间词排除了 *am/is/are*，主语 *${who}* 搭配的是 *${right}*。`,
          );
        },
        (wrong, _right, shown, position) =>
          position === 0
            ? t(
                `*${wrong}* is the past of *be* for ${wrong === "was" ? "*I* and one person or thing" : "*you* and more than one"}, but the subject is *${shown.split(" ___")[0]}*.`,
                `*${wrong}* 是${wrong === "was" ? " *I* 和单数主语" : " *you* 和复数主语"}用的过去式，可这里的主语是 *${shown.split(" ___")[0]}*。`,
              )
            : t(
                `*${wrong}* is the present, but the time words at the end of the sentence put it in the past.`,
                `*${wrong}* 是现在时，可句末的时间词说明这是过去的事。`,
              ),
      ),
    ),
    point(
      "fix",
      t("Fixing was and were", "改正 was 和 were"),
      t(
        "Each sentence has the wrong form of *be*: *were* for *was*, *was* for *were*, or a present form (*am, is, are*) where the time is past. For example: *The farmers was busy last week.* → *The farmers were busy last week.*\n\n> **Watch out.** Check both tense and subject—a plural noun like *Tom and Ben* needs *were*, even though *Ben* is right next to the verb.",
        "每个句子里 *be* 的形式都错了：该用 *was* 的用了 *were*，该用 *were* 的用了 *was*，或者时间是过去却用了 *am/is/are*。例如：*The farmers was busy last week.* → *The farmers were busy last week.*\n\n> **注意。** 时态和主语单复数都要查——像 *Tom and Ben* 这样的复数主语要用 *were*，不要只看紧挨着动词的 *Ben*。",
      ),
      typedGenerator("sentence", t("Fix the sentence.", "改正这个句子。"), pastFixBank, (right) => {
        const [who = "", be = ""] = right.split(/ (was|were) /u);
        const reason = wasReason(who, be);
        return t(
          `The time is past, and ${reason.en}: ${right}\n\n**Check.** Verify that the verb is now past tense (*${be}*), agrees with *${who}*, and leaves the rest of the sentence intact.`,
          `时间是过去，${reason["zh-CN"]}：${right}\n\n**检验。** 确认动词已改成过去式 *${be}*、与主语 *${who}* 一致，且句子其余部分保持不变。`,
        );
      }),
    ),
    point(
      "ask",
      t("Questions with was and were", "用 was 和 were 提问"),
      t(
        "To ask a question, put *was* or *were* before the subject, as with *is* and *are*: *He was at home.* → *Was he at home?* *They were busy.* → *Were they busy?*\n\n> **Watch out.** Do not add *did* in front of *was* or *were*—simply move *was* or *were* to the front and end with a question mark.",
        "提问时，把 *was* 或 *were* 放到主语前面，和 *is*、*are* 一样：*He was at home.* → *Was he at home?* *They were busy.* → *Were they busy?*\n\n> **注意。** 不要在 *was* 或 *were* 前面加 *did*——直接把 *was* 或 *were* 移到句首，句末加上问号即可。",
      ),
      typedGenerator("sentence", t("Make a question.", "把句子改成疑问句。"), pastAskBank, (right) => {
        const be = right.split(" ")[0] ?? "";
        return t(
          `As with *is* and *are*, a question puts *${be}* before the subject and ends with a question mark: ${right}\n\n**Check.** Read the first two parts: *${be}* comes first, the subject follows immediately, and the sentence ends with a question mark.`,
          `和 *is*、*are* 一样，疑问句把 *${be}* 放到主语前面，句末用问号：${right}\n\n**检验。** 检查句首和句尾：*${be}* 在最前面，紧接着主语，句末是问号。`,
        );
      }),
    ),
  ],
};

// Writing about a person.

const criterion = (id: string): CriterionSpec => {
  const found = criterionById(id);
  if (!found) throw new Error(`unknown criterion ${id}`);
  return found;
};

/** personBank asks for a description of a person: who they are, what they look like and what they do. */
const personBank: readonly WritingItem[] = [
  {
    task: "Write about someone in your family.",
    model:
      "This is my grandpa. He is seventy, and he is tall and thin. He has short white hair and a big smile. He lives on a farm and grows apples. He is very kind.",
  },
  {
    task: "Write about your best friend.",
    model:
      "My best friend is Lucy. She is ten years old. She is short and has long black hair. She likes drawing, and she draws cats every day. She is very funny.",
  },
  {
    task: "Write about your teacher.",
    model:
      "Ms. Wang is my English teacher. She is young and tall, and she has glasses. She teaches us songs and games. She always smiles. Everyone likes her.",
  },
  {
    task: "Write about a doctor or a nurse you know.",
    model:
      "My aunt is a nurse. She is thirty-five. She has short brown hair and kind eyes. She works at a big hospital and looks after children. She is always busy.",
  },
  {
    task: "Write about someone who works in your town.",
    model:
      "Mr. Li is our bus driver. He is old, and he has a gray beard. He drives the number 5 bus every morning. He says hello to everyone. He is very friendly.",
  },
  {
    task: "Write about your mom or your dad.",
    model:
      "My dad is forty. He is tall and has short black hair. He works in an office in the city. In the evening, he cooks dinner for us. He tells funny jokes.",
  },
  {
    task: "Write about a brother, a sister or a cousin.",
    model:
      "This is my cousin Ben. He is six. He is short, and he has big brown eyes. He goes to school near his house. He loves dinosaurs and reads about them every night.",
  },
  {
    task: "Write about a neighbor.",
    model:
      "My neighbor is Mrs. Green. She is old and short, and she has white hair. She has a small garden with lots of flowers. She gives us cakes every Sunday. She is kind.",
  },
  {
    task: "Write about a famous person you like.",
    model:
      "Yao Ming is a famous basketball player. He is very, very tall. He has short black hair and a nice smile. He doesn't play now, but he helps young players. I like him a lot.",
  },
  {
    task: "Write about a farmer, a worker or a police officer you know.",
    model:
      "My uncle is a police officer. He is thirty and tall. He has a blue uniform and a black hat. He keeps our town safe and helps children cross the road. He is brave.",
  },
  {
    task: "Write about a classmate.",
    model:
      "Mia sits next to me in class. She is nine. She has short red hair and freckles. She is good at math, and she helps me with my homework. She is very friendly.",
  },
  {
    task: "Write about a grandma or a grandpa.",
    model:
      "My grandma is sixty-eight. She is short and has gray hair and glasses. She lives with us. Every morning she walks in the park, and in the afternoon she reads. She is kind and funny.",
  },
];

const personCriteria = ["a1-person-who", "a1-person-looks", "a1-person-does", "a1-person-verb-s", "a1-sentences"];

const writingAboutAPerson: TopicDef = {
  id: "writing-about-a-person",
  title: t("Writing About a Person", "写一个人"),
  summary: t(
    "Write four to six sentences about a person: who they are, what they look like and what they do.",
    "写四到六句话介绍一个人：这个人是谁、长什么样、做什么。",
  ),
  intro: t(
    "A short portrait introduces a person in a few clear lines: *My coach is Mr. Chen. He is tall and has short black hair. He teaches us basketball every Saturday and always smiles.* Name, appearance and actions give the reader a full picture.",
    "简短的人物介绍几句话就能立住形象：*My coach is Mr. Chen. He is tall and has short black hair. He teaches us basketball every Saturday and always smiles.* 身份、外貌、日常动作合在一起，人物就立体了。",
  ),
  prerequisites: ["third-person-s", "have-and-has", "a1-words-describing-people", "writing-a-short-note"],
  encompasses: [
    { topic: "third-person-s", weight: 0.3 },
    { topic: "a1-words-describing-people", weight: 0.2 },
    { topic: "writing-a-short-note", weight: 0.2 },
  ],
  xp: 25,
  strand: "writing",
  criteria: personCriteria.map(criterion),
  knowledgePoints: [
    point(
      "person",
      t("Who, looks and does", "是谁、长相、做什么"),
      t(
        "Say three things about the person:\n\n- who they are: *This is my grandpa. He is seventy.*\n- what they look like: *He is tall. He has short white hair.*\n- what they do: *He lives on a farm and grows apples.*\n\nThe person is *he* or *she*, so the verbs end in *-s*: *he lives*, *she works*, *he has*.\n\n> **Watch out.** Do not drop the *-s* on third-person verbs (*she work* → *she works*) or mix up *is* and *has* (*He has tall* is wrong; say *He is tall* and *He has brown eyes*).",
        "写一个人要说三件事：\n\n- 是谁：*This is my grandpa. He is seventy.*\n- 长什么样：*He is tall. He has short white hair.*\n- 做什么：*He lives on a farm and grows apples.*\n\n写的是 *he* 或 *she*，所以动词要加 *-s*：*he lives*、*she works*、*he has*。\n\n> **注意。** 第三人称单数动词别漏掉 *-s*（*she work* → *she works*），也别混淆 *is* 和 *has*（*He has tall* 是错的，要说 *He is tall* 和 *He has brown eyes*）。",
      ),
      writingGenerator(
        t(
          "Write four to six sentences in English about the person: who they are, what they look like and what they do.",
          "用英语写四到六句话介绍这个人：是谁、长什么样、做什么。",
        ),
        personBank,
        personCriteria,
        { minWords: 25, maxChars: 600 },
        (model) =>
          t(
            `One good description:\n\n> ${model}\n\n**Check.** Verify that your paragraph has four to six sentences covering who the person is, what they look like, and what they do, with *-s* or *has* on every *he/she* verb.`,
            `一段好的描述：\n\n> ${model}\n\n**检验。** 核对你的段落：有没有四到六句话，是否写清了人物是谁、长什么样、做什么，以及每个 *he/she* 后的动词是否都用了 *-s* 或 *has*。`,
          ),
      ),
    ),
  ],
};

/** topics are the topics of the unit Jobs and People. */
export const topics: readonly TopicDef[] = [jobs.topic, describingPeople.topic, workActions.topic, wasAndWere, writingAboutAPerson];

/** beForms are be and its past forms, which the past of be teaches. */
const beForms: WordBatch = { topic: "was-and-were", words: ["be", "was", "were", "wasn't", "weren't"] };

/** vocabulary are the words the unit Jobs and People teaches. */
export const vocabulary: readonly WordBatch[] = [jobs.batch, describingPeople.batch, workActions.batch, beForms];
