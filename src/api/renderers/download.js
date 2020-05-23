const utils = require(process.cwd() + "/src/api/utils.js");
const mysqlQueryer = require(process.cwd() + "/src/api/mysqlQueryer.js");

exports.main = (req, res) => {
    var objectId = req.params.objectId;
    
    mysqlQueryer.generateDbConnection("read", "public", (con) => {
        sqlQuery = "\
        SELECT * FROM `project-q`.`object-blobs` \
        WHERE `object-hash-id` = " + con.escape(objectId); // Query to get blob

        con.query(sqlQuery, function (err, result) {
            if (err) throw err;
            if (result != null) {
                var result = result[0];

                if (typeof result != 'undefined') {
                    var fileBlobResultRaw = result["object-blob"];
                    var fileBuffer = Buffer.from(fileBlobResultRaw, 'binary');
                    res.setHeader('Content-disposition', 'attachment; filename=' + result["object-file-name"]);
                    res.end(fileBuffer);
                } else { // No result has been returned
                    utils.send404(req,res);
                }
            } else {
                throw new Error("Could not get post detail from db. Result is null.");
            }
        });
    });

    mysqlQueryer.generateDbConnection("write", "public", (con) => { // Increment download count
        sqlQuery = "\
        UPDATE `project-q`.`objects` \
        SET `object-download-count` = `object-download-count` + 1 \
        WHERE `object-hash-id` = " + con.escape(objectId); 
        con.query(sqlQuery, function (err, result) {});
    });
};