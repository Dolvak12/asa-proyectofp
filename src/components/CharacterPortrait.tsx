"use client";

import { useGuilt, useGuiltState } from "@/context/GuiltContext";
import { motion, AnimatePresence, useAnimationControls } from "framer-motion";
import Image from "next/image";
import { useState, useCallback } from "react";
import SeaFactBubble from "./SeaFactBubble";

// ============================================================
// CHARACTER PORTRAIT — REVELACIÓN SECUENCIAL ESTILO MANGA
// ============================================================
// Las imágenes NO se muestran juntas. Se revelan UNA POR UNA,
// como paneles de manga que el lector descubre al pasar página.
//
// YORU: Primero la CICATRIZ (close-up de la marca de guerra),
// luego su ROSTRO completo como un SHOCK — la página se "rompe"
// con un efecto de fractura visual. Como abrir los ojos y ver
// al demonio mirándote directamente.
//
// ASA: Primero su mirada perdida por la ventana (soledad),
// luego el close-up de sus ojos azules — un momento íntimo
// donde por un segundo puedes ver lo que realmente siente.
//
// Cada imagen viene acompañada de LORE del personaje:
// datos que hacen a los fans sentirse más cerca del canon.
// ============================================================

// ---- DATOS DE LORE PARA CADA IMAGEN ----

interface ImageSlide {
    src: string;
    alt: string;
    title: string;
    lore: string;
    detail: string;
    revealText: string; // Texto del botón para revelar la siguiente
}

/** Yoru — El Demonio de la Guerra.
 * Jerarquía: PRIMERA. Yoru siempre domina. La guerra viene antes. */
const YORU_SLIDES: ImageSlide[] = [
    {
        src: "/images/yoru1.jpg",
        alt: "Las cicatrices cruzadas del War Devil — la marca de la guerra grabada en carne",
        title: "LA MARCA DE LA GUERRA",
        lore: "Las cicatrices cruzadas en su rostro son la firma del contrato demoníaco. Cada línea representa una guerra perdida, cada intersección un pacto sellado con sangre. No son heridas — son trofeos.",
        detail: "War Devil • Demonio de la Guerra • Chainsaw Man Part 2",
        revealText: "REVELAR AL DEMONIO",
    },
    {
        src: "/images/yoru2.jpg",
        alt: "El rostro de Yoru — sonrisa depredadora y ojos espirales dorados",
        title: "EL ROSTRO DE LA GUERRA",
        lore: "Detrás de las cicatrices está ella. Yoru. El Demonio de la Guerra que eligió a la chica más sola del mundo como su anfitriona. Esa sonrisa no es de felicidad — es de hambre. Cada momento de debilidad de Asa es un festín para ella.",
        detail: "「 Tu sufrimiento es mi fuerza. Tu soledad, mi campo de batalla. 」",
        revealText: "FORMA DEFINITIVA",
    },
    {
        src: "/images/yoru3.jpg",
        alt: "Yoru en su forma definitiva — la encarnación del conflicto",
        title: "IDENTIDAD COMPLETA",
        lore: "Cuando la fusión es total, Asa deja de ser un huésped para convertirse en el arma definitiva. El Demonio de la Guerra no solo posee su cuerpo, posee su pasado, sus miedos y su potencial destructivo. Esta es la visión que aterra incluso a los demonios más fuertes.",
        detail: "Evolución Final • Posesión Absoluta",
        revealText: "",
    },
];

/** Asa — La Huésped Humana.
 * Jerarquía: SEGUNDA. Asa siempre va después. El trauma la acalla. */
const ASA_SLIDES: ImageSlide[] = [
    {
        src: "/images/asa1.jpg",
        alt: "Asa Mitaka mirando por la ventana — la soledad de quien no sabe conectar",
        title: "La chica de la ventana",
        lore: "Siempre mirando hacia afuera. Nunca participando. Asa Mitaka pasa los recreos sola, no porque quiera, sino porque cada intento de hablar con alguien termina en un silencio incómodo que le dura horas en la cabeza.",
        detail: "Asa Mitaka • Cuarta Escuela Secundaria Oriental",
        revealText: "Mirarla más de cerca...",
    },
    {
        src: "/images/asa2.jpg",
        alt: "Los ojos azules de Asa — profundos, tristes, buscando ser entendidos",
        title: "Lo que nadie ve",
        lore: "Si miras sus ojos el tiempo suficiente, puedes ver todo lo que esconde detrás de su indiferencia. El deseo desesperado de ser querida. La culpa por existir. Y algo más, algo oscuro que ella no controla... algo que la observa desde adentro.",
        detail: "「 Solo quiero... que alguien me mire sin que yo tenga que mirar primero. 」",
        revealText: "", // Final slide
    },
];

export default function CharacterPortrait() {
    const { activePersona, guilt } = useGuiltState();
    const isYoru = activePersona === "Yoru";
    const slides = isYoru ? YORU_SLIDES : ASA_SLIDES;

    // Breathing speed increases with guilt (from 3s down to 0.8s)
    const breathingDuration = isYoru ? 0.6 : 3 - (guilt / 100) * 2.2;
    // Jitter intensity kicks in after 60% guilt
    const jitterAmount = !isYoru && guilt > 60 ? (guilt - 60) / 10 : 0;

    // Estado: qué imagen estamos viendo (0 = primera, 1 = segunda/revelada)
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isRevealing, setIsRevealing] = useState(false);
    const shockControls = useAnimationControls();

    // Resetear al slide 0 cuando cambia la personalidad
    const prevPersona = useState(activePersona);
    if (prevPersona[0] !== activePersona) {
        prevPersona[1](activePersona);
        setCurrentSlide(0);
        setIsRevealing(false);
    }

    const currentData = slides[currentSlide];
    const hasNextSlide = currentSlide < slides.length - 1;

    // ---- EFECTO DE REVELACIÓN ----
    // Para Yoru: SHOCK — la página se "rompe" con fracturas visuales
    // Para Asa: Suave — como quitar un velo lentamente
    const handleReveal = useCallback(async () => {
        setIsRevealing(true);

        if (isYoru) {
            // Efecto de FRACTURA: sacudidas violentas antes de revelar
            await shockControls.start({
                x: [0, -30, 25, -20, 15, -8, 4, 0],
                y: [0, 15, -20, 12, -8, 5, -2, 0],
                rotate: [0, -3, 4, -2, 3, -1, 0],
                scale: [1, 1.05, 0.95, 1.03, 0.97, 1.01, 1],
                filter: [
                    "hue-rotate(0deg) brightness(1)",
                    "hue-rotate(180deg) brightness(2)",
                    "hue-rotate(90deg) brightness(0.5)",
                    "hue-rotate(270deg) brightness(1.5)",
                    "hue-rotate(0deg) brightness(1)",
                ],
                transition: { duration: 0.8, ease: "easeInOut" },
            });
            setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1));
        } else {
            // Efecto suave: revelar el panel secundario
            setCurrentSlide((prev) => (prev === 0 ? 1 : 0));
        }
        setIsRevealing(false);
    }, [isYoru, shockControls, slides.length]);

    // Volver a la primera imagen
    const handleGoBack = useCallback(() => {
        setCurrentSlide((prev) => Math.max(prev - 1, 0));
    }, []);

    return (
        <section className="w-full max-w-3xl mx-auto px-4">
            <motion.div
                animate={{
                    ...shockControls,
                    scale: [1, 1.01, 1],
                    x: jitterAmount > 0 ? [-jitterAmount, jitterAmount, -jitterAmount, 0] : 0,
                    y: jitterAmount > 0 ? [jitterAmount, -jitterAmount, jitterAmount, 0] : 0,
                }}
                transition={{
                    scale: { duration: breathingDuration, repeat: Infinity, ease: "easeInOut" },
                    x: { duration: 0.1, repeat: Infinity, ease: "linear" },
                    y: { duration: 0.1, repeat: Infinity, ease: "linear" },
                }}
                className="relative"
            >
                {/* ---- BURBUJA DE DATOS MARINOS (Solo Asa) ---- */}
                {!isYoru && <SeaFactBubble visible={true} />}
                {/* ---- FRACTURAS VISUALES durante reveal de Yoru ---- */}
                {isRevealing && isYoru && (
                    <>
                        {/* Líneas de fractura rojas cruzando la pantalla */}
                        {Array.from({ length: 5 }).map((_, i) => (
                            <motion.div
                                key={`crack-${i}`}
                                className="absolute z-30 pointer-events-none"
                                style={{
                                    left: `${15 + i * 17}%`,
                                    top: 0,
                                    width: "2px",
                                    height: "100%",
                                    background: "linear-gradient(180deg, transparent, #DC143C, transparent)",
                                    transform: `rotate(${-15 + i * 8}deg)`,
                                }}
                                initial={{ opacity: 0, scaleY: 0 }}
                                animate={{ opacity: [0, 1, 0], scaleY: [0, 1, 0] }}
                                transition={{ duration: 0.6, delay: i * 0.05 }}
                            />
                        ))}
                        {/* Flash rojo */}
                        <motion.div
                            className="absolute inset-0 z-20 pointer-events-none bg-[#DC143C]"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 0.5, 0] }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                        />
                    </>
                )}

                {/* ---- CARD DE IMAGEN + LORE ---- */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`${activePersona}-${currentSlide}`}
                        initial={{ opacity: 0, y: 30, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 1.02 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className={`
              relative overflow-hidden rounded-2xl
              transition-all duration-700
              ${isYoru
                                ? "border-2 border-[#8B0000]/60 shadow-[0_0_50px_rgba(139,0,0,0.4),0_0_100px_rgba(139,0,0,0.1)]"
                                : "border border-[#1B263B]/15 shadow-xl"
                            }
            `}
                    >
                        {/* ---- IMAGEN PRINCIPAL (MANGA PANEL STYLE) ---- */}
                        <div className="relative w-full aspect-[4/5] md:aspect-[16/9] overflow-hidden bg-black">
                            {/* Background Image (Lower Panel) */}
                            <Image
                                src={!isYoru && currentSlide === 1 ? slides[0].src : currentData.src}
                                alt={currentData.alt}
                                fill
                                className={`
                                  object-cover transition-all duration-1000
                                  ${isYoru ? "object-top" : "object-center"}
                                  ${!isYoru && currentSlide === 1 ? "scale-110 blur-sm grayscale-[0.5] opacity-40" : ""}
                                `}
                                sizes="(max-width: 768px) 100vw, 800px"
                                priority
                            />

                            {/* Asa's Secondary Panel (Eyes) - Cinematic Manga Slash */}
                            {!isYoru && (
                                <motion.div
                                    initial={{ x: "100%", opacity: 0 }}
                                    animate={currentSlide === 1 ? { x: "0%", opacity: 1 } : { x: "100%", opacity: 0 }}
                                    transition={{ duration: 0.6, ease: "circOut" }}
                                    className="absolute inset-0 z-10 border-y-[4px] border-white shadow-[0_0_40px_rgba(0,0,0,0.8)] overflow-hidden"
                                    style={{
                                        clipPath: "polygon(0 25%, 100% 15%, 100% 75%, 0 85%)",
                                        height: "40%",
                                        top: "30%"
                                    }}
                                >
                                    <Image
                                        src={slides[1].src}
                                        alt={slides[1].alt}
                                        fill
                                        className="object-cover object-[center_35%] scale-110"
                                        sizes="(max-width: 768px) 100vw, 800px"
                                    />
                                    {/* Panel Speed Lines Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20 pointer-events-none" />
                                </motion.div>
                            )}

                            {/* Overlay degradado para legibilidad del texto */}
                            <div
                                className={`
                  absolute inset-0 pointer-events-none
                  ${isYoru
                                        ? "bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent"
                                        : "bg-gradient-to-t from-[#F5F5F0] via-[#F5F5F0]/30 to-transparent"
                                    }
                `}
                            />

                            {/* Scan lines para Yoru */}
                            {isYoru && (
                                <div
                                    className="absolute inset-0 pointer-events-none opacity-[0.07]"
                                    style={{
                                        backgroundImage:
                                            "repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(220, 20, 60, 0.5) 1px, rgba(220, 20, 60, 0.5) 2px)",
                                    }}
                                />
                            )}

                            {/* Indicador de slide */}
                            <div className="absolute top-4 right-4 flex gap-2 z-10">
                                {slides.map((_, i) => (
                                    <div
                                        key={i}
                                        className={`
                      w-2.5 h-2.5 rounded-full transition-all duration-500
                      ${i === currentSlide
                                                ? isYoru
                                                    ? "bg-[#DC143C] shadow-[0_0_8px_rgba(220,20,60,0.8)] scale-125"
                                                    : "bg-[#1B263B] scale-125"
                                                : isYoru
                                                    ? "bg-[#DC143C]/30"
                                                    : "bg-[#1B263B]/20"
                                            }
                    `}
                                    />
                                ))}
                            </div>

                            {/* Título sobre la imagen */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-10">
                                <motion.h3
                                    key={`title-${currentSlide}`}
                                    initial={{ opacity: 0, x: isYoru ? 20 : -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2, duration: 0.4 }}
                                    className={`
                    text-2xl md:text-4xl font-bold mb-1
                    ${isYoru ? "text-[#DC143C]" : "text-[#1B263B]"}
                  `}
                                    style={{
                                        fontFamily: isYoru ? "var(--font-creepster)" : "var(--font-inter)",
                                        textShadow: isYoru
                                            ? "0 0 30px rgba(220, 20, 60, 0.6), 0 2px 10px rgba(0,0,0,0.8)"
                                            : "0 1px 8px rgba(255,255,255,0.9)",
                                    }}
                                >
                                    {currentData.title}
                                </motion.h3>
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.6 }}
                                    transition={{ delay: 0.4 }}
                                    className={`
                    text-xs font-mono uppercase tracking-[0.2em]
                    ${isYoru ? "text-[#F5F5F0]" : "text-[#1B263B]"}
                  `}
                                >
                                    {currentData.detail}
                                </motion.span>
                            </div>
                        </div>

                        {/* ---- SECCIÓN DE LORE ---- */}
                        <div
                            className={`
                p-6 md:p-8
                transition-colors duration-700
                ${isYoru ? "bg-[#0A0A0A]" : "bg-white/90"}
              `}
                        >
                            {/* Texto de lore del personaje */}
                            <motion.p
                                key={`lore-${currentSlide}`}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                                className={`
                  text-xs md:text-base leading-relaxed mb-6
                  ${isYoru
                                        ? "text-[#F5F5F0]/70 font-light"
                                        : "text-[#1B263B]/70 italic"
                                    }
                `}
                            >
                                {currentData.lore}
                            </motion.p>

                            {/* ---- BOTÓN DE REVELACIÓN / NAVEGACIÓN ---- */}
                            <div className="flex items-center justify-between">
                                {/* Botón "Volver" — solo si estamos en slide 2 */}
                                {currentSlide > 0 ? (
                                    <motion.button
                                        onClick={handleGoBack}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className={`
                      text-xs px-4 py-2 rounded-lg
                      transition-all duration-300
                      ${isYoru
                                                ? "text-[#DC143C]/60 border border-[#8B0000]/30 hover:bg-[#8B0000]/10 hover:text-[#DC143C]"
                                                : "text-[#1B263B]/40 border border-[#1B263B]/15 hover:bg-[#1B263B]/5 hover:text-[#1B263B]"
                                            }
                    `}
                                        whileHover={{ scale: isYoru ? 1.05 : 0.95 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        ← Volver
                                    </motion.button>
                                ) : (
                                    <div />
                                )}

                                {/* Botón de revelación — el acto de descubrir al personaje */}
                                {hasNextSlide && (
                                    <motion.button
                                        onClick={handleReveal}
                                        disabled={isRevealing}
                                        className={`
                      relative px-6 py-3 font-bold text-sm
                      rounded-xl overflow-hidden
                      transition-all duration-300
                      ${isYoru
                                                ? `
                          bg-[#8B0000] text-[#F5F5F0]
                          border-2 border-[#DC143C]
                          shadow-[0_0_20px_rgba(220,20,60,0.3)]
                          cursor-crosshair
                        `
                                                : `
                          bg-[#1B263B] text-[#F5F5F0]
                          border border-[#1B263B]
                          cursor-pointer
                        `
                                            }
                    `}
                                        whileHover={
                                            isYoru
                                                ? {
                                                    scale: 1.08,
                                                    boxShadow: "0 0 40px rgba(220, 20, 60, 0.6), 0 0 80px rgba(139,0,0,0.3)",
                                                }
                                                : { scale: 0.95 }
                                        }
                                        whileTap={{ scale: isYoru ? 1.12 : 0.88 }}
                                        // Pulso constante para llamar la atención
                                        animate={{
                                            boxShadow: isYoru
                                                ? [
                                                    "0 0 20px rgba(220,20,60,0.3)",
                                                    "0 0 35px rgba(220,20,60,0.5)",
                                                    "0 0 20px rgba(220,20,60,0.3)",
                                                ]
                                                : undefined,
                                        }}
                                        transition={{
                                            boxShadow: { repeat: Infinity, duration: 1.5 },
                                            scale: { type: "spring", stiffness: 400, damping: 15 },
                                        }}
                                    >
                                        <span className="relative z-10">
                                            {currentData.revealText}
                                        </span>
                                        {/* Efecto de brillo que recorre el botón */}
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                            animate={{ x: ["-200%", "200%"] }}
                                            transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                                        />
                                    </motion.button>
                                )}

                                {/* Indicador final en segundo slide */}
                                {!hasNextSlide && (
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className={`
                      text-xs font-mono tracking-widest
                      ${isYoru ? "text-[#DC143C]/40" : "text-[#1B263B]/30"}
                    `}
                                    >
                                        {isYoru ? "⚔ GUERRA REVELADA" : "✧ has visto lo que ella esconde"}
                                    </motion.span>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* ---- PARTÍCULAS DE ENERGÍA durante Yoru ---- */}
                {isYoru && (
                    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl z-20">
                        {Array.from({ length: 6 }).map((_, i) => {
                            const delay = (i * 0.5);
                            const duration = 2.5 + (i * 0.3);
                            const yOffset = -40 - (i * 5);
                            const scaleMax = 1 + (i * 0.2);

                            return (
                                <motion.div
                                    key={`particle-${i}`}
                                    className="absolute w-1.5 h-1.5 bg-[#DC143C] rounded-full"
                                    style={{
                                        left: `${5 + (i * 15) % 90}%`,
                                        top: `${5 + (i * 13) % 90}%`,
                                    }}
                                    animate={{
                                        y: [0, yOffset, 0],
                                        opacity: [0, 0.9, 0],
                                        scale: [0, scaleMax, 0],
                                    }}
                                    transition={{
                                        duration: duration,
                                        repeat: Infinity,
                                        delay: delay,
                                        ease: "easeInOut",
                                    }}
                                />
                            );
                        })}
                    </div>
                )}
            </motion.div>
        </section>
    );
}
