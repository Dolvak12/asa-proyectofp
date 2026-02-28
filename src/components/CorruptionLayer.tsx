"use client";

import { useGuilt } from "@/context/GuiltContext";
import { useEffect, useState, ReactNode } from "react";
import { motion, useAnimationControls } from "framer-motion";

// ============================================================
// CORRUPTION LAYER — El parásito que devora el contenido
// ============================================================
// Este componente envuelve bloques de texto y:
// 1. Reemplaza palabras aleatorias por léxico de Yoru intermitentemente.
// 2. Añade un "jitter" (temblor) visual al contenido.
// 3. (Opcional) Hace que los elementos huyan del cursor.
// ============================================================

interface CorruptionLayerProps {
    children: ReactNode;
    strength?: number; // 0 a 1
}

const CORRUPT_WORDS = ["GUERRA", "CULPA", "MÍA", "MUERTE", "SANGRE", "SANTUARIO", "DEMONIO", "SOLA"];

export default function CorruptionLayer({ children, strength = 0.2 }: CorruptionLayerProps) {
    const { activePersona } = useGuilt();
    const isYoru = activePersona === "Yoru";
    const [corruptedText, setCorruptedText] = useState<string | null>(null);
    const controls = useAnimationControls();

    // 1. SECUESTRO DE TEXTO
    useEffect(() => {
        if (!isYoru) {
            setCorruptedText(null);
            return;
        }

        const corrupt = () => {
            // Solo corruptar si el children es un string simple para este ejemplo básico
            // En una implementación real, esto recorrería el árbol de React, 
            // pero aquí lo simularemos para los componentes Hero e Instrucciones.

            const chance = Math.random();
            if (chance < 0.1) { // 10% de probabilidad de glitch de texto
                const randomWord = CORRUPT_WORDS[Math.floor(Math.random() * CORRUPT_WORDS.length)];
                setCorruptedText(randomWord);

                setTimeout(() => setCorruptedText(null), 150);
            }
        };

        const interval = setInterval(corrupt, 2000);
        return () => clearInterval(interval);
    }, [isYoru]);

    // 2. JITTER VISUAL
    useEffect(() => {
        if (!isYoru) return;

        let timeoutId: NodeJS.Timeout;

        const pulse = async () => {
            const isUncanny = Math.random() < 0.2; // 20% total weirdness

            try {
                await controls.start({
                    x: [0, (Math.random() - 0.5) * 4, 0],
                    y: [0, (Math.random() - 0.5) * 4, 0],
                    rotate: isUncanny ? [0, Math.random() > 0.5 ? 5 : -5, 0] : 0,
                    scale: isUncanny ? [1, 1.05, 1] : 1,
                    transition: { duration: 0.1, ease: "linear" }
                });
            } catch (e) {
                // Animation was likely cancelled
                return;
            }

            const nextPulse = Math.random() * 4000 + 2000;
            timeoutId = setTimeout(pulse, nextPulse);
        };

        pulse();

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
            controls.stop();
        };
    }, [isYoru, controls]);

    return (
        <motion.div
            animate={controls}
            className="relative inline-block w-full"
        >
            <div className={corruptedText ? "opacity-0 invisible" : "opacity-100 italic transition-all duration-300"}>
                {children}
            </div>

            {corruptedText && (
                <div
                    className="absolute inset-0 flex items-center justify-center text-red-600 font-black glitch-text-yoru z-10"
                    style={{ fontFamily: "var(--font-creepster)", fontSize: "1.2em" }}
                >
                    {corruptedText}
                </div>
            )}
        </motion.div>
    );
}
