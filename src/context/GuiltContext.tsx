"use client";

import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from "react";
import { WEAPONS_DATA } from "@/constants/weapons";
import { useAudio } from "@/hooks/useAudio";
import { Language } from "@/constants/translations";

// ============================================================
// GUILT CONTEXT — EL MOTOR DEL DUAL-STATE ENGINE
// ============================================================
// Este contexto global representa la regla de oro del universo:
// La culpa de Asa Mitaka alimenta directamente el poder de Yoru.
// Cuanto más sufre Asa, más fuerte se vuelve el Demonio de la Guerra.
//
// El "guilt" (culpa) va de 0 a 100.
// - Mientras guilt < 100, Asa mantiene el control (tema claro, tímido).
// - Cuando guilt alcanza 100, Yoru SECUESTRA la interfaz (takeover demoníaco).
// ============================================================

/** Las dos entidades que habitan el mismo cuerpo */
export type Persona = "Asa" | "Yoru";

interface GuiltState {
    guilt: number;
    isContractSigned: boolean;
    activePersona: Persona;
    justTriggered: boolean;
    weapons: string[];
    combo: number;
    isTransitioning: boolean;
    language: Language;
}

interface GuiltActions {
    addGuilt: (amount: number) => void;
    resetGuilt: () => void;
    signContract: () => void;
    clearTrigger: () => void;
    unlockWeapon: (weaponId: string) => void;
    incCombo: () => void;
    resetCombo: () => void;
    startTransition: (callback: () => void) => void;
    setGlobalLanguage: (lang: Language) => void;

    // Audio Actions
    initAudio: () => void;
    playHeartbeat: () => void;
    playSlash: () => void;
    playGlitch: () => void;
}

const GuiltStateContext = createContext<GuiltState | undefined>(undefined);
const GuiltActionsContext = createContext<GuiltActions | undefined>(undefined);

export function GuiltProvider({ children }: { children: React.ReactNode }) {
    const [guilt, setGuilt] = useState<number>(0);
    const [isContractSigned, setIsContractSigned] = useState<boolean>(false);
    const [justTriggered, setJustTriggered] = useState<boolean>(false);
    const [weapons, setWeapons] = useState<string[]>([]);
    const [combo, setCombo] = useState<number>(0);
    const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
    const [language, setLanguage] = useState<Language>("es");

    const { initAudio, playHeartbeat, playSlash, playGlitch } = useAudio();

    useEffect(() => {
        const savedLang = localStorage.getItem("glt_lang");
        if (savedLang === "en" || savedLang === "es") {
            setLanguage(savedLang);
        }
    }, []);

    // Auto-unlock weapons globally
    useEffect(() => {
        WEAPONS_DATA.forEach(weapon => {
            if (guilt >= weapon.unlockAt) {
                setWeapons(prev => {
                    if (prev.includes(weapon.id)) return prev;
                    return [...prev, weapon.id];
                });
            }
        });
    }, [guilt]);

    const startTransition = useCallback((callback: () => void) => {
        setIsTransitioning(true);
        // Delay the actual state change to mid-slash (approx 300ms)
        setTimeout(() => {
            callback();
        }, 300);
        // End transition after animation (approx 800ms total)
        setTimeout(() => {
            setIsTransitioning(false);
        }, 800);
    }, []);

    const setGlobalLanguage = useCallback((lang: Language) => {
        setLanguage(lang);
        localStorage.setItem("glt_lang", lang);
    }, []);

    const addGuilt = useCallback((amount: number) => {
        setGuilt((prev) => Math.min(prev + amount, 100));
    }, []);

    const unlockWeapon = useCallback((weaponId: string) => {
        setWeapons((prev) => prev.includes(weaponId) ? prev : [...prev, weaponId]);
    }, []);

    const signContract = useCallback(() => {
        setIsContractSigned(true);
        setJustTriggered(true);
    }, []);

    const resetGuilt = useCallback(() => {
        setGuilt(0);
        setIsContractSigned(false);
        setJustTriggered(false);
        setWeapons([]);
        setCombo(0);
    }, []);

    const incCombo = useCallback(() => setCombo(prev => prev + 1), []);
    const resetCombo = useCallback(() => setCombo(0), []);
    const clearTrigger = useCallback(() => setJustTriggered(false), []);

    const activePersona: Persona = useMemo(
        () => (isContractSigned ? "Yoru" : "Asa"),
        [isContractSigned]
    );

    const stateValue = useMemo(() => ({
        guilt,
        isContractSigned,
        activePersona,
        justTriggered,
        weapons,
        combo,
        isTransitioning,
        language,
    }), [guilt, isContractSigned, activePersona, justTriggered, weapons, combo, isTransitioning, language]);

    const actionsValue = useMemo(() => ({
        addGuilt,
        resetGuilt,
        signContract,
        clearTrigger,
        unlockWeapon,
        incCombo,
        resetCombo,
        startTransition,
        initAudio,
        playHeartbeat,
        playSlash,
        playGlitch,
        setGlobalLanguage,
    }), [addGuilt, resetGuilt, signContract, clearTrigger, unlockWeapon, incCombo, resetCombo, startTransition, initAudio, playHeartbeat, playSlash, playGlitch, setGlobalLanguage]);

    return (
        <GuiltStateContext.Provider value={stateValue}>
            <GuiltActionsContext.Provider value={actionsValue}>
                {children}
            </GuiltActionsContext.Provider>
        </GuiltStateContext.Provider>
    );
}

export function useGuiltState() {
    const context = useContext(GuiltStateContext);
    if (!context) throw new Error("useGuiltState must be used within GuiltProvider");
    return context;
}

export function useGuiltActions() {
    const context = useContext(GuiltActionsContext);
    if (!context) throw new Error("useGuiltActions must be used within GuiltProvider");
    return context;
}

// For backward compatibility while refactoring
export function useGuilt() {
    return { ...useGuiltState(), ...useGuiltActions() };
}
