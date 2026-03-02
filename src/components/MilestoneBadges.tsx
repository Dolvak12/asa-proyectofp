"use client";

import { useGuilt } from "@/context/GuiltContext";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const MILESTONES = [
    { threshold: 20, label: "Socialmente Ansiosa", color: "#1B263B", detail: "LOGRO" },
    { threshold: 30, label: "Diario Desbloqueado", color: "#1B263B", detail: "NUEVO" },
    { threshold: 50, label: "Anfitriona de la Guerra", color: "#8B0000", detail: "LOGRO" },
    { threshold: 80, label: "Inestabilidad Total", color: "#DC143C", detail: "PELIGRO" },
    { threshold: 100, label: "Yoru Ascendente", color: "#000000", detail: "CONTRATO" },
];

export default function MilestoneBadges() {
    const { guilt, activePersona } = useGuilt();
    const [currentBadge, setCurrentBadge] = useState<{ label: string; detail: string } | null>(null);
    const [achieved, setAchieved] = useState<string[]>([]);

    // Limpiar al reset de culpa
    useEffect(() => {
        if (guilt === 0) {
            setAchieved([]);
            setCurrentBadge(null);
        }
    }, [guilt]);

    useEffect(() => {
        const milestone = MILESTONES.find(m => guilt >= m.threshold && !achieved.includes(m.label));

        if (milestone) {
            setAchieved(prev => [...prev, milestone.label]);
            setCurrentBadge({ label: milestone.label, detail: milestone.detail });

            const timer = setTimeout(() => setCurrentBadge(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [guilt, achieved]);

    // Alerta especial cuando Yoru se activa
    useEffect(() => {
        if (activePersona === "Yoru" && guilt > 0 && !achieved.includes("ARMERÍA")) {
            setAchieved(prev => [...prev, "ARMERÍA"]);
            setCurrentBadge({ label: "Armería de Guerra", detail: "DESBLOQUEADA" });

            const timer = setTimeout(() => setCurrentBadge(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [activePersona, achieved, guilt]);


    return (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] pointer-events-none">
            <AnimatePresence mode="wait">
                {currentBadge && (
                    <motion.div
                        key={currentBadge.label}
                        initial={{ opacity: 0, x: -100, rotate: -5, scale: 0.5 }}
                        animate={{
                            opacity: 1,
                            x: [0, -10, 10, -10, 10, 0],
                            rotate: 0,
                            scale: 1
                        }}
                        exit={{ opacity: 0, x: 100, rotate: 5, scale: 1.5, filter: "brightness(2)" }}
                        transition={{
                            x: { duration: 0.4, ease: "easeInOut" },
                            opacity: { duration: 0.3 },
                            scale: { duration: 0.3 }
                        }}
                        className="relative"
                    >
                        {/* Onomatopoeia background */}
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: [1, 1.2, 1], opacity: [0, 1, 0] }}
                            transition={{ duration: 0.4 }}
                            className="absolute -top-12 -left-12 text-5xl font-black text-[#DC143C] italic"
                            style={{ fontFamily: "var(--font-creepster)", WebkitTextStroke: "2px black" }}
                        >
                            SHING!
                        </motion.div>

                        {/* Manga Style Badge */}
                        <div className="bg-black border-[4px] border-white shadow-[8px_8px_0px_rgba(220,20,60,1)] p-1 transform skew-x-[-10deg]">
                            <div className="bg-[#DC143C] px-6 py-2 border-[2px] border-black flex items-center gap-4">
                                <div className="w-10 h-10 border-2 border-black bg-white flex items-center justify-center transform rotate-45 overflow-hidden">
                                    <div className="w-full h-full bg-black flex items-center justify-center transform -rotate-45">
                                        <span className="text-white text-xl">⚔</span>
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 leading-none mb-1">
                                        {currentBadge.detail}
                                    </span>
                                    <span className="text-lg md:text-xl font-black uppercase tracking-tighter text-white" style={{ fontFamily: "var(--font-creepster)" }}>
                                        {currentBadge.label}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Shine Effect Overlay */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none skew-x-[-10deg]"
                            animate={{ x: ["-100%", "200%"] }}
                            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1, ease: "easeInOut" }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Global Flash Effect on Milestone */}
            <AnimatePresence>
                {currentBadge && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.4, 0] }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="fixed inset-0 z-[5000] pointer-events-none bg-white"
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
