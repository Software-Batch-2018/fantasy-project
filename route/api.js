const dbOperation = require('../controller/teamController')
var express = require('express')
const router = express.Router()

const { auth, notAuth } = require('../middleware/auth');

router.get('/teams',(req, res)=>{
    dbOperation.getTeam().then(result=>{
        res.json(result)
    })
})

router.get('/Players/:matchid', auth,(req, res)=>{
    matchId = req.params.matchid
    dbOperation.getMatchPlayers(matchId).then(result=>{
        res.render('components/fantasy', {players: result})
    })
})

// get users team
router.get('/fantasyTeam/:match_id', auth, (req, res)=>{
    matchId = req.params.match_id
    user_id = req.user.user_id

    dbOperation.getFantasyTeamData(matchId, user_id).then(data=>{
        res.render('components/team',{GK:filterbyPosition(data, 'GK'),DF:filterbyPosition(data, 'DF'), MF: filterbyPosition(data, 'MF'), FW:filterbyPosition(data, 'FW')})
    })
})

function filterbyPosition(players, position){
    var result = players.filter( element => element.Player_position ==position)
    return result
}
//end get users team

router.get('/Players/:country', auth,(req, res)=>{
    countryName = req.params.country
    dbOperation.getTeamPlayers(countryName).then(result=>{
        res.json(result)
    })
})

router.get('/matches/:date',auth, (req, res)=>{
    date = req.params.date
    dbOperation.getMatches(date).then(result=>{
        res.render('components/fixtures', {matches: result})
    })
})

router.get('/rank',(req, res)=>{
    dbOperation.getRanks().then(result=>{
        res.json(result)
    })
})


module.exports = router