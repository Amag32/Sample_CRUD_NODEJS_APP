require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

require('./models').connect('mongodb://localhost/api-test');

// Apply middlyware for user input
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }))
app.use(bodyParser.json({ limit: '50mb' }));

global.rootPath = __dirname;
app.use(express.static(path.join(__dirname, 'public')));

const corsOptions = {
    origin: process.env.WHITE_LIST || 'http://0.0.0.0:3000',
    optionsSuccessStatus: 200
}
// Apply routes
let route = require('./routers')
app.use('/', cors(corsOptions), route);

// Start server
app.listen(process.env.PORT || 3500, () => console.log(`Server is running port* ${process.env.PORT || 3500}`));
