<?php
require_once 'config.php';
?>

<nav>
    <div class="nav-container">
        <div class="logo">
            <img src="<?php echo LOGO_URL; ?>" alt="Logo <?php echo SITE_NAME; ?>" class="logo-img">
        </div>
        <div class="site-title"><?php echo $page_name; ?></div>

        <ul class="nav-links">
            <li><a href="?page=leaderboard">Leaderboard</a></li>
            <li><a href="?page=game">Voir une partie</a></li>
            <li><a href="?page=dev">Simuler un affrontement</a></li>
        </ul>
    </div>
</nav>