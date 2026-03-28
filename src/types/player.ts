export interface PlayerAttrs {
  strength: number;      // 力量, clamped [0, 20]
  intelligence: number;  // 智谋, clamped [0, 20]
  charisma: number;      // 魅力, clamped [0, 20]
}

export const INITIAL_ATTRS: PlayerAttrs = {
  strength: 10,
  intelligence: 10,
  charisma: 10,
};

export function clampAttr(v: number): number {
  return Math.min(20, Math.max(0, v));
}

export function applyDelta(
  attrs: PlayerAttrs,
  delta: Partial<PlayerAttrs>,
): PlayerAttrs {
  return {
    strength:     clampAttr(attrs.strength     + (delta.strength     ?? 0)),
    intelligence: clampAttr(attrs.intelligence + (delta.intelligence ?? 0)),
    charisma:     clampAttr(attrs.charisma     + (delta.charisma     ?? 0)),
  };
}
