# ⚔️ Guilty Sanctuary

[![Next.js](https://img.shields.io/badge/Framework-Next.js-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Animations-Framer_Motion-E10098?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)

**Guilty Sanctuary** es una experiencia web interactiva e inmersiva basada en la Parte 2 de *Chainsaw Man*. Explora la fragilidad mental de **Asa Mitaka** y la presencia dominante del **Demonio de la Guerra (Yoru)** a través de una interfaz que reacciona a tus interacciones.

---

## 🎭 La Experiencia Dual

El sitio web no es estático; habita la conciencia compartida de Asa y Yoru.

### ✧ Modo Asa (Santuario)
Un espacio melancólico, limpio y minimalista. Refleja el deseo de Asa por una vida normal, cargada de culpa y monólogos internos.
- **Visuales**: Bordes redondeados, colores claros, tipografía legible.
- **Interacción**: Cada clic o interacción aumenta el medidor de culpa.

### ⚔️ Modo Yoru (Guerra)
Al alcanzar el punto máximo de culpa, Yoru toma el control total del sitio.
- **Visuales**: Estética agresiva, bordes afilados, colores rojo sangre y negro profundo, aberración cromática y efectos de glitch.
- **Ambiente**: La música cambia, aparecen ojos observándote desde la oscuridad y la "Armería de Guerra" se desbloquea.

---

## 🛠️ Características Principales

- **Medidor de Culpa Dinámico**: Una barra de progreso persistente que rastrea tu interacción y desencadena la transformación del sitio.
- **Morenita (Mascota)**: Un pequeño pececito (Mascota de Yoru) que navega aleatoriamente por la pantalla en modo Guerra, alentando a su señora.
- **Text Decrypter**: Los pensamientos de Yoru aparecen encriptados y se revelan solo al pasar el cursor, simulando la intrusión demoníaca.
- **Easter Eggs y Códigos**: Usa la llave **🔑** o el teclado para introducir códigos secretos (YORU, ASA, POCHITA) y desencadenar efectos especiales.
- **Manga Haptics**: Transiciones cinemáticas tipo "slash" que imitan el paso de las hojas de un manga.

---

## 🚀 Configuración Técnica

### Requisitos
- Node.js 18+ 
- npm / yarn / pnpm

### Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/Dolvak12/asa-proyectofp.git
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

4. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 🏗️ Stack Tecnológico

- **Framework**: Next.js 14 (App Router)
- **Animaciones**: Framer Motion
- **Estilos**: Tailwind CSS
- **Estado Global**: React Context (GuiltContext)
- **Audio**: Web Audio API / Hooks de audio personalizados

---

Realizado con 🖤 para los fans de Chainsaw Man.
