import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLevel1Store } from '../../store/level1Store';
import { getOpeningScript } from '../../engine/level1/events/scriptedEvents';
import { EventDisplay } from './EventDisplay';
import { ClickToContinue } from './ClickToContinue';

/**
 * Phase 2 of each round: plays the pre-authored opening script text,
 * then advances to the standup phase.
 */
export function OpeningScriptPhase() {
  const round = useLevel1Store((s) => s.round);
  const advancePhase = useLevel1Store((s) => s.advancePhase);

  const [narrationDone, setNarrationDone] = useState(false);

  const paragraphs = useMemo(() => getOpeningScript(round), [round]);

  const handleNarrationDone = useCallback(() => {
    setNarrationDone(true);
  }, []);

  const handleContinue = useCallback(() => {
    advancePhase();
  }, [advancePhase]);

  // If no opening script, auto-advance
  if (paragraphs.length === 0) {
    return <AutoAdvance onAdvance={handleContinue} />;
  }

  return (
    <div className="w-full py-4" onClick={narrationDone ? handleContinue : undefined} role={narrationDone ? 'button' : undefined}>
      <EventDisplay
        key={`opening-${round}`}
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
