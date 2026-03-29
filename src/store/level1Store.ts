import { create } from 'zustand';
import type { PlayerAttrs } from '../types/player';
import { applyDelta } from '../types/player';
import type {
  RoundPhase,
  GameStats,
  StatsDelta,
  Follower,
  AristocraticContact,
  LevelConditions,
  PrimaryTaskType,
  StandupAssignments,
  RandomEventId,
  LoseReason,
  ContactStatus,
} from '../types/level1Types';
import {
  TOTAL_ROUNDS,
  DAYS_PER_ROUND,
  INITIAL_GAME_STATS,
  INITIAL_FOLLOWERS,
  INITIAL_CONTACTS,
  INITIAL_CONDITIONS,
} from '../engine/level1/constants';
import { useGameStore } from './gameStore';
import { checkLoseConditions } from '../engine/level1/loseCheckEngine';
import { shouldChenDengBeHostile } from '../engine/level1/loseCheckEngine';

/* ── State shape ──────────────────────────────────────────── */

interface RoundSlice {
  round: number;
  daysLeft: number;
  phase: RoundPhase;
  standupAssignments: StandupAssignments;
  /** Event ID pre-seeded at round start for Ms. Gan hint system. */
  seededPatrolEvent: RandomEventId | null;
}

interface StatsSlice {
  stats: GameStats;
  attrs: PlayerAttrs;
}

interface RosterSlice {
  followers: Follower[];
  contacts: AristocraticContact[];
  conditions: LevelConditions;
}

/** Transient display state for stat/attr change popups. */
interface DisplaySlice {
  pendingStatsDelta: StatsDelta | null;
  /** Incremented on every applyStatsDelta call; use as React key to restart animation. */
  pendingStatsDeltaKey: number;
  pendingAttrsDelta: Partial<PlayerAttrs> | null;
  /** Incremented on every applyAttrsDelta call; use as React key to restart animation. */
  pendingAttrsDeltaKey: number;
}

export interface Level1State extends RoundSlice, StatsSlice, RosterSlice, DisplaySlice {
  /* ── Phase transitions ──────────────────────────────────── */

  /** Advance to the next phase in the round cycle. */
  advancePhase: () => void;

  /** Jump to a specific phase (used by event machinery). */
  setPhase: (phase: RoundPhase) => void;

  /* ── Round management ───────────────────────────────────── */

  /** Consume days from the current round. Returns false if insufficient. */
  consumeDays: (n: number) => boolean;

  /** End the free action phase immediately (for 休息). */
  endFreeActionPhase: () => void;

  /** Advance to next round. Resets daysLeft, cooldowns, etc. */
  advanceRound: () => void;

  /* ── Standup ────────────────────────────────────────────── */

  setStandupAssignments: (assignments: StandupAssignments) => void;

  /* ── Stats mutations ────────────────────────────────────── */

  applyStatsDelta: (delta: StatsDelta) => void;
  applyAttrsDelta: (delta: Partial<PlayerAttrs>) => void;
  clearPendingStatsDelta: () => void;
  clearPendingAttrsDelta: () => void;

  /* ── Roster mutations ───────────────────────────────────── */

  setCompanionCooldown: (followerId: string, untilRound: number) => void;
  setFollowerTask: (followerId: string, task: PrimaryTaskType | null) => void;
  addFollower: (follower: Follower) => void;
  updateContactStatus: (contactId: string, status: ContactStatus) => void;
  updateContactRelationship: (contactId: string, delta: number) => void;

  /* ── Conditions ─────────────────────────────────────────── */

  updateConditions: (changes: Partial<LevelConditions>) => void;

  /* ── Events ─────────────────────────────────────────────── */

  seedPatrolEvent: (eventId: RandomEventId | null) => void;

  /* ── Win / Lose ─────────────────────────────────────────── */

  triggerLose: (reason: LoseReason) => void;
  triggerWin: () => void;

  /* ── Lifecycle ──────────────────────────────────────────── */

  /** Full reset — called on mount or retry. Reads playerAttrs from gameStore. */
  reset: () => void;
}

/* ── Phase ordering ───────────────────────────────────────── */

const PHASE_ORDER: RoundPhase[] = [
  'startEvents',
  'openingScript',
  'standup',
  'freeAction',
  'endingEvents',
];

function nextPhase(current: RoundPhase): RoundPhase {
  const idx = PHASE_ORDER.indexOf(current);
  if (idx === -1 || idx >= PHASE_ORDER.length - 1) return 'endingEvents';
  return PHASE_ORDER[idx + 1];
}

/* ── Stats delta application ──────────────────────────────── */

function applyStatsDeltaToStats(stats: GameStats, delta: StatsDelta): GameStats {
  const po = { ...stats.publicOpinion };
  const ts = { ...stats.territory };

  if (delta.morality != null) po.morality = clamp(po.morality + delta.morality, 0, 100);
  if (delta.talent != null) po.talent = clamp(po.talent + delta.talent, 0, 100);
  if (delta.military != null) ts.military = Math.max(0, ts.military + delta.military);
  if (delta.training != null) ts.training = clamp(ts.training + delta.training, 0, 10);
  if (delta.equipment != null) ts.equipment = clamp(ts.equipment + delta.equipment, 0, 10);
  if (delta.morale != null) ts.morale = clamp(ts.morale + delta.morale, 0, 100);
  if (delta.rations != null) ts.rations = Math.max(0, ts.rations + delta.rations);
  if (delta.funds != null) ts.funds = Math.max(0, ts.funds + delta.funds);
  if (delta.support != null) ts.support = clamp(ts.support + delta.support, 0, 100);

  return { publicOpinion: po, territory: ts };
}

function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

/* ── Initial snapshot builder ─────────────────────────────── */

function buildInitialState(): RoundSlice & StatsSlice & RosterSlice & DisplaySlice {
  const playerAttrs = useGameStore.getState().playerAttrs;
  return {
    round: 1,
    daysLeft: DAYS_PER_ROUND,
    phase: 'cover',
    standupAssignments: {},
    seededPatrolEvent: null,
    stats: structuredClone(INITIAL_GAME_STATS),
    attrs: { ...playerAttrs },
    followers: structuredClone(INITIAL_FOLLOWERS),
    contacts: structuredClone(INITIAL_CONTACTS),
    conditions: { ...INITIAL_CONDITIONS },
    pendingStatsDelta: null,
    pendingStatsDeltaKey: 0,
    pendingAttrsDelta: null,
    pendingAttrsDeltaKey: 0,
  };
}

/* ── Store ────────────────────────────────────────────────── */

export const useLevel1Store = create<Level1State>((set, get) => ({
  ...buildInitialState(),

  /* ── Phase transitions ──────────────────────────────────── */

  advancePhase: () => {
    const { phase, round } = get();
    if (phase === 'levelEnd') return;

    // Cover is a one-time phase; skip directly to startEvents
    if (phase === 'cover') {
      set({ phase: 'startEvents' });
      return;
    }

    if (phase === 'endingEvents') {
      // End of round — either advance round or end level
      if (round >= TOTAL_ROUNDS) {
        // Deduct rations for the final round; check lose conditions atomically
        const { stats, conditions } = get();
        const rationCost = stats.territory.military * DAYS_PER_ROUND;
        const newRations = Math.max(0, stats.territory.rations - rationCost);
        const newStats = { ...stats, territory: { ...stats.territory, rations: newRations } };
        const loseReason = checkLoseConditions(newStats, conditions, round);
        set({
          phase: 'levelEnd',
          stats: newStats,
          conditions: loseReason ? { ...conditions, loseReason } : conditions,
        });
      } else {
        get().advanceRound();
      }
      return;
    }

    set({ phase: nextPhase(phase) });
  },

  setPhase: (phase) => set({ phase }),

  /* ── Round management ───────────────────────────────────── */

  consumeDays: (n) => {
    const { daysLeft } = get();
    if (n > daysLeft) return false;
    set({ daysLeft: daysLeft - n });
    return true;
  },

  endFreeActionPhase: () => {
    set({ daysLeft: 0, phase: 'endingEvents' });
  },

  advanceRound: () => {
    const { round, stats, followers } = get();
    const newRound = round + 1;

    // Deduct daily rations for the round that just ended
    const rationCost = stats.territory.military * DAYS_PER_ROUND;
    const newRations = Math.max(0, stats.territory.rations - rationCost);

    // Reset follower assigned tasks
    const updatedFollowers = followers.map((f) => ({
      ...f,
      assignedTask: null as PrimaryTaskType | null,
    }));

    set({
      round: newRound,
      daysLeft: DAYS_PER_ROUND,
      phase: 'startEvents',
      standupAssignments: {},
      seededPatrolEvent: null,
      stats: {
        ...stats,
        territory: { ...stats.territory, rations: newRations },
      },
      followers: updatedFollowers,
      conditions: { ...get().conditions, hasBodyguard: false },
    });

    // Check lose conditions after ration deduction (bypasses applyStatsDelta)
    const s = get();
    const loseReason = checkLoseConditions(s.stats, s.conditions, s.round);
    if (loseReason) s.triggerLose(loseReason);
  },

  /* ── Standup ────────────────────────────────────────────── */

  setStandupAssignments: (assignments) => {
    const followers = get().followers.map((f) => ({
      ...f,
      assignedTask: assignments[f.id] ?? null,
    }));
    const hasBodyguard = Object.values(assignments).includes('bodyguard');
    set({
      standupAssignments: assignments,
      followers,
      conditions: { ...get().conditions, hasBodyguard },
    });
  },

  /* ── Stats mutations ────────────────────────────────────── */

  applyStatsDelta: (delta) => {
    set((s) => {
      const oldStats = s.stats;
      const newStats = applyStatsDeltaToStats(oldStats, delta);
      // Check lose conditions after stat change
      const loseReason = checkLoseConditions(newStats, s.conditions, s.round);
      if (loseReason) {
        return {
          stats: newStats,
          phase: 'levelEnd' as RoundPhase,
          conditions: { ...s.conditions, loseReason },
        };
      }
      // Compute realized (clamped) delta so the popup shows what actually changed
      const realizedDelta: StatsDelta = {};
      const oldT = oldStats.territory;
      const newT = newStats.territory;
      const oldPO = oldStats.publicOpinion;
      const newPO = newStats.publicOpinion;
      if (delta.military   !== undefined) realizedDelta.military   = newT.military   - oldT.military;
      if (delta.rations    !== undefined) realizedDelta.rations    = newT.rations    - oldT.rations;
      if (delta.funds      !== undefined) realizedDelta.funds      = newT.funds      - oldT.funds;
      if (delta.morale     !== undefined) realizedDelta.morale     = newT.morale     - oldT.morale;
      if (delta.support    !== undefined) realizedDelta.support    = newT.support    - oldT.support;
      if (delta.training   !== undefined) realizedDelta.training   = newT.training   - oldT.training;
      if (delta.equipment  !== undefined) realizedDelta.equipment  = newT.equipment  - oldT.equipment;
      if (delta.morality   !== undefined) realizedDelta.morality   = newPO.morality  - oldPO.morality;
      if (delta.talent     !== undefined) realizedDelta.talent     = newPO.talent    - oldPO.talent;
      return {
        stats: newStats,
        pendingStatsDelta: realizedDelta,
        pendingStatsDeltaKey: s.pendingStatsDeltaKey + 1,
      };
    });
  },

  applyAttrsDelta: (delta) => {
    set((s) => ({
      attrs: applyDelta(s.attrs, delta),
      pendingAttrsDelta: delta,
      pendingAttrsDeltaKey: s.pendingAttrsDeltaKey + 1,
    }));
  },

  clearPendingStatsDelta: () => set({ pendingStatsDelta: null }),
  clearPendingAttrsDelta: () => set({ pendingAttrsDelta: null }),

  /* ── Roster mutations ───────────────────────────────────── */

  setCompanionCooldown: (followerId, untilRound) => {
    set((s) => ({
      followers: s.followers.map((f) =>
        f.id === followerId ? { ...f, companionCooldownUntilRound: untilRound } : f,
      ),
    }));
  },

  setFollowerTask: (followerId, task) => {
    set((s) => ({
      followers: s.followers.map((f) =>
        f.id === followerId ? { ...f, assignedTask: task } : f,
      ),
    }));
  },

  addFollower: (follower) => {
    set((s) => ({
      followers: [...s.followers, follower],
    }));
  },

  updateContactStatus: (contactId, status) => {
    set((s) => ({
      contacts: s.contacts.map((c) =>
        c.id === contactId ? { ...c, status } : c,
      ),
    }));
  },

  updateContactRelationship: (contactId, delta) => {
    set((s) => {
      const updatedContacts = s.contacts.map((c) =>
        c.id === contactId
          ? { ...c, relationship: clamp(c.relationship + delta, 0, 100) }
          : c,
      );
      // Wire Chen Deng hostility check
      let updatedConditions = s.conditions;
      if (contactId === 'chendeng') {
        const chenDeng = updatedContacts.find((c) => c.id === 'chendeng');
        if (chenDeng && !s.conditions.chenDengHostile) {
          const hostile = shouldChenDengBeHostile(
            chenDeng.relationship,
            s.stats.territory.support,
          );
          if (hostile) {
            updatedConditions = { ...s.conditions, chenDengHostile: true };
          }
        }
      }
      return { contacts: updatedContacts, conditions: updatedConditions };
    });
  },

  /* ── Conditions ─────────────────────────────────────────── */

  updateConditions: (changes) => {
    set((s) => ({
      conditions: { ...s.conditions, ...changes },
    }));
  },

  /* ── Events ─────────────────────────────────────────────── */

  seedPatrolEvent: (eventId) => {
    set({ seededPatrolEvent: eventId });
  },

  /* ── Win / Lose ─────────────────────────────────────────── */

  triggerLose: (reason) => {
    set((s) => ({
      phase: 'levelEnd' as RoundPhase,
      conditions: { ...s.conditions, loseReason: reason },
    }));
  },

  triggerWin: () => {
    set((s) => ({
      phase: 'levelEnd' as RoundPhase,
      conditions: { ...s.conditions, won: true },
    }));
  },

  /* ── Lifecycle ──────────────────────────────────────────── */

  reset: () => {
    set(buildInitialState());
  },
}));
