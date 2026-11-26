# Chinese Development Plan

> English | [简体中文](chinese-development-plan.zh-CN.md)

This document turns the design in [Chinese Curriculum](chinese-curriculum.md) into milestones: what to build, in which files, how each is checked, and which results let the next stage begin. The design document says what Chinese is; this one says in what order it is built. It follows [English Development Plan](english-development-plan.md), and reuses what English built.

---

## 1. How the Work Is Organized

| Stage | Delivers | Needs from outside | Ends at |
| :--- | :--- | :--- | :--- |
| 0 Preparation | Sources recorded, the API server deployed, legal and vendor questions answered | Counsel, reviewers | Gate CG0 |
| 1 First slice | Native grades 3 to 6 without new input: characters, words, idioms, grammar, recitation and reading, checked by choices and typed Chinese | Pilot learners | Gate CG1 |
| 2 Foreign-language levels 1 to 3 | Pinyin and tones, characters with meaning, words, grammar points, listening from recordings and speaking judged by pronunciation assessment | Speech vendor accounts | Gate CG2 |
| 3 Handwriting | The stroke input, its pad in the web and the apps, the stroke checker and the writing topics | A licensed stroke data set | Gate CG3 |
| 4 Grades 1 and 2, heritage bridges | The first two grades and three literacy bridges | — | Each course meets its criteria |
| 5 Grades 7 to 9, senior secondary, classical language | The rest of the native courses | — | Each course meets its criteria |
| 6 Levels 4 to 9, judged writing, speech and conversation, exam courses | The rest of the foreign-language courses and the exam courses | Teachers scoring writing and speech | Each course meets its criteria |
| 7 Fit for self-study | Every course teaches a learner alone: true feedback, unique answers, honest options, every word heard, words produced, prompts within reach, grades 1 and 2 for a child, heritage reading, Gaokao at the exam's level, texts laid out as in a textbook, pictures | Teachers reading for self-study | Gate CG7 |

```text
CG0 ─► C1 first slice ─► CG1 ─┬─► C2 levels 1–3 ─► CG2 ─┬─► C6 levels 4–9, writing, speech, exams
                              ├─► C3 handwriting ─► CG3 ─┼─► C4 grades 1–2, heritage
                              └─► C5 grades 7–9, senior, classical (needs C3 only for its writing topics)
```

**Rules for every milestone.**

- Each stage leaves mathematics and English untouched: their tests, their content and their learners' state behave as before.
- The core stays subject-agnostic. What only Chinese needs lives in `libs/subject-chinese` and `content/chinese`.
- Content is written for the subject. Textbook texts and exercises are never copied; classical texts are in the public domain ([§13 of the design](chinese-curriculum.md#13-sources-of-content-and-rights)).
- **Work that needs people does not hold up work that does not.** Content is written, checked by its tests and the audit, and wired in; review by teachers, legal advice, accounts and pilots follow when people are available (§10.3). Nothing reaches learners before the review its stage requires.
- Work is sized rather than dated: **S** is a few commits in one package, **M** spans several packages, and **L** is a large body of content or a new input.
- Each milestone updates the documents it changes, in both languages. A finished stage updates [Roadmap](roadmap.md).

## 2. Stage 0: Preparation

| Id | Work | Size | Done when |
| :--- | :--- | :--- | :--- |
| C0.1 | Record the sources of content and their status in `content/chinese/SOURCES.md`: the standards, the character lists, the poems and their editions, what was read and not taken | S | The file lists each source, its license or status, and what the subject takes from it |
| C0.2 | Counsel on the character lists, the word lists of GF 0025-2021, the appendices of the standards and the stroke data ([§13](chinese-curriculum.md#13-sources-of-content-and-rights)) | S | Written advice; if a list may not be used, the content built from it is replaced |
| C0.3 | A reviewer who teaches Chinese in primary school, and one who teaches it as a foreign language | S | Named people have agreed |
| C0.4 | Deploy the API server, which compiles Chinese beside the other subjects, with `deploy/k8s` | S | `mise run k8s:push`, then `kubectl apply -k deploy/k8s`; a test account completes a lesson in production |
| C0.5 | The speech vendors: Azure for recordings and recognition, iFlytek for pronunciation assessment, checked against [Minors' Data](minors-data.md) in each first market | S | Each vendor's data region and terms for minors are recorded in the vendor register ([Admin](admin.md)) |

**Gate CG0.** Counsel has answered on the lists, a primary reviewer has agreed, and the API server serves Chinese in production. Stage 1 is written before CG0, but its pilot waits for it.

## 3. Stage 1: First Slice

### C1. Goal

Native grades 3 to 6 without new input, testing whether mastery learning and spaced recitation work in Chinese.

### C1.1 Subject Skeleton (M, done)

| Work | Files |
| :--- | :--- |
| Checkers `hanzi` and `pinyin`, pinyin keys, segmentation and the content kit | `libs/subject-chinese` |
| Content package with `compileChinese()`, the `core` shard and tests | `content/chinese` |
| Topics grouped as `core`, `levels` and `hsk` | `content/chinese/src/shards` |
| The subject compiled in the API server | `apps/server` |
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
| Tone sandhi: 一, 不 and two third tones, heard and recognized; 一 and 不 are written in the tone said, two third tones in their own tones | `content/chinese` |

**Built so far.** The side that needs no audio, as the course `chinese-pinyin`: 6 topics and 12 knowledge points of the strand `pinyin`, on the 686 syllables read by the characters of grades 3 to 6. Tones and where the mark goes, initials, finals, the spelling rules of y, w, ü and the shortened finals iu, ui and un, and the tones of 一, 不 and two third tones said and written. Listening and typed pinyin join with the recordings.

### C2.2 Characters, Words and Grammar of Levels 1 to 3 (L)

| Part | Size | Form |
| :--- | :--- | :--- |
| Character topics | 90 batches of 10 (900 characters) | Form, sound and meaning: the meaning in the learner's locale, the reading in pinyin |
| Word topics | About 225 batches of 10 (2,245 words) | Meaning, use in a sentence, pinyin |
| Grammar points | 210 points, most one topic each | Choosing and ordering, building sentences from given words |
| Courses `chinese-level-1` to `chinese-level-3` | Themed units of daily life | [§8.3 and §8.4 of the design](chinese-curriculum.md#83-foreign-language-courses) |

Words and characters are taken from lists counsel has cleared (C0.2); until then they follow the standard's levels, as the native batches follow appendix 5.

**Built so far.** Level 1, as the course `chinese-level-1` ([outline](chinese-courses/chinese-level-1.md)): 300 characters in 30 topics of form, reading and meaning, and 500 words in 50 topics of meaning, reading and use, in twelve themed units from greetings to health. Every sentence uses only characters already taught, which the content checks as it builds. The characters were chosen as the commonest of daily life; checking them against level 1 of GF 0025-2021, and a teacher's reading of the sentences, remain. Level 2, as the course `chinese-level-2` ([outline](chinese-courses/chinese-level-2.md)), which builds on level 1: 300 more characters in 30 topics and 770 words in 77 topics, in twelve units from the daily routine to festivals, written the same way; its characters were chosen close to levels 2 and 3 of the standard and wait for the same checks. Level 3, as the course `chinese-level-3` ([outline](chinese-courses/chinese-level-3.md)), which builds on level 2: 300 more characters in 30 topics and 970 words in 97 topics, in twelve units from opinions and reasons to ways of living; many common characters fall beyond level 3, so a few words are less common than a teacher might choose, and the same checks remain. Grammar, in levels 1 to 9: 547 topics after the grammar points of the standard, 48, 70, 81, 73, 62 and 62 a level, and 49, 51 and 51 in levels 7 to 9, which split the advanced band's 148 points by difficulty, each placed in the unit whose theme uses it, with two knowledge points, the form that completes a sentence and the one right sentence among four, every option written with the characters taught by then; a few small points share a topic, and the points that need characters not yet taught, such as 连……都, 越……越 and 除了, wait for the level that teaches them, and a point is taught once, in the earliest level that has it. Checking the points against the standard's list, and a teacher's reading of the sentences, remain. Sentence building, in levels 1 to 9: 36 topics, one at the end of every third unit, the first writing of the levels, checked by rules: the learner puts the parts of a sentence in order, in thirty short sentences of three or four parts and thirty longer ones of five to seven, written with the words, grammar and characters of the three units; where two orders are both right, both are accepted. A teacher's reading of the sentences, and of the orders each accepts, remains.

### C2.3 Listening (M)

| Work | Files |
| :--- | :--- |
| Recordings of syllables, words, sentences and dialogues made ahead of time with Azure neural voices, adult and child, through the existing audio tool | `tools/audio` |
| Listening topics: choose the syllable, the tone, the word or the meaning heard | `content/chinese` |

Recordings are uploaded with the rest of the subject's audio when the subject is deployed (C0.4).

**Built so far.** `content/chinese/src/audio.ts` builds the SSML of syllables, words and sentences, read by `zh-CN-XiaoxiaoNeural` 10% slower than usual; a syllable is said by a character with that reading, its tone fixed by SAPI phonemes (ü written v). `tools/audio` takes `--subject chinese`, and the 71 recordings of the topic `pinyin-hearing` are made: hearing the tone of a syllable among its four tones, and telling apart initials and finals that sound alike (zh and z, n and l, f and h, an and ang, in and ing). A test fails while a problem plays a recording not made. iFlytek's assessment of the isolated syllables marked some third tones wrong whichever voice read them, so it is no test of the recordings: a teacher listens to them before they are published. Every unit of levels 1 to 9 has a listening topic, `level-<n>-listening-<unit>`, made from its words and their sentences with no data of its own: the meaning of a word heard, among those of two other words of the unit that do not sound like it, and the word heard in a sentence, among two words of the unit whose syllables the sentence does not hold; the HSK courses mix them, the units taking turns. Their 22,102 recordings of words and sentences are made the same way. Units 6 and 12 of every level end their listening with a topic of dialogues, `level-<n>-dialogues-01` and `level-<n>-dialogues-02`: two to eight lines between a woman and a man, written in the characters taught by then and read by the usual voice and `zh-CN-YunxiNeural`, heard without their text, each followed by one to three questions of three answers, four from level 4, at least 30 questions a topic; the HSK courses add one topic of dialogues and talks and one of texts read, written the same way in the characters of the levels they test. The 988 words of the levels with a character of several readings were checked by Azure's pronunciation assessment, each recording scored against homophones of both readings: the voice read seventeen of them in the other reading, alone or in their sentences, such as 查重 as zhā zhòng, 口角 as kǒujiǎo and 排长队 as pái zhǎng duì, so `audio.ts` gives those their reading in SAPI phonemes, in every sentence or, for 同行, 有空 and single characters such as 血 and 着, only alone. The assessment cannot tell some tones apart, nor xuè from xiě, so a teacher still listens.

### C2.4 Speaking (M)

| Work | Files |
| :--- | :--- |
| An iFlytek provider of pronunciation assessment beside Azure's, reporting per syllable whether the tone, the initial or the final is wrong | `libs/judge` |
| `zh-CN` speech problems: repeat a syllable, a word, a sentence | `content/chinese` |
| The provider is chosen by admins, as for every AI and speech vendor | `apps/web` admin |

**Built so far.** The provider: `iflytekSpeech` in `libs/judge`, chosen by an iFlytek base URL, assesses `zh-CN` against a reference and gives each syllable its pinyin and the parts said wrong. Admins may route it to `pronunciation:zh-CN` only, and it was checked against the service on the trial's recordings. The speech checker takes each Chinese character as a word and names a syllable said wrong with its parts, as 好（声母、声调）. The first spoken topic, `pinyin-saying`, ends the pinyin course: words of two syllables said after their recordings, 45 drilling the pairs of tones and 59 whose tones change in speech (two third tones, 一 and 不). After each unit's listening of levels 1 to 9, a speaking topic, `level-<n>-speaking-<unit>`: the unit's words said after their recordings and its sentences read aloud, the HSK courses mixing them too. The HSK courses add a topic of the speaking test each: at HSK 1 to 3, `hsk-<n>-answering`, at least 30 questions written for the course, each heard and answered aloud in a whole sentence, with a hint of what to answer, heard against the answers accepted; from HSK 4, `hsk-<n>-reading-aloud`, the course's short texts read aloud in parts of whole sentences of 12 to 60 characters. Retelling, describing a picture and answering at length need a free answer judged by a model, and a spoken topic is checked by rules, so they are not practised. Every native course has `reading-aloud-<grade>`, grades 1 to 11, its grade's passages read aloud a few whole sentences at a time; it practises reading whole and in order, not pronunciation, so the pronunciation score is not asked for and a regional accent costs nothing.

A trial on synthetic recordings with deliberate errors found iFlytek's pupil mode flags about 80% of single tone errors and Azure about 50%, and iFlytek flags initials and finals that Azure scores as correct. Thresholds are *starting* values, to confirm on real learners before they are relied on.

**Gate CG2.** Learners of levels 1 to 3 improve on an outside test, and the pronunciation feedback agrees with a teacher's judgment on a sample of real recordings.

## 5. Stage 3: Handwriting

| Id | Work | Files |
| :--- | :--- | :--- |
| C3.1 | Choose stroke data whose license allows use in a paid product, and record it | `content/chinese/SOURCES.md` |
| C3.2 | Input kind `strokes`: the response is the strokes drawn, each a list of points | `libs/content`, `libs/proto` |
| C3.3 | The stroke checker: matches stroke by stroke against the standard order and shapes, and reports where a stroke goes wrong | `libs/subject-chinese` |
| C3.4 | The pad in the web and the apps | `apps/web`, `apps/nsh` |
| C3.5 | Writing topics: batches of 10 characters the learner recognizes, for native learners and for the levels | `content/chinese` |

**Built so far.** C3.2 to C3.4: the input kind `strokes` in `libs/content` and `StrokesInput` in the protocol; the checker `strokes` in `libs/subject-chinese`, which moves and scales the drawing as a whole onto the standard medians, so that a small or off-centre character is still judged, then names the first stroke written the wrong way, out of order, or in the wrong shape or place, tested on medians written for the tests; and the pads, a 田 grid with an optional character to trace, with undo, in the web and the apps. C3.1: the medians of Make Me a Hanzi, under the Arphic Public License, which allows paid use; the 3,000 characters served are a modified version, kept with the license's text in `content/chinese/src/strokes` and to be published freely. C3.5: 300 writing topics of ten characters, `writing-characters-1-01` to `writing-characters-9-17`, each tracing its characters in their words and then writing them from their pinyin, in the order the characters are read; 800 by grade 2, 1,600 by grade 4, 2,500 by grade 6 and 3,000 by grade 9, which the heritage bridges take as far as their characters go. And 120 for the levels, `level-1-handwriting-01` to `level-9-handwriting-17`, in the levels' teaching order and in their words: 100 characters a level up to level 4, then 150, 150, 170, 160 and 170, so 1,200 by level 9, as the handwriting list of GF 0025-2021 asks; a character with fewer than three words of the levels so far is also written from its reading and meaning. A test draws the medians of 600 characters small, off centre and shaky, and the checker accepts at least 98 in 100 of them and catches at least 95 in 100 pairs of strokes written in each other's place. The tolerances, and the stroke order of the data against GF 0023-2020, wait for the teacher's sample of gate CG3.

**Gate CG3.** Children's strokes on a phone are judged fairly: on a sample, the checker agrees with a teacher on whether each character is written correctly.

## 6. Stage 4: Grades 1 and 2, Heritage Bridges

Strokes and components, the 300 basic characters, characters first and then pinyin, nursery rhymes and short poems, and the first sentences; `chinese-grade-1` and `chinese-grade-2`. The bridges `chinese-heritage-1` to `chinese-heritage-3` are views over the native graph with a few topics of their own ([§8.2](chinese-curriculum.md#82-heritage-courses)).

**Built so far.** The recognition of grades 1 and 2: the 1,600 characters of table one that grades 3 to 6 do not teach, commonest first, with three words each and confusable characters, in 133 topics of reading and writing (`recognizing-characters-1-01` to `recognizing-characters-2-66`). Twenty short poems to recite, ten a grade, chosen from those the standard recommends. Three topics of strokes and their order and three of components, checked by choices. The courses `chinese-grade-1` ([outline](chinese-courses/chinese-grade-1.md)), with the pinyin of `chinese-pinyin` explained in Chinese, and `chinese-grade-2` ([outline](chinese-courses/chinese-grade-2.md)), which grade 3 now builds on. The heritage bridges `chinese-heritage-1` to `chinese-heritage-3` ([outlines](chinese-courses/chinese-heritage-1.md)) order the recognition batches of grades 1 to 4 into 600, 1,600 and 2,500 characters, with the writing batches of those characters, the first with pinyin, strokes and components, and add six topics of their own: characters that sound alike, 的 地 得 and the pronouns, the written forms of words and set phrases, dialect words and their Mandarin, spoken and written Chinese, and traditional characters; and the third bridge two more of traditional characters, `traditional-components`, characters whose component is simplified the same way in every character, and `traditional-shared`, the traditional form a word needs where one simplified character stands for several, in the forms Hong Kong and Taiwan share. Four word batches a grade, forty words of daily life. Reading, as six units of three passages, nursery rhymes among them, written in the characters of their grade. Reading for the heritage bridges, two units of three passages a bridge, written for older learners in the characters the bridge has taught. Sentence building, four topics a grade after the 16th, 33rd and 50th recognition batches and the last, 60 sentences a topic in the characters taught by then, which the first two bridges take with their batches; the sentences and the orders each accepts wait for a teacher's reading. Writing by hand: forty writing batches a grade (C3.5). Polyphonic characters given their commonest reading, particles whose main reading is neutral, and the few characters with weak words wait for the teacher's review.

## 7. Stage 5: Grades 7 to 9, Senior Secondary, Classical Language

The rest of table two of appendix 5, classical prose and its function words, argument and exposition, the 60 recited texts of grades 7 to 9 and the 72 of senior secondary school, and `chinese-hs-required` and `chinese-hs-selective`. Classical passages are in the public domain; modern ones are written for the subject.

**Built so far.** Grades 7 to 9, as the courses `chinese-grade-7` to `chinese-grade-9` ([outlines](chinese-courses/chinese-grade-7.md)), 132 topics and 348 knowledge points: the 500 characters of table two that primary school does not teach, in 42 recognition batches, so that grade 9 ends at the 3,500 common characters; four word batches and four idiom batches a grade; the rhetoric of metonymy, contrast, quotation and anadiplosis, and sentences with mixed-up structures or no logic; the 60 recited texts, twelve poems and eight passages of classical prose a grade; and three drills of classical Chinese, on content words, on 其 and 为, and on borrowed characters. Senior secondary school, as `chinese-hs-required` and `chinese-hs-selective` ([outlines](chinese-courses/chinese-hs-required.md)), 98 topics and 284 knowledge points: four word batches and four idiom batches a course; synaesthesia, paired phrasing, double meaning and irony, and sentences with two meanings; the 72 recited texts, twenty poems and sixteen passages of classical prose a course; and eight drills of classical Chinese, on the function words 乃, 且, 若, 焉, 何, 乎, 因, 与, 则, 所, 也 and 者, the special sentences, words used as another part of speech and words whose meaning has changed. Reading for grades 7 to 9: nine units of three passages, a unit of narrative, one of exposition and one of argument a grade, with questions on the methods of explaining and of arguing. Reading for senior secondary school: six units of three passages, a unit of argument, one of informational texts and one of literature a course. Polyphonic readings and a few words wait for the teacher's review.

## 8. Stage 6: Levels 4 to 9, Writing, Speech and Conversation, Exams

Levels 4 to 9 continue C2. Judged writing reuses `libs/judge` with calibration sets scored by teachers of Chinese, whose seed sets, 432 texts written by a model to meet or miss each criterion and labelled blind by a second, wait in `content/chinese/calibration` for their scores; conversations reuse the voice service. The exam courses `chinese-hsk-1` to `chinese-hsk-7-9` and `chinese-gaokao` follow the courses they test.

**Built so far.** Level 4, as the course `chinese-level-4` ([outline](chinese-courses/chinese-level-4.md)), which builds on level 3: 300 more characters in 30 topics and 1,000 words in 100 topics, in twelve units from health and medicine to careers, written as levels 1 to 3 are. Some very common characters that levels 1 to 3 leave out, such as 始, 主, 之 and 与, are taught here where their unit's words need them; checking the characters against level 4 of GF 0025-2021, and a teacher's reading of the sentences, remain. Level 5, as `chinese-level-5` ([outline](chinese-courses/chinese-level-5.md)), which builds on level 4: 300 more characters in 30 topics and 1,070 words in 107 topics, in twelve units from society to values and ideas, with more of the common characters the earlier levels leave out, and the characters of names of countries and writers where their words need them; the same checks remain. Level 6, as `chinese-level-6` ([outline](chinese-courses/chinese-level-6.md)), which builds on level 5: 300 more characters in 30 topics and 1,140 words in 114 topics, in twelve units from language and communication to thinking and arguing, beginning with 或, 它, 青, 派, 令, 似 and 若, which the earlier levels leave out; the same checks remain, and some Chinese meanings still use characters not yet taught. Level 7, as `chinese-level-7` ([outline](chinese-courses/chinese-level-7.md)), the commonest third of the advanced band: 400 more characters in 40 topics and 1,880 words in 188 topics, in twelve units from social change to the economy and trade; the same checks remain. Level 8, as `chinese-level-8` ([outline](chinese-courses/chinese-level-8.md)), the middle third: 400 more characters and 1,880 words in 228 topics, in twelve units from communities and social issues to finance and markets; the same checks remain. Level 9, as `chinese-level-9` ([outline](chinese-courses/chinese-level-9.md)), the last third, which completes the advanced band: 400 more characters and 1,880 words in 228 topics, in twelve units from language and rhetoric to formal writing; the same checks remain. Levels 4 to 9 each close units 3, 6, 9 and 12 with a conversation on the themes of their stretch, 24 in all, from changing a train ticket to an opening speech at a craft fair: the tutor plays a part in Mandarin and keeps to the level, with the prompt `conversation-zh-1`, which asks for plain spoken Mandarin in simplified characters; the HSK courses that hold those units offer them too. They wait for an admin's routes, and for the voice service's Chinese to be tried with real learners. The HSK courses `chinese-hsk-1` to `chinese-hsk-6` and `chinese-hsk-7-9` ([HSK 1](chinese-courses/chinese-hsk-1.md) to [HSK 7–9](chinese-courses/chinese-hsk-7-9.md)), each holding the units of the levels it tests and six practice-only exam topics that mix their whole levels: words in sentences among five or six, words and meanings both ways, characters among those that look like them, the sentences of the levels' sentence building, mixed for practice in word order, and the units' listening and speaking; and from HSK 3 on a fifth, judged by a model, with the tasks and criteria of the levels' paragraph writing; each also holds its levels' unit of writing characters by hand; and HSK 4, 5 and 6 have one more each for the first part of the writing paper in the structure the test owner published in December 2025, judged by a model against three criteria in `libs/subject-chinese`: a sentence of one's own with a given word of level 4, a story from four scenes described in words where the paper shows pictures, and a practical text for a stated purpose, the stories and practical texts sixteen tasks each, written for the subject; and each has the paper's dialogues and talks heard and texts read, with questions, and a topic of the speaking test (C2.3, C2.4). The Gaokao course `chinese-gaokao` ([outline](chinese-courses/chinese-gaokao.md)), holding the units of the two senior courses and four practice-only exam topics that mix grades 7 to 11: idioms in context, lines of recited texts from their meaning, the words of classical Chinese, and the use of language, faulty sentences and rhetorical devices of every grade mixed, then its written questions, the gaps of a passage filled and a sentence or passage rewritten as asked, on items written for the subject and judged by a model against three criteria a kind; and the reading of modern texts, six informational and six literary passages written for the subject, each with four choice questions and two short answers judged by a model against three criteria a kind in `libs/subject-chinese`, with the prompt `writing-zh-1`; and the reading of classical poems, eight poems and ci outside the recited texts, asked the same way and judged with the criteria of the literary texts; the passages and their questions wait for a teacher's reading, the criteria for calibration. Judged writing for native grades 3 to 6, two topics a grade added to the grade courses as a unit of writing: a paragraph about one idea and an observation diary, an event told from its beginning to its end and a letter, a person brought out by an event and a thing explained by its features, a view supported by evidence and a scene that carries a feeling. Each topic has twelve tasks with a model answer written for the subject, and three yes-or-no criteria, in `libs/subject-chinese`; the prompt `writing-zh-1` asks the judge to count length in characters and give its feedback in Simplified Chinese. Lengths are counted in characters, from 100 in grade 3 to 400 in grade 6. Grades 7 to 11 continue it the same way, two kinds of writing a grade added to their courses: the centre of a narrative and its details, explaining in order and a speech, an argument and a whole narrative, an essay on given material and a commentary, weighing both sides and a proposal; and the Gaokao course gains a practice-only essay of at least 800 characters on original material. The criteria wait for calibration sets scored by teachers of Chinese (§10.3), and an admin routes them before they reach learners. Paragraph writing for levels 2 to 9, two topics a level ending the sixth and twelfth units after sentence building: a day in time order and a message to a friend, an opinion with reasons and an account of an event, a trip and an explanation, a letter and a custom or dish, a comparison and an argued view, a change and a review, a problem with its solutions and a commentary, an essay on an idea and formal applied writing; each with twelve tasks and model answers written in the characters taught by then, from 80 characters a piece in level 2 to 350 in level 9, and three criteria in `libs/subject-chinese`, judged with the prompt `writing-zh-l2-1`, which gives its feedback in plain English. The lengths and kinds wait for checking against the writing requirements of GF 0025-2021, and the criteria for the same calibration. Every native course closes its writing with a unit of reading aloud and whole books: its topic of reading aloud (C2.4) and, from grade 3 to the senior required course, a practice-only topic of the grade's whole book, read in print outside the app, `book-andersen`, `book-chinese-myths`, `book-journey-to-the-west`, `book-robinson-crusoe`, `book-dawn-blossoms`, `book-insect-world`, `book-water-margin` and `book-dream-of-red-chamber`, each at least 30 questions of four answers written for the subject on its story, its people and what it means. Grade 3 begins with a unit on using a dictionary, `dictionary-pinyin` and `dictionary-radicals`: a character looked up by the capital letter and then the syllable, and by its radical and then the strokes left, asked of characters of grades 1 and 2, with the radicals of grade 2's components and stroke counts from the standard medians.

## 9. Stage 7: Fit for Self-Study

Stages 1 to 6 built every course; this stage makes them teach a learner who works alone. On 26 November 2026 the courses were reviewed in two ways. Eleven were walked as a learner walks them, in a lesson and in the admin preview: grade 1, levels 1 and 7, HSK 3 and HSK 7–9, heritage bridge 1, grades 5 and 8, the senior required course and Gaokao. All 32 were then read offline, most with several seeds, and the kinds of question, the recordings and the lengths of the options of every course were counted. None is yet ready for a learner alone. Grades 1 and 2, level 1, HSK 1, the heritage bridges 1 and 2, and Gaokao cannot be used without a teacher or an adult; the other courses can be practised, with the gaps below. What held: the position of the right option is evenly spread, every wrong option is explained, 一 and 不 are marked in the tone they are said in, the listening and speaking of the foreign-language courses have recordings, and no exam item or textbook text was found copied.

The milestones close what was found, in the order of the harm to a learner alone. Each is checked by a test or the audit over every course, not over the courses reviewed.

### C7.1 Bold in Chinese Text (S)

**Found.** Bold that closes after Chinese punctuation and runs straight on into a character, as in `**第一步：找到调号。**kuì 的调号`, shows its asterisks: `marked` follows the CommonMark rule that such a `**` cannot close. About 230 places in the Chinese content and about 1,270 in the Chinese of mathematics are hit, in solutions and in the feedback on a wrong answer; English text, with its spaces, is not.

**Build.** One rule for both renderers, `apps/web/src/components/Markdown.tsx` and `apps/nsh/lib/content.ts`, that closes emphasis next to CJK characters and punctuation; no content changes.

**Done when.** A test renders `**第一步。**文字` and `**检验。** 文字` as bold in both apps, and a scan of every rendered solution and feedback of every subject finds no `**` left.

### C7.2 Feedback That Is Wrong (M)

**Found.** A learner alone believes what the feedback says, and some of it is false:

- The reasons for a wrong word order are put together by `content/chinese/src/level-1/grammar-reasons.ts` from the position of each piece. In 不V白不V, level 7 says "白 is what 吃 acts on: it comes after the verb, 吃白", where 白 is an adverb, "for nothing"; level 1 says "去 goes after the verb" and explains the 呢 of a statement as ending a question; level 6 calls 所 the object of 有; order items call 不是 and 一直 one word.
- The passive topic of level 3 uses 叫 in its sense of giving a name.
- The Check line of many word and gap knowledge points is garbled, in both languages: "[thank you]你！", "我[dad]是我爷爷的儿子", "我最（对人或事物有好感，感兴趣）吃…".
- `level-5-words-53` defines 繁体字 as characters with many strokes.

**Build.** Each grammar point states the roles of its pieces, and a reason is given only from a role stated; where none fits, the reason names the pattern and the right order. The Check line puts the word itself, not its gloss, into the sentence. Every reason and definition of levels 1 to 9 is listed and read once.

**Done when.** A test fails on a reason built from a guessed role and on a Check line holding a gloss in brackets; the list of reasons and definitions, read in full, holds no false statement.

### C7.3 Answers That Are Not Unique (S)

**Found.** Some questions mark a right answer wrong: （tā）们 accepts only one of 他, 她 and 它, and in one run its solution speaks of 她们 while the answer is 他; `gaokao-language-sound` marks the acceptable sentence with 欣赏鸟鸣 as faulty; 百年＿＿ accepts 名校 but not 学堂.

**Build.** Gaps whose context admits several characters or words either accept them all or are given context that admits one; every item of the language-use topics is read for a second right answer.

**Done when.** A test over the gap generators finds no gap that a second option of the same set fills correctly, and the solution names the answer the checker expects.

### C7.4 Options That Give the Answer Away (M)

**Found.** In the choice questions whose options differ in length, the right option is the one longest option 72 to 84 percent of the time in grades 1 to 4 and 6, against about 31 by chance, and 42 percent in Gaokao against 27. Wrong options are often absurd ("写诗人和妻子吵了一架", "他贪小便宜", "我们要养成认真。") or not Chinese at all (想过了了, 何尝了, 有所了), and some clues give the answer away: the definition of 随声附和 restates the sentence, 疼 is the clue for 痛, 兽骨 is lifted from the definition. A learner can answer without reading, and the engine takes it for mastery.

**Build.** Wrong options written as the misreadings a learner really makes, as long and as specific as the right one; every option a well-formed word or sentence; clues that do not repeat the answer or its definition.

**Done when.** A test over every course and seeds 1 to 3: the right option is the unique longest in no more than 40 percent of the items whose options differ in length; no option is an ill-formed string; no clue shares a character with its answer.

### C7.5 Hearing Every Word (M)

**Found.** The recordings exist, some 23,000, and the listening questions play them, but only about 50 knowledge points a level carry one. The words of the lists cannot be heard on their lesson pages, nor the syllables of the lesson on tones, so a foreign learner alone learns the written form and never the sound. In the native courses the listening topics of 口语交际 are transcripts to read, and reading aloud and recitation have no model reading; the heritage bridges, whose learners already speak, have no recordings beyond pinyin.

**Build.** A play button beside every word, character and example sentence of the lists and the questions of the levels, the HSK courses, pinyin and the heritage bridges; the native listening topics played, not shown; a model reading for every text read aloud or recited; recordings from `tools/audio`.

**Done when.** A test: every word and character of a list in these courses, every syllable of the pinyin course and every text of reading aloud and recitation has a recording, and no native listening question shows its text before it is answered.

### C7.6 Producing, Not Only Recognizing (L)

**Found.** No knowledge point of a level or an HSK course is answered by typing, and about 90 percent are answered by a choice (level 1: 362 of 414; HSK 7–9: 2,444 of 2,666). The pinyin course has 8 topics, without the neutral tone or tone pairs, and never asks for pinyin to be typed. A learner who only recognizes a word cannot yet say or write it.

**Build.** In every topic of words, after finding and reading a word, a knowledge point that produces it: the pinyin typed from the character, the word typed from its meaning or from a recording, with the checkers the heritage bridges already use. The pinyin course gains the neutral tone, the tone pairs and typed pinyin from a recording.

**Done when.** Every topic of words of levels 1 to 9 holds at least one knowledge point answered by typing; no level answers more than 70 percent of its knowledge points by a choice; the pinyin course types pinyin and teaches the neutral tone and the tone pairs.

### C7.7 Within the Learner's Reach (M)

**Found.** Questions of levels 1 to 3 are written in characters only, with no pinyin or translation, while their explanations are in English: "男的早上喝什么？", "这里有人＿＿？". Feedback and examples use words above the level: 干戈, 戈壁 and 而是 in level 1; 偶尔 and 哈尔滨 for 尔 in grade 1 and HSK 1; 是非 and 的确 as words of grade 1. Characters are taught by their whole shape, without their components or a way to remember them, though the design teaches components first; level 1 names strokes such as 撇 in its handwriting without a topic of strokes. Some drills of level 5 give characters forced meanings ("甫: 刚刚…"), and level 6 only now teaches 它.

**Build.** Questions of levels 1 to 3 show the pinyin of characters not yet mastered and a gloss on demand; feedback and examples keep to the words taught before; characters taught with their components and how they make the meaning or the sound; a topic of strokes before the first handwriting; very common characters moved to the level where their words first need them.

**Done when.** A test: every question, explanation and feedback of a course uses only characters taught by that point or shows their pinyin; every character topic names the components of its characters.

### C7.8 Grades 1 and 2 for a Child (M)

**Found.** Grade 1 teaches pinyin to children who cannot yet read, in adult Chinese with grammar terms such as 主语 and 宾语, and nothing is read aloud: 4 knowledge points of grade 1 and none of grade 2 have a recording, and the lesson on tones has no sound. A child types pinyin with tone numbers ("如 hao3") and the lines of poems through an input method. A six-year-old cannot use it without an adult.

**Build.** Explanations, prompts and feedback of grades 1 and 2 in a child's words, without grammar terms, and read aloud; every pinyin question that turns on a sound plays it; pinyin and poem lines chosen or assembled from tiles, not typed; written text kept to the characters already taught.

**Done when.** A test: every explanation, prompt and feedback of grades 1 and 2 has a recording, uses only characters taught before and no grammar term, and no question of these grades asks for typed input.

### C7.9 Reading in the Heritage Bridges (M)

**Found.** Each heritage bridge has only two topics of its own and no reading passages, though the design promises passages written for the learner's age; the learners, who already speak, are given nothing to read.

**Build.** Passages written for the subject in each bridge, in the characters it has taught so far, for children and for adults, with questions, and recorded so the learner can read along with what they already understand when heard.

**Done when.** Each bridge holds at least 24 passages, every passage keeps to the characters taught before it, and each has a recording.

### C7.10 Gaokao to the Level of the Exam (L)

**Found.** Gaokao practice is far easier than the exam: its idioms are those of primary school (持之以恒, 开门见山); faulty sentences are offered against absurd options; reading questions have three options where the exam has four, and the wrong ones are plainly wrong; there are only 6 informational texts, 6 literary texts and 8 poems. It shares idiom items with grade 9.

**Build.** Idioms, faulty sentences and rhetorical devices at the level of the senior curriculum's quality level 4; four options in every choice question, each wrong option a plausible misreading of the text; at least 20 texts of each kind and 20 poems, written for the subject; no item shared with a lower course.

**Done when.** A test checks four options and the sizes of the pools; a teacher of senior Chinese (§10.3) judges a sample to be at the exam's level.

### C7.11 Enough Texts and Prompts (M)

**Found.** The pools are small and prompts repeat: about 10 passages for a reading topic of grade 3, 11 long passages in HSK 3, 12 prompts for a writing knowledge point, a single prompt in `gaokao-language-sound`, and the same prompt in both writing knowledge points of `writing-7-imagination` and of `writing-8-news`. Recitation cuts ci into fragments such as 更那堪.

**Build.** At least 20 passages a reading topic and 20 prompts a writing knowledge point, written for the subject; no prompt shared between knowledge points; recitation cut at the ends of lines and sense units.

**Done when.** The audit counts passages and prompts and finds no prompt shared and no recitation cue that is not a whole line or sense unit.

### C7.12 Word Topics (S)

**Found.** A topic of ten words shows the same list four times, in its introduction and in each knowledge point, and the same example sentences recur across courses. Some sets gather words that do not share their theme: "Before and After" holds 了, 过, 会, 要 and 住. Wrong options miss the word most easily confused: "next; down" offers 下, 了 and 上午 but not 上. Phrases of levels 7 to 9 are written in pinyin as one word, jiùchénggǎizào, where the rules of Hanyu Pinyin orthography write jiùchéng gǎizào.

**Build.** The list shown once, in the introduction; examples varied by course; sets regrouped by meaning, with function words taught in grammar points; the confusable word of the set offered first; pinyin of phrases written by GB/T 16159.

**Done when.** The audit reports no list repeated in a topic and no example shared between courses, and a test checks the spacing of the pinyin of every phrase.

### C7.13 One Language for Native Courses (S)

**Found.** The native courses explain in Chinese, but Gaokao's reading topics switch to English, explanations and prompts both, when the interface is in English, while grade 5 keeps Chinese; an introduction sometimes repeats the topic's description word for word.

**Build.** Every native course shows its explanations and prompts in Chinese whatever the interface language; introductions say more than the description.

**Done when.** A test over the native courses and the audit.

### C7.14 Texts Laid Out as in a Textbook (M)

**Found.** A text or poem to read or recite is met first in pieces: the introduction leads through it sentence by sentence or word by word, and the whole is seen only in a question, in the size and spacing of a question. A textbook does the reverse: it gives the whole text first, in larger type with wider lines, a poem centred line by line under its title and poet, with pinyin over the characters the learner has not met, and only then works through it. No page or app can yet set pinyin over a character.

**Build.** Each topic that teaches a text or poem opens with the whole of it, before any guidance: title, author and dynasty, the body in larger type and wider spacing than a question, a poem in its lines, prose in its paragraphs, with its recording. Characters not yet taught by the course, counted as C7.7 counts them, carry their pinyin above them as ruby, in the tone they are said in; the content marks them, the compiler checks each reading against the dictionary of `libs/subject-chinese`, and the web app and the apps render it. The guidance by sentence and word follows the whole text, which stays one tap away in every later question on it.

**Done when.** A test that every text and poem topic opens with its whole text and that every untaught character in it has a checked reading; the walk of C7.16 sees the layout on a phone and on the web.

### C7.15 Pictures That Help Understanding (L)

**Found.** Only the sixteen HSK 5 story tasks have pictures. A textbook illustrates nearly every text, poem and new word, and a learner alone has no teacher to show what a 柳 or a 驿站 is or where a poem takes place; English already illustrates its reading units.

**Build.** Pictures, generated with codex's image tool by the agent of [chinese-illustrations.md](chinese-illustrations.md), extended with a section for each kind: one per text and poem, shown above it as a textbook shows it; one per concrete new word of the lower grades, the foreign-language levels and the HSK, shown with the word in its lesson; and one per reading unit cover. The style, review and files follow that document and [english-illustrations.md](english-illustrations.md): no writing in a picture, nothing a picture shows that the text does not say, a classical poem drawn in its own period, the cast kept the same within a course. Batches go in the order of the learners who most need them, grades 1 and 2, level 1 and HSK 1 first.

**Done when.** Every text and poem, and every concrete new word of those courses, has a picture that passed review; a test checks the list against the files.

### C7.16 Gate CG7

C7.1 to C7.15 are done; a walk of every course, at least one lesson and ten questions each, finds none of the problems above; and teachers of Chinese as a native and as a foreign language (§10.3) read a sample of each course for self-study.

## 10. Across All Stages

### 10.1 Testing

| Layer | How |
| :--- | :--- |
| Checkers and generators | Vitest and `sampleGenerators` in `libs/subject-chinese` and `content/chinese` |
| Content | The audit: no thin knowledge point; recitation counted by its cues; ids recorded in `published-ids.txt` |
| Grades | Each grade course's foundations hold no later grade's topics; passages keep to the characters of their grade |
| Speech | Faked services in tests; real services only in trials, with keys in the ignored `.env.local` |
| Learning | Outside tests, not the platform's own questions |

### 10.2 Dependencies on Other Phases

| Phase | Needed by | Why |
| :--- | :--- | :--- |
| Deployment of the API server (C0.4) | C1.4 | A pilot needs a real service |
| P6 Mobile app task players | C2.4, C3.4 | Speech and strokes need players in the apps |
| P9 Billing | Before opening C2.4 widely | Pronunciation assessment costs money per use |

### 10.3 What Only People Can Do

| Item | Stage |
| :--- | :--- |
| Counsel on the lists, the stroke data and minors' recordings | 0, and again before 2 and 3 |
| Review by a primary teacher and by a teacher of Chinese as a foreign language | 1 onward |
| Outside tests, and recruiting learners and guardians | 1 onward |
| Real recordings of learners for checking the speech thresholds | 2 |
| Vendor accounts, keys and contracts | 2 |
| Teachers scoring writing and speech for calibration | 6 |
| Checking the HSK courses against the test owner's sample papers, and confirming the exam dates | 6 |

### 10.4 What Stops the Plan

- **CG1 fails:** no more content until the method is understood.
- **Counsel forbids a list:** the content built from it is regrouped from sources that may be used; ids that learners hold are kept.
- **Pronunciation assessment disagrees with teachers:** speaking stays practice without a score, and tones are taught by listening.
- **The stroke data may not be used:** the writing topics leave the courses, their ids kept, until other data replaces it.
