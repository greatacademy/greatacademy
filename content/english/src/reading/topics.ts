// The topics that the reading units practice, with the weights a passage gives them.

/** clues is the share of using context clues that reading a passage practices. */
export const clues = { topic: "context-clues", weight: 0.3 } as const;

/** cluesAcademic is the share of the first academic words that a passage using some of them practices. */
export const cluesAcademic = { topic: "academic-words-1", weight: 0.2 } as const;
/** academic2 is the share of the second academic words that a passage using some of them practices. */
export const academic2 = { topic: "academic-words-2", weight: 0.2 } as const;
