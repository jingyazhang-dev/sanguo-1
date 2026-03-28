import type {
  PrimaryTaskType,
  PrimaryTaskResult,
  Follower,
  GameStats,
} from '../../types/level1Types';

/**
 * Calculate the result of a primary task performed by a follower.
 * Effects are scaled by follower attributes.
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
      const baseMilitary = 30 + charisma * 3;
      const canSpend = _stats.territory.funds >= 200;
      return {
        followerId: follower.id,
        task,
        narrative: canSpend
          ? `${follower.name}于街市置酒设宴、广散钱帛，引得四方青壮纷纷投军效命。`
          : `${follower.name}凭一腔热忱奔走乡里，以刘使君仁义之名召集了一批壮丁应募。`,
        statsDelta: canSpend
          ? { military: baseMilitary + 20, funds: -200 }
          : { military: baseMilitary },
      };
    }

    case 'train': {
      const trainingGain =
        intelligence >= 12 ? 1 : Math.random() < 0.5 ? 1 : 0;
      return {
        followerId: follower.id,
        task,
        narrative: trainingGain > 0
          ? `${follower.name}于校场操演阵法、严督刀枪，一番苦练下来，兵士行伍渐有章法。`
          : `${follower.name}竭力督操练兵，奈何士卒根基尚浅，进展甚微。`,
        statsDelta: { training: trainingGain, morale: 3 },
      };
    }

    case 'forage':
      return {
        followerId: follower.id,
        task,
        narrative: `${follower.name}率队深入乡野征收粮秣，车马满载而归，然村中百姓望着空了大半的谷仓，面露难色。`,
        statsDelta: { rations: 800 + intelligence * 50, support: -2 },
      };

    case 'tax':
      return {
        followerId: follower.id,
        task,
        narrative: `${follower.name}挨户清点田亩、征收赋税，府库虽得充盈，里巷间却已怨声渐起。`,
        statsDelta: { funds: 200 + intelligence * 20, support: -3 },
      };

    case 'patrol':
      return {
        followerId: follower.id,
        task,
        narrative: `${follower.name}提刀巡行街巷，查处不法、平息口角，百姓纷纷开门致谢，称颂刘使君治下太平。`,
        statsDelta: {
          support: 3 + Math.floor(charisma / 5),
          morale: 2,
        },
      };

    case 'visitNoble':
      return {
        followerId: follower.id,
        task,
        narrative: `${follower.name}代主公持帖拜访乡中名士，品茶论道间纵谈天下大势，满载见闻而归。`,
        statsDelta: { talent: 2, morality: 1 },
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
