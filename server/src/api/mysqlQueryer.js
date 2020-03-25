const mysql = require("mysql");
const config = require(process.cwd() + "/config.js").config;

function generateConnectionForReading(type, callback) {
    var con = mysql.createConnection({
        host: config.databaseServer,
        user: "read_" + type,
        password: config.databasePass + "read_" + type,
        database: "project-q"
    });
    callback(con);
}

exports.getPopularPosts = async (limit, callback) => {
    generateConnectionForReading("public", (con) => {
        sqlQuery = "\
        SELECT `object-post-date`, `object-title`, `object-description`, `object-creator-user`, `object-file-extension`, `object-tags` \
        FROM (SELECT * FROM `project-q`.view_count LIMIT 500) AS InnerTable \
        INNER JOIN objects ON objects.`object-hash-id`=`view-object-hash-id` \
        GROUP BY `view-object-hash-id` ORDER BY COUNT(`view-object-hash-id`) DESC LIMIT 5 \
        "; // I don't even understand how this query works, but it *should* get the most reguarly accessed posts out of the previous 500 accesses
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