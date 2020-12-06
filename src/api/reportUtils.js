const utils = require(process.cwd() + "/src/api/utils.js");
const mysqlQueryer = require(process.cwd() + "/src/api/mysqlQueryer.js");
const fs = require('fs');

exports.writeReport = (reportUser, reportSeverity, reportText, reportObject, callback) => { // reportObject.type can be comment or post
    let reportData = {reportUser, reportSeverity, reportText, reportObject, reportTimestamp: Date.now()};

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

    const possibleReportSeverities = ["-1", "0", "1"];
    let reportSeverity;
    if (possibleReportSeverities.includes(req.body.reportSeverity)) {
        reportSeverity = req.body.reportSeverity;
    } else {
        utils.sendNonHtmlOtherError(req, res, 400, "REPORT_INCORRECT_REPORT_SEVERITY");
        return;
    }

    let reportText = !utils.isBlank(req.body.reportText) ? req.body.reportText : "";

    let reportType = "";
    if (req.body.reportObjectType != "review" && req.body.reportObjectType != "post") {
        utils.sendNonHtmlOtherError(req, res, 400, "REPORT_INCORRECT_OBJECT_TYPE");
        return;
    } else {
        reportType = req.body.reportObjectType;
    }

    // Check object exists

    if (utils.isBlank(req.body.reportObjectId)) {
        utils.sendNonHtmlOtherError(req, res, 400, "REPORT_NO_SUCH_OBJECT_ID");
        return;
    }

    let reportObject = {
        "type": req.body.reportObjectType,
        "id": req.body.reportObjectId
    };

    var ifObjectExistsCallback = () => {
        exports.writeReport(reportUser, reportSeverity, reportText, reportObject, (err) => {
            if (err != null) {
                utils.sendNonHtmlOtherError(req, res, 500, "FILE_REPORT_WRITE_ERR");
            } else {
                res.end("{'success': 'true'}");
            }
        });
    };

    var ifObjectNotExistCallback = () => {
        utils.sendNonHtmlOtherError(req, res, 400, "REPORT_NO_SUCH_OBJECT_ID");
    };

    switch (reportObject.type) {
        case "post":
            utils.ifPostExists(req.body.reportObjectId, () => {ifObjectNotExistCallback()}, () => {ifObjectExistsCallback()});
            break;
        case "review":
            utils.ifReviewExists(req.body.reportObjectId, () => {ifObjectNotExistCallback()}, () => {ifObjectExistsCallback()});
            break;
        default:
            ifObjectNotExistCallback();
    }
}