import { PrismaClient } from "@prisma/client";
import { scoreTactiqueDepuisDB } from "./tactique.service";
import { scorePositionnelDepuisDB } from "./positionnel.service";
import { scorePhasesDepuisDB } from "./phases.service";
import { scoreGestionTempsDepuisDB } from "./temps.service";

const prisma = new PrismaClient();

export interface GlobalScores {
    tactique: number;
    positionnel: number;
    ouverture: number;
    milieu: number;
    finale: number;
    temps: number;
}

// Analyse toutes les parties d’un joueur et calcule les scores globaux.

export async function analyserToutesLesPartiesDepuisDB(playerId: number): Promise<GlobalScores> {
    // Récupération de toutes les parties du joueur
    const games = await prisma.game.findMany({
        where: {
            OR: [
                { whitePlayerId: playerId },
                { blackPlayerId: playerId }
            ]
        },
        orderBy: { date: "asc" }
    });

    if (games.length === 0) {
        return {
            tactique: 100,
            positionnel: 100,
            ouverture: 100,
            milieu: 100,
            finale: 100,
            temps: 100
        };
    }

    let totalCoupsTactique = 0;
    let totalCoupsPositionnel = 0;
    let totalCoupsOuverture = 0;
    let totalCoupsMilieu = 0;
    let totalCoupsFinale = 0;

    let sommeTactique = 0;
    let sommePositionnel = 0;
    let sommeOuverture = 0;
    let sommeMilieu = 0;
    let sommeFinale = 0;

    for (const game of games) {
        const gameId = game.id;

        //  TACTIQUE 
        const tact = await scoreTactiqueDepuisDB(gameId);
        sommeTactique += tact.score * tact.coups;
        totalCoupsTactique += tact.coups;

        //  POSITIONNEL 
        const pos = await scorePositionnelDepuisDB(gameId);
        sommePositionnel += pos.score * pos.coups;
        totalCoupsPositionnel += pos.coups;

        //  OUVERTURE / MILIEU / FINALE 
        const phases = await scorePhasesDepuisDB(gameId);

        // On doit recalculer le nombre de coups
        const movesCount = await prisma.move.count({ where: { gameId } });

        const ouvertureFin = Math.min(20, movesCount);
        const finaleDebut = Math.floor(movesCount * 0.8);

        const coupsOuverture = ouvertureFin;
        const coupsFinale = movesCount - finaleDebut;
        const coupsMilieu = movesCount - coupsOuverture - coupsFinale;

        sommeOuverture += phases.ouverture * coupsOuverture;
        sommeMilieu += phases.milieu * coupsMilieu;
        sommeFinale += phases.finale * coupsFinale;

        totalCoupsOuverture += coupsOuverture;
        totalCoupsMilieu += coupsMilieu;
        totalCoupsFinale += coupsFinale;
    }

    // ---GESTION DU TEMPS 
    const temps = await scoreGestionTempsDepuisDB(playerId);

    function moyenne(somme: number, coups: number): number {
        if (coups === 0) return 100;
        return Math.round(somme / coups);
    }

    return {
        tactique: moyenne(sommeTactique, totalCoupsTactique),
        positionnel: moyenne(sommePositionnel, totalCoupsPositionnel),
        ouverture: moyenne(sommeOuverture, totalCoupsOuverture),
        milieu: moyenne(sommeMilieu, totalCoupsMilieu),
        finale: moyenne(sommeFinale, totalCoupsFinale),
        temps: temps.score
    };
}
