import { useState, useCallback, useMemo } from 'react';
import { useLevel1Store } from '../../store/level1Store';
import { KONG_RONG_GREETINGS, KONG_RONG_TOPICS } from '../../engine/level1/dialogues/kongRongDialogues';
import { MI_ZHU_GREETINGS, MI_ZHU_TOPICS } from '../../engine/level1/dialogues/miZhuDialogues';
import { CHEN_DENG_GREETINGS, CHEN_DENG_TOPICS } from '../../engine/level1/dialogues/chenDengDialogues';
import {
  getGreeting,
  getAvailableTopics,
  selectDisplayTopics,
  canVisitContact,
  isRetryableOnD20Failure,
} from '../../engine/level1/visitEngine';
import { EventDisplay } from './EventDisplay';
import { D20Check } from './D20Check';
import type {
  DialogueTopic,
  DialogueChoice,
  AristocraticContact,
  ContactGreetingTiers,
  D20Modifier,
} from '../../types/level1Types';

/* ── Contact data lookup ──────────────────────────────────── */

function getContactGreetings(contactId: string): ContactGreetingTiers {
  switch (contactId) {
    case 'kongrong':  return KONG_RONG_GREETINGS;
    case 'mizhu':     return MI_ZHU_GREETINGS;
    case 'chendeng':  return CHEN_DENG_GREETINGS;
    default:          return { cold: [], neutral: [], warm: [], close: [] };
  }
}

function getContactTopics(contactId: string): DialogueTopic[] {
  switch (contactId) {
    case 'kongrong':  return KONG_RONG_TOPICS;
    case 'mizhu':     return MI_ZHU_TOPICS;
    case 'chendeng':  return CHEN_DENG_TOPICS;
    default:          return [];
  }
}

/* ── Step state machine ───────────────────────────────────── */

type Step =
  | { kind: 'rejection' }
  | { kind: 'selectContact' }
  | { kind: 'blocked'; contactId: string }
  | { kind: 'greeting'; contactId: string; text: string }
  | { kind: 'selectTopic'; contactId: string }
  | { kind: 'narration'; contactId: string; topic: DialogueTopic }
  | { kind: 'choice'; contactId: string; topic: DialogueTopic }
  | { kind: 'd20'; contactId: string; topic: DialogueTopic }
  | { kind: 'result'; contactId: string; text: string };

/* ── Props ────────────────────────────────────────────────── */

interface VisitActionProps {
  onDone: () => void;
  onCancel: () => void;
}

/* ── Component ────────────────────────────────────────────── */

export function VisitAction({ onDone, onCancel }: VisitActionProps) {
  const conditions = useLevel1Store((s) => s.conditions);
  const stats = useLevel1Store((s) => s.stats);
  const attrs = useLevel1Store((s) => s.attrs);
  const contacts = useLevel1Store((s) => s.contacts);
  const round = useLevel1Store((s) => s.round);
  const usedTopicIds = useLevel1Store((s) => s.usedTopicIds);
  const applyStatsDelta = useLevel1Store((s) => s.applyStatsDelta);
  const applyAttrsDelta = useLevel1Store((s) => s.applyAttrsDelta);
  const updateConditions = useLevel1Store((s) => s.updateConditions);
  const updateContactRelationship = useLevel1Store((s) => s.updateContactRelationship);
  const markTopicUsed = useLevel1Store((s) => s.markTopicUsed);

  // Determine if ANY contacts are unlocked
  const hasUnlockedContacts = conditions.kongRongUnlocked || conditions.miZhuUnlocked || conditions.chenDengUnlocked;

  const [step, setStep] = useState<Step>(() =>
    hasUnlockedContacts ? { kind: 'selectContact' } : { kind: 'rejection' },
  );

  /* ── Visible contacts ───────────────────────────────────── */

  const visibleContacts = useMemo(() => {
    return contacts.filter((c) => {
      switch (c.id) {
        case 'kongrong':  return conditions.kongRongUnlocked;
        case 'mizhu':     return conditions.miZhuUnlocked;
        case 'chendeng':  return conditions.chenDengUnlocked;
        default:          return false;
      }
    });
  }, [contacts, conditions]);

  /* ── Handlers ───────────────────────────────────────────── */

  const handleSelectContact = useCallback(
    (contactId: string) => {
      if (!canVisitContact(contactId, conditions, stats.reputation)) {
        setStep({ kind: 'blocked', contactId });
        return;
      }

      // Show greeting
      const contact = contacts.find((c) => c.id === contactId);
      const greetings = getContactGreetings(contactId);
      const greetingText = getGreeting(greetings, contact?.relationship ?? 50);
      setStep({ kind: 'greeting', contactId, text: greetingText });
    },
    [contacts, conditions, stats.reputation],
  );

  const handleGreetingDone = useCallback(() => {
    if (step.kind !== 'greeting') return;
    setStep({ kind: 'selectTopic', contactId: step.contactId });
  }, [step]);

  const handleSelectTopic = useCallback(
    (contactId: string, topic: DialogueTopic) => {
      setStep({ kind: 'narration', contactId, topic });
    },
    [],
  );

  const handleNarrationDone = useCallback(() => {
    if (step.kind !== 'narration') return;
    const { contactId, topic } = step;

    // If topic has choices, go to choice step
    if (topic.choices && topic.choices.length > 0) {
      setStep({ kind: 'choice', contactId, topic });
      return;
    }

    // If topic has D20 check, go to D20 step
    if (topic.d20Check) {
      setStep({ kind: 'd20', contactId, topic });
      return;
    }

    // Otherwise apply effects directly (narrative-only topic)
    if (topic.statsDelta) applyStatsDelta(topic.statsDelta);
    if (topic.attrsDelta) applyAttrsDelta(topic.attrsDelta);
    if (topic.conditionChanges) updateConditions(topic.conditionChanges);
    updateContactRelationship(contactId, 3);
    markTopicUsed(topic.id, true);

    setStep({ kind: 'result', contactId, text: '话题告一段落。' });
  }, [step, applyStatsDelta, applyAttrsDelta, updateConditions, updateContactRelationship, markTopicUsed]);

  const handleChoiceSelected = useCallback(
    (choice: DialogueChoice) => {
      if (step.kind !== 'choice') return;
      const { contactId, topic } = step;

      if (choice.statsDelta) applyStatsDelta(choice.statsDelta);
      if (choice.attrsDelta) applyAttrsDelta(choice.attrsDelta);
      if (choice.conditionChanges) updateConditions(choice.conditionChanges);
      updateContactRelationship(contactId, choice.relationshipDelta ?? 3);
      markTopicUsed(topic.id, true);

      const responseText = choice.responseLines[Math.floor(Math.random() * choice.responseLines.length)];
      setStep({ kind: 'result', contactId, text: responseText });
    },
    [step, applyStatsDelta, applyAttrsDelta, updateConditions, updateContactRelationship, markTopicUsed],
  );

  const handleD20Result = useCallback(
    (success: boolean, _total: number) => {
      if (step.kind !== 'd20') return;
      const { contactId, topic } = step;
      const d20 = topic.d20Check!;

      const delta = success ? d20.successStatsDelta : d20.failureStatsDelta;
      const condChanges = success ? d20.successConditionChanges : d20.failureConditionChanges;
      if (delta) applyStatsDelta(delta);
      if (condChanges) updateConditions(condChanges);
      updateContactRelationship(contactId, success ? 5 : 0);

      // Retryable topics: NOT consumed on D20 failure
      const retryable = isRetryableOnD20Failure(topic.id);
      if (!(retryable && !success)) {
        markTopicUsed(topic.id, true);
      }

      const narrative = success ? d20.successNarrative : d20.failureNarrative;
      setStep({ kind: 'result', contactId, text: narrative });
    },
    [step, applyStatsDelta, updateConditions, updateContactRelationship, markTopicUsed],
  );

  const handleRejectionNarrated = useCallback(() => {
    if (!conditions.triedVisitFailed) {
      useLevel1Store.getState().updateConditions({ triedVisitFailed: true });
    }
  }, [conditions.triedVisitFailed]);

  /* ── Render ─────────────────────────────────────────────── */

  switch (step.kind) {
    case 'rejection':
      return (
        <RejectionView
          onNarrated={handleRejectionNarrated}
          onDone={onCancel}
        />
      );

    case 'selectContact':
      return (
        <ContactSelectionView
          contacts={visibleContacts}
          onSelect={handleSelectContact}
          onCancel={onCancel}
        />
      );

    case 'blocked':
      return (
        <BlockedView
          contactId={step.contactId}
          contacts={contacts}
          onBack={() => setStep({ kind: 'selectContact' })}
        />
      );

    case 'greeting':
      return (
        <GreetingView
          contactId={step.contactId}
          contacts={contacts}
          text={step.text}
          onDone={handleGreetingDone}
        />
      );

    case 'selectTopic': {
      const contact = contacts.find((c) => c.id === step.contactId);
      if (!contact) return null;
      const allTopics = getContactTopics(step.contactId);
      const available = getAvailableTopics(allTopics, usedTopicIds, conditions, stats, round, contact.relationship);
      const displayTopics = selectDisplayTopics(
        step.contactId,
        available,
        step.contactId === 'kongrong' ? 'kongrong-eval' : undefined,
      );
      return (
        <TopicSelectionView
          contact={contact}
          topics={displayTopics}
          onSelect={(topic) => handleSelectTopic(step.contactId, topic)}
          onBack={() => setStep({ kind: 'selectContact' })}
        />
      );
    }

    case 'narration': {
      return (
        <NarrationView
          contactId={step.contactId}
          contacts={contacts}
          topic={step.topic}
          onDone={handleNarrationDone}
        />
      );
    }

    case 'choice':
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

    case 'd20': {
      const d20 = step.topic.d20Check!;
      // Compute relationship-based modifier for special topics
      const contact = contacts.find((c) => c.id === step.contactId);
      const relationship = contact?.relationship ?? 50;
      const modifiers: D20Modifier[] = d20.modifiers.map((m) => {
        if (m.label === '关系加成' && m.value === 0) {
          // Compute runtime value: rel-60 for rations, rel-80 for future support
          const base = step.topic.id === 'chendeng-future-support' ? 80 : 60;
          return { ...m, value: relationship - base };
        }
        return m;
      });
      return (
        <div className="w-full py-4 flex justify-center">
          <D20Check
            difficulty={d20.difficulty}
            situation={d20.situation}
            attrKey={d20.attrKey}
            attrValue={attrs[d20.attrKey]}
            modifiers={modifiers}
            onResult={handleD20Result}
          />
        </div>
      );
    }

    case 'result':
      return (
        <ResultView
          paragraphs={[step.text]}
          onDone={onDone}
        />
      );

    default:
      return null;
  }
}

/* ── Sub-views ────────────────────────────────────────────── */

function RejectionView({
  onNarrated,
  onDone,
}: {
  onNarrated: () => void;
  onDone: () => void;
}) {
  const [narrated, setNarrated] = useState(false);

  const handleTypingDone = useCallback(() => {
    onNarrated();
    setNarrated(true);
  }, [onNarrated]);

  return (
    <div className="w-full max-w-xl mx-auto py-4">
      <EventDisplay
        paragraphs={['你不认识任何世族。']}
        onDone={handleTypingDone}
      />
      {narrated && (
        <div className="flex justify-center mt-6">
          <button
            className="px-6 py-2 border border-stone-300 rounded hover:bg-stone-50 transition-colors font-serif text-sm text-stone-700"
            onClick={onDone}
          >
            返回
          </button>
        </div>
      )}
    </div>
  );
}

function ContactSelectionView({
  contacts,
  onSelect,
  onCancel,
}: {
  contacts: AristocraticContact[];
  onSelect: (contactId: string) => void;
  onCancel: () => void;
}) {
  return (
    <div className="w-full max-w-md mx-auto py-4">
      <h3 className="font-serif text-lg text-stone-700 text-center mb-6 tracking-widest">
        拜访
      </h3>
      <div className="space-y-3">
        {contacts.map((contact) => (
          <button
            key={contact.id}
            className="w-full text-left px-4 py-3 border border-stone-200 rounded hover:bg-stone-50 transition-colors"
            onClick={() => onSelect(contact.id)}
          >
            <span className="font-serif text-stone-800 font-bold">{contact.name}</span>
            {contact.courtesy && (
              <span className="text-xs text-stone-400 ml-2">字{contact.courtesy}</span>
            )}
            <p className="text-xs text-stone-500 mt-0.5">关系: {contact.relationship}</p>
          </button>
        ))}
      </div>
      <div className="flex justify-center mt-6">
        <button
          className="px-6 py-2 border border-stone-300 rounded hover:bg-stone-50 transition-colors font-serif text-sm text-stone-700"
          onClick={onCancel}
        >
          返回
        </button>
      </div>
    </div>
  );
}

function BlockedView({
  contactId,
  contacts,
  onBack,
}: {
  contactId: string;
  contacts: AristocraticContact[];
  onBack: () => void;
}) {
  const contact = contacts.find((c) => c.id === contactId);
  const name = contact?.name ?? '此人';
  const [narrated, setNarrated] = useState(false);

  return (
    <div className="w-full max-w-xl mx-auto py-4">
      <EventDisplay
        paragraphs={[
          `你前往${name}府上拜访，门人恭敬但坚定地回绝："大人今日不见客。"你隐约觉得，似乎你的名声还不够引起重视。`,
        ]}
        onDone={() => setNarrated(true)}
      />
      {narrated && (
        <div className="flex justify-center mt-6">
          <button
            className="px-6 py-2 border border-stone-300 rounded hover:bg-stone-50 transition-colors font-serif text-sm text-stone-700"
            onClick={onBack}
          >
            返回
          </button>
        </div>
      )}
    </div>
  );
}

function GreetingView({
  contactId,
  contacts,
  text,
  onDone,
}: {
  contactId: string;
  contacts: AristocraticContact[];
  text: string;
  onDone: () => void;
}) {
  const contact = contacts.find((c) => c.id === contactId);
  const [narrated, setNarrated] = useState(false);

  const handleDone = useCallback(() => {
    setNarrated(true);
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto py-4">
      <EventDisplay
        title={`拜访${contact?.name ?? ''}`}
        paragraphs={[text]}
        onDone={handleDone}
      />
      {narrated && (
        <div className="flex justify-center mt-6">
          <button
            className="px-6 py-2 border border-stone-400 rounded hover:bg-stone-100 transition-colors font-serif text-sm text-stone-700"
            onClick={onDone}
          >
            继续
          </button>
        </div>
      )}
    </div>
  );
}

function TopicSelectionView({
  contact,
  topics,
  onSelect,
  onBack,
}: {
  contact: AristocraticContact;
  topics: DialogueTopic[];
  onSelect: (topic: DialogueTopic) => void;
  onBack: () => void;
}) {
  return (
    <div className="w-full max-w-md mx-auto py-4">
      <h3 className="font-serif text-lg text-stone-700 text-center mb-2 tracking-widest">
        拜访{contact.name}
      </h3>
      <p className="text-xs text-stone-400 text-center mb-6">
        关系: {contact.relationship}
      </p>
      <div className="space-y-3">
        {topics.map((topic) => (
          <button
            key={topic.id}
            className="w-full text-left px-4 py-3 border border-stone-200 rounded hover:bg-stone-50 transition-colors"
            onClick={() => onSelect(topic)}
          >
            <span className="font-serif text-stone-800">{topic.label}</span>
          </button>
        ))}
      </div>
      <div className="flex justify-center mt-6">
        <button
          className="px-6 py-2 border border-stone-300 rounded hover:bg-stone-50 transition-colors font-serif text-sm text-stone-700"
          onClick={onBack}
        >
          返回
        </button>
      </div>
    </div>
  );
}

function NarrationView({
  contactId,
  contacts,
  topic,
  onDone,
}: {
  contactId: string;
  contacts: AristocraticContact[];
  topic: DialogueTopic;
  onDone: () => void;
}) {
  const contact = contacts.find((c) => c.id === contactId);
  const [line] = useState<string>(
    () => topic.lines[Math.floor(Math.random() * topic.lines.length)],
  );

  return (
    <div className="w-full max-w-xl mx-auto py-4">
      <EventDisplay
        title={contact?.name}
        paragraphs={[line]}
        onDone={onDone}
      />
    </div>
  );
}

function ResultView({
  paragraphs,
  onDone,
}: {
  paragraphs: string[];
  onDone: () => void;
}) {
  const [narrated, setNarrated] = useState(false);

  return (
    <div className="w-full max-w-xl mx-auto py-4">
      <EventDisplay paragraphs={paragraphs} onDone={() => setNarrated(true)} />
      {narrated && (
        <div className="flex justify-center mt-6">
          <button
            className="px-6 py-2 border border-stone-400 rounded hover:bg-stone-100 transition-colors font-serif text-sm text-stone-700"
            onClick={onDone}
          >
            继续
          </button>
        </div>
      )}
    </div>
  );
}
