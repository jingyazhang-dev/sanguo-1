import type { PlayerAttrs } from '../../types/player';
import type {
  PatrolEventV2,
  PatrolEventOption,
  StatsDelta,
} from '../../types/level1Types';

/* ── Event selection ──────────────────────────────────────── */

/**
 * Select a patrol event: 20% chance for rare pool, 80% for normal.
 * Falls back to the other pool if the selected one is exhausted.
 */
export function selectPatrolEvent(
  events: PatrolEventV2[],
  usedEventIds: string[],
): PatrolEventV2 | null {
  const used = new Set(usedEventIds);
  const normal = events.filter((e) => !e.rare && !used.has(e.id));
  const rare   = events.filter((e) =>  e.rare && !used.has(e.id));

  const useRare = Math.random() < 0.2;
  const primary   = useRare ? rare   : normal;
  const secondary = useRare ? normal : rare;

  const pool = primary.length > 0 ? primary : secondary;
  if (pool.length === 0) return null;

  return pool[Math.floor(Math.random() * pool.length)];
}

/* ── Companion bonus ──────────────────────────────────────── */

/**
 * Calculate companion bonus for a D20 patrol option.
 * Bonus = floor(follower.attrs[attrKey] / 5)
 */
export function getCompanionBonus(
  followerAttrs: PlayerAttrs,
  attrKey: keyof PlayerAttrs,
): number {
  return Math.floor(followerAttrs[attrKey] / 5);
}

/* ── Option display formatting ────────────────────────────── */

const ATTR_LABELS: Record<keyof PlayerAttrs, string> = {
  strength: '武力',
  intelligence: '智谋',
  charisma: '魅力',
};

/**
 * Format a patrol option's display text.
 * D20 options: "(属性 - 成功：X, 失败：Y)"
 * Plain options: stat delta description.
 */
export function formatOptionDisplay(option: PatrolEventOption): string {
  if (option.d20Check) {
    const attrLabel = ATTR_LABELS[option.d20Check.attrKey] ?? option.d20Check.attrKey;
    const success = formatStatsDelta(option.d20Check.successStatsDelta ?? {});
    const failure = formatStatsDelta(option.d20Check.failureStatsDelta ?? {});
    return `(${attrLabel} - 成功：${success}, 失败：${failure})`;
  }
  return formatStatsDelta(option.statsDelta);
}

/* ── Helpers ──────────────────────────────────────────────── */

const STAT_LABELS: Record<string, string> = {
  reputation: '声望',
  military:  '兵力',
  training:  '操练',
  equipment: '装备',
  rations:   '粮草',
  gold:      '金',
  support:   '民心',
};

function formatStatsDelta(delta: StatsDelta): string {
  const parts: string[] = [];
  for (const [key, val] of Object.entries(delta as Record<string, number | undefined>)) {
    if (val == null || val === 0) continue;
    const label = STAT_LABELS[key] ?? key;
    const sign = val > 0 ? '+' : '';
    parts.push(`${label}${sign}${val}`);
  }
  return parts.length > 0 ? parts.join(', ') : '无';
}
