"use client";

import { useGuilt } from "@/context/GuiltContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const GHOST_MESSAGES_ASA = [
    "¿Ella puede vernos?",
    "No te sientas mal por ella...",
    "Solo es una chica normal.",
    "¿Por qué está tan sola?",
    "Dile que todo estará bien.",
    "No hagas clic más.",
    "El acuario estaba vacío."
];

const GHOST_MESSAGES_YORU = [
    "DAME MÁS CONTROL.",
    "FIRMALA.",
    "ELLA NO TE NECESITA.",
    "CONVIÉRTELO EN ARMA.",
    "TENGO HAMBRE.",
    "ME PERTENECE.",
    "MÁS GUERRA."
];

/**
 * GHOST CHAT — Resonancia Psicológica
 * 
 * Mensajes fantasmales que aparecen aleatoriamente en las esquinas.
 * Aumentan en frecuencia con el nivel de culpa.
 */
export default function GhostChat() {
    const { guilt, activePersona } = useGuilt();
    const isYoru = activePersona === "Yoru";
    const [messages, setMessages] = useState<{ id: number; text: string; x: string; y: string }[]>([]);

    useEffect(() => {
        if (guilt < 20 && !isYoru) return;

        const spawnRate = isYoru ? 1500 : 5000 - (guilt * 30);
        const interval = setInterval(() => {
            const pool = isYoru ? GHOST_MESSAGES_YORU : GHOST_MESSAGES_ASA;
            const newMessage = {
                id: Date.now(),
                text: pool[Math.floor(Math.random() * pool.length)],
                x: `${Math.random() * 80 + 10}%`,
                y: `${Math.random() * 80 + 10}%`,
            };
            setMessages(prev => [...prev, newMessage]);
            setTimeout(() => {
                setMessages(prev => prev.filter(m => m.id !== newMessage.id));
            }, 3000);
        }, Math.max(spawnRate, 800));

        return () => clearInterval(interval);
    }, [guilt, isYoru]);

    return (
        <div className="fixed inset-0 pointer-events-none z-[150] overflow-hidden">
            <AnimatePresence>
                {messages.map((m) => (
                    <motion.div
                        key={m.id}
                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                        animate={{ opacity: isYoru ? 0.4 : 0.15, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 1.2 }}
                        className={`absolute text-[10px] md:text-xs font-bold uppercase tracking-widest whitespace-nowrap
                            ${isYoru ? "text-[#DC143C]" : "text-[#1B263B]"}
                        `}
                        style={{ left: m.x, top: m.y, fontFamily: isYoru ? "var(--font-creepster)" : "inherit" }}
                    >
                        {m.text}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
