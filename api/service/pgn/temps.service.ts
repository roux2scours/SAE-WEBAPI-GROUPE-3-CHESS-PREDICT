export interface TempsResult {
    score: number;
    totalParties: number;
    timeouts: number;
}

export function scoreGestionTempsDepuisPGNList(pgnList: string[]): TempsResult {
    let timeouts = 0;
    let totalParties = 0;

    for (const pgn of pgnList) {
        if (!pgn.trim()) continue;

        totalParties++;

        // Recherche du tag Termination "Time forfeit"
        const match = pgn.match(/\[Termination\s+"([^"]+)"\]/);

        if (match?.[1]?.includes("Time forfeit")) {
            timeouts++;
        }
    }

    if (totalParties === 0) {
        return {
            score: 100,
            totalParties: 0,
            timeouts: 0
        };
    }


    const brut = 100 - (timeouts / totalParties) * 100;
    const score = Math.round(Math.max(0, Math.min(100, brut)));

    return {
        score,
        totalParties,
        timeouts
    };
}