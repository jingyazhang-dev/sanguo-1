import type {
  GameStats,
  Follower,
  AristocraticContact,
  LevelConditions,
} from '../../types/level1Types';

/* ── Timing ───────────────────────────────────────────────── */

export const TOTAL_ROUNDS = 12;
export const DAYS_PER_ROUND = 10;

/* ── Initial game stats ───────────────────────────────────── */

export const INITIAL_GAME_STATS: GameStats = {
  reputation: 30,
  territory: {
    military: 6_000,
    training: 50,
    equipment: 50,
    rations: 180_000,  // 6000 soldiers × 30 days
    gold: 1_000,
    support: 50,
  },
};

/* ── Initial conditions ───────────────────────────────────── */

export const INITIAL_CONDITIONS: LevelConditions = {
  triedVisitFailed: false,
  kongRongUnlocked: false,
  miZhuUnlocked: false,
  chenDengUnlocked: false,
  miZhuGiftedGold: false,
  miZhuMarriage: false,
  chenDengRationsTopicUnlocked: false,
  chenDengRationsSupport: false,
  chenDengPromisedSupport: false,
  chenDengHostile: false,
  hasBodyguard: false,
  loseReason: null,
  won: false,
};

/* ── Followers ────────────────────────────────────────────── */

export const INITIAL_FOLLOWERS: Follower[] = [
  {
    id: 'guanyu',
    name: '关羽',
    courtesy: '云长',
    attrs: { strength: 18, intelligence: 12, charisma: 14 },
    role: 'follower',
    companionCooldownUntilRound: 0,
    relationship: 95,
    assignedTask: null,
    taskPreferences: {
      train: 8,
      recruit: 5,
      patrol: 4,
      bodyguard: 3,
    },
  },
  {
    id: 'zhangfei',
    name: '张飞',
    courtesy: '翼德',
    attrs: { strength: 18, intelligence: 8, charisma: 10 },
    role: 'follower',
    companionCooldownUntilRound: 0,
    relationship: 95,
    assignedTask: null,
    taskPreferences: {
      recruit: 8,
      train: 6,
      patrol: 3,
      bodyguard: 5,
    },
  },
  {
    id: 'jianyong',
    name: '简雍',
    courtesy: '宪和',
    attrs: { strength: 10, intelligence: 14, charisma: 16 },
    role: 'follower',
    companionCooldownUntilRound: 0,
    relationship: 80,
    assignedTask: null,
    taskPreferences: {
      tax: 7,
      forage: 5,
      patrol: 4,
    },
  },
  {
    id: 'sunqian',
    name: '孙乾',
    courtesy: '公佑',
    attrs: { strength: 10, intelligence: 14, charisma: 15 },
    role: 'follower',
    companionCooldownUntilRound: 0,
    relationship: 80,
    assignedTask: null,
    taskPreferences: {
      forage: 7,
      tax: 5,
      patrol: 4,
    },
  },
];

/** Ms. Gan is talk-only; she doesn't do primary tasks. */
export const MS_GAN_ID = 'msgan';
export const MS_GAN_NAME = '甘夫人';

/** Ms. Mi is talk-only; available after miZhuMarriage. */
export const MS_MI_ID = 'msmi';
export const MS_MI_NAME = '糜夫人';

/* ── Aristocratic contacts ────────────────────────────────── */

export const INITIAL_CONTACTS: AristocraticContact[] = [
  {
    id: 'kongrong',
    name: '孔融',
    courtesy: '文举',
    status: 'locked',
    relationship: 100,
  },
  {
    id: 'mizhu',
    name: '糜竺',
    courtesy: '子仲',
    status: 'locked',
    relationship: 50,
  },
  {
    id: 'chendeng',
    name: '陈登',
    courtesy: '元龙',
    status: 'locked',
    relationship: 30,
  },
];

/* ── Ration consumption ───────────────────────────────────── */

/** Rations consumed per day = military headcount. */
export function dailyRationConsumption(military: number): number {
  return military;
}

/* ── Relationship thresholds for Mi Zhu progression ───────── */

export const MIZHU_GIFT_THRESHOLD = 60;
export const MIZHU_MARRIAGE_THRESHOLD = 80;

/* ── Relationship thresholds for Chen Deng ────────────────── */

export const CHENDENG_RATIONS_THRESHOLD = 60;
export const CHENDENG_SUPPORT_THRESHOLD = 80;
export const CHENDENG_HOSTILE_THRESHOLD = 50;

/* ── Assassin risk thresholds ─────────────────────────────── */

export const LOCAL_ASSASSIN_SUPPORT_THRESHOLD = 30;
export const CHENDENG_ASSASSIN_PROBABILITY = 0.5;
export const CHENDENG_ASSASSIN_SUPPORT_THRESHOLD = 30;

/* ── Greeting tier thresholds ─────────────────────────────── */

export const GREETING_COLD = 30;
export const GREETING_NEUTRAL = 50;
export const GREETING_WARM = 70;

/* ── Opinion gate (reputation) for Mi Zhu / Chen Deng ── */

export const OPINION_GATE = 40;

/* ── Final D20 check (round 12) ───────────────────────────── */

export const FINAL_D20_DIFFICULTY = 15;
export const FINAL_D20_MIZHU_GIFTED_GOLD_MODIFIER = 2;
export const FINAL_D20_MIZHU_MARRIAGE_MODIFIER = 3;
export const FINAL_D20_CHENDENG_RATIONS_MODIFIER = 1;
export const FINAL_D20_CHENDENG_SUPPORT_MODIFIER = 3;
/** Military power modifier: floor(combatPower / 20), max 5. */
export function finalMilitaryModifier(combatPow: number): number {
  return Math.min(5, Math.floor(combatPow / 20));
}
/** Public opinion modifier: floor(reputation / 20), max 3. */
export function finalPublicOpinionModifier(reputation: number): number {
  return Math.min(3, Math.floor(reputation / 20));
}
