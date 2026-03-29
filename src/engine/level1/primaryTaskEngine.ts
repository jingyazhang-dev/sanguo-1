import type {
  PrimaryTaskType,
  PrimaryTaskResult,
  Follower,
  GameStats,
} from '../../types/level1Types';

/**
 * Calculate the result of a primary task performed by a follower.
 * V2 formulas: simplified, no gold-spending bonus for recruit.
 */
export function calculateTaskResult(
  task: PrimaryTaskType,
  follower: Follower,
  _stats: GameStats,
  _round: number,
): PrimaryTaskResult {
  const { intelligence, charisma } = follower.attrs;

  switch (task) {
    case 'recruit': {
      const gained = 100 + charisma * 3;
      return {
        followerId: follower.id,
        task,
        narrative: `${follower.name}凭一腔热忱奔走乡里，以刘使君仁义之名召集了一批壮丁应募。`,
        statsDelta: { military: gained },
      };
    }

    case 'train':
      return {
        followerId: follower.id,
        task,
        narrative: `${follower.name}于校场操演阵法、严督刀枪，一番苦练下来，兵士行伍渐有章法。`,
        statsDelta: { training: 10 },
      };

    case 'forage':
      return {
        followerId: follower.id,
        task,
        narrative: `${follower.name}率队深入乡野征收粮秣，车马满载而归，然村中百姓望着空了大半的谷仓，面露难色。`,
        statsDelta: { rations: 2000, support: -5 },
      };

    case 'tax':
      return {
        followerId: follower.id,
        task,
        narrative: `${follower.name}挨户清点田亩、征收赋税，府库虽得充盈，里巷间却已怨声渐起。`,
        statsDelta: { gold: 200 + intelligence * 20, support: -5 },
      };

    case 'patrol':
      return {
        followerId: follower.id,
        task,
        narrative: `${follower.name}提刀巡行街巷，查处不法、平息口角，百姓纷纷开门致谢，称颂刘使君治下太平。`,
        statsDelta: { support: 5 },
      };

    case 'bodyguard':
      return {
        followerId: follower.id,
        task,
        narrative: `${follower.name}按剑侍立、寸步不离，凛然之姿令宵小之辈望而却步，不敢轻举妄动。`,
        statsDelta: {},
        conditionChanges: { hasBodyguard: true },
      };
  }
}
