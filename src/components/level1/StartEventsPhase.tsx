import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLevel1Store } from '../../store/level1Store';
import { getScriptedStartEvents, getConditionBasedStartEvents } from '../../engine/level1/events/scriptedEvents';
import { PATROL_EVENTS_V2 } from '../../engine/level1/events/patrolEventsV2';
import { selectPatrolEvent } from '../../engine/level1/patrolEngine';
import { EventDisplay } from './EventDisplay';
import { ClickToContinue } from './ClickToContinue';
import { AutoAdvance } from './AutoAdvance';

/**
 * Phase 1 of each round: plays scripted start events and condition-based events,
 * seeds the patrol event for Ms. Gan hints, then advances to openingScript.
 *
 * If there are no events for this round, skips directly to the next phase.
 */
export function StartEventsPhase() {
  const round = useLevel1Store((s) => s.round);
  const conditions = useLevel1Store((s) => s.conditions);
  const contacts = useLevel1Store((s) => s.contacts);
  const advancePhase = useLevel1Store((s) => s.advancePhase);
  const seedPatrolEvent = useLevel1Store((s) => s.seedPatrolEvent);

  const [narrationDone, setNarrationDone] = useState(false);
  const [conditionEffectsApplied, setConditionEffectsApplied] = useState(false);

  const scriptedEvents = useMemo(() => getScriptedStartEvents(round), [round]);
  const conditionEvents = useMemo(
    () => getConditionBasedStartEvents(contacts, conditions),
    // Only evaluate on mount (per round) to avoid re-triggering as conditions change
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [round],
  );

  // Seed a patrol event for the round (for Ms. Gan hints)
  useEffect(() => {
    const patrolEvent = selectPatrolEvent(PATROL_EVENTS_V2, []);
    if (patrolEvent) {
      seedPatrolEvent(patrolEvent.id);
    }
    // Only run on round change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round]);

  // Apply condition-based event effects when narration finishes
  useEffect(() => {
    if (!narrationDone || conditionEffectsApplied) return;
    setConditionEffectsApplied(true);

    const s = useLevel1Store.getState();
    for (const evt of conditionEvents) {
      if (evt.statsDelta) s.applyStatsDelta(evt.statsDelta);
      if (evt.conditionChanges) s.updateConditions(evt.conditionChanges);
    }
  }, [narrationDone, conditionEffectsApplied, conditionEvents]);

  const paragraphs = useMemo(() => {
    const scripted = scriptedEvents.flatMap((e) => e.narrative);
    const conditional = conditionEvents.flatMap((e) => e.narrative);
    return [...scripted, ...conditional];
  }, [scriptedEvents, conditionEvents]);

  const handleNarrationDone = useCallback(() => {
    setNarrationDone(true);
  }, []);

  const handleContinue = useCallback(() => {
    advancePhase();
  }, [advancePhase]);

  // If no events, auto-advance
  if (paragraphs.length === 0) {
    return <AutoAdvance onAdvance={handleContinue} />;
  }

  return (
    <div className="w-full py-4" onClick={narrationDone ? handleContinue : undefined} role={narrationDone ? 'button' : undefined}>
      <EventDisplay
        key={`start-events-${round}`}
        title="旬初事件"
        paragraphs={paragraphs}
        onDone={handleNarrationDone}
      />
      {narrationDone && <ClickToContinue onClick={handleContinue} />}
    </div>
  );
}