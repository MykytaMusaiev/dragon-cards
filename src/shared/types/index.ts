import { LOST_TITLE, type GamePhase } from "../const";

// ─── Dragons ───────────────────────────────────────────────────────────────

export type DragonType = "fire" | "ice" | "storm" | "earth" | "shadow" | "wind";

// ─── Cards ─────────────────────────────────────────────────────────────────

export type CardValue = number | typeof LOST_TITLE;

export interface TopCard {
    id: string;
    dragonType: DragonType;
    isRevealed: boolean;
}

export interface BottomCard {
    id: string;
    dragonType: DragonType;
}

export interface CardProps {
    dragonType: DragonType;
    isFaceDown?: boolean;
    isRevealed?: boolean;
    isSelected?: boolean;
    isDragging?: boolean;
    isDropTarget?: boolean;
    draggable?: boolean;
    onClick?: () => void;
    onDragStart?: (e: React.DragEvent) => void;
    onDragOver?: (e: React.DragEvent) => void;
    onDrop?: (e: React.DragEvent) => void;
}

export interface CardRowProps {
    type: "top" | "bottom";
}

export interface DraggableCardProps {
    card: BottomCard;
    isPlacementActive: boolean;
    isSelected: boolean;
    isSwapping: boolean;
    isGhost: boolean;
    onClick: () => void;
    isWin: boolean;
    isLose: boolean;
    isJackpot: boolean;
}

export interface DraggableCardWrapperProps {
    card: BottomCard;
    isPlacementActive: boolean;
    isSelected: boolean;
    isWin: boolean;
    isLose: boolean;
    isSwapping: boolean;
    onClick: () => void;
    domRef: (node: HTMLDivElement | null) => void;
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

export interface MatchResult {
    index: number;
    badgeValue: CardValue;
    isWin: boolean;
}

export interface RoundResult {
    didWin: boolean;
    totalPayout: number;
    matches: MatchResult[];
}

// ─── Store ─────────────────────────────────────────────────────────────────

export interface GameState {
    balance: number;
    betAmount: number;
    risk: RiskLevel;
    phase: GamePhase;
    topCards: TopCard[];
    bottomCards: BottomCard[];
    badges: CardValue[];
    selectedBottomCardId: string | null;
    result: RoundResult | null;
    isSoundEnabled: boolean;
}

export interface GameActions {
    setBetAmount: (amount: number) => void;
    setRisk: (risk: RiskLevel) => void;
    placeBet: () => void;
    reorderBottomCards: (cards: BottomCard[]) => void;
    selectBottomCard: (id: string | null) => void;
    swapBottomCards: (idA: string, idB: string) => void;
    confirmPlacement: () => void;
    startRevealing: () => void;
    setPhase: (phase: GamePhase) => void;
    toggleSound: () => void;
    resetRound: () => void;
}

export type GameStore = GameState & GameActions;
export type PersistedState = Pick<
    GameState,
    "balance" | "betAmount" | "risk" | "isSoundEnabled" | "bottomCards"
>;
