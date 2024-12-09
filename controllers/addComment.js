const { db } = require("../db/init");


const addComment = (req, res) => {
    let body = "";

    req.on("data", (chunk) => {
        body += chunk;
    });
    const postQuery = `INSERT INTO comments (user_id, post_id, content) VALUES (?, ?, ?)`;

    req.on("end", () => {
        const { userId, postId, content } = JSON.parse(body);

        db.run(postQuery, [userId, postId, content], err => {
            if (err) {
                console.log("comment error !!!!")
                res.writeHead(500, { "Content-Type": "application/json" })
                res.end(JSON.stringify({ mes: "somethin went wrong!!" }))
                return
            }
            res.writeHead(200, { "Content-Type": "application/json" })
            res.end(JSON.stringify({ msg: "comment added Successfully" }))
        })
    })
}


module.exports = addComment