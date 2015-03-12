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
		//collection.createIndex({username:1}, {unique:true});
		
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

router.post('/createproject', function(req, res) {
	var proj_title = req.body.projtitle;
	var name1 = req.body.firstname;
	var name2 = req.body.lastname;
	var projdetails = req.body.projdetails;
	var deadline = req.body.deadline;
	var goal = req.body.goal;

	if (!projdetails){
		projdetails = "";
	}
	var db = req.db;

	var counters = db.get('counters');
	var pid;
	counters.findOne({name:"projects"},	function(err, result) {
		if (err || !result) {
			console.log("error or result=null")
		} else {
			pid = result.counter+1;
			console.log("pid="+pid)

			var projects = db.get('projects');
			projects.insert({
				"pid":pid,
				"proj_title":proj_title,
				"proj_details":projdetails,
				"deadline":deadline,
				"goal":goal,
				"currentFunds":0
			}, function(err, docs){
				if (err) {
					//res.send("There was a problem adding the information to the database.");
				}
				else {
					//console.log("added " + proj_title + " pid="+pid);
					res.location('home');
					res.redirect('home');
				}
			});
		}
	});

	counters.update({name:"projects"}, {$inc:{counter:1}}, function(err,result) {
		if (err) console.err(err);
	});
});

module.exports = router;
