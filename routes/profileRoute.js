const handleProfile = require('../controllers/profile')

const profileRoute = (req, res, userId) => {
    //req.method === "POST" && 
    if (req.method === "POST" && req.url.startsWith('/user') ) {
        ///
        console.log("from rouerq");
        
        handleProfile(req, res, userId)
    }
}

module.exports = profileRoute
