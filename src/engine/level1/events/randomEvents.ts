import type { GameEvent, GameStats, LevelConditions } from '../../../types/level1Types';

/**
 * Random events pool for patrol (查访民情) and general start/end events.
 *
 * Each event has a `hintCategory` for Ms. Gan's hint system.
 * Categories: 'bandit' | 'famine' | 'trade' | 'refugee' | 'dispute' | 'plague' | 'talent' | 'ceremony'
 */

export type HintCategory =
  | 'bandit'
  | 'famine'
  | 'trade'
  | 'refugee'
  | 'dispute'
  | 'plague'
  | 'talent'
  | 'ceremony';

export const RANDOM_PATROL_EVENTS: GameEvent[] = [
  {
    id: 'patrol-bandit-1',
    phase: 'start',
    hintCategory: 'bandit',
    narrative: ['官道转角处，一伙面目狰狞的山贼横刀拦路，为首者虬髯如戟，冷笑着打量你的队伍。'],
    d20Check: {
      difficulty: 12,
      situation: 'normal',
      attrKey: 'strength',
      modifiers: [],
      successNarrative: '双剑出鞘如电光裂空，山贼纷纷抱头鼠窜，遗落的辎重堆满路旁。',
      failureNarrative: '贼众悍不畏死，缠斗半日方得脱身，士卒折损数人，军心微沮。',
      successStatsDelta: { funds: 200, support: 3 },
      failureStatsDelta: { military: -20, morale: -5 },
    },
  },
  {
    id: 'patrol-bandit-2',
    phase: 'start',
    hintCategory: 'bandit',
    narrative: ['急报传来——邻村遭贼寇劫掠，炊烟尽熄，隐约可闻哭号之声。'],
    d20Check: {
      difficulty: 10,
      situation: 'normal',
      attrKey: 'strength',
      modifiers: [],
      successNarrative: '伏兵四起，贼寇尽数就擒，村民扶老携幼跪谢于道。',
      failureNarrative: '贼寇闻风先遁，村中已是一片狼藉，百姓望着你的背影暗自摇头。',
      successStatsDelta: { support: 5, morale: 3 },
      failureStatsDelta: { support: -3 },
    },
  },
  {
    id: 'patrol-famine-1',
    phase: 'start',
    hintCategory: 'famine',
    narrative: ['行经一处村落，但见田亩龟裂、禾苗枯萎，面黄肌瘦的乡民蹲坐墙根，目光空洞。'],
    d20Check: {
      difficulty: 13,
      situation: 'normal',
      attrKey: 'intelligence',
      modifiers: [],
      successNarrative: '你召集里长，开仓放粮、编排互助，村中老幼终得一碗热粥果腹。',
      failureNarrative: '粮少人多，赈济犹如杯水车薪，夜风中仍传来阵阵饥啼。',
      successStatsDelta: { support: 5, rations: -500 },
      failureStatsDelta: { support: -3, morale: -2 },
    },
  },
  {
    id: 'patrol-trade-1',
    phase: 'start',
    hintCategory: 'trade',
    narrative: ['沛县城关外，一队驼铃叮当的行商正在卸货歇脚，带来了南方的盐粮与布匹。'],
    statsDelta: { funds: -200, rations: 1000 },
    triggerCondition: (_stats: GameStats, _cond: LevelConditions) => {
      return _stats.territory.funds >= 200;
    },
  },
  {
    id: 'patrol-trade-2',
    phase: 'start',
    hintCategory: 'trade',
    narrative: ['黄昏时分，一名行脚商人风尘仆仆叩营求见，自言辗转千里，携有精铁打造的军械。'],
    statsDelta: { funds: -300, equipment: 1 },
    triggerCondition: (_stats: GameStats, _cond: LevelConditions) => {
      return _stats.territory.funds >= 300;
    },
  },
  {
    id: 'patrol-refugee-1',
    phase: 'start',
    hintCategory: 'refugee',
    narrative: ['官道尽头，一群衣衫褴褛的流民蹒跚而来，老幼相扶，目中尽是哀恳之色。'],
    d20Check: {
      difficulty: 11,
      situation: 'normal',
      attrKey: 'charisma',
      modifiers: [],
      successNarrative: '你命人搭棚施粥、登记户籍，流民中青壮者纷纷请缨从军，以报收容之恩。',
      failureNarrative: '流民如惊弓之鸟，未及安置便四散而去，只余几行足印在泥路上。',
      successStatsDelta: { military: 50, support: 3 },
      failureStatsDelta: { support: -2 },
    },
  },
  {
    id: 'patrol-refugee-2',
    phase: 'start',
    hintCategory: 'refugee',
    narrative: ['战火波及数县，逃难的百姓扶老携幼涌至小沛城下，恳请开门收容。'],
    d20Check: {
      difficulty: 12,
      situation: 'normal',
      attrKey: 'charisma',
      modifiers: [],
      successNarrative: '你亲至城门迎接，分拨屋舍、发放口粮，难民感泣叩首，誓愿效死。',
      failureNarrative: '难民如潮水涌入，营中粮草告急、帐篷不敷，怨声与哭声此起彼伏。',
      successStatsDelta: { military: 30, support: 5, rations: -300 },
      failureStatsDelta: { morale: -3, support: -2 },
    },
  },
  {
    id: 'patrol-dispute-1',
    phase: 'start',
    hintCategory: 'dispute',
    narrative: ['两户乡民怒目相向、各执一词，为几亩薄田的界桩闹到营前，请你主持公道。'],
    d20Check: {
      difficulty: 11,
      situation: 'normal',
      attrKey: 'intelligence',
      modifiers: [],
      successNarrative: '你细审地契、询明邻里，判词晓畅入理，两家拱手称谢，各自心服。',
      failureNarrative: '判词未能两全，败诉一方拂袖而去，乡间已有怨言暗暗传开。',
      successStatsDelta: { support: 5, morality: 3 },
      failureStatsDelta: { support: -3 },
    },
  },
  {
    id: 'patrol-dispute-2',
    phase: 'start',
    hintCategory: 'dispute',
    narrative: ['市集中忽起喧哗，两名壮汉扭打在一处，摊贩货物散落满地，人群慌忙四避。'],
    d20Check: {
      difficulty: 10,
      situation: 'normal',
      attrKey: 'strength',
      modifiers: [],
      successNarrative: '你拨开人群、一声断喝，二人慑于威势伏地请罪，市井秩序须臾恢复。',
      failureNarrative: '骚乱愈演愈烈，有人趁乱哄抢，待秩序平息时已折损不少货资。',
      successStatsDelta: { support: 3 },
      failureStatsDelta: { funds: -100, support: -2 },
    },
  },
  {
    id: 'patrol-plague-1',
    phase: 'start',
    hintCategory: 'plague',
    narrative: ['军营东帐传出阵阵咳声，数名士卒面色灰败、浑身发热——疫病已悄然蔓延开来。'],
    d20Check: {
      difficulty: 14,
      situation: 'normal',
      attrKey: 'intelligence',
      modifiers: [],
      successNarrative: '你翻阅医典、遍采山间草药，亲手熬汤逐帐分发，三日后疫势终得遏止。',
      failureNarrative: '疫病来势凶猛，隔离不及，倒下的士卒日渐增多，营中弥漫着不安与颓丧。',
      successStatsDelta: { morale: 5 },
      failureStatsDelta: { military: -30, morale: -8 },
    },
  },
  {
    id: 'patrol-talent-1',
    phase: 'start',
    hintCategory: 'talent',
    narrative: ['乡人传言，南山竹林深处有一隐士，博通经史、精于韬略，素不见客。'],
    d20Check: {
      difficulty: 13,
      situation: 'normal',
      attrKey: 'charisma',
      modifiers: [],
      successNarrative: '你三叩柴扉、言辞恳切，隐士终为诚意所动，抚须长叹，倾囊相授治军方略。',
      failureNarrative: '竹林深处柴门紧闭，童子传话道"先生不问世事"，你只得怅然而归。',
      successStatsDelta: { talent: 5, training: 1 },
      failureStatsDelta: {},
    },
  },
  {
    id: 'patrol-ceremony-1',
    phase: 'start',
    hintCategory: 'ceremony',
    narrative: ['秋收将近，乡中长者焚香设案，恭请你主持社稷祭礼，以祈五谷丰登。'],
    d20Check: {
      difficulty: 10,
      situation: 'normal',
      attrKey: 'charisma',
      modifiers: [],
      successNarrative: '祭辞铿锵、礼仪庄重，百姓目中含泪，伏拜之间对你的敬意更深了三分。',
      failureNarrative: '祭礼行至半途忽起怪风、灯烛尽灭，乡人面面相觑，私下议论此为不祥之兆。',
      successStatsDelta: { support: 5, morality: 3 },
      failureStatsDelta: { support: -2, morality: -2 },
    },
  },
  {
    id: 'patrol-famine-2',
    phase: 'start',
    hintCategory: 'famine',
    narrative: ['清点仓廪时发觉一角粮袋霉斑遍布，掀开细看，陈粮已尽数腐坏，不堪食用。'],
    statsDelta: { rations: -500 },
  },
  {
    id: 'patrol-talent-2',
    phase: 'start',
    hintCategory: 'talent',
    narrative: ['一名青衫士人策杖而来，自言游学四方，久闻刘使君仁义之名，特来一晤。'],
    d20Check: {
      difficulty: 11,
      situation: 'normal',
      attrKey: 'charisma',
      modifiers: [],
      successNarrative: '你与士人秉烛夜谈、纵论天下，士人击案叹服，誓为你奔走扬名于士林。',
      failureNarrative: '席间谈及时局，你的见解未能令士人信服，他拱手辞去时面露惋惜之色。',
      successStatsDelta: { talent: 5 },
      failureStatsDelta: { talent: -2 },
    },
  },
  {
    id: 'patrol-ceremony-2',
    phase: 'start',
    hintCategory: 'ceremony',
    narrative: ['城中父老抬着酒坛与蒸饼，自发前来犒劳将士，欢声笑语在营帐间回荡。'],
    statsDelta: { morale: 5, rations: 200 },
  },
];

/**
 * Select a random patrol event that is valid given current state.
 * Returns the event and its index, or null if no events are available.
 */
export function selectRandomPatrolEvent(
  stats: GameStats,
  conditions: LevelConditions,
  round: number,
  excludeIds?: Set<string>,
): GameEvent | null {
  const candidates = RANDOM_PATROL_EVENTS.filter((e) => {
    if (excludeIds?.has(e.id)) return false;
    if (e.triggerCondition && !e.triggerCondition(stats, conditions, round)) return false;
    return true;
  });

  if (candidates.length === 0) return null;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

/**
 * Select a random event suitable for round start/end (non-patrol context).
 * Uses a subset of the pool that doesn't require specific trigger conditions.
 */
export function selectRandomRoundEvent(
  _stats: GameStats,
  _conditions: LevelConditions,
  _round: number,
): GameEvent | null {
  // Use events without trigger conditions for general round events
  // (lower probability — only 30% chance of a random round event)
  if (Math.random() > 0.3) return null;

  const candidates = RANDOM_PATROL_EVENTS.filter((e) => {
    if (e.triggerCondition) return false; // skip conditional ones
    return true;
  });

  if (candidates.length === 0) return null;
  return candidates[Math.floor(Math.random() * candidates.length)];
}
