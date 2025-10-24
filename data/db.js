// Import the mysql2 library to interact with MySQL databases
const mysql = require("mysql2");

// Import configuration (likely contains DB credentials) from a separate config file
const config = require("../config");

// Create a connection to the MySQL database using the settings in config.db
let connection = mysql.createConnection(config.db);

// Attempt to connect to the database
connection.connect(function (err) {
  if (err) {
    // If there is an error during connection, log it with a message
    return console.log(err + "sql error");
  }

  // Execute a query to select all rows from the "blog" table
  connection.query("select * from blog", function (err, result) {
    if (err) {
      // If there is an error executing the query, return the error
      return err;
    }
  });

  // If connection is successful and query setup is done, log confirmation
  console.log("connection successfully");
});

// Export the connection as a Promise-based object for use in other modules
module.exports = connection.promise();
