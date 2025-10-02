import { useEffect } from "react";

export const AudioUnlock = ({ children }) => {
    useEffect(() => {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === "suspended") {
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            gainNode.gain.value = 0;
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.01); // 10ms
        }
    }, []);

    return children;
};
