"use client";

import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from "react";
import { WEAPONS_DATA } from "@/constants/weapons";

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
}

interface GuiltActions {
    addGuilt: (amount: number) => void;
    resetGuilt: () => void;
    signContract: () => void;
    clearTrigger: () => void;
    unlockWeapon: (weaponId: string) => void;
    incCombo: () => void;
    resetCombo: () => void;
}

const GuiltStateContext = createContext<GuiltState | undefined>(undefined);
const GuiltActionsContext = createContext<GuiltActions | undefined>(undefined);

export function GuiltProvider({ children }: { children: React.ReactNode }) {
    const [guilt, setGuilt] = useState<number>(0);
    const [isContractSigned, setIsContractSigned] = useState<boolean>(false);
    const [justTriggered, setJustTriggered] = useState<boolean>(false);
    const [weapons, setWeapons] = useState<string[]>([]);
    const [combo, setCombo] = useState<number>(0);

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
    }), [guilt, isContractSigned, activePersona, justTriggered, weapons, combo]);

    const actionsValue = useMemo(() => ({
        addGuilt,
        resetGuilt,
        signContract,
        clearTrigger,
        unlockWeapon,
        incCombo,
        resetCombo,
    }), [addGuilt, resetGuilt, signContract, clearTrigger, unlockWeapon, incCombo, resetCombo]);

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
