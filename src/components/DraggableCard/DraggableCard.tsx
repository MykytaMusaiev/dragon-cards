import { useDraggable, useDroppable } from '@dnd-kit/core';
import type { DraggableAttributes } from '@dnd-kit/core';
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';

import type { DraggableCardProps } from '../../shared/types';
import Card from '../Card/Card';

export default function DraggableCard({
  card,
  isPlacementActive,
  isSelected,
  isSwapping,
  isGhost,
  isWin,
  isLose,
  isJackpot,
  onClick,
}: DraggableCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef: setDraggableRef,
    isDragging,
  } = useDraggable({
    id: card.id,
    disabled: !isPlacementActive,
  });

  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: card.id,
    disabled: !isPlacementActive,
  });

  const setCombinedRef = (node: HTMLElement | null) => {
    setDraggableRef(node);
    setDroppableRef(node);
  };

  return (
    <div
      ref={setCombinedRef}
      className={[
        'draggable-card-wrapper',
        isSwapping ? 'draggable-card-wrapper--swapping' : '',
      ].filter(Boolean).join(' ')}
    >
      <Card
        dragonType={card.dragonType}
        isSelected={isSelected && !isDragging}
        isDropTarget={isOver && !isDragging}
        isGhost={isGhost}
        draggable={isPlacementActive}
        isWin={isWin}
        isLose={isLose}
        isJackpot={isJackpot}
        onClick={onClick}
        attributes={attributes as DraggableAttributes}
        listeners={listeners as SyntheticListenerMap}
      />
    </div>
  );
}