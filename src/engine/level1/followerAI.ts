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
    const preference = follower.taskPreferences[task] ?? 0;
    const situational = situationalScore(task, stats, conditions);
    const intWeight = follower.attrs.intelligence / 20;
    scores[task] = preference * (1 - intWeight) + situational * intWeight;
  }

  let best: PrimaryTaskType = 'patrol';
  let bestScore = -Infinity;
  for (const task of ALL_TASKS) {
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
 * Returns a score 0–10. Thresholds scaled for v2 stats.
 */
function situationalScore(
  task: PrimaryTaskType,
  stats: GameStats,
  _conditions: LevelConditions,
): number {
  const t = stats.territory;

  switch (task) {
    case 'recruit':
      return t.military < 3000 ? 9 : t.military < 6000 ? 5 : 2;

    case 'train':
      return t.training < 40 ? 7 : t.training < 70 ? 4 : 1;

    case 'forage': {
      const rationDays = t.military > 0 ? t.rations / t.military : 999;
      return rationDays < 15 ? 10 : rationDays < 30 ? 7 : rationDays < 60 ? 3 : 1;
    }

    case 'tax':
      return t.gold < 1000 ? 8 : t.gold < 3000 ? 4 : 1;

    case 'patrol':
      return t.support < 30 ? 9 : t.support < 50 ? 5 : 2;

    case 'bodyguard':
      return t.support < 30 ? 8 : t.support < 50 ? 4 : 1;
  }
}
