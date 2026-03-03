"use client";

import { useGuilt } from "@/context/GuiltContext";
import { TRANSLATIONS } from "@/constants/translations";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

// ============================================================
// INTERNAL MONOLOGUE — Los pensamientos fantasmales de Asa
// ============================================================
// Textos de baja opacidad que flotan en el fondo, mostrando
// lo que Asa realmente piensa pero no se atreve a decir.
// ============================================================

interface FloatingThought {
    id: number;
    text: string;
    x: number;
    y: number;
    duration: number;
}

export default function InternalMonologue() {
    const { activePersona, language } = useGuilt();
    const isAsa = activePersona === "Asa";
    const [activeThoughts, setActiveThoughts] = useState<FloatingThought[]>([]);
    const t = TRANSLATIONS;
    const THOUGHTS = t["thoughts"][language];

    useEffect(() => {
        if (!isAsa) {
            setActiveThoughts([]);
            return;
        }

        const interval = setInterval(() => {
            const newThought = {
                id: Date.now() + Math.random(),
                text: THOUGHTS[Math.floor(Math.random() * THOUGHTS.length)],
                x: Math.random() * 80 + 10, // 10% to 90%
                y: Math.random() * 80 + 10,
                duration: Math.random() * 5 + 5,
            };

            setActiveThoughts(prev => [...prev, newThought].slice(-5));
        }, 4000);

        return () => clearInterval(interval);
    }, [isAsa]);

    return (
        <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
            <AnimatePresence>
                {isAsa && activeThoughts.map(thought => (
                    <motion.div
                        key={thought.id}
                        initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                        animate={{
                            opacity: [0, 0.15, 0],
                            scale: [0.9, 1.1, 0.9],
                            filter: ["blur(5px)", "blur(2px)", "blur(5px)"],
                            y: [0, -40, -80]
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: thought.duration, ease: "easeInOut" }}
                        className="absolute text-center select-none"
                        style={{
                            left: `${thought.x}%`,
                            top: `${thought.y}%`,
                            width: "200px"
                        }}
                    >
                        <p className="text-[#1B263B] font-light italic text-xs md:text-sm tracking-wide">
                            {thought.text}
                        </p>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
