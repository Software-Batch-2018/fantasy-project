var LocalStrategy   = require('passport-local').Strategy;
// load up the user model
var bcrypt = require('bcrypt-nodejs');
var config = require('../config/dbconfig');
var sql       = require('mssql/msnodesqlv8');



// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    // used to deserialize the user
    passport.deserializeUser(async function(username, done) {
        let request = await sql.connect(config)
        request.query("select * from users where username ="+username, function(err,rows){
            done(err, rows[0]);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-signup',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        async function(req, username, password, done) {
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            let request = await sql.connect(config)

            await request.query("SELECT * FROM users WHERE username ='"+username+"'", function(err, rows) {
                if (err)
                    return done(err);
                if (rows.recordset.length) {
                    return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                } else {
                    // if there is no user with that username
                    // create the user
                    var newUserMysql = {
                        username: username,
                        password: bcrypt.hashSync(password, null, null)  // use the generateHash function in our user model
                    };
                    request
                    .query(`INSERT INTO users (username, password) values ('${newUserMysql.username}', '${newUserMysql.password}'); SELECT SCOPE_IDENTITY() AS user_id;`, function(err, rows) {
                      newUserMysql.id = rows.recordset[0].user_id;
                      return done(null, newUserMysql);
                    });
                }
            });
        })
    );

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-login',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        async function(req, username, password, done) { // callback with email and password from our form
            let request = await sql.connect(config)
            await request.query(`SELECT * FROM users WHERE username ='${username}'`, function(err, rows){
                if (err)
                    return done(err);
                if (!rows.recordset.length) {
                    return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                }
                bcrypt.compare(password, rows.recordset[0].password, function(err, res) {
                    if( res == null ){
                      return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
                    }
                    else
                    {
                      var user = {
                        username: rows.recordset[0].username,
                        id: rows.recordset[0].user_id
                    };
                      return done(null, user);
                    }
                });
/*              // if the user is found but the password is wrong
                if (!bcrypt.compareSync(password, rows[0].password))
                {
                  console.log("+++++++++++++++++++++++++++++++++++++++++++++");
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
                }*/

                // all is well, return successful user
                
            });
        })
    );
};