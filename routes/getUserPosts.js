const getUserPostsCon = require('../controllers/getUserPostsCon')

function getUserPosts(req, res) {
    getUserPostsCon(req, res)
}

module.exports = getUserPosts