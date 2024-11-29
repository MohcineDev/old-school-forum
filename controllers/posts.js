const { db } = require("../db/init");

const getPosts = (req, res) => {
  const query = `
    SELECT posts.id, posts.title, posts.content, posts.user_id, posts.created_at,
           users.username, 
           GROUP_CONCAT(categories.name) AS categories,  -- Concatenate category names
           COUNT(likes.id) AS likes,
           COUNT(dislikes.id) AS dislikes,
           COUNT(comments.id) AS comments
    FROM posts
    LEFT JOIN users ON posts.user_id = users.id  -- Join posts with users table to get the username
    LEFT JOIN likes ON posts.id = likes.post_id
    LEFT JOIN dislikes ON posts.id = dislikes.post_id
    LEFT JOIN comments ON posts.id = comments.post_id
    LEFT JOIN post_categories ON posts.id = post_categories.post_id  -- Join with post_categories to link posts to categories
    LEFT JOIN categories ON post_categories.category_id = categories.id  -- Join with categories table to get category names
    GROUP BY posts.id
  `;
  
  db.all(query, (err, rows) => {
    if (err) {
      console.error("Database Error:", err);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Database error" }));
      return;
    }

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(rows)); // Send posts along with author username and categories as JSON
  });
};

module.exports = getPosts;
