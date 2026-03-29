import type { PlayerAttrs } from '../types/player';

const ATTR_LABELS: Record<keyof PlayerAttrs, string> = {
  strength:     '力量',
  intelligence: '智谋',
  charisma:     '魅力',
};

const ATTR_KEYS: (keyof PlayerAttrs)[] = ['strength', 'intelligence', 'charisma'];

interface Props {
  delta: Partial<PlayerAttrs>;
  onDone: () => void;
}

export function AttrChangePopup({ delta, onDone }: Props) {
  const changes = ATTR_KEYS
    .filter((key) => delta[key] !== undefined && delta[key] !== 0)
    .map((key) => {
      const val = delta[key]!;
      const sign = val > 0 ? '+' : '';
      const color = val > 0 ? 'text-red-700' : 'text-stone-400';
      return { label: ATTR_LABELS[key], display: `${sign}${val}`, color };
    });

  if (changes.length === 0) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-1/3 left-1/2 z-50
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
