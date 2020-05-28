const mysqlQueryer = require(process.cwd() + "/src/api/mysqlQueryer.js");

exports.signInGoogleUserWithGoogleUserId = googleUserId => {
    return new Promise ((resFunction, rejFunction) => {
        mysqlQueryer.generateDbConnection("read", "public", (con) => {
            sqlQuery = "SELECT * FROM `project-q`.users WHERE `google-user-id`=" + con.escape(googleUserId) + ";";
            con.query(sqlQuery, function (err, results) {
                if (results != null && !err) {
                    if (results.length == 1) {
                        exports.updateAuthToken(results[0]["user-name"]).then((token, tokenExpiryDate) => {
                            results[0]["user-auth-token"] = token;
                            resFunction(results[0]);
                        });
                    } else {
                        resFunction(null); // Nothing found :-(
                    }
                } else {
                    console.error(err);
                    resFunction(null);
                }
            });
        });
    });
};

exports.signInUserWithToken = (username, token) => {
    return new Promise ((resFunction, rejFunction) => {
        mysqlQueryer.generateDbConnection("read", "public", (con) => {
            sqlQuery = "SELECT * FROM `project-q`.users WHERE `user-name`=" + con.escape(username) + "\
            AND `user-auth-token`='" + token + "' AND `user-auth-token-expiry` > NOW();";

            con.query(sqlQuery, function (err, results) {
                if (results != null && !err) {
                    if (results.length == 1) {
                        resFunction(results[0]);
                    } else {
                        rejFunction(null); // User details not found or incorrect
                    }
                } else {
                    console.error(err);
                    rejFunction(null);
                }
            });
        });
    });
};

exports.updateAuthToken = userName => {
    return new Promise ((resFunction, rejFunction) => {
        require('crypto').randomBytes(48, function(err, buffer) {
            var token = buffer.toString('hex');
            var tokenExpiryDate = new Date();
            tokenExpiryDate.setDate((tokenExpiryDate.getDate() + 7)); // Expires 7 days
            var tokenExpiryDatetime = tokenExpiryDate.toISOString().slice(0, 19).replace('T', ' '); // To mysql datetime

            mysqlQueryer.generateDbConnection("write", "public", (con) => {
                sqlQuery = "UPDATE `project-q`.`users`\
                SET `user-auth-token` = " + con.escape(token) + ",\
                `user-auth-token-expiry` = '" + tokenExpiryDatetime + "'\
                WHERE (`user-name` = " + con.escape(userName) +");";

                con.query(sqlQuery, function (err, results) {
                    if (err) throw err;
                    if (results.affectedRows == 1) {
                        resFunction(token, tokenExpiryDate);
                    } else {
                        rejFunction();
                    }
                });
            });
        });
    });
}

exports.registerUser = (userType, data) => {
    return new Promise ((resFunction, rejFunction) => {
        var registerDetails = {};

        if (userType === "google") {
            registerDetails["user-name"] = data["name"].replace(" ", "_");
            registerDetails["user-email"] = data["email"];
            registerDetails["user-type"] = "google";
            registerDetails["google-user-id"] = data["sub"];
        } else {
            rejFunction();
        }

        if (typeof data["replacement-name"] !== "undefined") {
            registerDetails["user-name"] = data["replacement-name"];
        }

        mysqlQueryer.generateDbConnection("write", "public", (con) => {
            sqlQuery = "INSERT INTO `project-q`.`users` (`" + Object.keys(registerDetails).join("`,`") + "`) VALUES ('" + Object.values(registerDetails).join("','") + "')";

            con.query(sqlQuery, function (err, results) {
                if (err) {
                    if (err.message.indexOf("ER_DUP_ENTRY") != -1) { // Duplicate username
                        data["replacement-name"] = data["name"].replace(" ", "_") + generateRandomCharacters(4);
                        resFunction(exports.registerUser(userType, data));
                    } else {
                        throw err;
                    }
                } else {
                    if (results.affectedRows == 1) {
                        resFunction("here1");
                    } else {
                        rejFunction("here2");
                    }
                }
            });
        });
    });
}

function generateRandomCharacters(length) {
    var result           = '';
    var characters       = '0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

 exports.onPageLoad = (variables, req, res, next) => { // Check if user is authenticated on page load
    req.variables = variables; // Move variables to req

    var username = req.cookies.username;
    var authtoken = req.cookies.authtoken;

    if (typeof username == "undefined" || typeof authtoken == "undefined") {
        req.variables.user.signedIn = false;
        next();
    } else {
        exports.signInUserWithToken(username, authtoken).then((result) => {
            req.variables.user.signedIn = true;
            req.variables.user.name = result["user-name"];
            req.variables.user.email = result["user-email"];

            res.cookie('authtoken', result["user-auth-token"], {expires: result["user-auth-token-date-obj"]});
            next();
        }).catch(() => {
            req.variables.user.signedIn = false;
            next();
        });
    }
  }