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


async function  getMatchPlayers(countryName1, countryName2){
    try{
        let pool = await sql.connect(config)

        let teamId  = await pool.request().query(`SELECT a.teamId from Country as a where a.teamName = '${countryName1}'  or  a.teamName ='${countryName2}'`)
        let teams = await pool.request().query(`SELECT Player_name, Player_position, teamName, Player_image, Player_price FROM players_db as p inner join Country as c on p.Country_id = c.teamId  where p.Country_id=${teamId.recordset[0].teamId} or p.Country_id=${teamId.recordset[1].teamId}`)
        return teams.recordset
    }catch(err){
        console.log(err)
    }
}

async function  getMatches(date){
    try{
        let pool = await sql.connect(config)
        let teams = await pool.request().query(`SELECT Match_id,c.teamName as team1, c2.teamName as team2, Time FROM Matches as m 
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


module.exports = {
    getTeam : getTeam,
    getTeamPlayers: getTeamPlayers,
    getMatches: getMatches,
    getMatchPlayers: getMatchPlayers,
    getRanks: getRanks

}