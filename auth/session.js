const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const sqli = require('mssql/msnodesqlv8')

const config = require('../config/dbconfig')

/* SECRET */
var server_secret = 'this is extremely secret!';

passport.use(new LocalStrategy(
  async function(username, password, done) {
    console.log(username)
    return sql(`SELECT user_id, username FROM users WHERE username='${username}' AND password='${password}'`).then(result => {
      if (result !== null)
        return done(null, result[0]);
      else
        return done(null, false);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

module.exports = {
  passport: passport,
  check: expressJwt({secret: server_secret,  algorithms: ['RS256'] }),
  generateToken(user) {
    return jwt.sign({
      user: user,
    }, server_secret,
    {
      expiresIn: 120 * 60
    });
  }
}

async function sql (query, params) {
	
	params = params || {}; // default to empty JSON if undefined
    let conx = await sqli.connect(config)

	var req = conx.request();

	// loop through params JSON and add them as input
	Object.keys(params).forEach(key => {
		req.input(key, params[key]);
	})
		
	return req.query(query).then(result => {
		return result.recordset;
	}).catch(err => {
		console.log(err);
		return null;
	});
}