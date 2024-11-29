const http = require("http")

const fs = require("fs")
const path = require("path")


// Import the database initialization and the db instance
const { db, initializeDatabase } = require("./db/init")
const authRoutes = require("./routes/authRoutes");
const createPost = require("./controllers/createPost")
const getPosts = require("./controllers/posts")
const categoryRoutes = require("./routes/categoryRoutes");
const likeDislikeRoutes = require("./routes/likeDislikeRoutes");
const getPostDetails = require("./controllers/postDetails");
const deletePost = require("./controllers/handlePostDelete");

// Initialize the database tables
initializeDatabase()

// Create the server
const server = http.createServer(async (req, res) => {
  const staticFiles = ["css", "js", "imgs"];
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
        } else if (fileType === "js") {
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
  ///for single post
  else if (req.method === "GET" && req.url.startsWith("/post/")) {
    // Extract post ID from the URL
    const postId = req.url.split("/post/")[1];

    // Fetch and serve the post details
    getPostDetails(req, res, postId);
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
  //auth register
  // else if (req.method === "POST" && req.url === "/register") {
  //   registerUser(req, res) // Use the register logic 
  // }
  // else if (req.method === "POST" && req.url === "/login") {
  //   loginUser(req, res) // Use the login logic
  // }
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
  else if (req.method === 'DELETE' && req.url.startsWith("/post_delete")) {
    deletePost(req, res);  // Call the deletePost function
  }
 
  else {
    res.writeHead(404, { "Content-Type": "application/json" })
    res.end(JSON.stringify({ message: "Endpoint not found" }))
  }
})

// Start the server
const PORT = 5000
server.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`)
})
