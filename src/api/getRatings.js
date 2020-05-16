const mysqlQueryer = require(process.cwd() + "/src/api/mysqlQueryer.js");

exports.round_to_precision = (x, precision)  => {
    var y = +x + (precision === undefined ? 0.5 : precision/2);
    return y - (y % (precision === undefined ? 1 : +precision));
} // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round#Demonstrative_Implementation

exports.getRating = (objectId, callback) => {
    mysqlQueryer.generateDbConnection("read", "public", (con) => {
        sqlQuery = "\
        SELECT AVG(`review-rating`) 'avg-rating' FROM `project-q`.reviews \
        WHERE `object-hash-id` = " + con.escape(objectId);
        con.query(sqlQuery, function (err, result) {
            if (err) throw err;
            if (result != null && result.length != 0) {
                if (result != null && typeof result != 'undefined') {
                    callback(result[0]['avg-rating']);
                } else {
                    callback(0);
                }
            } else {
                callback(0);
            }
        });
    });
};

exports.getRoundedRatingsFromObjectArray = (objectArray, callback) => {
    if (objectArray.length != 0) {
        objectIdArray = objectArray.map(function(item) { return item["id"]; });

        mysqlQueryer.generateDbConnection("read", "public", (con) => {
            sqlQuery = "\
            SELECT AVG(`review-rating`) 'avg-rating', `object-hash-id` FROM `project-q`.reviews \
            WHERE `object-hash-id` IN (" + con.escape(objectIdArray) + ") GROUP BY `object-hash-id`";

            con.query(sqlQuery, function (err, result) {
                if (err) throw err;
                if (result != null && result.length != 0) {
                    let resultsObjectArray = [];
                    result.forEach(row => {
                        resultsObjectArray.push({
                            "id": row["object-hash-id"],
                            "roundedRating": exports.round_to_precision(row["avg-rating"], 0.5)
                        });
                    });

                    if (result != null && typeof result != 'undefined') {
                        callback(resultsObjectArray);
                    }
                } else {
                    callback([{}]); // This weird return value is blank and should be able to merge without error
                }
            });
        });
    } else {
        callback([{}]);
    }
};
exports.getReviews = (options, callback) => {
    mysqlQueryer.generateDbConnection("read", "public", (con) => {
        sqlAdditionalWhereClauses = "";

        // Add SQL clause to check reviews are before the date of first access
        if (typeof options.beforeDatetime != 'undefined') {
            mysqlDatetime = 
            sqlAdditionalWhereClauses += " AND `review-date` < '" + 
            options.beforeDatetime.toISOString().slice(0, 19).replace('T', ' ') // Converts to mysql datetime https://stackoverflow.com/a/44831930/5270231
            + "'"; 
        }

        if (typeof options.alreadyDoneReviewIds != 'undefined') {
            var ids = "'" + options.alreadyDoneReviewIds.join("','") + "'"; // Converts to mysql array format https://stackoverflow.com/questions/43166013/javascript-array-to-mysql-in-list-of-values#comment73406326_43166013
            sqlAdditionalWhereClauses += " AND `review-id` NOT IN (" + ids + ")";
        }
        sqlQuery = "\
        SELECT * FROM `project-q`.reviews \
        WHERE `object-hash-id` = " + con.escape(options.objectId) + sqlAdditionalWhereClauses + "\
        ORDER BY `review-id` DESC LIMIT 5;";

        con.query(sqlQuery, function (err, result) {
            if (err) throw err;
            if (result != null && result.length != 0) {
                if (result != null && typeof result != 'undefined') {
                    callback(result);
                } else {
                    callback([]);
                }
            } else {
                callback([]);
            }
        });
    });
};
