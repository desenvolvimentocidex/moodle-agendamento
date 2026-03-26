$(document).ready(function() {
    var arrCourse = [];
    arrUsersCourse = [];

    var mensagemCumprimento = fnMensagemCumprimento();
    $('#mensagem_cumprimento').append(mensagemCumprimento);

    var domainName = 'https://agendamento.cidex.eb.mil.br';
    var serverUrl = domainName + '/webservice/rest/server.php';
    var token = '9a0642f4172064d5a35643311abfcecb';
    var functionName = 'core_course_get_courses';

    var data = {
        wstoken: token,
        wsfunction: functionName,
        moodlewsrestformat: 'json'
    }

    $.ajax({
        type: 'GET',
        data: data,
        url: serverUrl,
        beforeSend : function() {
			console.log('Carregando...');
		}
    }).done(function(course) {
        console.log(course);

        for (let i = 0; i < course.length; i++) {
            arrCourse.push({
                cbx: '<input type="checkbox" id="cbx_selecionar_unico' + course[i].id + '" name="cbx-select-single[]" value="' + course[i].id + '" class="cbx-select-single" title="Selecionar Solicitação" data-cbx-selecionar-unico>',
                id: course[i].id,
                fullname: course[i].fullname,
                shortname: course[i].shortname,
                summary: course[i].summary,
                timecreated: fnConverterTimestampParaDataPTBR(course[i].timecreated),
                timemodified: fnConverterTimestampParaDataPTBR(course[i].timemodified)
            });
        }

        //Remover registros duplicados e/ou repetidos
        var dataValues = arrCourse.filter(function(a) {
            return !this[JSON.stringify(a)] && (this[JSON.stringify(a)] = true);
        }, Object.create(null));

        console.log(dataValues);

        var table = $('#datatable').DataTable({
            "data": dataValues,
            "language": {
                //"url": "../../dataTables/language/pt-BR.json"
                //"searchPlaceholder": "Pesquisar"
            },
            "columnDefs": [
                { "targets": 0, "visible": true, "orderable": false }, //Checkbox
                { "targets": 1, "visible": true }, //id
                { "targets": 2, "visible": true }, //fullname
                { "targets": 3, "visible": true }, //shortname
                { "targets": 4, "visible": false }, //summary
                { "targets": 5, "visible": true }, //timecreated
                { "targets": 6, "visible": true }, //timemodified
            ],
            "lengthMenu": [[10, 15, 20, 25, 30, -1], [10, 15, 20, 25, 30, "Tudo"]],
            order: [1, 'desc'],
            pageLength: 15,
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
                    data: 'id', 
                    title: 'CÓDIGO', 
                    autoWidth: true, 
                    className: 'flex-control',
                    render: function (data, type, item) { 
                        return item.id; 
                    }
                },
                /*02*/
                {
                    data: 'fullname', 
                    title: 'CURSO', 
                    autoWidth: true, 
                    className: 'flex-control',
                    render: function (data, type, item) { 
                        return item.fullname; 
                    }
                },
                /*03*/
                {
                    data: 'shortname', 
                    title: 'NOME CURTO', 
                    autoWidth: true, 
                    className: 'flex-control',
                    render: function (data, type, item) { 
                        return item.shortname; 
                    }
                },
                /*04*/
                {
                    data: 'summary', 
                    title: 'SUMÁRIO', 
                    autoWidth: true, 
                    className: 'flex-control',
                    render: function (data, type, item) { 
                        return item.summary; 
                    }
                },
                /*05*/
                {
                    data: 'timecreated', 
                    title: 'DATA CADASTRO', 
                    autoWidth: true, 
                    className: 'flex-control',
                    render: function (data, type, item) { 
                        return item.timecreated; 
                    }
                },
                /*06*/
                {
                    data: 'timemodified', 
                    title: 'DATA ATUALIZADO', 
                    autoWidth: true, 
                    className: 'flex-control',
                    render: function (data, type, item) { 
                        return item.timemodified; 
                    }
                }
            ]
        });

        $('#datatable tbody').on('click', 'td.flex-control', function() {
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            
            if (row.child.isShown()) {
                // This row is already open - close it
                row.child.hide();
            } else {
                // Open this row
                //console.log(row.data());

                row.child(
                    fnDetalhes(row.data())
                ).show();
            }
        });
    }).fail(function (jqXHR, textStatus) {
		console.log('Falha no carregamento da tabela dinâmica.');
	});

    //Modal  
    $(document).on('click', '#btn_show_modal', function(e) {
        e.preventDefault();

        var courseId = $(this).attr('href');

        var domainName = 'https://agendamento.cidex.eb.mil.br';
        var serverUrl = domainName + '/webservice/rest/server.php' ;
        var token = '9a0642f4172064d5a35643311abfcecb';
        var functionName = 'core_enrol_get_enrolled_users';

        var data = {
            wstoken: token,
            wsfunction: functionName,
            moodlewsrestformat: 'json',
            courseid: courseId
        }

        var html = '';
        var modal = document.getElementById('modal');
        var modalInstance = bootstrap.Modal.getOrCreateInstance(modal);
        var modalContentBody = document.getElementById('div_modal_body');
        var modalContentFooter = document.getElementById('div_modal_footer');
        
        modalContentBody.innerHTML = '';
        modalContentFooter.innerHTML = '';

        modalInstance.show();

        $.ajax({
            type: 'POST',
            data: data,
            url: serverUrl,
            dataType: "json",
            beforeSend: function() {
                console.log('Carregando...');
                modalContentBody.innerHTML = 'Carregando...';
            },
            success: function(data) {
                var count = 1;

                if (data.length > 0) {
                    html += '<div style="margin-bottom: 15px;">';
                        html += '<div class="input-group mb-3">';
                            html += '<span class="input-group-text" id="basic-addon1">Pesquisar</span>';
                            html += '<input type="text" id="input_pesquisar" class="form-control" onkeyup="fnPesquisar()" aria-describedby="basic-addon1">';
                        html += '</div>';
                    html += '</div>';

                    html += '<div class="table-responsive">';
                        html += '<table id="tbl_inscritos" class="table table-sm table-dark table-borderless table-striped table-hover">';
                            html += '<thead>';
                                html += '<tr>';
                                    html += '<th scope="col"></th>';
                                    html += '<th scope="col">COD</th>';
                                    html += '<th scope="col">INSCRIÇÃO</th>';
                                    html += '<th scope="col">NOME</th>';
                                    html += '<th scope="col">E-MAIL</th>';
                                    html += '<th scope="col">PRIMEIRO ACESSO</th>';
                                    html += '<th scope="col">ÚLTIMO ACESSO</th>';
                                html += '</tr>';
                            html += '</thead>';
                        
                            html += '<tbody>';
                                for (var i = 0; i < data.length; i++) {
                                    var course = data[i].enrolledcourses;
                                    fnRetornarDadosCurso(course);                                   

                                    var roles = data[i].roles;
                                    
                                    roles.forEach(function(objeto) {
                                        for (var chave in objeto) {
                                            if (chave == 'shortname' && objeto[chave] == 'student') {
                                                //console.log("Chave: " + chave + "; Valor: " + objeto[chave] + "<br>");

                                                html += '<tr>';
                                                    html += '<td>' + count + '</td>';
                                                    html += '<td>' + data[i].id + '</td>';
                                                    html += '<td>' + data[i].username + '</td>';
                                                    html += '<td>' + data[i].fullname + '</td>';
                                                    html += '<td>' + data[i].email + '</td>';
                                                    html += '<td>' + fnConverterTimestampParaDataPTBR(data[i].firstaccess) + '</td>';
                                                    html += '<td>' + fnConverterTimestampParaDataPTBR(data[i].lastaccess) + '</td>';
                                                html += '</tr>';
                                                    
                                                //modalContentFooter.innerHTML = 'TOTAL: ' + data.length;
                                                modalContentFooter.innerHTML = 'TOTAL INSCRITOS: ' + count++;
                                            }
                                        }
                                    });
                                }
                            html += '</tbody>';
                        html += '</table>';
                    html += '</div>';
                } else {
                    html += '<div class="alert alert-danger" role="alert">Nenhum registro encontrado para o curso selecionado.</div>';
                }

                modalContentBody.innerHTML = html;
            },
            error: function(jqXHR, textStatus, errorThrown) {
                modalContentBody.innerHTML = "Ocorreu erro ao carregar o conteúdo: " + textStatus;
                console.error("AJAX Error: ", errorThrown);
            },
            complete: function() {
                console.log("Registro(s) encontrado(s).");
            }
        });
    });
});

function fnConverterTimestampParaDataPTBR(value) {
    var date = new Date(value * 1000);
    return date.toLocaleDateString("pt-BR");
}

function fnDetalhes(course) {
    var html = '';
    html += '<div class="div_users_course"></div>';

    html += '<a class="btn btn-primary" data-bs-toggle="collapse" href="#1_' + course.id + '" role="button" aria-expanded="false" aria-controls="#1_' + course.id + '">';
        html += 'Sumário';
    html += '</a>';

    html += '&nbsp;&nbsp;&nbsp;&nbsp;';

    // html += '<a class="btn btn-primary" data-bs-toggle="collapse" href="#2_' + course.id + '" role="button" aria-expanded="false" aria-controls="#2_' + course.id + '">';
    //     html += 'Candidatos Inscritos';
    // html += '</a>';

    // html += '<button type="button" id="btn_show_modal" class="btn btn-primary">';
    //     html += 'Candidatos Inscritos';
    // html += '</button>';

    html += '<a href="' + course.id + '" class="btn btn-primary" id="btn_show_modal" role="button">';
        html += 'Candidatos Inscritos';
    html += '</a>';

    //Sumário
    html += '<div class="collapse" id="1_' + course.id + '" style="margin-top: 8px;">';
        html += '<div class="card">';
            html += '<h5 class="card-header">Sumário</h5>';

            html += '<div class="card-body">';
                html += '<p class="card-text">' + (course.summary != '' ? course.summary : 'Sumário não informado.') + '</p>';
            html += '</div>';
        html += '</div>';
    html += '</div>';

    //var teste = fnRetornarUsuariosInscritosNoCurso(course.id);
    
    //Candidatos Inscritos
    html += '<div class="collapse" id="2_' + course.id + '" style="margin-top: 8px;">';
        html += '<div class="card">';
            html += '<h5 class="card-header">Candidatos Inscritos</h5>';
        
            html += '<div class="card-body">';                
                //html += teste.firstname;
                //html += '<div id="div_users_course"></div>';
            html += '</div>';
        html += '</div>';
    html += '</div>';

    return html;
}

function fnRetornarDadosCurso(course) {
    modalTitle = document.getElementById("modal_title");

    modalTitle.innerHTML = '';

    course.forEach(function(objetoCourse) {
        modalTitle.innerHTML = objetoCourse.fullname;
    });
}

function fnMensagemCumprimento() {
    moment.locale('pt-BR');
    
    moment.updateLocale('pt-BR', {
        months : [
            "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho",
            "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
        ]
    });

    const agora = moment();
    const hora = agora.hour(); // Obtém a hora atual (0-23)

    if (hora >= 5 && hora < 12) {
        return `Bom dia! ${agora.format('LLLL')}.`;
    } else if (hora >= 12 && hora < 18) {
        return `Boa tarde! ${agora.format('LLLL')}.`;
    } else {
        return `Boa noite! ${agora.format('LLLL')}.`;
    }
}

function fnPesquisar() {
    let input, filtro, tabela, linhas, celulas, i, texto;
    input = document.getElementById("input_pesquisar");
    filtro = input.value.toUpperCase();
    tabela = document.getElementById("tbl_inscritos");
    linhas = tabela.getElementsByTagName("tr");

    for (i = 0; i < linhas.length; i++) {
        celulas = linhas[i].getElementsByTagName("td");
        let linhaVisivel = false;

        for (let j = 0; j < celulas.length; j++) {
            if (celulas[j]) {
                texto = celulas[j].innerText;

                if (texto.toUpperCase().indexOf(filtro) > -1) {
                    linhaVisivel = true;
                    break;
                }
            }
        }

        if (linhaVisivel) {
            linhas[i].style.display = "";
        } else {
            linhas[i].style.display = "none";
        }
    }
}