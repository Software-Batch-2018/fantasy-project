const dbOperation = require('../controller/teamController')
var express = require('express')
const router = express.Router()


router.get('/teams', (req, res)=>{
    dbOperation.getTeam().then(result=>{
        res.json(result)
    })
})

router.get('/Players/:country1/:country2', (req, res)=>{
    countryName1 = req.params.country1
    countryName2 = req.params.country2

    dbOperation.getMatchPlayers(countryName1, countryName2).then(result=>{
        res.json(result)
    })
})

router.get('/Players/:country', (req, res)=>{
    countryName = req.params.country
    dbOperation.getTeamPlayers(countryName).then(result=>{
        res.json(result)
    })
})

router.get('/matches/:date', (req, res)=>{
    date = req.params.date
    dbOperation.getMatches(date).then(result=>{
        res.json(result)
    })
})


module.exports = router