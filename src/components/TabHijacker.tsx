"use client";

import { useEffect } from "react";
import { useGuiltState } from "@/context/GuiltContext";

/**
 * TabHijacker — Manipulación Meta-Horror
 * 
 * Cambia el título y el favicon de la pestaña cuando el usuario se va a otra página,
 * reaccionando de forma distinta si Asa o Yoru tienen el control.
 */
export default function TabHijacker() {
    const { activePersona } = useGuiltState();
    const isYoru = activePersona === "Yoru";

    useEffect(() => {
        const originalTitle = document.title;
        // Obtenemos el favicon original que Next.js inyecta (usualmente icon o apple-touch-icon)
        let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");

        if (!link) {
            link = document.createElement("link");
            link.rel = "icon";
            document.head.appendChild(link);
        }

        const originalFavicon = link.href;

        // Favicons falsos generados con Emojis usando SVG data URI
        const yoruFavicon = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">👁️</text></svg>`;
        const asaFavicon = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🥀</text></svg>`;

        const handleVisibilityChange = () => {
            if (document.hidden) {
                // El usuario abandonó la pestaña
                if (isYoru) {
                    document.title = "TE ESTOY VIENDO";
                    link!.href = yoruFavicon;
                } else {
                    document.title = "Por favor, no me dejes sola...";
                    link!.href = asaFavicon;
                }
            } else {
                // El usuario regresó
                document.title = originalTitle;
                link!.href = originalFavicon;
            }
        };

        // Escuchar cambios de visibilidad
        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            // Restaurar por si acaso el componente se desmonta mientras está oculta
            document.title = originalTitle;
            link!.href = originalFavicon;
        };
    }, [isYoru]);

    return null; // Componente lógico, no renderiza nada en la vista
}
