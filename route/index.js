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


module.exports = router;