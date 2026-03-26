$(document).ready(function() {
    var arrCourse = [];

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
        for (let i = 0; i < course.length; i++) {
            arrCourse.push({
                courseId: course[i].id,
                courseName: course[i].fullname
            });
        }

        var dataValues = arrCourse.filter(function(a) {
            return !this[JSON.stringify(a)] && (this[JSON.stringify(a)] = true);
        }, Object.create(null));

        for (var i = 0; i < dataValues.length; i++) {
            //console.log(dataValues[i]);
            fnRetornarTotalInscritos(dataValues[i]);
        }
    }).fail(function (jqXHR, textStatus) {
		console.log('Falha no carregamento dos dados.');
	});
});

function fnRetornarTotalInscritos(course) {
    var domainName = 'https://agendamento.cidex.eb.mil.br';
    var serverUrl = domainName + '/webservice/rest/server.php' ;
    var token = '9a0642f4172064d5a35643311abfcecb';
    var functionName = 'core_enrol_get_enrolled_users';

    var data = {
        wstoken: token,
        wsfunction: functionName,
        moodlewsrestformat: 'json',
        courseid: course.courseId
    }

    var html = '';
    var divRelatorios = document.getElementById('div_relatorios');

    $.ajax({
        type: 'POST',
        data: data,
        url: serverUrl,
        dataType: "json",
        beforeSend: function() {
            console.log('Carregando...');
            divRelatorios.innerHTML = 'Carregando...';
        },
        success: function(data) {
            var dataValues = data.filter(function(a) {
                return !this[JSON.stringify(a)] && (this[JSON.stringify(a)] = true);
            }, Object.create(null));

            //console.log(dataValues);
            console.log(dataValues.length);
            console.log(course.courseName);

            if (dataValues.length > 0) {
                html += '<div class="row">';
                    html += '<div class="col-6">';
                        html += '<ul class="list-group">';
                            html += '<li class="list-group-item d-flex justify-content-between align-items-start">';
                                html += '<div class="ms-2 me-auto">';
                                    html += '<div class="fw-bold">' + course.courseName + '</div>';
                                html += '</div>';

                                html += '<span class="badge text-bg-primary rounded-pill">' + dataValues.length + '</span>';
                            html += '</li>';
                        html += '</ul>';

                        html += '<br>';
                    html += '</div>';
                html += '</div>';
            } else {
                html += '<div class="alert alert-danger" role="alert">Nenhum registro encontrado.</div>';
            }
            
            divRelatorios.innerHTML += html;
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error("AJAX Error: ", errorThrown);
        },
        complete: function() {
            console.log("Registro(s) encontrado(s).");
        }
    });
}