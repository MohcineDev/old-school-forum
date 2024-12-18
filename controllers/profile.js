const { db } = require("../db/init");

const handleProfile = (req, res, id) => {

    const query = `SELECT * FROM users WHERE id = ?`

    db.get(
        query,
        [id],
        (err, user) => {

            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ message: 'Error fetching user details' }))
            } else if (!user) {
                res.writeHead(404, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ message: 'User not found' }))
            }
            else {
                db.get(
                    `SELECT COUNT(*) as posts FROM posts WHERE user_id = ?`,
                    [id],
                    (err, result) => {
                        if (err) {
                            res.writeHead(500, { 'Content-Type': 'application/json' })
                            res.end(JSON.stringify({ message: 'Error fetching post count' }))
                        } else {
                            user.posts = result.posts
                            res.writeHead(200, { 'Content-Type': 'application/json' })
                            res.end(JSON.stringify(user))
                        }
                    }
                )
            }
        }
    )
}

const updateUser = (req, res) => {
    console.log('from contriller')
    let body = "";

    req.on("data", (chunk) => {
        body += chunk;
    });


    query = "UPDATE users SET username = ? WHERE id = ?;"
    const userId = req.url.split("/update/")[1]; // Get post ID from the URL
    console.log(userId);

    req.on("end", () => {
        const { newName } = JSON.parse(body);

        db.serialize(() => {
            db.run(query, [newName, userId], err => {
                if (err) {
                    console.log("error updatting user!!!!")
                    res.writeHead(500, { "Content-Type": "application/json" })
                    res.end(JSON.stringify({ message: "somerginf went wrong!!" }))
                    return
                }
                res.writeHead(200, { "Content-Type": "application/json" })
                res.end(JSON.stringify({ message: "Info Updated Successfully" }))
            })
        })
    })
}
module.exports = { handleProfile, updateUser }