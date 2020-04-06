exports.send404 = (res, variables) => {
    res.status(404);
    res.render('404', {
        pageDetails: {
            pageTitle: "404 - Page not found",
            pageResDirectory: "null"
        },
        basics: variables.basics, 
        user: variables.user
    });
}