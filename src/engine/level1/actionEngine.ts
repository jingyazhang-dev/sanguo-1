import type {
  FreeActionType,
  GameStats,
  LevelConditions,
} from '../../types/level1Types';
import { FREE_ACTION_LABELS, FREE_ACTION_DAYS } from '../../types/level1Types';

export interface ActionDefinition {
  type: FreeActionType;
  label: string;
  dayCost: number;
  description: string;
  /** Return true if the action is available given current state. */
  isAvailable: (stats: GameStats, conditions: LevelConditions, daysLeft: number) => boolean;
}

export const ACTION_DEFINITIONS: ActionDefinition[] = [
  {
    type: 'talk',
    label: FREE_ACTION_LABELS.talk,
    dayCost: FREE_ACTION_DAYS.talk,
    description: '与身边的人交谈。',
    isAvailable: (_s, _c, daysLeft) => daysLeft >= FREE_ACTION_DAYS.talk,
  },
  {
    type: 'visit',
    label: FREE_ACTION_LABELS.visit,
    dayCost: FREE_ACTION_DAYS.visit,
    description: '拜访世族名士。',
    isAvailable: (_s, _c, daysLeft) => daysLeft >= FREE_ACTION_DAYS.visit,
  },
  {
    type: 'patrolField',
    label: FREE_ACTION_LABELS.patrolField,
    dayCost: FREE_ACTION_DAYS.patrolField,
    description: '巡查民情，可能遭遇事件。',
    isAvailable: (_s, _c, daysLeft) => daysLeft >= FREE_ACTION_DAYS.patrolField,
  },
  {
    type: 'rest',
    label: FREE_ACTION_LABELS.rest,
    dayCost: 0,
    description: '结束本旬自由行动。',
    isAvailable: () => true, // always available
  },
];

/** Get available actions given current state. */
export function getAvailableActions(
  stats: GameStats,
  conditions: LevelConditions,
  daysLeft: number,
): ActionDefinition[] {
  return ACTION_DEFINITIONS.filter((a) => a.isAvailable(stats, conditions, daysLeft));
}
