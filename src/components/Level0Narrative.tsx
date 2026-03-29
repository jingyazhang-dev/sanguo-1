import { useCallback, useEffect, useRef, useState } from 'react';
import { useLevel0Store } from '../store/level0Store';
import { level0Data } from '../engine/level0Data';
import { TypeInRenderer } from './TypeInRenderer';
import type { TypeInRendererHandle } from './TypeInRenderer';
import { AttrChangePopup } from './AttrChangePopup';
import type { PlayerAttrs } from '../types/player';
import type { SpeedLevel } from './TypeInRenderer/types';

const OUTRO_HINT_TEXT = '点击任意处继续';

const SPEED_LABELS: Record<SpeedLevel, string> = { slow: '慢', normal: '正', fast: '快' };
const SPEED_ORDER: SpeedLevel[] = ['slow', 'normal', 'fast'];

export function Level0Narrative() {
  const { applyAnswer, goToSummary } = useLevel0Store();
  const rendererRef = useRef<TypeInRendererHandle>(null);
  /** Index of the question whose choice we are waiting on next. */
  const questionIndexRef = useRef(0);
  /** Set to true when outro text is appended — gates the onQueueEmpty handler. */
  const outroStartedRef = useRef(false);
  /** Set to true once the outro text has finished rendering. */
  const [outroReady, setOutroReady] = useState(false);
  const [pendingDelta, setPendingDelta] = useState<Partial<PlayerAttrs> | null>(null);
  const [popupKey, setPopupKey] = useState(0);
  const [speed, setSpeed] = useState<SpeedLevel>('normal');
  const clearDelta = useCallback(() => setPendingDelta(null), []);

  useEffect(() => {
    const renderer = rendererRef.current;
    if (!renderer) return;

    // Feed intro paragraphs
    level0Data.introParagraphs.forEach((text, i) => {
      renderer.append({ type: 'text', id: `intro-${i}`, content: text });
    });

    // Feed first question (narrative + choices)
    appendQuestion(renderer, 0);

    // Cleanup: React StrictMode (dev) runs effects twice. Without this cleanup,
    // the second run would double-append all content to the renderer, causing
    // q0 to appear twice and all subsequent question/option ID lookups to misalign.
    // Also resets component-local tracking refs so the second run starts fully clean.
    return () => {
      renderer.reset();
      questionIndexRef.current = 0;
      outroStartedRef.current = false;
    };
    // Intentionally empty: this effect must run exactly once on mount.
    // appendQuestion uses only rendererRef (stable ref) and level0Data (module constant).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function appendQuestion(renderer: TypeInRendererHandle, index: number) {
    const q = level0Data.questions[index];
    renderer.append({ type: 'text', id: `q${index}-narrative`, content: q.narrative });
    renderer.append({
      type: 'choice',
      id: `q${index}-choice`,
      choices: q.options.map((o) => ({ id: o.id, label: o.label })),
    });
  }

  function handleChoiceSelected(choiceId: string) {
    const index = questionIndexRef.current;
    const question = level0Data.questions[index];
    if (!question) return; // guard: should never happen, but prevents crash if state is inconsistent
    const option = question.options.find((o) => o.id === choiceId);
    if (option) {
      setPendingDelta(option.delta);
      setPopupKey((k) => k + 1);
      applyAnswer(option.delta);
    }

    const nextIndex = index + 1;
    questionIndexRef.current = nextIndex;

    const renderer = rendererRef.current;
    if (!renderer) return;

    if (nextIndex < level0Data.questions.length) {
      // Append next question
      appendQuestion(renderer, nextIndex);
    } else {
      // All questions answered — append outro paragraphs; onQueueEmpty will fire when done
      outroStartedRef.current = true;
      level0Data.outroParagraphs.forEach((text, i) => {
        renderer.append({ type: 'text', id: `outro-${i}`, content: text });
      });
    }
  }

  function handleContentClick() {
    rendererRef.current?.skipCurrent();
  }

  return (
    <div className="relative h-full flex flex-col items-center overflow-hidden">
      {/* Text content — click anywhere on it to skip the current typing animation */}
      <div
        className="w-full max-w-xl px-6 sm:px-8 py-8 sm:py-12 pb-[max(6rem,env(safe-area-inset-bottom,6rem))] cursor-pointer flex-1 min-h-0 overflow-y-auto"
        onClick={handleContentClick}
      >
        <TypeInRenderer
          ref={rendererRef}
          speed={speed}
          onChoiceSelected={handleChoiceSelected}
          onQueueEmpty={() => {
            if (outroStartedRef.current) setOutroReady(true);
          }}
        />
      </div>

      {/* Full-screen "click anywhere" overlay — appears only after outro text finishes */}
      {outroReady && (
        <div
          className="fixed inset-0 cursor-pointer"
          role="button"
          tabIndex={0}
          aria-label="点击继续"
          onClick={() => { setOutroReady(false); goToSummary(); }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') { setOutroReady(false); goToSummary(); }
          }}
        >
          <p className="absolute bottom-10 left-1/2 -translate-x-1/2 font-serif text-xs text-stone-500 tracking-widest animate-pulse">
            {OUTRO_HINT_TEXT}
          </p>
        </div>
      )}

      {/* Speed control — fixed at top-right; hidden during outro overlay */}
      {!outroReady && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-1.5" aria-label="文字速度">
          <span className="font-serif text-xs text-stone-400 select-none">速</span>
          {SPEED_ORDER.map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={[
                'font-serif text-sm px-3 py-1.5 rounded border transition-colors select-none',
                speed === s
                  ? 'border-stone-600 bg-stone-700 text-[#faf8f5]'
                  : 'border-stone-300 text-stone-500 hover:border-stone-500 hover:text-stone-700',
              ].join(' ')}
            >
              {SPEED_LABELS[s]}
            </button>
          ))}
        </div>
      )}

      {pendingDelta && Object.values(pendingDelta).some((v) => v !== 0) && (
        <AttrChangePopup key={popupKey} delta={pendingDelta} onDone={clearDelta} />
      )}
    </div>
  );
}
