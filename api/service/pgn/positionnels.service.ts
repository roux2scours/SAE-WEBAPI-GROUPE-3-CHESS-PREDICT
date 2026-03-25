import { PrismaClient, Game, Move } from "@prisma/client";

const prisma = new PrismaClient();

export interface PositionnelScore {
    score: number;
    perteTotale: number;
    parties: number;
}

function valeurPiece(piece: string): number {
    switch (piece) {
        case "P": return 1; // pion
        case "N": return 2; // cavalier
        case "B": return 2; // fou
        case "R": return 2; // tour
        case "Q": return 3; // dame
        default: return 0;
    }
}

function pieceCapturee(san: string): string | null {
    // Exemples SAN : "Nxe5", "Bxd4", "exd5", "Qxh7"
    if (!san.includes("x")) return null;

    // Si c'est un pion : "exd5"
    if (/^[a-h]x/.test(san)) return "P";

    // Sinon la pièce est la première lettre
    const piece = san[0];
    if ("NBRQ".includes(piece!)) return piece!;

    return null;
}

function estPromotion(san: string): boolean {
    return san.includes("=");
}

export async function scorePositionnelDepuisDB(playerId: number): Promise<PositionnelScore> {
    const games: Game[] = await prisma.game.findMany({
        where: {
            OR: [
                { whitePlayerId: playerId },
                { blackPlayerId: playerId }
            ]
        }
    });

    if (games.length === 0) {
        return { score: 100, perteTotale: 0, parties: 0 };
    }

    let perteTotale = 0;

    for (const game of games) {
        const moves: Move[] = await prisma.move.findMany({
            where: { gameId: game.id },
            orderBy: { ply: "asc" }
        });

        const playerIsWhite = game.whitePlayerId === playerId;

        for (let i = 0; i < moves.length; i++) {
            const move = moves[i];

            const isPlayerMove = (move.ply % 2 === 1 && playerIsWhite) ||
                (move.ply % 2 === 0 && !playerIsWhite);

            const isOpponentMove = !isPlayerMove;

            // Si l'adversaire capture une pièce du joueur
            if (isOpponentMove) {
                const piece = pieceCapturee(move.san);
                if (piece) {
                    const valeur = valeurPiece(piece);

                    // Vérifier si le joueur reprend dans les 2 demi-coups suivants
                    let repris = false;
                    for (let j = i + 1; j <= i + 2 && j < moves.length; j++) {
                        const reply = moves[j];
                        const replyIsPlayer = (reply.ply % 2 === 1 && playerIsWhite) ||
                            (reply.ply % 2 === 0 && !playerIsWhite);

                        if (replyIsPlayer && reply.san.includes("x")) {
                            repris = true;
                            break;
                        }
                    }

                    // Vérifier si le joueur promeut un pion
                    let promotion = false;
                    for (let j = i + 1; j < moves.length; j++) {
                        const reply = moves[j];
                        const replyIsPlayer = (reply.ply % 2 === 1 && playerIsWhite) ||
                            (reply.ply % 2 === 0 && !playerIsWhite);

                        if (replyIsPlayer && estPromotion(reply.san)) {
                            promotion = true;
                            break;
                        }
                    }

                    if (!repris && !promotion) {
                        perteTotale += valeur;
                    }
                }
            }
        }
    }

    const parties = games.length;
    const brut = 100 - (perteTotale / parties) * 10;
    const score = Math.max(0, Math.min(100, Math.round(brut)));

    return {
        score,
        perteTotale,
        parties
    };
}
