import { useState, useEffect, useCallback, useRef } from 'react';
import { useLevel1Store } from '../../store/level1Store';
import { calculateTaskResult } from '../../engine/level1/primaryTaskEngine';
import { getScriptedEndEvents } from '../../engine/level1/events/scriptedEvents';
import { selectRandomRoundEvent } from '../../engine/level1/events/randomEvents';
import { checkAssassinEncounter, ASSASSIN_D20_DIFFICULTY } from '../../engine/level1/loseCheckEngine';
import { EventDisplay } from './EventDisplay';
import { D20Check } from './D20Check';
import type { PrimaryTaskResult, GameEvent, LoseReason } from '../../types/level1Types';

/* ── Step state machine ─────────────────────────────────────── */

type Step =
  | { kind: 'taskReport'; index: number }
  | { kind: 'endEvents'; eventIndex: number }
  | { kind: 'assassinNarrative'; assassinType: 'assassin_local' | 'assassin_chen' }
  | { kind: 'assassinD20'; assassinType: 'assassin_local' | 'assassin_chen' }
  | { kind: 'assassinSurvived' }
  | { kind: 'done' };

/* ── Pre-computed data (stable across re-renders) ───────────── */

interface SettlementData {
  taskReports: PrimaryTaskResult[];
  endEvents: GameEvent[];
}

/* ── Component ──────────────────────────────────────────────── */

export function SettlementPhase() {
  /* ── Store selectors ──────────────────────────────────────── */

  const followers = useLevel1Store((s) => s.followers);
  const stats = useLevel1Store((s) => s.stats);
  const conditions = useLevel1Store((s) => s.conditions);
  const round = useLevel1Store((s) => s.round);
  const applyStatsDelta = useLevel1Store((s) => s.applyStatsDelta);
  const applyAttrsDelta = useLevel1Store((s) => s.applyAttrsDelta);
  const updateConditions = useLevel1Store((s) => s.updateConditions);
  const triggerLose = useLevel1Store((s) => s.triggerLose);
  const attrs = useLevel1Store((s) => s.attrs);
  const advancePhase = useLevel1Store((s) => s.advancePhase);

  /* ── One-time computation (ref ensures stable across renders) */

  const dataRef = useRef<SettlementData | null>(null);
  if (dataRef.current === null) {
    const reports: PrimaryTaskResult[] = [];
    for (const f of followers) {
      if (f.assignedTask) {
        reports.push(calculateTaskResult(f.assignedTask, f, stats, round));
      }
    }

    const scripted = getScriptedEndEvents(round);
    const random = selectRandomRoundEvent(stats, conditions, round);
    const events: GameEvent[] = [...scripted];
    if (random) events.push(random);

    dataRef.current = { taskReports: reports, endEvents: events };
  }

  const { taskReports, endEvents } = dataRef.current;

  /* ── Step state ───────────────────────────────────────────── */

  const [step, setStep] = useState<Step>(() => {
    if (taskReports.length > 0) return { kind: 'taskReport', index: 0 };
    if (endEvents.length > 0) return { kind: 'endEvents', eventIndex: 0 };
    return { kind: 'done' };
  });

  // Auto-advance when nothing to show
  useEffect(() => {
    if (step.kind === 'done') {
      advancePhase();
    }
  }, [step, advancePhase]);

  /* ── Transition to assassin check or advance ──────────────── */

  const transitionAfterEvents = useCallback(() => {
    // One deliberate assassin check per round
    const { stats: curStats, conditions: curConds } = useLevel1Store.getState();
    const assassin = checkAssassinEncounter(curStats, curConds);
    if (assassin) {
      setStep({ kind: 'assassinNarrative', assassinType: assassin });
    } else {
      setStep({ kind: 'done' });
    }
  }, []);

  /* ── Step completion handler ──────────────────────────────── */

  const handleStepDone = useCallback(() => {
    if (step.kind === 'taskReport') {
      const report = taskReports[step.index];

      // Apply deltas
      applyStatsDelta(report.statsDelta);
      if (report.attrsDelta) applyAttrsDelta(report.attrsDelta);
      if (report.conditionChanges) updateConditions(report.conditionChanges);

      // Advance to next task report, or end events, or assassin check
      const nextIdx = step.index + 1;
      if (nextIdx < taskReports.length) {
        setStep({ kind: 'taskReport', index: nextIdx });
      } else if (endEvents.length > 0) {
        setStep({ kind: 'endEvents', eventIndex: 0 });
      } else {
        transitionAfterEvents();
      }
    } else if (step.kind === 'endEvents') {
      const event = endEvents[step.eventIndex];

      // Apply deltas
      if (event.statsDelta) applyStatsDelta(event.statsDelta);
      if (event.attrsDelta) applyAttrsDelta(event.attrsDelta);
      if (event.conditionChanges) updateConditions(event.conditionChanges);

      // Advance to next end event, or assassin check
      const nextIdx = step.eventIndex + 1;
      if (nextIdx < endEvents.length) {
        setStep({ kind: 'endEvents', eventIndex: nextIdx });
      } else {
        transitionAfterEvents();
      }
    }
  }, [step, taskReports, endEvents, applyStatsDelta, applyAttrsDelta, updateConditions, transitionAfterEvents]);

  const handleAssassinNarrativeDone = useCallback(() => {
    if (step.kind === 'assassinNarrative') {
      setStep({ kind: 'assassinD20', assassinType: step.assassinType });
    }
  }, [step]);

  const handleAssassinD20Result = useCallback(
    (success: boolean) => {
      if (success) {
        setStep({ kind: 'assassinSurvived' });
      } else if (step.kind === 'assassinD20') {
        triggerLose(step.assassinType as LoseReason);
      }
    },
    [step, triggerLose],
  );

  const handleSurvivedDone = useCallback(() => {
    setStep({ kind: 'done' });
  }, []);

  /* ── Render ───────────────────────────────────────────────── */

  if (step.kind === 'done') return null;

  // Assassin narrative
  if (step.kind === 'assassinNarrative') {
    const narrative =
      step.assassinType === 'assassin_chen'
        ? '夜深人静之际，帐外忽然传来一阵异响。陈登暗中派遣的死士已悄然潜入营中——'
        : '月黑风高，一道黑影翻墙而入。不知何人受了怨恨驱使，竟要行刺于你——';

    return (
      <div className="w-full max-w-md mx-auto py-4">
        <h2 className="font-serif text-xl text-red-800 text-center mb-6 tracking-widest">
          遇刺！
        </h2>
        <EventDisplay
          key={`assassin-${step.assassinType}`}
          paragraphs={[narrative]}
          onDone={handleAssassinNarrativeDone}
        />
      </div>
    );
  }

  // Assassin D20 check
  if (step.kind === 'assassinD20') {
    const difficulty = ASSASSIN_D20_DIFFICULTY[step.assassinType];
    const situation = conditions.hasBodyguard ? 'advantage' as const : 'normal' as const;

    return (
      <div className="w-full py-4">
        <h2 className="font-serif text-xl text-red-800 text-center mb-6 tracking-widest">
          生死一搏
        </h2>
        <div className="flex justify-center">
          <D20Check
            difficulty={difficulty}
            situation={situation}
            attrKey="strength"
            attrValue={attrs.strength}
            modifiers={conditions.hasBodyguard ? [{ label: '贴身护卫', value: 2 }] : []}
            onResult={handleAssassinD20Result}
          />
        </div>
      </div>
    );
  }

  // Survived assassination
  if (step.kind === 'assassinSurvived') {
    return (
      <div className="w-full max-w-md mx-auto py-4">
        <EventDisplay
          key="assassin-survived"
          paragraphs={['刺客被击退，你侥幸逃过一劫。但这次遇刺的阴影，将久久笼罩在营帐之上。']}
          onDone={handleSurvivedDone}
        />
      </div>
    );
  }

  // Determine current display content
  let displayKey: string;
  let paragraphs: string[];

  if (step.kind === 'taskReport') {
    const report = taskReports[step.index];
    displayKey = `task-${report.followerId}-${step.index}`;
    paragraphs = [report.narrative];
  } else {
    const event = endEvents[step.eventIndex];
    displayKey = `end-${event.id}-${step.eventIndex}`;
    paragraphs = event.narrative;
  }

  return (
    <div className="w-full max-w-md mx-auto py-4">
      <h2 className="font-serif text-xl text-stone-700 text-center mb-6 tracking-widest">
        旬末结算
      </h2>

      <EventDisplay
        key={displayKey}
        paragraphs={paragraphs}
        onDone={handleStepDone}
      />
    </div>
  );
}
