import type { CardValue, DragonType } from '../../shared/types';
import './Card.css';

interface CardProps {
  dragonType: DragonType;
  value?: CardValue;
  isFaceDown?: boolean;
  isRevealed?: boolean;      // тригерить flip анімацію
  isSelected?: boolean;      // золота рамка при click-to-swap
  isDragging?: boolean;      // напівпрозорість під час drag
  isDropTarget?: boolean;    // підсвітка зони drop
  draggable?: boolean;
  onClick?: () => void;
  onDragStart?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
}

const DRAGON_LABELS: Record<DragonType, string> = {
  fire: 'Fire',
  ice: 'Ice',
  storm: 'Storm',
  earth: 'Earth',
  shadow: 'Shadow',
  wind: 'Wind',
};

function ValueBadge({ value }: { value: CardValue }) {
  const isLost = value === 'LOST';
  return (
    <div className={`card__badge ${isLost ? 'card__badge--lost' : 'card__badge--win'}`}>
      {isLost ? 'LOST' : `${value}x`}
    </div>
  );
}

export default function Card({
  dragonType,
  value,
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
  onDragEnd,
}: CardProps) {
  const showBack = isFaceDown && !isRevealed;

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
      onDragEnd={onDragEnd}
    >
      <div className="card__inner">
        {/* Сорочка (back) */}
        <div className="card__face card__face--back">
          <img
            src="/images/card-back.jpg"
            alt="Card back"
            className="card__image"
            draggable={false}
          />
        </div>

        {/* Лицева сторона (front) */}
        <div className="card__face card__face--front">
          <img
            src={`/images/dragons/dragon_${dragonType}.avif`}
            alt={DRAGON_LABELS[dragonType]}
            className="card__image"
            draggable={false}
          />
          {!showBack && value !== undefined && <ValueBadge value={value} />}
          <div className="card__dragon-label">{DRAGON_LABELS[dragonType]}</div>
        </div>
      </div>
    </div>
  );
}