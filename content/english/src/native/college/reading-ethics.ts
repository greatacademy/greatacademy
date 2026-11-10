// College writing: the reading unit of the third theme, using sources honestly: eight original essays on how
// knowledge is checked, credited and sometimes corrupted. The people and cases are invented.

import { type ReadingUnitDef, t } from "@ga/content";
import { ask, passage } from "../grades-6-8/reading-kit.ts";

const evidence = { topic: "words-of-evidence-and-inference", weight: 0.3 } as const;
const tracing = { topic: "tracing-claims-to-sources", weight: 0.3 } as const;
const quoting = { topic: "quoting-and-paraphrasing", weight: 0.1 } as const;

/** academic gives the edge to a batch of the shared academic words, which a passage uses as it goes. */
const academic = (n: 1 | 2 | 3) => ({ topic: `academic-words-${n}`, weight: 0.1 }) as const;

/** theEthicsOfKnowledge is a reading unit of the college writing course on honesty in research. */
export const theEthicsOfKnowledge: ReadingUnitDef = {
  id: "the-ethics-of-knowledge",
  title: t("The Ethics of Knowledge", "知识的伦理"),
  passages: [
    passage(
      "the-fraud-that-fooled-a-field",
      t("The Fraud That Fooled a Field", "骗过整个领域的造假"),
      `For almost a decade, Victor Hale was one of the most admired young scientists in his field. His studies of how bees find their way home were published in the best journals, cited by hundreds of other researchers, and described in newspapers as a revolution in the study of animal navigation. His results were unusually clean. Where other researchers reported messy data with many exceptions, Hale's bees behaved almost exactly as his theory predicted.

That cleanness was the first sign that something was wrong, although for years no one treated it as one. The case began to unravel when a graduate student in another country, Anya Petrov, tried to build on one of Hale's experiments. Her bees did not behave like his. Assuming that the fault was hers, she wrote to Hale to ask for his raw data, the measurements recorded before any analysis. He replied politely that the files had been lost when a computer failed.

Petrov might have stopped there. Instead, she looked more closely at the published figures. In two separate papers, which reported experiments said to have been done two years apart with different groups of bees, she noticed that a table of flight times was identical, down to the last decimal place. The chance that two real experiments would produce exactly the same numbers was close to zero. The discrepancy could not be explained by error. Someone had copied the numbers.

Petrov reported what she had found to the journal and to Hale's university. The investigation that followed took eighteen months. It concluded that Hale had invented data in at least fourteen published papers, and that several experiments he described had never been carried out at all. Hale resigned. The journals retracted his papers, and other researchers who had built on his work found that years of their own effort rested on findings that did not exist.

How could a fraud on this scale go undetected for so long? Part of the answer lies in how science normally works. Peer reviewers read a paper, not the laboratory notebooks behind it; they can judge whether the methods are sound and the conclusions follow, but they cannot easily verify that the data are real. Science depends on trust, and most of the time the trust is justified. Fraud exploits that trust.

Another part of the answer lies in what the field wanted to believe. Hale's results were exciting, they confirmed a popular theory, and they came from a researcher at a famous institution. Researchers who could not reproduce his findings tended to attribute their failure to their own mistakes, as Petrov had at first. Some had quietly given up rather than challenge a star.

The case led to changes. Several journals began to require that authors share their raw data when a paper is published, so that others can examine it. Some now use software to check images and tables for signs of copying. These measures make fraud harder, though not impossible.

The deeper lesson concerns the role of replication. No single study, however impressive, should be treated as settled until other researchers have independently corroborated it. Hale's work was cited hundreds of times, but almost no one had tried to repeat it. Being cited is not the same as being confirmed, and a field that forgets the difference leaves itself open to being fooled.`,
      [evidence, tracing, quoting, academic(3)],
      [
        ask(
          t("What first led Petrov to suspect that the data were invented?", "是什么首先让彼得罗夫怀疑数据是编造的？"),
          t("The same table of numbers appeared in two papers about different experiments", "同一张数据表出现在两篇讲不同实验的论文里"),
          [
            t("Hale refused to answer her letter", "黑尔拒绝回复她的信"),
            t("Newspapers had described his work as a revolution", "报纸把他的研究称为一场革命"),
            t("Her own bees behaved exactly like his", "她自己的蜜蜂表现得和他的完全一样"),
          ],
          t(
            "She noticed that a table of flight times was identical in two papers said to describe experiments two years apart, which could not happen by chance.",
            "她注意到两篇据称相隔两年的实验论文中，飞行时间表完全相同，这不可能是偶然的。",
          ),
        ),
        ask(
          t("Why, according to the passage, did peer review not catch the fraud?", "根据文章，同行评审为什么没有发现这次造假？"),
          t("Reviewers judge the paper but cannot easily verify that the data are real", "评审者评判论文本身，却难以核实数据是否真实"),
          [
            t("The reviewers were friends of Hale", "评审者是黑尔的朋友"),
            t("The journals did not use peer review at that time", "那时期刊不采用同行评审"),
            t("The reviewers had copied the numbers themselves", "评审者自己抄袭了那些数字"),
          ],
          t(
            "The passage says reviewers read a paper, not the notebooks behind it, and cannot easily verify that the data are real; science depends on trust.",
            "文章说评审者读的是论文，而不是背后的实验记录，难以核实数据真伪；科学依赖信任。",
          ),
        ),
        ask(
          t(
            'What does the last paragraph mean by "being cited is not the same as being confirmed"?',
            "最后一段说“被引用并不等于被证实”，是什么意思？",
          ),
          t("Many researchers used Hale's work, but almost none had repeated it", "很多研究者引用了黑尔的成果，却几乎没有人重复过他的实验"),
          [
            t("Hale's papers were never cited by other scientists", "黑尔的论文从未被其他科学家引用"),
            t("Citing a paper proves that its data are real", "引用一篇论文就证明其数据是真实的"),
            t("Only newspapers should cite scientific work", "只有报纸才应该引用科学成果"),
          ],
          t(
            "The passage says his work was cited hundreds of times but almost no one tried to repeat it; only independent corroboration settles a finding.",
            "文章说他的成果被引用了几百次，但几乎没人尝试重复；只有独立的证实才能确立一项发现。",
          ),
        ),
      ],
      ["Victor", "Hale", "Hale's", "Anya", "Petrov"],
    ),
    passage(
      "how-a-paper-is-retracted",
      t("How a Paper Is Retracted", "论文是怎样被撤回的"),
      `A published paper is meant to be a permanent part of the scholarly record. Other researchers cite it, build on it and teach it. Occasionally, however, a paper turns out to be so seriously flawed that it should no longer be relied upon. When that happens, the journal that published it may retract it: it issues a formal notice that the paper's findings cannot be trusted, while leaving the paper itself available so that the record of what happened remains complete.

Retractions are rare. Only a tiny proportion of published papers are ever withdrawn. But the number has grown over the past few decades, partly because journals and readers have become better at detecting problems, and partly because there are simply more papers than ever.

The process usually begins with a concern raised by a reader. It might be a researcher who cannot reproduce a result, a reviewer who notices that an image appears in two different papers, or a member of the author's own laboratory who has doubts about how data were handled. The concern is sent to the journal's editor, who must decide whether it deserves investigation.

What follows depends on the nature of the problem. Some problems are honest errors. A team might discover, after publication, that a machine was set incorrectly, or that a step in the analysis contained a mistake. In such cases the authors themselves often ask the journal to retract the paper, or, if the error is small, to publish a correction. Researchers who report their own errors are generally respected for it; correcting the record is part of a scientist's duty.

Other problems involve misconduct: the invention or alteration of data, or plagiarism, the copying of another person's words or ideas without credit. In these cases the editor usually contacts the author's university, which conducts its own investigation. This can take many months, and the journal often waits for its result before acting. Meanwhile, the editor may publish an "expression of concern", a notice warning readers that questions have been raised about the paper.

A retraction notice states what is wrong and, ideally, why. In practice, notices vary widely. Some explain the problem in detail; others say only that the paper has been retracted "at the request of the authors", leaving readers to guess whether the cause was an innocent error or deliberate fraud. Critics argue that vague notices damage honest researchers, who may be suspected of misconduct, while protecting dishonest ones.

The most troubling fact about retracted papers is that they continue to be cited. Studies of the citation record have found that many retracted papers are still cited years later, often by authors who do not seem to know that the paper has been withdrawn. Sometimes a citation to a retracted paper is made deliberately, to discuss what went wrong. More often it is not. A researcher who copies a list of references from another article, without checking the provenance of each one, may cite a retracted finding as if it were sound.

For a student, the practical advice is simple. Before relying on a paper, especially an older or surprising one, check whether it has been retracted or corrected. Most journals mark retracted papers clearly on their websites, and several databases now track retractions across many journals. The check takes a minute, and it can prevent an argument from resting on evidence that its own authors have abandoned.`,
      [evidence, tracing, quoting, academic(1), academic(2), academic(3)],
      [
        ask(
          t("Why does a journal leave a retracted paper available rather than deleting it?", "期刊为什么保留被撤回的论文而不是删除它？"),
          t("So that the record of what happened remains complete", "以便发生过的事情的记录保持完整"),
          [
            t("So that other researchers can keep citing its findings", "以便其他研究者能继续引用它的发现"),
            t("Because deleting papers is too expensive", "因为删除论文费用太高"),
            t("Because the authors still own the paper", "因为作者仍然拥有这篇论文"),
          ],
          t(
            "The first paragraph says the journal issues a notice while leaving the paper available so that the record of what happened remains complete.",
            "第一段说，期刊发布撤回声明，同时保留论文，使发生过的事情的记录保持完整。",
          ),
        ),
        ask(
          t(
            "How does the passage say researchers who report their own errors are treated?",
            "文章说，主动报告自己错误的研究者会受到怎样的对待？",
          ),
          t(
            "They are generally respected, since correcting the record is part of their duty",
            "他们通常受到尊重，因为纠正记录是他们职责的一部分",
          ),
          [
            t("They are usually suspected of fraud", "他们通常被怀疑造假"),
            t("They are no longer allowed to publish", "他们不再被允许发表论文"),
            t("They must leave their university", "他们必须离开所在的大学"),
          ],
          t(
            "The fourth paragraph says researchers who report their own errors are generally respected, because correcting the record is part of a scientist's duty.",
            "第四段说，报告自己错误的研究者通常受人尊重，因为纠正记录是科学家职责的一部分。",
          ),
        ),
        ask(
          t("According to the passage, why are retracted papers still cited?", "根据文章，被撤回的论文为什么仍然被引用？"),
          t(
            "Authors often copy references without checking whether each paper is still sound",
            "作者常常照抄参考文献，而不核查每篇论文是否仍然可靠",
          ),
          [
            t("Retracted papers are hidden from all databases", "被撤回的论文在所有数据库中都被隐藏了"),
            t("Journals require authors to cite retracted papers", "期刊要求作者引用被撤回的论文"),
            t("Retracted papers usually contain the best data", "被撤回的论文通常含有最好的数据"),
          ],
          t(
            "The passage says citations are sometimes made deliberately to discuss what went wrong, but more often by authors who copy a list of references without checking each one.",
            "文章说，有时引用是为了讨论哪里出了错，但更多是因为作者照抄参考文献，没有逐一核查。",
          ),
        ),
      ],
    ),
    passage(
      "how-peer-review-works",
      t("How Peer Review Works", "同行评审是怎样运作的"),
      `When a researcher submits a paper to a scholarly journal, it is not simply printed. It first passes through a process called peer review, in which other experts in the field read it and advise the editor whether it should be published. Peer review is often described as the gatekeeper of science, and the phrase "published in a peer-reviewed journal" is used as a sign that a finding can be trusted. It is worth understanding what the process does and what it does not do.

The process begins with the editor, usually a senior researcher who works for the journal part time. The editor reads the submission and decides whether it is suitable for the journal at all. Many papers are rejected at this stage, because they fall outside the journal's subject or are plainly not ready. Those that pass are sent to two or three reviewers, chosen for their knowledge of the topic.

The reviewers are usually unpaid. They read the paper, often several times, and write a report. A good report summarizes the paper's argument, judges whether the methods are appropriate and whether the conclusions follow from the evidence, points out errors and omissions, and recommends one of several outcomes: accept the paper as it is, accept it after minor changes, ask for major revisions, or reject it. Acceptance without changes is rare.

In most fields, the reviewers' names are not revealed to the authors. The intention is to allow reviewers to criticize honestly without fear of offending a powerful colleague. In some fields the authors' names are also hidden from the reviewers, so that a paper by a famous researcher is judged by the same standards as one by an unknown student.

The editor reads the reports, which often disagree, and makes the final decision. If revisions are requested, the authors respond to each point, either by changing the paper or by explaining why they disagree. The revised paper may go back to the reviewers. The whole process commonly takes several months and sometimes more than a year.

Peer review does several things well. It catches many errors of reasoning and analysis. It forces authors to explain their methods more clearly and to qualify claims that go beyond their evidence. And it often makes papers better: authors frequently acknowledge that a reviewer's comments improved their work.

But peer review has limits that readers should understand. Reviewers see the paper, not the data behind it, and they rarely repeat the experiments; they cannot detect careful fraud. Reviewers are human, and they may favor work that confirms their own views or reject work that challenges them. Two reviewers reading the same paper often reach different judgments, which suggests that luck plays a larger role than the phrase "peer-reviewed" implies. And reviewers are busy people doing unpaid work, so the care they give varies.

For a reader, then, "peer-reviewed" means that a paper has been read critically by a small number of experts who found no obvious reason to reject it. That is valuable, and it distinguishes scholarly work from much of what is published elsewhere. It does not mean that the paper's findings are true. That judgment comes later, as other researchers test, extend, corroborate or contradict the work over years.`,
      [evidence, tracing, quoting, academic(1), academic(2), academic(3)],
      [
        ask(
          t("Why are reviewers' names usually hidden from authors?", "为什么评审者的姓名通常不让作者知道？"),
          t(
            "So that reviewers can criticize honestly without fear of offending a powerful colleague",
            "以便评审者能坦率批评，不必担心得罪有影响力的同行",
          ),
          [
            t("Because reviewers are paid by the authors", "因为评审者由作者付报酬"),
            t("So that famous researchers are judged more kindly", "以便知名研究者得到更宽容的评判"),
            t("Because the editor writes all the reports", "因为所有评审意见都由编辑撰写"),
          ],
          t(
            "The fourth paragraph says the intention is to allow reviewers to criticize honestly without fear of offending a powerful colleague.",
            "第四段说，这样做是为了让评审者坦率批评，而不用担心得罪有影响力的同行。",
          ),
        ),
        ask(
          t("Which of these is a limit of peer review named in the passage?", "下面哪一项是文章指出的同行评审的局限？"),
          t(
            "Reviewers see the paper but not the data, so they cannot detect careful fraud",
            "评审者只看到论文，看不到数据，因此无法发现精心的造假",
          ),
          [
            t("Reviewers always repeat the experiments", "评审者总是重复实验"),
            t("Reviewers are paid too much to be honest", "评审者报酬太高，因而不诚实"),
            t("Reviewers never disagree with each other", "评审者之间从不意见相左"),
          ],
          t(
            "The passage says reviewers see the paper, not the data behind it, and rarely repeat the experiments, so careful fraud escapes them.",
            "文章说评审者看到的是论文而不是背后的数据，而且很少重复实验，因此精心的造假会逃过他们的眼睛。",
          ),
        ),
        ask(
          t('What does "peer-reviewed" mean, according to the last paragraph?', "根据最后一段，“经过同行评审”意味着什么？"),
          t(
            "A few experts read the paper critically and found no obvious reason to reject it",
            "几位专家认真审读了论文，没有发现明显的拒稿理由",
          ),
          [
            t("The paper's findings have been proved true", "论文的发现已被证明是正确的"),
            t("The experiments have been repeated by others", "实验已被他人重复"),
            t("The paper contains no errors of any kind", "论文没有任何错误"),
          ],
          t(
            "The last paragraph defines it this way and adds that it does not mean the findings are true; that judgment comes later, from other researchers.",
            "最后一段这样界定它，并补充说这并不意味着研究发现正确；这种判断要靠以后其他研究者的检验。",
          ),
        ),
      ],
    ),
    passage(
      "a-short-history-of-the-footnote",
      t("A Short History of the Footnote", "脚注简史"),
      `Few inventions are as modest as the footnote. It sits at the bottom of the page in small type, and most readers skip it. Yet the footnote, and the citation system it belongs to, reflects one of the central ideas of modern scholarship: that a claim about the world should come with directions for checking it.

For most of history, writers did not cite their sources in any systematic way. Ancient historians often mentioned that they had consulted earlier writers or spoken with witnesses, but they rarely said which passage of which work supported which statement. A reader had to take much on trust. Medieval scholars wrote commentaries in the margins of important texts, and these notes, written around the main text, are among the ancestors of the footnote. Their purpose, however, was usually to explain the text, not to show where its claims came from.

Over the following centuries, as printed books multiplied and scholars began to argue about the accuracy of ancient documents, the need to show evidence grew. A scholar who claimed that a document was a forgery, or that a famous historian had made an error, needed to show exactly what he was relying on. Notes at the foot of the page allowed him to do this without interrupting his argument. By the eighteenth century, some historians used footnotes not only to cite sources but to argue with other writers, to add jokes and to comment on their own text. Readers came to enjoy the notes as much as the main text.

In the nineteenth century, history became a profession taught in universities, and the footnote took on a more serious role. Historians were trained to work from original documents in archives, and the footnote became the place where they proved that they had done so. A history without notes came to seem less like scholarship and more like storytelling. The footnote served, in effect, as a form of credentials: it showed the reader that the author had done the work.

The modern systems of citation, such as those of the Modern Language Association and the American Psychological Association, are descendants of this tradition. They differ in form. Some place the source in a note; others place a short reference in parentheses within the text and give full details in a list at the end. But they share a purpose. Each allows a reader to find the exact source of a claim, to check whether the source says what the writer says it does, and to judge whether the source deserves trust.

This purpose explains why citation matters even when no one checks. A citation is a promise. It says: if you doubt me, here is where to look. A writer who cites carefully invites readers to verify the argument, and an argument that invites checking deserves more confidence than one that does not. A writer who cites carelessly, or not at all, asks readers to accept claims on faith.

The footnote has critics. Some readers find notes distracting; some writers use them to display learning rather than to support claims. But the principle behind the footnote, that knowledge should be traceable to its sources, remains central to every serious field. The small type at the bottom of the page carries a large idea.`,
      [evidence, tracing, quoting, academic(1), academic(2)],
      [
        ask(
          t("How did the medieval notes in margins differ from modern footnotes?", "中世纪的页边注释与现代脚注有什么不同？"),
          t("They usually explained the text rather than showing where its claims came from", "它们通常是解释正文，而不是说明观点的出处"),
          [
            t("They were printed in larger type than the main text", "它们的字号比正文大"),
            t("They always gave the exact page of each source", "它们总是给出每个出处的确切页码"),
            t("They were written only by the original author", "它们只由原作者撰写"),
          ],
          t(
            "The second paragraph says these notes are ancestors of the footnote, but their purpose was usually to explain the text, not to show sources.",
            "第二段说这些注释是脚注的前身，但它们的目的通常是解释正文，而不是标明出处。",
          ),
        ),
        ask(
          t("In the nineteenth century, what did footnotes show about a historian?", "在十九世纪，脚注能说明历史学家的什么？"),
          t("That the author had worked from original documents", "作者是根据原始文献进行研究的"),
          [
            t("That the author could tell good jokes", "作者会讲好笑话"),
            t("That the author had never read other historians", "作者从未读过其他历史学家的著作"),
            t("That the author's book was a work of fiction", "作者的书是一部虚构作品"),
          ],
          t(
            "The fourth paragraph says the footnote became the place where historians proved they had worked from original documents in archives.",
            "第四段说，脚注成了历史学家证明自己依据档案中原始文献进行研究的地方。",
          ),
        ),
        ask(
          t('Why does the author call a citation "a promise"?', "作者为什么把引用称为“一种承诺”？"),
          t("It tells doubting readers where they can check the claim", "它告诉有疑问的读者可以到哪里去核查这个观点"),
          [
            t("It promises that the source is always correct", "它保证出处永远正确"),
            t("It promises that no one will ever check", "它保证没有人会去核查"),
            t("It promises to pay the source's author", "它承诺向出处的作者付费"),
          ],
          t(
            'The passage explains: a citation says "if you doubt me, here is where to look", inviting readers to verify the argument.',
            "文章解释说，引用的意思是“如果你怀疑我，可以去这里查”，从而邀请读者核实论证。",
          ),
        ),
      ],
      ["Modern", "Language", "Association", "American", "Psychological"],
    ),
    passage(
      "an-encyclopedia-anyone-can-edit",
      t("An Encyclopedia Anyone Can Edit", "人人可编辑的百科全书"),
      `When the online encyclopedia that anyone can edit first appeared, many teachers and scholars predicted that it would fail. An encyclopedia, they reasoned, depends on expertise. Its articles are written by people who know their subjects and checked by editors who know how to judge them. An encyclopedia written by anyone at all would be full of errors, jokes and propaganda. Students were warned not to use it.

The prediction was partly wrong. The open encyclopedia grew to millions of articles in hundreds of languages, and studies comparing its articles with those of traditional encyclopedias found, in many subjects, a similar rate of factual errors. How did a project without paid experts achieve this?

The answer lies in its rules and in the scale of its readership. The encyclopedia does not ask contributors to prove that they are experts. Instead, it asks them to support every claim with a reliable published source, and it forbids them to publish their own original research. A statement that cannot be traced to a source may be marked as "citation needed" or removed. In principle, the authority of an article comes not from its authors but from its references.

Scale matters because errors are seen by many readers. An article on a popular subject may be read by thousands of people a day, some of whom know the subject well and will correct a mistake within minutes. Every change is recorded, and anyone can compare versions to see what was added, by whom and when. Deliberate damage to popular articles is usually repaired quickly.

The model has weaknesses, and they follow from the same features. Articles on obscure subjects have few readers, so errors in them may survive for years. The rule that every claim needs a source does not ensure that the source is good; an article can faithfully report a claim from a weak source. And the requirement of a published source creates a strange loop: a journalist may copy a false claim from the encyclopedia into a newspaper article, and that article may then be cited in the encyclopedia as the source for the very claim it copied. Such loops have been documented many times, and they show how a claim can acquire the appearance of support without any evidence at all.

What, then, should a student do? The common advice is that the open encyclopedia is a good place to begin research and a poor place to end it. Its articles often give a clear overview of a subject and, more usefully, a list of references. A student who follows those references to the original sources, reads them, and checks that they say what the article claims, is doing research. A student who cites the encyclopedia itself, or copies its references without reading them, is not.

This advice applies to every secondary source, not only to this one. Textbooks, newspaper articles and even scholarly reviews summarize the work of others, and each act of summary can introduce errors. The habit of tracing a claim back to its origin, and asking at each step whether the source supports it, is the core skill of research. The open encyclopedia did not create the need for that habit, but it has made the need impossible to ignore.`,
      [evidence, tracing, quoting, academic(1)],
      [
        ask(
          t(
            "According to the passage, where does the authority of an article in the open encyclopedia come from?",
            "根据文章，开放百科全书中条目的权威来自哪里？",
          ),
          t("From the published sources it cites", "来自它引用的已发表资料"),
          [
            t("From the expert credentials of its authors", "来自作者的专家资格"),
            t("From the number of people who edited it", "来自编辑过它的人数"),
            t("From the original research of its contributors", "来自撰稿人的原创研究"),
          ],
          t(
            "The third paragraph says that in principle the authority of an article comes not from its authors but from its references; original research is forbidden.",
            "第三段说，原则上条目的权威不是来自作者，而是来自参考文献；原创研究是被禁止的。",
          ),
        ),
        ask(
          t('What is the "strange loop" the passage describes?', "文章描述的“奇怪的循环”是什么？"),
          t(
            "A newspaper copies a false claim from the encyclopedia and is then cited as its source",
            "报纸从百科全书抄来一个错误说法，之后又被当作这一说法的出处引用",
          ),
          [
            t("An article is edited and then changed back again", "一个条目被修改后又被改回去"),
            t("Readers correct an error within minutes", "读者在几分钟内改正了错误"),
            t("Two encyclopedias publish the same article", "两部百科全书刊登了同一个条目"),
          ],
          t(
            "The passage explains that a journalist may copy a false claim into an article, which is then cited in the encyclopedia as the source for that claim.",
            "文章解释说，记者可能把错误说法抄进文章，而这篇文章随后又被百科全书当作该说法的出处。",
          ),
        ),
        ask(
          t("What does the passage advise students to do with the encyclopedia?", "文章建议学生怎样使用这部百科全书？"),
          t("Use it to begin research, then read and check the original sources it lists", "用它开始研究，然后阅读并核查它列出的原始资料"),
          [
            t("Never read it under any circumstances", "在任何情况下都不要读它"),
            t("Cite it directly as the final source", "直接把它作为最终出处引用"),
            t("Copy its list of references into their papers", "把它的参考文献列表抄进自己的论文"),
          ],
          t(
            "The passage calls it a good place to begin and a poor place to end; following the references and checking them is research, copying them is not.",
            "文章称它是开始研究的好地方，却不是结束研究的好地方；追查并核对参考文献才是研究，照抄则不是。",
          ),
        ),
      ],
    ),
    passage(
      "a-statistic-without-a-source",
      t("A Statistic Without a Source", "没有出处的统计数字"),
      `"Most people use only ten percent of their brains." "A person swallows eight spiders a year in their sleep." Claims like these circulate for decades, repeated in conversation, in articles and in speeches, though none of them rests on any evidence. Researchers who study how information spreads have a name for such claims: zombie statistics, figures that keep moving long after they should be dead.

Consider a case studied by the information scientist Grace Okafor. In a widely shared article, a business magazine reported that "eighty percent of new businesses fail within their first year." The figure appeared in hundreds of later articles, several textbooks and at least one government report. Okafor set out to find where it had come from.

Her method was simple but slow. She took each article that used the figure and looked at what it cited. Most cited nothing. Some cited another article, which cited a third. She followed every chain as far back as it went, building a kind of family tree of the claim. After several months, she had traced more than two hundred uses of the figure to a handful of origins.

None of them was a study. The earliest appearance she could find was in a book of advice for business owners, published twenty years before the magazine article. The author had written that "a large proportion, perhaps as many as eighty percent," of new businesses struggled in their first years. He gave no source. Over time, in the hands of other writers, "perhaps as many as" disappeared, "struggled" became "fail", and "first years" became "first year". Each change was small. Together they turned a guess into a precise and alarming fact.

Meanwhile, government records that actually counted business closures told a different story. In the country Okafor studied, about one in five new businesses closed within its first year, and about half survived for at least five years. The real figure was serious enough, but it was the reverse of the one that had spread.

Okafor's study suggests several reasons why such claims spread. A precise number sounds authoritative, even when it has no source. A surprising number is more likely to be repeated than an ordinary one. And writers under pressure often copy figures from other writers, trusting that someone, somewhere, checked them. Each writer assumes the previous one verified the claim, and so no one does.

There are also lessons for anyone who uses figures in their own writing. First, a number should be traced to its original source, not to the last place it appeared. Second, the original wording matters: qualifications such as "perhaps", "in some cases" or "in one survey" are often dropped as a claim spreads, and restoring them may change its meaning entirely. Third, a figure should be checked against independent evidence where it exists. If a claim cannot be traced to a source that actually measured something, it should not be used, however often it has been repeated.

Okafor ended her report with a modest observation. Tracing a single figure took her months. Repeating it takes seconds. The imbalance explains why false claims are so hard to correct, and why the responsibility for checking cannot be left to someone else.`,
      [evidence, tracing, quoting, academic(1), academic(3)],
      [
        ask(
          t(
            "Where did Okafor find the earliest appearance of the eighty percent figure?",
            "奥卡福在哪里找到了“百分之八十”这一数字最早的出处？",
          ),
          t("In a book of advice that gave it as a guess with no source", "在一本建议类书籍中，作者只是猜测，没有给出出处"),
          [
            t("In a government study of business closures", "在一份关于企业倒闭的政府研究中"),
            t("In the business magazine article", "在那篇商业杂志的文章中"),
            t("In a textbook on economics", "在一本经济学教材中"),
          ],
          t(
            'The earliest appearance was in a book of advice whose author wrote "perhaps as many as eighty percent" and gave no source.',
            "最早的出处是一本建议类书籍，作者写的是“也许多达百分之八十”，而且没有给出出处。",
          ),
        ),
        ask(
          t("How did the original claim change as it spread?", "原来的说法在传播中发生了什么变化？"),
          t("Its qualifications were dropped and its wording became stronger", "其中的限定语被删去，措辞变得更加绝对"),
          [
            t("It was corrected using government records", "它被用政府记录更正了"),
            t("It became more cautious with each repetition", "每重复一次，它就变得更谨慎"),
            t("Its number grew from twenty to eighty percent", "数字从百分之二十增长到百分之八十"),
          ],
          t(
            '"Perhaps as many as" disappeared, "struggled" became "fail", and "first years" became "first year": small changes that turned a guess into a fact.',
            "“也许多达”消失了，“艰难经营”变成了“倒闭”，“头几年”变成了“第一年”：这些小变化把猜测变成了事实。",
          ),
        ),
        ask(
          t("What does the government data show about new businesses?", "政府数据显示了新企业的什么情况？"),
          t("About one in five closed within the first year", "大约五分之一在第一年内关闭"),
          [
            t("Eighty percent failed within the first year", "百分之八十在第一年内倒闭"),
            t("Almost none closed within five years", "五年内几乎没有关闭的"),
            t("The data had never been collected", "这些数据从未收集过"),
          ],
          t(
            "Records that counted closures showed about one in five closing in the first year and about half surviving five years, the reverse of the spread figure.",
            "统计企业关闭的记录显示，大约五分之一在第一年内关闭，大约一半存活五年以上，与流传的数字正好相反。",
          ),
        ),
      ],
      ["Grace", "Okafor", "Okafor's"],
    ),
    passage(
      "credit-among-coauthors",
      t("Credit Among Co-Authors", "合著者之间的署名"),
      `In the humanities, a typical article has one author. In many sciences, it has five, twenty or several hundred. A single paper in physics may list more names than it has sentences. As research has become the work of teams, the question of who deserves credit for it, and in what order, has become one of the most sensitive in academic life.

The order of names matters because readers, employers and committees use it to infer who did what. Conventions differ by field. In many sciences, the first author is the person who did most of the work, usually a junior researcher, while the last author is the senior researcher who led the laboratory and obtained the funding. Names in between are assumed to have contributed less. In some fields, such as mathematics and economics, names are simply listed in alphabetical order, and no inference about contribution is intended. A reader who applies the conventions of one field to a paper from another will misread the credit.

Disputes arise most often between people at different stages of their careers. Consider a case described by the ethicist Paul Renner. A graduate student designed an experiment, carried it out over two years and wrote the first draft of the paper. Her supervisor, who had suggested the general topic, revised the draft and then submitted it with himself as first author. When the student objected, he argued that the idea had been his and that she had merely carried it out. The student argued that the design, which was the hard part, had been hers.

Disagreements of this kind are difficult to settle because contributions are of different kinds and hard to compare. Who contributed more, the person who had the idea, the one who designed the method, or the one who spent two years collecting data? Different fields, and different people, answer differently.

To reduce such conflicts, many journals now require a statement of contributions, listing what each author did: who conceived the study, who collected the data, who performed the analysis, who wrote the paper. Some journals publish these statements with the article. Many also set out criteria for authorship. A common standard is that every author must have made a substantial contribution to the work, helped to write or revise the paper, approved the final version, and agreed to take responsibility for it.

That last criterion addresses a different problem: names added without real contribution. Senior researchers have sometimes been listed as authors on papers they barely read, simply because they ran the laboratory. Such "gift authorship" inflates a person's record and, when a paper turns out to contain errors or fraud, allows the senior author to claim that he knew nothing about it. If an author cannot explain and defend a paper, the argument goes, his name should not be on it.

For students, the lesson is to discuss credit early. Before a project begins, collaborators should agree on who is expected to do what and how authors will be listed, and they should revisit the agreement if roles change. Renner's student, whose dispute was eventually decided in her favor by her university, gave the advice most succinctly: "Talk about the names before you write the paper, not after."`,
      [evidence, tracing, quoting, academic(1), academic(3)],
      [
        ask(
          t(
            "In many sciences, what does the position of the last author usually indicate?",
            "在很多理科领域，最后一位作者的位置通常表示什么？",
          ),
          t("The senior researcher who led the laboratory and obtained funding", "领导实验室并获得经费的资深研究者"),
          [
            t("The person who did most of the work", "做了大部分工作的人"),
            t("The author whose name comes last in the alphabet", "姓名按字母顺序排在最后的作者"),
            t("The person who contributed least to the paper", "对论文贡献最少的人"),
          ],
          t(
            "The second paragraph says the first author usually did most of the work, while the last author is the senior researcher who led the laboratory.",
            "第二段说，第一作者通常做了大部分工作，而最后一位作者是领导实验室的资深研究者。",
          ),
        ),
        ask(
          t("Why are disputes over credit hard to settle, according to the passage?", "根据文章，署名争议为什么难以解决？"),
          t(
            "Contributions such as ideas, design and data collection are of different kinds and hard to compare",
            "提出想法、设计方法和收集数据等贡献性质不同，难以比较",
          ),
          [
            t("Journals refuse to publish papers with disputes", "期刊拒绝发表有争议的论文"),
            t("Supervisors are always right about credit", "导师在署名问题上总是对的"),
            t("Students never take part in writing papers", "学生从不参与撰写论文"),
          ],
          t(
            "The fourth paragraph says contributions are of different kinds and hard to compare, and different fields and people answer differently.",
            "第四段说贡献的性质各不相同，难以比较，不同领域和不同的人有不同的答案。",
          ),
        ),
        ask(
          t('What problem does the criterion "agreed to take responsibility" address?', "“同意承担责任”这一标准针对的是什么问题？"),
          t("Senior researchers being named on papers they barely read", "资深研究者被列为自己几乎没读过的论文的作者"),
          [
            t("Students who refuse to write the first draft", "拒绝撰写初稿的学生"),
            t("Papers that list names in alphabetical order", "按字母顺序列出姓名的论文"),
            t("Journals that publish statements of contribution", "刊登贡献声明的期刊"),
          ],
          t(
            'The passage says this criterion addresses "gift authorship", where a senior researcher is listed without real contribution and can later disclaim responsibility.',
            "文章说这一标准针对的是“赠送署名”，即资深研究者没有实际贡献却被署名，之后还能推卸责任。",
          ),
        ),
      ],
      ["Paul", "Renner", "Renner's"],
    ),
    passage(
      "copying-and-credit",
      t("Copying and Credit", "抄袭与署名"),
      `Students are told, from their first years at school, that copying is wrong. Yet each year universities deal with thousands of cases of plagiarism, and a surprising number involve students who did not believe they were doing anything dishonest. Understanding why requires looking more closely at what plagiarism is and why academic writing treats it so seriously.

Plagiarism is the presentation of another person's words or ideas as one's own. The most obvious form is copying a passage verbatim without quotation marks or citation. But the definition reaches further. A writer who changes a few words in a borrowed passage, keeping its structure and order, has still plagiarized, even if the source is cited, because the result presents the original author's sentences as the writer's own. A writer who uses another person's idea, argument or way of organizing a subject without credit has also plagiarized, even if every word is new.

The second of these forms causes the most confusion. Consider an excerpt from an imagined source: "The decline of small shops in the town was caused less by large stores than by the new road, which carried shoppers past the town center without stopping." A student who writes, "The fall of small shops in the town was caused not so much by big stores as by the new road, which took shoppers past the center of town," has replaced words but kept everything else. This is sometimes called patchwriting. It is not a paraphrase. A real paraphrase restates the idea in the writer's own structure and words, for example: "According to Lowe, the new road did more harm to local shops than competition did, because it allowed shoppers to drive past the town altogether." And it still requires a citation, because the idea belongs to Lowe.

Why do students patchwrite? Research on student writing suggests that it is often a stage in learning rather than an attempt to deceive. A student who does not yet fully understand a difficult source may be unable to restate it in new words, and borrowing its structure is a way of staying close to a meaning that is not yet secure. Seen this way, patchwriting is a sign that the student needs to read the source again, not merely a sign of dishonesty.

The internet has changed the practical side of the problem in two directions. Copying has become easier: a paragraph can be taken from a website in seconds. But detection has also become easier, since software can compare a paper with billions of pages and published articles. Neither change alters the principle.

Why does academic writing care so much about credit? Partly because credit is how scholars are rewarded: researchers are hired and promoted for the ideas they contribute, and taking credit for someone else's idea is a kind of theft. But there is a deeper reason. Academic writing is a conversation in which each writer builds on others, and readers need to know which voice is speaking. A paper that blurs the line between the writer's ideas and those of sources makes it impossible for a reader to judge what is new, what is borrowed, and whom to believe.

The practical rules follow from this. Quote when the exact words matter. Paraphrase when the idea matters more than the wording, and make the paraphrase truly your own. Cite both. And when you are unsure whether something needs a citation, cite it: the cost of an extra citation is small, and the cost of a missing one may be large.`,
      [evidence, tracing, quoting, academic(1), academic(2), academic(3)],
      [
        ask(
          t(
            "Why is changing a few words in a borrowed passage still plagiarism, even with a citation?",
            "为什么即使注明了出处，改动借来段落中的几个词仍然属于抄袭？",
          ),
          t("The result still presents the original author's sentences as the writer's own", "结果仍然把原作者的句子当作自己的句子来呈现"),
          [
            t("Because citations are not allowed for paraphrases", "因为转述不允许注明出处"),
            t("Because any change to a source is forbidden", "因为不允许对资料做任何改动"),
            t("Because the new words are always less accurate", "因为新换的词总是不够准确"),
          ],
          t(
            "The second paragraph says such a writer keeps the structure and order, so the result presents the original sentences as the writer's own.",
            "第二段说，这样的写作者保留了原文的结构和顺序，所以结果是把原作者的句子当作自己的。",
          ),
        ),
        ask(
          t(
            "What makes the second example a real paraphrase rather than patchwriting?",
            "是什么使第二个例子成为真正的转述，而不是拼凑改写？",
          ),
          t("It restates the idea in a new structure and new words, with credit to Lowe", "它用新的结构和新的词语重述了观点，并注明出自洛"),
          [
            t("It keeps the original order but changes every noun", "它保留原文顺序，只替换了所有名词"),
            t("It copies the original sentence word for word", "它逐字照抄了原句"),
            t("It leaves out the source because the words are new", "因为用词是新的，所以省略了出处"),
          ],
          t(
            "The passage says a real paraphrase restates the idea in the writer's own structure and words, and it still requires a citation because the idea belongs to Lowe.",
            "文章说真正的转述是用写作者自己的结构和词语重述观点，而且仍需注明出处，因为观点属于洛。",
          ),
        ),
        ask(
          t(
            "According to the passage, what is the deeper reason academic writing cares about credit?",
            "根据文章，学术写作重视署名的更深层原因是什么？",
          ),
          t("Readers need to know which voice is speaking in order to judge what is new", "读者需要知道是谁在说话，才能判断哪些是新的观点"),
          [
            t("Software can now detect all copying", "软件现在能发现所有抄袭"),
            t("Universities want to punish as many students as possible", "大学想惩罚尽可能多的学生"),
            t("Quotations make papers longer", "引文能使论文更长"),
          ],
          t(
            "The passage calls academic writing a conversation in which readers need to know which voice is speaking, so they can judge what is new and whom to believe.",
            "文章把学术写作称为一场对话，读者需要知道是谁在说话，才能判断哪些是新的、该相信谁。",
          ),
        ),
      ],
      ["Lowe"],
    ),
  ],
};
