"use client";

import { useGuilt, useGuiltState, useGuiltActions } from "@/context/GuiltContext";
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
    const { addGuilt, clearTrigger, signContract, incCombo, resetCombo } = useGuiltActions();
    const controls = useAnimationControls();
    const isYoru = activePersona === "Yoru";

    const [quoteIndex, setQuoteIndex] = useState(0);
    const [bangs, setBangs] = useState<{ id: number; x: number; y: number; size: number; rotate: number }[]>([]);
    const [lastClick, setLastClick] = useState(0);

    const [isHeartbeating, setIsHeartbeating] = useState(false);
    const [showDamageFlash, setShowDamageFlash] = useState(false);

    // 1. EFECTO GLITCH MASIVO
    useEffect(() => {
        if (justTriggered) {
            controls.start({
                x: [0, -20, 15, -10, 8, -5, 3, 0],
                y: [0, 10, -15, 8, -5, 3, -2, 0],
                opacity: [1, 0.2, 1, 0.1, 1, 0.3, 1, 1],
                scale: [1, 1.02, 0.98, 1.03, 0.97, 1.01, 1],
                transition: { duration: 1.2, ease: "easeInOut" },
            }).then(() => clearTrigger());
        }
    }, [justTriggered, controls, clearTrigger]);

    // 3. COMBO AUTO-RESET
    useEffect(() => {
        if (combo === 0) return;
        const timeout = setTimeout(() => {
            resetCombo();
        }, 1500);
        return () => clearTimeout(timeout);
    }, [combo, resetCombo]);

    const handleGuiltClick = (e: React.MouseEvent) => {
        const now = Date.now();

        // Visual Haptic Bump (The card itself jumps)
        controls.start({
            scale: [1, 1.05, 1],
            transition: { duration: 0.15, ease: "easeOut" }
        });

        // Camera Thump (Global-ish shake) - Desktop
        if (typeof window !== "undefined" && window.innerWidth > 768) {
            const root = document.documentElement;
            root.style.transform = `translate(${(Math.random() - 0.5) * 10}px, ${(Math.random() - 0.5) * 10}px)`;
            setTimeout(() => { root.style.transform = ""; }, 50);
        }

        // Mobile Visual Haptics
        if (typeof window !== "undefined" && window.innerWidth <= 768) {
            setShowDamageFlash(true);
            setTimeout(() => setShowDamageFlash(false), 400);

            // Visual Shake trigger via state or class if preferred, 
            // but we can use controls for a more controlled "violent" shake
            controls.start({
                x: [0, -10, 10, -10, 10, 0],
                transition: { duration: 0.2 }
            });
        }

        // Manejo de Combo Global
        incCombo();
        setLastClick(now);

        if (isYoru) {
            const newBang = {
                id: now,
                x: e.clientX + (Math.random() * 40 - 20),
                y: e.clientY + (Math.random() * 40 - 20),
                size: Math.random() * 4 + 2, // Varied size multiplier
                rotate: Math.random() * 60 - 30
            };
            setBangs(prev => [...prev, newBang]);
            setTimeout(() => setBangs(prev => prev.filter(b => b.id !== newBang.id)), 600);
            setQuoteIndex(prev => prev + 1);
            return;
        }

        // Guilt Gain con Multiplicador
        const baseGain = 10;
        const bonus = Math.floor(combo / 5);
        addGuilt(baseGain + bonus);
        setQuoteIndex(prev => prev + 1);
    };

    const handleSignContract = () => {
        setIsHeartbeating(true);
        // Secuencia de latidos simulada
        setTimeout(() => {
            setIsHeartbeating(false);
            signContract();
        }, 3000);
    };

    const currentQuote = isYoru
        ? YORU_QUOTES[quoteIndex % YORU_QUOTES.length]
        : ASA_QUOTES[quoteIndex % ASA_QUOTES.length];

    return (
        <motion.div
            animate={controls}
            className={`relative w-full max-w-2xl mx-auto ${isYoru ? "cursor-crosshair" : "cursor-default"}`}
        >
            {/* Heartbeat Overlay */}
            <AnimatePresence>
                {isHeartbeating && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.4, 0, 0.6, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="fixed inset-0 bg-red-900 z-[9999] pointer-events-none mix-blend-multiply"
                    />
                )}
            </AnimatePresence>

            {/* Damage Flash Overlay for Mobile */}
            <AnimatePresence>
                {showDamageFlash && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.4, 0] }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`fixed inset-0 z-[5000] pointer-events-none ${isYoru ? "bg-red-600/30" : "bg-black/10"}`}
                    />
                )}
            </AnimatePresence>

            {/* Combo Heat Effect on Card */}
            {combo > 5 && (
                <motion.div
                    className="absolute -inset-2 rounded-2xl opacity-40 blur-lg -z-10"
                    animate={{
                        backgroundColor: ["rgba(220, 20, 60, 0)", "rgba(220, 20, 60, 0.5)", "rgba(220, 20, 60, 0)"],
                        scale: [1, 1.05, 1]
                    }}
                    transition={{ repeat: Infinity, duration: 0.5 }}
                />
            )}

            <motion.div
                className={`relative z-0 rounded-2xl p-8 md:p-12 transition-all duration-700 ${isYoru
                    ? "bg-[#0A0A0A] border-4 border-[#8B0000] shadow-[0_0_60px_rgba(139,0,0,0.4)]"
                    : "bg-white/80 border border-[#1B263B]/15 shadow-lg"
                    }`}
                layout
            >
                {/* Combo Counter */}
                <AnimatePresence>
                    {combo > 1 && (
                        <motion.div
                            initial={{ scale: 0, opacity: 0, y: 20 }}
                            animate={{
                                scale: combo > 15 ? [1.2, 1.4, 1.2] : 1.2,
                                opacity: 1,
                                y: 0,
                                rotate: combo > 15 ? [0, -2, 2, 0] : 0
                            }}
                            exit={{ scale: 2, opacity: 0 }}
                            transition={{
                                rotate: { repeat: Infinity, duration: 0.1 },
                                scale: { repeat: Infinity, duration: 0.4 }
                            }}
                            className={`absolute -top-12 right-0 font-black text-4xl italic ${combo > 15 ? 'text-orange-500 drop-shadow-[0_0_15px_rgba(255,165,0,0.8)]' : 'text-[#DC143C]'}`}
                            style={{ fontFamily: "var(--font-creepster)" }}
                        >
                            {combo > 15 && (
                                <motion.div
                                    className="absolute inset-0 bg-orange-600/30 blur-xl rounded-full -z-10"
                                    animate={{ scale: [1, 1.5, 1] }}
                                    transition={{ repeat: Infinity, duration: 0.2 }}
                                />
                            )}
                            x{combo} {combo > 15 ? "FEVER!" : "COMBO!"}
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className={`mb-6 flex items-center gap-2 ${isYoru ? "text-[#DC143C]" : "text-[#1B263B]/40"}`}>
                    <span className="text-2xl">{isYoru ? "⚔" : "💭"}</span>
                    <span className="text-xs font-mono uppercase tracking-[0.3em]">
                        {isYoru ? "DEMONIO DE LA GUERRA CONTROLANDO" : "asa mitaka pensando..."}
                    </span>
                </div>

                <motion.blockquote
                    key={`${activePersona}-${quoteIndex}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`text-xl md:text-2xl leading-relaxed mb-8 ${isYoru ? "text-[#F5F5F0] font-bold" : "text-[#1B263B] italic"}`}
                    style={{ fontFamily: isYoru ? "var(--font-creepster)" : "var(--font-inter)" }}
                >
                    &ldquo;{currentQuote}&rdquo;
                </motion.blockquote>

                <div className="flex flex-col items-center gap-4">
                    {!isYoru && guilt === 100 ? (
                        <motion.button
                            onClick={handleSignContract}
                            className="px-10 py-6 text-2xl font-black rounded-none bg-black text-[#DC143C] border-4 border-[#DC143C] shadow-[10px_10px_0px_#DC143C] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all uppercase tracking-widest"
                            style={{ fontFamily: "var(--font-creepster)" }}
                            whileHover={{ scale: 1.05 }}
                        >
                            Firmar Contrato
                        </motion.button>
                    ) : (
                        <motion.button
                            onClick={handleGuiltClick}
                            className={`px-8 py-4 text-lg font-bold rounded-xl transition-all duration-300 ${isYoru
                                ? "bg-[#8B0000] text-[#F5F5F0] border-2 border-[#DC143C] shadow-[0_0_20px_rgba(220,20,60,0.4)]"
                                : "bg-[#1B263B] text-[#F5F5F0] border border-[#1B263B]"
                                }`}
                            whileHover={isYoru ? { scale: 1.05 } : { scale: 0.95 }}
                            whileTap={{ scale: 1.1 }}
                        >
                            {isYoru ? "BANG BANG BANG" : "Sentir Culpa (+20%)"}
                        </motion.button>
                    )}

                    <p className={`text-sm text-center ${isYoru ? "text-[#DC143C]/60" : "text-[#1B263B]/40"}`}>
                        {isYoru
                            ? "LA GUERRA HA COMENZADO."
                            : `Nivel de culpa: ${guilt}%`}
                    </p>
                </div>
            </motion.div>

            {/* BANG Texts */}
            <div className="fixed inset-0 pointer-events-none z-[13000]">
                {bangs.map(b => (
                    <motion.div
                        key={b.id}
                        initial={{ opacity: 1, scale: 0.5, rotate: b.rotate }}
                        animate={{ opacity: 0, scale: b.size, y: -150 }}
                        className="absolute font-black text-[#DC143C] drop-shadow-[0_0_10px_rgba(220,20,60,0.8)]"
                        style={{ left: b.x, top: b.y, fontFamily: "var(--font-creepster)", WebkitTextStroke: "1px white" }}
                    >
                        BANG
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
