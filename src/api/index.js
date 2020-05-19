const express = require('express')
const app = express()
const port = 80
const config = require(process.cwd() + "/config.js").config

const variables = {
    user: {
        subjects: [
            {
                name: "Subject"
            }
    ]}, ...config
};

app.set('view engine', 'ejs'); // Load pug layout engine
app.set('views', process.cwd() + '/res/templates/'); // Set location of template files

app.use(express.static(process.cwd() + '/res/static/')); // Serve static files (e.g: globabl css file)

app.get('/', (req,res) => {
    require(process.cwd() + '/src/api/renderers/homepage.js').main(req, res, variables);
});

app.get('/post/:objectId', (req,res) => {
    require(process.cwd() + '/src/api/renderers/post_detail.js').main(req, res, variables);
});

app.get('/download/:objectId', (req,res) => {
    require(process.cwd() + '/src/api/renderers/download.js').main(req, res, variables);
});

app.get('/search/', (req,res) => {
    require(process.cwd() + '/src/api/search.js').main(req, res, variables);
});

app.get('/api/reviews_from_criteria.html', (req,res) => { // e.g: http://localhost/api/reviews_from_criteria.html?objectId=[OBJECT_ID_HERE]&alreadyDoneReviewIds=[COMMA SEPERATED LIST OF IDs]&accessTime=[UNIX TIMESTAMP OF ACCESS OF PAGE]
    require(process.cwd() + '/src/api/renderers/reviews_from_criteria.js').main(req, res, variables);
});

app.listen(port, () => console.log(`Project #Q server has started at http://localhost:${port}`));

process.on('uncaughtException', function(err) { // TODO: Add much better error handling :-q, the user will NOT receive a clean error (ie, will load for ETERNITY), and weird stuff may happen
    console.log('Caught exception: ' + err.stack);
});