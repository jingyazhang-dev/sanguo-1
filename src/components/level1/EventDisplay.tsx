import { useCallback, useEffect, useRef } from 'react';
import { TypeInRenderer } from '../TypeInRenderer';
import type { TypeInRendererHandle, RenderNode } from '../TypeInRenderer';

interface EventDisplayProps {
  /** Optional title shown above the narration. */
  title?: string;
  /** Text paragraphs to type out. Supports custom tags (<em>, <speed>). */
  paragraphs: string[];
  /** Called when all paragraphs have finished typing. */
  onDone: () => void;
}

/**
 * Wrapper around TypeInRenderer for event/script narration.
 * Feeds paragraphs as TextNode items and calls onDone when the queue empties.
 */
export function EventDisplay({ title, paragraphs, onDone }: EventDisplayProps) {
  const rendererRef = useRef<TypeInRendererHandle>(null);
  const fedRef = useRef(false);

  useEffect(() => {
    if (!rendererRef.current || fedRef.current) return;
    fedRef.current = true;

    for (let i = 0; i < paragraphs.length; i++) {
      const node: RenderNode = {
        type: 'text',
        id: `evt-p-${i}`,
        content: paragraphs[i],
      };
      rendererRef.current.append(node);
    }
  }, [paragraphs]);

  const handleChoiceSelected = useCallback(() => {
    // EventDisplay has no choices — this is a no-op stub required by TypeInRenderer
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto">
      {title && (
        <h3 className="font-serif text-lg text-stone-700 text-center mb-4 tracking-widest">
          {title}
        </h3>
      )}
      <div
        className="cursor-pointer"
        onClick={() => rendererRef.current?.skipCurrent()}
      >
        <TypeInRenderer
          ref={rendererRef}
          onChoiceSelected={handleChoiceSelected}
          onQueueEmpty={onDone}
        />
      </div>
    </div>
  );
}
