const { db } = require("../db/init");
const fs = require("fs");
const path = require("path");

const getPostDetails = (req, res, postId) => {
  const query = `
    SELECT posts.id, posts.title, posts.content, posts.created_at, 
           users.username, 
           COUNT(likes.id) AS likes,
           COUNT(dislikes.id) AS dislikes,
           COUNT(comments.id) AS comments
    FROM posts
    LEFT JOIN users ON posts.user_id = users.id
    LEFT JOIN likes ON posts.id = likes.post_id
    LEFT JOIN dislikes ON posts.id = dislikes.post_id
    LEFT JOIN comments ON posts.id = comments.post_id
    WHERE posts.id = ?
    GROUP BY posts.id
  `;

  db.get(query, [postId], (err, row) => {
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

    // Read the post.html template file
    const templatePath = path.join(__dirname, "../public", "post.html");
    fs.readFile(templatePath, "utf8", (err, template) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Error reading template");
        return;
      }
console.log(row.comments);

      // Replace placeholders with actual data
      const filledTemplate = template
        .replaceAll("{{postTitle}}", row.title)
        .replace("{{author}}", row.username)
        .replace("{{createdAt}}", row.created_at)
        .replace("{{likes}}", row.likes)
        .replace("{{dislikes}}", row.dislikes)
        .replace("{{comments}}", row.comments)
        .replace("{{postContent}}", row.content);

      // Send the HTML with the injected content as the response
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(filledTemplate);
    });
  });
};

module.exports = getPostDetails;
