"use client";

import { useGuilt } from "@/context/GuiltContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";

// ============================================================
// YORU MASCOT — El Pececito Morenita
// ============================================================
// Un easter egg o mascota que aparece navegando la pantalla
// solo en el modo Yoru, diciendo ánimos.
// ============================================================

export default function YoruMascot() {
    const { activePersona } = useGuilt();
    const isYoru = activePersona === "Yoru";

    // Array de mascotas activas { id, top }
    const [mascots, setMascots] = useState<{ id: number; top: number }[]>([]);

    useEffect(() => {
        if (!isYoru) {
            setMascots([]);
            return;
        }

        let isMounted = true;
        let mascotCount = 0; // Para generar IDs únicos

        const loopMascot = () => {
            if (!isMounted) return;

            // Random chance to spawn (Aumentado a 30% chance de salir tras los 2s)
            if (Math.random() > 0.05) {
                const newId = mascotCount++;
                const newTop = Math.floor(Math.random() * 70) + 15;

                // Agregamos la nueva mascot al array
                setMascots(prev => [...prev, { id: newId, top: newTop }]);

                // Cada mascota se borra de la pantalla tras 15 segundos
                setTimeout(() => {
                    if (isMounted) {
                        setMascots(prev => prev.filter(m => m.id !== newId));
                    }
                }, 15000);

                // Esperamos un corto tiempo antes de posiblemente soltar a otra
                // Esto permite tener varias en pantalla si el randomness pasa.
                setTimeout(loopMascot, Math.random() * 3000 + 1000);
            } else {
                // If it decides not to spawn, try again shortly
                setTimeout(loopMascot, 2500);
            }
        };

        // Initial spawn quickly after entering Yoru Mode
        const initialTimeout = setTimeout(loopMascot, 1000);

        return () => {
            isMounted = false;
            clearTimeout(initialTimeout);
            setMascots([]);
        };
    }, [isYoru]);

    return (
        <AnimatePresence>
            {mascots.map((mascot) => (
                <motion.div
                    key={mascot.id}
                    initial={{ x: "120vw", y: "0vh", rotate: -10 }}
                    animate={{
                        x: "-50vw",
                        y: ["-5vh", "5vh", "-10vh", "10vh"],
                        rotate: [-10, 5, -5, 10]
                    }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{
                        x: { duration: 15, ease: "linear" },
                        y: { duration: 12, ease: "easeInOut", repeatType: "mirror", repeat: Infinity },
                        rotate: { duration: 6, ease: "easeInOut", repeatType: "mirror", repeat: Infinity },
                        opacity: { duration: 1 }
                    }}
                    className="fixed z-[9000] pointer-events-none flex flex-col items-center -translate-y-1/2"
                    style={{ top: `${mascot.top}%` }}
                >
                    {/* Burbuja de Texto tipo Manga */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1, duration: 0.5, type: "spring" }}
                        className="relative bg-white border-2 border-black rounded-2xl md:rounded-3xl p-2 md:p-3 mb-2 md:mb-4 shadow-[4px_4px_0px_#DC143C]"
                    >
                        <p className="text-[#1B263B] font-bold text-[10px] md:text-xs max-w-[120px] md:max-w-[150px] leading-none md:leading-tight text-center" style={{ fontFamily: "var(--font-inter)" }}>
                            ¡La queremos mi señora!
                            <br />
                            ¡Señora Yoru es la mejor!
                        </p>
                        {/* Triángulo de la burbuja */}
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[12px] border-t-black">
                            <div className="absolute -top-[14px] -left-[6px] w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[10px] border-t-white" />
                        </div>
                    </motion.div>

                    {/* El pececito mascot */}
                    <div className="relative w-16 h-16 md:w-24 md:h-24">
                        <Image
                            src="/morenita.png" // User specified this name
                            alt="Yoru Mascot"
                            fill
                            className="object-contain drop-shadow-[0_0_10px_rgba(220,20,60,0.8)]"
                        />
                    </div>
                </motion.div>
            ))}
        </AnimatePresence>
    );
}
