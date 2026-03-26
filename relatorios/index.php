<?php require_once('../includes/header.php'); ?>

<main>
    <div class="container-fluid">
        <div class="flex-mt-20 flex-mb-20">
            <?php require_once('../includes/navbar.php'); ?>
        </div>

        <h5 class="flex-underline" style="margin-bottom: 15px;">Relatórios</h5>

        <div id="div_relatorios"></div>
    </div>
</main>

<?php require_once('../includes/footer.php'); ?>

<script type="text/javascript" src="<?= BASE_URL; ?>/assets/js/relatorios/relatorios-controller.js"></script>