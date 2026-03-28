import { useLevel1Store } from '../../store/level1Store';
import type { RoundPhase } from '../../types/level1Types';

const PHASE_LABELS: Record<RoundPhase, string> = {
  cover: '卷首',
  startEvents: '旬初事件',
  openingScript: '旬初叙事',
  standup: '军议',
  freeAction: '自由行动',
  endingEvents: '旬末事件',
  levelEnd: '关卡结算',
};

const XUN_NAMES = ['上旬', '中旬', '下旬'] as const;
const MONTH_NAMES = ['六月', '七月', '八月', '九月', '十月', '十一月', '十二月'] as const;

/** Derives ancient Chinese date from 1-based round number. Round 1 = 六月上旬. */
function getRoundDate(round: number): string {
  const monthIdx = Math.floor((round - 1) / 3);
  const xunIdx = (round - 1) % 3;
  const month = MONTH_NAMES[monthIdx] ?? MONTH_NAMES[MONTH_NAMES.length - 1];
  const xun = XUN_NAMES[xunIdx] ?? XUN_NAMES[0];
  return `${month}${xun}`;
}

export function RoundHeader() {
  const round = useLevel1Store((s) => s.round);
  const daysLeft = useLevel1Store((s) => s.daysLeft);
  const phase = useLevel1Store((s) => s.phase);

  return (
    <header className="w-full px-4 py-2 flex items-center justify-between border-b border-stone-200 text-sm font-serif text-stone-600">
      <span>{getRoundDate(round)} · 余{daysLeft}日</span>
      <span>{PHASE_LABELS[phase]}</span>
    </header>
  );
}
