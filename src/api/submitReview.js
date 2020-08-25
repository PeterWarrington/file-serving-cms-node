const utils = require(process.cwd() + "/src/api/utils.js");
const mysqlQueryer = require(process.cwd() + "/src/api/mysqlQueryer.js");

exports.main = (req, res) => {
    if (req.variables.user.signedIn) {
        // Variables we are gonna use
        reviewRating = req.body.reviewRating;
        reviewText = req.body.reviewText;
        reviewObjectId = req.body.reviewObjectId;
        reviewUser = req.variables.user.name;

        utils.ifObjectExists(reviewObjectId, () => {
            // Object does not exist
            utils.sendNonHtmlOtherError(req, res, 400, "OBJECT_DOES_NOT_EXIST");
            return;
        }, () => {
            // Object does exist
            // Check rating is in possible range
            if (reviewRating > 5 || reviewRating < 0) {
                utils.sendNonHtmlOtherError(req, res, 500, "REVIEW_RATING_OUT_OF_RANGE");
                return;
            }

            // Get current date
            currentDate = new Date();
            currentMysqlDatetime = currentDate.toISOString().slice(0, 19).replace('T', ' '); // To mysql datetime

            // Attempt write to DB
            mysqlQueryer.generateDbConnection("write", "public", (con) => {
                /* sqlQuery example:
                INSERT INTO `project-q`.`reviews` (`object-hash-id`, `review-user`, `review-date`, `review-rating`, `review-text`)                 
                SELECT 'thx', 'Peter','2020-08-25 17:53:37', '5','Test'
                WHERE (SELECT COUNT(*) `count` FROM `reviews` WHERE `object-hash-id` = 'thx' AND `review-user` = 'Peter') = 0; */

                sqlQuery = "INSERT INTO `project-q`.`reviews` (`object-hash-id`, `review-user`, `review-date`, `review-rating`, `review-text`) \
                SELECT " + con.escape(reviewObjectId) + ", " + con.escape(reviewUser) + "," + "'" + currentMysqlDatetime + "', " + 
                con.escape(reviewRating) + "," + con.escape(reviewText) + " \
                WHERE (SELECT COUNT(*) `count` FROM `reviews` WHERE `object-hash-id` = " // Only insert if user hans't already written a review
                + con.escape(reviewObjectId) + " AND `review-user` = " + con.escape(reviewUser) + ") = 0;";

                con.query(sqlQuery, function (err, results) {
                    if (err) {
                        utils.sendNonHtmlOtherError(req, res, 500, "UNHANDELED_DB_ERR");
                        console.log(sqlQuery);
                        console.log(err);
                        return;
                    };

                    if (results.affectedRows == 1) {
                        res.end("{'success': 'true'}");
                    } else if (results.affectedRows == 0) {
                        utils.sendNonHtmlOtherError(req, res, 409, "REVIEW_ALREADY_WRITTEN");
                    }
                });
            });
        });
    } else {
        utils.sendNonHtmlOtherError(req, res, 401, "USER_NOT_AUTHENTICATED");
    }
};

