import { useEffect, useState } from 'react';
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
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 2000);
    const removeTimer = setTimeout(() => {
      onDone();
    }, 2500);
    return () => {
      clearTimeout(timer);
      clearTimeout(removeTimer);
    };
  }, [onDone]);

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
      className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50
        font-serif tracking-wider px-8 py-5
        border border-stone-300 bg-[#faf8f5] rounded shadow-md
        transition-all duration-500 ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
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
