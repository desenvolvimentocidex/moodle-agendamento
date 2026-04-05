<?php require_once('../includes/header.php'); ?>

<main>
    <div class="container-fluid">
        <div class="flex-mt-20 flex-mb-20">
            <?php require_once('../includes/navbar.php'); ?>
        </div>

        <h5 class="flex-underline" style="margin-bottom: 15px;">
            <i class="bi bi-file-earmark-text-fill text-right"></i>Relatórios
        </h5>

        <div class="row">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title flex-card-title text-bg-danger">Inscritos</h5>
                
                        <div id="div_relatorios_inscritos"></div>
                    </div>
                </div>
            </div>

            <div class="col-md-6">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title flex-card-title text-bg-danger">Agendados</h5>
                
                        <div id="div_relatorios_agendados"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>

<?php require_once('../includes/footer.php'); ?>

<script type="text/javascript" src="<?= BASE_URL; ?>/assets/js/relatorios/relatorios-controller.js"></script>