import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
    INITIAL_BALANCE,
    MAX_BET,
    REVEAL_DELAY_MS,
    REVEAL_DURATION_MS,
} from "../config/gameConfig";
import type { GameStore, PersistedState, RoundResult } from "../types";
import {
    calculateResult,
    generateBadges,
    generateCards,
    generateIdleDeck,
} from "../utils/gameLogic";
import { GAME_PHASES } from "../const";

const idleDeck = generateIdleDeck();

export const useGameStore = create<GameStore>()(
    persist(
        (set, get) => ({
            balance: INITIAL_BALANCE,
            betAmount: 1,
            risk: "classic",
            phase: GAME_PHASES.IDLE,
            topCards: idleDeck.topCards,
            bottomCards: idleDeck.bottomCards,
            badges: generateBadges("classic"),
            selectedBottomCardId: null,
            result: null,
            isSoundEnabled: true,

            setBetAmount: (amount) => {
                const { balance, phase } = get();
                if (phase === GAME_PHASES.REVEALING) return;
                const clamped = Math.min(Math.max(amount, 1), MAX_BET, balance);
                set({ betAmount: Math.round(clamped * 100) / 100 });
            },

            setRisk: (risk) => {
                const { phase } = get();
                if (phase === GAME_PHASES.REVEALING) return;
                set({ risk, badges: generateBadges(risk) });
            },

            placeBet: () => {
                const { balance, betAmount, phase, bottomCards } = get();
                if (phase === GAME_PHASES.REVEALING) return;
                if (betAmount > balance || betAmount <= 0) return;

                const newDeck = generateCards();

                set({
                    balance: Math.round((balance - betAmount) * 100) / 100,
                    topCards: newDeck.topCards,
                    bottomCards: bottomCards,
                    selectedBottomCardId: null,
                    result: null,
                    phase: GAME_PHASES.PLACEMENT,
                });
            },

            reorderBottomCards: (cards) => {
                const { phase } = get();
                const extra =
                    phase === GAME_PHASES.RESULT
                        ? { phase: GAME_PHASES.IDLE, result: null }
                        : {};
                set({ bottomCards: cards, ...extra });
            },

            selectBottomCard: (id) => {
                const { phase } = get();
                if (phase === GAME_PHASES.REVEALING) return;

                const extra =
                    phase === GAME_PHASES.RESULT
                        ? { phase: GAME_PHASES.IDLE, result: null }
                        : {};
                set({ selectedBottomCardId: id, ...extra });
            },

            swapBottomCards: (idA, idB) => {
                const { bottomCards, phase } = get();
                if (phase === GAME_PHASES.REVEALING) return;

                const cards = [...bottomCards];
                const indexA = cards.findIndex((c) => c.id === idA);
                const indexB = cards.findIndex((c) => c.id === idB);
                if (indexA === -1 || indexB === -1) return;

                [cards[indexA], cards[indexB]] = [cards[indexB], cards[indexA]];

                const extra =
                    phase === GAME_PHASES.RESULT
                        ? { phase: GAME_PHASES.IDLE, result: null }
                        : {};
                set({
                    bottomCards: cards,
                    selectedBottomCardId: null,
                    ...extra,
                });
            },

            confirmPlacement: () => {
                set({
                    phase: GAME_PHASES.REVEALING,
                    selectedBottomCardId: null,
                });
            },

            startRevealing: () => {
                const { topCards, phase } = get();
                if (phase !== GAME_PHASES.REVEALING) return;

                topCards.forEach((_, index) => {
                    const delay =
                        index * (REVEAL_DURATION_MS + REVEAL_DELAY_MS);
                    setTimeout(() => {
                        const current = get();
                        const updated = current.topCards.map((card, i) =>
                            i === index ? { ...card, isRevealed: true } : card,
                        );
                        set({ topCards: updated });

                        if (index === topCards.length - 1) {
                            setTimeout(() => {
                                const final = get();
                                const result: RoundResult = calculateResult(
                                    final.topCards,
                                    final.bottomCards,
                                    final.badges,
                                    final.betAmount,
                                );
                                set({
                                    result,
                                    balance:
                                        Math.round(
                                            (final.balance +
                                                result.totalPayout) *
                                                100,
                                        ) / 100,
                                    phase: GAME_PHASES.RESULT,
                                });
                            }, REVEAL_DURATION_MS);
                        }
                    }, delay);
                });
            },

            setPhase: (phase) => set({ phase }),

            toggleSound: () =>
                set((state) => ({ isSoundEnabled: !state.isSoundEnabled })),

            resetRound: () => {
                set({
                    phase: GAME_PHASES.IDLE,
                    topCards: idleDeck.topCards,
                    selectedBottomCardId: null,
                    result: null,
                });
            },
        }),
        {
            name: "dragon-cards-storage",
            partialize: (state): PersistedState => ({
                balance: state.balance,
                betAmount: state.betAmount,
                risk: state.risk,
                isSoundEnabled: state.isSoundEnabled,
                bottomCards: state.bottomCards,
            }),
        },
    ),
);
