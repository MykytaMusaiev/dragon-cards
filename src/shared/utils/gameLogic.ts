import { CARD_COUNT, DRAGON_TYPES, RISK_CONFIG } from "../config/gameConfig";
import { LOST_TITLE } from "../const";
import type {
    BottomCard,
    CardValue,
    DragonType,
    MatchResult,
    RiskLevel,
    RoundResult,
    TopCard,
} from "../types";

export function shuffle<T>(array: T[]): T[] {
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

// Генерує badges для поточного ризику — фіксовані значення позицій
export function generateBadges(risk: RiskLevel): CardValue[] {
    const config = RISK_CONFIG[risk];
    const values: CardValue[] = [
        ...Array(config.lostCount).fill(LOST_TITLE),
        ...config.multipliers.slice(0, CARD_COUNT - config.lostCount),
    ];
    return shuffle(values);
}

// Idle deck — декоративний, без ігрового значення
export function generateIdleDeck(): {
    topCards: TopCard[];
    bottomCards: BottomCard[];
} {
    const topDragons = shuffle([...DRAGON_TYPES]);
    const bottomDragons = shuffle([...DRAGON_TYPES]);

    const topCards: TopCard[] = topDragons.map((dragonType) => ({
        id: `top-idle-${generateId()}`,
        dragonType,
        isRevealed: false,
    }));

    const bottomCards: BottomCard[] = bottomDragons.map((dragonType) => ({
        id: `bot-idle-${generateId()}`,
        dragonType,
    }));

    return { topCards, bottomCards };
}

// картки раунду
export function generateCards(): {
    topCards: TopCard[];
    bottomCards: BottomCard[];
} {
    const topDragons = pickDragons(CARD_COUNT);
    const bottomDragons = pickDragons(CARD_COUNT);

    const topCards: TopCard[] = topDragons.map((dragonType) => ({
        id: `top-${generateId()}`,
        dragonType,
        isRevealed: false,
    }));

    const bottomCards: BottomCard[] = bottomDragons.map((dragonType) => ({
        id: `bot-${generateId()}`,
        dragonType,
    }));

    return { topCards, bottomCards };
}

// Фінальний розрахунок після розкриття
export function calculateResult(
    topCards: TopCard[],
    bottomCards: BottomCard[],
    badges: CardValue[],
    betAmount: number,
): RoundResult {
    const matches: MatchResult[] = [];

    topCards.forEach((topCard, i) => {
        const bottomCard = bottomCards[i];
        if (topCard.dragonType === bottomCard.dragonType) {
            matches.push({
                index: i,
                badgeValue: badges[i],
                isWin: badges[i] !== LOST_TITLE,
            });
        }
    });

    // Якщо хоча б одне співпадіння на LOST — програш
    const hasLostMatch = matches.some((m) => !m.isWin);
    if (hasLostMatch || matches.length === 0) {
        return { didWin: false, totalPayout: 0, matches };
    }

    // Всі співпадіння на множниках — сумуємо
    const totalPayout = matches.reduce((sum, m) => {
        if (typeof m.badgeValue !== "number") return sum;
        return sum + Math.round(betAmount * m.badgeValue * 100) / 100;
    }, 0);

    return { didWin: true, totalPayout, matches };
}
