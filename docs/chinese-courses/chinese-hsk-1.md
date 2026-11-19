# HSK 1

> This is Great Academy's own outline. Its design is in the [Chinese curriculum](../chinese-curriculum.md) §8.5. [简体中文](chinese-hsk-1.zh-CN.md).

- **Course:** `chinese-hsk-1`, in the group Chinese Exams
- **Level:** Level 1 of the new HSK, for learners of Chinese as a foreign language
- **Prerequisite(s):** [Pinyin](chinese-pinyin.md)
- **Language of explanation:** The interface language: Chinese or English
- **Size:** 14 units · 177 topics (9 new, all practice-only) · 431 knowledge points

## The Test

The new HSK has nine levels built on the *Chinese Proficiency Grading Standards for International Chinese Language Education* (GF 0025-2021), which level 1 of this subject follows. In the structure of the papers the test owner published in December 2025, HSK 1 has 40 items: listening in four parts of five and reading in four parts of five; there is no writing paper. This course practises what each part asks in some form: the word that fills a sentence, the meaning of a word, the character of a word, building sentences, words and sentences heard, repeating, reading aloud and answering a question heard. Questions, texts and word lists of the test are never copied: every item here comes from the data of level 1 or is written for this course.

## Aim

The course turns level 1 into test practice. It holds the units of [Chinese Level 1](chinese-level-1.md), so a learner who has not taken it learns it here, and then nine exam topics that mix the words and characters of every theme, as a test does, rather than one batch at a time. It teaches nothing new. Its own topics are practice-only: a lesson starts with practice, and the explanation appears only after a failed attempt. The topics it reuses keep their place in the graph, so a learner who has learned them in the level course is credited and moves on.

## Units

1 to 13. The units of [Chinese Level 1](chinese-level-1.md), unchanged, its unit of writing characters by hand last.

14. **Exam Practice**

- `hsk-1-gaps` HSK 1: Words in Sentences (practice-only; after the last word topic of level 1). Every sentence of level 1 with its gap: (1) five words to choose from, all of its batch, none of those kept apart from it; (2) six, or five where the batch has no more that could not also fit.
- `hsk-1-meanings` HSK 1: Words and Meanings (practice-only). Every word of level 1: (1) the word of a meaning among four; (2) the meaning of a word among four, in the learner's language.
- `hsk-1-characters` HSK 1: Characters (practice-only). Every character of level 1: (1) by its reading and meaning, among characters that look like it; (2) the character missing from a word of level 1, given the word's pinyin and meaning, among the same, leaving out a word whose meaning would give it away.
- `hsk-1-sentences` HSK 1: Building Sentences (practice-only; after the last sentence-building topic of level 1). The sentences of the sentence-building topics of level 1, mixed, each topic in turn: (1) short ones of three or four parts; (2) longer ones of five to seven.
- `hsk-1-listening` HSK 1: Listening (practice-only; after the last listening topic of level 1). The words and sentences of every unit of level 1, heard without being seen, the units taking turns: (1) the meaning of a word heard, among three; (2) the word heard in a sentence, among three.
- `hsk-1-speaking` HSK 1: Speaking (practice-only; after the last speaking topic of level 1). The same words and sentences, heard by a speech service: (1) a word said after its recording; (2) a sentence read aloud.
- `hsk-1-dialogues` HSK 1: Dialogues and Talks (practice-only; after `hsk-1-listening`). Dialogues between a woman and a man, written for this course in the characters of the levels it tests and heard in two voices without being seen, each with a question of three answers, as the listening paper asks: (1) short dialogues of two lines; (2) longer ones with several questions.
- `hsk-1-passages` HSK 1: Reading Texts (practice-only; after `hsk-1-gaps`). Texts in the same characters, each with a question of three answers, as the reading paper asks: (1) short texts; (2) longer passages with several questions.
- `hsk-1-answering` HSK 1: Answering Questions (practice-only; after `hsk-1-speaking`). Questions written for this course in the characters of the levels it tests, each heard and answered aloud in a whole sentence that takes up the question's words, as a hint in the learner's language says, and heard by a speech service against the answers accepted.

**Not yet practised:** the spoken tasks that need a free answer, such as retelling, describing a picture and answering at length: they would be judged by a model, and a spoken topic is checked by rules.

## Simulated Students

`pnpm nx run simulate:simulate -- chinese-hsk-1`, the mean of 20 runs of each student. A placed student already knows the course's foundations.

| Student | Finished | Days | Lessons | Failed lessons | Reviews | Reviews per topic | Quizzes | Passages |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| strong | 20/20 | 92.20 | 170.15 | 1.30 | 612.80 | 3.63 | 23.85 | 0.00 |
| typical | 20/20 | 108.55 | 180.75 | 11.90 | 677.50 | 4.01 | 21.70 | 0.00 |
| struggling | 20/20 | 148.70 | 244.30 | 75.45 | 934.95 | 5.52 | 20.80 | 0.00 |
| placed | 20/20 | 107.10 | 176.30 | 11.40 | 670.50 | 4.06 | 21.60 | 0.00 |
| struggling, placed | 20/20 | 145.05 | 235.75 | 70.85 | 911.15 | 5.51 | 20.05 | 0.00 |
