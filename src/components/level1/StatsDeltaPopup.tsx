import { STAT_LABELS } from '../../engine/level1/statDisplay';
import type { StatsDelta } from '../../types/level1Types';

const DIRECT_STAT_KEYS: (keyof typeof STAT_LABELS & keyof StatsDelta)[] = [
  'reputation', 'military', 'rations', 'gold', 'support',
  'training', 'equipment',
];

interface Props {
  delta: StatsDelta;
  onDone: () => void;
}

export function StatsDeltaPopup({ delta, onDone }: Props) {
  const changes: { label: string; display: string; color: string }[] = [];

  for (const key of DIRECT_STAT_KEYS) {
    const val = delta[key];
    if (val !== undefined && val !== 0) {
      const sign = val > 0 ? '+' : '';
      const color = val > 0 ? 'text-green-700' : 'text-red-800';
      changes.push({ label: STAT_LABELS[key], display: `${sign}${val}`, color });
    }
  }

  if (changes.length === 0) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-1/2 left-1/2 z-50
        font-serif tracking-wider px-8 py-5
        border border-stone-300 bg-[#faf8f5] rounded shadow-md
        animate-float-up-fade"
      onAnimationEnd={onDone}
    >
      <div className="flex items-center gap-6">
        {changes.map((c, i) => (
          <span key={i} className="flex items-center gap-1.5">
            <span className="text-lg text-stone-600">{c.label}</span>
            <span className={`text-xl font-bold ${c.color}`}>{c.display}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
