"use client";

import { useGuilt } from "@/context/GuiltContext";
import { TRANSLATIONS } from "@/constants/translations";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ============================================================
// MANGA HAPTICS — VISUAL ONOMATOPOEIAS (Estilo Shonen)
// ============================================================
// Este componente añade feedback visual de "sonido" escrito.
// - Asa: Onomatopeyas temblorosas, pequeñas, en Hiragana.
// - Yoru: Onomatopeyas afiladas, grandes, violentas, en Katakana.
// ============================================================

interface Onomatopoeia {
    id: number;
    text: string;
    x: number;
    y: number;
    rotate: number;
    scale: number;
}

export default function MangaHaptics() {
    const { activePersona, combo, language } = useGuilt();
    const isYoru = activePersona === "Yoru";
    const [sounds, setSounds] = useState<Onomatopoeia[]>([]);
    const [showFlash, setShowFlash] = useState(false);
    const t = TRANSLATIONS;
    const ASA_SOUNDS = t["haptics.asa"][language];
    const YORU_SOUNDS = t["haptics.yoru"][language];

    const spawnSound = useCallback((x: number, y: number) => {
        const pool = isYoru ? YORU_SOUNDS : ASA_SOUNDS;
        const text = pool[Math.floor(Math.random() * pool.length)];

        const newSound: Onomatopoeia = {
            id: Date.now() + Math.random(),
            text,
            x,
            y: y - 40,
            rotate: Math.random() * 40 - 20,
            scale: isYoru ? 1.2 + (combo / 10) : 0.8 + (combo / 20),
        };

        setSounds(prev => [...prev, newSound].slice(-10));

        // Trigger Manga Flash on high combo
        if (combo > 5) {
            setShowFlash(true);
            setTimeout(() => setShowFlash(false), 50);
        }

        setTimeout(() => {
            setSounds(prev => prev.filter(s => s.id !== newSound.id));
        }, 800);
    }, [isYoru, combo]);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => spawnSound(e.clientX, e.clientY);
        const handleTouch = (e: TouchEvent) => {
            if (e.touches.length > 0) {
                spawnSound(e.touches[0].clientX, e.touches[0].clientY);
            }
        };

        window.addEventListener("mousedown", handleClick);
        window.addEventListener("touchstart", handleTouch);

        return () => {
            window.removeEventListener("mousedown", handleClick);
            window.removeEventListener("touchstart", handleTouch);
        };
    }, [spawnSound]);

    return (
        <div className="fixed inset-0 z-[12000] pointer-events-none overflow-hidden touch-none">
            <AnimatePresence>
                {sounds.map(s => (
                    <motion.div
                        key={s.id}
                        initial={{ opacity: 0, scale: 0.5, x: s.x, y: s.y, rotate: s.rotate }}
                        animate={{
                            opacity: [0, 1, 0],
                            scale: [s.scale * 0.8, s.scale * 1.2, s.scale],
                            y: s.y - 60
                        }}
                        exit={{ opacity: 0, scale: 1.5, filter: "blur(10px)" }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className={`absolute font-black italic select-none drop-shadow-md`}
                        style={{
                            fontFamily: isYoru ? "var(--font-creepster)" : "var(--font-inter)",
                            color: isYoru ? "#DC143C" : "#1B263B",
                            fontSize: isYoru ? "2.5rem" : "1.2rem",
                            WebkitTextStroke: isYoru ? "2px white" : "none",
                            left: 0,
                            top: 0,
                            transform: `translate(${s.x}px, ${s.y}px)`
                        }}
                    >
                        {s.text}
                    </motion.div>
                ))}
            </AnimatePresence>

            {/* Manga Flash Overlay */}
            <AnimatePresence>
                {showFlash && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.3 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-white z-[20000]"
                    />
                )}
            </AnimatePresence>

        </div>
    );
}
