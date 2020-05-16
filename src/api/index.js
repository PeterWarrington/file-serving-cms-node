const express = require('express')
const app = express()
const port = 80

const variables = {
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
}

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

app.listen(port, () => console.log(`Project #Q server has started at http://localhost:${port}`));