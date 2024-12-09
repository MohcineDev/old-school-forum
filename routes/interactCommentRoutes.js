const interactComment = require('../controllers/interactComment')

const handleCommentInteraction = (req, res) => {
    if (req.method === 'POST' && (req.url === '/like-comment' || req.url === '/dislike-comment')) {
        interactComment(req, res, req.url)
    }
}

module.exports = handleCommentInteraction;