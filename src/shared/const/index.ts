import type { DragonType } from "../types";

// ─── Cards ─────────────────────────────────────────────────────────────────

export const DRAGON_LABELS: Record<DragonType, string> = {
    fire: "Fire",
    ice: "Ice",
    storm: "Storm",
    earth: "Earth",
    shadow: "Shadow",
    wind: "Wind",
};

export const LOST_TITLE = "LOST" as const;

// ─── Game phases ─────────────────────────────────────────────────────────────────

export const GAME_PHASES = {
    IDLE: "idle",
    PLACEMENT: "placement",
    REVEALING: "revealing",
    RESULT: "result",
} as const;

export type GamePhase = (typeof GAME_PHASES)[keyof typeof GAME_PHASES];
