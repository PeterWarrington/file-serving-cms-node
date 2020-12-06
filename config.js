exports.config = {
    databaseServer: "localhost",
    databasePass: "ch@ngeM3!",
    basics: {
        name: 'Node.JS file serving CMS',
        description: 'Edit this site\'s name, description and other details in /config.js. For more details, see /README.md.',
        Objectname: 'Object'
    },
    google: {
        useGoogleSignIn: true,
        clientId: "447324342102-17birjgedo93hj3b81nhi883mtft4v5q.apps.googleusercontent.com"
    },
    flags: {
        ENABLE_EXPERIMENTAL_REPORT_FEATURE: true // Enables feature allowing reporting of reviews, writes these reports to ./reportLog.JSON
    }
}