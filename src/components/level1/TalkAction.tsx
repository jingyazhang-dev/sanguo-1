import { useCallback, useMemo, useState } from 'react';
import { useLevel1Store } from '../../store/level1Store';
import { MS_GAN_ID, MS_GAN_NAME, MS_MI_ID, MS_MI_NAME } from '../../engine/level1/constants';
import { FOLLOWER_CHAT_TOPICS } from '../../engine/level1/dialogues/followerChatTopics';
import { MS_GAN_CHAT_TOPICS } from '../../engine/level1/dialogues/msGanDialogues';
import { MS_MI_CHAT_TOPICS } from '../../engine/level1/dialogues/msMiDialogues';
import { DYNAMIC_TOPIC_DEFS, getDynamicTopicResponseData } from '../../engine/level1/dialogues/dynamicTopics';
import { getHint } from '../../engine/level1/dialogues/msGanHints';
import {
  selectChatKind,
  getAvailableTopics,
  getAvailableChatKinds,
  selectChatTopic,
  getActiveDynamicTopics,
} from '../../engine/level1/chatEngine';
import { EventDisplay } from './EventDisplay';
import { D20Modal } from './D20Modal';
import type {
  ChatTopic,
  DialogueChoice,
  DynamicTopicDef,
  DynamicTopicResponse,
  Follower,
} from '../../types/level1Types';

/* ── Props ────────────────────────────────────────────────── */

interface TalkActionProps {
  onDone: () => void;
  onCancel: () => void;
}

/* ── State machine steps ──────────────────────────────────── */

type Step =
  | { kind: 'selectCharacter' }
  | { kind: 'selectTopic'; charId: string }
  | { kind: 'chatNarration'; charId: string; topic: ChatTopic }
  | { kind: 'chatChoice'; charId: string; topic: ChatTopic }
  | { kind: 'chatD20'; charId: string; topic: ChatTopic }
  | { kind: 'chatResult'; charId: string; resultText: string }
  | { kind: 'dynamicNarration'; charId: string; response: DynamicTopicResponse }
  | { kind: 'rumorDisplay'; text: string };

/* ── Component ────────────────────────────────────────────── */

export function TalkAction({ onDone, onCancel }: TalkActionProps) {
  const followers = useLevel1Store((s) => s.followers);
  const conditions = useLevel1Store((s) => s.conditions);
  const stats = useLevel1Store((s) => s.stats);
  const attrs = useLevel1Store((s) => s.attrs);
  const usedTopicIds = useLevel1Store((s) => s.usedTopicIds);
  const roundUsedTopicIds = useLevel1Store((s) => s.roundUsedTopicIds);
  const seededPatrolEvent = useLevel1Store((s) => s.seededPatrolEvent);
  const applyStatsDelta = useLevel1Store((s) => s.applyStatsDelta);
  const applyAttrsDelta = useLevel1Store((s) => s.applyAttrsDelta);
  const updateConditions = useLevel1Store((s) => s.updateConditions);
  const markTopicUsed = useLevel1Store((s) => s.markTopicUsed);

  const [step, setStep] = useState<Step>({ kind: 'selectCharacter' });
  const [effectsApplied, setEffectsApplied] = useState(false);

  /* ── Talkable characters ────────────────────────────────── */

  const talkableCharacters = useMemo(() => {
    const chars: { id: string; name: string }[] = followers
      .filter((f: Follower) => f.role === 'follower' || f.role === 'both')
      .map((f: Follower) => ({ id: f.id, name: f.name }));
    chars.push({ id: MS_GAN_ID, name: MS_GAN_NAME });
    if (conditions.miZhuMarriage) {
      chars.push({ id: MS_MI_ID, name: MS_MI_NAME });
    }
    return chars;
  }, [followers, conditions.miZhuMarriage]);

  /* ── Active dynamic topics ──────────────────────────────── */

  const activeDynamicTopics = useMemo(
    () => getActiveDynamicTopics(DYNAMIC_TOPIC_DEFS, stats, conditions),
    [stats, conditions],
  );

  /* ── Handlers ───────────────────────────────────────────── */

  const handleSelectCharacter = useCallback((charId: string) => {
    setStep({ kind: 'selectTopic', charId });
  }, []);

  const handleBackToCharacters = useCallback(() => {
    setStep({ kind: 'selectCharacter' });
  }, []);

  const handleChat = useCallback(
    (charId: string) => {
      // Get all topics for this character
      const allTopics = charId === MS_GAN_ID
        ? MS_GAN_CHAT_TOPICS
        : charId === MS_MI_ID
          ? MS_MI_CHAT_TOPICS
          : (FOLLOWER_CHAT_TOPICS[charId] ?? []);

      // Find available kinds
      const intelligence = attrs.intelligence;
      const availableKinds = getAvailableChatKinds(allTopics, usedTopicIds, roundUsedTopicIds, stats, conditions);

      if (availableKinds.size === 0) {
        // No topics left — show generic empty response
        setStep({ kind: 'chatResult', charId, resultText: '一时无话可说，二人沉默片刻，相视一笑。' });
        return;
      }

      const kind = selectChatKind(intelligence, availableKinds);
      if (!kind) {
        setStep({ kind: 'chatResult', charId, resultText: '一时无话可说，二人沉默片刻，相视一笑。' });
        return;
      }

      const pool = getAvailableTopics(allTopics, kind, usedTopicIds, roundUsedTopicIds, stats, conditions);
      const topic = selectChatTopic(pool);
      if (!topic) {
        setStep({ kind: 'chatResult', charId, resultText: '一时无话可说，二人沉默片刻，相视一笑。' });
        return;
      }

      setEffectsApplied(false);
      setStep({ kind: 'chatNarration', charId, topic });
    },
    [attrs.intelligence, usedTopicIds, roundUsedTopicIds, stats, conditions],
  );

  const handleDynamicTopic = useCallback(
    (charId: string, topicDef: DynamicTopicDef) => {
      const response = getDynamicTopicResponseData(topicDef.id, charId);
      if (!response) {
        setStep({ kind: 'chatResult', charId, resultText: '对方对此话题似乎没什么特别看法。' });
        return;
      }
      setEffectsApplied(false);
      setStep({ kind: 'dynamicNarration', charId, response });
    },
    [],
  );

  const handleRumor = useCallback(() => {
    const hintText = getHint(seededPatrolEvent);
    setStep({ kind: 'rumorDisplay', text: hintText });
  }, [seededPatrolEvent]);

  const handleChatNarrationDone = useCallback(() => {
    if (step.kind !== 'chatNarration') return;
    const { charId, topic } = step;

    // If topic has choices, go to choice step
    if (topic.choices && topic.choices.length > 0) {
      setStep({ kind: 'chatChoice', charId, topic });
      return;
    }

    // If topic has D20 check, go to D20 step
    if (topic.d20Check) {
      setStep({ kind: 'chatD20', charId, topic });
      return;
    }

    // Otherwise apply effects directly
    if (!effectsApplied) {
      setEffectsApplied(true);
      if (topic.statsDelta) applyStatsDelta(topic.statsDelta);
      if (topic.attrsDelta) applyAttrsDelta(topic.attrsDelta);
      if (topic.conditionChanges) updateConditions(topic.conditionChanges);
      // Mark consumed: scripted/narrative = permanent, situational = round
      markTopicUsed(topic.id, topic.kind !== 'situational');
    }
  }, [step, effectsApplied, applyStatsDelta, applyAttrsDelta, updateConditions, markTopicUsed]);

  const handleChoiceSelected = useCallback(
    (choice: DialogueChoice) => {
      if (step.kind !== 'chatChoice') return;
      const { charId, topic } = step;

      // Apply choice effects
      if (choice.statsDelta) applyStatsDelta(choice.statsDelta);
      if (choice.attrsDelta) applyAttrsDelta(choice.attrsDelta);
      if (choice.conditionChanges) updateConditions(choice.conditionChanges);
      markTopicUsed(topic.id, topic.kind !== 'situational');

      // Show choice response
      const responseText = choice.responseLines[Math.floor(Math.random() * choice.responseLines.length)];
      setStep({ kind: 'chatResult', charId, resultText: responseText });
    },
    [step, applyStatsDelta, applyAttrsDelta, updateConditions, markTopicUsed],
  );

  const handleD20Result = useCallback(
    (success: boolean, _total: number) => {
      if (step.kind !== 'chatD20') return;
      const { charId, topic } = step;
      const d20 = topic.d20Check!;

      const delta = success ? d20.successStatsDelta : d20.failureStatsDelta;
      const condChanges = success ? d20.successConditionChanges : d20.failureConditionChanges;
      if (delta) applyStatsDelta(delta);
      if (condChanges) updateConditions(condChanges);
      markTopicUsed(topic.id, topic.kind !== 'situational');

      const narrative = success ? d20.successNarrative : d20.failureNarrative;
      setStep({ kind: 'chatResult', charId, resultText: narrative });
    },
    [step, applyStatsDelta, updateConditions, markTopicUsed],
  );

  const handleDynamicNarrationDone = useCallback(() => {
    if (step.kind !== 'dynamicNarration') return;
    const { response } = step;

    if (!effectsApplied) {
      setEffectsApplied(true);
      if (response.statsDelta) applyStatsDelta(response.statsDelta);
      if (response.conditionChanges) updateConditions(response.conditionChanges);
    }
  }, [step, effectsApplied, applyStatsDelta, updateConditions]);

  /* ── Helper: selected char name ─────────────────────────── */

  const selectedCharName = useMemo(() => {
    if (step.kind === 'selectCharacter') return '';
    const charId = 'charId' in step ? step.charId : '';
    return talkableCharacters.find((c) => c.id === charId)?.name ?? '';
  }, [talkableCharacters, step]);

  /* ── Step 1: Character selection ────────────────────────── */

  if (step.kind === 'selectCharacter') {
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
              <span className="font-serif text-stone-800 font-bold">{char.name}</span>
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

  if (step.kind === 'selectTopic') {
    const { charId } = step;
    const isMsGan = charId === MS_GAN_ID;
    const isMsMi  = charId === MS_MI_ID;

    return (
      <div className="w-full max-w-md mx-auto py-4">
        <h3 className="font-serif text-lg text-stone-700 text-center mb-6 tracking-widest">
          与{selectedCharName}交谈
        </h3>
        <div className="space-y-3">
          {/* Fixed: 闲谈 */}
          <button
            className="w-full text-left px-4 py-3 border border-stone-200 rounded hover:bg-stone-50 transition-colors"
            onClick={() => handleChat(charId)}
          >
            <span className="font-serif text-stone-800 font-bold">闲谈</span>
          </button>

          {/* Ms Gan special: 传言 */}
          {isMsGan && (
            <button
              className="w-full text-left px-4 py-3 border border-stone-200 rounded hover:bg-stone-50 transition-colors"
              onClick={handleRumor}
            >
              <span className="font-serif text-stone-800 font-bold">传言</span>
            </button>
          )}

          {/* Active dynamic topics (not shown for Ms. Mi) */}
          {!isMsMi && activeDynamicTopics.map((dt) => (
            <button
              key={dt.id}
              className="w-full text-left px-4 py-3 border border-amber-200 rounded hover:bg-amber-50 transition-colors"
              onClick={() => handleDynamicTopic(charId, dt)}
            >
              <span className="font-serif text-amber-800 font-bold">{dt.label}</span>
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

  /* ── Step 3a: Chat narration ────────────────────────────── */

  if (step.kind === 'chatNarration') {
    return (
      <ChatNarrationView
        charName={selectedCharName}
        topic={step.topic}
        onDone={handleChatNarrationDone}
        effectsApplied={effectsApplied}
        onFinish={onDone}
      />
    );
  }

  /* ── Step 3b: Chat choice ───────────────────────────────── */

  if (step.kind === 'chatChoice') {
    return (
      <div className="w-full max-w-md mx-auto py-4">
        <h3 className="font-serif text-lg text-stone-700 text-center mb-6 tracking-widest">
          你如何回应？
        </h3>
        <div className="space-y-3">
          {step.topic.choices!.map((choice) => (
            <button
              key={choice.id}
              className="w-full text-left px-4 py-3 border border-stone-200 rounded hover:bg-stone-50 transition-colors"
              onClick={() => handleChoiceSelected(choice)}
            >
              <span className="font-serif text-stone-800">{choice.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  /* ── Step 3c: Chat D20 check — topic narration shown dimmed behind modal ── */

  if (step.kind === 'chatD20') {
    const d20 = step.topic.d20Check!;
    const [narrativeLine] = step.topic.narrative;

    const narrationBackground = (
      <div className="w-full max-w-xl mx-auto py-4">
        <p className="font-serif text-base text-center text-stone-500 mb-2 tracking-widest">
          与{selectedCharName}闲谈
        </p>
        <p className="font-serif text-sm text-stone-700 leading-relaxed whitespace-pre-wrap">
          {narrativeLine}
        </p>
      </div>
    );

    return (
      <D20Modal
        background={narrationBackground}
        difficulty={d20.difficulty}
        situation={d20.situation}
        attrKey={d20.attrKey}
        attrValue={attrs[d20.attrKey]}
        modifiers={d20.modifiers}
        onResult={handleD20Result}
      />
    );
  }

  /* ── Step 4: Chat result ────────────────────────────────── */

  if (step.kind === 'chatResult') {
    return (
      <ResultView
        title={`与${selectedCharName}交谈`}
        paragraphs={[step.resultText]}
        onDone={onDone}
      />
    );
  }

  /* ── Dynamic topic narration ────────────────────────────── */

  if (step.kind === 'dynamicNarration') {
    return (
      <DynamicNarrationView
        charName={selectedCharName}
        response={step.response}
        onDone={handleDynamicNarrationDone}
        effectsApplied={effectsApplied}
        onFinish={onDone}
      />
    );
  }

  /* ── Rumor display ──────────────────────────────────────── */

  if (step.kind === 'rumorDisplay') {
    return (
      <ResultView
        title="传言"
        paragraphs={[step.text]}
        onDone={onDone}
      />
    );
  }

  return null;
}

/* ── Sub-views ────────────────────────────────────────────── */

function ResultView({
  paragraphs,
  title,
  onDone,
}: {
  paragraphs: string[];
  title?: string;
  onDone: () => void;
}) {
  const [narrated, setNarrated] = useState(false);

  return (
    <div className="w-full max-w-xl mx-auto py-4">
      <EventDisplay title={title} paragraphs={paragraphs} onDone={() => setNarrated(true)} />
      {narrated && (
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

/* ── Stable-random sub-views (avoid re-roll on re-render) ── */

function ChatNarrationView({
  charName,
  topic,
  onDone,
  effectsApplied,
  onFinish,
}: {
  charName: string;
  topic: ChatTopic;
  onDone: () => void;
  effectsApplied: boolean;
  onFinish: () => void;
}) {
  const [line] = useState(() =>
    topic.narrative[Math.floor(Math.random() * topic.narrative.length)],
  );

  return (
    <div className="w-full max-w-xl mx-auto py-4">
      <EventDisplay
        title={`与${charName}闲谈`}
        paragraphs={[line]}
        onDone={onDone}
      />
      {effectsApplied && (
        <div className="mt-6 text-center">
          <button
            className="px-6 py-2 border border-stone-400 rounded hover:bg-stone-100 font-serif text-sm text-stone-700"
            onClick={onFinish}
          >
            继续
          </button>
        </div>
      )}
    </div>
  );
}

function DynamicNarrationView({
  charName,
  response,
  onDone,
  effectsApplied,
  onFinish,
}: {
  charName: string;
  response: DynamicTopicResponse;
  onDone: () => void;
  effectsApplied: boolean;
  onFinish: () => void;
}) {
  const [line] = useState(() =>
    response.lines[Math.floor(Math.random() * response.lines.length)],
  );

  return (
    <div className="w-full max-w-xl mx-auto py-4">
      <EventDisplay
        title={`与${charName}交谈`}
        paragraphs={[line]}
        onDone={onDone}
      />
      {effectsApplied && (
        <div className="mt-6 text-center">
          <button
            className="px-6 py-2 border border-stone-400 rounded hover:bg-stone-100 font-serif text-sm text-stone-700"
            onClick={onFinish}
          >
            继续
          </button>
        </div>
      )}
    </div>
  );
}
