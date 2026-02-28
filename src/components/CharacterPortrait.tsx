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
    alt: string;
    title: string;
    lore: string;
    detail: string;
    revealText: string;
}

const YORU_SLIDES: ImageSlide[] = [
    {
        src: "/images/yoru1.jpg",
        alt: "Las cicatrices cruzadas del War Devil",
        title: "LA MARCA DE LA GUERRA",
        lore: "Las cicatrices cruzadas en su rostro son la firma del contrato demoníaco. Cada línea representa una guerra perdida, cada intersección un pacto sellado con sangre.",
        detail: "War Devil • Demonio de la Guerra",
        revealText: "REVELAR AL DEMONIO",
    },
    {
        src: "/images/yoru2.jpg",
        alt: "El rostro de Yoru",
        title: "EL ROSTRO DE LA GUERRA",
        lore: "Detrás de las cicatrices está ella. Yoru. El Demonio de la Guerra que eligió a la chica más sola del mundo. Esa sonrisa no es de felicidad — es de hambre.",
        detail: "「 Tu sufrimiento es mi fuerza. 」",
        revealText: "FORMA DEFINITIVA",
    },
    {
        src: "/images/yoru3.jpg",
        alt: "Yoru forma definitiva",
        title: "IDENTIDAD COMPLETA",
        lore: "Cuando la fusión es total, Asa deja de ser un huésped para convertirse en el arma definitiva. El Demonio de la Guerra posee su pasado y su potencial destructivo.",
        detail: "Evolución Final • Posesión Absoluta",
        revealText: "",
    },
];

const ASA_SLIDES: ImageSlide[] = [
    {
        src: "/images/asa1.jpg",
        alt: "Asa Mitaka mirando por la ventana",
        title: "La chica de la ventana",
        lore: "Asa Mitaka pasa los recreos sola, no porque quiera, sino porque cada intento de hablar termina en un silencio incómodo que le dura horas en la cabeza.",
        detail: "Asa Mitaka • Escuela Secundaria",
        revealText: "Mirarla más de cerca...",
    },
    {
        src: "/images/asa2.jpg",
        alt: "Los ojos de Asa",
        title: "Lo que nadie ve",
        lore: "Si miras sus ojos el tiempo suficiente, puedes ver todo lo que esconde. El deseo de ser querida. La culpa por existir. Y algo más que la observa desde adentro.",
        detail: "「 Solo quiero... que alguien me mire. 」",
        revealText: "",
    },
];

export default function CharacterPortrait() {
    const { activePersona, guilt } = useGuiltState();
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

    const currentData = slides[currentSlide];
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
                    relative w-full max-w-[400px] aspect-[3/4] 
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
                            alt={currentData.alt}
                            fill
                            className="object-cover"
                            priority
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Info Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black via-black/40 to-transparent text-white pt-20">
                    <h3 className={`text-2xl font-black uppercase mb-1 ${isYoru ? 'text-[#DC143C]' : ''}`} style={{ fontFamily: isYoru ? 'var(--font-creepster)' : 'inherit' }}>
                        {currentData.title}
                    </h3>
                    <p className="text-[10px] opacity-60 uppercase tracking-widest mb-3">{currentData.detail}</p>
                    <p className="text-xs leading-relaxed opacity-80 italic">{currentData.lore}</p>
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
                            {currentData.revealText}
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
