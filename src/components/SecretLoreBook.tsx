"use client";

import { useGuilt } from "@/context/GuiltContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback } from "react";
import Image from "next/image";
import { WEAPONS_DATA } from "@/constants/weapons";
import MangaHaptics from "./MangaHaptics";
import TextDecrypter from "./TextDecrypter";
import { TRANSLATIONS } from "@/constants/translations";

/**
 * SECRET LORE BOOK — Diario de Asa y Armería de Yoru
 * 
 * Este componente desbloquea contenido según el nivel de culpa y persona.
 * - 30% Culpa: Diario de Asa (Pensamientos ocultos).
 * - Modo Yoru: Armería (Placeholders de armas).
 */
export default function SecretLoreBook() {
    const { guilt, activePersona, weapons, language } = useGuilt();
    const isYoru = activePersona === "Yoru";
    const t = TRANSLATIONS;
    const [isDiaryOpen, setIsDiaryOpen] = useState(false);
    const [isArmoryOpen, setIsArmoryOpen] = useState(false);

    const showDiaryLink = guilt >= 30 && !isYoru;
    const showArmoryLink = isYoru;

    return (
        <>{/* Fragments handle multiple top-level elements */}
            {/* BUTTON CONTAINER (Higher Layer right above everything) */}
            <div className="fixed top-24 right-4 z-[100] pointer-events-none md:top-32 md:right-8">
                <div className="flex flex-col items-end gap-4 pointer-events-auto">
                    {/* Enlace al Diario de Asa */}
                    <AnimatePresence>
                        {showDiaryLink && (
                            <motion.button
                                initial={{ x: -100, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -100, opacity: 0 }}
                                onClick={() => setIsDiaryOpen(true)}
                                className="bg-white/90 border-2 border-[#1B263B] p-3 shadow-[4px_4px_0px_#1B263B] group hover:bg-[#1B263B] transition-colors"
                            >
                                <span className="text-[#1B263B] group-hover:text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                                    📖 {t["nav.diary"][language]}
                                </span>
                            </motion.button>
                        )}
                    </AnimatePresence>

                    {/* Enlace a la Armería de Yoru */}
                    <AnimatePresence>
                        {showArmoryLink && (
                            <motion.button
                                initial={{ x: -100, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -100, opacity: 0 }}
                                onClick={() => setIsArmoryOpen(true)}
                                className="bg-black border-2 border-[#DC143C] p-3 shadow-[4px_4px_0px_#DC143C] group hover:bg-[#DC143C] transition-colors"
                            >
                                <span className="text-[#DC143C] group-hover:text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                                    ⚔️ {t["nav.armory"][language]}
                                </span>
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* MODAL DIARIO DE ASA (Extremely High Layer) */}
            <AnimatePresence>
                {isDiaryOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-white/40 backdrop-blur-md z-[20000] flex items-center justify-center p-4"
                        onClick={() => setIsDiaryOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 30 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-white border-4 border-black p-8 max-w-md w-full shadow-[20px_20px_0px_black] relative mx-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsDiaryOpen(false);
                                }}
                                className="absolute -top-2 -right-2 w-12 h-12 flex items-center justify-center bg-black text-white text-2xl font-black z-[20001] hover:bg-[#1B263B] transition-colors pointer-events-auto shadow-xl"
                                aria-label="Cerrar diario"
                            >
                                ✕
                            </button>
                            <h2 className="text-2xl font-black uppercase mb-6 border-b-2 border-black pb-2">{t["diary.title"][language]}</h2>

                            <div className="space-y-6 text-[#1B263B] italic font-medium leading-relaxed">
                                <p className="relative group">
                                    "{t["diary.p1_1"][language]} <span className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity" /> <span className="blur-[4px] group-hover:blur-0 transition-all select-none group-hover:select-text">{t["diary.p1_2"][language]}</span>"
                                </p>
                                <p className="relative group">
                                    "{t["diary.p2_1"][language]} <span className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity" /> <span className="blur-[4px] group-hover:blur-0 transition-all select-none group-hover:select-text">{t["diary.p2_2"][language]}</span>"
                                </p>
                                <p className="text-xs opacity-40 uppercase tracking-tighter mt-4">{t["diary.hint"][language]}</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* MODAL ARMERÍA DE YORU (Extremely High Layer) */}
            <AnimatePresence>
                {isArmoryOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[20000] flex items-center justify-center p-4"
                        onClick={() => setIsArmoryOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 1.1, rotate: -5, x: 0 }}
                            animate={{
                                scale: 1,
                                rotate: 0,
                                x: [0, -10, 10, -5, 5, 0],
                                transition: { x: { duration: 0.4, ease: "easeInOut" } }
                            }}
                            className="bg-[#0A0A0A] border-4 border-[#DC143C] p-8 max-w-2xl w-full shadow-[20px_20px_0px_#8B0000] relative mx-4 overflow-y-auto max-h-[90vh]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsArmoryOpen(false);
                                }}
                                className="absolute -top-2 -right-2 w-12 h-12 flex items-center justify-center bg-[#DC143C] text-white text-2xl font-black z-[20001] hover:bg-[#8B0000] transition-colors pointer-events-auto shadow-xl"
                                aria-label="Cerrar armería"
                            >
                                ✕
                            </button>
                            <h2 className="text-3xl font-black uppercase mb-6 text-[#DC143C]" style={{ fontFamily: "var(--font-creepster)" }}>{t["armory.title"][language]}</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {WEAPONS_DATA.map((weapon, idx) => {
                                    const isUnlocked = weapons.includes(weapon.id);
                                    return (
                                        <motion.div
                                            key={weapon.id}
                                            whileHover={isUnlocked ? { scale: 1.02, rotate: 1 } : {}}
                                            className={`border-2 p-4 transition-all group relative overflow-hidden ${isUnlocked
                                                ? "border-[#DC143C] bg-[#1A0505]/40"
                                                : "border-[#DC143C]/10 opacity-40 grayscale transition-all duration-300 md:group-hover:opacity-100 md:group-hover:grayscale-0 group-active:opacity-100 group-active:grayscale-0"
                                                }`}
                                        >
                                            <div className="w-full h-40 bg-neutral-900 mb-4 flex items-center justify-center relative overflow-hidden">
                                                {isUnlocked ? (
                                                    <>
                                                        <Image
                                                            src={`/assets/weapons/${weapon.image}`}
                                                            alt={weapon.name[language]}
                                                            fill
                                                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                        />
                                                        {/* Slash Effect on Hover */}
                                                        <motion.div
                                                            className="absolute inset-0 bg-red-600/20 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                                            style={{ clipPath: "polygon(0 45%, 100% 35%, 100% 55%, 0 65%)" }}
                                                        />
                                                    </>
                                                ) : (
                                                    <span className="text-[#DC143C]/10 text-xl font-black">{t["armory.locked"][language]}</span>
                                                )}

                                                {/* Onomatopoeia on Hover */}
                                                <div className="absolute top-2 right-2 text-xs font-black text-[#DC143C] opacity-0 group-hover:opacity-100 transition-opacity italic z-20">
                                                    {isUnlocked ? "ズバッ!" : "..."}
                                                </div>
                                            </div>
                                            <h3 className="font-black text-[#DC143C] uppercase mb-1 flex justify-between items-center">
                                                {weapon.name[language]}
                                                {!isUnlocked && <span className="text-[8px] opacity-40">Lvl {weapon.unlockAt}%</span>}
                                            </h3>
                                            <p className="text-[10px] text-white/50 leading-tight">
                                                {isUnlocked ? <TextDecrypter text={weapon.description[language]} /> : t["armory.hidden_desc"][language]}
                                            </p>
                                        </motion.div>
                                    );
                                })}
                            </div>
                            <p className="text-[10px] text-[#DC143C]/40 uppercase mt-6 tracking-[0.3em]"><TextDecrypter text={t["armory.footer"][language]} /></p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
