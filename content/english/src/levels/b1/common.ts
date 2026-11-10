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
  prerequisites: ["a2-words-everyday-ideas"],
  words: [
    word(
      "expert experts",
      "a person who knows a lot about a subject",
      "专家",
      "She is an {expert} on Chinese history.|being feeling | Ask an {expert} before you buy a used car.|being feeling | {Experts} say that we should drink more water.|Beings Feelings",
      "export exit",
    ),
    word(
      "completely",
      "in every way; totally",
      "完全地",
      "I {completely} forgot your birthday. I'm so sorry!|hardly similar | The town has changed {completely} since I was a child.|hardly common | Make sure the paint is {completely} dry before you touch it.|hardly strange",
      "complete compactly",
    ),
    word(
      "similar",
      "almost the same, but not exactly",
      "相似的；类似的",
      "My sister and I have {similar} tastes in music.|hardly completely | Your bag is {similar} to mine.|hardly completely | We had a {similar} problem last year.|completely hardly",
      "simple single",
    ),
    word(
      "common",
      "happening often, or found in many places",
      "常见的；普遍的",
      "Wang is a very {common} name in China.|hardly completely | Colds are {common} in winter.|hardly completely | It's {common} for teenagers to feel tired in the morning.|hardly completely",
      "comment commercial",
      "ordinary",
    ),
    word(
      "strange",
      "unusual or surprising, in a way that is hard to understand",
      "奇怪的",
      "I heard a {strange} noise in the kitchen last night.|completely hardly | It's {strange} that he didn't call. He always calls.|completely hardly | What a {strange} dream!|hardly completely",
      "stranger strong",
    ),
    word(
      "ordinary",
      "normal, not special or different",
      "普通的；平常的",
      "It was just an {ordinary} day until the phone rang.|completely hardly | The hero of the film is an {ordinary} teenager.|hardly completely | They live in an {ordinary} house on a quiet street.|hardly completely",
      "orderly original",
      "common",
    ),
    word(
      "hardly",
      "almost not",
      "几乎不",
      "I can {hardly} hear you. Can you speak louder?|completely similar | We {hardly} ever go to the cinema now.|completely similar | She was so tired that she could {hardly} walk.|completely similar",
      "hard harshly",
    ),
    word(
      "being beings",
      "a living person or creature",
      "生物；人",
      "A human {being} can live for weeks without food, but not without water.|feeling hardly | The film is about strange {beings} from another planet.|feelings similar | Every living {being} needs water.|feeling hardly",
      "begin bring",
    ),
    word(
      "feelings",
      "the things that you feel in your mind, such as being happy, sad or angry",
      "感情；感受",
      "I didn't mean to hurt your {feelings}.|beings hardly | It's healthy to talk about your {feelings}.|beings hardly | He finds it hard to show his {feelings}.|beings hardly",
      "fillings findings",
    ),
    word(
      "act acts acted acting",
      "to do something, especially to deal with a problem; to behave in a certain way",
      "行动；表现",
      "We must {act} now to save the forest.|recognize hardly | He {acted} as if nothing had happened.|recognized hardly | The firefighters {acted} quickly and saved the family.|recognized hardly",
      "add ask",
      "behave",
    ),
    word(
      "behave behaves behaved behaving",
      "to do and say things in a certain way; to be polite and good",
      "表现；守规矩",
      "The children {behaved} very well at the restaurant.|recognized hardly | Please {behave} yourself at Grandma's house.|recognize hardly | Why is he {behaving} so strangely today?|recognizing completely",
      "believe behind",
      "act",
    ),
    word(
      "recognize recognizes recognized recognizing",
      "to know someone or something because you have seen or heard them before",
      "认出；识别",
      "I didn't {recognize} you with your new haircut!|behave act | Do you {recognize} this song?|behave act | The phone {recognizes} my face and unlocks itself.|behaves acts",
      "remember realize",
    ),
    word(
      "human humans",
      "of people; a person, not an animal or a machine",
      "人的；人类",
      "Dogs can hear sounds that {humans} cannot hear.|feelings acts | The {human} body needs water every day.|hardly completely | Robots can do many jobs that {humans} once did.|feelings acts",
      "humid woman",
    ),
    word(
      "case cases",
      "a situation or an example of something; a crime the police work on; a box for keeping things in",
      "情况；病例；案件；盒子",
      "In that {case}, we'll stay at home.|being expert | There were three {cases} of the illness at school this week.|feelings experts | Take an umbrella in {case} it rains.|hardly being | The police are still working on the {case}.|hardly common",
      "cave cash",
    ),
  ],
});

/** topics are the topics of the B1 everyday words. */
export const topics: readonly TopicDef[] = [common.topic];

/** vocabulary are the words of the B1 everyday words. */
export const vocabulary: readonly WordBatch[] = [common.batch];
