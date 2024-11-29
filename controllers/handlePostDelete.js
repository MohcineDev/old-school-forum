const { db } = require("../db/init");

const deletePost = (req, res) => {
  const postId = req.url.split("/post_delete/")[1]; // Get post ID from the URL

  if (!postId) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Post ID is required" }));
    return;
  }

  // Check if the post exists
  const checkPostQuery = "SELECT id FROM posts WHERE id = ?";
  db.get(checkPostQuery, [postId], (err, row) => {
    if (err) {
      console.error("Database Error:", err);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Database error" }));
      return;
    }

    if (!row) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Post not found" }));
      return;
    }

    // Begin the deletion process by deleting related data first
    const deleteLikesQuery = "DELETE FROM likes WHERE post_id = ?";
    const deleteDislikesQuery = "DELETE FROM dislikes WHERE post_id = ?";
    const deleteCommentsQuery = "DELETE FROM comments WHERE post_id = ?";
    const deletePostCategoriesQuery = "DELETE FROM post_categories WHERE post_id = ?";
    const deletePostQuery = "DELETE FROM posts WHERE id = ?";

    // Delete associated likes, dislikes, comments, and categories
    db.serialize(() => {
      db.run(deleteLikesQuery, [postId], (err) => {
        if (err) {
          console.error("Error deleting likes:", err);
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Error deleting likes" }));
          return;
        }

        db.run(deleteDislikesQuery, [postId], (err) => {
          if (err) {
            console.error("Error deleting dislikes:", err);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Error deleting dislikes" }));
            return;
          }

          db.run(deleteCommentsQuery, [postId], (err) => {
            if (err) {
              console.error("Error deleting comments:", err);
              res.writeHead(500, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ message: "Error deleting comments" }));
              return;
            }

            db.run(deletePostCategoriesQuery, [postId], (err) => {
              if (err) {
                console.error("Error deleting post categories:", err);
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "Error deleting post categories" }));
                return;
              }

              db.run(deletePostQuery, [postId], (err) => {
                if (err) {
                  console.error("Error deleting post:", err);
                  res.writeHead(500, { "Content-Type": "application/json" });
                  res.end(JSON.stringify({ message: "Error deleting post" }));
                  return;
                }

                // Respond with a success message
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "Post deleted successfully" }));
              });
            });
          });
        });
      });
    });
  });
};

module.exports = deletePost;
