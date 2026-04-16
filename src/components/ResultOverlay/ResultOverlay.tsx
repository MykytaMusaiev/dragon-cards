import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../../shared/store/gameStore';
import { GAME_PHASES } from '../../shared/const';
import './ResultOverlay.css';
import { OVERLAY_HOLD_DURATION_MS } from '../../shared/config/gameConfig';



export default function ResultOverlay() {
  const phase = useGameStore((s) => s.phase);
  const result = useGameStore((s) => s.result);
  const resetRound = useGameStore((s) => s.resetRound);

  const [isLeaving, setIsLeaving] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (phase !== GAME_PHASES.RESULT) {
      return;
    }

    timerRef.current = setTimeout(() => {
      setIsLeaving(true);
    }, OVERLAY_HOLD_DURATION_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      setIsLeaving(false);
    };
  }, [phase]);

  const handleClick = () => {
    if (isLeaving) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsLeaving(true);
  };

  const handleAnimationEnd = (e: React.AnimationEvent<HTMLDivElement>) => {
    if (e.animationName === 'overlay-fade-out') {
      resetRound();
    }
  };

  if (phase !== GAME_PHASES.RESULT || !result || !result.didWin) return null;

  return (
    <div
      className={[
        'result-overlay',
        result.didWin ? 'result-overlay--win' : 'result-overlay--lose',
        isLeaving ? 'result-overlay--leaving' : '',
      ].join(' ').trim()}
      onClick={handleClick}
      onAnimationEnd={handleAnimationEnd}
    >
      <div className="result-overlay__card">
        {result.didWin ? (
          <>
            <div className="result-overlay__icon">🏆</div>
            <div className="result-overlay__title">You Win!</div>
            <div className="result-overlay__amount">
              +{result.totalPayout.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
          </>
        ) : (
          <>
            <div className="result-overlay__icon">💀</div>
            <div className="result-overlay__title">Lost</div>
            <div className="result-overlay__amount result-overlay__amount--lost">
              Better luck next time
            </div>
          </>
        )}
      </div>
    </div>
  );
}