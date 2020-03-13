const express = require('express')
const app = express()
const port = 80

app.set('view engine', 'ejs'); // Load pug layout engine
app.set('views', process.cwd() + '/res/templates/'); // Set location of template files

app.get('/*', (req, res) => {
    res.render('homepage', {
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
                }
            ]
        }
    });
});

app.listen(port, () => console.log(`Project #Q server has started on port ${port}!`));