"use client";

interface MacroBarProps {
  label: string;
  value: number;   // gram consumed
  max: number;     // gram target
  color: string;   // tailwind bg class
}

/**
 * Single macro nutrient progress bar.
 */
function MacroBar({ label, value, max, color }: MacroBarProps) {
  const pct = Math.min((value / Math.max(max, 1)) * 100, 100);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center">
        <span className="text-xs text-text-muted">{label}</span>
        <span className="text-xs font-semibold text-text-dark">
          {value}g <span className="text-text-muted font-normal">/ {max}g</span>
        </span>
      </div>
      <div className="h-1.5 bg-border rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

interface MacroPanelProps {
  proteinG: number;
  carbsG: number;
  fatG: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
}

/**
 * Panel showing protein, carbs, and fat progress bars.
 */
export function MacroPanel({
  proteinG,
  carbsG,
  fatG,
  targetProtein,
  targetCarbs,
  targetFat,
}: MacroPanelProps) {
  return (
    <div className="card flex flex-col gap-3">
      <p className="text-sm font-semibold text-text-dark">Makronutrien</p>
      <MacroBar
        label="Protein"
        value={Math.round(proteinG)}
        max={targetProtein}
        color="bg-primary"
      />
      <MacroBar
        label="Karbohidrat"
        value={Math.round(carbsG)}
        max={targetCarbs}
        color="bg-warning"
      />
      <MacroBar
        label="Lemak"
        value={Math.round(fatG)}
        max={targetFat}
        color="bg-danger"
      />
    </div>
  );
}
