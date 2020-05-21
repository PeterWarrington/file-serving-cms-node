const getRatings = require(process.cwd() + "/src/api/getRatings.js");
const ejs = require("ejs");

exports.getHTML = (options, resolutionFunc, rejectionFunc) => {
    getRatings.getReviews(options, (reviews) => {
        if (reviews != null && typeof reviews != 'undefined') {
            reviewData = [];

            if (reviews.length == 0) {
                resolutionFunc(""); // No reviews returned - Send back nothin'
            }

            reviews.forEach(item => {
                if (item.isEnd != true) {
                    reviewData.push({
                        reviewUser: item["review-user"],
                        reviewText: item["review-text"],
                        reviewRating: item["review-rating"],
                        reviewDate: item["review-date"].toISOString().split('T')[0],
                        reviewId: item["review-id"],
                        reviewLikes: item["review-total-likes"]
                    });
                } else {
                    reviewData.push({isEnd: true});
                }
            });

            if (typeof options.beforeDatetime == "undefined") { // We don't have an access time yet
                reviewAccessTime = Math.round(new Date().getTime() / 1000);
            } else {
                reviewAccessTime = options.beforeDatetime.getTime() / 1000;
            }

            ejs.renderFile(process.cwd() + "/res/templates/reviewGenerator.ejs", 
                {
                    reviewData: reviewData, 
                    reviewIDs: reviewData.map(a => a.reviewId),
                    reviewAccessTime: reviewAccessTime
                }, {}, 
                function(err, html){
                    result = {
                        html: html,
                        reviewIDs: reviewData.map(a => a.reviewId),
                    }
                    resolutionFunc(result);
            });
        } else {
            rejectionFunc(new ReferenceError("404"));
        }
    });
};