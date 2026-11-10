/** Price is what a vendor charges for a model, in US dollars per million tokens. */
export interface Price {
  readonly inputPerMillion: number;
  readonly outputPerMillion: number;
}

/** callCost is what a call cost at a price, in US dollars. */
export function callCost(tokens: { readonly input: number; readonly output: number }, price: Price): number {
  return (tokens.input * price.inputPerMillion + tokens.output * price.outputPerMillion) / 1_000_000;
}
