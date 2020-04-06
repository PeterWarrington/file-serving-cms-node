const mysql = require("mysql");
const config = require(process.cwd() + "/config.js").config;

exports.generateDbConnection = (readOrWrite, type, callback) => {
    var con = mysql.createConnection({
        host: config.databaseServer,
        user: readOrWrite + "_" + type,
        password: config.databasePass + readOrWrite + "_" + type,
        database: "project-q"
    });
    callback(con);
}