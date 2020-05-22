const mysqlQueryer = require(process.cwd() + "/src/api/mysqlQueryer.js");

exports.signInGoogleUserWithGoogleUserId = googleUserId => {
    return new Promise ((resFunction, rejFunction) => {
        mysqlQueryer.generateDbConnection("read", "public", (con) => {
            sqlQuery = "SELECT * FROM `project-q`.users WHERE `google-user-id`=" + con.escape(googleUserId) + ";";
            con.query(sqlQuery, function (err, results) {
                if (results != null && !err) {
                    if (results.length == 1) {
                        exports.updateAuthToken(results[0]["user-name"]).then(token => {
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

exports.updateAuthToken = userName => {
    return new Promise ((resFunction, rejFunction) => {
        require('crypto').randomBytes(48, function(err, buffer) {
            var token = buffer.toString('hex');
            var tokenExpiry = new Date();
            tokenExpiry.setDate((tokenExpiry.getDate() + 7)); // Expires 7 days
            tokenExpiry = tokenExpiry.toISOString().slice(0, 19).replace('T', ' '); // To mysql datetime

            mysqlQueryer.generateDbConnection("write", "public", (con) => {
                sqlQuery = "UPDATE `project-q`.`users`\
                SET `user-auth-token` = " + con.escape(token) + ",\
                `user-auth-token-expiry` = '" + tokenExpiry + "'\
                WHERE (`user-name` = " + con.escape(userName) +");";

                console.log(sqlQuery);
                con.query(sqlQuery, function (err, results) {
                    if (err) throw err;
                    if (results.affectedRows == 1) {
                        resFunction(token);
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

            console.log(sqlQuery);
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