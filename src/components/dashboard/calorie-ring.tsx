"use client";

interface CalorieRingProps {
  consumed: number;
  tdee: number;
  burned: number;
}

/**
 * SVG ring chart showing calorie progress vs TDEE.
 * - Green arc: consumed calories
 * - Shows net remaining in center
 */
export function CalorieRing({ consumed, tdee, burned }: CalorieRingProps) {
  const SIZE = 160;
  const STROKE = 14;
  const R = (SIZE - STROKE) / 2;
  const CIRC = 2 * Math.PI * R;

  // Clamp to 0-1 for the arc
  const progress = Math.min(consumed / Math.max(tdee, 1), 1);
  const dashOffset = CIRC * (1 - progress);

  const remaining = tdee + burned - consumed;
  const isOver = remaining < 0;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        <svg
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="-rotate-90"
        >
          {/* Track */}
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            fill="none"
            stroke="currentColor"
            strokeWidth={STROKE}
            className="text-border"
          />
          {/* Progress arc */}
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            fill="none"
            stroke="currentColor"
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={dashOffset}
            className={isOver ? "text-danger" : "text-primary"}
            style={{ transition: "stroke-dashoffset 0.8s ease" }}
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span
            className={`text-2xl font-bold leading-none ${
              isOver ? "text-danger" : "text-text-dark"
            }`}
          >
            {Math.abs(remaining)}
          </span>
          <span className="text-[10px] text-text-muted mt-0.5 leading-tight">
            {isOver ? "kcal over" : "kcal sisa"}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-xs text-text-muted">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-primary" />
          <span>Masuk: <strong className="text-text-dark">{consumed}</strong></span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-success" />
          <span>Terbakar: <strong className="text-text-dark">{burned}</strong></span>
        </div>
      </div>
    </div>
  );
}
