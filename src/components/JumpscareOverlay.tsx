"use client";

import { useEffect, useState } from "react";
import { useGuiltState, useGuiltActions } from "@/context/GuiltContext";
import { motion, AnimatePresence } from "framer-motion";

export default function JumpscareOverlay() {
    const { guilt, activePersona } = useGuiltState();
    const { playGlitch } = useGuiltActions();
    const [show, setShow] = useState(false);

    useEffect(() => {
        // Disparar exactamente cuando la culpa llega a 100 siendo Asa
        if (guilt === 100 && activePersona === "Asa" && !show) {
            setShow(true);
            playGlitch(); // Ruido estridente

            // Jumpscare dura exactamente 1 segundo
            const timer = setTimeout(() => setShow(false), 1000);
            return () => clearTimeout(timer);
        }

        // Reset si la culpa baja (por Konami code o refresh)
        if (guilt < 100 && show) {
            setShow(false);
        }
    }, [guilt, activePersona, playGlitch, show]);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[200000] pointer-events-none flex items-center justify-center overflow-hidden"
                >
                    {/* Cristal Roto Distorsionado */}
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: [1, 1.05, 1], rotate: [0, 1, -1, 0] }}
                        transition={{ duration: 0.1, repeat: Infinity }}
                        className="absolute inset-0 bg-white/10 backdrop-blur-sm backdrop-invert"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full stroke-black stroke-[0.3] fill-transparent">
                            {/* Líneas de fractura que salen desde el centro hacia los bordes */}
                            <path d="M50 50 L10 0 M50 50 L90 0 M50 50 L100 20 M50 50 L100 80 M50 50 L80 100 M50 50 L30 100 M50 50 L0 70 M50 50 L0 30" />
                            {/* Agujero de impacto e hilos secundarios */}
                            <path d="M40 40 L60 30 M60 30 L70 50 M70 50 L50 70 M50 70 L30 60 M30 60 L40 40" strokeWidth="0.5" />
                            <path d="M45 45 L55 42 M55 42 L58 52 M58 52 L48 58 M48 58 L42 52 M42 52 L45 45" strokeWidth="0.8" />
                        </svg>
                    </motion.div>

                    {/* Glitch estresante en toda la pantalla */}
                    <motion.div
                        animate={{ opacity: [0, 0.8, 0, 1, 0] }}
                        transition={{ duration: 0.2, repeat: Infinity }}
                        className="absolute inset-0 bg-red-600 mix-blend-screen"
                    />

                    {/* Efecto scanline masivo y rápido para ruido VHS */}
                    <div className="absolute inset-0 opacity-20" style={{
                        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 1px, black 1px, black 2px)",
                        backgroundSize: "100% 4px",
                    }}></div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
