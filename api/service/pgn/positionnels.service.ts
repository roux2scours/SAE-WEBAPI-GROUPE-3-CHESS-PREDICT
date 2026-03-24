import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface PositionnelResult {
    score: number;
    coups: number;
    gaffes: number;
    erreurs: number;
    imprecisions: number;
}

/**
 * Calcule le score positionnel d'une partie à partir de la base de données.
 * Les annotations sont directement lues dans Move.san :
 *  - "??" = gaffe
 *  - "?"  = erreur 
 *  - "?!" ou "!?" = imprécision
 */
export async function scorePositionnelDepuisDB(gameId: number): Promise<PositionnelResult> {
    // Récupération des coups de la partie
    const moves = await prisma.move.findMany({
        where: { gameId },
        orderBy: { ply: "asc" }
    });

    let gaffes = 0;
    let erreurs = 0;
    let imprecisions = 0;
    // on compte les erreurs, imprécisions et gaffes
    for (const move of moves) {
        const san = move.san ?? "";

        if (san.includes("??")) {
            gaffes++;
        } else if (san.includes("?!") || san.includes("!?")) {
            imprecisions++;
        } else if (san.includes("?")) {
            erreurs++;
        }
    }

    const coups = moves.length;

    if (coups === 0) {
        return {
            score: 100,
            coups: 0,
            gaffes,
            erreurs,
            imprecisions
        };
    }

    // positionnel = (1 - (G*3 + E*2 + I) / T) * 100
    const penalite = gaffes * 3 + erreurs * 2 + imprecisions;
    const brut = (1 - penalite / coups) * 100;

    const score = Math.round(Math.max(0, Math.min(100, brut)));

    return {
        score,
        coups,
        gaffes,
        erreurs,
        imprecisions
    };
}
