import { useEffect, useRef } from 'react';
import type { KeyboardEvent } from 'react';
import { useGameStore } from '../store/gameStore';

export function TitleScreen() {
  const goToGame = useGameStore((s) => s.goToLevel0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isNavigatingRef = useRef(false);

  // Mount: start looping title BGM; cleanup: stop audio and any in-flight fade
  useEffect(() => {
    const audio = new Audio('/assets/audio/level-bgm/title.mp3');
    audio.loop = true;
    audio.play().catch(() => {}); // graceful autoplay failure
    audioRef.current = audio;
    return () => {
      if (fadeIntervalRef.current !== null) {
        clearInterval(fadeIntervalRef.current);
        fadeIntervalRef.current = null;
      }
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, []);

  function startNewGame() {
    // Guard against re-entry from multiple rapid clicks
    if (isNavigatingRef.current) return;
    isNavigatingRef.current = true;

    const audio = audioRef.current;
    if (!audio || audio.paused) {
      goToGame();
      return;
    }
    // Fade volume to 0 over ~400 ms, then navigate
    fadeIntervalRef.current = setInterval(() => {
      if (audio.volume > 0.05) {
        audio.volume = Math.max(0, audio.volume - 0.05);
      } else {
        clearInterval(fadeIntervalRef.current!);
        fadeIntervalRef.current = null;
        audio.volume = 0;
        audio.pause();
        goToGame();
      }
    }, 20);
  }

  function handleMenuKeyDown(e: KeyboardEvent<HTMLElement>) {
    const focusable = Array.from(
      e.currentTarget.querySelectorAll<HTMLButtonElement>('button:not([disabled])'),
    );
    if (focusable.length === 0) return;
    const idx = focusable.indexOf(document.activeElement as HTMLButtonElement);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      focusable[idx === -1 ? 0 : (idx + 1) % focusable.length]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      focusable[idx === -1 ? focusable.length - 1 : (idx - 1 + focusable.length) % focusable.length]?.focus();
    }
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Top: title image */}
      <div className="relative w-full flex-shrink-0" style={{ height: '55vh' }}>
        <img
          src="/assets/images/cover/title.png"
          alt="游戏封面"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#faf8f5]" />
      </div>

      {/* Bottom: game name + menu */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        {/* Game name */}
        <div className="mb-12">
          <h1 className="font-serif text-2xl font-bold text-stone-900 leading-snug tracking-wider text-center">
            三国志重编：刘皇叔的命运分岔
          </h1>
        </div>

        {/* Menu */}
        <nav aria-label="主菜单" onKeyDown={handleMenuKeyDown}>
          <ul className="flex flex-col gap-6 items-center" role="list">
            <li>
              <button
                onClick={startNewGame}
                className="font-serif text-xl text-stone-700 tracking-widest hover:text-stone-900 transition-colors cursor-pointer focus:outline-none focus-visible:text-stone-900"
              >
                新游戏
              </button>
            </li>
            <li>
              <button
                disabled
                className="font-serif text-xl text-stone-400 tracking-widest cursor-not-allowed"
              >
                继续
              </button>
            </li>
            <li>
              <button
                disabled
                className="font-serif text-xl text-stone-400 tracking-widest cursor-not-allowed"
              >
                设置
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
