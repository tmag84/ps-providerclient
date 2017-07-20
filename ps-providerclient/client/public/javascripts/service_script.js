$(function() {
	buildServiceHome();
	
	switch(local_selection) {
		case 1: getServiceInfo(); break;
		case 2: getEvents(); break;
		case 3: getNotices(); break;
		case 4: getRankings(); break;
		default: getServiceInfo(); break;		
	}
});

function buildServiceHome() {
	var type = '';
	switch(local_service.service_type) {
		case 1:
			type = 'Bar';
			break;
		case 2:
			type = 'Cinema';
			break;
		case 3:
			type = 'Teatro';
			break;
		case 4:
			type = 'Dança';			
			break;
		case 5:
			type = 'Ginásio';
			break;
		case 6:
			type = 'Restaurante';
			break;
		default:
			type = 'Não especificado';
			break;	
	}
	$('#serviceType').html('<b> Tipo de Serviço:</b>'+type);
	
	var n_subcribers = 0;
	if (local_service.n_subscribers) {
		n_subcribers = local_service.n_subscribers;
	}
	
	var avg_rank = 0;
	if(local_service.avg_rank) {
		avg_rank = local_service.avg_rank;
	}
	
	$('#serviceRanking').html('<b>Número de assinantes:</b>'+n_subcribers);
	$('#serviceSubscribers').html('<b>Média de avaliação:</b>'+avg_rank);
	
	$('#btnSelections').html('<button onclick="getServiceInfo()">Informação</button>');
	$('#btnSelections').append('<button onclick="getEvents()">Eventos</button>');
	$('#btnSelections').append('<button onclick="getNotices()">Noticias</button>');
	$('#btnSelections').append('<button onclick="getRankings()">Comentários</button>');
}

function getServiceInfo() {
	local_selection = 1;
	$('#placeholder').html('<div class="center">'	
		+'<button onclick="editInformation()">Alterar Informação</button>'
		+'<button onclick="editPassword()">Alterar Password</button>');
	$('#placeholder').append('<br/>');
	
	$('#placeholder').append('<div class="container">'
			+'<div class="row">'
			+'<div class="col-sm-6">'
			+'<p id="service_description"><b>Descrição:	</b>'+local_service.description
			+'<p id="service_location"><b>Localização:	</b>'+local_service.contact_location
			+'</div>'
			+'<div class="col-sm-6">'
			+'<p id="contact_name"><b>Pessoa a contactar:	</b>'+local_service.contact_name
			+'<p id="contact_email"><b>Email de contacto:	</b>'+local_service.provider_email
			+'<p id="contact_number"><b>Número de contacto:	</b>'+local_service.contact_number
			+'</div></div></div>');
}

function editInformation() {
	$('#placeholder').html('<label for="name">Nome do Serviço</label>'
		+'<p><textarea rows="1" cols="150" id="name" name="name" maxlength=150 form="providerForm">'+local_service.name+'</textarea>'
		+'<p><label for="description">Descrição</label>'
		+'<p><textarea rows="4" cols="100" id="description" name="description" maxlength=400 form="providerForm">'+local_service.description+'</textarea>'
		+'<p><label for="location">Localização</label>'
		+'<p><textarea rows="1" cols="150" id="location" name="location" maxlength=150 form="providerForm">'+local_service.contact_location+'</textarea>'
		+'<p><label for="contactName">Nome do Contacto</label>'
		+'<p><textarea rows="1" cols="150" id="contactName" name="contact_name" maxlength=150 form="providerForm">'+local_service.contact_name+'</textarea>'
		+'<p><label for="contactNumber">Número a Contactar</label>'
		+'<p><textarea rows="1" cols="10" id="contactNumber" name="contact_number" maxlength=9 form="providerForm">'+local_service.contact_number+'</textarea>'
	);
		
	$('#placeholder').append('<form id="providerForm" action="/service/edit-provider" method="post">'
		+'<div class="form-group">'
		+'<span class="glyphicon glyphicon-remove">'
		+'<input type="button" value="Cancelar" onclick="getServiceInfo()">'
		+'</span></input>'
		+'<span class="glyphicon glyphicon-ok">'
		+'<input type="submit" value="Submeter">'
		+'</span></input>'
		+'</div>'
		+'</form>');
		
	$("providerForm").data("changed", false);
	$("providerForm").on("change", function() {
		alert('here');
		$(this).data("changed", true);
	});
		
	$("#providerForm").submit(function(e) {
		e.preventDefault();
		if (changesToForm()) {
			$.ajax({
				type: "POST",
				url: "/service/edit-provider",
				data: $("#providerForm").serialize(),
				success: function(result){
					local_service.name = $('#name').val();
					local_service.description = $('#description').val();
					local_service.contact_location = $('#location').val();
					local_service.contact_number = $('#contactNumber').val();
					local_service.contact_name = $('#contactName').val();					
					getServiceInfo();
				},
				dataType: "json"		
			});
		}
	});
}

function changesToForm() {
	if(local_service.name === $('#name').val() &&
		local_service.description === $('#description').val() &&
		local_service.contact_location === $('#location').val() &&
		local_service.contact_number === $('#contactNumber').val() &&
		local_service.contact_name === $('#contactName').val()) {
			return false;
		}
	return true;
}

function editPassword() {	
	$('#placeholder').html('<form id="passwordForm">'
		+'<div class="container">'
		+'<div class="row">'
		+'<div class="col-sm-3">'
		+'<label for="newPassword">Nova Password     </label>'
		+'<p><input type="password" id="newPassword" class="form-control" name="new_password" maxlength=20>'
		+'</div>'
		+'<div class="col-sm-3">'		
		+'<label for="newPasswordConfirm">Confirmar Password</label>'
		+'<p><input type="password" id="newPasswordConfirm" class="form-control" name="confirmPassword" maxlength=20 data-rule-equalTo="#newPassword">'
		+'</div>'
		+'</div>'
		+'<div class="row">'
		+'<div class="col-sm-6">'
		+'<span class="glyphicon glyphicon-remove">'
		+'<input type="button" value="Cancelar" onclick="getServiceInfo()">'
		+'</span></input>'
		+'<span class="glyphicon glyphicon-ok">'
		+'<input type="submit" value="Submeter">'
		+'</span></input>'
		+'</div>'
		+'</div>'
		+'</div>'
		+'</form>');
		
	$("#passwordForm").validate({
		rules: {
			newPasswordConfirm: {
				equalTo: "#newPassword"
				}
		}
	});
	
	$("#passwordForm").submit(function(e) {
		e.preventDefault();
		if ($("#passwordForm").valid()) {
			$.ajax({
				type: "POST",
				url: "/service/edit-password",
				data: $("#passwordForm").serialize(),
				success: function(result){
					getServiceInfo();
				},
				dataType: "json"		
			});
		}
	});
}

function getEvents() {
	local_service.service_events.sort(function(ev1,ev2) {
		return ev1.event_begin-ev2.event_begin;
	});
	
	local_selection = 2;
	$('#placeholder').html('<div class="center">'	
		+'<button id="createEvent">Criar Evento</button>');	
	$('#placeholder').append('<br/>');
	
	var tableContent='<table border="4", style="width:100%">'
		+'<tr>'
		+'<th>Evento</th>'
		+'<th>Data</th>'
		+'<th>Duração</th>'
		+'</tr>';
	
	local_service.service_events.forEach(function(ev) {
		tableContent += '<tr>'
		tableContent += '<td>'+ev.text+'</td>';
		tableContent += '<td>'+new Date(ev.event_begin*1000);+'</td>';
		tableContent += '<td>'+getDuration(ev)+'</td>';		
		tableContent += '<td><button onclick=deleteEvent('+ev.service_id+','+ev.id+') class="btn-link">Delete</button></td>';		
		tableContent += '</tr>';
	});
	tableContent +='</table>';	
	$('#placeholder').append(tableContent);
	
	$('#createEvent').click(function(){
		createEventDialog();
	});
}

function deleteEvent(service_id, event_id) {
	$.ajax({
		type: "POST",
		url: '/service/delete-event/'+service_id+'/'+event_id,
		data: {},
		success: function(result){			
			for (var i =0; i < local_service.service_events.length; i++) {
				var ev = local_service.service_events[i];				
				if (ev.service_id===service_id && ev.id===event_id) {
					local_service.service_events.splice(i,1);
					break;
				}			
			}
			getEvents();
		},
		dataType: "json"		
	});
}

function createEventDialog() {
	return $('<div class="dialog-event"'
		+'<h4>Descrição do Evento (400 caracteres máximo)</h4>'
		+'</br>'
		+'<textarea rows="4" cols="110" id="text" name="text" maxlength=400 form="eventForm" placeholder="Descrição do Evento"/>'
		+'<div class="container" style="max-width: 900px;">'
		+'<div class="row">'
		+'<div class="col-sm-8">'
		+'<h4>Data do Evento (dia-mês-ano,horas:minutos)</h4>'
		+'<textarea rows="1" cols="2" id="day" name="day" maxlength=2 form="eventForm" placeholder="00"/>'
		+'<textarea rows="1" cols="2" id="month" name="month" maxlength=2 form="eventForm"placeholder="00"/>'
		+'<textarea rows="1" cols="4" id="year" name="year" maxlength=4 form="eventForm" placeholder="0000"/>'
		+'<textarea rows="1" cols="2" id="start_hours" name="start_hours" maxlength=2 form="eventForm" placeholder="00"/>'
		+'<textarea rows="1" cols="2" id="start_minutes" name="start_minutes" maxlength=2 form="eventForm" placeholder="00"/>'
		+'</div>'
		+'<div class="col-sm-4">'
		+'<h4>Duração do Evento</h4>'
		+'<textarea rows="1" cols="4" id="end_hours" name="end_hours" maxlength=2 form="eventForm" placeholder="00"/>'
		+'<textarea rows="1" cols="4" id="end_minutes" name="end_minutes" maxlength=2 form="eventForm" placeholder="00"/>'
		+'</div>'
		+'</div>'
		+'</div>'
		+'</br>'
		+'<form id="eventForm">'
		+'</form>'
		+'</div>')		
    .dialog({
		title: "Criar Evento",
        resizable: false,
		height:"auto",
		width:"auto",
		buttons: {
			Cancel:{
				class: 'dialog_event_cancel',
                    text: 'Cancelar',
                    click : function (){
                        $(this).dialog('close');
                    }
			},			
			Create:{ 
                class: 'dialog_event_submit',
                text: 'Criar Evento',
				click : function (){
					if(validDate()) {
						$.ajax({
							type: "POST",
							url: "/service/create-event",
							data: $("#eventForm").serialize(),
							success: function(result){
								local_service.service_events.push(result.result);
								getEvents();
							},
							dataType: "json"
						});
						$(this).dialog('close');
						$(this).dialog('destroy').remove();
					}
                   }
			}
		}
    });
}

function validDate() {
	var day = parseInt($('#day').val());
	var month = parseInt($('#month').val());
	var year = parseInt($('#year').val());
	var start_hours = parseInt($('#start_hours').val());
	var start_minutes = parseInt($('#start_minutes').val());
	var end_hours = parseInt($('#end_hours').val());
	var end_minutes = parseInt($('#end_minutes').val());
	
	var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	if ((!(year % 4) && year % 100) || !(year % 400)) {
		daysInMonth[1] = 29;
	}
	
	if(day < 0 && day > daysInMonth[month-1]) {
		alert('Dia do evento é inválido');
		return false;
	}
	
	if (month<0 || month>12) {
		alert('Valor inválido para mês');
		return false;
	}
	
	if (start_hours<0 || start_hours>23) {
		alert('Valor inválido para horas de início');
		return false;
	}
	
	if (start_minutes<0 || start_minutes>59) {
		alert('Valor inválido para minutos de início');
		return false;
	}	
	
	if (end_hours<0 || end_hours>23) {
		alert('Valor inválido para horas de duração');
		return false;
	}
	
	if (end_minutes<0 || end_minutes>59) {
		alert('Valor inválido para minutos de duração');
		return false;
	}
	
	var now_date = new Date();
	var event_date = new Date(year,month-1,day);
	event_date.setHours(start_hours);
	event_date.setMinutes(start_minutes);
	
	if(event_date==='NaN') {
		alert('Data do evento é inválida');
		return false;
	}
	
	if (now_date.getTime()>event_date.getTime()) {
		alert('Data do evento anterior à data actual');
		return false;
	}
	return true;
}

function getNotices() {
	local_service.service_notices.sort(function(n1,n2) {
		return n1.creation_date-n2.creation_date;
	});
	
	local_selection = 3;
	
	$('#placeholder').html('<div class="center">'	
		+'<button id="createNotice">Criar Notícia</button>');
	$('#placeholder').append('<br/>');

	
	var tableContent='<table border="4", style="width:100%">'
		+'<tr>'
		+'<th>Notícia</th>'
		+'<th>Data</th>'
		+'</tr>';
	
	local_service.service_notices.forEach(function(notice) {
		tableContent += '<tr>';
		tableContent += '<td>'+notice.text+'</td>';
		tableContent += '<td>'+new Date(notice.creation_date*1000)+'</td>';		
		tableContent += '<td><button onclick=deleteNotice('+notice.service_id+','+notice.id+') class="btn-link">Delete</button></td>';							
		tableContent += '</tr>';
	});
	tableContent +='</table>';	
	$('#placeholder').append(tableContent);	
	
	$('#createNotice').click(function(){
		createNoticeDialog();
	});
}

function deleteNotice(service_id, notice_id) {
	$.ajax({
		type: "POST",
		url: '/service/delete-notice/'+service_id+'/'+notice_id,
		data: {},
		success: function(result){
			for (var i =0; i < local_service.service_notices.length; i++) {
				var notice = local_service.service_notices[i];				
				if (notice.service_id===service_id && notice.id===event_id) {
					local_service.service_notices.splice(i,1);
					break;
				}			
			}
			getNotices();
		},
		dataType: "json"		
	});
}

function createNoticeDialog() {
	return $('<div class="dialog-notice"'
		+'<h4>Notícia (200 caracteres máximo)</h4>'
		+'</br>'
		+'<textarea rows="4" cols="60" id="text" name="text" maxlength=200 form="noticeForm"></textarea>'
		+'<form id="noticeForm">'
		+'</form>'
		+'</div>')		
    .dialog({
		title: "Criar Notícia",
        resizable: false,
		height:"auto",
		width:"auto",
		buttons: {
			Cancel:{
				class: 'dialog_notice_cancel',
                    text: 'Cancelar',
                    click : function (){
                        $(this).dialog('close');
                    }
			},			
			Create:{
				class: 'dialog_notice_submit',
				text: 'Criar Notícia',  
				click : function (){
					$.ajax({
						type: "POST",
						url: "/service/create-notice",
						data: $("#eventForm").serialize(),
						success: function(result){
							local_service.service_notices.push(result.result);
							getNotices();
						},
						dataType: "json"
					});
					$(this).dialog('close');
					$(this).dialog('destroy').remove();
                }
            }
		}
    });
}

function getRankings() {
	local_selection = 4;
	
	var tableContent='<table border="4", style="width:100%">'
		+'<tr>'
		+'<th>Utilizador</th>'
		+'<th>Comentador</th>'
		+'<th>Nota</th>'
		+'<th>Data</th>'
		+'</tr>';
	
	local_service.service_rankings.forEach(function(rank) {
		tableContent += '<tr>';
		tableContent += '<td>'+rank.user_name+'</td>';
		tableContent += '<td>'+rank.text+'</td>';
		tableContent += '<td>'+rank.value+'</td>';
		tableContent += '<td>'+new Date(rank.creation_date*1000)+'</td>';
		tableContent += '</tr>';
	});
	tableContent +='</table>';	
	$('#placeholder').html(tableContent);
}

function getDuration(ev) {
	var diff = ev.event_end-ev.event_begin;
	var duration = '';
	var hours = parseInt(diff/3600,10);
	var minutes = parseInt((diff%3600)/60,10);
	
	if (hours===0 && minutes===0) {
		return 'sem tempo definido';
	}
	
	if (hours>0) {
		duration=hours+'horas';		
		if (minutes>0) {
			duration+=' e '+minutes+'minutos';
		}	
	}
	else {
		if (minutes>0) {
			duration=+minutes+'minutos';
		}
	}
	return duration;
}