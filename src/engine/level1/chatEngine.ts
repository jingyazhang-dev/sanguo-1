import type {
  GameStats,
  LevelConditions,
  ChatTopicKind,
  ChatTopic,
  DynamicTopicDef,
  DynamicTopicResponse,
} from '../../types/level1Types';

/* ── Chat kind selection (闲谈) ───────────────────────────── */

/**
 * Weighted-random selection of chat topic kind.
 * P(situational) = min(intelligence/20, 0.6)
 * P(scripted) = (1 - P(situational)) × 1/3
 * P(narrative) = (1 - P(situational)) × 2/3
 * Only picks from kinds that have available topics.
 */
export function selectChatKind(
  intelligence: number,
  availableKinds: Set<ChatTopicKind>,
): ChatTopicKind | null {
  if (availableKinds.size === 0) return null;

  const pSit = Math.min(intelligence / 20, 0.6);
  const pNar = (1 - pSit) * (2 / 3);
  const pScr = (1 - pSit) * (1 / 3);

  // Build weighted pool from available kinds only
  const pool: { kind: ChatTopicKind; weight: number }[] = [];
  if (availableKinds.has('situational')) pool.push({ kind: 'situational', weight: pSit });
  if (availableKinds.has('narrative'))   pool.push({ kind: 'narrative',   weight: pNar });
  if (availableKinds.has('scripted'))    pool.push({ kind: 'scripted',    weight: pScr });

  if (pool.length === 0) return null;

  const totalWeight = pool.reduce((sum, p) => sum + p.weight, 0);
  let roll = Math.random() * totalWeight;
  for (const entry of pool) {
    roll -= entry.weight;
    if (roll <= 0) return entry.kind;
  }
  return pool[pool.length - 1].kind;
}

/* ── Topic selection ──────────────────────────────────────── */

/**
 * Get available chat topics for a follower of a given kind,
 * excluding already-used topics.
 */
export function getAvailableTopics(
  topics: ChatTopic[],
  kind: ChatTopicKind,
  usedTopicIds: string[],
  roundUsedTopicIds: string[],
  stats: GameStats,
  conditions: LevelConditions,
): ChatTopic[] {
  const allUsed = new Set([...usedTopicIds, ...roundUsedTopicIds]);
  return topics.filter((t) => {
    if (t.kind !== kind) return false;
    if (allUsed.has(t.id)) return false;
    if (t.kind === 'situational' && t.situationalCondition) {
      return t.situationalCondition(stats, conditions);
    }
    return true;
  });
}

/**
 * Select a single chat topic from a filtered pool.
 */
export function selectChatTopic(pool: ChatTopic[]): ChatTopic | null {
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Determine which chat kinds have available topics for a follower.
 */
export function getAvailableChatKinds(
  allTopics: ChatTopic[],
  usedTopicIds: string[],
  roundUsedTopicIds: string[],
  stats: GameStats,
  conditions: LevelConditions,
): Set<ChatTopicKind> {
  const kinds = new Set<ChatTopicKind>();
  for (const kind of ['scripted', 'narrative', 'situational'] as ChatTopicKind[]) {
    const available = getAvailableTopics(allTopics, kind, usedTopicIds, roundUsedTopicIds, stats, conditions);
    if (available.length > 0) kinds.add(kind);
  }
  return kinds;
}

/* ── Dynamic topics ───────────────────────────────────────── */

/**
 * Evaluate all dynamic topic definitions and return currently active ones.
 */
export function getActiveDynamicTopics(
  definitions: DynamicTopicDef[],
  stats: GameStats,
  conditions: LevelConditions,
): DynamicTopicDef[] {
  return definitions.filter(
    (d) => d.triggerCondition(stats, conditions) && !d.removeCondition(stats, conditions),
  );
}

/**
 * Get a follower's response to a dynamic topic.
 * Returns null if the follower has no defined response for this topic.
 */
export function getDynamicTopicResponse(
  responses: DynamicTopicResponse[],
  followerId: string,
  topicId: string,
): DynamicTopicResponse | null {
  return (
    responses.find((r) => r.followerId === followerId && topicId === topicId) ?? null
  );
}
