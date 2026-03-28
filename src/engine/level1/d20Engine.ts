import type { D20Situation, D20Modifier } from '../../types/level1Types';

/* ── Result type ──────────────────────────────────────────── */

export interface D20Result {
  /** Raw rolls: 1 element for normal, 2 for advantage/disadvantage. */
  rolls: number[];
  /** The roll that counts (max for advantage, min for disadvantage). */
  activeRoll: number;
  /** Attribute modifier: attrValue − 10. */
  attrModifier: number;
  /** Extra modifiers passed in from the caller. */
  extraModifiers: D20Modifier[];
  /** activeRoll + attrModifier + Σ extraModifiers.value */
  total: number;
  /** The DC that was set for this check. */
  difficulty: number;
  /** Whether total ≥ difficulty. */
  success: boolean;
}

/* ── Public helpers ───────────────────────────────────────── */

/** Return a uniform-random integer in [1, 20]. */
export function rollD20(): number {
  return Math.floor(Math.random() * 20) + 1;
}

/** Attribute modifier = raw value − 10. */
export function calculateModifier(attrValue: number): number {
  return attrValue - 10;
}

/* ── Core resolver ────────────────────────────────────────── */

export function resolveD20Check(config: {
  difficulty: number;
  situation: D20Situation;
  attrValue: number;
  modifiers: D20Modifier[];
}): D20Result {
  const { difficulty, situation, attrValue, modifiers } = config;

  // Roll dice
  const rolls: number[] =
    situation === 'normal' ? [rollD20()] : [rollD20(), rollD20()];

  // Pick the active roll
  let activeRoll: number;
  if (situation === 'advantage') {
    activeRoll = Math.max(...rolls);
  } else if (situation === 'disadvantage') {
    activeRoll = Math.min(...rolls);
  } else {
    activeRoll = rolls[0];
  }

  const attrModifier = calculateModifier(attrValue);
  const extraSum = modifiers.reduce((sum, m) => sum + m.value, 0);
  const total = activeRoll + attrModifier + extraSum;

  return {
    rolls,
    activeRoll,
    attrModifier,
    extraModifiers: modifiers,
    total,
    difficulty,
    success: total >= difficulty,
  };
}
