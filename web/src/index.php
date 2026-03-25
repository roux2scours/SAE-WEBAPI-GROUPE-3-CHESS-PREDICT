<?php
require_once 'config.php';
require_once 'includes/functions.php';

$page = get_page();

// Inclure le header et la navigation
include 'includes/header.php';
include 'includes/nav.php';

// Router - Charger la bonne page
switch ($page) {
    case 'test':
        include 'pages/test.php';
        break;
    case 'game':
        include 'pages/game.php';
        break;
}

// Inclure le footer
include 'includes/footer.php';
?>