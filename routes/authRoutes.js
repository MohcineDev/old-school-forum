const registerUser = require('../controllers/auth/register');
const loginUser = require('../controllers/auth/login');

const authRoutes = (req, res) => {
    if (req.method === "POST" && req.url === "/register") {
        registerUser(req, res);
    } else if (req.method === "POST" && req.url === "/login") {
        loginUser(req, res);
    }
};

module.exports = authRoutes;
