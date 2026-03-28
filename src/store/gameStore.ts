import { create } from 'zustand';
import type { PlayerAttrs } from '../types/player';
import { INITIAL_ATTRS } from '../types/player';

export type Screen = 'title' | 'level0' | 'level1';

interface GameStore {
  screen: Screen;
  /**
   * Player attributes carried forward between levels.
   * Set by goToLevel1() with the final attrs from Level 0.
   */
  playerAttrs: PlayerAttrs;
  /** Navigate to the title screen. */
  goToTitle: () => void;
  /** Start a new game — navigates to level 0. */
  goToLevel0: () => void;
  /**
   * Advance to level 1, persisting the player attrs earned in level 0.
   * @param attrs The final PlayerAttrs from the level 0 summary.
   */
  goToLevel1: (attrs: PlayerAttrs) => void;
}

export const useGameStore = create<GameStore>((set) => ({
  screen: 'title',
  playerAttrs: { ...INITIAL_ATTRS },
  goToTitle:  () => set({ screen: 'title' }),
  goToLevel0: () => set({ screen: 'level0' }),
  goToLevel1: (attrs) => set({ screen: 'level1', playerAttrs: attrs }),
}));
