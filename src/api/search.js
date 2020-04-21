const mysqlQueryer = require(process.cwd() + "/src/api/mysqlQueryer.js");
var elasticsearch = require('elasticsearch');
const en = require("javascript-time-ago/locale/en");
const TimeAgo = require('javascript-time-ago');
const nodeUtil = require('util');
const utils = require(process.cwd() + "/src/api/utils.js");
const getClassNameForExtension = require('font-awesome-filetypes').getClassNameForExtension;
const getRatings = require(process.cwd() + "/src/api/getRatings.js");

var client = new elasticsearch.Client({
  host: 'localhost:9200/objects'
});

exports.main = async (req, res, variables) => {
    var queryStr = req.query.q;

    (async (queryStr) => {
        try {
            const response = await client.search({
                q: queryStr
            });
            return response.hits.hits;
        } catch (error) {
            console.trace(error.message)
        }
    })(queryStr).then(async (elasticResults) => {
        // Now for each result from the search we need to get the full details for each object

        con = mysqlQueryer.generateDbConnection("read", "public", null);
        const query = nodeUtil.promisify(con.query).bind(con);

        var databasePostDataArray = [];
        for (i=0; i < elasticResults.length && i < 50; i++) {
            sqlQuery = "\
            SELECT `object-hash-id`, `object-post-date`, `object-title`, `object-description`, `object-creator-user`, `object-file-extension`, `object-tags` \
            FROM `project-q`.objects \
            WHERE `object-hash-id`=" + con.escape(elasticResults[i]._id) + "\
            "; // Get from db just the current result from the search

            await (async (databasePostDataArray) => {
                const mysqlResults = await query(sqlQuery);
                if (mysqlResults != null) {
                    databasePostDataArray.push(mysqlResults[0]); // Unless something has gone very wrong, there should just be one result.
                    return databasePostDataArray;
                }
            })(databasePostDataArray).then((newArray) => {databasePostDataArray = newArray});
        };

        TimeAgo.addLocale(en);

        if (databasePostDataArray != null) {
            objectDataArray = [];
            for (i=0; i < databasePostDataArray.length; i++) {
                simpleDate = (new TimeAgo("en-GB")).format(Date.parse(databasePostDataArray[i]["object-post-date"])); // Put into x time ago format
                objectDataArray.push({
                    title: databasePostDataArray[i]["object-title"],
                    userName: databasePostDataArray[i]["object-creator-user"],
                    simpleDate: simpleDate,
                    descriptionShort: databasePostDataArray[i]["object-description"],
                    fileExtensionClass: getClassNameForExtension(databasePostDataArray[i]["object-file-extension"]),
                    seeMoreLink: "/post/" + databasePostDataArray[i]["object-hash-id"],
                    downloadLink: "/download/" + databasePostDataArray[i]["object-hash-id"],
                    id: databasePostDataArray[i]["object-hash-id"]
                });
            }

            getRatings.getRoundedRatingsFromObjectArray(objectDataArray, (roundedRatings) => {
                objectIdArray = objectDataArray.map(function(item) { return item["id"]; });

                for (i=0; i < roundedRatings.length; i++) {
                    if (objectIdArray.includes(roundedRatings[i].id)) {
                        objectDataArray[i] = Object.assign(objectDataArray[i], roundedRatings[i]);
                    }
                }

                res.render('search', {
                    pageDetails: {
                        pageTitle: "Search: " + queryStr,
                        pageResDirectory: "search"
                    },
                    basics: variables.basics, 
                    user: variables.user,
                    searchQ: queryStr,
                    generatorData: {
                        maxToGenerate: 50,
                        maxPerRow: 1,
                        postArray: objectDataArray
                    }
                });
            });
        } else {
            return []; // Return blank array to trigger no results found page
        }
    });
};