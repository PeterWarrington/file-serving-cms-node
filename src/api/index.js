const express = require('express')
const app = express()
const port = 80
const config = require(process.cwd() + "/config.js").config
const userUtils = require(process.cwd() + "/src/api/userUtils.js");
var cookieParser = require('cookie-parser');

var variables = {
    user: {
        tags: [
            {
                name: "GCSE"
            },
            {
                name: "LOTF"
            },
    ]}, 
    ...config
};

app.set('view engine', 'ejs'); // Load ejs layout engine
app.set('views', process.cwd() + '/res/templates/'); // Set location of template files

app.use(express.static(process.cwd() + '/res/static/')); // Serve static files (e.g: globabl css file)

// Check if user is authenticated on page load, add user details to variables
app.use(cookieParser())
app.use((req, res, next) => {
    userUtils.onPageLoad(variables, req, res, next);
});

app.get('/', (req,res) => {
    require(process.cwd() + '/src/api/renderers/homepage.js').main(req, res);
});

app.get('/post/:objectId', (req,res) => {
    require(process.cwd() + '/src/api/renderers/post_detail.js').main(req, res);
});

app.get('/download/:objectId', (req,res) => {
    require(process.cwd() + '/src/api/renderers/download.js').main(req, res);
});

app.get('/search/', (req,res) => {
    require(process.cwd() + '/src/api/search.js').main(req, res);
});

app.get('/signin', (req,res) => {
    require(process.cwd() + '/src/api/renderers/signin.js').main(req, res);
});

app.get('/api/reviews_from_criteria.html', (req,res) => { // e.g: http://localhost/api/reviews_from_criteria.html?objectId=[OBJECT_ID_HERE]&alreadyDoneReviewIds=[COMMA SEPERATED LIST OF IDs]&accessTime=[UNIX TIMESTAMP OF ACCESS OF PAGE]
    require(process.cwd() + '/src/api/renderers/reviews_from_criteria.js').main(req, res);
});

app.use(express.urlencoded({ extended: true }));

app.post('/api/google-token-sign-in', (req,res) => {
    require(process.cwd() + '/src/api/renderers/google-token-sign-in.js').main(req, res);
});

app.listen(port, () => console.log(`Project #Q server has started at http://localhost:${port}`));

process.on('uncaughtException', function(err) { // TODO: Add much better error handling :-q, the user will NOT receive a clean error (ie, will load for ETERNITY), and weird stuff may happen
    console.log('Caught exception: ' + err.stack);
});