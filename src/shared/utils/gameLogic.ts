import { CARD_COUNT, DRAGON_TYPES, RISK_CONFIG } from "../config/gameConfig";
import type {
    BottomCard,
    CardValue,
    DragonType,
    RiskLevel,
    TopCard,
} from "../types";

// ─── Helpers ───────────────────────────────────────────────────────────────

function shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

function generateId(): string {
    return Math.random().toString(36).slice(2, 9);
}

function pickDragons(count: number): DragonType[] {
    const pool = shuffle([...DRAGON_TYPES]);
    const result: DragonType[] = [];
    for (let i = 0; i < count; i++) {
        result.push(pool[i % pool.length]);
    }
    return shuffle(result);
}

// ─── Card Generation ───────────────────────────────────────────────────────

export function generateCards(risk: RiskLevel): {
    topCards: TopCard[];
    bottomCards: BottomCard[];
} {
    const config = RISK_CONFIG[risk];

    // Будуємо масив значень: N LOST + решта множників
    const winMultipliers = shuffle([...config.multipliers]).slice(
        0,
        CARD_COUNT - config.lostCount,
    );

    const values: CardValue[] = [
        ...Array(config.lostCount).fill("LOST"),
        ...winMultipliers,
    ];

    const shuffledValues = shuffle(values);
    const topDragons = pickDragons(CARD_COUNT);
    const bottomDragons = pickDragons(CARD_COUNT);

    const topCards: TopCard[] = shuffledValues.map((value, i) => ({
        id: `top-${generateId()}`,
        dragonType: topDragons[i],
        value,
        isRevealed: false,
    }));

    // Нижні картки мають ті ж значення але перемішані — гравець не знає відповідності
    const bottomValues = shuffle([...shuffledValues]);
    const bottomCards: BottomCard[] = bottomValues.map((value, i) => ({
        id: `bot-${generateId()}`,
        dragonType: bottomDragons[i],
        value,
    }));

    return { topCards, bottomCards };
}

// ─── Win Calculation ───────────────────────────────────────────────────────

export function calculatePayout(
    betAmount: number,
    multiplier: CardValue,
): number {
    if (multiplier === "LOST") return 0;
    return Math.round(betAmount * multiplier * 100) / 100;
}
