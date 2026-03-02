"use client";

import { useGuilt } from "@/context/GuiltContext";
import { useEffect } from "react";

// ============================================================
// THEME SWITCHER — El reflejo visual de la posesión demoníaca
// ============================================================
// Este componente aplica el atributo data-persona al <html>
// para activar el tema CSS correcto según quién controla.
// Es como un interruptor nervioso que cambia el "color"
// de toda la realidad cuando Yoru toma el control.
// ============================================================

export default function ThemeSwitcher() {
    const { activePersona } = useGuilt();

    useEffect(() => {
        // Inyectar el tema activo en el elemento raíz del DOM
        // Cuando Yoru toma posesión, TODA la página se transforma
        document.documentElement.setAttribute("data-persona", activePersona);

        // Actualizar dinámicamente el color de la barra del celular (PWA/Mobile Browser)
        let metaThemeColor = document.querySelector("meta[name=theme-color]");
        if (!metaThemeColor) {
            metaThemeColor = document.createElement("meta");
            metaThemeColor.setAttribute("name", "theme-color");
            document.head.appendChild(metaThemeColor);
        }
        metaThemeColor.setAttribute("content", activePersona === "Yoru" ? "#0A0A0A" : "#F6F6F2");
    }, [activePersona]);

    return null; // Componente invisible — como la influencia de Yoru
}
