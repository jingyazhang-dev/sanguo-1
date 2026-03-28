import { useLevel0Store } from '../store/level0Store';
import { useGameStore } from '../store/gameStore';
import type { PlayerAttrs } from '../types/player';

const ATTR_LABELS: Record<keyof PlayerAttrs, string> = {
  strength:     '力量',
  intelligence: '智谋',
  charisma:     '魅力',
};

const ATTR_KEYS: (keyof PlayerAttrs)[] = ['strength', 'intelligence', 'charisma'];

export function Level0Summary() {
  const { attrs, initialAttrs } = useLevel0Store();
  const goToLevel1 = useGameStore((s) => s.goToLevel1);

  return (
    <div
      className="h-full flex flex-col items-center justify-center cursor-pointer select-none px-8 py-12"
      onClick={() => goToLevel1(attrs)}
    >
      <div className="w-full max-w-md">
        <h2 className="font-serif text-2xl text-stone-800 text-center mb-10 tracking-widest">
          属性总结
        </h2>

        <table className="w-full font-serif text-base border-collapse">
          <thead>
            <tr className="border-b border-stone-300 text-stone-500">
              <th className="text-left py-3 font-normal">属性</th>
              <th className="text-center py-3 font-normal">初始</th>
              <th className="text-center py-3 font-normal">当前</th>
              <th className="text-center py-3 font-normal">变化</th>
            </tr>
          </thead>
          <tbody>
            {ATTR_KEYS.map((key) => {
              const initial = initialAttrs[key];
              const final   = attrs[key];
              const delta   = final - initial;

              const deltaClass =
                delta > 0 ? 'text-red-700 font-bold' :
                delta < 0 ? 'text-stone-400 font-bold'   :
                'text-stone-400';

              const deltaLabel =
                delta > 0 ? `+${delta}` :
                delta < 0 ? `${delta}`  :
                '—';

              return (
                <tr key={key} className="border-b border-stone-200">
                  <td className="py-3 text-stone-700">{ATTR_LABELS[key]}</td>
                  <td className="py-3 text-center text-stone-500">{initial}</td>
                  <td className="py-3 text-center text-stone-900 font-bold">{final}</td>
                  <td className={`py-3 text-center ${deltaClass}`}>{deltaLabel}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <p className="mt-16 text-center font-serif text-xs text-stone-500 tracking-widest animate-pulse">
          点击任意处继续
        </p>
      </div>
    </div>
  );
}
