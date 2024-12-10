const { db } = require('../db/init')

const interactComment = (req, res, url) => {
    console.log(url)
    const table = url === '/dislike-comment' ? 'dislikes' : 'likes'

    let body = ''
    req.on('data', chunk => body += chunk)

    ///check if already interacted
    const checkIfInteracted = `select id from ${table} where user_id = ? and comment_id = ? and is_comment = 1`
    ///remove interaction from the opoosite table // TODO : check if exist before...
    const removeInversInteraction = `DELETE FROM  ${table == 'likes' ? 'dislikes' : 'likes'} WHERE user_id = ? and comment_id = ? and is_comment = 1`
    ///insert like/dislike
    const insertQuery = `INSERT INTO ${table} (user_id, post_id, comment_id, is_comment) VALUES (?, ?, ?, 1)`

    req.on('end', async () => {
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
        // db.serialize(() => {
        const execQuery = (method, q, data, r) =>
            new Promise((resolve, reject) => {
                if (method === "GET") {
                    db.get(q, data, (err, row) => {
                        err ? reject(err+" "+ r) : resolve(row)
                    })
                } else {

                    db.all(q, data, (err, row) => {
                        err ? reject(err+" "+ r) : resolve(row)
                    })
                }
            })

        try {
            const row = await execQuery('GET', checkIfInteracted, [userId, commentId], '000')
            ///if already interacted
            if (row) {
                console.log('hi from row')
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ msg: 'already interacted!!!' }))
                return
                ///if not -- add it to the selected table and remove it from the opposite
            } else {
                await execQuery('RUN', insertQuery, [userId, postId, commentId], '111')
                await execQuery('RUN', removeInversInteraction, [userId, commentId], '222')
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ msg: "done successfully!!" }))
            }
        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ msg: 'sometiiiing از happend '+ err }))

        }
    })
}

module.exports = interactComment;