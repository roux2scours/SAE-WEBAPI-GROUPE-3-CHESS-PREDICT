<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../includes/leaderboardTemplate.php';

// Jeu de données fictif pour les différentes catégories
$data_blitz = [
    ['name' => 'Hikaru Nakamura', 'elo' => 2900, 'last10' => [true, true, true, false, true, true, true, true, true, true]],
    ['name' => 'Magnus Carlsen', 'elo' => 2880, 'last10' => [true, true, false, true, true, true, false, true, true, true]],
];

$data_rapid = [
    ['name' => 'Magnus Carlsen', 'elo' => 2840, 'last10' => [true, false, true, true, true, true, true, false, true, true]],
    ['name' => 'Jan-Krzysztof Duda', 'elo' => 2790, 'last10' => [true, true, true, true, false, false, true, true, true, false]],
];

$data_classical = [
    ['name' => 'Magnus Carlsen', 'elo' => 2850, 'last10' => [true, true, false, true, true, false, true, true, true, false]],
    ['name' => 'Fabiano Caruana', 'elo' => 2800, 'last10' => [true, false, true, true, false, true, true, false, true, true]],
];
?>

<link rel="stylesheet" href="../assets/css/leaderboard.css">

<div class="global-leaderboard-wrapper">
    <?php 
        // On affiche les 3 tableaux avec la même structure mais des données différentes
        renderLeaderboard("Blitz (5 min)", $data_blitz);
        renderLeaderboard("Rapide (15 min)", $data_rapid);
        renderLeaderboard("Classique (plus de 1h)", $data_classical); 
    ?>
</div>