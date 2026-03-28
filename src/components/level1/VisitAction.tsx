import { useState, useCallback, useMemo } from 'react';
import { useLevel1Store } from '../../store/level1Store';
import { getTopicsForContact } from '../../engine/level1/dialogues/aristocratDialogues';
import { EventDisplay } from './EventDisplay';
import { MIZHU_JOIN_FUNDS_BONUS } from '../../engine/level1/constants';
import type {
  DialogueTopic,
  AristocraticContact,
  Follower,
} from '../../types/level1Types';

/* ── Step state machine ───────────────────────────────────── */

type Step =
  | { kind: 'rejection' }
  | { kind: 'selectContact' }
  | { kind: 'blocked'; contactId: string }
  | { kind: 'selectTopic'; contactId: string }
  | { kind: 'dialogue'; contactId: string; topic: DialogueTopic }
  | { kind: 'done' };

/* ── Mi Zhu follower definition ───────────────────────────── */

const MI_ZHU_FOLLOWER: Follower = {
  id: 'mizhu',
  name: '糜竺',
  courtesy: '子仲',
  attrs: { strength: 10, intelligence: 14, charisma: 16 },
  role: 'both',
  companionCooldownUntilRound: 0,
  relationship: 80,
  assignedTask: null,
  taskPreferences: { forage: 7, tax: 6, visitNoble: 5 },
};

/* ── Props ────────────────────────────────────────────────── */

interface VisitActionProps {
  onDone: () => void;
  onCancel: () => void;
}

/* ── Component ────────────────────────────────────────────── */

export function VisitAction({ onDone, onCancel }: VisitActionProps) {
  const conditions = useLevel1Store((s) => s.conditions);
  const stats = useLevel1Store((s) => s.stats);
  const contacts = useLevel1Store((s) => s.contacts);
  const round = useLevel1Store((s) => s.round);

  /* Initial step depends on whether Kong Rong is unlocked */
  const [step, setStep] = useState<Step>(() =>
    conditions.kongRongUnlocked ? { kind: 'selectContact' } : { kind: 'rejection' },
  );

  /* Guard: have we already applied side-effects for the current dialogue? */
  const [effectsApplied, setEffectsApplied] = useState(false);

  /* Contacts the player knows about (status !== 'locked') */
  const visibleContacts = useMemo(
    () => contacts.filter((c) => c.status !== 'locked'),
    [contacts],
  );

  /* ── Handlers ───────────────────────────────────────────── */

  const handleSelectContact = useCallback(
    (contactId: string) => {
      if (contactId === 'kongrong') {
        // Kong Rong is always accessible once unlocked
        setStep({ kind: 'selectTopic', contactId });
        return;
      }
      // Mi Zhu & Chen Deng need publicOpinionSet
      if (!conditions.publicOpinionSet) {
        setStep({ kind: 'blocked', contactId });
        return;
      }
      setStep({ kind: 'selectTopic', contactId });
    },
    [conditions.publicOpinionSet],
  );

  const handleSelectTopic = useCallback(
    (contactId: string, topic: DialogueTopic) => {
      setEffectsApplied(false);
      setStep({ kind: 'dialogue', contactId, topic });
    },
    [],
  );

  /** Apply topic side-effects exactly once after narration finishes. */
  const applyTopicEffects = useCallback(
    (contactId: string, topic: DialogueTopic) => {
      if (effectsApplied) return;
      setEffectsApplied(true);

      const s = useLevel1Store.getState();

      // ── Generic effects ──
      if (topic.statsDelta) s.applyStatsDelta(topic.statsDelta);
      if (topic.attrsDelta) s.applyAttrsDelta(topic.attrsDelta);
      if (topic.conditionChanges) s.updateConditions(topic.conditionChanges);

      // ── Greeting → relationship +5 ──
      if (topic.id.endsWith('-greeting')) {
        s.updateContactRelationship(contactId, 5);
      }

      // ── Special: unlock contacts via Kong Rong introductions ──
      if (topic.id === 'kongrong-intro-mizhu') {
        s.updateContactStatus('mizhu', 'known');
      }
      if (topic.id === 'kongrong-intro-chendeng') {
        s.updateContactStatus('chendeng', 'known');
      }

      // ── Special: Mi Zhu joins as follower with funds bonus ──
      if (topic.id === 'mizhu-join') {
        s.addFollower(MI_ZHU_FOLLOWER);
        s.applyStatsDelta({ funds: MIZHU_JOIN_FUNDS_BONUS });
      }
    },
    [effectsApplied],
  );

  /** Called when the rejection narration finishes typing. */
  const handleRejectionNarrated = useCallback(() => {
    if (!conditions.triedVisitFailed) {
      useLevel1Store.getState().updateConditions({ triedVisitFailed: true });
    }
  }, [conditions.triedVisitFailed]);

  /* ── Render by step ─────────────────────────────────────── */

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

    case 'selectTopic': {
      const contact = contacts.find((c) => c.id === step.contactId);
      if (!contact) return null;
      const topics = getTopicsForContact(contact, conditions, stats, round);
      return (
        <TopicSelectionView
          contact={contact}
          topics={topics}
          onSelect={(topic) => handleSelectTopic(step.contactId, topic)}
          onBack={() => setStep({ kind: 'selectContact' })}
        />
      );
    }

    case 'dialogue':
      return (
        <DialogueView
          contactId={step.contactId}
          topic={step.topic}
          contacts={contacts}
          onEffectsApply={() => applyTopicEffects(step.contactId, step.topic)}
          onDone={onDone}
        />
      );

    case 'done':
      return null;

    default:
      return null;
  }
}

/* ── Sub-views ────────────────────────────────────────────── */

/** Shown when the player has no known contacts at all. */
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
            className="px-6 py-2 border border-stone-300 rounded
                       hover:bg-stone-50 transition-colors
                       font-serif text-sm text-stone-700"
            onClick={onDone}
          >
            返回
          </button>
        </div>
      )}
    </div>
  );
}

/** Lists all known (non-locked) contacts for the player to pick. */
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
            className="w-full text-left px-4 py-3
                       border border-stone-200 rounded
                       hover:bg-stone-50 transition-colors"
            onClick={() => onSelect(contact.id)}
          >
            <span className="font-serif text-stone-800 font-bold">
              {contact.name}
            </span>
            {contact.courtesy && (
              <span className="text-xs text-stone-400 ml-2">
                字{contact.courtesy}
              </span>
            )}
            <p className="text-xs text-stone-500 mt-0.5">
              关系: {contact.relationship}
            </p>
          </button>
        ))}
      </div>

      <div className="flex justify-center mt-6">
        <button
          className="px-6 py-2 border border-stone-300 rounded
                     hover:bg-stone-50 transition-colors
                     font-serif text-sm text-stone-700"
          onClick={onCancel}
        >
          返回
        </button>
      </div>
    </div>
  );
}

/** Shown when Mi Zhu / Chen Deng turns the player away. */
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
          `你前往${name}府上拜访，却被拒之门外。你的名声尚不足以获得接见。`,
        ]}
        onDone={() => setNarrated(true)}
      />
      {narrated && (
        <div className="flex justify-center mt-6">
          <button
            className="px-6 py-2 border border-stone-300 rounded
                       hover:bg-stone-50 transition-colors
                       font-serif text-sm text-stone-700"
            onClick={onBack}
          >
            返回
          </button>
        </div>
      )}
    </div>
  );
}

/** Lists available dialogue topics for the selected contact. */
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
            className="w-full text-left px-4 py-3
                       border border-stone-200 rounded
                       hover:bg-stone-50 transition-colors"
            onClick={() => onSelect(topic)}
          >
            <span className="font-serif text-stone-800">{topic.label}</span>
          </button>
        ))}
      </div>

      <div className="flex justify-center mt-6">
        <button
          className="px-6 py-2 border border-stone-300 rounded
                     hover:bg-stone-50 transition-colors
                     font-serif text-sm text-stone-700"
          onClick={onBack}
        >
          返回
        </button>
      </div>
    </div>
  );
}

/** Displays a randomly-selected line from the topic, then a "继续" button. */
function DialogueView({
  contactId,
  topic,
  contacts,
  onEffectsApply,
  onDone,
}: {
  contactId: string;
  topic: DialogueTopic;
  contacts: AristocraticContact[];
  onEffectsApply: () => void;
  onDone: () => void;
}) {
  const contact = contacts.find((c) => c.id === contactId);
  const [narrated, setNarrated] = useState(false);

  /* Pick one random line; useState ensures stability across re-renders. */
  const [line] = useState<string>(
    () => topic.lines[Math.floor(Math.random() * topic.lines.length)],
  );

  const handleTypingDone = useCallback(() => {
    onEffectsApply();
    setNarrated(true);
  }, [onEffectsApply]);

  return (
    <div className="w-full max-w-xl mx-auto py-4">
      <EventDisplay
        title={contact?.name}
        paragraphs={[line]}
        onDone={handleTypingDone}
      />
      {narrated && (
        <div className="flex justify-center mt-6">
          <button
            className="px-6 py-2 border border-stone-300 rounded
                       hover:bg-stone-50 transition-colors
                       font-serif text-sm text-stone-700"
            onClick={onDone}
          >
            继续
          </button>
        </div>
      )}
    </div>
  );
}
