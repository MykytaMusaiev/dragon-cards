import { GAME_PHASES } from '../../shared/const';
import { useGameStore } from '../../shared/store/gameStore';
import BetAmount from './BetAmount';
import RiskSelector from './RiskSelector';
import './BettingPanel.css';
import { selectIsControlsLocked } from '../../shared/store/selectors';

export default function BettingPanel() {
  const phase = useGameStore((s) => s.phase);
  const balance = useGameStore((s) => s.balance);
  const betAmount = useGameStore((s) => s.betAmount);

  const placeBet = useGameStore((s) => s.placeBet);
  const confirmPlacement = useGameStore((s) => s.confirmPlacement);
  const startRevealing = useGameStore((s) => s.startRevealing);

  const isLocked = useGameStore(selectIsControlsLocked);

  const handleAction = () => {
    if (phase === GAME_PHASES.IDLE || phase === GAME_PHASES.RESULT) {
      placeBet();
      confirmPlacement();
      startRevealing();
    }
  };

  const isDisabled = isLocked || betAmount > balance || betAmount <= 0;

  return (
    <aside className="betting-panel">
      <div className="betting-panel__content">
        <BetAmount />
        <RiskSelector />

        <button
          className="betting-panel__place-bet"
          onClick={handleAction}
          disabled={isDisabled}
        >
          {phase === GAME_PHASES.REVEALING ? 'Revealing...' : 'Place Bet'}
        </button>
      </div>

      <div className="betting-panel__footer">
        <span className="betting-panel__balance-label">Balance:</span>
        <span className="betting-panel__balance-value">
          {balance.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
        </span>
      </div>
    </aside>
  );
}