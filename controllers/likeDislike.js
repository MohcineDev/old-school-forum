const { db } = require("../db/init");

const handleLikeDislike = (req, res) => {
  const table = req.url === "/like" ? "likes" : "dislikes"; // Determine which table to insert into
  const likeDislikePostQuery = `INSERT INTO  ${table}  (user_id, post_id, is_comment) VALUES (?, ?, 0)`; // is_comment = 0 for post
  ///checck if the user already liked the post
  const ifLikedDislikedPost = `SELECT * FROM ${table} WHERE user_id = ? AND post_id = ? AND is_comment = 0`;
  ///remove the like / dislike row if exists
  const removeQuery = `DELETE FROM ${table} WHERE id = ?`

  let body = "";
  req.on("data", (chunk) => (body += chunk));
  req.on("end", () => {
    try {
      const { user_id, post_id } = JSON.parse(body);

      // Insert the like or dislike into the corresponding table
      db.get(ifLikedDislikedPost, [user_id, post_id],
        function (err, row) {
          if (err) {
            console.error("Database Error:", err);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ msg: "Database error" }));
            return;
          } else {
            if (row) {
              ///remove the like
              db.run(removeQuery, [row.id], (err, row) => {
                if (err) {
                  console.error("can't remove the like!!", err)
                  res.writeHead(500, { "Content-Type": "application/json" })
                  res.end(JSON.stringify({ msg: "internal error" }))
                  return
                }
                console.log('like removed');
                res.writeHead(201, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ msg: "like removed" }))
                return
              })
            } else {
              ///no like / dislike found from the user to that post
              db.run(likeDislikePostQuery, [user_id, post_id], (err) => {
                if (err) {
                  console.log("something happend");
                  res.writeHead(500, { "Content-Type": "application/json" })
                  res.end(JSON.stringify({ msg: "db error" }))
                  return
                }
                res.writeHead(201, { "Content-Type": "application/json" });
                res.end(
                  JSON.stringify({ msg: `${table.slice(0, -1)} recorded.` })
                );
              })
            }
          }
        }
      );
    } catch (err) {
      console.error("JSON Parsing Error:", err.message);
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ msg: "Invalid JSON format" }));
    }
  });
};

module.exports = handleLikeDislike;
