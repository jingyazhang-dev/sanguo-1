# Issue Report 6 — Implementation Plan

## Problem Statement

Five issues were raised; after Defend step:
- **Issue #1** (full-screen click like Level 0): **Dismissed** — content-area click is sufficient
- **Issue #2** (settlement items replace each other): **Accepted** — items should accumulate as a scrollable log; auto-scroll to bottom; auto-advance after last item
- **Issue #3** (D20 conclusion "继续" button): **Skipped** — explicit button adds dramatic weight; kept as-is
- **Issue #4** (StatsPanel 3-column layout): **Accepted** — col1: 兵/粮/钱, col2: 战力/士气/民心, col3: 德行/才学
- **Issue #5** (round info merged into StatsPanel): **Accepted** — single centered line at top of panel; RoundHeader component removed

## Design Decisions

### Issue #2: SettlementPhase accumulation
- Add `completedItems: { key: string; paragraphs: string[] }[]` state
- On `handleStepDone`: push current item's paragraphs to `completedItems`, apply deltas, advance step
- Render: completed items as static paragraphs + current `<EventDisplay>` below
- Fixed `max-h-[55vh] overflow-y-auto` scroll container
- `useRef` + `scrollIntoView('smooth')` auto-scrolls to bottom when `completedItems` changes
- After last item completes: step → 'done'; auto-advance with 600ms delay so user sees final log
- Assassin narrative/D20/survived states: unchanged (show full-screen, hide accumulated log)

### Issue #4: StatsPanel 3-column layout
- `grid grid-cols-3` replacing current `grid-cols-2`
- Column 1: `StatNumberPair` for 兵力 / 粮草 / 钱粮
- Column 2: `StatIdiomPair` for 战力 / 士气 / 民心
- Column 3: `StatIdiomPair` for 德行 / 才学

### Issue #5: Round info merged into StatsPanel
- Copy `getRoundDate`, `PHASE_LABELS`, `XUN_NAMES`, `MONTH_NAMES` from `RoundHeader.tsx` into `StatsPanel.tsx`
- Add selectors for `round`, `daysLeft`, `phase`
- Render a centered top row: `六月上旬 · 余60日 · 军议`
- Remove `<RoundHeader />` from `Level1Screen.tsx`
- Delete `RoundHeader.tsx`

## One-Bite Tasks (OBTs)

### OBT-1: SettlementPhase — accumulate items as scrollable log
- File: `src/components/level1/SettlementPhase.tsx`
- Add `completedItems` state and `logEndRef`
- Modify `handleStepDone` to push current item to `completedItems` before advancing
- Add `useEffect` to auto-scroll `logEndRef` when `completedItems` changes
- Change render for `taskReport`/`endEvents` steps: show completed log + current EventDisplay
- Change `step.kind === 'done'` early return: show completed log with 600ms auto-advance delay
- Keep assassin narrative/D20/survived renders unchanged

### OBT-2: StatsPanel — 3-column layout + round info row; remove RoundHeader
- File: `src/components/level1/StatsPanel.tsx`
  - Copy round helpers from RoundHeader; add `round`, `daysLeft`, `phase` store selectors
  - Add centered round-info row above the grid
  - Change grid to 3 columns: col1=numbers, col2=战/气/民 idioms, col3=德/才 idioms
- File: `src/components/level1/Level1Screen.tsx`
  - Remove `<RoundHeader />` and its import
- Delete: `src/components/level1/RoundHeader.tsx`

### OBT-3: Build verification
- Run `vite build` and confirm zero errors

## Dependencies
- OBT-1 independent
- OBT-2 independent
- OBT-3 depends on OBT-1 and OBT-2
