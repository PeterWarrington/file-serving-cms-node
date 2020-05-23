const utils = require(process.cwd() + "/src/api/utils.js");
const mysqlQueryer = require(process.cwd() + "/src/api/mysqlQueryer.js");

exports.main = (req, res) => {
    res.render('signin', {
        pageDetails: {
            pageTitle: "Sign in",
            pageResDirectory: "signin"
        },
        basics: req.variables.basics,
        user: req.variables.user,
        google: req.variables.google
    });
};