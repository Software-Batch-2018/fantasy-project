const express = require('express');
const router = express.Router();
const fetch = require('node-fetch')
var user_data

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

router.get('/fantasy/:team1/:team2', (req, res)=>{
    fetch('http://localhost:4000/api/Players/Spain/Portugal')
    .then(res => res.json())
    .then(players => {
        res.render('components/fantasy', {players: players})
    }); 
})

router.get('/team', (req, res)=>{
    res.render('components/team', {GK:filterbyPosition(user_data, 'GK'),DF:filterbyPosition(user_data, 'DF'), MF: filterbyPosition(user_data, 'MF'), FW:filterbyPosition(user_data, 'FW')})
})

router.get('/fixtures', (req, res)=>{
    fetch('http://localhost:4000/api/matches/2021-06-23')
    .then(res => res.json())
    .then(matches => {
        console.log(matches)
        res.render('components/fixtures', {matches: matches})
    }); 
    
})

router.post('/fantasy', (req, res)=>{
    user_data = req.body['theTeam']
    res.redirect('/team')
})

function filterbyPosition(players, position){
    var result = players.filter( element => element.Player_position ==position)
    return result
}

module.exports = router;