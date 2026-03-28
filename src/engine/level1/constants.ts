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
  publicOpinion: {
    morality: 60,
    talent: 40,
  },
  territory: {
    military: 500,
    training: 3,
    equipment: 3,
    morale: 60,
    rations: 15_000,  // 500 soldiers × 30 days
    funds: 1_000,
    support: 50,
  },
};

/* ── Initial conditions ───────────────────────────────────── */

export const INITIAL_CONDITIONS: LevelConditions = {
  triedVisitFailed: false,
  kongRongUnlocked: false,
  miZhuUnlocked: false,
  chenDengUnlocked: false,
  publicOpinionSet: false,
  miZhuPromisedSupport: false,
  miZhuProposedMarriage: false,
  miZhuJoined: false,
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
      visitNoble: 8,
      tax: 5,
      forage: 4,
      patrol: 3,
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
      visitNoble: 6,
      tax: 5,
      patrol: 3,
    },
  },
];

/** Ms. Gan is talk-only; she doesn't do primary tasks. */
export const MS_GAN_ID = 'msgan';
export const MS_GAN_NAME = '甘夫人';

/* ── Aristocratic contacts ────────────────────────────────── */

export const INITIAL_CONTACTS: AristocraticContact[] = [
  {
    id: 'kongrong',
    name: '孔融',
    courtesy: '文举',
    status: 'locked',
    relationship: 30,
  },
  {
    id: 'mizhu',
    name: '糜竺',
    courtesy: '子仲',
    status: 'locked',
    relationship: 0,
  },
  {
    id: 'chendeng',
    name: '陈登',
    courtesy: '元龙',
    status: 'locked',
    relationship: 0,
  },
];

/* ── Ration consumption ───────────────────────────────────── */

/** Rations consumed per day = military headcount. */
export function dailyRationConsumption(military: number): number {
  return military;
}

/* ── Relationship thresholds for Mi Zhu progression ───────── */

export const MIZHU_SUPPORT_THRESHOLD = 40;
export const MIZHU_MARRIAGE_THRESHOLD = 60;
export const MIZHU_JOIN_THRESHOLD = 80;
export const MIZHU_JOIN_FUNDS_BONUS = 5_000;

/* ── Relationship thresholds for Chen Deng ────────────────── */

export const CHENDENG_RATIONS_THRESHOLD = 40;
export const CHENDENG_SUPPORT_THRESHOLD = 60;
export const CHENDENG_HOSTILE_THRESHOLD = 20;

/* ── Assassin risk thresholds ─────────────────────────────── */

export const LOCAL_ASSASSIN_SUPPORT_THRESHOLD = 30;
export const CHENDENG_ASSASSIN_SUPPORT_THRESHOLD = 30;

/* ── Final D20 check (round 12) ───────────────────────────── */

export const FINAL_D20_DIFFICULTY = 15;
export const FINAL_D20_MIZHU_MODIFIER = 2;
export const FINAL_D20_CHENDENG_MODIFIER = 3;
/** Military power modifier: floor(combatPower / 20), max 5. */
export function finalMilitaryModifier(combatPow: number): number {
  return Math.min(5, Math.floor(combatPow / 20));
}
