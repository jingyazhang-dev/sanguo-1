# Issue Report 4 — Implementation Plan

## Problem Statement
8 UX/visual issues in Level 0 and Level 1. Core themes: mobile rendering fixes, replacing raw numeric stats with Chinese idioms and a 10-level color scheme, modernizing the standup UI to an approve/reassign flow with accumulated history, and switching the round display to ancient Chinese dates.

## Design Decisions (confirmed with user)
1. **L0 bottom overflow** → Add bottom padding with `safe-area-inset-bottom` for iOS safety
2. **L0 instant result text** → Fix click propagation bug: `ChoiceNodeRenderer` onClick bubbles to parent's `skipCurrent()`
3. **L1 player attributes** → Remove from StatsPanel; shown on D20Check screens (already there). Note: follower attrs in PatrolAction companion-select are intentionally kept (they're follower stats, not player stats).
4. **L1 stat idioms** → 8 stats × 10 levels = 80 unique thematic 4-character Chinese idioms (成语). Display: `士气：<colored idiom>` (label uncolored, idiom colored)
5. **L1 round date** → Derive programmatically from round number: `month = 6 + floor((round-1)/3)`, `旬 = (round-1)%3` → 上旬/中旬/下旬. Format: "六月上旬 · 余X日". Keep phase label in center.
6. **L1 color scheme** → 10-level gradient: dark-red → red → gray → near-black (#333) → dark-green → light-green → blue → cyan → orange → golden. Level 4 uses #333 instead of pure black to distinguish from body text (#1a1a1a).
7. **L1 standup approve/reassign** → Two-step: "核准" / "改派". Clicking "改派" replaces both buttons with task pills (no way back except picking a task — proposed task is in the list).
8. **L1 standup accumulation** → Previous assignments as dimmed lines; accumulated state cleared on "重议" restart.

## Stats covered by idioms
- **公论**: 德行 (morality, 0–100), 才学 (talent, 0–100)
- **领地**: 兵力 (military, headcount), 战力 (combat power, 0–100), 士气 (morale, 0–100), 粮草 (rations, displayed as days), 钱粮 (funds), 民心 (support, 0–100)
- **Edge case**: When military=0, rations display shows a special neutral idiom ("无兵无粮" or similar) since 0 ration-days is not meaningful.

## Reviewer feedback addressed
- Tailwind v4 `@theme` colors defined in `src/index.css` (OBT-3)
- Idioms constrained to exactly 4 characters (standard 成语 format)
- Round→date derived programmatically from `TOTAL_ROUNDS` constant
- Phase label retained in RoundHeader center
- `handleRestart` clears accumulated assignment state (OBT-7+8 merged)
- Safe-area-inset-bottom for iOS (OBT-2)
- Near-black (#333) instead of pure black for level 4 color
- Follower attrs in PatrolAction companion-select are intentional (not player attrs)
- Opening script narrative implication of rounds left is out-of-scope (handled by existing "余X日")

## OBT Breakdown

### OBT-1: Fix click propagation in ChoiceNodeRenderer (Issue #2)
**Files**: `src/components/TypeInRenderer/ChoiceNodeRenderer.tsx`
- Add `e.stopPropagation()` to the choice span's `onClick` handler (only onClick causes the bug — onKeyDown doesn't bubble to the parent's click handler)
- This prevents the click from bubbling to Level0Narrative's `handleContentClick` → `skipCurrent()`

### OBT-2: Add L0 bottom padding + iOS safe area (Issue #1)
**Files**: `src/components/Level0Narrative.tsx`
- Add bottom padding to the scrollable content div using `pb-24` combined with `safe-area-inset-bottom`
- Use Tailwind's arbitrary value: `pb-[max(6rem,env(safe-area-inset-bottom,6rem))]`
- Padding is on the CONTENT inside the scrollable div (not the container), ensuring scrollable space

### OBT-3: Idiom data + color scheme utility (Issues #4, #6)
**Files**: 
- `src/index.css` (MODIFIED) — Add `@theme` block with 10 custom stat colors for Tailwind v4
- `src/engine/level1/statIdioms.ts` (NEW) — narrator-written 4-character idioms for 8 stats × 10 levels
- `src/engine/level1/statDisplay.ts` (NEW) — `getStatDisplay(statKey, value)` returns `{ level: 1-10, idiom: string, colorClass: string }`
  - For 0–100 stats: thresholds at [0, 10, 20, 30, 40, 50, 60, 70, 80, 90]
  - For military: thresholds for expected range (~200–2000)
  - For rations (days): thresholds for expected range (0–120 days)
  - For funds: thresholds for expected range (~100–10000)
  - For combat power: thresholds at [0, 10, 20, 30, 40, 50, 60, 70, 80, 90]
  - Special case: military=0 → neutral rations idiom
- Color mapping: level 1=#8B0000, 2=#DC2626, 3=#9CA3AF, 4=#333333, 5=#166534, 6=#4ADE80, 7=#2563EB, 8=#06B6D4, 9=#EA580C, 10=#CA8A04
- Commission narrator agent for the 80 idioms (4 characters each, thematic per stat)

### OBT-4: Redesign StatsPanel (Issues #3, #4, #6)
**Files**: `src/components/level1/StatsPanel.tsx`
- Remove 属性 column and `attrs` store subscription
- 2-column grid: 公论 | 领地
- Each stat: `<label>：<colored idiom>` using `getStatDisplay()` utility
- Combat power derived as before, ration days derived as before — both fed through idiom system
- Dependencies: OBT-3

### OBT-5: Round date format (Issue #5)
**Files**: `src/components/level1/RoundHeader.tsx`
- Add `getRoundDate(round)` helper: derives month and 旬 from round number using `TOTAL_ROUNDS`
- Left side: "六月上旬 · 余X日" (integrated date + days-left)
- Center: keep `PHASE_LABELS[phase]` as-is
- Right side: removed (days-left is now integrated into left side)

### OBT-6: Verify D20 attribute display (Issue #3 support)
**Files**: verify `src/components/level1/D20Check.tsx`, `src/components/level1/PatrolAction.tsx`
- Smoke test: D20Check already shows "检定属性：力量 14 (+4)" — confirm this is the only needed display
- Verify attrs are passed correctly from PatrolAction → D20Check after StatsPanel removal
- No code changes expected — this is a verification OBT

### OBT-7: Standup approve/reassign + accumulation (Issues #7, #8)
**Files**: `src/components/level1/StandupPhase.tsx`
- **Approve/reassign**: After narrative types out, show "核准" and "改派" buttons. "核准" accepts proposal → advances. "改派" replaces buttons with task pill list. Picking any task (including the proposed one) advances.
- **Accumulation**: Track `completedAssignments: Array<{name, task}>` in state. Render above active follower as dimmed lines: `关羽领命：练兵`. Use a ref to scroll active follower into view after each transition.
- **Restart**: `handleRestart` clears `completedAssignments`, resets to follower 0
- Add `reassigning: boolean` to the proposal step type
- Summary step unchanged

### OBT-8: Build verification + tech review
- `npx tsc --noEmit` — type check
- `npx vite build` — production build
- Commission tech reviewer for full review of all changes
