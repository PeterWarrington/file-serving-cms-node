const mysql = require("mysql");
const config = require(process.cwd() + "/config.js").config;

function generateConnectionForReading(table, callback) {
    var con = mysql.createConnection({
        host: config.databaseServer,
        user: "read_" + table,
        password: config.databasePass + "read_" + table
    });
    callback(con);
}

exports.getPopularPosts = async (limit, callback) => {
    generateConnectionForReading("objects", (con) => {
        sqlQuery = "SELECT `object-post-date`, `object-title`, `object-description`, `object-creator-user`, `object-file-extension`, `object-tags` FROM `project-q`.objects ORDER BY `object-access-count` DESC LIMIT " + limit.toString() + ";";
        console.log(sqlQuery);
        con.query(sqlQuery, function (err, result) {
            if (err) throw err;
            if (result != null) {
                callback(result);
            } else {
                throw new Error("Could not get popular posts from db");
            }
        });
    });
};