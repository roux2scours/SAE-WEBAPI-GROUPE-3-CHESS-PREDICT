export interface PositionnelResult {
    score: number;
    coups: number;
    gaffes: number;
    erreurs: number;
    imprecisions: number;
}

export function scorePositionnelDepuisPGN(pgn: string): PositionnelResult {
    const gaffes = (pgn.match(/\?\?/g) || []).length;
    const erreursBrutes = (pgn.match(/\?\?/g) || []).length;
    const erreurs = Math.max(0, erreursBrutes - gaffes);
    const imprecisions = (pgn.match(/\?!|!\?/g) || []).length;
    const coups = (pgn.match(/\d+\./g) || []).length;
    if (coups === 0) {
        return {
            score: 100,
            coups: 0,
            gaffes,
            erreurs,
            imprecisions,
        };
    }
    const penalite = gaffes * 3 + erreurs * 2 + imprecisions;
    const positionnel = (1 - penalite / 100) * 100;
    const score = Math.round(Math.max(0, Math.min(100, positionnel)));
    return {
        score,
        coups,
        gaffes,
        erreurs,
        imprecisions,
    };

}
