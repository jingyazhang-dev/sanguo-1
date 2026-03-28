# Issue Report 3 — Implementation Plan

## Problem Statement
7 UX/visual issues that make the game feel too "web-like" rather than an immersive literary game experience.

## Design Decisions (confirmed with user)
1. **Speed controls** → overlay at top-right of viewport, more visible styling
2. **Attr change popup** → bigger, center-screen, green/red colored numbers
3. **Standup** → fully typewriter-narrated with sequential follower proposals; narrator writes unique lines per character
4. **Stats panel** → horizontal top bar below RoundHeader (no sidebar)
5. **Level 1 cover** → new component with chapter1.png + level title "徐州之龙"
6. **Viewport** → h-screen + overflow-hidden on root for all screens; internal scroll where needed
7. **Free action result** → keep action result visible until player clicks to dismiss

---

## OBT Breakdown

### obt-1: Viewport lock (Issue #6)
- **Files**: `src/index.css`, `src/components/TitleScreen.tsx`, `src/components/Level0Cover.tsx`, `src/components/Level0Narrative.tsx`, `src/components/level1/Level1Screen.tsx`
- **Changes**:
  - `index.css`: add `overflow: hidden; height: 100vh;` to `#root`
  - Each screen component: change `min-h-screen` → `h-full` on root div
  - Each screen with scrollable content: add `overflow-y-auto` on the scrollable inner container
  - Level0Narrative: wrap TypeInRenderer content area in `overflow-y-auto flex-1`
  - Level1Screen main pane: `overflow-y-auto flex-1`
- **Note**: This is foundational — all other layout OBTs depend on this.

### obt-2: Speed controls repositioned (Issue #1)
- **Files**: `src/components/Level0Narrative.tsx`
- **Changes**: Move speed buttons from `fixed bottom-5 right-5` to `fixed top-4 right-4`. Increase button size (text-sm, px-3 py-1.5). Add a subtle "速" label. Increase z-index to 50.

### obt-3: Attr change popup restyle (Issue #2)
- **Files**: `src/components/AttrChangePopup.tsx`
- **Changes**:
  - Position: `fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2` (true center)
  - Size: `text-xl` for numbers, `text-lg` for labels
  - Restructure render from `changes.join('\u3000')` to `changes.map(...)` returning `<span>` elements with conditional color: `text-emerald-600` for positive, `text-red-600` for negative
  - Add scale-in animation via Tailwind transition
  - Keep 2s auto-dismiss

### obt-4: Level 1 cover screen (Issue #5)
- **Files**: `src/components/level1/Level1Cover.tsx` (new), `src/components/level1/Level1Screen.tsx`, `src/components/level1/RoundHeader.tsx`, `src/types/level1Types.ts`, `src/store/level1Store.ts`
- **Changes**:
  - Add `'cover'` to `RoundPhase` union type
  - `level1Store.ts` → `buildInitialState()`: set `phase: 'cover'`
  - `level1Store.ts` → `advancePhase()`: special-case `'cover'` → `'startEvents'` (do NOT add `'cover'` to `PHASE_ORDER`)
  - `RoundHeader.tsx` → add `cover: '卷首'` to `PHASE_LABELS`
  - New `Level1Cover`: shows `chapter1.png`, title "第一章 · 徐州之龙", click-to-continue (follows Level0Cover pattern)
  - `Level1Screen.tsx`: early-return `<Level1Cover />` when `phase === 'cover'` (before RoundHeader + StatsPanel layout)

### obt-5: Stats panel horizontal layout (Issue #4)
- **Files**: `src/components/level1/StatsPanel.tsx`, `src/components/level1/Level1Screen.tsx`
- **Changes**:
  - StatsPanel: horizontal 3-section grid (属性 | 公论 | 领地) using CSS grid, compact text-xs
  - On mobile (< md): 2-row grid layout; on desktop: single row
  - Level1Screen: remove sidebar `flex-row`, stack vertically: RoundHeader → StatsPanel → main (flex-1 overflow-y-auto)
  - Clear border-b separation between stats and content

### obt-6: Standup narrative redesign (Issue #3)
- **Files**: `src/components/level1/StandupPhase.tsx`, `src/engine/level1/dialogues/standupDialogues.ts` (new)
- **Changes**:
  - New `standupDialogues.ts`: narrator-written proposal lines per follower per task type (commissioned via narrator agent)
  - StandupPhase rewrite as sequential typewriter narration:
    1. Intro narrative via EventDisplay → "诸将入帐…"
    2. Per-follower: EventDisplay shows their proposal narrative → after typing done, show task options as styled pill buttons (external to TypeInRenderer, coordinated via onDone callback)
    3. Player selects task → next follower
    4. After all followers: summary step showing all assignments with option to restart or confirm ("下令")
  - Task choice buttons: rendered as React elements outside TypeInRenderer (not ChoiceNode), shown after EventDisplay.onDone fires
  - Summary/confirm step at end provides review + redo capability (addresses undo concern)
  - Preserves same `StandupAssignments` output to store

### obt-7: Free action result persistence (Issue #7)
- **Files**: `src/components/level1/PatrolAction.tsx`
- **Changes**:
  - D20 result path: add `narrated` state; `EventDisplay.onDone` sets `narrated=true` instead of calling `onDone` directly; show "继续" button when narrated
  - No-D20 path: merge `narrative` and `done` steps — keep EventDisplay visible, add "继续" button below after narration finishes (instead of unmounting narrative and showing separate "done" text)
  - TalkAction and VisitAction already handle this correctly

### obt-8: Final build verification
- TypeScript check (`npx tsc --noEmit`)
- Production build (`npx vite build`)

---

## Dependencies
- obt-1 (viewport) is foundational → all layout OBTs
- obt-4 (cover) → obt-5 (stats panel) — cover adds phase, layout must handle it
- obt-5, obt-6 are soft-dependent (can be parallelized if needed)
- obt-2, obt-3, obt-7 are independent of Level 1 layout changes
- obt-6 depends on narrator content (standupDialogues.ts)
- obt-8 depends on all others
