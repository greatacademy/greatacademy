const frame = "h-auto w-full max-w-sm";

/** PlacementArt draws a map of topics: what is known, what comes next, and what is still locked. */
export function PlacementArt() {
  const nodes: readonly (readonly [number, number, "known" | "next" | "locked"])[] = [
    [40, 40, "known"],
    [40, 110, "known"],
    [40, 180, "known"],
    [130, 70, "known"],
    [130, 150, "next"],
    [220, 40, "next"],
    [220, 110, "locked"],
    [220, 180, "locked"],
    [310, 75, "locked"],
    [310, 145, "locked"],
  ];
  const edges = [
    [0, 3],
    [1, 3],
    [1, 4],
    [2, 4],
    [3, 5],
    [3, 6],
    [4, 6],
    [4, 7],
    [5, 8],
    [6, 8],
    [6, 9],
    [7, 9],
  ] as const;
  const at = (i: number) => nodes[i] ?? ([0, 0, "locked"] as const);
  return (
    <svg viewBox="0 0 350 220" className={frame} aria-hidden="true">
      {edges.map(([a, b]) => (
        <line key={`${a}-${b}`} x1={at(a)[0]} y1={at(a)[1]} x2={at(b)[0]} y2={at(b)[1]} className="stroke-line" strokeWidth="2" />
      ))}
      {nodes.map(([x, y, kind]) => (
        <g key={`${x}-${y}`}>
          {kind === "next" && <circle cx={x} cy={y} r="20" className="fill-accent-soft" />}
          <circle
            cx={x}
            cy={y}
            r="12"
            strokeWidth="2"
            className={
              kind === "known" ? "fill-good stroke-good" : kind === "next" ? "fill-accent stroke-accent" : "fill-surface stroke-line"
            }
          />
        </g>
      ))}
    </svg>
  );
}

/** StepsArt draws a lesson as a row of steps, each passed by two correct answers in a row. */
export function StepsArt() {
  const steps = [50, 135, 220, 305];
  return (
    <svg viewBox="0 0 350 220" className={frame} aria-hidden="true">
      <line x1="50" y1="90" x2="305" y2="90" className="stroke-line" strokeWidth="4" />
      <line x1="50" y1="90" x2="220" y2="90" className="stroke-good" strokeWidth="4" />
      {steps.map((x, i) => (
        <circle
          key={x}
          cx={x}
          cy="90"
          r="20"
          strokeWidth="3"
          className={i < 2 ? "fill-good stroke-good" : i === 2 ? "fill-accent-soft stroke-accent" : "fill-surface stroke-line"}
        />
      ))}
      {steps.slice(0, 2).map((x) => (
        <path
          key={x}
          d={`M${x - 8} 90 l6 6 l11 -12`}
          fill="none"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="stroke-surface"
        />
      ))}
      <circle cx="208" cy="140" r="7" className="fill-good" />
      <circle cx="232" cy="140" r="7" className="fill-line" />
    </svg>
  );
}

/** ReviewArt draws memory fading ever more slowly, restored by reviews placed further and further apart. */
export function ReviewArt() {
  return (
    <svg viewBox="0 0 350 220" className={frame} aria-hidden="true">
      <line x1="20" y1="195" x2="335" y2="195" className="stroke-line" strokeWidth="2" />
      <line x1="20" y1="130" x2="335" y2="130" className="stroke-warn" strokeWidth="2" strokeDasharray="5 6" />
      <path
        d="M20 30 C 32 80, 45 110, 62 126 L62 30 C 82 78, 104 108, 132 126 L132 30 C 165 74, 205 106, 250 126 L250 30 C 275 55, 305 78, 335 92"
        fill="none"
        strokeWidth="3"
        strokeLinejoin="round"
        className="stroke-accent"
      />
      {[62, 132, 250].map((x) => (
        <circle key={x} cx={x} cy="30" r="7" className="fill-good" />
      ))}
    </svg>
  );
}

/** QuizArt draws a quiz of eight questions, the missed ones marked to come back. */
export function QuizArt() {
  const missed = new Set([2, 6]);
  return (
    <svg viewBox="0 0 350 220" className={frame} aria-hidden="true">
      {Array.from({ length: 8 }, (_, i) => {
        const x = 50 + (i % 4) * 66;
        const y = 45 + Math.floor(i / 4) * 72;
        const miss = missed.has(i);
        return (
          <g key={`${x}-${y}`}>
            <rect
              x={x}
              y={y}
              width="52"
              height="56"
              rx="10"
              strokeWidth="2"
              className={miss ? "fill-warn-soft stroke-warn" : "fill-good-soft stroke-good"}
            />
            {miss ? (
              <path d={`M${x + 34} ${y + 22} a9 9 0 1 0 2 10`} fill="none" strokeWidth="3" strokeLinecap="round" className="stroke-warn" />
            ) : (
              <path
                d={`M${x + 16} ${y + 28} l7 7 l13 -14`}
                fill="none"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="stroke-good"
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}
