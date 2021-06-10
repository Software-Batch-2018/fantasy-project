const express = require('express');
const router = express.Router();
const fetch = require('node-fetch')
const config = require('../config/dbconfig')
const sql = require('mssql/msnodesqlv8')

// Middleware
const { auth, notAuth } = require('../middleware/auth');


//main page
router.get('/', auth, (req, res) => {
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

router.get('/userFantasy', auth,async (req, res)=>{
    let pool = await sql.connect(config)
    let getData = await pool.request().query(`SELECT m.Match_id,c.teamName as team1, c2.teamName as team2, Time, c.Flag as flag1, c2.Flag as flag2
    FROM Fantasy_Team as ft 
    inner join Matches as m 
     on ft.match_id = m.Match_id
     inner join Country as c
     on m.Team1_id = c.teamId 
     inner join Country as c2 
     on m.Team2_id = c2.teamId  
    where user_id = ${req.user.user_id}`)
    res.render('components/userfantasy', {matches: getData.recordset})
})

router.post('/fantasy/:match_id', auth,async (req, res)=>{
    var user_data = req.body['theTeam']
    let pool = await sql.connect(config)
    let insert_data = await pool.request().query(`Insert into Fantasy_team values (${ req.user.user_id}, ${req.params.match_id}, ${user_data[0].Player_id},${user_data[1].Player_id},${user_data[2].Player_id},${user_data[3].Player_id},${user_data[4].Player_id})`)
    res.redirect(`/api/fantasyTeam/${req.params.match_id}`)
})


module.exports = router;