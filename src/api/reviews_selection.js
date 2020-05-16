const getRatings = require(process.cwd() + "/src/api/getRatings.js");
const ejs = require("ejs");

exports.getHTML = (options, resolutionFunc, rejectionFunc) => {
    getRatings.getReviews(options, (reviews) => {
        if (reviews != null && typeof reviews != 'undefined') {
            reviewData = [];

            reviews.forEach(item => {
                reviewData.push({
                    reviewUser: item["review-user"],
                    reviewText: item["review-text"],
                    reviewRating: item["review-rating"],
                    reviewDate: item["review-date"].toISOString().split('T')[0],
                    reviewId: item["review-id"]
                });
            });

            ejs.renderFile(process.cwd() + "/res/templates/reviewGenerator.ejs", {reviewData: reviewData}, {}, function(err, html){
                result = {
                    html: html,
                    reviewIDs: reviewData.map(a => a.reviewId) // array of just the reviewId property
                }
                resolutionFunc(result);
            });
        } else {
            rejectionFunc(new ReferenceError("404"));
        }
    });
};