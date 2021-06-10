const express = require('express');
const router = express.Router();
const fetch = require('node-fetch')
const config = require('../config/dbconfig')
const sql = require('mssql/msnodesqlv8')

// Middleware
const { auth, notAuth } = require('../middleware/auth');


//main page
router.get('/', auth, (req, res) => {
    console.log(req.user.matches)
    res.render('index', {
        name : req.user.username,
        id : req.user.user_id
    });
});



//rank page
router.get('/rank', auth, (req, res)=>{
    fetch('http://localhost:4000/api/rank')
    .then(res => res.json())
    .then(rank => {
        res.render('components/rank', {rank: rank})
    }); 
})



router.post('/fantasy/:match_id', auth,async (req, res)=>{
    var user_data = req.body['theTeam']
    let pool = await sql.connect(config)
    req.user.matches[req.params.match_id] = req.params.match_id
    let insert_data = await pool.request().query(`Insert into Fantasy_team values (${ req.user.user_id}, ${req.params.match_id}, ${user_data[0].Player_id},${user_data[1].Player_id},${user_data[2].Player_id},${user_data[3].Player_id},${user_data[4].Player_id})`)
    res.redirect(`/api/fantasyTeam/${req.params.match_id}`)
})


module.exports = router;