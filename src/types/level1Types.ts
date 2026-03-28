import type { PlayerAttrs } from './player';

/* ── Round phases ─────────────────────────────────────────── */

export type RoundPhase =
  | 'cover'
  | 'startEvents'
  | 'openingScript'
  | 'standup'
  | 'freeAction'
  | 'endingEvents'
  | 'levelEnd';

/* ── Game stats ───────────────────────────────────────────── */

export interface PublicOpinion {
  morality: number; // 0–100
  talent: number;   // 0–100
}

export interface TerritoryStatus {
  military: number;   // head count
  training: number;   // 0–10
  equipment: number;  // 0–10
  morale: number;     // 0–100
  rations: number;    // man*day
  funds: number;      // raw number
  support: number;    // 0–100
}

export interface GameStats {
  publicOpinion: PublicOpinion;
  territory: TerritoryStatus;
}

/** Convenience flat partial for applying deltas to GameStats. */
export interface StatsDelta {
  morality?: number;
  talent?: number;
  military?: number;
  training?: number;
  equipment?: number;
  morale?: number;
  rations?: number;
  funds?: number;
  support?: number;
}

/* ── Combat power (derived) ───────────────────────────────── */

export function combatPower(t: TerritoryStatus): number {
  return (t.training + t.equipment) * 5;
}

/* ── Followers ────────────────────────────────────────────── */

export type FollowerRole = 'follower' | 'contact' | 'both';

export interface Follower {
  id: string;
  name: string;        // display name in Chinese
  courtesy?: string;   // 字 (zi)
  attrs: PlayerAttrs;  // strength / intelligence / charisma
  role: FollowerRole;
  /** Round number until which this follower cannot be a patrol companion. 0 = available. */
  companionCooldownUntilRound: number;
  /** Relationship value toward Liu Bei. Higher is better. */
  relationship: number;
  /** Whether the follower is currently assigned to a primary task this round. */
  assignedTask: PrimaryTaskType | null;
  /** Personal preference weights for primary task proposals (higher = more likely to propose). */
  taskPreferences: Partial<Record<PrimaryTaskType, number>>;
}

/* ── Aristocratic contacts ────────────────────────────────── */

export type ContactStatus = 'locked' | 'known' | 'friendly' | 'allied';

export interface AristocraticContact {
  id: string;
  name: string;
  courtesy?: string;
  status: ContactStatus;
  relationship: number; // 0–100
}

/* ── Primary tasks (follower assignments) ─────────────────── */

export type PrimaryTaskType =
  | 'recruit'      // 募兵
  | 'train'        // 练兵
  | 'forage'       // 征粮
  | 'tax'          // 征税
  | 'patrol'       // 治安巡逻
  | 'visitNoble'   // 拜访名士
  | 'bodyguard';   // 贴身防卫

export const PRIMARY_TASK_LABELS: Record<PrimaryTaskType, string> = {
  recruit:    '募兵',
  train:      '练兵',
  forage:     '征粮',
  tax:        '征税',
  patrol:     '治安巡逻',
  visitNoble: '拜访名士',
  bodyguard:  '贴身防卫',
};

export interface PrimaryTaskResult {
  followerId: string;
  task: PrimaryTaskType;
  narrative: string;
  statsDelta: StatsDelta;
  attrsDelta?: Partial<PlayerAttrs>;
  conditionChanges?: Partial<LevelConditions>;
}

/* ── Free actions (player choices) ────────────────────────── */

export type FreeActionType =
  | 'talk'    // 交谈
  | 'visit'   // 拜访
  | 'patrolField' // 查访民情
  | 'rest';   // 休息

export const FREE_ACTION_LABELS: Record<FreeActionType, string> = {
  talk:        '交谈',
  visit:       '拜访',
  patrolField: '查访民情',
  rest:        '休息',
};

export const FREE_ACTION_DAYS: Record<FreeActionType, number> = {
  talk:        1,
  visit:       3,
  patrolField: 2,
  rest:        0, // special: ends the round
};

/* ── Game events ──────────────────────────────────────────── */

export type RandomEventId = string;

export interface GameEvent {
  id: string;
  round?: number;          // if set, only fires on this round
  phase: 'start' | 'end';
  triggerCondition?: (stats: GameStats, conditions: LevelConditions, round: number) => boolean;
  narrative: string[];
  d20Check?: D20CheckConfig;
  statsDelta?: StatsDelta;
  attrsDelta?: Partial<PlayerAttrs>;
  conditionChanges?: Partial<LevelConditions>;
  /** Category for Ms. Gan's hint system. */
  hintCategory?: string;
}

/* ── D20 check ────────────────────────────────────────────── */

export type D20Situation = 'normal' | 'advantage' | 'disadvantage';

export interface D20Modifier {
  label: string;
  value: number;
}

export interface D20CheckConfig {
  difficulty: number;
  situation: D20Situation;
  attrKey: keyof PlayerAttrs;
  modifiers: D20Modifier[];
  successNarrative: string;
  failureNarrative: string;
  successStatsDelta?: StatsDelta;
  failureStatsDelta?: StatsDelta;
  successConditionChanges?: Partial<LevelConditions>;
  failureConditionChanges?: Partial<LevelConditions>;
}

/* ── Level conditions (boolean flags) ─────────────────────── */

export interface LevelConditions {
  triedVisitFailed: boolean;
  kongRongUnlocked: boolean;
  miZhuUnlocked: boolean;
  chenDengUnlocked: boolean;
  publicOpinionSet: boolean;
  miZhuPromisedSupport: boolean;
  miZhuProposedMarriage: boolean;
  miZhuJoined: boolean;
  chenDengRationsSupport: boolean;
  chenDengPromisedSupport: boolean;
  chenDengHostile: boolean;
  hasBodyguard: boolean;
  /** The reason the player lost, if any. */
  loseReason: LoseReason | null;
  /** Whether the level is won. */
  won: boolean;
}

export type LoseReason =
  | 'mutiny'           // rations ran out
  | 'assassin_local'   // killed by local assassin
  | 'assassin_chen'    // killed by Chen Deng's assassin
  | 'failed_xuzhou';   // failed final D20

/* ── Standup assignment map ───────────────────────────────── */

export type StandupAssignments = Record<string, PrimaryTaskType>;

/* ── Dialogue types ───────────────────────────────────────── */

export interface DialogueTopic {
  id: string;
  label: string;
  /** Precondition to show this topic. */
  available?: (conditions: LevelConditions, stats: GameStats, round: number) => boolean;
  /** Lines to display, randomly selected. */
  lines: string[];
  /** Optional choices after the topic narration. */
  choices?: DialogueChoice[];
  statsDelta?: StatsDelta;
  attrsDelta?: Partial<PlayerAttrs>;
  conditionChanges?: Partial<LevelConditions>;
}

export interface DialogueChoice {
  id: string;
  label: string;
  responseLines: string[];
  statsDelta?: StatsDelta;
  attrsDelta?: Partial<PlayerAttrs>;
  conditionChanges?: Partial<LevelConditions>;
}
