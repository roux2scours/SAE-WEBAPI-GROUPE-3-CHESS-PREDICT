<link rel="stylesheet" href="https://unpkg.com/@chrisoakman/chessboardjs@1.0.0/dist/chessboard-1.0.0.min.css">
<style>
    .chess-container {
        max-width: 450px;
        margin: 20px auto;
        font-family: sans-serif;
    }

    #board {
        width: 100%;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    }

    .controls {
        display: flex;
        justify-content: space-between;
        margin-top: 15px;
    }

    .btn-nav {
        flex: 1;
        padding: 12px;
        margin: 0 5px;
        background: #312e2b;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
    }

    .btn-nav:hover {
        background: #45413e;
    }
</style>

<div class="chess-container">
    <div id="board"></div>
    <div class="controls">
        <button id="prevBtn" class="btn-nav">
            < </button>
                <button id="nextBtn" class="btn-nav"> > </button>
    </div>
</div>

<script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
<script src="https://unpkg.com/@chrisoakman/chessboardjs@1.0.0/dist/chessboard-1.0.0.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/chess.js/0.10.3/chess.min.js"></script>

<script>
    // On transmet le PGN de PHP à JS
    window.pgnData = `<?php echo $pgnToLoad ?? ''; ?>`;
</script>
<script src="dist/viewer.js"></script>