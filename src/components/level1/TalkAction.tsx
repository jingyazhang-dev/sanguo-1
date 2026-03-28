import { useCallback, useMemo, useState } from 'react';
import { useLevel1Store } from '../../store/level1Store';
import { getTopicsForCharacter } from '../../engine/level1/dialogues/followerDialogues';
import { MS_GAN_ID, MS_GAN_NAME } from '../../engine/level1/constants';
import { EventDisplay } from './EventDisplay';
import type { DialogueTopic, Follower } from '../../types/level1Types';

/* ── Props ────────────────────────────────────────────────── */

interface TalkActionProps {
  onDone: () => void;
  onCancel: () => void;
}

/* ── State machine steps ──────────────────────────────────── */

type Step = 'selectCharacter' | 'selectTopic' | 'dialogue';

/* ── Component ────────────────────────────────────────────── */

export function TalkAction({ onDone, onCancel }: TalkActionProps) {
  const followers = useLevel1Store((s) => s.followers);
  const conditions = useLevel1Store((s) => s.conditions);
  const stats = useLevel1Store((s) => s.stats);
  const round = useLevel1Store((s) => s.round);
  const applyStatsDelta = useLevel1Store((s) => s.applyStatsDelta);
  const applyAttrsDelta = useLevel1Store((s) => s.applyAttrsDelta);
  const updateConditions = useLevel1Store((s) => s.updateConditions);

  const seededPatrolEvent = useLevel1Store((s) => s.seededPatrolEvent);

  const [step, setStep] = useState<Step>('selectCharacter');
  const [selectedCharId, setSelectedCharId] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<DialogueTopic | null>(null);
  const [dialogueLine, setDialogueLine] = useState<string>('');
  const [effectsApplied, setEffectsApplied] = useState(false);

  /* ── Talkable characters ────────────────────────────────── */

  const talkableCharacters = useMemo(() => {
    // Followers with role 'follower' or 'both'
    const chars: { id: string; name: string }[] = followers
      .filter((f: Follower) => f.role === 'follower' || f.role === 'both')
      .map((f: Follower) => ({ id: f.id, name: f.name }));

    // Ms. Gan is always available
    chars.push({ id: MS_GAN_ID, name: MS_GAN_NAME });

    return chars;
  }, [followers]);

  /* ── Handlers ───────────────────────────────────────────── */

  const handleSelectCharacter = useCallback((charId: string) => {
    setSelectedCharId(charId);
    setStep('selectTopic');
  }, []);

  const handleSelectTopic = useCallback(
    (topic: DialogueTopic) => {
      // Pick a random line from the topic
      const line = topic.lines[Math.floor(Math.random() * topic.lines.length)];
      setSelectedTopic(topic);
      setDialogueLine(line);
      setEffectsApplied(false);
      setStep('dialogue');
    },
    [],
  );

  const handleBackToCharacters = useCallback(() => {
    setSelectedCharId(null);
    setSelectedTopic(null);
    setStep('selectCharacter');
  }, []);

  const handleDialogueDone = useCallback(() => {
    // Apply effects once when typing finishes
    if (!effectsApplied && selectedTopic) {
      if (selectedTopic.statsDelta) applyStatsDelta(selectedTopic.statsDelta);
      if (selectedTopic.attrsDelta) applyAttrsDelta(selectedTopic.attrsDelta);
      if (selectedTopic.conditionChanges) updateConditions(selectedTopic.conditionChanges);
      setEffectsApplied(true);
    }
  }, [effectsApplied, selectedTopic, applyStatsDelta, applyAttrsDelta, updateConditions]);

  /* ── Available topics for selected character ────────────── */

  const topics = useMemo(() => {
    if (!selectedCharId) return [];
    return getTopicsForCharacter(selectedCharId, conditions, stats, round, seededPatrolEvent);
  }, [selectedCharId, conditions, stats, round]);

  /* ── Render helpers ─────────────────────────────────────── */

  const selectedCharName = useMemo(
    () => talkableCharacters.find((c) => c.id === selectedCharId)?.name ?? '',
    [talkableCharacters, selectedCharId],
  );

  /* ── Step 1: Character selection ────────────────────────── */

  if (step === 'selectCharacter') {
    return (
      <div className="w-full max-w-md mx-auto py-4">
        <h3 className="font-serif text-lg text-stone-700 text-center mb-6 tracking-widest">
          交谈 · 选择对象
        </h3>

        <div className="space-y-3">
          {talkableCharacters.map((char) => (
            <button
              key={char.id}
              className="w-full text-left px-4 py-3 border border-stone-200 rounded hover:bg-stone-50 transition-colors"
              onClick={() => handleSelectCharacter(char.id)}
            >
              <span className="font-serif text-stone-800 font-bold">
                {char.name}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-6 text-center">
          <button
            className="px-4 py-2 border border-stone-300 rounded hover:bg-stone-100 font-serif text-sm text-stone-600"
            onClick={onCancel}
          >
            返回
          </button>
        </div>
      </div>
    );
  }

  /* ── Step 2: Topic selection ────────────────────────────── */

  if (step === 'selectTopic') {
    return (
      <div className="w-full max-w-md mx-auto py-4">
        <h3 className="font-serif text-lg text-stone-700 text-center mb-6 tracking-widest">
          与{selectedCharName}交谈
        </h3>

        <div className="space-y-3">
          {topics.map((topic) => (
            <button
              key={topic.id}
              className="w-full text-left px-4 py-3 border border-stone-200 rounded hover:bg-stone-50 transition-colors"
              onClick={() => handleSelectTopic(topic)}
            >
              <span className="font-serif text-stone-800 font-bold">
                {topic.label}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-6 text-center">
          <button
            className="px-4 py-2 border border-stone-300 rounded hover:bg-stone-100 font-serif text-sm text-stone-600"
            onClick={handleBackToCharacters}
          >
            返回
          </button>
        </div>
      </div>
    );
  }

  /* ── Step 3: Dialogue display ───────────────────────────── */

  return (
    <div className="w-full max-w-xl mx-auto py-4">
      <EventDisplay
        title={`与${selectedCharName}交谈`}
        paragraphs={[dialogueLine]}
        onDone={handleDialogueDone}
      />

      {effectsApplied && (
        <div className="mt-6 text-center">
          <button
            className="px-6 py-2 border border-stone-400 rounded hover:bg-stone-100 font-serif text-sm text-stone-700"
            onClick={onDone}
          >
            继续
          </button>
        </div>
      )}
    </div>
  );
}
