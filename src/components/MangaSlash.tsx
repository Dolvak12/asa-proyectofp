"use client";

import { useGuiltState, useGuiltActions } from "@/context/GuiltContext";
import { TRANSLATIONS } from "@/constants/translations";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

/**
 * MangaSlash — Cinematic Transition Component
 * 
 * Performs a white flash and a dramatic diagonal red/black slash
 * across the screen to signify a personality shift or major event.
 */
export default function MangaSlash() {
    const { isTransitioning, activePersona, language } = useGuiltState();
    const { playSlash } = useGuiltActions();
    const isYoru = activePersona === "Yoru";
    const t = TRANSLATIONS;

    useEffect(() => {
        if (isTransitioning) {
            playSlash();
        }
    }, [isTransitioning, playSlash]);

    return (
        <AnimatePresence>
            {isTransitioning && (
                <div className="fixed inset-0 z-[100000] pointer-events-none overflow-hidden">
                    {/* 1. INITIAL WHITE FLASH */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0.8, 0] }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4, times: [0, 0.2, 0.8, 1] }}
                        className="absolute inset-0 bg-white"
                    />

                    {/* 2. THE DIAGONAL SLASH (Red/Black) */}
                    <motion.div
                        initial={{ x: "-100%", y: "100%", rotate: -45, scaleY: 0 }}
                        animate={{
                            x: "100%",
                            y: "-100%",
                            scaleY: [0, 1.5, 0],
                        }}
                        transition={{
                            duration: 0.5,
                            ease: "circIn",
                            times: [0, 0.5, 1]
                        }}
                        className={`absolute top-1/2 left-0 w-[200%] h-32 origin-center -translate-y-1/2 
                            ${isYoru ? "bg-[#DC143C]" : "bg-black"} 
                            shadow-[0_0_50px_rgba(220,20,60,0.8)]`}
                    />

                    {/* 3. SECONDARY SLASH (Opposite direction) */}
                    <motion.div
                        initial={{ x: "100%", y: "100%", rotate: 45, scaleY: 0 }}
                        animate={{
                            x: "-100%",
                            y: "-100%",
                            scaleY: [0, 1.2, 0],
                        }}
                        transition={{
                            duration: 0.5,
                            delay: 0.1,
                            ease: "circIn",
                            times: [0, 0.5, 1]
                        }}
                        className={`absolute top-1/2 right-0 w-[200%] h-24 origin-center -translate-y-1/2 
                            ${isYoru ? "bg-[#8B0000]" : "bg-[#1B263B]"} 
                            shadow-[0_0_30px_rgba(0,0,0,0.5)]`}
                    />

                    {/* 4. ONOMATOPOEIA (SHINK!) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1.5, 1.6, 2] }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                        className="absolute inset-0 flex items-center justify-center font-black italic text-white text-6xl md:text-8xl drop-shadow-[0_0_20px_rgba(0,0,0,1)]"
                        style={{ fontFamily: "var(--font-creepster)" }}
                    >
                        {isYoru ? t["slash.yoru"][language] : t["slash.asa"][language]}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
