const { db } = require("../db/init");


const addComment = (req, res) => {
    let body = "";

    req.on("data", (chunk) => {
        body += chunk;
    });
    const postQuery = `INSERT INTO comments (user_id, post_id, content) VALUES (?, ?, ?)`;

    req.on("end", () => {
        const { userId, postId, content } = JSON.parse(body);

        db.serialize(() => {
            db.run(postQuery, [userId, postId, content], err => {
                if (err) {
                    console.log("error comment!!!!")
                    res.writeHead(500, { "Content-Type": "application/json" })
                    res.end(JSON.stringify({ message: "somerginf went wrong!!" }))
                    return
                }
                res.writeHead(200, { "Content-Type": "application/json" })
                res.end(JSON.stringify({ message: "comment added Successfully" }))
            })
        })
    })
}


module.exports = addComment