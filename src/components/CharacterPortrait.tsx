"use client";

import { useGuiltState } from "@/context/GuiltContext";
import { motion, AnimatePresence, useAnimationControls, useMotionValue, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import { useState, useCallback, useRef } from "react";
import SeaFactBubble from "./SeaFactBubble";

// ============================================================
// CHARACTER PORTRAIT — REVELACIÓN SECUENCIAL ESTILO MANGA
// ============================================================

interface ImageSlide {
    src: string;
    alt: { es: string; en: string };
    title: { es: string; en: string };
    lore: { es: string; en: string };
    detail: { es: string; en: string };
    revealText: { es: string; en: string };
}

const YORU_SLIDES: ImageSlide[] = [
    {
        src: "/images/yoru1.jpg",
        alt: { es: "Las cicatrices cruzadas del War Devil", en: "The cross scars of the War Devil" },
        title: { es: "LA MARCA DE LA GUERRA", en: "THE MARK OF WAR" },
        lore: { es: "Las cicatrices cruzadas en su rostro son la firma del contrato demoníaco. Cada línea representa una guerra perdida, cada intersección un pacto sellado con sangre.", en: "The cross scars on her face are the signature of the demonic pact. Every line represents a lost war, every intersection a pact sealed with blood." },
        detail: { es: "War Devil • Demonio de la Guerra", en: "War Devil • The Devil of War" },
        revealText: { es: "REVELAR AL DEMONIO", en: "REVEAL THE DEVIL" },
    },
    {
        src: "/images/yoru2.jpg",
        alt: { es: "El rostro de Yoru", en: "Yoru's face" },
        title: { es: "EL ROSTRO DE LA GUERRA", en: "THE FACE OF WAR" },
        lore: { es: "Detrás de las cicatrices está ella. Yoru. El Demonio de la Guerra que eligió a la chica más sola del mundo. Esa sonrisa no es de felicidad — es de hambre.", en: "Behind the scars is her. Yoru. The War Devil that chose the loneliest girl in the world. That smile isn't happiness — it's hunger." },
        detail: { es: "「 Tu sufrimiento es mi fuerza. 」", en: "「 Your suffering is my strength. 」" },
        revealText: { es: "FORMA DEFINITIVA", en: "ULTIMATE FORM" },
    },
    {
        src: "/images/yoru3.jpg",
        alt: { es: "Yoru forma definitiva", en: "Yoru's ultimate form" },
        title: { es: "IDENTIDAD COMPLETA", en: "COMPLETE IDENTITY" },
        lore: { es: "Cuando la fusión es total, Asa deja de ser un huésped para convertirse en el arma definitiva. El Demonio de la Guerra posee su pasado y su potencial destructivo.", en: "When fusion is complete, Asa stops being a host to become the ultimate weapon. The War Devil possesses her past and destructive potential." },
        detail: { es: "Evolución Final • Posesión Absoluta", en: "Final Evolution • Absolute Possession" },
        revealText: { es: "", en: "" },
    },
];

const ASA_SLIDES: ImageSlide[] = [
    {
        src: "/images/asa1.jpg",
        alt: { es: "Asa Mitaka mirando por la ventana", en: "Asa Mitaka looking out of the window" },
        title: { es: "La chica de la ventana", en: "The girl at the window" },
        lore: { es: "Asa Mitaka pasa los recreos sola, no porque quiera, sino porque cada intento de hablar termina en un silencio incómodo que le dura horas en la cabeza.", en: "Asa Mitaka spends recess alone, not because she wants to, but because every attempt to talk ends in an awkward silence that haunts her head for hours." },
        detail: { es: "Asa Mitaka • Escuela Secundaria", en: "Asa Mitaka • High School" },
        revealText: { es: "Mirarla más de cerca...", en: "Look closer..." },
    },
    {
        src: "/images/asa2.jpg",
        alt: { es: "Los ojos de Asa", en: "Asa's eyes" },
        title: { es: "Lo que nadie ve", en: "What nobody sees" },
        lore: { es: "Si miras sus ojos el tiempo suficiente, puedes ver todo lo que esconde. El deseo de ser querida. La culpa por existir. Y algo más que la observa desde adentro.", en: "If you look into her eyes long enough, you can see everything she hides. The desire to be loved. The guilt of existing. And something else watching from inside." },
        detail: { es: "「 Solo quiero... que alguien me mire. 」", en: "「 I just want... someone to look at me. 」" },
        revealText: { es: "", en: "" },
    },
];

export default function CharacterPortrait() {
    const { activePersona, guilt, language } = useGuiltState();
    const isYoru = activePersona === "Yoru";
    const slides = isYoru ? YORU_SLIDES : ASA_SLIDES;

    // 3D TILT EFFECT
    const x = useMotionValue(200);
    const y = useMotionValue(200);
    const rotateX = useSpring(useTransform(y, [0, 400], [10, -10]), { stiffness: 150, damping: 20 });
    const rotateY = useSpring(useTransform(x, [0, 400], [-10, 10]), { stiffness: 150, damping: 20 });

    const handleMouse = (event: React.MouseEvent<HTMLDivElement>) => {
        const rect = event.currentTarget.getBoundingClientRect();
        x.set(event.clientX - rect.left);
        y.set(event.clientY - rect.top);
    };

    const handleMouseLeave = () => {
        x.set(200);
        y.set(200);
    };

    const breathingDuration = isYoru ? 0.6 : 3 - (guilt / 100) * 2.2;
    const jitterAmount = !isYoru && guilt > 60 ? (guilt - 60) / 10 : 0;

    const [currentSlide, setCurrentSlide] = useState(0);
    const [isRevealing, setIsRevealing] = useState(false);
    const shockControls = useAnimationControls();

    const prevPersona = useRef(activePersona);
    if (prevPersona.current !== activePersona) {
        prevPersona.current = activePersona;
        setCurrentSlide(0);
        setIsRevealing(false);
    }

    const currentData = slides[currentSlide] || slides[0];
    const hasNextSlide = currentSlide < slides.length - 1;

    const handleReveal = useCallback(async () => {
        setIsRevealing(true);
        if (isYoru) {
            await shockControls.start({
                x: [0, -20, 20, -10, 10, 0],
                rotate: [0, -2, 2, -1, 1, 0],
                transition: { duration: 0.4 }
            });
            setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1));
        } else {
            setCurrentSlide((prev) => (prev === 0 ? 1 : 0));
        }
        setIsRevealing(false);
    }, [isYoru, shockControls, slides.length]);

    const handleGoBack = useCallback(() => {
        setCurrentSlide((prev) => Math.max(prev - 1, 0));
    }, []);

    return (
        <div
            className="relative flex items-center justify-center p-4 md:p-8"
            onMouseMove={handleMouse}
            onMouseLeave={handleMouseLeave}
            style={{ perspective: "1000px" }}
        >
            <motion.div
                animate={{
                    scale: [1, 1.02, 1],
                }}
                transition={{
                    scale: { duration: breathingDuration, repeat: Infinity, ease: "easeInOut" },
                }}
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d"
                }}
                className={`
                    relative w-[85vw] max-w-[320px] md:max-w-[400px] aspect-[3/4] 
                    bg-white border-[6px] md:border-[10px] border-black 
                    shadow-[20px_20px_0px_rgba(0,0,0,1)]
                    overflow-hidden transition-all duration-700
                    ${isYoru ? "shadow-[20px_20px_0px_#DC143C] border-[#DC143C]" : ""}
                `}
            >
                {/* Images Layer */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`${activePersona}-${currentSlide}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0"
                    >
                        <Image
                            src={currentData.src}
                            alt={currentData.alt[language]}
                            fill
                            className="object-cover"
                            priority
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Info Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black via-black/40 to-transparent text-white pt-20">
                    <h3 className={`text-2xl font-black uppercase mb-1 ${isYoru ? 'text-[#DC143C]' : ''}`} style={{ fontFamily: isYoru ? 'var(--font-creepster)' : 'inherit' }}>
                        {currentData.title[language]}
                    </h3>
                    <p className="text-[10px] opacity-60 uppercase tracking-widest mb-3">{currentData.detail[language]}</p>
                    <p className="text-xs leading-relaxed opacity-80 italic">{currentData.lore[language]}</p>
                </div>

                {/* Navigation Buttons */}
                <div className="absolute bottom-6 right-6 flex gap-2">
                    {currentSlide > 0 && (
                        <button onClick={handleGoBack} className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center text-sm shadow-xl hover:scale-110 transition-transform">
                            ←
                        </button>
                    )}
                    {hasNextSlide && (
                        <button onClick={handleReveal} className={`px-4 h-10 rounded-full font-black text-xs uppercase tracking-tighter shadow-xl hover:scale-105 transition-transform ${isYoru ? 'bg-[#DC143C]' : 'bg-black'} text-white`}>
                            {currentData.revealText[language]}
                        </button>
                    )}
                </div>
            </motion.div>

            {/* Sea Fact Bubble */}
            {!isYoru && currentSlide === 0 && (
                <div className="absolute -right-8 top-1/4 hidden lg:block" style={{ transform: "translateZ(50px)" }}>
                    <SeaFactBubble visible={true} />
                </div>
            )}
        </div>
    );
}
