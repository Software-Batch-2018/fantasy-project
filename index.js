const express = require('express');
const passport = require('passport');
const app = express()
var session = require('express-session');
const api = require('./route/api')
var cookieParser  = require('cookie-parser');
var bodyParser    = require('body-parser');
var flash         = require('connect-flash');
const PORT = 4000

app.use(express.json());
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

app.set('view engine', 'jade'); // set up jade for templating
app.use(passport.initialize());

require('./auth/session')(passport)
// required for passport
app.use(session({
	secret: 'vidyapathaisalwaysrunning',
	resave: true,
	saveUninitialized: true
 } )); 
app.use(flash());
// session secret
app.use('/api', api)

app.get('/', function(req, res) {
    res.render('index.jade');
});
app.listen(PORT, ()=>{
    console.log(`Listening in Port ${PORT}`)
})