const mysqlQueryer = require(process.cwd() + "/src/api/mysqlQueryer.js");
const en = require("javascript-time-ago/locale/en");
const TimeAgo = require('javascript-time-ago');

const getClassNameForExtension = require('font-awesome-filetypes').getClassNameForExtension;

exports.main = (req, res, variables) => {
    TimeAgo.addLocale(en);

    popularPostsRaw = mysqlQueryer.getPopularPosts(5, (results) => {
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
    });
}