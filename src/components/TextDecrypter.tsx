"use client";

import { useState, useEffect, useRef } from "react";
import { useGuiltState, useGuiltActions } from "@/context/GuiltContext";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+{}|:<>?/=~";

interface Props {
    text: string;
    speed?: number; // ms per frame
    className?: string;
}

/**
 * TextDecrypter — Cifrado Cibernético
 * Muestra símbolos aleatorios que se descifran a texto legible cuando el usuario
 * interactúa (hover). Solo se activa bajo la influencia de Yoru.
 */
export default function TextDecrypter({ text, speed = 30, className = "" }: Props) {
    const { activePersona } = useGuiltState();
    const { playGlitch } = useGuiltActions();
    const isYoru = activePersona === "Yoru";

    const [displayText, setDisplayText] = useState(text);
    const [isDecrypting, setIsDecrypting] = useState(false);
    const [hasDecrypted, setHasDecrypted] = useState(false);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Si Entra Yoru, encriptamos el texto y lo dejamos así hasta el hover
    useEffect(() => {
        if (isYoru && !hasDecrypted) {
            setDisplayText(
                text.split("").map(char =>
                    char === " " ? " " : CHARS[Math.floor(Math.random() * CHARS.length)]
                ).join("")
            );
        } else {
            setDisplayText(text);
            setHasDecrypted(false);
        }
    }, [isYoru, text, hasDecrypted]);

    const startDecryption = () => {
        if (!isYoru || isDecrypting || hasDecrypted) return;

        setIsDecrypting(true);
        playGlitch(); // Disparamos el sonido inmersivo

        let iteration = 0;
        const maxIterations = text.length;

        clearInterval(intervalRef.current!);

        intervalRef.current = setInterval(() => {
            setDisplayText(prev => {
                return text.split("").map((char, index) => {
                    if (char === " ") return " ";
                    if (index < iteration) {
                        return text[index];
                    }
                    return CHARS[Math.floor(Math.random() * CHARS.length)];
                }).join("");
            });

            if (iteration >= maxIterations) {
                clearInterval(intervalRef.current!);
                setIsDecrypting(false);
                setHasDecrypted(true);
            }

            iteration += 1 / 3; // Ralentizamos un poco el descifrado para gozar el efecto
        }, speed);
    };

    // Cleanup and auto-decrypt after 3 seconds for accessibility
    useEffect(() => {
        const autoTimer = setTimeout(() => {
            if (isYoru && !hasDecrypted && !isDecrypting) {
                startDecryption();
            }
        }, 3000);

        return () => {
            clearInterval(intervalRef.current!);
            clearTimeout(autoTimer);
        };
    }, [isYoru, hasDecrypted, isDecrypting]);

    return (
        <span
            className={`${className} ${isDecrypting ? "animate-pulse text-[#DC143C]" : ""} origin-center transition-colors duration-100 cursor-crosshair`}
            onMouseEnter={startDecryption}
            onClick={startDecryption}
            onTouchStart={startDecryption}
            style={{ textShadow: isDecrypting ? "2px 2px 0px #0ff, -2px -2px 0px #f00" : "none" }}
        >
            {displayText}
        </span>
    );
}
