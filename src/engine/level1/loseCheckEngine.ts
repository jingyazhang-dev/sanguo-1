import type { GameStats, LevelConditions, LoseReason } from '../../types/level1Types';
import {
  LOCAL_ASSASSIN_SUPPORT_THRESHOLD,
  CHENDENG_ASSASSIN_PROBABILITY,
  CHENDENG_ASSASSIN_SUPPORT_THRESHOLD,
  CHENDENG_HOSTILE_THRESHOLD,
  TOTAL_ROUNDS,
  FINAL_D20_MIZHU_GIFTED_GOLD_MODIFIER,
  FINAL_D20_MIZHU_MARRIAGE_MODIFIER,
  FINAL_D20_CHENDENG_RATIONS_MODIFIER,
  FINAL_D20_CHENDENG_SUPPORT_MODIFIER,
  finalMilitaryModifier,
  finalPublicOpinionModifier,
} from './constants';
import { combatPower } from '../../types/level1Types';

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
 * Once-per-round assassin encounter check.
 * Chen Deng assassin: hostile + low support → 50% chance.
 * Local assassin: low support → (30 - support) / 30 chance.
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
    if (Math.random() < CHENDENG_ASSASSIN_PROBABILITY) {
      return 'assassin_chen';
    }
  }

  // Local assassin — low support
  if (stats.territory.support < LOCAL_ASSASSIN_SUPPORT_THRESHOLD) {
    const chance = (LOCAL_ASSASSIN_SUPPORT_THRESHOLD - stats.territory.support) / 30;
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
 * Determine the Chen Deng hostile flag.
 * V2: hostile when rel ≤ 50 AND support < 30.
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
 * V2: uses miZhuGiftedGold / miZhuMarriage instead of old progression.
 */
export function buildFinalD20Modifiers(
  conditions: LevelConditions,
  stats: GameStats,
): { label: string; value: number }[] {
  const mods: { label: string; value: number }[] = [];

  // Mi Zhu's support (marriage > gift)
  if (conditions.miZhuMarriage) {
    mods.push({ label: '糜竺联姻', value: FINAL_D20_MIZHU_MARRIAGE_MODIFIER });
  } else if (conditions.miZhuGiftedGold) {
    mods.push({ label: '糜竺赠金', value: FINAL_D20_MIZHU_GIFTED_GOLD_MODIFIER });
  }

  // Chen Deng's support (promised > rations)
  if (conditions.chenDengPromisedSupport) {
    mods.push({ label: '陈登支持', value: FINAL_D20_CHENDENG_SUPPORT_MODIFIER });
  } else if (conditions.chenDengRationsSupport) {
    mods.push({ label: '陈登粮草', value: FINAL_D20_CHENDENG_RATIONS_MODIFIER });
  }

  // Military power — derived from (training + equipment) / 2
  const cp = combatPower(stats.territory);
  const milMod = finalMilitaryModifier(cp);
  if (milMod > 0) {
    mods.push({ label: '军事实力', value: milMod });
  }

  // Public opinion
  const opinionMod = finalPublicOpinionModifier(stats.reputation);
  if (opinionMod > 0) {
    mods.push({ label: '公论声望', value: opinionMod });
  }

  return mods;
}
