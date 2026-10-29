import type { MathfieldElement } from "mathlive";
import { useEffect, useRef, useState } from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "math-field": React.DetailedHTMLProps<React.HTMLAttributes<MathfieldElement>, MathfieldElement> & {
        "math-virtual-keyboard-policy"?: string;
        "smart-fence"?: string;
      };
    }
  }
}

let loading: Promise<unknown> | undefined;

/**
 * loadMathLive registers <math-field> in the browser, once. MathLive's own
 * fonts and sounds are off: KaTeX's stylesheet already provides the fonts.
 */
function loadMathLive() {
  loading ??= import("mathlive").then(({ MathfieldElement }) => {
    MathfieldElement.fontsDirectory = null;
    MathfieldElement.soundsDirectory = null;
  });
  return loading;
}

/**
 * MathField is a math input that produces LaTeX, the response format of
 * math problems (docs/content.md §4). Enter submits.
 */
export function MathField({
  value,
  onChange,
  onSubmit,
  disabled,
  label,
  autoFocus,
}: {
  value: string;
  onChange(latex: string): void;
  onSubmit(): void;
  disabled?: boolean;
  label: string;
  autoFocus?: boolean;
}) {
  const ref = useRef<MathfieldElement>(null);
  const [ready, setReady] = useState(false);
  const handlers = useRef({ onChange, onSubmit });
  handlers.current = { onChange, onSubmit };

  useEffect(() => {
    let live = true;
    void loadMathLive().then(() => live && setReady(true));
    return () => {
      live = false;
    };
  }, []);

  useEffect(() => {
    const mf = ref.current;
    if (!ready || !mf) return;
    mf.menuItems = [];
    mf.inlineShortcuts = { ...mf.inlineShortcuts, ">=": "\\ge", "<=": "\\le" };
    const onInput = () => handlers.current.onChange(mf.value);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handlers.current.onSubmit();
      }
    };
    mf.addEventListener("input", onInput);
    mf.addEventListener("keydown", onKey, { capture: true });
    if (autoFocus) mf.focus();
    return () => {
      mf.removeEventListener("input", onInput);
      mf.removeEventListener("keydown", onKey, { capture: true });
    };
  }, [ready, autoFocus]);

  useEffect(() => {
    const mf = ref.current;
    if (ready && mf && mf.value !== value) mf.value = value;
  }, [ready, value]);

  useEffect(() => {
    if (ready && ref.current) ref.current.disabled = !!disabled;
  }, [ready, disabled]);

  return (
    <math-field
      ref={ref}
      aria-label={label}
      math-virtual-keyboard-policy="auto"
      smart-fence="on"
      className="block min-h-12 w-full min-w-48 rounded-lg border border-line bg-surface px-3 py-2 text-xl focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/25"
    />
  );
}
