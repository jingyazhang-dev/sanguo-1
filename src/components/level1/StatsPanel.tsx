import { useLevel1Store } from '../../store/level1Store';
import { combatPower } from '../../types/level1Types';
import { getStatDisplay, STAT_LABELS } from '../../engine/level1/statDisplay';
import type { StatIdiomKey } from '../../engine/level1/statIdioms';

export function StatsPanel() {
  const stats = useLevel1Store((s) => s.stats);

  const { publicOpinion, territory } = stats;
  const cp = combatPower(territory);
  const rationDays =
    territory.military > 0
      ? Math.floor(territory.rations / territory.military)
      : territory.rations > 0 ? 999 : 0;

  return (
    <aside className="w-full flex-shrink-0 border-b border-stone-200 px-3 py-2">
      <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs max-w-2xl mx-auto">
        <StatIdiomPair statKey="morality" value={publicOpinion.morality} />
        <StatIdiomPair statKey="military" value={territory.military} />
        <StatIdiomPair statKey="talent" value={publicOpinion.talent} />
        <StatIdiomPair statKey="combatPower" value={cp} />
        <StatIdiomPair statKey="support" value={territory.support} />
        <StatIdiomPair statKey="morale" value={territory.morale} />
        <StatIdiomPair statKey="rations" value={rationDays} />
        <StatIdiomPair statKey="funds" value={territory.funds} />
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
