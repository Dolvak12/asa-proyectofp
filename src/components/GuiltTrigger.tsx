"use client";

import { useGuiltState, useGuiltActions } from "@/context/GuiltContext";
import { motion, useAnimationControls, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";

// ============================================================
// GUILT TRIGGER — ADICCIÓN Y CONTROL
// ============================================================

const ASA_QUOTES = [
    "No me importa... da igual si nadie se sienta conmigo. Las estrellas de mar prefieren estar solas también...",
    "¿Amigos? No los necesito. Estoy... estoy bien sola. De verdad.",
    "No es que me importe lo que piensen de mí... es solo que... no, olvídalo.",
    "A veces me pregunto... si alguien, alguna vez, me querrá de verdad. No... no importa, olvida que dije eso.",
    "¿Sabías que las anémonas pueden vivir 100 años? ...yo solo quiero que alguien se quede un rato.",
    "Todo el mundo parece saber cómo hablar con otros... como si hubiera un manual que yo nunca recibí...",
    "Intenté hablarle hoy a alguien en clase... pero las palabras no... no salieron. Nunca salen.",
    "L-lo siento, no soy buena con las personas... las estrellas de mar no tienen cerebro, ¿sabías? ...perdón, eso no venía al caso.",
];

const YORU_QUOTES = [
    "TU SUFRIMIENTO ME HACE MÁS FUERTE. DAME MÁS.",
    "CADA LÁGRIMA QUE DERRAMAS ES UN ARMA EN MIS MANOS.",
    "¿CREES QUE PUEDES ESCAPAR DE MÍ? YO SOY TÚ.",
    "LA GUERRA NO NECESITA RAZÓN. SOLO NECESITA TU DOLOR.",
    "MÍRAME. SOY LO QUE TU CULPA HA CREADO. SOY TU OBRA MAESTRA.",
];

export default function GuiltTrigger() {
    const { guilt, activePersona, justTriggered, combo } = useGuiltState();
    const { addGuilt, clearTrigger, signContract, incCombo, resetCombo, startTransition } = useGuiltActions();
    const controls = useAnimationControls();
    const isYoru = activePersona === "Yoru";

    const [quoteIndex, setQuoteIndex] = useState(0);
    const [bangs, setBangs] = useState<{ id: number; x: number; y: number; size: number; rotate: number }[]>([]);
    const [isSigning, setIsSigning] = useState(false);
    const [signProgress, setSignProgress] = useState(0);

    // 1. EFECTO GLITCH MASIVO
    useEffect(() => {
        if (justTriggered) {
            controls.start({
                x: [0, -15, 15, -8, 8, 0],
                opacity: [1, 0.5, 1, 0.3, 1],
                scale: [1, 1.05, 0.95, 1],
                transition: { duration: 0.8 }
            }).then(() => clearTrigger());
        }
    }, [justTriggered, controls, clearTrigger]);

    // COMBO AUTO-RESET
    useEffect(() => {
        if (combo === 0) return;
        const timeout = setTimeout(() => {
            resetCombo();
        }, 1500);
        return () => clearTimeout(timeout);
    }, [combo, resetCombo]);

    const handleGuiltClick = (e: React.MouseEvent) => {
        const now = Date.now();

        controls.start({
            scale: [1, 1.02, 1],
            transition: { duration: 0.1 }
        });

        incCombo();

        if (isYoru) {
            const newBang = {
                id: now,
                x: e.clientX + (Math.random() * 40 - 20),
                y: e.clientY + (Math.random() * 40 - 20),
                size: Math.random() * 3 + 1.5,
                rotate: Math.random() * 60 - 30
            };
            setBangs(prev => [...prev, newBang]);
            setTimeout(() => setBangs(prev => prev.filter(b => b.id !== newBang.id)), 500);
            setQuoteIndex(prev => prev + 1);
            return;
        }

        addGuilt(10 + Math.floor(combo / 4));
        setQuoteIndex(prev => prev + 1);
    };

    const handleSignContract = useCallback(() => {
        if (isSigning) return;
        setIsSigning(true);
        setSignProgress(0);

        const interval = setInterval(() => {
            setSignProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 5; // Faster for better feel
            });
        }, 50);
    }, [isSigning]);

    // Handle completion of signing
    useEffect(() => {
        if (signProgress >= 100 && isSigning) {
            startTransition(() => {
                signContract();
                setIsSigning(false);
                setSignProgress(0);
            });
        }
    }, [signProgress, isSigning, startTransition, signContract]);

    const currentQuote = isYoru
        ? YORU_QUOTES[quoteIndex % YORU_QUOTES.length]
        : ASA_QUOTES[quoteIndex % ASA_QUOTES.length];

    return (
        <motion.div animate={controls} className="relative w-full max-w-2xl mx-auto">
            {/* Combo Heat Effect */}
            {combo > 8 && (
                <motion.div
                    className="absolute -inset-4 rounded-3xl opacity-30 blur-2xl -z-10 bg-red-600"
                    animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ repeat: Infinity, duration: 0.4 }}
                />
            )}

            <div className={`
                relative z-10 rounded-3xl p-8 md:p-12 overflow-hidden
                transition-all duration-700 
                ${isYoru
                    ? "bg-black border-4 border-[#DC143C] shadow-[0_0_80px_rgba(220,20,60,0.4)]"
                    : "bg-white border-2 border-black shadow-[15px_15px_0px_rgba(0,0,0,1)]"
                }
            `}>
                {/* Combo Label */}
                <AnimatePresence>
                    {combo > 1 && (
                        <motion.div
                            initial={{ scale: 0, x: 20 }}
                            animate={{ scale: 1.2, x: 0 }}
                            exit={{ scale: 2, opacity: 0 }}
                            className={`absolute top-6 right-8 font-black text-3xl italic ${isYoru ? 'text-[#DC143C]' : 'text-black'}`}
                            style={{ fontFamily: "var(--font-creepster)" }}
                        >
                            x{combo}
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="mb-10 opacity-40 flex items-center gap-3">
                    <span className="text-xl">{isYoru ? "⚔" : "🐚"}</span>
                    <span className="text-[10px] uppercase font-black tracking-[0.5em]">
                        {isYoru ? "POSESIÓN DEMONÍACA" : "MONÓLOGO INTERIOR"}
                    </span>
                </div>

                <motion.blockquote
                    key={`${activePersona}-${quoteIndex}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`text-xl md:text-3xl leading-snug mb-12 ${isYoru ? "text-white" : "text-black"}`}
                    style={{ fontFamily: isYoru ? "var(--font-creepster)" : "inherit" }}
                >
                    &ldquo;{currentQuote}&rdquo;
                </motion.blockquote>

                <div className="flex flex-col items-center">
                    {!isYoru && guilt >= 100 ? (
                        <motion.button
                            onClick={handleSignContract}
                            className="w-full py-6 text-2xl font-black bg-black text-white border-4 border-[#DC143C] shadow-[10px_10px_0px_#DC143C] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                            whileHover={{ scale: 1.02 }}
                        >
                            ENTREGAR MI CUERPO
                        </motion.button>
                    ) : (
                        <motion.button
                            onClick={handleGuiltClick}
                            className={`
                                px-10 py-5 text-lg font-black uppercase tracking-widest rounded-full
                                transition-all duration-300
                                ${isYoru
                                    ? "bg-[#DC143C] text-white shadow-[0_0_30px_#DC143C]"
                                    : "bg-black text-white hover:scale-95"
                                }
                            `}
                            whileTap={{ scale: 1.2 }}
                        >
                            {isYoru ? "MATA A TODOS" : "HUNDIRSE EN CULPA"}
                        </motion.button>
                    )}

                    <div className="mt-8 flex flex-col items-center gap-2">
                        <div className="w-48 h-1 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                                className={`h-full ${isYoru ? 'bg-[#DC143C]' : 'bg-black'}`}
                                animate={{ width: `${isYoru ? 100 : guilt}%` }}
                            />
                        </div>
                        <p className={`text-[10px] font-bold uppercase tracking-widest ${isYoru ? 'text-[#DC143C]' : 'opacity-40'}`}>
                            {isYoru ? "CONTROL TOTAL DEL DEMONIO" : `Nivel de trauma: ${guilt}%`}
                        </p>
                    </div>
                </div>
            </div>

            {/* Signing Modal */}
            <AnimatePresence>
                {isSigning && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[1000] bg-black/95 flex flex-col items-center justify-center p-8"
                    >
                        <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ repeat: Infinity, duration: 0.3 }}
                            className="text-white text-6xl md:text-9xl font-black mb-12 opacity-80"
                            style={{ fontFamily: "var(--font-creepster)" }}
                        >
                            PACTO DE GUERRA
                        </motion.div>

                        <div className="w-full max-w-xl bg-white/10 h-4 rounded-full overflow-hidden mb-4">
                            <motion.div
                                className="h-full bg-[#DC143C] shadow-[0_0_20px_#DC143C]"
                                style={{ width: `${signProgress}%` }}
                            />
                        </div>
                        <p className="text-[#DC143C] font-mono text-xs uppercase tracking-[1em] animate-pulse">
                            SELLANDO CONTRATO...
                        </p>

                        {/* Blood splatters */}
                        {signProgress > 30 && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1.5 }}
                                className="absolute top-1/4 left-1/4 w-32 h-32 bg-red-700 rounded-full blur-3xl opacity-40 mix-blend-multiply"
                            />
                        )}
                        {signProgress > 70 && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 2 }}
                                className="absolute bottom-1/3 right-1/4 w-40 h-40 bg-red-800 rounded-full blur-3xl opacity-40 mix-blend-multiply"
                            />
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* BANG Texts */}
            <div className="fixed inset-0 pointer-events-none z-[2000]">
                {bangs.map(b => (
                    <motion.div
                        key={b.id}
                        initial={{ opacity: 1, scale: 0.5, rotate: b.rotate }}
                        animate={{ opacity: 0, scale: b.size, y: -200 }}
                        className="absolute font-black text-[#DC143C]"
                        style={{
                            left: b.x,
                            top: b.y,
                            fontFamily: "var(--font-creepster)",
                            fontSize: "6rem",
                            textShadow: "0 0 20px rgba(220,20,60,0.8)"
                        }}
                    >
                        BANG
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}

