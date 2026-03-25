<?php
require_once 'config.php';
require_once 'includes/functions.php';

$page = get_page();

// Router - Charger la bonne page
switch ($page) {
    case 'test':
        include 'pages/test.php';
        $page_name = "Page de test";
        break;
    case 'game':
        include 'pages/game.php';
        $page_name = "Voir une partie";
        break;
    case 'player':
        include 'pages/player.php';
        $page_name = "Joueur";
        break;
    default :
        include 'pages/leaderboard.php';
        $page_name = "Leaderboard";
        break;
}

// Inclure le header et la navigation
include 'includes/header.php';
include 'includes/nav.php';


// Inclure le footer
include 'includes/footer.php';
?>