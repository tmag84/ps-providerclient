var express = require('express');
var router = express.Router();
var http = require('http');
var session = require('express-session');

var sess;

router.get('/', function(req, res) {
	if (sess && sess.user) {
		res.render('index',
		{hasAuth:'O utilizador j? se encontra autenticado'});
	}
	else {
		res.render('index',null);
	}
});

router.post('/login', function(req, res) {	
	var options = {
		host: 'ps-project.apphb.com',
		path: '/token',
		method: 'POST',
		headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
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
			if (response.statusCode!=200) {	
				res.render('index',{responseMsg:json.error_description});
			}
			else {
				sess = req.session;
				sess.cookie.expires = false;
				sess.token = json['access_token'];			
				sess.user = req.body.email;
				res.redirect('/service');
			}
		});
	});

	request.on('error', (e) => {
		console.error(`problem with request: ${e.message}`);
		res.render('login',{responseMsg:e.message});
	});
	
	request.write('userName='+req.body.email+'&password='+req.body.password+'&grant_type=password')
	request.end()
	
});

router.post('/logout', function(req,res) {	
	req.session = null;
	res.render('index',null);	
});

router.get('/register', function(req,res) {
	res.render('register',null);
});

router.post('/register', function(req, res) {	
	var options = {
		host: 'ps-project.apphb.com',
		path: '/api/provider/register',
		method: 'POST',
		headers: {
          'Content-Type': 'application/json'
      }
	};
	
	var req_body = {
		email: req.body.email,
		password: req.body.password,
		service_name: req.body.name,
		service_description: req.body.description,
		service_contact_number: req.body.contact_number,
		service_contact_name: req.body.contact_name,
		service_contact_location: req.body.location,
		service_type: req.body.service_type		
	}
	
	var request = http.request(options,(response)=> {
		response.setEncoding('utf8');
		console.log(response.statusCode);
		
		if(response.statusCode===200) {
			console.log('User registred.');
			res.render('index',{responseMsg:'Registro feito com sucesso, seja bem vindo!'});
		}
	});

	request.on('error', (e) => {
		console.error(`problem with request: ${e.message}`);
		res.render('register',{responseMsg:e.message});
	});
	
	request.write(JSON.stringify(req_body));
	request.end()	
});

module.exports = router;