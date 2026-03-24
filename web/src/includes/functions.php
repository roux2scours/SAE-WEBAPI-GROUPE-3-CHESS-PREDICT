<?php
// functions.php

function get_page()
{
    return isset($_GET['page']) ? $_GET['page'] : 'home';
}
?>