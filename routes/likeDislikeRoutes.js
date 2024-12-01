const handleLikeDislike = require('../controllers/likeDislike');

const likeDislikeRoutes = (req, res) => {
  if (req.method === "POST" && (req.url === "/like" || req.url === "/dislike")) {
    handleLikeDislike(req, res);
  }
};

module.exports = likeDislikeRoutes;
