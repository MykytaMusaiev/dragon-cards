import type { RiskConfigMap } from "../types";

export const MAX_BET = 1000;
export const INITIAL_BALANCE = 100_000;
export const CARD_COUNT = 6;
export const REVEAL_DELAY_MS = 300; // затримка між розкриттям карток
export const REVEAL_DURATION_MS = 600; // тривалість flip анімації

export const RISK_CONFIG: RiskConfigMap = {
    low: {
        label: "Low",
        lostCount: 1,
        multipliers: [1.2, 1.5, 1.8, 2.0, 2.5, 3.0],
    },
    medium: {
        label: "Medium",
        lostCount: 2,
        multipliers: [1.5, 2.0, 2.5, 3.0, 4.0, 5.0],
    },
    high: {
        label: "High",
        lostCount: 3,
        multipliers: [2.0, 3.0, 4.0, 6.0, 8.0, 10.0],
    },
    classic: {
        label: "Classic",
        lostCount: 4,
        multipliers: [3.0, 5.0, 7.0, 10.0, 15.0, 20.0],
    },
};

export const DRAGON_TYPES = [
    "fire",
    "ice",
    "storm",
    "earth",
    "shadow",
    "wind",
] as const;
