import { PrismaClient, Game } from "@prisma/client";

const prisma = new PrismaClient();

export interface PhasesScore {
    ouverture: number;
    milieu: number;
    finale: number;
}

/**
 * Détermine dans quelle phase la partie s'est terminée.
 */
function getPhaseOfTermination(movesCount: number): "ouverture" | "milieu" | "finale" {
    const coups = Math.ceil(movesCount / 2);

    if (coups <= 10) return "ouverture";
    if (coups <= 40) return "milieu";
    return "finale";
}

/**
 * Analyse toutes les parties d’un joueur et calcule les scores de phases.
 * Règles :
 * - Ouverture = coups 1 à 10
 * - Milieu = coups 11 à 40
 * - Finale = coups 41+
 * - Si le joueur perd dans une phase → -1 point pour cette phase
 * - Score final = 100 - (défaites_phase / total_parties) * 100
 */
export async function scorePhasesDepuisDB(playerId: number): Promise<PhasesScore> {
    const games: Game[] = await prisma.game.findMany({
        where: {
            OR: [
                { whitePlayerId: playerId },
                { blackPlayerId: playerId }
            ]
        }
    });

    if (games.length === 0) {
        return {
            ouverture: 100,
            milieu: 100,
            finale: 100
        };
    }

    let defOuverture = 0;
    let defMilieu = 0;
    let defFinale = 0;

    for (const game of games) {
        const movesCount = await prisma.move.count({
            where: { gameId: game.id }
        });

        const phase = getPhaseOfTermination(movesCount);

        const playerIsWhite = game.whitePlayerId === playerId;
        const playerLost =
            (playerIsWhite && game.result === "0-1") ||
            (!playerIsWhite && game.result === "1-0");

        if (playerLost) {
            if (phase === "ouverture") defOuverture++;
            else if (phase === "milieu") defMilieu++;
            else defFinale++;
        }
    }

    const total = games.length;

    function score(defaites: number): number {
        return Math.max(0, Math.round(100 - (defaites / total) * 100));
    }

    return {
        ouverture: score(defOuverture),
        milieu: score(defMilieu),
        finale: score(defFinale)
    };
}
