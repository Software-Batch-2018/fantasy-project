var config = {
  server: "fantasypu.database.windows.net", // Use your SQL server name
  database: "fantasy", // Database to connect to
  user: "kusaljr", // Use your username
  password: "Kusal12345", // Use your password
  port: 1433,
  // Since we're on Windows Azure, we need to set the following options
  options: {
        encrypt: true
    }
 };

module.exports = config