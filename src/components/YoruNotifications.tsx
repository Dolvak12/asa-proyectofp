"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useGuilt } from "@/context/GuiltContext";
import { TRANSLATIONS } from "@/constants/translations";

// ============================================================
// YORU NOTIFICATIONS — FALSAS ALERTAS DE SISTEMA
// ============================================================
// Simulan avisos de iOS/Android pero con mensajes de Yoru.
// ============================================================

export default function YoruNotifications() {
    const { activePersona, guilt, language } = useGuilt();
    const isYoru = activePersona === "Yoru";
    const [currentAlert, setCurrentAlert] = useState<string | null>(null);
    const t = TRANSLATIONS;
    const YORU_ALERTS = t["yoru_alerts"][language];

    useEffect(() => {
        if (!isYoru && guilt < 50) return;

        let timeoutId: NodeJS.Timeout;

        const interval = setInterval(() => {
            // Probabilidad de mostrar alerta cada ciclo
            if (Math.random() > 0.7) {
                const randomAlert = YORU_ALERTS[Math.floor(Math.random() * YORU_ALERTS.length)];
                setCurrentAlert(randomAlert);

                if (timeoutId) clearTimeout(timeoutId);
                timeoutId = setTimeout(() => setCurrentAlert(null), 5000);
            }
        }, 10000); // Intenta cada 10 segundos

        return () => {
            clearInterval(interval);
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [isYoru, guilt]);

    return (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[200] w-[90%] max-w-sm pointer-events-none">
            <AnimatePresence>
                {currentAlert && (
                    <motion.div
                        initial={{ opacity: 0, y: -50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, y: -20 }}
                        className={`
                            p-4 rounded-2xl shadow-2xl border backdrop-blur-md pointer-events-auto
                            ${isYoru
                                ? "bg-red-950/80 border-red-500/50 text-red-50"
                                : "bg-white/80 border-black/10 text-black"}
                        `}
                    >
                        <div className="flex items-start gap-4">
                            <div className={`
                                w-10 h-10 rounded-xl flex items-center justify-center text-lg
                                ${isYoru ? "bg-red-600 text-white" : "bg-black text-white"}
                            `}>
                                {isYoru ? "⚔" : "⚠"}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">
                                        {language === "es" ? "Sistema de Control" : "Control System"}
                                    </span>
                                    <span className="text-[10px] opacity-30 italic">{language === "es" ? "ahora" : "now"}</span>
                                </div>
                                <p className="text-sm font-medium leading-snug">
                                    {currentAlert}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
