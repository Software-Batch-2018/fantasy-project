const dbOperation = require('../controller/teamController')
var express = require('express')
const router = express.Router()
const config = require('../config/dbconfig')
const sql = require('mssql')
const { auth, notAuth } = require('../middleware/auth');

router.get('/teams',(req, res)=>{
    dbOperation.getTeam().then(result=>{
        res.json(result)
    })
})

router.get('/Players/:matchid', auth, async(req, res)=>{
    matchId = req.params.matchid
    let pool = await sql.connect(config)
    let getData = await pool.request().query(`select * from Fantasy_Team where user_id=${req.user.user_id} and match_id=${matchId} `)
    if(getData.recordset.length >=1){
        res.redirect(`/api/fantasyTeam/${matchId}`)
    }else{  
        dbOperation.getMatchPlayers(matchId).then(result=>{
            res.render('components/fantasy', {players: result})
        })
    }
})

// get users team
router.get('/fantasyTeam/:match_id', auth, (req, res)=>{
    matchId = req.params.match_id
    user_id = req.user.user_id

    dbOperation.getFantasyTeamData(matchId, user_id).then(data=>{
        var sum = 0
        data.forEach(element => {
            
            sum +=element.points
            
        });
        res.render('components/team',{GK:filterbyPosition(data, 'GK'),DF:filterbyPosition(data, 'DF'), MF: filterbyPosition(data, 'MF'), FW:filterbyPosition(data, 'FW'), total: sum})
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

router.get('/matches', (req, res)=>{
    // `date` is a `Date` object
    const formatYmd = date => date.toISOString('en-GB', { timeZone: 'Asia/Kathmandu' }).slice(0, 10);
    var today = formatYmd(new Date());
    console.log(today)
    
    //time
    var date = new Date();
    var time = (date.toLocaleString('en-GB', { timeZone: 'Asia/Kathmandu' }));
    time = (time.slice(12,-6))
   
    dbOperation.getMatches(today).then(result=>{
        res.render('components/fixtures', {matches: getActualMatches(time, result)})
    })
})

router.get('/rank',(req, res)=>{
    dbOperation.getRanks().then(result=>{
        res.json(result)
    })
})


function getActualMatches(time, result){
    var list = []
    result.forEach(element => {
        var matchTime = element.Time
        matchTime = matchTime.slice(0, -3)

        if(parseInt(matchTime)==0 || time <= matchTime ){
            list.push(element)
        }
    });
    return list

}

module.exports = router