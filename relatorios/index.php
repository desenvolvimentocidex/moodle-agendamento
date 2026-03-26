<?php require_once('../includes/header.php'); ?>

<main>
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

    <div class="container">
        <div class="flex-mb-20">
            <?php require_once('../includes/navbar.php'); ?>
        </div>

        <h5 class="flex-underline" style="margin-bottom: 15px;">Relatórios</h5>

        <div id="div_relatorios"></div>
    </div>
</main>

<?php require_once('../includes/footer.php'); ?>

<script type="text/javascript" src="<?= BASE_URL; ?>/assets/js/relatorios/relatorios-controller.js"></script>