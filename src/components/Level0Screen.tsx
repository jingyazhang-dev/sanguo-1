import { useEffect } from 'react';
import { useLevel0Store } from '../store/level0Store';
import { Level0Cover } from './Level0Cover';
import { Level0Narrative } from './Level0Narrative';
import { Level0Summary } from './Level0Summary';

export function Level0Screen() {
  const { phase, reset } = useLevel0Store();

  // Reset level state and start BGM when entering level 0
  useEffect(() => {
    reset();

    const audio = new Audio('/assets/audio/level-bgm/chapter0.mp3');
    audio.loop = true;
    audio.addEventListener('error', () => {
      console.warn('Level0Screen: failed to load chapter0.mp3');
    });
    audio.play().catch(() => {}); // graceful autoplay failure

    return () => {
      audio.pause();
      audio.src = '';
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  switch (phase) {
    case 'cover':     return <Level0Cover />;
    case 'narrative': return <Level0Narrative />;
    case 'summary':   return <Level0Summary />;
  }
}
