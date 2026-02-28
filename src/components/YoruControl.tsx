"use client";

import { useGuilt } from "@/context/GuiltContext";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

// ============================================================
// YORU CONTROL — El componente que rompe la cuarta pared
// ============================================================
// Este componente se encarga de:
// 1. Manipular el Título del Documento (Metadatos).
// 2. Disparar Jumpscares aleatorios de Yoru.
// 3. Crear una atmósfera de control total estilo DDLC.
// ============================================================

export default function YoruControl() {
    const { activePersona, guilt } = useGuilt();
    const isYoru = activePersona === "Yoru";
    const [showJumpscare, setShowJumpscare] = useState(false);
    const [jumpscareImg, setJumpscareImg] = useState("/images/yoru2.jpg");
    const [showError, setShowError] = useState(false);
    const [chaoticPopups, setChaoticPopups] = useState<{ id: number; x: number; y: number; scale: number; img: string }[]>([]);

    // 1. MANIPULACIÓN DEL TÍTULO DEL DOCUMENTO
    useEffect(() => {
        const originalTitle = "Guilty Sanctuary — Asa Mitaka × Yoru Fan Experience";

        if (isYoru) {
            document.title = "YORU • CONTROL TOTAL";

            const titles = [
                "YORU • CONTROL TOTAL",
                "EL DEMONIO DE LA GUERRA",
                "TU CULPA ME ALIMENTA",
                "HA HA HA HA HA",
                "BANG BANG BANG",
                "MÍRAME A LOS OJOS",
                "ERROR DE SISTEMA",
            ];

            let i = 0;
            const interval = setInterval(() => {
                document.title = titles[i % titles.length];
                i++;
            }, 3000);

            return () => {
                clearInterval(interval);
                document.title = originalTitle;
            };
        } else {
            document.title = originalTitle;
            if (guilt > 70) {
                document.title = "Al-algo está mal...";
            }
        }
    }, [isYoru, guilt]);

    // 2. SISTEMA DE JUMPSCARES ALEATORIOS DUALES Y POPUPS CAÓTICOS
    useEffect(() => {
        if (!isYoru) {
            setChaoticPopups([]);
            return;
        }

        let intervals: NodeJS.Timeout[] = [];
        let flickerInterval: NodeJS.Timeout | null = null;

        // Función para los Jumpscares de pantalla completa y errores
        const triggerEffects = () => {
            const rand = Math.random();

            if (rand > 0.45) {
                // JUMPSCARE DUAL
                setJumpscareImg(Math.random() > 0.5 ? "/images/yoru1.jpg" : "/images/yoru2.jpg");
                setShowJumpscare(true);

                if (flickerInterval) clearInterval(flickerInterval);
                flickerInterval = setInterval(() => {
                    setJumpscareImg(prev => prev === "/images/yoru1.jpg" ? "/images/yoru2.jpg" : "/images/yoru1.jpg");
                }, 80);

                const jumpscareTimeout = setTimeout(() => {
                    if (flickerInterval) {
                        clearInterval(flickerInterval);
                        flickerInterval = null;
                    }
                    setShowJumpscare(false);
                }, 600);
                intervals.push(jumpscareTimeout);
            } else if (rand < 0.1) {
                // ERROR FALSO
                setShowError(true);
                const errorTimeout = setTimeout(() => setShowError(false), 2500);
                intervals.push(errorTimeout);
            }

            const nextTime = Math.random() * 15000 + 8000;
            const timeout = setTimeout(triggerEffects, nextTime);
            intervals.push(timeout);
        };

        // Función para los Popups caóticos (más insistentes)
        const triggerPopups = () => {
            const id = Date.now() + Math.random();
            const newPopup = {
                id,
                x: Math.random() * 80 + 10, // 10-90%
                y: Math.random() * 80 + 10, // 10-90%
                scale: Math.random() * 0.5 + 0.3, // 0.3-0.8 scale
                img: Math.random() > 0.5 ? "/images/yoru1.jpg" : "/images/yoru2.jpg"
            };

            setChaoticPopups(prev => [...prev, newPopup]);

            // Desaparece rápido
            const popupRemoveTimeout = setTimeout(() => {
                setChaoticPopups(prev => prev.filter(p => p.id !== id));
            }, 150 + Math.random() * 400);
            intervals.push(popupRemoveTimeout);

            const nextPopupTime = Math.random() * 4000 + 1000;
            const timeout = setTimeout(triggerPopups, nextPopupTime);
            intervals.push(timeout);
        };

        const t1 = setTimeout(triggerEffects, 10000);
        const t2 = setTimeout(triggerPopups, 5000);
        intervals.push(t1, t2);

        return () => {
            intervals.forEach(clearTimeout);
            if (flickerInterval) clearInterval(flickerInterval);
            setShowJumpscare(false);
            setShowError(false);
            setChaoticPopups([]);
        };
    }, [isYoru]);

    return (
        <>
            {/* POPUPS CAÓTICOS ALEATORIOS */}
            <div className="fixed inset-0 z-[9998] pointer-events-none overflow-hidden">
                <AnimatePresence>
                    {chaoticPopups.map((popup) => (
                        <motion.div
                            key={popup.id}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 0.8, scale: popup.scale }}
                            exit={{ opacity: 0, scale: 1.5, filter: "blur(10px)" }}
                            className="absolute"
                            style={{
                                top: `${popup.y}%`,
                                left: `${popup.x}%`,
                                width: "300px",
                                height: "300px",
                                transform: "translate(-50%, -50%)"
                            }}
                        >
                            <div className="relative w-full h-full border-2 border-red-600 shadow-[0_0_30px_rgba(255,0,0,0.4)]">
                                <Image
                                    src={popup.img}
                                    alt="CHAOS"
                                    fill
                                    className="object-cover grayscale brightness-150 contrast-150"
                                />
                                <div className="absolute inset-0 bg-red-900/10" />
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* CAPA DE JUMPSCARE Fullscreen */}
            <AnimatePresence>
                {showJumpscare && (
                    <motion.div
                        className="yoru-jumpscare fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center bg-black/40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="relative w-screen h-screen">
                            <Image
                                src={jumpscareImg}
                                alt="YORU IS WATCHING"
                                fill
                                className="object-cover contrast-[250%] brightness-[150%] hue-rotate-[-30deg]"
                                priority
                            />
                            <div className="absolute inset-0 bg-red-900/20 mix-blend-overlay" />
                        </div>

                        <motion.h2
                            className="absolute text-8xl md:text-[15rem] font-black text-white/20 z-10 select-none uppercase text-center w-full"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1.2, opacity: 0.2 }}
                            style={{ fontFamily: "var(--font-creepster)" }}
                        >
                            MI CUERPO
                        </motion.h2>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* FALSO ERROR DEL SISTEMA */}
            <AnimatePresence>
                {showError && (
                    <motion.div
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9990] w-80 bg-[#1A1A1A] border-2 border-red-600 p-4 shadow-[0_0_50px_rgba(255,0,0,0.5)] font-mono"
                        initial={{ scale: 0, rotate: -10 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, opacity: 0 }}
                    >
                        <div className="flex justify-between items-center mb-4 border-b border-red-600 pb-2">
                            <span className="text-red-500 font-bold">SYSTEM_CRITICAL_ERROR</span>
                            <button
                                onClick={() => setShowError(false)}
                                className="text-red-600 hover:bg-red-600 hover:text-white px-2"
                            >
                                X
                            </button>
                        </div>
                        <p className="text-white text-sm mb-4">
                            La voluntad de Asa Mitaka ha sido sobrescrita.
                            <br /><br />
                            <span className="text-red-500 glitch-text-yoru">GUERRA EN CURSO.</span>
                        </p>
                        <div className="flex justify-end">
                            <button
                                onClick={() => setShowError(false)}
                                className="bg-red-800 text-white px-4 py-1 text-xs hover:bg-red-600"
                            >
                                ACEPTAR
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* EFECTOS AMBIENTALES DE CONTROL (Solo Yoru) */}
            {isYoru && (
                <div className="fixed inset-0 z-[90] pointer-events-none overflow-hidden">
                    {/* Ojos que aparecen y desaparecen en los bordes */}
                    {Array.from({ length: 4 }).map((_, i) => (
                        <motion.div
                            key={`eye-${i}`}
                            className="absolute w-24 h-24 opacity-0"
                            style={{
                                top: `${Math.random() * 80 + 10}%`,
                                left: i % 2 === 0 ? "2%" : "90%",
                            }}
                            animate={{
                                opacity: [0, 0.15, 0],
                                scale: [0.8, 1.2, 1],
                            } as any}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                delay: i * 5,
                                ease: "easeInOut",
                            }}
                        >
                            <div className="w-full h-full rounded-full border-4 border-red-900/20 flex items-center justify-center">
                                <div className="w-4 h-4 bg-red-600/30 rounded-full" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </>
    );
}
