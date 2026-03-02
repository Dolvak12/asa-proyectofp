"use client";

import { useEffect, useState } from "react";
import { useGuiltActions } from "@/context/GuiltContext";
import { motion, AnimatePresence } from "framer-motion";

export default function EasterEggListener() {
    const { addGuilt, resetGuilt, playSlash, playGlitch } = useGuiltActions();

    // States for special visual Easter Eggs
    const [showMakima, setShowMakima] = useState(false);
    const [isPochitaShaking, setIsPochitaShaking] = useState(false);

    useEffect(() => {
        let keyBuffer = "";

        const handleKeyDown = (e: KeyboardEvent) => {
            // No trigger if writing in an input
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return;
            }

            keyBuffer += e.key.toUpperCase();

            // Limit buffer size to last 10 characters
            if (keyBuffer.length > 10) {
                keyBuffer = keyBuffer.slice(keyBuffer.length - 10);
            }

            // Check codes
            if (keyBuffer.includes("YORU")) {
                playGlitch();
                addGuilt(100);
                keyBuffer = ""; // reset
            } else if (keyBuffer.includes("ASA")) {
                resetGuilt();
                keyBuffer = "";
            } else if (keyBuffer.includes("POCHITA")) {
                playSlash();
                playSlash(); // Double to simulate chainsaw

                // Trigger camera shake effect
                setIsPochitaShaking(true);
                setTimeout(() => setIsPochitaShaking(false), 500);

                keyBuffer = "";
            } else if (keyBuffer.includes("MAKIMA")) {
                setShowMakima(true);
                setTimeout(() => setShowMakima(false), 3000);
                keyBuffer = "";
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [addGuilt, resetGuilt, playSlash, playGlitch]);

    return (
        <>
            {/* MAKIMA EASTER EGG: Pure Black Jumpscare */}
            <AnimatePresence>
                {showMakima && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.1 }}
                        className="fixed inset-0 z-[999999] bg-black flex items-center justify-center pointer-events-none"
                    >
                        <motion.span
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.5, duration: 2 }}
                            className="text-white text-sm tracking-[1em] uppercase font-serif"
                        >
                            Bang.
                        </motion.span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* POCHITA EASTER EGG: Shake Global Effect via Inline Styles applied to an invisible wrapper */}
            {isPochitaShaking && (
                <style>{`
                    body {
                        animation: pochita-shake 0.1s infinite;
                    }
                    @keyframes pochita-shake {
                        0% { transform: translate(5px, 5px) rotate(0deg); }
                        10% { transform: translate(-5px, -2px) rotate(-1deg); }
                        20% { transform: translate(-3px, 0px) rotate(1deg); }
                        30% { transform: translate(3px, 2px) rotate(0deg); }
                        40% { transform: translate(1px, -1px) rotate(1deg); }
                        50% { transform: translate(-1px, 2px) rotate(-1deg); }
                        60% { transform: translate(-3px, 1px) rotate(0deg); }
                        70% { transform: translate(3px, 1px) rotate(-1deg); }
                        80% { transform: translate(-1px, -1px) rotate(1deg); }
                        90% { transform: translate(1px, 2px) rotate(0deg); }
                        100% { transform: translate(1px, -2px) rotate(-1deg); }
                    }
                `}</style>
            )}
        </>
    );
}
