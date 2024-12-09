const { db } = require("../db/init");


function getRow(q, data) {

  return new Promise((resolve, reject) => {

  })
}

const handleLikeDislike = (req, res) => {
  const table = req.url === "/like" ? "likes" : "dislikes"; // Determine which table to insert into
  console.log("table :", table);

  const likeDislikePostQuery = `INSERT INTO  ${table}  (user_id, post_id, is_comment) VALUES (?, ?, 0)`; // is_comment = 0 for post
  ///checck if the user already liked the post
  const ifLikedDislikedPost = `SELECT * FROM ${table} WHERE user_id = ? AND post_id = ? AND is_comment = 0`;
  ///remove the like / dislike row if exists
  const removeQuery = `DELETE FROM ${table} WHERE id = ?`
  const removeInvers = `DELETE FROM ${table == 'likes' ? 'dislikes' : 'likes'} WHERE user_id = ? and post_id = ? AND is_comment = 0`

  let body = "";
  req.on("data", (chunk) => (body += chunk));
  req.on("end", async () => {
    try {
      const { user_id, post_id } = JSON.parse(body);

      // Insert the like or dislike into the corresponding table
      const getLikeDislikeRow = (q, data) => {
        return new Promise((resolve, reject) => {
          db.get(q, data, async (err, row) => {
            console.log(q)
            if (err) {
              reject("internal errror: ", err)
            } else {
              resolve(row)
            }
          })
        })
      }

      ///remove like / dislike from likes / dislikes table
      const removeLikeDislike = (q, data) =>
        new Promise((resolve, reject) => {
          db.run(q, data, (err, row) => err ? reject("remove errr: ", err) : resolve(row))
        })

      const likeDislikePost = (q, data) => {
        return new Promise((resolve, reject) => {
          db.run(q, data, (err, row) => {
            err ? reject("db error " + err) : resolve(row)
          })
        })
      }

      let a = await getLikeDislikeRow(ifLikedDislikedPost, [user_id, post_id])

      //the row exists
      if (a) {
        await removeLikeDislike(removeQuery, [a.id])

        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ msg: `${table.slice(0, -1)} removed.` }))
      } else {
        ///row not found in the table like/dislike
        //so add it
        //check if the id exist in the inverse table
        await likeDislikePost(likeDislikePostQuery, [user_id, post_id])
        ///if like ==> remove dislike # :)
        await removeLikeDislike(removeInvers, [user_id, post_id])
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ msg: `${table.slice(0, -1)} recorded.` }))
      }

    } catch (err) {
      console.error("JSON Parsing Error:", err.message);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ msg: "Internal Error" }));
    }
  });
};

module.exports = handleLikeDislike;
/*
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

*/