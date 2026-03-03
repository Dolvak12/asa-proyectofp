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

    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!isYoru) {
            setIsVisible(false);
            return;
        }

        // Aparece mucho más seguido (cada 10-15s) en modo Yoru
        const spawnMascot = () => {
            if (Math.random() > 0.1) {
                setIsVisible(true);
                // Se queda más tiempo en pantalla (e.g. 15 segundos)
                setTimeout(() => {
                    setIsVisible(false);
                }, 15000);
            }
        };

        const interval = setInterval(spawnMascot, 12000);

        // Spawn inicial rápido para que el usuario lo vea
        const initialTimeout = setTimeout(spawnMascot, 2000);

        return () => {
            clearInterval(interval);
            clearTimeout(initialTimeout);
        };
    }, [isYoru]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
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
                    className="fixed z-[9000] pointer-events-none flex flex-col items-center top-[55%] md:top-[60%] -translate-y-1/2"
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
            )}
        </AnimatePresence>
    );
}
