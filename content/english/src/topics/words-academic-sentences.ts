// Sentences for the academic word batches: three for each word, each with two words of its batch that do not fit.

import type { ChoiceItem } from "@ga/subject-english";

/** AcademicSentence is a sentence with a gap, written ___, and two words of the batch that do not complete it. */
export type AcademicSentence = readonly [sentence: string, notThis: string, norThis: string];

/** AcademicSentences gives three sentences for every word of a batch. */
export type AcademicSentences = Readonly<Record<string, readonly [AcademicSentence, AcademicSentence, AcademicSentence]>>;

/** academicSentenceBanks builds, from a batch's meanings and its sentences, items that ask what the word in bold means in a sentence and items that ask which word fills the gap; items go word by word within each round, so consecutive seeds never show the same word. */
export function academicSentenceBanks(
  meanings: readonly ChoiceItem[],
  sentences: AcademicSentences,
): { readonly meaning: readonly ChoiceItem[]; readonly use: readonly ChoiceItem[] } {
  const meaningOf = new Map(meanings.map(([word, meaning]) => [word, meaning] as const));
  const look = (word: string): string => {
    const found = meaningOf.get(word);
    if (found === undefined) throw new Error(`${word} is not in the batch`);
    return found;
  };
  const rounds = [0, 1, 2] as const;
  const each = (round: 0 | 1 | 2) =>
    meanings.map(([word]) => {
      const three = sentences[word];
      if (three === undefined) throw new Error(`no sentences for ${word}`);
      const [sentence, a, b] = three[round];
      if (!sentence.includes("___")) throw new Error(`a sentence of ${word} has no gap`);
      return { word, sentence, others: [a, b] as const };
    });
  return {
    meaning: rounds.flatMap((r) =>
      each(r).map(({ word, sentence, others }): ChoiceItem => [sentence.replace("___", `**${word}**`), look(word), others.map(look)]),
    ),
    use: rounds.flatMap((r) => each(r).map(({ word, sentence, others }): ChoiceItem => [sentence, word, [...others]])),
  };
}

/** academicSentences1 are the sentences of the first batch. */
export const academicSentences1: AcademicSentences = {
  analyze: [
    ["Before you answer, ___ the graph to see what each line shows.", "conclude", "source"],
    ["The coach watched the video to ___ every play of the game.", "predict", "sequence"],
    ["Doctors ___ a drop of blood to find out what is making a patient sick.", "estimate", "compare"],
  ],
  evidence: [
    ["The broken window was ___ that someone had climbed in.", "sequence", "estimate"],
    ["Do you have any ___ for your claim, or is it only a guess?", "sequence", "significant"],
    ["The shells on the hilltop are ___ that the sea once covered this land.", "source", "estimate"],
  ],
  significant: [
    ["Winning the science fair was a ___ moment in her life.", "sequence", "source"],
    ["The new bridge made a ___ difference: the trip now takes ten minutes instead of an hour.", "sequence", "source"],
    ["A drop of one degree is small, but a drop of twenty degrees is ___.", "estimate", "sequence"],
  ],
  predict: [
    ["The dark clouds made us ___ rain before lunch.", "compare", "analyze"],
    ["From the title alone, can you ___ how the story will end?", "compare", "sequence"],
    ["Weather scientists use computers to ___ where the storm will go next.", "compare", "source"],
  ],
  compare: [
    ["If you ___ the two maps, you will see how much the coast has changed.", "predict", "conclude"],
    ["Smart shoppers ___ prices at several stores before they buy.", "conclude", "sequence"],
    ["In your essay, ___ life in a city with life on a farm.", "predict", "conclude"],
  ],
  sequence: [
    ["Number the pictures to show the ___ of the story's events.", "evidence", "source"],
    ["Getting dressed has a ___: socks go on before shoes.", "source", "evidence"],
    ["If you mix up the ___ of the steps, the cake will not rise.", "evidence", "estimate"],
  ],
  conclude: [
    ["After three tests failed, the team had to ___ that the plan would not work.", "compare", "analyze"],
    ["From the wet streets, we can ___ that it rained last night.", "predict", "compare"],
    ["Read all the facts before you ___ who broke the vase.", "estimate", "sequence"],
  ],
  relevant: [
    ["Your answer is good, but the part about your cat is not ___ to the question.", "source", "sequence"],
    ["Only include facts that are ___ to your topic.", "evidence", "source"],
    ["The weather report is ___ when you are planning a picnic.", "source", "sequence"],
  ],
  estimate: [
    ["Without counting, ___ how many beans are in the jar.", "analyze", "conclude"],
    ["The builder had to ___ the cost before the work began.", "conclude", "sequence"],
    ["Look at the line and ___ its length to the nearest inch.", "conclude", "predict"],
  ],
  source: [
    ["The ___ of the river is a small spring high in the hills.", "sequence", "evidence"],
    ["A good report names the ___ of every fact it uses.", "sequence", "estimate"],
    ["Sunlight is the main ___ of energy for plants.", "sequence", "evidence"],
  ],
};

/** academicSentences2 are the sentences of the second batch. */
export const academicSentences2: AcademicSentences = {
  identify: [
    ["Can you ___ the country on this map from its shape?", "summarize", "support"],
    ["The guide helped us ___ each bird by its song.", "summarize", "explain"],
    ["Witnesses were asked to ___ the person they had seen.", "summarize", "process"],
  ],
  summarize: [
    ["In one sentence, ___ what the chapter is about.", "support", "region"],
    ["At the end of the meeting, the leader will ___ what was decided.", "cause", "structure"],
    ["Do not retell every detail; just ___ the main points.", "support", "process"],
  ],
  explain: [
    ["Can you ___ why the sky looks blue?", "identify", "region"],
    ["The teacher drew a picture to ___ how the heart pumps blood.", "identify", "support"],
    ["Please ___ the reason for your choice.", "structure", "region"],
  ],
  support: [
    ["Find two facts in the article that ___ your answer.", "identify", "summarize"],
    ["Her test results ___ the idea that plants grow faster with more light.", "summarize", "identify"],
    ["A strong essay gives reasons to ___ each claim.", "identify", "region"],
  ],
  cause: [
    ["A loose wire was the ___ of the fire.", "effect", "purpose"],
    ["Doctors are still looking for the ___ of the illness.", "purpose", "region"],
    ["Too much sun was the ___ of her sunburn.", "effect", "process"],
  ],
  effect: [
    ["One ___ of the long rain was that the river flooded the fields.", "cause", "purpose"],
    ["Exercise has a good ___ on your heart.", "cause", "region"],
    ["The ___ of the new rule was that fewer students came late.", "cause", "structure"],
  ],
  structure: [
    ["The ___ of a spider's web is both light and strong.", "region", "purpose"],
    ["Each chapter has the same ___: a story, then questions, then a quiz.", "region", "cause"],
    ["Steel beams give the tall building a strong ___.", "process", "purpose"],
  ],
  process: [
    ["Turning milk into cheese is a slow ___.", "region", "structure"],
    ["Learning to read is a ___ that takes years.", "region", "purpose"],
    ["Write down every step of the ___ so that another class can repeat it.", "region", "effect"],
  ],
  region: [
    ["Rice grows well in this wet, warm ___ of the country.", "process", "purpose"],
    ["Polar bears live in the Arctic ___.", "process", "structure"],
    ["Each ___ of the map is shaded a different color.", "process", "cause"],
  ],
  purpose: [
    ["The ___ of a seat belt is to keep you safe in a crash.", "region", "process"],
    ["What was the author's ___ in writing this letter?", "region", "structure"],
    ["The ___ of the fence is to keep the goats in the field.", "region", "process"],
  ],
};

/** academicSentences3 are the sentences of the third batch. */
export const academicSentences3: AcademicSentences = {
  infer: [
    ["From the empty plate and the happy dog, we can ___ who ate the cake.", "require", "occur"],
    ["The story never says she is scared, but you can ___ it from her shaking hands.", "illustrate", "require"],
    ["Use the clues in the poem to ___ what season it is.", "occur", "contrast"],
  ],
  interpret: [
    ["Different readers may ___ the poem in different ways.", "require", "occur"],
    ["Can you ___ what this graph is telling us?", "occur", "survey"],
    ["The key helps you ___ the symbols on a map.", "occur", "require"],
  ],
  illustrate: [
    ["The author told a story about her grandmother to ___ her point.", "require", "occur"],
    ["Draw a picture to ___ how the water cycle works.", "infer", "occur"],
    ["These old photos ___ how much the town has grown.", "require", "infer"],
  ],
  method: [
    ["Her ___ for learning new words is to use each one three times.", "factor", "data"],
    ["Which ___ did the scientists use to count the birds?", "factor", "contrast"],
    ["Boiling is one ___ of making water safe to drink.", "survey", "data"],
  ],
  factor: [
    ["Cost was the main ___ in choosing which bike to buy.", "method", "survey"],
    ["Sleep is one ___ that affects how well you learn.", "method", "data"],
    ["Weather is a ___ in how fast the crops grow.", "method", "survey"],
  ],
  contrast: [
    ["The poem will ___ the noisy city with the quiet woods.", "occur", "require"],
    ["The bright colors ___ sharply with the dark background.", "occur", "infer"],
    ["Write a paragraph to ___ the ways the two characters behave.", "occur", "require"],
  ],
  survey: [
    ["The town did a ___ to learn what new shops people wanted.", "factor", "method"],
    ["Fifty students answered the ___ about school lunches.", "factor", "data"],
    ["The ___ asked each family how many pets it had.", "data", "factor"],
  ],
  data: [
    ["The weather station sends ___ about wind and rain every hour.", "survey", "factor"],
    ["Put the ___ from your experiment in a table.", "method", "factor"],
    ["Without enough ___, the scientists could not tell whether the plan worked.", "method", "survey"],
  ],
  occur: [
    ["Most floods here ___ in the spring, when the snow melts.", "require", "infer"],
    ["Eclipses of the sun do not ___ very often.", "require", "interpret"],
    ["Mistakes ___ more often when people rush.", "require", "interpret"],
  ],
  require: [
    ["Fish ___ clean water to stay healthy.", "occur", "infer"],
    ["This job will ___ a lot of patience.", "occur", "contrast"],
    ["The rules ___ every player to wear a helmet.", "occur", "infer"],
  ],
};
