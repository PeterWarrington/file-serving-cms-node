const utils = require(process.cwd() + "/src/api/utils.js");
const userUtils = require(process.cwd() + "/src/api/userUtils.js");

exports.main = (req, res) => {
    const CLIENT_ID = req.variables.google.clientId;

    var idToken = req.body.idtoken;

    const {OAuth2Client} = require('google-auth-library');
    const client = new OAuth2Client(CLIENT_ID);

    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: idToken,
            audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        const payload = ticket.getPayload();
        const googleUserId = payload['sub'];
        // If request specified a G Suite domain:
        // const domain = payload['hd'];

       // If we've got this far, the user has been verified!

        userUtils.signInGoogleUserWithGoogleUserId(googleUserId).then(userDetails => {
            if (userDetails !== null) {
                res.end('{"registered": false, \
                            "user": { \
                                "type": "google", \
                                "user-name": "' + userDetails["user-name"] + '", \
                                "auth-token": "' + userDetails["user-auth-token"] + '" \
                                } \
                            }');
            } else {
                userUtils.registerUser("google", payload).then(() => {
                    userUtils.signInGoogleUserWithGoogleUserId(googleUserId).then(userDetails => {
                        res.end('{"registered": true, \
                            "user": { \
                                "type": "google", \
                                "user-name": "' + userDetails["user-name"] + '", \
                                "auth-token": "' + userDetails["user-auth-token"] + '" \
                                } \
                            }');
                    });
                });
            }
        });
    }
    verify().catch((err) => {
        console.log(err);
        utils.send404(req,res);
    });
};