import { useEffect } from 'react';
import { GAME_PHASES } from '../../shared/const';
import { useGameStore } from '../../shared/store/gameStore';
import { useSound } from '../../shared/hooks/useSound';
import CardRow from '../CardRow/CardRow';
import BadgeRow from '../BadgeRow/BadgeRow';
import ResultOverlay from '../ResultOverlay/ResultOverlay';
import SoundToggle from '../SoundToggle/SoundToggle';
import './GameField.css';
import { JACKPOT_MULTIPLIER, REVEAL_SOUND_DELAY } from '../../shared/config/gameConfig';

export default function GameField() {
  const phase = useGameStore((s) => s.phase);
  const result = useGameStore((s) => s.result);
  const betAmount = useGameStore((s) => s.betAmount);
  const { play } = useSound();



  useEffect(() => {
    if (phase !== GAME_PHASES.REVEALING) return;
    const { topCards } = useGameStore.getState();
    topCards.forEach((_, i) => {
      setTimeout(() => play('flip_open'), i * REVEAL_SOUND_DELAY);
    });
  }, [phase, play]);

  // Звук результату
  useEffect(() => {
    if (phase !== GAME_PHASES.RESULT || !result) return;
    if (result.didWin) {
      const isJackpot = result.totalPayout >= betAmount * JACKPOT_MULTIPLIER;
      play(isJackpot ? 'jackpot' : 'win');
    } else {
      play('lose');
    }
  }, [phase, result, play, betAmount]);

  return (
    <main className="game-field">
      <SoundToggle />

      <div className="game-field__content">
        <div className="game-field__row-wrap">
          <CardRow type="top" />
        </div>

        <div className="game-field__row-wrap">
          <CardRow type="bottom" />
        </div>
        <div className="game-field__row-wrap">
          <BadgeRow />
        </div>
      </div>
      <ResultOverlay />
    </main>
  );
}