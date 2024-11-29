const { db } = require("../db/init");

const handleLikeDislike = (req, res) => {
  let body = "";
  req.on("data", (chunk) => (body += chunk));
  req.on("end", () => {
    try {
      const { user_id, post_id } = JSON.parse(body);
      const table = req.url === "/like" ? "likes" : "dislikes"; // Determine which table to insert into

      // Insert the like or dislike into the corresponding table
      db.run(
        `INSERT INTO ${table} (user_id, post_id) VALUES (?, ?)`,
        [user_id, post_id],
        function (err) {
          if (err) {
            console.error("Database Error:", err);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Database error" }));
            return;
          }
          res.writeHead(201, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({ message: `${table.slice(0, -1)} recorded.` })
          );
        }
      );
    } catch (err) {
      console.error("JSON Parsing Error:", err.message);
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Invalid JSON format" }));
    }
  });
};

module.exports = handleLikeDislike;
