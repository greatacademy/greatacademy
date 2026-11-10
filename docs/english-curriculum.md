# English Curriculum

> English | [简体中文](english-curriculum.zh-CN.md)

This document specifies the design of the English subject: its knowledge graph, its courses by level for foreign-language and native learners, in which listening, speaking, reading and writing are learned together in units built on themes, and how it teaches and assesses each skill. It applies the method of [The Math Academy Way](the-math-academy-way.md) and runs on the core described in [Content](content.md) and [Learning Engine](learning-engine.md). The first slice of §11 is implemented; §12 lists the order of work, and [English Development Plan](english-development-plan.md) breaks it into milestones.

---

## 1. Principles

1. **One subject, one graph.** Native and foreign-language learners share one knowledge graph. They differ by course: each course is a view over the graph with its own foundations and mastery floor ([Content §6](content.md#6-courses)).
2. **Courses follow levels, not skills.** A course is a level, such as A1 or grades 3 to 5, and teaches every skill of that level at once, as a mathematics course teaches algebra and geometry in the same weeks. Its units are themes; its order comes from the graph (§6).
3. **Both audiences, foreign-language learners first.** The design covers both audiences in full. Foreign-language courses come first in the order of work, because many first learners speak Chinese; native language arts sets the top of the curriculum, and the foreign-language courses merge into the native courses at C1.
4. **Decompose before assessing.** A large skill such as writing an essay becomes hard to judge only when it is assessed whole. Most practice happens on small skills that can be judged reliably.
5. **Deterministic judgment wherever possible.** Rules judge what rules can judge. AI judges only what they cannot, and only after calibration against people (§8.3).
6. **Volume is part of the curriculum.** Language ability and reading comprehension also depend on large amounts of reading, listening and knowledge. Mastery of topics does not replace them (§5).
7. **Never lower the bar.** Feedback points at a problem and does not fix it for the learner. Speaking is judged by intelligibility, never by accent.

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

A course is a level. Each one teaches vocabulary, grammar, listening, speaking, reading and writing together, because a learner uses them together: a word heard in a story is read, said and written in the same week. Courses split by skill would have a learner finish grammar before reading, which is not how anyone learns a language. Mathematics works the same way: a grade's course teaches number, algebra and geometry side by side.

### 6.1 Units Are Themes

A course's units are themes: the library, animals or the weather for beginners, and knowledge units such as ancient Egypt or the water cycle for older native learners (§5). A unit holds:

| Part | In a unit on the library | Judged by |
| :--- | :--- | :--- |
| Words | A batch of 8 to 12 words: borrow, return, shelf, card, due (§4) | Rules |
| Grammar | One or two points the theme uses: questions with can, the simple past | Rules |
| Reading | Graded passages on the theme (§5) | Rules |
| Listening | Short dialogues and announcements on the theme, with a choice (S1) | Rules |
| Writing | From sentences to a paragraph on the theme (§8) | Rules, then AI |
| Speaking | Saying the unit's words and sentences (S2 to S4) | Speech services |
| Conversation | A spoken scene that uses the unit's words and patterns, such as `library-help-desk` (§6.5) | AI against a rubric |

Themes wrap the content; they do not set the order of learning. Every part is a topic or task with its own prerequisites in the graph, and the engine picks from the frontier as in mathematics, so a learner usually works in two or three units at once and the strands interleave: a lesson on a grammar point, a review of last week's words, a passage, a sentence to write. A topic has one place in the graph however many courses show it; a unit groups it for display and decides which theme its examples and passages use.

### 6.2 Foreign-Language Courses

Levels follow the CEFR, whose levels are widely used by tests and textbooks. These courses come first in the order of work (§12).

| Course | Focus |
| :--- | :--- |
| Pre-A1 | Letters and sounds, the first hundred words, classroom phrases, a large amount of listening |
| A1 | Everyday themes such as family, school, food and the library; the present, questions, simple sentences and short messages |
| A2 | The past and the future, comparisons, short stories and letters, describing and explaining |
| B1 | Authentic texts, complex sentences, paragraphs, opinions, longer conversations |
| B2 | Argument and discussion, essays, fluent reading of general texts |
| C1 to C2 | **Merge with the native secondary and college courses** |
| Exam courses | IELTS, TOEFL, Cambridge, Gaokao: practice-only courses over topics already in the graph |

Practice in these courses follows Nation's four strands, in roughly equal time: meaning-focused input, meaning-focused output, language-focused learning and fluency development. Without this balance a course turns into grammar and word lists (§6.4).

### 6.3 Native Courses

| Course | Focus |
| :--- | :--- |
| Kindergarten to grade 2 | Phonics, oral reading fluency, listening comprehension, sentence building |
| Grades 3 to 5 | Grammar, word roots, paragraphs, knowledge-based reading |
| Grades 6 to 8 | Essay structure, argument, literary analysis |
| Grades 9 to 12 | Rhetoric, literature, academic writing, college admission and advanced placement exams |
| College and beyond | Research writing, critical reading, professional writing, style |

Native courses are built the same way: a grade band's units are knowledge units and genres, and each unit reads, discusses and writes about its theme. The focus column says what weighs most in a band, not what it teaches alone.

### 6.4 Balance Across Strands

The frontier decides what may be learned; within it, the engine prefers what unlocks most and reviews what is due. That alone can drift toward the strands with the most topics, usually grammar and words. A course may therefore declare a target share of time for groups of its topics, such as Nation's four strands, and the engine leans its choice toward the group furthest below its share. The parameter is subject-agnostic: it names groups of topics, not skills. Whether it is needed, and how strongly it leans, are decided with simulated students before it is adopted ([Learning Engine](learning-engine.md)).

### 6.5 Conversation Closes a Unit

A unit's last task is a conversation with the AI tutor that needs the unit's words and patterns, such as `library-help-desk` at the end of a unit on the library. Its prerequisites are the unit's topics, so once they are learned it appears under Next like any other task, not as a separate offer. It is done when the learner meets its rubric (S6, §9.1), and earns XP for its time. Until its rubric passes calibration it stays outside the engine and the learner may choose it. A learner without a microphone, or whom no route may serve, skips it and loses nothing in the graph.

### 6.6 How the Audiences Differ
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
- **Themed units.** A course's units carry a theme, and list the passages, listening and conversation that use it (§6.1).
- **Strands.** Each topic names its strand, so that a course can be reviewed and balanced across strands (§6.4).

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
- **Outside the pure libraries.** AI judgment is an asynchronous service (§13.1). `libs/content`, `libs/engine` and the checkers in `libs/subject-english` stay pure.
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
- **Privacy.** Learners include minors. By default only the transcript and scores are kept, not the recording. This requires legal review before launch; the mechanism is in [Minors' Data](minors-data.md).
- **AI conversation applies; it does not teach.** It closes a unit by using what the unit taught (§6.5). Progress in it is hard to measure, so it does not replace S1 to S5.

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

The course `english-grammar-writing` has since added eight topics judged by rules, with 49 in all: `comparatives-and-superlatives` (`adjectives-and-adverbs`), `apostrophes-and-possessives` and `commonly-confused-words` (`nouns-and-pronouns`), `verb-tense-consistency` (`simple-verb-tenses`), `commas-after-introductions` (`capitals-and-end-punctuation`, `prepositional-phrases`), `punctuating-dialogue` (`capitals-and-end-punctuation`), and `academic-words-2` and `academic-words-3`, each after the batch before it. Five more are judged by a model (§13.1): `writing-a-paragraph`, `writing-an-opinion-paragraph` and `writing-a-how-to-paragraph` after the paragraph topics, and `expanding-ideas-in-your-own-words` and `combining-sentences-in-your-own-words` after the combining topics, which check meaning where the rules checked form. A learner whom no route may serve goes through the course without them.

A second course, `english-reading-comprehension` (Reading for Meaning, grades 3 to 5), teaches the reading strand of §3 with 15 topics judged by rules, each item a short original text with a choice: main ideas, summaries and text features; sequence, cause and effect, compare and contrast and text structures; inferences, fact and opinion and the author's purpose; point of view, characters and the lesson of a story; similes, metaphors and idioms. Its outline is [docs/english-courses/english-reading-comprehension.md](english-courses/english-reading-comprehension.md). Only `point-of-view` reaches into the first course, through `nouns-and-pronouns`. A third course, `english-literature-argument` (Literature and Argument, grades 6 to 8), builds on it with 9 such topics: personification and hyperbole, sound devices and rhyme scheme, plot and conflict, theme, and tone and mood; then claims, evidence, reasoning, and counterclaims and rebuttals. Five more teach close reading: narrators and what they know, symbolism, irony, foreshadowing and flashback, and citing textual evidence. Seven topics judged by a model follow, one move of an essay each (§8.3): a thesis statement, an outline, a body paragraph with evidence from a source, a counterclaim paragraph, introductions and conclusions, revising a draft, and a paragraph of literary analysis. A whole essay, judged after the session ends, comes later. Its outline is [docs/english-courses/english-literature-argument.md](english-courses/english-literature-argument.md). A fourth course, `english-rhetoric-composition` (Rhetoric and Composition, grades 9 to 12), builds on the third with 8 topics judged by rules: the rhetorical situation, ethos, pathos and logos, rhetorical devices, logical fallacies and evaluating sources; characterization, allusion, and paradox and oxymoron. Two judged topics close it: a rhetorical analysis and a synthesis of two sources. Its outline is [docs/english-courses/english-rhetoric-composition.md](english-courses/english-rhetoric-composition.md).

**From skill courses to level courses.** These four courses were built by skill, which this design no longer does (§6). Their topics keep their ids and places in the graph, and are regrouped into the level courses: the grammar, words and sentence writing into A1 to B1 and grades 3 to 5, the reading topics into grades 3 to 5 and B1, and the literature, argument and rhetoric into grades 6 to 12 and B2. The four courses are no longer recommended to new learners, and each retires once the level courses that replace it ship. Progress is kept per topic, so a learner who moves to a level course loses nothing.

## 12. Order of Work

1. **First slice** (§11).
2. **Reading and knowledge:** graded reading and knowledge units, then AI-judged paragraphs and essays.
3. **A1 and A2 by themes:** units on everyday themes that regroup the topics already built and add words, grammar, passages and writing for each theme. No listening or speaking content exists yet, so the first versions are strongest in reading, writing, words and grammar; each unit gains listening (S1) and speaking (S2 to S4) as audio and recording arrive, and its conversation once rubrics pass calibration. The skill courses then retire (§11).
4. **B1, B2 and the native grade bands,** built the same way.
5. **Conversation and both ends:** S5 and S6 on the voice service; phonics below; college writing and exam courses above.

| Change | Scope |
| :--- | :--- |
| Content model | Language of explanation, audience, audio, reading tasks, themed units, the strand of each topic |
| AI judgment | An asynchronous service; verdicts stored in events (§13.1) |
| Speech | Recording in the clients; speech services on the server (§13.2); a voice service on Kubernetes for conversation (§13.3) |
| Engine | A calibrated conversation becomes a task under Next; balance across strands only if simulation shows it is needed (§6.4); no change to the frontier, implicit repetition, reviews, XP or quizzes |

## 13. Technology and Deployment

This section is the plan for the parts mathematics does not have. Each part is built when its stage in §12 begins, so the first slice needs none of it.

### 13.1 AI Models

Every model call goes through **pi-ai** (`@earendil-works/pi-ai`), with `@earendil-works/pi-schema` for the shape of answers and `@earendil-works/pi-telemetry` for the time and cost of each call. Versions are pinned exactly, as everywhere; 1.5.0 is the current one. The code sits outside the pure libraries, and tests use pi-ai's `faux` provider, so no test needs a network.

A model answers by calling a `respond` tool whose schema holds the criteria and the quotations.

**No provider or model is fixed in the design or the code.** A platform administrator configures them in an admin console, and pi-ai's custom providers and explicit keys mean that a new provider needs no code unless its API is new. Each use asks for something different:

| Use | What it asks of a model |
| :--- | :--- |
| Meaning checks in W2, many and simple | Low cost |
| Yes-or-no criteria for paragraphs in W4 | A balance of cost and accuracy |
| Essays and long works in W5 and W6, and the baseline for calibration | The highest accuracy |
| Conversation in S6 | Low latency, chosen by measurement |
| Drafting and reviewing content, offline | High accuracy; never receives learners' data |

**What the administrator sets:**

- **Providers:** a named vendor from pi-ai's catalog, or an API and base URL given by hand, with the API key. Keys are encrypted with a key held in Worker secrets and can be replaced but never read back.
- **Routes:** for each use, the model and a backup: per criterion for judgment and per conversation for S6, with a prompt version, and per language for speech-to-text, text-to-speech and pronunciation scoring.
- **The vendor register** of [Minors' Data](minors-data.md#12-vendors): for each provider, the markets it serves, its terms for minors, its retention, and the date checked.

Only platform administrators can reach the console, and every change is logged with who made it and when.

**What the administrator cannot override.** The server checks these whenever a route is saved and whenever it is used:

- A route is live only if a passing calibration exists for that exact criterion, model and prompt version.
- A minor's data reaches a provider only under the conditions of [Minors' Data](minors-data.md#12-vendors). If no route qualifies, the feature is off for that learner, and the course continues without it.

**Changing the model changes the judge.** Each combination of criterion, model and prompt version is calibrated by itself (§8.3) and recorded in the event. When a provider fails, a judgment retries later or moves to a backup model calibrated for that criterion, never to any other.

### 13.2 Recorded Speech

S2 to S5 are recorded and then submitted in an ordinary request, judged in a workflow like writing. Only S6 needs a live connection (§13.3). Audio goes to speech-to-text and pronunciation services through one interface on the server, so that a provider can change.

**Pronunciation assessment has no chosen provider.** It is needed only by foreign-language courses, so the choice waits for stage 3. Azure AI Speech, SpeechSuper, Speechace and Language Confidence are compared on recordings scored by people, including learners whose first language is Chinese, other accents and children. The comparison measures agreement with people and, above all, how often it rejects speech that is accented but understood. It also tests the cheaper measure of intelligibility: whether speech-to-text recognizes the target word.

Speech-to-text may silently correct a learner's grammar, which would hide the errors S4 and S6 judge. Every recognizer is tested for this before use.

### 13.3 The Voice Service

Conversation in S6 runs on **Pipecat** in `apps/voice`, the one part of the platform that is not TypeScript: it is a long-lived Python process, which Workers cannot run. It follows the voice plugin of the Mavio project.

```text
client ──wss with a short-lived ticket──► Cloudflare ──Tunnel──► apps/voice on Kubernetes
   │                                                                │
   └──asks the web Worker for a ticket                              ├─► speech-to-text, text-to-speech
                                                                    └─► web Worker: model answers, results
```

- **Pipeline.** Pipecat handles voice activity, the end of a turn, interruption and the speech services. It has no LLM service: answers come from the Worker through pi-ai, so that every model call is in one place. Learners pause longer than native speakers, so the longest pause in a turn is set by level.
- **Project.** Python and uv are pinned in `mise.toml`, with pytest, ruff and pyright. Pipecat is pinned exactly (1.15.0 is current). The image holds the model weights, so that a first session downloads nothing.
- **Tickets.** The Worker signs a ticket valid for about 60 seconds that names the learner, course and session; the service checks it with a public key. The service calls the Worker with its own credential, and writing a result is idempotent by session id.
- **Turns.** The service sends the Worker the conversation so far and gets the tutor's next line and whether it ends; the first line is the conversation's opening, with no model call. The Worker plays the conversation's scenario through the route of use `conversation`, primary then backup, and ends it after 40 turns or once its minutes have passed. A learner has at most 10 conversations a day.
- **Transport.** A WebSocket, which needs no UDP on the pods: 16-bit mono PCM at 16 kHz as binary messages both ways, and JSON text messages for the rest (`apps/voice/src/ga_voice/messages.py`). If measurements on real mobile networks across regions fall short, the transport changes to WebRTC through Cloudflare's TURN; the pipeline does not depend on it.
- **Privacy.** Pods have no persistent volume and keep no audio, and logs hold no transcripts. The Worker keeps a session's transcript for 30 days, and never a child's.
- **Clients.** The web client follows Mavio's: an AudioContext at the device's rate made in the learner's press, a worklet that averages down to 16 kHz in 20 ms frames, the tutor played through the same context so that the browser's echo cancellation removes it, a silent microphone replaced by another, and what is said before the socket opens held and sent once it does. The apps take 16 kHz PCM from their own crate, `apps/nsh/native/voice`, which JavaScript polls every 40 ms: on iOS an AVAudioEngine in a voice-chat session with voice processing on, the input averaged down to 16 kHz and the tutor played by a player node on the same engine; on Android an AudioRecord from the voice-communication source with the device's echo canceler and noise suppressor, and an AudioTrack for voice communication on the record's session, routed to the speaker while no headset is on. An interruption drops what was queued, and the microphone closes only once the tutor's last words have played.

Production runs on a Kubernetes cluster on Hetzner Cloud in Hillsboro, beside PostgreSQL ([Architecture §6](architecture.md#6-deployment)), with manifests in `deploy/voice` as a Kustomize base and overlays:

| Concern | Design |
| :--- | :--- |
| Workload | A stateless Deployment |
| Capacity | Each pod runs a fixed number of sessions in pre-started subprocesses, and reports not ready when full; the number comes from a load test |
| Scaling | KEDA on the number of active sessions, not on CPU: each pod reports `voice_sessions_active` at `/metrics`, and Prometheus sums it |
| Session length | Limited by the product, starting at 20 minutes |
| Rollout and scale-down | On `SIGTERM` a pod refuses new sessions and waits for the running ones, after a short `preStop` pause that lets traffic move away; `terminationGracePeriodSeconds` is 25 minutes |
| Safety | A PodDisruptionBudget, a NetworkPolicy admitting only the Tunnel and limiting egress to DNS and public HTTPS, keys in Secrets, a read-only filesystem as a user without privileges |
| Resources | CPU only, since the speech services are in the cloud |

### 13.4 Cloudflare Services

| Stage | Service | Use |
| :--- | :--- | :--- |
| First slice | Workers | The gateway and shards of English; no new product |
| Writing | Workers | Judgment in the web Worker while the learner waits, with retries, leases and progress kept in the `judgment` table, so no Workflow is needed |
| Writing | AI Gateway | Logs, cost and limits for model calls; no caching of judgments, and no logging of text by minors |
| Writing | Rate Limiting | Limits on abuse and cost |
| Speech | R2 | Audio of prompts, and recordings kept briefly and deleted by a lifecycle rule |
| Speech | Workers AI | Speech-to-text, if it does as well as the provider's own API |
| Conversation | Tunnel | Reaches the cluster with no inbound port |
| Conversation | WAF and rate limiting rules | Protect the voice hostname |
| Conversation | Realtime TURN | Only if the transport becomes WebRTC |

### 13.5 Local Development

Local tests use **containers only, not Kubernetes**.

- `compose.yaml` gains a `voice` service beside PostgreSQL, built from the production image, and it reaches `cf dev` on the host.
- Tests run the pipeline with faked speech services, and real services are used with development keys from an ignored file.
- Draining is tested by stopping the container during a session: `SIGTERM` must refuse new sessions and let the running one finish.
- Manifests are only rendered and validated locally. They first run in a test namespace on the cluster.

### 13.6 To Confirm Before Building

- That the `cf` command line can declare R2 lifecycle rules and the AI binding.
- That pi-ai works against real providers on Workers. It has so far passed in workerd only against mocked responses, including streaming tool calls for Anthropic, OpenAI and Google.
- That a WebSocket stays stable through Tunnel for the length of a session.
- The latency for learners far from Hillsboro, the cluster's one region, which the measurements above must cover.

## 14. Risks

- **The method is less proven here.** Comprehension in particular may not transfer from practice. The outside test decides.
- **Content cost.** Passages and item banks need human review, and this is the largest cost. The total has not been estimated.
- **AI judgment.** Accuracy, cost and dependence on a provider are all risks; the levels in §8 and §9 keep AI use small.
- **Children's data.** Recordings and writing by minors need legal review in each market, starting from [Minors' Data](minors-data.md).

## 15. References

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
