# Issue Report 5 — Implementation Plan

## Issues Addressed

| # | Issue | Status |
|---|-------|--------|
| 1 | Multi-line start event text accumulation | **DEFERRED** — user to investigate further |
| 2 | Click to continue between start events→opening script, opening script→standup | **DONE** |
| 3 | Standup intro text should persist during follower proposals | **DONE** |
| 4 | Military/rations/funds should use raw numbers instead of idioms | **DONE** |

## Design Decisions

### Issue #2: Click to Continue
- Created reusable `ClickToContinue` component with subtle pulsing "▼ 点击继续" text
- `StartEventsPhase` and `OpeningScriptPhase` show the prompt after narration finishes
- Clicking the prompt advances to the next phase (no more auto-advance)

### Issue #3: Standup Intro Persistence
- Added `introDone` state flag to `StandupPhase`
- When intro narration finishes, the text is re-rendered as a static paragraph (normal text styling) above the proposal content
- Persists through all proposal steps

### Issue #4: StatsPanel Raw Numbers
- Left column: numbered resource stats (兵力 raw count, 粮草 days left + "日", 钱粮 raw count)
- Right column: idiom-based qualitative stats (德行, 才学, 战力, 士气, 民心)
- All stats retain 10-level color coding
- Edge case: when military is 0, rations show "—" instead of a sentinel value

## Changed Files
- `src/components/level1/ClickToContinue.tsx` (new)
- `src/components/level1/StartEventsPhase.tsx` (modified)
- `src/components/level1/OpeningScriptPhase.tsx` (modified)
- `src/components/level1/StandupPhase.tsx` (modified)
- `src/components/level1/StatsPanel.tsx` (modified)
