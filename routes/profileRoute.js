const handleProfile = require('../controllers/profile')

const profileRoute = (req, res, userId) => {
    if (req.method === "POST" && req.url.startsWith('/user') ) {
        ///
        
        handleProfile(req, res, userId)
    }
}

module.exports = profileRoute
