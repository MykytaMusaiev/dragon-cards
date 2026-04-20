import { createSelector } from "reselect";
import { GAME_PHASES } from "../const";
import { JACKPOT_MULTIPLIER } from "../config/gameConfig";
import type { GameStore } from "../types";

const selectResult = (state: GameStore) => state.result;
const selectPhase = (state: GameStore) => state.phase;

export const selectIsControlsLocked = (state: GameStore): boolean =>
    state.phase === GAME_PHASES.REVEALING;

export const selectIsPlacementActive = (state: GameStore): boolean =>
    state.phase === GAME_PHASES.IDLE ||
    state.phase === GAME_PHASES.PLACEMENT ||
    state.phase === GAME_PHASES.RESULT;

export const selectWinningIndices = createSelector(
    [selectResult, selectPhase],
    (result, phase) => {
        if (phase !== GAME_PHASES.RESULT || !result || !result.didWin)
            return new Set<number>();
        return new Set(
            result.matches.filter((m) => m.isWin).map((m) => m.index),
        );
    },
);

export const selectLosingIndices = createSelector(
    [selectResult, selectPhase],
    (result, phase) => {
        if (phase !== GAME_PHASES.RESULT || !result) return new Set<number>();
        return new Set(
            result.matches.filter((m) => !m.isWin).map((m) => m.index),
        );
    },
);

export const selectJackpotIndices = createSelector(
    [selectResult, selectPhase],
    (result, phase) => {
        if (phase !== GAME_PHASES.RESULT || !result || !result.didWin)
            return new Set<number>();
        return new Set(
            result.matches
                .filter(
                    (m) =>
                        m.isWin &&
                        typeof m.badgeValue === "number" &&
                        m.badgeValue >= JACKPOT_MULTIPLIER,
                )
                .map((m) => m.index),
        );
    },
);
