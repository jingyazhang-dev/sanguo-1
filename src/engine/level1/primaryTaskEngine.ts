import type {
  PrimaryTaskType,
  PrimaryTaskResult,
  Follower,
  GameStats,
} from '../../types/level1Types';

/**
 * Calculate the result of a primary task performed by a follower.
 * V2 formulas: simplified, no gold-spending bonus for recruit.
 * @param forageCount - number of forage collections already completed this level (for decay)
 */
export function calculateTaskResult(
  task: PrimaryTaskType,
  follower: Follower,
  _stats: GameStats,
  _round: number,
  forageCount: number = 0,
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

    case 'forage': {
      // Decay formula: 50000 * (1 + (charisma - 10) * 0.1) * 0.7^n, where n = forages done so far
      const forageRations = Math.floor(50000 * (1 + (charisma - 10) * 0.1) * 0.7 ** forageCount);
      let forageNarrative: string;
      if (forageCount === 0) {
        forageNarrative = `${follower.name}率队深入乡野征收粮秣，车马满载而归，然村中百姓望着空了大半的谷仓，面露难色。`;
      } else if (forageCount <= 2) {
        forageNarrative = `${follower.name}再度出征征粮，归来时车辆已不似从前那般满载，沿途村寨的谷仓愈发空瘪，百姓面有怨色，低声咒骂之声渐起。`;
      } else {
        forageNarrative = `${follower.name}搜遍周遭乡野，所得粮草寥寥无几。村庄十室九空，幸存的百姓神情冷漠，目送队伍离去时眼中已无一丝指望。`;
      }
      return {
        followerId: follower.id,
        task,
        narrative: forageNarrative,
        statsDelta: { rations: forageRations, support: -5 },
      };
    }

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
