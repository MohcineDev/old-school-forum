const likeComment = require('../controllers/likeComment')

function handleCommentInteraction(req, res) {
    if (req.method === 'POST' && req.url.startsWith('/like-comment')) {
        likeComment(req, res)
    }
}

module.exports = handleCommentInteraction;