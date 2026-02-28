export interface Weapon {
    id: string;
    name: string;
    description: string;
    image: string;
    unlockAt: number;
}

export const WEAPONS_DATA: Weapon[] = [
    {
        id: "uniform_sword",
        name: "Espada de Uniforme",
        description: "Hacha de guerra creada con el uniforme escolar. Mortalmente afilada por la culpa.",
        image: "EspadadeUniforme.png",
        unlockAt: 40,
    },
    {
        id: "aquarium_spear",
        name: "Lanza de Acuario",
        description: "Forjada con un acuario entero. Contiene los restos de un millón de peces.",
        image: "LanzadeAcuario.png",
        unlockAt: 80,
    },
    {
        id: "rule_sword",
        name: "Espada Regla",
        description: "Un arma forjada con la disciplina y el castigo. Corta la realidad misma con precisión absoluta.",
        image: "EspadaRegla.png",
        unlockAt: 100,
    }
];
