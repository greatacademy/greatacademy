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
| Words | 16 batches of 10, four themes a grade | — |
| Idioms | Batches of 8 from grade 3 | — |
| Grammar | 20 topics: punctuation (7, the last grade 6's dash), faulty sentences (6, two of them grade 6's contradictions and mismatched connectives), connectives (2), changing sentence forms (3: 把 and 被, rhetorical questions, reported speech), rhetorical devices (2) | — |
| Recitation | 32 poems, 8 a grade | — |
| Classical language | Grades 5 and 6: six passages recited like poems (守株待兔, 杨氏之子, 囊萤夜读; 学弈, 伯牙鼓琴, 铁杵成针), content words and sentences put into modern Chinese, and the function words 之, 而, 以 and 于 | — |
| Reading | 12 units of 3 passages, 9 passages a grade | — |

**Done when** every topic compiles, every generator passes `sampleGenerators`, the audit reports no thin knowledge point, each grade course's foundations hold no later grade's topics, and every passage keeps to the characters of its grade.

### C1.3 Simulation and Outlines (S)

| Work | Files |
| :--- | :--- |
| `tools/simulate` takes a Chinese course | `tools/simulate/src/main.ts` |
| Course outlines written by the audit, as for mathematics and English | New `docs/chinese-courses` |

**Done when** simulated students finish each grade course, no topic is unreachable, and the reviews per topic are recorded here.

**Done.** The outlines are in [docs/chinese-courses](chinese-courses/), one per course with its simulated students. Every student finished every course in all 20 runs. Reviews per topic for the typical, strong and struggling student: grade 3 3.58, 2.83 and 4.90; grade 4 3.92, 3.45 and 5.28; grade 5 3.99, 3.63 and 5.33; grade 6 4.05, 3.66 and 5.32; pinyin 0.68, 0.52 and 1.25, a short course whose reviews mostly fall after it ends. A typical student takes 38, 74, 96 and 102 days for grades 3 to 6, and 3 for pinyin.

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

**Built so far.** The side that needs no audio, as the course `chinese-pinyin`: 6 topics and 12 knowledge points of the strand `pinyin`, on the 686 syllables read by the characters of grades 3 to 6. Tones and where the mark goes, initials, finals, the spelling rules of y, w, ü and the shortened finals iu, ui and un, and the tones of 一, 不 and two third tones said and written. Listening and typed pinyin join with the recordings.

### C2.2 Characters, Words and Grammar of Levels 1 to 3 (L)

| Part | Size | Form |
| :--- | :--- | :--- |
| Character topics | 90 batches of 10 (900 characters) | Form, sound and meaning: the meaning in the learner's locale, the reading in pinyin |
| Word topics | About 225 batches of 10 (2,245 words) | Meaning, use in a sentence, pinyin |
| Grammar points | 210 points, most one topic each | Choosing and ordering, building sentences from given words |
| Courses `chinese-level-1` to `chinese-level-3` | Themed units of daily life | [§8.3 and §8.4 of the design](chinese-curriculum.md#83-foreign-language-courses) |

Words and characters are taken from lists counsel has cleared (C0.2); until then they follow the standard's levels, as the native batches follow appendix 5.

**Built so far.** Level 1, as the course `chinese-level-1` ([outline](chinese-courses/chinese-level-1.md)): 300 characters in 30 topics of form, reading and meaning, and 500 words in 50 topics of meaning, reading and use, in twelve themed units from greetings to health. Every sentence uses only characters already taught, which the content checks as it builds. The characters were chosen as the commonest of daily life; checking them against level 1 of GF 0025-2021, and a teacher's reading of the sentences, remain. Level 2, as the course `chinese-level-2` ([outline](chinese-courses/chinese-level-2.md)), which builds on level 1: 300 more characters in 30 topics and 770 words in 77 topics, in twelve units from the daily routine to festivals, written the same way; its characters were chosen close to levels 2 and 3 of the standard and wait for the same checks. Level 3, as the course `chinese-level-3` ([outline](chinese-courses/chinese-level-3.md)), which builds on level 2: 300 more characters in 30 topics and 970 words in 97 topics, in twelve units from opinions and reasons to ways of living; many common characters fall beyond level 3, so a few words are less common than a teacher might choose, and the same checks remain. Grammar points are not yet written.

### C2.3 Listening (M)

| Work | Files |
| :--- | :--- |
| Recordings of syllables, words, sentences and dialogues made ahead of time with Azure neural voices, adult and child, through the existing audio tool | `tools/audio` |
| Listening topics: choose the syllable, the tone, the word or the meaning heard | `content/chinese` |

Recordings are uploaded with the rest of the subject's audio when the subject is deployed (C0.4).

**Built so far.** `content/chinese/src/audio.ts` builds the SSML of syllables, words and sentences, read by `zh-CN-XiaoxiaoNeural` 10% slower than usual; a syllable is said by a character with that reading, its tone fixed by SAPI phonemes (ü written v). `tools/audio` takes `--subject chinese`, and the 71 recordings of the topic `pinyin-hearing` are made: hearing the tone of a syllable among its four tones, and telling apart initials and finals that sound alike (zh and z, n and l, f and h, an and ang, in and ing). A test fails while a problem plays a recording not made. iFlytek's assessment of the isolated syllables marked some third tones wrong whichever voice read them, so it is no test of the recordings: a teacher listens to them before they are published. Words, sentences and dialogues come with the courses of levels 1 to 3.

### C2.4 Speaking (M)

| Work | Files |
| :--- | :--- |
| An iFlytek provider of pronunciation assessment beside Azure's, reporting per syllable whether the tone, the initial or the final is wrong | `libs/judge` |
| `zh-CN` speech problems: repeat a syllable, a word, a sentence | `content/chinese` |
| The provider is chosen by admins, as for every AI and speech vendor | `apps/web` admin |

**Built so far.** The provider: `iflytekSpeech` in `libs/judge`, chosen by an iFlytek base URL, assesses `zh-CN` against a reference and gives each syllable its pinyin and the parts said wrong. Admins may route it to `pronunciation:zh-CN` only, and it was checked against the service on the trial's recordings. The speech checker takes each Chinese character as a word and names a syllable said wrong with its parts, as 好（声母、声调）. The first spoken topic, `pinyin-saying`, ends the pinyin course: words of two syllables said after their recordings, 45 drilling the pairs of tones and 59 whose tones change in speech (two third tones, 一 and 不). Sentences come with levels 1 to 3.

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

**Built so far.** C3.2 to C3.4: the input kind `strokes` in `libs/content` and `StrokesInput` in the protocol; the checker `strokes` in `libs/subject-chinese`, which moves and scales the drawing as a whole onto the standard medians, so that a small or off-centre character is still judged, then names the first stroke written the wrong way, out of order, or in the wrong shape or place, tested on medians written for the tests; and the pads, a 田 grid with an optional character to trace, with undo, in the web and the apps. C3.1 waits for a choice of stroke data with a license fit for a paid product, and C3.5 for that data; the tolerances are set by tests and wait for the teacher's sample of gate CG3.

**Gate CG3.** Children's strokes on a phone are judged fairly: on a sample, the checker agrees with a teacher on whether each character is written correctly.

## 6. Stage 4: Grades 1 and 2, Heritage Bridges

Strokes and components, the 300 basic characters, characters first and then pinyin, nursery rhymes and short poems, and the first sentences; `chinese-grade-1` and `chinese-grade-2`. The bridges `chinese-heritage-1` to `chinese-heritage-3` are views over the native graph with a few topics of their own ([§8.2](chinese-curriculum.md#82-heritage-courses)).

**Built so far.** The recognition of grades 1 and 2: the 1,600 characters of table one that grades 3 to 6 do not teach, commonest first, with three words each and confusable characters, in 133 topics of reading and writing (`recognizing-characters-1-01` to `recognizing-characters-2-66`). Twenty short poems to recite, ten a grade, chosen from those the standard recommends. Three topics of strokes and their order and three of components, checked by choices until stroke data comes. The courses `chinese-grade-1` ([outline](chinese-courses/chinese-grade-1.md)), with the pinyin of `chinese-pinyin` explained in Chinese, and `chinese-grade-2` ([outline](chinese-courses/chinese-grade-2.md)), which grade 3 now builds on. The heritage bridges `chinese-heritage-1` to `chinese-heritage-3` ([outlines](chinese-courses/chinese-heritage-1.md)) order the recognition batches of grades 1 to 4 into 600, 1,600 and 2,500 characters, the first with pinyin, strokes and components, and add six topics of their own: characters that sound alike, 的 地 得 and the pronouns, the written forms of words and set phrases, dialect words and their Mandarin, spoken and written Chinese, and traditional characters. Four word batches a grade, forty words of daily life. Reading, as six units of three passages, nursery rhymes among them, written in the characters of their grade. Reading for the heritage bridges, two units of three passages a bridge, written for older learners in the characters the bridge has taught. Sentences and writing by hand remain. Polyphonic characters given their commonest reading, particles whose main reading is neutral, and the few characters with weak words wait for the teacher's review.

## 7. Stage 5: Grades 7 to 9, Senior Secondary, Classical Language

The rest of table two of appendix 5, classical prose and its function words, argument and exposition, the 60 recited texts of grades 7 to 9 and the 72 of senior secondary school, and `chinese-hs-required` and `chinese-hs-selective`. Classical passages are in the public domain; modern ones are written for the subject.

**Built so far.** Grades 7 to 9, as the courses `chinese-grade-7` to `chinese-grade-9` ([outlines](chinese-courses/chinese-grade-7.md)), 132 topics and 348 knowledge points: the 500 characters of table two that primary school does not teach, in 42 recognition batches, so that grade 9 ends at the 3,500 common characters; four word batches and four idiom batches a grade; the rhetoric of metonymy, contrast, quotation and anadiplosis, and sentences with mixed-up structures or no logic; the 60 recited texts, twelve poems and eight passages of classical prose a grade; and three drills of classical Chinese, on content words, on 其 and 为, and on borrowed characters. Senior secondary school, as `chinese-hs-required` and `chinese-hs-selective` ([outlines](chinese-courses/chinese-hs-required.md)), 98 topics and 284 knowledge points: four word batches and four idiom batches a course; synaesthesia, paired phrasing, double meaning and irony, and sentences with two meanings; the 72 recited texts, twenty poems and sixteen passages of classical prose a course; and eight drills of classical Chinese, on the function words 乃, 且, 若, 焉, 何, 乎, 因, 与, 则, 所, 也 and 者, the special sentences, words used as another part of speech and words whose meaning has changed. Reading for grades 7 to 9: nine units of three passages, a unit of narrative, one of exposition and one of argument a grade, with questions on the methods of explaining and of arguing. Reading for senior secondary school: six units of three passages, a unit of argument, one of informational texts and one of literature a course. Polyphonic readings and a few words wait for the teacher's review.

## 8. Stage 6: Levels 4 to 9, Writing, Speech and Conversation, Exams

Levels 4 to 9 continue C2. Judged writing reuses `libs/judge` with calibration sets scored by teachers of Chinese; conversations reuse the voice service. The exam courses `chinese-hsk-1` to `chinese-hsk-7-9` and `chinese-gaokao` follow the courses they test.

**Built so far.** Level 4, as the course `chinese-level-4` ([outline](chinese-courses/chinese-level-4.md)), which builds on level 3: 300 more characters in 30 topics and 1,000 words in 100 topics, in twelve units from health and medicine to careers, written as levels 1 to 3 are. Some very common characters that levels 1 to 3 leave out, such as 始, 主, 之 and 与, are taught here where their unit's words need them; checking the characters against level 4 of GF 0025-2021, and a teacher's reading of the sentences, remain. Level 5, as `chinese-level-5` ([outline](chinese-courses/chinese-level-5.md)), which builds on level 4: 300 more characters in 30 topics and 1,070 words in 107 topics, in twelve units from society to values and ideas, with more of the common characters the earlier levels leave out, and the characters of names of countries and writers where their words need them; the same checks remain.

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
