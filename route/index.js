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
router.get('/rank', auth, async(req, res)=>{
    let pool = await sql.connect(config)
    let getData = await pool.request().query(`select u.username,
    (CASE WHEN sum(points) IS NULL THEN 0 ELSE sum(points) END)
     as points
    from Fantasy_Team  as ft
    left join players_db as pd
    on ft.playerId_1 = pd.Player_id or 
    ft.playerId_2 = pd.Player_id or 
    ft.playerId_3 = pd.Player_id or 
    ft.playerId_4 = pd.Player_id or 
    ft.playerId_5 = pd.Player_id 
    left join Country as c
    on pd.Country_id = c.teamId
    left join Match_Points as mp
    on
    pd.Player_id = mp.player_id
    left join users as u
    on u.user_id = ft.user_id
    group by (username) 
    order by points desc 
    `)
    res.render('components/rank', {rank:getData.recordset})
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
    let insert_data = await pool.request().query(`Insert into Fantasy_team (user_id, match_id, playerId_1,playerId_2,playerId_3,playerId_4,playerId_5) values (${ req.user.user_id}, ${req.params.match_id}, ${user_data[0].Player_id},${user_data[1].Player_id},${user_data[2].Player_id},${user_data[3].Player_id},${user_data[4].Player_id})`)
    res.redirect(`/api/fantasyTeam/${req.params.match_id}`)
})


module.exports = router;