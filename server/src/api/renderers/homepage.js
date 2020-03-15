exports.main = (req, res, variables) => {
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
            postArray: [
                {
                    title: "Title",
                    userName: "UserName",
                    simpleDate: "Time ago",
                    descriptionShort: "Shortened description",
                    seeMoreLink: "#",
                    downloadLink: "#"
                },
                {
                    title: "Title",
                    userName: "UserName",
                    simpleDate: "Time ago",
                    descriptionShort: "Shortened description",
                    seeMoreLink: "#",
                    downloadLink: "#"
                },
                {
                    title: "Title",
                    userName: "UserName",
                    simpleDate: "Time ago",
                    descriptionShort: "Shortened description",
                    seeMoreLink: "#",
                    downloadLink: "#"
                },
                {
                    title: "Title",
                    userName: "UserName",
                    simpleDate: "Time ago",
                    descriptionShort: "Shortened description",
                    seeMoreLink: "#",
                    downloadLink: "#"
                },
                {
                    title: "Title",
                    userName: "UserName",
                    simpleDate: "Time ago",
                    descriptionShort: "Shortened description",
                    seeMoreLink: "#",
                    downloadLink: "#"
                },
            ]
        }
    });
}