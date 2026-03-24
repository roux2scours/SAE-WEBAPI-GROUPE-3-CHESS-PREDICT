import { PrismaClient, Game } from "@prisma/client";

const prisma = new PrismaClient();

export interface TempsResult {
    score: number;
    totalParties: number;
    timeouts: number;
}

// Calcule le score de gestion du temps pour un joueur en analysant toutes ses parties dans la base de données.

export async function scoreGestionTempsDepuisDB(playerId: number): Promise<TempsResult> {
    // Récupération de toutes les parties du joueur
    const games: Game[] = await prisma.game.findMany({
        where: {
            OR: [
                { whitePlayerId: playerId },
                { blackPlayerId: playerId }
            ]
        }
    });

    const totalParties = games.length;

    if (totalParties === 0) {
        return {
            score: 100,
            totalParties: 0,
            timeouts: 0
        };
    }

    const timeouts = games.filter((g: Game) => g.termination === "Time forfeit").length;

    const brut = 100 - (timeouts / totalParties) * 100;
    const score = Math.round(Math.max(0, Math.min(100, brut)));

    return {
        score,
        totalParties,
        timeouts
    };
}
