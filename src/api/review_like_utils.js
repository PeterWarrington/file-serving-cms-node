const utils = require(process.cwd() + "/src/api/utils.js");
const mysqlQueryer = require(process.cwd() + "/src/api/mysqlQueryer.js");

exports.main = () => {
    return exports.checkIfUserAlreadyLikedReview("peter", 1);
};

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