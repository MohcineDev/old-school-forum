const { handleProfile, updateUser } = require('../controllers/profile');

const profileRoute = (req, res, userId) => {
    if (req.method === "POST" && req.url.startsWith('/user')) {

        handleProfile(req, res, userId)

    } else if (req.method === 'PUT' && req.url.startsWith("/update")) {
        updateUser(req, res);  // 

    }
}

module.exports = profileRoute
