<?php require_once('../includes/header.php'); ?>

<main>
    <div class="container-fluid">
        <div class="flex-mt-20 flex-mb-20">
            <?php require_once('../includes/navbar.php'); ?>
        </div>

        <h5 class="flex-underline" style="margin-bottom: 15px;">Listagem de Cursos</h5>

        <div class="table-responsive">
            <table id="datatable" class="table table-sm table-striped align-middle"></table>
        </div>
    </div>

    <div class="modal fade" id="modal" tabindex="-1" aria-labelledby="modal_title" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modal_title" style="text-transform: uppercase;">Listagem de Inscritos</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

                <div id="div_modal_body" class="modal-body"></div>

                <div class="modal-footer">
                    <div id="div_modal_footer" style="width: 100%; text-align: left;"></div>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                    <button type="button" class="btn btn-primary">Ok</button>
                </div>
            </div>
        </div>
    </div>
</main>

<?php require_once('../includes/footer.php'); ?>

<script type="text/javascript" src="<?= BASE_URL; ?>/assets/js/cursos/cursos-controller.js"></script>