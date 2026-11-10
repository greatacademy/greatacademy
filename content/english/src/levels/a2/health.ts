// A2, unit 2: Health and the Body. Feeling ill, more of the body, staying well and the doctor; should, must and have
// to; advice written by rules.

import { type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { interleave, pairUp, vocabularyTopic, word } from "../words.ts";
import { combos } from "./kit.ts";

const health = vocabularyTopic({
  id: "a2-words-health",
  title: t("Feeling Ill", "生病"),
  summary: t(
    "Health, being ill, pains and aches, coughs and fevers, medicine and the dentist.",
    "健康、生病、疼痛、咳嗽和发烧、药和牙医。",
  ),
  prerequisites: ["pre-a1-words-body"],
  words: [
    word(
      "health",
      "how well your body and mind are",
      "健康",
      "Smoking is bad for your {health}.|pain fever | Fruit and vegetables are good for your {health}.|pain cough | My grandpa is in good {health} for his age.|pain medicine",
      "pain fever",
    ),
    word(
      "healthy healthier healthiest",
      "well and strong, not ill; good for your body",
      "健康的",
      "Eat {healthy} food like fruit and vegetables.|ill hurt | My dog is old, but he is very {healthy}.|ill hurt | Swimming keeps you {healthy}.|ill hurt",
      "ill hurt",
    ),
    word(
      "ill",
      "not well; having something wrong with your body",
      "生病的",
      "Tom isn't at school today. He's {ill}.|healthy pain | I felt {ill}, so I went to bed.|healthy pain | She was {ill} for a week with a bad cough.|healthy pain",
      "healthy pain",
    ),
    word(
      "pain pains",
      "the feeling you have when part of your body hurts",
      "疼痛",
      "I have a {pain} in my leg.|health medicine | The medicine stopped the {pain}.|health dentist | He cried out in {pain} when he fell.|health medicine",
      "health medicine",
    ),
    word(
      "headache headaches",
      "a pain in your head",
      "头痛",
      "I have a {headache}. The music is too loud.|toothache stomach | Too much screen time gives me a {headache}.|toothache fever | My {headache} went away after I slept.|toothache dentist",
      "toothache stomach",
    ),
    word(
      "toothache toothaches",
      "a pain in a tooth",
      "牙痛",
      "I have a {toothache}, so I'm going to the dentist.|headache fever | Too many sweets can give you a {toothache}.|fever cough | My {toothache} stopped after the dentist fixed my tooth.|headache cough",
      "headache fever",
    ),
    word(
      "stomach stomachs",
      "the part inside your body where food goes after you eat it",
      "胃；肚子",
      "I ate too much, and now my {stomach} hurts.|headache medicine | Don't swim on a full {stomach}.|headache fever | My {stomach} is making noises. I'm hungry!|headache fever",
      "headache medicine",
    ),
    word(
      "cough coughs coughed coughing",
      "to push air out of your throat with a sudden noise; the noise or the illness",
      "咳嗽",
      "Cover your mouth when you {cough}.|hurt ill | She {coughed} all night and couldn't sleep.|ill healthy | Smoke makes me {cough}.|pain healthy",
      "hurt ill",
    ),
    word(
      "fever fevers",
      "a body temperature that is higher than normal",
      "发烧",
      "Her head is very hot. She has a {fever}.|cough toothache | When I had a {fever}, I felt hot and then cold.|cough toothache | Take this medicine if you have a high {fever}.|cough toothache",
      "cough toothache",
    ),
    word(
      "medicine medicines",
      "something you take to get better when you are ill",
      "药",
      "Take this {medicine} three times a day.|dentist pain | The {medicine} tastes bad, but it works.|dentist pain | Keep {medicine} away from small children.|dentist pain",
      "dentist pain",
    ),
    word(
      "dentist dentists",
      "a doctor for your teeth",
      "牙医",
      "I go to the {dentist} twice a year.|medicine fever | The {dentist} looked at my teeth.|medicine fever | My uncle is a {dentist}, so he always tells me to brush my teeth.|medicine fever",
      "medicine fever",
    ),
    word(
      "hurt hurts hurting",
      "to give pain; to feel pain",
      "疼；伤害",
      "My leg {hurts}. I can't walk.|coughs ills | Ouch! That {hurt}!|cough ill | I fell off my bike and {hurt} my arm.|coughed ill",
      "cough ill",
    ),
  ],
});

const body2 = vocabularyTopic({
  id: "a2-words-body-2",
  title: t("More of the Body", "身体部位（二）"),
  summary: t(
    "The neck, shoulders, knees, fingers, toes and teeth, and the heart, skin, blood, bones and throat.",
    "脖子、肩膀、膝盖、手指、脚趾和牙齿，以及心脏、皮肤、血液、骨头和喉咙。",
  ),
  prerequisites: ["a2-words-health"],
  words: [
    word(
      "neck necks",
      "the part of the body between the head and the shoulders",
      "脖子",
      "A giraffe has a long {neck}.|knee toe | She wore a scarf around her {neck}.|knee finger | I can't turn my head. My {neck} hurts.|knee toe",
      "knee toe",
    ),
    word(
      "shoulder shoulders",
      "the part where your arm joins your body",
      "肩膀",
      "She carried her bag on her {shoulder}.|toe knee | The baby is sleeping on Dad's {shoulder}.|knee toe | He put his hand on my {shoulder}.|toe tooth",
      "toe knee",
    ),
    word(
      "knee knees",
      "the middle part of your leg, where it bends",
      "膝盖",
      "Sit down and bend your {knees}.|necks teeth | I fell off my bike and cut my {knee}.|tooth blood | The water came up to my {knees}.|teeth fingers",
      "neck tooth",
    ),
    word(
      "finger fingers",
      "one of the five long parts at the end of your hand",
      "手指",
      "I have five {fingers} on each hand.|toes knees | She wears a ring on her {finger}.|knee shoulder | Don't point your {finger} at people.|toe knee",
      "toe knee",
    ),
    word(
      "toe toes",
      "one of the five small parts at the end of your foot",
      "脚趾",
      "I have ten {toes} on my feet.|fingers knees | Ouch! Someone stood on my {toe}!|neck shoulder | Stand on your {toes} to reach the top shelf.|fingers knees",
      "finger knee",
    ),
    word(
      "tooth teeth",
      "one of the hard white things in your mouth that you bite with",
      "牙齿",
      "Brush your {teeth} twice a day.|bones skins | The baby has her first {tooth}.|bone finger | I broke a {tooth} on a hard sweet.|knee neck",
      "bone finger",
    ),
    word(
      "heart hearts",
      "the part inside your chest that pushes blood around your body",
      "心脏",
      "Your {heart} beats faster when you run.|bone skin | Running is good for your {heart}.|toe tooth | My {heart} was beating fast before the test.|blood bone",
      "bone skin",
    ),
    word(
      "skin",
      "the outside cover of your body",
      "皮肤",
      "Wear a hat to keep the sun off your {skin}.|blood bone | Babies have soft {skin}.|blood bone | Snakes change their {skin}.|blood bone",
      "blood bone",
    ),
    word(
      "blood",
      "the red liquid that moves around your body",
      "血",
      "My knee is cut, and there is {blood} on my leg.|skin bone | The heart pushes {blood} around the body.|skin bone | The nurse took some {blood} from my arm.|skin bone",
      "skin bone",
    ),
    word(
      "bone bones",
      "one of the hard white parts inside your body",
      "骨头",
      "The dog is eating a {bone}.|skin heart | Milk is good for your {bones}.|throats necks | He fell and broke a {bone} in his arm.|skin heart",
      "skin heart",
    ),
    word(
      "throat throats",
      "the inside of your neck, where food and air go down",
      "喉咙",
      "I have a sore {throat}, so I can't sing.|knee toe | Drink warm water for your {throat}.|knee toe | The cold drink hurt my {throat}.|knee toe",
      "knee toe",
    ),
  ],
});

const stayingWell = vocabularyTopic({
  id: "a2-words-staying-well",
  title: t("Staying Well", "保持健康"),
  summary: t(
    "Exercise, diet, habits and advice, being fit, strong or weak, careful, and accidents.",
    "锻炼、饮食、习惯和建议，健壮、强壮或虚弱，小心和事故。",
  ),
  prerequisites: ["a2-words-body-2"],
  words: [
    word(
      "exercise exercises exercised exercising",
      "to move your body to stay healthy; movement like this",
      "锻炼",
      "I {exercise} every morning before school.|diet habit | Swimming is good {exercise}.|advice accident | Dogs need {exercise} every day.|advice accident",
      "diet habit",
    ),
    word(
      "diet diets",
      "the food you usually eat",
      "饮食",
      "A healthy {diet} has lots of fruit and vegetables.|exercise habit | Grandpa is on a {diet}. He can't eat sweets.|habit accident | Rice is part of our {diet}.|exercise accident",
      "exercise habit",
    ),
    word(
      "fit fitter fittest",
      "healthy and strong, because you exercise",
      "健康的；健壮的",
      "My aunt runs every day, so she is very {fit}.|weak careful | I want to get {fit}, so I go swimming.|weak careful | Footballers have to be {fit}.|weak careful",
      "weak careful",
      "strong",
    ),
    word(
      "strong stronger strongest",
      "having a lot of power in your body",
      "强壮的",
      "He's {strong}. He can lift a big box.|weak careful | Milk makes your bones {strong}.|weak careful | Ants are small but very {strong}.|weak careful",
      "weak careful",
      "fit",
    ),
    word(
      "weak weaker weakest",
      "not strong",
      "虚弱的",
      "After the fever, I felt {weak}.|strong fit | After a week in bed, his legs were {weak}.|strong fit | The baby bird is too {weak} to fly.|strong fit",
      "strong fit",
    ),
    word(
      "habit habits",
      "something you do often, almost without thinking",
      "习惯",
      "Brushing your teeth is a good {habit}.|accident matter | Eating late at night is a bad {habit}.|accident exercise | Biting your nails is a bad {habit}.|diet accident",
      "accident advice",
    ),
    word(
      "should",
      "a word that gives advice: it is a good idea to",
      "应该",
      "You look tired. You {should} go to bed.|careful matter | You {should} drink more water.|careful matter | {Should} I call a doctor?|Careful Matter",
      "careful matter",
    ),
    word(
      "matter matters mattered mattering",
      "to be important; a problem",
      "要紧；问题",
      "What's the {matter}? You look sad.|advice habit | It doesn't {matter}. We can try again.|advice habit | Does it {matter} if I'm late?|advice diet",
      "advice habit",
    ),
    word(
      "advice",
      "words that tell someone what you think they should do",
      "建议",
      "Can you give me some {advice}?|matter accident | My doctor's {advice} was to rest.|accident matter | Thanks for your {advice}. I'll try it.|accident habit",
      "accident habit",
    ),
    word(
      "careful",
      "thinking about what you are doing so nothing bad happens",
      "小心的",
      "Be {careful}! The road is busy.|weak fit | {Careful}! The floor is wet.|Weak Fit | Please be {careful} with that glass.|weak fit",
      "weak fit",
    ),
    word(
      "accident accidents",
      "something bad that happens and hurts someone or breaks something",
      "事故；意外",
      "He had a bike {accident} and broke his arm.|advice habit | Sorry, I broke your cup. It was an {accident}.|advice habit | There was a car {accident} on our street.|habit advice",
      "advice habit",
    ),
  ],
});

const atTheDoctor = vocabularyTopic({
  id: "a2-words-at-the-doctor",
  title: t("At the Doctor", "看医生"),
  summary: t(
    "Appointments, problems, temperatures, pills, pharmacies, ambulances, emergencies and patients; checking and worrying.",
    "预约、问题、体温、药片、药店、救护车、紧急情况和病人；检查和担心。",
  ),
  prerequisites: ["a2-words-staying-well"],
  words: [
    word(
      "appointment appointments",
      "a time you agree to see someone, like a doctor",
      "预约",
      "I have an {appointment} with the dentist at three.|emergency ambulance | Call the clinic to make an {appointment}.|emergency ambulance | I'm sorry I'm late for my {appointment}.|pharmacy patient",
      "emergency ambulance",
    ),
    word(
      "problem problems",
      "something that is wrong and needs to be fixed",
      "问题",
      "What's the {problem}? — My ear hurts.|patient pill | There's a {problem} with my computer.|patient pill | No {problem}! I'm happy to help.|patient pill",
      "patient pill",
    ),
    word(
      "temperature temperatures",
      "how hot or cold something is",
      "温度；体温",
      "The nurse took my {temperature}. It was 38 degrees.|problem pill | The {temperature} today is 25 degrees.|problem patient | Your {temperature} is normal, so you don't have a fever.|patient pill",
      "problem pill",
    ),
    word(
      "pill pills",
      "a small round piece of medicine that you take with water",
      "药片",
      "Take two {pills} after each meal.|patients ambulances | This {pill} will help your headache.|patient ambulance | Take one {pill} with water before bed.|patient ambulance",
      "patient ambulance",
    ),
    word(
      "pharmacy pharmacies",
      "a shop where you can buy medicine",
      "药店",
      "You can buy this medicine at the {pharmacy}.|ambulance appointment | The {pharmacy} is next to the bank.|ambulance appointment | Is there a {pharmacy} near here? I need some pills.|ambulance patient",
      "ambulance appointment",
    ),
    word(
      "ambulance ambulances",
      "a car that takes ill or hurt people to hospital fast",
      "救护车",
      "Call an {ambulance}! He's hurt!|appointment pharmacy | The {ambulance} took her to the hospital.|pharmacy patient | We heard an {ambulance} on the street.|appointment patient",
      "appointment pharmacy",
    ),
    word(
      "emergency emergencies",
      "a dangerous time when you need help fast",
      "紧急情况",
      "In an {emergency}, call 120.|appointment pharmacy | This is an {emergency}! Please help!|appointment pill | Only use this door in an {emergency}.|appointment problem",
      "appointment pharmacy",
    ),
    word(
      "patient patients",
      "a person who a doctor or nurse is looking after",
      "病人",
      "The doctor sees thirty {patients} a day.|pills pharmacies | The nurse is talking to a {patient}.|pill pharmacy | Hospital {patients} must rest a lot.|pills pharmacies",
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
      "Are you {serious}? You want to run 50 km?|terrible patient | It's only a cold, nothing {serious}.|patient careful | Is the problem {serious}? — No, you'll be fine in two days.|patient emergency",
      "patient careful",
    ),
    word(
      "terrible",
      "very bad",
      "糟糕的；可怕的",
      "The food was {terrible}. I didn't eat it.|serious patient | I had a {terrible} night. I couldn't sleep.|serious patient | What {terrible} weather! It's raining again.|serious patient",
      "serious patient",
    ),
    word(
      "worry worries worried worrying",
      "to keep thinking about problems or bad things that may happen",
      "担心",
      "Don't {worry}. Everything will be fine.|check matter | My mom {worries} when I come home late.|checks matters | I'm {worried} about my test.|checked serious",
      "check matter",
    ),
  ],
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

const modalRows = combos(77, modalSubjects, adviceActions, ["should", "must"]);

/** own is the possessive word of a subject, for the hands it washes. */
const own = (subject: string): string =>
  ({ You: "your", you: "your", We: "our", we: "our", They: "their", they: "their", She: "her", she: "her" })[subject] ?? "his";

const withOwn = (subject: string, rest: string) => rest.replace(/\byour\b/gu, own(subject));

const modalChoiceBank: readonly ChoiceItem[] = modalRows.slice(0, 40).map(([[subject], [verb, third, rest], modal]): ChoiceItem => {
  const fixed = withOwn(subject, rest);
  return [
    "",
    `${subject} ${modal} ${verb} ${fixed}.`,
    [`${subject} ${modal} to ${verb} ${fixed}.`, `${subject} ${modal} ${third} ${fixed}.`],
  ];
});

const modalFixBank: readonly TypedItem[] = modalRows.slice(40, 77).map(([[subject, single], [verb, third, rest], modal], k): TypedItem => {
  const fixed = withOwn(subject, rest);
  const shown = k % 2 === 0 || !single ? `${subject} ${modal} to ${verb} ${fixed}.` : `${subject} ${modal} ${third} ${fixed}.`;
  return { shown, accepted: [`${subject} ${modal} ${verb} ${fixed}.`], wrong: [shown] };
});

const shouldAndMust: TopicDef = {
  id: "should-and-must",
  title: t("Should and Must", "should 和 must"),
  summary: t(
    "You should rest. You must take this medicine. Should gives advice, must a rule; neither takes to after it.",
    "You should rest. You must take this medicine. should 表示建议，must 表示规定；后面都不加 to。",
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
        "*Should* gives advice: *You should rest.* (It's a good idea.) *Must* gives a rule or something very important: *You must take this medicine.*\n\nLike *can*, they never change, and the plain verb comes right after them, with no *to* and no *-s*:\n\n- *She should rest.* Not *She should to rest* or *She should rests*.\n- *He must stay at home.* Not *He musts stay*.",
        "*should* 表示建议：*You should rest.*（这样做比较好。）*must* 表示规定或非常重要的事：*You must take this medicine.*\n\n它们和 *can* 一样，形式从不变化，后面直接接动词原形，不加 *to*，也不加 *-s*：\n\n- *She should rest.* 不能说 *She should to rest* 或 *She should rests*。\n- *He must stay at home.* 不能说 *He musts stay*。\n\n中文“应该去”“必须吃”中间什么都不加，英语也一样，不要多加 *to*。",
      ),
      choiceGenerator(t("Which sentence is right?", "哪个句子是对的？"), modalChoiceBank, (right) =>
        t(right, `${right}（should / must + 动词原形）`),
      ),
    ),
    point(
      "fix",
      t("Fixing the verb after should and must", "改正 should 和 must 后的动词"),
      t(
        "Each sentence has *to* or an *-s* after *should* or *must*. Write it again with the plain verb.",
        "每个句子在 *should* 或 *must* 后面多了 *to* 或 *-s*。用动词原形重写句子。",
      ),
      typedGenerator("sentence", t("Fix the sentence.", "改正这个句子。"), modalFixBank, (right, shown) =>
        t(`${shown} → ${right}`, `${shown} → ${right}（should / must 后面直接用动词原形）`),
      ),
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
  pairUp(30, haveToSubjects, needlessContexts).map(
    ([[subject, single], [reason, rest]]): ChoiceItem => [`${reason} ${subject} ___ ${rest}.`, neg(single), ["mustn't", neg(!single)]],
  ),
  pairUp(30, haveToSubjects, forbiddenContexts).map(
    ([[subject, single], [reason, rest]]): ChoiceItem => [
      `${reason} ${subject} ___ ${withOwn(subject, rest).replace(/\b(our|their) hand\b/u, "$1 hands")}.`,
      "mustn't",
      [neg(single), neg(!single)],
    ],
  ),
]);

/** haveToRules are sentences with must to say again with have to. */
const haveToRules: readonly (readonly [subject: string, single: boolean, rest: string])[] = [
  ["Tom", true, "stay in bed"],
  ["I", false, "go to the dentist"],
  ["She", true, "wear glasses"],
  ["We", false, "be home by nine"],
  ["My mom", true, "work on Saturday"],
  ["They", false, "wear a uniform at school"],
  ["He", true, "take a pill every morning"],
  ["You", false, "show your ticket"],
  ["Lily", true, "practice the piano every day"],
  ["The children", false, "wash their hands before lunch"],
  ["My grandpa", true, "walk with a stick"],
  ["Our teacher", true, "check a lot of homework"],
  ["The nurses", false, "work at night"],
];

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

const haveTo: TopicDef = {
  id: "have-to",
  title: t("Have To and Don't Have To", "have to 和 don't have to"),
  summary: t(
    "She has to stay in bed. You don't have to come. Don't have to means it is not needed, not that it is not allowed.",
    "She has to stay in bed. You don't have to come. don't have to 表示“不必”，不是“不许”。",
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
        "*Have to* is like *must*: it is needed. But the negatives mean different things:\n\n- *don't have to*: it is **not needed**, but you can if you like. *It's Saturday, so you don't have to get up early.*\n- *mustn't*: it is **not allowed**. *The baby is sleeping, so you mustn't shout.*\n\nAfter *he*, *she* or one person: *doesn't have to*.",
        "*have to* 和 *must* 一样，表示“必须”。但它们的否定意思不同：\n\n- *don't have to*：**不必**，想做也可以。*It's Saturday, so you don't have to get up early.*\n- *mustn't*：**不许、禁止**。*The baby is sleeping, so you mustn't shout.*\n\n主语是 *he*、*she* 或单个的人时，用 *doesn't have to*。中文“不用”和“不准”很容易分清，英语里要注意别把 *don't have to* 当成“不准”。",
      ),
      choiceGenerator(t("Choose the words for the gap.", "选出填入空白处的词。"), meaningBank, (right, shown) =>
        t(
          shown.replace("___", `*${right}*`),
          `${shown.replace("___", `*${right}*`)}（${right === "mustn't" ? "mustn't 表示不许" : `${right} 表示不必`}）`,
        ),
      ),
    ),
    point(
      "write",
      t("Has to, doesn't have to, does she have to?", "has to、doesn't have to、does she have to?"),
      t(
        "*Have to* changes like any verb: *she has to*, *she doesn't have to*, *does she have to?* Not *she doesn't has to* or *has she to?*",
        "*have to* 像普通动词一样变化：*she has to*、*she doesn't have to*、*does she have to?* 不能说 *she doesn't has to*，也不能说 *has she to?*",
      ),
      typedGenerator("sentence-pattern", t("Write the sentence again.", "改写句子。"), haveToTypedBank, (right) =>
        t(right, `${right}（have to 用 do / does 构成否定和疑问）`),
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

const writingAdvice: TopicDef = {
  id: "writing-advice-with-should",
  title: t("Writing Advice", "写建议"),
  summary: t(
    "Turn a problem and a note into advice: Tom has a headache. (drink some water) becomes He should drink some water.",
    "把问题和提示写成建议：Tom has a headache. (drink some water) 写成 He should drink some water.",
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
        "Start with a pronoun for the person: *Tom* → *He*, *Anna* → *She*, *my parents* → *They*. Then *should* and the plain verb from the note:\n\n*Tom has a headache. (drink some water)* → *He should drink some water.*",
        "先用代词指这个人：*Tom* → *He*，*Anna* → *She*，*my parents* → *They*。然后写 *should* 和提示里的动词原形：\n\n*Tom has a headache. (drink some water)* → *He should drink some water.*\n\n英语句子要有主语，不能像中文“应该多喝水”那样省略。",
      ),
      typedGenerator("sentence", t("Write a sentence of advice.", "写一句建议。"), adviceBank, (right) =>
        t(right, `${right}（代词 + should + 动词原形）`),
      ),
    ),
    point(
      "not",
      t("What not to do", "不该做的事"),
      t(
        "For something that is a bad idea, write *shouldn't* (*should not*) and the plain verb: *He shouldn't watch TV.* Not *He don't should*.",
        "表示不该做的事，用 *shouldn't*（*should not*）加动词原形：*He shouldn't watch TV.* 不能说 *He don't should*。",
      ),
      typedGenerator("sentence-pattern", t("Write a sentence of advice.", "写一句建议。"), notBank, (right) =>
        t(right, `${right}（代词 + shouldn't + 动词原形）`),
      ),
    ),
    point(
      "two",
      t("Two pieces of advice", "两条建议"),
      t(
        "Join two pieces of advice with *and*. *Should* is written once, and both verbs are plain: *She should stay in bed and take some medicine.*",
        "用 *and* 连接两条建议。*should* 只写一次，两个动词都用原形：*She should stay in bed and take some medicine.*",
      ),
      typedGenerator(
        "sentence-pattern",
        t("Write one sentence with both pieces of advice.", "把两条建议写成一个句子。"),
        twoBank,
        (right) => t(right, `${right}（should + 动词原形 + and + 动词原形）`),
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

/** vocabulary are the words the unit Health and the Body teaches. */
export const vocabulary: readonly WordBatch[] = [health.batch, body2.batch, stayingWell.batch, atTheDoctor.batch];
