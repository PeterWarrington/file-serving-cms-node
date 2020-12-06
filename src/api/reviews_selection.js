const getRatings = require(process.cwd() + "/src/api/getRatings.js");
const ejs = require("ejs");

const REVIEW_BTN_CLASSES_DEFAULT = "btn btn-outline-secondary btn-sm";
const REVIEW_BTN_CLASSES_SELECTED = "btn btn-secondary btn-sm active";

exports.getHTML = (options, resolutionFunc, rejectionFunc) => {
    getRatings.getReviews(options, (reviews) => {
        if (reviews != null && typeof reviews != 'undefined') {
            reviewData = [];

            if (reviews.length == 0) {
                resolutionFunc(""); // No reviews returned - Send back nothin'
            }

            reviews.forEach(item => {
                if (item.isEnd != true) {
                    if (item["review-total-likes"] == null) {
                        item["review-total-likes"] = 0;
                    }

                    itemReviewData = {
                        reviewUser: item["review-user"],
                        reviewText: item["review-text"],
                        reviewRating: item["review-rating"],
                        reviewDate: item["review-date"].toISOString().split('T')[0],
                        reviewId: item["review-id"],
                        reviewLikes: item["review-total-likes"]
                    };

                    // Options for if user has already liked/disliked a review
                    itemReviewData.reviewBtnClasses = {};
                    switch (item["review-user-like-type"]) {
                        case 1:
                            itemReviewData.reviewBtnClasses.like = REVIEW_BTN_CLASSES_SELECTED;
                            itemReviewData.reviewBtnClasses.dislike = REVIEW_BTN_CLASSES_DEFAULT;
                            break;
                        case -1:
                            itemReviewData.reviewBtnClasses.dislike = REVIEW_BTN_CLASSES_SELECTED;
                            itemReviewData.reviewBtnClasses.like = REVIEW_BTN_CLASSES_DEFAULT;
                            break;
                        default:
                            itemReviewData.reviewBtnClasses.like = REVIEW_BTN_CLASSES_DEFAULT;
                            itemReviewData.reviewBtnClasses.dislike = REVIEW_BTN_CLASSES_DEFAULT;
                            break;
                    }

                    reviewData.push(itemReviewData);
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
                    reviewAccessTime: reviewAccessTime,
                    ...options
                }, {}, 
                function(err, html){
                    result = {};
                    if (err) {
                        console.log(err);
                        result = {
                            html: ["<i>Unable to display reviews due to an error.</i>"],
                            reviewIDs: [""]
                        }
                    } else {
                        result = {
                            html: html,
                            reviewIDs: reviewData.map(a => a.reviewId),
                        }
                    }
                    resolutionFunc(result);
            });
        } else {
            rejectionFunc(new ReferenceError("404"));
        }
    });
};