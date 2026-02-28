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

interface GuiltContextType {
    /** Nivel de culpa actual (0-100). El combustible del War Devil. */
    guilt: number;
    /** Incrementa la culpa. Cada interacción dolorosa alimenta a Yoru. */
    addGuilt: (amount: number) => void;
    /** Resetea la culpa a 0. Un momento de paz temporal para Asa. */
    resetGuilt: () => void;
    /** Firma el contrato final para ceder el control a Yoru. */
    signContract: () => void;
    /** Indica si el contrato ha sido firmado. */
    isContractSigned: boolean;
    /** Quién domina el DOM ahora: Asa (humana) o Yoru (demonio). */
    activePersona: Persona;
    /** Indica si se acaba de activar el trigger de Yoru (para el efecto glitch). */
    justTriggered: boolean;
    /** Limpia el flag de trigger después de que el glitch se reproduzca. */
    clearTrigger: () => void;
    /** Armas desbloqueadas por Yoru. */
    weapons: string[];
    /** Desbloquea un arma específica. */
    unlockWeapon: (weaponId: string) => void;
    /** Combo actual de clics/interacciones. */
    combo: number;
    /** Incrementa el combo. */
    incCombo: () => void;
    /** Resetea el combo. */
    resetCombo: () => void;
}

const GuiltContext = createContext<GuiltContextType | undefined>(undefined);

/**
 * GuiltProvider — Envuelve la aplicación en la dualidad Asa/Yoru.
 */
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
        setGuilt((prev) => {
            const next = Math.min(prev + amount, 100);
            return next;
        });
    }, []);

    const unlockWeapon = useCallback((weaponId: string) => {
        setWeapons((prev) => {
            if (prev.includes(weaponId)) return prev;
            return [...prev, weaponId];
        });
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

    const incCombo = useCallback(() => {
        setCombo(prev => prev + 1);
    }, []);

    const resetCombo = useCallback(() => {
        setCombo(0);
    }, []);

    const clearTrigger = useCallback(() => {
        setJustTriggered(false);
    }, []);

    // La persona activa depende de si el contrato fue firmado.
    const activePersona: Persona = useMemo(
        () => (isContractSigned ? "Yoru" : "Asa"),
        [isContractSigned]
    );

    const value = useMemo(
        () => ({
            guilt,
            addGuilt,
            resetGuilt,
            signContract,
            isContractSigned,
            activePersona,
            justTriggered,
            clearTrigger,
            weapons,
            unlockWeapon,
            combo,
            incCombo,
            resetCombo,
        }),
        [guilt, addGuilt, resetGuilt, signContract, isContractSigned, activePersona, justTriggered, clearTrigger, weapons, unlockWeapon, combo, incCombo, resetCombo]
    );

    return (
        <GuiltContext.Provider value={value}>{children}</GuiltContext.Provider>
    );
}

/**
 * useGuilt — Hook para acceder al estado de culpa desde cualquier componente.
 *
 * Como la voz de Yoru susurrando en la mente de Asa,
 * este hook permite que cualquier parte de la interfaz
 * "escuche" el nivel de culpa y reaccione en consecuencia.
 */
export function useGuilt(): GuiltContextType {
    const context = useContext(GuiltContext);
    if (!context) {
        throw new Error(
            "useGuilt debe usarse dentro de un GuiltProvider. " +
            "¿Intentas escapar del santuario? No hay escapatoria."
        );
    }
    return context;
}
