import { memo } from 'react';
import type { Choice } from './types';

interface Props {
  choices: Choice[];
  selectedId?: string;
  onSelect: (id: string) => void;
}

/**
 * Renders a ChoiceNode as inline text-style spans.
 * Becomes permanently non-interactive once selectedId is set.
 * Wrapped in React.memo so completed choice items never re-render.
 */
export const ChoiceNodeRenderer = memo(function ChoiceNodeRenderer({
  choices,
  selectedId,
  onSelect,
}: Props) {
  const isInteractive = selectedId === undefined;

  return (
    <div className="my-8 border-x border-b border-stone-300 border-t-2 border-t-stone-500 bg-stone-50 px-5 py-4 font-serif text-lg text-stone-600">
      <ul className="list-none divide-y divide-stone-200">
        {choices.map((choice) => {
          const isSelected = selectedId === choice.id;
          const isDimmed = selectedId !== undefined && !isSelected;

          const spanClass = [
            'block py-3 px-1 select-none rounded-sm transition-colors duration-150',
            isInteractive
              ? 'cursor-pointer text-stone-700 hover:text-stone-900 hover:bg-stone-100 active:bg-stone-200'
              : 'cursor-default',
            isSelected ? 'font-semibold text-red-800' : '',
            isDimmed ? 'text-stone-300' : '',
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <li key={choice.id}>
              <span
                tabIndex={isInteractive ? 0 : undefined}
                role={isInteractive ? 'button' : undefined}
                className={spanClass}
                onClick={isInteractive ? (e) => { e.stopPropagation(); onSelect(choice.id); } : undefined}
                onKeyDown={
                  isInteractive
                    ? (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          e.stopPropagation();
                          onSelect(choice.id);
                        }
                      }
                    : undefined
                }
              >
                {`「${choice.label}」`}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
});
