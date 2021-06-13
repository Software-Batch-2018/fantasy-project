const express = require('express')
const app = express.Router()
const config = require('../config/dbconfig')
const sql = require('mssql')
const fetch = require('node-fetch');

// player fetching from api first

app.get('/',async(req, res)=>{
    var api = req.query.api
    fetch(api)
    .then(res => res.json())
    .then(async function filter (json){
        var final_map = new Map()
        var actual_data = json['keyEvents'].all
        var match_id = req.query.id
        var goals = new Map()
        var assists = new Map()
        var cs = new Map()

        var count = 0

        var list = []
        var players = []
        var goalonly = (actual_data).filter(function (entry) {
        if(entry.type === 'goal' || entry.type === 'penalty_goal' || entry.type === 'own_goal'){
            var text = entry.scoreText
            var final = text.split(/[\s-]+/)
                list.push({
                    score: {
                        home: final[0],
                        away: final[1]
                    }
                })
            var goalscorer = entry.mainText
            if(!final_map[goalscorer]){
                final_map[goalscorer] = goalscorer
                    players.push(goalscorer)
                }
                if(entry.type ==='own_goal'){
                    goals[goalscorer] = -1
                }else{
                    if(goals[goalscorer]){
                        goals[goalscorer] +=1
                    }else{
                        goals[goalscorer] = 1
                    }
                var assister = entry.additionalText
                if(entry.additionalText === 'Goal' || entry.additionalText === 'Penalty Goal' ){

                }else{
                if(!final_map[assister]){
                    final_map[assister] = assister
                    players.push(assister)
                }
                if(assists[assister]){
                    asissts[assister] +=1
                }else{
                    assists[assister] = 1
                }    
            }
        }
        }
        count++
    });
    cs['away'] = -list[0].score.home
    cs['home'] = -list[0].score.away
    var players_map = await getPlayersMap(match_id,goals, assists, cs, players)

    res.send(players_map)

    })
        
});











//get players by match id
async function getPlayersMap(match_id,goals, assists, cs, player_arr){
    let pool = await sql.connect(config)
    var check = new Map()
    let teams = await pool.request().query(`select Player_id, Player_name, Short_name
    from Matches as m
    inner join players_db as pd
    on m.Team1_id = pd.Country_id
    or m.Team2_id = pd.Country_id
    
    inner join Country as c
    on pd.Country_id = c.teamId
    
    where Match_id = ${match_id}`)

    var players = teams.recordset
    var lname = new Map()
    var fname = new Map()
    players.forEach(element => {
        var shortname =element.Short_name
        var fullname = element.Player_name
        lname[shortname] = element.Player_id
        fname[fullname] = element.Player_id
    });

    var string = ""
    player_arr.forEach(element => {
        if(lname.hasOwnProperty(element))
        {
            string += generateString(lname,goals, assists, cs, element,match_id)
        }
        else if(fname.hasOwnProperty(element)){
            string += generateString(fname,goals, assists, cs, element,match_id)
        }
          
    });
    const editedText = string.slice(0, -1)

    let player_point = await pool.request().query(`INSERT INTO Match_Points (match_id, player_id, goals, assists) values ${editedText}`)

    let match_status = await pool.request().query(`Update table Matches set status = 'Yes' where match_id = ${match_id}`)

    return 'OK'
}

function generateString(map,goals, assists, cs, element,match_id){
    var g = goals[element]!=undefined ? goals[element] : 0
    var a = assists[element]!=undefined ? assists[element] : 0

    var insert_string = ""
    insert_string += `(${match_id}, ${map[element]}, ${g}, ${a}),`
    return insert_string


}

module.exports = app