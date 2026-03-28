import { useCallback, useMemo, useState } from 'react';
import { useLevel1Store } from '../../store/level1Store';
import { RANDOM_PATROL_EVENTS } from '../../engine/level1/events/randomEvents';
import { selectRandomPatrolEvent } from '../../engine/level1/events/randomEvents';
import { EventDisplay } from './EventDisplay';
import { D20Check } from './D20Check';
import type { GameEvent, Follower } from '../../types/level1Types';

type Step =
  | { kind: 'companion' }
  | { kind: 'narrative'; event: GameEvent }
  | { kind: 'd20'; event: GameEvent; companionBonus: number }
  | { kind: 'result'; success: boolean; event: GameEvent };

interface PatrolActionProps {
  onDone: () => void;
}

/**
 * 查访民情 — Patrol the territory.
 * 1. Select a companion (optional)
 * 2. Show event narrative
 * 3. D20 check if event requires it
 * 4. Show result
 */
export function PatrolAction({ onDone }: PatrolActionProps) {
  const round = useLevel1Store((s) => s.round);
  const followers = useLevel1Store((s) => s.followers);
  const stats = useLevel1Store((s) => s.stats);
  const attrs = useLevel1Store((s) => s.attrs);
  const conditions = useLevel1Store((s) => s.conditions);
  const seededPatrolEvent = useLevel1Store((s) => s.seededPatrolEvent);
  const setCompanionCooldown = useLevel1Store((s) => s.setCompanionCooldown);
  const seedPatrolEvent = useLevel1Store((s) => s.seedPatrolEvent);
  const applyStatsDelta = useLevel1Store((s) => s.applyStatsDelta);
  const updateConditions = useLevel1Store((s) => s.updateConditions);

  const [step, setStep] = useState<Step>({ kind: 'companion' });
  const [selectedCompanion, setSelectedCompanion] = useState<Follower | null>(null);
  // For non-D20 events: show continue button after narrative finishes (avoids re-typing)
  const [showContinue, setShowContinue] = useState(false);

  // Resolve the event (seeded if available, otherwise random), then clear seed
  const patrolEvent = useMemo(() => {
    let event: GameEvent | null = null;
    if (seededPatrolEvent) {
      event = RANDOM_PATROL_EVENTS.find((e) => e.id === seededPatrolEvent) ?? null;
    }
    if (!event) {
      event = selectRandomPatrolEvent(stats, conditions, round) ?? RANDOM_PATROL_EVENTS[0];
    }
    // Clear the seeded event so subsequent patrols in the same round get a fresh random event
    seedPatrolEvent(null);
    return event;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Available companions (not on cooldown)
  const availableCompanions = followers.filter(
    (f) => f.role !== 'contact' && f.companionCooldownUntilRound <= round,
  );

  const handleSelectCompanion = useCallback(
    (companion: Follower | null) => {
      setSelectedCompanion(companion);
      if (companion) {
        setCompanionCooldown(companion.id, round + 2);
      }
      setStep({ kind: 'narrative', event: patrolEvent });
    },
    [patrolEvent, round, setCompanionCooldown],
  );

  const handleNarrativeDone = useCallback(() => {
    if (patrolEvent.d20Check) {
      // Companion bonus based on relevant attribute
      const d20 = patrolEvent.d20Check;
      let companionBonus = 0;
      if (selectedCompanion) {
        companionBonus = Math.max(1, Math.floor(selectedCompanion.attrs[d20.attrKey] / 5));
      }
      setStep({ kind: 'd20', event: patrolEvent, companionBonus });
    } else {
      // No D20 — apply stat delta directly, stay on narrative view with a continue button
      if (patrolEvent.statsDelta) {
        applyStatsDelta(patrolEvent.statsDelta);
      }
      if (patrolEvent.conditionChanges) {
        updateConditions(patrolEvent.conditionChanges);
      }
      setShowContinue(true);
    }
  }, [patrolEvent, selectedCompanion, applyStatsDelta, updateConditions]);

  const handleD20Result = useCallback(
    (success: boolean) => {
      const d20 = patrolEvent.d20Check!;
      const delta = success ? d20.successStatsDelta : d20.failureStatsDelta;
      const condChanges = success
        ? d20.successConditionChanges
        : d20.failureConditionChanges;
      if (delta) applyStatsDelta(delta);
      if (condChanges) updateConditions(condChanges);
      setStep({ kind: 'result', success, event: patrolEvent });
    },
    [patrolEvent, applyStatsDelta, updateConditions],
  );

  /* ── Render ──────────────────────────────────────────── */

  // Step 1: Companion selection
  if (step.kind === 'companion') {
    return (
      <div className="w-full max-w-md mx-auto py-4">
        <h3 className="font-serif text-lg text-stone-700 text-center mb-2 tracking-widest">
          查访民情
        </h3>
        <p className="text-sm text-stone-500 text-center mb-6">
          选择一名随从同行（将在本旬和下旬无法再作为随从）
        </p>

        <div className="space-y-3">
          {availableCompanions.map((f) => (
            <button
              key={f.id}
              className="w-full text-left px-4 py-3 border border-stone-200 rounded hover:bg-stone-50 transition-colors"
              onClick={() => handleSelectCompanion(f)}
            >
              <span className="font-serif text-stone-800 font-bold">{f.name}</span>
              {f.courtesy && (
                <span className="text-xs text-stone-400 ml-1">（{f.courtesy}）</span>
              )}
              <p className="text-xs text-stone-500 mt-0.5">
                力{f.attrs.strength} 智{f.attrs.intelligence} 魅{f.attrs.charisma}
              </p>
            </button>
          ))}

          <button
            className="w-full text-left px-4 py-3 border border-stone-200 rounded hover:bg-stone-50 transition-colors text-stone-500"
            onClick={() => handleSelectCompanion(null)}
          >
            无随从
          </button>
        </div>
      </div>
    );
  }

  // Step 2: Event narrative (non-D20 path stays here and shows continue button)
  if (step.kind === 'narrative') {
    return (
      <div className="w-full max-w-xl mx-auto py-4">
        <EventDisplay
          key={`patrol-${patrolEvent.id}`}
          title="查访民情"
          paragraphs={patrolEvent.narrative}
          onDone={handleNarrativeDone}
        />
        {showContinue && (
          <div className="mt-6 text-center">
            <button
              className="px-6 py-2 border border-stone-400 rounded hover:bg-stone-100 font-serif text-stone-700"
              onClick={onDone}
            >
              继续
            </button>
          </div>
        )}
      </div>
    );
  }

  // Step 3: D20 check
  if (step.kind === 'd20') {
    const d20 = patrolEvent.d20Check!;
    const companionMods = step.companionBonus > 0
      ? [
          ...d20.modifiers,
          { label: `${selectedCompanion?.name ?? '随从'}协助`, value: step.companionBonus },
        ]
      : d20.modifiers;

    return (
      <div className="w-full py-4 flex justify-center">
        <D20Check
          difficulty={d20.difficulty}
          situation={d20.situation}
          attrKey={d20.attrKey}
          attrValue={attrs[d20.attrKey]}
          modifiers={companionMods}
          onResult={handleD20Result}
        />
      </div>
    );
  }

  // Step 4: Result narrative (D20 path) — keep visible until player clicks
  if (step.kind === 'result') {
    const d20 = patrolEvent.d20Check!;
    const resultText = step.success ? d20.successNarrative : d20.failureNarrative;

    return (
      <ResultView
        key={`patrol-result-${patrolEvent.id}`}
        paragraphs={[resultText]}
        onDone={onDone}
      />
    );
  }

  return null;
}

/** Shows narrative text and waits for player to click "继续" before dismissing. */
function ResultView({
  paragraphs,
  title,
  onDone,
}: {
  paragraphs: string[];
  title?: string;
  onDone: () => void;
}) {
  const [narrated, setNarrated] = useState(false);

  return (
    <div className="w-full max-w-xl mx-auto py-4">
      <EventDisplay
        title={title}
        paragraphs={paragraphs}
        onDone={() => setNarrated(true)}
      />
      {narrated && (
        <div className="mt-6 text-center">
          <button
            className="px-6 py-2 border border-stone-400 rounded hover:bg-stone-100 font-serif text-stone-700"
            onClick={onDone}
          >
            继续
          </button>
        </div>
      )}
    </div>
  );
}
