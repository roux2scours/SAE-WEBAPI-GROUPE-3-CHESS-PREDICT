import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface PhaseScores {
    ouverture: number;
    milieu: number;
    finale: number;
}

// Analyse ouverture / milieu / finale à partir de la base de données.
export async function scorePhasesDepuisDB(gameId: number): Promise<PhaseScores> {
    // Récupération des coups
    const moves = await prisma.move.findMany({
        where: { gameId },
        orderBy: { ply: "asc" }
    });

    const totalCoups = moves.length;

    if (totalCoups === 0) {
        return { ouverture: 100, milieu: 100, finale: 100 };
    }

    // Découpage
    const ouvertureFin = Math.min(20, totalCoups);          // 20 demi-coups(les 10 premiers coups)
    const finaleDebut = Math.floor(totalCoups * 0.8);       // les 20% derniers coups

    const penOuverture = { g: 0, e: 0, i: 0 };
    const penMilieu = { g: 0, e: 0, i: 0 };
    const penFinale = { g: 0, e: 0, i: 0 };

    // On parcourt tous les coups et on attribue les pénalités à la phase correspondante
    for (let i = 0; i < moves.length; i++) {
        const san = moves[i].san ?? "";
        const demiCoup = i + 1;

        const target =
            demiCoup <= ouvertureFin
                ? penOuverture
                : demiCoup >= finaleDebut
                    ? penFinale
                    : penMilieu;

        if (san.includes("??")) {
            target.g++;
        } else if (san.includes("?!") || san.includes("!?")) {
            target.i++;
        } else if (san.includes("?")) {
            target.e++;
        }
    }

    const coupsOuverture = ouvertureFin;
    const coupsFinale = totalCoups - finaleDebut;
    const coupsMilieu = totalCoups - coupsOuverture - coupsFinale;

    function calcScore(p: { g: number; e: number; i: number }, coups: number): number {
        if (coups <= 0) return 100;
        const penalite = p.g * 3 + p.e * 2 + p.i;
        const brut = (1 - penalite / coups) * 100;
        return Math.round(Math.max(0, Math.min(100, brut)));
    }

    return {
        ouverture: calcScore(penOuverture, coupsOuverture),
        milieu: calcScore(penMilieu, coupsMilieu),
        finale: calcScore(penFinale, coupsFinale)
    };
}
