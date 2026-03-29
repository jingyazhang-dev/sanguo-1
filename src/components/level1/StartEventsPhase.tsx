import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLevel1Store } from '../../store/level1Store';
import { getScriptedStartEvents } from '../../engine/level1/events/scriptedEvents';
import { selectRandomPatrolEvent } from '../../engine/level1/events/randomEvents';
import { EventDisplay } from './EventDisplay';
import { ClickToContinue } from './ClickToContinue';

/**
 * Phase 1 of each round: plays scripted start events (if any),
 * seeds the patrol event for Ms. Gan hints, then advances to openingScript.
 *
 * If there are no start events for this round, skips directly to the next phase.
 */
export function StartEventsPhase() {
  const round = useLevel1Store((s) => s.round);
  const stats = useLevel1Store((s) => s.stats);
  const conditions = useLevel1Store((s) => s.conditions);
  const advancePhase = useLevel1Store((s) => s.advancePhase);
  const seedPatrolEvent = useLevel1Store((s) => s.seedPatrolEvent);

  const [narrationDone, setNarrationDone] = useState(false);

  const events = useMemo(() => getScriptedStartEvents(round), [round]);

  // Seed a patrol event for the round (for Ms. Gan hints)
  useEffect(() => {
    const patrolEvent = selectRandomPatrolEvent(stats, conditions, round);
    if (patrolEvent) {
      seedPatrolEvent(patrolEvent.id);
    }
    // Only run on round change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round]);

  const paragraphs = useMemo(() => {
    return events.flatMap((e) => e.narrative);
  }, [events]);

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

/** Immediately calls onAdvance on mount (guarded against StrictMode double-fire). */
function AutoAdvance({ onAdvance }: { onAdvance: () => void }) {
  const firedRef = useRef(false);
  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;
    onAdvance();
  }, [onAdvance]);
  return null;
}
