"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ============================================================
// SEA FACT BUBBLE — El mecanismo de defensa de Asa
// ============================================================
// Asa recurre a datos aburridos sobre biología marina cuando
// se siente incómoda socialmente. Este componente muestra
// esos datos cerca de ella.
// ============================================================

const MARINE_FACTS = [
    "¿Sabías que las anémonas pueden vivir más de 100 años? No tienen cerebro, pero sobreviven.",
    "Las esponjas de mar existen desde hace 640 millones de años... antes que los dinosaurios.",
    "La medusa Turritopsis dohrnii es inmortal. Puede revertir su edad cuando está herida.",
    "Los caballitos de mar pigmeos pasan toda su vida en un solo abanico de mar.",
    "El corazón de una ballena azul es del tamaño de un coche pequeño.",
    "Los tiburones de Groenlandia pueden vivir hasta 400 años... imaginatelo, estar solo tanto tiempo.",
    "Algunas anémonas pueden nadar si se sienten amenazadas, aunque no tienen corazón.",
    "Las estrellas de mar no tienen sangre; filtran agua de mar a través de su cuerpo."
];

export default function SeaFactBubble({ visible }: { visible: boolean }) {
    const [factIndex, setFactIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (visible) {
            const interval = setInterval(() => {
                setFactIndex((prev) => (prev + 1) % MARINE_FACTS.length);
            }, 10000); // Cambio lento, para no abrumar
            return () => clearInterval(interval);
        }
    }, [visible]);

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, x: -50 }}
                    whileHover={{ scale: 1.05, rotate: -1 }}
                    className="absolute -top-20 -right-2 md:-top-36 md:-right-10 z-[40]"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <div className="relative group">
                        {/* El "globo" de texto tímido */}
                        <div className={`
                max-w-[200px] md:max-w-[250px] p-4 rounded-2xl shadow-xl
                bg-white border border-[#1B263B]/10 text-[#1B263B]
                transition-transform duration-500 text-left
            `}>
                            <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest opacity-30 mb-2">
                                Dato Evasivo #{factIndex + 1}
                            </p>
                            <p className="text-xs md:text-sm leading-relaxed italic opacity-80">
                                &ldquo;{MARINE_FACTS[factIndex]}&rdquo;
                            </p>

                            {/* Rabo del globo */}
                            <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white border-r border-b border-[#1B263B]/10 rotate-45" />
                        </div>

                        {/* Efecto de "espantar" el globo (interacción suave) */}
                        <motion.div
                            className="absolute -inset-2 rounded-3xl border border-dashed border-[#1B263B]/20 pointer-events-none"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
