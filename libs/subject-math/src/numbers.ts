/** isPrime tells whether n is a prime number. */
export function isPrime(n: number): boolean {
  if (!Number.isInteger(n) || n < 2) return false;
  for (let p = 2; p * p <= n; p++) if (n % p === 0) return false;
  return true;
}

/** primeFactors gives the prime factorization of n ≥ 2 as [prime, exponent] pairs in increasing order. */
export function primeFactors(n: number): [number, number][] {
  if (!Number.isInteger(n) || n < 2) throw new RangeError(`no prime factorization: ${n}`);
  const out: [number, number][] = [];
  let m = n;
  for (let p = 2; p * p <= m; p++) {
    let e = 0;
    while (m % p === 0) {
      m /= p;
      e++;
    }
    if (e > 0) out.push([p, e]);
  }
  if (m > 1) out.push([m, 1]);
  return out;
}

/** factorizationLatex writes a prime factorization: "2^{3} \cdot 3". */
export function factorizationLatex(factors: readonly (readonly [number, number])[]): string {
  return factors.map(([p, e]) => (e === 1 ? String(p) : `${p}^{${e}}`)).join(" \\cdot ");
}

/** gcd is the greatest common divisor of two integers, not both zero. */
export function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) [x, y] = [y, x % y];
  return x;
}

/** lcm is the least common multiple of two positive integers. */
export function lcm(a: number, b: number): number {
  return (a / gcd(a, b)) * b;
}
