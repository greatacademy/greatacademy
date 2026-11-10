/** usd writes a sum of US dollars, with four decimals for sums under a dollar so that small costs show. */
export function usd(n: number): string {
  return `$${n.toFixed(n !== 0 && Math.abs(n) < 1 ? 4 : 2)}`;
}
