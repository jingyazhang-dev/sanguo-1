import type { GameStats, LevelConditions, LoseReason } from '../../types/level1Types';
import {
  LOCAL_ASSASSIN_SUPPORT_THRESHOLD,
  CHENDENG_ASSASSIN_SUPPORT_THRESHOLD,
  CHENDENG_HOSTILE_THRESHOLD,
  TOTAL_ROUNDS,
} from './constants';

/**
 * Check for deterministic lose conditions after stat changes.
 * Only checks mutiny (rations exhausted). Assassin checks are deliberate
 * once-per-round events handled by `checkAssassinEncounter`.
 */
export function checkLoseConditions(
  stats: GameStats,
  conditions: LevelConditions,
  _round: number,
): LoseReason | null {
  if (conditions.loseReason || conditions.won) return null;

  // Army mutiny — rations ran out
  if (stats.territory.rations <= 0 && stats.territory.military > 0) {
    return 'mutiny';
  }

  return null;
}

/**
 * Once-per-round assassin encounter check. Should be called exactly once
 * at the end of each round (settlement phase). Returns the assassin type
 * if an encounter is triggered, or null if the round is safe.
 *
 * The encounter result must be resolved via a D20 check in the UI layer;
 * this function only determines *if* an assassin appears.
 */
export function checkAssassinEncounter(
  stats: GameStats,
  conditions: LevelConditions,
): 'assassin_local' | 'assassin_chen' | null {
  if (conditions.loseReason || conditions.won) return null;

  // Chen Deng assassin — hostile + low support (checked first; deadlier)
  if (
    conditions.chenDengHostile &&
    stats.territory.support < CHENDENG_ASSASSIN_SUPPORT_THRESHOLD
  ) {
    if (Math.random() < 0.15) {
      return 'assassin_chen';
    }
  }

  // Local assassin — low support
  if (stats.territory.support < LOCAL_ASSASSIN_SUPPORT_THRESHOLD) {
    const chance = (LOCAL_ASSASSIN_SUPPORT_THRESHOLD - stats.territory.support) / 100;
    if (Math.random() < chance) {
      return 'assassin_local';
    }
  }

  return null;
}

/** D20 difficulty for fending off an assassin. */
export const ASSASSIN_D20_DIFFICULTY: Record<'assassin_local' | 'assassin_chen', number> = {
  assassin_local: 12,
  assassin_chen: 16,
};

/**
 * Determine the Chen Deng hostile flag based on relationship.
 * Should be called after updating Chen Deng's relationship.
 */
export function shouldChenDengBeHostile(
  chenDengRelationship: number,
  support: number,
): boolean {
  return (
    chenDengRelationship <= CHENDENG_HOSTILE_THRESHOLD &&
    support < CHENDENG_ASSASSIN_SUPPORT_THRESHOLD
  );
}

/**
 * Check if it's the final round and return true if the Tao Qian event should fire.
 */
export function isFinalRound(round: number): boolean {
  return round >= TOTAL_ROUNDS;
}

/**
 * Build the modifiers array for the final Xuzhou D20 check.
 */
export function buildFinalD20Modifiers(
  conditions: LevelConditions,
  stats: GameStats,
): { label: string; value: number }[] {
  const mods: { label: string; value: number }[] = [];

  // Mi Zhu's support
  if (conditions.miZhuJoined) {
    mods.push({ label: '糜竺归附', value: 3 });
  } else if (conditions.miZhuPromisedSupport) {
    mods.push({ label: '糜竺支持', value: 2 });
  }

  // Chen Deng's support
  if (conditions.chenDengPromisedSupport) {
    mods.push({ label: '陈登支持', value: 3 });
  } else if (conditions.chenDengRationsSupport) {
    mods.push({ label: '陈登粮草', value: 1 });
  }

  // Military power
  const combatPow = (stats.territory.training + stats.territory.equipment) * 5;
  const milMod = Math.min(5, Math.floor(combatPow / 20));
  if (milMod > 0) {
    mods.push({ label: '军事实力', value: milMod });
  }

  // Public opinion
  const opinionMod = Math.floor((stats.publicOpinion.morality + stats.publicOpinion.talent) / 40);
  if (opinionMod > 0) {
    mods.push({ label: '公论声望', value: Math.min(3, opinionMod) });
  }

  return mods;
}
