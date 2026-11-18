# Gaokao Chinese

> This is Great Academy's own outline. Its design is in the [Chinese curriculum](../chinese-curriculum.md) §8.5. [简体中文](chinese-gaokao.zh-CN.md).

- **Course:** `chinese-gaokao`, in the group Chinese Exams
- **Level:** The Chinese paper of China's university entrance examination, native speakers
- **Prerequisite(s):** [Chinese, Grade 9](chinese-grade-9.md)
- **Language of explanation:** Chinese
- **Size:** 11 units · 114 topics (12 new, all practice-only) · 313 knowledge points

## The Test

The paper's basis is level 4 of the academic quality of the senior standard. Its parts are the reading of modern texts, the reading of classical texts and poems with lines of recited texts written from memory, the use of language, and an essay; the papers of each year and region are to be checked before more exam topics are written. This course practises the parts judged by rules, idioms in context, lines of recited texts from their meaning, the words of classical Chinese, faulty sentences and rhetorical devices, and the choice questions on modern texts and classical poems, and the parts judged by a model against yes-or-no criteria, the short answers on modern texts and classical poems, the gaps filled and the sentences rewritten in the use of language, and the essay. Questions and texts of past papers are never copied: the recited texts are classical and in the public domain, and every passage, description, sentence and wrong answer is written for this subject.

## Aim

The course turns the two senior courses into test practice. It holds the units of [Chinese, Senior Required](chinese-hs-required.md) and [Chinese, Senior Selective Required](chinese-hs-selective.md), and then twelve exam topics that mix grades 7 to 11, as the paper does, rather than one set at a time. It teaches nothing new. Its own topics are practice-only: a lesson starts with practice, and the explanation appears only after a failed attempt. The topics it reuses keep their place in the graph, so a learner who has learned them in the grade courses is credited and moves on.

## Units

1 to 10. The units of [Chinese, Senior Required](chinese-hs-required.md) and [Chinese, Senior Selective Required](chinese-hs-selective.md), unchanged.

11. **Exam Practice**

- `gaokao-idioms` Gaokao: Idioms in Context (practice-only; after the last idiom set). The idioms of grades 7 to 11: (1) the idiom of a meaning among four of its set; (2) the idiom a sentence needs among the same.
- `gaokao-recitation` Gaokao: Lines from Their Meaning (practice-only; after the last recited text). The lines of the recited texts of grades 7 to 11: (1) the line of a description of meaning among four lines of other texts, without the title; (2) the line written in characters, given its author, title and meaning.
- `gaokao-classical-words` Gaokao: Words of Classical Chinese (practice-only; after the last drill of classical Chinese). The meaning or use of a character in brackets in a classical sentence, among four: (1) from the texts of grade 5 to grade 9; (2) from those of senior school.
- `gaokao-language` Gaokao: Use of Language (practice-only; after the last faulty-sentence and rhetoric topics). The sentences of every grade mixed: (1) the one sentence without a fault, its corrected form among three faulty sentences of its set; (2) the rhetorical device a sentence uses.
- `gaokao-language-writing` Gaokao: Writing in the Use of Language (practice-only; after the topic before). Answers written and judged by a model against three yes-or-no criteria each, on items written for the subject: (1) the sentences that fill the two or three gaps of a short passage, each within a limit of characters, fitting what comes before and after; (2) a sentence or passage rewritten as asked, such as a long sentence as several short ones, short ones as one, a passage pressed into one sentence, or a sentence imitated.
- `gaokao-informational-reading` Gaokao: Informational Texts (practice-only; after the last idiom set). Six arguments and expositions of about a thousand characters, written for the subject, each with four choice questions asked with two of their three wrong options in turn: (1) what the passage says; (2) how it reasons.
- `gaokao-informational-answers` Gaokao: Short Answers on Informational Texts (practice-only; after the topic before). Two questions a passage answered in a few sentences, judged by a model: the points asked for, each drawn from the passage, set out concisely.
- `gaokao-literary-reading` Gaokao: Literary Texts (practice-only; after the last idiom set). Four short stories and two literary essays written for the subject, asked as the informational texts are: (1) content and feeling; (2) craft.
- `gaokao-literary-answers` Gaokao: Short Answers on Literary Texts (practice-only; after the topic before). Two questions a passage answered in a few sentences, judged by a model: the technique named, its effect explained, and both tied to the words of the passage.
- `gaokao-poetry-reading` Gaokao: Classical Poems (practice-only; after the last recited text). Eight poems and ci from the Southern Dynasties to the Song, none of them a recited text, asked as the modern texts are: (1) content and feeling; (2) craft.
- `gaokao-poetry-answers` Gaokao: Short Answers on Classical Poems (practice-only; after the topic before). Two questions a poem answered in a few sentences, judged by a model with the criteria of the literary texts: the technique named, its effect explained, and both tied to the words of the poem.
- `gaokao-essay` Gaokao: The Essay (practice-only). An essay of at least 800 characters on original material written in the manner of the paper, judged by a model: (1) an apt thesis and a well-organised whole; (2) an argument of substance.

## Simulated Students

`pnpm nx run simulate:simulate -- chinese-gaokao`, the mean of 20 runs of each student. A placed student already knows the course's foundations.

| Student | Finished | Days | Lessons | Failed lessons | Reviews | Reviews per topic | Quizzes | Passages |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| strong | 20/20 | 125.10 | 168.55 | 1.10 | 611.20 | 3.65 | 33.60 | 0.00 |
| typical | 20/20 | 144.70 | 181.50 | 14.05 | 688.20 | 4.11 | 30.55 | 0.00 |
| struggling | 20/20 | 197.40 | 251.65 | 84.20 | 969.90 | 5.79 | 30.05 | 0.00 |
| placed | 20/20 | 91.25 | 118.15 | 10.00 | 445.50 | 4.12 | 19.15 | 0.00 |
| struggling, placed | 20/20 | 128.35 | 161.80 | 53.65 | 616.65 | 5.70 | 19.20 | 0.00 |
