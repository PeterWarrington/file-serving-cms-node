const mysqlQueryer = require(process.cwd() + "/src/api/mysqlQueryer.js");

exports.send404 = (req, res) => {
    res.status(404);
    res.render('error', {
        pageDetails: {
            pageTitle: "404 - Page not found",
            pageResDirectory: "null"
        },
        error: {
            errorTitle: "Error 404: Page not found",
            errorDescription: "The page you have requested could not be found. Try using the search bar or you can try <a href='/'>going home</a>."
        },
        basics: req.variables.basics, 
        user: req.variables.user
    });
}

exports.sendOtherError = (req, res, httpCode, errorMsg) => {
    res.status(httpCode);
    res.render('error', {
        pageDetails: {
            pageTitle: httpCode.toString() + " - " + errorMsg.short,
            pageResDirectory: "null"
        },
        error: {
            errorTitle: "Error " + httpCode.toString() + " - " + errorMsg.short,
            errorDescription: errorMsg.long,
        },
        basics: req.variables.basics, 
        user: req.variables.user
    });
}

exports.sendNonHtmlOtherError = (req, res, httpCode, errorCode) => {
    res.status(httpCode);
    res.end('{"success": "false", "errorStatusCode": ' + httpCode.toString() +', "internalErrorCode": "' + errorCode + '"}');
};

// check if an object exists
exports.ifPostExists = (objectId, falseFunc, trueFunc) => {
    mysqlQueryer.generateDbConnection("read", "public", (con) => {
        sqlQuery = "SELECT `object-hash-id` FROM `objects` WHERE `object-hash-id`=" + con.escape(objectId);

        con.query(sqlQuery, function (err, results) {
            if (err) throw err;

            if (results.length >= 1)
                trueFunc()
            else
                falseFunc();
        });
    });
}

exports.ifReviewExists = (reviewId, falseFunc, trueFunc) => {
    mysqlQueryer.generateDbConnection("read", "public", (con) => {
        sqlQuery = "SELECT `review-id` FROM `reviews` WHERE `review-id`=" + con.escape(reviewId);

        con.query(sqlQuery, function (err, results) {
            if (err) throw err;

            if (results.length >= 1)
                trueFunc()
            else
                falseFunc();
        });
    });
}

exports.isBlank = (object) => {
    return (typeof object == "undefined" || object == "" || object == null);
}