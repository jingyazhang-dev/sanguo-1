import { useMemo } from 'react';
import { useLevel1Store } from '../../store/level1Store';
import { combatPower } from '../../types/level1Types';
import { getStatDisplay, STAT_LABELS } from '../../engine/level1/statDisplay';
import type { StatIdiomKey } from '../../engine/level1/statIdioms';
import type { RoundPhase, StatsDelta } from '../../types/level1Types';

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
  const pendingStatsDelta = useLevel1Store((s) => s.pendingStatsDelta);
  const pendingStatsDeltaKey = useLevel1Store((s) => s.pendingStatsDeltaKey);

  const { publicOpinion, territory } = stats;
  const cp = combatPower(territory);
  const rationDays =
    territory.military > 0
      ? Math.floor(territory.rations / territory.military)
      : null;

  const highlightedKeys = useMemo(() => {
    if (!pendingStatsDelta) return new Set<string>();
    const d: StatsDelta = pendingStatsDelta;
    const keys = new Set<string>();
    if (d.military  !== undefined && d.military  !== 0) keys.add('military');
    if (d.rations   !== undefined && d.rations   !== 0) keys.add('rations');
    if (d.funds     !== undefined && d.funds     !== 0) keys.add('funds');
    if (d.morale    !== undefined && d.morale    !== 0) keys.add('morale');
    if (d.support   !== undefined && d.support   !== 0) keys.add('support');
    if (d.morality  !== undefined && d.morality  !== 0) keys.add('morality');
    if (d.talent    !== undefined && d.talent    !== 0) keys.add('talent');
    if ((d.training !== undefined && d.training  !== 0) ||
        (d.equipment !== undefined && d.equipment !== 0)) keys.add('combatPower');
    return keys;
  }, [pendingStatsDelta]);

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
          <StatNumberPair
            key={highlightedKeys.has('military') ? `military-${pendingStatsDeltaKey}` : 'military'}
            statKey="military" value={territory.military}
            highlighted={highlightedKeys.has('military')}
          />
          <StatNumberPair
            key={highlightedKeys.has('rations') ? `rations-${pendingStatsDeltaKey}` : 'rations'}
            statKey="rations" value={rationDays} suffix="日"
            highlighted={highlightedKeys.has('rations')}
          />
          <StatNumberPair
            key={highlightedKeys.has('funds') ? `funds-${pendingStatsDeltaKey}` : 'funds'}
            statKey="funds" value={territory.funds}
            highlighted={highlightedKeys.has('funds')}
          />
        </div>
        {/* Column 2: combat-related idiom stats */}
        <div className="space-y-0.5">
          <StatIdiomPair
            key={highlightedKeys.has('combatPower') ? `combatPower-${pendingStatsDeltaKey}` : 'combatPower'}
            statKey="combatPower" value={cp}
            highlighted={highlightedKeys.has('combatPower')}
          />
          <StatIdiomPair
            key={highlightedKeys.has('morale') ? `morale-${pendingStatsDeltaKey}` : 'morale'}
            statKey="morale" value={territory.morale}
            highlighted={highlightedKeys.has('morale')}
          />
          <StatIdiomPair
            key={highlightedKeys.has('support') ? `support-${pendingStatsDeltaKey}` : 'support'}
            statKey="support" value={territory.support}
            highlighted={highlightedKeys.has('support')}
          />
        </div>
        {/* Column 3: reputation idiom stats */}
        <div className="space-y-0.5">
          <StatIdiomPair
            key={highlightedKeys.has('morality') ? `morality-${pendingStatsDeltaKey}` : 'morality'}
            statKey="morality" value={publicOpinion.morality}
            highlighted={highlightedKeys.has('morality')}
          />
          <StatIdiomPair
            key={highlightedKeys.has('talent') ? `talent-${pendingStatsDeltaKey}` : 'talent'}
            statKey="talent" value={publicOpinion.talent}
            highlighted={highlightedKeys.has('talent')}
          />
        </div>
      </div>
    </aside>
  );
}

function StatIdiomPair({ statKey, value, highlighted }: { statKey: StatIdiomKey; value: number; highlighted?: boolean }) {
  const { idiom, colorClass } = getStatDisplay(statKey, value);
  return (
    <div className={`whitespace-nowrap${highlighted ? ' animate-stat-flash rounded px-0.5' : ''}`}>
      <span className="text-stone-500">{STAT_LABELS[statKey]}：</span>
      <span className={`font-bold ${colorClass}`}>{idiom}</span>
    </div>
  );
}

function StatNumberPair({ statKey, value, suffix, highlighted }: { statKey: StatIdiomKey; value: number | null; suffix?: string; highlighted?: boolean }) {
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
    <div className={`whitespace-nowrap${highlighted ? ' animate-stat-flash rounded px-0.5' : ''}`}>
      <span className="text-stone-500">{STAT_LABELS[statKey]}：</span>
      <span className={`font-bold ${colorClass}`}>{value.toLocaleString()}{suffix ?? ''}</span>
    </div>
  );
}
