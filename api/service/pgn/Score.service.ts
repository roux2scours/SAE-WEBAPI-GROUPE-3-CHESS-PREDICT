export interface scoreGloblal {
    score: number;
    positionnel: number;
    tactique: number;
    gestionTemps: number;
    phases: number;
}

export function calculScoreGlobal(positionnel: number, tactique: number, gestionTemps: number, phases: number): scoreGloblal {
    const score = Math.round((positionnel + tactique + gestionTemps + phases) / 4);
    return {
        score,
        positionnel,
        tactique,
        gestionTemps,
        phases
    };
}