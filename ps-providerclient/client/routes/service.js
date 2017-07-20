var express = require('express');
var router = express.Router();
var http = require('http');
var session = require('express-session');

var sess

router.get('/', function(req, res, next) {
	sess = req.session;
	if (!sess|| !sess.token) {
		res.redirect('/');
	}
	else {
		var options = {
			host: 'ps-project.apphb.com',
			path: '/api/provider/get-service',
			method: 'GET',
			headers: {
				Authorization:'Bearer '+sess.token,
				'Content-Type': 'application/json'
			}		
		};
	
		var body = "";	
		var request = http.request(options,(response)=> {
			response.setEncoding('utf8');
			response.on('data', (data) => {
				body+=data;	
			});
			
			response.on('end', () => {
				var json = JSON.parse(body);
				
				console.log(json);


				
				sess.service_id = json.service.id;				
				res.render('service',{service_info:json.service});
			});
		});

		request.on('error', (e) => {
			console.error(`problem with request: ${e.message}`);
			res.render('service',{errorMsg:e.message});
		});
		
		request.end();
	}
});

router.post('/create-event',function(req,res,next) {
	sess = req.session;
	if (!sess|| !sess.token) {
		res.redirect('/');
	}
	else {
		var options = {
			host: 'ps-project.apphb.com',
			path: '/api/provider/create-event',
			method: 'POST',
			headers: {
				Authorization:'Bearer '+sess.token,
				'Content-Type': 'application/json'
			}		
		};
		
		var day = req.body.day;
		var month = req.body.month;
		var year = req.body.year;
		var start_hours = req.body.start_hours;
		var start_minutes = req.body.start_minutes;
		var end_hours = req.body.end_hours;
		var end_minutes = req.body.end_minutes;
		
		var event_date = new Date(year,month-1,day);
		event_date.setHours(start_hours);
		event_date.setMinutes(start_minutes);
		
		var begin = event_date.getTime()/1000;
		var end = begin + (end_hours*60*60) + (end_minutes*60);
		
		var req_body = {
			service_id: sess.service_id,
			text: req.body.text,
			event_begin: begin,
			event_end: end
		}
		
		var resp_body = "";
		
		var request = http.request(options,(response)=> {
			response.setEncoding('utf8');
			response.on('data', (data) => {
				resp_body+=data;	
			});			
			
			response.on('end', () => {
				console.log('Event created with success');
				var created_event = JSON.parse(resp_body);
				
				res.send({result:created_event});				
			});
		});

		request.on('error', (e) => {
			console.error(`problem with request: ${e.message}`);
			res.send({error:e.message});
		});
		request.write(JSON.stringify(req_body));
		request.end();
	}
});

router.post('/delete-event/:service_id/:event_id',function(req,res,next) {
	sess = req.session;
	if (!sess|| !sess.token) {
		res.redirect('/');
	}
	else {
		var options = {
			host: 'ps-project.apphb.com',
			path: '/api/provider/delete-event',
			method: 'POST',
			headers: {
				Authorization:'Bearer '+sess.token,
				'Content-Type': 'application/json'
			}		
		};
		
		var req_body = {
			service_id:req.params.service_id,
			id:req.params.event_id
		};
		
		var request = http.request(options,(response)=> {
			response.setEncoding('utf8');			
			if(response.statusCode===200) {
				console.log('Event deleted with success');
				res.send({success : "Evento foi apagado"});
			}	
		});

		request.on('error', (e) => {
			console.error(`problem with request: ${e.message}`);
			res.send({error:e.message});
		});
		request.write(JSON.stringify(req_body));
		request.end();
	}	
});

router.post('/create-notice',function(req,res,next) {
	sess = req.session;
	if (!sess|| !sess.token) {
		res.redirect('/');
	}
	else {
		var options = {
			host: 'ps-project.apphb.com',
			path: '/api/provider/create-notice',
			method: 'POST',
			headers: {
				Authorization:'Bearer '+sess.token,
				'Content-Type': 'application/json'
			}		
		};
		
		var req_body = {
			service_id: sess.service_id,
			text: req.body.text
		}
		
		var resp_body = "";		
			
		var request = http.request(options,(response)=> {
			response.on('data', (data) => {
				resp_body+=data;	
			});			
			
			response.on('end', () => {
				console.log('Notice created with success');
				var created_notice = JSON.parse(resp_body);			

				res.send({result:created_notice});				
			});
		});

		request.on('error', (e) => {
			console.error(`problem with request: ${e.message}`);
			res.send({error:e.message});
		});
		request.write(JSON.stringify(req_body));
		request.end();
	}
});

router.post('/delete-notice/:service_id/:notice_id',function(req,res,next) {
	sess = req.session;
	if (!sess|| !sess.token) {
		res.redirect('/');
	}
	else {
		var options = {
			host: 'ps-project.apphb.com',
			path: '/api/provider/delete-notice',
			method: 'POST',
			headers: {
				Authorization:'Bearer '+sess.token,
				'Content-Type': 'application/json'
			}		
		};
		
		var req_body = {
			service_id:req.params.service_id,
			id:req.params.notice_id
		};		
		
		var request = http.request(options,(response)=> {
			response.setEncoding('utf8');
			if(response.statusCode===200) {
				console.log('Notice delete with success');
				res.send({success : "Notícia apagada com sucesso."});
			}
		});

		request.on('error', (e) => {
			console.error(`problem with request: ${e.message}`);
			res.send({error:e.message});
		});
		request.write(JSON.stringify(req_body));
		request.end();
	}
});

router.post('/edit-provider',function(req,res,next) {
	sess = req.session;
	if (!sess|| !sess.token) {
		res.redirect('/');
	}
	else {
		var options = {
			host: 'ps-project.apphb.com',
			path: '/api/provider/edit-service',
			method: 'PUT',
			headers: {
				Authorization:'Bearer '+sess.token,
				'Content-Type': 'application/json'
			}		
		};
		
		var req_body = {
			name:req.body.name,
			description:req.body.description,
			contact_name:req.body.contact_name,
			contact_location:req.body.location,
			contact_number:req.body.contact_number			
		}	
		
		var request = http.request(options,(response)=> {
			response.setEncoding('utf8');
			response.on('end', () => {
				console.log('User data changed');
				res.send({success : "Dados foram alterados."});
			});
		});

		request.on('error', (e) => {
			console.error(`problem with request: ${e.message}`);
			res.send({error:e.message});
		});
		request.write(JSON.stringify(req_body));
		request.end();
	}
});

router.post('/edit-password',function(req,res,next) {
	sess = req.session;
	if (!sess|| !sess.token) {
		res.redirect('/');
	}
	else {
		var options = {
			host: 'ps-project.apphb.com',
			path: '/api/provider/edit-password',
			method: 'PUT',
			headers: {
				Authorization:'Bearer '+sess.token,
				'Content-Type': 'application/json'
			}		
		};
		
		var req_body = {
			password: req.body.new_password			
		};		
		
		var request = http.request(options,(response)=> {
			response.setEncoding('utf8');
			response.on('end', () => {
				console.log('User password changed with success');
				res.send({success : "Password foi alterada."});
			});
		});

		request.on('error', (e) => {
			console.error(`problem with request: ${e.message}`);
			res.send({error:e.message});			
		});
		request.write(JSON.stringify(req_body));
		request.end();
	}
});

module.exports = router;