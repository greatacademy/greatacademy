// B1, everyday words: words so common that passages of every theme need them, taught in an extra batch beside the
// units; the course places it in the unit whose passages first need it.

import type { TopicDef } from "@ga/content";
import { t } from "@ga/content";
import type { WordBatch } from "../../pack.ts";
import { vocabularyTopic, word } from "../words.ts";

const common = vocabularyTopic({
  id: "b1-words-common-words",
  title: t("Common Words", "常用词"),
  summary: t(
    "Experts; complete, similar, common, strange and ordinary; hardly; humans, beings and feelings; cases; acting, behaving and recognizing.",
    "专家；完全、相似、常见、奇怪和普通；几乎不；人类、生物和感情；情况；行动、表现和认出。",
  ),
  intro: t(
    "It was an **ordinary** Monday until I heard a **strange** noise; I could **hardly** believe it, but an **expert** later said such cases are quite **common**. These words appear in stories and articles on every subject, so you will meet them everywhere.",
    "那本是个 **ordinary**（普通的）星期一，直到我听见一个 **strange**（奇怪的）声音；我 **hardly**（几乎不）敢相信，但后来一位 **expert**（专家）说这种情况相当 **common**（常见的）。这些词出现在各种主题的故事和文章里，到处都会碰到。",
  ),
  prerequisites: ["a2-words-everyday-ideas"],
  words: [
    word(
      "expert experts",
      "a person who knows a lot about a subject",
      "专家",
      "She knows everything about Chinese history: she is the best {expert} in our city. | Ask a car {expert} before you buy a used car; he knows what to check. | Health {experts} who have studied the body for years say that we should drink more water.|beginners strangers",
      "beginner stranger",
    ),
    word(
      "completely",
      "in every way; totally",
      "完全地",
      "I {completely} forgot your birthday; I didn't remember it at all. | The town has changed {completely} since I was a child: nothing is the same. | Make sure the paint is {completely} dry, with no wet spots at all, before you touch it.",
      "hardly nearly",
    ),
    word(
      "similar",
      "almost the same, but not exactly",
      "相似的；类似的",
      "My sister and I have {similar} tastes in music: we both like almost the same songs. | Your bag is very {similar} to mine; I almost took it by mistake. | We had a {similar} problem last year, almost exactly the same as this one.",
      "different strange",
    ),
    word(
      "common",
      "happening often, or found in many places",
      "常见的；普遍的",
      "Wang is a very {common} name in China: millions of people have it. | Colds are {common} in winter, and many people catch one. | It's {common} for teenagers to feel tired in the morning; most of them do.",
      "strange rare",
      "ordinary",
    ),
    word(
      "strange",
      "unusual or surprising, in a way that is hard to understand",
      "奇怪的",
      "The noise I heard in the kitchen last night was {strange}: I had never heard anything like it. | It's {strange} that he didn't call. He always calls. | My dream last night was {strange}: I was a fish, flying over the moon!",
      "common ordinary",
    ),
    word(
      "ordinary",
      "normal, not special or different",
      "普通的；平常的",
      "Until the phone rang, the day was completely {ordinary}: nothing special happened. | The hero of the film is a teenager who is {ordinary} in every way, just like you and me. | Their house is {ordinary}, just like every other house on the street.",
      "strange special",
      "common",
    ),
    word(
      "hardly",
      "almost not",
      "几乎不",
      "I can {hardly} hear you. Can you speak louder? | We {hardly} ever go to the cinema now. | She was so tired that she could {hardly} walk.",
      "completely nearly",
    ),
    word(
      "being beings",
      "a living person or creature",
      "生物；人",
      "A human {being} can live for weeks without food, but not without water. | The film is about strange {beings} from another planet.|feelings experts | Every living {being} needs water.",
      "feeling expert",
    ),
    word(
      "feelings",
      "the things that you feel in your mind, such as being happy, sad or angry",
      "感情；感受",
      "I didn't mean to hurt your {feelings}. | It's healthy to talk about your {feelings}, such as anger or sadness. | He finds it hard to show his {feelings}; he never cries or laughs.",
      "beings cases",
    ),
    word(
      "act acts acted acting",
      "to do something, especially to deal with a problem; to behave in a certain way",
      "行动；表现",
      "We must {act} now to save the forest. | He {acted} as if nothing had happened.|recognized waited | The firefighters {acted} quickly and saved the family.|recognized waited",
      "recognize wait",
      "behave",
    ),
    word(
      "behave behaves behaved behaving",
      "to do and say things in a certain way; to be polite and good",
      "表现；守规矩",
      "The children {behaved} very well at the restaurant.|recognized believed | Please {behave} yourself at Grandma's house. | Why is he {behaving} so strangely today, shouting and running around?|recognizing believing",
      "recognize believe",
      "act",
    ),
    word(
      "recognize recognizes recognized recognizing",
      "to know someone or something because you have seen or heard them before",
      "认出；识别",
      "I didn't {recognize} you with your new haircut! | Do you {recognize} this song? You heard it on the radio last week. | The phone {recognizes} my face and unlocks itself.|realizes forgets",
      "realize forget",
    ),
    word(
      "human humans",
      "of people; a person, not an animal or a machine",
      "人的；人类",
      "Dogs can hear sounds that we {humans} cannot hear with our ears.|animals machines | {Humans} are the only animals that can read and write.|Animals Machines | Robots now do many factory jobs that {humans} once did with their own hands.|animals machines",
      "animal machine",
    ),
    word(
      "case cases",
      "a situation or an example of something; a crime the police work on; a box for keeping things in",
      "情况；病例；案件；盒子",
      "In that {case}, we'll stay at home. | There were three {cases} of the illness at school this week.|beings feelings | Take an umbrella in {case} it rains. | The police are still working on the {case}.",
      "being feeling",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Hardly* and *completely* are opposites: *hardly* means almost not, and *completely* means in every way. Ask whether the sentence says almost nothing happened or all of it did.",
        "*hardly* 和 *completely* 意思相反：*hardly* 是几乎不，*completely* 是完全。想想句子说的是几乎没发生，还是全部发生了。",
      ),
      meaning: t(
        "*Act* and *behave* are close: *act* is to do something about a problem, and *behave* is the way you do and say things, good or bad. Check whether the meaning says doing something or the way you are.",
        "*act* 和 *behave* 很接近：*act* 是针对问题采取行动，*behave* 是言行举止的样子，好或坏。看清释义说的是采取行动，还是表现得怎样。",
      ),
      spell: t(
        "*Recognize* has og in the middle, rec-**og**-nize, where many learners leave out the g, and *completely* keeps the e of *complete* before -ly.",
        "*recognize* 中间是 og：rec-**og**-nize，很多人会漏掉 g；*completely* 在 -ly 前保留了 *complete* 的 e。",
      ),
    },
    notes: `
      expert|the best person on Chinese history in a city;someone who knows what to check on a used car;health people who have studied the body for years|an expert knows a lot about a subject; a beginner has only just started|expert 对某领域非常了解；beginner 是刚入门的人|beginner/beginners=beginner has only just started to learn something, not someone who knows the most about it=beginner 是刚开始学的人，不是最懂行的人;stranger/strangers=stranger is a person you do not know, not someone who knows a lot about a subject=stranger 是你不认识的人，不是精通某领域的人|ex · pert|ex- + pert, with er said like *ur*|ex- 加 pert，er 读作 *ur*
      completely|not remembering a birthday at all;a town where nothing is the same;paint with no wet spots at all|completely means in every way; hardly means almost not|completely 是完全；hardly 是几乎不|hardly=hardly means almost not, the opposite of in every way=hardly 是几乎不，正好和完全相反;nearly=nearly means almost but not all the way, not in every way=nearly 是差一点、不是全部，不是完全|com · plete · ly|complete keeps its e before -ly|complete 加 -ly 时保留 e
      similar|sisters liking almost the same songs;a bag almost taken by mistake;a problem almost exactly the same as this one|similar means almost the same; different means not the same|similar 是相似；different 是不同|different=different means not the same, the opposite of almost the same=different 是不一样，正好和几乎一样相反;strange=strange means unusual and hard to understand, not almost the same as something=strange 是奇怪难懂，不是和某物几乎一样|sim · i · lar|one m and one l, and -ar at the end|一个 m、一个 l，结尾是 -ar
      common|a name millions of people have;colds that many people catch in winter;something most teenagers feel|common means happening often or found in many places; rare means happening very little|common 是常见；rare 是罕见|strange=strange means unusual and surprising, the opposite of happening often=strange 是奇怪少见，正好和常见相反;rare=rare means not happening or found often, the opposite of something millions of people have=rare 是罕见，正好和很多人都有相反|com · mon|the double m|双写 m
      strange|a noise never heard before;a friend who always calls but didn't;a fish flying over the moon in a dream|strange means unusual and hard to understand; ordinary means normal|strange 是奇怪难懂；ordinary 是平常的|common=common means happening often, not something you have never met before=common 是常见的，不是从没遇到过的;ordinary=ordinary means normal and not special, not surprising or hard to understand=ordinary 是普通平常，不是令人惊讶或难以理解|strange|a-n-g-e said like *ain-j*|ange 读作 *ain-j*
      ordinary|a day where nothing special happened;a teenager just like you and me;a house like every other one on the street|ordinary means normal and not special; strange means unusual|ordinary 是普通的；strange 是奇怪的|strange=strange means unusual and surprising, not just like everyone else=strange 是奇怪少见，不是和别人一样;special=special means different from the others and better, not like every other one=special 是与众不同、更好，不是和别的都一样|or · di · nar · y|-ary at the end, not -ery|结尾是 -ary，不是 -ery
      hardly|a voice too quiet to hear;almost never going to the cinema;being too tired to walk|hardly means almost not; hard means difficult or with effort|hardly 是几乎不；hard 是困难或用力|completely=completely means in every way, the opposite of almost not=completely 是完全，正好和几乎不相反;nearly=nearly means almost, not almost not=nearly 是几乎做到，不是几乎没有|hard · ly|hard + -ly, but the meaning is almost not|hard 加 -ly，但意思是几乎不
      being|a human living weeks without food;strange creatures from another planet;every living thing needing water|a being is a living person or creature; a feeling is something you feel inside|being 是活着的人或生物；feeling 是内心的感受|feeling/feelings=feeling is something you feel inside, such as anger, not a living person or creature=feeling 是内心的感受，比如愤怒，不是活着的人或生物;expert/experts=expert is a person who knows a lot about one subject, not any living creature=expert 是精通某领域的人，不是泛指任何生物|be · ing|be + -ing|be 加 -ing
      feelings|hurting someone without meaning to;anger or sadness to talk about;never crying or laughing|feelings are what you feel inside; beings are living creatures|feelings 是内心的感受；beings 是生物|beings=beings are living people or creatures, not what you feel inside=beings 是活着的人或生物，不是内心的感受;cases=cases are situations or examples, not anger, sadness or joy inside you=cases 是情况或例子，不是你心中的愤怒、悲伤或快乐|feel · ings|ee said long, and -ings at the end|ee 读长音，结尾是 -ings
      act|acting now to save a forest;pretending nothing had happened;firefighters saving a family quickly|to act is to do something about a problem; to behave is the way you do things|act 是采取行动；behave 是表现的样子|recognize/recognized=recognize means to know someone you have seen before, not to do something about a problem=recognize 是认出见过的人，不是针对问题采取行动;wait/waited=wait means to do nothing until something happens, the opposite of acting quickly=wait 是什么也不做地等着，正好和迅速行动相反|act|short a, and ct at the end|短元音 a，结尾是 ct
      behave|children at a restaurant;being good at Grandma's house;shouting and running around|to behave is the way you do and say things; to act is to do something about a problem|behave 是言行举止；act 是采取行动|recognize/recognized/recognizing=recognize means to know someone you have seen before, not the way you do and say things=recognize 是认出见过的人，不是言行举止;believe/believed/believing=believe means to feel sure something is true, not the way you do and say things=believe 是相信某事是真的，不是言行举止|be · have|a-e says its name: be-**have**, not like *have*|a-e 读字母本音：be-**have**，读音和 *have* 不同
      recognize|a new haircut;a song heard on the radio last week;a phone unlocking with a face|to recognize is to know something you have seen or heard before; to realize is to understand something for the first time|recognize 是认出见过或听过的东西；realize 是第一次明白某事|realize/realizes=realize means to understand something new, not to know a face or a song from before=realize 是明白新的事情，不是认出以前见过的脸或听过的歌;forget/forgets=forget means not to remember, the opposite of knowing something again=forget 是忘记，正好和再次认出相反|rec · og · nize|og in the middle and -ize at the end|中间是 og，结尾是 -ize
      human|sounds we cannot hear with our ears;the only animals that can read and write;factory jobs once done by hand|a human is a person; an animal is any living creature that is not a person|human 是人；animal 是人以外的动物|animal/animals=animal is a living creature such as a dog, not a person who reads, writes and works with hands=animal 是狗之类的动物，不是会读写、用手工作的人;machine/machines=machine is a thing made by people, not a living person=machine 是人造的机器，不是活着的人|hu · man|-man at the end, but the plural is *humans*|结尾是 -man，复数却是 *humans*
      case|staying at home in that situation;three examples of an illness at school;an umbrella in case of rain;police still working on a crime|a case is a situation, an example or a crime; a being is a living creature|case 是情况、病例或案件；being 是生物|being/beings=being is a living person or creature, not a situation, an example or a crime=being 是人或生物，不是情况、病例或案件;feeling/feelings=feeling is something you feel inside, not a situation or a crime=feeling 是内心的感受，不是情况或案件|case|s said like s, not z: ca-**s**e|s 读 s，不读 z
    `,
  },
});

/** topics are the topics of the B1 everyday words. */
export const topics: readonly TopicDef[] = [common.topic];

/** vocabulary are the words of the B1 everyday words. */
export const vocabulary: readonly WordBatch[] = [common.batch];
