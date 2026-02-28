"use client";

import { useGuilt } from "@/context/GuiltContext";
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
    const [isVisible, setIsVisible] = useState(false);
    const [overlayPos, setOverlayPos] = useState({ top: "50%", left: "50%", scale: 1 });

    const isYoru = activePersona === "Yoru";

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        const triggerGlitch = () => {
            // Solo ocurre si hay culpa considerable o si ya estamos en modo Yoru
            if (guilt < 40 && !isYoru) return;

            // Probabilidad basada en el nivel de culpa
            const chance = isYoru ? 0.3 : (guilt / 200);

            if (Math.random() < chance) {
                const randomTop = Math.floor(Math.random() * 80) + "%";
                const randomLeft = Math.floor(Math.random() * 80) + "%";
                const randomScale = 0.5 + Math.random() * 1.5;

                setOverlayPos({ top: randomTop, left: randomLeft, scale: randomScale });
                setIsVisible(true);

                if (timeoutId) clearTimeout(timeoutId);
                timeoutId = setTimeout(() => setIsVisible(false), 150 + Math.random() * 300);
            }
        };

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
                    className="fixed inset-0 z-[60] pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.8, 0.4, 1, 0] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {/* Filtro de ruido rojo */}
                    <div className="absolute inset-0 bg-red-900/10 mix-blend-overlay" />

                    <motion.div
                        className="absolute"
                        style={{
                            top: overlayPos.top,
                            left: overlayPos.left,
                            transform: `translate(-50%, -50%) scale(${overlayPos.scale})`,
                        }}
                    >
                        <Image
                            src="/images/ojosyoru.png"
                            alt="Yoru's Gaze"
                            width={1200}
                            height={400}
                            className={`
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
