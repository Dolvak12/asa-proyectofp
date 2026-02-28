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
    }, [activePersona]);

    return null; // Componente invisible — como la influencia de Yoru
}
