import { useGameStore } from '../../shared/store/gameStore';
import { MAX_BET } from '../../shared/config/gameConfig';
import './BetAmount.css';
import { selectIsControlsLocked } from '../../shared/store/selectors';

export default function BetAmount() {
  const betAmount = useGameStore((s) => s.betAmount);
  const balance = useGameStore((s) => s.balance);
  const setBetAmount = useGameStore((s) => s.setBetAmount);
  const isLocked = useGameStore(selectIsControlsLocked);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = parseFloat(e.target.value);
    if (!isNaN(raw)) {
      setBetAmount(raw);
    } else if (e.target.value === '') {
      setBetAmount(1);
    }
  };

  const handleBlur = () => {
    if (betAmount < 1) {
      setBetAmount(1);
    }
  };

  const handleHalf = () => setBetAmount(Math.max(1, betAmount / 2));
  const handleDouble = () => setBetAmount(betAmount * 2);
  const handleMax = () => setBetAmount(Math.min(MAX_BET, balance));

  return (
    <div className="bet-amount">
      <div className="bet-amount__header">
        <div className="bet-amount__title-wrap">
          <span className="bet-amount__label">Bet Amount</span>
          <span className="bet-amount__max-label">
            Max: <span className="bet-amount__max-value">{MAX_BET.toFixed(2)}</span>
          </span>
        </div>
        <span className="bet-amount__currency-label">$</span>
      </div>

      <div className={`bet-amount__field-group ${isLocked ? 'bet-amount__field-group--locked' : ''}`}>
        <input
          className="bet-amount__input"
          type="number"
          step="0.01"
          min={1}
          max={Math.min(MAX_BET, balance)}
          value={betAmount === 0 ? '' : betAmount}
          onChange={handleInput}
          onBlur={handleBlur}
          disabled={isLocked}
        />

        <div className="bet-amount__inner-actions">
          <button
            className="bet-amount__tile-btn"
            onClick={handleHalf}
            disabled={isLocked}
          >
            1/2
          </button>
          <button
            className="bet-amount__tile-btn"
            onClick={handleDouble}
            disabled={isLocked}
          >
            x2
          </button>
          <button
            className="bet-amount__tile-btn bet-amount__tile-btn--max"
            onClick={handleMax}
            disabled={isLocked}
          >
            Max
          </button>
        </div>
      </div>
    </div>
  );
}