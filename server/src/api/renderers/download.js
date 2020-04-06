const utils = require(process.cwd() + "/src/api/utils.js");
const mysqlQueryer = require(process.cwd() + "/src/api/mysqlQueryer.js");

exports.main = (req, res, variables) => {
    mysqlQueryer.getFileBuffer(req.params.objectId, (result) => {
        if (result != undefined) {
            var fileBlobResultRaw = result["object-blob"];
            var fileBuffer = Buffer.from(fileBlobResultRaw, 'binary');
            res.setHeader('Content-disposition', 'attachment; filename=' + result["object-file-name"]);
            res.end(fileBuffer);
        } else { // No result has been returned
            utils.send404(res, variables);
        }
    });
};