const express = require('express');
const router = express.Router();
const passport = require('passport');
const config = require('../config/dbconfig')
const bcrypt = require('bcryptjs')
// Middleware
const { auth, notAuth } = require('../middleware/auth');
const sql = require('mssql')

const initializePassport = require('../middleware/passport-config');
initializePassport (passport);

router.get('/login', notAuth, (req, res) => {
    res.render('auth/login');
});

router.get('/register', notAuth,  (req,res) => {
    res.render('auth/register');
});



router.post('/register', notAuth, async (req,res) => {
    let username = req.body.name 
    let password = await bcrypt.hash(req.body.password, 8)
    try {
        let request = await sql.connect(config)
        await request.query("SELECT * FROM users WHERE username ='"+username+"'", async function(err, rows) {
            if (err)
                console.log(err);
            if (rows.recordset.length) {
                res.redirect('/users/login');
            } else {
                // if there is no user with that username create the user
                var user = {
                    user: username,
                    password: password  
                };
                request
                .query(`INSERT INTO users (username, password) values ('${user.user}', '${user.password}'); SELECT SCOPE_IDENTITY() AS user_id;`, function(err, rows) {
                  res.redirect('/users/login');
                });
            }
        });
    }catch (e) {
        console.log(e)
        res.redirect('/users/register');
    }
});

router.post('/login', notAuth, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
}));

router.delete('/logout', (req, res) => {
    req.logOut();
    res.redirect('/users/login');
});

module.exports = router;