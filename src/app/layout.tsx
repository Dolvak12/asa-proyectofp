import type { Metadata } from "next";
import { Inter, Creepster } from "next/font/google";
import "./globals.css";
import { GuiltProvider } from "@/context/GuiltContext";
import Header from "@/components/Header";
import ThemeSwitcher from "@/components/ThemeSwitcher";

// ============================================================
// FUENTES — Las voces visuales de cada personalidad
// ============================================================

/** Inter: La voz de Asa. Limpia, redondeada, legible.
 * Como su deseo de ser normal, de encajar sin llamar la atención. */
const inter = Inter({
  variable: "--font-inter-var",
  subsets: ["latin"],
  display: "swap",
});

/** Creepster: La voz de Yoru. Distorsionada, agresiva, amenazante.
 * Como las palabras de un demonio de la guerra susurradas con violencia. */
const creepster = Creepster({
  variable: "--font-creepster-var",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

// ============================================================
// METADATA — SEO para el Santuario
// ============================================================
export const metadata: Metadata = {
  title: "Guilty Sanctuary — Asa Mitaka × Yoru Fan Experience",
  description:
    "Experimenta la dualidad de Asa Mitaka y el Demonio de la Guerra Yoru. " +
    "Una fanpage interactiva de Chainsaw Man donde tu culpa alimenta el poder demoníaco.",
  keywords: [
    "Chainsaw Man",
    "Asa Mitaka",
    "Yoru",
    "War Devil",
    "fanpage",
    "interactiva",
    "Tatsuki Fujimoto",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} ${creepster.variable} antialiased`}>
        {/* GuiltProvider envuelve TODO — como Yoru habita TODO el cuerpo de Asa */}
        <GuiltProvider>
          {/* ThemeSwitcher aplica el tema activo al <html> */}
          <ThemeSwitcher />
          {/* Header persistente con el Guilt Meter */}
          <Header />
          {/* Contenido principal — el padding superior se maneja en el componente page.tsx */}
          <main className="min-h-screen transition-colors duration-700">
            {children}
          </main>
        </GuiltProvider>
      </body>
    </html>
  );
}
