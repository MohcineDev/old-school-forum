const http = require("http")

const fs = require("fs")
const path = require("path")

const PORT = process.env.PORT || 5000;

// Import the database initialization and the db instance
const { db, initializeDatabase } = require("./db/init")
const authRoutes = require("./routes/authRoutes");
const createPost = require("./controllers/createPost")
const getPosts = require("./controllers/posts")
const categoryRoutes = require("./routes/categoryRoutes");
const likeDislikeRoutes = require("./routes/likeDislikeRoutes");
const getPostDetails = require("./controllers/postDetails");
const deletePost = require("./controllers/handlePostDelete");
const profileRoute = require('./routes/profileRoute');
const updateUser = require("./controllers/updateUser");
const addComment = require("./controllers/addComment");
const interactComment = require('./routes/interactCommentRoutes')
// Initialize the database tables
initializeDatabase()

// Create the server
const server = http.createServer(async (req, res) => {
  const staticFiles = ["css", "js", "imgs", 'components'];
  for (const fileType of staticFiles) {
    const fileRegex = new RegExp(`^\/${fileType}\/(.*)`);
    const match = req.url.match(fileRegex);

    if (match) {
      const filePath = path.join(__dirname, "public", fileType, match[1]);
      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end("File not found");
          return;
        }

        let contentType = "text/plain";
        if (fileType === "css") {
          contentType = "text/css";
        } else if (fileType === "js" || fileType === 'components') {
          contentType = "application/javascript";
        }

        res.writeHead(200, { "Content-Type": contentType });
        res.end(data);
      });
      return;
    }

  }

  if (req.method === "GET" && req.url === "/") {
    const filePath = path.join(__dirname, "public", "index.html")

    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" })
        res.end("Internal Server Error")
        return
      }

      res.writeHead(200, { "Content-Type": "text/html" })
      res.end(data)
    })
  }

  else if (req.method === "GET" && req.url === "/posts") {
    getPosts(req, res)
  }
  //
  ///for single post
  //


  else if (req.url.startsWith("/post/")) {
    const filePath = path.join(__dirname, "public", "post.html")

    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" })
        res.end("Internal Server Error")
        return
      }

      res.writeHead(200, { "Content-Type": "text/html" })
      res.end(data)
    })
  }
  else if (req.method === "GET" && req.url === "/register") {
    const filePath = path.join(__dirname, "public", "register.html")

    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" })
        res.end("Internal Server Error")
        return
      }

      res.writeHead(200, { "Content-Type": "text/html" })
      res.end(data)
    })
  }
  else if (req.method === "GET" && req.url === "/login") {
    const filePath = path.join(__dirname, "public", "login.html")

    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" })
        res.end("Internal Server Error")
        return
      }

      res.writeHead(200, { "Content-Type": "text/html" })
      res.end(data)
    })
  }
  ///
  ////serve profile pega
  ///
  else if (req.method === "GET" && req.url === "/profile") {
    const filePath = path.join(__dirname, "public", "profile.html")
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" })
        res.end("Internal Server Error")
        return
      }

      res.writeHead(200, { "Content-Type": "text/html" })
      res.end(data)
    })
  }
  else if (req.url.startsWith('/user/')) {
    // Handle fetching user profile
    const userId = req.url.split("/user/")[1];

    profileRoute(req, res, userId)
  }

  else if (req.url.startsWith("/register") || req.url.startsWith("/login")) {
    authRoutes(req, res);
  }
  else if (req.method === "POST" && req.url === "/create-post") {
    createPost(req, res) // Call the createPost function
  }
  else if (req.url === "/categories") {
    categoryRoutes(req, res);
  }
  else if (req.url === "/like" || req.url === "/dislike") {
    likeDislikeRoutes(req, res);
  }
  ///req.method === "POST" && 
  else if (req.url.startsWith("/get-post/")) {
    // Extract post ID from the URL
    const postId = req.url.split("/get-post/")[1];

    // Fetch and serve the post details
    getPostDetails(req, res, postId);
  }
  else if (req.method === 'DELETE' && req.url.startsWith("/post_delete")) {
    deletePost(req, res);  // Call the deletePost function
  }
  ///update user
  else if (req.method === 'POST' && req.url.startsWith("/update")) {
    updateUser(req, res);  // 
  }
  ///add comment
  else if (req.method === 'POST' && req.url.startsWith("/add-comment")) {
    addComment(req, res);  // 
  }
  else if (req.method === 'POST' && (req.url.startsWith("/like-comment") || req.url.startsWith("/dislike-comment"))) {
    interactComment(req, res);  // 
  }
  else {
    res.writeHead(404, { "Content-Type": "application/json" })
    res.end(JSON.stringify({ message: "---Endpoint not found" }))
  }
})

// Start the server
server.listen(PORT, "0.0.0.0", () => {
  console.log(`API running on http://localhost:${PORT}`)
})
