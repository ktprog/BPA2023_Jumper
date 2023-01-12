const { IsResultEmpty } = require('../promise-query.js');

module.exports = function(app, con, pQuery, pTokenGen)
{
    app.post('/api/follow/:username', async (req, res) => {
        try {
            let username = req.params.username;
            let token = req.cookies["token"];
            let user_id;
            let follow_id;

            pQuery.pQuery("SELECT * FROM users WHERE username = ? LIMIT 1", [username])
            .then((result) => { 
                // If user is found, store id, if user is not found respond with an error
                if(!IsResultEmpty(result))
                    follow_id = result[0].id;
                else 
                    res.status(400).end();
            }).catch((error) => {
                console.log(error);
                res.status(500).end();
            });;

            pQuery.pQuery("SELECT * FROM users WHERE token = ? LIMIT 1", [token])
            .then((result) => { 
                // If user is found, store id, if user is not found respond with an error
                if(!IsResultEmpty(result))
                    user_id = result[0].id;
                else 
                    res.status(400).end();
            }).catch((error) => {
                console.log(error);
                res.status(500).end();
            });

            pQuery.pQuery("INSERT INTO follows (user_id, follow_id) VALUES (?,?)", [user_id, follow_id])
            .then((result) => { }).catch((error) => {
                console.log(error);
                res.status(500).end();
            });;

            // Lets front end know they were followed
            res.status(201).end();
        } catch (error) {
            console.log(error)
        }
    });
};