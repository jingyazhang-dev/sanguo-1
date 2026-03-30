import type {
  LevelConditions,
  ContactGreetingTiers,
  DialogueTopic,
  GameStats,
} from '../../types/level1Types';
import {
  GREETING_COLD,
  GREETING_NEUTRAL,
  GREETING_WARM,
  OPINION_GATE,
} from './constants';

/* ── Greeting selection ───────────────────────────────────── */

type GreetingTier = 'cold' | 'neutral' | 'warm' | 'close';

/**
 * Determine greeting tier from relationship value.
 */
export function getGreetingTier(relationship: number): GreetingTier {
  if (relationship < GREETING_COLD)   return 'cold';
  if (relationship < GREETING_NEUTRAL) return 'neutral';
  if (relationship < GREETING_WARM)    return 'warm';
  return 'close';
}

/**
 * Get a random greeting line for a contact based on relationship tier.
 */
export function getGreeting(
  tiers: ContactGreetingTiers,
  relationship: number,
): string {
  const tier = getGreetingTier(relationship);
  const lines = tiers[tier];
  return lines[Math.floor(Math.random() * lines.length)];
}

/* ── Topic pool management ────────────────────────────────── */

/**
 * Filter topic pool by availability and consumption state.
 */
export function getAvailableTopics(
  topics: DialogueTopic[],
  usedTopicIds: string[],
  conditions: LevelConditions,
  stats: GameStats,
  round: number,
  relationship?: number,
): DialogueTopic[] {
  const used = new Set(usedTopicIds);
  return topics.filter((t) => {
    if (used.has(t.id)) return false;
    if (t.available && !t.available(conditions, stats, round)) return false;
    if (t.minRelationship != null && relationship != null && relationship < t.minRelationship) return false;
    return true;
  });
}

/**
 * Select display topics for a contact.
 * Kong Rong: 5 (eval always present + 4 random).
 * Mi Zhu / Chen Deng: 3 random from pool.
 */
export function selectDisplayTopics(
  contactId: string,
  pool: DialogueTopic[],
  alwaysIncludeId?: string,
): DialogueTopic[] {
  const count = contactId === 'kongrong' ? 5 : 3;

  if (alwaysIncludeId) {
    const always = pool.find((t) => t.id === alwaysIncludeId);
    const rest = pool.filter((t) => t.id !== alwaysIncludeId);
    const shuffled = shuffleArray(rest);
    const selected = shuffled.slice(0, count - (always ? 1 : 0));
    // Shuffle the always-included topic into a random position
    return always ? shuffleArray([always, ...selected]) : selected;
  }

  return shuffleArray(pool).slice(0, count);
}

/* ── Opinion gate ─────────────────────────────────────────── */

/**
 * Check if the player can visit a contact.
 * Kong Rong requires only unlock; Mi Zhu / Chen Deng also require opinion gate.
 */
export function canVisitContact(
  contactId: string,
  conditions: LevelConditions,
  reputation: number,
): boolean {
  // Check unlock
  switch (contactId) {
    case 'kongrong':
      if (!conditions.kongRongUnlocked) return false;
      break;
    case 'mizhu':
      if (!conditions.miZhuUnlocked) return false;
      break;
    case 'chendeng':
      if (!conditions.chenDengUnlocked) return false;
      break;
    default:
      return false;
  }

  // Kong Rong has no opinion gate
  if (contactId === 'kongrong') return true;

  // Mi Zhu and Chen Deng require opinion gate
  return reputation >= OPINION_GATE;
}

/* ── Retryable topics ─────────────────────────────────────── */

/** Topic IDs that are NOT consumed when D20 fails (retryable). */
const RETRYABLE_TOPIC_IDS = new Set([
  'chendeng-rations',
  'chendeng-future-support',
]);

/**
 * Returns true if the topic should be kept (not consumed) when D20 fails.
 */
export function isRetryableOnD20Failure(topicId: string): boolean {
  return RETRYABLE_TOPIC_IDS.has(topicId);
}

/* ── Helpers ──────────────────────────────────────────────── */

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
