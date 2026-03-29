import { useLevel1Store } from '../../store/level1Store';
import { combatPower } from '../../types/level1Types';
import { getStatDisplay, STAT_LABELS } from '../../engine/level1/statDisplay';
import type { StatIdiomKey } from '../../engine/level1/statIdioms';
import type { RoundPhase } from '../../types/level1Types';

/* ── Round info helpers (moved from RoundHeader) ─────────── */

const PHASE_LABELS: Record<RoundPhase, string> = {
  cover: '卷首',
  startEvents: '旬初事件',
  openingScript: '旬初叙事',
  standup: '军议',
  freeAction: '自由行动',
  endingEvents: '旬末结算',
  levelEnd: '关卡结算',
};

const XUN_NAMES = ['上旬', '中旬', '下旬'] as const;
const MONTH_NAMES = ['六月', '七月', '八月', '九月', '十月', '十一月', '十二月'] as const;

function getRoundDate(round: number): string {
  const monthIdx = Math.floor((round - 1) / 3);
  const xunIdx = (round - 1) % 3;
  const month = MONTH_NAMES[monthIdx] ?? MONTH_NAMES[MONTH_NAMES.length - 1];
  const xun = XUN_NAMES[xunIdx] ?? XUN_NAMES[0];
  return `${month}${xun}`;
}

/* ── Component ───────────────────────────────────────────── */

export function StatsPanel() {
  const stats = useLevel1Store((s) => s.stats);
  const round = useLevel1Store((s) => s.round);
  const daysLeft = useLevel1Store((s) => s.daysLeft);
  const phase = useLevel1Store((s) => s.phase);

  const { publicOpinion, territory } = stats;
  const cp = combatPower(territory);
  const rationDays =
    territory.military > 0
      ? Math.floor(territory.rations / territory.military)
      : null;

  return (
    <aside className="w-full flex-shrink-0 border-b border-stone-200 px-3 py-2">
      {/* Round info row */}
      <p className="text-xs text-stone-500 text-center mb-1 font-serif tracking-wide">
        {getRoundDate(round)} · 余{daysLeft}日 · {PHASE_LABELS[phase]}
      </p>
      {/* Stats grid: 3 columns */}
      <div className="grid grid-cols-3 gap-x-2 gap-y-0.5 text-xs max-w-2xl mx-auto">
        {/* Column 1: numbered resource stats */}
        <div className="space-y-0.5">
          <StatNumberPair statKey="military" value={territory.military} />
          <StatNumberPair statKey="rations" value={rationDays} suffix="日" />
          <StatNumberPair statKey="funds" value={territory.funds} />
        </div>
        {/* Column 2: combat-related idiom stats */}
        <div className="space-y-0.5">
          <StatIdiomPair statKey="combatPower" value={cp} />
          <StatIdiomPair statKey="morale" value={territory.morale} />
          <StatIdiomPair statKey="support" value={territory.support} />
        </div>
        {/* Column 3: reputation idiom stats */}
        <div className="space-y-0.5">
          <StatIdiomPair statKey="morality" value={publicOpinion.morality} />
          <StatIdiomPair statKey="talent" value={publicOpinion.talent} />
        </div>
      </div>
    </aside>
  );
}

function StatIdiomPair({ statKey, value }: { statKey: StatIdiomKey; value: number }) {
  const { idiom, colorClass } = getStatDisplay(statKey, value);
  return (
    <div className="whitespace-nowrap">
      <span className="text-stone-500">{STAT_LABELS[statKey]}：</span>
      <span className={`font-bold ${colorClass}`}>{idiom}</span>
    </div>
  );
}

function StatNumberPair({ statKey, value, suffix }: { statKey: StatIdiomKey; value: number | null; suffix?: string }) {
  if (value === null) {
    return (
      <div className="whitespace-nowrap">
        <span className="text-stone-500">{STAT_LABELS[statKey]}：</span>
        <span className="text-stone-400">—</span>
      </div>
    );
  }
  const { colorClass } = getStatDisplay(statKey, value);
  return (
    <div className="whitespace-nowrap">
      <span className="text-stone-500">{STAT_LABELS[statKey]}：</span>
      <span className={`font-bold ${colorClass}`}>{value.toLocaleString()}{suffix ?? ''}</span>
    </div>
  );
}
