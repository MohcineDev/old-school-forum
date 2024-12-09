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
  db.get(checkPostQuery, [postId], async (err, row) => {
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


    const runQuery = (q, data) => {
      return new Promise((resolve, reject) => {
        db.run(q, data, err => {

          err ? reject("something went wrong", err) : resolve()
        })
      })
    }
    try {
      // Delete associated likes, dislikes, comments, and categories

      await runQuery(deleteLikesQuery, postId)
      await runQuery(deleteDislikesQuery, postId)
      await runQuery(deleteCommentsQuery, postId)
      await runQuery(deletePostCategoriesQuery, postId)
      await runQuery(deletePostQuery, postId)
      // Respond with a success message
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Post deleted successfully" }));

    } catch (err) {
      console.error("Error deleting ...:", err);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ msg: "Error deleting likes" }));
    }
  });
};

module.exports = deletePost;

/*
callback hell
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
*/