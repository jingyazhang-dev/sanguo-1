# Issue Report 8 — Implementation Plan

## Problem Statement

Five UI polish issues across the popup system and StatsPanel:

1. **Popup disappears too fast** — current `float-up-fade` animation is 1.4s total. User wants 3s hold, then 0.75s fade+float (3.75s total).
2. **Round/days not prominent enough** — the compact `text-xs` info line buries the most critical info. Needs larger date+days text; days < 4 shown in dark red.
3. **Popup color convention** — positive deltas currently shown in `text-red-700`, negatives in `text-stone-400`. Switch to green for gain, dark red for loss.
4. **Idiom stats lack raw number** — `战力：行伍不整` should be `战力：行伍不整(23)`.
5. **Free action heading breaks immersion** — replace `"自由行动" + "余x日"` with a short classical Chinese hint line varying by days remaining.

## Accepted Defend outcomes

- All 5 issues accepted.
- Issue 1: compromise 3 seconds (not 5).
- Issue 5: narrator agent writes the hint lines.

## Design decisions

| Issue | Decision |
|-------|----------|
| 1 | Hold at full opacity 0–80% (3s), fade+float 80–100% (0.75s); total 3.75s |
| 2 | Two sub-rows: larger font for date+days; smaller phase label below. `daysLeft < 4` → `text-red-800` on the days number |
| 3 | `text-green-700` for positive, `text-red-800` for negative (both popups) |
| 4 | `{idiom}({value})` — raw number in muted parenthetical after idiom |
| 5 | Single centered hint line from narrator; lines vary for 7 down to 1 day |

## One-Bite Tasks (OBTs)

### OBT-1 — Extend popup animation to 3.75s
**File:** `src/index.css`

- Change `--animate-float-up-fade` duration from `1.4s` to `3.75s`.
- Update `@keyframes float-up-fade` to hold at `0%, 80%` (fully visible), then fade+float at `100%`:
  ```css
  @keyframes float-up-fade {
    0%, 80% { opacity: 1; transform: translate(-50%, -50%) translateY(0); }
    100%     { opacity: 0; transform: translate(-50%, -50%) translateY(-40px); }
  }
  ```

---

### OBT-2 — Round/days prominence in StatsPanel
**File:** `src/components/level1/StatsPanel.tsx`

Replace the single compact info line with two sub-rows:
- **Row 1 (prominent):** `{date}` · 余`{daysLeft}`日 — using larger font (e.g., `text-sm font-bold`). The `{daysLeft}` number gets `text-red-800` when `daysLeft < 4`, otherwise `text-stone-700`.
- **Row 2 (subtle):** phase label only, `text-xs text-stone-400`.

---

### OBT-3 — Popup color: green for +, dark red for −
**Files:** `src/components/AttrChangePopup.tsx`, `src/components/level1/StatsDeltaPopup.tsx`

- Positive delta (`val > 0`): change `text-red-700` → `text-green-700`
- Negative delta (`val < 0`): change `text-stone-400` → `text-red-800`

---

### OBT-4 — Show raw number after idiom in StatsPanel
**File:** `src/components/level1/StatsPanel.tsx`

In `StatIdiomPair`, change the idiom display to `{idiom}({value})`:
```tsx
<span className={`font-bold ${colorClass}`}>{idiom}</span>
<span className="text-stone-400 text-[0.7em]">({value})</span>
```

---

### OBT-5 — Free action narrative hint lines
**File:** `src/components/level1/FreeActionPhase.tsx`

- Remove the `<h3>自由行动</h3>` heading and `<p>余 x 日</p>` subtext.
- Add a `const FREE_ACTION_HINTS: Record<number, string>` map with narrator-provided lines for 7..1 (fallback for other values).
- Show a single `<p>` hint line above the action buttons.
- Narrator lines to be filled in once the narrator agent responds.

---

### OBT-6 — Build verification
- Run `npm run build` and confirm zero TypeScript errors.

## Dependencies

```
OBT-1 → (none)
OBT-2 → (none)
OBT-3 → (none)
OBT-4 → (none)
OBT-5 → narrator output (external)
OBT-6 → OBT-1, OBT-2, OBT-3, OBT-4, OBT-5
```

Recommended order: OBT-1 → OBT-2 → OBT-3 → OBT-4 → OBT-5 → OBT-6
