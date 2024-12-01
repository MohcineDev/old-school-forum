const { db } = require("../db/init");

const handleProfile = (req, res, id) => {

    console.log("userId  : ", id);
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

module.exports = handleProfile