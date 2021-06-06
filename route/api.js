const dbOperation = require('../controller/teamController')
var express = require('express')
const router = express.Router()
const session = require('../auth/session')
const passport = require('passport')


router.get('/teams', (req, res)=>{
    dbOperation.getTeam().then(result=>{
        res.json(result)
    })
})


router.get('/Players/:country', (req, res)=>{
    countryName = req.params.country
    dbOperation.getTeamPlayers(countryName).then(result=>{
        res.json(result)
    })
})

router.get('/matches/:date', (req, res)=>{
    date = req.params.date
    dbOperation.getMatches(date).then(result=>{
        res.json(result)
    })
})
router.get('/signup', function(req, res) {
    // render the page and pass in any flash data if it exists
    res.render('signup.jade', { message: req.flash('signupMessage') });
});

// process the signup form
router.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/api/profile', // redirect to the secure profile section
    failureRedirect : '/api/signup', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));

// =====================================
// PROFILE SECTION =========================
// =====================================
// we will want this protected so you have to be logged in to visit
// we will use route middleware to verify this (the isLoggedIn function)

router.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile.jade', {
        user : req.session.passport.user.username,
        id: req.session.passport.user.id,
        // get the user out of session and pass to template
    });
});


router.get('/login', function(req, res) {
    // render the page and pass in any flash data if it exists
    res.render('login.jade', { message: req.flash('loginMessage') });
});


// process the login form
router.post('/login', passport.authenticate('local-login', {
    successRedirect : '/api/profile', // redirect to the secure profile section
    failureRedirect : '/api/login', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}),

function(req, res) {
    if (req.body.remember) {
      req.session.cookie.maxAge = 1000 * 60 * 3;
    } else {
      req.session.cookie.expires = false;
    }
res.redirect('/');
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

function isLoggedIn(req, res, next) {
	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
        console.log(req)
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}

module.exports = router