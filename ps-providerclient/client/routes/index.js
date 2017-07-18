var express = require('express');
var router = express.Router();
var http = require('http');
var session = require('express-session');

var sess;

router.get('/', function(req, res) {
	if (sess && sess.user) {
		res.render('index',
		{errorMsg:'O utilizador já se encontra autenticado'});
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
	var request = http.request(options,(response)=> {
		response.setEncoding('utf8');
		response.on('data', (data) => {			
			var json = JSON.parse(data);			
			sess = req.session;
			sess.cookie.expires = false;
			sess.token = json['access_token'];			
			sess.user = req.body.email;
			res.redirect('/service');			
		});
	});

	request.on('error', (e) => {
		console.error(`problem with request: ${e.message}`);
		res.render('login',{errorMsg:e.message});
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
		path: '/api/provider/edit-password',
		method: 'POST',
		headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
      }
	};
	
	console.log(req.body);

	/*
	var json = {
		
	};
	
	var request = http.request(options,(response)=> {
		response.setEncoding('utf8');
		response.on('data', (data) => {			
			var json = JSON.parse(data);			
			sess = req.session;
			sess.cookie.expires = false;
			sess.token = json['access_token'];			
			sess.user = req.body.email;
			res.redirect('/service');			
		});
	});

	request.on('error', (e) => {
		console.error(`problem with request: ${e.message}`);
		res.render('register',{errorMsg:e.message});
	});
	
	request.write(JSON.stringify(json));
	request.end()
	*/	
});

module.exports = router;