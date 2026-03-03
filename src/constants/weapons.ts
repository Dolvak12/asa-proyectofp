export interface Weapon {
    id: string;
    name: { es: string, en: string };
    description: { es: string, en: string };
    image: string;
    unlockAt: number;
}

export const WEAPONS_DATA: Weapon[] = [
    {
        id: "uniform_sword",
        name: { es: "Espada de Uniforme", en: "Uniform Sword" },
        description: {
            es: "Hacha de guerra creada con el uniforme escolar. Mortalmente afilada por la culpa.",
            en: "Battle axe created from the school uniform. Deadly sharp from guilt."
        },
        image: "EspadadeUniforme.png",
        unlockAt: 40,
    },
    {
        id: "aquarium_spear",
        name: { es: "Lanza de Acuario", en: "Aquarium Spear" },
        description: {
            es: "Forjada con un acuario entero. Contiene los restos de un millón de peces.",
            en: "Forged with an entire aquarium. Contains the remains of a million fish."
        },
        image: "LanzadeAcuario.png",
        unlockAt: 80,
    },
    {
        id: "rule_sword",
        name: { es: "Espada Regla", en: "Ruler Sword" },
        description: {
            es: "Un arma forjada con la disciplina y el castigo. Corta la realidad misma con precisión absoluta.",
            en: "A weapon forged with discipline and punishment. Cuts reality itself with absolute precision."
        },
        image: "EspadaRegla.png",
        unlockAt: 100,
    }
];
