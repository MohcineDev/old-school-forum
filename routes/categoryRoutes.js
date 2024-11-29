const getCategories  = require('../controllers/categories');

const categoryRoutes = (req, res) => {
  if (req.method === "GET" && req.url === "/categories") {
    getCategories(req, res);
  }
};

module.exports = categoryRoutes;
