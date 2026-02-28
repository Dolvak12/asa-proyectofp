"use client";

import { useGuiltState } from "@/context/GuiltContext";
import { motion } from "framer-motion";

/**
 * VIGNETTE LAYER — El cierre de la visión
 * 
 * OPTIMIZED: Evitamos animar gradientes directamente (costo GPU altísimo).
 * En su lugar, usamos opacidad sobre gradientes estáticos.
 */
export default function VignetteLayer() {
    const { guilt, activePersona } = useGuiltState();
    const isYoru = activePersona === "Yoru";

    // Opacidad base según la culpa
    const baseOpacity = isYoru ? 0.8 : (guilt / 100) * 0.6;

    // El tamaño del "agujero" ahora es más estable para evitar re-calculos pesados
    // Usamos un valor fijo o pocos escalones si es necesario, pero aquí lo dejamos estático por capa

    return (
        <>
            {/* Capa de Oscuridad — Estática en degradado, dinámica en opacidad */}
            <motion.div
                className="fixed inset-0 pointer-events-none z-[80]"
                style={{
                    background: `radial-gradient(circle, transparent 30%, rgba(0,0,0,1) 150%)`,
                }}
                animate={{ opacity: baseOpacity }}
                transition={{ duration: 1 }}
            />

            {/* Capa de Pulso Rojo (Pánico/Guerra) — Solo se anima la opacidad */}
            {(isYoru || guilt > 50) && (
                <motion.div
                    className="fixed inset-0 pointer-events-none z-[81]"
                    style={{
                        background: `radial-gradient(circle, transparent 50%, rgba(220, 20, 60, 0.6) 150%)`,
                    }}
                    animate={{
                        opacity: isYoru ? [0.2, 0.5, 0.2] : [0, (guilt - 50) / 100 * 0.4, 0]
                    }}
                    transition={{
                        duration: isYoru ? 1 : 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            )}
        </>
    );
}
