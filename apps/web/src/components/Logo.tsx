import { LOGO } from "@ga/design";

/** Logo draws the mark of Great Academy, in its fixed colors. */
export function Logo({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox={LOGO.viewBox} fill="none" aria-hidden="true" className="shrink-0">
      <path d={LOGO.shield} fill={LOGO.shieldColor} />
      <path d={LOGO.letter} stroke={LOGO.letterColor} strokeWidth={LOGO.letterWidth} />
    </svg>
  );
}
