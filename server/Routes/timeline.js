const { IsResultEmpty } = require("../promise-query");
const AdvancedDate = require('../advanced-date.js')
module.exports = function(app, con, pQuery, pTokenGen) 
{
    app.get('/api/loadposts', async (req, res) => {
        const token = req.cookies["token"];
        let id;
        let followlist_id;
        let followlist_names;
        let posts;
        let date = new AdvancedDate();
        let startofweek = date.JavascriptToSQLDatetime(date.GetStartOfWeek()); // Gets start of week, and converts it to SQL DateTime

        pQuery.pQuery("SELECT * FROM users WHERE token = ? LIMIT 1", [token])
        .then((result) => { 
            // If user is found, store id, if user is not found respond with an error
            if(!IsResultEmpty(result))
            {
                id = result[0].id;
            }
        }).catch((error) => {
            console.log(error);
            res.status(500).end();
        });

        pQuery.pQuery("SELECT * FROM follows WHERE user_id = ?", [id])
        .then((result) => { 
            // If user is found, store id, if user is not found respond with an error
            if(!IsResultEmpty(result))
            {
                followlist_id = result;
            }
            else 
            {
                followlist_id = [];
            }
        }).catch((error) => {
            console.log(error);
            res.status(500).end();
        });

        pQuery.pQuery("SELECT * FROM posts WHERE user_id IN(?) AND time_posted >= ? AND private != 1", [followlist_id.toString(), startofweek])
        .then((result) => { 
            // If user is found, store id, if user is not found respond with an error
            if(!IsResultEmpty(result))
            {
                for(var i = 0; i < result.length;i++)
                {
                    // (username, user_id, content, time_posted, likes, file_name, extension, private)
                    posts.push(
                    {
                        username: result[i].username, 
                        content: result[i].content, 
                        likes: result[i].likes,
                        file_name: result[i].file_name,
                        ext: result[i].extension
                    });
                }
            }
            else 
            {
                posts = [];
            }
        }).catch((error) => {
            console.log(error);
            res.status(500).end();
        });

        res.send(json(posts));
    });
};