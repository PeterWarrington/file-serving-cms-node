const mysqlQueryer = require(process.cwd() + "/src/api/mysqlQueryer.js");

exports.isGoogleUserRegistered = userId => {
    return new Promise ((resFunction, rejFunction) => {
        mysqlQueryer.generateDbConnection("read", "public", (con) => {
            sqlQuery = "SELECT * FROM `project-q`.users WHERE `google-user-id`=" + con.escape(userId) + ";";
            con.query(sqlQuery, function (err, results) {
                if (results != null && !err) {
                    if (results.length == 1) {
                        resFunction(true);
                    } else {
                        resFunction(false);
                    }
                } else {
                    console.error(err);
                    resFunction(false);
                }
            });
        });
    })
};