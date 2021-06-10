const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const sql = require('mssql/msnodesqlv8')
const config = require('../config/dbconfig')


module.exports = function(passport) {
    const authenticateUser = async (name, password, done) => {
        let request = await sql.connect(config)
        let rows = await request.query(`SELECT * FROM users WHERE username ='${name}'`) 
        const user = rows.recordset[0]
        if(!rows.recordset.length) {
            return done(null, false, { message : 'That user is not registered'});
        }
        const isMatch = await bcrypt.compare(password, rows.recordset[0].password);
        if(isMatch) {
            return done(null, user);
        }
        return done(null, false, { message : 'Password incorrect'});
    };
    
    passport.use(
        new LocalStrategy({ usernameField: 'name' }, authenticateUser )
    );

    passport.serializeUser((user, done) => {
        done(null, user.user_id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            let request = await sql.connect(config)
            let rows = await request.query(`SELECT * FROM users WHERE user_id ='${id}'`) 
            const user = rows.recordset[0]
            if(!user.matches){
                user.matches = new Map()
            }
            return done(null, user);
        } catch(err) {
            return done(err);
        }
    });
};