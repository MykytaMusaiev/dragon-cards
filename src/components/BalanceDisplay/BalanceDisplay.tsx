import { useGameStore } from '../../shared/store/gameStore';
import { useAnimatedCounter } from '../../shared/hooks/useAnimatedCounter';

export default function BalanceDisplay() {
  const balance = useGameStore((s) => s.balance);
  const animated = useAnimatedCounter(balance);

  return (
    <>
      <span className="betting-panel__balance-label">Balance:</span>
      <span className="betting-panel__balance-value">
        {animated.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </span>
    </>
  );
}