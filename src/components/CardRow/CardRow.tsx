import { useState } from 'react';
import { useGameStore } from '../../shared/store/gameStore';
import type { CardRowProps, CardValue } from '../../shared/types';
import Card from '../Card/Card';
import './CardRow.css';
import { LOST_TITLE } from '../../shared/const';
import { selectIsPlacementActive, selectLosingIndices, selectWinningIndices } from '../../shared/store/selectors';

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
  let className = 'card-column__badge';

  if (isWin) className += ' card-column__badge--matched-win';
  else if (isLose) className += ' card-column__badge--matched-lose';
  else if (isLost) className += ' card-column__badge--lost';
  else className += ' card-column__badge--win';

  return (
    <div className={className}>
      {isLost ? LOST_TITLE : `${value}x`}
    </div>
  );
}

export default function CardRow({ type }: CardRowProps) {
  const topCards = useGameStore((s) => s.topCards);
  const bottomCards = useGameStore((s) => s.bottomCards);
  const badges = useGameStore((s) => s.badges);
  const selectedBottomCardId = useGameStore((s) => s.selectedBottomCardId);
  const selectBottomCard = useGameStore((s) => s.selectBottomCard);
  const swapBottomCards = useGameStore((s) => s.swapBottomCards);
  const reorderBottomCards = useGameStore((s) => s.reorderBottomCards);

  const isPlacementActive = useGameStore(selectIsPlacementActive);
  const winningIndices = useGameStore(selectWinningIndices);
  const losingIndices = useGameStore(selectLosingIndices);

  const [swappingIds, setSwappingIds] = useState<Set<string>>(new Set());

  const handleCardClick = (id: string) => {
    if (!isPlacementActive) return;

    if (selectedBottomCardId === null) {
      selectBottomCard(id);
    } else if (selectedBottomCardId === id) {
      selectBottomCard(null);
    } else {
      setSwappingIds(new Set([selectedBottomCardId, id]));
      setTimeout(() => {
        swapBottomCards(selectedBottomCardId, id);
        setSwappingIds(new Set());
      }, 300);
    }
  };

  const handleDragStart = (id: string) => (e: React.DragEvent) => {
    if (!isPlacementActive) return;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('cardId', id);
    selectBottomCard(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (!isPlacementActive) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (targetId: string) => (e: React.DragEvent) => {
    if (!isPlacementActive) return;
    e.preventDefault();
    const sourceId = e.dataTransfer.getData('cardId');
    if (!sourceId || sourceId === targetId) return;

    const cards = [...bottomCards];
    const fromIndex = cards.findIndex((c) => c.id === sourceId);
    const toIndex = cards.findIndex((c) => c.id === targetId);
    if (fromIndex === -1 || toIndex === -1) return;

    [cards[fromIndex], cards[toIndex]] = [cards[toIndex], cards[fromIndex]];
    reorderBottomCards(cards);
    selectBottomCard(null);
  };

  if (type === 'top') {
    return (
      <div className="card-row">
        {topCards.map((card) => (
          <div key={card.id} className="card-column">
            <Card
              dragonType={card.dragonType}
              isFaceDown
              isRevealed={card.isRevealed}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="card-row">
      {bottomCards.map((card, i) => {
        const isSwapping = swappingIds.has(card.id);
        const isSelected = selectedBottomCardId === card.id;
        const isWin = winningIndices.has(i);
        const isLose = losingIndices.has(i);

        return (
          <div
            key={card.id}
            className={`card-column ${isSwapping ? 'card-column--swapping' : ''}`}
          >
            <Card
              dragonType={card.dragonType}
              isSelected={isSelected}
              draggable={isPlacementActive}
              onClick={() => handleCardClick(card.id)}
              onDragStart={handleDragStart(card.id)}
              onDragOver={handleDragOver}
              onDrop={handleDrop(card.id)}
            />
            <ValueBadge
              value={badges[i]}
              isWin={isWin}
              isLose={isLose}
            />
          </div>
        );
      })}
    </div>
  );
}