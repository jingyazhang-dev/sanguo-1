import { useCallback, useEffect, useRef, useState } from 'react';
import type { D20Situation, D20Modifier } from '../../types/level1Types';
import type { PlayerAttrs } from '../../types/player';
import { resolveD20Check, type D20Result } from '../../engine/level1/d20Engine';

/* ── Attribute label map ──────────────────────────────────── */

const ATTR_LABELS: Record<keyof PlayerAttrs, string> = {
  strength: '力量',
  intelligence: '智谋',
  charisma: '魅力',
};

const SITUATION_LABELS: Record<D20Situation, string> = {
  normal: '普通',
  advantage: '优势',
  disadvantage: '劣势',
};

/* ── Props ────────────────────────────────────────────────── */

interface D20CheckProps {
  difficulty: number;
  situation: D20Situation;
  attrKey: keyof PlayerAttrs;
  attrValue: number;
  modifiers: D20Modifier[];
  onResult: (success: boolean, total: number) => void;
}

/* ── Stage type ───────────────────────────────────────────── */

type Stage = 'data' | 'roll' | 'modifier' | 'conclusion';

/* ── Helpers ──────────────────────────────────────────────── */

/** Format a signed number as "+N" or "−N" (uses proper minus sign). */
function signed(n: number): string {
  return n >= 0 ? `+${n}` : `−${Math.abs(n)}`;
}

/* ── Component ────────────────────────────────────────────── */

export function D20Check({
  difficulty,
  situation,
  attrKey,
  attrValue,
  modifiers,
  onResult,
}: D20CheckProps) {
  /* ---- persistent state ---- */
  const [stage, setStage] = useState<Stage>('data');
  const [result, setResult] = useState<D20Result | null>(null);

  /* ---- roll animation state ---- */
  const [displayedDice, setDisplayedDice] = useState<number[]>([0]);
  const [flickering, setFlickering] = useState(false);
  const flickerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ---- modifier animation state ---- */
  const [visibleParts, setVisibleParts] = useState(0);
  const modPartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ---- auto-advance timers ---- */
  const autoAdvanceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rollSettleRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ---- cleanup on unmount ---- */
  useEffect(() => {
    return () => {
      if (flickerRef.current) clearInterval(flickerRef.current);
      if (modPartTimerRef.current) clearTimeout(modPartTimerRef.current);
      if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
      if (rollSettleRef.current) clearTimeout(rollSettleRef.current);
    };
  }, []);

  /* ================================================================
   *  Stage 1 → 2 : resolve the check, start flicker
   * ================================================================ */
  const handleRollClick = useCallback(() => {
    const d20Result = resolveD20Check({
      difficulty,
      situation,
      attrValue,
      modifiers,
    });
    setResult(d20Result);

    const diceCount = d20Result.rolls.length;
    setDisplayedDice(Array.from({ length: diceCount }, () => 1));
    setFlickering(true);
    setStage('roll');

    // Flicker: swap random faces every 50 ms for ~1.5 s
    const flickerInterval = setInterval(() => {
      setDisplayedDice(
        Array.from({ length: diceCount }, () => Math.floor(Math.random() * 20) + 1),
      );
    }, 50);
    flickerRef.current = flickerInterval;

    // After 1.5 s, settle on real values
    rollSettleRef.current = setTimeout(() => {
      clearInterval(flickerInterval);
      flickerRef.current = null;
      setDisplayedDice(d20Result.rolls);
      setFlickering(false);

      // Auto-advance to modifier stage after 1 s pause
      autoAdvanceRef.current = setTimeout(() => {
        setStage('modifier');
      }, 1000);
    }, 1500);
  }, [difficulty, situation, attrValue, modifiers]);

  /* ================================================================
   *  Stage 3 : sequential modifier reveal
   * ================================================================ */
  useEffect(() => {
    if (stage !== 'modifier' || !result) return;

    // Parts: activeRoll, attrModifier, ...extraModifiers, "= total"
    // Total count = 1 (roll) + 1 (attr) + extras + 1 (total) = extras.length + 3
    const totalParts = result.extraModifiers.length + 3;
    setVisibleParts(0);

    let currentPart = 0;
    const revealNext = () => {
      currentPart += 1;
      setVisibleParts(currentPart);
      if (currentPart < totalParts) {
        modPartTimerRef.current = setTimeout(revealNext, 200);
      } else {
        // All parts visible — auto-advance after 1 s
        autoAdvanceRef.current = setTimeout(() => {
          setStage('conclusion');
        }, 1000);
      }
    };

    modPartTimerRef.current = setTimeout(revealNext, 200);

    return () => {
      if (modPartTimerRef.current) clearTimeout(modPartTimerRef.current);
      if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
    };
  }, [stage, result]);

  /* ================================================================
   *  Render helpers
   * ================================================================ */
  const attrLabel = ATTR_LABELS[attrKey];

  /** Whether a given die index is the "active" one (highlighted). */
  function isActiveDie(index: number): boolean {
    if (!result || result.rolls.length === 1) return false;
    // Use index-based: for advantage take max, for disadvantage take min
    if (situation === 'advantage') {
      const maxVal = Math.max(...result.rolls);
      const maxIdx = result.rolls.indexOf(maxVal);
      return index === maxIdx;
    } else {
      const minVal = Math.min(...result.rolls);
      const minIdx = result.rolls.indexOf(minVal);
      return index === minIdx;
    }
  }

  /* ================================================================
   *  Render
   * ================================================================ */
  return (
    <div className="w-full max-w-sm mx-auto p-6 border border-stone-300 rounded font-serif text-stone-800">
      {/* ──────── Stage 1: Data ──────── */}
      {stage === 'data' && (
        <div className="space-y-3 text-center">
          <p className="text-lg font-bold">技能检定</p>

          <div className="space-y-1 text-sm">
            <p>
              难度：<span className="font-bold">{difficulty}</span>
            </p>
            {situation !== 'normal' && (
              <p>
                判定状态：
                <span
                  className={
                    situation === 'advantage' ? 'text-red-800 font-bold' : 'text-stone-500 font-bold'
                  }
                >
                  {SITUATION_LABELS[situation]}
                </span>
              </p>
            )}
            <p>
              检定属性：{attrLabel}{' '}
              <span className="font-bold">{attrValue}</span>
              <span className="text-stone-500 text-xs ml-1">
                ({signed(attrValue - 10)})
              </span>
            </p>
            {modifiers.length > 0 && (
              <div>
                <p className="text-stone-500">额外修正：</p>
                {modifiers.map((m, i) => (
                  <p key={i} className="text-xs text-stone-600">
                    {m.label}：{signed(m.value)}
                  </p>
                ))}
              </div>
            )}
          </div>

          <button
            className="mt-4 px-6 py-2 border border-stone-400 rounded hover:bg-stone-100 font-serif text-stone-700"
            onClick={handleRollClick}
          >
            掷骰
          </button>
        </div>
      )}

      {/* ──────── Stage 2: Roll ──────── */}
      {stage === 'roll' && (
        <div className="space-y-4 text-center">
          <p className="text-sm text-stone-500">
            {situation === 'normal' ? '掷骰中…' : `掷骰中（${SITUATION_LABELS[situation]}，取两次）…`}
          </p>

          <div className="flex justify-center gap-4">
            {displayedDice.map((face, i) => {
              const active = !flickering && isActiveDie(i);
              return (
                <div
                  key={i}
                  className={[
                    'w-16 h-16 border-2 rounded flex items-center justify-center text-2xl font-bold transition-colors',
                    active
                      ? 'border-red-800 text-red-800'
                      : 'border-stone-400 text-stone-800',
                  ].join(' ')}
                >
                  {face}
                </div>
              );
            })}
          </div>

          {!flickering && result && result.rolls.length > 1 && (
            <p className="text-xs text-stone-500">
              {situation === 'advantage' ? '取较高值' : '取较低值'}：
              <span className="font-bold text-red-800">{result.activeRoll}</span>
            </p>
          )}
        </div>
      )}

      {/* ──────── Stage 3: Modifier ──────── */}
      {stage === 'modifier' && result && (
        <div className="space-y-3 text-center">
          <p className="text-sm text-stone-500">结算</p>

          <div className="flex flex-wrap items-center justify-center gap-1 text-lg">
            {/* Part 0: active roll */}
            {visibleParts >= 1 && (
              <span className="font-bold">{result.activeRoll}</span>
            )}
            {/* Part 1: attr modifier */}
            {visibleParts >= 2 && (
              <span>
                {' '}
                {signed(result.attrModifier)}
                <span className="text-xs text-stone-500 ml-0.5">
                  ({attrLabel})
                </span>
              </span>
            )}
            {/* Parts 2..N-2: extra modifiers */}
            {result.extraModifiers.map((m, i) =>
              visibleParts >= i + 3 ? (
                <span key={i}>
                  {' '}
                  {signed(m.value)}
                  <span className="text-xs text-stone-500 ml-0.5">
                    ({m.label})
                  </span>
                </span>
              ) : null,
            )}
            {/* Last part: = total */}
            {visibleParts >= result.extraModifiers.length + 3 && (
              <span>
                {' '}
                ={' '}
                <span className="font-bold text-red-800">{result.total}</span>
              </span>
            )}
          </div>
        </div>
      )}

      {/* ──────── Stage 4: Conclusion ──────── */}
      {stage === 'conclusion' && result && (
        <div className="space-y-4 text-center">
          <p className="text-sm text-stone-500">
            <span className="font-bold text-stone-800">{result.total}</span>
            {' vs 难度 '}
            <span className="font-bold text-stone-800">{result.difficulty}</span>
          </p>

          <p
            className={[
              'text-3xl font-bold tracking-widest',
              result.success ? 'text-red-800' : 'text-stone-400',
            ].join(' ')}
          >
            {result.success ? '成功' : '失败'}
          </p>

          <button
            className="mt-2 px-6 py-2 border border-stone-400 rounded hover:bg-stone-100 font-serif text-stone-700"
            onClick={() => onResult(result.success, result.total)}
          >
            继续
          </button>
        </div>
      )}
    </div>
  );
}
