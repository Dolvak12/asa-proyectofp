"use client";

import { useGuilt } from "@/context/GuiltContext";
import { motion, useSpring, useMotionValue } from "framer-motion";
import { useEffect } from "react";

/**
 * CURSED CURSOR — El Rastro del Pecado
 * 
 * Este componente crea un rastro visual (luz roja/sangre) que sigue al cursor.
 * La intensidad y el tamaño del rastro aumentan con la culpa.
 * En modo Yoru, el rastro se vuelve más errático y agresivo.
 */
export default function CursedCursor() {
    const { guilt, activePersona } = useGuilt();
    const isYoru = activePersona === "Yoru";

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Suavizado para el movimiento del rastro
    const springConfig = { damping: 25, stiffness: 150 };
    const cursorX = useSpring(mouseX, springConfig);
    const cursorY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    // Solo mostrar el rastro si hay culpa o modo Yoru
    if (guilt < 10 && !isYoru) return null;

    // Calcular tamaño e intensidad según culpa
    const size = isYoru ? 150 : 40 + (guilt * 0.8);
    const opacity = isYoru ? 0.6 : (guilt / 200) + 0.1;

    return (
        <motion.div
            className="fixed inset-0 pointer-events-none z-[100]"
            style={{
                background: `radial-gradient(circle ${size}px at ${cursorX}px ${cursorY}px, ${isYoru ? "rgba(220, 20, 60, 0.4)" : "rgba(139, 0, 0, 0.2)"}, transparent)`,
            }}
            animate={{
                // Efecto de parpadeo/latido
                opacity: [opacity, opacity * 0.8, opacity],
            }}
            transition={{
                duration: isYoru ? 0.2 : 1.5,
                repeat: Infinity,
                ease: "linear",
            }}
        >
            {/* El núcleo del rastro "sangriento" */}
            <motion.div
                className={`absolute rounded-full blur-xl ${isYoru ? "bg-[#DC143C]" : "bg-[#8B0000]"}`}
                style={{
                    width: isYoru ? 12 : 8,
                    height: isYoru ? 12 : 8,
                    x: cursorX,
                    y: cursorY,
                    translateX: "-50%",
                    translateY: "-50%",
                    opacity: opacity * 1.5,
                }}
            />
        </motion.div>
    );
}
