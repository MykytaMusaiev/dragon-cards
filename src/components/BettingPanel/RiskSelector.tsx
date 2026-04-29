import { useGameStore } from '../../shared/store/gameStore';
import { RISK_CONFIG } from '../../shared/config/gameConfig';
import type { RiskLevel } from '../../shared/types';
import './RiskSelector.css';
import { selectIsControlsLocked } from '../../shared/store/selectors';

const RISK_LEVELS: RiskLevel[] = ['low', 'medium', 'high', 'classic'];

export default function RiskSelector() {
  const risk = useGameStore((s) => s.risk);
  const setRisk = useGameStore((s) => s.setRisk);
  const isLocked = useGameStore(selectIsControlsLocked);

  return (
    <div className="risk-selector">
      <span className="risk-selector__label">Risk</span>
      <div className="risk-selector__buttons">
        {RISK_LEVELS.map((level) => (
          <button
            key={level}
            className={`risk-selector__btn risk-selector__btn--${level} ${risk === level ? 'risk-selector__btn--active' : ''}`}
            onClick={() => setRisk(level)}
            disabled={isLocked}
          >
            {RISK_CONFIG[level].label}
          </button>
        ))}
      </div>
    </div>
  );
}