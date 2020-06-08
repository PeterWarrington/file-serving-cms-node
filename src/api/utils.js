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
    res.end("{'success': 'false', 'errorStatusCode': " + httpCode.toString() +", 'internalErrorCode': '" + errorCode + "'}");
};