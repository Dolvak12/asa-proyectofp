"use client";

import { useRef, useCallback } from "react";

/**
 * ZER0-CRASH AUDIO HOOK
 * 
 * Genera efectos de sonido mediante Web Audio API puro.
 * No requiere archivos MP3/WAV, no carga la red y no sobrecarga la GPU.
 * Debe inicializarse tras la primera interacción del usuario.
 */
export function useAudio() {
    const audioCtxRef = useRef<AudioContext | null>(null);

    const initAudio = useCallback(() => {
        if (typeof window === "undefined") return;
        if (!audioCtxRef.current) {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioContext) {
                audioCtxRef.current = new AudioContext();
            }
        }
        // Los navegadores requieren reanudar el contexto de audio tras una interacción
        if (audioCtxRef.current?.state === "suspended") {
            audioCtxRef.current.resume();
        }
    }, []);

    // 1. Latido del Corazón (Subgrave resonante)
    const playHeartbeat = useCallback(() => {
        if (!audioCtxRef.current) return;
        const ctx = audioCtxRef.current;

        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        // ONDA SENOIDAL MUY BAJA (Sub-bass)
        osc.type = "sine";
        osc.frequency.setValueAtTime(45, ctx.currentTime);           // Empieza en 45Hz
        osc.frequency.exponentialRampToValueAtTime(10, ctx.currentTime + 0.1); // Baja a 10Hz rápido

        // CONTORNO DE VOLUMEN (Punch y decay)
        const volume = 0.5;
        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.15);
    }, []);

    // 2. Corte de Espada (Manga Slash Swoosh)
    const playSlash = useCallback(() => {
        if (!audioCtxRef.current) return;
        const ctx = audioCtxRef.current;

        const duration = 0.25;
        const bufferSize = ctx.sampleRate * duration;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);

        // Ruido blanco
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        // Filtro pasa-banda barriendo hacia abajo (efecto "Swooshh")
        const bandpass = ctx.createBiquadFilter();
        bandpass.type = "bandpass";
        bandpass.frequency.setValueAtTime(6000, ctx.currentTime);
        bandpass.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + duration);
        bandpass.Q.value = 1.5;

        const gainNode = ctx.createGain();
        const volume = 0.3;
        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

        noise.connect(bandpass);
        bandpass.connect(gainNode);
        gainNode.connect(ctx.destination);

        noise.start(ctx.currentTime);
        noise.stop(ctx.currentTime + duration);
    }, []);

    // 3. Estática Glitch (Para los ojos de Yoru)
    const playGlitch = useCallback(() => {
        if (!audioCtxRef.current) return;
        const ctx = audioCtxRef.current;

        const duration = 0.08;
        const bufferSize = ctx.sampleRate * duration;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);

        // Ruido agresivo pero recortado
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.4;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        // Filtro pasa-altos para que suene como crujido eléctrico
        const highpass = ctx.createBiquadFilter();
        highpass.type = "highpass";
        highpass.frequency.value = 2000;

        const gainNode = ctx.createGain();
        const volume = 0.2;
        gainNode.gain.setValueAtTime(volume, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

        noise.connect(highpass);
        highpass.connect(gainNode);
        gainNode.connect(ctx.destination);

        noise.start(ctx.currentTime);
        noise.stop(ctx.currentTime + duration);
    }, []);

    return { initAudio, playHeartbeat, playSlash, playGlitch };
}
