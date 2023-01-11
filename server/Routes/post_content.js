const { IsResultEmpty } = require("../promise-query");
const AdvancedDate = require('../advanced-date.js')
module.exports = function(app, con, pQuery, pTokenGen) 
{
    app.post('/api/post', async (req, res) => {
        try 
        {
            const token = req.cookies['token'];
            let uploadedfile =  req.files.makepost[0];
            let file_name
            let extension;
            let sizelimit;
            let random_name;
            if(uploadedfile !== undefined) // If the poster attaches a file
            {
                file_name = uploadedfile.name;
                extension = file_name.split(".").pop(); 
                sizelimit = getSizeLimit(extension);

                if(sizelimit != -1)
                {
                    pTokenGen.GenerateToken(12).then(buffer => {
                        random_name = buffer;
                    });

                    let path = "../storage/" + random_name + "." + extension;

                    if(uploadedfile.size > sizelimit)
                    {
                        // Let front end know that max size is reached and stop this
                        return;
                    }
                    
                    uploadedfile.mv(path, function(err) { 
                        if (err)
                            console.log(err);
                    });
                }
                else 
                {
                    // Let front end know they attached a non allowed file
                    return;
                }
            }
            else 
            {
                file_name = "none";
                extension = "";
            }

            let user;
            let content = req.body.content.substring(0, 300);
            let priv = req.body.privacy == "everyone";
            let date = new AdvancedDate();
            let postid = 0;
            
            // Check if a valid user is making a post
            pQuery.pQuery("SELECT * FROM users WHERE 'token' = ? LIMIT 1", [token]).then((result) => { 
                if(IsResultEmpty(result))
                {
                    res.send("<h1>Invalid user</h1>");
                } 
                else 
                {
                    user = result.username;
                }
            });

            let sql = "INSERT INTO posts (username, content, time_posted, likes, ribbits, file_name, extension, private) VALUES (?, ?, ?, 0, 0, ?, ?, ?) SELECT SCOPE_IDENTITY() AS id";
            let params = [user, content, date.NowToDatetime(), random_name, extension, priv];
            
            pQuery.pQuery(sql, params).then((result) => { 
                // Get the ID of the last row inserted, which is the insert above
                postid = result.id;
            });

            // Example: jumper.com/Antonio60/20
            res.redirect(`/${user}/${postid}`)
        } 
        catch (error) 
        {
            console.log(error);
        }
    })
    app.get('/:username/:postId', async (req,res) => {
        try {
            let username = req.params.username;
            let id = req.params.postId;
            
            // Edit the html file being sent here and replace text and media and user with the above
        } catch (error) {
            console.log(error)
        }
    });

    const getSizeLimit = (ext) => {
        switch(ext)
        {
            case 'mp3' || 'wav':
                return 10,000,000;
            case 'mp4' || 'mov' || 'webm':
                return 100,000,000;
            case 'png' || 'jpg' || 'jpeg' || 'gif':
                return 5,000,000;
            default: 
                return -1;
        }
    }
};