export interface PhaseScores {
    ouverture: number;
    milieu: number;
    finale: number;
}

export function scorePhasesDepuisPGN(pgn: string): PhaseScores {
    // Extraction des coups SAN
    const moves = [...pgn.matchAll(/\d+\.\s*([^\s]+)(?:\s+([^\s]+))?/g)]
        .flatMap(m => [m[1], m[2]])
        .filter(Boolean);

    const totalCoups = moves.length;
    if (totalCoups === 0) {
        return { ouverture: 100, milieu: 100, finale: 100 };
    }

    // Découpage simple
    const ouvertureFin = Math.min(20, totalCoups); // 20 demi-coups
    const finaleDebut = Math.floor(totalCoups * 0.8); // dernier 20%

    // Pénalités par phase
    const penOuverture = { g: 0, e: 0, i: 0 };
    const penMilieu = { g: 0, e: 0, i: 0 };
    const penFinale = { g: 0, e: 0, i: 0 };

    for (let i = 0; i < moves.length; i++) {
        const san = moves[i]!;
        const demiCoup = i + 1;

        const target =
            demiCoup <= ouvertureFin
                ? penOuverture
                : demiCoup >= finaleDebut
                    ? penFinale
                    : penMilieu;

        if (san.includes("??")) target.g++;
        else if (san.includes("?") && !san.includes("??")) target.e++;
        else if (san.includes("?!") || san.includes("!?")) target.i++;
    }

    function calcScore(p: { g: number; e: number; i: number }, coups: number): number {
        if (coups <= 0) return 100;
        const penalite = p.g * 3 + p.e * 2 + p.i;
        const brut = (1 - penalite / coups) * 100;
        return Math.round(Math.max(0, Math.min(100, brut)));
    }

    const coupsOuverture = ouvertureFin;
    const coupsFinale = totalCoups - finaleDebut;
    const coupsMilieu = totalCoups - coupsOuverture - coupsFinale;

    return {
        ouverture: calcScore(penOuverture, coupsOuverture),
        milieu: calcScore(penMilieu, coupsMilieu),
        finale: calcScore(penFinale, coupsFinale)
    };
}
