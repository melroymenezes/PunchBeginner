var express = require('express');
var router = express.Router();
var querystring = require('querystring');
var url = require('url');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Community Fund' });
});

router.get('/home', function(req, res) {
	if (req.session && req.session.user) {
		res.render('home', {title: 'PunchBeginner',
							currentUser: req.session.user,
							scripts: ["javascripts/home.js"] });
	} else {
		res.render('home', { title: 'PunchBeginner',
							currentUser: "Not logged in." ,
							scripts: ["javascripts/home.js"] });
	}
	
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
				//res.cookie('username', username);
				req.session.user = username;
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
	res.render('login', { title: 'Login' });
});

router.post('/login', function(req, res) {
	var user_name = req.body.username;
	var password = req.body.password;
	var db = req.db;
	var userslist = db.get('usercollection');
	userslist.findOne({username:user_name},	function(err, user) {
		if (err || !user) {
			res.redirect("login");
		} else {
			if (user.password == password){
				//res.cookie('username', user_name);
				req.session.user = user_name;
				res.location('home');
				res.redirect('home');	
			} else {
				res.redirect("login");	
			}
		}
	});
});

var loadProject = function(req, res) {
	var parts = url.parse(req.originalUrl, true);
	delete parts.search;
	var pid = parts.query['pid'];
	var db=req.db;
	var collection = db.get("projects");

	if (typeof(pid) != undefined) {
		collection.findOne({"pid":parseInt(pid)}, function(err, project) {
			if (err) {
				res.render('project', {title:'Error'});
			} else if (!project){
				res.render('project', {title:"No such project"});
			} else {
				res.render('project', {
					title:project.proj_title, 
					projtitle:project.proj_title,
					projdesc:project.proj_details,
					projdeadline:project.deadline,
					projgoal:project.goal,
					projcurfunds:project.currentFunds
				});
			}
		});
	} else {
		res.render('project');
	}

}
router.get('/project',loadProject);

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
		if (err) {
			console.err(err);
		} else if (!result){
			pid = 0
			counters.insert({"name":"projects","counter":1});
			res.redirect("createproject");
		} else {
			pid = result.counter+1;
			console.log("pid="+pid)
			
			counters.update({name:"projects"}, {$inc:{counter:1}}, function(err,result) {
				if (err) console.err(err);
			});

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

});

router.get('/logout', function(req, res) {
	req.session.user = null;
	/*
	res.render('home', { title: 'PunchBeginner',
						 currentUser: "Not logged in.",
						 scripts: ["javascripts/home.js"] }, );
	*/
	res.location('home');
	res.redirect('home');
});

module.exports = router;
