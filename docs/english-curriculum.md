# English Curriculum

> English | [简体中文](english-curriculum.zh-CN.md)

This document specifies the design of the English subject: its knowledge graph, its courses for native and foreign-language learners, and how it teaches and assesses reading, writing and speaking. It applies the method of [The Math Academy Way](the-math-academy-way.md) and runs on the core described in [Content](content.md) and [Learning Engine](learning-engine.md). Nothing here is implemented yet; §12 lists the order of work.

---

## 1. Principles

1. **One subject, one graph.** Native and foreign-language learners share one knowledge graph. They differ by course: each course is a view over the graph with its own foundations and mastery floor ([Content §6](content.md#6-courses)).
2. **Native learners come first.** The design covers both audiences in full, and native language arts sets the priority of the work and the top of the curriculum. Foreign-language courses merge into the native courses at the upper levels.
3. **Decompose before assessing.** A large skill such as writing an essay becomes hard to judge only when it is assessed whole. Most practice happens on small skills that can be judged reliably.
4. **Deterministic judgment wherever possible.** Rules judge what rules can judge. AI judges only what they cannot, and only after calibration against people (§8.3).
5. **Volume is part of the curriculum.** Language ability and reading comprehension also depend on large amounts of reading, listening and knowledge. Mastery of topics does not replace them (§5).
6. **Never lower the bar.** Feedback points at a problem and does not fix it for the learner. Speaking is judged by intelligibility, never by accent.

## 2. What Carries Over from Mathematics

| Idea | In English | Carries over |
| :--- | :--- | :--- |
| Knowledge graph and frontier | Clear order in decoding, grammar and sentence writing; weaker order in reading comprehension | In part |
| Mastery before moving on | Skills that can be decomposed: clauses, word roots, paragraph structure | Yes |
| Spaced repetition | Vocabulary, grammar and spelling | Yes; vocabulary needs its own design (§4) |
| Fractional implicit repetition | Writing a complex sentence also practices grammar and punctuation | Yes; weights are calibrated anew |
| Automaticity | Decoding and oral reading must become effortless so that attention is free for meaning | Yes; adds timed oral reading |
| Reading volume and knowledge building | Has no counterpart in mathematics | **New** (§5) |

The Simple View of Reading treats comprehension as the product of decoding and language comprehension (Gough & Tunmer, 1986), and Scarborough's Reading Rope breaks both into strands. The two give the graph its early structure. Recht and Leslie (1988) found that prior knowledge of a subject affected comprehension as much as reading ability did, which is why knowledge has a strand of its own.

## 3. The Knowledge Graph

The subject has seven strands, connected by edges across strands.

| Strand | Contents |
| :--- | :--- |
| Sound and print | Phonemic awareness, phonics, spelling patterns |
| Words | Roots and affixes, academic vocabulary, multiple meanings, collocations |
| Grammar and sentences | From word classes and sentence parts to complex sentences and style |
| Reading | Decoding fluency, text structure, inference, analysis of argument |
| Writing | From sentences through paragraphs and essays to research writing |
| Listening and speaking | Sound discrimination, pronunciation, oral reading, retelling, presenting, discussion |
| Literature and knowledge | Genres, rhetoric, major works, knowledge units in history and science |

A typical path crosses strands:

```text
Grammar: subordinating conjunctions → Writing: combining sentences with because and although → Writing: argument paragraphs
```

The later topic encompasses the earlier ones, so implicit repetition applies across strands. Topic ids follow the usual rules: kebab case, and never changed once published.

## 4. Vocabulary

One topic per word would multiply the graph by tens of thousands. Instead:

- A topic is a **batch of 8 to 12 words** related by root or meaning, within the existing granularity rules.
- A review samples words from its batch, so the engine does not change.
- Instruction concentrates on words useful across subjects, the second of the three tiers of Beck, McKeown and Kucan. Domain terms are taught inside the knowledge units that need them.
- If the pilot shows that words within a batch are forgotten at very different rates, the engine gains a word-level memory state. That is a later decision, made from data.

## 5. Reading Volume and Knowledge

A new **reading task** gives a graded passage with a short comprehension check.

- **Graded by the graph.** Each passage declares the topics and words it depends on, and is offered only to learners who know enough of them. The target for known running words starts at 98%, the figure from Hu and Nation (2000). That figure is contested: Schmitt and colleagues (2011) found a roughly linear relationship between known words and comprehension, and a later replication did not fully reproduce the original. So the target is a parameter to calibrate, not a rule.
- **Knowledge units.** Passages come in sequences on one domain, so that each passage makes the next easier to read.
- **Sources.** Passages are original or in the public domain. Texts, questions and word lists from published courses and tests are never copied.
- **Credit.** Reading earns XP for the time it takes and gives partial credit to the topics it depends on.

Comprehension checks draw on many passages, because a passage read before no longer tests comprehension.

## 6. Courses

### 6.1 Native Courses

| Course | Focus |
| :--- | :--- |
| Kindergarten to grade 2 | Phonics, oral reading fluency, listening comprehension, sentence building |
| Grades 3 to 5 | Grammar, word roots, paragraphs, knowledge-based reading |
| Grades 6 to 8 | Essay structure, argument, literary analysis |
| Grades 9 to 12 | Rhetoric, literature, academic writing, college admission and advanced placement exams |
| College and beyond | Research writing, critical reading, professional writing, style |

### 6.2 Foreign-Language Courses

Levels follow the CEFR, whose levels are widely used by tests and textbooks.

| Course | Focus |
| :--- | :--- |
| Pre-A1 to A2 | Letters and sounds, high-frequency words, basic grammar, a large amount of listening |
| B1 to B2 | Authentic texts, complex sentences, paragraph writing, discussion |
| C1 to C2 | **Merge with the native secondary and college courses** |
| Exam courses | IELTS, TOEFL, Cambridge, Gaokao: practice-only courses over topics already in the graph |

Practice in these courses follows Nation's four strands, in roughly equal time: meaning-focused input, meaning-focused output, language-focused learning and fluency development. Without this balance a course turns into grammar and word lists.

### 6.3 How the Audiences Differ

| | Native learners | Foreign-language learners |
| :--- | :--- | :--- |
| Already have | Speech, a feel for grammar, a large listening vocabulary | Often literacy and general knowledge, if adults |
| Main gaps | Print, academic language, writing | Listening, speaking, feel for grammar, vocabulary size |
| Grammar | Makes what they already use explicit, to improve writing | Built from nothing, with much input |
| Topics of their own | Moving between dialect and standard written English | Articles, tense, plurals and sounds such as th and r/l, for speakers of Chinese |

## 7. Content Model

The core stays subject-agnostic. `libs/subject-english` holds the checkers and `content/english` the content, with Workers of their own as for mathematics. English needs these additions:

- **Language of explanation.** A course chooses it. Native courses explain in English whatever the interface language; foreign-language courses may explain in Chinese. Every explanation still exists in both locales, and English being learned is written with `same`.
- **Audience.** A knowledge point can hold examples for different audiences, so that an adult beginner does not read sentences written for an eight-year-old.
- **Item banks.** English cannot be generated from random numbers as mathematics can. A generator picks from hand-written items by seed, and may vary them by template. It stays deterministic, lists wrong responses and passes `sampleGenerators`.
- **Audio.** Prompts can play audio, and responses can be recordings.

## 8. Writing

### 8.1 Levels

| Level | Practice | Judged by |
| :--- | :--- | :--- |
| W1 Conventions | Punctuation, capitalization, spelling | Rules |
| W2 Sentences | Combining sentences, expanding with because, but and so, rewriting into a given form | Rules for structure, AI for meaning |
| W3 Revision and judgment | Fixing errors, ordering sentences, choosing the best topic sentence, finding an unsupported claim | Mostly rules |
| W4 Paragraphs | One move at a time: a topic sentence, evidence, a conclusion | AI, against a few yes-or-no criteria |
| W5 Essays | Outline, draft, revision | AI, against a rubric, with samples checked by people |
| W6 Long works | Research papers, professional writing | AI feedback, with optional human review |

Most practice sits in W1 to W3, where judgment is cheap and reliable. Graham and Perin (2007) found strong effects for teaching strategies of planning, revising and editing, and also support summarizing and sentence combining. *The Writing Revolution* (Hochman & Wexler) is the model for building from explicit sentence instruction up to compositions.

### 8.2 Rules of Assessment

- **Assess what was taught.** A paragraph that practices evidence is judged on evidence. Feedback names at most two points.
- **No overall score from AI.** A rubric is split into yes-or-no criteria, and the AI must quote the learner's text for each one, so that its judgment can be inspected.
- **Revision is the path to passing.** Feedback says what is wrong and where, the learner rewrites, and the revision is what passes.
- **Reviews are short.** A topic is reviewed through a small constrained task, not another essay. An essay gives implicit credit to the skills it uses.

### 8.3 AI Judgment

- **Calibration comes first.** A set of texts scored by people is the test. An AI criterion goes live only when its agreement with people approaches the agreement between two people.
- **Fits the engine.** The fraction of criteria met is the repetition's result in [0, 1]. The verdict and the model version are stored in the event, so replay never calls the AI again.
- **Outside the pure libraries.** AI judgment is an asynchronous service. `libs/content`, `libs/engine` and the checkers in `libs/subject-english` stay pure.
- **Learner text is data.** Text in an essay is never treated as an instruction to the judge.
- **Integrity.** No AI-writing detector, because detectors are unreliable and accuse people wrongly. Quizzes are taken in the app under time limits, so outsourced writing does not help a learner pass them.

## 9. Speaking

### 9.1 Levels

Reliability falls as speech becomes more open, so practice moves from constrained to open.

| Level | Practice | Judged by |
| :--- | :--- | :--- |
| S1 Listening | Telling apart sounds, as in ship and sheep | Choice; needs no microphone |
| S2 Pronunciation | Repeating sounds, words and stress | Speech assessment |
| S3 Oral reading and shadowing | Timed reading aloud, shadowing rhythm and intonation | Speech alignment; words correct per minute |
| S4 Constrained speech | Saying a sentence in the past tense, describing a picture with a given pattern | Speech to text, then rules |
| S5 Semi-open speech | Retelling a passage, summarizing aloud | AI checks coverage of key points |
| S6 Open speech | Presentations, debate, conversation with AI | Fluency measures, and AI against a rubric |

Foreign-language courses start early and concentrate on S1 to S4, which build automatic speech. Native courses concentrate on S3, S5 and S6: fluent reading, structure and presenting. They do not practice pronunciation.

### 9.2 Rules of Assessment

- **Intelligibility, not accent.** No dialect or foreign accent loses marks. Sounds are corrected in order of how much they harm understanding, following the intelligibility principle (Levis, 2005).
- **Low confidence is never a failure.** Speech systems can be inaccurate for children and for less common accents. When confidence is low, the learner is asked to record again and no failure is counted.
- **Technology never blocks learning.** A learner without a microphone or in a noisy place can skip speaking. Reading and writing topics have no prerequisites in speaking.
- **Privacy.** Learners include minors. By default only the transcript and scores are kept, not the recording. This requires legal review before launch.
- **AI conversation is application, not instruction.** It motivates, but progress in it is hard to measure, so it does not replace S1 to S5.

## 10. Diagnostic and Pilot

The diagnostic places a learner on the graph as in mathematics, using reliably judged topics; it does not depend on speech or AI judgment. The [pilot](roadmap.md#3-pilot) measures learning with an outside test, not with the platform's own questions. This matters especially in English, because a highly structured method is less proven here and practice in comprehension may transfer weakly.

## 11. First Slice

The first slice is grammar, sentence writing and words for grades 3 to 8. Nearly all of it can be judged by rules, so it needs neither speech nor AI, and it tests whether mastery learning and implicit repetition work in English. Phonics comes later even though it is at the bottom of the graph: young children rarely study alone, and it depends on audio and speech.

These topics are a first draft, with direct prerequisites in parentheses.

**Grammar and sentences**

- `subjects-and-predicates`
- `nouns-and-pronouns`
- `complete-sentences-and-fragments` (`subjects-and-predicates`)
- `simple-verb-tenses` (`subjects-and-predicates`)
- `subject-verb-agreement` (`simple-verb-tenses`)
- `pronoun-antecedent-agreement` (`nouns-and-pronouns`)
- `adjectives-and-adverbs` (`nouns-and-pronouns`)
- `prepositional-phrases` (`adjectives-and-adverbs`)
- `coordinating-conjunctions` (`complete-sentences-and-fragments`)
- `run-ons-and-comma-splices` (`coordinating-conjunctions`)
- `subordinating-conjunctions` (`coordinating-conjunctions`)
- `relative-clauses` (`subordinating-conjunctions`, `pronoun-antecedent-agreement`)
- `appositives` (`relative-clauses`)
- `participial-phrases` (`relative-clauses`, `simple-verb-tenses`)
- `misplaced-modifiers` (`participial-phrases`)
- `active-and-passive-voice` (`subject-verb-agreement`)
- `parallel-structure` (`coordinating-conjunctions`)

**Writing**

- `capitals-and-end-punctuation` (`complete-sentences-and-fragments`)
- `commas-in-a-series` (`coordinating-conjunctions`)
- `expanding-with-because-but-so` (`coordinating-conjunctions`)
- `combining-with-conjunctions` (`subordinating-conjunctions`, `expanding-with-because-but-so`)
- `fixing-run-ons` (`run-ons-and-comma-splices`)
- `combining-with-relative-clauses` (`relative-clauses`, `combining-with-conjunctions`)
- `combining-with-appositives` (`appositives`, `combining-with-relative-clauses`)
- `varying-sentence-openings` (`prepositional-phrases`, `participial-phrases`)
- `cutting-wordiness` (`active-and-passive-voice`)
- `identifying-topic-sentences` (`combining-with-conjunctions`)
- `ordering-sentences-in-a-paragraph` (`identifying-topic-sentences`)
- `choosing-transitions` (`ordering-sentences-in-a-paragraph`)
- `removing-off-topic-sentences` (`identifying-topic-sentences`)

**Words**

- `base-words-and-affixes`
- `common-prefixes` (`base-words-and-affixes`)
- `common-suffixes` (`base-words-and-affixes`)
- `suffixes-that-change-word-class` (`common-suffixes`)
- `prefixes-of-number-and-position` (`common-prefixes`)
- `latin-roots-1` (`common-prefixes`, `common-suffixes`)
- `latin-roots-2` (`latin-roots-1`)
- `greek-roots-1` (`common-prefixes`, `common-suffixes`)
- `context-clues`
- `academic-words-1` (`context-clues`)
- `connotation-and-precise-words` (`academic-words-1`)

Examples of encompassing edges, with starting weights to calibrate: `combining-with-relative-clauses` encompasses `relative-clauses` (0.5); `fixing-run-ons` encompasses `run-ons-and-comma-splices` (0.5); `latin-roots-2` encompasses `latin-roots-1` (0.2).

The slice is complete when it compiles, every generator passes sampling, simulated students finish it, and real learners improve on an outside test written without the platform's questions.

## 12. Order of Work

1. **First slice** (§11).
2. **Reading and knowledge:** graded reading and knowledge units, then AI-judged paragraphs and essays.
3. **Foreign-language courses:** A1 to B1, with listening and S1 to S4.
4. **Both ends:** phonics below; college writing and exam courses above.

| Change | Scope |
| :--- | :--- |
| Content model | Language of explanation, audience, audio, reading tasks |
| AI judgment | An asynchronous service; verdicts stored in events |
| Speech | Recording in the clients; a speech service on the server |
| Engine | No change to the frontier, implicit repetition, reviews, XP or quizzes |

## 13. Risks

- **The method is less proven here.** Comprehension in particular may not transfer from practice. The outside test decides.
- **Content cost.** Passages and item banks need human review, and this is the largest cost. The total has not been estimated.
- **AI judgment.** Accuracy, cost and dependence on a provider are all risks; the levels in §8 and §9 keep AI use small.
- **Children's data.** Recordings and writing by minors need legal review in each market.

## 14. References

- Beck, I. L., McKeown, M. G., & Kucan, L. *Bringing Words to Life*.
- Gough, P. B., & Tunmer, W. E. (1986). Decoding, reading, and reading disability. *Remedial and Special Education*.
- Graham, S., & Perin, D. (2007). A meta-analysis of writing instruction for adolescent students. *Journal of Educational Psychology*, 99, 445–476.
- Hochman, J. C., & Wexler, N. *The Writing Revolution*.
- Hu, M., & Nation, P. (2000). Unknown vocabulary density and reading comprehension. *Reading in a Foreign Language*.
- Levis, J. M. (2005). Changing contexts and shifting paradigms in pronunciation teaching. *TESOL Quarterly*.
- Nation, P. The four strands. *Innovation in Language Learning and Teaching*.
- Recht, D. R., & Leslie, L. (1988). Effect of prior knowledge on good and poor readers' memory of text. *Journal of Educational Psychology*.
- Scarborough, H. S. (2001). Connecting early language and literacy to later reading (dis)abilities. In *Handbook of Early Literacy Research*.
- Schmitt, N., Jiang, X., & Grabe, W. (2011). The percentage of words known in a text and reading comprehension. *The Modern Language Journal*.
