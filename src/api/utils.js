exports.send404 = (res, variables) => {
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
        basics: variables.basics, 
        user: variables.user
    });
}

exports.sendOtherError = (res, variables, httpCode, errorMsg) => {
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
        basics: variables.basics, 
        user: variables.user
    });
}