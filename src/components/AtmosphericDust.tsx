"use client";

import { useEffect, useRef } from "react";
import { useGuiltState } from "@/context/GuiltContext";

/**
 * AtmosphericDust — Partículas Zero-Crash (Canvas API)
 * 
 * Partículas calculadas y dibujadas directamente en la CPU mediante un solo
 * elemento Canvas, sin sobrecargar la GPU ni el árbol DOM del navegador.
 * - Asa: Ceniza blanca que cae lentamente.
 * - Yoru: Chispas rojas que suben velozmente (Fuego de Guerra).
 */
export default function AtmosphericDust() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { activePersona } = useGuiltState();
    const isYoru = activePersona === "Yoru";

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d", { alpha: true });
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Array<{
            x: number;
            y: number;
            size: number;
            speedY: number;
            speedX: number;
            opacity: number;
            life: number;
        }> = [];

        // Ajustar Canvas al tamaño de la ventana
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        const initParticles = () => {
            particles = [];
            const isMobile = window.innerWidth < 768;
            const numParticles = isMobile ? 30 : 60; // Pocas partículas = rendimiento perfecto

            for (let i = 0; i < numParticles; i++) {
                particles.push(createParticle(true));
            }
        };

        const createParticle = (randomizeY = false) => {
            return {
                x: Math.random() * canvas.width,
                y: randomizeY ? Math.random() * canvas.height : (isYoru ? canvas.height + 10 : -10),
                size: Math.random() * (isYoru ? 3 : 2) + 0.5, // Chispas más grandes, ceniza más fina
                speedY: isYoru ? -(Math.random() * 2 + 1) : (Math.random() * 0.5 + 0.2), // Yoru sube rápido, Asa cae lento
                speedX: Math.random() * 1 - 0.5, // Movimiento oscilante lateral
                opacity: Math.random() * 0.5 + 0.2, // Transparencia base
                life: Math.random() * 100 // Para cálculos de parpadeo
            };
        };

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((p, index) => {
                // Mover partícula
                p.y += p.speedY;
                p.x += Math.sin(p.life * 0.05) * p.speedX; // Oscilación natural
                p.life++;

                // Dibujar
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

                if (isYoru) {
                    // Chispas de fuego: Rojas y Naranjas brillantes
                    ctx.fillStyle = `rgba(220, 20, 60, ${p.opacity})`;
                } else {
                    // Cenizas: Blancas/Grises opacas
                    ctx.fillStyle = `rgba(200, 200, 200, ${p.opacity})`;
                }

                ctx.fill();

                // Reciclar partículas que salen de la pantalla
                if (isYoru && p.y < -10) {
                    particles[index] = createParticle(false);
                } else if (!isYoru && p.y > canvas.height + 10) {
                    particles[index] = createParticle(false);
                }
            });

            animationFrameId = requestAnimationFrame(render);
        };

        window.addEventListener("resize", resizeCanvas);
        resizeCanvas();
        render();

        return () => {
            window.removeEventListener("resize", resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, [isYoru]); // Se reinicia suavemente al cambiar de personaje

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0"
            style={{ mixBlendMode: isYoru ? "screen" : "normal" }} // Chispas se ven como fuego
        />
    );
}
