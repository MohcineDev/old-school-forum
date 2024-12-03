const { db } = require("../db/init");
const fs = require("fs");
const path = require('path')

const getPostDetails = (req, res, postId) => {
  console.log("controller : q", postId)
  const query = `
    SELECT posts.id, posts.title, posts.content, posts.created_at, 
           users.username, 
           COUNT(DISTINCT likes.id) AS likes,
           COUNT(DISTINCT dislikes.id) AS dislikes,
           COUNT(DISTINCT comments.id) AS comments
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

    // Fetch the comments for this post
    const commentsQuery = `
      SELECT comments.content, users.username, comments.created_at
      FROM comments
      LEFT JOIN users ON comments.user_id = users.id
      WHERE comments.post_id = ?
    `;

    db.all(commentsQuery, [postId], (err, comments) => {
      if (err) {
        console.error("Error fetching comments:", err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Error fetching comments" }));
        return;
      }

      // Send the HTML with the injected content as the response
      res.writeHead(200, { 'Content-Type': 'application/json' })
      let allData = {
        post: row,
        comment: comments
      }
      res.end(JSON.stringify(allData));
    });
  });
};

module.exports = getPostDetails;
