const mysql = require("mysql2");
const config = require(process.cwd() + "/config.js").config;

exports.generateDbConnection = (readOrWrite, type, callback) => {
    var con = mysql.createConnection({
        host: config.databaseServer,
        user: readOrWrite + "_" + type,
        password: config.databasePass + readOrWrite + "_" + type,
        database: "project-q",
        charset : 'utf8mb4'
    });

    if (callback != null) {
        callback(con); // Callbacks are deprecated. Returning it is so much easier.
    } else {
        return con;
    }
}