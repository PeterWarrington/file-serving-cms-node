const mysqlQueryer = require(process.cwd() + "/src/api/mysqlQueryer.js");
const en = require("javascript-time-ago/locale/en");
const TimeAgo = require('javascript-time-ago');

const getClassNameForExtension = require('font-awesome-filetypes').getClassNameForExtension;

exports.main = (req, res, variables) => {
    TimeAgo.addLocale(en);
    mysqlQueryer.generateDbConnection("read", "public", (con) => {
        sqlQuery = "\
        SELECT `object-hash-id`, `object-post-date`, `object-title`, `object-description`, `object-creator-user`, `object-file-extension`, `object-tags` \
        FROM (SELECT * FROM `project-q`.view_count LIMIT 500) AS InnerTable \
        INNER JOIN objects ON objects.`object-hash-id`=`view-object-hash-id` \
        GROUP BY `view-object-hash-id` ORDER BY COUNT(`view-object-hash-id`) DESC LIMIT 5 \
        "; // I don't even understand how this query works, but it *should* get the most reguarly accessed posts out of the previous 500 accesses
        con.query(sqlQuery, function (err, results) {
            if (err) throw err;
            if (results != null) {
                postArray = [];
                for (i=0; i < results.length; i++) {
                    simpleDate = (new TimeAgo("en-GB")).format(Date.parse(results[i]["object-post-date"])); // Put into x time ago format
                    postArray.push({
                        title: results[i]["object-title"],
                        userName: results[i]["object-creator-user"],
                        simpleDate: simpleDate,
                        descriptionShort: results[i]["object-description"],
                        fileExtensionClass: getClassNameForExtension(results[i]["object-file-extension"]),
                        seeMoreLink: "/post/" + results[i]["object-hash-id"],
                        downloadLink: "/download/" + results[i]["object-hash-id"]
                    });
                }
        
                res.render('homepage', {
                    pageDetails: {
                        pageTitle: "Home",
                        pageResDirectory: "homepage"
                    },
                    basics: variables.basics, 
                    user: variables.user,
                    generatorData: {
                        maxToGenerate: 8,
                        maxPerRow: 2,
                        postArray: postArray
                    }
                });
            } else {
                throw new Error("Could not get popular posts from db");
            }
        });
    });
}