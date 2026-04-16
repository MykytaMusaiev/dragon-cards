import { useGameStore } from '../../shared/store/gameStore';
import { useAnimatedCounter } from '../../shared/hooks/useAnimatedCounter';
import './BalanceDisplay.css';

export default function BalanceDisplay() {
  const balance = useGameStore((s) => s.balance);
  const animated = useAnimatedCounter(balance);

  return (
    <div className="balance-display">
      <span className="balance-display__label">Balance:</span>
      <span className="balance-display__value">
        {animated.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </span>
    </div>
  );
}