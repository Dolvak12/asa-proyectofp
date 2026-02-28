"use client";

import { useGuilt } from "@/context/GuiltContext";
import { motion } from "framer-motion";

/**
 * VIGNETTE LAYER — El cierre de la visión
 * 
 * A medida que la culpa de Asa aumenta, el mundo se vuelve más estrecho.
 * Este componente crea un gradiente radial que se cierra sobre el centro
 * de la pantalla, simulando ansiedad y claustrofobia.
 */
export default function VignetteLayer() {
    const { guilt, activePersona } = useGuilt();
    const isYoru = activePersona === "Yoru";

    // Calculamos el tamaño del "agujero" de visión.
    // 0% culpa -> 100% visión (vignette muy abierta)
    // 100% culpa -> 40% visión (vignette muy cerrada y oscura)
    const visionSize = isYoru ? 40 : 100 - (guilt * 0.5);
    const opacity = isYoru ? 0.6 : (guilt / 100) * 0.4;

    return (
        <motion.div
            className="fixed inset-0 pointer-events-none z-[80]"
            animate={{
                background: `radial-gradient(circle, transparent ${visionSize}%, rgba(0,0,0,${isYoru ? 0.9 : 0.8}) 150%)`,
                opacity: opacity
            }}
            transition={{ duration: 1 }}
        />
    );
}
