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

export interface TerritoryStatus {
  military: number;   // head count
  training: number;   // 0–100
  equipment: number;  // 0–100
  rations: number;    // man*day
  gold: number;       // raw number
  support: number;    // 0–100
}

export interface GameStats {
  /** 声望 — combined public opinion (0–100). Replaces old morality + talent split. */
  reputation: number;
  territory: TerritoryStatus;
}

/** Convenience flat partial for applying deltas to GameStats. */
export interface StatsDelta {
  /** 声望 delta (replaces old morality / talent). */
  reputation?: number;
  military?: number;
  training?: number;
  equipment?: number;
  rations?: number;
  gold?: number;
  support?: number;
}

/* ── Combat power (derived) ───────────────────────────────── */

export function combatPower(t: TerritoryStatus): number {
  return (t.training + t.equipment) / 2;
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
  | 'bodyguard';   // 贴身防卫

export const PRIMARY_TASK_LABELS: Record<PrimaryTaskType, string> = {
  recruit:    '募兵',
  train:      '练兵',
  forage:     '征粮',
  tax:        '征税',
  patrol:     '治安巡逻',
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
  miZhuGiftedGold: boolean;
  miZhuMarriage: boolean;
  chenDengRationsTopicUnlocked: boolean;
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
  /** Minimum relationship required to show this topic (visit topics only). */
  minRelationship?: number;
  /** Lines to display, randomly selected. */
  lines: string[];
  /** Optional choices after the topic narration. */
  choices?: DialogueChoice[];
  /** Optional D20 check triggered after narration. */
  d20Check?: D20CheckConfig;
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
  /** Relationship change on this contact when this choice is picked. */
  relationshipDelta?: number;
}

/* ── Chat (闲谈) types ────────────────────────────────────── */

export type ChatTopicKind = 'scripted' | 'narrative' | 'situational';

export interface ChatTopic {
  id: string;
  kind: ChatTopicKind;
  label: string;
  narrative: string[];
  choices?: DialogueChoice[];
  d20Check?: D20CheckConfig;
  statsDelta?: StatsDelta;
  attrsDelta?: Partial<PlayerAttrs>;
  conditionChanges?: Partial<LevelConditions>;
  /** For situational topics: condition that must be met to include in pool. */
  situationalCondition?: (stats: GameStats, conditions: LevelConditions) => boolean;
}

/* ── Dynamic topics ───────────────────────────────────────── */

export interface DynamicTopicDef {
  id: string;
  label: string;
  triggerCondition: (stats: GameStats, conditions: LevelConditions) => boolean;
  removeCondition: (stats: GameStats, conditions: LevelConditions) => boolean;
}

export interface DynamicTopicResponse {
  followerId: string;
  lines: string[];
  statsDelta?: StatsDelta;
  conditionChanges?: Partial<LevelConditions>;
  hasUsefulResponse: boolean;
}

/* ── Visit (拜访) types ───────────────────────────────────── */

export interface ContactGreetingTiers {
  cold: string[];     // rel < 30
  neutral: string[];  // rel 30–50
  warm: string[];     // rel 50–70
  close: string[];    // rel > 70
}

/* ── Patrol (查访民情) v2 types ───────────────────────────── */

export interface PatrolEventOption {
  id: string;
  label: string;
  statsDelta: StatsDelta;
  d20Check?: D20CheckConfig;
  companionBonusAttr?: keyof PlayerAttrs;
}

export interface PatrolEventV2 {
  id: string;
  narrative: string[];
  options: PatrolEventOption[];
  rare: boolean;
  hintCategory?: string;
}

/* ── Condition-based startup events ───────────────────────── */

export interface ConditionBasedEvent {
  id: string;
  condition: (contacts: AristocraticContact[], conditions: LevelConditions) => boolean;
  narrative: string[];
  statsDelta?: StatsDelta;
  conditionChanges?: Partial<LevelConditions>;
}
