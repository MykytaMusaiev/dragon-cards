import { useGameStore, selectIsControlsLocked, selectCanPlaceBet } from '../../shared/store/gameStore';
import BetAmount from './BetAmount';
import './BettingPanel.css';
import RiskSelector from './RiskSelector';

export default function BettingPanel() {
  const balance = useGameStore((s) => s.balance);
  const placeBet = useGameStore((s) => s.placeBet);
  const isLocked = useGameStore(selectIsControlsLocked);
  const canPlaceBet = useGameStore(selectCanPlaceBet);

  return (
    <aside className="betting-panel">
      <div className="betting-panel__content">
        <BetAmount />
        <RiskSelector />
        <button
          className="betting-panel__place-bet"
          onClick={placeBet}
          disabled={!canPlaceBet || isLocked}
        >
          Place Bet
        </button>
      </div>

      <div className="betting-panel__footer">
        <span className="betting-panel__balance-label">Balance:</span>
        <span className="betting-panel__balance-value">
          {balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>
    </aside>
  );
}