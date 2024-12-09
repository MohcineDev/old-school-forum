const {db} = require('../db/init')

const likeComment = (req, res) => {
    console.log('likeComment')
    let body = ''
    req.on('data', chunk => body += chunk)

    //           'INSERT INTO likes (user_id, post_id, comment_id, is_comment) values (?, ?, ?, 1)'
    const query =`INSERT INTO likes (user_id, post_id, comment_id, is_comment) VALUES (?, ?, ?, 1)`
    req.on('end', () => {
        // Try-catch for safe JSON parsing
        let parsedBody;
        try {
            parsedBody = JSON.parse(body);
        } catch (err) {
            console.log('Error parsing JSON:', err);
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ msg: "Bad request. Invalid JSON." }));
            return;
        }

        const { userId, postId, commentId } = parsedBody;


        // Basic validation
        if (!userId || !postId || !commentId) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ msg: "Bad request. Missing parameters." }));
            return;
        }


        db.run(query, [userId, postId, commentId], err => {
            console.log(userId, postId, commentId);

            if (err) {
                console.log('like comment error!!')
                res.writeHead(500, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ msg: "internal server error!!" }))
                return
            }

            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ msg: "comment likes  successfully!!" }))
        })
    })


}

module.exports = likeComment;