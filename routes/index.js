var express = require('express');
var router = express.Router();
	
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Community Fund' });
});

router.get('/home', function(req, res) {
	res.render('home', { title: 'PunchBeginner' });
});


router.get('/signup', function(req, res, next) {
	res.render('signup', { title: 'Sign Up' });
});

router.post('/signup', function(req, res, currentUser) {
	if (req.body.password == req.body.password2){
		var db = req.db;
	
		var userEmail = req.body.email
		var username = req.body.username
		var password = req.body.password
		
		var collection = db.get('usercollection');
		collection.createIndex({username:1}, {unique:true});
		
		collection.insert({
			"username" : username,
			"email" : userEmail,
			"password" : password
		}, function(err,doc) {
			if (err) {
				res.send("There was a problem adding the information to the database.");
			}
			else {
				res.cookie('username', username);
				res.location('home');
				res.redirect('home');
			}
		});
	} else {
		res.location("signup");
		res.redirect("signup");
	}
});

router.get('/login', function(req, res, next) {
	res.cookie('error', "none");
	res.render('login', { title: 'Login' });
});

router.post('/login', function(req, res) {
	var user_name = req.body.username;
	var password = req.body.password;
	var db = req.db;
	var userslist = db.get('usercollection');
	userslist.findOne({username:user_name},	function(err, user) {
		if (err || !user) {
			res.cookie('error', "not exist")
			res.redirect("login");
		} else {
			if (user.password == password){
				res.cookie('username', user_name);
				res.location('home');
				res.redirect('home');	
			} else {
				res.cookie('error', "incorrect")
				res.redirect("login");	
			}
		}
	});
});

router.get('/project', function(req, res, next) {
	res.render('project', { title: 'Project' });
});

router.get('/createproject', function(req, res, next) {
	res.render('createproject', { title: 'Create Project' });
});

router.get('/userlist', function(req, res) {
	var db = req.db;
	var collection = db.get('usercollection');
	collection.find({}, {}, function(e, docs) {
		res.render('userlist', 
			{ "userlist" : docs
		});
	});
	
});

router.get('/temp', function(req, res) {
	res.render('temp', {scripts: ['javascripts/temp.js']});
});

module.exports = router;
