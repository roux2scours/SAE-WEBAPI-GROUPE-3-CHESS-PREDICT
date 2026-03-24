export interface TactiqueResult {
    score: number;
    coups: number;
    erreurs: number;
    imprecisions: number;
    brillants: number;
    bonsCoups: number;
}

export function scoreTactiqueDepuisPGN(pgn: string): TactiqueResult {
    const erreurs = (pgn.match(/\?\?/g) || []).length;
    const imprecisions = (pgn.match(/\?!|!\?/g) || []).length;
    const brillants = (pgn.match(/\!\!/g) || []).length;

    const totalExclamations = (pgn.match(/!/g) || []).length;
    const bonsCoups = totalExclamations - brillants * 2;

    const coups = (pgn.match(/\d+\./g) || []).length;

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

    const penalite = erreurs * 2 + imprecisions - brillants * 2 - bonsCoups;
    const tactique = (1 - penalite / 100) * 100;

    const score = Math.round(Math.max(0, Math.min(100, tactique)));

    return {
        score,
        coups,
        erreurs,
        imprecisions,
        brillants,
        bonsCoups
    };
}
