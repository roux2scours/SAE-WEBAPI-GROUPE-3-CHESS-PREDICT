<div class="player-card">
    <div class="player-card-head">
        <p class="player-card-name"><?= htmlspecialchars($current_player_name) ?></p>
        <a href="index.php" class="player-card-rank"><?= $current_player_rank ?></a>
    </div>
    <div class="player-card-horizontal-bar"></div>
    <div class="player-card-graphique">
        <canvas class="chart-canvas" 
            data-chart-label="Winrate"
            data-chart-labels='<?= json_encode($labels) ?>'
            data-chart-data='<?= json_encode($stats_winrate) ?>'>
        </canvas>
    </div>
    <div class="player-card-facultes">
        <?php foreach ($skills as $label => $score): ?>
            <div class="player-card-faculte">
                <p><?= $label ?> : </p>
                <p class="player-card-faculte-score"><?= $score ?></p>
            </div>
        <?php endforeach; ?>
    </div>
</div>