interface ClickToContinueProps {
  onClick: () => void;
}

/**
 * Subtle blinking "▼ 点击继续" prompt shown between narrative phases.
 * Calls stopPropagation so parent onClick handlers are not double-triggered.
 */
export function ClickToContinue({ onClick }: ClickToContinueProps) {
  return (
    <button
      className="block mx-auto mt-8 font-serif text-sm text-stone-400 animate-pulse cursor-pointer
                 hover:text-stone-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 rounded"
      onClick={(e) => { e.stopPropagation(); onClick(); }}
    >
      ▼ 点击继续
    </button>
  );
}
