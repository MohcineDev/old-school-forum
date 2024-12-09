const { db } = require("../db/init")

const getPostDetails = async (req, res, postId) => {
  const commentsQuery = `
  SELECT comments.* , users.username
  FROM comments
  LEFT JOIN users ON comments.user_id = users.id
  WHERE comments.post_id = ?
`
  const query = `
SELECT posts.id, posts.user_id, posts.title, posts.content, posts.created_at, 
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
`

  const getCommentLikes = `SELECT comment_id, COUNT(*) AS like_count FROM likes WHERE is_comment = 1
AND post_id = ? GROUP BY comment_id;`
  const getCommentDislikes = `SELECT comment_id, COUNT(*) AS dislike_count FROM dislikes WHERE is_comment = 1
  AND post_id = ? GROUP BY comment_id;`

  let body = ""

  req.on("data", (chunk) => {
    body += chunk
  })

  req.on('end', async () => {
    const { userId } = JSON.parse(body)
    try {
      let liked, disliked = false
      liked = await checkIfLikedPost('likes', userId, postId)
      !liked ? disliked = await checkIfLikedPost('dislikes', userId, postId) : null

      db.get(query, [postId], (err, row) => {
        if (err) {
          console.error("Database Error:", err)
          res.writeHead(500, { "Content-Type": "application/json" })
          res.end(JSON.stringify({ message: "Database error" }))
          return
        }

        if (!row) {
          res.writeHead(404, { "Content-Type": "application/json" })
          res.end(JSON.stringify({ message: "Post not found" }))
          return
        }

        // Fetch the comments for this post
        db.all(commentsQuery, [postId], (err, comments) => {
          if (err) {
            console.error("Error fetching comments:", err)
            res.writeHead(500, { "Content-Type": "application/json" })
            res.end(JSON.stringify({ message: "Error fetching comments" }))
            return
          }
          db.all(getCommentLikes, postId, (err, commnetLikes) => {
            if (err) {
              console.log('retrieve likes error')
              res.writeHead(500, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ msg: 'internal pointer variable' }))
              return
            }

            db.all(getCommentDislikes, postId, (err, commnetDislikes) => {
              if (err) {
                console.log('retrieve dislikes error')
                res.writeHead(500, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ msg: 'internal pointer variable' }))
                return
              }
console.log("commnetDislikes : ", commnetDislikes);


              // Send the HTML with the injected content as the response
              res.writeHead(200, { 'Content-Type': 'application/json' })

              let allData = {
                commnetDislikes,
                commnetLikes,
                liked: liked,
                disliked: disliked,
                post: row,
                comment: comments
              }
              res.end(JSON.stringify(allData))
            })
          })
        })
      })
    } catch (err) {
      console.error("Error fetching comments:", err)
      res.writeHead(500, { "Content-Type": "application/json" })
      res.end(JSON.stringify({ message: "Error fetching comments" }))
    }
  })
}

//just for the style
function checkIfLikedPost(table, userID, pId) {

  let liked = false
  const query = `select id from ${table} where user_id=? and post_id = ? and is_comment = 0`

  return new Promise((resolve, reject) => {
    db.get(query, [userID, pId], (err, row) => {
      // Reject the promise if there's an error
      err ? reject(err) : (console.log("row : ", row), resolve(row ? true : null))

    })
    return liked
  })
}

module.exports = getPostDetails
