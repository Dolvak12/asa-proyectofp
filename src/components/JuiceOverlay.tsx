"use client";

import { useGuilt } from "@/context/GuiltContext";
import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";

// ============================================================
// JUICE OVERLAY — Feedback visual adictivo (Estilo TikTok)
// ============================================================
// Este componente crea partículas en el punto de clic/toque:
// - Asa: Burbujas suaves y azules (calma/evasión).
// - Yoru: Fragmentos rojos y agresivos (guerra/violencia).
// ============================================================

interface Particle {
    id: number;
    x: number;
    y: number;
    size: number;
    color: string;
    angle: number;
    velocity: number;
    type?: "bubble" | "slash" | "blood" | "splatter";
}

export default function JuiceOverlay() {
    const { activePersona, combo } = useGuilt();
    const isYoru = activePersona === "Yoru";
    const [particles, setParticles] = useState<Particle[]>([]);

    const spawnParticles = useCallback((x: number, y: number) => {
        const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;
        const comboBonus = Math.floor(combo / 2);
        const count = (isYoru ? 8 : (isMobile ? 12 : 6)) + comboBonus;
        const newParticles: Particle[] = [];

        for (let i = 0; i < count; i++) {
            newParticles.push({
                id: Math.random() + i,
                x,
                y,
                size: isYoru ? Math.random() * 6 + 2 : Math.random() * 6 + 2,
                color: isYoru ? (Math.random() > 0.5 ? "#DC143C" : "#8B0000") : "#1B263B",
                angle: isYoru ? (i % 2 === 0 ? 0.2 : -0.2) + Math.PI : Math.random() * Math.PI * 2,
                velocity: (Math.random() * 4 + 2) + (combo / 10),
                type: isYoru ? (Math.random() > 0.8 ? "splatter" : "slash") : "bubble"
            });
        }

        setParticles(prev => [...prev, ...newParticles].slice(-60));

        setTimeout(() => {
            setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
        }, 600);
    }, [isYoru, combo]);

    // Blood drips at high combo
    useEffect(() => {
        if (!isYoru || combo < 5) return;

        const dripInterval = setInterval(() => {
            const newDrip: Particle = {
                id: Math.random(),
                x: Math.random() * window.innerWidth,
                y: -20,
                size: Math.random() * 4 + 2,
                color: "#8B0000",
                angle: Math.PI / 2,
                velocity: Math.random() * 2 + 1,
                type: "blood"
            };
            setParticles(prev => [...prev, newDrip].slice(-60));
            setTimeout(() => {
                setParticles(prev => prev.filter(p => p.id !== newDrip.id));
            }, 2000);
        }, 300);

        return () => clearInterval(dripInterval);
    }, [isYoru, combo]);

    useEffect(() => {
        const handleGlobalClick = (e: MouseEvent) => {
            spawnParticles(e.clientX, e.clientY);
        };

        const handleGlobalTouch = (e: TouchEvent) => {
            if (e.touches.length > 0) {
                spawnParticles(e.touches[0].clientX, e.touches[0].clientY);
            }
        };

        window.addEventListener("mousedown", handleGlobalClick);
        window.addEventListener("touchstart", handleGlobalTouch);

        return () => {
            window.removeEventListener("mousedown", handleGlobalClick);
            window.removeEventListener("touchstart", handleGlobalTouch);
        };
    }, [spawnParticles]);

    return (
        <div className="fixed inset-0 z-[11000] pointer-events-none overflow-hidden touch-none">
            <AnimatePresence>
                {particles.map(p => (
                    <motion.div
                        key={p.id}
                        initial={{
                            x: p.x,
                            y: p.y,
                            scale: 1,
                            opacity: 1,
                            width: p.type === "slash" ? p.size * 25 : p.type === "splatter" ? p.size * 15 : p.size,
                            height: p.type === "slash" ? 2 : p.type === "splatter" ? p.size * 15 : p.type === "blood" ? p.size * 2 : p.size,
                            rotate: (p.type === "slash" || p.type === "splatter") ? p.angle * 180 / Math.PI : 0
                        }}
                        animate={{
                            x: p.type === "blood" ? p.x : p.x + Math.cos(p.angle) * p.velocity * 80,
                            y: p.type === "blood" ? window.innerHeight + 20 : p.y + Math.sin(p.angle) * p.velocity * 80,
                            scale: p.type === "slash" ? [1, 1.5, 0] : 0,
                            opacity: 0,
                        }}
                        transition={{
                            duration: p.type === "blood" ? 2 : 0.5,
                            ease: p.type === "blood" ? "linear" : "easeOut"
                        }}
                        className="absolute"
                        style={{
                            backgroundColor: p.color,
                            borderRadius: (p.type === "slash" || p.type === "blood") ? "2px" : "50%",
                            boxShadow: isYoru ? `0 0 15px ${p.color}` : "none",
                            filter: isYoru ? "blur(1px)" : "none"
                        }}
                    />
                ))}
            </AnimatePresence>

            {/* Screen edge feedback on click/combo */}
            <motion.div
                className="absolute inset-0 border-[20px] transition-colors"
                initial={{ opacity: 0 }}
                animate={particles.length > 0 ? { opacity: [0, isYoru ? 0.2 : 0.1, 0] } : {}}
                style={{
                    borderColor: isYoru ? (combo > 15 ? "#FF0000" : combo > 5 ? "#DC143C" : "#8B0000") : "transparent",
                    mixBlendMode: "overlay",
                    filter: combo > 15 ? "blur(20px)" : "blur(5px)",
                    boxShadow: combo > 15 ? "inset 0 0 100px rgba(220,20,60,0.8)" : "none"
                }}
            />

            {/* War Distortion (Fever Mode) */}
            {isYoru && combo > 15 && (
                <motion.div
                    className="absolute inset-0 pointer-events-none z-[-1]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.4, 0.2, 0.5, 0] }}
                    transition={{ repeat: Infinity, duration: 0.1 }}
                    style={{
                        background: "radial-gradient(circle, transparent 30%, rgba(139, 0, 0, 0.3) 100%)",
                        backdropFilter: "contrast(150%) brightness(120%) hue-rotate(-10deg)"
                    }}
                />
            )}
        </div>
    );
}
