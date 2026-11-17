# Sources of Chinese Content

Every sentence, passage, question and explanation in this package is written for it. Classical poems and passages are in the public domain; their meanings, notes and questions are written here. Records below say where lists and texts came from, so that their status can be checked before a release ([docs/chinese-curriculum.md §13](../../docs/chinese-curriculum.md#13-sources-of-content-and-rights)).

| Material | Source | Status | Used for |
| :--- | :--- | :--- | :--- |
| The 3,500 common characters and their two tables | Appendix 5 of the *Compulsory Education Chinese Curriculum Standard (2022)*, Ministry of Education | Awaiting counsel (C0.2 of the development plan) | `src/characters/common.ts`, the recognition batches |
| Words of the recognition batches, their readings and the words of the word batches | Written for this package from general knowledge of Mandarin; readings by the *Table of General Standard Chinese Characters* and GB/T 16159-2012 | Not applicable | `src/characters`, `src/words` |
| Idioms | Common idioms of primary school, chosen by hand; meanings and sentences written here | Idioms themselves are not protected; awaiting the teacher's review | `src/idioms` |
| Punctuation, faulty sentences, connectives, sentence forms and rhetoric | Rules of GB/T 15834-2011 and the kinds of faulty sentence, connective, sentence change and rhetorical device in general use; every sentence written here, apart from the classical couplets of `rhetoric-2` | Not applicable; the couplets are public domain | `src/grammar` |
| Recited poems | Classical poems of the Tang, Song and Qing dynasties, in their usual modern editions | Public domain | `src/recitation` |
| Classical passages and the sentences of the classical drills | Pre-Qin to Song texts (韩非子, 孟子, 列子, 论语, 世说新语, 晋书, 方舆胜览 and a few lines of others) in their usual modern editions; meanings, translations and wrong answers written here | Public domain | `src/classical` |
| Passages of the reading units | Written for this package from general knowledge; none follows a textbook lesson | Not applicable | `src/reading` |
| Grade lists of the 2022 standard (appendix 3, the recommended texts of appendix 1) | Read to choose what each grade covers; not copied as data | Awaiting counsel | Course scope |
| `cn-math-taxonomy` | Read for orientation only | CC BY-NC 4.0, so nothing is taken | — |
| CC-CEDICT | Not used: CC BY-SA would make glosses share-alike | — | — |

Add a row before importing any list. Lists with a non-commercial license, or with none, stay out. Textbook texts and exercises are never copied.
