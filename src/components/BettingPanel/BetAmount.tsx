import { useGameStore, selectIsControlsLocked } from '../../shared/store/gameStore';
import { MAX_BET } from '../../shared/config/gameConfig';
import './BetAmount.css';

export default function BetAmount() {
  const betAmount = useGameStore((s) => s.betAmount);
  const balance = useGameStore((s) => s.balance);
  const setBetAmount = useGameStore((s) => s.setBetAmount);
  const isLocked = useGameStore(selectIsControlsLocked);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = parseFloat(e.target.value);
    if (!isNaN(raw)) setBetAmount(raw);
  };

  const handleHalf = () => setBetAmount(Math.max(1, betAmount / 2));
  const handleDouble = () => setBetAmount(betAmount * 2);
  const handleMax = () => setBetAmount(Math.min(MAX_BET, balance));

  return (
    <div className="bet-amount">
      <div className="bet-amount__header">
        <span className="bet-amount__label">Bet Amount</span>
        <span className="bet-amount__max">Max Bet: {MAX_BET.toFixed(2)}</span>
      </div>

      <div className="bet-amount__row">
        <div className="bet-amount__input-wrap">
          <input
            className="bet-amount__input"
            type="number"
            min={1}
            max={Math.min(MAX_BET, balance)}
            value={betAmount}
            onChange={handleInput}
            disabled={isLocked}
          />
          <span className="bet-amount__currency">$</span>
        </div>
      </div>

      <div className="bet-amount__buttons">
        <button className="bet-amount__btn" onClick={handleHalf} disabled={isLocked}>
          1/2
        </button>
        <button className="bet-amount__btn" onClick={handleDouble} disabled={isLocked}>
          x2
        </button>
        <button className="bet-amount__btn" onClick={handleMax} disabled={isLocked}>
          Max
        </button>
      </div>
    </div>
  );
}