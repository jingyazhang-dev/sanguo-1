import { useEffect, useRef } from 'react';

interface AutoAdvanceProps {
  onAdvance: () => void;
}

/** Immediately calls onAdvance on mount (guarded against StrictMode double-fire). */
export function AutoAdvance({ onAdvance }: AutoAdvanceProps) {
  const firedRef = useRef(false);
  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;
    onAdvance();
  }, [onAdvance]);
  return null;
}
