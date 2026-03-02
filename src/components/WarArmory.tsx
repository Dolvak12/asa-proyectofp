"use client";

import { motion, AnimatePresence, useScroll, useSpring, useMotionValue, useTransform } from "framer-motion";
import { useGuiltState, useGuiltActions } from "@/context/GuiltContext";
import Image from "next/image";
import { useState, useRef } from "react";
import { WEAPONS_DATA } from "@/constants/weapons";

/**
 * WEAPON CARD COMPONENT WITH 3D TILT
 */
function WeaponCard({ weapon, isUnlocked, isYoru, onClick, delay }: any) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useSpring(useTransform(y, [-100, 100], [10, -10]), { stiffness: 150, damping: 20 });
    const rotateY = useSpring(useTransform(x, [-100, 100], [-10, 10]), { stiffness: 150, damping: 20 });

    const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        x.set(e.clientX - centerX);
        y.set(e.clientY - centerY);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            onMouseMove={handleMouse}
            onMouseLeave={handleMouseLeave}
            style={{
                perspective: "1000px",
                transformStyle: "preserve-3d"
            }}
            className={`
                relative group overflow-hidden ${isYoru ? "rounded-none" : "rounded-2xl"} aspect-[4/5]
                border-2 transition-all duration-500
                ${isUnlocked
                    ? (isYoru ? 'border-[#DC143C]/40 bg-[#1A0505]/40 shadow-xl' : 'border-[#1B263B]/20 bg-white shadow-xl')
                    : 'border-dashed border-gray-300 opacity-50 grayscale'
                }
            `}
            onClick={onClick}
        >
            <motion.div
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                className="w-full h-full relative"
            >
                {!isUnlocked && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/5 backdrop-blur-[2px]">
                        <span className="text-3xl mb-2">🔒</span>
                        <span className="text-[10px] uppercase font-bold tracking-widest">Bloqueado</span>
                        <span className="text-[8px] opacity-60">Control {weapon.unlockAt}%</span>
                    </div>
                )}

                {isUnlocked && (
                    <>
                        <Image
                            src={`/assets/weapons/${weapon.image}`}
                            alt={weapon.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />

                        {/* 3D Floating Title */}
                        <div
                            className="absolute bottom-0 left-0 right-0 p-6 z-20"
                            style={{ transform: "translateZ(30px)" }}
                        >
                            <h3 className={`text-lg font-bold text-white`}>
                                {weapon.name}
                            </h3>
                            <p className="text-[10px] opacity-50 text-white uppercase tracking-tighter">
                                Click para inspeccionar
                            </p>
                        </div>
                    </>
                )}
            </motion.div>
        </motion.div>
    );
}

export default function WarArmory() {
    const { activePersona, weapons } = useGuiltState();
    const { playSlash } = useGuiltActions();
    const isYoru = activePersona === "Yoru";
    const [selectedWeapon, setSelectedWeapon] = useState<typeof WEAPONS_DATA[0] | null>(null);

    return (
        <div className="w-full max-w-5xl mx-auto px-4 py-12">
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="mb-12 text-center"
            >
                <h2 className={`text-2xl md:text-4xl font-black uppercase tracking-[0.2em] mb-4 ${isYoru ? 'text-[#DC143C]' : 'text-[#1B263B]'}`}
                    style={{ fontFamily: isYoru ? 'var(--font-creepster)' : 'var(--font-inter)' }}
                >
                    {isYoru ? "Armería del Demonio de la Guerra" : "Coleccionables Obscuros"}
                </h2>
                <p className="text-xs md:text-sm opacity-40 uppercase tracking-widest">
                    Las armas se forjan con el dolor del alma
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {WEAPONS_DATA.map((weapon, idx) => (
                    <WeaponCard
                        key={weapon.id}
                        weapon={weapon}
                        isUnlocked={weapons.includes(weapon.id)}
                        isYoru={isYoru}
                        onClick={() => {
                            if (weapons.includes(weapon.id)) {
                                playSlash();
                                setSelectedWeapon(weapon);
                            }
                        }}
                        delay={idx * 0.1}
                    />
                ))}
            </div>

            {/* Modal remains same but updated with perspective on the content box */}
            <AnimatePresence>
                {/* ... existing modal code ... */}
                {selectedWeapon && (
                    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                            onClick={() => setSelectedWeapon(null)}
                        />

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className={`
                                relative z-10 w-full max-w-4xl max-h-[90vh] overflow-hidden ${isYoru ? "rounded-none" : "rounded-3xl"} flex flex-col md:flex-row
                                border shadow-2xl
                                ${isYoru ? 'bg-[#0A0A0A] border-red-900/50' : 'bg-white border-blue-900/10'}
                            `}
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedWeapon(null)}
                                className="absolute top-4 right-4 md:top-6 md:right-6 z-50 w-12 h-12 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
                            >
                                ✕
                            </button>

                            {/* Image Part */}
                            <div className="relative w-full md:w-1/2 aspect-square md:aspect-auto">
                                <Image
                                    src={`/assets/weapons/${selectedWeapon.image}`}
                                    alt={selectedWeapon.name}
                                    fill
                                    className="object-cover"
                                />
                                <div className={`absolute inset-0 ${isYoru ? 'mix-blend-multiply bg-red-900/20' : ''}`} />
                            </div>

                            {/* Info Part */}
                            <div className="p-8 md:p-12 flex-1 flex flex-col justify-center">
                                <span className={`text-[10px] uppercase font-bold tracking-[0.4em] mb-2 ${isYoru ? 'text-red-500' : 'text-blue-500'}`}>
                                    Arma del Demonio
                                </span>
                                <h1 className={`text-3xl md:text-5xl font-black mb-6 ${isYoru ? 'text-white' : 'text-black'}`}
                                    style={{ fontFamily: isYoru ? 'var(--font-creepster)' : 'var(--font-inter)' }}
                                >
                                    {selectedWeapon.name}
                                </h1>
                                <p className={`text-sm md:text-lg leading-relaxed mb-8 ${isYoru ? 'text-white/60' : 'text-black/60'}`}>
                                    {selectedWeapon.description}
                                </p>

                                <div className={`pt-8 border-t ${isYoru ? 'border-red-900/30' : 'border-black/10'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${isYoru ? 'bg-red-600' : 'bg-black text-white'}`}>
                                            {isYoru ? "⚔" : "✦"}
                                        </div>
                                        <div>
                                            <p className={`text-[10px] font-bold uppercase ${isYoru ? 'text-red-400' : 'text-black/40'}`}>Propiedad de:</p>
                                            <p className={`text-sm font-bold ${isYoru ? 'text-red-500' : 'text-black'}`}>{isYoru ? 'YORU' : 'ASA MITAKA'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
