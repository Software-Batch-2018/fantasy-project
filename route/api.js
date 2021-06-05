var Team = require('../models/Team')
const dbOperation = require('../controller/teamController')
var express = require('express')
const router = express.Router()


router.get('/teams', (req, res)=>{
    dbOperation.getTeam().then(result=>{
        res.json(result)
    })
})

router.get('/Players/:country', (req, res)=>{
    countryName = req.params.country
    dbOperation.getTeamPlayers(countryName).then(result=>{
        res.json(result)
    })
})

module.exports = router