import CardRow from '../CardRow/CardRow';
import SoundToggle from '../SoundToggle/SoundToggle';
import './GameField.css';

export default function GameField() {
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
      </div>
    </main>
  );
}