// Grade 12: the reading unit of the fifth theme, literature across languages, from three standards of
// translation and a writer who wanted translations to feel foreign to a poet who translated himself, the woman
// who brought Russian novels into English, three versions of an old Japanese novel, a story about a man who
// rewrote a classic, machines that translate and words said to have no translation.

import { type ReadingUnitDef, t } from "@ga/content";
import { ask, passage } from "../grade-5/reading-kit.ts";

const translation = { topic: "words-of-translation-and-meaning", weight: 0.3 } as const;
const worldlit = { topic: "words-of-world-literature", weight: 0.3 } as const;
const comparing = { topic: "comparing-translations", weight: 0.2 } as const;
const academic10 = { topic: "academic-words-10", weight: 0.1 } as const;
const academic11 = { topic: "academic-words-11", weight: 0.1 } as const;
const academic1 = { topic: "academic-words-1", weight: 0.1 } as const;
const academic2 = { topic: "academic-words-2", weight: 0.1 } as const;
const academic3 = { topic: "academic-words-3", weight: 0.1 } as const;

/** literatureAcrossLanguages is a reading unit of grade 12 on literature across languages, translation and meaning, and how to compare two versions of a text. */
export const literatureAcrossLanguages: ReadingUnitDef = {
  id: "literature-across-languages",
  title: t("Literature Across Languages", "跨越语言的文学"),
  passages: [
    passage(
      "three-difficulties-of-translation",
      t("Three Difficulties of Translation", "译事三难"),
      `In 1898, a Chinese scholar named Yan Fu published a translation of Evolution and Ethics, a set of lectures by the British scientist Thomas Huxley. In his preface, he wrote a short passage that has been quoted by Chinese translators ever since. Translation, he said, has three difficulties: faithfulness, expressiveness and elegance. A translation must be true to the meaning of the original; it must be clear and understandable to its readers; and it must be written well.

Yan Fu knew both worlds. As a young man he had studied at a naval college in Britain, where he read widely in Western science and philosophy. He returned to a China that had been defeated in wars and was searching for ways to grow strong. He believed that Western ideas about evolution, economics and liberty could help, and he spent years translating major works, including Adam Smith's Wealth of Nations.

His own translations show how hard the three standards are to meet at once. To reach the educated readers he most wanted to persuade, he wrote in the classical Chinese of the old scholars, a style they respected, rather than in plainer language. He rearranged passages, added his own commentary, and sometimes changed Huxley's examples to Chinese ones. The result was elegant and widely read. A phrase from it, roughly "the strong survive by natural selection," became famous throughout China and shaped how a generation thought about the struggle between nations.

But was it faithful? Critics have pointed out that Yan Fu's version is in places less a translation than an adaptation: Huxley actually argued that human ethics should resist the harsh struggle of nature, while Yan Fu's readers often took the book as a call to win that struggle. In aiming for expressiveness and elegance, he had changed the emphasis of the original.

Later translators argued about the standards themselves. Some said faithfulness must always come first. Others asked whether elegance was a fair demand, since a rough original deserves a rough translation. Still others noted that the three standards often pull in opposite directions, so that every translation is a compromise.

Yet the passage has lasted because it names the problem clearly. Every translator faces the same three questions: Is it true? Is it clear? Is it good? And every comparison of two translations can begin by asking which of those questions each one answered best.`,
      [translation, comparing, academic10],
      [
        ask(
          t("What are the three difficulties of translation that Yan Fu named?", "严复提出的译事三难是什么？"),
          t("Faithfulness, expressiveness and elegance", "信、达、雅"),
          [
            t("Speed, accuracy and low cost", "速度、准确和低成本"),
            t("Grammar, spelling and punctuation", "语法、拼写和标点"),
            t("Science, economics and liberty", "科学、经济和自由"),
          ],
          t(
            "The first paragraph says translation has three difficulties: faithfulness, expressiveness and elegance.",
            "第一段说翻译有三难：信、达、雅。",
          ),
        ),
        ask(
          t("Why did Yan Fu write in classical Chinese?", "严复为什么用文言文写作？"),
          t("To reach the educated readers he most wanted to persuade", "为了打动他最想说服的那些有学问的读者"),
          [
            t("Because it was the only Chinese he could write", "因为那是他唯一会写的中文"),
            t("Because Huxley had asked him to use an old style", "因为赫胥黎要求他使用古旧的文体"),
            t("To make the book easier for children to read", "为了让孩子们更容易读这本书"),
          ],
          t(
            "The third paragraph says he wrote in classical Chinese to reach the educated readers he most wanted to persuade, a style they respected.",
            "第三段说他用文言文是为了打动他最想说服的有学问的读者，因为他们尊重这种文体。",
          ),
        ),
        ask(
          t("In what way was Yan Fu's translation not fully faithful?", "严复的译本在哪方面不完全忠实？"),
          t("It changed the emphasis of Huxley's argument about nature and ethics", "它改变了赫胥黎关于自然与伦理的论证重点"),
          [
            t("It left out every one of Huxley's lectures", "它漏掉了赫胥黎的所有讲座"),
            t("It was translated from a French version, not English", "它是从法文版而不是英文版翻译的"),
            t("It used too many plain words that scholars disliked", "它使用了太多学者不喜欢的平白词语"),
          ],
          t(
            "The fourth paragraph says Huxley argued ethics should resist nature's struggle, while Yan Fu's readers took the book as a call to win it.",
            "第四段说赫胥黎主张伦理应抵抗自然的竞争，而严复的读者却把这本书当作赢得竞争的号召。",
          ),
        ),
      ],
      [
        "Yan",
        "Fu",
        "Fu's",
        "Thomas",
        "Huxley",
        "Huxley's",
        "Evolution",
        "Ethics",
        "Britain",
        "British",
        "China",
        "Chinese",
        "English",
        "Adam",
        "Smith",
        "Smith's",
        "Wealth",
        "Nations",
        "Western",
      ],
    ),
    passage(
      "a-translation-that-felt-foreign",
      t("A Translation That Felt Foreign", "让人感到陌生的译文"),
      `In 1909, two young Chinese brothers studying in Tokyo published a small anthology of stories from Russia and Eastern Europe, translated into Chinese. One of them would later become famous under the pen name Lu Xun. The book was a failure. In its first months it sold only a few dozen copies. Readers found the stories strange, and the translation, which followed the originals closely, difficult.

Lu Xun did not change his mind about how to translate. Two decades later, he became the most famous defender of what he called "hard translation": keeping the sentence structure of the original language even when it made the Chinese sound awkward. A long modifier that came before a noun in the original would be kept before the noun in Chinese, however long. A complicated chain of clauses would be kept as a chain.

His reasons were not simply about fidelity to the original. He believed that the Chinese language of his time lacked the precision needed for modern thought, and that importing foreign structures could enrich it. Readers would have to work, but in working they would learn new ways of expressing ideas. A smooth translation that made every foreign book sound like a Chinese one would hide what was different about it and teach the reader nothing new.

His critics strongly disagreed. Around 1929, the writer Liang Shiqiu argued that Lu Xun's translations were so stiff that they were nearly unreadable, and called the method "dead translation." What is the use, Liang asked, of a translation that a reader cannot understand? A translator's duty is to the reader as well as to the author. The debate between the two men grew bitter and was mixed with politics, but its central question was a real one.

That question still divides translators. Some prefer translations that are idiomatic, that read as if they had been written in the reader's own language. Others prefer translations that keep some of the strangeness of the original, so that readers remember they are visiting another culture. Each choice gains something and loses something.

Lu Xun's hard translations are seldom read today, but his argument has proved influential. Many words and structures that entered Chinese through translation in his time now seem perfectly natural. A language, he believed, grows by meeting other languages, and translation is where they meet.`,
      [translation, worldlit, academic11, academic3],
      [
        ask(
          t('What was Lu Xun\'s method of "hard translation"?', "鲁迅的“硬译”方法是什么？"),
          t("Keeping the original sentence structure even if the Chinese sounded awkward", "即使中文听起来别扭，也保留原文的句子结构"),
          [
            t("Translating only the hardest books in world literature", "只翻译世界文学中最难的书"),
            t("Rewriting foreign stories so they sounded completely Chinese", "改写外国故事，使它们听起来完全像中文"),
            t("Translating very slowly to avoid any mistakes", "翻译得很慢以避免任何错误"),
          ],
          t(
            "The second paragraph defines hard translation as keeping the sentence structure of the original even when it made the Chinese sound awkward.",
            "第二段把硬译定义为即使中文听起来别扭，也保留原文的句子结构。",
          ),
        ),
        ask(
          t("Why did Lu Xun believe hard translation was worth the difficulty?", "鲁迅为什么认为硬译值得这样的难度？"),
          t("Importing foreign structures could make Chinese more precise", "引进外国的句式可以让中文更加精确"),
          [
            t("Readers enjoyed difficult books more than easy ones", "读者喜欢难读的书胜过容易读的书"),
            t("It was faster than other ways of translating", "它比其他翻译方法更快"),
            t("Publishers paid more for difficult translations", "出版商为难懂的译本付更多的钱"),
          ],
          t(
            "The third paragraph says he believed Chinese lacked precision for modern thought and that importing foreign structures could enrich it.",
            "第三段说他认为当时的中文缺乏表达现代思想所需的精确性，引进外国句式可以丰富它。",
          ),
        ),
        ask(
          t("What was Liang Shiqiu's main objection?", "梁实秋的主要反对意见是什么？"),
          t("A translation the reader cannot understand is of little use", "读者看不懂的译文没有多大用处"),
          [
            t("Lu Xun had chosen books that were too short", "鲁迅选的书太短了"),
            t("Translators should never read the original text", "译者绝不应该读原文"),
            t("Foreign literature should not be translated at all", "外国文学根本不应该被翻译"),
          ],
          t(
            "The fourth paragraph says Liang asked what use a translation is if a reader cannot understand it, since a translator's duty is also to the reader.",
            "第四段说梁实秋问，读者看不懂的译文有什么用，因为译者也要对读者负责。",
          ),
        ),
      ],
      [
        "Lu",
        "Xun",
        "Xun's",
        "Zhou",
        "Zuoren",
        "Liang",
        "Shiqiu",
        "Tokyo",
        "Japan",
        "Japanese",
        "China",
        "Chinese",
        "Russian",
        "European",
        "Eastern",
        "Europe",
        "Russia",
      ],
    ),
    passage(
      "the-poet-who-translated-himself",
      t("The Poet Who Translated Himself", "自译的诗人"),
      `In 1912, an Indian poet named Rabindranath Tagore traveled to London carrying a notebook. During the voyage, and during an illness before it, he had translated some of his own Bengali poems into English prose. He showed the notebook to a painter friend, who passed it to the Irish poet William Butler Yeats. Yeats was deeply moved. He wrote an introduction, and later that year the book was published in English as Gitanjali, meaning "song offerings."

The success was astonishing. The following year, Tagore was awarded the Nobel Prize in Literature, the first writer from outside Europe to receive it. To most of the world, he was known almost entirely through the English versions of his poems. Readers praised their simplicity, their calm spirituality and their images of nature and devotion.

In Bengal, however, Tagore was known as something more: a poet of great technical skill whose verse was full of rhyme, rhythm and music, as well as a composer of songs that people sang every day. The English Gitanjali was something else. Tagore had rendered the poems in plain prose. He had left out many poems, shortened others, and in places combined lines from different poems. The music of the Bengali, which many Bengali readers considered the heart of the poetry, was almost entirely gone.

Over time, the English reputation faded. Readers in Europe began to find the poems vague and sweet. Tagore himself grew uneasy. In later letters, he admitted that he had not been a good translator of his own work and that the English versions gave a poor idea of the originals. Some scholars have argued that the fall of his reputation in the West was caused partly by the very translations that had made him famous.

His case raises an unusual question. When an author translates his own work, the translation has a special authority; no one knows better what the poet meant. Yet the poet may also feel free to change things in a way no other translator would dare, and may not be a master of the second language. Is a self-translation a faithful copy, or a new work?

Many critics now treat the English Gitanjali as a separate work, with its own beauty, related to the Bengali but not equivalent to it. Newer translations by others try to recover some of what was lost.`,
      [translation, worldlit, academic10, academic2],
      [
        ask(
          t("Why was the English Gitanjali so different from the Bengali poems?", "英文版《吉檀迦利》为什么与孟加拉语原诗如此不同？"),
          t(
            "Tagore wrote it in plain prose, cut and combined poems, and lost the music",
            "泰戈尔用平白的散文翻译，删减合并诗作，失去了音乐性",
          ),
          [
            t("Yeats rewrote every poem in his own style", "叶芝用自己的风格重写了每一首诗"),
            t("The publisher printed the wrong poems by mistake", "出版商误印了错误的诗"),
            t("The Bengali poems had no rhyme or rhythm at all", "孟加拉语原诗根本没有韵律和节奏"),
          ],
          t(
            "The third paragraph says Tagore rendered the poems in plain prose, left out and combined poems, and lost the music of the Bengali.",
            "第三段说泰戈尔用平白的散文翻译，删去或合并了一些诗，孟加拉语的音乐性几乎完全丧失。",
          ),
        ),
        ask(
          t("What did Tagore later admit about his translations?", "泰戈尔后来对自己的翻译承认了什么？"),
          t("They gave a poor idea of the original poems", "它们没能很好地体现原诗"),
          [
            t("They were better than the Bengali originals", "它们比孟加拉语原作更好"),
            t("They had been done by Yeats and not by him", "它们是叶芝而不是他翻译的"),
            t("They had never been meant for publication", "它们从来没打算出版"),
          ],
          t(
            "The fourth paragraph says that in later letters he admitted he had not been a good translator and the English versions gave a poor idea of the originals.",
            "第四段说他在后来的信中承认自己不是一个好的自译者，英文版没能很好地体现原作。",
          ),
        ),
        ask(
          t("How do many critics now treat the English Gitanjali?", "许多评论家现在如何看待英文版《吉檀迦利》？"),
          t("As a separate work related to the Bengali but not equivalent", "作为一部与孟加拉语原作相关但不等同的独立作品"),
          [
            t("As an exact copy of the Bengali original", "作为孟加拉语原作的精确复本"),
            t("As a forgery that Tagore did not write", "作为一部并非泰戈尔所写的伪作"),
            t("As the only version worth reading today", "作为今天唯一值得读的版本"),
          ],
          t(
            "The last paragraph says many critics treat it as a separate work with its own beauty, related to the Bengali but not equivalent to it.",
            "最后一段说许多评论家把它当作一部有自身之美的独立作品，与孟加拉语原作相关但不等同。",
          ),
        ),
      ],
      [
        "Rabindranath",
        "Tagore",
        "Tagore's",
        "Gitanjali",
        "Bengali",
        "India",
        "Indian",
        "English",
        "London",
        "William",
        "Butler",
        "Yeats",
        "Nobel",
        "Europe",
        "European",
        "Irish",
        "Bengal",
      ],
    ),
    passage(
      "the-woman-who-brought-russian-novels-into-english",
      t("The Woman Who Brought Russian Novels into English", "把俄国小说带进英语的女人"),
      `In the early 1890s, an Englishwoman named Constance Garnett began learning Russian, partly to pass the time during a difficult pregnancy. Within a few years she was translating Russian novels, and over the next four decades she translated about seventy volumes: nearly all of the fiction of Dostoevsky and Turgenev, much of Tolstoy and Chekhov, and more. For two generations of readers in Britain and America, the great Russian novelists spoke in her voice.

She worked with remarkable speed. She is said to have finished a page and tossed it aside to start the next without stopping, and her eyesight grew so weak that a secretary read the Russian aloud to her. Her English was clear, graceful and easy to read. Many writers, including some who later became famous, discovered Russian literature through her and were changed by it.

Later critics were less kind. The novelist Vladimir Nabokov, who wrote in both Russian and English, called her translations flat and complained of errors. The poet Joseph Brodsky said that English readers could barely tell Tolstoy from Dostoevsky, because they were really reading Garnett. Scholars pointed out that when she met a difficult word or phrase, she sometimes smoothed it over or left it out, and that her steady, polite style made very different authors sound alike. Dostoevsky's rough, nervous, repetitive prose became calm in her hands.

In the 1990s, two translators, Richard Pevear and Larissa Volokhonsky, began new versions of the major novels, aiming to stay much closer to the Russian, including its oddities. Their translations were praised as more faithful. They were also criticized, by other readers, as awkward and too literal, producing English that no one would naturally write.

Comparing these translations is instructive. A sentence that Garnett made smooth may appear in the newer version with the repetitions and strange word order of the original. One reader will say the newer version is truer; another will say Garnett's is more readable and captures the spirit if not the letter. Both judgments can be supported with evidence.

What is not in doubt is Garnett's achievement. Whatever her faults, she made a whole literature available to readers who would otherwise never have known it. Every later translator has worked in a world that she helped to create.`,
      [translation, worldlit, comparing, academic11, academic1],
      [
        ask(
          t("What was the main criticism of Garnett's translations?", "对加内特译本的主要批评是什么？"),
          t(
            "Her smooth style made different authors sound alike and hid difficulties",
            "她流畅的风格让不同的作家听起来都一样，并掩盖了难点",
          ),
          [
            t("She translated too few Russian novels to matter", "她翻译的俄国小说太少，无足轻重"),
            t("Her English was full of grammar mistakes", "她的英语满是语法错误"),
            t("She added long chapters of her own to the novels", "她给小说加入了很长的自写章节"),
          ],
          t(
            "The third paragraph says she smoothed over or left out difficult phrases and that her steady style made very different authors sound alike.",
            "第三段说她会把难懂的短语抹平或略去，她平稳的风格使截然不同的作家听起来都一样。",
          ),
        ),
        ask(
          t("How were the newer translations of the 1990s criticized?", "二十世纪九十年代的新译本受到了怎样的批评？"),
          t("As awkward and too literal", "生硬且过于直译"),
          [
            t("As too free and full of additions", "过于随意且有很多添加"),
            t("As copies of Garnett's earlier versions", "是加内特早期译本的翻版"),
            t("As translated from French instead of Russian", "是从法语而不是俄语翻译的"),
          ],
          t(
            "The fourth paragraph says other readers criticized them as awkward and too literal, producing English no one would naturally write.",
            "第四段说其他读者批评它们生硬、过于直译，写出的英语没人会自然地那样写。",
          ),
        ),
        ask(
          t("What does the writer say about comparing the translations?", "作者对比较这些译本是怎么说的？"),
          t("Different judgments of which is better can both be supported with evidence", "关于哪个更好的不同判断都能找到证据支持"),
          [
            t("Only one translation can ever be correct", "只有一个译本可能是正确的"),
            t("Readers should always prefer the newest version", "读者应该总是偏爱最新的版本"),
            t("Comparing translations is a waste of a reader's time", "比较译本是浪费读者的时间"),
          ],
          t(
            "The fifth paragraph says one reader will call the newer version truer and another Garnett's more readable, and both judgments can be supported with evidence.",
            "第五段说一个读者会说新版更忠实，另一个会说加内特的更好读，两种判断都能找到证据支持。",
          ),
        ),
      ],
      [
        "Constance",
        "Garnett",
        "Garnett's",
        "Russian",
        "Russia",
        "Tolstoy",
        "Tolstoy's",
        "Dostoevsky",
        "Dostoevsky's",
        "Chekhov",
        "Turgenev",
        "Vladimir",
        "Nabokov",
        "Joseph",
        "Brodsky",
        "English",
        "Britain",
        "Richard",
        "Pevear",
        "Larissa",
        "Volokhonsky",
        "America",
        "Englishwoman",
      ],
    ),
    passage(
      "three-versions-of-an-old-novel",
      t("Three Versions of an Old Novel", "一部古老小说的三个版本"),
      `About a thousand years ago, a woman at the imperial court of Japan, known to us as Murasaki Shikibu, wrote a long work of fiction about the life and loves of a prince named Genji. The Tale of Genji is often called the world's first novel. It is also one of the hardest works to translate. Its language is the court Japanese of its time, full of hints and poetry, and its characters are rarely named; they are referred to by their ranks or titles, which change as they rise and fall.

English readers have had three famous versions. The first, by Arthur Waley, appeared in six volumes between 1925 and 1933. Waley's Genji was a literary event. It was beautiful, flowing English, and readers fell in love with it. But Waley took great liberties. He expanded some passages, added explanations, cut others and left out one chapter entirely. His style made the book feel like an elegant European novel.

In 1976, Edward Seidensticker published a new version. It was much closer to the original, cutting nothing, and its style was plainer and more restrained. Where Waley's sentences were rich and decorative, Seidensticker's were spare. Some readers found it more accurate and more truly Japanese in its quietness; others missed Waley's magic.

In 2001, Royall Tyler published a third version that went further still. He tried to preserve features that both earlier translators had changed: he referred to characters by their titles, as the original does, instead of giving them names, and he kept the many short poems in a form close to the Japanese. He added notes to explain the court customs that a modern reader would not know. The result was the most faithful of the three, but also the most demanding to read.

Readers who compare the three can see how each translator answered the same questions differently. Should the translation read like an English novel, or should it keep the strangeness of a Japanese one? Should every detail be kept, even at the cost of ease? Should difficult customs be explained in notes, or quietly smoothed into the text?

No version is simply right. Each serves a different reader: one who wants a beautiful story, one who wants an accurate one, and one who wants to come as close as possible to what a reader at the old court experienced.`,
      [translation, worldlit, comparing, academic10, academic1],
      [
        ask(
          t("What makes The Tale of Genji especially hard to translate?", "什么使《源氏物语》特别难翻译？"),
          t(
            "Its court language is full of hints, and characters are called by changing titles",
            "它的宫廷语言充满暗示，人物用不断变化的头衔来称呼",
          ),
          [
            t("It was written in a language that no one can read today", "它是用今天没人能读懂的语言写的"),
            t("It is too short to give translators enough material", "它太短，给译者的材料不够"),
            t("Its author asked that it never be translated", "它的作者要求它永远不被翻译"),
          ],
          t(
            "The first paragraph says its court Japanese is full of hints and poetry, and characters are referred to by ranks or titles that change.",
            "第一段说它的宫廷日语充满暗示和诗歌，人物用会变化的官阶或头衔来称呼。",
          ),
        ),
        ask(
          t("How did Waley's version differ from Seidensticker's?", "韦利的译本和赛登施蒂克的译本有什么不同？"),
          t("Waley's was flowing and free, while Seidensticker's was closer and plainer", "韦利的流畅自由，赛登施蒂克的更贴近原文、更朴素"),
          [
            t("Waley's kept every chapter, while Seidensticker's cut several", "韦利的保留了每一章，赛登施蒂克的删了几章"),
            t("Waley's used notes, while Seidensticker's used none", "韦利的用了注释，赛登施蒂克的没有"),
            t("Waley's was in Japanese, while Seidensticker's was in English", "韦利的是日文，赛登施蒂克的是英文"),
          ],
          t(
            "The second and third paragraphs say Waley took liberties in flowing English, while Seidensticker cut nothing and wrote in a plainer, spare style.",
            "第二段和第三段说韦利以流畅的英语随意发挥，而赛登施蒂克一字不删，文风更朴素简洁。",
          ),
        ),
        ask(
          t("What is the writer's conclusion about the three versions?", "作者对这三个版本的结论是什么？"),
          t("Each serves a different kind of reader", "每个版本服务于不同类型的读者"),
          [
            t("Only Tyler's version is worth reading", "只有泰勒的版本值得一读"),
            t("Waley's version should be forgotten", "韦利的版本应当被遗忘"),
            t("All three are equally unfaithful", "三个版本同样不忠实"),
          ],
          t(
            "The last paragraph says no version is simply right and each serves a different reader.",
            "最后一段说没有哪个版本是绝对正确的，每个版本服务于不同的读者。",
          ),
        ),
      ],
      [
        "Murasaki",
        "Shikibu",
        "Genji",
        "Genji's",
        "Arthur",
        "Waley",
        "Waley's",
        "Edward",
        "Seidensticker",
        "Seidensticker's",
        "Royall",
        "Tyler",
        "Tyler's",
        "Japan",
        "Japanese",
        "English",
      ],
    ),
    passage(
      "the-man-who-rewrote-a-classic",
      t("The Man Who Rewrote a Classic", "重写经典的人"),
      `In 1939, the Argentine writer Jorge Luis Borges published a short story that reads like a scholarly article. It describes the work of an imaginary French writer named Pierre Menard. Menard's greatest project, the narrator tells us, was to write Don Quixote, the great Spanish novel published by Miguel de Cervantes three centuries earlier. Not to copy it, and not to write a modern version of it, but to produce, through his own effort, pages that would coincide word for word with Cervantes's original.

Menard considered first becoming Cervantes: learning old Spanish, forgetting the history of the centuries since, and so on. He rejected this as too easy. Instead he set himself to arrive at the same words while remaining himself, a Frenchman of the twentieth century. After years of work, he completed two chapters and part of a third. Then he burned his drafts.

The most famous part of the story comes when the narrator compares a passage from Cervantes with the identical passage by Menard. In Cervantes, the narrator says, the passage is simple praise of history, the kind of thing any writer of his time might say. In Menard, written by a modern man who knew the philosophy of the following centuries, the same words become an astonishing idea. The narrator also compares their styles: Cervantes wrote in the ordinary Spanish of his day, while Menard's Spanish is old-fashioned, even a little affected.

The story is a joke, but it is a joke with a serious point. It suggests that the meaning of a text does not lie only in its words. It depends also on who wrote them, when, and against what background, and on what the reader knows. The same sentence can mean different things in different times.

This idea matters for translation and for reading world literature. A translator cannot simply carry words from one language to another, because the words carried their meaning partly from their place in a culture. And a modern reader of an old book, even in its original language, is in a sense reading Menard's version: a text read with knowledge its first readers lacked.

Borges loved such puzzles, and his stories have been translated into dozens of languages. It is a fitting irony that readers who meet Pierre Menard in translation are themselves reading his words through someone else's.`,
      [worldlit, translation, academic11, academic1],
      [
        ask(
          t("What was Menard's project in the story?", "故事中梅纳尔的计划是什么？"),
          t("To produce pages identical to Don Quixote through his own effort", "通过自己的努力写出与《堂吉诃德》完全相同的篇章"),
          [
            t("To copy Don Quixote by hand in a beautiful script", "用漂亮的字体手抄《堂吉诃德》"),
            t("To write a modern version of Don Quixote set in France", "写一部以法国为背景的现代版《堂吉诃德》"),
            t("To translate Don Quixote into French", "把《堂吉诃德》翻译成法语"),
          ],
          t(
            "The first paragraph says his project was not to copy or modernize but to produce pages that would coincide word for word with Cervantes's original.",
            "第一段说他的计划不是抄写或改写成现代版，而是写出与塞万提斯原作逐字吻合的篇章。",
          ),
        ),
        ask(
          t(
            "Why does the narrator find Menard's identical passage different from Cervantes's?",
            "叙述者为什么认为梅纳尔一模一样的段落与塞万提斯的不同？",
          ),
          t("The same words mean something else when written in a later time", "同样的词写于后来的时代就有了不同的含义"),
          [
            t("Menard changed several important words in the passage", "梅纳尔改动了段落中几个重要的词"),
            t("Cervantes's passage was badly printed", "塞万提斯的段落印刷得很差"),
            t("Menard wrote his passage in French", "梅纳尔是用法语写的那一段"),
          ],
          t(
            "The third paragraph says that written by a modern man with later knowledge, the same words become a different and astonishing idea.",
            "第三段说由一个拥有后世知识的现代人写出来，同样的词就变成了一个不同的、惊人的思想。",
          ),
        ),
        ask(
          t("What does the story suggest about translation?", "这个故事对翻译有什么启示？"),
          t(
            "Words take part of their meaning from their culture, so they cannot simply be carried over",
            "词语的部分含义来自其文化，所以不能简单地搬运过去",
          ),
          [
            t("Translation is easy if the translator knows both languages", "只要译者懂两种语言，翻译就很容易"),
            t("Old books should never be translated", "古书永远不该被翻译"),
            t("Translators should try to become the original author", "译者应该努力变成原作者"),
          ],
          t(
            "The fifth paragraph says a translator cannot simply carry words over, because words carry their meaning partly from their place in a culture.",
            "第五段说译者不能简单地搬运词语，因为词语的部分含义来自它们在文化中的位置。",
          ),
        ),
      ],
      [
        "Jorge",
        "Luis",
        "Borges",
        "Borges's",
        "Pierre",
        "Menard",
        "Menard's",
        "Miguel",
        "Cervantes",
        "Cervantes's",
        "Quixote",
        "Don",
        "Spanish",
        "Argentine",
        "French",
      ],
    ),
    passage(
      "machines-that-translate",
      t("Machines That Translate", "会翻译的机器"),
      `In January 1954, a computer in New York translated more than sixty sentences from Russian into English. The demonstration, organized by a university and a computer company, was reported with excitement. Its organizers predicted that machine translation might be a solved problem within a few years. The Cold War was under way, and the government was eager for a fast way to read Russian science.

The prediction was wrong. The program had a vocabulary of about two hundred and fifty words and six rules of grammar, and the sentences had been carefully chosen. Real language proved far harder. Words have many meanings, and the right one depends on context. Sentences can be read in more than one way. By 1966, a government report concluded that machine translation was slower, less accurate and more expensive than human translation, and funding was cut sharply.

For decades, progress was slow. Early systems tried to write down the rules of each language by hand, and there were always more exceptions than rules. In the 1990s, researchers tried a different heuristic. Instead of teaching the computer rules, they gave it huge collections of texts that already existed in two languages, such as the records of the United Nations or the European Union, and let it calculate which words and phrases usually corresponded. The results were rough but usable.

The biggest change came around 2016, when systems based on neural networks, loosely modeled on the brain, began to translate whole sentences at once rather than piece by piece. Their output was suddenly fluent. Today, such tools are used by millions of people every day to read websites, write emails and talk with travelers.

Yet the old problems have not disappeared. Machines still make errors with words of more than one meaning, with jokes and idioms, and with the hidden assumptions of a culture. A system may translate a word for a doctor as male and a word for a nurse as female because that pattern was common in its training texts. It may produce a smooth sentence that is confidently wrong, which can be more dangerous than an awkward one, since its fluency hides the mistake.

For everyday purposes, machine translation is a remarkable tool. For literature, law and medicine, where a single word can matter, human judgment remains requisite. Most professional translators now use machines as a first step and then do the real work: deciding what the original means and how best to say it.`,
      [translation, academic10, academic11],
      [
        ask(
          t("Why was the 1954 prediction about machine translation wrong?", "为什么 1954 年关于机器翻译的预测是错的？"),
          t("The demonstration used chosen sentences, and real language proved far harder", "演示用的是挑选过的句子，而真实的语言要难得多"),
          [
            t("The computer broke down soon after the demonstration", "那台计算机在演示后不久就坏了"),
            t("Russian scientists refused to let their work be translated", "俄国科学家拒绝让他们的著作被翻译"),
            t("The government decided it no longer needed to read Russian", "政府认为不再需要阅读俄文"),
          ],
          t(
            "The second paragraph says the program had a small vocabulary and carefully chosen sentences, and real language proved far harder.",
            "第二段说程序词汇量很小，句子经过精心挑选，而真实的语言要难得多。",
          ),
        ),
        ask(
          t("What new approach did researchers take in the 1990s?", "研究人员在二十世纪九十年代采取了什么新方法？"),
          t("Calculating correspondences from large collections of texts in two languages", "从大量双语文本中计算对应关系"),
          [
            t("Writing down every rule of grammar by hand", "用手写下每一条语法规则"),
            t("Asking human translators to speak to the computer", "请人工译者对着计算机说话"),
            t("Translating only very short sentences", "只翻译非常短的句子"),
          ],
          t(
            "The third paragraph says they gave computers huge collections of texts in two languages and let them calculate which words and phrases corresponded.",
            "第三段说他们给计算机大量双语文本，让它计算哪些词和短语通常相对应。",
          ),
        ),
        ask(
          t(
            "Why can a smooth but wrong translation be more dangerous than an awkward one?",
            "为什么流畅但错误的译文可能比生硬的译文更危险？",
          ),
          t("Its fluency hides the mistake from the reader", "它的流畅让读者看不出错误"),
          [
            t("It takes longer for the machine to produce", "机器生成它需要更长时间"),
            t("It uses more words than the original", "它比原文用的词更多"),
            t("It can only be read by professional translators", "只有专业译者才能读懂它"),
          ],
          t(
            "The fifth paragraph says a smooth sentence that is confidently wrong can be more dangerous, since its fluency hides the mistake.",
            "第五段说一个自信而错误的流畅句子可能更危险，因为它的流畅掩盖了错误。",
          ),
        ),
      ],
      ["IBM", "Georgetown", "New", "York", "Russian", "English", "Cold", "War", "United", "Nations", "European", "Union", "January"],
    ),
    passage(
      "words-with-no-translation",
      t("Words with No Translation", "无法翻译的词"),
      `Books and websites love lists of "untranslatable words." The Portuguese word saudade, they say, means a deep longing for something or someone absent, perhaps never to return, mixed with a sweetness in remembering. The Danish word hygge means a cozy, warm feeling of comfort and contentment, often shared with friends on a dark winter evening. The Japanese komorebi is the sunlight that filters through the leaves of trees. The Chinese yuanfen is the fate or chance that brings people together. English, the lists suggest, has nothing like them.

Such lists are charming, and they point to something real. Every language divides experience in its own way. A word like saudade gathers into one idea feelings that English must describe with several. And the word carries associations that a definition cannot: songs, poems, a whole history of emigration and loss in Portugal and Brazil. A Portuguese speaker who hears it feels all of that at once.

But the claim that such words are untranslatable deserves a closer look. In one sense, almost nothing is untranslatable. The lists themselves translate every word they include; that is how we know what it means. What is missing is not the meaning but a single English word with the same meaning and the same associations. That is a different and much more common problem. Many ordinary words, such as the French word for a particular kind of bread, have no exact equivalent either.

Some linguists also warn against a romantic idea that often comes with these lists: that a people without a word for a feeling cannot have the feeling, or that a people with a special word feel it more deeply than others. Danes are not the only people who enjoy a warm evening with friends. English speakers can feel longing for something lost; they simply describe it with a phrase.

What the lists really show is the translator's daily problem. The translator must decide, again and again, whether to keep a foreign word and explain it, find a near equivalent and lose some associations, or use a longer phrase and lose the force of a single word. None of these choices is perfect.

Sometimes, the answer is to borrow. English has taken thousands of words from other languages, and hygge itself has begun to appear in English dictionaries. A word that was untranslatable may simply become, in time, a word of English.`,
      [translation, worldlit, comparing, academic11],
      [
        ask(
          t(
            'What does the writer say is really missing when a word is called "untranslatable"?',
            "作者说当一个词被称为“无法翻译”时，真正缺少的是什么？",
          ),
          t("A single English word with the same meaning and associations", "一个含义和联想都相同的英语单词"),
          [
            t("Any way at all to explain what the word means", "任何解释这个词含义的方法"),
            t("A dictionary of the original language", "原语言的一本词典"),
            t("People who speak both languages well", "精通两种语言的人"),
          ],
          t(
            "The third paragraph says the meaning is not missing; what is missing is a single English word with the same meaning and associations.",
            "第三段说缺少的不是意思，而是一个含义和联想都相同的英语单词。",
          ),
        ),
        ask(
          t("What romantic idea do some linguists warn against?", "一些语言学家告诫人们不要有什么浪漫化的想法？"),
          t("That people without a word for a feeling cannot have that feeling", "没有某种感受的词的民族就不会有这种感受"),
          [
            t("That every language divides experience in the same way", "每种语言都以同样的方式划分经验"),
            t("That English has borrowed too many foreign words", "英语借用了太多外来词"),
            t("That Portuguese songs are better than Danish ones", "葡萄牙歌曲比丹麦歌曲更好"),
          ],
          t(
            "The fourth paragraph warns against the idea that a people without a word for a feeling cannot have the feeling.",
            "第四段告诫人们不要认为一个没有某种感受之词的民族就不会有这种感受。",
          ),
        ),
        ask(
          t("What choices does the passage say a translator faces with such a word?", "文章说面对这样的词，译者有哪些选择？"),
          t("Keep and explain it, find a near equivalent, or use a longer phrase", "保留并解释它，找一个近似的对等词，或使用较长的短语"),
          [
            t("Delete it, replace it with a number, or leave a blank", "删除它，用数字代替，或者留空"),
            t("Ask the author, ask the reader, or ask a machine", "问作者，问读者，或问机器"),
            t("Translate it literally every single time", "每次都逐字直译"),
          ],
          t(
            "The fifth paragraph lists keeping and explaining the word, finding a near equivalent, or using a longer phrase, none of them perfect.",
            "第五段列出了保留并解释、找近似对等词、或使用较长短语这几种选择，没有一种是完美的。",
          ),
        ),
      ],
      [
        "Portuguese",
        "Danish",
        "Denmark",
        "Brazil",
        "Japanese",
        "Chinese",
        "English",
        "Portugal",
        "saudade",
        "hygge",
        "komorebi",
        "yuanfen",
        "Danes",
        "French",
      ],
    ),
  ],
};
