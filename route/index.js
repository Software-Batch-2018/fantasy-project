const express = require('express');
const router = express.Router();
const fetch = require('node-fetch')


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

router.get('/fantasy', auth, (req, res)=>{
    fetch('http://localhost:4000/api/Players/Spain/Portugal')
    .then(res => res.json())
    .then(players => {
        res.render('components/fantasy', {players: players})
    }); 
})



module.exports = router;