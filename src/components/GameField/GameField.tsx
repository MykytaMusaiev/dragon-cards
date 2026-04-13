import Card from '../Card/Card';
import './GameField.css';

export default function GameField() {
  return (
    <main className="game-field">
      <p style={{ color: 'var(--color-text-muted)' }}>Game Field</p>
      <Card dragonType="fire" value={3.5} />
      <Card dragonType="ice" value="LOST" />
      <Card dragonType="storm" isFaceDown isRevealed={false} value={10} />
    </main>
  );
}