<?php include_once('../config.php'); ?>

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title><?= TITLE; ?></title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />
        <link rel="stylesheet" href="<?= BASE_URL; ?>/assets/bootstrap/css/bootstrap-5.3.3.min.css">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css">
        <link rel="stylesheet" href="<?= BASE_URL; ?>/assets/dataTables/css/dataTables.bootstrap5.css">
        <link rel="stylesheet" href="<?= BASE_URL; ?>/assets/css/custom.css">
    </head>
    
    <body>
        <div class="flex-header">
            <div class="flex-header-item"><?= TITLE; ?></div>

            <div class="flex-header-item">
                <span id="mensagem_cumprimento"></span>
            </div>
        </div>

        <div class="flex-header-logo">
            <img src="<?= BASE_URL; ?>/assets/images/logotipo_cidex.png" alt="Logotipo do Centro de Idiomas do Exército">
            <img src="<?= BASE_URL; ?>/assets/images/logotipo_exercito.png" alt="Logotipo do Exército Brasileiro">
        </div>