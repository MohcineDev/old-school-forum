// controllers/post.js

const { db } = require("../db/init");

const createPost = (req, res) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", () => {
    try {
      const { user_id, title, content, categories } = JSON.parse(body); // Expecting 'categories' as an array of category IDs

      // Validate input
      //|| !Array.isArray(categories) || categories.length === 0
      if (!user_id || !title || !content ) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "All fields (title, content) are required" }));
        return;
      }

      // Insert into the posts table
      const postQuery = `INSERT INTO posts (user_id, title, content) VALUES (?, ?, ?)`;
      db.run(postQuery, [user_id, title, content], function (err) {
        if (err) {
          console.error("Database Error:", err);
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Database error while creating post" }));
          return;
        }

        // Get the post ID of the newly created post
        const postId = this.lastID;

        // Now, insert associations into the post_categories table
        const categoryQuery = `INSERT INTO post_categories (post_id, category_id) VALUES (?, ?)`;

        categories.forEach((categoryId) => {
          db.run(categoryQuery, [postId, categoryId], (err) => {
            if (err) {
              console.error("Error inserting category for post:", err);
              res.writeHead(500, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ message: "Error linking categories with post" }));
              return;
            }
          });
        });

        // Respond with success message
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "Post created successfully",
            post_id: postId,
            categories: categories,
          })
        );
      });
    } catch (err) {
      console.error("JSON Parsing Error:", err.message);
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Invalid JSON format" }));
    }
  });
};

module.exports = createPost;
