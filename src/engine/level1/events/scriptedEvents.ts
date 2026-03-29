import type { GameEvent, ConditionBasedEvent, AristocraticContact, LevelConditions } from '../../../types/level1Types';
import { MIZHU_GIFT_THRESHOLD, MIZHU_MARRIAGE_THRESHOLD } from '../constants';

/**
 * Scripted events that fire at specific rounds.
 */

export const SCRIPTED_START_EVENTS: GameEvent[] = [
  /* ── Round 1 ────────────────────────────────────────────── */
  {
    id: 'r1-start-arrival',
    round: 1,
    phase: 'start',
    narrative: [
      '晨雾未散，小沛城门在薄纱般的白雾中缓缓显出轮廓。刘备勒马驻足，望着这座破旧的小城——城墙斑驳，瓮城坍了半边，街巷冷冷清清，不见几个人影。这便是陶恭祖划拨的驻地，这便是一切的起点。',
      '关羽捋髯不语，张飞忍不住低声咒骂了一句。简雍与孙乾对视一眼，皆面色凝重。五百疲卒、不足月余的军粮、一座半废的县城——就凭这些，要在徐州站稳脚跟？',
    ],
  },

  /* ── Round 4 ────────────────────────────────────────────── */
  {
    id: 'r4-start-rumor',
    round: 4,
    phase: 'start',
    narrative: [
      '一骑快马自徐州方向驰来，带来一个压低了声音才敢说的消息——陶谦缠绵病榻，已多日未能升堂理事。州府内外讳莫如深，然而流言如水，岂是堵得住的？这一日起，小沛营中的气氛，悄然变了。',
    ],
  },

  /* ── Round 8 ────────────────────────────────────────────── */
  {
    id: 'r8-start-tension',
    round: 8,
    phase: 'start',
    narrative: [
      '入秋以来，陶谦的病情急转直下。据传他已瘦骨嶙峋，连进食都需人搀扶。徐州各大世家嗅到了权力更替的气息，纷纷遣人暗中接洽各方势力——有的叩响糜府大门，有的试探陈登口风，有的悄悄往曹营递了密信。一盘大棋，已然悄然摆开。',
    ],
  },

  /* ── Round 12 (end) ─────────────────────────────────────── */
  {
    id: 'r12-end-taoqian',
    round: 12,
    phase: 'end',
    narrative: [
      '兴平元年十月。一匹浑身汗湿的快马冲入小沛营门，马上斥候几乎是滚落马鞍——徐州牧陶谦陶恭祖，薨于州府。临终之际，他强撑病躯于榻前召集糜竺、陈登等亲信，以枯瘦之手紧握二人，一字一顿道：「非刘备不能安此州也。」言毕，溘然长逝。',
      '消息如惊雷般传至小沛。营中霎时一片死寂——将士们放下手中兵刃，百姓搁下肩上担子，所有人的目光，都穿过层层帐幕，望向同一个方向——中军大帐。望向刘备。',
    ],
  },
];

/** Opening scripts — one per round. */
export const OPENING_SCRIPTS: Record<number, string[]> = {
  1: ['兴平元年六月上旬。薄雾笼罩小沛城外，刘备的人马在晨光中缓缓抵达。营帐初立，四野寂寂，唯有蝉鸣不绝于耳——这片贫瘠之地，便是立足之基了。'],
  2: ['六月中旬。烈日如炙，军中粮草日见短绌，士卒面有菜色。小沛的井水尚算清甜，可空荡荡的粮仓，比这酷暑更叫人心焦。'],
  3: ['六月下旬。暑气蒸腾，营中弥漫着汗臭与焦躁。将士们勉力修缮着破旧的营寨，日子一天难似一天——然而放眼徐州大地，又有谁的日子好过呢？'],
  4: ['七月上旬。一场骤雨洗去了几分暑热，却洗不去弥漫徐州的隐忧。坊间开始有人低声议论——陶恭祖抱恙已久，怕是不大好了。'],
  5: ['七月中旬。蝉声愈噪，人心愈乱。徐州各郡县的信使往来如梭，明里是公文交接，暗中却裹挟着各家的试探与筹谋。'],
  6: ['七月下旬。暑热未退，徐州城中却已暗流汹涌。世家大族的车马频繁出入各方营帐，每一句寒暄背后，都藏着一把尚未出鞘的刀。'],
  7: ['八月上旬。一夜秋风起，吹散了连月的溽暑。田间稻穗渐黄，本是收获的好兆头——只是今年的收成，怕未必能安然入仓。'],
  8: ['八月中旬。秋雨连绵，消息亦如雨丝般纷纷传来。陶谦已数度卧榻不起，州府政务多由属吏代行。整个徐州，都在等一个谁也不愿说出口的结局。'],
  9: ['九月上旬。雁阵南归，秋意渐深。徐州世家间的暗中角力已近白热——糜氏、陈氏各怀算盘，各有图谋。小沛虽偏居一隅，却已身处这漩涡的正中心。'],
  10: ['九月中旬。秋高气爽，天地间却隐有肃杀之气。营外的枫叶染了层霜红，恰似这乱世中无处不在的鲜血与野心。'],
  11: ['九月下旬。霜降将至，万物收敛。徐州城中一片诡异的寂静，仿佛暴风雨前最后的平静——所有人都在屏息以待，等那只靴子落地。'],
  12: ['十月上旬。秋风萧瑟，黄叶满阶。陶谦已数日不能起身理事，州府上下一片惶然。大幕将启，命运的审判，近在咫尺。'],
};

/** Lookup scripted start events for a given round. */
export function getScriptedStartEvents(round: number): GameEvent[] {
  return SCRIPTED_START_EVENTS.filter((e) => e.round === round && e.phase === 'start');
}

/** Lookup scripted end events for a given round. */
export function getScriptedEndEvents(round: number): GameEvent[] {
  return SCRIPTED_START_EVENTS.filter((e) => e.round === round && e.phase === 'end');
}

/** Get opening script text for a given round. */
export function getOpeningScript(round: number): string[] {
  return OPENING_SCRIPTS[round] ?? ['新的一旬开始了。天际浮云聚散，一如这乱世中人心的离合。'];
}

/* ── Condition-based startup events ───────────────────────── */

const CONDITION_BASED_EVENTS: ConditionBasedEvent[] = [
  {
    id: 'mizhu-gold-gift',
    condition: (contacts, conditions) => {
      const mizhu = contacts.find((c) => c.id === 'mizhu');
      return !!mizhu && mizhu.relationship >= MIZHU_GIFT_THRESHOLD && !conditions.miZhuGiftedGold;
    },
    narrative: [
      '清晨，一队车马在小沛营门前停下。为首之人正是糜竺，他含笑下车，身后十余辆大车上满载着箱笼。',
      '糜竺拱手道："玄德公，竺思忖再三，徐州眼下多事之秋，区区薄资不敢妄称厚礼，不过是竺的一点心意。万金之物，不及知己一人。望使君笑纳。"',
      '刘备再三推辞，糜竺却正色道："使君若推却，便是不拿竺当朋友了。"刘备感念其诚，终于拜谢收下。',
    ],
    statsDelta: { gold: 10000 },
    conditionChanges: { miZhuGiftedGold: true },
  },
  {
    id: 'mizhu-marriage',
    condition: (contacts, conditions) => {
      const mizhu = contacts.find((c) => c.id === 'mizhu');
      return (
        !!mizhu &&
        mizhu.relationship >= MIZHU_MARRIAGE_THRESHOLD &&
        conditions.miZhuGiftedGold &&
        !conditions.miZhuMarriage
      );
    },
    narrative: [
      '入夜，糜竺遣心腹持帖来请，言有要事相商。刘备赴约，见糜竺于后堂设下家宴，席间推杯换盏，气氛融洽非常。',
      '酒过三巡，糜竺忽然正色起身，整衣敛容，向刘备郑重一拜："玄德公，竺有一不情之请。舍妹年方二八，虽非绝色，却也知书达理、温婉贤淑。竺观使君志向远大、为人仁厚，实乃托付之人。若蒙不弃，竺愿将舍妹许配使君为妻。此非权宜之计，乃竺真心所愿。"',
      '刘备闻言大惊，连忙起身扶住糜竺。二人推让良久，刘备终被糜竺的赤诚所动，应允了这门亲事。消息传开，小沛军民皆大欢喜——糜氏与刘使君结为姻亲，这是何等的信任与决心！',
    ],
    conditionChanges: { miZhuMarriage: true },
  },
];

/**
 * Get condition-based events that should fire this round.
 * Each event fires exactly once (condition flags prevent re-trigger).
 */
export function getConditionBasedStartEvents(
  contacts: AristocraticContact[],
  conditions: LevelConditions,
): ConditionBasedEvent[] {
  return CONDITION_BASED_EVENTS.filter((e) => e.condition(contacts, conditions));
}
