<?php
require_once __DIR__ . '/../config.php';

// 1. Jeu de données (Simulation de base de données)
$all_players = [
    ['name' => 'Magnus Carlsen', 'elo' => '2850', 'winrate' => '65%'],
    ['name' => 'Alireza Firouzja', 'elo' => '2780', 'winrate' => '60%'],
    ['name' => 'Hikaru Nakamura', 'elo' => '2800', 'winrate' => '62%'],
    ['name' => 'Ding Liren', 'elo' => '2790', 'winrate' => '58%'],
];

$games_database = [
    [
        'id' => 1,
        'white' => 'Magnus Carlsen',
        'black' => 'Hikaru Nakamura',
        'cadence' => 'blitz',
        'context' => 'tournament',
        'pgn' => '[Event "World Blitz"] [White "Carlsen"] [Black "Nakamura"] 1. e4 e5 2. Nf3 Nc6 3. Bb5 a6...'
    ],
    [
        'id' => 2,
        'white' => 'Alireza Firouzja',
        'black' => 'Magnus Carlsen',
        'cadence' => 'rapid',
        'context' => 'tournament',
        'pgn' => '[Event "Norway Chess"] [White "Firouzja"] [Black "Carlsen"] 1. d4 Nf6 2. c4 e6...'
    ]
];

// 2. Récupération sécurisée des paramètres GET
$selected_page    = $_GET['page'] ?? 'game';
$selected_white   = $_GET['white_player'] ?? '';
$selected_black   = $_GET['black_player'] ?? '';
$selected_cadence = $_GET['cadence'] ?? '';
$selected_context = $_GET['context'] ?? '';
$view_pgn_id      = $_GET['view_pgn'] ?? null;

// Trouver les infos des joueurs pour l'affichage des stats
$white_info = ['elo' => '----', 'winrate' => '----'];
$black_info = ['elo' => '----', 'winrate' => '----'];

foreach ($all_players as $p) {
    if ($p['name'] === $selected_white) $white_info = $p;
    if ($p['name'] === $selected_black) $black_info = $p;
}

// Construction de la base de l'URL pour les liens internes
$base_url = "index.php?page=game&white_player=" . urlencode($selected_white) . "&black_player=" . urlencode($selected_black) . "&cadence=" . urlencode($selected_cadence) . "&context=" . urlencode($selected_context);
?>

<form method="GET" action="index.php">
    <input type="hidden" name="page" value="game">

    <div class="game-selection">
        <div class="game-screen-left">
            <div class="game-screen-left-up">
                <div class="game-screen-white-selection">
                    <input type="text" name="white_player" list="players-list" 
                           placeholder="Joueur Blanc" class="game-player-selector" 
                           value="<?= htmlspecialchars($selected_white) ?>">
                    <div class="game-player-data">
                        <p class="game-player-data-elo"><?= $white_info['elo'] ?></p>
                        <p class="game-player-data-winrate"><?= $white_info['winrate'] !== '----' ? $white_info['winrate'] . " durant les 10 dernières parties" : "----" ?></p>
                    </div>
                </div>

                <div class="vs-container" style="text-align: center;">
                    <h1>VS</h1>
                    <button type="button" id="swap-players" style="cursor:pointer; padding: 5px 10px; border-radius: 50%;">⇄</button>
                </div>

                <div class="game-screen-black-selection">
                    <input type="text" name="black_player" list="players-list" 
                           placeholder="Joueur Noir" class="game-player-selector" 
                           value="<?= htmlspecialchars($selected_black) ?>">
                    <div class="game-player-data">
                        <p class="game-player-data-elo"><?= $black_info['elo'] ?></p>
                        <p class="game-player-data-winrate"><?= $black_info['winrate'] !== '----' ? $black_info['winrate'] . " durant les 10 dernières parties" : "----" ?></p>
                    </div>
                </div>
                
                <datalist id="players-list">
                    <?php foreach($all_players as $p): ?>
                        <option value="<?= htmlspecialchars($p['name']) ?>">
                    <?php endforeach; ?>
                </datalist>
            </div>

            <div class="game-screen-left-down">
                <select name="cadence" class="game-cadence-selector">
                    <option value="" disabled <?= empty($selected_cadence) ? 'selected' : '' ?>>Choisir une cadence</option>
                    <option value="blitz" <?= $selected_cadence == 'blitz' ? 'selected' : '' ?>>Blitz (5min)</option>
                    <option value="rapid" <?= $selected_cadence == 'rapid' ? 'selected' : '' ?>>Rapide (15min)</option>
                    <option value="classical" <?= $selected_cadence == 'classical' ? 'selected' : '' ?>>Classique (90min)</option>
                </select>
                
                <select name="context" class="game-context-selector">
                    <option value="" disabled <?= empty($selected_context) ? 'selected' : '' ?>>Choisir un contexte</option>
                    <option value="tournament" <?= $selected_context == 'tournament' ? 'selected' : '' ?>>Tournoi</option>
                    <option value="casual" <?= $selected_context == 'casual' ? 'selected' : '' ?>>Casual</option>
                    <option value="training" <?= $selected_context == 'training' ? 'selected' : '' ?>>Entraînement</option>
                </select>
                
                <input type="submit" value="Charger la partie" class="game-valide-button">
            </div>
        </div>

        <div class="game-separator"></div>

        <div class="game-screen-right">
            <div class="chessboard" id="display-area">
                <?php
                // 1. AFFICHAGE DU PGN (Si une partie est sélectionnée)
                if ($view_pgn_id) {
                    $game_to_show = null;
                    foreach ($games_database as $g) {
                        if ($g['id'] == $view_pgn_id) $game_to_show = $g;
                    }

                    if ($game_to_show): ?>
                        <div class="pgn-container">
                            <h3>PGN de la partie</h3>
                            <pre style="background: #f0f0f0; padding: 15px; border-radius: 5px; white-space: pre-wrap;"><?= htmlspecialchars($game_to_show['pgn']) ?></pre>
                            <a href="<?= $base_url ?>" class="back-link">← Retour à la liste</a>
                        </div>
                    <?php endif;

                } 
                // 2. RECHERCHE ACTIVE (Si les deux joueurs sont saisis)
                elseif (!empty($selected_white) && !empty($selected_black)) {
                    $results = array_filter($games_database, function($g) use ($selected_white, $selected_black, $selected_cadence, $selected_context) {
                        return $g['white'] === $selected_white && 
                            $g['black'] === $selected_black && 
                            (empty($selected_cadence) || $g['cadence'] === $selected_cadence) &&
                            (empty($selected_context) || $g['context'] === $selected_context);
                    });

                    $is_fallback = false;

                    // Si filtre vide, on prend tout entre ces deux joueurs
                    if (empty($results)) {
                        $results = array_filter($games_database, function($g) use ($selected_white, $selected_black) {
                            return $g['white'] === $selected_white && $g['black'] === $selected_black;
                        });
                        if (!empty($results)) {
                            shuffle($results);
                            $results = array_slice($results, 0, 10);
                            $is_fallback = true;
                        }
                    }

                    // Affichage des résultats de recherche
                    if (!empty($results)) {
                        echo $is_fallback ? "<p style='color:#856404; background:#fff3cd; padding:10px;'>⚠️ Aucun match précis. Voici des parties aléatoires entre eux :</p>" : "<h3>Parties trouvées :</h3>";
                        renderGameList($results, $base_url);
                    } else {
                        echo "<p style='text-align:center; padding-top: 50px;'>Aucune partie trouvée entre ces deux joueurs.</p>";
                    }

                } 
                // 3. AFFICHAGE PAR DÉFAUT (Si aucun joueur n'est sélectionné)
                else {
                    echo "<h3>Découvrir des parties aléatoires</h3>";
                    $random_games = $games_database;
                    shuffle($random_games);
                    $random_games = array_slice($random_games, 0, 10);
                    
                    // On utilise une URL de base vide pour le PGN par défaut
                    $default_url = "index.php?page=game";
                    renderGameList($random_games, $default_url);
                }

                // fonction d'aide pour éviter de répéter le code HTML de la liste
                function renderGameList($games, $url_prefix) {
                    echo "<ul class='game-results-list' style='list-style:none; padding:0;'>";
                    foreach ($games as $game) {
                        // On s'assure que le lien PGN fonctionne même sans recherche préalable
                        $link = (strpos($url_prefix, 'white_player') !== false) 
                                ? $url_prefix . "&view_pgn=" . $game['id'] 
                                : "index.php?page=game&white_player=".urlencode($game['white'])."&black_player=".urlencode($game['black'])."&view_pgn=" . $game['id'];
                        
                        echo "<li style='margin-bottom:8px;'>
                                <a href='$link' style='display:block; padding:10px; background:#eee; border-radius:4px; text-decoration:none; color:#333;'>
                                    <strong>{$game['white']}</strong> vs <strong>{$game['black']}</strong> 
                                    <small style='color:#666;'>(" . ucfirst($game['cadence']) . ")</small>
                                </a>
                            </li>";
                    }
                    echo "</ul>";
                }
                ?>
            </div>
        </div>
    </div>
</form>

<script>
const playersData = <?= json_encode($all_players) ?>;

document.addEventListener('DOMContentLoaded', () => {
    const whiteInput = document.querySelector('input[name="white_player"]');
    const blackInput = document.querySelector('input[name="black_player"]');
    const swapBtn = document.getElementById('swap-players');

    function updateStats(input, side) {
        const playerName = input.value;
        const player = playersData.find(p => p.name === playerName);
        // On cible le container parent spécifique (white ou black)
        const container = input.closest(`.game-screen-${side}-selection`);
        
        if (!container) return; // Sécurité

        const eloP = container.querySelector('.game-player-data-elo');
        const winrateP = container.querySelector('.game-player-data-winrate');

        if (player) {
            eloP.textContent = player.elo;
            winrateP.textContent = player.winrate + " durant les 10 dernières parties";
        } else {
            eloP.textContent = "----";
            winrateP.textContent = "----";
        }
    }

    // On écoute 'input' pour le clavier ET 'change' pour le clic dans la datalist
    ['input', 'change'].forEach(evt => {
        whiteInput.addEventListener(evt, () => updateStats(whiteInput, 'white'));
        blackInput.addEventListener(evt, () => updateStats(blackInput, 'black'));
    });

    swapBtn.addEventListener('click', () => {
        const tempName = whiteInput.value;
        whiteInput.value = blackInput.value;
        blackInput.value = tempName;

        updateStats(whiteInput, 'white');
        updateStats(blackInput, 'black');
    });
});
</script>