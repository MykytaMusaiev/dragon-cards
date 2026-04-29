import { useCallback } from "react";
import { useGameStore } from "../store/gameStore";

type SoundName =
    | "place_bet"
    | "cards_shuffle"
    | "drag_n_drop"
    | "flip_open"
    | "win"
    | "jackpot"
    | "lose";

const audioCache = new Map<string, HTMLAudioElement>();

function getAudio(src: string): HTMLAudioElement {
    if (!audioCache.has(src)) {
        const audio = new Audio(src);
        audio.preload = "auto";
        audioCache.set(src, audio);
    }
    return audioCache.get(src)!;
}

export function useSound() {
    const isSoundEnabled = useGameStore((s) => s.isSoundEnabled);

    const play = useCallback(
        (name: SoundName) => {
            if (!isSoundEnabled) return;

            const src = `/sounds/${name}.mp3`;
            const audio = getAudio(src);

            // Дозволяємо перезапуск якщо звук вже грає
            audio.currentTime = 0;
            audio.play().catch(() => {
                // Браузер заблокував автовідтворення — ігноруємо
            });
        },
        [isSoundEnabled],
    );

    return { play };
}
