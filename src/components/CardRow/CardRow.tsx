import { useState, useRef, useLayoutEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent, DraggableAttributes } from '@dnd-kit/core';
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';

import { useGameStore } from '../../shared/store/gameStore';
import type { CardRowProps, DraggableCardProps } from '../../shared/types';
import Card from '../Card/Card';
import {
  selectIsPlacementActive,
} from '../../shared/store/selectors';
import { useSound } from '../../shared/hooks/useSound';
import './CardRow.css';



function DraggableCard({
  card,
  isPlacementActive,
  isSelected,
  isSwapping,
  isGhost,
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
        'card-column',
        isSwapping ? 'card-column--swapping' : '',
      ].filter(Boolean).join(' ')}
    >
      <Card
        dragonType={card.dragonType}
        isSelected={isSelected && !isDragging}
        isDropTarget={isOver && !isDragging}
        isGhost={isGhost}
        draggable={isPlacementActive}
        onClick={onClick}
        attributes={attributes as DraggableAttributes}
        listeners={listeners as SyntheticListenerMap}
      />
    </div>
  );
}


export default function CardRow({ type }: CardRowProps) {
  const topCards = useGameStore((s) => s.topCards);
  const bottomCards = useGameStore((s) => s.bottomCards);
  const selectedBottomCardId = useGameStore((s) => s.selectedBottomCardId);
  const selectBottomCard = useGameStore((s) => s.selectBottomCard);
  const swapBottomCards = useGameStore((s) => s.swapBottomCards);
  const reorderBottomCards = useGameStore((s) => s.reorderBottomCards);

  const isPlacementActive = useGameStore(selectIsPlacementActive);

  const { play } = useSound();
  const [swappingIds, setSwappingIds] = useState<Set<string>>(new Set());
  const [activeDragId, setActiveDragId] = useState<string | null>(null);

  const wrapperRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const prevRectsRef = useRef<Map<string, DOMRect>>(new Map());

  const captureRects = () => {
    const rects = new Map<string, DOMRect>();
    wrapperRefs.current.forEach((el, id) => {
      rects.set(id, el.getBoundingClientRect());
    });
    prevRectsRef.current = rects;
  };

  useLayoutEffect(() => {
    const prevRects = prevRectsRef.current;
    if (prevRects.size === 0) return;

    wrapperRefs.current.forEach((el, id) => {
      const prev = prevRects.get(id);
      if (!prev) return;

      const next = el.getBoundingClientRect();
      const deltaX = prev.left - next.left;
      const deltaY = prev.top - next.top;

      if (deltaX === 0 && deltaY === 0) return;

      el.style.transition = 'none';
      el.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.style.transition = 'transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
          el.style.transform = '';
        });
      });
    });

    prevRectsRef.current = new Map();
  }, [bottomCards]);


  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );


  const handleCardClick = (id: string) => {
    if (!isPlacementActive) return;

    if (selectedBottomCardId === null) {
      selectBottomCard(id);
    } else if (selectedBottomCardId === id) {
      selectBottomCard(null);
    } else {
      captureRects();
      setSwappingIds(new Set([selectedBottomCardId, id]));
      setTimeout(() => {
        swapBottomCards(selectedBottomCardId, id);
        setSwappingIds(new Set());
      }, 300);
      selectBottomCard(null);
    }
  };


  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(event.active.id as string);
    selectBottomCard(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragId(null);

    if (!over || active.id === over.id) return;

    const cards = [...bottomCards];
    const fromIndex = cards.findIndex((c) => c.id === active.id);
    const toIndex = cards.findIndex((c) => c.id === over.id);

    if (fromIndex !== -1 && toIndex !== -1) {
      captureRects();
      [cards[fromIndex], cards[toIndex]] = [cards[toIndex], cards[fromIndex]];
      reorderBottomCards(cards);
      play('drag_n_drop');
    }
  };

  const activeDragCard = activeDragId
    ? bottomCards.find((c) => c.id === activeDragId)
    : null;


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
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="card-row">
        {bottomCards.map((card) => (
          <div
            key={card.id}
            className="card-column-wrapper"
            ref={(el) => {
              if (el) wrapperRefs.current.set(card.id, el);
              else wrapperRefs.current.delete(card.id);
            }}
          >
            <DraggableCard
              card={card}
              isPlacementActive={isPlacementActive}
              isSelected={selectedBottomCardId === card.id}
              isSwapping={swappingIds.has(card.id)}
              isGhost={card.id === activeDragId}
              onClick={() => handleCardClick(card.id)}
            />
          </div>
        ))}
      </div>

      <DragOverlay dropAnimation={null}>
        {activeDragCard ? (
          <div className="card-drag-overlay">
            <Card
              dragonType={activeDragCard.dragonType}
              draggable={false}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}