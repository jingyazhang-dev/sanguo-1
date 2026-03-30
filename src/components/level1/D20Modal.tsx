import type { ReactNode } from 'react';
import { D20Check } from './D20Check';
import type { D20Situation, D20Modifier } from '../../types/level1Types';
import type { PlayerAttrs } from '../../types/player';

interface D20ModalProps {
  /** Content rendered behind the semi-transparent overlay (the context the player just saw). */
  background: ReactNode;
  /** D20Check props */
  difficulty: number;
  situation: D20Situation;
  attrKey: keyof PlayerAttrs;
  attrValue: number;
  modifiers: D20Modifier[];
  onResult: (success: boolean, total: number) => void;
  /** Reroll props forwarded to D20Check */
  rerollCost?: number;
  canAffordReroll?: boolean;
  onReroll?: () => void;
}

/**
 * Renders `background` content behind a fixed semi-transparent overlay,
 * with D20Check floating on top as a modal panel.
 */
export function D20Modal({
  background,
  difficulty,
  situation,
  attrKey,
  attrValue,
  modifiers,
  onResult,
  rerollCost,
  canAffordReroll,
  onReroll,
}: D20ModalProps) {
  return (
    <>
      {/* Background — dimmed, non-interactive */}
      <div className="opacity-40 pointer-events-none select-none" aria-hidden="true">
        {background}
      </div>

      {/* Fixed overlay backdrop + D20 panel */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 p-4">
        <D20Check
          difficulty={difficulty}
          situation={situation}
          attrKey={attrKey}
          attrValue={attrValue}
          modifiers={modifiers}
          onResult={onResult}
          rerollCost={rerollCost}
          canAffordReroll={canAffordReroll}
          onReroll={onReroll}
        />
      </div>
    </>
  );
}
