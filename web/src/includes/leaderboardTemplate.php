<?php
/**
 * Affiche un tableau de classement pour une catégorie spécifique.
 * * @param string $title Le titre de la catégorie (ex: Blitz, Rapide)
 * @param array $players Le tableau de données des joueurs
 */
function renderLeaderboard($title, $players) { ?>
    <div class="leaderboard-container">
        <h1 class="leaderboard-title"><?php echo htmlspecialchars($title); ?></h1>
        <table class="leaderboard-table">
            <thead>
                <tr class="head">
                    <th>Rang</th>
                    <th>Nom</th>
                    <th>Derniers 10 Matchs</th>
                    <th>ELO</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($players as $index => $player): ?>
                    <?php
                    // Détermination de la classe CSS pour le rang
                    $rowClass = 'last';
                    if ($index == 0) $rowClass = 'first';
                    else if ($index == 1) $rowClass = 'second';
                    else if ($index == 2) $rowClass = 'third';

                    // Détermination de l'ID pour l'alternance des couleurs
                    $rowId = '';
                    if ($index > 2 && $index != 9) {
                        $rowId = ($index % 2 == 0) ? 'dark' : 'light';
                    }

                    // URL vers la page du joueur
                    $playerUrl = "index.php?page=player&name=" . urlencode($player['name']);
                    ?>

                    <tr class="<?php echo $rowClass; ?>" 
                        <?php echo !empty($rowId) ? "id=\"$rowId\"" : ""; ?>
                        onclick="window.location='<?php echo $playerUrl; ?>'" 
                        style="cursor:pointer;">
                        
                        <td class="rank"><?php echo $index + 1; ?></td>
                        
                        <td class="player-name">
                            <a href="<?php echo $playerUrl; ?>" style="text-decoration:none; color:inherit;">
                                <?php echo htmlspecialchars($player['name']); ?>
                            </a>
                        </td>
                        
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
<?php } ?>