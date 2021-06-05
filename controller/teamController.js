const config = require('../config/dbconfig')
const sql = require('mssql/msnodesqlv8')
const { json } = require('body-parser')

async function  getTeam(){
    try{
        let pool = await sql.connect(config)
        let teams = await pool.request().query("SELECT Player_name, position, teamName FROM Players as p inner join Country as c on p.team_id = c.teamId  where p.team_id=1")
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
        let teams = await pool.request().query(`SELECT Player_name, position, teamName FROM Players as p inner join Country as c on p.team_id = c.teamId  where p.team_id=${id}`)
        return teams.recordset
    }catch(err){
        console.log(err)
    }
}

module.exports = {
    getTeam : getTeam,
    getTeamPlayers: getTeamPlayers
}