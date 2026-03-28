import { STAT_IDIOMS } from './statIdioms';
import type { StatIdiomKey } from './statIdioms';

/* ── 10-level color classes (worst → best) ────────────────── */

const LEVEL_COLORS: readonly string[] = [
  'text-stat-1',   // dark red — worst
  'text-stat-2',   // red
  'text-stat-3',   // gray
  'text-stat-4',   // near-black
  'text-stat-5',   // dark green
  'text-stat-6',   // light green
  'text-stat-7',   // blue
  'text-stat-8',   // cyan
  'text-stat-9',   // orange
  'text-stat-10',  // golden — best
];

/* ── Thresholds per stat type ─────────────────────────────── */

/** For 0–100 percentage stats: morale, combatPower, support, morality, talent */
const PERCENT_THRESHOLDS = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90] as const;

/** Military headcount: ~200–2000 expected range */
const MILITARY_THRESHOLDS = [0, 200, 350, 500, 700, 900, 1100, 1400, 1700, 2000] as const;

/** Ration days of supply: 0–120 expected range */
const RATIONS_THRESHOLDS = [0, 5, 10, 15, 25, 35, 50, 70, 90, 110] as const;

/** Treasury funds: ~0–10000 expected range */
const FUNDS_THRESHOLDS = [0, 100, 300, 600, 1000, 1500, 2500, 4000, 6000, 8000] as const;

const THRESHOLDS: Record<StatIdiomKey, readonly number[]> = {
  morale:      PERCENT_THRESHOLDS,
  combatPower: PERCENT_THRESHOLDS,
  support:     PERCENT_THRESHOLDS,
  morality:    PERCENT_THRESHOLDS,
  talent:      PERCENT_THRESHOLDS,
  military:    MILITARY_THRESHOLDS,
  rations:     RATIONS_THRESHOLDS,
  funds:       FUNDS_THRESHOLDS,
};

/* ── Core function ────────────────────────────────────────── */

export interface StatDisplay {
  /** 1–10 level (1 = worst, 10 = best) */
  level: number;
  /** 4-character Chinese idiom describing the stat */
  idiom: string;
  /** Tailwind color class for the idiom text */
  colorClass: string;
}

/**
 * Given a stat key and its raw numeric value, returns the display info:
 * a 1–10 level, the corresponding idiom, and the Tailwind color class.
 */
export function getStatDisplay(key: StatIdiomKey, value: number): StatDisplay {
  const thresholds = THRESHOLDS[key];
  const idioms = STAT_IDIOMS[key];

  // Find the highest threshold the value meets or exceeds
  let level = 1;
  for (let i = thresholds.length - 1; i >= 0; i--) {
    if (value >= thresholds[i]) {
      level = i + 1;
      break;
    }
  }

  return {
    level,
    idiom: idioms[level - 1],
    colorClass: LEVEL_COLORS[level - 1],
  };
}

/* ── Full stat label mapping ──────────────────────────────── */

export const STAT_LABELS: Record<StatIdiomKey, string> = {
  morale:      '士气',
  combatPower: '战力',
  support:     '民心',
  morality:    '德行',
  talent:      '才学',
  military:    '兵力',
  rations:     '粮草',
  funds:       '钱粮',
};
