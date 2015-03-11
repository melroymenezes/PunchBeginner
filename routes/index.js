var express = require('express');
var router = express.Router();



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Community Fund' });
});

router.get('/home', function(req, res, next) {
	res.render('home', { title: 'PunchBeginner' });
});

router.get('/signup', function(req, res, next) {
	res.render('signup', { title: 'Sign Up' });
});

router.get('/login', function(req, res, next) {
	res.render('login', { title: 'Login' });
});

router.get('/project', function(req, res, next) {
	res.render('project', { title: 'Project' });
});

router.get('/createproject', function(req, res, next) {
	res.render('createproject', { title: 'Create Project' });
});

router.get('/temp', function(req, res, next) {
	var db = req.db;
	var collection = db.get('usercollection');
	collection.find({}, {}, function(e, docs) {
		res.render('temp', 
			{ "temp" : docs 
		});
	});
	
});


/* POST to Add User Service */
router.post('/signup', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var userName = req.body.username;
    var email = req.body.email;

    // Set our collection
    var collection = db.get('usercollection');

    // Submit to the DB
    collection.insert({
        "username" : userName,
        "email" : email
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // If it worked, set the header so the address bar doesn't still say /adduser
            res.location("temp");
            // And forward to success page
            res.redirect("temp");
        }
    });
});


module.exports = router;
