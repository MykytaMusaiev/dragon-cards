import { useGameStore } from '../../shared/store/gameStore';
import './SoundToggle.css';

export default function SoundToggle() {
  const isSoundEnabled = useGameStore((s) => s.isSoundEnabled);
  const toggleSound = useGameStore((s) => s.toggleSound);

  return (
    <button
      className="sound-toggle"
      onClick={toggleSound}
      title={isSoundEnabled ? 'Mute sound' : 'Enable sound'}
    >
      {isSoundEnabled ? '🔊' : '🔇'}
    </button>
  );
}