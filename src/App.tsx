import { useGameStore } from './store/gameStore';
import { TitleScreen } from './components/TitleScreen';
import { Level0Screen } from './components/Level0Screen';
import { Level1Screen } from './components/Level1Screen';

function App() {
  const screen = useGameStore((s) => s.screen);
  if (screen === 'title')  return <TitleScreen />;
  if (screen === 'level0') return <Level0Screen />;
  return <Level1Screen />;
}

export default App;
