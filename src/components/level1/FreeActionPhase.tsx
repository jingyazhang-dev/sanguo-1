import { useCallback, useEffect, useState } from 'react';
import { useLevel1Store } from '../../store/level1Store';
import { getAvailableActions } from '../../engine/level1/actionEngine';
import { VisitAction } from './VisitAction';
import type { FreeActionType } from '../../types/level1Types';
import { FREE_ACTION_DAYS } from '../../types/level1Types';
import { TalkAction } from './TalkAction';
import { PatrolAction } from './PatrolAction';

/* ── Narrative hints for days remaining ─────────────────────── */

// Must cover the full range 1..DAYS_PER_ROUND (currently 10).
const FREE_ACTION_HINTS: Partial<Record<number, string>> = {
  10: '旬初方启，时日充裕',
  9:  '诸事在前，可徐图之',
  8:  '日出方长，何所不可',
  7:  '曙光初照，旬日方长',
  6:  '晨光正好，从容可期',
  5:  '日过中天，犹未晚也',
  4:  '日色渐西，当有所为',
  3:  '西日已斜，须速图之',
  2:  '暮色将至，莫负此时',
  1:  '灯火将残，今日最末',
};

const DEFAULT_FREE_ACTION_HINT = '时不我待，当思所为';

function getFreeActionHint(daysLeft: number): string {
  return FREE_ACTION_HINTS[daysLeft] ?? DEFAULT_FREE_ACTION_HINT;
}

/**
 * Phase 4: Free Action / 自由行动
 * Player chooses from available actions until days run out.
 *
 * Sub-action components (TalkAction, VisitAction, PatrolAction) are rendered
 * inline and call `onDone()` to return to the action menu.
 */
export function FreeActionPhase() {
  const daysLeft = useLevel1Store((s) => s.daysLeft);
  const stats = useLevel1Store((s) => s.stats);
  const conditions = useLevel1Store((s) => s.conditions);
  const consumeDays = useLevel1Store((s) => s.consumeDays);
  const endFreeActionPhase = useLevel1Store((s) => s.endFreeActionPhase);
  const advancePhase = useLevel1Store((s) => s.advancePhase);

  const [activeAction, setActiveAction] = useState<FreeActionType | null>(null);

  const availableActions = getAvailableActions(stats, conditions, daysLeft);

  const handleSelectAction = useCallback(
    (actionType: FreeActionType) => {
      if (actionType === 'rest') {
        endFreeActionPhase();
        return;
      }
      setActiveAction(actionType);
    },
    [endFreeActionPhase],
  );

  const handleActionDone = useCallback(() => {
    if (activeAction && activeAction !== 'rest') {
      consumeDays(FREE_ACTION_DAYS[activeAction]);
    }
    setActiveAction(null);

    // Auto-advance if no days left
    const currentDays = useLevel1Store.getState().daysLeft;
    if (currentDays <= 0) {
      advancePhase();
    }
  }, [activeAction, consumeDays, advancePhase]);

  // Auto-advance if entering with 0 days
  if (daysLeft <= 0 && !activeAction) {
    return <AutoAdvance onAdvance={advancePhase} />;
  }

  // If a sub-action is active, render it
  if (activeAction) {
    return (
      <SubActionRouter
        actionType={activeAction}
        onDone={handleActionDone}
        onCancel={() => setActiveAction(null)}
      />
    );
  }

  // Show action menu
  return (
    <div className="w-full max-w-md mx-auto py-4">
      <p className="font-serif text-sm text-stone-500 text-center mb-6 tracking-wide italic">
        {getFreeActionHint(daysLeft)}
      </p>

      <div className="space-y-3">
        {availableActions.map((action) => (
          <button
            key={action.type}
            className="w-full text-left px-4 py-3 border border-stone-200 rounded hover:bg-stone-50 transition-colors"
            onClick={() => handleSelectAction(action.type)}
          >
            <span className="font-serif text-stone-800 font-bold">{action.label}</span>
            {action.dayCost > 0 && (
              <span className="text-xs text-stone-400 ml-2">({action.dayCost}日)</span>
            )}
            <p className="text-xs text-stone-500 mt-0.5">{action.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Sub-action router ──────────────────────────────────────── */

function SubActionRouter({
  actionType,
  onDone,
  onCancel,
}: {
  actionType: FreeActionType;
  onDone: () => void;
  onCancel: () => void;
}) {
  // Placeholder implementations — will be replaced by real components in obt-09/10/11
  switch (actionType) {
    case 'talk':
      return (
        <TalkAction onDone={onDone} onCancel={onCancel} />
      );
    case 'visit':
      return (
        <VisitAction onDone={onDone} onCancel={onCancel} />
      );
    case 'patrolField':
      return (
        <PatrolAction onDone={onDone} />
      );
    default:
      return null;
  }
}

/* ── Auto-advance helper ────────────────────────────────────── */

function AutoAdvance({ onAdvance }: { onAdvance: () => void }) {
  useEffect(() => {
    onAdvance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
