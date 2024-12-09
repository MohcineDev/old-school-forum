const { db } = require('../db/init')

const interactComment = (req, res, url) => {
    console.log(url)
    const table = url === '/dislike-comment' ? 'dislikes' : 'likes'

    let body = ''
    req.on('data', chunk => body += chunk)

    ///check if alreadt interacted
    //           'INSERT INTO likes (user_id, post_id, comment_id, is_comment) values (?, ?, ?, 1)'
    const query = `INSERT INTO ${table} (user_id, post_id, comment_id, is_comment) VALUES (?, ?, ?, 1)`
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
        db.serialize(() => {

            db.get(`select id from ${table} where user_id=? and post_id= ? and comment_id =? and is_comment = 1`, [userId, postId, commentId], (err, row) => {
                if (err) {
                    console.log('check error')
                    res.writeHead(500, { 'Content-Type': 'application/json' })
                    res.end(JSON.stringify({ msg: 'something happend ', err }))
                    return
                }
                if (row) {
                    res.writeHead(200, { 'Content-Type': 'application/json' })
                    res.end(JSON.stringify({ msg: 'already interacted!!!' }))
                    return
                } else {

                    //insert to like / dislike table
                    db.run(query, [userId, postId, commentId], err => {
                        if (err) {
                            console.log('like comment error!!')
                            res.writeHead(500, { 'Content-Type': 'application/json' })
                            res.end(JSON.stringify({ msg: "internal server error!!" }))
                            return
                        }

                        res.writeHead(200, { 'Content-Type': 'application/json' })
                        res.end(JSON.stringify({ msg: "done successfully!!" }))
                    })

                }
            })

        })
    })


}

module.exports = interactComment;