# Chinese Development Plan

> English | [简体中文](chinese-development-plan.zh-CN.md)

This document turns the design in [Chinese Curriculum](chinese-curriculum.md) into milestones: what to build, in which files, how each is checked, and which results let the next stage begin. The design document says what Chinese is; this one says in what order it is built. It follows [English Development Plan](english-development-plan.md), and reuses what English built.

---

## 1. How the Work Is Organized

| Stage | Delivers | Needs from outside | Ends at |
| :--- | :--- | :--- | :--- |
| 0 Preparation | Sources recorded, Workers deployed, legal and vendor questions answered | Counsel, reviewers | Gate CG0 |
| 1 First slice | Native grades 3 to 6 without new input: characters, words, idioms, grammar, recitation and reading, checked by choices and typed Chinese | Pilot learners | Gate CG1 |
| 2 Foreign-language levels 1 to 3 | Pinyin and tones, characters with meaning, words, grammar points, listening from recordings and speaking judged by pronunciation assessment | Speech vendor accounts | Gate CG2 |
| 3 Handwriting | The stroke input, its pad in the web and the apps, the stroke checker and the writing topics | A licensed stroke data set | Gate CG3 |
| 4 Grades 1 and 2, heritage bridges | The first two grades and three literacy bridges | — | Each course meets its criteria |
| 5 Grades 7 to 9, senior secondary, classical language | The rest of the native courses | — | Each course meets its criteria |
| 6 Levels 4 to 9, judged writing, speech and conversation, exam courses | The rest of the foreign-language courses and the exam courses | Teachers scoring writing and speech | Each course meets its criteria |

```text
CG0 ─► C1 first slice ─► CG1 ─┬─► C2 levels 1–3 ─► CG2 ─┬─► C6 levels 4–9, writing, speech, exams
                              ├─► C3 handwriting ─► CG3 ─┼─► C4 grades 1–2, heritage
                              └─► C5 grades 7–9, senior, classical (needs C3 only for its writing topics)
```

**Rules for every milestone.**

- Each stage leaves mathematics and English untouched: their tests, their Workers and their learners' state behave as before.
- The core stays subject-agnostic. What only Chinese needs lives in `libs/subject-chinese` and `content/chinese`.
- Content is written for the subject. Textbook texts and exercises are never copied; classical texts are in the public domain ([§13 of the design](chinese-curriculum.md#13-sources-of-content-and-rights)).
- **Work that needs people does not hold up work that does not.** Content is written, checked by its tests and the audit, and wired in; review by teachers, legal advice, accounts and pilots follow when people are available (§9.3). Nothing reaches learners before the review its stage requires.
- Work is sized rather than dated: **S** is a few commits in one package, **M** spans several packages, and **L** is a large body of content or a new input.
- Each milestone updates the documents it changes, in both languages. A finished stage updates [Roadmap](roadmap.md).

## 2. Stage 0: Preparation

| Id | Work | Size | Done when |
| :--- | :--- | :--- | :--- |
| C0.1 | Record the sources of content and their status in `content/chinese/SOURCES.md`: the standards, the character lists, the poems and their editions, what was read and not taken | S | The file lists each source, its license or status, and what the subject takes from it |
| C0.2 | Counsel on the character lists, the word lists of GF 0025-2021, the appendices of the standards and the stroke data ([§13](chinese-curriculum.md#13-sources-of-content-and-rights)) | S | Written advice; if a list may not be used, the content built from it is replaced |
| C0.3 | A reviewer who teaches Chinese in primary school, and one who teaches it as a foreign language | S | Named people have agreed |
| C0.4 | Deploy `chinese-workers` before the web Worker, which binds it | S | `pnpm nx run chinese-workers:deploy`, then the web Worker; a test account completes a lesson in production |
| C0.5 | The speech vendors: Azure for recordings and recognition, iFlytek for pronunciation assessment, checked against [Minors' Data](minors-data.md) in each first market | S | Each vendor's data region and terms for minors are recorded in the vendor register ([Admin](admin.md)) |

**Gate CG0.** Counsel has answered on the lists, a primary reviewer has agreed, and the Workers run in production. Stage 1 is written before CG0, but its pilot waits for it.

## 3. Stage 1: First Slice

### C1. Goal

Native grades 3 to 6 without new input, testing whether mastery learning and spaced recitation work in Chinese.

### C1.1 Subject Skeleton (M, done)

| Work | Files |
| :--- | :--- |
| Checkers `hanzi` and `pinyin`, pinyin keys, segmentation and the content kit | `libs/subject-chinese` |
| Content package with `compileChinese()`, the `core` shard and tests | `content/chinese` |
| Gateway and shard `ga-chinese` and `ga-chinese-core` | `apps/chinese-workers` |
| Binding `SUBJECT_CHINESE` | `apps/web` |
| The subject's tokenizer for passages: characters and words segmented by the lexicon | `SubjectDef.words` in `libs/content`, used by `content/chinese` |

### C1.2 Content of the First Slice (L)

| Part | Built | Still to build |
| :--- | :--- | :--- |
| Recognition | 117 batches of 12, grades 3 to 6, from the tables of appendix 5 | — |
| Words | 24 batches of 10, two a grade | Two more a grade, so that each grade has four themes |
| Idioms | Batches of 8 from grade 3 | — |
| Grammar | Punctuation and faulty sentences, 10 topics | Connectives (关联词), changing sentence forms (句式变换: 把 and 被, statements and rhetorical questions, direct and reported speech), rhetorical devices (修辞), and the grade 6 punctuation and faulty-sentence types |
| Recitation | 32 poems, 8 a grade | — |
| Classical language | — | From grade 5: content words in batches, the first function words, and short public-domain passages read with notes |
| Reading | 4 units of 3 passages | A second and third unit a grade, so that each grade has at least 9 passages |

**Done when** every topic compiles, every generator passes `sampleGenerators`, the audit reports no thin knowledge point, each grade course's foundations hold no later grade's topics, and every passage keeps to the characters of its grade.

### C1.3 Simulation and Outlines (S)

| Work | Files |
| :--- | :--- |
| `tools/simulate` takes a Chinese course | `tools/simulate/src/main.ts` |
| Course outlines written by the audit, as for mathematics and English | New `docs/chinese-courses` |

**Done when** simulated students finish each grade course, no topic is unreachable, and the reviews per topic are recorded here.

### C1.4 Review and Pilot (M, waiting for people)

| Work | Owner |
| :--- | :--- |
| A primary teacher reviews the content: meanings, sentences, distractors, poems' meanings and miswritings, faulty sentences and passages | Reviewer |
| A paper test written without the platform's items, in two equivalent forms | Reviewer |
| Recruit 20 to 30 learners of grades 3 to 6 with guardians' consent; run four weeks | The project owner |

**Gate CG1.** Learners improve on the outside test, recitation is retained at the spaced reviews, and learners keep a pace near the simulated one. If they do not improve, the next work is on the method, not on more content.

## 4. Stage 2: Foreign-Language Levels 1 to 3

### C2.1 Pinyin and Tones (M)

| Work | Files |
| :--- | :--- |
| Pinyin data: the syllables of each level, their initials, finals and tones | New `content/chinese/src/pinyin` |
| Topics of tones, initials, finals, syllables and the marks: heard and chosen, then typed | `content/chinese` |
| Typed pinyin with tone numbers or marks, checked by `pinyin` | `libs/subject-chinese` (done) |
| Tone sandhi: 一, 不 and two third tones, heard and recognized; the written tone stays the original | `content/chinese` |

### C2.2 Characters, Words and Grammar of Levels 1 to 3 (L)

| Part | Size | Form |
| :--- | :--- | :--- |
| Character topics | 90 batches of 10 (900 characters) | Form, sound and meaning: the meaning in the learner's locale, the reading in pinyin |
| Word topics | About 225 batches of 10 (2,245 words) | Meaning, use in a sentence, pinyin |
| Grammar points | 210 points, most one topic each | Choosing and ordering, building sentences from given words |
| Courses `chinese-level-1` to `chinese-level-3` | Themed units of daily life | [§8.3 and §8.4 of the design](chinese-curriculum.md#83-foreign-language-courses) |

Words and characters are taken from lists counsel has cleared (C0.2); until then they follow the standard's levels, as the native batches follow appendix 5.

### C2.3 Listening (M)

| Work | Files |
| :--- | :--- |
| Recordings of syllables, words, sentences and dialogues made ahead of time with Azure neural voices, adult and child, through the existing audio tool | `tools/audio` |
| Listening topics: choose the syllable, the tone, the word or the meaning heard | `content/chinese` |

Recordings are uploaded with the rest of the subject's audio when the subject is deployed (C0.4).

### C2.4 Speaking (M)

| Work | Files |
| :--- | :--- |
| An iFlytek provider of pronunciation assessment beside Azure's, reporting per syllable whether the tone, the initial or the final is wrong | `libs/judge` |
| `zh-CN` speech problems: repeat a syllable, a word, a sentence | `content/chinese` |
| The provider is chosen by admins, as for every AI and speech vendor | `apps/web` admin |

A trial on synthetic recordings with deliberate errors found iFlytek's pupil mode flags about 80% of single tone errors and Azure about 50%, and iFlytek flags initials and finals that Azure scores as correct. Thresholds are *starting* values, to confirm on real learners before they are relied on.

**Gate CG2.** Learners of levels 1 to 3 improve on an outside test, and the pronunciation feedback agrees with a teacher's judgment on a sample of real recordings.

## 5. Stage 3: Handwriting

| Id | Work | Files |
| :--- | :--- | :--- |
| C3.1 | Choose stroke data whose license allows use in a paid product, and record it | `content/chinese/SOURCES.md` |
| C3.2 | Input kind `strokes`: the response is the strokes drawn, each a list of points | `libs/content`, `libs/proto` |
| C3.3 | The stroke checker: matches stroke by stroke against the standard order and shapes, and reports where a stroke goes wrong | `libs/subject-chinese` |
| C3.4 | The pad in the web and the apps | `apps/web`, `apps/nsh` |
| C3.5 | Writing topics: batches of 10 characters the learner recognizes, shared by all audiences | `content/chinese` |

**Gate CG3.** Children's strokes on a phone are judged fairly: on a sample, the checker agrees with a teacher on whether each character is written correctly.

## 6. Stage 4: Grades 1 and 2, Heritage Bridges

Strokes and components, the 300 basic characters, characters first and then pinyin, nursery rhymes and short poems, and the first sentences; `chinese-grade-1` and `chinese-grade-2`. The bridges `chinese-heritage-1` to `chinese-heritage-3` are views over the native graph with a few topics of their own ([§8.2](chinese-curriculum.md#82-heritage-courses)).

## 7. Stage 5: Grades 7 to 9, Senior Secondary, Classical Language

The rest of table two of appendix 5, classical prose and its function words, argument and exposition, the 60 recited texts of grades 7 to 9 and the 72 of senior secondary school, and `chinese-hs-required` and `chinese-hs-selective`. Classical passages are in the public domain; modern ones are written for the subject.

## 8. Stage 6: Levels 4 to 9, Writing, Speech and Conversation, Exams

Levels 4 to 9 continue C2. Judged writing reuses `libs/judge` with calibration sets scored by teachers of Chinese; conversations reuse the voice service. The exam courses `chinese-hsk-1` to `chinese-hsk-7-9` and `chinese-gaokao` follow the courses they test.

## 9. Across All Stages

### 9.1 Testing

| Layer | How |
| :--- | :--- |
| Checkers and generators | Vitest and `sampleGenerators` in `libs/subject-chinese` and `content/chinese` |
| Content | The audit: no thin knowledge point; recitation counted by its cues; ids recorded in `published-ids.txt` |
| Grades | Each grade course's foundations hold no later grade's topics; passages keep to the characters of their grade |
| Speech | Faked services in tests; real services only in trials, with keys in the ignored `.env.local` |
| Learning | Outside tests, not the platform's own questions |

### 9.2 Dependencies on Other Phases

| Phase | Needed by | Why |
| :--- | :--- | :--- |
| Deployment of the Workers (C0.4) | C1.4 | A pilot needs a real service |
| P6 Mobile app task players | C2.4, C3.4 | Speech and strokes need players in the apps |
| P9 Billing | Before opening C2.4 widely | Pronunciation assessment costs money per use |

### 9.3 What Only People Can Do

| Item | Stage |
| :--- | :--- |
| Counsel on the lists, the stroke data and minors' recordings | 0, and again before 2 and 3 |
| Review by a primary teacher and by a teacher of Chinese as a foreign language | 1 onward |
| Outside tests, and recruiting learners and guardians | 1 onward |
| Real recordings of learners for checking the speech thresholds | 2 |
| Vendor accounts, keys and contracts | 2 |
| Teachers scoring writing and speech for calibration | 6 |

### 9.4 What Stops the Plan

- **CG1 fails:** no more content until the method is understood.
- **Counsel forbids a list:** the content built from it is regrouped from sources that may be used; ids that learners hold are kept.
- **Pronunciation assessment disagrees with teachers:** speaking stays practice without a score, and tones are taught by listening.
- **No stroke data may be used:** writing topics wait, and grades 1 and 2 are not opened.
