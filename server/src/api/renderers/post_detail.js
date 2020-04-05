const mysqlQueryer = require(process.cwd() + "/src/api/mysqlQueryer.js");
const getClassNameForExtension = require('font-awesome-filetypes').getClassNameForExtension;

function humanFileSize(bytes, si) {
    var thresh = si ? 1000 : 1024;
    if(Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }
    var units = si
        ? ['kB','MB','GB','TB','PB','EB','ZB','YB']
        : ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
    var u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while(Math.abs(bytes) >= thresh && u < units.length - 1);
    return bytes.toFixed(1)+' '+units[u];
} // https://stackoverflow.com/a/14919494

exports.main = (req, res, variables) => {
    objectId = req.params.objectId;

    mysqlQueryer.getObjectDetails(objectId, (result) => {
        if (result != null && result != undefined) {
            postData = {
                title: result["object-title"],
                userName: result["object-creator-user"],
                rawDate: result["object-post-date"].toISOString().split('T')[0],
                descriptionFull: result["object-description"],
                previewImages: JSON.parse(result["object-preview-imgs"]),
                fileName: result["object-file-name"],
                fileSizeSimple: humanFileSize(result["object-file-size"], true),
                tags: JSON.parse(result["object-tags"]),
                fileExtensionClass: getClassNameForExtension(result["object-file-extension"])
            }
            res.render('post_detail', {
                pageDetails: {
                    pageTitle: postData.title,
                    pageResDirectory: "null"
                },
                basics: variables.basics, 
                user: variables.user,
                postData: postData
            });
        } else {
            res.status(404);
            res.render('404', {
                pageDetails: {
                    pageTitle: "404 - Page not found",
                    pageResDirectory: "null"
                },
                basics: variables.basics, 
                user: variables.user
            });
        }
    });
};