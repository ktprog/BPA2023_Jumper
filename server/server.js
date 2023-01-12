// Libraries
const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const pQuery = require("./promise-query.js");
const app = express();
const pTokenGen = require("./promise-tokengen.js");

// Website processses
var login_system = require("./routes/login_system.js");
const post_content = require('./routes/post_content.js');
const follow = require('./routes/follow.js');

// Setting up the server
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("../website"));
app.use(cookieParser());
//app.use(cors({origin: 'http://127.0.0.1:5500'}));
app.use(fileUpload());

//Connect database
pQuery.connect();

// Listening + calling processes
d = new Date();
app.listen(5000);
console.log("Server is online - " + d.toLocaleDateString());
login_system(app, pQuery.db(), pQuery, pTokenGen);
post_content(app, pQuery.db(), pQuery);
console.log("Server should now be waiting");