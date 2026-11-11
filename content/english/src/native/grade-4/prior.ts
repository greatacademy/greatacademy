// Grade 4: prerequisites as the outline names them.

/** after lists a topic's prerequisites as the outline names them, each once. */
export const after = (...ids: readonly string[]): string[] => [...new Set(ids)];
