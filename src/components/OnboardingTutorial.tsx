"use client";

import { useGuiltActions } from "@/context/GuiltContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

/**
 * OnboardingTutorial — La primera barrera.
 * 
 * Cumple dos funciones críticas:
 * 1. Lore/Inmersión: Establece el tono oscuro y presenta el concepto de culpa (Asa).
 * 2. Técnica: Fuerza una interacción del usuario (click) para poder 
 *    inicializar el Web Audio API de manera legal según los navegadores.
 */
export default function OnboardingTutorial() {
    const { initAudio, addGuilt, signContract } = useGuiltActions();
    const [isAccepted, setIsAccepted] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        // Reloj de Sangre: Si es entre 12:00 AM y 4:00 AM, Yoru despierta inmediatamente
        const hour = new Date().getHours();
        if (hour >= 0 && hour < 4) {
            addGuilt(100);
            signContract();
            setIsAccepted(true);
            setIsMounted(true);
            return;
        }

        // Usamos localStorage para no repetir el tutorial si ya lo vieron (Memoria Persistente Base)
        const hasSeenIntro = localStorage.getItem("glt_intro_seen");
        if (hasSeenIntro) {
            setIsAccepted(true);
        }
        setIsMounted(true);
    }, [addGuilt, signContract]);

    const handleAcceptance = () => {
        initAudio(); // Inicializa el sonido vital
        localStorage.setItem("glt_intro_seen", "true");
        setIsAccepted(true);
    };

    if (!isMounted || isAccepted) return null;

    return (
        <AnimatePresence>
            {!isAccepted && (
                <motion.div
                    className="fixed inset-0 z-[999999] flex items-center justify-center p-6 bg-[#050505]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                >
                    {/* Ruido Fino Básico en el fondo */}
                    <div className="absolute inset-0 opacity-10 mix-blend-screen pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')]"></div>

                    <motion.div
                        className="relative max-w-lg w-full p-8 md:p-12 rounded-lg bg-[#EAE8E3] text-[#1B263B] shadow-[0_0_100px_rgba(255,255,255,0.05)] border border-[#1B263B]/20"
                        style={{
                            backgroundImage: "radial-gradient(circle at center, #F5F5F0 0%, #DEDCD6 100%)",
                            boxShadow: "inset 0 0 40px rgba(0,0,0,0.1), 0 20px 50px rgba(0,0,0,0.5)"
                        }}
                        initial={{ y: 50, rotateX: 10 }}
                        animate={{ y: 0, rotateX: 0 }}
                        transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                    >
                        {/* Cinta falsa arriba */}
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-6 bg-white/40 shadow-sm rotate-2"></div>

                        <p className="text-[10px] uppercase font-bold tracking-[0.3em] mb-8 opacity-40 border-b border-[#1B263B]/20 pb-2">
                            Entrada de Diario Fragmentada
                        </p>

                        <div className="space-y-6 text-sm md:text-base leading-loose" style={{ fontFamily: "var(--font-inter)" }}>
                            <p>
                                Si estás leyendo esto, lograste entrar a mi mente. Soy Asa Mitaka.
                            </p>
                            <p>
                                No sé cuánto tiempo más pueda mantener el control. Comparto mi cabeza con un demonio de la guerra. Ella se alimenta de lo peor de mí: <strong className="font-bold border-b border-red-500/30">mi culpa</strong>.
                            </p>
                            <p className="italic opacity-80">
                                Hay un medidor en la parte superior...
                            </p>
                            <p>
                                Por favor, pase lo que pase, no dejes que llegue a 100. Si ella toma el control total, no habrá forma de regresar. Ten cuidado con lo que tocas.
                            </p>
                        </div>

                        <div className="mt-12 flex justify-center">
                            <motion.button
                                onClick={handleAcceptance}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-3 bg-[#1B263B] text-white text-xs uppercase font-bold tracking-widest hover:bg-black transition-colors"
                            >
                                Entendido, no la liberaré
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
