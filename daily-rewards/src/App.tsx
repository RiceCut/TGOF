import './App.css';
import DailyRewardsPanel from './components/DailyRewardsPanel';
import { GameStateProvider } from './gameState';

function App() {
  return (
    <GameStateProvider>
      <div className="app-shell">
        <DailyRewardsPanel />
      </div>
    </GameStateProvider>
  );
}

export default App;
