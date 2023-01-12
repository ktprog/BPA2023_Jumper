const { IsResultEmpty } = require('../promise-query.js');

module.exports = function(app, con, pQuery, pTokenGen)
{
    console.log("I got in here - ");
    console.log(__dirname);
    const bcrypt = require('bcrypt');
    const emailValidator = require('deep-email-validator');
    var path = require("path");
    app.get('/home', (req, res) => {
        console.log("ET phone home");
        try {
            const token = req.cookies['token'];
            if(token !== undefined)
            {
                if(token.length == 96)
                {
                    let sql = "SELECT * FROM users WHERE token = ? LIMIT 1";
                    let params = [token];
                    pQuery.pQuery(sql, params)
                    .then((result) => { 
                        if (!IsResultEmpty(result))
                        {
                            // Found a user in the database with this token, redirect to index
                            // This is where you load the website with the user data
                            
                            res.sendFile("index.html", { root: path.resolve("/website/") });
                        }
                        else
                        {
                            // Did not find a user with the token despite having a token cookie
                            console.log("CLEAR!");
                            // tHIS IS BECAUSE THE SQL QUERIE IS NOT FINISHING BEFORE /REGISTER REDIRECTS TO LOGIN, MAKE THE REGISTER SET ROW QUERY INTO A PROMISE QUERIE
                            res.clearCookie("token");
                            res.redirect("/login");
                        }
                    });
                }
                else 
                {
                    res.clearCookie("token");
                    res.redirect("/login");
                }
            }
            else 
            {
                // Cookie was not created
                res.redirect("/register");
            }
        } catch (error) {
            console.log(error);
        }
    });
    
    app.get('/login', (req, res) => {
        try {
            const token = req.cookies['token'];
            if(token !== undefined)
            {
                if(token.length == 96)
                {
                    
                    let sql = "SELECT * FROM users WHERE token = ? LIMIT 1";
                    let params = [token];

                    pQuery.pQuery(sql, params).then((result) => { 
                        if (!IsResultEmpty(result))
                        {
                            // Found a user in the database with this token, redirect to index
                            // Future: Send user info back to server
                            res.redirect("/home");
                        }
                        else
                        {
                            // Did not find a user with the token despite having a token cookie
                            console.log("clear");
                            res.clearCookie("token");
                            res.sendFile("login.html", { root: path.resolve("../website/") });
                        }
                    });
                }
                else  
                {
                    res.clearCookie("token");
                    res.sendFile("login.html", { root: path.resolve("../website/") });
                }
            }
            else {
                res.sendFile("login.html", { root: path.resolve("../website/") });
            }
        } catch (error) {
            console.log(error);
        }
    });
    
    app.get('/register', (req, res) => {
        try {
            const token = req.cookies['token'];
            if(token !== undefined)
            {
                if(token.length == 96)
                {
                    let sql = `SELECT * FROM users WHERE token = ? LIMIT 1`;
                    let params = [token];

                    // We don't need to use a promise query here as theres no code dependant on this query.
                    con.query(sql, params, function (err, result) {
                        if (err) throw err;
                        console.log(result);
                        if (!IsResultEmpty(result))
                        {
                            // Found a user in the database with this token, redirect to index
                            res.redirect("/home");
                            console.log("home");
                        }
                        else
                        {
                            console.log("clear");
                            // Did not find a user with the token despite having a token cookie
                            res.clearCookie("token");
                            res.redirect("/login");
                        }
                    });
                }
                else 
                {
                    res.clearCookie("token");
                    res.redirect("/login");
                }
            }
            else 
            {
                res.sendFile("register.html", { root: path.resolve("../../website/") });
            }
        } catch (error) {
            console.log(error);
        }
    });
    
    
    //res.redirect("http://localhost:5500/server/website/index.html");
    app.post('/login', async (req, res) => {
        try {
            let email = req.body.email;
            let password = req.body.password;
            var storedHash;
            var token;

            let sql = "SELECT * FROM users WHERE email = ? LIMIT 1";
            let params = [email];
            const result = await pQuery.pQuery(sql, params)

            storedHash = result[0].password;
            token = result[0].token;

            console.log(storedHash);
            console.log(password);
            console.log(token);
            const passwordMatch = bcrypt.compare(password, storedHash);
            if(passwordMatch)
            {
                res.cookie('token',token, { maxAge: 31556926000});
                res.redirect("/home");
            }
            else 
            {
                // Front end saying password wrong!!!!!!!!
                res.send("<h1> Wrong password</h1>");
            }
        } catch (error) {
            console.log(error);
        }
    });
    
    app.post('/register', async (req, res) => {
        try {
            // Note, check if  , and email are not in the database
            if(req.cookies['token'] === undefined)
            {
                let found = false;
                let email = req.body.email;
                let password = req.body.password;
                let username = req.body.username;
                let name = req.body.name;

                let sql = "SELECT * FROM users WHERE email = ? LIMIT 1";
                let params = [email];

                await pQuery.pQuery(sql, params).then((result) => { 
                    found = IsResultEmpty(result);
                }).catch((err) => { });

                if(found)
                {
                    // Check if user with the same username already exists
                    let user_found;

                    let sql = "SELECT * FROM users WHERE username = ? LIMIT 1";
                    let params = [username];
                    
                    await pQuery.pQuery(sql, params).then((result) => { 
                        user_found = IsResultEmpty(result);
                    })
                    if(user_found)
                    {
                        const {valid} = await validateEmail(email);
                        if(valid)
                        {
                            if(password.length > 10 && password.length <= 120)
                            {
                                // Generates a random unique token.
                                let token;
        
                                // Hashes the user's password so we don't store the real password
                                let hashed = await bcrypt.hash(password, 10);
        
                                pTokenGen.GenerateToken(48).then(buffer => {
                                    token = buffer;
                                    let sql = 'INSERT INTO users (email,password,username,name,token) VALUES ("?", "?", "?", "?", "?")';
                                    let params = [email, hashed, username, name, token];

                                    pQuery.pQuery(sql, params).then((result) => { });

                                    res.cookie('token',token, { maxAge: 31556926000});
                                    res.redirect("/home");
                                });
                            }
                            else 
                            {
                                // Front end password must be atleast 10 characters miniumum (120 max)!
                                res.send("<h1> Password minium 10 maxium 120</h1>");
                            }
                        }
                        else 
                        {
                            // Front end saying email not valid
                            res.send("<h1>Email is not valid</h1>");
                        }
                    }
                    else
                    {
                        console.log("user found");
                        // Front end saying username already exists
                        res.send("<h1>Username already exists</h1>");
                    }
                }
                else 
                {
                    // Front end saying account exists with email already
                    res.send("<h1>Account with email already exists</h1>");
                }
            }
            else 
            {
                res.redirect("/home");
            }
        } catch (error) {
            console.log(error);
        }
    });
    
    
    async function validateEmail(email) {
        return emailValidator.validate(email)
    }
};