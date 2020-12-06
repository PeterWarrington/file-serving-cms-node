const utils = require(process.cwd() + "/src/api/utils.js");
const mysqlQueryer = require(process.cwd() + "/src/api/mysqlQueryer.js");

exports.main = (req, res) => {
    if (req.variables.user.signedIn) {
        // Variables we are gonna use
        reviewId = req.body.reviewId;
        reviewUser = req.variables.user.name;

        utils.ifReviewExists(reviewId, () => {
            // Object does not exist
            utils.sendNonHtmlOtherError(req, res, 400, "REVIEW_DOES_NOT_EXIST");
            return;
        }, (result) => {
            // Object does exist
            // Check that the review creator matches the authenticated user
            if (result[0]["review-user"] == reviewUser) {
                // Is correct user
                mysqlQueryer.generateDbConnection("write", "public", (con) => {
                    sqlQuery = "DELETE FROM `reviews` WHERE `review-id` = " + con.escape(reviewId) + " LIMIT 1;";

                    con.query(sqlQuery, function (err, results) {
                        if (err) throw err;
            
                        if (results.affectedRows >= 1)
                            res.end("{'success': 'true'}");
                        else {
                            utils.sendNonHtmlOtherError(req, res, 401, "NO_ROWS_UPDATED");
                        }
                    });
                });
            } else {
                utils.sendNonHtmlOtherError(req, res, 401, "USER_NO_PERMISSION_DELETE");
            }
        });
    } else {
        utils.sendNonHtmlOtherError(req, res, 401, "USER_NOT_AUTHENTICATED");
    }
};