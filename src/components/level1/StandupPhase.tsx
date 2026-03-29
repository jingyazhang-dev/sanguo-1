import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLevel1Store } from '../../store/level1Store';
import { proposeTask } from '../../engine/level1/followerAI';
import { STANDUP_INTRO, STANDUP_PROPOSAL_LINES } from '../../engine/level1/dialogues/standupDialogues';
import { EventDisplay } from './EventDisplay';
import type { PrimaryTaskType, StandupAssignments } from '../../types/level1Types';
import { PRIMARY_TASK_LABELS } from '../../types/level1Types';

const ALL_TASKS: PrimaryTaskType[] = Object.keys(PRIMARY_TASK_LABELS) as PrimaryTaskType[];

/* ── Step state machine ───────────────────────────────────── */

type Step =
  | { kind: 'intro' }
  | { kind: 'proposal'; followerIndex: number; narrated: boolean; reassigning: boolean }
  | { kind: 'summary' };

interface CompletedLine {
  name: string;
  task: string;
}

/**
 * Phase 3: Standup / 军议
 * Sequential typewriter narration — each follower proposes in turn.
 * Player approves or reassigns each proposal. Previous assignments accumulate on screen.
 */
export function StandupPhase() {
  const round = useLevel1Store((s) => s.round);
  const followers = useLevel1Store((s) => s.followers);
  const stats = useLevel1Store((s) => s.stats);
  const conditions = useLevel1Store((s) => s.conditions);
  const setStandupAssignments = useLevel1Store((s) => s.setStandupAssignments);
  const advancePhase = useLevel1Store((s) => s.advancePhase);

  // Only show followers that can do tasks
  const activeFollowers = useMemo(
    () => followers.filter((f) => f.role !== 'contact'),
    [followers],
  );

  // Proposals are intentionally memoized on round only — activeFollowers, stats, and
  // conditions are guaranteed stable within a single standup phase.
  const proposals = useMemo(() => {
    const map: StandupAssignments = {};
    for (const f of activeFollowers) {
      map[f.id] = proposeTask(f, stats, conditions, round);
    }
    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round]);

  const [assignments, setAssignments] = useState<StandupAssignments>(proposals);
  const [step, setStep] = useState<Step>({ kind: 'intro' });
  const [introDone, setIntroDone] = useState(false);
  const [completedLines, setCompletedLines] = useState<CompletedLine[]>([]);
  const activeRef = useRef<HTMLDivElement>(null);

  // Scroll active follower section into view on follower transitions only
  const followerIndex = step.kind === 'proposal' ? step.followerIndex : -1;
  useEffect(() => {
    if (followerIndex >= 0) {
      activeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [followerIndex]);

  /* ── Handlers ───────────────────────────────────────────── */

  const handleIntroDone = useCallback(() => {
    setIntroDone(true);
    if (activeFollowers.length === 0) {
      setStep({ kind: 'summary' });
      return;
    }
    setStep({ kind: 'proposal', followerIndex: 0, narrated: false, reassigning: false });
  }, [activeFollowers.length]);

  const handleProposalNarrated = useCallback(() => {
    setStep((prev) =>
      prev.kind === 'proposal' ? { ...prev, narrated: true } : prev,
    );
  }, []);

  const advanceToNext = useCallback(
    (followerId: string, task: PrimaryTaskType) => {
      const follower = activeFollowers.find((f) => f.id === followerId);
      setAssignments((prev) => ({ ...prev, [followerId]: task }));
      setCompletedLines((prev) => [
        ...prev,
        { name: follower?.name ?? followerId, task: PRIMARY_TASK_LABELS[task] },
      ]);
      setStep((prev) => {
        if (prev.kind !== 'proposal') return prev;
        const nextIdx = prev.followerIndex + 1;
        if (nextIdx < activeFollowers.length) {
          return { kind: 'proposal', followerIndex: nextIdx, narrated: false, reassigning: false };
        }
        return { kind: 'summary' };
      });
    },
    [activeFollowers],
  );

  const handleApprove = useCallback(() => {
    if (step.kind !== 'proposal') return;
    const follower = activeFollowers[step.followerIndex];
    advanceToNext(follower.id, proposals[follower.id]);
  }, [step, activeFollowers, proposals, advanceToNext]);

  const handleReassign = useCallback(() => {
    setStep((prev) =>
      prev.kind === 'proposal' ? { ...prev, reassigning: true } : prev,
    );
  }, []);

  const handleTaskSelect = useCallback(
    (followerId: string, task: PrimaryTaskType) => {
      advanceToNext(followerId, task);
    },
    [advanceToNext],
  );

  const handleConfirm = useCallback(() => {
    setStandupAssignments(assignments);
    advancePhase();
  }, [assignments, setStandupAssignments, advancePhase]);

  const handleRestart = useCallback(() => {
    setAssignments(proposals);
    setCompletedLines([]);
    setStep({ kind: 'proposal', followerIndex: 0, narrated: false, reassigning: false });
  }, [proposals]);

  /* ── Render ─────────────────────────────────────────────── */

  // Step 1: Intro narration (only shown while intro is still playing)
  if (step.kind === 'intro') {
    return (
      <div className="w-full max-w-xl mx-auto py-4">
        <EventDisplay
          key="standup-intro"
          paragraphs={[STANDUP_INTRO]}
          onDone={handleIntroDone}
        />
      </div>
    );
  }

  // Step 2: Per-follower proposal with accumulated history
  if (step.kind === 'proposal') {
    const follower = activeFollowers[step.followerIndex];
    const proposedTask = proposals[follower.id];
    const proposalLine =
      STANDUP_PROPOSAL_LINES[follower.id]?.[proposedTask] ??
      `${follower.name}进言，建议本旬执行${PRIMARY_TASK_LABELS[proposedTask]}之事。`;

    return (
      <div className="w-full max-w-xl mx-auto py-4">
        {/* Persisted intro narration */}
        {introDone && (
          <p className="mb-5 font-serif text-lg leading-9 whitespace-pre-wrap break-words last:mb-0">
            {STANDUP_INTRO}
          </p>
        )}

        {/* Accumulated completed assignments */}
        {completedLines.length > 0 && (
          <div className="mb-4 space-y-1">
            {completedLines.map((line, i) => (
              <p key={i} className="text-sm text-stone-400 font-serif">
                {line.name}领命：{line.task}
              </p>
            ))}
          </div>
        )}

        {/* Active follower proposal */}
        <div ref={activeRef}>
          <EventDisplay
            key={`standup-${follower.id}-${round}`}
            paragraphs={[proposalLine]}
            onDone={handleProposalNarrated}
          />

          {step.narrated && !step.reassigning && (
            <div className="mt-6">
              <p className="text-xs text-stone-500 text-center mb-3">
                {follower.name}建议：<span className="font-bold text-stone-700">{PRIMARY_TASK_LABELS[proposedTask]}</span>
              </p>
              <div className="flex justify-center gap-3">
                <button
                  className="px-6 py-2 border border-stone-600 rounded hover:bg-stone-100 font-serif text-stone-700"
                  onClick={handleApprove}
                >
                  核准
                </button>
                <button
                  className="px-4 py-2 border border-stone-300 rounded hover:bg-stone-50 font-serif text-sm text-stone-500"
                  onClick={handleReassign}
                >
                  改派
                </button>
              </div>
            </div>
          )}

          {step.narrated && step.reassigning && (
            <div className="mt-6">
              <p className="text-xs text-stone-500 text-center mb-3">
                请为{follower.name}另行指派：
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {ALL_TASKS.map((t) => (
                  <button
                    key={t}
                    className={[
                      'px-3 py-1.5 rounded border font-serif text-sm transition-colors',
                      t === proposedTask
                        ? 'border-stone-600 bg-stone-700 text-[#faf8f5]'
                        : 'border-stone-300 text-stone-600 hover:border-stone-500 hover:bg-stone-50',
                    ].join(' ')}
                    onClick={() => handleTaskSelect(follower.id, t)}
                  >
                    {PRIMARY_TASK_LABELS[t]}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Step 3: Summary — review all assignments before confirming
  return (
    <div className="w-full max-w-md mx-auto py-4">
      <h3 className="font-serif text-lg text-stone-700 text-center mb-6 tracking-widest">
        军议定策
      </h3>

      <div className="space-y-3 mb-8">
        {activeFollowers.map((follower) => {
          const task = assignments[follower.id] as PrimaryTaskType | undefined;
          if (!task) return null;
          const isOverridden = task !== proposals[follower.id];
          return (
            <div
              key={follower.id}
              className="flex items-center justify-between px-4 py-2 border border-stone-200 rounded"
            >
              <span className="font-serif text-stone-800">
                {follower.name}
                {follower.courtesy && (
                  <span className="text-xs text-stone-400 ml-1">（{follower.courtesy}）</span>
                )}
              </span>
              <span className="font-serif text-stone-700">
                {PRIMARY_TASK_LABELS[task]}
                {isOverridden && <span className="text-xs text-red-800 ml-1">改</span>}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center gap-4">
        <button
          className="px-4 py-2 border border-stone-300 rounded hover:bg-stone-100 font-serif text-sm text-stone-600"
          onClick={handleRestart}
        >
          重议
        </button>
        <button
          className="px-8 py-2 border border-stone-600 rounded hover:bg-stone-100 font-serif text-stone-700"
          onClick={handleConfirm}
        >
          下令
        </button>
      </div>
    </div>
  );
}
