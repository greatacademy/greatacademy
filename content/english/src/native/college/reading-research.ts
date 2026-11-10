// College writing: the reading unit of the second theme, questions and sources: eight original essays on how
// researchers work, from choosing a question to a result that would not replicate. The researchers are invented.

import { type ReadingUnitDef, t } from "@ga/content";
import { ask, passage } from "../grades-6-8/reading-kit.ts";

const research = { topic: "words-of-research", weight: 0.3 } as const;
const sources = { topic: "finding-scholarly-sources", weight: 0.3 } as const;
const citing = { topic: "verbs-for-citing-sources", weight: 0.1 } as const;

/** academic gives the edge to a batch of the shared academic words, which a passage uses as it goes. */
const academic = (n: 1 | 2 | 3) => ({ topic: `academic-words-${n}`, weight: 0.1 }) as const;

/** researchInPractice is a reading unit of the college writing course on how researchers work. */
export const researchInPractice: ReadingUnitDef = {
  id: "research-in-practice",
  title: t("Research in Practice", "研究实践"),
  passages: [
    passage(
      "choosing-a-research-question",
      t("Choosing a Question", "选择研究问题"),
      `Every research project begins with a question, and most beginning researchers choose the wrong one. The mistake is rarely that the question is uninteresting. It is usually that the question is too large. A student who sets out to study "the effects of the internet on society" has chosen a subject that could fill a library, and no single paper can answer it.

Consider the experience of Mara Kell, a graduate student in sociology. Her first proposal asked why young people in her city no longer joined clubs and societies. Her adviser read it and asked a simple question in return: which young people, which clubs, and compared with when? Kell had no answer. She had assumed that the decline was real because everyone she knew seemed to believe it.

Over the next month she did what experienced researchers do before they commit to a question. She read. She searched a database of scholarly journals for studies of membership in clubs, and she read the abstracts of about sixty articles. Most were irrelevant, but a few were useful in an unexpected way. They showed that the decline she had assumed was not simple. Membership in some kinds of groups, such as sports teams, had held steady, while membership in others, such as political youth groups, had fallen sharply.

This discovery changed her question. Instead of asking why young people no longer join clubs, she asked why membership in political youth groups in her city had fallen by half since 2005 while membership in sports teams had not. The new question was narrower, but it was also more interesting, because it pointed to a contrast that needed an explanation.

A good research question, then, has several qualities. It is narrow enough to be answered with the time and evidence available. It is open enough that a reasonable person could answer it in more than one way, so that the answer is an argument rather than a fact to be looked up. And it connects to what other researchers have already written, so that the answer adds something to a conversation rather than repeating it.

The last quality is the one beginners most often neglect. Many students treat reading as something done after a question is chosen, to find support for an answer they already hold. Experienced researchers reverse the order. They read first, in order to find where the existing work is thin, where studies disagree, or where a claim has been repeated without evidence. A question placed in such a gap has a reason to exist.

Kell's final question had one more advantage: it could be answered with sources she could reach. The city kept records of the groups it funded, and the groups themselves kept lists of members. A question about all young people everywhere would have required evidence no single student could gather.

None of this means that a question, once chosen, is fixed. Kell's question changed twice more as she worked, once when she found that two of the political groups had merged, and once when interviews suggested that the cause was not politics at all but a change in the school timetable. Research questions are tools, and like other tools they are reshaped by use. But a researcher who begins with a question that is narrow, open and connected to earlier work begins in a far stronger position than one who begins with a subject.`,
      [research, sources, citing, academic(1), academic(2), academic(3)],
      [
        ask(
          t("According to the passage, what mistake do most beginning researchers make?", "根据文章，大多数初学研究者犯了什么错误？"),
          t("They choose a question that is too large to answer", "他们选择的问题太大，无法回答"),
          [
            t("They choose a question that is uninteresting", "他们选择的问题没有意思"),
            t("They read too many abstracts before starting", "他们在开始前读了太多摘要"),
            t("They refuse to change their question once chosen", "他们一旦选定问题就拒绝修改"),
          ],
          t(
            'The first paragraph says the mistake is rarely that the question is uninteresting but "usually that the question is too large."',
            "第一段说，错误很少在于问题没有意思，而“通常在于问题太大”。",
          ),
        ),
        ask(
          t("How did reading the abstracts change Kell's question?", "阅读摘要怎样改变了凯尔的问题？"),
          t(
            "It showed that membership fell in some groups but not others, so she asked about that contrast",
            "摘要表明有些团体的成员减少了而另一些没有，于是她就这种反差提出问题",
          ),
          [
            t("It proved that young people had never joined clubs", "摘要证明年轻人从未加入过社团"),
            t("It convinced her to study the internet instead", "摘要使她转而研究互联网"),
            t("It showed that her adviser had been wrong", "摘要表明她的导师是错的"),
          ],
          t(
            "The studies showed that sports teams held steady while political youth groups fell, and her new question asked why.",
            "这些研究显示，体育队的成员数保持稳定，而政治青年团体的成员减少了，她的新问题就问其中的原因。",
          ),
        ),
        ask(
          t("Why do experienced researchers read before choosing a question?", "为什么有经验的研究者在选定问题之前先阅读？"),
          t(
            "To find gaps and disagreements in existing work where a new question is needed",
            "为了找到已有研究中的空白和分歧，那里正需要新的问题",
          ),
          [
            t("To find support for an answer they already hold", "为了给自己已有的答案找支持"),
            t("To copy the questions of other researchers", "为了照搬其他研究者的问题"),
            t("To avoid having to gather any evidence themselves", "为了避免自己收集任何证据"),
          ],
          t(
            "The passage says they read first to find where existing work is thin or where studies disagree; finding support for a held answer is what beginners do.",
            "文章说他们先阅读，是为了找出已有研究薄弱或相互矛盾之处；为已有答案找支持是初学者的做法。",
          ),
        ),
      ],
      ["Mara", "Kell", "Kell's"],
    ),
    passage(
      "a-search-that-failed",
      t("A Search That Failed", "一次失败的检索"),
      `Daniel Osei spent three weeks searching for sources on a topic that, he was certain, someone must have studied. He wanted to know how small farmers in dry regions decided when to plant their crops. He typed the obvious words into the library's database: "farmers", "planting", "decisions", "drought". The database returned thousands of results, and almost none of them were useful. Most were about large farms, about crops he had never heard of, or about drought in general.

He narrowed the search by adding the name of the region he cared about. Now the database returned eleven results, and none of them mentioned planting at all. He concluded, wrongly, that the subject had never been studied, and he told his adviser that his project would be the first of its kind.

His adviser was not convinced. She asked him to describe, in the words a farmer might use, what he was trying to find out. Osei said that farmers watch for the first rains and decide whether the rains are real or false. His adviser asked whether anyone used the phrase "false start" in the literature. Within an hour Osei had found a body of research he had never seen: dozens of articles on the "onset of the rainy season", written by scientists who studied weather, not farming. Some of those articles had interviewed farmers at length.

The lesson of this failure is common in research, and it has three parts. The first is that the words a researcher uses to describe a problem are often not the words the people who have studied it use. A database does not understand ideas; it matches terms. A search that uses the wrong terms will fail even when the material exists. Experienced researchers therefore treat the first few useful sources as a guide to vocabulary. They look at the keywords listed with each abstract, at the titles of the works cited, and at the subject headings the library has assigned, and they search again with those words.

The second part is that relevant work often lives in a different field. Osei had searched in the databases of economics and agriculture, because that was how he thought of his question. The research he needed had been published in journals of climate science. Questions about real problems rarely respect the boundaries between departments, and a search confined to one field will miss much of what is known.

The third part concerns the claim that a subject has never been studied. Such a claim is almost always false, and it is always hard to prove. A researcher who makes it in a paper invites every reader who knows a relevant study to doubt everything else the paper says. It is safer, and usually more accurate, to say that a question has received little attention in a particular field, and to show what has been done nearby.

Osei did not abandon his project. His question was still worth asking, because the climate scientists had described what farmers did but had not tried to explain why some farmers waited and others planted early. But he no longer believed that he was working alone. He was joining a conversation that had been going on for twenty years, and his bibliography grew from eleven items to more than eighty. The search had not failed because there was nothing to find. It had failed because he had not yet learned how others talked about what he wanted to know.`,
      [research, sources, citing, academic(1), academic(2)],
      [
        ask(
          t("Why did Osei's first searches fail?", "奥塞最初的检索为什么失败了？"),
          t(
            "He used his own terms rather than the terms researchers in the field used",
            "他用的是自己的说法，而不是该领域研究者使用的术语",
          ),
          [
            t("The library's database was out of date", "图书馆的数据库过时了"),
            t("No one had ever studied how farmers plant", "从来没有人研究过农民怎样播种"),
            t("His adviser had given him the wrong region", "导师给了他错误的地区"),
          ],
          t(
            'The passage explains that a database matches terms, and the research he needed used phrases such as "onset of the rainy season" that he had not searched for.',
            "文章解释说数据库只匹配词语，而他需要的研究用的是“雨季开始”这类他没有检索过的说法。",
          ),
        ),
        ask(
          t(
            "What does the passage advise instead of claiming that a subject has never been studied?",
            "文章建议用什么说法代替“这个题目从未有人研究过”？",
          ),
          t(
            "Saying that it has received little attention in a particular field, and showing related work",
            "说它在某个领域很少受到关注，并说明相关的研究",
          ),
          [
            t("Making the claim only in the conclusion", "只在结论中提出这个说法"),
            t("Asking the adviser to make the claim instead", "请导师代为提出这个说法"),
            t("Leaving all related studies out of the paper", "在论文中略去所有相关研究"),
          ],
          t(
            "The passage says it is safer and more accurate to say a question has received little attention in a field and to show what has been done nearby.",
            "文章说，更稳妥也更准确的做法是说明这个问题在某一领域很少受到关注，并展示相近的研究。",
          ),
        ),
        ask(
          t(
            "Why was Osei's question still worth asking after he found the climate research?",
            "在找到气候研究之后，奥塞的问题为什么仍然值得研究？",
          ),
          t(
            "The scientists had described what farmers did but not explained why they differed",
            "科学家描述了农民的做法，却没有解释农民之间为什么不同",
          ),
          [
            t("The climate research was all about large farms", "气候研究全部关于大农场"),
            t("No one in climate science had interviewed farmers", "气候科学领域没有人采访过农民"),
            t("His adviser told him the earlier research was wrong", "导师告诉他先前的研究是错的"),
          ],
          t(
            "The last paragraph says the scientists had not tried to explain why some farmers waited and others planted early, so his question added something.",
            "最后一段说，科学家没有尝试解释为什么有的农民等待、有的提前播种，因此他的问题有新的贡献。",
          ),
        ),
      ],
      ["Daniel", "Osei", "Osei's"],
    ),
    passage(
      "an-archive-in-a-basement",
      t("An Archive in a Basement", "地下室里的档案"),
      `The records of the Harlow Textile Company were not in any library. When the factory closed in 1971, its papers were packed into boxes and carried down to the basement of the town hall, where they remained, unopened and uncatalogued, for nearly fifty years. Lena Voss, a historian of labor, learned of them by accident, from a retired clerk who mentioned at a public meeting that "all the old mill papers" were still downstairs.

What Voss found when she was allowed into the basement was both a gift and a problem. There were more than three hundred boxes. Some held payroll books listing every worker's name, hours and pay for each week between 1902 and 1968. Others held letters between managers, minutes of meetings, and photographs. A few had been damaged by water, and the paper inside had turned to a solid block.

An archive of this kind differs from a library in ways that matter to a researcher. A library collection has been selected, arranged and described: each book has a record in a catalogue, and a reader can search for it. An unprocessed archive has none of this. Its order is the order in which someone happened to pack it, and there is no index to say what is where. Retrieval, in such a place, means opening boxes one at a time.

Voss's first task was therefore not research but description. With two students, she spent a summer listing the contents of each box, noting dates, types of document and condition. This list, which she later shared with the town and with a university library, was itself a scholarly contribution: it made the collection usable by others. Archivists call such a list a finding aid, and historians who work with new collections often spend months producing one before they write a word of analysis.

The archive also forced Voss to think about what was missing. The papers had been kept by the company, so they recorded what the company's managers thought worth keeping. There were detailed records of wages and production but almost nothing written by the workers themselves. A strike in 1934, mentioned briefly in the minutes as "the trouble in March", appeared nowhere else in the boxes. Every archive, Voss later wrote, has a point of view, because someone decided what to save.

To answer the questions the company papers could not, she turned to other sources: newspapers from the town, records of the union, and interviews with the children of former workers. The payroll books proved most valuable when read against these sources. They showed, for instance, that the wages of women fell sharply in the months after the strike, a fact no manager had commented on in writing.

The book Voss eventually published made a modest claim. It did not argue that the Harlow strike changed the history of the industry. It argued that the strike changed the lives of the women who took part in it, and that the evidence for this had been sitting in a basement, unread, because no one had thought it worth looking for. Her credentials as a historian rested on years of training, but the discovery itself, she admitted, began with a conversation at a public meeting and a willingness to open boxes.`,
      [research, sources, citing, academic(1)],
      [
        ask(
          t(
            "How does an unprocessed archive differ from a library collection, according to the passage?",
            "根据文章，未整理的档案和图书馆藏书有什么不同？",
          ),
          t("It has not been arranged or described, so there is no catalogue to search", "它没有经过整理和描述，因此没有目录可供检索"),
          [
            t("It contains only books, not letters or photographs", "它只有书，没有信件或照片"),
            t("It is always kept in a university building", "它总是保存在大学的建筑里"),
            t("It has been selected more carefully than a library", "它比图书馆藏书挑选得更仔细"),
          ],
          t(
            "The third paragraph says a library collection has been selected, arranged and described, while an unprocessed archive has no index and is in the order it was packed.",
            "第三段说，图书馆藏书经过挑选、整理和描述，而未整理的档案没有索引，保持着装箱时的顺序。",
          ),
        ),
        ask(
          t('What does Voss mean when she says that "every archive has a point of view"?', "沃斯说“每一份档案都有立场”，是什么意思？"),
          t("What survives depends on who decided what to keep", "保存下来的内容取决于谁决定保留什么"),
          [
            t("Every archive is stored in a particular room", "每一份档案都存放在一个特定的房间里"),
            t("Archivists always share the opinions of workers", "档案管理员总是认同工人的观点"),
            t("Historians should not trust any written record", "历史学家不应相信任何书面记录"),
          ],
          t(
            "She notes that the company kept what its managers thought worth keeping, so the workers' own words and the strike are almost absent.",
            "她指出公司只保留了管理者认为值得保留的东西，所以工人自己的话和那次罢工几乎没有留下记录。",
          ),
        ),
        ask(
          t("What claim does Voss's book make?", "沃斯的书提出了什么观点？"),
          t("That the strike changed the lives of the women who took part in it", "那次罢工改变了参与其中的女工的生活"),
          [
            t("That the strike changed the history of the whole industry", "那次罢工改变了整个行业的历史"),
            t("That the company's managers kept honest records", "公司的管理者保留了诚实的记录"),
            t("That the archive should be moved to a library", "这些档案应该搬到图书馆去"),
          ],
          t(
            "The last paragraph says the book made a modest claim: not about the industry, but about the lives of the women who took part.",
            "最后一段说这本书的观点很克制：不是关于整个行业，而是关于参加罢工的女工的生活。",
          ),
        ),
      ],
      ["Harlow", "Lena", "Voss", "Voss's"],
    ),
    passage(
      "interviews-in-a-village",
      t("Interviews in a Village", "村庄里的访谈"),
      `When the anthropologist Ines Marlow arrived in the mountain village where she would spend a year, she brought a list of forty questions. She wanted to learn how families decided which of their children would stay to work the land and which would leave for the city. The questions were clear, carefully worded and tested on friends at home. Within a week she had stopped using them.

The problem was not that people refused to answer. It was that they answered too politely. Asked directly why a son had left, a mother would give a short and reasonable explanation: there was no work, or he wanted to study. These answers were true, but they were also the answers people give to strangers. They told Marlow what the family was willing to say, not how the decision had actually been made.

Marlow changed her method. Instead of asking questions, she asked people to tell stories. She would ask an older man to describe the year his brother left, or a woman to describe the day her daughter received a letter from a school in the city. She recorded these conversations, with permission, and later wrote them out in full. The stories were long and often wandered, but they contained what the direct answers had hidden: arguments between parents, the influence of grandparents, debts that had to be paid, and a strong expectation that the eldest daughter would stay to care for her parents.

Interviews of this kind raise questions that a survey does not. The first is the question of trust. People told Marlow more as the months passed and they came to know her. An interview recorded in the first week and one recorded in the tenth month were, in an important sense, different kinds of evidence. Marlow kept notes on when and where each conversation took place and on her relationship with each speaker, so that later readers could judge what she had been told and why.

The second question is interpretation. A story is not a set of facts; it is an account shaped by memory and by the teller's purposes. A man who described his own decision to stay as a free choice may have been remembering accurately, or he may have been giving dignity to a decision that others had made for him. Marlow did not claim to know which. She compared stories from different members of the same family and noted where they agreed and where they conflicted.

The third question concerns the people themselves. Marlow's informants had shared private matters, and some of what they said could have caused trouble within the village if it were published with their names. She changed names and details, and she returned to the village before publishing to read parts of her account aloud to those it described. Two families asked her to remove passages, and she did.

The result was not a study that could be summarized in a single number. Marlow could not say what proportion of families favored sons or daughters; her evidence was not of that kind. What she could show was how such decisions were made, by whom, and at what cost. Research of this kind complements surveys rather than replacing them. A survey can count how many people left. Interviews, carefully gathered and honestly reported, can explain what leaving meant.`,
      [research, sources, citing, academic(1), academic(2), academic(3)],
      [
        ask(
          t("Why did Marlow stop using her list of questions?", "马洛为什么不再使用她的问题清单？"),
          t("People gave polite answers that hid how decisions were really made", "人们给出的是客气的回答，掩盖了决定的真实过程"),
          [
            t("People refused to answer any questions at all", "人们拒绝回答任何问题"),
            t("The questions had not been tested before she arrived", "这些问题在她到达前没有经过测试"),
            t("Her recording equipment did not work in the mountains", "她的录音设备在山区无法使用"),
          ],
          t(
            "The second paragraph says the problem was that people answered too politely, giving the answers people give to strangers.",
            "第二段说，问题在于人们回答得太客气，给出的是对陌生人说的那种回答。",
          ),
        ),
        ask(
          t("Why did Marlow record when and where each conversation took place?", "马洛为什么记录每次谈话的时间和地点？"),
          t("So that readers could judge how trust had shaped what she was told", "以便读者判断信任程度怎样影响了她所听到的内容"),
          [
            t("So that she could publish the speakers' names", "以便她公开说话人的姓名"),
            t("Because the village required a written record", "因为村里要求留下书面记录"),
            t("So that she could count how many families left", "以便她统计有多少家庭离开"),
          ],
          t(
            "The passage explains that people told her more as they came to trust her, so she kept notes so later readers could judge what she had been told and why.",
            "文章解释说，人们越信任她就说得越多，所以她做了记录，让后来的读者能判断她听到了什么以及原因。",
          ),
        ),
        ask(
          t("What does the passage say interviews can do that a survey cannot?", "文章认为访谈能做到哪些调查问卷做不到的事？"),
          t("Explain how decisions were made and what they meant to people", "解释决定是怎样做出的，以及它们对人们意味着什么"),
          [
            t("Count exactly how many people left the village", "准确统计有多少人离开了村庄"),
            t("Prove which family members told the truth", "证明哪些家庭成员说了真话"),
            t("Replace the need for any other kind of research", "取代其他任何种类的研究"),
          ],
          t(
            "The last paragraph says a survey can count how many people left, while interviews can explain what leaving meant; they complement rather than replace surveys.",
            "最后一段说，问卷能统计离开的人数，而访谈能解释离开意味着什么；两者互为补充，而非相互取代。",
          ),
        ),
      ],
      ["Ines", "Marlow", "Marlow's"],
    ),
    passage(
      "the-lab-notebook",
      t("The Lab Notebook", "实验记录本"),
      `In most laboratories, the most important document is not a published paper but a plain notebook. Every experiment, every measurement and every change of plan is supposed to be written in it, by hand or in a digital record, on the day it happens. Students often regard the notebook as a chore. Experienced scientists regard it as the foundation on which everything else rests.

The reasons become clear when something goes wrong. In one case reported by the chemist Tomas Ferro, a student in his group produced a compound that behaved in a remarkable way: it dissolved in water at room temperature, which no one had expected. The result was exciting, and the group began to plan a paper. But when other students tried to repeat the experiment, the compound would not dissolve. For two weeks no one could explain the difference.

The explanation was found in the notebook. On the day of the first experiment, the student had written a small note in the margin: the usual bottle of one chemical had run out, and he had used a new bottle from a different supplier. No one had thought this important at the time. When the group tested the new bottle, they found that it contained a small amount of another substance, and that this substance was responsible for the remarkable result. The discovery was real, but it was not the discovery they had thought.

Without the note, Ferro wrote, the group might have published a result that no one could repeat, or abandoned a finding that turned out to be useful. The notebook did not record what the student thought mattered. It recorded what he did, including details that seemed trivial, and that was precisely its value.

A good notebook follows a few principles. Entries are dated and written at the time, not reconstructed later from memory. Mistakes are crossed out with a single line, so that they remain readable, rather than erased. Every sample is labeled in a way that links it to a page. The notebook records not only results but plans, so that a reader can see what the researcher expected before the experiment and compare it with what happened. And entries are written for a reader who was not present: another student, a future colleague, or the researcher herself a year later, who will have forgotten almost everything.

The notebook also has a role beyond the laboratory. When a result is questioned, or when two groups argue about who discovered something first, the notebook is the evidence. Some universities require that notebooks remain the property of the laboratory, so that they can be examined long after a student has left. In a few well-known disputes, careers have depended on whether a page was dated honestly.

Digital records have changed the form of the notebook but not its purpose. Many groups now keep their records in shared databases, where entries cannot be changed without leaving a trace of the change. This makes the record more reliable, but it does not make it complete. A database records what is typed into it, and a researcher who does not write down the change of bottle will be no better served by a computer than by paper. The habit of careful recording, Ferro concluded, is not a technical skill. It is a form of honesty with oneself.`,
      [research, sources, citing, academic(1), academic(3)],
      [
        ask(
          t("What explained the compound's unexpected behavior?", "什么解释了那种化合物出人意料的表现？"),
          t("A new bottle of a chemical contained a small amount of another substance", "一瓶新换的化学试剂里含有少量另一种物质"),
          [
            t("The student had measured the temperature wrongly", "学生把温度测错了"),
            t("The other students had used a different notebook", "其他学生用了另一本记录本"),
            t("The compound had been stored in the wrong room", "化合物被存放在了错误的房间"),
          ],
          t(
            "The note in the margin recorded a new bottle from a different supplier, and testing it showed another substance was responsible.",
            "页边的记录写明换用了另一家供应商的新瓶试剂，检测后发现是其中的另一种物质起了作用。",
          ),
        ),
        ask(
          t("Why are mistakes crossed out with a single line rather than erased?", "为什么错误要用一条线划掉而不是擦掉？"),
          t("So that they remain readable as part of the record", "这样它们仍然可读，成为记录的一部分"),
          [
            t("Because erasing damages the paper", "因为擦除会损坏纸张"),
            t("So that the notebook looks neater", "这样记录本看起来更整洁"),
            t("Because the university forbids erasers", "因为大学禁止使用橡皮"),
          ],
          t(
            "The passage lists this principle: mistakes are crossed out with a single line, so that they remain readable.",
            "文章列出了这条原则：错误用一条线划掉，以便仍然能看清。",
          ),
        ),
        ask(
          t("What is Ferro's conclusion about digital records?", "费罗对电子记录的结论是什么？"),
          t("They are more reliable but cannot replace the habit of writing everything down", "它们更可靠，但不能代替把一切都记下来的习惯"),
          [
            t("They have made paper notebooks completely unnecessary", "它们使纸质记录本完全没有必要了"),
            t("They are less reliable than paper and should be avoided", "它们不如纸质可靠，应该避免使用"),
            t("They record changes that researchers forget to type", "它们会记录研究者忘记输入的改动"),
          ],
          t(
            "The last paragraph says a database records only what is typed into it, so careful recording remains a habit of honesty.",
            "最后一段说，数据库只记录输入的内容，所以认真记录依然是一种诚实的习惯。",
          ),
        ),
      ],
      ["Tomas", "Ferro"],
    ),
    passage(
      "an-experiment-that-surprised",
      t("An Experiment That Surprised", "出人意料的实验"),
      `The psychologist Ruth Adair expected her experiment to confirm what most of her colleagues already believed. Her question concerned praise. Earlier studies had suggested that children who were praised for their intelligence ("You are so clever") later avoided difficult tasks, while children praised for their effort ("You worked hard on that") sought them out. Adair planned to repeat this finding with older students, aged fifteen to seventeen, and then to extend it.

The design was simple. Three hundred students completed a set of puzzles. Afterward, one third were praised for their intelligence, one third for their effort, and one third received no praise. Then all were offered a choice between an easy set of puzzles and a hard one. If the earlier findings held, the students praised for effort should choose the hard set more often.

They did not. The three groups chose the hard set at almost exactly the same rate. Adair's first reaction, she later wrote, was to assume that she had made an error. She checked the data, the instructions and the procedure, and found nothing wrong. Her second reaction was to wonder whether the result was worth publishing at all. A finding that something does not happen is less exciting than a finding that it does, and journals have often been reluctant to publish such results.

What she did next is a model of how a surprising result can be handled. First, she resisted the temptation to search the data for some smaller group in which the expected effect appeared. With three hundred students, it would almost certainly have been possible to find, by chance, a subgroup in which praise for effort seemed to matter. Reporting such a finding as if it had been planned would have been misleading.

Second, she asked why older students might differ from younger ones. She returned to the literature and found that most of the earlier studies had worked with children under twelve. A few researchers had speculated that teenagers, who are more aware of how adults try to influence them, might react to praise with suspicion. One of Adair's students had said exactly this in a conversation after the experiment: "We could tell what the praise was for."

Third, she designed a second study to test this explanation directly, asking students afterward what they thought the praise was intended to do. Students who said they had seen through the praise were indeed unaffected by it.

Adair published both studies together. Her paper did not claim that earlier research was wrong. It argued that the effect of praise depends on age and on whether the person praised recognizes it as an attempt to influence them. The claim was narrower than the one she had set out to confirm, but it was better supported, and it explained a pattern that earlier work had not considered.

The episode illustrates a point that is easy to state and hard to practice. An experiment is a question put to the world, and the world is free to give an unexpected answer. A researcher who treats surprise as an error to be corrected will learn only what she already believed. One who treats it as information, and follows it with care, may learn something new.`,
      [research, sources, citing, academic(2), academic(3)],
      [
        ask(
          t("What did Adair's first experiment find?", "阿代尔的第一个实验发现了什么？"),
          t("The three groups chose the hard puzzles at almost the same rate", "三组学生选择难题的比例几乎相同"),
          [
            t("Students praised for effort chose the hard puzzles more often", "因努力受表扬的学生更多地选择了难题"),
            t("Students praised for intelligence refused to do any puzzles", "因聪明受表扬的学生拒绝做任何题"),
            t("Students who received no praise did best of all", "没有受到表扬的学生表现最好"),
          ],
          t(
            "The third paragraph says they did not differ: the three groups chose the hard set at almost exactly the same rate.",
            "第三段说结果并无差别：三组学生选择难题的比例几乎完全相同。",
          ),
        ),
        ask(
          t("Why did Adair resist searching for a subgroup that showed the expected effect?", "阿代尔为什么不去寻找显示出预期效果的小组？"),
          t(
            "Such a subgroup could appear by chance, and reporting it as planned would mislead",
            "这样的小组可能偶然出现，把它当作预先计划的结果来报告会误导读者",
          ),
          [
            t("Her journal did not allow any analysis of subgroups", "她投稿的期刊不允许分析小组"),
            t("There were too few students to divide into groups", "学生人数太少，无法分组"),
            t("She had already decided not to publish the study", "她已经决定不发表这项研究"),
          ],
          t(
            "The passage says that with three hundred students such a subgroup could be found by chance, and reporting it as if planned would have been misleading.",
            "文章说，在三百名学生中很可能偶然找到这样的小组，若当作预先计划的结果来报告就会误导人。",
          ),
        ),
        ask(
          t("How did Adair's published paper relate to the earlier research?", "阿代尔发表的论文与先前的研究是什么关系？"),
          t(
            "It narrowed the earlier claim by showing that the effect depends on age and awareness",
            "它表明效果取决于年龄和是否察觉，从而缩小了先前观点的适用范围",
          ),
          [
            t("It argued that all the earlier research was wrong", "它认为先前的研究全都错了"),
            t("It repeated the earlier finding exactly", "它完全重复了先前的发现"),
            t("It ignored the earlier research entirely", "它完全忽略了先前的研究"),
          ],
          t(
            "The paper did not claim earlier work was wrong; it argued the effect depends on age and on recognizing the praise as influence, a narrower claim.",
            "论文没有说先前的研究错了，而是认为效果取决于年龄以及是否把表扬看作影响手段，这是一个范围更窄的观点。",
          ),
        ),
      ],
      ["Ruth", "Adair", "Adair's"],
    ),
    passage(
      "a-collaboration-across-fields",
      t("A Collaboration Across Fields", "跨领域的合作"),
      `The project began with a disagreement over lunch. Kofi Mensah, a historian, was describing his study of a famine that had struck a coastal region in the 1840s. The written records, he said, blamed the famine on a failure of the harvest, but they disagreed about the cause of that failure. Some blamed a long drought; others blamed a disease of the crops. His colleague Sara Lind, who studied the growth rings of trees, said that she could probably tell him which explanation was right.

Trees in many regions add one ring of wood each year, and the width of the ring reflects the conditions of that year. In a dry year the ring is narrow; in a wet year it is wide. By measuring the rings of old trees, and of wooden beams in old buildings, scientists can reconstruct the weather of past centuries. Lind had samples from the region Mensah studied going back four hundred years.

The resulting collaboration lasted three years, and both researchers later described it as the most rewarding and most difficult work of their careers. The difficulties were not personal. They arose from the different habits of two fields.

The first difficulty was language. When Mensah said that a source was "reliable", he meant that its author had been in a position to know what he reported and had no obvious reason to lie. When Lind used the same word, she meant that a measurement could be repeated with the same result. Each found the other's use of the word strange, and for months they misunderstood each other without noticing.

The second difficulty was evidence. Lind's tree rings gave a precise record of rainfall but said nothing about disease. Mensah's documents described the suffering of the famine in detail but were vague about the weather. Neither kind of evidence could answer the question alone. The answer, when it came, depended on combining them: the rings showed that the two years before the famine had normal rainfall, which made a drought unlikely, while the documents showed that the failure began in one district and spread along the roads to others, as a disease would.

The third difficulty was publication. Historians usually publish books, written by one author over several years. Scientists usually publish short articles, written by several authors, as quickly as possible. Each field had its own journals, and each regarded the other's journals as unfamiliar. In the end, the pair published twice: a short article in a journal of climate science and a longer essay in a journal of history, each written for its own readers.

Interdisciplinary research is often praised in general and rarely supported in practice. Departments hire, promote and fund researchers according to the standards of their own fields, and work that falls between fields can be hard to judge. Mensah and Lind succeeded partly because each was already established and could afford to spend three years on work that neither department fully understood. Their advice to younger researchers was practical: agree early on what the key words mean, agree on what would count as an answer, and decide before beginning where the results will be published and who will be named as authors.`,
      [research, sources, citing, academic(1), academic(2)],
      [
        ask(
          t("What could tree rings tell the researchers?", "树木年轮能告诉研究者什么？"),
          t("How much rain fell in each past year", "过去每一年的降雨量多少"),
          [
            t("Which crops were struck by disease", "哪些作物得了病"),
            t("How many people died in the famine", "饥荒中死了多少人"),
            t("Which written records were honest", "哪些书面记录是诚实的"),
          ],
          t(
            "The passage explains that a narrow ring marks a dry year and a wide one a wet year, so the rings give a precise record of rainfall but say nothing about disease.",
            "文章解释说，窄的年轮代表干旱年份，宽的代表多雨年份，所以年轮能精确记录降雨，却无法说明病害。",
          ),
        ),
        ask(
          t('Why did the two researchers misunderstand the word "reliable"?', "两位研究者为什么会误解“可靠”这个词？"),
          t("Each field used the word with a different meaning", "两个领域对这个词的用法含义不同"),
          [
            t("Neither of them knew what the word meant", "他们都不知道这个词的意思"),
            t("They spoke different first languages", "他们的母语不同"),
            t("One of them was deliberately misleading the other", "其中一人故意误导另一人"),
          ],
          t(
            "For the historian it meant an author in a position to know and with no reason to lie; for the scientist it meant a measurement that could be repeated.",
            "对历史学家来说，它指作者了解情况且没有理由撒谎；对科学家来说，它指测量结果可以重复。",
          ),
        ),
        ask(
          t("How did the researchers conclude that the famine was caused by disease?", "研究者是怎样得出饥荒由病害引起的结论的？"),
          t(
            "The rings showed normal rainfall, and the documents showed the failure spreading along roads",
            "年轮显示降雨正常，而文献显示歉收沿着道路蔓延",
          ),
          [
            t("The documents all agreed that it was a disease", "所有文献都一致认为是病害"),
            t("The rings showed a long and severe drought", "年轮显示有一场漫长而严重的干旱"),
            t("A third researcher tested samples of the old crops", "第三位研究者检测了古代作物的样本"),
          ],
          t(
            "The answer combined both kinds of evidence: normal rainfall made drought unlikely, and the spread from one district along roads fit a disease.",
            "答案结合了两种证据：降雨正常使干旱的可能性很小，而从一个地区沿道路扩散的情况符合病害的特点。",
          ),
        ),
      ],
      ["Kofi", "Mensah", "Sara", "Lind", "Lind's", "Mensah's"],
    ),
    passage(
      "a-result-that-would-not-replicate",
      t("A Result That Would Not Replicate", "无法重复的结果"),
      `In 2014 a short article in a respected journal reported a striking finding. People who had just read a passage about old age, the authors claimed, walked more slowly down a corridor afterward than people who had read a neutral passage. The article was widely discussed, cited hundreds of times and described in popular books as evidence of how easily our behavior is shaped by ideas we are not aware of.

Seven years later, a group of researchers led by Hana Brecht set out to repeat the study. They followed the original method as closely as they could, with the same passages, the same corridor length and the same instructions. They also did several things the original authors had not. They tested many more people: twelve hundred, rather than sixty. They timed the walking with electronic sensors rather than with a person holding a watch. And they published their plan before collecting any data, stating in advance exactly what they would measure and how they would analyze it.

They found no effect. People who read about old age walked at the same speed as everyone else.

A failure to replicate does not by itself prove that the original finding was false. There are other possibilities. The two studies might have differed in some way no one noticed: a different population, a different time of year, a slightly different wording. The original effect might be real but much smaller than first reported, too small to matter in practice. Brecht and her colleagues were careful to discuss these possibilities, and they noted that the original authors had acted honestly by the standards of their time.

But their study pointed to problems that were not unique to this case. With only sixty participants, the original study had little chance of detecting a small effect reliably; a striking result in a small study is more likely than most readers assume to be a product of chance. The person timing the walks had known which passage each participant had read, and may have been influenced, without intending it, by what he expected to see. And the original article, like many at the time, had not stated in advance what would be measured, leaving room for the authors to choose, after the fact, the analysis that produced the clearest result.

Brecht's study was one of hundreds of replication attempts carried out in psychology during the 2010s. Many famous findings held up; a substantial number did not. The episode is sometimes described as a crisis, and it caused real embarrassment. It also produced reforms. Many journals now encourage researchers to register their plans before collecting data, to share their data with readers, and to test enough people to detect the effects they are looking for. Some journals now publish replications as a regular part of their work.

For a student reading the literature, the lesson is not to distrust all research. It is to ask a few questions of any single study, especially a surprising one. How many people were studied? Was the plan stated in advance? Has anyone repeated the work, and with what result? A finding that has been replicated by independent researchers deserves far more confidence than one that rests on a single article, however often that article has been cited.`,
      [research, sources, citing, academic(1), academic(2), academic(3)],
      [
        ask(
          t("Which of these did Brecht's study do that the original study had not?", "下面哪一项是布雷希特的研究做了而原研究没有做的？"),
          t("Published its plan before collecting any data", "在收集数据之前公布了研究计划"),
          [
            t("Used different passages about old age", "使用了不同的关于老年的文章"),
            t("Tested fewer people to save time", "为节省时间测试了更少的人"),
            t("Had a person time the walks with a watch", "让一个人用手表为步行计时"),
          ],
          t(
            "The second paragraph lists more people, electronic sensors and a plan published before collecting data; the passages were the same as the original's.",
            "第二段列出了更多的参与者、电子传感器以及在收集数据前公布的计划；所用的文章与原研究相同。",
          ),
        ),
        ask(
          t("According to the passage, what does a failure to replicate show?", "根据文章，重复研究失败说明了什么？"),
          t("It does not by itself prove the original finding false", "它本身并不能证明原来的发现是错的"),
          [
            t("It proves that the original authors were dishonest", "它证明原作者不诚实"),
            t("It shows that the original effect was large", "它表明原来的效应很大"),
            t("It means that psychology cannot be trusted", "它意味着心理学不可信"),
          ],
          t(
            "The fourth paragraph says a failure to replicate does not by itself prove the original false, and lists other possibilities.",
            "第四段说，重复失败本身不能证明原来的发现错误，并列出了其他的可能性。",
          ),
        ),
        ask(
          t(
            "What does the passage advise a student reading a single surprising study to do?",
            "对于读到一项令人惊讶的单项研究的学生，文章有什么建议？",
          ),
          t(
            "Ask how many people were studied, whether the plan was stated in advance, and whether it has been repeated",
            "问一问研究了多少人、计划是否事先说明、是否有人重复过这项研究",
          ),
          [
            t("Distrust all research in that field", "不相信该领域的所有研究"),
            t("Trust it if it has been cited many times", "如果它被引用了很多次，就相信它"),
            t("Ignore it until a popular book describes it", "在通俗书籍介绍它之前不予理会"),
          ],
          t(
            "The last paragraph lists these questions and warns that a finding is not more trustworthy simply because it is often cited.",
            "最后一段列出了这些问题，并提醒说，一项发现并不因为常被引用就更可信。",
          ),
        ),
      ],
      ["Hana", "Brecht", "Brecht's"],
    ),
  ],
};
