// The characters and words each HSK course draws on (docs/chinese-curriculum.md §8.5): the batches of the levels it
// tests, read again from their data, since the levels keep only their topics.

import { characterBatches as c1 } from "../level-1/character-data.ts";
import type { LevelOneCharacter } from "../level-1/characters.ts";
import { parseLevelCharacters } from "../level-1/characters.ts";
import { wordBatches as w1 } from "../level-1/word-data.ts";
import { type LevelOneWord, parseLevelWords } from "../level-1/words.ts";
import { characterBatches as c2 } from "../level-2/character-data.ts";
import { wordBatches as w2 } from "../level-2/word-data.ts";
import { characterBatches as c3 } from "../level-3/character-data.ts";
import { wordBatches as w3 } from "../level-3/word-data.ts";
import { characterBatches as c4 } from "../level-4/character-data.ts";
import { wordBatchesA as w4a } from "../level-4/word-data-a.ts";
import { wordBatchesB as w4b } from "../level-4/word-data-b.ts";
import { characterBatchesA as c5a } from "../level-5/character-data-a.ts";
import { characterBatchesB as c5b } from "../level-5/character-data-b.ts";
import { wordBatchesA as w5a } from "../level-5/word-data-a.ts";
import { wordBatchesB as w5b } from "../level-5/word-data-b.ts";
import { characterBatchesA as c6a } from "../level-6/character-data-a.ts";
import { characterBatchesB as c6b } from "../level-6/character-data-b.ts";
import { wordBatchesA as w6a } from "../level-6/word-data-a.ts";
import { wordBatchesB as w6b } from "../level-6/word-data-b.ts";
import * as l7a from "../level-7/data-1.ts";
import * as l7b from "../level-7/data-2.ts";
import * as l7c from "../level-7/data-3.ts";
import * as l7d from "../level-7/data-4.ts";
import * as l8a from "../level-8/data-1.ts";
import * as l8b from "../level-8/data-2.ts";
import * as l8c from "../level-8/data-3.ts";
import * as l8d from "../level-8/data-4.ts";
import * as l9a from "../level-9/data-1.ts";
import * as l9b from "../level-9/data-2.ts";
import * as l9c from "../level-9/data-3.ts";
import * as l9d from "../level-9/data-4.ts";

/** LevelData are the character and word batches of one level. */
export interface LevelData {
  readonly level: number;
  readonly characters: readonly (readonly LevelOneCharacter[])[];
  readonly words: readonly (readonly LevelOneWord[])[];
}

type Quarter = {
  readonly [k: string]: readonly string[] | readonly { readonly theme: readonly [string, string]; readonly data: string }[];
};

/** quarters joins the four data files of a level of 7 to 9. */
function quarters(
  files: readonly Quarter[],
): readonly [readonly string[], readonly { readonly theme: readonly [string, string]; readonly data: string }[]] {
  const chars: string[] = [];
  const words: { readonly theme: readonly [string, string]; readonly data: string }[] = [];
  for (const [i, f] of files.entries()) {
    chars.push(...(f[`characterBatches${i + 1}`] as readonly string[]));
    words.push(...(f[`wordBatches${i + 1}`] as readonly { readonly theme: readonly [string, string]; readonly data: string }[]));
  }
  return [chars, words];
}

const RAW: readonly (readonly [readonly string[], readonly { readonly data: string }[]])[] = [
  [c1, w1],
  [c2, w2],
  [c3, w3],
  [c4, [...w4a, ...w4b]],
  [
    [...c5a, ...c5b],
    [...w5a, ...w5b],
  ],
  [
    [...c6a, ...c6b],
    [...w6a, ...w6b],
  ],
  quarters([l7a, l7b, l7c, l7d]),
  quarters([l8a, l8b, l8c, l8d]),
  quarters([l9a, l9b, l9c, l9d]),
];

/** levelData are the batches of levels 1 to 9, in order. */
export const levelData: readonly LevelData[] = RAW.map(([chars, words], i) => ({
  level: i + 1,
  characters: chars.map((b) => parseLevelCharacters(b, i + 1)),
  words: words.map((b) => parseLevelWords(b.data, i + 1)),
}));
