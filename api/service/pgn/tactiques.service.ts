import { PrismaClient, Game, Move } from "@prisma/client";

const prisma = new PrismaClient();

export interface TactiqueScore {
    score: number;
    pointsGagnes: number;
    parties: number;
}

// Détermine la valeur de la capture selon la pièce capturée
function valeurCapture(san: string): number {
    // Capture d'un pion : exd5
    if (/^[a-h]x/.test(san)) return 1;

    // Capture par une pièce
    const piece = san[0];

    switch (piece) {
        case "N":
        case "B":
        case "R":
            return 2;
        case "Q":
            return 3;
        default:
            return 1;
    }
}

function estPromotion(san: string): boolean {
    return san.includes("=");
}

export async function scoreTactiqueDepuisDB(playerId: number): Promise<TactiqueScore> {
    const games = await prisma.game.findMany({
        where: {
            OR: [
                { whitePlayerId: playerId },
                { blackPlayerId: playerId }
            ]
        }
    });

    if (games.length === 0) {
        return { score: 100, pointsGagnes: 0, parties: 0 };
    }

    let pointsGagnes = 0;

    for (const game of games) {
        const moves = await prisma.move.findMany({
            where: { gameId: game.id },
            orderBy: { ply: "asc" }
        });

        const playerIsWhite = game.whitePlayerId === playerId;

        for (let i = 0; i < moves.length; i++) {
            const move = moves[i];

            const isPlayerMove =
                (move.ply % 2 === 1 && playerIsWhite) ||
                (move.ply % 2 === 0 && !playerIsWhite);

            if (!isPlayerMove) continue;

            // Le joueur capture ?
            if (!move.san.includes("x")) continue;

            const valeur = valeurCapture(move.san);

            // Vérifier si l’adversaire reprend dans les 2 demi-coups suivants
            let repris = false;
            for (let j = i + 1; j <= i + 2 && j < moves.length; j++) {
                const reply = moves[j];
                const replyIsOpponent =
                    (reply.ply % 2 === 1 && !playerIsWhite) ||
                    (reply.ply % 2 === 0 && playerIsWhite);

                if (replyIsOpponent && reply.san.includes("x")) {
                    repris = true;
                    break;
                }
            }

            // Vérifier si l’adversaire promu
            let promotion = false;
            for (let j = i + 1; j < moves.length; j++) {
                const reply = moves[j];
                const replyIsOpponent =
                    (reply.ply % 2 === 1 && !playerIsWhite) ||
                    (reply.ply % 2 === 0 && playerIsWhite);

                if (replyIsOpponent && estPromotion(reply.san)) {
                    promotion = true;
                    break;
                }
            }

            // Capture gagnante
            if (!repris && !promotion) {
                pointsGagnes += valeur;
            }
        }
    }

    const parties = games.length;
    const pointsMoy = pointsGagnes / parties;

    // Score final : calibré pour que les GM soient proches de 100
    const score = Math.min(100, Math.round(pointsMoy * 10));

    return {
        score,
        pointsGagnes,
        parties
    };
}
