/** Q is an exact rational number with bigint numerator and denominator, always in lowest terms with a positive denominator. */
export class Q {
  readonly n: bigint;
  readonly d: bigint;

  private constructor(n: bigint, d: bigint) {
    this.n = n;
    this.d = d;
  }

  /** Q.of builds n/d in lowest terms. */
  static of(n: bigint | number, d: bigint | number = 1n): Q {
    let nn = BigInt(n);
    let dd = BigInt(d);
    if (dd === 0n) throw new RangeError("division by zero");
    if (dd < 0n) {
      nn = -nn;
      dd = -dd;
    }
    const g = gcd(nn < 0n ? -nn : nn, dd);
    return new Q(nn / g, dd / g);
  }

  /** Q.parse reads an integer ("-3"), a fraction ("3/4") or a decimal ("-2.25"). */
  static parse(s: string): Q {
    const m = /^([+-]?)(\d*)(?:\.(\d+))?(?:\/(\d+))?$/.exec(s.trim());
    if (!m || (m[2] === "" && m[3] === undefined)) throw new SyntaxError(`not a rational: ${s}`);
    const [, sign, int, frac = "", den] = m;
    let n = BigInt((int || "0") + frac);
    let d = 10n ** BigInt(frac.length);
    if (den !== undefined) d *= BigInt(den);
    if (sign === "-") n = -n;
    return Q.of(n, d);
  }

  static readonly zero = Q.of(0);
  static readonly one = Q.of(1);

  add(o: Q): Q {
    return Q.of(this.n * o.d + o.n * this.d, this.d * o.d);
  }
  sub(o: Q): Q {
    return Q.of(this.n * o.d - o.n * this.d, this.d * o.d);
  }
  mul(o: Q): Q {
    return Q.of(this.n * o.n, this.d * o.d);
  }
  div(o: Q): Q {
    return Q.of(this.n * o.d, this.d * o.n);
  }
  neg(): Q {
    return new Q(-this.n, this.d);
  }
  abs(): Q {
    return this.n < 0n ? this.neg() : this;
  }
  /** pow raises to an integer power. */
  pow(e: number): Q {
    if (!Number.isInteger(e)) throw new RangeError("non-integer exponent");
    if (e < 0) return Q.one.div(this).pow(-e);
    return Q.of(this.n ** BigInt(e), this.d ** BigInt(e));
  }
  cmp(o: Q): number {
    const l = this.n * o.d;
    const r = o.n * this.d;
    return l < r ? -1 : l > r ? 1 : 0;
  }
  eq(o: Q): boolean {
    return this.n === o.n && this.d === o.d;
  }
  isZero(): boolean {
    return this.n === 0n;
  }
  isInteger(): boolean {
    return this.d === 1n;
  }
  sign(): -1 | 0 | 1 {
    return this.n < 0n ? -1 : this.n > 0n ? 1 : 0;
  }
  toNumber(): number {
    return Number(this.n) / Number(this.d);
  }
  /** toString gives "n" or "n/d", the form Q.parse reads. */
  toString(): string {
    return this.d === 1n ? String(this.n) : `${this.n}/${this.d}`;
  }
  /** toLatex gives "n" or "\frac{n}{d}" with the sign in front. */
  toLatex(): string {
    if (this.d === 1n) return String(this.n);
    const sign = this.n < 0n ? "-" : "";
    return `${sign}\\frac{${this.n < 0n ? -this.n : this.n}}{${this.d}}`;
  }
}

function gcd(a: bigint, b: bigint): bigint {
  while (b !== 0n) [a, b] = [b, a % b];
  return a === 0n ? 1n : a;
}

/** q is shorthand for Q.of. */
export const q = (n: bigint | number, d: bigint | number = 1n): Q => Q.of(n, d);
