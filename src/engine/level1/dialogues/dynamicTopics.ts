import type {
  DynamicTopicDef,
  DynamicTopicResponse,
} from '../../../types/level1Types';

/* ── Dynamic topic definitions ────────────────────────────── */

export const DYNAMIC_TOPIC_DEFS: DynamicTopicDef[] = [
  {
    id: 'urgent-rations',
    label: '急需军粮',
    triggerCondition: (stats) => {
      const { military, rations } = stats.territory;
      return military > 0 && rations / military <= 30;
    },
    removeCondition: (stats) => {
      const { military, rations } = stats.territory;
      return military === 0 || rations / military > 30;
    },
  },
  {
    id: 'meet-nobles',
    label: '结识士族',
    triggerCondition: (_stats, conditions) => conditions.triedVisitFailed,
    removeCondition: (_stats, conditions) =>
      conditions.kongRongUnlocked && conditions.miZhuUnlocked && conditions.chenDengUnlocked,
  },
];

/* ── Dynamic topic responses per follower ─────────────────── */

/** Key: `${topicId}:${followerId}` */
const RESPONSE_MAP: Record<string, DynamicTopicResponse> = {
  /* ── 急需军粮 ──────────────────────────────────────────────── */
  'urgent-rations:msgan': {
    followerId: 'msgan',
    lines: [
      '甘夫人蹙眉道："夫君，妾听闻军中粮草将尽。徐州富户不少，若能登门拜访，或可借得一些军粮应急。"',
    ],
    hasUsefulResponse: true,
  },
  'urgent-rations:jianyong': {
    followerId: 'jianyong',
    lines: [
      '简雍叹道："使君，军粮告急非小事。依雍之见，不妨加紧向百姓征粮，虽伤民心，总好过全军饿殍。"',
    ],
    hasUsefulResponse: true,
  },
  'urgent-rations:sunqian': {
    followerId: 'sunqian',
    lines: [
      '孙乾正色道："主公，粮草已不足月余之需。乾以为当即刻遣人征粮，宜早不宜迟。或可一面征粮一面节用，以延支撑。"',
    ],
    hasUsefulResponse: true,
  },
  'urgent-rations:guanyu': {
    followerId: 'guanyu',
    lines: [
      '关羽闻言沉默，半晌方道："兄长，粮草之事确实棘手。关某虽不善理财，但若需某带人四处筹措，绝无二话。"',
    ],
    hasUsefulResponse: false,
  },
  'urgent-rations:zhangfei': {
    followerId: 'zhangfei',
    lines: [
      '张飞瞪大了眼："啥？要断粮了？！大哥你早说啊！俺这就去……呃，去哪弄粮好呢？"',
    ],
    hasUsefulResponse: false,
  },

  /* ── 结识士族 ──────────────────────────────────────────────── */
  'meet-nobles:msgan': {
    followerId: 'msgan',
    lines: [
      '甘夫人思忖道："夫君，妾倒记得一人——北海孔融孔文举，乃当世大儒。若能得他引荐，徐州士族之门便可为夫君敞开。"',
    ],
    conditionChanges: { kongRongUnlocked: true },
    hasUsefulResponse: true,
  },
  'meet-nobles:sunqian': {
    followerId: 'sunqian',
    lines: [
      '孙乾拱手道："主公，乾在北海时与孔融有过数面之缘。孔文举品评天下人物，名望极重。主公若持帖前往，以诚意结纳，必能借其声名广结善缘。"',
    ],
    conditionChanges: { kongRongUnlocked: true },
    hasUsefulResponse: true,
  },
  'meet-nobles:jianyong': {
    followerId: 'jianyong',
    lines: [
      '简雍眼前一亮："使君，雍想起来了！徐州巨商糜竺糜子仲，家资巨万且为人仗义。还有广陵陈登陈元龙，治政之才无人能出其右。雍愿为使君引荐此二人！"',
    ],
    conditionChanges: { miZhuUnlocked: true, chenDengUnlocked: true },
    hasUsefulResponse: true,
  },
  'meet-nobles:guanyu': {
    followerId: 'guanyu',
    lines: [
      '关羽抱拳道："兄长，结交名士非关某所长。但兄长放心去便是，后方有关某守着，万无一失。"',
    ],
    hasUsefulResponse: false,
  },
  'meet-nobles:zhangfei': {
    followerId: 'zhangfei',
    lines: [
      '张飞挠头道："那些酸文人……大哥想去就去呗，俺可跟他们说不上话。不过要是有人敢给大哥脸色看，告诉俺，俺去教训他！"',
    ],
    hasUsefulResponse: false,
  },
};

/**
 * Look up a follower's response to a dynamic topic.
 */
export function getDynamicTopicResponseData(
  topicId: string,
  followerId: string,
): DynamicTopicResponse | null {
  return RESPONSE_MAP[`${topicId}:${followerId}`] ?? null;
}
