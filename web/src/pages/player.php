<?php
require_once __DIR__ . '/../config.php';

// 1. Récupération du nom du joueur
$playerName = $_GET['name'] ?? 'Inconnu';

// 2. Jeu de données étendu (simulation de base de données)
// Dans une vraie application, ces données viendraient d'une requête SQL
$all_players_data = [
    'Magnus Carlsen' => [
        'rank' => '#1',
        'stats' => [70, 20, 10], // Victoire, Défaite, Nulle
        'skills' => [
            'Force' => '99', 'Tactique' => '95', 'Jeu positionnel' => '98',
            'Gestion du temps' => '92', 'Ouverture' => '90', 'Milieu de jeu' => '97', 'Finale' => '99'
        ]
    ],
    'Fabiano Caruana' => [
        'rank' => '#2',
        'stats' => [60, 25, 15],
        'skills' => [
            'Force' => '94', 'Tactique' => '92', 'Jeu positionnel' => '96',
            'Gestion du temps' => '88', 'Ouverture' => '95', 'Milieu de jeu' => '93', 'Finale' => '90'
        ]
    ]
];

// 3. Extraction des données spécifiques au joueur sélectionné
$pData = $all_players_data[$playerName] ?? null;

if (!$pData) {
    echo "Joueur non trouvé.";
    exit;
}

// On prépare les variables pour playerCard.php
$labels = ['victoire', 'défaite', 'nulle'];
$stats_winrate = $pData['stats'];
$current_player_name = $playerName;
$current_player_rank = $pData['rank'];
$skills = $pData['skills'];

// 4. Inclusion du composant playerCard
include __DIR__ . '/../includes/playerCard.php';
?>