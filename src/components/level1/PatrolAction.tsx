import { useCallback, useMemo, useState } from 'react';
import { useLevel1Store } from '../../store/level1Store';
import { PATROL_EVENTS_V2 } from '../../engine/level1/events/patrolEventsV2';
import { selectPatrolEvent, getCompanionBonus, formatOptionDisplay } from '../../engine/level1/patrolEngine';
import { EventDisplay } from './EventDisplay';
import { D20Check } from './D20Check';
import type { Follower, PatrolEventV2, PatrolEventOption, D20Modifier } from '../../types/level1Types';

/* ── State machine ────────────────────────────────────────── */

type Step =
  | { kind: 'companion' }
  | { kind: 'narrative'; event: PatrolEventV2 }
  | { kind: 'optionSelect'; event: PatrolEventV2 }
  | { kind: 'd20'; event: PatrolEventV2; option: PatrolEventOption; companionBonus: number }
  | { kind: 'result'; event: PatrolEventV2; paragraphs: string[] };

/* ── Props ────────────────────────────────────────────────── */

interface PatrolActionProps {
  onDone: () => void;
}

/**
 * 查访民情 — Patrol the territory (v2).
 * 1. Select a companion (optional)
 * 2. Show event narrative
 * 3. Select an option
 * 4. D20 check if option requires it
 * 5. Show result
 */
export function PatrolAction({ onDone }: PatrolActionProps) {
  const round = useLevel1Store((s) => s.round);
  const followers = useLevel1Store((s) => s.followers);
  const attrs = useLevel1Store((s) => s.attrs);
  const seededPatrolEvent = useLevel1Store((s) => s.seededPatrolEvent);
  const setCompanionCooldown = useLevel1Store((s) => s.setCompanionCooldown);
  const seedPatrolEvent = useLevel1Store((s) => s.seedPatrolEvent);
  const applyStatsDelta = useLevel1Store((s) => s.applyStatsDelta);
  const updateConditions = useLevel1Store((s) => s.updateConditions);

  const [step, setStep] = useState<Step>({ kind: 'companion' });
  const [selectedCompanion, setSelectedCompanion] = useState<Follower | null>(null);

  // Resolve the event: use seeded if present, otherwise random
  const patrolEvent = useMemo(() => {
    let event: PatrolEventV2 | null = null;
    if (seededPatrolEvent) {
      event = PATROL_EVENTS_V2.find((e) => e.id === seededPatrolEvent) ?? null;
    }
    if (!event) {
      event = selectPatrolEvent(PATROL_EVENTS_V2, []) ?? PATROL_EVENTS_V2[0];
    }
    // Clear the seed so subsequent patrols get a fresh event
    seedPatrolEvent(null);
    return event;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Available companions (not on cooldown)
  const availableCompanions = followers.filter(
    (f) => f.role !== 'contact' && f.companionCooldownUntilRound <= round,
  );

  /* ── Handlers ───────────────────────────────────────────── */

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
    setStep({ kind: 'optionSelect', event: patrolEvent });
  }, [patrolEvent]);

  const handleSelectOption = useCallback(
    (option: PatrolEventOption) => {
      if (option.d20Check) {
        // Calculate companion bonus
        let companionBonus = 0;
        if (selectedCompanion && option.companionBonusAttr) {
          companionBonus = getCompanionBonus(selectedCompanion.attrs, option.companionBonusAttr);
        }
        setStep({ kind: 'd20', event: patrolEvent, option, companionBonus });
      } else {
        // No D20 — apply flat stat delta
        if (option.statsDelta) applyStatsDelta(option.statsDelta);
        setStep({
          kind: 'result',
          event: patrolEvent,
          paragraphs: [`你选择了${option.label}。`],
        });
      }
    },
    [patrolEvent, selectedCompanion, applyStatsDelta],
  );

  const handleD20Result = useCallback(
    (success: boolean) => {
      if (step.kind !== 'd20') return;
      const d20 = step.option.d20Check!;
      const delta = success ? d20.successStatsDelta : d20.failureStatsDelta;
      const condChanges = success ? d20.successConditionChanges : d20.failureConditionChanges;
      if (delta) applyStatsDelta(delta);
      if (condChanges) updateConditions(condChanges);

      const narrative = success ? d20.successNarrative : d20.failureNarrative;
      setStep({ kind: 'result', event: patrolEvent, paragraphs: [narrative] });
    },
    [step, patrolEvent, applyStatsDelta, updateConditions],
  );

  /* ── Render ─────────────────────────────────────────────── */

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

  // Step 2: Event narrative
  if (step.kind === 'narrative') {
    return (
      <div className="w-full max-w-xl mx-auto py-4">
        <EventDisplay
          key={`patrol-${patrolEvent.id}`}
          title="查访民情"
          paragraphs={patrolEvent.narrative}
          onDone={handleNarrativeDone}
        />
      </div>
    );
  }

  // Step 3: Option selection
  if (step.kind === 'optionSelect') {
    return (
      <div className="w-full max-w-md mx-auto py-4">
        <h3 className="font-serif text-lg text-stone-700 text-center mb-6 tracking-widest">
          选择行动
        </h3>

        <div className="space-y-3">
          {step.event.options.map((opt) => {
            const display = formatOptionDisplay(opt);
            return (
              <button
                key={opt.id}
                className="w-full text-left px-4 py-3 border border-stone-200 rounded hover:bg-stone-50 transition-colors"
                onClick={() => handleSelectOption(opt)}
              >
                <span className="font-serif text-stone-800 font-bold">{opt.label}</span>
                <p className="text-xs text-stone-500 mt-1">{display}</p>
                {opt.d20Check && selectedCompanion && opt.companionBonusAttr && (
                  <p className="text-xs text-stone-400 mt-0.5">
                    {selectedCompanion.name}协助加成：+{getCompanionBonus(selectedCompanion.attrs, opt.companionBonusAttr)}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Step 4: D20 check
  if (step.kind === 'd20') {
    const d20 = step.option.d20Check!;
    const companionMods: D20Modifier[] = step.companionBonus > 0
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

  // Step 5: Result
  if (step.kind === 'result') {
    return <ResultView paragraphs={step.paragraphs} onDone={onDone} />;
  }

  return null;
}

/* ── Sub-view ─────────────────────────────────────────────── */

function ResultView({
  paragraphs,
  onDone,
}: {
  paragraphs: string[];
  onDone: () => void;
}) {
  const [narrated, setNarrated] = useState(false);

  return (
    <div className="w-full max-w-xl mx-auto py-4">
      <EventDisplay paragraphs={paragraphs} onDone={() => setNarrated(true)} />
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
