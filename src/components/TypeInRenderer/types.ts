// ─── Public input types ───────────────────────────────────────────────────────

export type SpeedLevel = 'fast' | 'normal' | 'slow';

export interface TextNode {
  type: 'text';
  id: string;
  /** Raw content string, may contain custom tags: <em>, </em>, <speed fast|normal|slow>, </speed> */
  content: string;
}

export interface Choice {
  id: string;
  label: string;
}

export interface ChoiceNode {
  type: 'choice';
  id: string;
  choices: Choice[];
}

export type RenderNode = TextNode | ChoiceNode;

// ─── Public component API ─────────────────────────────────────────────────────

export interface TypeInRendererHandle {
  /** Append a node to the render queue. */
  append(node: RenderNode): void;
  /** Clear all content and stop rendering. */
  reset(): void;
  /** Instantly complete the current text item being typed. No-op if not currently typing. */
  skipCurrent(): void;
}

export interface TypeInRendererProps {
  /** Global typing speed applied to all segments without an explicit speed override. Default: 'normal'. */
  speed?: SpeedLevel;
  /** Called when the user selects a choice from a ChoiceNode. */
  onChoiceSelected: (choiceId: string) => void;
  /** Called when the render queue empties and all text has finished typing. */
  onQueueEmpty?: () => void;
}

// ─── Parser output ────────────────────────────────────────────────────────────

/** A plain text run produced by parseText, with styling metadata. */
export interface TextSegment {
  /** The full text of this segment. */
  text: string;
  emphasis: boolean;
  speed?: SpeedLevel;
}

// ─── Internal display types ───────────────────────────────────────────────────

/** A segment as it appears in the display state.  `text` grows character-by-character during animation. */
export interface DisplaySegment {
  text: string;
  emphasis: boolean;
  speed?: SpeedLevel;
}

export interface TextDisplayItem {
  type: 'text';
  id: string;
  segments: DisplaySegment[];
  /** True once all characters have been typed. Allows React.memo to skip re-renders. */
  done: boolean;
}

export interface ChoiceDisplayItem {
  type: 'choice';
  id: string;
  choices: Choice[];
  /** Set once the user selects a choice. Makes the item permanently non-interactive. */
  selectedId?: string;
}

export type DisplayItem = TextDisplayItem | ChoiceDisplayItem;

// ─── Render cursor ────────────────────────────────────────────────────────────

/** Tracks the position within the currently-animating TextNode. */
export interface ActiveCursor {
  segIndex: number;
  charIndex: number;
}
