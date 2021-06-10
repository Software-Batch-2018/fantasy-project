const config = require('../config/dbconfig')
const sql = require('mssql/msnodesqlv8')

async function  getTeam(){
    try{
        let pool = await sql.connect(config)
        let teams = await pool.request().query("SELECT * from Country")
        return teams.recordset
    }catch(err){
        console.log(err)
    }
}

async function  getTeamPlayers(countryName){
    try{
        let pool = await sql.connect(config)
        let team_Id = await pool.request().query(`SELECT teamId from Country where teamName = '${countryName}'`)
        var id = team_Id.recordset
        id = id[0].teamId
        let teams = await pool.request().query(`SELECT Player_name, Player_position, teamName, Player_image, Player_price FROM players_db as p inner join Country as c on p.Country_id = c.teamId  where p.Country_id=${id}`)
        return teams.recordset
    }catch(err){
        console.log(err)
    }
}


async function  getMatchPlayers(match_id){
    try{
        let pool = await sql.connect(config)

        let teams = await pool.request().query(`select Player_id, Player_name, teamName, Player_price, Player_position, Player_image
        from Matches as m
        inner join players_db as pd
        on m.Team1_id = pd.Country_id
        or m.Team2_id = pd.Country_id
        
        inner join Country as c
        on pd.Country_id = c.teamId
        
        where Match_id = ${match_id}`)
        return teams.recordset
    }catch(err){
        console.log(err)
    }
}

async function  getMatches(date){
    try{
        let pool = await sql.connect(config)
        let teams = await pool.request().query(`SELECT Match_id,c.teamName as team1, c2.teamName as team2, Time, c.Flag as flag1, c2.Flag as flag2 FROM Matches as m 
        inner join Country as c 
        on m.Team1_id = c.teamId 
        inner join Country as c2 
        on m.Team2_id = c2.teamId  
        where m.Date='${date}'
        `)
        return teams.recordset
    }catch(err){
        console.log(err)
    }
}

async function  getRanks(){
    try{
        let pool = await sql.connect(config)
        let teams = await pool.request().query("select username, points from Points as p inner join users as u on p.user_id = u.user_id")
        return teams.recordset
    }catch(err){
        console.log(err)
    }
}


async function  getFantasyTeamData(matchid, userid){
    try{
        matchid = parseInt(matchid)
        let pool = await sql.connect(config)
        let fantasy_team = await pool.request().query(`select   Player_id,Player_name, Player_image, Player_position,Player_price, teamName from Fantasy_Team as ft
        inner join players_db as pd
        on ft.playerId_1 = pd.Player_id or 
        ft.playerId_2 = pd.Player_id or 
        ft.playerId_3 = pd.Player_id or 
        ft.playerId_4 = pd.Player_id or 
        ft.playerId_5 = pd.Player_id 
        inner join Country as c
        on pd.Country_id = c.teamId
        where user_id = ${userid} and ft.match_id = ${matchid}`)
        return fantasy_team.recordset
    }catch(err){
        console.log(err)
    }
}



module.exports = {
    getTeam : getTeam,
    getTeamPlayers: getTeamPlayers,
    getMatches: getMatches,
    getMatchPlayers: getMatchPlayers,
    getRanks: getRanks,
    getFantasyTeamData: getFantasyTeamData

}