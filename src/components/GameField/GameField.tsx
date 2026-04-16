import { useEffect, useRef } from 'react';
import { GAME_PHASES } from '../../shared/const';
import { useGameStore } from '../../shared/store/gameStore';
import { useSound } from '../../shared/hooks/useSound';
import CardRow from '../CardRow/CardRow';
import ResultOverlay from '../ResultOverlay/ResultOverlay';
import SoundToggle from '../SoundToggle/SoundToggle';
import './GameField.css';
import { LOSE_RESET_DELAY_MS, REVEAL_SOUND_DELAY } from '../../shared/config/gameConfig';
import BalanceDisplay from '../BalanceDisplay/BalanceDisplay';
import { selectJackpotIndices } from '../../shared/store/selectors';

export default function GameField() {
  const phase = useGameStore((s) => s.phase);
  const result = useGameStore((s) => s.result);
  const jackpotIndices = useGameStore(selectJackpotIndices);
  const resetRound = useGameStore((s) => s.resetRound);
  const { play } = useSound();

  const loseResetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (phase !== GAME_PHASES.REVEALING) return;
    const { topCards } = useGameStore.getState();
    topCards.forEach((_, i) => {
      setTimeout(() => play('flip_open'), i * REVEAL_SOUND_DELAY);
    });
  }, [phase, play]);

  useEffect(() => {
    if (phase !== GAME_PHASES.RESULT || !result) return;

    if (result.didWin) {
      const isJackpot = jackpotIndices.size > 0;
      play(isJackpot ? 'jackpot' : 'win');
    } else {
      play('lose');
      loseResetTimerRef.current = setTimeout(() => {
        resetRound();
      }, LOSE_RESET_DELAY_MS);
    }

    return () => {
      if (loseResetTimerRef.current !== null) {
        clearTimeout(loseResetTimerRef.current);
        loseResetTimerRef.current = null;
      }
    };
  }, [phase, result, play, jackpotIndices, resetRound]);

  return (
    <main className="game-field">
      <SoundToggle />

      <div className="game-field__mobile-header">
        <BalanceDisplay />
      </div>

      <div className="game-field__content">
        <CardRow type="top" />
        <CardRow type="bottom" />
      </div>
      <ResultOverlay />
    </main>
  );
}