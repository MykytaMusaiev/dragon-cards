import type { DraggableAttributes } from '@dnd-kit/core';
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { DRAGON_LABELS } from '../../shared/const';
import type { CardProps } from '../../shared/types';
import './Card.css';

interface DraggableCardComponentProps extends Omit<CardProps, 'onDragStart' | 'onDragOver' | 'onDrop' | 'isDragging'> {
  attributes?: DraggableAttributes;
  listeners?: SyntheticListenerMap;
  isGhost?: boolean;
  isWin?: boolean;
  isLose?: boolean;
  isJackpot?: boolean;
}

export default function Card({
  dragonType,
  isFaceDown = false,
  isRevealed = false,
  isSelected = false,
  isDropTarget = false,
  draggable = false,
  isGhost = false,
  isWin = false,
  isLose = false,
  isJackpot = false,
  onClick,
  attributes,
  listeners,
}: DraggableCardComponentProps) {
  const containerClasses = [
    'card',
    isFaceDown && 'card--flippable',
    isRevealed && 'card--revealed',
    isSelected && 'card--selected',
    isGhost && 'card--ghost',
    isDropTarget && 'card--drop-target',
    draggable && 'card--draggable',
    isJackpot && 'card--jackpot-glow',
    isWin && !isJackpot && 'card--win-glow',
    isLose && 'card--lose-glow',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={containerClasses}
      onClick={onClick}
      {...attributes}
      {...listeners}
    >
      <div className="card__inner ">
        <div className="card__face card__face--back">
          <img
            src="/images/card-back.avif"
            alt="Card back"
            className="card__image"
            draggable={false}
          />
        </div>
        <div className="card__face card__face--front">
          <img
            src={`/images/dragons/dragon_${dragonType}.avif`}
            alt={DRAGON_LABELS[dragonType]}
            className="card__image"
            draggable={false}
          />
        </div>
      </div>
    </div>
  );
}