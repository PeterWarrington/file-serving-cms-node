exports.main = (req,res) => {
    res.render('homepage', {
        pageDetails: {
            pageTitle: "Home",
            pageResDirectory: "homepage"
        },
        basics: {
            name: 'Project #Q', 
            Objectname: '#Q'
        }, 
        user: {
            subjects: [
                {
                    name: "Subject"
                }
        ]},
        posts: {
            popular: [
                {
                    title: "Title",
                    userName: "UserName",
                    simpleDate: "Time ago",
                    descriptionShort: "Shortened description"
                },
                {
                    title: "Title",
                    userName: "UserName",
                    simpleDate: "Time ago",
                    descriptionShort: "Shortened description"
                },
                {
                    title: "Title",
                    userName: "UserName",
                    simpleDate: "Time ago",
                    descriptionShort: "Shortened description"
                },
                {
                    title: "Title",
                    userName: "UserName",
                    simpleDate: "Time ago",
                    descriptionShort: "Shortened description"
                },
                {
                    title: "Title",
                    userName: "UserName",
                    simpleDate: "Time ago",
                    descriptionShort: "Shortened description"
                },
            ]
        }
    });
}