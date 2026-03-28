import { useCallback } from 'react';
import { useLevel1Store } from '../../store/level1Store';
import { getOpeningScript } from '../../engine/level1/events/scriptedEvents';
import { EventDisplay } from './EventDisplay';

/**
 * Phase 2 of each round: plays the pre-authored opening script text,
 * then advances to the standup phase.
 */
export function OpeningScriptPhase() {
  const round = useLevel1Store((s) => s.round);
  const advancePhase = useLevel1Store((s) => s.advancePhase);

  const paragraphs = getOpeningScript(round);

  const handleDone = useCallback(() => {
    advancePhase();
  }, [advancePhase]);

  return (
    <div className="w-full py-4">
      <EventDisplay
        key={`opening-${round}`}
        paragraphs={paragraphs}
        onDone={handleDone}
      />
    </div>
  );
}
