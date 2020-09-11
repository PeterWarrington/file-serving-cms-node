const utils = require(process.cwd() + "/src/api/utils.js");
const mysqlQueryer = require(process.cwd() + "/src/api/mysqlQueryer.js");
const fs = require('fs');

exports.writeReport = (reportUser, reportType, reportSeverity, reportText, reportObject, callback) => { // reportObject.type can be comment or post
    let reportData = {reportUser, reportType, reportSeverity, reportText, reportObject, reportTimestamp: Date.now()};

    let reportJSONToAppendToLog = JSON.stringify(reportData);

    fs.appendFile("reportLog.JSON", reportJSONToAppendToLog, (err) => {
        if (err) { 
            callback(err);
            return;
        } else { 
            callback(null);
        };

        console.log("Report created: " + reportData.reportTimestamp);
    });
}

exports.reportPostRequest = (req, res) => {
    let reportUser = req.variables.user.signedIn ? req.variables.user.name : "ANONYMOUS";
    let reportType = !utils.isBlank(req.body.reportType) ? req.body.reportType : "UNKNOWN"; // "UNKNOWN" if not "review or "post"
    let reportSeverity = !utils.isBlank(req.body.reportSeverity) ? req.body.reportSeverity : "0";
    let reportText = !utils.isBlank(req.body.reportText) ? req.body.reportText : "";

    if (req.body.reportObjectType != "review" && req.body.reportObjectType != "post") {
        utils.sendNonHTMLOtherError(req, res, 400, "REPORT_INCORRECT_OBJECT_TYPE");
        return;
    }

    // Check object exists

    if (utils.isBlank(req.body.reportObjectId)) {
        utils.sendNonHTMLOtherError(req, res, 400, "REPORT_NO_SUCH_OBJECT_ID");
        return;
    }

    let ifObjectExistsCallback = () => {
        let reportObject = {
            "type": req.body.reportObjectType,
            "id": req.body.reportObjectId
        };

        exports.writeReport(reportUser, reportType, reportSeverity, reportText, reportObject, (err) => {
            if (err != null) {
                utils.sendNonHTMLOtherError(req, res, 500, "FILE_REPORT_WRITE_ERR");
            } else {
                res.end("{'success': 'true'}");
            }
        });
    };

    let ifObjectNotExistCallback = () => {
        utils.sendNonHTMLOtherError(req, res, 400, "REPORT_NO_SUCH_OBJECT_ID");
    }

    switch (reportType) {
        case "post":
            utils.ifPostExists(req.body.reportObjectId, ifObjectNotExistCallback, ifObjectExistsCallback);
        case "review":
            utils.ifReviewExists(req.body.reportObjectId, ifObjectNotExistCallback, ifObjectExistsCallback);
        default:
            ifObjectExistsCallback();
    }
}