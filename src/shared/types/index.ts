// ─── Dragons ───────────────────────────────────────────────────────────────

export type DragonType = "fire" | "ice" | "storm" | "earth" | "shadow" | "wind";

// ─── Cards ─────────────────────────────────────────────────────────────────

export type CardValue = number | "LOST";

export interface TopCard {
    id: string;
    dragonType: DragonType;
    value: CardValue;
    isRevealed: boolean;
}

export interface BottomCard {
    id: string;
    dragonType: DragonType;
    value: CardValue;
}

// ─── Risk ──────────────────────────────────────────────────────────────────

export type RiskLevel = "low" | "medium" | "high" | "classic";

export interface RiskConfig {
    label: string;
    lostCount: number;
    multipliers: number[];
}

export type RiskConfigMap = Record<RiskLevel, RiskConfig>;

// ─── Game State ────────────────────────────────────────────────────────────

export type GamePhase =
    | "idle" // очікування — панель активна, поле порожнє або результат
    | "placement" // гравець розташовує нижні картки
    | "revealing" // верхні картки послідовно розкриваються
    | "result"; // результат показано

export interface RoundResult {
    didWin: boolean;
    multiplier: CardValue;
    payout: number;
}

// ─── Store ─────────────────────────────────────────────────────────────────

export interface GameState {
    balance: number;
    betAmount: number;
    risk: RiskLevel;
    phase: GamePhase;
    topCards: TopCard[];
    bottomCards: BottomCard[];
    selectedBottomCardId: string | null;
    result: RoundResult | null;
    isSoundEnabled: boolean;
}
