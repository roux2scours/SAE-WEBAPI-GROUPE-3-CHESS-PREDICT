<?php
require_once 'config.php';

// Données fictives pour les joueurs (à remplacer par l'API plus tard)
$players = [
    [
        'name' => 'Magnus Carlsen',
        'elo' => 2850,
        'last10' => [true, true, false, true, true, false, true, true, true, false]
    ],
    [
        'name' => 'Fabiano Caruana',
        'elo' => 2800,
        'last10' => [true, false, true, true, false, true, true, false, true, true]
    ],
    [
        'name' => 'Ding Liren',
        'elo' => 2780,
        'last10' => [false, true, true, true, true, false, true, true, false, true]
    ],
    [
        'name' => 'Ian Nepomniachtchi',
        'elo' => 2760,
        'last10' => [true, true, false, false, true, true, true, false, true, true]
    ],
    [
        'name' => 'Wesley So',
        'elo' => 2740,
        'last10' => [true, false, true, true, false, true, false, true, true, true]
    ],
    [
        'name' => 'Anish Giri',
        'elo' => 2720,
        'last10' => [false, true, true, false, true, true, true, false, true, false]
    ],
    [
        'name' => 'Viswanathan Anand',
        'elo' => 2700,
        'last10' => [true, true, false, true, false, true, true, true, false, true]
    ],
    [
        'name' => 'Levon Aronian',
        'elo' => 2680,
        'last10' => [true, false, true, true, true, false, false, true, true, true]
    ],
    [
        'name' => 'Shakhriyar Mamedyarov',
        'elo' => 2660,
        'last10' => [false, true, false, true, true, true, false, true, true, false]
    ],
    [
        'name' => 'Maxime Vachier-Lagrave',
        'elo' => 2640,
        'last10' => [true, true, true, false, true, false, true, true, false, true]
    ]
];
?>

<link rel="stylesheet" href="../assets/css/leaderboard.css">

<div class="leaderboard-container">
    <h1 class="leaderboard-title">Top 10 Joueurs - Classique</h1>
    <table class="leaderboard-table">
        <thead>
            <tr>
                <th>Rang</th>
                <th>Nom</th>
                <th>Derniers 10 Matchs</th>
                <th>ELO</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($players as $index => $player): ?>
                <tr>
                    <td class="rank"><?php echo $index + 1; ?></td>
                    <td class="player-name"><?php echo htmlspecialchars($player['name']); ?></td>
                    <td class="match-history">
                        <?php foreach ($player['last10'] as $result): ?>
                            <span class="match-result <?php echo $result ? 'win' : 'loss'; ?>"></span>
                        <?php endforeach; ?>
                    </td>
                    <td class="elo"><?php echo $player['elo']; ?></td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
</div>

