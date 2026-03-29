# Issue Report 7 — Implementation Plan

## Problem Statement

Six bugs to fix across Level 0 and Level 1:

1. **Standup skipped** — ClickToContinue event bubbles to parent div, calling `advancePhase()` twice, skipping standup phase entirely.
2. **Settlement no click-to-continue** — Settlement auto-advances with a 600ms timeout; replace with explicit ClickToContinue.
3. **Kong Rong not visible** — After unlocking Kong Rong via Jian Yong, `visibleContacts` still filters Kong Rong out (always `'locked'`). Fix: include Kong Rong when `kongRongUnlocked`.
4. **No stat-change popups in Level 1** — Attribute changes in Level 0 show a floating popup. Level 1 stat changes (`StatsDelta`) need the same treatment, plus StatsPanel row flash.
5. **Rations game-over delayed** — `advanceRound()` deducts rations with `Math.max(0, …)` but never calls `checkLoseConditions`. Same bug in `advancePhase()` at final round.
6. **Level 0 iPhone overflow** — Safari iOS flex bug: `flex-1 overflow-y-auto` without `min-h-0` causes content to overflow below screen.

## One-Bite Tasks (OBTs)

### OBT-1 — Fix ClickToContinue event bubbling
**File:** `src/components/level1/ClickToContinue.tsx`

Root cause: the `<button>` click event bubbles to the parent `<div onClick={advancePhase}>` in `StartEventsPhase` and `OpeningScriptPhase`, calling `advancePhase()` twice and skipping the standup phase.

- In the button's `onClick` handler, call `e.stopPropagation()` before invoking the `onClick` prop.

---

### OBT-2 — Settlement: ClickToContinue at end
**File:** `src/components/level1/SettlementPhase.tsx`

- Remove the 600ms `setTimeout` that currently auto-advances from the `'done'` branch.
- In the `SettlementLog` component (rendered in the `'done'` branch):
  - If `completedItems.length > 0`: show `<ClickToContinue onClick={advancePhase} />` below the completed item list.
  - If `completedItems.length === 0` (empty settlement — no followers assigned, no events): render `<AutoAdvance onAdvance={advancePhase} />` using the same pattern from `StartEventsPhase`/`OpeningScriptPhase`, so the game doesn't get stuck.
- `advancePhase` is called on user click (non-empty) or immediately (empty).

---

### OBT-3 — Kong Rong visible contacts
**File:** `src/components/level1/VisitAction.tsx`

Root cause: `visibleContacts = contacts.filter(c => c.status !== 'locked')` excludes Kong Rong because its status is always `'locked'` in `INITIAL_CONTACTS`. The `kongRongUnlocked` condition only gates the rejection screen, never exposes Kong Rong.

- Update filter: `c.status !== 'locked' || (c.id === 'kongrong' && conditions.kongRongUnlocked)`
- **Keep** the existing `'kongrong'` branch in `handleSelectContact` — it bypasses the `publicOpinionSet` gate that blocks Mi Zhu and Chen Deng, so it is NOT identical to the default path and must remain.

---

### OBT-4 — Float-up-fade animation + AttrChangePopup refactor
**Files:** `src/index.css`, `src/components/AttrChangePopup.tsx`

Add two CSS keyframe animations to `src/index.css`:

```css
@keyframes float-up-fade {
  from { opacity: 1; transform: translate(-50%, -50%) translateY(0); }
  to   { opacity: 0; transform: translate(-50%, -50%) translateY(-40px); }
}

@keyframes stat-flash {
  0%, 100% { background-color: transparent; }
  35%       { background-color: rgba(250, 204, 21, 0.35); }
}
```

Register in `@theme`:
```css
--animate-float-up-fade: float-up-fade 1.4s ease-out forwards;
--animate-stat-flash: stat-flash 0.9s ease-out forwards;
```

Refactor `AttrChangePopup.tsx`:
- Remove `visible` state, `setTimeout` calls, and Tailwind `transition-*` classes.
- Remove `-translate-x-1/2 -translate-y-1/2` Tailwind classes (the keyframes embed `translate(-50%, -50%)` directly; having both would conflict at mount).
- Apply `animate-float-up-fade` directly to the popup div.
- Use `onAnimationEnd` on the div to call `onDone()`.
- Position `AttrChangePopup` at `top-1/3` (Level 0 attrs) and `StatsDeltaPopup` at `top-1/2` (Level 1 stats) so they don't visually overlap in the concurrent-render case.
---

### OBT-5 — Level 1 stat-change popup system
**Files:**
- `src/store/level1Store.ts`
- `src/components/level1/StatsDeltaPopup.tsx` (new)
- `src/components/level1/StatsPanel.tsx`
- `src/components/level1/Level1Screen.tsx`

**Depends on OBT-4** (reuses `animate-float-up-fade` from `index.css`).

#### Store changes (`level1Store.ts`)
Add to state:
```typescript
pendingStatsDelta: StatsDelta | null;
pendingStatsDeltaKey: number;       // incremented on every applyStatsDelta call
pendingAttrsDelta: Partial<PlayerAttrs> | null;
pendingAttrsDeltaKey: number;       // incremented on every applyAttrsDelta call
```

Actions:
- `applyStatsDelta(delta)` — existing logic unchanged; also set `pendingStatsDelta = delta`, increment `pendingStatsDeltaKey`.
- `applyAttrsDelta(delta)` — existing logic unchanged; also set `pendingAttrsDelta = delta`, increment `pendingAttrsDeltaKey`.
- `clearPendingStatsDelta()` — sets `pendingStatsDelta = null`.
- `clearPendingAttrsDelta()` — sets `pendingAttrsDelta = null`.
- Do NOT add a shared `clearPendingDeltas` — clearing them independently avoids prematurely killing an in-flight animation.

#### New: `StatsDeltaPopup.tsx`
- Similar structure to `AttrChangePopup`.
- Props: `delta: StatsDelta; onDone: () => void`
- Renders non-zero stat changes as lines: `{label} {sign}{value}`.
- Displayed stats (from `STAT_LABELS`): `military`, `rations`, `funds`, `morale`, `support`, `morality`, `talent`.
- `training` / `equipment` deltas: if **either** is non-zero, show one `战力 变化` line (no number). Track with a boolean flag to avoid showing this line twice when both keys are non-zero.
- Applies `animate-float-up-fade` + `onAnimationEnd → onDone`.
- Positioned `fixed top-1/2 left-1/2` (without `-translate-x/y-1/2`; translation is embedded in keyframes).

#### StatsPanel highlight
- Read `pendingStatsDelta` and `pendingStatsDeltaKey` from store.
- Derive `highlightedKeys: Set<string>` from all non-zero keys in the delta (mapping `training`/`equipment` → `combatPower`).
- Each stat row receives a composite React `key` that includes `pendingStatsDeltaKey` — this forces DOM remount on each new delta, restarting the CSS animation reliably.
- When the row key matches a highlighted key, apply `animate-stat-flash` to the row container.

#### Level1Screen changes
- Read `pendingStatsDelta`, `pendingStatsDeltaKey`, `pendingAttrsDelta`, `pendingAttrsDeltaKey` from store.
- When `pendingStatsDelta !== null`, render `<StatsDeltaPopup key={pendingStatsDeltaKey} delta={pendingStatsDelta} onDone={clearPendingStatsDelta} />`.
- When `pendingAttrsDelta !== null`, render `<AttrChangePopup key={pendingAttrsDeltaKey} delta={pendingAttrsDelta} onDone={clearPendingAttrsDelta} />`.
- Using separate keys and separate clear actions means each popup manages its own lifecycle independently.

---

### OBT-6 — Rations game-over fix
**File:** `src/store/level1Store.ts`

Root cause: `advanceRound()` deducts rations via `set(...)` directly — bypassing `applyStatsDelta` — so `checkLoseConditions` is never called.

`checkLoseConditions` is an **imported engine function** (not a store method), called as `checkLoseConditions(stats, conditions, round)`. Do NOT route through `applyStatsDelta` (that would show a redundant popup for the routine round-end deduction).

- In `advanceRound()`, after `set({ ..., stats: { ...stats, territory: { ...territory, rations: newRations } }, ... })`, add:
  ```typescript
  const s = get();
  const loseReason = checkLoseConditions(s.stats, s.conditions, s.round);
  if (loseReason) s.triggerLose(loseReason);
  ```
- In `advancePhase()` (the final-round ration deduction path), apply the same pattern after its `set(...)` call.

---

### OBT-7 — Level 0 iPhone overflow
**File:** `src/components/Level0Narrative.tsx`

Root cause: Safari iOS doesn't honour `overflow-y-auto` on a `flex-1` child unless `min-height: 0` is also set.

- Add `min-h-0` to the scrollable text content div.

---

### OBT-8 — Build verification
- Run `vite build` and confirm zero errors.
- Smoke-check each bug fix path mentally against the source.

## Dependencies

```
OBT-1 → (none)
OBT-2 → (none, but uses ClickToContinue from issue-report-5)
OBT-3 → (none)
OBT-4 → (none)
OBT-5 → OBT-4
OBT-6 → (none)
OBT-7 → (none)
OBT-8 → OBT-1, OBT-2, OBT-3, OBT-4, OBT-5, OBT-6, OBT-7
```

Recommended implementation order: OBT-1 → OBT-2 → OBT-3 → OBT-4 → OBT-5 → OBT-6 → OBT-7 → OBT-8.
