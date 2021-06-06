const express = require('express');
const passport = require('passport');
const app = express()
var session = require('express-session');
const api = require('./route/api')
const index = require('./route/index')
const user = require('./route/user')
const flash = require('express-flash');
const methodOverride = require('method-override');
const cors = require('cors')

//port
const PORT = 4000

//db
require('./config/dbconfig');



//view engine
app.set('view engine', 'ejs');

// express function
app.use(express.urlencoded( { extended : false }));
app.use(express.json());
app.use(express.static(__dirname + '/public'));
app.use(cors())

//session config
app.use(session({
    secret : 'kusaljr',
    resave : false,
    saveUninitialized : false
}));


//passport config
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(methodOverride('_method'));



//api route
app.use('/api', api)

//index route
app.use('/', index)

//user route
app.use('/users', user)



//server config
app.listen(PORT, ()=>{
    console.log(`Listening in Port ${PORT}`)
})