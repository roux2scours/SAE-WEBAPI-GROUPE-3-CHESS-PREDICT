import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface TactiqueResult {
    score: number;
    coups: number;
    erreurs: number;
    imprecisions: number;
    brillants: number;
    bonsCoups: number;
}

/**
 * Calcule le score tactique d'une partie à partir de la base de données.:
 *  - "??" = gaffe
 *  - "?"  = erreur 
 *  - "?!" ou "!?" = imprécision
 *  - "!!" = brilliant
 *  - "!" = bon coup
 */
export async function scoreTactiqueDepuisDB(gameId: number): Promise<TactiqueResult> {
    // Récupération des coups de la partie
    const moves = await prisma.move.findMany({
        where: { gameId },
        orderBy: { ply: "asc" }
    });

    let erreurs = 0;
    let imprecisions = 0;
    let brillants = 0;
    let bonsCoups = 0;

    for (const move of moves) {
        const san = move.san ?? "";
        //on compte les erreurs, imprécisions, brillants et bons coups
        if (san.includes("??")) {
            erreurs++;
        } else if (san.includes("?!") || san.includes("!?")) {
            imprecisions++;
        } else if (san.includes("!!")) {
            brillants++;
        } else if (san.includes("!")) {
            bonsCoups++;
        }
    }

    const coups = moves.length;

    if (coups === 0) {
        return {
            score: 100,
            coups: 0,
            erreurs,
            imprecisions,
            brillants,
            bonsCoups
        };
    }


    // tactique = (1 - (E*2 + I - B*2 - F) / 100) * 100
    const penalite = erreurs * 2 + imprecisions - brillants * 2 - bonsCoups;
    const brut = (1 - penalite / 100) * 100;

    const score = Math.round(Math.max(0, Math.min(100, brut)));

    return {
        score,
        coups,
        erreurs,
        imprecisions,
        brillants,
        bonsCoups
    };
}
