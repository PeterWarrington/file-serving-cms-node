const mysqlQueryer = require(process.cwd() + "/src/api/mysqlQueryer.js");

function round_to_precision(x, precision) {
    var y = +x + (precision === undefined ? 0.5 : precision/2);
    return y - (y % (precision === undefined ? 1 : +precision));
} // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round#Demonstrative_Implementation

exports.getRoundedRating = (objectId, callback) => {
    mysqlQueryer.generateDbConnection("read", "public", (con) => {
        sqlQuery = "\
        SELECT AVG(`review-rating`) 'avg-rating' FROM `project-q`.reviews \
        WHERE `object-hash-id` = " + con.escape(objectId);
        con.query(sqlQuery, function (err, result) {
            if (err) throw err;
            if (result != null && result.length != 0) {
                var result = result[0]['avg-rating'];

                if (result != null && result != undefined) {
                    roundedRating = round_to_precision(result, 0.5);
                    callback(roundedRating);
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

            console.log(sqlQuery);

            con.query(sqlQuery, function (err, result) {
                if (err) throw err;
                if (result != null && result.length != 0) {
                    let resultsObjectArray = [];
                    result.forEach(row => {
                        resultsObjectArray.push({
                            "id": row["object-hash-id"],
                            "roundedRating": round_to_precision(row["avg-rating"], 0.5)
                        });
                    });

                    if (result != null && result != undefined) {
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