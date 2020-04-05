const mysql = require("mysql");
const config = require(process.cwd() + "/config.js").config;

function generateDbConnection(readOrWrite, type, callback) {
    var con = mysql.createConnection({
        host: config.databaseServer,
        user: readOrWrite + "_" + type,
        password: config.databasePass + readOrWrite + "_" + type,
        database: "project-q"
    });
    callback(con);
}

exports.getPopularPosts = async (limit, callback) => {
    generateDbConnection("read", "public", (con) => {
        sqlQuery = "\
        SELECT `object-hash-id`, `object-post-date`, `object-title`, `object-description`, `object-creator-user`, `object-file-extension`, `object-tags` \
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

exports.getObjectDetails = (objectId, callback) => {
    generateDbConnection("read", "public", (con) => {
        sqlQuery = "\
        SELECT * FROM `project-q`.objects \
        WHERE `object-hash-id` = " + con.escape(objectId);
        con.query(sqlQuery, function (err, result) {
            if (err) throw err;
            if (result != null) {
                callback(result[0]);
            } else {
                throw new Error("Could not get post detail from db. Result is null.");
            }
        });
    });
};

exports.getFileBuffer = (objectId, callback) => {
    generateDbConnection("read", "public", (con) => {
        sqlQuery = "\
        SELECT * FROM `project-q`.`object-blobs` \
        WHERE `object-hash-id` = " + con.escape(objectId); // Query to get blob
        con.query(sqlQuery, function (err, result) {
            if (err) throw err;
            if (result != null) {
                callback(result[0]);
            } else {
                throw new Error("Could not get post detail from db. Result is null.");
            }
        });
    });

    generateDbConnection("write", "public", (con) => { // Increment download count
        sqlQuery = "\
        UPDATE `project-q`.`objects` \
        SET `object-download-count` = `object-download-count` + 1 \
        WHERE `object-hash-id` = " + con.escape(objectId); 
        con.query(sqlQuery, function (err, result) {});
    });
}