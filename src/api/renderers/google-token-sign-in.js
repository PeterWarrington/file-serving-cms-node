const utils = require(process.cwd() + "/src/api/utils.js");
const userUtils = require(process.cwd() + "/src/api/userUtils.js");

exports.main = (req, res, variables) => {
    const CLIENT_ID = variables.google.clientId;

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
        const userid = payload['sub'];
        // If request specified a G Suite domain:
        // const domain = payload['hd'];

       // If we've got this far, the user has been verified!

        userUtils.isGoogleUserRegistered(userid).then(isUserRegistered => {
            res.end("User is registered:" + isUserRegistered);
        });
    }
    verify().catch((err) => {
        utils.send404(res, variables);
    });
};