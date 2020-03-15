const express = require('express')
const app = express()
const port = 80

app.set('view engine', 'ejs'); // Load pug layout engine
app.set('views', process.cwd() + '/res/templates/'); // Set location of template files

app.use(express.static(process.cwd() + '/res/static/')); // Serve static files (e.g: globabl css file)

app.get('/', (req,res) => {
    require(process.cwd() + '/src/api/renderers/homepage.js').main(req,res);
});

app.listen(port, () => console.log(`Project #Q server has started on port ${port}!`));