# English Content Progress

The first slice is written: the 41 topics of `english-grammar-writing`, reviewed by no outside reader yet. Eight more topics of usage, mechanics and academic words follow it, so the course has 49. Its reading units of grades 3 to 5 are `water-on-earth`, `how-plants-live`, `life-on-the-nile`, `weather-and-climate`, `the-human-body` and `our-changing-earth`, 10 passages each, in `src/reading`; their words are in `src/reading/lexicon.ts`. The second course, `english-reading-comprehension`, has 15 topics of reading skills in `src/topics/reading-informational.ts` and `src/topics/reading-thinking.ts`, reviewed by no outside reader yet. The third, `english-literature-argument`, has 9 topics of literature and argument for grades 6 to 8 in `src/topics/literature.ts` and `src/topics/argument.ts`. See [docs/english-development-plan.md](../../docs/english-development-plan.md).

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
