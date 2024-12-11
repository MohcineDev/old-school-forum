const { db } = require('../db/init')


async function getUserPostsCon(req, res) {

    const q = 'select * from posts where user_id = ?'
    const userId = req.url.split('/')[2]
    try {
        const rows = await getPosts(q, userId)

        res.writeHead(200, 'nadi', { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(rows))

    } catch (error) {
        console.log(error)
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end({ msg: 'internal server  errorrrr!' })
    }

}

function getPosts(q, data) {
    return new Promise((resolve, reject) => {
        db.all(q, data, (err, rows) => {
            err ? reject(err) : resolve(rows)
        })
    })
}

module.exports = getUserPostsCon