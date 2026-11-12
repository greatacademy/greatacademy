// Grade 12: word study: the last Latin and Greek roots of the native course.

import type { TopicDef } from "@ga/content";
import { partLines, parts } from "../grade-6/kit.ts";

const latin10 = parts({
  id: "latin-roots-10",
  title: ["Latin Roots 10", "拉丁词根 10"],
  summary: [
    "Ten more Latin roots: cord, gress, plic, volv, sid, sign, dorm, jud, nunc and brev.",
    "另外十个拉丁词根：cord、gress、plic、volv、sid、sign、dorm、jud、nunc 和 brev。",
  ],
  after: ["latin-roots-9"],
  kind: ["Latin root", "拉丁词根"],
  list: partLines(`
    cord|heart|心|cordial|warm and friendly, as if from the heart|concord|agreement and harmony, with hearts together|discord|disagreement, with hearts apart
    gress|step|步|digress|to step aside from the main subject|transgress|to step across a moral or legal line|regress|to step back to an earlier, worse state
    plic|fold|折叠|implicate|to show that someone is involved, folded into a matter|explicit|stated clearly, with nothing folded away|duplicity|deceit, a doubled way of dealing with people
    volv|roll|滚动|revolve|to roll or turn around a center|evolve|to develop gradually, unrolling over time|convoluted|so twisted and rolled together that it is hard to follow
    sid|sit or settle|坐，安定|preside|to sit in charge of a meeting or a court|subside|to settle down and become less strong|dissident|a person who sits apart and openly opposes those in power
    sign|mark|标记|signify|to be a mark or sign of something|insignia|a badge or mark that shows rank or membership|designate|to mark out someone or something for a purpose
    dorm|sleep|睡|dormant|asleep or inactive for a time|dormitory|a building where students sleep|dormancy|a state of rest in which growth stops for a time
    jud|judge|判断|judicious|showing good judgment|prejudice|a judgment made before knowing the facts|adjudicate|to judge a dispute officially
    nunc|declare|宣告|denounce|to declare publicly that something is wrong|renounce|to declare that you give something up|pronouncement|a formal public statement of a decision
    brev|short|短|brevity|shortness of time, or the use of few words|abbreviate|to make a word or phrase shorter|abridge|to shorten a book or speech while keeping its sense
  `),
  explanations: [
    [
      "Ten more Latin **roots**. *Cord* means heart, *gress* step, *plic* fold, *volv* roll, *sid* sit, *sign* mark, *dorm* sleep, *jud* judge, *nunc* declare and *brev* short. A *cordial* greeting comes from the heart; a *dormant* volcano is asleep; *brevity* is shortness. Knowing the root lets you guess the meaning of a word you have never seen.",
      "另外十个拉丁**词根**。*cord* 意为心，*gress* 步，*plic* 折叠，*volv* 滚动，*sid* 坐，*sign* 标记，*dorm* 睡，*jud* 判断，*nunc* 宣告，*brev* 短。*cordial* 的问候发自内心；*dormant* 的火山处于沉睡；*brevity* 是简短。知道词根，就能猜出没见过的词的意思。",
    ],
    [
      "Prefixes steer the root. With *cord*, *con-* (together) gives **concord** and *dis-* (apart) gives **discord**. With *gress*, *di-* (aside) gives **digress**, *trans-* (across) **transgress** and *re-* (back) **regress**. With *nunc*, *de-* (down) gives **denounce**, to speak against, and *re-* (back) gives **renounce**, to give back up. Read the prefix, then the root, and put them together.",
      "前缀决定词根的方向。与 *cord* 搭配，*con-*（一起）构成 **concord**，*dis-*（分开）构成 **discord**。与 *gress* 搭配，*di-*（偏离）构成 **digress**，*trans-*（越过）构成 **transgress**，*re-*（向后）构成 **regress**。与 *nunc* 搭配，*de-*（向下）构成 **denounce**，谴责；*re-*（返回）构成 **renounce**，放弃。先读前缀，再读词根，然后把意思合起来。",
    ],
  ],
});

const greek9 = parts({
  id: "greek-roots-9",
  title: ["Greek Roots 9", "希腊词根 9"],
  summary: [
    "Ten more Greek roots: ped, agog, tax, top, tom, zo, odont, phras, stas and orama.",
    "另外十个希腊词根：ped、agog、tax、top、tom、zo、odont、phras、stas 和 orama。",
  ],
  after: ["greek-roots-8"],
  kind: ["Greek root", "希腊词根"],
  list: partLines(`
    ped|child|儿童|pediatrician|a doctor who treats children|pedagogy|the method and practice of teaching, first the teaching of children|encyclopedia|a book of all-round knowledge, once the full education of a child
    agog|lead|引导|demagogue|a leader who wins people over by stirring their feelings and prejudices|pedagogue|a teacher, especially a strict one, first a leader of children|synagogue|a Jewish house of worship, where people are led together
    tax|arrange|排列|syntax|the arrangement of words in a sentence|taxonomy|a system for arranging living things or ideas into groups|taxidermy|the arranging of an animal's skin so that it looks alive
    top|place|地方|topography|the shape and features of an area of land|utopia|an imagined perfect society, literally no place|topical|about matters of interest in a certain place and time
    tom|cut|切|anatomy|the structure of a body, learned by cutting it open|atom|the smallest unit of an element, once thought impossible to cut|dichotomy|a division into two opposed parts
    zo|animal or life|动物，生命|zoology|the study of animals|protozoa|tiny living things of one cell, the first animals|zodiac|a circle of twelve star signs, most of them named after animals
    odont|tooth|牙齿|orthodontist|a dentist who straightens teeth|periodontal|around the teeth, having to do with the gums|mastodon|a large extinct animal like an elephant, named for the shape of its teeth
    phras|speak or tell|说|paraphrase|to say again in other words|phraseology|a particular way of choosing and putting words together|periphrasis|a roundabout way of saying something
    stas|standing|站立，停止|stasis|a state in which nothing moves or changes|homeostasis|the body's way of keeping its inside steady, standing the same|metastasis|the spread of a disease from one part of the body to another
    orama|view|景象|panorama|a wide view of a whole area|diorama|a model scene with figures, seen through a window|cyclorama|a large picture on a curved wall that surrounds the viewer
  `),
  explanations: [
    [
      "Ten more Greek **roots**. *Ped* means child, *agog* lead, *tax* arrange, *top* place, *tom* cut, *zo* animal, *odont* tooth, *phras* speak, *stas* standing and *orama* view. A *pediatrician* treats children; *topography* describes a place; *zoology* studies animals; a *panorama* is a view of everything.",
      "另外十个希腊**词根**。*ped* 意为儿童，*agog* 引导，*tax* 排列，*top* 地方，*tom* 切，*zo* 动物，*odont* 牙齿，*phras* 说，*stas* 站立，*orama* 景象。*pediatrician* 给儿童看病；*topography* 描述一个地方；*zoology* 研究动物；*panorama* 是全景。",
    ],
    [
      "Greek words are often built from two roots or a prefix and a root. *Dem* (people) and *agog* give **demagogue**, a misleader of the people. *Ou* (no) and *top* give **utopia**, a place that does not exist. *Dicho* (in two) and *tom* give **dichotomy**, a cut in two. *Ortho* (straight) and *odont* give **orthodontist**, a straightener of teeth. Split the word and read each part.",
      "希腊语词常由两个词根或一个前缀加一个词根构成。*dem*（人民）加 *agog* 构成 **demagogue**，煽动民众的人。*ou*（没有）加 *top* 构成 **utopia**，并不存在的地方。*dicho*（分成两半）加 *tom* 构成 **dichotomy**，一分为二。*ortho*（直）加 *odont* 构成 **orthodontist**，矫正牙齿的医生。把词拆开，逐个读出各部分。",
    ],
  ],
});

/** wordStudyTopics12 are the word study topics of grade 12. */
export const wordStudyTopics12: readonly TopicDef[] = [latin10, greek9];
