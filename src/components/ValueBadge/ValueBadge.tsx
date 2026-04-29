import { LOST_TITLE } from '../../shared/const';
import type { ValueBadgeProps } from '../../shared/types';


export default function ValueBadge({ value, isWin, isLose }: ValueBadgeProps) {
  const isLost = value === LOST_TITLE;
  let className = 'card-slot__badge';

  if (isWin) className += ' card-slot__badge--matched-win';
  else if (isLose) className += ' card-slot__badge--matched-lose';
  else if (isLost) className += ' card-slot__badge--lost';
  else className += ' card-slot__badge--win';

  return (
    <div className={className}>
      {isLost ? LOST_TITLE : `${value}x`}
    </div>
  );
}