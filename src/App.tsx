import './App.css';
import BettingPanel from './components/BettingPanel/BettingPanel';
import GameField from './components/GameField/GameField';

export default function App() {
  return (
    <div className="app-layout">
      <BettingPanel />
      <GameField />
    </div>
  );
}