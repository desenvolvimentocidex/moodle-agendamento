var solicitacaoPlanosViagem = SuperWidget.extend({
	table: null,
	mydata: [],
	arrItensPlanejamento: [],
	arrPoliticas: [],
    init: function() {
		//Verifica se a widget está no modo de visualização
    	if (!this.isEditMode) {
			var custom_loader = $('#custom_loader');
			custom_loader.hide();

			$('.wcm-navigation').removeClass('wcm-menu-background');
			$('#wcm-content').removeClass('wcm-background');
			$('#wcm-content').css('background-color', '#e7f4ff');
			$('#wcm_footer').hide();

			var dataAtual = this.fnRetornarDataAtual();

			var filtro_data_inicial = $('#filtro_data_inicial');
			var filtro_data_final = $('#filtro_data_final');

			filtro_data_inicial.val(dataAtual);
			filtro_data_final.val(dataAtual);

			$(filtro_data_inicial).mask('99/99/9999', { reverse: true } );
			$(filtro_data_final).mask('99/99/9999', { reverse: true } );

			this.fnCarregarTabelaDinamica();
    	}
    },
    bindings: {
        local: {},
        global: {
			'btn-abrir-menu': ['click_fnControle'],
			'btn-fechar-menu': ['click_fnControle'],
			'btn-aprovar-menu': ['click_fnAprovar'],
			'btn-assumir-tarefa-menu': ['click_fnAssumirTarefa'],
			'btn-filtrar': ['click_fnControle'],
			'btn-limpar': ['click_fnControle'],
			'btn-aprovar': ['click_fnAprovar'],
			'cbx-selecionar-todos': ['click_fnControle'],
			'cbx-selecionar-unico': ['click_fnControle'],
			'btn-itens-planejamento': ['click_fnControle'],
			'btn-politicas': ['click_fnControle'],
			'btn-assumir-tarefa': ['click_fnAssumirTarefa']
		}
    },
    fnCarregarTabelaDinamica: function() {
		var that = this;

		while (that.mydata.length > 0) {
			that.mydata.pop()
		}

		var userOAuth = that.fnRetornarCadastroUsuarioIntegracao("FLUIG");

		var userCode = that.fnRetornarUsuariosFluigWCMAPI("userCode");
		//console.log(userCode);

		var constraints = new Array();

		constraints.push(DatasetFactory.createConstraint("responsavelSolicitacao", userCode, userCode, ConstraintType.MUST));

		var oauth = OAuth({
			consumer: {
				key: userOAuth.OAUTH_KEY,
				secret: userOAuth.OAUTH_SECRET
			},
			signature_method: 'HMAC-SHA1',
			hash_function: function (base_string, key) {
				return CryptoJS.HmacSHA1(base_string, key).toString(CryptoJS.enc.Base64);
			},
			nonce_length: 6
		});

		var request_data = {
			url: userOAuth.HOST_NAME + '/api/public/ecm/dataset/datasets',
			method: 'POST'
		};

		var data = {
			"name": 'dsRetornarPlanosFluigAprovacaoMassa',
			"fields": [],
			"constraints": constraints,
			"order": []
		};

		var token = {
			key: userOAuth.TOKEN_KEY,
			secret: userOAuth.TOKEN_SECRET
		};
		
		$.ajax({
			url: request_data.url,
			contentType: 'application/json',
			crossDomain: true,
			async: true,
			type: request_data.method,
			data: JSON.stringify(data),
			headers: oauth.toHeader(oauth.authorize(request_data, token)),
			beforeSend : function() {
				console.log('Carregando... Aguardando retorno do sistema Fluig.');
			}
		}).done(function(data) {
			if (data) {
				//console.log(data);
				
				that.fnAutenticacaoReserve();

				var dataVal = $(data.content)[0].values;
				console.log(dataVal);

				for (var i in dataVal) {
					/*var obj = {
						userGroup: dataVal[i].responsavel_solicitacao, //Caso o campo responsavel_solicitacao seja um Grupo de Uusários
						group1: {
							name: "Pool:Group:G_GETI_TOTVS",
							replaceName: "G_GETI_TOTVS"
						},
						group2: {
							name: "Pool:Group:w_AnaFinanceiras_RIO",
							replaceName: "w_AnaFinanceiras_RIO"
						}
					}

					var btn_assumir_tarefa = $("#btn_assumir_tarefa");

					if (obj.userGroup == obj.group1.name) {
						var userGroup = that.fnRetornarGrupoUsuarioFluig(userCode, obj.group1.replaceName);
						console.log("Grupo1: " + userGroup.groupId);
						
						if (userCode == userGroup.colleagueId) {
							btn_assumir_tarefa_menu.removeClass('flex-disabled');
							btn_assumir_tarefa.removeClass("flex-display-none");
						}
					}

					if (obj.userGroup == obj.group2.name) {
						var userGroup = that.fnRetornarGrupoUsuarioFluig(userCode, obj.group2.replaceName);
						console.log("Grupo2: " + userGroup.groupId);

						if (userCode == userGroup.colleagueId) {
							btn_assumir_tarefa_menu.removeClass('flex-disabled');
							btn_assumir_tarefa.removeClass("flex-display-none");
						}
					}*/

					that.mydata.push({
						/*00*/ 	cbx: '<input type="checkbox" id="cbx_selecionar_unico' + dataVal[i].solicitacao + '" name="cbx-select-single[]" value="' + dataVal[i].solicitacao + '" class="cbx-select-single" title="Selecionar Solicitação" data-cbx-selecionar-unico>',
						/********** CAMPOS OCULTOS **********/
						/*01*/ 	plano_id: dataVal[i].plano_id,
						/*02*/ 	plano_status: dataVal[i].plano_status,
						/*03*/ 	planejamento_status: dataVal[i].planejamento_status,
						/*04*/ 	solicitante_id: dataVal[i].solicitante_id,
						/*05*/ 	cod_usuario_solicitante: dataVal[i].cod_usuario_solicitante,
						/*06*/ 	solicitante: dataVal[i].solicitante,
						/*07*/ 	solicitante_email: dataVal[i].solicitante_email,
						/*08*/ 	favorecido_id: dataVal[i].favorecido_id,
						/*09*/ 	cod_usuario_favorecido: dataVal[i].cod_usuario_favorecido,
						/*10*/ 	favorecido_email: dataVal[i].favorecido_email,
						/*11*/ 	solicitacao: dataVal[i].solicitacao,
						/*12*/ 	cod_filial: dataVal[i].cod_filial,
						/*13*/ 	nome_filial: dataVal[i].nome_filial,
						/*14*/ 	gestor_ccusto: dataVal[i].gestor_ccusto,
						/*15*/ 	analise_GSP: dataVal[i].analise_GSP,
						/*16*/ 	analise_GEF: dataVal[i].analise_GEF,
						/*17*/ 	analise_VPF_SG: dataVal[i].analise_VPF_SG,
						/*18*/ 	politica_cumprida_total: dataVal[i].politica_cumprida_total,
						/*19*/ 	politica_violada_total: dataVal[i].politica_violada_total,
						/*20*/ 	num_atividade: dataVal[i].num_atividade,
						/*21*/ 	mobile: dataVal[i].mobile,
						/*22*/ 	hostname: dataVal[i].hostname,
						/********** CAMPOS VISÍVEIS **********/
						/*23*/ 	tipo_viagem: dataVal[i].tipo_viagem,
						/*24*/ 	tipo_plano: dataVal[i].tipo_plano,
						/*25*/ 	favorecido: dataVal[i].favorecido,
						/*26*/ 	ccusto: dataVal[i].ccusto,
						/*27*/ 	lotacao: dataVal[i].lotacao,
						/*28*/ 	matricula: dataVal[i].matricula,
						/*29*/ 	cpf: dataVal[i].cpf,
						/*30*/ 	data_nascimento: dataVal[i].data_nascimento,
						/*31*/ 	beneficiario: dataVal[i].beneficiario,
						/*32*/ 	motivo_viagem: dataVal[i].motivo_viagem,
						/*33*/ 	compromisso_data_inicio: dataVal[i].compromisso_data_inicio,
						/*34*/ 	compromisso_hora_inicio: dataVal[i].compromisso_hora_inicio,
						/*35*/ 	compromisso_data_termino: dataVal[i].compromisso_data_termino,
						/*36*/ 	compromisso_hora_termino: dataVal[i].compromisso_hora_termino,
						/*37*/ 	compromisso_local_evento: dataVal[i].compromisso_local_evento,
						/*38*/ 	diaria_quantidade: dataVal[i].diaria_quantidade,
						/*39*/ 	observacoes: dataVal[i].observacoes,
						/*40*/ 	data_solicitacao: dataVal[i].data_solicitacao,
						/*41*/ 	vigencia_plano_data_inicio: dataVal[i].vigencia_plano_data_inicio,
						/*42*/ 	vigencia_plano_data_fim: dataVal[i].vigencia_plano_data_fim,
						/*43*/ 	responsavel_solicitacao: dataVal[i].responsavel_solicitacao,
						/*44*/ 	status_solicitacao: dataVal[i].status_solicitacao,
						/*45*/ 	politicas: {
									cumprida: dataVal[i].politica_cumprida_total,
									violada: dataVal[i].politica_violada_total
								},
						/*46*/ 	valor_total_final: that.fnConverterMoedaPTBRFloat(dataVal[i].valor_total_final)
					});
				}		

				//Remover registros duplicados e/ou repetidos
				values = that.mydata.filter(function(a) {
					return !this[JSON.stringify(a)] && (this[JSON.stringify(a)] = true);
				}, Object.create(null));
				
				console.log(values);

				var table = $('#table_' + that.instanceId).DataTable({
					"data": values,
					"language": {
						//"url": "https://cdn.datatables.net/plug-ins/1.11.5/i18n/pt-BR.json",
						"url": "/wg_solicitacao_planos_viagem/resources/js/pt-BR.json"
						//"searchPlaceholder": "Pesquisar"
					},
					"columnDefs": [
						{ "targets": 0, "visible": true, "orderable": false }, //CHECKBOX
						/********** CAMPOS OCULTOS **********/
						{ "targets": 1, "visible": false },                    //plano_id
						{ "targets": 2, "visible": false },                    //plano_status
						{ "targets": 3, "visible": false },                    //planejamento_status
						{ "targets": 4, "visible": false },                    //solicitante_id
						{ "targets": 5, "visible": false },                    //cod_usuario_solicitante
						{ "targets": 6, "visible": false },                    //solicitante
						{ "targets": 7, "visible": false },                    //solicitante_email
						{ "targets": 8, "visible": false },                    //favorecido_id
						{ "targets": 9, "visible": false },                    //cod_usuario_favorecido
						{ "targets": 10, "visible": false },                   //favorecido_email
						{ "targets": 11, "visible": true },                    //solicitacao (IDFLUIG)
						{ "targets": 12, "visible": false },                   //cod_filial
						{ "targets": 13, "visible": false },                   //nome_filial
						{ "targets": 14, "visible": false },                   //gestor_ccusto
						{ "targets": 15, "visible": false },                   //analise_GSP
						{ "targets": 16, "visible": false },                   //analise_GEF
						{ "targets": 17, "visible": false },                   //analise_VPF_SG
						{ "targets": 18, "visible": false },                   //politica_cumprida_total
						{ "targets": 19, "visible": false },                   //politica_violada_total
						{ "targets": 20, "visible": false },                   //num_atividade
						{ "targets": 21, "visible": false },                   //mobile
						{ "targets": 22, "visible": false },                   //hostname
						/********** CAMPOS VISÍVEIS **********/
						{ "targets": 23, "visible": false },                   //tipo_viagem
						{ "targets": 24, "visible": false },                   //tipo_plano
						{ "targets": 25, "visible": true },                    //favorecido
						{ "targets": 26, "visible": false },                   //ccusto
						{ "targets": 27, "visible": true },                    //lotacao
						{ "targets": 28, "visible": false },                   //matricula
						{ "targets": 29, "visible": false },                   //cpf
						{ "targets": 30, "visible": false },                   //data_nascimento
						{ "targets": 31, "visible": false },                   //beneficiario
						{ "targets": 32, "visible": false },                   //motivo_viagem
						{ "targets": 33, "visible": false },                   //compromisso_data_inicio
						{ "targets": 34, "visible": false },                   //compromisso_hora_inicio 
						{ "targets": 35, "visible": false },                   //compromisso_data_termino
						{ "targets": 36, "visible": false },                   //compromisso_hora_termino
						{ "targets": 37, "visible": false },                   //compromisso_local_evento
						{ "targets": 38, "visible": false },                   //diaria_quantidade
						{ "targets": 39, "visible": false },                   //observacoes
						{ "targets": 40, "visible": true },                    //data_solicitacao
						{ "targets": 41, "visible": false },                   //vigencia_plano_data_inicio
						{ "targets": 42, "visible": false },                   //vigencia_plano_data_fim
						{ "targets": 43, "visible": true },                    //responsavel_solicitacao
						{ "targets": 44, "visible": false },                   //status_solicitacao
						{ "targets": 45, "visible": true },                    //politicas
						{ "targets": 46, "visible": true },                    //valor_total_final
					],
					"lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "Tudo"]],
					order: [1, 'desc'],
					pageLength: 10,
					processing: true,
					serverSide: false,
					responsive: true,
					rowReorder: { selector: 'td:nth-child(2)' },
      				paging: true,
					"columns": [
						/*00*/
						{
							data: 'cbx', 
							title: '<input type="checkbox" id="cbx_selecionar_todos" title="Selecionar todas as solicitações" data-cbx-selecionar-todos>', 
							autoWidth: false,
							render: function (data, type, item) { 
								return item.cbx; 
							}
						},
						/*01*/
						{
							data: 'plano_id', 
							title: 'PLANO ID', 
							autoWidth: true, 
							className: 'flex-control',
							render: function (data, type, item) { 
								return item.plano_id; 
							}
						},
						/*02*/
						{
							data: 'plano_status', 
							title: 'PLANO STATUS', 
							autoWidth: true, 
							className: 'flex-control',
							render: function (data, type, item) { 
								return item.plano_status; 
							}
						},
						/*03*/
						{
							data: 'planejamento_status', 
							title: 'PLANEJAMENTO STATUS', 
							autoWidth: true, 
							className: 'flex-control',
							render: function (data, type, item) { 
								return item.planejamento_status; 
							}
						},
						/*04*/
						{
							data: 'solicitante_id', 
							title: 'SOLICITANTE ID', 
							autoWidth: true, 
							className: 'flex-control',
							render: function (data, type, item) { 
								return item.solicitante_id; 
							}
						},
						/*05*/
						{
							data: 'cod_usuario_solicitante', 
							title: 'COD USUARIO SOLICITANTE', 
							autoWidth: true, 
							className: 'flex-control',
							render: function (data, type, item) { 
								return item.cod_usuario_solicitante; 
							}
						},
						/*06*/
						{
							data: 'solicitante', 
							title: 'SOLICITANTE', 
							autoWidth: true, 
							className: 'flex-control',
							render: function (data, type, item) { 
								return item.solicitante; 
							}
						},
						/*07*/
						{
							data: 'solicitante_email', 
							title: 'SOLICITANTE EMAIL', 
							autoWidth: true, 
							className: 'flex-control',
							render: function (data, type, item) { 
								return item.solicitante_email; 
							}
						},
						/*08*/
						{
							data: 'favorecido_id', 
							title: 'FAVORECIDO ID', 
							autoWidth: true, 
							className: 'flex-control',
							render: function (data, type, item) { 
								return item.favorecido_id; 
							}
						},
						/*09*/
						{
							data: 'cod_usuario_favorecido', 
							title: 'COD USUARIO FAVORECIDO', 
							autoWidth: true, 
							className: 'flex-control',
							render: function (data, type, item) { 
								return item.cod_usuario_favorecido; 
							}
						},
						/*10*/
						{
							data: 'favorecido_email', 
							title: 'FAVORECIDO EMAIL', 
							autoWidth: true, 
							className: 'flex-control',
							render: function (data, type, item) { 
								return item.favorecido_email; 
							}
						},
						/*11*/
						{
							data: 'solicitacao', 
							title: 'SOLICITAÇÃO', 
							autoWidth: true, 
							className: 'flex-control',
							render: function (data, type, item) {
								var link = '';

								link += '<a href="' + userOAuth.HOST_NAME + "/portal/p/CNC/pageworkflowview?app_ecm_workflowview_detailsProcessInstanceID=" + item.solicitacao + '" class="text-info" target="_blank">';
									link += item.solicitacao;
								link += '</a>';
								
								return link;
							}
						},
						/*12*/
						{
							data: 'cod_filial', 
							title: 'COD FILIAL', 
							autoWidth: true,
							lassName: 'flex-control',
							render: function (data, type, item) { 
								return item.cod_filial; 
							}
						},
						/*13*/
						{
							data: 'nome_filial', 
							title: 'NOME FILIAL', 
							autoWidth: true, 
							className: 'flex-control',
							render: function (data, type, item) { 
								return item.nome_filial; 
							}
						},
						/*14*/
						{
							data: 'gestor_ccusto', 
							title: 'GESTOR CCUSTO', 
							autoWidth: true, 
							className: 'flex-control',
							render: function (data, type, item) { 
								return item.gestor_ccusto; 
							}
						},
						/*15*/
						{
							data: 'analise_GSP', 
							title: 'ANALISE GSP', 
							autoWidth: true, 
							className: 'flex-control',
							render: function (data, type, item) { 
								return item.analise_GSP; 
							}
						},
						/*16*/
						{
							data: 'analise_GEF', 
							title: 'ANALISE GEF', 
							autoWidth: true, 
							className: 'flex-control',
							render: function (data, type, item) { 
								return item.analise_GEF; 
							}
						},
						/*17*/
						{
							data: 'analise_VPF_SG', 
							title: 'ANALISE VPF/SG', 
							autoWidth: true, 
							className: 'flex-control',
							render: function (data, type, item) { 
								return item.analise_VPF_SG; 
							}
						},
						/*18*/
						{
							data: 'politica_cumprida_total', 
							title: 'TOTAL POLÍTICA CUMPRIDA', 
							autoWidth: true, 
							className: 'flex-control',
							render: function (data, type, item) { 
								return item.politica_cumprida_total; 
							}
						},
						/*19*/
						{
							data: 'politica_violada_total', 
							title: 'TOTAL POLÍTICA VIOLADA', 
							autoWidth: true, 
							className: 'flex-control',
							render: function (data, type, item) { 
								return item.politica_violada_total; 
							}
						},
						/*20*/
						{
							data: 'num_atividade', 
							title: 'Nº ATIVIDADE', 
							autoWidth: true, 
							className: 'flex-control',
							render: function (data, type, item) { 
								return item.num_atividade; 
							}
						},
						/*21*/
						{
							data: 'mobile', 
							title: 'MOBILE', 
							autoWidth: true, 
							className: 'flex-control',
							render: function (data, type, item) { 
								return item.mobile; 
							}
						},
						/*22*/
						{
							data: 'hostname', 
							title: 'HOSTNAME', 
							autoWidth: true, 
							className: 'flex-control',
							render: function (data, type, item) { 
								return item.hostname; 
							}
						},
						/*23*/
						{
							data: 'tipo_viagem', 
							title: 'TIPO VIAGEM', 
							autoWidth: true, 
							className: 'flex-control',
							render: function (data, type, item) { 
								return item.tipo_viagem; 
							}
						},
						/*24*/
						{
							data: 'tipo_plano', 
							title: 'TIPO PLANO', 
							autoWidth: true, 
							className: 'flex-control',
							render: function (data, type, item) { 
								return item.tipo_plano; 
							}
						},
						/*25*/
						{
							data: 'favorecido', 
							title: 'FAVORECIDO', 
							autoWidth: true, 
							className: 'flex-control',
							render: function (data, type, item) { 
								return item.favorecido; 
							}
						},
						/*26*/
						{
							data: 'ccusto', 
							title: 'CCUSTO', 
							autoWidth: true, 
							className: 'flex-control',
							render: function (data, type, item) { 
								return item.ccusto; 
							}
						},
						/*27*/
						{
							data: 'lotacao', 
							title: 'LOTAÇÃO', 
							autoWidth: true, 
							className: 'flex-control',
							render: function (data, type, item) { 
								return item.lotacao; 
							}
						},
						/*28*/
						{
							data: 'matricula', 
							title: 'MATRÍCULA', 
							autoWidth: true, 
							className: 'flex-control',
							render: function (data, type, item) { 
								return item.matricula; 
							}
						},
						/*29*/
						{
							data: 'cpf', 
							title: 'CPF', 
							autoWidth: true, 
							className: 'flex-control',
							render: function (data, type, item) { 
								return item.cpf; 
							}
						},
						/*30*/
						{
							data: 'data_nascimento', 
							title: 'DATA DE NASCIMENTO', 
							autoWidth: true, 
							className: 'flex-control',
							render: function (data, type, item) { 
								return item.data_nascimento; 
							}
						},
						/*31*/
						{
							data: 'beneficiario', 
							title: 'BENEFICIÁRIO', 
							autoWidth: true, 
							className: 'flex-control',
							render: function (data, type, item) { 
								return item.beneficiario; 
							}
						},
						/*32*/
						{
							data: 'motivo_viagem', 
							title: 'MOTIVO DA VIAGEM', 
							autoWidth: true, 
							className: 'flex-control',
							render: function (data, type, item) { 
								return item.motivo_viagem; 
							}
						},
						/*33*/
						{
							data: 'compromisso_data_inicio', 
							title: 'COMPROMISSO DATA INÍCIO', 
							autoWidth: true, 
							className: 'flex-control',
							render: function (data, type, item) { 
								return item.compromisso_data_inicio; 
							}
						},
						/*34*/
						{
							data: 'compromisso_hora_inicio', 
							title: 'COMPROMISSO HORA INÍCIO', 
							autoWidth: true, 
							className: 'flex-control',
							render: function (data, type, item) { 
								return item.compromisso_hora_inicio; 
							}
						},
						/*35*/
						{
							data: 'compromisso_data_termino', 
							title: 'COMPROMISSO DATA TÉRMINO', 
							autoWidth: true, 
							className: 'flex-control',
							render: function (data, type, item) { 
								return item.compromisso_data_termino; 
							}
						},
						/*36*/
						{
							data: 'compromisso_hora_termino', 
							title: 'COMPROMISSO HORA TÉRMINO', 
							autoWidth: true, 
							className: 'flex-control',
							render: function (data, type, item) { 
								return item.compromisso_hora_termino; 
							}
						},
						/*37*/
						{
							data: 'compromisso_local_evento', 
							title: 'COMPROMISSO LOCAL EVENTO', 
							autoWidth: true, 
							className: 'flex-control',
							render: function (data, type, item) { 
								return item.compromisso_local_evento; 
							}
						},
						/*38*/
						{
							data: 'diaria_quantidade', 
							title: 'DIÁRIA QUANTIDADE', 
							autoWidth: true, 
							className: 'flex-control',
							render: function (data, type, item) { 
								return item.diaria_quantidade; 
							}
						},
						/*39*/
						{
							data: 'observacoes', 
							title: 'OBSERVAÇÕES', 
							autoWidth: true, 
							className: 'flex-control',
							render: function (data, type, item) { 
								return item.observacoes; 
							}
						},
						/*40*/
						{
							data: 'data_solicitacao', 
							title: 'DATA SOLICITAÇÃO', 
							autoWidth: true, 
							className: 'flex-control',
							render: function (data, type, item) { 
								return item.data_solicitacao; 
							}
						},
						/*41*/
						{
							data: 'vigencia_plano_data_inicio', 
							title: 'VIGÊNCIA PLANO (DATA INICIO)', 
							autoWidth: true, 
							className: 'flex-control',
							render: function (data, type, item) { 
								return item.vigencia_plano_data_inicio; 
							}
						},
						/*42*/
						{
							data: 'vigencia_plano_data_fim', 
							title: 'VIGÊNCIA PLANO (DATA FIM)', 
							autoWidth: true, 
							className: 'flex-control',
							render: function (data, type, item) { 
								return item.vigencia_plano_data_fim; 
							}
						},
						/*43*/
						{
							data: 'responsavel_solicitacao', 
							title: 'RESPONSÁVEL SOLICITAÇÃO', 
							autoWidth: true, 
							className: 'flex-control',
							render: function (data, type, item) { 
								return item.responsavel_solicitacao; 
							}
						},
						/*44*/
						{
							data: 'status_solicitacao', 
							title: 'STATUS SOLICITAÇÃO', 
							autoWidth: true, 
							className: 'flex-control',
							render: function (data, type, item) { 
								return "<span class='label label-success'>" + item.status_solicitacao + "</span>"; 
							}
						},
						/*45*/
						{
							data: 'politicas', 
							title: 'POLÍTICAS', 
							autoWidth: true, className: 'flex-control',
							render: function (data, type, item) { 
								var result = "<span class='label label-success'>Cumprida: " + item.politicas.cumprida + "</span>&nbsp;<span class='label label-danger'>Violada: " + item.politicas.violada + "</span>";
								return result; 
							}
						},
						/*46*/
						{
							data: 'valor_total_final', 
							title: 'VALOR DA VIAGEM', 
							autoWidth: true, 
							className: 'flex-control',
							render: function (data, type, item) {
								return 'R$ ' + item.valor_total_final.toLocaleString('pt-br', { minimumFractionDigits: 2 }); 
							}
						}
					],
					footerCallback: function (row, data, start, end, display) {
						var api = this.api();
				 
						// Remove the formatting to get integer data for summation
						var intVal = function (i) {
							return typeof i === 'string' ? i.replace(/[\$,]/g, '') * 1 : typeof i === 'number' ? i : 0;
						};
				 
						// Total over all pages
						total = api.column(46).data().reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);
				 
						// Total over this page
						pageTotal = api.column(46, { page: 'current' }).data().reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);
				 
						// Update footer
						$(api.column(46).footer()).html(
							'TOTAL: ' + 'R$ ' + pageTotal.toLocaleString('pt-br', { minimumFractionDigits: 2 }) + ' (' + 'R$ ' + total.toLocaleString('pt-br', { minimumFractionDigits: 2 }) + ')'
						);
					}
				});

				$('#table_' + that.instanceId + ' tbody').on('click', 'td.flex-control', function() {
					var tr = $(this).closest('tr');
					var row = table.row(tr);
				 
					if (row.child.isShown()) {
						// This row is already open - close it
						row.child.hide();
					} else {
						// Open this row
						//console.log(row.data());

						row.child(
							that.fnDetalhes(row.data())
						).show();
					}
				});
			}
		});
    },
	fnFluigLoading: function() {	
		var loader = $('#fluig_loader');
		
		var load = FLUIGC.loading(loader, {
			textMessage: null,
			title: null,
			cursorReset: 'default',
			baseZ: 1000,
			centerX: true,
			centerY: true,
			bindEvents: false,
			fadeIn: 200,
			fadeOut: 400,
			timeout: 0,
			showOverlay: false,
			onBlock: null,
			onUnblock: null,
			ignoreIfBlocked: false
		});

		return load;
	},
	fnControle: function(el, ev) {
		//console.log(el);
		//console.log(ev);
		//console.log('Botão ' + el.title + ' acionado.');

		var that = this;

		switch (el.id) {
			case 'btn_abrir_menu':
				$("#div_modal_container").animate({ 
					width: 'toggle' 
				});

				var dataAtual = that.fnRetornarDataAtual();

				var filtro_data_inicial = $('#filtro_data_inicial');
				var filtro_data_final = $('#filtro_data_final');

				filtro_data_inicial.val(dataAtual);
				filtro_data_final.val(dataAtual);
				break;
			case 'btn_fechar_menu':
				var form = $('#form_filtro input');
				form.val('');

				var btn_filtrar = $('#btn_filtrar');
				btn_filtrar.click();
				
				$("#div_modal_container").animate({ 
					width: 'toggle' 
				});
				break;
			case 'btn_filtrar':
				var table = $('#table_' + that.instanceId).DataTable();
				console.log(table);

				$.fn.dataTable.ext.search.push(
					function(settings, data, dataIndex) {
						var dateStart = that.fnFormatarData($("#filtro_data_inicial").val());
						var dateEnd = that.fnFormatarData($("#filtro_data_final").val());
						var evalDate = that.fnFormatarData(data[40]); //40 = Número de posição da coluna data_solicitacao . Verificar em "columnDefs".
			
						if ((isNaN(dateStart)) || (isNaN(dateEnd))) {
							return true;
						}

						if (evalDate >= dateStart && evalDate <= dateEnd) {
							return true;
						} else {
							return false;
						}
					}
				);

				table.draw();
				break;
			case 'btn_limpar':
				//var table = $('#table_' + that.instanceId).DataTable();
				//table.clear().rows.add(data).draw();

				var form = $('#form_filtro input');
				form.val('');

				var btn_filtrar = $('#btn_filtrar');
				btn_filtrar.click();
				break;
			case 'cbx_selecionar_todos':
				var btn_aprovar_menu = $('#btn_aprovar_menu');
				var btn_aprovar = $('#btn_aprovar');
				var btn_assumir_tarefa_menu = $('#btn_assumir_tarefa_menu');
				var btn_assumir_tarefa = $('#btn_assumir_tarefa');

				if ($('#' + el.id).is(':checked')) {
					btn_aprovar_menu.removeClass('flex-disabled');
					btn_aprovar.removeAttr('disabled');
					btn_assumir_tarefa_menu.removeClass('flex-disabled');
					btn_assumir_tarefa.removeAttr('disabled');

					$('input:checkbox').prop('checked', true);
				} else {
					btn_aprovar_menu.addClass('flex-disabled');
					btn_aprovar.attr('disabled', 'disabled');
					btn_assumir_tarefa_menu.addClass('flex-disabled');
					btn_assumir_tarefa.attr('disabled', 'disabled');

					$('input:checkbox').prop('checked', false);
				}
				break;
			case 'cbx_selecionar_unico' + el.value + '':
				var btn_aprovar_menu = $('#btn_aprovar_menu');
				var btn_aprovar = $('#btn_aprovar');
				var btn_assumir_tarefa_menu = $('#btn_assumir_tarefa_menu');
				var btn_assumir_tarefa = $('#btn_assumir_tarefa');

				$(document).on('click', '[class="' + el.className + '"]', function() {
					var cbxSelecionado = $().detectCheckbox();
					
					if (cbxSelecionado == 1) {
						btn_aprovar_menu.removeClass('flex-disabled');
						btn_aprovar.removeAttr('disabled');
						btn_assumir_tarefa_menu.removeClass('flex-disabled');
						btn_assumir_tarefa.removeAttr('disabled');
					} else if (cbxSelecionado > 1) {
						btn_aprovar_menu.removeClass('flex-disabled');
						btn_aprovar.removeAttr('disabled');
						btn_assumir_tarefa_menu.removeClass('flex-disabled');
						btn_assumir_tarefa.removeAttr('disabled');
					} else {
						btn_aprovar_menu.addClass('flex-disabled');
						btn_aprovar.attr('disabled', 'disabled');
						btn_assumir_tarefa_menu.addClass('flex-disabled');
						btn_assumir_tarefa.attr('disabled', 'disabled');
					}

					console.log(cbxSelecionado);
				});

				$.fn.detectCheckbox = function() {
					var cont = 0;

					$('input[type="checkbox"]:checked').each(function() {
						cont++;
					});

					return cont;
				};
				break
			case 'btn_itens_planejamento':
				var idPlano = el.title;
				that.fnRetornarItensPlanejamentoPlanosReserve(idPlano);
				break;
			case 'btn_politicas':
				var idPlano = el.title;
				that.fnRetornarPoliticasPlanosReserve(idPlano);
				break;
		}
	},
	fnAprovar: function(el, ev) {
		console.log('Botão ' + el.title + ' acionado.');

		var that = this;

		var userOAuth = that.fnRetornarCadastroUsuarioIntegracao("FLUIG");
		var userCode = that.fnRetornarUsuariosFluigWCMAPI("userCode");
		var userName = that.fnRetornarUsuariosFluigWCMAPI("userName");

		FLUIGC.message.confirm({
			title: 'Confirmação',
			message: 'Prezado(a) ' + userName + ', deseja autorizar a(s) solicitação(es) selecionada(s)?',
			labelYes: 'Aprovar',
			labelNo: 'Cancelar'
		}, function(result, el, ev) {
			if (result == false) {
				console.log('Autorização cancelada.');
			} else {
				if (document.querySelector('.cbx-select-single') != null) {            
					$("input[name='cbx-select-single[]']:checked").each(function() {
						try {
							var IDFLUIG = $(this).val();
							console.log(IDFLUIG);

							var arrObj = that.mydata;
						
							arrObj.forEach(function(element) {
								if (IDFLUIG == element.solicitacao) {
									console.log(element);

									var numeroAtividade = parseInt(element.num_atividade);
									var inicio = 1;
									var gestorCentroCustoValidarSolicitacao = 2;
									var autorizacaoDespesa = 7;
									var GEFValidarSolicitacao = 11;
									var finalizarSolicitacaoIntegracaoReserve = 52;
									var finalizarSolicitacaoIntegracaoRM = 24;

									var state = '';
									var colleagueId = '';

									switch (numeroAtividade) {
										case inicio:
											state = gestorCentroCustoValidarSolicitacao;
											colleagueId = element.gestor_ccusto;
											break;
										case gestorCentroCustoValidarSolicitacao:
											state = autorizacaoDespesa;
											colleagueId = element.analise_VPF_SG;
											break;
										case autorizacaoDespesa:
											state = GEFValidarSolicitacao;
											colleagueId = element.analise_GSP;
											break;
										case GEFValidarSolicitacao:
											state = finalizarSolicitacaoIntegracaoReserve;
											colleagueId = element.analise_GEF;
											break;
										case finalizarSolicitacaoIntegracaoReserve:
											state = finalizarSolicitacaoIntegracaoRM;
											colleagueId = '';
											break;
									}

									var custom_loader = $('#fluig_custom_loader');
									custom_loader.show();

									var load = that.fnFluigLoading();
									load.show();

									var workflowServiceUrl = userOAuth.HOST_NAME + '/webdesk/ECMWorkflowEngineService?wsdl'; //Endereço Fluig Dev/Homolog/Prod
									var username = userOAuth.USER_NAME;                                                      //Usuário de autenticação
									var password = userOAuth.PASSWORD;                                                       //Senha de autenticação
									var companyId = 1;                                                                       //ID da empresa
									var processInstanceId = IDFLUIG;                                                         //ID da solicitação
									var choosedState = state;                                                                //Atividade de destino da solicitação
									var colleagueId = colleagueId;                                                           //Matrícula/usuário de quem recebe a atividade
									var comments = "A solicitação de nº " + IDFLUIG + " foi movimentada com sucesso!";       //Inserir um comentário no histórico da solicitação quando movimentada
									var userId = userCode;                                                                   //Matrícula/usuário que fez a movimentação da solicitação
									var completeTask = "true";
									var managerMode = "false";
									var threadSequence = 0;

									console.log(workflowServiceUrl);
									console.log(username);
									console.log(password);
									console.log(companyId);
									console.log(processInstanceId);
									console.log(choosedState);
									console.log(colleagueId);
									console.log(comments);
									console.log(userId);
									console.log(completeTask);
									console.log(managerMode);
									console.log(threadSequence);
										
									fetch(workflowServiceUrl, {
										method: "POST",
										redirect: "follow",
										credentials: "omit",
										headers: {
											"Content-Type": "text/xml;charset=utf-8"
										},
										body: `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ws="http://ws.workflow.ecm.technology.totvs.com/">
											<soapenv:Header>
												<wsse:Security soapenv:mustUnderstand="0" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">
													<wsse:UsernameToken>
														<wsse:Username>${username}</wsse:Username>
														<wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">${password}</wsse:Password>
													</wsse:UsernameToken>
												</wsse:Security>
											</soapenv:Header>
											<soapenv:Body>
												<ws:saveAndSendTaskClassic>
													<username>${username}</username>
													<password>${password}</password>
													<companyId>${companyId}</companyId>
													<processInstanceId>${processInstanceId}</processInstanceId>
													<choosedState>${choosedState}</choosedState>
													<colleagueIds>
														<item>${colleagueId}</item>
													</colleagueIds>
													<comments>${comments}</comments>
													<userId>${userId}</userId>
													<completeTask>${completeTask}</completeTask>
													<attachments></attachments>
													<cardData></cardData>
													<appointment />
													<managerMode>${managerMode}</managerMode>
													<threadSequence>${threadSequence}</threadSequence>
												</ws:saveAndSendTaskClassic>
											</soapenv:Body>
										</soapenv:Envelope>`
									})
									.then(response => response.text())
									.then(xmlText => (new DOMParser()).parseFromString(xmlText, "text/xml"))
									.then(() => custom_loader.hide())
									.then(() => load.hide())
									.then(() => console.log("A solicitação de número " + processInstanceId + " foi movimentada com sucesso!"))
									.then(() => window.location.reload())
									.catch(() => console.log("Erro ao movimentar a solicitação de número " + processInstanceId + "."));
								}
							});
						} catch(e) {
							throw e;
						}
					});
				}
			}
		});
	},
	fnAssumirTarefa: function(el, ev) {
		console.log('Botão ' + el.title + ' acionado.');

		var that = this;

		var userOAuth = that.fnRetornarCadastroUsuarioIntegracao("FLUIG");
		var userCode = that.fnRetornarUsuariosFluigWCMAPI("userCode");
		var userName = that.fnRetornarUsuariosFluigWCMAPI("userName");

		FLUIGC.message.confirm({
			title: 'Confirmação',
			message: 'Prezado(a) ' + userName + ', deseja assumir a responsabilidade pela solicitação selecionada?',
			labelYes: 'Assumir',
			labelNo: 'Cancelar'
		}, function(result, el, ev) {
			if (result == false) {
				console.log('Cancelada.');
			} else {
				if (document.querySelector('.cbx-select-single') != null) {            
					$("input[name='cbx-select-single[]']:checked").each(function() {
						try {
							var IDFLUIG = $(this).val();
							console.log(IDFLUIG);

							var arrObj = that.mydata;
						
							arrObj.forEach(function(element) {
								if (IDFLUIG == element.solicitacao) {
									console.log(element);

									var custom_loader = $('#fluig_custom_loader');
									custom_loader.show();

									var load = that.fnFluigLoading();
									load.show();

									var workflowServiceUrl = userOAuth.HOST_NAME + '/webdesk/ECMWorkflowEngineService?wsdl';
									var username = userOAuth.USER_NAME;
									var password = userOAuth.PASSWORD;
									var companyId = 1;
									var userId = userCode;
									var processInstanceId = IDFLUIG;
									var threadSequence = 0;
									var replacementId = userCode;
										
									fetch(workflowServiceUrl, {
										method: "POST",
										redirect: "follow",
										credentials: "omit",
										headers: {
											"Content-Type": "text/xml;charset=utf-8"
										},
										body: `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ws="http://ws.workflow.ecm.technology.totvs.com/">
										<soapenv:Header>
											<wsse:Security soapenv:mustUnderstand="0" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">
												<wsse:UsernameToken>
													<wsse:Username>${username}</wsse:Username>
													<wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">${password}</wsse:Password>
												</wsse:UsernameToken>
											</wsse:Security>
										</soapenv:Header>
										<soapenv:Body>
											<ws:takeProcessTaskByReplacement>
												<username>${username}</username>
												<password>${password}</password>
												<companyId>${companyId}</companyId>
												<userId>${userId}</userId>
												<processInstanceId>${processInstanceId}</processInstanceId>
												<threadSequence>${threadSequence}</threadSequence>
												<replacementId>${replacementId}</replacementId>
											</ws:takeProcessTaskByReplacement>
										</soapenv:Body>
										</soapenv:Envelope>`
									})
									.then(response => response.text())
									.then(xmlText => (new DOMParser()).parseFromString(xmlText, "text/xml"))
									.then(() => custom_loader.hide())
									.then(() => load.hide())
									.then(() => console.log("A solicitação de número " + processInstanceId + " foi assumida com sucesso!"))
									.then(() => window.location.reload())
									.catch(() => console.log("Erro ao assumir a solicitação de número " + processInstanceId + "."));
								}
							});
						} catch(e) {
							throw e;
						}
					});
				}
			}
		});
	},
	fnFormatarData: function(rawDate) {
		var dateArray = rawDate.split("/");
		var parsedDate = dateArray[2] + dateArray[1] + dateArray[0];
		
		return parsedDate;
	},
	fnRetornarDataAtual: function() {
		moment.locale('pt');
		return moment().format('L')
	},
	fnConverterMoedaPTBRFloat: function(value) {
		//var value = $('#money').val() //ex: 20.000,99
		var currency = value.replace(/\D/g, ''); //remove tudo que não é dígito, fica então 2000099
		var result = parseFloat(currency)/100; //20000.99
		return result;
	},
	fnRetornarSomaValor: function(arr, key) {
		var result = arr.reduce((a, b) => a + (b[key] || 0), 0);
		return "R$ " + result.toLocaleString('pt-br', { minimumFractionDigits: 2 });
	},
	fnRetornarUsuariosFluigWCMAPI: function(type) {
		var result = "";

		if (type == "userCode") {
			result = WCMAPI.getUserCode();
		}

		if (type == "userName") {
			result = WCMAPI.getUser();
		}

		return result;
	},
	fnRetornarGrupoUsuarioFluig(user, group) {
		var colleagueId = user.toString();
		var groupId = group.toString();

		var c1 = DatasetFactory.createConstraint("colleagueGroupPK.colleagueId", colleagueId, colleagueId, ConstraintType.MUST);
		var c2 = DatasetFactory.createConstraint("colleagueGroupPK.groupId", groupId, groupId, ConstraintType.MUST);

		var constraints = new Array(c1, c2);
		
		var ds = DatasetFactory.getDataset("colleagueGroup", null, constraints, null);
		
		if (ds.values.length > 0) {
			for (var i = 0; i < ds.values.length; i++) { 
				var values = {
					companyId: ds.values[i]['colleagueGroupPK.companyId'],
					colleagueId: ds.values[i]['colleagueGroupPK.colleagueId'],
					groupId: ds.values[i]['colleagueGroupPK.groupId']
				}
				
				return values;
			}
		} else {
			throw "Não foi encontrado um registro para o usuário informado.";
		}
	},
	fnRetornaDadosUsuarioDatasetColleagueFluig: function(type, data) {
		switch (type) {
			case 'userCode':
				var c1 = DatasetFactory.createConstraint("login", data, data, ConstraintType.MUST);
				break;
			case 'userName':
				var c1 = DatasetFactory.createConstraint("colleagueName", data, data, ConstraintType.MUST);
				break;
		}
		
		var constraints = new Array(c1);
		
		var ds = DatasetFactory.getDataset("colleague", null, constraints, null);
		
		if (ds.values.length > 0) {
			for (var i = 0; i < ds.values.length; i++) { 
				var values = {
					LOGIN: ds.values[i]['login'],
					COLLEAGUENAME: ds.values[i]['colleagueName']
				}
				
				return values;
			}
		} else {
			throw "Não foi encontrado um registro para o usuário informado.";
		}
	},
	fnAutenticacaoReserve: function() {
		var that = this;

		var auth = this.fnRetornarCadastroUsuarioIntegracao("FLUIG");
	
		var host_name = auth.HOST_NAME;
		var oauth_key = auth.OAUTH_KEY;
		var oauth_secret = auth.OAUTH_SECRET;
		var token_key = auth.TOKEN_KEY;
		var token_secret = auth.TOKEN_SECRET;

		var oauth = OAuth({
			consumer: {
				key: oauth_key,
				secret: oauth_secret
			},
			signature_method: 'HMAC-SHA1',
			hash_function: function (base_string, key) {
				return CryptoJS.HmacSHA1(base_string, key).toString(CryptoJS.enc.Base64);
			},
			nonce_length: 6
		});

		var request_data = {
			url: host_name + '/api/public/ecm/dataset/datasets',
			method: 'POST'
		};

		var data = {
			"name": 'dsAutenticacaoReserve',
			"fields": [],
			"constraints": [],
			"order": []
		};

		var token = {
			key: token_key,
			secret: token_secret
		};
		
		$.ajax({
			url: request_data.url,
			contentType: 'application/json',
			crossDomain: true,
			async: true,
			type: request_data.method,
			data: JSON.stringify(data),
			headers: oauth.toHeader(oauth.authorize(request_data, token)),
			beforeSend : function() {
				console.log("Aguarde... Autenticação Reserve em andamento.");
			}
		}).done(function(data) {
			if (data) {
				console.log("Autenticação Reserve realizada com sucesso.");
			}
		}).fail(function (jqXHR, textStatus) {
			console.log('Não foi possível realizar autenticação no sistema Reserve.');
		});
	},
	fnRetornarItensPlanejamentoPlanosReserve: function(idPlano) {
		var that = this;

		var constraints = new Array();

		constraints.push(DatasetFactory.createConstraint("idPlano", idPlano, idPlano, ConstraintType.MUST));

		var auth = this.fnRetornarCadastroUsuarioIntegracao("FLUIG");
	
		var host_name = auth.HOST_NAME;
		var oauth_key = auth.OAUTH_KEY;
		var oauth_secret = auth.OAUTH_SECRET;
		var token_key = auth.TOKEN_KEY;
		var token_secret = auth.TOKEN_SECRET;

		var oauth = OAuth({
			consumer: {
				key: oauth_key,
				secret: oauth_secret
			},
			signature_method: 'HMAC-SHA1',
			hash_function: function (base_string, key) {
				return CryptoJS.HmacSHA1(base_string, key).toString(CryptoJS.enc.Base64);
			},
			nonce_length: 6
		});

		var request_data = {
			url: host_name + '/api/public/ecm/dataset/datasets',
			method: 'POST'
		};

		var data = {
			"name": 'dsRetornarItensPlanejamentoPlanosReserve',
			"fields": [],
			"constraints": constraints,
			"order": []
		};

		var token = {
			key: token_key,
			secret: token_secret
		};

		var div_itens_planejamento = $('#div_itens_planejamento');
		
		$.ajax({
			url: request_data.url,
			contentType: 'application/json',
			crossDomain: true,
			async: true,
			type: request_data.method,
			data: JSON.stringify(data),
			headers: oauth.toHeader(oauth.authorize(request_data, token)),
			beforeSend : function() {
				console.log("Carregando... Aguardando retorno do sistema Reserve.");
				div_itens_planejamento.html('<p class="text-info">Carregando... Aguardando retorno do sistema Reserve.</p>');
			}
		}).done(function(data) {
			var dataVal = $(data.content)[0].values
			console.log(dataVal);

			while (that.arrItensPlanejamento.length > 0) {
				that.arrItensPlanejamento.pop()
			}

			for (var i in dataVal) {
				that.arrItensPlanejamento.push({
					nome: dataVal[i].nome,
					tipo: dataVal[i].tipo,
					dataInicio: dataVal[i].data,
					dataFim: dataVal[i].dataFim,
					valorSolicitado: dataVal[i].valorSolicitado,
					valor: dataVal[i].valor,
					valorFloat: dataVal[i].valorFloat
				});

				var itensPlanejamento = that.arrItensPlanejamento;

				var html = "";

				html += '<div class="card card-horizontal flex-background-gradient-black">';
					html += '<div class="card-thumb">';
						html += '<i class="illustration illustration-layout-group illustration-md" aria-hidden="true"></i>';
					html += '</div>';

					html += '<div class="card-body">';
						html += '<h1 class="card-title flex-text-color-white"><b>NOME</b></h1>';
						html += '<p class="card-small-text flex-text-color-white"><b>TIPO</b></p>';
						html += '<p class="card-small-text flex-text-color-white"><b>DATA INÍCIO</b></p>';
						html += '<p class="card-small-text flex-text-color-white"><b>DATA FIM</b></p>';
						//html += '<p class="card-small-text flex-text-color-white"><b>VALOR</b></p>';
						html += '<p class="card-small-text flex-text-color-white"><b>TOTAL</b></p>';
							
						html += '<div class="card-list-items">';
							html += '<span class="card-list-item card-list-item-icons" title="Icon title">';
								html += '<i class="flaticon flaticon-form-list icon-sm" aria-hidden="true"></i>';
							html += '</span>';
						html += '</div>';
					html += '</div>';
				html += '</div>';

				for (var i = 0; i < itensPlanejamento.length; i++) {
					html += '<div class="card card-horizontal">';
						html += '<div class="card-thumb">';
							html += '<i class="illustration illustration-layout-group illustration-md" aria-hidden="true"></i>';
						html += '</div>';

						html += '<div class="card-body">';
							html += '<h1 class="card-title">' + itensPlanejamento[i].nome + '</h1>';
							html += '<p class="card-small-text">' + itensPlanejamento[i].tipo + '</p>';
							html += '<p class="card-small-text">' + itensPlanejamento[i].dataInicio + '</p>';
							html += '<p class="card-small-text">' + itensPlanejamento[i].dataFim + '</p>';
							//html += '<p class="card-small-text">R$ ' + itensPlanejamento[i].valorSolicitado + '</p>';
							html += '<p class="card-small-text"><b>R$ ' + itensPlanejamento[i].valor + '</b></p>';
								
							html += '<div class="card-list-items">';
								html += '<span class="card-list-item card-list-item-icons" title="Icon title">';
									html += '<i class="flaticon flaticon-star-active icon-sm" aria-hidden="true"></i>';
								html += '</span>';
							html += '</div>';
						html += '</div>';
					html += '</div>';
				}

				var total = that.fnRetornarSomaValor(itensPlanejamento, "valorFloat");

				html += '<div class="card card-horizontal flex-background-gradient-black">';
					html += '<div class="card-thumb">';
						html += '<i class="illustration illustration-success illustration-md" aria-hidden="true"></i>';
					html += '</div>';

					html += '<div class="card-body">';
						html += '<h1 class="card-title flex-text-color-white"><b>TOTAL</b></h1>';
						html += '<p class="card-small-text flex-text-color-white"></p>';
						html += '<p class="card-small-text flex-text-color-white"></p>';
						html += '<p class="card-small-text flex-text-color-white"></p>';
						//html += '<p class="card-small-text flex-text-color-white"></p>';
						html += '<p class="card-small-text flex-text-color-white">' + total + '</p>';
							
						html += '<div class="card-list-items">';
							html += '<span class="card-list-item card-list-item-icons" title="Icon title">';
								html += '<i class="flaticon flaticon-star icon-sm" aria-hidden="true"></i>';
							html += '</span>';
						html += '</div>';
					html += '</div>';
				html += '</div>';

				div_itens_planejamento.html(html);
			}
		}).fail(function (jqXHR, textStatus) {
			console.log('Não foi possível carregar a lista.');
		});
	},
	fnRetornarPoliticasPlanosReserve: function(idPlano) {
		var that = this;

		var constraints = new Array();

		constraints.push(DatasetFactory.createConstraint("idPlano", idPlano, idPlano, ConstraintType.MUST));

		var auth = this.fnRetornarCadastroUsuarioIntegracao("FLUIG");
	
		var host_name = auth.HOST_NAME;
		var oauth_key = auth.OAUTH_KEY;
		var oauth_secret = auth.OAUTH_SECRET;
		var token_key = auth.TOKEN_KEY;
		var token_secret = auth.TOKEN_SECRET;

		var oauth = OAuth({
			consumer: {
				key: oauth_key,
				secret: oauth_secret
			},
			signature_method: 'HMAC-SHA1',
			hash_function: function (base_string, key) {
				return CryptoJS.HmacSHA1(base_string, key).toString(CryptoJS.enc.Base64);
			},
			nonce_length: 6
		});

		var request_data = {
			url: host_name + '/api/public/ecm/dataset/datasets',
			method: 'POST'
		};

		var data = {
			"name": 'dsRetornarPoliticasPlanosReserve',
			"fields": [],
			"constraints": constraints,
			"order": []
		};

		var token = {
			key: token_key,
			secret: token_secret
		};

		var div_politicas = $('#div_politicas');
		div_politicas.html("");
		
		$.ajax({
			url: request_data.url,
			contentType: 'application/json',
			crossDomain: true,
			async: true,
			type: request_data.method,
			data: JSON.stringify(data),
			headers: oauth.toHeader(oauth.authorize(request_data, token)),
			beforeSend : function() {
				console.log("Carregando... Aguardando retorno do sistema Reserve.");
				div_politicas.html('<p class="text-info">Carregando... Aguardando retorno do sistema Reserve.</p>');
			}
		}).done(function(data) {
			var dataVal = $(data.content)[0].values
			console.log(dataVal);

			while (that.arrPoliticas.length > 0) {
				that.arrPoliticas.pop()
			}

			for (var i in dataVal) {
				that.arrPoliticas.push({
					status: dataVal[i].status,
					valorPermitido: dataVal[i].valor,
					valorExcedido: dataVal[i].valorPlano,
					justificativa: dataVal[i].justificativa
				});

				var politicas = that.arrPoliticas;

				var html = "";
				var cssClass = "";
				var cssDisplay = "";

				html += '<div class="row">';
					for (var i = 0; i < politicas.length; i++) {
						if (politicas[i].status == "Cumprida") {
							cssClass = "text-success";
						}
						
						if (politicas[i].status == "Violada") {
							cssClass = "text-danger";
						}

						html += '<div class="col-md-4">';
							html += '<div class="card">';
								html += '<div class="card-body">';
									html += '<h3 class="card-title flex-text-toupper">Máximo de Planos abertos por Favorecido</h3>';

									html += '<h6 class="card-subtitle mb-2 text-muted ' + cssClass + '">' + politicas[i].status + '</h6>';

									html += '<p class="card-text"><b>Quantidade de Planos abertos permitidos</b>: ' + politicas[i].valorPermitido + '</p>';
									html += '<p class="card-text"><b>Quantidade de Planos abertos para este usuário</b>: ' + politicas[i].valorExcedido + '</p>';
									
									if (politicas[i].justificativa != "") {
										html += '<p class="card-text"><b>Justificativa</b>: ' + politicas[i].justificativa + '</p>';
									}
								html += '</div>';
							html += '</div>';
						html += '</div>';
					}
				html += '</div>';

				div_politicas.html(html);
			}
		}).fail(function (jqXHR, textStatus) {
			console.log('Não foi possível carregar a lista.');
		});
	},
	fnDetalhes: function(d) {
		var that = this;

		var solicitante = that.fnRetornaDadosUsuarioDatasetColleagueFluig('userCode', d.cod_usuario_solicitante);
		var favorecido = that.fnRetornaDadosUsuarioDatasetColleagueFluig('userCode', d.cod_usuario_favorecido);

		var html = '';

		html += '<div class="flex-panel flex-background-white flex-border-dashed-gray flex-box-shadow flex-mt-10 flex-mb-10">';
			html += '<div class="flex-panel flex-background-gradient-blue">';
				html += '<h3 class="flex-text-toupper flex-text-color-white flex-mt-0">';
					html += 'Detalhes da solicitação ' + d.solicitacao + ' <span class="label label-success text-capitalize pull-right">' + d.status_solicitacao + '</span>';
				html += '</h3>';
			html += '</div>';
		
			html += '<div class="panel-group collapse-blue" id="accordion-variant-colors">';
				//Dados do Favorecido
				html += '<div class="panel panel-default">';
					html += '<div class="panel-heading">';
						html += '<h4 class="panel-title">';
							html += '<a class="collapse-icon up" data-toggle="collapse" data-parent="#accordion-variant-colors" href="#1_' + d.solicitacao + '">';
								html += '<i class="flaticon flaticon-person" aria-hidden="true"></i>&nbsp;Dados do Favorecido';
							html += '</a>';
						html += '</h4>';
					html += '</div>';

					html += '<div id="1_' + d.solicitacao + '" class="panel-collapse collapse in">';
						html += '<div class="panel-body flex-pb-10">';
							html += '<div class="row">';
								html += '<div class="col-lg-12">';
									html += '<div class="flex-panel flex-background-white flex-border-dashed-gray flex-box-shadow">';
										html += '<div class="flex-panel flex-background-gradient-blue">';
											html += '<h3 class="flex-text-toupper flex-text-color-white flex-mt-0">';
												html += 'Viagem ' + ' <span class="label ' + (d.tipo_viagem == 'Nacional' ? 'label-flow' : 'label-collab') + ' text-capitalize pull-right">' + d.tipo_viagem + '</span>';
											html += '</h3>';
										html += '</div>';

										html += '<dl class="dl-horizontal">';
											html += '<dt>Motivo da Viagem:</dt>' + '<dd>' + d.motivo_viagem + '</dd>';
											html += '<dt>Plano:</dt>' + '<dd>' + d.tipo_plano + '</dd>';
											html += '<dt>Solicitante:</dt>' + '<dd>' + solicitante.COLLEAGUENAME + ' (' + solicitante.LOGIN + ')</dd>';
											html += '<dt>Favorecido:</dt>' + '<dd>' + favorecido.COLLEAGUENAME + ' (' + favorecido.LOGIN + ')</dd>';
											html += '<dt>Centro de Custo:</dt>' + '<dd>' + d.ccusto + '</dd>';
											html += '<dt>Lotação:</dt>' + '<dd>' + d.lotacao + '</dd>';
											html += '<dt>Matrícula:</dt>' + '<dd>' + d.matricula + '</dd>';
											html += '<dt>CPF:</dt>' + '<dd>' + d.cpf + '</dd>';
											html += '<dt>Data de Nascimento:</dt>' + '<dd>' + d.data_nascimento + '</dd>';
											html += '<dt>Beneficiário:</dt>' + '<dd>' + d.beneficiario + '</dd>';
										html += '</dl>';
									html += '</div>';
								html += '</div>';
							html += '</div>';
						html += '</div>';
					html += '</div>';
				html += '</div>';

				//Dados do Compromisso
				html += '<div class="panel panel-default">';
					html += '<div class="panel-heading">';
						html += '<h4 class="panel-title">';
							html += '<a class="collapse-icon" data-toggle="collapse" data-parent="#accordion-variant-colors" href="#2_' + d.solicitacao + '">';
								html += '<i class="flaticon flaticon-date-range" aria-hidden="true"></i>&nbsp;Dados do Compromisso';
							html += '</a>';
						html += '</h4>';
					html += '</div>';

					html += '<div id="2_' + d.solicitacao + '" class="panel-collapse collapse">';
						html += '<div class="panel-body flex-pb-10">';
							html += '<div class="row">';
								html += '<div class="col-lg-12">';
									html += '<div class="flex-panel flex-background-white flex-border-dashed-gray flex-box-shadow">';
										html += '<div class="flex-panel flex-background-gradient-blue">';
											html += '<h3 class="flex-text-toupper flex-text-color-white flex-mt-0">';
												html += '<i class="flaticon flaticon-date-range icon-md pull-right" aria-hidden="true"></i> Compromisso';
											html += '</h3>';
										html += '</div>';

										html += '<dl class="dl-horizontal">';
											html += '<dt>Início:</dt>' + '<dd>' + d.compromisso_data_inicio + ' - ' + d.compromisso_hora_inicio + '</dd>';
											html += '<dt>Término:</dt>' + '<dd>' + d.compromisso_data_termino + ' - ' + d.compromisso_hora_termino + '</dd>';
											html += '<dt>Endereço:</dt>' + '<dd>' + d.compromisso_local_evento + '</dd>';
										html += '</dl>';
									html += '</div>';
								html += '</div>';
							html += '</div>';
						html += '</div>';
					html += '</div>';
				html += '</div>';

				//Itens de Planejamento
				html += '<div class="panel panel-default">';
					html += '<div class="panel-heading">';
						html += '<h4 class="panel-title">';
							html += '<a id="btn_itens_planejamento" class="collapse-icon" data-toggle="collapse" data-parent="#accordion-variant-colors" title="' + d.plano_id + '" href="#3_' + d.solicitacao + '" data-btn-itens-planejamento>';
								html += '<i class="flaticon flaticon-flight" aria-hidden="true"></i>&nbsp;Serviço(s) adicionado(s) ao Plano de viagem';
							html += '</a>';
						html += '</h4>';
					html += '</div>';

					html += '<div id="3_' + d.solicitacao + '" class="panel-collapse collapse">';
						html += '<div class="panel-body flex-pb-10">';
							html += '<div id="div_itens_planejamento"></div>';
						html += '</div>';
					html += '</div>';
				html += '</div>';

				//Planejamento (Informações Adicionais)
				html += '<div class="panel panel-default">';
					html += '<div class="panel-heading">';
						html += '<h4 class="panel-title">';
							html += '<a class="collapse-icon" data-toggle="collapse" data-parent="#accordion-variant-colors" href="#4_' + d.solicitacao + '">';
								html += '<i class="flaticon flaticon-form-list" aria-hidden="true"></i>&nbsp;Planejamento (Informações Adicionais)';
							html += '</a>';
						html += '</h4>';
					html += '</div>';

					html += '<div id="4_' + d.solicitacao + '" class="panel-collapse collapse">';
						html += '<div class="panel-body flex-pb-10">';
							html += '<div class="row">';
								html += '<div class="col-lg-12">';
									html += '<div class="flex-panel flex-background-white flex-border-dashed-gray flex-box-shadow">';
										html += '<div class="flex-panel flex-background-gradient-blue">';
											html += '<h3 class="flex-text-toupper flex-text-color-white flex-mt-0">';
												html += '<i class="flaticon flaticon-calendar icon-md pull-right" aria-hidden="true"></i> Datas do Plano';
											html += '</h3>';
										html += '</div>' ;

										html += '<dl class="dl-horizontal">';
											html += '<dt>Data da Solicitação:</dt>' + '<dd>' + d.data_solicitacao + '</dd>';
											html += '<dt>Vigência do Plano:</dt>' + '<dd>De ' + d.vigencia_plano_data_inicio + ' até ' + d.vigencia_plano_data_fim + '</dd>';
										html += '</dl>';
									html += '</div>';
								html += '</div>';
							html += '</div>';
						html += '</div>';
					html += '</div>';
				html += '</div>';

				//Políticas
				html += '<div class="panel panel-default">';
					html += '<div class="panel-heading">';
						html += '<h4 class="panel-title">';
							html += '<a id="btn_politicas" class="collapse-icon" data-toggle="collapse" data-parent="#accordion-variant-colors" href="#5_' + d.solicitacao + '" title="' + d.plano_id + '" data-btn-politicas>';
								html += '<i class="flaticon flaticon-important" aria-hidden="true"></i>&nbsp;Política(s)';
							html += '</a>';
						html += '</h4>';
					html += '</div>';
		
					html += '<div id="5_' + d.solicitacao + '" class="panel-collapse collapse">';
						html += '<div class="panel-body flex-pb-10">';
							html += '<div class="row">';
								html += '<div class="col-lg-12">';
									html += '<div class="flex-panel flex-background-white flex-border-dashed-gray flex-box-shadow">';
										html += '<div class="flex-panel flex-background-gradient-blue">';
											html += '<h3 class="flex-text-toupper flex-text-color-white flex-mt-0">';
												html += '<i class="flaticon flaticon-important icon-md pull-right" aria-hidden="true"></i> Análise de Política cumprida/violada';
											html += '</h3>';
										html += '</div>';
										
										html += '<div id="div_politicas"></div>';
									html += '</div>';
								html += '</div>';
							html += '</div>';
						html += '</div>';
					html += '</div>';
				html += '</div>';
			html += '</div>';

			html += '<div class="row">';
				html += '<div class="col-lg-12">';
					html += '<a href="https://minhahomolog.cnc.org.br/portal/p/CNC/pageworkflowview?app_ecm_workflowview_detailsProcessInstanceID=' + d.solicitacao + '" target="_blank" class="btn btn-info pull-right flex-mb-10">';
						html += '<i class="flaticon flaticon-view" aria-hidden="true"></i>' + ' Ver solicitação';
					html += '</a>';
				html += '</div>';
			html += '</div>';
		html += '</div>';

		return (html);
	},
	fnRetornarCadastroUsuarioIntegracao: function(sistema) {
		try {
			var c1 = DatasetFactory.createConstraint("SISTEMA", sistema, sistema, ConstraintType.MUST);
			
			var constraints = new Array(c1);
			
			var ds = DatasetFactory.getDataset("ds_form_cadastro_de_usuarios_integracao", null, constraints, null);
			
			if (ds.values.length > 0) {
				for (var i = 0; i < ds.values.length; i++) { 
					var values = {
						USER_NAME: ds.values[i]['USUARIO'],
						PASSWORD: ds.values[i]['SENHA'],
						HOST_NAME: ds.values[i]['HOST_NAME'],
						OAUTH_KEY: ds.values[i]['OAUTH_KEY'],
						OAUTH_SECRET: ds.values[i]['OAUTH_SECRET'],
						TOKEN_KEY: ds.values[i]['TOKEN_KEY'],
						TOKEN_SECRET: ds.values[i]['TOKEN_SECRET']
					}
					
					return values;
				}
			} else {
				throw "Widget Integração Fluig X Reserve - Não foi encontrado nenhum registro no formulário de 'Cadastro de Usuários de Integração' para o sistema " + sistema + ".";
			}
		} catch(e) {
			throw e;
		}
	}
});