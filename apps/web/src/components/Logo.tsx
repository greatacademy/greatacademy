import { LOGO } from "@ga/design";

/**
 * Logo draws the mark of Great Academy. Its colors are fixed; light-dark() follows
 * the color scheme the appearance settings put on the page and adds the outline
 * only in dark.
 */
export function Logo({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox={LOGO.viewBox} fill="none" aria-hidden="true" className="shrink-0">
      <path
        d={LOGO.shield}
        fill={LOGO.shieldColor}
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
        style={{ stroke: `light-dark(transparent, ${LOGO.outlineColor})` }}
      />
      <path d={LOGO.letter} stroke={LOGO.letterColor} strokeWidth={LOGO.letterWidth} />
    </svg>
  );
}
