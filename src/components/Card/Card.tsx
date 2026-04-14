import { DRAGON_LABELS } from '../../shared/const';
import type { CardProps } from '../../shared/types';
import './Card.css';


export default function Card({
  dragonType,
  isFaceDown = false,
  isRevealed = false,
  isSelected = false,
  isDragging = false,
  isDropTarget = false,
  draggable = false,
  onClick,
  onDragStart,
  onDragOver,
  onDrop,
}: CardProps) {
  return (
    <div
      className={[
        'card',
        isFaceDown ? 'card--flippable' : '',
        isRevealed ? 'card--revealed' : '',
        isSelected ? 'card--selected' : '',
        isDragging ? 'card--dragging' : '',
        isDropTarget ? 'card--drop-target' : '',
        draggable ? 'card--draggable' : '',
      ].filter(Boolean).join(' ')}
      onClick={onClick}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div className="card__inner">
        <div className="card__face card__face--back">
          <img
            src="/images/card-back.jpg"
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