# Gaokao Chinese

> This is Great Academy's own outline. Its design is in the [Chinese curriculum](../chinese-curriculum.md) §8.5. [简体中文](chinese-gaokao.zh-CN.md).

- **Course:** `chinese-gaokao`, in the group Chinese Exams
- **Level:** The Chinese paper of China's university entrance examination, native speakers
- **Prerequisite(s):** [Chinese, Grade 9](chinese-grade-9.md)
- **Language of explanation:** Chinese
- **Size:** 9 units · 101 topics (3 new, all practice-only) · 290 knowledge points

## The Test

The paper's basis is level 4 of the academic quality of the senior standard. Its parts are the reading of modern texts, the reading of classical texts and poems with lines of recited texts written from memory, the use of language, and an essay; the papers of each year and region are to be checked before more exam topics are written. This course practises the parts judged by rules: idioms in context, lines of recited texts from their meaning, and the words of classical Chinese. Questions and texts of past papers are never copied: the recited texts are classical and in the public domain, and every description, sentence and wrong answer is written for this subject.

## Aim

The course turns the two senior courses into test practice. It holds the units of [Chinese, Senior Required](chinese-hs-required.md) and [Chinese, Senior Selective Required](chinese-hs-selective.md), and then three exam topics that mix grades 7 to 11, as the paper does, rather than one set at a time. It teaches nothing new. Its own topics are practice-only: a lesson starts with practice, and the explanation appears only after a failed attempt. The topics it reuses keep their place in the graph, so a learner who has learned them in the grade courses is credited and moves on.

## Units

1 to 8. The units of [Chinese, Senior Required](chinese-hs-required.md) and [Chinese, Senior Selective Required](chinese-hs-selective.md), unchanged.

9. **Exam Practice**

- `gaokao-idioms` Gaokao: Idioms in Context (practice-only; after the last idiom set). The idioms of grades 7 to 11: (1) the idiom of a meaning among four of its set; (2) the idiom a sentence needs among the same.
- `gaokao-recitation` Gaokao: Lines from Their Meaning (practice-only; after the last recited text). The lines of the recited texts of grades 7 to 11: (1) the line of a description of meaning among four lines of other texts, without the title; (2) the line written in characters, given its author, title and meaning.
- `gaokao-classical-words` Gaokao: Words of Classical Chinese (practice-only; after the last drill of classical Chinese). The meaning or use of a character in brackets in a classical sentence, among four: (1) from the texts of grade 5 to grade 9; (2) from those of senior school.

**Later, with judged answers:** the reading of modern texts and of classical poems, the use of language beyond idioms, and the essay.

## Simulated Students

`pnpm nx run simulate:simulate -- chinese-gaokao`, the mean of 20 runs of each student. A placed student already knows the course's foundations.

| Student | Finished | Days | Lessons | Failed lessons | Reviews | Reviews per topic | Quizzes | Passages |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| strong | 20/20 | 98.85 | 141.40 | 1.00 | 507.85 | 3.62 | 26.45 | 0.00 |
| typical | 20/20 | 115.20 | 152.15 | 11.75 | 567.45 | 4.04 | 24.10 | 0.00 |
| struggling | 20/20 | 159.40 | 211.95 | 71.55 | 808.35 | 5.76 | 23.50 | 0.00 |
| placed | 20/20 | 81.95 | 107.05 | 9.15 | 401.25 | 4.09 | 17.15 | 0.00 |
| struggling, placed | 20/20 | 115.55 | 149.85 | 51.95 | 572.70 | 5.84 | 17.15 | 0.00 |
