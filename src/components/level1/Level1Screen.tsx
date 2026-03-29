import { useEffect, useRef } from 'react';
import { useLevel1Store } from '../../store/level1Store';
import { StatsPanel } from './StatsPanel';
import { Level1Cover } from './Level1Cover';
import { StartEventsPhase } from './StartEventsPhase';
import { OpeningScriptPhase } from './OpeningScriptPhase';
import { StandupPhase } from './StandupPhase';
import { SettlementPhase } from './SettlementPhase';
import { FreeActionPhase } from './FreeActionPhase';
import { LevelEndScreen } from './LevelEndScreen';
import { StatsDeltaPopup } from './StatsDeltaPopup';
import { AttrChangePopup } from '../AttrChangePopup';

export function Level1Screen() {
  const phase = useLevel1Store((s) => s.phase);
  const reset = useLevel1Store((s) => s.reset);
  const pendingStatsDelta = useLevel1Store((s) => s.pendingStatsDelta);
  const pendingStatsDeltaKey = useLevel1Store((s) => s.pendingStatsDeltaKey);
  const pendingAttrsDelta = useLevel1Store((s) => s.pendingAttrsDelta);
  const pendingAttrsDeltaKey = useLevel1Store((s) => s.pendingAttrsDeltaKey);
  const clearPendingStatsDelta = useLevel1Store((s) => s.clearPendingStatsDelta);
  const clearPendingAttrsDelta = useLevel1Store((s) => s.clearPendingAttrsDelta);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Initialise level state from gameStore playerAttrs
  useEffect(() => {
    reset();
  }, [reset]);

  // Mount: start looping chapter BGM; cleanup: fade out then stop
  useEffect(() => {
    const audio = new Audio('/assets/audio/level-bgm/chapter1.mp3');
    audio.loop = true;
    audio.play().catch(() => {}); // graceful autoplay failure
    audioRef.current = audio;

    return () => {
      if (fadeIntervalRef.current !== null) {
        clearInterval(fadeIntervalRef.current);
        fadeIntervalRef.current = null;
      }
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, []);

  // Cover phase: full-screen, no RoundHeader or StatsPanel
  if (phase === 'cover') {
    return <Level1Cover />;
  }

  /* ── Phase content switch ─────────────────────────────────── */

  const phaseContent = (() => {
    switch (phase) {
      case 'startEvents':   return <StartEventsPhase />;
      case 'openingScript': return <OpeningScriptPhase />;
      case 'standup':       return <StandupPhase />;
      case 'freeAction':    return <FreeActionPhase />;
      case 'endingEvents':  return <SettlementPhase />;
      case 'levelEnd':      return <LevelEndScreen />;
    }
  })();

  return (
    <div className="h-full flex flex-col bg-[#faf8f5] font-serif text-stone-800 overflow-hidden">
      {/* Stats bar (includes round info) */}
      <StatsPanel />

      {/* Main content pane */}
      <main className="flex-1 flex flex-col items-center p-4 md:p-8 overflow-y-auto">
        {phaseContent}
      </main>

      {/* Stat-change popups (float-up-fade overlays) */}
      {pendingStatsDelta && (
        <StatsDeltaPopup
          key={pendingStatsDeltaKey}
          delta={pendingStatsDelta}
          onDone={clearPendingStatsDelta}
        />
      )}
      {pendingAttrsDelta && Object.values(pendingAttrsDelta).some((v) => v !== 0) && (
        <AttrChangePopup
          key={pendingAttrsDeltaKey}
          delta={pendingAttrsDelta}
          onDone={clearPendingAttrsDelta}
        />
      )}
    </div>
  );
}
