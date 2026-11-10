# English Content Progress

The first slice is written: the 41 topics of `english-grammar-writing`, reviewed by no outside reader yet. Eight more topics of usage, mechanics and academic words follow it, and five judged by a model: two of W2 sentences in `src/topics/writing-sentences-judged.ts` and three of W4 paragraphs in `src/topics/writing-paragraphs-judged.ts`, so the course has 54. Its reading units of grades 3 to 5 are `water-on-earth`, `how-plants-live`, `life-on-the-nile`, `weather-and-climate`, `the-human-body` and `our-changing-earth`, 10 passages each, in `src/reading`; their words are in `src/reading/lexicon.ts`. The second course, `english-reading-comprehension`, has 15 topics of reading skills in `src/topics/reading-informational.ts` and `src/topics/reading-thinking.ts`, reviewed by no outside reader yet. The third, `english-literature-argument`, has 9 topics of literature and argument for grades 6 to 8 in `src/topics/literature.ts` and `src/topics/argument.ts`, 5 topics of close reading in `src/topics/literary-analysis.ts`, and 7 judged moves of an essay in `src/topics/writing-essays-judged.ts` and `src/topics/literary-analysis.ts`. The fourth, `english-rhetoric-composition`, has 10 topics of rhetoric, literature and writing from sources for grades 9 to 12 in `src/topics/rhetoric.ts`, two of them judged, and the reading units `voices-of-persuasion` of 10 persuasive texts in `src/reading/speeches.ts` and `the-writers-craft` of 10 short stories in `src/reading/craft.ts`. See [docs/english-development-plan.md](../../docs/english-development-plan.md).

## Courses by Level: Claims and Order

The level courses of [docs/english-curriculum.md §6](../../docs/english-curriculum.md#6-courses) are written by several agents at once in this directory. Each owns the files below and edits no other; the coordinator owns everything else, including `src/pack.ts`, `src/packs.ts`, `src/index.ts`, `src/shards/`, `src/courses.ts`, `src/conversations.ts`, the tests at the top of `src/`, this file and `docs/english-curriculum*.md`, reviews the work and commits it. No agent commits.

| Owner | Files | Work, in order |
| :--- | :--- | :--- |
| `levels-topics` | `src/levels/*/topics.ts` and topic files beside it, `libs/subject-english/src/criteria-levels.ts`, `docs/english-courses/english-{pre-a1,a1,a2,b1,b2}*.md` | The outlines of all five levels first, then the topics of Pre-A1, A1, A2, B1 and B2 in turn |
| `levels-courses` | `src/levels/*/reading.ts`, `src/levels/*/conversations.ts`, `src/levels/*/course.ts` and files beside them, `src/exams/` | For each level once its topics are in: its reading units, conversations and course; then the exam courses |
| `native` | `src/native/`, `src/topics/`, `src/reading/`, `libs/subject-english/src/criteria-native.ts`, `docs/english-courses/english-grades-*.md`, `docs/english-courses/english-college-*.md` | The outlines of the native courses, then grades 3 to 5, 6 to 8, 9 to 12 and college writing in turn |

Course ids: `english-pre-a1`, `english-a1`, `english-a2`, `english-b1`, `english-b2`; `english-grades-3-5`, `english-grades-6-8`, `english-grades-9-12`, `english-college-writing`; `english-ielts`, `english-toefl`, `english-cambridge-first`, `english-gaokao`.

**Depth before breadth.** Rule-checked grammar, usage and sentence-writing knowledge points have at least 30 distinct items, each vocabulary word appears in at least three sentences (25 items or more per knowledge point), judged writing has at least 12 tasks per knowledge point, and reading units have 6 to 8 passages (native units 8 to 10). Fewer topics are written rather than thin ones.

Content that needs audio or recording (listening of S1, speaking of S2 to S4, phonics) waits for its services; a unit is written without it, and its outline says what it will gain.

| Step | State |
| :--- | :--- |
| Content model: strands, themed units, packs | Done |
| Outlines of Pre-A1 to B2 | Not started |
| Outlines of the native courses | Done |
| Grades 3 to 5: 78 topics in 9 themed units, `our-solar-system`, 9 conversations | Done; the 56 regrouped topics keep about 10 items per knowledge point |

## Reasons for Encompassing Weights

Weights are starting points, to be calibrated from real answers (P10). Each states how much of the earlier topic a problem of the later one practices.

| Topic | Encompasses | Weight | Reason |
| :--- | :--- | :--- | :--- |
| `run-ons-and-comma-splices` | `coordinating-conjunctions` | 0.3 | Recognizing the error relies on what a conjunction joins |
| `relative-clauses` | `subordinating-conjunctions` | 0.2 | Only the idea of a dependent clause carries over |
| `misplaced-modifiers` | `participial-phrases` | 0.3 | Most items turn on an opening participial phrase |
| `parallel-structure` | `coordinating-conjunctions` | 0.2 | The pairs and lists are joined by conjunctions, which are not the point |
| `capitals-and-end-punctuation` | `complete-sentences-and-fragments` | 0.3 | Each item needs seeing where a sentence begins and ends |
| `commas-in-a-series` | `coordinating-conjunctions` | 0.2 | Items end with a conjunction but test the commas |
| `expanding-with-because-but-so` | `coordinating-conjunctions` | 0.3 | *But* and *so* are practiced directly, *because* is new |
| `combining-with-conjunctions` | `subordinating-conjunctions` | 0.5 | Half of the items write these conjunctions with their commas |
| `combining-with-conjunctions` | `expanding-with-because-but-so` | 0.3 | The other half repeats that joining |
| `fixing-run-ons` | `run-ons-and-comma-splices` | 0.5 | Fixing requires finding the same error first |
| `combining-with-relative-clauses` | `relative-clauses` | 0.5 | Each item writes such a clause |
| `combining-with-relative-clauses` | `combining-with-conjunctions` | 0.2 | Only the act of joining carries over |
| `combining-with-appositives` | `appositives` | 0.5 | Each item writes an appositive with its commas |
| `combining-with-appositives` | `combining-with-relative-clauses` | 0.2 | Only the placing after the noun carries over |
| `varying-sentence-openings` | `prepositional-phrases`, `participial-phrases` | 0.2 each | Each knowledge point moves one kind of phrase |
| `cutting-wordiness` | `active-and-passive-voice` | 0.3 | One of three knowledge points rewrites passives |
| `ordering-sentences-in-a-paragraph` | `identifying-topic-sentences` | 0.3 | Logical order begins with finding the topic sentence |
| `choosing-transitions` | `ordering-sentences-in-a-paragraph` | 0.2 | Only the attention to relationships carries over |
| `removing-off-topic-sentences` | `identifying-topic-sentences` | 0.4 | Each item tests sentences against a topic sentence |
| `suffixes-that-change-word-class` | `common-suffixes` | 0.4 | Forming each word uses the same spelling rules |
| `prefixes-of-number-and-position` | `common-prefixes` | 0.3 | Reading these words uses the same method |
| `latin-roots-1`, `greek-roots-1` | `common-prefixes`, `common-suffixes` | 0.1 each | Their words contain affixes, but the roots are the point |
| `latin-roots-2` | `latin-roots-1` | 0.2 | The method repeats, not the roots |
| `academic-words-1` | `context-clues` | 0.3 | Sentence items rely on reading for clues |
| `connotation-and-precise-words` | `academic-words-1` | 0.2 | Only the attention to exact meaning carries over |
| `comparatives-and-superlatives` | `adjectives-and-adverbs` | 0.2 | Every item uses an adjective, but the forms are the point |
| `apostrophes-and-possessives` | `nouns-and-pronouns` | 0.2 | Possessives are formed on nouns, and *its* is a pronoun |
| `verb-tense-consistency` | `simple-verb-tenses` | 0.3 | Fixing a shift writes an irregular past form |
| `commas-after-introductions` | `capitals-and-end-punctuation`, `prepositional-phrases` | 0.2 each | Items rewrite whole sentences, and many openings are prepositional phrases |
| `punctuating-dialogue` | `capitals-and-end-punctuation` | 0.3 | Each quotation needs its capital and its end mark |
| `academic-words-2`, `academic-words-3` | the batch before | 0.2 | Only the method of reading a sentence for meaning carries over |
| `supporting-details` | `main-idea` | 0.3 | Each item first needs the main idea that a detail or summary serves |
| `text-structures` | `sequence-in-texts`, `cause-and-effect-in-texts`, `compare-and-contrast-in-texts` | 0.2 each | Naming a structure relies on the signal words of each, which are not practiced directly |
| `authors-purpose` | `fact-and-opinion` | 0.2 | Persuasion is told by its opinions, but only some items turn on them |
| `characters` | `making-inferences` | 0.3 | Every trait and feeling is inferred from actions |
| `lesson-of-a-story` | `characters` | 0.2 | Only reading what a character's choice shows carries over |
| `personification-and-hyperbole` | `similes-and-metaphors` | 0.2 | Reading any figure of speech past its words carries over |
| `plot-and-conflict` | `characters` | 0.2 | Conflicts are told through what characters want and fear |
| `theme` | `lesson-of-a-story` | 0.3 | A theme is a lesson that is not stated |
| `claims` | `fact-and-opinion` | 0.3 | Each item separates a position from facts |
| `evidence` | `claims` | 0.3 | Each item first needs the claim the evidence serves |
| `reasoning` | `evidence` | 0.3 | Each item links evidence to its claim |
| `counterclaims-and-rebuttals` | `reasoning` | 0.2 | A rebuttal gives reasons, but the point is the opposing view |
| `writing-a-paragraph` | `identifying-topic-sentences` | 0.5 | Every paragraph opens with a topic sentence |
| `writing-a-paragraph` | `removing-off-topic-sentences` | 0.3 | Every sentence must support the point, but nothing is removed |
| `expanding-ideas-in-your-own-words` | `expanding-with-because-but-so` | 0.5 | The same three words, with endings of one's own |
| `combining-sentences-in-your-own-words` | `combining-with-conjunctions`, `combining-with-relative-clauses` | 0.3 each | Most items are combined with one of these |
| `combining-sentences-in-your-own-words` | `combining-with-appositives` | 0.2 | Some items are best combined with an appositive |
| `writing-an-opinion-paragraph` | `writing-a-paragraph` | 0.4 | An opening point, support and a closing sentence carry over |
| `writing-a-how-to-paragraph` | `writing-a-paragraph`, `ordering-sentences-in-a-paragraph` | 0.3 each | The paragraph opens with its point and orders its steps |
| `writing-a-how-to-paragraph` | `choosing-transitions` | 0.2 | Transitions mark the steps, but only of sequence |
| `writing-a-thesis-statement` | `claims` | 0.4 | A thesis is a claim with its reasons |
| `outlining-an-argument` | `writing-a-thesis-statement`, `evidence` | 0.3 each | Each outline opens with a thesis and lists evidence |
| `writing-an-evidence-paragraph` | `reasoning` | 0.4 | Explaining evidence is linking it to the claim |
| `writing-an-evidence-paragraph` | `outlining-an-argument` | 0.2 | Only a reason with its evidence carries over |
| `writing-a-counterclaim-paragraph` | `counterclaims-and-rebuttals` | 0.4 | Each paragraph writes both |
| `writing-a-counterclaim-paragraph` | `writing-an-evidence-paragraph` | 0.2 | A rebuttal backs its answer with a reason or evidence |
| `introductions-and-conclusions` | `writing-a-thesis-statement` | 0.4 | Each introduction ends on a thesis, and each conclusion restates one |
| `revising-a-draft` | `writing-an-evidence-paragraph` | 0.3 | Most drafts need a point, evidence or an explanation added |
| `narrative-point-of-view` | `point-of-view` | 0.4 | First person returns among the choices, and every item reads pronouns |
| `symbolism` | `theme` | 0.2 | A symbol is read through the idea it carries, but themes are not named |
| `foreshadowing-and-flashback` | `plot-and-conflict` | 0.2 | Each item places an event in the plot |
| `citing-textual-evidence` | `theme` | 0.2 | Choosing evidence for a claim repeats choosing evidence for a theme |
| `writing-a-literary-analysis-paragraph` | `citing-textual-evidence` | 0.4 | Every paragraph quotes the passage for a claim |
| `writing-a-literary-analysis-paragraph` | `writing-an-evidence-paragraph` | 0.3 | Claim, evidence and explanation are the same moves |
| `rhetorical-situation` | `authors-purpose` | 0.3 | Half of the items name a text's purpose |
| `rhetorical-appeals` | `reasoning`, `rhetorical-situation` | 0.2 each | Logos is reasoning, and every appeal is aimed at an audience |
| `rhetorical-devices` | `parallel-structure` | 0.2 | Anaphora and antithesis are built on parallel phrases |
| `logical-fallacies` | `reasoning` | 0.2 | Each fallacy is a failure of the link from evidence to claim |
| `evaluating-sources` | `evidence` | 0.2 | Only the attention to what makes evidence strong carries over |
| `characterization` | `characters` | 0.2 | Inferring a trait from actions is practiced again, but naming the method is the point |
| `writing-a-rhetorical-analysis` | `rhetorical-appeals`, `rhetorical-devices` | 0.3 each | Most paragraphs name an appeal or a device |
| `writing-a-rhetorical-analysis` | `writing-a-literary-analysis-paragraph` | 0.2 | Quoting and explaining a passage carries over |
| `synthesizing-sources` | `writing-an-evidence-paragraph` | 0.3 | Each source is used as evidence for a point |
| `synthesizing-sources` | `evaluating-sources` | 0.2 | Using sources well relies on knowing what each one shows |
| The ten word batches of grades 3 to 5 (`words-for-character-traits` … `words-of-the-solar-system`) | `context-clues` | 0.1 | Every item reads the word in a sentence |
| `multiple-meaning-words` | `context-clues` | 0.3 | Choosing the meaning is using context |
| `plural-nouns` | `nouns-and-pronouns` | 0.1 | Only knowing what a noun is carries over |
| `order-of-adjectives` | `adjectives-and-adverbs` | 0.2 | Every item uses adjectives, but their order is the point |
| `progressive-verb-tenses` | `simple-verb-tenses`, `subject-verb-agreement` | 0.2 each | Forming them chooses *am/is/are* to agree with the subject |
| `perfect-verb-tenses` | `simple-verb-tenses` | 0.2 | Past participles of irregular verbs repeat the past forms |
| `perfect-verb-tenses` | `progressive-verb-tenses` | 0.1 | Only choosing a tense for a time carries over |
| `correlative-conjunctions` | `coordinating-conjunctions` | 0.2 | The pairs join words like conjunctions do |
| `correlative-conjunctions` | `subject-verb-agreement` | 0.3 | One knowledge point is agreement after *either … or* |
| `capitalizing-names-and-titles` | `capitals-and-end-punctuation` | 0.3 | Every item capitalizes, now beyond the first word |
| `writing-a-narrative-paragraph` | `punctuating-dialogue`, `verb-tense-consistency`, `choosing-transitions` | 0.2 each | A story uses dialogue, keeps one tense and orders events |
| `writing-a-summary` | `supporting-details` | 0.3 | A summary keeps only the important details |
| `writing-a-summary` | `main-idea` | 0.2 | It begins with the main idea |
| `writing-a-compare-and-contrast-paragraph` | `compare-and-contrast-in-texts`, `writing-a-paragraph` | 0.3 each | It writes the structure it read, in a whole paragraph |
| `writing-a-cause-and-effect-paragraph` | `cause-and-effect-in-texts`, `writing-a-paragraph` | 0.3 each | It writes the structure it read, in a whole paragraph |
| `writing-a-descriptive-paragraph` | `similes-and-metaphors`, `adjectives-and-adverbs`, `writing-a-paragraph` | 0.2 each | Description uses figures and precise modifiers in a paragraph |
