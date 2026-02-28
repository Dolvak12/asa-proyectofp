"use client";

import { useGuilt } from "@/context/GuiltContext";
import { motion, AnimatePresence } from "framer-motion";

// ============================================================
// HEADER — EL ENCABEZADO DUAL DEL SANTUARIO
// ============================================================
// El header refleja visualmente quién controla la mente en este momento.
// - Modo Asa: limpio, melancólico, azul escolar. Como su uniforme.
// - Modo Yoru: oscuro, agresivo, rojo sangre. Como la guerra misma.
//
// El "Guilt Meter" es la barra de progreso que muestra al usuario
// cuánto sufrimiento ha acumulado Asa, y qué tan cerca está Yoru
// de tomar el control total del DOM (y de su cuerpo).
// ============================================================

export default function Header() {
    const { guilt, activePersona, resetGuilt } = useGuilt();

    // Determinar si estamos en modo Yoru (demonio activo)
    const isYoru = activePersona === "Yoru";

    return (
        <motion.header
            // Transición del fondo: de la paz escolar al infierno demoníaco
            className={`
        fixed top-0 left-0 right-0 z-50
        px-6 py-4
        backdrop-blur-md
        transition-colors duration-700
        ${isYoru
                    ? "bg-[#0A0A0A]/95 border-b-2 border-[#8B0000] shadow-[0_4px_30px_rgba(139,0,0,0.4)]"
                    : "bg-[#F5F5F0]/90 border-b border-[#1B263B]/20 shadow-sm"
                }
      `}
            // Sacudida sutil cuando Yoru toma el control
            animate={isYoru ? { x: [0, -2, 2, -1, 1, 0] } : { x: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="max-w-5xl mx-auto flex flex-col gap-3">
                {/* ---- Fila superior: Título + Indicador de Personalidad ---- */}
                <div className="flex items-center justify-between">
                    {/* Título del Santuario */}
                    <motion.h1
                        className={`
              text-2xl md:text-3xl font-bold tracking-tight
              transition-colors duration-700
              ${isYoru ? "text-[#DC143C]" : "text-[#1B263B]"}
            `}
                        style={{
                            // Yoru usa una tipografía agresiva; Asa usa una limpia y legible
                            fontFamily: isYoru ? "var(--font-creepster)" : "var(--font-inter)",
                        }}
                        // Efecto de "invasión" cuando Yoru toma control
                        animate={isYoru ? { scale: [1, 1.05, 1], letterSpacing: ["0em", "0.05em", "0.02em"] } : { scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                    >
                        {isYoru ? "GUILTY SANCTUARY" : "Guilty Sanctuary"}
                    </motion.h1>

                    {/* Indicador de personalidad activa */}
                    <div className="flex items-center gap-3">
                        <AnimatePresence mode="wait">
                            <motion.span
                                key={activePersona}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.3 }}
                                className={`
                  text-xs font-mono uppercase tracking-widest px-3 py-1 rounded-full
                  ${isYoru
                                        ? "bg-[#8B0000]/30 text-[#DC143C] border border-[#8B0000]/50"
                                        : "bg-[#1B263B]/10 text-[#1B263B] border border-[#1B263B]/20"
                                    }
                `}
                            >
                                {isYoru ? "⚔ YORU" : "✧ ASA"}
                            </motion.span>
                        </AnimatePresence>

                        {/* Botón de reset — un momento de paz (solo visible cuando hay culpa) */}
                        {guilt > 0 && (
                            <motion.button
                                onClick={resetGuilt}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={`
                  text-xs px-3 py-1 rounded-full
                  transition-colors duration-300
                  ${isYoru
                                        ? "bg-[#8B0000]/20 text-[#F5F5F0]/60 hover:bg-[#8B0000]/40 hover:text-[#F5F5F0]"
                                        : "bg-[#1B263B]/10 text-[#1B263B]/60 hover:bg-[#1B263B]/20 hover:text-[#1B263B]"
                                    }
                `}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Reset
                            </motion.button>
                        )}
                    </div>
                </div>

                {/* ---- NAVEGACIÓN "HAUNTED" ---- */}
                <nav className="flex items-center justify-center gap-6 md:gap-12 py-1">
                    {[
                        { asa: "Inicio", yoru: "PRISIÓN", id: "nav-home" },
                        { asa: "El Diario", yoru: "PECES MUERTOS", id: "nav-lore" },
                        { asa: "Armería", yoru: "CADÁVERES", id: "nav-armory" },
                        { asa: "Santuario", yoru: "INFIERNO", id: "nav-sanctuary" }
                    ].map((item) => (
                        <motion.a
                            key={item.id}
                            href="#"
                            className={`
                text-[10px] md:text-xs font-black uppercase tracking-[0.2em] relative group
                transition-colors duration-500
                ${isYoru ? "text-[#DC143C]/60 hover:text-[#DC143C]" : "text-[#1B263B]/40 hover:text-[#1B263B]"}
              `}
                            whileHover={{ y: isYoru ? 0 : -2, scale: isYoru ? 1.1 : 1 }}
                        >
                            <AnimatePresence mode="wait">
                                <motion.span
                                    key={isYoru ? "yoru" : "asa"}
                                    initial={{ opacity: 0, filter: "blur(5px)" }}
                                    animate={{ opacity: 1, filter: "blur(0px)" }}
                                    exit={{ opacity: 0, filter: "blur(10px)" }}
                                    className={isYoru ? "glitch-text-yoru" : ""}
                                >
                                    {isYoru ? item.yoru : item.asa}
                                </motion.span>
                            </AnimatePresence>

                            {/* Subrayado animado */}
                            <span className={`
                                absolute -bottom-1 left-0 w-0 h-[1px] transition-all duration-300 group-hover:w-full
                                ${isYoru ? "bg-[#DC143C]" : "bg-[#1B263B]"}
                            `} />
                        </motion.a>
                    ))}
                </nav>

                {/* ---- GUILT METER — La barra de progreso del sufrimiento ---- */}
                {/* Esta barra representa visualmente cuánto dolor ha acumulado Asa.
            Para Yoru, cada píxel que se llena es un paso más hacia el poder total.
            Para Asa, cada píxel es un pedazo más de su humanidad que se desvanece. */}
                <div className="w-full">
                    {/* Etiqueta del medidor */}
                    <div className="flex justify-between items-center mb-1.5">
                        <span
                            className={`
                text-[10px] uppercase tracking-[0.2em] font-medium
                transition-colors duration-700
                ${isYoru ? "text-[#DC143C]/70" : "text-[#1B263B]/50"}
              `}
                        >
                            {isYoru ? "PODER DE YORU" : "Medidor de Culpa"}
                        </span>
                        <motion.span
                            className={`
                text-xs font-mono font-bold
                transition-colors duration-700
                ${isYoru ? "text-[#DC143C]" : "text-[#1B263B]"}
              `}
                            // Animación de "pulso" cuando la culpa crece
                            animate={guilt > 75 && !isYoru ? { opacity: [1, 0.5, 1] } : {}}
                            transition={{ repeat: Infinity, duration: 0.8 }}
                        >
                            {guilt}%
                        </motion.span>
                    </div>

                    {/* Barra de progreso */}
                    <div
                        className={`
              w-full h-2.5 rounded-full overflow-hidden
              transition-colors duration-700
              ${isYoru
                                ? "bg-[#1A1A1A] border border-[#8B0000]/30"
                                : "bg-[#1B263B]/10"
                            }
            `}
                    >
                        <motion.div
                            className="h-full rounded-full relative overflow-hidden"
                            style={{
                                // El color de la barra transiciona de azul escolar a rojo sangre
                                background: isYoru
                                    ? "linear-gradient(90deg, #8B0000, #DC143C, #FF4444)"
                                    : guilt > 60
                                        ? `linear-gradient(90deg, #1B263B, #5C2D2D, #8B0000)`
                                        : `linear-gradient(90deg, #1B263B, #2D4A7A)`,
                            }}
                            // Animación suave de la barra al cambiar el nivel de culpa
                            animate={{ width: `${guilt}%` }}
                            transition={{
                                duration: 0.6,
                                ease: "easeOut",
                            }}
                        >
                            {/* Efecto de brillo que recorre la barra (como energía demoníaca fluyendo) */}
                            {guilt > 0 && (
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                    animate={{ x: ["-100%", "200%"] }}
                                    transition={{
                                        duration: isYoru ? 1 : 2,
                                        repeat: Infinity,
                                        ease: "linear",
                                    }}
                                />
                            )}
                        </motion.div>
                    </div>

                    {/* Marcadores de umbral en la barra */}
                    <div className="relative w-full h-0">
                        {[25, 50, 75].map((mark) => (
                            <div
                                key={mark}
                                className={`
                  absolute top-0 w-px h-1
                  transition-colors duration-700
                  ${isYoru ? "bg-[#DC143C]/20" : "bg-[#1B263B]/15"}
                `}
                                style={{ left: `${mark}%` }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </motion.header>
    );
}
