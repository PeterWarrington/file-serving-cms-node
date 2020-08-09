const utils = require(process.cwd() + "/src/api/utils.js");
const mysqlQueryer = require(process.cwd() + "/src/api/mysqlQueryer.js");

// Returns an array of all the reviews in `reviewId` that the `user` has liked
exports.checkIfUserAlreadyLikedReviews = (user, reviewId) => {
    return new Promise ((resFunction, rejFunction) => {
        mysqlQueryer.generateDbConnection("read", "public", (con) => {
            sqlQuery = "";

            if (Array.isArray(reviewId)) {
                sqlQuery = "SELECT * FROM `project-q`.`review-likes` \
                WHERE `review-id` IN (" + con.escape(reviewId) + ") \
                AND `review-like-user` = " + con.escape(user) + ";";
            } else {
                sqlQuery = "SELECT * FROM `project-q`.`review-likes` \
                WHERE `review-id` = " + con.escape(reviewId) + " \
                AND `review-like-user` = " + con.escape(user) + ";";
            }

            con.query(sqlQuery, function (err, result) {
                if (err) rejFunction(err);

                callbackArray = [];
                for (i=0; i < result.length; i++) {
                    if (result[i]["review-like-type"] != null) {
                        likeType = result[i]["review-like-type"];

                        callbackArray.push({
                            userLikedReview: true,
                            likeType: likeType,
                            reviewLikesId: result[i]["review-likes-id"],
                            reviewId: result[i]["review-id"]
                        });
                    }
                }

                resFunction(callbackArray);
            });
        });
    });
};

// Attempts a review like or dislike on a review ID given the review id and like ammount as a request param
exports.attemptReviewLikeOrDislike = (req, res) => {
    if (req.variables.user.signedIn) {
        var reviewId = req.query.reviewId;
        var likeAmmount = req.query.likeAmmount;
        var username = req.variables.user.name;

        mysqlQueryer.generateDbConnection("write", "public", (con) => {
            // Insert like into table but only if not already liked (where it will update 0 rows)
            sqlQuery = "\
            INSERT INTO `project-q`.`review-likes` (`review-id`, `review-like-type`, `review-like-user`) \
            SELECT " + con.escape(reviewId) + ", " + con.escape(likeAmmount) + ", " + con.escape(username) + " \
            WHERE ( \
                SELECT COUNT(*) \
                FROM `review-likes` \
                WHERE `review-id` = " + con.escape(reviewId) +"  \
                AND `review-like-user` = " + con.escape(username) + " \
            ) = 0;";

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
                    // (Probably) means user has already liked
                    utils.sendNonHtmlOtherError(req, res, 409, "REVIEW_LIKE_CONFLICT");
                }
            });
        });
    } else {
        utils.sendNonHtmlOtherError(req, res, 401, "USER_NOT_AUTHENTICATED");
    }
};

exports.attemptRemoveReviewLikeOrDislike = (req, res) => {
    if (req.variables.user.signedIn) {
        var reviewId = req.query.reviewId;
        var username = req.variables.user.name;

        mysqlQueryer.generateDbConnection("write", "public", (con) => {
            sqlQuery = "\
            DELETE FROM `project-q`.`review-likes` \
            WHERE `review-id` = " + con.escape(reviewId) + "\
            AND `review-like-user` = " + con.escape(username) + ";";

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
                    utils.sendNonHtmlOtherError(req, res, 400, "NO_ROWS_AFFECTED");
                }
            });
        });
    }
};