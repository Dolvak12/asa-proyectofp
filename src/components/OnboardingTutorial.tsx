"use client";

import { useGuiltActions } from "@/context/GuiltContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const CONTENT = {
    es: {
        label: "Entrada de Diario Fragmentada",
        p1: "Si estás leyendo esto, lograste entrar a mi mente. Soy Asa Mitaka.",
        p2: "No sé cuánto tiempo más pueda mantener el control. Comparto mi cabeza con un demonio de la guerra. Ella se alimenta de lo peor de mí: ",
        p2_bold: "mi culpa",
        p3: "Hay un medidor en la parte superior...",
        p4: "Por favor, pase lo que pase, no dejes que llegue a 100. Si ella toma el control total, no habrá forma de regresar. Ten cuidado con lo que tocas.",
        button: "Entendido, no la liberaré"
    },
    en: {
        label: "Fragmented Diary Entry",
        p1: "If you are reading this, you managed to enter my mind. I am Asa Mitaka.",
        p2: "I don't know how much longer I can keep control. I share my head with a War Devil. She feeds on the worst part of me: ",
        p2_bold: "my guilt",
        p3: "There is a meter at the top...",
        p4: "Please, whatever happens, do not let it reach 100. If she takes total control, there will be no coming back. Be careful with what you touch.",
        button: "Understood, I won't release her"
    }
};

export default function OnboardingTutorial() {
    const { initAudio, addGuilt, signContract, setGlobalLanguage } = useGuiltActions();

    const [isMounted, setIsMounted] = useState(false);
    const [isAccepted, setIsAccepted] = useState(false);

    // 0 = Select Language | 1 = Letter
    const [step, setStep] = useState<0 | 1>(0);
    const [language, setLanguage] = useState<"es" | "en">("es");

    useEffect(() => {
        // Reloj de Sangre: Si es entre 12:00 AM y 4:00 AM, Yoru despierta inmediatamente
        const hour = new Date().getHours();
        if (hour >= 0 && hour < 4) {
            addGuilt(100);
            signContract();
            setIsAccepted(true);
            setIsMounted(true);
            return;
        }

        // Usamos localStorage para no repetir el tutorial
        const hasSeenIntro = localStorage.getItem("glt_intro_seen");
        const savedLang = localStorage.getItem("glt_lang");

        if (savedLang) {
            setLanguage(savedLang as "es" | "en");
            setStep(1); // Skip to letter if we already know language
        }

        if (hasSeenIntro) {
            setIsAccepted(true);
        }
        setIsMounted(true);
    }, [addGuilt, signContract]);

    const handleSelectLanguage = (lang: "es" | "en") => {
        setLanguage(lang);
        setGlobalLanguage(lang);
        setStep(1);
    };

    const handleAcceptance = () => {
        initAudio(); // Inicializa el sonido vital
        localStorage.setItem("glt_intro_seen", "true");
        setIsAccepted(true);
    };

    if (!isMounted || isAccepted) return null;

    const t = CONTENT[language];

    return (
        <AnimatePresence mode="wait">
            {!isAccepted && (
                <motion.div
                    key="overlay"
                    className="fixed inset-0 z-[999999] flex items-center justify-center p-6 bg-[#050505]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                >
                    {/* Ruido Fino Básico en el fondo */}
                    <div className="absolute inset-0 opacity-10 mix-blend-screen pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')]"></div>

                    {step === 0 ? (
                        // LANGUAGE SELECTION
                        <motion.div
                            key="language-selector"
                            className="relative max-w-sm w-full p-8 rounded-lg bg-[#EAE8E3] text-[#1B263B] shadow-[0_0_100px_rgba(255,255,255,0.05)] border border-[#1B263B]/20 text-center"
                            style={{ backgroundImage: "radial-gradient(circle at center, #F5F5F0 0%, #DEDCD6 100%)" }}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            <h2 className="text-sm font-black uppercase tracking-[0.3em] mb-8 border-b border-[#1B263B]/20 pb-4">
                                Select Language /<br />Selecciona Idioma
                            </h2>
                            <div className="flex flex-col gap-4">
                                <motion.button
                                    onClick={() => handleSelectLanguage("en")}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-6 py-4 bg-[#1B263B] text-white text-xs uppercase font-bold tracking-widest hover:bg-black transition-colors"
                                >
                                    English
                                </motion.button>
                                <motion.button
                                    onClick={() => handleSelectLanguage("es")}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-6 py-4 bg-[#1B263B] text-white text-xs uppercase font-bold tracking-widest hover:bg-black transition-colors"
                                >
                                    Español
                                </motion.button>
                            </div>
                        </motion.div>
                    ) : (
                        // THE LETTER
                        <motion.div
                            key="the-letter"
                            className="relative max-w-lg w-full p-8 md:p-12 rounded-lg bg-[#EAE8E3] text-[#1B263B] shadow-[0_0_100px_rgba(255,255,255,0.05)] border border-[#1B263B]/20"
                            style={{
                                backgroundImage: "radial-gradient(circle at center, #F5F5F0 0%, #DEDCD6 100%)",
                                boxShadow: "inset 0 0 40px rgba(0,0,0,0.1), 0 20px 50px rgba(0,0,0,0.5)"
                            }}
                            initial={{ y: 50, rotateX: 10, opacity: 0 }}
                            animate={{ y: 0, rotateX: 0, opacity: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        >
                            {/* Cinta falsa arriba */}
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-6 bg-white/40 shadow-sm rotate-2"></div>

                            <p className="text-[10px] uppercase font-bold tracking-[0.3em] mb-8 opacity-40 border-b border-[#1B263B]/20 pb-2">
                                {t.label}
                            </p>

                            <div className="space-y-6 text-sm md:text-base leading-loose" style={{ fontFamily: "var(--font-inter)" }}>
                                <p>{t.p1}</p>
                                <p>
                                    {t.p2}<strong className="font-bold border-b border-red-500/30">{t.p2_bold}</strong>.
                                </p>
                                <p className="italic opacity-80">{t.p3}</p>
                                <p>{t.p4}</p>
                            </div>

                            <div className="mt-12 flex justify-center">
                                <motion.button
                                    onClick={handleAcceptance}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-8 py-3 bg-[#1B263B] text-white text-xs uppercase font-bold tracking-widest hover:bg-black transition-colors"
                                >
                                    {t.button}
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
