"use client";

import { useGuilt, useGuiltActions } from "@/context/GuiltContext";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";

/**
 * INVASION OVERLAY — La Mirada del Demonio
 * 
 * Este componente se encarga de mostrar jumpscares visuales sutiles o agresivos
 * utilizando 'ojosyoru.png'. Aparecen de forma aleatoria cuando la culpa es alta,
 * reforzando la sensación de que Yoru está observando al usuario.
 */
export default function InvasionOverlay() {
    const { guilt, activePersona } = useGuilt();
    const { playGlitch } = useGuiltActions();
    const [isVisible, setIsVisible] = useState(false);
    const [overlayPos, setOverlayPos] = useState({ top: "50%", left: "50%", scale: 1 });

    const isYoru = activePersona === "Yoru";

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        const triggerGlitch = () => {
            if (guilt < 40 && !isYoru) return;

            // Reduced frequency to be subtle and not annoying
            const chance = isYoru ? 0.2 : (guilt / 200);

            if (Math.random() < chance) {
                playGlitch();
                const randomTop = Math.floor(Math.random() * 60 + 20) + "%";
                const randomLeft = Math.floor(Math.random() * 60 + 20) + "%";

                // Bigger scaling
                const randomScale = 1 + Math.random() * 1.5;

                setOverlayPos({ top: randomTop, left: randomLeft, scale: randomScale });
                setIsVisible(true);

                if (timeoutId) clearTimeout(timeoutId);
                timeoutId = setTimeout(() => setIsVisible(false), 200 + Math.random() * 400);
            }
        };

        // Check every 3 seconds to be less intrusive
        const interval = setInterval(triggerGlitch, 3000);
        return () => {
            clearInterval(interval);
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [guilt, isYoru]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed inset-0 z-[60] pointer-events-none overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.9, 0.5, 1, 0] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {/* Filtro de ruido rojo */}
                    <div className="absolute inset-0 bg-red-900/10 mix-blend-overlay" />

                    <motion.div
                        className="absolute w-[150vw] md:w-[100vw] max-w-none flex justify-center items-center"
                        style={{
                            top: overlayPos.top,
                            left: overlayPos.left,
                            transform: `translate(-50%, -50%) scale(${overlayPos.scale})`,
                        }}
                    >
                        <Image
                            src="/images/ojosyoru.png"
                            alt="Yoru's Gaze"
                            width={1920}
                            height={600}
                            priority
                            className={`
                                w-full h-auto object-cover
                                invert sepia(100%) saturate(1000%) hue-rotate(320deg)
                                ${isYoru ? "brightness(150%)" : "brightness(100%) opacity-60"}
                            `}
                        />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
