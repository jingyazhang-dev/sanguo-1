import { create } from 'zustand';
import type { PlayerAttrs } from '../types/player';
import { INITIAL_ATTRS, applyDelta } from '../types/player';

type Phase = 'cover' | 'narrative' | 'summary';

interface Level0State {
  phase: Phase;
  /** Accumulated player attributes, updated on each answer. */
  attrs: PlayerAttrs;
  /** Snapshot of attrs at level start — always 10/10/10 for level 0. */
  initialAttrs: PlayerAttrs;

  goToNarrative: () => void;
  goToSummary: () => void;
  /** Apply an answer's attribute delta to accumulated attrs. */
  applyAnswer: (delta: Partial<PlayerAttrs>) => void;
  /** Reset all state — called on Level0Screen mount. */
  reset: () => void;
}

const initialState = {
  phase: 'cover' as Phase,
  attrs: { ...INITIAL_ATTRS },
  initialAttrs: { ...INITIAL_ATTRS },
};

export const useLevel0Store = create<Level0State>((set) => ({
  ...initialState,

  goToNarrative: () => set({ phase: 'narrative' }),
  goToSummary:   () => set({ phase: 'summary' }),

  applyAnswer: (delta) =>
    set((s) => ({ attrs: applyDelta(s.attrs, delta) })),

  reset: () => set({ ...initialState, attrs: { ...INITIAL_ATTRS }, initialAttrs: { ...INITIAL_ATTRS } }),
}));
