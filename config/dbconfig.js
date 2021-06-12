
var config = {
  server: "fantasypu.database.windows.net", // Use your SQL server name
  database: "fantasy", // Database to connect to
  user: "kusaljr", // Use your username
  password: "Kusal12345", // Use your password
  port: 1433,
  options: {
        encrypt: true
    }
 };

 /*

 var config = {
  server: 'localhost',
  driver: 'msnodesqlv8',
  database: 'fantasy',

  options: {
    trustedConnection: true
  }
};
*/
module.exports = config