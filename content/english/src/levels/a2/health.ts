// A2, unit 2: Health and the Body. Feeling ill, more of the body, staying well and the doctor; should, must and have
// to; advice written by rules.

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { everyPair, interleave, pairUp, vocabularyTopic, word } from "../words.ts";

const health = vocabularyTopic({
  id: "a2-words-health",
  title: t("Feeling Ill", "生病"),
  summary: t(
    "Health, being ill, pains and aches, coughs and fevers, medicine and the dentist.",
    "健康、生病、疼痛、咳嗽和发烧、药和牙医。",
  ),
  intro: t(
    "When Ana had a **fever** and a bad **cough**, the doctor gave her some **medicine** and told her to rest. These words help you say what is wrong with your body and how to stay **healthy**.",
    "安娜 **fever**（发烧），还 **cough**（咳嗽）得厉害，医生给她开了些 **medicine**（药），让她好好休息。这些词帮你说出身体哪里不舒服，以及怎样保持 **healthy**（健康）。",
  ),
  prerequisites: ["pre-a1-words-body"],
  words: [
    word(
      "health",
      "how well your body and mind are",
      "健康",
      "Smoking is bad for your {health}. | Fruit and vegetables are good for your {health}. | My grandpa is in good {health} for his age.",
      "pain fever",
    ),
    word(
      "healthy healthier healthiest",
      "well and strong, not ill; good for your body",
      "健康的",
      "Eat {healthy} food like fruit and vegetables. | My dog is old, but he is very {healthy} and still runs every day. | Swimming keeps you {healthy}.",
      "ill hurt",
    ),
    word(
      "ill",
      "not well; having something wrong with your body",
      "生病的",
      "Tom isn't at school today. He's {ill} with a cold. | I felt {ill} because I had a fever, so I went to bed. | She was {ill} for a week with a bad cough.",
      "healthy hurt",
    ),
    word(
      "pain pains",
      "the feeling you have when part of your body hurts",
      "疼痛",
      "I have a {pain} in my leg. | The pills stopped the {pain} in my back. | He cried out in {pain} when he fell.",
      "health medicine",
    ),
    word(
      "headache headaches",
      "a pain in your head",
      "头痛",
      "I have a {headache} because the music is too loud. | Too much screen time gives me a {headache}. | My {headache} went away, and my head felt better after I slept.",
      "toothache stomach",
    ),
    word(
      "toothache toothaches",
      "a pain in a tooth",
      "牙痛",
      "I have a {toothache}, so I'm going to the dentist. | Too many sweets can give you a {toothache} and holes in your teeth. | My {toothache} stopped after the dentist fixed my tooth.",
      "headache fever",
    ),
    word(
      "stomach stomachs",
      "the part inside your body where food goes after you eat it",
      "胃；肚子",
      "I ate too much, and now my {stomach} hurts. | Don't swim on a full {stomach}. | My {stomach} is making noises. I'm hungry!",
      "headache medicine",
    ),
    word(
      "cough coughs coughed coughing",
      "to push air out of your throat with a sudden noise; the noise or the illness",
      "咳嗽",
      "Cover your mouth when you {cough}, so you don't give others your cold. | She {coughed} all night with a cold and couldn't sleep.|hurt shouted | Smoke gets into my throat and makes me {cough}.",
      "hurt shout",
    ),
    word(
      "fever fevers",
      "a body temperature that is higher than normal",
      "发烧",
      "Her head is very hot. She has a {fever}. | When I had a {fever}, I felt hot and then cold. | Take this medicine if you have a high {fever}.",
      "cough toothache",
    ),
    word(
      "medicine medicines",
      "something you take to get better when you are ill",
      "药",
      "Take this {medicine} three times a day. | The {medicine} tastes bad, but it works. | Keep {medicine} bottles away from small children.",
      "dentist pain",
    ),
    word(
      "dentist dentists",
      "a doctor for your teeth",
      "牙医",
      "I go to the {dentist} twice a year. | The {dentist} looked at my teeth. | My uncle is a {dentist}, so he always tells me to brush my teeth.",
      "medicine fever",
    ),
    word(
      "hurt hurts hurting",
      "to give pain; to feel pain",
      "疼；伤害",
      "My leg {hurts}. I can't walk.|coughs shouts | Ouch! That {hurt}!|coughed shouted | I fell off my bike and {hurt} my arm.|coughed shouted",
      "cough shout",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Headache* and *toothache* are both pains: a *headache* is in your head, often from loud music or screens, and a *toothache* is in a tooth, the kind that sends you to the dentist. Look for the head or the teeth in the sentence.",
        "*headache* 和 *toothache* 都是疼痛：*headache* 在头上，常因音乐太吵或看屏幕太久；*toothache* 在牙上，是要去看牙医的那种疼。在句子里找头或牙齿的线索。",
      ),
      meaning: t(
        "*Health* is a noun and *healthy* is an adjective: *health* is how well your body is, as in *good for your health*, and *healthy* describes food, people or animals, as in *healthy food*.",
        "*health* 是名词，*healthy* 是形容词：*health* 指身体好不好，如 *good for your health*；*healthy* 形容食物、人或动物，如 *healthy food*。",
      ),
      spell: t(
        "*Headache*, *toothache* and *stomach* all have ch said like k: head · ache, tooth · ache, stom · ach.",
        "*headache*、*toothache* 和 *stomach* 里的 ch 都读作 k：head · ache、tooth · ache、stom · ach。",
      ),
    },
    notes: `
      health|smoking;fruit and vegetables;a grandpa doing well for his age|health is how well your body is; pain is the feeling when it hurts|health 是身体好不好；pain 是身体疼的感觉|pain=pain is the feeling when part of your body hurts, not how well your body is=pain 是身体某处疼的感觉，不是身体好不好;fever=fever is a body temperature higher than normal, an illness, not how well your body is=fever 是体温高于正常，是一种病，不是身体好不好|good for your health · in good health|ea said like short e, and -th at the end|ea 读短元音 e，结尾是 -th
      healthy|food like fruit and vegetables;an old dog that still runs every day;swimming|healthy means well and strong; ill means not well|healthy 是健康强壮；ill 是生病|ill=ill means not well, the opposite of well and strong=ill 是生病，和健康强壮正相反;hurt=hurt means having pain from a fall or a cut, not well and strong=hurt 是因摔倒或割伤而疼，不是健康强壮|healthy food · keep healthy|health + -y|health 加 -y
      ill|Tom away from school with a cold;a fever and going to bed;a week with a bad cough|ill means sick with something like a cold; hurt means in pain from a fall or a cut|ill 是得了感冒之类的病；hurt 是因摔倒或割伤而疼|healthy=healthy means well and strong, the opposite of ill=healthy 是健康强壮，和 ill 意思相反;hurt=hurt means having pain from a fall or a cut, not being sick with a cold, a fever or a cough=hurt 是因摔倒或割伤而疼，不是得了感冒、发烧或咳嗽|feel ill · be ill with a cold|the double l|双写 l
      pain|something in a leg;pills and a back;crying out after a fall|pain is the feeling when something hurts; medicine is what you take to stop it|pain 是疼痛的感觉；medicine 是用来止痛治病的药|health=health is how well your body is, not a feeling that something hurts=health 是身体好不好，不是疼的感觉;medicine=medicine is something you take to get better, not the feeling that something hurts=medicine 是治病的药，不是疼的感觉|a pain in my leg · in pain|ai for the long a sound|ai 发长 a 音
      headache|loud music;too much screen time;a head feeling better after sleep|a headache is a pain in your head; a toothache is a pain in a tooth|headache 是头疼；toothache 是牙疼|toothache=toothache is a pain in a tooth, not in your head=toothache 是牙疼，不是头疼;stomach=stomach is the part of your body where food goes, not a pain in your head=stomach 是食物进入的胃，不是头疼|have a headache · give me a headache|head + ache, with ch said like k|head + ache，ch 读作 k
      toothache|going to the dentist;too many sweets and holes in teeth;a tooth the dentist fixed|a toothache is a pain in a tooth; a fever is a hot body|toothache 是牙疼；fever 是身体发烫|headache=headache is a pain in your head, not in a tooth the dentist looks at=headache 是头疼，不是牙医看的牙疼;fever=fever is a body temperature higher than normal, not a pain in a tooth=fever 是体温高于正常，不是牙疼|have a toothache|tooth + ache, with ch said like k|tooth + ache，ch 读作 k
      stomach|eating too much;swimming when full;noises from being hungry|your stomach is where food goes; a headache is a pain in your head|stomach 是胃；headache 是头疼|headache=headache is a pain in your head, not the place where food goes=headache 是头疼，不是食物进入的地方;medicine=medicine is something you take to get better, not a part of your body=medicine 是治病的药，不是身体的一部分|my stomach hurts · on a full stomach|ch said like k: stom · ach|ch 读作 k：stom · ach
      cough|giving others your cold;a night with a cold and no sleep;smoke in a throat|you cough when air comes out of your throat with a noise; you shout when you say words loudly|cough 是咳嗽；shout 是大声喊|hurt=hurt means having or giving pain, not pushing air out of your throat with a noise=hurt 是疼或弄疼，不是咳出声来;shout/shouted=shout means saying words very loudly, not pushing air out of your throat because you are ill=shout 是大声说话，不是因病咳出声来|cover your mouth when you cough · a bad cough|ough said like *off*|ough 读作 *off*
      fever|a very hot head;feeling hot and then cold;a high one that needs medicine|a fever is a hot body; a cough is a noise from your throat|fever 是发烧；cough 是咳嗽|cough=cough is a noise from your throat, not a hot head or a high temperature=cough 是喉咙发出的咳嗽声，不是头发烫或体温高;toothache=toothache is a pain in a tooth, not a hot body=toothache 是牙疼，不是身体发烫|have a fever · a high fever|-er at the end|结尾是 -er
      medicine|three times a day;a bad taste that works;bottles kept from small children|medicine is what you take to get better; a dentist is a doctor for teeth|medicine 是药；dentist 是牙医|dentist=dentist is a doctor for teeth, a person you cannot take or keep in a bottle=dentist 是牙医，是人，不能服用，也不能装进瓶子;pain=pain is the feeling when something hurts, not something you take or keep in a bottle=pain 是疼的感觉，不能服用，也不能装进瓶子|take medicine · medicine bottles|med · i · cine, with c said like s|med · i · cine，c 读作 s
      dentist|a visit twice a year;someone looking at teeth;an uncle who tells me to brush|a dentist is a doctor for your teeth; medicine is what you take|dentist 是牙医；medicine 是吃的药|medicine=medicine is something you take to get better, not a person who looks at teeth=medicine 是治病的药，不是看牙的人;fever=fever is a hot body, not a person=fever 是发烧，不是人|go to the dentist|dent + -ist|dent 加 -ist
      hurt|a leg too painful to walk on;an ouch;a fall off a bike|hurt means to give or feel pain; cough means to push air out of your throat with a noise|hurt 是疼或弄疼；cough 是咳嗽|cough=cough means pushing air out of your throat with a noise, not giving or feeling pain=cough 是咳嗽，不是疼或弄疼;shout/shouts/shouted=shout means saying words very loudly, not giving or feeling pain=shout 是大声说话，不是疼或弄疼|my leg hurts · hurt my arm|the past is *hurt* too, never *hurted*|过去式也是 *hurt*，没有 *hurted*
    `,
  },
});

const body2 = vocabularyTopic({
  id: "a2-words-body-2",
  title: t("More of the Body", "身体部位（二）"),
  summary: t(
    "The neck, shoulders, knees, fingers, toes and teeth, and the heart, skin, blood, bones and throat.",
    "脖子、肩膀、膝盖、手指、脚趾和牙齿，以及心脏、皮肤、血液、骨头和喉咙。",
  ),
  intro: t(
    "At the pool, Leo fell and cut his **knee**: a little **blood** ran down his leg, but the nurse said no **bone** was broken and the **skin** would soon get better. These words help you name more parts of your body, inside and out.",
    "在泳池边，利奥摔了一跤，划破了 **knee**（膝盖）：一点 **blood**（血）顺着腿流下来，但护士说没有 **bone**（骨头）断，**skin**（皮肤）很快就会长好。这些词帮你说出身体内外更多的部位。",
  ),
  prerequisites: ["a2-words-health"],
  words: [
    word(
      "neck necks",
      "the part of the body between the head and the shoulders",
      "脖子",
      "A giraffe has a long {neck}. | She wore a scarf around her {neck}. | I can't turn my head. My {neck} hurts.",
      "knee toe",
    ),
    word(
      "shoulder shoulders",
      "the part where your arm joins your body",
      "肩膀",
      "She carried her bag on her {shoulder}. | The baby is sleeping on Dad's {shoulder}. | Sit on my {shoulders} so you can see over the people.|toes knees",
      "toe knee",
    ),
    word(
      "knee knees",
      "the middle part of your leg, where it bends",
      "膝盖",
      "Sit down and bend your {knees}.|necks teeth | I fell off my bike and cut my {knee}, so it hurt to bend my leg. | The water was not deep: it only came up to my {knees}.|necks teeth",
      "neck tooth",
    ),
    word(
      "finger fingers",
      "one of the five long parts at the end of your hand",
      "手指",
      "I have five {fingers} on each hand.|toes knees | She wears her wedding ring on her {finger}. | Don't point your {finger} at people.",
      "toe knee",
    ),
    word(
      "toe toes",
      "one of the five small parts at the end of your foot",
      "脚趾",
      "I have ten {toes} on my feet.|fingers knees | Ouch! Someone stood on my {toe} with their big boots! | Stand on your {toes} to reach the top shelf.|fingers knees",
      "finger knee",
    ),
    word(
      "tooth teeth",
      "one of the hard white things in your mouth that you bite with",
      "牙齿",
      "Brush your {teeth} twice a day.|bones fingers | The baby has her first {tooth}. | I broke a {tooth} when I bit a hard sweet.",
      "bone finger",
    ),
    word(
      "heart hearts",
      "the part inside your chest that pushes blood around your body",
      "心脏",
      "Your {heart} beats faster when you run. | Running is good for your {heart}, because it makes it beat strongly. | My {heart} was beating fast before the test.",
      "bone skin",
    ),
    word(
      "skin",
      "the outside cover of your body",
      "皮肤",
      "Wear a hat to keep the sun off your {skin}. | Babies have soft {skin}. | Snakes change their {skin}.",
      "blood bone",
    ),
    word(
      "blood",
      "the red liquid that moves around your body",
      "血",
      "My knee is cut, and red {blood} is running down my leg. | The heart pushes {blood} around the body. | The nurse took some {blood} from my arm with a needle.",
      "skin bone",
    ),
    word(
      "bone bones",
      "one of the hard white parts inside your body",
      "骨头",
      "The dog is chewing a hard {bone}. | Drinking milk helps your {bones} grow hard and strong.|skin hearts | He fell and broke a {bone} in his arm.",
      "skin heart",
    ),
    word(
      "throat throats",
      "the inside of your neck, where food and air go down",
      "喉咙",
      "I have a sore {throat}, so I can't sing. | Drink warm water when your {throat} is dry and sore. | The cold drink hurt my {throat}.",
      "neck knee",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Neck* and *throat* are both between your head and your body: the *neck* is the outside, where a scarf goes, and the *throat* is the inside, where food, drink and your voice go. Ask whether the sentence is about the outside or the inside.",
        "*neck* 和 *throat* 都在头和身体之间：*neck* 是外面，围巾围在那里；*throat* 是里面，食物、饮料和声音从那里经过。想想句子说的是外面还是里面。",
      ),
      meaning: t(
        "*Finger* and *toe* are both small parts at the end of your body: you have five *fingers* on each hand and five *toes* on each foot.",
        "*finger* 和 *toe* 都是身体末端的小部分：每只手上有五根 *fingers*，每只脚上有五个 *toes*。",
      ),
      spell: t(
        "*Tooth* has an irregular plural, *teeth*, and *knee* has a silent k at the start: k-n-e-e.",
        "*tooth* 的复数不规则，是 *teeth*；*knee* 开头的 k 不发音：k-n-e-e。",
      ),
    },
    notes: `
      neck|a giraffe;a scarf;a head that can't turn|the neck is the outside part between your head and shoulders; the knee is the middle of your leg|neck 是头和肩之间外面的部分；knee 是腿中间的膝盖|knee=knee is the middle part of your leg, far from your head and shoulders=knee 是腿中间的部分，离头和肩很远;toe=toe is one of the small parts at the end of your foot, far from your head=toe 是脚上的脚趾，离头很远|a long neck · around her neck|ck at the end|结尾是 ck
      shoulder|a bag carried there;a baby sleeping on Dad;seeing over people|your shoulder is where your arm joins your body; your knee is in your leg|shoulder 是手臂和身体相连的地方；knee 在腿上|toe=toe is a small part at the end of your foot, too small to carry a bag or a baby=toe 是脚上的小脚趾，太小，扛不了包也抱不了孩子;knee=knee is the middle of your leg, not the top part where your arm joins your body=knee 是腿中间，不是手臂和身体相连的地方|on my shoulder · sit on my shoulders|ou said like long o, and -der at the end|ou 读长元音 o，结尾是 -der
      knee|sitting down and bending;a cut that hurt to bend the leg;water that was not deep|the knee is where your leg bends; the neck is between your head and shoulders|knee 是腿弯曲的地方；neck 在头和肩之间|neck=neck is the part between your head and shoulders, not the middle of your leg where it bends=neck 是头和肩之间的部分，不是腿弯曲的地方;tooth=tooth is a hard white thing in your mouth that you bite with, not a part of your leg=tooth 是嘴里用来咬东西的牙齿，不是腿的一部分|bend your knees · cut my knee|a silent k: k-n-e-e|k 不发音：k-n-e-e
      finger|five on each hand;a wedding ring;pointing at people|fingers are on your hands; toes are on your feet|finger 在手上；toe 在脚上|toe=toe is one of the small parts at the end of your foot, not your hand=toe 是脚上的脚趾，不在手上;knee=knee is the middle of your leg, not a long part at the end of your hand=knee 是腿中间的膝盖，不是手末端长长的部分|a ring on her finger · point your finger|-er at the end|结尾是 -er
      toe|ten on two feet;big boots standing on it;reaching a top shelf|toes are on your feet; fingers are on your hands|toe 在脚上；finger 在手上|finger=finger is one of the long parts at the end of your hand, not your foot=finger 是手上的手指，不在脚上;knee=knee is the middle of your leg, not a small part at the end of your foot=knee 是腿中间的膝盖，不是脚末端的小部分|stand on your toes|oe said like long o, as in *go*|oe 读长元音 o，和 *go* 一样
      tooth|brushing twice a day;a baby's first one;biting a hard sweet|a tooth is in your mouth; a bone is inside your body|tooth 在嘴里；bone 在身体里面|bone=bone is one of the hard parts inside your body, not in your mouth for biting=bone 是身体里面的骨头，不是嘴里用来咬东西的;finger=finger is a part of your hand, not a hard white thing in your mouth=finger 是手指，不是嘴里白色的硬东西|brush your teeth|one *tooth*, two *teeth*|一颗 *tooth*，两颗 *teeth*
      heart|beating faster when running;strong beating from running;fast beating before a test|your heart beats and pushes blood; a bone is hard and does not move by itself|heart 跳动，推动血液；bone 是硬的，不会自己动|bone=bone is a hard part inside your body, and it never beats=bone 是身体里面的硬骨头，从不跳动;skin=skin is the outside cover of your body, and it never beats=skin 是身体外面的皮肤，从不跳动|my heart beats · good for your heart|ear said like *ar*: heart|ear 读作 *ar*：heart
      skin|sun and a hat;babies being soft;snakes|skin is the outside cover of your body; blood is the red liquid inside|skin 是身体外面的皮肤；blood 是身体里面红色的液体|blood=blood is the red liquid inside your body, not the soft outside cover=blood 是身体里面红色的液体，不是外面柔软的皮肤;bone=bone is a hard part inside your body, not the soft outside cover=bone 是身体里面的硬骨头，不是外面柔软的皮肤|soft skin|sk at the start|开头是 sk
      blood|a cut knee;what the heart pushes;a nurse's needle|blood is the red liquid in your body; skin is the outside cover|blood 是身体里红色的液体；skin 是外面的皮肤|skin=skin is the outside cover of your body, not a red liquid that runs or is pushed=skin 是身体外面的皮肤，不是会流动、被推动的红色液体;bone=bone is a hard part inside your body, not a red liquid=bone 是身体里面的硬骨头，不是红色的液体|blood on my leg · take some blood|oo said like short u, as in *flood*|oo 读短元音 u，和 *flood* 一样
      bone|a dog chewing;milk helping them grow hard;a fall that broke something in an arm|a bone is hard and inside your body; skin is soft and outside|bone 是身体里面的硬骨头；skin 是外面柔软的皮肤|skin=skin is the soft outside cover of your body, not something hard that can break or be chewed=skin 是身体外面柔软的皮肤，不是能断、能啃的硬东西;heart=heart is the part that pushes blood, not something hard that can break or be chewed=heart 是推动血液的心脏，不是能断、能啃的硬东西|break a bone · strong bones|o that says its name before the silent e|不发音的 e 前面，o 读字母本音
      throat|not being able to sing;warm water for dryness;a cold drink|the throat is inside your neck; the neck is the outside part|throat 在脖子里面；neck 是外面的部分|neck=neck is the outside part between your head and shoulders, not the inside where your voice, food and drink go=neck 是头和肩之间外面的部分，不是声音、食物和饮料经过的里面;knee=knee is the middle of your leg, nowhere near where you drink or sing=knee 是腿中间，和喝水、唱歌都不沾边|a sore throat|th at the start, and oa said like long o|开头是 th，oa 读长元音 o
    `,
  },
});

const stayingWell = vocabularyTopic({
  id: "a2-words-staying-well",
  title: t("Staying Well", "保持健康"),
  summary: t(
    "Exercise, diet, habits and advice, being fit, strong or weak, careful, and accidents.",
    "锻炼、饮食、习惯和建议，健壮、强壮或虚弱，小心和事故。",
  ),
  intro: t(
    "To stay **fit**, my aunt runs every morning, eats a good **diet** and follows her doctor's **advice**: brushing her teeth after every meal is her best **habit**. These words help you talk about keeping well and staying safe.",
    "为了保持 **fit**（健康），我姑姑每天早上跑步，**diet**（饮食）很健康，还听医生的 **advice**（建议）：饭后刷牙是她最好的 **habit**（习惯）。这些词帮你谈论保持健康和注意安全。",
  ),
  prerequisites: ["a2-words-body-2"],
  words: [
    word(
      "exercise exercises exercised exercising",
      "to move your body to stay healthy; movement like this",
      "锻炼",
      "I get some {exercise} every morning: I run around the park before school. | Swimming is good {exercise} because it moves your whole body. | Dogs need {exercise} every day, so we take ours for a long walk.",
      "diet habit",
    ),
    word(
      "diet diets",
      "the food you usually eat",
      "饮食",
      "A healthy {diet} has lots of fruit and vegetables. | Grandpa is on a special {diet}: he can't eat sweets. | Rice is part of our {diet}.",
      "exercise habit",
    ),
    word(
      "fit fitter fittest",
      "healthy and strong, because you exercise",
      "健康的；健壮的",
      "My aunt runs every day, so she is very {fit}. | I want to get {fit}, so I go swimming. | Footballers have to be {fit} to run for ninety minutes.",
      "weak careful",
      "strong",
    ),
    word(
      "strong stronger strongest",
      "having a lot of power in your body",
      "强壮的",
      "He's {strong}. He can lift a big box. | Milk makes your bones {strong}. | Ants are small but very {strong}.",
      "weak careful",
      "fit",
    ),
    word(
      "weak weaker weakest",
      "not strong",
      "虚弱的",
      "After the fever, I felt {weak}. | After a week in bed, his legs were {weak}. | The baby bird is too {weak} to fly.",
      "strong fit",
    ),
    word(
      "habit habits",
      "something you do often, almost without thinking",
      "习惯",
      "Brushing your teeth every night is a good {habit} that I never forget. | Eating late at night is a bad {habit}: I do it almost every day. | Biting your nails is a bad {habit} that is hard to stop.",
      "accident diet",
    ),
    word(
      "should",
      "a word that gives advice: it is a good idea to",
      "应该",
      "You look tired. You {should} go to bed, but you don't have to. | It's only a good idea, not a rule: you {should} drink more water. | {Should} I call a doctor? What do you think is best?|Must Would",
      "must would",
    ),
    word(
      "matter matters mattered mattering",
      "to be important; a problem",
      "要紧；问题",
      "What's the {matter}? You look sad. | It doesn't {matter} that we lost: it's only a game, and we can try again.|worry happen | Does it {matter} if I'm late? Is it important?|worry happen",
      "advice habit",
    ),
    word(
      "advice",
      "words that tell someone what you think they should do",
      "建议",
      "Can you give me some {advice} about what to study? | My doctor's {advice} was that I should rest for a week. | Thanks for your {advice}. I'll try it.",
      "accident habit",
    ),
    word(
      "careful",
      "thinking about what you are doing so nothing bad happens",
      "小心的",
      "Be {careful}! The road is busy. | {Careful}! The floor is wet. | Please be {careful} with that glass.",
      "weak fit",
    ),
    word(
      "accident accidents",
      "something bad that happens and hurts someone or breaks something",
      "事故；意外",
      "He had a bike {accident} and broke his arm. | Sorry, I didn't mean to break your cup. The {accident} happened so fast. | There was a car {accident} on our street, and two people were hurt.",
      "habit diet",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Fit* and *strong* are close: *fit* means healthy because you exercise, as in *get fit*, and *strong* means having a lot of power, as in *lift a big box*. Ask whether the sentence is about exercise or about power.",
        "*fit* 和 *strong* 意思接近：*fit* 是因为锻炼而健康，如 *get fit*；*strong* 是力气大，如 *lift a big box*。想想句子说的是锻炼还是力气。",
      ),
      meaning: t(
        "A *habit* and an *accident* both happen to people, but a *habit* is something you do again and again, and an *accident* happens once, by chance, and hurts someone or breaks something.",
        "*habit* 和 *accident* 都是发生在人身上的事，但 *habit* 是一次又一次地做的事，*accident* 是偶然发生一次、伤了人或弄坏东西的事。",
      ),
      spell: t(
        "*Exercise* has x-e-r and ends in -cise: ex · er · cise. *Should* has a silent l: s-h-o-u-l-d.",
        "*exercise* 里是 x-e-r，结尾是 -cise：ex · er · cise。*should* 里的 l 不发音：s-h-o-u-l-d。",
      ),
    },
    notes: `
      exercise|running around the park;swimming moving the whole body;a dog's long walk|exercise is moving your body to stay healthy; a diet is the food you eat|exercise 是活动身体以保持健康；diet 是吃的食物|diet=diet is the food you usually eat, not moving your body=diet 是平时吃的食物，不是活动身体;habit=habit is something you do often almost without thinking, good or bad, not moving your body to stay healthy=habit 是不假思索常做的事，有好有坏，不是为健康活动身体|get some exercise · good exercise|ex · er · cise, ending in -cise|ex · er · cise，结尾是 -cise
      diet|fruit and vegetables;a grandpa who can't eat sweets;rice|your diet is the food you usually eat; exercise is moving your body|diet 是平时吃的食物；exercise 是锻炼|exercise=exercise is moving your body to stay healthy, not food you eat=exercise 是活动身体，不是吃的食物;habit=habit is something you do often, not the food you usually eat=habit 是常做的事，不是平时吃的食物|a healthy diet · on a diet|i and e said separately: di · et|i 和 e 分开读：di · et
      fit|an aunt who runs every day;going swimming;running for ninety minutes|fit means healthy because you exercise; careful means thinking so nothing bad happens|fit 是因锻炼而健康；careful 是小心|weak=weak means not strong, the opposite of healthy from exercise=weak 是虚弱无力，和锻炼得健康强壮正相反;careful=careful means thinking about what you do so nothing bad happens, not healthy from exercise=careful 是小心谨慎，不是锻炼得健康|get fit · keep fit|the t doubles: fitter, fittest|t 要双写：fitter、fittest
      strong|lifting a big box;milk and bones;small ants|strong means having a lot of power; weak means not strong|strong 是力气大；weak 是虚弱|weak=weak means without much power, the opposite of strong=weak 是没力气，和 strong 意思相反;careful=careful means thinking about what you do, not having a lot of power=careful 是小心，不是力气大|very strong · strong bones|str at the start, and -ong at the end|开头是 str，结尾是 -ong
      weak|a fever;a week in bed;a baby bird that can't fly|weak means not strong; fit means healthy from exercise|weak 是虚弱；fit 是因锻炼而健康|strong=strong means having a lot of power, the opposite of weak=strong 是力气大，和 weak 意思相反;fit=fit means healthy and strong from exercise, the opposite of weak=fit 是锻炼得健康强壮，和 weak 意思相反|feel weak · too weak to fly|ea for the long e; *week* with ee is seven days|ea 发长 e 音；拼作 ee 的 *week* 是一周
      habit|brushing teeth every night;eating late almost every day;biting nails|a habit is something you do again and again; an accident happens once by chance|habit 是一再做的事；accident 是偶然发生一次的事|accident=accident is something bad that happens once by chance, not something you do again and again=accident 是偶然发生一次的坏事，不是一再做的事;diet=diet is the food you usually eat, not something you do again and again like brushing or biting=diet 是平时吃的食物，不是刷牙、咬指甲这类一再做的事|a good habit · a bad habit|a short a and a short i: hab · it|短元音 a 和短元音 i：hab · it
      should|being tired but not having to go to bed;a good idea, not a rule;asking what is best|should gives advice, a good idea; must says something has to be done|should 是给建议，是好主意；must 是必须做|must=must says something has to be done, like a rule, not just a good idea=must 表示必须做，像规定一样，不只是好主意;would=would talks about something imagined or asks politely, not what is a good idea to do=would 用于假想或客气地问，不表示做什么是好主意|you should · should I|a silent l: s-h-o-u-l-d|l 不发音：s-h-o-u-l-d
      matter|looking sad;a game that was lost;whether being late is important|matter means to be important, or a problem as in *What's the matter?*; worry means to keep thinking about problems|matter 是要紧，或 *What's the matter?* 里的问题；worry 是担心|advice=advice is words telling someone what to do, not a problem or something being important=advice 是告诉别人怎么做的话，不是问题，也不是要紧;habit=habit is something you do often, not a problem or something being important=habit 是常做的事，不是问题，也不是要紧;worry=worry means a person keeps thinking about problems, and *it* cannot worry on its own=worry 是人在担心，*it* 不能单独 worry;happen=happen means to take place, not to be important=happen 是发生，不是要紧|What's the matter? · It doesn't matter.|the double t: mat · ter|双写 t：mat · ter
      advice|what to study;a doctor saying I should rest;something to try|advice is words about what someone should do; a habit is something you do often|advice 是建议；habit 是习惯|accident=accident is something bad that happens by chance, not words about what someone should do=accident 是偶然发生的坏事，不是建议;habit=habit is something you do often, not words about what someone should do=habit 是常做的事，不是建议|some advice · give advice|no plural, and c said like s; the verb *advise* has an s|没有复数，c 读作 s；动词 *advise* 写作 s
      careful|a busy road;a wet floor;a glass|careful means thinking so nothing bad happens; weak means not strong|careful 是小心；weak 是虚弱|weak=weak means not strong, not paying attention so nothing bad happens=weak 是虚弱，不是注意别出事;fit=fit means healthy from exercise, not paying attention so nothing bad happens=fit 是锻炼得健康，不是注意别出事|be careful · careful with that glass|care + -ful with one l|care 加 -ful，只有一个 l
      accident|a bike crash and a broken arm;a broken cup that happened so fast;a car crash where two people were hurt|an accident happens once by chance; a habit is something you do again and again|accident 是偶然发生一次的事；habit 是一再做的事|habit=habit is something you do again and again, not something bad that happens once by chance=habit 是一再做的事，不是偶然发生一次的坏事;diet=diet is the food you usually eat, not something bad that happens=diet 是平时吃的食物，不是发生的坏事|have an accident · a car accident|the double c: ac · ci · dent, said *ks*|双写 c：ac · ci · dent，读作 *ks*
    `,
  },
});

const atTheDoctor = vocabularyTopic({
  id: "a2-words-at-the-doctor",
  title: t("At the Doctor", "看医生"),
  summary: t(
    "Appointments, problems, temperatures, pills, pharmacies, ambulances, emergencies and patients; checking and worrying.",
    "预约、问题、体温、药片、药店、救护车、紧急情况和病人；检查和担心。",
  ),
  intro: t(
    "When I had a high **temperature**, Mom made an **appointment** with the doctor, who said it was nothing **serious** and sent us to the **pharmacy** for some **pills**. These words help you talk about visiting a doctor and getting help when you are ill.",
    "我 **temperature**（体温）很高的时候，妈妈和医生约了 **appointment**（预约），医生说没什么 **serious**（严重的），让我们去 **pharmacy**（药店）买些 **pills**（药片）。这些词帮你谈论看医生，以及生病时怎样求助。",
  ),
  prerequisites: ["a2-words-staying-well"],
  words: [
    word(
      "appointment appointments",
      "a time you agree to see someone, like a doctor",
      "预约",
      "I have an {appointment} with the dentist at three. | Call the clinic to make an {appointment}. | I'm sorry I'm late for my {appointment}.",
      "emergency ambulance",
    ),
    word(
      "problem problems",
      "something that is wrong and needs to be fixed",
      "问题",
      "What's the {problem}? — My ear hurts. | There's a {problem} with my computer. | No {problem}! I'm happy to help.",
      "patient pill",
    ),
    word(
      "temperature temperatures",
      "how hot or cold something is",
      "温度；体温",
      "The nurse took my {temperature}. It was 38 degrees. | The {temperature} today is 25 degrees. | Your {temperature} is normal, so you don't have a fever.",
      "problem pill",
    ),
    word(
      "pill pills",
      "a small round piece of medicine that you take with water",
      "药片",
      "Take two {pills} after each meal.|patients ambulances | This {pill} will help your headache. | Take one {pill} with water before bed.",
      "patient ambulance",
    ),
    word(
      "pharmacy pharmacies",
      "a shop where you can buy medicine",
      "药店",
      "You can buy this medicine at the {pharmacy}. | The {pharmacy} is the shop next to the bank. | I need some pills, so I'm going to the {pharmacy} on the corner.",
      "ambulance appointment",
    ),
    word(
      "ambulance ambulances",
      "a car that takes ill or hurt people to hospital fast",
      "救护车",
      "He's hurt! Phone 120 and ask for the {ambulance} to come quickly. | The {ambulance} took her to the hospital. | We heard the {ambulance} coming down the street, very loud and fast.",
      "appointment pharmacy",
    ),
    word(
      "emergency emergencies",
      "a dangerous time when you need help fast",
      "紧急情况",
      "In an {emergency}, when someone needs help fast, call 120. | This is an {emergency}! Please help! | Only use this door in an {emergency}, like a fire.",
      "appointment ambulance",
    ),
    word(
      "patient patients",
      "a person who a doctor or nurse is looking after",
      "病人",
      "The doctor sees thirty {patients} a day.|pills pharmacies | The nurse is talking to a {patient}. | Hospital {patients} must rest a lot.|pills pharmacies",
      "pill pharmacy",
    ),
    word(
      "check checks checked checking",
      "to look at something to see if it is right or OK",
      "检查",
      "The doctor {checked} my ears.|worried happened | Please {check} your answers before you finish.|worry happen | Let me {check} your temperature.|worry happen",
      "worry happen",
    ),
    word(
      "serious",
      "very bad, or very important; not joking",
      "严重的；严肃的",
      "Are you {serious}? You want to run 50 km? | It's only a cold, nothing {serious}: you don't need to see a doctor. | Is the problem {serious}? — No, you'll be fine in two days.",
      "careful cheerful",
    ),
    word(
      "terrible",
      "very bad",
      "糟糕的；可怕的",
      "The food was {terrible}. I didn't eat it. | I had a {terrible} night. I couldn't sleep. | What {terrible} weather! It's raining again.",
      "serious cheerful",
    ),
    word(
      "worry worries worried worrying",
      "to keep thinking about problems or bad things that may happen",
      "担心",
      "Don't {worry} about it. Everything will be fine. | My mom {worries} about me when I come home late.|checks hurts | I'm {worried} about my test.|checked hurt",
      "check hurt",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Pharmacy*, *ambulance* and *appointment* all go with seeing a doctor: a *pharmacy* is a shop, an *ambulance* is a car that drives fast to hospital, and an *appointment* is a time. Look for a shop, a ride or a time in the sentence.",
        "*pharmacy*、*ambulance* 和 *appointment* 都和看病有关：*pharmacy* 是商店，*ambulance* 是飞快开往医院的车，*appointment* 是约好的时间。在句子里找商店、乘车或时间的线索。",
      ),
      meaning: t(
        "*Serious* and *terrible* both mean bad: *serious* says how big a problem is, as in *nothing serious*, and *terrible* says something was very unpleasant, like food or weather. *Serious* can also mean not joking.",
        "*serious* 和 *terrible* 都表示不好：*serious* 说的是问题有多严重，如 *nothing serious*；*terrible* 说的是某样东西很糟糕，比如饭菜或天气。*serious* 还可以表示不是开玩笑。",
      ),
      spell: t(
        "*Pharmacy* starts with ph said like f, and *appointment* has a double p: ap · point · ment.",
        "*pharmacy* 开头的 ph 读作 f；*appointment* 要双写 p：ap · point · ment。",
      ),
    },
    notes: `
      appointment|the dentist at three;calling the clinic;being late|an appointment is a time you agree to see someone; an emergency is a dangerous time you did not plan|appointment 是约好的时间；emergency 是没预料到的紧急情况|emergency=emergency is a dangerous time that comes without a plan, not a time you agree on and can be late for=emergency 是突然发生的危险情况，不是约好的、会迟到的时间;ambulance=ambulance is a car that takes people to hospital, not a time you agree on=ambulance 是送人去医院的车，不是约好的时间|make an appointment · an appointment with the dentist|the double p: ap · point · ment|双写 p：ap · point · ment
      problem|a hurting ear;a computer;being happy to help|a problem is something wrong; a patient is a person a doctor looks after|problem 是出了问题的事；patient 是医生照顾的病人|patient=patient is a person a doctor or nurse looks after, not something that is wrong=patient 是医生护士照顾的病人，不是出了问题的事;pill=pill is a small piece of medicine, not something that is wrong=pill 是一小片药，不是出了问题的事|What's the problem? · No problem!|prob · lem, with -lem at the end|prob · lem，结尾是 -lem
      temperature|38 degrees;25 degrees today;no fever|temperature is how hot or cold something is; a problem is something wrong|temperature 是冷热的程度；problem 是出了问题的事|problem=problem is something that is wrong, not a number of degrees=problem 是出了问题的事，不是多少度;pill=pill is a small piece of medicine, not how hot or cold something is=pill 是一小片药，不是冷热的程度|take my temperature · the temperature today|tem · per · a · ture, with a quiet a|tem · per · a · ture，中间的 a 读得很轻
      pill|after each meal;a headache;water before bed|a pill is a small piece of medicine; a patient is the person who takes it|pill 是一小片药；patient 是吃药的病人|patient=patient is a person a doctor looks after, not a small piece of medicine you take=patient 是医生照顾的病人，不是要吃的一小片药;ambulance=ambulance is a car that takes people to hospital, not a small piece of medicine=ambulance 是送人去医院的车，不是一小片药|take a pill · two pills|the double l|双写 l
      pharmacy|buying medicine;a shop next to the bank;needing pills|a pharmacy is a shop for medicine; an ambulance is a car for ill people|pharmacy 是药店；ambulance 是救护车|ambulance=ambulance is a car that takes people to hospital, not a shop where you buy medicine=ambulance 是送人去医院的车，不是买药的商店;appointment=appointment is a time you agree to see someone, not a shop=appointment 是约好见面的时间，不是商店|at the pharmacy · go to the pharmacy|ph said like f, and -cy at the end|ph 读作 f，结尾是 -cy
      ambulance|someone hurt and 120;a ride to the hospital;a loud fast sound in the street|an ambulance takes ill people to hospital; a pharmacy sells medicine|ambulance 送病人去医院；pharmacy 卖药|appointment=appointment is a time you agree on, and it cannot drive, come or take anyone anywhere=appointment 是约好的时间，不会开车，也不能把人送到哪里;pharmacy=pharmacy is a shop that stays in one place, and it cannot drive or take anyone anywhere=pharmacy 是待在原地的商店，不会开动，也不能把人送到哪里|call an ambulance · the ambulance took her|am · bu · lance, with -ance at the end|am · bu · lance，结尾是 -ance
      emergency|someone needing help fast;a call for help;a fire|an emergency is a dangerous time when you need help fast; an appointment is a planned time|emergency 是需要紧急帮助的危险时刻；appointment 是约好的时间|appointment=appointment is a time you plan and agree on, not a dangerous time when you need help fast=appointment 是事先约好的时间，不是急需帮助的危险时刻;ambulance=ambulance is the car that comes when there is danger, not the dangerous time itself=ambulance 是出事时赶来的车，不是危险时刻本身|in an emergency|-ency at the end, with g said like j|结尾是 -ency，g 读作 j
      patient|thirty a day for a doctor;a nurse talking;resting in hospital|a patient is a person a doctor looks after; a pill is medicine|patient 是病人；pill 是药片|pill=pill is a small piece of medicine, not a person who can see a doctor, talk or rest=pill 是一小片药，不是会看病、说话或休息的人;pharmacy=pharmacy is a shop, not a person a doctor or nurse looks after=pharmacy 是商店，不是医生护士照顾的人|a patient · hospital patients|ti said like *sh*: pa · tient|ti 读作 *sh*：pa · tient
      check|a doctor looking at ears;answers before finishing;a temperature|you check something to see if it is right; you worry when you keep thinking about problems|check 是查看对不对；worry 是担心|worry=worry means to keep thinking about problems, not to look at something to see if it is right=worry 是担心，不是查看对不对;happen/happened=to happen is for an event to take place, not to look at something to see if it is right=happen 是发生，不是检查|check your answers · check my temperature|ch at the start, and ck at the end|开头是 ch，结尾是 ck
      serious|running 50 km;only a cold;being fine in two days|serious means very bad, or not joking; careful means paying attention|serious 是严重的，或不是开玩笑；careful 是小心|careful=careful means paying attention so nothing bad happens, not how bad a problem is or not joking=careful 是小心，不是问题多严重，也不是不开玩笑;cheerful=cheerful means happy and smiling, not how bad a problem is or not joking=cheerful 是快乐开朗，不是问题多严重，也不是不开玩笑|nothing serious · Are you serious?|-ious at the end: se · ri · ous|结尾是 -ious：se · ri · ous
      terrible|food that nobody ate;a night with no sleep;rain again|terrible means very bad; serious means a problem is big|terrible 是很糟糕；serious 是问题严重|serious=serious says how big a problem is, not that food, a night or weather was unpleasant=serious 说的是问题多严重，不是饭菜、夜晚或天气很糟;cheerful=cheerful means happy and bright, the opposite of very bad=cheerful 是快乐明亮，和很糟糕正相反|terrible weather · a terrible night|the double r, and -ible at the end|双写 r，结尾是 -ible
      worry|everything being fine;a mom and coming home late;a test|you worry when you keep thinking about problems; you check when you look to see if something is right|worry 是担心；check 是查看对不对|check=check means looking at something to see if it is right, not thinking about problems=check 是查看对不对，不是担心问题;hurt=hurt means giving or feeling pain, not thinking about problems=hurt 是疼或弄疼，不是担心问题|don't worry · worried about my test|or said like *ur*, and y becomes ie: worries, worried|or 读作 *ur*，y 变 ie：worries、worried
    `,
  },
});

// Should and must.

/** subjects are who the advice or the rule is for, with the wrong -s form a learner adds after he or she. */
const modalSubjects: readonly (readonly [subject: string, single: boolean])[] = [
  ["You", false],
  ["She", true],
  ["We", false],
  ["Tom", true],
  ["They", false],
  ["He", true],
  ["My dad", true],
];

/** adviceActions are a plain verb, its -s form and the rest of a sentence of advice. */
const adviceActions: readonly (readonly [verb: string, third: string, rest: string])[] = [
  ["rest", "rests", "for a few days"],
  ["see", "sees", "a doctor"],
  ["drink", "drinks", "more water"],
  ["go", "goes", "to bed early"],
  ["eat", "eats", "more vegetables"],
  ["take", "takes", "this medicine"],
  ["stay", "stays", "at home today"],
  ["wear", "wears", "a warm coat"],
  ["call", "calls", "the dentist"],
  ["exercise", "exercises", "every day"],
  ["wash", "washes", "your hands"],
];

const modalRows = everyPair(everyPair(modalSubjects, adviceActions), ["should", "must"]).map(
  ([[subject, action], modal]) => [subject, action, modal] as const,
);

/** own is the possessive word of a subject, for the hands it washes. */
const own = (subject: string): string =>
  ({ You: "your", you: "your", We: "our", we: "our", They: "their", they: "their", She: "her", she: "her" })[subject] ?? "his";

const withOwn = (subject: string, rest: string) => rest.replace(/\byour\b/gu, own(subject));

const modalChoiceBank: readonly ChoiceItem[] = modalRows.map(([[subject], [verb, third, rest], modal]): ChoiceItem => {
  const fixed = withOwn(subject, rest);
  return [
    "",
    `${subject} ${modal} ${verb} ${fixed}.`,
    [`${subject} ${modal} to ${verb} ${fixed}.`, `${subject} ${modal} ${third} ${fixed}.`],
  ];
});

const modalFixBank: readonly TypedItem[] = modalRows.map(([[subject, single], [verb, third, rest], modal], k): TypedItem => {
  const fixed = withOwn(subject, rest);
  const shown = k % 2 === 0 || !single ? `${subject} ${modal} to ${verb} ${fixed}.` : `${subject} ${modal} ${third} ${fixed}.`;
  return { shown, accepted: [`${subject} ${modal} ${verb} ${fixed}.`], wrong: [shown] };
});

/** modalReason says what should or must in a sentence does and what follows it. */
const modalReason = (sentence: string): Text =>
  /\bmust\b/u.test(sentence)
    ? t(
        "*must* gives a rule, and like *can* it takes the plain verb straight after it, with no *to* and no *-s*",
        "*must* 表示规定，它和 *can* 一样，后面直接接动词原形，不加 *to*，也不加 *-s*",
      )
    : t(
        "*should* gives advice, and like *can* it takes the plain verb straight after it, with no *to* and no *-s*",
        "*should* 表示建议，它和 *can* 一样，后面直接接动词原形，不加 *to*，也不加 *-s*",
      );

/** modalWhy explains a sentence with should or must. */
const modalWhy = (right: string): Text => {
  const reason = modalReason(right);
  const modal = /\bmust\b/u.test(right) ? "must" : "should";
  return t(
    `${reason.en}: ${right}\n\n**Check.** Look right after *${modal}*: there is no *to* and no *-s* on the verb, so the modal pattern is right.`,
    `${reason["zh-CN"]}：${right}\n\n**检验。** 看 *${modal}* 后面紧跟的部分：既没有 *to*，动词也没有加 *-s*，符合情态动词的用法。`,
  );
};

/** whyNotModal explains to or -s after should or must. */
const whyNotModal = (wrong: string, right: string, _shown: string, position: number): Text => {
  const modal = /\bmust\b/u.test(right) ? "must" : "should";
  return position === 0
    ? t(
        `*${wrong}* puts *to* after *${modal}*, but the plain verb comes straight after it.`,
        `*${wrong}* 在 *${modal}* 后面加了 *to*，但它后面直接接动词原形。`,
      )
    : t(
        `*${wrong}* adds *-s* to the verb. After *${modal}* the verb stays plain, even after *he* or *she*.`,
        `*${wrong}* 给动词加了 *-s*。在 *${modal}* 后面，即使主语是 *he* 或 *she*，动词也用原形。`,
      );
};

const shouldAndMust: TopicDef = {
  id: "should-and-must",
  title: t("Should and Must", "should 和 must"),
  summary: t(
    "You should rest. You must take this medicine. Should gives advice, must a rule; neither takes to after it.",
    "You should rest. You must take this medicine. should 表示建议，must 表示规定；后面都不加 to。",
  ),
  intro: t(
    "Compare *You should drink warm water* (helpful advice) and *You must wear a helmet* (a rule). Both *should* and *must* stay the same for every subject and go straight into the plain verb.",
    "比较 *You should drink warm water*（善意建议）和 *You must wear a helmet*（必须遵守的规定）。*should* 和 *must* 对任何主语都不变形，后面直接接动词原形。",
  ),
  prerequisites: ["can-for-ability", "a2-words-staying-well"],
  encompasses: [
    { topic: "can-for-ability", weight: 0.2 },
    { topic: "a2-words-staying-well", weight: 0.1 },
  ],
  xp: 15,
  strand: "grammar",
  knowledgePoints: [
    point(
      "choose",
      t("Should, must and the plain verb", "should、must 加动词原形"),
      t(
        "*Should* gives advice: *You should rest.* (It's a good idea.) *Must* gives a rule or something very important: *You must take this medicine.*\n\nLike *can*, they never change, and the plain verb comes right after them, with no *to* and no *-s*: *She should rest.* *He must stay at home.*\n\n> **Watch out.** Never write *to* after *should* or *must* (*She should to rest* is wrong) and never add *-s* to either the modal or the verb (*She should rests* is wrong).",
        "*should* 表示建议：*You should rest.*（这样做比较好。）*must* 表示规定或非常重要的事：*You must take this medicine.*\n\n它们和 *can* 一样，形式从不变化，后面直接接动词原形，不加 *to*，也不加 *-s*：*She should rest.* *He must stay at home.*\n\n> **注意。** 不要在 *should* 或 *must* 后面加 *to*（*She should to rest* 是错的），也不要给情态动词或后面的动词加 *-s*（*She should rests* 是错的）。",
      ),
      choiceGenerator(t("Which sentence is right?", "哪个句子是对的？"), modalChoiceBank, modalWhy, whyNotModal),
    ),
    point(
      "fix",
      t("Fixing the verb after should and must", "改正 should 和 must 后的动词"),
      t(
        "Each sentence has *to* or an *-s* after *should* or *must*: *He should to drink water.* → *He should drink water.* *She must rests.* → *She must rest.* Rewrite it cleanly with the plain verb.\n\n> **Watch out.** Remove the extra *to* or *-s* only, and keep the subject, the modal (*should* or *must*), and the rest of the sentence intact.",
        "每个句子在 *should* 或 *must* 后面多了 *to* 或 *-s*：*He should to drink water.* → *He should drink water.* *She must rests.* → *She must rest.* 用动词原形重写句子。\n\n> **注意。** 只去掉多余的 *to* 或 *-s*，保留主语、情态动词（*should* 或 *must*）以及句子的其余部分。",
      ),
      typedGenerator("sentence", t("Fix the sentence.", "改正这个句子。"), modalFixBank, modalWhy),
    ),
  ],
};

// Have to and don't have to.

/** needlessContexts are a reason and a thing that is not needed: don't have to. */
const needlessContexts: readonly (readonly [reason: string, rest: string])[] = [
  ["It's Saturday, so", "get up early"],
  ["The museum is free, so", "pay"],
  ["There are umbrellas at the hotel, so", "bring one"],
  ["The test is next week, so", "study tonight"],
  ["There's a lot of food at home, so", "go shopping"],
  ["The bus stops at the door, so", "walk"],
  ["The fever has gone, so", "take the pills any more"],
  ["Dinner is ready, so", "cook tonight"],
  ["It's a holiday, so", "go to school"],
  ["The room is clean, so", "tidy it"],
  ["The dog had a walk this morning, so", "take it out again"],
  ["The class starts at ten today, so", "hurry"],
  ["The film is on TV, so", "buy a ticket"],
  ["The shop delivers for free, so", "carry the boxes home"],
  ["I have finished the dishes, so", "help me"],
];

/** forbiddenContexts are a reason and a thing that is not allowed: mustn't. */
const forbiddenContexts: readonly (readonly [reason: string, rest: string])[] = [
  ["The baby is sleeping, so", "shout"],
  ["It's a test, so", "talk to your friends"],
  ["The water is dirty, so", "drink it"],
  ["This is a hospital, so", "make a lot of noise"],
  ["The road is busy, so", "play near it"],
  ["The paintings are old, so", "touch them"],
  ["The ice is thin, so", "walk on it"],
  ["It's a secret, so", "tell anyone"],
  ["These pills are strong, so", "take more than two"],
  ["The dog bites, so", "put your hand in its cage"],
  ["The floor is wet, so", "run in the hall"],
  ["It's a library, so", "eat your lunch here"],
  ["The plates are hot, so", "touch them with your fingers"],
  ["The bridge is broken, so", "cross it"],
  ["The doctor said to rest, so", "play football this week"],
];

const haveToSubjects: readonly (readonly [subject: string, single: boolean])[] = [
  ["you", false],
  ["she", true],
  ["we", false],
  ["he", true],
  ["they", false],
];

const neg = (single: boolean) => (single ? "doesn't have to" : "don't have to");

const meaningBank: readonly ChoiceItem[] = interleave([
  everyPair(haveToSubjects, needlessContexts).map(
    ([[subject, single], [reason, rest]]): ChoiceItem => [`${reason} ${subject} ___ ${rest}.`, neg(single), ["mustn't", neg(!single)]],
  ),
  everyPair(haveToSubjects, forbiddenContexts).map(
    ([[subject, single], [reason, rest]]): ChoiceItem => [
      `${reason} ${subject} ___ ${withOwn(subject, rest).replace(/\b(our|their) hand\b/u, "$1 hands")}.`,
      "mustn't",
      [neg(single), neg(!single)],
    ],
  ),
]);

/** haveToRules are sentences with must to say again with have to. */
const haveToPeople: readonly (readonly [subject: string, single: boolean])[] = [
  ["Tom", true],
  ["I", false],
  ["She", true],
  ["We", false],
  ["My mom", true],
  ["They", false],
  ["He", true],
  ["You", false],
  ["Lily", true],
  ["The children", false],
  ["My grandpa", true],
  ["Our teacher", true],
  ["The nurses", false],
];

/** haveToThings are what someone must do, fitting any subject. */
const haveToThings: readonly string[] = [
  "stay in bed",
  "go to the dentist",
  "wear glasses",
  "be home by nine",
  "work on Saturday",
  "wear a uniform",
  "take a pill every morning",
  "show a ticket",
  "practice the piano every day",
  "wash the dishes after lunch",
  "walk to the station",
  "check a lot of emails",
  "get up at six",
];

const haveToRules: readonly (readonly [subject: string, single: boolean, rest: string])[] = everyPair(haveToPeople, haveToThings).map(
  ([[subject, single], rest]) => [subject, single, rest] as const,
);

const haveToTypedBank: readonly TypedItem[] = interleave([
  haveToRules.map(
    ([subject, single, rest]): TypedItem => ({
      shown: `${subject} must ${rest}.`,
      accepted: [`${subject} ${single ? "has" : "have"} to ${rest}.`],
      wrong: [`${subject} ${single ? "have" : "has"} to ${rest}.`, `${subject} must to ${rest}.`],
      instruction: t("Say it with have to.", "用 have to 改写。"),
    }),
  ),
  haveToRules.map(
    ([subject, single, rest]): TypedItem => ({
      shown: `${subject} ${single ? "has" : "have"} to ${rest}.`,
      accepted: [`${subject} [${single ? "doesn't|does not" : "don't|do not"}] have to ${rest}.`],
      canonical: `${subject} ${single ? "doesn't" : "don't"} have to ${rest}.`,
      wrong: [`${subject} ${single ? "doesn't has" : "haven't"} to ${rest}.`, `${subject} mustn't ${rest}.`],
      instruction: t("Make it negative: it is not needed.", "改成否定句：表示不必。"),
    }),
  ),
  haveToRules.map(([subject, single, rest]): TypedItem => {
    const asked =
      subject === "I"
        ? "you"
        : subject === "You"
          ? "I"
          : /^[A-Z][a-z]+$/u.test(subject) && !["She", "He", "We", "They"].includes(subject)
            ? subject
            : subject.charAt(0).toLowerCase() + subject.slice(1);
    const askedRest = subject === "You" ? rest.replace("your", "my") : rest;
    return {
      shown: `${subject} ${single ? "has" : "have"} to ${rest}.`,
      accepted: [`${single ? "Does" : "Do"} ${asked} have to ${askedRest}?`],
      wrong: [`${single ? "Does" : "Do"} ${asked} has to ${askedRest}?`, `${single ? "Has" : "Have"} ${asked} to ${askedRest}?`],
      instruction: t("Make a question.", "改成疑问句。"),
    };
  }),
]);

/** meaningWhy explains don't have to or mustn't from the reason in a sentence. */
const meaningWhy = (right: string, shown: string): Text => {
  const done = shown.replace("___", `*${right}*`);
  if (right === "mustn't")
    return t(
      `The reason shows that it is not allowed, so it takes *mustn't*: ${done}\n\n**Check.** Ask whether doing the action is forbidden (yes → *mustn't*) or merely optional (no → *don't/doesn't have to*).`,
      `前面的原因说明这件事不许做，所以用 *mustn't*：${done}\n\n**检验。** 问自己：做这件事是不是被禁止（是 → *mustn't*），还是只是没必要（不是 → *don't/doesn't have to*）？`,
    );
  const who = right.startsWith("doesn't")
    ? t("*doesn't* goes with one person", "单个的人用 *doesn't*")
    : t("*don't* goes with *I*, *you*, *we* and *they*", "*I*、*you*、*we*、*they* 用 *don't*");
  return t(
    `The reason shows that it is not needed, though it is allowed, so it takes *${right}*; ${who.en}: ${done}\n\n**Check.** Verify both meaning and subject: doing it is optional (not forbidden), and the subject matches *${right.split(" ")[0]}*.`,
    `前面的原因说明这件事不必做，但可以做，所以用 *${right}*；${who["zh-CN"]}：${done}\n\n**检验。** 核对意思和主语：这件事只是不必做（不是禁止），且主语与 *${right.split(" ")[0]}* 一致。`,
  );
};

/** whyNotMeaning explains a wrong choice between don't have to and mustn't. */
const whyNotMeaning = (wrong: string, right: string): Text => {
  if (wrong === "mustn't")
    return t(
      "*mustn't* means it is not allowed, but the reason here only says it is not needed.",
      "*mustn't* 表示不许做，可这里的原因只是说不必做。",
    );
  if (right === "mustn't")
    return t(
      `*${wrong}* means it is not needed, but the reason here shows it is forbidden.`,
      `*${wrong}* 表示不必做，可这里的原因说明这件事绝对不许做。`,
    );
  return right.startsWith("doesn't")
    ? t(
        "*don't have to* is for *I*, *you*, *we* and *they*, not for one person (*he/she*).",
        "*don't have to* 用于 *I*、*you*、*we*、*they*，不用于第三人称单数（*he/she*）。",
      )
    : t(
        "*doesn't have to* is for one person (*he/she*), not for *you*, *we* or *they*.",
        "*doesn't have to* 用于第三人称单数（*he/she*），不用于 *you*、*we* 或 *they*。",
      );
};

const haveTo: TopicDef = {
  id: "have-to",
  title: t("Have To and Don't Have To", "have to 和 don't have to"),
  summary: t(
    "She has to stay in bed. You don't have to come. Don't have to means it is not needed, not that it is not allowed.",
    "She has to stay in bed. You don't have to come. don't have to 表示“不必”，不是“不许”。",
  ),
  intro: t(
    "*You don't have to pay* means entry is free; *You mustn't touch* means touching is forbidden. Although *have to* and *must* mean almost the same thing, their negatives mean two very different things.",
    "*You don't have to pay* 是免费（不必付钱），*You mustn't touch* 是禁止触摸（不许碰）。虽然 *have to* 和 *must* 意思相近，但它们的否定形式意思截然不同。",
  ),
  prerequisites: ["should-and-must", "third-person-s"],
  encompasses: [
    { topic: "should-and-must", weight: 0.2 },
    { topic: "third-person-s", weight: 0.3 },
  ],
  xp: 20,
  strand: "grammar",
  knowledgePoints: [
    point(
      "meaning",
      t("Don't have to or mustn't", "don't have to 还是 mustn't"),
      t(
        "*Have to* is like *must*: it is needed. But the negatives mean different things:\n\n- *don't have to*: it is **not needed**, but you can if you like. *It's Saturday, so you don't have to get up early.*\n- *mustn't*: it is **not allowed**. *The baby is sleeping, so you mustn't shout.*\n\nAfter *he*, *she* or one person, use *doesn't have to*.\n\n> **Watch out.** Do not mix up “not needed” (*don't have to*) with “forbidden” (*mustn't*), and remember to match *don't* vs. *doesn't* to the subject.",
        "*have to* 和 *must* 一样，表示“必须”。但它们的否定意思不同：\n\n- *don't have to*：**不必**，想做也可以。*It's Saturday, so you don't have to get up early.*\n- *mustn't*：**不许、禁止**。*The baby is sleeping, so you mustn't shout.*\n\n主语是 *he*、*she* 或单个的人时，用 *doesn't have to*。\n\n> **注意。** 别把“不必”（*don't have to*）和“不许”（*mustn't*）混用，同时核对主语该配 *don't* 还是 *doesn't*。",
      ),
      choiceGenerator(t("Choose the words for the gap.", "选出填入空白处的词。"), meaningBank, meaningWhy, whyNotMeaning),
    ),
    point(
      "write",
      t("Has to, doesn't have to, does she have to?", "has to、doesn't have to、does she have to?"),
      t(
        "*Have to* changes like an ordinary verb: *she has to stay in bed*, *she doesn't have to stay in bed*, *does she have to stay in bed?*\n\n> **Watch out.** Never write *she doesn't has to* or *has she to?*—after *doesn't* or *Does*, *have* always returns to its plain form.",
        "*have to* 像普通动词一样变化：*she has to stay in bed*、*she doesn't have to stay in bed*、*does she have to stay in bed?*\n\n> **注意。** 不要写 *she doesn't has to* 或 *has she to?*——在 *doesn't* 或 *Does* 后面，*have* 必须还原为原形。",
      ),
      typedGenerator("sentence-pattern", t("Write the sentence again.", "改写句子。"), haveToTypedBank, (right) =>
        right.endsWith("?")
          ? t(
              `*Have to* makes a question like any verb: *Do* or *Does* first, then the subject and *have to* with a plain *have*: ${right}\n\n**Check.** Verify the front (*Do/Does* + subject + *have to*) and make sure *have* is plain, never *has*.`,
              `*have to* 像普通动词一样构成疑问句：先写 *Do* 或 *Does*，再写主语和 *have to*，*have* 用原形：${right}\n\n**检验。** 核对句首结构（*Do/Does* + 主语 + *have to*），确认 *have* 用原形而不是 *has*。`,
            )
          : /n't have to/u.test(right)
            ? t(
                `*Have to* makes its negative like any verb, with *don't* or *doesn't*, and *have* stays plain after it: ${right}\n\n**Check.** Verify that *don't/doesn't* agrees with the subject and is followed by plain *have to*.`,
                `*have to* 像普通动词一样用 *don't* 或 *doesn't* 构成否定，后面的 *have* 用原形：${right}\n\n**检验。** 确认 *don't/doesn't* 与主语一致，后面紧接原形 *have to*。`,
              )
            : t(
                `*Must* becomes *have to*, and *have* takes *-s* as *has* after one person: ${right}\n\n**Check.** Match the subject to *has to* (singular third person) or *have to* (all others), with the plain verb right after *to*.`,
                `*must* 改为 *have to*；单个的人作主语时，*have* 变成 *has*：${right}\n\n**检验。** 核对主语对应 *has to*（三单）还是 *have to*（其余主语），*to* 后面接动词原形。`,
              ),
      ),
    ),
  ],
};

// Writing advice with should.

/** problems are what someone has, advice for it and a thing not to do. */
const problems: readonly (readonly [problem: string, advice: string, not: string, also: string])[] = [
  ["a headache", "drink some water", "watch TV", "rest in a quiet room"],
  ["a cough", "drink something warm", "eat ice cream", "stay at home"],
  ["a fever", "stay in bed", "go to school", "take some medicine"],
  ["a toothache", "see a dentist", "eat sweets", "take a pill"],
  ["a sore throat", "drink warm water", "shout", "rest"],
  ["a bad knee", "rest", "play football", "see a doctor"],
  ["a cold", "go to bed early", "go out in the rain", "drink hot tea"],
  ["a stomachache", "eat some rice", "eat spicy food", "rest"],
  ["a backache", "lie down", "carry heavy bags", "see a doctor"],
];

/** sick are who has the problem, the verb have for them and the pronoun for advice. */
const sick: readonly (readonly [who: string, has: string, pronoun: string])[] = [
  ["Tom", "has", "He"],
  ["Anna", "has", "She"],
  ["My parents", "have", "They"],
  ["My sister", "has", "She"],
  ["Ben", "has", "He"],
  ["The children", "have", "They"],
  ["Grandpa", "has", "He"],
];

const adviceRows = pairUp(63, sick, problems);

const adviceBank: readonly TypedItem[] = adviceRows.slice(0, 32).map(
  ([[who, has, pronoun], [problem, advice]]): TypedItem => ({
    shown: `${who} ${has} ${problem}. (${advice})`,
    accepted: [`${pronoun} should ${advice}.`],
    wrong: [`${pronoun} should to ${advice}.`, `${pronoun} ${advice}.`],
  }),
);

const notBank: readonly TypedItem[] = adviceRows.slice(31, 63).map(
  ([[who, has, pronoun], [problem, , not]]): TypedItem => ({
    shown: `${who} ${has} ${problem}. (not / ${not})`,
    accepted: [`${pronoun} [shouldn't|should not] ${not}.`],
    canonical: `${pronoun} shouldn't ${not}.`,
    wrong: [`${pronoun} don't should ${not}.`, `${pronoun} should not to ${not}.`],
  }),
);

const twoBank: readonly TypedItem[] = pairUp(36, sick, problems.slice(1)).map(
  ([[who, has, pronoun], [problem, advice, , also]]): TypedItem => ({
    shown: `${who} ${has} ${problem}. (${advice} / ${also})`,
    accepted: [`${pronoun} should ${advice} and (should )${also}.`],
    canonical: `${pronoun} should ${advice} and ${also}.`,
    wrong: [`${pronoun} should ${advice}, ${also}.`, `${pronoun} should ${advice} and to ${also}.`],
  }),
);

/** adviceWho is the person with the problem in a note, and the pronoun the advice uses for them. */
const adviceWho = (shown: string, right: string): string => {
  const who = shown.split(/ (?:has|have) /u)[0] ?? "";
  const pronoun = right.split(" ")[0] ?? "";
  return `*${who}* → *${pronoun}*`;
};

const writingAdvice: TopicDef = {
  id: "writing-advice-with-should",
  title: t("Writing Advice", "写建议"),
  summary: t(
    "Turn a problem and a note into advice: Tom has a headache. (drink some water) becomes He should drink some water.",
    "把问题和提示写成建议：Tom has a headache. (drink some water) 写成 He should drink some water.",
  ),
  intro: t(
    "When a friend has a problem—*Anna has a cough*—good English advice uses a matching pronoun, *should* or *shouldn't*, and a plain verb: *She should drink something warm and shouldn't eat ice cream.*",
    "朋友身体不舒服时（如 *Anna has a cough*），地道建议用对应的代词加上 *should* 或 *shouldn't* 和动词原形：*She should drink something warm and shouldn't eat ice cream.*",
  ),
  prerequisites: ["should-and-must", "joining-with-and-but-or"],
  encompasses: [
    { topic: "should-and-must", weight: 0.5 },
    { topic: "joining-with-and-but-or", weight: 0.2 },
  ],
  xp: 20,
  strand: "writing",
  knowledgePoints: [
    point(
      "advice",
      t("Writing advice", "写出建议"),
      t(
        "Start with a pronoun for the person: *Tom* → *He*, *Anna* → *She*, *my parents* → *They*. Then *should* and the plain verb from the note:\n\n*Tom has a headache. (drink some water)* → *He should drink some water.*\n\n> **Watch out.** Do not drop the subject (*Should drink water* is wrong) and do not insert *to* after *should*.",
        "先用代词指这个人：*Tom* → *He*，*Anna* → *She*，*my parents* → *They*。然后写 *should* 和提示里的动词原形：\n\n*Tom has a headache. (drink some water)* → *He should drink some water.*\n\n> **注意。** 英语句子不能像中文“应该多喝水”那样省主语，也不要在 *should* 后面多加 *to*。",
      ),
      typedGenerator("sentence", t("Write a sentence of advice.", "写一句建议。"), adviceBank, (right, shown) =>
        t(
          `Advice starts with a pronoun for the person (${adviceWho(shown, right)}), then *should* and the plain verb from the note, with no *to*: ${right}\n\n**Check.** Verify all three parts: the matching pronoun at the start, *should* + plain verb (no *to*), and a period at the end.`,
          `建议以指这个人的代词开头（${adviceWho(shown, right)}），再写 *should* 和提示里的动词原形，不加 *to*：${right}\n\n**检验。** 核对三处：句首代词与人物对应、*should* 后接不带 *to* 的动词原形、句末有句号。`,
        ),
      ),
    ),
    point(
      "not",
      t("What not to do", "不该做的事"),
      t(
        "For something that is a bad idea, write *shouldn't* (*should not*) and the plain verb: *He shouldn't watch TV.*\n\n> **Watch out.** Never put *don't* or *doesn't* in front of *should* (*He don't should* is wrong), and never add *to* after *shouldn't*.",
        "表示不该做的事，用 *shouldn't*（*should not*）加动词原形：*He shouldn't watch TV.*\n\n> **注意。** 不要在 *should* 前面加 *don't* 或 *doesn't*（*He don't should* 是错的），也不要在 *shouldn't* 后面加 *to*。",
      ),
      typedGenerator("sentence-pattern", t("Write a sentence of advice.", "写一句建议。"), notBank, (right, shown) =>
        t(
          `The note says *not*, so after the pronoun (${adviceWho(shown, right)}) write *shouldn't* and the plain verb; *should* never takes *don't*: ${right}\n\n**Check.** Confirm the order: pronoun + *shouldn't* (or *should not*) + plain verb, with no *don't* and no *to*.`,
          `提示里有 *not*，所以在代词（${adviceWho(shown, right)}）后面写 *shouldn't* 和动词原形；*should* 从不与 *don't* 连用：${right}\n\n**检验。** 确认语序：代词 + *shouldn't*（或 *should not*）+ 动词原形，没有 *don't* 也没有 *to*。`,
        ),
      ),
    ),
    point(
      "two",
      t("Two pieces of advice", "两条建议"),
      t(
        "Join two pieces of advice with *and*. *Should* is written once, and both verbs are plain: *She should stay in bed and take some medicine.*\n\n> **Watch out.** Join the two actions with *and* (not a bare comma) and keep the second verb plain without *to*.",
        "用 *and* 连接两条建议。*should* 只写一次，两个动词都用原形：*She should stay in bed and take some medicine.*\n\n> **注意。** 两条建议之间用 *and* 连接（不要只用逗号），第二个动词同样用原形，前面不加 *to*。",
      ),
      typedGenerator(
        "sentence-pattern",
        t("Write one sentence with both pieces of advice.", "把两条建议写成一个句子。"),
        twoBank,
        (right) =>
          t(
            `*Should* is written once, and *and* joins the two plain verbs after it, with no *to* before the second: ${right}\n\n**Check.** Read both actions after *should*: they are linked by *and*, and neither verb has *to* or *-s*.`,
            `*should* 只写一次，用 *and* 连接后面两个动词原形，第二个动词前不加 *to*：${right}\n\n**检验。** 读一遍 *should* 后面的两个动作：中间用 *and* 连接，两个动词都没有 *to* 或 *-s*。`,
          ),
      ),
    ),
  ],
};

/** topics are the topics of the unit Health and the Body. */
export const topics: readonly TopicDef[] = [
  health.topic,
  body2.topic,
  stayingWell.topic,
  atTheDoctor.topic,
  shouldAndMust,
  haveTo,
  writingAdvice,
];

/** shortForms are the short forms of should and must that the topic teaches. */
const shortForms: WordBatch = { topic: "should-and-must", words: ["shouldn't", "mustn't"] };

/** vocabulary are the words the unit Health and the Body teaches. */
export const vocabulary: readonly WordBatch[] = [health.batch, body2.batch, stayingWell.batch, atTheDoctor.batch, shortForms];
