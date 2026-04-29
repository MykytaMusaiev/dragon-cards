import { useEffect, useRef, useState } from "react";

export function useAnimatedCounter(value: number, duration = 600): number {
    const [displayed, setDisplayed] = useState(value);
    const prevRef = useRef(value);
    const rafRef = useRef<number | null>(null);

    useEffect(() => {
        const from = prevRef.current;
        const to = value;

        if (from === to) return;

        const startTime = performance.now();

        const tick = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);

            setDisplayed(from + (to - from) * eased);

            if (progress < 1) {
                rafRef.current = requestAnimationFrame(tick);
            } else {
                setDisplayed(to);
                prevRef.current = to;
            }
        };

        rafRef.current = requestAnimationFrame(tick);

        return () => {
            if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
        };
    }, [value, duration]);

    return displayed;
}
