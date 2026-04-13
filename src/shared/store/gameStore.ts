import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
    INITIAL_BALANCE,
    MAX_BET,
    REVEAL_DELAY_MS,
    REVEAL_DURATION_MS,
} from "../config/gameConfig";
import type {
    BottomCard,
    GamePhase,
    GameState,
    RiskLevel,
    RoundResult,
} from "../types";
import { calculatePayout, generateCards } from "../utils/gameLogic";

interface GameActions {
    // Betting panel
    setBetAmount: (amount: number) => void;
    setRisk: (risk: RiskLevel) => void;
    placeBet: () => void;

    // Placement phase
    reorderBottomCards: (cards: BottomCard[]) => void;
    selectBottomCard: (id: string | null) => void;
    swapBottomCards: (idA: string, idB: string) => void;
    confirmPlacement: () => void;

    // Revealing phase — викликається з компонента після анімацій
    startRevealing: () => void;

    // General
    setPhase: (phase: GamePhase) => void;
    toggleSound: () => void;
    resetRound: () => void;
}

type GameStore = GameState & GameActions;

// ─── Persisted keys ──────────────────────────────────────────────────────────
// Зберігаємо тільки UI-налаштування і баланс.
// Ігровий стан (картки, фаза) — завжди скидається при оновленні сторінки.

type PersistedState = Pick<
    GameState,
    "balance" | "betAmount" | "risk" | "isSoundEnabled"
>;

export const useGameStore = create<GameStore>()(
    persist(
        (set, get) => ({
            // ─── Initial State ─────────────────────────────────────────────────
            balance: INITIAL_BALANCE,
            betAmount: 1,
            risk: "classic",
            phase: "idle",
            topCards: [],
            bottomCards: [],
            selectedBottomCardId: null,
            result: null,
            isSoundEnabled: true,

            // ─── Betting Panel ─────────────────────────────────────────────────
            setBetAmount: (amount) => {
                const { balance } = get();
                const clamped = Math.min(Math.max(amount, 1), MAX_BET, balance);
                set({ betAmount: Math.round(clamped * 100) / 100 });
            },

            setRisk: (risk) => set({ risk }),

            placeBet: () => {
                const { balance, betAmount, risk, phase } = get();
                if (phase !== "idle") return;
                if (betAmount > balance || betAmount <= 0) return;

                const { topCards, bottomCards } = generateCards(risk);

                set({
                    balance: Math.round((balance - betAmount) * 100) / 100,
                    topCards,
                    bottomCards,
                    selectedBottomCardId: null,
                    result: null,
                    phase: "placement",
                });
            },

            // ─── Placement Phase ───────────────────────────────────────────────
            reorderBottomCards: (cards) => set({ bottomCards: cards }),

            selectBottomCard: (id) => {
                const { phase } = get();
                if (phase !== "placement") return;
                set({ selectedBottomCardId: id });
            },

            swapBottomCards: (idA, idB) => {
                const { bottomCards, phase } = get();
                if (phase !== "placement") return;

                const cards = [...bottomCards];
                const indexA = cards.findIndex((c) => c.id === idA);
                const indexB = cards.findIndex((c) => c.id === idB);
                if (indexA === -1 || indexB === -1) return;

                [cards[indexA], cards[indexB]] = [cards[indexB], cards[indexA]];
                set({ bottomCards: cards, selectedBottomCardId: null });
            },

            confirmPlacement: () => {
                const { phase } = get();
                if (phase !== "placement") return;
                set({ phase: "revealing", selectedBottomCardId: null });
            },

            // ─── Revealing Phase ───────────────────────────────────────────────
            // Запускає послідовне розкриття карток і фіналізує результат.
            // Викликається один раз після confirmPlacement.
            startRevealing: () => {
                const { topCards, betAmount, phase } = get();
                if (phase !== "revealing") return;

                topCards.forEach((_, index) => {
                    setTimeout(() => {
                        // Розкриваємо картку після завершення flip анімації
                        const delay =
                            index * (REVEAL_DURATION_MS + REVEAL_DELAY_MS);

                        setTimeout(() => {
                            const current = get();
                            const updated = current.topCards.map((card, i) =>
                                i === index
                                    ? { ...card, isRevealed: true }
                                    : card,
                            );
                            set({ topCards: updated });

                            // Після останньої картки — фіналізуємо результат
                            if (index === topCards.length - 1) {
                                setTimeout(() => {
                                    const final = get();

                                    let totalPayout = 0;
                                    let didWin = false;
                                    let bestMultiplier: RoundResult["multiplier"] =
                                        "LOST";

                                    final.topCards.forEach((topCard, i) => {
                                        if (topCard.value !== "LOST") {
                                            const bottomCard =
                                                final.bottomCards[i];
                                            if (bottomCard?.value !== "LOST") {
                                                const payout = calculatePayout(
                                                    betAmount,
                                                    bottomCard.value,
                                                );
                                                totalPayout += payout;
                                                didWin = true;
                                                // Зберігаємо найбільший множник для відображення
                                                if (
                                                    bestMultiplier === "LOST" ||
                                                    (bottomCard.value as number) >
                                                        (bestMultiplier as number)
                                                ) {
                                                    bestMultiplier =
                                                        bottomCard.value;
                                                }
                                            }
                                        }
                                    });

                                    const result: RoundResult = {
                                        didWin,
                                        multiplier: bestMultiplier,
                                        payout:
                                            Math.round(totalPayout * 100) / 100,
                                    };

                                    set({
                                        result,
                                        balance:
                                            Math.round(
                                                (final.balance + totalPayout) *
                                                    100,
                                            ) / 100,
                                        phase: "result",
                                    });
                                }, REVEAL_DURATION_MS);
                            }
                        }, delay);
                    }, 0);
                });
            },

            // ─── General ──────────────────────────────────────────────────────
            setPhase: (phase) => set({ phase }),

            toggleSound: () =>
                set((state) => ({ isSoundEnabled: !state.isSoundEnabled })),

            resetRound: () =>
                set({
                    phase: "idle",
                    topCards: [],
                    bottomCards: [],
                    selectedBottomCardId: null,
                    result: null,
                }),
        }),
        {
            name: "dragon-cards-storage",
            partialize: (state): PersistedState => ({
                balance: state.balance,
                betAmount: state.betAmount,
                risk: state.risk,
                isSoundEnabled: state.isSoundEnabled,
            }),
        },
    ),
);

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectIsControlsLocked = (state: GameStore): boolean =>
    state.phase === "placement" || state.phase === "revealing";

export const selectCanPlaceBet = (state: GameStore): boolean =>
    state.phase === "idle" &&
    state.betAmount > 0 &&
    state.betAmount <= state.balance &&
    state.betAmount <= MAX_BET;

export const selectIsPlacementPhase = (state: GameStore): boolean =>
    state.phase === "placement";

export const selectWinningPairs = (state: GameStore): Set<number> => {
    if (state.phase !== "result" && state.phase !== "revealing")
        return new Set();
    const pairs = new Set<number>();
    state.topCards.forEach((topCard, i) => {
        if (topCard.isRevealed && topCard.value !== "LOST") {
            const bottomCard = state.bottomCards[i];
            if (bottomCard?.value !== "LOST") pairs.add(i);
        }
    });
    return pairs;
};
