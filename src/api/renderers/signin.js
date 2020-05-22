const utils = require(process.cwd() + "/src/api/utils.js");
const mysqlQueryer = require(process.cwd() + "/src/api/mysqlQueryer.js");

exports.main = (req, res, variables) => {
    res.render('signin', {
        pageDetails: {
            pageTitle: "Sign in",
            pageResDirectory: "signin"
        },
        basics: variables.basics, 
        user: variables.user,
        google: variables.google
    });
};