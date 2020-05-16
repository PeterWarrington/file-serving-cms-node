const ratings_selection = require(process.cwd() + "/src/api/reviews_selection.js");
const utils = require(process.cwd() + "/src/api/utils.js");

exports.main = (req, res, variables) => {
    let options = {};

    if (typeof req.query.objectId != "undefined" && req.query.objectId != "") {
        options.objectId = req.query.objectId;
    } else {
        utils.send404(res, variables);
        return;
    }

    if (typeof req.query.accessTime != "undefined" && req.query.accessTime != "") {
        try {
            options.beforeDatetime = new Date(parseInt(req.query.accessTime) * 1000);
        } catch (err) {};
    }

    if (typeof req.query.alreadyDoneReviewIds != "undefined" && req.query.alreadyDoneReviewIds != "") {
        try {
            options.alreadyDoneReviewIds = req.query.alreadyDoneReviewIds.split(",");
        } catch (err) {};
    }

    new Promise ((resolutionFunc, rejectionFunc) => {
        ratings_selection.getHTML(options, resolutionFunc, rejectionFunc)
    }).then(result => {
        res.render('reviewGenerator', {
            reviewHTML: result.html
        });
    });
};