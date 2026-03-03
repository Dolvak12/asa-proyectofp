"use client";

import GuiltTrigger from "@/components/GuiltTrigger";
import CharacterPortrait from "@/components/CharacterPortrait";
import YoruControl from "@/components/YoruControl";
import CorruptionLayer from "@/components/CorruptionLayer";
import JuiceOverlay from "@/components/JuiceOverlay";
import MangaHaptics from "@/components/MangaHaptics";
import InternalMonologue from "@/components/InternalMonologue";
import VignetteLayer from "@/components/VignetteLayer";
import MilestoneBadges from "@/components/MilestoneBadges";
import SecretLoreBook from "@/components/SecretLoreBook";
import GhostChat from "@/components/GhostChat";
import InvasionOverlay from "@/components/InvasionOverlay";
import CursedCursor from "@/components/CursedCursor";
import YoruNotifications from "@/components/YoruNotifications";
import WarArmory from "@/components/WarArmory";
import MangaSlash from "@/components/MangaSlash";
import OnboardingTutorial from "@/components/OnboardingTutorial";
import TabHijacker from "@/components/TabHijacker";
import TextDecrypter from "@/components/TextDecrypter";
import EasterEggListener from "@/components/EasterEggListener";
import AtmosphericDust from "@/components/AtmosphericDust";
import JumpscareOverlay from "@/components/JumpscareOverlay";
import YoruMascot from "@/components/YoruMascot";
import { useGuiltState, useGuiltActions } from "@/context/GuiltContext";
import { TRANSLATIONS } from "@/constants/translations";
import { motion, AnimatePresence, useScroll, useSpring, useMotionValue } from "framer-motion";
import { useEffect, useState, useCallback } from "react";

export default function Home() {
  const { guilt, isContractSigned, activePersona, combo, language } = useGuiltState();
  const { resetGuilt, signContract, initAudio, playHeartbeat, addGuilt, incCombo } = useGuiltActions();
  const isYoru = activePersona === "Yoru";
  const t = TRANSLATIONS;
  const [isBooting, setIsBooting] = useState(true);

  const [isPactInProgress, setIsPactInProgress] = useState(false);
  const [showSecretModal, setShowSecretModal] = useState(false);
  const [secretInput, setSecretInput] = useState("");

  // Magnetic effect for central button
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 150, damping: 15 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    mouseX.set((clientX - centerX) * 0.4);
    mouseY.set((clientY - centerY) * 0.4);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleCentralAction = useCallback(() => {
    if (isYoru) {
      resetGuilt();
    } else if (guilt === 100) {
      if (!isPactInProgress) {
        // Stage 1: Trigger immersive sequence
        setIsPactInProgress(true);
        // Small delay to feel the heartbeat before signing
        setTimeout(() => {
          signContract();
          setIsPactInProgress(false);
        }, 2000);
      }
    } else {
      document.getElementById('interact')?.scrollIntoView({ behavior: 'smooth' });
      incCombo();
      addGuilt(10 + Math.floor(combo / 4));
    }
  }, [guilt, isYoru, isPactInProgress, resetGuilt, signContract, incCombo, addGuilt, combo]);

  const handleSecretSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = secretInput.toUpperCase();

    // Dispatch a fake keyboard event string so EasterEggListener picks it up
    // Since EasterEggListener listens to window keydown, we can just simulate it
    // Or simpler: dispatch individual keydown events for each character
    code.split('').forEach(char => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: char }));
    });

    setShowSecretModal(false);
    setSecretInput("");
  };

  // Progress bar for scroll flow
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const bootTimer = window.setTimeout(() => {
      setIsBooting(false);
    }, 700);

    return () => window.clearTimeout(bootTimer);
  }, []);

  // HEARTBEAT EFFECT
  useEffect(() => {
    if (guilt < 20 || isYoru) return;

    // Faster heartbeat as guilt increases. Range: 1500ms -> 300ms
    const intervalTime = Math.max(1500 - (guilt * 12), 300);

    const interval = setInterval(() => {
      playHeartbeat();
    }, intervalTime);

    return () => clearInterval(interval);
  }, [guilt, isYoru, playHeartbeat]);

  return (
    <div
      onPointerDown={initAudio}
      className={`relative min-h-[100dvh] transition-colors duration-1000 ${isYoru ? "bg-[#0A0A0A]" : "bg-gradient-to-b from-[#F6F6F2] to-[#ECEDE8]"} ${isYoru ? "chromatic-aberration-yoru" : ""}
        snap-y snap-mandatory overflow-y-auto scroll-smooth
      `}
    >
      <OnboardingTutorial />
      <MangaSlash />

      {/* Scroll progress rail */}
      <motion.div
        className={`fixed top-0 left-0 right-0 h-1 origin-left z-[200] ${isYoru ? "bg-gradient-to-r from-[#8B0000] via-[#DC143C] to-[#FF4444]" : "bg-gradient-to-r from-[#1B263B] to-[#2D4A7A]"}`}
        style={{ scaleX }}
      />

      {/* Loading experience to avoid initial blank perception */}
      <AnimatePresence>
        {isBooting && (
          <motion.div
            className={`fixed inset-0 z-[300] flex items-center justify-center px-8 ${isYoru ? "bg-[#0A0A0A]" : "bg-[#F5F5F0]"}`}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <div className="flex flex-col items-center gap-5 text-center">
              <motion.span
                className={`text-[11px] md:text-xs uppercase tracking-[0.3em] ${isYoru ? "text-[#DC143C]/80" : "text-[#1B263B]/60"}`}
                animate={{ opacity: [0.35, 1, 0.35] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              >
                {t["page.init"][language]}
              </motion.span>

              <motion.div
                className={`h-1.5 w-56 overflow-hidden rounded-full ${isYoru ? "bg-[#8B0000]/25" : "bg-[#1B263B]/15"}`}
              >
                <motion.div
                  className={`h-full rounded-full ${isYoru ? "bg-[#DC143C]" : "bg-[#1B263B]"}`}
                  initial={{ x: "-100%" }}
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ repeat: Infinity, duration: 1.1, ease: "linear" }}
                />
              </motion.div>

              <p className={`text-xs md:text-sm max-w-md ${isYoru ? "text-[#F5F5F0]/55" : "text-[#1B263B]/55"}`}>
                {t["page.loading"][language]}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background & Meta-Horror Layers */}
      <AtmosphericDust />
      <JumpscareOverlay />
      <InvasionOverlay />
      <CursedCursor />
      <YoruNotifications />
      <YoruMascot />
      <TabHijacker />
      <EasterEggListener />

      <InternalMonologue />
      <VignetteLayer />
      <MilestoneBadges />
      <SecretLoreBook />
      <GhostChat />
      <JuiceOverlay />
      <MangaHaptics />
      <YoruControl />

      {/* Global Glitch Overlay (High Combo) */}
      <AnimatePresence>
        {isYoru && combo > 10 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.2, 0, 0.3, 0] }}
            exit={{ opacity: 0 }}
            transition={{ repeat: Infinity, duration: 0.2 }}
            className="fixed inset-0 z-[15000] pointer-events-none mix-blend-screen overflow-hidden"
          >
            <div className="absolute inset-0 bg-red-500/20 translate-x-[2px] blur-[1px]" />
            <div className="absolute inset-0 bg-cyan-400/20 -translate-x-[2px] blur-[1px]" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contenido Principal (Snap Flow) */}
      <div className="min-h-screen">
        {/* ---- HERO SECTION (CARD 1) ---- */}
        <motion.section
          id="hero"
          className="min-h-[100dvh] flex flex-col items-center justify-center max-w-4xl mx-auto text-center relative snap-start px-6 pt-40 md:pt-0"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Subtítulo descriptivo */}
          <CorruptionLayer strength={0.4}>
            <motion.p
              className={`
                  text-xs md:text-base uppercase tracking-[0.4em] mb-4
                  transition-colors duration-700
                  ${isYoru ? "text-[#DC143C]/50" : "text-[#1B263B]/40"}
              `}
              style={{
                fontFamily: isYoru ? "var(--font-creepster)" : "var(--font-inter)",
              }}
            >
              {isYoru ? <TextDecrypter text={t["page.subtitle_yoru"][language]} /> : "Chainsaw Man Part 2 — Academy Saga"}
            </motion.p>
          </CorruptionLayer>

          {/* Título principal */}
          <motion.h1
            className={`
              text-4xl md:text-6xl lg:text-7xl font-bold mb-6
              transition-colors duration-700
              ${isYoru ? "text-[#DC143C] glitch-text-yoru" : "text-[#1B263B]"}
            `}
            style={{
              fontFamily: isYoru ? "var(--font-creepster)" : "var(--font-inter)",
              textShadow: isYoru
                ? "0 0 40px rgba(139, 0, 0, 0.5), 0 0 80px rgba(220, 20, 60, 0.2)"
                : "none",
            }}
          >
            {isYoru ? <TextDecrypter text="GUILTY SANCTUARY" /> : "Guilty Sanctuary"}
          </motion.h1>

          {/* Descripción del proyecto */}
          <CorruptionLayer strength={0.6}>
            <motion.p
              className={`
                  text-sm md:text-lg max-w-2xl mx-auto leading-relaxed
                  transition-colors duration-700
                  ${isYoru ? "text-[#F5F5F0]/60" : "text-[#1B263B]/60"}
              `}
            >
              {isYoru
                ? <TextDecrypter text={t["page.desc_yoru"][language]} />
                : t["page.desc_asa"][language]
              }
            </motion.p>
          </CorruptionLayer>

          {/* Indicador de navegación (Flecha TikTok style) */}
          {!isYoru && (
            <motion.div
              className="absolute bottom-10 left-1/2 -translate-x-1/2 text-sm text-[#1B263B]/20 font-bold flex flex-col items-center gap-1"
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <span>{t["page.look_down"][language]}</span>
              <span className="text-xl">↓</span>
            </motion.div>
          )}
        </motion.section>

        {/* ---- GALERÍA (CARD 2) ---- */}
        <motion.section
          id="gallery"
          className="min-h-[100dvh] flex flex-col justify-center snap-start relative px-4 pt-40 md:pt-0"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
        >
          <CharacterPortrait />

          {!isYoru && (
            <motion.div
              className="mx-auto mt-12 text-[#1B263B]/20 text-xl flex flex-col items-center"
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
            >
              <span className="text-[10px] tracking-widest uppercase mb-1">{t["page.feel"][language]}</span>
              <span>↓</span>
            </motion.div>
          )}
        </motion.section>

        {/* ---- ARMERÍA (CARD 3) ---- */}
        <motion.section
          id="armory"
          className="min-h-[100dvh] flex flex-col items-center justify-center snap-start relative overflow-hidden pt-40 md:pt-0"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
        >
          <WarArmory />

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-sm text-[#1B263B]/20 font-bold flex flex-col items-center gap-1">
            <span>FORJAR</span>
            <span className="text-xl">↓</span>
          </div>
        </motion.section>

        {/* ---- INTERACTIVO (CARD 4) ---- */}
        <motion.section
          id="interact"
          className="min-h-[100dvh] flex flex-col items-center justify-center snap-start relative overflow-hidden px-6 pt-40 md:pt-0"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
        >
          <AnimatePresence>
            {!isYoru && (
              <motion.div
                className="max-w-2xl mx-auto mb-12"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="rounded-xl p-4 md:p-6 text-center bg-[#1B263B]/5 border border-[#1B263B]/10 shadow-inner">
                  <p className="text-xs md:text-sm leading-relaxed text-[#1B263B]/50 font-medium tracking-tight">
                    「 ESCUCHA SU INTERIOR. ALIMENTA LA CULPA. 」
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <GuiltTrigger />

          <div className="mt-16 opacity-30 flex flex-col items-center gap-1">
            <span className="text-[10px] uppercase tracking-[0.3em]">Fin del Santuario</span>
            <span className="text-xl">↓</span>
          </div>
        </motion.section>

        <motion.footer
          className={`
            min-h-[100dvh] flex flex-col items-center justify-center px-6 snap-start
            transition-colors duration-700
            ${isYoru ? "text-[#F5F5F0]/20" : "text-[#1B263B]/25"}
          `}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div
            className={`
              border-t pt-6 mb-4
              transition-colors duration-700
              ${isYoru ? "border-[#8B0000]/20" : "border-[#1B263B]/10"}
            `}
          >
            <p className="text-xs leading-relaxed max-w-lg mx-auto">
              {t["page.footer_disclaimer"][language]}
            </p>
          </div>
          <p className="text-[10px] opacity-60">
            © {new Date().getFullYear()} Guilty Sanctuary • {t["page.footer_made"][language]}
          </p>
        </motion.footer>
      </div>

      {/* Barra de Navegación Móvil (Glass Floating Nav) */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[150] md:hidden w-[90%] max-w-xs">
        <div className="glass-nav rounded-3xl p-3 flex items-center justify-between shadow-2xl">
          <motion.button
            onClick={() => document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' })}
            whileTap={{ scale: 0.8, y: -5 }}
            className={`p-3 rounded-2xl transition-colors ${isYoru ? "text-[#DC143C]/40" : "text-[#1B263B]/30"}`}
          >
            <span className="text-xl">🏠</span>
          </motion.button>

          <div className="h-8 w-[1px] bg-white/10" />

          {/* Dedicated Codes Button (Enhance Visuals) */}
          <motion.button
            onClick={() => setShowSecretModal(true)}
            whileTap={{ scale: 0.8, y: -5 }}
            animate={isYoru ? {
              boxShadow: ["0 0 0px rgba(220,20,60,0)", "0 0 20px rgba(220,20,60,0.6)", "0 0 0px rgba(220,20,60,0)"]
            } : {
              boxShadow: ["0 0 0px rgba(255,215,0,0)", "0 0 15px rgba(255,215,0,0.4)", "0 0 0px rgba(255,215,0,0)"]
            }}
            transition={{ repeat: Infinity, duration: 2 }}
            className={`
                relative p-3 rounded-2xl transition-all group overflow-hidden
                ${isYoru ? "bg-[#DC143C]/20 border border-[#DC143C]/50 text-[#DC143C]" : "bg-gradient-to-br from-[#1B263B]/10 to-[#1B263B]/30 border border-[#1B263B]/30 text-white shadow-inner"}
            `}
          >
            <span className="text-xl drop-shadow-md relative z-10 transition-transform group-hover:scale-110 block">🔑</span>

            {/* Pequeño pulso expansivo de fondo */}
            <motion.div
              className={`absolute inset-0 rounded-2xl ${isYoru ? "bg-[#DC143C]/30" : "bg-[#FFD700]/20"}`}
              animate={{ scale: [1, 1.5, 1], opacity: [0.8, 0, 0.8] }}
              transition={{ repeat: Infinity, duration: 1.8 }}
            />
          </motion.button>

          <div className="h-8 w-[1px] bg-white/10" />

          {/* Main Action Button (Magnetic) */}
          <motion.div
            style={{ x: springX, y: springY }}
            onMouseMove={handleMouseMove}
            onTouchMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onTouchEnd={handleMouseLeave}
            className="relative flex items-center justify-center"
          >
            <motion.button
              onClick={handleCentralAction}
              whileTap={{ scale: 0.85, y: 8 }}
              animate={guilt === 100 && !isYoru ? {
                scale: [1, 1.15, 1],
                boxShadow: [
                  "0 0 20px rgba(220, 20, 60, 0)",
                  "0 0 60px rgba(220, 20, 60, 0.8)",
                  "0 0 20px rgba(220, 20, 60, 0)"
                ]
              } : isYoru ? {
                boxShadow: [
                  "0 0 30px rgba(220, 20, 60, 0.4)",
                  "0 0 50px rgba(220, 20, 60, 0.7)",
                  "0 0 30px rgba(220, 20, 60, 0.4)"
                ]
              } : {
                boxShadow: `0 0 ${guilt / 2}px rgba(27, 38, 59, ${guilt / 200})`
              }}
              transition={{ repeat: Infinity, duration: isPactInProgress ? 0.4 : 1.2 }}
              className={`
                relative flex items-center justify-center w-16 h-16 rounded-full transition-all group
                ${isYoru
                  ? "bg-[#DC143C] text-white shadow-[0_0_20px_rgba(220,20,60,0.6)]"
                  : guilt === 100
                    ? "bg-black text-[#DC143C] border-2 border-[#DC143C] shadow-2xl"
                    : "bg-[#1B263B] text-white shadow-xl shadow-black/20"}
              `}
            >
              <span className="text-2xl transition-transform duration-500 group-hover:scale-125">
                {isYoru ? "⚔" : isPactInProgress ? "❤" : guilt === 100 ? "👁" : "✦"}
              </span>

              {/* Guilt Aura Glow */}
              <motion.div
                className="absolute inset-0 rounded-full bg-[#DC143C] blur-xl -z-10"
                animate={{
                  scale: [1, 1 + (guilt / 100), 1],
                  opacity: [0, (guilt / 200), 0]
                }}
                transition={{ repeat: Infinity, duration: 2 }}
              />

              {(isYoru || guilt === 100) && (
                <motion.div
                  className={`absolute inset-0 rounded-full ${isYoru || guilt === 100 ? "bg-[#DC143C]/30" : "bg-black/20"}`}
                  animate={{ scale: [1, 1.8, 1], opacity: [0.7, 0, 0.7] }}
                  transition={{ repeat: Infinity, duration: isPactInProgress ? 0.3 : 1.5 }}
                />
              )}

              {/* Pact Rules */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute -top-14 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black text-[#DC143C] text-[10px] px-3 py-1.5 font-black uppercase tracking-[0.2em] border-2 border-[#DC143C] shadow-[4px_4px_0px_#DC143C]"
                style={{ fontFamily: "var(--font-creepster)" }}
              >
                {guilt === 100 && !isYoru && !isPactInProgress ? t["trigger.press_sign"][language] : isYoru ? "FIN DEL SANTUARIO" : (language === "es" ? "SANTUARIO" : "SANCTUARY")}
              </motion.div>
            </motion.button>
          </motion.div>

          <div className="h-8 w-[1px] bg-white/10" />

          <motion.button
            onClick={() => document.getElementById('interact')?.scrollIntoView({ behavior: 'smooth' })}
            whileTap={{ scale: 0.8, y: -5 }}
            className={`p-3 rounded-2xl transition-colors ${isYoru ? "text-[#DC143C]/40" : "text-[#1B263B]/30"}`}
          >
            <span className="text-xl">🔥</span>
          </motion.button>
        </div>
      </nav>

      {/* Scan Lines Modo Yoru */}
      {isYoru && (
        <div
          className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(220, 20, 60, 0.5) 2px, rgba(220, 20, 60, 0.5) 4px)",
            backgroundSize: "100% 4px",
          }}
        />
      )}
    </div>
  );
}
