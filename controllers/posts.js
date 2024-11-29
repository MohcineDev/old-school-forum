const { db } = require("../db/init");

const getPosts = (req, res) => {
  const query = `
    SELECT posts.id, posts.title, posts.content, posts.user_id, posts.created_at,
           users.username, 
           GROUP_CONCAT(DISTINCT categories.name) AS categories,  -- Use DISTINCT to avoid duplicated categories
           COUNT(DISTINCT likes.id) AS likes,  -- Count unique likes
           COUNT(DISTINCT dislikes.id) AS dislikes,  -- Count unique dislikes
           COUNT(DISTINCT comments.id) AS comments  -- Count unique comments
    FROM posts
    LEFT JOIN users ON posts.user_id = users.id  -- Join posts with users table to get the username
    LEFT JOIN likes ON posts.id = likes.post_id
    LEFT JOIN dislikes ON posts.id = dislikes.post_id
    LEFT JOIN comments ON posts.id = comments.post_id
    LEFT JOIN post_categories ON posts.id = post_categories.post_id  
    LEFT JOIN categories ON post_categories.category_id = categories.id
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
