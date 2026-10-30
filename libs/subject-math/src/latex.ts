import { Q } from "./rational.ts";

/**
 * Node is the syntax tree of a mathematical expression. It keeps the form the
 * learner wrote (explicit parentheses, \frac versus division, decimals), so
 * that checkers can judge form as well as value.
 */
export type Node =
  | { readonly k: "num"; readonly v: Q; readonly decimal: boolean }
  | { readonly k: "var"; readonly name: string }
  | { readonly k: "neg"; readonly a: Node }
  | { readonly k: "pos"; readonly a: Node }
  | { readonly k: "add"; readonly a: Node; readonly b: Node }
  | { readonly k: "sub"; readonly a: Node; readonly b: Node }
  | { readonly k: "mul"; readonly a: Node; readonly b: Node; readonly implicit: boolean }
  | { readonly k: "div"; readonly a: Node; readonly b: Node; readonly frac: boolean }
  | { readonly k: "pow"; readonly a: Node; readonly b: Node }
  | { readonly k: "sqrt"; readonly a: Node }
  /** root is an nth root with n ≥ 3, written \sqrt[n]{a}. */
  | { readonly k: "root"; readonly n: number; readonly a: Node }
  /** abs is an absolute value, written |a|. */
  | { readonly k: "abs"; readonly a: Node }
  | { readonly k: "group"; readonly a: Node };

/** RelOp is a relation symbol. */
export type RelOp = "=" | "<" | ">" | "<=" | ">=";

/** Relation is a parsed equation or inequality. */
export interface Relation {
  readonly left: Node;
  readonly op: RelOp;
  readonly right: Node;
}

/** ParseError reports input outside the supported LaTeX subset. */
export class ParseError extends Error {}

type Tok =
  | { t: "num"; s: string }
  | { t: "var"; s: string }
  | { t: "op"; s: "+" | "-" | "*" | "/" | "^" | "(" | ")" | "{" | "}" | "|" | "[" | "]" | "rel" }
  | { t: "cmd"; s: string };

const ignored = new Set(["\\,", "\\;", "\\:", "\\!", "\\ ", "\\quad", "\\qquad", "\\left", "\\right", "\\displaystyle"]);
const relCommands: Record<string, RelOp> = { "\\le": "<=", "\\leq": "<=", "\\ge": ">=", "\\geq": ">=", "\\lt": "<", "\\gt": ">" };
const mulCommands = new Set(["\\cdot", "\\times", "\\ast"]);
const fracCommands = new Set(["\\frac", "\\dfrac", "\\tfrac"]);

/** normalizeLatex maps Unicode symbols and spacing to the LaTeX the parser reads. */
export function normalizeLatex(s: string): string {
  return s
    .normalize("NFKC")
    .replace(/−/g, "-")
    .replace(/[×⋅·]/g, "\\cdot ")
    .replace(/÷/g, "/")
    .replace(/≤/g, "\\le ")
    .replace(/≥/g, "\\ge ")
    .replace(/(\d)\{,\}(?=\d{3})/g, "$1")
    .replace(/\\mathrm\{([^{}]*)\}/g, "$1")
    .trim();
}

function tokenize(input: string): (Tok & { rel?: RelOp })[] {
  const s = normalizeLatex(input);
  const out: (Tok & { rel?: RelOp })[] = [];
  let i = 0;
  while (i < s.length) {
    const c = s[i]!;
    if (/\s|~/.test(c)) {
      i++;
    } else if (/[0-9.]/.test(c)) {
      const m = /^\d*(?:\.\d+)?/.exec(s.slice(i))![0];
      if (m === "" || m === ".") throw new ParseError(`unexpected "${c}"`);
      out.push({ t: "num", s: m });
      i += m.length;
    } else if (/[a-zA-Z]/.test(c)) {
      out.push({ t: "var", s: c });
      i++;
    } else if (c === "\\") {
      const m = /^\\(?:[a-zA-Z]+|.)/.exec(s.slice(i))![0];
      i += m.length;
      if (ignored.has(m)) continue;
      if (m === "\\{" || m === "\\}") throw new ParseError("braces are not supported");
      if (relCommands[m]) out.push({ t: "op", s: "rel", rel: relCommands[m] });
      else if (mulCommands.has(m)) out.push({ t: "op", s: "*" });
      else if (m === "\\div") out.push({ t: "op", s: "/" });
      else if (m === "\\lbrack") out.push({ t: "op", s: "(" });
      else if (m === "\\rbrack") out.push({ t: "op", s: ")" });
      else if (m === "\\vert" || m === "\\lvert" || m === "\\rvert" || m === "\\|") out.push({ t: "op", s: "|" });
      else out.push({ t: "cmd", s: m });
    } else if (c === "<" || c === ">") {
      const eq = s[i + 1] === "=";
      out.push({ t: "op", s: "rel", rel: (eq ? `${c}=` : c) as RelOp });
      i += eq ? 2 : 1;
    } else if (c === "=") {
      out.push({ t: "op", s: "rel", rel: "=" });
      i++;
    } else if (c === "[") {
      // A bracket right after \sqrt holds the index of a root; elsewhere it is a parenthesis.
      out.push({ t: "op", s: out[out.length - 1]?.s === "\\sqrt" ? "[" : "(" });
      i++;
    } else if (c === "]") {
      out.push({ t: "op", s: closedIndex(out) ? ")" : "]" });
      i++;
    } else if ("+-*/^(){}|".includes(c)) {
      out.push({ t: "op", s: c as "+" });
      i++;
    } else {
      throw new ParseError(`unexpected "${c}"`);
    }
  }
  return out;
}

/** closedIndex tells whether every root index opened in toks is already closed. */
function closedIndex(toks: readonly Tok[]): boolean {
  for (let j = toks.length - 1; j >= 0; j--) {
    if (toks[j]!.s === "]") return true;
    if (toks[j]!.s === "[") return false;
  }
  return true;
}

class Parser {
  private i = 0;
  /** absDepth counts the absolute value bars currently open, so that a bar inside one closes it rather than starting a product. */
  private absDepth = 0;
  private readonly toks: (Tok & { rel?: RelOp })[];

  constructor(toks: (Tok & { rel?: RelOp })[]) {
    this.toks = toks;
  }

  private peek() {
    return this.toks[this.i];
  }
  private isOp(s: string) {
    const tok = this.peek();
    return tok?.t === "op" && tok.s === s;
  }
  private expectOp(s: string) {
    if (!this.isOp(s)) throw new ParseError(`expected "${s}"`);
    this.i++;
  }

  parseTop(): Node | Relation {
    const left = this.expr();
    const tok = this.peek();
    let result: Node | Relation = left;
    if (tok?.t === "op" && tok.s === "rel") {
      this.i++;
      result = { left, op: tok.rel!, right: this.expr() };
    }
    if (this.i < this.toks.length) throw new ParseError("unexpected input after the expression");
    return result;
  }

  private expr(): Node {
    let node = this.term();
    while (this.isOp("+") || this.isOp("-")) {
      const op = (this.toks[this.i++] as { s: string }).s;
      const b = this.term();
      node = op === "+" ? { k: "add", a: node, b } : { k: "sub", a: node, b };
    }
    return node;
  }

  private term(): Node {
    let node = this.unary();
    for (;;) {
      if (this.isOp("*") || this.isOp("/")) {
        const op = (this.toks[this.i++] as { s: string }).s;
        const b = this.unary();
        node = op === "*" ? { k: "mul", a: node, b, implicit: false } : { k: "div", a: node, b, frac: false };
      } else if (this.startsPrimary()) {
        if (node.k === "num" && this.peek()?.t === "num") throw new ParseError("two numbers in a row");
        node = { k: "mul", a: node, b: this.power(), implicit: true };
      } else {
        return node;
      }
    }
  }

  private startsPrimary(): boolean {
    const tok = this.peek();
    if (!tok) return false;
    if (tok.t === "num" || tok.t === "var") return true;
    if (tok.t === "op") return tok.s === "(" || tok.s === "{" || (tok.s === "|" && this.absDepth === 0);
    return fracCommands.has(tok.s) || tok.s === "\\sqrt" || tok.s === "\\pi";
  }

  private unary(): Node {
    if (this.isOp("-")) {
      this.i++;
      return { k: "neg", a: this.unary() };
    }
    if (this.isOp("+")) {
      this.i++;
      return { k: "pos", a: this.unary() };
    }
    return this.power();
  }

  private power(): Node {
    const base = this.primary();
    if (!this.isOp("^")) return base;
    this.i++;
    let exponent: Node;
    if (this.isOp("{")) exponent = this.braced();
    else if (this.isOp("-")) {
      this.i++;
      exponent = { k: "neg", a: this.single() };
    } else exponent = this.single();
    return { k: "pow", a: base, b: exponent };
  }

  /** single reads one digit or letter, as in x^2 written without braces. */
  private single(): Node {
    const tok = this.peek();
    if (tok?.t === "num") {
      this.i++;
      if (tok.s.length > 1) {
        // x^23 means x^2 · 3 in TeX; reject rather than guess.
        throw new ParseError("put multi-digit exponents in braces");
      }
      return { k: "num", v: Q.parse(tok.s), decimal: false };
    }
    if (tok?.t === "var") {
      this.i++;
      return { k: "var", name: tok.s };
    }
    throw new ParseError("expected an exponent");
  }

  private braced(): Node {
    this.expectOp("{");
    const node = this.expr();
    this.expectOp("}");
    return node;
  }

  private primary(): Node {
    const tok = this.peek();
    if (!tok) throw new ParseError("unexpected end of input");
    if (tok.t === "num") {
      this.i++;
      return { k: "num", v: Q.parse(tok.s), decimal: tok.s.includes(".") };
    }
    if (tok.t === "var") {
      this.i++;
      return { k: "var", name: tok.s };
    }
    if (tok.t === "op") {
      if (tok.s === "(") {
        this.i++;
        const a = this.expr();
        this.expectOp(")");
        return { k: "group", a };
      }
      if (tok.s === "{") {
        const a = this.braced();
        return a;
      }
      if (tok.s === "|") {
        this.i++;
        this.absDepth++;
        const a = this.expr();
        this.absDepth--;
        this.expectOp("|");
        return { k: "abs", a };
      }
      throw new ParseError(`unexpected "${tok.s === "rel" ? tok.rel : tok.s}"`);
    }
    if (fracCommands.has(tok.s)) {
      this.i++;
      const a = this.braced();
      const b = this.braced();
      return { k: "div", a, b, frac: true };
    }
    if (tok.s === "\\sqrt") {
      this.i++;
      if (!this.isOp("[")) return { k: "sqrt", a: this.braced() };
      this.i++;
      const index = this.peek();
      if (index?.t !== "num" || !/^\d+$/.test(index.s) || Number(index.s) < 2)
        throw new ParseError("the index of a root must be an integer of at least 2");
      this.i++;
      this.expectOp("]");
      const n = Number(index.s);
      const a = this.braced();
      return n === 2 ? { k: "sqrt", a } : { k: "root", n, a };
    }
    if (tok.s === "\\pi") {
      this.i++;
      return { k: "var", name: "\\pi" };
    }
    throw new ParseError(`unsupported command ${tok.s}`);
  }
}

/** parseLatex parses an expression, equation or inequality. */
export function parseLatex(input: string): Node | Relation {
  const toks = tokenize(input);
  if (toks.length === 0) throw new ParseError("empty answer");
  return new Parser(toks).parseTop();
}

/** isRelation tells a Relation from a Node. */
export function isRelation(x: Node | Relation): x is Relation {
  return "op" in x;
}

/** parseExpression parses an expression and rejects relations. */
export function parseExpression(input: string): Node {
  const r = parseLatex(input);
  if (isRelation(r)) throw new ParseError("expected an expression, not a relation");
  return r;
}

/** unwrap removes redundant grouping: braces never create nodes, explicit parentheses do. */
export function unwrap(node: Node): Node {
  return node.k === "group" ? unwrap(node.a) : node;
}
