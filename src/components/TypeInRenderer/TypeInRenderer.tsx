import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import type {
  ActiveCursor,
  ChoiceDisplayItem,
  DisplayItem,
  RenderNode,
  SpeedLevel,
  TextDisplayItem,
  TypeInRendererHandle,
  TypeInRendererProps,
} from './types';
import { parseText } from './parseText';
import { ChoiceNodeRenderer } from './ChoiceNodeRenderer';

// ─── Speed constants ──────────────────────────────────────────────────────────

const SPEED_MS: Record<SpeedLevel, number> = { fast: 20, normal: 60, slow: 120 };

function getDelay(segSpeed: SpeedLevel | undefined, globalSpeed: SpeedLevel): number {
  return SPEED_MS[segSpeed ?? globalSpeed];
}

// ─── Text item renderer ───────────────────────────────────────────────────────

/**
 * Renders a TextDisplayItem (in-progress or completed).
 * Memoised: in-progress items re-render each character tick (item prop changes);
 * completed items never re-render again (item prop is immutable once done=true).
 */
const TextItem = memo(function TextItem({ item }: { item: TextDisplayItem }) {
  return (
    <p className="mb-5 font-serif text-lg leading-9 whitespace-pre-wrap break-words last:mb-0">
      {item.segments.map((seg, i) => (
        <span key={i} className={seg.emphasis ? 'font-bold text-red-800' : undefined}>
          {seg.text}
        </span>
      ))}
    </p>
  );
});

// ─── Main component ───────────────────────────────────────────────────────────

export const TypeInRenderer = forwardRef<TypeInRendererHandle, TypeInRendererProps>(
  function TypeInRenderer({ speed = 'normal', onChoiceSelected, onQueueEmpty }, ref) {
    const [items, setItems] = useState<DisplayItem[]>([]);
    const scrollAnchorRef = useRef<HTMLDivElement>(null);

    // ── Render control refs (mutations never trigger re-renders) ──────────────
    const queueRef = useRef<RenderNode[]>([]);
    /** True while a TextNode is being character-by-character animated. */
    const isTypingRef = useRef(false);
    /** True while waiting for the user to select a ChoiceNode option. */
    const isWaitingForChoiceRef = useRef(false);
    const timeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const cursorRef = useRef<ActiveCursor | null>(null);
    /** Incremented on reset() so any in-flight typeChar calls become stale and self-terminate. */
    const generationRef = useRef(0);
    /** Current global speed, kept in sync with the prop. */
    const speedRef = useRef<SpeedLevel>(speed);
    /** Parsed segments for the TextNode currently being animated. */
    const parsedSegsRef = useRef<ReturnType<typeof parseText>>([]);
    /** Tracks item count so we only scroll when a new item is appended, not on every character. */
    const prevItemCountRef = useRef(0);
    /** Stable ref for onChoiceSelected — keeps handleChoiceSelect deps-free. */
    const onChoiceSelectedRef = useRef(onChoiceSelected);
    /** Stable ref for onQueueEmpty — called when queue drains and typing is done. */
    const onQueueEmptyRef = useRef(onQueueEmpty);

    // Stable function refs — updated each render so closures always call the latest version
    const tryAdvanceFnRef = useRef<() => void>(() => {});
    const typeCharFnRef = useRef<(gen: number) => void>(() => {});

    useEffect(() => {
      speedRef.current = speed;
    }, [speed]);

    useEffect(() => {
      onChoiceSelectedRef.current = onChoiceSelected;
    }, [onChoiceSelected]);

    useEffect(() => {
      onQueueEmptyRef.current = onQueueEmpty;
    }, [onQueueEmpty]);

    // Scroll only when a new top-level item is appended, not on every character tick
    useEffect(() => {
      if (items.length > prevItemCountRef.current) {
        prevItemCountRef.current = items.length;
        scrollAnchorRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    }, [items]);

    // ── typeChar: advances the animation one character per call ───────────────
    function typeChar(gen: number) {
      // Guard against stale calls after reset()
      if (gen !== generationRef.current) return;

      const cursor = cursorRef.current;
      if (!cursor) return;

      const segs = parsedSegsRef.current;
      const seg = segs[cursor.segIndex];

      // Current segment exhausted — advance to next or finish
      if (!seg || cursor.charIndex >= seg.text.length) {
        if (cursor.segIndex + 1 < segs.length) {
          cursor.segIndex++;
          cursor.charIndex = 0;
          typeCharFnRef.current(gen); // immediate: no inter-segment delay
        } else {
          // All segments done — mark item complete and advance queue
          setItems((prev) => {
            if (prev.length === 0) return prev;
            const newItems = [...prev];
            newItems[prev.length - 1] = {
              ...(prev[prev.length - 1] as TextDisplayItem),
              done: true,
            };
            return newItems;
          });
          isTypingRef.current = false;
          cursorRef.current = null;
          parsedSegsRef.current = [];
          tryAdvanceFnRef.current();
        }
        return;
      }

      // Capture segIndex as a primitive before the async updater runs,
      // so the updater cannot observe a later mutation of cursorRef.
      const segIdx = cursor.segIndex;
      const nextChar = seg.text[cursor.charIndex];
      cursor.charIndex++;

      setItems((prev) => {
        if (prev.length === 0) return prev;
        const lastIdx = prev.length - 1;
        const lastItem = prev[lastIdx] as TextDisplayItem;
        const newSegments = [...lastItem.segments];
        newSegments[segIdx] = {
          ...newSegments[segIdx],
          text: newSegments[segIdx].text + nextChar,
        };
        const newItems = [...prev];
        newItems[lastIdx] = { ...lastItem, segments: newSegments };
        return newItems;
      });

      const delay = getDelay(seg.speed, speedRef.current);
      timeoutIdRef.current = setTimeout(() => typeCharFnRef.current(gen), delay);
    }
    typeCharFnRef.current = typeChar;

    // ── tryAdvance: dequeues and starts rendering the next node ───────────────
    function tryAdvance() {
      if (isTypingRef.current || isWaitingForChoiceRef.current) return;

      // Iterative loop: drains consecutive empty TextNodes without recursion
      while (queueRef.current.length > 0) {
        const node = queueRef.current.shift()!;

        if (node.type === 'choice') {
          setItems((prev) => [
            ...prev,
            { type: 'choice', id: node.id, choices: node.choices },
          ]);
          isWaitingForChoiceRef.current = true;
          return;
        }

        // TextNode
        const parsed = parseText(node.content);
        if (parsed.length === 0) {
          continue; // skip empty node, check the next one
        }

        const displaySegments = parsed.map((seg) => ({
          text: '',
          emphasis: seg.emphasis,
          speed: seg.speed,
        }));

        parsedSegsRef.current = parsed;
        isTypingRef.current = true;
        cursorRef.current = { segIndex: 0, charIndex: 0 };

        setItems((prev) => [
          ...prev,
          { type: 'text', id: node.id, segments: displaySegments, done: false },
        ]);

        // Defer first typeChar tick so the above setItems has been committed
        const gen = generationRef.current;
        timeoutIdRef.current = setTimeout(() => typeCharFnRef.current(gen), 0);
        return;
      }
      // Queue is empty and not typing/waiting — signal that rendering is complete
      onQueueEmptyRef.current?.();
    }
    tryAdvanceFnRef.current = tryAdvance;

    // ── Choice selection handler ───────────────────────────────────────────────
    // Empty deps: onChoiceSelected is accessed via ref, so this callback never recreates,
    // preserving React.memo on ChoiceNodeRenderer for all historical choice items.
    const handleChoiceSelect = useCallback(
      (choiceId: string) => {
        setItems((prev) => {
          const lastIdx = prev.length - 1;
          if (lastIdx < 0 || prev[lastIdx].type !== 'choice') return prev;
          const last = prev[lastIdx] as ChoiceDisplayItem;
          if (last.selectedId !== undefined) return prev; // already selected
          const newItems = [...prev];
          newItems[lastIdx] = { ...last, selectedId: choiceId };
          return newItems;
        });
        // ORDERING CRITICAL: onChoiceSelected MUST be called before isWaitingForChoiceRef
        // is cleared. The callback (e.g. Level0Narrative.handleChoiceSelected) calls
        // renderer.append(), which internally calls tryAdvance(). While isWaitingForChoice
        // is still true, tryAdvance() returns early — so the newly queued nodes are safely
        // buffered. If this order were reversed (flag cleared first), tryAdvance() would
        // run with an empty queue and fire onQueueEmpty prematurely.
        onChoiceSelectedRef.current(choiceId);
        isWaitingForChoiceRef.current = false;
        tryAdvanceFnRef.current();
      },
      [],
    );

    // ── Imperative handle ─────────────────────────────────────────────────────
    useImperativeHandle(
      ref,
      () => ({
        append(node: RenderNode) {
          queueRef.current.push(node);
          tryAdvanceFnRef.current();
        },
        reset() {
          // Invalidate any in-flight typeChar calls
          generationRef.current++;
          if (timeoutIdRef.current !== null) {
            clearTimeout(timeoutIdRef.current);
            timeoutIdRef.current = null;
          }
          // Clear all render state
          queueRef.current = [];
          isTypingRef.current = false;
          isWaitingForChoiceRef.current = false;
          cursorRef.current = null;
          parsedSegsRef.current = [];
          prevItemCountRef.current = 0;
          setItems([]);
        },
        skipCurrent() {
          if (!isTypingRef.current) return;

          // Cancel the in-flight timer
          if (timeoutIdRef.current !== null) {
            clearTimeout(timeoutIdRef.current);
            timeoutIdRef.current = null;
          }

          // Instantly fill all segments of the current text item with their full text
          const segs = parsedSegsRef.current;
          setItems((prev) => {
            if (prev.length === 0) return prev;
            const lastIdx = prev.length - 1;
            const lastItem = prev[lastIdx] as TextDisplayItem;
            const completedSegments = segs.map((seg) => ({
              text: seg.text,
              emphasis: seg.emphasis,
              speed: seg.speed,
            }));
            const newItems = [...prev];
            newItems[lastIdx] = { ...lastItem, segments: completedSegments, done: true };
            return newItems;
          });

          // Reset typing state and advance to next node
          isTypingRef.current = false;
          cursorRef.current = null;
          parsedSegsRef.current = [];
          tryAdvanceFnRef.current();
        },
      }),
      // Empty deps: append/reset/skipCurrent only use refs + setItems (both stable) via tryAdvanceFnRef
      [],
    );

    // ── Render ────────────────────────────────────────────────────────────────
    return (
      <div>
        {items.map((item) => {
          if (item.type === 'text') {
            return <TextItem key={item.id} item={item} />;
          }

          return (
            <ChoiceNodeRenderer
              key={item.id}
              choices={item.choices}
              selectedId={item.selectedId}
              onSelect={handleChoiceSelect}
            />
          );
        })}
        <div ref={scrollAnchorRef} />
      </div>
    );
  },
);
