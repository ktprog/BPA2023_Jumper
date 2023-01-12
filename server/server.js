// Libraries
const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const pQuery = require("./promise-query.js");
const app = express();
const pTokenGen = require("./promise-tokengen.js");
const PORT = process.env.PORT || 4000;

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
/*
var path = require('path');
var fs = require('fs');
//joining path of directory af
var directoryPath = path.join(__dirname, 'Documents');
directoryPath = "/";
//passsing directoryPath and callback function
fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    //listing all files using forEach
    files.forEach(function (file) {
        // Do whatever you want to do with the file
        console.log(file); 
    });
});
*/


// Listening + calling processes
d = new Date();
app.listen(PORT);
console.log("Server is online - " + d.toLocaleDateString());
login_system(app, pQuery.db(), pQuery, pTokenGen);
post_content(app, pQuery.db(), pQuery);
console.log("Server should now be waiting");