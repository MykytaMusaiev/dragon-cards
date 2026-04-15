import { useGameStore } from '../../shared/store/gameStore';
import { LOST_TITLE } from '../../shared/const';
import {
  selectLosingIndices,
  selectWinningIndices,
} from '../../shared/store/selectors';
import type { CardValue } from '../../shared/types';
import './BadgeRow.css';

export default function BadgeRow() {
  const badges = useGameStore((s) => s.badges);
  const winningIndices = useGameStore(selectWinningIndices);
  const losingIndices = useGameStore(selectLosingIndices);

  return (
    <div className="badge-row">
      {badges.map((value, i) => (
        <ValueBadge
          key={i}
          value={value}
          isWin={winningIndices.has(i)}
          isLose={losingIndices.has(i)}
        />
      ))}
    </div>
  );
}

// ─── ValueBadge ──────────────────────────────────────────────────────────────

function ValueBadge({
  value,
  isWin,
  isLose,
}: {
  value: CardValue;
  isWin: boolean;
  isLose: boolean;
}) {
  const isLost = value === LOST_TITLE;
  let className = 'badge-row__badge';

  if (isWin) className += ' badge-row__badge--matched-win';
  else if (isLose) className += ' badge-row__badge--matched-lose';
  else if (isLost) className += ' badge-row__badge--lost';
  else className += ' badge-row__badge--win';

  return (
    <div className={className}>
      {isLost ? LOST_TITLE : `${value}x`}
    </div>
  );
}