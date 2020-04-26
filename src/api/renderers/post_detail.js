const utils = require(process.cwd() + "/src/api/utils.js");
const mysqlQueryer = require(process.cwd() + "/src/api/mysqlQueryer.js");
const getRatings = require(process.cwd() + "/src/api/getRatings.js");
const getClassNameForExtension = require('font-awesome-filetypes').getClassNameForExtension;

function humanFileSize(bytes, si) {
    var thresh = si ? 1000 : 1024;
    if(Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }
    var units = si
        ? ['kB','MB','GB','TB','PB','EB','ZB','YB']
        : ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
    var u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while(Math.abs(bytes) >= thresh && u < units.length - 1);
    return bytes.toFixed(1)+' '+units[u];
} // https://stackoverflow.com/a/14919494

exports.main = (req, res, variables) => {
    objectId = req.params.objectId;
    mysqlQueryer.generateDbConnection("read", "public", (con) => {
        postData = {};

        sqlQuery = "\
        SELECT * FROM `project-q`.objects \
        WHERE `object-hash-id` = " + con.escape(objectId);
        con.query(sqlQuery, function (err, result) {
            if (err) throw err;
            if (result != null) {
                var result = result[0];
                
                var getRatingPromise = new Promise((resolutionFunc, rejectionFunc) => {
                    getRatings.getRating(objectId, (rating) => {
                        if (result != null && typeof result != 'undefined') {
                            postData = {
                                title: result["object-title"],
                                userName: result["object-creator-user"],
                                rawDate: result["object-post-date"].toISOString().split('T')[0],
                                descriptionFull: result["object-description"],
                                previewImages: JSON.parse(result["object-preview-imgs"]),
                                fileName: result["object-file-name"],
                                fileSizeSimple: humanFileSize(result["object-file-size"], true),
                                tags: JSON.parse(result["object-tags"]),
                                fileExtensionClass: getClassNameForExtension(result["object-file-extension"]),
                                objectId: objectId,
                                downloadCount: result["object-download-count"],
                                rating: Number(rating.toFixed(2)), // trims rating to two decimal places then removes trailing zeros
                                roundedRating: getRatings.round_to_precision(rating, 0.5)
                            };

                            resolutionFunc(postData);
                        } else { // Data for ID not found in database
                            rejectionFunc(new ReferenceError("404.1"));
                        }
                    });
                }).then(postData => new Promise((resolutionFunc, rejectionFunc) => {
                    getRatings.getReviews(objectId, (reviews) => {
                        if (result != null && typeof result != 'undefined') {
                            postData.reviewData = [];

                            reviews.forEach(item => {
                                postData.reviewData.push({
                                    reviewUser: item["review-user"],
                                    reviewText: item["review-text"],
                                    reviewRating: item["review-rating"],
                                    reviewDate: item["review-date"].toISOString().split('T')[0]
                                });
                            });

                            resolutionFunc(postData);
                        } else {
                            rejectionFunc(new ReferenceError("404.2"));
                        }
                    });
                })).then(postData => {
                    res.render('post_detail', {
                        pageDetails: {
                            pageTitle: postData.title,
                            pageResDirectory: "null"
                        },
                        basics: variables.basics, 
                        user: variables.user,
                        postData: postData
                    });
                }).catch((err) => {
                    console.log(err);
                    utils.send404(res, variables);
                });
            } else {
                throw new Error("Could not get post detail from db. Result is null.");
            }
        });
    });
};