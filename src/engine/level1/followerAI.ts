import type {
  Follower,
  GameStats,
  LevelConditions,
  PrimaryTaskType,
} from '../../types/level1Types';
import { PRIMARY_TASK_LABELS } from '../../types/level1Types';

const ALL_TASKS: PrimaryTaskType[] = Object.keys(PRIMARY_TASK_LABELS) as PrimaryTaskType[];

/**
 * Propose a primary task for a follower based on personal preference and situation.
 * Higher-intelligence followers weigh situational need more heavily.
 */
export function proposeTask(
  follower: Follower,
  stats: GameStats,
  conditions: LevelConditions,
  _round: number,
): PrimaryTaskType {
  const scores: Record<string, number> = {};

  for (const task of ALL_TASKS) {
    // Base: personal preference (0 if not set)
    const preference = follower.taskPreferences[task] ?? 0;

    // Situational score (weighted by intelligence / 20)
    const situational = situationalScore(task, stats, conditions);
    const intWeight = follower.attrs.intelligence / 20;

    scores[task] = preference * (1 - intWeight) + situational * intWeight;
  }

  // Pick highest-scoring task
  let best: PrimaryTaskType = 'patrol';
  let bestScore = -Infinity;
  for (const task of ALL_TASKS) {
    // Add small random perturbation for variety
    const finalScore = scores[task] + Math.random() * 1.5;
    if (finalScore > bestScore) {
      bestScore = finalScore;
      best = task;
    }
  }

  return best;
}

/**
 * Heuristic: how urgently does the situation call for this task?
 * Returns a score 0–10.
 */
function situationalScore(
  task: PrimaryTaskType,
  stats: GameStats,
  conditions: LevelConditions,
): number {
  const t = stats.territory;

  switch (task) {
    case 'recruit':
      return t.military < 300 ? 9 : t.military < 600 ? 5 : 2;

    case 'train':
      return t.training < 4 ? 7 : t.training < 7 ? 4 : 1;

    case 'forage':
      // Ration urgency: days of rations left
      const rationDays = t.military > 0 ? t.rations / t.military : 999;
      return rationDays < 15 ? 10 : rationDays < 30 ? 7 : rationDays < 60 ? 3 : 1;

    case 'tax':
      return t.funds < 500 ? 8 : t.funds < 1500 ? 4 : 1;

    case 'patrol':
      return t.support < 30 ? 9 : t.support < 50 ? 5 : 2;

    case 'visitNoble':
      if (!conditions.kongRongUnlocked) return 3;
      if (!conditions.miZhuUnlocked || !conditions.chenDengUnlocked) return 5;
      return 1;

    case 'bodyguard':
      // Protect against assassinations when support is low
      return t.support < 30 ? 8 : t.support < 50 ? 4 : 1;
  }
}
