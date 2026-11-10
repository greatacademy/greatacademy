// College writing: the reading unit of the fifth theme, style and clarity: eight original essays on writing, from
// why jargon spreads to revision as rethinking. The writers and cases they mention are invented.

import { type ReadingUnitDef, t } from "@ga/content";
import { ask, passage } from "../grades-6-8/reading-kit.ts";

const misused = { topic: "words-often-misused", weight: 0.3 } as const;
const style = { topic: "analyzing-prose-style", weight: 0.3 } as const;
const clear = { topic: "clear-sentences-characters-and-actions", weight: 0.1 } as const;

/** academic gives the edge to a batch of the shared academic words, which a passage uses as it goes. */
const academic = (n: 1 | 2 | 3) => ({ topic: `academic-words-${n}`, weight: 0.1 }) as const;

/** essaysOnWriting is a reading unit of the college writing course of essays on prose style. */
export const essaysOnWriting: ReadingUnitDef = {
  id: "essays-on-writing",
  title: t("Essays on Writing", "关于写作的随笔"),
  passages: [
    passage(
      "why-jargon-spreads",
      t("Why Jargon Spreads", "行话为何蔓延"),
      `Every profession has its own vocabulary, and much of it is useful. A doctor who says "fracture" rather than "broken bone" is not showing off; the word is more precise, and other doctors understand it at once. Specialized terms allow experts to communicate quickly and exactly with one another. The trouble begins when the vocabulary escapes its proper use, when it is used with people who do not share it, or when it is used to say things that plain words would say better. At that point it becomes jargon.

Consider a sentence from an imagined company report: "Going forward, we will leverage our core competencies to drive stakeholder value across the enterprise." A reader may peruse this sentence several times without discovering what the company plans to do. The words are not technical, in the way that "fracture" is technical. They are vague words dressed up to sound important. The plain version might be: "Next year we will focus on what we do best, so that our customers and shareholders benefit." Even this says little, which may be the point. Jargon often conceals the fact that there is nothing precise to say.

Why, then, does jargon spread? The first reason is imitation. Writers absorb the language of the documents they read. A new employee reads reports full of "leverage" and "going forward", and soon writes them too, because that is what reports in this organization sound like. Using the group's vocabulary signals that one belongs.

The second reason is caution. A vague sentence cannot easily be proved wrong. "We will improve outcomes" commits the writer to nothing measurable; "we will reduce waiting times in the clinic by half" commits the writer to a result that others can check. In organizations where mistakes are punished, jargon offers protection. It allows writers to appear active while promising little.

The third reason is status. A sentence full of abstract nouns sounds more serious, to some readers, than a sentence of short concrete words. Writers who fear being taken lightly may reach for the longer word, hoping it will lend their ideas weight. The effect is often the reverse. Ironically, the most respected writers in most fields are those who explain difficult ideas in plain language, because doing so requires genuine understanding.

The fourth reason is that jargon saves effort. It is easier to write "implement solutions to optimize performance" than to work out which solutions, what performance, and how much improvement is expected. Jargon is a kind of shorthand for thinking that has not yet been done.

What can a writer do about it? The simplest test is to imagine explaining the sentence to an intelligent friend outside the field. If the friend would ask "meaning what?", the sentence needs work. A second test is to look for the characters and actions in a sentence: who is doing what? In "the implementation of the new policy resulted in an improvement in customer satisfaction", the actions are hidden in nouns. In "when we changed the policy, customers became happier", they are visible.

None of this means that technical terms should be avoided. When a precise term exists, and the reader knows it, using it is a courtesy. The problem is not specialized vocabulary but vocabulary used to impress rather than to inform. A useful rule is to ask, for each unusual word, whether it does work that a plain word could not. If it does, keep it. If it does not, the plain word will almost always serve the reader better.`,
      [misused, style, clear, academic(2), academic(3)],
      [
        ask(
          t('Why does the author say "fracture" is not jargon when doctors use it?', "作者为什么说医生使用“fracture”一词不算行话？"),
          t("It is more precise, and other doctors understand it at once", "它更精确，而且其他医生一听就懂"),
          [
            t("It is a longer word than broken bone", "它比 broken bone 更长"),
            t("Doctors use it to impress their patients", "医生用它来让病人印象深刻"),
            t("It conceals the fact that the bone is broken", "它掩盖了骨头断了这一事实"),
          ],
          t(
            "The first paragraph says the word is more precise and other doctors understand it at once; jargon begins when vocabulary escapes its proper use.",
            "第一段说这个词更精确，其他医生能立即理解；只有当词汇脱离其恰当用途时，才变成行话。",
          ),
        ),
        ask(
          t("According to the passage, how does jargon offer protection to writers?", "根据文章，行话怎样为写作者提供保护？"),
          t(
            "A vague sentence cannot easily be proved wrong, so it commits the writer to little",
            "含糊的句子不容易被证明是错的，因此写作者几乎不用承担什么",
          ),
          [
            t("It makes documents impossible to copy", "它让文件无法被抄袭"),
            t("It shows that the writer is an expert", "它表明写作者是专家"),
            t("It makes reports shorter and quicker to read", "它让报告更短、更快读完"),
          ],
          t(
            'The passage contrasts "we will improve outcomes", which commits the writer to nothing measurable, with a specific promise others can check.',
            "文章对比了“我们将改善结果”这种无法衡量的说法和别人可以核查的具体承诺。",
          ),
        ),
        ask(
          t("What test does the author suggest for finding hidden actions in a sentence?", "作者建议用什么方法找出句子中隐藏的动作？"),
          t("Look for who is doing what, and whether the actions are hidden in nouns", "看看是谁在做什么，动作是否藏在名词里"),
          [
            t("Count the number of words in each sentence", "数一数每个句子的词数"),
            t("Replace every short word with a longer one", "把每个短词换成长词"),
            t("Remove all technical terms from the sentence", "删去句子中所有的专业术语"),
          ],
          t(
            'The passage shows the actions hidden in "the implementation... resulted in an improvement" and made visible in "when we changed the policy, customers became happier".',
            "文章展示了动作藏在名词中的句子，以及把动作用动词表达出来的改写。",
          ),
        ),
      ],
    ),
    passage(
      "plain-language-in-law",
      t("Plain Language in Law", "法律中的平实语言"),
      `Legal documents have a reputation for being unreadable, and much of the reputation is deserved. A typical lease or insurance policy is written in long sentences full of terms such as "hereinafter", "notwithstanding the foregoing" and "including but not limited to". Most people who sign such documents do not read them, and many who try do not understand them. Over the past half century, a movement for plain language in law has argued that this need not be so.

Defenders of traditional legal writing make a serious case. Legal language, they argue, has been tested over centuries. Each phrase has been interpreted by courts, and its meaning is therefore settled. A lawyer who replaces "notwithstanding the foregoing" with "despite what we said above" risks introducing a new phrase whose meaning a court has never decided. Precision in law matters enormously; a single ambiguous word can cost a client a fortune. On this view, the difficulty of legal writing is the price of its reliability.

The plain language movement accepts the need for precision but disputes the claim that traditional language provides it. Many traditional phrases, its advocates point out, are not precise at all. "Including but not limited to" says nothing that "including" does not already say. Long lists of near-synonyms, such as "give, grant, bequeath and devise", repeat one idea four times. And sentences of two hundred words, with clauses inside clauses, are a source of ambiguity rather than a protection against it: the longer the sentence, the harder it is to know which clause modifies which.

Evidence has gradually favored the reformers. In one study often described by advocates, a government rewrote a set of its legal forms in plain language and tested both versions with ordinary readers. The readers understood the plain versions far better, made fewer mistakes in filling them out, and called the government's offices for help much less often. Lawyers and judges who were given both versions, interestingly, also preferred the plain ones, and could not find cases in which the rewriting had changed the legal meaning.

What does plain legal writing look like? It uses short sentences where possible and puts the main point first. It addresses the reader directly: "you must pay the rent on the first day of each month" rather than "the lessee shall remit payment of rent on the first day of each calendar month". It uses headings and lists to organize complex material. It defines technical terms when they are needed, rather than avoiding them entirely. And it uses the active voice, so that the reader can see who must do what.

The last point is crucial. Much legal writing hides the actor. "Notice shall be given within thirty days" does not say who must give notice, or to whom. In a dispute, that omission may be exactly what the parties argue about. A plain version, "the tenant must tell the landlord in writing within thirty days", is not only clearer but more precise.

The plain language movement has not won every argument. Some legal phrases do carry meanings that are hard to express otherwise, and lawyers are right to be cautious about changing them. But the movement has shifted the burden of proof. A lawyer who writes an unreadable contract can no longer simply assume that difficulty and precision go together. Increasingly, readers, courts and some governments expect legal documents to be written for the people who must live by them.`,
      [misused, style, clear, academic(1), academic(3)],
      [
        ask(
          t(
            "What is the strongest argument made by defenders of traditional legal language?",
            "传统法律语言的维护者提出的最有力的论据是什么？",
          ),
          t("Its phrases have been interpreted by courts, so their meaning is settled", "其中的短语已被法院解释过，所以含义是确定的"),
          [
            t("Ordinary readers understand it better than plain language", "普通读者比较容易理解它"),
            t("It is shorter than plain language", "它比平实语言更简短"),
            t("Lawyers enjoy writing in old phrases", "律师喜欢用古旧的短语写作"),
          ],
          t(
            "The second paragraph says each phrase has been interpreted by courts and its meaning is settled, so a new phrase risks an undecided meaning.",
            "第二段说每个短语都经过法院解释，含义已经确定，换用新短语就可能带来未经裁定的含义。",
          ),
        ),
        ask(
          t("Why do reformers say very long legal sentences are not a protection?", "改革者为什么说法律中的长句并不能起到保护作用？"),
          t("The longer the sentence, the harder it is to know which clause modifies which", "句子越长，就越难弄清哪个从句修饰哪个成分"),
          [
            t("Courts refuse to read sentences longer than fifty words", "法院拒绝阅读超过五十个词的句子"),
            t("Long sentences cost more to print", "长句印刷成本更高"),
            t("Long sentences always use the passive voice", "长句总是使用被动语态"),
          ],
          t(
            "The third paragraph says long sentences with clauses inside clauses are a source of ambiguity rather than a protection against it.",
            "第三段说，从句套从句的长句是歧义的来源，而不是防止歧义的手段。",
          ),
        ),
        ask(
          t(
            'Why is "the tenant must tell the landlord in writing within thirty days" more precise than "notice shall be given within thirty days"?',
            "为什么“租户必须在三十天内书面通知房东”比“须在三十天内发出通知”更精确？",
          ),
          t("It names who must act and to whom, which the passive version leaves out", "它说明了谁必须行动、通知谁，而被动句省略了这些"),
          [
            t("It uses longer and more formal words", "它用了更长、更正式的词"),
            t("It gives the tenant more time to act", "它给了租户更多时间"),
            t("It avoids naming anyone in particular", "它避免点出任何具体的人"),
          ],
          t(
            "The passage says the passive version does not say who must give notice or to whom, and that omission may be exactly what parties argue about.",
            "文章说被动句没有说明谁必须发出通知、通知谁，而这种省略恰恰可能是双方争执的焦点。",
          ),
        ),
      ],
    ),
    passage(
      "the-long-sentence-and-the-short",
      t("The Long Sentence and the Short", "长句与短句"),
      `Writing advice often treats short sentences as virtuous and long ones as suspect. "Keep it short" is repeated so often that some students come to believe that every sentence over twenty words is a failure. The advice contains a truth, but it is incomplete. Good prose is not made of short sentences. It is made of sentences whose length suits what they have to say, and of variation between them.

Consider what short sentences do well. They are clear. They give weight to what they contain. They create emphasis, especially when they follow a longer one. A writer who has spent a paragraph explaining a complicated situation can end it with a short sentence, and the reader feels the conclusion land. Short sentences also suit moments of tension and action. In a story, "The door opened. No one was there." has an effect that a longer sentence describing the same events would lose.

But a paragraph made entirely of short sentences becomes tiring. It sounds mechanical, like a list of facts read aloud. More importantly, short sentences cannot easily express relationships between ideas. "The river rose. The town flooded. The government sent help." leaves the reader to infer how these events are connected. Did the town flood because the river rose? Did the government send help quickly or too late? A longer sentence can say what the short ones only imply: "When the river rose, the town flooded within hours, and the government, which had ignored warnings for years, sent help only after the damage was done."

That sentence is long, but it is not hard to read, because it is well built. Its main clause is clear, its parts follow the order of events, and each addition attaches to something the reader already holds. Long sentences become difficult not because of their length but because of their construction: when the subject is separated from its verb by many words, when the main point is buried in the middle, or when clauses pile up without a clear relation to one another.

Skilled writers use long sentences for particular purposes. A long sentence can hold a complex idea together, showing how its parts depend on one another. It can build a series that grows in force, each item adding to the last. It can create a sense of abundance, of a scene too rich to be described briefly. And it can slow a reader down, which is sometimes exactly what a writer wants.

The real skill, then, is variation. Read a page of a writer you admire and notice the length of each sentence. You will probably find long and short mixed: a long sentence that develops an idea, a short one that sums it up, a medium one that moves on. This variation creates rhythm, and rhythm affects how a reader experiences the prose, even when the reader does not notice it.

A practical exercise is to take a paragraph you have written and mark the length of every sentence. If they are all similar, revise: combine two short sentences whose ideas are related, split a long one whose parts are separate, and save the shortest sentence for the point you most want the reader to remember.

Short sentences are a tool, not a virtue. So are long ones. The writer's task is to know what each can do.`,
      [misused, style, clear, academic(2), academic(3)],
      [
        ask(
          t("According to the passage, what do short sentences do well?", "根据文章，短句擅长什么？"),
          t("They are clear and create emphasis, especially after a longer sentence", "它们清楚明了，能制造强调，尤其是在长句之后"),
          [
            t("They show how ideas are related to each other", "它们能表明观点之间的关系"),
            t("They slow the reader down", "它们能放慢读者的速度"),
            t("They create a sense of abundance", "它们能营造丰富的感觉"),
          ],
          t(
            "The second paragraph says short sentences are clear, give weight to what they contain and create emphasis, especially after a longer one.",
            "第二段说，短句清楚，能突出其内容，并能制造强调，尤其是在长句之后。",
          ),
        ),
        ask(
          t("What problem does the example about the river show?", "关于河流的例子说明了什么问题？"),
          t("Short sentences leave the reader to infer how events are connected", "短句让读者自己去推断事件之间的联系"),
          [
            t("Long sentences are always harder to read than short ones", "长句总是比短句难读"),
            t("Governments always send help too late", "政府总是太晚才派来救援"),
            t("Stories should never describe floods", "故事永远不应该描写洪水"),
          ],
          t(
            "The passage says the three short sentences leave the reader to infer the connections, while the longer version states them.",
            "文章说三个短句让读者自己推断其间联系，而长句版本把联系明确说了出来。",
          ),
        ),
        ask(
          t("According to the passage, what makes a long sentence hard to read?", "根据文章，是什么让长句难读？"),
          t(
            "Its construction, such as a subject far from its verb or a buried main point",
            "它的结构，比如主语与谓语相隔太远或要点被埋在中间",
          ),
          [
            t("Its length alone, whatever its construction", "仅仅是它的长度，与结构无关"),
            t("Following the order of events", "按照事件发生的顺序"),
            t("Attaching each part to something the reader already holds", "把每个部分都连接到读者已经知道的内容上"),
          ],
          t(
            "The fourth paragraph says long sentences become difficult not because of their length but because of their construction.",
            "第四段说，长句之所以难读，不是因为长，而是因为结构。",
          ),
        ),
      ],
    ),
    passage(
      "writing-for-a-screen",
      t("Writing for a Screen", "为屏幕写作"),
      `Most reading today happens on screens, and research on how people read online suggests that screen readers behave differently from readers of paper. Studies that track the movement of readers' eyes have found that people reading web pages often do not read in the ordinary sense at all. They scan. Their eyes move across the first lines of a page, then down the left side, picking up headings and the first words of paragraphs, and stop only when something seems relevant to what they are looking for.

This finding has led to a body of advice for writing on screens, and much of it is sound. Put the most important information first, since many readers will not reach the end. Use headings that tell readers what each section contains. Keep paragraphs short, because a long block of text on a screen looks forbidding. Begin each paragraph with its main point, so that a reader scanning the first words learns something. Use lists where the content is a list.

These principles are not new. Journalists have long written news stories with the most important facts in the first paragraph, and good technical writers have always used headings and lists. What the screen has done is to make the principles more urgent. A reader holding a printed report may persevere through a dense page out of obligation; a reader on a screen, with a hundred other pages a click away, will not.

The advice, however, can be taken too far. Some writers conclude that every text on a screen should be broken into fragments, with a heading every few lines and no paragraph longer than two sentences. This works for some purposes, such as instructions, product information or a page of answers to common questions. It works badly for others. An argument cannot be reduced to a list of points without losing the connections between them, and it is the connections that make it an argument. A text that explains why something happened needs sentences that carry the reasoning from one step to the next.

The deeper lesson is that writing for screens means writing for a particular kind of reader: one who is busy, who is often looking for something specific, and who will leave if the text does not seem worth the effort. That reader exists on paper too, but less often. A writer who keeps this reader in mind will make choices that help: a clear title, an opening that states the point, headings that work as a map. A writer who simply applies rules, breaking every paragraph in two whether or not the content allows it, will produce text that is easy to scan and hard to understand.

There is also a question of what screens do to readers. Some researchers have found that people who read long texts on screens remember and understand them slightly less well than people who read the same texts on paper, perhaps because the habit of scanning carries over into reading that requires attention. Others have found the difference shrinking as readers become more practiced. The evidence is still developing.

For students writing papers that will be read on screens, the practical conclusion is moderate. Use the tools of screen writing, such as clear headings, strong first sentences and short paragraphs, where they help the reader. But do not let them break apart reasoning that needs to be read whole. The goal of any format is the same: to make the reader's path through the text as clear as the content allows.`,
      [misused, style, clear, academic(1), academic(3)],
      [
        ask(
          t("What have studies of eye movement found about people reading web pages?", "眼动研究发现人们阅读网页时有什么特点？"),
          t("They often scan headings and first words rather than reading every line", "他们常常扫视标题和段首词语，而不是逐行阅读"),
          [
            t("They read every word more carefully than on paper", "他们比读纸质文本时更仔细地读每个词"),
            t("They always read from the end of the page", "他们总是从页面末尾开始读"),
            t("They never look at headings", "他们从不看标题"),
          ],
          t(
            "The first paragraph says readers scan: their eyes move across the first lines, then down the left side, picking up headings and first words.",
            "第一段说读者在扫读：目光扫过开头几行，再沿左侧向下，捕捉标题和段首词语。",
          ),
        ),
        ask(
          t("Why does the author say the screen has made old principles more urgent?", "作者为什么说屏幕让这些老原则变得更加紧迫？"),
          t("A screen reader has many other pages a click away and will leave more easily", "屏幕前的读者点一下就能看别的页面，更容易离开"),
          [
            t("Journalists invented the principles for screens", "记者是为屏幕发明了这些原则"),
            t("Printed reports no longer use headings", "印刷报告不再使用标题"),
            t("Screens cannot display long paragraphs", "屏幕无法显示长段落"),
          ],
          t(
            "The third paragraph says a reader of a printed report may persevere out of obligation, but a reader on a screen, with other pages a click away, will not.",
            "第三段说，读印刷报告的人可能出于义务坚持读下去，而屏幕前的读者点一下就能看其他页面，不会坚持。",
          ),
        ),
        ask(
          t("Why does the author warn against breaking every text into fragments?", "作者为什么反对把所有文本都拆成碎片？"),
          t(
            "An argument loses the connections between its points, which make it an argument",
            "论证会失去论点之间的联系，而正是这些联系构成了论证",
          ),
          [
            t("Fragments are harder to scan than long paragraphs", "碎片比长段落更难扫读"),
            t("Headings make pages load more slowly", "标题会使页面加载变慢"),
            t("Lists are never useful for instructions", "清单对说明书从来没有用"),
          ],
          t(
            "The fourth paragraph says an argument cannot be reduced to a list of points without losing its connections, and the connections make it an argument.",
            "第四段说，把论证简化成要点清单就会失去其中的联系，而正是这些联系使之成为论证。",
          ),
        ),
      ],
    ),
    passage(
      "the-passive-voice-defended",
      t("The Passive Voice Defended", "为被动语态辩护"),
      `Few rules of writing are repeated as often, or as confidently, as "avoid the passive voice". Teachers mark it in red; grammar software underlines it; style guides warn against it. Yet the passive voice appears in the work of almost every good writer, including many who warn against it. The rule, it turns out, is less a rule than a rough guide, and following it blindly can make writing worse.

First, a definition, since the term is often misunderstood. In an active sentence, the subject performs the action: "The committee rejected the proposal." In a passive sentence, the subject receives the action, and the performer either follows in a phrase beginning with "by" or disappears: "The proposal was rejected by the committee" or simply "The proposal was rejected." Many people label any weak or vague sentence passive, but a sentence such as "There were many problems" is not passive at all.

The case against the passive is real. Passive sentences are often longer than active ones. They can hide responsibility: "mistakes were made" admits error without saying who made it, which is why it is a favorite phrase of officials in trouble. And a writer who uses the passive habitually produces prose in which no one seems to do anything, in which events simply happen. Readers find such prose lifeless and hard to follow, since they must work out who did what.

But the passive has legitimate uses, and good writers rely on them. The first is when the performer of an action is unknown or unimportant. "The bridge was built in 1890" is better than "Someone built the bridge in 1890", because the builder is not the point. The second is when the writer wants to keep attention on a particular subject. In a paragraph about a patient, "She was taken to the hospital and treated for a broken arm" keeps the patient at the center, whereas "Paramedics took her to the hospital and doctors treated her" scatters attention among people the reader does not care about.

The third use concerns the flow of information. Readers follow prose most easily when each sentence begins with something they already know and ends with something new. Sometimes only the passive allows this. Suppose a paragraph has been discussing a new drug. The next sentence might read: "The drug was developed by a small team in a university laboratory." The passive puts the familiar subject, the drug, first, and the new information, the team, at the end, where it receives emphasis. The active version, "A small team in a university laboratory developed the drug", begins with something unfamiliar and ends with something the reader already knows.

Finally, some fields use the passive by convention. Scientific writing has traditionally described methods in the passive, "the samples were heated to 80 degrees", to keep attention on the procedure rather than the researcher. That convention is changing, and many journals now accept "we heated the samples", but a student writing in such a field should know what readers expect.

The useful rule, then, is not "avoid the passive" but "know why you are using it". When the passive hides who is responsible, or makes a sentence longer without reason, change it. When it keeps attention where it belongs, or puts new information where the reader expects it, keep it. The test is not the grammar of the sentence but its effect on the reader.`,
      [misused, style, clear, academic(2), academic(3)],
      [
        ask(
          t("Which of these sentences is passive, according to the passage's definition?", "根据文章的定义，下面哪个句子是被动句？"),
          t('"The proposal was rejected."', "“The proposal was rejected.”这一句"),
          [
            t('"There were many problems."', "“There were many problems.”这一句"),
            t('"The committee rejected the proposal."', "“The committee rejected the proposal.”这一句"),
            t('"We heated the samples."', "“We heated the samples.”这一句"),
          ],
          t(
            'In a passive sentence the subject receives the action; "The proposal was rejected" is passive, while "There were many problems" is not passive at all.',
            "被动句的主语是动作的承受者；“The proposal was rejected”是被动句，而“There were many problems”根本不是被动句。",
          ),
        ),
        ask(
          t(
            'Why is "mistakes were made" a favorite phrase of officials in trouble?',
            "为什么“mistakes were made”是陷入麻烦的官员最爱用的说法？",
          ),
          t("It admits error without saying who made it", "它承认了错误，却不说是谁犯的"),
          [
            t("It is shorter than the active version", "它比主动句更短"),
            t("It puts new information at the end", "它把新信息放在句末"),
            t("It is required by the rules of grammar", "这是语法规则要求的"),
          ],
          t(
            'The third paragraph says the passive can hide responsibility: "mistakes were made" admits error without saying who made it.',
            "第三段说，被动语态可以掩盖责任：“mistakes were made”承认了错误，却不说明是谁犯的。",
          ),
        ),
        ask(
          t("How can the passive help the flow of information?", "被动语态怎样有助于信息的衔接？"),
          t("It lets a sentence begin with what the reader knows and end with what is new", "它能让句子以读者已知的内容开头，以新信息结尾"),
          [
            t("It hides who performed the action", "它隐藏了动作的执行者"),
            t("It makes every sentence shorter", "它让每个句子都更短"),
            t("It removes all unfamiliar words", "它去掉所有生僻词"),
          ],
          t(
            "The passage shows that the passive puts the familiar subject, the drug, first and the new information, the team, at the end, where it receives emphasis.",
            "文章表明，被动句把已知的主语“药物”放在前面，把新信息“团队”放在句末，使其得到强调。",
          ),
        ),
      ],
    ),
    passage(
      "how-editors-read",
      t("How Editors Read", "编辑怎样阅读"),
      `A writer reads a draft knowing what it is supposed to say. An editor reads it knowing only what it actually says. That difference, simple as it sounds, explains most of what editors do, and why even skilled writers need them.

When writers reread their own work, their minds fill in what is missing. A sentence that skips a step in the reasoning seems complete, because the writer knows the step. A pronoun that could refer to two different people seems clear, because the writer knows which one is meant. A paragraph that depends on a fact mentioned forty pages earlier seems connected, because the writer has the whole book in mind. The editor, coming to the text fresh, has none of this knowledge. Where the writer sees what was intended, the editor sees what is on the page.

Experienced editors typically read a manuscript several times, each time with a different purpose. The first reading is for the whole: what is this text trying to do, for whom, and does it succeed? At this stage an editor may notice that the most interesting idea appears only in the final chapter, or that the opening promises an argument the text never delivers. These are problems of structure, and no amount of polishing sentences will fix them.

The second reading is for sections and paragraphs. Does each part do a clear job? Does each paragraph follow from the one before? Are there passages the reader could skip without losing anything? Editors often mark places where they, as readers, became confused or bored, without at first suggesting a remedy. A note such as "I lost track here" can be more useful than a rewritten sentence, because it tells the writer where the problem is and leaves the solution to the person who understands the material.

Only in later readings does the editor attend closely to sentences: wordiness, repetition, unclear references, words used incorrectly. A good editor knows, for example, that "comprise" means "consist of", so that a whole comprises its parts; that "disinterested" means impartial rather than uninterested; and that something "literally" true is not merely striking. But a good editor also knows that correcting such details in a text whose structure is broken is wasted effort, since the sentences may disappear in revision.

Throughout, the best editors are guided by a question: what is the writer trying to do? An editor who imposes a personal style, rewriting a writer's sentences into the editor's own voice, has failed, however elegant the result. The goal is to help the text become the best version of itself, not a different text. For this reason, many editors phrase their comments as questions, such as "Do you mean X or Y?" or "Could this come earlier?", which respect the writer's authority while pointing to a problem.

Writers can learn to read their own work more like editors. The most effective technique is distance: put a draft away for a few days, so that memory of the intention fades and the text can be seen as it is. Reading aloud helps, since the ear catches what the eye passes over. Reading the draft in a different form, printed rather than on screen, can have a similar effect. And it helps to read with a specific reader in mind, asking at each point what that reader knows and what they still need. None of these techniques fully replaces a second reader. But each moves the writer a little closer to seeing the page as others will see it.`,
      [misused, style, clear, academic(2)],
      [
        ask(
          t("Why do writers miss problems in their own drafts?", "写作者为什么会忽略自己初稿中的问题？"),
          t("Their minds fill in what they intended but did not write", "他们的头脑会自动补上自己想写却没写出来的内容"),
          [
            t("They read too slowly to notice errors", "他们读得太慢，注意不到错误"),
            t("They never reread what they have written", "他们从不重读自己写的东西"),
            t("They know less about the subject than editors", "他们对题目的了解不如编辑"),
          ],
          t(
            "The second paragraph says that when writers reread, their minds fill in what is missing, because they know what was intended.",
            "第二段说，写作者重读时，头脑会补上缺失的内容，因为他们知道自己本来想说什么。",
          ),
        ),
        ask(
          t("Why do editors leave sentence-level corrections for later readings?", "编辑为什么把句子层面的修改留到后几遍阅读？"),
          t("Sentences in a text with a broken structure may disappear in revision", "结构有问题的文本中的句子在修改时可能会被删掉"),
          [
            t("Sentence errors are never important", "句子错误从来都不重要"),
            t("Writers prefer to fix sentences themselves", "写作者喜欢自己修改句子"),
            t("Software corrects all sentence errors", "软件会改正所有句子错误"),
          ],
          t(
            "The passage says correcting details in a text whose structure is broken is wasted effort, since the sentences may disappear in revision.",
            "文章说，在结构有问题的文本中修改细节是白费力气，因为这些句子可能在修改中被删掉。",
          ),
        ),
        ask(
          t("Why do many editors phrase their comments as questions?", "为什么许多编辑用提问的方式写意见？"),
          t("Questions respect the writer's authority while pointing to a problem", "提问既尊重写作者的主导权，又能指出问题"),
          [
            t("Editors are not sure of their own judgment", "编辑对自己的判断没有把握"),
            t("Questions are shorter than corrections", "提问比修改更简短"),
            t("Writers are required to answer every question", "写作者必须回答每一个问题"),
          ],
          t(
            "The passage says the goal is to help the text become the best version of itself, and questions respect the writer's authority while pointing to a problem.",
            "文章说，目的是帮助文本成为最好的自己，而提问既尊重写作者的主导权，又能指出问题。",
          ),
        ),
      ],
      ["X", "Y"],
    ),
    passage(
      "writing-in-a-second-language",
      t("Writing in a Second Language", "用第二语言写作"),
      `Every year, many thousands of students arrive at universities where they must write in a language that is not their first. Many of them have studied English for years, passed demanding examinations and read widely in their fields. Yet their writing is often judged harshly, and the reasons are worth examining, both for these students and for the readers who judge them.

The most visible difficulties are at the level of the sentence: articles used or omitted where a native speaker would not, prepositions that are slightly wrong, verb forms that do not quite fit. These errors are real, and they matter, because readers notice them. But research on second-language writing suggests that they are usually not the most serious problem. Readers who are asked to judge essays often rate a text with minor errors but clear structure above one with perfect grammar but a confusing argument. Errors of grammar distract; errors of organization defeat understanding.

A less visible difficulty concerns the expectations of academic writing itself. Academic traditions differ in what they value. In some, a good essay states its claim at the start and supports it directly; in others, a good essay approaches its point gradually, building context before arriving at a conclusion the reader may be expected to infer. A student trained in one tradition and writing in another may produce work that is well organized by the first tradition's standards and seems disorganized by the second's. The problem is not the student's ability to think or to write, but a mismatch of conventions that no one has explained.

Similarly, traditions differ in how writers use sources. In some educational systems, students are expected to reproduce the words of respected authorities closely, as a sign of learning and respect. In others, close copying without quotation marks counts as plagiarism, a serious offense. A student who moves from the first kind of system to the second may be accused of dishonesty for doing what they were taught to do. Ironically, the more conscientious the student, the more faithfully they may follow the habits they were taught.

What helps? For students, the most useful step is often to study models: to read many examples of the kind of writing they must produce, noticing how claims are stated, how sources are introduced and how paragraphs are built. Writing in a second language is partly a matter of absorbing patterns, and patterns are absorbed through reading. It also helps to ask explicitly about expectations. A question such as "Should my thesis appear in the first paragraph?" is not naive; it addresses exactly the kind of convention that varies.

For readers and teachers, the lesson is to distinguish between kinds of problems. An essay with errors of articles and prepositions may contain an original and well-supported argument; an essay with perfect grammar may say nothing. Judging the first harshly and the second kindly rewards the wrong thing. It also helps to explain conventions rather than assume them. Much of what native speakers regard as obvious about academic writing was never obvious; they simply absorbed it earlier.

Finally, writers in a second language bring something valuable. Having learned the conventions consciously, they often understand them more clearly than writers who absorbed them without noticing. And having moved between languages, they are often more aware of how a choice of words shapes meaning. These are not small advantages for anyone who wants to write well.`,
      [misused, style, clear, academic(1), academic(3)],
      [
        ask(
          t("According to the research described, which problem is usually most serious?", "根据文中描述的研究，通常最严重的问题是什么？"),
          t("A confusing structure or argument", "混乱的结构或论证"),
          [
            t("Small errors with articles", "冠词上的小错误"),
            t("Prepositions that are slightly wrong", "介词用得稍有不对"),
            t("Verb forms that do not quite fit", "动词形式不太恰当"),
          ],
          t(
            "The passage says readers rate a clear structure with minor errors above perfect grammar with a confusing argument: errors of grammar distract, errors of organization defeat understanding.",
            "文章说，读者认为结构清楚但有小错的文章胜过语法完美但论证混乱的文章：语法错误只是分散注意，结构错误却妨碍理解。",
          ),
        ),
        ask(
          t("Why might a conscientious student be accused of plagiarism?", "为什么一个认真的学生可能被指控抄袭？"),
          t(
            "They faithfully follow a tradition that taught them to reproduce authorities' words closely",
            "他们忠实地遵循了一种教他们紧贴权威原话的传统",
          ),
          [
            t("They deliberately copy other students' essays", "他们故意抄袭其他学生的文章"),
            t("They refuse to read any sources", "他们拒绝阅读任何资料"),
            t("They use too many quotation marks", "他们用了太多引号"),
          ],
          t(
            "The fourth paragraph explains that some systems expect close reproduction of authorities, which another system counts as plagiarism.",
            "第四段解释说，有些教育体系期望学生紧贴权威的原话，而另一种体系把这视为抄袭。",
          ),
        ),
        ask(
          t("What advantage does the author say writers in a second language often have?", "作者认为用第二语言写作的人常常有什么优势？"),
          t(
            "Having learned conventions consciously, they often understand them more clearly",
            "由于是有意识地学习规范，他们往往理解得更清楚",
          ),
          [
            t("They make fewer errors than native speakers", "他们比母语者犯的错误少"),
            t("They do not need to read models", "他们不需要阅读范文"),
            t("Teachers always judge them more kindly", "老师总是对他们评判得更宽松"),
          ],
          t(
            "The last paragraph says that, having learned conventions consciously, they often understand them more clearly, and are more aware of how words shape meaning.",
            "最后一段说，他们有意识地学习了规范，往往理解得更清楚，也更清楚用词如何塑造意义。",
          ),
        ),
      ],
    ),
    passage(
      "revision-as-rethinking",
      t("Revision as Rethinking", "修改即重新思考"),
      `Ask students what revision means and many will describe proofreading: checking spelling, fixing commas, replacing a repeated word. Ask experienced writers and they will describe something quite different. For them, revision is where much of the thinking happens. The first draft is how they discover what they want to say; revision is how they say it.

The difference shows up clearly in studies that compare how students and experienced writers change their drafts. Students tend to make small changes, at the level of words and sentences, and leave the overall structure intact. Experienced writers make changes at every level. They move paragraphs, cut sections, add new arguments and sometimes rewrite the thesis entirely. Asked why, they often say that writing the draft changed their understanding of the subject. The draft was not a failed version of the final text but a necessary stage in working out what the final text should be.

This view of revision has a liberating consequence. If the first draft is a way of thinking, it does not need to be good. It needs to exist. Writers who believe that every sentence must be right before they write the next often find themselves unable to write at all. Writers who accept that the first draft will be rough can write quickly, get their ideas down, and then see what they have. As one invented novelist puts it in a short essay on her craft, "I write the first draft to find out what the book is about, and every draft after that to make it look as if I knew from the start."

How does one revise in this deeper sense? A useful first step is to describe the draft as it is, not as it was meant to be. Write down, in a sentence, the main point of each paragraph. Then read the list. Often it reveals that the argument does not proceed in a logical order, that two paragraphs make the same point, or that the real thesis appears only in the conclusion, where the writer finally discovered it. That last discovery is so common that some teachers advise students to try moving their conclusion to the beginning and see what happens.

A second step is to ask what a skeptical reader would say. Where would such a reader object, ask for evidence or lose interest? Answering these questions often requires new material, not just new sentences. It may mean finding a source, adding an example or conceding a point the draft ignored.

A third step is to cut. Most drafts contain material that the writer found interesting but that does not serve the argument: a paragraph of background no one needs, a digression on a related topic, a second example that repeats the first. Cutting such material is painful, because it represents work. But a text improves when everything in it does a job, and a reader's attention is not unlimited.

Only after these larger changes does it make sense to work on sentences, and only at the very end to proofread. The order matters, because effort spent polishing a paragraph that will later be cut is effort wasted.

Revision in this sense takes time, and students often do not have much of it. But even a single day between drafting and revising helps, because it allows the writer to read the draft with something closer to a stranger's eyes. Writing, after all, is not a record of thought already completed. It is one of the ways thinking gets done.`,
      [misused, style, clear, academic(1), academic(3)],
      [
        ask(
          t(
            "How do experienced writers' revisions differ from students', according to the studies?",
            "根据研究，有经验的写作者的修改与学生的有什么不同？",
          ),
          t("They change structure, arguments and even the thesis, not just words", "他们修改结构、论点甚至中心论点，而不只是词句"),
          [
            t("They only check spelling and commas", "他们只检查拼写和逗号"),
            t("They never change their first drafts", "他们从不修改初稿"),
            t("They make fewer changes than students", "他们改动得比学生少"),
          ],
          t(
            "The second paragraph says students make small changes and leave the structure intact, while experienced writers move paragraphs, cut sections and rewrite the thesis.",
            "第二段说，学生只做小改动，保留整体结构，而有经验的写作者会移动段落、删除部分甚至重写中心论点。",
          ),
        ),
        ask(
          t(
            "What is the liberating consequence of seeing a first draft as a way of thinking?",
            "把初稿看作思考的方式，会带来什么让人解放的结果？",
          ),
          t("The first draft does not need to be good; it only needs to exist", "初稿不必写得好，只要写出来就行"),
          [
            t("Writers no longer need to revise at all", "写作者完全不需要修改了"),
            t("Every sentence must be right before the next one", "每句话都必须写对才能写下一句"),
            t("Teachers no longer read first drafts", "老师不再阅读初稿"),
          ],
          t(
            "The third paragraph says that if the first draft is a way of thinking, it does not need to be good; it needs to exist.",
            "第三段说，如果初稿是思考的方式，它就不必写得好，只需要写出来。",
          ),
        ),
        ask(
          t("Why should proofreading come at the very end of revision?", "为什么校对应该放在修改的最后？"),
          t("Effort spent polishing a paragraph that is later cut is wasted", "花工夫润色的段落如果后来被删掉，就白费了"),
          [
            t("Proofreading is the most important part of revision", "校对是修改中最重要的部分"),
            t("Spelling errors are impossible to find early", "拼写错误不可能早早发现"),
            t("Readers do not notice spelling errors", "读者注意不到拼写错误"),
          ],
          t(
            "The passage says the order matters, because effort spent polishing a paragraph that will later be cut is effort wasted.",
            "文章说顺序很重要，因为润色一个之后会被删掉的段落是白费力气。",
          ),
        ),
      ],
    ),
  ],
};
