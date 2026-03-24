/** * Définition des interfaces pour les bibliothèques externes 
 * car nous ne passons pas par des modules npm (@types/...)
 */
interface ChessInstance {
    load_pgn(pgn: string): boolean;
    history(options?: { verbose: boolean }): string[] | Move[];
    fen(): string;
    move(move: string | Move): Move | null;
    undo(): Move | null;
    reset(): void;
}

interface Move {
    from: string;
    to: string;
    san: string; // ex: "Nf3"
}

interface BoardConfig {
    position: string;
    draggable: boolean;
    pieceTheme: string;
}

interface BoardInstance {
    position(fen: string): void;
}

// Déclarations globales pour le window
declare const Chess: {
    new(): ChessInstance;
};

declare const Chessboard: (id: string, config: BoardConfig) => BoardInstance;

interface Window {
    pgnData?: string;
}

class ChessReviewer {
    private readonly game: ChessInstance;
    private readonly board: BoardInstance;
    private readonly history: (string | Move)[];
    private currentIndex: number = -1;

    constructor(elementId: string, pgn: string) {
        this.game = new Chess();

        const success: boolean = this.game.load_pgn(pgn);
        if (!success) {
            console.error("PGN Invalide ou corrompu.");
            // On initialise un historique vide pour éviter les crashs
            this.history = [];
            this.board = Chessboard(elementId, {
                position: 'start',
                draggable: false,
                pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png'
            });
            return;
        }

        // On récupère l'historique complet avant de reset pour la lecture
        this.history = this.game.history();
        this.game.reset();

        this.board = Chessboard(elementId, {
            position: 'start',
            draggable: false,
            pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png'
        });

        this.initEventListeners();
    }

    private initEventListeners(): void {
        const prevBtn = document.getElementById('prevBtn') as HTMLButtonElement | null;
        const nextBtn = document.getElementById('nextBtn') as HTMLButtonElement | null;

        prevBtn?.addEventListener('click', () => this.goToPrevious());
        nextBtn?.addEventListener('click', () => this.goToNext());

        window.addEventListener('keydown', (e: KeyboardEvent): void => {
            if (e.key === "ArrowRight") this.goToNext();
            if (e.key === "ArrowLeft") this.goToPrevious();
        });
    }

    public goToNext(): void {
        if (this.currentIndex < this.history.length - 1) {
            this.currentIndex++;
            const move = this.history[this.currentIndex];
            this.game.move(move);
            this.board.position(this.game.fen());
        }
    }

    public goToPrevious(): void {
        if (this.currentIndex >= 0) {
            this.game.undo();
            this.board.position(this.game.fen());
            this.currentIndex--;
        }
    }
}

// Lancement sécurisé
window.addEventListener('DOMContentLoaded', () => {
    const pgn = (window as any).pgnData; // Cast léger ici car injecté par PHP
    if (pgn) {
        new ChessReviewer('board', pgn);
    }
});